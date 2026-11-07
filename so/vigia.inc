; ---------------------------------------------------------------- the host's watch (Capitan, 2026-11-07)
; "When it detects that a new book was written, go there, eat it and come back with the clues." The folders of the
; host named in JANAX_VIGIA (separated by ';', each with all it holds) are watched by the sentinel, with its own
; folder and the board, while some cabin that asked for what is new there (39) waits for a greeting. What changes is
; kept until it is quiet (HW_QUIET with no other notice: a log that keeps growing, or a file that dies at once, never
; gets there) and then it passes the host's rules: a file, not hidden nor of the system, in no hidden or system folder
; and in none whose name starts with a dot, owned by the user or by a group the user is in (not by the system), not in
; the system's own folder nor the board (Janax writes there: it would watch itself), and not where the host keeps the
; programs' data and itself, as the host says (its known folders: AppData, ProgramData, Windows, Program Files). That
; last one is asked because a process launched from inside an app package sees a virtual view where AppData is not
; hidden (measured, 2026-11-07): a rule must hold in whatever view Janax runs. Whether it is text is the program's to
; decide: the kernel does not read it.

; The folders of JANAX_VIGIA, each ended by a 0, and its own folder and the board in UTF-16 (to know them in a path).
; At the start, after the board is known.
hw_start:
        push    rbx rsi rdi
        invoke  GetEnvironmentVariableW, vigia_env, hw_raw, HW_RAW - 1
        cmp     rax, HW_RAW - 1
        jae     .own                    ; (none, or too long to be whole: nothing is watched)
        mov     rsi, rax
        xor     ebx, ebx                ; each character; rdi: where the folder being read starts
        xor     edi, edi
        jmp     .chars
.char:
        cmp     word [hw_raw + rbx*2], ';'
        jne     .next
        call    hw_folder
.next:
        inc     rbx
.chars:                                 ; while characters are left
        cmp     rbx, rsi
        jb      .char
        call    hw_folder
        xor     ebx, ebx                ; a bell for each
        jmp     .bells
.bell:
        invoke  CreateEventA, 0, 0, 0, 0
        mov     [watch_event + 16 + rbx*8], rax
        inc     rbx
.bells:
        cmp     rbx, [hw_n]
        jb      .bell
.own:
        invoke  MultiByteToWideChar, 0, 0, dir_path, [dir_len], dir_w, HOST_PATH
        mov     [dir_wn], rax
        cmp     qword [board_len], 0
        je      .known
        invoke  MultiByteToWideChar, 0, 0, board_path, [board_len], board_w, HOST_PATH
        mov     [board_wn], rax
.known:                                 ; where the system keeps the programs' data and itself, as it says (its known
        xor     ebx, ebx                ; folders): never books, whatever the folders look like from here
        jmp     .knowns
.known_lap:
        imul    rax, rbx, 16
        lea     rcx, [hw_known + rax]
        invoke  SHGetKnownFolderPath, rcx, 0, 0, hw_kpath
        test    eax, eax
        jnz     .known_next
        mov     rsi, [hw_kpath]
        xor     ecx, ecx
        jmp     .length
.length_lap:
        inc     rcx
.length:
        cmp     word [rsi + rcx*2], 0
        jne     .length_lap
        mov     rdx, [hw_nsys]
        mov     [hw_sys + rdx*8], rsi
        mov     [hw_sysn + rdx*8], rcx
        inc     qword [hw_nsys]
.known_next:
        inc     rbx
.knowns:
        cmp     rbx, HW_KNOWN
        jb      .known_lap
.done:
        pop     rdi rsi rbx
        ret

; hw_raw from rdi to rbx is a folder: kept if it has something and there is room; its end becomes a 0, and the next
; one starts after it. Keeps rbx, rsi.
hw_folder:
        mov     word [hw_raw + rbx*2], 0
        mov     rax, rbx
        sub     rax, rdi
        jz      .no
        mov     rcx, [hw_n]
        cmp     rcx, HW_MAX
        jae     .no
        lea     rdx, [hw_raw + rdi*2]
        mov     [hw_root + rcx*8], rdx
        mov     [hw_rlen + rcx*8], rax
        inc     qword [hw_n]
