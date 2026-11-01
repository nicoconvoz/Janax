; Janax OS translated engine (JANAX_MOTOR=traductor, the default). The routine table of a program
; (rutinas.inc), with native code written for each of its instructions: the record of a word points at that
; code instead of at its routine. The code does what the routine does with the registers and operands
; already in it, and keeps every convention of the routine engine (r12 next record, r13 table, r14 Janax
; registers, r15 data, rsi return stack, rdi depth, rbp budget, rbx process), so it runs inside run_routines
; as it is:
;  - ldi, the arithmetic but jdiv, the shifts, jshi, the jumps, the calls and returns, and memory in any
;    room run in native code. Room 0 is r15; another room is found in the cartel (O(i)). Nobody asks
;    whether an access is past a room's end: the room leans against addresses the processor refuses
;    (ambientes.inc), and when it refuses, native_fault sends the word on by its T(i).
;  - Anything else (jhalt, jdiv, the windows, an unknown opcode, a misaligned access, a room not in the
;    cartel, a call that needs more return stack, a jret without jcall) jumps to its own routine, which goes
;    on through the table: back to native.
;  - The 4 Janax registers the native blocks use the most live also in r8-r11; every write goes to memory
;    too, so the routines always find them there, and whatever comes back from the table reads them (R).
;
; The turn is counted only at the important steps (Capitan): once per straight run, not once per
; instruction. A run is the native words from one to the next jump, call or return (included), or to the last
; one before a word that keeps its routine. The block that heads a run starts with its charge, the whole run at
; once (sub rbp, r / jc), and every way into the run passes through it: a jump, falling into it, a native jret
; coming back. Inside the run nothing is charged. A jump into the middle of a run charges the rest of it
; from there (Wm, in the cold area: the entry of a while, once per loop). If the budget does not reach,
; nothing is charged: the word runs by its routine, which charges one instruction at a time through the table,
; so the turn ends at the same instruction as with the routines and the interpreter, bit for bit. A memory
; access that leaves its run by the slow way gives back what it charged for the words after it.
;
; Per word i, a cold area of NATIVE_COLD bytes:
;   S(i)      +0    r12 = record i / jmp t_suspend: the turn ends before word i
;   F(i)      +32   rdx = record i / r12 = rdx + 16 / jmp its routine (word i already charged)
;   R(i)      +64   read r8-r11 / sub rbp, r - 1 / jc T(i) / jmp to its code: from the table (one charged)
;   Wm(i)     +112  sub rbp, r / jc L(i) / jmp to its code: a jump into the middle of its run
;   Wc(i)     +136  sub rbp, 1 / jc S(i) / jmp F(i): a jump to a word that keeps its routine
;   L(i)      +160  add rbp, r / sub rbp, 1 / jc S(i) / jmp F(i): the run's charge did not reach
;   T(i)      +192  add rbp, r - 1 / jmp F(i): the rest did not reach, or a memory access leaves its run
;   O(i)      +208  a memory word into another room: its alignment, its value, its entry in the cartel, the
;                   access, and back into its block (E_BACK)
; Jumps are rel32 always, so a block's size does not depend on where its targets are: a first pass places
; the blocks, a second one writes them with their targets. Written while the memory can be written, then it
; can only be run (never both). Translating happens with one rower only (at boot, or inside the window,
; under the captain's lock).

NATIVE_BLOCK = 80               ; bytes a block may take: the largest (an 8-byte load heading a run) takes 60
NATIVE_COLD  = 288              ; bytes per word in the cold area: O(i), the largest, takes 71 from C_O
C_S     = 0
C_F     = 32
C_R     = 64
C_WM    = 112
C_WC    = 136
C_L     = 160
C_T     = 192
C_O     = 208
E_SIZE  = 32                    ; per word: its code (+0), r (+8), the entry for a jump to it (+16), and for
                                ; a memory word where its block goes on after its access (+24, else 0)
E_CODE  = 0
E_R     = 8
E_JUMP  = 16
E_BACK  = 24

macro emit [b] {
  forward
        mov     byte [rdi], b
        inc     rdi
}

; rax = a table from decode_program, rcx = words, rdx = the words. -> rax = the same table, its records now
; pointing at native code, and rcx = how many words got a native block; 0 if there is no memory. Keeps
; callee-saved registers.
translate_table:
        push    rbx rsi rdi rbp r12 r13 r14 r15
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 48
        mov     r13, rax                ; the table
        mov     r12, rcx                ; words
        mov     rsi, rdx
        lea     rdx, [rcx + 1]          ; per word and the final record (E_SIZE)
        shl     rdx, 5
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .no_memory
        mov     [nat_entries], rax
        imul    rdx, r12, NATIVE_BLOCK + NATIVE_COLD   ; the code: the blocks, then the cold area
        add     rdx, NATIVE_COLD
        mov     [rsp + 40], rdx
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .no_memory
        mov     r15, rax                ; the blocks
        imul    r14, r12, NATIVE_BLOCK
        add     r14, r15                ; the cold area
        call    native_cache            ; the Janax registers that live in r8-r11
        call    native_runs             ; r(i) for every word
        mov     qword [rsp + 32], 2     ; two passes: place the blocks, then write them with their targets
        jmp     .pass
.pass_lap:
        mov     rdi, r15
        xor     ebx, ebx
        jmp     .word
.word_lap:
        call    native_block
        inc     rbx
.word:                                  ; while there are words
        cmp     rbx, r12
        jb      .word_lap
        mov     rbx, r12                ; the final record keeps its routine
        call    native_block.routine_entries
        dec     qword [rsp + 32]
.pass:                                  ; while passes are left
        cmp     qword [rsp + 32], 0
        jne     .pass_lap
        call    native_cold             ; the cold area, now that every block has its place
        xor     esi, esi                ; (the words are not needed now: rsi counts the native blocks)
        xor     ebx, ebx                ; every record points at its entry from the table: R or F
        jmp     .point
.point_lap:
        mov     rcx, rbx
        imul    rcx, rcx, NATIVE_COLD
        add     rcx, r14
        lea     rax, [rcx + C_F]
        mov     rdx, rbx
        shl     rdx, 5
        add     rdx, [nat_entries]
        cmp     [rdx + E_CODE], r14
        jae     @f                      ; it keeps its routine
        inc     rsi
        lea     rax, [rcx + C_R]
@@:     mov     rcx, rbx
        shl     rcx, 4
        mov     [r13 + rcx], rax
        inc     rbx
.point:                                 ; while there are records, the final one too
        cmp     rbx, r12
        jbe     .point_lap
        mov     rdx, [rsp + 40]         ; written: from now on it can only be run
        lea     r9, [rsp + 32]          ; (by registers: invoke moves rsp before it reads its arguments)
        invoke  VirtualProtect, r15, rdx, PAGE_EXECUTE_READ, r9
        test    eax, eax
        jz      .no_memory
        mov     rax, [native_nprogs]    ; known to the fault handler
        cmp     rax, NP_MAX
        jae     .no_memory
        imul    rax, rax, NP_SIZE
        add     rax, [native_progs]
        mov     [rax + NP_CODE], r15
        mov     [rax + NP_COLD], r14
        mov     rdx, [rsp + 40]
        add     rdx, r15
        mov     [rax + NP_END], rdx
        mov     rdx, [nat_entries]
        mov     [rax + NP_ENTRIES], rdx
        mov     [rax + NP_WORDS], r12
        inc     qword [native_nprogs]
        ; the entries stay: a native jret jumps through them (32 bytes per word, for as long as the program)
        mov     rcx, rsi
        mov     rax, r13
        jmp     .done
.no_memory:
        xor     eax, eax
.done:
        mov     rsp, rbp
        pop     r15 r14 r13 r12 rbp rdi rsi rbx
        ret

; r(i), from the last word back: 1 for a word that keeps its routine, a jump, a call or a return, or the last
; native word before one that keeps its routine; else one more than the next word's. The final record: 1.
native_runs:
        mov     rdx, [nat_entries]
        mov     rcx, r12
        shl     rcx, 5
        mov     qword [rdx + rcx + E_R], 1
        mov     rbx, r12
        jmp     .one
.one_lap:
        dec     rbx
        mov     rcx, rbx
        shl     rcx, 5
        mov     eax, 1
        movzx   r8d, byte [rsi + rbx*4]
        call    native_kind_of
        test    r8d, r8d
        jz      .set                    ; it keeps its routine
        cmp     r8d, NK_JMP
        je      .set                    ; it ends its run
        cmp     r8d, NK_JZ
        je      .set
        cmp     r8d, NK_JNZ
        je      .set
        cmp     r8d, NK_CALL
        je      .set
        cmp     r8d, NK_RET
        je      .set
        lea     r9, [rbx + 1]
        cmp     r9, r12
        jae     .set                    ; the last word
        movzx   r8d, byte [rsi + r9*4]
        call    native_kind_of
        test    r8d, r8d
        jz      .set                    ; the next one keeps its routine
        mov     rax, [rdx + rcx + E_SIZE + E_R]
        inc     rax
.set:
        mov     [rdx + rcx + E_R], rax
.one:                                   ; while there are words, from the last one back
        test    rbx, rbx
        jnz     .one_lap
        ret

; r8d = an opcode -> r8d = its native kind (0 = it keeps its routine).
native_kind_of:
        cmp     r8d, OP_COUNT
        jae     .none
        movzx   r8d, byte [native_kind + r8]
        ret
.none:
        xor     r8d, r8d
        ret

; The Janax registers the native blocks use the most (counted in the program's text, the earlier one on a
; tie), up to four, in r8-r11.
native_cache:
        xor     eax, eax                ; the uses of each Janax register
        lea     rdi, [nat_count]
        mov     ecx, 16
        rep     stosq
        xor     ebx, ebx
        jmp     .count
.count_lap:
        mov     r8, rbx
        shl     r8, 4
        add     r8, r13                 ; its record
        movzx   eax, byte [rsi + rbx*4]
        cmp     eax, OP_COUNT
        jae     .counted
        movzx   eax, byte [native_kind + rax]
        movzx   eax, byte [native_uses + rax]   ; which fields it uses: 1 rd, 2 ra, 4 rb
        test    al, 1
        jz      @f
        movzx   ecx, byte [r8 + 8]
        inc     qword [nat_count + rcx]
@@:     test    al, 2
        jz      @f
        movzx   ecx, byte [r8 + 9]
        inc     qword [nat_count + rcx]
@@:     test    al, 4
        jz      .counted
        movzx   ecx, byte [r8 + 10]
        inc     qword [nat_count + rcx]
.counted:
        inc     rbx
.count:                                 ; while there are words
        cmp     rbx, r12
        jb      .count_lap
        mov     rdi, -1                 ; nobody lives in a cache register yet
        mov     qword [nat_cache], rdi
        mov     qword [nat_cache + 8], rdi
        mov     dword [nat_creg], -1
        xor     edx, edx                ; cache register k
        jmp     .pick
.pick_lap:
        xor     eax, eax                ; the most used one left: rcx = its index, r9 = its uses
        xor     r9d, r9d
        mov     ecx, -1
        jmp     .one
.one_lap:
        cmp     [nat_count + rax*8], r9
        jbe     .one_next
        mov     r9, [nat_count + rax*8]
        mov     ecx, eax
.one_next:
        inc     eax
.one:                                   ; while there are Janax registers
        cmp     eax, 16
        jb      .one_lap
        test    ecx, ecx
        js      .picked                 ; nobody else is used
        mov     qword [nat_count + rcx*8], 0
        mov     [nat_cache + rcx], dl
        shl     ecx, 3
        mov     [nat_creg + rdx], cl
        inc     edx
.pick:                                  ; while there are cache registers
        cmp     edx, 4
        jb      .pick_lap
.picked:
        ret
; per native kind, the fields its block reads or writes: 1 rd, 2 ra, 4 rb
native_uses db 0, 1, 7, 7, 0, 1, 1, 1, 3, 0, 0

; The cold area, for every word and the final record (see the header).
native_cold:
        xor     ebx, ebx
        jmp     .one
.one_lap:
        mov     r9, rbx
        imul    r9, r9, NATIVE_COLD
        add     r9, r14                 ; its cold area
        mov     r8, rbx
        shl     r8, 4
        add     r8, r13                 ; its record
        mov     r10, rbx
        shl     r10, 5
        add     r10, [nat_entries]      ; its entries
        mov     rdi, r9                 ; S(i): mov r12, record i / mov rax, t_suspend / jmp rax
        emit    49h, 0BCh
        mov     rax, r8
        stosq
        emit    48h, 0B8h
        lea     rax, [t_suspend]
        stosq
        emit    0FFh, 0E0h
        lea     rdi, [r9 + C_F]         ; F(i): mov rdx, record i / lea r12, [rdx + 16] / mov rax, routine / jmp rax
        emit    48h, 0BAh
        mov     rax, r8
        stosq
        emit    4Ch, 8Dh, 62h, 10h
        emit    48h, 0B8h
        mov     rax, [r8]               ; its routine, as decode_program left it
        stosq
        emit    0FFh, 0E0h
        lea     rdi, [r9 + C_WC]        ; Wc(i): sub rbp, 1 / jc S(i) / jmp F(i)
        mov     eax, 1
        call    nc_sub
        lea     rax, [r9 + C_S]
        call    nc_jc
        lea     rax, [r9 + C_F]
        call    nc_jmp
        cmp     [r10 + E_CODE], r14
        jae     .next                   ; the rest only for native words
        lea     rdi, [r9 + C_R]         ; R(i): read r8-r11 / sub rbp, r - 1 / jc T(i) / jmp to its code
        call    nc_fill
        mov     rax, [r10 + E_R]
        dec     rax
        jz      @f
        call    nc_sub
        lea     rax, [r9 + C_T]
        call    nc_jc
@@:     mov     rax, [r10 + E_CODE]
        call    nc_jmp
        lea     rdi, [r9 + C_WM]        ; Wm(i): sub rbp, r / jc L(i) / jmp to its code
        mov     rax, [r10 + E_R]
        call    nc_sub
        lea     rax, [r9 + C_L]
        call    nc_jc
        mov     rax, [r10 + E_CODE]
        call    nc_jmp
        lea     rdi, [r9 + C_L]         ; L(i): add rbp, r / sub rbp, 1 / jc S(i) / jmp F(i)
        mov     rax, [r10 + E_R]
        call    nc_add
        mov     eax, 1
        call    nc_sub
        lea     rax, [r9 + C_S]
        call    nc_jc
        lea     rax, [r9 + C_F]
        call    nc_jmp
        lea     rdi, [r9 + C_T]         ; T(i): add rbp, r - 1 / jmp F(i)
        mov     rax, [r10 + E_R]
        dec     rax
        call    nc_add
        lea     rax, [r9 + C_F]
        call    nc_jmp
        cmp     qword [r10 + E_BACK], 0
        je      .next                   ; the rest only for memory words
        lea     rdi, [r9 + C_O]         ; O(i): another room, by the cartel; past its end the processor refuses
        movzx   edx, byte [rsi + rbx*4]
        sub     edx, 10h                ; 0 ld, 1 st, 2 ldb, 3 stb
        cmp     edx, 2
        jae     @f
        emit    0A8h, 07h               ; test al, 7 / jnz T(i): misaligned
        emit    0Fh, 85h
        lea     rax, [r9 + C_T]
        call    nc_rel
@@:     test    edx, 1
        jz      @f
        mov     cl, [r8 + 8]            ; a store: rcx = rd
        call    nb_get_rcx
@@:
        emit    48h, 2Bh, 93h           ; sub rdx, [rbx + P_ROOMBASE] / jbe T(i): below the cartel
        mov     eax, P_ROOMBASE
        stosd
        emit    0Fh, 86h
        lea     rax, [r9 + C_T]
        call    nc_rel
        emit    48h, 3Bh, 93h           ; cmp rdx, [rbx + P_NROOMS] / jae T(i): past it
        mov     eax, P_NROOMS
        stosd
        emit    0Fh, 83h
        lea     rax, [r9 + C_T]
        call    nc_rel
        emit    48h, 0C1h, 0E2h, 04h    ; shl rdx, 4 / add rdx, [rbx + P_ROOMS] / mov rdx, [rdx]: its entry
        emit    48h, 03h, 93h
        mov     eax, P_ROOMS
        stosd
        emit    48h, 8Bh, 12h
        emit    48h, 0C1h, 0E2h, 10h    ; shl rdx, 16 / shr rdx, 16: its place, without how to treat it
        emit    48h, 0C1h, 0EAh, 10h
        emit    89h, 0C0h               ; mov eax, eax: the position in it
        movzx   eax, byte [rsi + rbx*4]
        sub     eax, 10h
        cmp     eax, 1
        je      .o_st
        cmp     eax, 2
        je      .o_ldb
        cmp     eax, 3
        je      .o_stb
        emit    48h, 8Bh, 04h, 02h      ; mov rax, [rdx + rax]
        jmp     .o_back
.o_ldb:
        emit    0Fh, 0B6h, 04h, 02h     ; movzx eax, byte [rdx + rax]
        jmp     .o_back
.o_st:
        emit    48h, 89h, 0Ch, 02h      ; mov [rdx + rax], rcx
        jmp     .o_back
.o_stb:
        emit    88h, 0Ch, 02h           ; mov [rdx + rax], cl
.o_back:
        mov     rax, [r10 + E_BACK]     ; jmp back into its block, after its access
        call    nc_jmp
        mov     rax, rdi
        sub     rax, r9
        cmp     rax, NATIVE_COLD
        ja      fail_file               ; larger than its room: a bug here, never a wrong run
.next:
        inc     rbx
.one:                                   ; while there are words, the final record too
        cmp     rbx, r12
        jbe     .one_lap
        ret
; sub rbp, imm32 eax (48 81 ED)
nc_sub:
        emit    48h, 81h, 0EDh
        stosd
        ret
; add rbp, imm32 eax (48 81 C5)
nc_add:
        emit    48h, 81h, 0C5h
        stosd
        ret
; jc rel32 to rax
nc_jc:
        emit    0Fh, 82h
        jmp     nc_rel
; jmp rel32 to rax
nc_jmp:
        emit    0E9h
nc_rel:
        lea     rcx, [rdi + 4]
        sub     rax, rcx
        stosd
        ret
; mov rK, [r14 + its Janax register] for every cache register in use (4D 8B 46+k*8 d8)
nc_fill:
        xor     ecx, ecx
        jmp     .one
.one_lap:
        cmp     byte [nat_creg + rcx], 0FFh
        je      .next
        emit    4Dh, 8Bh
        lea     eax, [rcx*8 + 46h]
        stosb
        mov     al, [nat_creg + rcx]
        stosb
.next:
        inc     ecx
.one:                                   ; while there are cache registers
        cmp     ecx, 4
        jb      .one_lap
        ret

; Word rbx: its entries, and its block at rdi if it has one (rdi goes past it).
native_block:
        mov     r8, rbx
        shl     r8, 4
        add     r8, r13                 ; its record
        mov     rdx, rbx
        shl     rdx, 5
        add     rdx, [nat_entries]      ; its entries
        mov     r9, rbx
        imul    r9, r9, NATIVE_COLD
        add     r9, r14                 ; its cold area
        movzx   eax, byte [rsi + rbx*4] ; its opcode
        cmp     eax, OP_COUNT
        jae     .routine
        movzx   eax, byte [native_kind + rax]
        test    eax, eax
        jz      .routine
        push    rax                     ; its kind
        push    rdi                     ; where it starts
        lea     rcx, [r9 + C_WM]        ; inside a run: a jump comes in through Wm(i)
        mov     [rdx + E_JUMP], rcx
        test    rbx, rbx
        jz      .head
        cmp     qword [rdx - E_SIZE + E_R], 1
        jne     .body
.head:                                  ; it heads its run: every way in passes through its charge
        mov     [rdx + E_JUMP], rdi
        mov     rax, [rdx + E_R]
        call    nc_sub
        lea     rax, [r9 + C_L]
        call    nc_jc
.body:
        mov     [rdx + E_CODE], rdi
        mov     rax, [rsp + 8]
        call    qword [native_emitters + rax*8 - 8]
        pop     rcx
        pop     rax
        neg     rcx
        add     rcx, rdi                ; its size
        cmp     rcx, NATIVE_BLOCK
        ja      fail_file               ; larger than its room: a bug here, never a wrong run
        ret
.routine:
.routine_entries:                       ; (rbx = a word that keeps its routine, or the final record)
        mov     rdx, rbx
        shl     rdx, 5
        add     rdx, [nat_entries]
        mov     r9, rbx
        imul    r9, r9, NATIVE_COLD
        add     r9, r14
        lea     rcx, [r9 + C_F]
        mov     [rdx + E_CODE], rcx
        lea     rcx, [r9 + C_WC]
        mov     [rdx + E_JUMP], rcx
        ret

; Which native block each opcode gets (0 = it keeps its routine).
NK_LDI   = 1
NK_BIN   = 2
NK_SHIFT = 3
NK_JMP   = 4
NK_JZ    = 5
NK_JNZ   = 6
NK_SHI   = 7
NK_MEM   = 8
NK_CALL  = 9
NK_RET   = 10
native_kind db 0, NK_LDI, NK_BIN, NK_BIN, NK_BIN, 0, NK_SHIFT, NK_SHIFT
            db NK_SHIFT, NK_BIN, NK_BIN, NK_BIN, NK_JMP, NK_JZ, NK_JNZ, NK_SHI
            db NK_MEM, NK_MEM, NK_MEM, NK_MEM, NK_CALL, NK_RET, 0, 0
assert $ - native_kind = OP_COUNT
align 8
native_emitters dq nb_ldi, nb_bin, nb_shift, nb_jmp, nb_jz, nb_jnz, nb_shi, nb_mem, nb_call, nb_ret
; the opcode byte of "op rax, r/m64" per binary opcode (0 = imul, which takes two)
nb_bin_op   db 0, 0, 03h, 2Bh, 0, 0, 0, 0, 0, 23h, 0Bh, 33h
nb_shift_op db 0E0h, 0E8h, 0F8h         ; the ModRM of shl, shr, sar rax, cl

; The emitters: r8 = the record, rbx = the word, rdi = where it goes, r9 = its cold area.

macro nb_load_rax k {                   ; mov rax, the register in the field k of the record
        mov     cl, [r8 + k]
        call    nb_get_rax
}
macro nb_store_rax {                    ; mov [r14 + rd], rax (and into its cache register)
        mov     cl, [r8 + 8]
        call    nb_put_rax
}

nb_ldi:                                 ; mov rax, imm32 / rd = rax
        emit    48h, 0C7h, 0C0h
        mov     eax, [r8 + 12]
        stosd
        nb_store_rax
        jmp     nb_next

nb_bin:                                 ; rax = ra / op rax, rb / rd = rax
        nb_load_rax 9
        movzx   eax, byte [rsi + rbx*4]
        movzx   eax, byte [nb_bin_op + rax]
        emit    49h
        test    eax, eax
        jnz     @f
        emit    0Fh, 0AFh               ; imul rax, r/m64
        jmp     .operand
@@:     stosb
.operand:
        mov     cl, [r8 + 10]           ; its second operand: a cache register, or memory
        call    nb_modrm
        nb_store_rax
        jmp     nb_next

nb_shift:                               ; rax = ra / rcx = rb / shX rax, cl / rd = rax
        nb_load_rax 9                   ; (a 64-bit shift by cl takes its low 6 bits, as Janax does)
        mov     cl, [r8 + 10]
        call    nb_get_rcx
        emit    48h, 0D3h
        movzx   eax, byte [rsi + rbx*4]
        mov     al, [nb_shift_op + rax - 6]
        stosb
        nb_store_rax
        jmp     nb_next

nb_shi:                                 ; rax = rd / shl rax, 16 / or rax, imm16 / rd = rax
        nb_load_rax 8
        emit    48h, 0C1h, 0E0h, 10h
        emit    48h, 0Dh
        mov     eax, [r8 + 12]
        stosd
        nb_store_rax
        jmp     nb_next

nb_jmp:                                 ; jmp to the target's entry
        emit    0E9h
        call    nb_to_target
        ret

nb_jz:                                  ; test rd / je the target's entry / on to the next word
        mov     dl, 84h
        jmp     nb_cond
nb_jnz:                                 ; the same with jne
        mov     dl, 85h
nb_cond:
        mov     cl, [r8 + 8]            ; test rK, rK, or cmp qword [r14 + rd], 0
        call    nb_cached
        js      .memory
        emit    4Dh, 85h
        imul    eax, eax, 9
        add     al, 0C0h
        stosb
        jmp     .jump
.memory:
        emit    49h, 83h, 7Eh
        mov     al, cl
        stosb
        emit    0
.jump:
        emit    0Fh
        mov     [rdi], dl
        inc     rdi
        call    nb_to_target
        jmp     nb_on

nb_mem:                                 ; the address, the alignment, the room, the access
        nb_load_rax 9                   ; rax = ra / add rax, imm32
        emit    48h, 05h
        mov     eax, [r8 + 12]
        stosd
        movzx   edx, byte [rsi + rbx*4]
        sub     edx, 10h                ; 0 ld, 1 st, 2 ldb, 3 stb
        emit    48h, 89h, 0C2h          ; mov rdx, rax / shr rdx, 32 / jnz O(i): another room, by the cartel
        emit    48h, 0C1h, 0EAh, 20h    ; (first: measured, the room 0 path is ~7 % faster with it before the
        emit    0Fh, 85h                ; alignment and the value to store)
        lea     rax, [r9 + C_O]
        call    nc_rel
        cmp     edx, 2
        jae     @f
        emit    0A8h, 07h               ; test al, 7 / jnz T(i): misaligned
        emit    0Fh, 85h
        lea     rax, [r9 + C_T]
        call    nc_rel
@@:     test    edx, 1
        jz      @f
        mov     cl, [r8 + 8]            ; a store: rcx = rd
        call    nb_get_rcx
@@:     cmp     edx, 1                  ; room 0: past its end the processor refuses (ambientes.inc)
        je      .st
        cmp     edx, 2
        je      .ldb
        cmp     edx, 3
        je      .stb
        emit    49h, 8Bh, 04h, 07h      ; mov rax, [r15 + rax]
        jmp     .loaded
.ldb:
        emit    41h, 0Fh, 0B6h, 04h, 07h   ; movzx eax, byte [r15 + rax]
.loaded:
        call    nb_back
        nb_store_rax
        jmp     nb_next
.st:
        emit    49h, 89h, 0Ch, 07h      ; mov [r15 + rax], rcx
        call    nb_back
        jmp     nb_next
.stb:
        emit    41h, 88h, 0Ch, 07h      ; mov [r15 + rax], cl
        call    nb_back
        jmp     nb_next
; The block of word rbx goes on at rdi after its access: O(i) comes back here.
nb_back:
        mov     rax, rbx
        shl     rax, 5
        add     rax, [nat_entries]
        mov     [rax + E_BACK], rdi
        ret

nb_call:                                ; room in the return stack, the record after it there, then the jump
        emit    48h, 3Bh, 0BBh          ; cmp rdi, [rbx + P_RETCAP] / jae F(i): one more page, or past the limit
        mov     eax, P_RETCAP
        stosd
        emit    0Fh, 83h
        lea     rax, [r9 + C_F]
        call    nc_rel
        emit    48h, 0B8h               ; mov rax, the record after it
        lea     rax, [r8 + R_SIZE]
        stosq
        emit    48h, 89h, 04h, 0FEh     ; mov [rsi + rdi*8], rax
        emit    48h, 0FFh, 0C7h         ; inc rdi
        emit    0E9h                    ; jmp to the target's entry
        call    nb_to_target
        ret

nb_ret:                                 ; the record it comes back to, then straight to that word's entry
        emit    48h, 85h, 0FFh          ; test rdi, rdi / jz F(i): jret without jcall
        emit    0Fh, 84h
        lea     rax, [r9 + C_F]
        call    nc_rel
        emit    48h, 0FFh, 0CFh         ; dec rdi
        emit    48h, 8Bh, 14h, 0FEh     ; mov rdx, [rsi + rdi*8]
        emit    48h, 0B8h               ; mov rax, -table / add rax, rdx: its word * 16
        mov     rax, r13
        neg     rax
        stosq
        emit    48h, 01h, 0D0h
        emit    48h, 0B9h               ; mov rcx, the entries / jmp [rcx + rax*2 + E_JUMP]
        mov     rax, [nat_entries]
        stosq
        emit    0FFh, 64h, 41h, E_JUMP
        ret

; After a word that falls through: the next one is in the same run (its code follows: nothing to write), or
; it starts another one.
nb_next:
        mov     rax, rbx
        shl     rax, 5
        add     rax, [nat_entries]
        cmp     qword [rax + E_R], 1
        jne     nb_falls                ; more of its run after it
; On to the next word, through its entry: nothing to write if that entry is its own block, right after.
nb_on:
        lea     eax, [ebx + 1]
        cmp     rax, r12
        jae     .jump                   ; past the last word: the final record's routine
        movzx   ecx, byte [rsi + rax*4]
        cmp     ecx, OP_COUNT
        jae     .jump
        cmp     byte [native_kind + rcx], 0
        jne     nb_falls                ; a native word after a run: it heads its own, right here
.jump:
        shl     rax, 5
        add     rax, [nat_entries]
        mov     rax, [rax + E_JUMP]
        jmp     nc_jmp
nb_falls:
        ret

; The rel32 to the entry of this word's jump target, at rdi.
nb_to_target:
        mov     eax, [r8 + 12]
        shr     eax, 4                  ; byte offset into the table -> word
        shl     rax, 5
        add     rax, [nat_entries]
        mov     rax, [rax + E_JUMP]
        jmp     nc_rel

; cl = a field of the record (a Janax register * 8) -> eax = its cache register 0-3, or -1 (sign set) if it
; lives only in memory. Keeps every other register.
nb_cached:
        movzx   eax, cl
        shr     eax, 3
        movsx   eax, byte [nat_cache + rax]
        test    eax, eax
        ret
; cl = a field: mov rax, that register (4C 89 C0+k*8, or 49 8B 46 d8)
nb_get_rax:
        call    nb_cached
        js      .memory
        emit    4Ch, 89h
        shl     eax, 3
        add     al, 0C0h
        stosb
        ret
.memory:
        emit    49h, 8Bh, 46h
        mov     al, cl
        stosb
        ret
; cl = a field: mov rcx, that register (4C 89 C1+k*8, or 49 8B 4E d8)
nb_get_rcx:
        call    nb_cached
        js      .memory
        emit    4Ch, 89h
        shl     eax, 3
        add     al, 0C1h
        stosb
        ret
.memory:
        emit    49h, 8Bh, 4Eh
        mov     al, cl
        stosb
        ret
; cl = a field: mov [r14 + d8], rax, and mov rK, rax if it lives in rK (49 89 C0+k)
nb_put_rax:
        emit    49h, 89h, 46h
        mov     al, cl
        stosb
        call    nb_cached
        js      .done
        emit    49h, 89h
        add     al, 0C0h
        stosb
.done:
        ret
; cl = a field, after "49 op": the operand that register is (ModRM C0+k, or 46 d8)
nb_modrm:
        call    nb_cached
        js      .memory
        add     al, 0C0h
        stosb
        ret
.memory:
        emit    46h
        mov     al, cl
        stosb
        ret

; Every translated program, for the fault handler: NP_SIZE bytes each, written once (under the captain's
; lock) and never moved, so the handler reads them without a lock. NP_MAX is criterion, not a measurement:
; distinct programs translated in one run (2.5 MiB of addresses, its pages untouched until used).
NP_MAX     = 65536
NP_SIZE    = 40
NP_CODE    = 0                  ; its blocks
NP_COLD    = 8                  ; its cold area
NP_END     = 16                 ; where its code ends
NP_ENTRIES = 24
NP_WORDS   = 32

; The processor refused an access (Capitan: "the wall stops you by itself"). Inside a translated program it
; is a memory word past a room's end, or through a destroyed room: the word goes on by its T(i), as when it
; leaves its run by the slow way, and its routine gives the exact answer (code 5, at the same instruction as
; the interpreter). Anything else is not ours. A vectored handler: rcx = EXCEPTION_POINTERS, -> eax = -1
; (go on, at the new rip) or 0 (look further). Uses only rax, rcx, rdx, r8-r11 (and rsi, kept).
native_fault:
        mov     rax, [rcx]              ; the record
        cmp     dword [rax], 0C0000005h
        jne     .not_ours               ; not an access refused
        mov     r8, [rcx + 8]           ; the context
        mov     rdx, [r8 + 0F8h]        ; its rip
        mov     r9, [native_progs]
        mov     r10, [native_nprogs]
        jmp     .prog
.prog_lap:
        dec     r10
        imul    rax, r10, NP_SIZE
        add     rax, r9
        cmp     rdx, [rax + NP_CODE]
        jb      .prog
        cmp     rdx, [rax + NP_END]
        jb      .found
.prog:                                  ; while there are programs to look in
        test    r10, r10
        jnz     .prog_lap
.not_ours:
        xor     eax, eax
        ret
.found:
        mov     r11, [rax + NP_COLD]
        cmp     rdx, r11
        jae     .cold
        push    rsi
        mov     r9, [rax + NP_ENTRIES]  ; in the blocks: the last native word whose block starts at rip or before
        mov     r10, [rax + NP_WORDS]
        xor     ecx, ecx                ; the word
        xor     esi, esi                ; the one found
        jmp     .word
.word_lap:
        mov     rax, rcx
        shl     rax, 5
        mov     rax, [r9 + rax + E_CODE]
        cmp     rax, r11
        jae     @f                      ; it keeps its routine: no block
        cmp     rax, rdx
        ja      .word_found             ; past rip: the blocks go in order
        mov     rsi, rcx
@@:     inc     rcx
.word:                                  ; while there are words
        cmp     rcx, r10
        jb      .word_lap
.word_found:
        mov     rax, rsi
        pop     rsi
        jmp     .to_t
.cold:                                  ; in the cold area: its word by its place
        mov     rax, rdx
        sub     rax, r11
        xor     edx, edx
        mov     ecx, NATIVE_COLD
        div     rcx
.to_t:
        imul    rax, rax, NATIVE_COLD
        lea     rax, [r11 + rax + C_T]
        mov     [r8 + 0F8h], rax
        mov     eax, -1
        ret

; rcx words at rdx -> rax = their table for the engine in use (decoded; and translated, with the translated
; engine, rcx = how many words got native code); 0 if there is no memory. Keeps callee-saved registers.
prepare_program:
        push    rcx rdx
        sub     rsp, 8
        call    decode_program
        add     rsp, 8
        pop     rdx rcx
        test    rax, rax
        jz      .done
        cmp     byte [motor], 2
        jne     .done
        call    translate_table
.done:
        ret
