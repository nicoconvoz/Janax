## Janax y Razar v5.47: los dos lectores que faltaban

DOI: (pendiente)

Las versiones siguen a los números primos: después del 541, el 547.

### Lo que cambia

- **A *"¿quién es Isaac Newton?"* contestó la dirección de un archivo de Windows**, con los bytes que la preceden. Es
  el mismo mal de la v5.09: un libro del disco guarda en su casa una dirección, no renglones, y un lector lo abría
  como texto. En la v5.09 se curaron tres lectores y **quedaron dos sin ver**: el que elige un libro por su suerte
  (cuando habla ella primero, y en lo que sigue) y el que elige el libro de su tema para improvisar.
- **Los cinco usan ahora la misma regla** (`r_isdisk`). Se buscaron todos los lugares de su cuerpo donde se elige un
  libro para leerlo como renglones: son esos cinco.

### Lo que se vio

En una copia oculta, con sus caminos de verdad y 220 libros del disco en su casa, seis frases, dos de ellas repetidas
para que fuera a sus libros: ningún byte que no sea texto y ninguna ruta en sus respuestas; todas sus partes con
código 0. Su memoria quedó estable en esos cuatro minutos (de 864 a 870 MB).

### Lo que todavía no

- **Lo que contesta desde sus libros sigue sin tener que ver con la pregunta.** A *"¿cuál es la raíz cuadrada de
  dos?"* contestó con un párrafo sobre la Biblia hebrea. Sus pasos de libros buscan renglones que comparten palabras,
  no respuestas.
- **Cuando no sabe, devuelve la pregunta, y parece que sigue pensando.** No se entiende como *"no sé, explicame"*.
- Las dos primeras frases de la prueba tardaron 90 y 50 segundos; las otras cuatro, de 0 a 16.
- La Luma de su autor llegó a usar 2,5 GB a los seis minutos de nacer; en la copia de prueba no se reprodujo.
- Los nombres de otra charla (*"Muy bien, Basilio."*) y Tab siguen pendientes.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_isdisk`, y sus cinco llamadas (`dps_f`, `dq_o`, `thk_b`, `wysd_b`, `tmp_f`).
