; The parent launches "hijo", looks at what is waiting for its signature and answers 1
; (1 sign, 0 reject), then waits until the child ends. j0 = the child's exit code.
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
jadd j6, j13, j9
jldi j7, 0
jwhilez j7
  jldi j10, 18                    ; what waits for my signature, into 800h
  jldi j11, 800h
  jldi j12, 100h
  jcall tocar
  jjz j13, nada
  jldi j10, 17                    ; sign (or reject) the first one: its id is at 800h
  jld j11, j11, 0
  jldi j12, 1
  jcall tocar
nada:
  jldi j10, 19
  jadd j11, j6, j9
  jcall tocar
  jldi j8, 1
  jadd j7, j13, j8
jwend
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
