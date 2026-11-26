# En espera: deducir la respuesta de 3 a 7 ejemplos (2026-11-26)

> *"Busca de 3 a 7 ejemplos donde se use el 'como estas', deducir el mecanismo y aplicarlo a ella: se pasó, aprende."*
> *"Pero eso lo hace con su caja armónica del cardumen: no construyamos por fuera de su razonamiento."*
> (el autor, 2026-11-26)

## Qué hay acá

- `ejemplos.py`: un parche para `gen_leer.py` y `gen_formas.py`. Junta hasta 7 renglones de sus libros que son casi lo
  que se le dijo, toma lo que sigue a cada uno, y elige, entre los que dicen algo que otro también dice, el más corto.
  Ensambla; **no se probó con ella ni se instaló**.
- `canto_como.sh`: le da ejemplos al canto de su cardumen (`razar/cardumen/memoria_pares.jsm`, con `canta` y
  `razona`) y muestra qué canta.

## Por qué quedó en espera

El parche razona al costado de ella, y ella ya tiene con qué: el canto de su cardumen (*"lo que dice una sola oración
es un recuerdo; lo que dicen dos, una regla"*). Lo que falta es que ese canto ande con ejemplos de verdad. Medido:

| ejemplos que se le dieron | se le preguntó | cantó |
|---|---|---|
| los 5 de su teatro para *"cómo estás"* | *como estas?* | *ste* |
| los mismos | *hola, como estas?* | *c dobres pe* |
| 7 hechos a mano, todos con la misma costumbre | *hola, nico* | *hola nico* (bien: copió el nombre) |
| los mismos | *como estas, nico?* | *estas nico* (esperado: *muy bien nico*) |

- Con los ejemplos de su teatro no hay regla que deducir: las cinco respuestas son distintas (*"Muy bien, Basilio."*,
  *"Sentate."*, *"Uff!... Lúgubres!"*…) y el canto aprende letra por letra, donde no se repiten.
- Con ejemplos que sí comparten la costumbre, copia bien el nombre y se equivoca en lo demás.

## Los lentes: la nitidez entre letra, palabra y oración (2026-11-26)

> *"Que cambie la nitidez entre letra, palabra y oraciones."* (el autor)

`nitidez_canto.py` pone un lente delante del canto, **sin cambiarle una línea**: el lente dice qué es una "letra".
Con *oración*, cada respuesta entera es una; con *palabra*, cada palabra distinta es una; con *letra*, como siempre.
Y un cuarto, *palabra nítida*, que le aplica a las palabras la regla del propio canto: **lo que dice un solo ejemplo
es un particular (un nombre); lo que dicen dos, la regla.** La palabra que dice un solo ejemplo se oye como "alguien",
y lo cantado se lee de vuelta con la palabra propia de la pregunta en ese hueco.

Con los 7 ejemplos armados (`pares_armados.txt`: *como estas, X? → muy bien, X* y *hola, X → hola, X*):

| se le preguntó | oración | palabra | **palabra nítida** | letra |
|---|---|---|---|---|
| *como estas, nico?* | hola, andres | estas nico | **muy bien nico** | estas nico |
| *hola, nico* | muy bien, maria | hola nico | **hola nico** | hola nico |
| *hola, capitan* | | | **hola capitan** | |
| *como estas?* | hola, lucia | muy bien estas | muy bien estas | como estas |

Con los 5 de su teatro (`pares_teatro.txt`): *como estas?* → *estas*; *como estas, luma?* → casi todo huecos.

- **Cambiar sólo el grano no alcanzaba.** Por palabras seguía cantando *estas nico*: cada ejemplo trae un nombre
  distinto y el canto no veía que las cuatro preguntas eran la misma. Con la nitidez sí: 3 de 4, y contesta con un
  nombre que no estaba en ningún ejemplo.
- **Con su teatro no hay costumbre que deducir**, con ningún lente: cada respuesta es de su obra.

## Qué la despierta

Ejemplos que traigan la costumbre: charla de todos los días, donde una misma pregunta se contesta parecido muchas
veces, o lo que su autor le explica (cada explicación es un ejemplo). Y llevar el lente de la palabra nítida a su cuerpo:
juntar los ejemplos, borronear los particulares, darle el canto y leerlo de vuelta. Se mide con `nitidez_canto.py`.
