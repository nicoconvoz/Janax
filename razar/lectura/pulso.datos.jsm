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
db ' (lo que sigue, igual: ', 0
times 580h - $ db 0
db ' de ', 0
times 5C0h - $ db 0
db ' DA VUELTA', 0
times 600h - $ db 0
db 'propiedad 2: dicho de nuevo, lo que sigue queda igual ', 0
times 640h - $ db 0
db ' | dan vuelta:', 0
times 680h - $ db 0
