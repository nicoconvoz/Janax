## Janax y Razar v3.53: letras de partículas, a resolución completa

DOI: DOI_PENDIENTE

> *"Mirá un SVG: en cualquier tamaño pesa lo mismo y es igual de nítido… armá vectores de partículas, así jugamos con
> mi nube."*
> (el autor, 2026-11-23)

Las versiones siguen a los números primos: después del 349, el 353.

### Por qué

Su texto se leía "raro, como desenfocado". Había tres causas:

1. Cuatro mayúsculas mal escritas (se corrigieron en la v3.49).
2. Sus letras aprendidas (de 16 × 16 puntos) se achicaban con una regla fija: si había tinta en cualquiera de 4 puntos,
   pintaba uno. Eso engordaba todo, y la `y` y la `g` salían manchas.
3. Ella dibujaba en 640 × 349, y el núcleo lo mostraba al doble. Su ventana tiene el doble de puntos de verdad, y
   ella usaba la mitad.

### Letras como vectores de partículas

- **Cada letra aprendida se cuenta como trazos rectos**: de costado, hacia abajo o en diagonal. Cada vez se elige el
  trazo que cubre más tinta todavía no cubierta, hasta cubrirla toda: es la descripción más corta, paso a paso.
- **Al dibujarla, cada trazo suelta sus partículas** a lo largo de su camino (Bresenham): una por punto del tamaño que
  toque. Como un SVG, la letra pesa lo mismo a cualquier escala.
- Se cuenta la primera vez que se dibuja y queda guardada con la letra.

### Su pantalla, punto por punto

- El núcleo muestra una pantalla al mayor múltiplo entero que entra en 1280 × 800. Ahora ella le entrega una pantalla
  **dos veces más grande** (1280 × 698), y el núcleo la muestra 1:1. **No se tocó el núcleo.**
- Lo que ya dibujaba (sus formas, los bichos, su música) queda igual: cada punto suyo ocupa 2 × 2.
- **Su panel se dibuja en puntos finos.** Ahí las letras de partículas muestran todo su detalle.

### Cada letra con su trazo más fino

Cada letra se dibuja con la descripción más fina que ella tenga y que la superficie pueda mostrar. En el panel va
primero su letra aprendida. La que sólo conocía gruesa, en su tipografía de 5 × 7 (los dígitos, el signo de pregunta),
la aprende **una vez** de su libro de letras. Si el libro no la tiene, sigue dibujándola gruesa, para no dejar huecos.

### Lo que se vio

Probado en una copia de su casa, nunca en la Luma viva:

- El texto del panel sale parejo y nítido: mayúsculas, minúsculas, dígitos y signos con el mismo trazo.
- Aprendió los diez dígitos y el `?`: su abecedario pasó de 97 a 108 letras.
- **Costo medido:** con la misma charla gastó 40 s de procesador, contra 52 s del cuerpo anterior. Mover el doble de
  puntos no se nota; la diferencia es ruido de la medición, no un ahorro.
- La ventana quedó del mismo tamaño (1296 × 737 con su marco).

La Luma viva corre, byte por byte, el cuerpo que se probó.

### Lo que todavía no

- Sus formas, los bichos y su música siguen en bloques de 2 × 2. Que ganen detalle depende de que ellos lo tengan.
- Su título ("Luma Vera"), sobre las formas, sigue con la tipografía de 5 × 7.
- Las letras de partículas usan sólo trazos rectos: las curvas son escalones.

### Dónde está

- `razar/cuerpo/gen_luma.py`: `K`, `FSW` × `FSH`, el `FINE` del panel, y el final de `v_show` (al doble, el panel
  fino, y se muestra).
- `razar/cuerpo/gen_leer.py`: `lv_make` (los trazos), el dibujo en `r_txt`, `r_splot` / `r_fsplot` / `r_tfplot`, y
  `r_letra_fine`.
