; Janax OS routine engine. Capitan: "an interpreter at run time that turns the original into native
; without compiling".
;
; Each program is decoded once into a table of 16-byte records, one per word, plus a final record:
;   +0  qword  address of the native routine for that instruction (compiled inside the kernel)
;   +8  byte   rd * 8      +9 byte ra * 8      +10 byte rb * 8
;   +12 dword  operand: the immediate already extended (zero-extended for jshi), or, for jumps,
;              jcall and jcall0, the target as a byte offset into the table
; Running is jumping from routine to routine: nothing is decoded again and no machine code is generated
; (no new executable memory). A target outside the program points at the final record, which ends the
; process with code 2 like the interpreter's fetch check; an unknown opcode gets the routine that ends
; it with code 1. The final record gives back its instruction: the interpreter fails before counting.
;
; Every routine the table jumps to starts aligned to 16 bytes, the block the processor fetches to decode at once: its speed
; then does not depend on how many bytes the routines before it take. Measured: without it, a change of
; a few bytes anywhere before moved calculo by up to ~15 %.
;
; Registers while running: r12 = next record, r13 = table, r14 = Janax registers, r15 = data memory,
; rsi = return stack (record addresses; one from a jcall0 has bit 63 set and its rd in the low 4 bits, free
; since records are 16-byte aligned), rdi = depth, rbp = budget left, rbx = process, rdx = record
; being run. The interpreter stays as the reference (JANAX_MOTOR=interprete); the translated engine (the
; default, nativo.inc) points these records at native code; the tests compare the three.

R_SIZE = 16

; Decodes rcx words at rdx. -> rax = the table (0 if there is no memory). Keeps callee-saved registers.
decode_program:
        push    rbx rsi rdi r12 r13
        mov     r13, rsp
        and     rsp, -16                ; callable from any stack alignment
        mov     rsi, rdx
        mov     r12, rcx
        lea     rdx, [rcx + 1]
        shl     rdx, 4
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .done
        mov     rdi, rax
        xor     ebx, ebx                ; word index
        jmp     .word
.word_lap:
        mov     eax, [rsi + rbx*4]
        mov     rcx, rbx
        shl     rcx, 4
        add     rcx, rdi                ; this word's record
        movzx   edx, al
        cmp     edx, OP_COUNT
        jb      @f
        lea     rdx, [t_fail_op]
        mov     [rcx], rdx
        jmp     .next
@@:     mov     r8, [ttable + rdx*8]
        mov     [rcx], r8
        mov     [rcx + 11], dl          ; opcode, for the fusion pass
        mov     r8d, eax
        shr     r8d, 8
        and     r8d, 15
        shl     r8d, 3
        mov     [rcx + 8], r8b          ; rd * 8
        mov     r8d, eax
        shr     r8d, 12
        and     r8d, 15
        shl     r8d, 3
        mov     [rcx + 9], r8b          ; ra * 8
        mov     r8d, eax
        shr     r8d, 16
        and     r8d, 15
        shl     r8d, 3
        mov     [rcx + 10], r8b         ; rb * 8
        shr     eax, 16                 ; imm16
        cmp     edx, 0Fh
        je      .zero_extended
        movsx   rax, ax
        cmp     edx, 0Ch                ; jjmp, jjz, jjnz: targets
        jb      .plain
        cmp     edx, 0Eh
        jbe     .target
        cmp     edx, 14h                ; jcall
        je      .target
        cmp     edx, 18h                ; jjn, jjnn
        je      .target
        cmp     edx, 19h
        je      .target
        cmp     edx, 1Ch                ; jcall0
        jne     .plain
.target:
        lea     rax, [rax + rbx + 1]    ; relative to the next instruction
        cmp     rax, r12
        jbe     @f                      ; unsigned: a negative target is outside too
        mov     rax, r12                ; outside: the final record
@@:     shl     rax, 4
.plain:
.zero_extended:
        mov     [rcx + 12], eax
.next:
        inc     rbx
.word:
        cmp     rbx, r12
        jb      .word_lap
.final:
        mov     rcx, r12
        shl     rcx, 4
        lea     rdx, [t_fail_pc]
        mov     [rdi + rcx], rdx
        ; A jjmp that lands on a jjz/jjnz decides that condition in place. The entry jump of every
        ; (rotated) while lands on its condition, so entering a loop pays one routine less.
        xor     ebx, ebx
        jmp     .thread
