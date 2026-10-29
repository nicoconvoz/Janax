; espera: 0000000000100000
; j15 (stack pointer) starts at the top of data memory (1 MiB).
include '../janax.inc'
jldi j3, 0
jadd j0, j15, j3
jhalt
