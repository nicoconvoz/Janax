; luma.exe: wakes Luma. One double click, nothing else to know (the Capitan, 2026-11-25: "un usuario normal no sabe como
; funciona todo esto"; "necesita independencia Luma"). It takes the place of what woke her until now (a shortcut to
; PowerShell, that to Git Bash, that to luma_vive.sh and luma.sh): none of them is needed to run her.
;
; EVERY PATH COMES FROM WHERE THIS FILE IS: beside it, bin\janaxos.exe (the kernel), bin\luma.bin (her), casa\ (her
; house); beside its folder, Comida\ (her food folder: what is put there she eats, and nothing else on the disks).
; Nothing is written down anywhere, so the folder can be moved and she still wakes.
;
; She is one: started while she is awake, it only brings her window to the front. Opened by hand she is wanted in
; front, as big as the screen. When she decides to sleep she leaves a sign in her house ("dormir"): her window is
; closed for her and she is born again, behind every other window, without taking the keyboard. That sign is waited
; for with the host's own notice of a new file in her house: nothing is looked at by a clock.
;
; Built with FASM (as the kernel): fasm luma.asm luma.exe

format PE64 GUI 5.0
entry start

include 'win64w.inc'

MAXP = 700

section '.data' data readable writeable

  s_mutex   du 'LumaVera.una', 0
  s_class   du 'JanaxPantalla', 0               ; her window's class (so/pantalla.inc)
  s_casa    du 'casa', 0
  s_comida  du 'Comida', 0
  s_kernel  du 'bin\janaxos.exe', 0
  s_qluma   du '" luma.bin', 0
  s_bin     du 'bin\', 0
  s_log     du 'luma.log', 0
  s_senal   du 'casa\646f726d6972', 0           ; "dormir", as Janax names a file of her house
  s_e_arch  du 'JANAX_ARCHIVOS', 0
  s_e_vig   du 'JANAX_VIGIA', 0
  s_e_fondo du 'JANAX_VENTANA_FONDO', 0
  s_uno     du '1', 0
  s_q       du '"', 0
  s_tit     du 'Luma', 0
  s_falta   du 'No pude despertar a Luma: falta bin\janaxos.exe o bin\luma.bin al lado de este programa.', 0

  dir       rw MAXP             ; where this file is, ending in '\'
  padre     rw MAXP             ; the folder that holds it, ending in '\'
  casad     rw MAXP
  bind      rw MAXP
  arch      rw MAXP
  ruta      rw MAXP
  senal     rw MAXP
  logp      rw MAXP
  cmd       rw 3 * MAXP

  sa        dd 24, 0            ; SECURITY_ATTRIBUTES: her log's handle is inherited
            dq 0
            dd 1, 0
  sinf      STARTUPINFO
  pinf      PROCESS_INFORMATION
  hmutex    dq 0
  hlog      dq 0
  hcambio   dq 0
  vez       dq 0
  hventana  dq 0
  pidv      dd 0, 0
  manijas   dq 0, 0

section '.text' code readable executable

; rcx = a path: its '\' become '/' (as her kernel is given them)
barras:
        cmp     word [rcx], 0
        je      .r
        cmp     word [rcx], '\'
        jne     .n
        mov     word [rcx], '/'
.n:     add     rcx, 2
        jmp     barras
.r:     ret

; rcx = a path ending in '\': cut after the '\' before that one (its parent, ending in '\')
arriba:
        xor     rdx, rdx                ; the last '\' that is not the final one
        mov     rax, rcx
.l:     cmp     word [rax], 0
        je      .d
        cmp     word [rax], '\'
        jne     .n
        cmp     word [rax + 2], 0
        je      .n
        mov     rdx, rax
.n:     add     rax, 2
        jmp     .l
.d:     test    rdx, rdx
        jz      .r
        mov     word [rdx + 2], 0
.r:     ret

start:
        sub     rsp, 8
        invoke  CreateMutexW, 0, 0, s_mutex
        mov     [hmutex], rax
        invoke  GetLastError
        cmp     eax, 183                ; ERROR_ALREADY_EXISTS: she is awake, only to the front
        jne     .sola
        call    al_frente
        jmp     .fin