.no:
        lea     rdi, [rbx + 1]
        ret

; eax = 1 if some cabin that has not ended waits for a greeting and asked for what is new in the host (39).
; Keeps every register but rax, rcx, rsi.
hw_watched:
        xor     eax, eax
        cmp     qword [hw_n], 0
        je      .out
        xor     ecx, ecx
        jmp     .one
.one_lap:
        mov     rsi, [procs]
        mov     rsi, [rsi + rcx*8]
        cmp     qword [rsi + P_DONE], 0
        jne     .next
        cmp     qword [rsi + P_GWAIT], 1
        jne     .next
        cmp     qword [rsi + P_HOSTW], 0
        je      .next
        mov     eax, 1
        ret
.next:
        inc     rcx
.one:
        cmp     rcx, [nprocs]
        jb      .one_lap
.out:
        ret

; Every cabin that waits for a greeting and asked for what is new in the host wakes (r15d = 1). Keeps rbx, r12-r14.
hw_wake:
        push    rbx
        xor     ecx, ecx
        jmp     .one
.one_lap:
        mov     rsi, [procs]
        mov     rsi, [rsi + rcx*8]
        cmp     qword [rsi + P_DONE], 0
        jne     .next
        cmp     qword [rsi + P_GWAIT], 1
        jne     .next
        cmp     qword [rsi + P_HOSTW], 0
        je      .next
        mov     rbx, rsi
        call    watch_wake
        mov     r15d, 1
.next:
        inc     rcx
.one:
        cmp     rcx, [nprocs]
        jb      .one_lap
        pop     rbx
        ret

; The host's folder rbx (2 and on) read for its next changes, with all it holds, if it is not already: opened the
; first time, to be told without waiting (its bell rings). -> eax = 1 if it is being read. Uses rax, rcx, rdx, r8-r11.
hw_read:
        push    r12
        cmp     qword [watch_pend + rbx*8], 0
        jne     .yes
        lea     r12, [rbx - 2]
        cmp     qword [hw_bufs + r12*8], 0
        jne     .room
        invoke  VirtualAlloc, 0, HW_BUF, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .no
        mov     [hw_bufs + r12*8], rax
.room:
        cmp     qword [watch_dir + rbx*8], 0
        jne     .read
        invoke  CreateFileW, [hw_root + r12*8], 1, 7, 0, OPEN_EXISTING, 42000000h, 0
        inc     qword [hostcalls]
        cmp     rax, -1
        je      .no
        mov     [watch_dir + rbx*8], rax
.read:
        mov     rax, rbx
        shl     rax, 5
        lea     r10, [watch_ov + rax]
        mov     rcx, [watch_event + rbx*8]
        mov     [r10 + 24], rcx
        mov     r11, [hw_bufs + r12*8]
        invoke  ReadDirectoryChangesW, [watch_dir + rbx*8], r11, HW_BUF, 1, 19h, 0, r10, 0
        inc     qword [hostcalls]
        test    eax, eax
        jz      .no
        mov     qword [watch_pend + rbx*8], 1
.yes:
        mov     eax, 1
        pop     r12
        ret
.no:
        xor     eax, eax
        pop     r12
        ret

; The change at r13 (FILE_NOTIFY_INFORMATION) of the host's folder rbx: a file that appeared, was written or got its
; new name is kept until it is quiet, if it is not in the system's own folder nor the board. Keeps rbx, r12-r14.
hw_told:
        push    rbx rsi rdi r12 r13
        mov     eax, [r13 + 4]
        cmp     eax, 1                  ; FILE_ACTION_ADDED, MODIFIED, RENAMED_NEW_NAME
        je      .its
        cmp     eax, 3
        je      .its
        cmp     eax, 5
        jne     .done
