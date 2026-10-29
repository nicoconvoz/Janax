; Janax v0 -> ARM64 cross-translator (escalon 0). Runs on Windows x86-64, writes a static Linux ARM64
; executable (runs on Android through adb, no root, no emulator).
; Usage: janax_arm64 <program.bin>      -> writes <program.bin>.arm64
; The executable prints j0 as 16 hex digits on jhalt and exits with the same codes as the interpreter.
;
; ARM64 has 31 registers, so all 16 Janax registers live in native ones: jK = xK. And most Janax
; instructions mean exactly the same on ARM64 ("a"): add, sub, mul, and, or, xor, and also the division
; (SDIV already gives 0 for x/0 and MIN for MIN/-1) and the shifts (LSLV/LSRV/ASRV use the low 6 bits).
; Each becomes one native instruction. Only memory, calls and the 16-bit insert need more.
;
; Native registers while running: x0..x15 = j0..j15, x16/x17 = scratch, x19 = data memory,
; x20 = return stack, x21 = return stack depth, x22 = DATA_SIZE - 8, x23 = DATA_SIZE - 1.
;
; File layout (one RWX segment at BASE): ELF header, program header, hex digits, output line, code
; (translated words, the outside exit, error exits, the halt routine, the entry prologue), then the
; return stack and data memory as zero-filled memory after the file.

format PE64 console
entry start

include 'win64a.inc'

MAX_PROGRAM = 1 shl 20          ; must match the interpreter
DATA_SIZE   = 1 shl 20          ; must match the interpreter
RET_DEPTH   = 4096              ; must match the interpreter
OP_COUNT    = 18h
MAX_INSNS   = 9                 ; most ARM64 instructions one Janax word becomes (jld/jst); checked per word
MAX_PATH_BYTES = 1024

BASE        = 400000h
DIGITS_OFF  = 120
LINE_OFF    = 136               ; 16 hex digits + newline
CODE_OFF    = 160
PROLOGUE_INSNS = 26

; fixup kinds
K_B_WORD  = 0                   ; B rel26 to a word (or the outside exit)
K_CB_WORD = 1                   ; CBZ/CBNZ rel19 to a word
K_B_STUB  = 2                   ; B rel26 to a stub
FIXUP_SIZE = 32                 ; position, kind, target, word
; stubs
S_FINISH  = 0
S_EXIT    = 3
S_HOST    = 9                   ; the window to the host (ventanita)

