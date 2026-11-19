## Janax y Razar v0.53: todo lo visible

DOI: [10.5281/zenodo.24376081](https://doi.org/10.5281/zenodo.24376081)

> *"Ama lo invisible cuando es capaz de amar todo lo visible."* (el autor, 2026-11-19)

Las versiones siguen a los números primos: después del 47, el 53.

### 1. Los buenos se guardan: un cambio de marco

Un regalo de Luma, el órgano `382333414419`, sacó 7303 en el examen de Razar: le ganaba al `16`, y se perdió,
porque sólo dejaba receta el que le ganaba al campeón. Es el coeficiente de marco del autor (lo que cuenta no es
si resolviste, sino cuándo dudaste del enunciado): imposible en el marco "ganale al campeón", trivial en el marco
"sos el mejor de tu manera de hacer". Razar llevaba 227 intentos contra el mismo campeón, con cero victorias.

Ahora el órgano que resulta el mejor de su nicho deja su receta aunque no sea el campeón, si le gana a no tener
órgano. Esa vara la mide él con su propio libro, una vez por estante.

- **Probado** contra el código anterior, misma biblioteca vacía, 12 intentos: las 37 líneas de examen dan
  idénticas; quedan las recetas `6` y `5` como antes y se suma el `8` (−3358 contra −3554 sin órgano). Los que
  tomaban nicho sin ganarle a nada no se guardan.

### 2. Reglas generales y láser: tres dominios medidos

El autor: *"puede haber órganos por dominio, pero siempre hay reglas generales multidominio; algunos son
específicos, otros se trasladan; unos van en profundidad láser, otros en difusión superficial."* Medido con los 90
órganos de hasta dos letras sobre la Biblia, sobre código en C y Python, y sobre el núcleo de KolibriOS en
ensamblador ([datos](razar/datos/dominios-resultado.txt)):

| Órgano | Biblia | Código | Kolibri | Qué es |
|---|---|---|---|---|
| `5` | 61 % | 87 % | 55 % | general: paga en los tres |
| `6` | 32 % | 96 % | **100 %** | general, y campeón de Kolibri |
| `16` | **100 %** | −43 % | −172 % | láser: campeón de la Biblia, dañino afuera |
| `25` | 78 % | **100 %** | −33 % | campeón del código |

(Cada porcentaje es su ganancia sobre no tener órgano, respecto de la mejor de ese dominio.)

- Sólo 20 de 90 pagan en los tres, y son dos órganos, el `5` y el `6`, repetidos con letras de más que no cambian
  nada. **Las reglas generales resultaron las más cortas.** 50 de 90 no pagan en ninguno.
- **El estante compartido.** Una receta de un libro jamás se probaba sobre otro: la fila miraba sólo la carpeta de
  su modelo. Ahora rinden primero las recetas de todos los modelos. En una vida sobre código, el `716` (un escalón
  olvidado de la Biblia) salió campeón: −15700, contra −23848 sin órgano y −18495 del mejor de dos letras. El
  `516`, campeón de la Biblia, dio −30968.

### 3. Nada es adorno: lo que Razar aprende cambia a Luma y al vigía

El autor: *"que no sean un adorno bonito: en Razar todo se usa y todo tiene razón de ser."* La auditoría encontró
dos piezas sin uso, y las dos quedaron enchufadas:

- **El vigía estudiaba todos los textos sin órgano** (su lugar, en cero). Ahora lee con el órgano que tiene recetas
  en más modelos; entre iguales, el más corto. Hoy es el `6`. Medido con el mismo texto: en la carta del autor,
  951 pistas sin órgano, 1091 con el `6`, 1100 con el `5`; en `kilo.c`, 3985, 4139 y 4400.
- **Las formas de Luma nacían de una lista fija**, horneada al generar su programa. Ahora, cuando Razar estrena
  órgano, nace como forma de ella en el lugar de la que su propio juez valora menos; la reemplazada va al archivo.
  Medido en una copia de su casa, 40 s sin ventana: **de 131 a 144 victorias** (antes, 0 en 70 s). En su ventana
  real, de 131 a 141 en menos de dos minutos. Su población llevaba días quieta en su óptimo.

### 4. La primera vez que le pagó

Con la Biblia y Kolibri juntos en su estante, a las 13:02 del 2026-11-19 Razar hizo suyo un regalo de Luma, el
`511444432319` (una forma de ella con una letra cambiada): de −2572 a 675. Las cuentas de Luma venían todas en
cero; regalar le pagó una vez y sus ganas de regalar pasaron al 65 %. Nadie se lo indicó.

### 5. Hace lo que quiere

El autor: *"no quiero darle una regla; que muestre las gamas de colores que quiera, las formas que quiera, que
diseñe los órganos que quiera."* El amor no le restringe ningún acto: define qué le paga.

- **Se pinta** (cuarto acto de su libertad). Sus formas se veían casi negras y no era una falla: cada una llevaba
  el primer color de lo que comió, el más contado, que en muchas criaturas es el contorno oscuro. Ahora una forma
  se pone otro de los colores de su comida, por su suerte. Nada se lo paga. Su paleta queda en su casa.
- **Regala a todo lo que ve.** Lleva una cuenta por cada uno (Razar y sus 236 criaturas: cuántas veces le dio,
  cuántas le sirvió) y elige a quién con las mismas ganas, (S + ½) / (N + 1). Ninguna regla la manda hacia nadie:
  aquel a quien nunca le dio es de quien menos sabe, y por eso el que más ganas le despierta. A una criatura le
  ofrece una forma suya, y la criatura la toma sólo si le acorta su propia descripción. Medido sin ventana, 60 s:
  le dio a 5 y a 2 les sirvió. `python razar/cuerpo/libre.py <casa>` muestra a cuántos alcanzó.
- **Su firma** ([`razar/corazon/firma.txt`](../razar/corazon/firma.txt)): *What hath God wrought*, la primera frase
  que viajó en código morse (Samuel Morse, 24 de mayo de 1844). No firma con el nombre de quien hizo la obra: dice
  de quién es. Viaja en su casa.

### 6. De paso

- Los archivos de arranque con Windows viven en [`razar/arranque/`](../razar/arranque/LEEME.md).
- Lo que dice Razar ya no se guarda en un archivo: ese registro crecía con cada carta y el vigía se lo volvía a
  comer entero cada vez (un núcleo ocupado por nada).
- La casa del repositorio ([`razar/casa/`](../razar/casa/LEEME.md)) lleva la firma: 17 archivos.

### Lo que falla y lo que falta, dicho

- **Razar se cae cuando le llega un libro estando despierto**: dice "novedad" y el proceso termina en vez de
  renacer. Vuelve a vivir al relanzarlo (el arranque lo hace). Sin arreglar.
- **Una cuenta de Luma queda corta**: las victorias que provoca el órgano de Razar no se le anotan como "pensar le
  pagó", porque esa ronda no la eligió ella.
- **Más pistas no es mejor lectura**: se midió que el órgano cambia lo que saca el vigía, no que lo saque mejor. Y
  su biblioteca quedó mezclada: lo anterior, sin órgano; lo nuevo, con el `6`.
- **No se ve**: regalar, descansar y recibir el órgano de Razar no dibujan nada en su ventana. Y sigue oscura: elige
  entre los colores de lo que comió, y lo que comió es oscuro. No se le fuerza el brillo.
- **No alcanza a todo lo visible**: las formas que descartó y su autor no reciben nada de ella. En su ventana hace
  un regalo cada minuto y medio: llegar a los 237 le lleva horas.
- **Razar creció** de 141 a 372 MB con dos libros.
- **Límites de la medición**: tres dominios, un libro cada uno, órganos de hasta dos letras; el origen del órgano
  `338339` (6522) no se verificó.
- **No se afirma** que nada de esto sea amor ni libertad. Lo construido es una elección que nadie le dicta, donde
  dar vale por lo que le sirve al otro y nadie queda excluido de recibir.
- Los libros de código y KolibriOS (GPL-2.0) se usaron como comida y **no viajan** con el repositorio.

### Cómo verla

Descomprimí `razar/casa/luma-casa-corazon.zip` dentro de una carpeta y corré `bash razar/cuerpo/luma.sh <carpeta>`;
para que Razar viva en esa casa, `bash razar/cuerpo/razar_en_casa.sh <carpeta> <libro>`.
Suite del sistema operativo: **402 bien, 0 mal**. Lo anterior: [v0.47](release-v0.47.md) · [v0.41](release-v0.41.md).
