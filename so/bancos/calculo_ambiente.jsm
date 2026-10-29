; The same as calculo, with its memory in a room built by the window instead of room 0: every access goes
; through the translation package. Its time against calculo is what translating costs.
include '../../escalon0/janax.inc'
include '../pruebas/ambientes.inc'
jldi j3, 100h
jldi j8, 8
pedido 2, j8, j4                ; a room of one qword: j4 = its address
jldi j0, 0
jldi j1, 400h
jshi j1, 0                      ; j1 = 4000000h rounds
jldi j2, 1
jldi j3, 3
jwhile j1
  jcall paso
  jsub j1, j1, j2
jwend
jhalt
paso:
jld j5, j4, 0
jadd j5, j5, j1
jshl j6, j5, j3
jxor j5, j5, j6
jst j5, j4, 0
jadd j0, j0, j5
jret
