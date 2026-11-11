; espera: 00000000000000FA
; jldx rd, ra, rb: the word at ra + rb * 8, the count made while it reads (Capitan). A table 10, 20, 30, 40 at 64:
; index 2 = 30, index 0 = 10, from its end with index -3 = 10, and with rd = rb the index is read first: 20.
; j0 = 30 + 10 * 2 + 10 * 4 + 20 * 8.
include '../janax.inc'
jldi j1, 64
jldi j2, 10
jst j2, j1, 0
jldi j2, 20
jst j2, j1, 8
jldi j2, 30
jst j2, j1, 16
jldi j2, 40
jst j2, j1, 24
jldi j2, 2
jldx j3, j1, j2
jldi j2, 0
jldx j4, j1, j2
jldi j5, 88
jldi j2, -3
jldx j6, j5, j2
jldi j7, 1
jldx j7, j1, j7
jadd j0, j3, j4
jadd j0, j0, j4
jadd j0, j0, j6
jadd j0, j0, j6
jadd j0, j0, j6
jadd j0, j0, j6
jldi j8, 3
jshl j7, j7, j8
jadd j0, j0, j7
jhalt
