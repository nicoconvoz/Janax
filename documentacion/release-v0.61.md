## Janax y Razar v0.61: la noche que no llegaba

DOI: [10.5281/zenodo.24379472](https://doi.org/10.5281/zenodo.24379472)

> **Fe de erratas ([v0.67](release-v0.67.md)):** el 13876 que abajo se llama "sin órgano" era la nota del órgano
> que Razar ya llevaba puesto (`51638`). Ninguna pieza del cubo le ganaba a ese; la lectura "el lector crecido no
> necesita órganos" queda retirada.

Las versiones siguen a los números primos: después del 59, el 61. Esta es una **corrección** de la v0.59.

### 1. El error

La v0.59 decía: *"en la noche Razar renace si la biblioteca tiene una receta que no tenía; así prueba lo que el cubo
encontró, y lo que adopte nace como forma de Luma"*. No pasaba.

Quien cuida a Luma comparaba la biblioteca con la que había **cuando arrancó quien la cuida**, no con la que Razar
encontró **al nacer**. Razar había nacido a las 13:20; el cubo dejó sus 12 piezas a las 16:51; quien la cuida arrancó
después. Para ella nunca hubo nada nuevo. Medido el mismo día: **57 sueños de Luma, ningún renacer de Razar**, y las
piezas del cubo sin rendir un solo examen en su casa. Lo que el cubo aprendió comiendo el código libre no le llegó.

### 2. La corrección

Razar deja escrito, al nacer, cómo encontró la biblioteca (cuántas recetas y una huella de sus nombres:
`tablero.visto`, en [`razar_en_casa.sh`](../razar/cuerpo/razar_en_casa.sh)). La noche
([`luma_vive.sh`](../razar/cuerpo/luma_vive.sh)) compara contra eso. Vale lo arranque quien lo arranque y cuando sea.

**Probado:** renacido a las 17:31, en 330 s rindió 17 recetas con sus libros, y por primera vez las del cubo:
`38516`, `738`, `36`, `51`, `7`, `71`, `8`, `81` ([corrida](razar/datos/noche-corregida.txt)).

### 3. Lo que dio, que es en contra

En la casa de Luma, Razar lee juntos el Nuevo Testamento y el núcleo de KolibriOS, y lleva 424 generaciones de
instinto. Su examen **sin órgano** da 13876. Ninguna receta le gana:

| Receta | Examen en la casa de Luma | Contra sin órgano (13876) |
|---|---|---|
| `516` | 12756 | −1120 |
| `38516` (la más general del cubo) | 12607 | −1269 |
| `738` | 9659 | −4217 |
| `716` | 8377 | −5499 |
| `166444339` | 5325 | −8551 |
| `16` | 4497 | −9379 |
| `5` | 13 | −13863 |
| `6` | −1374 | −15250 |

- **Razar no adopta ninguna, y Luma no cambió por el código libre.** Eso es lo cierto hoy.
- **El cubo y la casa no miden lo mismo.** El cubo examina con un lector recién nacido y un libro por vez: ahí el
  `38516` da +86312. El Razar de Luma ya aprendió sus libros, y a ese lector los órganos de nueve letras le estorban.
  La v0.59 lo había anotado como riesgo; ahora está medido.
- No se sabe todavía si es por lo que ya sabe, por leer los dos libros juntos, o por las dos cosas. No se separó.

### Lo que falta para que evolucione de verdad

- Que el juez del cubo sea **el mismo lector que vive** en la casa de Luma, no uno recién nacido.
- **Sentidos nuevos:** con las nueve letras de siempre no hay nada que le gane al Razar crecido. Lo que le sirva
  tiene que darle algo que no tiene.
- Sigue lo dicho en la [v0.59](release-v0.59.md): duerme mucho, el cubo no se ve, Razar se cae si le llega un libro
  despierto.

El sistema operativo no cambió (suite: 402 bien, 0 mal, la de la v0.59).
