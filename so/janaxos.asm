; Janax OS, escalon S1: symbiosis mode on Windows x86-64.
; Usage: janaxos <program.bin>...
;
; Boot: recognises whether it was started by another operating system (symbiosis) or by the firmware
; (zero mode). Windows starts every program with rcx = its PEB, the same pointer it keeps at gs:[60h];
; UEFI starts an image with rcx = image handle and rdx = system table. Zero mode is not built yet.
;
; Kernel: every program becomes a process in its own cabin (registers, data memory, return stack). A
; process that breaks only ends itself; the others go on.
;
; Scheduler (Capitan: "nothing short left waiting, little of the long"): least attained service. The
; process that has received the least time runs first, so short jobs finish early without knowing
; anybody's length in advance. Time is counted in executed instructions.
;
; Turn length (Capitan: "the priority gives the real percentage", nothing fixed): a switch costs c
; instructions. The running process (service s) goes on while the advantage of the next least served
; one (D less service) does not pay for the switch: (t - D) * t >= c * (s + t), so
;   t = ((D + c) + sqrt((D + c)^2 + 4 c s)) / 2,   and never less than D + 1 (it must pass the other).
; A newcomer with little service gets the processor almost at once; two equal processes get turns that
; grow like sqrt(c s), so the waste shrinks by itself. With c = 0 it is pure least attained service.
; c is measured at boot on this machine (the kernel learns its environment), or fixed by JANAX_CAMBIO.
;
; Output: "modo: simbiosis", "costo de cambio: <c> instrucciones (medido|fijado)", then one line per
; process as it ends:
;   P<n> codigo=<exit code> j0=<16 hex digits> t=<instructions executed by the whole system so far>
; Exit codes per process are the interpreter's (0 jhalt, 1 invalid opcode, 2 outside the program,
; 5 memory out of range, 6 misaligned, 7 too many nested calls, 8 jret without jcall).
; The kernel itself exits 0, or 3 (a program cannot be read) or 4 (no programs).

format PE64 console
entry start

include 'win64a.inc'

MAX_PROGRAM = 1 shl 20          ; must match the interpreter
DATA_SIZE   = 1 shl 20          ; must match the interpreter
RET_DEPTH   = 4096              ; must match the interpreter
OP_COUNT    = 16h
FOREVER     = 7FFFFFFFFFFFFFFFh

; process (cabin) layout
P_REGS   = 0                    ; 16 qwords
P_PC     = 128
P_NWORDS = 136
P_PROG   = 144
P_DATA   = 152
P_RET    = 160
P_DEPTH  = 168
P_SERVED = 176                  ; instructions executed so far (attained service)
P_DONE   = 184
P_CODE   = 192
PROC_SIZE = 200

section '.data' data readable writeable

  entry_rcx dq 0
  cmdline   dq 0
  procs     dq 0
  nprocs    dq 0
  clock     dq 0                ; instructions executed by the whole system
  budget0   dq 0
  hfile     dq 0
  hout      dq 0
  bytesread dd 0
  written   dd 0
  hexdigits db '0123456789ABCDEF'
  mode_line db 'modo: simbiosis', 13, 10
  MODE_LEN = $ - mode_line
  line      db 96 dup 0

  swcost    dq 0.0              ; cost of a switch, in instructions (double)
  quiet     db 0                ; 1 while calibrating: no report lines
  switches  dq 0                ; process switches made by the scheduler
  env_name  db 'JANAX_CAMBIO', 0
  env_value db 32 dup 0
  four      dq 4.0
  half      dq 0.5
  hundred   dq 100.0
  cost_text db 'costo de cambio: '
  COST_TEXT_LEN = $ - cost_text
  measured_text db ' instrucciones (medido)', 13, 10
  MEASURED_LEN = $ - measured_text
  fixed_text db ' instrucciones (fijado)', 13, 10
  FIXED_LEN = $ - fixed_text

  ; calibration program: 2 * CALIB_LOOPS instructions of a tight loop (jsub / jjnz)
  CALIB_LOOPS = 40000h          ; criterion: long enough (~0.5 M instructions) to dwarf timer noise
  calib_prog dd 01h or (1 shl 8) or ((CALIB_LOOPS shr 16) shl 16)          ; jldi j1, high
             dd 0Fh or (1 shl 8) or ((CALIB_LOOPS and 0FFFFh) shl 16)      ; jshi j1, low
             dd 01h or (2 shl 8) or (1 shl 16)                             ; jldi j2, 1
             dd 03h or (1 shl 8) or (1 shl 12) or (2 shl 16)               ; vuelta: jsub j1, j1, j2
             dd 0Eh or (1 shl 8) or ((-2 and 0FFFFh) shl 16)               ; jjnz j1, vuelta
             dd 00h                                                        ; jhalt
  CALIB_WORDS = ($ - calib_prog) / 4
  calib_procs db 2 * PROC_SIZE dup 0
  real_procs  dq 0
  real_nprocs dq 0
  tsc_start   dq 0
  cycles_one  dq 0
  cycles_two  dq 0
  instr_one   dq 0
  instr_two   dq 0
  switch_two  dq 0
  rounds      dq 0

  optable   dq op_halt, op_ldi, op_add, op_sub, op_mul, op_div, op_shl, op_shr
            dq op_sar, op_and, op_or, op_xor, op_jmp, op_jz, op_jnz, op_shi
            dq op_ld, op_st, op_ldb, op_stb, op_call, op_ret

