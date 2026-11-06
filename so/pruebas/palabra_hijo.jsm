; A child says two words to its mother (P0, request 30): "hola", then "sol", and ends. j0 = the two answers (0 + 0).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j0, 0
jldi j12, 616Ch                 ; "hola" = 68 6F 6C 61
jshi j12, 6F68h
jcall decir
jldi j12, 6Ch                   ; "sol" = 73 6F 6C
jshi j12, 6F73h
jcall decir
jhalt
decir:                          ; the word j12 to the mother
jst j4, j3, 0
jldi j10, 30
jst j10, j3, 8
jldi j11, 0
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jadd j0, j0, j13
jret
