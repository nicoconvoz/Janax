; Destroying a room gives its number back: the next room is built with the same address, new and in
; zeros: its number is reused. j0 = (1 << 32) + 0.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
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