section '.text' code readable executable

start:
        mov     [entry_rcx], rcx
        sub     rsp, 8                  ; align the stack to 16 for fastcall

        ; --- boot: who started us? ---
        mov     rax, [gs:60h]           ; the PEB, if Windows is under us
        cmp     rax, [entry_rcx]
        jne     zero_mode

        invoke  GetStdHandle, STD_OUTPUT_HANDLE
        mov     [hout], rax
        invoke  WriteFile, [hout], mode_line, MODE_LEN, written, 0

        ; --- cost of a switch: fixed by JANAX_CAMBIO, or measured here ---
        invoke  GetEnvironmentVariableA, env_name, env_value, 31
        test    eax, eax
        jz      .measure
        xor     eax, eax                ; decimal digits
        lea     rsi, [env_value]
.digit:
        movzx   ecx, byte [rsi]
        sub     ecx, '0'
        cmp     ecx, 9
        ja      .parsed
        imul    rax, 10
        add     rax, rcx
        inc     rsi
        jmp     .digit
.parsed:
        cvtsi2sd xmm0, rax
        movsd   [swcost], xmm0
        call    print_cost
        invoke  WriteFile, [hout], fixed_text, FIXED_LEN, written, 0
        jmp     .cost_known
.measure:
        call    calibrate
        call    print_cost
        invoke  WriteFile, [hout], measured_text, MEASURED_LEN, written, 0
.cost_known:

        ; --- arguments: a private copy of the command line, split in place ---
        invoke  GetCommandLineA
        mov     rsi, rax
        invoke  lstrlenA, rsi
        lea     rdx, [rax + 1]
        push    rsi
        sub     rsp, 8
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        add     rsp, 8
        pop     rsi
        test    rax, rax
        jz      fail_file
        mov     [cmdline], rax
        mov     rdi, rax
.copy:
        lodsb
        stosb
        test    al, al
        jnz     .copy

        ; skip the program name (maybe quoted)
        mov     rsi, [cmdline]
        cmp     byte [rsi], '"'
        jne     .unquoted
        inc     rsi
.quoted:
        lodsb
        test    al, al
        jz      no_programs
        cmp     al, '"'
        jne     .quoted
        jmp     .count
.unquoted:
        mov     al, [rsi]
        test    al, al
        jz      no_programs
        cmp     al, ' '
        je      .count
        inc     rsi
        jmp     .unquoted

        ; count the programs and cut each path with a zero
.count:
        mov     r12, rsi                ; first argument area
        xor     ebx, ebx
.skip_spaces:
        cmp     byte [rsi], ' '
        jne     .token
        mov     byte [rsi], 0
        inc     rsi
        jmp     .skip_spaces
.token:
        cmp     byte [rsi], 0
        je      .counted
        inc     rbx
.in_token:
        mov     al, [rsi]
        test    al, al
        jz      .counted
        cmp     al, ' '
        je      .skip_spaces
        inc     rsi
        jmp     .in_token
.counted:
        test    rbx, rbx
        jz      no_programs
        mov     [nprocs], rbx
        imul    rdx, rbx, PROC_SIZE
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [procs], rax

        ; --- one cabin per program ---
        mov     rsi, r12
        mov     rbx, [procs]
        xor     r13, r13                ; process number
