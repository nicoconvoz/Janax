; A label that is not valid UTF-8 (a lone FF byte) is refused: open answers -1.
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jldi j1, 200h
jldi j2, 0FFh
jst j2, j1, 0
jldi j10, 4
jadd j11, j1, j9
jldi j12, 1
jcall tocar
jadd j0, j13, j9
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
