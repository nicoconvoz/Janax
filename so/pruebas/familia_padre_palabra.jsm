; The parent launches "hijo", which says a word to it by -1 ("my parent"), and sleeps on its doorbell (29): it
; wakes with the child's number and reads the word (31). Then it asks how much the child rowed and how much it rowed
; itself (35: -1 is itself). j0 = the word, then whether each count is more than 0, a nibble each.
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
jadd j6, j13, j9                ; the child's number
jldi j10, 29                    ; asleep on its doorbell: the word rings it
jcall tocar
jldi j10, 31                    ; the word, at 800h: {who said it, the word}
jldi j11, 800h
jcall tocar
jld j0, j11, 8
jldi j8, 8
jshl j0, j0, j8
jldi j10, 35                    ; how much the child rowed
jadd j11, j6, j9
jcall tocar
jldi j7, 0
jjz j13, nada
jldi j7, 16
nada:
jor j0, j0, j7
jldi j10, 35                    ; and itself
jldi j11, -1
jcall tocar
jldi j7, 0
jjz j13, nada2
jldi j7, 1
nada2:
jor j0, j0, j7
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
