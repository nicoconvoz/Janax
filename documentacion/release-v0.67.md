## Janax y Razar v0.67: los sentidos

DOI: pendiente

> *"No sólo que ahorre bits: quiero que programe cosas reales, órganos reales que le den nuevos sentidos."*
> *"Que se inspire de lo que come."* (el autor, 2026-11-19)

Las versiones siguen a los números primos: después del 61, el 67.

### 1. Qué es un sentido

Con sus nueve letras, el órgano de Razar mira una ventana de cuatro palabras, y a cada una la mira tal cual. Un
sentido es una mirada que esas nueve letras no pueden dar. El espacio de miradas tiene dos ejes, y los dos salen de
lo que su propio comer ya había medido; no se le agregó nada al cuerpo:

- **Dónde:** la fila del texto sigue antes y después de la ventana. La palabra de atrás (o el borde del renglón, que
  ninguna ventana contiene) y la de adelante.
- **Cómo:** la palabra tal cual, o **borrosa**: cuántas veces la leyó donde aprende. Todas las que nunca leyó se ven
  iguales, así que un marco dicho con esa mirada también calza en lo que nunca encontró.

Las seis letras libres (A a F) tomaron los seis puntos más simples de ese espacio. Cada una mezcla lo que ve en el
marco, como las letras 1 a 4. Se juzgaron como todo órgano: en oraciones, con su examen, en una misma vida
([`sentidos.py`](../razar/lectura/poetico/sentidos.py)).

### 2. Medido sobre el Nuevo Testamento

Lector recién nacido, 60 oraciones en una vida ([corrida](razar/datos/sentidos-nuevo-testamento.txt)); las notas son
contra el examen sin órgano (−3554).

| Oración | Qué tiene | Nota | Contra `38516` |
|---|---|---|---|
| `38A516` | la palabra de atrás (A), donde la oración decía una palabra sin nada antes | **+18329** | +3279 |
| `F38516` | la cuarta palabra, borrosa (F), delante | +17142 | +2092 |
| `A38516` | la de atrás, delante | +15082 | +32 |
| `38516` | la mejor de nueve letras de su tipo | +15050 | |
| `C38516` · `B38516` · `D38516` · `E38516` | las otras cuatro miradas | +15001 · +14402 · +12680 · +8910 | menos |

- **Quedan en el cuerpo los dos que le ganaron a la oración donde se pusieron: A y F**
  ([`organo.inc`](../razar/lectura/organo.inc)). El `38A516` supera también al mejor que se conocía, el `5163827`
  (+16729).
- **Los otros cuatro esperan**, escritos con su código y su número. Dos pagan solos (`C6` +5297, `E8` +6679) pero no
  mejoran la oración fuerte. Las letras B a E siguen libres.

### 3. En la casa de Luma, que era la prueba

Razar, crecido y con sus dos libros (Nuevo Testamento y núcleo de KolibriOS), renació con los sentidos en el cuerpo y
cinco recetas con ellos en la biblioteca ([corrida](razar/datos/sentidos-casa-luma.txt)):

| Órgano | Examen en la casa de Luma |
|---|---|
| **`38A516`** (el que lleva puesto) | **27810** |
| `A38516` | 18082 |
| `51638` (el mejor de nueve letras) | 17894 |
| `F38516` | 16898 |
| `38516` | 16272 |
| `516` | 16201 |

- **Razar lleva puesto el `38A516`:** 9916 más que el mejor de nueve letras, un 55 %.
- **Luma lo adoptó:** nació como forma suya. Y por primera vez **dormir le pagó**: de 66 sueños, uno la despertó con
  algo nuevo.
- El `F38516`, que en el lector recién nacido ganaba, en el crecido no le gana al `51638`. Lo borroso le sirve al que
  sabe poco.

### 4. Un arreglo que esto destapó

El nicho de un órgano es dónde tiene su primer hueco, y el código tomaba por hueco toda letra mayor que 4. Con una
letra nueva nombraba un nicho que el archivo no tiene, y la vida se rompía (27 oraciones de 56 en la primera
corrida). Los huecos son las letras 5 a 9; una letra más allá es un sentido.

### Fe de erratas de la v0.61

La v0.61 decía que en la casa de Luma *"ninguna receta le gana al examen sin órgano (13876)"*. Leí mal el
instrumento: ese número es la nota **del órgano que Razar ya llevaba puesto** (el `51638`, que Luma había adoptado a
las 15:31), no la de no tener órgano. Lo cierto era: ninguna pieza del cubo le ganaba al que ya tenía. La conclusión
"el lector crecido no necesita órganos" no se sostenía, y queda retirada.

### Lo que falla y lo que falta, dicho

- **Los seis sentidos los propuse yo**, como los puntos más simples de un espacio de dos ejes; Razar eligió con su
  examen cuáles se quedaban. Todavía **no los genera Luma a su modo**: falta que ella recorra ese espacio (más
  lejos, otras tablas de lo que comió, otras maneras de mirar borroso).
- **En el cuerpo de Luma un sentido se dibuja como un espejo**, igual que la letra 9: no tiene gesto propio todavía.
  Y sus mutaciones siguen usando sólo las nueve letras.
- **El cubo no habla con sentidos:** sólo lee recetas de nueve letras.
- **Un punto de comparación, no una estadística:** una corrida por libro. En la casa de Luma el instinto también
  cambió en ese renacer (de 8 1 1 a 8 2 1), así que las notas de esta vida no se comparan con las de la anterior;
  sí entre sí.
- **Las letras libres son seis.** Quedan cuatro; es un tope del molde (cuatro bits por letra), no del diseño.
- La palabra de atrás del primer lugar del texto lee lo que haya antes de la fila: un solo caso por libro, no medido
  aparte.
- Sigue lo dicho en la [v0.59](release-v0.59.md): el cubo no se ve, Razar se cae si le llega un libro despierto.

El sistema operativo no cambió (suite: 402 bien, 0 mal, la de la v0.59).
