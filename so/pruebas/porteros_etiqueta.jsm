; F = my files porter. A = child of F limited to labels starting with "x". A child of A limited to "y"
; is refused ("y" is not a label A allows). Using A, opening "🦎 notas.txt" is refused.
; j0 = answer of the second cede + answer of the open = -1 + -1 = -2.
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j10, 11                    ; consult the files door
jldi j11, 3
jcall tocar
jadd j6, j13, j9                ; F
jldi j1, 600h                   ; block for "cede with label": rights, length, bytes
jldi j2, 15
jst j2, j1, 0
jldi j2, 1
jst j2, j1, 8
jldi j2, 78h                    ; "x"
jst j2, j1, 16
jldi j10, 15
jadd j11, j6, j9
jadd j12, j1, j9
jcall tocar
jadd j7, j13, j9                ; A
jldi j2, 79h                    ; "y"
jst j2, j1, 16
jldi j10, 15
jadd j11, j7, j9
jadd j12, j1, j9
jcall tocar
jadd j8, j13, j9                ; refused
jldi j10, 9                     ; use A
jadd j11, j7, j9
jcall tocar
jldi j1, 200h                   ; open "🦎 notas.txt"
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
jldi j10, 4
jadd j11, j1, j9
jldi j12, 14
jcall tocar
jadd j0, j13, j8
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
