; Janax v0 -> x86-64 translator (escalon 0), Windows.
; Usage: janaxt <program.bin>
; Translates the whole program to native x86-64 before running it, then runs the native code.
; Output and exit codes are identical to the reference interpreter (janax.asm); the tests check both.
;
; Every Janax word becomes a fixed-size native block (BLOCK bytes), so block i lives at code + i*BLOCK and
; jumps need no address map. Block nwords is the "outside the program" exit. Each instruction is a template
; assembled below; the translator copies it and patches its fields.
;
; Incremental: blocks only use relative addresses, so a block translated once is valid at any address.
; The translation is kept in <program.bin>.x64 with the translator's own fingerprint; the next run copies
; the blocks of unchanged words and translates only the words that differ (plus jumps, if the program
; length changed, because jumps past the end point at the outside block). stderr reports
; "traducidas N de M".
;
; Native register use while the program runs:
;   rbx = Janax registers (16 qwords)   r15 = data memory
;   r14 = return stack (native addrs)   r13 = return stack depth
; The generated code never touches rsp: it ends with "ret" and eax = exit code (0 = jhalt).

format PE64 console
entry start

include 'win64a.inc'

MAX_PROGRAM = 1 shl 20          ; bytes; criterion, not a measurement
DATA_SIZE   = 1 shl 20          ; must match the interpreter
RET_DEPTH   = 4096              ; must match the interpreter
OP_COUNT    = 16h
BLOCK       = 64                ; bytes per native block; every template is asserted to fit

; patch kinds
P_RA   = 1                      ; dword = ra*8
P_RB   = 2                      ; dword = rb*8
P_RD   = 3                      ; dword = rd*8
P_IMM  = 4                      ; dword = imm16 sign-extended
P_IMMZ = 5                      ; dword = imm16 zero-extended
P_JUMP = 6                      ; dword = rel32 to the target block (or the outside block)
MAX_PATCHES = 4

CACHE_MAGIC = 'JX64'
MAX_PATH_BYTES = 1024
HEADER_SIZE = 16                ; magic, fingerprint, nwords (qword)

DISP = 7FFFFFF0h                ; placeholder that forces 32-bit fields in the templates

section '.data' data readable writeable

  regs      dq 16 dup 0
  program   dq 0
  nwords    dq 0
  code      dq 0
  hfile     dq 0
  bytesread dd 0
  written   dd 0
  hexdigits db '0123456789ABCDEF'
  hexbuf    db 16 dup '0', 13, 10
  retstack  dq RET_DEPTH dup 0

  cachepath db MAX_PATH_BYTES + 8 dup 0
  cache     dq 0                ; whole previous cache file, or 0
  oldwords  dq 0                ; word count in the cache (valid only if cache <> 0)
  fingerprint dd 0
  translated dq 0
  msg       db 'traducidas '
  msgnum    db 40 dup 0

  ; per instruction: template address, size, then MAX_PATCHES pairs (offset, kind)
  macro desc name, [off, kind] {
    common
      dq name
      dd name#.size
      local n
      n = 0
    forward
      if ~ off eq
        dw off, kind
        n = n + 1
      end if
    common
      repeat MAX_PATCHES - n
        dw 0, 0
      end repeat
  }
  DESC_SIZE = 8 + 4 + MAX_PATCHES*4

  descs:
    desc t_halt
    desc t_ldi,  t_ldi.d,  P_RD,  t_ldi.i,  P_IMM
    desc t_add,  t_add.a,  P_RA,  t_add.b,  P_RB,  t_add.d,  P_RD
    desc t_sub,  t_sub.a,  P_RA,  t_sub.b,  P_RB,  t_sub.d,  P_RD
    desc t_mul,  t_mul.a,  P_RA,  t_mul.b,  P_RB,  t_mul.d,  P_RD
    desc t_div,  t_div.a,  P_RA,  t_div.b,  P_RB,  t_div.d,  P_RD
    desc t_shl,  t_shl.a,  P_RA,  t_shl.b,  P_RB,  t_shl.d,  P_RD
    desc t_shr,  t_shr.a,  P_RA,  t_shr.b,  P_RB,  t_shr.d,  P_RD
    desc t_sar,  t_sar.a,  P_RA,  t_sar.b,  P_RB,  t_sar.d,  P_RD
    desc t_and,  t_and.a,  P_RA,  t_and.b,  P_RB,  t_and.d,  P_RD
    desc t_or,   t_or.a,   P_RA,  t_or.b,   P_RB,  t_or.d,   P_RD
    desc t_xor,  t_xor.a,  P_RA,  t_xor.b,  P_RB,  t_xor.d,  P_RD
    desc t_jmp,  t_jmp.j,  P_JUMP
    desc t_jz,   t_jz.d,   P_RD,  t_jz.j,   P_JUMP
    desc t_jnz,  t_jnz.d,  P_RD,  t_jnz.j,  P_JUMP
    desc t_shi,  t_shi.d,  P_RD,  t_shi.i,  P_IMMZ, t_shi.e, P_RD
    desc t_ld,   t_ld.a,   P_RA,  t_ld.i,   P_IMM,  t_ld.d,  P_RD
    desc t_st,   t_st.a,   P_RA,  t_st.i,   P_IMM,  t_st.d,  P_RD
    desc t_ldb,  t_ldb.a,  P_RA,  t_ldb.i,  P_IMM,  t_ldb.d, P_RD
    desc t_stb,  t_stb.a,  P_RA,  t_stb.i,  P_IMM,  t_stb.d, P_RD
    desc t_call, t_call.j, P_JUMP
    desc t_ret
  descs_end:

  header    dd CACHE_MAGIC, 0
  hwords    dq 0
  wbytes    dq 0
  cachesize dq 0

