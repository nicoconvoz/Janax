# Razar lee un libro

Pedido del Capitán (2026-11-06): *"veamos qué tanto puede aprender si le pasamos un libro"*. El libro es su Nuevo
Testamento (`E:/proyectos/razar/feed/nuevo-testamento.txt`, 973 KB). **El texto no entra al repositorio**: parece El
Libro del Pueblo de Dios, que tiene derechos de autor; Razar ya lo deja fuera de git y acá se hace lo mismo. Janax lo
lee de su carpeta de archivos con la etiqueta `libro`.

Programa: `razar/lectura/lector.jsm` (+ `lector.datos.jsm`). Todo en Janax.

## Qué hace

- **Dos lecturas.** La primera solo cuenta, así cada tabla nace a la medida del libro (la menor potencia de dos con el
  doble de lugares de los que podría necesitar). La segunda le da un número a cada palabra, por orden de aparición, y
  el libro queda como una fila de números. El renglón (la línea del archivo) es la palabra 0.
- **Palabra** = letras seguidas: a–z, A–Z en minúscula y las letras de U+00C0–U+00FF (tildes, eñe, diéresis; las
  mayúsculas, en minúscula). Cualquier otra cosa corta la palabra; el salto de línea también corta el renglón.
- **Uno de cada K renglones queda aparte para la prueba** (K = 10: criterio, no medición). Aprende solo del resto:
  cuántas veces leyó cada palabra y cuántas veces cada palabra vino justo después de cada otra (sus pares).
- **La prueba:** en cada renglón que nunca leyó se tapa cada palabra por turno y tiene que decirla, viendo el resto
  del renglón. Tres maneras, sobre las mismas palabras tapadas:
  - **eco**: siempre la palabra que más leyó (el modelo nulo: lo que dice sin mirar el lugar).
  - **izquierda**: la palabra que más veces vino después de la anterior.
  - **dos lados**: entre las que vinieron después de la anterior, la que mejor explica los dos lados:
    C(p,x) · C(x,n) / C(x).
  - Los empates van a la palabra vista primero. Si el lugar no le da nada, calla. Una palabra que nunca leyó cuenta
    como preguntada y errada en las tres.

## Medición (2026-11-06)

```
lector: palabras=167963 distintas=11771 renglones=7976 prueba=1/10
tapadas=17018 nunca vistas=604
eco 825 (4,8%) | izquierda 2589 (15,2%) calla 590 | dos lados 4834 (28,4%) calla 2273
```

- Idéntico en los tres motores (intérprete, rutinas, traductor): huella `0000306E9BCC1AA6`.
- **0,9 s el libro entero** en el traductor (`JANAX_CAMBIO=24`).
- El azar puro sería 1 en 11.771 (0,008 %). Decir siempre la palabra más común da 4,8 %. Mirar la palabra anterior
  lo triplica (15,2 %); mirar los dos lados casi lo sextuplica (28,4 %), aunque calla en el 13 %.
- El 3,5 % de las palabras tapadas nunca las leyó: ese es el techo de lo que se puede adivinar copiando.

## Lo que esto es y lo que no

Es un modelo de pares (bigramas) con prueba de completar el hueco: la vara clásica de "cuánto aprende de un texto".
Su mérito es la medición honesta (renglones nunca vistos, modelo nulo al lado), no la inteligencia: no generaliza
más allá de los pares que vio. **No usa todavía el cubo ni los mecanismos de Razar** (P36, gemelos, puertas): es la
línea de base contra la que se van a medir.

# El pulso: una sola regla (2026-11-06)

El Capitán pidió una regla súper general, sin perillas ni parches, que mezcle la armonía, la negación, los gemelos y
las puertas. La destilada:

> **Todo es lo mismo con una diferencia. Lo común se guarda una vez; la diferencia que se repite entre muchos pares
> se vuelve una pieza propia. Entra si así todo se dice con menos, comprobado en lo que todavía no leyó.**

Y el generador es del Capitán: **lo sincrónico y lo asincrónico**. Cada cosa leída deja un pedido dormido colgado de lo
que tiene en común (la cosa con un hueco); cuando el texto trae algo que llena el mismo hueco, despierta el pulso. No
se busca nada: solo trabaja lo que el texto trae, cuando lo trae.

Programa: `razar/lectura/pulso.jsm`. La lectura del libro pasó a `razar/lectura/lectura.inc`, compartida con el lector
(que sigue dando idéntico, huella `0000306E9BCC1AA6`). `armar.sh` ahora lleva también los `.inc` de `razar/`.

## Los tres pisos (la diferencia es siempre una pieza del piso de abajo)

| Piso | El pedido (lo común, con un hueco) | Lo llena | Nace |
|---|---|---|---|
| letras | la palabra con una letra de hueco | la letra | gemelos |
| palabras | cuatro seguidas sin una de las del medio; tres seguidas dichas | una palabra, o nada | interruptores (se saca), asociados (otra en el mismo lugar) |
| pares | dos palabras con dos en el medio, el par sin orden | las dos del medio y qué lado fue primero | puertas (el mismo par, otro camino; dado vuelta o no) |

Una forma cuenta una vez. Aprende de los renglones que no apartó; después los apartados golpean los pedidos sin escribir
nada, y cada pulso se compara con las piezas ya nacidas. **Pieza = diferencia nacida en dos pares o más** (la regla de
la anécdota; que cada pieza pague lo que cuesta es el paso que sigue). Ventanas de tres y cuatro palabras: criterio.

## Medición, Nuevo Testamento (1,2 s, idéntico en los tres motores, huella `0000021EE9AE1940`)

```
pedidos=454691
gemelos:       pulsos=3107  diferencias=190   | lo no leído: 210 pulsos, 98,5 % con pieza nacida
               a/o 631, a/e 310, n/s 184, n/r 170, e/o 130 ...
interruptores: pulsos=11928 diferencias=2903  | lo no leído: 2378, 79,6 %
               y 518, que 337, no 308, a 198, de 193, lo 172, ustedes 169 ...
asociados:     pulsos=20751 diferencias=16485 | lo no leído: 3844, 23,1 %
               de/a 65, la/su 53, y/que 41, sus/los 40, dijo/respondió 38, le/les 37 ...
puertas:       pulsos=48653 diferencias=48259 | lo no leído: 7385, 1,3 %
               le dijo / le respondió 9, a la / a su 8 ...  hijo de / padre de (dado vuelta) 3
```

Lo que salió solo, sin decirle nada:

- **a/o** es la diferencia más repetida entre gemelos: el género, lo mismo que encontró el P44 en C.
- **"no"** sale como interruptor, tercero, detrás de "y" y "que": el mismo empate que el D124 de Razar.
- **la/su** y **sus/los** como asociados: el dueño que reemplaza al artículo (el tejido del P38); **dijo/respondió**.
- **"hijo de / padre de (dado vuelta)"** nace como puerta dada vuelta, con 3 pares: es la que más pares tiene entre
  las dadas vuelta, **empatada con ruido** ("todos los / se acercaron", "tú eres / sumo sacerdote").

Lo que todavía no es:

- **Sin línea de base.** El "98,5 % con pieza nacida" no dice nada sin la cifra del azar del mismo lugar (a/o es
  muy común). Falta la versión ciega.
- **Sin el juez de la armonía.** La regla de la anécdota deja entrar el ruido: "no" no se separa de "y", y la puerta
  de padre/hijo empata con basura. El paso que sigue es que cada pieza entre solo si paga en bits lo que cuesta,
  comprobado en lo no leído.

## El juez de la armonía y la línea de base (2026-11-06)

**El juez (D39, decir lo mismo con menos), sin perillas:** en su piso, con N pulsos, U llenados distintos y c(f) los
pulsos en que participó el llenado f, los n pares de la diferencia (a, b) ahorran `n · log2(2N·n / (c(a)·c(b)))` bits
(lo que saber a dice de b, por par); nombrar la pieza cuesta `2 · log2(U)`. Es pieza si ahorra más de lo que cuesta.
Un llenado que hace mucho otro trabajo (participa en muchos pulsos) vale menos como pieza: es la propiedad 4 del "no"
en Razar ("sobre todo la puerta"), y no se escribió en ningún lado. log2 en punto fijo de 16 bits (`lg16`).

**La línea de base:** cada pulso de los renglones apartados se prueba también contra uno ciego: el mismo llenado que
espera, contra el que llegó justo antes en ese piso. Si las piezas explican lo real igual que lo ciego, no aprendieron.

Nuevo Testamento, 1,2 s, idéntico en los tres motores (huella `0000DCC8104E7343`):

| Clase | Diferencias | Piezas | Lo no leído explicado | Ciego |
|---|---|---|---|---|
| gemelos | 190 | 54 | **86,6 %** | 22,0 % |
| interruptores | 2.903 | 62 | **43,7 %** | 30,4 % |
| asociados | 16.485 | 247 | **9,1 %** | 3,2 % |
| puertas | 48.259 | 21 | 0,2 % (17) | 0,0 % (0) |

Las que más bits ahorran:

- gemelos: **a/o** 1.416 bits, a/e, n/s, n/r, á/é, é/ó.
- interruptores: y 641, **no 445** (sube al segundo lugar, por encima de "que"), que, todos, también.
- asociados: **la/su**, sus/los, de/a, **dijo/respondió**, le/les, la/una, los/aquellos, su/mi.
- puertas: **le dijo / le respondió**, a sus / a los, a la / a su, **cinco mil / cuatro mil**, **comenzó a / empezó a**.

Qué cambió con el juez:

- **El ruido se fue.** De 48.259 diferencias de puertas quedan 21 piezas, y ninguna es basura del tipo
  "todos los / se acercaron". Las 21 explican 17 pulsos de lo no leído; las ciegas, 0.
- **"no" se despega de "que"** y queda segundo; "y" sigue primero (la conjunción también se puede sacar en muchas
  frases: el juez no la descarta, y está bien que no lo haga a mano).
- **"hijo de / padre de (dado vuelta)" no pasa el juez**: 3 pares no pagan lo que cuesta nombrar la pieza entre ~48 mil
  llenados. Es honesto: el Nuevo Testamento no tiene suficientes genealogías dichas de las dos formas. El Antiguo,
  con sus genealogías largas, es la prueba que sigue.
- En los cuatro pisos las piezas explican lo no leído más que las ciegas: 3,9× en gemelos, 1,4× en interruptores,
  2,8× en asociados.

# Preguntarle con una melodía (2026-11-06)

Pedido del Capitán: *"dale de comer todo el Nuevo Testamento y preguntale con una melodía algo sobre lo que está
escrito; no una respuesta literal, una que tenga que inferir"*.

Programa: `razar/lectura/pregunta.jsm`. Lee el libro entero y lo dicho queda como pedidos con un hueco, igual que en el
pulso: cada dos palabras con una a tres en el medio ("isaac padre de jacob") cuelgan "? padre de jacob" (lo llena
isaac) e "isaac padre de ?" (lo llena jacob): 728.996 hechos. La pregunta es una melodía con huecos, una por renglón
del archivo `q`, y se corta en los mismos pedidos. **Pensar es caminar** (Razar, P47): un pedido con un extremo
conocido se contesta con lo que lo llena, y eso llena el hueco siguiente. Cada respuesta guarda su camino; escribe la
melodía llena y dice si el libro la dice así, palabra por palabra, o no (inferida: juntó cosas dichas por separado).
Si un paso nunca se dijo en la forma preguntada, el hueco queda vacío y dice que no sabe: no inventa.

Para leer lectura.inc aprendió a leer una pregunta (PASS 2: "?" es un hueco; una palabra que el libro no tiene es -2).
El lector y el pulso siguen dando idéntico.

## Lo que contestó (0,5 s, idéntico en los tres motores, huella `000083336D714680`)

```
? padre de ? padre de judá               -> isaac padre de jacob padre de judá      (inferido)
                                         -> matán padre de jacob padre de judá      (inferido)
? padre de ? padre de ? padre de salmón  -> aram padre de aminadab padre de naasón padre de salmón (inferido)
roboam padre de ? padre de ? padre de ?  -> roboam padre de abías padre de asá padre de josafat   (inferido)
jacob hijo de ? hijo de ?                -> jacob hijo de isaac hijo de abraham     (inferido)
? padre de ? padre de isaac              -> no lo sabe
? padre de marciano                      -> no conoce una de sus palabras
```

- **El abuelo, el bisabuelo, el bisnieto**: ninguno está escrito. El libro dice "Isaac, padre de Jacob; Jacob, padre
  de Judá" (con Jacob repetido), y Razar encadena. Lucas dice "Jacob, hijo de Isaac; Isaac, hijo de Abraham": también
  repite, así que "jacob hijo de isaac hijo de abraham" no está tal cual (verificado en el texto).
