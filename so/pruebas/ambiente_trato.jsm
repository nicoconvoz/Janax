; How to treat a box (Capitan): room 1 made read only by request 21 (b = its treatment, bit 0 read, bit 1
; write) can still be read, and a write to it ends the process with code 5. j0 = 77h + its answer (0).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 16
pedido 2, j8, j10               ; room 1
jldi j9, 77h
jst j9, j10, 0
jldi j9, 1                      ; read only
jst j9, j3, 24
pedido 21, j10, j11
jld j0, j10, 0                  ; it can still be read
jadd j0, j0, j11
jst j9, j10, 0                  ; and not written
jhalt
