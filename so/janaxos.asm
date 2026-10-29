; Janax OS, escalon S1: symbiosis mode on Windows x86-64.
; Usage: janaxos <program.bin>...
;
; Boot: recognises whether it was started by another operating system (symbiosis) or by the firmware
; (zero mode). Windows starts every program with rcx = its PEB, the same pointer it keeps at gs:[60h];
; UEFI starts an image with rcx = image handle and rdx = system table. Zero mode is not built yet.
;
; Kernel: every program becomes a process in its own cabin (registers, data memory, return stack). A
; process that breaks only ends itself; the others go on.
;
; Scheduler (Capitan: "nothing short left waiting, little of the long"): least attained service. The
; process that has received the least time runs first, so short jobs finish early without knowing
; anybody's length in advance. Time is counted in executed instructions.
;
; Turn length (Capitan: "the priority gives the real percentage", nothing fixed): a switch costs c
; instructions. The running process (service s) goes on while the advantage of the next least served
; one (D less service) does not pay for the switch: (t - D) * t >= c * (s + t), so
;   t = ((D + c) + sqrt((D + c)^2 + 4 c s)) / 2,   and never less than D + 1 (it must pass the other).
; A newcomer with little service gets the processor almost at once; two equal processes get turns that
; grow like sqrt(c s), so the waste shrinks by itself. With c = 0 it is pure least attained service.
; c is measured at boot on this machine (the kernel learns its environment), or fixed by JANAX_CAMBIO.
;
; Output: "modo: simbiosis", "costo de cambio: <c> instrucciones (medido|fijado)", then one line per
; process as it ends:
;   P<n> codigo=<exit code> j0=<16 hex digits> t=<instructions executed by the whole system so far>
; Exit codes per process are the interpreter's (0 jhalt, 1 invalid opcode, 2 outside the program,
; 5 memory out of range, 6 misaligned, 7 too many nested calls, 8 jret without jcall).
; The kernel itself exits 0, or 3 (a program cannot be read) or 4 (no programs).

format PE64 console
entry start

include 'win64a.inc'

MAX_PROGRAM = 1 shl 20          ; must match the interpreter
DATA_SIZE   = 1 shl 20          ; must match the interpreter
RET_DEPTH   = 4096              ; must match the interpreter
OP_COUNT    = 17h
FOREVER     = 7FFFFFFFFFFFFFFFh

; process (cabin) layout
P_REGS   = 0                    ; 16 qwords
P_PC     = 128
P_NWORDS = 136
P_PROG   = 144
P_DATA   = 152
P_RET    = 160
P_DEPTH  = 168
P_SERVED = 176                  ; instructions executed so far (attained service)
P_DONE   = 184
P_CODE   = 192
P_SIZE   = 200                  ; bytes of data memory (the cabin grows and shrinks)
P_FILES  = 208                  ; table of host file handles (0 = free slot)
P_NFILES = 216                  ; slots in that table
P_GATES  = 224                  ; the process's porter for each door (3 nodes)
P_ID     = 248                  ; process number (P0, P1...)
P_PARENT = 256                  ; parent process, 0 = the kernel
P_WAITING = 264                 ; important requests waiting for the parent's signature
PROC_SIZE = 272

; porters: rights and tree nodes
R_SCREEN = 1
R_MEM    = 2
R_READ   = 4
R_WRITE  = 8
R_ALL    = 15
DOORS    = 3                    ; screen, memory, files
N_PARENT = 0                    ; -1 for the root
N_RIGHTS = 8
N_ALIVE  = 16
N_DOOR   = 24
N_PREFIX = 32                   ; label prefix: offset in the prefix pool
N_PLEN   = 40                   ; and its length (0 = any label)
NODE_SIZE = 48

section '.data' data readable writeable

  entry_rcx dq 0
  cmdline   dq 0
  procs     dq 0                ; list of pointers to the processes (it doubles; cabins never move)
  capprocs  dq 0
  nargs     dq 0
  mp_prog   dq 0
  mp_words  dq 0
  mp_parent dq 0
  mp_rights dq 0
  mp_pfx_ptr dq 0
  mp_pfx_len dq 0
  mp_new    dq 0
  nprocs    dq 0
  clock     dq 0                ; instructions executed by the whole system
  budget0   dq 0
  hfile     dq 0
  hout      dq 0
  bytesread dd 0
  written   dd 0
  hexdigits db '0123456789ABCDEF'
  mode_line db 'modo: simbiosis', 13, 10
  MODE_LEN = $ - mode_line
  line      db 96 dup 0

  ; the window
  KINDS     = 15                ; write, grow, shrink, open, read, write to file, close, cede, use, revoke,
                                ; consult, delete, rename, list, cede with label
  requests  dq 0
  hostcalls dq 0
  retunes   dq 0
  nscreens  dq 0
  tune      dq KINDS dup 0      ; the kind each screen is tuned to
  busy      db KINDS dup 0      ; screens that got requests this round
  present   db KINDS + 1 dup 0  ; kinds present this round (index = kind)
  sys_rd    dq 0
  queue_addr dq 0
  queue_end dq 0
  wtotal    dq 0
  wbuf      dq 0
  move_new  dq 0
  t_screens db 'ventanilla: pantallas=', 0
  t_retunes db ' resintonias=', 0
  t_host    db ' llamadas al anfitrion=', 0
  t_reqs    db ' pedidos=', 0
  serve_table dq serve_write, serve_grow, serve_shrink, serve_open, serve_fread, serve_fwrite, serve_close
              dq serve_cede, serve_use, serve_revoke, serve_consult, serve_delete, serve_rename, serve_list
              dq serve_cede_label
  ; door and right each kind needs (index = kind; door 0 = answers to the tree rules instead)
  ;              -  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
  kind_door  db 0, 1, 2, 2, 3, 3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 0
  kind_right db 0, R_SCREEN, R_MEM, R_MEM, R_READ + R_WRITE, R_READ, R_WRITE, 0, 0, 0, 0, 0, R_WRITE, R_WRITE, R_READ, 0
  assert $ - kind_right = KINDS + 1
  ; porters
  nodes     dq 0
  nnodes    dq 0
  capnodes  dq 0
  denied    dq 0
  launch_rights dq 0
  launch_raw db HOST_PATH dup 0
  launch_pfx db NORM_CAP dup 0
  launch_pfx_len dq 0
  nn_pptr   dq 0
  nn_plen   dq 0
  nn_poff   dq 0
  pfx_pool  dq 0
  pfx_used  dq 0
  pfx_cap   dq 0
  cede_rights dq 0
  nn_parent dq 0
  nn_rights dq 0
  nn_door   dq 0
  nn_new    dq 0
  t_nodes   db 'porteros: nodos=', 0
  t_denied  db ' negados=', 0

  ; files: the system's own folder; on the host each label is stored in hexadecimal
  dir_env   db 'JANAX_ARCHIVOS', 0
  dir_default db 'janax_archivos', 0
  HOST_PATH = 260               ; MAX_PATH of the ANSI file functions of Windows
  dir_path  db HOST_PATH dup 0
  dir_len   dq 0
  host_path db HOST_PATH + 8 dup 0
  host_path_2 db HOST_PATH + 8 dup 0
  WIDE_CAP  = 1024              ; UTF-16 units for a label on its way through the host normalization
  NORM_CAP  = 4096              ; bytes of a normalized label (a UTF-16 unit is at most 3 UTF-8 bytes)
  NORMALIZATION_C = 1
  CP_UTF8   = 65001
  wide_in   dw WIDE_CAP dup 0
  wide_out  dw WIDE_CAP dup 0
  wide_len  dq 0
  norm_len  dq 0
  norm_label db NORM_CAP dup 0
  FIND_NAME = 44                ; cFileName inside WIN32_FIND_DATAA
  find_data db 320 dup 0
  list_pos  dq 0
  list_end  dq 0
  list_count dq 0
  hex_lower db '0123456789abcdef'
  fio_bytes dd 0
  lab_ptr   dq 0
  lab_len   dq 0
  slot_free dq 0
  slot_cap  dq 0
  slot_new  dq 0

  swcost    dq 0.0              ; cost of a switch, in instructions (double)
  quiet     db 0                ; 1 while calibrating: no report lines
  switches  dq 0                ; process switches made by the scheduler
  env_name  db 'JANAX_CAMBIO', 0
  calib_env db 'JANAX_CALIBRACION', 0
  calib_text db 'calibracion (c de cada par, ordenados):', 0
  env_value db 32 dup 0
  four      dq 4.0
  half      dq 0.5
  hundred   dq 100.0
  cost_text db 'costo de cambio: '
  COST_TEXT_LEN = $ - cost_text
  measured_text db ' instrucciones (medido)', 13, 10
  MEASURED_LEN = $ - measured_text
  recalled_text db ' instrucciones (recordado)', 13, 10
  RECALLED_LEN = $ - recalled_text
  calib_name db '\calibracion', 0
  COST_KEY_LEN = 4 + 48         ; kernel fingerprint + processor name
  COST_REC_LEN = COST_KEY_LEN + 8
  cost_rec  db COST_REC_LEN dup 0
  cost_read db COST_REC_LEN dup 0
  fixed_text db ' instrucciones (fijado)', 13, 10
  FIXED_LEN = $ - fixed_text

  ; calibration program: 2 * CALIB_LOOPS instructions of a tight loop (jsub / jjnz)
  CALIB_LOOPS = 200000h         ; criterion: ~4 M instructions per run, so a clock speed change weighs little
  calib_prog dd 01h or (1 shl 8) or ((CALIB_LOOPS shr 16) shl 16)          ; jldi j1, high
             dd 0Fh or (1 shl 8) or ((CALIB_LOOPS and 0FFFFh) shl 16)      ; jshi j1, low
             dd 01h or (2 shl 8) or (1 shl 16)                             ; jldi j2, 1
             dd 03h or (1 shl 8) or (1 shl 12) or (2 shl 16)               ; vuelta: jsub j1, j1, j2
             dd 0Eh or (1 shl 8) or ((-2 and 0FFFFh) shl 16)               ; jjnz j1, vuelta
             dd 00h                                                        ; jhalt
  CALIB_WORDS = ($ - calib_prog) / 4
  calib_procs db 2 * PROC_SIZE dup 0
  calib_list  dq calib_procs, calib_procs + PROC_SIZE
  real_procs  dq 0
  real_nprocs dq 0
  tsc_start   dq 0
  cycles_one  dq 0
  cycles_two  dq 0
  instr_one   dq 0
  instr_two   dq 0
  switch_two  dq 0
  rounds      dq 0
  CALIB_PAIRS = 9               ; criterion, not a measurement: an odd count for a median
  pair_c      dq CALIB_PAIRS dup 0
  thread      dq 0
  old_affinity dq 0
  old_priority dq 0
  THREAD_PRIORITY_TIME_CRITICAL = 15

  optable   dq op_halt, op_ldi, op_add, op_sub, op_mul, op_div, op_shl, op_shr
            dq op_sar, op_and, op_or, op_xor, op_jmp, op_jz, op_jnz, op_shi
            dq op_ld, op_st, op_ldb, op_stb, op_call, op_ret, op_sys

