; Janax v0 -> x86-64 translator (escalon 0), Windows.
; Usage: janaxt <program.bin>
; Translates the whole program to native x86-64 before running it, then runs the native code.
; Output and exit codes are identical to the reference interpreter (janax.asm); the tests check both.
;
; Every Janax word becomes a fixed-size native block (BLOCK bytes), so block i lives at code + i*BLOCK and
; jumps need no address map. Block nwords is the "outside the program" exit.
;
; Janax registers live in native registers (jmap); the ones that do not fit live in the context.
; Instructions whose meaning is identical on x86-64 ("a": add, sub, mul, and, or, xor with rd = ra on a
; native register) become one native instruction. The rest load their operands into rax/rcx, run a
; template that adds what x86 does differently, and store the result.
;
; Incremental: blocks only use relative addresses, so a block translated once is valid at any address.
; The translation is kept in <program.bin>.x64 with the translator's own fingerprint; the next run copies
; the blocks of unchanged words and translates only the words that differ (plus jumps, if the program
; length changed, because jumps past the end point at the outside block). stderr reports
; "traducidas N de M".
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
BLOCK       = 64                ; bytes per native block; checked on every emitted block
STUB_SPACE  = 256               ; entry stub after the outside block

CACHE_MAGIC = 'JX64'
MAX_PATH_BYTES = 1024
HEADER_SIZE = 16                ; magic, fingerprint, nwords (qword)

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
  code      dq 0
  entry_stub dq 0
  datamem   dq 0
  hfile     dq 0
  bytesread dd 0
  written   dd 0
  hexdigits db '0123456789ABCDEF'
  hexbuf    db 16 dup '0', 13, 10

  cachepath db MAX_PATH_BYTES + 8 dup 0
  cache     dq 0                ; whole previous cache file, or 0
  oldwords  dq 0                ; word count in the cache (valid only if cache <> 0)
  fingerprint dd 0
  translated dq 0
  msg       db 'traducidas '
  msgnum    db 40 dup 0

  header    dd CACHE_MAGIC, 0
  hwords    dq 0
  wbytes    dq 0
  cachesize dq 0

  ; jmap..jmap_end feeds the translator fingerprint
  ; Native register of each Janax register, -1 = lives in the context. rax, rcx, rdx are scratch,
  ; rbp is the context, rsp is the native stack: 11 native registers remain. j15 (the data stack
  ; pointer) gets one because every push and pop uses it; j10..j14 are spilled (criterion).
  jmap      db 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, -1, -1, -1, -1, -1, 15
  ;            rbx rsi rdi r8 r9 r10 r11 r12 r13 r14                   r15

  emit_table dq e_halt, e_ldi, e_add, e_sub, e_mul, e_div, e_shl, e_shr
             dq e_sar, e_and, e_or, e_xor, e_jmp, e_jz, e_jnz, e_shi
             dq e_ld, e_st, e_ldb, e_stb, e_call, e_ret
  jmap_end:

section '.text' code readable executable

templates_start:                        ; templates_start..templates_end feeds the translator fingerprint

; ---------------------------------------------------------------- templates
; Bodies for what x86 does differently. Inputs: rax = first operand, rcx = second (or the value to
; store); output in rax. Field offsets are relative to the template start; internal jumps are relative.

