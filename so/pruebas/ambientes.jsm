; Rooms (Capitan): growing builds a room in the same cabin and answers its address (room number in the high
; 32 bits); destroying one moves the rooms after it back over its place, and their addresses do not change.
; j0 = 77h (still in room B, which moved) + A (1 << 32) + B (2 << 32) + 0 (A destroyed) - 1 (not the start
; of a room) - 1 (the room with the queue).
include '../../escalon0/janax.inc'
include 'ambientes.inc'
jldi j3, 100h
jldi j8, 2000h
pedido 2, j8, j10       ; room A: 1 << 32
jldi j8, 1000h
pedido 2, j8, j11       ; room B: 2 << 32
jldi j9, 77h
jst j9, j11, 0
jst j9, j10, 1FF8h
pedido 3, j10, j12      ; destroy A: 0
jldi j8, 8
jadd j8, j11, j8
pedido 3, j8, j13       ; not the start of a room: -1
jldi j8, 0
pedido 3, j8, j14       ; the room with the queue: -1
jld j0, j11, 0
jadd j0, j0, j10
jadd j0, j0, j11
jadd j0, j0, j12
jadd j0, j0, j13
jadd j0, j0, j14
jhalt