section '.text' code readable executable

code_begin:                             ; code_begin..code_end feeds the kernel's fingerprint

start:
        mov     [entry_rcx], rcx
        sub     rsp, 8                  ; align the stack to 16 for fastcall

        ; --- boot: who started us? ---
        mov     rax, [gs:60h]           ; the PEB, if Windows is under us
        cmp     rax, [entry_rcx]
        jne     zero_mode

        invoke  GetStdHandle, STD_OUTPUT_HANDLE
        mov     [hout], rax
        invoke  WriteFile, [hout], mode_line, MODE_LEN, written, 0

        ; --- the system's own folder for files ---
        invoke  GetEnvironmentVariableA, dir_env, dir_path, HOST_PATH - 1
        test    eax, eax
        jnz     .dir_named
        lea     rsi, [dir_default]
        lea     rdi, [dir_path]
        call    put_text
        mov     byte [rdi], 0
        lea     rax, [dir_path]
        sub     rdi, rax
        mov     rax, rdi
.dir_named:
        mov     [dir_len], rax
        invoke  CreateDirectoryA, dir_path, 0   ; it may already exist: that is fine

        ; --- cost of a switch: fixed by JANAX_CAMBIO, remembered from an earlier boot, or measured ---
        invoke  GetEnvironmentVariableA, env_name, env_value, 31
        test    eax, eax
        jz      .measure
        xor     eax, eax                ; decimal digits
        lea     rsi, [env_value]
.digit:
        movzx   ecx, byte [rsi]
        sub     ecx, '0'
        cmp     ecx, 9
        ja      .parsed
        imul    rax, 10
        add     rax, rcx
        inc     rsi
        jmp     .digit
.parsed:
        cvtsi2sd xmm0, rax
        movsd   [swcost], xmm0
        call    print_cost
        invoke  WriteFile, [hout], fixed_text, FIXED_LEN, written, 0
        jmp     .cost_known
.measure:
        call    cost_key
        call    recall_cost
        test    eax, eax
        jz      .calibrate
        call    print_cost
        invoke  WriteFile, [hout], recalled_text, RECALLED_LEN, written, 0
        jmp     .cost_known
.calibrate:
        call    calibrate
        call    save_cost
        call    print_cost
        invoke  WriteFile, [hout], measured_text, MEASURED_LEN, written, 0
.cost_known:

        ; --- porters: the root and one porter per door (nodes 0..3); processes hang from the doors ---
        mov     rcx, -1
        mov     edx, R_ALL
        xor     r8d, r8d
        call    new_node                ; 0: root
        xor     ecx, ecx
        mov     edx, R_SCREEN
        mov     r8d, 1
        call    new_node                ; 1: screen
        xor     ecx, ecx
        mov     edx, R_MEM
        mov     r8d, 2
        call    new_node                ; 2: memory
        xor     ecx, ecx
        mov     edx, R_READ + R_WRITE
        mov     r8d, 3
        call    new_node                ; 3: files

        ; --- arguments: a private copy of the command line, split in place ---
        invoke  GetCommandLineA
        mov     rsi, rax
        invoke  lstrlenA, rsi
        lea     rdx, [rax + 1]
        push    rsi
        sub     rsp, 8
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        add     rsp, 8
        pop     rsi
        test    rax, rax
        jz      fail_file
        mov     [cmdline], rax
        mov     rdi, rax
.copy:
        lodsb
        stosb
        test    al, al
        jnz     .copy

        ; skip the program name (maybe quoted)
        mov     rsi, [cmdline]
        cmp     byte [rsi], '"'
        jne     .unquoted
        inc     rsi
.quoted:
        lodsb
        test    al, al
        jz      no_programs
        cmp     al, '"'
        jne     .quoted
        jmp     .count
.unquoted:
        mov     al, [rsi]
        test    al, al
        jz      no_programs
        cmp     al, ' '
        je      .count
        inc     rsi
        jmp     .unquoted

        ; count the programs and cut each path with a zero
.count:
        mov     r12, rsi                ; first argument area
        xor     ebx, ebx
.skip_spaces:
        cmp     byte [rsi], ' '
        jne     .token
        mov     byte [rsi], 0
        inc     rsi
        jmp     .skip_spaces
.token:
        cmp     byte [rsi], 0
        je      .counted
        inc     rbx
.in_token:
        mov     al, [rsi]
        test    al, al
        jz      .counted
        cmp     al, ' '
        je      .skip_spaces
        inc     rsi
        jmp     .in_token
.counted:
        test    rbx, rbx
        jz      no_programs
        mov     [nargs], rbx

        ; --- one cabin per program, all of them children of the kernel ---
        mov     rsi, r12
        xor     r13, r13                ; argument number
.load:
        cmp     r13, [nargs]
        jae     .loaded
.find:
        cmp     byte [rsi], 0
        jne     .path
        inc     rsi
        jmp     .find
.path:
        mov     r14, rsi                ; this path
        mov     qword [launch_rights], R_ALL   ; no "@": every permission
        mov     qword [launch_pfx_len], 0      ; and no label prefix
.path_end:
        mov     al, [rsi]
        test    al, al
        je      .open
        cmp     al, '@'
        je      .permissions
        inc     rsi
        jmp     .path_end
.permissions:                           ; program.bin@pmlg: p screen, m memory, l read files, g write files
        mov     byte [rsi], 0
        inc     rsi
        mov     qword [launch_rights], 0
.letter:
        mov     al, [rsi]
        test    al, al
        je      .open
        inc     rsi
        mov     edx, R_SCREEN
        cmp     al, 'p'
        je      .grant
        mov     edx, R_MEM
        cmp     al, 'm'
        je      .grant
        mov     edx, R_READ
        cmp     al, 'l'
        je      .grant
        mov     edx, R_WRITE
        cmp     al, 'g'
        je      .grant
        cmp     al, ':'
        je      .prefix
        jmp     .letter
.grant:
        or      [launch_rights], rdx
        jmp     .letter
.prefix:                                ; @...:hex = a label prefix for files (hex: the command line has no emojis)
        lea     rdi, [launch_raw]
        xor     ecx, ecx
.prefix_pair:
        movzx   eax, byte [rsi]
        test    eax, eax
        jz      .prefix_read
        call    hex_digit
        js      fail_args
        mov     edx, eax
        movzx   eax, byte [rsi + 1]
        call    hex_digit
        js      fail_args
        shl     edx, 4
        or      eax, edx
        stosb
        add     rsi, 2
        inc     ecx
        cmp     ecx, HOST_PATH
        jae     fail_args
        jmp     .prefix_pair
.prefix_read:
        test    ecx, ecx
        jz      fail_args
        push    rsi
        sub     rsp, 8
        lea     rsi, [launch_raw]
        call    normalize_bytes
        add     rsp, 8
        pop     rsi
        test    eax, eax
        jz      fail_args
        push    rsi
        lea     rsi, [norm_label]
        lea     rdi, [launch_pfx]
        mov     rcx, [norm_len]
        mov     [launch_pfx_len], rcx
        rep     movsb
        pop     rsi
.open:
        invoke  CreateFileA, r14, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      fail_file
        mov     [hfile], rax
        invoke  VirtualAlloc, 0, MAX_PROGRAM, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [mp_prog], rax
        invoke  ReadFile, [hfile], [mp_prog], MAX_PROGRAM, bytesread, 0
        test    eax, eax
        jz      fail_file
        invoke  CloseHandle, [hfile]
        mov     eax, [bytesread]
        shr     eax, 2
        mov     [mp_words], rax
        mov     qword [mp_parent], 0
        mov     rax, [launch_rights]
        mov     [mp_rights], rax
        lea     rax, [launch_pfx]
        mov     [mp_pfx_ptr], rax
        mov     rax, [launch_pfx_len]
        mov     [mp_pfx_len], rax
        call    make_process
        inc     r13
        jmp     .load
.loaded:

        call    run_all
        cmp     qword [requests], 0
        je      .quit
        lea     rdi, [line]             ; "ventanilla: pantallas=.. resintonias=.. llamadas al anfitrion=.. pedidos=.."
        lea     rsi, [t_screens]
        call    put_text
        mov     rax, [nscreens]
        call    put_decimal
        lea     rsi, [t_retunes]
        call    put_text
        mov     rax, [retunes]
        call    put_decimal
        lea     rsi, [t_host]
        call    put_text
        mov     rax, [hostcalls]
        call    put_decimal
        lea     rsi, [t_reqs]
        call    put_text
        mov     rax, [requests]
        call    put_decimal
        mov     word [rdi], 0A0Dh
        add     rdi, 2
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
        cmp     qword [denied], 0
        je      .quit
        lea     rdi, [line]             ; "porteros: nodos=.. negados=.."
        lea     rsi, [t_nodes]
        call    put_text
        mov     rax, [nnodes]
        call    put_decimal
        lea     rsi, [t_denied]
        call    put_text
        mov     rax, [denied]
        call    put_decimal
        mov     word [rdi], 0A0Dh
        add     rdi, 2
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
.quit:
        invoke  ExitProcess, 0

; eax = character -> its value 0..15 for 0-9 a-f A-F, or -1 with the sign flag set.
hex_digit:
        sub     eax, '0'
        cmp     eax, 9
        jbe     .ok
        or      eax, 20h                ; A-F as a-f
        sub     eax, 'a' - '0' or 20h
        cmp     eax, 5
        ja      .bad
        add     eax, 10
