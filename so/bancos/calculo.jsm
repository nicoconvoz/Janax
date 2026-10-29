; Pure computation: 67,108,864 rounds of 10 instructions (jcall, memory, add, shift, xor, jret, loop),
; about 671 M instructions with no touch of the window. Compares engines: JANAX_MOTOR=interprete or not.
include '../../escalon0/janax.inc'
jldi j1, 400h
jshi j1, 0                      ; j1 = 4000000h rounds
jldi j2, 1
jldi j3, 3
jldi j4, 0                      ; address 0 of the cabin
jwhile j1
  jcall paso
  jsub j1, j1, j2
jwend
jhalt
paso:
jld j5, j4, 0
jadd j5, j5, j1
jshl j6, j5, j3
jxor j5, j5, j6
jst j5, j4, 0
jadd j0, j0, j5
jret
