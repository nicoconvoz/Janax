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
; The largest room: its position is the low half of an address. Each room reserves these addresses for itself
; (its drawer, ambientes.inc), which takes no memory, only addresses: with 128 TiB of user addresses it leaves
; room for ~32.000 rooms standing at once, across every cabin (criterion, not a measurement).
ROOM_MAX    = 1 shl 32
OP_COUNT    = 18h
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
P_SIZE   = 200                  ; end of the last room: the cabin grows and shrinks by rooms
P_FILES  = 208                  ; table of host file handles (0 = free slot)
P_NFILES = 216                  ; slots in that table
P_GATES  = 224                  ; the process's porter for each door (3 nodes)
P_ID     = 248                  ; process number (P0, P1...)
P_PARENT = 256                  ; parent process, 0 = the kernel
P_WAITING = 264                 ; important requests waiting for the parent's signature
P_SHADOW = 272                  ; 1 = ended, its shadow decides for its line; 2 = shadow gone
P_TABLE  = 280                  ; its program decoded once into routines (rutinas.inc), shared by every process with the same words
P_ROOMS  = 288                  ; its rooms {start, end} in address order (ambientes.inc), 0 = only the first
P_NROOMS = 296
P_ROOMCAP = 304
P_LIM8   = 312                  ; an 8-byte access to room 0 below this needs no translation (ambientes.inc)
P_LIM1   = 320                  ; the same for a 1-byte access: room 0's size
P_RETCAP = 328                  ; return stack entries committed: it grows with the calls (ambientes.inc)
P_INIT   = 336                  ; its initial data (the file X.datos next to X), copied into room 0 at the first order
P_INITLEN = 344
P_HELPER = 352                  ; 1 = a kernel helper (ayudantes.inc): it runs again, so it keeps its return stack
P_BUDGET0 = 360                 ; the turn it was given (the engines count down from it)
P_SYSRD  = 368                  ; jsys: where its answer goes (rd * 8), kept per cabin
P_SYSQ   = 376                  ; jsys: its queue address
P_SAVERSP = 384                 ; ret_grow / ret_trim: the stack they came with
P_RUNNING = 392                 ; 1 = a rower is running it (remos.inc)
P_TAIL   = 400                  ; per word, instructions to its jhalt by the straight way (remos.inc)
P_CUT    = 408                  ; 1 = its turn was cut by an event (no stretching to the end)
P_NEXT   = 416                  ; the next one in the line of cabins (remos.inc)
P_PRIO   = 424                  ; its priority, in 65536ths: the fraction of its time for real work
P_QUANTUM = 432                 ; its turn, from its priority (ayudantes.inc)
P_QUEUED = 440                  ; 1 = it is in the line
P_PRIO_TOP = 448                ; the highest bolita it may ask for: the one it was launched with
P_BLOCKS = 456                  ; requests of others waiting for its signature: how many it holds (remos.inc)
P_PREV   = 464                  ; the one before it in the line of cabins (remos.inc)
P_ROOMBASE = 472                ; the number before its table's first room: entry k (k >= 1) is room base + k (ambientes.inc)
P_NEXTROOM = 480                ; the number its next room gets (0 = 1: none built yet)
P_ROOM0  = 488                  ; 1 = its first order built room 0 (ambientes.inc)
P_DOWRY  = 496                  ; boxes its next child is born with (ambientes.inc, DOWRY_SIZE each), 0 = none
P_NDOWRY = 504
P_ARRIVED = 512                 ; addresses of the boxes that moved or were linked to it, in order of arrival
P_NARRIVED = 520
P_TAKEN  = 528                  ; how many of them it has received
P_PARTNER = 536                 ; the cabin it associates with for its next child (0 = none)
P_ASSOC  = 544                  ; which part of the two cartels: 0 shared, 1 mine only, 2 its only, 3 both
P_GREET  = 552                  ; who greeted it and was not taken yet: one per family member, as many as greet
P_NGREET = 560
P_GWAIT  = 568                  ; 1 = it waits for a greeting, 2 = nobody is left who could greet it
PROC_SIZE = 576

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
  mp_prio   dq 0                ; its bolita (it can never ask for more)
  mp_pfx_ptr dq 0
  mp_pfx_len dq 0
  mp_new    dq 0
  nprocs    dq 0
  load_buf  dq 0                  ; every program is read here first (program_buffer)
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
  KINDS     = 29                ; write, grow, destroy, open, read, write to file, close, cede, use, revoke,
                                ; consult, delete, rename, list, cede with label, launch, sign, pending, state, bolita,
                                ; treat a box, dowry, move, link, receive, fuse, associate,
                                ; greet, wait for a greeting
  requests  dq 0
  hostcalls dq 0
  retunes   dq 0
  nscreens  dq 0
  tune      dq KINDS dup 0      ; the kind each screen is tuned to
  busy      db KINDS dup 0      ; screens that got requests this round
  present   db KINDS + 1 dup 0  ; kinds present this round (index = kind)
  sys_rd    dq 0
  queue_addr dq 0
  page_size dq 0                  ; the part the host delivers memory in (GetSystemInfo)
  dead_drawer dq 0                ; addresses reserved and never given: a destroyed room points here (ambientes.inc)
  sysinfo   rb 48
  rooms_new dq 0
  rooms_newcap dq 0
  rooms_number dq 0
  list_new  dq 0                  ; list_slot: the list made bigger (ambientes.inc)
  pass_slot dq 4 dup 0            ; rooms_pass: the box as it travels
  pass_addr dq 0
  fuse_addr dq 0                  ; rooms_fuse: the new room
  add_place dq 0                  ; room_add: the new room (ambientes.inc)
  add_size  dq 0
  add_key   dq 0
  add_box   dq 0
  box_count dq 0                  ; boxes made so far: a box's number is never given again
  ret_rsp   dq 0                  ; ret_grow / ret_trim: the stack they came with
  queue_end dq 0
  wtotal    dq 0
  wbuf      dq 0
  t_screens db 'ventanilla: pantallas=', 0
  t_retunes db ' resintonias=', 0
  t_host    db ' llamadas al anfitrion=', 0
  t_reqs    db ' pedidos=', 0
  serve_table dq serve_write, serve_grow, serve_destroy, serve_open, serve_fread, serve_fwrite, serve_close
              dq serve_cede, serve_use, serve_revoke, serve_consult, serve_delete, serve_rename, serve_list
              dq serve_cede_label, serve_launch, serve_sign, serve_pending, serve_state, serve_bolita
              dq serve_treat, serve_dowry, serve_move, serve_link, serve_receive, serve_fuse, serve_assoc
              dq serve_greet, serve_greeting
  ; door and right each kind needs (index = kind; door 0 = answers to the tree rules instead)
  ;              -  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29
  kind_door  db 0, 1, 2, 2, 3, 3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 0, 3, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0
  kind_right db 0, R_SCREEN, R_MEM, R_MEM, R_READ + R_WRITE, R_READ, R_WRITE, 0, 0, 0, 0, 0, R_WRITE, R_WRITE, R_READ, 0
             db R_READ, 0, 0, 0, 0, R_MEM, R_MEM, R_MEM, R_MEM, R_MEM, R_MEM, R_MEM, 0, 0
  assert $ - kind_right = KINDS + 1
  ; important = it changes a process, a file or the system (Capitan): a child's needs its parent's signature
  kind_important db 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0
  assert $ - kind_important = KINDS + 1
  ; requests waiting for a signature
  REC_SIZE  = 40
  R_CHILD   = 0
  R_INDEX   = 8
  R_KIND    = 16
  R_SIGNER  = 24                ; the parent process that has to sign (0 = the kernel)
  R_STATE   = 32                ; 0 waiting, 1 signed, 2 rejected, 3 used
  REC_USED  = 3
  recs      dq 0
  nrecs     dq 0
  caprecs   dq 0
  nr_index  dq 0
  nr_kind   dq 0
  nr_new    dq 0
  must_wait dq 0
  asleep    dq 0
  sched_dirty db 0
  ; porters
  nodes     dq 0
  nnodes    dq 0
  capnodes  dq 0
  denied    dq 0
  launch_rights dq 0
  launch_prio dq 0              ; program!fraction: its bolita
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
  data_path db HOST_PATH + 8 dup 0  ; the host path of a program's data file
  data_count db 0                  ; read_data: 1 = its host calls count in the window's report
  DATA_LABEL = 512                 ; a label and its ".datos" (labels are checked against their own limits first)
  data_label db DATA_LABEL dup 0
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
  align 8
  kern_lock   rb 40               ; the captain's lock (a CRITICAL_SECTION, remos.inc)
  kern_change dq 0                ; rowers asleep wait on it (a CONDITION_VARIABLE)
  kern_special dq 0               ; the special rower asleep waits on it (a CONDITION_VARIABLE)
  finished    db 0                ; 1 = every cabin has ended: the rowers go home
  align 8
  vain_wakes  dq 0                ; rowers woken that found nothing to do (the instrument)
  nat_entries dq 0                ; the translated engine (nativo.inc): the entries while it translates,
  nat_native  dq 0                ; and how many instructions of the programs became native code
  native_progs  dq 0              ; every translated program, for the fault handler (nativo.inc)
  native_nprogs dq 0
  nat_total   dq 0
  nat_count   dq 16 dup 0         ; (while translating) the uses of each Janax register,
  nat_cache   db 16 dup 0         ; the cache register each one lives in (-1: memory only),
  nat_creg    db 4 dup 0          ; and the Janax register * 8 in each cache register (-1: none)
  t_native    db 'nativo: ', 0
  t_native_of db ' de ', 0
  t_native_end db ' instrucciones', 0
  asleep_line dq 0                ; line rowers asleep (a waker takes one off when it wakes one)
  special_asleep dq 0             ; 1 = the special rower is asleep
  held        dq 0                ; requests waiting for a signature, in all
  t_rowers    db 'remeros: ', 0
  t_vain      db ', despertares en vano=', 0
  rowing      dq 0                ; cabins being rowed right now
  remos       dq 1                ; how many rowers
  remos_env   db 'JANAX_REMOS', 0
  STACK_SIZE_PARAM_IS_A_RESERVATION = 10000h
  plan_default: file 'pdp/semilla/planificador.bin'   ; the factory planner (ayudantes.inc)
  PLAN_DEFAULT_WORDS = ($ - plan_default) / 4
  plan_label db 'PDP/so/nucleo/planificador.bin'
  PLAN_LABEL_LEN = $ - plan_label
  plan_text  db 'planificador: el de PDP', 13, 10
  PLAN_TEXT_LEN = $ - plan_text
  plan_fail_text db 'planificador: el de PDP fallo, vuelve el de fabrica', 13, 10
  PLAN_FAIL_LEN = $ - plan_fail_text
  align 8
  plan_prog  dq 0
  plan_words dq 0
  plan_proc  dq 0
  plan_c16   dq 0               ; the cost of a switch in sixteenths of an instruction, for the planner
  plan_d     dq 0
  plan_s     dq 0
  plan_rsp   dq 0
  plan_cabin dq 0               ; plan_quantum: the cabin whose turn it computes
  tail_limit dq 0               ; the longest last part a cabin finishes instead of passing the oar
  q_head     dq 0               ; the line of cabins waiting for an oar, in the order they arrived
  q_tail     dq 0
  PRIO_DEFAULT = 64881          ; 0.99 (of 65536): a cabin that says nothing loses 1 % of its time switching
  plan_own   db 0               ; 1 = the planner came from PDP
  align 8
  sixteen    dq 16.0
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

  ; calibration program: a while of j1 laps of 2 instructions (jsub / its condition); the kernel sets j1
  CALIB_LOOPS = 200000h         ; criterion: ~4 M instructions alone, so a clock speed change weighs little
  CALIB_PROBE = CALIB_LOOPS / 64 ; a short run of the pair, to learn how long it takes
  CALIB_TWO_SCALE = 10          ; the pair runs about as long as 10 runs alone: the length of the pair that
                                ; gave steady medians (1.17-1.64) when a switch cost ~8 instructions. The
                                ; error of c is the noise over that length, whatever a switch costs.
  calib_loops dq CALIB_LOOPS
  calib_loops_two dq CALIB_LOOPS
  calib_prog dd 01h or (2 shl 8) or (1 shl 16)                             ; jldi j2, 1
             dd 0Ch or (1 shl 16)                                          ; jwhile j1: jjmp check
             dd 03h or (1 shl 8) or (1 shl 12) or (2 shl 16)               ; body: jsub j1, j1, j2
             dd 0Eh or (1 shl 8) or ((-2 and 0FFFFh) shl 16)               ; jwend: check: jjnz j1, body
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
            dq op_ld, op_st, op_ldb, op_stb, op_call, op_ret, op_sys, op_jhost
  ttable    dq t_halt, t_ldi, t_add, t_sub, t_mul, t_div, t_shl, t_shr
            dq t_sar, t_and, t_or, t_xor, t_jmp, t_jz, t_jnz, t_shi
            dq t_ld, t_st, t_ldb, t_stb, t_call, t_ret, t_sys, t_jhost
  assert ($ - ttable) = OP_COUNT * 8
  ; the same instruction fused with the jjz / jjnz after it (0: it cannot be fused)
  ftable_jz  dq 0, t_ldi_jz, t_add_jz, t_sub_jz, t_mul_jz, t_div_jz, t_shl_jz, t_shr_jz
             dq t_sar_jz, t_and_jz, t_or_jz, t_xor_jz, 0, 0, 0, t_shi_jz
             dq t_ld_jz, t_st_jz, t_ldb_jz, t_stb_jz, 0, 0, 0, 0
  assert ($ - ftable_jz) = OP_COUNT * 8
  ftable_jnz dq 0, t_ldi_jnz, t_add_jnz, t_sub_jnz, t_mul_jnz, t_div_jnz, t_shl_jnz, t_shr_jnz
             dq t_sar_jnz, t_and_jnz, t_or_jnz, t_xor_jnz, 0, 0, 0, t_shi_jnz
             dq t_ld_jnz, t_st_jnz, t_ldb_jnz, t_stb_jnz, 0, 0, 0, 0
  assert ($ - ftable_jnz) = OP_COUNT * 8

  ; engine: 2 = the routines translated to native code (nativo.inc, the default), 1 = the routines (each
  ; program decoded once), 0 = the interpreter, kept as the reference. JANAX_MOTOR names it; an unknown name
  ; starts nothing.
  motor      db 2
  motor_env  db 'JANAX_MOTOR', 0
  motor_names db 'interprete', 0, 'rutinas', 0, 'traductor', 0, 0
  calib_table dq 0