.ok:
        test    eax, eax
        ret
.bad:
        mov     eax, -1
        test    eax, eax
        ret

; Copies the zero-terminated text at rsi to rdi; leaves rdi just past it.
put_text:
        lodsb
        test    al, al
        jz      @f
        stosb
        jmp     put_text
@@:     ret

; ---------------------------------------------------------------- processes
; A cabin for the program at mp_prog (mp_words words), child of mp_parent (0 = the kernel, the mother of
; all). Its porters hang from its parent's porters (from the door porters for the kernel's children), with
; mp_rights cut down to what those have; the files porter carries the prefix mp_pfx_ptr / mp_pfx_len.
; The table of processes is a list of pointers that doubles, so a cabin never moves while it runs.
; -> rax = the new process. Keeps every callee-saved register.
make_process:
        push    rbx rsi rdi r12 r13 r14 r15
        invoke  VirtualAlloc, 0, PROC_SIZE, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     rbx, rax
        mov     rax, [mp_prog]
        mov     [rbx + P_PROG], rax
        mov     rax, [mp_words]
        mov     [rbx + P_NWORDS], rax
        mov     rax, [mp_parent]
        mov     [rbx + P_PARENT], rax
        invoke  VirtualAlloc, 0, DATA_SIZE, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_DATA], rax
        invoke  VirtualAlloc, 0, RET_DEPTH * 8, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_RET], rax
        mov     qword [rbx + P_REGS + 15*8], DATA_SIZE   ; j15 starts at the top of its data memory
        mov     qword [rbx + P_SIZE], DATA_SIZE
        mov     r15d, 1                 ; one microporter per door
.gate:
        mov     rcx, r15                ; the kernel's children hang from the door porters (node = door)
        mov     rax, [mp_parent]
        test    rax, rax
        jz      @f
        mov     rcx, [rax + P_GATES + r15*8 - 8]   ; a process's children hang from its own porters
@@:     imul    rax, rcx, NODE_SIZE
        add     rax, [nodes]
        mov     rdx, [rax + N_RIGHTS]
        and     rdx, [mp_rights]        ; never more than its parent has
        mov     r8, r15
        cmp     r15d, 3                 ; the files microporter carries the prefix, if any
        jne     @f
        mov     rax, [mp_pfx_ptr]
        mov     [nn_pptr], rax
        mov     rax, [mp_pfx_len]
        mov     [nn_plen], rax
@@:     call    new_node
        mov     [rbx + P_GATES + r15*8 - 8], rax
        inc     r15d
        cmp     r15d, DOORS
        jbe     .gate
        mov     rax, [nprocs]           ; into the table, which doubles when full
        cmp     rax, [capprocs]
        jb      .room
        lea     rax, [rax + rax]
        test    rax, rax
        jnz     @f
        mov     eax, 1
@@:     mov     [capprocs], rax
        shl     rax, 3
        invoke  VirtualAlloc, 0, rax, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [mp_new], rax
        mov     rdi, rax
        mov     rsi, [procs]
        mov     rcx, [nprocs]
        rep     movsq
        cmp     qword [procs], 0
        je      @f
        invoke  VirtualFree, [procs], 0, MEM_RELEASE
@@:     mov     rax, [mp_new]
        mov     [procs], rax
.room:
        mov     rdx, [procs]
        mov     rax, [nprocs]
        mov     [rdx + rax*8], rbx
        mov     [rbx + P_ID], rax
        inc     qword [nprocs]
        mov     rax, rbx
        pop     r15 r14 r13 r12 rdi rsi rbx
        ret

; ---------------------------------------------------------------- scheduler
; Runs every process in [procs] until all of them end. Least attained service; the turn comes from
; the priority gap and the switch cost (see the header).
run_all:
schedule:
        mov     rbx, -1                 ; least served process
        mov     r8, FOREVER             ; its service
        mov     r9, FOREVER             ; service of the next least served
        xor     ecx, ecx
.scan:
        cmp     rcx, [nprocs]
        jae     .chosen
        mov     rsi, [procs]
        mov     rsi, [rsi + rcx*8]
        cmp     qword [rsi + P_DONE], 0
        jne     .next_proc
        mov     rax, [rsi + P_SERVED]
        cmp     rax, r8
        jae     .not_least              ; ties keep the lower process number
        mov     r9, r8
        mov     r8, rax
        mov     rbx, rsi
        jmp     .next_proc
.not_least:
        cmp     rax, r9
        jae     .next_proc
        mov     r9, rax
.next_proc:
        inc     rcx
        jmp     .scan
.chosen:
        cmp     rbx, -1
        je      .all_done
        mov     rax, FOREVER            ; alone: run to the end
        cmp     r9, rax
        je      .run
        mov     rax, r9
        sub     rax, r8                 ; D: how much less service the one waiting has... the other way round
        lea     r10, [rax + 1]          ; least attained service alone: just pass the other one
        cvtsi2sd xmm0, rax
        addsd   xmm0, [swcost]          ; D + c
        movapd  xmm1, xmm0
        mulsd   xmm1, xmm1              ; (D + c)^2
        cvtsi2sd xmm2, r8
        mulsd   xmm2, [swcost]
        mulsd   xmm2, [four]            ; 4 c s
        addsd   xmm1, xmm2
        sqrtsd  xmm1, xmm1
        addsd   xmm0, xmm1
        mulsd   xmm0, [half]            ; t
        cvttsd2si rax, xmm0
        cvtsi2sd xmm1, rax
        ucomisd xmm0, xmm1
        jbe     @f
        inc     rax                     ; round up
@@:     cmp     rax, r10
        jge     .run
        mov     rax, r10
.run:
        inc     qword [switches]
        call    run_process             ; rax = instructions executed
        add     [rbx + P_SERVED], rax
        add     [clock], rax
        cmp     qword [rbx + P_DONE], 0
        je      schedule
        call    close_files             ; whatever the process left open
        cmp     byte [quiet], 0
        jne     schedule
        call    report
        jmp     schedule
.all_done:
        ret

; ---------------------------------------------------------------- calibration
; Measures the cost of a switch on this machine, in instructions: the same program once alone and
; twice side by side with c = 0 (switching as often as possible), as pairs measured back to back.
; Each pair gives its own c and the median of the pairs is kept: one run interrupted by the host can
; not drag it. During the measurement the thread stays on one core at top priority (the host would
; otherwise move it or pause it in the middle), after a warm-up run that is not counted.
calibrate:
        sub     rsp, 8
        mov     rax, [procs]
        mov     [real_procs], rax
        mov     rax, [nprocs]
        mov     [real_nprocs], rax
        lea     rax, [calib_list]
        mov     [procs], rax
        mov     byte [quiet], 1
        mov     qword [swcost], 0
        invoke  GetCurrentThread
        mov     [thread], rax
        invoke  SetThreadAffinityMask, [thread], 1
        mov     [old_affinity], rax
        invoke  GetThreadPriority, [thread]
        mov     [old_priority], rax
        invoke  SetThreadPriority, [thread], THREAD_PRIORITY_TIME_CRITICAL
        call    calib_one               ; warm-up
        call    calib_two
        mov     qword [rounds], 0       ; in memory: run_process uses every register
.pair:
        call    calib_one
        mov     [cycles_one], rax
        mov     rax, [clock]
        mov     [instr_one], rax
        call    calib_two
        mov     [cycles_two], rax
        mov     rax, [clock]
        mov     [instr_two], rax
        mov     rax, [switches]
        mov     [switch_two], rax
        call    calib_one               ; alone again: A-B-A, the two "alone" runs bracket the middle one
        add     rax, [cycles_one]
        shr     rax, 1
        mov     [cycles_one], rax       ; so a drift of the clock speed cancels out
        ; a = cycles per instruction; this pair's c = ((cycles_two - instr_two * a) / switches) / a
        cvtsi2sd xmm0, [cycles_one]
        cvtsi2sd xmm1, [instr_one]
        divsd   xmm0, xmm1
        cvtsi2sd xmm1, [instr_two]
        mulsd   xmm1, xmm0
        cvtsi2sd xmm2, [cycles_two]
        subsd   xmm2, xmm1
        cvtsi2sd xmm1, [switch_two]
        divsd   xmm2, xmm1
        divsd   xmm2, xmm0
        mov     rax, [rounds]
        movsd   [pair_c + rax*8], xmm2
        inc     qword [rounds]
        cmp     qword [rounds], CALIB_PAIRS
        jb      .pair
        ; median: sort the pairs (insertion sort) and take the middle one
        mov     ecx, 1
.sort:
        cmp     ecx, CALIB_PAIRS
        jae     .sorted
        movsd   xmm0, [pair_c + rcx*8]
        mov     edx, ecx
.shift:
        test    edx, edx
        jz      .place
        movsd   xmm1, [pair_c + rdx*8 - 8]
        comisd  xmm1, xmm0
        jbe     .place
        movsd   [pair_c + rdx*8], xmm1
        dec     edx
        jmp     .shift
.place:
        movsd   [pair_c + rdx*8], xmm0
        inc     ecx
        jmp     .sort
.sorted:
        invoke  GetEnvironmentVariableA, calib_env, env_value, 31   ; JANAX_CALIBRACION: show every pair
        test    eax, eax
        jz      .median
        lea     rdi, [line]
        lea     rsi, [calib_text]
        call    put_text
        mov     qword [rounds], 0
.show:
        mov     byte [rdi], ' '
        inc     rdi
        mov     rax, [rounds]
        movsd   xmm0, [pair_c + rax*8]
        call    put_hundredths
        inc     qword [rounds]
        cmp     qword [rounds], CALIB_PAIRS
        jb      .show
        mov     word [rdi], 0A0Dh
        add     rdi, 2
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
.median:
        movsd   xmm2, [pair_c + (CALIB_PAIRS / 2) * 8]
        xorpd   xmm1, xmm1
        maxsd   xmm2, xmm1              ; noise can never make it negative
        movsd   [swcost], xmm2
        invoke  SetThreadPriority, [thread], [old_priority]
        cmp     qword [old_affinity], 0
        je      @f
        invoke  SetThreadAffinityMask, [thread], [old_affinity]
