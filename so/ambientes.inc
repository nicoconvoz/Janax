; Rooms (Capitan): "each cabin has its room; when the order to grow is given a room is added and built in
; the same cabin; when the room is no longer wanted only that room is destroyed".
;
; A Janax address says which room and where in it: the room's number in the high 32 bits, the position in
; the low 32 (Capitan: "two of 32 make one of 64"). Room 0 is the first room, so every program that never
; grows sees the same addresses as always. The kernel translates, so a room's place in memory is never seen
; by the program.
;
; A room is a box (a section of the host), and each cabin that holds it sees it through its own view
; (Capitan: "the cartel says where each box is and how to treat it"). The view lives in its own drawer: the
; addresses of the largest room (ROOM_MAX) plus one page are reserved for it alone, and the box is mapped at
; their start, the room leaning against the END of its pages, so the byte right after it is already an
; address the processor refuses: past a room's end, the processor stops the access by itself, byte for byte,
; with no question asked (the translated engine counts on it; the routines and the interpreter still ask,
; and are the reference). Each view has its own treatment, so two cabins can hold one box, one to read and
; write and the other only to read, and the processor keeps both. Each holder has its own key to the box (a
; handle): the box lives while one key or one view does, and the host frees it when the last one lets go.
; A room's size is rounded up to 8 bytes, Janax's widest access, so every room starts aligned. A new box
; always starts in zeros.
;
; Room numbers are never reused (Capitan: "the holes are a count of the rooms that were and are no more,
; they can not be replaced to confuse, only new ones added; and if every room of that sailor is destroyed
; the count starts again"): a new room gets the next number (P_NEXTROOM), so the address of a destroyed
; room dies with it. When every room but room 0 is gone the count starts again at 1, and from then on the
; program must not use the addresses it kept from before: for the processor they are only numbers.
;
; The cartel of a process (P_ROOMS): entry 0 is room 0; entry k (k >= 1) is room P_ROOMBASE + k. An entry
; is ROOM_ENTRY bytes: the cartel's own 8 (the view's place in the low 48 bits, how to treat it in the high
; 16), its size (0 = destroyed), its key and the box's number (the same box has the same number in every
; cabin that holds it). A destroyed room points at the dead drawer: addresses reserved once and never given,
; so any access through it is refused by the processor. The cartel spans from the lowest room standing to the
; highest (Capitan: "the count goes from the minimum"): destroyed rooms at either end leave it. Its addresses
; are reserved once (CARTEL_MAX entries) and never move, so a box can arrive in a cabin while it rows: the
; entry is written first, the count after. No cartel = only room 0.
; P_DATA = room 0's place (the dead drawer while there is none), P_LIM1 = room 0's size, P_LIM8 = that - 7
; (0 if less): an access to room 0 below them needs nothing else.

ROOM_SHIFT = 32                         ; a room's number starts at this bit of an address
ROOM_ENTRY  = 32                        ; bytes per cartel entry
ROOM_ESHIFT = 5
RE_PLACE    = 0                         ; its place and how to treat it
RE_SIZE     = 8
RE_KEY      = 16                        ; this cabin's key to the box
RE_BOX      = 24                        ; the box's number
; Criterion, not a measurement: entries between a cabin's lowest and highest room standing (32 MiB of
; addresses per cabin, its pages committed as it needs them).
CARTEL_MAX  = 1 shl 20

; How to treat a box, in the high 16 bits of its cartel entry (Capitan). All zeros is the safest: an entry
; nobody filled allows nothing. The processor keeps the first four with no question per access.
ROOM_READ    = 1 shl 48                 ; it can be read
ROOM_WRITE   = 1 shl 49                 ; it can be written
ROOM_EXEC    = 1 shl 50                 ; it can be run
ROOM_ALIVE   = 1 shl 51                 ; it stands (0 = destroyed: its address died)
ROOM_APPEND  = 1 shl 52                 ; only added to, never overwritten
ROOM_NOTIFY  = 1 shl 53                 ; a change wakes whoever waits on it
ROOM_SIGNED  = 1 shl 54                 ; changing it needs its owner's signature
ROOM_SHARED  = 1 shl 55                 ; held by more than one cabin
ROOM_INHERIT = 1 shl 56                 ; inherited (0 = it dies with its owner)
ROOM_PIECE   = 57                       ; 2 bits: its piece, 1 shl n bytes
ROOM_PRIO    = 59                       ; 3 bits: its priority when fast memory runs short
ROOM_PARENT  = 1 shl 62                 ; it has children
ROOM_TAKES   = 1 shl 63                 ; it takes its children when it dies (0 = the grandmother adopts them)

; Placeholders of the host (VirtualAlloc2, MapViewOfFile3): addresses reserved to be replaced by a view.
MEM_RESERVE_PH  = 40000h
MEM_REPLACE_PH  = 4000h
MEM_PRESERVE_PH = 2

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
          shl     rcx, ROOM_ESHIFT
          add     rcx, [rbx + P_ROOMS]
          mov     eax, eax                ; the position in it
          lea     r9, [rax + width]
          cmp     r9, [rcx + RE_SIZE]
          ja      fail                    ; past its size (a destroyed room has size 0)
          mov     r9, [rcx]
          bt      r9, need
          jnc     fail                    ; its treatment does not allow it
          shl     r9, 16                  ; its place, without how to treat it
          shr     r9, 16
          sub     r9, r15
          add     rax, r9
}

; A new box of rax bytes (a multiple of 8, 1 to ROOM_MAX), in zeros. -> rax = its key, 0 if the host has no
; memory. Keeps rbx, rsi, rdi, rbp, r12-r15.
box_new:
        sub     rsp, 56
        mov     rcx, [page_size]        ; the pages that hold it
        dec     rcx
        add     rax, rcx
        not     rcx
        and     rax, rcx
        mov     r9, rax                 ; CreateFileMappingA(no file: the host's memory, plain, to read and
        shr     r9, 32                  ;   write, its size high and low, no name)
        mov     eax, eax
        mov     [rsp + 32], rax
        mov     qword [rsp + 40], 0
        mov     rcx, -1
        xor     edx, edx
        mov     r8d, PAGE_READWRITE
        call    [CreateFileMappingA]
        add     rsp, 56
        ret