section '.idata' import data readable writeable

  library kernel32, 'KERNEL32.DLL',\
          kernelbase, 'KERNELBASE.DLL',\
          normaliz, 'NORMALIZ.DLL'

  import kernel32,\
         GetCommandLineA, 'GetCommandLineA',\
         lstrlenA, 'lstrlenA',\
         CreateFileA, 'CreateFileA',\
         ReadFile, 'ReadFile',\
         CreateFileMappingA, 'CreateFileMappingA',\
         DuplicateHandle, 'DuplicateHandle',\
         CloseHandle, 'CloseHandle',\
         CreateDirectoryA, 'CreateDirectoryA',\
         InitializeCriticalSection, 'InitializeCriticalSection',\
         EnterCriticalSection, 'EnterCriticalSection',\
         LeaveCriticalSection, 'LeaveCriticalSection',\
         SleepConditionVariableCS, 'SleepConditionVariableCS',\
         WakeAllConditionVariable, 'WakeAllConditionVariable',\
         WakeConditionVariable, 'WakeConditionVariable',\
         CreateThread, 'CreateThread',\
         WaitForSingleObject, 'WaitForSingleObject',\
         GetSystemInfo, 'GetSystemInfo',\
         VirtualAlloc, 'VirtualAlloc',\
         VirtualFree, 'VirtualFree',\
         VirtualProtect, 'VirtualProtect',\
         AddVectoredExceptionHandler, 'AddVectoredExceptionHandler',\
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

  import kernelbase,\
         VirtualAlloc2, 'VirtualAlloc2',\
         MapViewOfFile3, 'MapViewOfFile3',\
         UnmapViewOfFile2, 'UnmapViewOfFile2'

  import normaliz,\
         NormalizeString, 'NormalizeString'

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
        invoke  GetSystemInfo, sysinfo
        mov     eax, dword [sysinfo + 4] ; dwPageSize
        mov     [page_size], rax
        mov     rdx, ROOM_MAX           ; the dead drawer: every position of a room, refused
        add     rdx, rax
        invoke  VirtualAlloc, 0, rdx, MEM_RESERVE, PAGE_NOACCESS
        test    rax, rax
        jz      fail_file
        mov     [dead_drawer], rax
        invoke  VirtualAlloc, 0, NP_MAX * NP_SIZE, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [native_progs], rax
        invoke  AddVectoredExceptionHandler, 1, native_fault   ; the wall of the rooms (nativo.inc)
        invoke  InitializeCriticalSection, kern_lock
        mov     eax, dword [sysinfo + 32] ; dwNumberOfProcessors: one rower per core
        mov     [remos], rax
        invoke  GetEnvironmentVariableA, remos_env, env_value, 31   ; JANAX_REMOS: how many rowers
        test    eax, eax
        jz      .rowers_known
        xor     eax, eax
        lea     rsi, [env_value]
        jmp     .rower_digit
.rower_digit_lap:
        imul    rax, 10
        add     rax, rcx
        inc     rsi
.rower_digit:                           ; while the character is a digit
        movzx   ecx, byte [rsi]
        sub     ecx, '0'
        cmp     ecx, 9
        jbe     .rower_digit_lap
        test    rax, rax
        jnz     @f
        inc     eax                     ; at least one rower
@@:     mov     [remos], rax
.rowers_known:

        ; --- engine: JANAX_MOTOR = interprete (0), rutinas (1) or traductor (2, without it) ---
        invoke  GetEnvironmentVariableA, motor_env, env_value, 31
        test    eax, eax
        jz      .motor_known
        cmp     eax, 31
        jae     fail_args
        mov     byte [env_value + rax], 0
        lea     rdi, [motor_names]
        xor     edx, edx                ; the engine number of the name at rdi
        jmp     .motor_name
.motor_name_lap:
        lea     rsi, [env_value]
        mov     rcx, rdi
        jmp     .motor_char
.motor_char_lap:
        inc     rsi
        inc     rcx
.motor_char:                            ; while both names go on the same
        mov     al, [rsi]
        cmp     al, [rcx]
        jne     .motor_other
        test    al, al
        jnz     .motor_char_lap
        mov     [motor], dl             ; this one
        jmp     .motor_known
