; espera: 0000000000000007
; A conditional jump back over ~1 MiB of translated code (30000 jld, 9 ARM64 instructions each):
; beyond the reach of CBZ/CBNZ, so the translator must use the long form.
include '../janax.inc'
jldi j1, 0
jldi j3, 2
jldi j4, 1
vuelta:
repeat 30000
  jld j2, j1, 0
end repeat
jsub j3, j3, j4
jjnz j3, vuelta
jldi j0, 7
jhalt
