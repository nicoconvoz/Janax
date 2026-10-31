; Rooms 1 and 2; room 1 is destroyed while 2 lives: the next room is 3, never 1 again (Capitan: "the holes
; are a count of the rooms that were and are no more, they can not be replaced to confuse, only new ones
; added"), and room 2 still works. j0 = (3 << 32) + 77h.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 1000h
pedido 2, j8, j10               ; room 1
pedido 2, j8, j11               ; room 2
pedido 3, j10, j12              ; room 1 is destroyed
pedido 2, j8, j13               ; a new room: 3
jldi j9, 77h
jst j9, j11, 0
jld j6, j11, 0
jadd j0, j13, j6
jhalt
