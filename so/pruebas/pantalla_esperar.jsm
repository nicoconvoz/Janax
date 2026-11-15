; Waiting for an event of Janax's own screen (kind 41) with no window ever opened (the suite runs with
; JANAX_SIN_VENTANA): a wait for ever answers 0 at once, with b back at 0 (what was left of the wait); a record
; outside the cabin answers -1; a wait of 0 ms answers as the first one. j0 = the first answer (0; -1 when denied,
; and then b comes back as it went); if any other is not as expected, j0 = 0BADh.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j9, 0
jldi j3, 100h                   ; the request queue
jldi j4, 1
jldi j10, 41                    ; wait for an event
jldi j11, 200h                  ; the record
jldi j12, -1                    ; for ever
jcall tocar
jadd j0, j13, j9                ; j0 = the answer
jld j5, j3, 24                  ; b, back: 0 (none came), or -1 untouched when denied
jsub j5, j5, j0
jjnz j5, wrong
jldi j8, 1
jldi j11, 0FFF0h                ; a record outside the cabin
jcall tocar
jadd j13, j13, j8
jjnz j13, wrong
jldi j11, 200h                  ; no wait at all
jldi j12, 0
jcall tocar
jsub j13, j13, j0
jjnz j13, wrong
jhalt
wrong:
jldi j0, 0BADh
jhalt
tocar:                          ; one request (j10 type, j11 a, j12 b) -> j13 answer
  jst j4, j3, 0
  jst j10, j3, 8
  jst j11, j3, 16
  jst j12, j3, 24
  jsys j14, j3
  jld j13, j3, 32
  jret