section '.text' code readable executable

; ---------------------------------------------------------------- templates
; Field offsets are relative to the template start. Internal jumps are relative, so a copy still works.

macro template name {
  name:
  macro end_template \{
    name#.size = $ - name
    assert name#.size <= BLOCK - 2      ; room for the short jump to the next block

  \}
}

templates_start:                        ; templates_start..templates_end feeds the translator fingerprint

template t_halt
        xor     eax, eax
        ret
end_template

template t_ldi
        mov     qword [rbx + DISP], DISP
        t_ldi.d = $ - 8 - t_ldi
        t_ldi.i = $ - 4 - t_ldi
end_template

macro binop name, insn {
  template name
          mov     rax, [rbx + DISP]
          name#.a = $ - 4 - name
          insn    rax, [rbx + DISP]
          name#.b = $ - 4 - name
          mov     [rbx + DISP], rax
          name#.d = $ - 4 - name
  end_template
}

binop t_add, add
binop t_sub, sub
binop t_mul, imul
binop t_and, and
binop t_or,  or
binop t_xor, xor

template t_div
        mov     rax, [rbx + DISP]
        t_div.a = $ - 4 - t_div
        mov     rcx, [rbx + DISP]
        t_div.b = $ - 4 - t_div
        test    rcx, rcx
        jz      .by_zero
        cmp     rcx, -1
        je      .by_minus_one
        cqo
        idiv    rcx
        jmp     .store
.by_zero:
        xor     eax, eax
        jmp     .store
.by_minus_one:
        neg     rax
.store:
        mov     [rbx + DISP], rax
        t_div.d = $ - 4 - t_div
end_template

macro shiftop name, insn {
  template name
          mov     rax, [rbx + DISP]
          name#.a = $ - 4 - name
          mov     rcx, [rbx + DISP]
          name#.b = $ - 4 - name
          insn    rax, cl                 ; x86 uses the low 6 bits of cl, as Janax
          mov     [rbx + DISP], rax
          name#.d = $ - 4 - name
  end_template
}

shiftop t_shl, shl
shiftop t_shr, shr
shiftop t_sar, sar

template t_jmp
        db      0E9h
        dd      0
        t_jmp.j = $ - 4 - t_jmp
end_template

template t_jz
        cmp     qword [rbx + DISP], 0
        t_jz.d = $ - 5 - t_jz
        db      0Fh, 84h
        dd      0
        t_jz.j = $ - 4 - t_jz
end_template

template t_jnz
        cmp     qword [rbx + DISP], 0
        t_jnz.d = $ - 5 - t_jnz
        db      0Fh, 85h
        dd      0
        t_jnz.j = $ - 4 - t_jnz
end_template

template t_shi
        mov     rax, [rbx + DISP]
        t_shi.d = $ - 4 - t_shi
        shl     rax, 16
        or      rax, DISP
        t_shi.i = $ - 4 - t_shi
        mov     [rbx + DISP], rax
        t_shi.e = $ - 4 - t_shi
end_template

