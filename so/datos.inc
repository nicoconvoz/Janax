; Initial data (Capitan): "anyone can improve and personalize their Janax without starting from zero".
; A program X can have its data in the file next to it with the same name and the extension .datos (the
; last extension of the name is replaced, or .datos is added if it has none): X.bin -> X.datos,
; PDP/ensamblador/ensamblador.bin -> PDP/ensamblador/ensamblador.datos, hijo -> hijo.datos. The kernel
; reads it at launch and the first order copies it to the start of room 0; data that does not fit in the
; room asked for is code 5. A program without that file starts with room 0 in zeros, as always.

; The data file's name for the name rsi (rcx bytes), written at rdi (room for cap bytes, cap in rdx),
; with a 0 after it. -> rcx = its bytes, or -1 if it does not fit. Keeps rbx, rbp, r12-r15.
data_name:
        mov     r8, rcx                 ; where the extension starts: the end if there is none
        xor     r9d, r9d
        jmp     .scan
.scan_lap:
        mov     al, [rsi + r9]
        cmp     al, '.'
        jne     @f
        mov     r8, r9                  ; the last dot so far
@@:     cmp     al, '/'
        je      .folder
        cmp     al, '\'
        jne     .scan_next
.folder:
        mov     r8, rcx                 ; a dot before a folder separator is not an extension
.scan_next:
        inc     r9
.scan:
        cmp     r9, rcx
        jb      .scan_lap
        lea     rax, [r8 + 7]           ; the name, ".datos" and the 0
        cmp     rax, rdx
        ja      .too_long
        mov     rcx, r8
        rep     movsb
        mov     dword [rdi], '.dat'
        mov     word [rdi + 4], 'os'
        mov     byte [rdi + 6], 0
        lea     rcx, [r8 + 6]
        ret
.too_long:
        mov     rcx, -1
        ret

; Reads the data file at the host path data_path. -> rax = the data in a block of exactly its size and
; rcx = its bytes, or rax = rcx = 0 if there is no such file (or it is empty). The window counts its host
; calls when data_count is 1. Keeps rbx, rbp, rsi, rdi, r12-r15.
read_data:
        push    rsi rdi
        sub     rsp, 8
        invoke  CreateFileA, data_path, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0
        movzx   ecx, byte [data_count]
        add     [hostcalls], rcx
        cmp     rax, -1
        je      .none
        mov     [hfile], rax
        call    program_buffer          ; read into the loading buffer first
        test    rax, rax
        jz      .close
        mov     dword [bytesread], 0
        invoke  ReadFile, [hfile], [load_buf], MAX_PROGRAM, bytesread, 0
        movzx   ecx, byte [data_count]
        add     [hostcalls], rcx
.close:
        invoke  CloseHandle, [hfile]
        movzx   ecx, byte [data_count]
        add     [hostcalls], rcx
        mov     edx, [bytesread]
        test    edx, edx
        jz      .none
        invoke  VirtualAlloc, 0, rdx, MEM_COMMIT + MEM_RESERVE, PAGE_READWRITE
        test    rax, rax
        jz      .none
        mov     rdi, rax
        mov     rsi, [load_buf]
        mov     ecx, [bytesread]
        rep     movsb
        mov     ecx, [bytesread]
        jmp     .done
.none:
        xor     eax, eax
        xor     ecx, ecx
.done:
        add     rsp, 8
        pop     rdi rsi
        ret

; A process launched by another one (request 16): its data is the file with the data name of its label,
; in the system's folder and under the same porters. rax = the new process; entry r13 of the queue at rbp.
; Keeps rbx, rbp, r12-r15.
family_data:
        push    rsi rdi r12
        mov     r12, rax
        mov     rax, [rbp + r13 + 8]
        mov     rdx, [rbp + r13 + 16]
        call    cabin_at                ; the label, already checked when the program was read
        jc      .done
        mov     rsi, rax
        mov     rcx, [rbp + r13 + 16]
        lea     rdi, [data_label]
        mov     edx, DATA_LABEL
        call    data_name
        cmp     rcx, -1
        je      .done
        lea     rsi, [data_label]
        lea     rdi, [data_path]
        call    label_path_ptr
        test    eax, eax
        jz      .done
        call    files_prefix_ok
        test    eax, eax
        jz      .done
        mov     byte [data_count], 1
        call    read_data
        mov     [r12 + P_INIT], rax
        mov     [r12 + P_INITLEN], rcx
.done:
        pop     r12 rdi rsi
        ret
