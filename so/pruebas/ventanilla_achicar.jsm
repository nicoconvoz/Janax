; "shrink" by 1 MiB: the cabin can never get smaller than the end of its own queue (100h + 8 + 32 = 128h).
include '../../escalon0/janax.inc'
jldi j3, 100h
jldi j4, 1
jst j4, j3, 0
jldi j4, 3
jst j4, j3, 8
jldi j5, 10h
jshi j5, 0
jst j5, j3, 16
jsys j6, j3
jld j0, j3, 32
jhalt
