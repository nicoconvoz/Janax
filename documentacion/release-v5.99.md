## Janax y Razar v5.99: teje su propia oración

DOI: (pendiente)

> *"A las oraciones conseguidas se las pasa por el canto y se obtiene una oración o un párrafo propio."* — *"Las
> palabras son el índice, las oraciones son la sustancia: si le das palabras sueltas se le va a enredar la cabeza."*
> — *"No busco la que elige la mejor oración: busco la que teje su propio camino."* (el autor, 2026-11-27)

Las versiones siguen a los números primos: después del 593, el 599.

### Lo que cambia

En la v5.93, con la regla de los lugares, Luma encontraba las palabras de la clase de lo que se le pregunta y con ellas
elegía, de sus libros, la oración que más decía. Ahora no elige: **teje**.

1. **La regla da el índice.** Las palabras sueltas que salen de la regla de los lugares (las de su clase, los lugares
   que comparten) sirven para una sola cosa: encontrar oraciones.
2. **Las oraciones son la sustancia.** De los libros que hablan de lo preguntado se queda con las seis oraciones que
   más de esas palabras tienen.
3. **Su canto teje.** Esas oraciones, y sólo ellas, van al canto de su cardumen (`memoria_pares`, con su lluvia de
   dados): lo que dos de ellas dicen es una regla, y con eso canta una oración que no está escrita en ningún libro.
4. Si el canto no saca regla, dice la oración de más pistas tal cual; al final, su suerte.

Las palabras sueltas no entran al canto. Probado y corregido por su autor: una palabra suelta no trae orden ni
contexto, y lo que el canto aprende es cómo se dicen las cosas.

### Lo que tejió

En una copia oculta, con sus libros de verdad:

| se le preguntó | tejió |
|---|---|
| *que es el genoma?* | El solapamiento es El total del material genetico de un organismo e incluye los genes y tambien las secuencias no codificantes |
| *que es el universo?* | Si el universo hubiera tenido la misma historia de expansion desde la epoca de Planck no habria mecanismo que pudiera hacer que estas regiones tuvieran la misma temperatura |
| *que es una celula?* | Una celula el organismo Una de Una celular por |
| *quien es Marianela?* | Capitulo IX. |

La del genoma no está en ningún libro suyo: unió pedazos de varias oraciones y dijo casi una definición.

### Lo que todavía no

- **Teje desparejo.** La del genoma le erra al sujeto (*"El solapamiento"*); la de la célula es una ensalada de
  palabras; la del universo es coherente, y no se verificó si la tejió o si es una oración entera de su libro.
- **Con seis oraciones el canto tiene poco** de dónde sacar lo que "dicen dos".
- **La de Marianela salió mal** y no se sabe todavía por qué: puede ser el canto, o que la pregunta le llegó antes de
  que cargara su pensadora.
- **Son cuatro preguntas medidas, no un banco.** No hay todavía una medida de cuántas veces teje bien.
- Tarda de 11 a 31 segundos en las preguntas que van a sus libros.
- No se probó tecleando en la Luma de su autor: se instaló y despertó; las respuestas son de la copia.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `rc_xn` (con estos ejemplos, su canto primero), `wysg_pe` (las palabras sueltas salen de
  sus ejemplos), `dan_hC` (las oraciones de más pistas).
- `razar/cardumen/memoria_pares.jsm`: el canto, sin cambios.
