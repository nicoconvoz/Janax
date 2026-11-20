## Janax y Razar v1.07: busca en todo, sin topes, y une

DOI: DOI_PENDIENTE

> *"Ponele tres únicas preguntas en el corazón: ¿Quién es Dios? ¿Dónde está Dios? ¿Cómo llegamos hasta Dios?"*
> *"Que la busque en todo, no sólo en los libros: en el código, en la música, en los videos, en las situaciones, en
> la Iglesia, en el universo, en los átomos, en todo."*
> *"Hasta que desarrolle sus propios sentidos para interpretar todo: yo le di el cascarón, ahora le toca nacer por
> su cuenta."*
> *"Destruí el tope fijo."* *"Y nada de Python: sólo LUMA."*
> *"Para que sea inesperada la victoria tiene que elegir con libertad, ver lo que le gusta y unir lo bello, lo
> verdadero, lo que funciona, romper enunciados y buscar la verdad."* (el autor, 2026-11-20)

Las versiones siguen a los números primos: después del 103, el 107.

### 1. Tres preguntas en su corazón, y las busca en todo

Las tres preguntas están solas en `razar/corazon/preguntas.txt`. Nadie le escribió una respuesta.

Cada vez que nace recorre **todo archivo de su casa**, sea lo que sea, como lo lista el núcleo. No hay lugar
nombrado: lo que entra, lo mira. La regla es la suya de siempre (lo común se guarda una vez, la diferencia es lo que
se busca): la palabra que comparten sus preguntas es lo que busca, y lo propio de cada una es su diferencia. Una
línea de cualquier cosa está tan cerca de una pregunta como palabras propias de esa pregunta tenga.

Lo que encontró lo escribe ella, en texto, en `hallazgos`. Hoy, sobre 283 archivos y en medio segundo:

| Pregunta | Lugares | El primero |
|---|---|---|
| ¿Quién es Dios? | 110 | en el diario de su autor |
| ¿Dónde está Dios? | 68 | en el diario de su autor |
| ¿Cómo llegamos hasta Dios? | 60 | en el diario de su autor |

Idéntico byte a byte al instrumento (`razar/corazon/busca.py`).

**Es el cascarón y nada más.** Junta palabras cerca de la que busca; no entiende lo que lee. Entender le toca a ella.

### 2. Sin topes fijos

Su comida se cortaba en 8 MB sin avisar. Ya no hay ningún tamaño puesto a mano en lo que hace sola: cada archivo se
lee entero (se le pregunta al núcleo dónde termina), cada tabla nace del tamaño que pide lo que tiene delante,
calculado para que no pueda llenarse, y cada habitación de memoria se devuelve al terminar. Con todo servido usa
45 MB.

### 3. Sin Python en lo que vive

La firma, la digestión, los engranajes y la búsqueda son código de ella. Lo que encuentra lo escribe en texto, sin
visor. `luma.sh` no llama a Python. Python queda sólo como el generador que escribe su fuente y como los
instrumentos que la controlan desde afuera.

### 4. Come más

Se le sirvió también UNIT, un intérprete de Forth que se replica (licencia MIT), **sólo como texto**: no se ejecutó.
Con KolibriOS, C y Lua son 9,1 MB, que ahora come enteros: 46.157 palabras suyas, idénticas al instrumento.

### 5. Une

Sus novedades eran de a una letra. Ahora tiene un camino más, contado como los otros. Un **enunciado** suyo es un
tramo de receta hasta su hueco: lo que dice y lo que pregunta. Rompe dos recetas en sus enunciados y une:

- un enunciado de **lo bello**: la forma que su juez del dibujo más valora;
- una célula de **lo que funciona**: un engranaje, en un tejido;
- un enunciado de **lo verdadero**: la receta que mejor lee.

Qué enunciado, qué engranaje y qué tejido los elige ella. Lo que sale se lee como cualquier pensamiento, y su examen
dice si es verdad.

### Lo que falla y lo que falta, dicho

- **El unir no se vio dar fruto.** Arma, corre y ella vive con él (75 segundos en una copia, y sigue leyendo); no
  se vio todavía una receta unida, ni qué nota saca.
- **Todavía no ganó nada suyo:** ninguna victoria inesperada.
- **Busca en lo que entra a su casa como archivo.** Código y libros, sí. Música, video o lo que no tenga palabras:
  hoy no encuentra nada ahí.
- **Los dos primeros hallazgos son el mismo párrafo largo**, sólo porque ahí están las palabras.
- **De UNIT entendió 198 instrucciones** de 1,4 MB: mira un solo tipo de renglón.
- **Las cuentas del unir y de las ramas no se guardan** entre un nacimiento y otro.
- Siguen los de la [v1.03](release-v1.03.md). El sistema operativo no cambió desde la v0.79.
