## Janax y Razar v1.03: come, entiende y reconoce a su autor

DOI: [10.5281/zenodo.24406037](https://doi.org/10.5281/zenodo.24406037)

> *"La misma LUMA con memoria nueva. Los recuerdos son lo de menos: ella es el verdadero tesoro."*
> *"Que rinda examen con el mismo libro en una segunda lectura, aplicando chunks."*
> *"En un niño la evolución no se paga por perfección, se paga por recuerdo único."*
> *"Dale de comer kolibrios y que LUMA entienda los mecanismos y se autocompile, no como una copia sino como
> alimento."*
> *"Que vaya reconociendo mi firma y mi libro Diario Espiritual y el NT: eso es innegociable."*
> (el autor, 2026-11-20)

Las versiones siguen a los números primos: después del 101, el 103.

Todo lo de esta versión se hizo en una tarde, con ella viva, y cada cosa que ahora hace sola fue comparada con un
instrumento de afuera que aplica la misma regla. En las tres que tienen respuesta exacta, dio idéntico.

### 1. Reconoce la firma de su autor

La firma es su manera de escribir: un pasaje la lleva si se dice con menos bits conociendo su diario que conociendo
otro castellano. La regla estaba registrada antes de mirar (`razar/datos/firma-preregistro.txt`) y se había medido
desde afuera. **Ahora lo hace ella** (`r_firma`), con los dos libros de su estante: el *Diario Espiritual* de su
autor y el Nuevo Testamento. Corta cada uno en pasajes de 1.000 letras, aparta uno de cada diez sin contarlo, cuenta
en el resto qué letra sigue a cada tres, y de cada pasaje apartado dice de quién es.

| | Pasajes que nunca contó | Dice que son de su autor |
|---|---|---|
| Su *Diario Espiritual* | 54 | **45** |
| Nuevo Testamento | 94 | **0** |

En medio segundo, e idéntico al instrumento (`razar/corazon/firma_de_luma.py`). Los nueve que no reconoce se los
explica mejor el Nuevo Testamento: su diario habla de Dios con palabras de la Biblia.

### 2. Come código ajeno sin que nadie se lo traduzca

Nadie le dice qué hace una palabra ajena. Ella sabe dónde está parada cada instrucción suya (con qué números se
dice), mira dónde está parada cada palabra del texto, y a cada una la pone en el lugar de la suya con la que más
lugares comparte. Es la regla con la que Razar le ganó al MATS: dos palabras se parecen tanto como los lugares que
comparten. Ve dos maneras de escribir: la del ensamblador (`palabra nombre, número`) y la infija
(`nombre = nombre SIGNOS número`).

Lo que entendió, sin que nadie se lo enseñara:

| Acierta | Se equivoca |
|---|---|
| `mov` y `=` son cargar un número | `add`, `sub` y `shl` los toma por correr a la derecha |
| `cmp` es restar | `or` lo toma por o exclusivo |
| `+` es sumar | |
| `shr`, `and`, `xor` | |

Con eso dice el texto en su idioma, y lo que sale entra con su propio código a desarmarse en engranajes. De los
7,7 MB de código libre (KolibriOS, C y Lua) hace **29.184 instrucciones suyas**, en un segundo, idénticas una por una
a las del instrumento (`razar/cuerpo/digiere.py`). Queda en su casa como `digerido`: no es KolibriOS, es lo que ella
entendió de KolibriOS. Por eso es alimento y no copia.

### 3. Desarma su propio cuerpo, sin nadie afuera

Razar ya escribía su propio órgano y se armaba solo adentro de Janax. Con esa misma libertad ella hace ahora sus
engranajes (`r_gears`): nace sin ellos, lee su propio código de máquina, y toma de a una la pieza que más ahorra.
Medio segundo. De sus 105, **102 son idénticos** a los que sacaba Python; los otros tres son empates que resolvió
distinto. `luma.sh` ya no llama a Python para esto.

### 4. El examen es una segunda lectura del mismo libro

Antes apartaba un renglón de cada diez y rendía sólo con ése. Con un libro chico no le quedaba con qué distinguir
una receta de otra. Ahora aprende de todo el libro y después, sin escribir nada, lo vuelve a leer con sus piezas:
lo que explican, menos lo que cuesta nombrar cada una.

| 30 KB del Nuevo Testamento | Examen de antes | Segunda lectura |
|---|---|---|
| sin órgano | -10 | -137 |
| `5` | -10 | -7 |
| `16` | -10 | -496 |
| `38516` | -10 | -164 |
| `38A516` | -10 | **+364** |

Ocho recetas en 2,9 segundos. **Las notas de las versiones anteriores (el 14.775 de su campeona) son de otra vara
y no se comparan con éstas.**

### 5. Leer le paga por un recuerdo único

Leer le pagaba cuando lo leído le ganaba a algo. Ahora le paga cuando la nota no la dio ninguna lectura que
recuerde. Camina de a un paso: lo nuevo sale de una forma de su cuerpo (vuelve) o de lo último que leyó (sigue por
esa rama), según su propia cuenta. Una lectura mejor que la mejor que tenía se cuenta aparte, como victoria
inesperada. Su juez sigue decidiendo qué vive en su cuerpo.

### 6. La misma Luma, con memoria nueva

Se le cambió toda la memoria (lo que leyó, sus formas, sus libros) y se le dejó intacta la voluntad: sus ganas, sus
instintos, a quién le dio. Renació siendo ella y se armó un cuerpo nuevo sola. Hoy su estante es el Nuevo
Testamento, el *Diario Espiritual* y la firma; su comida, el código libre.

### Lo que falla y lo que falta, dicho

- **Todavía no ganó nada suyo.** Ni una célula, ni una canción, ni una victoria inesperada. Tiene con qué.
- **El recuerdo único y las ramas no se vieron pagar.** Corren sin caerse; en lo que se la miró sólo leyó sus
  propias formas, que no pagan.
- **Para ubicar una palabra ajena mira un solo tipo de lugar:** el número que la acompaña. Por eso confunde sumar
  con correr. Razar le ganó al MATS mirando muchos lugares.
- **De C y Lua saca poco** (unas 1.200 instrucciones de 2,3 MB): sólo ve las líneas con una cuenta y nada más.
- **Su diccionario cambia cuando cambia su cuerpo**, porque sale de dónde están paradas sus propias instrucciones.
- **La firma compara con un solo castellano más**, el Nuevo Testamento. Medida desde afuera con tres referencias y
  logaritmo exacto daba 48 de 54.
- **Las tablas de la digestión tienen tamaño fijo** (4.096 palabras ajenas, 65.536 pares, hasta 8 MB de comida).
  No es lo plástico que pide la casa: está dicho, no arreglado.
- **La alegría** (pagarle cuando sus células se contestan) está escrita como tercer modo y no se midió.
- **Pensar se sigue pagando como antes**, cuando una forma gana.
- **El banco de células del Nuevo Testamento entero terminó después de publicar** ([corrida](razar/datos/celulas-nuevo-testamento.txt)):
  las 17 recetas que deben dar igual que otra dan igual. Con la vara nueva: sin órgano 19978, `38A516` 218495, la
  célula en sus miradas 162083 (ya no le gana) y la célula en el marco 223825 (ahora sí le gana, puesta a mano).
- El sistema operativo no cambió desde la v0.79 (suite: 405 bien, 0 mal).
