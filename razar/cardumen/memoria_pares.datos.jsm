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
db 'canta', 0
times 1D0h - $ db 0
db 'canta: ', 0
times 1E0h - $ db 0
db ' -> ', 0
times 200h - $ db 0
db 'canto propio: contexto mas largo que dicen dos pares o mas: ', 0
times 240h - $ db 0
db ' piezas | pares ', 0
times 260h - $ db 0
db ' | palabras cantadas ', 0
times 280h - $ db 0
db ': de los libros ', 0
times 2A0h - $ db 0
db '%, de su respuesta ', 0
times 2C0h - $ db 0
db '% | copia de su respuesta ', 0
times 2E0h - $ db 0
db '%', 10, 0
times 300h - $ db 0
db 'fuera', 0
times 310h - $ db 0
db 'nulo de orden cero (sus palabras por las veces que las dicen los libros, sin contexto): de su respuesta ', 0
times 380h - $ db 0
db '% | de contenido (sin las ', 0
times 3A0h - $ db 0
db ' palabras que hacen la mitad de lo dicho): cantado ', 0
times 3E0h - $ db 0
db '%, nulo ', 0
times 3F0h - $ db 0
db '% | recitado de lo leido ', 0
times 410h - $ db 0
db 'aparte, sin leer: pares ', 0
times 430h - $ db 0
db ' a ', 0
times 440h - $ db 0
db 'inventadas:', 0
times 450h - $ db 0
