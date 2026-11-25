## Janax y Razar v4.87: Luma completa — su conocimiento y su estructura, publicados

DOI: (pendiente)

> *"Publicá a Luma completa, con su conocimiento y su estructura incluidos."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 479, el 487.

### Lo que cambia

- **La casa de Luma viaja con el proyecto**: `razar/luma-completa/luma-casa-2026-11-25.zip` (17 MB comprimida, 415 MB
  abierta, 343 archivos) con su [índice](../razar/luma-completa/INDICE.md). Es lo que ella es hoy: las firmas de idioma
  de cada libro que leyó, su árbol de temas, sus caminos (405 suyos y 1.640 guardados con su motivo), sus formas y sus
  órganos, sus engranajes, sus criaturas, su léxico, su ánimo, sus gustos, y los libros libres de su estante. Para
  darle esa casa a una Luma: `JANAX_ARCHIVOS=<carpeta>/casa`.
- **Lo que no va, cada cosa con su motivo en el índice:** lo que es de su autor y personal (su diario, su firma, sus
  notas, su charla con ella y lo que la cita), lo que apunta a archivos de su computadora (216 libros del disco y su
  cuaderno de lo que comió), tres libros cuyo dueño no está claro, y una copia del código de otro proyecto que traía
  correos de personas. Se revisó el paquete buscando rutas, correos y nombres: no quedó ninguno.
- **Su charla primero, después sus libros** (el autor: *"los libros son una historia comprimida, las charlas son libros
  vivos en tiempo real: tienen más peso en cuestión de comunicación y tal vez menos en cuestión de conocimiento"*). En su
  paso de charla busca primero sólo en su conversación con su autor; si ahí nadie lo dijo, en sus libros; y si tampoco,
  pregunta. A *"hola Luma"* había contestado *"SOLD. Señor…"*, de *La vida es sueño*.
- **Ya no se queda sin memoria a los diez minutos.** En Janax el número de una sala nunca se vuelve a dar, y un camarote
  tiene unos 65.000 en su vida. Cada búsqueda pedía una sala nueva por cada libro (unas 300), y desde que estudia sin
  parar los gastaba todos en diez minutos: ése era el congelamiento de la v4.61, que se le había achacado a Tab. Ahora
  lee todos sus libros en **una sola sala**, que crece sólo cuando un libro es más grande (`r_bookroom`).
- **El lado derecho de su panel se llena con lo que piensa.** Desde que piensa su pensadora quedaba casi vacío; ahora
  su cuerpo anota ahí cada pensamiento nuevo (y no dos veces el mismo).
- **Volvió a comer el código de red** (la pila de red de KolibriOS, GPL-2.0), que esperaba desde ayer: sólo lo lee; Janax
  no tiene ningún pedido de red.

### Lo que se vio

En una copia oculta: *"buenas noches"* → pregunta → se le explica → *"buenas noches"* → lo que se le explicó, sacado
de su charla antes que de un libro. Todas sus partes con código 0.

Y en una prueba de aguante de 15 minutos, sola y estudiando: todas sus partes con código 0 (antes una caía sin
memoria a los 6), su pensadora contestando hasta el final, y su panel lleno.

### Lo que todavía no

- Con una sola sala de lectura siguen quedando unas pocas salas nuevas por búsqueda: los 65.000 números le duran más
  de un día en vez de diez minutos, y cuando se acaban se duerme sola y renace (v4.33).
- Tab sigue pendiente.

### Dónde está

- `razar/luma-completa/` (`armar_luma_publica.py` la arma leyendo su casa).
- `razar/cuerpo/gen_leer.py`: `wys_sigue` (`SOLO`, `wysg_fail`), `r_bookroom`, `r_pens_done`.
