; The address of a destroyed room dies with it: rooms 1 and 2, room 1 destroyed, a new room built (3), and
; then a load from room 1's address ends the process with code 5, instead of reading room 3.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 1000h
pedido 2, j8, j10               ; room 1
pedido 2, j8, j11               ; room 2
pedido 3, j10, j12              ; room 1 is destroyed
pedido 2, j8, j13               ; a new room: 3
jld j0, j10, 0                  ; room 1's address: it is gone
jhalt
