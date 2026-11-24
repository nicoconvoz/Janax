; Janax's own screen, on the host: the Windows implementation. Another host provides its own pantalla.inc with
; the same entry points (screen_show, screen_end) and the same answers; the kernel's "show" (kind 40) only calls them.
; Included twice: with PANTALLA_PARTE = 0 in the data section (its state), with 1 in the code section.
; What happens on the window (the pointer, its buttons, the keys, a new size, its closing) is kept in a ring for the
; programs (41, screen_take); each one rings the host's bell scr_event, and the kernel wakes whoever sleeps on it.
; The window lives in a host thread of its own (its message loop), started by the first show; the kernel and that
; thread share the pixels under scr_lock. JANAX_SIN_VENTANA (any value): the same decoding and answers, no window.
; JANAX_VENTANA_FONDO (any value): the window is born behind every other one, just above the desktop, and never
; takes the keyboard from who has it (the Capitan, 2026-11-20: "que inicie debajo de todo, arriba del escritorio,
; como ultima pantalla": a program that is born many times a day must not interrupt). A click brings it up as any.

if PANTALLA_PARTE = 0

  SCR_SIDE  = 4096              ; the longest side a cloud may have, in cells
  SCR_WORKAREA = 30h            ; SystemParametersInfoW: the desktop the host leaves free (no taskbar)
  SCR_REDRAW = 3                ; CS_VREDRAW | CS_HREDRAW: a new size repaints the whole window
  scr_quiet_env db 'JANAX_SIN_VENTANA', 0
  scr_back_env db 'JANAX_VENTANA_FONDO', 0
  scr_class_name du 'JanaxPantalla', 0
  scr_title du 'Janax', 0         ; the window's title (kind 43 changes it: screen_title)
            rw SCR_TITLE_MAX - 5
SCR_TITLE_MAX = 512               ; the letters a title keeps (criterion: what any window shows, many times over)
  scr_ready db 0                ; the lock is built and the host asked about the window
  scr_quiet db 0                ; 1: never a window
  scr_back  db 0                ; 1: born behind the others, without taking the keyboard
  align 8
  scr_lock  rb 40               ; CRITICAL_SECTION: the pixels, their size and the bitmap header
  scr_pix   dq 0                ; the pixels: a 32-bit top-down DIB (BGRA), one per cell
  scr_cap   dq 0                ; its bytes
  scr_w     dq 0
  scr_h     dq 0
  scr_bits  dq 0                ; screen_show: where the cells and the colours start in the cloud
  scr_rgb   dq 0
  scr_thread dq 0               ; the window's thread (0: never opened)
  scr_hwnd  dq 0                ; the window, while it lives
  scr_midi  dq 0                ; the host's synthesizer (kind 44): 0 not asked yet, 1 open, -1 the host has none
  scr_midi_h dq 0               ; its handle
  scr_bmi   dd 40, 0, 0         ; BITMAPINFOHEADER: size, width, -height (top-down)
            dw 1, 32            ; planes, bits per pixel
            dd 0, 0, 0, 0, 0, 0 ; BI_RGB, and the rest 0
  scr_class dd 80, SCR_REDRAW   ; WNDCLASSEXW: size, style
            dq 0                ; the window procedure
            dd 0, 0             ; extra bytes
            dq 0, 0, 0, 0, 0, 0, 0   ; instance, icon, cursor, background, menu, class name, small icon
  scr_rect  dd 4 dup 0          ; RECT for AdjustWindowRectEx
  scr_work  dd 4 dup 0          ; RECT of the free desktop, when the window is born
  scr_crect dd 4 dup 0          ; RECT of the client area, when it paints
  scr_msg   rb 48               ; MSG
  scr_ps    rb 80               ; PAINTSTRUCT
  SCR_RING  = 256               ; events kept until a program takes them: a power of two. Moves that follow each
                                ; other are one, so it fills only with clicks and keys nobody takes (then the oldest goes)
  scr_live  db 0                ; 1: the window was opened and is not closed yet (someone may sleep on it)
  align 8
  scr_event dq 0                ; the host's bell (auto-reset) that rings at each event kept
  scr_head  dq 0                ; the oldest event kept, and how many
  scr_count dq 0
  scr_paste dq 0                ; Ctrl+V: the host's clipboard as it was (UTF-16 units, its own room, as big as it is)
  scr_pastelen dq 0             ; its units, and the next one to give: given as letters typed, one each time a program
  scr_pastepos dq 0             ; takes an event and the ring has none (screen_take)
  scr_copy  dq 0                ; 47: the text a program copies (UTF-16 units, its own room), and its units: the
  scr_copylen dq 0              ; window's thread puts it on the host's clipboard (message 8002h)
  scr_lastx dq -1               ; the pointer's last cell (a key says where it was)
  scr_lasty dq -1
  scr_high  dq 0                ; the first half of a surrogate pair, while the second has not come (0: none)
  scr_erect dd 4 dup 0          ; RECT of the client area, when an event arrives
  scr_ring  rb SCR_RING * 32    ; {kind, x, y, extra} each

else

; rax = a MIDI message of three bytes (status, note, strength: its low 24 bits) -> rax = 1 it sounded, 0 no window,
; -1 the host has no synthesizer. Sound belongs to the window (the Capitan, 2026-11-22: "quiero ver la musica", and
; hear it): what the user sees and hears is one door, so without a window nothing sounds (the tests, and
; JANAX_SIN_VENTANA, are silent and answer the same). The host's own synthesizer (MIDI_MAPPER), opened at the first
; note. Keeps rbx, rbp, r12-r15.
screen_sound:
        push    rsi rdi
        sub     rsp, 8
        mov     rsi, rax
        xor     eax, eax
        cmp     qword [scr_hwnd], 0
        je      .done
        cmp     qword [scr_midi], 0
        jne     .opened
        invoke  midiOutOpen, scr_midi_h, -1, 0, 0, 0
        inc     qword [hostcalls]
        mov     qword [scr_midi], 1
        test    eax, eax
        jz      .opened
        mov     qword [scr_midi], -1
.opened:
        mov     rax, -1
        cmp     qword [scr_midi], 1
        jne     .done
        mov     edx, esi
        and     edx, 0FFFFFFh
        invoke  midiOutShortMsg, [scr_midi_h], rdx
        test    eax, eax
        mov     eax, 1
        jz      .done
        mov     rax, -1
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; rsi = a text (a pointer in this process), rcx = its bytes -> rax = the letters the window's title got (each byte one
; letter; past SCR_TITLE_MAX they are left out). If the window lives it is renamed by its own thread (a message: no
; window is touched from another thread); if it is not built yet, it is born with this title. Keeps rbx, rbp, r12-r15.
screen_title:
        push    rsi rdi
        mov     rax, rcx
        cmp     rax, SCR_TITLE_MAX
        jb      @f
        mov     rax, SCR_TITLE_MAX
