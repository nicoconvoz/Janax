; instalar-luma.exe: installs Luma. One double click (the Capitan, 2026-11-25: "armate un instalador... solo tiene que
; ensamblar, crear las carpetas, poner el conocimiento y agregar los accesos directos al escritorio"; "preguntar donde
; se quiere instalar, dar acceso y corregir las rutas"; "un usuario normal no sabe como funciona todo esto").
;
;   1. It asks where. There it makes  Luma\  (her kernel, herself, her house) and  Comida\  (her food folder).
;   2. It puts her kernel and what wakes her (luma.exe) in place.
;   3. SHE IS ASSEMBLED THERE, BY HER OWN ASSEMBLER (PDP, from its seed, running on her kernel): she does not come
;      already built. Her source and its includes come in datos\fuentes.paquete.
;   4. It puts her knowledge in her house (datos\casa.paquete). If there is a Luma there already, it asks before
;      touching what she knows.
;   5. It leaves two shortcuts on the desktop: "Luma" and "Comida de Luma".
;
; NO PATH IS WRITTEN DOWN: luma.exe finds everything from where it is, so nothing has to be corrected afterwards.
; Nothing else is needed on the machine: no Git Bash, no PowerShell, no Python. What is packed is unpacked with the
; host's own compression (cabinet.dll, MSZIP).
;
; A packet (armar_instalador.py makes them): one after another, a file's name (its bytes, then it, in ASCII: the name
; Janax gives it), its size, its packed size, and it packed (nothing, if it is empty).
;
;   instalar-luma.exe            asks where, and tells what it did
;   instalar-luma.exe <folder>   installs there, asking nothing and saying nothing (what she knows is kept if she is there)
;
; This is the part that speaks to Windows, so it is built with FASM, as the kernel: fasm instalar.asm instalar-luma.exe

format PE64 GUI 5.0
entry start

include 'win64w.inc'

MAXP = 700

