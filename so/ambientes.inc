; Rooms (Capitan): "each cabin has its room; when the order to grow is given a room is added and built in
; the same cabin; when the room is no longer wanted only that room is destroyed", and "if a hole is left
; between one room and another, join the ends and free the page if it is left free".
;
; A Janax address says which room and where in it: the room's number in the high 32 bits, the position in
; the low 32. Room 0 is the first room, [0, DATA_SIZE), so every program that never grows sees the same
; addresses as always. The kernel translates, so rooms can move inside the hull without the program
; noticing: destroying a room moves the rooms after it back over the hole, and the cabin never has gaps.
;
; The hull is reserved once and never moves. Rooms are packed one after another, each of the size its order
; asked for (rounded up to 8 bytes, Janax's widest access, so every room starts aligned). The host is asked
; for exactly the pages that hold every room: the page is adjustable, only delivered in fixed parts. When a
; room is destroyed the pages left over at the end go back to the host, and the bytes left over in the last
; page are zeroed, so a new room always starts in zeros.
;
; Room table of a process (P_ROOMS): one entry {base in the hull, size} per room number, made at the first
; grow with room 0 in it; size 0 = destroyed, and its number is reused by the next room built (never 0:
; room 0 is always at base 0, which keeps its accesses at one comparison). No table = only room 0.
; P_LIM1 = room 0's size, P_LIM8 = that - 7 (0 if less): an access to room 0 below them needs nothing else.

ROOM_SHIFT = 32                         ; a room's number starts at this bit of an address

; The fixed package every memory access past room 0's fast limit runs: it translates the whole address
; in one block (no call, no stack), and it is still that one Janax instruction.
; rax = Janax address -> rax = its offset in the hull, or a jump to fail. Uses rcx, r9.
macro room_package width, fail {
          mov     rcx, rax
          shr     rcx, ROOM_SHIFT         ; the room
          jz      fail                    ; room 0 past its limit: outside
          cmp     rcx, [rbx + P_NROOMS]
          jae     fail                    ; also when there is no table
          shl     rcx, 4
          add     rcx, [rbx + P_ROOMS]
          mov     eax, eax                ; the position in it
          lea     r9, [rax + width]
          cmp     r9, [rcx + 8]
          ja      fail                    ; past its size (a destroyed room has size 0)
          add     rax, [rcx]              ; plus its base
}

; A new room of rax bytes at the end of the cabin. -> rax = its address (its number << ROOM_SHIFT), -1 if
; it does not fit or there is no memory. Keeps rbx, rbp, r12-r15.
rooms_grow:
        push    rsi rdi
        sub     rsp, 8
        test    rax, rax
        jz      .invalid                ; a room of nothing
        add     rax, 7
        jc      .invalid
        and     rax, -8
        mov     rdi, rax                ; its size
        mov     rsi, [rbx + P_SIZE]     ; its base: the end of the cabin
        add     rax, rsi
        jc      .invalid
        mov     rcx, HULL_SIZE
        cmp     rax, rcx
        ja      .invalid
        mov     rcx, [page_size]        ; the pages that hold it, from the one where it starts
        neg     rcx
        and     rcx, rsi
        mov     rdx, rax
        sub     rdx, rcx
        add     rcx, [rbx + P_DATA]
        invoke  VirtualAlloc, rcx, rdx, MEM_COMMIT, PAGE_READWRITE
        test    rax, rax
        jz      .invalid
        cmp     qword [rbx + P_ROOMS], 0
        jne     @f
        call    rooms_double            ; the table, with room 0 in it
        test    rax, rax
        jz      .invalid
@@:     mov     rdx, 1                  ; the lowest free number (never 0)
        mov     rcx, [rbx + P_ROOMS]
        jmp     .free
.free_lap:
        mov     rax, rdx
        shl     rax, 4
        cmp     qword [rcx + rax + 8], 0
        je      .number
        inc     rdx
.free:
        cmp     rdx, [rbx + P_NROOMS]
        jb      .free_lap
        cmp     rdx, [rbx + P_ROOMCAP]  ; a new number at the end of the table
        jb      @f
        mov     [rooms_number], rdx
        call    rooms_double
        test    rax, rax
        jz      .invalid
        mov     rdx, [rooms_number]
@@:     inc     qword [rbx + P_NROOMS]
.number:
        mov     rax, rdx
        shl     rax, 4
        add     rax, [rbx + P_ROOMS]
        mov     [rax], rsi
        mov     [rax + 8], rdi
        add     [rbx + P_SIZE], rdi
        mov     rax, rdx
        shl     rax, ROOM_SHIFT
        jmp     .done
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; The room table doubles; the first time it is made with room 0 in it. -> rax = 0 if there is no memory.
; Keeps rsi, rdi.
rooms_double:
        push    rsi rdi
        sub     rsp, 8
        mov     rdx, [rbx + P_ROOMCAP]
        add     rdx, rdx
        jnz     @f
        mov     edx, 2
@@:     mov     [rooms_newcap], rdx
        shl     rdx, 4
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .done
        mov     rdi, rax
        mov     rsi, [rbx + P_ROOMS]
        test    rsi, rsi
        jnz     .copy
        mov     qword [rdi], 0          ; room 0
        mov     rcx, [rbx + P_LIM1]
        mov     [rdi + 8], rcx
        mov     qword [rbx + P_NROOMS], 1
        jmp     .copied
.copy:
        mov     rcx, [rbx + P_NROOMS]
        add     rcx, rcx
        rep     movsq
        mov     [rooms_new], rax
        invoke  VirtualFree, qword [rbx + P_ROOMS], 0, MEM_RELEASE
        mov     rax, [rooms_new]
.copied:
        mov     [rbx + P_ROOMS], rax
        mov     rcx, [rooms_newcap]
        mov     [rbx + P_ROOMCAP], rcx
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; Destroys the room at address rax: the rooms after it move back over its place and the pages left over at
; the end go back to the host. -> rax = 0, or -1 if no room is at that address or it holds the queue being
; served (its answers need somewhere to go). Keeps rbx, rbp, r12-r15.
rooms_destroy:
        push    rsi rdi r12 r13
        sub     rsp, 8
        mov     rdx, rax
        shr     rdx, ROOM_SHIFT         ; its number
        mov     rcx, rdx
        shl     rcx, ROOM_SHIFT
        cmp     rcx, rax
        jne     .invalid                ; not the start of a room
        mov     rcx, [queue_addr]
        shr     rcx, ROOM_SHIFT
        cmp     rcx, rdx
        je      .invalid                ; the queue is inside
        cmp     qword [rbx + P_ROOMS], 0
        jne     @f
        test    rdx, rdx
        jnz     .invalid                ; no table: only room 0, and the queue is in it
        mov     [rooms_number], rdx
        call    rooms_double
        test    rax, rax
        jz      .invalid
        mov     rdx, [rooms_number]
@@:     cmp     rdx, [rbx + P_NROOMS]
        jae     .invalid
        mov     rsi, rdx
        shl     rsi, 4
        add     rsi, [rbx + P_ROOMS]
        mov     r12, [rsi]              ; base
        mov     r13, [rsi + 8]          ; size
        test    r13, r13
        jz      .invalid                ; already destroyed
        mov     qword [rsi], 0
        mov     qword [rsi + 8], 0
        test    rdx, rdx
        jnz     @f
        mov     qword [rbx + P_LIM1], 0 ; room 0 is gone: its accesses take the long check (and fail)
        mov     qword [rbx + P_LIM8], 0
@@:     mov     rcx, [rbx + P_NROOMS]   ; every room after it moves back by its size
        mov     rsi, [rbx + P_ROOMS]
        jmp     .move
.move_lap:
        cmp     [rsi], r12
        jbe     @f
        sub     [rsi], r13
@@:     add     rsi, 16
        dec     rcx
.move:
        test    rcx, rcx
        jnz     .move_lap
        mov     rdi, r12                ; join the ends: [base + size, end) goes to base
        add     rdi, [rbx + P_DATA]
        lea     rsi, [rdi + r13]
        mov     rcx, [rbx + P_SIZE]
        sub     rcx, r12
        sub     rcx, r13
        shr     rcx, 3
        rep     movsq
        mov     rax, [rbx + P_SIZE]     ; the old end
        sub     [rbx + P_SIZE], r13
        mov     rcx, [page_size]        ; the bytes left over in the new end's page are zeroed
        dec     rcx
        mov     rdi, [rbx + P_SIZE]
        lea     r12, [rdi + rcx]
        not     rcx
        and     r12, rcx                ; the first page left whole: from here on they go back
        add     rax, [page_size]
        dec     rax
        and     rax, rcx                ; up to the old end's page
        mov     rcx, r12
        cmp     rcx, rax
        jbe     @f
        mov     rcx, rax
@@:     sub     rcx, rdi
        add     rdi, [rbx + P_DATA]
        mov     r13, rax
        xor     eax, eax
        rep     stosb
        cmp     r12, r13
        jae     .trim
        mov     rdx, r13
        sub     rdx, r12
        add     r12, [rbx + P_DATA]
        invoke  VirtualFree, r12, rdx, MEM_DECOMMIT
.trim:                                  ; destroyed numbers at the end of the table leave it (room 0 stays)
        mov     rcx, [rbx + P_NROOMS]
        mov     rsi, [rbx + P_ROOMS]
        jmp     .last
.last_lap:
        dec     rcx
        mov     [rbx + P_NROOMS], rcx
.last:
        cmp     rcx, 1
        jbe     .trimmed
        mov     rax, rcx
        shl     rax, 4
        cmp     qword [rsi + rax - 8], 0
        je      .last_lap
.trimmed:
        xor     eax, eax
        jmp     .done
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     r13 r12 rdi rsi
        ret

; Translates the Janax address rax for an access of rdx bytes. -> rax = its offset in the hull, CF = 0; or
; CF = 1 if those bytes are not all inside one room standing. Keeps every other register.
room_at:
        push    rcx rdx rsi
        mov     rcx, rax
        shr     rcx, ROOM_SHIFT         ; the room
        mov     esi, eax                ; the position in it
        add     rdx, rsi
        jc      .no
        test    rcx, rcx
        jnz     .table
        cmp     rdx, [rbx + P_LIM1]     ; room 0: always at base 0
        ja      .no
        mov     rax, rsi
        jmp     .yes
.table:
        cmp     rcx, [rbx + P_NROOMS]
        jae     .no                     ; also when there is no table
        shl     rcx, 4
        add     rcx, [rbx + P_ROOMS]
        cmp     rdx, [rcx + 8]
        ja      .no                     ; past its size (a destroyed room has size 0)
        mov     rax, rsi
        add     rax, [rcx]
.yes:
        pop     rsi rdx rcx
        clc
        ret
.no:
        pop     rsi rdx rcx
        stc
        ret

; The same, as a pointer the kernel can use. -> rax = the bytes' address in this process, CF as room_at.
cabin_at:
        call    room_at
        jc      .no
        add     rax, [rbx + P_DATA]
        clc
.no:
        ret

