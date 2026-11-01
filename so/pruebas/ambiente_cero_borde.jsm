; The byte right after room 0 is outside it, exactly: room 0 of 1000h bytes, its last qword and its last byte
; are inside, and the next byte ends the process with code 5. j0 = 55h.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 of 1000h bytes
jldi j2, 0FF8h
jldi j9, 55h
jst j9, j2, 0                   ; its last qword
jld j0, j2, 0
jldb j1, j2, 7                  ; its last byte
jadd j0, j0, j1
jldb j1, j2, 8                  ; the byte after it: outside
jhalt
