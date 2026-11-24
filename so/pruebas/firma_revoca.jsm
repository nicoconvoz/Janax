; The same as firma_hereda, but the parent takes the inherited signature back (45 with a = the child, b = 0)
; before greeting it: the child's write waits for its signature again and rings it; the parent signs (17) and
; sleeps until the child's end. j0 = byte 0 who rang, byte 1 how many waited, byte 2 what the first 45 answered,
; byte 3 what the revocation answered (what remained: 0).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j10, 45
jldi j11, 0
jldi j12, 2
jcall tocar
jadd j7, j13, j9
jldi j5, 32
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
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
jldi j10, 45                    ; taken back: it signs nothing by inheritance any more
jadd j11, j6, j9
jldi j12, 0
jcall tocar
jldi j2, 900h
jst j13, j2, 0
jldi j10, 28
jadd j11, j6, j9
jcall tocar
jldi j10, 29                    ; its write rings me: it waits for my signature
jcall tocar
jldi j8, 255
jand j0, j13, j8
jldi j10, 18
jldi j11, 800h
jldi j12, 100h
jcall tocar
jldi j8, 8
jshl j15, j13, j8
jor j0, j0, j15
jldi j10, 17                    ; signed
jld j11, j11, 0
jldi j12, 1
jcall tocar
jldi j10, 29                    ; its end rings me
jcall tocar
jldi j8, 16
jshl j7, j7, j8
jor j0, j0, j7
jldi j2, 900h
jld j2, j2, 0
jldi j8, 255
jand j2, j2, j8
jldi j8, 24
jshl j2, j2, j8
jor j0, j0, j2
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