@@:     lea     rdi, [scr_title]
        xor     ecx, ecx
        jmp     .copy
.copy_lap:
        movzx   edx, byte [rsi + rcx]
        mov     [rdi + rcx*2], dx
        inc     rcx
.copy:
        cmp     rcx, rax
        jb      .copy_lap
        mov     word [rdi + rcx*2], 0
        mov     rcx, [scr_hwnd]
        test    rcx, rcx
        jz      .done
        push    rax                     ; (the stack is 16-aligned here: four pushes after the call)
        sub     rsp, 32
        invoke  PostMessageW, rcx, 8001h, 0, 0
        add     rsp, 32
        pop     rax
.done:
        pop     rdi rsi
        ret

; rsi = a .nube version 3 cloud (a pointer in this process), rcx = its bytes -> rax = the particles of its first
; level now on the screen, or -1 if it is malformed: bad magic or version, no level, a size past its bytes, a side 0
; or longer than SCR_SIDE. Cell j of the level is pixel (j % width, j / width); an empty cell is black.
; Keeps rbx, rbp and r12-r15.
screen_show:
        push    r12 r13 r14 r15 rsi rdi
        sub     rsp, 8
        mov     r14, rsi                ; the cloud
        mov     r15, rcx                ; its bytes
        cmp     r15, 12                 ; "NUBE", version, fine step, bones, levels
        jb      .bad
        cmp     dword [r14], 'NUBE'
        jne     .bad
        cmp     byte [r14 + 4], 3
        jne     .bad
        movzx   eax, word [r14 + 9]     ; the bones, 42 bytes each
        imul    rax, 42
        lea     r8, [rax + 11]          ; where the number of levels is
        lea     rax, [r8 + 17]          ; and the end of the first level's header
        cmp     rax, r15
        ja      .bad
        cmp     byte [r14 + r8], 0
        je      .bad
        movzx   r12d, word [r14 + r8 + 13]   ; width (after step, k0x, k0y)
        movzx   r13d, word [r14 + r8 + 15]   ; height
        test    r12d, r12d
        jz      .bad
        test    r13d, r13d
        jz      .bad
        cmp     r12d, SCR_SIDE
        ja      .bad
        cmp     r13d, SCR_SIDE
        ja      .bad
        lea     r9, [r14 + r8 + 17]     ; the cells, a bit each
        mov     [scr_bits], r9
        mov     r10, r12
        imul    r10, r13                ; how many
        lea     rax, [r10 + 7]
        shr     rax, 3
        lea     r11, [r8 + 17 + rax]    ; where the colours start
        cmp     r11, r15
        ja      .bad
        add     r11, r14
        mov     [scr_rgb], r11
        xor     ecx, ecx                ; the particles: the cells set
        xor     edi, edi
        jmp     .count
.count_lap:
        mov     rax, rcx
        shr     rax, 3
        movzx   eax, byte [r9 + rax]
        mov     edx, ecx
        and     edx, 7
        bt      eax, edx
        adc     rdi, 0
        inc     rcx
