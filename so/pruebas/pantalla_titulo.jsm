; Janax's own screen (kind 43, name the window): a program names its own window. "Luma" (4 bytes) answers 4; a text
; outside the cabin answers -1. j0 = the first answer, then a nibble: 1 if the second was -1.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h                   ; the request queue
jldi j4, 1
jldi j1, 400h                   ; "Luma" = 4C 75 6D 61
jldi j2, 6D61h
jshi j2, 0
jldi j5, 16
jshl j2, j2, j5
jldi j5, 754Ch
jor j2, j2, j5
jst j2, j1, 0
jldi j10, 43
jldi j11, 400h
jldi j12, 4
jcall tocar
jadd j7, j13, j9
jldi j10, 43                    ; far outside the cabin
jldi j11, 7FFFh
jshi j11, 0FFF0h
jldi j12, 4
jcall tocar
jldi j8, 4
jshl j0, j7, j8
jldi j8, 1
jadd j13, j13, j8
jjnz j13, fin
jldi j8, 1
jor j0, j0, j8
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
