; The window to the host from a Janax OS process: its catalog is empty (a process talks to the system
; through the ventanilla). j0 = how many requests are offered << 32 | the answer to request 1 (-1, low half).
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j1, 100h
jldi j2, 200h
jldi j3, 100h
jst j0, j1, 0                   ; the catalog
jst j2, j1, 8
jst j3, j1, 16
jhost j4, j1
jldi j5, 1                      ; request 1
jst j5, j1, 0
jhost j6, j1
jldi j7, 32
jshl j4, j4, j7
jshl j6, j6, j7
jshr j6, j6, j7
jor j0, j4, j6
jhalt