.motor_other:                           ; the next name: past the end of this one
        jmp     .motor_skip
.motor_skip_lap:
        inc     rcx
.motor_skip:                            ; while this name goes on
        cmp     byte [rcx], 0
        jne     .motor_skip_lap
        lea     rdi, [rcx + 1]
        inc     edx
.motor_name:                            ; while there are names left
        cmp     byte [rdi], 0
        jne     .motor_name_lap
        jmp     fail_args               ; a name it does not know
.motor_known:
        call    plan_load               ; the scheduler, in Janax: from PDP or the factory one

        ; --- cost of a switch: fixed by JANAX_CAMBIO, remembered from an earlier boot, or measured ---
        invoke  GetEnvironmentVariableA, env_name, env_value, 31
        test    eax, eax
        jz      .measure
        xor     eax, eax                ; decimal digits
        lea     rsi, [env_value]
        jmp     .digit
.digit_lap:
        imul    rax, 10
        add     rax, rcx
        inc     rsi
.digit:                                 ; while the character is a digit
        movzx   ecx, byte [rsi]
        sub     ecx, '0'
        cmp     ecx, 9
        jbe     .digit_lap
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
        movsd   xmm0, [swcost]
        mulsd   xmm0, [sixteen]
        cvtsd2si rax, xmm0              ; c in sixteenths of an instruction, rounded
        mov     [plan_c16], rax
        add     rax, 15
        shr     rax, 4
        mov     [tail_limit], rax       ; a switch, in whole instructions: a last part this short is finished

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
        jmp     .copy
.copy_lap:
.copy:                                  ; while the copied byte is not the end
        lodsb
        stosb
        test    al, al
        jnz     .copy_lap

        ; skip the program name (maybe quoted)
        mov     rsi, [cmdline]
        cmp     byte [rsi], '"'
        jne     .unquoted_start
        inc     rsi
        jmp     .quoted
.quoted_lap:
        cmp     al, '"'
        je      .count
.quoted:                                ; while the closing quote has not come
        lodsb
        test    al, al
        jnz     .quoted_lap
        jmp     no_programs
.unquoted_start:
        jmp     .unquoted
.unquoted_lap:
        cmp     al, ' '
        je      .count
        inc     rsi
.unquoted:                              ; while the name goes on
        mov     al, [rsi]
        test    al, al
        jnz     .unquoted_lap
        jmp     no_programs

        ; count the programs and cut each path with a zero: while there is text, skip spaces (cutting)
        ; or walk a token (counting it)
.count:
        mov     r12, rsi                ; first argument area
        xor     ebx, ebx
        jmp     .scan_args
.scan_args_lap:
        cmp     al, ' '
        jne     .in_token
        mov     byte [rsi], 0           ; a space: cut here
        inc     rsi
        jmp     .scan_args
.in_token:
        inc     rbx                     ; a token: count it and walk to its end
        jmp     .token_end
.token_end_lap:
        inc     rsi
.token_end:                             ; while inside the token
        mov     al, [rsi]
        cmp     al, ' '
        je      .scan_args
        test    al, al
        jnz     .token_end_lap
.scan_args:                             ; while there is text
        mov     al, [rsi]
        test    al, al
        jnz     .scan_args_lap
.counted:
        test    rbx, rbx
        jz      no_programs
        mov     [nargs], rbx

        ; --- one cabin per program, all of them children of the kernel ---
        mov     rsi, r12
        xor     r13, r13                ; argument number
        jmp     .load
.load_lap:
        jmp     .find
.find_lap:
        inc     rsi
.find:                                  ; while between paths (the cuts)
        cmp     byte [rsi], 0
        je      .find_lap
.path:
        mov     r14, rsi                ; this path
        mov     qword [launch_rights], R_ALL   ; no "@": every permission
        mov     qword [launch_pfx_len], 0      ; and no label prefix
        mov     qword [launch_prio], PRIO_DEFAULT   ; and no "!": the bolita of a cabin that says nothing
        jmp     .path_end
.path_end_lap:
        cmp     al, '@'
        je      .permissions
        inc     rsi
        cmp     al, '!'
        jne     .path_end
        mov     byte [rsi - 1], 0       ; program.bin!0.5: its bolita, from 0 to 1 (also after the permissions)
        call    read_bolita
        jc      fail_args
        mov     [launch_prio], rax
        cmp     byte [rsi], 0
        je      .path_end
        cmp     byte [rsi], '@'
        jne     fail_args               ; nothing else may follow it but the permissions
.path_end:                              ; while the path goes on
        mov     al, [rsi]
        test    al, al
        jnz     .path_end_lap
        jmp     .open
.permissions:                           ; program.bin@pmlg: p screen, m memory, l read files, g write files
        mov     byte [rsi], 0
        inc     rsi
        mov     qword [launch_rights], 0
        jmp     .letter
.letter_lap:
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
        cmp     al, '!'
        jne     @f
        call    read_bolita
        jc      fail_args
        mov     [launch_prio], rax
        jmp     .letter
@@:     cmp     al, ':'
        je      .prefix
        jmp     .letter
.grant:
        or      [launch_rights], rdx
.letter:                                ; while there are permission letters
        mov     al, [rsi]
        test    al, al
        jnz     .letter_lap
        jmp     .open
.prefix:                                ; @...:hex = a label prefix for files (hex: the command line has no emojis)
        lea     rdi, [launch_raw]
        xor     ecx, ecx
        jmp     .prefix_pair
.prefix_pair_lap:
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
.prefix_pair:                           ; while there are hex pairs
        movzx   eax, byte [rsi]
        test    eax, eax
        jnz     .prefix_pair_lap
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
        call    program_buffer
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
        mov     rax, [launch_prio]
        mov     [mp_prio], rax
        lea     rax, [launch_pfx]
        mov     [mp_pfx_ptr], rax
        mov     rax, [launch_pfx_len]
        mov     [mp_pfx_len], rax
        call    make_process
        push    rsi                     ; the command line walk goes on from here
        sub     rsp, 8
        mov     rbx, rax
        mov     rsi, r14                ; its data: the file next to it
        xor     ecx, ecx
        jmp     .name_end
.name_end_lap:
        inc     rcx
.name_end:                              ; while the path goes on
        cmp     byte [rsi + rcx], 0
        jne     .name_end_lap
        lea     rdi, [data_path]
        mov     edx, HOST_PATH
        call    data_name
        cmp     rcx, -1
        je      .no_data
        mov     byte [data_count], 0
        call    read_data
        mov     [rbx + P_INIT], rax
        mov     [rbx + P_INITLEN], rcx
.no_data:
        add     rsp, 8
        pop     rsi
        inc     r13
.load:                                  ; while there are arguments left
        cmp     r13, [nargs]
        jb      .load_lap
.loaded:

        call    row                     ; the rowers: one per core, each rowing its cabins (remos.inc)
        cmp     qword [remos], 1
        je      .rowers_said
        lea     rdi, [line]             ; "remeros: .., despertares en vano=.."
        lea     rsi, [t_rowers]
        call    put_text
        mov     rax, [remos]
        call    put_decimal
        lea     rsi, [t_vain]
        call    put_text
        mov     rax, [vain_wakes]
        call    put_decimal
        mov     word [rdi], 0A0Dh
        add     rdi, 2
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
.rowers_said:
        cmp     byte [motor], 2
        jne     .native_said
        lea     rdi, [line]             ; "nativo: N de M instrucciones"
        lea     rsi, [t_native]
        call    put_text
        mov     rax, [nat_native]
        call    put_decimal
        lea     rsi, [t_native_of]
        call    put_text
        mov     rax, [nat_total]
        call    put_decimal
        lea     rsi, [t_native_end]
        call    put_text
        mov     word [rdi], 0A0Dh
        add     rdi, 2
        lea     rax, [line]
        sub     rdi, rax
        invoke  WriteFile, [hout], line, rdi, written, 0
.native_said:
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

; rsi = the text after "!": a fraction from 0 to 1 ("0.5", ".25", "1", up to 9 decimals) -> rax = it in
; 65536ths, rounded to the nearest; rsi past it. CF = 1 if it is not one. Keeps every other register.
read_bolita:
        push    rcx rdx r8
        xor     r8d, r8d                ; its digits, as a whole number
        mov     ecx, 1                  ; 10 to the number of decimals
        movzx   eax, byte [rsi]
        cmp     al, '.'
        je      .point
        sub     eax, '0'
        cmp     eax, 1
        ja      .bad                    ; the whole part is 0 or 1
        mov     r8, rax
        inc     rsi
        cmp     byte [rsi], '.'
        jne     .whole
.point:
        inc     rsi
        jmp     .decimal
.decimal_lap:
        imul    r8, r8, 10
        add     r8, rax
        imul    rcx, rcx, 10
        cmp     rcx, 1000000000
        ja      .bad
        inc     rsi
.decimal:                               ; while there are decimals
        movzx   eax, byte [rsi]
        sub     eax, '0'
        cmp     eax, 9
        jbe     .decimal_lap
.whole:
        mov     rax, r8                 ; (digits * 65536 + 10^n / 2) / 10^n
        shl     rax, 16
        mov     rdx, rcx
        shr     rdx, 1
        add     rax, rdx
        xor     edx, edx
        div     rcx
        cmp     rax, 10000h
        ja      .bad                    ; more than 1
        pop     r8 rdx rcx
        clc
        ret
