; A box made read only and then read and write again can be written. A treatment not built yet (run, bit 2)
; and a write-only box are refused (-1), and so is taking the write from the room the queue lives in (its
; answers need somewhere to go). j0 = 55h + the four answers: 0 + 0 - 1 - 1 - 1.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 16
pedido 2, j8, j10               ; room 1
jldi j9, 1                      ; read only
jst j9, j3, 24
pedido 21, j10, j11
jldi j9, 3                      ; read and write again
jst j9, j3, 24
pedido 21, j10, j12
jldi j9, 55h
jst j9, j10, 8                  ; it can be written
jld j0, j10, 8
jadd j0, j0, j11
jadd j0, j0, j12
jldi j9, 7                      ; and run: not built yet
jst j9, j3, 24
pedido 21, j10, j11
jadd j0, j0, j11
jldi j9, 2                      ; write only: no
jst j9, j3, 24
pedido 21, j10, j11
jadd j0, j0, j11
jldi j9, 1                      ; room 0 read only: the queue is there
jst j9, j3, 24
jldi j8, 0
pedido 21, j8, j11
jadd j0, j0, j11
jhalt
