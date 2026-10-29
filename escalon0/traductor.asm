; Janax v0 -> x86-64 translator (escalon 0), Windows.
; Usage: janaxt <program.bin>
; Translates the whole program to native x86-64 before running it, then runs the native code.
; Output and exit codes are identical to the reference interpreter (janax.asm); the tests check both.
;
; Nothing is sized by hand; everything adjusts to the program:
;  - Each Janax instruction takes exactly the bytes it needs, laid out one after the other. A table of
;    offsets links the jumps once everything is laid out.
;  - The Janax registers the program uses most live in native registers; the rest live in the context.
;    The count of native registers is what x86-64 leaves free (16 minus rsp, the context and 3 scratch).
;  - Instructions whose meaning is identical on x86-64 ("a": add, sub, mul, and, or, xor with rd = ra on a
;    native register) become one native instruction; the rest load into rax/rcx, run a template with what
;    x86 does differently, and store the result.
;
; Incremental: translated instructions only use relative addresses and their jump field is linked after
; layout, so the bytes of an unchanged word are reused as they are. <program.bin>.x64 keeps them with the
; translator's own fingerprint and the register map; a different map means every word is translated
; again. stderr reports "traducidas N de M".
;
; While the program runs: rbp = context (spilled registers, data memory base, return stack);
; rax, rcx, rdx = scratch. The generated code never touches rsp; it ends with "ret" and eax = exit code
; (0 = jhalt) into the entry stub, which saves the native registers back into the context.

format PE64 console
entry start

include 'win64a.inc'

MAX_PROGRAM = 1 shl 20          ; bytes; criterion, not a measurement
DATA_SIZE   = 1 shl 20          ; must match the interpreter
RET_DEPTH   = 4096              ; must match the interpreter
OP_COUNT    = 16h
MAX_LEN     = 255               ; bytes per translated instruction: the cache stores lengths in one byte

CACHE_MAGIC = 'JX65'
MAX_PATH_BYTES = 1024
HEADER_SIZE = 32                ; magic, fingerprint, nwords (qword), register map (16 bytes)
NO_JUMP     = 0FFh

DISP = 7FFFFFF0h                ; placeholder that forces 32-bit fields in the templates

; context layout, addressed through rbp
C_MEM   = 16*8                  ; data memory base
C_DEPTH = C_MEM + 8             ; return stack depth
C_RET   = C_DEPTH + 8           ; return stack (native addresses)

section '.data' data readable writeable

  context   dq 16 dup 0         ; Janax registers (the spilled ones live here while running)
            dq 0                ; C_MEM
            dq 0                ; C_DEPTH
            dq RET_DEPTH dup 0  ; C_RET

  program   dq 0
  nwords    dq 0
  work      dq 0                ; translation, before linking
  offs      dq 0                ; offset of each word's code in work (nwords + 1 entries)
  lens      dq 0                ; length of each word's code (bytes)
  joffs     dq 0                ; offset of each word's jump field inside its code, or NO_JUMP
  code      dq 0                ; linked, executable copy
  stub_off  dq 0
  total     dq 0
  datamem   dq 0
  jump_field db 0
  hfile     dq 0
  bytesread dd 0
  written   dd 0
  hexdigits db '0123456789ABCDEF'
  hexbuf    db 16 dup '0', 13, 10

  usage     dq 16 dup 0         ; times each Janax register appears in the program
  jmap      db 16 dup -1        ; native register of each Janax register, -1 = lives in the context

  cachepath db MAX_PATH_BYTES + 8 dup 0
  cache     dq 0                ; whole previous cache file, or 0
  oldwords  dq 0
  oldlens   dq 0
  oldjoffs  dq 0
  oldoffs   dq 0                ; offset of each cached word's code
  oldcode   dq 0
  fingerprint dd 0
  translated dq 0
  msg       db 'traducidas '
  msgnum    db 40 dup 0

  header    dd CACHE_MAGIC, 0
  hwords    dq 0
  hmap      db 16 dup 0
  wbytes    dq 0
  cachesize dq 0

  ; hashed_start..hashed_end feeds the translator fingerprint
  hashed_start:
  ; Native registers free for Janax: rax, rcx, rdx are scratch, rbp is the context, rsp the stack.
  natives   db 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15     ; rbx rsi rdi r8..r15
  NATIVE_COUNT = $ - natives
  ; which register fields each instruction reads or writes: 1 = rd, 2 = ra, 4 = rb
  usage_masks db 0, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 1, 1, 1, 3, 3, 3, 3, 0, 0
  emit_table dq e_halt, e_ldi, e_add, e_sub, e_mul, e_div, e_shl, e_shr
             dq e_sar, e_and, e_or, e_xor, e_jmp, e_jz, e_jnz, e_shi
             dq e_ld, e_st, e_ldb, e_stb, e_call, e_ret
  hashed_end:

