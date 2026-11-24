## Janax y Razar v4.43: su pensadora rema aparte — dibuja y piensa al mismo tiempo

DOI: [10.5281/zenodo.24515576](https://doi.org/10.5281/zenodo.24515576)

> *"Que use más remeros, uno para cada cosa: lo que más prioridad tenga, dale más. Usá todos los recursos,
> autoajustable, sin abusar."* — *"Estaban desde siempre: no inventes nada, que tenemos todo."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 439, el 443.

### Lo que pasaba

Mientras pensaba una respuesta, Luma no dibujaba ni escuchaba: su cuerpo y su pensamiento eran un solo camarote, y un
camarote lo rema un solo remero por vez.

### Lo que cambia

- **Su pensadora.** Es ella misma en una hija, como su lectora: nace una vez con ella y duerme en su buzón (no gasta).
  Ahí viven sus preguntas, su charla con los libros, cuando habla primero y su mente. Rema en su propio remero, y su
  cuerpo sigue dibujando y escuchando mientras ella piensa.
- **Autoajustable:** las preguntas de su autor se piensan al momento; su estudio con los libros, en los huecos del
  procesador (sólo con lo que nadie usa).
- **La firma heredada (pedido 45, de la rama `nucleo/ceder-firma`).** Cada archivo que abre una hija es un pedido
  importante y esperaba la firma de su madre: sola nacía en 23 s, al lado de ella tardaba minutos. Ahora su cuerpo le
  da su firma a su próxima hija antes de lanzarla: lista en **31 s**. Hasta que dice "lista", su cuerpo piensa como
  siempre: nunca deja de contestar.
- **Su Enter nunca se pierde:** si está pensando, lo que se dijo espera en fila y sale cuando termina.
- **El click izquierdo vuelve a agarrar cualquier figura.** Desde que su pantalla se muestra a resolución completa (23
  de noviembre), el puntero se leía el doble de lejos y sólo se podía agarrar la figura de la esquina.
- **Copiar y pegar en su consola:** Ctrl+V entrega lo que tiene el portapapeles como letras tecleadas (sin tope: en
  su propia sala, del tamaño del texto) y sale antes que un Enter tecleado después; Ctrl+C copia lo que muestra su
  panel (pedido 47 del núcleo).
- **Su puente busca en su rama**, no en todas.

### Lo que se vio

En una copia: se pegó una pregunta, su pensadora la contestó en su remero y Ctrl+C dejó su respuesta en el
portapapeles; todas sus partes terminaron con código 0. Su autor probó en otra copia el click y el Enter. Batería del
núcleo: 428 casos bien; los 4 que fallaron (la prueba de la firma esperaba 45 pedidos y hoy son 47, y la forma de los
bucles nuevos) quedaron arreglados y verificados aparte.

### Lo que todavía no

- El nacimiento de su pensadora sigue cargando su casa entera (31 s): podría cargar sólo lo que necesita para pensar.
- Su lectora no lanza lecturas desde el 22 de noviembre.

### Dónde está

- `so/janaxos.asm`: pedido 45 (`family_inherit`), 47 (`serve_copy`). `so/pantalla.inc`: pegar y copiar, evento 8.
- `razar/cuerpo/gen_leer.py`: `r_pens_launch`, `r_pens_ask`, `r_pens_done`, `pz_go` (su pensadora).
- `razar/cuerpo/gen_luma.py`: `ve_fine` (el puntero en las celdas de su pantalla).
