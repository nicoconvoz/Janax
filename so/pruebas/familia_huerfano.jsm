; The parent launches "hijo", waits until the child has a request waiting for its signature, and ends
; without signing: the kernel adopts the child and signs for it. j0 = 7.
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 4
jcall tocar
jldi j13, 0
jwhilez j13
  jldi j10, 18
  jldi j11, 800h
  jldi j12, 100h
  jcall tocar
jwend
jldi j0, 7
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
