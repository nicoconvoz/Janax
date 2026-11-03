; A child that waits for a box to arrive (request 25 answers -1 until one does), reads what is in it and
; writes 88h next to it.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j1, 0
jwhilez j1                      ; while nothing arrived
  jldi j10, 25
  jcall tocar
  jldi j8, 1
  jadd j1, j13, j8
jwend
jld j0, j13, 0
jldi j8, 88h
jst j8, j13, 8
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
