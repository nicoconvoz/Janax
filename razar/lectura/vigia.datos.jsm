; The initial data of vigia (at the start of its room 0 from its first order): the labels of its files and the texts
; it writes, ended by a 0.
db 'come', 0
times 8h - $ db 0
db 'comer', 0
times 10h - $ db 0
db 'vigia: el nucleo no vigila nada (falta JANAX_VIGIA)', 10, 0
times 50h - $ db 0
db 'vigia: ', 0
times 60h - $ db 0
db ' (no es texto)', 10, 0
times 80h - $ db 0
db 'vigia: sin memoria', 10, 0
times 0A0h - $ db 0
db ' -> a comer', 10, 0
times 0C0h - $ db 0
db 'vigia: no pude lanzar a comer', 10, 0
times 100h - $ db 0
db 'sentido', 0
times 108h - $ db 0
