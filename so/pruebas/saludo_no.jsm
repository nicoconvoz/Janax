; A greeting only within the family: to cabin 99 it is refused (-1), and a lone cabin waiting for a greeting
; is woken with -1, since nobody is left who could greet it. j0 = -2.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 99
pedido 28, j8, j0
pedido 29, j8, j1
jadd j0, j0, j1
jhalt
