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

; The sheet of turns (Capitan: "the captain sets the priorities of when each one rows, so that they do not
; have to be told"): the next turns at once, for the kernel to follow while the world is the one imagined.
; In: at 0 n (cabins), at 8 c (sixteenths of an instruction), at 16 K (turns wanted); at 32, n entries
; {served, id} in id order, a cabin some rower is rowing with bit 63 of its id set (it cannot be chosen, it
; only counts as the next in line). Out: at 32 + 16 n, the turns as {id, turn}; j0 = how many.
; The factory rule, simulating one rower: the least served cabin nobody rows (ties: the lower id) rows the
; turn of the rule, as if it used it to its end; a cabin alone rows until it ends (turn 2^62) and the
; sheet stops there. Needs every register at 0 (the kernel clears them); uses all of them.
hoja:
jld j8, j14, 0                  ; n
jld j9, j14, 8                  ; c
jld j10, j14, 16                ; turns wanted
jldi j4, 4
jshl j11, j8, j4
jldi j4, 32
jadd j11, j11, j4               ; where the turns go
jldi j12, 0                     ; turns written
jldi j13, 1
jwhile j10
  jldi j15, 0                   ; the chosen cabin (its entry), 0 = none
  jldi j6, -1
  jshr j6, j6, j13              ; its service (the largest number while there is none)
  jor j7, j6, j6                ; the least service among the others
  jldi j1, 32
  jor j2, j8, j8
  jwhile j2                     ; every cabin
    jld j3, j1, 0
    jld j4, j1, 8
    jldi j5, 63
    jshr j4, j4, j5             ; rowed by someone
    jjnz j4, ho_other
    jsub j4, j3, j6
    jshr j4, j4, j5             ; less served than the chosen one
    jjz j4, ho_other
    jsub j4, j6, j7             ; the chosen one so far becomes one of the others
    jshr j4, j4, j5
    jjz j4, ho_keep
    jor j7, j6, j6
ho_keep:
    jor j6, j3, j3
    jor j15, j1, j1
    jjmp ho_next
ho_other:
    jsub j4, j3, j7
    jldi j5, 63
    jshr j4, j4, j5
    jjz j4, ho_next
    jor j7, j3, j3
ho_next:
    jldi j4, 16
    jadd j1, j1, j4
    jsub j2, j2, j13
  jwend
  jjz j15, ho_end               ; nobody can row
  jld j4, j15, 8
  jst j4, j11, 0                ; its id
  jldi j4, -1
  jshr j4, j4, j13
  jsub j4, j7, j4
  jjnz j4, ho_turn
  jldi j0, 4000h                ; alone: until it ends, and the sheet stops here
  jshi j0, 0
  jshi j0, 0
  jshi j0, 0
  jst j0, j11, 8
  jadd j12, j12, j13
  jjmp ho_end
ho_turn:
  jsub j1, j7, j6               ; D: how much more service the next one in line has received
  jldi j4, 63
  jsar j4, j1, j4
  jxor j4, j4, j13
  jand j4, j4, j13
  jjnz j4, ho_d
  jldi j1, 0                    ; never below 0: a next one with less (rowed by someone) is already behind
ho_d:
  jor j2, j6, j6                ; s
  jor j3, j9, j9
  jcall turno
  jst j0, j11, 8
  jld j4, j15, 0                ; as if it used it to its end
  jadd j4, j4, j0
  jst j4, j15, 0
  jldi j4, 16
  jadd j11, j11, j4
  jadd j12, j12, j13
  jsub j10, j10, j13
  jjmp ho_more
ho_end:
  jldi j10, 0
ho_more:
jwend
jor j0, j12, j12
jret
