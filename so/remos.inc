; The rowers (Capitan: "parallelize the cabins, and take the smallest share of each core"): one rower per core
; of the processor (JANAX_REMOS sets how many). Only what is shared goes through the captain's lock: taking a
; cabin, the window (ventanilla), and what happens when a cabin ends. A rower with nothing to do sleeps until
; there is new work for it: it takes no processor at all, and its stack is small.
;
; Two kinds of rowers (Capitan: "as many rowers wake up as there is work, and one special rower works only
; with the processes that hold others, from the one that holds the most to the one that holds the least"):
;  - The line rowers take the cabins in the order they arrived. Only new work wakes a rower up, one per cabin:
;    a cabin born or woken up wakes a line rower asleep, or the special one if none is. A cabin that comes back
;    is taken again by its own rower.
;  - The special rower takes the cabin holding the most others (requests waiting for its signature) that
;    nobody is rowing, so whoever waits for it waits the least. With nobody holding anybody it rows the line
;    like everyone (Capitan: "the special one works on the special cases only when there are some; if not, it
;    is free for the normal work").
; With several rowers one is special and the rest row the line; with only one, it does both, one turn
; each.
;
; Each cabin gives the same result as always (cabins share nothing); the order between cabins and the clock
; depend on the rowers' pace.

ROWER_STACK = 10000h            ; bytes reserved for a rower's stack: what the engines and the window use,
                                ; with room to spare (committed only as it is used)
ROW_LINE    = 0                 ; a rower's kind: the line,
ROW_SPECIAL = 1                 ; the cabins that hold others,
ROW_BOTH    = 2                 ; or both, one turn each (when it is the only one)

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
; Every cabin ended: every rower asleep wakes up and goes home.
kern_wake:
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        mov     qword [asleep_line], 0
        lea     rcx, [kern_change]
        call    [WakeAllConditionVariable]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
        ret
; New work for the line: one rower asleep wakes up, a line rower if there is one asleep, else the special
; rower (with no cabins that hold others it rows the line too). With the lock.
kern_wake_one:
        cmp     qword [asleep_line], 0
        je      kern_wake_special
        dec     qword [asleep_line]
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rcx, [kern_change]
        call    [WakeConditionVariable]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
        ret
; Work for the special rower: it wakes up if it is asleep. With the lock.
kern_wake_special:
        cmp     qword [special_asleep], 0
        je      .awake
        mov     qword [special_asleep], 0
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rcx, [kern_special]
        call    [WakeConditionVariable]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
.awake:
        ret
; With the lock: sleeps until it is woken up (a line rower on kern_change, the special one on kern_special),
; and has the lock again.
kern_sleep:
        push    rax rcx rdx r8 r9 r10 r11 rbp
        inc     qword [asleep_line]
        lea     rcx, [kern_change]
        jmp     kern_sleep_on
kern_sleep_special:
        push    rax rcx rdx r8 r9 r10 r11 rbp
        mov     qword [special_asleep], 1
        lea     rcx, [kern_special]
kern_sleep_on:
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rdx, [kern_lock]
        mov     r8d, -1                 ; INFINITE: only being woken up wakes it
        call    [SleepConditionVariableCS]
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdx rcx rax
        ret


; One rower, of the kind in rcx (ROW_LINE, ROW_SPECIAL or ROW_BOTH), until every cabin has ended. A cabin
; is rowed its own turn (P_QUANTUM, from its priority) and goes back to the end of the line.
run_all:
        push    rcx                     ; [rsp + 24] = its kind
        sub     rsp, 24
        xor     eax, eax
        mov     [rsp], rax              ; both: 1 = this turn is for the cabins that hold others
        mov     [rsp + 8], rax          ; 1 = it was just woken up
        call    kern_enter
        jmp     .turn
.turn_lap:
        mov     rax, [rsp + 24]
        cmp     rax, ROW_LINE
        je      .line
        cmp     rax, ROW_SPECIAL
        je      .holders
        xor     qword [rsp], 1          ; both: every other turn for the cabins that hold others
        jz      .line
.holders:
        call    most_holding
        test    rax, rax
        jnz     .row                    ; nobody holds anybody: the line, like everyone
.line:
        call    q_pop
        test    rax, rax
        jnz     .row
        cmp     qword [rowing], 0
        je      .nobody_rows
        cmp     qword [rsp + 8], 0
        je      @f
        inc     qword [vain_wakes]      ; it was woken up for nothing (the instrument)
@@:     mov     qword [rsp + 8], 1
        cmp     qword [rsp + 24], ROW_SPECIAL
        je      @f
        call    kern_sleep              ; nothing in line while others row: wait for new work
        jmp     .turn
@@:     call    kern_sleep_special
        jmp     .turn
.nobody_rows:                           ; nobody rows: is anyone waiting for a signature?
        xor     ecx, ecx
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
        mov     byte [finished], 1      ; nobody waits: every cabin has ended
        call    kern_wake               ; the rowers asleep go home
        call    kern_wake_special
        jmp     .turn
.nobody:
        call    nobody_signs            ; everyone left waits for a signature nobody can give
        jmp     .turn
.row:
        mov     qword [rsp + 8], 0
        mov     rbx, rax
        cmp     qword [rbx + P_DONE], 0
        jne     .turn
        cmp     qword [rbx + P_WAITING], 0
        jne     .turn
        cmp     qword [rbx + P_RUNNING], 0
        jne     .turn                   ; another rower has it
        mov     rax, rbx
        call    q_remove                ; out of the line while it is rowed: it goes back to its end
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
        cmp     qword [rbx + P_DONE], 0
        jne     .ended
        cmp     qword [rbx + P_WAITING], 0
        jne     .back                   ; it waits for a signature: out of the line until it wakes up
        mov     rax, rbx
        call    q_push                  ; to the end of the line (if it is not still in it)
        cmp     qword [rbx + P_BLOCKS], 0
        je      .back
        call    kern_wake_special       ; it holds others and nobody rows it now
        jmp     .back
.ended:
        call    close_files             ; whatever the process left open
        call    orphans                 ; its children and what waited for its signature go up
        cmp     byte [quiet], 0
        jne     .back
        call    report
.back:
.turn:                                  ; while some cabin has not ended
        cmp     byte [finished], 0
        je      .turn_lap
        call    kern_leave
        add     rsp, 24
        pop     rcx
        ret

; -> rax = the cabin holding the most others (requests waiting for its signature) that nobody rows and can
; row now, the first one on a tie; 0 if there is none. With the lock. Keeps every other register.
most_holding:
        xor     eax, eax
        cmp     qword [held], 0
        je      .none                   ; nobody holds anybody: nothing to look at
        push    rcx rdx rsi
        xor     edx, edx                ; the most so far
        xor     ecx, ecx
        jmp     .one
.one_lap:
        mov     rsi, [procs]
        mov     rsi, [rsi + rcx*8]
        cmp     [rsi + P_BLOCKS], rdx
        jbe     .next
        cmp     qword [rsi + P_DONE], 0
        jne     .next
        cmp     qword [rsi + P_WAITING], 0
        jne     .next
        cmp     qword [rsi + P_RUNNING], 0
        jne     .next
        mov     rdx, [rsi + P_BLOCKS]
        mov     rax, rsi
.next:
        inc     rcx
.one:                                   ; while there are cabins to look at
        cmp     rcx, [nprocs]
        jb      .one_lap
        pop     rsi rdx rcx
.none:
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
        mov     [rax + P_PREV], rcx
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

; rax = a new cabin for the line (born or woken up): to its end, and one line rower wakes up for it.
q_push_wake:
        cmp     qword [rax + P_QUEUED], 0
        jne     .done
        call    q_push
        call    kern_wake_one
.done:
        ret

; rax = a cabin: out of the line, wherever it is in it. Keeps every register.
q_remove:
        cmp     qword [rax + P_QUEUED], 0
        je      .done
        mov     qword [rax + P_QUEUED], 0
        push    rcx rdx
        mov     rcx, [rax + P_PREV]
        mov     rdx, [rax + P_NEXT]
        test    rcx, rcx
        jz      .head
        mov     [rcx + P_NEXT], rdx
        jmp     @f
.head:
        mov     [q_head], rdx
@@:     test    rdx, rdx
        jz      .tail
        mov     [rdx + P_PREV], rcx
        jmp     .out
.tail:
        mov     [q_tail], rcx
.out:
        pop     rdx rcx
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
        jmp     .out
@@:     mov     qword [rcx + P_PREV], 0
.out:
        mov     qword [rax + P_QUEUED], 0
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
        call    q_push_wake
        pop     rax
.done:
        ret

; A rower of its own thread: rcx = its kind.
rower_thread:
        sub     rsp, 8
        call    run_all
        add     rsp, 8
        xor     eax, eax
        ret

; The rowers: [remos] - 1 threads, and this one rows too. With one, it does both kinds of work; with more,
; the first thread is the special rower and the rest row the line. Returns when every cabin has ended.
row:
        push    r12 r13
        sub     rsp, 8
        mov     byte [finished], 0
        mov     rdx, [remos]
        shl     rdx, 3
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     r13, rax                ; their handles
        mov     r12d, 1
        jmp     .start
.start_lap:
        mov     r9d, ROW_LINE           ; its kind: the thread's parameter (r9, the fourth)
        cmp     r12, 1
        jne     @f
        mov     r9d, ROW_SPECIAL
@@:     invoke  CreateThread, 0, ROWER_STACK, rower_thread, r9, STACK_SIZE_PARAM_IS_A_RESERVATION, 0
        test    rax, rax
        jz      fail_file
        mov     [r13 + r12*8], rax
        inc     r12
.start:                                 ; while rowers are missing
        cmp     r12, [remos]
        jb      .start_lap
        mov     ecx, ROW_LINE
        cmp     qword [remos], 1
        jne     @f
        mov     ecx, ROW_BOTH
@@:     call    run_all
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
