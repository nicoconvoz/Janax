; Janax v0 reference interpreter (escalon 0), x86-64 Windows.
; Usage: janax <program.bin>
; Runs the program from word 0. On jhalt prints j0 as 16 hex digits and exits with code 0.
; Exit codes: 1 invalid opcode, 2 pc outside the program, 3 cannot read the file, 4 missing argument.
; Slow on purpose: it is the executable specification every translator is tested against.

format PE64 console
entry start

include 'win64a.inc'

MAX_PROGRAM = 1 shl 20          ; bytes; criterion, not a measurement
OP_COUNT    = 10h

section '.data' data readable writeable

  regs      dq 16 dup 0
  program   dq 0
  nwords    dq 0
  hfile     dq 0
  bytesread dd 0
  written   dd 0
  hexdigits db '0123456789ABCDEF'
  hexbuf    db 16 dup '0', 13, 10

  optable   dq op_halt, op_ldi, op_add, op_sub, op_mul, op_div, op_shl, op_shr
            dq op_sar, op_and, op_or, op_xor, op_jmp, op_jz, op_jnz, op_shi

section '.text' code readable executable

start:
        sub     rsp, 8                  ; align the stack to 16 for fastcall

        ; --- argument: skip the program name, then spaces ---
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

        ; --- load the program ---
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

        ; --- run ---
        xor     r12, r12                ; pc, in words
        mov     r13, [program]
        lea     r14, [regs]

next:
        cmp     r12, [nwords]
        jae     fail_pc
        mov     eax, [r13 + r12*4]
        inc     r12                     ; jumps are relative to the next instruction
        movzx   ecx, al                 ; op
        mov     r11d, eax
        shr     r11d, 8
        and     r11d, 15                ; rd
        mov     r8d, eax
        shr     r8d, 12
        and     r8d, 15                 ; ra
        mov     r9d, eax
        shr     r9d, 16                 ; imm16, zero-extended
        mov     r10d, r9d
        and     r10d, 15                ; rb
        cmp     ecx, OP_COUNT
        jae     fail_op
        jmp     qword [optable + rcx*8]

op_halt:
        jmp     finish

op_ldi:
        movsx   rax, r9w
        mov     [r14 + r11*8], rax
        jmp     next

op_add:
        mov     rax, [r14 + r8*8]
        add     rax, [r14 + r10*8]
        mov     [r14 + r11*8], rax
        jmp     next

op_sub:
        mov     rax, [r14 + r8*8]
        sub     rax, [r14 + r10*8]
        mov     [r14 + r11*8], rax
        jmp     next

op_mul:
        mov     rax, [r14 + r8*8]
        imul    rax, [r14 + r10*8]      ; low 64 bits: wraps
        mov     [r14 + r11*8], rax
        jmp     next

op_div:
        mov     rax, [r14 + r8*8]
        mov     rcx, [r14 + r10*8]
        test    rcx, rcx
        jz      .by_zero
        cmp     rcx, -1
        je      .by_minus_one
        cqo
        idiv    rcx                     ; truncates toward zero
        jmp     .store
.by_zero:
        xor     eax, eax                ; Janax: x / 0 = 0
        jmp     .store
.by_minus_one:
        neg     rax                     ; INT64_MIN / -1 wraps to INT64_MIN instead of trapping
.store:
        mov     [r14 + r11*8], rax
        jmp     next

op_shl:
        mov     rax, [r14 + r8*8]
        mov     rcx, [r14 + r10*8]
        and     ecx, 63
        shl     rax, cl
        mov     [r14 + r11*8], rax
        jmp     next

op_shr:
        mov     rax, [r14 + r8*8]
        mov     rcx, [r14 + r10*8]
        and     ecx, 63
        shr     rax, cl
        mov     [r14 + r11*8], rax
        jmp     next

op_sar:
        mov     rax, [r14 + r8*8]
        mov     rcx, [r14 + r10*8]
        and     ecx, 63
        sar     rax, cl
        mov     [r14 + r11*8], rax
        jmp     next

op_and:
        mov     rax, [r14 + r8*8]
        and     rax, [r14 + r10*8]
        mov     [r14 + r11*8], rax
        jmp     next

op_or:
        mov     rax, [r14 + r8*8]
        or      rax, [r14 + r10*8]
        mov     [r14 + r11*8], rax
        jmp     next

op_xor:
        mov     rax, [r14 + r8*8]
        xor     rax, [r14 + r10*8]
        mov     [r14 + r11*8], rax
        jmp     next

op_jmp:
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_jz:
        cmp     qword [r14 + r11*8], 0
        jne     next
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_jnz:
        cmp     qword [r14 + r11*8], 0
        je      next
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_shi:
        mov     rax, [r14 + r11*8]
        shl     rax, 16
        or      rax, r9
        mov     [r14 + r11*8], rax
        jmp     next

finish:
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

fail_op:
        invoke  ExitProcess, 1
fail_pc:
        invoke  ExitProcess, 2
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
         GetStdHandle, 'GetStdHandle',\
         WriteFile, 'WriteFile',\
         ExitProcess, 'ExitProcess'
