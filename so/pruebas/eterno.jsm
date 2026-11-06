; A program that never ends on its own: a while whose condition never changes (the mutant that hangs).
include '../../escalon0/janax.inc'
jldi j1, 1
jwhile j1
  jadd j0, j0, j1
jwend
jhalt
