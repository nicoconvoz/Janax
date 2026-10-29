; Round 1 "write", round 2 "grow": the free screen changes its tuning instead of opening another one.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j1, 200h
jldi j2, 0A79h
jst j2, j1, 0
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jst j4, j3, 8
jst j1, j3, 16
jldi j5, 2
jst j5, j3, 24
jsys j6, j3
jldi j4, 1
jst j4, j3, 0
jldi j4, 2
jst j4, j3, 8
jldi j5, 8
jst j5, j3, 16
jsys j6, j3
jld j0, j3, 32
jhalt
