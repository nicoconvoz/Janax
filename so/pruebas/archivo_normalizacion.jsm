; Two labels that look the same: "é" in one piece (C3 A9) and "e" + combining acute (65 CC 81).
; Saved through the first, read through the second: same file. j0 = the byte read ("1" = 31h).
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h
jldi j2, 0A9C3h                 ; C3 A9
jst j2, j1, 0
jldi j2, 0                      ; 65 CC 81 at 208h
jshi j2, 81h
jshi j2, 0CC65h
jst j2, j1, 8
jldi j2, 31h                    ; "1" at 300h
jldi j6, 300h
jst j2, j6, 0
jldi j10, 4                     ; open the one-piece label
jadd j11, j1, j9
jldi j12, 2
jcall tocar
jadd j7, j13, j9
jshl j10, j7, j5                ; write "1"
jldi j8, 6
jor j10, j10, j8
jadd j11, j6, j9
jldi j12, 1
jcall tocar
jshl j10, j7, j5                ; close
jldi j8, 7
jor j10, j10, j8
jcall tocar
jldi j10, 4                     ; open the two-piece label
jldi j11, 208h
jldi j12, 3
jcall tocar
jshl j10, j13, j5               ; read 1 byte into 400h
jldi j8, 5
jor j10, j10, j8
jldi j11, 400h
jldi j12, 1
jcall tocar
jldb j0, j11, 0
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