section '.data' data readable writeable

  s_tit     du 'Instalar a Luma', 0
  s_donde   du 'Elegi la carpeta donde instalar a Luma. Ahi se crean dos carpetas: "Luma" (ella) y "Comida" (lo que pongas ahi, se lo come).', 0
  s_ya      du 'En esa carpeta ya hay una Luma, con lo que aprendio.', 13, 10, 13, 10
            du 'SI: conservo lo que sabe y solo actualizo el programa.', 13, 10
            du 'NO: reemplazo su conocimiento por el que trae este instalador.', 0
  s_listo   du 'Luma quedo instalada.', 13, 10, 13, 10
            du 'En el escritorio tenes dos accesos directos:', 13, 10
            du '  Luma: la despierta.', 13, 10
            du '  Comida de Luma: lo que pongas en esa carpeta, se lo come.', 13, 10, 13, 10
            du 'Queres despertarla ahora?', 0
  s_e_datos du 'No encuentro la carpeta "datos" al lado de este instalador. Tiene que estar junto a el, como vino.', 0
  s_e_copia du 'No pude copiar los archivos a esa carpeta. Fijate que se pueda escribir ahi.', 0
  s_e_paq   du 'No pude desempacar uno de los paquetes del instalador.', 0
  s_e_arma  du 'Su ensamblador no pudo armar a Luma. No se instalo.', 0

  s_bs      du '\', 0
  s_q       du '"', 0
  s_qens    du '" ensamblador.bin', 0
  s_datos   du 'datos\', 0
  s_luma    du 'Luma\', 0
  s_comida  du 'Comida', 0
  s_bin     du 'bin\', 0
  s_casa    du 'casa\', 0
  s_pdp     du 'pdp\', 0
  s_fuen    du 'fuentes\', 0
  s_kernel  du 'janaxos.exe', 0
  s_lanza   du 'luma.exe', 0
  s_ens     du 'ensamblador.bin', 0
  s_ensd    du 'ensamblador.datos', 0
  s_plan    du 'planificador.bin', 0
  s_pfuen   du 'fuentes.paquete', 0
  s_pcasa   du 'casa.paquete', 0
  s_lumab   du 'luma.bin', 0
  s_pulso   du 'pulso.datos', 0
  s_log     du 'armado.log', 0
  ; the names Janax gives the files (so/herramientas/armar.sh: etiqueta)
  s_h_luma  du '5044502f72617a61722f63756572706f2f6c756d612e62696e', 0             ; PDP/razar/cuerpo/luma.bin
  s_h_pulso du '5044502f72617a61722f6c6563747572612f70756c736f2e6461746f73', 0     ; PDP/razar/lectura/pulso.datos
  s_h_lect  du '6c756d612f6c6563746f72612e62696e', 0                               ; luma/lectora.bin
  s_h_pens  du '6c756d612f70656e7361646f72612e62696e', 0                           ; luma/pensadora.bin
  s_h_molde du '6c756d612f6c6563746f72612e6d6f6c6465', 0                           ; luma/lectora.molde
  s_h_vida  du '766964612d6d656d6f726961', 0                                       ; vida-memoria: a Luma lives there
  s_e_arch  du 'JANAX_ARCHIVOS', 0
  s_e_camb  du 'JANAX_CAMBIO', 0
  s_cero    du '0', 0
  s_lnk1    du '\Luma.lnk', 0
  s_lnk2    du '\Comida de Luma.lnk', 0
  s_d1      du 'Despierta a Luma', 0
  s_d2      du 'Lo que se pone aca, Luma se lo come. Nada mas del disco.', 0

  CLSID_ShellLink  dd 00021401h
                   dw 0, 0
                   db 0C0h, 0, 0, 0, 0, 0, 0, 46h
  IID_IShellLinkW  dd 000214F9h
                   dw 0, 0
                   db 0C0h, 0, 0, 0, 0, 0, 0, 46h
  IID_IPersistFile dd 0000010Bh
                   dw 0, 0
                   db 0C0h, 0, 0, 0, 0, 0, 0, 46h

  aqui      rw MAXP             ; where this file is, ending in '\'
  datos     rw MAXP             ; aqui + datos\
  base      rw MAXP             ; where it is installed, ending in '\'
  lumad     rw MAXP
  comidad   rw MAXP
  bind      rw MAXP
  casad     rw MAXP
  pdpd      rw MAXP
  fuend     rw MAXP
  r1        rw 2 * MAXP
  r2        rw 2 * MAXP
  cmd       rw 4 * MAXP
  nombre    rw MAXP

  binfo     dq 0, 0             ; BROWSEINFOW: no owner, from the root
            dq nombre           ; (a folder's name, not used)
            dq s_donde
            dd 41h, 0           ; BIF_RETURNONLYFSDIRS | BIF_NEWDIALOGSTYLE
            dq 0, 0
            dd 0, 0
  sa        dd 24, 0
            dq 0
            dd 1, 0
  sinf      STARTUPINFO
  pinf      PROCESS_INFORMATION
  callado   dq 0                ; 1: a folder was given, nothing is asked or said
  conserva  dq 0                ; 1: a Luma is there and what she knows is kept
  argc      dd 0, 0
  hdec      dq 0
  harch     dq 0
  hmapa     dq 0
  vista     dq 0
  tam       dq 0
  crudo     dq 0
  pack      dq 0
  buf       dq 0
  hsal      dq 0
  escrito   dq 0
  hlog      dq 0
  psl       dq 0
  ppf       dq 0

section '.text' code readable executable

macro une d, a, b
{       invoke  lstrcpyW, d, a
        invoke  lstrcatW, d, b }

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

; rcx = a path: it ends in '\' (one is added if it does not)
con_barra:
        mov     rax, rcx
.l:     cmp     word [rax], 0
        je      .f
        add     rax, 2
        jmp     .l
.f:     cmp     rax, rcx
        je      .pon
        cmp     word [rax - 2], '\'
        je      .r
.pon:   mov     word [rax], '\'
        mov     word [rax + 2], 0
.r:     ret

start:
        sub     rsp, 8
        invoke  CoInitialize, 0
        ; where this file is, and its datos\
        invoke  GetModuleFileNameW, 0, aqui, MAXP - 60
        lea     rax, [aqui]
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
        jz      fin
        mov     word [rdx + 2], 0
        une     datos, aqui, s_datos
        ; a folder given: installed there, asking nothing
        invoke  GetCommandLineW
        invoke  CommandLineToArgvW, rax, argc
        cmp     [argc], 2
        jb      .pregunta
        mov     rbx, [rax + 8]
        invoke  lstrcpyW, base, rbx
        mov     [callado], 1
        jmp     .sabida
.pregunta:
        invoke  SHBrowseForFolderW, binfo
        test    rax, rax
        jz      fin                     ; (nothing chosen: nothing done)
        invoke  SHGetPathFromIDListW, rax, base
        test    eax, eax
        jz      fin
.sabida:
        lea     rcx, [base]
        call    con_barra
        une     lumad, base, s_luma
        une     comidad, base, s_comida
        une     bind, lumad, s_bin
        une     casad, lumad, s_casa
        une     pdpd, bind, s_pdp
        une     fuend, pdpd, s_fuen
        ; the package is here?
        une     r1, datos, s_kernel
        invoke  GetFileAttributesW, r1
        cmp     eax, -1
        jne     .hay
        lea     rdx, [s_e_datos]
        jmp     error
.hay:
        ; a Luma lives there already?
        une     r1, casad, s_h_vida
        invoke  GetFileAttributesW, r1
        cmp     eax, -1
        je      .carpetas
        mov     [conserva], 1
        cmp     [callado], 0
        jne     .carpetas
        invoke  MessageBoxW, 0, s_ya, s_tit, 24h       ; MB_YESNO | MB_ICONQUESTION
        cmp     eax, 6                                  ; IDYES
        je      .carpetas
        mov     [conserva], 0
.carpetas:
        invoke  CreateDirectoryW, base, 0
        invoke  CreateDirectoryW, lumad, 0
        invoke  CreateDirectoryW, comidad, 0
        invoke  CreateDirectoryW, bind, 0
        invoke  CreateDirectoryW, casad, 0
        invoke  CreateDirectoryW, pdpd, 0
        invoke  CreateDirectoryW, fuend, 0
        ; her kernel, what wakes her, her assembler's seed
        une     r1, datos, s_kernel
        une     r2, bind, s_kernel
        call    copia
        une     r1, datos, s_lanza
        une     r2, lumad, s_lanza
        call    copia
        une     r1, datos, s_ens
        une     r2, pdpd, s_ens
        call    copia
        une     r1, datos, s_ensd
        une     r2, pdpd, s_ensd
        call    copia
        une     r1, datos, s_plan
        une     r2, pdpd, s_plan
        call    copia
        ; her source, and she is assembled by her own assembler
        invoke  CreateDecompressor, 2, 0, hdec          ; COMPRESS_ALGORITHM_MSZIP
        une     r1, datos, s_pfuen
        lea     rsi, [r1]
        lea     rdi, [fuend]
        call    desempaca
        invoke  lstrcpyW, r1, fuend
        lea     rcx, [r1]
        call    barras
        invoke  lstrlenW, r1                            ; (without its last '/')
        mov     word [r1 + rax * 2 - 2], 0
        invoke  SetEnvironmentVariableW, s_e_arch, r1
        invoke  SetEnvironmentVariableW, s_e_camb, s_cero
        invoke  lstrcpyW, cmd, s_q
        invoke  lstrcatW, cmd, bind
        invoke  lstrcatW, cmd, s_kernel
        invoke  lstrcatW, cmd, s_qens                   ; (her kernel splits what it is given at each blank: her
                                                        ; assembler is named alone, and it is started where it is)
        une     r1, bind, s_log
        invoke  CreateFileW, r1, GENERIC_WRITE, 3, sa, CREATE_ALWAYS, 0, 0
        mov     [hlog], rax
        lea     rdi, [sinf]
        mov     ecx, sizeof.STARTUPINFO
        xor     eax, eax
        rep     stosb
        mov     [sinf.cb], sizeof.STARTUPINFO
        mov     [sinf.dwFlags], 100h                    ; STARTF_USESTDHANDLES
        mov     rax, [hlog]
        mov     [sinf.hStdOutput], rax
        mov     [sinf.hStdError], rax
        invoke  CreateProcessW, 0, cmd, 0, 0, 1, 08000000h, 0, pdpd, sinf, pinf
        mov     ebx, eax
        invoke  CloseHandle, [hlog]
        test    ebx, ebx
        jz      .no_armo
        invoke  WaitForSingleObject, [pinf.hProcess], -1
        invoke  CloseHandle, [pinf.hProcess]
        invoke  CloseHandle, [pinf.hThread]
        invoke  SetEnvironmentVariableW, s_e_arch, 0
        invoke  SetEnvironmentVariableW, s_e_camb, 0
        une     r1, fuend, s_h_luma
        une     r2, bind, s_lumab
        invoke  CopyFileW, r1, r2, 0
        test    eax, eax
        jz      .no_armo
        une     r1, fuend, s_h_pulso
        une     r2, bind, s_pulso
        invoke  CopyFileW, r1, r2, 0
        test    eax, eax
        jnz     .armada
.no_armo:
        lea     rdx, [s_e_arma]
        jmp     error
.armada:
        ; her knowledge (kept, if she lives there and it was asked so)
        cmp     [conserva], 0
        jne     .sabe
        une     r1, datos, s_pcasa
        lea     rsi, [r1]
        lea     rdi, [casad]
        call    desempaca
.sabe:
        ; her reader and her thinker are herself: the same program, in her house (luma.sh did this)
        une     r1, bind, s_lumab
        une     r2, casad, s_h_lect
        call    copia
        une     r2, casad, s_h_pens
        call    copia
        une     r1, bind, s_pulso
        une     r2, casad, s_h_molde
        call    copia
        ; the two shortcuts on the desktop
        invoke  SHGetFolderPathW, 0, 10h, 0, 0, nombre  ; CSIDL_DESKTOPDIRECTORY
        une     r1, lumad, s_lanza
        une     r2, nombre, s_lnk1
        lea     rsi, [r1]
        lea     rdi, [r2]
        lea     r12, [lumad]
        lea     r13, [s_d1]
        call    acceso
        une     r2, nombre, s_lnk2
        lea     rsi, [comidad]
        lea     rdi, [r2]
        lea     r12, [comidad]
        lea     r13, [s_d2]
        call    acceso
        cmp     [callado], 0
        jne     fin
        invoke  MessageBoxW, 0, s_listo, s_tit, 44h    ; MB_YESNO | MB_ICONINFORMATION
        cmp     eax, 6
        jne     fin
        une     r1, lumad, s_lanza
        invoke  ShellExecuteW, 0, 0, r1, 0, lumad, 1
fin:
        invoke  ExitProcess, 0

; rdx = what went wrong: said (unless nothing is to be said), and it ends with 1
error:
        cmp     [callado], 0
        jne     .calla
        invoke  MessageBoxW, 0, rdx, s_tit, 10h
.calla: invoke  ExitProcess, 1

; r1 -> r2, a file; it must be copied
copia:
        sub     rsp, 40
        invoke  CopyFileW, r1, r2, 0
        add     rsp, 40
        test    eax, eax
        jnz     .r
        lea     rdx, [s_e_copia]
        jmp     error
.r:     ret

; rsi = a packet, rdi = a folder ending in '\': each file of the packet, unpacked there
desempaca:
        push    rbx rsi rdi r12 r13 r14 r15
        sub     rsp, 64
        invoke  CreateFileW, rsi, GENERIC_READ, 1, 0, OPEN_EXISTING, 0, 0
        cmp     rax, -1
        je      .mal
        mov     [harch], rax
        invoke  GetFileSizeEx, [harch], tam
        invoke  CreateFileMappingW, [harch], 0, 2, 0, 0, 0     ; PAGE_READONLY
        test    rax, rax
        jz      .mal
        mov     [hmapa], rax
        invoke  MapViewOfFile, [hmapa], 4, 0, 0, 0             ; FILE_MAP_READ
        test    rax, rax
        jz      .mal
        mov     [vista], rax
        mov     rbx, rax
        mov     r15, rax
        add     r15, [tam]
.otro:  cmp     rbx, r15
        jae     .listo
        invoke  lstrcpyW, r2, rdi
        invoke  lstrlenW, r2
        lea     rdx, [r2 + rax * 2]
        mov     ecx, [rbx]
        lea     r8, [rbx + 4]
.nom:   test    ecx, ecx
        jz      .nomd
        movzx   eax, byte [r8]
        mov     [rdx], ax
        inc     r8
        add     rdx, 2
        dec     ecx
        jmp     .nom
.nomd:  mov     word [rdx], 0
        mov     rax, [r8]
        mov     [crudo], rax
        mov     rax, [r8 + 8]
        mov     [pack], rax
        lea     rbx, [r8 + 16]
        mov     [buf], 0
        cmp     [crudo], 0
        je      .escribe
        invoke  VirtualAlloc, 0, [crudo], 3000h, 4             ; MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .mal
        mov     [buf], rax
        invoke  Decompress, [hdec], rbx, [pack], [buf], [crudo], escrito
        test    eax, eax
        jz      .mal
.escribe:
        invoke  CreateFileW, r2, GENERIC_WRITE, 0, 0, CREATE_ALWAYS, 0, 0
        cmp     rax, -1
        je      .mal
        mov     [hsal], rax
        cmp     [crudo], 0
        je      .cierra
        invoke  WriteFile, [hsal], [buf], dword [crudo], escrito, 0
        test    eax, eax
        jz      .mal
.cierra:
        invoke  CloseHandle, [hsal]
        cmp     [buf], 0
        je      .sig
        invoke  VirtualFree, [buf], 0, 8000h                   ; MEM_RELEASE
.sig:   add     rbx, [pack]
        jmp     .otro
.listo: invoke  UnmapViewOfFile, [vista]
        invoke  CloseHandle, [hmapa]
        invoke  CloseHandle, [harch]
        add     rsp, 64
        pop     r15 r14 r13 r12 rdi rsi rbx
        ret
.mal:   lea     rdx, [s_e_paq]
        jmp     error

; a shortcut: rsi = what it opens, rdi = the shortcut's file, r12 = the folder it starts in, r13 = what it says
acceso:
        push    rbx
        sub     rsp, 48
        invoke  CoCreateInstance, CLSID_ShellLink, 0, 1, IID_IShellLinkW, psl   ; CLSCTX_INPROC_SERVER
        test    eax, eax
        jnz     .r
        mov     rcx, [psl]
        mov     rax, [rcx]
        mov     rdx, rsi
        call    qword [rax + 20 * 8]    ; IShellLinkW::SetPath
        mov     rcx, [psl]
        mov     rax, [rcx]
        mov     rdx, r12
        call    qword [rax + 9 * 8]     ; SetWorkingDirectory
        mov     rcx, [psl]
        mov     rax, [rcx]
        mov     rdx, r13
        call    qword [rax + 7 * 8]     ; SetDescription
        mov     rcx, [psl]
        mov     rax, [rcx]
        lea     rdx, [IID_IPersistFile]
        lea     r8, [ppf]
        call    qword [rax]             ; QueryInterface
        test    eax, eax
        jnz     .suelta
        mov     rcx, [ppf]
        mov     rax, [rcx]
        mov     rdx, rdi
        mov     r8d, 1
        call    qword [rax + 6 * 8]     ; IPersistFile::Save
        mov     rcx, [ppf]
        mov     rax, [rcx]
        call    qword [rax + 2 * 8]     ; Release
.suelta:
        mov     rcx, [psl]
        mov     rax, [rcx]
        call    qword [rax + 2 * 8]     ; Release
.r:     add     rsp, 48
        pop     rbx
        ret

section '.idata' import data readable writeable

  library kernel32, 'KERNEL32.DLL', user32, 'USER32.DLL', shell32, 'SHELL32.DLL', ole32, 'OLE32.DLL', cabinet, 'CABINET.DLL'

  import kernel32,\
         GetModuleFileNameW, 'GetModuleFileNameW',\
         GetCommandLineW, 'GetCommandLineW',\
         lstrcpyW, 'lstrcpyW',\
         lstrcatW, 'lstrcatW',\
         lstrlenW, 'lstrlenW',\
         GetFileAttributesW, 'GetFileAttributesW',\
         CreateDirectoryW, 'CreateDirectoryW',\
         CopyFileW, 'CopyFileW',\
         SetEnvironmentVariableW, 'SetEnvironmentVariableW',\
         CreateFileW, 'CreateFileW',\
         GetFileSizeEx, 'GetFileSizeEx',\
         CreateFileMappingW, 'CreateFileMappingW',\
         MapViewOfFile, 'MapViewOfFile',\
         UnmapViewOfFile, 'UnmapViewOfFile',\
         VirtualAlloc, 'VirtualAlloc',\
         VirtualFree, 'VirtualFree',\
         WriteFile, 'WriteFile',\
         CreateProcessW, 'CreateProcessW',\
         WaitForSingleObject, 'WaitForSingleObject',\
         CloseHandle, 'CloseHandle',\
         ExitProcess, 'ExitProcess'

  import user32,\
         MessageBoxW, 'MessageBoxW'

  import shell32,\
         CommandLineToArgvW, 'CommandLineToArgvW',\
         SHBrowseForFolderW, 'SHBrowseForFolderW',\
         SHGetPathFromIDListW, 'SHGetPathFromIDListW',\
         SHGetFolderPathW, 'SHGetFolderPathW',\
         ShellExecuteW, 'ShellExecuteW'

  import ole32,\
         CoInitialize, 'CoInitialize',\
         CoCreateInstance, 'CoCreateInstance'

  import cabinet,\
         CreateDecompressor, 'CreateDecompressor',\
         Decompress, 'Decompress'
