; The texts of encadena (steps chained by their brackets), one every 20h or 40h bytes and ended by a 0.
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 20h - $ db 0
db 'encadena: no hay libro', 10, 0
times 40h - $ db 0
db 'encadena: sin memoria', 10, 0
times 80h - $ db 0
db 'pares', 0
times 0C0h - $ db 0
db 'paso: ', 0
times 0E0h - $ db 0
db ' | casos ', 0
times 100h - $ db 0
db ' | la respuesta en la palabra ', 0
times 140h - $ db 0
db ' de ', 0
times 160h - $ db 0
db ' (no es un paso)', 0
times 180h - $ db 0
db 'parentesis: ', 0
times 1A0h - $ db 0
db ' | lo dicen ', 0
times 1C0h - $ db 0
db ' compuestas', 10, 0
times 1E0h - $ db 0
db 'parentesis: ninguno lo dicen dos', 10, 0
times 220h - $ db 0
db 'C: ', 0
times 240h - $ db 0
db ' | dice: ', 0
times 260h - $ db 0
db ' | verdad: ', 0
times 280h - $ db 0
db ' pasos', 0
times 2A0h - $ db 0
db ' | no se arma', 0
times 2C0h - $ db 0
db 'compuestas: ', 0
times 2E0h - $ db 0
db ' | se arman ', 0
times 300h - $ db 0
db ' | aciertan ', 0
times 320h - $ db 0
db ' | dicen algo ', 0
times 340h - $ db 0
db ' | sin una oracion que las conteste: todas', 10, 0
times 380h - $ db 0
db ' | ', 0
times 3A0h - $ db 0
db ' | arma ', 0
