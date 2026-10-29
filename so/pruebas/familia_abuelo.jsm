; Three generations. The grandparent launches "padre", which launches "hijo" and ends. The grandparent
; signs whatever waits for its signature and counts it, until its child ended and a while after.
; With the parent's shadow, the grandchild's request is never the grandparent's business: j0 = 1
; (only the launch of "hijo" by "padre" was signed here).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h                   ; "padre" = 70 61 64 72 65
jldi j2, 65h
jshi j2, 7264h
jshi j2, 6170h
jst j2, j1, 0
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 5
jcall tocar
jadd j6, j13, j9                ; the parent's number
jldi j7, 0                      ; signatures given
jldi j2, 0
jwhilez j2                      ; while the parent runs
  jcall firmar_todo
  jldi j10, 19
  jadd j11, j6, j9
  jcall tocar
  jldi j8, 1
  jadd j2, j13, j8
jwend
jldi j1, 100                    ; and a while after
jwhile j1
  jcall firmar_todo
  jldi j8, 1
  jsub j1, j1, j8
jwend
jadd j0, j7, j9
jhalt
firmar_todo:                    ; sign the first request waiting for me, if any
jldi j10, 18
jldi j11, 800h
jldi j12, 100h
jcall tocar
jjz j13, nada
jldi j10, 17
jld j11, j11, 0
jldi j12, 1
jcall tocar
jldi j8, 1
jadd j7, j7, j8
nada:
jret
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
