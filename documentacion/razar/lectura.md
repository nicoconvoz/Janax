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