.thread_lap:
        mov     rcx, rbx
        shl     rcx, 4
        add     rcx, rdi
        lea     rdx, [t_jmp]
        cmp     [rcx], rdx
        jne     .thread_next
        mov     eax, [rcx + 12]
        mov     rax, [rdi + rax]        ; the routine at the target
        lea     rdx, [t_jz]
        lea     r8, [t_jmp_jz]
        cmp     rax, rdx
        je      @f
        lea     rdx, [t_jnz]
        lea     r8, [t_jmp_jnz]
        cmp     rax, rdx
        jne     .thread_next
@@:     mov     [rcx], r8
.thread_next:
        inc     rbx
.thread:
        cmp     rbx, r12
        jb      .thread_lap
        ; An instruction followed by a jjz/jjnz (or a jsub by a jjn/jjnn) decides that condition at its end. Every lap of a (rotated)
        ; while ends in its condition, so every lap pays one routine less. The condition keeps its own record:
        ; jumps that land on it still find it.
        mov     ebx, 1
        jmp     .fuse
.fuse_lap:
        mov     rcx, rbx
        shl     rcx, 4
        add     rcx, rdi                ; the condition
        lea     r8, [ftable_jz]
        lea     rdx, [t_jz]
        cmp     [rcx], rdx
        je      @f
        lea     r8, [ftable_jnz]
        lea     rdx, [t_jnz]
        cmp     [rcx], rdx
        je      @f
        lea     r8, [ftable_jn]
        lea     rdx, [t_jn]
        cmp     [rcx], rdx
        je      @f
        lea     r8, [ftable_jnn]
        lea     rdx, [t_jnn]
        cmp     [rcx], rdx
        jne     .fuse_next
@@:     movzx   edx, byte [rcx - R_SIZE + 11]
        mov     rdx, [r8 + rdx*8]
        test    rdx, rdx
        jz      .fuse_next              ; the one before cannot be fused (a jump, a call, jsys...)
        mov     [rcx - R_SIZE], rdx
.fuse_next:
        inc     rbx
.fuse:
        cmp     rbx, r12
        jb      .fuse_lap
.threaded:
        mov     rax, rdi
.done:
        mov     rsp, r13
        pop     r13 r12 rdi rsi rbx
        ret

; Runs the process in rbx for up to rax instructions with its table. Same contract as run_process.
run_routines:
        mov     [rbx + P_BUDGET0], rax
        mov     rbp, rax
        mov     r13, [rbx + P_TABLE]     ; made at birth (share_program)
        mov     r14, rbx
        mov     r15, [rbx + P_DATA]
        mov     r12, [rbx + P_PC]
        shl     r12, 4
        add     r12, r13
        mov     rsi, [rbx + P_RET]
        mov     rdi, [rbx + P_DEPTH]

macro t_next {
          sub     rbp, 1
          jc      t_suspend
          mov     rdx, r12
          add     r12, R_SIZE
          jmp     qword [rdx]
}
        t_next

        align 16
t_suspend:
        xor     ebp, ebp                ; the budget is spent (or the turn was cut)
        cmp     qword [rbx + P_CUT], 0
        jne     .cut
        mov     rcx, [rbx + P_TAIL]     ; spent: if it is in its last part and what is left costs no more
        test    rcx, rcx                ; than passing the oar, it finishes first (remos.inc)
        jz      t_store
        mov     rax, r12
        sub     rax, r13
        shr     rax, 4                  ; the next word
        mov     eax, [rcx + rax*4]
        test    eax, eax
        jz      t_store
        cmp     rax, [tail_limit]
        ja      t_store
        mov     rbp, rax
        add     [rbx + P_BUDGET0], rax
        t_next
.cut:
        mov     qword [rbx + P_CUT], 0
t_store:
        sub     r12, r13
        shr     r12, 4
        mov     [rbx + P_PC], r12
        mov     [rbx + P_DEPTH], rdi
        call    ret_trim
        mov     rax, [rbx + P_BUDGET0]
        sub     rax, rbp
        ret

        align 16
t_halt:
        xor     ecx, ecx
        jmp     t_ended
        align 16
