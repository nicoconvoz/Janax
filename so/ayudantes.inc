; Kernel helpers (Capitan: the kernel, piece by piece, in Janax): Janax programs the kernel runs with its own
; engines, each one as a small process of its own that keeps its return stack between runs, has no memory
; and cannot use the ventanilla. The first one is the scheduler (so/nucleo/planificador.jsm).
;
; The planner comes from the system's folder, PDP/so/nucleo/planificador.bin, so anyone can change how their
; Janax shares the processor (Capitan: "from PDP, customizable"); without that file the kernel uses the
; factory one (so/pdp/semilla/planificador.bin, built by the PDP assembler and kept up to date like the
; assembler's seed). A planner that fails or does not finish sends the kernel back to the factory one.

PLAN_BUDGET = 100000            ; instructions a planner may take for one turn. Criterion, not a measurement:
                                ; the factory one takes ~150 (~900 in its slowest path); one that needs a
                                ; hundred times that is treated as broken.
CALIB_C16   = 16                ; while calibrating, the planner runs with c = 1 instruction (its full path),
                                ; so the measured cost of a switch includes deciding a turn

; At boot: the planner from PDP, or the factory one. Needs the system's folder and the engine. Keeps rbx.
plan_load:
        push    rbx
        lea     rsi, [plan_label]
        mov     ecx, PLAN_LABEL_LEN
        lea     rdi, [host_path]
        call    label_path_ptr
        test    eax, eax
        jz      .factory
        invoke  CreateFileA, host_path, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      .factory
        mov     [hfile], rax
        mov     dword [bytesread], 0
        call    program_buffer
        test    rax, rax
        jz      .close
        invoke  ReadFile, [hfile], [load_buf], MAX_PROGRAM, bytesread, 0
.close:
        invoke  CloseHandle, [hfile]
        mov     eax, [bytesread]
        shr     eax, 2
        test    eax, eax
        jz      .factory
        mov     [plan_words], rax
        shl     rax, 2
        invoke  VirtualAlloc, 0, rax, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .factory
        mov     [plan_prog], rax
        mov     rdi, rax
        mov     rsi, [load_buf]
        mov     rcx, [plan_words]
        rep     movsd
        mov     byte [plan_own], 1
        invoke  WriteFile, [hout], plan_text, PLAN_TEXT_LEN, written, 0
        jmp     .helper
.factory:
        lea     rax, [plan_default]
        mov     [plan_prog], rax
        mov     qword [plan_words], PLAN_DEFAULT_WORDS
.helper:
        call    plan_helper
        pop     rbx
        ret

; The helper process for plan_prog / plan_words (made the first time). Uses rbx.
plan_helper:
        sub     rsp, 8
        mov     rbx, [plan_proc]
        test    rbx, rbx
        jnz     .have
        invoke  VirtualAlloc, 0, PROC_SIZE, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     rbx, rax
        mov     [plan_proc], rax
        invoke  VirtualAlloc, 0, RET_DEPTH * 8, MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_RET], rax
        mov     qword [rbx + P_HELPER], 1
        mov     qword [rbx + P_ID], -1
.have:
        mov     rax, [plan_prog]
        mov     [rbx + P_PROG], rax
        mov     rcx, [plan_words]
        mov     [rbx + P_NWORDS], rcx
        mov     qword [rbx + P_TABLE], 0
        cmp     byte [motor], 0
        je      .done                   ; the interpreter reads the words as they are
        mov     rdx, rax
        call    decode_program
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_TABLE], rax
.done:
        add     rsp, 8
        ret

; rax = D, r8 = s -> rax = the turn the planner gives, with c = plan_c16 (CALIB_C16 while calibrating).
; Keeps every other register; callable with any stack alignment.
plan_turn:
        push    rbx rcx rdx rsi rdi rbp r8 r9 r10 r11 r12 r13 r14 r15
        mov     [plan_d], rax
        mov     [plan_s], r8
        mov     rbx, [plan_proc]
        mov     rax, [plan_d]
        mov     [rbx + P_REGS + 1*8], rax
        mov     rax, [plan_s]
        mov     [rbx + P_REGS + 2*8], rax
        mov     rax, [plan_c16]
        cmp     byte [quiet], 0
        je      @f
        mov     eax, CALIB_C16
@@:     mov     [rbx + P_REGS + 3*8], rax
        xor     eax, eax
        mov     [rbx + P_PC], rax
        mov     [rbx + P_DONE], rax
        mov     [rbx + P_CODE], rax
        mov     [rbx + P_DEPTH], rax
        mov     eax, PLAN_BUDGET
        call    run_process
        cmp     qword [rbx + P_DONE], 0
        je      .broken                 ; it did not finish within its budget
        cmp     qword [rbx + P_CODE], 0
        jne     .broken
        mov     rax, [rbx + P_REGS]
        jmp     .out
.broken:
        cmp     byte [plan_own], 0
        je      .factory_broken
        mov     byte [plan_own], 0      ; back to the factory planner, for the rest of the run
        lea     rax, [plan_default]
        mov     [plan_prog], rax
        mov     qword [plan_words], PLAN_DEFAULT_WORDS
        mov     [plan_rsp], rsp
        and     rsp, -16
        call    plan_helper
        invoke  WriteFile, [hout], plan_fail_text, PLAN_FAIL_LEN, written, 0
        mov     rsp, [plan_rsp]
        mov     rax, [plan_d]           ; and the turn again, from it
        mov     r8, [plan_s]
        call    plan_turn
        jmp     .out
.factory_broken:                        ; the factory planner is tested: this is least attained service alone
        mov     rax, [plan_d]
        inc     rax
.out:
        pop     r15 r14 r13 r12 r11 r10 r9 r8 rbp rdi rsi rdx rcx rbx
        ret