- **Matán: un error honesto e interesante.** Hay **dos Jacob** en el libro: el hijo de Isaac y el padre de José
  ("Matán, padre de Jacob"). Razar conoce a la gente por cómo se escribe su nombre, así que los junta. Es la
  identidad del P37 que todavía no está: saber que un nombre puede ser dos personas.
- **"? padre de ? padre de isaac" no lo sabe**, y es correcto que no lo sepa así: el libro dice "Abraham **fue**
  padre de Isaac" (otra forma: tres palabras en el medio) y "Isaac, **hijo** de Abraham" (la puerta dada vuelta, que
  con 3 pares no pagó en el juez). Contestaría si las piezas "fue" y "padre/hijo dado vuelta" pagaran: el paso que
  sigue es que el camino use las piezas nacidas.

## El camino con las piezas (2026-11-06)

La maquinaria del pulso pasó a `razar/lectura/pulso.inc` (el pulso sigue dando idéntico, `0000DCC8104E7343`) y la
pregunta la usa: aprende las piezas del **libro entero** (ningún renglón apartado) y camina con ellas. Cuando un paso no
está dicho en la forma preguntada prueba, en ese orden, cada **interruptor** que pagó metido en cada lugar del medio
("padre de" oído como "fue padre de") y cada **puerta** que pagó con el medio de la pregunta de un lado (el otro medio
en su lugar, y del otro lado si da vuelta). Lo que se contesta primero guarda su camino, y cada respuesta dice qué pieza
usó.

Nuevo Testamento entero: 68 interruptores y 23 puertas pagan. 1 s, idéntico en los tres motores (`0000E99DE4748558`).

```
pedro le respondió ?   -> pedro le respondió señor      (dicho así en el libro)
                       -> pedro le respondió ananías    (inferido) | con le dijo (en su lugar)
                       -> pedro le respondió tú         (inferido) | con le dijo (en su lugar)  ...
```

Las genealogías no cambian: entre los interruptores que pagan **no está "fue"**, y entre las puertas **no está
padre/hijo**. Por eso "? padre de ? padre de isaac" sigue sin respuesta: el libro lo dice "Abraham fue padre de Isaac" e
"Isaac, hijo de Abraham", y ninguna de las dos piezas pagó acá. Es el texto el que no alcanza, no el camino.

⚠️ **"no" paga como interruptor** (es el primero de la lista). Sacarlo da vuelta el sentido, y el camino todavía no
distingue "fue" (que se puede sacar sin cambiar nada) de "no" (que cambia todo). Es la propiedad 2 del "no" en Razar
("cuando aparece, lo que sigue cambia"), que falta construir. Mientras tanto cada respuesta muestra la pieza que usó: si
un camino pasa por "no (se saca)", se ve.

## La propiedad 2 del "no": medida, y no separa (2026-11-06)

Razar (P54): *"cuando aparece, lo que sigue cambia"*. Construida con la misma regla: cada pedido guarda la palabra que
vino justo después. **La vara**: el mismo pedazo dicho de nuevo sin la pieza, ¿cuántas veces lo que sigue queda igual?
**La pieza**: dicho con ella y sin ella, ¿cuántas? Da vuelta si queda igual menos que la vara y esa diferencia paga en
bits (MDL de una proporción: `n·KL(s/n ‖ vara) − ½·log2 n`). En el camino, un interruptor que da vuelta no se saca.

Nuevo Testamento (pulso `0000CB0536845DD5`, pregunta `0000E99DE4748558`, idéntico en los tres motores):

```
vara: dicho de nuevo, lo que sigue queda igual 10.854 de 36.088 (30,0 %)
y 81/518 (15,6 %) DA VUELTA   no 36/308 (11,7 %) DA VUELTA   que 47/337 (13,9 %) DA VUELTA
todos 23/147 (15,6 %) DA VUELTA   también 28/128 (21,9 %)   de 22/193 (11,4 %) DA VUELTA   lo 14/172 (8,1 %) ...
```

**No separa: 51 de los 62 interruptores "dan vuelta"**, "no" junto con "y", "de", "lo", "jesús". Dos razones, dichas
sin disimular:

1. **La vara está sesgada.** Lo que se dice de nuevo muchas veces es el mismo versículo repetido (los pasajes paralelos
   de los evangelios), y ahí lo que sigue queda igual mucho más que entre dos frases distintas. No mide lo mismo que la
   pieza.
2. **Aun entre interruptores, "no" (11,7 %) queda en el montón**, al lado de "de" (11,4 %), "a" (11,6 %), "se"
   (10,1 %). Es lo mismo que anotó Razar: *"pero que e y hacen lo mismo"*. Una sola palabra después no alcanza para
   ver el "sino que corre".

Efecto en el camino: queda **conservador** (no saca 50 interruptores, "no" entre ellos), pero por una razón que no es
la buena. Las respuestas de las preguntas no cambian. El paso honesto que sigue es medir el cambio en algo más ancho
que una palabra (lo que sigue hasta el fin del renglón, o la puerta cerrada de Razar: lo dicho con "no" es la
negación de lo que se dice casi siempre), y una vara que compare frases distintas, no repeticiones.

# Estudiar lo irregular (2026-11-06)

Regla del Capitán: *"cuando algo siempre es no y aparece un sí, el programa pregunta por qué en este caso sí; y si
siempre da sí y aparece un no, por qué en este caso no. Si lo general es que un perro ladre, ¿por qué en ese caso el
perro no ladró? Estudiá lo irregular y dejá de perseguir lo que se repite."* Es la puerta cerrada de Razar (P54) y su
pregunta.

Cada forma dicha cuenta ahora cuántas veces apareció y dónde (la tabla de formas vistas guarda clave, llenado, veces,
primer lugar y piso). Un lugar dicho de las dos maneras, tal cual y con un interruptor que paga delante, tiene una regla
(la manera que más se dijo) y excepciones: la excepción pregunta **"¿por qué esta vez el interruptor?"** o **"¿por qué
esta vez sin él?"**. Un empate no tiene regla y no pregunta. Se ordenan por los bits con que sorprende la excepción,
`n · log2(N / n)`, y se escriben con el renglón donde pasó.

**Un error mío, encontrado en el camino:** el listado de las diez piezas más fuertes las marcaba poniendo sus bits en
negativo y nunca los devolvía; después de listar, "no", "y", "que" ya no pagaban. Ahora los devuelve.

## Lo que pregunta (Nuevo Testamento entero, 2 s, idéntico en los tres motores, `000065ACD081CBAF`)

Con todos los interruptores que pagan, **manda el pegamento**: "a los que" dicho 117 veces, con "todos" delante 16:
¿por qué esta vez todos? "para que se" / "para que **no** se produzca un tumulto" aparece cuarta. Es lo que anotó
Razar: las preguntas más fuertes son de pegamento.

Con **solo el "no"** de interruptor (una variante de prueba, no guardada: el filtro por la palabra sería declararla), las
preguntas son las de Razar:

```
5 bits | jesús le respondió | dicho así 51, con no 1: ¿por qué esta vez no?
     donde: le hizo muchas preguntas pero jesús no le respondió nada
8 bits | el que cree | dicho así 17, con no 3: ¿por qué esta vez no?
     donde: el que cree en él no es condenado el que no cree ya está condenado ...
8 bits | yo soy el | dicho así 20, con no 3   donde: ... dijo claramente yo no soy el mesías
5 bits | que lo son | dicho así 3, con no 8: ¿por qué esta vez SIN no?
```

**Lo que falta, y es la causa:** el pulso encuentra "las palabras que se pueden sacar" (propiedad 1), no "la negación".
Razar la destiló con cinco propiedades y encontró una sola: *no*. Hay que traer esas cinco a la regla global, para que
el interruptor salga destilado y no declarado; entonces el estudio de lo irregular corre sobre él solo.

# La negación destilada: las cinco de Razar en la regla global (2026-11-06)

Pedido del Capitán: *"primero destilé la negación, eso lo tenés en el Razar antiguo, y te dije que lo metieras en la
regla global"*. Módulo nuevo: `razar/lectura/negacion.inc` (`distill_no`), portado de `rz_lexicon_switches` tal como
Razar lo mide, todo contra el propio libro: (1) se saca y lo que queda está dicho, más que para cualquier palabra; (2)
cuando aparece, lo que sigue cambia, contra las que pasaron la 1; (3) no es cosa nombrada (Razar no la usa: acá
tampoco); (4) la puerta más ancha, muchos delante y muchos actos detrás en ese orden, cortada donde los anchos se
parten en dos; (5) sobre todo la puerta, cortada igual; y lo que está adentro de la puerta de otro ("no la envió") es
lo que se da vuelta, no lo que da vuelta. Reemplaza a la propiedad 2 de una sola palabra, que se sacó.

**La primera corrida dio "hermanos".** El "no" pasaba las cinco, pero quedaba "adentro" de "ya", "yo", "si", porque
"ya, no" se leía "ya no": **nuestro lector tiraba la puntuación**, y Razar la lee como pieza. Medido con una variante
de prueba (la puntuación como pieza): sale **"no", solo**. Arreglado en la raíz con una regla general, no una lista:
en `lectura.inc` **todo carácter que no es letra, dígito ni espacio es una pieza propia** (coma, punto, «», ¿, ¡, raya;
los de varios bytes de UTF-8 enteros), y los dígitos forman palabra con las letras.

## Medición (todo idéntico en los tres motores)

```
negacion destilada (las cinco de Razar): pasan la 1: 906, la 2: 327, puerta ancha: 2, sobre todo la puerta: 1
| interruptores: no
```

- **Estudio de lo irregular sobre el "no" destilado** (pulso, libro entero, `0000DBB0FB65420D`): "el que cree / el que
  no cree, ya está condenado", "yo no soy el mesías", "el sábado ha sido hecho para el hombre, y no el hombre para el
  sábado", "sea que ustedes coman, sea que beban" (¿por qué esta vez **sin** no?). Nadie nombró el "no".
- **Pulso con 1 de cada 10 apartado** (`0000E0E1D4CE3C48`): gemelos 86,6 % contra 22,0 % ciego; interruptores 58,2 %
  contra 40,9 %; asociados 14,7 % contra 6,0 %; puertas 70 contra 0. La coma es ahora el interruptor que más paga.
- **Lector** (`000042AEB68DF6F2`): 200.133 piezas (antes 167.963 palabras); eco 7,0 %, izquierda 18,6 %, dos lados
  34,1 %. **No se compara con el 28,4 % anterior**: ahora también se tapan y adivinan los signos.
- **Pregunta** (`0000FE5D145CE193`): las respuestas buenas siguen (Isaac, Aram, Josafat, Abraham) y ahora dicen por qué:
  "con , (se saca)" — "Isaac, padre de Jacob" leído como "Isaac padre de Jacob". **Pero aparece basura**: un signo
  llena un hueco (", padre de jacob") y piezas como "ustedes" arman "el padre de , padre de judá". Falta saber qué
  llena el hueco de un "¿quién?": una identidad (P37, tipos e identidades), no un signo.

# Que la asociación de pensar surja sola (2026-11-06)

Capitán: *"ya con el no, que es lo más valioso, que el resto se autocomplete con inferencia y lógica… que surja la
asociación de pensar, por su cuenta, no por nosotros"*.

Con la misma regla: la excepción ya es "lo mismo con una diferencia" (el lugar, con y sin "no"). **El porqué es otra
diferencia que viaja con esa**: lo que está en el renglón de la excepción y **nunca** estuvo en los renglones donde se
dijo como siempre. Nadie le dice qué buscar; el pegamento se cae solo, porque también está en los renglones de la regla.
Y si una misma diferencia acompaña a muchas excepciones distintas, nace una **asociación**, encontrada por él: las
preguntas pasan a ser material, y la regla las vuelve a mirar (el piso sube). **La vara**: lo mismo con un renglón de la
regla en lugar de la excepción (ciego). Asociación = acompaña a dos excepciones o más, y a más que en lo ciego.

Para cada pregunta busca todas las veces que el libro dice el lugar (tal cual, y con el "no" delante en cualquiera de los
dos lugares del medio), la mayoría es la regla, y lo que tienen las excepciones que la regla nunca tuvo es su "cerca".

## Lo que surgió (Nuevo Testamento entero, 2,6 s, idéntico en los tres motores, `00009AE13D084B10`)

```
asociaciones que surgieron (de 354 excepciones; en cuántas / en cuántas ciegas):
no(85/0) ni(34/7) sino(36/17) dios(25/9) sus(29/17) porque(30/18) los(25/13) qué(17/5) son(20/8) ve(13/1)
puede(13/2) más(18/7) o(14/3) por(30/20) ?(20/10)
```

