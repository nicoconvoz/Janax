; Calls 4096 deep (the limit), comes back, and goes down again: the return stack grows as it is used and
; may shrink between turns. j0 = 2 * 4096 returns.
include '../../escalon0/janax.inc'
jldi j2, 1
jldi j3, 2                      ; dives
jwhile j3
  jldi j1, 4096
  jcall baja
  jsub j3, j3, j2
jwend
jhalt
baja:
jsub j1, j1, j2
jjz j1, fondo
jcall baja
fondo:
jadd j0, j0, j2
jret