.its:
        lea     r12, [rbx - 2]          ; its path: the folder, a '\' if it does not end with one, the name
        mov     rsi, [hw_root + r12*8]
        mov     rcx, [hw_rlen + r12*8]
        lea     rdi, [hw_path]
        rep     movsw
        cmp     word [rdi - 2], '\'
        je      .name
        mov     word [rdi], '\'
        add     rdi, 2
.name:
        mov     ecx, [r13 + 8]
        shr     ecx, 1
        lea     rax, [rdi + rcx*2]
        lea     rdx, [hw_path + (HW_PATH - 1)*2]
        cmp     rax, rdx
        ja      .done                   ; (longer than any path of the host)
        lea     rsi, [r13 + 12]
        rep     movsw
        mov     word [rdi], 0
        lea     rax, [hw_path]
        sub     rdi, rax
        shr     rdi, 1
        mov     [hw_pathn], rdi
        lea     rsi, [dir_w]
        mov     rcx, [dir_wn]
        call    hw_under
        test    eax, eax
        jnz     .done
        lea     rsi, [board_w]
        mov     rcx, [board_wn]
        call    hw_under
        test    eax, eax
        jnz     .done
        xor     r12d, r12d              ; nor where the system keeps the programs' data and itself
        jmp     .systems
.system:
        mov     rsi, [hw_sys + r12*8]
        mov     rcx, [hw_sysn + r12*8]
        call    hw_under
        test    eax, eax
        jnz     .done
        inc     r12
.systems:
        cmp     r12, [hw_nsys]
        jb      .system
        call    hw_note
.done:
        pop     r13 r12 rdi rsi rbx
        ret