STUB_BYTES = NATIVE_COUNT * 7 * 2 + 5 + 1   ; loads, call, saves, ret

section '.text' code readable executable

templates_start:                        ; templates_start..templates_end feeds the translator fingerprint

; ---------------------------------------------------------------- templates
; Bodies for what x86 does differently. Inputs: rax = first operand, rcx = second (or the value to
; store); output in rax. Field offsets are relative to the template start; internal jumps are relative.

macro template name {
  name:
  macro end_template \{
    name#.size = $ - name
  \}
}

template t_halt
        xor     eax, eax
        ret
end_template

template t_div
        test    rcx, rcx
        jz      .by_zero
        cmp     rcx, -1
        je      .by_minus_one
        cqo
        idiv    rcx                     ; truncates toward zero
        jmp     .store
.by_zero:
        xor     eax, eax                ; Janax: x / 0 = 0 (x86 would trap)
        jmp     .store
.by_minus_one:
        neg     rax                     ; MIN / -1 wraps to MIN (x86 would trap)
.store:
end_template

macro memtemplate name, size, align_check, body {
  template name
          add     rax, DISP
          name#.i = $ - 4 - name
          cmp     rax, DATA_SIZE - size
          ja      .out
    if align_check
          test    al, 7
          jnz     .misaligned
    end if
          mov     rdx, [rbp + C_MEM]
          body
          jmp     .done
  .out:
          mov     eax, 5
          ret
  .misaligned:
          mov     eax, 6
          ret
  .done:
  end_template
}

memtemplate t_ld,  8, 1, <mov rax, [rdx + rax]>
memtemplate t_st,  8, 1, <mov [rdx + rax], rcx>
memtemplate t_ldb, 1, 0, <movzx eax, byte [rdx + rax]>
memtemplate t_stb, 1, 0, <mov [rdx + rax], cl>

template t_call
        mov     rdx, [rbp + C_DEPTH]
        cmp     rdx, RET_DEPTH
        jae     .overflow
        db      48h, 8Dh, 05h           ; lea rax, [rip + disp32]: the next instruction, which starts
        dd      t_call.size - ($ + 4 - t_call)  ; right where this one ends
        mov     [rbp + C_RET + rdx*8], rax
        inc     rdx
        mov     [rbp + C_DEPTH], rdx
        db      0E9h
        dd      0
        t_call.j = $ - 4 - t_call
.overflow:
        mov     eax, 7
        ret
end_template

template t_ret
        mov     rdx, [rbp + C_DEPTH]
        test    rdx, rdx
        jz      .empty
        dec     rdx
        mov     [rbp + C_DEPTH], rdx
        mov     rax, [rbp + C_RET + rdx*8]
        jmp     rax
.empty:
        mov     eax, 8
        ret
end_template

template t_bad
        mov     eax, 1
        ret
end_template

template t_outside
        mov     eax, 2
        ret
end_template

; ---------------------------------------------------------------- x86-64 emitter
; All emitters write at rdi and advance it. They may clobber rax, rcx, rdx, rsi, r14, r15 and must keep
; r8 (ra), r9 (imm16 sign-extended), r10 (rb), r11 (rd), r12 (word index), r13 (instruction start).

