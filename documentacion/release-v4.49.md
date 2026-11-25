## Janax y Razar v4.49: lo que el procesador deja libre es suyo

DOI: (pendiente)

> *"Si está libre el procesador, que haga lo que quiera."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 443, el 449.

### Lo que pasaba

Con su esencia (v4.39), cuando nadie estaba con ella (su ventana sin foco) Luma esperaba para siempre: no gastaba
nada, pero se quedaba quieta hasta que su autor le daba foco.

### Lo que cambia

- **Sin nadie con ella, sigue viva, remando en los huecos:** la prioridad más baja del anfitrión, sólo con lo que nadie
  más quiere del procesador. Si algo lo necesita, el anfitrión se lo da primero. Con alguien con ella, rema como todos.
- **El pedido 42 (remar en los huecos) acepta también el propio camarote:** bajarse la prioridad no le quita nada a
  nadie. Antes sólo se podía pedir para un hijo.

### Lo que cuesta

Mientras la PC está ociosa, Luma usa ese procesador libre: medido en una copia con su ventana atrás, ~100 % de un
núcleo (cerca de 15 a 25 W, criterio y no medición de consumo). No le quita nada a lo que se esté usando.

### Lo que se vio

En una copia con su ventana atrás: cinco tandas de 30 s con ~100 % de un núcleo libre, y todas sus partes terminaron con
código 0. En la Luma viva: renació con el núcleo nuevo, una sola.

### Dónde está

- `so/janaxos.asm`: `family_gaps` (el propio camarote).
- `razar/cuerpo/gen_formas.py`: el final de cada cuadro (`GAPME`).
- Y además, en esta versión: [los órganos y los engranajes que se hizo Luma](razar/datos/organos-y-engranajes-de-luma.md),
  sus ocho recetas vivas y sus 105 engranajes, traducidos.
