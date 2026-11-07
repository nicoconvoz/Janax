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
db ' | memoria de las siluetas (bytes)=', 0
times 540h - $ db 0
db 'limites (signos que cierran un edificio, segun el libro):', 0
times 580h - $ db 0
db '  queda esperando: ', 0
times 5C0h - $ db 0
db '  descartada: ', 0
times 600h - $ db 0
db '   (hasta saber si ', 0
times 640h - $ db 0
db '   (', 0
times 680h - $ db 0
db ' va con ', 0
times 6C0h - $ db 0
db ' va con el otro genero de ', 0
times 700h - $ db 0
db 'pregunta: ', 0
times 740h - $ db 0
db '  ', 0
times 780h - $ db 0
db '   (el libro dice: ', 0
times 7C0h - $ db 0
db ' (lo deduje)', 0
times 800h - $ db 0
db '  ninguna relacion de lo que leyo encaja con la pregunta', 10, 0
times 840h - $ db 0
db 'flechas (palabras que viven en un limite que la mayoria no cierra):', 0
times 8C0h - $ db 0
db 'siluetas', 0
times 8D0h - $ db 0
db 'pegamentos: ', 0
times 8E0h - $ db 0
db ', probados/construcciones: ', 0
times 900h - $ db 0
db 'siluetas de la biblioteca: ', 0
times 940h - $ db 0
db ' palabras (flechas: ', 0
times 980h - $ db 0
db 'come', 0
times 990h - $ db 0
db 'tablero/preguntas-', 0
times 9C0h - $ db 0
db 'tablero/esqueletos', 0
times 0A00h - $ db 0
db 'sentido: vueltas de esqueletos guardadas: ', 0
times 0A40h - $ db 0
db ', pares probados en la biblioteca: ', 0
times 0A80h - $ db 0
db 'preguntas del libro: ', 0
times 0AC0h - $ db 0
db ', con nucleo al lado: ', 0
times 0AE0h - $ db 0
db 'ensenaron: ', 0
times 0B00h - $ db 0
