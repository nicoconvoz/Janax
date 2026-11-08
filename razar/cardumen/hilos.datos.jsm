; The texts of hilos (relations found in raw text, and how they relate), one every 20h or 40h bytes, ended by a 0.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 20h - $ db 0
db 'hilos: no hay libro', 10, 0
times 40h - $ db 0
db 'hilos: sin memoria', 10, 0
times 80h - $ db 0
db 'pares', 0
times 0C0h - $ db 0
db 'palabras: ', 0
times 0E0h - $ db 0
db ' | la mitad: dichas ', 0
times 100h - $ db 0
db ' veces o mas | formas dichas por dos: ', 0
times 140h - $ db 0
db ' de ', 0
times 160h - $ db 0
db 'relacion: ', 0
times 180h - $ db 0
db ' ~ ', 0
times 1A0h - $ db 0
db ' | misma', 0
times 1C0h - $ db 0
db ' | al reves', 0
times 1E0h - $ db 0
db ' | lo dicen ', 0
times 200h - $ db 0
db ' | nulo ', 0
times 220h - $ db 0
db '.5', 0
times 240h - $ db 0
db ' | relaciones que comparten dos pares y mas que su nulo: ', 0
