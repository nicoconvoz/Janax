; The middle generation: its next child is born with "write" (45), it launches "nieto" and tells its parent (30),
; and sleeps until its parent greets it back. Then it greets its own child, which writes, and sleeps: if the write
; waits for its signature, it signs it (17) and sleeps until the end. j0 = how many waited for its signature.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j10, 45
jldi j11, 0
jldi j12, 2
jcall tocar
jldi j5, 32
jldi j1, 200h                   ; "nieto" = 6E 69 65 74 6F
jldi j2, 6Fh
jshi j2, 7465h
jshi j2, 696Eh
jst j2, j1, 0
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 5
jcall tocar
jadd j6, j13, j9
jldi j10, 30                    ; to my parent: my child is born
jldi j11, -1
jldi j12, 1
jcall tocar
jldi j10, 29                    ; until my parent greets me
jcall tocar
jldi j10, 28
jadd j11, j6, j9
jcall tocar
jldi j10, 29                    ; its write or its end rings me
jcall tocar
jldi j10, 18
jldi j11, 800h
jldi j12, 100h
jcall tocar
jadd j0, j13, j9
jjz j0, fin
jldi j10, 17
jld j11, j11, 0
jldi j12, 1
jcall tocar
jldi j10, 29
jcall tocar
fin:
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
