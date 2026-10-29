; espera: 000000000000003D
; The only loop of Janax is the while (Capitan). Nested: sum of i*j for i = 1..3, j = 1..4 = 6 * 10 = 60;
; a jwhile and a jwhilez that run zero laps; a jwhilez that runs one lap (+1). j0 = 61.
include '../janax.inc'
jldi j0, 0
jldi j9, 1
jldi j1, 3
jwhile j1
  jldi j2, 4
  jwhile j2
    jmul j3, j1, j2
    jadd j0, j0, j3
    jsub j2, j2, j9
  jwend
  jsub j1, j1, j9
jwend
jldi j4, 0
jwhile j4
  jldi j0, 0
jwend
jldi j7, 1
jwhilez j7
  jldi j0, 0
jwend
jldi j8, 0
jwhilez j8
  jadd j0, j0, j9
  jldi j8, 1
jwend
jhalt
