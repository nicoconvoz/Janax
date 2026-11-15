; Janax's own screen, on the host: the Windows implementation. Another host provides its own pantalla.inc with
; the same entry points (screen_show, screen_end) and the same answers; the kernel's "show" (kind 40) only calls them.
; Included twice: with PANTALLA_PARTE = 0 in the data section (its state), with 1 in the code section.
; The window lives in a host thread of its own (its message loop), started by the first show; the kernel and that
; thread share the pixels under scr_lock. JANAX_SIN_VENTANA (any value): the same decoding and answers, no window.

if PANTALLA_PARTE = 0

  SCR_SIDE  = 4096              ; the longest side a cloud may have, in cells
  SCR_WORKAREA = 30h            ; SystemParametersInfoW: the desktop the host leaves free (no taskbar)
  SCR_REDRAW = 3                ; CS_VREDRAW | CS_HREDRAW: a new size repaints the whole window
  scr_quiet_env db 'JANAX_SIN_VENTANA', 0
  scr_class_name du 'JanaxPantalla', 0
  scr_title du 'Janax', 0
  scr_ready db 0                ; the lock is built and the host asked about the window
  scr_quiet db 0                ; 1: never a window
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

else

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
        movzx   eax, word [r14 + 9]     ; the bones, 46 bytes each
        imul    rax, 46
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
        invoke  ShowWindow, r12, SW_SHOW
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
@@:     cmp     edx, WM_PAINT
        je      .paint
        cmp     edx, WM_DESTROY
        je      .destroy
        jmp     [DefWindowProcW]
.destroy:
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

end if
