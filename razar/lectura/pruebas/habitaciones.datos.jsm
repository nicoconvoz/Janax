; Los textos de la prueba de la lista de habitaciones.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 20h - $ db 0
db 'prueba: no hay libro', 10, 0
times 40h - $ db 0
db 'prueba: sin memoria', 10, 0
times 80h - $ db 0
db 'MAL: la lista de habitaciones', 10, 0
times 0C0h - $ db 0
db 'bien: 300 habitaciones anotadas, lista de 512', 10, 0
times 100h - $ db 0
