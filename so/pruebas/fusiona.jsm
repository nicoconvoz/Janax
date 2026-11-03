; Two boxes become one (Capitan): rooms 1 (8 bytes) and 2 (16 bytes) fuse into a new room 3, with what was
; in 1 and then what was in 2. Their addresses die: reading room 1 ends the process with code 5, and a
; fusion with itself is refused (-1). j0 = 11h + 22h + 33h + room 3's address - 1.
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 8
pedido 2, j8, j10               ; room 1
jldi j8, 16
pedido 2, j8, j11               ; room 2
jldi j9, 11h
jst j9, j10, 0
jldi j9, 22h
jst j9, j11, 0
jldi j9, 33h
jst j9, j11, 8
jst j10, j3, 24                 ; with itself: no
pedido 26, j10, j0
jst j11, j3, 24                 ; 1 and 2
pedido 26, j10, j12
jld j1, j12, 0
jadd j0, j0, j1
jld j1, j12, 8
jadd j0, j0, j1
jld j1, j12, 16
jadd j0, j0, j1
jadd j0, j0, j12
jld j1, j10, 0                  ; room 1 is gone
jhalt
