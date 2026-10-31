; Destroying the room in the middle joins the ends: B and C move back over A and keep their data and their
; addresses; the next room is a new number (4: A's is never given again while B and C stand) and starts in
; zeros. j0 = 11h + 22h + 0 + 33h + (4 << 32).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j8, 1000h
pedido 2, j8, j10       ; A
pedido 2, j8, j11       ; B
jldi j8, 10h
pedido 2, j8, j12       ; C
jldi j9, 11h
jst j9, j11, 0FF8h      ; the last qword of B
jldi j9, 22h
jst j9, j12, 8          ; the last qword of C
pedido 3, j10, j7       ; destroy A
jldi j8, 8
pedido 2, j8, j13       ; D: number 4
jld j0, j13, 0          ; a new room is in zeros
jldi j9, 33h
jst j9, j13, 0
jld j1, j11, 0FF8h
jadd j0, j0, j1
jld j1, j12, 8
jadd j0, j0, j1
jld j1, j13, 0
jadd j0, j0, j1
jadd j0, j0, j13
jhalt
