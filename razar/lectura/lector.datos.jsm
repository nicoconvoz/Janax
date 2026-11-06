; The initial data of lector (at the start of its room 0 from its first order): the labels of its files and the texts
; it writes, one every 40h bytes and ended by a 0.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 40h - $ db 0
db 'lector: palabras=', 0
times 80h - $ db 0
db ' distintas=', 0
times 0C0h - $ db 0
db ' renglones=', 0
times 100h - $ db 0
db ' prueba=1/', 0
times 140h - $ db 0
db 'tapadas=', 0
times 180h - $ db 0
db ' nunca vistas=', 0
times 1C0h - $ db 0
db 'eco ', 0
times 200h - $ db 0
db ' | izquierda ', 0
times 240h - $ db 0
db ' | dos lados ', 0
times 280h - $ db 0
db ' calla ', 0
times 2C0h - $ db 0
db 'lector: no encuentro el libro', 10, 0
times 300h - $ db 0
db 'lector: sin memoria', 10, 0
times 340h - $ db 0
db 'bits por palabra tapada: sin modelo ', 0
times 380h - $ db 0
db ' | contestando siempre ', 0
times 3C0h - $ db 0
db ' | callando cuando no sabe ', 0
times 400h - $ db 0
