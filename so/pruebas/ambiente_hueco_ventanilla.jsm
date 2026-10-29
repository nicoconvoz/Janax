; The window checks rooms too: writing from a destroyed room answers -1 and nothing is written.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 1000h
pedido 2, j8, j10
pedido 2, j8, j11
pedido 3, j10, j12
jldi j4, 1
jst j4, j3, 0
jst j4, j3, 8           ; kind 1: write
jst j10, j3, 16         ; from the hole
jldi j4, 4
jst j4, j3, 24          ; 4 bytes
jsys j6, j3
jld j0, j3, 32
jhalt
