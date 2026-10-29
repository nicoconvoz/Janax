; espera: 8000000000000000
; INT64_MIN / -1 wraps to INT64_MIN (x86 idiv would trap).
include '../janax.inc'
jldi j1, 8000h
jshi j1, 0
jshi j1, 0
jshi j1, 0
jldi j2, -1
jdiv j0, j1, j2
jhalt