- **"ni"** (34 contra 7): la hermana del "no", encontrada sola, partiendo solo del "no".
- **"sino"** (36 contra 17): el "no ladra, **sino** que corre" de la propiedad 2 de Razar, que una palabra de distancia
  no veía, aparece acá como asociación.
- **"o"**, **"qué"**, **"puede"**: la disyunción, la pregunta, lo posible, junto al "no" que sorprende.
- "no" mismo (85/0) es circular: el renglón de la excepción tiene el "no" por construcción. Se ve y se dice.

Cada pregunta trae ahora su "cerca" (con `*` las palabras que son asociación). Ejemplo: "para que se / para que no se
produzca un tumulto": cerca *decían *hagamos *durante *fiesta *tumulto *pueblo…

Lo que todavía no es: el "cerca" de una pregunta con muchas excepciones junta muchos renglones y se vuelve largo; la
asociación se mide contra una sola vara ciega por pregunta; y todavía no **contesta** la pregunta: junta los candidatos
a porqué y las asociaciones que se repiten, pero no elige uno.

# El juez en bits, conectado a todo (2026-11-06)

El Capitán: *"que conteste… y fijate: el juez en bits ya está hecho y medido desde el MODO 6, solo desconectado. Hay
cuatro cosas colgando de él"*. Ahora todo lo decide la misma vara, D39 (describir lo mismo con menos), con el modelo
nulo de MDL (si nada paga, calla). `lg16` pasó a `lectura.inc` (lo usan los tres programas). Idéntico en los tres
motores: lector `00005225BB82FE6D`, pulso (libro entero) `000087EBFEB63633`, pregunta `0000E78A9442B1C1`.

**1. ¿La coma ganó por categoría o por frecuencia? Por frecuencia.** Cada pieza muestra ahora sus bits por par. La coma
dice 1,45 bits por par, como "no" (1,42), y menos que "»" (1,77) o "?" (1,56): gana solo porque tiene 1.237 pares. Las
que dicen mucho por par son otras: á/é 5,8, la/su 5,4, «/" 6,4, ': « / : "' 6,8.