.count:                                 ; while cells are left
        cmp     rcx, r10
        jb      .count_lap
        lea     rax, [rdi*3]            ; 3 bytes of colour each
        sub     r11, r14
        add     rax, r11
        cmp     rax, r15
        ja      .bad

        cmp     byte [scr_ready], 0
        jne     .ready
        invoke  InitializeCriticalSection, scr_lock
        mov     byte [scr_ready], 1
        invoke  GetEnvironmentVariableA, scr_quiet_env, env_value, 31
        test    eax, eax
        jz      .ready
        mov     byte [scr_quiet], 1
.ready:
        invoke  GetEnvironmentVariableA, scr_back_env, env_value, 31
        test    eax, eax
        jz      @f
        mov     byte [scr_back], 1
@@:
        invoke  EnterCriticalSection, scr_lock
        mov     rsi, r12
        imul    rsi, r13
        shl     rsi, 2                  ; the pixels' bytes
        cmp     rsi, [scr_cap]
        jbe     .room
        cmp     qword [scr_pix], 0
        je      @f
        invoke  VirtualFree, [scr_pix], 0, MEM_RELEASE
@@:     mov     qword [scr_pix], 0
        mov     qword [scr_cap], 0
        invoke  VirtualAlloc, 0, rsi, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .no_room
        mov     [scr_pix], rax
        mov     [scr_cap], rsi
.room:
        mov     r11, [scr_pix]
        mov     rsi, [scr_bits]
        mov     r8, [scr_rgb]
        mov     r10, r12
        imul    r10, r13
        xor     ecx, ecx
        jmp     .cell
.cell_lap:
        mov     rax, rcx
        shr     rax, 3
        movzx   eax, byte [rsi + rax]
        mov     edx, ecx
        and     edx, 7
        xor     r9d, r9d                ; black
        bt      eax, edx
        jnc     .dark
        movzx   r9d, byte [r8]          ; R G B in the cloud, B G R A in the pixel
        shl     r9d, 16
        movzx   eax, byte [r8 + 1]
        shl     eax, 8
        or      r9d, eax
        movzx   eax, byte [r8 + 2]
        or      r9d, eax
        add     r8, 3
.dark:
        mov     [r11 + rcx*4], r9d
        inc     rcx
.cell:                                  ; while cells are left
        cmp     rcx, r10
        jb      .cell_lap
        mov     [scr_w], r12
        mov     [scr_h], r13
        mov     dword [scr_bmi + 4], r12d
        mov     eax, r13d
        neg     eax
        mov     dword [scr_bmi + 8], eax
        invoke  LeaveCriticalSection, scr_lock

        cmp     byte [scr_quiet], 0
        jne     .done
        cmp     qword [scr_thread], 0
        jne     .repaint
        invoke  CreateEventA, 0, 0, 0, 0       ; the bell of its events
        mov     [scr_event], rax
        mov     byte [scr_live], 1
        invoke  CreateThread, 0, 0, screen_thread, 0, 0, 0
        inc     qword [hostcalls]
        mov     [scr_thread], rax
        jmp     .done
.repaint:
        mov     rax, [scr_hwnd]
        test    rax, rax
        jz      .done                   ; closed, or not built yet (it paints these pixels when it is)
        invoke  InvalidateRect, rax, 0, 0
        inc     qword [hostcalls]
.done:
        mov     rax, rdi
        jmp     .out
.no_room:
        invoke  LeaveCriticalSection, scr_lock
.bad:
        mov     rax, -1
.out:
        add     rsp, 8
        pop     rdi rsi r15 r14 r13 r12
        ret

; The system is about to end: if a window was opened, wait until the user closes it.
screen_end:
        cmp     qword [scr_thread], 0
        je      .none
        sub     rsp, 8
        invoke  WaitForSingleObject, [scr_thread], -1
        add     rsp, 8
.none:
        ret

; The window's thread: its class, the window sized to the cloud (the largest whole scale whose window, frame
; included, fits in the free desktop of the screen it meets, at least 1), and its own message loop until the
; window is closed. No size is fixed: the host's screen decides.
screen_thread:
        push    rbx rsi rdi r12
        sub     rsp, 8
        mov     rax, [gs:60h]           ; the PEB: this program's own instance
        mov     rbx, [rax + 10h]
        mov     qword [scr_class + 24], rbx
        invoke  LoadCursorW, 0, IDC_ARROW
        mov     qword [scr_class + 40], rax
        lea     rax, [screen_proc]
        mov     qword [scr_class + 8], rax
        lea     rax, [scr_class_name]
        mov     qword [scr_class + 64], rax
        invoke  RegisterClassExW, scr_class
        invoke  EnterCriticalSection, scr_lock
        mov     rsi, [scr_w]
        mov     rdi, [scr_h]
        invoke  LeaveCriticalSection, scr_lock
        invoke  SystemParametersInfoW, SCR_WORKAREA, 0, scr_work, 0
        mov     dword [scr_rect], 0     ; the frame alone: a client of 0 x 0
        mov     dword [scr_rect + 4], 0
        mov     dword [scr_rect + 8], 0
        mov     dword [scr_rect + 12], 0
        invoke  AdjustWindowRectEx, scr_rect, WS_OVERLAPPEDWINDOW, 0, 0
        mov     eax, [scr_work + 8]     ; the free width, less the frame's
        sub     eax, [scr_work]
        sub     eax, [scr_rect + 8]
        add     eax, [scr_rect]
        jg      @f
        mov     eax, 1
