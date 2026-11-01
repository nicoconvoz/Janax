; The byte right after a room is outside it, exactly: room 1 of 10 bytes (rounded to 16), its last qword and
; its last byte are inside, and the next byte ends the process with code 5. j0 = 77h + 0 (the last byte).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 10
pedido 2, j8, j10               ; room 1: 16 bytes
jldi j9, 77h
jst j9, j10, 8                  ; its last qword
jld j0, j10, 8
jldb j1, j10, 15                ; its last byte
jadd j0, j0, j1
jldb j1, j10, 16                ; the byte after it: outside
jhalt
