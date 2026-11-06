; The parent launches "hijo", which never ends on its own, and ends it (request 33): its answer is the code the
; child ended with. Asked again, the same code; then the child's state (19) says it too, and a number that is not
; a child of its own is refused (-2). j0 = the code of the end, the second answer, the state and the refusal, one
; byte each.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jldi j10, 15                    ; launch: type = 16 | rights << 32
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jadd j11, j1, j9
jldi j12, 4
jcall tocar
jadd j6, j13, j9                ; the child's number
jldi j10, 33                    ; end it
jadd j11, j6, j9
jcall tocar
jadd j0, j13, j9
jldi j8, 8
jldi j10, 33                    ; again: it ended already
jadd j11, j6, j9
jcall tocar
jshl j0, j0, j8
jldi j7, 255
jand j13, j13, j7
jor j0, j0, j13
jldi j10, 19                    ; its state
jadd j11, j6, j9
jcall tocar
jshl j0, j0, j8
jand j13, j13, j7
jor j0, j0, j13
jldi j10, 33                    ; not a child of its own: itself
jldi j11, 0
jcall tocar
jshl j0, j0, j8
jand j13, j13, j7
jor j0, j0, j13
jhalt
tocar:
jst j4, j3, 0
jst j10, j3, 8
jst j11, j3, 16
jst j12, j3, 24
jsys j14, j3
jld j13, j3, 32
jret
