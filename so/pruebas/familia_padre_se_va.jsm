; Launches "hijo" with every permission and ends at once, leaving its child behind. j0 = 3.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jst j4, j3, 0
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jst j10, j3, 8
jst j1, j3, 16
jldi j12, 4
jst j12, j3, 24
jsys j14, j3
jldi j0, 3
jhalt
