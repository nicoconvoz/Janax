; espera: 0000000034000000
; A byte stored at offset 3 lands in bits 24..31 of the word (little-endian).
include '../janax.inc'
jldi j1, 100h
jldi j2, 1234h
jstb j2, j1, 3
jld j0, j1, 0
jhalt
