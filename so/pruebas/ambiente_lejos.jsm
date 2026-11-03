; Far past a room's end is outside too: room 1 of 16 bytes, a load 1 MiB past its start ends the process
; with code 5, whatever lives there in memory. j0 = 77h.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 16
pedido 2, j8, j10               ; room 1
jldi j9, 77h
jst j9, j10, 8
jld j0, j10, 8
jldi j8, 10h
jldi j9, 16
jshl j8, j8, j9                 ; 1 MiB
jadd j8, j8, j10
jld j1, j8, 0                   ; outside
jhalt
