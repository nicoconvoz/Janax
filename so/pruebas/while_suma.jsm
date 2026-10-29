; j0 = 1 + ... + 10 = 55 with the while, Janax's only loop. Two copies with switch cost 0 take turns of
; one or two instructions, so a turn ends at every point of the loop, also between the entry jump and the condition.
include '../../escalon0/janax.inc'
jldi j0, 0
jldi j1, 10
jldi j2, 1
jwhile j1
  jadd j0, j0, j1
  jsub j1, j1, j2
jwend
jhalt