; eax = 1 if the path at hw_path is inside the folder at rsi (rcx characters). The same folder may come written
; either way: '/' and '\' are the same mark, a mark at its end is none, and a letter A-Z is the same in either case
; (the host's names do not tell them apart). Keeps rbx, rsi, rdi, r12-r15.
hw_under:
        push    rsi
        xor     eax, eax
        test    rcx, rcx
        jz      .out
        movzx   edx, word [rsi + rcx*2 - 2]
        call    .fold
        cmp     edx, '\'
        jne     .whole
        dec     rcx                     ; (its own mark at the end)
        jz      .out
.whole:
        cmp     rcx, [hw_pathn]
        jae     .out
        movzx   edx, word [hw_path + rcx*2]
        call    .fold
        cmp     edx, '\'
        jne     .out
        xor     r8d, r8d
.char:
        movzx   edx, word [rsi + r8*2]
        call    .fold
        mov     r9d, edx
        movzx   edx, word [hw_path + r8*2]
        call    .fold
        cmp     edx, r9d
        jne     .out
        inc     r8
        cmp     r8, rcx
        jb      .char
        mov     eax, 1
.out:
        pop     rsi
        ret
.fold:                                  ; edx: '/' as '\', A-Z as a-z
        cmp     edx, '/'
        jne     .letter
        mov     edx, '\'
        ret
.letter:
        cmp     edx, 'A'
        jb      .folded
        cmp     edx, 'Z'
        ja      .folded
        or      edx, 20h
.folded:
        ret

; The path at hw_path told now: its time again if it is kept already, kept if not. Keeps rbx, r12-r15.
hw_note:
        push    rsi rdi r12
        invoke  GetTickCount64
        mov     r12, rax
        mov     rsi, [hw_pend]
        mov     rdi, rsi
        add     rdi, [hw_pendn]
        jmp     .seen
.seen_lap:
        mov     rcx, [rsi + 8]
        cmp     rcx, [hw_pathn]
        jne     .other
        push    rsi rdi
        lea     rdi, [rsi + 16]
        lea     rsi, [hw_path]
        repe    cmpsw
        pop     rdi rsi
        jne     .other
        mov     [rsi], r12              ; kept: told again, its quiet starts again
        jmp     .done
.other:
        mov     rcx, [rsi + 8]
        lea     rcx, [rcx*2 + 7]
        and     rcx, -8
        lea     rsi, [rsi + rcx + 16]
.seen:                                  ; while kept ones are left
        cmp     rsi, rdi
        jb      .seen_lap
        mov     rdx, [hw_pathn]
        lea     rdx, [rdx*2 + 7]
        and     rdx, -8
        add     rdx, 16
        lea     rcx, [hw_pend]
        call    hw_grow
        test    rax, rax
        jz      .done
        mov     [rax], r12
        mov     rcx, [hw_pathn]
        mov     [rax + 8], rcx
        lea     rdi, [rax + 16]
        lea     rsi, [hw_path]
        rep     movsw
.done:
        pop     r12 rdi rsi
        ret

; Room for rdx bytes more at the end of the list at rcx ({its room, bytes used, the room's bytes}): it doubles when
; full (plastic), what it held copied. -> rax = where they go (and they count as used), 0 if there is no memory.
; Keeps rbx, rsi, rdi, r12-r15.
hw_grow:
        push    rbx rsi rdi
        mov     rbx, rcx
        mov     rax, [rbx + 8]
        add     rax, rdx
        cmp     rax, [rbx + 16]
        jbe     .fits
        mov     rdi, rdx
        mov     rcx, [rbx + 16]
        add     rcx, rcx
        cmp     rcx, rax
        jae     .size
        mov     rcx, rax
.size:
        add     rcx, 4095
        and     rcx, -4096
        mov     rsi, rcx
        invoke  VirtualAlloc, 0, rsi, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .none
        mov     rdx, rdi
        mov     rdi, rax
        mov     r8, rsi
        mov     rsi, [rbx]
        mov     r9, rsi
        mov     rcx, [rbx + 8]
        rep     movsb
        mov     [rbx], rax
        mov     [rbx + 16], r8
        mov     rdi, rdx
        test    r9, r9
        jz      .copied
        invoke  VirtualFree, r9, 0, MEM_RELEASE
.copied:
        mov     rdx, rdi
.fits:
        mov     rax, [rbx]
        add     rax, [rbx + 8]
        add     [rbx + 8], rdx
        pop     rdi rsi rbx
        ret
.none:
        xor     eax, eax
        pop     rdi rsi rbx
        ret

; How long the sentinel may sleep: until the first one kept is quiet -> rax ms, or -1 (INFINITE) if none is kept
; (nothing is spent while nothing waits). Keeps rbx, rdi, r12-r15.
hw_wait_ms:
        push    rsi
        mov     rax, -1
        cmp     qword [hw_pendn], 0
        je      .out
        invoke  GetTickCount64
        mov     r8, rax
        mov     rax, -1
        mov     rsi, [hw_pend]
        mov     rdx, rsi
        add     rdx, [hw_pendn]
        jmp     .one
.lap:
        mov     rcx, [rsi]
        add     rcx, HW_QUIET
        sub     rcx, r8
        jns     .left
        xor     ecx, ecx
.left:
        cmp     rcx, rax
        jae     .more
        mov     rax, rcx
.more:
        mov     rcx, [rsi + 8]
        lea     rcx, [rcx*2 + 7]
        and     rcx, -8
        lea     rsi, [rsi + rcx + 16]
.one:
        cmp     rsi, rdx
        jb      .lap
.out:
        pop     rsi
        ret

; Each one kept that is quiet now goes, and if it passes the host's rules it is new in the host. -> eax = 1 if
; something is new. Keeps rbx, r12-r15.
hw_mature:
        push    rbx rsi rdi r12 r13
        xor     r13d, r13d
        invoke  GetTickCount64
        mov     r12, rax
        xor     ebx, ebx                ; where in the list
.one:
        cmp     rbx, [hw_pendn]
        jae     .done
        mov     r8, [hw_pend]
        add     r8, rbx
        mov     rax, r12
        sub     rax, [r8]
        cmp     rax, HW_QUIET
        jb      .next
        mov     rcx, [r8 + 8]           ; quiet: its path to hw_path, and out of the list
        mov     [hw_pathn], rcx
        lea     rsi, [r8 + 16]
        lea     rdi, [hw_path]
        rep     movsw
        mov     word [rdi], 0
        mov     rcx, [r8 + 8]
        lea     rcx, [rcx*2 + 7]
        and     rcx, -8
        add     rcx, 16
        lea     rsi, [r8 + rcx]
        mov     rdi, r8
        mov     rdx, [hw_pend]
        add     rdx, [hw_pendn]
        sub     [hw_pendn], rcx
        mov     rcx, rdx
        sub     rcx, rsi
        rep     movsb
        call    hw_rules
        test    eax, eax
        jz      .one
        call    hw_ready_put
        or      r13d, eax
        jmp     .one
.next:
        mov     rcx, [r8 + 8]
        lea     rcx, [rcx*2 + 7]
        and     rcx, -8
        lea     rbx, [rbx + rcx + 16]
        jmp     .one
.done:
        mov     eax, r13d
        pop     r13 r12 rdi rsi rbx
        ret

; eax = 1 if the file at hw_path passes the host's rules: it is a file, not hidden nor of the system; no folder on
; its way is hidden or of the system, and no name on its way starts with a dot; adding a file to the folder where it
; lives does not ask for administrator rights (Capitan: "if the folder is invisible or with administrator rights, do
; not go in"; only that folder: C:\Users asks for them, and every user's file is under it); its owner is the user or
; a group the user is in. Keeps rbx, rsi, rdi, r12-r15.
hw_rules:
        push    rbx rsi rdi
        invoke  GetFileAttributesW, hw_path
        cmp     eax, -1
        je      .no
        test    eax, 16h                ; a folder (10h), hidden (2), of the system (4)
        jnz     .no
        mov     ebx, 1                  ; each '\' on its way
        jmp     .ways
.way:
        cmp     word [hw_path + rbx*2], '\'
        jne     .way_next
        cmp     word [hw_path + rbx*2 + 2], '.'
        je      .no
        cmp     word [hw_path + rbx*2 - 2], ':'
        je      .way_next               ; (the drive itself is not a folder on the way)
        mov     word [hw_path + rbx*2], 0
        invoke  GetFileAttributesW, hw_path
        mov     word [hw_path + rbx*2], '\'
        cmp     eax, -1
        je      .way_next
        test    eax, 6
        jnz     .no
.way_next:
        inc     rbx
.ways:
        cmp     rbx, [hw_pathn]
        jb      .way
        mov     rbx, [hw_pathn]         ; the folder where it lives: if adding a file there asks for administrator
.parent:                                ; rights, it is not the user's (Capitan) and it is not touched
        dec     rbx
        cmp     word [hw_path + rbx*2], '\'
        jne     .parent
        lea     rsi, [rbx + 1]          ; (a drive keeps its mark: "C:\")
        cmp     word [hw_path + rbx*2 - 2], ':'
        je      .cut
        mov     rsi, rbx
.cut:
        mov     di, [hw_path + rsi*2]
        mov     word [hw_path + rsi*2], 0
        invoke  CreateFileW, hw_path, 2, 7, 0, OPEN_EXISTING, 02000000h, 0     ; FILE_ADD_FILE, a folder
        mov     [hw_path + rsi*2], di
        cmp     rax, -1
        jne     .yours
        invoke  GetLastError
        cmp     eax, 5                  ; ERROR_ACCESS_DENIED
        je      .no
        jmp     .owner
.yours:
        invoke  CloseHandle, rax
.owner:
        invoke  GetNamedSecurityInfoW, hw_path, 1, 1, hw_sid, 0, 0, 0, hw_sd   ; SE_FILE_OBJECT, its owner
        test    eax, eax
        jnz     .no
        mov     dword [hw_member], 0
        invoke  CheckTokenMembership, 0, [hw_sid], hw_member
        mov     ebx, eax
        invoke  LocalFree, [hw_sd]
        test    ebx, ebx
        jz      .no
        cmp     dword [hw_member], 0
        je      .no
        mov     eax, 1
        jmp     .out
.no:
        xor     eax, eax
.out:
        pop     rdi rsi rbx
        ret

; The file at hw_path, in UTF-8, to the line of what is new (once: if it is there already, nothing). -> eax = 1 if
; it was not there. Keeps rbx, r12-r15.
hw_ready_put:
        push    rbx rsi rdi
        invoke  WideCharToMultiByte, CP_UTF8, 0, hw_path, [hw_pathn], hw_u8, HW_U8, 0, 0
        test    eax, eax
        jz      .no
        mov     ebx, eax
        mov     rsi, [hw_ready]
        mov     rdi, rsi
        add     rdi, [hw_readyn]
        jmp     .seen
.seen_lap:
        mov     rcx, [rsi]
        cmp     rcx, rbx
        jne     .other
        push    rsi rdi
        lea     rdi, [rsi + 8]
        lea     rsi, [hw_u8]
        repe    cmpsb
        pop     rdi rsi
        je      .no
.other:
        mov     rcx, [rsi]
        add     rcx, 7
        and     rcx, -8
        lea     rsi, [rsi + rcx + 8]
.seen:
        cmp     rsi, rdi
        jb      .seen_lap
        lea     rdx, [rbx + 7]
        and     rdx, -8
        add     rdx, 8
        lea     rcx, [hw_ready]
        call    hw_grow
        test    rax, rax
        jz      .no
        mov     [rax], rbx
        lea     rdi, [rax + 8]
        lea     rsi, [hw_u8]
        mov     rcx, rbx
        rep     movsb
        mov     eax, 1
        jmp     .out
.no:
        xor     eax, eax
.out:
        pop     rdi rsi rbx
        ret

; 39 what is new in the host: a = where to write, b = room. The oldest file new in the host (its path in UTF-8), out
; of the line -> its bytes; 0 if nothing is new yet (it then counts as asking: while it waits for a greeting, a new
; one wakes it); -1 if it may not go out to the host (a prefix on its way up, as 37), nothing is watched, or the path
; does not fit there.
gate_hostnew:
        push    rsi rdi r14
        mov     qword [norm_len], 0
        mov     r8, [rbx + P_GATES + 2*8]
        call    prefix_allows
        test    r8d, r8d
        jz      .invalid
        cmp     qword [hw_n], 0
        je      .invalid
        mov     qword [rbx + P_HOSTW], 1
        cmp     qword [hw_readyn], 0
        je      .none
        mov     rsi, [hw_ready]
        mov     r14, [rsi]
        cmp     r14, [rbp + r13 + 16]
        ja      .invalid
        mov     rax, [rbp + r13 + 8]
        mov     rdx, r14
        call    cabin_at
        jc      .invalid
        mov     rdi, rax
        mov     rsi, [hw_ready]
        add     rsi, 8
        mov     rcx, r14
        rep     movsb
        lea     rcx, [r14 + 7]          ; out of the line
        and     rcx, -8
        add     rcx, 8
        mov     rdi, [hw_ready]
        lea     rsi, [rdi + rcx]
        mov     rdx, [hw_readyn]
        sub     rdx, rcx
        mov     [hw_readyn], rdx
        mov     rcx, rdx
        rep     movsb
        mov     [rbp + r13 + 24], r14
        jmp     .out
.none:
        mov     qword [rbp + r13 + 24], 0
        jmp     .out
.invalid:
        mov     qword [rbp + r13 + 24], -1
.out:
        pop     r14 rdi rsi
        ret
