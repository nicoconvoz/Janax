; A box moves (Capitan): room 1 moves to "hijo" (request 23, b = its number), which receives it and finds
; what the mother wrote. The mother no longer has it: its address died, and reading it ends her with code 5.
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
jldi j10, 23                    ; room 1 moves to it
jadd j11, j6, j9
jadd j12, j2, j9
jcall tocar
jadd j0, j13, j9
jld j1, j6, 0                   ; gone from here
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
