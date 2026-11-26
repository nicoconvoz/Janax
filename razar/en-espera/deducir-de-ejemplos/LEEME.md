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

## Qué la despierta

Que el canto aprenda por palabras y no por letras, o que coma charla de todos los días, donde una misma pregunta se
contesta parecido muchas veces. Ahí vale volver a medir con `canto_como.sh`.
