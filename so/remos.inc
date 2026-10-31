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


; One rower (Capitan: "the free oar is the one used: free ones are used, used ones are freed, in the order
; they arrive, with no extra cost"). The cabins wait in one line in the order they arrived; a free rower
; takes the first one, rows its own turn (P_QUANTUM, from its priority) and puts it at the end of the line.
; A cabin that is born or wakes up also goes to the end. Taking a cabin is taking the first of the line:
; no cabin is looked at, nothing is computed. With nobody in line, a rower sleeps while others row; when
; nobody rows either, the cabins left wait for signatures (or every cabin has ended).
run_all:
        call    kern_enter
        jmp     .next
.lap:                                   ; rax = the first in line, 0 = nobody
        test    rax, rax
        jnz     .row
        cmp     qword [rowing], 0
        jne     .sleep
        xor     ecx, ecx                ; nobody rows: is anyone waiting for a signature?
        jmp     .waits
.waits_lap:
        mov     rsi, [procs]
        mov     rsi, [rsi + rcx*8]
        cmp     qword [rsi + P_DONE], 0
        jne     .waits_next
        cmp     qword [rsi + P_WAITING], 0
        jne     .nobody
.waits_next:
        inc     rcx
.waits:                                 ; while there are cabins to look at
        cmp     rcx, [nprocs]
        jb      .waits_lap
        jmp     .end                    ; nobody waits: every cabin has ended
.nobody:
        call    nobody_signs            ; everyone left waits for a signature nobody can give
        jmp     .next
.sleep:
        call    kern_sleep              ; nothing in line while others row: wait for a change
        jmp     .next
.row:
        mov     rbx, rax
        cmp     qword [rbx + P_DONE], 0
        jne     .next
        cmp     qword [rbx + P_WAITING], 0
        jne     .next
        mov     rax, [rbx + P_QUANTUM]  ; its own turn, from its priority
        inc     qword [switches]
        mov     qword [rbx + P_RUNNING], 1
        inc     qword [rowing]
        call    kern_leave
        call    run_process             ; outside the lock: the cabins row side by side
        call    kern_enter
        mov     qword [rbx + P_RUNNING], 0
        dec     qword [rowing]
        add     [rbx + P_SERVED], rax
        add     [clock], rax
        call    kern_wake               ; a cabin came back: the rowers asleep look again
        cmp     qword [rbx + P_DONE], 0
        jne     .ended
        cmp     qword [rbx + P_WAITING], 0
        jne     .next                   ; it waits for a signature: out of the line until it wakes up
        mov     rax, rbx
        call    q_push                  ; to the end of the line
        jmp     .next
.ended:
        call    close_files             ; whatever the process left open
        call    orphans                 ; its children and what waited for its signature go up
        cmp     byte [quiet], 0
        jne     .next
        call    report
.next:
        call    q_pop
        jmp     .lap
.end:
        call    kern_wake               ; all ended: the rowers asleep wake up and see it
        call    kern_leave
        ret

; The line of cabins waiting for an oar, in the order they arrived (linked by P_NEXT). With the lock.
; rax = a cabin: to the end of the line, if it is not in it. Keeps every register.
q_push:
        cmp     qword [rax + P_QUEUED], 0
        jne     .done
        mov     qword [rax + P_QUEUED], 1
        mov     qword [rax + P_NEXT], 0
        push    rcx
        mov     rcx, [q_tail]
        test    rcx, rcx
        jz      .first
        mov     [rcx + P_NEXT], rax
        jmp     .last
.first:
        mov     [q_head], rax
.last:
        mov     [q_tail], rax
        pop     rcx
.done:
        ret

; -> rax = the first in line, out of it; 0 if nobody. Keeps every other register.
q_pop:
        mov     rax, [q_head]
        test    rax, rax
        jz      .done
        push    rcx
        mov     rcx, [rax + P_NEXT]
        mov     [q_head], rcx
        test    rcx, rcx
        jnz     @f
        mov     [q_tail], rcx
@@:     mov     qword [rax + P_QUEUED], 0
        pop     rcx
.done:
        ret

; r8 = a cabin whose signature arrived: to the end of the line if it can row now. Keeps every register.
q_wake:
        cmp     qword [r8 + P_WAITING], 0
        jne     .done
        cmp     qword [r8 + P_DONE], 0
        jne     .done
        cmp     qword [r8 + P_RUNNING], 0
        jne     .done                   ; its rower puts it in line when it comes back
        push    rax
        mov     rax, r8
        call    q_push
        pop     rax
.done:
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

; The last part of a program (Capitan: "the combination of instructions that marks the last part: when it
; appears, it already knows that it ends"). Found in the code itself, so a program can not lie about it: for
; each word, how many instructions are left to its jhalt by the straight way (instructions that only fall
; through, then the jhalt), 0 if it is not on such a way. When a turn is spent and what is left of the last
; part costs no more than passing the oar, the cabin finishes first. Computed once when a program is born,
; shared by its copies. Keeps rbx, rbp, r12-r15.
end_table:
        push    rsi rdi
        sub     rsp, 8
        mov     rdx, [rbx + P_NWORDS]
        lea     rdx, [rdx*4 + 4]
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_TAIL], rax
        mov     rdi, rax
        mov     rsi, [rbx + P_PROG]
        mov     rcx, [rbx + P_NWORDS]
        mov     dword [rdi + rcx*4], 0  ; past the end there is no way
        jmp     .word
.word_lap:
        dec     rcx
        movzx   eax, byte [rsi + rcx*4] ; its op
        test    eax, eax
        jnz     @f
        mov     dword [rdi + rcx*4], 1  ; jhalt: one to go
        jmp     .word
@@:     cmp     eax, 0Ch
        jb      .falls                  ; jldi and the arithmetic fall through
        cmp     eax, 0Fh
        je      .falls                  ; jshi
        cmp     eax, 10h
        jb      .none                   ; jumps
        cmp     eax, 13h
        jbe     .falls                  ; memory
.none:                                  ; calls, returns, the windows, anything else: not a straight way
        mov     dword [rdi + rcx*4], 0
        jmp     .word
.falls:                                 ; one more than the next word, if the next one is on a straight way
        mov     edx, [rdi + rcx*4 + 4]
        test    edx, edx
        jz      @f
        inc     edx
@@:     mov     [rdi + rcx*4], edx
.word:                                  ; while words are left, from the last one back
        test    rcx, rcx
        jnz     .word_lap
        add     rsp, 8
        pop     rdi rsi
        ret
