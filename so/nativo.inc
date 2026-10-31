; Janax OS translated engine (JANAX_MOTOR=traductor). The routine table of a program (rutinas.inc), with
; native code written for each of its instructions: the record of a word points at that code instead of
; at its routine. The code does what the routine does with the registers and operands already in it, and
; keeps every convention of the routine engine (r12 next record, r13 table, r14 Janax registers, r15 data,
; rsi return stack, rdi depth, rbp budget, rbx process), so it runs inside run_routines as it is:
;  - ldi, the arithmetic but jdiv, the shifts, jshi, the jumps, the calls and returns, and memory inside room 0
;    run in native code.
;  - Anything else (jhalt, jdiv, the windows, an unknown opcode, memory that needs the room package, a
;    misaligned access, a call that needs more return stack, a jret without jcall) jumps to its own routine, which goes on through the table: back to native.
;  - Each instruction charges its turn before it runs, as t_next does, so a turn ends at the same
;    instruction as with the routines and the interpreter, bit for bit.
;
; Per word i the code has an entry W(i): its native block, or F(i) for the ones that keep their routine.
; A block that falls through charges the next word and goes on into the next block. A charge that finds the
; turn spent jumps to S(i), which leaves r12 at word i's record for t_suspend. S and F live in a cold area of
; 64 bytes per word (and one more for the final record). Jumps inside the code are rel32 always, so a
; block's size does not depend on where its targets are: a first pass places the blocks, a second one writes
; them with their targets. Written while the memory can be written, then it can only be run (never both).
; Translating happens with one rower only (at boot, or inside the window, under the captain's lock).

NATIVE_BLOCK = 64               ; bytes a block may take: the largest (an 8-byte load) takes 54
NATIVE_COLD  = 128              ; bytes per word in the cold area: S at +0 (22), F at +32 (26), R at +64 (21)

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
        lea     rdx, [rcx + 1]          ; the entries W, one per word and the final record
        shl     rdx, 3
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .no_memory
        mov     [nat_entries], rax
        mov     rdx, r12                ; the code: the blocks, then the cold area
        shl     rdx, 6
        lea     rax, [r12 + 1]
        shl     rax, 7
        add     rdx, rax
        mov     [rsp + 40], rdx
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .no_memory
        mov     r15, rax                ; the blocks
        mov     r14, r12
        shl     r14, 6
        add     r14, r15                ; the cold area
        call    native_cold             ; S and F for every word, from the routines in the table
        call    native_cache            ; the Janax registers that live in r8-r11
        mov     rcx, r12                ; the final record keeps its routine: W(n) = F(n)
        shl     rcx, 7
        lea     rcx, [r14 + rcx + 32]
        mov     rax, [nat_entries]
        mov     [rax + r12*8], rcx
        mov     qword [rsp + 32], 2     ; two passes: place, then write
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
        dec     qword [rsp + 32]
.pass:                                  ; while passes are left
        cmp     qword [rsp + 32], 0
        jne     .pass_lap
        call    native_reload           ; R for every native word, now that every block has its place
        xor     esi, esi                ; (the words are not needed now: rsi counts the native blocks)
        xor     ebx, ebx                ; every record points at its entry now
        mov     rdx, [nat_entries]
        jmp     .point
.point_lap:
        mov     rax, [rdx + rbx*8]
        cmp     rax, r14
        jae     @f                      ; a native block: the table enters it through R(i)
        inc     rsi
        mov     rax, rbx
        shl     rax, 7
        lea     rax, [r14 + rax + 64]
@@:
        mov     rcx, rbx
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
        invoke  VirtualFree, qword [nat_entries], 0, MEM_RELEASE
        mov     rcx, rsi
        mov     rax, r13
        jmp     .done
.no_memory:
        xor     eax, eax
.done:
        mov     rsp, rbp
        pop     r15 r14 r13 r12 rbp rdi rsi rbx
        ret

; The cold area: for every word i (and the final record), S(i) at cold + i * 64 and F(i) at +32.
;   S(i): mov r12, record i / mov rax, t_suspend / jmp rax
;   F(i): mov rdx, record i / lea r12, [rdx + 16] / mov rax, its routine / jmp rax
native_cold:
        xor     ebx, ebx
        jmp     .one
.one_lap:
        mov     rdi, rbx
        shl     rdi, 7
        add     rdi, r14
        mov     r8, rbx
        shl     r8, 4
        add     r8, r13                 ; its record
        emit    49h, 0BCh
        mov     [rdi], r8
        add     rdi, 8
        emit    48h, 0B8h
        lea     rax, [t_suspend]
        mov     [rdi], rax
        add     rdi, 8
        emit    0FFh, 0E0h
        add     rdi, 32 - 22
        emit    48h, 0BAh
        mov     [rdi], r8
        add     rdi, 8
        emit    4Ch, 8Dh, 62h, 10h
        emit    48h, 0B8h
        mov     rax, [r8]               ; its routine, as decode_program left it
        mov     [rdi], rax
        add     rdi, 8
        emit    0FFh, 0E0h
        inc     rbx
.one:                                   ; while there are words, the final record too
        cmp     rbx, r12
        jbe     .one_lap
        ret

; Word rbx: its entry into W, and its block at rdi if it has one (rdi goes past it).
native_block:
        mov     r8, rbx
        shl     r8, 4
        add     r8, r13                 ; its record
        mov     rdx, [nat_entries]
        movzx   eax, byte [rsi + rbx*4] ; its opcode
        cmp     eax, OP_COUNT
        jae     .routine
        movzx   ecx, byte [native_kind + rax]
        test    ecx, ecx
        jz      .routine
        mov     [rdx + rbx*8], rdi      ; a native block
        push    rdi
        call    qword [native_emitters + rcx*8 - 8]
        pop     rcx
        neg     rcx
        add     rcx, rdi                ; its size
        cmp     rcx, NATIVE_BLOCK
        ja      fail_file               ; larger than its room: a bug here, never a wrong run
        ret
.routine:
        mov     rcx, rbx
        shl     rcx, 7
        lea     rcx, [r14 + rcx + 32]   ; F(i)
        mov     [rdx + rbx*8], rcx
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

; The emitters: r8 = the record, rbx = the word, rdi = where it goes.

macro nb_load_rax k {                   ; mov rax, the register in the field k of the record
        mov     cl, [r8 + k]
        call    nb_get_rax
}
macro nb_store_rax {                    ; mov [r14 + rd], rax (and into its cache register)
        mov     cl, [r8 + 8]
        call    nb_put_rax
}

nb_ldi:                                 ; mov rax, imm32 / mov [rd], rax
        emit    48h, 0C7h, 0C0h
        mov     eax, [r8 + 12]
        stosd
        nb_store_rax
        jmp     nb_next

nb_bin:                                 ; mov rax, [ra] / op rax, [rb] / mov [rd], rax
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

nb_shift:                               ; mov rax, [ra] / mov rcx, [rb] / shX rax, cl / mov [rd], rax
        nb_load_rax 9                   ; (a 64-bit shift by cl takes its low 6 bits, as Janax does)
        mov     cl, [r8 + 10]
        call    nb_get_rcx
        emit    48h, 0D3h
        movzx   eax, byte [rsi + rbx*4]
        mov     al, [nb_shift_op + rax - 6]
        stosb
        nb_store_rax
        jmp     nb_next

nb_shi:                                 ; mov rax, [rd] / shl rax, 16 / or rax, imm16 / mov [rd], rax
        nb_load_rax 8
        emit    48h, 0C1h, 0E0h, 10h
        emit    48h, 0Dh
        mov     eax, [r8 + 12]
        stosd
        nb_store_rax
        jmp     nb_next

nb_jmp:                                 ; charge the target and jump to it
        call    nb_taken
        ret

nb_jz:                                  ; cmp qword [rd], 0 / jne past the taken way / the taken way
        mov     dl, 75h
        jmp     nb_cond
nb_jnz:                                 ; the same with je
        mov     dl, 74h
nb_cond:
        mov     cl, [r8 + 8]            ; test r, r / or cmp qword [r14 + rd], 0
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
        mov     [rdi], dl
        inc     rdi
        emit    15                      ; the taken way: a charge (10 bytes) and a jump (5)
        call    nb_taken
        jmp     nb_next

nb_mem:                                 ; the address, room 0's limit, the alignment, the access
        nb_load_rax 9                   ; mov rax, [ra] / add rax, imm32
        emit    48h, 05h
        mov     eax, [r8 + 12]
        stosd
        movzx   edx, byte [rsi + rbx*4]
        sub     edx, 10h                ; 0 ld, 1 st, 2 ldb, 3 stb
        mov     eax, P_LIM8
        cmp     edx, 2
        jb      @f
        mov     eax, P_LIM1
@@:     emit    48h, 3Bh, 83h           ; cmp rax, [rbx + P_LIMx] / jae F(i): the room package
        stosd
        emit    0Fh, 83h
        call    nb_to_routine
        cmp     edx, 2
        jae     @f
        emit    0A8h, 07h               ; test al, 7 / jnz F(i): misaligned
        emit    0Fh, 85h
        call    nb_to_routine
@@:     cmp     edx, 1
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
        nb_store_rax
        jmp     nb_next
.st:
        mov     cl, [r8 + 8]            ; mov rcx, rd / mov [r15 + rax], rcx
        call    nb_get_rcx
        emit    49h, 89h, 0Ch, 07h
        jmp     nb_next
.stb:
        mov     cl, [r8 + 8]            ; mov rcx, rd / mov [r15 + rax], cl
        call    nb_get_rcx
        emit    41h, 88h, 0Ch, 07h
        jmp     nb_next

nb_call:                                ; room in the return stack, the record after it there, then the jump
        emit    48h, 3Bh, 0BBh          ; cmp rdi, [rbx + P_RETCAP] / jae F(i): one more page, or past the limit
        mov     eax, P_RETCAP
        stosd
        emit    0Fh, 83h
        call    nb_to_routine
        emit    48h, 0B8h               ; mov rax, the record after it
        lea     rax, [r8 + R_SIZE]
        stosq
        emit    48h, 89h, 04h, 0FEh     ; mov [rsi + rdi*8], rax
        emit    48h, 0FFh, 0C7h         ; inc rdi
        call    nb_taken
        ret

nb_ret:                                 ; the record it comes back to, charged, then its entry in the table
        emit    48h, 85h, 0FFh          ; test rdi, rdi / jz F(i): jret without jcall
        emit    0Fh, 84h
        call    nb_to_routine
        emit    48h, 0FFh, 0CFh         ; dec rdi
        emit    48h, 8Bh, 14h, 0FEh     ; mov rdx, [rsi + rdi*8]
        emit    48h, 83h, 0EDh, 01h     ; sub rbp, 1 / jc past the jump
        emit    72h, 02h
        emit    0FFh, 22h               ; jmp qword [rdx]
        emit    49h, 89h, 0D4h          ; spent: mov r12, rdx / mov rax, t_suspend / jmp rax
        emit    48h, 0B8h
        lea     rax, [t_suspend]
        stosq
        emit    0FFh, 0E0h
        ret

; Falling through: charge the next word, and jump to it unless its entry is the next block.
nb_next:
        lea     eax, [ebx + 1]
        call    nb_charge
        lea     eax, [ebx + 1]
        cmp     rax, r12
        jae     .jump                   ; past the last word: the final record's routine
        movzx   ecx, byte [rsi + rax*4]
        cmp     ecx, OP_COUNT
        jae     .jump
        cmp     byte [native_kind + rcx], 0
        jne     .falls
.jump:
        call    nb_jump
.falls:
        ret

; The jump of this word's record (jjmp, jjz, jjnz): charge its target, then jump to it.
nb_taken:
        mov     eax, [r8 + 12]
        shr     eax, 4                  ; byte offset into the table -> word
        call    nb_charge
        mov     eax, [r8 + 12]
        shr     eax, 4
        jmp     nb_jump

; eax = a word: sub rbp, 1 / jc S(word)
nb_charge:
        emit    48h, 83h, 0EDh, 01h, 0Fh, 82h
        shl     rax, 7
        add     rax, r14
        lea     rcx, [rdi + 4]
        sub     rax, rcx
        stosd
        ret
; eax = a word: jmp W(word)
nb_jump:
        mov     rcx, [nat_entries]
        mov     rax, [rcx + rax*8]
        emit    0E9h
        lea     rcx, [rdi + 4]
        sub     rax, rcx
        stosd
        ret
; The rel32 of a jump to F(rbx), at rdi.
nb_to_routine:
        mov     rax, rbx
        shl     rax, 7
        lea     rax, [r14 + rax + 32]
        lea     rcx, [rdi + 4]
        sub     rax, rcx
        stosd
        ret

; The registers that live in the processor: the 4 Janax registers the native blocks of the program use the
; most (counted in its text, the earlier one on a tie), in r8-r11. Every write goes to memory too, so the
; routines always find them there; whatever comes back from a routine or from the table reloads them (R).
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

; R(i) at cold + i * 128 + 64 for every native word: mov rK, [r14 + its Janax register] for each cache
; register in use, then jmp to its block.
native_reload:
        xor     ebx, ebx
        jmp     .one
.one_lap:
        mov     rax, [nat_entries]
        mov     r9, [rax + rbx*8]       ; its entry
        cmp     r9, r14
        jae     .next                   ; it keeps its routine
        mov     rdi, rbx
        shl     rdi, 7
        lea     rdi, [r14 + rdi + 64]
        xor     edx, edx
        jmp     .reg
.reg_lap:
        movzx   ecx, byte [nat_creg + rdx]
        cmp     cl, 0FFh
        je      .reg_next
        emit    4Dh, 8Bh                ; mov rK, [r14 + d8]
        lea     eax, [rdx*8 + 46h]
        stosb
        mov     al, cl
        stosb
.reg_next:
        inc     edx
.reg:                                   ; while there are cache registers
        cmp     edx, 4
        jb      .reg_lap
        emit    0E9h                    ; jmp to its block
        mov     rax, r9
        lea     rcx, [rdi + 4]
        sub     rax, rcx
        stosd
.next:
        inc     rbx
.reg_done:
.one:                                   ; while there are words
        cmp     rbx, r12
        jb      .one_lap
        ret

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
