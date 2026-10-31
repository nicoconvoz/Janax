; The scheduler of Janax OS, written in Janax (the first piece of the kernel in Janax).
;
; The turn (Capitan: "that priority gives the real %"): a process that is being served keeps the processor
; while (t - D) * t < c * (s + t), so its turn is the least t >= D + 1 with t * (t - D - c) >= c * s; the
; real root of that equation is the old formula ((D + c) + sqrt((D + c)^2 + 4 c s)) / 2, rounded up.
;   D = how much more service the next one in line has received, s = the service this one has received,
;   c = the cost of a switch, in instructions.
; In integers and exact (the old formula used floating point): c comes in sixteenths of an instruction.
; An integer square root puts t next to the root, and the rule itself, comparing with a division instead
; of multiplying, moves it to the exact turn (one or two steps). When the square would not fit in 64 bits
; (D above ~1.3 * 10^8, or 16 c s above 2^56) the turn is found by doubling and halving steps instead.
; Either way, nothing overflows while 16 c s < 2^63 (with a switch cost of 8 instructions, until a process
; has received ~7 * 10^16 instructions). The same result on every machine and in every engine.
;
; turno: j1 = D, j2 = s, j3 = c in sixteenths -> j0 = t. Uses j1-j7.
turno:
jldi j4, 1
jadd j0, j1, j4                 ; at least D + 1
jjz j3, tu_fin                  ; c = 0: least attained service alone
jmul j5, j3, j2                 ; q = 16 c s
jldi j4, 4
jshl j6, j1, j4
jadd j6, j6, j3                 ; a = 16 (D + c)
jjnz j5, tu_estimate
jldi j4, 15                     ; s = 0: t = D + c rounded up, at least D + 1
jadd j7, j3, j4
jldi j4, 4
jshr j7, j7, j4
jadd j7, j7, j1
jsub j4, j7, j0
jldi j3, 63
jshr j4, j4, j3
jjnz j4, tu_fin
jor j0, j7, j7
jjmp tu_fin
tu_estimate:                    ; t near the root (a + sqrt(a^2 + 64 q)) / 32, then exact by the rule
jldi j4, 31
jshr j4, j6, j4
jjnz j4, tu_search               ; a^2 would not fit in 64 bits: the search
jldi j4, 56
jshr j4, j5, j4
jjnz j4, tu_search               ; neither would 64 q
jmul j1, j6, j6
jldi j4, 6
jshl j2, j5, j4
jadd j1, j1, j2                 ; a^2 + 64 q
jcall raiz
jadd j2, j6, j2
jldi j4, 5
jshr j2, j2, j4                 ; t = (a + root) / 32
jsub j4, j2, j0
jldi j3, 63
jshr j4, j4, j3
jjz j4, te_min
jor j2, j0, j0                  ; at least D + 1
te_min:
jldi j4, 1
jsub j5, j5, j4                 ; q - 1, what turno_ok compares with
jor j7, j2, j2
jcall turno_ok
jldi j1, 1
jsub j1, j1, j4
jwhile j1                       ; up, while it is not long enough
  jldi j4, 1
  jadd j2, j2, j4
  jor j7, j2, j2
  jcall turno_ok
  jldi j1, 1
  jsub j1, j1, j4
jwend
jsub j1, j2, j0
jwhile j1                       ; down, while the one before is also long enough (and at least D + 1)
  jldi j4, 1
  jsub j7, j2, j4
  jcall turno_ok
  jldi j1, 0
  jjz j4, te_down_end
  jor j2, j7, j7
  jsub j1, j2, j0
te_down_end:
jwend
jor j0, j2, j2
jjmp tu_fin
tu_search:
jldi j4, 1
jsub j5, j5, j4                 ; q - 1, what turno_ok compares with
jor j7, j0, j0
jcall turno_ok
jjnz j4, tu_fin                 ; D + 1 is already enough
jldi j1, 1                      ; doubling steps until one is enough
jldi j2, 1
jwhile j2
  jadd j7, j0, j1
  jcall turno_ok
  jldi j2, 0
  jjnz j4, tu_long
  jadd j1, j1, j1
  jldi j2, 1
