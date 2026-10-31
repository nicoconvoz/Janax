; The rowers (Capitan: "parallelize the cabins, and take the smallest share of each core"): one rower per core
; of the processor (JANAX_REMOS sets how many). Each one takes the least served cabin nobody is rowing, gives
; it its turn and runs it on its own; only what is shared goes through the captain's lock: choosing a cabin
; and its turn, the window (ventanilla), and what happens when a cabin ends. A rower with nothing to do
; sleeps until something changes (a cabin comes back, is born, wakes up): it takes no processor at all, and
; its stack is small.
;
; Each cabin gives the same result as always (cabins share nothing); the order between cabins and the clock
; depend on the rowers' pace. With one rower (JANAX_REMOS=1) everything happens exactly as before.

ROWER_STACK = 10000h            ; bytes reserved for a rower's stack: what the engines and the window use,
                                ; with room to spare (committed only as it is used)

; The captain's lock. Keep every register (flags aside); callable with any stack alignment.
kern_enter:
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rcx, [kern_lock]
        call    [EnterCriticalSection]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
        ret
kern_leave:
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rcx, [kern_lock]
        call    [LeaveCriticalSection]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
        ret
; Something changed: the rowers asleep look again.
kern_wake:
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rcx, [kern_change]
        call    [WakeAllConditionVariable]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
        ret
; With the lock: sleeps until something changes, and has the lock again.
kern_sleep:
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rcx, [kern_change]
        lea     rdx, [kern_lock]
        mov     r8d, -1                 ; INFINITE: only a change wakes it
        call    [SleepConditionVariableCS]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
        ret

; One rower: while some cabin can run, it takes the least served one nobody is rowing (ties: the lower
; number), gives it its turn and rows it outside the lock. Returns when every cabin has ended.
run_all:
        call    kern_enter
        jmp     .schedule
.turn:
        cmp     rbx, -1
        jne     .someone
        cmp     qword [rowing], 0
        je      .nobody
        call    kern_sleep              ; nothing for this rower while others row: wait for a change
        jmp     .schedule
.nobody:
        mov     qword [sheet_left], 0   ; signatures change who can row
        call    nobody_signs            ; everyone left waits for a signature nobody can give
        jmp     .schedule
.someone:
        call    plan_next               ; who rows now and for how long: the sheet of turns (ayudantes.inc)
.run:
        mov     [rbx + P_TURN], rax
        inc     qword [switches]
        mov     qword [rbx + P_RUNNING], 1
        inc     qword [rowing]
        call    kern_leave
        call    run_process             ; outside the lock: the cabins row side by side
        call    kern_enter
        mov     qword [rbx + P_RUNNING], 0
        dec     qword [rowing]
        add     [rbx + P_SERVED], rax
        cmp     rax, [rbx + P_TURN]
        je      @f
        mov     qword [sheet_left], 0   ; it did not use its turn to the end: the world is not the imagined one
@@:     cmp     qword [rbx + P_DONE], 0
        je      @f
        mov     qword [sheet_left], 0   ; it ended
@@:
        add     [clock], rax
        call    kern_wake               ; a cabin came back: the rowers asleep look again
        cmp     qword [rbx + P_DONE], 0
        je      .schedule
        call    close_files             ; whatever the process left open
        call    orphans                 ; its children and what waited for its signature go up
        cmp     byte [quiet], 0
        jne     .schedule
        call    report
.schedule:                              ; while someone can run, waits for a signature or is being rowed
        mov     rbx, -1                 ; least served process nobody rows
        mov     r8, FOREVER             ; its service
        mov     r9, FOREVER             ; service of the next least served (rowed or not)
        mov     qword [asleep], 0
        xor     ecx, ecx
        jmp     .scan
.scan_lap:
        mov     rsi, [procs]
        mov     rsi, [rsi + rcx*8]
        cmp     qword [rsi + P_DONE], 0
        jne     .next_proc
        cmp     qword [rsi + P_WAITING], 0
        je      @f
        inc     qword [asleep]          ; waiting for a signature: it does not run
        jmp     .next_proc
@@:     mov     rax, [rsi + P_SERVED]
        cmp     qword [rsi + P_RUNNING], 0
        jne     .not_least              ; another rower has it: it only counts as the next in line
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
        inc     rcx
.scan:                                  ; while there are processes to look at
        cmp     rcx, [nprocs]
        jb      .scan_lap
        cmp     rbx, -1
        jne     .turn
        cmp     qword [asleep], 0
        jne     .turn
        cmp     qword [rowing], 0
        jne     .turn
        call    kern_wake               ; all ended: the rowers asleep wake up and see it
        call    kern_leave
        ret

; A rower of its own thread.
rower_thread:
        sub     rsp, 8
        call    run_all
        add     rsp, 8
        xor     eax, eax
        ret

; The rowers: [remos] - 1 threads, and this one rows too. Returns when every cabin has ended.
row:
        push    r12 r13
        sub     rsp, 8
        mov     rdx, [remos]
        shl     rdx, 3
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     r13, rax                ; their handles
        mov     r12d, 1
        jmp     .start
.start_lap:
        invoke  CreateThread, 0, ROWER_STACK, rower_thread, 0, STACK_SIZE_PARAM_IS_A_RESERVATION, 0
        test    rax, rax
        jz      fail_file
        mov     [r13 + r12*8], rax
        inc     r12
.start:                                 ; while rowers are missing
        cmp     r12, [remos]
        jb      .start_lap
        call    run_all
        mov     r12d, 1
        jmp     .wait
.wait_lap:
        invoke  WaitForSingleObject, qword [r13 + r12*8], -1
        invoke  CloseHandle, qword [r13 + r12*8]
        inc     r12
.wait:                                  ; while rowers are still out
        cmp     r12, [remos]
        jb      .wait_lap
        invoke  VirtualFree, r13, 0, MEM_RELEASE
        add     rsp, 8
        pop     r13 r12
        ret
