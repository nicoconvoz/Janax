; Lists the folder into 800h. j0 = how many labels this process is allowed to see.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jldi j2, 14
jst j2, j3, 8
jldi j2, 800h
jst j2, j3, 16
jldi j2, 100h
jst j2, j3, 24
jsys j14, j3
jld j0, j3, 32
jhalt
