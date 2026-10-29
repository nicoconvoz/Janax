; espera: 00000000000000FF
include '../janax.inc'
jldi j1, 100h
jldi j2, -1
jstb j2, j1, 5
jldb j0, j1, 5
jhalt