macro template name {
  name:
  macro end_template \{
    name#.size = $ - name
    assert name#.size <= BLOCK - 2
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

template t_call                         ; always copied at the block start
        mov     rdx, [rbp + C_DEPTH]
        cmp     rdx, RET_DEPTH
        jae     .overflow
        db      48h, 8Dh, 05h           ; lea rax, [rip + disp32]: the next block, position-independent
        dd      BLOCK - ($ + 4 - t_call)
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
; r8 (ra), r9 (imm16 sign-extended), r10 (rb), r11 (rd), r12 (word index), r13 (block start).

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

; rsi = address of a rel32 field: points it at the target block of this jump (or the outside block)
write_rel_to_target:
        lea     rax, [r12 + 1]
        add     rax, r9                 ; target word, signed
        js      .outside
        cmp     rax, [nwords]
        jbe     .inside
.outside:
        mov     rax, [nwords]
.inside:
        imul    rax, BLOCK
        add     rax, [code]
        lea     rdx, [rsi + 4]
        sub     rax, rdx
        mov     [rsi], eax
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
        jmp     write_rel_to_target

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
          jmp     write_rel_to_target
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
        jmp     write_rel_to_target

e_ret:
        lea     rsi, [t_ret]
        mov     ecx, t_ret.size
        jmp     copy_template

; After a block emitted at r13, rdi points just past it: a short jump there skips the padding and
; lands on the next block, so execution never walks through filler bytes.
jump_over_padding:
        lea     rdx, [r13 + BLOCK]
        sub     rdx, rdi
        sub     rdx, 2                  ; rel8 counts from the end of the jump
        mov     byte [rdi], 0EBh
        mov     [rdi + 1], dl
        ret

templates_end:

; ---------------------------------------------------------------- translator

start:
        sub     rsp, 8                  ; align the stack to 16 for fastcall

        invoke  GetCommandLineA
        mov     rsi, rax
        cmp     byte [rsi], '"'
        jne     .unquoted
        inc     rsi
.quoted:
        mov     al, [rsi]
        test    al, al
        jz      fail_args
        inc     rsi
        cmp     al, '"'
        jne     .quoted
        jmp     .spaces
.unquoted:
        mov     al, [rsi]
        test    al, al
        jz      fail_args
        cmp     al, ' '
        je      .spaces
        inc     rsi
        jmp     .unquoted
.spaces:
        cmp     byte [rsi], ' '
        jne     .path
        inc     rsi
        jmp     .spaces
.path:
        cmp     byte [rsi], 0
        je      fail_args

        ; cache path = program path + ".x64"
        xor     ecx, ecx
.copy:
        mov     al, [rsi + rcx]
        test    al, al
        jz      .copied
        cmp     ecx, MAX_PATH_BYTES
        jae     fail_args
        mov     [cachepath + rcx], al
        inc     ecx
        jmp     .copy
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

        ; translator fingerprint: FNV-1a over the templates, the emitter and the register map
        mov     eax, 811C9DC5h
        lea     rsi, [templates_start]
        lea     rdx, [templates_end]
        call    fnv
        lea     rsi, [jmap]
        lea     rdx, [jmap_end]
        call    fnv
        mov     [fingerprint], eax

        ; previous translation, if any and made by this same translator
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
        mov     rcx, [rdx + 8]          ; words in the cache
        cmp     rcx, MAX_PROGRAM / 4
        ja      .bad_cache
        lea     rax, [rcx + 1]
        imul    rax, BLOCK
        lea     rax, [rax + rcx*4 + HEADER_SIZE]
        mov     r8d, [bytesread]
        cmp     rax, r8
        jne     .bad_cache
        mov     [oldwords], rcx
        jmp     .no_cache
.bad_cache:
        mov     qword [cache], 0
.no_cache:

        ; native code: one block per word, the outside block, then the entry stub
        mov     rdx, [nwords]
        inc     rdx
        imul    rdx, BLOCK
        add     rdx, STUB_SPACE
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_EXECUTE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [code], rax

        ; --- translate ---
        xor     r12, r12                ; word index
.word:
        cmp     r12, [nwords]
        jae     .last
        mov     rdi, r12
        imul    rdi, BLOCK
        add     rdi, [code]             ; block start
        mov     r13, rdi

        ; reuse the cached block when the word did not change
        mov     rdx, [cache]
        test    rdx, rdx
        jz      .fresh
        cmp     r12, [oldwords]
        jae     .fresh
        mov     rax, [program]
        mov     eax, [rax + r12*4]
        cmp     eax, [rdx + HEADER_SIZE + r12*4]
        jne     .fresh
        mov     rcx, [oldwords]
        cmp     rcx, [nwords]
        je      .reuse
        movzx   ecx, al                 ; length changed: jumps may point past the end, translate them again
        cmp     ecx, 0Ch                ; jjmp, jjz, jjnz
        jb      .reuse
        cmp     ecx, 0Eh
        jbe     .fresh
        cmp     ecx, 14h                ; jcall
        je      .fresh
.reuse:
        mov     rsi, [oldwords]
        lea     rsi, [rdx + HEADER_SIZE + rsi*4]   ; cached code
        mov     rax, r12
        imul    rax, BLOCK
        add     rsi, rax
        mov     rdi, r13
        mov     ecx, BLOCK
        rep     movsb
        jmp     .next_word
.fresh:
        inc     qword [translated]
        mov     rdi, r13
        mov     al, 0CCh                ; padding is never executed: int3 if it ever is
        mov     ecx, BLOCK
        rep     stosb
        mov     rdi, r13

        ; fields of the Janax word
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
        lea     rax, [r13 + BLOCK - 2]
        cmp     rdi, rax
        ja      fail_block
        call    jump_over_padding
.next_word:
        inc     r12
        jmp     .word
.last:
        mov     rdi, [nwords]
        imul    rdi, BLOCK
        add     rdi, [code]
        lea     rsi, [t_outside]
        mov     ecx, t_outside.size
        rep     movsb

        ; --- entry stub: load the native registers, run block 0, save them back ---
        mov     rdi, [nwords]
        inc     rdi
        imul    rdi, BLOCK
        add     rdi, [code]
        mov     [entry_stub], rdi
        mov     r14d, 8Bh
        call    emit_all_registers
        mov     al, 0E8h                ; call block 0
        stosb
        mov     rax, [code]
        lea     rdx, [rdi + 4]
        sub     rax, rdx
        stosd
        mov     r14d, 89h
        call    emit_all_registers
        mov     al, 0C3h                ; ret, eax = exit code
        stosb

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
        invoke  WriteFile, [hfile], header, HEADER_SIZE, written, 0
        mov     rax, [nwords]
        shl     rax, 2
        mov     [wbytes], rax
        invoke  WriteFile, [hfile], [program], [wbytes], written, 0
        mov     rax, [nwords]
        inc     rax
        imul    rax, BLOCK
        mov     [wbytes], rax
        invoke  WriteFile, [hfile], [code], [wbytes], written, 0
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
        call    qword [entry_stub]
        test    eax, eax
        jnz     fail_code

        mov     rax, [context]
        lea     rdi, [hexbuf + 15]
        mov     ecx, 16
.digit:
        mov     edx, eax
        and     edx, 15
        mov     dl, [hexdigits + rdx]
        mov     [rdi], dl
        dec     rdi
        shr     rax, 4
        loop    .digit
        invoke  GetStdHandle, STD_OUTPUT_HANDLE
        invoke  WriteFile, rax, hexbuf, 18, written, 0
        invoke  ExitProcess, 0

; For every Janax register on a native register: r14d = 8Bh loads it from the context, 89h saves it.
emit_all_registers:
        xor     r12d, r12d
.one:
        movsx   ecx, byte [jmap + r12]
        test    ecx, ecx
        js      .skip
        mov     edx, r12d
        call    emit_rm
.skip:
        inc     r12d
        cmp     r12d, 16
        jb      .one
        ret

; FNV-1a: eax = hash so far, bytes [rsi, rdx); returns the hash in eax.
fnv:
        cmp     rsi, rdx
        jae     .done
        movzx   ecx, byte [rsi]
        xor     eax, ecx
        imul    eax, eax, 01000193h
        inc     rsi
        jmp     fnv
.done:
        ret

; Writes rax in decimal at rdi; leaves rdi just past the last digit.
put_decimal:
        mov     ecx, 10
        xor     r8d, r8d
.divide:
        xor     edx, edx
        div     rcx
        add     dl, '0'
        push    rdx
        inc     r8d
        test    rax, rax
        jnz     .divide
.emit:
        pop     rax
        mov     [rdi], al
        inc     rdi
        dec     r8d
        jnz     .emit
        ret

fail_code:
        invoke  ExitProcess, rax
fail_file:
        invoke  ExitProcess, 3
fail_args:
        invoke  ExitProcess, 4
fail_block:
        invoke  ExitProcess, 9          ; translator bug: a block outgrew BLOCK

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
