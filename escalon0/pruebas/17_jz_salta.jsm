; espera: 0000000000000007
include '../janax.inc'
jldi j1, 0
jldi j0, 7
jjz j1, fin
jldi j0, 9
fin:
jhalt
