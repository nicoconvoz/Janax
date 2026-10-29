; espera: 0000000100000001
; The window to the host: the catalog says how many requests the host offers and the number of "escribir".
; j0 = how many << 32 | the number of "escribir" (0 if it is not offered).
include '../janax.inc'
jldi j1, 100h                   ; the block
jldi j2, 200h                   ; where the catalog goes
jldi j3, 100h                   ; its room: 16 entries
jst j0, j1, 0                   ; request 0: the catalog
jst j2, j1, 8
jst j3, j1, 16
jhost j4, j1                    ; j4 = how many
jldi j5, 7269h                  ; "escribir"
jshi j5, 6269h
jshi j5, 7263h
jshi j5, 7365h
jldi j6, 1
jadd j7, j4, j0                 ; entries left
jwhile j7
  jld j8, j2, 0
  jsub j8, j8, j5
  jjnz j8, otra
  jld j0, j2, 8                 ; its number
otra:
  jldi j9, 16
  jadd j2, j2, j9
  jsub j7, j7, j6
jwend
jldi j9, 32
jshl j4, j4, j9
jor j0, j0, j4
jhalt
