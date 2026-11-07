; The parent launches "hijo" and sleeps on its doorbell (29) instead of looking in a loop: a request that waits for
; its signature rings it, so it wakes with the child's number, signs (17) what waits (18), and sleeps again; the
; child's end rings it too, and it wakes with its number again. j0 = the two greetings, one byte each.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
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
jldi j7, 255
jldi j8, 8
jldi j10, 29                    ; asleep on its doorbell: the child's request rings it
jcall tocar
jand j0, j13, j7
jldi j10, 18                    ; what waits for my signature, into 800h
jldi j11, 800h
jldi j12, 100h
jcall tocar
jldi j10, 17                    ; signed: its id is at 800h
jld j11, j11, 0
jldi j12, 1
jcall tocar
jldi j10, 29                    ; asleep again: the child's end rings it
jcall tocar
jshl j0, j0, j8
jand j13, j13, j7
jor j0, j0, j13
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
