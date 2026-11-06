; The initial data of voluntad_acertijos (at the start of its room 0 from its first order): the texts it writes and
; its words, one every 40h bytes and ended by a 0, and the Morse of every letter at 800h.
db 'acertijos: nace=', 0
times 40h - $ db 0
db ' desliz=', 0
times 80h - $ db 0
db '% tipo=', 0
times 0C0h - $ db 0
db 'suma', 0
times 100h - $ db 0
db 'resta', 0
times 140h - $ db 0
db 'mezcla', 0
times 180h - $ db 0
db ' ejemplos=', 0
times 1C0h - $ db 0
db ' revuelto', 0
times 200h - $ db 0
db ' quieto', 0
times 240h - $ db 0
db '; cubo ', 0
times 280h - $ db 0
db '^3 (probo ', 0
times 2C0h - $ db 0
db ', llego al tope', 0
times 300h - $ db 0
db ')', 10, 0
times 340h - $ db 0
db 'oido: ', 0
times 380h - $ db 0
db ' palabras confundidas al final; contar: ', 0
times 3C0h - $ db 0
db ' de 5; acertijos nunca vistos: ', 0
times 400h - $ db 0
db ' de ', 0
times 440h - $ db 0
db ' bien (', 0
times 480h - $ db 0
db ' sin respuesta)', 10, 0
times 4C0h - $ db 0
db ':', 0
times 500h - $ db 0
db 'uno', 0
times 540h - $ db 0
db 'dos', 0
times 580h - $ db 0
db 'tres', 0
times 5C0h - $ db 0
db 'cuatro', 0
times 600h - $ db 0
db 'cinco', 0
times 640h - $ db 0
db 'seis', 0
times 680h - $ db 0
db 'mas', 0
times 6C0h - $ db 0
db 'menos', 0
times 700h - $ db 0
db 'es', 0
times 740h - $ db 0
db ' melodia', 0
times 780h - $ db 0
db 'linea base, la respuesta mas comun de los ejemplos: ', 0
times 7C0h - $ db 0
db '; contesto el primer numero del acertijo: ', 0
times 800h - $ db 0
; The Morse of a..z: its marks, 2 bits each from bit 0 (0 dot, 1 dash), then 2 (the end of the letter), then 3.
dq 228, 3585, 3601, 897, 56, 3600, 901, 3584, 224, 3668, 913, 3588, 229
dq 225, 917, 3604, 3653, 900, 896, 57, 912, 3648, 916, 3649, 3665, 3589
