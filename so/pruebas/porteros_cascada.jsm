; Porters: S = my screen porter; A = child of S; B = child of A. Revoking A takes B with it, so using B
; is refused. Then the process drops its own privileges (C = child of S with no rights) and its write is
; refused. j0 = answer of "use B" + answer of the write = -1 + -1 = -2.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j10, 11                    ; consult: my porter for door 1 (screen)
jldi j11, 1
jcall tocar
jadd j5, j13, j9                ; S
jldi j10, 8                     ; cede A from S, with the screen right
jadd j11, j5, j9
jldi j12, 1
jcall tocar
jadd j6, j13, j9                ; A
jldi j10, 8                     ; cede B from A
jadd j11, j6, j9
jldi j12, 1
jcall tocar
jadd j7, j13, j9                ; B
jldi j10, 10                    ; revoke A
jadd j11, j6, j9
jcall tocar
jldi j10, 9                     ; use B: its branch is revoked
jadd j11, j7, j9
jcall tocar
jadd j8, j13, j9
jldi j10, 8                     ; cede C from S, with no rights
jadd j11, j5, j9
jldi j12, 0
jcall tocar
jadd j1, j13, j9                ; C
jldi j10, 9                     ; use C: the process gives up its screen right
jadd j11, j1, j9
jcall tocar
jldi j1, 200h                   ; write "hola": must be refused now
jldi j2, 0Ah
jshi j2, 616Ch
jshi j2, 6F68h
jst j2, j1, 0
jldi j10, 1
jadd j11, j1, j9
jldi j12, 5
jcall tocar
jadd j0, j13, j8
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
