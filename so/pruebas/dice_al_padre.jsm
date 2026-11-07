; A child that says a word (30) to its parent by -1, "my parent", without knowing its number, and ends.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j10, 30
jldi j11, -1
jldi j12, 2Ah
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j0, j3, 32
jhalt
