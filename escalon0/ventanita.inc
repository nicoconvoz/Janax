; The window to the host (Capitan: "the helper gives the list of requests it can serve and the captain
; learns what it can ask"), escalon 0 on Windows. Its data: ventanita_datos.inc.
;
; host_service: rax = Janax address of the block {request, a, b, c} (8 bytes each), rdx = data memory base.
;   -> rax = the answer; edx = 0, or the exit code for something outside the data memory (5) or misaligned
;   (6). Keeps every other register and can be called with any stack alignment.
; Request 0, the catalog: a = where to write it (8-aligned), b = room in bytes. One 16-byte entry per
; request offered (name, number), as many as fit; the answer is how many are offered.
; JANAX_SIN=name,name,... takes requests out (a smaller window); a request taken out, or never offered,
; answers -1.

host_service:
        push    rbx rcx rsi rdi r8 r9 r10 r11
        mov     [host_rsp], rsp
        and     rsp, -16
        mov     rbx, rdx                ; the data memory
        cmp     byte [host_ready], 0
        jne     @f
        mov     [host_rax], rax
        call    host_init
        mov     rax, [host_rax]
@@:     cmp     rax, DATA_SIZE - 32
        ja      host_out
        test    al, 7
        jnz     host_misaligned
        lea     rsi, [rbx + rax]        ; the block
        mov     rax, [rsi]
        test    rax, rax
        jz      .catalog
        xor     ecx, ecx
        jmp     .find
.find_lap:
        cmp     [host_numbers + rcx*8], rax
        jne     .find_next
        cmp     byte [host_on + rcx], 0
        je      .absent
        jmp     qword [host_calls + rcx*8]
.find_next:
        inc     ecx
.find:                                  ; while requests of the catalog are left
        cmp     ecx, HOST_COUNT
        jb      .find_lap
.absent:
        mov     rax, -1
        jmp     host_ok
.catalog:
        mov     rdi, [rsi + 8]          ; where
        mov     r8, [rsi + 16]          ; room
        test    dil, 7
        jnz     host_misaligned
        xor     eax, eax                ; offered
        xor     ecx, ecx
        jmp     .entry
.entry_lap:
        cmp     byte [host_on + rcx], 0
        je      .entry_next
        inc     eax
        cmp     r8, 16
        jb      .entry_next             ; no room for it: counted, not written
        cmp     rdi, DATA_SIZE - 16
        ja      host_out
        mov     rdx, [host_names + rcx*8]
        mov     [rbx + rdi], rdx
        mov     rdx, [host_numbers + rcx*8]
        mov     [rbx + rdi + 8], rdx
        add     rdi, 16
        sub     r8, 16
.entry_next:
        inc     ecx
.entry:                                 ; while requests of the catalog are left
        cmp     ecx, HOST_COUNT
        jb      .entry_lap
host_ok:
        xor     edx, edx
host_done:
        mov     rsp, [host_rsp]
        pop     r11 r10 r9 r8 rdi rsi rcx rbx
        ret
host_out:
        mov     edx, 5
        jmp     host_done
host_misaligned:
        mov     edx, 6
        jmp     host_done

; "escribir": a = address, b = bytes -> the bytes written to the standard output. rsi = block, rbx = memory.
host_escribir:
        mov     rdi, [rsi + 8]
        mov     r8, [rsi + 16]
        cmp     rdi, DATA_SIZE
        ja      host_out
        mov     rax, DATA_SIZE
        sub     rax, rdi
        cmp     r8, rax
        ja      host_out
        add     rdi, rbx
        invoke  GetStdHandle, STD_OUTPUT_HANDLE
        mov     dword [host_written], 0
        invoke  WriteFile, rax, rdi, r8, host_written, 0
        mov     eax, [host_written]
        jmp     host_ok

; Once: the requests named in JANAX_SIN are taken out of the catalog.
host_init:
        sub     rsp, 8
        mov     byte [host_ready], 1
        invoke  GetEnvironmentVariableA, host_env, host_sin, HOST_SIN_CAP - 1
        test    eax, eax
        jz      .done
        cmp     eax, HOST_SIN_CAP - 1
        jae     .done                   ; too long: nothing taken out
        lea     rsi, [host_sin]
        jmp     .token
.token_lap:                             ; one name: its bytes up to the next comma, as a padded qword
        xor     edx, edx
        xor     ecx, ecx
        jmp     .byte
.byte_lap:
        cmp     ecx, 64
        jae     .too_long
        movzx   eax, al
        shl     rax, cl
        or      rdx, rax
        add     ecx, 8
        inc     rsi
.byte:                                  ; while the name goes on
        mov     al, [rsi]
        test    al, al
        jz      .compare
        cmp     al, ','
        jne     .byte_lap
.compare:
        xor     ecx, ecx
        jmp     .name
.name_lap:
        cmp     [host_names + rcx*8], rdx
        jne     .name_next
        mov     byte [host_on + rcx], 0
.name_next:
        inc     ecx
.name:                                  ; while requests of the catalog are left
        cmp     ecx, HOST_COUNT
        jb      .name_lap
        jmp     .skip
.too_long:                              ; longer than any name: it takes nothing out
        mov     al, [rsi]
.skip:
        jmp     .comma
.comma_lap:
        inc     rsi
.comma:                                 ; to the next name
        mov     al, [rsi]
        test    al, al
        jz      .token
        cmp     al, ','
        jne     .comma_lap
        inc     rsi
.token:                                 ; while names are left
        cmp     byte [rsi], 0
        jne     .token_lap
.done:
        add     rsp, 8
        ret
