; The initial data of voluntad_juego (at the start of its room 0 from its first order): the texts it writes, one every
; 40h bytes and ended by a 0.
db 'juego: nace=', 0
times 40h - $ db 0
db ' n=', 0
times 80h - $ db 0
db ' vueltas=', 0
times 0C0h - $ db 0
db ' ejemplos=', 0
times 100h - $ db 0
db ' quieto', 0
times 140h - $ db 0
db ' mezcla', 0
times 180h - $ db 0
db '; practica, ultimo cuarto: ', 0
times 1C0h - $ db 0
db '%; practicadas: ', 0
times 200h - $ db 0
db ' de ', 0
times 240h - $ db 0
db '; nunca vistas: ', 0
times 280h - $ db 0
db ' (azar 1 de 6)', 10, 0
