; The partner: it receives the box its mother links to it, builds a box of its own (55h in it), names its
; mother (P0) in an association (request 27), says it is ready in the shared box, and waits there until
; she lets it go.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j3, 100h
jldi j4, 1
jldi j1, 0
jwhilez j1                      ; while nothing arrived
  jldi j10, 25
  jcall tocar
  jldi j8, 1
  jadd j1, j13, j8
jwend
jadd j6, j13, j9                ; the shared box
jldi j10, 2                     ; a box of its own
jldi j11, 16
jcall tocar
jadd j7, j13, j9
jldi j8, 55h
jst j8, j7, 0
jldi j10, 27                    ; it names its mother
jldi j11, 0
jldi j12, 0
jcall tocar
jldi j8, 1                      ; ready
jst j8, j6, 8
jldi j1, 0
jwhilez j1                      ; until she lets it go
  jld j1, j6, 16
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
