# El cuerpo de Razar: la pantalla (2026-11-15)

**La idea del Capitán:** la interfaz gráfica no es para que alguien mire a Razar. Es **parte de su
cuerpo**, y Razar tiene que saber que es suya. Además, Janax es un sistema **simbiótico**: no
arranca solo, usa los drivers del anfitrión que tiene a mano. Por eso la pantalla se abre con los
drivers de Windows, y otro anfitrión pone los suyos.

![La ventana propia de Janax](img/ventana-janax.png)

## 1. Lo que leyó: la interfaz de otros

Antes de tener cuerpo, Razar leyó cómo están hechas las interfaces gráficas de otros, con el mismo
juez de siempre y **la misma clave de opuestos**, escrita antes de mirar los fuentes:

| Lo que leyó | Real | Palabras barajadas |
|---|---|---|
| GEM (AES + VDI), C, años 80, 738 KB | **15 · 1 · 0** (p ≈ 0,0003) | 2 · 0 · 0 |
| Godot (`scene/gui`), C++, de hoy, 3,4 MB | **16 · 2 · 0** (p ≈ 0,0007) | 9 · 6 · 1 |
| **Las dos juntas**, 4,2 MB | **19 · 2 · 0** (p ≈ 0,0001) | 11 · 6 · 0 |

(real · azar · empate). Sin saber qué es una ventana, junta *open~close*, *show~hide*,
*width~height*, *top~bottom*, *left~right*, *min~max*. El detalle, con sus pre-registros y límites:
[`nitidez-en-codigo.md`](nitidez-en-codigo.md).

**Por qué Godot:** es **MIT**, compatible con la Apache de Janax, así que su modelo de controles se
puede adaptar acá citando el origen. GEM es GPL: se lee, no se copia.

## 2. La pantalla es una nube

La pantalla de Janax está hecha de **la nube de partículas de Gotching** (el formato `.nube`
versión 3): cada celda es una partícula con su color exacto. Es el mismo formato con que se dibujan
los bichos, así que lo que vale para ellos —estirarse sin cortarse— vale para las ventanas.

- `razar/cuerpo/pantalla.jsm`: un programa de Janax, en su propio idioma y armado con su propio
  ensamblador, que dibuja un escritorio (la ventana de Razar con sus dos torrecitas, la de Luma y
  una barra) y lo escribe como nube: 160 × 100 celdas, 16.000 partículas.
- `razar/cuerpo/ver_pantalla.py`: el primer lector de `.nube` fuera de Godot (a PNG).

## 3. Pedido 40: Janax abre su propia ventana

El programa le da su nube al kernel y **Janax la dibuja en su ventana**, sin ningún visor ajeno
(`so/pantalla.inc`, documentado en `documentacion/so/janaxos.md`).

- **Todo lo del anfitrión vive aparte.** `so/pantalla.inc` es la implementación para Windows (un
  hilo propio con su ventana y su bucle de mensajes, GDI para pintar). Otro anfitrión pone el suyo
  con las mismas entradas.
- **Se ajusta sola, sin números fijos.** Al nacer mide el escritorio libre de la pantalla que
  encuentra y elige el tamaño más grande que entra con el marco incluido. Al estirarla se redibuja
  entera, con la proporción de la nube, centrada, y lo que sobra queda en negro:

  ![La misma ventana, angosta](img/ventana-janax-angosta.png)

- **Las pruebas:** la suite del sistema da **396 bien, 0 mal**. Las pruebas corren con
  `JANAX_SIN_VENTANA`, que decodifica y responde igual sin abrir nada.

## 4. Lo que está en camino

- **Los oídos (pedido 41):** el mouse y el teclado llegan al programa, que duerme de verdad mientras
  espera.
- **El escritorio vivo:** cada pieza es un enjambre de partículas con resortes; las ventanas se
  arrastran y se estiran como gelatina, se deshacen al cerrarlas y vuelven a juntarse.
