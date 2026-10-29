; Janax OS routine engine. Capitan: "an interpreter at run time that turns the original into native
; without compiling".
;
; Each program is decoded once into a table of 16-byte records, one per word, plus a final record:
;   +0  qword  address of the native routine for that instruction (compiled inside the kernel)
;   +8  byte   rd * 8      +9 byte ra * 8      +10 byte rb * 8
;   +12 dword  operand: the immediate already extended (zero-extended for jshi), or, for jumps and
;              jcall, the target as a byte offset into the table
; Running is jumping from routine to routine: nothing is decoded again and no machine code is generated
; (no new executable memory). A target outside the program points at the final record, which ends the
; process with code 2 like the interpreter's fetch check; an unknown opcode gets the routine that ends
; it with code 1. The final record gives back its instruction: the interpreter fails before counting.
;
; Registers while running: r12 = next record, r13 = table, r14 = Janax registers, r15 = data memory,
; rsi = return stack (record addresses), rdi = depth, rbp = budget left, rbx = process, rdx = record
; being run. The interpreter stays as the reference (JANAX_MOTOR=interprete); the tests compare both.

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
.threaded:
        mov     rax, rdi
.done:
        mov     rsp, r13
        pop     r13 r12 rdi rsi rbx
        ret

; Runs the process in rbx for up to rax instructions with its table. Same contract as run_process.
run_routines:
        mov     [budget0], rax
        mov     rbp, rax
        mov     r13, [rbx + P_TABLE]
        test    r13, r13
        jnz     @f
        mov     rcx, [rbx + P_NWORDS]
        mov     rdx, [rbx + P_PROG]
        call    decode_program          ; once per process: from here on it lives in its routines
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_TABLE], rax
        mov     r13, rax
@@:     mov     r14, rbx
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

t_suspend:
        xor     ebp, ebp                ; the budget is spent (or the turn was cut)
t_store:
        sub     r12, r13
        shr     r12, 4
        mov     [rbx + P_PC], r12
        mov     [rbx + P_DEPTH], rdi
        mov     rax, [budget0]
        sub     rax, rbp
        ret

t_halt:
        xor     ecx, ecx
        jmp     t_ended
t_fail_op:
        mov     ecx, 1                  ; counted, like the interpreter
        jmp     t_ended
t_fail_pc:
        inc     rbp                     ; the interpreter fails before counting the fetch
        mov     ecx, 2
        jmp     t_ended
t_fail_mem:
        mov     ecx, 5
        jmp     t_ended
t_fail_align:
        mov     ecx, 6
        jmp     t_ended
t_fail_call:
        mov     ecx, 7
        jmp     t_ended
t_fail_ret:
        mov     ecx, 8
t_ended:
        mov     [rbx + P_CODE], rcx
        mov     qword [rbx + P_DONE], 1
        jmp     t_store

t_ldi:
        movsxd  rax, dword [rdx + 12]
        movzx   ecx, byte [rdx + 8]
        mov     [r14 + rcx], rax
        t_next

macro t_binop name, insn {
  name:
          movzx   ecx, byte [rdx + 9]
          mov     rax, [r14 + rcx]
          movzx   ecx, byte [rdx + 10]
          insn    rax, [r14 + rcx]
          movzx   ecx, byte [rdx + 8]
          mov     [r14 + rcx], rax
          t_next
}

t_binop t_add, add
t_binop t_sub, sub
t_binop t_mul, imul
t_binop t_and, and
t_binop t_or,  or
t_binop t_xor, xor

t_div:
        movzx   ecx, byte [rdx + 9]
        mov     rax, [r14 + rcx]
        movzx   ecx, byte [rdx + 10]
        mov     rcx, [r14 + rcx]
        movzx   r8d, byte [rdx + 8]
        test    rcx, rcx
        jz      .by_zero
        cmp     rcx, -1
        je      .by_minus_one
        cqo
        idiv    rcx
        jmp     .store
.by_zero:
        xor     eax, eax                ; Janax: x / 0 = 0
        jmp     .store
.by_minus_one:
        neg     rax                     ; MIN / -1 = MIN
.store:
        mov     [r14 + r8], rax
        t_next

macro t_shiftop name, insn {
  name:
          movzx   r8d, byte [rdx + 9]
          mov     rax, [r14 + r8]
          movzx   r8d, byte [rdx + 10]
          mov     rcx, [r14 + r8]
          and     ecx, 63
          insn    rax, cl
          movzx   r8d, byte [rdx + 8]
          mov     [r14 + r8], rax
          t_next
}

t_shiftop t_shl, shl
t_shiftop t_shr, shr
t_shiftop t_sar, sar

t_jmp:
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
        t_next

t_jz:
        movzx   ecx, byte [rdx + 8]
        cmp     qword [r14 + rcx], 0
        jne     @f
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
@@:     t_next

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

t_shi:
        movzx   ecx, byte [rdx + 8]
        mov     rax, [r14 + rcx]
        shl     rax, 16
        mov     r8d, [rdx + 12]
        or      rax, r8
        mov     [r14 + rcx], rax
        t_next

macro t_memop name, size, align_check, is_load, body {
  name:
          movsxd  rax, dword [rdx + 12]
          movzx   ecx, byte [rdx + 9]
          add     rax, [r14 + rcx]
          mov     rcx, [rbx + P_SIZE]     ; this cabin's size: it grows and shrinks
          sub     rcx, size
          cmp     rax, rcx
          ja      t_fail_mem
    if align_check
          test    al, 7
          jnz     t_fail_align
    end if
          movzx   r8d, byte [rdx + 8]
    if ~ is_load
          mov     rcx, [r14 + r8]
    end if
          body
    if is_load
          mov     [r14 + r8], rax
    end if
          t_next
}

t_memop t_ld,  8, 1, 1, <mov rax, [r15 + rax]>
t_memop t_st,  8, 1, 0, <mov [r15 + rax], rcx>
t_memop t_ldb, 1, 0, 1, <movzx eax, byte [r15 + rax]>
t_memop t_stb, 1, 0, 0, <mov [r15 + rax], cl>

t_call:
        cmp     rdi, RET_DEPTH
        jae     t_fail_call
        mov     [rsi + rdi*8], r12      ; the record after the call
        inc     rdi
        mov     eax, [rdx + 12]
        lea     r12, [r13 + rax]
        t_next

t_ret:
        test    rdi, rdi
        jz      t_fail_ret
        dec     rdi
        mov     r12, [rsi + rdi*8]
        t_next

t_sys:
        movzx   ecx, byte [rdx + 8]
        mov     [sys_rd], rcx           ; rd * 8
        movzx   ecx, byte [rdx + 9]
        mov     rax, [r14 + rcx]        ; queue address
        call    ventanilla
        mov     r15, [rbx + P_DATA]     ; the cabin may have moved
        cmp     rax, -1
        je      t_fail_mem
        cmp     rax, -2
        je      .asleep
        mov     rcx, [sys_rd]
        mov     [r14 + rcx], rax        ; requests attended
        cmp     byte [sched_dirty], 0
        je      @f
        mov     byte [sched_dirty], 0   ; someone was born or woke up: the scheduler decides again
        sub     [budget0], rbp          ; end the turn here, counting only what really ran
        xor     ebp, ebp
@@:     t_next
.asleep:                                ; waiting for the parent's signature: this jsys runs again later
        sub     r12, R_SIZE
        sub     [budget0], rbp
        xor     ebp, ebp
        jmp     t_store
