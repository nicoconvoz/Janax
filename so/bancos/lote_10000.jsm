; 10,000 lines "x" written with ONE touch of the window: 10,000 requests in the queue.
include '../../escalon0/janax.inc'
jfirst j1, 50000h               ; first order: room 0 (10,000 requests of 32 bytes from 100h)
jldi j6, 80h                    ; "x\n" at 80h
jldi j2, 0A78h
jst j2, j6, 0
jldi j3, 100h                   ; the queue
jldi j5, 10000
jst j5, j3, 0
jldi j1, 1
jldi j4, 2
jldi j8, 32
jadd j7, j3, j9
jldi j10, 8
jadd j7, j7, j10                ; first entry
jwhile j5
  jst j1, j7, 0                   ; kind 1: write
  jst j6, j7, 8
  jst j4, j7, 16
  jadd j7, j7, j8
  jsub j5, j5, j1
jwend
jsys j0, j3
jhalt