; r14d = opcode (one or two bytes, first byte low)
emit_opcode:
        mov     eax, r14d
        stosb
        shr     eax, 8
        jz      @f
        stosb
@@:     ret

; op reg, rm with both native: r14d = opcode, ecx = reg, edx = rm
emit_rr:
        mov     al, 48h
        test    cl, 8
        jz      @f
        or      al, 4                   ; REX.R
@@:     test    dl, 8
        jz      @f
        or      al, 1                   ; REX.B
@@:     stosb
        call    emit_opcode
        mov     al, cl
        and     al, 7
        shl     al, 3
        or      al, 0C0h
        mov     ah, dl
        and     ah, 7
        or      al, ah
        stosb
        ret

; op reg, [rbp + j*8]: r14d = opcode, ecx = reg, edx = Janax register j
emit_rm:
        mov     al, 48h
        test    cl, 8
        jz      @f
        or      al, 4                   ; REX.R
@@:     stosb
        call    emit_opcode
        mov     al, cl
        and     al, 7
        shl     al, 3
        or      al, 85h                 ; mod 10, rm 101 (rbp + disp32)
        stosb
        lea     eax, [rdx*8]
        stosd
        ret

; op reg, <Janax register j wherever it lives>: r14d = opcode, ecx = reg, edx = j
emit_rop:
        movsx   eax, byte [jmap + rdx]
        test    eax, eax
        js      emit_rm
        mov     edx, eax
        jmp     emit_rr

load_rax:                               ; rax = Janax register edx
        mov     r14d, 8Bh
        xor     ecx, ecx
        jmp     emit_rop
load_rcx:                               ; rcx = Janax register edx
        mov     r14d, 8Bh
        mov     ecx, 1
        jmp     emit_rop
store_rax:                              ; Janax register edx = rax
        mov     r14d, 89h
        xor     ecx, ecx
        jmp     emit_rop

; rsi = template, ecx = size; r15 = where the copy starts (for patching)
copy_template:
        mov     r15, rdi
        rep     movsb
        ret

; rsi = address of a rel32 jump field: remembered for linking, left at zero until then
mark_jump:
        mov     dword [rsi], 0
        sub     rsi, r13
        mov     eax, esi
        mov     [jump_field], al
        ret

; ---------------------------------------------------------------- one emitter per instruction

e_halt:
        lea     rsi, [t_halt]
        mov     ecx, t_halt.size
        jmp     copy_template

e_ldi:
        movsx   eax, byte [jmap + r11]
        test    eax, eax
        js      .spilled
        mov     cl, al                  ; mov native, imm32 (sign-extended)
        mov     al, 48h
        test    cl, 8
        jz      @f
        or      al, 1
@@:     stosb
        mov     al, 0C7h
        stosb
        mov     al, cl
        and     al, 7
        or      al, 0C0h
        stosb
        mov     eax, r9d
        stosd
        ret
.spilled:
        mov     ax, 0C748h              ; mov qword [rbp + disp32], imm32
        stosw
        mov     al, 85h
        stosb
        lea     eax, [r11*8]
        stosd
        mov     eax, r9d
        stosd
        ret

; "a" instructions: identical meaning on x86-64. opcode = the "op r64, r/m64" form.
macro e_binop name, opcode {
  name:
          cmp     r11d, r8d
          jne     .general
          movsx   eax, byte [jmap + r11]
          test    eax, eax
          js      .general
          mov     r14d, opcode            ; rd = rd op rb: a single native instruction
          mov     ecx, eax
          mov     edx, r10d
          jmp     emit_rop
  .general:
          mov     edx, r8d
          call    load_rax
          mov     r14d, opcode
          xor     ecx, ecx
          mov     edx, r10d
          call    emit_rop
          mov     edx, r11d
          jmp     store_rax
}

e_binop e_add, 03h
e_binop e_sub, 2Bh
e_binop e_mul, 0AF0Fh                   ; imul r64, r/m64: low 64 bits, wraps like Janax
e_binop e_and, 23h
e_binop e_or,  0Bh
e_binop e_xor, 33h

