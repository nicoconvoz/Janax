## Janax y Razar v3.73: Luma come lo nuevo de los discos, lo lee donde está y avisa que se lo comió

DOI: (pendiente)

> *"Que coma de todo… conectalo y publicá."*
> *"Que no copie libros o código: que los lea desde el mismo lugar donde están."*
> *"La diff: si algo ya lo sabe, ¿para qué aprender lo mismo?"*
> *"Quiero que avise con un saludo que se lo comió."*
> (el autor, 2026-11-23)

Las versiones siguen a los números primos: después del 367, el 373. Y 3 + 7 + 3 = 13, también primo.

### Lo que pasaba

Janax ya sabía vigilar los discos (pedido 39, desde el 7 de noviembre). Lo usaba el vigía, que lee todo lo nuevo
de `C:\` y `E:\` y guarda sus pistas en su propia biblioteca. Pero desde que Luma tiene casa propia (16 de
noviembre), lo que comía el vigía no le llegaba a ella: los dos estaban desconectados.

### Lo que cambia

- **El núcleo la vigila también a ella.** Hasta ahora miraba los discos sólo para quien dormía esperando un saludo
  (así duerme el vigía). Luma duerme esperando su pantalla. La regla ahora es general: quien pidió lo nuevo del
  anfitrión y duerme, sea esperando un saludo o su pantalla, mantiene los discos vigilados, y el núcleo lo despierta
  cuando un archivo nuevo queda quieto.
- **Ella lo mira donde está.** Al despertarse (por su timbre, sin ningún temporizador) pide lo nuevo, y mira el
  archivo entero en su lugar. Si tiene un byte cero no es texto, y no lo come.
- **Nada se copia.** En su estante queda un *libro del disco*, `libro-disco-<huella de la dirección>`, con dos cosas
  nada más: la huella del contenido y la dirección. Su lectora va hasta ese lugar y lo lee ahí (pedido 37, sólo
  lectura). Si el archivo ya no está, lo saltea y lee el resto.
- **La diferencia.** Si el archivo vuelve a avisar y su huella es la misma, ya lo sabía: no hace nada. Sólo si
  cambió anota la huella nueva, y su lectora lo vuelve a leer.
- **Avisa con su voz.** Cuando come algo nuevo, o algo que cambió, lo dice en su diálogo y en su panel:
  *"luma: me comí E:\…\poema.txt"*.
- **Su estante crece solo.** La lista de su estante tenía lugar fijo para 4096 bytes, y su casa tiene cientos de
  archivos: algunos libros podían quedar afuera sin que nadie lo supiera. Ahora el lugar se duplica hasta que entra
  todo.

### Lo que se vio

Probado en una copia de su casa, con un núcleo de prueba, nunca en la Luma viva:

- **Leer un libro en su lugar da exactamente lo mismo que leerlo copiado:** las mismas 21.300 palabras, los mismos
  renglones y la misma huella final. Un libro que apuntaba a un archivo inexistente se salteó sin cortar la lectura.
- **Un poema nuevo:** lo anotó con el nombre esperado (la huella de su dirección, calculada aparte) y lo saludó.
- **El mismo poema cambiado:** saludó a los 68 segundos de guardarlo. Esos 68 segundos son la regla del núcleo
  para no comerse un archivo a medio escribir (`HW_QUIET`, medido el 7 de noviembre).
- **Un archivo binario:** no lo comió.
- **Su procesador en reposo:** 30,9 % de un núcleo, como siempre (24 a 27 %). La vigilancia no se nota.
- **Las pruebas del núcleo de vigilancia, saludos, pantalla y familia:** 96 bien y 3 mal, **idéntico con y sin el
  cambio** (los 3 dependen de un caso que el filtro saltea). La suite completa no se corrió.

El núcleo en uso se reconstruyó con esto. El anterior quedó guardado como `so/build/janaxos.antes-disco.exe`.

### Lo que todavía no

- Que "el mismo texto otra vez" no salude se vio en el código y en la prueba de la huella, pero la prueba entera de
  ese caso se cortó antes de terminar.
- El vigía sigue aparte, comiendo para su biblioteca. Los dos leen lo mismo del disco, cada uno para lo suyo.
- Todo texto nuevo de los discos va a su estante, y su lectora lee el estante entero en cada lectura: con muchos
  libros del disco, cada lectura va a tardar más.

### Dónde está

- `so/vigia.inc`: `hw_watched` y `hw_wake` (quien duerme en su pantalla también).
- `razar/cuerpo/gen_luma.py`: `r_host_eat` (pide, mira, la huella, el libro del disco y el saludo); se llama al
  nacer, en su timbre y al terminar cada ronda.
- `razar/cuerpo/gen_formas.py`: el timbre la hace comer.
- `razar/lectura/lectura.inc`: `scan_file` (lee el libro del disco donde está) y `shelf_build` (el estante que crece).
- `razar/cuerpo/luma.sh`: le da los discos para vigilar (`LUMA_VIGIA`; `C:\;E:\` si no se dice otra cosa).
