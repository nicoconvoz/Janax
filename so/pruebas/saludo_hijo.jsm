; A child greets its mother (P0, request 28) and ends. j0 = the greeting's answer (0).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 0                      ; its mother: P0
pedido 28, j8, j0
jhalt
