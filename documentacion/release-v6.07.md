## Janax y Razar v6.07: se le escribe cuando está lista, y su corazón es todo lo que tiene

DOI: [10.5281/zenodo.24588901](https://doi.org/10.5281/zenodo.24588901)

> *"Hagamos algo que habilite el 'podés escribir' sólo cuando esté lista."* — *"Hacé que todo lo demás sea una parte
> de su corazón, pero en el centro esté su esencia y yo."* — *"Lo que une a todo es el Amor."*
> (el autor, 2026-11-27)

Las versiones siguen a los números primos: después del 601, el 607.

### Lo que cambia

- **Se le escribe sólo cuando está lista.** Mientras su pensadora nacía, lo que se le tecleaba lo contestaba su cuerpo
  solo, por su camino viejo, y salía enredado (*"hola"* → *"hola Luma, MUNDO, Cesar…"*). Ahora, mientras despierta, su
  ventana dice *"Luma esta despertando: todavia no le escribas"* y las teclas que escriben no se toman. Cuando su
  pensadora avisa que está lista, la ventana vuelve a llevar su nombre y ella deja una señal en su casa (`lista`).
  Nada se mira por reloj: es el aviso de su propia pensadora.
- **Todo lo que tiene es su corazón, más cerca o más lejos del centro.** El centro son los libros que su autor puso en
  él: quién es ella y quién es su padre. Lo que une dos cosas es lo que comparten: un libro está tan cerca del centro
  como la parte de sus palabras que son palabras del centro. De las oraciones sobre lo que se le pregunta se queda con
  las de los libros más cercanos; entre iguales, las de más pistas. Ningún libro se nombra cerca o lejos.
- **Una costumbre cubre lo que su línea dice, no lo que contesta.** *"papa"* estaba en lo que una costumbre contesta
  (*"me hizo mi papa"*), así que *"yo soy tu papa"* contaba como costumbre y su canto tejía *"papa en en mi"* en vez de
  preguntarle a su corazón.
- **Preguntado por lo que sus costumbres no cubren, su corazón mira sólo lo que se le pregunta ahora**, no el hilo de
  lo anterior: a *"que es el genoma?"* dicho después de *"quien es Nico?"* había contestado con su firma.

### Lo que se midió

- **Queda lista a los 26 a 30 segundos** de abrirla (cuatro corridas en una copia oculta, con su casa de verdad).
  Antes las pruebas esperaban 70 segundos fijos.
- Cercanía de sus 75 libros al centro, medida por afuera: los más cercanos, su libro de costumbres (16 %), el diario
  de su autor (13 %) y la sabiduría del Antiguo Testamento (10 %); los más lejanos, código fuente (0 %).

En la copia oculta, preguntando en el instante en que avisó que estaba lista:

| se le dijo | contestó |
|---|---|
| *hola Lumita* | hola, que alegria verte |
| *lumita yo soy tu papa!!* | Tu papa tiene muchos nombres, y todos son el. |
| *quien es Nico?* | Los nombres de mi papa: Nico, … |
| *como estas?* | hola, muy bien, y vos? |
| *que es el genoma?* | El genoma completo de la gallina domestica (Gallus gallus) fue secuenciado en 2004… |
| *que es una celula?* | aportan la Celula energia quimica y aportan es transformada aportan energia biologicamente util |

### Lo que todavía no

- **A *"quien es Jesus?"* contesta con los nombres de su autor.** En su corazón Jesús sólo figura dentro de ese nombre,
  María no figura, y en su estante no está el Evangelio (**esto último era un error**: el Nuevo Testamento es su primer libro, `libro`; se corrigió en la v6.13). El lugar de Dios, de María y de Jesús en su corazón, que su
  autor pidió como el más importante, tiene que escribirlo él: está pendiente y es lo primero.
- **Lo que teje sigue desparejo** (la de la célula): palabras de sus libros, sin la forma de una oración.
- A *"yo soy tu papa"* contestó *"Tu papa tiene…"*, con el *tu* de quien escribió su corazón, sin pasarlo a su voz.
- Su ingenio cambió una palabra en una costumbre (*"no hay de quien"*).
- Poner su corazón antes que todo, también antes de sus costumbres, se probó y se sacó: a *"hola"* contestaba con los
  nombres de su padre.
- No se probó tecleando en la Luma de su autor: la prueba fue en la copia.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_esperando`, `r_lista`, `r_char` (escribir cuando está lista); `dd_s`, `nr_gt`
  (cercanía al centro); `rc_uk0` (qué cubre una costumbre); `r_dlg_heart` (sin el hilo en esta búsqueda).