; A view of the box with key rax, of rcx bytes, treated as rdx (bit 0 read, bit 1 write), in a drawer of
; its own. The view is mapped to read and write and then narrowed, so its treatment can come back up later
; (the cartel keeps how far). -> rax = the room's place, leaning against the end of its pages, or 0 if there
; are no addresses or no memory. Keeps rbx, rsi, rdi, rbp, r12-r15.
box_view:
        push    rsi rdi r12 r13
        sub     rsp, 104                ; the host's arguments past the fourth; the drawer at [rsp + 80]
        mov     r12, rax                ; its key
        mov     rsi, rcx                ; its size
        mov     r13, rdx                ; its treatment
        mov     rdi, [page_size]        ; the pages that hold it
        dec     rdi
        add     rdi, rcx
        mov     rcx, [page_size]
        neg     rcx
        and     rdi, rcx
        mov     r8, ROOM_MAX            ; its addresses: every position, and one page for the widest access
        add     r8, rdi
        add     r8, [page_size]
        xor     ecx, ecx                ; VirtualAlloc2(this process, anywhere, r8, a placeholder, refused)
        xor     edx, edx
        mov     r9d, MEM_RESERVE + MEM_RESERVE_PH
        mov     qword [rsp + 32], PAGE_NOACCESS
        mov     qword [rsp + 40], 0
        mov     qword [rsp + 48], 0
        call    [VirtualAlloc2]
        test    rax, rax
        jz      .done
        mov     [rsp + 80], rax
        mov     rcx, rax                ; its first pages, a placeholder of their own
        mov     rdx, rdi
        mov     r8d, MEM_RELEASE + MEM_PRESERVE_PH
        call    [VirtualFree]
        test    eax, eax
        jz      .release
        mov     rcx, r12                ; MapViewOfFile3(key, this process, the drawer, from 0, its pages,
        mov     rdx, -1                 ;   replacing the placeholder, to read and write)
        mov     r8, [rsp + 80]
        xor     r9d, r9d
        mov     [rsp + 32], rdi
        mov     qword [rsp + 40], MEM_REPLACE_PH
        mov     qword [rsp + 48], PAGE_READWRITE
        mov     qword [rsp + 56], 0
        mov     qword [rsp + 64], 0
        call    [MapViewOfFile3]
        test    rax, rax
        jz      .release_both
        cmp     r13, 3
        je      .placed
        mov     r8d, PAGE_READONLY      ; narrowed to its treatment
        cmp     r13, 1
        je      @f
        mov     r8d, PAGE_NOACCESS
@@:     mov     rcx, rax
        mov     rdx, rdi
        lea     r9, [rsp + 88]
        call    [VirtualProtect]
        test    eax, eax
        jz      .unmap
.placed:
        mov     rax, [rsp + 80]
        add     rax, rdi
        sub     rax, rsi
        jmp     .done
.unmap:
        mov     rcx, -1
        mov     rdx, [rsp + 80]
        xor     r8d, r8d
        call    [UnmapViewOfFile2]
.release_both:                          ; its first pages (if still a placeholder) and the rest
        mov     rcx, [rsp + 80]
        xor     edx, edx
        mov     r8d, MEM_RELEASE
        call    [VirtualFree]
        mov     rcx, [rsp + 80]
        add     rcx, rdi
        xor     edx, edx
        mov     r8d, MEM_RELEASE
        call    [VirtualFree]
        xor     eax, eax
        jmp     .done
.release:
        mov     rcx, [rsp + 80]
        xor     edx, edx
        mov     r8d, MEM_RELEASE
        call    [VirtualFree]
        xor     eax, eax
.done:
        add     rsp, 104
        pop     r13 r12 rdi rsi
        ret

; The view of the room at place rax, of rcx bytes, goes back to the host, its drawer too. The box stays
; while someone holds a key or a view. Keeps rbx, rsi, rdi, rbp, r12-r15.
box_unview:
        push    rsi rdi
        sub     rsp, 40
        mov     rdi, [page_size]        ; its pages end where the room ends
        dec     rdi
        add     rdi, rcx
        mov     rdx, [page_size]
        neg     rdx
        and     rdi, rdx
        lea     rsi, [rax + rcx]
        sub     rsi, rdi                ; its drawer
        mov     rcx, -1
        mov     rdx, rsi
        xor     r8d, r8d
        call    [UnmapViewOfFile2]
        lea     rcx, [rsi + rdi]        ; and the addresses behind it
        xor     edx, edx
        mov     r8d, MEM_RELEASE
        call    [VirtualFree]
        add     rsp, 40
        pop     rdi rsi
        ret

; Another key to the box with key rax. -> rax = it, 0 if the host refuses. Keeps rbx, rsi, rdi, rbp, r12-r15.
box_key:
        sub     rsp, 72
        mov     rdx, rax                ; DuplicateHandle(this process, key, this process, -> [rsp + 56], the same
        mov     rcx, -1                 ;   access)
        mov     r8, -1
        lea     r9, [rsp + 56]
        mov     qword [rsp + 32], 0
        mov     qword [rsp + 40], 0
        mov     qword [rsp + 48], 2
        call    [DuplicateHandle]
        test    eax, eax
        jz      @f
        mov     rax, [rsp + 56]
@@:     add     rsp, 72
        ret

; The key rax goes back. Keeps rbx, rsi, rdi, rbp, r12-r15.
box_close:
        sub     rsp, 40
        mov     rcx, rax
        call    [CloseHandle]
        add     rsp, 40
        ret

; The cartel of rbx, made: its addresses reserved, its first page committed, entry 0 (room 0, not built).
; -> rax = 0 if there is no memory. Keeps rsi, rdi.
rooms_cartel:
        sub     rsp, 8
        mov     rdx, CARTEL_MAX * ROOM_ENTRY
        invoke  VirtualAlloc, 0, rdx, MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .done
        mov     [rooms_new], rax
        invoke  VirtualAlloc, rax, [page_size], MEM_COMMIT, PAGE_READWRITE
        test    rax, rax
        jz      .free
        mov     rcx, [dead_drawer]      ; entry 0: room 0, until its first order builds it
        mov     [rax + RE_PLACE], rcx
        mov     rcx, [page_size]
        shr     rcx, ROOM_ESHIFT
        mov     [rbx + P_ROOMCAP], rcx
        mov     qword [rbx + P_NROOMS], 1
        mov     [rbx + P_ROOMS], rax    ; last: from here on it is seen
        jmp     .done