**2. Que conteste su porqué.** La asociación ahora también la decide el juez (antes: "dos excepciones y más que lo
ciego"): si una palabra está en cada una de las excepciones se codifica con su propia tasa contra la tasa de lo ciego
(Krichevsky–Trofimov, (ciegas + ½)/(N + 1)), su tasa paga ½·log2 N. La respuesta de cada pregunta es el porqué que más
bits ahorra; si ninguno paga, "no sé". En las 20 más fuertes contesta 17 y calla 3. **Lo que contesta, honesto:**
casi siempre compañeros del "no" ("ni", 33 bits; "sino", "o", "puede", "acaso"), no causas: encontró que el "no" que
sorprende viene con otras negaciones y posibilidades. Es cierto, y todavía no es "porque era Herodes".

**3. ¿Padre/hijo le gana a la basura por goleada? No.** Cada paso de una respuesta vale lo que su llenado dice ahí más
allá de lo que dice en todo el libro, `log2((dicho así / el pedido dicho) / (el llenado / el libro))`, y cada pieza
usada paga su nombre entre todas (`log2(139)` = 7,1 bits). Ordenadas por bits, la buena va primero (Aram 26,6; Josafat
28,0), pero **sin goleada**: Isaac 10,9 contra 9,6 de la basura con coma, que una vez adentro de la cadena trae hechos
de verdad. Y Matán (14,3) le gana a Isaac: los dos Jacob siguen mezclados.
**¿La puerta paga? Acá no:** las respuestas por "le dijo / le respondió" caen bajo cero al pagar el nombre de la pieza;
queda solo lo dicho tal cual.

**4. ¿La abstención sirve en el lector? No.** Código de dos partes (acertó o no, y si no, la palabra con el código sin
modelo `log2((leídas + conocidas)/(veces + 1))`), por palabra tapada:

```
sin modelo 8,89 bits | contestando siempre (callado: el eco) 7,50 | callando cuando no sabe 7,95
```

Volver a la palabra más común recupera aciertos baratos; callar los tira.

# Antes de lo irregular, la silueta de todo lo regular (2026-11-06)

El Capitán: *"antes de notar lo irregular tenés que entender la silueta de todo lo regular"*. La respuesta anterior
comparaba la excepción solo contra los renglones donde el lugar se dijo como siempre, y por eso contestaba "ni",
"sino": compañeros de **cualquier** "no", parte de su silueta de siempre.

Ahora la silueta de lo regular tiene dos pisos:

1. **La del lugar**: en cuántos de los renglones de la regla está cada pieza.
2. **La del interruptor**: en cuántos de los renglones con un "no" (en todo el libro) está cada pieza.

Lo irregular es lo que el renglón de la excepción trae **por encima de las dos**: la sorpresa de cada pieza es
`−log2((k + ½)/(n + 1))` contra la más generosa de las dos siluetas (estimador de Krichevsky–Trofimov), menos
`log2(candidatas)` por nombrar una. Contesta con las tres que más sorprenden si pagan; si nada paga, "no sé".

## Lo que contesta (libro entero, 3,3 s, idéntico en los tres motores, `0000539D89845BF6`)

- "para que sus ojos **no** vean, y sus oídos no oigan…": **endurecido, tapados, cerrado**. "El corazón de este pueblo
  se ha endurecido": es la causa.
- "el sábado ha sido hecho para el hombre, y **no** el hombre para el sábado": **agregó, jefe, sinagoga** (el jefe de
  la sinagoga, indignado, que provoca la respuesta).
- "el que se casa hace bien; pero el que **no** se casa": ocupa, suyos, conviven.
- De las 20 más fuertes contesta 6 y dice **"no sé" en 14**.

Los compañeros del "no" desaparecieron de las respuestas: eran lo regular de cualquier negación.

Lo que todavía no es:

- **Empates**: todas las piezas que nunca estuvieron en ninguna silueta sorprenden igual, y gana la primera del renglón
  ("endurecido, tapados, cerrado" valen lo mismo, 0,21 bits). No distingue entre lo igualmente irregular.
- **Bits chicos**: la silueta del lugar tiene pocos renglones (la regla de un lugar es corta), así que la sorpresa
  posible es chica y nombrar una candidata entre muchas cuesta casi lo mismo. Por eso calla tanto.
- El "cerca" es solo el renglón; Razar miraba también el de cada lado.

# La pregunta nace de la sorpresa; la respuesta, de lo regular (2026-11-06)

El Capitán: *"la respuesta no debe basarse en la sorpresa, pero la pregunta no puede faltar en la sorpresa"*; *"y
quiero que pueda preguntarse hasta incluso algo evidente… retórica"*.

- **La pregunta** sigue saliendo de lo irregular (las excepciones, ordenadas por los bits de su sorpresa).
- **La pregunta retórica**: cada pregunta trae también la de lo evidente, y la contesta su propia regla: "(retórica) ¿y
  por qué casi siempre sin no? porque así se dijo 39 de 47 veces: lo regular se contesta solo".
- **La respuesta** sale de lo regular (`c_regular`): una pieza del renglón de la excepción responde si, **en el resto
  del libro** (ese renglón afuera), anda con el interruptor más que el libro en general (para "¿por qué esta vez no?"),
  o menos (para "¿por qué esta vez sin no?"). Lo mide el juez: su presencia junto al interruptor, codificada con su tasa
  propia contra la del libro, su tasa paga ½·log2 n, y nombrarla entre las candidatas paga log2(candidatas). **La
  diferencia por la que se pregunta nunca es su propia respuesta** (el interruptor queda afuera): la primera corrida
  contestaba "por no", con 4.035 bits.

Se sacó la silueta del lugar palabra por palabra (servía a la respuesta por sorpresa); quedan las siluetas del libro:
en cuántos renglones está cada pieza, y en cuántos con un interruptor.

## Lo que contesta (libro entero, idéntico en los tres motores, `00009DAEE2B7C681`)

```
para que se / para que no se produzca un tumulto: por sino (404 bits); también ni, nada
el que cree / el que no cree:                      por porque (75 bits); también que, puede
, y el / y no el hombre para el sábado:            por pero (84 bits); también porque, son
```

Contesta con **los conectores que el libro repite alrededor de toda negación**: "sino" (la corrección: no esto, sino
aquello), "porque" (la razón), "pero" (el contraste), "ni", "nada". Encontró solo **la forma lógica de la negación en este
libro**. No es todavía la causa del caso, pero **señala la puerta donde vive la causa**: lo que viene después de ese
"porque" o de ese "sino". El paso que sigue es seguir esa puerta: que la respuesta sea lo que el conector regular trae.

# Seguir la puerta (2026-11-06)

La respuesta regular era un conector ("sino", "porque", "pero", "ni"): la puerta donde vive la causa. Ahora la sigue
(`q_follow`): en los renglones de las excepciones, en orden, busca ese conector (después de la excepción, o antes en su
renglón) y la respuesta es **lo que trae, hasta el primer signo**, donde el propio libro corta la frase (como Razar,
que cortaba "donde las marcas del libro lo parten"). Un signo es una pieza cuyo primer byte no es letra ni dígito: la
misma regla con que el lector los cortó.

## Lo que trae (libro entero, idéntico en los tres motores, `00003B471FF8590E`)

```
el que no cree                       -> porque no ha creído en el nombre del hijo único de dios
yo no soy el mesías                  -> sino que dijo claramente
los que no están sometidos a la ley  -> porque estoy sometido a la ley de cristo
el que no tiene el espíritu          -> sino por el espíritu
no te es lícito (el mismo lugar)     -> sino hasta setenta veces siete
y no el hombre para el sábado        -> pero el jefe de la sinagoga
```

Lo que todavía no es:

- A veces la puerta trae poco: "ni alforja", "ni siquiera uno", o nada ("porque" seguido de un signo).
- El conector se elige por lo que el libro repite, no por lo que este caso necesita: "porque" trae la razón, "sino" la
  corrección, "pero" el contraste, y todavía no distingue cuál de las tres pide la pregunta.
- La cláusula puede estar en otra excepción del mismo lugar, no en la primera; se dice cuál con "lo que trae", pero no
  se muestra su renglón.

# Cimientos y muebles (2026-11-06)

Idea del Capitán: *"dos estructuras núcleos que expliquen un objeto o una acción, y pegamento, la estructura que le da
sentido a los núcleos… dos significados, uno estructural y otro de sentido: los cimientos y los muebles dentro de una
casa"*.

Sale de la regla única, sin lista de palabras: en cada pulso "el mismo lugar, otra palabra" (asociados), **lo que quedó
fijo es cimiento y lo que cambió es mueble**. Cada pieza junta sus veces fija y sus veces cambiada (`pulso.inc`: los tres
del marco y los dos llenados), y el juez la pone de un lado contra la vara del propio libro (el 60 % de lo que entra en
un pulso queda fijo): su parte fija codificada con su propia tasa contra la del libro, su tasa paga ½·log2 n. Si no
paga, no es de ningún lado todavía. Las puertas no entran: ahí es al revés (los extremos son muebles, el medio cimiento).

Libro entero, idéntico en los tres motores (`00009A7598008FC6`; la pregunta no cambia, `0000E78A9442B1C1`):

```
cimientos 170:  , de la a que el . los y en se : del las no
muebles 7.597:  casa josé partida magos cielos tierra gente zará multitud madre transjordania barca hombres santiago
```

El "no" cae en los cimientos: es estructura, no mueble. La puntuación, también.

Lo que sigue: que la lógica use la casa. La analogía solo entre muebles que llenan el mismo hueco del mismo cimiento;
el cimiento nunca es prueba; una deducción conserva el cimiento y cambia un mueble, y el "no" la puede refutar.

## El borde de la casa, chequeado y decidido en vueltas (2026-11-06)

Chequeo del Capitán (validación, no supervisión: la lista no se la dimos): ¿están en los cimientos *pero, sino, porque,
con, por, para, su, se, como, cuando*? En la primera versión, **con, por, para, su, se, como** sí; **pero** por un bit;
**porque** y **cuando** sin decidir; **sino** del lado de los muebles (−2 bits). Causa: los conectores se reemplazan
entre ellos en el mismo marco, y la regla contaba ese cambio como mueble.

Regla general (no una lista): **la casa se decide de a vueltas, hasta que no se mueve** (Razar, "el piso sube cuando deja
de moverse"). Cada pulso "mismo lugar, otra palabra" queda guardado con su marco y sus dos llenados (`pulso.inc`), y en
cada vuelta se vuelve a contar: el marco es cimiento; los dos llenados son mueble, **salvo que los dos ya fueran
cimiento en la vuelta anterior**: una puerta cambiada por otra puerta sigue siendo la casa. Termina cuando ninguna
palabra cambia de lado.

Libro entero, idéntico en los tres motores (`0000B4542B066905`; la pregunta no cambia): **3 vueltas**, fijo en el libro
63,6 %, 169 cimientos y 7.756 muebles.

| palabra | antes | en vueltas |
|---|---|---|
| pero | 1 bit | **57 bits, cimiento** |
| con, por, para, su, se, como | cimientos | más firmes (su 270 → 791) |
| porque, cuando | sin decidir | **siguen sin decidir** |
| sino | mueble (−2) | **mueble (−12)** |

**Lo que no se arregló, y la sospecha (sin verificar todavía):** "porque", "cuando" y "sino" no bajaron sus veces de
cambio: no se cambian por cimientos sino por palabras que no lo son. Abren una frase ("…, porque dijo" / "…, Jesús
dijo"), y en ese lugar de la ventana de tres palabras entran también muebles. Para comprobarlo hay que mirar con qué se
reemplaza cada uno.

# El esqueleto de la oración (2026-11-06) — reemplazado: clasificación por votos, ver "El significado por lógica"

El Capitán, con un ejemplo: *"el niño se cayó porque no miró / el hombre miró porque estaba arriba / la niña tembló
porque tenía miedo: el + porque / el + porque / la + porque. Se reconoce en la estructura aunque hayan cambiado los
muebles"*. Y: *"lo único que cambian son los muebles; se pueden repetir las estructuras, pero los muebles varían"*.

Lo que fallaba: el pulso compara de a **una** diferencia en ventanas de tres o cuatro palabras, y en ese ejemplo cambian
varias a la vez. "porque" nunca aparecía como lo que queda mientras todo lo demás cambia; y cuando se cambiaba por
"cuando" lo contaba como mueble. (Un intento intermedio, "es mueble solo si cambia por un mueble", **no convergía**:
oscilaba y la vuelta no paraba nunca; se descartó.)

**El esqueleto** (`skel_report`): el de cada lugar son las dos piezas de antes y las dos de después, los cimientos (la
casa) tal cual, los muebles como huecos y el fin de renglón como tal. El mismo esqueleto vuelve en todo el libro con otras
cosas adentro. **Lo que llena un lugar es mueble si sigue siendo otra cosa cada vez (abierto), y estructura si son siempre
los mismos pocos (cerrado: una puerta cambiada por otra puerta).** Cada esqueleto mide qué tan abierto es (llenados
distintos sobre todos), cada palabra el promedio de los lugares que llena, y el corte lo pone la división óptima del libro
(la de Razar), sin número a mano.

Libro entero, idéntico en los tres motores (`0000730935070642`): corte en 69,7 % de apertura.

| palabra | apertura | lado |
|---|---|---|
| porque | 39,9 % | estructura (en la casa: sin decidir) |
| cuando | 41,3 % | estructura (en la casa: sin decidir) |
| pero | 41,7 % | estructura |
| sino | 48,2 % | estructura (en la casa: mueble) |
| con, por, para, su, se, como | 35–49 % | estructura |
| niño | 70,5 % | mueble |

**Lo que no cierra todavía:** hombre (68,3 %), dios (60,1 %) y jesús (47,5 %) también caen como estructura, y quedan
2.703 cerradas contra 3.746 abiertas, demasiadas para ser los cimientos. Un nombre muy frecuente **se adueña de su
lugar** ("_ les dijo :" es casi siempre Jesús) y el lugar parece cerrado. Las dos miradas se complementan: la casa acierta
con los nombres, el esqueleto con los conectores.

Nota de oficio: los textos de cada programa viven en el comienzo de su sala 0 y tienen que terminar antes de 1000h,
donde empiezan las variables; los de este paso se pusieron en lugares que quedaron libres.

## Las dos miradas juntas: sos lo que son tus hermanos (2026-11-06) — reemplazado: clasificación por votos, ver "El significado por lógica"

`kin_report`: la estructura arranca con los cimientos de la casa; una palabra que todavía no lo es pasa a serlo cuando
**la mayoría de sus hermanos** (los otros que llenan sus mismos lugares en los esqueletos) son estructura. Solo se agrega,
nunca se saca: termina seguro (la regla anterior que oscilaba no tenía esa garantía).

**Primera versión: se tragó todo.** Contando los hermanos por veces, en 13 vueltas 10.173 palabras eran estructura: en casi
cualquier lugar los hermanos más frecuentes son cimientos ("de", "la"), y la mayoría por veces arrastró todo en cascada.
**Corregido: los hermanos se cuentan por quiénes son, no por cuántas veces** (cada llenado distinto una vez, con una marca
de la vuelta en su forma).

Libro entero, idéntico en los tres motores (`0000BA3EBB3EEE29`): **4 vueltas, 699 palabras de estructura**. Las 50 más
vistas: `, de . que y a la el los en : no se lo por « » su con al para del es un les las ¿ ? le pero sus una ; como me mi
ha más ! qué había te sobre tu nos han sin ser he sido`.

| | casa | esqueleto | juntas |
|---|---|---|---|
| jesús, dios, ustedes, él | mueble | estructura | **mueble** |
| casa, padre, niño, hombre | mueble | mueble / estructura | **mueble** |
| pero, con, por, para, su, se, como | estructura | estructura | **estructura** |
| porque, cuando, sino | sin decidir / mueble | estructura | **mueble** |

**Lo que no cierra:** "porque", "cuando" y "sino" **abren una frase**; ese lugar ("…, _ no…") lo comparten con muchas
palabras distintas (una frase empieza con casi cualquier cosa). Las tres miradas ven dos o tres piezas de cada lado, y desde
ahí un conector que abre una frase y un sustantivo que la empieza se ven iguales. Lo que los separa está a otra escala y ya
está en Razar: **la puerta ancha** (propiedad 4 del "no"): muchos distintos delante y muchos actos detrás, en ese orden.

# El significado por lógica, no por votos (2026-11-06)

El Capitán, después de ver que las tres miradas anteriores no separaban "porque" de un sustantivo: *"primero separás el
esqueleto y le das un significado, y al o los núcleos les das un significado, y luego ves cuál es el significado
estructural que le da sentido al significado nuclear"*. Y: *"razonamiento artificial, no estadístico"*.

**Corrección de rumbo.** La casa en vueltas, la apertura del esqueleto y "sos lo que son tus hermanos" clasificaban cada
palabra **por mayoría de votos** (cuántas veces fija, qué tan abierto su lugar, qué son sus hermanos). Eso es estadística
con otro nombre, y por eso no cerraba. Quedan como historia y como insumo (la casa sigue diciendo qué es cimiento para
encontrar los núcleos), pero **la clasificación por votos queda reemplazada** por lo de abajo.

## Los límites del edificio (ley general, sin lista de signos)

*"Una oración comienza con una mayúscula y termina con un punto… un nuevo edificio solo nace después de una
puntuación."* El lector anota, para cada unidad, si empezaba con mayúscula (`ROOMCP`, en `lectura.inc`). Un signo
**cierra un edificio si la mayoría de las veces la palabra que sigue empieza con mayúscula** (`limits`); el libro lo
decide, no nosotros. Sale: `: . « » " ¿ ? ¡ ! [ (`. La coma **no** cierra, aunque es el signo más común. Los que abren
(«, ¿, ¡) también son límite: marcan dónde empieza el edificio nuevo. Ningún esqueleto cruza un límite.

## Esqueleto, núcleos y el sentido entre ellos (`sentido.jsm`)

- **Núcleo**: lo que no es signo, ni interruptor, ni cimiento de la casa. **Esqueleto**: lo que queda en el medio
  entre dos núcleos dentro del mismo edificio ("_ , hijo de _").
- **El significado del esqueleto se prueba, no se cuenta**: cada propiedad necesita al menos dos casos del libro.
  - *se encadena*: A–B y B–C con el mismo esqueleto;
  - *simétrica*: A–B y B–A;
  - *se niega*: el mismo par con el "no" destilado adentro; *dicho y negado a la vez*: las dos cosas;
  - *dado vuelta es*: el par aparece al revés en otro esqueleto **sin un solo contraejemplo**, y los dos esqueletos
    cumplen la **ley de la puerta**: el mismo esqueleto con exactamente una pieza distinta, de dos piezas o más
    ("hijo de" / "padre de"). Esto barrió las conversas basura que venían por pegamentos de una pieza;
  - *es lo mismo que*: los mismos pares en los dos ("a la" ≈ "a su", "a los" ≈ "a sus", "en la" ≈ "en su").
- **El significado del núcleo** son los hechos en los que está. **La deducción** es el hecho dado vuelta que el libro no
  dice, con su porqué.

Libro entero, idéntico en los tres motores (`0000CEFFCA00FDBB`; pregunta y lector no cambian: `0000E78A9442B1C1`,
`00005225BB82FE6D`): 34.218 esqueletos, 91.853 pares, 2.380 negados.

```
deduce: abraham "_ , padre de _" isaac   (porque "_ , hijo de _"  dado vuelta es "_ , padre de _" )
deduce: jacob "_ , hijo de _" matán     (porque "_ , padre de _"  dado vuelta es "_ , hijo de _" )
```

**Lo que no cierra:** pasan la ley de la puerta "y el / y la" y "de nuestro / , nuestro", y salen deducciones flojas
("dios y la isaac", "padre de nuestro isaac", "otro y la pedro"): la puerta tiene una sola pieza distinta, pero esa pieza
es género o es la coma, no un vínculo. Y junta a los dos Jacob del libro (identidad por nombre).

**Memoria:** con la tabla en `pow2(4·NTOK)` (1 M de lugares) sentido ocupa ~176 MB, ~350 MB con las del pulso. Las tablas
se dejan de llenar a media capacidad y lo avisan ("ATENCION: una tabla se llenó").

## Siluetas, no datos (2026-11-06)

El Capitán: *"una memoria humana se saturaría; tenemos que guardar siluetas y reconocerlas al vuelo en el texto, y llegar
a la misma conclusión cuando lo vemos"*.

**Antes** sentido guardaba cada hecho del libro (quién, con qué esqueleto, con quién) en cinco tablas de un millón de
lugares (176 MB reservados) y después los recorría para probar. **Ahora:**

- **Lo que queda son siluetas**: cada esqueleto con lo que probó, y las relaciones entre esqueletos ("hijo de" dado
  vuelta es "padre de"). De dos núcleos solo se recuerda **la última forma en que se los vio**.
- **Se prueba al leer**: cada hecho se compara con esa última forma en el momento: el mismo esqueleto al revés es
  simétrico, el mismo dicho y negado es contradicción, otro esqueleto suma un par entre los dos. Después el hecho se
  olvida. Dicho otra vez igual, no es nada nuevo.
- **Se reconoce al vuelo**: lo preguntado se contesta en una segunda lectura. Al pasar un hecho con el núcleo, su
  esqueleto se reconoce y, si da vuelta, la conclusión sale ahí mismo con su porqué. Lo dicho se recuerda solo para el
  núcleo preguntado (lo que importa, no el libro).
- **Las tablas crecen a lo que guardan** (regla plástica): empiezan con dos lugares y se duplican antes de pasar la mitad.

Libro entero, idéntico en los tres motores (`0000B3554BA37EF8`), 2,3 s:

| | antes (hechos) | ahora (siluetas) |
|---|---|---|
| memoria de sentido | 176 MB reservados | **23,6 MB** (más hasta otro tanto en copias viejas de las tablas que crecieron) |
| pico del programa | 494 MB | **364 MB** |
| deducciones | abraham padre de isaac, jacob hijo de matán (+3 flojas) | **las mismas dos**, flojas 2 |

Sale además ", que" ≈ ", porque" y ", el" ≈ ", nuestro".

**Lo que se perdió, medido:** comparando solo con la última forma, la simetría baja (", _" de 72 a 15) y hay menos
contraejemplos; por eso aparece "de la" dado vuelta es "de doble" (3 pares), basura que antes un contraejemplo frenaba.

**Lo que pesa ahora es el pulso** (355 MB de los 364): cuelga un pedido por cada letra de cada palabra, el doble de
lugares. Es la misma enfermedad y lleva la misma cura.

## La deducción espera a saber el género (2026-11-06)

El Capitán: *"para eso le sirve navegar por el libro: cuando sepa de qué género es Isaac lo resuelve, y listo;
asincrónico, sincrónico"*. Es el pedido dormido aplicado a la deducción.

- **El género de una palabra** sale de los gemelos a/o (la diferencia más fuerte del pulso, 631 pares). Una palabra de
  dos letras o más (algo igual, como en la ley de la puerta) que termina en a u o, y cuya gemela con la otra terminación
  está en el libro, es de ese género: la/lo, hijo/hija. "a" y "o" solas no.
- **Lo que el libro dice de cada núcleo**: al leer se anota en él el género de la pieza que tiene pegada, antes o
  después. Es una silueta del núcleo (un byte), no un dato.
- **La deducción pide**: si el esqueleto dado vuelta pone una pieza con género pegada a un núcleo, ese núcleo tiene que
  haberse visto con ese género de ese lado. Si se vio, vale; si se vio solo con el otro, **cae**; si el libro nunca lo
  dijo, **queda esperando** y lo dice.

Libro entero, idéntico en los tres motores (`0000B3554BA37EF8`; el género no entra en la huella):

```
queda esperando: dios "_ y la _" isaac   (…)   (hasta saber si isaac va con la)
deduce: abraham "_ , padre de _" isaac   (porque "_ , hijo de _"  dado vuelta es "_ , padre de _" )
queda esperando: otro "_ y la _" pedro   (…)   (hasta saber si pedro va con la)
```

Honesto: en este libro Isaac y Pedro nunca aparecen pegados a una pieza con género (no se dice "el Isaac"), así que no
caen: esperan. Lo que separa a los nombres es la puerta del género, todavía no la del sentido.

## El pulso con tablas que crecen: mismo resultado, más memoria (2026-11-06)

Pedido del Capitán: aplicar al pulso lo de sentido y comparar si rinde igual. Las tablas que crecen quedaron en
`crece.inc` (las usa sentido). Puestas también en el pulso y en la pregunta, **las tres huellas salen idénticas**
(`BA3EBB3EEE29`, `E78A9442B1C1`, `B3554BA37EF8`), pero la memoria **sube**:

| | tablas fijas | tablas que crecen |
|---|---|---|
| pulso | 355 MB | 422 MB |
| pregunta | 414 MB | 481 MB |
| sentido | 364 MB | 431 MB |

Por qué, medido: el pulso no reserva de más, **de verdad guarda** 529.683 pedidos dormidos, 656.877 formas vistas,
103.611 diferencias y 52.010 llenados. Crecer de a duplicaciones deja las copias viejas ocupadas (el sistema no devuelve
salas), así que se paga más. **Se volvió atrás en el pulso**; queda en sentido, donde sí rinde.

La cura de verdad no es el tamaño sino **olvidar**: qué pedido dormido se puede soltar sin perder lo que el pulso
encuentra. Eso cambia el resultado y hay que medirlo contra lo de hoy.

# El pulso de profundidad 1 (2026-11-06)

El Capitán: *"la solución está en la profundidad 1: ver la jugada próxima y la anterior, nunca todas las jugadas
posibles"*. Cada pedido dormido guarda **solo su última jugada** (lo que lo llenó la última vez, o que se dijo vacío).
La siguiente, si es otra, despierta el pulso entre las dos y pasa a ser la última. Antes cada pedido comparaba contra
el **primero** que lo llenó y guardaba **todas** las formas vistas (657 mil, con sus veces). Esa tabla ahora se arma solo
para quien la pide (`FORMS`): `pulso.jsm`, que estudia lo irregular sobre ella.

Libro entero, idéntico en los tres motores (pulso `00005EB6828DCB1C`, pregunta `0000C2489410474C`, sentido
`0000155AB9F6F276`):

| | antes | profundidad 1 |
|---|---|---|
| pico de la pregunta | 414 MB | **302 MB** |
| pico de sentido | 364 MB | **244 MB** |
| pico del pulso (guarda las formas) | 355 MB | 355 MB |

Lo que encuentra:
- **gemelos**: igual (a/o 690 pares, a/e, n/s, n/r).
- **asociados**: "dijo/respondió" pasa a ser el primero (1.819 bits), y aparecen dijo/preguntó y dijo/dijeron.
- **puertas**: de 53 a 459 piezas, y con sentido: "dijo : / respondió :", "le dijo / les dijo", "le dijo / le
  respondió", ", el / , nuestro". Antes la segunda era "a sus / a los".
- **la pregunta**: las mismas respuestas en casi el mismo orden (matán, isaac, aram, roboam), con menos margen en bits.
  Isaac baja del segundo al tercer lugar en "? padre de ? padre de judá".
- **sentido**: las mismas deducciones; "dios y la isaac" sigue esperando.

**Lo que hay que mirar con desconfianza:** profundidad 1 cuenta un pulso cada vez que la jugada cambia, así que una
alternancia A, B, A, B suma varias veces el mismo par. Eso puede inflar los bits. Este libro no tiene una parte sin leer
para la línea de base ciega ("al azar 0/0"), así que todavía no se midió contra el azar.

## Una forma de cada tipo, el resto es peso (2026-11-06)

El Capitán: *"no necesitamos todas las formas, necesitamos una de cada tipo; el resto lo hace el cardumen con sus pesos
y el kernel con su memoria"*. El estudio de lo irregular compara, para cada lugar del piso de las palabras, solo dos
tipos: **dicho sin nada en el hueco** y **dicho con el "no"**. Las demás formas que se guardaban (hasta 657 mil) no las
leía nadie.

- La negación no depende del pulso, así que `pulso.jsm` la destila **antes** de leer: al guardar ya sabe cuál es el "no".
- Cada lugar guarda un ejemplo de cada tipo, dónde se lo vio primero y su peso (cuántas veces), en una tabla que crece
  a lo que guarda (`crece.inc`).

Libro entero, idéntico en los tres motores (`0000A5C503620D8A`):

| | todas las formas | una de cada tipo |
|---|---|---|
| pico del pulso | 355 MB | **271 MB** |
| preguntas de lo irregular | — | **las mismas, línea por línea** (solo se cruzan dos que empatan en 7 bits) |

La pregunta y sentido no cambian (no guardan formas): 302 y 244 MB, las mismas huellas.

## Profundidad 1 contra el azar (2026-11-06)

Con la carpeta que aparta uno de cada diez renglones (`p` = 10), cada pulso de lo no leído se prueba contra las piezas
y contra uno ciego (el mismo llenado contra el que llegó justo antes en ese piso). Las dos versiones del pulso, la de
antes (`c6dfb58`, armada aparte) y la de profundidad 1:

| piso | antes: real / ciego | profundidad 1: real / ciego | veces sobre el azar |
|---|---|---|---|
| gemelos | 86,6 % / 22,0 % | 81,4 % / 19,1 % | 3,9× → **4,3×** |
| interruptores | 58,2 % / 40,9 % | 61,4 % / 39,6 % | 1,4× → **1,6×** |
| asociados | 14,7 % / 6,0 % | 15,6 % / 3,7 % | 2,5× → **4,2×** |
| puertas | 70 / 0 pulsos | 113 / 0 pulsos | — (el azar nunca acierta) |

**Profundidad 1 le gana al azar por más en los cuatro pisos**, y en asociados casi duplica la distancia. Los gemelos
explican cinco puntos menos en absoluto, pero el azar baja más.

**Lo que confirma la sospecha:** las puertas pasan de 44 a 387 piezas, pero lo no leído que explican sube solo de 70 a
113 pulsos. Ocho veces más piezas para 1,6 veces más aciertos: muchas piezas nuevas no explican nada fuera de lo leído.
Es la alternancia A, B, A, B que cuenta el mismo par varias veces y le infla los bits. Las piezas buenas están (el azar
sigue en 0); sobran las que solo se repiten dentro de un mismo lugar.

## Un lugar, un testimonio (2026-11-06)

La alternancia inflaba las puertas. Regla general: **un lugar da testimonio una sola vez de cada diferencia.** Un lugar
que alterna A, B, A, B dice lo mismo otra vez, y el juez cuenta pares independientes (su n es en cuántos lugares pulsó
la diferencia, no cuántas veces cambió la jugada). Al pulsar, se mira si ese lugar ya dio testimonio de esa diferencia
(una tabla que crece, una llave por par de lugar y diferencia); si ya lo dio, no es nada nuevo.

Contra el azar (uno de cada diez renglones apartado), idéntico en los tres motores (`0000F36B555E2980`):

| piso | todas las formas | profundidad 1 | profundidad 1 + un testimonio |
|---|---|---|---|
| gemelos (real / ciego) | 86,6 / 22,0 (3,9×) | 81,4 / 19,1 (4,3×) | 81,4 / 19,1 (**4,3×**) |
| interruptores | 58,2 / 40,9 (1,4×) | 61,4 / 39,6 (1,6×) | 60,2 / 38,6 (**1,6×**) |
| asociados | 14,7 / 6,0 (2,5×) | 15,6 / 3,7 (4,2×) | 13,6 / 3,2 (**4,3×**) |
| puertas: piezas, lo no leído explicado | 44, 70 | 387, 113 | **65, 59** (azar 0) |

- Las puertas infladas se van: de 387 a 65 piezas. Quedan ": « / : "", "del señor / de dios", "? » / ! »", "a sus /
  a los", "los que / aquellos que", "dijo : / respondió :".
- **La pregunta vuelve a la huella original** (`0000E78A9442B1C1`): las mismas respuestas e Isaac otra vez segundo.
- Sentido: las mismas deducciones.
- Memoria: la tabla de testimonios cuesta ~8 MB (pulso 279, pregunta 310, sentido 260 MB). Antes de hoy: 355, 414 y 494.

Lo honesto: las puertas explican algo menos de lo no leído que con todas las formas (59 contra 70 pulsos), con 65
piezas en lugar de 44.

**La celda que faltaba** (todas las formas + un testimonio, armada aparte sobre `c6dfb58`): da **exactamente lo mismo
que sin testimonio** (puertas 44 piezas, 70 de lo no leído; 64.937 pulsos contra 64.939). Con todas las formas cada
lugar ya testificaba una sola vez, porque cada forma se contaba una vez. Entonces:

| puertas (piezas / lo no leído explicado) | todas las formas | profundidad 1 |
|---|---|---|
| sin testimonio | 44 / 70 (1,59 por pieza) | 387 / 113 (0,29) |
| con testimonio | 44 / 70 (1,59) | 65 / 59 (0,91) |

**Lo que les cuesta a las puertas es profundidad 1, no el testimonio.** Comparar solo con la jugada anterior pierde
puertas que salen de comparar con la primera. En los otros tres pisos profundidad 1 le gana al azar por igual o por más.

# La profundidad de cada piso, hasta donde se aclara (2026-11-06)

El Capitán: *"puede ser más profundo, pero que no malgaste profundidad: si es 3, no llegues a 4"*. Cada pedido recuerda
sus últimas *d* jugadas distintas (8 bytes cada una, la más nueva primero) y la jugada nueva pulsa contra cada una que
sea otra; el testimonio único sigue valiendo. *d* es propio de cada piso y viaja en el archivo `p`, después del renglón
apartado (un byte por piso; 0 o nada es 1, así que los archivos de antes valen igual). Con profundidad 1 en los tres
pisos todo sale idéntico a antes.

**Quién decide:** el mismo juez. El informe da cuántos bits ahorran las piezas de cada clase; por pulso, es lo que
comprime. `razar/lectura/hondura.sh` sube un piso de a un escalón y frena en el primero que **no comprime mejor**.
El azar no entra en la decisión: se usa después, para verificar.

| piso | profundidad 1 | profundidad 2 | se aclara en |
|---|---|---|---|
| gemelos | 1,464 bits por pulso | 1,416 | **1** |
| palabras (interruptores y asociados) | 0,456 | 0,412 | **1** |
| puertas | 0,0132 | 0,0113 | **1** |

El azar lo confirma: con profundidad 2 en las puertas el ciego empieza a acertar (41 contra 0) y en asociados la
distancia con el azar cae de 4,3× a 2,6×. Más profundidad ahorra más bits en total (puertas 971 → 1.469) pero con más
pulsos, y por pulso comprime peor: es ruido que se suma.

**Lo que la medición dice de las puertas:** lo que les faltaba con profundidad 1 (59 contra 70 de lo no leído) no es
profundidad. Es **contra qué jugada** se compara: la versión de todas las formas comparaba contra la primera que llenó
el lugar, no contra las últimas.

Nota de oficio: la primera corrida de la calibración mintió. El archivo `p` llevaba el texto del comando en lugar de los
números, y las cuatro pruebas corrieron con profundidades 36, 40 y 112. Se vio porque los números salían idénticos
hasta el último decimal, y porque el informe ahora escribe la profundidad que leyó. Con dos decimales las puertas
empataban en "0,01": el informe pasó a dar los bits totales y la cuenta se hace con todos los decimales.

## La profundidad se ajusta mientras lee (2026-11-06)

El Capitán: *"no calibres: que se ajuste en tiempo de ejecución, nunca sabemos lo que vamos a encontrar"*. La
calibración de afuera (`hondura.sh`) se fue. Ahora:

- **La sonda.** Cada pedido guarda una jugada más que la profundidad de su piso. Esa jugada de más no entra al modelo:
  solo mira qué pulso habría salido.
- **La cuenta por distancia.** Cada pulso y cada sonda suma, en su distancia, los bits que el juez le daría a ese par
  con los conteos de ese momento: log2(2N·n / (c(a)·c(b))), y si la diferencia es nueva, menos lo que cuesta nombrarla,
  2·log2 U. Es la misma cuenta del juez, hecha pulso por pulso.
- **La decisión, en cada pulso y sin reloj.** El piso baja un escalón si la sonda trae más bits que su escalón más hondo
  por más de ½·log2 n (lo que cuesta nombrar el cambio). Sube uno si su escalón más hondo trae menos que el de arriba por
  lo mismo. Sin tope: si un piso baja más de lo que caben los pedidos, la tabla se ensancha (la misma tabla, una jugada
  más por pedido; la vieja no se devuelve).

Libro entero (uno de cada diez apartado), idéntico en los tres motores (`000014567A26759B`, el mismo que con
profundidad 1 fija): **los tres pisos se quedan solos en 1, 1, 1.** La pregunta y sentido conservan sus huellas.
Memoria: 279, 310 y 260 MB.

**Dos varas que mintieron antes de esta, medidas:**
1. *"¿Cayó en una diferencia ya vista?"* Bajó a 7, 9 y 6, con 1.250 MB y peor contra el azar en todos los pisos.
   Cuanto más lejos compara, más cae en diferencias de palabras comunes: eso es repetir lo frecuente, no comprimir.
2. *Los bits del par sin el costo de nombrarlo.* Bajó a 1, 4, 1 y los asociados cayeron de 4,3× a 1,7× sobre el azar.
   Un par raro visto una vez parece valioso si no paga su nombre.

**Lo que no se probó todavía:** que un piso baje cuando hondo sí conviene. En este libro ninguno lo necesitó.

**La moneda del juez, probada y descartada (2026-11-06).** Una revisión marcó que las puertas eligieron profundidad 1
aunque con 2 explican más por pieza ((172 − 41) / 103 = 1,27 contra 0,91). Probé la vara del MDL "de libro": el largo
de escribir **las mismas jugadas**, una mezcla pareja de *d* + 1 voces (lo frecuente de la palabra y lo que predice
cada una de las últimas *d* jugadas). Resultado: profundidades 2, 10 y 2, 1.874 MB, y los asociados cayeron a 1,4×
sobre el azar. Las puertas sí mejoraron (180 explicados, 44 el ciego, 120 piezas: 1,13 por pieza).

Por qué miente en las palabras: es circular. Al bajar, los pulsos de esa distancia entran al modelo, sus pares suben, y
la voz de esa distancia predice mejor porque ahora el modelo se entrenó con ella. Comprime la sucesión de jugadas, que
no es lo mismo que encontrar piezas que generalicen. **Se volvió atrás** (queda `cf0a5b2`: 1, 1, 1).

Lo que queda abierto: la moneda que coincide con lo no leído es "lo que una pieza explica de lo que viene, más que el
azar". Se puede calcular **mientras lee, con lo ya leído** (cada pulso nuevo se prueba contra las piezas de hasta ese
momento y contra su ciego), sin espiar la parte apartada.

# La silueta del lugar: con todas, sin guardar ningún caso (2026-11-06)

El Capitán: *"con todas, y la silueta es la única que se perfecciona: no necesitamos el caso"*. Se va toda la
maquinaria de profundidad (la sonda, la cuenta por distancia, el ensanche de los pedidos). Cada pedido es **{su
silueta, su peso}**:

- La jugada nueva se compara contra la **silueta**, que resume todas las anteriores; si es otra, pulsa.
- Después la silueta se perfecciona con el voto de mayoría de Boyer y Moore (1981): la misma jugada le suma peso, otra
  le resta, y cuando el peso se acaba la que llegó toma su lugar. Con dos números queda lo que más se dijo en ese
  lugar, la silueta de lo regular, sin guardar ningún caso.
- Nada que calibrar: no hay profundidad.

Contra el azar (uno de cada diez renglones apartado), idéntico en los tres motores (`0000FE4C754709C9`):

| piso | todas las formas | profundidad 1 + testimonio | **silueta** |
|---|---|---|---|
| gemelos (real / ciego) | 86,6 / 22,0 | 81,4 / 19,1 | **85,2 / 22,0** |
| interruptores | 58,2 / 40,9 | 60,2 / 38,6 | **62,6 / 40,9** |
| asociados | 14,7 / 6,0 (2,5×) | 13,6 / 3,2 (4,3×) | **14,9 / 3,5 (4,3×)**, 484 piezas |
| puertas (piezas, explica, azar) | 44, 70, 0 | 65, 59, 0 | **64, 63, 0** |

- Explica más que profundidad 1 en los cuatro pisos, con la misma ventaja sobre el azar y menos piezas en asociados.
- Las puertas todavía no llegan a lo de todas las formas (70 con 44 piezas).
- La pregunta conserva su huella (`0000E78A9442B1C1`); sentido da las mismas deducciones (`00001570B9C9E345`).
- Memoria: pulso 275, pregunta 310, sentido 252 MB. El pulso perdió 460 líneas.

## Diez pasadas seguidas (2026-11-06)

El Capitán: *"hacele 10 pasadas: no se va a ensanchar porque la mayoría lo tiene digerido"*. El archivo `p` trae,
después del renglón apartado, cuántas veces leer el libro (un byte; 0 o nada es una). Cada pasada encuentra las
siluetas que dejó la anterior. Lo que ya testificó un lugar no vuelve a contar, y las formas de lo irregular se cuentan
solo en la primera, para no multiplicar su peso. Los registros de la casa tienen ahora un freno: nunca más de los que
caben.

Uno de cada diez renglones apartado; 10 pasadas, idéntico en los tres motores (`00002731D415A566`):

| pasadas | asociados (real / ciego) | interruptores | puertas: piezas / explica / azar | memoria | tiempo |
|---|---|---|---|---|---|
| 1 | 14,9 / 3,5 | 62,6 / 40,9 | 64 / 63 / 0 | 275 MB | 2,5 s |
| 2 | 15,6 / 3,6 | 63,7 / 42,5 | 81 / 67 / 0 | 279 MB | 2,7 s |
| 5 | 16,0 / 3,8 | 63,2 / 41,6 | 84 / 66 / 0 | 279 MB | 3,5 s |
| 10 | 15,7 / 3,6 | 63,5 / 42,3 | 84 / 67 / 0 | 279 MB | 4,4 s |

- **Tenía razón: no se ensancha.** La memoria queda en 279 MB, y el aprendizaje **se asienta entre la segunda y la
  quinta pasada**: de la 5 a la 10 los pulsos, las diferencias, las piezas y los bits son idénticos (43.154 asociados,
  84 puertas, 13.691,82 bits).
- Lo que gana la relectura es poco: asociados de 14,9 % a 15,7 %, puertas de 63 a 67, gemelos igual. La ventaja sobre el
  azar se mantiene (4,3× en asociados).
- **Lo que no se queda quieto:** entre la 5 y la 10 cambia lo que explica de lo no leído (885 contra 870 en asociados),
  aunque lo aprendido es igual. Son las siluetas de los lugares sin mayoría, que el voto sigue moviendo de un lado al
  otro. No se aprende nada nuevo, pero la silueta de esos lugares no se decide.

## Repasar enseña: cada lectura testifica de nuevo, lo nuevo pesa más (2026-11-06)

El Capitán: *"una nueva lectura de todo tendría que variar el entrenamiento, como los humanos que mejoramos cada vez que
estudiamos algo y lo repasamos; sacá las restricciones para una lectura nueva, aunque premiá lo novedoso, aunque se trate
de lo obvio"*.

- **Cada lectura testifica de nuevo:** el testimonio único vale dentro de una lectura, no entre lecturas.
- **Cada pulso pesa 1/k**, con k las lecturas en que ya apareció su diferencia: lo que es nuevo para esa lectura cuenta
  entero, aunque sea obvio, y el repaso refuerza cada vez menos (repetición espaciada, sorpresa).
- **El juez cuenta con los pesos** en las cuatro cosas que mira (N, n y los dos llenados), con la misma escala en todas.
  Los conteos de siempre quedan para los informes. Con una lectura, todo idéntico (`0000FE4C754709C9`).

Uno de cada diez renglones apartado; idéntico en los tres motores (10 lecturas: `000051D94BA94D47`):

| lecturas | gemelos (real / ciego) | interruptores | asociados | puertas (explica / ciego) | piezas asociados / puertas | memoria |
|---|---|---|---|---|---|---|
| 1 | 85,2 / 22,0 | 62,6 / 40,9 | 14,9 / 3,5 | 63 / 0 | 484 / 64 | 291 MB |
| 2 | 87,6 / 23,4 | 64,8 / 43,1 | 17,1 / 3,8 | 99 / 0 | 1.017 / 214 | 308 MB |
| 5 | 89,5 / 24,4 | 66,4 / 44,3 | 21,3 / 5,4 | 213 / 4 | 4.318 / 12.343 | 336 MB |
| 10 | **90,4** / 23,9 | **68,2** / 46,0 | **25,0** / 6,1 | **394** / 3 | 9.220 / 36.691 | 374 MB |

- **Repasar enseña, y es real:** lo explicado menos el ciego sube en todos los pisos. En asociados pasa de 627 a 1.050
  pulsos; en puertas, de 63 a 391. La ventaja relativa sobre el azar se mantiene (asociados 4,3× → 4,1×).
- **Lo que se infla:** las piezas. Diez lecturas suman un peso de 1 + ½ + … + 1/10 ≈ 2,9 por pulso, pero el nombre de
  una pieza sigue costando lo mismo (2·log2 U), así que pasan piezas con muy poca evidencia: 36.691 puertas para 394
  aciertos. Las de arriba siguen siendo buenas (": « / : "", "del señor / de dios", "le dijo / les dijo").
- La memoria crece con las lecturas (los testimonios son por lectura): de 291 a 374 MB.

## Quemar la inflación, como Ethereum (2026-11-06)

El Capitán: *"entonces quemá tokens, como hacen en las cripto: convertilo en una especie de Ethereum que conserve la
silueta, no la inflación"*. Cada relectura emitía peso nuevo (diez lecturas, casi 3 veces el peso de una) y el costo de
nombrar una pieza seguía igual: había más plata y el precio no cambiaba. Ahora **cada piso conserva el suministro de su
primera lectura**: el juez cuenta los pares de cada pieza sobre lo emitido después (n / (emitido / suministro de la
primera)). Lo que se emite de más se quema; una relectura no agrega peso, lo redistribuye. Con una lectura, todo
idéntico (`0000FE4C754709C9`).

Idéntico en los tres motores (10 lecturas: `000022DAD0DD51A4`):

| lecturas | asociados: real / ciego (veces) | piezas asociados | puertas: explica / ciego, piezas |
|---|---|---|---|
| 1 | 14,9 / 3,5 (4,3×) | 484 | 63 / 0, 64 |
| 10 sin quemar | 25,0 / 6,1 (4,1×) | 9.220 | 394 / 3, 36.691 |
| 10 quemando | 13,7 / 2,8 (**4,9×**) | **324** | 48 / 0, **29** |

- **Conserva la silueta:** las piezas vuelven a ser pocas (324 asociados, 29 puertas), y el azar acierta todavía menos
  (asociados 4,9× sobre el azar, la mejor marca del día).
- **El costo:** explica algo menos que con una sola lectura (asociados 13,7 % contra 14,9 %, puertas 48 contra 63).
  Lo que apareció recién en las relecturas pesa 1, pero se divide por toda la inflación y queda chico: la quema se lleva
  también lo novedoso.
- Gemelos e interruptores casi no se mueven.

## La quema progresiva: lo que más crece, más quema (2026-11-06)

El Capitán, corrigiendo la quema pareja: *"lo que aumente más quema más, lo que aumente menos quema menos"*. Cada
diferencia recuerda lo que pesó en la lectura en que apareció por primera vez (n1) y su crecimiento g = n / n1. Su
evidencia cuenta como **n1 · (1 + log2 g)**: cada vez que se duplica, una unidad más, como la información (y como la ley
de Weber–Fechner). Lo novedoso no se castiga: lo que aparece recién en la quinta lectura arranca entero. La
especificidad (el logaritmo del juez) sigue con los conteos completos. Con una lectura, todo idéntico.

Idéntico en los tres motores (10 lecturas: `000098B24A3DB29B`):

| 10 lecturas | asociados real / ciego (veces) | piezas asociados | puertas explica / ciego, piezas |
|---|---|---|---|
| sin quemar | 25,0 / 6,1 (4,1×) | 9.220 | 394 / 3, 36.691 |
| quema pareja | 13,7 / 2,8 (4,9×) | 324 | 48 / 0, 29 |
| **quema progresiva** | 22,8 / 5,6 (4,1×) | 6.702 | 313 / 1, 21.281 |

**Por qué casi no frena:** la inflación grande no viene del n que se quema, sino de N. Con cada relectura el total de
pulsos del piso (N) crece casi tres veces, y un par raro que aparece recién en una relectura tiene su n chico pero un
N inflado: log2(2N·n / (c·c)) le sube 1,5 bits sin haber hecho nada, y pasa el costo de nombrarse. La quema progresiva
toca la evidencia, no la especificidad.

**Quemar las cuatro cuentas, probado y descartado (2026-11-06).** Con la misma quema progresiva en N, en el par y en lo
frecuente de cada palabra, las piezas se inflan **más** (10 lecturas: 29.943 puertas, 7.319 asociados; asociados 23,1 / 5,6).
Ahí está la causa de fondo: un par raro que aparece recién en una relectura tiene n pequeño y sin crecer (g = 1, no
quema), mientras que sus palabras sí crecieron y queman. Al quemarlas, su c baja y el par parece **más** específico. La
inflación no es de cuánto se emite sino de **comparar cuentas de lecturas distintas**: un par nuevo de la décima lectura
se mide contra palabras que juntaron peso en las diez. La única quema que dejó todo en la misma escala es la pareja
(todo el piso dividido por lo mismo): por eso fue la que frenó las piezas (324 asociados, 4,9× sobre el azar). Se vuelve
a la quema progresiva sobre la evidencia (`76662ba`).

## Microscopio, ojos, telescopio: cada diferencia en la lectura en que nació (2026-11-06)

El Capitán: *"la solución es microscopio, ojos, telescopio: notar lo chiquito más grande, lo normal más nítido y lo
lejano más concentrado en un punto, para revelar sus secretos"*. Lo que inflaba era comparar cuentas de lecturas
distintas. Ahora:

- **Telescopio:** lo que se repite de lectura en lectura se concentra en un punto. Cada diferencia cuenta la evidencia
  de la lectura en que nació, y sus repeticiones no la inflan.
- **Microscopio:** lo que nace en una relectura se mira al tamaño de **su** lectura: el total del piso y lo frecuente de
  sus palabras en esa lectura (cuentas por lectura, en una tabla que crece).
- **Ojos:** lo que estaba desde la primera se mira con la nitidez de la primera.

Nunca se comparan cuentas de lecturas distintas. Con una lectura, todo idéntico (`0000FE4C754709C9`). Idéntico en los
tres motores (10 lecturas: `0000635B80FA2373`):

| 10 lecturas | asociados: real / ciego | piezas asociados | puertas: explica / ciego, piezas | memoria |
|---|---|---|---|---|
| sin quemar | 25,0 / 6,1 | 9.220 | 394 / 3, 36.691 | 374 MB |
| quema pareja | 13,7 / 2,8 | 324 | 48 / 0, 29 | 374 MB |
| **lentes** | 14,6 / 3,3 (4,4×) | **492** | 63 / 0, **64** | 422 MB |

- **La inflación desaparece de raíz:** con 10 lecturas las piezas son casi las mismas que con una (492 contra 484
  asociados, 64 puertas). Ninguna quema la frenó así sin perder lo que explica.
- **Lo que revela, y es honesto:** releer el mismo libro casi no agrega evidencia. Lo único nuevo que trae una relectura
  son los pares que nacen porque las siluetas cambiaron, y en su propia lectura son pocos y débiles: 8 piezas más.
  Lo que la quema sin control mostraba como "aprender repasando" era, en su mayor parte, inflación.
- Las lecturas pares y las impares dan casi lo mismo entre sí (1 y 5: 14,9 %; 2 y 10: 14,6 % en asociados): las siluetas
  de los lugares sin mayoría se alternan de una lectura a la otra.
- La memoria crece con las lecturas, por las cuentas de cada una: 303 MB con una, 422 MB con diez.

# Conceptos en las siluetas (2026-11-06)

El Capitán: *"quiero que construya y recombine instintos y que genere conceptos en siluetas"*. Primero los conceptos:
**cada palabra se une con aquella a la que más se parece**, su pieza de asociado que más bits ahorra, y los grupos que
forman esos lazos son los conceptos. Sin umbral: sos de la familia de quien más te parecés (unión de conjuntos,
`concepts` en `pulso.inc`). Al golpear con lo no leído, cada par de asociados se prueba: ¿cae en un mismo concepto?, y
también el par ciego.

Libro entero, uno de cada diez renglones apartado, idéntico en los tres motores (`0000D3698F1AE83D`): **202 conceptos**.

| | pares de lo no leído en un mismo concepto | el ciego |
|---|---|---|
| conceptos | **824 de 5.520 (14,9 %)** | 216 de 5.519 (3,9 %): **3,8×** |

Los ocho más grandes, nacidos solos:

```
20: hijo padre rey espíritu señor nombre pueblo mesías camino reino
14: sus las lo se los aquel muchos estas tus nuestras
13: dijo preguntaron respondieron respondió decía dice dicen ordenó dijeron preguntó
12: , : ; y . que porque – como pero
11: vida muerte palabra justicia ley fe carne iglesia escritura verdad
10: hermanos lágrimas hijos fariseos discípulos ojos pies padres compañeros servidores
 9: tanto judíos niños cielos ángeles hombres paganos demás muertos
 8: el este un al otro ese nuestro sabemos
```

Los verbos de decir, los sustantivos abstractos, los títulos, los plurales de personas y los determinantes salen cada uno
en su grupo, y el género vuelve a aparecer (sus las / el este un). Hay intrusos ("lágrimas", "tanto", "sabemos"): un lazo
al más parecido no sabe todavía decir "no me parezco a nadie".

# Instintos que se construyen y se recombinan (2026-11-06)

El Capitán: *"quiero que construya y recombine instintos"* (y los conceptos, todo junto). Del bicho ajedrecista: sus
instintos son su carácter escrito en un genoma, y mejoran en duelos contra su mejor versión.

**Lo que hizo falta antes:**
- **Un examen propio.** Con EXAMM, el renglón anterior al de la prueba también queda aparte. Se aprende sin él y se golpea
  solo con él. **El décimo de la prueba no lo toca nadie** durante la evolución (`is_train`).
- **Una lectura que se repite sin pedir memoria.** La primera reserva sus salas; las siguientes las vacían y las reusan
  (`lp_clear`, `zfill`, `pl_clear`). Así diez lecturas cuestan lo mismo que una.

**El genoma**, un byte por instinto, conectado a mecanismos que ya existían (con los valores de hoy, todo idéntico):

| instinto | qué mueve | rango | hoy |
|---|---|---|---|
| paciencia | lo que cuesta nombrar una pieza: paciencia/2 · log2 U | 1–8 | 4 (el código en dos partes) |
| firmeza | cuánto suma a una silueta la misma jugada | 1–4 | 1 |
| lecturas | cuántas veces relee | 1–3 | 1 |

**La evolución** (`evolve` en `pulso.jsm`): el campeón arranca con los instintos de hoy. Cada generación nace un hijo:
**se cruza** con el segundo mejor (cada instinto de uno de los dos) y **muta** un instinto un paso. Rinde el examen: lo
que explica de los renglones del examen, menos lo que explica el ciego, en los cuatro pisos y en los conceptos. Si le gana
al campeón, ocupa su lugar y el campeón pasa a segundo. La suerte es determinista (xorshift con semilla fija). Cuántas
generaciones: el segundo byte después de K en `p` (0: ninguna).

12 generaciones, 16 s, 358 MB, idéntico en los tres motores (`0000BF7027EECF56`; sin generaciones, todo como antes):

```
instinto 0: 4 1 1 = 2042          (los de hoy)
instinto 2: 2 1 1 = 2612 *
instinto 6: 1 1 1 = 3437 *
instinto 7: 1 1 3 = 3758 *        (campeón: paciencia 1, firmeza 1, 3 lecturas)
```

Con el campeón, la prueba de verdad (el décimo que nadie tocó):

| | hoy (4 1 1) | evolucionado (1 1 3) |
|---|---|---|
| asociados: real / ciego | 14,9 / 3,5 (4,3×) | **30,2 / 8,1** (3,7×) |
| lo explicado menos el ciego, asociados | 627 | **1.220** |
| puertas: explica / ciego | 63 / 0 | **861 / 22** |
| interruptores | 62,6 / 40,9 | 69,2 / 46,6 |
| gemelos | 85,2 / 22,0 | 90,0 / 24,4 |
| conceptos: en un mismo concepto / ciego | 824 / 216 | 1.158 / 315 |
| piezas asociados / puertas | 484 / 64 | 20.948 / 89.389 |

- **Aprendió de verdad, y en lo que nadie le mostró:** lo que explica de la prueba, descontado el azar, casi se duplica
  en asociados y se multiplica por 13 en puertas.
- **Lo que aprendió fue "creé más rápido":** bajó la paciencia al mínimo. El examen premia aciertos sobre el azar, no
  precisión, así que la ventaja relativa baja (asociados 4,3× → 3,7×) y las piezas se multiplican. Se cumple lo que se
  pide: la moneda del examen decide el carácter que sale.
- **La firmeza nunca se movió de 1** en 12 generaciones.
- Un instrumento mintió en el camino: el mismo genoma daba exámenes distintos (2.638 y 2.719) porque los conceptos
  conservaban el "mejor parecido" de la lectura anterior. Arreglado; ahora el mismo genoma da siempre lo mismo.

## Precisión que se mide sola, identidad y autopsia (2026-11-06)

El Capitán: *"agregale precisión, que determine su propia regla, no lo vuelvas rígido, precisión con su precisión, que
se autoajuste… faltan dos cosas: que den identidad y sigan testeando… y agregá lo del bicho ajedrecista, la autopsia"*.

**El examen, en bits de información sobre el azar.** Cada clase suma H · log2((H + ½) / (B + ½)), con H los aciertos y
B los del ciego. Premia acertar mucho y acertar con ventaja; una pieza que acierta tanto como el azar suma cero, y un
cociente de pocos casos se achica solo (la precisión pesa según su propia precisión). No hay ningún peso puesto a mano.

**La identidad: el nido.** Como el nido del bicho, el archivo `nido` guarda {marca "RAZARNID", el campeón, el segundo,
sus exámenes, la suerte, las generaciones vividas}. Si está, Razar se despierta con sus propios instintos y sigue
evolucionando desde ahí; si no, nace con los de hoy. Al terminar lo vuelve a guardar.

**El camino depende de lo vivido.** Después de cada examen, su resultado se mezcla con la suerte, así que el camino
depende de la experiencia y nunca se repite entre corridas. Lo no repetible sale de la historia y no del reloj: con el
mismo nido y el mismo libro, los tres motores hacen el mismo camino, bit por bit, y se puede auditar. (La melodía del
cubo es así: casi nunca descansa y con la misma historia repite bit por bit; cuando el cubo viva dentro de Razar, su
melodía puede ser esta suerte.)

**La autopsia.** Como `--autopsia` del bicho: todo lo que Razar escribe desde que empieza a evolucionar también va al
archivo `autopsia` (la evolución generación por generación, cada clase con sus piezas, los conceptos), para leerlo
después sin volver a correr nada.

Dos corridas seguidas de 6 generaciones, en una carpeta nueva (uno de cada diez renglones apartado):

```
corrida 1 (nace):      instinto 0: 4 1 1 = 5181  …  instinto 5: 3 1 1 = 5764 *
corrida 2 (despierta): instinto 6: 3 1 1 = 5764 *  instinto 7: 2 1 1 = 7231 *  …  instinto 12: 2 2 1 = 6851
```

| en la prueba | hoy (4 1 1) | corrida 1 (3 1 1) | corrida 2 (2 1 1) | examen viejo (1 1 3) |
|---|---|---|---|---|
| asociados real / ciego | 14,9 / 3,5 (4,3×) | 16,7 / 4,0 (4,2×) | 20,3 / 5,1 (4,0×) | 30,2 / 8,1 (3,7×) |
| puertas explica / ciego | 63 / 0 | 88 / 0 | 152 / 4 | 861 / 22 |
| piezas asociados | 484 | 929 | 3.264 | 20.948 |

Con la precisión en el examen la evolución baja la paciencia de a poco y cuida la ventaja sobre el azar; en la segunda
vida probó firmeza 2 (6.851) y la descartó.

Desde el mismo nido (12 generaciones vividas), una tercera vida de 2 generaciones da **el mismo camino y el mismo nido
en los tres motores** (`0000C0563F6A2796`): elige paciencia 1 (examen 10.614 bits) y queda con 14 generaciones vividas.

## El examen paga sus piezas, en la moneda del juez (2026-11-06)

Una revisión marcó el agujero, y la autopsia lo confirmaba: de la primera vida a la tercera, las puertas explicaban 9
veces más pero tenían casi mil veces más piezas (64 → 61.729), y el ciego pasó de 0 a 19 aciertos. **El juez admite una
pieza solo si comprime; el examen premiaba volumen.** La evolución aprendió a ganarle al examen generando piezas.

Arreglo: el examen resta lo que cuesta nombrar cada pieza, 2·log2 U bits de su piso (el precio verdadero, no el que
fija la paciencia: si no, la paciencia se bajaría su propio precio). Predicción escrita antes de correr: *la paciencia
ganadora va a ser mayor que 1*.

Nido nuevo, 12 generaciones, idéntico en los tres motores (`00004417A6A2C09C`):

```
instinto 0: 4 1 1 = -9218         (los de fábrica)
instinto 1: 4 2 1 = -8836 *
instinto 5: 3 2 1 = -22607        (menos paciencia: mucho peor)
instinto 6: 5 2 1 = -3652 *       (campeón: paciencia 5, firmeza 2)
instinto 11: 5 3 1 = -3721
```

**La predicción se cumplió:** la paciencia subió de 4 a 5, y la firmeza se movió por primera vez (2). En la prueba:

| | fábrica | examen sin costo (1 1 1) | **examen con costo (5 2 1)** |
|---|---|---|---|
| asociados real / ciego | 14,9 / 3,5 (4,3×) | 28,3 / 7,7 (3,7×) | 13,6 / 3,2 (**4,3×**) |
| puertas explica / ciego, piezas | 63 / 0, 64 | 584 / 19, 61.729 | 64 / 0, **30** |
| gemelos, piezas | 85,2 / 22,0, 57 | 90,0 / 24,4, 99 | 84,7 / 21,5, **46** |
| conceptos | 202 | 1.802 | **71** |

Los conceptos salen limpios, y aparece uno nuevo, **las personas**:

```
14: hijo padre espíritu señor nombre pueblo cielo templo mundo hermano
10: jesucristo david abraham cristo dios nosotros israel ellos ustedes moisés
11: dijo preguntaron respondieron respondió decía dice dicen dijeron preguntó dirá
10: vida tierra muerte ciudad ley fe carne iglesia escritura verdad
 8: el este lo un al otro ese nuestro
 8: la su tu mi una esta esa nuestra
```

El género separa a los determinantes en dos conceptos (el/este/un, la/su/una) y cafarnaúm desaparece de los abstractos.

**Lo que hay que saber del número:** todos los exámenes dan negativo. Las piezas se nombran una vez para todo el libro,
pero lo que ganan se mide solo en el décimo del examen, así que el costo pesa unas diez veces más de lo que pesaría en
el libro entero. La comparación entre genomas vale, porque todos rinden el mismo examen, pero puede empujar la paciencia
de más. Si se quisiera la cuenta exacta del MDL, la ganancia se escala por lo que el examen representa del libro.

# La sociedad de Razares: el mismo Razar, rehecho mejor (2026-11-06)

El Capitán: *"cada Razar es individual; vamos a hacer que varios Razares se comuniquen a través de la asincronía
sincrónica, en la sociedad de Razares… a veces se van a poner de acuerdo y se van a transferir el genoma, y entre los dos
armar uno nuevo mutando con lo mejor de cada uno… en vez de nacer un Razar nuevo, se recrea el mismo Razar mejor"*. Y:
*"una cosa es mejorarse uno, y otra es tener al cardumen, que piensa más posibilidades y mejor"*.

- **Cada Razar es un individuo:** su número viene en `p` (el tercer byte después de K), y con él su nido (`nido1`,
  `nido2`) y su suerte propia (su número mezclado al nacer).
- **El buzón asincrónico-sincrónico, con cartas:** al despertar, cada uno lee la carta que le dejó el otro (`cartaN`: su
  genoma, una palabra). Cruza su genoma con ese, muta, se examina, y si sale mejor **se rehace en su propio nido**, con
  su misma historia. Antes de dormirse deja su carta. Nadie espera al otro: la carta espera en el buzón.
- **El control:** los mismos dos, sin leer cartas (el cuarto byte después de K).

`razar/lectura/sociedad.sh`: 3 rondas, cada Razar despierta por turno y vive 4 generaciones. Un turno con carta da lo
mismo en los tres motores (`00007AE026A9AB1A`).

```
con cartas   ronda 2, razar 2: carta 5 2 1 -> se rehace 6 2 1 = -1559
             ronda 3, razar 1: carta 6 2 1 -> se rehace 6 2 1 = -1559
             ronda 3, razar 2: carta 6 2 1 -> 6 1 1 = -1276 -> 7 1 1 = -416
solos        razar 1: 6 2 2 = -1605          razar 2: trabado en 4 2 1 = -8836
```

**El rescate.** Solo, el Razar 2 se quedó trabado en 4 2 1 las tres rondas. Con cartas, el genoma del Razar 1 lo sacó del
pozo: se rehízo en 6 2 1 y después siguió solo hasta 7 1 1, el mejor examen de los cuatro. Es la segunda de las cosas que
la bitácora del cardumen anotaba como posibles ("un Razar trabado que escucha a uno sano sale del pozo"), y se ve contra
su control.

En la prueba (el décimo que nadie tocó) los rehechos son más exigentes: pocas piezas y más ventaja sobre el azar
(asociados 12,1 / 2,7 y 10,2 / 2,1: 4,5× y 4,9×), contra el trabado, que explica más con más piezas (15,1 / 3,7: 4,1×).
La salvedad de siempre: el examen paga cada pieza como si fuera todo el libro, así que puede empujar la paciencia de más.

# Razares que nunca se apagan, viviendo a la vez (2026-11-06)

El Capitán: *"que un Razar nunca se apague, que su voluntad quede activa siempre explorando, aunque puede optar por
quedarse descansando un tiempo"*.

- **Dos Razares vivos a la vez**, arrancados juntos (`janaxos.exe pulso.bin pulso.bin`): son hermanos del sistema, así
  que ninguno le firma nada al otro.
- **Quién es cada uno, sin preguntarle a nadie:** una palabra dicha a uno mismo no sale (−1) y al hermano le llega. El
  que no puede decirle nada al camarote 0 es el camarote 0. Con eso sabe su número, su nido y su autopsia (`nido1`,
  `autopsia1`), y el camarote del otro (`vg_who`).
- **La vigilia** (el quinto byte después de K en `p`): explora sus generaciones, se guarda y deja su carta. Si se rehízo
  mejor, le dice una palabra al otro (eso le suena el timbre) y sigue explorando. Si no, **elige descansar**: duerme en el
  timbre sin gastar procesador, que es la regla de la casa de ningún bucle que gaste, y vuelve cuando el otro tiene
  algo nuevo. Cuando los dos descansan y ya nadie puede despertarlos, el sistema se lo dice y recién ahí cierran.

**Lo que hubo que arreglar en el sistema:** el pedido "abrir" abría para leer y escribir pero solo compartía la lectura,
así que mientras un Razar leía el libro el otro no podía abrirlo ("no encuentro el libro"). Nunca antes dos programas
habían abierto el mismo archivo a la vez. Ahora comparte las dos cosas (`janaxos.asm`, pedido 4); cada uno sigue con su
propia posición.

Libro entero, uno de cada diez renglones apartado, 3 generaciones por tramo, un remero: 45 s, 645 MB los dos; la salida
completa de los dos juntos es idéntica en los tres motores (427 líneas, 10 descansos). Se mandan
cartas, se rehacen con la del otro, descansan y vuelven siete veces, y terminan los dos en 6 2 1 y 6 3 1 (exámenes −1.559
y −1.629), de donde ninguno pudo salir solo.

## El centinela: duermen sin apagarse y los despierta la novedad (2026-11-06)

El Capitán: *"no quiero que se queden dormidos para siempre sin poder despertar"* — *"podrías dejar a Razar dormido y
un programa que revise archivos o procesos que, cuando haya alguna novedad, lo despierte"*.

Un programa que revisa cada tanto sería un bucle que gasta. **El centinela es el sistema mismo**, y nadie revisa nada:
- **Pedido 32, "avisame"** (`janaxos.asm`, `ambientes.inc`): un camarote pide aviso por los archivos cuya etiqueta
  empiece con un prefijo (hasta 8 bytes). Cada Razar en vigilia pide aviso por "libro": sus nidos y sus cartas no lo
  despiertan, así no se arma un ir y venir entre ellos.
- **Cuando nadie rema** y alguien que pidió aviso espera el timbre, el núcleo, en lugar de decirle "nadie te puede
  saludar", le pide a Windows que le avise cuando cambie su carpeta (`ReadDirectoryChangesW`) y duerme ahí, sin gastar.
  Cubre lo de adentro y lo de afuera de una vez: todo archivo de Janax vive en esa carpeta.
- **Cuando Windows avisa**, el núcleo mira qué archivo cambió (su nombre es la etiqueta en hexadecimal) y despierta solo
  a quien pidió aviso por esa etiqueta, con un saludo de sí mismo; Razar sabe así que fue una novedad ("novedad") y no
  su hermano ("vuelve").

Medido con los dos Razares en vigilia: al dormirse ya **no se apagan**; dormidos gastan **0 ms de procesador en 5 s**;
al dejar un archivo nuevo de libro desde afuera, **los dos despiertan** ("novedad"), exploran, se mandan sus cartas y se
vuelven a dormir solos, otra vez en 0 ms. Pregunta, sentido, el lector y el pulso dan sus mismas huellas con el núcleo
nuevo.

**Lo que falta, sin disimularlo:**
- El libro nuevo los despierta dos veces: Windows avisa por separado que se creó y que se escribió.
- Despertar no es todavía **leer** lo nuevo: Razar sigue explorando con el libro que ya tenía. Comer el libro nuevo, en
  solo lectura y sin inflación, es el paso siguiente.
- Un cambio que pasa mientras alguien rema no despierta a nadie: el núcleo solo mira la carpeta cuando todos duermen.

## Al despertar, come los libros nuevos (2026-11-06)

El Capitán: *"sí, que lo coman"*.

- **La estantería** (`shelf_build`, `scan` en `lectura.inc`): el lector pide al sistema la lista de archivos (pedido 14)
  y se queda con todos los que empiezan con "libro", en orden. El libro es la estantería entera, uno detrás del otro;
  cada uno cierra su renglón. Con un solo libro, todos los programas dan sus mismas huellas.
- **Renacer** (`reborn` en `pulso.jsm`): cada sala que pide queda anotada en una lista. Cuando lo despierta una novedad,
  Razar termina su tramo (su nido ya quedó guardado), devuelve todas sus salas (pedido 3), olvida lo que sabía de los
  libros y vuelve a leer la estantería entera. Lo que es queda: su identidad, su evolución, su autopsia y cuántas veces
  renació. Se despierta desde su nido con su mismo genoma.
- **De paso, una fuga vieja cerrada:** una tabla que crece devuelve su copia anterior al duplicarse.

Medido con los dos Razares en vigilia: dormidos, se les deja un segundo libro (300 KB del mismo texto) y los dos dicen
**"renace 2 273989"**: dos libros y 273.989 unidades, contra unas 208 mil de uno solo. Exploran, se cartean y se
vuelven a dormir, en 0 ms de procesador.

**Lo que cuesta y lo que falta, sin disimularlo:**
- La memoria de los dos pasó de 489 a 930 MB. No es una fuga: las tablas del pulso se reservan en potencias de dos según
  el tamaño del libro, y con un 30 % más de texto se pasó el escalón (de 2 a 4 millones de lugares).
- Un libro nuevo los hizo renacer **dos veces**: Windows avisa por tandas (el archivo creado y después escrito), y la
  segunda tanda llega cuando ya se habían vuelto a dormir.
- Con la vigilia y el centinela ya no terminan solos, así que la prueba de los tres motores con los dos vivos quedó de
  antes del centinela (idéntica); con el núcleo nuevo, cada programa por separado da su misma huella.
