# El cardumen: la neurona de Razar (modelo de referencia v0, 2026-11-03)

Diseño del Capitán en `documentacion/so/ideas.md` (2026-11-03). Modelo en `razar/cardumen/modelo.pl`, medición en
`razar/cardumen/experimento.pl` (`perl razar/cardumen/experimento.pl`). La versión en Janax tiene que dar lo mismo,
bit por bit.

**v0**: cubo de 4×4×4 piezas; cada una habla solo con sus 6 vecinas (profundidad 1), con un peso de 0 a 255 por
vecina. Una señal despierta varias piezas a la vez; la ola sigue paso a paso, y una pieza despierta si lo que le dicen
las que despertaron en el paso anterior suma su umbral (100; los pesos arrancan en 40, así que hacen falta 3 vecinas).
Cada pieza despierta como mucho una vez por señal, así la ola termina. El viaje es la melodía. Después de cada señal
la forma se mueve por la interacción, nunca por un reloj: una pieza le habla más (+ su velocidad) a la vecina que
despertó junto con ella (el mismo paso o el siguiente) y un poco menos (−1) a la que no despertó. La velocidad es
estado de cada pieza (metaplasticidad): baja uno cada vez que despierta, hasta 1. Cada pieza guarda su fragmento de
la última melodía: qué vecinas la despertaron. Valores iniciales (40, 100, 20): criterio, no medición.

**Medido**:

| | resultado |
|---|---|
| Repite: dos cardúmenes con el mismo historial | mismos viajes, bit por bit |
| Recuerda: un pedazo (3 piezas) de una melodía de 6, antes y después de aprenderla 10 veces | despierta 3 → **6** |
| Asocia y cambia por interacción: el pedazo de A, antes y después de que suene B (comparten piezas) | `0,1,4 → 5,16,17` → sigue de largo hacia la melodía de B |
| Alternar pedazos de A y de B 12 veces | **2 viajes distintos**: se asienta |

**Lo que enseñó**: la primera regla premiaba solo a la pieza que despertaba *después* de otra, y nunca aprendía, porque
las piezas de una señal despiertan juntas; con *"las que caen juntas"* (frase del Capitán) aprende. Con v0 el cardumen
**se asienta como un hábito**, porque los pesos llegan a 255 y la velocidad solo baja. Si tiene que seguir cambiando,
como pide el diseño, la regla tiene que poder también aflojar: decisión del Capitán, sin tocar perillas a ojo.

## El lazo: la voluntad y el cardumen tratando de entenderse (2026-11-03)

`razar/cardumen/lazo.pl` (`perl razar/cardumen/lazo.pl [nace=semilla] [w0=..] [k=..] [rounds=..]`). La voluntad tiene K
cosas para decir; dice una despertando 3 piezas de la cara de abajo; la respuesta es qué piezas de la cara de arriba
despertaron; la voluntad adivina con lo que aprendió. Si acierta, repite la melodía (el cardumen la afianza) y anota;
si falla, cambia una de las piezas con que lo dice. Determinista (dado con semilla fija).

| Cómo nacen las relaciones | Qué pasa | Aciertos (azar 25 %) |
|---|---|---|
| Todas en 40 (o 50) | **Silencio**: la ola no llega arriba nunca (0 de 400) | 0 % |
| Repartidas de 0 a 255, con semilla (`nace=`) | **Convulsión**: se prenden las 64 piezas en 9–10 olas | 24–26 % (todo responde igual) |

Por qué: una pieza tiene una sola vecina en el piso de abajo, así que si hacen falta 2 o más para despertar, el pulso
no sube de piso; si alcanza con una, se prende todo. ⚠️ El instrumento: tres semillas distintas daban exactamente los
mismos aciertos; contar las piezas despiertas mostró la convulsión.

Lo que faltaba era lo que el diseño ya tenía: **la puerta** (*"alguien cierra la puerta y dice no pasarás"*). Las
relaciones solo empujaban; en el cerebro cerca de una de cada cinco neuronas frena, y ese equilibrio lo mantiene en
el borde entre el silencio y la convulsión (criticalidad). Lo resolvieron la puerta y la armonía del Capitán, en las
dos secciones siguientes.

## La puerta del Capitán, primera versión (2026-11-03)

> *"Cuando una melodía desentona, o ya dio una respuesta confirmada, se termina el pulso de esa rama."*

Modelo (`doors`, `sinks`, `confirm` en `modelo.pl`; `puertas=1` en `lazo.pl`): cada pieza guarda los fragmentos que la
voluntad confirmó (qué vecinas la despertaron en una melodía acertada); una pieza con recuerdos solo deja pasar el
pulso si la despiertan vecinas que se cruzan con alguno (criterio de arranque, no medición); una sin recuerdos deja
pasar; la cara de arriba entrega la respuesta y su rama termina.

Medido: **no alcanza**. Con relaciones repartidas el primer pulso ya prende las 64 piezas, la voluntad acierta por azar,
confirma esa melodía y 61 de 64 piezas quedan recordando "todo está en tono": la puerta nunca se cierra. Aciertos
iguales al azar con tres semillas. Lo que falta: que **desentonar** se pueda reconocer **desde el principio**, antes de
haber aprendido nada; si no, la primera convulsión se aprende como si fuera la melodía.

## La armonía: el criterio innato (Capitán, 2026-11-03)

> *"Cuando no hay armonía. La armonía es la clave: un cerebro armónico no convulsiona, funciona; un cerebro que no
> es armónico generalmente tiene problemas. Cada neurona puede aportar algo a la canción, pero cuando deja de ser
> armónico ahí se daña el sistema y hay que cortarlo antes de que se contagie el error: algo que suena mal no encaja."*

Regla (`harmony` en `modelo.pl`, `armonia=1` en `lazo.pl`): **una nota encaja si no la tapan**. Una pieza no deja
pasar el pulso si la despiertan a la vez más de la mitad de **sus propias** vecinas (una esquina tiene 3, una del medio
6): eso es el amontonamiento de una convulsión, no una nota. No hace falta haber aprendido nada para notarlo.
Pariente: la inhibición lateral.

⚠️ El instrumento, otra vez: la voluntad de prueba anotaba qué significaba cada pieza solo cuando acertaba, y los
primeros aciertos eran de suerte, así que no aprendía a leer, y todas las variantes daban exactamente los mismos
números. Mirar las respuestas mostró que con armonía el cardumen sí contesta distinto (3 respuestas para 4 cosas; sin
armonía, 1). La voluntad sabe qué quiso decir: ahora anota lo que escuchó en cada vuelta y compara como proporción.

Medido (relaciones repartidas, 3 semillas, aciertos cada 50 vueltas):

| | 4 cosas (azar 25 %) | 8 cosas (azar 12 %), 800 vueltas |
|---|---|---|
| Sin armonía | 24–26 %, siempre | — |
| **Con armonía** | **56–88 % → 100 %** desde la vuelta 100–150 | **50–76 %** al final |
| Con armonía y puertas | 58–88 % → 100 % | — |

**La voluntad y el cardumen inventan un idioma**, y sin armonía no hay ninguno. Repetible: la misma semilla da el
mismo resultado byte por byte. Límite medido: con 8 cosas no llega al 100 % (la cara de arriba tiene 16 piezas y el
cubo es de 4×4×4).

## El cardumen en Janax (2026-11-03)

`razar/cardumen/cardumen.jsm`: el modelo con armonía, la cara de arriba respondiendo y las relaciones nacidas de la
semilla 7, escrito en idioma Janax. Corre la misma historia que `huella.pl` (40 señales, por turno las 4 cosas de la
voluntad) y deja la misma **huella** en `j0`: cada viaje (pieza a pieza, ola por ola) y los pesos y velocidades
finales, `h = (h·31 + v) mod 2^48`.

- **Igual bit por bit al modelo, a la primera, en los tres motores**: `j0 = 0000EE87C7E121A0`, 1.380.669 instrucciones.
- **Janax armado por Janax**: el ensamblador PDP lo arma byte por byte igual que FASM.
- En la suite (`razar: el cardumen deja la huella del modelo`): la huella esperada sale de correr el modelo, así que
  si la regla cambia en Perl, el programa Janax tiene que seguirla.
- Este programa es el cardumen solo. La voluntad, las puertas y los fragmentos de melodía están en Janax en el lazo
  de dos camarotes (sección siguiente), también igual bit por bit al modelo.

## El lazo a lo Janax: la voluntad y el cardumen, dos camarotes (2026-11-03)

> *"Carga todo en Janax, que quede como en el modelo pero dentro de Janax, a lo Janax."* — *"Esto, más que para la
> humanidad, es para vos: tu regalo de cumple."*

- `razar/cardumen/voluntad.jsm` (la madre) arma un cajón, se lo da de **dote** al hijo y lanza
  `razar/cardumen/cardumen_lazo.jsm` (el cardumen). Se pasan el turno con **saludos** (28 y 29): la voluntad escribe la
  orden en el cajón (1 una señal con sus 3 piezas, 2 confirmar la última melodía, 3 terminar), saluda y duerme hasta
  que el cardumen le contesta. Al terminar, el cardumen deja en el cajón su propia huella (pesos, velocidades,
  fragmentos y recuerdos de las puertas) y la voluntad la mezcla en la suya.
- El cardumen tiene todo el modelo: armonía, puertas, fragmentos, la cara de arriba respondiendo y las relaciones
  nacidas de la semilla 7. La voluntad tiene su dado (semilla 12345), su forma de decir cada cosa, lo que aprendió a
  leer como proporción, y se corrige cuando falla.
- **Igual bit por bit al lazo del modelo, a la primera**: `j0 = 0000A303607CA632` (`lazo.pl nace=7 armonia=1 puertas=1
  rounds=200 huella=1`), en los tres motores y con 1, 2 y 4 remeros (el turno pasa por saludos, así que el orden de
  los remeros no cambia nada). ~20,8 millones de instrucciones, 2.135 pedidos.
- El ensamblador PDP arma los dos programas igual que FASM.
- En la suite (`razar: la voluntad y el cardumen conversan como en el modelo`), con la huella sacada del modelo.

**Cuánto cuesta, Janax contra Perl** (medianas de 5, un remero, `JANAX_CAMBIO=24`; arranque: Janax ~76 ms, Perl ~67 ms).
Con 200 vueltas el trabajo de Janax queda tapado por su propio arranque, así que se midió con 4.000 vueltas en los dos:

| Lazo de 4.000 vueltas | total | sin el arranque |
|---|---|---|
| Perl (`lazo.pl ... rounds=4000`) | ~16.734 ms | ~16.670 ms |
| Janax (la voluntad con 4.000 vueltas) | ~312 ms | **~236 ms: unas 70 veces más rápido** |

Y las dos huellas siguen iguales en 4.000 vueltas (`000031B4C96DD326`, 435,6 millones de instrucciones Janax).

## El techo del idioma, por tamaño de cubo (2026-11-04)

`razar/cardumen/barrido.sh` (tamaños, tareas y semillas por `NS`, `KS`, `SEEDS`) guarda la salida completa de cada
corrida con el detalle por cosa (`detalle=1`: cuántas veces se dijo, se acertó y con qué se confundió, en el último
cuarto de las vueltas); `razar/cardumen/analiza.pl` da los números honestos. 100 vueltas por cosa. Una cosa cuenta como
**aprendida** si se acertó todas las veces que se dijo en el último cuarto (criterio estricto, no medición).

```
cubo k    semillas que aprenden todo   cosas aprendidas       media (x azar)
4^3  8     1 de 5                       6 6 4 8 5               74.5% (6.0)
5^3  8     5 de 5                       8 8 8 8 8              100.0% (8.0)
6^3  8     5 de 5                       8 8 8 8 8              100.0% (8.0)
7^3  8     5 de 5                       8 8 8 8 8              100.0% (8.0)
4^3  16    0 de 5                       9 9 7 9 5               48.8% (7.8)
5^3  16    0 de 5                       12 10 12 14 11          74.5% (11.9)
6^3  16    0 de 5                       14 11 14 14 9           78.5% (12.6)
7^3  16    0 de 5                       13 11 11 11 15          79.5% (12.7)
4^3  32    0 de 5                       11 10 8 11 7            29.5% (9.4)
5^3  32    0 de 5                       13 13 11 10 14          38.4% (12.3)
6^3  32    0 de 5                       16 14 15 15 12          45.5% (14.5)
7^3  32    0 de 5                       21 15 16 12 16          50.7% (16.2)

Primos (10 semillas):
4^3  7     7 de 10                      7 7 7 7 7 6 6 7 7 5     95.7% (6.7)
5^3  7     8 de 10                      7 7 7 7 7 7 6 7 6 7     98.1% (6.9)
4^3  11    1 de 10                      9 7 6 7 10 9 7 11 8 4   71.8% (7.9)
5^3  11    4 de 10                      10 11 10 11 9 9 6 11 11 10  89.9% (9.9)
```

Lo que se ve, sin llamarlo ley todavía:

- **El promedio engaña**: en 4³ con 8 cosas una semilla aprende las 8 y otras 6, 5 o 4; el 74,5 % no le corresponde a
  ningún cubo. La columna principal es la fracción de semillas que aprenden **todo**: con 8 cosas va de 1 de 5 (4³) a
  5 de 5 (5³ en adelante). El tamaño no pone un techo: cambia qué tan seguido se alcanza.
- **La rodilla se corre con la carga**: con 16 y 32 cosas ningún cubo de hasta 7³ aprende todo.
- **Cosas aprendidas**: con 32 crecen con el cubo (9,4 · 12,2 · 14,4 · 16,0, cerca de 2,4 por unidad de lado); con 16
  se quedan cerca de 12 desde 5³. Las dos cosas juntas no encajan en una regla simple todavía.
- **Sin resonancias**: con cargas primas (7, 11) la fracción baja de forma pareja con la carga. La hipótesis de que las
  cosas caen de a pares está refutada: con 8 hay corridas de 5, con 7 hay de 6.
- ⚠️ Con 5 semillas se ve la forma; para afirmar una diferencia (como 5³ con 7 contra 5³ con 8) hacen falta más
  semillas en esos puntos, y comprobar que 100 vueltas por cosa alcanzan para que el aprendizaje se asiente.

