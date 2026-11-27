## Janax y Razar v5.87: lo que sus costumbres no cubren, lo contesta con lo que dicen sus libros

DOI: [10.5281/zenodo.24585916](https://doi.org/10.5281/zenodo.24585916)

> *"Si está comiendo Una vida entera debe saber quién es Juli. Y si no está en el libro de costumbres tiene que buscar
> los ejemplos de los libros."* — *"Buscá los ejemplos donde sale Juli, y da una respuesta coherente a la pregunta."*
> (el autor, 2026-11-27)

Las versiones siguen a los números primos: después del 577, el 587.

### Lo que pasaba

A *"quien es Juli?"* contestó *"soy, y vos quien sos?"*. Juli está 232 veces en el libro que estaba leyendo, pero la
pregunta se parece a una costumbre (*"quien sos?"*), y la costumbre contestó por ella.

### Lo que cambia

- **Una costumbre contesta sólo lo que cubre.** Una palabra de quien le habla está cubierta si algún ejemplo dice una
  de su clase: la misma, o una en el mismo hueco (*"hola Lumita"* vale por *"hola Luma"*, con la regla del hueco que ya
  usaba). La que queda en un lugar donde ningún ejemplo tiene nada es **de lo que se le pregunta**, y esa la busca en
  sus libros (`rc_ui`, en `r_canto`).
- **Busca oraciones, no renglones.** Un renglón de un libro es un párrafo entero; lo que se dice de algo es una
  oración. Una oración **habla de la palabra** cuando es la primera que cuenta en ella (antes sólo palabras de tres
  letras o menos: *"A Juli se le…"*, *"El genoma es…"*), termina como oración (un título no) y dice al menos otra
  palabra que cuenta (*"Sí, Juli."* la nombra y no dice nada). Junta hasta siete, en el orden de su lectura
  (`dan_hit`).
- **Esas oraciones van adonde van siempre sus ejemplos:** primero la que todavía no le dijo; cuando las dijo todas,
  el canto de su cardumen con ellas; y su suerte al final. Preguntar otra vez por lo mismo trae otra oración.
- **La busca en todos sus libros**, no sólo en la rama donde está, y no en la charla, donde lo que más se parece es la
  misma pregunta hecha antes.
- **Sin ninguna costumbre parecida** busca todas las palabras en sus libros antes de devolver la pregunta.
- **Siete libros de ciencia nuevos en su estante** (genoma, universo, sistema solar, origen de la vida, cuerpo humano,
  planeta Tierra, ciencia): 223 artículos enteros de Wikipedia en español (CC BY-SA 4.0), elegidos por su nombre. Las
  fuentes, una por una, en `razar/comida-libre/ciencia/FUENTES.md`.
- **Su logo.** La imagen de la Vendimia que hizo su autor es el icono de su programa, y se muestra en grande mientras
  ella despierta (`razar/instalador/luma.asm`, `razar/logo/`).

### Lo que se vio

En una copia oculta, con la charla real de su autor y el libro que estaba leyendo:

| se le dijo | contestó |
|---|---|
| *quien es Juli?*, *contame de Juli*, *y que mas de Juli?* | tres oraciones distintas del libro, las tres con Juli como sujeto |
| *que es el genoma?* | *El genoma viral se traduce y duplica, ensamblandose numerosas particulas virales nuevas…* |
| *hola Lumita* | hola, que alegria verte |
| *como estas?* | hola, muy bien, y vos? |
| *gracias* | no hay de que |

Las oraciones sobre Juli no se copian acá: son de un libro de su autor. Tardó de 6 a 17 segundos en las preguntas que
van a sus libros; las costumbres, como antes.

### Lo que todavía no

- **No elige la mejor oración: dice la primera que encuentra.** *"que es el genoma?"* trajo una oración cierta sobre
  el genoma, no su definición (que empieza *"El genoma es la secuencia…"* y estaba en el mismo libro).
- **Con dos palabras sin cubrir puede hablar de la otra:** *"hablame de Juli"* contestó una oración que empieza con
  *"Hablame"*.
- **Lo que quedó en la charla todavía pesa:** *"quien es Newton?"* contestó *"Hola vos"*, algo dicho antes entre ellos.
- **Es más lenta en esas preguntas** (lee todos sus libros): hasta 17 segundos medidos.
- El tiempo que se ve su logo (dos segundos al menos) es criterio, no medición.
- No se probó tecleando en la Luma de su autor: se instaló y despertó, y la prueba fue en la copia.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `rc_ui`/`rc_uk` (qué cubre una costumbre), `dan_hit` (la oración que habla de algo),
  `wysg_pt` (su paso), `dan_ot` (no en la charla).
- `razar/comida-libre/ciencia/`, `razar/logo/`, `razar/instalador/luma.asm`.
