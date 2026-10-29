; j0 = 1 + ... + 9 = 45: the same length as while_suma and one different word. Programs are shared only
; when every word is the same, so these two must never get each other's table.
include '../../escalon0/janax.inc'
jldi j0, 0
jldi j1, 9
jldi j2, 1
jwhile j1
  jadd j0, j0, j1
  jsub j1, j1, j2
jwend
jhalt
