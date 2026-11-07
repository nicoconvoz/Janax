; The initial data of comer (at the start of its room 0 from its first order): the labels of its files and the texts
; it writes, ended by a 0.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 18h - $ db 0
db 'come', 0
times 40h - $ db 0
db 'comer: no encuentro el libro', 10, 0
times 80h - $ db 0
db 'comer: sin memoria', 10, 0
times 0C0h - $ db 0
db 'comido: ', 0
times 100h - $ db 0
db ' renglones=', 0
times 140h - $ db 0
db ' sujetos=', 0
times 180h - $ db 0
db ' pistas=', 0
times 1C0h - $ db 0
db ' bytes=', 0
times 200h - $ db 0
db 'comer: no se que comer (falta la direccion en "come")', 10, 0
times 240h - $ db 0
db ' de ', 0
times 280h - $ db 0
db ' (dado vuelta)', 0
times 2C0h - $ db 0
db ' (la negacion)', 0
times 300h - $ db 0
