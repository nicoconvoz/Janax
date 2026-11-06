; The initial data of pregunta (at the start of its room 0 from its first order): the labels of its files and the
; texts it writes, one every 40h bytes and ended by a 0.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 18h - $ db 0
db 'q', 0
times 40h - $ db 0
db 'pregunta: ', 0
times 80h - $ db 0
db '  -> ', 0
times 0C0h - $ db 0
db '   (dicho asi en el libro)', 0
times 100h - $ db 0
db '   (inferido: el libro no lo dice asi)', 0
times 140h - $ db 0
db '  no lo sabe: ningun camino de lo dicho llega', 10, 0
times 180h - $ db 0
db '  no conoce una de sus palabras', 10, 0
times 1C0h - $ db 0
db 'pregunta: no encuentro el libro', 10, 0
times 200h - $ db 0
db 'pregunta: sin memoria', 10, 0
times 240h - $ db 0
db 'pregunta: hechos=', 0
times 280h - $ db 0
db ' | con ', 0
times 2C0h - $ db 0
db ' (se saca)', 0
times 300h - $ db 0
db ' (dado vuelta)', 0
times 340h - $ db 0
db ' (en su lugar)', 0
times 380h - $ db 0
db ' piezas que pagan: interruptores=', 0
times 3C0h - $ db 0
db ' puertas=', 0
times 400h - $ db 0
db ' (lo que sigue, igual: ', 0
times 440h - $ db 0
db ' de ', 0
times 480h - $ db 0
db ' DA VUELTA', 0
times 4C0h - $ db 0
db ' (dan vuelta y no se sacan: ', 0
times 500h - $ db 0
