; Janax OS: the Capitan's Venn, one engine for every "which ones" the kernel decides.
; "Venn, infinite states. A + B, A - B, A and B, neither, what I look at A first, what I look at B first, the smallest
; of B that are not in A... and I can invent anything." The classic Venn has 8 states; with the order of the look and a
; criterion it has no end, and the list of axes is open.
;
; The engine knows no boxes, files or processes: it gets two sets and a Venn word, and gives the selection in its
; order, one element at a time, to whoever asked (a port: each set is an adapter, the engine is the domain).
;
; The Venn word, an axis per field (plastic: a new axis is a new field):
;   bits 0-2   the regions: 1 the elements both sets hold (same key), 2 A's only, 4 B's only (0 none, 7 all)
;   bit 3      the look: 0 A first, 1 B first (a shared element is given from the side looked at first, with its
;              partner in the other set)
;   bits 4-7   the criterion: 0 the order of each set, n > 0 a value each set knows how to give (its VS_CRITS)
;   bit 8      descending; bit 9 the criterion over the whole selection (0: inside each side, in the look's order)
;   bits 16-31 how many (0 all)
; Any other bit is an axis not invented yet: whoever takes the word refuses it (VENN_KNOWN), so a new axis never
; changes what an old program asked.
;
; Each element has a key {the criterion and its side in the look (the side first, or the criterion first over the
; whole selection), its place in its set}, and the selection goes from the smallest key up. With no criterion and the
; criterion inside each side that is the first side in its order and then the other: one pass over each set (a set as
; long as a file is read once). With a criterion each element given looks at every one again: O(n^2) finds, once per
; selection (criterion, not measurement: fine for a cartel; a set as long as a file wants a sort, not written yet).

VENN_REGIONS = 7
VENN_B_FIRST = 8
VENN_DESC    = 100h
VENN_WHOLE   = 200h
VENN_KNOWN   = 0FFFF03FFh

; A set (VS): its adapter's routines, called with rsi = the set and rax as said; each one may use rax, rcx, rdx and
; r8-r11 and keeps every other register.
VS_FIRST = 0                    ; -> rax = its first element, 0 if none
VS_NEXT  = 8                    ; rax = an element -> rax = the next one, 0 at the end
VS_KEY   = 16                   ; rax = an element -> rax = its key (the same thing has the same key in both sets)
VS_FIND  = 24                   ; rax = a key -> rax = its element with that key, 0 if it has none
VS_CRIT  = 32                   ; rax = an element, ecx = a criterion -> rax = its value
VS_CRITS = 40                   ; the criteria it knows (bit n = criterion n)
VS_DATA  = 48                   ; the adapter's own (a cabin, a file...)
VS_SIZE  = 64

; A selection (VQ): what the caller fills, then what the engine keeps while it runs.
VQ_WORD   = 0                   ; the Venn word
VQ_A      = 8                   ; set A
VQ_B      = 16                  ; set B
VQ_GIVE   = 24                  ; routine: rax = the element, rdx = its partner in the other set (0 none), rcx = its
                                ; set (0 A, 1 B), rdi = the selection; it may use rax, rcx, rdx, rsi, r8-r11
VQ_USER   = 32                  ; the caller's own
VQ_GIVEN  = 40                  ; how many were given
VQ_LAST   = 48                  ; the last key given {k1, k2, place}, and whether there is one
VQ_HAS    = 72
VQ_BEST   = 80                  ; the best next one {k1, k2, place}, its element, its partner, its set
VQ_BEL    = 104
VQ_BPART  = 112
VQ_BSET   = 120
VQ_FOUND  = 128
VQ_SIZE   = 136

; rdi = a selection (VQ_WORD, VQ_A, VQ_B, VQ_GIVE, VQ_USER filled): gives its elements, in the word's order, as
; many as it asks. Keeps rbx, rbp, rdi, r12-r15.
venn_run:
        push    r12 r13 r14 r15
        mov     qword [rdi + VQ_GIVEN], 0
        mov     r12, [rdi + VQ_A]       ; r12 the set looked at first (r14 its letter: 0 A, 1 B), r13 the other
        mov     r13, [rdi + VQ_B]
        xor     r14d, r14d
        test    qword [rdi + VQ_WORD], VENN_B_FIRST
        jz      @f
        xchg    r12, r13
        mov     r14d, 1
@@:     mov     rax, [rdi + VQ_WORD]
        test    eax, 0F0h
        jnz     .select
        test    eax, VENN_WHOLE
        jnz     .select
        mov     rsi, r12                ; the order of each set: the first side in its order, then the other
        mov     r8, r13
        mov     r9, r14
        mov     r10d, 1
        call    venn_stream
        test    eax, eax
        jnz     .done                   ; as many as asked
        mov     rsi, r13
        mov     r8, r12
        mov     r9, r14
        xor     r9d, 1
        xor     r10d, r10d
        call    venn_stream
        jmp     .done
.select:                                ; a criterion: the smallest key past the last one, one at a time
        mov     qword [rdi + VQ_HAS], 0
        jmp     .pick
.pick_lap:
        mov     rax, [rdi + VQ_BEST]
        mov     [rdi + VQ_LAST], rax
        mov     rax, [rdi + VQ_BEST + 8]
        mov     [rdi + VQ_LAST + 8], rax
        mov     rax, [rdi + VQ_BEST + 16]
        mov     [rdi + VQ_LAST + 16], rax
        mov     qword [rdi + VQ_HAS], 1
        mov     rax, [rdi + VQ_BEL]
        mov     rdx, [rdi + VQ_BPART]
        mov     rcx, [rdi + VQ_BSET]
        call    venn_give
        test    eax, eax
        jnz     .done                   ; as many as asked
.pick:                                  ; while an element is left past the last one given
        mov     qword [rdi + VQ_FOUND], 0
        mov     rsi, r12
        mov     r8, r13
        mov     r9, r14
        xor     r10d, r10d              ; its side in the look: first
        call    venn_scan
        mov     rsi, r13
        mov     r8, r12
        mov     r9, r14
        xor     r9d, 1
        mov     r10d, 1
        call    venn_scan
        cmp     qword [rdi + VQ_FOUND], 0
        jne     .pick_lap
.done:
        pop     r15 r14 r13 r12
        ret

; The element rax (partner rdx, set rcx) to whoever asked, and counted. -> eax = 1 when that was as many as asked.
; Keeps rbx, rbp, rdi, r12-r15.
venn_give:
        push    rdi
        call    qword [rdi + VQ_GIVE]
        pop     rdi
        inc     qword [rdi + VQ_GIVEN]
        mov     rax, [rdi + VQ_WORD]
        shr     rax, 16
        and     eax, 0FFFFh
        jz      .on                     ; (0: all of them)
        cmp     rax, [rdi + VQ_GIVEN]
        jne     .on
        mov     eax, 1
        ret
.on:
        xor     eax, eax
        ret

; Is the element rax of the set rsi (letter r9: 0 A, 1 B; the other set r8; r10 = 1 if its side is looked at first)
; in the word's regions? -> rax = its partner in the other set (0 none), eflags ZF clear if it is in them (ZF set:
; not). Keeps rbx, rbp, rsi, rdi, r8-r10, r12-r15 (the adapters may use r8-r11: they are kept on the stack).
venn_in:
        push    r10 r9 r8
        call    qword [rsi + VS_KEY]
        push    rsi
        mov     rsi, [rsp + 8]          ; the other set
        call    qword [rsi + VS_FIND]
        pop     rsi
        pop     r8 r9 r10
        test    rax, rax
        jz      .own
        test    r10, r10
        jz      .not                    ; shared: given from the side looked at first
        mov     edx, 1
        jmp     .test