e_div:
        mov     edx, r8d
        call    load_rax
        mov     edx, r10d
        call    load_rcx
        lea     rsi, [t_div]
        mov     ecx, t_div.size
        call    copy_template
        mov     edx, r11d
        jmp     store_rax

; shifts: x86 takes the count in cl and uses its low 6 bits, as Janax
macro e_shift name, modrm {
  name:
          mov     edx, r8d
          call    load_rax
          mov     edx, r10d
          call    load_rcx
          mov     ax, 0D348h              ; 48 D3 /n: shift rax by cl
          stosw
          mov     al, modrm
          stosb
          mov     edx, r11d
          jmp     store_rax
}

e_shift e_shl, 0E0h
e_shift e_shr, 0E8h
e_shift e_sar, 0F8h

e_jmp:
        mov     al, 0E9h
        stosb
        mov     rsi, rdi
        add     rdi, 4
        jmp     mark_jump

macro e_branch name, cc {
  name:
          movsx   eax, byte [jmap + r11]
          test    eax, eax
          js      .spilled
          mov     r14d, 85h               ; test native, native
          mov     ecx, eax
          mov     edx, eax
          call    emit_rr
          jmp     .branch
  .spilled:
          mov     ax, 8348h               ; cmp qword [rbp + disp32], 0
          stosw
          mov     al, 0BDh
          stosb
          lea     eax, [r11*8]
          stosd
          xor     al, al
          stosb
  .branch:
          mov     ax, cc shl 8 + 0Fh      ; jcc rel32
          stosw
          mov     rsi, rdi
          add     rdi, 4
          jmp     mark_jump
}

e_branch e_jz,  84h
e_branch e_jnz, 85h

e_shi:
        mov     edx, r11d
        call    load_rax
        mov     eax, 10E0C148h          ; shl rax, 16
        stosd
        mov     ax, 0D48h               ; or rax, imm32 (imm16 zero-extended)
        stosw
        movzx   eax, r9w
        stosd
        mov     edx, r11d
        jmp     store_rax