@@:     xor     edx, edx
        div     esi
        mov     r12d, eax
        mov     eax, [scr_work + 12]    ; the free height, less the frame's
        sub     eax, [scr_work + 4]
        sub     eax, [scr_rect + 12]
        add     eax, [scr_rect + 4]
        jg      @f
        mov     eax, 1
@@:     xor     edx, edx
        div     edi
        cmp     eax, r12d
        cmovb   r12d, eax
        test    r12d, r12d
        jnz     @f
        inc     r12d                    ; at least one pixel per cell
@@:     imul    esi, r12d
        imul    edi, r12d
        mov     dword [scr_rect], 0
        mov     dword [scr_rect + 4], 0
        mov     dword [scr_rect + 8], esi
        mov     dword [scr_rect + 12], edi
        invoke  AdjustWindowRectEx, scr_rect, WS_OVERLAPPEDWINDOW, 0, 0
        mov     esi, [scr_rect + 8]
        sub     esi, [scr_rect]
        mov     edi, [scr_rect + 12]
        sub     edi, [scr_rect + 4]
        invoke  CreateWindowExW, 0, scr_class_name, scr_title, WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, rsi, rdi, 0, 0, rbx, 0
        test    rax, rax
        jz      .out
        mov     r12, rax
        cmp     byte [scr_back], 0
        je      .front
        invoke  SetWindowPos, r12, 1, 0, 0, 0, 0, 53h   ; HWND_BOTTOM; no move, no size, no activation, shown
        jmp     .shown
.front:
        invoke  ShowWindow, r12, SW_SHOW
.shown:
        invoke  UpdateWindow, r12
        jmp     .message
.message_lap:
        invoke  TranslateMessage, scr_msg
        invoke  DispatchMessageW, scr_msg
.message:                               ; while the window lives (0 = closed, -1 = the host failed)
        invoke  GetMessageW, scr_msg, 0, 0, 0
        test    eax, eax
        jg      .message_lap
.out:
        mov     byte [scr_live], 0      ; the window is gone (or was never built): nobody may sleep on it
        invoke  SetEvent, [scr_event]   ; (and whoever sleeps on it wakes)
        xor     eax, eax
        add     rsp, 8
        pop     r12 rdi rsi rbx
        ret

; The window procedure: paints the pixels as big as the client area allows with the cloud's own proportions,
; centred, nearest cell, no smoothing; what is left around is black. Whatever size it is given, it fills.
screen_proc:
        cmp     edx, WM_NCCREATE
        jne     @f
        mov     [scr_hwnd], rcx         ; from here on a show repaints it
@@:     cmp     edx, WM_NCDESTROY
        jne     @f
        mov     qword [scr_hwnd], 0
@@:     cmp     edx, 8001h              ; its title changed (screen_title): renamed here, by its own thread
        jne     @f
        sub     rsp, 40
        lea     rdx, [scr_title]
        call    [SetWindowTextW]
        add     rsp, 40
        xor     eax, eax
        ret
@@:     cmp     edx, 8002h              ; a text to copy (screen_copy): put on the host's clipboard here, by its own thread
        jne     @f
        call    screen_clip
        xor     eax, eax
        ret
@@:     cmp     edx, WM_PAINT
        je      .paint
        cmp     edx, WM_DESTROY
        je      .destroy
        cmp     edx, WM_MOUSEMOVE       ; the pointer and its buttons, the keys, a new size: kept for the programs
        jb      @f
        cmp     edx, WM_RBUTTONUP
        jbe     .note
@@:     cmp     edx, WM_KEYDOWN
        je      .note
        cmp     edx, WM_CHAR
        je      .note
        cmp     edx, WM_SIZE
        je      .note
        cmp     edx, WM_ACTIVATE        ; (it became the window in use, or stopped being it: minimized too)
        je      .note
        jmp     [DefWindowProcW]
.note:
        call    screen_note
        jmp     [DefWindowProcW]
.destroy:
        call    screen_note             ; closed: the programs are told
        sub     rsp, 8
        invoke  PostQuitMessage, 0
        add     rsp, 8
        xor     eax, eax
        ret
.paint:
        push    rbx rsi rdi r12 r13 r14 r15
        mov     rbx, rcx
        invoke  BeginPaint, rbx, scr_ps
        mov     rsi, rax                ; the device context
        invoke  GetClientRect, rbx, scr_crect
        mov     r12d, [scr_crect + 8]   ; the client's width and height
        mov     edi, [scr_crect + 12]
        invoke  PatBlt, rsi, 0, 0, r12, rdi, BLACKNESS
        invoke  SetStretchBltMode, rsi, COLORONCOLOR
        invoke  EnterCriticalSection, scr_lock
        cmp     qword [scr_pix], 0
        je      .unlock
        mov     r8, [scr_w]
        mov     r9, [scr_h]
        mov     rax, r12                ; width * h against height * w: which side runs out first
        imul    rax, r9
        mov     rcx, rdi
        imul    rcx, r8
        cmp     rax, rcx
        jbe     .by_width
        mov     r14, rdi                ; the height fills; the width follows the proportions
        mov     rax, r8
        imul    rax, rdi
        xor     edx, edx
        div     r9
        mov     r13, rax
        jmp     .place
