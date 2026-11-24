; A child that first sleeps until its parent greets it (29), then prints hola (write, kind 1: important) and ends.
; j0 = bytes written. It lets the parent change the child's inherited signatures (45) before the child writes.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jldi j10, 29                    ; asleep until a greeting
jst j10, j3, 8
jsys j6, j3
jldi j1, 200h
jldi j2, 0Ah
jshi j2, 616Ch
jshi j2, 6F68h
jst j2, j1, 0
jst j4, j3, 0
jst j4, j3, 8
jst j1, j3, 16
jldi j5, 5
jst j5, j3, 24
jsys j6, j3
jld j0, j3, 32
jhalt