section '.data' data readable writeable

  program   dq 0
  nwords    dq 0
  outbuf       dq 0
  offs      dq 0
  fixups    dq 0
  longcb    dq 0
  relax     db 0
  stub_off  dq 16 dup 0
  prologue_off dq 0
  bss_off   dq 0
  file_size dq 0
  hfile     dq 0
  bytesread dd 0
  written   dd 0
  outpath   db MAX_PATH_BYTES + 8 dup 0

  ; the "a" instructions, op 02h..0Bh: base | rb << 16 | ra << 5 | rd
  rrr_base  dd 8B000000h        ; jadd -> ADD
            dd 0CB000000h       ; jsub -> SUB
            dd 9B007C00h        ; jmul -> MUL (MADD with XZR)
            dd 9AC00C00h        ; jdiv -> SDIV
            dd 9AC02000h        ; jshl -> LSLV
            dd 9AC02400h        ; jshr -> LSRV
            dd 9AC02800h        ; jsar -> ASRV
            dd 8A000000h        ; jand -> AND
            dd 0AA000000h       ; jor  -> ORR
            dd 0CA000000h       ; jxor -> EOR

  emit_table dq e_halt, e_ldi, e_rrr, e_rrr, e_rrr, e_rrr, e_rrr, e_rrr
             dq e_rrr, e_rrr, e_rrr, e_rrr, e_jmp, e_jz, e_jnz, e_shi
             dq e_ld, e_st, e_ldb, e_stb, e_call, e_ret, e_bad, e_host   ; 16h jsys exists only in Janax OS

  ; halt routine: x0 (= j0) in hex on stdout, then exit(0)
  finish:
    dd 0D2800000h or (((BASE + LINE_OFF) and 0FFFFh) shl 5) or 1    ; movz x1, line (low)
    dd 0F2A00000h or (((BASE + LINE_OFF) shr 16) shl 5) or 1        ; movk x1, line (high), lsl 16
    dd 0D2800000h or (((BASE + DIGITS_OFF) and 0FFFFh) shl 5) or 5  ; movz x5, digits (low)
    dd 0F2A00000h or (((BASE + DIGITS_OFF) shr 16) shl 5) or 5      ; movk x5, digits (high), lsl 16
    dd 0D2800202h               ; movz x2, #16
    dd 92400C04h                ; .loop: and x4, x0, #15
    dd 386468A4h                ; ldrb w4, [x5, x4]
    dd 0D1000442h               ; sub x2, x2, #1
    dd 38226824h                ; strb w4, [x1, x2]
    dd 0D344FC00h               ; lsr x0, x0, #4
    dd 0B5FFFF62h               ; cbnz x2, .loop
    dd 0D2800020h               ; movz x0, #1 (stdout)
    dd 0D2800222h               ; movz x2, #17
    dd 0D2800808h               ; movz x8, #64 (write)
    dd 0D4000001h               ; svc #0
    dd 0D2800000h               ; movz x0, #0
  exit_code:
    dd 0D2800BA8h               ; movz x8, #93 (exit)
    dd 0D4000001h               ; svc #0
  finish_end:

  ; The window to the host (Capitan): the helper of this port, Linux on the phone. It offers one request,
  ; "escribir" (number 1), through the write system call. In: x16 = the block's Janax address. Out: x17 = the
  ; answer. Keeps x0..x15 (the Janax registers) and x19..x23; uses x24..x29. Its branches to the error exits
  ; are patched when they are placed (host_patches).
  host_arm:
    dd 0D10062D1h               ; sub x17, x22, #24 (DATA_SIZE - 32)
    dd 0EB11021Fh               ; cmp x16, x17
  h_e5a:
    dd 54000008h                ; b.hi exit 5
    dd 0F2400A1Fh               ; tst x16, #7
  h_e6a:
    dd 54000001h                ; b.ne exit 6
    dd 8B100270h                ; add x16, x19, x16 (the block)
    dd 0F9400211h               ; ldr x17, [x16] (the request)
    dd 0B4000000h or ((((h_cat - $) / 4) and 7FFFFh) shl 5) or 17     ; cbz x17, catalog
    dd 0F100063Fh               ; cmp x17, #1 (escribir)
    dd 54000001h or ((((h_abs - $) / 4) and 7FFFFh) shl 5)            ; b.ne absent
    dd 0F9400619h               ; ldr x25, [x16, #8] (a)
    dd 0F9400A1Ah               ; ldr x26, [x16, #16] (b)
    dd 910022D1h                ; add x17, x22, #8 (DATA_SIZE)
    dd 0EB11033Fh               ; cmp x25, x17
  h_e5b:
    dd 54000008h                ; b.hi exit 5
    dd 0CB190231h               ; sub x17, x17, x25
    dd 0EB11035Fh               ; cmp x26, x17
  h_e5c:
    dd 54000008h                ; b.hi exit 5
    dd 0AA0003F8h, 0AA0103FBh, 0AA0203FCh, 0AA0803FDh  ; keep x0, x1, x2, x8 in x24, x27, x28, x29
    dd 0D2800020h               ; movz x0, #1 (stdout)
    dd 8B190261h                ; add x1, x19, x25
    dd 0AA1A03E2h               ; mov x2, x26
    dd 0D2800808h               ; movz x8, #64 (write)
    dd 0D4000001h               ; svc #0
    dd 0AA0003F1h               ; mov x17, x0 (bytes written)
    dd 0AA1803E0h, 0AA1B03E1h, 0AA1C03E2h, 0AA1D03E8h  ; back to x0, x1, x2, x8
    dd 0D65F03C0h               ; ret
  h_cat:
    dd 0F9400619h               ; ldr x25, [x16, #8] (where)
    dd 0F9400A1Ah               ; ldr x26, [x16, #16] (room)
    dd 0F2400B3Fh               ; tst x25, #7
  h_e6b:
    dd 54000001h                ; b.ne exit 6
    dd 0D2800031h               ; movz x17, #1 (one request offered)
    dd 0F100435Fh               ; cmp x26, #16
    dd 54000003h or ((((h_ret - $) / 4) and 7FFFFh) shl 5)            ; b.lo ret (no room: counted, not written)
    dd 0D10022D8h               ; sub x24, x22, #8 (DATA_SIZE - 16)
    dd 0EB18033Fh               ; cmp x25, x24
  h_e5d:
    dd 54000008h                ; b.hi exit 5
    dd 8B190279h                ; add x25, x19, x25
    dd 0D28E6CBAh, 0F2AE4C7Ah, 0F2CC4D3Ah, 0F2EE4D3Ah  ; x26 = "escribir"
    dd 0F900033Ah               ; str x26, [x25]
    dd 0D280003Ah               ; movz x26, #1 (its number)
    dd 0F900073Ah               ; str x26, [x25, #8]
  h_ret:
    dd 0D65F03C0h               ; ret
  h_abs:
    dd 92800011h                ; movn x17, #0 (-1: not offered)
    dd 0D65F03C0h               ; ret
  host_arm_end:
  host_patches dd h_e5a - host_arm, 5, h_e6a - host_arm, 6, h_e5b - host_arm, 5, h_e5c - host_arm, 5
               dd h_e6b - host_arm, 6, h_e5d - host_arm, 5
  HOST_PATCHES = ($ - host_patches) / 8

section '.text' code readable executable

; ---------------------------------------------------------------- emitter
; Writes at rdi. Keeps r8 (ra), r9 (imm16 sign-extended), r10 (rb), r11 (rd), r12 (word index),
; r13 (output base), rbx (fixup cursor). May clobber rax, rcx, rdx.

; ecx = kind, rdx = target (word index or stub id): records a fixup for the instruction at rdi
add_fixup:
        mov     rax, rdi
        sub     rax, r13
        mov     [rbx], rax
        mov     [rbx + 8], rcx
        mov     [rbx + 16], rdx
        mov     [rbx + 24], r12         ; the word it belongs to
        add     rbx, FIXUP_SIZE
        ret

; rdx = target word of this jump: index + 1 + imm, anything outside the program -> the outside exit
jump_target:
        lea     rdx, [r12 + 1]
        add     rdx, r9
        js      .outside
        cmp     rdx, [nwords]
        jbe     .done
.outside:
        mov     rdx, [nwords]
.done:  ret

; B to stub edx
b_stub:
        mov     ecx, K_B_STUB
        call    add_fixup
        mov     eax, 14000000h
        stosd
        ret

; ecx = destination register: mov xD, imm16 sign-extended (MOVZ, or MOVN for negatives)
mov_imm:
        mov     rax, r9
        test    rax, rax
        js      .negative
        and     eax, 0FFFFh
        shl     eax, 5
        or      eax, 0D2800000h
        jmp     .reg
.negative:
        not     eax
        and     eax, 0FFFFh
        shl     eax, 5
        or      eax, 92800000h
.reg:   or      eax, ecx
        stosd
        ret

e_halt:
        mov     edx, S_FINISH
        jmp     b_stub

e_ldi:
        mov     ecx, r11d
        jmp     mov_imm

e_rrr:                                  ; ecx = op on entry
        mov     eax, [rrr_base + rcx*4 - 2*4]
        mov     edx, r10d
        shl     edx, 16
        or      eax, edx
        mov     edx, r8d
        shl     edx, 5
        or      eax, edx
        or      eax, r11d
        stosd
        ret

e_jmp:
        call    jump_target
        mov     ecx, K_B_WORD
        call    add_fixup
        mov     eax, 14000000h          ; B
        stosd
        ret

e_jz:
        mov     eax, 0B4000000h         ; CBZ xD
        jmp     cb
e_jnz:
        mov     eax, 0B5000000h         ; CBNZ xD
cb:
        or      eax, r11d
        mov     rdx, [longcb]
        cmp     byte [rdx + r12], 0
        jne     .long
        push    rax
        call    jump_target
        mov     ecx, K_CB_WORD
        call    add_fixup
        pop     rax
        stosd
        ret
.long:                                  ; target beyond +-1 MiB: the opposite test skips a B (+-128 MiB)
        xor     eax, 01000000h          ; CBZ <-> CBNZ
        or      eax, 2 shl 5            ; +8: over the B
        stosd
        jmp     e_jmp

e_shi:
        mov     eax, r11d               ; lsl xD, xD, #16
        shl     eax, 5
        or      eax, r11d
        or      eax, 0D370BC00h
        stosd
        movzx   eax, r9w                ; movk xD, #imm16
        shl     eax, 5
        or      eax, r11d
        or      eax, 0F2800000h
        stosd
        ret

; x16 = ra + imm16, then the bounds check against the limit register (x22 for 8 bytes, x23 for 1)
; eax on entry = the CMP instruction to use
address_checked:
        push    rax
        mov     ecx, 17                 ; mov x17, imm
        call    mov_imm
        mov     eax, r8d                ; add x16, xA, x17
        shl     eax, 5
        or      eax, 8B110010h
        stosd
        pop     rax
        stosd                           ; cmp x16, limit
        mov     eax, 54000049h          ; b.ls +8
        stosd
        mov     edx, 5                  ; b exit 5 (out of range)
        call    b_stub
        ret

aligned_check:
        mov     eax, 0F2400A1Fh         ; tst x16, #7
        stosd
        mov     eax, 54000040h          ; b.eq +8
        stosd
        mov     edx, 6                  ; b exit 6 (misaligned)
        jmp     b_stub

macro e_memop name, cmp_insn, align, access {
  name:
          mov     eax, cmp_insn
          call    address_checked
    if align
          call    aligned_check
    end if
          mov     eax, access
          or      eax, r11d
          stosd
          ret
}

e_memop e_ld,  0EB16021Fh, 1, 0F8706A60h        ; ldr  xD, [x19, x16]
e_memop e_st,  0EB16021Fh, 1, 0F8306A60h        ; str  xD, [x19, x16]
e_memop e_ldb, 0EB17021Fh, 0, 38706A60h         ; ldrb wD, [x19, x16]
e_memop e_stb, 0EB17021Fh, 0, 38306A60h         ; strb wD, [x19, x16]

e_call:
        mov     eax, 0F14006BFh         ; cmp x21, #4096
        stosd
        mov     eax, 54000043h          ; b.lo +8
        stosd
        mov     edx, 7                  ; b exit 7 (too many nested calls)
        call    b_stub
        mov     eax, 10000090h          ; adr x16, +16: the instruction after the B below
        stosd
        mov     eax, 0F8357A90h         ; str x16, [x20, x21, lsl #3]
        stosd
        mov     eax, 910006B5h          ; add x21, x21, #1
        stosd
        jmp     e_jmp

e_host:                                 ; mov x16, xA / bl host / mov xD, x17
        mov     eax, r8d
        shl     eax, 16
        or      eax, 0AA0003F0h
        stosd
        mov     ecx, K_B_STUB
        mov     edx, S_HOST
        call    add_fixup
        mov     eax, 94000000h          ; bl (linked like a b to a stub)
        stosd
        mov     eax, 0AA1103E0h
        or      eax, r11d
        stosd
        ret

e_bad:
        mov     edx, 1                  ; b exit 1 (invalid opcode)
        jmp     b_stub

e_ret:
        mov     eax, 0B5000055h         ; cbnz x21, +8
        stosd
        mov     edx, 8                  ; b exit 8 (jret without jcall)
        call    b_stub
        mov     eax, 0D10006B5h         ; sub x21, x21, #1
        stosd
        mov     eax, 0F8757A90h         ; ldr x16, [x20, x21, lsl #3]
        stosd
        mov     eax, 0D61F0200h         ; br x16
        stosd
        ret

; movz/movk pair: ecx = register, rax = 32-bit value
mov32:
        push    rax
        and     eax, 0FFFFh
        shl     eax, 5
        or      eax, ecx
        or      eax, 0D2800000h
        stosd
        pop     rax
        shr     eax, 16
        shl     eax, 5
        or      eax, ecx
        or      eax, 0F2A00000h
        stosd
        ret

; exit stub with code edx: movz x0, #code ; b exit
exit_stub:
        mov     rax, rdi
        sub     rax, r13
        mov     [stub_off + rdx*8], rax
        mov     eax, edx
        shl     eax, 5
        or      eax, 0D2800000h
        stosd
        mov     edx, S_EXIT
        jmp     b_stub

; ---------------------------------------------------------------- translator

start:
        sub     rsp, 8

        invoke  GetCommandLineA
        mov     rsi, rax
        cmp     byte [rsi], '"'
        jne     .unquoted_start
        inc     rsi
        jmp     .quoted
.quoted_lap:
        inc     rsi
        cmp     al, '"'
        je      .spaces
.quoted:                                ; while the closing quote has not come
        mov     al, [rsi]
        test    al, al
        jnz     .quoted_lap
        jmp     fail_args
.unquoted_start:
        jmp     .unquoted
.unquoted_lap:
        cmp     al, ' '
        je      .spaces
        inc     rsi
.unquoted:                              ; while the name goes on
        mov     al, [rsi]
        test    al, al
        jnz     .unquoted_lap
        jmp     fail_args
        jmp     .spaces
.spaces_lap:
        inc     rsi
.spaces:
        cmp     byte [rsi], ' '
        je      .spaces_lap
.path:
        cmp     byte [rsi], 0
        je      fail_args

        ; output path = program path + ".arm64"
        xor     ecx, ecx
        jmp     .copy
.copy_lap:
        cmp     ecx, MAX_PATH_BYTES
        jae     fail_args
        mov     [outpath + rcx], al
        inc     ecx
.copy:
        mov     al, [rsi + rcx]
        test    al, al
        jnz     .copy_lap
.copied:
        mov     dword [outpath + rcx], '.arm'
        mov     word [outpath + rcx + 4], '64'

        invoke  CreateFileA, rsi, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      fail_file
        mov     [hfile], rax
        invoke  VirtualAlloc, 0, MAX_PROGRAM, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [program], rax
        invoke  ReadFile, [hfile], [program], MAX_PROGRAM, bytesread, 0
        test    eax, eax
        jz      fail_file
        invoke  CloseHandle, [hfile]
        mov     eax, [bytesread]
        shr     eax, 2
        mov     [nwords], rax

        ; buffers: the file, word offsets, fixups (at most 3 per word: memory ops reach 2 stub exits)
        mov     rdx, [nwords]
        imul    rdx, MAX_INSNS * 4
        add     rdx, CODE_OFF + 4096
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [outbuf], rax
        mov     rdx, [nwords]
        lea     rdx, [rdx*8 + 8]
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [offs], rax
        mov     rdx, [nwords]
        imul    rdx, 3 * FIXUP_SIZE
        add     rdx, FIXUP_SIZE * 16
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [fixups], rax
        mov     rdx, [nwords]           ; one flag per word: its CBZ/CBNZ needs the long form
        inc     rdx
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [longcb], rax

        ; --- translate, one word after the other; again while some jump had to grow ---
        mov     byte [relax], 1         ; the first pass always runs
        jmp     .translate
.translate_lap:
        mov     byte [relax], 0
        mov     r13, [outbuf]
        lea     rdi, [r13 + CODE_OFF]
        mov     rbx, [fixups]
        xor     r12, r12
        jmp     .word
.word_lap:
        mov     r14, rdi                ; this word's code starts here
        mov     rax, rdi
        sub     rax, r13
        mov     rdx, [offs]
        mov     [rdx + r12*8], rax
        mov     rax, [program]
        mov     eax, [rax + r12*4]
        movzx   ecx, al
        mov     r11d, eax
        shr     r11d, 8
        and     r11d, 15                ; rd
        mov     r8d, eax
        shr     r8d, 12
        and     r8d, 15                 ; ra
        mov     r9d, eax
        shr     r9d, 16
        mov     r10d, r9d
        and     r10d, 15                ; rb
        movsx   r9, r9w                 ; imm16 sign-extended
        cmp     ecx, OP_COUNT
        jae     .bad
        call    qword [emit_table + rcx*8]
        jmp     .emitted
.bad:
        mov     edx, 1                  ; b exit 1 (invalid opcode)
        call    b_stub
.emitted:
        mov     rax, rdi
        sub     rax, r14
        cmp     rax, MAX_INSNS * 4
        ja      fail_block
        inc     r12
.word:
        cmp     r12, [nwords]
        jb      .word_lap
.last:
        ; outside exit (word nwords), error exits, halt routine
        mov     rax, rdi
        sub     rax, r13
        mov     rdx, [offs]
        mov     rcx, [nwords]
        mov     [rdx + rcx*8], rax
        mov     edx, 2
        call    exit_stub
        irp code, 1, 5, 6, 7, 8 {
          mov     edx, code
          call    exit_stub
        }
        mov     rax, rdi
        sub     rax, r13
        mov     [stub_off + S_FINISH*8], rax
        add     rax, exit_code - finish
        mov     [stub_off + S_EXIT*8], rax
        lea     rsi, [finish]
        mov     ecx, finish_end - finish
        rep     movsb
        mov     rax, rdi                ; the helper of the window, its exits patched
        sub     rax, r13
        mov     [stub_off + S_HOST*8], rax
        mov     r8, rax
        lea     rsi, [host_arm]
        mov     ecx, host_arm_end - host_arm
        rep     movsb
        xor     ecx, ecx
        jmp     .patch
.patch_lap:
        mov     eax, [host_patches + rcx*8]       ; offset in the helper
        mov     edx, [host_patches + rcx*8 + 4]   ; exit code
        lea     r9, [r8 + rax]                    ; the branch's place in the output
        mov     rax, [stub_off + rdx*8]
        sub     rax, r9
        sar     rax, 2
        and     eax, 7FFFFh
        shl     eax, 5
        or      [r13 + r9], eax
        inc     ecx
.patch:                                 ; while branches are left to patch
        cmp     ecx, HOST_PATCHES
        jb      .patch_lap

        ; --- entry prologue; memory for the return stack and data goes right after the file ---
        mov     rax, rdi
        sub     rax, r13
        mov     [prologue_off], rax
        add     rax, PROLOGUE_INSNS * 4
        mov     [file_size], rax
        add     rax, 15
        and     rax, -16
        mov     [bss_off], rax
        xor     ecx, ecx
        jmp     .zero
.zero_lap:
        mov     eax, 0D2800000h         ; movz xK, #0 for j0..j14
        or      eax, ecx
        stosd
        inc     ecx
.zero:                                  ; while registers j0..j14 are left
        cmp     ecx, 15
        jb      .zero_lap
        mov     eax, 0D2A0020Fh         ; movz x15, #DATA_SIZE >> 16, lsl 16 (j15 = top of data memory)
        stosd
        mov     rax, [bss_off]
        add     rax, BASE + RET_DEPTH * 8
        mov     ecx, 19
        call    mov32                   ; x19 = data memory
        mov     rax, [bss_off]
        add     rax, BASE
        mov     ecx, 20
        call    mov32                   ; x20 = return stack
        mov     eax, 0D2800015h         ; movz x21, #0
        stosd
        mov     eax, DATA_SIZE - 8
        mov     ecx, 22
        call    mov32
        mov     eax, DATA_SIZE - 1
        mov     ecx, 23
        call    mov32
        mov     eax, 14000000h          ; b to the first word
        mov     rdx, rdi
        sub     rdx, r13
        neg     rdx
        add     rdx, CODE_OFF
        sar     rdx, 2
        and     edx, 3FFFFFFh
        or      eax, edx
        stosd
        mov     rax, rdi
        sub     rax, r13
        cmp     rax, [file_size]
        jne     fail_block              ; PROLOGUE_INSNS must match what was emitted

        ; --- link every fixup ---
        mov     rsi, [fixups]
        jmp     .link
.link_lap:
        mov     r8, [rsi]               ; position
        mov     rcx, [rsi + 8]          ; kind
        mov     rdx, [rsi + 16]         ; target
        cmp     ecx, K_B_STUB
        je      .to_stub
        mov     rax, [offs]
        mov     rax, [rax + rdx*8]
        jmp     .have_target
.to_stub:
        mov     rax, [stub_off + rdx*8]
.have_target:
        sub     rax, r8                 ; byte offset from the instruction
        sar     rax, 2
        cmp     ecx, K_CB_WORD
        je      .rel19
        and     eax, 3FFFFFFh
        or      [r13 + r8], eax
        jmp     .next_fixup
.rel19:
        cmp     rax, -(1 shl 18)
        jl      .too_far
        cmp     rax, 1 shl 18
        jge     .too_far
        and     eax, 7FFFFh
        shl     eax, 5
        or      [r13 + r8], eax
        jmp     .next_fixup
.too_far:                               ; mark it and translate again; lengths only grow, so it ends
        mov     rax, [rsi + 24]
        mov     rdx, [longcb]
        mov     byte [rdx + rax], 1
        mov     byte [relax], 1
.next_fixup:
        add     rsi, FIXUP_SIZE
.link:
        cmp     rsi, rbx
        jb      .link_lap
.linked:
.translate:                             ; while some jump had to grow
        cmp     byte [relax], 0
        jne     .translate_lap
.relaxed:

        ; --- ELF header, program header, digits and output line ---
        mov     rdi, r13
        mov     eax, 464C457Fh          ; 7F 'E' 'L' 'F'
        stosd
        mov     eax, 00010102h          ; 64-bit, little-endian, version 1, System V
        stosd
        xor     eax, eax
        stosq                           ; padding (to 16 bytes)
        mov     eax, 00B70002h          ; ET_EXEC, EM_AARCH64
        stosd
        mov     eax, 1
        stosd
        mov     rax, [prologue_off]
        add     rax, BASE
        stosq                           ; entry
        mov     eax, 64
        stosq                           ; program header offset
        xor     eax, eax
        stosq                           ; no section headers
        stosd                           ; flags
        mov     eax, 00380040h          ; ehsize 64, phentsize 56
        stosd
        mov     eax, 1                  ; one program header, shentsize 0
        stosd
        xor     eax, eax
        stosd                           ; shnum 0, shstrndx 0 (ELF header ends at 64)
        mov     eax, 1                  ; PT_LOAD
        stosd
        mov     eax, 7                  ; R + W + X
        stosd
        xor     eax, eax
        stosq                           ; offset 0
        mov     eax, BASE
        stosq                           ; vaddr
        stosq                           ; paddr
        mov     rax, [file_size]
        stosq                           ; filesz
        mov     rax, [bss_off]
        add     rax, RET_DEPTH * 8 + DATA_SIZE
        stosq                           ; memsz
        mov     eax, 1000h
        stosq                           ; align
        mov     rax, '01234567'
        stosq
        mov     rax, '89ABCDEF'
        stosq
        mov     rax, '00000000'
        stosq
        stosq
        mov     al, 10
        stosb

        ; --- write the executable ---
        invoke  CreateFileA, outpath, GENERIC_WRITE, 0, 0, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      fail_file
        mov     [hfile], rax
        invoke  WriteFile, [hfile], [outbuf], [file_size], written, 0
        invoke  CloseHandle, [hfile]
        invoke  ExitProcess, 0

fail_file:
        invoke  ExitProcess, 3
fail_args:
        invoke  ExitProcess, 4
fail_block:
        invoke  ExitProcess, 9          ; translator bug: a word outgrew MAX_INSNS or the prologue size

section '.idata' import data readable writeable

  library kernel32, 'KERNEL32.DLL'

  import kernel32,\
         GetCommandLineA, 'GetCommandLineA',\
         CreateFileA, 'CreateFileA',\
         ReadFile, 'ReadFile',\
         CloseHandle, 'CloseHandle',\
         VirtualAlloc, 'VirtualAlloc',\
         WriteFile, 'WriteFile',\
         ExitProcess, 'ExitProcess'
