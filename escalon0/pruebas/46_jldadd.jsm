; espera: 00000000000015E5
; jldadd rd, ra, imm: the word at ra + imm gets rd added, and rd keeps the sum (the album that adds while it looks,
; Capitan). 5 + 3 = 8, 8 - 10 = -2 (read back with jld), from another base and a negative offset -2 + 7 = 5,
; and with rd = ra the address is taken before the sum: 5 + 16 = 21.
; j0 = (-2 + 16) * 16 + 5 + 21 * 256.
include '../janax.inc'
jldi j1, 0
jldi j2, 5
jst j2, j1, 16
jldi j2, 3
jldadd j2, j1, 16
jldi j2, -10
jldadd j2, j1, 16
jld j3, j1, 16
jldi j4, 24
jldi j5, 7
jldadd j5, j4, -8
jldi j6, 16
jldadd j6, j6, 0
jldi j7, 16
jadd j0, j3, j7
jldi j7, 4
jshl j0, j0, j7
jadd j0, j0, j5
jldi j7, 8
jshl j6, j6, j7
jadd j0, j0, j6
jhalt
