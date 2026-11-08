; The texts of memoria_pares (the kernel's memory of the books' pairs, heard through Fano's pieces).
db 'libro', 0
times 10h - $ db 0
db 'p', 0
times 20h - $ db 0
db 'memoria: no hay libro', 10, 0
times 40h - $ db 0
db 'memoria: sin memoria', 10, 0
times 80h - $ db 0
db 'pares', 0
times 0C0h - $ db 0
db 'pares pregunta-respuesta de los libros: ', 0
times 100h - $ db 0
db 'piezas que tiemblan (milesimas): ', 0
times 140h - $ db 0
db ' | respuestas bien, por largo: ', 0
times 180h - $ db 0
db '(1-5 palabras, 6-12, 13 o mas)', 0
times 1C0h - $ db 0
