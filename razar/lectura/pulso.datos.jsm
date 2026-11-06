; The initial data of pulso (at the start of its room 0 from its first order): the labels of its files and the texts
; it writes, one every 40h bytes and ended by a 0; the names of the four kinds of difference from 180h, in their order.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 40h - $ db 0
db 'pulso: palabras=', 0
times 80h - $ db 0
db ' distintas=', 0
times 0C0h - $ db 0
db ' renglones=', 0
times 100h - $ db 0
db ' prueba=1/', 0
times 140h - $ db 0
db ' pedidos=', 0
times 180h - $ db 0
db 'gemelos (una letra cambia)', 0
times 1C0h - $ db 0
db 'interruptores (una palabra se saca)', 0
times 200h - $ db 0
db 'asociados (otra palabra en el mismo lugar)', 0
times 240h - $ db 0
db 'puertas (el mismo par, otro camino)', 0
times 280h - $ db 0
db ': pulsos=', 0
times 2C0h - $ db 0
db ' diferencias=', 0
times 300h - $ db 0
db ' | en lo no leido: pulsos=', 0
times 340h - $ db 0
db ', explicados=', 0
times 380h - $ db 0
db ' (dado vuelta)', 0
times 3C0h - $ db 0
db 'pulso: no encuentro el libro', 10, 0
times 400h - $ db 0
db 'pulso: sin memoria', 10, 0
times 440h - $ db 0
db ' piezas=', 0
times 480h - $ db 0
db ' | al azar: ', 0
times 4C0h - $ db 0
db ' bits (', 0
times 500h - $ db 0
db ' pares) ', 0
times 540h - $ db 0
db 10, '  cerrados (estructura):', 0
times 580h - $ db 0
db 10, '  abiertos (muebles):', 0
times 5C0h - $ db 0
db ' (la negacion)', 0
times 600h - $ db 0
db 'esqueletos (lo que llena un lugar de una estructura); corte', 0
times 640h - $ db 0
db 0
times 680h - $ db 0
db 'preguntas que se hace (lo irregular):', 10, 0
times 6C0h - $ db 0
db '| dicho asi ', 0
times 700h - $ db 0
db ', con ', 0
times 740h - $ db 0
db ' delante ', 0
times 780h - $ db 0
db ': por que esta vez ', 0
times 7C0h - $ db 0
db 'sin ', 0
times 800h - $ db 0
db '      donde: ', 0
times 840h - $ db 0
db ' bits | ', 0
times 880h - $ db 0
db 'negacion destilada (las cinco de Razar): pasan la 1: ', 0
times 8C0h - $ db 0
db ', la 2: ', 0
times 900h - $ db 0
db ', puerta ancha: ', 0
times 940h - $ db 0
db ', sobre todo la puerta: ', 0
times 980h - $ db 0
db ' | interruptores:', 0
times 9C0h - $ db 0
db '      cerca, y nunca cuando se dijo como siempre: ', 0
times 0A00h - $ db 0
db 'asociaciones que surgieron (de ', 0
times 0A40h - $ db 0
db ' excepciones; en cuantas / en cuantas ciegas):', 0
times 0A80h - $ db 0
db ' pares, ', 0
times 0AC0h - $ db 0
db ' bits por par) ', 0
times 0B00h - $ db 0
db '      responde: ', 0
times 0B40h - $ db 0
db 'por ', 0
times 0B80h - $ db 0
db ' (', 0
times 0BC0h - $ db 0
db ' bits)', 0
times 0C00h - $ db 0
db 'no se: nada de lo que el libro repite la explica', 0
times 0C40h - $ db 0
db '; tambien: ', 0
times 0C80h - $ db 0
db '      (retorica) y por que casi siempre ', 0
times 0CC0h - $ db 0
db 'sin ', 0
times 0D00h - $ db 0
db 'con ', 0
times 0D40h - $ db 0
db '? porque asi se dijo ', 0
times 0D80h - $ db 0
db ' de ', 0
times 0DC0h - $ db 0
db ' veces: lo regular se contesta solo', 0
times 0E00h - $ db 0
db '      lo que trae: ', 0
times 0E40h - $ db 0
db 'cimientos y muebles (lo fijo y lo que cambia); fijo en el libro', 0
times 0E80h - $ db 0
db 10, '  cimientos ', 0
times 0EC0h - $ db 0
db 10, '  muebles ', 0
times 0F00h - $ db 0
db ':', 0
times 0F40h - $ db 0
db ', vueltas hasta que no se mueve: ', 0
times 0F80h - $ db 0
