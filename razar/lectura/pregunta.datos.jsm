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
