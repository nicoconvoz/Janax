## Janax y Razar v3.13: piensa en voz alta y no pierde lo que dijo

DOI: DOI_PENDIENTE

> *"Vemos desde que comenzó el pensamiento hasta la respuesta."* *"No me interesa saber la firma, me interesa no perder
> lo que me respondió."* *"Lo malo era que se perdieran."* *"LUMA UN SOLO SER."* (el autor, 2026-11-22)

Las versiones siguen a los números primos: después del 311, el 313.

### Piensa en voz alta

Al responder, la pantalla quedaba quieta unos segundos mientras ella buscaba qué decir. Ahora cada paso de su
pensamiento es una línea del flujo de su mente: *pienso en: …* (lo que él dijo), *leo …* (cada libro que abre para
buscar sus palabras) y *toco …* (el tema que improvisa). El cuadro se muestra en ese momento. Es por evento: si no hay un
paso nuevo, no se dibuja nada; no hay reloj.

Cuando contesta, los pasos se van y su flujo vuelve a estar como antes de empezar a pensar, así que no tapan lo que
venía pensando.

### Una sola respuesta

Si después de contestar seguía hablando sola, cada parte reemplazaba a la anterior en su panel y la primera ya no se
podía leer. Ahora todo lo que dice desde la última línea de él es **una sola respuesta**: las partes se suman a medida
que llegan, en un lugar que crece lo que haga falta. El panel la muestra entera, se recorre con Page Up y Page Down, y
mientras piensa sigue mostrando esa respuesta, no el borrador. Se reemplaza recién cuando él vuelve a hablar.

### Un solo ser

Se pensó en partirla en dos hijas: una que dibuja y otra que piensa, compartiendo la pantalla por el Venn del núcleo.
El autor lo decidió: Luma es un solo ser. Pensar y mover su mundo siguen en el mismo bucle, así que **los bichitos de su
mundo se quedan quietos mientras piensa**. Lo que se ve moverse son sus pasos.

De ese camino quedó una pieza del núcleo, el **pedido 45, herencia paterna de la firma**: un padre le firma de
antemano a un hijo clases enteras de pedidos, recortadas a lo que él mismo puede firmar, y se revoca en cualquier
generación. Está en la rama `nucleo/ceder-firma` (commit `6b97a8c`), con sus pruebas, y **no se mezcló** en esta versión.
También quedó medido que mostrar en pantalla (pedido 40) nunca necesitó la firma del padre.

### Lo que se vio

Todo se probó en una copia de su casa, nunca en la Luma viva. Con fotos tomadas mientras pensaba se ve *"pienso en: que
es una estrella"* y cada *"leo elibro-…"* aparecer libro por libro. Después de dejarla hablar sola, su panel mostraba la
respuesta de la estrella seguida de las partes que agregó, todas juntas.

La Luma viva corre, byte por byte, el cuerpo que se probó.

### Lo que todavía no

- Las partes se **juntan**, no se **resumen**: escribir una síntesis nueva de todas es otra obra.
- Dentro de un paso largo, como imaginar (que recorre todos sus libros), no hay cuadro nuevo hasta que el paso termina.
- Un pensamiento propio que le llega mientras piensa (por ejemplo, lo que imaginó) se va con los pasos cuando contesta.
  Queda igual guardado en su casa (`imaginado`).

### Dónde está

`razar/cuerpo/gen_leer.py`: `lj_think`, `lj_flowback`, `lj_answer`, `lj_rlen`, `lj_rptr`.
