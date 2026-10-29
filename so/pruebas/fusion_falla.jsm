; A memory access that fails right before a condition ends the process there: code 5, and the condition
; is never counted.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j1, -1
jld j2, j1, 0
jjnz j2, fuera
jhalt
fuera:
jldi j0, 7
jhalt
