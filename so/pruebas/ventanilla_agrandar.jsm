; One "grow" request of 8 bytes: j0 = the new room's address (1 << 32), or -1 if the porters deny it.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 8
pedido 2, j8, j0
jhalt
