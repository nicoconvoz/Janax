# 05. Núcleo JanaxOS: pantalla, teclado, ventana, vigía y Venn

Este capítulo especifica los servicios del núcleo JanaxOS (modo simbiosis sobre Windows x86-64) que conectan a los
programas Janax con el anfitrión fuera del sistema de archivos propio: la pantalla de Janax (modelo de imagen,
ventana del anfitrión, pintado), la entrada (puntero, teclado, portapapeles), el sonido, el vigía de carpetas del
anfitrión (`JANAX_VIGIA`), el bucle del centinela que duerme sobre todas esas fuentes de eventos, el motor de
selección Venn y la [ventanita al anfitrión (`jhost`)](#12-ventanita-al-anfitrión-jhost) del escalón 0 y de JanaxOS. No cubre: el idioma Janax y su
codificación de palabras ([capítulo 01](01-idioma-janax.md#01-el-idioma-janax-máquina-virtual-codificación-e-instrucciones)), el ensamblador PDP y la construcción ([02](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas)), el arranque, la memoria, las salas
y la planificación de procesos ([03](03-nucleo-arranque-memoria-procesos.md#03-núcleo-janaxos-arranque-memoria-procesos-firmas-y-planificación)), el formato general de la cola de pedidos, los porteros y las firmas ([04](04-nucleo-abi-de-pedidos.md#04-núcleo-janaxos-abi-de-pedidos-llamadas-al-sistema)), la
lectura de Razar ([06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)), [el cardumen](07-razar-cardumen-canto-hilos.md#4-el-cubo-la-escuela) ([07](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez)), el cuerpo y [la casa](08-luma-cuerpo-procesos-y-casa.md#8-formato-de-la-casa) de Luma ([08](08-luma-cuerpo-procesos-y-casa.md#08-luma-cuerpo-generadores-procesos-y-formato-de-su-casa)), la conversación ([09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta)), la pantalla y la
vida de Luma, incluida su fuente tipográfica y la composición de imágenes ([10](10-luma-pantalla-lluvia-y-organos-vivos.md#10-luma-pantalla-lluvia-hexadecimal-panel-criaturas-y-órganos-vivos)), ni el instalador y la publicación
([11](11-instalador-lanzador-y-publicacion.md#11-instalador-lanzador-y-publicación)). Las rutas citadas son relativas a la raíz del repositorio; `archivo:línea` o `archivo:inicio-fin` remiten al
código que sustenta cada afirmación.

## 1. Definiciones y notación

| Término | Definición |
|---|---|
| Cabina | Un proceso de JanaxOS. Su estructura se describe en el [capítulo 03](03-nucleo-arranque-memoria-procesos.md#52-bloque-de-proceso); aquí se usan los campos `P_*` de la [§2.3](#23-campos-de-cabina-usados). |
| Toque | Una ejecución de [`jsys`](01-idioma-janax.md#58-jsys-janax-os) sobre una [cola de pedidos](04-nucleo-abi-de-pedidos.md#4-formato-de-la-cola-de-pedidos), atendida por la rutina `ventanilla` (`so/janaxos.asm:2224-2451`). |
| Pantalla de la ventanilla | Servidor interno sintonizado a una clase de pedido (`tune`, `nscreens`, `so/janaxos.asm:174-176`). No tiene relación con la imagen; el contador `pantallas=` del informe final (`so/janaxos.asm:1143-1164`) se refiere a ellos. Detalle en el [capítulo 04](04-nucleo-abi-de-pedidos.md#5-procesamiento-de-un-toque). |
| Pantalla de Janax | La imagen que los programas muestran y la ventana del anfitrión que la presenta (`so/pantalla.inc`). En este capítulo "pantalla" significa siempre esto. |
| Nube | Archivo o bloque de memoria en formato `.nube` versión 3 ([§4.1](#41-formato-nube-versión-3-lo-que-lee-el-núcleo)). El núcleo dibuja el primer nivel de una nube. |
| Celda | Un elemento de la rejilla de un nivel de nube. Una celda es un píxel lógico de la pantalla. |
| Partícula | Una celda marcada (bit a 1) de la rejilla; tiene un color RGB. |
| Campana | Un evento del anfitrión (objeto de sincronización de Windows) que el núcleo usa para despertar. |
| Hilo de la ventana | Hilo del anfitrión que posee la ventana y su bucle de mensajes (`screen_thread`). Lo crea el primer [pedido 40](04-nucleo-abi-de-pedidos.md#98-pantalla-sonido-y-portapapeles) que supera la validación, si `JANAX_SIN_VENTANA` no está definida (`so/pantalla.inc:272-282`). |
| Centinela | La rutina `watch_wait` (`so/ambientes.inc:1680-1820`): un remero que, cuando nadie rema, duerme sobre las campanas de carpetas y de pantalla. |
| Vigía | La parte del centinela que observa carpetas del anfitrión nombradas en `JANAX_VIGIA` (`so/vigia.inc`). |
| Remero | Hilo del núcleo que ejecuta cabinas ([capítulo 03](03-nucleo-arranque-memoria-procesos.md#13-remeros), `so/remos.inc`). |
| Cerrojo del núcleo | Sección crítica `kern_lock`, tomada con `kern_enter` y liberada con `kern_leave`. |
| Cerrojo de pantalla | Sección crítica `scr_lock` (`so/pantalla.inc:27`), compartida entre el núcleo y el hilo de la ventana. |

Convenciones: los números en hexadecimal llevan sufijo `h`. "ms" son milisegundos de `GetTickCount64`
(`now_ms`, `so/janaxos.asm:3006-3014`). Las constantes `WM_*`, `SW_*`, `WS_*` y similares tienen los valores
estándar de Win32 que provee `win64a.inc` (`so/janaxos.asm:33`); se indican entre paréntesis.

## 2. Integración en el núcleo

### 2.1 Inclusión del puerto de pantalla

`so/pantalla.inc` se incluye dos veces:

| Inclusión | Valor de `PANTALLA_PARTE` | Contenido | Fuente |
|---|---|---|---|
| Sección de datos | 0 | Estado de la pantalla ([§5.1](#51-estado-pantalla_parte--0)). | `so/janaxos.asm:571-572`, `so/pantalla.inc:12-66` |
| Sección de código | 1 | Rutinas. | `so/janaxos.asm:2018-2019`, `so/pantalla.inc:68-1027` |

El archivo se declara como implementación Windows de un puerto: otro anfitrión debe proveer un `pantalla.inc` con los
mismos puntos de entrada y respuestas (`so/pantalla.inc:1-2`; no existe otra implementación en el repositorio). El
núcleo usa exactamente esta interfaz:

| Punto de entrada | Entrada | Salida | Llamado desde |
|---|---|---|---|
| `screen_show` | `rsi` = nube, `rcx` = bytes | `rax` = partículas, o -1 | `serve_show`, `so/janaxos.asm:2701` |
| `screen_title` | `rsi` = texto, `rcx` = bytes | `rax` = letras del título | `serve_title`, `so/janaxos.asm:2735` |
| `screen_copy` | `rsi` = texto UTF-8, `rcx` = bytes | `rax` = unidades, 0, o -1 | `serve_copy`, `so/janaxos.asm:2769` |
| `screen_sound` | `rax` = mensaje MIDI | `rax` = 1, 0 o -1 | `serve_note`, `so/janaxos.asm:2796` |
| `screen_take` | `rdi` = registro de 32 bytes | `eax` = 1 o 0 | `serve_wait_event`, `so/janaxos.asm:2829` |
| `screen_waitable` | — | `eax` = 1 si se puede dormir | `so/janaxos.asm:2892`, `2909`, `2930` |
| `screen_end` | — | — | fin del sistema, `so/janaxos.asm:1182` |
| `scr_event` (dato) | — | campana de eventos | `so/ambientes.inc:1738` |

Bibliotecas del anfitrión importadas para estos servicios: `USER32.DLL`, `GDI32.DLL`, `WINMM.DLL`, `SHELL32.DLL`,
`ADVAPI32.DLL` y `KERNEL32.DLL` (`so/janaxos.asm:576-669`).

### 2.2 Pedidos de este capítulo

Formato de la entrada de cola: [capítulo 04 §4.2](04-nucleo-abi-de-pedidos.md#42-entrada-32-bytes) (32 bytes: `kind` dword en +0, `a` en +8, `b` en +16, `respuesta`
en +24). La ventanilla copia las entradas enteras de vuelta a la cola al final, de modo que una reescritura de `b`
llega al programa (`so/janaxos.asm:2432-2441`).

| Clase | Nombre | Puerta | Derecho | Importante | Servidor | Fuente de la tabla |
|---|---|---|---|---|---|---|
| 27 | asociar (Venn) | 2 memoria | `R_MEM` | 1 | `gate_assoc` | `so/janaxos.asm:219`, `225`, `231` |
| 39 | lo nuevo del anfitrión | 3 archivos | `R_READ` | 0 | `gate_hostnew` | `so/janaxos.asm:220`, `226`, `232` |
| 40 | mostrar | 1 pantalla | `R_SCREEN` | 0 | `serve_show` | `so/janaxos.asm:220`, `226`, `233` |
| 41 | esperar un evento | 1 pantalla | `R_SCREEN` | 0 | `serve_wait_event` | `so/janaxos.asm:220`, `226`, `233` |
| 43 | nombrar la ventana | 1 pantalla | `R_SCREEN` | 0 | `serve_title` | `so/janaxos.asm:220`, `226`, `235` |
| 44 | una nota | 1 pantalla | `R_SCREEN` | 0 | `serve_note` | `so/janaxos.asm:220`, `226`, `236` |
| 47 | copiar | 1 pantalla | `R_SCREEN` | 1 | `serve_copy` | `so/janaxos.asm:222`, `228`, `239` |

"Importante" = 1 significa que el pedido de una cabina que no es hija del núcleo requiere la firma del padre
([capítulo 04 §7.3](04-nucleo-abi-de-pedidos.md#73-pedidos-importantes-y-firma-del-padre)). La asignación de servidores está en `serve_table` (`so/janaxos.asm:210-216`). Para 27 y 39 la
entrada de `serve_table` es `serve_assoc` y `serve_hostnew`, generadas por la macro `serve_gate`
(`so/janaxos.asm:3861-3882`, `4387`, `4421`), que recorre las entradas de esa clase y llama, para cada una, a
`gate_assoc` o `gate_hostnew` con `r13` = desplazamiento de la entrada en el libro del toque. `R_SCREEN` = 1,
`R_MEM` = 2, `R_READ` = 4 (`so/janaxos.asm:118-121`).

Resumen de argumentos y respuestas (detalle en las secciones citadas):

| Clase | `a` | `b` | Respuesta | Sección |
|---|---|---|---|---|
| 27 | número de cabina de la familia | palabra Venn | 0, o -1 | [§11.6](#116-protocolo-de-asociación-pedido-27) |
| 39 | dirección destino | bytes disponibles | bytes de la ruta UTF-8; 0 nada nuevo; -1 | [§10.8](#108-entrega-pedido-39) |
| 40 | dirección de la nube | bytes de la nube | partículas dibujadas, o -1 | [§4](#4-modelo-de-imagen-pedido-40-mostrar) |
| 41 | dirección del registro de 32 bytes | espera máxima en ms (reescrito) | 1, 0 o -1 | [§8](#8-esperar-un-evento-pedido-41) |
| 43 | dirección del texto | bytes | letras del título, o -1 | [§5.9](#59-título-pedido-43) |
| 44 | mensaje MIDI en los 24 bits bajos | — | 1, 0 o -1 | [§9](#9-sonido-pedido-44) |
| 47 | dirección del texto UTF-8 | bytes | unidades UTF-16, 0, o -1 | [§7.4](#74-copiar-pedido-47) |

En 40, 43 y 47 el bloque `[a, a+b)` debe estar entero dentro de una sala de la cabina (`cabin_at`, [capítulo 04
§6.3](04-nucleo-abi-de-pedidos.md#63-validación-de-punteros-cabin_at)); si no, la respuesta es -1 (`so/janaxos.asm:2697-2698`, `2731-2732`, `2765-2766`). El pedido 44 no valida
`a` como dirección (`so/janaxos.asm:2795-2797`).

### 2.3 Campos de cabina usados

| Campo | Desplazamiento | Significado aquí | Fuente |
|---|---|---|---|
| `P_DONE` | 184 | ≠ 0: la cabina terminó. | `so/janaxos.asm:53` |
| `P_GATES` | 224 | Porteros por puerta; `P_GATES + (puerta-1)·8`. | `so/janaxos.asm:58`, `2294` |
| `P_WAITING` | 264 | Esperas pendientes del toque suspendido. | `so/janaxos.asm:61` |
| `P_ROOMS`, `P_NROOMS` | 288, 296 | Cartel de salas (adaptador Venn, [§11.5](#115-adaptador-de-cartel)). | `so/janaxos.asm:64-65` |
| `P_PARTNER`, `P_ASSOC` | 536, 544 | Pareja y palabra Venn de la asociación (27). | `so/janaxos.asm:95-96` |
| `P_GREET`, `P_NGREET` | 552, 560 | Lista de quienes la saludaron. | `so/janaxos.asm:97-98` |
| `P_GWAIT` | 568 | 1: espera un saludo (29); 2: nadie puede saludarla. | `so/janaxos.asm:99` |
| `P_WATCH`, `P_WATCHN` | 592, 600 | Prefijos de etiqueta vigilados (32). | `so/janaxos.asm:102-104` |
| `P_HOSTW` | 640 | 1: pidió lo nuevo del anfitrión (39) alguna vez. Nunca se vuelve a 0. | `so/janaxos.asm:109`, `so/vigia.inc:666` |
| `P_SCRW` | 648 | Estado de espera sobre la pantalla ([§8.2](#82-estados-de-p_scrw)). | `so/janaxos.asm:110` |
| `P_SCRDL` | 656 | Plazo de esa espera en ms; `FOREVER` = sin plazo. | `so/janaxos.asm:111` |

`FOREVER` = 7FFFFFFFFFFFFFFFh (`so/janaxos.asm:42`).

## 3. Variables de entorno

| Variable | Leída por | Efecto | Fuente |
|---|---|---|---|
| `JANAX_SIN_VENTANA` | `screen_show`, una vez (primer [pedido 40](04-nucleo-abi-de-pedidos.md#98-pantalla-sonido-y-portapapeles)) | Con cualquier valor: nunca se crea ventana; el resto de la pantalla responde igual ([§5.10](#510-modo-sin-ventana)). | `so/pantalla.inc:17`, `203-210` |
| `JANAX_VENTANA_FONDO` | `screen_show`, en cada pedido 40 | Con cualquier valor: la ventana nace al fondo del orden Z, sin activarse ([§5.4](#54-mostrar-y-modo-fondo)). Una vez fijada la marca no se borra. | `so/pantalla.inc:18`, `211-215`, `374-377` |
| `JANAX_VIGIA` | `hw_start`, al arrancar | Carpetas del anfitrión que vigila el vigía, separadas por `;` ([§10.2](#102-configuración)). | `so/janaxos.asm:307`, `so/vigia.inc:18` |
| `JANAX_ARCHIVOS` | arranque | Carpeta propia del sistema; excluida del vigía ([§10.6](#106-recepción-de-una-notificación-hw_told)). | `so/janaxos.asm:283-284`, `697-708` |
| `JANAX_TABLERO` | arranque | Carpeta tablero; excluida del vigía y vigilada por el centinela. | `so/janaxos.asm:290`, `709-710` |
| [`JANAX_SIN`](01-idioma-janax.md#77-reducción-del-catálogo-en-windows-janax_sin) | `host_init` (escalón 0) | Nombres de pedidos que la ventanita no ofrece ([§12.3](#123-escalón-0-host_service)). | `escalon0/ventanita_datos.inc:12`, `escalon0/ventanita.inc:104-163` |

Las variables de pantalla se leen con `GetEnvironmentVariableA` sobre el búfer `env_value` (32 bytes,
`so/janaxos.asm:472`), pasando `nSize` = 31; sólo se evalúa si el resultado es distinto de 0, por lo que un valor de
más de 30 caracteres (el anfitrión devuelve entonces el tamaño requerido) también activa la marca
(`so/pantalla.inc:207-215`).

## 4. Modelo de imagen: pedido 40 (mostrar)

### 4.1 Formato `.nube` versión 3 (lo que lee el núcleo)

Todos los enteros son little-endian. `H` = número de huesos, `L0` = 11 + 42·`H` (desplazamiento del contador de
niveles). Fuente de los controles: `screen_show`, `so/pantalla.inc:142-201`. Tipos de los campos que el núcleo
salta: escritor de referencia `razar/cuerpo/imagen_a_nube.py:28` y la prueba `so/pruebas/pantalla_mostrar.jsm:9-85`.

| Desplazamiento | Tamaño | Tipo | Campo | Uso por el núcleo |
|---|---|---|---|---|
| 0 | 4 | ASCII | Magia `NUBE` | Debe ser exactamente `4E 55 42 45` (`so/pantalla.inc:149`). |
| 4 | 1 | u8 | Versión | Debe ser 3 (`so/pantalla.inc:151`). |
| 5 | 4 | f32 | Paso fino | Ignorado. Semántica (no verificado). |
| 9 | 2 | u16 | `H`, número de huesos | Usado para saltar los huesos (`so/pantalla.inc:153-155`). |
| 11 | 42·`H` | — | Huesos, 42 bytes cada uno | Ignorados. Estructura interna (no verificado en este capítulo). |
| `L0` | 1 | u8 | Número de niveles | Debe ser ≠ 0 (`so/pantalla.inc:159-160`). |
| `L0`+1 | 4 | f32 | Paso del nivel 0 | Ignorado. |
| `L0`+5 | 4 | i32 | `k0x` | Ignorado. Semántica (no verificado). |
| `L0`+9 | 4 | i32 | `k0y` | Ignorado. Semántica (no verificado). |
| `L0`+13 | 2 | u16 | `W`, ancho en celdas | 1 ≤ `W` ≤ `SCR_SIDE` (`so/pantalla.inc:161-170`). |
| `L0`+15 | 2 | u16 | `Hc`, alto en celdas | 1 ≤ `Hc` ≤ `SCR_SIDE`. |
| `L0`+17 | ⌈`W`·`Hc`/8⌉ | bits | Rejilla de celdas | Celda `j` = bit `j mod 8` (bit 0 = menos significativo) del byte `⌊j/8⌋`. |
| `C0` = `L0`+17+⌈`W`·`Hc`/8⌉ | 3·`P` | u8×3 | Colores | Un triple `R, G, B` por partícula, en orden creciente de `j`. |
| siguiente | — | — | Niveles 1.. | Ignorados. |

`SCR_SIDE` = 4096 (`so/pantalla.inc:14`; criterio de diseño, sin medición documentada en el código). `P` es el
número de bits a 1 de la rejilla.

### 4.2 Validación

`screen_show` responde -1 sin tocar la pantalla si se cumple cualquiera de estas condiciones, evaluadas en este orden
(`so/pantalla.inc:147-201`), siendo `n` los bytes recibidos:

1. `n` < 12.
2. La magia no es `NUBE` o la versión no es 3.
3. `L0` + 17 > `n` (no cabe la cabecera del primer nivel).
4. El número de niveles es 0.
5. `W` = 0, `Hc` = 0, `W` > 4096 o `Hc` > 4096.
6. `C0` > `n` (no cabe la rejilla).
7. `C0` + 3·`P` > `n` (no caben los colores).

Además responde -1 si no se puede reservar memoria para el búfer de píxeles (`so/pantalla.inc:228-230`,
`292-295`). Este caso sí altera el estado: el búfer anterior ya fue liberado y quedan `scr_pix` = 0 y `scr_cap` = 0,
mientras `scr_w`, `scr_h` y `scr_bmi` conservan los valores de la nube anterior (`so/pantalla.inc:223-227`). Hasta el
siguiente [pedido 40](04-nucleo-abi-de-pedidos.md#98-pantalla-sonido-y-portapapeles) aceptado, la ventana pinta sólo negro ([§5.6](#56-pintado)) y `screen_cell` sigue usando las dimensiones
anteriores. Fuera de estos casos responde `P` (`so/pantalla.inc:289-291`).

### 4.3 Resolución lógica y búfer de píxeles

- La resolución lógica de la pantalla es `W`×`Hc` celdas de la última nube aceptada. No hay resolución fija: cada
  pedido 40 puede cambiarla (`so/pantalla.inc:264-269`).
- El búfer `scr_pix` es un DIB de 32 bits, de arriba abajo, un píxel por celda: el píxel de la celda `j` está en
  `(j mod W, ⌊j/W⌋)` (`so/pantalla.inc:138-140`, `259`).
- Formato de cada píxel (dword): `(R << 16) | (G << 8) | B`, es decir bytes en memoria `B, G, R, 0`. Una celda vacía
  es 0 (negro) (`so/pantalla.inc:247-259`).
- El búfer se reserva con `VirtualAlloc` y sólo se reemplaza cuando hace falta más capacidad (`scr_cap`); nunca se
  achica (`so/pantalla.inc:218-232`). Máximo: 4096·4096·4 = 67 108 864 bytes.
- La cabecera `scr_bmi` es un `BITMAPINFOHEADER` de 40 bytes: `biWidth` = `W`, `biHeight` = −`Hc` (de arriba abajo),
  planos 1, 32 bits por píxel, `BI_RGB` (`so/pantalla.inc:38-40`, `266-269`).
- Píxeles, `scr_w`, `scr_h` y `scr_bmi` se escriben bajo `scr_lock` (`so/pantalla.inc:217-270`).

### 4.4 Primitivas de dibujo

El núcleo no ofrece pedidos de píxel suelto, rectángulo, línea ni texto, ni contiene fuente tipográfica (no hay
referencias a fuentes ni a `TextOut`/`DrawText` en `so/`). Un programa dibuja componiendo en su propia memoria una
nube completa y enviándola con el pedido 40; cada pedido reemplaza la imagen entera. La rasterización de texto es
responsabilidad del programa; Luma usa una fuente propia de 5×7 puntos (`r_glyph`, `razar/cuerpo/luma.jsm:22769`),
especificada en el [capítulo 10](10-luma-pantalla-lluvia-y-organos-vivos.md#1054-letras-r_txt).

### 4.5 Secuencia de `screen_show`

1. Validar ([§4.2](#42-validación)) y contar partículas.
2. Primera vez (`scr_ready` = 0): `InitializeCriticalSection(scr_lock)`, `scr_ready` = 1, leer `JANAX_SIN_VENTANA`
   (`so/pantalla.inc:203-210`).
3. Leer `JANAX_VENTANA_FONDO` (`so/pantalla.inc:212-215`).
4. Bajo `scr_lock`: asegurar capacidad, convertir celdas a píxeles, fijar `scr_w`, `scr_h`, `scr_bmi`.
5. Si `scr_quiet` = 1: terminar.
6. Si nunca se creó el hilo de la ventana (`scr_thread` = 0): crear la campana `scr_event`
   (`CreateEventA(0, FALSE, FALSE, 0)`, reinicio automático), poner `scr_live` = 1 y crear el hilo `screen_thread`
   (`CreateThread(0, 0, screen_thread, 0, 0, 0)`, `so/pantalla.inc:274-282`). No se comprueba el resultado de
   `CreateEventA` ni de `CreateThread`.
7. Si el hilo ya existe: si `scr_hwnd` ≠ 0, `InvalidateRect(scr_hwnd, NULL, FALSE)`; si es 0 (ventana cerrada o aún
   no construida) no hace nada; la ventana, al construirse, pinta los píxeles vigentes (`so/pantalla.inc:283-288`).

Invariante: hay como máximo una ventana por ejecución del núcleo. Una vez que el hilo de la ventana terminó
(ventana cerrada), `scr_thread` sigue distinto de 0 y ningún pedido 40 posterior crea otra ventana; los pedidos 40
siguen actualizando el búfer y respondiendo `P`.

## 5. Ventana del anfitrión

### 5.1 Estado (`PANTALLA_PARTE` = 0)

| Símbolo | Tipo | Contenido | Fuente |
|---|---|---|---|
| `SCR_SIDE` | constante | 4096 | `so/pantalla.inc:14` |
| `SCR_WORKAREA` | constante | 30h (`SPI_GETWORKAREA`) | `so/pantalla.inc:15` |
| `SCR_REDRAW` | constante | 3 (`CS_VREDRAW` \| `CS_HREDRAW`) | `so/pantalla.inc:16` |
| `scr_class_name` | UTF-16 | `JanaxPantalla` | `so/pantalla.inc:19` |
| `scr_title` | UTF-16, 513 unidades | Título; valor inicial `Janax` | `so/pantalla.inc:20-21` |
| `SCR_TITLE_MAX` | constante | 512 (criterio, sin medición) | `so/pantalla.inc:22` |
| `scr_ready`, `scr_quiet`, `scr_back` | u8 | Marcas ([§4.5](#45-secuencia-de-screen_show), [§3](#3-variables-de-entorno)) | `so/pantalla.inc:23-25` |
| `scr_lock` | 40 bytes | `CRITICAL_SECTION` | `so/pantalla.inc:27` |
| `scr_pix`, `scr_cap`, `scr_w`, `scr_h` | u64 | Búfer, capacidad, dimensiones | `so/pantalla.inc:28-31` |
| `scr_bits`, `scr_rgb` | u64 | Punteros de trabajo de `screen_show` | `so/pantalla.inc:32-33` |
| `scr_thread`, `scr_hwnd` | u64 | Hilo (0 = nunca abierto) y ventana (0 = no existe) | `so/pantalla.inc:34-35` |
| `scr_midi`, `scr_midi_h` | u64 | Sintetizador (§9) | `so/pantalla.inc:36-37` |
| `scr_bmi` | 40 bytes | `BITMAPINFOHEADER` | `so/pantalla.inc:38-40` |
| `scr_class` | 80 bytes | `WNDCLASSEXW` | `so/pantalla.inc:41-44` |
| `scr_rect`, `scr_work`, `scr_crect`, `scr_erect` | `RECT` | Marco, área libre, cliente al pintar, cliente al recibir un evento | `so/pantalla.inc:45-47`, `65` |
| `scr_msg`, `scr_ps` | 48, 80 bytes | `MSG`, `PAINTSTRUCT` | `so/pantalla.inc:48-49` |
| `SCR_RING` | constante | 256 (potencia de dos; criterio) | `so/pantalla.inc:50` |
| `scr_live` | u8 | 1: la ventana se abrió y no se cerró | `so/pantalla.inc:52` |
| `scr_event` | u64 | Campana de eventos (reinicio automático) | `so/pantalla.inc:54` |
| `scr_head`, `scr_count` | u64 | Anillo: índice del más antiguo y cantidad | `so/pantalla.inc:55-56` |
| `scr_paste`, `scr_pastelen`, `scr_pastepos` | u64 | Texto pegado (UTF-16), unidades, próxima unidad | `so/pantalla.inc:57-59` |
| `scr_copy`, `scr_copylen` | u64 | Texto a copiar (UTF-16) y unidades | `so/pantalla.inc:60-61` |
| `scr_lastx`, `scr_lasty` | i64 | Última celda del puntero; inicial −1 | `so/pantalla.inc:62-63` |
| `scr_high` | u64 | Mitad alta de un par sustituto pendiente (0 = ninguna) | `so/pantalla.inc:64` |
| `scr_ring` | 256 × 32 bytes | Anillo de eventos (§6) | `so/pantalla.inc:66` |

### 5.2 Clase de ventana

`scr_class` es un `WNDCLASSEXW`; `screen_thread` completa los campos dinámicos antes de `RegisterClassExW`
(`so/pantalla.inc:317-326`):

| Desplazamiento | Campo | Valor |
|---|---|---|
| 0 | `cbSize` | 80 |
| 4 | `style` | 3 (`CS_VREDRAW` \| `CS_HREDRAW`): todo cambio de tamaño repinta la ventana entera. Sin `CS_DBLCLKS`. |
| 8 | `lpfnWndProc` | `screen_proc` |
| 16, 20 | `cbClsExtra`, `cbWndExtra` | 0, 0 |
| 24 | `hInstance` | `ImageBaseAddress` del PEB: `[[gs:60h] + 10h]` |
| 32 | `hIcon` | 0 |
| 40 | `hCursor` | `LoadCursorW(0, IDC_ARROW)` |
| 48 | `hbrBackground` | 0 (sin pincel de fondo; el fondo lo pinta `WM_PAINT`, §5.6) |
| 56 | `lpszMenuName` | 0 |
| 64 | `lpszClassName` | `scr_class_name` (`JanaxPantalla`) |
| 72 | `hIconSm` | 0 |

El resultado de `RegisterClassExW` no se comprueba.

### 5.3 Tamaño inicial

Ejecutado en el hilo de la ventana (`so/pantalla.inc:327-369`), con `W`, `Hc` leídos bajo `scr_lock`:

1. `SystemParametersInfoW(SPI_GETWORKAREA, 0, &scr_work, 0)`: área libre del escritorio (sin barra de tareas).
2. `AdjustWindowRectEx` sobre un cliente de 0×0 con `WS_OVERLAPPEDWINDOW` (00CF0000h), sin menú, sin estilo
   extendido: da el grosor del marco `fw` = `right − left`, `fh` = `bottom − top`.
3. `aw` = ancho libre − `fw`; si `aw` ≤ 0, `aw` = 1. `ah` análogo.
4. `k` = min(⌊`aw`/`W`⌋, ⌊`ah`/`Hc`⌋); si `k` = 0, `k` = 1.
5. Cliente deseado `k·W` × `k·Hc`; `AdjustWindowRectEx` de nuevo para obtener el tamaño exterior.
6. `CreateWindowExW(0, "JanaxPantalla", scr_title, WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, ancho, alto,
   0, 0, hInstance, 0)` (`so/pantalla.inc:370`). Si falla, el hilo va directamente a su salida ([§5.8](#58-cierre-y-fin-del-sistema)).

El factor inicial es entero y la posición la elige el anfitrión. No hay tamaño fijo.

### 5.4 Mostrar y modo fondo

- Normal (`scr_back` = 0): `ShowWindow(hwnd, SW_SHOW)` (5) (`so/pantalla.inc:379`).
- Fondo (`scr_back` = 1): `SetWindowPos(hwnd, HWND_BOTTOM (1), 0, 0, 0, 0, 53h)`, con 53h = `SWP_NOSIZE` (1) \|
  `SWP_NOMOVE` (2) \| `SWP_NOACTIVATE` (10h) \| `SWP_SHOWWINDOW` (40h): visible, al fondo del orden Z, sin tomar el
  foco (`so/pantalla.inc:374-377`).
- En ambos casos `UpdateWindow(hwnd)`.

Maximizar: el estilo `WS_OVERLAPPEDWINDOW` incluye los botones de maximizar y minimizar y el borde redimensionable;
el núcleo no maximiza por programa. Maximizar, restaurar o redimensionar lo gestiona `DefWindowProcW`; el núcleo sólo
observa el resultado (`WM_SIZE`, evento 6) y repinta escalando ([§5.6](#56-pintado)).

### 5.5 Bucle de mensajes y procedimiento de ventana

Bucle (`so/pantalla.inc:383-389`): mientras `GetMessageW(&scr_msg, 0, 0, 0)` > 0, `TranslateMessage` y
`DispatchMessageW`. `TranslateMessage` es el que produce `WM_CHAR` a partir de las teclas (comportamiento del
anfitrión).

`screen_proc` (`so/pantalla.inc:400-446`) trata los mensajes así; "nota" significa llamar a `screen_note` ([§6](#6-eventos)) y luego
saltar a `DefWindowProcW`:

| Mensaje | Valor | Tratamiento | Devuelve |
|---|---|---|---|
| `WM_NCCREATE` | 81h | `scr_hwnd` = hwnd; continúa | `DefWindowProcW` |
| `WM_NCDESTROY` | 82h | `scr_hwnd` = 0; continúa | `DefWindowProcW` |
| privado 8001h | 8001h | `SetWindowTextW(hwnd, scr_title)` ([§5.9](#59-título-pedido-43)) | 0 |
| privado 8002h | 8002h | `screen_clip` ([§7.4](#74-copiar-pedido-47)) | 0 |
| `WM_PAINT` | 0Fh | Pintado (§5.6) | 0 |
| `WM_DESTROY` | 02h | `screen_note` (evento 5), `PostQuitMessage(0)` | 0 |
| `WM_MOUSEMOVE`..`WM_RBUTTONUP` | 200h..205h | nota | `DefWindowProcW` |
| `WM_KEYDOWN` | 100h | nota | `DefWindowProcW` |
| `WM_CHAR` | 102h | nota | `DefWindowProcW` |
| `WM_SIZE` | 05h | nota | `DefWindowProcW` |
| `WM_ACTIVATE` | 06h | nota | `DefWindowProcW` |
| cualquier otro | — | — | `DefWindowProcW` |

No se tratan, y por tanto no llegan a los programas: `WM_KEYUP`, `WM_SYSKEYDOWN`/`WM_SYSCHAR` (combinaciones con
Alt), la rueda, el botón central, `WM_CLOSE` (su tratamiento por defecto destruye la ventana). `WM_LBUTTONDBLCLK`
(203h) está en el rango notado pero `screen_note` lo descarta ([§6.2](#62-tipos-de-evento)), y la clase no pide doble clic.

### 5.6 Pintado

`WM_PAINT` (`so/pantalla.inc:447-494`), con `cw`, `ch` = dimensiones del área cliente:

1. `BeginPaint`; `GetClientRect`.
2. `PatBlt(dc, 0, 0, cw, ch, BLACKNESS)`: todo el cliente en negro.
3. `SetStretchBltMode(dc, COLORONCOLOR)` (3): vecino más próximo, sin suavizado.
4. Bajo `scr_lock`, si `scr_pix` ≠ 0:
   - Si `cw·Hc` ≤ `ch·W`: `dw` = `cw`, `dh` = ⌊`Hc·cw`/`W`⌋ (llena el ancho).
   - Si no: `dh` = `ch`, `dw` = ⌊`W·ch`/`Hc`⌋ (llena el alto).
   - `ox` = ⌊(`cw` − `dw`)/2⌋, `oy` = ⌊(`ch` − `dh`)/2⌋.
   - `StretchDIBits(dc, ox, oy, dw, dh, 0, 0, W, Hc, scr_pix, scr_bmi, DIB_RGB_COLORS (0), SRCCOPY)`.
5. Liberar `scr_lock`; `EndPaint`.

La imagen conserva la proporción de la nube, centrada, con bandas negras; el factor de escala no tiene por qué ser
entero.

### 5.7 Correspondencia píxel del cliente → celda

`screen_cell` (`so/pantalla.inc:680-734`) invierte el pintado usando `scr_erect` (cliente leído al recibir el evento,
`so/pantalla.inc:528`) y las mismas fórmulas de `dw`, `dh`, `ox`, `oy`. Para un píxel `(px, py)` con signo:

- `x'` = `px` − `ox`; si `x'` < 0 o `x'` ≥ `dw`: fuera. `y'` análogo con `oy`, `dh`.
- Dentro: celda `(⌊x'·W/dw⌋, ⌊y'·Hc/dh⌋)`. Fuera: `(−1, −1)`. Sin imagen (`scr_w` = 0): `(−1, −1)`.

Las coordenadas del mensaje se extienden con signo (`movsx` de cada palabra de `lParam`,
`so/pantalla.inc:628-631`), porque con un botón presionado la ventana captura el puntero y puede recibir posiciones
fuera de ella.

### 5.8 Cierre y fin del sistema

- Al cerrar el usuario la ventana: `WM_DESTROY` → evento 5 (que pone `scr_live` = 0) y `PostQuitMessage`;
  `WM_NCDESTROY` → `scr_hwnd` = 0; `GetMessageW` devuelve 0 y el hilo termina: `scr_live` = 0 y
  `SetEvent(scr_event)` para despertar a quien duerma (`so/pantalla.inc:386-392`). Lo mismo ocurre si
  `GetMessageW` devuelve −1 o si la ventana no pudo crearse.
- `screen_end` (`so/pantalla.inc:302-309`), llamado al final del núcleo cuando todas las cabinas terminaron
  (`so/janaxos.asm:1181-1182`): si alguna vez se creó el hilo, espera indefinidamente a que termine
  (`WaitForSingleObject(scr_thread, INFINITE)`). Consecuencia: con ventana abierta, el proceso del núcleo no sale
  hasta que el usuario la cierra. Sin ventana (o con `JANAX_SIN_VENTANA`) retorna de inmediato.

### 5.9 Título: pedido 43

`screen_title` (`so/pantalla.inc:109-136`):

1. `m` = min(`b`, 512).
2. Copia cada byte del texto como una unidad UTF-16 (extensión con ceros) en `scr_title[0..m)` y escribe 0 en
   `scr_title[m]`. El texto no se decodifica como UTF-8: un byte ≥ 80h aparece como U+0080..U+00FF.
3. Si `scr_hwnd` ≠ 0: `PostMessageW(scr_hwnd, 8001h, 0, 0)`; el hilo de la ventana aplica el título
   (`SetWindowTextW`), de modo que ninguna ventana se toca desde otro hilo. Si la ventana aún no existe, nacerá con
   este título ([§5.3](#53-tamaño-inicial), paso 6).
4. Respuesta: `m`.

Con `JANAX_SIN_VENTANA` el título se guarda pero nunca se muestra. Ni la copia ni la lectura de `scr_title` usan
`scr_lock` ([§13](#13-observaciones-del-código)).

### 5.10 Modo sin ventana

Con `JANAX_SIN_VENTANA` (`scr_quiet` = 1), comprobado en el código:

| Pedido | Comportamiento |
|---|---|
| 40 | Valida y convierte igual; responde `P` o −1; no crea hilo ni campana (`so/pantalla.inc:272-273`). |
| 41 | `screen_waitable` = 0 (`scr_live` = 0): nunca duerme; `screen_take` = 0. Responde 0 y `b` = 0 ([§8](#8-esperar-un-evento-pedido-41)). |
| 43 | Guarda el título; responde `m`. |
| 44 | `scr_hwnd` = 0: responde 0. |
| 47 | `scr_hwnd` = 0: responde 0. |

## 6. Eventos

### 6.1 Registro de evento (32 bytes)

Es el formato que el pedido 41 escribe en `a` y el formato de cada casilla de `scr_ring`
(`so/pantalla.inc:664-667`, `840-845`):

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | `kind` (1..8) |
| 8 | 8 | `x` (con signo) |
| 16 | 8 | `y` (con signo) |
| 24 | 8 | `extra` |

### 6.2 Tipos de evento

Generados por `screen_note` (`so/pantalla.inc:506-676`) en el hilo de la ventana:

| `kind` | Origen | `x`, `y` | `extra` |
|---|---|---|---|
| 1 | `WM_MOUSEMOVE` | Celda del puntero ([§5.7](#57-correspondencia-píxel-del-cliente--celda)) | `wParam & 3`: bit 0 izquierdo presionado (`MK_LBUTTON`), bit 1 derecho (`MK_RBUTTON`) |
| 2 | `WM_LBUTTONDOWN` / `WM_RBUTTONDOWN` | Celda | 1 izquierdo, 2 derecho |
| 3 | `WM_LBUTTONUP` / `WM_RBUTTONUP` | Celda | 1 izquierdo, 2 derecho |
| 4 | `WM_KEYDOWN` | Última celda conocida (`scr_lastx`, `scr_lasty`) | `wParam` completo: código de tecla virtual |
| 5 | `WM_DESTROY` | −1, −1 | 0 |
| 6 | `WM_SIZE` | `x` = `LOWORD(lParam)`, `y` = `HIWORD(lParam)`: cliente en píxeles | 0 |
| 7 | `WM_CHAR` ([§7.2](#72-caracteres)) o texto pegado ([§7.3](#73-pegado-ctrlv)) | Última celda conocida | Punto de código Unicode |
| 8 | `WM_ACTIVATE` | −1, −1 | 1 si `LOWORD(wParam)` ≠ 0 (`WA_ACTIVE`/`WA_CLICKACTIVE`); 0 si es `WA_INACTIVE` |

Reglas adicionales:

- Los eventos 1, 2 y 3 actualizan `scr_lastx`, `scr_lasty` con la celda calculada, incluso cuando es (−1, −1)
  (`so/pantalla.inc:633-634`).
- `WM_LBUTTONDOWN` y `WM_RBUTTONDOWN` llaman a `SetCapture(hwnd)`; `WM_LBUTTONUP` y `WM_RBUTTONUP` a
  `ReleaseCapture()` (`so/pantalla.inc:514-526`).
- Cualquier otro mensaje del rango 200h..205h (p. ej. 203h) no produce evento (`so/pantalla.inc:553`).
- El evento 5 pone `scr_live` = 0 antes de guardarse (`so/pantalla.inc:623-626`).
- `screen_note` preserva todos los registros y alinea la pila él mismo (`so/pantalla.inc:507-509`, `673-676`).

### 6.3 Anillo

`scr_ring` tiene `SCR_RING` = 256 casillas de 32 bytes; la casilla `i` está en `scr_ring + 32·i`; el más antiguo en
`scr_head`, la cantidad en `scr_count`. Inserción (`so/pantalla.inc:635-670`), bajo `scr_lock`:

1. Fusión de movimientos: si el nuevo evento es de tipo 1, `scr_count` > 0 y el último guardado
   (`(scr_head + scr_count − 1) mod 256`) también es de tipo 1, el nuevo lo sobrescribe en su lugar.
2. Si no, y el anillo está lleno (`scr_count` = 256), se descarta el más antiguo (`scr_head` avanza) y se inserta.
3. Si no, se inserta al final y `scr_count` aumenta.
4. Se libera `scr_lock` y `SetEvent(scr_event)`.

Extracción (`screen_take`, `so/pantalla.inc:991-1025`), bajo `scr_lock`: si `scr_ready` = 0 responde 0 sin tocar
nada. Si quedan letras pegadas ([§7.3](#73-pegado-ctrlv)), entrega la siguiente y responde 1. Si no, si `scr_count` > 0, copia la casilla
`scr_head` al destino, avanza `scr_head`, decrementa `scr_count` y responde 1. Si no, responde 0.

Invariante de orden: mientras queden letras pegadas, toda extracción entrega una letra pegada antes que cualquier
evento del anillo, incluidos eventos anteriores al pegado.

### 6.4 Concurrencia

- El hilo de la ventana nunca toma el cerrojo del núcleo (`so/pantalla.inc:504-505`). Se comunica con el núcleo
  sólo a través de `scr_lock`, el anillo y la campana `scr_event`.
- El núcleo nunca llama a funciones de ventana sobre `scr_hwnd` salvo `InvalidateRect` y `PostMessageW`
  (`so/pantalla.inc:131`, `287`, `911`); título y portapapeles los ejecuta el hilo de la ventana.
- `screen_waitable` (`so/pantalla.inc:976-987`) lee `scr_live`, `scr_count`, `scr_pastepos` y `scr_pastelen` sin
  cerrojo. Es correcto porque todo evento guardado después de esa lectura hace sonar la campana y el centinela vuelve
  a evaluar ([§8.4](#84-despertadores)).

## 7. Teclado y portapapeles

### 7.1 Teclas

Cada `WM_KEYDOWN` produce un evento 4 cuyo `extra` es el `wParam` completo, es decir el código de tecla virtual de
Windows (p. ej. `VK_RETURN` = 0Dh, `VK_LEFT` = 25h; valores del anfitrión). No hay evento de tecla soltada. El núcleo
no filtra ningún código: si el anfitrión envía `WM_KEYDOWN` por una tecla modificadora (Ctrl, Mayúsculas), también
produce un evento 4 (envío del anfitrión, no verificado en el código). Que el anfitrión repita `WM_KEYDOWN` al mantener
una tecla es comportamiento de Windows (no verificado en el código).

### 7.2 Caracteres

Cada `WM_CHAR` lleva una unidad UTF-16 en la palabra baja de `wParam`. `screen_note` (`so/pantalla.inc:581-605`):

| Unidad `u` | Acción |
|---|---|
| 16h (Ctrl+V) | Pegado ([§7.3](#73-pegado-ctrlv)); no se guarda evento de carácter. |
| D800h..DBFFh (mitad alta) | `scr_high` = `u`; sin evento. |
| DC00h..DFFFh (mitad baja) | Si `scr_high` = 0: se descarta. Si no: `cp` = 10000h + ((`scr_high` − D800h) << 10) + (`u` − DC00h); `scr_high` = 0; evento 7 con `extra` = `cp`. |
| cualquier otra | `scr_high` = 0; evento 7 con `extra` = `u`. |

Consecuencias: una mitad alta seguida de una unidad que no es mitad baja se pierde. Los caracteres de control llegan
como evento 7 con su valor: retroceso 08h, Enter 0Dh, Escape 1Bh, Ctrl+C 03h. El núcleo no da significado especial a
Ctrl+C: el programa decide (Luma copia al recibir el carácter 3, `razar/cuerpo/luma.jsm:50655-50659`). Que
`TranslateMessage` genere 03h para Ctrl+C y 16h para Ctrl+V es comportamiento del anfitrión (no verificado en el
código).

Secuencia típica de una tecla imprimible (orden del anfitrión, no verificado): evento 4 con el código virtual y
luego evento 7 con el carácter.

### 7.3 Pegado (Ctrl+V)

Captura, en el hilo de la ventana con `scr_lock` tomado (`screen_paste_take`, `so/pantalla.inc:738-802`):

1. `OpenClipboard(hwnd)`; si falla, termina (se conserva el pegado anterior).
2. `GetClipboardData(CF_UNICODETEXT (13))`; `GlobalLock`. Si alguno falla, cierra y termina.
3. Mide las unidades hasta el primer 0 (`len`).
4. Libera el búfer anterior (`scr_paste`); `scr_pastelen` = `scr_pastepos` = 0.
5. Si `len` > 0: reserva `2·len + 2` bytes, copia las `len` unidades, `scr_pastelen` = `len`.
6. `GlobalUnlock`, `CloseClipboard`.

Después se libera `scr_lock` y se hace `SetEvent(scr_event)` (`so/pantalla.inc:618-622`). Un nuevo Ctrl+V reemplaza
lo pendiente de un pegado anterior.

Entrega (`screen_paste_next`, `so/pantalla.inc:807-853`), una letra por cada `screen_take`:

1. Mientras `scr_pastepos` < `scr_pastelen`: tomar `u` = `scr_paste[scr_pastepos]`, avanzar.
2. 0Dh (CR): se omite y se sigue.
3. 0Ah (LF) y 09h (TAB): se convierten en 20h (espacio).
4. Mitad alta: si no quedan unidades, se omite. Si la siguiente unidad es mitad baja, se consume y se combinan
   como en [§7.2](#72-caracteres); si no, la mitad alta se omite (la siguiente unidad no se consume).
5. Se escribe un evento 7 con `x`, `y` = `scr_lastx`, `scr_lasty` y `extra` = el punto de código; resultado 1.
6. Si no quedan unidades, resultado 0.

Una mitad baja aislada en el texto pegado no se filtra: se entrega como punto de código DC00h..DFFFh
(`so/pantalla.inc:822-825`). Mientras queden letras pegadas, `screen_waitable` = 0, de modo que un pedido 41 no
duerme (`so/pantalla.inc:982-984`).

### 7.4 Copiar: pedido 47

`screen_copy` (`so/pantalla.inc:858-919`), en el contexto del núcleo:

1. Si `scr_hwnd` = 0: responde 0.
2. `MultiByteToWideChar(CP_UTF8 (65001), MB_ERR_INVALID_CHARS (8), texto, b, NULL, 0)` → `u` unidades. Si es 0:
   responde −1 (texto no UTF-8). Con `b` = 0 la función del anfitrión también devuelve 0, por lo que un texto vacío
   responde −1 (comportamiento del anfitrión, no verificado).
3. Reserva `2·u + 2` bytes (`VirtualAlloc`); si falla responde −1. Convierte.
4. Bajo `scr_lock`: libera el `scr_copy` anterior, guarda el nuevo y `scr_copylen` = `u`.
5. `PostMessageW(scr_hwnd, 8002h, 0, 0)`; responde `u` (unidades UTF-16; un carácter fuera del plano básico cuenta 2).

El hilo de la ventana, al recibir 8002h (`screen_clip`, `so/pantalla.inc:922-972`), bajo `scr_lock`: si hay texto,
`OpenClipboard(hwnd)`, `EmptyClipboard`, `GlobalAlloc(GMEM_MOVEABLE (2), 2·u + 2)`, copia y termina en 0,
`SetClipboardData(CF_UNICODETEXT, h)` y `CloseClipboard`. El búfer `scr_copy` se conserva hasta el próximo 47.

El pedido 47 es importante ([§2.2](#22-pedidos-de-este-capítulo)): el portapapeles es estado fuera de Janax. No hay pedido de pegado: el pegado llega
como letras tecleadas ([§7.3](#73-pegado-ctrlv)).

## 8. Esperar un evento: pedido 41

### 8.1 Interfaz

| Campo | Entrada | Salida |
|---|---|---|
| `a` | Dirección de un registro de 32 bytes en las salas de la cabina | Si la respuesta es 1, contiene el evento ([§6.1](#61-registro-de-evento-32-bytes)) |
| `b` | Espera máxima en ms; 0 = no esperar; ≥ FFFFFFFFh (comparación sin signo; incluye valores negativos) = sin plazo | Ms que quedaban de la espera ([§8.5](#85-servicio-serve_wait_event)) |
| `respuesta` | — | 1 evento entregado; 0 sin evento; −1 registro fuera de las salas |

### 8.2 Estados de `P_SCRW`

| Valor | Estado |
|---|---|
| 0 | No duerme sobre la pantalla. |
| 1 | Duerme: el toque está suspendido; contado en `scr_nwait`. |
| 2 | Despertada: la próxima marcación del toque no duerme y el servidor atiende. |

### 8.3 Marcación del toque (`event_must_wait`)

Al marcar cada entrada de clase 41 de un toque (`so/janaxos.asm:2308-2312`, `2878-2923`):

- Si `P_SCRW` = 2: no duerme.
- Si `P_SCRW` = 0: duerme sólo si (a) `cabin_at(a, 32)` es válido, (b) `b` ≠ 0 y (c) `screen_waitable` = 1 (ventana
  viva, anillo vacío, sin letras pegadas). Entonces `P_SCRDL` = `FOREVER` si `b` ≥ FFFFFFFFh, o `now + b`;
  `P_SCRW` = 1; `scr_nwait` += 1.
- Si `P_SCRW` = 1 (la cabina se volvió a marcar por otra causa del mismo toque): si `screen_waitable` = 0 o `now` ≥
  `P_SCRDL`, pasa a 2 y `scr_nwait` −= 1; si no, sigue durmiendo.

Si alguna entrada del toque duerme, ningún pedido del toque se atiende: `P_WAITING` = número de esperas y el `jsys` se
reejecuta al despertar (`so/janaxos.asm:2348-2355`, `2201-2207`; [capítulo 04 §3.4](04-nucleo-abi-de-pedidos.md#34-suspensión-y-reejecución)).

### 8.4 Despertadores

`event_wake` (`so/janaxos.asm:2998-3003`): `P_SCRW` = 2, `scr_nwait` −= 1, `P_WAITING` −= 1, `q_wake` (la cabina
vuelve a la fila si `P_WAITING` = 0, `so/remos.inc:406-418`). Lo invocan:

| Quién | Condición | Fuente |
|---|---|---|
| `screen_due` | Para cada cabina con `P_SCRW` = 1: si `screen_waitable` = 0 (hay evento, hay letras pegadas o la ventana murió), o la cabina terminó, o `now` ≥ `P_SCRDL`. | `so/janaxos.asm:2928-2958` |
| `greet` | La cabina recibe un saludo ([pedido 28](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas), o una palabra 30 que lo usa) mientras duerme sobre la pantalla. | `so/ambientes.inc:1481-1484` |
| `hw_wake` | La cabina tiene `P_HOSTW` ≠ 0 y hay algo nuevo del anfitrión ([§10.9](#109-protocolo-de-un-consumidor)). | `so/vigia.inc:146-153` |

`screen_due` se ejecuta con el cerrojo del núcleo: tras cada turno remado si `scr_nwait` > 0
(`so/remos.inc:230-232`), y en el centinela cuando suena `scr_event` o vence el tiempo ([§10.10](#1010-bucle-del-centinela-watch_wait)).

### 8.5 Servicio (`serve_wait_event`)

`so/janaxos.asm:2812-2873`. Sea `s` el valor de `P_SCRW` al entrar (0 o 2); `P_SCRW` pasa a 0.

1. Si `cabin_at(a, 32)` falla: respuesta −1; `b` no se modifica.
2. `r` = `screen_take(a)`; respuesta `r`.
3. Reescritura de `b`:

| `r` | `s` | `P_SCRDL` | `b` de salida |
|---|---|---|---|
| 1 | 0 | — | sin cambio |
| 1 | 2 | `FOREVER` | sin cambio |
| 1 | 2 | finito | max(0, `P_SCRDL` − `now`) |
| 0 | 0 | — | 0 |
| 0 | 2 | `FOREVER` | sin cambio |
| 0 | 2 | finito | max(0, `P_SCRDL` − `now`) |

Una respuesta 0 tras dormir significa que venció el plazo (`b` = 0) o que sonó el timbre de la cabina (saludo o
palabra, `b` = lo que quedaba), o que llegó algo nuevo del anfitrión, o que la ventana se cerró y el anillo quedó
vacío. Tras el cierre de la ventana el anillo todavía contiene el evento 5 y los anteriores no extraídos; se siguen
entregando sin dormir.

## 9. Sonido: pedido 44

`screen_sound` (`so/pantalla.inc:75-104`):

1. Si `scr_hwnd` = 0: respuesta 0 (sin ventana no hay sonido).
2. Primera nota (`scr_midi` = 0): `midiOutOpen(&scr_midi_h, MIDI_MAPPER (−1), 0, 0, CALLBACK_NULL (0))`;
   `scr_midi` = 1 si tuvo éxito, −1 si no. El dispositivo nunca se cierra.
3. Si `scr_midi` ≠ 1: respuesta −1.
4. `midiOutShortMsg(scr_midi_h, a & FFFFFFh)`: byte 0 estado, byte 1 nota, byte 2 intensidad (empaquetado de
   mensaje corto MIDI). Respuesta 1 si devuelve 0 (`MMSYSERR_NOERROR`), −1 si no.

## 10. Vigía y centinela

### 10.1 Alcance

El centinela (`watch_wait`) es el único lugar donde el núcleo duerme esperando fuentes externas. Combina tres
fuentes: la carpeta propia y el tablero (pedido 32, prefijos de etiqueta; [capítulo 04 §9.7](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas)), las carpetas del
anfitrión de `JANAX_VIGIA` (pedido 39) y la campana de pantalla (pedido 41). El vigía no lee el contenido de los
archivos: entrega rutas; decidir si un archivo es texto corresponde al programa (`so/vigia.inc:11-12`).

### 10.2 Configuración

`hw_start` (`so/vigia.inc:16-83`), llamada al arrancar después de conocer carpeta propia y tablero
(`so/janaxos.asm:709-715`):

1. `GetEnvironmentVariableW("JANAX_VIGIA", hw_raw, 32767)`. Si el resultado es ≥ 32767 (no cabe entero), no se
   vigila nada. Si la variable no existe el resultado es 0 y tampoco hay carpetas.
2. Se separa por `;`. Cada separador se reemplaza por 0. Un segmento vacío se ignora. Se guardan como máximo
   `HW_MAX` = 61 carpetas; las siguientes se ignoran (`hw_folder`, `so/vigia.inc:87-101`). Cada carpeta `i` queda en
   `hw_root[i]` (puntero UTF-16 terminado en 0) y `hw_rlen[i]` (caracteres). No se recortan espacios ni se normaliza
   la ruta.
3. Para cada carpeta, una campana `CreateEventA(0, FALSE, FALSE, 0)` en `watch_event[2 + i]`.
4. Carpeta propia y tablero se convierten a UTF-16 con `MultiByteToWideChar(CP_ACP (0), ...)` en `dir_w`/`dir_wn` y
   `board_w`/`board_wn` (sólo si hay tablero).
5. Carpetas conocidas: `SHGetKnownFolderPath` para cada uno de los `HW_KNOWN` = 7 identificadores de la tabla
   siguiente; las que responden se guardan en orden compacto en `hw_sys`, `hw_sysn`, con `hw_sysr` = 1 si el índice
   original es ≥ `HW_SECRET` = 4 (`so/janaxos.asm:332-359`). Las rutas devueltas no se liberan nunca.

| Índice | `KNOWNFOLDERID` | GUID | `hw_sysr` |
|---|---|---|---|
| 0 | LocalAppData | F1B32785-6FBA-4FCF-9D55-7B8E7F157091 | 0 (cerrada) |
| 1 | RoamingAppData | 3EB685DB-65F9-4CF6-A03A-E3EF65729F3D | 0 (cerrada) |
| 2 | LocalAppDataLow | A520A1A4-1780-4FF6-BD18-167343C5AF16 | 0 (cerrada) |
| 3 | ProgramData | 62AB5D82-FDC1-4DC3-A9DD-070D1D495D97 | 0 (cerrada) |
| 4 | Windows | F38BF404-1D43-42F2-9305-67DE0B28FC23 | 1 (legible) |
| 5 | ProgramFiles | 905E63B6-C1BF-494E-B29C-65B732D3D21A | 1 (legible) |
| 6 | ProgramFilesX86 | 7C5A40EF-A0FB-4BFC-874A-C0F2E0B9FA8E | 1 (legible) |

### 10.3 Constantes

| Constante | Valor | Mide | Fuente |
|---|---|---|---|
| `HW_MAX` | 61 | Carpetas del anfitrión. 61 + carpeta propia + tablero + pantalla = 64, el máximo de `WaitForMultipleObjects`. | `so/janaxos.asm:308-309` |
| `HW_RAW` | 32768 | Unidades UTF-16 de `JANAX_VIGIA` | `so/janaxos.asm:310` |
| `HW_PATH` | 32768 | Unidades UTF-16 de una ruta (máximo del anfitrión) | `so/janaxos.asm:311` |
| `HW_U8` | 98304 | Bytes UTF-8 de una ruta (3 por unidad) | `so/janaxos.asm:312` |
| `HW_BUF` | 65536 | Bytes del búfer de notificaciones por carpeta del anfitrión | `so/janaxos.asm:313` |
| `HW_QUIET` | 67803 | Ms sin otra notificación para que un archivo se considere quieto. El comentario la atribuye a una medición (percentil 99 de los intervalos entre notificaciones de un mismo archivo en dos unidades durante 3 minutos); la medición no consta en el código (no verificado). | `so/janaxos.asm:314-315` |
| `WATCH_BUF` | 4096 | Bytes del búfer de notificaciones de carpeta propia y tablero | `so/janaxos.asm:294` |
| `HW_KNOWN`, `HW_SECRET` | 7, 4 | Carpetas conocidas y cuántas son cerradas | `so/janaxos.asm:332`, `358` |

### 10.4 Estado

| Símbolo | Contenido | Fuente |
|---|---|---|
| `watch_dir[0..62]` | Manejador de directorio por índice de campana (0 propia, 1 tablero, 2+`i` carpeta `i`); 0 = no abierto | `so/janaxos.asm:295` |
| `watch_pend[...]` | 1 = hay una lectura asíncrona pendiente | `so/janaxos.asm:296` |
| `watch_event[...]` | Campana de cada índice | `so/janaxos.asm:297` |
| `watch_set[0..63]` | Copia de campanas más la de pantalla al final, para la espera | `so/janaxos.asm:298` |
| `watch_scr` | Índice de la campana de pantalla en `watch_set`, −1 si no está | `so/janaxos.asm:299` |
| `watch_in` | 1 = un remero está dentro del centinela | `so/janaxos.asm:300` |
| `scr_nwait` | Cabinas con `P_SCRW` = 1 | `so/janaxos.asm:301` |
| `watch_ov[...]` | Un `OVERLAPPED` de 32 bytes por índice; `hEvent` en +24 | `so/janaxos.asm:302` |
| `watch_got[...]` | Bytes devueltos por la última lectura (un dword por índice) | `so/janaxos.asm:303` |
| `watch_buf` | 2 × 4096 bytes (propia y tablero) | `so/janaxos.asm:305` |
| `hw_bufs[i]` | Búfer de 65536 bytes de la carpeta `i`, reservado la primera vez | `so/janaxos.asm:319`, `so/vigia.inc:175-180` |
| `hw_pend`, `hw_pendn`, `hw_pendc` | Lista de pendientes: puntero, bytes usados, capacidad | `so/janaxos.asm:322-324` |
| `hw_ready`, `hw_readyn`, `hw_readyc` | Lista de listos: puntero, bytes usados, capacidad | `so/janaxos.asm:325-327` |
| `hw_path`, `hw_pathn` | Ruta de trabajo UTF-16 y su longitud | `so/janaxos.asm:328`, `365` |

### 10.5 Armado de lecturas

`hw_read(k)` para `k` ≥ 2 (`so/vigia.inc:170-208`): si `watch_pend[k]` = 1 no hace nada. Si no hay búfer lo reserva;
si no hay manejador, `CreateFileW(hw_root[k−2], FILE_LIST_DIRECTORY (1), compartir lectura/escritura/borrado (7),
NULL, OPEN_EXISTING, FILE_FLAG_OVERLAPPED | FILE_FLAG_BACKUP_SEMANTICS (42000000h), 0)`. Luego
`ReadDirectoryChangesW(h, hw_bufs[k−2], 65536, bWatchSubtree = TRUE, 19h, NULL, &watch_ov[k], NULL)` con
19h = `FILE_NOTIFY_CHANGE_FILE_NAME` (1) \| `FILE_NOTIFY_CHANGE_SIZE` (8) \| `FILE_NOTIFY_CHANGE_LAST_WRITE` (10h);
`watch_pend[k]` = 1. Un fallo deja la carpeta sin lectura, sin informe.

Para comparación, carpeta propia y tablero (`watch_read`, `so/ambientes.inc:1825-1858`): `CreateFileA`, búfer de
4096, `bWatchSubtree` = FALSE, filtro 11h (`FILE_NAME` \| `LAST_WRITE`).

Las lecturas de las carpetas del anfitrión sólo se arman cuando `hw_watched` = 1 ([§10.9](#109-protocolo-de-un-consumidor)). Que el anfitrión acumule
cambios entre una lectura y la siguiente sobre el mismo manejador es comportamiento de Windows (no verificado en el
código); antes del primer armado no se observa nada.

### 10.6 Recepción de una notificación (`hw_told`)

Cada registro `FILE_NOTIFY_INFORMATION` (+0 `NextEntryOffset`, +4 `Action`, +8 `FileNameLength` en bytes, +12 nombre
UTF-16 relativo a la carpeta, puede incluir subcarpetas) se procesa así (`so/vigia.inc:212-273`):

1. Sólo acciones 1 (`FILE_ACTION_ADDED`), 3 (`FILE_ACTION_MODIFIED`) y 5 (`FILE_ACTION_RENAMED_NEW_NAME`). Borrados y
   nombre viejo se ignoran.
2. Ruta = raíz tal como se escribió + `\` (si la raíz no termina en `\`) + nombre. Si superaría 32767 unidades, se
   ignora.
3. Se descarta si la ruta está bajo la carpeta propia (`dir_w`), el tablero (`board_w`) o una carpeta conocida
   cerrada (`hw_sysr` = 0).
4. Si no, `hw_note`.

`hw_under(carpeta)` (`so/vigia.inc:278-324`): verdadero si la ruta empieza por la carpeta y el carácter siguiente es
separador. La comparación trata `/` y `\` como iguales, ignora un separador final de la carpeta y pliega A–Z a a–z
(sólo ASCII). Una carpeta de longitud 0 nunca contiene nada.

### 10.7 Quietud, reglas y lista de listos

Lista de pendientes (`hw_note`, `so/vigia.inc:327-371`). Entrada:

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | `t`: ms de la última notificación |
| 8 | 8 | `n`: unidades UTF-16 de la ruta |
| 16 | ⌈2·`n`/8⌉·8 | Ruta UTF-16, sin terminador, rellenada a múltiplo de 8 |

Si la ruta ya está, sólo se actualiza `t` (su quietud vuelve a empezar). Si no, se agrega al final.

Crecimiento (`hw_grow`, `so/vigia.inc:376-420`): lista `{puntero, usados, capacidad}`; si no cabe, nueva capacidad =
max(2·capacidad, necesario), redondeada a 4096; se copia y se libera la anterior. Sin memoria, la entrada se pierde.

Plazo (`hw_wait_ms`, `so/vigia.inc:424-456`): −1 (infinito) si no hay pendientes; si no, min sobre las entradas de
max(0, `t` + 67803 − `now`).

Maduración (`hw_mature`, `so/vigia.inc:460-508`): cada entrada con `now` − `t` ≥ 67803 se quita de la lista, se pasa
por `hw_rules` y, si las cumple, por `hw_ready_put`. Responde 1 si se agregó algo a la lista de listos. Un archivo que
recibe notificaciones a intervalos menores que `HW_QUIET` nunca madura; uno borrado antes de madurar no cumple la
regla 1.

Reglas del anfitrión (`hw_rules`, `so/vigia.inc:515-601`), evaluadas en orden; la primera que falla rechaza:

1. `GetFileAttributesW(ruta)` válido y sin `FILE_ATTRIBUTE_DIRECTORY` (10h), `HIDDEN` (2) ni `SYSTEM` (4).
2. Para cada `\` de la ruta en posición ≥ 1: si el carácter siguiente es `.`, rechaza (ningún componente, incluido el
   nombre del archivo, puede empezar con punto). Si el anterior es `:` (raíz de unidad), se salta. Si no, atributos
   del prefijo: si son inválidos se salta; si tienen `HIDDEN` o `SYSTEM`, rechaza.
3. Si la ruta está bajo una carpeta conocida legible (`hw_sysr` = 1: Windows, ProgramFiles, ProgramFilesX86):
   acepta sin las reglas 4 y 5.
4. Carpeta contenedora (la ruta hasta el último `\`, conservando `\` tras `X:`): `CreateFileW(carpeta, FILE_ADD_FILE
   (2), 7, NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS (02000000h), 0)`. Si falla con `ERROR_ACCESS_DENIED` (5),
   rechaza (agregar un archivo allí requiere derechos de administrador). Otro error: sigue. Éxito: cierra el manejador.
5. Propietario: `GetNamedSecurityInfoW(ruta, SE_FILE_OBJECT (1), OWNER_SECURITY_INFORMATION (1), ...)`; si falla,
   rechaza. `CheckTokenMembership(NULL, sid, &m)`: acepta sólo si la llamada tiene éxito y `m` ≠ 0 (el usuario es el
   propietario o pertenece al grupo propietario). Se libera el descriptor con `LocalFree`.

Lista de listos (`hw_ready_put`, `so/vigia.inc:605-651`): la ruta se convierte a UTF-8 (`WideCharToMultiByte`,
`CP_UTF8`, hasta 98304 bytes; si falla se pierde). Si una entrada con la misma ruta UTF-8 ya está en la lista, no se
agrega. Entrada:

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | `m`: bytes UTF-8 de la ruta |
| 8 | ⌈`m`/8⌉·8 | Ruta UTF-8, sin terminador, rellenada a múltiplo de 8 |

### 10.8 Entrega: pedido 39

`gate_hostnew` (`so/vigia.inc:657-701`):

1. `prefix_allows` del portero de archivos (`P_GATES + 2·8`) con etiqueta vacía (`norm_len` = 0): si algún portero de
   la cadena hasta la raíz tiene prefijo de etiqueta, el prefijo no cabe en la etiqueta vacía y la respuesta es −1
   (`so/janaxos.asm:3105-3132`). Es decir, sólo una cabina sin restricción de prefijo puede asomarse al anfitrión.
2. Si `hw_n` = 0 (nada vigilado): −1.
3. `P_HOSTW` = 1 (permanente).
4. Si la lista de listos está vacía: respuesta 0.
5. Primera entrada (la más antigua), de `m` bytes: si `m` > `b` → −1; si `cabin_at(a, m)` falla → −1. En ambos casos
   la entrada permanece.
6. Copia los `m` bytes a `a` (sin terminador), quita la entrada de la lista (desplazando el resto) y responde `m`.

La ruta entregada es la raíz de `JANAX_VIGIA` tal como se escribió, un `\` y el nombre relativo notificado.

### 10.9 Protocolo de un consumidor

1. La cabina pide 39. Respuesta `m` > 0: tiene una ruta; repetir 39 hasta obtener 0.
2. Con 0, la cabina duerme con 29 (esperar un saludo) o con 41 (esperar un evento de pantalla).
3. Cuando hay algo nuevo, `hw_wake` (`so/vigia.inc:135-166`) recorre las cabinas vivas con `P_HOSTW` ≠ 0: si duerme
   sobre la pantalla (`P_SCRW` = 1), `event_wake` (su 41 responde 0); si espera un saludo (`P_GWAIT` = 1),
   `watch_wake` le da un saludo de sí misma (`so/ambientes.inc:1981-2009`) y su 29 responde con su propio número.
4. Despierta, vuelve al paso 1.

`hw_watched` (`so/vigia.inc:105-131`) = 1 si `hw_n` > 0 y alguna cabina viva con `P_HOSTW` ≠ 0 tiene `P_GWAIT` = 1 o
`P_SCRW` = 1. Sólo entonces se arman las lecturas de las carpetas del anfitrión.

### 10.10 Bucle del centinela (`watch_wait`)

Precondición (`so/remos.inc:155-205`): la fila está vacía, ningún remero rema, alguna cabina viva tiene
`P_WAITING` ≠ 0 y ningún otro remero está dentro del centinela (`watch_in` = 0). Se entra con el cerrojo del núcleo.
Si responde 0, el remero pasa a `nobody_signs` ([capítulo 03](03-nucleo-arranque-memoria-procesos.md#106-nadie-firma)).

`so/ambientes.inc:1680-1820`:

1. `watch_in` = 1. `watch_any` (`so/ambientes.inc:1886-1913`): si ninguna cabina viva cumple `P_SCRW` = 1, o
   (`P_GWAIT` = 1 y (`P_WATCHN` > 0 o (`P_HOSTW` ≠ 0 y `hw_n` > 0))), responde 0.
2. `despertó` = 0. Si la lista de listos no está vacía: `hw_wake` y saltar a 9.
3. Armar carpeta propia (`watch_read(0)`). Si falla: `nc` = 0 y, si `scr_nwait` = 0, responder 0; si no, ir a 5 (sólo
   la campana de pantalla). Si tiene éxito: `nc` = 1; si hay tablero y `watch_read(1)` tiene éxito, `nc` = 2.
4. Si `hw_watched`: `hw_read(k)` para `k` = 2..`hw_n`+1, y `nc` = `hw_n` + 2 (los fallos individuales no cambian
   `nc`; la campana de un índice sin lectura nunca suena).
5. Plazo `T` = min(`hw_wait_ms`, plazo más próximo de las cabinas con `P_SCRW` = 1 y `P_SCRDL` finito)
   (`screen_wait_ms`, `so/janaxos.asm:2962-2994`), comparado sin signo (−1 = infinito).
6. Si `scr_nwait` > 0: `watch_set` = `watch_event[0..nc)` + `scr_event`, `watch_scr` = `nc`, total `nc` + 1. Si no,
   se espera sobre `watch_event[0..nc)` y `watch_scr` = −1.
7. Liberar el cerrojo del núcleo; `WaitForMultipleObjects(total, conjunto, FALSE, T)`; retomar el cerrojo.
8. Según el resultado `r`:
   - `r` = `watch_scr`: `screen_due`; `despertó` \|= su resultado.
   - `r` = 102h (`WAIT_TIMEOUT`): `screen_due`; luego `hw_mature`; si dio 1, `hw_wake`.
   - `r` ≥ `nc` (fallo del anfitrión u otro valor): responder 0.
   - `r` < `nc`: `watch_pend[r]` = 0; `GetOverlappedResult(watch_dir[r], &watch_ov[r], &watch_got[r], FALSE)`; si
     falla, ir a 9. Si devolvió 0 bytes (desborde del búfer): para `r` ≥ 2 se ignora (lo perdido no se conoce); para
     `r` < 2, `watch_all` despierta a todas las cabinas vivas que esperan saludo y vigilan prefijos, y `despertó` = 1
     aunque no hubiera ninguna (`so/ambientes.inc:1775-1777`). Si devolvió datos: para
     `r` < 2, `watch_name` por cada registro ([§10.11](#1011-carpeta-propia-y-tablero-contexto)); para `r` ≥ 2, `hw_told` por cada registro.
9. Si `despertó` = 0, volver a 3. Si no, `watch_in` = 0 y responder 1.

Invariantes: sin pendientes ni plazos de pantalla, `T` es infinito y el centinela no consume procesador
(`so/vigia.inc:422-423`). Los pendientes sólo maduran dentro del centinela, en un `WAIT_TIMEOUT`; mientras haya
cabinas remando, la maduración se difiere.

### 10.11 Carpeta propia y tablero (contexto)

Pedido 32 (`gate_watch`, `so/ambientes.inc:1633-1674`): `a` = bytes del prefijo (0..8; 0 vacía la lista), `b` = el
prefijo en un qword; un prefijo repetido no se duplica. `watch_name` (`so/ambientes.inc:1917-1978`): un nombre de
archivo de la carpeta propia es la etiqueta en hexadecimal en minúsculas; si sus primeras `2·p` letras (plegando
mayúsculas con `or 20h`) coinciden con el hexadecimal de un prefijo de una cabina que espera saludo, esa cabina recibe
un saludo de sí misma. Especificación completa del pedido 32 en el [capítulo 04 §9.7](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas).

## 11. Venn: motor de selección

### 11.1 Definición

Venn (`so/venn.inc`) es un motor genérico que recibe dos conjuntos `A` y `B`, accesibles sólo mediante adaptadores, y
una palabra Venn; entrega, uno por uno y en el orden pedido, los elementos de la selección a una rutina del llamante.
El motor no conoce salas, archivos ni procesos. Su único uso actual en el núcleo es la asociación de carteles del
pedido 27 ([§11.6](#116-protocolo-de-asociación-pedido-27)).

### 11.2 Palabra Venn

| Bits | Constante | Significado |
|---|---|---|
| 0–2 | `VENN_REGIONS` = 7 | Regiones: bit 0 = elementos que ambos conjuntos tienen (misma clave); bit 1 = sólo de `A`; bit 2 = sólo de `B`. 0 ninguno, 7 todos. |
| 3 | `VENN_B_FIRST` = 8 | Mirada: 0 `A` primero, 1 `B` primero. Un elemento compartido se entrega desde el lado mirado primero, con su pareja del otro. |
| 4–7 | — | Criterio: 0 el orden de cada conjunto; `n` > 0 un valor que el adaptador sabe dar. |
| 8 | `VENN_DESC` = 100h | Descendente (sólo en modo selección, [§11.4](#114-algoritmo-venn_run-sovenninc61-124)). |
| 9 | `VENN_WHOLE` = 200h | El criterio ordena la selección entera (0: dentro de cada lado, en el orden de la mirada). |
| 10–15 | — | Reservados: deben ser 0. |
| 16–31 | — | Cantidad máxima a entregar (0 = todos). |
| 32–63 | — | Reservados: deben ser 0. |

`VENN_KNOWN` = 0FFFF03FFh (`so/venn.inc:29`): quien acepta una palabra DEBE rechazar cualquier bit fuera de esta
máscara, de modo que un eje futuro no cambie lo que pedía un programa anterior. El motor mismo no lo comprueba; lo
hace `rooms_associate` (`so/ambientes.inc:1277-1280`), y en 64 bits, por lo que los bits 32–63 también deben ser 0.

### 11.3 Estructuras

Conjunto `VS` (64 bytes, `so/venn.inc:33-40`). Cada rutina se llama con `rsi` = el conjunto; puede usar `rax`, `rcx`,
`rdx`, `r8`–`r11` y DEBE preservar el resto. Un elemento es un valor de 64 bits distinto de 0.

| Desplazamiento | Campo | Contrato |
|---|---|---|
| 0 | `VS_FIRST` | → `rax` = primer elemento, 0 si no hay |
| 8 | `VS_NEXT` | `rax` = elemento → `rax` = siguiente, 0 al final |
| 16 | `VS_KEY` | `rax` = elemento → `rax` = su clave (la misma cosa tiene la misma clave en ambos conjuntos) |
| 24 | `VS_FIND` | `rax` = clave → `rax` = el elemento con esa clave, 0 si no hay |
| 32 | `VS_CRIT` | `rax` = elemento, `ecx` = criterio → `rax` = su valor (sin signo) |
| 40 | `VS_CRITS` | Máscara de criterios conocidos (bit `n` = criterio `n`) |
| 48 | `VS_DATA` | Dato propio del adaptador |
| 56 | — | Sin uso |

Selección `VQ` (136 bytes, `so/venn.inc:43-57`). El llamante llena los cinco primeros campos:

| Desplazamiento | Campo | Contenido |
|---|---|---|
| 0 | `VQ_WORD` | Palabra Venn |
| 8 | `VQ_A` | Puntero al conjunto `A` |
| 16 | `VQ_B` | Puntero al conjunto `B` |
| 24 | `VQ_GIVE` | Rutina receptora: `rax` = elemento, `rdx` = pareja en el otro conjunto (0 ninguna), `rcx` = conjunto del elemento (0 `A`, 1 `B`), `rdi` = la selección. Puede usar `rax`, `rcx`, `rdx`, `rsi`, `r8`–`r11`. |
| 32 | `VQ_USER` | Dato del llamante |
| 40 | `VQ_GIVEN` | Entregados (lo escribe el motor) |
| 48 | `VQ_LAST` | Última clave entregada `{k1, k2, lugar}` (24 bytes) |
| 72 | `VQ_HAS` | 1 si `VQ_LAST` es válida |
| 80 | `VQ_BEST` | Mejor candidata `{k1, k2, lugar}` (24 bytes) |
| 104 | `VQ_BEL` | Su elemento |
| 112 | `VQ_BPART` | Su pareja |
| 120 | `VQ_BSET` | Su conjunto |
| 128 | `VQ_FOUND` | 1 si se halló candidata en la pasada |

### 11.4 Algoritmo (`venn_run`, `so/venn.inc:61-124`)

Sea `P` el conjunto mirado primero (`A`, o `B` si el bit 3 está) y `S` el otro; `letra(P)` = 0 si `P` = `A`.

Pertenencia (`venn_in`, `so/venn.inc:148-173`) de un elemento `e` de un conjunto `X` con letra `l`, siendo `Y` el
otro: `p` = `Y.FIND(X.KEY(e))`. Si `p` ≠ 0 (compartido): pertenece sólo si `X` es el mirado primero y el bit 0 está
activo; su pareja es `p`. Si `p` = 0: pertenece si está el bit 1 (`l` = 0) o el bit 2 (`l` = 1). Así cada elemento
compartido se entrega una sola vez.

Entrega (`venn_give`, `so/venn.inc:128-143`): llama a `VQ_GIVE`, incrementa `VQ_GIVEN` y detiene la selección si la
cantidad (bits 16–31) es ≠ 0 e igual a `VQ_GIVEN`.

Modo flujo (criterio = 0 y bit 9 = 0): una pasada por `P` en su orden y luego una por `S` (`venn_stream`,
`so/venn.inc:177-215`), entregando los que pertenecen. Costo: una pasada por conjunto más un `FIND` por elemento. En
este modo el bit 8 no tiene efecto.

Modo selección (criterio ≠ 0, o bit 9 = 1): cada elemento perteneciente tiene una clave de tres componentes sin
signo, con `lado` = 0 para `P` y 1 para `S`, `v` = `CRIT(e, criterio)` (o `NOT v` si el bit 8 está) y `lugar` = su
índice en su conjunto contando todos sus elementos:

- bit 9 = 1: clave `(v, lado, lugar)`.
- bit 9 = 0: clave `(lado, v, lugar)`.

El motor repite: recorrer ambos conjuntos (`venn_scan`, `so/venn.inc:219-293`) buscando la clave mínima
lexicográfica estrictamente mayor que la última entregada; si existe, entregarla. Termina cuando no queda ninguna o
se alcanza la cantidad. Costo O(n²) recorridos por selección; el comentario lo declara criterio y no medición
(`so/venn.inc:22-23`). Con criterio 0 y bit 9 = 1 se llama a `CRIT` con `ecx` = 0.

Registros: `venn_run` preserva `rbx`, `rbp`, `rdi`, `r12`–`r15`.

### 11.5 Adaptador de cartel

Un cartel de salas de una cabina como conjunto (`so/ambientes.inc:1396-1445`); `VS_DATA` = puntero a la cabina.
Entrada de cartel (32 bytes, `so/ambientes.inc:39-44`): +0 `RE_PLACE` (lugar en los 48 bits bajos, trato en los 16
bits altos, `so/ambientes.inc:46-61`), +8 `RE_SIZE`, +16 `RE_KEY`, +24 `RE_BOX` (número de caja en los 48 bits
bajos). Del trato, el adaptador y la receptora sólo usan los bits 48–49 (`ROOM_READ` = 1 shl 48, `ROOM_WRITE` =
1 shl 49): el resto de los bits de trato (ejecución, adición, aviso, etc.) no se transmite al hijo por esta vía
(`so/ambientes.inc:1384-1394`).

| Rutina | Implementación |
|---|---|
| `cartel_first` / `cartel_next` | Entradas de `P_ROOMS` en orden, saltando las destruidas (`RE_SIZE` = 0). |
| `cartel_key` | Número de caja: `RE_BOX` & (2⁴⁸ − 1). |
| `cartel_find` | `box_find`: la entrada viva con ese número de caja, o 0. |
| `cartel_crit` | 1 tamaño (`RE_SIZE`); 2 número de caja; 3 trato (`RE_PLACE >> 48 & 3`); otro → 0. |
| `CARTEL_CRITS` | 0Fh (criterios 0..3). |

Estructuras globales `assoc_va`, `assoc_vb` (adaptadores) y `assoc_vq` (selección con receptora `assoc_give`)
(`so/janaxos.asm:190-194`). Son únicas y se usan con el cerrojo del núcleo; el motor no es reentrante sobre ellas.

### 11.6 Protocolo de asociación: pedido 27

1. Cabina `A` pide 27 con `a` = número de cabina de su familia `B`, `b` = palabra Venn (`gate_assoc`,
   `so/janaxos.asm:4387-4394`).
2. `rooms_associate` (`so/ambientes.inc:1276-1300`): −1 si `b` tiene bits fuera de `VENN_KNOWN`, si el criterio
   (bits 4–7) no está en `CARTEL_CRITS`, o si `a` no es una cabina de la familia (`cabin_family`, [capítulo 03](03-nucleo-arranque-memoria-procesos.md#91-relaciones)). Si no,
   `A.P_PARTNER` = `B`, `A.P_ASSOC` = `b`; respuesta 0. Una nueva petición reemplaza la anterior.
3. `B` hace lo mismo nombrando a `A` (cada una nombra a la otra).
4. Cuando `A` lanza su próximo hijo, `rooms_born` (`so/ambientes.inc:1004-1020`) entrega la dote y llama a
   `rooms_assoc` (`so/ambientes.inc:1356-1380`): se borra `A.P_PARTNER` (uso único) y, sólo si `B.P_PARTNER` = `A`,
   `B` no terminó y ambas tienen cartel, se ejecuta `venn_run` con `A` = cartel de la madre, `B` = cartel de la pareja
   y la palabra de la madre.
5. `assoc_give` (`so/ambientes.inc:1384-1394`) entrega cada caja seleccionada al hijo (`box_give`) con el trato
   `(RE_PLACE >> 48) & 3` de su entrada; si tiene pareja (caja compartida), con el AND de ese valor y el de la
   pareja.

El comentario de `gate_assoc` (`so/janaxos.asm:4385-4386`) describe `b` como "0 compartidas, 1 mías, 2 suyas, 3
todas"; el código interpreta `b` como palabra Venn ([§11.2](#112-palabra-venn)), donde 1 = compartidas, 2 = sólo de `A`, 4 = sólo de `B`,
7 = todas, y 0 no selecciona nada. Prevalece el código.

## 12. Ventanita al anfitrión (`jhost`)

### 12.1 Instrucción

[`jhost rd, ra`](01-idioma-janax.md#7-protocolo-de-la-ventana-al-anfitrión-jhost) es la palabra de código de operación 17h (`escalon0/janax.inc:104`): `ra` contiene la dirección Janax de
un bloque y `rd` recibe la respuesta. En el escalón 0 la ejecutan el intérprete (`op_host`,
`escalon0/janax.asm:31`, `359-368`) y el traductor (`e_host`, `escalon0/traductor.asm:105`, `533-537`; la
dirección de `host_service` se guarda en `C_HOST` del contexto, `escalon0/traductor.asm:46`, `999-1000`); el código
16h ([`jsys`](01-idioma-janax.md#58-jsys-janax-os)) es inválido allí (`fail_op` en el intérprete, `e_bad` en el traductor). En JanaxOS la ejecuta `op_jhost` (`so/janaxos.asm:2166-2172`).

### 12.2 Bloque

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | `pedido` (0 = catálogo) |
| 8 | 8 | `a` |
| 16 | 8 | `b` |
| 24 | 8 | `c` (sin uso en los pedidos actuales) |

### 12.3 Escalón 0 (`host_service`)

`escalon0/ventanita.inc:12-84`, con `rdx` = base de la memoria de datos (`DATA_SIZE` = 2²⁰,
`escalon0/janax.asm:14`):

1. La primera vez, `host_init` (aplica `JANAX_SIN`, descrito al final de esta sección).
2. Dirección del bloque > `DATA_SIZE` − 32 → código de salida 5; no alineada a 8 → código 6.
3. Pedido 0 (catálogo): `a` = destino (alineado a 8, si no código 6), `b` = bytes disponibles. Por cada pedido
   ofrecido y activo: se cuenta; si quedan ≥ 16 bytes, se escribe `{nombre (8 bytes), número (8 bytes)}` en `a`
   (si `a` > `DATA_SIZE` − 16, código 5), `a` += 16, `b` −= 16. Respuesta: cuántos se ofrecen (aunque no quepan).
4. Pedido `n` ≠ 0: si está en el catálogo y activo, se ejecuta; si no, respuesta −1.
5. Con código de salida ≠ 0, el intérprete termina el proceso con ese código (`escalon0/janax.asm:363-368`).

Catálogo (`escalon0/ventanita_datos.inc:3-7`):

| Nombre (8 bytes ASCII) | Número | Rutina | Semántica |
|---|---|---|---|
| `escribir` | 1 | `host_escribir` | `a` = dirección, `b` = bytes; si `a` > `DATA_SIZE` o `b` > `DATA_SIZE` − `a`, código 5. `WriteFile` a la salida estándar; respuesta = bytes escritos (`escalon0/ventanita.inc:87-101`). |

`JANAX_SIN` (`host_init`, `escalon0/ventanita.inc:104-163`): se lee con `GetEnvironmentVariableA` en un búfer de
`HOST_SIN_CAP` = 256 bytes; si el resultado es ≥ 255 no se quita nada. Lista separada por comas; cada nombre de hasta
8 bytes se empaqueta little-endian en un qword y desactiva los pedidos de nombre igual. Un nombre de más de 8 bytes no
desactiva nada.

### 12.4 JanaxOS (`host_window`)

`so/anfitrion.inc:6-30`. Un proceso de JanaxOS se comunica con el sistema por la ventanilla; la ventanita le ofrece un
catálogo vacío. `cabin_at(bloque, 32)` inválido → código 5; bloque no alineado a 8 → 6. Pedido 0: si `a` no está
alineado a 8 → 6; respuesta 0. Otro pedido: −1. Con código ≠ 0 el proceso termina por `ended` con ese código
(`so/janaxos.asm:2169-2170`; semántica de `ended` en el [capítulo 03](03-nucleo-arranque-memoria-procesos.md#96-fin-de-una-cabina-secuencia-completa)).

## 13. Observaciones del código

Hechos comprobados en el código que un reimplementador debe conocer:

1. `scr_title` se escribe en el contexto del núcleo (`so/pantalla.inc:115-125`) y se lee en el hilo de la ventana
   (`so/pantalla.inc:410-411`) sin `scr_lock`. Un 43 concurrente con el procesamiento de 8001h puede mostrar un título
   mezclado hasta el siguiente 43.
2. `screen_note` llama a `GetClientRect` sobre `scr_erect` antes de tomar `scr_lock` (`so/pantalla.inc:528-529`);
   `scr_erect` sólo lo usa ese hilo, por lo que no hay carrera.
3. `screen_copy` comprueba `scr_hwnd` al entrar y lo vuelve a leer para `PostMessageW` sin cerrojo
   (`so/pantalla.inc:864`, `907-911`); si la ventana se destruye entre ambas lecturas, el mensaje se publica con
   hwnd 0.
4. La exclusión de la carpeta propia y del tablero en el vigía compara cadenas ([§10.6](#106-recepción-de-una-notificación-hw_told)): si `JANAX_ARCHIVOS` o
   `JANAX_TABLERO` son rutas relativas (el valor por defecto `janax_archivos` lo es, `so/janaxos.asm:284`), no
   coinciden con las rutas absolutas notificadas y la exclusión no actúa sobre ellas, salvo que la raíz de
   `JANAX_VIGIA` se haya escrito con el mismo prefijo relativo.
5. Un desborde del búfer de una carpeta del anfitrión (0 bytes devueltos) pierde los cambios de ese intervalo sin
   aviso (`so/ambientes.inc:1773-1774`).
6. `P_HOSTW` nunca vuelve a 0 ([§2.3](#23-campos-de-cabina-usados)).
7. El comentario de `gate_assoc` no coincide con el código ([§11.6](#116-protocolo-de-asociación-pedido-27)).
8. Ni `RegisterClassExW` ni `SetClipboardData` comprueban su resultado; si `GlobalLock` falla en `screen_clip`, el
   bloque `GlobalAlloc` no se libera (`so/pantalla.inc:941-948`).
9. `screen_sound` nunca cierra el dispositivo MIDI ([§9](#9-sonido-pedido-44)).
10. Un fallo de `VirtualAlloc` en `screen_show` deja la pantalla sin píxeles (`scr_pix` = 0) con las dimensiones
    anteriores ([§4.2](#42-validación)).
11. En `screen_clip`, `EmptyClipboard` se ejecuta antes de `GlobalAlloc`: si la reserva falla, el portapapeles del
    anfitrión queda vacío (`so/pantalla.inc:938-943`).
12. En `screen_paste_take`, el pegado anterior se libera antes de reservar el nuevo: si `VirtualAlloc` falla, no
    queda ningún texto pendiente (`so/pantalla.inc:765-782`).
13. El núcleo no comprueba el resultado de `CreateEventA` ni de `CreateThread` al abrir la ventana ([§4.5](#45-secuencia-de-screen_show)).

## 14. Resumen de constantes y límites

| Constante | Valor | Fuente |
|---|---|---|
| Lado máximo de nube | 4096 celdas | `so/pantalla.inc:14` |
| Versión de nube aceptada | 3 | `so/pantalla.inc:151` |
| Bytes por hueso | 42 | `so/pantalla.inc:153-154` |
| Letras de título | 512 | `so/pantalla.inc:22` |
| Casillas del anillo de eventos | 256 × 32 bytes | `so/pantalla.inc:50`, `66` |
| Tipos de evento | 1..8 | `so/pantalla.inc:496-505` |
| Mensajes privados de ventana | 8001h título, 8002h copiar | `so/pantalla.inc:407`, `415` |
| Espera infinita en 41 | `b` ≥ FFFFFFFFh | `so/janaxos.asm:2895-2899` |
| Carpetas de `JANAX_VIGIA` | 61 | `so/janaxos.asm:308` |
| Quietud | 67803 ms | `so/janaxos.asm:314` |
| Búfer por carpeta del anfitrión | 65536 bytes | `so/janaxos.asm:313` |
| Búfer de carpeta propia y tablero | 4096 bytes | `so/janaxos.asm:294` |
| Campanas en una espera del centinela | ≤ 64 | `so/janaxos.asm:308-309`, `298` |
| `VENN_KNOWN` | 0FFFF03FFh | `so/venn.inc:29` |
| Criterios de cartel | 0..3 (`CARTEL_CRITS` = 0Fh) | `so/ambientes.inc:1398` |
| Pedidos del catálogo del escalón 0 | 1 (`escribir`) | `escalon0/ventanita_datos.inc:3-6` |
| `HOST_SIN_CAP` | 256 bytes | `escalon0/ventanita_datos.inc:13` |
