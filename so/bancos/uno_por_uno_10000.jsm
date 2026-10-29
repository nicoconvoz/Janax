; The same 10,000 lines, one touch of the window per line (how a classic system call works).
include '../../escalon0/janax.inc'
jldi j6, 80h
jldi j2, 0A78h
jst j2, j6, 0
jldi j3, 100h
jldi j5, 10000
jldi j1, 1
jldi j4, 2
jwhile j5
  jst j1, j3, 0                   ; count 1
  jst j1, j3, 8                   ; kind 1: write
  jst j6, j3, 16
  jst j4, j3, 24
  jsys j0, j3
  jsub j5, j5, j1
jwend
jhalt
