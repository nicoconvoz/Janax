; A book on the host, anywhere: reads its address from "ruta", opens it there (37, read only) and
; writes 4 bytes to it. j0 = what the write answers (-1: the host door only reads;
; 0BADh if it did not open).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h
jldi j2, 0
jshi j2, 6174h
jshi j2, 7572h
jst j2, j1, 0
jldi j10, 4                     ; open "ruta"
jadd j11, j1, j9
jldi j12, 4
jcall tocar
jshl j10, j13, j5               ; read the address
jldi j8, 5
jor j10, j10, j8
jldi j11, 400h
jldi j12, 512
jcall tocar
jadd j12, j13, j9
jldi j10, 37                    ; open it on the host
jldi j11, 400h
jcall tocar
jadd j7, j13, j9
jldi j8, 63                     ; (it did not even open: 0BADh)
jsar j6, j7, j8
jjnz j6, not_open
jshl j10, j7, j5                ; write 4
jldi j8, 6
jor j10, j10, j8
jldi j11, 200h
jldi j12, 4
jcall tocar
jadd j0, j13, j9
jhalt
not_open:
jldi j0, 0BADh
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