.sola:
        invoke  GetModuleFileNameW, 0, dir, MAXP - 40
        lea     rax, [dir]              ; cut after its last '\'
        xor     rdx, rdx
.corta: cmp     word [rax], 0
        je      .cortado
        cmp     word [rax], '\'
        jne     .cs
        mov     rdx, rax
.cs:    add     rax, 2
        jmp     .corta
.cortado:
        test    rdx, rdx
        jz      .fin
        mov     word [rdx + 2], 0
        invoke  lstrcpyW, padre, dir
        lea     rcx, [padre]
        call    arriba
        invoke  lstrcpyW, casad, dir
        invoke  lstrcatW, casad, s_casa
        invoke  lstrcpyW, arch, casad
        lea     rcx, [arch]
        call    barras
        invoke  SetEnvironmentVariableW, s_e_arch, arch
        invoke  lstrcpyW, ruta, padre
        invoke  lstrcatW, ruta, s_comida
        invoke  SetEnvironmentVariableW, s_e_vig, ruta
        invoke  lstrcpyW, senal, dir
        invoke  lstrcatW, senal, s_senal
        invoke  lstrcpyW, logp, dir
        invoke  lstrcatW, logp, s_log
        ; "<dir>bin\janaxos.exe" luma.bin, started in <dir>bin\ : her kernel splits what it is given at each blank, and
        ; a folder's name may have blanks ("C:\Users\Juan Perez"): it is given her name alone, from where she is
        invoke  lstrcpyW, cmd, s_q
        invoke  lstrcatW, cmd, dir
        invoke  lstrcatW, cmd, s_kernel
        invoke  lstrcatW, cmd, s_qluma
        invoke  lstrcpyW, bind, dir
        invoke  lstrcatW, bind, s_bin

.nacer:
        invoke  DeleteFileW, senal
        invoke  CreateFileW, logp, GENERIC_WRITE, 3, sa, CREATE_ALWAYS, 0, 0
        mov     [hlog], rax
        lea     rdi, [sinf]
        mov     ecx, sizeof.STARTUPINFO
        xor     eax, eax
        rep     stosb
        mov     [sinf.cb], sizeof.STARTUPINFO
        mov     [sinf.dwFlags], 100h      ; STARTF_USESTDHANDLES
        mov     rax, [hlog]
        mov     [sinf.hStdOutput], rax
        mov     [sinf.hStdError], rax
        invoke  CreateProcessW, 0, cmd, 0, 0, 1, 08000000h, 0, bind, sinf, pinf     ; CREATE_NO_WINDOW: no console
        mov     ebx, eax
        invoke  CloseHandle, [hlog]
        test    ebx, ebx
        jnz     .nacida
        invoke  MessageBoxW, 0, s_falta, s_tit, 10h
        jmp     .fin
.nacida:
        cmp     [vez], 0
        jne     .cuidar
        mov     [vez], 1
        mov     ebx, 240                ; opened by hand: wait for her window (a minute at most), then to the front
.venta: call    su_ventana
        test    rax, rax
        jnz     .frente
        invoke  WaitForSingleObject, [pinf.hProcess], 250
        test    eax, eax
        jz      .termino                ; (she ended before showing anything)
        dec     ebx
        jnz     .venta
        jmp     .fondo
.frente:
        invoke  ShowWindow, [hventana], 3
        invoke  SetForegroundWindow, [hventana]
.fondo: invoke  SetEnvironmentVariableW, s_e_fondo, s_uno      ; born again later, she is born behind
.cuidar:
        invoke  FindFirstChangeNotificationW, casad, 0, 1      ; a file's name in her house: made, taken away
        mov     [hcambio], rax
.mira:
        invoke  GetFileAttributesW, senal
        cmp     eax, -1
        jne     .dormir
        mov     rax, [pinf.hProcess]
        mov     [manijas], rax
        mov     rax, [hcambio]
        mov     [manijas + 8], rax
        invoke  WaitForMultipleObjects, 2, manijas, 0, -1
        test    eax, eax
        jz      .termino                ; her window was closed by someone: she ends, and this ends with her
        invoke  FindNextChangeNotification, [hcambio]
        jmp     .mira