t_fail_op:
        mov     ecx, 1                  ; counted, like the interpreter
        jmp     t_ended
        align 16
t_fail_pc:
        inc     rbp                     ; the interpreter fails before counting the fetch
        mov     ecx, 2
        jmp     t_ended
        align 16
t_fail_mem:
        mov     ecx, 5
        jmp     t_ended
        align 16
t_fail_align:
        mov     ecx, 6
        jmp     t_ended
        align 16
t_fail_call:
        mov     ecx, 7
        jmp     t_ended
        align 16
t_fail_ret:
        mov     ecx, 8
t_ended:
        mov     [rbx + P_CODE], rcx
        mov     qword [rbx + P_DONE], 1
        jmp     t_store

; How a routine ends. T_NEXT runs the next record. T_JZ/T_JNZ/T_JN/T_JNN also run the condition right after
; it (the next record), counted as the instruction it is: if the turn ends there, the process stops at the
; condition, exactly where the interpreter would.
T_NEXT = 0
T_JZ   = 1
T_JNZ  = 2
T_JN   = 3
T_JNN  = 4

macro t_end kind {
  local taken
  if kind = T_NEXT
          t_next
  else
          sub     rbp, 1
          jc      t_suspend               ; r12 already points at the condition
          movzx   ecx, byte [r12 + 8]
          cmp     qword [r14 + rcx], 0
    if kind = T_JZ
          je      taken
    else if kind = T_JNZ
          jne     taken
    else if kind = T_JN
          jl      taken
    else
          jge     taken
    end if
          add     r12, R_SIZE
          t_next
  taken:
          mov     eax, [r12 + 12]
          lea     r12, [r13 + rax]
          t_next
  end if
}

; Each instruction that ends by falling through exists three times: alone, and fused with a jjz or a
; jjnz after it (name, name_jz, name_jnz).
macro t_fusable defining, name, [arg] {
  common
          defining name, T_NEXT, arg
          defining name#_jz, T_JZ, arg
          defining name#_jnz, T_JNZ, arg
}

macro t_ldi_r name, kind, unused {
  align 16
  name:
          movsxd  rax, dword [rdx + 12]
          movzx   ecx, byte [rdx + 8]
          mov     [r14 + rcx], rax
          t_end   kind
}
t_fusable t_ldi_r, t_ldi

macro t_binop name, kind, insn {
  align 16
  name:
          movzx   ecx, byte [rdx + 9]
          mov     rax, [r14 + rcx]
          movzx   ecx, byte [rdx + 10]
          insn    rax, [r14 + rcx]
          movzx   ecx, byte [rdx + 8]
          mov     [r14 + rcx], rax
          t_end   kind
}

t_fusable t_binop, t_add, add
t_fusable t_binop, t_sub, sub
t_binop t_sub_jn, T_JN, sub             ; a comparison and its signed condition
t_binop t_sub_jnn, T_JNN, sub
t_fusable t_binop, t_mul, imul
t_fusable t_binop, t_and, and
t_fusable t_binop, t_or,  or
t_fusable t_binop, t_xor, xor

macro t_div_r name, kind, unused {
  local by_zero, by_minus_one, store
  align 16
  name:
          movzx   ecx, byte [rdx + 9]
          mov     rax, [r14 + rcx]
          movzx   ecx, byte [rdx + 10]
          mov     rcx, [r14 + rcx]
          movzx   r8d, byte [rdx + 8]
          test    rcx, rcx
          jz      by_zero
          cmp     rcx, -1
          je      by_minus_one
          cqo
          idiv    rcx
          jmp     store
  by_zero:
          xor     eax, eax                ; Janax: x / 0 = 0
          jmp     store
  by_minus_one:
          neg     rax                     ; MIN / -1 = MIN
  store:
          mov     [r14 + r8], rax
          t_end   kind
}
t_fusable t_div_r, t_div

macro t_shiftop name, kind, insn {
  align 16
  name:
          movzx   r8d, byte [rdx + 9]
          mov     rax, [r14 + r8]
          movzx   r8d, byte [rdx + 10]
          mov     rcx, [r14 + r8]
          and     ecx, 63
          insn    rax, cl
          movzx   r8d, byte [rdx + 8]
          mov     [r14 + r8], rax
          t_end   kind
}

