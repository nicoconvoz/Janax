; A program that remakes its own cabin (36) with the program "hijo" and ends: the cabin is not ended, it starts
; again from the first instruction of "hijo", with its number (still P0) and everything it is. If it could not be
; remade, it ends as itself with j0 = 77h.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j10, 36
jadd j11, j1, j9
jldi j12, 4
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jldi j0, 77h
jhalt
