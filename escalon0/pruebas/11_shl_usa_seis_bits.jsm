; espera: 0000000000000002
; A shift of 65 uses its low 6 bits: shifts by 1.
include '../janax.inc'
jldi j1, 1
jldi j2, 65
jshl j0, j1, j2
jhalt
