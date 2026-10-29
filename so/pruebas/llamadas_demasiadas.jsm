; One call past the limit (4097 deep) ends the process with code 7, as always.
include '../../escalon0/janax.inc'
jldi j2, 1
jldi j3, 2                      ; dives
jwhile j3
  jldi j1, 4097
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