.own:
        mov     edx, 2                  ; A's only, or B's only
        test    r9, r9
        jz      .test
        mov     edx, 4
.test:
        test    rdx, [rdi + VQ_WORD]
        ret
.not:
        xor     edx, edx
        test    edx, edx
        ret

; One pass over the set rsi in its order (letter r9, the other set r8, r10 = 1 if looked at first): every element in
; the regions, given. -> eax = 1 when that was as many as asked. Keeps rbx, rbp, rdi, r12-r15.
venn_stream:
        push    r12 r13 r14 r15
        mov     r12, rsi
        mov     r13, r8
        mov     r14, r9
        mov     r15, r10
        call    qword [rsi + VS_FIRST]
        jmp     .one
.one_lap:
        mov     rsi, r12
        mov     r8, r13
        mov     r9, r14
        mov     r10, r15
        push    rax
        call    venn_in
        pop     rcx                     ; (the element)
        jz      .next
        push    rcx
        mov     rdx, rax                ; its partner
        mov     rax, rcx
        mov     rcx, r14
        call    venn_give
        pop     rcx
        test    eax, eax
        jnz     .enough
.next:
        mov     rsi, r12
        mov     rax, rcx
        call    qword [rsi + VS_NEXT]
.one:                                   ; while elements are left
        test    rax, rax
        jnz     .one_lap
        xor     eax, eax
        jmp     .done
