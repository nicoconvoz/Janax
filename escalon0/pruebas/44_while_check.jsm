; espera: 0000000000000631
; jwcheck: the condition of a while is code written by its programmer, between jwcheck and jwend. It runs
; before every lap, the first one included, and it can be any condition (and, or), not only one register.
; And: j1 = 2, j2 = 1; bit by bit 2 AND 1 = 0, but both are not zero, so it runs one lap: +1.
; Or: j1 = 0, j2 = 3; jor is the logical or: three laps of 16: +48.
; Nested, with forward jumps inside the condition: 3 outer laps, 2 inner laps of 256 each: +1536.
; The condition runs before the first lap: j5 = 1 before the while, the condition makes it 0, no lap.
include '../janax.inc'
jldi j0, 0
jldi j9, 1
jldi j10, 63
jldi j11, 0
jldi j1, 2
jldi j2, 1
jwhile j5
  jadd j0, j0, j9
  jsub j1, j1, j9
  jsub j2, j2, j9
jwcheck
  jsub j5, j11, j1              ; mask of j1: all ones if it is not zero
  jor j5, j5, j1
  jsar j5, j5, j10
  jsub j6, j11, j2
  jor j6, j6, j2
  jsar j6, j6, j10
  jand j5, j5, j6
jwend
jldi j1, 0
jldi j2, 3
jldi j8, 16
jwhile j5
  jadd j0, j0, j8
  jsub j2, j2, j9
jwcheck
  jor j5, j1, j2
jwend
jldi j1, 3
jldi j7, 256
jwhile j1
  jldi j2, 4
  jldi j3, 2
  jwhile j5
    jadd j0, j0, j7
    jsub j2, j2, j9
    jsub j3, j3, j9
  jwcheck
    jldi j5, 0
    jjz j2, and_out
    jjz j3, and_out
    jldi j5, 1
and_out:
  jwend
  jsub j1, j1, j9
jwend
jldi j5, 1
jwhile j5
  jldi j0, 0
jwcheck
  jldi j5, 0
jwend
jhalt
