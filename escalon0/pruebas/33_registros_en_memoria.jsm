; espera: FFFFFFFFFFFFFFEB
; Spilled registers (j10..j14) in every role: arithmetic, division, shift, memory and branch.
include '../janax.inc'
jldi j10, 100
jldi j11, 7
jdiv j12, j10, j11
jadd j12, j12, j11
jldi j13, 1
jshl j14, j12, j13
jldi j1, 200h
jst j14, j1, 0
jld j10, j1, 0
jsub j11, j10, j12
jjz j13, mal
jadd j0, j11, j13
jsub j0, j0, j13
jadd j0, j0, j0
jldi j3, 21
jsub j0, j0, j3
jsub j0, j0, j3
jsub j0, j0, j3
jhalt
mal:
jldi j0, -1
jhalt
