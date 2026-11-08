; The initial data of voluntad_semilla (at the start of its room 0 from its first order): the texts it writes, one
; every 40h bytes and ended by a 0.
db 'semilla en el cubo: nace=', 0
times 40h - $ db 0
db ' n=', 0
times 80h - $ db 0
db ' vueltas=', 0
times 0C0h - $ db 0
db ' quieto', 0
times 100h - $ db 0
db '; practica, ultimo cuarto: ', 0
times 140h - $ db 0
db '%; preguntas sin leer, acierta ', 0
times 180h - $ db 0
db '', 0
times 1C0h - $ db 0
db ' de ', 0
times 200h - $ db 0
db ' (azar ', 0
times 240h - $ db 0
db ' marcos=', 0
times 280h - $ db 0
db ' memoria del kernel', 0
times 2C0h - $ db 0
db ' conserva', 0
times 300h - $ db 0
db ' repeticiones=', 0
times 340h - $ db 0
db ' piezas fuera de su total: ', 0
times 380h - $ db 0
db ' pesos en el techo: ', 0
times 3C0h - $ db 0
