; A room uses only what it needs (Capitan: "plastic, without using less or more"): 33.000 rooms of 8 bytes
; standing at once, more than fit if each one reserved the addresses of the largest room (4 GiB each).
; j0 = how many were built (33.000 = 80E8h).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j7, 0
jshi j7, 80E8h                  ; 33.000
jldi j0, 0
jldi j8, 8
jwhile j7
  pedido 2, j8, j10
  jldi j9, 1
  jadd j10, j10, j9               ; -1 + 1 = 0: not built
  jjz j10, no_cupo
  jadd j0, j0, j9
no_cupo:
  jsub j7, j7, j9
jwend
jhalt
