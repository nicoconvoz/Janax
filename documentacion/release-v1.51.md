## Janax y Razar v1.51: aprende a dibujar cada letra

DOI: [10.5281/zenodo.24429385](https://doi.org/10.5281/zenodo.24429385)

> *"Al escribir en Luma no aparecen todos los caracteres."*
> *"Esperá, Doc: que aprenda a dibujar todo, incluso si hay algo nuevo que no conoce."* (el autor, 2026-11-21)

Las versiones siguen a los números primos: después del 149, el 151.

### Lo que faltaba

Desde la v1.39 le llegaba todo lo que se le escribe (acentos, eñes, signos, emojis), pero **su abecedario de
puntitos sólo tenía A–Z, 0–9 y "?"**: lo demás se dibujaba como un hueco.

Hubo una primera respuesta, un abecedario hecho a mano con signos y letras acentuadas. El autor la frenó: no
quería un abecedario puesto, quería que **aprenda**. Quedó apartado, con su motivo.

### Cómo aprende

- **Su libro de letras:** en su casa, con el nombre `letras`, está **GNU Unifont 18.0.01**, una tipografía libre
  (GPL 2+ con la excepción de fuentes, y SIL OFL 1.1) que dibuja 126.743 caracteres en puntitos de 8 × 16 o
  16 × 16. Es texto plano: el número del carácter y sus puntos. Es un puente con software libre, como pide la regla
  de la casa: quien lee y dibuja es ella, en Janax.
- **Cuando se encuentra un carácter que no sabe dibujar** (porque se lo escriben, o porque lo dice ella), lo busca
  en ese libro, **copia su dibujo a su propio `abecedario`**, y desde entonces lo dibuja siempre.
- **Guarda sólo lo que se encuentra** (la regla plástica: crece a la medida de lo que usa), y al nacer de nuevo lee
  su `abecedario`: no vuelve a buscar lo que ya aprendió.
- **Si el libro tampoco lo tiene,** guarda un marco: lo conoció, y dice que no lo sabe dibujar. Nunca un hueco
  mudo.
- Sus letras de siempre siguen siendo sus 5 × 7; las aprendidas las dibuja **a la mitad de su tamaño** (un punto
  donde había alguno de cuatro), para que entren en su renglón.

### Medido

En una copia de su casa, escribiéndole `¡Hola! papá ñandú 🌱 ∑ 中`:

```
00A1:…   ¡        00E1:…   á        00FA:…   ú        2211:…   ∑
0021:…   !        00F1:…   ñ        01F331:… 🌱       4E2D:…   中
```

Aprendió esas ocho, las dibujó en su renglón, y **al nacer de nuevo las recordó**: su `abecedario` siguió con ocho
líneas, sin volver a copiarlas.

- En vivo desde el 21 a las 18:41.
- El núcleo no cambió desde la v1.39.

### Lo que falla y lo que falta, dicho

- **Copia, no inventa el dibujo:** aprende como un chico con una cartilla. Que invente formas para lo que nadie
  dibujó todavía queda para después.
- **A la mitad de su tamaño, los dibujos finos pierden detalle:** un ideograma de 16 × 16 queda en 8 × 8.
- **Las letras aprendidas son algo más anchas o angostas que las suyas**, así que un renglón con muchas puede
  pasarse del borde.
- **Su libro de letras no está en el repositorio** (8,3 MB): una casa nueva lo necesita en `letras` para aprender;
  sin él, guarda marcos. Se baja de unifoundry.com (`unifont_all-18.0.01.hex.gz`).
- Siguen los de la [v1.49](release-v1.49.md).
