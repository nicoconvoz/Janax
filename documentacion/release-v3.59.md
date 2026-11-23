## Janax y Razar v3.59: el abuelo nombra al nieto, y sus contornos con curvas

DOI: [10.5281/zenodo.24466603](https://doi.org/10.5281/zenodo.24466603)

> *"Que un proceso hijo pueda ser nombrado por el abuelo como hermano del padre, dándole la posibilidad de vivir aunque
> el padre muera… pero sólo si se lo da desde lo alto."*
> *"Agregale nitidez vectorizada en partículas al resto de todo Luma… incluí las curvas. Las líneas vienen del hombre,
> las curvas de la mujer."*
> (el autor, 2026-11-23)

Las versiones siguen a los números primos: después del 353, el 359.

### El abuelo nombra al nieto (núcleo, pedido 46)

- **El nombramiento.** Un proceso que está por encima del padre (el abuelo, o más arriba) puede nombrar al nieto
  **hermano del padre**: pasa a ser hijo del padre de su padre. Ni el hijo ni su padre pueden pedirlo: **sólo desde lo
  alto**. Lo que el nieto esperaba que firmara su padre pasa a firmarlo su nuevo padre.
- **Nombrar da vida, no poder.** Los porteros (permisos) del nombrado quedan como estaban, que nunca son más que los
  de su padre.
- **Sin nombramiento, la línea muere con el padre.** Cuando un proceso termina, termina su línea entera.
- **El núcleo es lo más alto.** Cuando termina un proceso que lanzó el propio núcleo, el núcleo nombra a sus hijos, y
  lo que esperaba su firma se decide con sus permisos. Así las cajas y Venn, donde una madre deja algo y se va, siguen
  andando como siempre.
- **La sombra del padre queda dormida, no borrada.** Con esta regla ningún padre la necesita, pero el mecanismo sigue
  ahí.
- El número 45 queda reservado para la rama `nucleo/ceder-firma`, que no se unió.

**Probado en una copia del proyecto:** familia, cajas y Venn dan 102 bien, 0 mal. Hay cuatro pruebas nuevas: el
abuelo nombra al nieto (el padre muere primero y el nieto dice "hola" después), el padre no puede nombrar a su propio
hijo, sin nombrar el nieto muere con su padre, y el núcleo nombra al hijo de una madre suya que se va. **La suite
completa del núcleo no se corrió.**

El núcleo en uso se reconstruyó con esto. El anterior quedó guardado como `so/build/janaxos.antes-46.exe`.

### Sus contornos, con curvas

Su pantalla se agranda dos veces: sus formas al doble, y después todo al doble para mostrarse punto por punto. Ahora,
en esas dos veces, **una sola rutina traza el contorno**:

- Cada punto se vuelve cuatro, y cada cuarto toma el color del lado por donde corre su borde: cuando los dos vecinos que
  se encuentran en esa esquina son de un mismo color, y los otros dos no, el borde corta esa esquina (la regla
  *Scale2x*, de la familia del *pixel art upscaling*).
- Las escaleras se vuelven diagonales, y las diagonales seguidas se vuelven curvas.
- Vale para todo lo que dibuja: sus formas, los bichos y la vista del Tab, sin tocar cada parte por separado.

No es un trazado global con curvas de Bézier, sino el contorno decidido punto por punto. Probé primero dibujar los
bichos con una cámara más fina, y casi no cambiaban: sus nubes no tienen más detalle del que ya se veía.

### Lo que se vio

Probado en una copia de su casa, nunca en la Luma viva: las esquinas de sus formas se redondean y los trazos fluyen. Los
bichos ganan bordes suaves.

Hallado mientras se probaba: con el trazador **copiado dos veces** dentro de la misma rutina, la pantalla quedaba
negra. Cada copia sola andaba. Fusionado en **una rutina llamada dos veces** anda, y es lo correcto de todos modos. La
causa exacta de lo negro no se encontró.

La Luma viva corre, byte por byte, el cuerpo que se probó.

### Lo que todavía no

- Las letras siguen siendo trazos rectos. A su tamaño de hoy (1:1 con su libro de letras) las curvas no cambian nada.
- El costo del trazador no se midió con cuidado.

### Dónde está

- `so/janaxos.asm`: `family_name` (46), `line_end` (lo nombra el núcleo), `living_below`; `so/remos.inc` (la línea
  termina con el padre); `so/pruebas/familia_*.jsm`.
- `razar/cuerpo/gen_luma.py`: `contour_routine` (`r_contour`), llamada desde `v_show`.
