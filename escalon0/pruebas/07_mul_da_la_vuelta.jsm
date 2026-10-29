; espera: 0000000000000000
; 0x4000000000000000 * 4 overflows 64 bits and wraps to zero.
include '../janax.inc'
jldi j1, 4000h
jshi j1, 0
jshi j1, 0
jshi j1, 0
jldi j2, 4
jmul j0, j1, j2
jhalt
