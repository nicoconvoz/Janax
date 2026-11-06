; The parent launches "hijo", which never ends on its own, gives it a budget (request 34: 10000 instructions more)
; and sleeps on its doorbell (29): the child ends when it spends it, nobody is left who could greet the parent, and
; it wakes with -1. The child's state (19) is then 10 (it spent its budget), and a number that is not a child of its
; own is refused (-2). j0 = the greeting, the state and the refusal, one byte each.
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
jldi j10, 34                    ; its budget
jadd j11, j6, j9
jldi j12, 10000
jcall tocar
jldi j7, 255
jldi j8, 8
jldi j10, 29                    ; asleep on its doorbell
jcall tocar
jand j0, j13, j7
jldi j10, 19                    ; its state
jadd j11, j6, j9
jcall tocar
jshl j0, j0, j8
jand j13, j13, j7
jor j0, j0, j13
jldi j10, 34                    ; not a child of its own: itself
jldi j11, 0
jldi j12, 10000
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
