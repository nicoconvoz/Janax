; A child that counts the boxes it was born with: it asks for rooms 1 to 6 to be read only (request 21
; answers -1 for a room it does not have) and adds the first qword of each one it has.
; j0 = their sum + (how many << 32).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j5, 32
jldi j12, 1                     ; the room
jldi j13, 6                     ; how many to look at
jldi j0, 0
jwhile j13
  jshl j8, j12, j5
  jldi j9, 1
  jst j9, j3, 24
  pedido 21, j8, j10
  jjnz j10, ausente
  jld j11, j8, 0
  jadd j0, j0, j11
  jldi j11, 1
  jshl j11, j11, j5
  jadd j0, j0, j11
ausente:
  jldi j9, 1
  jadd j12, j12, j9
  jsub j13, j13, j9
jwend
jhalt
