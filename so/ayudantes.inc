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


; --- the sheet of turns (Capitan: "the captain sets the priorities of when each one rows, so that they do
; not have to be told, and the captain thinks about more important things") ---
; The planner writes the next turns at once (who rows and for how long) in its room; the kernel follows the
; sheet line by line while the world is the one it imagined, and asks for a new one when it ran out or
; something happened: a turn that ended before its end, a cabin that ended, was born, fell asleep or woke
; up, or a line that names a cabin that cannot row now. No clock: events only.
PLAN_SHEET  = 16                ; turns per sheet. Criterion, not a measurement: a new sheet costs the call to
                                ; the helper (~150 instructions), so 16 turns bring it near 10 per turn; a
                                ; sheet thrown away early only wastes the turns it computed.

; -> rbx = the cabin to row now and rax = its turn. With the lock. Expects the scan's choice in rbx, its
; service in r8 and the next one's in r9 (the last resort if no planner gives a usable sheet).
plan_next:
        mov     [plan_pick], rbx
        mov     [plan_r8], r8
        mov     [plan_r9], r9
        call    plan_take
        jnc     .out
        call    plan_fill
        call    plan_take
        jnc     .out
        cmp     byte [plan_own], 0      ; a planner of its own gave no usable sheet: the factory one
        je      .last_resort
        mov     byte [plan_own], 0
        lea     rax, [plan_default]
        mov     [plan_prog], rax
        mov     qword [plan_words], PLAN_DEFAULT_WORDS
        mov     [plan_rsp], rsp
        and     rsp, -16
        call    plan_helper
        invoke  WriteFile, [hout], plan_fail_text, PLAN_FAIL_LEN, written, 0
        mov     rsp, [plan_rsp]
        call    plan_fill
        call    plan_take
        jnc     .out
.last_resort:                           ; the factory planner is tested: least attained service, D + 1
        mov     rbx, [plan_pick]
        mov     rax, FOREVER
        cmp     [plan_r9], rax
        je      .out
        mov     rax, [plan_r9]
        sub     rax, [plan_r8]
        jns     @f
        xor     eax, eax
@@:     inc     rax
.out:
        ret

; The next line of the sheet, if it still fits the world: CF = 0, rbx = its cabin, rax = its turn; else
; CF = 1 and the sheet is thrown away.
plan_take:
        cmp     qword [sheet_left], 0
        je      .no
        mov     rsi, [sheet_pos]
        mov     rcx, [rsi]
        cmp     rcx, [nprocs]
        jae     .no
        mov     rdx, [procs]
        mov     rdx, [rdx + rcx*8]
        cmp     qword [rdx + P_DONE], 0
        jne     .no
        cmp     qword [rdx + P_WAITING], 0
        jne     .no
        cmp     qword [rdx + P_RUNNING], 0
        jne     .no
        mov     rax, [rsi + 8]
        test    rax, rax
        jle     .no                     ; a turn is at least one instruction
        add     qword [sheet_pos], 16
        dec     qword [sheet_left]
        mov     rbx, rdx
        clc
        ret
.no:
        mov     qword [sheet_left], 0
        stc
        ret

; The planner writes a new sheet in its room, from the cabins that can row now (and the ones being rowed,
; which only count as next in line). If it fails or answers nonsense the sheet stays empty.
plan_fill:
        mov     qword [sheet_left], 0
        mov     rax, [nprocs]           ; its room: the header, every cabin, the sheet
        shl     rax, 4
        add     rax, 32 + PLAN_SHEET * 16
        cmp     rax, [plan_cap]
        jbe     .room
        mov     [plan_rsp], rsp
        and     rsp, -16
        mov     [plan_need], rax
        invoke  VirtualAlloc, 0, rax, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     rbx, [plan_proc]
        mov     rcx, [rbx + P_DATA]
        mov     [rbx + P_DATA], rax
        test    rcx, rcx
        jz      @f
        invoke  VirtualFree, rcx, 0, MEM_RELEASE
@@:     mov     rsp, [plan_rsp]
        mov     rax, [plan_need]
        mov     [plan_cap], rax
        mov     [rbx + P_SIZE], rax
        mov     [rbx + P_LIM1], rax
        sub     rax, 7
        mov     [rbx + P_LIM8], rax
.room:
        mov     rbx, [plan_proc]
        mov     rdi, [rbx + P_DATA]
        mov     rax, [plan_c16]
        cmp     byte [quiet], 0
        je      @f
        mov     eax, CALIB_C16          ; calibrating: c = 1 instruction, so deciding costs what it will cost
@@:     mov     [rdi + 8], rax
        mov     qword [rdi + 16], PLAN_SHEET
        lea     r8, [rdi + 32]          ; the cabins, in id order
        xor     ecx, ecx
        jmp     .cabin
.cabin_lap:
        mov     rdx, [procs]
        mov     rdx, [rdx + rcx*8]
        cmp     qword [rdx + P_DONE], 0
        jne     .cabin_next
        cmp     qword [rdx + P_WAITING], 0
        jne     .cabin_next
        mov     rax, [rdx + P_SERVED]
        mov     [r8], rax
        mov     rax, [rdx + P_RUNNING]
        shl     rax, 63
        or      rax, rcx                ; its id, bit 63 if a rower has it
        mov     [r8 + 8], rax
        add     r8, 16
.cabin_next:
        inc     rcx
.cabin:                                 ; while there are cabins to look at
        cmp     rcx, [nprocs]
        jb      .cabin_lap
        mov     rax, r8
        sub     rax, rdi
        sub     rax, 32
        shr     rax, 4
        mov     [rdi], rax              ; how many
        mov     [plan_sheet], r8        ; where the sheet goes
        push    rdi
        lea     rdi, [rbx + P_REGS]     ; every register at 0, as the contract says
        xor     eax, eax
        mov     ecx, 16
        rep     stosq
        pop     rdi
        xor     eax, eax
        mov     [rbx + P_PC], rax
        mov     [rbx + P_DONE], rax
        mov     [rbx + P_CODE], rax
        mov     [rbx + P_DEPTH], rax
        mov     eax, PLAN_BUDGET
        call    run_process
        cmp     qword [rbx + P_DONE], 0
        je      .failed                 ; it did not finish within its budget
        cmp     qword [rbx + P_CODE], 0
        jne     .failed
        mov     rax, [rbx + P_REGS]
        cmp     rax, PLAN_SHEET
        ja      .failed                 ; more turns than asked (or a negative count)
        mov     rcx, [plan_sheet]
        mov     [sheet_pos], rcx
        mov     [sheet_left], rax
.failed:
        ret