.enough:
        mov     eax, 1
.done:
        pop     r15 r14 r13 r12
        ret

; Every element of the set rsi (letter r9, the other set r8, r10 its side in the look: 0 first) in the regions, with
; a key past the last one given and smaller than the best found, becomes the best. Keeps rbx, rbp, rdi, r12-r15.
venn_scan:
        push    rbx r12 r13 r14 r15
        mov     r12, rsi
        mov     r13, r8
        mov     r14, r9
        mov     r15, r10
        xor     ebx, ebx                ; its place in its set
        call    qword [rsi + VS_FIRST]
        jmp     .one
.one_lap:
        push    rax
        mov     rsi, r12
        mov     r8, r13
        mov     r9, r14
        mov     r10, r15
        xor     r10d, 1                 ; (venn_in wants 1 if looked at first)
        call    venn_in
        pop     r11
        jz      .next
        push    r11
        push    rax                     ; its partner
        mov     rax, r11                ; its value for the criterion
        mov     rcx, [rdi + VQ_WORD]
        shr     rcx, 4
        and     ecx, 15
        mov     rsi, r12
        call    qword [rsi + VS_CRIT]
        test    qword [rdi + VQ_WORD], VENN_DESC
        jz      @f
        not     rax
@@:     mov     rdx, r15                ; the key: {criterion, side} over the whole selection, else {side, criterion}
        test    qword [rdi + VQ_WORD], VENN_WHOLE
        jnz     @f
        xchg    rax, rdx
@@:     pop     r10                     ; (its partner)
        pop     r11                     ; (the element)
        cmp     qword [rdi + VQ_HAS], 0
        je      .best
        cmp     rax, [rdi + VQ_LAST]    ; past the last one given
        ja      .best
        jb      .next
        cmp     rdx, [rdi + VQ_LAST + 8]
        ja      .best
        jb      .next
        cmp     rbx, [rdi + VQ_LAST + 16]
        jbe     .next
.best:
        cmp     qword [rdi + VQ_FOUND], 0
        je      .take
        cmp     rax, [rdi + VQ_BEST]    ; smaller than the best found
        jb      .take
        ja      .next
        cmp     rdx, [rdi + VQ_BEST + 8]
        jb      .take
        ja      .next
        cmp     rbx, [rdi + VQ_BEST + 16]
        jae     .next
.take:
        mov     [rdi + VQ_BEST], rax
        mov     [rdi + VQ_BEST + 8], rdx
        mov     [rdi + VQ_BEST + 16], rbx
        mov     [rdi + VQ_BEL], r11
        mov     [rdi + VQ_BPART], r10
        mov     [rdi + VQ_BSET], r14
        mov     qword [rdi + VQ_FOUND], 1
.next:
        inc     rbx
        mov     rsi, r12
        mov     rax, r11
        call    qword [rsi + VS_NEXT]
.one:                                   ; while elements are left
        test    rax, rax
        jnz     .one_lap
        pop     r15 r14 r13 r12 rbx
        ret
