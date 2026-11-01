; Rooms (Capitan): "each cabin has its room; when the order to grow is given a room is added and built in
; the same cabin; when the room is no longer wanted only that room is destroyed".
;
; A Janax address says which room and where in it: the room's number in the high 32 bits, the position in
; the low 32 (Capitan: "two of 32 make one of 64"). Room 0 is the first room, so every program that never
; grows sees the same addresses as always. The kernel translates, so a room's place in memory is never seen
; by the program.
;
; Each room lives in its own drawer (Capitan: "the cartel says where each box is and how to treat it"): the
; addresses of the largest room (ROOM_MAX) plus one page are reserved for it alone, and only the pages that
; hold it are asked for. The room leans against the END of those pages, so the byte right after it is
; already an address the processor refuses: past a room's end, the processor stops the access by itself,
; byte for byte, with no question asked (the translated engine counts on it; the routines and the
; interpreter still ask, and are the reference). A room's size is rounded up to 8 bytes, Janax's widest
; access, so every room starts aligned. A new room always starts in zeros: its pages are new.
;
; Room numbers are never reused (Capitan: "the holes are a count of the rooms that were and are no more,
; they can not be replaced to confuse, only new ones added; and if every room of that sailor is destroyed
; the count starts again"): a new room gets the next number (P_NEXTROOM), so the address of a destroyed
; room dies with it. When every room but room 0 is gone the count starts again at 1, and from then on the
; program must not use the addresses it kept from before: for the processor they are only numbers.
;
; The cartel of a process (P_ROOMS): entry 0 is room 0; entry k (k >= 1) is room P_ROOMBASE + k. An entry
; is 16 bytes: the cartel's own 8 (the room's place in the low 48 bits, how to treat it in the high 16), and
; its size (0 = destroyed). A destroyed room points at the dead drawer: addresses reserved once and never
; given, so any access through it is refused by the processor. The cartel spans from the lowest room
; standing to the highest (Capitan: "the count goes from the minimum"): destroyed rooms at either end leave
; it. No cartel = only room 0.
; P_DATA = room 0's place (the dead drawer while there is none), P_LIM1 = room 0's size, P_LIM8 = that - 7
; (0 if less): an access to room 0 below them needs nothing else.

ROOM_SHIFT = 32                         ; a room's number starts at this bit of an address

; How to treat a box, in the high 16 bits of its cartel entry (Capitan). All zeros is the safest: an entry
; nobody filled allows nothing. The processor keeps the first four with no question per access.
ROOM_READ    = 1 shl 48                 ; it can be read
ROOM_WRITE   = 1 shl 49                 ; it can be written
ROOM_EXEC    = 1 shl 50                 ; it can be run
ROOM_ALIVE   = 1 shl 51                 ; it stands (0 = destroyed: its address died)
ROOM_APPEND  = 1 shl 52                 ; only added to, never overwritten
ROOM_NOTIFY  = 1 shl 53                 ; a change wakes whoever waits on it
ROOM_SIGNED  = 1 shl 54                 ; changing it needs its owner's signature
ROOM_SHARED  = 1 shl 55                 ; shared with the children
ROOM_INHERIT = 1 shl 56                 ; inherited (0 = it dies with its owner)
ROOM_PIECE   = 57                       ; 2 bits: its piece, 1 shl n bytes
ROOM_PRIO    = 59                       ; 3 bits: its priority when fast memory runs short
ROOM_PARENT  = 1 shl 62                 ; it has children
ROOM_TAKES   = 1 shl 63                 ; it takes its children when it dies (0 = the grandmother adopts them)
ROOM_LIVE    = ROOM_READ + ROOM_WRITE + ROOM_ALIVE   ; a new room

; The fixed package every memory access past room 0's fast limit runs: it translates the whole address
; in one block (no call, no stack), and it is still that one Janax instruction.
; rax = Janax address, need = the bit of the treatment the access needs (48 read, 49 write) -> rax = its
; place minus r15 (so [r15 + rax] is the byte), or a jump to fail. Uses rcx, r9.
macro room_package width, need, fail {
  local table, entry
          mov     rcx, rax
          shr     rcx, ROOM_SHIFT         ; the room
          jnz     table
          cmp     qword [rbx + P_ROOMS], 0
          je      fail                    ; room 0 past its limit, and no cartel: outside
          jmp     entry                   ; room 0 past its fast limit: by its entry
  table:
          sub     rcx, [rbx + P_ROOMBASE] ; its entry
          jbe     fail                    ; below the cartel: gone
          cmp     rcx, [rbx + P_NROOMS]
          jae     fail                    ; past it, or there is no cartel
  entry:
          shl     rcx, 4
          add     rcx, [rbx + P_ROOMS]
          mov     eax, eax                ; the position in it
          lea     r9, [rax + width]
          cmp     r9, [rcx + 8]
          ja      fail                    ; past its size (a destroyed room has size 0)
          mov     r9, [rcx]
          bt      r9, need
          jnc     fail                    ; its treatment does not allow it
          shl     r9, 16                  ; its place, without how to treat it
          shr     r9, 16
          sub     r9, r15
          add     rax, r9
}

