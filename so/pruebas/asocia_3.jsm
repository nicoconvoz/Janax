; Association (Capitan): the mother holds X (77h) and Y (11h); her partner "socio" holds X (linked) and Z
; (55h). Both name each other, and her child "hijo" is born with the part she chose (request 27, b):
; the Venn word (Capitan's Venn: the regions, the order of the look, a criterion, how many). Here regions 1 the
; ones both hold, 2 hers only, 4 its only, 7 all. j0 = the association's answer (0).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j10, 2                     ; X
jldi j11, 32
jcall tocar
jadd j6, j13, j9
jldi j8, 77h
jst j8, j6, 0
jldi j10, 2                     ; Y
jcall tocar
jadd j7, j13, j9
jldi j8, 11h
jst j8, j7, 0
jldi j1, 200h                   ; "socio" = 73 6F 63 69 6F
jldi j2, 6Fh
jshi j2, 6963h
jshi j2, 6F73h
jst j2, j1, 0
jldi j12, 5
jcall lanzar
jadd j2, j13, j9                ; the partner's number
jldi j10, 3                     ; X linked to it, to read and write
jshl j10, j10, j5
jldi j8, 24
jor j10, j10, j8
jadd j11, j6, j9
jadd j12, j2, j9
jcall tocar
jldi j1, 0
jwhilez j1                      ; until it is ready (signing what it asks)
  jcall firmar
  jld j1, j6, 8
jwend
jldi j10, 27                    ; the association
jadd j11, j2, j9
jldi j12, 7
jcall tocar
jadd j0, j13, j9
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j12, 4
jcall lanzar
jadd j2, j13, j9
jldi j1, 0
jwhilez j1                      ; while the child runs (signing what it asks)
  jcall firmar
  jldi j10, 19
  jadd j11, j2, j9
  jcall tocar
  jldi j8, 1
  jadd j1, j13, j8
jwend
jldi j8, 1                      ; the partner can go
jst j8, j6, 16
jhalt
firmar:                         ; the first request waiting for my signature, if any, signed
jldi j10, 18
jldi j11, 800h
jldi j12, 100h
jcall tocar
jjz j13, nada
jldi j10, 17
jld j11, j11, 0
jldi j12, 1
jcall tocar
nada:
jret
lanzar:                         ; the program labeled at 200h (j12 bytes), with every right
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jldi j11, 200h
jcall tocar
jret
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
