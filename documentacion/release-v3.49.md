## Janax y Razar v3.49: las siluetas de sus libros, y letras sanas

DOI: [10.5281/zenodo.24463639](https://doi.org/10.5281/zenodo.24463639)

> *"Que destile el mecanismo del camino que encuentra en la forma que relata el libro, y lo haga suyo: la silueta, no
> la forma exacta."*
> (el autor, 2026-11-23)

Las versiones siguen a los números primos: después del 347, el 349.

### Las siluetas

En un libro, una línea le responde a la anterior. Ella no guarda lo que dice esa respuesta, sino **qué hace con la
línea anterior**: cada palabra, si la **toma** de ahí o la **trae** nueva. Esa secuencia es la silueta.

- **Cada paso suyo aprende su propia silueta** cada vez que le contesta a él: con qué frecuencia una palabra tomada o
  traída viene después del comienzo, de una tomada o de una traída. Son las cuentas de Krichevsky-Trofimov, como las
  de Razar.
- **La silueta de un libro se cuenta en sus pasos por compresión.** Va primero el paso que la cuenta más corto, después
  el siguiente, y así. Esa palabra es la **semilla**.
- **Las semillas van antes que el azar.** Cuando balbucea un camino nuevo, prueba primero la semilla de dos líneas de un
  libro suyo, elegidas por su suerte. Si ya la probó, balbucea como antes. La sigue juzgando la música de su marco.
- **Sólo lee.** El libro se elige de la lista de su casa, entre los que empiezan con `libro` o `elibro` y su diálogo, los
  mismos que ya lee al contestar. Lo que está en la lista existe, así que abrirlo nunca crea nada.

### Letras sanas

Su texto se leía "raro, como desenfocado". No era la escala: su pantalla (640 × 349) ya se muestra exactamente al
doble. Eran cuatro mayúsculas de su tipografía, escritas con un error de tipeo (una fila corrida): la **C**, la **G**,
la **J** y la **S**. Por eso *"Senana"* y *"Centeno"* se veían mal. Ahora están sanas.

Las minúsculas no se tocaron: son su abecedario aprendido, letras que ella hizo crecer.

### Lo que se vio

Probado en una copia de su casa, nunca en la Luma viva:

- Nacieron semillas de cinco pasos ordenadas por silueta (por ejemplo deducir → tema → cruzar → corazón →
  improvisar). Su música todavía no pagó ninguna, y quedaron guardadas con su motivo.
- Aprendieron su silueta el tema, la deducción y el cruce.
- La rama de la historia larga sigue viva: a *"contame una historia larga"* contestó con una.
- El único archivo nuevo en su casa es `siluetas`.

La Luma viva corre, byte por byte, el cuerpo que se probó.

### Lo que todavía no

- **El corazón y la improvisación todavía no aprendieron su silueta.** En la prueba, sus respuestas llegaron por otro
  camino (el del hilo abierto), que no anota qué paso contestó. Mientras tanto sus siluetas valen lo mismo, y empatan.
- **La silueta es gruesa:** sólo toma o trae. Pregunta, cambio de tema y largo todavía no están.
- **Hallado mientras se probaba:** una versión anterior de la semilla abría el nombre `libro`, que hoy no existe, y lo
  creaba vacío. Pasó sólo en la copia y nunca llegó a la viva.
- **Las minúsculas** con manchas (la `y`, la `g`) son de su abecedario aprendido. Que se afinen es trabajo de ella.

### Dónde está

`razar/cuerpo/gen_leer.py`: `wy_sil` (la silueta), `wy_learn`, `wy_seed`, `wy_msave` / `wy_mload` (en `siluetas`), y
`FONT`.