.load:
        cmp     r13, [nprocs]
        jae     .loaded
.find:
        cmp     byte [rsi], 0
        jne     .path
        inc     rsi
        jmp     .find
.path:
        mov     r14, rsi                ; this path
.path_end:
        cmp     byte [rsi], 0
        je      .open
        inc     rsi
        jmp     .path_end
.open:
        invoke  CreateFileA, r14, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      fail_file
        mov     [hfile], rax
        invoke  VirtualAlloc, 0, MAX_PROGRAM, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_PROG], rax
        invoke  ReadFile, [hfile], qword [rbx + P_PROG], MAX_PROGRAM, bytesread, 0
        test    eax, eax
        jz      fail_file
        invoke  CloseHandle, [hfile]
        mov     eax, [bytesread]
        shr     eax, 2
        mov     [rbx + P_NWORDS], rax
        invoke  VirtualAlloc, 0, DATA_SIZE, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_DATA], rax
        invoke  VirtualAlloc, 0, RET_DEPTH * 8, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_RET], rax
        mov     qword [rbx + P_REGS + 15*8], DATA_SIZE   ; j15 starts at the top of its data memory
        add     rbx, PROC_SIZE
        inc     r13
        jmp     .load
.loaded:

        call    run_all
        invoke  ExitProcess, 0

; ---------------------------------------------------------------- scheduler
; Runs every process in [procs] until all of them end. Least attained service; the turn comes from
; the priority gap and the switch cost (see the header).
run_all:
schedule:
        mov     rbx, -1                 ; least served process
        mov     r8, FOREVER             ; its service
        mov     r9, FOREVER             ; service of the next least served
        mov     rsi, [procs]
        xor     ecx, ecx
.scan:
        cmp     rcx, [nprocs]
        jae     .chosen
        cmp     qword [rsi + P_DONE], 0
        jne     .next_proc
        mov     rax, [rsi + P_SERVED]
        cmp     rax, r8
        jae     .not_least              ; ties keep the lower process number
        mov     r9, r8
        mov     r8, rax
        mov     rbx, rsi
        jmp     .next_proc
.not_least:
        cmp     rax, r9
        jae     .next_proc
        mov     r9, rax
.next_proc:
        add     rsi, PROC_SIZE
        inc     rcx
        jmp     .scan
.chosen:
        cmp     rbx, -1
        je      .all_done
        mov     rax, FOREVER            ; alone: run to the end
        cmp     r9, rax
        je      .run
        mov     rax, r9
        sub     rax, r8                 ; D: how much less service the one waiting has... the other way round
        lea     r10, [rax + 1]          ; least attained service alone: just pass the other one
        cvtsi2sd xmm0, rax
        addsd   xmm0, [swcost]          ; D + c
        movapd  xmm1, xmm0
        mulsd   xmm1, xmm1              ; (D + c)^2
        cvtsi2sd xmm2, r8
        mulsd   xmm2, [swcost]
        mulsd   xmm2, [four]            ; 4 c s
        addsd   xmm1, xmm2
        sqrtsd  xmm1, xmm1
        addsd   xmm0, xmm1
        mulsd   xmm0, [half]            ; t
        cvttsd2si rax, xmm0
        cvtsi2sd xmm1, rax
        ucomisd xmm0, xmm1
        jbe     @f
        inc     rax                     ; round up
@@:     cmp     rax, r10
        jge     .run
        mov     rax, r10
.run:
        inc     qword [switches]
        call    run_process             ; rax = instructions executed
        add     [rbx + P_SERVED], rax
        add     [clock], rax
        cmp     qword [rbx + P_DONE], 0
        je      schedule
        cmp     byte [quiet], 0
        jne     schedule
        call    report
        jmp     schedule
.all_done:
        ret

; ---------------------------------------------------------------- calibration
; Measures the cost of a switch on this machine, in instructions: the same program once alone and
; twice side by side with c = 0 (switching as often as possible). Each measurement is the minimum of
; three runs, which filters out interruptions by the host.
calibrate:
        mov     rax, [procs]
        mov     [real_procs], rax
        mov     rax, [nprocs]
        mov     [real_nprocs], rax
        lea     rax, [calib_procs]
        mov     [procs], rax
        mov     byte [quiet], 1
        mov     qword [swcost], 0
        mov     rax, FOREVER
        mov     [cycles_one], rax
        mov     [cycles_two], rax
        mov     qword [rounds], 3       ; in memory: run_process uses every register
