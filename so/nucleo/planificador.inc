; The scheduler of Janax OS, written in Janax (the first piece of the kernel in Janax).
;
; The turn (Capitan: "that priority gives the real %"): a process that is being served keeps the processor
; while (t - D) * t < c * (s + t), so its turn is the least t >= D + 1 with t * (t - D - c) >= c * s; the
; real root of that equation is the old formula ((D + c) + sqrt((D + c)^2 + 4 c s)) / 2, rounded up.
;   D = how much more service the next one in line has received, s = the service this one has received,
;   c = the cost of a switch, in instructions.
; In integers and exact (the old formula used floating point): c comes in sixteenths of an instruction,
; and the comparisons divide instead of multiplying, so nothing overflows while c * 16 * s < 2^63 (with a
; switch cost of 8 instructions, until a process has received ~7 * 10^16 instructions). The same result on
; every machine and in every engine.
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
jjnz j5, tu_search
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
