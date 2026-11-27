# 10. Luma: pantalla, lluvia hexadecimal, panel, criaturas y órganos vivos

Este capítulo especifica la parte visible y viva del programa [`luma.jsm`](08-luma-cuerpo-procesos-y-casa.md#2-generación-de-lumajsm): la geometría de su pantalla y la composición
de cada cuadro; la lluvia hexadecimal del lado derecho; el panel inferior y su protocolo de redibujo; el tratamiento
del teclado (incluido el bloqueo de escritura mientras el pensador despierta y la vista de música con Tab); las ocho
formas vivas (recetas que crecen, mutan y son juzgadas); los engranajes que Luma recorta de su propio código máquina;
la comida (nubes de partículas de la despensa y libros del disco de la carpeta vigilada); y las criaturas (simulación
de marcha, reglas locales, diálogos y su realimentación con las formas). No cubre: el idioma y el ensamblador ([cap. 01](01-idioma-janax.md#01-el-idioma-janax-máquina-virtual-codificación-e-instrucciones)
y [02](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas)), el núcleo, la memoria y los procesos ([cap. 03](03-nucleo-arranque-memoria-procesos.md#03-núcleo-janaxos-arranque-memoria-procesos-firmas-y-planificación)), la semántica de cada pedido al núcleo ([cap. 04](04-nucleo-abi-de-pedidos.md#04-núcleo-janaxos-abi-de-pedidos-llamadas-al-sistema)), la ventana, el
teclado y el vigía del lado del núcleo ([cap. 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn)), la lectura de Razar, el órgano, sus lentes y el juez de lectura
([cap. 06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)), el cardumen y su canto ([cap. 07](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez)), el cuerpo de Luma, su casa, su pensador y su libertad ([cap. 08](08-luma-cuerpo-procesos-y-casa.md#08-luma-cuerpo-generadores-procesos-y-formato-de-su-casa)), la
conversación y sus libros ([cap. 09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta)) ni el instalador y la publicación ([cap. 11](11-instalador-lanzador-y-publicacion.md#11-instalador-lanzador-y-publicación)). Cuando una rutina de este capítulo
delega en otra de esos capítulos se nombra la rutina y el capítulo.

## 10.1 Convenciones, fuentes y construcción

### 10.1.1 Cómo se arma el programa

| Paso | Qué hace | Fuente |
|---|---|---|
| 1 | `gen_luma.py` define el objeto `LUMA` ([ganchos](08-luma-cuerpo-procesos-y-casa.md#22-orden-de-ejecución-mecanismo-de-ganchos) `layout`, `more_vars`, `init`, `routines`, `reader`, …) y ejecuta `gen_comer.py` con él. | `razar/cuerpo/gen_luma.py:1118-1121` |
| 2 | `gen_comer.py` define el objeto `COMER` y ejecuta `gen_formas.py` en el mismo espacio de nombres. | `razar/cuerpo/gen_comer.py:1144-1147` |
| 3 | `gen_formas.py` escribe el programa: llama a `COMER.layout()`, `LUMA.layout()`, `LUMA.reader()` (que crea el lector `gen_leer.make`), el bucle principal y las rutinas; escribe `luma.jsm`. | `razar/cuerpo/gen_formas.py:137-140, 220, 1331-1337`; `razar/cuerpo/gen_luma.py:98-102` |
| 4 | `LUMA.routines` ejecuta `gen_vida.py` como módulo (`VIDA_MOD`) y renombra con prefijo `v_` toda etiqueta definida por las criaturas que no empiece con `v_`. | `razar/cuerpo/gen_luma.py:122-150` |

Consecuencia del renombre: dentro de las líneas generadas por `gen_vida.py` (incluidas `v_show` y `r_contour`, que se
emiten en su espacio), un `jcall r_fill` llama al `r_fill` de las criaturas (`gen_vida.py:1645`), renombrado `v_r_fill`;
`r_contour` mismo queda como `v_r_contour`; las etiquetas que las criaturas no definen (`r_rain_life`, `r_panel`,
`r_mus_frame`, …) conservan su nombre (`razar/cuerpo/gen_luma.py:131-141`).

`formas.jsm`, `comer_nubes.jsm` y `vida.jsm` son las salidas independientes de los mismos generadores sin ganchos
(`razar/cuerpo/gen_formas.py:1337`, `razar/cuerpo/gen_comer.py:1145`, `razar/cuerpo/gen_vida.py:216-221`); no forman
parte de `luma.jsm`. Este capítulo especifica el comportamiento dentro de `luma.jsm`; donde el independiente difiere
se indica.

Variables de construcción que cambian el programa generado (todas leídas con `os.environ`):

| Variable | Efecto | Fuente |
|---|---|---|
| `LUMA_CALMA` | `ALWAYS = 0`: las criaturas y las formas pueden calmarse. | `gen_luma.py:36` |
| `LUMA_PASADO` | `PRESENT = 0`: registros por anexado en lugar de anillos. | `gen_luma.py:41` |
| `LUMA_GALEOTE` | Sin libertad (`r_free`); siempre piensa. | `gen_luma.py:112, 1118` |
| `VIDA_CONTROL` | Construcción de control: letras barajadas antes del corte y melodías aleatorias. | `gen_luma.py:1043`; `gen_vida.py:104` |
| `LUMA_QUIETA` | Ningún candidato gana (prueba). | `gen_formas.py:826` |
| `LUMA_ALEGRIA` | Cambia lo que paga el acto "pensar". | `gen_luma.py:402-405`; `gen_leer.py:669` |

### 10.1.2 Registros y memoria

- `j14` vale 0 durante todo el programa; las variables globales viven en la [habitación 0](03-nucleo-arranque-memoria-procesos.md#63-primera-orden-la-sala-0) y se leen con
  `jld jX, j14, dirección` (`gen_formas.py:219, 188-191`).
- `j10`–`j13` son de uso transitorio; `j15` se usa libremente fuera de un pedido (`gen_leer.py:1997`).
- Coordenadas de las formas y de las partículas: punto fijo ×256 (`gen_formas.py:60, 145`). Posiciones de las
  criaturas: celdas ×65536 (`gen_vida.py:1132-1137, 1190-1197`).
- Generador pseudoaleatorio: xorshift64 con desplazamientos 13 (izquierda), 7 (derecha), 17 (izquierda), estado en
  `RNG`; `r_randmod(n)` devuelve `(rand >> 1) mod n` (`gen_formas.py:1320-1326`). Semilla inicial
  `0x2545F4914F6CDD1D` (`gen_formas.py:78, 260`).
- Huella FNV-1a de 64 bits: base `0xCBF29CE484222325`, primo `0x100000001B3`. `r_fnv` y `r_hash` fuerzan el bit 0 a 1
  ("nunca 0"); las huellas de libros del disco no lo fuerzan (`gen_comer.py:256-261`; `gen_formas.py:939-943`;
  `gen_luma.py:268-271, 284-286`).

### 10.1.3 Protocolo de pedidos

`r_tocar(j10 = tipo, j11 = a, j12 = b)` escribe en la [cola](04-nucleo-abi-de-pedidos.md#4-formato-de-la-cola-de-pedidos) `QUEUE = 0x100`: `+0 = 1`, `+8 = tipo`, `+16 = a`,
`+24 = b`; ejecuta [`jsys j15, j13`](04-nucleo-abi-de-pedidos.md#3-convención-de-llamada-de-jsys); devuelve `j12 = [+24]` y `j13 = [+32]` (`gen_formas.py:1327-1329`). Los pedidos de
archivo se hacen con `r_file`, que compone `j10 = tipo | (FH << 32)` (`gen_formas.py:1072-1073`). La semántica de cada
número está en el [cap. 04](04-nucleo-abi-de-pedidos.md#9-especificación-de-cada-pedido); aquí sólo se fija cómo se usan:

| Pedido | Uso en este capítulo | Fuente |
|---|---|---|
| [2](04-nucleo-abi-de-pedidos.md#92-memoria-y-cajas) | `r_alloc(j1 bytes)`: memoria nueva (mínimo 8 bytes); fallo → [`fr_nomem`](08-luma-cuerpo-procesos-y-casa.md#72-falta-de-memoria) (Luma deja la señal `dormir` y se detiene con `0BADh`). | `gen_comer.py:238-247`; `gen_luma.py:473-482` |
| [3](04-nucleo-abi-de-pedidos.md#92-memoria-y-cajas) | Devolver una memoria. | `gen_leer.py:1621-1622` |
| [4](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) | `r_open(j11 etiqueta, j12 bytes)` → `FH` (negativo: fallo). | `gen_formas.py:1096-1097` |
| [5, 6, 7](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) | Leer, escribir, cerrar `FH` (j11 = dirección, j12 = bytes → j13 = bytes). | `gen_formas.py:1072` |
| [12](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) | Borrar la etiqueta j11 (j12 bytes) antes de reescribirla, o el archivo vacío que dejó una consulta. | `gen_luma.py:303, 309`; `gen_leer.py:6285` |
| [20](04-nucleo-abi-de-pedidos.md#96-familia) | Corazón ([tejido 7](06-razar-lectura-y-organos.md#109-corazón-tejido-7), [§10.8.3](#1083-crecimiento-r_grow)): con j11 = -1 consulta un valor (j13); con j11 = n lo fija. Semántica en [cap. 04](04-nucleo-abi-de-pedidos.md#96-familia) (`so/janaxos.asm:5199-5207`). | `gen_leer.py:7202, 7213` |
| [30](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) | Decir una palabra a un proceso hijo. | `gen_leer.py:6218-6219` |
| [35](04-nucleo-abi-de-pedidos.md#96-familia) | Con j11 = -1, j12 = 0: un valor del núcleo en j13, usado sólo para el sello del nombre ([§10.6.3](#1063-nombre)). | `gen_leer.py:1971` |
| [37](04-nucleo-abi-de-pedidos.md#94-salidas-al-anfitrión) | Abrir un archivo del anfitrión, sólo lectura (j11 = ruta, j12 = bytes) → manejador. | `gen_luma.py:280`; `gen_comer.py:469`; `gen_vida.py:606` |
| [38](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) | Posicionar el manejador (en los 32 bits altos de j10) en el desplazamiento absoluto j11 (0: inicio); con j11 = -1 devuelve el tamaño en j13. | `gen_leer.py:1613, 1689`; `gen_luma.py:796, 808` |
| [39](05-nucleo-pantalla-teclado-vigia.md#108-entrega-pedido-39) | Siguiente archivo nuevo y quieto de las carpetas vigiladas: escribe la ruta en j11 (hasta j12 = 4096 bytes), j13 = longitud (≤ 0: nada). | `gen_luma.py:250-251` |
| [40](05-nucleo-pantalla-teclado-vigia.md#4-modelo-de-imagen-pedido-40-mostrar) | Mostrar una nube (j11 = dirección, j12 = bytes). | `gen_luma.py:983` |
| [41](05-nucleo-pantalla-teclado-vigia.md#8-esperar-un-evento-pedido-41) | Esperar un evento en `EV` con plazo j12 (ms; -1: sin plazo). | `gen_formas.py:288-292` |
| [42](04-nucleo-abi-de-pedidos.md#96-familia) | Prioridad propia (j12 = 1: la más baja; 0: normal). | `gen_formas.py:341-343` |
| [43](05-nucleo-pantalla-teclado-vigia.md#59-título-pedido-43) | Título de la ventana (j11 = texto, j12 = bytes). | `gen_leer.py:1984-1985, 6277` |
| [44](05-nucleo-pantalla-teclado-vigia.md#9-sonido-pedido-44) | Mensaje MIDI de 3 bytes en j11 (`estado | nota<<8 | velocidad<<16`). | `gen_leer.py:6348-6353, 6358` |
| [47](05-nucleo-pantalla-teclado-vigia.md#74-copiar-pedido-47) | Portapapeles del anfitrión (j11 = texto, j12 = bytes). | `gen_leer.py:5946` |

Las etiquetas de la [casa](04-nucleo-abi-de-pedidos.md#102-de-etiqueta-a-nombre-de-archivo) se guardan en el anfitrión con el nombre igual a los bytes de la etiqueta en hexadecimal
(por ejemplo `formas` → `666f726d6173`) (`razar/cuerpo/retrato_organos.py:41, 46`; `razar/cuerpo/luma.sh:57`).

## 10.2 Geometría de la pantalla

### 10.2.1 Constantes

| Nombre | Valor | Qué mide | Fuente |
|---|---|---|---|
| `FW`, `FH` | 160, 100 | Pantalla propia de las formas (4 × 2 habitaciones de 40 × 50 celdas). | `gen_luma.py:52`; `gen_formas.py:38-40` |
| `ZOOM` | 2 | Escala de las formas en la pantalla compartida (criterio). | `gen_luma.py:53` |
| `PANEL_H` | 149 | Alto del panel en celdas. Justificado en el código con una medición de la pantalla del anfitrión (área de trabajo 738 px, marco 39 px: 2 × (200 + 149) + 39 = 737). | `gen_luma.py:54-61` |
| `SW`, `SH` | 640, 349 | Pantalla compartida: `FW·ZOOM + 320`, `200 + PANEL_H`. | `gen_luma.py:62` |
| `WX0` | 320 | Columna donde empieza el mundo de las criaturas. | `gen_luma.py:64` |
| `K` | 2 | `min(1280 // SW, 800 // SH)`: puntos finos por celda. | `gen_luma.py:70` |
| `FSW`, `FSH` | 1280, 698 | Pantalla fina que se muestra. | `gen_luma.py:71` |
| `PY`, `PH`, `PW` | 200, 149, 640 | Fila donde empieza el panel, su alto y su ancho (tupla `g["PANEL"]`). | `gen_luma.py:85`; `gen_leer.py:1990` |

La construcción afirma `ZOOM == 2 and K == 2`; si no, falla (`gen_luma.py:967`). Si la pantalla del anfitrión es más
baja que 737 px la ventana excede el área disponible (el código no lo corrige).

### 10.2.2 Regiones

Coordenadas en celdas de la pantalla compartida (640 × 349); cada celda se muestra como K × K = 2 × 2 puntos finos.

| Región | x | y | Contenido | Fuente |
|---|---|---|---|---|
| Formas | 0–319 | 0–199 | Pantalla de las formas (160 × 100) a doble tamaño con contornos Scale2x. | `gen_luma.py:968-969` |
| Lluvia superior | 320–639 | 0–199 | Imagen guardada de la lluvia (`RTBR`), filas de lluvia 0–21. | `gen_leer.py:6944-6950` |
| Panel izquierdo | 0–319 | 200–348 | Conversación y línea en escritura (puntos finos). | `gen_leer.py:6487-6518` |
| Panel derecho | 320–639 | 200–348 | Filas de lluvia 22–37 (puntos finos). | `gen_leer.py:6953-6962` |

Con la vista de música activa (Tab), las filas 0–199 de todo el ancho muestran el rollo de música en lugar de formas
y lluvia ([§10.7](#107-vista-de-música-tab)).

### 10.2.3 Memorias de imagen

Todas son [nubes `NUBE` v3](05-nucleo-pantalla-teclado-vigia.md#41-formato-nube-versión-3-lo-que-lee-el-núcleo) con encabezado de 28 bytes. Bytes del encabezado (`gen_luma.py:881`;
`gen_formas.py:225`; `gen_vida.py:222-223`):

| Desplazamiento | Tamaño | Valor | Uso verificado |
|---|---|---|---|
| 0 | 4 | `NUBE` | Se compara como `0x4542554E` (`gen_comer.py:476`). |
| 4 | 1 | 3 | Versión; se exige 3 al leer (`gen_comer.py:476`). |
| 5 | 4 | `00 00 80 3F` | (Float 1,0; significado no verificado.) |
| 9 | 2 | 0 | Cantidad de huesos; al leer se saltan 42 bytes por hueso (`gen_comer.py:477-479`). |
| 11 | 1 | 1 | Cantidad de niveles (debe ser ≠ 0) (`gen_comer.py:479`). |
| 12 | 4 | `00 00 80 3F` | (Float 1,0; significado no verificado.) |
| 16 | 8 | 0 | (No verificado.) |
| 24 | 2 | ancho | u16 LE. |
| 26 | 2 | alto | u16 LE. |

A continuación: `ancho·alto/8` bytes de bits de celda (todos en 1 en las pantallas) y `3·ancho·alto` bytes RGB.

| Memoria | Dimensiones | Dirección | Fuente |
|---|---|---|---|
| Nube de las formas | 160 × 100 | `CLOUD = ROOM + 4`; `RGB` alineado a 8. | `gen_luma.py:78-82` |
| Pantalla compartida (`scloud`) | 640 × 349 (27 920 bytes de bits, 670 080 de RGB) | Siguiente múltiplo de `0x10000` tras las formas, `+4`. El RGB de su fila 0 es `SRGB = g["PANEL"][3]`. | `gen_luma.py:83-86` |
| Pantalla fina (`fcl`) | 1280 × 698 (111 680 de bits, 2 680 320 de RGB) | Siguiente múltiplo de `0x10000`, `+4`; RGB en `frgb`. | `gen_luma.py:87-91` |
| Panel fino (`FPL`) | 1280 × 298 puntos (1 144 320 bytes RGB, sin encabezado) | `frgb + 3·FSW·FSH`. | `gen_luma.py:92-94` |
| Imagen de la lluvia (`RTBR`) | 320 × 200 (192 000 bytes RGB + 64) | `r_alloc` en `r_rain_init`. | `gen_leer.py:6855` |

Los bits de la nube fina se ponen en 1 una vez en `init_tail` (`gen_luma.py:879-888`).

### 10.2.4 Composición de un cuadro (`v_show`)

`v_show` se llama una vez por cuadro desde el bucle (`gen_formas.py:326-327`) y además, fuera del cuadro, cada vez
que un pensamiento del cuerpo entra al [flujo](#1055-flujo-de-la-mente-d_flb) (`gen_leer.py:5225`). Pasos, en orden (`gen_luma.py:964-983`):

1. [`r_mus_frame`](#107-vista-de-música-tab). Si devuelve `j0 = 1` (vista de música), saltar al paso 5.
2. `v_r_fill`: las filas 0–199 de la pantalla compartida, todo el ancho, en `(0x14, 0x22, 0x26)`; luego los estratos
   de hábitat sobre x 320–639 según la cámara ([§10.12.8](#10128-realimentación-con-las-formas), `gen_luma.py:540-568`) (`gen_vida.py:1645-1676`).
3. `contour2x(RGB de las formas, 160, 100, paso 160 → RGB compartido, paso 640)`: las formas a doble tamaño.
4. Si hay criaturas (`N > 0`): `r_rain_life(j2 = registro 0, j3 = N·CSZ)`. Luego `r_rain_top`: copia `RTBR` sobre
   x 320–639, filas 0–199 (sólo si existe la [habitación de la palabra](09-luma-conversacion-y-respuesta.md#21-la-sala-de-la-palabra-dlr-32768-bytes), `DLR ≠ 0`).
5. `r_panel` (redibuja sólo si cambió su huella, [§10.5.2](#1052-huella-y-protocolo-de-redibujo-r_panel)).
6. `r_rain_bottom` (repone las filas de lluvia del panel si el panel se borró).
7. `contour2x(RGB compartido, 640, 200, paso 640 → frgb, paso 1280)`: las filas 0–199 a 1280 × 400 puntos finos.
8. Copia de `FPL` (1280 × 298 puntos) a `frgb + 3·1280·400`, de a 8 bytes.
9. [Pedido 40](05-nucleo-pantalla-teclado-vigia.md#4-modelo-de-imagen-pedido-40-mostrar) con `j11 = fcl`, `j12 = 28 + FSW·FSH/8 + 3·FSW·FSH = 2 792 028` bytes.

Las filas 200–348 de la pantalla compartida no se muestran: el panel se dibuja directamente en `FPL` ([§10.5.1](#1051-superficie-y-trazado)).

Lo que se redibuja selectivamente es la lluvia (sólo las celdas que cambian) y el panel (sólo si cambia su huella);
las formas, los dos escalados y el pedido 40 se ejecutan en cada cuadro.

### 10.2.5 Contorno ×2 (`r_contour`)

Parámetros en variables: `CSRC`, `CSW`, `CSH`, `CSS` (origen, ancho, alto, puntos por fila) y `CDST`, `CDS` (destino y
puntos por fila); escribe `2·CSW × 2·CSH` puntos (`gen_luma.py:822-875`). Para cada punto `P` con vecinos `A` (arriba),
`D` (abajo), `I` (izquierda), `R` (derecha), donde un vecino fuera del borde es `P` mismo, y comparando colores de 24
bits:

| Cuarto | Condición | Color |
|---|---|---|
| Superior izquierdo | `I = A` y `I ≠ D` y `A ≠ R` | `A`; si no, `P` |
| Superior derecho | `A = R` y `A ≠ I` y `R ≠ D` | `R`; si no, `P` |
| Inferior izquierdo | `D = I` y `D ≠ R` y `I ≠ A` | `I`; si no, `P` |
| Inferior derecho | `R = D` y `R ≠ A` y `D ≠ I` | `D`; si no, `P` |

Es el algoritmo Scale2x (EPX).

## 10.3 Ciclo de cuadros y eventos

### 10.3.1 Bucle principal

Variables: `REMAIN` (ms que quedan del cuadro), `FOREVER` (esperar sin plazo), `BLEFT`, `CHANGED`
(`gen_formas.py:286-306`).

1. `main`: plazo = `REMAIN`, o -1 si `FOREVER`. [Pedido 41](05-nucleo-pantalla-teclado-vigia.md#8-esperar-un-evento-pedido-41) con `j11 = EV`. `BLEFT = j12` devuelto.
2. `j13 < 0` → `0BADh` y fin. `j13 = 0` (sin evento) → `main_time`. Si no, `CHANGED = 0`, `r_handle`; si `FOREVER` y
   no cambió nada, volver a `main`; si `FOREVER` y cambió, `FOREVER = 0` y cuadro; si no `FOREVER`, seguir esperando
   lo que queda (`BLEFT`) o cuadro si llegó a 0.
3. `main_time`: si `BLEFT ≠ 0` (el núcleo la despertó sin evento) → `r_read_poll`, [`r_host_eat`](#10114-protocolo-r_host_eat), volver a esperar lo
   que queda (`gen_formas.py:300-304`). Si `BLEFT = 0`: con `FOREVER = 0` → cuadro; con `FOREVER ≠ 0` (una espera sin
   plazo que terminó sin evento) el programa se detiene con `j0 = WINSRUN` (`gen_formas.py:305-306`).
4. `frame` (`gen_formas.py:307-356`): `r_read_poll`; `r_step` (formas); `r_meal_step` (comida); `v_frame`
   (criaturas); si nada se mueve ni hay forma tomada y `EXPLORE ≠ 0`, `r_explore_frame`; dibujo de formas
   (`r_fill`, `r_draw_ghosts`, `r_draw_all`), `r_nombre_draw`, `r_draw_meal`, `v_show`; `FRAMES += 1`.
5. Prioridad: si `SEEN = 0` y `GAPME = 0`, `GAPME = 1` y [pedido 42](04-nucleo-abi-de-pedidos.md#96-familia) (`j12 = 1`); si `SEEN ≠ 0` y `GAPME ≠ 0`,
   `GAPME = 0` y pedido 42 (`j12 = 0`) (`gen_formas.py:340-344`).
6. Si algo se mueve (`MOVING`, fantasmas `GHN`, `EXPLORE` sin forma tomada, o `MEALPH ≠ 0`) → `r_dlg_mind`,
   `REMAIN = 33`, volver a `main`.
7. Si no (`frame_forever`): `r_hungry`; si empezó una comida, como 6. Si no, [`r_free`](08-luma-cuerpo-procesos-y-casa.md#44-libertad-elección-de-actos-r_free) ([§10.8.12](#10812-actos-libres-relacionados)) y como 6
   (`gen_formas.py:357-361`).

Con la construcción por defecto (`free`), el paso 7 siempre continúa: hay un cuadro cada `FRAME_MS = 33` ms
(`gen_formas.py:63, 356, 361`).

### 10.3.2 Registro de evento

[`EV = 0x140`](05-nucleo-pantalla-teclado-vigia.md#61-registro-de-evento-32-bytes) (`gen_formas.py:102`): `+0` tipo, `+8` x, `+16` y, `+24` valor (botón, tecla o carácter).

| Tipo | Significado (según el código que lo trata) | Fuente |
|---|---|---|
| 1 | Puntero movido | `gen_formas.py:395` |
| 2 | Botón abajo (`+24`: botón; 2 = derecho) | `gen_formas.py:393, 403-418` |
| 3 | Botón arriba | `gen_formas.py:394, 419-431` |
| 4 | Tecla (`+24`: código virtual) | `gen_formas.py:396, 446-461` |
| 5 | Ventana cerrada | `gen_formas.py:387-390` |
| 6 | (No tratado por este programa salvo para no marcar presencia; significado en [cap. 05](05-nucleo-pantalla-teclado-vigia.md#62-tipos-de-evento), `so/pantalla.inc:499, 606-611`.) | `gen_formas.py:380` |
| 7 | Carácter escrito (`+24`: punto de código Unicode) | `gen_formas.py:398, 401-402` |
| 8 | Ventana en uso o no (`+24` → `SEEN`) | `gen_formas.py:375-376` |

### 10.3.3 Despacho (`r_handle` en Luma)

1. Tipo 8: `SEEN = CHANGED = EV+24`; fin.
2. Tipos distintos de 1, 5 y 6: `SEEN = CHANGED = 1` (alguien está con ella).
3. `v_event` (abajo); si devuelve 1, el evento fue de las criaturas y termina.
4. Tipo 5: `r_read_end`; fin del programa con `j0 = WINSRUN`.
5. Tipos 2, 3, 1, 4, 7 → `h_down`, `h_up`, `h_move`, `h_key`, `h_char` (`gen_formas.py:372-402`).

`v_event` (`gen_luma.py:996-1019`):

- Tipo 5: `v_calm` (guarda los léxicos), devuelve 0.
- Tipo 4: `ve_gesture` (las criaturas caminan `WALK = PMAXF/33 + 1` cuadros, `QUIET = 0`, `CHANGED = 1`), devuelve 0.
- Tipos 1–3: `x` e `y` (si ≥ 0) se dividen por `K` (de puntos finos a celdas compartidas).
- Si `x < 0` → 0 (formas). Si hay forma tomada (`GRAB ≠ 0`) o `x < 320` → las coordenadas se dividen por `ZOOM`
  (celdas de las formas) y devuelve 0.
- Si no (lado derecho): tipo 2 → `ve_gesture`; devuelve 1.
- Los tipos 6 y 7 llegan a esta prueba sin división (el 8 ya terminó en `r_handle`); su `+8` lo fija el núcleo
  (`so/pantalla.inc:600-611`).

## 10.4 Lluvia hexadecimal

### 10.4.1 Constantes y geometría

| Nombre | Valor | Definición | Fuente |
|---|---|---|---|
| `PNR` | 16 | `(PH − 9) // 9 + 1`: renglones del panel. | `gen_leer.py:1991` |
| `RLW` | 52 | Columnas de la lluvia (criterio: letras de un renglón de media pantalla). | `gen_leer.py:6434` |
| `RTOP` | 22 | `PY // 9`: filas de lluvia sobre el panel. | `gen_leer.py:6434` |
| `RNLN` | 38 | `RTOP + PNR`: filas totales. | `gen_leer.py:6435` |
| `RQ` | 9 | `RNLN // 4`: filas brillantes detrás de la gota. | `gen_leer.py:6531` |
| `RHW` | 320 | `PW − PW // 2`: ancho de la imagen superior. | `gen_leer.py:6531` |
| `RSTART` | 8 | Una columna sin gota inicia una cuando `(byte + RAINN + columna) & 7 = 0` (criterio, no medido). | `gen_leer.py:6530-6531, 6925` |
| `XR` | 322 | `PW // 2 + 2`: x de la columna 0. | `gen_leer.py:6433` |

Celda `(c, r)`: rectángulo de 5 × 7 celdas con origen `x = 322 + 6c`, `y = 2 + 9r`
(`gen_leer.py:6870, 6874`). Las filas 0–21 caen en `RTBR`; las 22–37 en el panel fino, con el mismo paso de 9
(`gen_leer.py:6860-6867`).

Colores: `MATRIX = ((0, 255, 65), (0, 143, 17), (255, 255, 255))` (`gen_leer.py:557`); `r_rain_cell` asigna a la
clase 0 `MATRIX[2]`, a la 1 `MATRIX[0]` y a la 2 `MATRIX[1]` (`gen_leer.py:6881-6885`):

| Clase `RCK` | Color | Uso |
|---|---|---|
| 0 | `(255, 255, 255)` | La gota (cabeza). |
| 1 | `(0, 255, 65)` | Las `RQ` filas que acaba de dejar. |
| 2 | `(0, 143, 17)` | La estela. |

### 10.4.2 Estado

| Variable | Contenido | Fuente |
|---|---|---|
| `RAINR` | Memoria de `RNLN·RLW + RLW + 64` = 2 092 bytes: rejilla de dígitos `RNLN × RLW` (fila mayor, inicial `' '` = 32), luego un byte por columna con la fila de su gota (255 = sin gota). | `gen_leer.py:6846-6853` |
| `RTBR` | Imagen RGB 320 × 200 de la parte superior, inicial negra. | `gen_leer.py:6855-6857` |
| `RAINN` | Pasos de lluvia dados desde el nacimiento. | `gen_leer.py:6941` |
| `RBAD` | 1 si el panel se borró y hay que reponer sus filas de lluvia. | `gen_leer.py:6857, 6484` |
| `RCX`, `RCY`, `RCK` | Argumentos de `r_rain_cell`. | `gen_leer.py:6868` |

`r_rain_init` crea ambas memorias una sola vez (si `RAINR = 0`) y pone `RBAD = 1`.

### 10.4.3 Paso de lluvia (`r_rain_push`)

Entrada: `j2` = bytes, `j3` = cantidad. Algoritmo (`gen_leer.py:6916-6943`):

```
r_rain_init
mientras RNL > 0:
    n = min(RNL, 26)
    para c en 0..51:
        b = RNP[((c >> 1) + RAINN) mod n]
        d = gota[c]
        si d = 255:
            si (b + RAINN + c) & 7 ≠ 0: siguiente c
            d = 0
        si no:
            d = d + 1
            si d ≥ RNLN + RQ + 1 (48): gota[c] = 255; siguiente c
        gota[c] = d
        si d < RNLN:
            dígito = (c par) ? b >> 4 : b & 15          ; '0'..'9', 'A'..'F'
            rejilla[d][c] = dígito
            r_rain_cell(c, d, 0)
        si 0 ≤ d − 1 < RNLN:  r_rain_cell(c, d − 1, 1)
        si 0 ≤ d − 10 < RNLN: r_rain_cell(c, d − 10, 2)
    RNP += 26; RNL −= 26; RAINN += 1
```

Dos columnas contiguas `2k`, `2k+1` muestran los dos dígitos del mismo byte. Una gota sigue bajando, invisible,
hasta la fila 47 para que su tramo brillante pase a estela. Cada paso redibuja a lo sumo 3 celdas por columna
(156 por paso).

`r_rain_cell(c, r, k)` (`gen_leer.py:6868-6895`): pinta de negro el bloque de 5 × 7; si el carácter de la rejilla es
`' '` termina; si no, toma sus 35 bits de `r_glyph` (fila por fila, bit menos significativo primero) y pinta cada bit
en 1 con el color de la clase `k`. Cada punto pasa por `r_rain_px`: `y ≥ 200` → `r_splot` (panel fino, K × K puntos);
`0 ≤ y < 200` y `320 ≤ x < 640` → `RTBR`; fuera, nada.

### 10.4.4 Qué bytes caen

| Fuente | Bytes | Cuándo | Fuente del código |
|---|---|---|---|
| Criaturas | 26 bytes de la tabla de registros (N · 384 bytes), a partir de `min((RAINN·26) mod total, total − 26)` | En cada `v_show` con `N > 0` y total ≥ 26 | `gen_luma.py:971`; `gen_leer.py:6910-6915` |
| Pensamientos | El texto que entra al flujo, recortado | Cada [`r_flujo_put`](#1055-flujo-de-la-mente-d_flb) | `gen_leer.py:7023` |
| Ensayos de las formas | La línea de archivo de 112 bytes | Cada línea escrita al [anillo `RING_F`](#1013-anillos-del-presente) | `gen_luma.py:790-791`; `gen_leer.py:7005-7010` |

No hay temporizador propio: la lluvia sólo avanza con estos eventos.

### 10.4.5 Imagen superior y filas del panel

- `r_rain_top` (`gen_leer.py:6944-6950`): si `DLR ≠ 0`, copia `RTBR` (320 × 200) a `SRGB + 3·320`, fila por fila.
- `r_rain_bottom` (`gen_leer.py:6953-6962`): si `DLR ≠ 0`, `RBAD ≠ 0` y `RAINR ≠ 0`: `RBAD = 0`; para cada fila
  22–37 y cada columna, con `d = gota[c]`: clase 2 si `d = 255` o `d < fila`; 0 si `d = fila`; 1 si
  `d − fila < 10`; 2 en otro caso; y `r_rain_cell`.

### 10.4.6 Archivo `dados`

`r_rain_dice` borra y reescribe la etiqueta [`dados`](09-luma-conversacion-y-respuesta.md#18-la-lluvia-como-dados) con la rejilla completa (1 976 bytes de caracteres) cada vez que
lo escrito [se envía al pensador](09-luma-conversacion-y-respuesta.md#32-cuerpo--pensador-r_pens_ask) (`gen_leer.py:6896-6909, 3624`). El canto del cardumen lo usa como fuente de azar
([cap. 07](07-razar-cardumen-canto-hilos.md#28-dados-y-cantado-contrato-con-quien-lo-lanza)).

## 10.5 Panel

### 10.5.1 Superficie y trazado

- `r_splot(j1, j2)` (`gen_leer.py:6439-6456`): fuera de `[0, 640) × [0, 349)` no hace nada; `y < 200` → un punto en
  `SRGB`; `y ≥ 200` → K × K puntos en `FPL` en `(K·x, K·(y − 200))`.
- `r_fsplot(j1, j2)` (`gen_leer.py:6457-6464`): un punto fino si `0 ≤ x < 1280` y `400 ≤ y < 698`.
- `r_panel_clear`: `FPL` entero a 0 (`gen_leer.py:6465-6468`).
- Mientras `D_FLP = 1`, `r_tplot` dirige los puntos de letra a `r_splot` y `r_tfplot` a `r_fsplot`; con `D_FLP = 0`,
  a la pantalla de las formas (`gen_leer.py:1750-1758`).

### 10.5.2 Huella y protocolo de redibujo (`r_panel`)

Condición previa: [`DLR ≠ 0`](09-luma-conversacion-y-respuesta.md#21-la-sala-de-la-palabra-dlr-32768-bytes) y [`NMROOM ≠ 0`](#1063-nombre) (`gen_leer.py:6475`). Huella (`gen_leer.py:6475-6482`):

```
h = 0;  mezclar(v): h = h · 1000003 + v
para v en [D_FLC, D_FL, D_OUTL, D_INL, D_SCR0]: mezclar(v)
para (buf, n) en [(D_OUT, D_OUTL), (D_IN, D_INL), (D_FLB, D_FL)]:
    mezclar(buf[0]); si n ≠ 0: mezclar(buf[n − 1])
```

Si `h = D_FLH` no se hace nada. Si no: `D_FLH = h`; `r_panel_clear`; `D_FLP = 1`; `r_dlg_panel`; `D_FLP = 0`;
`RBAD = 1`. Un cambio que no altere esos campos no provoca redibujo.

### 10.5.3 Diseño del lado izquierdo (`r_dlg_panel`)

| Nombre | Valor | Fuente |
|---|---|---|
| `X0` | 2 | `gen_leer.py:6433` |
| `Y0` | 202 (`PY + 2`) | `gen_leer.py:6433` |
| `WID` | 316 (`PW // 2 − 4`) | `gen_leer.py:6433` |
| `SHOWN` | 12 (`PNR − 4`) | `gen_leer.py:1992` |
| `INMAX` | 52 (`WID // 6`) | `gen_leer.py:6436` |

Procedimiento (`gen_leer.py:6487-6518`), color `(0, 255, 65)`:

1. Recorre su respuesta única (`lj_rlen`/`lj_rptr`, [cap. 09](09-luma-conversacion-y-respuesta.md#197-respuesta-única-y-flujo); sin ella, `D_OUT`; `gen_leer.py:5237-5244`, `gen_leer.py:6491`), partiéndola en renglones de ancho
   `WID` con [`r_txt`](#1054-letras-r_txt). El renglón número `t` se dibuja en `y = 202 + 9·(t − D_SCR0)` sólo si
   `0 ≤ t − D_SCR0 < 12`; los demás sólo se miden. `D_NL` = total de renglones.
2. Si `D_SCR0 > 0`: un punto en `(318, 202)` (hay más arriba). Si `D_SCR0 + 12 < D_NL`: un punto en `(318, 301)`.
3. Renglones 12 y 13: vacíos (el código que dibujaba el último pensamiento está saltado por `jjmp dpl_in2`,
   `gen_leer.py:6505`).
4. Renglón 14 (`y = 328`): lo que se escribe, `D_IN`; si mide más de 52 bytes se muestran sus últimos 52 bytes.
   Cursor: 5 puntos en `y = 336` desde `x = 2 + ancho dibujado`.

Cada línea nueva de la conversación escrita con [`r_dlg_write`](09-luma-conversacion-y-respuesta.md#161-r_dlg_write) (j1: 0 `vos: `, 1 `luma: `, 2 silencio) pone
`D_SCR0 = 0` (`gen_leer.py:2034-2036`).

El lado derecho del panel lo ocupa la lluvia. `r_flujo_walk` (texto del flujo a la derecha) está definida pero no se
llama desde ningún punto (`gen_leer.py:6967`).

### 10.5.4 Letras (`r_txt`)

`r_txt(j1, j2 celda, j3 texto UTF-8, j4 bytes, j5 ancho máximo o 0, j7 = 1 dibuja / 0 mide)` → `j0` celdas de
avance, `j1` bytes consumidos (`gen_leer.py:1837-1915`). Una letra propia de 5 × 7 avanza 6 celdas; un byte de
continuación UTF-8 suelto no ocupa celda. En el panel (`D_FLP = 1`) se usa primero la letra aprendida de 8 o 16 × 16
puntos del [libro de letras](08-luma-cuerpo-procesos-y-casa.md#8811-letras-abecedario) (`r_letra_get`; si sólo existe la propia, `r_letra_fine` la aprende una vez); se dibuja
por trazos rectos (cobertura voraz, `lv_make`, guardados en `LE_VEC = 144` del registro de la letra) recorridos con
Bresenham en puntos finos: un punto de libro `v` va a `(2v + 1)·(w/2)·K / (2w)` puntos finos en horizontal y
`(2v + 1)·8·K / 32` en vertical, y avanza `w/2 + 1` celdas (`gen_leer.py:1765-1836, 1856-1903`). Una letra aprendida
sin tinta se dibuja con la propia.

### 10.5.5 Flujo de la mente (`D_FLB`)

Memoria de `FL_CAP = 2048` bytes en la [habitación de la palabra](09-luma-conversacion-y-respuesta.md#21-la-sala-de-la-palabra-dlr-32768-bytes) (`gen_leer.py:306-309`). Cada entrada:

| Desplazamiento | Tamaño | Contenido |
|---|---|---|
| 0 | 1 | Clase: 1 pensamiento, 2 ensayo de forma rechazado, 3 ensayo con motivo 0 ("replaced"). |
| 1 | 1 | Renglones de panel que ocupa (medidos al llegar). |
| 2 | n | Texto; `\n` y `\r` reemplazados por espacio. |
| 2 + n | 1 | `\n`. |

Contadores: `D_FL` bytes usados, `D_FLC` entradas llegadas, `D_FLT` renglones totales.

`r_flujo_put(j2 texto, j3 bytes, j4 clase)` (`gen_leer.py:7014-7050`):

1. `n = min(j3, 1000)`; quitar del final espacios y bytes 0; si queda 0, terminar.
2. [`r_rain_push(texto, n)`](#1043-paso-de-lluvia-r_rain_push).
3. Mientras `D_FL + n ≥ 2045` descartar la entrada más vieja (`r_flujo_drop`); si sólo había una, vaciar todo.
4. Copiar la entrada al final; `D_FLC += 1`.
5. Si `NMROOM ≠ 0`: medir sus renglones con `r_txt` (ancho 316, sin dibujar), guardarlos en el byte 1 y sumarlos a
   `D_FLT`; mientras `D_FLT ≥ 17`, descartar la más vieja.

`r_flujo_add` agrega el pensamiento `D_THK` (clase 1) si `DLR ≠ 0` (`gen_leer.py:7001-7004`); lo llama
`r_dlg_mind` cuando un pensamiento espera (`gen_leer.py:5554-5558`). `r_flujo_trial` agrega una línea de archivo
de formas con clase 2, o 3 si su motivo es 0, preservando `j1`–`j3` (`gen_leer.py:7005-7013`).

## 10.6 Teclado, nombre y despertar

### 10.6.1 Cadena de una tecla (tipo 4)

`h_key` (`gen_formas.py:446-461`) → `r_nombre_key` (`gen_leer.py:1953-1968`):

- Si `NMASK ≠ 0` (está preguntando su nombre): `CHANGED = 1`; Backspace (8) borra un carácter UTF-8 completo del
  nombre; Enter (13) con nombre no vacío → `r_nombre_keep`; cualquier tecla devuelve 1 (consumida).
- Si no: [`r_dlg_key`](09-luma-conversacion-y-respuesta.md#31-teclado-r_dlg_key-r_char). Si devuelve 1, la tecla termina ahí; si 0, pasa a las acciones de las formas.

`r_dlg_key` (`gen_leer.py:5908-5939`). Sin [`DLR`](09-luma-conversacion-y-respuesta.md#21-la-sala-de-la-palabra-dlr-32768-bytes) devuelve 0. Con `DLR`:

| Código | Acción | Devuelve |
|---|---|---|
| 8 (Backspace) | Si `D_INL > 0`, borra el último carácter UTF-8 (sus bytes de continuación incluidos). | 1 |
| 13 (Enter) | Si `D_INL > 0`, [`r_pens_ask`](09-luma-conversacion-y-respuesta.md#32-cuerpo--pensador-r_pens_ask) (envía lo escrito; cap. 08/09). | 1 |
| 9 (Tab) | `r_mus_tab` ([§10.7](#107-vista-de-música-tab)). | 1 |
| 33 (Re Pág) | `D_SCR0 = max(0, D_SCR0 − 4)`. | 1 |
| 34 (Av Pág) | `D_SCR0 = min(D_SCR0 + 4, max(0, D_NL − 12))`. | 1 |
| 32, 48–57, 65–90, 96–111, 186–226 | Teclas que escriben: no hacen nada aquí (el carácter llega como [evento 7](#1062-caracteres-tipo-7-r_char)). | 1 |
| Cualquier otra | — | 0 |

En todos los casos que devuelven 1 pone `CHANGED = 1`.

Acciones de las formas (`gen_formas.py:82-97, 454-506`), sobre la forma enfocada `FOCUS`; con `DLR ≠ 0` sólo son
alcanzables las de códigos que `r_dlg_key` no toma:

| Código | Acción | Alcanzable en Luma |
|---|---|---|
| 0x25 / 0x27 | Espejo sí / no | Sí |
| 0x26 / 0x28 | Volteo no / sí | Sí |
| 0x2D / 0x2E | Mostrar / ocultar (fantasma) | Sí |
| 0x24 / 0x23 | Enfocar la primera / la última | Sí |
| 0xBB, 0x6B / 0xBD, 0x6D | Doble / mitad (un paso, nunca más allá de ±1) | No |
| 0x57 / 0x48 | Estirar en x / en y | No |
| 0x4F / 0x43 | Abrir / plegar | No |
| 0x21 / 0x22 | Al frente / al fondo | No |
| 0x42 / 0x45 | Crecer de nuevo / crecer entera | No |
| 0x0D / 0x44 | Habilitar / deshabilitar mutación | No |

Toda tecla que llega a las formas llama antes a `r_gesture` ([§10.8.8](#1088-gesto)).

### 10.6.2 Caracteres (tipo 7, `r_char`)

`r_char(j3 = punto de código)` (`gen_leer.py:5940-5958`):

1. `j3 = 3` (Ctrl+C): si `DLR ≠ 0` y la última línea (`lj_rlen`, `lj_rptr`, [cap. 09](09-luma-conversacion-y-respuesta.md#197-respuesta-única-y-flujo)) no está vacía, [pedido 47](05-nucleo-pantalla-teclado-vigia.md#74-copiar-pedido-47) con
   ella. Fin.
2. Si `PKID ≠ 0` y `PREADY = 0` (el pensador existe pero no está listo): se descarta. Fin.
3. `j3 < 32` o `j3 = 127`: se descarta.
4. Si `NMROOM ≠ 0` y `NMASK ≠ 0`: `ch_put` en el nombre (`NMROOM + 64`, capacidad 3000). Si no, si `DLR ≠ 0`:
   `ch_put` en `D_IN` (capacidad 1000).
5. `r_letra_learn` ([cap. 09](09-luma-conversacion-y-respuesta.md#31-teclado-r_dlg_key-r_char)) y `CHANGED = 1`.

`ch_put` (`gen_leer.py:5959-5974`) codifica en UTF-8 (1 byte si `< 0x80`; 2 si `< 0x800`; 3 si `< 0x10000`; 4 en otro
caso) sólo si `longitud + 4 < capacidad`. Ctrl+V lo resuelve el núcleo como caracteres escritos ([cap. 05](05-nucleo-pantalla-teclado-vigia.md#73-pegado-ctrlv)).

### 10.6.3 Nombre

- `r_nombre_load` (`gen_leer.py:1916-1936`): memoria de 4096 bytes en `NMROOM`: `+0` el texto `COMO ME LLAMO?`,
  `+32` la etiqueta [`nombre`](08-luma-cuerpo-procesos-y-casa.md#852-nombre), `+64` el nombre, `+3584` variables de `r_txt`. Lee hasta 1000 bytes de `nombre`; el
  nombre es su primera línea (hasta `\n` o `\r`). Vacío o ausente → `NMASK = 1`.
- `r_nombre_draw` (`gen_leer.py:1937-1952`), color `(236, 236, 228)`, sobre la pantalla de las formas: preguntando, la
  pregunta en `(4, 6)`, lo escrito en `(4, 18)` y cursor de 5 puntos en `y = 26`; si no, el nombre en `(2, 2)`.
- `r_nombre_keep` (`gen_leer.py:1969-1983`): escribe en `nombre` el nombre, `\n`, un sello de 16 dígitos hex y `\n`
  (`NMLEN + 18` bytes). Sello: `s = (RNG xor j13 del pedido 35 con j11 = -1) · 0x9E3779B97F4A7C15`;
  `s = s xor (s >> 31)` (semántica del pedido 35 en [cap. 04](04-nucleo-abi-de-pedidos.md#96-familia)). Luego `NMASK = 0` y `r_nombre_titulo`.
- `r_nombre_titulo`: [pedido 43](05-nucleo-pantalla-teclado-vigia.md#59-título-pedido-43) con el nombre.

### 10.6.4 Despertar del pensador

Máquina de estados (`gen_leer.py:3583, 6225-6290`):

| Estado | Condición | Título de la ventana | Caracteres |
|---|---|---|---|
| Sin pensador | `PKID = 0` | El nombre | Se aceptan |
| Despertando | `PKID ≠ 0`, `PREADY = 0` | `Luma esta despertando: todavia no le escribas` (45 bytes, `r_esperando`) | Se descartan |
| Lista | `PREADY = 1` | El nombre (`r_lista` → `r_nombre_titulo`) | Se aceptan |

Transición a "Lista": `r_mus_from` recibe del proceso `PKID − 1` una palabra cuyo valor en `WBUF + 8` es 5; pone
`PREADY = 1` y ejecuta `r_lista`: borra y escribe la etiqueta [`lista`](08-luma-cuerpo-procesos-y-casa.md#54-la-señal-lista) con los 5 bytes `lista`, `CHANGED = 1`, título
con el nombre. El paso a "Despertando" ocurre al lanzar el pensador (`r_pens_launch`, [cap. 08](08-luma-cuerpo-procesos-y-casa.md#53-secuencias)). Mientras despierta,
[`r_dlg_key`](09-luma-conversacion-y-respuesta.md#31-teclado-r_dlg_key-r_char) sigue tomando sus teclas, pero `D_IN` no recibe caracteres.

## 10.7 Vista de música (Tab)

Constantes: `MU_N = 5`, `MU_FRAMES = 4` cuadros por paso (criterio), `MU_WORDS = ((256 + 125)·25 + 63) // 64`
(`gen_leer.py:376-380`). Estados `MU_ST`: 0 quieto, 1 naciendo, 2 pensando, 3 recibiendo, 4 tocando
(`gen_leer.py:6295-6312`; el canto mismo, [cap. 07](07-razar-cardumen-canto-hilos.md#27-el-canto-con-canta)).

- `r_mus_tab` (`gen_leer.py:6356-6360`): `MU_VIEW ^= 1`; `MU_DIRTY = 1`; al salir de la vista, [pedido 44](05-nucleo-pantalla-teclado-vigia.md#9-sonido-pedido-44) con
  `0x7BB0` (control 123, todas las notas apagadas).
- `r_mus_frame` (`gen_leer.py:6361-6373`): con `MU_ST = 4`, cada 4 cuadros `MU_T += 1` y, si la vista está activa,
  `r_mus_notes` (pedido 44: `0x90 | nota<<8 | 100<<16` al despertar una pieza, `0x80 | nota<<8` al dormirse); al
  llegar `MU_T` a `MU_STEPS`, `MU_ST = 0`. Devuelve 1 si la vista está activa (y dibuja si `MU_DIRTY`).
- Nota de la pieza `j` (`gen_leer.py:6340-6343`): `x = j mod 5`, `y = j div 5`; `48 + 12y + (0, 2, 4, 7, 9)[x]`.
- `r_mus_draw` (`gen_leer.py:6374-6430`): filas 0–199 a negro; si `MU_STEPS = 0` o `MU_ST = 3` (recibiendo) no se
  dibuja el rollo, sólo el texto (`gen_leer.py:6379`); si no, para cada paso `t` y pieza `j` (0–24) despierta, un
  rectángulo de `x ∈ [t·640/pasos, (t+1)·640/pasos)` (al menos 1) e `y ∈ [(24 − j)·8, (24 − j)·8 + 8)`, verde
  `(0, 255, 65)` o blanco si `t = MU_T`. Encima, en blanco en `(4, 2)`: `nucleo: luma P0 viva | lectora
  leyendo|quieta | cardumen no nacio|escucha|piensa|canta paso T de N`.

## 10.8 Formas vivas

### 10.8.1 Población y registro de forma

`NF = 8` formas en `FORMS = 0x800`, 256 bytes cada una (`gen_formas.py:39, 104`). Habitación de la forma `f`: centro
`(20 + 40·(f mod 4), 25 + 50·(f div 4))` celdas (`gen_formas.py:267-274`).

| Campo | Desp. | Contenido | Campo | Desp. | Contenido |
|---|---|---|---|---|---|
| `F_OX`, `F_OY` | 0, 8 | Semilla (×256) | `F_FOLD` | 80 | Plegada |
| `F_FIRST` | 16 | Primera partícula | `F_SCALE` | 88 | −1, 0, +1 |
| `F_COUNT` | 24 | Partículas | `F_ASPECT` | 96 | −1, 0, +1 |
| `F_WORTH` | 40 | Valor (≥ 0 al mostrar) | `F_MIRROR`, `F_FLIP` | 104, 112 | Espejo, volteo |
| `F_GROWN` | 48 | Letras crecidas | `F_HIDDEN`, `F_DISABLED` | 120, 128 | Fantasma, en reposo |
| `F_GTICK` | 56 | Cuadros hasta la próxima letra | `F_CR`, `F_CG`, `F_CB` | 136–152 | Color |
| `F_MX`, `F_MY` | 64, 72 | Escala efectiva (×256) | `F_T` | 160 | Trazo (celdas) |
| `F_CX`, `F_CY` | 168, 240 | Centro de dibujo | `F_BMP` | 176 | Dirección de su mapa de bits: `BMPS + 512·f` (50 qwords, fila `y` bit `x`) |
| `F_S` | 184 | Celdas dibujadas por celda de receta (×256) | `F_REC` | 192 | Receta (32 bytes) |
| `F_COMP`, `F_NOV` | 224, 232 | Compresión, novedad (×1000) | `F_READ` | 248 | Campo de lectura del lector (sólo en Luma; uso en [cap. 06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)) |

Fuente: `gen_formas.py:141-144, 122, 272`; `gen_leer.py:618`. Partícula: 128 bytes, campos `hx hy px py vx vy k parent birth tx ty` en los
desplazamientos 0–80 (`gen_formas.py:131, 145`).

### 10.8.2 Receta

Byte 0 = longitud `n` (0–31, `LMAX = 31`), bytes 1–n = letras 1–15 (`gen_formas.py:49, 111`). En texto, cada letra
`v` se escribe como el byte `48 + v` (`'1'`–`'9'`, `':'`, `';'`, `'<'`, `'='`, `'>'`, `'?'`) y las posiciones sin
letra como `'.'`, siempre 31 caracteres (`r_put_rec`, `gen_formas.py:1049-1054`); `r_get_rec` acepta `'1'`–`'?'`
hasta el primer otro carácter (`gen_formas.py:1064-1071`). Las semillas se fijan al generar: la línea `organos <ruta>`
de [`razar/cuerpo/aprendido.txt`](08-luma-cuerpo-procesos-y-casa.md#23-entradas-leídas-al-generar) nombra un archivo cuyas líneas `organo <receta> = <puntaje>` se ordenan por puntaje
descendente (orden estable); las 8 primeras recetas son las semillas (`gen_formas.py:18-48`). Una forma sin receta
válida en [`formas`](#1089-archivos-de-las-formas) arranca de su semilla.

### 10.8.3 Crecimiento (`r_grow`)

En Luma la receta se dice primero "plana" (`r_flat`, [cap. 06](06-razar-lectura-y-organos.md#105-palabras--k--forma-k): `E` y un número 1–8 se expanden a la forma viva de ese
número) y `RD.grow_letter` toma las letras de esa versión plana (`gen_formas.py:599-614`;
`gen_leer.py:7176-7221`). Interpretación (`gen_formas.py:615-661`), con `GHEAD` el giro actual y las direcciones
`k = 0..3` = este, sur, oeste, norte:

| Letra | Efecto |
|---|---|
| 1–4 | Brazo de `ARM = 5` celdas en dirección `(letra − 1 + GHEAD) & 3`; la pluma queda en la punta. |
| 5–8 | La pluma vuelve a la semilla y salta 5 celdas en dirección `(letra − 5 + GHEAD) & 3`, con el `GHEAD` vigente, sin dibujar; luego `GHEAD = 0`. |
| 9 | Espeja todas las celdas existentes respecto de la columna de la semilla; la pluma también. |
| 10 | Brazo en dirección `(GHEAD − 1) & 3`. |
| 11 / 12 | `GHEAD −= 1` / `GHEAD += 1`. |
| 13 | Nada. |
| 14 (`E`) | En Luma: [célula](06-razar-lectura-y-organos.md#106-células-y-tejidos) `E g1 g2 t`; [engranaje](#109-engranajes) `(g1 − 9)·15 + g2 − 1`, tejido `t` (5: la pluma pasa por el engranaje; 6: el giro; 7: [el corazón](06-razar-lectura-y-organos.md#109-corazón-tejido-7); 8: lugar del lector, ocupa 4 letras más y no dibuja; otro: palabra que sólo transporta). |
| 15 | Brazo en dirección `(3 + GHEAD) & 3`. |

`r_cell` (`gen_formas.py:662-687`) crea una partícula por celda nueva dentro de la habitación de 40 × 50; su padre es
la celda anterior del brazo; si la forma se transforma, las partículas existentes conservan posición y velocidad.

Cuerpo (`gen_formas.py:695-713`, `570-591`): con la extensión `(w, h)` de las celdas,
`S = min(40·512 / (2(w−1) + 5), 50·512 / (2(h−1) + 5))`; `MX`, `MY` aplican escala (×2 o ÷2), estiramiento, espejo,
volteo y pliegue (0 si plegada); trazo `T = max(1, (min(|MX|,|MY|)·5 + 511) >> 9)`.

Paso de resortes por cuadro (`r_step`, `gen_formas.py:1173-1211`): una letra crece cada `GROW_FRAMES = 9` cuadros;
cada partícula crecida va hacia su destino `t = ancla + h·M >> 8` con `v += (t − p)·k >> 8`,
`v −= v·40 >> 8`, `p += v`; se asienta (`p = t`, `v = 0`) si `|t − p| ≤ REST` y `|v| ≤ REST`, con `REST = 32`
(`gen_formas.py:1198-1204`). `k` vale `K_BASE = 20`, o, mientras la forma está tomada con la [mano](#10810-mano),
`K_FAR + (K_NEAR − K_FAR)·D0/(D0 + d) = 8 + 672/(12 + d)`, con `d` la distancia Manhattan en celdas de la partícula al
punto tomado (`r_stiffen`, `gen_formas.py:61-62, 538-550`).

Dibujo (`gen_formas.py:1228-1317`): fondo `(0x1F, 0x4E, 0x5A)`; fantasmas del cuadro con color `(c + 2·fondo)/3`;
cada partícula crecida unida a su padre con pinceladas cuadradas de lado `T` cada `T/2`; la semilla de la forma
enfocada en blanco.

### 10.8.4 Juez

Superposición `O[i][j]` = celdas comunes de los mapas de bits (`r_overlap`, `gen_formas.py:717-724`). Para cada
forma con `C` celdas, `n` letras y `M = max_j O[i][j]` (`gen_formas.py:725-736`; `gen_leer.py:7171-7174`):

- `comp = C·100000 / (n·391)`, `nov = 1000 − 1000·M/C` (sólo para motivos y color).
- Valor en Luma: `L(C − M) − n·3907` milésimas de bit, con `L(k) = log2 C(2000, k)` (tabla `LTAB`).

`TOTAL` = suma de valores + la mejor lectura entre las formas (`r_read_max`, [cap. 06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)) (`gen_formas.py:746-767`).

Color (`gen_formas.py:771-784`): `PAL[f]·(600 + 400·valor/WMAX)/1000` por canal; en reposo, gris (promedio).
Paleta inicial: `FF6B6B, FF9F43, FFD93D, 6BCB77, 4DD0C8, 4D96FF, 9B7BFF, E07BE0` (`gen_formas.py:73-74`), que las
comidas y la pintura de Luma reemplazan ([§10.10](#1010-comida-de-nubes-despensa), [§10.8.12](#10812-actos-libres-relacionados)).

`r_judge(CAND como forma JF)` (`gen_formas.py:785-867`): crece el candidato en `CREG`, calcula
`JT2` = total con el candidato en lugar de `JF` (incluida la lectura, `r_read_cand`). Gana si
`JT2 + TIEOK > TOTAL`. Si pierde, motivo:

| Código | Texto | Condición (en orden; la última que aplica gana) |
|---|---|---|
| 5 | `no-better` | Por defecto. |
| 4 | `crowds` | Valor propio del candidato > el del padre. |
| 3 | `not-new` | `nov` del candidato < la del padre. |
| 2 | `longer` | `comp` del candidato < la del padre. |
| 1 | `longer,not-new` | Las dos anteriores. |
| 0 | `replaced` | (Ganó.) |
| 6 | `meal-climb` | Paso de escalada de una comida ([§10.10.4](#10104-fases-mealph)). |

Al perder: línea de archivo y fantasma del candidato en el cuadro. Al ganar: [`r_linaje`](08-luma-cuerpo-procesos-y-casa.md#883-linaje); línea de archivo con el
padre como perdedor y motivo 0; el candidato ocupa la receta; `r_regrow`; `F_GROWN` completo; `r_recompute`;
`EPOCH`, `WINS`, `WINSRUN` + 1; `RADIUS = 1`; `r_meal_won`; [tabla de probados](#1086-tabla-de-probados) vacía; recorrido nuevo; `formas`
reescrito; `j0 = 2`.

### 10.8.5 Mutaciones (Luma: las de `gen_comer.py`)

`r_count_k(n, tipo)` y `r_apply_k` (`gen_comer.py:120-220`). Tipos: 0 todo, 1 lo que trajo una comida, 2 digerir.
Grupos en orden (cada uno presente según el tipo):

| Grupo | Tipos | Operaciones | Resultado |
|---|---|---|---|
| Comida | 0, 1 (si `MLEN > 0`) | `1 + n + MLEN` | op 0: la receta de la comida; `c ∈ [1, n]`: primeras `c` letras propias + la comida desde `c`; `c ∈ [1, MLEN]`: primeras `c` de la comida + lo propio desde `c`. |
| Ladrillos nuevos | 1 | `NNEW·(n+1)` | Ladrillo `op / (n+1)` insertado en la posición `op mod (n+1)`. |
| Ladrillos | 0, 2 | `NB·(n+1)` | Ídem con todos los ladrillos (las torrecitas `16`, `38` primero). |
| Cambio | 0, 2 | `8n` | Posición `op >> 3`, letra `(op & 7) + 1`, +1 si ≥ la actual (letras 1–9). |
| Inserción | 0, 2 | `15(n+1)` | Posición `op / 15`, letra `op mod 15 + 1`. |
| Cruce | 0, 2 | `8n` | Forma `op / n`, `c = op mod n + 1`: primeras `c` propias + las de esa forma desde `c`. |
| Borrado | 0, 2 (si `n > 1`) | `n` | Borra la posición `op`. |

`r_cat` corta en 46 letras; un candidato con más de 31 letras no se juzga (`gen_comer.py:146-153`;
`gen_formas.py:1012, 1033`). Fuera de rango, receta vacía (nunca se juzga).

### 10.8.6 Tabla de probados

FNV-1a de la receta (longitud incluida) con bit 0 en 1; direccionamiento abierto en `2^21` ranuras
(`HBITS_C = 21`, 16 MB) en Luma (`gen_comer.py:49, 67-69`; `gen_formas.py:937-963`). `r_tried`: 1 si estaba, 0 si se
insertó, 2 si la tabla está llena a la mitad (la exploración se detiene). Al limpiarla se insertan las 8 recetas
vigentes. `r_load_archive` inserta las recetas perdedoras de las líneas de la ronda (`EPOCH`) actual
(`gen_formas.py:1149-1169`).

### 10.8.7 Exploración

- `r_new_walk` (`gen_formas.py:968-987`): `WTOTAL = Σ r_count` de las formas habilitadas; `WSTART` aleatorio;
  `WSTRIDE` aleatorio coprimo con `WTOTAL`; `EXPLORE = 1` (0 si no hay ninguna).
- `r_explore_frame`: hasta `TRIALS = 8` ensayos por cuadro; una victoria termina el cuadro; sin nada que probar,
  `EXPLORE = 0` (`gen_formas.py:988-996`).
- `r_trial` (`gen_formas.py:997-1039`): con `RADIUS = 1`, la operación `(WSTRIDE·WALKI + WSTART) mod WTOTAL` se mapea
  a (forma, operación). Con `RADIUS > 1`, `BUDGET` saltos: forma habilitada aleatoria y `RADIUS` ediciones aleatorias
  encadenadas.

### 10.8.8 Gesto

`r_gesture` (`gen_formas.py:507-513`): `CHANGED = 1`; si `EXPLORE = 0` y `WTOTAL ≠ 0`: `RADIUS += 1`,
`BUDGET = WTOTAL`, `EXPLORE = 1`.

### 10.8.9 Archivos de las formas

[`formas`](08-luma-cuerpo-procesos-y-casa.md#841-formas-399-bytes-de-texto) (399 bytes, `gen_formas.py:146-148, 1098-1121`):

| Desp. | Tam. | Contenido |
|---|---|---|
| 0 | 8 | `formas1 ` |
| 8 | 6 | `EPOCH` (decimal, ceros a la izquierda) |
| 14 | 1 | espacio |
| 15 | 16 | `RNG` en hex minúscula |
| 31 | 1 | espacio |
| 32 | 6 | `WINS` |
| 38 | 1 | `\n` |
| 39 + 45f | 45 | Forma `f`: receta (31), espacio, valor (7), espacio, celdas (4), `\n` |

Se lee sólo si mide exactamente 399 bytes y empieza con `formas1 `; un `RNG` de 0 no se aplica; una receta vacía
conserva la semilla (`gen_formas.py:1122-1148`).

[`archivo`](08-luma-cuerpo-procesos-y-casa.md#842-archivo-líneas-de-112-bytes) (líneas de `RECLEN = 112`, `gen_formas.py:1074-1095`):

| Desp. | Tam. | Contenido |
|---|---|---|
| 0 | 6 | `EPOCH` |
| 7 | 1 | Forma (`'0'`–`'7'`) |
| 9 | 31 | Receta perdedora |
| 41 | 31 | La otra receta |
| 73 | 15 | Motivo (texto, relleno con espacios) |
| 89 | 7 | `ATL` (total del perdedor) |
| 97 | 7 | `ATW` (total del ganador) |
| 105 | 1 | `RADIUS` |
| 111 | 1 | `\n` |

En Luma con `PRESENT`, `archivo` es un anillo ([§10.13](#1013-anillos-del-presente)) de 4 096 líneas; cada línea también va al [flujo](#1055-flujo-de-la-mente-d_flb) y a la [lluvia](#104-lluvia-hexadecimal).

### 10.8.10 Mano

`h_down` (`gen_formas.py:403-418`): [`r_gesture`](#1088-gesto), `r_hit` (forma delantera con una partícula crecida a distancia
`≤ T`); botón derecho: pulso hacia afuera (`v += (p − semilla)·64 >> 8`); izquierdo: toma la forma (rigidez por
distancia). `h_move` la arrastra; `h_up` sin mover alterna plegar.

### 10.8.11 Archivo de linaje y retrato

[`r_linaje`](08-luma-cuerpo-procesos-y-casa.md#883-linaje) (cap. 06) conserva de qué forma y lectura viene una victoria. `retrato_organos.py` ([§10.14](#1014-retrato-de-órganos-retrato_organospy)) lee [`formas`](#1089-archivos-de-las-formas) y
[`engranajes`](#1094-archivo-engranajes) para un informe externo.

### 10.8.12 Actos libres relacionados

`r_free` (`gen_luma.py:377-502`; marco completo en [cap. 08](08-luma-cuerpo-procesos-y-casa.md#44-libertad-elección-de-actos-r_free)) llama primero a [`r_host_eat`](#10114-protocolo-r_host_eat) y `r_pens_free`, y elige un
acto con probabilidad proporcional a su deseo `(S + 1/2)/(N + 1)` escalado por `2^21`:

| Acto | Deseo | Efecto en este capítulo |
|---|---|---|
| Descansar | `(2S0+1)<<20 / (N0+1)` | Ninguna exploración durante `LASTF` cuadros; paga si `RADIUS` cambió (un gesto). |
| Pensar | `(2S1+1)<<20 / (N1+1)` | [`r_gesture`](#1088-gesto); paga si hubo una victoria (`WINS`). |
| Dar | `(2S2+1)<<20 / (N2+1)` | Regalo de una forma a una criatura ([§10.12.8](#10128-realimentación-con-las-formas)). |
| Pintar | `1<<20 / (N3+1)` | Una comida al azar; la forma que alimentó toma otro de sus colores al azar (`r_set_hue`, `r_colour`); la paleta se guarda en [`libre`](08-luma-cuerpo-procesos-y-casa.md#851-libre-4640-bytes-binarios). |
| Dormir | `(2S4+1)<<20 / (N4+1)` | Deja la señal `dormir` ([cap. 08](08-luma-cuerpo-procesos-y-casa.md#71-dormir)). |
| Hablar / Leer | Del lector | [Cap. 09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta) / [cap. 06](06-razar-lectura-y-organos.md#5-lectura-de-un-libro). |

## 10.9 Engranajes

### 10.9.1 Definición

Un engranaje es una secuencia de 2 a 8 instrucciones consecutivas del programa del lector que sólo calculan,
canonizada por renombre de registros, elegida por ahorro (`gen_leer.py:102-109, 1610-1741`).

### 10.9.2 Canonización (`gz_canon`)

Desde la instrucción `p` (`gen_leer.py:1628-1652`), mientras haya menos de 8 y no termine el programa:

1. `w` = palabra de 32 bits; `op = w & 0xFF`. Termina si `op ∈ {0x00, 0x05}` o `op ≥ 0x0C` salvo `0x0F`. Quedan
   [`jldi`](01-idioma-janax.md#51-tabla-completa) (01), `jadd`/`jsub`/`jmul` (02–04), `jshl`/`jshr`/`jsar`/`jand`/`jor`/`jxor` (06–0B), `jshi` (0F)
   (`escalon0/janax.inc:24-39`).
2. Campos: `rd = (w >> 8) & 15`, `ra = (w >> 12) & 15`, `imm = w >> 16`.
3. Renombre en orden de aparición, con tabla de 16 entradas: para `op ∈ {01, 0F}` sólo `rd`, y se conserva `imm`
   entero; para los demás `ra`, luego `rb = imm & 15`, luego `rd`, y el campo alto queda sólo `rb'`.
4. Palabra canónica `op | rd'<<8 | ra'<<12 | (imm o rb')<<16`, guardada en `GCW`.

### 10.9.3 Conteo y selección (`r_gears`)

1. [`r_digest_food`](08-luma-cuerpo-procesos-y-casa.md#8810-comida-digerido) (cap. 06). Abrir [`luma/lectora.bin`](08-luma-cuerpo-procesos-y-casa.md#8813-p-y-luma); leerlo entero (`GNW` = bytes/4 instrucciones), con lugar
   para lo digerido (`r_digest`) (`gen_leer.py:1686-1693`).
2. Tabla `GHT` de `pow2(16·GNW)` ranuras de 32 bytes (`r_pow2`: la primera potencia de 2 no menor, mínimo 16):
   `+0` huella, `+8` cuenta, `+16` cabeza de cadena (lugar + 1), `+24` `L<<32 | lugar`. Cadenas `GNX`
   (8 qwords por lugar, una por longitud). `GUS`: un byte "usado" por instrucción (`gen_leer.py:1697-1701`).
3. Para cada lugar `p` desde el final hacia el inicio: huella FNV incremental (xor de la palabra canónica y
   multiplicación) y, para cada longitud `L ≥ 2`, `gz_ins(huella, L)` en `p` (`gen_leer.py:1702-1712`).
4. Rondas `GGI = 0..104`: entre las ranuras con cuenta ≥ 2 cuyo ahorro con la cuenta guardada
   `n(L − 1) − L` supera el mejor, recontar con `gz_count` (ocurrencias sin solapamiento entre instrucciones no
   usadas); si la cuenta real es < 2 se anula; el mayor ahorro positivo gana. Sin ganador → escribir. El ganador se
   recuenta marcando sus instrucciones como usadas, se guarda y su cuenta se anula (`gen_leer.py:1713-1735`).
5. Escribir `engranajes` (borrar y reescribir) y devolver las memorias (`gen_leer.py:1736-1740`).

### 10.9.4 Archivo `engranajes`

105 registros (`NGEARS`) de 128 bytes (13 440 bytes) en `DBUF + GEARS` (`gen_leer.py:252`): `+0` qword con la cantidad
de instrucciones `n`; `+8 + 8i` la palabra canónica `i` (qword); el resto en 0.

Carga (`gen_leer.py:7591-7605`): si `engranajes` existe y su lectura devuelve más de 0 bytes, se usa; si no, se ejecuta
`r_gears`. `NGE` = registros con primer qword ≠ 0; `GFP` = FNV de los 13 440 bytes leídos de a qword (xor y
multiplicación por qword, sin forzar el bit 0) (`gen_leer.py:7600-7605`). El programa no regenera el archivo si ya
existe; lo invalida el [guion de arranque](08-luma-cuerpo-procesos-y-casa.md#3-construcción-y-arranque-lumash), que borra `engranajes` de la casa cuando `bin/luma.bin` es más nuevo que él
(`razar/cuerpo/luma.sh:49-50`), de modo que el siguiente nacimiento ejecuta `r_gears` sobre el cuerpo nuevo.

Uso: índice de engranaje en una [célula](06-razar-lectura-y-organos.md#106-células-y-tejidos) `E g1 g2 t` = `(g1 − 9)·15 + g2 − 1` ∈ [0, 104]; un índice `≥ NGE` no hace
nada (`gen_leer.py:7185-7191`). Como lente del lector, [cap. 06](06-razar-lectura-y-organos.md#107-engranajes-formato-de-128-bytes).

## 10.10 Comida de nubes (despensa)

### 10.10.1 Despensa

[`despensa`](08-luma-cuerpo-procesos-y-casa.md#843-despensa) (escrita fuera del programa por el [guion de arranque](08-luma-cuerpo-procesos-y-casa.md#3-construcción-y-arranque-lumash), `razar/cuerpo/luma.sh`; con casa propia
`vida-memoria` no se escribe, `luma.sh:57-66`): encabezado de 37 bytes `despensa1 NNNNNN MMMMMMMMM TTTTTTTTT\n`
(cantidad en 10, tamaño máximo en 17, bytes de texto en 27) y una línea por nube `BBBBBBBBB ruta\n`
(`gen_comer.py:304-342`). En Luma, una línea cuya ruta empieza con `#` da la huella con 16 hex en lugar de la ruta
(`gen_comer.py:332-339`). Entrada en memoria (40 bytes): `+0` ruta, `+8` largo, `+16` bytes, `+24` huella FNV de la
ruta, `+32` comida. Sin `despensa`, `NPAN = 0` y no hay comidas de nubes.

Orden de las comidas: `FA` aleatorio y `FB` coprimo con `NPAN`, con su propio generador (semilla
`0x9E3779B97F4A7C15`) (`gen_comer.py:373-378`).

### 10.10.2 Hambre y lectura

`r_hungry` (`gen_comer.py:441-462`): primera entrada no comida en el orden `FB·k + FA mod NPAN`; se marca comida;
`r_meal_read`; si falla, se escribe su línea con `'-'` y se sigue; si lee, `v_meal` ([§10.12.6](#10126-aprendizaje-sueños-y-diálogos)), `MEALPH = 1`.
`r_meal_read` (`gen_comer.py:467-490`): [pedido 37](04-nucleo-abi-de-pedidos.md#94-salidas-al-anfitrión), lectura completa (debe coincidir el tamaño), formato `NUBE` v3,
nivel 0, celdas.

### 10.10.3 Juez de una comida (`r_fit_cost`)

Silueta `TBMP` (40 × 50) contra el cuerpo crecido de la receta ajustado a la habitación
(`gen_comer.py:597-667`): `costo = n·317 + k·1097 + (2⌊log2(k+1)⌋ + 1)·100` centésimas de bit, con `k` las celdas
distintas (`1097 = round(100·log2 2000)`).

### 10.10.4 Fases (`MEALPH`)

| Fase | Qué ocurre | Salida |
|---|---|---|
| 1 llegando | Partículas hacia la silueta en el plato (80 × 100 en x 40). | Todas quietas → `r_digest_begin` → 2 |
| 2 digiriendo | Desde la forma que mejor la explica (`MFSTAR`), escalada de primera mejora con mutaciones tipo 2, hasta 64 candidatos por cuadro, presupuesto `31·r_count_k(31, 2)`. | Óptimo o presupuesto → receta en `MRECB`, al corpus, `r_learn`, `r_climb_begin` → 5 |
| 5 escalando | La receta en lugar de `MFSTAR`, evaluada con el total de la población; cada paso que sube, línea `meal-climb`. | Cima juzgada con `TIEOK = 1` si nunca fue forma: gana → 4; pierde o ya probada → 3 |
| 3 ronda | Recorrido tipo 1 (lo que trajo la comida). | Una victoria → 4 (destino la forma ganadora); calma → 4 (destino `MFSTAR`) |
| 4 fluyendo | Partículas hacia las de la forma destino. | Quietas → `r_absorb` → 0 |

Fuente: `gen_comer.py:669-899`. `r_absorb`: la forma destino toma el primer color de la comida, se escribe su línea en
[`comidas`](#10105-comidas-líneas-de-cline--537-bytes) y [`ladrillos`](08-luma-cuerpo-procesos-y-casa.md#845-ladrillos), `ATE += 1`, `r_recompute` (`gen_comer.py:795-802`). Ladrillos: fusión voraz de pares por
longitud de descripción sobre el corpus de recetas comidas (`gen_comer.py:947-951`; detalle de `r_dl` no
verificado línea por línea).

### 10.10.5 `comidas` (líneas de `CLINE = 537` bytes)

| Desp. | Tam. | Contenido |
|---|---|---|
| 0 | 4 | Entrada de la despensa |
| 5 | 16 | Huella de la ruta (hex) |
| 22 | 31 | Receta |
| 54 | 7 | Costo (×100) |
| 62 | 4 | Celdas mal |
| 67 | 6 | Candidatos |
| 74 | 1 | Forma de partida (`'0'`–`'7'` o `'-'`) |
| 76 | 1 | Forma alimentada (`'0'`–`'7'` o `'-'`) |
| 78 | 2 | Cantidad de colores |
| 81 + 7i | 6 | Color `i` (`rrggbb`), i < 64, el más contado primero |
| 529 | 6 | Ronda |
| 536 | 1 | `\n` |

Fuente: `gen_comer.py:1086-1120`. Al nacer, cada línea marca su entrada como comida, agrega la receta al corpus y da a
la forma alimentada su primer color (`gen_comer.py:381-416`).

[`ladrillos`](08-luma-cuerpo-procesos-y-casa.md#845-ladrillos): `ladrillos1 NNNNNN\n` (18 bytes) y una línea de 40 por ladrillo aprendido: receta (31), espacio, usos (7),
`\n` (`gen_comer.py:1121-1142`).

## 10.11 Comida del disco: libros del disco

### 10.11.1 Carpeta vigilada

El núcleo vigila las carpetas de la variable de entorno [`JANAX_VIGIA`](05-nucleo-pantalla-teclado-vigia.md#102-configuración). [`luma.sh`](08-luma-cuerpo-procesos-y-casa.md#3-construcción-y-arranque-lumash) sólo la fija en la rama de casa
propia (la casa contiene `vida-memoria`): toma `LUMA_VIGIA` o, si no está definida, una carpeta `Comida` fija del
anfitrión escrita en el guion; `-` significa ninguna (`razar/cuerpo/luma.sh:58-66`). En la otra rama (lista de nubes y
oídos del anfitrión) no se fija `JANAX_VIGIA` (`luma.sh:92-93`) y el [pedido 39](05-nucleo-pantalla-teclado-vigia.md#108-entrega-pedido-39) no tiene carpetas que vigilar (lo que
el núcleo hace entonces: [cap. 05](05-nucleo-pantalla-teclado-vigia.md#108-entrega-pedido-39), `so/vigia.inc:664-665, 697-698`). El programa no conoce rutas: pide al núcleo la siguiente novedad
(pedido 39).

### 10.11.2 Habitación `HOSTR`

`HE_X + 64` bytes, creada la primera vez (`gen_luma.py:243-248`):

| Desp. | Tam. | Contenido |
|---|---|---|
| 0 | 8 | Manejador del archivo del anfitrión |
| 8 | 8 | Largo de la ruta |
| 16 | 8 | Huella FNV-1a del archivo (todos sus bytes) |
| 24 | 8 | 0 (reservado) |
| 32 | 8 | Bytes leídos del libro − 8 |
| 40 | 8 | Desplazamiento de la etiqueta elegida (64 u 63) |
| 48 | 8 | Largo de la etiqueta elegida (28 o 29) |
| 63 | 1 | `e` |
| 64 | 28 | `libro-disco-` + 16 hex minúscula de la huella de la ruta |
| 96 | 31 | `registro-disco-` + los mismos 16 hex |
| 128 | 4096 | Ruta |
| 4224 | 65536 | Trozo del archivo |
| 69760 (`HE_X`) | 64 | `+0` tamaño leído; `+8` huella del libro; `+16` tamaño del libro; `+24` líneas; `+32` líneas marcadas; `+40` estado de línea; `+48` posición; `+56` huella del prefijo |

### 10.11.3 Formato de libro del disco

Etiquetas [`libro-disco-H`](08-luma-cuerpo-procesos-y-casa.md#8817-libro-disco-16-hex-elibro-disco-16-hex), `elibro-disco-H` ([en espera de turno](08-luma-cuerpo-procesos-y-casa.md#887-turno-y-rotación-de-libros), [cap. 09](09-luma-conversacion-y-respuesta.md#15-la-lista-de-libros)) y [`registro-disco-H`](08-luma-cuerpo-procesos-y-casa.md#8818-registro-disco-16-hex), con `H` = FNV-1a de
los bytes de la ruta, 16 dígitos hex minúscula, el más significativo primero (`gen_luma.py:265-278`). Contenido
(`gen_luma.py:315-319`; `razar/cuerpo/libros_del_disco.py:36-48`):

| Desp. | Tam. | Contenido |
|---|---|---|
| 0 | 8 | FNV-1a de todos los bytes del archivo (u64 LE) |
| 8 | 8 | Tamaño del archivo (u64 LE) |
| 16 | n | Ruta (bytes tal como los dio el pedido 39) |

El texto no se copia: el lector lo abre en su lugar ([cap. 06](06-razar-lectura-y-organos.md#51-fuentes-del-libro)).

### 10.11.4 Protocolo (`r_host_eat`)

1. [Pedido 39](05-nucleo-pantalla-teclado-vigia.md#108-entrega-pedido-39) → ruta y largo `j13`; `≤ 0` → fin (`gen_luma.py:250-251`).
2. Componente final de la ruta (tras el último `\` o `/`): si no es vacío, tiene largo par y todos sus caracteres
   están en `0–9a–f`, es la casa de otro ser → fin (`gen_luma.py:252-263`).
3. Construir las etiquetas (paso 2 de [§10.11.3](#10113-formato-de-libro-del-disco)).
4. [Pedido 37](04-nucleo-abi-de-pedidos.md#94-salidas-al-anfitrión); leer trozos de 64 KB acumulando la huella y el tamaño; un byte 0 → no es texto: cerrar, fin
   (`gen_luma.py:280-290`).
5. Cerrar. Abrir `registro-disco-H` (si `r_open` falla → fin); si se leen 8 bytes, es un registro conocido → fin; si
   no, borrar el archivo vacío ([pedido 12](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema)) (`gen_luma.py:291-303`). En el paso 6 un fallo de `r_open` también termina.
6. Probar `libro-disco-H` y luego `elibro-disco-H`: leer 16 bytes; si los 16 existen, se tiene el libro con ese nombre;
   si no, borrar el vacío (`gen_luma.py:304-309`).
7. Nuevo: escribir como `libro-disco-H` (paso 9).
8. Conocido: si su huella coincide → fin (ya lo sabía). Si no, `he_record`; si es registro → fin
   (`gen_luma.py:312-313`).
9. Escribir (borrar, abrir, huella, tamaño, ruta, cerrar) con el nombre en uso (`gen_luma.py:314-319`).
10. Sólo si era nuevo (el último intento de lectura del paso 6 no devolvió 16 bytes): escribir en su conversación,
    con [`r_dlg_write`](09-luma-conversacion-y-respuesta.md#161-r_dlg_write) y `j1 = 1` (prefijo `luma: `), el texto `me comí ` (UTF-8, 9 bytes) seguido de la ruta, con
    `GREET = 1` durante la llamada; luego `CHANGED = 1` (`gen_luma.py:320-331`; `gen_leer.py:2034`). Un libro cambiado se reescribe en silencio.

Un llamado procesa a lo sumo un archivo. Se llama al nacer (`gen_luma.py:117`), cada vez que el núcleo la despierta
sin evento (`gen_formas.py:300-304`) y al final de cada acto (`gen_luma.py:378`).

### 10.11.5 Detección de registros (`he_record`)

Condición previa: tamaño del libro `t0 > 0` y `t0 ≤` tamaño actual (`gen_luma.py:334-340`). Se relee el archivo
calculando la huella de sus primeros `t0` bytes y, por línea (`gen_luma.py:343-361`):

| Estado | Byte | Transición |
|---|---|---|
| 0 inicio | espacio, tab, `\r` | queda en 0 |
| 0 inicio | dígito `0–9` | línea +1, marcada +1 → 2 |
| 0 inicio | otro | línea +1 → 1 |
| 1 primera palabra | `:` | marcada +1 → 2 |
| 1 primera palabra | espacio, tab | → 2 |
| 2 resto | cualquiera salvo `\n` | queda en 2 |
| cualquiera | `\n` | → 0 |

Es registro si la huella del prefijo es la del libro y `2·marcadas > líneas`. Entonces se borra el libro y se escribe
`registro-disco-H` con el mismo formato de [§10.11.3](#10113-formato-de-libro-del-disco) (`gen_luma.py:362-372`).

## 10.12 Criaturas

### 10.12.1 Qué simula

Cuerpos de partículas que caminan sobre un toro de `W × H = 320 × 200` celdas con su marcha (ritmos por miembro), con
reglas sólo locales: atracción si uno tiene algo que enseñar al otro, alejamiento si no; aprendizaje de piezas de
marcha cuando se tocan si acorta su descripción (MDL); sueños (mutaciones de su marcha) nombrados con melodías;
estratos de hábitat. En Luma no se dibujan: sus registros caen como lluvia ([§10.4.4](#1044-qué-bytes-caen))
(`gen_vida.py:1-43`; `gen_luma.py:970-971`). En Luma `ALWAYS` es verdadero: siempre caminan
(`gen_vida.py:123, 341-342`; `gen_luma.py:984-991`).

### 10.12.2 Constantes

| Nombre | Valor | Qué mide | Fuente |
|---|---|---|---|
| `DENS`, `RADIUS_B` | 4, 3 | Cuerpos por criatura y radio en cuerpos (≈7 vecinos). | `gen_vida.py:82-85` |
| `B` | `isqrt(64000 / (4N))` acotado a [4, 40] | Lado del cuerpo. | `gen_vida.py:397-403` |
| `RB`, `TB` | `768·B`, `256·B` | Radio de vista y de toque (celdas ×256). | `gen_vida.py:403-404` |
| `TURN`, `WANDER` | 64, 8 | Giro hacia la dirección deseada y deriva aleatoria (criterio). | `gen_vida.py:88-89` |
| `LERP_SHIFT` | 2 | Partícula recorre 1/4 del camino por cuadro. | `gen_vida.py:91` |
| `NPACK`, `PK` | 64, 3 | Paquetes en vuelo, lado de paquete. | `gen_vida.py:93-94` |
| `DN`, `LEXN`, `MELS` | 4, 32, 64 | Sueños, entradas de léxico, melodías (3 señales de 4). | `gen_vida.py:97-100` |
| `DREAM_TRIES` | 16 | Intentos de soñar algo no tenido. | `gen_vida.py:102` |
| `TRIED_BITS` | 18 | Tabla de sueños nombrados (2^18). | `gen_vida.py:124` |
| `V_K` | 6 794 285 | `round(128·2π·33·256)`. | `gen_vida.py:146` |
| `CSZ` | 384 | Bytes por registro en Luma (48 qwords). | `gen_vida.py:160` |
| `RS` | 32 | Ritmo: `P` ms, `q`, `s` (+24: pisa el suelo). | `gen_vida.py:161` |

### 10.12.3 Registro de criatura

43 qwords (`gen_vida.py:157-159`), en orden: `C_ENT` (número), `C_STATE`, `C_CX`, `C_CY`, `C_HX`, `C_HY` (rumbo,
unidad 256), `C_L` (miembros), `C_K` (motivos), `C_NE`, `C_DL`, `C_LIMB`, `C_MOD`, `C_EFF`, `C_LEFF`, `C_ACC`,
`C_PART`, `C_NP`, `C_FNV` (huella), `C_THETA`, `C_V`, `C_LEARN`, `C_LOADED`, `C_UNSET`, `C_PNUB`, `C_LNUB`, `C_BNUB`,
`C_POID`, `C_LOID`, `C_BOID`, `C_TIDX`, `C_GOAL`, `C_REC`, `C_C1`, `C_C2`, `C_MODE`, `C_DRAD`, `C_BREC`, `C_SIZE`,
`C_BITS`, `C_LAST`, `C_IDB`, `C_BCOST`, `C_IDOK`.

`C_STATE`:

| Valor | Significado | Fuente |
|---|---|---|
| 0 | No llegó | — |
| 1 | Cayendo | `gen_vida.py:641` |
| 2 | Presente | `gen_vida.py:311-312` |
| 3 | Comida, espera llegar | `gen_luma.py:896, 1032` |
| 4 | No pudo llegar (no se reintenta) | `gen_vida.py:327-328` |

Llegadas (`gen_vida.py:319-328`): una por cuadro, la primera en estado 3. Con [`vida-memoria`](08-luma-cuerpo-procesos-y-casa.md#891-vida-lista-vida-memoria), la marcha sale del
texto guardado y el cuerpo de `v_remember` ([§10.12.8](#10128-realimentación-con-las-formas)); sin ella, de los archivos `.oido` y `.nube` del anfitrión
([pedido 37](04-nucleo-abi-de-pedidos.md#94-salidas-al-anfitrión)) (`gen_vida.py:593-641`).

### 10.12.4 Juez de la marcha

`γ(n) = 2·bitlen(n+1) − 1`; `zz(d) = 2d` si `d ≥ 0`, `−2d − 1` si no (`gen_vida.py:793-808`). Para un modelo de `K`
motivos sobre `L` miembros (`gen_vida.py:809-833`):

```
DL = γ(K) + Σ_motivos [γ(P) + γ(q) + 4]
   + Σ_miembros [bitlen(K) + min(γ(P) + γ(q) + 4,
                                 min_motivo γ(zz(ΔP)) + γ(zz(Δq)) + γ(zz(Δs₁₆)))]
```

con `Δs₁₆ = ((s_miembro − s_motivo) & 15)`, menos 16 si ≥ 8. Modelo inicial: agregar el miembro que más acorta `DL`
mientras alguno lo haga (`r_own`, `gen_vida.py:852-871`).

### 10.12.5 Movimiento

`r_gait` (`gen_vida.py:1076-1103`): por miembro, fase `acc = (acc + 65536·33/P) & 0xFFFF`; ángulo
`((acc + s<<12) >> 8) & 255`; `A = round(2^(q/2))` (10⁻⁵ rad); grupo `g` = suelo/aire; en el grupo:
`velocidad += (|cos|·A·B >> 12)·V_K / (100000·P)`, `suma A`, `inclinación += sin·A >> 12`, `cuenta`. Mueve el grupo
de suelo sólo si su suma de amplitudes es estrictamente mayor. `C_THETA = inclinación/cuenta`, `C_V = velocidad`.

`r_steer` (`gen_vida.py:1104-1200`): vecinos en las 3 × 3 celdas de una rejilla de celdas de al menos un radio; para
cada vecino presente a distancia `0 < d < RB` (en el toro):

- Si `d < TB` y no hablaron en este encuentro: marcar y `r_dialogue`.
- Si hay lección en cualquier sentido y alguno tiene miembros: si se tocan y el vecino enseña, `r_share`; acercarse
  `+(Δ<<8)/d`.
- Si no: acercarse si es el recién llegado que busca; si no, alejarse `−(Δ<<8)/d · (RB − d)/RB`.
- Fuera de vista: se borra la marca del encuentro.

Luego: deriva aleatoria `w ∈ [−8, 8]` (rotación `x −= y·w>>8`, `y += x·w>>8`), `+64·dirección deseada`, normalizar a
256, avanzar `C += H·V >> 8` en el toro, y mantener la altura en su estrato (`r_in_band`).

### 10.12.6 Aprendizaje, sueños y diálogos

- `r_gain(i ← j)`: bits que ahorra la mejor pieza de `j` (no presente en `i`) agregada o en lugar de un motivo; matriz
  `GAIN` N × N (`gen_vida.py:912-939`).
- `r_share` (`gen_vida.py:956-1004`): `i` prueba todas las piezas de `j`; conserva la mejor sólo si `DL` baja
  (veredicto 0 `kept`, el motivo reemplazado 1 `replaced`); las demás se archivan como 2 `longer` o 3 `beaten`;
  `r_save_learned`; en Luma `v_learned` con `LBITS` = bits ahorrados.
- `r_dialogue` (`gen_vida.py:1302-1363`): el hablante nombra su primer sueño con una melodía de su léxico (nueva al
  azar si no la tiene); el oyente reconstruye una pieza desde la melodía (su léxico o su propio sueño); si acorta su
  `DL`, se conserva (4 `dreamt`, veredicto `K`), si no, 5 `unfit` (`U`); sin sueño ni palabra, `N`. Puntaje de
  léxico ±1. Con [`vida-codigo`](08-luma-cuerpo-procesos-y-casa.md#898-vida-habitat-vida-codigo-vida-nube-16-hex), el sueño viaja como texto cortado en ladrillos del código común. Detalle de
  `r_dream`, `r_welcome`, `r_spawn` y paquetes: no verificado línea por línea.

### 10.12.7 Hábitats

`r_mode` (`gen_vida.py:1678-1723`): grupo que mueve (suelo si pesa más); el par de miembros más fuertes de ese grupo
con períodos dentro del 10 % (`10|Pa − Pb| ≤ max`); diferencia de fase en dieciseisavos plegada a media vuelta:
juntos si `< 3`. Suelo y separados → 1 camina; aire y juntos → 0 vuela; otro o sin par → 2 repta.
`r_habitats` (`gen_vida.py:1735-1774`): universo de `H/10 = 20` filas; cielo, tierra y bajo con altura proporcional a
cuántos viven en cada uno (mínimo 2 cuerpos); colores de estrato de la paleta atenuada (`gen_vida.py:133-137`).

### 10.12.8 Realimentación con las formas

| Rutina | Disparo | Efecto | Fuente |
|---|---|---|---|
| `v_born` | Llegada | Atención `DL·100/16`; ofrece su cuerpo a las formas. | `gen_luma.py:569-574` |
| `v_learned` | Pieza conservada | `C_BITS += LBITS`; atención; `v_morph`, `v_rebody`, guardar cuerpos, ofrecer. | `gen_luma.py:575-580` |
| `v_morph` | Tras aprender | Toda mutación de una letra (cambio, borrado, inserción, letras 1–9) del cuerpo; conserva la de menor costo si no supera el actual. Línea `M`/`K` o `M`/`L`. | `gen_luma.py:581-631` |
| `v_offer_forms` | Nacer o aprender | Forma al azar; candidato = forma[0, c) + cuerpo[c, 31) con `c` al azar en [0, n_forma]; si no fue probado, `r_judge`. Línea `F`/`W` (ganó) o `F`/`P` (perdió). | `gen_luma.py:664-687` |
| `v_offer_creature` | Cada cuadro, si `WINS` cambió | Hasta 8 sorteos de una criatura presente; cuerpo[0, c) + receta ganadora[c, 31); se conserva si su costo contra su identidad no sube (+400 de atención). Línea `C`/`K` o `C`/`L`. | `gen_luma.py:688-718` |
| `v_gift_to` | Acto "dar" | Igual que la anterior con la criatura elegida; `GIFTOK`: 2 ausente, 0 no aceptada, 1 aceptada. | `gen_luma.py:719-727` |
| `v_shrink` | Cada cuadro | Quien no aprendió en `SEARCH` cuadros pierde un bit; si cambia su tamaño, se rehace. | `gen_luma.py:641-652` |
| `v_remember` | Rehacer cuerpo | Crece la receta guardada como forma en 40 × 50 (identidad: 50 filas, una vez) y escribe su nube `vida-nube-H`. | `gen_luma.py:1051-1116` |

Condición común: `v_born` sólo ofrece, y `v_learned` sólo transforma y ofrece, si `MEM ≠ 0` (la lista se cargó de
[`vida-memoria`](08-luma-cuerpo-procesos-y-casa.md#891-vida-lista-vida-memoria)); `v_shrink`, `v_offer_creature` y `v_gift_to` tampoco actúan sin `MEM` (`gen_luma.py:572, 578, 642,
690, 723`).

Tamaño del cuerpo: `min(isqrt(B² + B·C_BITS), 2B)` (`gen_luma.py:535-539`). Cámara (`gen_luma.py:540-568,
1045-1049`): interés decae 1/128 por cuadro; zoom `1 + INT·256/400` acotado a 3; posición se acerca 1/8 por cuadro.
En Luma sólo afecta a los estratos, que la lluvia tapa.

### 10.12.9 Archivos de las criaturas (prefijo `vida-`)

| Etiqueta | Formato | Fuente |
|---|---|---|
| [`vida-lista`](08-luma-cuerpo-procesos-y-casa.md#891-vida-lista-vida-memoria) | `lista1 N(6) NMAX(9) OMAX(9) TEXT(9)\n` (44) + `<nube 9> <oido 9> <ruta nube>\t<ruta oido>\n` | `gen_vida.py:371-462` |
| [`vida-memoria`](08-luma-cuerpo-procesos-y-casa.md#891-vida-lista-vida-memoria) | Mismo encabezado; línea: huella (16 hex), espacio, receta (31), espacio, color 1 (6 hex), espacio, color 2 (6 hex), espacio, bytes de marcha (9), `\n`, texto de la marcha | `gen_vida.py:441-448` |
| [`vida-aprendido`](08-luma-cuerpo-procesos-y-casa.md#892-vida-aprendido) | `aprendido1 NNNNNN\n` + `<huella 16> <K 3>` y K veces ` <P 5> <q 2> <s 2>`, `\n`; relleno con espacios hasta el mayor largo | `gen_vida.py:469-550` |
| [`vida-archivo`](08-luma-cuerpo-procesos-y-casa.md#893-vida-archivo-vida-guardados-80-bytes) | Líneas de 80: cuadro (9), alumno (16 hex) en 10, maestro en 27, P en 44, q en 50, s en 53, veredicto (8) en 56, DL actual (6) en 65, DL con la pieza (6) en 72, `\n` | `gen_vida.py:564-590` |
| [`vida-dialogos`](08-luma-cuerpo-procesos-y-casa.md#894-vida-dialogos-104-bytes) | Líneas de 104: cuadro, hablante en 10, oyente en 27, sueño P q s en 44/50/53, melodía dicha en 56, enviada en 59, pieza reconstruida en 62/68/71, `K`/`U`/`N` en 74, exacta en 76, DL en 78 y 85, cuarto campo del sueño en 93, `\n` | `gen_vida.py:1429-1459` |
| [`vida-lexico`](08-luma-cuerpo-procesos-y-casa.md#895-vida-lexico) | `lexico1 NNNNNNN\n` (16) + líneas de 37: huella, melodía (2) en 17, P (5) en 20, q (2) en 26, s (2) en 29, puntaje (4) en 32, `\n` | `gen_vida.py:1467-1500` |
| [`vida-habitat`](08-luma-cuerpo-procesos-y-casa.md#898-vida-habitat-vida-codigo-vida-nube-16-hex) | Líneas de 19: huella, espacio, modo, `\n` | `gen_vida.py:1762-1772` |
| [`vida-cuerpos`](08-luma-cuerpo-procesos-y-casa.md#897-vida-cuerpos) | `cuerpos1 N(6)\n` (16) + líneas de 56: huella, espacio, receta (31), espacio, bits (6), `\n`; la línea `i` es la criatura `i` y su huella debe coincidir | `gen_luma.py:751-769, 924-933` |
| [`vida-intercambios`](08-luma-cuerpo-procesos-y-casa.md#896-vida-intercambios-65-bytes) | Líneas de 65: cuadro (9), clase `F`/`C`/`M` en 10, criatura (16 hex) en 12, forma en 29, candidato (31) en 31, resultado `K`/`L`/`W`/`P` en 63 (motivo del anillo 0/1/2/3), `\n` | `gen_luma.py:730-750` |
| [`vida-guardados`](08-luma-cuerpo-procesos-y-casa.md#893-vida-archivo-vida-guardados-80-bytes) | Copia de las líneas de `vida-archivo` cuyo veredicto es 0, 1 o 4 | `gen_vida.py:584-586` |
| [`vida-nube-H`](08-luma-cuerpo-procesos-y-casa.md#898-vida-habitat-vida-codigo-vida-nube-16-hex) | `NUBE` v3 40 × 50: encabezado, 250 bytes de bits, 3 bytes RGB por celda encendida (contorno en `C_C1`, interior en `C_C2`) | `gen_luma.py:1081-1114` |
| [`vida-codigo`](08-luma-cuerpo-procesos-y-casa.md#898-vida-habitat-vida-codigo-vida-nube-16-hex) | Código común (escrito por `codigo_comun.py`): ladrillos de 20 bytes | `gen_vida.py:1414-1428` |

## 10.13 Anillos del presente

Con `PRESENT` (`gen_luma.py:37-51, 771-820`), cada registro de sucesos es un [anillo](08-luma-cuerpo-procesos-y-casa.md#82-formato-anillo-anillo1): encabezado de `RHDR = 160` bytes
y `K` líneas fijas.

Descriptor de 12 qwords: `+0` manejador, `+8` K, `+16` largo de línea, `+24` cuenta, `+32 + 8m` cuenta del motivo `m`
(0–7).

| Descriptor | Dirección | Archivo | K | Línea |
|---|---|---|---|---|
| `RING_A` | `0x6600` | `vida-archivo` | 4096 | 80 |
| `RING_D` | `0x6660` | `vida-dialogos` | 4096 | 104 |
| `RING_X` | `0x66C0` | `vida-intercambios` | 1024 | 65 |
| `RING_F` | `0x6720` | `archivo` (formas) | 4096 | 112 |
| `RING_G` | `0x6780` | `vida-guardados` | 1024 | 80 |

Encabezado: `anillo1` en 0; K (9 dígitos) en 8; cuenta (12) en 18; cuenta del motivo `m` (12) en `31 + 13m`; `\n` en
159; el resto espacios. `l_ring(línea, motivo, descriptor)`: incrementa la cuenta del motivo; escribe la línea en
`160 + (cuenta mod K)·largo` ([pedido 38 y 6](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) con el manejador en los 32 bits altos); cuenta + 1; reescribe el
encabezado. `l_ring_open` lee el encabezado si mide 160 y empieza con `anillo1 `; si no, lo crea en cero. Una línea
de `RING_F` también va a [`r_flujo_trial`](#1055-flujo-de-la-mente-d_flb).

## 10.14 Retrato de órganos (`retrato_organos.py`)

Instrumento externo, en Python, que no forma parte del programa: `retrato_organos.py <casa> <salida.md>`
(`razar/cuerpo/retrato_organos.py:1-7`). Lee [`formas`](#1089-archivos-de-las-formas) (líneas de tres campos: receta, valor, celdas) ordenadas por
valor, y [`engranajes`](#1094-archivo-engranajes) (registros de 128 bytes con `0 < n ≤ 15`), decodifica cada palabra con los macros de
`escalon0/janax.inc` (`op = w & 0xFF`, `rd = (w>>8)&15`, `ra = (w>>12)&15`, `imm` con signo de 16 bits) y escribe un
documento Markdown con la tabla del alfabeto, los ocho órganos y los engranajes, traduciendo algunos patrones fijos
(`retrato_organos.py:18-101`).

## 10.15 Invariantes y límites

| Invariante o límite | Valor | Fuente |
|---|---|---|
| Escalas | `ZOOM = K = 2` (afirmado en construcción) | `gen_luma.py:967` |
| Bytes por cuadro mostrados | 2 792 028 | `gen_luma.py:983` |
| Celdas de lluvia redibujadas por paso | ≤ 3·52 | `gen_leer.py:6933-6936` |
| Bytes por paso de lluvia | ≤ 26 | `gen_leer.py:6921` |
| Texto por entrada del flujo | ≤ 1000 bytes; flujo ≤ 2048 bytes y ≤ 16 renglones | `gen_leer.py:7017, 7025, 7048` |
| Línea en escritura | Un carácter se agrega a `D_IN` sólo si `longitud + 4 < 1000`; se muestran los últimos 52 bytes | `gen_leer.py:5954, 5960, 6512` |
| Nombre | Un carácter se agrega sólo si `longitud + 4 < 3000` | `gen_leer.py:5952, 5960` |
| Receta | ≤ 31 letras, alfabeto 1–15 | `gen_formas.py:49`; `gen_formas.py:1064-1071` |
| Tabla de probados | Se deja de explorar a la mitad (2^20 entradas) | `gen_formas.py:952-955` |
| Engranajes | 105 × 128 bytes, 2–8 instrucciones | `gen_leer.py:252, 1633` |
| Ruta de libro del disco | ≤ 4096 bytes; trozo de lectura 64 KB | `gen_luma.py:243` |
| Un archivo del disco por llamado | 1 pedido 39 | `gen_luma.py:250` |
| Criaturas: lado del cuerpo | [4, 40] celdas | `gen_vida.py:86` |

## 10.16 Puntos no verificados

1. La semántica exacta de los pedidos 12, 20, 35, 38, 39, 42, 43, 44 y 47 del lado del núcleo ([cap. 04](04-nucleo-abi-de-pedidos.md#9-especificación-de-cada-pedido)); aquí sólo
   consta cómo se usan.
2. El significado del evento de tipo 6 y el valor de `EV+8` en eventos de tipo 6 y 7 ([cap. 05](05-nucleo-pantalla-teclado-vigia.md#62-tipos-de-evento)).
3. Que `r_open` (pedido 4) cree el archivo si no existe: se deduce del borrado del "archivo vacío" en
   `gen_luma.py:308`.
4. El significado de los dos floats y de los 8 bytes en cero del encabezado `NUBE`.
5. El significado preciso de `lj_rlen`/`lj_rptr` y el orden en que recorren las líneas de la conversación ([cap. 09](09-luma-conversacion-y-respuesta.md#197-respuesta-única-y-flujo)).
6. El comportamiento del pedido 39 cuando `JANAX_VIGIA` no está definida (rama sin `vida-memoria` de [`luma.sh`](08-luma-cuerpo-procesos-y-casa.md#3-construcción-y-arranque-lumash)).
7. Los detalles internos de `r_dream`, `r_welcome`, `r_spawn`, `r_packets`, `r_body` y `r_parse_oido` de las
   criaturas, y de `r_dl`/`r_learn` de los ladrillos.
8. Si la casa de Luma contiene una `despensa` (de ella depende que haya comidas de nubes).
9. `r_letra_learn`, `r_letra_fine` y `r_dlg_wish` ([cap. 09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta)), `r_read_max`, `r_read_cand`, `r_linaje` y `r_flat`
   ([cap. 06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)).