; A drawer for a room of rax bytes (a multiple of 8, 1 to ROOM_MAX). -> rax = the room's place, leaning
; against the end of its pages, or 0 if there are no addresses or no memory. Keeps rbx, rsi, rdi, rbp,
; r12-r15.
room_drawer:
        push    rsi rdi
        sub     rsp, 8
        mov     rsi, rax                ; its size
        mov     rdi, [page_size]        ; the pages that hold it
        dec     rdi
        add     rdi, rax
        mov     rcx, [page_size]
        neg     rcx
        and     rdi, rcx
        mov     rdx, ROOM_MAX           ; its addresses: every position, and one page for the widest access
        add     rdx, rdi
        add     rdx, [page_size]
        invoke  VirtualAlloc, 0, rdx, MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .done
        mov     [rsp], rax
        invoke  VirtualAlloc, rax, rdi, MEM_COMMIT, PAGE_READWRITE
        test    rax, rax
        jz      .no_memory
        mov     rax, [rsp]
        add     rax, rdi
        sub     rax, rsi
        jmp     .done
.no_memory:
        invoke  VirtualFree, qword [rsp], 0, MEM_RELEASE
        xor     eax, eax
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; The drawer of the room at place rax, of rcx bytes, goes back to the host, addresses and all. Keeps rbx,
; rsi, rdi, rbp, r12-r15.
room_drawer_free:
        sub     rsp, 8
        mov     rdx, [page_size]        ; its pages end where the room ends
        dec     rdx
        lea     r8, [rcx + rdx]
        not     rdx
        and     r8, rdx
        add     rax, rcx
        sub     rax, r8
        invoke  VirtualFree, rax, 0, MEM_RELEASE
        add     rsp, 8
        ret

; A new room of rax bytes, in its own drawer. -> rax = its address (its number << ROOM_SHIFT), -1 if it
; does not fit or there is no memory. Keeps rbx, rbp, r12-r15.
rooms_grow:
        push    rsi rdi
        sub     rsp, 8
        test    rax, rax
        jz      .invalid                ; a room of nothing
        add     rax, 7
        jc      .invalid
        and     rax, -8
        mov     rcx, ROOM_MAX
        cmp     rax, rcx
        ja      .invalid
        mov     rdi, rax                ; its size
        call    room_drawer
        test    rax, rax
        jz      .invalid
        mov     rsi, rax                ; its place
        cmp     qword [rbx + P_ROOMS], 0
        jne     @f
        call    rooms_double            ; the cartel, with room 0 in it
        test    rax, rax
        jz      .no_cartel
@@:     mov     rdx, [rbx + P_NEXTROOM] ; its number: the next one, never one that was
        test    rdx, rdx
        jnz     @f
        mov     edx, 1
@@:     mov     [rooms_number], rdx
        jmp     .room
.room_lap:                              ; the cartel doubles until its entry fits
        call    rooms_double
        test    rax, rax
        jz      .no_cartel
.room:
        mov     rdx, [rooms_number]
        sub     rdx, [rbx + P_ROOMBASE] ; its entry
        cmp     rdx, [rbx + P_ROOMCAP]
        jae     .room_lap
        mov     rcx, [rbx + P_NROOMS]   ; entries between the last one and it: rooms destroyed
        mov     r8, [dead_drawer]
        jmp     .gap
.gap_lap:
        mov     rax, rcx
        shl     rax, 4
        add     rax, [rbx + P_ROOMS]
        mov     [rax], r8
        mov     qword [rax + 8], 0
        inc     rcx
