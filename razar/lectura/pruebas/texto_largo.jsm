; Prueba: lo que se escribe no tiene techo. Escribe 10000 letras (a..z una y otra vez) y un fin de linea, sin vaciar
; a mano: el texto tiene que salir entero, y los registros que putch no usa tienen que quedar como estaban.
S_LIBRO = 0                     ; (los textos que lectura.inc pide, aunque esta prueba no lee libro)
S_P     = 10h
S_NOBOOK = 20h
S_NOMEM = 40h
S_MAL   = 80h

include '../../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j9, 10000
jldi j10, 0                     ; (la letra: 0..25)
jldi j12, 777                   ; (un registro que putch no toca)
tl_lap:
  jjz j9, tl_done
  jldi j2, 97
  jadd j2, j2, j10
  jcall putch
  jldi j2, 1
  jadd j10, j10, j2
  jldi j2, 26
  jsub j2, j10, j2
  jjnz j2, tl_keep
  jldi j10, 0
tl_keep:
  jldi j2, 1
  jsub j9, j9, j2
  jjmp tl_lap
tl_done:
jldi j2, 777
jsub j2, j12, j2
jjz j2, tl_ok
jldi j1, S_MAL
jcall puts
tl_ok:
jldi j2, 10
jcall putch
jjmp finish

include '../lectura.inc'
