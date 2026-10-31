; The parent launches "hijo" three times and signs what they ask, one request per touch, until it signed
; three; then it ends. While a child waits for its signature, the parent holds it.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j10, 15                    ; launch: type = 16 | rights << 32
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 4
jcall tocar
jcall tocar
jcall tocar
jldi j7, 3                      ; signatures left
jwhile j7
  jldi j10, 18                    ; what waits for my signature, into 800h
  jldi j11, 800h
  jldi j12, 100h
  jcall tocar
  jjz j13, nada
  jldi j10, 17                    ; sign the first one: its id is at 800h
  jld j11, j11, 0
  jldi j12, 1
  jcall tocar
  jsub j7, j7, j4
nada:
jwend
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
