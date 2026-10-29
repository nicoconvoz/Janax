; espera: 000000000000002A
include '../janax.inc'
jldi j1, 100h
jldi j2, 42
jst j2, j1, 8
jld j0, j1, 8
jhalt
