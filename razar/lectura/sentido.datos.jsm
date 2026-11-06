; The initial data of sentido (at the start of its room 0 from its first order): the labels of its files and the
; texts it writes, one every 40h bytes and ended by a 0 (all before 1000h, where the variables start).
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 18h - $ db 0
db 'q', 0
times 40h - $ db 0
db 'sentido: esqueletos=', 0
times 80h - $ db 0
db ' pares=', 0
times 0C0h - $ db 0
db ' negados=', 0
times 100h - $ db 0
db ' pares', 0
times 140h - $ db 0
db ' | se encadena (', 0
times 180h - $ db 0
db ' | simetrica (', 0
times 1C0h - $ db 0
db ' | se niega (', 0
times 200h - $ db 0
db ' | dado vuelta es: ', 0
times 240h - $ db 0
db ' | es lo mismo que: ', 0
times 280h - $ db 0
db ' | dicho y negado a la vez (', 0
times 2C0h - $ db 0
db 'el significado de: ', 0
times 300h - $ db 0
db '  deduce: ', 0
times 340h - $ db 0
db '   (porque ', 0
times 380h - $ db 0
db ' dado vuelta es ', 0
times 3C0h - $ db 0
db ' se encadena)', 0
times 400h - $ db 0
db 'sentido: no encuentro el libro', 10, 0
times 440h - $ db 0
db 'sentido: sin memoria', 10, 0
times 480h - $ db 0
db 'esqueletos (lo que significa cada estructura, probado):', 10, 0
times 4C0h - $ db 0
db ' la negacion', 0
times 500h - $ db 0
db ' | ATENCION: una tabla se lleno, lo que no entro no se cuenta', 0
times 540h - $ db 0
db 'limites (signos que cierran un edificio, segun el libro):', 0
times 580h - $ db 0
