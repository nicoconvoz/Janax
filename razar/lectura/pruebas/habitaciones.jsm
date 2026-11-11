; Prueba: la lista de habitaciones no tiene techo. Con la lista de 64 (como pulso), pide 300 habitaciones: las 300
; tienen que quedar anotadas, cada una la que se dio, y la lista tiene que haber crecido a 512.
S_LIBRO = 0
S_P     = 10h
S_NOBOOK = 20h
S_NOMEM = 40h
S_MAL   = 80h
S_BIEN  = 0C0h
HT1   = 1200h                   ; las habitaciones dadas, en orden; cuantas faltan
HT2   = 1208h

include '../../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j11, 520
jcall room
jldi j1, 0
jldi j2, 64
jst j2, j13, 0
jst j13, j1, RLIST
jldi j11, 2400                  ; (300 direcciones, para comparar: no se anota, la lista todavia esta vacia)
jcall room
jldi j1, 0
jst j13, j1, HT1
jst j1, j1, RLN
jldi j2, 300
jst j2, j1, HT2
jldi j9, 0
jwhile j2
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, HT2
  jldi j11, 16
  jcall room
  jldi j1, 0
  jld j2, j1, HT1
  jadd j2, j2, j9
  jst j13, j2, 0
  jldi j2, 8
  jadd j9, j9, j2
jwcheck
  jldi j1, 0
  jld j2, j1, HT2
jwend
hb_check:
jld j2, j1, RLN                 ; 300 anotadas
jldi j3, 300
jsub j2, j2, j3
jjnz j2, hb_bad
jld j10, j1, RLIST              ; con lugar para 512
jld j2, j10, 0
jldi j3, 512
jsub j2, j2, j3
jjnz j2, hb_bad
jld j11, j1, HT1                ; cada una la que se dio
jldi j12, 300
jwhile j12
  jldi j2, 8
  jadd j10, j10, j2
  jld j2, j10, 0
  jld j3, j11, 0
  jsub j2, j2, j3
  jjnz j2, hb_bad
  jldi j2, 8
  jadd j11, j11, j2
  jldi j2, 1
  jsub j12, j12, j2
jwend
hb_good:
jldi j1, S_BIEN
jcall puts
jjmp finish
hb_bad:
jldi j1, S_MAL
jcall puts
jjmp finish

include '../lectura.inc'
