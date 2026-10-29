; espera: FFFFFFFFFFFFFFFD
; -7 / 2 = -3 (truncates toward zero).
include '../janax.inc'
jldi j1, -7
jldi j2, 2
jdiv j0, j1, j2
jhalt