.round:
        mov     qword [nprocs], 1
        call    calib_reset
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        mov     [tsc_start], rax
        call    run_all
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        sub     rax, [tsc_start]
        cmp     rax, [cycles_one]
        jae     @f
        mov     [cycles_one], rax
@@:     mov     rax, [clock]
        mov     [instr_one], rax
        mov     qword [nprocs], 2
        call    calib_reset
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        mov     [tsc_start], rax
        call    run_all
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        sub     rax, [tsc_start]
        cmp     rax, [cycles_two]
        jae     @f
        mov     [cycles_two], rax
@@:     mov     rax, [clock]
        mov     [instr_two], rax
        mov     rax, [switches]
        mov     [switch_two], rax
        dec     qword [rounds]
        jnz     .round
        ; per instruction a = cycles_one / instr_one; per switch = (cycles_two - instr_two * a) / switches
        cvtsi2sd xmm0, [cycles_one]
        cvtsi2sd xmm1, [instr_one]
        divsd   xmm0, xmm1              ; a
        cvtsi2sd xmm1, [instr_two]
        mulsd   xmm1, xmm0
        cvtsi2sd xmm2, [cycles_two]
        subsd   xmm2, xmm1
        cvtsi2sd xmm1, [switch_two]
        divsd   xmm2, xmm1              ; cycles per switch
        divsd   xmm2, xmm0              ; in instructions
        xorpd   xmm1, xmm1
        maxsd   xmm2, xmm1              ; noise can never make it negative
        movsd   [swcost], xmm2
        mov     rax, [real_procs]
        mov     [procs], rax
        mov     rax, [real_nprocs]
        mov     [nprocs], rax
        mov     byte [quiet], 0
        mov     qword [clock], 0
        mov     qword [switches], 0
        ret

; Puts the calibration processes back at their start.
calib_reset:
        lea     rdi, [calib_procs]
        xor     eax, eax
        mov     ecx, 2 * PROC_SIZE
        rep     stosb
        lea     rdi, [calib_procs]
        lea     rax, [calib_prog]
        mov     [rdi + P_PROG], rax
        mov     qword [rdi + P_NWORDS], CALIB_WORDS
        mov     [rdi + PROC_SIZE + P_PROG], rax
        mov     qword [rdi + PROC_SIZE + P_NWORDS], CALIB_WORDS
        mov     qword [clock], 0
        mov     qword [switches], 0
        ret

; "costo de cambio: <c with two decimals>"
print_cost:
        sub     rsp, 8
        invoke  WriteFile, [hout], cost_text, COST_TEXT_LEN, written, 0
        movsd   xmm0, [swcost]
        mulsd   xmm0, [hundred]
        cvtsd2si rax, xmm0              ; rounded to the nearest hundredth
        xor     edx, edx
        mov     ecx, 100
        div     rcx
        push    rdx
        lea     rdi, [line]
        call    put_decimal
        mov     byte [rdi], '.'
        inc     rdi
        pop     rax
        mov     ecx, 10
        xor     edx, edx
        div     rcx
        add     al, '0'
        add     dl, '0'
        mov     [rdi], al
        mov     [rdi + 1], dl
        add     rdi, 2
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
        add     rsp, 8
        ret

; ---------------------------------------------------------------- one process for up to rax instructions
; rbx = process. Returns rax = instructions executed; sets P_DONE and P_CODE if the process ended.
run_process:
        mov     [budget0], rax
        mov     rbp, rax                ; budget left
        mov     r14, rbx                ; registers
        mov     r15, [rbx + P_DATA]
        mov     r13, [rbx + P_PROG]
        mov     r12, [rbx + P_PC]
        mov     rsi, [rbx + P_RET]
        mov     rdi, [rbx + P_DEPTH]
next:
        test    rbp, rbp
        jz      suspend
        cmp     r12, [rbx + P_NWORDS]
        jae     fail_pc
        mov     eax, [r13 + r12*4]
        inc     r12                     ; jumps are relative to the next instruction
        dec     rbp
        movzx   ecx, al
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

suspend:
        mov     [rbx + P_PC], r12
        mov     [rbx + P_DEPTH], rdi
        mov     rax, [budget0]
        sub     rax, rbp
        ret

op_halt:
        xor     ecx, ecx
        jmp     ended
fail_op:
        mov     ecx, 1
        jmp     ended
