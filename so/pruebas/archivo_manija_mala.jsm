; Reading through handle 5, which this process never opened, answers -1.
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j10, 5
jshl j10, j10, j5
jldi j8, 5
jor j10, j10, j8
jldi j11, 400h
jldi j12, 4
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
