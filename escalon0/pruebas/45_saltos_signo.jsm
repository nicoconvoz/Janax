; espera: 000000000000013F
; jjn r jumps when r is negative, jjnn when it is not (zero included): the difference is the answer (Capitan).
; Taken or not, each case adds its bit: -5 jjn +1, 0 not jjn +2, 7 jjnn +4, 0 jjnn +8, -1 not jjnn +16,
; the most negative number jjn +32, and a jump back with jjnn: 4 laps of 64. A wrong jump ends with j0 = -1.
include '../janax.inc'
jldi j0, 0
jldi j9, 1
jldi j1, -5
jjn j1, t1
jjmp bad
t1:
jadd j0, j0, j9
jldi j1, 0
jjn j1, bad
jldi j2, 2
jadd j0, j0, j2
jldi j1, 7
jjnn j1, t3
jjmp bad
t3:
jldi j2, 4
jadd j0, j0, j2
jldi j1, 0
jjnn j1, t4
jjmp bad
t4:
jldi j2, 8
jadd j0, j0, j2
jldi j1, -1
jjnn j1, bad
jldi j2, 16
jadd j0, j0, j2
jldi j1, 1
jldi j3, 63
jshl j1, j1, j3
jjn j1, t6
jjmp bad
t6:
jldi j2, 32
jadd j0, j0, j2
jldi j4, 3
jldi j2, 64
back:
jadd j0, j0, j2
jsub j4, j4, j9
jjnn j4, back
jhalt
bad:
jldi j0, -1
jhalt
