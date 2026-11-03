; Born with a box only to read: the dowry gives it to "hijo" to read (b = 1), so its write ends it with
; code 5 and the mother finds nothing written. j0 = 0 + the dowry's answer (0).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j10, 2                     ; room 1, of 16 bytes
jldi j11, 16
jcall tocar
jadd j6, j13, j9
jldi j8, 77h
jst j8, j6, 0
jldi j10, 22                    ; to the dowry, to read and write
jadd j11, j6, j9
jldi j12, 1
jcall tocar
jadd j7, j13, j9
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j10, 15                    ; launch it, with every right
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 4
jcall tocar
jadd j2, j13, j9                ; its number
jldi j1, 0
jwhilez j1                      ; while it runs
  jldi j10, 19
  jadd j11, j2, j9
  jcall tocar
  jldi j8, 1
  jadd j1, j13, j8
jwend
jld j0, j6, 8
jadd j0, j0, j7
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
