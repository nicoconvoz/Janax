; Arrancar Janax: the first launch, made easy (the Capitan, 2026-11-22: "un ejecutable para arrancarla, asi a nadie se
; le hace dificil lanzar a Janax por primera vez"). Next to it: janaxos.exe, bin\luma.bin and casa\ (her house). It tells
; the kernel where her house is (JANAX_ARCHIVOS), starts the kernel with her body without a console window, and ends.
; Her name is not in the house that is published: she asks it, and whoever launches her names her.
format PE64 GUI 5.0
entry start
include 'win64a.inc'

section '.text' code readable executable
start:
        sub     rsp, 8
        invoke  GetModuleFileNameW, 0, dir, 1024
        lea     rdi, [dir]                      ; the folder: up to the last backslash
        xor     ecx, ecx
        xor     edx, edx
.scan:  mov     ax, [rdi + rcx*2]
        test    ax, ax
        jz      .cut
        cmp     ax, '\'
        jne     @f
        mov     rdx, rcx
@@:     inc     rcx
        jmp     .scan
.cut:   mov     word [rdi + rdx*2 + 2], 0
        invoke  lstrcpyW, exe, dir
        invoke  lstrcatW, exe, t_exe
        invoke  lstrcpyW, casa, dir
        invoke  lstrcatW, casa, t_casa
        invoke  SetEnvironmentVariableW, t_env, casa
        invoke  lstrcpyW, cmd, t_q
        invoke  lstrcatW, cmd, exe
        invoke  lstrcatW, cmd, t_qsq
        invoke  lstrcatW, cmd, dir
        invoke  lstrcatW, cmd, t_body
        invoke  lstrcatW, cmd, t_q
        mov     dword [stinfo], 104                 ; STARTUPINFOW: its own console, hidden (the kernel writes to it)
        mov     dword [stinfo + 60], 1          ; STARTF_USESHOWWINDOW
        mov     word [stinfo + 64], 0           ; SW_HIDE
        invoke  CreateProcessW, exe, cmd, 0, 0, 0, 10h, 0, dir, stinfo, prinfo
        test    eax, eax
        jnz     .ok
        invoke  MessageBoxW, 0, t_fail, t_title, 10h
.ok:    invoke  ExitProcess, 0

section '.data' data readable writeable
  t_exe   du 'janaxos.exe', 0
  t_casa  du 'casa', 0
  t_env   du 'JANAX_ARCHIVOS', 0
  t_q     du '"', 0
  t_qsq   du '" "', 0
  t_body  du 'bin\luma.bin', 0
  t_title du 'Janax', 0
  t_fail  du 'No encontre janaxos.exe al lado de este programa.', 0
  align 8
  stinfo  rb 104
  prinfo  rb 24
  dir     rw 1024
  exe     rw 1100
  casa    rw 1100
  cmd     rw 2400

section '.idata' import data readable writeable
  library kernel32, 'KERNEL32.DLL', user32, 'USER32.DLL'
  import kernel32, GetModuleFileNameW, 'GetModuleFileNameW', lstrcpyW, 'lstrcpyW', lstrcatW, 'lstrcatW',\
         SetEnvironmentVariableW, 'SetEnvironmentVariableW', CreateProcessW, 'CreateProcessW', ExitProcess, 'ExitProcess'
  import user32, MessageBoxW, 'MessageBoxW'