.bad:
        pop     r8 rdx rcx
        stc
        ret

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
        jmp     .char
.char_lap:
        stosb
.char:                                  ; while the character is not the end
        lodsb
        test    al, al
        jnz     .char_lap
        ret

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
        call    share_program
        mov     rax, [mp_parent]
        mov     [rbx + P_PARENT], rax
        mov     rax, [dead_drawer]      ; no room yet: room 0 is built by its first order
        mov     [rbx + P_DATA], rax
        invoke  VirtualAlloc, 0, RET_DEPTH * 8, MEM_RESERVE, PAGE_READWRITE   ; addresses only: it grows with the calls
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_RET], rax
        ; born without memory: its first order builds room 0 (rooms_first)
        mov     r15d, 1                 ; one microporter per door
        jmp     .gate
.gate_lap:
        mov     rcx, r15               ; the kernel's children hang from the door porters (node = door)
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
.gate:                                  ; while there are doors left
        cmp     r15d, DOORS
        jbe     .gate_lap
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
        mov     rax, [mp_prio]
        mov     [rbx + P_PRIO], rax
        mov     [rbx + P_PRIO_TOP], rax
        call    plan_quantum            ; its turn, once
        call    rooms_born              ; born with its mother's dowry, before any rower can take it
        mov     rax, rbx
        call    q_push_wake                  ; and it waits for an oar like everyone
        mov     rax, rbx
        pop     r15 r14 r13 r12 rdi rsi rbx
        ret

; -> rax = the loading buffer every program is read into (MAX_PROGRAM, made once), 0 if there is no memory.
program_buffer:
        mov     rax, [load_buf]
        test    rax, rax
        jnz     .done
        sub     rsp, 8
        invoke  VirtualAlloc, 0, MAX_PROGRAM, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        add     rsp, 8
        mov     [load_buf], rax
.done:
        ret

; Gives the process in rbx its program, read into the loading buffer (mp_prog): the one of an earlier process
; with exactly the same words if there is one, or a copy of exactly its size (what it weighs, not MAX_PROGRAM). The same words decode to the same table, which never changes
; while running, so copies share program and table: launching one more copy reads and decodes nothing new.
; With the routines the table is made here, at birth. Keeps rbx, r13-r15.
share_program:
        sub     rsp, 8
        xor     r12d, r12d              ; process index
        jmp     .other
.other_lap:
        mov     rdx, [procs]
        mov     rdx, [rdx + r12*8]
        inc     r12
        mov     rcx, [mp_words]
        cmp     rcx, [rdx + P_NWORDS]
        jne     .other
        mov     rsi, [mp_prog]
        mov     rdi, [rdx + P_PROG]
        xor     eax, eax                ; ZF = 1: two empty programs are the same
        repe    cmpsd
        jne     .other
.found:
        mov     rax, [rdx + P_PROG]
        mov     [rbx + P_PROG], rax
        mov     rax, [rdx + P_NWORDS]
        mov     [rbx + P_NWORDS], rax
        mov     rax, [rdx + P_TABLE]
        mov     [rbx + P_TABLE], rax
        mov     rax, [rdx + P_TAIL]
        mov     [rbx + P_TAIL], rax
        add     rsp, 8
        ret
.other:                                 ; while there are earlier processes to compare with
        cmp     r12, [nprocs]
        jb      .other_lap
.alone:
        mov     rdx, [mp_words]
        shl     rdx, 2
        jnz     @f
        mov     edx, 4                  ; an empty program still gets an address
@@:     invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_PROG], rax
        mov     rdi, rax
        mov     rsi, [mp_prog]
        mov     rcx, [mp_words]
        mov     [rbx + P_NWORDS], rcx
        rep     movsd
        call    end_table               ; its last part, once (remos.inc)
        mov     rax, [rbx + P_PROG]
        mov     rcx, [mp_words]
        cmp     byte [motor], 0
        je      .done                   ; the interpreter reads the words as they are
        mov     rdx, rax
        call    prepare_program
        test    rax, rax
        jz      fail_file
        mov     [rbx + P_TABLE], rax
        cmp     byte [motor], 2
        jne     .done
        add     [nat_native], rcx       ; nativo: N de M
        mov     rax, [mp_words]
        add     [nat_total], rax
.done:
        add     rsp, 8
        ret

; ---------------------------------------------------------------- scheduler
; Runs every process in [procs] until all of them end. Least attained service; the turn comes from
; the priority gap and the switch cost (see the header).
; While someone can run or waits for a signature: give a turn to the least served one, or, if all of
; them wait for a signature nobody can give, answer those.
; The scheduler (the rowers that run the cabins): remos.inc.

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
        call    calib_one
        mov     [cycles_one], rax       ; how long a run alone takes
        mov     qword [calib_loops_two], CALIB_PROBE
        call    calib_two
        mov     rcx, rax                ; how long a short run of the pair takes
        test    rcx, rcx
        jnz     @f
        inc     rcx
@@:     mov     rax, [cycles_one]       ; laps of the pair = probe * (scale * alone) / probe time
        imul    rax, rax, CALIB_TWO_SCALE * CALIB_PROBE
        xor     edx, edx
        div     rcx
        cmp     rax, CALIB_PROBE
        jae     @f
        mov     eax, CALIB_PROBE
@@:     cmp     rax, CALIB_LOOPS
        jbe     @f
        mov     eax, CALIB_LOOPS
@@:     mov     [calib_loops_two], rax
        mov     qword [rounds], 0       ; in memory: run_process uses every register
        jmp     .pair
.pair_lap:
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
.pair:                                  ; while pairs are missing
        cmp     qword [rounds], CALIB_PAIRS
        jb      .pair_lap
        ; median: sort the pairs (insertion sort) and take the middle one
        mov     ecx, 1
        jmp     .sort
.sort_lap:
        movsd   xmm0, [pair_c + rcx*8]
        mov     edx, ecx
        jmp     .shift
.shift_lap:
        movsd   [pair_c + rdx*8], xmm1
        dec     edx
.shift:                                 ; while the one on the left is bigger
        test    edx, edx
        jz      .place
        movsd   xmm1, [pair_c + rdx*8 - 8]
        comisd  xmm1, xmm0
        ja      .shift_lap
.place:
        movsd   [pair_c + rdx*8], xmm0
        inc     ecx
.sort:                                  ; while pairs are unsorted
        cmp     ecx, CALIB_PAIRS
        jb      .sort_lap
.sorted:
        invoke  GetEnvironmentVariableA, calib_env, env_value, 31   ; JANAX_CALIBRACION: show every pair
        test    eax, eax
        jz      .median
        lea     rdi, [line]
        lea     rsi, [calib_text]
        call    put_text
        mov     qword [rounds], 0
        jmp     .show
.show_lap:
        mov     byte [rdi], ' '
        inc     rdi
        mov     rax, [rounds]
        movsd   xmm0, [pair_c + rax*8]
        call    put_hundredths
        inc     qword [rounds]
.show:                                  ; while pairs are left to show
        cmp     qword [rounds], CALIB_PAIRS
        jb      .show_lap
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
        jmp     .fnv
.fnv_lap:
        movzx   ecx, byte [rsi]
        xor     eax, ecx
        imul    eax, eax, 01000193h
        inc     rsi
.fnv:                                   ; while there is code left
        cmp     rsi, rdx
        jb      .fnv_lap
        movzx   ecx, byte [motor]       ; the cost is in instructions, and each engine runs them at its pace
        xor     eax, ecx
        imul    eax, eax, 01000193h
        mov     rsi, [plan_prog]        ; and the planner: deciding a turn is part of a switch
        mov     rdx, [plan_words]
        lea     rdx, [rsi + rdx*4]
        jmp     .plan
.plan_lap:
        movzx   ecx, byte [rsi]
        xor     eax, ecx
        imul    eax, eax, 01000193h
        inc     rsi
.plan:                                  ; while planner bytes are left
        cmp     rsi, rdx
        jb      .plan_lap
        mov     dword [cost_rec], eax
        lea     rdi, [cost_rec + 4]
        mov     eax, 80000000h          ; the processor name, if it has one
        cpuid
        cmp     eax, 80000004h
        jb      .done
        mov     esi, 80000002h
        jmp     .leaf
.leaf_lap:
        mov     eax, esi
        cpuid
        mov     [rdi], eax
        mov     [rdi + 4], ebx
        mov     [rdi + 8], ecx
        mov     [rdi + 12], edx
        add     rdi, 16
        inc     esi
.leaf:                                  ; while name leaves are left
        cmp     esi, 80000004h
        jbe     .leaf_lap
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
        mov     qword [calib_loops], CALIB_LOOPS
        jmp     calib_run
calib_two:
        mov     qword [nprocs], 2
        mov     rax, [calib_loops_two]
        mov     [calib_loops], rax
calib_run:
        call    calib_reset
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        mov     [tsc_start], rax
        mov     ecx, ROW_LINE           ; one rower, the line alone
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
        mov     rax, [calib_table]      ; decoded once for every calibration run
        test    rax, rax
        jnz     @f
        mov     ecx, CALIB_WORDS
        lea     rdx, [calib_prog]
        call    prepare_program
        test    rax, rax
        jz      fail_file
        mov     [calib_table], rax
