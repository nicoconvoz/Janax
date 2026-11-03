; The greeting (Capitan: "with a single bit the mother or the child send a greeting"): the mother launches
; "hijo" twice and waits for greetings (request 29), which answers who greeted; a greeting stays until it is
; taken, so it is never lost even if it came first. When nobody is left who could greet, the wait answers -1.
; j0 = first greeter * 16 + second greeter + the third wait (-1).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j5, 32
jldi j1, 200h                   ; "hijo" = 68 69 6A 6F
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, 0
jcall lanzar
jcall lanzar
jldi j10, 29                    ; who greeted first
jcall tocar
jldi j8, 4
jshl j0, j13, j8
jldi j10, 29                    ; and second
jcall tocar
jadd j0, j0, j13
jldi j10, 29                    ; nobody left to greet
jcall tocar
jadd j0, j0, j13
jhalt
lanzar:                         ; "hijo", with every right
jldi j10, 15
jshl j10, j10, j5
jldi j8, 16
jor j10, j10, j8
jldi j11, 200h
jldi j12, 4
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
