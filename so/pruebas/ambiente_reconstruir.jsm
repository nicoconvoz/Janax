; With every room destroyed the count starts again (Capitan): the next room is number 1 again, new and in
; zeros. j0 = (1 << 32) + 0.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 1000h
pedido 2, j8, j10
jldi j9, 55h
jst j9, j10, 0
pedido 3, j10, j12
pedido 2, j8, j11
jld j0, j11, 0
jadd j0, j0, j11
jhalt