.gap:                                   ; while entries are missing before its own
        cmp     rcx, rdx
        jb      .gap_lap
        lea     rax, [rdx + 1]
        mov     [rbx + P_NROOMS], rax
        mov     rax, [rooms_number]
        inc     rax
        mov     [rbx + P_NEXTROOM], rax
        mov     rcx, rdx
        shl     rcx, 4
        add     rcx, [rbx + P_ROOMS]
        mov     rax, ROOM_LIVE
        or      rax, rsi
        mov     [rcx], rax
        mov     [rcx + 8], rdi
        add     [rbx + P_SIZE], rdi
        mov     rax, [rooms_number]
        shl     rax, ROOM_SHIFT
        jmp     .done
.no_cartel:
        mov     rax, rsi
        mov     rcx, rdi
        call    room_drawer_free
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; The cartel doubles; the first time it is made with room 0 in it. -> rax = 0 if there is no memory.
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
        mov     rcx, [rbx + P_LIM1]     ; room 0, or the dead drawer if there is none
        mov     [rdi + 8], rcx
        mov     rdx, [dead_drawer]
        test    rcx, rcx
        jz      @f
        mov     rdx, ROOM_LIVE
        or      rdx, [rbx + P_DATA]
@@:     mov     [rdi], rdx
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

; Destroys the room at address rax: its drawer goes back to the host and its entry points at the dead
; drawer, so its address dies with it. The other rooms stay where they are. Its number is never given again
; (until every room but room 0 is gone). -> rax = 0, or -1 if no room is at that address or it holds the
; queue being served (its answers need somewhere to go). Keeps rbx, rbp, r12-r15.
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
        jnz     .invalid                ; no cartel: only room 0, and the queue is in it
        mov     [rooms_number], rdx
        call    rooms_double
        test    rax, rax
        jz      .invalid
        mov     rdx, [rooms_number]
@@:     test    rdx, rdx
        jz      .entry                  ; room 0: entry 0
        sub     rdx, [rbx + P_ROOMBASE] ; its entry
        jbe     .invalid                ; below the cartel: already gone
.entry:
        cmp     rdx, [rbx + P_NROOMS]
        jae     .invalid
        mov     rsi, rdx
        shl     rsi, 4
        add     rsi, [rbx + P_ROOMS]
        mov     r12, [rsi]              ; its place
        shl     r12, 16
        shr     r12, 16
        mov     r13, [rsi + 8]          ; its size
        test    r13, r13
        jz      .invalid                ; already destroyed
        mov     rax, [dead_drawer]
        mov     [rsi], rax
        mov     qword [rsi + 8], 0
        test    rdx, rdx
        jnz     @f
        mov     qword [rbx + P_LIM1], 0 ; room 0 is gone: its accesses take the long check (and fail)
        mov     qword [rbx + P_LIM8], 0
        mov     [rbx + P_DATA], rax
@@:     sub     [rbx + P_SIZE], r13
        mov     rax, r12
        mov     rcx, r13
        call    room_drawer_free
.trim:                                  ; destroyed numbers at the end of the cartel leave it (room 0 stays)
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
        cmp     qword [rbx + P_NROOMS], 1
        ja      .low
        mov     qword [rbx + P_ROOMBASE], 0   ; no room left but room 0: the count starts again
        mov     qword [rbx + P_NEXTROOM], 1
        jmp     .slid
.low:                                   ; destroyed rooms at the start of the cartel leave it too
        mov     rsi, [rbx + P_ROOMS]
        mov     ecx, 1
        jmp     .lead
.lead_lap:
        inc     rcx
.lead:                                  ; while the entry is a room destroyed (the last one stands)
        mov     rax, rcx
        shl     rax, 4
        cmp     qword [rsi + rax + 8], 0
        je      .lead_lap
        dec     rcx                     ; how many leave
        jz      .slid
        add     [rbx + P_ROOMBASE], rcx
        sub     [rbx + P_NROOMS], rcx
        lea     rdi, [rsi + 16]         ; entries 1 + d... move to 1...
        shl     rcx, 4
        lea     rsi, [rdi + rcx]
        mov     rcx, [rbx + P_NROOMS]
        dec     rcx
        shl     rcx, 1                  ; in qwords
        rep     movsq
.slid:
        xor     eax, eax
        jmp     .done
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     r13 r12 rdi rsi
        ret