.free:
        invoke  VirtualFree, [rooms_new], 0, MEM_RELEASE
        xor     eax, eax
.done:
        add     rsp, 8
        ret

; Entry rdx of the cartel of rbx, committed. -> rax = 0 if it does not fit. Keeps rdx, rsi, rdi.
rooms_room:
        cmp     rdx, [rbx + P_ROOMCAP]
        jb      .yes
        cmp     rdx, CARTEL_MAX
        jae     .no
        push    rdx
        lea     rax, [rdx + 1]          ; the pages up to it
        shl     rax, ROOM_ESHIFT
        add     rax, [page_size]
        dec     rax
        mov     rcx, [page_size]
        neg     rcx
        and     rax, rcx
        mov     [rooms_newcap], rax
        invoke  VirtualAlloc, qword [rbx + P_ROOMS], rax, MEM_COMMIT, PAGE_READWRITE
        pop     rdx
        test    rax, rax
        jz      .no
        mov     rax, [rooms_newcap]
        shr     rax, ROOM_ESHIFT
        mov     [rbx + P_ROOMCAP], rax
.yes:
        mov     eax, 1
        ret
.no:
        xor     eax, eax
        ret

; A room for rbx with the view at [add_place] (and how to treat it), [add_size] bytes, key [add_key] and box
; [add_box]: it gets the next number. The entry is written before it is counted, so the cabin may be rowing.
; -> rax = its address, -1 if the cartel has no room. Keeps rbx, rbp, rsi, rdi, r12-r15.
room_add:
        push    rsi rdi
        sub     rsp, 8
        cmp     qword [rbx + P_ROOMS], 0
        jne     @f
        call    rooms_cartel
        test    rax, rax
        jz      .no
@@:     mov     rsi, [rbx + P_NEXTROOM] ; its number: the next one, never one that was
        test    rsi, rsi
        jnz     @f
        mov     esi, 1
@@:     mov     rdx, rsi
        sub     rdx, [rbx + P_ROOMBASE] ; its entry
        call    rooms_room
        test    rax, rax
        jz      .no
        mov     rcx, [rbx + P_NROOMS]   ; entries between the last one and it: rooms destroyed
        mov     r8, [dead_drawer]
        jmp     .gap
.gap_lap:
        mov     rax, rcx
        shl     rax, ROOM_ESHIFT
        add     rax, [rbx + P_ROOMS]
        mov     [rax + RE_PLACE], r8
        xor     edi, edi
        mov     [rax + RE_SIZE], rdi
        mov     [rax + RE_KEY], rdi
        mov     [rax + RE_BOX], rdi
        inc     rcx
.gap:                                   ; while entries are missing before its own
        cmp     rcx, rdx
        jb      .gap_lap
        mov     rcx, rdx
        shl     rcx, ROOM_ESHIFT
        add     rcx, [rbx + P_ROOMS]
        mov     rax, [add_place]
        mov     [rcx + RE_PLACE], rax
        mov     rax, [add_size]
        mov     [rcx + RE_SIZE], rax
        add     [rbx + P_SIZE], rax
        mov     rax, [add_key]
        mov     [rcx + RE_KEY], rax
        mov     rax, [add_box]
        mov     [rcx + RE_BOX], rax
        lea     rax, [rdx + 1]          ; counted: from here on it is seen
        mov     [rbx + P_NROOMS], rax
        lea     rax, [rsi + 1]
        mov     [rbx + P_NEXTROOM], rax
        mov     rax, rsi
        shl     rax, ROOM_SHIFT
        jmp     .done
.no:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; A new room of rax bytes: a new box, seen to read and write. -> rax = its address (its number <<
; ROOM_SHIFT), -1 if it does not fit or there is no memory. Keeps rbx, rbp, r12-r15.
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
        call    box_new
        test    rax, rax
        jz      .invalid
        mov     rsi, rax                ; its key
        mov     rcx, rdi
        mov     edx, 3
        call    box_view
        test    rax, rax
        jz      .close
        mov     rcx, ROOM_LIVE
        or      rax, rcx
        mov     [add_place], rax
        mov     [add_size], rdi
        mov     [add_key], rsi
        call    box_number
        mov     [add_box], rax
        call    room_add
        cmp     rax, -1
        jne     .done
        mov     rax, [add_place]
        shl     rax, 16
        shr     rax, 16
        mov     rcx, rdi
        call    box_unview
.close:
        mov     rax, rsi
        call    box_close
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; A new box's number, never given before, with the most it may be treated (read and write) above bit 48.
box_number:
        inc     qword [box_count]
        mov     rax, [box_count]
        mov     rcx, ROOM_CEIL_ALL
        or      rax, rcx
        ret
ROOM_CEIL     = 48                      ; in RE_BOX, above the box's number: the most this holder may treat it
ROOM_CEIL_ALL = 3 shl ROOM_CEIL
ROOM_LIVE     = ROOM_READ + ROOM_WRITE + ROOM_ALIVE   ; a new room

; The entry of the room starting at address rax in the cartel of rbx. -> rax = the entry, rdx = its index;
; rax = 0 if no room standing starts there. Keeps rbx, rsi, rdi, rbp, r8-r15.
room_entry:
        mov     rdx, rax
        shr     rdx, ROOM_SHIFT         ; its number
        mov     rcx, rdx
        shl     rcx, ROOM_SHIFT
        cmp     rcx, rax
        jne     .no                     ; not the start of a room
        cmp     qword [rbx + P_ROOMS], 0
        je      .no                     ; no cartel: no room
        test    rdx, rdx
        jz      .entry                  ; room 0: entry 0
        sub     rdx, [rbx + P_ROOMBASE] ; its entry
        jbe     .no                     ; below the cartel: gone
.entry:
        cmp     rdx, [rbx + P_NROOMS]
        jae     .no
        mov     rax, rdx
        shl     rax, ROOM_ESHIFT
        add     rax, [rbx + P_ROOMS]
        cmp     qword [rax + RE_SIZE], 0
        je      .no                     ; destroyed
        ret