@@:     mov     rax, [real_procs]
        mov     [procs], rax
        mov     rax, [real_nprocs]
        mov     [nprocs], rax
        mov     byte [quiet], 0
        mov     qword [clock], 0
        mov     qword [switches], 0
        add     rsp, 8
        ret

; The measured cost belongs to this kernel on this processor: key = fingerprint of the kernel's code
; (FNV-1a) + the processor's name (CPUID). It is kept in the system's folder as "calibracion" (not a
; label: labels are hexadecimal) and remembered while the key matches, so the measurement (about a
; second) is paid once per machine and kernel.
cost_key:
        push    rbx rdi
        mov     eax, 811C9DC5h
        lea     rsi, [code_begin]
        lea     rdx, [code_end]
.fnv:
        cmp     rsi, rdx
        jae     .hashed
        movzx   ecx, byte [rsi]
        xor     eax, ecx
        imul    eax, eax, 01000193h
        inc     rsi
        jmp     .fnv
.hashed:
        mov     dword [cost_rec], eax
        lea     rdi, [cost_rec + 4]
        mov     eax, 80000000h          ; the processor name, if it has one
        cpuid
        cmp     eax, 80000004h
        jb      .done
        mov     esi, 80000002h
.leaf:
        mov     eax, esi
        cpuid
        mov     [rdi], eax
        mov     [rdi + 4], ebx
        mov     [rdi + 8], ecx
        mov     [rdi + 12], edx
        add     rdi, 16
        inc     esi
        cmp     esi, 80000004h
        jbe     .leaf
.done:
        pop     rdi rbx
        ret

; host_path = folder\calibracion
calib_path:
        lea     rdi, [host_path]
        lea     rsi, [dir_path]
        mov     rcx, [dir_len]
        rep     movsb
        lea     rsi, [calib_name]
        call    put_text
        mov     byte [rdi], 0
        ret

; eax = 1 and swcost set if a calibration with this key was kept, else 0.
recall_cost:
        sub     rsp, 8
        call    calib_path
        invoke  CreateFileA, host_path, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      .no
        mov     [hfile], rax
        mov     dword [bytesread], 0
        invoke  ReadFile, [hfile], cost_read, COST_REC_LEN, bytesread, 0
        invoke  CloseHandle, [hfile]
        cmp     dword [bytesread], COST_REC_LEN
        jne     .no
        lea     rsi, [cost_rec]
        lea     rdi, [cost_read]
        mov     ecx, COST_KEY_LEN
        repe    cmpsb
        jne     .no
        mov     rax, qword [cost_read + COST_KEY_LEN]
        mov     [swcost], rax
        mov     eax, 1
        add     rsp, 8
        ret
.no:
        xor     eax, eax
        add     rsp, 8
        ret

; Keeps the measured swcost with its key (a failure only means measuring again next time).
save_cost:
        sub     rsp, 8
        mov     rax, [swcost]
        mov     qword [cost_rec + COST_KEY_LEN], rax
        call    calib_path
        invoke  CreateFileA, host_path, GENERIC_WRITE, 0, 0, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, 0
        cmp     rax, -1
        je      .done
        mov     [hfile], rax
        invoke  WriteFile, [hfile], cost_rec, COST_REC_LEN, written, 0
        invoke  CloseHandle, [hfile]
.done:
        add     rsp, 8
        ret

; The calibration program alone (calib_one) or twice side by side (calib_two): rax = cycles taken,
; clock = instructions, switches = switches.
calib_one:
        mov     qword [nprocs], 1
        jmp     calib_run
calib_two:
        mov     qword [nprocs], 2
calib_run:
        call    calib_reset
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        mov     [tsc_start], rax
        call    run_all
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        sub     rax, [tsc_start]
        ret

; Puts the calibration processes back at their start.
calib_reset:
        lea     rdi, [calib_procs]
        xor     eax, eax
        mov     ecx, 2 * PROC_SIZE
        rep     stosb
        lea     rdi, [calib_procs]
        lea     rax, [calib_prog]
        mov     [rdi + P_PROG], rax
        mov     qword [rdi + P_NWORDS], CALIB_WORDS
        mov     [rdi + PROC_SIZE + P_PROG], rax
        mov     qword [rdi + PROC_SIZE + P_NWORDS], CALIB_WORDS
        mov     qword [clock], 0
        mov     qword [switches], 0
        ret

; "costo de cambio: <c with two decimals>"
print_cost:
        sub     rsp, 8
        invoke  WriteFile, [hout], cost_text, COST_TEXT_LEN, written, 0
        movsd   xmm0, [swcost]
        lea     rdi, [line]
        call    put_hundredths
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
        add     rsp, 8
        ret

; Writes xmm0 at rdi with two decimals ("-" first if negative); leaves rdi just past it.
put_hundredths:
        mulsd   xmm0, [hundred]
        cvtsd2si rax, xmm0              ; rounded to the nearest hundredth
        test    rax, rax
        jns     @f
        mov     byte [rdi], '-'
        inc     rdi
        neg     rax
@@:     xor     edx, edx
        mov     ecx, 100
        div     rcx
        push    rdx
        call    put_decimal
        mov     byte [rdi], '.'
        inc     rdi
        pop     rax
        mov     ecx, 10
        xor     edx, edx
        div     rcx
        add     al, '0'
        add     dl, '0'
        mov     [rdi], al
        mov     [rdi + 1], dl
        add     rdi, 2
        ret

; ---------------------------------------------------------------- one process for up to rax instructions
; rbx = process. Returns rax = instructions executed; sets P_DONE and P_CODE if the process ended.
run_process:
        mov     [budget0], rax
        mov     rbp, rax                ; budget left
        mov     r14, rbx                ; registers
        mov     r15, [rbx + P_DATA]
        mov     r13, [rbx + P_PROG]
        mov     r12, [rbx + P_PC]
        mov     rsi, [rbx + P_RET]
        mov     rdi, [rbx + P_DEPTH]
next:
        test    rbp, rbp
        jz      suspend
        cmp     r12, [rbx + P_NWORDS]
        jae     fail_pc
        mov     eax, [r13 + r12*4]
        inc     r12                     ; jumps are relative to the next instruction
        dec     rbp
        movzx   ecx, al
        mov     r11d, eax
        shr     r11d, 8
        and     r11d, 15                ; rd
        mov     r8d, eax
        shr     r8d, 12
        and     r8d, 15                 ; ra
        mov     r9d, eax
        shr     r9d, 16                 ; imm16, zero-extended
        mov     r10d, r9d
        and     r10d, 15                ; rb
        cmp     ecx, OP_COUNT
        jae     fail_op
        jmp     qword [optable + rcx*8]

suspend:
        mov     [rbx + P_PC], r12
        mov     [rbx + P_DEPTH], rdi
        mov     rax, [budget0]
        sub     rax, rbp
        ret

op_halt:
        xor     ecx, ecx
        jmp     ended
fail_op:
        mov     ecx, 1
        jmp     ended
fail_pc:
        mov     ecx, 2
        jmp     ended
fail_mem:
        mov     ecx, 5
        jmp     ended
fail_align:
        mov     ecx, 6
        jmp     ended
fail_call:
        mov     ecx, 7
        jmp     ended
fail_ret:
        mov     ecx, 8
ended:
        mov     [rbx + P_CODE], rcx
        mov     qword [rbx + P_DONE], 1
        jmp     suspend

op_ldi:
        movsx   rax, r9w
        mov     [r14 + r11*8], rax
        jmp     next

macro binop name, insn {
  name:
          mov     rax, [r14 + r8*8]
          insn    rax, [r14 + r10*8]
          mov     [r14 + r11*8], rax
          jmp     next
}

binop op_add, add
binop op_sub, sub
binop op_mul, imul
binop op_and, and
binop op_or,  or
binop op_xor, xor

op_div:
        mov     rax, [r14 + r8*8]
        mov     rcx, [r14 + r10*8]
        test    rcx, rcx
        jz      .by_zero
        cmp     rcx, -1
        je      .by_minus_one
        cqo
        idiv    rcx
        jmp     .store
.by_zero:
        xor     eax, eax
        jmp     .store
.by_minus_one:
        neg     rax
.store:
        mov     [r14 + r11*8], rax
        jmp     next

macro shiftop name, insn {
  name:
          mov     rax, [r14 + r8*8]
          mov     rcx, [r14 + r10*8]
          and     ecx, 63
          insn    rax, cl
          mov     [r14 + r11*8], rax
          jmp     next
}

shiftop op_shl, shl
shiftop op_shr, shr
shiftop op_sar, sar

op_jmp:
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_jz:
        cmp     qword [r14 + r11*8], 0
        jne     next
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_jnz:
        cmp     qword [r14 + r11*8], 0
        je      next
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_shi:
        mov     rax, [r14 + r11*8]
        shl     rax, 16
        or      rax, r9
        mov     [r14 + r11*8], rax
        jmp     next

macro memop name, size, align_check, is_load, body {
  name:
          movsx   rax, r9w
          add     rax, [r14 + r8*8]
          mov     rcx, [rbx + P_SIZE]     ; this cabin's size: it grows and shrinks
          sub     rcx, size
          cmp     rax, rcx
          ja      fail_mem
    if align_check
          test    al, 7
          jnz     fail_align
    end if
    if ~ is_load
          mov     rcx, [r14 + r11*8]
    end if
          body
    if is_load
          mov     [r14 + r11*8], rax
    end if
          jmp     next
}

memop op_ld,  8, 1, 1, <mov rax, [r15 + rax]>
memop op_st,  8, 1, 0, <mov [r15 + rax], rcx>
memop op_ldb, 1, 0, 1, <movzx eax, byte [r15 + rax]>
memop op_stb, 1, 0, 0, <mov [r15 + rax], cl>

op_call:
        cmp     rdi, RET_DEPTH
        jae     fail_call
        mov     [rsi + rdi*8], r12
        inc     rdi
        movsx   rax, r9w
        add     r12, rax
        jmp     next

op_ret:
        test    rdi, rdi
        jz      fail_ret
        dec     rdi
        mov     r12, [rsi + rdi*8]
        jmp     next

