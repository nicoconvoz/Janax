; Janax's own screen (kind 40, show): a cloud of 3x2 cells (.nube version 3, no bones, one level) with the
; cells 0, 2 and 4 set, red, green and blue. j0 = the particles drawn (3). Then three that must answer -1:
; a wrong version, a length that cuts the colours, and an address outside the cabin; if any does not, j0 = 0BADh.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j9, 0
jldi j3, 100h                   ; the request queue
jldi j4, 1
jldi j14, 400h                  ; the cloud, byte by byte
jldi j2, 04Eh
jcall emit
jldi j2, 055h
jcall emit
jldi j2, 042h
jcall emit
jldi j2, 045h
jcall emit
jldi j2, 03h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 080h
jcall emit
jldi j2, 03Fh
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 01h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 080h
jcall emit
jldi j2, 03Fh
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 03h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 02h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 015h
jcall emit
jldi j2, 0FFh
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 0FFh
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 00h
jcall emit
jldi j2, 0FFh
jcall emit
jldi j10, 40                    ; show
jldi j11, 400h
jldi j12, 38
jcall tocar
jadd j0, j13, j9                ; j0 = the particles
jldi j8, 1
jldi j2, 2                      ; version 2: malformed
jstb j2, j11, 4
jcall tocar
jadd j13, j13, j8
jjnz j13, wrong
jldi j2, 3                      ; version 3 again, but one byte short of the colours
jstb j2, j11, 4
jldi j12, 37
jcall tocar
jadd j13, j13, j8
jjnz j13, wrong
jldi j11, 0FFF0h                ; outside the cabin
jldi j12, 38
jcall tocar
jadd j13, j13, j8
jjnz j13, wrong
jhalt
wrong:
jldi j0, 0BADh
jhalt
emit:                           ; one byte (j2) at j14, and j14 moves on
  jstb j2, j14, 0
  jldi j13, 1
  jadd j14, j14, j13
  jret
tocar:                          ; one request (j10 type, j11 a, j12 b) -> j13 answer
  jst j4, j3, 0
  jst j10, j3, 8
  jst j11, j3, 16
  jst j12, j3, 24
  jsys j14, j3
  jld j13, j3, 32
  jret
