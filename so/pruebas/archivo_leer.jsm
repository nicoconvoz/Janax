; In another run of the system: opens "🦎 notas.txt" and reads 4 bytes. j0 = what was read ("hola").
; The file is not closed: the system closes it when the process ends.
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h
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
jldi j10, 4                     ; open
jadd j11, j1, j9
jldi j12, 14
jcall tocar
jadd j7, j13, j9
jshl j10, j7, j5                ; read
jldi j8, 5
jor j10, j10, j8
jldi j11, 400h
jldi j12, 4
jcall tocar
jld j0, j11, 0
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