macro e_memop name, tmpl, is_load {
  name:
          mov     edx, r8d
          call    load_rax
    if ~ is_load
          mov     edx, r11d
          call    load_rcx
    end if
          lea     rsi, [tmpl]
          mov     ecx, tmpl#.size
          call    copy_template
          mov     [r15 + tmpl#.i], r9d    ; offset
    if is_load
          mov     edx, r11d
          jmp     store_rax
    else
          ret
    end if
}

e_memop e_ld,  t_ld,  1
e_memop e_st,  t_st,  0
e_memop e_ldb, t_ldb, 1
e_memop e_stb, t_stb, 0

e_call:
        lea     rsi, [t_call]
        mov     ecx, t_call.size
        call    copy_template
        lea     rsi, [r15 + t_call.j]
        jmp     mark_jump

e_ret:
        lea     rsi, [t_ret]
        mov     ecx, t_ret.size
        jmp     copy_template

templates_end:

; ---------------------------------------------------------------- translator

start:
        sub     rsp, 8                  ; align the stack to 16 for fastcall

        invoke  GetCommandLineA
        mov     rsi, rax
        cmp     byte [rsi], '"'
        jne     .unquoted_start
        inc     rsi
        jmp     .quoted
.quoted_lap:
        inc     rsi
        cmp     al, '"'
        je      .spaces
.quoted:                                ; while the closing quote has not come
        mov     al, [rsi]
        test    al, al
        jnz     .quoted_lap
        jmp     fail_args
.unquoted_start:
        jmp     .unquoted
.unquoted_lap:
        cmp     al, ' '
        je      .spaces
        inc     rsi
.unquoted:                              ; while the name goes on
        mov     al, [rsi]
        test    al, al
        jnz     .unquoted_lap
        jmp     fail_args
        jmp     .spaces
.spaces_lap:
        inc     rsi
.spaces:
        cmp     byte [rsi], ' '
        je      .spaces_lap
.path:
        cmp     byte [rsi], 0
        je      fail_args

        ; cache path = program path + ".x64"
        xor     ecx, ecx
        jmp     .copy
.copy_lap:
        cmp     ecx, MAX_PATH_BYTES
        jae     fail_args
        mov     [cachepath + rcx], al
        inc     ecx
.copy:
        mov     al, [rsi + rcx]
        test    al, al
        jnz     .copy_lap
.copied:
        mov     dword [cachepath + rcx], '.x64'

        invoke  CreateFileA, rsi, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      fail_file
        mov     [hfile], rax
        invoke  VirtualAlloc, 0, MAX_PROGRAM, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [program], rax
        invoke  ReadFile, [hfile], [program], MAX_PROGRAM, bytesread, 0
        test    eax, eax
        jz      fail_file
        invoke  CloseHandle, [hfile]
        mov     eax, [bytesread]
        shr     eax, 2
        mov     [nwords], rax

        ; data memory, zeroed by the system; j15 starts at its top
        invoke  VirtualAlloc, 0, DATA_SIZE, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [datamem], rax

        ; --- register map: the most used Janax registers get the native registers ---
        xor     r12, r12
        jmp     .count
.count_lap:
        mov     rax, [program]
        mov     eax, [rax + r12*4]
        movzx   ecx, al
        cmp     ecx, OP_COUNT
        jae     .counted
        movzx   edx, byte [usage_masks + rcx]
        mov     ecx, eax
        shr     ecx, 8
        and     ecx, 15
        test    dl, 1
        jz      @f
        inc     qword [usage + rcx*8]   ; rd
@@:     mov     ecx, eax
        shr     ecx, 12
        and     ecx, 15
        test    dl, 2
        jz      @f
        inc     qword [usage + rcx*8]   ; ra
@@:     mov     ecx, eax
        shr     ecx, 16
        and     ecx, 15
        test    dl, 4
        jz      @f
        inc     qword [usage + rcx*8]   ; rb
@@:
.counted:
        inc     r12
.count:
        cmp     r12, [nwords]
        jb      .count_lap
.pick:
        xor     r12d, r12d              ; native register number k
        jmp     .round
.round_lap:
        mov     rbx, -1                 ; best count so far (every register beats it)
        mov     r8d, -1
        xor     ecx, ecx
        jmp     .scan
.scan_lap:
        cmp     byte [jmap + rcx], -1
        jne     .next_reg               ; already has a native register
        mov     rax, [usage + rcx*8]
        cmp     rax, rbx
        jle     .next_reg               ; ties keep the lower register
        mov     rbx, rax
        mov     r8d, ecx
.next_reg:
        inc     ecx
.scan:                                  ; while registers are left to look at
        cmp     ecx, 16
        jb      .scan_lap
        mov     al, [natives + r12]
        mov     [jmap + r8], al
        inc     r12d
.round:
        cmp     r12d, NATIVE_COUNT
        jb      .round_lap
.picked:

        ; translator fingerprint: FNV-1a over the templates, the emitter and its tables
        mov     eax, 811C9DC5h
        lea     rsi, [templates_start]
        lea     rdx, [templates_end]
        call    fnv
        lea     rsi, [hashed_start]
        lea     rdx, [hashed_end]
        call    fnv
        mov     [fingerprint], eax

        ; previous translation, if any, by this same translator and with this same register map
        invoke  CreateFileA, cachepath, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      .no_cache
        mov     [hfile], rax
        invoke  GetFileSize, [hfile], 0
        mov     eax, eax
        mov     [cachesize], rax
        cmp     rax, HEADER_SIZE
        jb      .close_cache
        invoke  VirtualAlloc, 0, [cachesize], MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .close_cache
        mov     [cache], rax
        invoke  ReadFile, [hfile], [cache], [cachesize], bytesread, 0
.close_cache:
        invoke  CloseHandle, [hfile]
        mov     rdx, [cache]
        test    rdx, rdx
        jz      .no_cache
        cmp     dword [rdx], CACHE_MAGIC
        jne     .bad_cache
        mov     eax, [fingerprint]
        cmp     eax, [rdx + 4]
        jne     .bad_cache
        mov     rax, [rdx + 16]         ; register map
        cmp     rax, qword [jmap]
        jne     .bad_cache
        mov     rax, [rdx + 24]
        cmp     rax, qword [jmap + 8]
        jne     .bad_cache
        mov     rcx, [rdx + 8]          ; words in the cache
        cmp     rcx, MAX_PROGRAM / 4
        ja      .bad_cache
        mov     [oldwords], rcx
        lea     rax, [rcx*4 + HEADER_SIZE]
        add     rax, rcx
        add     rax, rcx                ; header, words, lengths, jump fields
        mov     r8d, [bytesread]
        cmp     rax, r8
        ja      .bad_cache
        lea     rsi, [rdx + HEADER_SIZE + rcx*4]
        mov     [oldlens], rsi
        add     rsi, rcx
        mov     [oldjoffs], rsi
        add     rsi, rcx
        mov     [oldcode], rsi
        lea     rdx, [rcx*8 + 8]
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .bad_cache
        mov     [oldoffs], rax
        xor     ecx, ecx                ; offsets = running sum of the lengths
        xor     edx, edx
        mov     rsi, [oldlens]
        jmp     .sum
.sum_lap:
        mov     [rax + rcx*8], rdx
        movzx   r8d, byte [rsi + rcx]
        add     rdx, r8
        inc     rcx
.sum:
        cmp     rcx, [oldwords]
        jb      .sum_lap
.summed:
        mov     rax, [oldcode]
        sub     rax, [cache]
        add     rax, rdx                ; the file must end exactly after the last word's code
        mov     r8d, [bytesread]
        cmp     rax, r8
        jne     .bad_cache
        jmp     .no_cache
.bad_cache:
        mov     qword [cache], 0
.no_cache:

        ; --- buffers: translation before linking, offsets, lengths, jump fields ---
        mov     rdx, [nwords]
        imul    rdx, MAX_LEN
        add     rdx, t_outside.size + STUB_BYTES
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [work], rax
        mov     rdx, [nwords]
        lea     rdx, [rdx*8 + 8]
        mov     rax, [nwords]
        lea     rdx, [rdx + rax*2]
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [offs], rax
        mov     rcx, [nwords]
        lea     rax, [rax + rcx*8 + 8]
        mov     [lens], rax
        add     rax, rcx
        mov     [joffs], rax

        ; --- translate, one word after the other ---
        mov     rdi, [work]
        xor     r12, r12                ; word index
        jmp     .word
.word_lap:
        mov     r13, rdi                ; this word's code starts here
        mov     rax, rdi
        sub     rax, [work]
        mov     rdx, [offs]
        mov     [rdx + r12*8], rax

        ; reuse the cached code when the word did not change
        mov     rdx, [cache]
        test    rdx, rdx
        jz      .fresh
        cmp     r12, [oldwords]
        jae     .fresh
        mov     rax, [program]
        mov     eax, [rax + r12*4]
        cmp     eax, [rdx + HEADER_SIZE + r12*4]
        jne     .fresh
        mov     rsi, [oldoffs]
        mov     rsi, [rsi + r12*8]
        add     rsi, [oldcode]
        mov     rax, [oldlens]
        movzx   ecx, byte [rax + r12]
        rep     movsb
        mov     rax, [oldjoffs]
        mov     al, [rax + r12]
        mov     [jump_field], al
        jmp     .emitted
.fresh:
        inc     qword [translated]
        mov     byte [jump_field], NO_JUMP
        mov     rax, [program]
        mov     eax, [rax + r12*4]
        movzx   ecx, al                 ; op
        mov     r11d, eax
        shr     r11d, 8
        and     r11d, 15                ; rd
        mov     r8d, eax
        shr     r8d, 12
        and     r8d, 15                 ; ra
        mov     r9d, eax
        shr     r9d, 16
        mov     r10d, r9d
        and     r10d, 15                ; rb
        movsx   r9, r9w                 ; imm16 sign-extended
        cmp     ecx, OP_COUNT
        jae     .bad
        call    qword [emit_table + rcx*8]
        jmp     .emitted
.bad:
        lea     rsi, [t_bad]
        mov     ecx, t_bad.size
        rep     movsb
.emitted:
        mov     rax, rdi
        sub     rax, r13
        cmp     rax, MAX_LEN
        ja      fail_block
        mov     rdx, [lens]
        mov     [rdx + r12], al
        mov     al, [jump_field]
        mov     rdx, [joffs]
        mov     [rdx + r12], al
        inc     r12
.word:
        cmp     r12, [nwords]
        jb      .word_lap
.last:
        ; the "outside the program" exit, then the entry stub
        mov     rax, rdi
        sub     rax, [work]
        mov     rdx, [offs]
        mov     rcx, [nwords]
        mov     [rdx + rcx*8], rax
        lea     rsi, [t_outside]
        mov     ecx, t_outside.size
        rep     movsb
        mov     rax, rdi
        sub     rax, [work]
        mov     [stub_off], rax
        mov     r14d, 8Bh               ; load the native registers
        call    emit_all_registers
        mov     al, 0E8h                ; call the first word
        stosb
        mov     rax, [work]
        lea     rdx, [rdi + 4]
        sub     rax, rdx
        stosd
        mov     r14d, 89h               ; save them back
        call    emit_all_registers
        mov     al, 0C3h                ; ret, eax = exit code
        stosb
        mov     rax, rdi
        sub     rax, [work]
        mov     [total], rax

        ; --- link: an executable copy of exactly the translated size, with every jump resolved ---
        invoke  VirtualAlloc, 0, [total], MEM_COMMIT + MEM_RESERVE, PAGE_EXECUTE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [code], rax
        mov     rdi, rax
        mov     rsi, [work]
        mov     rcx, [total]
        rep     movsb
        xor     r12, r12
        jmp     .link
.link_lap:
        mov     rax, [joffs]
        movzx   ecx, byte [rax + r12]
        cmp     ecx, NO_JUMP
        je      .next_link
        mov     rax, [offs]
        mov     rsi, [rax + r12*8]
        add     rsi, rcx
        add     rsi, [code]             ; the jump field
        mov     rax, [program]
        movsx   rax, word [rax + r12*4 + 2]
        lea     rax, [rax + r12 + 1]    ; target word, signed
        test    rax, rax
        js      .outside
        cmp     rax, [nwords]
        jbe     .inside
.outside:
        mov     rax, [nwords]
.inside:
        mov     rdx, [offs]
        mov     rax, [rdx + rax*8]
        add     rax, [code]
        lea     rdx, [rsi + 4]
        sub     rax, rdx
        mov     [rsi], eax
.next_link:
        inc     r12
.link:
        cmp     r12, [nwords]
        jb      .link_lap
.linked:

        ; --- keep this translation for the next run (a failure here only costs speed) ---
        cmp     qword [cache], 0
        je      .save
        cmp     qword [translated], 0
        jne     .save
        mov     rax, [oldwords]
        cmp     rax, [nwords]
        je      .report                 ; nothing changed: the cache on disk is already this translation
.save:
        invoke  CreateFileA, cachepath, GENERIC_WRITE, 0, 0, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      .report
        mov     [hfile], rax
        mov     eax, [fingerprint]
        mov     [header + 4], eax
        mov     rax, [nwords]
        mov     [hwords], rax
        mov     rax, qword [jmap]
        mov     qword [hmap], rax
        mov     rax, qword [jmap + 8]
        mov     qword [hmap + 8], rax
        invoke  WriteFile, [hfile], header, HEADER_SIZE, written, 0
        mov     rax, [nwords]
        shl     rax, 2
        mov     [wbytes], rax
        invoke  WriteFile, [hfile], [program], [wbytes], written, 0
        mov     rax, [nwords]
        mov     [wbytes], rax
        invoke  WriteFile, [hfile], [lens], [wbytes], written, 0
        invoke  WriteFile, [hfile], [joffs], [wbytes], written, 0
        mov     rax, [offs]                ; the words' code, unlinked
        mov     rcx, [nwords]
        mov     rax, [rax + rcx*8]
        mov     [wbytes], rax
        invoke  WriteFile, [hfile], [work], [wbytes], written, 0
        invoke  CloseHandle, [hfile]

        ; --- "traducidas N de M" on stderr ---
.report:
        lea     rdi, [msgnum]
        mov     rax, [translated]
        call    put_decimal
        mov     dword [rdi], ' de '
        add     rdi, 4
        mov     rax, [nwords]
        call    put_decimal
        mov     word [rdi], 0A0Dh
        add     rdi, 2
        lea     rax, [msg]
        sub     rdi, rax
        mov     [wbytes], rdi
        invoke  GetStdHandle, STD_ERROR_HANDLE
        invoke  WriteFile, rax, msg, [wbytes], written, 0

        ; --- run the native code ---
        mov     rax, [datamem]
        mov     [context + C_MEM], rax
        mov     qword [context + 15*8], DATA_SIZE
        lea     rbp, [context]
        mov     rax, [code]
        add     rax, [stub_off]
        call    rax
        test    eax, eax
        jnz     fail_code

        mov     rax, [context]
        lea     rdi, [hexbuf + 15]
        mov     ecx, 16
        jmp     .digit
.digit_lap:
        mov     edx, eax
        and     edx, 15
        mov     dl, [hexdigits + rdx]
        mov     [rdi], dl
        dec     rdi
        shr     rax, 4
        dec     ecx
.digit:                                 ; while hex digits are left
        test    ecx, ecx
        jnz     .digit_lap
        invoke  GetStdHandle, STD_OUTPUT_HANDLE
        invoke  WriteFile, rax, hexbuf, 18, written, 0
        invoke  ExitProcess, 0

; For every Janax register on a native register: r14d = 8Bh loads it from the context, 89h saves it.
emit_all_registers:
        xor     r12d, r12d
        jmp     .one
.one_lap:
        movsx   ecx, byte [jmap + r12]
        test    ecx, ecx
        js      .skip
        mov     edx, r12d
        call    emit_rm
.skip:
        inc     r12d
.one:                                   ; while registers are left
        cmp     r12d, 16
        jb      .one_lap
        ret

; FNV-1a: eax = hash so far, bytes [rsi, rdx); returns the hash in eax.
fnv:
        jmp     .byte
.byte_lap:
        movzx   ecx, byte [rsi]
        xor     eax, ecx
        imul    eax, eax, 01000193h
        inc     rsi
.byte:                                  ; while bytes are left
        cmp     rsi, rdx
        jb      .byte_lap
        ret

; Writes rax in decimal at rdi; leaves rdi just past the last digit.
put_decimal:
        mov     ecx, 10
        xor     r8d, r8d
        jmp     .divide
.divide_lap:
.divide:                                ; while digits are left after taking one (0 still has one)
        xor     edx, edx
        div     rcx
        add     dl, '0'
        push    rdx
        inc     r8d
        test    rax, rax
        jnz     .divide_lap
        jmp     .emit
.emit_lap:
        pop     rax
        mov     [rdi], al
        inc     rdi
        dec     r8d
.emit:                                  ; while digits are left to write
        test    r8d, r8d
        jnz     .emit_lap
        ret

fail_code:
        invoke  ExitProcess, rax
fail_file:
        invoke  ExitProcess, 3
fail_args:
        invoke  ExitProcess, 4
fail_block:
        invoke  ExitProcess, 9          ; translator bug: an instruction outgrew MAX_LEN

section '.idata' import data readable writeable

  library kernel32, 'KERNEL32.DLL'

  import kernel32,\
         GetCommandLineA, 'GetCommandLineA',\
         CreateFileA, 'CreateFileA',\
         ReadFile, 'ReadFile',\
         CloseHandle, 'CloseHandle',\
         VirtualAlloc, 'VirtualAlloc',\
         GetFileSize, 'GetFileSize',\
         GetStdHandle, 'GetStdHandle',\
         WriteFile, 'WriteFile',\
         ExitProcess, 'ExitProcess'
