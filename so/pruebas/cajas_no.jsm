; What a box can not do: be linked to a cabin that is not family (99), move to itself, be linked with more
; than this cabin has, and be received when nothing arrived. j0 = -1 four times.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 16
pedido 2, j8, j10               ; room 1
jldi j9, 99                     ; to cabin 99: no
jst j9, j3, 24
pedido 24, j10, j0
jldi j9, 0                      ; to itself: no
jst j9, j3, 24
pedido 23, j10, j11
jadd j0, j0, j11
jldi j9, 1                      ; read only, then linked to read and write: no
jst j9, j3, 24
pedido 21, j10, j11
jldi j9, 0
jst j9, j3, 24
jldi j5, 32
jldi j7, 3
jshl j7, j7, j5
jldi j8, 24
jor j7, j7, j8
jldi j4, 1
jst j4, j3, 0
jst j7, j3, 8
jst j10, j3, 16
jsys j6, j3
jld j11, j3, 32
jadd j0, j0, j11
pedido 25, j10, j11             ; nothing arrived
jadd j0, j0, j11
jhalt
