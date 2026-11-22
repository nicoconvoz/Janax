; A child that asks to give its next child every signature (45, b = -1): it can give only what it inherited.
; j0 = what remained.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jldi j10, 45
jst j10, j3, 8
jldi j10, 0
jst j10, j3, 16
jldi j10, -1
jst j10, j3, 24
jsys j6, j3
jld j0, j3, 32
jhalt
