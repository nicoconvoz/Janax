; A request of an unknown type is answered -1 and takes no screen.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jldi j4, 99
jst j4, j3, 8
jsys j6, j3
jld j0, j3, 32
jhalt
