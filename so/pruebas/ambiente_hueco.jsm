; A destroyed room is a hole: touching it ends the process with code 5, like outside the cabin, even
; with a room still standing after it.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jldi j3, 100h
jldi j8, 1000h
pedido 2, j8, j10
pedido 2, j8, j11
pedido 3, j10, j12
jld j0, j11, 0          ; room B is still there
jld j0, j10, 0          ; room A is not
jhalt