tu_long:
jwend
jadd j2, j0, j1                 ; long enough
jldi j4, 1
jshr j1, j1, j4
jadd j0, j0, j1                 ; not long enough (D + 1 itself when the first step was enough)
jsub j1, j2, j0
jsub j1, j1, j4
jwhile j1                       ; halves, while they are not next to each other
  jsub j7, j2, j0
  jldi j4, 1
  jshr j7, j7, j4
  jadd j7, j7, j0
  jcall turno_ok
  jjz j4, tu_short
  jor j2, j7, j7
  jjmp tu_next
tu_short:
  jor j0, j7, j7
tu_next:
  jsub j1, j2, j0
  jldi j4, 1
  jsub j1, j1, j4
jwend
jor j0, j2, j2
tu_fin:
jret

; j7 = t -> j4 = 1 if t is long enough: t * (16 t - a) >= q, compared as 16 t - a > (q - 1) / t.
; Reads j5 (q - 1) and j6 (a). Uses j3.
turno_ok:
jldi j3, 4
jshl j4, j7, j3
jsub j4, j4, j6
jdiv j3, j5, j7
jsub j4, j4, j3
jldi j3, 0
jsub j4, j3, j4
jldi j3, 63
jshr j4, j4, j3                 ; 1 if it was positive
jret

; j1 = B > 0 -> j2 = the integer square root of B (the largest r with r * r <= B). Newton from above, from a
; power of two that is already above the root (5 steps find it). Uses j3, j4, j7.
raiz:
jldi j2, 1
jor j3, j1, j1
jldi j4, 32
jshr j7, j3, j4
jjz j7, ra_16
jor j3, j7, j7
jldi j4, 16
jshl j2, j2, j4
ra_16:
jldi j4, 16
jshr j7, j3, j4
jjz j7, ra_8
jor j3, j7, j7
jldi j4, 8
jshl j2, j2, j4
ra_8:
jldi j4, 8
jshr j7, j3, j4
jjz j7, ra_4
jor j3, j7, j7
jldi j4, 4
jshl j2, j2, j4
ra_4:
jldi j4, 4
jshr j7, j3, j4
jjz j7, ra_2
jor j3, j7, j7
jldi j4, 2
jshl j2, j2, j4
ra_2:
jldi j4, 2
jshr j7, j3, j4
jjz j7, ra_up
jadd j2, j2, j2
ra_up:
jadd j2, j2, j2                 ; now above the root
jdiv j3, j1, j2                 ; y = (x + B / x) / 2
jadd j3, j3, j2
jldi j4, 1
jshr j3, j3, j4
jsub j7, j3, j2
jldi j4, 63
jshr j7, j7, j4
jwhile j7                       ; while it still goes down
  jor j2, j3, j3
  jdiv j3, j1, j2
  jadd j3, j3, j2
  jldi j4, 1
  jshr j3, j3, j4
  jsub j7, j3, j2
  jldi j4, 63
  jshr j7, j7, j4
jwend
jret

; The turn of a cabin by its priority (Capitan: "the length of the turn is given by priority, between 0 and
; 1: towards 1 it works more, towards 0 it works less"). A turn t followed by a switch of cost c leaves the
; fraction t / (t + c) of the time for real work; making that fraction the priority p gives
; t = c * p / (1 - p), rounded up, at least 1 instruction. p = 1 rows until it ends (turn 2^62).
; cuanto: j1 = p in 65536ths, j3 = c in sixteenths of an instruction -> j0 = t. Uses j4, j5.
cuanto:
jldi j4, 1
jshi j4, 0                      ; 65536 = 1
jsub j5, j4, j1                 ; 1 - p
jldi j4, 1
jsub j0, j5, j4
jldi j4, 63
jsar j0, j0, j4
jjnz j0, cu_siempre             ; p = 1 (or more): until it ends
jldi j4, 4
jshl j5, j5, j4                 ; 16 (1 - p): c is in sixteenths
jmul j0, j3, j1                 ; c p
jadd j0, j0, j5
jldi j4, 1
jsub j0, j0, j4
jdiv j0, j0, j5                 ; rounded up
jjnz j0, cu_fin
jldi j0, 1                      ; at least one instruction
jjmp cu_fin
cu_siempre:
jldi j0, 4000h
jshi j0, 0
jshi j0, 0
jshi j0, 0
cu_fin:
jret
