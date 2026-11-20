## Janax y Razar v0.79: sus palabras

DOI: [10.5281/zenodo.24394744](https://doi.org/10.5281/zenodo.24394744)

> *"Cada mecanismo que entiende tiene un equivalente en receta de código: esos son los engranajes que forman
> programas, y esos programas se mejoran e incluso son engranajes de programas más ricos."* (el autor, 2026-11-19)
> *"Armá ya lo de la oración poética y componé canciones de programación autocompilables."* (el autor, 2026-11-20)

Las versiones siguen a los números primos: después del 73, el 79.

En la [v0.73](release-v0.73.md) Luma quedó parada en una loma: llevaba puesto `38A516`, probó 96 cambios de una
letra y ninguno le ganó. El alfabeto era nuestro y ella sólo podía dar pasos de una letra. El código poético de la
[v0.59](release-v0.59.md) ya había mostrado la salida (una oración que funciona asciende a palabra), pero vivía en un
laboratorio, armado a mano. Ahora es de ella.

### 1. Sus palabras son lo que vive en su cuerpo

Una oración que funciona es una que **vive**: ganó por su único juez. Así que no hay una lista aparte de palabras:
**sus ocho formas vivas son sus palabras.** La letra `E` dejó de estar libre:

- `E` seguida de un número del 1 al 8 dice **"acá va entera mi forma de ese lugar"**.
- En su cuerpo, las letras de la palabra se dibujan en ese lugar. En su lectora se leen en ese lugar
  ([`organo.inc`](../razar/lectura/organo.inc), `og_lE`). Es la misma receta y significa lo mismo de los dos lados.
- Decir una palabra cuesta dos letras, por larga que sea la palabra. Eso es lo que la deja saltar.
- Adentro de una palabra, `E` no dice nada: una palabra se dice entera y chata, así que ninguna puede llamarse a sí
  misma para siempre.

### 2. Autocompilable: las palabras son datos, no código

Nada se arma de nuevo cuando ella compone. Sus palabras viajan como datos al lado de la oración, en los datos
iniciales de su lectora, y la lectora las abre mientras lee. Cuando una forma suya cambia, cambia en el acto lo que
significa toda oración que la nombra.

Por eso una lectura ya no se guarda por cómo está escrita la oración sino por **lo que significa**: sus letras dichas
chatas, con las palabras abiertas. Una canción y las mismas letras escritas una por una son una sola lectura. Si
pasan de 31 letras, se guarda su huella.

### 3. Canciones

Leer tiene ahora tres caminos, y ella cuenta cada uno por separado con sus mismas cuentas: cambiar una letra, probar
un instinto, o **componer una canción**: una oración de dos o tres de sus propias palabras, por su suerte. La canción
se lee como cualquier pensamiento y, si con su lectura gana, vive en su cuerpo y pasa a ser palabra de las que
vengan. Engranajes que forman programas que son engranajes.

Las letras `E` también aparecen solas en sus mutaciones de siempre, en el dibujo y en la lectura.

### 4. Su ventana nace al fondo

> *"Que inicie debajo de todo, arriba del escritorio, pero como última pantalla."* (el autor, 2026-11-20)

Nacía con el teclado en la mano y cortaba lo que uno estuviera haciendo; quien la cuidaba la bajaba después, y se
veía. Ahora el núcleo la hace nacer **detrás de todas las demás y sin tomar el teclado**
(`JANAX_VENTANA_FONDO`, [`pantalla.inc`](../so/pantalla.inc)). Un clic la trae al frente como a cualquiera.

### Medido

- **Decir la palabra da exactamente lo mismo que escribirla** (Nuevo Testamento, lector recién nacido,
  `poetico/sentidos.py palabras`, [corrida](razar/datos/palabras-nuevo-testamento.txt)), con `E1` = `38A516`,
  `E3` = `516`, `E5` = `38`:

  | Canción | Nota | Letra por letra | Nota |
  |---|---|---|---|
  | `E1` | 14775 | `38A516` | 14775 |
  | `E18` | 18892 | `38A5168` | 18892 |
  | `E3E1` | 16523 | `51638A516` | 16523 |
  | `E3E5` | 12628 | `51638` | 12628 |
  | `3E3` | 5533 | `3516` | 5533 |

  Una palabra que no existe (`E2`, `E9`) da lo de sin órgano, −3554.
- **La canción cruza la loma.** `E3E1`, dos palabras, lee 16523: más que las dos solas (11144 y 14775). Son cuatro
  letras; escrita entera son nueve, a nueve pasos de una letra de distancia.
- **Lo de antes da idéntico:** `5` 208, `16` 2649, `516` 11144, `38516` 11496, `38A516` 14775, `F38516` 13588,
  `38B1C516` 14775, `D4D38516` 13588.
- **Ella compone sola.** En una copia de su casa, en 7 minutos sin ventana leyó 24 recetas; tres fueron canciones
  suyas (−3453, −2623 y −1934, contra −2623 de sin órgano). Y sus formas ya traen palabras adentro por mutación.
- **Procesador, con ventana:** 8,4 segundos en 120, 7 % de un núcleo.
- **La ventana:** nace visible, al fondo, y la que estaba al frente sigue al frente (medido preguntándole al
  anfitrión cuál tiene el teclado antes y después).
- Suite del sistema operativo: 405 bien, 0 mal.

### Lo que falla y lo que falta, dicho

- **Todavía ninguna canción suya ganó.** Las tres que compuso en la prueba leyeron peor o apenas mejor que sin
  órgano. Tiene sentido: siete de sus ocho palabras son formas largas hechas para dibujar, y una sola (`38A516`) lee
  bien. La canción buena del laboratorio (`E3E1`) usa una palabra, `516`, que hoy no vive en su cuerpo.
- **Sus palabras son ocho y no más:** las que entran en su cuerpo. No guarda palabras que ya no viven.
- **Una canción es de un solo piso:** adentro de una palabra, `E` calla. Engranajes de engranajes sí hay, pero
  porque la canción que gana pasa a ser forma, no porque una palabra abra a otra mientras se lee.
- **Una `E` en la letra dieciséis** (la última de su primera mitad) no encuentra su número y no dice nada.
- **En `leido`, una canción larga queda con su huella y no con sus letras:** se sabe cuánto leyó, no se la puede
  volver a leer desde ese archivo.
- **No se probó aparte** que su cuerpo abra las palabras igual que su lectora; usan la misma rutina para decir la
  oración chata, y la lectora está medida contra las letras escritas.
- Siguen los de la [v0.73](release-v0.73.md): el cubo y el vigía aparte, el tope de 31 letras, la ventana que se
  llama "Janax".