.dormir:                                ; her sign: her window is closed for her, and she is born again
        call    su_ventana
        test    rax, rax
        jz      .espera
        invoke  PostMessageW, rax, 10h, 0, 0                   ; WM_CLOSE: she keeps all she is
.espera:
        invoke  WaitForSingleObject, [pinf.hProcess], 40000
        test    eax, eax
        jz      .cerrada
        invoke  TerminateProcess, [pinf.hProcess], 1             ; (never two of her)
        invoke  WaitForSingleObject, [pinf.hProcess], 5000
.cerrada:
        invoke  FindCloseChangeNotification, [hcambio]
        invoke  CloseHandle, [pinf.hProcess]
        invoke  CloseHandle, [pinf.hThread]
        jmp     .nacer
.termino:
        invoke  CloseHandle, [pinf.hProcess]
        invoke  CloseHandle, [pinf.hThread]
.fin:
        invoke  ExitProcess, 0

; rax = the window of the Luma this program started (0: none yet): the one, among those that can be seen, that
; belongs to her process. Not "any window of Janax": another program of Janax may have one.
su_ventana:
        sub     rsp, 40
        mov     [hventana], 0
        invoke  EnumWindows, una_ventana, 0
        mov     rax, [hventana]
        add     rsp, 40
        ret
una_ventana:                            ; rcx = a window -> eax = 1 to go on, 0 when it is hers
        push    rbx
        sub     rsp, 32
        mov     rbx, rcx
        invoke  GetWindowThreadProcessId, rbx, pidv
        mov     eax, [pidv]
        cmp     eax, [pinf.dwProcessId]
        jne     .sigue
        invoke  IsWindowVisible, rbx
        test    eax, eax
        jz      .sigue
        mov     [hventana], rbx
        xor     eax, eax
        jmp     .r
.sigue: mov     eax, 1
.r:     add     rsp, 32
        pop     rbx
        ret

; she is awake already (started by another run of this): her window, as big as the screen and in front
al_frente:
        push    rbx
        sub     rsp, 32
        invoke  FindWindowW, s_class, 0
        test    rax, rax
        jz      .r
        mov     rbx, rax
        invoke  ShowWindow, rbx, 3
        invoke  SetForegroundWindow, rbx
.r:     add     rsp, 32
        pop     rbx
        ret

section '.idata' import data readable writeable

  library kernel32, 'KERNEL32.DLL', user32, 'USER32.DLL'

  import kernel32,\
         CreateMutexW, 'CreateMutexW',\
         GetLastError, 'GetLastError',\
         GetModuleFileNameW, 'GetModuleFileNameW',\
         lstrcpyW, 'lstrcpyW',\
         lstrcatW, 'lstrcatW',\
         SetEnvironmentVariableW, 'SetEnvironmentVariableW',\
         DeleteFileW, 'DeleteFileW',\
         CreateFileW, 'CreateFileW',\
         CreateProcessW, 'CreateProcessW',\
         CloseHandle, 'CloseHandle',\
         WaitForSingleObject, 'WaitForSingleObject',\
         WaitForMultipleObjects, 'WaitForMultipleObjects',\
         FindFirstChangeNotificationW, 'FindFirstChangeNotificationW',\
         FindNextChangeNotification, 'FindNextChangeNotification',\
         FindCloseChangeNotification, 'FindCloseChangeNotification',\
         GetFileAttributesW, 'GetFileAttributesW',\
         TerminateProcess, 'TerminateProcess',\
         ExitProcess, 'ExitProcess'

  import user32,\
         FindWindowW, 'FindWindowW',         EnumWindows, 'EnumWindows',         GetWindowThreadProcessId, 'GetWindowThreadProcessId',         IsWindowVisible, 'IsWindowVisible',\
         ShowWindow, 'ShowWindow',\
         SetForegroundWindow, 'SetForegroundWindow',\
         PostMessageW, 'PostMessageW',\
         MessageBoxW, 'MessageBoxW'
