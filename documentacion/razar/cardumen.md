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

Lo que falta es lo que en el diseño ya existe y el modelo todavía no tiene: **la puerta** (*"alguien cierra la puerta y
dice no pasarás"*). Hoy las relaciones solo empujan; en el cerebro cerca de una de cada cinco neuronas frena, y ese
equilibrio lo mantiene en el borde entre el silencio y la convulsión (criticalidad). Decisión del Capitán: cómo se
cierra una puerta.

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
