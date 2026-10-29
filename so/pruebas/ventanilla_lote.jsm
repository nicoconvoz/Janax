; Three "write" requests in one touch of the window: one screen, one call to the host.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j1, 200h
jldi j2, 0A61h
jst j2, j1, 0
jldi j2, 0A62h
jst j2, j1, 8
jldi j2, 0A63h
jst j2, j1, 16
jldi j3, 100h
jldi j4, 3
jst j4, j3, 0
jldi j4, 1
jldi j5, 2
jst j4, j3, 8
jst j1, j3, 16
jst j5, j3, 24
jst j4, j3, 40
jldi j6, 208h
jst j6, j3, 48
jst j5, j3, 56
jst j4, j3, 72
jldi j6, 210h
jst j6, j3, 80
jst j5, j3, 88
jsys j0, j3
jhalt
