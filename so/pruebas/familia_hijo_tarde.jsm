; Rows a long while first (longer than the parent that launched it), then one "write" request: prints hola, then
; j0 = bytes written. So "hola" comes only if it outlived its parent.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j1, 30000                  ; a long while, rowing (3 times its parent's)
jldi j8, 3
jmul j1, j1, j8
jwhile j1
  jldi j8, 1
  jsub j1, j1, j8
jwend
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
