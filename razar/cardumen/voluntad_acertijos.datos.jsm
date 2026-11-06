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
times 900h - $ db 0
db ' estructura: ensena en orden ', 0
times 940h - $ db 0
db ', pregunta en orden ', 0
times 980h - $ db 0
db ' gemelos: repeticiones ', 0
times 9C0h - $ db 0
db 'memoria: ', 0
times 0A00h - $ db 0
db ' bien; pares gemelos: ', 0
times 0A40h - $ db 0
db '; propiedades adoptadas: ', 0
times 0A80h - $ db 0
db 'logica', 0
times 0B00h - $ db 0
db 'ana', 0
times 0B40h - $ db 0
db 'beto', 0
times 0B80h - $ db 0
db 'ceci', 0
times 0BC0h - $ db 0
db 'dani', 0
times 0C00h - $ db 0
db 'eli', 0
times 0C40h - $ db 0
db 'fede', 0
times 0C80h - $ db 0
db 'mayor', 0
times 0CC0h - $ db 0
db 'menor', 0
times 0D00h - $ db 0
db 'es', 0
times 0D40h - $ db 0
db ' puerta: repeticiones ', 0
times 0D80h - $ db 0
db ' bien; interruptor: ', 0
times 0DC0h - $ db 0
db 'si', 0
times 0E00h - $ db 0
db 'no', 0
times 0E40h - $ db 0
db ' (da vuelta ', 0
times 0E80h - $ db 0
db '); puertas adoptadas: ', 0
times 0EC0h - $ db 0
db ' eleccion: ', 0
times 0EE0h - $ db 0
db 'gemelos', 0
times 0F00h - $ db 0
db 'puerta', 0
times 0F20h - $ db 0
db 'eco', 0
times 0F40h - $ db 0
db ' (armonia: gemelos +', 0
times 0F60h - $ db 0
db ' -', 0
times 0F80h - $ db 0
db ', puerta +', 0
times 0FA0h - $ db 0
db ')', 0
times 0FC0h - $ db 0
db ' en ', 0
times 0FE0h - $ db 0
db ' piezas', 0
