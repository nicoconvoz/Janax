; espera: 0000000000000003
; Destination equal to the second operand: j2 = j1 - j2 must read j2 before writing it.
include '../janax.inc'
jldi j1, 10
jldi j2, 7
jsub j2, j1, j2
jadd j0, j2, j2
jsub j0, j0, j2
jhalt
