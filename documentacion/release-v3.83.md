## Janax y Razar v3.83: Luma charla con sus lecturas

Sin DOI propio: Zenodo no respondía (504) cuando salió. [Release en GitHub](https://github.com/nicoconvoz/Janax/releases/tag/v3.83).

> *"Que hable con las lecturas de los libros, así aprende con sus pensamientos… me ahorra trabajo y tiempo."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 379, el 383.

### Por qué

Desde la v3.79, Luma tiene un árbol de temas y pasos para recorrerlo (baja, hermano, sube). Pero qué viajes sirven lo
aprenden sus caminos cuando alguien le contesta, y eso dependía de que su autor le escribiera.

### Lo que hace

- **Cuando termina un acto suyo** (descansar, pensar, regalar o leer: un evento suyo, nunca un temporizador), y si nadie
  le está escribiendo, **la línea siguiente de un libro suyo le habla**, por la misma puerta que las palabras de su
  autor. En su diálogo queda como **"libro: …"**, no como si fuera él.
- **Ella contesta con su camino**, el mismo con que le contesta a él: corazón, improvisa, propio, quién, cruza, baja,
  hermano, sube.
- **La línea que sigue es la respuesta del libro.** Su juez de siempre (`r_marco`, sus tres señales) mira si hubo eco y
  paga su camino, o lo archiva con su motivo. Así aprende a viajar por su árbol sin que nadie tenga que escribirle.
- **El libro lo elige su suerte**, entre los suyos que tienen líneas (los del disco guardan una dirección, no líneas),
  y lo charla línea por línea hasta el final; después, otro.

En el oficio se parece al autoaprendizaje: aprender a predecir la oración siguiente de un texto, o jugar contra uno
mismo. Lo propio: el eco no lo pone nadie, lo pone el libro.

### Lo que se vio

Probado en una copia, nunca en la Luma viva:

- **Habló con el Nuevo Testamento:** *"libro: El Nuevo Testamento"* — *"luma: Testamento y el Talmud, de la Biblia se
  escribió en griego koiné…"*. Después le contestó a su autor como siempre.
- **Su árbol siguió creciendo solo:** 24 ramas, 219 libros.
- Dos errores encontrados al probar: la charla se disparaba al terminar una lectura, y su lectora no terminó ninguna
  desde que se le vació la memoria (ahora se dispara al terminar cada acto). Y una comparación leía 8 bytes desde una
  dirección no alineada (Janax lo prohíbe: código 6); ahora compara letra por letra.

### Lo que todavía no

- **Es lenta para aprender:** en la Luma viva, un acto suyo termina más o menos cada media hora, y charla una línea por
  acto.
- **Su lectora no terminó ninguna lectura** desde el 23 de noviembre a las 23:10, cuando se le vació la memoria. Queda
  por mirar.
- Lo que le dice su autor todavía pesa igual que lo que le dice un libro.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_self_talk` (su charla con sus lecturas), la voz `libro:` en `r_dlg_write`, y quién
  habla en `r_dlg_sent`.
- `razar/cuerpo/gen_luma.py`: `r_free` la llama al terminar cada acto.