macro memop name, size, align_check, load, body {
  template name
          mov     rax, [rbx + DISP]
          name#.a = $ - 4 - name
          add     rax, DISP
          name#.i = $ - 4 - name
          cmp     rax, DATA_SIZE - size
          ja      .out
    if align_check
          test    al, 7
          jnz     .misaligned
    end if
    if load
          body
          mov     [rbx + DISP], rax
          name#.d = $ - 4 - name
    else
          mov     rcx, [rbx + DISP]
          name#.d = $ - 4 - name
          body
    end if
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

memop t_ld,  8, 1, 1, <mov rax, [r15 + rax]>
memop t_st,  8, 1, 0, <mov [r15 + rax], rcx>
memop t_ldb, 1, 0, 1, <movzx eax, byte [r15 + rax]>
memop t_stb, 1, 0, 0, <mov [r15 + rax], cl>

template t_call
        cmp     r13, RET_DEPTH
        jae     .overflow
        db      48h, 8Dh, 05h           ; lea rax, [rip + disp32]: the next block, position-independent
        dd      BLOCK - ($ + 4 - t_call)
        mov     [r14 + r13*8], rax
        inc     r13
        db      0E9h
        dd      0
        t_call.j = $ - 4 - t_call
.overflow:
        mov     eax, 7
        ret
end_template

template t_ret
        test    r13, r13
        jz      .empty
        dec     r13
        mov     rax, [r14 + r13*8]
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
        mov     r15, rax
        mov     qword [regs + 15*8], DATA_SIZE

        ; translator fingerprint: FNV-1a over the templates and their descriptors
        mov     eax, 811C9DC5h
        lea     rsi, [templates_start]
        lea     rdx, [templates_end]
        call    fnv
        lea     rsi, [descs]
        lea     rdx, [descs_end]
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

        ; native code: one block per word plus the outside block
        mov     rdx, [nwords]
        inc     rdx
        imul    rdx, BLOCK
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
        jmp     .patched
.fresh:
        inc     qword [translated]
        mov     rdi, r13
        mov     al, 0CCh                ; padding is never executed: int3 if it ever is
        mov     ecx, BLOCK
        rep     stosb

        mov     rax, [program]
        mov     eax, [rax + r12*4]
        movzx   ecx, al
        cmp     ecx, OP_COUNT
        jae     .bad
        imul    rcx, DESC_SIZE
        lea     rbp, [descs + rcx]      ; descriptor
        mov     rsi, [rbp]
        mov     ecx, [rbp + 8]
        mov     rdi, r13
        rep     movsb
        call    jump_over_padding

        ; fields of the Janax word
        mov     r8d, eax
        shr     r8d, 12
        and     r8d, 15
        shl     r8d, 3                  ; ra*8
        mov     r9d, eax
        shr     r9d, 16
        mov     r10d, r9d
        and     r10d, 15
        shl     r10d, 3                 ; rb*8
        mov     r11d, eax
        shr     r11d, 8
        and     r11d, 15
        shl     r11d, 3                 ; rd*8
        movsx   r9, r9w                 ; imm16 sign-extended

        xor     ecx, ecx                ; patch number
.patch:
        cmp     ecx, MAX_PATCHES
        jae     .patched
        movzx   edx, word [rbp + 12 + rcx*4]        ; offset
        movzx   eax, word [rbp + 12 + rcx*4 + 2]    ; kind
        lea     rdi, [r13 + rdx]
        cmp     eax, P_RA
        je      .ra
        cmp     eax, P_RB
        je      .rb
        cmp     eax, P_RD
        je      .rd
        cmp     eax, P_IMM
        je      .imm
        cmp     eax, P_IMMZ
        je      .immz
        cmp     eax, P_JUMP
        je      .jump
        jmp     .patched                ; kind 0: no more patches
.ra:    mov     [rdi], r8d
        jmp     .another
.rb:    mov     [rdi], r10d
        jmp     .another
.rd:    mov     [rdi], r11d
        jmp     .another
.imm:   mov     [rdi], r9d
        jmp     .another
.immz:  movzx   eax, r9w
        mov     [rdi], eax
        jmp     .another
.jump:
        lea     rax, [r12 + 1]
        add     rax, r9                 ; target word, signed
        js      .outside
        cmp     rax, [nwords]
        jbe     .inside
.outside:
        mov     rax, [nwords]           ; the outside block
.inside:
        imul    rax, BLOCK
        add     rax, [code]
        lea     rdx, [rdi + 4]
        sub     rax, rdx
        mov     [rdi], eax
.another:
        inc     ecx
        jmp     .patch
.bad:
        lea     rsi, [t_bad]
        mov     ecx, t_bad.size
        mov     rdi, r13
        rep     movsb
        call    jump_over_padding
.patched:
        inc     r12
        jmp     .word
.last:
        mov     rdi, [nwords]
        imul    rdi, BLOCK
        add     rdi, [code]
        lea     rsi, [t_outside]
        mov     ecx, t_outside.size
        rep     movsb

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
        lea     rbx, [regs]
        lea     r14, [retstack]
        xor     r13, r13
        call    qword [code]
        test    eax, eax
        jnz     fail_code

        mov     rax, [regs]
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

; After a template copied at r13, rdi points just past it: a short jump there skips the padding
; and lands on the next block, so execution never walks through filler bytes.
jump_over_padding:
        lea     rdx, [r13 + BLOCK]
        sub     rdx, rdi
        sub     rdx, 2                  ; rel8 counts from the end of the jump
        mov     byte [rdi], 0EBh
        mov     [rdi + 1], dl
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