.no:
        xor     eax, eax
        ret

; The room at entry rax (index rdx) of rbx leaves this cabin: its entry points at the dead drawer, its view
; goes back, and its key too unless rcx = 0 (it moves on with it). The cartel then sheds destroyed entries
; at its ends. Keeps rbx, rbp, r12-r15.
room_leave:
        push    rsi rdi r12 r13 r14
        mov     r14, rcx
        mov     r12, [rax + RE_PLACE]   ; its place
        shl     r12, 16
        shr     r12, 16
        mov     r13, [rax + RE_SIZE]    ; its size
        mov     rsi, [rax + RE_KEY]     ; its key
        mov     rcx, [dead_drawer]
        mov     [rax + RE_PLACE], rcx
        xor     ecx, ecx
        mov     [rax + RE_SIZE], rcx
        mov     [rax + RE_KEY], rcx
        mov     [rax + RE_BOX], rcx
        test    rdx, rdx
        jnz     @f
        mov     [rbx + P_LIM1], rcx     ; room 0 is gone: its accesses take the long check (and fail)
        mov     [rbx + P_LIM8], rcx
        mov     rcx, [dead_drawer]
        mov     [rbx + P_DATA], rcx
@@:     sub     [rbx + P_SIZE], r13
        mov     rax, r12
        mov     rcx, r13
        call    box_unview
        test    r14, r14
        jz      .trim
        mov     rax, rsi
        call    box_close
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
        shl     rax, ROOM_ESHIFT
        cmp     qword [rsi + rax - ROOM_ENTRY + RE_SIZE], 0
        je      .last_lap
.trimmed:
        cmp     qword [rbx + P_NROOMS], 1
        ja      .low
        mov     qword [rbx + P_ROOMBASE], 0   ; no room left but room 0: the count starts again
        mov     qword [rbx + P_NEXTROOM], 1
        jmp     .done
.low:                                   ; destroyed rooms at the start of the cartel leave it too
        mov     ecx, 1
        jmp     .lead
.lead_lap:
        inc     rcx
.lead:                                  ; while the entry is a room destroyed (the last one stands)
        mov     rax, rcx
        shl     rax, ROOM_ESHIFT
        cmp     qword [rsi + rax + RE_SIZE], 0
        je      .lead_lap
        dec     rcx                     ; how many leave
        jz      .done
        add     [rbx + P_ROOMBASE], rcx
        sub     [rbx + P_NROOMS], rcx
        lea     rdi, [rsi + ROOM_ENTRY] ; entries 1 + d... move to 1...
        shl     rcx, ROOM_ESHIFT
        lea     rsi, [rdi + rcx]
        mov     rcx, [rbx + P_NROOMS]
        dec     rcx
        shl     rcx, ROOM_ESHIFT - 3    ; in qwords
        rep     movsq
.done:
        pop     r14 r13 r12 rdi rsi
        ret

; Destroys the room at address rax in this cabin: its view and its key go back (the box stays while another
; cabin holds it), and its address dies with it. Its number is never given again (until every room but room
; 0 is gone). -> rax = 0, or -1 if no room starts at that address or it holds the queue being served (its
; answers need somewhere to go). Keeps rbx, rbp, r12-r15.
rooms_destroy:
        sub     rsp, 8
        mov     rcx, [queue_addr]
        xor     rcx, rax
        shr     rcx, ROOM_SHIFT
        jz      .invalid                ; the queue is inside
        call    room_entry
        test    rax, rax
        jz      .invalid
        mov     ecx, 1
        call    room_leave
        xor     eax, eax
        jmp     .done
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        ret

