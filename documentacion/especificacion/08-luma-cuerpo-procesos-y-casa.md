# 08. Luma: cuerpo, generadores, procesos y formato de su casa

Este capítulo especifica cómo se genera el programa `luma.jsm` a partir de los generadores en Python de
`razar/cuerpo/`, qué procesos de Janax nacen de ese único binario (cuerpo, lectora, pensadora, canto y cardumen),
los protocolos entre ellos (archivos y palabras de buzón), el ciclo de vida del ser (nacer, dormir, renacer) y el
formato binario o textual de cada archivo de su casa. No cubre: la sintaxis del idioma ni el juego de
instrucciones ([capítulo 01](01-idioma-janax.md#01-el-idioma-janax-máquina-virtual-codificación-e-instrucciones)), el ensamblador y la construcción del `.bin` ([capítulo 02](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas)), el núcleo, la carga de
programas y datos iniciales, salas y remeros ([capítulo 03](03-nucleo-arranque-memoria-procesos.md#03-núcleo-janaxos-arranque-memoria-procesos-firmas-y-planificación)), la semántica exacta de cada pedido al núcleo
([capítulo 04](04-nucleo-abi-de-pedidos.md#04-núcleo-janaxos-abi-de-pedidos-llamadas-al-sistema)), la ventana, el registro de eventos y el formato `.nube` como pedido 40 ([capítulo 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn)), el examen de
lectura de `pulso.jsm` y los órganos ([capítulo 06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)), el cardumen y su canto ([capítulo 07](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez)), la lógica de conversación
de Luma ([capítulo 09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta)), el dibujo de su pantalla y la vida de sus criaturas ([capítulo 10](10-luma-pantalla-lluvia-y-organos-vivos.md#10-luma-pantalla-lluvia-hexadecimal-panel-criaturas-y-órganos-vivos)) ni el instalador y la
publicación ([capítulo 11](11-instalador-lanzador-y-publicacion.md#11-instalador-lanzador-y-publicación)). Las rutas son relativas a la raíz del proyecto y las citas tienen la forma `ruta:línea`.
Todo lo que no se pudo comprobar en el código queda marcado "(no verificado)".

---

## 1. Convenciones

### 1.1 Registros y llamada al núcleo

- `j14` vale 0 durante todo el programa: el generador emite `jldi j14, 0` al principio
  (`razar/cuerpo/gen_formas.py:219`) y todas las variables globales se direccionan como `jld rX, j14, desp`. Por
  eso toda variable global DEBE estar por debajo de `8000h` (el desplazamiento es de 16 bits con signo).
- Un pedido al núcleo se hace con la rutina `r_tocar` (`razar/cuerpo/gen_formas.py:1327-1329`): escribe en la cola
  fija `QUEUE` = `100h` la cuenta 1 (desplazamiento 0), el tipo `j10` (+8), el argumento `a` = `j11` (+16) y el
  argumento `b` = `j12` (+24); ejecuta `jsys j15, j13` con `j15` = 1 y devuelve la respuesta (+32) en `j13` y el
  campo `b` tal como volvió en `j12`. La tabla de pedidos está en el [capítulo 04](04-nucleo-abi-de-pedidos.md#8-tabla-resumen-de-pedidos).
- Pedidos de archivo: `r_file` (`razar/cuerpo/gen_formas.py:1072-1073`) arma `j10 = tipo | (FH << 32)`, donde `FH`
  es la variable global con el manejador abierto. Tipos usados: 5 leer, 6 escribir, 7 cerrar, 38 posicionar
  (`j11` = −1 lleva al final; 0 al principio). `r_open` (`razar/cuerpo/gen_formas.py:1096-1097`) hace el [pedido 4](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema)
  con `j11` = dirección de la etiqueta y `j12` = su longitud y deja el manejador (o −1) en `FH`. Abrir una etiqueta
  inexistente la crea (se usa así en `razar/cuerpo/gen_luma.py:308-309`, que borra "el archivo vacío que la
  pregunta creó").
- Reescritura completa de un archivo: [pedido 12](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) (borrar la etiqueta) seguido de `r_open` y escrituras. Anexado:
  `r_open`, [pedido 38](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) con −1, escritura.
- `r_alloc` (`razar/cuerpo/gen_comer.py:238-247`): pide `max(j1, 8)` bytes con el [pedido 2](04-nucleo-abi-de-pedidos.md#92-memoria-y-cajas) y devuelve la dirección
  en `j0`. Si el núcleo responde negativo y el generador tiene el gancho `LUMA.nomem`, salta a `fr_nomem`
  ([§7.2](#72-falta-de-memoria)); si no, termina con [`jhalt`](01-idioma-janax.md#103-salida-de-jhalt) y código `0BADh`.

### 1.2 Codificaciones de texto comunes

| Rutina | Codificación | Fuente |
|---|---|---|
| `r_put_num` | Decimal de ancho fijo `n`, dígitos ASCII, con ceros a la izquierda; se escribe el valor módulo 10^n (los dígitos altos se pierden). Sólo valores ≥ 0. | `razar/cuerpo/gen_formas.py:1043-1048` |
| `r_get_num` | Lee `n` caracteres; un carácter que no es dígito vale 0 en su posición. | `razar/cuerpo/gen_formas.py:1055-1063` |
| `r_put_hex` | Hexadecimal de ancho fijo, minúsculas (`a`–`f`), nibble más significativo primero. | `razar/cuerpo/gen_comer.py:262-269` |
| `r_get_hex` | Inversa de la anterior; acepta minúsculas. | `razar/cuerpo/gen_comer.py:270-279` |
| `r_put_rec` | Receta: 31 caracteres; la letra `v` (1..15) se escribe como el byte `48 + v` (`'1'`..`'9'`, `':'`, `';'`, `'<'`, `'='`, `'>'`, `'?'`); las posiciones sin letra, `'.'`. | `razar/cuerpo/gen_formas.py:1049-1054` |
| `r_get_rec` | Lee hasta 31 caracteres mientras el byte esté en `[49, 64)`; letra = byte − 48. Guarda la longitud en el byte 0 de la receta. | `razar/cuerpo/gen_formas.py:1064-1071` |
| `r_fnv` | [FNV-1a de 64 bits](02-ensamblador-pdp-y-construccion.md#161-fnv-1a-de-64-bits-fnv_basis-fnv-ensambladorjsm313-333) (base `CBF29CE484222325h`, primo `100000001B3h`) con el bit 0 forzado a 1 (nunca 0). | `razar/cuerpo/gen_comer.py:256-261` |

Una **receta** en memoria ocupa 32 bytes (48 en las zonas de candidatos): byte 0 = longitud `n` (≤ 31, `LMAX`,
`razar/cuerpo/gen_formas.py:49`), bytes 1..n = letras.

### 1.3 Etiquetas y nombres de archivo

Un archivo de la casa se nombra por su **etiqueta** (bytes UTF-8). En el anfitrión, [el nombre del archivo es la
etiqueta escrita en hexadecimal minúsculo](04-nucleo-abi-de-pedidos.md#102-de-etiqueta-a-nombre-de-archivo), dos dígitos por byte (`razar/cuerpo/luma.sh:24`,
`etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }`). La carpeta de la casa se entrega al núcleo con
la variable [`JANAX_ARCHIVOS`](03-nucleo-arranque-memoria-procesos.md#34-variables-de-entorno) (`razar/cuerpo/luma.sh:66`, `razar/cuerpo/luma.sh:93`).

---

## 2. Generación de `luma.jsm`

### 2.1 Generadores y salidas

| Generador | Salida si se ejecuta solo | Papel dentro de `luma.jsm` | Fuente |
|---|---|---|---|
| `gen_formas.py` | `formas.jsm` | Esqueleto del programa: memoria de la sala 0, tabla `G`, bucle principal, formas, juez, archivo de veredictos. | `razar/cuerpo/gen_formas.py:1337` |
| [`gen_comer.py`](10-luma-pantalla-lluvia-y-organos-vivos.md#1085-mutaciones-luma-las-de-gen_comerpy) | `comer_nubes.jsm` | Ganchos `COMER`: despensa, comidas, ladrillos, digestión de nubes. | `razar/cuerpo/gen_comer.py:1143-1147` |
| `gen_vida.py` | `vida.jsm` | Ejecutado como módulo (`VIDA_MOD`): criaturas, archivos `vida-*`. | `razar/cuerpo/gen_vida.py:46-51` |
| `gen_leer.py` | (ninguna; es un módulo) | `make()` devuelve los ganchos de lectura, mente, palabra, panel, pensadora y canto; incluye [`pulso.jsm`](06-razar-lectura-y-organos.md#2-programas-y-fuentes). | `razar/cuerpo/gen_leer.py:613`, `razar/cuerpo/gen_leer.py:8265-8267` |
| `gen_luma.py` | `luma.jsm` (y `luma.cables`) | Orquestador: ganchos `LUMA`, libertad, ingesta del disco, cámara, anillos. | `razar/cuerpo/gen_luma.py:1118-1121` |
| `gen_vivo.py` | `vivo.jsm` | No participa en `luma.jsm`. Escritorio vivo independiente. | `razar/cuerpo/gen_vivo.py:579-580` |

`gen_vivo.py` escribe en una ruta absoluta del proyecto (`razar/cuerpo/gen_vivo.py:579`) e imprime
`ok N lines, n particles, R rectangles` (`razar/cuerpo/gen_vivo.py:580`). El resto del capítulo trata sólo la
cadena de `luma.jsm`.

### 2.2 Orden de ejecución (mecanismo de ganchos)

1. `gen_luma.py` importa `gen_leer` (`razar/cuerpo/gen_luma.py:26`), define el espacio de nombres `LUMA`
   (`razar/cuerpo/gen_luma.py:1118-1119`) con `out = "luma.jsm"`, y ejecuta el texto de `gen_comer.py` con
   `LUMA` en su espacio global (`razar/cuerpo/gen_luma.py:1120-1121`).
2. `gen_comer.py` define `COMER` y ejecuta el texto de `gen_formas.py` en el espacio `NS`, que contiene `COMER` y
   `LUMA` (`razar/cuerpo/gen_comer.py:26`, `razar/cuerpo/gen_comer.py:1143-1147`).
3. `gen_formas.py` lee `aprendido.txt` y el [paisaje de órganos](06-razar-lectura-y-organos.md#127-paisaje-y-auditoría) ([§2.3](#23-entradas-leídas-al-generar)), fija constantes, y llama, en este orden:
   `COMER.layout()` y `LUMA.layout()` (`razar/cuerpo/gen_formas.py:137-140`); construye la tabla `G`
   (`razar/cuerpo/gen_formas.py:176-183`); `COMER.more_vars()` y `LUMA.more_vars()`
   (`razar/cuerpo/gen_formas.py:184-187`); emite la cabecera, `include '../../escalon0/janax.inc'` y
   `jfirst j1, ROOM` (`razar/cuerpo/gen_formas.py:215-219`); obtiene `RD = LUMA.reader(globals())`, que llama a
   `gen_leer.make(g, ST, 1430h)` (`razar/cuerpo/gen_luma.py:98-102`), y emite `RD.birth()` (despacho por papel,
   [§4.1](#41-un-binario-varios-papeles)); emite la inicialización (nube, tabla de bits, direcciones, paleta, motivos, semillas), `COMER.init()` y
   `LUMA.init()` (`razar/cuerpo/gen_formas.py:224-264`); el arranque de las formas y el bucle principal
   (`razar/cuerpo/gen_formas.py:265-368`); el manejo de eventos y todas las rutinas; al final `COMER.routines()`,
   `LUMA.routines(globals())` y `RD.finish(L)` (`razar/cuerpo/gen_formas.py:1331-1336`).
4. `LUMA.routines` (`razar/cuerpo/gen_luma.py:122-150`) ejecuta el texto de `gen_vida.py` con
   `VIDA_MOD = {off: 2000h, sw: 640, sh: 349, wx0: 320, cloud: <scloud>, init_tail, routines, siempre, ring_a,
   ring_d, ring_g, nomem: "fr_nomem"}`, toma sus líneas y antepone `v_` a toda etiqueta definida por `gen_vida`
   que no empiece ya por `v_` (sólo en la parte de código, no en comentarios). Luego emite, si `PRESENT`, las rutinas
   de anillo ([§8.2](#82-formato-anillo-anillo1)); después `RD.routines()`, `free_routine` ([§4.5](#45-ingesta-del-disco-r_host_eat)) y cuatro puentes `f_hash`, `f_tried`, `f_judge`, `f_put_rec` que
   llaman a `r_hash`, `r_tried`, `r_judge`, `r_put_rec`; por último anexa las líneas renombradas de las criaturas.
5. `RD.finish(L)` (`razar/cuerpo/gen_leer.py:8136-8183`): instala los cables vivos ([§2.8](#28-cables-vivos)), inserta [`pulso.jsm`](06-razar-lectura-y-organos.md#2-programas-y-fuentes)
   ([§2.7](#27-inclusión-de-la-lectora-y-alcance-de-saltos)) y resuelve el alcance de los saltos (§2.7).
6. `gen_formas.py` escribe `"\n".join(L) + "\n"` en `luma.jsm` con fin de línea LF e imprime
   `ok <len(L)> lines; seeds <s1 ... s8> ; towers [...] ; room 0 <ROOM>h`
   (`razar/cuerpo/gen_formas.py:1337-1338`).

### 2.3 Entradas leídas al generar

| Entrada | Uso | Fuente |
|---|---|---|
| `razar/cuerpo/aprendido.txt` | Líneas `organos <ruta>`, `torrecita <letras> <usos>`, `opuesto <a> <b> <n>`; `#` comenta. | `razar/cuerpo/gen_formas.py:19-29` |
| [Archivo de paisaje](06-razar-lectura-y-organos.md#127-paisaje-y-auditoría) nombrado por `organos` | Líneas `organo <letras> = <puntaje>`; se ordenan por puntaje descendente (estable); las 8 primeras son las semillas. | `razar/cuerpo/gen_formas.py:30-35`, `razar/cuerpo/gen_formas.py:47-48` |
| [`razar/lectura/organo.inc`](06-razar-lectura-y-organos.md#10-el-lector-de-órganos-organoinc) | [`ALPHA`](06-razar-lectura-y-organos.md#103-el-alfabeto) = FNV-1a (sin forzar bit) del archivo con CRLF→LF, desplazado 1 bit a la derecha. | `razar/cuerpo/gen_leer.py:219` |
| `gen_luma.py`, `gen_leer.py`, `gen_formas.py`, `gen_comer.py`, `gen_vida.py` y los 7 archivos `READER` de `razar/lectura` | Sello de construcción: SHA-256 de todos (CRLF→LF), primeros 8 bytes en little-endian, `>> 2 | 1`. | `razar/cuerpo/gen_leer.py:210`, `razar/cuerpo/gen_leer.py:220-225` |
| `razar/lectura/pulso.jsm` y `READER` | Texto de la lectora incluido y nombres para el renombrado `b_`. | `razar/cuerpo/gen_leer.py:8140-8147` |
| `razar/cuerpo/gen_comer.py` | `gen_luma` extrae `CLINE` por expresión regular. | `razar/cuerpo/gen_luma.py:199` |

Cada opuesto de `aprendido.txt` DEBE existir en la tabla `ACTIONS`; si no, el generador falla
(`razar/cuerpo/gen_formas.py:98-99`).

### 2.4 Variables de entorno del generador

| Variable | Efecto | Fuente |
|---|---|---|
| `LUMA_CALMA` | `ALWAYS` = falso: versión que se calma (sin "siempre viva"). | `razar/cuerpo/gen_luma.py:36` |
| `LUMA_PASADO` | `PRESENT` = falso: registros anexados en lugar de anillos. | `razar/cuerpo/gen_luma.py:41` |
| `LUMA_GALEOTE` | Sin `r_free_load` ni libertad: siempre piensa. | `razar/cuerpo/gen_luma.py:112`, `razar/cuerpo/gen_luma.py:1118` |
| `VIDA_CONTROL` | Control experimental: letras ofrecidas barajadas; melodía aleatoria. | `razar/cuerpo/gen_luma.py:1043`, `razar/cuerpo/gen_vida.py:104` |
| `VIDA_ESPERA`, `VIDA_DEBUG`, `VIDA_J0_CUADROS` | Pruebas del módulo de vida (`VIDA_ESPERA`: milisegundos entre cuadros en lugar de `FRAME_MS`; `VIDA_J0_CUADROS`: código de fin = `FRAMES` en lugar de `KEPT`). | `razar/cuerpo/gen_vida.py:278`, `razar/cuerpo/gen_vida.py:300`, `razar/cuerpo/gen_vida.py:1922` |
| `LUMA_PRUEBA_PLANO` | Escribe sus 8 formas "dichas planas" en `plano` (520 bytes cada una) y termina. | `razar/cuerpo/gen_formas.py:275-276`, `razar/cuerpo/gen_leer.py:7233-7240` |
| `LUMA_PRUEBA_PIEL` | Termina con `j0` = 0 tras crecer y guardar las formas. | `razar/cuerpo/gen_formas.py:282-283` |
| `LUMA_QUIETA` | Prueba: ninguna mutación gana. | `razar/cuerpo/gen_formas.py:826` |
| `LUMA_PRUEBA_E`, `LUMA_TECHO`, `LUMA_ALEGRIA` | Variantes del pago de la lectura (`UNICO` = ninguna de las dos últimas). | `razar/cuerpo/gen_leer.py:667-670` |
| `LUMA_CADENA`, `LUMA_RESPONDE`, `LUMA_CALLA`, `LUMA_IMAGINA`, `LUMA_LIBRE`, `LUMA_CONTESTA`, `LUMA_SEGUIR` | Compilaciones de prueba que fuerzan una rama de la conversación ([capítulo 09](09-luma-conversacion-y-respuesta.md#23-banderas-de-construcción-de-prueba)). | `razar/cuerpo/gen_leer.py:2159`, `razar/cuerpo/gen_leer.py:3435-3468`, `razar/cuerpo/gen_leer.py:4795`, `razar/cuerpo/gen_leer.py:5495`, `razar/cuerpo/gen_leer.py:5602-5605` |

### 2.5 La tabla general `G` y sus límites

`G` asigna a cada nombre de variable global una dirección de 8 bytes en la [sala 0](03-nucleo-arranque-memoria-procesos.md#63-primera-orden-la-sala-0): `G[nombre] = GV + 8·i`, con
`GV` = `200h`, en el orden de la lista literal de `razar/cuerpo/gen_formas.py:177-181`. La lista tiene 171
nombres; el último ocupa `750h`. Restricciones:

| Restricción | Valor | Fuente |
|---|---|---|
| `max(G) < FORMS` | `FORMS` = `800h`: como máximo 192 variables. | `razar/cuerpo/gen_formas.py:104`, `razar/cuerpo/gen_formas.py:183` |
| Variables de los [cables vivos](#28-cables-vivos) (`CB`) | 19 qwords desde `(max(G)+8+7)//8·8` = `758h` hasta `7E8h`; DEBE quedar `CB["NBF"]+8 ≤ 800h` y ninguna entrada de `G` en ese hueco. Quedan libres `7F0h` y `7F8h`. | `razar/cuerpo/gen_leer.py:8030-8032` |
| Variables de comer (`VARS` de `gen_comer`) | 103 nombres desde `CV` = `1A00h` (último `1D30h`); DEBE quedar `< MRECB` = `1D40h`. | `razar/cuerpo/gen_comer.py:82-97` |
| Tope común de formas y comidas | `max(G) < OFF + 200h` = `2200h`, y `XCANB`, `LHB`, `BLB` + `40h` ≤ `2200h`. | `razar/cuerpo/gen_luma.py:104-108` |
| Variables de vida (módulo) | 188 nombres desde `GV` = `200h + OFF` = `2200h` (último `27D8h`); DEBE quedar `< SIN` = `800h + OFF` = `2800h`. | `razar/cuerpo/gen_vida.py:78`, `razar/cuerpo/gen_vida.py:188-192` |

`GA` no es una tabla distinta: es un alias de `g["G"]` dentro de `gen_leer.py` (`razar/cuerpo/gen_leer.py:3565`)
usado para direccionar etiquetas guardadas en ranuras consecutivas de `G`. `r_read_init` escribe en ellas, en
little-endian y rellenadas con ceros, los bytes de las etiquetas (`razar/cuerpo/gen_leer.py:7583-7587`):

| Ranuras | Etiqueta | Bytes |
|---|---|---|
| `PQ` | `pregunta` | 8 |
| `PR1 PR2` | `respuesta` | 9 |
| `PB1 PB2 PB3` | `luma/pensadora.bin` | 18 |
| `PD1 PD2 PD3` | `luma/pensadora.datos` | 20 |
| `MCL` | `me-comi` | 7 |

Las variables de estado de la pensadora en `G` son `PENS` (1 en la pensadora), `PKID` (número del hijo + 1; 0 =
sin pensadora), `PBUSY`, `PTASK`, `PQBUF`, `PQLEN`, `PREADY` (`razar/cuerpo/gen_formas.py:181`).

### 2.6 Memoria fija

[Sala 0](03-nucleo-arranque-memoria-procesos.md#63-primera-orden-la-sala-0) de `gen_formas.py` (`razar/cuerpo/gen_formas.py:102-136`), antes de los ganchos:

| Símbolo | Dirección | Contenido |
|---|---|---|
| `QUEUE` | `100h` | Cola de un pedido (40 bytes). |
| `EV` | `140h` | Registro de evento: tipo (+0), x (+8), y (+16), extra (+24). |
| `GV` | `200h` | Tabla `G`. |
| `FORMS`, `FSZ` | `800h`, 256 | 8 formas de 256 bytes (campos `F_*`, `razar/cuerpo/gen_formas.py:141-144`). |
| `POPC` | `1000h` | Cantidad de bits de cada byte (256 bytes). |
| `OVL`, `OVC`, `ZORD`, `GHL`, `DIRT` | `1100h`, `1300h`, `1340h`, `1380h`, `13C0h` | Solapamientos, orden de dibujo, fantasmas, direcciones. |
| `CAND`, `TMP`, `TMP2` | `1400h`, `1440h`, `1480h` | Recetas de 48 bytes. |
| `SEEDR` | `1500h` | Semillas, 32 bytes cada una. |
| `TEXT` | `1600h` | Texto del archivo `formas` (399 bytes). |
| `LBL_F`, `LBL_A`, `MAGIC` | `1800h`, `1810h`, `1820h` | `formas`, `archivo`, `formas1 `. |
| `PAL`, `RSN`, `ALINE` | `1840h`, `1900h`, `1980h` | Paleta (8 × 3 qwords), motivos (16 bytes c/u), línea de archivo. |
| `BMPS`.. | `E400h`.. | Mapas de bits de 50 filas × 1 qword por forma. |
| `GRID`, `FBUF`, `HASH`, `PART0` | `10800h`, `14800h`, `20000h`, `80000h` | Mapa celda→partícula, lectura del archivo, tabla de probados, partículas (128 bytes c/u). |

`gen_comer.layout()` reubica regiones a partir de `ROOM` (incluida la [tabla de probados](10-luma-pantalla-lluvia-y-organos-vivos.md#1086-tabla-de-probados) de 2^21 ranuras,
`HBITS_C` = 21) (`razar/cuerpo/gen_comer.py:52-67`). `gen_luma.layout()` (`razar/cuerpo/gen_luma.py:75-96`) agrega
después, cada región alineada a 64 KB más 4 bytes para que los colores queden alineados a 8:

1. La [nube](05-nucleo-pantalla-teclado-vigia.md#41-formato-nube-versión-3-lo-que-lee-el-núcleo) de las formas: 160 × 100 celdas (`FW`, `FH`), cabecera de 28 bytes, 2000 bytes de bits, 48 000 de color.
2. La [pantalla compartida](10-luma-pantalla-lluvia-y-organos-vivos.md#102-geometría-de-la-pantalla) `SW × SH` = 640 × 349 (`SW = FW·ZOOM + 320`, `SH = 200 + PANEL_H`, `ZOOM` = 2,
   `PANEL_H` = 149) (`razar/cuerpo/gen_luma.py:52-64`).
3. La pantalla fina: `K = min(1280 // SW, 800 // SH)` = 2; `FSW × FSH` = 1280 × 698, y el panel fino
   (`FSW × PANEL_H·K` × 3 bytes) (`razar/cuerpo/gen_luma.py:70-71`, `razar/cuerpo/gen_luma.py:88-94`).
4. El **bloque libre** `ST["free"]`: 64 KB (`razar/cuerpo/gen_luma.py:95-96`).

`PANEL_H` = 149 se justifica en el código como el mayor alto que entra en una pantalla de 738 píxeles de área útil
con marco de 39 a escala 2 (`razar/cuerpo/gen_luma.py:57-61`); es una medición de un monitor concreto, no una
regla general. [`v_show`](10-luma-pantalla-lluvia-y-organos-vivos.md#1024-composición-de-un-cuadro-v_show) exige `ZOOM == 2` y `K == 2` (`razar/cuerpo/gen_luma.py:967`).

Datos de las [criaturas](10-luma-pantalla-lluvia-y-organos-vivos.md#1012-criaturas) en la sala 0, desplazados por `OFF` = `2000h` (`razar/cuerpo/gen_luma.py:72`), y zona de
salvado `SAVE` = `5000h` que copia las regiones `200h..800h` y `1A00h..1F80h` (`SAVES`) mientras una criatura dibuja con las
herramientas de las formas (`razar/cuerpo/gen_luma.py:1040-1042`, `razar/cuerpo/gen_luma.py:518-529`). Descriptores
de anillo en `RINGS` = `6600h` ([§8.2](#82-formato-anillo-anillo1)).

### 2.6.1 Bloque libre (`B` = `ST["free"]`)

Todas las direcciones son relativas a `B`. La parte baja la usa `gen_luma.py` (`razar/cuerpo/gen_luma.py:183-191`);
desde `1500h`, `gen_leer.py` (`razar/cuerpo/gen_leer.py:233-611`). `make()` exige `1430h ≤ R`,
`R + KEPT ≤ V`, `DBUF + DLEN ≤ 10000h` (`razar/cuerpo/gen_leer.py:619-620`).

| Desplazamiento | Nombre | Contenido |
|---|---|---|
| `0..37h` | `N0 S0 N1 S1 N2 S2 LASTF` | Cuentas de descanso, pensamiento y regalo; ritmo en cuadros. |
| `38h..97h` | `ACT W0 SENT WAITF F0 R0 LC1 LLB TCH WA WB WC` | Estado del acto en curso y pesos (`W0` = `WINS` al empezar a pensar). |
| `98h` (`8·19`) | `BUF` | 16 bytes (carta de Razar). |
| `A8h` | `LASTORG` | Último órgano usado. |
| `B0h..D8h` | `N3 PMARK WD FIRST TMPA TMPB` | Pintar, primer nacimiento. |
| `E0h`, `E8h`, `F0h` | `GIFTOK RSEL RSUM` | Resultado del regalo (2 ausente, 0 no tomado, 1 tomado). |
| `100h` | `PALS` | Paleta propia: 8 × 3 qwords (192 bytes). |
| `3F8h` | `NVIS` | Criaturas vistas. |
| `400h` | `TAB` | 255 entradas de 16 bytes `{dados, servidos}`; la 0 es Razar. |
| `1400h..1428h` | `N4 S4 SLEPT WE WOKE LDOR` | Dormir; `LDOR` guarda la etiqueta `dormir`. |
| `1500h` | `R`: `N5 S5 NI SI NO SO SHELF GENOME STAMP RBUD` | Cuentas de lectura, estante, genoma, sello. |
| `1550h` | `FT` | 8 lugares × `{leídas, ganadas}` (128 bytes). |
| `15D0h..15F8h` | `NS SS NL SL RSUM VICT` | Canciones, lentes, remado total, victorias. |
| `1600h` | `V..`: 32 qwords (`RKID RGOT RW1 RW2 ...`) | Estado de la lectora en curso. |
| `1700h` | `RREC` | Receta que se lee. |
| `1740h..17B0h` | `LRD LMOLD LBIN LDAT LCAR` | `leido`, `luma/lectora.molde`, `luma/lectora.bin`, `luma/lectora.datos`, `carta1`. |
| `17C0h`, `17E0h` | `WBUF`, `EBUF` | Buzón (16 bytes); línea de `leido` (48). |
| `1D50h..` | `NMASK NMROOM NMLEN DLR DWH BWS` | Nombre; sala de la palabra (`DLR`). |
| `1EA0h..` | `ULB ULN ...` | Turno de libros ([§8.8.7](#887-turno-y-rotación-de-libros)). |
| `2000h` | `PBUF` | 4096 bytes: firmas pendientes y textos temporales. |
| `4000h` | `LTAB` | L(k) = log2 C(2000, k) en milésimas de bit. |
| `8000h` | `DBUF` | Datos iniciales de la lectora (`DLEN` = `7F00h + 80h` bytes). |

`KEPT` = 80 + 16·8 + 48 = 256 bytes (`razar/cuerpo/gen_leer.py:241`) es lo que se guarda en `libre` desde `R`.

### 2.7 Inclusión de la lectora y alcance de saltos

`finish` (`razar/cuerpo/gen_leer.py:8136-8183`):

1. Llama a `cables_vivos(L)` ([§2.8](#28-cables-vivos)).
2. Lee [`pulso.jsm`](06-razar-lectura-y-organos.md#2-programas-y-fuentes); exige que la línea siguiente al `include` de `janax.inc` empiece por `jfirst j1, 10000h`.
3. Comprueba que ninguna etiqueta del cuerpo se defina dos veces, que todo `jjmp`, `jcall`, `jjz`, `jjnz`, `jjn`,
   `jjnn`, `jcall0` apunte a una etiqueta del cuerpo, de la lectora o a `lectora`, y que ni `lectora` ni
   `soy_cuerpo` estén definidas en los archivos de la lectora.
4. Toda etiqueta del cuerpo que coincida con un nombre definido en los archivos de la lectora se renombra con el
   prefijo `b_` (sólo en código).
5. Inserta, inmediatamente después de la única línea `jjmp lectora` (la de `RD.birth()`), el bloque: texto previo
   al `include` de `pulso.jsm`, la etiqueta `lectora:`, y el resto de `pulso.jsm` sin sus dos primeras órdenes,
   con cada `include 'x'` reescrito como `include '../lectura/x'`.
6. Llama a `reach(L)`.

`reach` (`razar/cuerpo/gen_leer.py:8185-8262`) cuenta palabras [como el ensamblador](02-ensamblador-pdp-y-construccion.md#13-pasadas-y-resolución-de-saltos) (una por línea de código que
empieza con `j`, salvo etiquetas y `jwcheck`, incluyendo archivos incluidos salvo `janax.inc`). [Un salto alcanza](01-idioma-janax.md#43-desplazamiento-de-salto) si
`destino − (posición + 1)` está en [−32768, 32767] palabras. Si alguno no alcanza, crea `K = max(2, ⌈n/30000⌉)` estaciones, cada una tras la primera línea
`jret`, `jjmp` o `jhalt` en la posición `n·(2j+1)/(2K)`; las referencias lejanas se redirigen a la estación más
cercana (`frK_nombre: jjmp nombre`, o a la estación siguiente si la distancia supera 30000). Repite el recuento
hasta 6 vueltas y termina en la primera sin saltos lejanos; si la sexta todavía encuentra alguno, falla aunque
acabe de crear estaciones. Imprime `luma: N saltos por K estaciones` en cada vuelta que crea estaciones.
El `luma.jsm` presente tiene 3 estaciones (`razar/cuerpo/luma.jsm:8765`, `razar/cuerpo/luma.jsm:34705`,
`razar/cuerpo/luma.jsm:61165`).

### 2.8 Cables vivos

`cables_vivos` (`razar/cuerpo/gen_leer.py:8023-8134`): toda etiqueta que sea destino de algún `jcall` se "traza":
tras la etiqueta se insertan `jst j1, j14, S1`, `jldi j1, <id>`, `jcall r_cable`. Los nombres trazados, ordenados,
reducidos a sus letras `A-Za-z`, se escriben uno por línea en `razar/cuerpo/luma.cables` (el presente tiene 479
líneas). `r_cable` marca un bit en una matriz `NC × NC` (rutina anterior → actual) y, si es nuevo, encola el par.
Archivos de la casa involucrados: [§8.8.15](#8815-cables).

### 2.9 Verificación al generar

La línea `ok N lines; ...` (`razar/cuerpo/gen_formas.py:1338`) es un informe, no una comprobación: `N` = cantidad
de líneas escritas en `luma.jsm`. El archivo presente tiene 74 460 líneas (medido con `wc -l`). Las comprobaciones
que detienen la generación son los `assert`:

| Comprobación | Fuente |
|---|---|
| Layout de formas (`RGB` alineado, regiones sin superposición, `FORMS_BYTES == 399`) | `razar/cuerpo/gen_formas.py:135-148` |
| `max(G) < FORMS`; motivos ≤ 15 caracteres; cabecera de nube de 28 bytes | `razar/cuerpo/gen_formas.py:183`, `razar/cuerpo/gen_formas.py:226`, `razar/cuerpo/gen_formas.py:250` |
| Variables de comer y de Luma bajo sus topes | `razar/cuerpo/gen_comer.py:94`, `razar/cuerpo/gen_luma.py:106-108` |
| Bloque libre y salas de `gen_leer` (`D_ROOM ≤ 8000h`, `IG_END < 8000h`) | `razar/cuerpo/gen_leer.py:526`, `razar/cuerpo/gen_leer.py:555`, `razar/cuerpo/gen_leer.py:619-620` |
| Hueco de `CB`; etiqueta única; saltos con destino; una sola `jjmp lectora`; 6 vueltas de `reach` | `razar/cuerpo/gen_leer.py:8032`, `razar/cuerpo/gen_leer.py:8152-8179`, `razar/cuerpo/gen_leer.py:8262` |
| Contornos a escala 2 | `razar/cuerpo/gen_luma.py:967` |

Otras líneas impresas: `luma: N lines of the creatures, M labels renamed v_...` (`razar/cuerpo/gen_luma.py:150`).

---

## 3. Construcción y arranque: `luma.sh`

Uso: `luma.sh <carpeta> [janaxos.exe] [carpeta de nubes] [carpeta de marchas]` (`razar/cuerpo/luma.sh:1`). Crea
`<carpeta>/bin` y `<carpeta>/casa` (`razar/cuerpo/luma.sh:23`). La función `armar` (`razar/cuerpo/luma.sh:25-57`):

1. Reensambla sólo si falta `bin/luma.bin` o `bin/pulso.datos`, o si `luma.jsm`, `razar/lectura/pulso.datos.jsm` o
   algún `razar/lectura/*.inc` es más nuevo que `bin/luma.bin`. El ensamblado lo hace
   `so/herramientas/armar.sh <janaxos> <bin> luma.jsm pulso.datos.jsm` ([capítulo 02](02-ensamblador-pdp-y-construccion.md#19-soherramientasarmarsh)).
2. Copia (sólo si difieren, `cmp -s`) `bin/luma.bin` a las etiquetas `luma/lectora.bin` y `luma/pensadora.bin`, y
   `bin/pulso.datos` a `luma/lectora.molde`.
3. Borra `engranajes` si existe y es más viejo que `bin/luma.bin` (los engranajes son del cuerpo anterior).
4. Si no existe `p`, lo crea con 16 bytes: `0A 00 00 00 00 00 00 00 01 01 00 00 01 01 00 00`. El comentario lo
   describe como "K 10, una lectura, despierta para siempre"; la interpretación de cada byte pertenece al [capítulo
   06](06-razar-lectura-y-organos.md#4-el-archivo-de-parámetros-p) (`razar/lectura/lectura.inc:156-179`).
5. Si `LUMA_LIBRO` está definida y no existen `libro` ni `elibro`, copia ese archivo como `libro`.

Dos modos (`razar/cuerpo/luma.sh:59-93`):

| Modo | Condición | Acciones | Ejecución |
|---|---|---|---|
| Casa propia | Existe la etiqueta `vida-memoria` | `armar` | `exec janaxos bin/luma.bin` con [`JANAX_VIGIA`](05-nucleo-pantalla-teclado-vigia.md#102-configuración) = `LUMA_VIGIA` (o una carpeta predeterminada fija del guion; `-` = ninguna), `JANAX_VENTANA_FONDO=1`, `JANAX_ARCHIVOS=<casa>`. |
| Casa con anfitrión | No existe `vida-memoria` | Escribe `despensa` ([§8.4.3](#843-despensa)) y `vida-lista` ([§8.9.1](#891-vida-lista-vida-memoria)); `armar` | `janaxos bin/luma.bin` con `JANAX_VENTANA_FONDO=1` y `JANAX_ARCHIVOS`; sin `JANAX_VIGIA`. |

`luma.sh` no coloca `luma/canto.bin`, `luma/cardumen.bin` ni `luma/cables.nombres`. El instalador coloca
`luma/canto.bin` y `luma/canto.datos`, ensamblados de `razar/cardumen/memoria_pares.jsm` y
`memoria_pares.datos.jsm` (`razar/instalador/instalar.asm:76-80`, `razar/instalador/armar_instalador.py:64`;
[capítulo 11](11-instalador-lanzador-y-publicacion.md#1158-conocimiento-y-archivos-de-la-casa)). Ningún archivo revisado coloca `luma/cardumen.bin` ni escribe `luma/cables.nombres` (no verificado
quién los crea). Sin `luma/cardumen.bin`, el [pedido 16](03-nucleo-arranque-memoria-procesos.md#92-lanzar-16) de `r_mus_init` falla y `MU_KID` queda en 0; sin
`luma/cables.nombres`, los cables vivos no se activan ([§8.8.15](#8815-cables)).

---

## 4. Procesos de Luma

### 4.1 Un binario, varios papeles

`luma.bin` es el mismo programa para todos los papeles. El papel se decide al nacer por el qword `20h` de los
datos iniciales (`razar/cuerpo/gen_leer.py:7155-7160`):

| Qword `20h` | Papel | Comportamiento |
|---|---|---|
| 0 (sin datos) | Cuerpo | Sigue por `soy_cuerpo`. |
| 2 | Pensadora | `PENS` = 1 y sigue por `soy_cuerpo` (misma inicialización); en `LUMA.init`, tras `RD.init()`, salta a `pz_go` (`razar/cuerpo/gen_luma.py:115`). |
| otro (1) | Lectora | `jjmp lectora`: el examen de `pulso.jsm` ([capítulo 06](06-razar-lectura-y-organos.md#9-el-examen-y-los-instintos)). |

Procesos:

| Proceso | Binario (etiqueta) | Datos iniciales | Quién y cuándo | [Pedido 16](03-nucleo-arranque-memoria-procesos.md#92-lanzar-16): derechos / longitud de etiqueta | [Huecos (42)](03-nucleo-arranque-memoria-procesos.md#124-huecos-42) | [Jaula (34)](03-nucleo-arranque-memoria-procesos.md#11-presupuesto-y-servicio) | [Firma heredada (45)](03-nucleo-arranque-memoria-procesos.md#104-herencia-de-firmas-45) | Fin |
|---|---|---|---|---|---|---|---|---|
| Cuerpo | `bin/luma.bin` (anfitrión) | ninguno | `luma.sh` | — | Sobre sí mismo: 1 si nadie usa la ventana, 0 si alguien la usa ([§4.3](#43-bucle-principal)) | — | — | Cierre de ventana (evento 5) o [`jhalt`](01-idioma-janax.md#103-salida-de-jhalt) |
| Lectora | `luma/lectora.bin` | `luma/lectora.datos` = `luma/lectora.molde` (se piden 8192 bytes; con menos de 64 leídos no se lanza) con la receta: `18h` y `30h` letras, `20h` = 1, `28h` genoma, `38h` = 0; palabras de sus 8 formas desde `DBUF + 7F00h` | Cuerpo, acto de leer (`fr_read`) | 14 (`R_MEM`+`R_READ`+`R_WRITE`) / 16 | 1 | Sólo si la receta tiene célula de tejido 8: `RSUM` instrucciones; sin `RSUM` no se lanza | No | Termina sola, o [pedido 33](03-nucleo-arranque-memoria-procesos.md#94-terminar-a-un-hijo-33) al cerrar (`r_read_end`) |
| Pensadora | `luma/pensadora.bin` | `luma/pensadora.datos`: 40 bytes, qword `20h` = 2 | Cuerpo, una vez al nacer (`r_pens_launch`) | 14 / 18 | Ninguno al lanzarla; luego uno por tarea ([§5.3](#53-secuencias)) | No | Sí: máscara `(1<<48) − 2` al próximo hijo | `jhalt` 0 cuando el [pedido 29](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) devuelve −1 (madre terminada) |
| Canto | `luma/canto.bin` | `r_canto` no escribe datos iniciales; el instalador coloca `luma/canto.datos` (`razar/instalador/instalar.asm:79-80`). Que el núcleo asocie ese archivo al binario por el nombre: (`so/datos.inc:10-42`, `so/datos.inc:90-115`) | Pensadora o cuerpo, en `r_canto` | 14 / 14 | 0 | 50 000 000 instrucciones | Sí, misma máscara | Termina sola; se sondea con el [pedido 19](03-nucleo-arranque-memoria-procesos.md#93-estado-19) |
| Cardumen | `luma/cardumen.bin` | Ninguno; tras lanzarlo el cuerpo le dice ([pedido 30](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas)) la palabra `(RNG & FFFFh) << 24 \| MU_N << 16 \| 5` (`razar/cuerpo/gen_leer.py:6215`) | Cuerpo, en `r_mus_init` (no en la pensadora) | 2 (`R_MEM`) / 17 | No pide | No pide | No | ([capítulo 07](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez)) |

Fuentes: lectora `razar/cuerpo/gen_leer.py:7849-7878`; pensadora `razar/cuerpo/gen_leer.py:3566-3587`; canto
`razar/cuerpo/gen_leer.py:6726-6736`; cardumen `razar/cuerpo/gen_leer.py:6207-6216`. El [pedido 16](03-nucleo-arranque-memoria-procesos.md#92-lanzar-16) se arma como
`j10 = 16 | (derechos << 32)`, `j11` = etiqueta, `j12` = longitud; el número de hijo devuelto se guarda más 1
(`PKID`, `RKID`, `MU_KID`). Los valores de derechos se interpretan con `R_SCREEN` = 1, `R_MEM` = 2, `R_READ` = 4,
`R_WRITE` = 8 ([capítulo 04, §7.1](04-nucleo-abi-de-pedidos.md#71-porteros)).

**Firmas.** Los pedidos importantes de un hijo esperan la firma de la madre ([capítulo 04, §7.3](04-nucleo-abi-de-pedidos.md#73-pedidos-importantes-y-firma-del-padre)). El cuerpo, en
`r_read_poll` (`razar/cuerpo/gen_leer.py:7884-7903`), si hay pensadora, pide la lista de pendientes ([pedido 18](04-nucleo-abi-de-pedidos.md#96-familia),
destino `PBUF`, 4096 bytes; entradas de 24 bytes cuyo primer qword es el número de registro) y firma cada una
([pedido 17](04-nucleo-abi-de-pedidos.md#96-familia) con `b` = 1); hace lo mismo con la lectora mientras lee. La [firma heredada (45)](04-nucleo-abi-de-pedidos.md#74-firmas-heredadas) se pide antes de lanzar
la pensadora y el canto.

**Supuesto sobre números de cabina.** La pensadora dirige sus palabras a `fam` = 0 y sólo acepta palabras cuyo
remitente sea 0 (`razar/cuerpo/gen_leer.py:3659`, `razar/cuerpo/gen_leer.py:3664`); el cuerpo [pide huecos](03-nucleo-arranque-memoria-procesos.md#124-huecos-42) sobre
"sí mismo" con `a` = 0 (`razar/cuerpo/gen_formas.py:341-343`). Ambos suponen que el cuerpo es la [cabina](03-nucleo-arranque-memoria-procesos.md#5-procesos-cabinas) 0
(`so/janaxos.asm:1339-1343`, `razar/cuerpo/luma.sh:66`, `razar/cuerpo/luma.sh:93`).

### 4.2 Nacimiento del cuerpo

Orden emitido (`razar/cuerpo/gen_formas.py:217-283`, `razar/cuerpo/gen_luma.py:110-120`,
`razar/cuerpo/gen_leer.py:7162-7169`, `razar/cuerpo/gen_comer.py:113-118`):

1. Despacho por papel ([§4.1](#41-un-binario-varios-papeles)).
2. Cabecera y bits de la nube de las formas; tabla `POPC`; direcciones, paleta, motivos, etiquetas `formas`,
   `archivo`, `formas1 `; semillas; `RNG` = `2545F4914F6CDD1Dh`, `RADIUS` = 1, `EXPLORE` = 1.
3. `COMER.init`: motivo 6 `meal-climb`, etiquetas `despensa`, `comidas`, `ladrillos`; `r_food_load`;
   `r_load_former`.
4. `LUMA.init`: `v_init` (mundo de criaturas); `r_free_load` (salvo `LUMA_GALEOTE`); `RD.init()` =
   `r_un_libro`, `r_cable_init`, `r_nombre_load`, `r_dlg_load`, `r_gustos_load`, `r_mus_init`, `r_read_init`;
   si `PENS`, salto a `pz_go`; si no, `r_pens_launch` y `r_host_eat`; con `PRESENT`, el descriptor del anillo
   `RING_F` (K = 4096, longitud 112).
5. `r_load_forms`; por cada forma, su origen en el centro de su cuarto y `r_regrow`; `r_recompute`;
   `r_clear_hash`; `r_load_archive`; `r_new_walk`; `r_save_forms`.

Como la pensadora recorre los pasos 1–4 hasta `RD.init()` inclusive, también ejecuta `r_un_libro` ([§8.8.7](#887-turno-y-rotación-de-libros)),
`v_init` y `r_free_load` al nacer. Si existe `turno`, esto vuelve a rotar los libros en la casa después de que
el cuerpo lo hizo (consecuencia deducida del orden del código; no verificada en ejecución).

### 4.3 Bucle principal

`main` (`razar/cuerpo/gen_formas.py:287-368`): espera un evento con el [pedido 41](05-nucleo-pantalla-teclado-vigia.md#8-esperar-un-evento-pedido-41) (`a` = `EV`, `b` = `REMAIN`
milisegundos, −1 = para siempre; el `b` devuelto se guarda en `BLEFT`). Respuesta < 0: `jhalt 0BADh`. Respuesta 0
sin evento (`main_time`, `razar/cuerpo/gen_formas.py:299-306`): si `BLEFT` ≠ 0 (el núcleo la despertó antes de
tiempo: buzón, lectora o vigía), `r_read_poll`, `r_host_eat`, `REMAIN` = `BLEFT` y vuelta a esperar; si
`BLEFT` = 0 y `FOREVER` = 0, cuadro; si `BLEFT` = 0 y `FOREVER` ≠ 0 (una espera infinita que terminó: no hay
ventana), `jhalt` con `j0` = `WINSRUN`. Con evento: `CHANGED` = 0 y `r_handle`; después, si `FOREVER` = 0,
`REMAIN` = `BLEFT` y cuadro si es 0; si `FOREVER` ≠ 0, cuadro sólo si el evento puso `CHANGED`.

Un cuadro (`frame`): `r_read_poll`, `r_step`, `r_meal_step`, `v_frame`, exploración si nada se mueve, dibujo,
[`v_show`](10-luma-pantalla-lluvia-y-organos-vivos.md#1024-composición-de-un-cuadro-v_show), `FRAMES`++. **Esencia**: si `SEEN` = 0 (nadie usa la ventana) y `GAPME` = 0, pide [42](03-nucleo-arranque-memoria-procesos.md#124-huecos-42) sobre sí misma con
`b` = 1; si `SEEN` ≠ 0 y `GAPME` = 1, lo pide con `b` = 0. Si algo se mueve o explora, `r_dlg_mind` y nuevo cuadro
a `FRAME_MS` = 33 ms. Si no queda nada: `r_hungry` ([comer la próxima nube](10-luma-pantalla-lluvia-y-organos-vivos.md#10102-hambre-y-lectura)); si no come, `r_free` ([§4.4](#44-libertad-elección-de-actos-r_free)) y otro
cuadro.

[`r_handle`](10-luma-pantalla-lluvia-y-organos-vivos.md#1033-despacho-r_handle-en-luma) (`razar/cuerpo/gen_formas.py:372-399`): [evento 8](05-nucleo-pantalla-teclado-vigia.md#62-tipos-de-evento) = ventana en uso o no (`SEEN` = `EV+24`); eventos 1,
5 y 6 no marcan compañía; los demás ponen `SEEN` = 1. Luego `v_event` (lado de las criaturas). Evento 5 (cierre):
`r_read_end` y `jhalt` con `j0` = `WINSRUN`. Eventos 2 botón abajo, 3 arriba, 1 movimiento, 4 tecla, 7 carácter.

### 4.4 Libertad: elección de actos (`r_free`)

`r_free` (`razar/cuerpo/gen_luma.py:377-502`) se llama cuando no queda nada que probar. Primero `r_host_eat` y
`r_pens_free` ([§5.3](#53-secuencias)). En la primera llamada de una vida: `FIRST` = 1, `WOKE` = `SLEPT`, `SLEPT` = 0, y si
`WOKE` ≠ 0 y `NEWST` ≠ 0 (sello de construcción distinto del guardado, `razar/cuerpo/gen_leer.py:7588`),
`S4`++; si `PMARK` ≠ 0 restaura la paleta `PALS`.

Liquidación del acto anterior:

| Acto (`ACT`) | Condición de fin | Paga (S++) si | Fuente |
|---|---|---|---|
| 1 descanso | `WAITF` llega a 0 decrementando por llamada, o cambia `RADIUS` (un gesto) | Hubo gesto (`TCH`) | `razar/cuerpo/gen_luma.py:392-399` |
| 2 pensar | En la siguiente llamada; `LASTF` = `FRAMES − F0` | `WINS` cambió (con `LUMA_ALEGRIA`: `CHN` cambió) | `razar/cuerpo/gen_luma.py:400-405` |

Elección: si `LASTF` = 0, piensa. Si no, cada acto tiene un peso `W = (2S + 1)·2^20 / (N + 1)` (estimador de
Krichevsky–Trofimov `(S + 1/2)/(N + 1)` escalado por 2^21); pintar usa `S` = 0 siempre. Se sortea
`r ∈ [0, ΣW)` con `r_randmod` y se recorre en este orden (`razar/cuerpo/gen_luma.py:409-426`):

| Orden | Acto | `N`, `S` | Efecto |
|---|---|---|---|
| 1 | descanso (`fr_rest`) | `N0`, `S0` | `WAITF` = `LASTF`, `R0` = `RADIUS`. |
| 2 | pensar (`fr_think`) | `N1`, `S1` | Guarda `WINS`, `FRAMES`, `CHN`; `r_gesture` (nueva ronda). |
| 3 | regalar (`fr_give`) | `N2`, `S2` | Elige criatura por los mismos pesos sobre `TAB[1..NVIS]` (tope 254) y forma al azar; `v_gift_to`. Ausente: deshace cuentas y piensa. Luego descanso o pensar según `WA:WB`. |
| 4 | pintar (`fr_paint`) | `N3`, — | Elige una comida al azar entre `ATE`, toma un color al azar de su línea de `comidas` ([§8.4.4](#844-comidas-líneas-de-537-bytes)) y lo aplica a la forma que alimentó; copia `PAL` a `PALS`; `PMARK` = 1. |
| 5 | dormir (`fr_sleep`) | `N4`, `S4` | [§7.1](#71-dormir). |
| 6 | hablar primero | `D_*` ([capítulo 09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta)) | `RD.dialogo_act()`. |
| 7 | leer (`fr_read`) | `N5`, `S5` | Lanza la lectora si no hay otra (`razar/cuerpo/gen_leer.py:8003-8021`). |

Después de liquidar o de regalar/pintar se guarda `libre` (`r_free_save`, [§8.5.1](#851-libre-4640-bytes-binarios)).

### 4.5 Ingesta del disco (`r_host_eat`)

Se llama al nacer, en cada `r_free` y cuando la espera del bucle principal vuelve con tiempo sobrante
(`razar/cuerpo/gen_luma.py:247-376`). Sala propia [`HOSTR`](10-luma-pantalla-lluvia-y-organos-vivos.md#10112-habitación-hostr) de `HE_X + 64` bytes (`HE_X` = 128 + 4096 + 65 536 =
69 760), reservada en la primera llamada: manejador del anfitrión (+0), longitud de la ruta (+8), huella FNV-1a del
contenido (+16), puesto a 0 (+24), bytes leídos del libro existente − 8 (+32), desplazamiento y longitud de la
etiqueta elegida (+40, +48), `e` de espera (+63), etiqueta `libro-disco-<hex>` (+64), etiqueta
`registro-disco-<hex>` (+96), ruta (+128, 4096 bytes), trozo de archivo (+4224, 65 536 bytes); en `+HE_X`: tamaño
actual (+0), huella y tamaño del libro existente (+8, +16) y contadores de la prueba de registro (+24..+56).

1. [Pedido 39](05-nucleo-pantalla-teclado-vigia.md#108-entrega-pedido-39) (`a` = ruta, `b` = 4096): la próxima ruta nueva y quieta del [vigía](05-nucleo-pantalla-teclado-vigia.md#10-vigía-y-centinela). ≤ 0: fin.
2. Nombre final (tras el último `/` o `\`): si tiene longitud par > 0 y sólo `0-9a-f`, es la casa de otro ser y se
   deja.
3. Etiqueta `libro-disco-` + 16 hex de FNV-1a (sin forzar bit) de los bytes de la ruta (28 bytes).
4. [Pedido 37](04-nucleo-abi-de-pedidos.md#94-salidas-al-anfitrión) (abrir en el anfitrión, sólo lectura); se lee en trozos de 64 KB acumulando FNV-1a del contenido y
   el tamaño. Un byte 0 en cualquier trozo: no es texto; se cierra y se descarta.
5. Se abre `registro-disco-<hex>` (31 bytes) y se piden 8 bytes. Si se leen exactamente 8, es un registro conocido
   y se deja sin comer. Si no, se borra ([pedido 12](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema)) el archivo vacío que la apertura creó y se sigue.
6. Se busca el libro como `libro-disco-<hex>` y como `elibro-disco-<hex>` (29 bytes), leyendo 16 bytes de cada uno;
   existe si se leen 16, y si no, se borra el archivo vacío creado al abrir. Si existe con la misma
   huella: nada. Si existe con otra huella: prueba de registro (`he_record`) y, si no lo es, se reescribe en
   silencio. Si no existe: se escribe y se dice `me comí <ruta>` como línea del tipo 1 en `me-comi` ([§8.6.1](#861-dialogo-me-comi-charla-libros)).
7. **Prueba de registro** (`razar/cuerpo/gen_luma.py:334-374`): si el tamaño nuevo ≥ el anterior > 0, la FNV-1a de
   los primeros `tamaño anterior` bytes es igual a la huella anterior, y más de la mitad de las líneas no vacías
   empiezan con un dígito o tienen `:` en su primera palabra, el libro se borra y se escribe como
   `registro-disco-<hex>` (mismo formato, [§8.8.18](#8818-registro-disco-16-hex)).

---

## 5. Protocolo cuerpo ↔ pensadora

### 5.1 Canales

| Canal | Sentido | Contenido |
|---|---|---|
| Archivo `pregunta` | cuerpo → pensadora | Bytes de lo que escribió el usuario (reescrito en cada envío). |
| Archivo `respuesta` | pensadora → cuerpo | La respuesta única de la pensadora (reescrita en cada tarea). |
| [Pedido 30](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) (decir) | ambos | Una palabra de 64 bits a una cabina de la [familia](03-nucleo-arranque-memoria-procesos.md#9-familia-de-procesos). |
| [Pedido 31](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) (oír) | ambos | Destino de 16 bytes en `B + WBUF`: +0 remitente, +8 palabra. Respuesta 1 = hubo palabra. La pensadora pasa `b` = 16; el cuerpo, `b` = 0. |
| [Pedido 29](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) | pensadora | Duerme hasta un saludo; −1 = no queda quien pueda hablarle. |
| Archivo `lista` | pensadora (vía cuerpo) → casa | Señal de pensadora lista ([§5.4](#54-la-señal-lista)). |

Palabras:

| Valor | Emisor → receptor | Significado |
|---|---|---|
| 1 | cuerpo → pensadora | Pregunta del usuario: leer `pregunta` y responder. |
| 2 | cuerpo → pensadora | Estudio: una línea de un libro de la casa (`r_self_talk`). |
| 3 | cuerpo → pensadora | Hablar primero (`r_dlg_talk`). |
| 4 | pensadora → cuerpo | Hecho: `respuesta` está escrita. |
| 5 | pensadora → cuerpo | Lista (nacida y esperando). |

### 5.2 Estado del cuerpo

| Variable | Valores | Significado |
|---|---|---|
| `PKID` | 0, o hijo + 1 | 0 = no hay pensadora: el cuerpo hace todo. |
| `PREADY` | 0 / 1 | 1 tras recibir la palabra 5. |
| `PBUSY` | 0 / 1 | 1 desde que se envía una tarea hasta que llega una palabra distinta de 5. |
| `PTASK` | 1, 2, 3 | Última tarea enviada. |
| `PQBUF`, `PQLEN` | sala de 1024 bytes, bytes | Líneas del usuario acumuladas mientras la pensadora está ocupada, separadas por un espacio; el total se trunca en 1000 bytes (`brg_cp` con tope 1000). |

Máquina de estados (las transiciones citan su rutina):

```
SIN_PENSADORA (PKID=0)
   └─ r_pens_launch ok ─► DESPERTANDO (PKID≠0, PREADY=0, PBUSY=0)
DESPERTANDO
   └─ palabra 5 de PKID−1 ─► LIBRE (PREADY=1) + r_lista
LIBRE
   └─ r_pens_say(t) ─► OCUPADA (PBUSY=1, PTASK=t)
OCUPADA
   ├─ Enter del usuario ─► OCUPADA (línea anexada a PQBUF)
   └─ palabra ≠5 de PKID−1 ─► r_pens_done ─► LIBRE; si PQLEN>0, envía PQBUF como tarea 1 ─► OCUPADA
```

### 5.3 Secuencias

**Lanzamiento** (`r_pens_launch`, `razar/cuerpo/gen_leer.py:3566-3587`):
1. Borra (12) y crea `luma/pensadora.datos` (si la apertura falla, termina sin pensadora); reserva una sala de 48
   bytes, escribe sus primeros 40 con el qword `20h` = 2, cierra y libera la sala con el [pedido 3](04-nucleo-abi-de-pedidos.md#92-memoria-y-cajas) (`a` = sala,
   `b` = 0), el mismo con que `r_un_libro` libera su lista (`razar/cuerpo/gen_leer.py:7146-7147`).
2. [Pedido 45](03-nucleo-arranque-memoria-procesos.md#104-herencia-de-firmas-45) (`a` = 0, `b` = `(1<<48) − 2`).
3. [Pedido 16](03-nucleo-arranque-memoria-procesos.md#92-lanzar-16) con derechos 14, etiqueta `luma/pensadora.bin` (18). Fallo: fin, `PKID` = 0.
4. `PKID` = hijo + 1, `PBUSY` = 0; reserva `PQBUF` (1024), `PQLEN` = 0.
5. `r_esperando`: pide el [título de ventana (43)](05-nucleo-pantalla-teclado-vigia.md#59-título-pedido-43) con el texto de 45 bytes `Luma esta despertando: todavia no le
   escribas` (`razar/cuerpo/gen_leer.py:6225-6277`).

**Envío de una tarea** (`r_pens_say`, `razar/cuerpo/gen_leer.py:3588-3597`): si `PBUSY`, no hace nada. Si no,
`PBUSY` = 1, `PTASK` = t; [pedido 42](03-nucleo-arranque-memoria-procesos.md#124-huecos-42) sobre el hijo con `b` = 0 si t = 1 y `b` = 1 en otro caso; [pedido 30](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) al hijo
con la palabra t.

**Su pregunta** ([`r_pens_ask`](09-luma-conversacion-y-respuesta.md#32-cuerpo--pensador-r_pens_ask), `razar/cuerpo/gen_leer.py:3599-3626`): si `PKID` = 0 o `PREADY` = 0, responde el
cuerpo ([`r_dlg_sent`](09-luma-conversacion-y-respuesta.md#4-recepción-del-turno-r_dlg_sent)). Si no: copia lo escrito a `D_OUT` (se muestra en el [panel](10-luma-pantalla-lluvia-y-organos-vivos.md#105-panel)); si `PBUSY`, lo anexa a `PQBUF`;
si no, `pna_send`: borra y escribe `pregunta`, [`r_rain_dice`](09-luma-conversacion-y-respuesta.md#18-la-lluvia-como-dados) ([§6.1](#61-archivos)), `r_pens_say(1)`. Mientras la pensadora no está
lista, las teclas que escriben no se toman (`razar/cuerpo/gen_leer.py:5948`).

**Estudio** (`r_pens_free`, `razar/cuerpo/gen_leer.py:3627-3634`): al terminar un acto, si `PREADY` = 0 el cuerpo
estudia solo (`r_self_talk`); si hay algo escrito pendiente o `SEEN` ≠ 0, nada; si no, `r_pens_say(2)`.

**Hablar primero** (`r_dlg_talk`): si `SEEN` ≠ 0 no hace nada; si no, con `PREADY`, `r_pens_say(3)`, y sin
`PREADY` habla el propio cuerpo (`razar/cuerpo/gen_leer.py:5829-5831`).

**Recepción** (`r_mus_mail` → `r_mus_from`, `razar/cuerpo/gen_leer.py:6220-6294`): el cuerpo vacía su buzón con el
[pedido 31](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) (`a` = `B + WBUF`, `b` = 0) en cada `r_read_poll`: sin lectora, por `r_mus_mail`; con lectora, en
`pl_words`, donde las palabras cuyo remitente no es la lectora pasan a `r_mus_from`
(`razar/cuerpo/gen_leer.py:7901-7906`). Palabra de `PKID − 1`: si es 5, `PREADY` = 1 y `r_lista`; cualquier otra,
`r_pens_done`. Palabras de `MU_KID − 1` van al [cardumen](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez) (`r_mus_word`); otras se descartan.

**Respuesta** (`r_pens_done`, `razar/cuerpo/gen_leer.py:3635-3657`): `PBUSY` = 0; lee hasta 1000 bytes de
`respuesta`. Vacía o error: nada. Si `PTASK` = 2 y los primeros 8 bytes y la longitud son iguales a los de la
última (`PL8`, `PLL`), se ignora; si no, va al [flujo de la mente](10-luma-pantalla-lluvia-y-organos-vivos.md#1055-flujo-de-la-mente-d_flb) (tipo 1). Si `PTASK` ≠ 2: si es igual a lo que ya
dice, se ignora; si no, pasa a ser su última palabra (`D_OUT`). Después, si `PQLEN` > 0, envía lo encolado.

### 5.4 La señal "lista"

`r_lista` (`razar/cuerpo/gen_leer.py:6278-6288`): borra y escribe el archivo de etiqueta `lista` con los 5 bytes
`lista`; `CHANGED` = 1; `r_nombre_titulo` ([pedido 43](05-nucleo-pantalla-teclado-vigia.md#59-título-pedido-43) con su nombre). El archivo no se borra en ninguna rutina
revisada; su presencia indica que alguna vida llegó a tener la pensadora lista, no que la actual lo esté.

### 5.5 Bucle de la pensadora

`pz_go` (`razar/cuerpo/gen_leer.py:3658-3703`):

1. [Pedido 30](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) a `fam` 0 con la palabra 5.
2. `pz_wait`: [pedido 31](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) (`a` = `WBUF`, `b` = 16). Si responde 1 y el remitente es 0, atiende la palabra; si el
   remitente no es 0, vuelve a esperar. Si no hay palabra: [pedido 29](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas); si devuelve −1, `jhalt` con 0.
3. Palabra 1: lee hasta 1000 bytes de `pregunta` en `D_IN` (vacío o error: va a `pz_done`); con `ANSW` = 1 llama a
   [`r_dlg_sent`](09-luma-conversacion-y-respuesta.md#4-recepción-del-turno-r_dlg_sent) y vuelve `ANSW` a 0. Si `WHOR` ≠ 0, `D_RPL` ≠ 0 y la [respuesta única](09-luma-conversacion-y-respuesta.md#197-respuesta-única-y-flujo) no está vacía, anexa a
   `trato-<libro>` ([§8.6.2](#862-trato-libro)) `vos: ` + `D_RP` (`D_RPL` bytes, lo dicho por el usuario) + `\nluma: ` + respuesta + `\n`.
   Palabra 2: `r_self_talk`. Palabra 3: `r_dlg_talk`. Otra: nada.
4. `pz_done`: `r_dlg_mind`; borra y escribe `respuesta` con la respuesta única; [pedido 30](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) a `fam` 0 con la
   palabra 4; vuelve a 2.

La pensadora no dibuja (`razar/cuerpo/gen_leer.py:5225`) ni lanza cardumen (`razar/cuerpo/gen_leer.py:6209`).

---

## 6. Protocolo con el canto

### 6.1 Archivos

[`r_canto`](09-luma-conversacion-y-respuesta.md#11-las-costumbres-r_canto) (`razar/cuerpo/gen_leer.py:6628-6739`) usa una sala `LNR` de `C000h` bytes con sus etiquetas a partir de
`LN_LBL` = `B000h` (`razar/cuerpo/gen_leer.py:6550-6551`):

| Etiqueta | Escrito por | Formato |
|---|---|---|
| [`pares`](07-razar-cardumen-canto-hilos.md#23-formato-de-pares) | quien canta | Por cada ejemplo `k`: `P: <línea codificada>\n` y `R: <lo que sigue codificado>\n`. |
| `canta` | quien canta | `<lo que dijo el usuario, codificado>\n`. |
| `razona` | quien canta | `1\n`. |
| [`cantado`](07-razar-cardumen-canto-hilos.md#28-dados-y-cantado-contrato-con-quien-lo-lanza) | se vacía antes (0 bytes); lo escribe el canto | Letras cantadas; se leen hasta 1000 bytes. |
| [`dados`](10-luma-pantalla-lluvia-y-organos-vivos.md#1046-archivo-dados) | cuerpo, en `pna_send` | [La lluvia hexadecimal](10-luma-pantalla-lluvia-y-organos-vivos.md#104-lluvia-hexadecimal): `RNLN × RLW` = 38 × 52 = 1976 bytes, por filas; cada byte es espacio o un dígito hexadecimal ASCII (`razar/cuerpo/gen_leer.py:6434-6435`, `razar/cuerpo/gen_leer.py:6896-6909`). |
| `luma/canto.bin` | instalador | [Programa del canto](07-razar-cardumen-canto-hilos.md#2-memoria_paresjsm-el-núcleo-de-pares-y-el-canto). |

**Codificación de una línea** (`ln_emit`, `razar/cuerpo/gen_leer.py:6598-6614`): cada palabra se reemplaza por la
letra de su clase seguida de un espacio. Las clases se forman por [la regla del hueco](09-luma-conversacion-y-respuesta.md#114-regla-de-cobertura-de-una-costumbre-por-clase-del-hueco) (`ln_class`): dos palabras con
la misma palabra anterior y la misma siguiente (el inicio y el fin de línea cuentan como palabras) son de una clase.
La primera vez que se emite una clase recibe la letra `96 + m` (`a`..`z`) para m = 1..26 y `165 + m` para
m = 27..49; con m > 49 la palabra no se emite. Topes: 1000 tokens, 500 palabras distintas.

**Registro de un ejemplo** en la sala [`EXR`](09-luma-conversacion-y-respuesta.md#23-la-sala-de-ejemplos-exr) (1024 bytes por ejemplo, hasta 7: `PL_BASE` = 7·1024):

| Desplazamiento | Campo |
|---|---|
| +0 | Bytes de lo que sigue. |
| +8 | Bytes de la línea. |
| +16 | Lo que sigue (hasta 480 bytes). |
| +516 | Línea (hasta 480 bytes). |

Fuente: `razar/cuerpo/gen_leer.py:6649-6650`, `razar/cuerpo/gen_leer.py:2436`, `razar/cuerpo/gen_leer.py:2861-2870`.

### 6.2 Secuencia

1. Recorre los `EXN` ejemplos y la línea del usuario (`D_RP`, `D_RPL`); clasifica.
2. Si un ejemplo tiene exactamente las mismas palabras que lo dicho y no fue dicho ya en la ventana final de
   [`dialogo`](#861-dialogo-me-comi-charla-libros) (4096 bytes), devuelve lo que sigue tal cual, sin cantar.
3. Según [`CNB`](09-luma-conversacion-y-respuesta.md#28-valores-de-cnb) (`razar/cuerpo/gen_leer.py:6686-6710`):
   - `CNB` = 5: pone `CNB` = 1 y va a `rc_no` (sin canto).
   - `CNB` = 3: pone `CNB` = 1 y sigue al paso 4.
   - Otro valor: busca las palabras de lo dicho (de más de 3 bytes, con clase propia) que ningún ejemplo cubre en
     su línea. Si hay alguna, las deja en `D_WORDS` (`D_NW` = cuántas), pone `CNB` = 2 y devuelve `j0` = 0. Si no
     hay ninguna, pone `CNB` = 0 y va a `rc_no`.
   `rc_no` (`razar/cuerpo/gen_leer.py:6779`) devuelve lo que sigue del ejemplo cuya línea tiene menos palabras no
   dichas por el usuario, salteando los ya dichos (`rc_said`); si ya los dijo todos y `CNB` = 0, pone `CNB` = 1 y sigue al paso 4 (canto); si `CNB` ≠ 0, uno al azar entre los `EXN` (`razar/cuerpo/gen_leer.py:6800`, `razar/cuerpo/gen_leer.py:6802`).
4. Escribe `pares`, `canta`, `razona` y vacía `cantado` (cada uno con [pedido 12](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) y escritura).
5. [Pedido 45](03-nucleo-arranque-memoria-procesos.md#104-herencia-de-firmas-45) con `(1<<48) − 2`; [pedido 16](03-nucleo-arranque-memoria-procesos.md#92-lanzar-16) con derechos 14 y etiqueta `luma/canto.bin` (14 bytes) → `NME`.
6. [Pedido 34](03-nucleo-arranque-memoria-procesos.md#11-presupuesto-y-servicio) sobre `NME` con 50 000 000 instrucciones; [pedido 42](03-nucleo-arranque-memoria-procesos.md#124-huecos-42) sobre `NME` con 0.
7. Repite el [pedido 19](03-nucleo-arranque-memoria-procesos.md#93-estado-19) sobre `NME` mientras responda −1 (corriendo). No espera palabra alguna del canto.
8. Lee `cantado` (hasta 1000 bytes); decodifica cada letra ≥ 33 a una palabra de su clase: la que dijo el usuario si es
   particular, si no la primera de la clase (`razar/cuerpo/gen_leer.py:6740-6761`, continúa en el [capítulo 09](09-luma-conversacion-y-respuesta.md#11-las-costumbres-r_canto)).

El límite de 50 000 000 instrucciones se fija en el código como cien veces lo medido (515 389) con siete ejemplos
(`razar/cuerpo/gen_leer.py:6729-6730`). La espera del paso 7 no tiene tope de tiempo propio: depende de la jaula.

---

## 7. Ciclo de vida

### 7.1 Dormir

`fr_sleep` (`razar/cuerpo/gen_luma.py:464-472`): `N4`++, `SLEPT` = 1, `r_free_save`, y crea el archivo `dormir`
con los 6 bytes `dormir`; luego descanso. El cuerpo no termina por sí mismo.

`luma_vive.sh <carpeta> [libro] [janaxos.exe]` (`razar/cuerpo/luma_vive.sh:19-56`) repite:

1. Borra `dormir` de la casa (el argumento `[libro]` se exporta una vez como `LUMA_LIBRO`, [§3](#3-construcción-y-arranque-lumash)).
2. Lanza en segundo plano un vigilante PowerShell y luego, también en segundo plano, `luma.sh <carpeta> [janaxos]`
   con salida a `<carpeta>/luma.log`; espera al vigilante y después a `luma.sh`.
3. El vigilante: hasta 180 intentos de 500 ms buscando el proceso `janaxos.exe` cuya línea de órdenes contenga
   la ruta de `bin/luma.bin` (si no aparece, sale con 0); espera hasta 100 × 100 ms la ventana principal; observa la
   casa con un `FileSystemWatcher` filtrado por el nombre hexadecimal de `dormir` (eventos de creación y cambio) y
   la salida del proceso. Si `dormir` existe o aparece: `CloseMainWindow`, espera hasta 30 000 ms y sale con 3. Si
   el proceso termina: sale con 0.
4. Código 3: vuelve a 1 (renace; `luma.sh` reensambla si cambió una fuente). Código 0: termina. Otro: escribe una
   línea con fecha en `<carpeta>/cuida.estado` y termina.

### 7.2 Falta de memoria

`fr_nomem` (`razar/cuerpo/gen_luma.py:473-482`): escribe `dormir` igual que `fr_sleep` y termina con
`jhalt 0BADh`. El vigilante la ve terminar (código 0 si no llegó a ver `dormir` antes; no verificado qué evento
gana cuando ambos ocurren casi a la vez).

### 7.3 Renacer

Al nacer de nuevo, `r_free_load` recupera `libre` ([§8.5.1](#851-libre-4640-bytes-binarios)). `r_read_init` compara `STAMP` con el [sello de
construcción](#23-entradas-leídas-al-generar); si difiere, lo actualiza y pone `NEWST` = 1 (`razar/cuerpo/gen_leer.py:7588`). La primera llamada a
`r_free` paga el sueño si `WOKE` y `NEWST` ([§4.4](#44-libertad-elección-de-actos-r_free)). `r_un_libro` rota el libro del estante ([§8.8.7](#887-turno-y-rotación-de-libros)).

### 7.4 Cierre

[Evento 5](05-nucleo-pantalla-teclado-vigia.md#62-tipos-de-evento): `v_event` llama a `v_calm` (léxicos de las criaturas, `r_save_lex`) y `r_handle` llama a `r_read_end`
([pedido 33](03-nucleo-arranque-memoria-procesos.md#94-terminar-a-un-hijo-33) sobre la lectora) y termina (`razar/cuerpo/gen_luma.py:997`, `razar/cuerpo/gen_formas.py:386-390`,
`razar/cuerpo/gen_leer.py:7879-7882`). La pensadora termina sola cuando su [pedido 29](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) devuelve −1. Lo que una
lectura en curso calculó no se guarda.

---

## 8. Formato de la casa

### 8.1 Modos de escritura

| Modo | Mecanismo |
|---|---|
| Reescritura | [Pedido 12](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) + `r_open` + escrituras + cierre. |
| Anexado | `r_open` + [pedido 38](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) (−1) + escritura + cierre. |
| Abierto al final | Se abre una vez al nacer y se mantiene el manejador (`AH`, `CH`, `DH`, `XH`). |
| Anillo | [§8.2](#82-formato-anillo-anillo1). |

### 8.2 Formato anillo (`anillo1`)

Con `PRESENT` (`razar/cuerpo/gen_luma.py:41`), los registros de eventos son [anillos](10-luma-pantalla-lluvia-y-organos-vivos.md#1013-anillos-del-presente) (`razar/cuerpo/gen_luma.py:771-820`).
Descriptor en memoria (12 qwords, en `RINGS` = `6600h` + 96·i): +0 manejador, +8 `K` (líneas), +16 longitud de
línea, +24 cantidad total escrita, +32..+88 ocho contadores por motivo.

Archivo:

| Desplazamiento | Tamaño | Contenido |
|---|---|---|
| 0 | 7 | `anillo1` |
| 8 | 9 | `K` decimal |
| 18 | 12 | Total de líneas escritas |
| 31 + 13c (c = 0..7) | 12 | Contador del motivo `c` |
| 159 | 1 | `\n` |
| (resto de 0..159) | | Espacios |
| 160 + (i mod K)·L | L | Línea i |

Al escribir una línea (`l_ring`): contador del motivo + 1; posición `160 + (total mod K)·L`; total + 1; se escribe
la línea y se reescribe la cabecera. Al abrir (`l_ring_open`): si se leen 160 bytes y empiezan por `anillo1 `, se
recuperan total y contadores; si no, se escribe una cabecera nueva en cero (el archivo previo, si era un registro
anexado, queda reutilizado desde el byte 0). Una línea del anillo `RING_F` también se envía al [panel](10-luma-pantalla-lluvia-y-organos-vivos.md#105-panel)
(`r_flujo_trial`).

| Descriptor | Archivo | K | L | Motivos |
|---|---|---|---|---|
| `RING_F` | `archivo` | 4096 | 112 | `AREASON` 0..6 ([§8.4.2](#842-archivo-líneas-de-112-bytes)) |
| `RING_A` | `vida-archivo` | 4096 | 80 | veredicto 0..5 ([§8.9.3](#893-vida-archivo-vida-guardados-80-bytes)) |
| `RING_D` | `vida-dialogos` | 4096 | 104 | K 0, U 1, N 2 |
| `RING_X` | `vida-intercambios` | 1024 | 65 | K 0, L 1, W 2, otro 3 |
| `RING_G` | `vida-guardados` | 1024 | 80 | veredictos 0, 1 y 4 (no 2, 3, 5) |

`RING_K` = 4096, `RING_KX` = 1024 y `RING_KG` = 1024 son criterio, no medición (`razar/cuerpo/gen_luma.py:42-48`).

### 8.3 Índice de archivos

| Etiqueta | Escritor | Modo | Sección |
|---|---|---|---|
| `formas` | `r_save_forms` | Reescritura | [8.4.1](#841-formas-399-bytes-de-texto) |
| `archivo` | `r_archive` | Anillo / anexado | [8.4.2](#842-archivo-líneas-de-112-bytes) |
| `despensa` | `luma.sh` | Reescritura (anfitrión) | [8.4.3](#843-despensa) |
| `comidas` | `r_write_meal` | Abierto al final | [8.4.4](#844-comidas-líneas-de-537-bytes) |
| `ladrillos` | `r_save_bricks` | Reescritura | [8.4.5](#845-ladrillos) |
| `libre` | `r_free_save` | Reescritura | [8.5.1](#851-libre-4640-bytes-binarios) |
| `nombre` | `r_nombre_keep` | Reescritura | [8.5.2](#852-nombre) |
| `charla` | `r_dlg_save` | Reescritura | [8.5.3](#853-charla-2304-bytes-binarios) |
| `dialogo`, `me-comi`, `charla-libros` | `r_dlg_write` | Anexado | [8.6.1](#861-dialogo-me-comi-charla-libros) |
| `trato-<libro>` | pensadora | Anexado | [8.6.2](#862-trato-libro) |
| `pregunta`, `respuesta`, `lista` | [§5](#5-protocolo-cuerpo--pensadora) | Reescritura | [8.6.3](#863-pregunta-respuesta-lista) |
| `gustos`, `animo`, `imagina` | `r_gustos_save`, `ig_save` | Reescritura | [8.7.1](#871-gustos-animo-imagina) |
| `imaginado` | `ig_*` | Anexado | [8.7.2](#872-imaginado) |
| `lenguas` | `lj_save` | Reescritura | [8.7.3](#873-lenguas) |
| `caminos` | `wy_save` y `bu_wstep` | Reescritura y anexado | [8.7.4](#874-caminos-dos-escritores) |
| `siluetas` | `wy_msave` | Reescritura | [8.7.5](#875-siluetas) |
| `arbol` | `ar_save` | Reescritura | [8.7.6](#876-arbol) |
| `leido`, `recetas`, `linaje` | lectura | Anexado | [8.8.1](#881-leido)–[8.8.3](#883-linaje) |
| `hallazgos`, `rodeos`, `preguntas-mias`, `preguntas-viejas`, `libro-preguntas` | `r_busca`, palabra | varios | [8.8.4](#884-hallazgos-rodeos)–[8.8.6](#886-corazón) |
| `turno` | `r_un_libro` | Reescritura | [8.8.7](#887-turno-y-rotación-de-libros) |
| `firma` | `r_firma` | Reescritura | [8.8.8](#888-firma) |
| `engranajes` | `r_gears` | Reescritura | [8.8.9](#889-engranajes) |
| `comida`, `digerido` | `r_digest` | Lectura / reescritura | [8.8.10](#8810-comida-digerido) |
| `letras`, `abecedario` | palabra | Lectura / anexado | [8.8.11](#8811-letras-abecedario) |
| `carta1` | (Razar) | Lectura | [8.8.12](#8812-carta1) |
| `p`, `luma/*` | `luma.sh`, instalador | — | [8.8.13](#8813-p-y-luma) |
| `cables-matriz`, `libro-cables-vivos`, `elibro-cables-vivos`, `luma/cables.nombres` | cables | [8.8.15](#8815-cables) |
| `libro-*`, `elibro-*` | anfitrión / `r_un_libro` | Renombrado | [8.8.16](#8816-libro--elibro-) |
| `libro-disco-*`, `elibro-disco-*`, `registro-disco-*` | `r_host_eat` | Reescritura | [8.8.17](#8817-libro-disco-16-hex-elibro-disco-16-hex)–[8.8.18](#8818-registro-disco-16-hex) |
| `pares`, `canta`, `razona`, `cantado`, `dados` | [§6](#6-protocolo-con-el-canto) | Reescritura | [6.1](#61-archivos) |
| `dormir` | `fr_sleep`, `fr_nomem` | Creación | [7.1](#71-dormir) |
| `plano` | `LUMA_PRUEBA_PLANO` | Prueba | [2.4](#24-variables-de-entorno-del-generador) |
| `vida-*` | criaturas | varios | [8.9](#89-archivos-de-las-criaturas-vida-) |

### 8.4 Formas y comidas

#### 8.4.1 `formas` (399 bytes de texto)

Cabecera de 39 bytes y 8 líneas de 45 (`HDR_LEN`, `FLINE`, `razar/cuerpo/gen_formas.py:146-148`,
`razar/cuerpo/gen_formas.py:1098-1121`):

| Desp. | Tam. | Campo |
|---|---|---|
| 0 | 8 | `formas1 ` |
| 8 | 6 | `EPOCH` (ronda) decimal |
| 14 | 1 | espacio |
| 15 | 16 | `RNG` en hexadecimal minúsculo |
| 31 | 1 | espacio |
| 32 | 6 | `WINS` decimal |
| 38 | 1 | `\n` |
| 39 + 45f | 31 | Receta de la forma f ([§1.2](#12-codificaciones-de-texto-comunes)) |
| +31 | 1 | espacio |
| +32 | 7 | Valor (`F_WORTH`) decimal |
| +39 | 1 | espacio |
| +40 | 4 | Celdas (`F_COUNT`) decimal |
| +44 | 1 | `\n` |

Carga (`r_load_forms`): primero las semillas; si el archivo tiene exactamente 399 bytes y empieza por `formas1 `,
toma `EPOCH`, `WINS`, `RNG` (si no es 0) y cada receta no vacía.

#### 8.4.2 `archivo` (líneas de 112 bytes)

`r_archive` (`razar/cuerpo/gen_formas.py:1074-1095`):

| Desp. | Tam. | Campo |
|---|---|---|
| 0 | 6 | `EPOCH` |
| 7 | 1 | Lugar: `'0' + JF` |
| 9 | 31 | Receta perdedora |
| 41 | 31 | La otra receta |
| 73 | 15 | Motivo (espacios a la derecha) |
| 89 | 7 | Total del perdedor (`ATL`) |
| 97 | 7 | Total del ganador (`ATW`) |
| 105 | 1 | `RADIUS` (mod 10) |
| 111 | 1 | `\n` |

Resto: espacios. Motivos por índice: 0 `replaced`, 1 `longer,not-new`, 2 `longer`, 3 `not-new`, 4 `crowds`,
5 `no-better` (`razar/cuerpo/gen_formas.py:79`), 6 `meal-climb` (`razar/cuerpo/gen_comer.py:116`). Al nacer, las
líneas cuya ronda es la `EPOCH` actual se marcan como probadas (`r_load_archive`), y las líneas `replaced` alimentan
el conjunto de recetas que fueron forma (`r_load_former`, `razar/cuerpo/gen_comer.py:922-937`). [Con anillo](#82-formato-anillo-anillo1), sólo
quedan las últimas 4096.

#### 8.4.3 `despensa`

Escrita por `luma.sh` (`razar/cuerpo/luma.sh:71-80`). Cabecera de 37 bytes `despensa1 NNNNNN MMMMMMMMM TTTTTTTTT\n`:
N = líneas (desp. 10, 6 dígitos), M = mayor tamaño de nube (desp. 17, 9; mínimo 8), T = bytes del texto de líneas
(desp. 27, 9). Cada línea: `%09d %s\n` = tamaño de la nube y su ruta del anfitrión. En una casa propia la ruta puede
ser `#` seguido de 16 hex (la huella), sin ruta (`razar/cuerpo/gen_comer.py:333-339`). Entrada en memoria (40
bytes): +0 dirección de la ruta, +8 su longitud, +16 tamaño del archivo, +24 huella (FNV de la ruta, o la del `#`),
+32 comida.

#### 8.4.4 `comidas` (líneas de 537 bytes)

`CLINE` = 537 (`razar/cuerpo/gen_comer.py:41`), `r_write_meal` (`razar/cuerpo/gen_comer.py:1091-1120`):

| Desp. | Tam. | Campo |
|---|---|---|
| 0 | 4 | Entrada de la despensa (`MIDX`) |
| 5 | 16 | Huella de la ruta, hex |
| 22 | 31 | Receta guardada |
| 54 | 7 | Costo ×100 (`DCOST`) |
| 62 | 4 | Celdas erradas (`DKBEST`) |
| 67 | 6 | Candidatos (`DCAND`) |
| 74 | 1 | Forma de partida: `'0'+n` o `'-'` |
| 76 | 1 | Forma alimentada: `'0'+n` o `'-'` (no se pudo comer) |
| 78 | 2 | Cantidad de colores (`MCN`) |
| 81 + 7k | 6 | Color k `rrggbb` hex (hasta 64, el más contado primero) |
| 529 | 6 | Ronda en que se comió (`MEP`) |
| 536 | 1 | `\n` |

Resto: espacios. Al nacer se leen todas (hasta `NPAN` líneas), se marcan comidas las entradas con esa huella, se
arma el corpus de recetas y cada lugar alimentado toma su primer color.

#### 8.4.5 `ladrillos`

Cabecera de 18 bytes `ladrillos1 NNNNNN\n` (cantidad de ladrillos aprendidos, sin contar las torrecitas). Líneas de
40 bytes: receta (31), espacio, usos (7 dígitos), `\n` (`razar/cuerpo/gen_comer.py:1121-1142`).

### 8.5 Estado propio

#### 8.5.1 `libre` (4640 bytes binarios)

Concatenación, en este orden, de regiones del [bloque libre](#261-bloque-libre-b--stfree) (`razar/cuerpo/gen_luma.py:206-230`); todos los qwords
en little-endian:

| Desp. archivo | Bytes | Origen | Contenido |
|---|---|---|---|
| 0 | 56 | `B+0` | `N0 S0 N1 S1 N2 S2 LASTF` |
| 56 | 8 | `B+A8h` | `LASTORG` |
| 64 | 16 | `B+B0h` | `N3 PMARK` |
| 80 | 192 | `B+100h` | `PALS`: 8 formas × (R, G, B) qwords |
| 272 | 4088 | `B+3F8h` | `NVIS`, luego 255 × `{dados, servidos}` |
| 4360 | 24 | `B+1400h` | `N4 S4 SLEPT` |
| 4384 | 256 | `B+1500h` | `KEPT`: `N5 S5 NI SI NO SO SHELF GENOME STAMP RBUD`, `FT` (8 × 2 qwords), `NS SS NL SL RSUM VICT` |

La carga lee cada región en secuencia; un archivo corto deja el resto en cero. Antes de guardar se llama a
[`r_cable_flush`](#28-cables-vivos).

#### 8.5.2 `nombre`

Texto (`razar/cuerpo/gen_leer.py:1916-1983`): línea 1 = nombre (letras, dígitos, espacios); línea 2 = sello de 16
hex minúsculos; ambas terminadas en `\n` (tamaño = longitud del nombre + 18). El sello es
`x = (RNG xor rem) · 9E3779B97F4A7C15h; x xor (x >> 31)`, con `rem` = respuesta del [pedido 35](04-nucleo-abi-de-pedidos.md#96-familia) con `a` = −1, `b` = 0
(sobre sí misma); el sello se escribe nibble más significativo primero, en minúsculas. Sin
nombre en la primera línea, pregunta `COMO ME LLAMO?` en pantalla. El título de ventana se pide con el [pedido 43](05-nucleo-pantalla-teclado-vigia.md#59-título-pedido-43).

#### 8.5.3 `charla` (2304 bytes binarios)

Qwords de la sala [`DLR`](09-luma-conversacion-y-respuesta.md#21-la-sala-de-la-palabra-dlr-32768-bytes) (`razar/cuerpo/gen_leer.py:2004-2010`): `D_NC D_SC D_NH D_SH` (32), `D_MC D_MC_S1 D_MC_N2
D_MC_S2` (32), `D_BN0 D_BN1 D_BN2 D_BS0 D_BS1 D_BS2` (48), y `D_PM` (48: activación suma/cuenta, claridad
suma/cuenta, bolita suma/cuenta), `D_CX` (2048: 32 contextos × 4 ramas × {N, S}), `D_CM` (96: dos modos de
encadenar, dos de cruzar, hilo, improvisar; N y S cada uno). La semántica es del [capítulo 09](09-luma-conversacion-y-respuesta.md#21-la-sala-de-la-palabra-dlr-32768-bytes).

### 8.6 Conversación

#### 8.6.1 `dialogo`, `me-comi`, `charla-libros`

Una línea por enunciado ([`r_dlg_write`](09-luma-conversacion-y-respuesta.md#161-r_dlg_write), `razar/cuerpo/gen_leer.py:2034-2066`): prefijo según `j1`, texto, `\n`.

| `j1` | Prefijo | Texto |
|---|---|---|
| 0 | `vos: ` | sí |
| 1 | `luma: ` | sí |
| 2 | `luma: (eligio no contestar)` | no |
| 3 | `luma: (no encontro con que contestar)` | no |
| 4 | `luma (une): ` | sí |
| 5 | `luma (cita): ` | sí |
| 6 | `libro: ` | sí |

Destino: `me-comi` si `GREET` = 1; si no, `charla-libros` si su árbol tiene activa la charla con libros (`SF_ON`);
si no, `dialogo`. Siempre anexado.

#### 8.6.2 `trato-<libro>`

Etiqueta `trato-` + la etiqueta del libro cuya [firma](09-luma-conversacion-y-respuesta.md#19-firmas-de-idioma-lj_) tiene quien habla, truncada para que la etiqueta completa no
pase de 118 bytes; se guarda en la sala `WHOR` como `{longitud (qword), etiqueta}`
(`razar/cuerpo/gen_leer.py:5050-5063`). Contenido anexado por la pensadora en cada pregunta atendida
(`razar/cuerpo/gen_leer.py:3672-3690`): `vos: <pregunta>` + `\nluma: ` + `<respuesta>` + `\n`.

#### 8.6.3 `pregunta`, `respuesta`, `lista`

`pregunta`: bytes crudos de la línea del usuario (hasta 1000 leídos). `respuesta`: bytes crudos de la respuesta única (el
cuerpo lee hasta 1000). `lista`: 5 bytes `lista`.

### 8.7 Gustos, lenguas, caminos y árbol

#### 8.7.1 `gustos`, `animo`, `imagina`

`gustos` (`razar/cuerpo/gen_leer.py:4556-4565`): 32 bytes (`GU_F + 32`: tres desacuerdos de [marco](09-luma-conversacion-y-respuesta.md#63-el-marco-r_marco) y el marco en
que confía) y luego `n` entradas de 24 bytes `{huella del libro, N, S}`, n ≤ `GU_K` = 256; al cargar, n = bytes/24.
`animo`: `AN_SZ` = 8 × 64 × 24 = 12 288 bytes: 8 estados de ánimo × 64 palabras × `{huella, veces, marca}`
(`razar/cuerpo/gen_leer.py:426-428`). `imagina`: 16 bytes `{N, S}` (`IG_N`, `IG_S`)
(`razar/cuerpo/gen_leer.py:4535-4536`, `razar/cuerpo/gen_leer.py:4788`).

#### 8.7.2 `imaginado`

Anexado (`razar/cuerpo/gen_leer.py:4864-4872`): `<cláusula> | <palabra original> > <palabra nueva>\n`.

#### 8.7.3 `lenguas`

Secuencia de entradas de 32 + `VB` = 270 368 bytes (`razar/cuerpo/gen_leer.py:527-528`,
`razar/cuerpo/gen_leer.py:5134-5145`):

| Desp. | Tam. | Campo |
|---|---|---|
| 0 | 8 | Clave del libro: `h = h·31 + byte` (módulo 2^64) sobre la etiqueta tal como aparece en [la lista de la casa](09-luma-conversacion-y-respuesta.md#15-la-lista-de-libros), incluida la `e` si está en espera ([`lj_hash`](09-luma-conversacion-y-respuesta.md#191-modelo), `razar/cuerpo/gen_leer.py:4940-4945`; los llamadores pasan la etiqueta de la entrada de lista sin quitarle nada, `razar/cuerpo/gen_leer.py:5035`) |
| 8 | 8 | Tamaño del libro al contarlo |
| 16 | 8 | Costo del texto del usuario con esta firma |
| 24 | 8 | Dirección en memoria de la firma al momento de guardar (sin significado al cargar; el comentario de `razar/cuerpo/desintoxicar_firmas.py:6` lo describe como 0) |
| 32 | 262 144 | `VC`: 32 × 32 × 32 qwords, veces que cada signo siguió a cada par |
| 262 176 | 8192 | 32 × 32 qwords, veces que cada par precedió algo |

Los 32 signos son a..z, letra fuera de ASCII, espacio, dígito, fin de línea y marca (`razar/cuerpo/gen_leer.py:455-457`).
Una entrada no leída entera se descarta.

#### 8.7.4 `caminos` (dos escritores)

La etiqueta `caminos` la usan dos rutinas con formatos incompatibles:

1. **Sus maneras** ([`wy_save`](09-luma-conversacion-y-respuesta.md#9-el-camino-wy_go)/`wy_load`, `razar/cuerpo/gen_leer.py:4472-4519`), reescritura binaria: 32 bytes
   `{WY_N, WY_S, WY_AN, WY_VN}`; `WY_VN` palabras de su alfabeto; su manera actual; y `WY_AN` archivadas, cada una
   `{motivo (8 bytes), palabra}`. Una palabra es `{longitud L (qword), L qwords de letras}`. Motivos: 1 no pagada,
   2 perdió su lugar, 3 pagada pero no más que la suya (`razar/cuerpo/gen_leer.py:499-502`). [Letras de pasos](09-luma-conversacion-y-respuesta.md#91-pasos)
   (`WY_STEPS`): `heart`, `impro`, `own`, `quien`, `cross`, `baja`, `hermano`, `sube`, `sigue`; manera inicial
   `[1, 2]`.
2. **Sus rodeos** (`bu_wstep`, `razar/cuerpo/gen_leer.py:1150-1180`), anexado de texto, una línea por pregunta y
   nacimiento: `<pregunta> | <desde> -> <puerta>: <lugar (≤ 300 bytes)>`; perdida:
   `<pregunta> | <desde> -> (no lleva a ningun lado)`; vuelta: `<pregunta> | <lugar> -> <desde> -> volvi por otro
   camino: <lugar>`.

`wy_load` valida la lectura (cabecera de 32 bytes y palabras completas) y, si falla, conserva la manera inicial
(`wyl_hb`, `wyl_bad`). La convivencia de ambos formatos en un mismo archivo es un conflicto del código; su efecto en
ejecución no está verificado.

#### 8.7.5 `siluetas`

`48 · 9` = 432 bytes: por cada uno de los 9 pasos, 6 qwords (inicio, tomada, traída) × (tomada, traída)
(`razar/cuerpo/gen_leer.py:3932`, `razar/cuerpo/gen_leer.py:4083-4097`). Sólo se acepta leído entero.

#### 8.7.6 `arbol`

[`ar_save`](09-luma-conversacion-y-respuesta.md#88-fin-de-la-búsqueda-y-árbol) (`razar/cuerpo/gen_leer.py:3014-3021`): 24 bytes `{NN nodos, CUR nodo actual, NB libros}`, luego NN nodos
de `AR_NS` = 32 + 4096 = 4128 bytes `{padre, primer hijo, siguiente hermano, libros aquí, huella de palabras de
32 768 bits}` y NB libros de `AR_BS` = 4128 bytes `{clave, tamaño, rama, cantidad de palabras, huella}`
(`razar/cuerpo/gen_leer.py:541-547`). Sin archivo, un árbol nuevo con sólo la raíz (padre, hijo y hermano = −1).
`AR_M` = 32 768 se justifica como la potencia de dos siguiente a `15630 / ln 2` medida sobre 190 libros
(`razar/cuerpo/gen_leer.py:541-543`).

### 8.8 Lectura y corazón

#### 8.8.1 `leido`

Registros binarios de 48 bytes (`ENT`, `razar/cuerpo/gen_leer.py:610`), anexados y nunca reescritos: +0 `lo` y +8
`hi` (nombre de la receta), +16 puntaje, +24 estante, +32 genoma, +40 alfabeto. Al cargar sólo se usan los que
coinciden con [`SHELF`](06-razar-lectura-y-organos.md#115-huella-y-estante) y [`ALPHA`](06-razar-lectura-y-organos.md#103-el-alfabeto) (`razar/cuerpo/gen_leer.py:7560-7564`, `razar/cuerpo/gen_leer.py:7569-7579`).
Valores especiales del puntaje: `UNK` = 2^63 (sin lectura), `BAD` = −2^62 (rota)
(`razar/cuerpo/gen_leer.py:227-228`).

#### 8.8.2 `recetas`

Anexado (`razar/cuerpo/gen_leer.py:7332-7360`): `<puntaje> <receta>[ = <receta dicha plana>]\n`. Puntaje decimal con
`-` si es negativo, o `nada` si es `BAD`. Letras como `'0'+v` para v < 10 y `'0'+v+7` (`A`..`F`) para v ≥ 10.

#### 8.8.3 `linaje`

Anexado (`razar/cuerpo/gen_leer.py:7362-7399`). Si el archivo está vacío, primero 8 líneas `= <lugar 1-8> <receta>`.
Luego una línea por victoria: `<EPOCH> <lugar 1-8> <k>[-<quitadas>][+<puestas>] <cómo>\n`, donde `k` = letras
iguales al inicio; las letras con la codificación de [§8.8.2](#882-recetas); `<cómo>` = `p` (pensar), `x<n>` (`n` = `LX`, la forma
cruzada + 1) o `l<d>` (`d` = `LORG − 1`, la vía de lectura: 0 lo que tenía Razar, 1 una letra, 3 una canción, 4
una célula, 5 unir).

#### 8.8.4 `hallazgos`, `rodeos`

`hallazgos` (`razar/cuerpo/gen_leer.py:900-914`, misma salida que [`razar/corazon/busca.py --texto`](#10-instrumentos-del-corazón-razarcorazon)): por pregunta,
su línea y luego `   no la encontro en nada\n` o `   <b> de <n>, en <p> lugares; el primero, en <etiqueta>:\n   <línea>\n`.
`rodeos` (`razar/cuerpo/gen_leer.py:1179-1188`): reescritura; una línea por pregunta, `<puerta> <desde>` o vacía si
está en la puerta de entrada.

#### 8.8.5 `libro-preguntas`, `preguntas-mias`, `preguntas-viejas`

`libro-preguntas`: líneas de texto (las preguntas del corazón; es parte de `HEART`). `preguntas-mias`: reescritura,
una línea por pregunta propia (`razar/cuerpo/gen_leer.py:1189-1199`, `razar/cuerpo/gen_leer.py:5813`).
`preguntas-viejas`: anexado, una línea de hasta 250 bytes + `\n` por pregunta reemplazada
(`razar/cuerpo/gen_leer.py:5798-5810`).

#### 8.8.6 Corazón

`HEART` es una tupla fija de cuatro etiquetas (`razar/cuerpo/gen_leer.py:583`): `libro-firma`, `libro-preguntas` y
dos libros personales del autor cuyas etiquetas se omiten aquí (una reimplementación las toma de esa línea). Estos
libros nunca rotan ([§8.8.7](#887-turno-y-rotación-de-libros)). Su contenido es privado y no se describe.

#### 8.8.7 `turno` y rotación de libros

`r_un_libro` (`razar/cuerpo/gen_leer.py:7100-7149`), sólo si existe `turno` (se leen hasta 250 bytes: la etiqueta
del libro actual, sin `e`):
1. Lista la casa ([pedido 14](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema), duplicando la sala desde 4096 hasta que la cantidad se repita). Entrada de lista:
   qword de longitud, etiqueta, relleno a múltiplo de 8.
2. Toda etiqueta que empiece por `libro` y no sea de `HEART` se renombra ([pedido 13](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema)) a `e` + etiqueta.
3. Lista de nuevo y entre las que empiezan por `elib` elige la menor (orden de bytes) estrictamente mayor que
   `turno`; si no hay, la menor de todas.
4. La renombra sin la `e`, y reescribe `turno` con su etiqueta.

#### 8.8.8 `firma`

32 bytes binarios (`razar/cuerpo/gen_leer.py:1307-1313`): pasajes apartados del diario, reconocidos, pasajes
apartados del Nuevo Testamento, tomados por suyos. Requiere `libro-diario` y `libro`. Regla: pasajes de 1000
letras, uno de cada diez apartado, modelo de orden 3, costo `Σ log2(t+96) − log2(k+1)` (instrumento:
[`razar/corazon/firma_de_luma.py`](#10-instrumentos-del-corazón-razarcorazon)).

#### 8.8.9 `engranajes`

Hasta `NGEARS` = 105 entradas de 128 bytes, leídas en `DBUF + 4400h` (`razar/cuerpo/gen_leer.py:252`,
`razar/cuerpo/gen_leer.py:7593-7605`). Sin archivo, [`r_gears`](10-luma-pantalla-lluvia-y-organos-vivos.md#1093-conteo-y-selección-r_gears) los fabrica desmontando su propio código. El formato
interno de cada entrada pertenece al [capítulo 06](06-razar-lectura-y-organos.md#107-engranajes-formato-de-128-bytes) (`razar/lectura/organo.inc:54`, `razar/lectura/organo.inc:100-102`).

#### 8.8.10 `comida`, `digerido`

`comida`: texto de código ajeno, leído entero (`razar/cuerpo/gen_leer.py:1463`). `digerido`: reescrito con las
líneas traducidas a su idioma (`razar/cuerpo/gen_leer.py:1602-1603`). Formato de línea de `digerido`: no tiene líneas; son las palabras de instrucción de 4 bytes que `dg_put` agregó
desde `DOUT0` hasta `GNW` (`razar/cuerpo/gen_leer.py:1426-1427`, `razar/cuerpo/gen_leer.py:1604`).

#### 8.8.11 `letras`, `abecedario`

`letras`: libro de letras en formato `código:puntos`, 32 hex para 8×16 o 64 para 16×16
(`razar/cuerpo/gen_leer.py:6003-6004`). `abecedario`: una línea de `letras` por letra aprendida, tal cual; al nacer
cada línea se agrega con `r_letra_add` (`razar/cuerpo/gen_leer.py:2017-2030`).

#### 8.8.12 `carta1`

16 bytes leídos una vez si `GENOME` = 0: el primer qword (si ≠ 0) es el [genoma](06-razar-lectura-y-organos.md#93-genoma-y-evolución); si no, `GENOME0` = `010208h`
(`razar/cuerpo/gen_leer.py:7606-7614`).

#### 8.8.13 `p` y `luma/*`

`p`: 16 bytes ([§3](#3-construcción-y-arranque-lumash)). `luma/lectora.bin`, `luma/pensadora.bin`: copia de `luma.bin`. `luma/lectora.molde`: copia de
`pulso.datos`. `luma/lectora.datos`: datos de la lectora (`DLEN` bytes). `luma/pensadora.datos`: 40 bytes.
`luma/canto.bin`, `luma/canto.datos`: del instalador (§3). `luma/cardumen.bin`: ningún archivo revisado lo coloca
(no verificado).

#### 8.8.15 Cables

`cables-matriz`: `BYTES + 8` bytes, `BYTES = ((NC² + 7)//8 + 7)//8·8`; qword 0 = `NC`; luego el bit
`(anterior−1)·NC + actual`. Si el `NC` guardado difiere, se reinicia. `libro-cables-vivos` (o `elibro-cables-vivos`
si no es el libro del turno): anexado, `<A>, luego <B>.\n`. `luma/cables.nombres`: un nombre por línea; si no tiene
exactamente `NC` líneas, los [cables](#28-cables-vivos) no se activan (`razar/cuerpo/gen_leer.py:8067-8124`).

#### 8.8.16 `libro-*`, `elibro-*`

Libros: texto cualquiera. Toda etiqueta que empieza por `libro` está en el estante; con prefijo `e`, en espera. La
casa puede tener uno solo en el estante por vez si existe `turno` ([§8.8.7](#887-turno-y-rotación-de-libros)).

#### 8.8.17 `libro-disco-<16 hex>`, `elibro-disco-<16 hex>`

`razar/cuerpo/gen_luma.py:314-319`: +0 huella FNV-1a del contenido (8 bytes LE), +8 tamaño (8 bytes LE), +16 ruta
del anfitrión (UTF-8, sin terminador). Los lectores de libros lo reconocen con `r_isdisk` y no lo leen como líneas
(`razar/cuerpo/gen_leer.py:3704-3709`).

#### 8.8.18 `registro-disco-<16 hex>`

Mismo formato que [§8.8.17](#8817-libro-disco-16-hex-elibro-disco-16-hex) (`razar/cuerpo/gen_luma.py:366-370`); marca un archivo que crece al final y no se come.

### 8.9 Archivos de las criaturas (`vida-*`)

Con [`VIDA_MOD`](#22-orden-de-ejecución-mecanismo-de-ganchos), `gen_vida` antepone `vida-` a sus etiquetas (`razar/cuerpo/gen_vida.py:51`,
`razar/cuerpo/gen_vida.py:238-246`).

#### 8.9.1 `vida-lista`, `vida-memoria`

`vida-lista`: cabecera de 44 bytes `lista1 N(6) NMAX(9) OMAX(9) TEXT(9)\n` (desp. 7, 14, 24, 34), luego
`%09d %09d <ruta .nube>\t<ruta .oido>\n` (`razar/cuerpo/luma.sh:82-90`, `razar/cuerpo/gen_vida.py:384-392`).
`vida-memoria`: misma cabecera de 44 bytes, con `lista2` (`razar/cuerpo/migrar_luma.py:92`); si existe se usa en lugar de `vida-lista`. El resto de su formato lo
escribe `migrar_luma.py`, fuera de este capítulo (`razar/cuerpo/migrar_luma.py:92-98`).

#### 8.9.2 `vida-aprendido`

Cabecera de 18 bytes `aprendido1 NNNNNN\n`. Por criatura: huella (16 hex), espacio, `K` (3 dígitos), y K motivos
` PPPPP qq ss` (período en ms, amplitud, fase), `\n`. Relleno con espacios hasta la mayor longitud que tuvo el
archivo (`razar/cuerpo/gen_vida.py:520-550`).

#### 8.9.3 `vida-archivo`, `vida-guardados` (80 bytes)

`razar/cuerpo/gen_vida.py:564-590`: cuadro (9) en 0; alumno (16 hex) en 10; maestro (16 hex) en 27; P (5) en 44; q
(2) en 50; s (2) en 53; veredicto (8) en 56; DL ahora (6) en 65; DL con la pieza (6) en 72; `\n` en 79. Veredictos:
0 `kept`, 1 `replaced`, 2 `longer`, 3 `beaten`, 4 `dreamt`, 5 `unfit` (`razar/cuerpo/gen_vida.py:71`).

#### 8.9.4 `vida-dialogos` (104 bytes)

`razar/cuerpo/gen_vida.py:1429-1458`: cuadro (9) 0; hablante (16 hex) 10; oyente (16 hex) 27; sueño P/q/s en 44/50/53;
melodía (2) 56; enviada (2) 59; conjetura P/q/s en 62/68/71; veredicto `K`/`U`/`N` en 74; exacta (1) 76; DL ahora
(6) 78; `DWITH` (6) 85; un dígito en 93; `\n` en 103.

#### 8.9.5 `vida-lexico`

Cabecera de 16 bytes `lexico1 NNNNNNN\n`; líneas de 37 bytes `<huella 16> <m 2> <P 5> <q 2> <s 2> <puntaje 4>\n`
(desp. 0, 17, 20, 26, 29, 32), con relleno de espacios (`razar/cuerpo/gen_vida.py:141`,
`razar/cuerpo/gen_vida.py:1473-1500`).

#### 8.9.6 `vida-intercambios` (65 bytes)

`razar/cuerpo/gen_luma.py:730-750`: cuadro (9) 0; tipo `F` (a una forma), `C` (a una criatura), `M` (mutación) en
10; criatura (16 hex) 12; forma (1) 29; receta candidata (31) 31; veredicto `W`, `L`, `K` o `P` en 63; `\n` en 64.

#### 8.9.7 `vida-cuerpos`

`razar/cuerpo/gen_luma.py:751-769`: cabecera de 16 bytes `cuerpos1 NNNNNN\n`; N líneas de 56 bytes: huella (16 hex),
espacio, receta del cuerpo (31) en 17, espacio, bits aprendidos (6) en 49, `\n` en 55. La línea i corresponde a la
criatura i y sólo se aplica si la huella coincide.

#### 8.9.8 `vida-habitat`, `vida-codigo`, `vida-nube-<16 hex>`

`vida-habitat`: líneas de 19 bytes `<huella 16> <modo 1>\n` (`razar/cuerpo/gen_vida.py:1762-1771`). `vida-codigo`:
cabecera de 15 bytes con la cantidad en desp. 8 (6 dígitos) y luego registros de 20 bytes que escribe
`codigo_comun.py` (`razar/cuerpo/codigo_comun.py:228-229`) (`razar/cuerpo/gen_vida.py:1414-1424`). `vida-nube-<huella>`: [nube v3](05-nucleo-pantalla-teclado-vigia.md#41-formato-nube-versión-3-lo-que-lee-el-núcleo)
de 40 × 50: cabecera de 28 bytes (`NUBE`, 3, `00 00 80 3F`, `00 00`, 1, `00 00 80 3F`, 8 ceros, ancho u16 = 40,
alto u16 = 50), 250 bytes de bits (bit `c mod 8` del byte `c/8` para la celda c), y 3 bytes RGB por celda marcada;
contorno en el color más contado de la comida y el interior en el segundo (`razar/cuerpo/gen_luma.py:1081-1114`).

---

## 9. Herramientas de mantenimiento de la casa

Todas operan sobre una casa con la ventana cerrada y nada borran: lo que sale se mueve a una carpeta con su motivo.

| Herramienta | Entrada | Efecto | Fuente |
|---|---|---|---|
| `desintoxicar.py <casa> <archivo>` | — | Quita de `dialogo` los saludos `luma: me comí` repetidos o de rutas cuyo nombre es hexadecimal; mueve los `libro-disco-*`/`elibro-disco-*` cuya ruta (leída desde el byte 8) termina en nombre hexadecimal. | `razar/cuerpo/desintoxicar.py:7-53` |
| `desintoxicar_tema.py <casa> <archivo> <trozo> <motivo>` | trozo de ruta | Quita saludos y libros del disco cuya ruta contiene el trozo (ruta desde el byte 16, o 8 si el archivo mide ≤ 16). | `razar/cuerpo/desintoxicar_tema.py:7-42` |
| `desintoxicar_fuera.py <casa> <archivo> <carpeta> <motivo>` | carpeta de comida | Mueve libros del disco fuera de la carpeta; quita de `me-comi` los avisos de rutas fuera; quita de `dialogo` las líneas `luma: ` con bytes de control (salvo 9, 13) o con una ruta de unidad. | `razar/cuerpo/desintoxicar_fuera.py:14-56` |
| `desintoxicar_firmas.py <casa> <archivo> [<trozo>]` | — | Exige que `lenguas` sea múltiplo de 270 368; conserva las firmas cuya clave (h·31 + byte sobre la etiqueta hexadecimal decodificada de cada archivo presente) coincide; las demás van a un zip. Con trozo, filtra `me-comi`. | `razar/cuerpo/desintoxicar_firmas.py:17-59` |
| `armar_luma_publica.py` | — | Copia la casa excluyendo etiquetas con `-disco-`, `trato-*`, una lista de etiquetas personales y una lista de libros; escribe un índice y un zip. | `razar/cuerpo/armar_luma_publica.py:5-49` |

`desintoxicar.py` lee la ruta del libro del disco desde el byte 8, que corresponde a un formato anterior al actual
(16 bytes de cabecera, [§8.8.17](#8817-libro-disco-16-hex-elibro-disco-16-hex)); con el formato actual la ruta leída incluye 8 bytes del tamaño. `desintoxicar_tema.py`
y `desintoxicar_fuera.py` usan el byte 16.

---

## 10. Instrumentos del corazón (`razar/corazon`)

| Instrumento | Comprueba | Regla | Fuente |
|---|---|---|---|
| `busca.py <casa> [--texto <salida>]` | `r_busca` | Palabra = corrida de letras (a..z sin distinguir mayúsculas, o un carácter UTF-8 completo fuera de ASCII). Lo común = intersección de las palabras de todas las preguntas. Una línea de cualquier archivo (salvo `libro-preguntas` y `hallazgos`) es un lugar si contiene todo lo común; cercanía = palabras propias de la pregunta que contiene. Guarda el máximo, cuántos lugares lo alcanzan y el primero. | `razar/corazon/busca.py:22-79` |
| `firma_de_luma.py <diario> <nt>` | `r_firma` | Pasajes de 1000 bytes; se aparta el de índice ≡ 9 (mod 10) de longitud completa; contexto de 3 bytes; `lg` = logaritmo de 16 bits de fracción de `r_log2`. | `razar/corazon/firma_de_luma.py:14-52` |
| `reconocer.py` | Regla preregistrada de la firma | Orden 3 con alfabeto de 96, normalización ASCII, control barajado con semilla 2026. | `razar/corazon/reconocer.py:1-98` |

Los demás archivos de `razar/corazon` son textos personales y no se describen.

---

## 11. Invariantes y límites

| Invariante o límite | Valor | Fuente |
|---|---|---|
| `j14` = 0 en todo el programa | — | `razar/cuerpo/gen_formas.py:219` |
| Variables globales | `< 8000h`; `G` en `200h..7F8h`, 171 + 19 (`CB`) de 192 | [§2.5](#25-la-tabla-general-g-y-sus-límites) |
| Letras por receta | ≤ 31 (`LMAX`) | `razar/cuerpo/gen_formas.py:49` |
| Formas | 8 (`NF`); `make()` exige `NF == 8` | `razar/cuerpo/gen_formas.py:39`, `razar/cuerpo/gen_leer.py:619` |
| Saltos | ±32767 palabras; estaciones cada ≤ 30000 | `razar/cuerpo/gen_leer.py:8185-8262` |
| Engranajes | ≤ 105 × 128 bytes | `razar/cuerpo/gen_leer.py:252` |
| Gustos | ≤ 256 libros | `razar/cuerpo/gen_leer.py:412` |
| Ejemplos del canto | ≤ 7 de 1024 bytes | `razar/cuerpo/gen_leer.py:2436` |
| Respuesta, pregunta | se leen ≤ 1000 bytes | `razar/cuerpo/gen_leer.py:3641`, `razar/cuerpo/gen_leer.py:3668` |
| Cola del usuario | 1024 bytes de sala, copias de hasta 1000 | `razar/cuerpo/gen_leer.py:3583`, `razar/cuerpo/gen_leer.py:3614` |
| Criaturas en `TAB` | 255 entradas (254 elegibles) | `razar/cuerpo/gen_luma.py:189`, `razar/cuerpo/gen_luma.py:437` |
| Ruta del vigía | 4096 bytes; trozo de lectura 65 536 | `razar/cuerpo/gen_luma.py:243` |
| Jaula del canto | 50 000 000 instrucciones | `razar/cuerpo/gen_leer.py:6733` |
| Códigos de fin | `0BADh` (error de espera o falta de memoria), `WINSRUN` (cierre, o fin de una espera infinita sin ventana), 0 (pensadora huérfana, pruebas) | `razar/cuerpo/gen_formas.py:367-368`, `razar/cuerpo/gen_formas.py:390`, `razar/cuerpo/gen_luma.py:482`, `razar/cuerpo/gen_leer.py:3703` |
| Códigos del vigilante | 0 cierre, 3 dormir, otro → `cuida.estado` | `razar/cuerpo/luma_vive.sh:43-55` |

---

## 12. Puntos no verificados

- Interpretación de los 16 bytes del archivo `p` ([§3](#3-construcción-y-arranque-lumash)).
- Quién escribe `luma/cables.nombres` y quién coloca `luma/cardumen.bin` (§3, [§8.8.15](#8815-cables)).
- Que el núcleo cargue `luma/canto.datos` como datos iniciales de `luma/canto.bin` por convención de nombre ([§4.1](#41-un-binario-varios-papeles)).
- Que el cuerpo sea siempre la cabina 0, supuesto por la pensadora y por el pedido 42 sobre sí misma (§4.1).
- Efecto en ejecución de que la pensadora repita `r_un_libro`, `v_init` y `r_free_load` al nacer ([§4.2](#42-nacimiento-del-cuerpo)).
- Qué evento gana en el vigilante cuando `fr_nomem` escribe `dormir` y termina casi a la vez ([§7.2](#72-falta-de-memoria)).
- Efecto en ejecución de los dos formatos que comparten la etiqueta `caminos` ([§8.7.4](#874-caminos-dos-escritores)).
- Formato interno de `engranajes`, `digerido`, `vida-memoria` y `vida-codigo` ([§8.8.9](#889-engranajes), [§8.8.10](#8810-comida-digerido), [§8.9.1](#891-vida-lista-vida-memoria), [§8.9.8](#898-vida-habitat-vida-codigo-vida-nube-16-hex)).