.by_width:
        mov     r13, r12                ; the width fills; the height follows
        mov     rax, r9
        imul    rax, r12
        xor     edx, edx
        div     r8
        mov     r14, rax
.place:
        mov     r15, r12                ; centred
        sub     r15, r13
        shr     r15, 1
        sub     rdi, r14
        shr     rdi, 1
        invoke  StretchDIBits, rsi, r15, rdi, r13, r14, 0, 0, [scr_w], [scr_h], [scr_pix], scr_bmi, 0, SRCCOPY
.unlock:
        invoke  LeaveCriticalSection, scr_lock
        invoke  EndPaint, rbx, scr_ps
        xor     eax, eax
        pop     r15 r14 r13 r12 rdi rsi rbx
        ret

; The window's thread: the message edx (wParam r8, lParam r9) of window rcx, kept in the ring as an event
; {kind, x, y, extra}: 1 the pointer moved (extra: the buttons held, 1 left, 2 right), 2 a button went down and 3 up
; (extra 1 left, 2 right), 4 a key went down (extra: its virtual-key code; x, y where the pointer was), 5 the window
; closed (x, y = -1), 6 a new size (x, y: the client area in pixels), 7 a character was typed (extra: its Unicode
; code point, the two halves of a surrogate pair joined; x, y where the pointer was), 8 the window became the one in use
; (extra 1) or stopped being it, minimized too (extra 0; x, y = -1). The pointer's x, y are cells of the cloud shown,
; through the same proportions and centring the painting uses; -1, -1 outside the picture. A move right after
; another kept move takes its place. Then the bell rings: the kernel, asleep on it while nobody rows, wakes whoever
; sleeps on the screen (and a rower that ends a turn looks too). This thread never takes the kernel's lock: a rower
; asleep on the bells is only woken by them. Keeps every register; callable with any stack alignment.
screen_note:
        push    rax rbx rcx rdx rsi rdi r8 r9 r10 r11 r12 r13 r14 r15 rbp
        mov     rbp, rsp
        and     rsp, -16
        mov     rbx, rcx                ; the window
        mov     r12d, edx               ; the message
        mov     r13, r8                 ; wParam
        mov     r14, r9                 ; lParam
        cmp     r12d, WM_LBUTTONDOWN    ; a button held keeps the pointer's moves, even outside the window
        je      .capture
        cmp     r12d, WM_RBUTTONDOWN
        jne     @f
.capture:
        invoke  SetCapture, rbx
        jmp     .rect
@@:     cmp     r12d, WM_LBUTTONUP
        je      .release
        cmp     r12d, WM_RBUTTONUP
        jne     .rect
.release:
        invoke  ReleaseCapture
.rect:
        invoke  GetClientRect, rbx, scr_erect
        invoke  EnterCriticalSection, scr_lock
        mov     r15, -1                 ; x
        mov     rsi, -1                 ; y
        xor     edi, edi                ; extra
        cmp     r12d, WM_MOUSEMOVE
        je      .move
        cmp     r12d, WM_LBUTTONDOWN
        je      .left_down
        cmp     r12d, WM_LBUTTONUP
        je      .left_up
        cmp     r12d, WM_RBUTTONDOWN
        je      .right_down
        cmp     r12d, WM_RBUTTONUP
        je      .right_up
        cmp     r12d, WM_KEYDOWN
        je      .key
        cmp     r12d, WM_CHAR
        je      .char
        cmp     r12d, WM_SIZE
        je      .size
        cmp     r12d, WM_DESTROY
        je      .gone
        cmp     r12d, WM_ACTIVATE
        je      .act
        jmp     .unlock                 ; (another button message: not kept)
.move:
        mov     edi, r13d
        and     edi, 3                  ; MK_LBUTTON = 1, MK_RBUTTON = 2
        mov     r12d, 1
        jmp     .cell
.left_down:
        mov     edi, 1
        mov     r12d, 2
        jmp     .cell
.left_up:
        mov     edi, 1
        mov     r12d, 3
        jmp     .cell
.right_down:
        mov     edi, 2
        mov     r12d, 2
        jmp     .cell
.right_up:
        mov     edi, 2
        mov     r12d, 3
        jmp     .cell
.key:
        mov     rdi, r13
        mov     r12d, 4
        mov     r15, [scr_lastx]
        mov     rsi, [scr_lasty]
        jmp     .put
.char:
        movzx   edi, r13w               ; a UTF-16 unit
        cmp     edi, 16h                ; Ctrl+V: what the host's clipboard holds, given as letters typed
        je      .paste
        mov     eax, edi
        and     eax, 0FC00h
        cmp     eax, 0D800h             ; the first half of a pair: kept until the second comes
        jne     @f
        mov     [scr_high], rdi
        jmp     .unlock
