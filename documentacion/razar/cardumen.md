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
