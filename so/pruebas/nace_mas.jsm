; A child is never given more than its mother has: room 1 made read only, a dowry to read and write is
; refused (-1) and one to read is taken (0). j0 = -1 + 0.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 16
pedido 2, j8, j10               ; room 1
jldi j9, 1                      ; read only
jst j9, j3, 24
pedido 21, j10, j11
jldi j9, 3                      ; a dowry to read and write: no
jst j9, j3, 24
pedido 22, j10, j0
jldi j9, 1                      ; to read: yes
jst j9, j3, 24
pedido 22, j10, j11
jadd j0, j0, j11
jhalt