op_sys:
        mov     [sys_rd], r11
        mov     rax, [r14 + r8*8]       ; queue address
        call    ventanilla
        mov     r15, [rbx + P_DATA]     ; the cabin may have moved
        cmp     rax, -1
        je      fail_mem
        mov     r11, [sys_rd]
        mov     [r14 + r11*8], rax      ; requests attended
        jmp     next

; ---------------------------------------------------------------- the window (ventanilla)
; Capitan: "as few screens as possible; each screen changes its tuning; requests are tuned to a screen
; and over time can change screen and tuning".
;  - A screen serves requests of one kind (its tuning) and serves them as a batch: every "write" of the
;    round leaves in a single call to the host.
;  - A kind that already has its screen keeps it. A kind without one takes a screen that got nothing
;    this round (the screen changes its tuning), and only if there is none a new screen opens. So there
;    are never more screens than kinds present at the same time.
;  - Rounds are touches of the window (events), never a clock.
; Kinds: 1 write (a = address, b = bytes; answer b), 2 grow (a = bytes; answer the new size),
; 3 shrink (a = bytes; answer the new size, never below the end of the queue). Others: answer -1.
; Within a kind the order of the queue is kept.
;
; rbx = process, rax = queue address. Returns rax = requests attended, or -1 if the queue is outside
; the cabin.
ventanilla:
        push    rsi rdi rbp r12 r13 r14 r15
        mov     r12, rax
        mov     [queue_addr], rax
        mov     r14, [rbx + P_SIZE]
        test    r12b, 7
        jnz     .bad
        mov     rax, r14
        sub     rax, 8
        cmp     r12, rax
        ja      .bad
        mov     r13, [rbx + P_DATA]
        mov     r15, [r13 + r12]        ; how many requests
        mov     rax, r14
        sub     rax, r12
        sub     rax, 8
        shr     rax, 5
        cmp     r15, rax
        ja      .bad                    ; the entries would go past the cabin
        test    r15, r15
        jz      .none
        add     [requests], r15
        mov     rax, r15
        shl     rax, 5
        lea     rax, [rax + r12 + 8]
        mov     [queue_end], rax
        mov     rdx, r15
        shl     rdx, 5
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .bad
        mov     rbp, rax                ; private copy of the entries
        mov     rdi, rbp
        mov     rsi, [queue_addr]
        lea     rsi, [r13 + rsi + 8]
        mov     rcx, r15
        shl     rcx, 5
        rep     movsb

        ; kinds present this round; unknown ones are answered -1 right away
        xor     eax, eax
        mov     ecx, KINDS + 1
        lea     rdi, [present]
        rep     stosb
        mov     ecx, KINDS
        lea     rdi, [busy]
        rep     stosb
        xor     ecx, ecx
.mark:
        cmp     rcx, r15
        jae     .marked
        mov     rax, rcx
        shl     rax, 5
        mov     edx, [rbp + rax]        ; kind (low half; the high half carries a file handle)
        lea     r8, [rdx - 1]
        cmp     r8, KINDS - 1
        ja      .unknown
        movzx   r9d, byte [kind_door + rdx]
        test    r9d, r9d
        jz      .allowed                ; the porters' own requests answer to the tree's rules
        mov     r8, [rbx + P_GATES + r9*8 - 8]   ; the process's porter for this door
        movzx   r9d, byte [kind_right + rdx]
        call    gate_allows
        test    r8d, r8d
        jnz     .allowed
        inc     qword [denied]
        jmp     .unknown
.allowed:
        mov     byte [present + rdx], 1
        jmp     .mark_next
.unknown:
        mov     qword [rbp + rax + 24], -1
.mark_next:
        inc     rcx
        jmp     .mark
.marked:

        ; pass 1: a kind that already has its screen keeps it
        mov     edx, 1
.keep:
        cmp     edx, KINDS
        ja      .kept
        cmp     byte [present + rdx], 0
        je      .keep_next
        xor     ecx, ecx
.look:
        cmp     rcx, [nscreens]
        jae     .keep_next
        cmp     [tune + rcx*8], rdx
        je      .found
        inc     ecx
        jmp     .look
.found:
        mov     byte [busy + rcx], 1
        mov     byte [present + rdx], 2 ; placed
.keep_next:
        inc     edx
        jmp     .keep
.kept:

        ; pass 2: the rest take a screen that got nothing this round (it changes tuning) or open one
        mov     edx, 1
.place:
        cmp     edx, KINDS
        ja      .placed
        cmp     byte [present + rdx], 1
        jne     .place_next
        xor     ecx, ecx
.free:
        cmp     rcx, [nscreens]
        jae     .open
        cmp     byte [busy + rcx], 0
        je      .retune
        inc     ecx
        jmp     .free
.retune:
        mov     [tune + rcx*8], rdx
        mov     byte [busy + rcx], 1
        inc     qword [retunes]
        jmp     .place_next
.open:
        mov     rcx, [nscreens]
        mov     [tune + rcx*8], rdx
        mov     byte [busy + rcx], 1
        inc     qword [nscreens]
.place_next:
        inc     edx
        jmp     .place
.placed:

        ; every screen used this round serves its whole batch
        xor     r12d, r12d
.serve:
        cmp     r12, [nscreens]
        jae     .served
        cmp     byte [busy + r12], 0
        je      .serve_next
        mov     rax, [tune + r12*8]
        call    qword [serve_table + rax*8 - 8]
.serve_next:
        inc     r12
        jmp     .serve
.served:

        ; answers back into the queue (the cabin may have moved); the queue is left empty
        mov     r13, [rbx + P_DATA]
        mov     rax, [queue_addr]
        mov     qword [r13 + rax], 0
        lea     rdi, [r13 + rax + 8]
        mov     rsi, rbp
        mov     rcx, r15
        shl     rcx, 5
        rep     movsb
        invoke  VirtualFree, rbp, 0, MEM_RELEASE
        mov     rax, r15
        jmp     .out
.none:
        xor     eax, eax
        jmp     .out
.bad:
        mov     rax, -1
.out:
        pop     r15 r14 r13 r12 rbp rdi rsi
        ret

; Screen tuned to "write": every valid write of the round in one call to the host.
; rbp = entries, r15 = how many.
serve_write:
        push    r12 r13 r14 r15
        sub     rsp, 8
        mov     r14, [rbx + P_SIZE]
        xor     r8, r8                  ; total bytes
        xor     ecx, ecx
.length:
        cmp     rcx, r15
        jae     .lengths
        mov     rax, rcx
        shl     rax, 5
        cmp     dword [rbp + rax], 1
        jne     .length_next
        mov     rdx, [rbp + rax + 8]    ; a
        mov     r9, [rbp + rax + 16]    ; b
        cmp     rdx, r14
        ja      .invalid
        mov     r10, r14
        sub     r10, rdx
        cmp     r9, r10
        ja      .invalid
        add     r8, r9
        mov     [rbp + rax + 24], r9
        jmp     .length_next
.invalid:
        mov     qword [rbp + rax + 24], -1
.length_next:
        inc     rcx
        jmp     .length
.lengths:
        test    r8, r8
        jz      .done
        mov     [wtotal], r8
        invoke  VirtualAlloc, 0, [wtotal], MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .done
        mov     [wbuf], rax
        mov     rdi, rax
        mov     r13, [rbx + P_DATA]
        xor     r12d, r12d
.copy:
        cmp     r12, r15
        jae     .copied
        mov     rax, r12
        shl     rax, 5
        cmp     dword [rbp + rax], 1
        jne     .copy_next
        mov     rcx, [rbp + rax + 24]
        cmp     rcx, -1
        je      .copy_next
        mov     rsi, [rbp + rax + 8]
        add     rsi, r13
        rep     movsb
.copy_next:
        inc     r12
        jmp     .copy
.copied:
        invoke  WriteFile, [hout], [wbuf], [wtotal], written, 0
        inc     qword [hostcalls]
        invoke  VirtualFree, [wbuf], 0, MEM_RELEASE
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; Screen tuned to "grow": each request adds a (rounded up to 8) bytes to the cabin.
serve_grow:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, r15
        jae     .done
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 2
        jne     .next
        mov     rax, [rbp + r13 + 8]
        add     rax, 7
        jc      .invalid
        and     rax, -8
        add     rax, [rbx + P_SIZE]
        jc      .invalid
        mov     r14, rax                ; new size
        call    move_cabin
        test    rax, rax
        jz      .invalid
        mov     [rbp + r13 + 24], r14
        jmp     .next
.invalid:
        mov     qword [rbp + r13 + 24], -1
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; Screen tuned to "shrink": each request gives back a (rounded up to 8) bytes, never below the end of
; the queue, so the answers still have somewhere to go.
serve_shrink:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, r15
        jae     .done
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 3
        jne     .next
        mov     rax, [rbp + r13 + 8]
        add     rax, 7
        jc      .floor
        and     rax, -8
        mov     r14, [rbx + P_SIZE]
        sub     r14, rax
        jc      .floor
        cmp     r14, [queue_end]
        jae     .size_ok
.floor:
        mov     r14, [queue_end]
.size_ok:
        cmp     r14, [rbx + P_SIZE]
        jae     .unchanged
        call    move_cabin
        test    rax, rax
        jz      .unchanged
.unchanged:
        mov     rax, [rbx + P_SIZE]
        mov     [rbp + r13 + 24], rax
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; The cabin moves to fresh memory of r14 bytes (new part zeroed by the host). Returns rax = 0 if the
; host has no memory for it (the cabin stays as it was).
move_cabin:
        sub     rsp, 8
        invoke  VirtualAlloc, 0, r14, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .done
        mov     rdi, rax
        mov     rsi, [rbx + P_DATA]
        mov     rcx, [rbx + P_SIZE]
        cmp     rcx, r14
        jbe     @f
        mov     rcx, r14                ; shrinking: keep only what fits
@@:     rep     movsb
        mov     [move_new], rax
        invoke  VirtualFree, qword [rbx + P_DATA], 0, MEM_RELEASE
        mov     rax, [move_new]
        mov     [rbx + P_DATA], rax
        mov     [rbx + P_SIZE], r14
.done:
        add     rsp, 8
        ret

; ---------------------------------------------------------------- files
; A label is any valid UTF-8 (emojis included). On the host it is stored in the system's own folder
; under its bytes in lowercase hexadecimal: always a valid file name and never two labels in one name
; (the host may forbid characters or ignore the difference between upper and lower case).
; The handle a process gets is a slot number in its own table; it travels in the high half of the type.