@@:     cmp     eax, 0DC00h
        jne     .char_put
        mov     rax, [scr_high]         ; the second half: joined with the first (alone, it is not a character)
        test    rax, rax
        jz      .unlock
        sub     eax, 0D800h
        shl     eax, 10
        sub     edi, 0DC00h
        lea     edi, [rdi + rax + 10000h]
.char_put:
        mov     qword [scr_high], 0
        mov     r12d, 7
        mov     r15, [scr_lastx]
        mov     rsi, [scr_lasty]
        jmp     .put
.size:
        movzx   r15d, r14w
        mov     esi, r14d
        shr     esi, 16
        mov     r12d, 6
        jmp     .put
.act:
        xor     edi, edi                ; WA_INACTIVE (0) in the low word: not in use; anything else: in use
        test    r13w, r13w
        setnz   dil
        mov     r12d, 8
        jmp     .put
.paste:                                 ; (the screen's lock is held; rbx = the window)
        call    screen_paste_take
        invoke  LeaveCriticalSection, scr_lock
        invoke  SetEvent, [scr_event]   ; whoever sleeps on the screen wakes to take its letters
        jmp     .out
.gone:
        mov     byte [scr_live], 0      ; from here on nobody sleeps on it
        mov     r12d, 5
        jmp     .put
.cell:
        movsx   rax, r14w               ; the pixel, signed (with a button held it may be outside)
        mov     r10, r14
        shr     r10, 16
        movsx   r10, r10w
        call    screen_cell
        mov     [scr_lastx], r15
        mov     [scr_lasty], rsi
.put:
        mov     rax, [scr_count]
        cmp     r12d, 1
        jne     .new
        test    rax, rax
        jz      .new
        mov     rcx, [scr_head]         ; the last one kept is a move too: this one takes its place
        add     rcx, rax
        dec     rcx
        and     ecx, SCR_RING - 1
        shl     rcx, 5
        cmp     qword [scr_ring + rcx], 1
        je      .write
.new:
        cmp     rax, SCR_RING
        jb      .room
        mov     rcx, [scr_head]         ; full: the oldest one is lost
        inc     rcx
        and     ecx, SCR_RING - 1
        mov     [scr_head], rcx
        dec     rax
.room:
        lea     rcx, [rax + 1]
        mov     [scr_count], rcx
        add     rax, [scr_head]
        and     eax, SCR_RING - 1
        shl     rax, 5
        mov     rcx, rax
.write:
        mov     qword [scr_ring + rcx], r12
        mov     qword [scr_ring + rcx + 8], r15
        mov     qword [scr_ring + rcx + 16], rsi
        mov     qword [scr_ring + rcx + 24], rdi
        invoke  LeaveCriticalSection, scr_lock
        invoke  SetEvent, [scr_event]   ; the kernel wakes whoever sleeps on the screen (screen_due)
        jmp     .out
.unlock:
        invoke  LeaveCriticalSection, scr_lock
.out:
        mov     rsp, rbp
        pop     rbp r15 r14 r13 r12 r11 r10 r9 r8 rdi rsi rdx rcx rbx rax
        ret

; The pixel rax, r10 of the client area (scr_erect) -> r15, rsi = its cell of the cloud shown, as screen_proc paints
; it; -1, -1 if it falls outside the picture. With the screen's lock. Uses rax, rcx, rdx, r8-r11.
screen_cell:
        mov     r15, -1
        mov     rsi, -1
        mov     r8, [scr_w]
        test    r8, r8
        jz      .out
        mov     r9, [scr_h]
        push    rax r10
        mov     eax, [scr_erect + 8]    ; width * h against height * w: which side runs out first
        imul    rax, r9
        mov     ecx, [scr_erect + 12]
        imul    rcx, r8
        cmp     rax, rcx
        jbe     .by_width
        mov     r11d, [scr_erect + 12]  ; the height fills; the width follows the proportions
        mov     rax, r8
        imul    rax, r11
        xor     edx, edx
        div     r9
        mov     rcx, rax
        jmp     .place
.by_width:
        mov     ecx, [scr_erect + 8]    ; the width fills; the height follows
        mov     rax, r9
        imul    rax, rcx
        xor     edx, edx
        div     r8
        mov     r11, rax
.place:                                 ; rcx, r11 = the picture's width and height
        pop     r10 rax
        mov     edx, [scr_erect + 8]    ; centred
        sub     rdx, rcx
        shr     rdx, 1
        sub     rax, rdx
        js      .out
        cmp     rax, rcx
        jae     .out
        mov     edx, [scr_erect + 12]
        sub     rdx, r11
        shr     rdx, 1
        sub     r10, rdx
        js      .out
        cmp     r10, r11
        jae     .out
        imul    rax, r8                 ; its cell
        xor     edx, edx
        div     rcx
        mov     r15, rax
        mov     rax, r10
        imul    rax, r9
        xor     edx, edx
        div     r11
        mov     rsi, rax
.out:
        ret

; Ctrl+V (screen_note, the screen's lock held, rbx = the window): what the host's clipboard holds as text is kept, as
; big as it is, in its own room (the one kept before is let go). Keeps every register but rax; any stack alignment.
screen_paste_take:
        push    rbx rcx rdx rsi rdi r8 r9 r10 r11 r12 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        mov     rcx, rbx
        call    [OpenClipboard]
        test    eax, eax
        jz      .out
        mov     ecx, 13                 ; CF_UNICODETEXT
        call    [GetClipboardData]
        test    rax, rax
        jz      .close
        mov     rcx, rax
        mov     r12, rax
        call    [GlobalLock]
        test    rax, rax
        jz      .close
        mov     rsi, rax
        xor     ecx, ecx                ; its units, to the first 0
        jmp     .len
.len_lap:
        inc     rcx
.len:                                   ; while the unit is not the end
        cmp     word [rsi + rcx*2], 0
        jne     .len_lap
        mov     rdi, rcx
        mov     rcx, [scr_paste]        ; the one kept before: let go
        test    rcx, rcx
        jz      @f
        xor     edx, edx
        mov     r8d, MEM_RELEASE
        call    [VirtualFree]
        mov     qword [scr_paste], 0
@@:     mov     qword [scr_pastelen], 0
        mov     qword [scr_pastepos], 0
        test    rdi, rdi
        jz      .unlock
        xor     ecx, ecx
        lea     rdx, [rdi*2 + 2]
        mov     r8d, MEM_COMMIT + MEM_RESERVE
        mov     r9d, PAGE_READWRITE
        call    [VirtualAlloc]
        test    rax, rax
        jz      .unlock
        mov     [scr_paste], rax
        mov     [scr_pastelen], rdi
        xor     ecx, ecx
        jmp     .copy
.copy_lap:
        mov     dx, [rsi + rcx*2]
        mov     [rax + rcx*2], dx
        inc     rcx
.copy:                                  ; while units are left
        cmp     rcx, rdi
        jb      .copy_lap
.unlock:
        mov     rcx, r12
        call    [GlobalUnlock]
.close:
        call    [CloseClipboard]
.out:
        mov     rsp, rbp
        pop     rbp r12 r11 r10 r9 r8 rdi rsi rdx rcx rbx
        ret

; screen_take, its lock held, the ring empty: rdi = 32 bytes of the program's -> ebx = 1 and the next letter pasted
; written there as a letter typed (kind 7, where the pointer was): a pair of halves joined, a line's end as a space
; (what is pasted goes where she listens, to be said with Enter), a CR before it left out. ebx = 0 if none is left.
screen_paste_next:
        mov     rsi, [scr_paste]
        jmp     .more
.unit:
        movzx   eax, word [rsi + rcx*2]
        inc     rcx
        mov     [scr_pastepos], rcx
        cmp     eax, 13                 ; CR: left out (its LF, or nothing, follows)
        je      .more
        cmp     eax, 10
        je      .space
        cmp     eax, 9
        jne     @f
.space:
        mov     eax, 32
@@:     mov     edx, eax
        and     edx, 0FC00h
        cmp     edx, 0D800h             ; the first half of a pair: joined with the second
        jne     .put
        cmp     rcx, [scr_pastelen]
        jae     .more
        movzx   edx, word [rsi + rcx*2]
        mov     r8d, edx
        and     r8d, 0FC00h
        cmp     r8d, 0DC00h
        jne     .more                   ; (alone, it is not a letter)
        inc     rcx
        mov     [scr_pastepos], rcx
        sub     eax, 0D800h
        shl     eax, 10
        sub     edx, 0DC00h
        lea     eax, [rdx + rax + 10000h]
.put:
        mov     qword [rdi], 7
        mov     rdx, [scr_lastx]
        mov     [rdi + 8], rdx
        mov     rdx, [scr_lasty]
        mov     [rdi + 16], rdx
        mov     [rdi + 24], rax
        mov     ebx, 1
        ret
.more:                                  ; while units are left
        mov     rcx, [scr_pastepos]
        cmp     rcx, [scr_pastelen]
        jb      .unit
        xor     ebx, ebx                ; none is left
        ret

; 47: rsi = a text in UTF-8 (a pointer in this process), rcx = its bytes -> rax = its letters, 0 if no window lives, -1
; if it is not UTF-8. Kept in its own room (the one before is let go) and put on the host's clipboard by the window's
; own thread (message 8002h). Keeps rbx, rbp, r12-r15.
screen_copy:
        push    r12 r13 r14 rsi rdi
        sub     rsp, 32
        mov     r12, rsi
        mov     r13, rcx
        xor     eax, eax
        cmp     qword [scr_hwnd], 0
        je      .done
        mov     ecx, 65001              ; CP_UTF8: how many units
        mov     edx, 8                  ; MB_ERR_INVALID_CHARS
        mov     r8, r12
        mov     r9, r13
        sub     rsp, 16                 ; (the fifth and sixth arguments, past the shadow space)
        mov     qword [rsp + 32], 0
        mov     qword [rsp + 40], 0
        call    [MultiByteToWideChar]
        add     rsp, 16
        mov     r14, rax
        test    eax, eax
        jz      .bad
        xor     ecx, ecx
        lea     rdx, [r14*2 + 2]
        mov     r8d, MEM_COMMIT + MEM_RESERVE
        mov     r9d, PAGE_READWRITE
        call    [VirtualAlloc]
        test    rax, rax
        jz      .bad
        mov     rdi, rax
        mov     ecx, 65001
        mov     edx, 8
        mov     r8, r12
        mov     r9, r13
        sub     rsp, 16
        mov     [rsp + 32], rdi
        mov     [rsp + 40], r14
        call    [MultiByteToWideChar]
        add     rsp, 16
        lea     rcx, [scr_lock]
        call    [EnterCriticalSection]
        mov     rcx, [scr_copy]         ; the one before: let go
        mov     [scr_copy], rdi
        mov     [scr_copylen], r14
        test    rcx, rcx
        jz      @f
        xor     edx, edx
        mov     r8d, MEM_RELEASE
        call    [VirtualFree]
@@:     lea     rcx, [scr_lock]
        call    [LeaveCriticalSection]
        mov     rcx, [scr_hwnd]
        mov     edx, 8002h
        xor     r8d, r8d
        xor     r9d, r9d
        call    [PostMessageW]
        mov     rax, r14
        jmp     .done
.bad:
        mov     rax, -1
.done:
        add     rsp, 32
        pop     rdi rsi r14 r13 r12
        ret

; The window's thread, on 8002h: the text kept to copy goes to the host's clipboard. Keeps every register but rax.
screen_clip:
        push    rbx rcx rdx rsi rdi r8 r9 r10 r11 r12 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        mov     rbx, rcx                ; the window
        lea     rcx, [scr_lock]
        call    [EnterCriticalSection]
        mov     rsi, [scr_copy]
        mov     rdi, [scr_copylen]
        test    rsi, rsi
        jz      .unlock
        mov     rcx, rbx
        call    [OpenClipboard]
        test    eax, eax
        jz      .unlock
        call    [EmptyClipboard]
        mov     ecx, 2                  ; GMEM_MOVEABLE
        lea     rdx, [rdi*2 + 2]
        call    [GlobalAlloc]
        test    rax, rax
        jz      .close
        mov     r12, rax
        mov     rcx, rax
        call    [GlobalLock]
        test    rax, rax
        jz      .close
        xor     ecx, ecx
        jmp     .copy
.copy_lap:
        mov     dx, [rsi + rcx*2]
        mov     [rax + rcx*2], dx
        inc     rcx
.copy:                                  ; while units are left
        cmp     rcx, rdi
        jb      .copy_lap
.end:
        mov     word [rax + rcx*2], 0
        mov     rcx, r12
        call    [GlobalUnlock]
        mov     ecx, 13                 ; CF_UNICODETEXT: the clipboard owns it from here
        mov     rdx, r12
        call    [SetClipboardData]
.close:
        call    [CloseClipboard]
.unlock:
        lea     rcx, [scr_lock]
        call    [LeaveCriticalSection]
        mov     rsp, rbp
        pop     rbp r12 r11 r10 r9 r8 rdi rsi rdx rcx rbx
        ret

; 41: eax = 1 if a cabin may sleep on the screen: the window lives and has no event kept. Read without the screen's
; lock: an event kept after this look rings the bell, and the kernel looks again. Keeps every other register.
screen_waitable:
        xor     eax, eax
        cmp     byte [scr_live], 0
        je      .out
        cmp     qword [scr_count], 0
        jne     .out
        mov     rcx, [scr_pastepos]     ; (letters still to paste: there is something to take)
        cmp     rcx, [scr_pastelen]
        jb      .out
        inc     eax
.out:
        ret

; 41: rdi = 32 bytes of the program's -> eax = 1 and the oldest event kept written there, out of the ring; 0 if none
; is kept. Keeps every other register; callable with any stack alignment.
screen_take:
        xor     eax, eax
        cmp     byte [scr_ready], 0
        je      .none                   ; (never shown: no lock, no events)
        push    rbx rcx rdx rsi rdi r8 r9 r10 r11 rbp
        mov     rbp, rsp
        and     rsp, -16
        sub     rsp, 32
        lea     rcx, [scr_lock]
        call    [EnterCriticalSection]
        xor     ebx, ebx
        call    screen_paste_next       ; (what was pasted goes first: the next letter, if any; ebx = 1 if given. An
        test    ebx, ebx                ; Enter typed after Ctrl+V used to pass the letters still waiting, and an
        jnz     .unlock                 ; empty line was said, 2026-11-24)
        cmp     qword [scr_count], 0
        je      .unlock
.ring:
        dec     qword [scr_count]
        mov     rsi, [scr_head]
        lea     rax, [rsi + 1]
        and     eax, SCR_RING - 1
        mov     [scr_head], rax
        shl     rsi, 5
        add     rsi, scr_ring
        mov     ecx, 4
        rep     movsq
        inc     ebx
.unlock:
        lea     rcx, [scr_lock]
        call    [LeaveCriticalSection]
        mov     eax, ebx
        mov     rsp, rbp
        pop     rbp r11 r10 r9 r8 rdi rsi rdx rcx rbx
.none:
        ret

end if

