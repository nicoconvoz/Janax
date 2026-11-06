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