; Screen tuned to "open" (kind 4): a = label address, b = label bytes. Answers the handle, or -1.
serve_open:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, r15
        jae     .done
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 4
        jne     .next
        mov     rsi, [rbp + r13 + 8]
        mov     rcx, [rbp + r13 + 16]
        lea     rdi, [host_path]
        call    label_path
        test    eax, eax
        jz      .invalid
        call    files_prefix_ok
        test    eax, eax
        jz      .invalid
        invoke  CreateFileA, host_path, GENERIC_READ + GENERIC_WRITE, FILE_SHARE_READ, 0, OPEN_ALWAYS, FILE_ATTRIBUTE_NORMAL, 0
        inc     qword [hostcalls]
        cmp     rax, -1
        je      .invalid
        mov     r14, rax
        call    file_slot
        cmp     rax, -1
        je      .no_slot
        mov     rdx, [rbx + P_FILES]
        mov     [rdx + rax*8], r14
        mov     [rbp + r13 + 24], rax
        jmp     .next
.no_slot:
        invoke  CloseHandle, r14
.invalid:
        mov     qword [rbp + r13 + 24], -1
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; rsi = label offset in the cabin, rcx = its bytes, rdi = where to write the host path.
; -> eax = 1 and "folder\hex" written, where hex is the label in Unicode normal form C (the one-piece
; form, so two labels that look the same are the same file); eax = 0 if the label is outside the
; cabin, empty, not UTF-8, or too long for the host. In symbiosis the host does the normalization.
; rsi = bytes, rcx = how many -> eax = 1 and norm_label / norm_len = the same text in Unicode normal
; form C; eax = 0 if it is not valid UTF-8 or does not fit. In symbiosis the host normalizes.
normalize_bytes:
        sub     rsp, 8
        cmp     rcx, WIDE_CAP
        ja      .no
        mov     [lab_ptr], rsi
        mov     [lab_len], rcx
        call    utf8_ok
        test    eax, eax
        jz      .no
        invoke  MultiByteToWideChar, CP_UTF8, 0, [lab_ptr], [lab_len], wide_in, WIDE_CAP
        test    eax, eax
        jz      .no
        mov     [wide_len], rax
        invoke  NormalizeString, NORMALIZATION_C, wide_in, [wide_len], wide_out, WIDE_CAP
        test    eax, eax
        jle     .no
        mov     [wide_len], rax
        invoke  WideCharToMultiByte, CP_UTF8, 0, wide_out, [wide_len], norm_label, NORM_CAP, 0, 0
        test    eax, eax
        jz      .no
        mov     [norm_len], rax
        mov     eax, 1
        add     rsp, 8
        ret
.no:
        xor     eax, eax
        add     rsp, 8
        ret

; r8 = node -> r8 = 1 if norm_label (norm_len bytes) starts with the label prefix of every porter on the
; way up to the root (porters without a prefix allow any label), else 0. Uses r9, r10, r11, rsi, rdi, rcx.
prefix_allows:
        cmp     r8, -1
        je      .yes
        cmp     r8, [nnodes]
        jae     .no
        imul    r10, r8, NODE_SIZE
        add     r10, [nodes]
        mov     rcx, [r10 + N_PLEN]
        test    rcx, rcx
        jz      .up
        cmp     rcx, [norm_len]
        ja      .no
        mov     rsi, [r10 + N_PREFIX]
        add     rsi, [pfx_pool]
        lea     rdi, [norm_label]
        repe    cmpsb
        jne     .no
.up:
        mov     r8, [r10 + N_PARENT]
        jmp     prefix_allows
.yes:
        mov     r8d, 1
        ret
.no:
        xor     r8d, r8d
        ret

; The label just normalized must be allowed by the process's files porter; a refusal counts.
; -> eax = 1 allowed, 0 refused.
files_prefix_ok:
        push    rsi rdi
        mov     r8, [rbx + P_GATES + 2*8]
        call    prefix_allows
        mov     eax, r8d
        test    eax, eax
        jnz     @f
        inc     qword [denied]
@@:     pop     rdi rsi
        ret

label_path:
        push    r12 r13 r14
        mov     r12, rdi
        test    rcx, rcx
        jz      .no
        mov     rax, [rbx + P_SIZE]
        cmp     rsi, rax
        ja      .no
        sub     rax, rsi
        cmp     rcx, rax
        ja      .no
        add     rsi, [rbx + P_DATA]
        call    normalize_bytes
        test    eax, eax
        jz      .no
        mov     r13, [norm_len]
        lea     rax, [r13*2]            ; folder + "\" + two characters per byte + 0 must fit
        add     rax, [dir_len]
        add     rax, 2
        cmp     rax, HOST_PATH
        ja      .no
        mov     rdi, r12
        lea     rsi, [dir_path]
        mov     rcx, [dir_len]
        rep     movsb
        mov     al, '\'
        stosb
        lea     rsi, [norm_label]
        mov     rcx, r13
.hex:
        lodsb
        movzx   edx, al
        shr     eax, 4
        and     eax, 15
        mov     al, [hex_lower + rax]
        stosb
        and     edx, 15
        mov     al, [hex_lower + rdx]
        stosb
        dec     rcx
        jnz     .hex
        mov     byte [rdi], 0
        mov     eax, 1
        jmp     .out
.no:
        xor     eax, eax
.out:
        pop     r14 r13 r12
        ret

; Screen tuned to "delete" (kind 12): a = label, b = bytes. Answers 0, or -1.
serve_delete:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, r15
        jae     .done
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 12
        jne     .next
        mov     rsi, [rbp + r13 + 8]
        mov     rcx, [rbp + r13 + 16]
        lea     rdi, [host_path]
        call    label_path
        test    eax, eax
        jz      .invalid
        call    files_prefix_ok
        test    eax, eax
        jz      .invalid
        invoke  DeleteFileA, host_path
        inc     qword [hostcalls]
        test    eax, eax
        jz      .invalid
        mov     qword [rbp + r13 + 24], 0
        jmp     .next
.invalid:
        mov     qword [rbp + r13 + 24], -1
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; Screen tuned to "rename" (kind 13): a = old label, b = its bytes; the new label follows it right away
; and its length travels in the high half of the type. Answers 0, or -1 (also if the new one exists).
serve_rename:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, r15
        jae     .done
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 13
        jne     .next
        mov     rsi, [rbp + r13 + 8]
        mov     rcx, [rbp + r13 + 16]
        lea     rdi, [host_path]
        call    label_path
        test    eax, eax
        jz      .invalid
        call    files_prefix_ok
        test    eax, eax
        jz      .invalid
        mov     rsi, [rbp + r13 + 8]
        add     rsi, [rbp + r13 + 16]
        jc      .invalid
        mov     ecx, [rbp + r13 + 4]
        lea     rdi, [host_path_2]
        call    label_path
        test    eax, eax
        jz      .invalid
        call    files_prefix_ok
        test    eax, eax
        jz      .invalid
        invoke  MoveFileA, host_path, host_path_2
        inc     qword [hostcalls]
        test    eax, eax
        jz      .invalid
        mov     qword [rbp + r13 + 24], 0
        jmp     .next
.invalid:
        mov     qword [rbp + r13 + 24], -1
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; Screen tuned to "list" (kind 14): a = where to write, b = room. Writes each label as a qword with
; its length and then its bytes padded to 8, while they fit. Answers how many were written, or -1.
; Names in the folder that are not the hexadecimal of a UTF-8 label are not the system's: skipped.
serve_list:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, r15
        jae     .done
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 14
        jne     .next
        call    list_one
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; One "list" request, entry r13. Keeps r12, r13, r15.
list_one:
        push    r14 rsi rdi
        mov     rax, [rbp + r13 + 8]    ; destination offset and room must be inside the cabin
        mov     rdx, [rbp + r13 + 16]
        mov     rcx, [rbx + P_SIZE]
        cmp     rax, rcx
        ja      .invalid
        sub     rcx, rax
        cmp     rdx, rcx
        ja      .invalid
        mov     [list_pos], rax
        add     rax, rdx
        mov     [list_end], rax
        mov     qword [list_count], 0
        lea     rdi, [host_path]        ; "folder\*"
        lea     rsi, [dir_path]
        mov     rcx, [dir_len]
        rep     movsb
        mov     eax, '\*'
        stosw
        mov     byte [rdi], 0
        invoke  FindFirstFileA, host_path, find_data
        inc     qword [hostcalls]
        cmp     rax, -1
        je      .answer                 ; nothing in the folder
        mov     r14, rax
.entry:
        test    dword [find_data], FILE_ATTRIBUTE_DIRECTORY
        jnz     .another
        call    list_decode             ; eax = label bytes in norm_label, or -1
        cmp     eax, -1
        je      .another
        mov     [norm_len], rax         ; only what the process's porters allow is listed
        push    rax
        mov     r8, [rbx + P_GATES + 2*8]
        call    prefix_allows
        pop     rax
        test    r8d, r8d
        jz      .another
        mov     ecx, eax
        lea     rdx, [rcx + 15]         ; qword length + bytes padded to 8
        and     rdx, -8
        mov     rax, [list_end]
        sub     rax, [list_pos]
        cmp     rdx, rax
        ja      .full
        mov     rdi, [rbx + P_DATA]
        add     rdi, [list_pos]
        add     [list_pos], rdx
        mov     [rdi], rcx
        add     rdi, 8
        lea     rsi, [norm_label]
        rep     movsb
        inc     qword [list_count]
.another:
        invoke  FindNextFileA, r14, find_data
        inc     qword [hostcalls]
        test    eax, eax
        jnz     .entry
.full:
        invoke  FindClose, r14
        inc     qword [hostcalls]
.answer:
        mov     rax, [list_count]
        mov     [rbp + r13 + 24], rax
        pop     rdi rsi r14
        ret
.invalid:
        mov     qword [rbp + r13 + 24], -1
        pop     rdi rsi r14
        ret

; The file name in find_data back to its label in norm_label: eax = bytes, or -1 if the name is not
; lowercase hexadecimal of valid UTF-8.
list_decode:
        lea     rsi, [find_data + FIND_NAME]
        lea     rdi, [norm_label]
        xor     ecx, ecx