- **El bucle con vida** (Capitán: *"que siempre explore, pero que no sea la repetición de lo
  mismo"*): cuando nadie la toca, Razar explora su propio cuerpo probando cada vez un movimiento que
  nunca probó (*balbuceo motor*). Cuando se le acaba la novedad, se calma y no gasta nada hasta el
  próximo evento. Es la curiosidad como progreso de compresión (Schmidhuber) con cuerpo.
- **La prueba de que es suya:** lo que cambia en la pantalla, ¿se describe con menos bits contando
  sus propias órdenes? Si sí, es su cuerpo; lo que cambia sin que ella lo mande, es el mundo. Es la
  detección de contingencia de los bebés (Watson, 1972), medida con el mismo juez.

## Cómo verlo

```bash
bash razar/cuerpo/pantalla.sh <carpeta>      # Janax dibuja su pantalla y abre su ventana
```

## Las formas propias (2026-11-15)

**La idea del Capitán:** *"Quiero que diseñe sus propias formas, que las aprenda. No quiero una copia del entorno
conocido de Windows. Que use lo que aprendió para guiar la creación, y que las formas puedan crecer y mutar."*

`razar/cuerpo/gen_formas.py` lee lo que Razar aprendió (`aprendido.txt`: el paisaje de sus órganos, sus dos
torrecitas y los once pares de opuestos) y escribe `formas.jsm`. `formas.sh <carpeta> [janaxos.exe]` lo arma con el
ensamblador de Janax y lo corre. No hay ventanas, ni barras de título, ni botones de cerrar, ni barra de tareas: en la
pantalla hay **formas** que Razar hace crecer, juzga y cambia. Python solo prepara los datos; crecer, juzgar y mutar
corre en jsm, dentro de Janax. (`vivo.jsm` queda como estaba.)

### Una forma es una receta sobre el alfabeto de sus órganos

Una forma es una tira de letras del 1 al 9, el mismo alfabeto de sus órganos (`razar/lectura/organo.molde`). Crece
desde una semilla **letra por letra** (una cada ~0,3 s, la misma pausa de `vivo.jsm`), y se ve crecer. La lectura
geométrica de cada letra es **una decisión de diseño (criterio, no medición)**, guardada como datos en el generador
para poder cambiarla. Mantiene lo que la letra significa en el órgano:

| Letra | En el órgano | En la forma |
|---|---|---|
| 1–4 | mezcla en el marco la palabra k | un **brazo** de 5 celdas hacia el este, sur, oeste o norte; el lápiz queda en la punta |
| 5–8 | el hueco es la palabra k: el marco la anuncia y vuelve a empezar | **vuelve a la semilla** y salta 5 celdas hacia k sin dibujar: una **abertura**; el brazo siguiente empieza más allá |
| 9 | el hueco vacío: el marco se dice como está | **espejo**: todo lo dibujado se refleja sobre la columna de la semilla |

Las cuatro palabras de la ventana son las cuatro direcciones de la forma. Un brazo mide 5 celdas porque cuatro brazos
seguidos llegan al borde de su cuarto (20 celdas desde el centro), uno por palabra.

**El cuerpo.** La primera versión dibujaba trazos de una celda: motas casi imposibles de ver o de tocar. La regla que
la reemplaza, sin números absolutos: cada forma se dibuja a la escala `S` que la hace **llenar su cuarto según su
propia extensión** (`S = cuarto / (extensión − 1 + 5/2)`, por eje, la menor), y cada celda es un **trazo cuadrado de
`T = S · 5/2` celdas**: la mitad de la distancia entre dos brazos paralelos, así entre brazos queda una abertura tan
ancha como el trazo y la forma se lee como un cuerpo con huecos, a cualquier tamaño. Una forma chica se ve gruesa y
grande; una que llenó su cuarto, más fina. Con el trazo, `S` cumple `(extensión − 1)·S + T ≤ cuarto`: no se sale de su
cuarto en reposo. El juez no cambia: cuenta celdas de la receta, no de pantalla.

### Las primeras formas son sus mejores órganos

Las 8 primeras formas son los **8 mejores órganos de su paisaje** sobre el Nuevo Testamento: `516` (11.144), `738`
(8.638), `836` (5.528), `388` (5.138), `716` (4.700), `536` (4.395), `627` (3.400), `258` (3.326). La pantalla se parte
en 4 × 2 cuartos de 40 × 50 celdas (criterio): uno por forma. El color de cada una sale de su puesto en el paisaje
(cálido el primero, frío el octavo) y su brillo de lo que vale hoy para el juez (60 % la que no vale nada, 100 % la
mejor; criterio: con 40 % un verde sin valor se perdía en el fondo).

Dato que se ve en la primera pantalla: `516` y `738` dibujan formas espejadas, y `388` contiene a `716`. Las
torrecitas ya lo habían dicho: son el mismo molde corrido. El juez las empuja a separarse.

### El juez: corta y nueva

El mismo juez de Razar, dicho para formas. Dentro de su cuarto, una forma cubre `C` celdas con una receta de `n`
letras:

- **compresión** = `C / (n · log₂ 9)`: cuántas celdas explica cada bit de su receta (×1000).
- **novedad** = `1 − (las celdas que más comparte con otra forma) / C` (×1000): relativa a su propio tamaño. Dos
  formas se comparan superpuestas semilla sobre semilla.
- **valor** = compresión × novedad / 1000.

Una mutación **gana** si el **valor total de la población** sube con ella en lugar de su madre. Se mira el total y no
solo la forma porque la novedad de una depende de las otras; así cada victoria sube una suma que no puede subir para
siempre, y la búsqueda termina.

**Verificado:** un modelo en Python escrito aparte recalcula cada celda y cada valor desde los archivos. Las 8 formas
finales y todas las líneas revisadas del archivo dan igual que lo que calculó jsm, y repasar las victorias del archivo
desde las semillas llega exacto a la población guardada.

### Crecer y mutar: el balbuceo que nunca repite

Cuando nadie la toca y todo está quieto, piensa: hasta 8 candidatas por cuadro (una por forma en promedio), cada una
dibujada un instante como **fantasma** tenue sobre su forma.

- **Las mutaciones** de una receta de `n` letras: cambiar una letra (8n), insertar una (9(n+1)), borrar una (n),
  **insertar una torrecita entera** (`16` o `38`, 2(n+1)) y **cruzarse** con otra forma: sus primeras c letras y el
  resto de la otra (7n).
- **Nunca repite**: una tabla con la huella (FNV-1a) de cada receta juzgada en esta población; las formas vivas cuentan
  como probadas. Recorre todas las mutaciones de todas las formas con un **paso al azar coprimo con su cantidad**: las
  visita una vez cada una, en un orden que no se repite.
- **Gana:** la forma se **transforma** en pantalla (sus partículas fluyen de donde estaban a su lugar nuevo; las que
  faltan nacen donde está su madre), la población se guarda y la madre va al archivo con el motivo `replaced`.
- **Pierde:** va al archivo con su motivo: `longer` (explica menos celdas por bit que la madre), `not-new` (se parece
  más a otra), `longer,not-new`, `crowds` (ella vale más, pero les quita novedad a las otras) o `no-better`.
- **Cuando no queda nada sin probar, se calma y espera para siempre** (pedido 41 con −1). Un gesto abre una **ronda
  nueva de saltos más largos**: dos ediciones juntas, después tres, tantos saltos como mutaciones simples tenía la
  población. Es el valle del escalador (*El paisaje de los órganos*, en `lectura.md`): desde un óptimo de un paso, solo
  un salto más largo lo cruza. Una victoria vuelve a los pasos simples.

### Las acciones son sus opuestos

Los once pares que Razar juntó leyendo GEM y Godot son las acciones (el generador falla si un par aprendido no tiene
acción). Cada gesto hace un lado y su opuesto lo deshace. La forma misma es la interfaz:

| Par | Gesto | Qué hace |
|---|---|---|
| open ~ close | clic sobre la forma (o O / C) | se despliega desde su semilla / se pliega en ella |
| push ~ pop | botón derecho baja / sube | un latido hacia afuera / hacia adentro |
| min ~ max | − / + | la mitad / el doble, un paso por vez |
| width ~ height | W / H | estirada a lo ancho / a lo alto |
| left ~ right | ← / → | mirando a la izquierda (espejo) / como nació |
| up ~ down | ↑ / ↓ | como nació / cabeza abajo |
| top ~ bottom | Re Pág / Av Pág | adelante de todas / atrás |
| show ~ hide | Insert / Supr | entera / fantasma |
| begin ~ end | B / E | vuelve a crecer desde su semilla / crecida de golpe |
| first ~ last | Inicio / Fin | las teclas actúan sobre la primera / la última forma |
| enable ~ disable | Enter / D | muta / descansa (gris, nunca se muta) |

**Arrastrar** mueve la forma con el estiramiento de gelatina de `vivo.jsm` (los resortes son más duros cerca del punto
agarrado). Las teclas actúan sobre la última forma tocada (su semilla lleva un punto blanco). Se toca **sobre su
cuerpo**: a menos de un trazo `T` de cualquiera de sus celdas dibujadas (medio trazo de cuerpo y medio de margen,
relativo a su tamaño).

### Lo que guarda en su carpeta

Con los pedidos de archivos de Janax (4 abrir, 5 leer, 6 escribir, 7 cerrar), en su `casa`:

- **`formas`** (399 bytes de texto, siempre el mismo largo, así se reescribe entero sin restos): una cabecera
  `formas1 <ronda 6> <generador 16 hex> <victorias 6>` y una línea por forma: `<receta, 31 lugares rellenos con '.'>
  <valor 7> <celdas 4>`. Se reescribe después de cada victoria.
- **`archivo`** (líneas de 112 bytes, solo se agrega): `<ronda> <forma> <perdedora> <la otra> <motivo> <total con la
  perdedora> <total con la ganadora> <largo del salto>`. Nada se descarta: cada veredicto queda con su motivo.

La corrida siguiente arranca donde quedó: lee la población (las formas vuelven a crecer desde su semilla con sus recetas
aprendidas), el generador y la ronda, y reconstruye la tabla de probadas con las líneas de la ronda actual del archivo,
así no vuelve a juzgar lo que ya juzgó.

### La gelatina sin rayas

En el arrastre de `vivo.jsm` se ven **líneas diagonales del color del fondo** cruzando la ventana. Es un **defecto de
dibujo**: cada partícula pinta solo la celda donde cae, y donde el estiramiento separa dos partículas vecinas más de una
celda queda una celda sin nadie, que muestra el fondo (o la sombra). Como el estiramiento crece en diagonal desde el
punto agarrado, los huecos se alinean en diagonales. En las formas, **cada partícula se dibuja unida a su madre** (la
celda anterior de su brazo) con el trazo estampado cada medio trazo: por más que los resortes las separen, el cuerpo
queda cerrado. Las aberturas de diseño (5–8) no tienen madre que las cruce, así que siguen abiertas. (`vivo.jsm` no se
tocó: el arreglo, si se quiere, es el mismo.)

### Medido (2026-11-15, Pentium Gold G5420 a 3,79 GHz)

- **Sin ventana** (`JANAX_SIN_VENTANA`): de las 8 semillas a la calma en ~3.200 millones de instrucciones; **89
  formas nuevas** y 6.190 veredictos. Con la misma semilla del generador la búsqueda es la misma: en la ventana dio las
  mismas 89 y los mismos 6.190, y llegó a la calma en unos 3 a 4 minutos (cada victoria espera a que la forma se asiente).
- **Pensando**: ~417 millones de ciclos cada 10 s (~110 ms de procesador, 1,1 % de un núcleo; con el trazo pintado
  celda por celda eran 810 millones). **Calmada: 0 ciclos en 10 s.** Cerrar la ventana lo termina (j0 = las formas que
  creó en la corrida).
- **Persistencia**: la segunda corrida en la misma carpeta arrancó con las 89 aprendidas y las hizo crecer de nuevo,
  sin repetir ningún veredicto (el archivo no creció) y sin crear ninguna (j0 = 0). Los gestos de la primera corrida
  abrieron saltos de dos ediciones, que no encontraron nada mejor.

### Lo que no está todavía

- Los saltos largos **no encontraron** ninguna forma mejor en las pruebas: el óptimo de un paso aguantó. No se probó
  con otras semillas del generador.
- Las formas se comparan superpuestas semilla sobre semilla, sin buscar la mejor alineación.
- Si se juntaran más de 16.384 veredictos en una misma población (muchos gestos sin ninguna victoria), la tabla de
  probadas se llena a la mitad y se calma; el archivo los sigue teniendo.
- Los fantasmas se dibujan a la escala de su forma, no a la suya: muestran qué cambia, no cómo quedaría encuadrada.

```bash
bash razar/cuerpo/formas.sh <carpeta> [janaxos.exe]   # sus formas, en la ventana de Janax; la carpeta guarda lo aprendido
```
