; Asks for bolita 1 (request 20) and then rows as long as largo_1000. j0 = the bolita it got: never more
; than the one it was launched with.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jldi j4, 20                     ; bolita: a = the one it wants, in 65536ths
jst j4, j3, 8
jldi j4, 1
jshi j4, 0                      ; 10000h = 1
jst j4, j3, 16
jsys j6, j3
jld j9, j3, 32
jldi j0, 0
jldi j1, 1000
jldi j2, 1
jwhile j1
  jadd j0, j0, j1
  jsub j1, j1, j2
jwend
jldi j5, 0
jadd j0, j9, j5
jhalt
