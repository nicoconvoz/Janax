; "Solo si se lo da desde lo alto" (the Capitan, 2026-11-23): a parent asks to name its own child its own sibling (46),
; which it cannot (only one above its parent can). It launches "hijo", asks, and ends: j0 = the answer, -2. Nobody
; signs its child's "hola" while it lives; when it ends, the kernel names its child (it is highest).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jst j4, j3, 0
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jst j10, j3, 8
jst j1, j3, 16
jldi j12, 4
jst j12, j3, 24
jsys j14, j3
jld j11, j3, 32                 ; my child's number
jldi j10, 46
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j14, j3, 24
jsys j14, j3
jld j0, j3, 32
jhalt
