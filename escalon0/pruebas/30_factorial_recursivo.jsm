; espera: 0000000000000078
; 5! = 120, recursive, saving n on the data stack (j15).
include '../janax.inc'
jldi j1, 5
jldi j2, 1
jldi j3, 8
jcall fact
jhalt
fact:
jjnz j1, recursion
jldi j0, 1
jret
recursion:
jsub j15, j15, j3
jst j1, j15, 0
jsub j1, j1, j2
jcall fact
jld j1, j15, 0
jadd j15, j15, j3
jmul j0, j0, j1
jret
