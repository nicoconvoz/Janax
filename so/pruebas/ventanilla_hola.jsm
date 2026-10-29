; One "write" request: prints hola, then j0 = bytes written.
include '../../escalon0/janax.inc'
jldi j1, 200h
jldi j2, 0Ah
jshi j2, 616Ch
jshi j2, 6F68h
jst j2, j1, 0
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jst j4, j3, 8
jst j1, j3, 16
jldi j5, 5
jst j5, j3, 24
jsys j6, j3
jld j0, j3, 32
jhalt
