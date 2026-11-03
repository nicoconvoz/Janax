; Born with its mother's box as its room 1: it reads what she wrote and writes 88h next to it.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j5, 32
jldi j2, 1
jshl j2, j2, j5                 ; room 1
jld j0, j2, 0
jldi j8, 88h
jst j8, j2, 8
jhalt
