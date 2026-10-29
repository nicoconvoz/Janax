; The window to the host (jhost), for a process of Janax OS. A process talks to the system through the
; ventanilla, under its porters, so the host offers it nothing: its catalog is empty (the smallest window),
; the catalog answers 0 requests and any other request answers -1. The checks are the ones of every port.
; rax = the block's Janax address -> rax = the answer, ecx = 0, or the exit code (5 outside, 6 misaligned).
; Keeps every other register.
host_window:
        push    rdx
        mov     edx, 32
        call    cabin_at                ; rax = the block (rooms start 8-aligned: same alignment)
        pop     rdx
        jc      .out
        test    al, 7
        jnz     .misaligned
        cmp     qword [rax], 0
        jne     .absent
        test    byte [rax + 8], 7       ; the catalog: where it would be written must be aligned
        jnz     .misaligned
        xor     eax, eax                ; nothing offered
        xor     ecx, ecx
        ret
.absent:
        mov     rax, -1
        xor     ecx, ecx
        ret
.out:
        mov     ecx, 5
        ret
.misaligned:
        mov     ecx, 6
        ret