@@:     lea     rdi, [calib_procs]
        mov     [rdi + P_TABLE], rax
        mov     [rdi + PROC_SIZE + P_TABLE], rax
        mov     rax, [calib_loops]
        mov     [rdi + P_REGS + 1*8], rax
        mov     [rdi + PROC_SIZE + P_REGS + 1*8], rax
        mov     rax, FOREVER            ; alone: it rows without a single switch (what a switch costs is
        cmp     qword [nprocs], 2       ; measured against that)
        jb      @f
        mov     eax, 1                  ; the pair: turns of one instruction, as many switches as there can be
@@:     mov     [rdi + P_QUANTUM], rax
        mov     [rdi + PROC_SIZE + P_QUANTUM], rax
        mov     byte [finished], 0
        mov     qword [q_head], 0       ; the line: the calibration cabins, in order
        mov     qword [q_tail], 0
        lea     rax, [calib_procs]
        call    q_push
        cmp     qword [nprocs], 2
        jb      @f
        lea     rax, [calib_procs + PROC_SIZE]
        call    q_push
@@:
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
        cmp     byte [motor], 0
        jne     run_routines
        mov     [rbx + P_BUDGET0], rax
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
        test    rbp, rbp
        jnz     .store
        cmp     qword [rbx + P_CUT], 0
        jne     .cut
        mov     rcx, [rbx + P_TAIL]     ; spent: if it is in its last part and what is left costs no more
        test    rcx, rcx                ; than passing the oar, it finishes first (remos.inc)
        jz      .store
        mov     eax, [rcx + r12*4]
        test    eax, eax
        jz      .store
        cmp     rax, [tail_limit]
        ja      .store
        mov     rbp, rax
        add     [rbx + P_BUDGET0], rax
        jmp     next
.cut:
        mov     qword [rbx + P_CUT], 0
.store:
        mov     [rbx + P_PC], r12
        mov     [rbx + P_DEPTH], rdi
        call    ret_trim
        mov     rax, [rbx + P_BUDGET0]
        sub     rax, rbp
        ret

        align 16
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

        align 16
op_ldi:
        movsx   rax, r9w
        mov     [r14 + r11*8], rax
        jmp     next