fail_pc:
        mov     ecx, 2
        jmp     ended
fail_mem:
        mov     ecx, 5
        jmp     ended
fail_align:
        mov     ecx, 6
        jmp     ended
fail_call:
        mov     ecx, 7
        jmp     ended
fail_ret:
        mov     ecx, 8
ended:
        mov     [rbx + P_CODE], rcx
        mov     qword [rbx + P_DONE], 1
        jmp     suspend

op_ldi:
        movsx   rax, r9w
        mov     [r14 + r11*8], rax
        jmp     next

macro binop name, insn {
  name:
          mov     rax, [r14 + r8*8]
          insn    rax, [r14 + r10*8]
          mov     [r14 + r11*8], rax
          jmp     next
}

binop op_add, add
binop op_sub, sub
binop op_mul, imul
binop op_and, and
binop op_or,  or
binop op_xor, xor

op_div:
        mov     rax, [r14 + r8*8]
        mov     rcx, [r14 + r10*8]
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
        mov     [r14 + r11*8], rax
        jmp     next

macro shiftop name, insn {
  name:
          mov     rax, [r14 + r8*8]
          mov     rcx, [r14 + r10*8]
          and     ecx, 63
          insn    rax, cl
          mov     [r14 + r11*8], rax
          jmp     next
}

shiftop op_shl, shl
shiftop op_shr, shr
shiftop op_sar, sar

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

macro memop name, size, align_check, is_load, body {
  name:
          movsx   rax, r9w
          add     rax, [r14 + r8*8]
          cmp     rax, DATA_SIZE - size
          ja      fail_mem
    if align_check
          test    al, 7
          jnz     fail_align
    end if
    if ~ is_load
          mov     rcx, [r14 + r11*8]
    end if
          body
    if is_load
          mov     [r14 + r11*8], rax
    end if
          jmp     next
}

memop op_ld,  8, 1, 1, <mov rax, [r15 + rax]>
memop op_st,  8, 1, 0, <mov [r15 + rax], rcx>
memop op_ldb, 1, 0, 1, <movzx eax, byte [r15 + rax]>
memop op_stb, 1, 0, 0, <mov [r15 + rax], cl>

op_call:
        cmp     rdi, RET_DEPTH
        jae     fail_call
        mov     [rsi + rdi*8], r12
        inc     rdi
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_ret:
        test    rdi, rdi
        jz      fail_ret
        dec     rdi
        mov     r12, [rsi + rdi*8]
        jmp     next

; ---------------------------------------------------------------- output
; "P<n> codigo=<c> j0=<hex> t=<clock>" for the process in rbx
report:
        lea     rdi, [line]
        mov     al, 'P'
        stosb
        mov     rax, rbx
        sub     rax, [procs]
        xor     edx, edx
        mov     ecx, PROC_SIZE
        div     rcx
        call    put_decimal
        mov     rax, ' codigo='
        stosq
        mov     rax, [rbx + P_CODE]
        call    put_decimal
        mov     eax, ' j0='
        stosd
        mov     rax, [rbx + P_REGS]
        mov     ecx, 16
.digit:
        rol     rax, 4
        mov     edx, eax
        and     edx, 15
        mov     dl, [hexdigits + rdx]
        mov     [rdi], dl
        inc     rdi
        dec     ecx
        jnz     .digit
        mov     eax, ' t='
        stosd
        dec     rdi                     ; ' t=' is three characters
        mov     rax, [clock]
        call    put_decimal
        mov     ax, 0A0Dh
        stosw
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
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

zero_mode:                              ; started by the firmware: not built yet
        hlt
        jmp     zero_mode

no_programs:
        invoke  ExitProcess, 4
fail_file:
        invoke  ExitProcess, 3

section '.idata' import data readable writeable

  library kernel32, 'KERNEL32.DLL'

  import kernel32,\
         GetCommandLineA, 'GetCommandLineA',\
         lstrlenA, 'lstrlenA',\
         CreateFileA, 'CreateFileA',\
         ReadFile, 'ReadFile',\
         CloseHandle, 'CloseHandle',\
         VirtualAlloc, 'VirtualAlloc',\
         GetEnvironmentVariableA, 'GetEnvironmentVariableA',\
         GetStdHandle, 'GetStdHandle',\
         WriteFile, 'WriteFile',\
         ExitProcess, 'ExitProcess'
