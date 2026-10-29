; Opens the file labelled "🦎 notas.txt" (creates it), writes "hola" and closes it. j0 = bytes written.
; Kind and handle travel together: type = kind | handle << 32.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h                   ; the request queue
jldi j4, 1
jldi j5, 32
jldi j1, 200h                   ; the label, 14 bytes of UTF-8: F0 9F A6 8E 20 n o t a s . t x t
jldi j2, 746Fh
jshi j2, 6E20h
jshi j2, 8EA6h
jshi j2, 9FF0h
jst j2, j1, 0
jldi j2, 0
jshi j2, 7478h
jshi j2, 742Eh
jshi j2, 7361h
jst j2, j1, 8
jldi j6, 300h                   ; "hola"
jldi j2, 616Ch
jshi j2, 6F68h
jst j2, j6, 0
jldi j10, 4                     ; open
jadd j11, j1, j9
jldi j12, 14
jcall tocar
jadd j7, j13, j9                ; the handle
jshl j10, j7, j5                ; write to the file
jldi j8, 6
jor j10, j10, j8
jadd j11, j6, j9
jldi j12, 4
jcall tocar
jadd j0, j13, j9
jshl j10, j7, j5                ; close
jldi j8, 7
jor j10, j10, j8
jcall tocar
jhalt
tocar:                          ; one request (j10 type, j11 a, j12 b) -> j13 answer
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
