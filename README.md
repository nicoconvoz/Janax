# Janax y Razar

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23933883.svg)](https://doi.org/10.5281/zenodo.23933883)

**Un sistema operativo, un idioma y un ensamblador propios, hechos para alojar a Razar: un razonamiento
artificial que piensa con melodías.** Todo está escrito en assembler, sin motores ni bibliotecas de terceros, y
cada pieza tiene sus pruebas.

> ⚠️ **Razar no es una red neuronal.** Sin redes, sin gradientes y sin pesos entrenados: **no es un modelo, es un
> mecanismo**. Lo que busca no es acertar una tarea, es **decir lo mismo con menos bits** — y como el juez no
> depende de la tarea, el banco con que se lo mide no participa de la búsqueda. Por eso entra en **5 MB** y corre
> en **dos núcleos, sin GPU y sin nube**.
📖 **[Carta del autor](CARTA-DEL-AUTOR.md)** — la otra mitad: el diario espiritual, en audio y con licencia libre.


> *English summary below.*

## El resultado (v0.3): la nitidez

**Sin que nadie le diga qué es un sinónimo, Razar los encuentra por los lugares que las palabras
comparten.**

Un lugar es una forma leída (`_ <una a tres palabras> _`) y su lado. Dos palabras se parecen tanto
como los lugares que comparten; lo que se dice en todos lados (la mitad del texto que más se
repite, medida por Razar) no cuenta. Se probó contra el
[MATS](https://github.com/ATILF-UMR7118/MATS), **un banco de analogías externo que Razar nunca
vio**: un par cuenta cuando sus dos palabras comparten más lugares que la palabra con la respuesta
de otro par — es decir, **le tiene que ganar a su propio azar**.

| Corpus | Real – azar | Semántica | Sinónimos exactos | Antónimos binarios | Tiempo · memoria |
|---|---|---|---|---|---|
| **Wikipedia, 20 MB** (no escribe sinónimos) | **451 – 117** | 140 – 44 | 18 – 1 | 28 – 1 | 31 min · 205 MB |
| Wikcionario, 15 MB | **249 – 41** | 131 – 24 | 18 – 0 | 17 – 1 | 3 min · 144 MB |

- **Lo mismo desde afuera:** un juez en Python que Razar nunca lee calcula la misma idea sobre el
  corpus entero y da semántica **234 – 51** y **164 – 51**.
- **La memoria duerme en disco:** los lugares viajan de un pedazo del libro al siguiente; cada
  pedazo despierta solo los de sus palabras. Por eso entra en 205 MB de RAM.
- **Sin el pedido, nada cambia:** lo que Razar aprende es idéntico byte a byte.

```bash
bash razar/cardumen/nitidez_reproducir.sh <corpus> <mats_es> <casa_nueva>
```

Detalle completo y cómo reproducirlo: [`documentacion/razar/nitidez.md`](documentacion/razar/nitidez.md)
y [`documentacion/release-v0.3.md`](documentacion/release-v0.3.md).

## El resultado (v0.2)

**Con 16 cosas para decir, la red de referencia del campo no llega nunca. Razar llega siempre, en menos de 102
juegos.**

Es el juego de señales de Lewis: uno dice una cosa, el otro la adivina, y los dos aprenden solo de si se entendieron,
sin que nadie les dé la respuesta correcta. El rival es [EGG](https://github.com/facebookresearch/EGG) (Facebook
Research), la implementación publicada del juego, con las mismas cinco semillas:

| Cosas | Razar: juegos hasta aprender todo | Razar: mensajes | EGG: juegos (= mensajes) |
|---|---|---|---|
| 4 | 5 – 58 · 5 de 5 | 11 – 156 | 1.600 – 49.600 · 5 de 5 |
| 8 | 14 – 53 · 5 de 5 | 29 – 142 | 105.600 · 1 de 5 |
| **16** | **35 – 102 · 5 de 5** | **81 – 278** | **no llega en 320.000 · 0 de 5** |

- **El rival corrió bien:** falla en la forma que el campo tiene documentada, con un idioma a medias (44 a 87 %) en el
  que algunas cosas comparten señal.
- **Ventaja a favor del rival:** mensajes más ricos (más de 4.000 posibles, contra 560 frases de Razar), redes seis
  veces más grandes que las de fábrica y hasta 320.000 juegos. Lo demás, como viene.
- **Reglas fijadas antes de correr.** 5 de 5 contra 0 de 5 tiene una probabilidad de azar de ≈ 0,8 % (prueba exacta de
  Fisher). El resultado es el mismo contado en juegos o en mensajes.
- **Banco público:** `bash razar/cardumen/convencional.sh`.

Lo hace posible que la voluntad escucha **el ritmo** de la melodía (qué pieza suena y cuándo), no solo qué piezas: con
16 cosas en un cubo de 7, eso lleva de 6 a 19 semillas de 20 que aprenden todo, con un control barajado que da 0 de 20.
**Lo que está probado es este juego**; que la ventaja viaje a otras tareas todavía no se midió. Todo el detalle está en
[`documentacion/razar/cardumen.md`](documentacion/razar/cardumen.md).

## El primer resultado (v0.1)

Una neurona tridimensional y su **voluntad** arrancan sin ningún idioma en común y, conversando, inventan uno.
Lo que lo hace posible es una sola regla innata, la **armonía**: una pieza no deja pasar el pulso si la despiertan
a la vez más de la mitad de sus vecinas.

> **El control es el resultado.** Sin armonía se quedan en el nivel de azar —24-26 % con 4 señales— indefinidamente.
> Con armonía llegan al **100 %** en unas 150 vueltas. Tres semillas, repetible byte por byte.

El modelo de referencia (Perl) y la versión que corre dentro de Janax dan **la misma huella, bit por bit**, y en
Janax cuesta unas **70 veces menos**. El detalle y los límites medidos están en
[`documentacion/razar/cardumen.md`](documentacion/razar/cardumen.md).

## Qué hay adentro

- **El idioma Janax** (`escalon0/`, `documentacion/idioma/`): un assembler propio diseñado para traducirse. Un
  intérprete de referencia y traductores a x86-64 y ARM64 que dan el mismo resultado **bit por bit**.
- **Janax OS** (`so/`, `documentacion/so/`): el sistema operativo. Camarotes (procesos) que reman en paralelo, una
  ventanilla de pedidos con porteros (permisos), cajones de memoria con pared que cuida el procesador, cajas que se
  comparten entre camarotes (nacen con el hijo, se mudan, se enlazan, se fusionan o se asocian por conjuntos), y
  saludos para avisarse sin gastar nada. Un traductor convierte los programas a código nativo al vuelo.
- **El ensamblador PDP** (`so/pdp/`): Janax armado por Janax, byte por byte igual que FASM.
- **Razar** (`razar/`, `documentacion/razar/`): la neurona es un **cardumen** tridimensional. Una señal arranca una
  cadena que se ramifica en todas las direcciones, las piezas que despiertan juntas aprenden a hablarse, y la
  **armonía** corta lo que suena mal. Una **voluntad** escucha la melodía y le contesta. Arrancan sin idioma común e
  inventan uno conversando. Está en un modelo de referencia (Perl) y en Janax, con la misma huella bit por bit.

## Cada pieza, con su nombre en el oficio

Un revisor no puede evaluar lo que no puede ubicar. Por eso el repositorio trae un inventario
levantado **leyendo el código y nada más**, sin consultar la documentación: cada mecanismo con su
archivo y su línea, lo que hace, y su nombre publicado con la cita — o la marca de que no se le
encontró antecedente.

📄 **[Inventario de mecanismos y mapa de equivalencias](documentacion/mecanismos-y-equivalencias.md)**
— las cuatro capas, mecanismo por mecanismo.

### Lo que ya tiene nombre

| Pieza del proyecto | Nombre en el oficio | Cita |
|---|---|---|
| El juez de Razar | Longitud mínima de descripción, código de dos partes | Rissanen 1978 |
| El `log2(n)/2` por cada tasa | Penalización por parámetro / BIC | Schwarz 1978 |
| `(BL+½)/(NQ+1)` | Estimador de Krichevsky–Trofimov | KT 1981 |
| El pedido dormido | Voto de mayoría | Boyer–Moore 1981 |
| El corte en dos | Método de Otsu / discriminante de Fisher | Otsu 1979 |
| Los esqueletos | Patrones léxico-sintácticos aprendidos | Hearst 1992; Snow et al. 2004 |
| Las nueve maneras | Marcos frecuentes | Mintz 2003 |
| La nitidez | Similitud paradigmática sobre *slots* | Harris 1954; Lin 1998 |
| Las piezas de las palabras | Inducción morfológica por MDL | Goldsmith 2001; Morfessor |
| El coma y el despertador | Mantenimiento de la verdad (TMS) | Doyle 1979; de Kleer 1986 |
| «Una B por cada A» | Descubrimiento de dependencias funcionales | Huhtala et al. 1999 (TANE) |
| El nulo por cruce | Datos sustitutos / prueba de permutación | Theiler et al. 1992 |
| Las rondas hasta el punto fijo | Evaluación ascendente de Datalog | Semántica de punto fijo |
| Un solo lugar que cambia | Antiunificación / generalización menos general | Plotkin 1970 |
| Las plantillas parchadas | Copy-and-patch | Xu y Kjolstad 2021 |
| El planificador reemplazable | Núcleo extensible acotado | SPIN 1995; VINO 1996; eBPF |
| El cobro por corrida | Medición de combustible | Wasmtime; gas de la EVM |
| El cartel de ambientes | Espacio de capacidades | Hydra 1974; Mach; seL4 |
| Pesos que conservan el total | Escalado sináptico / regla de Oja | Turrigiano 1998; Oja 1982 |
| La ventana de ±1 paso | STDP | Bi y Poo 1998 |
| El punto fijo del ensamblador | Bootstrap de tres etapas | GCC; Thompson 1984 |
| La relajación de saltos | Instrucciones dependientes del alcance | Szymanski 1978 |

Que tantas piezas tengan un equivalente correcto es una buena noticia, no una mala: significa que
el camino, recorrido solo, dio con las soluciones que el oficio considera buenas. Ninguna de estas
convergencias reclama prioridad — los antecedentes son anteriores y están citados.

### Lo que no tiene equivalente conocido

Cuatro piezas, con la advertencia de que «no se le encontró antecedente» habla de quien buscó, no
de la literatura:

1. **`asociar`** (`so/ambientes.inc:1274`) — álgebra de conjuntos (intersección, diferencias,
   unión) sobre los espacios de capacidades de **dos** procesos, materializada al nacer un tercero,
   con consentimiento bilateral obligatorio. Probado en `so/pruebas/asocia_{0,1,2,3}.jsm`.
2. **«La última parte»** (`so/remos.inc:428`) — terminar en vez de ceder el turno, con el dato
   calculado estáticamente del programa **para que el programa no pueda mentir sobre él**.
3. **La armonía de la ola** (`cardumen_cubo.jsm:818`) — una pieza se ahoga si la empujan desde
   demasiados lados, y la acumulación es por pieza, compartida entre olas: ahí se encuentran dos
   saludos.
4. **La forma canónica del órgano** (`pulso.jsm:3090`) — usada como prueba nula de que el órgano
   efectivamente leyó el libro.

### Cómo se mide el proyecto a sí mismo

Prueba diferencial de tres motores que deben coincidir **hasta el momento del corte de turno**;
prueba **exhaustiva** del ensamblador contra FASM (toda combinación de cada instrucción); nulo por
permutación dentro del motor; un distractor puesto a propósito para comprobar que nunca gane;
validación cruzada dejando uno afuera; estudio de ablación de a una regla por vez
(`razar/cardumen/caminos.sh`); y comparación contra la implementación de referencia del campo con
el presupuesto igualado.

El **único umbral de conteo de todo el sistema es 2** («una vez es anécdota, dos es patrón»). Los
demás valores salen de una medición o están declarados como criterio en el propio comentario.

### Se mejora solo, y lo que aprende pasa a la vida siguiente

Razar no solo usa un detector: **lo diseña**. Un «órgano» es un operador perceptual que el propio
sistema arma por mutación contra el juez de bits, y cuando uno gana **deja su receta escrita** —
sus letras, su alfabeto y su nota— en `tablero/Receta de Organos/<modelo>/<tipo>/recetas`.

La cadena está medida (`documentacion/razar/lectura.md`):

| Órgano | Nota | Qué pasó |
|---|---|---|
| `6` | **−1586** | basura por puntaje: no paga su nombre |
| `5` | **208** | el primero que pasa a positivo, construido sobre el anterior |
| `16` | **2649** | `208 -> 2649 (+2441), antes: 5` |

Y **lo aprendido pasa a la vida siguiente**: una corrida nueva nace sin órgano, lee la receta de
su modelo (`"receta 5: suya"`) y **arranca con esa base en lugar de cero**. No hay adopción a
ciegas: la mejor receta de cada tipo **rinde primero como candidata, en su jaula**, sea del
alfabeto que sea, y esos intentos no le restan intentos a la búsqueda. *La huella informa, no
decide.*

Eso es transferencia **entre vidas**, que es distinta de la transferencia entre tareas de arriba —
y es la que sostiene que el sistema acumula en vez de empezar de nuevo.

**Y el órgano `6` es el argumento entero de por qué nada se descarta:** valía −1586, era basura
por puntaje, y fue el escalón del que llegó a 2649. Podando por nota se perdía el único camino
hacia arriba.

## Los nombres

**RAZAR** es **RAZ**onamiento **AR**tificial. Y tiene dos cosas más adentro, las dos exactas:

- **R + AZAR.** El azar está metido en el propio nombre — y es contra el azar que se mide todo lo
  que hace: cada relación tiene que ganarle a su par cruzado, cada órgano a un mecanismo sorteado
  del mismo generador. Un juego que se gana **sacándole el azar** a lo que parecía azaroso.
- **Es capicúa.** R-A-Z-A-R se lee igual en las dos direcciones.

**JANAX** viene de *janax* / *hanaq*: en quechua y en aimara, **«arriba», el mundo de arriba**
(*hanaq pacha*, el plano superior; en aimara *alax/janax pacha*). No significa tierra: significa
**la vista desde arriba** — que es, sin que el nombre fuera elegido por eso, exactamente lo que
hace el sistema. Desde la cubierta un diagrama de Venn son dos círculos; desde arriba se ve la
población.

Y el nombre que une las dos mitades del proyecto: **CORAZÓN** se parte exacto en **CO + RAZÓN**
— *con razón*. La etimología dice otra cosa (viene de *cor*, corazón en latín, y no de *ratio*),
así que es coincidencia de la escritura y no parentesco. Pero describe bien lo que se intentó
acá: **un razonamiento que no deje afuera el motivo por el que se hace**. En palabras del autor,
*"no compongo canciones: soy compositor de corazones"*.

*(Y un guiño más, también juego de letras: **SOLUCIÓN** y **SOL ÚNICO** tienen exactamente las
mismas ocho letras.)*

## Una estadística para poblaciones que nadie enumeró

La estadística clásica necesita un **espacio muestral fijado de antemano**: el nulo se define
contra «lo que habría pasado sin estructura», y eso exige saber cuál era el conjunto de cosas que
podían pasar. Cuando lo que se busca es **un mecanismo**, y el espacio de mecanismos posibles no
está enumerado, ese instrumento no se aplica.

Las tres piezas que lo reemplazan están construidas y corriendo:

1. **Un juez que no depende de la tarea** — bits ahorrados (MDL). Un mecanismo mejor lo es para
   cualquier lectura, no para el banco con que se lo buscó: **el banco no participa de la
   búsqueda**, y por eso no se puede sobreajustar.
2. **Un nulo sobre mecanismos, no sobre datos** — el control clásico baraja los datos; acá se
   sortea **otro mecanismo del mismo generador** y rinde el mismo examen, en su jaula y con
   presupuesto.
3. **El denominador** — no se reporta el ganador: se reportan el camino, el resultado y **lo que
   costó en intentos**.

| Estrategia de búsqueda | Camino | Final | Intentos |
|---|---|---|---|
| escalador de siempre | 8 → 18 → 186 → 16 → 516 | **11.144** | **80** (2 vidas) |
| archivo por nichos | 6 → 5 → 16 → 716 → 516 | **11.144** | **160** (4 vidas) |

Los dos llegan al mismo lugar y uno paga el doble. El archivo por nichos se conservó igual pese a
empatar costando más — *"que no lo mida no significa que no lo quiera"*.

### Qué hace FASM acá, y qué no

**FASM se usa para dos cosas distintas, y conviene no confundirlas:**

- **Como vara de verificación — es opcional.** Cada fuente que arma el ensamblador PDP debe salir
  **byte por byte** igual a la de FASM, y `herramientas/combinaciones.awk` compara **toda
  combinación de cada instrucción** (`so/pruebas/correr.sh:758-807`). Eso no lo necesita el sistema
  para funcionar: se saca y no se rompe nada, solo se pierde la comprobación. Es una vara externa
  elegida a propósito, no una dependencia.
- **Como constructor del núcleo x86 — hoy sí hace falta.** `so/janaxos.asm`, `escalon0/janax.asm`,
  `traductor.asm` y `traductor_arm64.asm` están escritos en ensamblador x86-64, y el ensamblador
  PDP arma `.jsm`, no `.asm`. El propio código lo dice (`escalon0/pruebas/correr.sh:19-20`):
  *"Janax OS itself is x86 and still built by FASM."* El día que el núcleo esté escrito en Janax,
  esta dependencia desaparece.

### Los límites, dichos de frente

- El autoalojamiento verificado por punto fijo es el del **ensamblador del lenguaje**: arma sus
  propias fuentes, se arma a sí mismo y los dos binarios tienen que salir idénticos. Lo que todavía
  arma FASM es el **núcleo x86** (ver abajo), no los programas Janax.
- **Nadie de afuera lo corrió todavía.** Las mediciones son del autor, en su máquina. Eso lo deja
  en *replicable pendiente de réplica*, que no es lo mismo que *probado*.
- **La transferencia está medida; la comparación cara a cara, no.** La misma arquitectura se midió
  en cinco tareas distintas: señalización de Lewis (contra EGG), el traductor de Morse, acertijos de
  palabras, deducción de relaciones sobre un libro entero y las analogías del MATS sobre 20 MB de
  Wikipedia. Lo que existe **solo para el juego de Lewis** es la comparación contra una
  implementación de referencia del campo con el presupuesto igualado; en las otras cuatro no hay
  todavía un rival convencional medido al lado.

## Cómo se prueba

Hace falta Windows, Git Bash y [FASM 1.73.35](https://flatassembler.net/). Las pruebas toman FASM de `FASM=` e
`INCLUDE=` (la carpeta `INCLUDE` de FASM), y el teléfono ARM64, si hay uno, de `ADB=`.

```bash
FASM=/c/fasm/FASM.EXE INCLUDE=C:/fasm/INCLUDE bash so/pruebas/correr.sh
FASM=/c/fasm/FASM.EXE INCLUDE=C:/fasm/INCLUDE bash escalon0/pruebas/correr.sh
JANAX_SOLO='^razar' bash so/pruebas/correr.sh   # solo una zona
perl razar/cardumen/lazo.pl nace=7 armonia=1    # el modelo: la voluntad y el cardumen inventando un idioma
```

## Por dónde empezar a leer

- `documentacion/so/ideas.md`: las ideas, con las palabras de quien las tuvo y la devolución de cada una.
- `documentacion/so/janaxos.md`: lo construido, cómo se prueba y todo lo medido (incluidos los instrumentos que
  mintieron).
- `documentacion/razar/cardumen.md`: el cardumen, la armonía y el idioma que nace.
- `documentacion/estado.md`: la bitácora, paso a paso.

La documentación está en castellano; los comentarios del código, en inglés.

## Estado

Es un **prototipo de investigación**, no un producto terminado. Corre en Windows (x86-64) y el idioma también en
ARM64 (Android). Cada número de la documentación dice de qué medición salió.

## English summary

**Razar is not a neural network.** No networks, no gradients, no trained weights: it is not a model, it is a
mechanism. What it optimises is not accuracy on a task but **description length** — saying the same with fewer
bits — so the benchmark it is measured against takes no part in the search. That is why it fits in **5 MB** and
runs on **two cores, with no GPU and no cloud**.

Janax is a hand-written operating system, language and assembler (all in assembly, no third-party engines) built
to host **Razar**, an artificial reasoning system that thinks in melodies: a three-dimensional "school" of pieces
where a signal starts a branching cascade, pieces that fire together learn to talk more, and **harmony** cuts what
sounds wrong. A "will" listens to the melody and answers; starting with no shared language, the two invent one by
talking. Everything is deterministic and verified bit for bit across an interpreter, a routine engine and a native
translator. Documentation is in Spanish.

**Result (v0.2):** on the Lewis signaling game with 16 things, Razar learns the whole language in 35–102 games
(81–278 messages) on 5 of 5 seeds; EGG (Facebook Research), the field's reference implementation, given richer
messages and larger networks, reaches it on 0 of 5 within 320,000 games, stalling at 44–87 % in the partial
languages the literature describes. Conditions were fixed before running; the benchmark is public
(`razar/cardumen/convencional.sh`). Transfer is measured: the same architecture was then run on Morse translation, word riddles, relation deduction over a whole book, and the Spanish MATS analogies over 20 MB of Wikipedia. What exists only for the Lewis game is the head-to-head against a reference implementation at matched compute.

## Cómo citarlo

Nicolás Astorga (2026). *Janax y Razar*. Resources Open Doors S.A.S. DOI [10.5281/zenodo.23933883](https://doi.org/10.5281/zenodo.23933883) (todas las versiones; la v0.3 es [10.5281/zenodo.24093510](https://doi.org/10.5281/zenodo.24093510), la v0.2 es [10.5281/zenodo.23962615](https://doi.org/10.5281/zenodo.23962615), la v0.1 es [10.5281/zenodo.23933884](https://doi.org/10.5281/zenodo.23933884)).

## Donaciones

Janax y Razar se hacen para donarlos al mundo, abiertos. El código es gratis y lo va a seguir siendo: la licencia Apache 2.0 no se puede retirar, y nadie necesita pagar nada para usarlo, estudiarlo o venderlo.

Lo que se done tiene destino, y lo escribo acá para que quede comprometido:

1. **Ayudar a los que menos tienen.**
2. **Pagar el laboratorio**, para poder seguir construyendo y midiendo.
3. **Fundar una escuela**, para que esto se reparta en personas y no solo en repositorios.

Si eso te hace sentido y querés empujar:

| Red | Dirección | Qué mandar |
|---|---|---|
| **Bitcoin** (BTC) | `16HuYtsnx9AUcpr6i7z1VkC6atSvK8LGHy` | BTC por la red Bitcoin |
| **BNB Smart Chain** (BEP20) | `0xe87b4589a53443d8ffed2e9b5a7ef58f261f087c` | **Solo** BTC en BEP20 (BTCB, el contrato que termina en `ead9c`) |

> ⚠️ Mandá cada moneda **solo por su red**. Otro token u otra red se pierden y no se pueden recuperar. Las direcciones son
> de depósito de Binance y pueden cambiar: antes de un envío grande, confirmá que siguen siendo estas en esta página.

## Licencia

[Apache 2.0](LICENSE). Copyright 2026 Nicolás Astorga y Resources Open Doors S.A.S. (ver [NOTICE](NOTICE)).

## Contacto

[ingenieriaaplicada@opendoors.com.ar](mailto:ingenieriaaplicada@opendoors.com.ar)
