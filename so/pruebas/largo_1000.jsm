; Long process: j0 = 1 + ... + 1000 = 500500 (3004 instructions).
include '../../escalon0/janax.inc'
jldi j0, 0
jldi j1, 1000
jldi j2, 1
vuelta:
jadd j0, j0, j1
jsub j1, j1, j2
jjnz j1, vuelta
jhalt
