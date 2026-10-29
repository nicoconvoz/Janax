; The first order builds room 0 of the size asked: the register gets its address (0) and j15 its top.
; j0 = 1000h (j15) + 0 (j1) + 5 (stored at the last qword of the room).
include '../../escalon0/janax.inc'
jfirst j1, 1000h
jldi j2, 5
jst j2, j15, -8
jld j0, j15, -8
jadd j0, j0, j15
jadd j0, j0, j1
jhalt