; How to treat the room at address rax (Capitan: "the cartel is at the same time a pointer and how the box
; must be treated"): rdx = bit 0 read, bit 1 write, the treatments built so far. The processor keeps them
; (the pages of the room are protected to match), so an access the box does not allow costs nothing until
; it happens, and then ends the process with code 5, the same as the routines and the interpreter, which
; ask. A box written but not read can not be (the processor can not keep it), nor one that takes the write
; from the room the queue is in (its answers need somewhere to go); the kernel touches only a box its owner
; can read and write (room_at). -> rax = 0, or -1 if refused. Keeps rbx, rbp, r12-r15.
rooms_treat:
        push    rsi rdi r12 r13
        sub     rsp, 8
        cmp     rdx, 3
        ja      .invalid                ; a treatment not built yet
        cmp     rdx, 2
        je      .invalid                ; written but not read
        mov     r12, rdx
        mov     rdx, rax
        shr     rdx, ROOM_SHIFT         ; its number
        mov     rcx, rdx
        shl     rcx, ROOM_SHIFT
        cmp     rcx, rax
        jne     .invalid                ; not the start of a room
        cmp     r12, 3
        je      @f
        mov     rcx, [queue_addr]
        shr     rcx, ROOM_SHIFT
        cmp     rcx, rdx
        je      .invalid                ; the queue is inside and would lose its write
@@:     cmp     qword [rbx + P_ROOMS], 0
        jne     @f
        test    rdx, rdx
        jnz     .invalid                ; no cartel: only room 0
        mov     [rooms_number], rdx
        call    rooms_double
        test    rax, rax
        jz      .invalid
        mov     rdx, [rooms_number]
@@:     mov     r13, rdx                ; its entry
        test    rdx, rdx
        jz      .entry                  ; room 0: entry 0
        sub     r13, [rbx + P_ROOMBASE]
        jbe     .invalid                ; below the cartel: gone
.entry:
        cmp     r13, [rbx + P_NROOMS]
        jae     .invalid
        shl     r13, 4
        add     r13, [rbx + P_ROOMS]
        mov     rcx, [r13 + 8]          ; its size
        test    rcx, rcx
        jz      .invalid                ; destroyed
        mov     rsi, [r13]              ; its place
        shl     rsi, 16
        shr     rsi, 16
        mov     rax, [page_size]        ; its pages: from the one where it starts to its end
        dec     rax
        not     rax
        mov     rdi, rsi
        and     rdi, rax
        lea     rdx, [rsi + rcx]
        sub     rdx, rdi
        mov     r8d, PAGE_READWRITE
        cmp     r12, 3
        je      @f
        mov     r8d, PAGE_READONLY
        cmp     r12, 1
        je      @f
        mov     r8d, PAGE_NOACCESS
@@:     mov     r9, rsp                 ; the old protection, in its own slot (by registers: invoke moves
        invoke  VirtualProtect, rdi, rdx, r8, r9   ; rsp before it reads its arguments)
        test    eax, eax
        jz      .invalid
        mov     rax, r12                ; its new entry: its place, standing, and how to treat it
        shl     rax, 48
        or      rax, rsi
        mov     rcx, ROOM_ALIVE
        or      rax, rcx
        mov     [r13], rax
        mov     rax, r13
        sub     rax, [rbx + P_ROOMS]
        jnz     .done_ok                ; not room 0
        xor     eax, eax                ; room 0: its fast limit only while it can be read and written
        xor     ecx, ecx
        cmp     r12, 3
        jne     @f
        mov     rax, [r13 + 8]
        lea     rcx, [rax - 7]
@@:     mov     [rbx + P_LIM1], rax
        mov     [rbx + P_LIM8], rcx
.done_ok:
        xor     eax, eax
        jmp     .done
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     r13 r12 rdi rsi
        ret

; Translates the Janax address rax for an access of rdx bytes. -> rax = its place minus P_DATA, CF = 0; or
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
        cmp     rdx, [rbx + P_LIM1]     ; room 0: at P_DATA
        ja      .no
        mov     rax, rsi
        jmp     .yes
.table:
        sub     rcx, [rbx + P_ROOMBASE] ; its entry
        jbe     .no                     ; below the cartel: gone
        cmp     rcx, [rbx + P_NROOMS]
        jae     .no                     ; past it, or there is no cartel
        shl     rcx, 4
        add     rcx, [rbx + P_ROOMS]
        cmp     rdx, [rcx + 8]
        ja      .no                     ; past its size (a destroyed room has size 0)
        mov     rcx, [rcx]
        bt      rcx, 48
        jnc     .no                     ; the kernel touches only a box its owner can read and write
        bt      rcx, 49
        jnc     .no
        shl     rcx, 16                 ; its place, without how to treat it
        shr     rcx, 16
        lea     rax, [rcx + rsi]
        sub     rax, [rbx + P_DATA]
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


; A process is born without memory. Its first order (a jsys with no room yet) builds room 0 of rax bytes,
; with the size right in the register because there is nowhere to put a queue. j15 starts at its top, and
; the program's initial data (datos.inc) is copied to its start.
; -> rax = 0 (room 0's address), or -1 if it cannot be built (nothing asked, too big, no memory).
rooms_first:
        sub     rsp, 8
        test    rax, rax
        jz      .invalid
        add     rax, 7
        jc      .invalid
        and     rax, -8
        mov     rcx, ROOM_MAX
        cmp     rax, rcx
        ja      .invalid
        cmp     [rbx + P_INITLEN], rax
        ja      .invalid                ; its initial data does not fit
        mov     [rbx + P_SIZE], rax
        call    room_drawer
        test    rax, rax
        jz      .no_memory
        mov     [rbx + P_DATA], rax
        push    rsi rdi
        mov     rdi, [rbx + P_DATA]     ; its initial data at the start of the room
        mov     rsi, [rbx + P_INIT]
        mov     rcx, [rbx + P_INITLEN]
        rep     movsb
        pop     rdi rsi
        mov     rax, [rbx + P_SIZE]
        mov     [rbx + P_LIM1], rax
        mov     [rbx + P_REGS + 15*8], rax
        sub     rax, 7
        mov     [rbx + P_LIM8], rax
        xor     eax, eax
        jmp     .done
.no_memory:
        mov     qword [rbx + P_SIZE], 0
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        ret

; The return stack also weighs what it holds: reserved for RET_DEPTH entries (the limit, as in the
; interpreter) and committed as the calls need it, doubling from one page; at the end of a turn it halves
; while the depth uses a quarter or less of it (the rule that keeps growing and shrinking at a constant cost
; per call), never below one page; a process that ended gives it all back.

; One more step for the return stack of rbx. CF = 1 if it is at the limit or there is no memory. Callable
; with any stack alignment; keeps rbx, rsi, rdi, rbp, r12-r15.
ret_grow:
        mov     [rbx + P_SAVERSP], rsp
        and     rsp, -16
        mov     rax, [rbx + P_RETCAP]
        cmp     rax, RET_DEPTH
        jae     .no
        add     rax, rax
        jnz     @f
        mov     rax, [page_size]
        shr     rax, 3                  ; one page of entries
@@:     cmp     rax, RET_DEPTH
        jbe     @f
        mov     eax, RET_DEPTH
@@:     mov     [rbx + P_RETCAP], rax
        shl     rax, 3
        invoke  VirtualAlloc, qword [rbx + P_RET], rax, MEM_COMMIT, PAGE_READWRITE
        test    rax, rax
        jnz     .yes
        mov     rax, [rbx + P_RETCAP]   ; no memory: as it was
        shr     rax, 1
        mov     [rbx + P_RETCAP], rax
.no:
        mov     rsp, [rbx + P_SAVERSP]
        stc
        ret
.yes:
        mov     rsp, [rbx + P_SAVERSP]
        clc
        ret

; End of a turn of rbx: give back the part of the return stack it does not need. Callable with any stack
; alignment; keeps rbx, rsi, rdi, rbp, r12-r15.
ret_trim:
        mov     rax, [rbx + P_RETCAP]
        test    rax, rax
        jz      .done                   ; nothing committed
        cmp     qword [rbx + P_HELPER], 0
        jne     .done                   ; a kernel helper runs again: it keeps its stack
        xor     edx, edx                ; ended: all of it
        cmp     qword [rbx + P_DONE], 0
        jne     .give_back
        mov     rcx, [page_size]
        shr     rcx, 3
        cmp     rax, rcx
        jbe     .done                   ; one page stays while it lives
        mov     rdx, [rbx + P_DEPTH]
        shl     rdx, 2
        cmp     rdx, rax
        ja      .done                   ; it uses more than a quarter
        mov     rdx, rax
        shr     rdx, 1
.give_back:                             ; keep rdx entries
        mov     [rbx + P_SAVERSP], rsp
        and     rsp, -16
        mov     [rbx + P_RETCAP], rdx
        sub     rax, rdx
        shl     rax, 3
        shl     rdx, 3
        add     rdx, [rbx + P_RET]
        invoke  VirtualFree, rdx, rax, MEM_DECOMMIT
        mov     rsp, [rbx + P_SAVERSP]
.done:
        ret
