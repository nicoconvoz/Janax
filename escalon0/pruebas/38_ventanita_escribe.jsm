; espera: 0000000000000005
; salida: hola
; If the host offers "escribir", the program writes with it: j0 = bytes written. If not, it writes nothing
; and j0 = 0 (it makes the best of what it has).
include '../janax.inc'
jldi j1, 100h
jldi j2, 200h
jldi j3, 100h
jst j0, j1, 0
jst j2, j1, 8
jst j3, j1, 16
jhost j4, j1
jldi j5, 7269h                  ; "escribir"
jshi j5, 6269h
jshi j5, 7263h
jshi j5, 7365h
jldi j6, 1
jldi j10, 0                     ; its number, 0 = not offered
jadd j7, j4, j0
jwhile j7
  jld j8, j2, 0
  jsub j8, j8, j5
  jjnz j8, otra
  jld j10, j2, 8
otra:
  jldi j9, 16
  jadd j2, j2, j9
  jsub j7, j7, j6
jwend
jjz j10, fin
jldi j11, 300h                  ; "hola" and a line end
jldi j12, 0Ah
jshi j12, 616Ch
jshi j12, 6F68h
jst j12, j11, 0
jst j10, j1, 0                  ; request "escribir": a = where, b = how many
jst j11, j1, 8
jldi j12, 5
jst j12, j1, 16
jhost j0, j1
fin:
jhalt