.pair:
        movzx   eax, byte [rsi]
        test    eax, eax
        jz      .end
        call    .nibble
        js      .no
        mov     edx, eax
        movzx   eax, byte [rsi + 1]
        call    .nibble
        js      .no
        shl     edx, 4
        or      eax, edx
        stosb
        add     rsi, 2
        inc     ecx
        cmp     ecx, NORM_CAP
        jae     .no
        jmp     .pair
.end:
        test    ecx, ecx
        jz      .no
        mov     [lab_len], rcx
        lea     rsi, [norm_label]
        call    utf8_ok
        test    eax, eax
        jz      .no
        mov     rax, [lab_len]
        ret
.no:
        mov     eax, -1
        ret
.nibble:                                ; eax = character -> 0..15, or sign flag set
        sub     eax, '0'
        cmp     eax, 9
        jbe     .ok
        sub     eax, 'a' - '0'
        cmp     eax, 5
        ja      .bad
        add     eax, 10
.ok:
        test    eax, eax                ; clears the sign flag
        ret
.bad:
        mov     eax, -1
        test    eax, eax
        ret

; Screens tuned to "read" (kind 5) and "write to file" (kind 6): a = address, b = bytes.
; Answers the bytes moved, or -1. Each file keeps its own position.
macro serve_io name, kind, api {
  name:
          push    r12 r13 r14 r15
          sub     rsp, 8
          xor     r12d, r12d
  .one:
          cmp     r12, r15
          jae     .done
          mov     r13, r12
          shl     r13, 5
          cmp     dword [rbp + r13], kind
          jne     .next
          call    file_handle
          test    rax, rax
          jz      .invalid
          mov     r14, rax
          mov     rdx, [rbp + r13 + 8]
          mov     r8, [rbp + r13 + 16]
          mov     rax, [rbx + P_SIZE]
          cmp     rdx, rax
          ja      .invalid
          sub     rax, rdx
          cmp     r8, rax
          ja      .invalid
          add     rdx, [rbx + P_DATA]
          mov     dword [fio_bytes], 0
          invoke  api, r14, rdx, r8, fio_bytes, 0
          inc     qword [hostcalls]
          test    eax, eax
          jz      .invalid
          mov     eax, [fio_bytes]
          mov     [rbp + r13 + 24], rax
          jmp     .next
  .invalid:
          mov     qword [rbp + r13 + 24], -1
  .next:
          inc     r12
          jmp     .one
  .done:
          add     rsp, 8
          pop     r15 r14 r13 r12
          ret
}

serve_io serve_fread,  5, ReadFile
serve_io serve_fwrite, 6, WriteFile

; Screen tuned to "close" (kind 7). Answers 0, or -1 for a handle that is not open.
serve_close:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, r15
        jae     .done
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 7
        jne     .next
        call    file_handle
        test    rax, rax
        jz      .invalid
        invoke  CloseHandle, rax
        inc     qword [hostcalls]
        mov     eax, [rbp + r13 + 4]
        mov     rdx, [rbx + P_FILES]
        mov     qword [rdx + rax*8], 0
        mov     qword [rbp + r13 + 24], 0
        jmp     .next
.invalid:
        mov     qword [rbp + r13 + 24], -1
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; rax = host handle of the slot in the high half of entry r13's type, or 0 if it is not open.
file_handle:
        mov     eax, [rbp + r13 + 4]
        cmp     rax, [rbx + P_NFILES]
        jae     .none
        mov     rdx, [rbx + P_FILES]
        mov     rax, [rdx + rax*8]
        ret
.none:
        xor     eax, eax
        ret

; rax = a free slot in the process's table, doubling the table when it is full (-1 if no memory).
file_slot:
        sub     rsp, 8
        mov     rdx, [rbx + P_FILES]
        mov     rcx, [rbx + P_NFILES]
        xor     eax, eax
.look:
        cmp     rax, rcx
        jae     .grow
        cmp     qword [rdx + rax*8], 0
        je      .done
        inc     rax
        jmp     .look
.grow:
        mov     [slot_free], rcx        ; the first new slot
        lea     rax, [rcx + rcx]
        test    rax, rax
        jnz     @f
        mov     eax, 1
@@:     mov     [slot_cap], rax
        shl     rax, 3
        invoke  VirtualAlloc, 0, rax, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .fail
        mov     [slot_new], rax
        mov     rdi, rax
        mov     rsi, [rbx + P_FILES]
        mov     rcx, [rbx + P_NFILES]
        rep     movsq
        cmp     qword [rbx + P_FILES], 0
        je      @f
        invoke  VirtualFree, qword [rbx + P_FILES], 0, MEM_RELEASE
@@:     mov     rax, [slot_new]
        mov     [rbx + P_FILES], rax
        mov     rax, [slot_cap]
        mov     [rbx + P_NFILES], rax
        mov     rax, [slot_free]
.done:
        add     rsp, 8
        ret
.fail:
        mov     rax, -1
        jmp     .done

; Closes every file the process in rbx left open.
close_files:
        push    r12
        sub     rsp, 8
        xor     r12d, r12d
.one:
        cmp     r12, [rbx + P_NFILES]
        jae     .done
        mov     rax, [rbx + P_FILES]
        mov     rax, [rax + r12*8]
        test    rax, rax
        jz      .next
        invoke  CloseHandle, rax
        mov     rax, [rbx + P_FILES]
        mov     qword [rax + r12*8], 0
.next:
        inc     r12
        jmp     .one
.done:
        add     rsp, 8
        pop     r12
        ret

; eax = 1 if the rcx bytes at rsi are valid UTF-8 (the standard's rule: no overlong forms, no
; surrogates, nothing above U+10FFFF), else 0.
utf8_ok:
.next:
        test    rcx, rcx
        jz      .yes
        movzx   eax, byte [rsi]
        inc     rsi
        dec     rcx
        cmp     al, 80h
        jb      .next
        cmp     al, 0C2h
        jb      .no
        mov     r8d, 80h                ; range of the second byte
        mov     r9d, 0BFh
        cmp     al, 0E0h
        jae     .three
        mov     edx, 1
        jmp     .tail
.three:
        cmp     al, 0F0h
        jae     .four
        mov     edx, 2
        cmp     al, 0E0h
        jne     @f
        mov     r8d, 0A0h
@@:     cmp     al, 0EDh
        jne     .tail
        mov     r9d, 9Fh
        jmp     .tail
.four:
        cmp     al, 0F5h
        jae     .no
        mov     edx, 3
        cmp     al, 0F0h
        jne     @f
        mov     r8d, 90h
@@:     cmp     al, 0F4h
        jne     .tail
        mov     r9d, 8Fh
.tail:
        cmp     rcx, rdx
        jb      .no
        movzx   eax, byte [rsi]
        cmp     eax, r8d
        jb      .no
        cmp     eax, r9d
        ja      .no
        inc     rsi
        dec     rcx
        dec     edx
.continuation:
        test    edx, edx
        jz      .next
        movzx   eax, byte [rsi]
        cmp     al, 80h
        jb      .no
        cmp     al, 0BFh
        ja      .no
        inc     rsi
        dec     rcx
        dec     edx
        jmp     .continuation
.yes:
        mov     eax, 1
        ret
.no:
        xor     eax, eax
        ret

; ---------------------------------------------------------------- porters
; A tree: the root, one porter per door, and below them microporters with any number of children per
; branch (Capitan: wide branches, so going through the tree stays cheap). A child never has more rights
; than its parent. Checking climbs from the microporter to the root: a revoked porter on the way refuses,
; so revoking one porter takes its whole branch with it at the cost of a single mark.

; rcx = parent (-1 for the root), rdx = rights, r8 = door -> rax = new node. The table doubles when full.
; Keeps rsi, rdi and the callee-saved registers.
new_node:
        push    rsi rdi
        sub     rsp, 8
        mov     [nn_parent], rcx
        mov     [nn_rights], rdx
        mov     [nn_door], r8
        mov     rax, [nnodes]
        cmp     rax, [capnodes]
        jb      .room
        lea     rax, [rax + rax]
        test    rax, rax
        jnz     @f
        mov     eax, 1
@@:     mov     [capnodes], rax
        imul    rax, NODE_SIZE
        invoke  VirtualAlloc, 0, rax, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [nn_new], rax
        mov     rdi, rax
        mov     rsi, [nodes]
        mov     rcx, [nnodes]
        imul    rcx, NODE_SIZE / 8
        rep     movsq
        cmp     qword [nodes], 0
        je      @f
        invoke  VirtualFree, [nodes], 0, MEM_RELEASE
@@:     mov     rax, [nn_new]
        mov     [nodes], rax
.room:
        ; its label prefix (nn_plen bytes at nn_pptr, 0 = none) goes to the prefix pool, which doubles
        mov     qword [nn_poff], 0
        mov     rcx, [nn_plen]
        test    rcx, rcx
        jz      .no_prefix
        mov     rax, [pfx_used]
        add     rax, rcx
        cmp     rax, [pfx_cap]
        jbe     .pool_room
        mov     rdx, [pfx_cap]
        add     rdx, rdx
        cmp     rdx, rax
        jae     @f
        mov     rdx, rax
@@:     mov     [pfx_cap], rdx
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [nn_new], rax
        mov     rdi, rax
        mov     rsi, [pfx_pool]
        mov     rcx, [pfx_used]
        rep     movsb
        cmp     qword [pfx_pool], 0
        je      @f
        invoke  VirtualFree, [pfx_pool], 0, MEM_RELEASE
@@:     mov     rax, [nn_new]
        mov     [pfx_pool], rax
.pool_room:
        mov     rax, [pfx_used]
        mov     [nn_poff], rax
        mov     rdi, [pfx_pool]
        add     rdi, rax
        mov     rsi, [nn_pptr]
        mov     rcx, [nn_plen]
        add     [pfx_used], rcx
        rep     movsb
