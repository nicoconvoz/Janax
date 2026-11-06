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