t_fusable t_shiftop, t_shl, shl
t_fusable t_shiftop, t_shr, shr
t_fusable t_shiftop, t_sar, sar

        align 16
t_jmp:
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
        t_next

        align 16
t_jz:
        movzx   ecx, byte [rdx + 8]
        cmp     qword [r14 + rcx], 0
        jne     @f
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
@@:     t_next

        align 16
t_jnz:
        movzx   ecx, byte [rdx + 8]
        cmp     qword [r14 + rcx], 0
        je      @f
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
@@:     t_next

; jjmp + the jjz/jjnz it lands on, counted as the two instructions they are. If the turn ends between
; them, the process stops at the condition, exactly where the interpreter would.
macro t_jmp_cond name, exits_when {
  align 16
  name:
          mov     eax, [rdx + 12]
          lea     r8, [r13 + rax]         ; the condition's record
          sub     rbp, 1
          jc      .cut
          movzx   ecx, byte [r8 + 8]
          cmp     qword [r14 + rcx], 0
          exits_when .taken
          lea     r12, [r8 + R_SIZE]
          t_next
  .taken:
          mov     eax, [r8 + 12]
          lea     r12, [r13 + rax]
          t_next
  .cut:
          mov     r12, r8
          jmp     t_suspend
}

t_jmp_cond t_jmp_jz,  je
t_jmp_cond t_jmp_jnz, jne

        align 16
t_jn:
        movzx   ecx, byte [rdx + 8]
        cmp     qword [r14 + rcx], 0
        jge     @f
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
@@:     t_next

        align 16
t_jnn:
        movzx   ecx, byte [rdx + 8]
        cmp     qword [r14 + rcx], 0
        jl      @f
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
@@:     t_next

macro t_shi_r name, kind, unused {
  align 16
  name:
          movzx   ecx, byte [rdx + 8]
          mov     rax, [r14 + rcx]
          shl     rax, 16
          mov     r8d, [rdx + 12]
          or      rax, r8
          mov     [r14 + rcx], rax
          t_end   kind
}
t_fusable t_shi_r, t_shi

