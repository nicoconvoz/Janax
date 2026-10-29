; espera: FFFFFFFFFFFFFFFF
; A request the host does not offer answers -1 (here a number no catalog uses).
include '../janax.inc'
jldi j1, 100h
jldi j2, 7FFFh
jst j2, j1, 0
jhost j0, j1
jhalt
