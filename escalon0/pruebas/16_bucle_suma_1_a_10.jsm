; espera: 0000000000000037
; j0 = 1 + 2 + ... + 10 = 55
include '../janax.inc'
jldi j0, 0
jldi j1, 10
jldi j2, 1
vuelta:
jadd j0, j0, j1
jsub j1, j1, j2
jjnz j1, vuelta
jhalt