.no_prefix:
        mov     rax, [nnodes]
        imul    rdx, rax, NODE_SIZE
        add     rdx, [nodes]
        mov     rcx, [nn_parent]
        mov     [rdx + N_PARENT], rcx
        mov     rcx, [nn_rights]
        mov     [rdx + N_RIGHTS], rcx
        mov     qword [rdx + N_ALIVE], 1
        mov     rcx, [nn_door]
        mov     [rdx + N_DOOR], rcx
        mov     rcx, [nn_poff]
        mov     [rdx + N_PREFIX], rcx
        mov     rcx, [nn_plen]
        mov     [rdx + N_PLEN], rcx
        mov     qword [nn_plen], 0      ; the next node has no prefix unless its creator sets one
        inc     qword [nnodes]
        add     rsp, 8
        pop     rdi rsi
        ret

; r8 = node, r9 = rights (any of them is enough) -> r8 = 1 if every porter up to the root is alive and
; has one of them, else 0. Uses r10.
gate_allows:
        cmp     r8, -1
        je      .yes
        cmp     r8, [nnodes]
        jae     .no
        imul    r10, r8, NODE_SIZE
        add     r10, [nodes]
        cmp     qword [r10 + N_ALIVE], 0
        je      .no
        test    [r10 + N_RIGHTS], r9
        jz      .no
        mov     r8, [r10 + N_PARENT]
        jmp     gate_allows
.yes:
        mov     r8d, 1
        ret
.no:
        xor     r8d, r8d
        ret

; r8 = node -> r9 = 1 if it belongs to the process in rbx: climbing from it, every porter is alive and
; the climb reaches the process's own porter for that door (the node itself counts). Uses r10, r11.
mine:
        xor     r9d, r9d
        cmp     r8, [nnodes]
        jae     .done                   ; also catches negative numbers
        imul    r10, r8, NODE_SIZE
        add     r10, [nodes]
        mov     r11, [r10 + N_DOOR]
        test    r11, r11
        jz      .done
        mov     r11, [rbx + P_GATES + r11*8 - 8]
.climb:
        cmp     r8, -1
        je      .done
        imul    r10, r8, NODE_SIZE
        add     r10, [nodes]
        cmp     qword [r10 + N_ALIVE], 0
        je      .done
        cmp     r8, r11
        je      .yes
        mov     r8, [r10 + N_PARENT]
        jmp     .climb
.yes:
        mov     r9d, 1
.done:
        ret

; The four porter requests share one loop: r14 = kind, r15 = entries; the handler gets the entry in r13.
macro serve_gate name, kind, handler {
  name:
          push    r12 r13 r14 r15
          sub     rsp, 8
          xor     r12d, r12d
  .one:
          cmp     r12, r15
          jae     .done
          mov     r13, r12
          shl     r13, 5
          cmp     dword [rbp + r13], kind
          jne     .next
          call    handler
  .next:
          inc     r12
          jmp     .one
  .done:
          add     rsp, 8
          pop     r15 r14 r13 r12
          ret
}

serve_gate serve_cede,    8,  gate_cede
serve_gate serve_use,     9,  gate_use
serve_gate serve_revoke,  10, gate_revoke
serve_gate serve_consult, 11, gate_consult

; 8 cede: a = parent (mine), b = rights -> a new child with b, cut down to what the parent has.
gate_cede:
        mov     r8, [rbp + r13 + 8]
        call    mine
        test    r9d, r9d
        jz      gate_refused
        mov     rcx, [rbp + r13 + 8]
        imul    rax, rcx, NODE_SIZE
        add     rax, [nodes]
        mov     rdx, [rbp + r13 + 16]
        and     rdx, [rax + N_RIGHTS]
        mov     r8, [rax + N_DOOR]
        call    new_node
        mov     [rbp + r13 + 24], rax
        ret

; 9 use: a = node (mine) -> the process works through it from now on (it can only go down).
gate_use:
        mov     r8, [rbp + r13 + 8]
        call    mine
        test    r9d, r9d
        jz      gate_refused
        mov     rcx, [rbp + r13 + 8]
        imul    rax, rcx, NODE_SIZE
        add     rax, [nodes]
        mov     rax, [rax + N_DOOR]
        mov     [rbx + P_GATES + rax*8 - 8], rcx
        mov     qword [rbp + r13 + 24], 0
        ret

; 10 revoke: a = node below the process's own porter -> it and its whole branch stop working.
gate_revoke:
        mov     r8, [rbp + r13 + 8]
        call    mine
        test    r9d, r9d
        jz      gate_refused
        mov     rcx, [rbp + r13 + 8]
        imul    rax, rcx, NODE_SIZE
        add     rax, [nodes]
        mov     rdx, [rax + N_DOOR]
        cmp     rcx, [rbx + P_GATES + rdx*8 - 8]
        je      gate_refused            ; not its own porter: only what hangs below it
        mov     qword [rax + N_ALIVE], 0
        mov     qword [rbp + r13 + 24], 0
        ret

; 11 consult: a = door (1 screen, 2 memory, 3 files) -> the process's porter for it.
gate_consult:
        mov     rax, [rbp + r13 + 8]
        lea     rcx, [rax - 1]
        cmp     rcx, DOORS - 1
        ja      .invalid
        mov     rax, [rbx + P_GATES + rax*8 - 8]
        mov     [rbp + r13 + 24], rax
        ret
.invalid:
        mov     qword [rbp + r13 + 24], -1
        ret

; 15 cede with label: a = parent (mine), b = block {rights qword, length qword, label bytes} -> a child
; that can only touch labels starting with that prefix. The prefix itself has to be a label the parent
; allows, so a child never escapes its parent's prefix.
serve_gate serve_cede_label, 15, gate_cede_label

gate_cede_label:
        mov     r8, [rbp + r13 + 8]
        call    mine
        test    r9d, r9d
        jz      gate_refused
        mov     rax, [rbp + r13 + 16]   ; the block must be inside the cabin
        mov     rcx, [rbx + P_SIZE]
        cmp     rax, rcx
        ja      .invalid
        sub     rcx, rax
        cmp     rcx, 16
        jb      .invalid
        sub     rcx, 16
        mov     rdx, [rbx + P_DATA]
        add     rdx, rax
        mov     rax, [rdx + 8]          ; prefix length
        cmp     rax, rcx
        ja      .invalid
        test    rax, rax
        jz      .invalid
        mov     r9, [rdx]
        mov     [cede_rights], r9
        lea     rsi, [rdx + 16]
        mov     rcx, rax
        push    rsi rdi
        call    normalize_bytes
        pop     rdi rsi
        test    eax, eax
        jz      .invalid
        mov     r8, [rbp + r13 + 8]
        push    rsi rdi
        call    prefix_allows
        pop     rdi rsi
        test    r8d, r8d
        jz      gate_refused
        mov     rcx, [rbp + r13 + 8]
        imul    rax, rcx, NODE_SIZE
        add     rax, [nodes]
        mov     rdx, [cede_rights]
        and     rdx, [rax + N_RIGHTS]
        mov     r8, [rax + N_DOOR]
        lea     rax, [norm_label]
        mov     [nn_pptr], rax
        mov     rax, [norm_len]
        mov     [nn_plen], rax
        call    new_node
        mov     [rbp + r13 + 24], rax
        ret
.invalid:
        mov     qword [rbp + r13 + 24], -1
        ret

gate_refused:
        mov     qword [rbp + r13 + 24], -1
        inc     qword [denied]
        ret

; ---------------------------------------------------------------- output
; "P<n> codigo=<c> j0=<hex> t=<clock>" for the process in rbx
report:
        lea     rdi, [line]
        mov     al, 'P'
        stosb
        mov     rax, [rbx + P_ID]
        call    put_decimal
        mov     rax, ' codigo='
        stosq
        mov     rax, [rbx + P_CODE]
        call    put_decimal
        mov     eax, ' j0='
        stosd
        mov     rax, [rbx + P_REGS]
        mov     ecx, 16
.digit:
        rol     rax, 4
        mov     edx, eax
        and     edx, 15
        mov     dl, [hexdigits + rdx]
        mov     [rdi], dl
        inc     rdi
        dec     ecx
        jnz     .digit
        mov     eax, ' t='
        stosd
        dec     rdi                     ; ' t=' is three characters
        mov     rax, [clock]
        call    put_decimal
        mov     ax, 0A0Dh
        stosw
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
        ret

; Writes rax in decimal at rdi; leaves rdi just past the last digit.
put_decimal:
        mov     ecx, 10
        xor     r8d, r8d
.divide:
        xor     edx, edx
        div     rcx
        add     dl, '0'
        push    rdx
        inc     r8d
        test    rax, rax
        jnz     .divide
.emit:
        pop     rax
        mov     [rdi], al
        inc     rdi
        dec     r8d
        jnz     .emit
        ret

zero_mode:                              ; started by the firmware: not built yet
        hlt
        jmp     zero_mode

no_programs:
fail_args:                              ; also a launch argument that does not parse
        invoke  ExitProcess, 4
fail_file:
        invoke  ExitProcess, 3

code_end:

section '.idata' import data readable writeable

  library kernel32, 'KERNEL32.DLL',\
          normaliz, 'NORMALIZ.DLL'

  import kernel32,\
         GetCommandLineA, 'GetCommandLineA',\
         lstrlenA, 'lstrlenA',\
         CreateFileA, 'CreateFileA',\
         ReadFile, 'ReadFile',\
         CloseHandle, 'CloseHandle',\
         CreateDirectoryA, 'CreateDirectoryA',\
         VirtualAlloc, 'VirtualAlloc',\
         VirtualFree, 'VirtualFree',\
         GetEnvironmentVariableA, 'GetEnvironmentVariableA',\
         GetCurrentThread, 'GetCurrentThread',\
         SetThreadAffinityMask, 'SetThreadAffinityMask',\
         GetThreadPriority, 'GetThreadPriority',\
         SetThreadPriority, 'SetThreadPriority',\
         GetStdHandle, 'GetStdHandle',\
         WriteFile, 'WriteFile',\
         ExitProcess, 'ExitProcess',\
         DeleteFileA, 'DeleteFileA',\
         MoveFileA, 'MoveFileA',\
         FindFirstFileA, 'FindFirstFileA',\
         FindNextFileA, 'FindNextFileA',\
         FindClose, 'FindClose',\
         MultiByteToWideChar, 'MultiByteToWideChar',\
         WideCharToMultiByte, 'WideCharToMultiByte'

  import normaliz,\
         NormalizeString, 'NormalizeString'
