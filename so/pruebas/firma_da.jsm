; A child of the kernel signs everything: 45 asking for all (-1) answers every kind there is. Then the next child
; is born with "write" (bit 1) and "inherit signatures" (bit 45) only, and the parent waits (19 in a while) until
; it ends: the child asks for all and gets just that (firma_medio). j0 = what the first 45 answered.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j10, 45
jldi j11, 0
jldi j12, -1
jcall tocar
jadd j0, j13, j9
jldi j12, 1                     ; 2 | 1 << 45
jldi j8, 45
jshl j12, j12, j8
jldi j8, 2
jor j12, j12, j8
jcall tocar
jldi j5, 32
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 4
jcall tocar
jadd j6, j13, j9
jldi j7, 0
jwhilez j7
  jldi j10, 19                    ; child's state: -1 while it runs
  jadd j11, j6, j9
  jcall tocar
  jldi j8, 1
  jadd j7, j13, j8
jwend
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