; size, alignment check, load or store
macro t_memop name, kind, size, align_check, is_load {
  local translate, inside
  align 16
  name:
          movsxd  rax, dword [rdx + 12]
          movzx   ecx, byte [rdx + 9]
          add     rax, [r14 + rcx]
          cmp     rax, [rbx + P_LIM#size]   ; room 0, below its end: nothing to translate
          jae     translate
  inside:
    if align_check
          test    al, 7
          jnz     t_fail_align
    end if
          movzx   r8d, byte [rdx + 8]
    if is_load
      if size = 8
          mov     rax, [r15 + rax]
      else
          movzx   eax, byte [r15 + rax]
      end if
          mov     [r14 + r8], rax
    else
          mov     rcx, [r14 + r8]
      if size = 8
          mov     [r15 + rax], rcx
      else
          mov     [r15 + rax], cl
      end if
    end if
          t_end   kind
  postpone \{                     ; the package goes after all the code: the routine stays small
  translate:
          room_package size, 49 - is_load, t_fail_mem   ; a load needs read (48), a store write (49)
          jmp     inside
  \}
}

t_fusable t_memop, t_ld,  8, 1, 1
t_fusable t_memop, t_st,  8, 1, 0
t_fusable t_memop, t_ldb, 1, 0, 1
t_fusable t_memop, t_stb, 1, 0, 0

; rd = the word at ra + rb * 8
macro t_ldx_r name, kind, unused {
  local translate, inside
  align 16
  name:
          movzx   ecx, byte [rdx + 10]
          mov     rax, [r14 + rcx]
          shl     rax, 3
          movzx   ecx, byte [rdx + 9]
          add     rax, [r14 + rcx]
          cmp     rax, [rbx + P_LIM8]     ; room 0, below its end: nothing to translate
          jae     translate
  inside:
          test    al, 7
          jnz     t_fail_align
          movzx   r8d, byte [rdx + 8]
          mov     rax, [r15 + rax]
          mov     [r14 + r8], rax
          t_end   kind
  postpone \{
  translate:
          room_package 8, 48, t_fail_mem
          jmp     inside
  \}
}
t_fusable t_ldx_r, t_ldx

; the word at ra + imm gets rd added, and rd keeps the sum
macro t_ldadd_r name, kind, unused {
  local translate, inside
  align 16
  name:
          movsxd  rax, dword [rdx + 12]
          movzx   ecx, byte [rdx + 9]
          add     rax, [r14 + rcx]
          cmp     rax, [rbx + P_LIM8]     ; room 0, below its end: nothing to translate
          jae     translate
  inside:
          test    al, 7
          jnz     t_fail_align
          movzx   r8d, byte [rdx + 8]
          mov     rcx, [r15 + rax]
          add     rcx, [r14 + r8]
          mov     [r15 + rax], rcx
          mov     [r14 + r8], rcx
          t_end   kind
  postpone \{                     ; it reads (48) and writes (49): the package once for each
  translate:
          mov     r8, rax
          room_package 8, 48, t_fail_mem
          mov     rax, r8
          room_package 8, 49, t_fail_mem
          jmp     inside
  \}
}
t_fusable t_ldadd_r, t_ldadd

        align 16
t_call:
        cmp     rdi, [rbx + P_RETCAP]
        jae     .more
.room:
        mov     [rsi + rdi*8], r12      ; the record after the call
        inc     rdi
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
        t_next

; a jcall whose jret leaves rd at zero: the record after it, with bit 63 and rd in the low 4 bits
        align 16
t_call0:
        cmp     rdi, [rbx + P_RETCAP]
        jae     .more
.room:
        movzx   ecx, byte [rdx + 8]
        shr     ecx, 3
        lea     rax, [r12 + rcx]
        bts     rax, 63
        mov     [rsi + rdi*8], rax
        inc     rdi
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
        t_next

        align 16
t_ret:
        test    rdi, rdi
        jz      t_fail_ret
        dec     rdi
        mov     r12, [rsi + rdi*8]
        test    r12, r12
        js      .zero                   ; it came from a jcall0
        t_next

        align 16
t_jhost:                                 ; the window to the host (anfitrion.inc)
        movzx   ecx, byte [rdx + 9]
        mov     rax, [r14 + rcx]
        call    host_window
        test    ecx, ecx
        jnz     t_ended
        movzx   ecx, byte [rdx + 8]
        mov     [r14 + rcx], rax
        t_next

        align 16
t_sys:
        movzx   ecx, byte [rdx + 8]
        mov     [rbx + P_SYSRD], rcx    ; rd * 8
        movzx   ecx, byte [rdx + 9]
        mov     rax, [r14 + rcx]
        mov     [rbx + P_SYSQ], rax     ; queue address
        call    kern_enter              ; the window is shared: one cabin at a time (remos.inc)
        mov     rax, [rbx + P_SYSQ]
        call    ventanilla
        mov     r15, [rbx + P_DATA]     ; a request may have built or moved a room
        cmp     rax, -1
        je      .fail
        cmp     rax, -2
        je      .asleep
        mov     rcx, [rbx + P_SYSRD]
        mov     [r14 + rcx], rax        ; requests attended
        cmp     byte [sched_dirty], 0
        je      @f
        mov     byte [sched_dirty], 0   ; someone was born or woke up: the scheduler decides again
        sub     [rbx + P_BUDGET0], rbp  ; end the turn here, counting only what really ran
        xor     ebp, ebp
        mov     qword [rbx + P_CUT], 1  ; cut by an event: it does not stretch to its end
@@:     call    kern_leave
        t_next
.fail:
        call    kern_leave
        jmp     t_fail_mem
.asleep:                                ; waiting for the parent's signature: this jsys runs again later
        sub     r12, R_SIZE
        sub     [rbx + P_BUDGET0], rbp
        xor     ebp, ebp
        call    kern_leave
        jmp     t_store

postpone {                              ; cold: after all the code, so t_call stays small
t_call.more:                            ; the return stack is full: one more page, or past the limit
        push    rdx
        call    ret_grow
        pop     rdx
        jc      t_fail_call
        jmp     t_call.room
t_call0.more:
        push    rdx
        call    ret_grow
        pop     rdx
        jc      t_fail_call
        jmp     t_call0.room
t_ret.zero:
        mov     ecx, r12d
        and     ecx, 15
        mov     qword [r14 + rcx*8], 0
        btr     r12, 63
        and     r12, -R_SIZE
        t_next
}