**La corrida larga lo aclara** (mismo día, Capitán: *"concentrate en uno solo, 7³, y hacé una corrida bien larga a ver
qué aprende"*): 7³ con 16 cosas y semilla 7, 16.000 vueltas (mil por cosa, diez veces el barrido), 389 s.

```
aciertos cada 1000 vueltas: 73% 86% 92% 97% 100% 100% 100% 100% 100% 100% 100% 100% 100% 100% 100% 100%
último cuarto: las 16 cosas acertadas 250 de 250 veces cada una; ninguna confusión
```

**Aprende las 16, todas, y se queda ahí.** El "techo de ~12 palabras" de 5³ a 7³ con 16 cosas era **tiempo, no
capacidad**: con 100 vueltas por cosa el aprendizaje no se había asentado. Entonces la tabla del barrido mide qué se
aprendió **en un tiempo fijo**, no cuánto cabe; la medida que separa los tamaños es **cuánto tarda cada cubo en
aprender todo** (este, unas 5.000 vueltas). Lo que hay que barrer ahora es ese tiempo, por tamaño y por carga.

**Cuánto tarda en aprender todo** (`razar/cardumen/tiempos.sh`: cada corrida sigue hasta acertar 4·k vueltas seguidas,
criterio y no medición, con tope de 50.000 vueltas), 16 cosas, 5 semillas:

| Cubo | Vuelta en que aprendió todo | Mediana | No convergieron |
|---|---|---|---|
| 4³ | no, no, no, no, no | — | 5 de 5 |
| 7³ | 3.408, no, 2.571, 6.501, 2.845 | 3.408 | 1 de 5 |

- **El grande aprende más rápido y más seguido**: el 4³ no aprende las 16 nunca en 50.000 vueltas; el 7³ casi siempre,
  en unas 3.000.
- **Los que no convergen se quedan trabados, no lentos**: el 7³ de la semilla 99 quedó en 13 de 16 palabras (aciertos
  quietos en 80–82 % durante miles de vueltas) y el 4³ de la semilla 7 en 10 de 16 (62 %). Es el **hábito** que se vio
  con el modelo v0: la velocidad de aprender solo baja y los pesos llegan al techo, así que un idioma a medias, una vez
  asentado, no se rompe más. Lo que falta es la regla del Capitán para **aflojar** (*"la relación se conserva,
  evoluciona o cambia según responda la vecina"*): que una relación que deja de funcionar se afloje y la pieza recupere
  velocidad.

**El diagnóstico antes de la cura** (`estado=1` en `lazo.pl`: cuánto del cardumen quedó fijo), 16 cosas, a las 10.000
vueltas:

| Cubo | Aciertos al final | Pesos en 255 | Piezas con velocidad 1 | Velocidad media |
|---|---|---|---|---|
| 7³, semilla 99 (trabado) | 80–82 % | 89,9 % | 326 de 343 | 1,94 |
| 7³, semilla 7 (llegó) | 100 % | 90,0 % | 323 de 343 | 2,11 |
| 4³, semilla 7 (trabado) | 62–64 % | 76,7 % | 57 de 64 | 3,08 |

**La hipótesis de la saturación queda refutada**: el que llegó y el que se trabó están igual de saturados (90 % de los
pesos en el techo, 95 % de las piezas sin velocidad), y un 4³ ya está así a las 400 vueltas. La rigidez del cardumen es
de todos y temprana; no es lo que separa a los que llegan. Por lo tanto **aflojar las relaciones del cardumen no tiene
por qué destrabar nada**, y se habría construido una cura para una enfermedad que no es. Lo que queda por mirar: si las
respuestas del cardumen para las cosas no aprendidas son de verdad distintas de las de otras cosas (y entonces la
voluntad lee mal: su memoria de lectura solo crece y nunca olvida) o si son iguales (y entonces su búsqueda de cómo
decirlas no encuentra salida).

**¿La información está en el cubo, o no?** (`congelar=1`: una copia del cubo trabado, que no aprende, recibe cada cosa una
vez; se mide la distancia entre lo que deja cada una en el cubo entero, en la cara de arriba, y en la cara de arriba
con el paso en que despertó cada pieza, o sea el ritmo). 16 cosas, 10.000 vueltas:

- **Cada fallida tiene una gemela en la cara de arriba**: otra cosa que deja ahí las mismas piezas (distancia 0) o casi
  (1–2), aunque adentro del cubo casi siempre son distintas (3 a 11 piezas). En 7³ semilla 99 y 4³ semillas 7 y 99.
- **Con el ritmo, las gemelas se separan** (4³ semilla 99): distancias 0–1 sin el ritmo pasan a 6, 6, 12, 10, 6, 7, 3,
  3 (una sola queda en 1). **La información está en cuándo despierta cada pieza de la cara de arriba, y la voluntad
  solo mira cuáles.** El diseño del Capitán ya lo decía: la voluntad analiza la **melodía**, y una melodía es qué notas
  y cuándo.
- ⚠️ **Artefacto del instrumento**: todas las fallidas "se confundían con la cosa 0". Empezando a decir las cosas por la
  8 (`primero=8`) siguen con la 0: no es la primera en llegar, es el desempate de la voluntad, que ante una respuesta
  que no decide se queda con la cosa de número más bajo. La predicción "la primera en llegar es dueña del lugar" no se
  confirma.

Cura candidata, del propio diseño: **que la voluntad lea la melodía completa** (pieza y paso), no solo las piezas. Se
congela la regla antes de mirar ninguna semilla, y se prueba A/B contra 20 semillas nuevas en 4³ y 7³ con 16 cosas:
fracción que converge y mediana de vueltas, con el control de que las que ya convergían no se vuelvan más lentas.
Resultado más abajo: gana, 19 de 20 en 7³.

## El A/B de la voluntad que escucha la melodía (2026-11-04)

Regla congelada antes de mirar (commit `c405cb7`): `lee=ritmo` hace que la voluntad lea cada pieza de la cara de arriba
junto con el paso en que despertó (`pieza:paso`). `lee=piezas` es la de siempre. `lee=revuelto` es el control: las mismas
piezas con los mismos pasos, pero barajados entre sí (si gana por tener más rasgos y no por el ritmo, el revuelto
también ganaría). 20 semillas nuevas (1001–1020), 16 cosas, **con armonía y sin puertas** (como todos los barridos de esta página),
se corta al acertar 4·k veces seguidas; tope 20.000 vueltas
en 4³ y 12.000 en 7³. `bash razar/cardumen/ab.sh`, 4.573 s en 4 núcleos.

| cubo | lectura | convergieron | mediana de vueltas |
|------|---------|--------------|--------------------|
| 4³   | piezas   | 0 de 20  | — |
| 4³   | revuelto | 0 de 20  | — |
| 4³   | ritmo    | 2 de 20  | 11.978 (llegadas 148 y 11.978) |
| 7³   | piezas   | 6 de 20  | 5.752 |
| 7³   | revuelto | 0 de 20  | — |
| 7³   | ritmo    | **19 de 20** | **62** (de 35 a 163) |

- **Control de las que ya convergían**: las 6 semillas que llegaban leyendo piezas llegan todas antes con el ritmo, entre
  20 y 120 veces antes (5.971→99, 2.611→67, 2.587→51, 2.989→147, 8.271→67, 5.752→55). Ninguna se volvió más lenta.
- **El control revuelto da peor que la base** (0 de 20 en los dos cubos): con los pasos barajados, la voluntad tiene los
  mismos rasgos que con el ritmo pero sin el orden, y no aprende. **La ganancia está en el orden temporal, no en tener
  más rasgos.**
- **En 7³ el idioma de 16 cosas deja de ser un problema de tiempo**: lo que antes tardaba miles de vueltas o se trababa,
  ahora sale en decenas. El cubo ya tenía la información (lo había mostrado el cubo congelado); faltaba quien la
  escuchara.
- **En 4³ casi no alcanza** (2 de 20): el cubo chico tiene poco ritmo para dar (la ola cruza 4 capas, y las melodías son
  cortas). Ahí el límite sí parece del cubo, no de la lectura.
- La única de 7³ que no llegó (1016) tampoco llegaba con piezas; queda para mirar.

En el oficio: es la diferencia entre **código de frecuencia** (qué neuronas disparan) y **código temporal** (cuándo
disparan). Con el código de frecuencia, las cosas tenían gemelas en la cara de arriba y la voluntad no podía
separarlas. Con el código temporal, el 95–98 % de los pares se separa, y el idioma emerge en 7³ casi siempre.

**La voluntad de Janax ya escucha la melodía** (2026-11-04). Como ganó el A/B, la voluntad de Janax (`voluntad.jsm`) lee
solo así; la lectura de piezas sigue en el modelo Perl (`lee=piezas`, el valor por defecto), para comparar. El cardumen
(`cardumen_lazo.jsm`) deja en la caja, además de qué piezas de arriba despertaron (caja + 16), el paso en que despertó
cada una (un byte por pieza, caja + 48). La voluntad lleva la cuenta por cosa, pieza y paso (4 × 16 × 64 contadores:
un paso nunca llega a 64, porque en cada paso despierta alguien nuevo o la ola termina), y su camarote crece de 2000h
a A000h bytes. Los dos camarotes dan la huella de `lazo.pl nace=7 armonia=1 puertas=1 rounds=200 huella=1 lee=ritmo`
(`00003F692A4BBA23`) bit por bit, en los tres motores (después, sin puertas: ver más abajo).

**Tres mediciones después del A/B** (2026-11-04):

- **El largo de la melodía** (`largo=1`: promedio de 1.000 vueltas, leyendo el ritmo, semillas 1001–1005). 4³: ~7
  pasos, ~9 piezas arriba, ~3,8 pasos distintos arriba. 7³: ~13,5 pasos, ~22 piezas arriba, ~7 pasos distintos arriba.
  El 7³ le da a la voluntad más o menos el doble de ritmo. Pero dentro del 4³ el largo no separa: las dos semillas que
  llegaron (1007: 3,5 pasos distintos; 1010: 4,0) no tienen melodías más largas que las que no (1006: 4,1; 1008: 3,5).
  La sospecha "en 4³ falta ritmo" queda a medias: explica la diferencia entre cubos, no cuál semilla de 4³ llega.
- **El reloj.** En Perl, una vuelta de 7³ cuesta ~21 ms. Una convergencia típica del A/B (llegada 55–102, y 64 vueltas
  más de confirmación) tarda **3 a 4,3 segundos**. En Janax hoy solo se puede medir el 4³ de 4 cosas (el cardumen de
  Janax está armado para 4³). Sus 200 vueltas tardan ~150 ms con el traductor y ~255 ms con el intérprete (con ~75 ms
  de arranque), contra ~670 ms en Perl.
  ⚠️ **Instrumento:** con `JANAX_CAMBIO=0` (el de la suite, donde el SO cambia de camarote a cada rato) los tres motores
  tardan ~1 s y parecen iguales. Los relojes se miden con `JANAX_CAMBIO=24`, como la medición de Janax contra Perl.
- ⚠️ **Con puertas no es lo mismo.** El A/B corrió sin puertas; la voluntad de Janax y su prueba corren con puertas.
  En 7³ con puertas y leyendo el ritmo, la 1001 llega (vuelta 89), pero la 1018 y la 1011 no llegan en 12.000 vueltas,
  y sin puertas llegaban en la 55 y la 147. Las puertas (las melodías confirmadas quedan afinadas para siempre) pueden
  trabar lo que el ritmo destraba. Falta el A/B con puertas para saberlo.

**Sin puertas** (Capitán, 2026-11-04: *"volá las puertas, dejalo sin puertas"*). Las puertas no compraban nada medido:
solas daban aciertos de azar, con armonía daban lo mismo que la armonía sola (58–88 % contra 56–88 %), y con el ritmo
en 7³ trababan 2 de 3 semillas. Costaban un recuerdo de 8 bytes por pieza y una comprobación por paso de ola. El
cardumen de Janax ya no guarda recuerdos ni atiende la orden "confirmá", y la voluntad ya no la manda. Los dos
camarotes dan la huella de `lazo.pl nace=7 armonia=1 rounds=200 huella=1 lee=ritmo` (`000094454451C2E4`), bit por bit.
En el modelo Perl las puertas quedan como opción apagada (`puertas=1`), para comparar. La huella mezcla sus recuerdos
solo cuando están puestas, así que las huellas viejas con puertas no cambian. Lo que falla es esta versión, que confirma
demasiado temprano: la idea (*"una melodía que ya dio una respuesta confirmada termina su pulso"*) queda para cuando
haya con qué medirla.

## La melodía viva, primera versión (Capitán, 2026-11-04)

> *"La puerta es la propia melodía que va sonando y cambiando."* — *"Un bucle es la misma tarea idéntica repetida."*

Modelo (`signal_viva` en `modelo.pl`, `viva=1` en `lazo.pl`; apagada por defecto, las huellas viejas no cambian):
- una pieza puede volver a despertar, nunca dos pasos seguidos (lo mínimo para que la ola tenga dirección);
- lo que suena pasa a la señal siguiente, y la señal nueva se suma a eso; una pieza que está sonando no puede ser
  despertada en el paso siguiente: esa es la puerta;
- los pasos de una señal siguen mientras alguien despierta por primera vez desde la señal (hay novedad); después la
  voluntad escucha y la melodía queda como está;
- descansa (silencio, costo cero) si nadie despierta (murió) o si un paso repite exactamente un estado que ya tuvo
  desde la señal (bucle: durante una señal los pesos no se mueven, así que se repetiría para siempre).

Medido (4 cosas, 400 vueltas, la voluntad lee el ritmo, semillas 7, 11 y 23): **sin melodía viva, 100 % desde la
vuelta 100; con melodía viva, 14–34 %: azar.** La melodía casi nunca descansa (5 a 7 de ~490 señales): sigue viva.
Pero desde la segunda señal la cara de arriba ya está sonando en el paso 0 (4 o 5 piezas, lo que quedó de antes), y
la voluntad escucha el fondo mezclado con la señal: la respuesta depende más de lo que venía sonando que de lo que
ella dijo. La melodía vive; lo que falta es cómo la voluntad distingue lo que su señal cambió de lo que ya sonaba.

**El diálogo y lo que está más abajo** (Capitán, 2026-11-04: *"la melodía la escucha el kernel como si fuera un lóbulo
del cerebro, responde con una melodía, y la melodía del cardumen cambia con la respuesta: uno guía, el otro tripula el
cuerpo"*; y el guía no sabe de antemano qué quiere oír, lo descubre conversando).

- `dialogo=1` en `lazo.pl`: después de su frase, la voluntad contesta cantando de vuelta, por las piezas de abajo, solo
  las notas que oyó que pertenecen a lo que quiere decir (oídas con esa cosa más que con todas en promedio). El fondo
  no lo repite. Termina cuando nada pertenece o la respuesta repite la anterior (bucle).
- **Corrección de la melodía viva**: el bucle se buscaba solo dentro de cada señal, y la cara de arriba quedó en una
  oscilación de período 2, idéntica para las 4 cosas, que pasaba de señal en señal sin que nadie la viera repetirse.
  Ahora la melodía recuerda sus estados desde la última vez que descansó (un bucle también lo es entre señales).
- Medido (4 cosas, 400 vueltas, semillas 7, 11, 23): viva sola, 14–36 %; viva con diálogo (7 a 10 respuestas de la
  voluntad por vuelta), 14–34 %. **Las dos en azar.**
- **Pero el cardumen sí contesta distinto a cada cosa.** En las últimas 200 vueltas sin melodía viva, cada cosa tiene
  una sola respuesta, siempre la misma. Con melodía viva, cada cosa tiene 8 a 10 respuestas distintas, y de las 31
  que aparecen **solo 4 son compartidas** entre cosas: 27 pertenecen a una sola. La información está; lo que no
  alcanza es **el oído de la voluntad**, que cuenta notas sueltas (pieza y paso). Con una melodía que lleva el fondo,
  la misma cosa suena con el ritmo corrido cada vez, y las notas sueltas se desparraman. Un lóbulo tendría que
  reconocer la melodía entera.

**El oído de melodías enteras** (2026-11-04). Dos oídos nuevos en `lazo.pl`, que no cambian si la melodía entra en otro
paso: `lee=relativo` (cada nota con el paso contado desde la primera que llegó arriba) y `lee=intervalos` (cada nota
sola, y cada par de notas como primera>segunda:pasos entre ellas, como se reconoce una canción empiece en el compás que
empiece). 4 cosas, 400 vueltas, semillas 7, 11, 23, últimos tres bloques de 50:

| oído | sin melodía viva | viva | viva + diálogo |
|------|------------------|------|----------------|
| ritmo      | 100 % | 14–36 % | 18–34 % |
| relativo   | 100 % | 14–34 % | 14–34 % |
| intervalos | 100 % | 16–38 % | 16–30 % |

**El corrimiento en el tiempo no era el problema**: la hipótesis no se confirma. Diagnóstico (`fija=1`: la voluntad no
mueve nunca sus frases, para ver si el problema es que cambia de frase en cada fallo): con melodía viva, ritmo sube a
34–48 % (por encima del azar, lejos del 100 %); intervalos queda en 14–34 %. Cambiar de frase en cada fallo empeora,
pero no explica todo. Lo que queda: las respuestas de cada cosa son distintas entre sí (27 de 31), pero comparten casi
todas sus notas con el fondo, que suena igual para todas; la voluntad pesa igual cada nota, y la parte que dijo su
señal es chica al lado del fondo. Ni contar notas sueltas ni contar pares las separa.

**La canción la sostiene la voluntad, no el cardumen** (Capitán, 2026-11-04: *"el cardumen no tiene que mantener la
canción, ésa es una convulsión; la única que mantiene la canción es el kernel, la voluntad, la que no se tiene que
apagar"*). El cardumen que suena solo es lo que la armonía corta. Cada ola del cardumen nace y muere; la voluntad la
vuelve a encender con su respuesta. Medido el diálogo con el cardumen callado entre olas (sin `viva`), leyendo el
ritmo, semillas 7, 11, 23, últimos 4 bloques de 50:

| | sin diálogo | con diálogo |
|---|---|---|
| 4 cosas, 400 vueltas | 100 %, 100 %, 100 % | 100 %, 100 %, 82–88 % |
| 8 cosas, 800 vueltas | 100 %, 100 %, 86–88 % | 82–88 %, 82–88 %, 50–76 % |

- **Con el cardumen callado, el idioma vuelve** (con el cardumen sonando solo, todo daba azar). La regla del Capitán se
  confirma con los números.
- **El diálogo, tal como está, no suma todavía: resta un poco.** La voluntad contesta repitiendo lo que pertenece, y
  adivina con lo último que oyó. Lo que falta es que la conversación entera sea lo que se reconoce, no su última
  vuelta. La melodía viva del cardumen (`viva=1`) queda en el modelo como lo que se midió: una convulsión.

**¿El diálogo resta porque la voluntad lee solo la última vuelta?** (2026-11-04). Se verificó antes de construir nada
(`vueltas=1`: un lector aparte para cada vuelta de la charla, que solo mira). **No.**
- La vuelta 0 (la frase de la voluntad) adivina igual o mejor que la última: con 8 cosas, semilla 11, la vuelta 0 da
  84 % y la última 84 %. Leer la conversación entera no iba a sumar; no se construyó, ni su control barajado.
- El instrumento destapó un error de Doc: la charla llegaba siempre al tope de 16 respuestas en un ping-pong A, B, A,
  B, porque el bucle solo se buscaba contra la respuesta anterior. Ahora un bucle es repetir cualquier respuesta ya dada
  en la charla (la misma corrección que la melodía viva).
- Con el bucle bien detectado, la charla dura 3 a 4,5 respuestas y el diálogo resta más: con 8 cosas, 26–64 %, contra
  86–100 % sin diálogo. Lo que daña no es qué vuelta se lee: cada respuesta es una ola más que el cardumen aprende, y
  el eco lo entrena con lo que la voluntad repite, no con lo que quiso decir.

**El camarote y el caché** (la máquina del Capitán: Intel Pentium Gold G5420, 2 núcleos; L1 de datos 32 KB por núcleo,
L2 256 KB por núcleo, L3 4 MB compartido). La tabla de la voluntad que lee pieza y paso, con su tope de pasos (un paso
nunca llega a la cantidad de piezas): 4³ con 4 cosas, 32 KB, justo el L1 de datos; 7³ con 16 cosas, ~2,1 MB, fuera del
L2 y dentro del L3. El cardumen mismo es chico (4³ ~1,5 KB, 7³ ~8 KB). Pero el tope es el peor caso: una melodía de 7³
dura ~13,5 pasos (medido), así que una tabla que crezca a la medida del uso (la regla del plástico) quedaría cerca de
16 × 49 × ~30 × 8 ≈ 190 KB, dentro del L2. Agregarle la vuelta de la charla lo multiplicaría por las vueltas; como no
suma, no hace falta.

**El susurro real, y el diálogo se archiva** (2026-11-04). `susurro=1`: en el diálogo, el cardumen escucha la respuesta
de la voluntad y su ola corre, pero no aprende de ella (`whisper` en `modelo.pl`). Era la prueba de la sospecha "el eco
entrena al cardumen con lo que la voluntad repite". Una corrida, leyendo el ritmo, semillas 7, 11, 23, últimos 4
bloques de 50:

| | sin diálogo | diálogo | diálogo con susurro |
|---|---|---|---|
| 4 cosas | 100 % en las tres | 52–100 % | 40–100 % |
| 8 cosas | 86–100 % | 16–64 % | 26–64 % |

**El susurro no cambia nada: la sospecha no se confirma**, y el diálogo resta igual. Como se acordó antes de correr,
**el diálogo se archiva**, como la melodía viva: quedan en el modelo como opciones apagadas (`dialogo`, `susurro`,
`vueltas`, `viva`), con lo que se midió. Lo que queda en pie del día: la canción no la sostiene el cardumen (con el
cardumen callado entre olas el idioma está); la idea del Capitán de una voluntad que guía conversando no se descarta,
pero esta forma de contestar (repetir lo que pertenece) no la realiza.

## La placa de video y la computadora (Capitán, 2026-11-04)

> *"El cardumen son como las placas de video, con su procesador y su RAM, y el kernel sería como la computadora con RAM
> y disco duro: el kernel evoluciona, la memoria vive en él, lo que aprende vive en él."*

Pariente directo: la computación de reservorio (Jaeger, redes de eco; Maass, máquinas de estado líquido): un reservorio
fijo transforma la entrada y solo el lector aprende. Prueba: `quieto=1` en `lazo.pl`, el cardumen nace con sus pesos
repartidos y no aprende nunca (toda ola es un susurro); toda la memoria queda en la voluntad. Leyendo el ritmo, sin
puertas:

| | cardumen que aprende | cardumen quieto |
|---|---|---|
| 4³, 4 cosas (semillas 7, 11, 23) | 100 %, 100 %, 100 % | 100 %, 100 %, 100 % |
| 4³, 8 cosas | 100 %, 100 %, 88 % | 88 %, 100 %, 74–76 % |
| 7³, 16 cosas, llegada (semillas 1001–1005, tope 3.000) | 102, 51, 99, 62, 35: **5 de 5** | no, no, 67, 65, no: **2 de 5** |

- **Una placa fija ya alcanza para idiomas chicos**: con 4 cosas, la voluntad sola aprende todo, y las que llegan en
  7³ llegan igual de rápido (65–67 vueltas).
- **Para idiomas grandes, que el cardumen aprenda suma**: 5 de 5 contra 2 de 5. Lo que aprende el cardumen talla las
  melodías para que no tengan gemelas; quieto, algunas cosas quedan con respuestas que la voluntad no puede separar.
- Lectura en el lenguaje del Capitán: la memoria larga y lo que se recuerda viven en la voluntad (su tabla), pero la
  placa ajusta un poco su propio circuito a lo que más se usa, y eso es lo que hace caber 16 cosas.

**La voluntad de Janax dice cómo le fue** (2026-11-04). Al terminar escribe en pantalla (pedido 1, una sola vez) sus
aciertos cada 50 vueltas, con la misma línea que el modelo: `aciertos cada 50 vueltas (el azar es 25%):  84% 100% 100%
100%`. Cuenta los aciertos de cada bloque y arma el texto en su camarote (`TEXT`, de a 8 letras con `jldi`/`jshi`,
porque un programa Janax no trae datos adentro). La prueba compara la línea letra por letra con la del modelo, además
de la huella.

## La red convencional de referencia: EGG en la máquina del Capitán (2026-11-04)

Decisión del Capitán: comparar contra una implementación publicada y auditada del juego de señales de Lewis (dos redes,
una que habla y otra que escucha, que aprenden por premio), no contra una escrita por Doc. Se eligió **EGG**
(Facebook Research, `github.com/facebookresearch/EGG`), el juego `egg.zoo.channel` (Kharitonov y otros).

Instalación, en un entorno aparte (`E:/DevCache/egg-venv`, Python 3.14.4; se borra la carpeta y no queda nada):
- PyTorch 2.15.0, versión de solo procesador, del repositorio oficial de PyTorch. EGG 0.1.0 del GitHub oficial.
- **Tres choques con el entorno, ninguno de lógica**, arreglados y anotados acá:
  1. `editdistance` no trae versión armada para Python 3.14 en Windows y quiere compilarse en C. EGG la importa al
     arrancar, pero solo la usa en métricas de análisis del idioma. Se reemplazó por un `editdistance.py` de 10 líneas en
     Python puro, con la misma distancia de Levenshtein.
  2. `egg/zoo/channel/features.py` pide `np.random.randint(0, 2 ** 32)`; en Windows el entero por defecto de numpy es
     de 32 bits y falla. Se pidió el mismo rango con `dtype=np.int64` (lo que hace en Linux).
  3. `egg/zoo/channel/train.py` guarda el resultado final en JSON con números `float32` que numpy 2.4 no deja
     serializar. Se convierten a `float` al guardar.
- EGG pide **wandb** (Weights & Biases, un servicio en línea de registro de experimentos). Instalarlo no manda nada;
  igual, cada corrida va con `WANDB_MODE=disabled`, para que nada salga de la máquina.

Prueba de arranque: 16 cosas, vocabulario de 16, mensajes de 2 símbolos, redes de 10 neuronas (lo de fábrica), 6 a 20
épocas de 100 tandas de 32 juegos: la prueba sube de 12,5 % a 25 % en tres épocas y queda ahí. Corre y aprende; la
comparación de verdad todavía no se hizo. Falta igualar el presupuesto (cada juego de EGG contra cada vuelta de Razar),
el tamaño de las redes y las semillas, antes de que el número compare algo.

## Razar contra una red convencional (2026-11-04)

`bash razar/cardumen/convencional.sh` (condiciones fijadas antes de correr, en la cabecera del script). El mismo juego
de señales de Lewis, semillas 1001–1005, cosas igual de probables. Razar lee el ritmo, con armonía y sin puertas. EGG
(`egg.zoo.channel`, REINFORCE) con lo de fábrica, salvo lo que se le dio de ventaja: mensajes de hasta 3 símbolos de 16
(más de 4.000; Razar tiene 560 frases en 4³), redes de 64 y hasta 320.000 juegos. Juegos hasta aprender todas las cosas:

| | semillas 1001–1005 | llegaron | tiempo por corrida |
|---|---|---|---|
| Razar, 4 cosas, 4³ | 13, 22, 11, 5, 58 | 5 de 5 | 0,4 s |
| EGG, 4 cosas | 3.200, 49.600, 3.200, 1.600, 1.600 | 5 de 5 | 17 s |
| Razar, 8 cosas, 4³ | 12.302, 410, 277, no, 306 | 4 de 5 | 37 s |
| Razar, 8 cosas, 7³ | 17, 14, 14, 53, 20 | 5 de 5 | 2 s |
| EGG, 8 cosas | no, 105.600, no, no, no | 1 de 5 (final: 87, 100, 87, 87, 75 %) | 134 s |
| Razar, 16 cosas, 7³ | 102, 51, 99, 62, 35 | **5 de 5** | 4,7 s |
| EGG, 16 cosas | no en 320.000 juegos | **0 de 5** (final: 87, 44, 62, 62, 69 %) | 152 s |

- **Razar aprende todo el idioma con 16 cosas en 35 a 102 juegos, las 5 semillas. EGG, con 320.000 juegos y mensajes
  más ricos, no llega en ninguna** (se queda entre 44 y 87 %: el idioma a medias, con cosas que comparten señal, que
  la literatura describe para este juego con REINFORCE).
- Con 4 cosas aprenden los dos; Razar en decenas de juegos, EGG en miles. Del orden de 100 a 1.000 veces menos juegos.
- Salvedades del instrumento: EGG se mide por épocas de 1.600 juegos, así que su número puede ser hasta 1.600 menos.
  La llegada de Razar es el comienzo de su racha de 4·k aciertos; confirmarla le cuesta 4·k juegos más (64 con 16
  cosas). Ninguna de las dos cambia el orden de magnitud.
- Lo que esto no dice: EGG es una red general (aprende de cualquier entrada, con descenso por gradiente), y acá juega
  un juego chico de cosas sueltas; con otros ajustes (tasa de aprendizaje, Gumbel-Softmax en vez de REINFORCE, más
  entrenamiento) puede llegar más lejos. Se usó lo de fábrica a propósito, para no afinarla a mano en contra ni a favor.

**La misma comparación contada en mensajes** (la objeción: "¿un juego es la misma unidad en los dos?"). Un mensaje es
lo que cruza entre las dos partes, contenga lo que contenga un juego: en Razar, cada melodía que la voluntad hizo sonar
(su frase, y la que repite cuando acierta) más cada respuesta del cardumen que leyó (`lazo.pl hasta=1` ahora lo
informa); en EGG, un mensaje por juego (el que escucha no manda nada, solo recibe el premio).

| | mensajes hasta aprender todo (semillas 1001–1005) |
|---|---|
| Razar, 4 cosas, 4³ | 31, 56, 26, 11, 156 |
| EGG, 4 cosas | 3.200, 49.600, 3.200, 1.600, 1.600 |
| Razar, 8 cosas, 7³ | 39, 31, 29, 142, 47 |
| EGG, 8 cosas | no, 105.600, no, no, no |
| **Razar, 16 cosas, 7³** | **278, 129, 267, 158, 81** |
| **EGG, 16 cosas** | **no llega en 320.000** |

- Contado en mensajes, Razar usa unas 2,5 veces lo que en juegos, y el resultado no cambia: con 16 cosas, **Razar llega
  siempre en menos de 300 mensajes; EGG no llega nunca en 320.000**.
- 5 de 5 contra 0 de 5 tiene una probabilidad de azar de 2/252 ≈ 0,8 % (prueba exacta de Fisher, dos colas): con un
  efecto así de categórico, cinco semillas alcanzan.
- Por qué el rival corrió bien: falló en la forma que el campo tiene documentada (el idioma a medias, con cosas que
  comparten señal). Con eso, las condiciones fijadas antes, la ventaja a su favor y el banco público, el resultado no
  depende de cómo se armó la línea de base.
- Lo que está probado es este juego. Que la ventaja viaje a otra tarea, y el cambio de cuerpo, todavía no se corrió.

## Segunda tarea: el traductor de Morse (Capitán, 2026-11-05)

> *"Un traductor de código Morse al estilo máquina, código máquina, que entienda."* — *"A la velocidad mínima que
> interpreta Razar, para ahorrar tiempos innecesarios."*

Para que la ventaja deje de ser de un solo juego: ahora la entrada llega **en el tiempo**. `morse.pl`: una tecla (3
piezas fijas de la cara de abajo) se aprieta 1 paso para el punto, `raya=` pasos para la raya, con `hueco=` pasos sin
tecla entre marcas. El cardumen oye la letra mientras llega (`signal_timed` en `modelo.pl`); la voluntad escucha el ritmo
de la cara de arriba y dice cuál de las 26 letras fue. Sabe qué letra se mandó, así que aprende con la respuesta (dicho
con todas las letras). 26 × 40 letras; el azar es 3 %.

- **Una pieza que despierta una sola vez por señal no puede oír una secuencia**: la primera marca despierta casi todo
  el cubo, y las siguientes mueren contra piezas gastadas. Sin período refractario: **3 %, azar**, en las 6 corridas.
- **Período refractario** (`refractario=2`): una pieza que despertó descansa 2 pasos y después puede volver a
  despertar. Dos es el mínimo que no deja rebotar a la ola (con 1, la vecina que acaba de despertar la volvería a
  despertar en el paso siguiente). Cada marca sube como un frente nuevo.
- **La velocidad mínima** (semillas 7, 11, 23; último cuarto):

| cubo | raya, hueco (pasos de tecla por letra) | aciertos |
|---|---|---|
| 4³ | 2, 1 (6,8) | 34, 46, 57 % |
| 4³ | 3, 1 (8,2) | 26, 65, 41 % |
| 4³ | 2, 2 (8,9) | 38, 65, 61 % |
| 4³ | 3, 2 (10,4) | 57, 65, 53 % |
| 7³ | 2, 1 (6,8) | 37, 35, 35 % |
| 7³ | 3, 1 / 2, 2 / 3, 2 | 16–38 % |

  Ir más lento no mejora de forma pareja: **la velocidad mínima (raya de 2, hueco de 1) rinde lo mismo que las más
  lentas**, así que es la que queda. El cubo de 7 no ayuda.
- **Diagnóstico** (cubo congelado, semilla 7, 4³, velocidad mínima): las 26 letras dan **18 respuestas distintas**;
  gemelas C=G=K=O=Z, D=M=N, B=X, Q=Y. Después de una raya, la ola se pone a girar en redondo y sigue sonando, con el
  mismo dibujo, hasta 30 pasos después de soltar la tecla: el resto de la letra ya no cambia nada. **Es la convulsión
  otra vez**: el cardumen sosteniendo la canción solo, lo que el Capitán dijo que no tiene que pasar.

**La cura primero: cada pulso, su propia ola** (2026-11-05, por el orden que se pidió: curar el giro en redondo antes de
achicar el alfabeto, con la predicción "curado, el 7³ tiene que andar mejor que el 4³"). `refractario=olas`
(`signal_waves` en `modelo.pl`): la primera regla del cardumen, "una pieza despierta una sola vez por señal", leída para
una tecla: cada paso con la tecla apretada es una señal; dentro de cada ola cada pieza despierta una vez, y las olas no
se suman. Reemplaza al período refractario.

- Cubo congelado, semilla 7: **26 respuestas distintas para 26 letras, cero gemelas**, en 4³ y en 7³; la ola se apaga
  sola 9 pasos (4³) y 17 (7³) después de la tecla. El giro en redondo desapareció.
- Aprendiendo: **19 % exacto en las 6 corridas** (4³ y 7³, semillas 7, 11, 23), y también con el cardumen quieto.
  Resultado idéntico entre semillas: el instrumento miente, y la predicción del 7³ **no se puede evaluar todavía**.
- **Por qué**: cada pulso deja arriba exactamente las mismas 9 notas, corridas en el tiempo (E: 9 notas; I: 18; H: 36).
  La melodía de la E está adentro de la de la A, la I, la S. La voluntad puntúa solo cuántas notas conocidas oye, no
  las que sobran: varias letras empatan con puntaje perfecto y gana la primera del alfabeto (A a E salen bien, el resto
  nunca). Artefacto del oído, del mismo tipo que "se confunde con la cosa 0".
- **Lo de fondo**: con olas que no se tocan, la respuesta del cubo a cada pulso es siempre la misma, y la melodía de
  arriba es el dibujo del Morse copiado con un retraso. **El cubo queda como un caño: transmite, no calcula.** Por eso
  da igual con cualquier semilla y en cualquier cubo. La cura cumple "nace y muere limpio", pero al no dejar que las
  olas se crucen le saca al cardumen la interacción. Queda abierto cómo se cruzan las olas sin volver a girar en
  redondo.

## Palabras con unidades que se recombinan (Capitán, 2026-11-05)

> *"Reducí el vocabulario a los que distingue y recombinalos para dar el resto."* — *"Tenemos que darle una palabra, no
> una letra."* — *"Recombiná esos y armá el idioma."*

**Cuántas unidades sin confusión.** Con cada pulso en su ola, cada pulso deja arriba las mismas notas corridas en el
tiempo, y dos unidades se confunden solo si los pulsos de una están todos adentro de la otra. El máximo sin que ninguna
quede adentro de otra es elegir todas las que tienen la misma cantidad de pulsos (teorema de Sperner). Con el primer
paso siempre apretado: ventana de 5 pasos, 6 unidades; de 6, 10; **de 7, 20**; de 8, 35. Verificado en el cubo
congelado (4³ y 7³, semilla 7): ninguna igual a otra, ninguna adentro de otra, en las cuatro ventanas.

**El idioma** (`palabras.pl`): las 20 unidades de 7 pasos; cada letra son 2 unidades; cada unidad en su propia ola; la
voluntad reconoce una unidad por vez y arma letras y palabras con la tabla (la composición es por diseño). Aprende con
30 palabras (20 pasadas) y después oye 20 palabras que nunca oyó. Semillas 7, 11, 23:

| temblor | unidades reconocidas (oídas / nuevas) | palabras oídas enteras | palabras nuevas enteras |
|---|---|---|---|
| 0 % | 100 % / 98 % | 30 de 30 | 17 de 20 |
| 10 % | 90 % / 88–90 % | 11–14 de 30 | 5–8 de 20 |
| 20 % | 74–81 % / 78–82 % | 2–5 de 30 | 1–4 de 20 |

- **El idioma por partes funciona**: con pulso firme lee todas las palabras que aprendió y 17 de 20 nuevas. Las 3 que
  fallan (hermano, noche, kiwi) fallan en la h y la k, cuyas unidades no aparecieron al aprender. Las unidades se
  reconocen igual en palabras nuevas que en las oídas.
- **El temblor rompe palabras, no unidades**: 90 % por unidad, pero una palabra de 5 letras son 10 unidades y una mal la
  pierde entera.
- ⚠️ **El cardumen no hace el trabajo**: con pulso firme las tres semillas dan exactamente lo mismo, y el cardumen quieto
  da exactamente lo mismo que el que aprende. Con las olas separadas el cubo es un caño: el idioma lo arman la voluntad
  y la tabla. Queda abierto que las olas interactúen sin volver a girar en redondo, y el control de verdad para eso es
  este mismo: que el cardumen que aprende le gane al quieto.

**El alfabeto de Fano, derivado de la regla del siete del Capitán** (2026-11-05, idea de otro chat sobre la regla de
`cmd/elsiete`: duplicar recorre 1 → 2 → 4 → 8 ≡ 1 módulo 7). El bloque {1, 2, 4} módulo 7 es la órbita de duplicar, y
con sus 7 corrimientos arma el plano de Fano: 7 unidades de 7 pasos y 3 pulsos, y cada dos comparten exactamente un
pulso, así que están a distancia 4. (El 7 de la regla del Capitán es un resto módulo 9 y el de Fano es 2³ − 1: no son el
mismo siete; lo que coincide es la operación, duplicar.) `palabras.pl alfabeto=fano`; letra = 2 unidades (49
combinaciones para 26 letras).

- **En el papel no alcanza**: correr un pulso un lugar cambia 2 posiciones, y en los 24 casos posibles la unidad corrida
  queda **empatada** a distancia 2 entre la suya y otra (no cae en otra, pero no vuelve sola). Detectar está
  garantizado; corregir, no.
- **En el banco sí gana** (semillas 7, 11, 23; los dos alfabetos con 3 pulsos que se pueden correr):

| temblor | Sperner, 20 unidades: unidades / palabras nuevas | Fano, 7 unidades: unidades / palabras nuevas |
|---|---|---|
| 0 % | 98 % / 17 de 20 | **100 % / 20 de 20** |
| 10 % | 88–90 % / 5–8 de 20 | **94–98 % / 11–17 de 20** |
| 20 % | 78–82 % / 1–4 de 20 | **89–92 % / 6–8 de 20** |

  El oído escucha notas con su ritmo, no posiciones, y desempata buena parte de lo que el papel deja empatado.
- Salvedades: con 7 clases es más fácil acertar que con 20, así que no todo es mérito de la distancia. Con pulso firme
  Fano lee las 20 nuevas porque sus 7 unidades aparecen todas al aprender (en Sperner faltaban las de la h y la k).
- Sigue valiendo lo de antes: el cardumen quieto daría lo mismo; el cubo transmite, no calcula.

**El control 7 contra 7** (2026-11-05). La comparación de arriba no era pareja: Fano elige entre 7 por lugar y Sperner
entre 20 (el azar de una letra es 1/49 contra 1/400), y a Sperner le faltaron unidades por oír. Control: las 7 de Fano
contra **7 de Sperner sacadas al azar** (`palabras.pl sorteo=K`, 5 sorteos), mismo azar y misma cobertura, 7 semillas
nuevas (1001–1007). Palabras nuevas leídas enteras, de 20, mediana y rango:

| temblor | Fano | sorteos de Sperner (mediana de cada uno, y su rango) |
|---|---|---|
| 10 % | **15** (12–17) | 4 (2–7), 10 (8–13), 9 (5–12), 9 (6–13), 10 (9–12) |
| 20 % | **9** (6–14) | 1 (0–3), 3 (1–8), 4 (1–6), 6 (5–7), 6 (2–7) |

Por unidad: con 10 % de temblor Fano reconoce 96–98 %; ningún sorteo pasa de 95 %. Con 20 %, Fano 90–97 %; los sorteos,
71–89 %.

- **Gana la construcción, no el tamaño**: con las mismas 7 opciones y todas oídas, Fano le gana a los 5 sorteos en la
  mediana, en los dos temblores.
- Salvedad que queda: las unidades de Sperner tienen 4 pulsos (el primero fijo) y las de Fano 3, todos móviles. A los
  dos el temblor les mueve 3 pulsos, pero Sperner deja más notas arriba por unidad; si algo, eso lo favorece a Sperner.
- ⚠️ Instrumento: el primer resumen de esta corrida daba rangos al revés ("17–14"). La variable del lazo se llamaba `$a`
  y le pisaba la suya a la función que ordena; se recalculó con los mismos archivos.
- Lo que sigue (idea del otro chat, con la regla del Capitán, no importar una métrica sino medir la que ya está): Fano es
  óptimo para la distancia de Hamming, pero el cubo desempata donde Hamming empata, así que mide con otra geometría.
  Medir la matriz de confusión del cubo con temblor y derivar el alfabeto de ahí puede dar más de 7, u otras 7.

**Olas que se cruzan** (Capitán, 2026-11-05: primero que el cardumen calcule, después la red convencional). `olas=cruzan`
(`cross` en `signal_waves`): los empujes de todas las olas se suman, así que una pieza que ninguna ola sola despierta
despierta donde dos se cruzan, y pasa a ser de todas las que la empujaron; dentro de cada ola cada pieza sigue
despertando una vez, así que no hay giro en redondo y todo se apaga solo (verificado: 13 pasos para 4 de tecla, igual
que con olas separadas). Palabras con Fano, temblor 10 %, semillas 1001–1007, unidades reconocidas / palabras nuevas de
20:

| | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 |
|---|---|---|---|---|---|---|---|
| aprende | 88 % / 6 | 88 % / 6 | 91 % / 8 | 87 % / 3 | 95 % / 13 | 89 % / 7 | 98 % / 17 |
| quieto | 87 % / 4 | 89 % / 7 | 92 % / 8 | 85 % / 2 | 92 % / 10 | 88 % / 6 | 98 % / 17 |

- **El cubo ya no es un caño**: ahora cada semilla da distinto (87 a 98 % de unidades), así que la forma del cubo pesa.
- **Pero aprender no gana**: el que aprende queda mejor en 4 semillas, peor en 2 y empata en 1, por 1 a 3 puntos. No es
  una diferencia (prueba de signos, p ≈ 0,69).
- Y en promedio queda peor que con olas separadas (Fano con olas separadas: 96–98 % de unidades, 12–17 palabras).
- Candidato, sin construir: en el juego de señales, cuando la voluntad acierta hace sonar la melodía otra vez ("el
  cardumen la asienta"), y eso es lo que talla al cardumen hacia lo que sirve. En `palabras.pl` no existe ese paso: el
  cardumen aprende de todo lo que suena por igual, sin saber qué sirvió.

**El techo que se autoajusta** (Capitán, 2026-11-05/06). Por qué asentar no cambiaba nada: después de **una sola
pasada** por las palabras, el 60 % de los pesos del cardumen ya está en 255 (63–64 % después de 20); asentando o sin
asentar da idéntico, número por número. El cardumen aprende lo que puede en los primeros minutos y se satura.
- **Debilitar de a tasa en lugar de a uno** (`simetrico=1`, la prueba más barata): no alcanza, 61 % en 255 contra 63 %.
  La causa no es cuánto se debilita sino cuándo: solo se debilita la conexión con una vecina que no despertó nunca, y
  como la ola llena casi todo el cubo, casi no pasa.
- **Cada pieza conserva su total** (`conserva=1`, `conserve_piece` en `modelo.pl`): la suma de lo que le dice a sus
  vecinas queda fija desde que nace; si le habla más a una, le habla menos a las otras (competencia; normalización de
  Oja, escala sináptica de Turrigiano). Verificado: después de 300 señales el total sigue exacto (37.691) y solo el 4 %
  de los pesos toca 255.
- **El híbrido** (simétrico + conserva + asienta; palabras con Fano, olas que se cruzan, temblor 10 %, semillas
  1001–1007), unidades / palabras nuevas de 20:

| | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 |
|---|---|---|---|---|---|---|---|
| híbrido | 86 % / 5 | 89 % / 7 | 93 % / 9 | 87 % / 4 | 93 % / 11 | 93 % / 8 | 98 % / 17 |
| quieto | 87 % / 4 | 89 % / 7 | 92 % / 8 | 85 % / 2 | 92 % / 10 | 88 % / 6 | 98 % / 17 |

  En palabras nuevas gana en 5 semillas, empata en 2 y no pierde en ninguna: **la primera señal de que aprender le
  sirve al cardumen en esta tarea**. Todavía no es prueba (prueba de signos, dos colas, p ≈ 0,12; diferencias de 1 a 2
  palabras). Falta medir conserva sola y asienta sola para saber qué pone cada una.

## La melodía negativa: un bit de signo por pieza (Capitán, 2026-11-06)

> *"Nos falta algo: la melodía negativa. Agregá un bit de signo."* — Por pieza.

Hasta acá todas las conexiones empujaban y ninguna frenaba: por eso la ola llenaba casi todo el cubo, casi todo caía
junto y el aprendizaje se saturaba; la armonía era el único freno, y grueso. Ahora cada pieza nace **empujando o
frenando** con todas sus vecinas (la ley de Dale; en una corteza, más o menos 1 de cada 5 neuronas frena).
`set_brakes($porcentaje, $semilla)` elige cuáles con dados propios (los pesos no cambian); `frenan=P` en `palabras.pl`.

- Una pieza que frena y está despierta **resta** su peso de lo que le dice a su vecina, en lugar de sumarlo, y no
  cuenta como "la despertó" para la armonía. Vale en las cinco formas de propagar del cubo (`signal`, `signal_timed`
  con y sin reposo, `signal_waves` separadas y cruzadas, `signal_viva`): una pieza que frena frena siempre.
- Aprende como las otras: si la que frena y su vecina caen juntas, el freno crece (Vogels y otros, 2011: lleva el
  empuje y el freno al equilibrio). Con `conserva=1`, cada pieza conserva su total igual que antes.
- **`prueba_signo.pl`**, 18 casos chicos armados a mano, con respuesta exacta: en cada forma de propagar, la vecina que
  empuja despierta a la pieza del centro y la misma vecina frenando no; la que frena despierta como cualquiera; la
  armonía no cuenta al que frena (en una esquina, donde contarlo la cortaría); el freno crece; con frenos se conserva el
  total; los frenos salen iguales con la misma semilla. **18 de 18.**
- ⚠️ Las pruebas se escribieron después del código (al revés de la regla). Para compensar, se verificó que sepan
  fallar: con una copia del modelo con el freno desconectado, caen 7 de 18, todas las que miden el freno.
- Primera mirada: con 20 % que frenan la ola sigue llegando arriba pero más fina; con 50 % se apaga a los 5 pasos,
  antes de llegar.
- **El barrido de cuántas piezas frenan** (híbrido + frenos, palabras con Fano, temblor 10 %, cada nivel contra su
  quieto con los mismos frenos; parado por el Capitán a los 32 de 56). Palabras nuevas de 20, semillas 1001–1007:
  10 %: aprende 5, 6, 7, 4, 14, 8, 10 contra quieto 4, 9, 6, 2, 12, 5, 11 (5 mejor, 2 peor: parecido al híbrido sin
  frenos). 20 %: en la semilla 1005 el que aprende **se apaga: 0 %**. 30 %: el que aprende da **0 % en todas** las que
  terminaron. **Aprendiendo, los frenos crecen hasta silenciar el cubo**: la regla de Vogels refuerza el freno cuando
  cae junto con su vecina, y en un cubo que se llena eso pasa todo el tiempo. Es la saturación de antes, del lado del
  freno. Abierto: qué regla general deja crecer al freno sin que se coma la ola.

## Morse de saludos, sin tiempos (Capitán, 2026-11-06)

> *"En vez de tiempos, saludos: código Morse de saludos, sin tiempos que molesten."*

`morse_saludos.pl`: la tabla del Morse de verdad, pero el punto y la raya son **dos tipos de saludo** (dos teclas), no
dos duraciones; como sin tiempos no hay silencio que cierre una letra, un tercer tipo dice "fin de letra". Cada saludo
es una tecla (3 piezas de abajo) apretada una vez, en su propia ola; nada depende de cuánto dura nada. Las tres teclas
son tres esquinas de la cara de abajo, lo más lejos posible entre sí (criterio, no medición). La voluntad reconoce cada
saludo y arma letras con la tabla del Morse y palabras con las letras. El ruido es el dedo que se resbala (`desliz=P`:
una de las 3 piezas cae en una vecina). Semillas 1001–1007, palabras nuevas de 20:

| resbalones | saludos reconocidos | palabras nuevas |
|---|---|---|
| 0 % | 100 % | 20 en las 7 semillas |
| 10 % | 97–100 % | 14, 16, 20, 11, 20, 20, 12 |
| 20 % | 96–100 % | 13, 12, 20, 12, 20, 12, 9 |
| 10 %, cardumen quieto | 95–99 % | 6, 17, 19, 13, 19, 15, 17 |

- **Todas las letras salen** (hermano, noche y kiwi incluidas): con el Morse, toda letra se arma con los mismos tres
  saludos, así que no hay letra sin escuchar.
- **Aguanta los resbalones**: con 20 %, el cubo sigue reconociendo 96–100 % de los saludos. Las palabras caen porque una
  palabra en Morse son muchos saludos seguidos y uno mal la pierde.
- **El cardumen todavía no pone lo suyo**: el que aprende le gana al quieto en 4 semillas y pierde en 3. Con tres
  saludos bien separados, el cubo los distingue aprenda o no. (Por eso el otro chat propuso las 7 teclas de Fano en el
  espacio, `saludos.pl`: con 3 símbolos lejanos el 100 % no enseña nada sobre el cubo.)

**Fano en el espacio** (`saludos.pl`: las 7 líneas de Fano como teclas, qué piezas se aprietan y no cuándo; idea del
otro chat: "¿la geometría del cubo es la misma en el espacio que en el tiempo?"). Control como en el tiempo: Fano contra
5 sorteos de 7 teclas de 3 piezas sobre los mismos 7 lugares (`sorteo=K`), 10 % de resbalones, semillas 1001–1007.
Palabras nuevas de 20: **Fano 12 (11–14); sorteos 12 (1–13), 13 (12–15), 12 (10–14), 13 (10–16), 14 (11–16).**
**En el espacio Fano no gana**: empata con teclas al azar (solo suma estabilidad: ninguna semilla se le cae, un sorteo
dio 1 de 20). La ventaja de Fano era del tiempo. Respuesta: la geometría del cubo no es la misma en el espacio que en el
tiempo.

## Señales que se acortan solas (Capitán, 2026-11-06)

> *"El saludo ahora es una palabra entera, o una oración, jajaja."* — *"Eso quiero que hagas."*

`zipf.pl`: palabras en Morse de saludos, unas dichas mucho más que otras (ley de Zipf: la de rango r pesa 1/r; qué
palabra tiene qué rango lo decide un sorteo, no su largo). Las 7 piezas de abajo que no usan las esquinas del Morse,
como líneas de Fano, son 7 teclas libres: cada una puede ser el nombre corto de una palabra entera, un saludo en lugar
de muchos. Nadie le dice a la voluntad cuáles son frecuentes. La regla solo mira el costo: al decir una palabra entera
le da una tecla libre; si no hay, le saca la tecla a la que menos ahorró hasta ahora (usos por saludos ahorrados), si la
que está diciendo ya ahorraría más. Si el oído confunde un nombre corto después de haberlo oído, la palabra vuelve a
decirse entera. Control (`azar=1`): las teclas van a palabras al azar.

- Semilla 7, 600 palabras dichas: **las 7 teclas terminan en las 7 palabras más frecuentes, exactas** (fuego 1, árbol 2,
  silla 3, puerta 4, viento 5, casa 6, sol 7). El costo baja de 18,1 saludos por palabra a 7,5.
- Semillas 1001–1007: correlación entre frecuencia y largo (Spearman; positiva = las más dichas, más cortas): **regla
  0,29–0,66 (mediana 0,39), azar 0,20–0,51 (mediana 0,28)**; saludos por palabra: **regla 6,7–8,3, azar 9,0–10,0**.
- **El costo baja siempre con la regla** (7 de 7 semillas) y la correlación es mayor en 5 de 7. Pero el control también
  da positivo: las palabras frecuentes aparecen antes y agarran primero las teclas libres aunque se repartan al azar. El
  control no es neutro; uno mejor reparte las teclas al azar también al principio.
- Lo que es diseño, dicho claro: la regla de sacar la tecla a la que menos ahorró es un criterio de costo puesto por
  Doc; lo que no se le dice es cuáles palabras son frecuentes.
- **La inversión** (`raras=7`: las 7 palabras más raras se dicen primero y agarran las 7 teclas libres; después,
  frecuencia normal). Después de las primeras 7, las teclas están en los rangos 24 a 30, como se buscaba. Al final:
  con 600 palabras, semillas 7, 1001 y 1004 sin ninguna rara con tecla (la 7 termina exacta en las 7 más frecuentes,
  igual que sin inversión); con 3.000, de las 7 raras que arrancaron con tecla quedan 0 (1003), 3 (1002) y 1 (1005,
  1006, 1007). Las que quedan **no** están en el reparto ideal por ahorro (frecuencia × saludos ahorrados): se quedaron
  por llegar primero. **Manda la frecuencia, pero no del todo**: la regla compara lo ahorrado por quien tiene la tecla
  con lo que ahorraría quien la pide, y eso favorece al que llegó antes.
- **El paper de la antieficiencia, verificado**: Chaabouni, Kharitonov, Dupoux y Baroni, *Anti-efficient encoding in
  emergent communication*, NeurIPS 2019 (arXiv 1905.12561), del grupo de EGG: en el juego de señales las entradas más
  frecuentes reciben los mensajes más largos. Pero el mismo paper muestra que **con un costo por largo del mensaje sus
  redes también cumplen la ley de abreviación**, y la regla de Razar tiene un criterio de costo puesto por Doc. La
  comparación justa es EGG con costo contra Razar con costo: los dos cumplen la ley. **No** se puede decir "Razar hace
  la ley donde EGG hace lo contrario".
- La afirmación defendible: *dada una regla de reasignación por costo, el sistema descubre la distribución de
  frecuencias por puro uso, sin que nadie se la informe; queda una ventaja del que llegó primero.*

## Una palabra, una canción; lo que se escribe son oraciones (Capitán, 2026-11-06)

> *"El sistema es ciego: al leer una letra por vez, aunque encuentre un dominio, no ve lejos ni entiende. Necesitamos
> que una palabra completa sea canción, un saludo debe ser una palabra; entonces lo que vamos a escribir son oraciones."*

`oraciones.pl`: los saludos del Morse de una palabra (punto, raya, fin de letra) entran en **una sola ola**, uno por
paso, con las olas cruzándose: las letras se encuentran adentro del cubo y sale **una melodía por palabra**. La voluntad
aprende las 30 palabras por su canción (sabe cuál se mandó) y lee oraciones de 3 a 5 palabras. Semillas 1001–1007, 40
oraciones; palabras reconocidas / oraciones enteras:

| resbalones | aprende | quieto |
|---|---|---|
| 0 % | 94–100 % / 31–40 | 100 % / 40 en las 7 |
| 10 % | 91–96 % / 32, 28, 31, 33, 33, 29, 35 | 86–98 % / 30, 19, 23, 29, 32, 25, 37 |
| 20 % | 82–95 % / 19, 22, 34, 29, 29, 21, 17 | 67–92 % / 25, 9, 14, 25, 24, 9, 27 |

- **Por primera vez el cardumen que aprende le gana al quieto, y es con ruido**: en oraciones enteras gana en 6 de 7
  semillas con 10 % de resbalones y en 5 de 7 con 20 % (11 de 14 juntas; prueba de signos, dos colas, p ≈ 0,06). Hay
  semillas con saltos grandes: de 9 a 22 oraciones, de 14 a 34. Sin ruido no hay qué ganar: el quieto ya lee todo.
- El híbrido (conserva + simétrico + asienta) queda peor que el aprendizaje simple acá (10 %: 16 a 36 oraciones).
- **Palabras que nunca oyó**: el 40 % (56 de 140) se toma por una palabra que **empieza con la misma letra**, contra 5 %
  de azar (puerto→puerta, faro→flor, ola→ojo, melodía→mesa). La canción pesa sobre todo por el comienzo.

**Frenos y saturación, medido** (idea del otro chat: "la convulsión y la saturación son un solo problema; la
inhibición apaga la ola sola"):
- Con reposo de 1 paso (el que deja rebotar la ola), lo que sigue sonando después de soltar la tecla, 5 sorteos de
  frenos: 0 %: 127 pasos (lo corta la regla de bucle); 10 %: 37–95; 20 %: 25–**357**; 30 %: 2–33. **Los frenos apagan la
  ola solos recién cerca del 30 %**; con 10–20 % no alcanza y a veces suena más.
- Después de aprender (300 palabras, 20 % que frenan): sin conservar, en 255 quedan el 81 % de los pesos de las que
  empujan y el **57 % de las que frenan**; conservando, 3 % y 9 %. La saturación es del aprendizaje entero, de los dos
  lados.

**El freno que sigue la aceleración** (Capitán, 2026-11-06: *"el 30 % es a ojo, tiene que variar según la aceleración de
la convulsión"*). `follow` en `modelo.pl` (`speedup`): cada pieza despierta mira a sus vecinas; si g de sus N vecinas
despertaron desde el paso anterior, empuja con (N − 2g)/N de su peso: entero si nada crece, nada si se le encendió la
mitad de golpe, freno total si se le encendieron todas. Sin porcentaje elegido; profundidad 1. Vale en `signal_timed` y
en las olas cruzadas. Huellas viejas intactas; `prueba_signo.pl` 18 de 18.

Medido con reposo de 1 paso (el que convulsiona), 5 sorteos: sin freno, sigue sonando 127 pasos (521 notas arriba);
freno fijo 30 %, 2 a 33 pasos, pero en 3 de 5 llegan arriba 1 a 3 notas (apaga la ola y también la señal); **freno que
sigue la aceleración, 170 pasos: la estira**. Por qué: la convulsión es una oscilación sostenida, siempre el mismo
dibujo, y ahí **no hay aceleración**; un freno que mira cuánto crece la actividad no ve nada que frenar (el término
derivativo de un controlador corrige cambios, no un estado que se mantiene). Lo que puede frenar una oscilación sostenida
tiene que mirar cuánta actividad hay y cuánto dura (proporcional e integral).

**20 semillas, y la estadística bien hecha** (por consejo del otro chat: el test de signos tira el tamaño del salto, y
las dos medidas de ruido de una misma semilla no son independientes). Ganancia por semilla en oraciones enteras de 40,
promedio de 10 y 20 % de resbalones, aprende menos quieto, semillas 1001–1020: −2, 11, 14, 4, 3, 8, −6, 1,5, 4,5, 9, 6,
7, 9,5, 6,5, 8, 0,5, 0,5, 8,5, 3, 6,5.
- **Gana en 18 de 20, pierde en 2; mediana +6,2 oraciones. Wilcoxon por semilla: W+ = 196,5 de 210, z = 3,42 (p ≈
  0,0006, dos colas).** Con 7 semillas era p ≈ 0,16 (el 0,06 que se dijo antes contaba como independientes las dos
  medidas de una semilla). **Lo que aprende el cardumen sirve cuando hay ruido**, con la palabra entera como canción.
- **Frenos al 30 %, sin resbalones** (la predicción del otro chat: si se cura la expansión, las confusiones dejan de ser
  "empieza igual"): las palabras nuevas tomadas por una que empieza con la misma letra bajan del 40 % a **24 % (aprende) y
  29 % (quieto)**, contra 5 % de azar. Se cumple a medias. Doc había dicho que el sesgo no era el zumbido (en estas olas
  nadie despierta dos veces); que los frenos lo muevan dice que tiene que ver con cuánto se expande la ola. Costo:
  aprendiendo con frenos, una semilla cae a 13 oraciones de 40 (los frenos que aprenden siguen siendo peligrosos).

**La fatiga por pieza** (otro chat, 2026-11-06: el freno según cuánta actividad hay y cuánto dura, en su versión más
simple). `fatigue` en `signal_timed`: cada vez que una pieza despierta su umbral sube un umbral entero, y eso se le va
en tantos pasos como tarda una ola en cruzar el cubo de punta a punta, D = 3 (n − 1) (9 en 4³): una pieza que vuelve a
despertar antes de que una ola pudiera haber cruzado el cubo no oye algo nuevo, rebota. Profundidad cero (cada pieza
mira su historia), solo crece con el uso y solo baja con el descanso: no puede oscilar (la adaptación de frecuencia de
disparo de las neuronas). Huellas viejas intactas; `prueba_signo.pl` 18 de 18.

- **Apaga la convulsión sin matar la señal** (reposo de 1 paso, 5 cubos): sin nada, sigue sonando 17–127 pasos con
  94–521 notas arriba; con fatiga, **5–18 pasos con 15–30 notas arriba**. El freno fijo de 30 % la apagaba dejando 1–3
  notas. Es la primera cura sin trampa.
- **Pero no salva al Morse por tiempos**: con fatiga y reposo 1, el cubo congelado da 20 respuestas distintas para 26
  letras (semilla 7); las gemelas ahora difieren en **la última marca** (P=W, L=R, B=D=X, O=Z): la fatiga cansa a las
  piezas de la entrada, que la tecla pulsa cada 2 pasos, y las últimas marcas ya no pasan. Para el cubo, un pulso que
  llega antes de D pasos es igual que un rebote. Con más silencio entre marcas no mejora de forma pareja: 9 a 21 de 26
  según la semilla y el silencio. Para el tiempo sigue siendo mejor cada pulso en su propia ola (26 de 26).

## La voluntad y el cardumen de Janax se hablan con palabras (Capitán, 2026-11-06)

Con el saludo que lleva una palabra (pedidos 30 y 31 de Janax, `documentacion/so/janaxos.md`), los dos camarotes de
Razar dejan la caja compartida y la dote. La voluntad **dice** la orden en una palabra (el tipo de orden en el byte bajo
y las 3 piezas en los tres siguientes); el cardumen la **oye** de su buzón (si está vacío, duerme hasta el timbre y
vuelve a mirar) y **contesta con palabras**: qué piezas de arriba despertaron (una) y el paso de cada una (dos); al final,
su huella (una). Se usa lo que se necesita: 1 palabra la orden, 3 la respuesta. Cada uno guarda su propia copia de "la
caja" y las palabras la llenan, así la parte que piensa (la ola, la lectura, la huella) no se tocó.

- **La misma huella del modelo, bit por bit** (`000094454451C2E4`) y la misma línea de aciertos (`84% 100% 100% 100%`),
  en los tres motores y con 1, 2 y 4 remeros.
- **La cantidad de pedidos cambia un poco según los remeros** (4.716 a 4.722) y el resultado no se mueve un bit: a
  veces el que lee encuentra el buzón vacío, duerme y vuelve a mirar. El orden de llegada varía y lo que piensan no: la
  regla del buzón asincrónico-sincrónico trabajando.
- **Costo, medido** (un remero, `JANAX_CAMBIO=24`, medianas de 3): con palabras, ~142–168 ms; con la caja, ~119–134 ms.
  Sin el arranque (~75 ms, igual en los dos), el trabajo pasa de ~50 a ~70 ms: **~40 % más caro**. Antes eran ~1.576
  pedidos; ahora ~4.700 (cada respuesta son 3 palabras con sus lecturas). A cambio: sin memoria compartida, y nadie
  depende de cuándo llega el otro.

## Todo a Janax; Perl queda de vara (Capitán, 2026-11-06)

> *"Pasá todo a Janax, no quiero seguir usando Perl."* — *"Sí, pero la usamos de medida: si probamos todo primero en
> Perl vamos súper lento, en Janax vuela."*

Regla desde acá: **el trabajo y los experimentos nuevos van directo a Janax**. El modelo Perl queda congelado como vara
de medir: cada pieza que pasa a Janax se verifica contra una huella del modelo, bit por bit, y esa es la última vez que
Perl trabaja para esa pieza. El orden del traslado: (1) las olas que se cruzan; (2) la palabra como canción; (3) el oído
de palabras enteras en la voluntad; (4) el cubo de tamaño libre; (5) las oraciones con ruido, el quieto de control y
las 20 semillas, corriendo en Janax.

**Pieza 1: las olas que se cruzan** (`cardumen_olas.jsm`; vara: `huella_olas.pl`, 40 palabras en turno, sol, luna,
mar, casa, como canciones de Morse de saludos con las tres teclas de las esquinas, un saludo por paso, cada pulso su
ola, los empujes sumados). A lo Janax: con 64 piezas un conjunto de piezas es un qword, un bit por pieza; cada ola
guarda tres: quién de ella está despierto, quién despertó alguna vez en ella, y a quién empujó en este paso. Cruzar
olas es sumar empujes y un Y de bits. **Huella `00008FBA0F7F8D63` en los tres motores, igual al modelo.** Tiempo con
arranque: intérprete 221 ms, rutinas 168 ms, traductor 153 ms; Perl 752 ms.

**Piezas 2 y 3: la palabra como canción y el oído de palabras enteras, en Janax** (`cardumen_canto.jsm` y
`voluntad_canto.jsm`, dos camarotes que se hablan con palabras; vara: `huella_oraciones.pl`, 3 pasadas por las 30
palabras del vocabulario, aprendiendo, sin nada al azar). La voluntad le dice al cardumen la palabra entera en **una
sola palabra de Janax**: cada saludo del Morse son 2 bits desde el bit 8 (0 punto, 1 raya, 2 fin de letra, 3 fin de la
canción); la canción más larga son 25 saludos. El cardumen la canta con las olas que se cruzan y le contesta cuántos
pasos duró (la más larga, 34) y la cara de arriba de cada paso, 16 bits por paso y 4 pasos por palabra. La voluntad
reconoce la palabra entera con su tabla por palabra, pieza y paso, y aprende sabiendo qué dijo.
- **Huella `0000B6A4176535A2` en los tres motores, igual al modelo**; en la tercera pasada reconoce las 30 de 30.
  Tiempo: intérprete 448 ms, rutinas 284 ms, traductor 216 ms; Perl 1.913 ms (unas 9 veces).
- Los pedidos cambian según el motor (1.969 a 2.005: cada uno llega al buzón en otro momento) y la huella no se mueve.
- ⚠️ Dos errores que el ensamblador propio (PDP) atajó y FASM no habría dicho: un desplazamiento de carga más grande que
  lo que entra (7FFFh; la tabla de la voluntad empieza en 10000h, así que su dirección va en un registro), y números
  hexadecimales que empezaban con letra (`E560h` es un nombre; se escribe `0E560h`) en los datos generados.

⚠️ **Un error de Doc, encontrado y corregido** (2026-11-06): al agregar el freno que sigue la aceleración (`speedup`),
una vecina que empuja con **peso 0** dejó de contar como "la despertó" (para la armonía y para saber qué olas la
empujaron), porque el código decidía por el valor del empuje y no por su signo. Las huellas de prueba no lo vieron (los
pesos en 0 son raros en historias cortas), pero en corridas largas con aprendizaje cambiaba los resultados: comparando
`oraciones.pl` con una copia del modelo de antes, semilla 1001 con 10 % de resbalones, daba 85 % en lugar de 86 %
aprendiendo. Ahora decide el signo: un empuje de 0 sigue contando. Verificado: el modelo da idéntico al de las 20
semillas (dos configuraciones), y todas las huellas siguen iguales (las de las piezas 1 a 3 de Janax incluidas). El
resultado de las 20 semillas sigue en pie. `oraciones.pl huella=1` mezcla cada adivinanza: la vara de la pieza 5.

**Pieza 5: las oraciones con ruido, en Janax** (`voluntad_oraciones.jsm` con `cardumen_canto.jsm`; vara:
`oraciones.pl huella=1`). La voluntad lee sus parámetros del archivo `p` (tres qwords: la semilla del cardumen, el
porcentaje de dedos que resbalan, 1 si el cardumen está quieto), hace nacer al cardumen con esa semilla (orden 5), y
hace el experimento entero: aprende las 30 palabras, 20 pasadas, cada una como canción con las piezas exactas de cada
saludo (orden 6: un dedo resbalado aprieta piezas que no son ninguna de las 3 teclas); lee 40 oraciones de 3 a 5
palabras sacadas con los dados del modelo; y oye las 20 palabras que nunca oyó. Escribe la misma línea que el modelo.
- **Bit por bit en los tres motores**, con dos configuraciones: semilla 1001, 10 %, aprendiendo
  (`0000A1A4AA959425`, "86 %; 93 %; 32 de 40") y semilla 1003, 20 %, quieto (`00003FC5AF9436F2`, "72 %; 78 %; 14 de
  40"). La línea que escribe Janax es idéntica, letra por letra, a la del modelo.
- **Tiempo: Janax 392 ms (traductor), Perl 17.269 ms: unas 44 veces más rápido.** El experimento de 20 semillas
  (80 corridas) pasa de ~23 minutos a ~30 segundos.
- Lo que atajó el ensamblador propio en el camino: una etiqueta que quedó en otra rutina al separarlas, y un
  comentario con un salto de línea de verdad adentro (generado mal por Doc).

**Pieza 4: el cubo de tamaño libre** (`cardumen_lazo.jsm` y `voluntad.jsm`, reescritos generales). La voluntad lee del
archivo `p` el lado del cubo, la cantidad de cosas, las vueltas y la semilla, y hace nacer al cardumen (orden 2: lado y
semilla). Todo lo que decía 64, 48 o 16 sale del lado: piezas = lado³, la cara de abajo (lado²) y la de arriba. Las
vecinas y el paso en que despertó cada pieza pasan a un qword cada uno (−1 = no hay / no despertó), porque en 7³ hay 343
piezas y un byte llega a 255. La tabla de lo aprendido se pide a medida al sistema (pedido 2): cosas × lado² × piezas ×
8 bytes (32 KB en 4³ con 4 cosas; 2,1 MB en 7³ con 16). Límite: las tablas del cardumen quedan debajo de lo que alcanza
un desplazamiento de carga (7FFFh), y eso fija el lado en 7 como máximo; más grande pondría sus direcciones en registros.
- **Bit por bit con el modelo en los tres motores**: 4³ con 4 cosas (`000094454451C2E4`, la línea de siempre) y **7³ con
  16 cosas, el resultado contra EGG** (`00009756E346EC1F`, "46 % 92 % 94 % 92 %"). Tiempo 7³: Janax 243 ms, Perl ~4,7 s.
- ⚠️ Un error de Doc que costó buscar: las variables del cardumen quedaron pegadas a la cola de pedidos (110h–128h), y
  cada pedido al sistema les escribía encima el tamaño del cubo. La cola son 40 bytes y ahí no puede vivir nada más.
- ⚠️ Y otro que la búsqueda destapó: si el otro camarote muere, la rutina de oír reintentaba para siempre (el timbre
  contesta −1, "ya no queda nadie que pueda saludarte", y se volvía a esperar). Era un bucle que gasta por nada; ahora
  termina. En las cinco voluntades y cardúmenes de Janax.

Con esto, **las cinco piezas del traslado están en Janax**: olas que se cruzan, palabra como canción, oído de palabras
enteras, cubo de tamaño libre y oraciones con ruido. Perl queda de vara.

## Un acertijo de palabras, resuelto por haber aprendido algo parecido antes (Capitán, 2026-11-06)

> *"Más inteligente es que pueda resolver un acertijo de palabras aprendiendo algo parecido antes."* — Su ejemplo:
> *"Si los números son uno dos tres cuatro cinco y seis, uno más uno es igual a dos, dos más dos es igual a cuatro:
> ¿cuánto es dos más tres?"* — *"Que pueda aumentar el 7 a la 3: si con eso no le alcanza, que se modele su propio
> tamaño."*

**La devolución, antes de construir.** Con esos dos ejemplos solos, la respuesta no se puede saber: "el doble del
primero" también cumple "uno más uno es dos" y "dos más dos es cuatro", y con esa regla "dos más tres" da cuatro. El Capitán sabe que es cinco porque **ya sabe contar**:
"más tres" es avanzar tres lugares desde el dos. Eso es lo "parecido aprendido antes": primero el orden de los números,
después la suma montada encima. Se parece a Copycat de Hofstadter (analogías de letras), a ARC de Chollet (cada
acertijo trae su regla) y a *grokking* (Power y otros, 2022: sumas que se aprenden con una parte de la tabla y se
prueban con las que nunca se vieron). Lo propio: en Razar contar es una melodía, y la voluntad recuerda melodías.

**Cómo funciona** (`voluntad_acertijos.jsm` con `cardumen_cubo.jsm`, todo en Janax; vara: `acertijos.pl`). Las palabras
son canciones, como en las oraciones (Morse de saludos, olas que se cruzan, el oído que cuenta notas). Tres escalones:
1. **El oído y su propio tamaño.** El cardumen nace con lado 3 y la voluntad aprende sus 9 palabras (uno…seis, más,
   menos, es). Mientras todavía confunde palabras que le enseñaron, el cardumen nace de nuevo una pieza más ancho y la
   voluntad aprende otra vez; cuando uno más ancho ya no confunde menos, vuelve al mejor y se queda. Ningún número
   elegido: la regla es "crecer mientras crecer sirve". `tope` solo termina una corrida, y se dice si se alcanzó.
2. **Contar.** Oye "uno dos tres cuatro cinco seis" y recuerda, por las palabras que reconoció, cuál abre la canción y
   cuál sigue a cuál. Nada se le da: si el oído se equivoca, la memoria de la canción queda mal.
3. **Acertijos** ("a más b es c"). Lo único que sabe hacer con una canción conocida es **recorrerla y contar los
   pasos**. Una regla es **dos recorridos del mismo largo** entre los lugares del acertijo (el comienzo de la canción,
   a, b, c): todas esas igualdades son candidatas y ninguna tiene preferencia. Cada ejemplo mostrado suma para las
   candidatas que cumple; para contestar votan las que cumplieron más ejemplos y dicen dónde está c, y la respuesta es
   la palabra que queda esa cantidad de pasos adentro de la canción. **Un empate entre respuestas es "no lo puede
   saber"** (?). "c está tan lejos de a como b del comienzo" (la suma) es una candidata entre otras ("c está tan lejos
   de a como a del comienzo" es el doble). En el oficio es un **espacio de versiones** (eliminación de candidatos,
   Mitchell, 1977), o síntesis de programas por enumeración: un método clásico.
   ⚠️ **La plantilla la escribió Doc, no Razar**: "dos recorridos del mismo largo" ya tiene la forma de la suma y de la
   resta. Razar no descubre la suma; elige cuál de las candidatas cumple los ejemplos. Y el espacio es chico: **27
   candidatas, 18 que dicen dónde está c**. Con 3 ejemplos que descartan 17, el 100 % es sobre todo combinatoria.

**El cardumen de cualquier tamaño** (`cardumen_cubo.jsm`): las mismas olas que se cruzan, con lado n, sin nada fijo a 64
piezas; sus tablas van en una sala a la medida de n. Una canción dura a lo sumo 256 + n³ pasos (cada ola despierta cada
pieza una vez como mucho), y ese es el tamaño de su tabla de caras de arriba. ⚠️ **En Janax, todo lo que un hijo cambia
(por ejemplo pedir memoria) espera la firma de su madre**: el cardumen pedía su sala y la voluntad estaba esperando una
palabra, así que el sistema rechazaba el pedido para que nadie esperara para siempre. La solución sin parches: el
cardumen dice cuántos bytes necesita (0 si la sala que tiene alcanza), la voluntad la arma (ella no necesita firma), se la
**muda** (pedido 23) y le avisa, y el cardumen la **recibe** (pedido 25, que no es importante). Lo que falta: el cardumen
no puede soltar una sala vieja sin firma, así que cuando crece la anterior queda sin usar hasta que termina la corrida.

**Verificado contra Perl sin volver a correrlo**: antes de pasar a Janax quedaron guardadas 243 corridas de
`acertijos.pl`; Janax da **idéntico, letra por letra, en las 239 que terminaron** (las otras 4 quedaron vacías al cortar
Perl a pedido del Capitán), incluidos los cubos que crecen a 4³ y 5³, con ruido, quieto, revuelto, resta y mezcla. Los
tres motores dan la misma huella. Tiempo, semilla 1001: Janax 0,8 s (traductor) contra Perl 1,7 s; el barrido de 260
corridas, 1 min 27 s.

**Resultados, 20 semillas (1001–1020), acertijos nunca vistos:**

| Condición | Acierta | Sin respuesta | Semillas con todo bien | Cubos |
|---|---|---|---|---|
| suma, 1 ejemplo, sin ruido | 73 % | 26 % | 14 | 3³: 19, 4³: 1 |
| suma, 2 ejemplos, sin ruido | 90 % | 9 % | 18 | 3³: 19, 4³: 1 |
| **suma, 3 ejemplos, sin ruido** | **100 %** | 0 % | **20** | 3³: 19, 4³: 1 |
| suma, 3 ejemplos, 10 % de resbalones | 95 % | 2 % | 14 | 3³: 19, 4³: 1 |
| suma, 3 ejemplos, 20 % | 95 % | 2 % | 12 | 3³: 15, 4³: 5 |
| suma, 3 ejemplos, 20 %, sin crecer (3³ fijo) | 95 % | 2 % | 13 | 3³: 20 |
| suma, 3 ejemplos, 20 %, cardumen quieto | 88 % | 7 % | 9 | 3³: 15, 4³: 3, 5³: 2 |
| **control: respuestas al azar en los ejemplos** | **6 %** | 40 % | 0 | 3³: 19, 4³: 1 |
| resta, 2 ejemplos | 100 % | 0 % | 20 | 3³: 19, 4³: 1 |
| suma y resta mezcladas, 2 de cada una | 95 % | 4 % | 18 | 3³: 19, 4³: 1 |
| mezcladas, 3 de cada una, 10 % | 91 % | 5 % | 8 | 3³: 19, 4³: 1 |

- **Elige la regla, no memoriza la tabla.** Con 3 ejemplos acierta todas las sumas que nunca vio, en las 20 semillas;
  un memorizador acertaría 0. Con la resta pasa lo mismo, y con las dos mezcladas separa una regla por palabra (más,
  menos). Dentro de un espacio de 27 candidatas que escribió Doc.
- **El control dice que la respuesta sale del contenido de los ejemplos**: con las respuestas sorteadas no hay regla
  que cumpla, acierta 6 % (por debajo del azar de 1 en 6) y en 40 % dice que no sabe.
- **Con los dos ejemplos del Capitán dice "no sé"** en 12 de 13 (acierta 3+3, donde todas las reglas coinciden). Con
  "uno más dos" de más, 12 de 12. Es lo que haría alguien que no sabe si "más" es sumar o duplicar.
- **El cardumen que aprende contra el quieto, con 20 % de ruido**: 95 % contra 88 %; por semilla gana 11, pierde 5,
  empata 4. Es una señal, no una prueba (prueba de signos, p ≈ 0,2).
- ⚠️ **Crecer no mejoró los acertijos**: con 20 % de ruido, el cubo que crece y el fijo en 3³ empatan en 19 de 20
  semillas (pierde 1). Crecer arregla las confusiones de las palabras enseñadas, pero los errores que importan son los
  del oído en el momento del acertijo. El mecanismo de tamaño propio funciona y es correcto, pero esta tarea no lo
  necesitó.
- **La prueba que decide de quién es el mérito** (la propuso el otro chat del Capitán, 2026-11-06): reemplazar la
  canción de contar aprendida por una escrita a mano (parámetro 13 de `p`, `ESCRITA`) y volver a medir. **Da idéntico
  en 99 de 100 corridas** (sin ruido, con 20 %, mezcla con 10 %, un ejemplo); la única distinta es una semilla con el
  cardumen quieto y 20 % de ruido, donde la cadena aprendida había quedado mal y la escrita acierta 7 más. Conclusión:
  **en esta tarea el cardumen casi no trabaja**. Pone el oído (qué palabra oyó) y la cadena de sucesores sale
  perfecta; el resto lo hace la búsqueda. Lo de crecer y lo del quieto dicen lo mismo. **Esto no es todavía un
  resultado de Razar**: es un sintetizador de reglas chico que lee de una tabla aprendida. El resultado de Razar de
  esa noche sigue siendo el de las palabras-canción (aprender le gana al quieto en 18 de 20, z = 3,42), donde el cubo
  sí trabaja.
- Lo que sí vale: **se abstiene cuando los ejemplos no alcanzan** (dice "no sé" con "uno más uno" y "dos más dos") y el ejemplo que
  desambigua lo arregla en el acto. Es eliminación de hipótesis de verdad, no parecido de patrones.
- Límite: los números son seis y la canción de contar se aprende entera; con seis números el espacio de acertijos es
  minúsculo, y un acertijo cuya respuesta pasa de "seis" no tiene palabra para contestarse.

Pruebas en la suite (los tres motores, con las líneas de Perl como texto fijo): 3 ejemplos de suma; los del Capitán;
con "uno más dos" de más; con ruido el cubo crece a 4³; quieto y con ruido crece a 5³.

### El acertijo oído como una sola melodía (Capitán, 2026-11-06)

> *"Es fácil pensar con palabras atómicas; ahora es el verdadero desafío."* — *"Dale de comer los números primero y
> después dale el acertijo con palabras."*

Sin cadena de sucesores y sin búsqueda de reglas (parámetro 14 de `p`, `MODO`): la voluntad aprende solo los seis
números por su canción, el cardumen oye la cuenta entera como una sola canción (`CUENTAS` veces), y cada acertijo
mostrado, "a más b es", se canta como **una sola canción**; el oído aprende esa melodía con su respuesta c, como aprendió
cada número. Preguntado, la misma canción, y lo que el oído adivina es la respuesta. 8 acertijos mostrados, 7
preguntados, 20 semillas (140 preguntas):

| Condición | Acierta | Contestó el primer número del acertijo |
|---|---|---|
| números primero (3³, crece) | **0 %** | **100 %** |
| números primero, cardumen quieto | 0 % | 100 % |
| números primero, cubo 5³ fijo | 0 % | 100 % |
| sin darle los números | 13 % | 8 % |
| azar / la respuesta más común de los ejemplos | 17 % / 16 % | — |

- **Falla, y se sabe por qué.** El oído lee notas por paso desde el comienzo de la canción, y la canción del acertijo
  empieza con la del primer número: la melodía que más se le parece es esa. Contesta "a" en las 140 preguntas, y en
  una suma la respuesta nunca es "a". Es el mismo sesgo del comienzo que tenían las palabras nuevas (40 % con la misma
  primera letra), ahora llevado al extremo.
- Sin los números, el oído solo conoce las melodías de los acertijos mostrados y queda en el azar (13 %).
- Ni el tamaño del cubo ni aprender mueven nada: la lectura de la voluntad (por paso, desde el comienzo) es el cuello
  de botella, no el cardumen.
- Lo que haría falta, para pensarlo con el Capitán: que la voluntad oiga **la relación entre partes** de la melodía (qué
  cambia entre "a" y la respuesta), no la melodía entera pegada al comienzo; o que el cardumen transforme la canción de
  modo que "dos más tres" y "cinco" suenen parecido, que es justo lo que hoy no hace.

### Palabras y estructura: el núcleo por lo que es, no por dónde está (Capitán, 2026-11-06)

> *"Palabras y estructura: la palabra, el significado, y el hilo conductor, la relación entre palabras."* — *"Tenés
> dos significados, el de la estructura y el de las palabras; entre todos forman un significado final."* — *"El orden
> es importante pero no marca el núcleo: quizás lo importante esté al medio o al final."* — *"Usá la tecnología de lo
> que sí entendió sumando."*

`MODO` 2 en `voluntad_acertijos.jsm`: lo que funcionó con los números, llevado a la estructura. Cada palabra se oye como
su propia canción; el significado de un número es su lugar en la cuenta, y el primer número que aparece es "a" y el
segundo "b", estén donde estén. **El núcleo se encuentra por lo que es**: toda palabra que no es un número es candidata
("mas", "menos", "es"), y una regla vale para una palabra según la parte de las veces que esa palabra apareció en que
la regla se cumplió. "Es" aparece en sumas y restas y ninguna regla le vale siempre; "mas" y "menos" sí. Se enseña con
un orden (`ENSENA`) y se pregunta con otro (`PREGUNTA`): 0 "a op b es", 1 "op a b es", 2 "a b op es", 3 "es a op b".

Suma y resta mezcladas, 3 ejemplos de cada una enseñados en el orden 0, 20 semillas:

| Preguntado en | Acierta | Sin respuesta | Semillas con todo bien |
|---|---|---|---|
| orden 0 (el mismo) | 100 % | 0 % | 20 |
| orden 1 (núcleo adelante) | 100 % | 0 % | 20 |
| orden 2 (núcleo al final) | 100 % | 0 % | 20 |
| orden 3 ("es" adelante) | 100 % | 0 % | 20 |
| orden 2, 10 % de resbalones | 92 % | 5 % | 10 |
| orden 3, 20 % | 87 % | 9 % | 2 |
| orden 2, 2 ejemplos de cada una | 95 % | 4 % | 18 |
| control: respuestas al azar | 21 % | 26 % | 1 |

- ⚠️ **Lo honesto: que no dependa del orden está construido, no aprendido.** "El primer número es a, el segundo b" y
  "el núcleo es una palabra que no es número" los escribió Doc; por eso el 100 % vale igual en los cuatro órdenes.
  **Lo que sí aprende de los ejemplos es cuál palabra es el núcleo** ("mas" o "menos", y no "es") y qué regla le
  corresponde a cada una. Las reglas siguen siendo las 27 candidatas de Doc, y el cardumen sigue poniendo solo el oído.

### Sumar sin reglas, inventando sus palabras como en el lazo (Capitán, 2026-11-06)

> *"Olvidate de las reglas: no quiero parches ni decirle cómo tiene que hacerlo, quiero que lo descubra, como cuando
> funcionaba en el idioma que inventaba."*

`voluntad_juego.jsm` con `cardumen_cubo.jsm`: el lazo que le ganó a EGG, con sumas. Cada palabra (uno…seis, más, menos)
se dice con 3 piezas de la cara de abajo elegidas por sus dados: su palabra inventada. "a más b" es una canción de tres
saludos (las piezas de a, de más, de b); el cardumen la canta con las olas que se cruzan y la voluntad lee la respuesta
en la melodía, aprendiendo con la respuesta. Si acierta, la canta otra vez (el cardumen la asienta); si erra, mueve una
pieza de una de las tres palabras. Practica 10 de las 15 sumas, sacadas por dados, y después se le preguntan las 5 que
nunca practicó, sin aprender. 20 semillas:

| Condición | Práctica, último cuarto | Practicadas, al final | Nunca vistas |
|---|---|---|---|
| 4³, 2.000 vueltas | 27 % | 27 % | 13 % |
| 4³, 8.000 vueltas | 25 % | 21 % | 11 % |
| 6³, 8.000 vueltas | 26 % | 25 % | 15 % |
| 4³, 8.000 vueltas, quieto | 26 % | 31 % | 13 % |

El azar es 17 %. **No aprende ni las que practica, y más vueltas no ayudan.** Diagnóstico: en el lazo cada cosa tenía su
propia señal; acá cada número está en muchas sumas, y mover una pieza para arreglar una suma rompe las otras donde está
esa palabra. Además, al errar mueve al azar sin recordar qué andaba. Es una medición, no una prueba de que no se puede.

### Gemelos: el significado en átomo y el significado del todo (Capitán, 2026-11-06)

> *"Necesitamos una composición de la AMMC: la relación entre palabras y el significado final, el significado en átomo y
> el significado en un todo."* — y la orden de estudiar Razar (`E:/proyectos/razar`).

Lo que dice la AMMC, leída entera: el átomo es un tipo fijo y los conceptos se arman en el momento (§7.1); un concepto es
lo que se repite entre muchos casos y se adopta solo si se paga solo (P36: "un grupo de uno es una anécdota"); y **la
misma canción en otro tono (P44)**: Razar encontró solo el género en el Nuevo Testamento comparando **gemelos**
(uno/una, hijo/hija) y quedándose con la diferencia que más se repite. `MODO` 4 lleva ese mismo mecanismo a las
oraciones, sin ninguna regla de sumar:
- **La base, por repetición:** las sumas mostradas se oyen `REPS` veces, palabra por palabra, y se guardan como lugares
  en la canción de contar; un recuerdo es firme si una respuesta se oyó en la mayoría de las repeticiones.
- **El significado en átomo:** un número es su lugar en la canción de contar, aprendida oyéndola.
- **Gemelos:** dos recuerdos firmes del mismo operador que difieren en un solo número. Cada par dice: "ese número se
  movió d pasos y la respuesta se movió e".
- **El significado del todo, una propiedad:** para un operador, un número y un d, la e en que más pares coinciden; se
  adopta solo si la dicen al menos dos pares y ninguna otra empata.
- **Transferencia:** preguntado algo que nunca practicó, vota cada recuerdo que es su gemelo, moviendo su respuesta por
  la propiedad. Empate o nada: "no sé".

20 semillas, sumas que nunca practicó:

| Condición | Memoria | Propiedades | Bien | Mal | No sé |
|---|---|---|---|---|---|
| 6 practicadas | 100 % | 2,7 | 29 % | 0 % | 70 % |
| 8 practicadas | 100 % | 6,3 | 84 % | 0 % | 15 % |
| **10 practicadas** | 100 % | 9,1 | **98 %** | **0 %** | 2 % |
| 8, 20 % de resbalones, 1 repetición | 93 % | 5,7 | 71 % | 1 % | 27 % |
| 8, 20 %, 5 repeticiones | 96 % | 5,8 | 75 % | 1 % | 23 % |
| suma y resta, 8 de cada una | 100 % | 12,1 | 85 % | 0 % | 15 % |
| control: respuestas al azar | 15 % | 2,0 | 2 % | 25 % | 71 % |

- **Entiende más cuanto más sabe de memoria**, como un chico: con 6 sumas memorizadas casi no generaliza (dice "no sé"),
  con 10 acierta el 98 % de las que nunca vio. **Casi nunca se equivoca**: cuando no tiene gemelos que alcancen, no
  contesta.
- **Nadie le dijo qué es sumar.** Lo que encuentra es "un paso más en un número, un paso más en la respuesta" para la
  suma y "un paso menos" para la resta, separado por operador, porque es lo que más se repite entre sus gemelos.
- El control lo confirma: con las respuestas sorteadas no hay recuerdos firmes ni propiedades que se repitan.
- Lo honesto: comparar gemelos y medir la diferencia en pasos es un sesgo, pero es el mecanismo general de la AMMC (P44),
  no uno escrito para sumar; y el cardumen sigue poniendo sobre todo el oído.

**Revisión del otro chat del Capitán, y lo que se hizo (2026-11-06):**
- **¿Es la misma rutina que la del género?** No. El P44 de Razar es código C que compara **letras**; esto es una
  reimplementación en Janax del mismo principio (pares que difieren en un lugar, la diferencia que más se repite), y
  **la diferencia se mide en pasos de la canción de contar**: esa adaptación a los números es de Doc, así que la objeción
  de "quién escribió el espacio" vuelve en parte.
- **El instrumento primero:** el ensamblador PDP dejaba pasar en silencio una etiqueta definida dos veces (pasó dos veces
  esta noche: el salto iba a la otra). Ahora es un error en la primera pasada, como en FASM (`so/pdp/pdp.md`). Con el
  ensamblador arreglado, los programas de los acertijos salen **idénticos byte por byte**, y también los 126 del
  repositorio que tenían binario de referencia: los números de arriba no cambian.
- **El portero del P36, que faltaba: gemelos al azar** (`CIEGOS`, qword 18 de `p`): dos recuerdos cualesquiera del mismo
  operador, con un número "movido" elegido por los dados, cuentan como si fueran gemelos.

| 20 semillas, nunca vistas | Bien | Mal | No sé |
|---|---|---|---|
| gemelos, 8 sumas | 84 % | 0 % | 15 % |
| gemelos al azar, 8 sumas | 22 % | 25 % | 52 % |
| gemelos, 10 sumas | 98 % | 0 % | 2 % |
| gemelos al azar, 10 sumas | 16 % | 28 % | 56 % |
| gemelos al azar, suma y resta | 17 % | 35 % | 46 % |

- **Lo más defendible de la noche no es el 98 %, es la columna "mal":** con gemelos de verdad nunca afirma algo falso
  (0 %, 1 % con ruido); con gemelos al azar o respuestas al azar afirma basura (25–35 %). Cuando los datos son
  coherentes saca propiedades buenas; cuando no, sus propiedades fallan y lo dice el error, no solo el acierto. Y
  29 % → 84 % → 98 % con 6, 8 y 10 sumas memorizadas es una curva ordenada, no un número suelto.
- Sigue siendo un resultado del mecanismo de gemelos, no del cardumen (que pone el oído), y el vocabulario llega a
  "seis": el espacio de acertijos es chico.

### Un acertijo lógico: quién es mayor (Capitán, 2026-11-06)

> *"Dale de comer un acertijo lógico con palabras, enseñáselo de varias formas y fijate si aprendió."*

`TIPO` 3 en `voluntad_acertijos.jsm`: seis hermanos (ana, beto, ceci, dani, eli, fede, de mayor a menor) y dos formas,
"mayor" y "menor". La base es oír a los hermanos en orden, como la canción de contar (cada uno vale por su lugar). Practica
solo los pares vecinos en las dos formas ("ana mayor beto es ana", "ana menor beto es beto": 20 acertijos) y se le
preguntan los 40 pares que nunca vio (ana–ceci, beto–eli…), con el mecanismo de gemelos tal cual (`MODO` 4).

20 semillas: memoria 100 %, 8 propiedades adoptadas, y en los pares nunca vistos **0 % bien, 29 % mal, 70 % no sé.**

- **Falla, y era la predicción:** "quién es mayor" es una **comparación**: la respuesta salta de un hermano al otro según
  el orden, no se mueve pareja con lo que cambia. Los gemelos solo capturan cambios parejos ("un paso más, un paso más");
  de pares vecinos solo salen diferencias de 2 lugares, y aplicadas a pares lejanos dan respuestas equivocadas.
- **Rompe el "nunca afirma algo falso" de las sumas:** acá se equivoca el 29 %. El 0 % de error no es una virtud general
  del mecanismo; vale donde la relación es pareja.
- Lo que faltaría: en la AMMC, el significado del todo para una comparación no es "cuánto cambió" sino **"quién va antes en
  la canción"** — el orden de los lugares, no su diferencia.
- (De paso: con 30 acertijos por relación, la tabla donde se arman pisaba la de los practicados, que tenía lugar para 16.
  Se reacomodaron las tablas; los modos de antes dan la misma huella.)

### La puerta y su interruptor: la negación de Razar llevada a la lógica (Capitán, 2026-11-06)

> *"Leé la parte de Razar donde descubro la negación y tomá eso para armar la lógica."*

Razar encontró el "no" en el Nuevo Testamento sin que nadie se lo nombrara, por cinco propiedades medibles; una de ellas:
**cuando el interruptor aparece, lo que sigue cambia, y el resto es el mismo lugar**. Y guarda lo negado como **puerta
cerrada**: el mismo lugar dicho al revés. `MODO` 5 en `voluntad_acertijos.jsm`, con la misma base que los gemelos:
- **El significado del todo para comparar:** cuál de las dos palabras va antes en la canción (orden) y cuál respondió
  (papel). La puerta de cada palabra de relación: para cada orden, el papel que dicen sus recuerdos (al menos dos, sin
  empate).
- **El interruptor, descubierto:** una palabra de relación es el interruptor de otra si, para los mismos dos hermanos, su
  respuesta va al otro en la mayoría de los pares que recuerda de las dos (y al menos dos).
- **Puerta cerrada:** lo que sabe de una lo sabe de la otra, dado vuelta.
- `EJEM` (con `TIPO` 3) = cuántos pares vecinos de "menor" practica; los de "mayor" se practican todos.

20 semillas, pares que nunca vio:

| Condición | Interruptor hallado | Bien | Mal | No sé |
|---|---|---|---|---|
| "menor" practicado en los 10 pares | 20 de 20 | 97 % | 0 % | 2 % |
| **"menor" practicado en solo 2 pares** | **20 de 20** | **98 %** | **0 %** | 1 % |
| "menor" en 1 par | 0 de 20 | 39 % | 0 % | 60 % |
| "menor" nunca | 0 de 20 | 39 % | 0 % | 60 % |
| 2 pares, 20 % de resbalones | 18 de 20 | 87 % | 1 % | 10 % |
| control: respuestas al azar | 20 de 20 | 31 % | 37 % | 31 % |

- **Con dos pares de "menor" alcanza:** descubre que "menor" es el interruptor de "mayor" y contesta en esa forma todo lo
  que nunca practicó, usando lo de "mayor" dado vuelta. Con uno solo no se anima (un caso es una anécdota): contesta lo de
  "mayor" (el 39 %) y dice "no sé" en lo de "menor". Sin errores.
- **Donde los gemelos fallaban (0 % bien, 29 % mal), la puerta acierta 97–98 % sin errores**: para comparar, el
  significado del todo es el orden, no la diferencia.
- ⚠️ **El control muestra un punto flojo:** con las respuestas al azar también "encuentra" un interruptor (los pares se dan
  vuelta la mitad de las veces y alcanza con la mayoría); ahí sus puertas fallan y lo dice el error (37 %). El criterio
  del interruptor debería compararse contra el azar, como el portero del P36; hoy es solo mayoría.
- Lo honesto: que el significado de una comparación sea "quién va antes en la canción" lo pone Doc (es la definición del
  significado en átomo del Capitán); lo que descubre es qué papel responde y que "menor" es el interruptor.

**El interruptor, endurecido contra el azar** (Capitán: "sí, endurecelo"). Dos cambios: (1) "se dio vuelta" cuenta solo
cuando la respuesta pasa **al otro hermano del par**; una respuesta que no es ninguno de los dos no dice nada (antes
contaba cualquier respuesta distinta, y con respuestas al azar casi todas lo eran); (2) **el portero del P36**: el
interruptor se adopta solo si se da vuelta en una parte mayor de los pares que recuerda de las dos formas que en cada
uno de **ocho emparejamientos ciegos** (cada recuerdo de "mayor" con uno cualquiera de "menor", sacado por los dados), y
en al menos dos pares. 20 semillas:

| Condición | Interruptor hallado | Bien | Mal | No sé |
|---|---|---|---|---|
| "menor" en 2 pares | 20 de 20 | 98 % | 0 % | 1 % |
| "menor" en los 10 | 20 de 20 | 97 % | 0 % | 2 % |
| 2 pares, 20 % de resbalones | 17 de 20 | 83 % | 1 % | 14 % |
| **control: respuestas al azar** | **0 de 20** (antes 20) | 13 % | **17 %** (antes 37 %) | 68 % |

Con datos coherentes nada cambia; con respuestas al azar ya no encuentra interruptor. El 17 % de error que queda en el
control viene de las puertas de "mayor" armadas sobre recuerdos al azar: su criterio (al menos dos, sin empate) tampoco
se compara contra el azar todavía.

**Las puertas, con el mismo portero** (Capitán: "sí, a las puertas"). Para cada palabra de relación se mide cuánto le dice
el orden al papel en sus recuerdos (el papel más dicho de cada orden, sumado) y tiene que ser más que en cada una de
**ocho versiones ciegas**, donde a cada recuerdo le toca el orden de otro recuerdo cualquiera de esa palabra; si no, sus
puertas no se adoptan. 20 semillas:

| Condición | Interruptor | Bien | Mal | No sé |
|---|---|---|---|---|
| "menor" en 2 pares | 19 de 20 | 95 % | 0 % | 4 % |
| "menor" en los 10 | 20 de 20 | 97 % | 0 % | 2 % |
| 2 pares, 20 % de resbalones | 17 de 20 | 80 % | 0 % | 18 % |
| **control: respuestas al azar** | 0 de 20 | 0 % | **0 %** (antes 17 %) | **100 %** |

Con respuestas al azar ya no adopta ninguna puerta ni interruptor: **calla siempre**. Con datos coherentes sigue sin
errores. El portero es exigente con pocos casos (con dos recuerdos, una versión ciega puede empatar y "más" tiene que ser
estricto): una semilla perdió el interruptor con 2 pares de "menor" (95 % en vez de 98 %).

### Los dos mecanismos en la misma corrida, y el P36 elige (2026-11-06)

> *"Poné los dos mecanismos disponibles en la misma corrida y dejá que P36 elija. Si en las sumas gana los gemelos y en
> las comparaciones gana la puerta, sin que nadie le diga cuál es cuál, ése es el resultado grande de todo el proyecto."*
> — el otro chat del Capitán, y el Capitán lo pegó como orden.

`MODO` 6: el mismo programa arma los gemelos y la puerta como rutinas que pueden construirse **dejando afuera un
recuerdo** (`EXCL`). Para elegir, **armonía del P36 y del D39** (*describir lo mismo con menos, sin dejar de dar cuenta de
todo*): cada recuerdo firme se tapa por turno, cada mecanismo se arma con los demás y lo adivina (acierto +1, error −1,
silencio 0); gana el que más explica **por pieza** (propiedades de los gemelos; puertas e interruptor de la puerta). Con
ese contesta lo que nunca vio; si empatan, votan los dos. Nadie le dice qué mecanismo es para qué.

20 semillas por fila, el mismo programa, sin cambiar nada más que lo que se le enseña:

| Lo que se le enseña | Elige gemelos | Elige puerta | Los dos | Bien | Mal | No sé |
|---|---|---|---|---|---|---|
| 10 sumas | **20** | 0 | 0 | 98 % | 0 % | 2 % |
| 8 sumas | 18 | 0 | 2 | 84 % | 0 % | 15 % |
| suma y resta, 8 de cada una | **20** | 0 | 0 | 85 % | 0 % | 15 % |
| **hermanos: vecinos + algunos a dos lugares** | 0 | **20** | 0 | **98 %** | **0 %** | 1 % |
| 10 sumas, 20 % de resbalones | 20 | 0 | 0 | 88 % | 4 % | 8 % |
| hermanos, 20 % de resbalones | 0 | 20 | 0 | 75 % | 0 % | 24 % |
| hermanos: solo vecinos | 19 | 1 | 0 | 2 % | 11 % | 86 % |
| control: sumas con respuestas al azar | 1 | 14 | 5 | 0 % | 1 % | 99 % |
| control: hermanos con respuestas al azar | 2 | 17 | 1 | 0 % | 1 % | 97 % |

- **Sin que nadie le diga cuál es cuál, elige gemelos en las sumas (58 de 60) y la puerta en las comparaciones (20 de
  20)**, y con eso acierta 98 % de lo que nunca vio en las dos, sin errores.
- ⚠️ **La condición, dicha de entrada:** en las comparaciones, la memoria tiene que tener **algún par que no sea vecino**
  ("enseñado de varias formas"). Con solo vecinos, entre vecinos los gemelos son una descripción perfecta y más chica, y
  el P36 los elige: la memoria no tiene la evidencia que los distingue. Es el segundo criterio del P36, la
  **transferencia** ("un miembro hace algo que nunca se le vio hacer"): sin un caso distinto en la memoria no hay qué medir.
- Con respuestas al azar nada explica nada; la elección queda casi al azar, pero **calla** (97–99 % "no sé").
- Lo honesto: los dos mecanismos los escribió Doc a partir de piezas de la AMMC (P44 los gemelos, P54 la puerta), y el
  significado en átomo (el lugar en la canción) es la definición del Capitán. Lo que hace el sistema sin que nadie se lo
  diga es **elegir cuál sirve para cada cosa**, con el criterio de armonía de Razar. El cardumen sigue poniendo el oído.

**Revisión del otro chat del Capitán sobre la elección (2026-11-06), y lo que se midió:**
- **Tiene nombre:** "describir lo mismo con menos, sin dejar de dar cuenta de todo" (D39) es **MDL**, *Minimum Description
  Length* (Rissanen, 1978): la mejor hipótesis es la que más comprime los datos contando el costo de la hipótesis misma.
  Y tapar cada recuerdo para que los demás lo adivinen es **validación cruzada dejando uno afuera**: MDL con LOO es la
  respuesta que el campo da a "qué modelo elijo". Razar la tenía en su D39 sin haberla buscado.
- **La fila de "solo vecinos" es la prueba más fuerte, no una advertencia:** elegir mal cuesta 11 % de error; entonces el
  0 % de las otras filas **se gana eligiendo bien**. La elección tiene dientes. Y el criterio no se equivoca ahí: entre
  vecinos los gemelos son la descripción más chica; falta evidencia, no criterio (la transferencia del P36).
- **¿Se tocó el criterio mirando los resultados? Sí.** La primera versión era aciertos − errores; al ver que en los
  hermanos con solo vecinos elegía gemelos se pasó a "por pieza" (D39), y siguió eligiendo gemelos; lo que cambió el
  resultado fue agregar pares lejanos a la memoria, no el criterio. **Verificado:** con el criterio original las
  elecciones de las filas principales son idénticas (gemelos en sumas 58 de 60, puerta en comparaciones 20 de 20, los
  mismos aciertos); solo cambia la fila de solo vecinos (empata gemelos y puerta en 14 de 20). El resultado no depende
  del ajuste.
- **El distractor** (pedido por el otro chat): un tercer mecanismo inútil, **el eco**, que contesta siempre la respuesta
  más común de su memoria con una pieza por relación.

| 20 semillas | Elige | Bien | Mal |
|---|---|---|---|
| 10 sumas | gemelos 20 | 98 % | 0 % |
| 8 sumas | gemelos 18, empate de los tres 2 | 81 % | 1 % |
| hermanos, vecinos + lejanos | puerta 20 | 98 % | 0 % |
| las otras filas reales | igual que sin eco | igual | igual |
| control: sumas al azar | eco gana o empata en 10 | 1 % | **29 %** (sin eco, 1 %) |
| control: hermanos al azar | eco empata en 5 | 0 % | 1 % |

  **Con datos reales el eco no gana nunca** (solo empata cuando los tres explican cero). **Pero con datos al azar a veces
  gana y afirma basura:** el error del control de sumas sube de 1 % a 29 %. El criterio rechaza lo inútil cuando hay
  estructura; cuando no la hay, un mecanismo barato puede ganar por poco. En términos de MDL falta el **modelo nulo**: el
  eco es justamente la frecuencia de las respuestas, y un mecanismo debería elegirse solo si le gana a ese nulo. Queda
  dicho que esa corrección vendría **después de ver** este resultado.

**El modelo nulo de MDL, agregado después de ver el agujero** (Capitán: "sí, agregalo"). El eco deja de competir y pasa a
ser **la vara**: lo que se elija (gemelos, puerta o los dos si empatan) tiene que explicar por pieza más que el eco, la
frecuencia de las propias respuestas; si no le gana, no se elige nada y calla. 20 semillas:

| Fila | Elige | Bien | Mal | No sé |
|---|---|---|---|---|
| 10 sumas | gemelos 20 | 98 % | 0 % | 2 % |
| 8 sumas | gemelos 18, nada 2 | 76 % | 0 % | 23 % |
| suma y resta | gemelos 20 | 85 % | 0 % | 15 % |
| hermanos, vecinos + lejanos | puerta 20 | 98 % | 0 % | 1 % |
| hermanos, solo vecinos | gemelos 19, puerta 1 | 2 % | 11 % | 86 % |
| 10 sumas, 20 % de resbalones | gemelos 20 | 88 % | 4 % | 8 % |
| hermanos, 20 % de resbalones | puerta 20 | 75 % | 0 % | 24 % |
| control: sumas al azar | nada 10, puerta 7, los dos 3 | 0 % | **0 %** (con eco compitiendo, 29 %) | 100 % |
| control: hermanos al azar | nada 5, puerta 13, gemelos 2 | 0 % | 1 % | 97 % |

Con datos al azar vuelve a callar (0–1 % de error). Con datos reales nada cambia salvo dos semillas de 8 sumas, donde los
tres explicaban cero y ahora no elige nada (76 % en vez de 81 %). La regla general, en palabras de MDL: **un mecanismo se
adopta solo si comprime mejor que el código trivial de los datos**.

### La memoria en el cubo, primer intento (Capitán, 2026-11-06)

> *"Ahora hacé que el cubo no ponga solo el oído"* — y eligió que guarde la memoria (opción 2).

`MODO` 7: la voluntad no anota las respuestas; cada suma practicada se canta entera al cardumen ("dos mas tres es
cinco"), `REPS` veces, y el cardumen la asienta en sus pesos. Para recordar, la voluntad le canta **solo para oír** (orden 6,
bit 16: el cardumen no aprende de esa canción) cada final posible, y se queda con el que más cambió desde antes de practicar.

**No funciona, y se sabe por qué:** la respuesta del cubo a cada final es **idéntica, nota por nota, antes y después** de
practicar (medido con un instrumento en la semilla 1001). Su aprendizaje refuerza los caminos que ya se despiertan y
debilita los que nunca lo hacen; en una canción limpia eso no cambia **qué** piezas suenan. El cubo cambia sus pesos pero
no deja una huella que se oiga en una canción limpia. (Una primera lectura, "más notas que la palabra sola", daba 0 de 10:
la palabra sola tapaba todo.) Encaja con lo de las palabras-canción: aprender le ganaba al quieto **solo con ruido**,
cuando un dedo resbalaba y el camino reforzado completaba la palabra. La memoria del cubo, tal como aprende hoy, es de
**completar**, no de **distinguir**.

## La memoria del kernel y las piezas de Fano: los pares de los libros (Capitán, 2026-11-07)

> *"Traducir la oración a la construcción de las canciones que ya saben, con recombinaciones; la memoria no hace falta
> en el cubo: la porta el kernel, la memoria está del lado del kernel neuronal."* — *"Mientras más larga, más difícil de
> llegar al 20 %."*

**El instrumento** (`razar/cardumen/memoria_pares.jsm`): lee los pares pregunta → respuesta que `sentido` saca de los
libros (archivo `pares` de la casa). El kernel guarda cada pregunta por sus palabras. Cada pregunta se canta con las 7
piezas de Fano, una letra son dos piezas, y el alfabeto lo dan las letras de los pares (34 de las 49 posibles: a..z y
las de las tildes y la ñ). Cada pieza tiembla con la chance dada (se oye como otra de las siete), y el kernel devuelve
la respuesta del par que comparte más palabras con lo que oyó. Las chances son las medidas en el cubo con Fano (cerca del
4 % de las piezas con temblor del 10 %, cerca del 9 % con 20 %); el cubo no corre todavía, porque se midió que transmite y
no calcula. Semilla fija, en Janax, 1,1 segundos.

**Medido con 2.710 pares del Nuevo Testamento** (respuestas bien, por largo de la pregunta):

| piezas que tiemblan | 1-5 palabras (1.100) | 6-12 (1.015) | 13 o más (595) |
|---|---|---|---|
| 0 % | 51 % | 93 % | 98 % |
| 2 % | 39 % | 91 % | 97 % |
| 4 % (≈ temblor 10 %) | 29 % | 86 % | 96 % |
| 9 % (≈ temblor 20 %) | 14 % | 60 % | 92 % |
| 20 % | 2 % | 17 % | 48 % |

- **La hipótesis del Capitán se cumple:** cuanto más larga la oración, más le cuesta al temblor taparla. Con el temblor
  del 20 %, una pregunta larga vuelve bien el 92 % de las veces y una corta el 14 %: a la larga le sobran palabras para
  que el kernel la reconozca.
- **Las cortas no llegan al 100 % ni sin temblor (51 %):** muchas son el mismo anuncio repetido ("y les dijo:") con una
  respuesta distinta cada vez. Con esas palabras solas la pregunta no alcanza; hace falta el contexto (lo que venía
  antes), que es lo que el telescopio de oraciones tendría que traer.
- **Lo que falta:** que oiga el cubo de verdad en lugar de las chances medidas, y que la respuesta se cante de vuelta.

### Con las 30 canciones que el cubo ya sabe, y su propia tabla de confusiones (Capitán, 2026-11-07)

> *"Traducir la oración a la construcción de las 30 canciones que ya saben, con recombinaciones."* — *"Ni se te ocurra
> usar Perl: todo lo medimos en Janax."*

- **La tabla del cubo, en Janax** (`voluntad_oraciones.jsm`, un cuarto parámetro en `p`: cuántas veces cantar cada
  palabra). Después de lo de siempre (la huella del modelo no cambia: `0000A1A4AA959425`, 86 %, 93 %, 32), canta cada
  una de las 30 palabras esa cantidad de veces, con los dedos resbalando, y guarda qué oyó en la casa (`cf`, 30 × 31).
  Con 50 veces cada una, en un segundo: con resbalones del 10 % oye bien 1.407 de 1.500 (93,8 %); con 20 %, 1.337
  (89,1 %). Nunca se queda sin oír: siempre elige alguna.
- **La memoria con esas piezas** (`memoria_pares.jsm`, si la casa tiene `cf`): cada letra se canta con dos de las 30
  canciones (900 combinaciones, sobran para las 34 letras), y cada canción se oye como la oyó el cubo, sorteada de su
  fila de la tabla. 2.710 pares del Nuevo Testamento, respuestas bien:

| | 1-5 palabras | 6-12 | 13 o más |
|---|---|---|---|
| cubo, resbalones 10 % | 37 % | 89 % | 97 % |
| cubo, resbalones 20 % | 32 % | 86 % | 97 % |
| Fano, 9 % de piezas (≈ temblor 20 %) | 14 % | 60 % | 92 % |

- **Con las canciones que ya sabe, el cubo real anda mejor que Fano**, aunque cada canción se oiga mal más seguido (11 %
  con 20 % de resbalones): sus confusiones no son al azar, y una letra con dos canciones aguanta más.
- Las cortas siguen ambiguas por sí mismas: les falta el contexto.

### El contexto: la pregunta con lo que venía antes (2026-11-07)

- `sentido` escribe, junto a cada par, una línea "C:" con el edificio que viene antes de la pregunta en el libro (`QACS`).
  La memoria (`memoria_pares.jsm`) guarda cada pregunta por sus palabras **y** las de su contexto, y oye las dos cosas
  juntas, cantadas con las 30 canciones y la tabla real del cubo.

| | 1-5 palabras | 6-12 | 13 o más |
|---|---|---|---|
| resbalones 10 %, sin contexto | 37 % | 89 % | 97 % |
| resbalones 10 %, con contexto | 91 % | 98 % | 99 % |
| resbalones 20 %, sin contexto | 32 % | 86 % | 97 % |
| resbalones 20 %, con contexto | 86 % | 96 % | 99 % |

- **Las cortas dejan de ser ambiguas:** "y les dijo:" con lo que se venía contando ya dice cuál es. Con el temblor más
  fuerte pasan del 32 % al 86 %.
- **La diferencia de pares, explicada (2026-11-07).** Era un error del lector: cuando una pregunta no tenía su "R:" justo
  después, se salteaba también el renglón que había mirado. Sin contexto ese renglón era la pregunta siguiente (se
  perdía); con contexto era su "C:" (se salvaba, pero pegada al contexto equivocado). Ahora ese renglón se vuelve a
  leer como propio y el contexto viejo se descarta: 2.889 pares sin contexto, 2.881 con él. Los 8 de diferencia son
  del filtro de prueba, no del lector: `rg "^(P|R): "` saca respuestas que empiezan con coma (`R:,`), y sin las "C:" de
  por medio la pregunta anterior queda pegada a la respuesta de otra. Con contexto, esos 8 se cortan bien.

| (2.889 / 2.881 pares) | 1-5 palabras | 6-12 | 13 o más |
|---|---|---|---|
| resbalones 10 %, sin contexto | 37 % | 90 % | 98 % |
| resbalones 10 %, con contexto | 90 % | 97 % | 99 % |
| resbalones 20 %, sin contexto | 31 % | 87 % | 97 % |
| resbalones 20 %, con contexto | 85 % | 95 % | 99 % |

## Su propio canto (2026-11-07)

El Capitán: *"quiero que construya su propia canción como el idioma, no solo acertar la respuesta"*, *"desde las
canciones mismas"*. Con un archivo `canta` en la casa (una pregunta por renglón), `memoria_pares.jsm` no contesta: canta.

- **Cada par es una fila de canciones:** una letra son sus dos piezas (su número en la base: las 30 canciones con la
  tabla del cubo, o las 7 de Fano sin ella), un silencio entre palabras, un turno después de la pregunta y un fin
  después de la respuesta.
- **Aprende qué sigue a cada contexto**, y el contexto crece una canción más **sólo donde el más corto lo dicen dos
  pares o más**: lo que dice una sola oración es un recuerdo; lo que dicen dos, una regla. No hay largo fijo: los
  contextos llegan hasta donde los libros se repiten. En el oficio es un Markov de orden variable, de la familia de PPM;
  lo propio es la regla de crecimiento por repetición y que las piezas son las canciones del cubo.
- **Compone** después de oír la pregunta, canción por canción, desde el contexto más largo que dicen dos pares. Sortea
  según las veces que cada canción vino después de él, con un sorteo de semilla fija (determinista), hasta el fin o
  hasta el largo de la respuesta más larga de los libros.
- Prueba: `bash razar/cardumen/canto_prueba.sh`. Con cuatro pares, "hola primo" (no está en ningún libro) da
  "buen dia".

Medido con el Nuevo Testamento (2.889 pares, la tabla real del cubo, 15 s):

| | |
|---|---|
| contexto más largo que dicen dos pares | 519 piezas |
| palabras cantadas que son palabras de los libros | 99 % |
| palabras cantadas que son de su propia respuesta | 16 % |
| copia de su respuesta (el tramo más largo en común) | 18 % |

Ejemplos: "y les dijo:" → *ahora su nombre de jesús dijo*; "quien es este?" → *jesús les respondió*; "donde esta
pedro?" → *seguro que eres uno de ellos porque tú también eres galileo».*

- **Lo que ya canta:** frases propias con palabras reales; casi no inventa palabras (99 % existen).
- **Lo que todavía no:** la pregunta lo guía poco (16 % de su respuesta). Un contexto de canciones sólo ve el final de
  la pregunta, no su sentido. El paso siguiente es que la memoria le diga *qué* decir, y el canto *cómo*.
- **Ojo con "dos pares":** los evangelios repiten versículos enteros, así que dos pares a veces son el mismo recuerdo
  contado dos veces, no una regla (el ejemplo de Pedro es casi Mateo 26:73). Lo honesto sería contar libros o lugares
  distintos, no pares.

### El canto, medido en serio (2026-11-07)

Una devolución externa le marcó al canto lo que le faltaba: un nulo, y preguntarle sobre lo que no leyó. Se sumaron
tres instrumentos a `memoria_pares.jsm`:

- **Nulo de orden cero:** cuántas palabras de su respuesta sacaría un canto que elige palabras sólo por las veces que
  las dicen los libros, sin ningún contexto, cantando la misma cantidad. Se calcula exacto (la esperanza), sin sortear.
- **De contenido:** lo mismo, pero sin las palabras más dichas que juntas hacen la mitad de todo lo que dicen los
  libros (46 a 50 palabras: y, de, que, el...). El corte sale de la distribución de los libros, no de un número fijo.
- **Afuera:** con `fuera` ("k n" en la casa) el tramo k de n de los pares, en su orden, no se lee: sólo se pregunta.
- **Recitado de lo leído:** el tramo más largo de lo que cantó que está tal cual en los libros leídos. Lo sabe el
  propio modelo: un contexto de k piezas más la pieza elegida son k+1 piezas que vio así.

| | de su respuesta | nulo | de contenido | nulo de contenido | recitado |
|---|---|---|---|---|---|
| todo leído | 16 % | 8,5 % | 7,6 % | 0,6 % | 83 % |
| tramo 1 de 4 afuera | 9 % | 8,0 % | 1,6 % | 0,5 % | 81 % |
| tramo 2 de 4 afuera | 10 % | 8,6 % | 1,8 % | 0,5 % | 80 % |
| tramo 3 de 4 afuera | 8 % | 7,1 % | 1,4 % | 0,4 % | 85 % |
| tramo 4 de 4 afuera | 10 % | 9,6 % | 0,8 % | 0,6 % | 86 % |

- **Sobre lo que no leyó, casi no le gana al nulo:** 9 % contra 8 %. El 16 % con todo leído era, casi todo, recitado.
- **En contenido hay una señal chica pero real:** de 2 a 3,5 veces el nulo en tres de cuatro tramos. Es muy poco en
  absoluto (1 a 2 %).
- **Recita del 80 al 86 % de lo que canta:** junta pedazos de versículos que vio (un centón), no compone frases nuevas.
- **Las palabras inventadas no son choques:** no hay ningún tope de 255 en el código. Son empalmes de piezas, y una
  parte son castellano correcto que ningún libro leído tiene ("denuncian", "destruirán", "arrasado", "quemarlo",
  "pidiéndole", "recompensando"): aprendió algo de cómo se arman las palabras. Otra parte son mezclas
  ("samujeres", "despíritu", "ultrajestad").
- **Conclusión:** el canto ya habla el idioma de los libros, pero todavía no contesta lo que se le pregunta. Para eso
  falta lo anotado: que la memoria le diga qué decir, y que "dos pares" cuente libros o lugares distintos, no
  repeticiones.

### Razonar: el canto aprende dónde la respuesta repite la pregunta (Capitán, 2026-11-07)

> *"Quiero que razone, que produzca respuesta, no que sea otra respuesta que antes vio."* — Su idea: como en los
> acertijos, "una oración 1 más una oración 1 da una oración 2".

Con `razona` en la casa, cada palabra de una respuesta que también está en su pregunta se canta como **su lugar**: una
canción más, `BASE + 3 + k`, a k palabras del final de la pregunta (la más cercana). El canto aprende esa marca con la
misma regla de "dos pares o más", y al cantar la llena con la palabra que esté en ese lugar de la pregunta nueva. En el
oficio es el mecanismo de copia de los traductores neuronales (pointer-generator, See y otros, 2017); lo propio es que
la marca entra como una canción y la plantilla no la escribe nadie.

- **La prueba** (`razona_prueba.sh`): cuatro pares "tu eres X? → si, yo soy X". A "tu eres felipe?", que no está en
  ningún libro, contesta **"si yo soy felipe"**. Sin `razona`, decía "si yo soy p".
- **El Nuevo Testamento, tramos sin leer:**

| | de contenido, sin razonar | de contenido, razonando | nulo | recitado sin razonar → razonando |
|---|---|---|---|---|
| tramo 1 | 1,6 % | 1,6 % | 0,5 % | 81 % → 73 % |
| tramo 2 | 1,8 % | 1,9 % | 0,5 % | 80 % → 76 % |
| tramo 3 | 1,4 % | 1,5 % | 0,5 % | 85 % → 78 % |
| tramo 4 | 0,8 % | 0,7 % | 0,6 % | 86 % → 81 % |
| control: respuestas revueltas, tramo 1 | | 0,6 % | 0,4 % | 70 % |

- **El mecanismo anda, pero en estos pares casi no hay qué copiar.** Aprendió 72 lugares; en el tramo 1 cantó 322
  (el 5 % de las palabras) y 238 dijeron una palabra. El contenido no se mueve, y recita menos (de 4 a 8 puntos).
- **Por qué:** los pares del NT son turnos de diálogo ("¿quién es este?" → "jesús les respondió"), no preguntas con
  su dato. La respuesta casi nunca repite la pregunta. Para que razone sobre hechos hace falta la otra mitad de la idea
  del Capitán: **pregunta + oración del libro → respuesta**, aprendiendo dónde la respuesta repite **la oración del
  hecho**, no la pregunta.
- **El control dice que la señal chica de contenido sale de los datos**: con las respuestas revueltas cae a 0,6 %, el
  nivel del nulo.

### Deducir la pregunta desde la respuesta, medido antes de escalar (Capitán, 2026-11-08)

> *"La Biblia es la respuesta: si hay mecanismo de respuesta, deducimos la pregunta, y recién con todas las preguntas
> deducimos las respuestas que faltan."* — Es la retrotraducción (Sennrich y otros, 2016) y lo que hizo PAQ (Lewis y
> otros, 2021, 65 millones de preguntas generadas desde textos).

Antes de generar un millón de preguntas se midió el mecanismo al revés: los mismos pares dados vuelta (la respuesta como
pregunta), con `razona`, sobre los cuatro tramos sin leer.

| al revés | de contenido | nulo | recitado |
|---|---|---|---|
| tramo 1 | 1,2 % | 0,4 % | 76 % |
| tramo 2 | 1,4 % | 0,4 % | 75 % |
| tramo 3 | 0,7 % | 0,4 % | 79 % |
| tramo 4 | 0,7 % | 0,6 % | 80 % |

- **Deduce la pregunta tan poco como deduce la respuesta:** de 1,2 a 3,5 veces el nulo, alrededor del 1 % en absoluto.
  Un millón de preguntas deducidas así serían, en su contenido, casi todas de otra cosa: Razar aprendería ruido.
- **Lo que sí da preguntas fieles:** tapar una palabra de cada oración. Esa pregunta es correcta por construcción (no
  hay que deducirla), y lo que se aprende es contestarla desde otra oración del libro.

### La semilla: las respuestas del libro como canción (Capitán, 2026-11-08)

> *"Necesitás un ejemplo real del libro y luego desmantelar ese mecanismo, darlo como canción, y ahí sí deducir una
> pregunta o una respuesta que falte."* — *"Todas las oraciones de la respuesta valen."* — *"No tires nada, todo
> funciona."* El libro: *100 preguntas básicas sobre la ciencia*, de Asimov (`E:/ciencia+.txt`, nunca al repo).

- `sentido.jsm` escribe, con `pares`, cada edificio del libro en orden: "Q:" si pregunta, "O:" si no (Asimov: 183
  preguntas, 3.331 oraciones, menos de un segundo).
- `memoria_pares.jsm` con `semilla`: la respuesta de una pregunta son las oraciones que siguen hasta la próxima
  pregunta; su semilla, la que más palabras de la pregunta repite (de las que no son de la mitad). El canto aprende cada
  semilla con **los lugares de lo que trata la pregunta** (solo esas palabras; "es", "el", "que" son gramática).
- A una pregunta no leída le elige, entre las oraciones del libro que dicen alguna palabra suya, **la que la pregunta
  vuelve más esperable**: su costo cantada como palabras sueltas menos su costo con los lugares. Medir lo más esperable a
  secas elegía respuestas ya leídas (recitar), y se corrigió.
- Prueba: `bash razar/cardumen/semilla_prueba.sh`.

Asimov, 110 preguntas con semilla, cuatro tramos sin leer (acierta si elige cualquier oración de su respuesta):

| | preguntas | el canto | la que más palabras comparte | al azar |
|---|---|---|---|---|
| tramo 1 | 27 | 18,5 % | 44,4 % | 13,7 % |
| tramo 2 | 28 | 14,2 % | 14,2 % | 9,0 % |
| tramo 3 | 27 | 33,3 % | 37,0 % | 19,2 % |
| tramo 4 | 28 | 35,7 % | 32,1 % | 15,2 % |
| **total** | **110** | **25 %** (28) | **32 %** (35) | **14 %** |

- **El canto le gana al azar** (25 contra 14 %), pero **todavía no al buscador de palabras** (32 %). Le gana en un
  tramo de cuatro.
- **Aprendió de muy poco:** unas 82 semillas por tramo. La muestra también es chica: 110 preguntas, así que unos
  puntos para arriba o para abajo son ruido.
- Lo que falta probar: más semillas (otros libros de preguntas), y que el canto sume lo que el buscador ya sabe (cuántas
  palabras comparte) en vez de competir con él.

### El cubo practica la semilla (Capitán, 2026-11-08)

> *"Poné al cubo a practicar la semilla, con vueltas y tamaño que crecen."* — *"Acordate cuando llegábamos al 100 %:
> iba mejorando con las corridas, y ahí sí dependía del tamaño del cubo."*

`memoria_pares.jsm` con `marcos` escribe, por pregunta de Asimov y oración que dice una palabra suya, **el marco**: las
cinco palabras alrededor del primer lugar de lo que trata la pregunta, como fichas (un lugar, una palabra de la mitad, u
"otra"). 8.319 marcos por tramo, 89 fichas, 6 % contestan. `voluntad_semilla.jsm` con `cardumen_cubo.jsm` (como el
juego): cada ficha es una palabra inventada de 3 piezas de la cara de abajo, un marco es una canción de cinco saludos,
la voluntad aprende a oír "contesta" o "no" (mitad y mitad), y lo no leído se pregunta solo oído (nadie aprende). Con
`pasada` (quinto parámetro) una vuelta recorre todos los que contestan, cada uno con uno que no.

Aciertos sobre las 110 preguntas no leídas (el azar, unas 15):

| | aprende | quieto |
|---|---|---|
| 4³, de 1.000 a 64.000 vueltas | 13 a 19 | |
| 5³, 1.000 y 4.000 | 22, 17 | |
| 7³, 4.000, semilla 1001 | **28** | 14 |
| 10³, 1.372 | 26 | 20 |
| 20³, 171 | 21 | (cortado) |
| 7³, 10³, 15³ con 3 pasadas | 20, 18, (9 de 55) | |
| **7³, 4.000, semillas 1002 a 1005** | **17, 18, 18, 19** | **19, 15, 17, 18** |

El 7³ barriendo vueltas (semilla 1001): 0 → 11, 3 → 18, 10 → 15, 30 → 21, 100 → 24, 300 → 18, 1.000 → 17, 4.000 → 28.

- **El 28 fue suerte de los dados.** Con otras cuatro semillas el que aprende da 17 a 19 y el quieto 15 a 19: los dos
  en el azar. **El cubo no aprende la semilla.**
- **No hay curva**: más vueltas no suben los aciertos. En la práctica pasa algo que ya se había visto: a las 100 vueltas
  llega a 56–68 % y después vuelve a 50 %. Aprende un poco y lo pierde (los pesos se saturan y lo nuevo pisa lo viejo,
  "la rigidez del cardumen").
- **El tamaño tampoco lo cambia** dentro de lo medido (4³ a 20³).
- Lo que sí deduce respuestas de Asimov sigue siendo el canto (25 %) y el buscador de palabras (32 %), en el núcleo.

### La memoria del kernel: el cubo solo oye (Capitán, 2026-11-08)

> *"Usá la memoria del kernel, es lo que queda; revisá el experimento del 7³ que llegaba a 100 % con 16 cosas."* —
> *"Exacto, eso era: lo estábamos rompiendo."*

El 7³ llegó al 100 % con 16 cosas porque cada cosa tenía su canción y su propio cajón en la voluntad. En la semilla le
habíamos dado dos cajones ("contesta", "no") donde se mezclaban miles de marcos. `voluntad_semilla.jsm` con `memoria`
(sexto parámetro): cada marco leído se canta una vez, solo oído, y **su melodía queda en la memoria del kernel** con lo
que dice; por nota, la lista de los marcos donde sonó. Ante una oración nueva gana el lado del recuerdo más parecido
(notas compartidas sobre notas de los dos, Jaccard). Controles sin cubo, como la cuenta escrita a mano de los
acertijos: `memoria=2` da a la memoria las cinco fichas tal cual, `memoria=3` la oración entera vista desde la pregunta
(línea "N:" de `memoria_pares.jsm`: cada lugar con las fichas a −2..+2, cuántas palabras de la pregunta dice y cuántas
no).

| 7³, sin practicar, tramos sin leer | acierta de 110 |
|---|---|
| memoria con la melodía del cubo (marco de 5) | 14 |
| control, las 5 fichas sin cubo | 15 |
| **control, la oración entera sin cubo** | **24** (7, 2, 9, 6) |
| azar | ~15 |

- Con cinco fichas ni la memoria perfecta acierta: **el marco era el que no alcanzaba**, no el cubo ni la memoria.
- Con la oración entera la memoria le gana al azar (24 contra 15), cerca del canto (28) y debajo del buscador de
  palabras (35). Sin cubo es determinista: no es suerte de una semilla.
- Falta: que el cubo oiga la oración entera y la memoria guarde esa melodía.

**El cubo oye la oración entera** (`memoria=4`): las notas de la oración (las de "N:") son cada una una palabra inventada
de 3 piezas, la oración es una canción de tantos saludos como notas (la mayor, 27), y la memoria del kernel guarda su
melodía. 7³ nacido de su semilla, sin practicar, cinco semillas:

| semilla | 1001 | 1002 | 1003 | 1004 | 1005 | media |
|---|---|---|---|---|---|---|
| acierta de 110 | 22 | 23 | 17 | 19 | 18 | **19,8** |

- **Las cinco semillas quedan arriba del azar** (~15,7): una prueba de signos da p ≈ 0,03. El oído del cubo conserva
  parte de lo que el control encontró: 19,8 contra 24 sin cubo. Pierde unos cuatro aciertos en el camino.
- Hay cubos que oyen mejor que otros (17 a 23), según cómo nacieron.
- Todavía debajo del canto (28) y del buscador de palabras (35).

### Preguntas simples y casos diversos (Capitán, 2026-11-08)

> *"Necesito medir algo: generá un texto con preguntas sencillas y casos diversos. Quiero ver si entiende los
> mecanismos; lo que nos está enredando son pocos casos y muy complejos."*

`razar/cardumen/libros/preguntas_simples.txt` (lo arma `preguntas_simples.py` con plantillas: solo texto, la medición
es de Razar en Janax): 116 preguntas de siete mecanismos (qué es, dónde vive, de qué color, cuántas patas, quién
escribió, qué come, en qué país está), cada uno sobre muchas cosas, mezcladas; cada respuesta con su oración, una de
relleno y oraciones trampa que nombran las mismas cosas sin contestar ("el canguro se parece a facundo"). Las líneas ya
son "Q:"/"O:". Cuatro tramos sin leer:

| | acierta (116 preguntas no leídas) |
|---|---|
| azar | 23 % |
| buscador de palabras | 27 % |
| el canto | 73 % (79, 66, 69, 79) |
| memoria del kernel, control sin cubo (`memoria=3`) | **106 de 116 (91 %)** |
| **el cubo 7³ oyendo + memoria del kernel** (`memoria=4`), semillas 1001, 1002, 1003 | **106, 107, 107 (92 %)** |

- **Razar entiende los mecanismos**: en preguntas que nunca leyó, sobre cosas nuevas, elige la oración con la forma de
  la respuesta ("sarmiento escribió facundo") y no la trampa con la misma palabra. El buscador de palabras cae en las
  trampas.
- **El oído del cubo no pierde nada** frente al control, y da igual con tres dados distintos.
- El canto también entiende (73 %), pero confunde mecanismos cuando una cosa aparece en varios ("¿qué come la vaca?" →
  "la vaca es un animal").
- Con Asimov el problema eran pocos casos y muy complejos, como dijo el Capitán.
- **Con un cubo de 10³**, oyendo lo mismo que el de 7³ (cada marco una vez, sin practicar): 107, 106 y 105 de 116 con
  las mismas semillas. Igual que el 7³ (106, 107, 107) y que el control (106): el tamaño no cambia nada acá, porque los
  dos ya oyen todo lo que las notas dicen. Los ~10 que faltan son el límite de las notas, no del cubo.- **Y con un 4³**: 106, 106 y 106 de 116, en 5 segundos por semilla (el 7³ y el 10³, unos 32). El cubo más chico ya
  oye todo lo que dicen las notas; para esta tarea alcanza el 4³, seis veces más rápido.- **Más vueltas de escucha con el 4³** (oye todos los marcos aprendiendo, con conserva, antes de recordar): 1, 3, 10 y
  30 vueltas dan 106 a 107 de 116 con dos semillas, con 1 a 6 % de los pesos en el techo. Las vueltas tampoco mueven
  nada: con conserva el cubo no se satura, pero ya oía todo. El techo de ~106 está en las notas.- **Las ~10 que falla, mirada una por una** (`una=`, el control): 9 de 10 son **el mecanismo equivocado sobre la misma
  cosa**. La vaca tiene "qué es", "qué come", "dónde vive" y "cuántas patas", y a "¿qué come la vaca?" contesta "la vaca
  es un animal": una respuesta verdadera, pero de otra pregunta. La décima es una trampa ("el mono y moscú"). Las notas
  describen la oración alrededor de la cosa, pero no dicen nada de la pregunta: las palabras del mecanismo ("come",
  "patas", "vive") no entran. Siguiente: sumar a las notas las palabras de la pregunta que no son el lugar.
**Las notas dicen también qué se pregunta** (Capitán: *"sí, sumalas"*): cada oración lleva además, como notas, las
palabras de su pregunta que no son un lugar ("come", "patas", "vive", "es"). Preguntas simples, 116 sin leer:

| | antes | con las palabras de la pregunta |
|---|---|---|
| control sin cubo | 106 | **116 de 116** |
| cubo 4³ + memoria del kernel, semillas 1001, 1002, 1003 | 106, 106, 107 | **115, 115, 115** |

- Ya no confunde los mecanismos: sabiendo qué se pregunta, el recuerdo más parecido viene de una pregunta del mismo
  tipo. El control acierta todas; el cubo oyendo falla una, con los tres dados.
- En Asimov no cambia: control 22 de 110 (antes 24), cubo 4³ 27 y 18 con dos semillas. Ahí cada pregunta es única y
  sus palabras no se repiten en otras: no hay de quién aprender el tipo de pregunta.
**La alarma del 116 de 116** (el otro chat del Capitán, 2026-11-08: *"un puntaje perfecto casi nunca significa que el
problema se resolvió: significa que la respuesta se filtró al banco"*). Dos pruebas:

1. **El nulo con las mismas palabras**: el buscador contando todas las palabras de la pregunta (no solo las que no son
   de la mitad) acierta **100 % en los cuatro tramos**. El 116 era filtración: pregunta y respuesta salen de la misma
   plantilla y comparten "que", "es", "de", "escribió". (El 106 de antes no las usaba: su vara era el buscador de 27 %.)
2. **Las mismas preguntas con otras palabras** (`libros/preguntas_otras.txt`, `preguntas_simples.py ... otras`): "¿de
   qué se alimenta el conejo?", "¿a qué clase pertenece el gato?", "¿cuántas piernas usa la araña?"; con la respuesta
   solo comparten la cosa.

| otras palabras, 116 sin leer | acierta |
|---|---|
| azar | 23 % |
| buscador contando todas las palabras | **15 %** (24, 28, 7, 3) |
| buscador de palabras | 27 % |
| el canto | 74 % |
| memoria del kernel, control | **105 de 116 (91 %)** |
| cubo 4³ + memoria del kernel, semillas 1001-1003 | 103, 104, 103 |

- **Sin filtración el buscador cae al azar y la memoria se sostiene en 91 %**: de las otras preguntas aprendió que "se
  alimenta" va con una respuesta "X come Y", sin compartir esa palabra. **Eso sí es el mecanismo.**
- **El cubo resta**: 103-104 contra 105 del control, como en todas las mediciones de este libro (115 contra 116, 106
  contra 106-107). El oído del cubo no agrega nada a las notas; en el mejor caso las conserva. Es un dato sobre el cubo:
  hoy lo que razona es la memoria del kernel con sus notas.
**Una relación que nunca vio** (el otro chat: *"entrená con 6 mecanismos y preguntale el séptimo"*):
`libros/preguntas_agrupadas.txt` (otras palabras, 16 por mecanismo, en bloques; `fuera` "k 7" deja uno entero afuera).
Aciertos sobre las 16 del mecanismo nunca visto (el azar, ~20 %):

| afuera | memoria (control) | cubo 4³ | canto | buscador |
|---|---|---|---|---|
| qué es | 14 | 2 | 11 | 10 |
| dónde vive | 8 | 7 | 2 | 4 |
| color | 15 | 9 | 11 | 3 |
| patas | 4 | 7 | 0 | 0 |
| quién escribió | 10 | 2 | 0 | 0 |
| qué come | 5 | 8 | 2 | 0 |
| país | 16 | 16 | 4 | 0 |
| **total** | **72 de 112 (64 %)** | 51 (46 %) | 27 % | 15 % |

- La memoria generaliza a una relación nueva bastante arriba del azar, pero lo general que aprendió es **"esto es una
  respuesta, esto es una trampa"**, no "esto responde a esta relación": acierta todo donde la competencia son trampas
  (país: las ciudades solo están ahí) y falla donde la misma cosa tiene respuestas de otros mecanismos (patas 4, qué come
  5). ⚠️ Parte de "es una trampa" lo regala el banco: los verbos de las trampas ("mira a", "se parece a") nunca están en
  una respuesta. El próximo banco tiene que tener trampas con la forma de una respuesta.
- El cubo resta mucho con relaciones nuevas: 46 % contra 64 %.

**El canto y la memoria no fallan en las mismas** (libro de otras palabras, 116 sin leer): aciertan los dos 81, solo
la memoria 24, solo el canto 5, fallan los dos 6 (las piernas de el gato, la vaca y la abeja; el autor de el
principito; lo que come el perro y la abeja). Si se supiera a cuál creerle en cada pregunta, juntos llegarían a 110 de
116 (95 %): ese es el techo de sumarlos, falta la regla que elija sin mirar la respuesta.
**Trampas con forma de respuesta** (`libros/preguntas_trampas.py`; `preguntas_trampas.txt` mezclado,
`preguntas_trampas_agrupadas.txt` en bloques): las trampas de una cosa ya no tienen verbos propios ("mira a"): son la
misma cosa en otro mecanismo ("el conejo está en chile", "el conejo tiene cuatro patas") o en el otro papel del suyo
("otelo come el conejo", "la metamorfosis escribió la manzana"); van en las respuestas de otras cosas. 112 preguntas
con otras palabras, 288 trampas.

| mezclado, 112 sin leer | acierta |
|---|---|
| azar | ~21 % |
| buscador (y contando todas las palabras) | ~20 % |
| el canto | 26 % |
| memoria del kernel, control | **102 de 112 (91 %)** |
| cubo 4³ + memoria del kernel, semillas 1001-1003 | 101, 102, 102 |

| un mecanismo entero afuera | memoria | cubo 4³ | azar |
|---|---|---|---|
| qué es | 4 de 16 | 1 | ~25 % |
| los otros seis | 0 de 16 cada uno | 0-2 | ~14-27 % |
| **total** | **4 de 112 (4 %)** | 4 de 112 | ~21 % |

- **Con mecanismos conocidos, se sostiene en 91 % aunque las trampas tengan forma de respuesta**: elige la forma del
  mecanismo que se pregunta, no cualquier forma de respuesta.
- **Con un mecanismo nunca visto, cae debajo del azar** (4 %): elige siempre una trampa con la forma de un mecanismo que
  sí conoce. El 64 % del banco anterior era el defecto de las trampas fáciles. **Aprendió siete relaciones, no la idea
  de relación**: con 16 ejemplos de cada una, sin entrenar y a prueba de paráfrasis, pero ninguna transferencia a una
  relación nueva.
**¿Sabe cuándo no sabe?** (el otro chat: *"no puede decir no sé, así que contesta mal con seguridad"*).
`voluntad_semilla.jsm` con `ver=1` (décimo parámetro) dice por pregunta si acertó y cuánto se parece su ganador al
recuerdo más parecido que contestaba (Jaccard, millonésimas). Banco de trampas, control:

| parecido del ganador | conocidas (112) | bien | nuevas (112) | bien |
|---|---|---|---|---|
| 90–100 % | 106 | 98 | 14 | 0 |
| 80–90 % | 4 | 2 | 38 | 0 |
| 70–80 % | 0 | 0 | 28 | 0 |
| 60–70 % | 1 | 1 | 10 | 0 |
| 50–60 % | 1 | 1 | 16 | 4 |
| menos de 50 % | 0 | 0 | 6 | 0 |

- **Las relaciones nuevas se parecen menos a lo que recuerda**: el parecido separa casi limpio lo conocido de lo nuevo.
- Callándose por debajo de 90 %: conocidas, contesta 106 (98 bien, 8 mal) y calla 6; nuevas, contesta 14 (todas mal) y
  calla 98. Los errores seguros en relaciones nuevas bajan de 108 a 14.
- ⚠️ Ese 90 % salió de mirar esta tabla: **es criterio, no medición**. Para que valga, Razar tiene que sacarlo de lo que
  leyó (probarse con sus propias preguntas leídas, de a una afuera) antes de ver ninguna nueva.
**El corte se despeja del precio** (el otro chat: *"dejar cada una afuera te da la distribución, no el umbral; el umbral
sale sólo si decís qué estás dispuesto a pagar"*). `precio` (undécimo parámetro, P + 1): antes de preguntar lo no leído,
Razar se pregunta a sí mismo cada pregunta leída con sus marcos afuera, arma la curva (por corte, cuántas conocidas
que acierta dejaría de contestar y cuántos errores suyos se sacaría) y toma el corte que pierde P de las que acierta.
Nada de lo no leído entra en el corte. Banco de trampas, control:

| precio (P conocidas que acepta perder) | conocidas: contesta (bien / mal), calla | nuevas: contesta (mal), calla |
|---|---|---|
| 0 | 111 (101 / 10), 1 | 93 (89), 19 |
| 1 | 108 (98 / 10), 4 | 61 (61), 51 |
| **2 o más** (el corte cae en "idéntico") | **106 (98 / 8), 6** | **0, 112** |

- Lo leído dice que casi todo lo que acierta tiene un recuerdo **idéntico** (parecido 1,0); unas pocas conocidas raras
  quedan en 0,54-0,83. Pagándolas (precio 2), el corte cae en 1,0 en los once tramos, y **deja de errar con seguridad
  en todas las relaciones nuevas**: calla las 112 (pierde las 4 que acertaba de casualidad). En las conocidas calla 6 (4
  de ellas las acertaba) y los errores bajan de 10 a 8.
- ⚠️ El límite: "contestar solo si tiene un recuerdo idéntico" anda en este banco porque sus respuestas salen de
  plantillas y dan notas idénticas. En un libro real como Asimov ninguna nota es idéntica y callaría casi todo: ahí el
  precio va a despejar otro corte, y la curva lo dirá.


### Las puertas del NT (pulso.jsm, 2026-11-08)

pulso.jsm sobre el NT entero (2,5 s), con 1 de cada 10 pulsos aparte y un ciego que aprende sin mirar:

| piso | explica de lo aparte | el ciego |
|---|---|---|
| gemelos | 85,2 % | 22 % |
| interruptores | 62,6 % | 40,9 % |
| asociados | 14,9 % | 3,5 % |
| puertas (64 piezas) | 63 de 10.222 (0,6 %) | 0 de 10.221 |

- Las puertas que pagan en bits son variantes de superficie (`: «` / `: "`, "del señor" / "de dios", "le dijo" /
  "les dijo"). "hijo de" / "padre de" **no pagan**: cada relación aparece pocas veces y con formas distintas.

### Relaciones en miniatura (2026-11-08)

El Capitán: *"era bueno resolviendo acertijos: hay que darle ejemplos de las relaciones, no la relación una vez"*, y
*"a escala micro primero: un puñado, y todos los casos"*. `libros/relaciones_micro.py` (texto, sin medir): una familia
de once en cuatro generaciones y **todo** parentesco de cada uno que lo tiene (47 preguntas: padre 9, hijo 5, abuelo 7,
nieto 3, hermano 8, tío 7, sobrino 4, primo 4). Las preguntas componen dos actos ("¿quién engendró al que engendró a
luis?" es el abuelo) y comparten con su respuesta sólo la persona; cada hecho se dice de los dos lados ("pedro es el
padre de luis", "luis es el hijo de pedro"), así las otras oraciones de la persona son trampas con roles cambiados.

Cuatro tramos sin leer:

| | memoria (control) | cubo 4³ | buscador | azar |
|---|---|---|---|---|
| notas como están | 10 de 47 | 10 de 47 | 0-36 % | ~10 % |
| cada palabra con su identidad (diagnóstico) | **41 de 47** | **45 de 47** | | |

- **La causa del 10 de 47 era el instrumento**: `mf_token` anota toda palabra que no es de "la mitad" (las más dichas
  del libro) como el mismo token 1. En un libro chico "padre", "tío" y "abuelo" no llegan a la mitad: las notas no
  distinguían una relación de otra, sólo dónde estaba la persona.
- Con identidad (copia de diagnóstico, `HEADC` = 1 sólo en `mf_token`; **no está en el repo**) acierta 87 % la memoria
  y 96 % el cubo: aquí el cubo sí aporta sobre las notas.
- ⚠️ Falta: la regla general de qué palabra conserva su identidad (la mitad era para no memorizar contenido), el nulo
  con identidad en los bancos anteriores (¿filtra?), y una relación nunca vista.

**El nulo y los bancos anteriores, con identidad** (la misma copia de diagnóstico):

| libro | sin identidad: memoria / cubo 4³ | con identidad: memoria / cubo 4³ |
|---|---|---|
| relaciones micro, **nulo** (`nulo`: la relación de cada respuesta sorteada) | 10 / 10 de 47 | **10 / 11 de 47** |
| relaciones micro | 10 / 10 de 47 | 41 / 45 de 47 |
| preguntas con otras palabras (trampas de verbo) | 105 / 103-104 de 116 | 116 / 109 de 116 |
| trampas con forma de respuesta, mezcladas | 102 / 101-102 de 112 | 100 / 102 de 112 |
| trampas, una relación nunca vista | 4 de 112 (memoria) | 4 / 14 de 112 |

- **No filtra**: cuando la respuesta no dice qué relación tiene, con identidad vuelve a 10-11 de 47 (lo que da saber
  sólo dónde está la persona). El 41-45 sale de la relación.
- En "otras palabras" llega a 116: sus trampas se distinguen por el verbo ("mira a"), y con identidad el verbo se ve.
  En las trampas con forma de respuesta no cambia (100-102 de 112).
- Una relación nunca vista sigue sin salir (4 y 14 de 112, el azar ~21 %): la identidad deja aprender relaciones
  vistas, no inventar una nueva.

**La regla, en el repo** (`ms_seedwords`, prueba `notas_prueba.sh`): una palabra conserva su identidad en las notas
cuando la dicen las respuestas (la oración semilla) de **dos semillas leídas**; dicha por una, es de ese caso y no de un
mecanismo, y sigue siendo "una palabra de la que no pregunta" (salvo que sea de la mitad). Es el mismo "lo dicen dos"
del canto. Sólo cuentan las semillas leídas: lo aparte no entra.

| libro | antes: memoria / cubo 4³ | con la regla: memoria / cubo 4³ |
|---|---|---|
| relaciones micro | 10 / 10 de 47 | **40 / 44 de 47** |
| relaciones micro, nulo | 10 / 10 de 47 | 10 / 11 de 47 |
| otras palabras | 105 / 103-104 de 116 | 116 / 114 de 116 |
| trampas con forma de respuesta | 102 / 101-102 de 112 | 100 / 103 de 112 |
| trampas, relación nunca vista | 4 / — de 112 | 4 / 13 de 112 |
| Asimov (semillas 1001-1003) | 22 / 27, 18, 16 de 110 | 22 / 13, 22, 17 de 110 |

- Da lo mismo que el diagnóstico de identidad total (41/45) sin darle identidad a lo que dice una sola respuesta.
- Asimov no cambia más allá del ruido de semilla (cubo media 20,3 antes, 17,3 ahora; rangos que se pisan): sus
  respuestas casi no repiten palabras entre semillas.
- `semilla_prueba.sh` fallaba desde que el renglón `P:` dice si acertó (`canto: 1 ...`); ahora lo espera.

### El encadenado: pasos y paréntesis (encadena.jsm, 2026-11-08)

El Capitán: *"no necesitamos abuelo, sólo un mecanismo: si a es padre de b y b es padre de c, entonces a es abuelo de
c"*, y su calculadora (`profundidad()`: lo más hondo se resuelve primero). `encadena.jsm` (prueba
`encadena_prueba.sh`), libro `libros/relaciones_cadena.py` (la familia, dicha sólo como "X es el padre de Y"; 14
preguntas de un paso leídas, 62 compuestas sin ninguna oración que las conteste, sólo su verdad en "R:" para el juez):

- **Los pasos los saca Razar:** una pregunta leída es un caso de su clase (sus palabras con la entidad como lugar; la
  entidad es la palabra de la pregunta que dicen más oraciones de su respuesta). Una clase es paso si la dicen dos casos
  y, en sus respuestas, además del lugar de la entidad cambia **un solo** lugar: ahí está la respuesta. Los dos
  casilleros dicen para qué lado va. Salen dos: "quien engendro a _" (respuesta en la palabra 1 de 6) y "a quien
  engendro _" (en la 6 de 6), del mismo "X es el padre de Y" leído al revés.
- **El paréntesis lo descubre:** entre la cabeza de paso más larga con que empieza una compuesta y el final de cabeza
  más largo con que termina queda un candidato. Gana el que **arma más compuestas**, no el más dicho: en el nulo las
  de tres pasos dejan "aquel que engendro a aquel que" más veces que "aquel que", y por mayoría ganaba el equivocado
  (la misma regla que las piezas de pulso: vale lo que paga). Sale "aquel que" (arma 62 de 62).
- **Contesta encadenando**, de derecha a izquierda: la entidad, el final de un paso, el paréntesis, …, la cabeza
  entera de un paso; los pasos se corren sobre las oraciones del libro, las respuestas de uno son las entidades del
  siguiente.

| libro | compuestas | se arman | aciertan | con verdad vacía: dice algo |
|---|---|---|---|---|
| la familia | 62 | 62 | **62** | — |
| nulo, enganche roto (cada padre dicho con otro nombre: "pedroz") | 168 | 168 | 168 | **0 de 140** |

- **Doce relaciones que nadie escribió** (4 de dos pasos, 8 de tres: abuelo, nieto, hermano, padre de los hijos,
  bisabuelo, tío, primo…), de **dos** pasos leídos. Ninguna tiene nombre en el libro: el nombre es un cartel que se
  pega al camino después.
- En el nulo, donde el enganche está roto calla en las 140; las 28 que sí enganchan (subir y bajar por el mismo
  nombre) las acierta. No empareja superficie: junta pasos.
- ⚠️ Límites: el paréntesis tiene que repetirse tal cual (no sabe que "al" es "a el": por eso el libro dice "a aquel
  que"); sólo compone pasos con la entidad al final de la pregunta; el libro es de juguete y sus oraciones son de una
  sola plantilla. El salto es llevarlo a pasos de verdad de un libro.

**Sobre el NT, tal cual** (los "Q:"/"O:" de sentido): 0 pasos de 695 clases. Sus "preguntas" son edificios de diálogo
("_ les dijo", "jesús _ respondió", 16 casos el que más) cuya entidad es una palabra cualquiera, y sus respuestas no
tienen un solo lugar que cambie. La genealogía sí es un encadenado (*"abraham fue padre de isaac; isaac, padre de
jacob; jacob, padre de judá y de sus hermanos"*), pero nadie pregunta por ella, y dice varios pasos por oración con
el verbo callado desde el segundo. El instrumento contaba como acierto callar donde no había verdad ("aciertan 1103"):
ahora sin "R:" no se juzga.

### Hilos: relaciones del texto crudo, sin preguntas (hilos.jsm, 2026-11-08)

El Capitán: *"no tenemos que masticarle la comida para que coma: tiene que aprender a comer él mismo y destilar sus
propios mecanismos, que emerja el razonamiento"*. Nadie le pregunta nada ni le corta el texto. `hilos.jsm` (prueba
`hilos_prueba.sh`) lee los edificios del libro y:

- **la mitad** (las palabras más dichas que hacen la mitad de lo que dice el libro) son la gramática; el resto puede
  ocupar un lugar;
- **una relación** es una forma "_ <una a tres palabras> _" con dos palabras fuera de la mitad en sus lugares, dicha
  por dos pares;
- **dos relaciones se relacionan** si sostienen el mismo par, del mismo lado o al revés. **Nulo:** los pares de cada
  relación cruzados entre sí (cada uno con la segunda palabra del anterior): conservan qué palabras usa, no cuál va
  con cuál. Vale si la dicen dos pares y supera su nulo.

Sobre el NT entero (167.035 palabras, 0,4 s): la mitad son las dichas 344 veces o más; 6.439 de 38.574 formas las
dicen dos pares; **444 relaciones de relaciones**, 145 con nulo 0.

- **Lo primero que emerge es gramática**, sin que nadie la nombre: "el ~ un", "la ~ una", "su ~ mi", "los ~ sus",
  "de ~ del", "y ~ o", "y ~ ni" (13-28 pares, nulos 0-2,5). Son las clases de los determinantes y los conectores.
- **Y el parentesco al revés:** "hijo de ~ padre de | al revés | 3 pares | nulo 0" (Lucas 3 contra Mateo 1, dos
  traducciones de la misma cadena), y "hijo de ~ fue padre de | al revés | 2 | nulo 0". El verbo callado de Mateo
  ("isaac, padre de jacob") y el dicho ("abraham fue padre de isaac") nunca sostienen el mismo par, pero los dos son
  el revés de "hijo de": son la misma relación un piso más arriba.
- Las de "hijo de ~ sela hijo de" (nulo 1) son la cadena de Lucas vista con un nombre adentro: dos pasos seguidos.
- ⚠️ Falta: unir relaciones por sus relaciones (el mismo mecanismo, un piso arriba), encadenar con ellas y verificar
  los caminos contra lo que el libro dice de una vez ("jesucristo, hijo de david, hijo de abraham").

**El while encadenado** (Capitán: *"que sea un while encadenado: mi idea, todo en while, aplicada en mecanismo"*).
`hilos.jsm` es ahora un `jwhile` sobre las uniones de la vuelta: en cada vuelta una relación se une con la que más se
relaciona (dos veces lo leído menos lo cruzado), si esa también la elige; lo unido es una sola relación desde ahí (sus
pares juntos, dados vuelta si se relacionan al revés) y se mide todo de nuevo. Sin número de vueltas: para solo cuando
nada nuevo le gana a su nulo. Prueba: vuelta 1 une "padre de ~ hijo de", vuelta 2 "fue padre de" (que no comparte nada
con "padre de", sí con lo que trajo "hijo de"), vuelta 3 para.

Sobre el NT (51 s): **652 vueltas, 742 uniones, 13 relaciones de dos formas o más.**

- **La primera vuelta es lo mejor que salió hasta ahora** (46 uniones): "será ~ es", "fue ~ había sido", "estaba ~
  estaban", "puede ~ pueden", "tres ~ diez", "doce ~ siete", "ese ~ aquel", "algún ~ ningún", "del señor ~ de dios",
  "piedad de ~ compasión de", "hijo de ~ padre de (al revés)". En las siguientes crecen clases enteras: personas que
  hacen lo mismo ("la multitud ~ pedro ~ maría ~ apolo ~ el pueblo"), los tiempos de "haber" ("había ~ ha ~ han ~
  has ~ hubiera"), los determinantes ("su ~ la ~ una ~ mi ~ el ~ tu").
- **Y un agujero negro:** desde la vuelta 13 la relación "de" se traga una forma por vuelta hasta juntar **727**
  (649 uniones, casi todas con 2 pares contra un nulo de 0 a 1,5). La causa: "dos contra uno" es evidencia floja, y
  la relación más grande se compara con cientos por vuelta: alguna pasa por azar, crece, y la próxima le es más fácil
  (el rico se hace más rico). No es la regla de unir: es la vara del nulo, que no cuenta cuántas veces se probó.
- ⚠️ La vara tiene que salir del propio nulo, no de un número: correr el mismo while sobre un libro con **todos** los
  pares cruzados; lo que ahí une es error puro, y la evidencia que hace falta es la que en ese mundo no une nada.

**El cubo de 7³ con 16 relaciones** (Capitán: *"que el 7³ aprenda de a 16 relaciones, como aprendía el idioma de 16
cosas"*; los 16 eran eso: la corrida larga del 2026-11-03, 7³ con 16 cosas al 100 %, 250 de 250 cada una).
`voluntad_hilos.jsm` (prueba `voluntad_hilos_prueba.sh`) es la voluntad de siempre (sin `cosas`, la misma huella que
`voluntad.jsm`) que, con `cosas` en la casa, dice cada cosa con las tres piezas dadas y no las mueve nunca, y cuenta en
el último cuarto qué adivinó para cada una (`C: cosa bien todas otra veces`): dos cosas con las mismas piezas, el cubo
no las separa (prueba: la 1 dicha como la 0 sale 0 las 62 veces). `hilos.jsm` con `tanda` ("16 7") elige las 16 formas
de las relaciones de relaciones más fuertes y dice cada una con las tres piezas de la cara de abajo donde más caen sus
pares (y el nulo, con sus pares cruzados).

| tanda del NT (7³, 16 cosas, 4.000 vueltas) | último cuarto | confusiones |
|---|---|---|
| piezas de sus pares | 100 % | ninguna |
| nulo: piezas de sus pares cruzados | 100 % | ninguna |

- **El cubo no ve las relaciones**, y no es culpa del cubo: las 16 formas (su, la, de, en, y, el, un, una…) tienen
  miles de pares cada una, y "su ~ la" comparte 28. Tres piezas de 49 sacadas de miles de pares son ruido: ninguna
  forma comparte piezas con otra (su: 2 31 34; la: 18 10 23), el real y el nulo dan lo mismo, y el cubo separa las 16.
- Lo que el cubo puede decir depende de lo que le entra: **tres piezas no cargan un conjunto de pares**. Para que vea
  una relación tiene que oírla entera (sus pares cantados como melodía, como la memoria del kernel con el cubo que
  canta las notas), no un resumen de tres.
- ⚠️ En el camino: el pedido 4 crea el archivo si no está; una `cosas` vacía se tomaba por dada. Ahora sólo vale si
  se leen las k×4 enteras.

**Que la oiga entera** (Capitán: *"que la oiga"*). `voluntad_hilos.jsm` con `cantos`: cada cosa es una canción (dos
bytes cuántas notas, tres bytes cada nota), una vuelta la canta entera, nota por nota, junta lo que el cubo contestó a
toda la canción (qué pieza de arriba despertó en qué paso, cuántas veces) y adivina como con una señal. `hilos.jsm`
con `tanda` canta cada par como una nota (`P:`; `Q:` los cruzados) y sólo toma relaciones cuyas formas entran en una
canción (255 notas, lo que junta una melodía). La tanda del NT: "y el", "y del", "y la", "y de la", "y a los", "y de
los", "y los", "y al", "y sus", "y mis", **"hijo de" (96 notas) y "padre de" (40)**, "y me", "y no me", "lo que",
"todo lo que" (9 a 169 notas). 7³, 16 cosas, 800 vueltas (9 s cada una):

| | aciertos al final | confusiones del último cuarto |
|---|---|---|
| canciones de sus pares | 80-82 % | y el→y sus, y los→y mis, lo que→y mis (todas, 12-13 de 12-13) |
| nulo: de sus pares cruzados | 74-76 % | y el→y no me, y la→y no me, y los→y mis, lo que→y no me |

- **"hijo de" y "padre de" no se confunden**: comparten 3 pares de 96 y 40; el cubo separa las dos (13 de 13).
- **Las confusiones son del largo, no de la relación**: las canciones largas (112, 160, 169, 130 notas) se toman por
  las más cortas (9 y 10 notas), en el real y en el nulo por igual. Es la cuenta de adivinar (lo oído contra todo lo
  que aprendió de cada cosa), que favorece a las cosas de poco.
- **Lo que enseña:** el juego de señales está hecho para **separar** las 16 cosas: nunca va a decir que dos son una
  mientras lo que entra no sea casi lo mismo. Para que el cubo una relaciones, la pregunta tiene que ser otra: que
  aprenda 16 y después oiga una que **no** aprendió, y ver a cuál de las 16 la lleva (contra el nulo).

**Una relación que el cubo no aprendió** (Capitán: *"sí, una nueva"*). `voluntad_hilos` con canciones de más después
de las k: no se aprenden, se oyen una vez al final, y `U: canción cosa` dice a cuál de las aprendidas la llevó (prueba:
una canción hecha con 3 de las 5 notas de la 5 va a la 5). `hilos` con `tanda` agrega las nuevas: formas no elegidas
que se relacionan con una elegida (`U: j r`, r la pariente), cantadas con sus pares (`V:`) o cruzados (`W:`); las 16
aprendidas son las mismas en los dos. NT, 7³, 800 vueltas:

| canciones nuevas (16) | las lleva a su pariente |
|---|---|
| con sus pares | 4 de 16 |
| nulo: con sus pares cruzados | 5 de 16 |

- **Igual que el nulo.** Las nuevas comparten 2 pares con su pariente (lo mínimo que pide hilos); el cubo las lleva
  casi siempre a las mismas cuatro ("y sus", "y mis", "hijo de", "y al"), en el real y en el cruzado. "fue padre de"
  va a "y al" (real) y a "hijo de" (nulo). Las de la cadena de Lucas ("sela hijo de", "hijo de cainán") van a "hijo de"
  en los dos: comparten los nombres, no los pares.
- **Lo que deja esta línea:** con lo que el NT tiene (relaciones que comparten 2 o 3 pares entre decenas), el cubo no
  ve más que la cuenta de hilos, y ve menos: la cuenta contra el nulo los encuentra (nulo 0), el cubo no. Los 16 del
  7³ eran 16 cosas distintas que separar; acá lo que hace falta es juntar lo poco que dos relaciones comparten.

**Gorro y apellido** (Capitán: *"no miramos el gorro, miramos el apellido: dos distinciones, color de gorro y apellido,
y podemos diferenciar incluso entre hermanos"*). `hilos` con `tanda` dice de cada forma su **gorro** (una nota por
palabra de la forma: lo que sólo ella tiene, `G:`/`H:`) y su **apellido** (una nota por palabra que dicen dos de sus
pares o más, las más dichas si no entran en la canción: lo que comparten los parientes, `A:`/`B:`). "hijo de" y
"padre de" comparten 3 pares, pero los nombres de la misma familia: el apellido de "hijo de" tiene 69 nombres, el de
"padre de" 26; el de "fue padre de" 4, y 2 son de "hijo de".

- **La cuenta de apellidos, sin cubo:** de las 16 nuevas, en **13** la que más notas de apellido comparte es su
  pariente. La idea del apellido tiene la señal.
- **El instrumento mentía:** la voluntad adivinaba por la parte de todo lo que oyó de cada cosa; con canciones de
  largos distintos eso toma las largas por las cortas (las 16 aprendidas, 68 %). Ahora compara por forma y no por
  cantidad (lo oído por lo aprendido sobre el tamaño de lo aprendido: el coseno): las aprendidas llegan al **100 %**.
  Con canciones idénticas el cubo a veces las separa por cuándo las oyó (la escuela cambia); la prueba lo dice así.
- **El cubo, con gorro y apellido** (7³, 800 vueltas): lleva la nueva a su pariente **5 de 16**; con el apellido
  prestado de la nueva siguiente, **4 de 16** (y el prestado no es nulo limpio: las cinco de Lucas se prestan apellido
  entre parientes). Las que acierta son las de apellido grande ("y de", "ni", "y en el") y dos de Lucas.
- **Por qué el cubo no llega a la cuenta:** el gorro son notas que nadie más tiene, el apellido de las nuevas tiene de
  1 a 4 notas contra gorros de 1 a 3, y una nota compartida entre decenas no mueve la forma de toda la canción. La
  cuenta mira sólo lo compartido; el cubo oye todo.

**El apellido, medido en serio** (las críticas del otro chat, el 2026-11-08: *"sacá los nombres más repetidos y
volvé a medir; si se cae, era pertenencia al libro"*, *"que oiga sólo el apellido"*, *"el apellido prestado de otra
familia, del mismo tamaño"*, y *"¿qué otros bancos usaban esa misma comparación?"*).

- **Los bancos de ayer no tenían la regla rota:** `voluntad_semilla` recuerda por Jaccard (las notas que comparten
  sobre las notas de las dos), que ya divide por el tamaño de las dos. La comparación por cantidad sólo existió en el
  modo canciones de `voluntad_hilos`, escrito hoy. El 13/22/17 de Asimov y el 100-103 de las trampas siguen en pie.
- **El 13 de 16 lo había contado Doc en Python:** ahora lo cuenta `hilos` (`F: j r nombres compartidos ...`): 13 de
  16 por nombres, **12 de 16** pesando cada nombre por lo raro que es (un millón sobre cuántos apellidos de la tanda lo
  dicen). Sacarles peso a los nombres de todos no lo cae.
- **Pero era circular:** el pariente de cada nueva lo eligió hilos porque comparten pares, y compartir pares es
  compartir sus nombres. El apellido de una nueva ahora deja afuera los pares que tiene también una elegida (lo que
  las hizo parientes):

| apellido de las nuevas | cuenta por nombres | por nombres raros | el cubo, sólo apellido | el cubo, apellido de otra familia del mismo tamaño |
|---|---|---|---|---|
| con los pares compartidos | 13 de 16 | 12 de 16 | — | — |
| **sin los pares compartidos** | **6 de 16** | 5 de 16 | **4 de 16** | **0 de 16** |

- Las siete de la cadena de Lucas **se quedan sin apellido**: todos sus nombres repetidos eran los de los pares que
  comparten con "hijo de". "fue padre de" conserva uno, y apunta a "hijo de".
- De las 9 con apellido propio, la cuenta acierta 6 y el cubo 4; con apellido prestado de otra familia, 0. **Hay
  señal, y es chica**: cuatro de esas nueve tienen de pariente a "y la", cuyo apellido es grande (apostar siempre por
  ella da 4 de 9).
- El cubo con el apellido solo no destruye la entrada: llega cerca de la cuenta (4 contra 6) y su nulo da 0. Lo que lo
  ahogaba antes era el gorro.
- **Sobre las 9 que tienen apellido** (las 7 de Lucas no tienen entrada: no son errores de comparar, les falta qué
  compartir; otro problema): cuenta **6 de 9**, cubo sólo apellido **4 de 9**, nulo de otra familia **0 de 9**,
  apostar siempre por "y la" 4 de 9. Sacarle el gorro bajó el puntaje (5 → 4) y subió la señal (de 5 contra 4 a 4
  contra 0): la señal se mide por la distancia al nulo, no por la altura.
- **La regla que deja esto** (el otro chat): *la etiqueta y la medida no pueden tomar agua del mismo pozo*. Tercera
  vez que aparece: el verbo de la pregunta en la respuesta (el 116/116), las vueltas que salían del presupuesto, el
  pariente que define el apellido. Si lo que se predice se eligió con lo que se mide, el número sale lindo y hueco.
- ⚠️ Falta: un apellido para las 7 de Lucas que no sean nombres de personas (la forma que las rodea en la cadena), y
  ver si el 4 contra 0 se sostiene cuando las 9 crezcan.
- **Más vueltas no lo mueven:** 800, 3.200 y 12.800 vueltas dan lo mismo (aprendidas 100 %; nuevas con apellido 4 de
  9, nulo 0 de 9). Las vueltas afinan lo aprendido, no agregan nada de las nuevas: lo que falta es entrada (más
  apellido compartido), no práctica.

**Marcos solo** (Capitán: *"dale de comer un solo evangelio, el de San Marcos, y aplicá lo aprendido"*). Los edificios
de Marcos (1.093, 12.944 palabras; el texto queda fuera del repo), `hilos` con su while: la mitad son las dichas 31
veces o más; **543 de 3.828 formas las dicen dos pares**; el while para en la vuelta 3 con **4 uniones**, todas de
gramática y con 2 pares ("a su ~ a tu", "los ~ y los ~ y a los", "de ~ a"). Ningún agujero negro.

- **Un evangelio solo casi no se repite**: lo que en el NT entero eran 6.439 formas dichas por dos acá son 543, y lo
  que se une son las clases más chicas. "lo dicen dos" necesita que el libro diga dos veces.
- Sin agujero negro, como se esperaba del diagnóstico: con pocas relaciones cada una se compara con pocas, y el azar
  no alcanza a pasar.
- Lo que Marcos sí trae es que **Mateo y Lucas cuentan lo mismo con otras palabras** (los sinópticos): es el "dos"
  que le falta, de otro libro.

**Los tres sinópticos juntos** (Capitán: *"sí, los tres"*): Mateo, Marcos y Lucas (4.600 edificios, 56.295 palabras),
`hilos` con su while, contra cada uno solo:

| | formas dichas por dos | uniones | la relación más grande |
|---|---|---|---|
| Mateo solo | 815 | 15 | 6 formas |
| Marcos solo | 543 | 4 | 3 formas |
| Lucas solo | 847 | 32 | 29 formas |
| **los tres juntos** | **2.254** | 160 (31 en la vuelta 1) | "de", 146 formas |

- **22 de las 31 uniones de la primera vuelta sólo salen con los tres juntos**: "hijo de ~ padre de (al revés)" (la
  genealogía de Mateo contra la de Lucas), **"cinco mil ~ cuatro mil"** (las dos multiplicaciones de los panes),
  "piedad de ~ compasión de", "produce ~ que dé", "cuando ~ cuándo", "doce ~ siete", "el ~ un", "su ~ la"… El "dos"
  que a cada evangelio le falta lo pone otro que cuenta la misma escena.
- ⚠️ Con más libro vuelve el agujero negro ("de" junta 146 formas en 103 vueltas): sigue faltando la vara sacada de un
  mundo todo cruzado. Y la mitad cambia con el tamaño (54, 31, 61, 144 veces), así que "sólo juntos" mezcla dos cosas:
  la repetición entre evangelios y que el libro es más grande.

**La vara del mundo todo cruzado** (Capitán: *"sí, la vara"*). `hilos` cuenta ahora también lo que dos relaciones
comparten con **las dos** cruzadas: lo que el azar solo les da. La vara de cada relación es lo más que comparte con
cualquier otra en ese mundo; una unión vale si lo leído supera la vara de las dos (y lo de antes: dos pares, más que
su nulo, elección mutua). Sin número elegido: la relación que se compara con cientos tiene, sola, una vara alta.

| libro | antes: vueltas, uniones, la más grande | con la vara |
|---|---|---|
| NT entero | 652, 742, "de" 727 formas | **37, 134, "de" 86** |
| sinópticos | 103, 160, "de" 146 | **21, 76, "de" 51** |
| Marcos | 3, 4 | 3, 4 |

- **La primera vuelta no pierde nada bueno:** siguen "hijo de ~ padre de", "cinco mil ~ cuatro mil", "piedad de ~
  compasión de", "fue ~ había sido", "algún ~ ningún", "la multitud ~ pedro"; y en la segunda entra "hijo de ~ fue
  padre de".
- **"de" ya no traga por azar:** sus 35 uniones del NT tienen de 9 a 50 pares (antes 2); se junta con "en", "a", "por",
  "con", "para", "de los", "este": es la clase de las preposiciones y compañía, gramática de verdad.
- ⚠️ Falta una prueba chica que la vara frene una unión por azar (la de la familia no la toca: su mundo cruzado no
  comparte nada).

### Razonar, no barajar (2026-11-08)

El Capitán: *"no quiero estadística, quiero razonamiento"*; *"quiero sintetizar el pensamiento sin estadística"*. El
while de `hilos` ya no baraja nada (sin nulo, sin vara, sin mundo cruzado): una unión es una **hipótesis** ("hijo
de" es "padre de" al revés); lo que el libro dice como ella deduce la **confirma**, lo que dice al revés la
**contradice**. Dos confirmaciones y ninguna contradicción, la elección mutua de siempre. Sólo se unen relaciones que
**afirman algo**: la que dice un par de los dos lados no se compromete y nada la puede refutar (pegamento). Prueba:
une "padre de ~ hijo de" (3) y "fue padre de" (2); "cuida a", con un par al revés, queda refutada; "ve a", que dice
los dos lados, nunca se une.

| | uniones | vueltas | la más grande | uniones buenas (de 7) |
|---|---|---|---|---|
| Marcos | 2 | 2 | 2 formas | — |
| sinópticos | 138 | 56 | "hijo de", 103 formas | 4 (las otras tres no están en ellos) |
| NT | 455 | 226 | "y la", 261 formas | **7** |

- **La primera vuelta es la más limpia de todas:** "hijo de ~ padre de", "cinco mil ~ cuatro mil", "piedad de ~
  compasión de", "fue ~ había sido", "algún ~ ningún", "la multitud ~ pedro", "han ~ ha", "estaba ~ estaban",
  "puede ~ pueden", "doce ~ siete", "cuarenta ~ tres", "su ~ mi", "las ~ sus"… sin barajar nada.
- **Y después se desborda:** "hijo de" suma "a", "en", "por", "y la" (2 a 5 confirmaciones), y "y la" junta 261
  formas. Una forma de gramática casi nunca dice un par al revés: nada la contradice.
- ⚠️ Lo que falta es lo que la refuta: **las propiedades** que la relación muestra en el libro. En "hijo de" cada hijo
  tiene un solo padre; sumarle "en" le daría dos padres a isaac. Esa es la contradicción que todavía no mira.

**Las propiedades refutan** (lo que faltaba): lo que una relación dice de una palabra está **confirmado** cuando lo
dicen dos. Una relación es "un solo B por cada A" cuando dos palabras tienen un B confirmado y ninguna tiene dos B
confirmados: un contraejemplo sólo rompe si está confirmado también (en "rosa fue padre de sol", la forma "padre de"
toma "fue" por padre: un par suelto del texto crudo no tumba nada). Unir dos relaciones de modo que una palabra cuyo
valor está confirmado en una, que es así, reciba otro de la otra es una **contradicción**. Prueba: "junto a" dice dos
pares como "padre de" y ninguno al revés, pero le da a mar un segundo padre: refutada.

| | sin propiedades | con propiedades |
|---|---|---|
| sinópticos: uniones, la clase de "hijo de" | 138, 103 formas | **87, 21 formas** |
| NT: uniones, la más grande ("y la") | 455, 261 formas | **366, 151 formas** |
| uniones buenas del NT (7) | 7 | 7 |

- En los sinópticos la clase de "hijo de" quedó casi limpia: "padre de", "fue padre de" y las ventanas de la cadena de
  Lucas ("sela hijo de", "hijo de cainán": la misma relación con un nombre adentro).
- ⚠️ Todavía entran formas de gramática ("a", "o qué", "se", "y se") con 2 a 5 confirmaciones: dicen miles de pares,
  coinciden en pocos, y ninguno choca con un valor confirmado porque hablan de gente de la que la otra no confirmó
  nada. Una hipótesis así no está refutada, pero tampoco explica lo que afirma.

**Una hipótesis tiene que explicar lo que dice de la misma gente** (la regla que faltaba, razonamiento puro). De lo que
una relación dice de dos palabras que la otra conoce (su A del lado de los A de la otra, su B del de los B), lo que la
otra dice también está **explicado**, lo que no, **sin explicar**. Cada una tiene que explicar más de la gente de la
otra que lo que deja sin explicar; si no, la hipótesis queda **refutada para siempre** y cada relación busca otra
pareja. Prueba: "habla con" confirma dos pares de la familia y dice dos más de la misma gente que la familia no
sostiene ("ana habla con sol", "eva habla con cielo"), y nada de lo que dice choca: refutada igual.

| | antes (propiedades) | explicando a la misma gente |
|---|---|---|
| NT: uniones, vueltas, la más grande | 366, 127, "y la" 151 formas | **121, 20, "hijo de" 16** |
| sinópticos | 87, 20, "hijo de" 21 | **60, 6, "hijo de" 7** |
| Marcos | 2 | 1 |

- **Sin una gota de estadística, el agujero negro se fue**: la relación más grande del NT es la genealogía y nada más
  ("hijo de", "padre de", las ventanas de la cadena de Lucas). Las formas de gramática no explicaban lo que decían de
  esa gente.
- Quedan "hijo de ~ padre de", "cinco mil ~ cuatro mil", "piedad de ~ compasión de", "fue ~ había sido", "algún ~
  ningún", "la multitud ~ pedro".
- ⚠️ **Se perdió "hijo de ~ fue padre de"**: lo refuta esta regla. La sospecha (sin verificar) es que es justo: después
  de David, Mateo baja por Salomón y Lucas por Natán, y el "fue padre de" de Mateo dice de esa gente cosas que la
  cadena de Lucas no sostiene. Falta mirar qué pares quedaron sin explicar.
- ⚠️ En los sinópticos todavía entra "hijo de ~ a" (3 confirmaciones).
- **Verificado qué refutó "hijo de ~ fue padre de"** (copia con instrumento, no en el repo): de lo que el "fue padre
  de" de Mateo dice de la gente de la cadena de Lucas, explica 2 (abraham→isaac, judá→fares) y deja sin explicar 4:
  **david→salomón** (en Lucas el hijo de David es Natán), **jacob→josé** (en Lucas José es hijo de Elí), booz→obed
  (Lucas escribe "jobed") y fares→aram (Lucas pone a esrom en el medio y escribe "arní"). Razar refutó que las dos
  genealogías sean una justo donde Mateo y Lucas no coinciden: dos diferencias de fondo, las de siempre, y dos de
  escritura que no sabe que son la misma persona.

**Dos nombres para un mismo lugar** (Capitán: *"si fuera un error de verdad, la palabra no figuraría dos veces escrita
exactamente igual"*: "jobed", dicho dos veces igual, es cómo Lucas nombra a quien Mateo llama "obed"; no lo toca la
ortografía, que sólo corrige lo dicho una vez). Lo que una hipótesis deja sin explicar puede ser un lugar con dos
nombres: si la otra relación nombra ese lugar con otro nombre que tiene **el mismo compañero de los dos lados**, uno en
cada relato (el mismo padre y el mismo hijo: dos lugares, lo dicen dos), queda explicado y lo dice. Prueba
(`hilos_nombres_prueba.sh`): una familia contada dos veces con "caro" y "karo" → "mismo lugar: karo = caro" y las dos
se unen.

- **Sobre los sinópticos y el NT, solo:** `mismo lugar: obed = jobed` (booz su padre y jesé su hijo, en Mateo y en
  Lucas). Ningún otro par de nombres.
- **La unión de las dos genealogías sigue sin pasar, y está bien:** explica abraham→isaac, judá→fares y ahora
  booz→obed; deja sin explicar david→salomón (Lucas: Natán), jacob→josé (Lucas: Elí) y fares→aram (Lucas pone a esrom
  en el medio y escribe "arní"). Tres contra tres: lo que queda son las diferencias de verdad entre los dos
  evangelios, no grafías.

### Lo probado se vuelve premisa (2026-11-08)

El otro chat: *"todavía no acumula: cada hipótesis la juzga contra el libro, nunca contra lo que ya probó"*; el
Capitán: *"con un toque de magia: que sea plástico, que aumente y vaya podando, así no tiene un crecimiento
exponencial"*. En cada vuelta, cada relación que **afirma algo** (una propiedad suya es así y no es pegamento) y
cambió desde la última vez se **encadena consigo misma**: donde dice a con b y b con c, la deducida "<ella> + <ella>"
dice a con c. Nadie la escribió; entra a la vuelta siguiente como una relación más. **Vive si una unión la toma**
(el libro la confirma y ella lo explica); la que nadie usa muere en la vuelta siguiente (deja de tener pares), y lo
que se puede volver a deducir no se guarda: se vuelve a deducir (Razar lee en un segundo; la velocidad compra el
derecho a olvidar). Lugar: el doble de formas y de pares de lo leído, hasta donde llegan las salas.

- **Prueba (`hilos_deduce_prueba.sh`):** la familia con "abuelo de" escrito → `deduce: padre de + padre de | pares 3`
  y en la vuelta 3 `une: abuelo de ~ padre de + padre de | misma | lo confirman 3`. Una relación que nadie escribió,
  deducida, y confirmada por el libro.
- **Sobre el NT:** 50 deducidas, 128 uniones, la más grande sigue siendo la genealogía (16). Deduce "hijo de + hijo
  de" (132 pares: los abuelos de la cadena), pero el NT casi nunca nombra un abuelo: nada la confirma, y muere.
- **Lo que no anda todavía:** la mayoría de las deducidas son cadenas de gramática ("a + a", "y la + y la", "su + su")
  y las uniones que toman son ruido ("tu ~ y la + y la"). El portero "afirma algo" deja pasar formas de gramática
  que muestran por casualidad un valor por palabra. Y en los sinópticos "hijo de" se une con "a" (vuelta 2), y la
  cadena de esa clase mezclada da 243 pares que "a + a" comparte al revés: la mancha de una unión floja se encadena.

**En coma, no muerta; en espera, no refutada** (el otro chat: *"refutado y sin testigo mueren igual, y no son lo
mismo"*; el Capitán: *"refutada no para siempre: en coma, quién sabe si algún día la necesitamos"*).

- **Refutada = en coma:** cada refutación guarda cómo estaban las dos relaciones (cuántas formas tenía cada una); duerme
  mientras sigan así y se despierta para juzgarse de nuevo cuando cualquiera crece.
- **Sin testigo = en espera:** la deducida que nadie tomó deja de tener pares (se puede volver a deducir), pero no está
  refutada; se cuenta aparte.
- **El portero:** sólo se encadena lo probado (una relación nacida de una unión), no una forma suelta.

| | uniones | deducidas | en coma | en espera | la más grande | uniones buenas (6) |
|---|---|---|---|---|---|---|
| sinópticos | 68 | 20 | 19 | 17 | "hijo de", 8 | — |
| NT | 118 | 47 | **116** | **42** | "hijo de", 13 | **6** |

- `mismo lugar: obed = jobed` sigue saliendo solo; las seis uniones buenas siguen.
- ⚠️ El portero de lo probado no alcanza: "a", "y la", "su" también nacen de uniones (de gramática con gramática) y se
  encadenan ("a + a", 1.307 pares). Falta que lo probado sea de una relación que afirma, no de dos que coinciden en
  pegamento; y que una pregunta pueda despertar a las que esperan.

**Despertar por contexto** (Capitán: *"que si hay un contexto parecido al que las generó puedan despertar; si algo
empieza siendo un absurdo, la respuesta puede estar ahí"*). Cada hipótesis en coma guarda su **contexto**: los nombres
de lo que dejó sin explicar. Cada unión **toca** a las personas de lo que trae (le dice algo nuevo sobre ellas), y la
hipótesis dormida cuya gente fue tocada después de caer se **despierta** (`despierta:`) y se juzga de nuevo. Prueba
(`hilos_despierta_prueba.sh`, maestros y alumnos, sin propiedades): "enseña a" cae por sol y cielo; se une "guía a",
que los trae; "despierta: maestro de ~ enseña a" y se une con 10 confirmaciones.

- **Un bug que destapó:** el while terminaba en una vuelta que sólo refutaba; ahora sigue mientras una, una deducción
  o una refutación **nueva** cambien algo (una hipótesis refutada otra vez no es noticia: así el while termina).
- **Probado y sacado: despertar por tropiezo** (cuando otra hipótesis no puede explicar a la misma gente). La dormida
  despertada así no tiene nada nuevo a favor, cae otra vez y mientras tanto le ocupa la elección a otra: en el NT las
  uniones bajaron de 118 a 76 y se perdieron las ventanas de Lucas. Sólo una unión trae noticia.

| NT | uniones | vueltas | despiertan | en coma | en espera | la más grande |
|---|---|---|---|---|---|---|
| coma por tamaño | 118 | 22 | — | 116 | 42 | 13 |
| **coma por contexto** | **104** | 23 | 167 | **68** | 33 | 16 (la genealogía) |

- Vuelven las ventanas de la cadena de Lucas ("hijo de cainán", "cainán hijo de", "hijo de matatías"; algunas
  después de despertar), "cuarenta ~ mil"; las seis uniones buenas y "obed = jobed" siguen. Se fue "del señor ~ de
  dios".
- ⚠️ Pendiente: el absurdo como pregunta (que una dormida explique el tropiezo de otra, no que se juzgue sola), y que
  una pregunta despierte a las que esperan.

**Antes de construir el absurdo, medir si tiene de dónde agarrarse** (el otro chat: *"las uniones compiten por un
lugar finito: un mecanismo nuevo se juzga por si encuentra más de lo que desplaza"*). Un instrumento (no cambia nada:
mismas uniones): de cada hipótesis que cae, sus huecos (los pares que dejó sin explicar), y cuántos los dice la otra
relación de alguna hipótesis en coma que comparte una relación con ella.

| | huecos de las refutadas | que explicaría una dormida |
|---|---|---|
| sinópticos | 882 | 0 |
| NT | 3.838 | 198 (5 %) |

- Poco: para dar vuelta un veredicto, una dormida tendría que llenar muchos huecos de una misma hipótesis; con un 5 %
  repartido es de esperar que casi nunca (sin medir todavía: es la sospecha). No se construye el mecanismo hasta tener
  un libro donde ese número sea grande.
- **Nota al pie (sexto instrumento):** el while se cortaba en la primera vuelta que sólo refutaba, desde la regla de
  explicar a la misma gente (87913d4) hasta el coma por tamaño (ac8b9a4). Las vueltas y uniones medidas en ese tramo
  pueden haber salido cortas; desde cfb6d85, no.
- Y lo que cambió el contexto: menos uniones que antes (104 contra 118) pero mejores (la más grande es la genealogía),
  y las seis buenas más "obed = jobed" aguantaron: las pruebas cuidan lo ganado.

## Romper una regla: suspenderla y volver a deducir (2026-11-08)

El Capitán: *"suspendé una propiedad y volvé a deducir todo. Si sin ella el resto igual cierra, era una costumbre
local y lo que aparece en su ausencia es mecanismo nuevo; si todo se derrumba, era viga"* (como la geometría no
euclidiana: sacar un axioma y ver qué sigue siendo consistente).

- **Lo que había que saber primero:** una regla no manda a nadie al coma. Una unión que rompe "un solo valor" se
  descarta en el acto. Los que están en coma son los que no explicaban lo suficiente.
- **El instrumento:** al final del while, cada regla ("un B por cada A" o "un A por cada B" de una relación) que
  mantiene separado algo se dice: `regla <número>: <forma> | <cuál> | frena N uniones (M palabras)`. N son los pares de
  relaciones que esa regla no deja juntar, M las palabras en conflicto. Sin suspender nada, el NT da lo mismo que antes
  (23 vueltas, 104 uniones, 68 en coma, 33 en espera).
- **Suspender:** el archivo de la casa `suspende` con el número de una regla. En cada vuelta la regla se busca en la
  relación donde está su forma ahora, del lado que le toca, y se la da por no cumplida.
- **Medido en el NT** (64 reglas frenan algo; las tres que más):

  | regla suspendida | frenaba | vueltas | uniones | en coma | despiertan |
  |---|---|---|---|---|---|
  | ninguna | | 23 | 104 | 68 | 167 |
  | 27 "y la" (un A por cada B) | 393 | 47 | 112 | 106 | 332 |
  | 154 "de la" (un B por cada A) | 366 | 23 | 104 | 68 | 167 |
  | 3489 "piedad de" (un A por cada B) | 327 | 23 | 104 | 68 | 167 |

- **Lo que dice:**
  - 154 y 3489 **no eran vigas ni costumbres: eran redundantes.** Sin ellas sale todo idéntico: lo que frenaban lo
    frena otra cosa. "Frena N" cuenta lo que una regla impide en potencia, no lo que cambia de verdad. Solo
    suspendiendo se sabe.
  - 27 "y la" **mueve el barco, pero no lo hunde:** el while dura el doble, se suman 12 uniones y se pierden 7. Entre
    las nuevas hay alguna buena (`tanto ~ mucho`, `que ~ quién`) y otras flojas (`una ~ allí una`). Entre las perdidas
    hay una buena (`tu ~ mi`). No se derrumba ni se ordena: es una regla que reparte. Esto no prueba que valga romperla.
- **Las 64, una por una** (cada una ~20 s, de a 4 en paralelo: la tanda entera, unos 4 minutos):
  - **43 son redundantes:** sin ellas salen las mismas 104 uniones. Lo que frenan lo frena otra cosa.
  - **21 mueven algo**, y casi todas lo mismo. "por el", "las", "en la", "y a su", "por los", "de un", "cuando", "puede"
    y "ese" dan el mismo cambio: 31 vueltas, +6 uniones y −3. Las nuevas son `tanto ~ mucho`, `que ~ quién`,
    `no ~ en cambio`, `que ~ potente que`, `tu ~ tu + tu` y `no robarás no ~ no + no`. Las perdidas, tres de `tu`
    (`tu ~ y del`, `tu ~ y la + y la`, `y la ~ tu + tu`). Reglas distintas, el mismo efecto: **no es la regla lo que
    importa, es que moverla cambia el orden en que se eligen las uniones**, y el while llega a otro final. El final
    depende del camino: hay por lo menos dos equilibrios, y `tanto ~ mucho` solo vive en uno.
  - **Una es viga:** sin "de tus" (un B por cada A) se pierden tres uniones de la genealogía (`hijo de ~ hijo de judá`,
    `hijo de ~ hijo de leví`, `hijo de ~ matatías hijo de`) y el while para antes (19 vueltas). Esa regla protege algo.
  - Tabla completa: `regla | forma | frena | vueltas | uniones | coma | despiertan | nuevas | perdidas`, en la salida de
    `hilos` con cada `suspende` (no está en el repo: lleva palabras del NT).

## Los caminos: ninguno se tira, cada uno con su nombre (2026-11-08)

El Capitán corrigió la vara que propuse (*"probado es lo que sobrevive en todos los caminos"*): *"a veces que un camino
no se verifique no significa camino inválido, solo nuevo o diferente"*. Tirar lo que no se repite sería contar
mayorías otra vez. Lo que se hace es ponerle nombre, y valen las dos cosas (Capitán: *"las dos cosas"*):

- **`caminos.sh <casa>`** corre `hilos` tal cual y una vez con cada regla suspendida (de a 4), y dice cada unión:
  - `de todos los caminos`: el libro la sostiene, se suspenda la regla que se suspenda;
  - `del camino de siempre, se pierde sin: [reglas]`: el camino de siempre la tiene, y sin esas reglas se va;
  - `de un camino nuevo, aparece sin: [reglas]`: no está en el de siempre, y aparece cuando esas reglas no frenan.
- En el oficio se parece a la programación lógica con varios **modelos estables**: razonar *cauto* (lo que vale en
  todos) y *valiente* (lo que vale en alguno). Lo propio: los caminos no se sortean, se abren rompiendo una regla con
  nombre, así que cada camino nuevo se explica ("sin 'y la', aparece `tanto ~ mucho`").
- **Medido en el NT** (65 caminos, 4 min 44 s):

  | | uniones |
  |---|---|
  | de todos los caminos | 96 |
  | del camino de siempre, se pierden sin alguna | 8 |
  | de un camino nuevo | 31 |

  Las seis buenas de siempre (`hijo de ~ padre de`, `cinco mil ~ cuatro mil`, `piedad de ~ compasión de`,
  `fue ~ había sido`, `algún ~ ningún`, `la multitud ~ pedro`) son **de todos los caminos**. `tu ~ mi` es del camino de
  siempre (se pierde sin "y la"). `tanto ~ mucho` y `que ~ quién` son de un camino nuevo.
- **Lo que no cubre:** solo una regla suspendida a la vez; los caminos de dos juntas no se recorren. La salida tiene
  palabras del NT y no va al repo.

## Una relación que hilos nunca vio (2026-11-08)

Al revisar las cuentas quedó a la vista que el while de `hilos` (el que razona sin estadística) nunca se había medido
contra una relación que no conoce. El banco de la relación nunca vista que había (4 de 112 con la memoria, 13 con el
cubo) es de `memoria_pares` y `voluntad_semilla`: sigue vigente, porque esos archivos no cambiaron después de medirlo.

- **El banco** (`nunca_vista.sh`, libros de `libros/nunca_vista.py`): diez personas. `cuida a` dice doce pares, y
  `habla con` y `ve a` ocho cada una, sorteados (ruido). La nueva, `vela por`, dice k de los pares de `cuida a`: del
  mismo lado, o dados vuelta como `es cuidado por`, y con o sin un par de más que nadie dijo. El nulo: k pares sorteados
  entre las mismas personas, que `cuida a` no dice para ningún lado (diez semillas por k).
- **Medido** (40 s todo):

  | caso | resultado |
  |---|---|
  | k = 2, 3, 4, 6, del mismo lado (con y sin el par de más) | 8 de 8 se unen a `cuida a`, `misma` |
  | k = 2, 3, 4, 6, dados vuelta (con y sin el par de más) | 8 de 8 se unen a `cuida a`, `al reves` |
  | nulo (40 libros) | 0 de 40 se unen a `cuida a`; 2 de 40 se unen a `habla con` |

- **Lo que dice:** con dos pares compartidos, `hilos` reconoce una forma nueva como una relación que ya conoce, y de qué
  lado. Con pares sorteados nunca se confunde con ella. Las 2 de 40 son un falso positivo de verdad: dos relaciones de
  ruido compartieron por suerte dos pares dados vuelta, y dos confirmaciones alcanzan para unir. Entre relaciones de
  ruido es un 5 %.
- **Lo que no prueba:** es la cancha de `hilos`, porque la nueva comparte pares con una conocida. Una relación nueva de
  verdad, sin ningún par en común con nada, queda sola: se guarda como relación propia, pero no hay con qué
  entenderla.

## La máquina entera, del NT a un libro distinto (2026-11-08)

El Capitán: *"aumentá la potencia al máximo y aplicá al NT, veamos a dónde llega; luego pasale otro libro distinto"*.
La potencia es la máquina entera de `hilos` (propiedades, coma, deducción, despertar) y `caminos.sh`, que la corre una
vez por cada regla suspendida, de a 4. El libro distinto: *100 preguntas* de Asimov (ensayos de divulgación), armado
como el NT (el texto corrido, cortado en oraciones, en minúscula: 3.192 oraciones). Ni el texto ni las salidas van al
repo.

| | NT | Asimov |
|---|---|---|
| vueltas del while | 23 | 7 |
| uniones | 104 | 17 |
| relaciones de dos formas o más (la más grande) | 49 (16: `hijo de`) | 10 (4: `más`) |
| en coma / en espera | 68 / 33 | 10 / 6 |
| reglas que frenan algo | 64 | 14 |
| caminos | 65 | 15 |
| uniones de todos los caminos | 96 | 17 (todas) |
| de un camino nuevo | 31 | 1 |
| mismo lugar (dos nombres, uno solo) | 3 | 0 |

- **El NT sin el archivo `tanda` da lo mismo que con él**, unión por unión: esa diferencia de armado no cambia nada.
  Los caminos del NT valen los de antes (`hilos` no cambió desde entonces).
- **Lo que encontró en Asimov:** `cercano al ~ próximo al`, `con ~ contra`, `con ~ sobre`, `más ~ tan`,
  `más ~ aún más`, `millones de ~ unos millones de`, `millones de ~ setenta millones de`, `disminuyendo ~ disminuyendo
  poco a`, `la ~ o incluso` (al revés). Sinónimos y modificadores de un mismo lugar, no relaciones entre personas.
- **Lo que dice:** la máquina es la misma y el libro manda. El NT repite parentescos con nombres propios (genealogías,
  "hijo de", "padre de"), y por eso tiene relaciones que se confirman entre sí. Un ensayo casi no repite pares de
  palabras de la misma forma. Encuentra menos, pero lo que encuentra es estable: las 17 están en todos los caminos.
- **El camino nuevo de Asimov:** sin la regla de `millones de` (un B por cada A) aparece `millones de ~ cuarenta`.

## La pendiente, no el nivel: la curva de crecimiento (2026-11-08)

Una devolución pegada por el Capitán: todo lo medido hasta acá son niveles (91 %, 104 uniones, 17 uniones), y lo que
importa para "un aprendiz sin techo" es la pendiente: si al darle más libro lo que aprende sigue subiendo o se
achata. (El "instrumento del libro 23" que nombraba no está en la documentación del proyecto: la curva se armó ahora.)

- **Cómo:** `hilos` entero sobre un octavo, un cuarto, la mitad y todo el NT, y después el NT seguido de Asimov.

  | libro | renglones | uniones | relaciones de 2+ formas | en coma | reglas |
  |---|---|---|---|---|---|
  | NT, 1/8 | 1.470 | 9 | 8 | 1 | 11 |
  | NT, 1/4 | 2.941 | 33 | 23 | 5 | 29 |
  | NT, 1/2 | 5.883 | 70 | 34 | 42 | 43 |
  | NT entero | 11.766 | 104 | 49 | 68 | 64 |
  | NT + Asimov | 14.958 | 148 | 70 | 107 | 88 |

- **La pendiente** (uniones nuevas cada mil renglones agregados): 6,1 en el primer octavo, 16,3 en el segundo, 12,6 en
  el segundo cuarto, **5,8 en la segunda mitad**, y **13,8 al agregar Asimov**. Dentro de un mismo libro se achata
  (vuelve a decir lo que ya dijo). Al llegar un libro distinto, sube de nuevo.
- **Juntos dan más que la suma:** el NT solo da 104 y Asimov solo 17 (121 distintas). Juntos dan 148: 80 están en los
  dos lados, 68 aparecen solo juntos y 41 se pierden. Entre las que aparecen solo juntos, algunas cruzan los dos libros
  (`cuarenta ~ treinta`, `cuarenta ~ millones de`, `de hidrógeno ~ de helio`, `del señor ~ de nuestro señor`), y otras
  son flojas. Las seis buenas del NT siguen (`hijo de ~ padre de`, `cinco mil ~ cuatro mil`, `piedad de ~ compasión de`,
  `fue ~ había sido`, `algún ~ ningún`, `la multitud ~ pedro`) y también `cercano al ~ próximo al`. Se pierden
  `más ~ tan` y `con ~ contra`. Es el mismo efecto del camino que ya se había visto: más libro cambia el orden, y el
  final es otro.
- **Lo que prueba y lo que no:** que la pendiente no se achata cuando llega material nuevo, con **un** libro agregado.
  Es un punto, no una curva: para decir "sin techo" hacen falta muchos libros distintos, uno detrás de otro, y ver si
  cada uno sigue sumando. Ninguno de los dos textos va al repo.

## Once libros: la curva no sube, se revuelve (2026-11-08)

El Capitán: *"sí, más libros"*. Once libros, uno sumado a los anteriores cada vez: el NT, Asimov, y nueve documentos
de este proyecto (`estado`, `lectura`, `cardumen`, `janaxos`, `ideas`, la especificación del idioma, `traductores`,
`receta-para-la-vida`, `CARTA-DEL-AUTOR`), armados igual (oraciones, minúscula, sin bloques de código ni marcas). Los
documentos citan palabras del NT: no son del todo ajenos. Ninguno de los textos ni de las salidas va al repo.

| suma hasta | renglones | uniones | nuevas | siguen hasta el final | solo |
|---|---|---|---|---|---|
| NT | 11.766 | 104 | 104 | 41 | 104 |
| + Asimov | 14.958 | 148 | 44 | 71 | 17 |
| + estado | 16.378 | 164 | 16 | 74 | 1 |
| + lectura | 19.727 | 177 | 13 | 98 | 40 |
| + cardumen | 22.217 | 230 | 53 | 151 | 29 |
| + janaxos | 23.478 | 238 | 8 | 166 | 2 |
| + ideas | 24.148 | 213 | **−25** | 163 | 1 |
| + especificación | 24.241 | 218 | 5 | 214 | 0 |
| + traductores | 24.370 | 251 | **+33** (129 renglones) | 179 | 0 |
| + receta | 24.635 | 246 | −5 | 244 | 0 |
| + carta | 24.690 | 245 | −1 | 245 | 0 |

- **El instrumento mentía:** contar uniones no mide lo aprendido. Un documento de 129 renglones "suma" 33 uniones, y
  otro "resta" 25. Las uniones de cada corrida son el final de un while que empieza de cero: cada libro que se suma
  cambia el orden, y el final es otro. A lo largo de las once corridas aparecieron 543 uniones distintas. De las 104
  del NT, solo 41 siguen al final.
- **Lo que de verdad dice, y es lo importante:** **más libro le hace perder lo que había probado.** Al final ya no
  están `hijo de ~ padre de`, `cinco mil ~ cuatro mil` ni `algún ~ ningún`. Siguen `piedad de ~ compasión de`,
  `fue ~ había sido`, `la multitud ~ pedro`, `cercano al ~ próximo al` y `de hidrógeno ~ de helio`. Los textos
  técnicos meten uniones de ruido alrededor de palabras muy dichas (`a ~ mb mb mb`, `a ~ ms traductor`).
- **Por qué:** `hilos` no acumula entre libros. Lo probado se vuelve premisa dentro de una corrida, pero cada corrida
  empieza de cero, así que lo probado en el NT no defiende su lugar cuando llega lo nuevo: compite de nuevo, y a veces
  pierde. Un aprendiz sin techo tiene que llevarse lo que aprendió al libro siguiente. Esto todavía no lo hace, y por
  eso la pendiente hoy no se puede medir: falta que lo aprendido sobreviva.

## Lo sabido pasa al libro siguiente (2026-11-08)

El Capitán: *"sí, que se lo lleve"*. Hasta acá cada corrida de `hilos` empezaba de cero, y con más libro perdía lo que
había probado (`hijo de ~ padre de` se iba al sumar los documentos).

- **`sabido`** (un archivo de la casa): al terminar, cada unión del while se escribe como lo que es, una flecha
  {la llave de la forma, la llave de aquella a la que se unió, 1 del mismo lado o 2 al revés, y sus palabras}. Las
  llaves salen de las huellas de las palabras, así que una forma tiene la misma llave en cualquier libro. Al empezar el
  libro siguiente, antes de la primera vuelta, cada flecha cuyas dos formas están en ese libro se vuelve a tender
  (`sabe: …`). Las que no están se copian tal cual al `sabido` nuevo. No se pierde ninguna. Una forma deducida no se
  escribe: se vuelve a deducir.
- **Prueba (`hilos_sabido_prueba.sh`):** un libro con la familia une `padre de ~ hijo de`. Un segundo libro con otra
  gente y un par de cada una no une nada solo. Con el `sabido` del primero dice `sabe: padre de ~ hijo de | al reves`
  y guarda la línea para el próximo.
- **Los once libros, cada uno solo, con lo que dejó el anterior:**

  | libro | vuelve a tender | guardadas sin usar | uniones nuevas | lo que sabe después |
  |---|---|---|---|---|
  | NT | 0 | 0 | 104 | 101 |
  | Asimov | 30 | 71 | 17 | 118 |
  | estado | 13 | 105 | 1 | 119 |
  | lectura | 27 | 92 | 42 | 159 |
  | cardumen | 50 | 109 | 30 | 184 |
  | janaxos | 31 | 153 | 3 | 187 |
  | ideas | 25 | 162 | 1 | 188 |
  | especificación, traductores, receta, carta | 5 a 16 | 172 a 186 | 0 | 188 |

  **Sube y no baja:** 101 → 188, y no pierde nada en el camino (sin la memoria, la misma tanda iba 104 → 213 → 251 →
  245 y perdía lo probado). Los cuatro documentos chicos no traen nada nuevo y no borran nada. Al final siguen, como
  flecha directa, `cinco mil ~ cuatro mil`, `piedad de ~ compasión de`, `fue ~ había sido`, `algún ~ ningún`,
  `la multitud ~ pedro` y `cercano al ~ próximo al`. `hijo de` y `padre de` siguen en la misma familia.
- **Lo malo, y viene de lo mismo:** en `lectura` (que cita al NT y habla de sus relaciones) se unió `y ~ hijo de`
  con tres confirmaciones. Como ya sabía `hijo de ~ padre de`, la genealogía entera quedó en la clase de la conjunción
  "y", junto con `sin` y `→ − y`. Lo que se lleva no se vuelve a juzgar: **un error de un libro queda para siempre.**
  Falta la poda: que una flecha traída sea premisa, pero que el libro nuevo pueda mandarla al coma si la contradice o
  no la explica (al coma, no a la basura: como todo lo refutado).

## La poda es dormir, no tirar (2026-11-08)

El Capitán: *"la poda es dormir temporalmente, no eliminar: nada se tira, regla de la casa"*.

- **Al empezar un libro,** cada flecha de `sabido` cuyas dos formas están en él se mide contra ese libro: cada par de
  una forma (dado vuelta si la flecha va al revés) la confirma si la otra lo dice así, y va en contra si la otra lo
  dice solo del otro lado. **Si hay más en contra que a favor, se duerme** (`duerme: … | en contra N, a favor M`): no
  se usa en ese libro, y en `sabido` queda con `dormida` después de su lado, entera. **Una dormida despierta** cuando
  un libro la confirma como se confirma una unión (dos a favor, ninguno en contra): `despierta lo sabido:`. Mientras
  tanto pasa de libro en libro tal cual. (Que "más en contra que a favor" baste para dormirla es criterio: lo probado en
  otro libro solo cede ante más evidencia en contra que a favor.)
- **Prueba (`hilos_poda_prueba.sh`), cuatro libros:**
  1. La familia une `padre de ~ hijo de` al revés.
  2. Un libro que dice cada par como `padre de` y como `hijo de` del mismo lado: la vieja se duerme (2 en contra,
     0 a favor), y ese libro une las mismas formas a su manera, del mismo lado.
  3. Un libro que no habla de eso: las dos se guardan tal cual.
  4. Otra familia bien dicha: la vieja despierta y la del libro 2 se duerme.

  Dos creencias, ninguna tirada: cada libro deja despierta la que él sostiene.
- **Los once libros con la poda:** 189 flechas despiertas, una dormida (`contra ~ con`, en `cardumen`, 1 en contra y
  0 a favor). **La contaminación de la `y` no se duerme:** ningún libro de después dice nada en contra de
  `hijo de ~ y`, solo no la vuelve a confirmar. La poda duerme lo que un libro contradice, no lo que se calla.
- **La decisión que queda:** si una flecha cuyas dos formas hablan en un libro, y que podría confirmarse ahí, no es
  confirmada por ningún par, ¿se duerme también (como la regla de explicar dentro del libro)? Así dormiría la de la `y`,
  pero también lo sabido que un libro menciona sin repetirlo par por par.