; How to treat the room at address rax (Capitan: "the cartel is at the same time a pointer and how the box
; must be treated"): rdx = bit 0 read, bit 1 write, the treatments built so far. The processor keeps them
; (this cabin's view is protected to match), so an access the box does not allow costs nothing until it
; happens, and then ends the process with code 5, the same as the routines and the interpreter, which ask.
; Refused: a box written but not read (the processor can not keep it), more than this cabin may (what it was
; given), and taking the write from the room the queue is in (its answers need somewhere to go); the kernel
; touches only a box its owner can read and write (room_at). -> rax = 0, or -1 if refused. Keeps rbx, rbp,
; r12-r15.
rooms_treat:
        push    rsi rdi r12 r13
        sub     rsp, 8
        cmp     rdx, 3
        ja      .invalid                ; a treatment not built yet
        cmp     rdx, 2
        je      .invalid                ; written but not read
        mov     r12, rdx
        cmp     r12, 3
        je      @f
        mov     rcx, [queue_addr]
        xor     rcx, rax
        shr     rcx, ROOM_SHIFT
        jz      .invalid                ; the queue is inside and would lose its write
@@:     call    room_entry
        test    rax, rax
        jz      .invalid
        mov     r13, rax
        mov     rcx, [r13 + RE_BOX]     ; no more than it was given
        shr     rcx, ROOM_CEIL
        not     rcx
        test    rcx, r12
        jnz     .invalid
        mov     rcx, [r13 + RE_SIZE]
        mov     rsi, [r13 + RE_PLACE]   ; its place
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
        mov     rcx, [r13 + RE_PLACE]
        mov     rdx, ROOM_SHARED
        and     rcx, rdx
        or      rax, rcx
        mov     rcx, ROOM_ALIVE
        or      rax, rcx
        mov     [r13 + RE_PLACE], rax
        mov     rax, r13
        sub     rax, [rbx + P_ROOMS]
        jnz     .done_ok                ; not room 0
        xor     eax, eax                ; room 0: its fast limit only while it can be read and written
        xor     ecx, ecx
        cmp     r12, 3
        jne     @f
        mov     rax, [r13 + RE_SIZE]
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
        shl     rcx, ROOM_ESHIFT
        add     rcx, [rbx + P_ROOMS]
        cmp     rdx, [rcx + RE_SIZE]
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

; A process is born without memory. Its first order (a jsys before room 0 was ever built) builds room 0 of
; rax bytes, with the size right in the register because there is nowhere to put a queue. j15 starts at its
; top, and the program's initial data (datos.inc) is copied to its start.
; -> rax = 0 (room 0's address), or -1 if it cannot be built (nothing asked, too big, no memory).
rooms_first:
        push    rsi rdi
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
        mov     rdi, rax                ; its size
        cmp     qword [rbx + P_ROOMS], 0
        jne     @f
        call    rooms_cartel            ; entry 0 lives in the cartel
        test    rax, rax
        jz      .invalid
@@:     mov     rax, rdi
        call    box_new
        test    rax, rax
        jz      .invalid
        mov     rsi, rax                ; its key
        mov     rcx, rdi
        mov     edx, 3
        call    box_view
        test    rax, rax
        jz      .close
        mov     [rbx + P_DATA], rax
        mov     rcx, [rbx + P_ROOMS]    ; entry 0
        mov     rdx, ROOM_LIVE
        or      rdx, rax
        mov     [rcx + RE_PLACE], rdx
        mov     [rcx + RE_SIZE], rdi
        mov     [rcx + RE_KEY], rsi
        call    box_number
        mov     rcx, [rbx + P_ROOMS]
        mov     [rcx + RE_BOX], rax
        add     [rbx + P_SIZE], rdi
        mov     qword [rbx + P_ROOM0], 1
        push    rsi rdi
        mov     rdi, [rbx + P_DATA]     ; its initial data at the start of the room
        mov     rsi, [rbx + P_INIT]
        mov     rcx, [rbx + P_INITLEN]
        rep     movsb
        pop     rdi rsi
        mov     [rbx + P_LIM1], rdi
        mov     [rbx + P_REGS + 15*8], rdi
        lea     rax, [rdi - 7]
        mov     [rbx + P_LIM8], rax
        xor     eax, eax
        jmp     .done
.close:
        mov     rax, rsi
        call    box_close
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     rdi rsi
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

; ---------------------------------------------------------------- boxes between cabins (Capitan)
; A box passes between cabins without a byte copied: the one who receives gets its own view and its own
; key, and never more treatment than the one who gives has.

DOWRY_SIZE = 32                         ; a box of the dowry: its key (+0), size (+8), treatment (+16), number (+24)
DOWRY_MOVED = 4                         ; in its treatment: it moved, so it has one holder

; A new slot of r8 bytes at the end of the list at [rbx + rcx] (its count at [rbx + rcx + 8]): the list has
; room for 4, and doubles when its count reaches a power of two past that. -> rax = the slot, 0 if there is
; no memory. Keeps rbx, rsi, rdi, rbp, r15.
list_slot:
        push    r12 r13 r14
        mov     r12, rcx                ; the list
        mov     r13, r8                 ; a slot
        mov     r14, [rbx + r12 + 8]    ; how many
        test    r14, r14
        jz      .grow
        cmp     r14, 4
        jb      .room
        lea     rax, [r14 - 1]
        test    rax, r14
        jnz     .room                   ; not a power of two: it has room
.grow:
        lea     rdx, [r14 + r14]
        cmp     rdx, 4
        jae     @f
        mov     edx, 4
@@:     imul    rdx, r13
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .done
        push    rsi rdi
        mov     rdi, rax
        mov     rsi, [rbx + r12]
        mov     rcx, r14
        imul    rcx, r13
        rep     movsb
        pop     rdi rsi
        mov     [list_new], rax
        mov     rcx, [rbx + r12]
        test    rcx, rcx
        jz      @f
        invoke  VirtualFree, rcx, 0, MEM_RELEASE
@@:     mov     rax, [list_new]
        mov     [rbx + r12], rax
.room:
        mov     rax, r14
        imul    rax, r13
        add     rax, [rbx + r12]
        inc     qword [rbx + r12 + 8]
.done:
        pop     r14 r13 r12
        ret

; 22 dowry (Capitan: "the child is born with the box"): the room at address rax goes to the next child this
; cabin launches, treated as rdx (bit 0 read, bit 1 write; never more than this cabin has it now). The child
; is born with its dowry as its rooms 1, 2..., in the order given. -> rax = 0, or -1. Keeps rbx, rbp,
; r12-r15.
rooms_dowry:
        push    rsi rdi r12 r13
        sub     rsp, 8
        cmp     rdx, 3
        ja      .invalid
        cmp     rdx, 2
        je      .invalid                ; written but not read
        mov     r12, rdx
        call    room_entry
        test    rax, rax
        jz      .invalid
        mov     r13, rax
        mov     rcx, [r13 + RE_PLACE]   ; no more than this cabin has it now
        shr     rcx, 48
        and     ecx, 3
        not     rcx
        test    rcx, r12
        jnz     .invalid
        mov     rax, [r13 + RE_KEY]
        call    box_key
        test    rax, rax
        jz      .invalid
        mov     rsi, rax                ; the child's key
        mov     ecx, P_DOWRY
        mov     r8d, DOWRY_SIZE
        call    list_slot
        test    rax, rax
        jz      .close
        mov     [rax], rsi
        mov     rcx, [r13 + RE_SIZE]
        mov     [rax + 8], rcx
        mov     [rax + 16], r12
        mov     rcx, [r13 + RE_BOX]
        shl     rcx, 16                 ; its number, without how far this cabin may treat it
        shr     rcx, 16
        mov     [rax + 24], rcx
        mov     rcx, ROOM_SHARED        ; held by more than one cabin from now on
        or      [r13 + RE_PLACE], rcx
        xor     eax, eax
        jmp     .done
.close:
        mov     rax, rsi
        call    box_close
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     r13 r12 rdi rsi
        ret

; The box of the slot at rsi (DOWRY_SIZE layout) arrives in the cabin rbx: its own view, with its key, as
; the next room. -> rax = its address, or -1 (and the key goes back). Keeps rbx, rbp, rsi, r12-r15.
box_arrive:
        push    rdi
        mov     rax, [rsi]
        mov     rcx, [rsi + 8]
        mov     rdx, [rsi + 16]
        and     edx, 3
        call    box_view
        test    rax, rax
        jz      .close
        mov     rcx, [rsi + 16]
        and     ecx, 3
        shl     rcx, 48
        or      rax, rcx
        mov     rcx, ROOM_ALIVE + ROOM_SHARED
        test    byte [rsi + 16], DOWRY_MOVED
        jz      @f
        mov     rcx, ROOM_ALIVE         ; moved: it has one holder
@@:     or      rax, rcx
        mov     [add_place], rax
        mov     rax, [rsi + 8]
        mov     [add_size], rax
        mov     rax, [rsi]
        mov     [add_key], rax
        mov     rax, [rsi + 16]
        and     eax, 3
        shl     rax, ROOM_CEIL          ; the most it may treat it: what it was given
        or      rax, [rsi + 24]
        mov     [add_box], rax
        call    room_add
        cmp     rax, -1
        jne     .done
        mov     rax, [add_place]
        shl     rax, 16
        shr     rax, 16
        mov     rcx, [rsi + 8]
        call    box_unview
.close:
        mov     rax, [rsi]
        call    box_close
        mov     rax, -1
.done:
        pop     rdi
        ret

; The child rbx, just made and not yet in the line, is born with the dowry of its mother [mp_parent]; her
; dowry is emptied. Keeps rbx, rbp, r12-r15.
rooms_born:
        push    rsi rdi r12
        mov     r12, [mp_parent]
        test    r12, r12
        jz      .done                   ; the kernel's child: no dowry
        mov     rsi, [r12 + P_DOWRY]
        mov     rdi, [r12 + P_NDOWRY]
        shl     rdi, 5
        add     rdi, rsi                ; its end
        jmp     .one
.one_lap:
        call    box_arrive
        add     rsi, DOWRY_SIZE
.one:                                   ; while boxes are left
        cmp     rsi, rdi
        jb      .one_lap
        call    rooms_assoc             ; and the part of the association it chose
        mov     rcx, [r12 + P_DOWRY]
        test    rcx, rcx
        jz      .done
        mov     qword [r12 + P_DOWRY], 0
        mov     qword [r12 + P_NDOWRY], 0
        invoke  VirtualFree, rcx, 0, MEM_RELEASE
.done:
        pop     r12 rdi rsi
        ret

; rax = a cabin's number -> rax = that cabin if it is family of rbx (its parent, one of its children or a
; sibling) and still runs, else 0. Keeps every other register but rcx.
cabin_family:
        cmp     rax, [nprocs]
        jae     .no                     ; also catches negative numbers
        mov     rcx, [procs]
        mov     rax, [rcx + rax*8]
        cmp     rax, rbx
        je      .no                     ; itself
        cmp     qword [rax + P_DONE], 0
        jne     .no                     ; it ended: a box would be lost there
        mov     rcx, [rax + P_PARENT]
        cmp     rcx, rbx
        je      .yes                    ; my child
        cmp     rcx, [rbx + P_PARENT]
        je      .yes                    ; my sibling
        cmp     rax, [rbx + P_PARENT]
        je      .yes                    ; my parent
.no:
        xor     eax, eax
.yes:
        ret

; 23 move and 24 link (Capitan: "the child moves" and "it links with two cabins and they share"): the room
; at address rax goes to the cabin number rdx, family of this one, treated as r8 (no more than this cabin
; has it now). Linked, both hold it. Moved, this cabin no longer does: its address dies here, and the one
; that receives it may treat it as far as this one could. It arrives as the next room of that cabin, in its
; mailbox (request 25). r9 = 1 move, 0 link. -> rax = 0, or -1. Keeps rbx, rbp, r12-r15.
rooms_pass:
        push    rsi rdi r12 r13 r14 r15
        sub     rsp, 8
        mov     r15, r9                 ; move?
        mov     r12, r8                 ; its treatment there
        cmp     r12, 3
        ja      .invalid
        cmp     r12, 2
        je      .invalid                ; written but not read
        test    r15, r15
        jz      @f
        mov     rcx, [queue_addr]
        xor     rcx, rax
        shr     rcx, ROOM_SHIFT
        jz      .invalid                ; the queue is inside: its answers need somewhere to go
@@:     mov     r14, rdx
        call    room_entry
        test    rax, rax
        jz      .invalid
        mov     r13, rax                ; its entry here
        mov     rdi, rdx                ; and its index
        test    r15, r15
        jz      @f
        mov     r12, [r13 + RE_PLACE]   ; moved: treated as this cabin treats it
        shr     r12, 48
        and     r12d, 3
@@:
        mov     rcx, [r13 + RE_PLACE]   ; no more than this cabin has it now
        shr     rcx, 48
        and     ecx, 3
        not     rcx
        test    rcx, r12
        jnz     .invalid
        mov     rax, r14
        call    cabin_family
        test    rax, rax
        jz      .invalid
        mov     r14, rax                ; the cabin that receives it
        mov     rax, [r13 + RE_KEY]
        call    box_key
        test    rax, rax
        jz      .invalid
        mov     [pass_slot], rax        ; the box as it travels (DOWRY_SIZE layout)
        mov     rax, [r13 + RE_SIZE]
        mov     [pass_slot + 8], rax
        mov     rax, r12
        test    r15, r15
        jz      @f
        or      eax, DOWRY_MOVED
@@:     mov     [pass_slot + 16], rax
        mov     rax, [r13 + RE_BOX]
        shl     rax, 16
        shr     rax, 16
        test    r15, r15
        jz      @f
        mov     rcx, [r13 + RE_BOX]     ; moved: as far as this cabin could
        mov     rdx, ROOM_CEIL_ALL
        and     rcx, rdx
        or      rax, rcx
@@:     mov     [pass_slot + 24], rax
        lea     rsi, [pass_slot]
        xchg    rbx, r14
        call    box_arrive              ; (it gives the key back if it can not arrive)
        cmp     rax, -1
        je      .back
        mov     [pass_addr], rax
        mov     ecx, P_ARRIVED          ; to its mailbox
        mov     r8d, 8
        call    list_slot
        test    rax, rax
        jz      @f
        mov     rcx, [pass_addr]
        mov     [rax], rcx
@@:     xchg    rbx, r14
        test    r15, r15
        jz      .shared
        mov     rax, r13                ; moved: it leaves this cabin, key and all
        mov     rdx, rdi
        mov     ecx, 1
        call    room_leave
        jmp     .done_ok
.shared:
        mov     rcx, ROOM_SHARED        ; linked: held by more than one cabin from now on
        or      [r13 + RE_PLACE], rcx
.done_ok:
        xor     eax, eax
        jmp     .done
.back:
        xchg    rbx, r14
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12 rdi rsi
        ret

; 25 receive: the address of the oldest box that moved or was linked to this cabin and was not received
; yet, or -1 if none. Keeps every register but rax, rcx.
rooms_receive:
        mov     rcx, [rbx + P_TAKEN]
        cmp     rcx, [rbx + P_NARRIVED]
        jae     .none
        inc     qword [rbx + P_TAKEN]
        mov     rax, [rbx + P_ARRIVED]
        mov     rax, [rax + rcx*8]
        ret
.none:
        mov     rax, -1
        ret

; 26 fuse (Capitan: "two boxes become one box"): the rooms at addresses rax and rdx, both this cabin's and
; both readable, become a new room with what was in the first and then what was in the second (copied: one
; new box). Both addresses die here; a cabin that held one of them keeps it. -> rax = the new room's address,
; or -1 (the same room twice, one that holds the queue, too big together). Keeps rbx, rbp, r12-r15.
rooms_fuse:
        push    rsi rdi r12 r13 r14 r15
        sub     rsp, 8
        mov     r14, rax                ; the first
        mov     r15, rdx                ; the second
        cmp     r14, r15
        je      .invalid
        mov     rcx, [queue_addr]
        xor     rcx, r14
        shr     rcx, ROOM_SHIFT
        jz      .invalid                ; the queue is inside
        mov     rcx, [queue_addr]
        xor     rcx, r15
        shr     rcx, ROOM_SHIFT
        jz      .invalid
        mov     rax, r14
        call    room_entry
        test    rax, rax
        jz      .invalid
        mov     r12, rax
        bt      qword [r12 + RE_PLACE], 48
        jnc     .invalid                ; it has to be read to be fused
        mov     rax, r15
        call    room_entry
        test    rax, rax
        jz      .invalid
        mov     r13, rax
        bt      qword [r13 + RE_PLACE], 48
        jnc     .invalid
        mov     rax, [r12 + RE_SIZE]
        add     rax, [r13 + RE_SIZE]
        mov     rcx, ROOM_MAX
        cmp     rax, rcx
        ja      .invalid
        call    rooms_grow              ; (the cartel never moves: r12 and r13 still point at them)
        cmp     rax, -1
        je      .done
        mov     [fuse_addr], rax
        call    room_entry
        mov     rdi, [rax + RE_PLACE]   ; the new one's place
        shl     rdi, 16
        shr     rdi, 16
        mov     rsi, [r12 + RE_PLACE]   ; what was in the first
        shl     rsi, 16
        shr     rsi, 16
        mov     rcx, [r12 + RE_SIZE]
        rep     movsb
        mov     rsi, [r13 + RE_PLACE]   ; and then in the second
        shl     rsi, 16
        shr     rsi, 16
        mov     rcx, [r13 + RE_SIZE]
        rep     movsb
        mov     rax, r14                ; both leave this cabin (the second found again: the cartel may slide)
        call    room_entry
        mov     ecx, 1
        call    room_leave
        mov     rax, r15
        call    room_entry
        mov     ecx, 1
        call    room_leave
        mov     rax, [fuse_addr]
        jmp     .done
.invalid:
        mov     rax, -1
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12 rdi rsi
        ret

; 27 associate (Capitan: "by association they can create one with the boxes they share, with the ones only
; A has, or with the ones only B has"): this cabin's next child is born with part of the boxes of this
; cabin (A) and of the family cabin number rax (B): rdx = 0 the ones both hold, 1 A's only, 2 B's only,
; 3 all of them. It takes both: the child gets them only if B associated with A too (each one names the
; other). -> rax = 0, or -1. Keeps every register but rax, rcx, rdx.
rooms_associate:
        cmp     rdx, 3
        ja      .invalid
        push    rdx
        call    cabin_family
        pop     rdx
        test    rax, rax
        jz      .invalid
        mov     [rbx + P_PARTNER], rax
        mov     [rbx + P_ASSOC], rdx
        xor     eax, eax
        ret
.invalid:
        mov     rax, -1
        ret

; r8 = a cabin, r9 = a box's number -> rax = the entry of that box in its cartel, 0 if it does not hold it.
; Uses rcx, rdx.
box_find:
        mov     rcx, [r8 + P_ROOMS]
        mov     rdx, [r8 + P_NROOMS]
        shl     rdx, ROOM_ESHIFT
        add     rdx, rcx                ; its end
        jmp     .one
.one_lap:
        cmp     qword [rcx + RE_SIZE], 0
        je      .next                   ; destroyed
        mov     rax, [rcx + RE_BOX]
        shl     rax, 16
        shr     rax, 16
        cmp     rax, r9
        je      .found
.next:
        add     rcx, ROOM_ENTRY
.one:                                   ; while entries are left
        cmp     rcx, rdx
        jb      .one_lap
        xor     eax, eax
        ret
.found:
        mov     rax, rcx
        ret

; The box of the entry rax (of any cabin) arrives in the cabin rbx, treated as rdx. Keeps rbx, rbp, rsi,
; rdi, r12-r15.
box_give:
        push    rsi
        mov     [pass_slot + 16], rdx
        mov     rcx, [rax + RE_SIZE]
        mov     [pass_slot + 8], rcx
        mov     rcx, [rax + RE_BOX]
        shl     rcx, 16
        shr     rcx, 16
        mov     [pass_slot + 24], rcx
        mov     rax, [rax + RE_KEY]
        call    box_key
        test    rax, rax
        jz      .done
        mov     [pass_slot], rax
        lea     rsi, [pass_slot]
        call    box_arrive
.done:
        pop     rsi
        ret

; The child rbx, just made, is born with the part its mother r12 chose of her boxes and her partner's (if
; the partner named her too and still runs): first hers in the order of her cartel, then the partner's.
; A box both hold is given treated as both allow. The mother's association is used once. Keeps rbx, rbp,
; r12-r15.
rooms_assoc:
        push    rsi rdi r13 r14 r15
        mov     r13, [r12 + P_PARTNER]
        test    r13, r13
        jz      .done
        mov     qword [r12 + P_PARTNER], 0
        cmp     [r13 + P_PARTNER], r12
        jne     .done                   ; it did not name her: no association
        cmp     qword [r13 + P_DONE], 0
        jne     .done
        cmp     qword [r12 + P_ROOMS], 0
        je      .done
        cmp     qword [r13 + P_ROOMS], 0
        je      .done
        mov     r14, [r12 + P_ASSOC]
        cmp     r14, 2
        je      .partner                ; only the partner's
        mov     r15, [r12 + P_ROOMS]    ; hers
        mov     rdi, [r12 + P_NROOMS]
        shl     rdi, ROOM_ESHIFT
        add     rdi, r15
        jmp     .mine
.mine_lap:
        cmp     qword [r15 + RE_SIZE], 0
        je      .mine_next
        mov     rsi, [r15 + RE_PLACE]   ; her treatment
        shr     rsi, 48
        and     esi, 3
        mov     r9, [r15 + RE_BOX]
        shl     r9, 16
        shr     r9, 16
        mov     r8, r13
        call    box_find
        test    rax, rax
        jz      .only_mine
        cmp     r14, 1
        je      .mine_next              ; shared: not hers only
        mov     rcx, [rax + RE_PLACE]   ; treated as both allow
        shr     rcx, 48
        and     rsi, rcx
        jmp     .give_mine
.only_mine:
        test    r14, r14
        jz      .mine_next              ; only the shared ones
.give_mine:
        mov     rax, r15
        mov     rdx, rsi
        call    box_give
.mine_next:
        add     r15, ROOM_ENTRY
.mine:                                  ; while her entries are left
        cmp     r15, rdi
        jb      .mine_lap
        cmp     r14, 3
        jne     .done
.partner:                               ; the partner's own ones
        mov     r15, [r13 + P_ROOMS]
        mov     rdi, [r13 + P_NROOMS]
        shl     rdi, ROOM_ESHIFT
        add     rdi, r15
        jmp     .its
.its_lap:
        cmp     qword [r15 + RE_SIZE], 0
        je      .its_next
        mov     r9, [r15 + RE_BOX]
        shl     r9, 16
        shr     r9, 16
        mov     r8, r12
        call    box_find
        test    rax, rax
        jnz     .its_next               ; she holds it too: given already, or not asked
        mov     rdx, [r15 + RE_PLACE]
        shr     rdx, 48
        and     edx, 3
        mov     rax, r15
        call    box_give
.its_next:
        add     r15, ROOM_ENTRY
.its:                                   ; while its entries are left
        cmp     r15, rdi
        jb      .its_lap
.done:
        pop     r15 r14 r13 rdi rsi
        ret

; ---------------------------------------------------------------- greetings (Capitan)
; "With a single bit the mother or the child send a greeting, and if more is needed with other parts of the
; family more is used: everything plastic, what is needed is used." A cabin keeps who greeted it and was
; not taken yet, one mark per family member however many times it greeted, and as many marks as members
; greet. A greeting stays until it is taken, so one sent before the wait is never lost.

; 28 greet: the family cabin number rax gets a greeting from rbx, and wakes if it was waiting for one.
; -> rax = 0, or -1 if it is not family (or it ended). Keeps rbx, rbp, r12-r15.
greet:
        push    rsi
        call    cabin_family
        test    rax, rax
        jz      .invalid
        mov     rsi, rax                ; who is greeted
        mov     rcx, [rsi + P_GREET]    ; already greeted by this one: one mark is enough
        mov     rdx, [rsi + P_NGREET]
        lea     rdx, [rcx + rdx*8]
        jmp     .seen
.seen_lap:
        cmp     [rcx], rbx
        je      .wake
        add     rcx, 8
.seen:                                  ; while marks are left
        cmp     rcx, rdx
        jb      .seen_lap
        xchg    rbx, rsi
        mov     ecx, P_GREET
        mov     r8d, 8
        call    list_slot
        xchg    rbx, rsi
        test    rax, rax
        jz      .invalid
        mov     [rax], rbx
.wake:
        cmp     qword [rsi + P_GWAIT], 1
        jne     .done
        mov     qword [rsi + P_GWAIT], 0
        dec     qword [rsi + P_WAITING]
        mov     r8, rsi
        call    q_wake
.done:
        xor     eax, eax
        pop     rsi
        ret
.invalid:
        mov     rax, -1
        pop     rsi
        ret

; 29 wait for a greeting: the number of the oldest cabin that greeted rbx, its mark taken; -1 if nobody is
; left who could greet it. (The window made it sleep while nobody had greeted it: greet_must_wait.)
; Keeps every register but rax, rcx, rdx.
greeting:
        cmp     qword [rbx + P_GWAIT], 2
        je      .lost
        mov     rcx, [rbx + P_NGREET]
        test    rcx, rcx
        jz      .none
        mov     rdx, [rbx + P_GREET]
        mov     rax, [rdx]              ; the oldest one
        mov     rax, [rax + P_ID]
        dec     rcx
        mov     [rbx + P_NGREET], rcx
        push    rsi rdi
        mov     rdi, rdx
        lea     rsi, [rdx + 8]
        rep     movsq
        pop     rdi rsi
        ret
.lost:
        mov     qword [rbx + P_GWAIT], 0
.none:
        mov     rax, -1
        ret

; While the window marks a touch: r8d = 1 if rbx has to sleep until a greeting arrives (nobody greeted it
; yet, and someone still could). Keeps every other register.
greet_must_wait:
        xor     r8d, r8d
        cmp     qword [rbx + P_NGREET], 0
        jne     .done
        cmp     qword [rbx + P_GWAIT], 2
        je      .done
        mov     qword [rbx + P_GWAIT], 1
        mov     r8d, 1
.done:
        ret

; Nobody rows: every cabin waiting for a greeting wakes, and its wait answers -1. Keeps every register.
greet_nobody:
        push    rcx rsi r8
        xor     ecx, ecx
        jmp     .one
.one_lap:
        mov     rsi, [procs]
        mov     rsi, [rsi + rcx*8]
        cmp     qword [rsi + P_GWAIT], 1
        jne     .next
        mov     qword [rsi + P_GWAIT], 2
        dec     qword [rsi + P_WAITING]
        mov     r8, rsi
        call    q_wake
.next:
        inc     rcx
.one:                                   ; while there are cabins
        cmp     rcx, [nprocs]
        jb      .one_lap
        pop     r8 rsi rcx
        ret
