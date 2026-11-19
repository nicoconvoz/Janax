; The parent launches "hijo" and asks that it row in the gaps (42): answered 0. Asked for a cabin that is not its
; child (itself): -2. The child rows all the same (the host's lowest priority is still a turn when nobody else wants
; the processor), says its word, and the parent hears it. j0 = the word, then a nibble for each answer (1 = as said).
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
jldi j10, 42                    ; it rows in the gaps
jadd j11, j6, j9
jldi j12, 1
jcall tocar
jldi j7, 0
jjnz j13, no_cero
jldi j7, 16
no_cero:
jldi j10, 42                    ; a cabin that is not its child: itself
jldi j11, 0
jldi j12, 1
jcall tocar
jldi j8, 2
jadd j13, j13, j8
jjnz j13, no_ajena
jldi j8, 1
jor j7, j7, j8
no_ajena:
jldi j10, 29                    ; asleep on its doorbell: the word rings it
jcall tocar
jldi j10, 31                    ; the word, at 800h: {who said it, the word}
jldi j11, 800h
jcall tocar
jld j0, j11, 8
jldi j8, 8
jshl j0, j0, j8
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
