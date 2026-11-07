; Los textos de la prueba del texto largo.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 20h - $ db 0
db 'prueba: no hay libro', 10, 0
times 40h - $ db 0
db 'prueba: sin memoria', 10, 0
times 80h - $ db 0
db 'MAL: putch cambio un registro', 0
times 0C0h - $ db 0