macro binop name, insn {
  align 16
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

        align 16
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
  align 16
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

        align 16
op_jmp:
        movsx   rax, r9w
        add     r12, rax
        jmp     next

        align 16
op_jz:
        cmp     qword [r14 + r11*8], 0
        jne     next
        movsx   rax, r9w
        add     r12, rax
        jmp     next

        align 16
op_jnz:
        cmp     qword [r14 + r11*8], 0
        je      next
        movsx   rax, r9w
        add     r12, rax
        jmp     next

        align 16
op_shi:
        mov     rax, [r14 + r11*8]
        shl     rax, 16
        or      rax, r9
        mov     [r14 + r11*8], rax
        jmp     next

include 'datos.inc'
include 'anfitrion.inc'
include 'ayudantes.inc'
include 'remos.inc'
include 'ambientes.inc'

macro memop name, size, align_check, is_load, body {
  local translate, inside
  align 16
  name:
          movsx   rax, r9w
          add     rax, [r14 + r8*8]
          cmp     rax, [rbx + P_LIM#size]   ; room 0, below its end: nothing to translate
          jae     translate
  inside:
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
  postpone \{                     ; the package goes after all the code: the routine stays small
  translate:
          room_package size, 49 - is_load, fail_mem   ; a load needs read (48), a store write (49)
          jmp     inside
  \}
}

memop op_ld,  8, 1, 1, <mov rax, [r15 + rax]>
memop op_st,  8, 1, 0, <mov [r15 + rax], rcx>
memop op_ldb, 1, 0, 1, <movzx eax, byte [r15 + rax]>
memop op_stb, 1, 0, 0, <mov [r15 + rax], cl>

        align 16
op_call:
        cmp     rdi, [rbx + P_RETCAP]
        jae     .more
.room:
        mov     [rsi + rdi*8], r12
        inc     rdi
        movsx   rax, r9w
        add     r12, rax
        jmp     next

postpone {
op_call.more:
        push    r9
        call    ret_grow
        pop     r9
        jc      fail_call
        jmp     op_call.room
}

        align 16
op_ret:
        test    rdi, rdi
        jz      fail_ret
        dec     rdi
        mov     r12, [rsi + rdi*8]
        jmp     next

        align 16
op_jhost:                                ; the window to the host (anfitrion.inc)
        mov     rax, [r14 + r8*8]
        call    host_window
        test    ecx, ecx
        jnz     ended
        mov     [r14 + r11*8], rax
        jmp     next

        align 16
op_sys:
        mov     [rbx + P_SYSRD], r11
        mov     rax, [r14 + r8*8]
        mov     [rbx + P_SYSQ], rax     ; queue address
        call    kern_enter              ; the window is shared: one cabin at a time (remos.inc)
        mov     rax, [rbx + P_SYSQ]
        call    ventanilla
        mov     r15, [rbx + P_DATA]     ; a request may have built or moved a room
        cmp     rax, -1
        je      .fail
        cmp     rax, -2
        je      .asleep
        mov     r11, [rbx + P_SYSRD]
        mov     [r14 + r11*8], rax      ; requests attended
        cmp     byte [sched_dirty], 0
        je      .done
        mov     byte [sched_dirty], 0   ; someone was born or woke up: the scheduler decides again
        sub     [rbx + P_BUDGET0], rbp  ; end the turn here, counting only what really ran
        xor     ebp, ebp
        mov     qword [rbx + P_CUT], 1  ; cut by an event: it does not stretch to its end
.done:
        call    kern_leave
        jmp     next
.fail:
        call    kern_leave
        jmp     fail_mem
.asleep:                                ; waiting for the parent's signature: this jsys runs again later
        dec     r12
        sub     [rbx + P_BUDGET0], rbp
        xor     ebp, ebp
        mov     qword [rbx + P_CUT], 1
        call    kern_leave
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
; Kinds: 1 write (a = address, b = bytes; answer b), 2 grow: build a room of a bytes (answer its address),
; 3 destroy the room at address a (answer 0; -1 if no room starts there or it holds the queue). Others: -1.
; Within a kind the order of the queue is kept.
;
; rbx = process, rax = queue address. Returns rax = requests attended, or -1 if the queue is outside
; the cabin.
ventanilla:
        push    rsi rdi rbp r12 r13 r14 r15
        cmp     qword [rbx + P_HELPER], 0
        jne     .bad                    ; a kernel helper has no window
        cmp     qword [rbx + P_ROOM0], 0
        jne     .queue
        call    rooms_first             ; no room yet: this is the first order, rax = the size
        cmp     rax, -1
        je      .bad
        jmp     .out
.queue:
        mov     r12, rax
        mov     [queue_addr], rax
        test    r12b, 7
        jnz     .bad
        mov     edx, 8
        call    cabin_at                ; the count must be inside one room
        jc      .bad
        mov     r15, [rax]              ; how many requests
        mov     r13, rax
        sub     r13, r12                ; [r13 + queue address] = the queue (until a room moves)
        mov     rax, ROOM_MAX / 32
        cmp     r15, rax
        ja      .bad                    ; more entries than any room can hold
        mov     rax, r12
        mov     rdx, r15
        shl     rdx, 5
        add     rdx, 8
        call    cabin_at                ; and the whole queue too
        jc      .bad
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
        jmp     .mark
.mark_lap:
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
        cmp     edx, 29
        jne     .not_greeting
        call    greet_must_wait         ; r8d = 1: nobody greeted it yet, so it sleeps until someone does
        test    r8d, r8d
        jnz     .waits
.not_greeting:
        cmp     byte [kind_important + rdx], 0
        je      .go                     ; it only looks: no signature
        cmp     qword [rbx + P_PARENT], 0
        je      .go                     ; the kernel's children: the kernel signs through the porters
        call    signature               ; r8 = 1 signed, 2 rejected, 0 now waiting for the parent
        cmp     r8d, 1
        je      .go
        cmp     r8d, 2
        jne     .waits
        inc     qword [denied]
        jmp     .unknown
.waits:
        inc     qword [must_wait]
        jmp     .mark_next
.go:
        mov     byte [present + rdx], 1
        jmp     .mark_next
.unknown:
        mov     qword [rbp + rax + 24], -1
.mark_next:
        inc     rcx
.mark:
        cmp     rcx, r15
        jb      .mark_lap
.marked:
        cmp     qword [must_wait], 0    ; something waits for the parent: the whole touch waits
        je      .no_wait
        mov     rax, [must_wait]
        mov     [rbx + P_WAITING], rax
        mov     qword [must_wait], 0
        sub     [requests], r15         ; it will be counted when it runs
        invoke  VirtualFree, rbp, 0, MEM_RELEASE
        mov     rax, -2
        jmp     .out
.no_wait:

        ; pass 1: a kind that already has its screen keeps it
        mov     edx, 1
        jmp     .keep
.keep_lap:
        cmp     byte [present + rdx], 0
        je      .keep_next
        xor     ecx, ecx
        jmp     .look
.look_lap:
        cmp     [tune + rcx*8], rdx
        je      .found
        inc     ecx
.look:
        cmp     rcx, [nscreens]
        jb      .look_lap
        jmp     .keep_next
.found:
        mov     byte [busy + rcx], 1
        mov     byte [present + rdx], 2 ; placed
.keep_next:
        inc     edx
.keep:
        cmp     edx, KINDS
        jbe     .keep_lap
.kept:

        ; pass 2: the rest take a screen that got nothing this round (it changes tuning) or open one
        mov     edx, 1
        jmp     .place
.place_lap:
        cmp     byte [present + rdx], 1
        jne     .place_next
        xor     ecx, ecx
        jmp     .free
.free_lap:
        cmp     byte [busy + rcx], 0
        je      .retune
        inc     ecx
.free:
        cmp     rcx, [nscreens]
        jb      .free_lap
        jmp     .open
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
.place:
        cmp     edx, KINDS
        jbe     .place_lap
.placed:

        ; every screen used this round serves its whole batch
        xor     r12d, r12d
        jmp     .serve
.serve_lap:
        cmp     byte [busy + r12], 0
        je      .serve_next
        mov     rax, [tune + r12*8]
        call    qword [serve_table + rax*8 - 8]
.serve_next:
        inc     r12
.serve:
        cmp     r12, [nscreens]
        jb      .serve_lap
.served:

        ; answers back into the queue (its room may have moved, never been destroyed); the queue is left empty
        mov     rax, [queue_addr]
        mov     edx, 8
        call    cabin_at
        mov     qword [rax], 0
        lea     rdi, [rax + 8]
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
        xor     r8, r8                  ; total bytes
        xor     ecx, ecx
        jmp     .length
.length_lap:
        mov     rax, rcx
        shl     rax, 5
        cmp     dword [rbp + rax], 1
        jne     .length_next
        mov     rdx, [rbp + rax + 8]    ; a
        mov     r9, [rbp + rax + 16]    ; b
        push    rax
        mov     rax, rdx
        mov     rdx, r9
        call    cabin_at                ; all of it inside one room
        pop     rax
        jc      .invalid
        add     r8, r9
        mov     [rbp + rax + 24], r9
        jmp     .length_next
.invalid:
        mov     qword [rbp + rax + 24], -1
.length_next:
        inc     rcx
.length:
        cmp     rcx, r15
        jb      .length_lap
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
        jmp     .copy
.copy_lap:
        mov     rax, r12
        shl     rax, 5
        cmp     dword [rbp + rax], 1
        jne     .copy_next
        mov     rcx, [rbp + rax + 24]
        cmp     rcx, -1
        je      .copy_next
        push    rcx
        mov     rdx, rcx
        mov     rax, [rbp + rax + 8]
        call    cabin_at
        mov     rsi, rax
        pop     rcx
        rep     movsb
.copy_next:
        inc     r12
.copy:
        cmp     r12, r15
        jb      .copy_lap
.copied:
        invoke  WriteFile, [hout], [wbuf], [wtotal], written, 0
        inc     qword [hostcalls]
        invoke  VirtualFree, [wbuf], 0, MEM_RELEASE
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; Screen tuned to "grow": each request builds a room of a bytes at the end of the cabin (ambientes.inc).
serve_grow:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
        jmp     .one
.one_lap:
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 2
        jne     .next
        mov     rax, [rbp + r13 + 8]
        call    rooms_grow
        mov     [rbp + r13 + 24], rax
.next:
        inc     r12
.one:
        cmp     r12, r15
        jb      .one_lap
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; Screen tuned to "destroy": each request destroys the room that starts at a, and only that one.
serve_destroy:
        push    r12 r13 r14 r15
        sub     rsp, 8
        xor     r12d, r12d
        jmp     .one
.one_lap:
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 3
        jne     .next
        mov     rax, [rbp + r13 + 8]
        call    rooms_destroy
        mov     [rbp + r13 + 24], rax
.next:
        inc     r12
.one:
        cmp     r12, r15
        jb      .one_lap
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
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
        jmp     .one
.one_lap:
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
.one:
        cmp     r12, r15
        jb      .one_lap
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
        jmp     .climb
.climb_lap:
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
.climb:                                 ; while below the root
        cmp     r8, -1
        jne     .climb_lap
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

; The same, from a label already in the kernel: rsi = its bytes.
label_path_ptr:
        push    r12 r13 r14
        mov     r12, rdi
        test    rcx, rcx
        jz      label_path.no
        jmp     label_path.normalize

label_path:
        push    r12 r13 r14
        mov     r12, rdi
        test    rcx, rcx
        jz      .no
        push    rax rdx
        mov     rax, rsi
        mov     rdx, rcx
        call    cabin_at
        mov     rsi, rax
        pop     rdx rax
        jc      .no
.normalize:
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
        jmp     .hex
.hex_lap:
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
.hex:                                   ; while label bytes are left
        test    rcx, rcx
        jnz     .hex_lap
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
        jmp     .one
.one_lap:
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
.one:
        cmp     r12, r15
        jb      .one_lap
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
        jmp     .one
.one_lap:
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
.one:
        cmp     r12, r15
        jb      .one_lap
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
        jmp     .one
.one_lap:
        mov     r13, r12
        shl     r13, 5
        cmp     dword [rbp + r13], 14
        jne     .next
        call    list_one
.next:
        inc     r12
.one:
        cmp     r12, r15
        jb      .one_lap
.done:
        add     rsp, 8
        pop     r15 r14 r13 r12
        ret

; One "list" request, entry r13. Keeps r12, r13, r15.
list_one:
        push    r14 rsi rdi
        mov     rax, [rbp + r13 + 8]    ; destination offset and room must be inside the cabin
        mov     rdx, [rbp + r13 + 16]
        call    cabin_at
        jc      .invalid
        mov     [list_pos], rax         ; a pointer: nothing moves rooms while listing
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
        mov     eax, 1                  ; the first entry came with FindFirstFileA
        jmp     .entries
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
        mov     rdi, [list_pos]
        add     [list_pos], rdx
        mov     [rdi], rcx
        add     rdi, 8
        lea     rsi, [norm_label]
        rep     movsb
        inc     qword [list_count]
.another:
        invoke  FindNextFileA, r14, find_data
        inc     qword [hostcalls]
.entries:                               ; while the host has another entry
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
        jmp     .pair
.pair_lap:
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
.pair:                                  ; while there are hex pairs
        movzx   eax, byte [rsi]
        test    eax, eax
        jnz     .pair_lap
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
          jmp     .one
  .one_lap:
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
          mov     rax, rdx
          mov     rdx, r8
          call    cabin_at
          jc      .invalid
          mov     rdx, rax
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
  .one:                                 ; while entries are left
          cmp     r12, r15
          jb      .one_lap
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
        jmp     .one
.one_lap:
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
.one:
        cmp     r12, r15
        jb      .one_lap
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
        jmp     .look
.look_lap:
        cmp     qword [rdx + rax*8], 0
        je      .done
        inc     rax
.look:
        cmp     rax, rcx
        jb      .look_lap
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
        jmp     .done
.fail:
        mov     rax, -1
.done:
        add     rsp, 8
        ret

; Closes every file the process in rbx left open.
close_files:
        push    r12
        sub     rsp, 8
        xor     r12d, r12d
        jmp     .one
.one_lap:
        mov     rax, [rbx + P_FILES]
        mov     rax, [rax + r12*8]
        test    rax, rax
        jz      .next
        invoke  CloseHandle, rax
        mov     rax, [rbx + P_FILES]
        mov     qword [rax + r12*8], 0
.next:
        inc     r12
.one:
        cmp     r12, [rbx + P_NFILES]
        jb      .one_lap
.done:
        add     rsp, 8
        pop     r12
        ret

; eax = 1 if the rcx bytes at rsi are valid UTF-8 (the standard's rule: no overlong forms, no
; surrogates, nothing above U+10FFFF), else 0.
utf8_ok:
        jmp     .next
.next_lap:
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
        jmp     .continuation
.continuation_lap:
        movzx   eax, byte [rsi]
        cmp     al, 80h
        jb      .no
        cmp     al, 0BFh
        ja      .no
        inc     rsi
        dec     rcx
        dec     edx
.continuation:
        test    edx, edx
        jnz     .continuation_lap
.next:
        test    rcx, rcx
        jnz     .next_lap
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
        jmp     .climb
.climb_lap:
        cmp     r8, [nnodes]
        jae     .no
        imul    r10, r8, NODE_SIZE
        add     r10, [nodes]
        cmp     qword [r10 + N_ALIVE], 0
        je      .no
        test    [r10 + N_RIGHTS], r9
        jz      .no
        mov     r8, [r10 + N_PARENT]
.climb:                                 ; while below the root
        cmp     r8, -1
        jne     .climb_lap
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
        jmp     .climb
.climb_lap:
        imul    r10, r8, NODE_SIZE
        add     r10, [nodes]
        cmp     qword [r10 + N_ALIVE], 0
        je      .done
        cmp     r8, r11
        je      .yes
        mov     r8, [r10 + N_PARENT]
.climb:
        cmp     r8, -1
        jne     .climb_lap
        jmp     .done
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
          jmp     .one
  .one_lap:
          mov     r13, r12
          shl     r13, 5
          cmp     dword [rbp + r13], kind
          jne     .next
          call    handler
  .next:
          inc     r12
  .one:                                 ; while entries are left
          cmp     r12, r15
          jb      .one_lap
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
        mov     rax, [rbp + r13 + 16]   ; the block: a 16-byte header, then the prefix
        mov     edx, 16
        call    cabin_at
        jc      .invalid
        mov     rdx, rax
        mov     rax, [rdx + 8]          ; prefix length
        test    rax, rax
        jz      .invalid
        push    rax rdx
        lea     rdx, [rax + 16]         ; header and prefix, all inside one room
        cmp     rdx, rax
        jb      .too_long
        mov     rax, [rbp + r13 + 16]
        call    cabin_at
.too_long:
        pop     rdx rax
        jc      .invalid
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

; ---------------------------------------------------------------- the family
; The kernel is the mother of all. A process launches children from files; each child's porters hang
; from its parent's, so nobody has more than whoever launched it. An important request (anything that
; changes a process, a file or the system) of a child waits for the signature of its parent only
; (Capitan: "the hierarchy rules: the micro asks the macro"); while it waits, the child sleeps and its
; jsys runs again once everything is signed or rejected. When a process ends, what waited for its
; signature goes up to its own parent (the kernel signs at once) and its children are adopted.

; In the window: rbx = child, rcx = entry, rdx = kind -> r8 = 1 signed, 2 rejected, 0 waiting (asked).
; Keeps rax, rcx, rdx.
signature:
        push    rax rcx rdx rsi
        mov     r10, [rbx + P_PARENT]
        cmp     qword [r10 + P_SHADOW], 1
        jne     .search
        call    shadow_decides          ; the parent is gone: its shadow decides at once
        jmp     .out
.search:
        xor     esi, esi
        jmp     .look
.look_lap:
        imul    r9, rsi, REC_SIZE
        add     r9, [recs]
        cmp     [r9 + R_CHILD], rbx
        jne     .next
        cmp     [r9 + R_INDEX], rcx
        jne     .next
        cmp     [r9 + R_KIND], rdx
        jne     .next
        mov     r8, [r9 + R_STATE]
        cmp     r8, REC_USED
        je      .next
        test    r8, r8
        jz      .wait                   ; already asked, not answered yet
        mov     qword [r9 + R_STATE], REC_USED   ; signed or rejected: used now
        jmp     .out
.next:
        inc     rsi
.look:
        cmp     rsi, [nrecs]
        jb      .look_lap
.ask:
        call    new_record
.wait:
        xor     r8d, r8d
.out:
        pop     rsi rdx rcx rax
        ret

; rbx = child, rcx = entry, rdx = kind: a request waiting for the signature of the child's parent.
; The table doubles when full.
new_record:
        mov     [nr_index], rcx
        mov     [nr_kind], rdx
        mov     rax, [nrecs]
        cmp     rax, [caprecs]
        jb      .room
        lea     rax, [rax + rax]
        test    rax, rax
        jnz     @f
        mov     eax, 1
@@:     mov     [caprecs], rax
        imul    rax, REC_SIZE
        invoke  VirtualAlloc, 0, rax, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      fail_file
        mov     [nr_new], rax
        mov     rdi, rax
        mov     rsi, [recs]
        mov     rcx, [nrecs]
        imul    rcx, REC_SIZE
        rep     movsb
        cmp     qword [recs], 0
        je      @f
        invoke  VirtualFree, [recs], 0, MEM_RELEASE
@@:     mov     rax, [nr_new]
        mov     [recs], rax
        mov     rax, [nrecs]
.room:
        imul    r9, rax, REC_SIZE
        add     r9, [recs]
        mov     [r9 + R_CHILD], rbx
        mov     rax, [nr_index]
        mov     [r9 + R_INDEX], rax
        mov     rax, [nr_kind]
        mov     [r9 + R_KIND], rax
        mov     rax, [rbx + P_PARENT]
        mov     [r9 + R_SIGNER], rax
        mov     qword [r9 + R_STATE], 0
        test    rax, rax
        jz      @f
        inc     qword [rax + P_BLOCKS]  ; its parent holds one more
        inc     qword [held]
        call    kern_wake_special       ; the special rower looks at it
@@:
        inc     qword [nrecs]
        ret

; rbx = a process that just ended (Capitan: "the parent goes, not its shadow, which keeps its permissions
; for the line below, and the shadow goes only when there is nobody below").
;  - With living descendants it leaves its shadow: what waited for its signature is decided now with the
;    parent's own permissions, and so is everything its line asks later. Nobody else decides for that
;    line, neither the grandparent nor the kernel. Nobody is adopted.
;  - Shadows above it that are left with nobody below disappear, and their porters with them.
orphans:
        push    rsi r12
        call    living_below
        test    eax, eax
        jz      .climb_start
        mov     qword [rbx + P_SHADOW], 1
        xor     esi, esi
        jmp     .rec
.rec_lap:
        imul    r12, rsi, REC_SIZE
        add     r12, [recs]
        cmp     [r12 + R_SIGNER], rbx
        jne     .rec_next
        cmp     qword [r12 + R_STATE], 0
        jne     .rec_next
        mov     r10, rbx
        mov     rdx, [r12 + R_KIND]
        call    shadow_decides
        mov     [r12 + R_STATE], r8
        dec     qword [rbx + P_BLOCKS]
        dec     qword [held]
        mov     r8, [r12 + R_CHILD]
        dec     qword [r8 + P_WAITING]
        call    q_wake                  ; its signature arrived: to the line
.rec_next:
        inc     rsi
.rec:
        cmp     rsi, [nrecs]
        jb      .rec_lap
.climb_start:
        mov     r12, rbx                ; itself too: a shadow it may have left is checked from below
        jmp     .climb
.climb_lap:
        cmp     qword [r12 + P_SHADOW], 1
        jne     .up
        push    rbx
        mov     rbx, r12
        call    living_below
        pop     rbx
        test    eax, eax
        jnz     .up
        mov     qword [r12 + P_SHADOW], 2          ; gone
        mov     ecx, 1
        jmp     .revoke
.revoke_lap:                            ; its porters go with it
        mov     rax, [r12 + P_GATES + rcx*8 - 8]
        imul    rax, NODE_SIZE
        add     rax, [nodes]
        mov     qword [rax + N_ALIVE], 0
        inc     ecx
.revoke:                                ; while doors are left
        cmp     ecx, DOORS
        jbe     .revoke_lap
.up:
        mov     r12, [r12 + P_PARENT]
.climb:
        test    r12, r12
        jnz     .climb_lap
.done:
        pop     r12 rsi
        ret

; eax = 1 if some process still running descends from rbx.
living_below:
        xor     ecx, ecx
        jmp     .one
.one_lap:
        mov     r8, [procs]
        mov     r8, [r8 + rcx*8]
        cmp     qword [r8 + P_DONE], 0
        jne     .next
        jmp     .up
.up_lap:
        cmp     r8, rbx
        je      .found
.up:                                    ; while an ancestor is left
        mov     r8, [r8 + P_PARENT]
        test    r8, r8
        jnz     .up_lap
        jmp     .next
.found:
        mov     eax, 1
        ret
.next:
        inc     rcx
.one:
        cmp     rcx, [nprocs]
        jb      .one_lap
.none:
        xor     eax, eax
        ret

; r10 = a shadow, rdx = kind -> r8 = 1 signed if the parent's own permissions allow it, else 2 rejected.
; (Requests on the porter tree itself answer to the tree's rules when they run.)
shadow_decides:
        movzx   r9d, byte [kind_door + rdx]
        test    r9d, r9d
        jz      .yes
        mov     r8, [r10 + P_GATES + r9*8 - 8]
        movzx   r9d, byte [kind_right + rdx]
        call    gate_allows
        test    r8d, r8d
        jz      .no
.yes:
        mov     r8d, 1
        ret
.no:
        mov     r8d, 2
        ret

; Everyone left is waiting for a signature that nobody running can give: rejected, so nobody waits forever.
nobody_signs:
        call    greet_nobody            ; and nobody is left to greet whoever waits for a greeting
        xor     ecx, ecx
        jmp     .one
.one_lap:
        imul    r9, rcx, REC_SIZE
        add     r9, [recs]
        cmp     qword [r9 + R_STATE], 0
        jne     .next
        mov     qword [r9 + R_STATE], 2
        mov     rax, [r9 + R_SIGNER]    ; its signer holds one less
        test    rax, rax
        jz      @f
        dec     qword [rax + P_BLOCKS]
        dec     qword [held]
@@:
        mov     r8, [r9 + R_CHILD]
        dec     qword [r8 + P_WAITING]
        call    q_wake                  ; its signature arrived: to the line
.next:
        inc     rcx
.one:
        cmp     rcx, [nrecs]
        jb      .one_lap
.done:
        ret

serve_gate serve_launch,  16, family_launch
serve_gate serve_sign,    17, family_sign
serve_gate serve_pending, 18, family_pending
serve_gate serve_state,   19, family_state
serve_gate serve_bolita,  20, family_bolita

; 21 treat a box (Capitan): a = the room's address, b = how to treat it (ambientes.inc, rooms_treat).
; Answers 0, or -1.
serve_gate serve_treat,   21, gate_treat

gate_treat:
        sub     rsp, 8
        mov     rax, [rbp + r13 + 8]
        mov     rdx, [rbp + r13 + 16]
        call    rooms_treat
        mov     [rbp + r13 + 24], rax
        add     rsp, 8
        ret

; 22 dowry: a = the room, b = how the child may treat it (ambientes.inc, rooms_dowry). Answers 0, or -1.
serve_gate serve_dowry,   22, gate_dowry

gate_dowry:
        sub     rsp, 8
        mov     rax, [rbp + r13 + 8]
        mov     rdx, [rbp + r13 + 16]
        call    rooms_dowry
        mov     [rbp + r13 + 24], rax
        add     rsp, 8
        ret

; 23 move: a = the room, b = the cabin it moves to. 24 link: a = the room, b = the cabin, its treatment there
; in the high half of the kind. 25 receive: the next box that arrived, or -1 (ambientes.inc, rooms_pass).
serve_gate serve_move,    23, gate_move
serve_gate serve_link,    24, gate_link
serve_gate serve_receive, 25, gate_receive

gate_move:
        mov     r9d, 1
        xor     r8d, r8d
        jmp     gate_pass
gate_link:
        xor     r9d, r9d
        mov     r8d, [rbp + r13 + 4]
gate_pass:
        sub     rsp, 8
        mov     rax, [rbp + r13 + 8]
        mov     rdx, [rbp + r13 + 16]
        call    rooms_pass
        mov     [rbp + r13 + 24], rax
        add     rsp, 8
        ret
gate_receive:
        call    rooms_receive
        mov     [rbp + r13 + 24], rax
        ret

; 26 fuse: a, b = the two rooms -> the new room's address, or -1 (ambientes.inc, rooms_fuse).
serve_gate serve_fuse,    26, gate_fuse

gate_fuse:
        sub     rsp, 8
        mov     rax, [rbp + r13 + 8]
        mov     rdx, [rbp + r13 + 16]
        call    rooms_fuse
        mov     [rbp + r13 + 24], rax
        add     rsp, 8
        ret

; 27 associate: a = the family cabin, b = 0 shared, 1 mine only, 2 its only, 3 all (ambientes.inc,
; rooms_associate). Answers 0, or -1.
serve_gate serve_assoc,   27, gate_assoc

gate_assoc:
        mov     rax, [rbp + r13 + 8]
        mov     rdx, [rbp + r13 + 16]
        call    rooms_associate
        mov     [rbp + r13 + 24], rax
        ret

; 28 greet (Capitan: "with a single bit the mother or the child send a greeting"): a = a family cabin.
; 29 wait for a greeting: who greeted, or -1 if nobody is left who could (ambientes.inc).
serve_gate serve_greet,    28, gate_greet
serve_gate serve_greeting, 29, gate_greeting

gate_greet:
        sub     rsp, 8
        mov     rax, [rbp + r13 + 8]
        call    greet
        mov     [rbp + r13 + 24], rax
        add     rsp, 8
        ret
gate_greeting:
        call    greeting
        mov     [rbp + r13 + 24], rax
        ret

; 16 launch: a = label of the program file, b = its bytes; the child's permissions travel in the high
; half of the type (cut down to the parent's). Answers the child's number, or -1.
family_launch:
        sub     rsp, 8
        mov     rsi, [rbp + r13 + 8]
        mov     rcx, [rbp + r13 + 16]
        lea     rdi, [host_path]
        call    label_path
        test    eax, eax
        jz      .invalid
        call    files_prefix_ok
        test    eax, eax
        jz      .invalid
        invoke  CreateFileA, host_path, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        inc     qword [hostcalls]
        cmp     rax, -1
        je      .invalid
        mov     [hfile], rax
        call    program_buffer
        test    rax, rax
        jz      .close
        mov     [mp_prog], rax
        mov     dword [bytesread], 0
        invoke  ReadFile, [hfile], [mp_prog], MAX_PROGRAM, bytesread, 0
        inc     qword [hostcalls]
        invoke  CloseHandle, [hfile]
        inc     qword [hostcalls]
        mov     eax, [bytesread]
        shr     eax, 2
        mov     [mp_words], rax
        mov     [mp_parent], rbx
        mov     eax, [rbp + r13 + 4]
        mov     [mp_rights], rax
        mov     rax, [rbx + P_PRIO]     ; born with its parent's bolita
        mov     [mp_prio], rax
        mov     qword [mp_pfx_len], 0
        call    make_process
        push    rax
        sub     rsp, 8
        call    family_data
        add     rsp, 8
        pop     rax
        mov     rax, [rax + P_ID]
        mov     [rbp + r13 + 24], rax
        mov     byte [sched_dirty], 1
        add     rsp, 8
        ret
.close:
        invoke  CloseHandle, [hfile]
.invalid:
        mov     qword [rbp + r13 + 24], -1
        add     rsp, 8
        ret

; 17 sign: a = number of a request waiting for my signature, b = 1 sign / 0 reject. Answers 0, or -1.
family_sign:
        mov     rax, [rbp + r13 + 8]
        cmp     rax, [nrecs]
        jae     .invalid
        imul    r9, rax, REC_SIZE
        add     r9, [recs]
        cmp     [r9 + R_SIGNER], rbx
        jne     .invalid
        cmp     qword [r9 + R_STATE], 0
        jne     .invalid
        mov     eax, 1
        cmp     qword [rbp + r13 + 16], 0
        jne     @f
        mov     eax, 2
@@:     mov     [r9 + R_STATE], rax
        dec     qword [rbx + P_BLOCKS]  ; I hold one less
        dec     qword [held]
        mov     r8, [r9 + R_CHILD]
        dec     qword [r8 + P_WAITING]
        call    q_wake                  ; its signature arrived: to the line
        mov     byte [sched_dirty], 1
        mov     qword [rbp + r13 + 24], 0
        ret
.invalid:
        mov     qword [rbp + r13 + 24], -1
        ret

; 18 pending: a = where to write, b = room. Each request waiting for my signature as three qwords:
; its number, the child's number, its kind. Answers how many, or -1.
family_pending:
        mov     rax, [rbp + r13 + 8]
        mov     rdx, [rbp + r13 + 16]
        call    cabin_at
        jc      .invalid
        mov     r10, rax                ; where
        mov     r11, rdx                ; room
        xor     eax, eax                ; how many
        xor     ecx, ecx
        jmp     .one
.one_lap:
        imul    r9, rcx, REC_SIZE
        add     r9, [recs]
        cmp     [r9 + R_SIGNER], rbx
        jne     .next
        cmp     qword [r9 + R_STATE], 0
        jne     .next
        cmp     r11, 24
        jb      .done
        mov     [r10], rcx
        mov     r8, [r9 + R_CHILD]
        mov     r8, [r8 + P_ID]
        mov     [r10 + 8], r8
        mov     r8, [r9 + R_KIND]
        mov     [r10 + 16], r8
        add     r10, 24
        sub     r11, 24
        inc     eax
.next:
        inc     rcx
.one:
        cmp     rcx, [nrecs]
        jb      .one_lap
.done:
        mov     [rbp + r13 + 24], rax
        ret
.invalid:
        mov     qword [rbp + r13 + 24], -1
        ret

; 19 state: a = number of one of my children -> its exit code once it ended, -1 while it runs,
; -2 if it is not my child.
family_state:
        mov     rax, [rbp + r13 + 8]
        cmp     rax, [nprocs]
        jae     .not_mine
        mov     r8, [procs]
        mov     r8, [r8 + rax*8]
        cmp     [r8 + P_PARENT], rbx
        jne     .not_mine
        mov     rax, -1
        cmp     qword [r8 + P_DONE], 0
        je      @f
        mov     rax, [r8 + P_CODE]
@@:     mov     [rbp + r13 + 24], rax
        ret
.not_mine:
        mov     qword [rbp + r13 + 24], -2
        ret

; 20 bolita: a = the bolita it wants, in 65536ths (1 = 10000h) -> it, cut down to the one it was launched
; with (nobody gives itself more than it was given), and its turn again from it. Answers the bolita it got.
family_bolita:
        mov     rax, [rbp + r13 + 8]
        cmp     rax, [rbx + P_PRIO_TOP]
        jbe     @f
        mov     rax, [rbx + P_PRIO_TOP]
@@:     mov     [rbx + P_PRIO], rax
        call    plan_quantum            ; its turn, once, from its new bolita
        mov     [rbp + r13 + 24], rax
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
        jmp     .digit
.digit_lap:
        rol     rax, 4
        mov     edx, eax
        and     edx, 15
        mov     dl, [hexdigits + rdx]
        mov     [rdi], dl
        inc     rdi
        dec     ecx
.digit:                                 ; while hex digits are left
        test    ecx, ecx
        jnz     .digit_lap
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
        jmp     .divide
.divide_lap:
.divide:                                ; while digits are left after taking one (0 still has one)
        xor     edx, edx
        div     rcx
        add     dl, '0'
        push    rdx
        inc     r8d
        test    rax, rax
        jnz     .divide_lap
        jmp     .emit
.emit_lap:
        pop     rax
        mov     [rdi], al
        inc     rdi
        dec     r8d
.emit:                                  ; while digits are left to write
        test    r8d, r8d
        jnz     .emit_lap
        ret

zero_mode:                              ; started by the firmware: not built yet
        jmp     .forever
.forever_lap:
        hlt
.forever:                               ; while (true)
        jmp     .forever_lap

no_programs:
fail_args:                              ; also a launch argument that does not parse
        invoke  ExitProcess, 4
fail_file:
        invoke  ExitProcess, 3

include 'rutinas.inc'
include 'nativo.inc'

; the translation packages (postpone, ambientes.inc) are emitted after this point: code_end goes after them
postpone {
code_end:
}

