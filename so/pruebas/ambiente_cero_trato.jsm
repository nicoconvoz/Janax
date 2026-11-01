; Room 0 read only: with the queue moved to room 1, room 0 can still be read (also past its fast limit), and
; a write to it ends the process with code 5. j0 = 66h + 66h + its answer (0).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j9, 66h
jldi j2, 0
jst j9, j2, 0FF0h               ; near room 0's end
jldi j8, 100h
pedido 2, j8, j10               ; room 1: the queue moves there
jldi j3, 0
jadd j3, j3, j10
jldi j9, 1                      ; room 0 read only
jst j9, j3, 24
jldi j8, 0
pedido 21, j8, j11
jldi j2, 0
jld j0, j2, 0FF0h               ; it can still be read
jld j1, j2, 0FF0h
jadd j0, j0, j1
jadd j0, j0, j11
jst j0, j2, 0                   ; and not written
jhalt
