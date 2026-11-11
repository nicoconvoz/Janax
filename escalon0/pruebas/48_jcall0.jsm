; espera: 000000000000005B
; jcall0 r, target: a jcall that leaves r at zero when the routine comes back (the zero is born with the return,
; Capitan). The routine writes 9 in j1, and j1 comes back as 0; j3 = 11 comes back as it is. Nested: a plain jcall
; inside a jcall0 does not clear anything (j5 is still 3 inside), and the jcall0 clears j5 when it returns.
; j0 = 11 + 5 * 16 + (j1 + j5) * 256.
include '../janax.inc'
jldi j1, 7
jcall0 j1, first
jldi j5, 1
jcall0 j5, outer
jldi j9, 4
jshl j8, j8, j9
jadd j0, j3, j8
jadd j1, j1, j5
jldi j9, 8
jshl j1, j1, j9
jadd j0, j0, j1
jhalt
first:
jldi j1, 9
jldi j3, 11
jret
outer:
jldi j5, 3
jcall inner
jadd j8, j5, j7
jret
inner:
jldi j7, 2
jret
