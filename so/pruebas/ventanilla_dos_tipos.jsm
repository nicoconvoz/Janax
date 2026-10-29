; "write" and "grow" in the same round: two screens. Growing answers the new room's address (room 1,
; position 0), and a store there proves the room was built.
include '../../escalon0/janax.inc'
jldi j1, 200h
jldi j2, 0A78h
jst j2, j1, 0
jldi j3, 100h
jldi j4, 2
jst j4, j3, 0
jldi j4, 1
jst j4, j3, 8
jst j1, j3, 16
jldi j5, 2
jst j5, j3, 24
jldi j4, 2
jst j4, j3, 40
jldi j5, 1000h
jst j5, j3, 48
jsys j6, j3
jld j0, j3, 64
jst j5, j0, 0
jhalt
