# 03. Núcleo JanaxOS: arranque, memoria, procesos, firmas y planificación

**Alcance.** Este capítulo especifica el núcleo de Janax OS en modo simbiosis (ejecutable [`janaxos.exe`](02-ensamblador-pdp-y-construccion.md#202-núcleo-janaxosexe) sobre
Windows x86-64): el lanzador `arrancar.exe`, la secuencia de arranque, las variables de entorno `JANAX_*`, la
gramática de la línea de comandos, la carga de un programa ([`.bin`](01-idioma-janax.md#91-bin-programa)) y de sus datos iniciales ([`.datos`](04-nucleo-abi-de-pedidos.md#104-datos-iniciales-datos)), la
medición del costo de cambio, el bloque de proceso (cabina), el modelo de memoria de un proceso (salas, cajas,
vistas, cartel, pila de retorno), el árbol de porteros en lo que hace a la creación de procesos, la familia de
procesos (lanzar, estado, terminar, nombrar, rehacerse), las firmas y su herencia (pedidos 17, 18 y 45), los
presupuestos (34 y 35), la prioridad (20) y los huecos (42), el programa planificador y los remeros (hilos que
ejecutan las cabinas, la fila y la espera sin gasto), y los invariantes de seguridad. Del mecanismo de pedidos
([`jsys`](04-nucleo-abi-de-pedidos.md#3-convención-de-llamada-de-jsys)) se especifica sólo lo necesario para estos temas: el formato de la cola, el algoritmo de un toque y las
tablas de puerta, derecho e importancia por clase. No se especifican aquí la semántica de las instrucciones
([capítulo 01](01-idioma-janax.md#5-instrucciones)), la codificación ni la construcción de binarios ([capítulo 02](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas)), el contrato completo de cada pedido
de archivos, cajas entre cabinas, saludos y palabras ([capítulo 04](04-nucleo-abi-de-pedidos.md#9-especificación-de-cada-pedido)), la pantalla, el teclado, el centinela y el
vigía del anfitrión ([capítulo 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn)). El resto de la especificación sigue en: [01 idioma](01-idioma-janax.md#01-el-idioma-janax-máquina-virtual-codificación-e-instrucciones), [02 PDP y construcción](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas),
03 núcleo y procesos (este), [04 ABI de pedidos](04-nucleo-abi-de-pedidos.md#04-núcleo-janaxos-abi-de-pedidos-llamadas-al-sistema), [05 pantalla, teclado y vigía](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn), [06 lectura de Razar](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía), [07 cardumen](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez),
[08 cuerpo y casa de Luma](08-luma-cuerpo-procesos-y-casa.md#08-luma-cuerpo-generadores-procesos-y-formato-de-su-casa), [09 conversación](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta), [10 pantalla y vida de Luma](10-luma-pantalla-lluvia-y-organos-vivos.md#10-luma-pantalla-lluvia-hexadecimal-panel-criaturas-y-órganos-vivos), [11 instalador y publicación](11-instalador-lanzador-y-publicacion.md#11-instalador-lanzador-y-publicación).

Todas las rutas son relativas a la raíz del repositorio. Cada afirmación cita el código del que sale como
`ruta:línea`. Lo que no se pudo comprobar en el código está marcado "(no verificado)". Lo que es una deducción del
flujo del código y no una regla escrita en él está marcado "(derivado)".

---

## 1. Convenciones y términos

| Término | Definición |
|---|---|
| Anfitrión | El sistema operativo sobre el que corre el núcleo en modo simbiosis (Windows x86-64). |
| Cabina (proceso) | Un programa Janax en ejecución con su bloque de proceso de `PROC_SIZE` = 688 bytes (`so/janaxos.asm:115`). En el código, *cabin*. |
| Palabra | Instrucción Janax de 32 bits. Un programa es una secuencia de palabras; su largo es `bytes / 4` (los bytes sobrantes se ignoran, `so/janaxos.asm:1062-1064`). |
| `j0`…`j15` | Los 16 registros de 64 bits de una cabina, guardados en `P_REGS` (`so/janaxos.asm:45`). |
| Sala (*room*) | Región de memoria de datos de una cabina, direccionada por su número. La sala 0 es la primera (`so/ambientes.inc:4-6`). |
| Caja (*box*) | El objeto de memoria del anfitrión que respalda una sala: una sección sin archivo (`CreateFileMappingA` sobre `INVALID_HANDLE_VALUE`, `so/ambientes.inc:102-119`). |
| Vista | La proyección de una caja en el espacio de direcciones del núcleo, propia de cada cabina que la tiene (`so/ambientes.inc:125-210`). |
| Cajón (*drawer*) | La reserva de direcciones propia de cada vista: las páginas de la sala más una página de pared sin acceso (`so/ambientes.inc:137-145`). |
| Cajón muerto | Una página reservada sin acceso al arrancar, a la que apunta toda sala destruida o no construida (`so/janaxos.asm:181`, `so/janaxos.asm:720-725`). |
| Cartel | Tabla de salas de una cabina (`P_ROOMS`), entradas de 32 bytes (`so/ambientes.inc:27-36`). |
| Clave (*key*) | El handle del anfitrión de una caja que tiene una cabina (`RE_KEY`). |
| Ventanilla | La rutina `ventanilla` que atiende la instrucción [`jsys`](01-idioma-janax.md#58-jsys-janax-os) (`so/janaxos.asm:2224`). |
| Toque | Una ejecución de `jsys`: la cola completa se atiende como una ronda (`so/janaxos.asm:2210-2220`). |
| Pedido / clase | Una entrada de la cola; su clase (*kind*) es un número de 1 a `KINDS` = 47 (`so/janaxos.asm:161`). |
| Portero | Nodo del árbol de permisos (`so/janaxos.asm:117-130`, `so/janaxos.asm:3710-3714`). |
| Puerta | 1 pantalla, 2 memoria, 3 archivos (`so/janaxos.asm:123`, `so/janaxos.asm:3935`). |
| Etiqueta | Nombre de archivo Janax: UTF-8 válido, guardado en el anfitrión como su forma normal C en hexadecimal (`so/janaxos.asm:3016-3019`, `so/janaxos.asm:3155-3222`). |
| Carpeta del sistema | Carpeta del anfitrión con los archivos de Janax (`JANAX_ARCHIVOS`, [§3.4](#34-variables-de-entorno)). |
| Bolita | Prioridad de una cabina en 65536avos: la fracción de su tiempo dedicada a trabajo real (`so/janaxos.asm:81`). |
| Turno (*quantum*) | Instrucciones que una cabina ejecuta cada vez que un remero la toma (`P_QUANTUM`, `so/janaxos.asm:82`). |
| Remero | Hilo del anfitrión que ejecuta cabinas (`so/remos.inc:1-19`). |
| Fila | Lista doblemente enlazada de cabinas listas, en orden de llegada (`so/remos.inc:330-403`). |
| Cerrojo del núcleo | La sección crítica `kern_lock` que serializa lo compartido (`so/janaxos.asm:399`, `so/remos.inc:27-47`). |
| Servicio | Instrucciones ejecutadas por una cabina desde que nació (`P_SERVED`, `so/janaxos.asm:52`). |
| Reloj | Instrucciones ejecutadas por todo el sistema (`clock`, `so/janaxos.asm:149`). No hay reloj de tiempo en la planificación. |
| Ayudante | Cabina interna del núcleo que ejecuta un programa Janax del núcleo (el planificador); no puede usar la ventanilla (`so/ayudantes.inc:1-3`, `so/janaxos.asm:2226-2227`). |

Notación: `NNNNh` es hexadecimal; los demás números son decimales. "Responde x" significa que el núcleo escribe
x en el campo de respuesta de la entrada de la cola ([§7.1](#71-formato-de-la-cola)).

---

## 2. Componentes y fuentes

| Archivo | Contenido |
|---|---|
| `so/arrancar.asm` | Lanzador gráfico `arrancar.exe`: fija `JANAX_ARCHIVOS` y arranca `janaxos.exe` con `bin/luma.bin`. |
| `so/janaxos.asm` | Núcleo: datos globales, arranque, línea de comandos, procesos, calibración, intérprete, ventanilla, archivos, porteros, familia, firmas, salida. |
| `so/remos.inc` | Remeros, cerrojo, fila, tabla de última parte. |
| `so/ayudantes.inc` | Carga del programa planificador y cálculo del turno de cada cabina. |
| `so/nucleo/planificador.jsm` | Programa planificador (fuente Janax); llama a `cuanto`. |
| `so/nucleo/planificador.inc` | Rutinas Janax `turno`, `turno_ok`, `raiz`, `cuanto`. |
| `so/pdp/semilla/planificador.bin` | Planificador de fábrica, incrustado en el núcleo con `file` (`so/janaxos.asm:444`). |
| `so/datos.inc` | Nombre y lectura del archivo de datos iniciales. |
| `so/rutinas.inc` | Motor de rutinas: decodificación de un programa en tabla y ejecución por tabla. |
| `so/nativo.inc` | Motor traducido (código nativo); sólo se especifica su contrato ([§5.3](#53-motores-de-ejecución)). |
| `so/ambientes.inc` | Salas, cajas, cartel, pila de retorno, dote, saludos, centinela, liberación. |
| `so/anfitrion.inc` | Ventana al anfitrión ([`jhost`](04-nucleo-abi-de-pedidos.md#11-la-ventana-al-anfitrión-jhost)) con catálogo vacío. |
| `so/pantalla.inc`, `so/vigia.inc` | Pantalla y vigía ([capítulo 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn)); aquí sólo sus variables de entorno. |

El núcleo se ensambla con FASM como `format PE64 console` (`so/janaxos.asm:30`). Las importaciones del anfitrión
están en `so/janaxos.asm:574-677`.

---

## 3. Arranque

### 3.1 Lanzador `arrancar.exe`

Ejecutable `format PE64 GUI 5.0` (`so/arrancar.asm:5`). Pasos, en orden (`so/arrancar.asm:10-52`):

1. Obtiene su propia ruta con `GetModuleFileNameW(0, dir, 1024)`.
2. Corta `dir` justo después de la última `\` (la carpeta, terminada en separador).
3. Reemplaza toda `\` (5Ch) de `dir` por `/`.
4. `exe` = `dir` + `janaxos.exe`; `casa` = `dir` + `casa`.
5. `SetEnvironmentVariableW("JANAX_ARCHIVOS", casa)`: el proceso hijo hereda esta variable.
6. Línea de comandos: `"` + `exe` + `" ` + `dir` + `bin/luma.bin`. El cuerpo va sin comillas
   (`so/arrancar.asm:44`). Como el núcleo corta argumentos en cada espacio ([§3.5](#35-línea-de-comandos)), una carpeta con espacios produce
   argumentos partidos (derivado; no verificado en ejecución).
7. `STARTUPINFOW` de 104 bytes con `dwFlags` (+60) = 1 (`STARTF_USESHOWWINDOW`) y `wShowWindow` (+64) = 0
   (`SW_HIDE`).
8. `CreateProcessW(exe, cmd, 0, 0, FALSE, 10h, 0, dir, &si, &pi)`: `10h` = `CREATE_NEW_CONSOLE` (consola propia
   oculta), entorno heredado, carpeta actual = `dir`.
9. Si falla, `MessageBoxW` con el texto `No encontre janaxos.exe al lado de este programa.` y tipo `10h`.
10. `ExitProcess(0)` en ambos casos; no espera al núcleo.

Capacidades de los búferes: `dir` 1024 unidades UTF-16, `exe` y `casa` 1100, `cmd` 2400 (`so/arrancar.asm:66-69`);
no hay verificación de desborde en las concatenaciones `lstrcatW` (derivado).

### 3.2 Detección de modo

Al entrar en `start` el núcleo guarda `rcx` y lo compara con `gs:[60h]` (el PEB en Windows)
(`so/janaxos.asm:683-690`):

| Condición | Modo | Comportamiento |
|---|---|---|
| `rcx = gs:[60h]` | simbiosis | Continúa el arranque ([§3.3](#33-secuencia-de-arranque-en-simbiosis)). |
| distinto | cero (firmware) | `zero_mode`: bucle infinito de `hlt` (`so/janaxos.asm:5279-5284`). No está construido. |

### 3.3 Secuencia de arranque en simbiosis

Orden exacto (`so/janaxos.asm:692-1189`):

| Paso | Acción | Fuente |
|---|---|---|
| 1 | `hout` = salida estándar; escribe `modo: simbiosis\r\n`. | `so/janaxos.asm:692-694` |
| 2 | Carpeta del sistema: `JANAX_ARCHIVOS` o `janax_archivos`. | `so/janaxos.asm:697-708` |
| 3 | Tablero: `JANAX_TABLERO`. | `so/janaxos.asm:709-710` |
| 4 | Dos eventos de anfitrión (centinela de la carpeta propia y del tablero); `hw_start` lee `JANAX_VIGIA`. | `so/janaxos.asm:711-715`, `so/vigia.inc:16-80` |
| 5 | `CreateDirectoryA(carpeta del sistema)`; si ya existe no es error. | `so/janaxos.asm:716` |
| 6 | `GetSystemInfo`: `page_size` = `dwPageSize` (+4). | `so/janaxos.asm:717-719` |
| 7 | Cajón muerto: `VirtualAlloc(0, page_size, MEM_RESERVE, PAGE_NOACCESS)`; si falla, sale con 3. | `so/janaxos.asm:720-725` |
| 8 | `AddVectoredExceptionHandler(1, native_fault)` (pared de las salas para el motor traducido). | `so/janaxos.asm:726` |
| 9 | `InitializeCriticalSection(kern_lock)`. | `so/janaxos.asm:727` |
| 10 | `remos` = `dwNumberOfProcessors` (+32); `JANAX_SALAS`; `JANAX_REMOS`. | `so/janaxos.asm:728-753` |
| 11 | Motor: `JANAX_MOTOR`. | `so/janaxos.asm:755-793` |
| 12 | `plan_load`: planificador de la carpeta del sistema o de fábrica ([§12.2](#122-programa-planificador)). | `so/janaxos.asm:794` |
| 13 | Costo de cambio: fijado, recordado o medido ([§4](#4-costo-de-cambio-c-y-calibración)). | `so/janaxos.asm:796-831` |
| 14 | `plan_c16` y `tail_limit` ([§4.4](#44-valores-derivados)). | `so/janaxos.asm:832-838` |
| 15 | Árbol de porteros: nodos 0 a 3 ([§8.2](#82-árbol-inicial)). | `so/janaxos.asm:840-856` |
| 16 | Copia privada de la línea de comandos (`GetCommandLineA`); corte y conteo de argumentos; una cabina por argumento ([§3.5](#35-línea-de-comandos), [§3.6](#36-carga-de-un-programa-y-de-sus-datos)). | `so/janaxos.asm:858-1101` |
| 17 | `row`: arranca los remeros y vuelve cuando todas las cabinas terminaron ([§13](#13-remeros)). | `so/janaxos.asm:1104`, `so/remos.inc:430-472` |
| 18 | Líneas finales de informe ([§3.7](#37-salida-estándar-del-núcleo-y-códigos-de-salida)). | `so/janaxos.asm:1105-1180` |
| 19 | `screen_end`: si se abrió una ventana, espera a que el usuario la cierre. | `so/janaxos.asm:1182`, `so/pantalla.inc:302-309` |
| 20 | `ExitProcess(0)`. | `so/janaxos.asm:1189` |

Si un argumento no se puede abrir o leer (paso 16), el núcleo sale con 3 **antes** de remar: ninguna cabina ya
creada se ejecuta (`so/janaxos.asm:1050-1060`, `so/janaxos.asm:5289-5290`).

### 3.4 Variables de entorno

Se leen con `GetEnvironmentVariableA` salvo `JANAX_VIGIA` (`GetEnvironmentVariableW`). "Presente" significa que
la llamada devuelve distinto de 0; una variable definida con valor vacío devuelve 0 en Windows y cuenta como
ausente (comportamiento del anfitrión, no verificado).

| Variable | Cuándo se lee | Formato | Efecto | Fuente |
|---|---|---|---|---|
| `JANAX_ARCHIVOS` | Arranque, paso 2 | Ruta ANSI, hasta 258 caracteres (búfer de `HOST_PATH − 1` = 259 bytes, incluido el 0 final) | [Carpeta del sistema](04-nucleo-abi-de-pedidos.md#101-carpetas). Ausente: `janax_archivos` (relativa a la carpeta actual). Se crea si no existe. Allí viven las etiquetas, `calibracion` y el planificador. Si el valor tiene 259 caracteres o más, la llamada devuelve el tamaño requerido y el código lo toma como largo (no verificado su efecto). | `so/janaxos.asm:283-287`, `so/janaxos.asm:697-708` |
| `JANAX_TABLERO` | Arranque, paso 3 | Ruta ANSI, hasta 258 caracteres (mismo búfer) | Carpeta compartida entre varios Janax del mismo anfitrión: toda etiqueta normalizada que empieza con los 8 bytes `tablero/` se guarda allí y no en la carpeta del sistema. Ausente: no hay tablero. | `so/janaxos.asm:288-293`, `so/janaxos.asm:709-710`, `so/janaxos.asm:3178-3193` |
| `JANAX_VIGIA` | Arranque, paso 4 | Rutas UTF-16 separadas por `;`, hasta 32766 unidades (búfer `HW_RAW − 1` = 32767) | Carpetas del anfitrión que vigila el centinela ([pedido 39](05-nucleo-pantalla-teclado-vigia.md#108-entrega-pedido-39), [capítulo 05](05-nucleo-pantalla-teclado-vigia.md#10-vigía-y-centinela)). Segmentos vacíos se ignoran; como máximo `HW_MAX` = 61 carpetas; las demás se ignoran. Si el valor ocupa 32767 unidades o más, no se vigila nada. | `so/janaxos.asm:306-315`, `so/vigia.inc:16-101` |
| `JANAX_SALAS` | Arranque, paso 10 | Cualquier valor | Activa el instrumento de salas: al terminar cada cabina, informe de memoria pedida y usada ([§6.10](#610-instrumento-de-salas-janax_salas)). | `so/janaxos.asm:426-427`, `so/janaxos.asm:730-733` |
| `JANAX_REMOS` | Arranque, paso 10 | Dígitos decimales; el primer no dígito termina el número | Cantidad de remeros. 0 (o sin dígitos) vale 1. Ausente: cantidad de procesadores lógicos. | `so/janaxos.asm:734-753` |
| `JANAX_MOTOR` | Arranque, paso 11 | `interprete`, `rutinas` o `traductor` (exacto) | Motor de ejecución: 0, 1 o 2 respectivamente. Ausente: 2. Un nombre desconocido o de 31 caracteres o más: el núcleo sale con 4. | `so/janaxos.asm:555-558`, `so/janaxos.asm:567-568`, `so/janaxos.asm:756-793` |
| `JANAX_CAMBIO` | Arranque, paso 13 | Dígitos decimales enteros | Fija el costo de cambio `c` en instrucciones (sin medir ni recordar); informa `(fijado)`. `8.5` vale 8; sin dígitos vale 0. | `so/janaxos.asm:469`, `so/janaxos.asm:797-817` |
| `JANAX_CALIBRACION` | Al medir ([§4.3](#43-procedimiento-de-medición)) | Cualquier valor | Escribe los `c` de los nueve pares, ordenados. Sólo tiene efecto si hay medición (sin `JANAX_CAMBIO` y sin registro recordado válido). | `so/janaxos.asm:470-471`, `so/janaxos.asm:1541-1563` |
| [`JANAX_SIN_VENTANA`](05-nucleo-pantalla-teclado-vigia.md#510-modo-sin-ventana) | Primer [pedido 40](05-nucleo-pantalla-teclado-vigia.md#4-modelo-de-imagen-pedido-40-mostrar) (mostrar) | Cualquier valor | Nunca se abre una ventana; los pedidos de pantalla responden igual. | `so/pantalla.inc:7`, `so/pantalla.inc:203-210` |
| [`JANAX_VENTANA_FONDO`](05-nucleo-pantalla-teclado-vigia.md#54-mostrar-y-modo-fondo) | Cada pedido 40 que llega a ese punto | Cualquier valor | La ventana nace detrás de todas (`SetWindowPos` con `HWND_BOTTOM` y banderas `53h`) y no toma el teclado. | `so/pantalla.inc:8-10`, `so/pantalla.inc:211-215`, `so/pantalla.inc:374-376` |

Variable de construcción (no de entorno): `PERFIL` (FASM `-d PERFIL=1`) cuenta cuántas veces el intérprete ejecutó
cada palabra del primer programa no ayudante y escribe `perfil.bin` (un qword por palabra, 8 MiB) al final
(`so/janaxos.asm:559-566`, `so/janaxos.asm:1825-1838`, `so/janaxos.asm:1183-1188`).

### 3.5 Línea de comandos

**Obtención.** `GetCommandLineA`; el texto se copia a un bloque propio de `lstrlenA + 1` bytes
(`so/janaxos.asm:859-878`). Se descarta el nombre del programa: si empieza con `"`, hasta la siguiente `"`; si no,
hasta el primer espacio. Si el texto termina antes, el núcleo sale con 4 (`so/janaxos.asm:880-904`).

**Corte.** Los argumentos se separan sólo por el carácter espacio (20h); cada espacio se reemplaza por 0. No hay
comillas para los argumentos ni otros separadores (`so/janaxos.asm:906-932`). Sin argumentos: sale con 4
(`so/janaxos.asm:934-935`).

**Gramática de un argumento** (`so/janaxos.asm:949-1048`):

```
argumento  = ruta [ "!" bolita ] [ "@" permisos ]
permisos   = { letra | "!" bolita } [ ":" prefijo ]
letra      = "p" | "m" | "l" | "g" | cualquier otro carácter (se ignora)
bolita     = ( "0" | "1" ) [ "." { dígito } ]  |  "." { dígito }
prefijo    = { hex hex }            (al menos un par; hex = 0-9 a-f A-F)
```

| Elemento | Semántica | Fuente |
|---|---|---|
| `ruta` | Ruta del anfitrión del programa, tal cual (relativa a la carpeta actual o absoluta). | `so/janaxos.asm:1050` |
| Sin `@` | Permisos `R_ALL` = 15 (todas las puertas). | `so/janaxos.asm:951` |
| `@` | Permisos = 0 más los de cada letra: `p` → `R_SCREEN` (1), `m` → `R_MEM` (2), `l` → `R_READ` (4), `g` → `R_WRITE` (8). | `so/janaxos.asm:974-1003`, `so/janaxos.asm:118-122` |
| `!bolita` | Bolita de la cabina, también su tope `P_PRIO_TOP`. Sin `!`: `PRIO_DEFAULT` = 64881 (0,99 · 65536 redondeado). Después de `!` en la ruta sólo puede seguir el final o `@`; otra cosa: sale con 4. | `so/janaxos.asm:953-968`, `so/janaxos.asm:464` |
| `:prefijo` | Bytes en hexadecimal (2 dígitos por byte, como máximo 259 bytes), normalizados a forma C. El portero de archivos de la cabina lleva ese prefijo de etiqueta ([§8](#8-porteros)). Cantidad impar de dígitos, dígito inválido, vacío o no UTF-8: sale con 4. | `so/janaxos.asm:1009-1048` |

**Conversión de la bolita** (`read_bolita`, `so/janaxos.asm:1191-1238`): con `d` = los dígitos (parte entera y
decimales) como un entero y `n` la cantidad de decimales (como máximo 9),
`bolita = (d · 65536 + 10^n / 2) / 10^n` (división entera, redondeo al más cercano). Error (sale con 4) si la parte
entera no es 0 ni 1, si hay más de 9 decimales, o si el resultado supera 65536 (10000h). Ejemplos derivados:
`0.5` → 32768; `1` → 65536; `.25` → 16384.

### 3.6 Carga de un programa y de sus datos

**Programa** (`so/janaxos.asm:1050-1074`, `so/janaxos.asm:1355-1432`):

1. `CreateFileA(ruta, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, ...)`; si falla, sale con 3.
2. Se lee en el búfer de carga único `load_buf` de `MAX_PROGRAM` = 1 MiB (`so/janaxos.asm:35`), creado la primera
   vez. Un archivo mayor queda truncado a 1 MiB (derivado de `ReadFile` con ese tope).
3. `mp_words` = bytes leídos / 4.
4. `make_process` con padre 0 (el núcleo), los permisos, la bolita y el prefijo del argumento ([§5.1](#51-creación-make_process)).

**Programa compartido** (`share_program`, `so/janaxos.asm:1371-1432`): si una cabina anterior (terminada o no)
tiene exactamente las mismas palabras (mismo largo y `repe cmpsd`), la nueva comparte su `P_PROG`, `P_NWORDS`,
`P_TABLE` y `P_TAIL`. Si no, se copia el programa a un bloque de exactamente su tamaño (4 bytes si está vacío), se
calcula su tabla de última parte ([§13.5](#135-corte-del-turno-y-última-parte)) y, con motor 1 o 2, su tabla de rutinas (`prepare_program`). Con motor 2,
`nat_native` y `nat_total` suman las palabras traducidas y las totales.

**Nombre del archivo de datos** (`data_name`, `so/datos.inc:8-42`): la última extensión del nombre se reemplaza por
`.datos`; si no tiene, se agrega. Un punto que aparece antes de un separador `/` o `\` no es extensión.

| Nombre | Datos |
|---|---|
| `X.bin` | `X.datos` |
| `PDP/ensamblador/ensamblador.bin` | `PDP/ensamblador/ensamblador.datos` |
| `hijo` | `hijo.datos` |
| `a.b/c` | `a.b/c.datos` |

Si el nombre más `.datos` y el 0 final no caben en la capacidad (`HOST_PATH` = 260 para rutas del anfitrión,
`DATA_LABEL` = 512 para etiquetas), no hay datos (`so/datos.inc:30-32`, `so/janaxos.asm:285`,
`so/janaxos.asm:371`).

**Lectura de los datos** (`read_data`, `so/datos.inc:44-85`): se abre la ruta del anfitrión; se lee en `load_buf`
(tope 1 MiB) y se copia a un bloque de exactamente esos bytes, que queda en `P_INIT`/`P_INITLEN`. Sin archivo o
vacío: sin datos. Para los argumentos de la línea de comandos, la ruta es la del anfitrión junto al programa
(`so/janaxos.asm:1078-1094`). Para un hijo lanzado ([pedido 16](#92-lanzar-16)) o una cabina rehecha ([pedido 36](#98-rehacerse-36)), la ruta es la
etiqueta de datos convertida con `label_path_ptr`, y debe pasar el prefijo del portero de archivos de quien la
pide (`family_data`, `so/datos.inc:87-118`). Los datos se copian al principio de la sala 0 en la primera orden
([§6.3](#63-primera-orden-la-sala-0)).

### 3.7 Salida estándar del núcleo y códigos de salida

Líneas que escribe el núcleo (todas terminan en `\r\n`):

| Línea | Cuándo | Fuente |
|---|---|---|
| `modo: simbiosis` | Arranque. | `so/janaxos.asm:156`, `so/janaxos.asm:694` |
| `planificador: el de PDP` | Se cargó el planificador de la carpeta del sistema. | `so/janaxos.asm:448`, `so/ayudantes.inc:49` |
| `planificador: el de PDP fallo, vuelve el de fabrica` | El planificador cargado falló ([§12.2](#122-programa-planificador)). | `so/janaxos.asm:450`, `so/ayudantes.inc:137` |
| `calibracion (c de cada par, ordenados): x.xx ...` | Medición con `JANAX_CALIBRACION`. | `so/janaxos.asm:1541-1563` |
| `costo de cambio: <c> instrucciones (fijado\|recordado\|medido)` | Arranque; `c` con dos decimales. | `so/janaxos.asm:476-488`, `so/janaxos.asm:1767-1804` |
| `P<n> codigo=<código> j0=<16 hex mayúsculas> t=<reloj>` | Cada cabina que termina (no en calibración). | `so/janaxos.asm:5214-5252` |
| `salas P<n>: pedidas <K> KB, usadas <K> KB, salas <m>` y hasta 10 líneas `  sala <e>: <K> KB, usada <K> KB` | Cada cabina que termina, con `JANAX_SALAS`. | `so/janaxos.asm:4964-5051` |
| `remeros: <N>, despertares en vano=<V>` | Al final, si `remos` ≠ 1. | `so/janaxos.asm:1105-1120` |
| `nativo: <N> de <M> instrucciones` | Al final, con motor 2. | `so/janaxos.asm:1122-1139` |
| `ventanilla: pantallas=.. resintonias=.. llamadas al anfitrion=.. pedidos=..` | Al final, si hubo pedidos. | `so/janaxos.asm:1141-1164` |
| `porteros: nodos=<N> negados=<M>` | Al final, si hubo pedidos y algún negado. | `so/janaxos.asm:1165-1180` |

Códigos de salida del proceso `janaxos.exe`:

| Código | Significado | Fuente |
|---|---|---|
| 0 | Terminación normal. | `so/janaxos.asm:1189` |
| 3 | `fail_file`: un programa de la línea de comandos no se puede abrir o leer, o una reserva de memoria del anfitrión esencial falla (tabla de procesos, nodos, registros de firma, pila de un remero, etc.). | `so/janaxos.asm:5289-5290` |
| 4 | `no_programs` / `fail_args`: sin argumentos, nombre de programa sin cerrar, bolita o prefijo inválidos, `JANAX_MOTOR` desconocido. | `so/janaxos.asm:5286-5288` |

---

## 4. Costo de cambio `c` y calibración

### 4.1 Origen de `c`

`swcost` es un `double` en instrucciones (`so/janaxos.asm:396`). Se obtiene, por prioridad
(`so/janaxos.asm:796-831`):

1. `JANAX_CAMBIO` presente: valor entero; informa `(fijado)`.
2. Registro `calibracion` válido para esta clave ([§4.2](#42-archivo-calibracion)): informa `(recordado)`.
3. Medición ([§4.3](#43-procedimiento-de-medición)), que luego se guarda: informa `(medido)`.

### 4.2 Archivo `calibracion`

Ruta: carpeta del sistema + `\calibracion` (no es una etiqueta: no está en hexadecimal) (`so/janaxos.asm:482`,
`so/janaxos.asm:1640-1649`). Formato de 60 bytes (`COST_REC_LEN`, `so/janaxos.asm:483-484`):

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 4 | Huella FNV-1a de 32 bits: base `811C9DC5h`, primo `01000193h`, sobre los bytes del código del núcleo de `code_begin` a `code_end`, luego el byte `motor`, luego los bytes del programa planificador en uso. |
| 4 | 48 | Nombre del procesador (CPUID `80000002h`–`80000004h`); ceros si `80000000h` informa menos de `80000004h`. |
| 52 | 8 | `swcost` (`double`). |

Fuente: `so/janaxos.asm:1583-1638`. Recordar exige leer exactamente 60 bytes y que los primeros 52 coincidan con la
clave calculada (`so/janaxos.asm:1652-1677`). Guardar usa `CREATE_ALWAYS`; un fallo al guardar sólo implica medir
de nuevo en el próximo arranque (`so/janaxos.asm:1679-1693`).

### 4.3 Procedimiento de medición

Programa de calibración de 5 palabras (`so/janaxos.asm:490-503`): `jldi j2, 1`; `jjmp` a la condición; cuerpo
`jsub j1, j1, j2`; condición `jjnz j1, cuerpo`; [`jhalt`](01-idioma-janax.md#103-salida-de-jhalt). Cada vuelta son 2 instrucciones; el núcleo pone `j1` =
cantidad de vueltas. Dos cabinas estáticas `calib_procs` (`so/janaxos.asm:504-505`).

| Constante | Valor | Carácter | Fuente |
|---|---|---|---|
| `CALIB_LOOPS` | 200000h = 2097152 vueltas | Criterio (~4 M instrucciones) | `so/janaxos.asm:491` |
| `CALIB_PROBE` | `CALIB_LOOPS / 64` = 32768 | Corrida corta del par | `so/janaxos.asm:492` |
| `CALIB_TWO_SCALE` | 10 | Criterio con medición citada en el comentario | `so/janaxos.asm:493-495` |
| `CALIB_PAIRS` | 9 | Criterio (impar para la mediana) | `so/janaxos.asm:515` |

Pasos (`calibrate`, `so/janaxos.asm:1447-1581`):

1. Sustituye temporalmente la tabla de procesos por las cabinas de calibración; `quiet` = 1 (sin informes);
   `swcost` = 0.
2. Fija el hilo al procesador 0 (`SetThreadAffinityMask(.., 1)`) y prioridad `THREAD_PRIORITY_TIME_CRITICAL` = 15.
3. Corrida de calentamiento sola (no cuenta); corrida sola: `cycles_one`.
4. Par con `CALIB_PROBE` vueltas: `p` ciclos. Vueltas del par = `cycles_one · 10 · 32768 / p`, acotado a
   [`CALIB_PROBE`, `CALIB_LOOPS`].
5. Nueve veces: sola (ciclos `A1`, instrucciones `I1`), par (ciclos `C2`, instrucciones `I2`, cambios `S2`), sola
   (`A3`). `a = ((A1 + A3) / 2) / I1` ciclos por instrucción; `c_par = ((C2 − I2 · a) / S2) / a`.
6. Ordena los nueve por inserción; con `JANAX_CALIBRACION` los escribe.
7. `swcost = max(mediana, 0)` (índice 4).
8. Restaura prioridad y afinidad, la tabla de procesos, `quiet`, `clock` = 0 y `switches` = 0.

Cada corrida (`calib_run`, `so/janaxos.asm:1705-1717`) mide `rdtsc` alrededor de `run_all(ROW_LINE)` en el hilo
principal. Sola, la cabina tiene turno `FOREVER` = 7FFFFFFFFFFFFFFFh (ningún cambio); en par, turno 1 (un cambio
por instrucción) (`so/janaxos.asm:1746-1751`).

### 4.4 Valores derivados

| Variable | Definición | Fuente |
|---|---|---|
| `plan_c16` | `c · 16` redondeado con `cvtsd2si` (modo de redondeo actual del procesador; por omisión al par más cercano, no verificado). | `so/janaxos.asm:832-835` |
| `tail_limit` | `(plan_c16 + 15) >> 4`: un cambio en instrucciones enteras, redondeado hacia arriba. | `so/janaxos.asm:836-838` |

---

## 5. Procesos (cabinas)

### 5.1 Creación (`make_process`)

Entradas globales: `mp_prog`, `mp_words`, `mp_parent` (0 = el núcleo), `mp_rights`, `mp_prio`, `mp_pfx_ptr`,
`mp_pfx_len` (`so/janaxos.asm:139-146`). Pasos (`so/janaxos.asm:1269-1353`):

1. Bloque de `PROC_SIZE` bytes con `VirtualAlloc` (ceros). Fallo: núcleo sale con 3.
2. `share_program` ([§3.6](#36-carga-de-un-programa-y-de-sus-datos)).
3. `P_PARENT` = `mp_parent`; `P_DATA` = cajón muerto (sin memoria todavía).
4. Pila de retorno: reserva de `RET_DEPTH · 8` = 32768 bytes, sin comprometer ([§6.7](#67-pila-de-retorno)).
5. Un microportero por puerta 1..3 ([§8.3](#83-microporteros-de-una-cabina)).
6. Se agrega a la tabla `procs` (lista de punteros que se duplica cuando se llena; las cabinas nunca se mueven).
   `P_ID` = su índice. Los números de proceso no se reutilizan; las cabinas terminadas siguen en la tabla.
7. `P_PRIO` = `P_PRIO_TOP` = `mp_prio`; `plan_quantum` calcula `P_QUANTUM` ([§12.3](#123-turno-por-prioridad-cuanto)).
8. `rooms_born`: nace con la dote de su madre ([§6.8](#68-dote-al-nacer-y-liberación-al-terminar)).
9. `q_push_wake`: entra a la fila y despierta a un remero ([§13.3](#133-fila)).
10. Devuelve el bloque en `rax`.

Los registros, `P_PC`, `P_DEPTH` y los demás campos empiezan en 0.

### 5.2 Bloque de proceso

Todos los campos son qwords salvo `P_REGS`. Fuente: `so/janaxos.asm:44-115`.

| Desplazamiento | Nombre | Significado |
|---|---|---|
| 0 | `P_REGS` | 16 qwords: `j0`…`j15`. |
| 128 | `P_PC` | Índice de la próxima palabra. |
| 136 | `P_NWORDS` | Palabras del programa. |
| 144 | `P_PROG` | Palabras (compartidas entre copias). |
| 152 | `P_DATA` | Lugar de la sala 0 (cajón muerto si no hay). |
| 160 | `P_RET` | Base de la pila de retorno. |
| 168 | `P_DEPTH` | Profundidad de la pila de retorno. |
| 176 | `P_SERVED` | Servicio: instrucciones ejecutadas. |
| 184 | `P_DONE` | 1 = terminó. |
| 192 | `P_CODE` | Código de salida ([§5.5](#55-códigos-de-salida-de-una-cabina)). |
| 200 | `P_SIZE` | Suma de los tamaños de sus salas en pie. |
| 208 | `P_FILES` | Tabla de handles de archivo del anfitrión (0 = libre); se duplica. |
| 216 | `P_NFILES` | Ranuras de esa tabla. |
| 224 | `P_GATES` | 3 qwords: su portero de cada puerta (1 en +224, 2 en +232, 3 en +240). |
| 248 | `P_ID` | Número de proceso (−1 para el ayudante). |
| 256 | `P_PARENT` | Bloque del padre; 0 = el núcleo. |
| 264 | `P_WAITING` | Condiciones de espera pendientes de su último toque ([§13.6](#136-espera-sin-gasto)). |
| 272 | `P_SHADOW` | 1 = terminó y su sombra decide por su línea; 2 = sombra disuelta ([§10.5](#105-sombra)). |
| 280 | `P_TABLE` | Tabla de rutinas (motores 1 y 2), compartida entre copias. |
| 288 | `P_ROOMS` | Cartel (0 = sólo sala 0 sin construir). |
| 296 | `P_NROOMS` | Entradas en uso del cartel. |
| 304 | `P_ROOMCAP` | Capacidad del cartel en entradas. |
| 312 | `P_LIM8` | Límite rápido de la sala 0 para accesos de 8 bytes: tamaño − 7 (0 si no hay). |
| 320 | `P_LIM1` | Límite rápido para accesos de 1 byte: tamaño de la sala 0. |
| 328 | `P_RETCAP` | Entradas comprometidas de la pila de retorno. |
| 336 | `P_INIT` | Datos iniciales (bloque propio). |
| 344 | `P_INITLEN` | Sus bytes. |
| 352 | `P_HELPER` | 1 = ayudante del núcleo. |
| 360 | `P_BUDGET0` | Turno concedido en la corrida actual. |
| 368 | `P_SYSRD` | `jsys`: registro destino (`rd · 8` en los motores 1 y 2). |
| 376 | `P_SYSQ` | `jsys`: dirección de la cola. |
| 384 | `P_SAVERSP` | `rsp` guardado por `ret_grow`/`ret_trim`. |
| 392 | `P_RUNNING` | 1 = un remero la está ejecutando. |
| 400 | `P_TAIL` | Tabla de última parte ([§13.5](#135-corte-del-turno-y-última-parte)). |
| 408 | `P_CUT` | 1 = su turno fue cortado por un evento. |
| 416 | `P_NEXT` | Siguiente en la fila. |
| 424 | `P_PRIO` | Bolita actual (65536avos). |
| 432 | `P_QUANTUM` | Turno. |
| 440 | `P_QUEUED` | 1 = está en la fila. |
| 448 | `P_PRIO_TOP` | Bolita máxima que puede pedir. |
| 456 | `P_BLOCKS` | Registros de firma de otros que esperan su firma. |
| 464 | `P_PREV` | Anterior en la fila. |
| 472 | `P_ROOMBASE` | Número anterior a la primera sala del cartel: la entrada k (k ≥ 1) es la sala `P_ROOMBASE + k`. |
| 480 | `P_NEXTROOM` | Número de su próxima sala (0 se interpreta como 1). |
| 488 | `P_ROOM0` | 1 = su primera orden construyó la sala 0. |
| 496 | `P_DOWRY` | Lista de cajas de la dote para su próximo hijo (32 bytes cada una). |
| 504 | `P_NDOWRY` | Cuántas. |
| 512 | `P_ARRIVED` | Buzón de cajas recibidas (mudadas o enlazadas), en orden de llegada. |
| 520 | `P_NARRIVED` | Cuántas llegaron. |
| 528 | `P_TAKEN` | Cuántas recibió. |
| 536 | `P_PARTNER` | Cabina con la que se asocia para su próximo hijo (0 = ninguna). |
| 544 | `P_ASSOC` | [Palabra de Venn](05-nucleo-pantalla-teclado-vigia.md#112-palabra-venn) de esa asociación. |
| 552 | `P_GREET` | Lista de quienes la saludaron y no se tomaron (8 bytes cada uno). |
| 560 | `P_NGREET` | Cuántos. |
| 568 | `P_GWAIT` | 1 = espera un saludo; 2 = no queda nadie que pueda saludarla. |
| 576 | `P_SAID` | Buzón de palabras `{quién, palabra}` de 16 bytes. |
| 584 | `P_NSAID` | Cuántas. |
| 592 | `P_WATCH` | Prefijos vigilados `{bytes, prefijo}` de 16 bytes. |
| 600 | `P_WATCHN` | Cuántos. |
| 608 | `P_KILL` | 1 = su padre la terminó mientras remaba: termina al acabar su turno. |
| 616 | `P_LIMIT` | Servicio máximo absoluto ([pedido 34](#11-presupuesto-y-servicio)); 0 = sin presupuesto. |
| 624 | `P_REMAKE` | Programa con el que pidió rehacerse (copia propia); 0 = ninguno. |
| 632 | `P_REMAKEN` | Sus palabras. |
| 640 | `P_HOSTW` | 1 = pidió lo nuevo del anfitrión (39). |
| 648 | [`P_SCRW`](05-nucleo-pantalla-teclado-vigia.md#82-estados-de-p_scrw) | 41: 1 = duerme hasta un evento de pantalla o su plazo; 2 = despertada. |
| 656 | `P_SCRDL` | 41: plazo en ms de `GetTickCount64`; `FOREVER` = nunca. |
| 664 | `P_GAPS` | 1 = rema en los huecos (42). |
| 672 | `P_SIGNED` | Clases firmadas con que nació (bit k = clase k) (45). |
| 680 | `P_SIGNNEXT` | Clases firmadas para su próximo hijo (45). |

### 5.3 Motores de ejecución

`motor` (`so/janaxos.asm:555-558`): 0 intérprete (referencia), 1 rutinas, 2 traductor (por omisión). Contrato común
de `run_process(rbx = cabina, rax = presupuesto)` (`so/janaxos.asm:1806-1880`, `so/rutinas.inc:174-225`):

- Ejecuta hasta `rax` instrucciones; devuelve en `rax` las ejecutadas; pone `P_DONE`/`P_CODE` si terminó.
- Guarda `P_PC` y `P_DEPTH` y llama a `ret_trim` al salir.
- Si el presupuesto se agota sin corte (`P_CUT` = 0) y la palabra siguiente tiene última parte `u` con
  0 < `u` ≤ `tail_limit`, extiende el presupuesto en `u` y continúa ([§13.5](#135-corte-del-turno-y-última-parte)). Si `P_CUT` = 1, lo pone en 0 y sale.
- Un `jsys` que duerme (respuesta interna −2) deja `P_PC` en el propio `jsys`, de modo que se repite.

[Codificación](01-idioma-janax.md#41-palabra-de-instrucción) que decodifica el núcleo (`so/janaxos.asm:1839-1854`, `so/rutinas.inc:42-94`): bits 0-7 código de
operación, 8-11 `rd`, 12-15 `ra`, 16-31 inmediato de 16 bits (`rb` = bits 16-19). `OP_COUNT` = 1Dh
(`so/janaxos.asm:41`). Tabla de operaciones (`so/janaxos.asm:523-526`):

| Op | Nombre | Op | Nombre | Op | Nombre | Op | Nombre |
|---|---|---|---|---|---|---|---|
| 00h | [`jhalt`](01-idioma-janax.md#103-salida-de-jhalt) | 08h | `jsar` | 10h | `jld` | 18h | `jjn` |
| 01h | `jldi` | 09h | `jand` | 11h | `jst` | 19h | `jjnn` |
| 02h | `jadd` | 0Ah | `jor` | 12h | `jldb` | 1Ah | `jldadd` |
| 03h | `jsub` | 0Bh | `jxor` | 13h | `jstb` | 1Bh | `jldx` |
| 04h | `jmul` | 0Ch | `jjmp` | 14h | `jcall` | 1Ch | `jcall0` |
| 05h | `jdiv` | 0Dh | `jjz` | 15h | `jret` | | |
| 06h | `jshl` | 0Eh | `jjnz` | 16h | `jsys` | | |
| 07h | `jshr` | 0Fh | `jshi` | 17h | `jhost` | | |

La semántica de cada operación es del [capítulo 01](01-idioma-janax.md#5-instrucciones). Para este capítulo importan sus fallas ([§5.5](#55-códigos-de-salida-de-una-cabina)) y dos puntos de
contabilidad: el intérprete comprueba `P_PC < P_NWORDS` **antes** de contar la instrucción (código 2 sin contar) y
cuenta un código de operación desconocido antes de fallar (código 1) (`so/janaxos.asm:1819-1854`); el motor de
rutinas reproduce ambas cuentas (`so/rutinas.inc:228-238`).

**Tabla de rutinas** (motores 1 y 2; `so/rutinas.inc:4-12`, `so/rutinas.inc:27-172`): un registro de 16 bytes por
palabra más uno final.

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | Dirección de la rutina nativa de la instrucción (o del código traducido, motor 2). |
| 8 | 1 | `rd · 8`. |
| 9 | 1 | `ra · 8`. |
| 10 | 1 | `rb · 8`. |
| 11 | 1 | Código de operación (usado por la pasada de fusión). |
| 12 | 4 | Operando: inmediato extendido con signo (sin signo para `jshi`) o, para `jjmp`, `jjz`, `jjnz`, `jjn`, `jjnn`, `jcall`, `jcall0`, el destino como desplazamiento en bytes dentro de la tabla. Un destino fuera del programa apunta al registro final, que termina con código 2. |

Pasadas tras decodificar: un `jjmp` cuyo destino es un `jjz`/`jjnz` se reemplaza por la rutina fusionada
`t_jmp_jz`/`t_jmp_jnz`; una instrucción fusionable seguida de `jjz`/`jjnz` (o `jsub` seguida de `jjn`/`jjnn`) se
reemplaza por su variante fusionada, que cuenta la condición como la instrucción que es
(`so/rutinas.inc:105-166`, `so/janaxos.asm:532-553`). El registro de la condición se conserva para los saltos que
caen en ella.

Registros del anfitrión durante la ejecución por tabla: `r12` próximo registro, `r13` tabla, `r14` registros Janax,
`r15` sala 0, `rsi` pila de retorno, `rdi` profundidad, `rbp` presupuesto restante, `rbx` cabina, `rdx` registro en
curso (`so/rutinas.inc:18-22`). En la pila de retorno, una entrada de `jcall0` lleva el bit 63 y su `rd` (intérprete:
`rd` en los bits 32-35, `so/janaxos.asm:2120-2134`; rutinas: en los 4 bits bajos de la dirección del registro,
`so/rutinas.inc:574-588`).

El motor 2 (`so/nativo.inc`) escribe código nativo por palabra, mantiene las mismas convenciones y cobra el
presupuesto por tramos rectos; su comentario afirma que el turno termina en la misma instrucción que con los otros
motores (`so/nativo.inc:16-24`). Esa equivalencia exacta no se verificó en este capítulo (no verificado). Las
violaciones de acceso en sus vistas las atiende `native_fault` (`so/nativo.inc:946`).

### 5.4 Ayudante del núcleo

`plan_helper` (`so/ayudantes.inc:60-92`): un bloque de proceso con `P_HELPER` = 1, `P_ID` = −1, pila de retorno
reservada, sin salas, sin porteros, sin entrada en `procs`. `ret_trim` no le devuelve la pila
(`so/ambientes.inc:816-817`); la ventanilla rechaza todo `jsys` suyo (respuesta −1, el ayudante termina con 5)
(`so/janaxos.asm:2226-2227`).

### 5.5 Códigos de salida de una cabina

| Código | Causa | Fuente |
|---|---|---|
| 0 | [`jhalt`](01-idioma-janax.md#103-salida-de-jhalt). | `so/janaxos.asm:1883-1885` |
| 1 | Código de operación ≥ `OP_COUNT`. | `so/janaxos.asm:1852-1853`, `so/janaxos.asm:1886-1888` |
| 2 | `P_PC` fuera del programa. | `so/janaxos.asm:1822-1823`, `so/janaxos.asm:1889-1891` |
| 5 | Acceso de memoria fuera de una sala en pie, más allá de su tamaño o no permitido por su trato; `jsys` cuya ventanilla responde −1; [`jhost`](04-nucleo-abi-de-pedidos.md#11-la-ventana-al-anfitrión-jhost) con bloque fuera. | `so/janaxos.asm:1892-1894`, `so/janaxos.asm:2198-2200`, `so/anfitrion.inc:8-11`, `so/anfitrion.inc:25-27` |
| 6 | Acceso de 8 bytes desalineado; bloque de `jhost` (32 bytes) desalineado, o, con su primer qword en 0 (catálogo), con el valor de su segundo qword no múltiplo de 8. | `so/janaxos.asm:1895-1897`, `so/anfitrion.inc:12-17`, `so/anfitrion.inc:28-30` |
| 7 | `jcall`/`jcall0` con la pila de retorno en `RET_DEPTH` = 4096 entradas, o sin memoria para crecerla. | `so/janaxos.asm:1898-1900`, `so/ambientes.inc:780-808` |
| 8 | `jret` con profundidad 0. | `so/janaxos.asm:1901-1902`, `so/janaxos.asm:2146-2148` |
| 9 | `CODE_ENDED`: terminada por su padre (33) o porque terminó la línea de su padre. | `so/janaxos.asm:4593`, `so/janaxos.asm:5077`, `so/remos.inc:240` |
| 10 | `CODE_SPENT`: superó su presupuesto (34). | `so/janaxos.asm:4594`, `so/remos.inc:243-248` |

---

## 6. Modelo de memoria de un proceso

### 6.1 Dirección Janax

| Bits | Campo |
|---|---|
| 32-63 | Número de sala (`ROOM_SHIFT` = 32). |
| 0-31 | Posición dentro de la sala. |

Fuente: `so/ambientes.inc:4-7`, `so/ambientes.inc:38`. La sala 0 tiene número 0, así que un programa que nunca crece
usa direcciones de 32 bits. `ROOM_MAX` = 2^32 bytes es el tamaño máximo de una sala (`so/janaxos.asm:38-40`). El
lugar real de una sala en el anfitrión nunca es visible al programa.

### 6.2 Caja, vista, cajón y cartel

**Caja** (`box_new`, `so/ambientes.inc:100-119`): `CreateFileMappingA(-1, 0, PAGE_READWRITE, alto, bajo, 0)` con
el tamaño redondeado a páginas. Empieza en ceros. Vive mientras alguna clave o vista la tenga.

**Vista** (`box_view`, `so/ambientes.inc:121-210`), para una caja de `s` bytes (`s` múltiplo de 8) y `P` = `s`
redondeado a páginas:

1. `VirtualAlloc2` reserva `P + page_size` bytes como marcador (`MEM_RESERVE | MEM_RESERVE_PLACEHOLDER`,
   `PAGE_NOACCESS`): el cajón.
2. `VirtualFree(.., P, MEM_RELEASE | MEM_PRESERVE_PLACEHOLDER)` separa las primeras `P` como marcador propio.
3. `MapViewOfFile3` proyecta la caja sobre esas `P` (`MEM_REPLACE_PLACEHOLDER`, `PAGE_READWRITE`).
4. Si el trato pedido no es lectura y escritura, `VirtualProtect` la reduce (`PAGE_READONLY` para lectura,
   `PAGE_NOACCESS` para ninguno).
5. Lugar de la sala = `cajón + P − s`: la sala se apoya contra el final de sus páginas y el byte siguiente es la
   página de pared, que el procesador rechaza.

**Entrada del cartel** (`ROOM_ENTRY` = 32 bytes; `so/ambientes.inc:39-44`):

| Desplazamiento | Campo | Contenido |
|---|---|---|
| 0 | `RE_PLACE` | Bits 0-47: lugar de la vista. Bits 48-63: trato (tabla siguiente). |
| 8 | `RE_SIZE` | Tamaño en bytes; 0 = destruida. |
| 16 | `RE_KEY` | Clave (handle) de esta cabina a la caja. |
| 24 | `RE_BOX` | Bits 0-47: número de caja (igual en toda cabina que la tenga). Bits 48-49 (`ROOM_CEIL`): el trato máximo que esta cabina puede darle. |

**Bits de trato** (`so/ambientes.inc:46-60`). El núcleo sólo usa lectura, escritura, en pie y compartida; los demás
están definidos sin uso en estas fuentes (derivado de una búsqueda en todo el repositorio: fuera de su definición, `so/ambientes.inc:50-60`, no aparecen).

| Bit | Nombre | Significado declarado |
|---|---|---|
| 48 | `ROOM_READ` | Se puede leer. |
| 49 | `ROOM_WRITE` | Se puede escribir. |
| 50 | `ROOM_EXEC` | Se puede ejecutar. |
| 51 | `ROOM_ALIVE` | En pie. |
| 52 | `ROOM_APPEND` | Sólo agregar. |
| 53 | `ROOM_NOTIFY` | Un cambio despierta a quien espera. |
| 54 | `ROOM_SIGNED` | Cambiarla requiere la firma del dueño. |
| 55 | `ROOM_SHARED` | La tiene más de una cabina. |
| 56 | `ROOM_INHERIT` | Heredada. |
| 57-58 | `ROOM_PIECE` | Pieza de 2^n bytes. |
| 59-61 | `ROOM_PRIO` | Prioridad si falta memoria rápida. |
| 62 | `ROOM_PARENT` | Tiene hijos. |
| 63 | `ROOM_TAKES` | Se lleva a sus hijos al morir. |

Una sala nueva se marca `ROOM_LIVE` = lectura + escritura + en pie (`so/ambientes.inc:442`). Cada caja nueva recibe
un número `box_count` incremental que nunca se repite, con techo de trato 3 (`so/ambientes.inc:433-439`).

**Índices.** Entrada 0 = sala 0. Entrada k ≥ 1 = sala `P_ROOMBASE + k`. Las entradas destruidas tienen tamaño 0 y
lugar = cajón muerto. El cartel se crea con una página comprometida (`page_size / 32` entradas) y, cuando hace
falta, se muda a uno del doble o del tamaño necesario, redondeado a páginas (`rooms_cartel`, `rooms_room`,
`so/ambientes.inc:262-321`).

### 6.3 Primera orden: la sala 0

Una cabina nace sin memoria (`P_DATA` = cajón muerto, `P_ROOM0` = 0). Su primer [`jsys`](04-nucleo-abi-de-pedidos.md#32-primera-orden-construcción-de-la-sala-0) no lleva cola: el **valor**
del registro `ra` es el tamaño pedido para la sala 0 (`so/janaxos.asm:2228-2233`, `so/ambientes.inc:706-771`).

| Paso | Regla |
|---|---|
| 1 | Tamaño 0, o que desborda al redondear: falla. |
| 2 | Redondeo hacia arriba a múltiplo de 8; mayor que `ROOM_MAX`: falla. |
| 3 | `P_INITLEN` mayor que el tamaño: falla (los datos no caben). |
| 4 | Crea el cartel si no existe, la caja y su vista con trato 3. |
| 5 | Entrada 0 = `ROOM_LIVE | lugar`, tamaño, clave, número de caja. `P_DATA` = lugar; `P_SIZE` += tamaño; `P_ROOM0` = 1. |
| 6 | Copia `P_INITLEN` bytes de `P_INIT` al principio de la sala. |
| 7 | `P_LIM1` = tamaño; `P_LIM8` = tamaño − 7; `j15` = tamaño (la cima). |
| 8 | Responde 0 en `rd`. No cuenta como pedido. |

Si falla, la ventanilla devuelve −1 y la cabina termina con código 5 (`so/janaxos.asm:2183-2184`,
`so/janaxos.asm:2198-2200`).

### 6.4 Crecer, destruir y tratar

| Clase | Entrada | Regla | Responde | Fuente |
|---|---|---|---|---|
| 2 crecer | `a` = bytes | Igual que la sala 0 en tamaño (1..`ROOM_MAX`, redondeo a 8). Caja y vista nuevas con trato 3. Número = `P_NEXTROOM` (0 vale 1); `P_NEXTROOM` = número + 1. Entradas intermedias de salas destruidas se rellenan con tamaño 0 y cajón muerto. | Dirección = número << 32, o −1. | `so/ambientes.inc:385-431`, `so/ambientes.inc:323-383` |
| 3 destruir | `a` = dirección | `a` debe ser el comienzo (posición 0) de una sala en pie; no puede ser la sala donde está la cola en curso. Devuelve vista y clave; la entrada queda en tamaño 0. Si es la sala 0, `P_LIM1` = `P_LIM8` = 0 y `P_DATA` = cajón muerto. | 0, o −1. | `so/ambientes.inc:548-569`, `so/ambientes.inc:472-546` |
| 21 tratar | `a` = dirección, `b` = 0 ninguno, 1 lectura, 3 lectura y escritura | `b` = 2 o > 3 se rechaza. No más que el techo `RE_BOX` bits 48-49. No se le puede quitar la escritura a la sala de la cola. Aplica `VirtualProtect` a las páginas de la sala y reescribe el trato conservando `ROOM_SHARED` y marcando `ROOM_ALIVE`. En la sala 0, los límites rápidos valen sólo con trato 3 (si no, 0). | 0, o −1. | `so/ambientes.inc:571-653` |

**Numeración** (`so/ambientes.inc:21-25`, `so/ambientes.inc:503-543`): tras cada salida de una sala, las entradas
destruidas del final del cartel se recortan (la entrada 0 queda) y las del principio (desde la entrada 1) se
recortan sumando a `P_ROOMBASE` y corriendo las entradas. Cuando no queda ninguna sala salvo la 0,
`P_ROOMBASE` = 0 y `P_NEXTROOM` = 1: la numeración reempieza y las direcciones guardadas de antes pueden volver a
designar salas nuevas.

### 6.5 Traducción de los accesos

Para cada acceso de ancho `w` (8 o 1) a la dirección efectiva `x` (`so/janaxos.asm:2021-2098`,
`so/rutinas.inc:462-561`):

1. Camino rápido: si `x < P_LIM8` (w = 8) o `x < P_LIM1` (w = 1), el byte es `[P_DATA + x]`.
2. Si no, paquete `room_package` (`so/ambientes.inc:67-98`):
   - Número `n = x >> 32`. Si `n = 0`: sin cartel → falla; con cartel → entrada 0.
   - Si `n > 0`: entrada `e = n − P_ROOMBASE`; `e ≤ 0` o `e ≥ P_NROOMS` → falla.
   - Posición `o = x & FFFFFFFFh`; `o + w > RE_SIZE` → falla.
   - Bit 48 (carga) o 49 (almacenamiento) del trato en 0 → falla.
   - Byte = lugar + `o`.
3. Los accesos de 8 bytes exigen dirección alineada a 8 (código 6). La falla es código 5.

`jldadd` traduce dos veces (lectura y escritura); `jldx` usa `x = ra + rb · 8`. El motor 2 deja que el procesador
detenga los accesos más allá del tamaño o contra el trato (`so/ambientes.inc:12-15`, `so/nativo.inc:7-10`).

### 6.6 Acceso del núcleo a la memoria de una cabina

`room_at` / [`cabin_at`](04-nucleo-abi-de-pedidos.md#63-validación-de-punteros-cabin_at) (`so/ambientes.inc:655-704`) traducen `(x, d bytes)` para el núcleo: en la sala 0 exigen
`o + d ≤ P_LIM1`; en otra sala, `o + d ≤ RE_SIZE` y trato con **lectura y escritura**. Todo dato que un pedido lee o
escribe en la cabina (colas, etiquetas, bloques) pasa por esta regla: el núcleo sólo toca una sala que su dueño
puede leer y escribir. Los `d` bytes deben estar dentro de una sola sala.

### 6.7 Pila de retorno

| Regla | Fuente |
|---|---|
| Reserva fija de `RET_DEPTH · 8` = 32768 bytes al nacer, sin comprometer. | `so/janaxos.asm:1286-1289` |
| Al llenarse (`P_DEPTH ≥ P_RETCAP`), `ret_grow` duplica lo comprometido, empezando por `page_size / 8` entradas, hasta `RET_DEPTH`. En el tope o sin memoria: código 7. | `so/ambientes.inc:778-808` |
| Al final de cada turno, `ret_trim`: si terminó, descompromete todo; si no, mientras `P_RETCAP` > `page_size / 8` y `P_DEPTH · 4 ≤ P_RETCAP`, lo reduce a la mitad (una vez por turno). | `so/ambientes.inc:810-842` |

### 6.8 Dote al nacer y liberación al terminar

**Dote** (pedido 22, `rooms_dowry`, `so/ambientes.inc:902-954`): `a` = el comienzo de una sala propia en pie,
`b` = trato 0 (ninguno), 1 (lectura) o 3 (lectura y escritura); 2 o más de 3 se rechaza, y nunca más del que la
cabina tiene ahora (`so/ambientes.inc:909-923`). Se duplica la clave de la caja y se agrega a `P_DOWRY` un registro de 32 bytes
(`DOWRY_SIZE`, `so/ambientes.inc:848`):

| Desplazamiento | Campo |
|---|---|
| 0 | Clave duplicada para el hijo. |
| 8 | Tamaño. |
| 16 | Trato (bits 0-1); bit 2 `DOWRY_MOVED` = mudada (un solo dueño). |
| 24 | Número de caja (sin techo). |

La sala de origen se marca `ROOM_SHARED`. Al crear el próximo hijo, `rooms_born` (`so/ambientes.inc:1002-1029`) le
da cada caja de la dote como sus salas 1, 2, … en orden (vista propia con el trato dado; techo = ese trato), aplica
la asociación elegida (`rooms_assoc`, [capítulo 04](04-nucleo-abi-de-pedidos.md#92-memoria-y-cajas)) y vacía la dote de la madre. Los hijos del núcleo no tienen
dote.

**Liberación** (`cabin_free`, `so/ambientes.inc:2045-2108`), bajo el cerrojo, cuando una cabina termina o se rehace:
para cada entrada en pie, `sala_measure` (si el instrumento está activo), devuelve la vista y cierra la clave (la
caja sigue si otra cabina tiene clave); libera el cartel y pone `P_LIM1` = `P_LIM8` = 0, `P_DATA` = cajón muerto;
cierra las claves de la dote no usada y del buzón no recibido; libera las listas de dote, buzón, saludos, palabras y
vigilancia. Los archivos abiertos los cierra `close_files` (`so/janaxos.asm:3613-3635`).

### 6.9 Memoria del núcleo

Las estructuras del núcleo crecen duplicándose: tabla de procesos, nodos de porteros, depósito de prefijos,
registros de firma, tabla de archivos de cada cabina, listas por cabina (`list_slot`: capacidad inicial 4, se
duplica al llegar a una potencia de dos, `so/ambientes.inc:851-900`) y el libro de la ventanilla (copia de las
entradas de un toque, en páginas enteras, reutilizado, `so/ambientes.inc:2011-2043`). No existe en el núcleo una
rutina llamada `r_alloc`: `r_alloc` es una rutina de los programas de Razar que hace el pedido 2 con un mínimo de
8 bytes (`razar/cuerpo/luma.jsm:12847-12864`); su contrato es del [capítulo 08](08-luma-cuerpo-procesos-y-casa.md#11-registros-y-llamada-al-núcleo).

### 6.10 Instrumento de salas (`JANAX_SALAS`)

Con `salas_on`, al terminar una cabina (no al rehacerse) `sala_measure` cuenta por sala los bytes de sus qwords
distintos de cero como "usados" (cota inferior) y conserva las 10 que más desperdician
(`SAL_TOP` = 10; `so/janaxos.asm:429-442`, `so/janaxos.asm:4900-4962`); `sala_report` escribe las líneas de [§3.7](#37-salida-estándar-del-núcleo-y-códigos-de-salida) en
KB (división por 1024 truncada) y vacía el instrumento (`so/janaxos.asm:4964-5051`). El número que informa en
`sala <e>` es el índice de entrada en el cartel, no el número de sala (`so/janaxos.asm:4932-4934`).

---

## 7. La ventanilla en lo que concierne a procesos

### 7.1 Formato de la cola

`jsys rd, ra`: `ra` = dirección Janax de la cola; al volver, `rd` = pedidos atendidos (`so/janaxos.asm:2175-2207`).

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | `N`: cantidad de entradas. |
| 8 + 32·i | 4 | Clase de la entrada i. |
| 12 + 32·i | 4 | Mitad alta: dato extra según la clase: ranura de archivo (`file_handle`, `so/janaxos.asm:3556-3563`), largo de la segunda etiqueta en el [pedido 13](04-nucleo-abi-de-pedidos.md#93-archivos-del-sistema) (`so/janaxos.asm:3286`), permisos del hijo en el [pedido 16](#92-lanzar-16) (`so/janaxos.asm:4471`), trato en el [pedido 24](04-nucleo-abi-de-pedidos.md#92-memoria-y-cajas) (`so/janaxos.asm:4357`). |
| 16 + 32·i | 8 | `a`. |
| 24 + 32·i | 8 | `b`. |
| 32 + 32·i | 8 | Respuesta. |

Requisitos (`so/janaxos.asm:2234-2253`): dirección alineada a 8; el contador y la cola entera (`8 + 32·N` bytes)
dentro de una sola sala accesible por el núcleo ([§6.6](#66-acceso-del-núcleo-a-la-memoria-de-una-cabina)); `N ≤ ROOM_MAX / 32` = 2^27. Si no se cumplen, la ventanilla
devuelve −1 y la cabina termina con 5. Al terminar el toque, las respuestas se copian de vuelta y `N` queda en 0
(`so/janaxos.asm:2432-2443`).

### 7.2 Algoritmo de un toque

Con el cerrojo tomado (`so/janaxos.asm:2179-2181`):

1. Ayudante: −1. Sin sala 0: primera orden ([§6.3](#63-primera-orden-la-sala-0)).
2. Valida la cola; `N` = 0 → responde 0. Suma `N` a `requests` y copia las entradas al libro.
3. **Marcado**, por cada entrada en orden (`so/janaxos.asm:2274-2346`):
   1. Clase fuera de 1..47 → respuesta −1.
   2. Si `kind_door[clase]` ≠ 0: el portero de la cabina para esa puerta debe permitir `kind_right[clase]`
      ([§8.4](#84-verificaciones)); si no, `denied` += 1 y −1.
   3. [Clase 29](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas) sin saludos pendientes → espera ([§13.6](#136-espera-sin-gasto)). [Clase 41](05-nucleo-pantalla-teclado-vigia.md#8-esperar-un-evento-pedido-41) que debe esperar → espera.
   4. Si `kind_important[clase]` = 1 y la cabina no es hija del núcleo y su línea no firmó esa clase al nacer
      ([§10.4](#104-herencia-de-firmas-45)): `signature` ([§10.3](#103-protocolo-de-firma)). Firmado → sigue; rechazado → `denied` += 1 y −1; en espera → toca el timbre
      del padre y cuenta una espera.
   5. Si pasa, la clase queda presente en la ronda.
4. Si hubo esperas: `P_WAITING` = cantidad de esperas, se restan los `N` de `requests` y se devuelve −2: la cabina
   duerme y el `jsys` se repetirá entero ([§13.6](#136-espera-sin-gasto)).
5. Asignación de pantallas por clase presente (dos pasadas: una clase que ya tiene pantalla la conserva; las demás
   toman una pantalla libre en esta ronda o abren una nueva) y atención en lote de cada clase. Las clases se
   atienden **en el orden del índice de pantalla** (`tune[0]`, `tune[1]`, …), no en orden de número de clase; ese
   orden depende de las rondas anteriores. Dentro de cada clase se respeta el orden de la cola
   (`so/janaxos.asm:2358-2429`). El detalle de pantallas es del [capítulo 04](04-nucleo-abi-de-pedidos.md#5-procesamiento-de-un-toque).
6. Copia de respuestas al principio de la cola (`cabin_at` sobre la dirección de la cola otra vez); `N` queda en 0;
   devuelve `N` (`so/janaxos.asm:2432-2443`).

**Despacho por clase.** Cada manejador recorre **todas** las entradas de la cola cuya mitad baja es su clase
(`serve_gate`, `so/janaxos.asm:3861-3882`; `serve_write`, `so/janaxos.asm:2461-2465`); no consulta si el marcado ya
respondió −1 a una entrada. Consecuencia (derivado; no verificado en ejecución): si en un mismo toque hay dos
entradas de la misma clase importante y el padre firmó una y rechazó la otra, la clase queda presente y la entrada
rechazada también se atiende, y su respuesta −1 se sobrescribe. Los rechazos de portero, de herencia y de sombra
dependen sólo de la cabina y de la clase, de modo que afectan por igual a todas las entradas de esa clase y no
producen esta mezcla.

Después del toque, si `sched_dirty` = 1 (lo ponen los pedidos 16 y 17), el turno de la cabina se corta en ese
punto contando sólo lo que corrió (`so/janaxos.asm:2189-2194`, `so/rutinas.inc:628-633`, [§13.5](#135-corte-del-turno-y-última-parte)).

Como el toque entero se repite tras una espera, los porteros se evalúan otra vez en la repetición
(derivado de `so/janaxos.asm:2201-2207` y del paso 3.2).

### 7.3 Tablas por clase

Fuente: `kind_door` `so/janaxos.asm:219-223`, `kind_right` `so/janaxos.asm:224-229`, `kind_important`
`so/janaxos.asm:231-240`, manejadores `so/janaxos.asm:210-216`. Puerta 0 = sin verificación de portero en el marcado
(responde a las reglas propias del pedido). Derechos: P pantalla, M memoria, L leer, G grabar; "L/G" = cualquiera
de los dos.

| Clase | Nombre (manejador) | Puerta | Derecho | Importante |
|---|---|---|---|---|
| 1 | escribir (`serve_write`) | 1 | P | 1 |
| 2 | crecer (`serve_grow`) | 2 | M | 1 |
| 3 | destruir (`serve_destroy`) | 2 | M | 1 |
| 4 | abrir (`serve_open`) | 3 | L/G | 1 |
| 5 | leer archivo (`serve_fread`) | 3 | L | 0 |
| 6 | escribir archivo (`serve_fwrite`) | 3 | G | 1 |
| 7 | cerrar (`serve_close`) | 0 | — | 0 |
| 8 | ceder (`serve_cede`) | 0 | — | 1 |
| 9 | usar (`serve_use`) | 0 | — | 1 |
| 10 | revocar (`serve_revoke`) | 0 | — | 1 |
| 11 | consultar (`serve_consult`) | 0 | — | 0 |
| 12 | borrar (`serve_delete`) | 3 | G | 1 |
| 13 | renombrar (`serve_rename`) | 3 | G | 1 |
| 14 | listar (`serve_list`) | 3 | L | 0 |
| 15 | ceder con etiqueta (`serve_cede_label`) | 0 | — | 1 |
| 16 | lanzar (`serve_launch`) | 3 | L | 1 |
| 17 | firmar (`serve_sign`) | 0 | — | 0 |
| 18 | pendientes (`serve_pending`) | 0 | — | 0 |
| 19 | estado (`serve_state`) | 0 | — | 0 |
| 20 | bolita (`serve_bolita`) | 0 | — | 0 |
| 21 | tratar una caja (`serve_treat`) | 2 | M | 1 |
| 22 | dote (`serve_dowry`) | 2 | M | 1 |
| 23 | mudar (`serve_move`) | 2 | M | 1 |
| 24 | enlazar (`serve_link`) | 2 | M | 1 |
| 25 | recibir (`serve_receive`) | 2 | M | 0 |
| 26 | fusionar (`serve_fuse`) | 2 | M | 1 |
| 27 | asociar (`serve_assoc`) | 2 | M | 1 |
| 28 | saludar (`serve_greet`) | 0 | — | 0 |
| 29 | esperar un saludo (`serve_greeting`) | 0 | — | 0 |
| 30 | decir una palabra (`serve_say`) | 0 | — | 0 |
| 31 | leer una palabra (`serve_hear`) | 0 | — | 0 |
| 32 | vigilar (`serve_watch`) | 3 | L | 0 |
| 33 | terminar a un hijo (`serve_end`) | 0 | — | 1 |
| 34 | presupuesto de un hijo (`serve_budget`) | 0 | — | 1 |
| 35 | remado (`serve_rowed`) | 0 | — | 0 |
| 36 | rehacerse (`serve_remake`) | 3 | L | 1 |
| 37 | abrir en el anfitrión (`serve_host_open`) | 3 | L | 0 |
| 38 | ir a (`serve_seek`) | 3 | L | 0 |
| 39 | lo nuevo del anfitrión (`serve_hostnew`) | 3 | L | 0 |
| 40 | mostrar (`serve_show`) | 1 | P | 0 |
| 41 | esperar un evento (`serve_wait_event`) | 1 | P | 0 |
| 42 | remar en los huecos (`serve_gaps`) | 0 | — | 1 |
| 43 | nombrar la ventana (`serve_title`) | 1 | P | 0 |
| 44 | una nota (`serve_note`) | 1 | P | 0 |
| 45 | heredar firmas (`serve_inherit`) | 0 | — | 1 |
| 46 | nombrar hermano del padre (`serve_name`) | 0 | — | 1 |
| 47 | copiar al portapapeles (`serve_copy`) | 1 | P | 1 |

`KINDS` = 47 debe ser < 64 (`assert`, `so/janaxos.asm:167-169`) porque la herencia de firmas usa un bit por clase en
un qword. `KINDS_ALL` = `(1 << 48) − 2`: bits 1 a 47 (`so/janaxos.asm:170`).

---

## 8. Porteros

### 8.1 Nodo

`NODE_SIZE` = 48 bytes; tabla `nodes` que se duplica (`so/janaxos.asm:124-130`, `so/janaxos.asm:3716-3804`).

| Desplazamiento | Campo | Contenido |
|---|---|---|
| 0 | `N_PARENT` | Índice del nodo padre; −1 para la raíz. |
| 8 | `N_RIGHTS` | Máscara de derechos (`R_SCREEN` 1, `R_MEM` 2, `R_READ` 4, `R_WRITE` 8). |
| 16 | `N_ALIVE` | 1 vivo; 0 revocado. |
| 24 | `N_DOOR` | Puerta (0 para la raíz). |
| 32 | `N_PREFIX` | Desplazamiento del prefijo de etiqueta en el depósito `pfx_pool`. |
| 40 | `N_PLEN` | Largo del prefijo; 0 = cualquier etiqueta. |

Los nodos nunca se eliminan; revocar es poner `N_ALIVE` = 0.

### 8.2 Árbol inicial

| Nodo | Padre | Derechos | Puerta | Fuente |
|---|---|---|---|---|
| 0 | −1 | `R_ALL` = 15 | 0 | `so/janaxos.asm:841-844` |
| 1 | 0 | `R_SCREEN` | 1 | `so/janaxos.asm:845-848` |
| 2 | 0 | `R_MEM` | 2 | `so/janaxos.asm:849-852` |
| 3 | 0 | `R_READ + R_WRITE` | 3 | `so/janaxos.asm:853-856` |

### 8.3 Microporteros de una cabina

Al crear una cabina, para cada puerta d = 1..3 (`so/janaxos.asm:1290-1315`): padre del nuevo nodo = el nodo d si el
padre es el núcleo, o `P_GATES[d]` del padre en otro caso (el que el padre use en ese momento, que pudo bajar con
el [pedido 9](04-nucleo-abi-de-pedidos.md#95-porteros)); derechos = `N_RIGHTS(padre) & mp_rights`; el nodo de la puerta 3 lleva el prefijo `mp_pfx` (sólo
desde la línea de comandos; un hijo lanzado no recibe prefijo propio pero hereda los de arriba por la subida).

### 8.4 Verificaciones

| Rutina | Regla | Fuente |
|---|---|---|
| `gate_allows(n, r)` | Sube desde `n` hasta la raíz: cada nodo debe existir, estar vivo y tener algún bit de `r`. | `so/janaxos.asm:3806-3828` |
| `mine(n)` | `n` es propio de la cabina si, subiendo desde `n` con todos los nodos vivos, se llega a `P_GATES[N_DOOR(n)]` (el propio cuenta). | `so/janaxos.asm:3830-3858` |
| `prefix_allows(n)` | La etiqueta normalizada debe empezar con el prefijo de cada nodo con prefijo en la subida. | `so/janaxos.asm:3103-3132` |
| `files_prefix_ok` | `prefix_allows(P_GATES[3])` de la cabina en curso; un rechazo suma a `denied`. | `so/janaxos.asm:3134-3145` |

Los pedidos 8, 9, 10, 11 y 15 (ceder, usar, revocar, consultar, ceder con etiqueta) se especifican en el [capítulo
04](04-nucleo-abi-de-pedidos.md#95-porteros) (`so/janaxos.asm:3884-4005`). Propiedad usada aquí: ningún nodo creado tiene derechos que su padre no tenga, y
revocar un nodo inhabilita toda su rama (`so/janaxos.asm:3711-3714`).

---

## 9. Familia de procesos

### 9.1 Relaciones

El núcleo es la raíz (padre 0). Una cabina es **hija** de quien la lanzó (`P_PARENT`). `cabin_family(x)` acepta, en
los pedidos de cajas, saludos y palabras, un número `x` que sea el padre (también como −1), un hijo o un hermano
(mismo padre), que no haya terminado y que no sea ella misma (`so/ambientes.inc:1031-1059`). Los pedidos de este
capítulo usan reglas propias por pedido ([§14](#14-invariantes-de-seguridad)).

### 9.2 Lanzar (16)

Entrada: `a` = etiqueta del archivo del programa, `b` = sus bytes; mitad alta de la clase = permisos pedidos para el
hijo (`so/janaxos.asm:4440-4495`). Pasos:

1. `label_path` (la etiqueta debe estar en una sala accesible, ser UTF-8 válido no vacío y caber en la ruta) y
   `files_prefix_ok` del padre. Fallo: −1.
2. Abre el archivo y lo lee (tope 1 MiB) en `load_buf`. Si no se abre, o si falta el búfer de carga: −1. El
   resultado de `ReadFile` no se comprueba: si la lectura falla, el hijo nace con las palabras leídas hasta ahí
   (puede ser 0) (`so/janaxos.asm:4453-4469`).
3. `make_process` con padre = la cabina, permisos = mitad alta (recortados por los porteros del padre en [§8.3](#83-microporteros-de-una-cabina)),
   bolita = `P_PRIO` **actual** del padre (también tope del hijo), sin prefijo propio.
4. `P_SIGNED` del hijo = `P_SIGNNEXT` del padre; `P_SIGNNEXT` del padre = 0 (se consume en un solo lanzamiento).
5. `family_data`: datos iniciales del hijo desde la etiqueta de datos ([§3.6](#36-carga-de-un-programa-y-de-sus-datos)), con el prefijo del padre.
6. `sched_dirty` = 1. Responde `P_ID` del hijo.

Si una reserva de memoria del anfitrión falla dentro de `make_process`, el núcleo entero sale con 3
(`so/janaxos.asm:1277-1279`).

### 9.3 Estado (19)

`a` = número de un hijo propio → `P_CODE` si terminó, −1 si sigue, −2 si no es hijo propio o `a` ≥ `nprocs`
(`so/janaxos.asm:4567-4585`).

### 9.4 Terminar a un hijo (33)

`a` = número de un hijo propio (`so/janaxos.asm:4587-4625`):

| Situación | Acción | Responde |
|---|---|---|
| No es hijo propio | — | −2 |
| Ya terminó | — | su `P_CODE` |
| Un remero lo ejecuta ahora | `P_KILL` = 1: termina con 9 al acabar su turno | −1 |
| En otro caso | `cabin_end`: termina ya con 9, con toda su línea | 9 |

`cabin_end` (`so/janaxos.asm:5067-5090`), bajo el cerrojo: `line_end` (primero su línea), sale de la fila,
`P_CODE` = 9, `P_DONE` = 1, `end_records`, `ring_parent`, `close_files`, `orphans`, `cabin_free` y la línea de
informe.

### 9.5 Fin de una línea (`line_end`)

`so/janaxos.asm:5092-5169`. Para la cabina `C` que termina:

- Si `C` **no** es hija del núcleo: cada hijo de `C` no terminado termina ahora con `cabin_end` (recursivo) o, si se
  está ejecutando, recibe `P_KILL` = 1 y termina al acabar su turno. Toda la descendencia termina con código 9.
- Si `C` es hija del núcleo: sus hijos no terminados pasan a tener `P_PARENT` = 0 (hijos del núcleo) y siguen
  vivos; todo registro de firma pendiente con firmante `C` se decide en el acto con los permisos de `C`
  (`shadow_decides`, [§10.5](#105-sombra)), y su hijo se despierta si ya no espera nada más.

Los porteros de `C` no se revocan en este camino, así que los hijos que siguen vivos conservan los derechos que
colgaban de ellos (derivado de `so/janaxos.asm:4115-4175`: `orphans` sólo revoca porteros de una sombra).

### 9.6 Fin de una cabina (secuencia completa)

Al acabar un turno con `P_DONE` = 1 o con terminación forzada (`so/remos.inc:229-283`):

1. Si `P_DONE` = 0 y `P_KILL` = 1 → código 9; si `P_LIMIT` ≠ 0 y `P_SERVED ≥ P_LIMIT` → código 10. En ambos casos:
   `P_DONE` = 1, `end_records`, `line_end`.
2. Si terminó con `P_REMAKE` ≠ 0 y `P_CODE` = 0 → se rehace ([§9.8](#98-rehacerse-36)) y vuelve a la fila.
3. Si no: `ring_parent`, `close_files`, `line_end`, `orphans`, activa el instrumento de salas si corresponde,
   `cabin_free`, `sala_report`, línea `P<n> ...` (salvo calibración).

`end_records` (`so/janaxos.asm:5171-5195`): todo pedido de esta cabina que esperaba firma pasa a rechazado (estado 2)
y su firmante sostiene uno menos; `P_WAITING` = 0.

### 9.7 Nombrar hermano del padre (46)

`a` = número de una cabina `X` (`so/janaxos.asm:4627-4686`). Condiciones, todas necesarias:

1. `a` < `nprocs`; `X` no terminó.
2. El padre `Y` de `X` existe (≠ 0) y no es la cabina que pide.
3. La cabina que pide es `Y.P_PARENT` o un ancestro de él (X está al menos dos niveles por debajo).

Efecto: `X.P_PARENT` = `Y.P_PARENT` (sube exactamente un nivel). Los registros de firma pendientes de `X` con
firmante `Y` pasan al nuevo padre (ajustando `P_BLOCKS` de ambos) y se despierta al remero especial. Sus porteros
no cambian. Responde 0, o −2.

### 9.8 Rehacerse (36)

`a`/`b` = etiqueta de un programa, como en el [pedido 16](#92-lanzar-16) (`so/janaxos.asm:4766-4837`):

1. `label_path`, `files_prefix_ok` de la propia cabina, abrir y leer (tope 1 MiB). Si no se abre, o si falta
   memoria: −1. El resultado de `ReadFile` no se comprueba (`so/janaxos.asm:4783-4811`).
2. Libera un `P_REMAKE` anterior (vale el último pedido) y copia el programa a un bloque propio (`P_REMAKE`,
   `P_REMAKEN`).
3. Libera `P_INIT`; `family_data` carga los datos iniciales del nuevo programa (o ninguno).
4. Responde 0. La cabina sigue ejecutando su programa actual.

Cuando la cabina termina con código 0, `cabin_remake` (`so/janaxos.asm:4839-4879`): `close_files`, `cabin_free`,
`share_program` con el nuevo programa, libera `P_REMAKE`, y pone en 0: registros, `P_PC`, `P_DEPTH`, `P_DONE`,
`P_CODE`, `P_SIZE`, `P_ROOMBASE`, `P_NEXTROOM`, `P_ROOM0`, `P_WAITING`, `P_GWAIT`, `P_NGREET`, `P_WATCH`,
`P_WATCHN`, `P_CUT`, `P_REMAKE`, `P_REMAKEN`; vuelve a la fila. Se conservan número, padre, hijos, porteros, bolita y
tope, turno, presupuesto, servicio, firmas heredadas y huecos. Con un código distinto de 0 no se rehace.

### 9.9 Timbre al padre

`ring_parent` (`so/janaxos.asm:4881-4898`): cuando una cabina termina, si su padre existe y no terminó, recibe un
saludo de ella ([clase 28](04-nucleo-abi-de-pedidos.md#97-comunicación-entre-cabinas), `greet`, `so/ambientes.inc:1453-1499`), que lo despierta si espera un saludo (29) o un
evento de pantalla (41).

---

## 10. Firmas

### 10.1 Pedidos importantes

Un pedido es importante si `kind_important[clase]` = 1 ([§7.3](#73-tablas-por-clase)). Un pedido importante de una cabina cuyo padre no es
el núcleo necesita la firma de su padre, salvo que su línea lo haya firmado al nacer ([§10.4](#104-herencia-de-firmas-45)). Los hijos del núcleo
no esperan firma: los limitan sólo sus porteros (`so/janaxos.asm:2314-2320`).

### 10.2 Registro de firma

`REC_SIZE` = 40 bytes; tabla `recs` que se duplica; los registros nunca se eliminan (`so/janaxos.asm:241-251`,
`so/janaxos.asm:4057-4104`). El **número de pedido** que ven los pedidos 17 y 18 es el índice del registro.

| Desplazamiento | Campo | Contenido |
|---|---|---|
| 0 | `R_CHILD` | Bloque de la cabina que pide. |
| 8 | `R_INDEX` | Índice de la entrada dentro de su toque. |
| 16 | `R_KIND` | Clase. |
| 24 | `R_SIGNER` | Bloque del firmante (el padre en el momento de pedir). |
| 32 | `R_STATE` | 0 espera, 1 firmado, 2 rechazado, 3 usado (`REC_USED`). |

### 10.3 Protocolo de firma

Participantes: H (hija que pide), P (su padre, firmante).

1. H toca la ventanilla. En el marcado, para la entrada i de clase k importante, `signature(H, i, k)`
   (`so/janaxos.asm:4016-4055`):
   - Si P tiene `P_SHADOW` = 1: decide la sombra en el acto ([§10.5](#105-sombra)).
   - Busca un registro con (`R_CHILD` = H, `R_INDEX` = i, `R_KIND` = k) y estado ≠ 3. Estado 0: sigue esperando.
     Estado 1 o 2: lo marca 3 (usado) y devuelve ese estado.
   - Sin registro: `new_record` crea uno en estado 0, `P.P_BLOCKS` += 1, `held` += 1, y despierta al remero especial.
2. Si quedó en espera, H toca el timbre de P (un saludo de H a P, [§9.9](#99-timbre-al-padre)) y el toque entero de H queda en espera
   (respuesta interna −2): H duerme sin ejecutar y su `jsys` se repetirá (`so/janaxos.asm:2328-2355`).
3. P consulta con **18 pendientes**: `a` = dirección, `b` = bytes disponibles. Por cada registro con firmante P en
   estado 0, mientras queden 24 bytes, escribe tres qwords `{número de registro, P_ID de H, clase}`. Responde la
   cantidad escrita, o −1 si `[a, a+b)` no está en una sala accesible (`so/janaxos.asm:4525-4565`).
4. P responde con **17 firmar**: `a` = número de registro, `b` ≠ 0 firma (estado 1), `b` = 0 rechaza (estado 2).
   Exige `a` < `nrecs`, firmante = P, estado 0; si no, −1. Efecto: `P.P_BLOCKS` −= 1, `held` −= 1,
   `H.P_WAITING` −= 1, H vuelve a la fila si ya no espera nada (`q_wake`), `sched_dirty` = 1. Responde 0
   (`so/janaxos.asm:4497-4523`).
5. Cuando `H.P_WAITING` llega a 0, H se ejecuta y repite el `jsys`. En el nuevo marcado, cada entrada vuelve a pasar
   por los porteros y por `signature`, que ahora encuentra el registro decidido y lo consume. Firmado: se atiende;
   rechazado: −1 y `denied` += 1 (salvo el caso mixto descrito en [§7.2](#72-algoritmo-de-un-toque), despacho por clase).

Notas derivadas del código:

- Un registro decidido se consume en el marcado en que se consulta aunque el toque vuelva a esperar por otra
  entrada; en ese caso, en la repetición siguiente esa entrada pide firma otra vez (derivado de
  `so/janaxos.asm:4037-4049`).
- Una firma no da permisos: los porteros se verifican en el marcado antes de pedirla y otra vez en la repetición.

### 10.4 Herencia de firmas (45)

`a` = 0 (para el próximo hijo) o el número de un hijo propio; `b` = máscara de clases (bit k = clase k)
(`so/janaxos.asm:4268-4294`).

1. `m = signed_mask(cabina) & b`.
2. `a` = 0: `P_SIGNNEXT` = `m` (lo toma el próximo [pedido 16](#92-lanzar-16) y se pone en 0). Responde `m`.
3. `a` = hijo propio (`a` < `nprocs` y su `P_PARENT` = la cabina): su `P_SIGNED` = `m` ahora (sirve también para
   quitar firmas). Responde `m`.
4. Otro caso: −2.

`signed_mask(C)` (`so/janaxos.asm:4305-4318`): parte de `KINDS_ALL` y hace AND con `P_SIGNED` de `C` y de cada
ancestro mientras ese ancestro no sea hijo del núcleo (el hijo del núcleo firma todo y su `P_SIGNED` no
interviene). Quitar una firma en cualquier nivel la quita para toda la línea de abajo. `born_signed(C, k)` = bit k
de `signed_mask(C)` (`so/janaxos.asm:4296-4303`). Una clase firmada así no espera firma, pero sigue sometida a los
porteros.

### 10.5 Sombra

`orphans(C)` (`so/janaxos.asm:4106-4175`), llamada al terminar C:

- Si queda alguna cabina viva sin `P_KILL` que descienda de C (`living_below`, `so/janaxos.asm:4177-4207`):
  `C.P_SHADOW` = 1 y cada registro pendiente con firmante C se decide con `shadow_decides` (firmado si el portero
  de C para la puerta de la clase permite su derecho, o si la clase es de puerta 0; rechazado en otro caso,
  `so/janaxos.asm:4209-4225`). Los pedidos posteriores de esa línea que necesiten la firma de C también los decide
  la sombra ([§10.3](#103-protocolo-de-firma), paso 1).
- Subiendo desde C, toda sombra (`P_SHADOW` = 1) sin descendientes vivos pasa a 2 y sus tres porteros se revocan.

Como `line_end` se ejecuta antes que `orphans`, una sombra sólo puede existir mientras algún descendiente de C cuyo
padre se estaba ejecutando espera terminar al fin de ese turno (derivado; no verificado en ejecución).

### 10.6 Nadie firma

Si ningún remero ejecuta nada, la fila está vacía, hay cabinas esperando y el centinela no tiene nada que vigilar
([§13.6](#136-espera-sin-gasto)), `nobody_signs` (`so/janaxos.asm:4227-4253`): todo registro en estado 0 pasa a rechazado y su cabina se
despierta; `greet_nobody` despierta a quien espera un saludo con `P_GWAIT` = 2 (su espera responde −1)
(`so/ambientes.inc:1603-1623`). Ninguna cabina espera para siempre una firma que nadie puede dar.

---

## 11. Presupuesto y servicio

**34 presupuesto** (`so/janaxos.asm:4715-4742`): `a` = número de un hijo propio, `b` = instrucciones adicionales.

| Situación | Efecto | Responde |
|---|---|---|
| No es hijo propio | — | −2 |
| Ya terminó | — | su `P_CODE` |
| `b` = 0 | `P_LIMIT` = 0 (sin presupuesto) | 0 |
| `b` ≠ 0 | `P_LIMIT` = `P_SERVED + b` | 0 |

El límite se comprueba al final de cada turno (`so/remos.inc:243-248`): si `P_SERVED ≥ P_LIMIT`, la cabina termina
con código 10 junto con su línea. El turno no se acorta para respetar el límite: el exceso puede ser hasta un turno
más su extensión de última parte (derivado).

**35 remado** (`so/janaxos.asm:4744-4764`): `a` = −1 (la propia cabina) o el número de un hijo propio → su
`P_SERVED`. Para la propia cabina, el valor cuenta hasta el turno anterior (el turno en curso se suma al terminar,
`so/remos.inc:236`). −2 si no es ninguno de los dos.

---

## 12. Prioridad, planificador y huecos

### 12.1 Bolita (20)

`a` = bolita deseada en 65536avos → `P_PRIO = min(a, P_PRIO_TOP)` (comparación sin signo, así que un valor negativo
se recorta al tope), `plan_quantum` recalcula `P_QUANTUM` y responde la bolita obtenida
(`so/janaxos.asm:5197-5207`). No es importante y no tiene puerta: toda cabina puede bajar o recuperar su bolita
hasta su tope. El tope se fija al nacer: el `!` de la línea de comandos, o la bolita actual del padre al lanzar.

### 12.2 Programa planificador

**Carga** (`plan_load`, `so/ayudantes.inc:14-58`):

1. Etiqueta `PDP/so/nucleo/planificador.bin` (`so/janaxos.asm:446`) convertida a ruta en la carpeta del sistema.
2. Si se abre y tiene al menos una palabra (tope 1 MiB), se copia y `plan_own` = 1; se escribe
   `planificador: el de PDP`.
3. Si no, el de fábrica: `plan_default`, incrustado desde `so/pdp/semilla/planificador.bin`
   (`so/janaxos.asm:444-445`).
4. `plan_helper` prepara el ayudante ([§5.4](#54-ayudante-del-núcleo)) con ese programa.

**Contrato** (`plan_quantum`, `so/ayudantes.inc:94-147`; `so/nucleo/planificador.jsm:1-10`), una vez al nacer la
cabina y en cada pedido 20, nunca en un cambio:

| Entrada | Salida |
|---|---|
| Todos los registros en 0; `j1` = bolita (`P_PRIO`); `j3` = `plan_c16`; `P_PC` = 0. | `j0` = turno al ejecutar [`jhalt`](01-idioma-janax.md#103-salida-de-jhalt). |

Presupuesto del ayudante: `PLAN_BUDGET` = 100000 instrucciones (criterio declarado, no medición,
`so/ayudantes.inc:10-12`). Resultado: si terminó con código 0, `P_QUANTUM` = `j0` si `j0` > 0 (con signo), si no 1.
Si no terminó dentro del presupuesto o terminó con otro código: con planificador propio, se vuelve al de fábrica
para el resto de la ejecución, se escribe `planificador: el de PDP fallo, vuelve el de fabrica` y se recalcula;
con el de fábrica, `P_QUANTUM` = 1.

### 12.3 Turno por prioridad (`cuanto`)

`so/nucleo/planificador.inc:199-229`. Con `p` = bolita (65536avos) y `c16` = costo en dieciseisavos:

- Si `p ≥ 65536`: turno = 2^62 (rema hasta terminar).
- Si no: `turno = ceil(c16 · p / (16 · (65536 − p)))`, mínimo 1.

Es `c · p / (1 − p)` redondeado hacia arriba: la fracción `t / (t + c)` del tiempo queda para trabajo real.
Ejemplo derivado: `c` = 8 instrucciones (`c16` = 128) y `p` = `PRIO_DEFAULT` = 64881 dan
`ceil(8304768 / 10480)` = 793 instrucciones. Con `c` = 0 (`c16` = 0) el cociente es 0 y el turno vale 1 para toda
bolita menor que 65536 (derivado de `so/nucleo/planificador.inc:215-221`).

`planificador.inc` contiene además `turno`, `turno_ok` y `raiz` (servicio mínimo atendido con turno
`t ≥ D + 1` tal que `t · (t − D − c) ≥ c · s`, en enteros; `so/nucleo/planificador.inc:1-197`). El programa
planificador no las llama (`so/nucleo/planificador.jsm:8`) y la fila del núcleo es por orden de llegada ([§13.3](#133-fila)); las
variables `plan_d` y `plan_s` del núcleo no se usan en `so/` (derivado de una búsqueda; `so/janaxos.asm:457-458`).

### 12.4 Huecos (42)

`a` = número de un hijo propio o de la propia cabina, `b` ≠ 0 rema en los huecos, `b` = 0 como todas: `P_GAPS` = 1
o 0; responde 0, o −2 (`so/janaxos.asm:4688-4713`). Mientras un remero ejecuta una cabina con `P_GAPS` = 1, su hilo
tiene `THREAD_PRIORITY_IDLE` = −15; al pasar a una cabina sin huecos vuelve a prioridad 0 (no a la que tenía antes).
El cambio sólo se pide al anfitrión cuando difiere de la cabina anterior, y al salir el remero vuelve a 0
(`so/remos.inc:113-130`, `so/remos.inc:222-227`, `so/remos.inc:289-293`). Es importante: una cabina no hija del
núcleo necesita la firma de su padre incluso para sí misma, salvo herencia.

---

## 13. Remeros

### 13.1 Hilos y clases de remero

`row` (`so/remos.inc:428-472`): crea `remos − 1` hilos con `CreateThread(.., ROWER_STACK = 10000h, .., 
STACK_SIZE_PARAM_IS_A_RESERVATION)`; el hilo principal también rema. Espera a todos con `WaitForSingleObject` y
cierra sus handles.

| Cantidad de remeros | Hilo principal | Hilo 1 | Hilos 2.. |
|---|---|---|---|
| 1 | `ROW_BOTH` (2) | — | — |
| > 1 | `ROW_LINE` (0) | `ROW_SPECIAL` (1) | `ROW_LINE` |

Fuente de las constantes: `so/remos.inc:21-25`.

### 13.2 Cerrojo y variables de condición

| Recurso | Uso | Fuente |
|---|---|---|
| `kern_lock` (sección crítica) | Tomar una cabina, la ventanilla, el fin de una cabina, la fila. | `so/remos.inc:27-47` |
| `kern_change` (variable de condición) | Duermen los remeros de fila; `asleep_line` cuenta cuántos. | `so/remos.inc:90-110` |
| `kern_special` (variable de condición) | Duerme el remero especial; `special_asleep` = 1. | `so/remos.inc:97-110` |

`SleepConditionVariableCS` con `INFINITE`: un remero dormido no consume procesador y sólo lo despierta otro.
`kern_wake_one` despierta un remero de fila si hay alguno dormido, si no al especial; `kern_wake_special` despierta
al especial si duerme; `kern_wake` despierta a todos los remeros de fila (`WakeAllConditionVariable` sobre
`kern_change`) y no al especial, al que la terminación despierta aparte con `kern_wake_special`
(`so/remos.inc:48-89`, `so/remos.inc:186-188`).

### 13.3 Fila

Lista doblemente enlazada por `P_NEXT`/`P_PREV`, con `q_head`/`q_tail` y la marca `P_QUEUED`
(`so/remos.inc:330-418`):

| Operación | Efecto |
|---|---|
| `q_push(c)` | Al final, si no está. |
| `q_push_wake(c)` | Al final si no está, y `kern_wake_one`. La usan el nacimiento y el despertar. |
| `q_remove(c)` | La saca de donde esté. |
| `q_pop` | Saca la primera (FIFO). |
| `q_wake(c)` | Si `P_WAITING` = 0, no terminó y nadie la ejecuta: `q_push_wake`. Si se está ejecutando, su remero la pone en la fila al volver. |

### 13.4 Ciclo de un remero (`run_all`)

`so/remos.inc:132-296`. Con el cerrojo tomado, mientras `finished` = 0:

1. **Elección.** `ROW_SPECIAL`: `most_holding`. `ROW_BOTH`: alterna un turno `most_holding` y uno de fila,
   empezando por `most_holding`. `ROW_LINE`: fila. Si `most_holding` no encuentra, se usa la fila.
   `most_holding` (`so/remos.inc:298-328`): si `held` = 0, ninguna; si no, la cabina con mayor `P_BLOCKS` (> 0)
   que no terminó, no espera y nadie ejecuta; en empate, la de menor índice.
2. **Fila vacía y alguien rema** (`rowing` ≠ 0): si se lo había despertado y no hay trabajo, `vain_wakes` += 1;
   duerme (especial en `kern_special`, los demás en `kern_change`).
3. **Fila vacía y nadie rema**: si ninguna cabina viva tiene `P_WAITING` ≠ 0 → `finished` = 1, despierta a todos y
   sale. Si alguna espera: si otro remero ya duerme en las campanas (`watch_in` = 1), duerme; si no,
   [`watch_wait`](05-nucleo-pantalla-teclado-vigia.md#1010-bucle-del-centinela-watch_wait) ([§13.6](#136-espera-sin-gasto)); si `watch_wait` no despertó a nadie, `nobody_signs`.
4. **Ejecutar** la cabina `b` si no terminó, no espera y nadie la ejecuta: `q_remove`, turno = `P_QUANTUM`,
   `switches` += 1, `P_RUNNING` = 1, `rowing` += 1; suelta el cerrojo; ajusta prioridad por huecos;
   `run_process`; toma el cerrojo; si hay cabinas durmiendo en la pantalla, `screen_due`; `P_RUNNING` = 0,
   `rowing` −= 1, `P_SERVED` += ejecutadas, `clock` += ejecutadas.
5. **Después del turno**: terminación forzada por `P_KILL` o presupuesto ([§9.6](#96-fin-de-una-cabina-secuencia-completa)). Si sigue viva: si espera, queda
   fuera de la fila; si no, `q_push` (sin despertar a otro) y, si sostiene firmas (`P_BLOCKS` > 0),
   `kern_wake_special`. Si terminó: rehacer o fin ([§9.6](#96-fin-de-una-cabina-secuencia-completa)).

Las cabinas no comparten estado salvo por la ventanilla; el orden entre cabinas y el valor `t=` del informe dependen
del ritmo de los remeros (`so/remos.inc:18-19`).

### 13.5 Corte del turno y última parte

**Corte por evento.** Tras un `jsys` con `sched_dirty` = 1 (un nacimiento por 16 o una firma por 17), el turno de
la cabina que tocó termina en ese punto: `P_BUDGET0` −= lo no usado, presupuesto = 0, `P_CUT` = 1
(`so/janaxos.asm:2189-2194`). Un turno cortado no se extiende por última parte.

**Última parte** (`end_table`, `so/remos.inc:474-527`): por palabra, la cantidad de instrucciones hasta un [`jhalt`](01-idioma-janax.md#103-salida-de-jhalt)
por camino recto (instrucciones que sólo caen a la siguiente), 0 si no hay tal camino; con una entrada extra 0 al
final. Clasificación por código de operación:

| Códigos | Clase |
|---|---|
| 00h | `jhalt`: vale 1. |
| 01h–0Bh, 0Fh, 10h–13h, 1Ah–1Bh | Caen: valen 1 + el valor de la siguiente si éste es > 0; si no, 0. |
| 0Ch–0Eh, 14h–19h, ≥ 1Ch | No es camino recto: 0. |

Al agotarse el turno sin corte, si el valor `u` de la próxima palabra cumple 0 < `u` ≤ `tail_limit`, la cabina
recibe `u` instrucciones más y termina sin ceder el remo (`so/janaxos.asm:1856-1871`, `so/rutinas.inc:197-214`).

### 13.6 Espera sin gasto

Una cabina con `P_WAITING` > 0 no está en la fila y no se ejecuta. `P_WAITING` = cantidad de condiciones de su
último toque; cada condición resuelta lo decrementa y, al llegar a 0, `q_wake` la devuelve a la fila.

| Causa de espera | Se registra en | Se resuelve por | Fuente |
|---|---|---|---|
| Firma pendiente (clase importante) | Registro de firma estado 0 | 17 del padre, sombra, `line_end` del hijo del núcleo, `nobody_signs` | `so/janaxos.asm:4498-4523`, `so/janaxos.asm:5118-5140`, `so/janaxos.asm:4228-4253` |
| 29 sin saludos | `P_GWAIT` = 1 | Un saludo (28, 30, timbre de firma o de fin de hijo) o `greet_nobody` | `so/ambientes.inc:1527-1538`, `so/ambientes.inc:1486-1491` |
| 41 sin eventos | `P_SCRW` = 1, plazo `P_SCRDL` | Evento de pantalla, vencimiento del plazo, un saludo | `so/janaxos.asm:2875-2923`, `so/janaxos.asm:2996-3003` |

Cuando nadie rema y hay esperas, un único remero duerme en `watch_wait` (`so/ambientes.inc:1676-1820`) sobre
`WaitForMultipleObjects` con las campanas de la carpeta del sistema, del tablero, de las carpetas de
`JANAX_VIGIA` y de la pantalla, con un plazo igual al menor tiempo restante de las cabinas que esperan un evento de
pantalla (o el que exige el vigía) o infinito. El detalle es del [capítulo 05](05-nucleo-pantalla-teclado-vigia.md#1010-bucle-del-centinela-watch_wait). No existe en el núcleo ningún
temporizador periódico de planificación: los remeros sólo se despiertan por nacimientos, despertares, firmas,
saludos y campanas del anfitrión (derivado de [§13.2-13.6](#132-cerrojo-y-variables-de-condición)).

### 13.7 Terminación del sistema

`finished` = 1 cuando nadie rema, la fila está vacía y ninguna cabina viva espera (`so/remos.inc:171-189`). Cada
remero sale de su ciclo; el hilo principal vuelve de `row` y el núcleo escribe sus informes finales ([§3.7](#37-salida-estándar-del-núcleo-y-códigos-de-salida)).

---

## 14. Invariantes de seguridad

| Invariante | Fuente |
|---|---|
| Una cabina nunca tiene más derechos de portero que su padre: sus microporteros cuelgan de los del padre y sus derechos se recortan con AND. | `so/janaxos.asm:1290-1311`, `so/janaxos.asm:3889-3903` |
| Una verificación de portero falla si cualquier nodo en la subida está revocado o carece del derecho. | `so/janaxos.asm:3806-3828` |
| Una cabina nunca escapa del prefijo de etiqueta de sus ancestros: cada nodo con prefijo en la subida debe aceptar la etiqueta. | `so/janaxos.asm:3103-3132` |
| Un hijo de una cabina no ejecuta un pedido importante sin la firma de su padre, de su sombra o de la herencia de su línea; ninguna de ellas omite los porteros. Excepción derivada del código: el caso mixto de [§7.2](#72-algoritmo-de-un-toque) (dos entradas de la misma clase en un toque, una firmada y otra rechazada). | `so/janaxos.asm:2314-2346` |
| Nadie hereda firmas que no tiene: la máscara de 45 se recorta con `signed_mask` del que la da. | `so/janaxos.asm:4273-4275` |
| Nadie se da más bolita que la recibida al nacer; un hijo nace con la bolita actual de su padre. | `so/janaxos.asm:5199-5204`, `so/janaxos.asm:4473-4474` |
| El núcleo sólo lee o escribe en salas de la cabina con trato de lectura y escritura, y dentro de una sola sala. | `so/ambientes.inc:655-704` |
| Una cabina sólo direcciona su propio cartel; las direcciones de salas destruidas fallan hasta que la numeración reempieza. | `so/ambientes.inc:67-98`, `so/ambientes.inc:518-522` |
| Una cabina no puede quitarse la escritura ni destruir la sala donde está la cola en curso. | `so/ambientes.inc:552-557`, `so/ambientes.inc:587-592` |
| Ningún trato concedido supera el techo con que se recibió la caja. | `so/ambientes.inc:597-601`, `so/ambientes.inc:918-923` |
| Un ayudante no usa la ventanilla. | `so/janaxos.asm:2226-2227` |
| `jhost` no ofrece nada: catálogo vacío. | `so/anfitrion.inc:1-30` |
| Una falla de una cabina sólo termina a esa cabina (y, por `line_end`, a su descendencia). | `so/janaxos.asm:1903-1906`, `so/janaxos.asm:5092-5169` |

Quién puede pedir qué en los pedidos de este capítulo:

| Pedido | Objetivo permitido | Respuesta si no |
|---|---|---|
| 16 lanzar | Una etiqueta que su portero de archivos deja leer | −1 |
| 17 firmar | Un registro del que es firmante, en espera | −1 |
| 18 pendientes | Sus propios registros como firmante | — |
| 19 estado | Un hijo propio | −2 |
| 20 bolita | Sí misma, hasta su tope | — |
| 33 terminar | Un hijo propio | −2 |
| 34 presupuesto | Un hijo propio | −2 |
| 35 remado | Sí misma (−1) o un hijo propio | −2 |
| 36 rehacerse | Sí misma, con una etiqueta que puede leer | −1 |
| 42 huecos | Sí misma o un hijo propio | −2 |
| 45 herencia | Su próximo hijo (0) o un hijo propio | −2 |
| 46 nombrar | Una cabina viva cuyo padre desciende de ella o es su hijo | −2 |

---

## 15. Constantes y límites

| Constante | Valor | Significado | Fuente |
|---|---|---|---|
| `MAX_PROGRAM` | 1 MiB | Bytes máximos leídos de un programa o de un archivo de datos | `so/janaxos.asm:35` |
| `DATA_SIZE` | 1 MiB | Declarada "debe coincidir con el intérprete"; sin uso en la memoria por salas (derivado) | `so/janaxos.asm:36` |
| `RET_DEPTH` | 4096 | Entradas máximas de la pila de retorno | `so/janaxos.asm:37` |
| `ROOM_MAX` | 2^32 | Bytes máximos de una sala | `so/janaxos.asm:40` |
| `OP_COUNT` | 1Dh | Códigos de operación | `so/janaxos.asm:41` |
| `FOREVER` | 7FFFFFFFFFFFFFFFh | Sin límite | `so/janaxos.asm:42` |
| `PROC_SIZE` | 688 | Bytes del bloque de proceso | `so/janaxos.asm:115` |
| `DOORS` | 3 | Puertas | `so/janaxos.asm:123` |
| `NODE_SIZE` | 48 | Bytes por nodo de portero | `so/janaxos.asm:130` |
| `KINDS` | 47 | Clases de pedido | `so/janaxos.asm:161` |
| `REC_SIZE` | 40 | Bytes por registro de firma | `so/janaxos.asm:242` |
| `HOST_PATH` | 260 | Capacidad de una ruta ANSI del anfitrión | `so/janaxos.asm:285` |
| `WIDE_CAP` / `NORM_CAP` | 1024 / 4096 | Etiqueta en UTF-16 / normalizada en bytes | `so/janaxos.asm:373-374` |
| `DATA_LABEL` | 512 | Etiqueta de datos | `so/janaxos.asm:371` |
| `HW_MAX` | 61 | Carpetas de `JANAX_VIGIA` | `so/janaxos.asm:308` |
| `PRIO_DEFAULT` | 64881 | Bolita por omisión (0,99) | `so/janaxos.asm:464` |
| `PLAN_BUDGET` | 100000 | Instrucciones máximas del planificador por turno calculado (criterio) | `so/ayudantes.inc:10` |
| `ROWER_STACK` | 10000h | Pila reservada por remero | `so/remos.inc:21` |
| `ROOM_ENTRY` | 32 | Bytes por entrada de cartel | `so/ambientes.inc:39` |
| `DOWRY_SIZE` | 32 | Bytes por caja de dote | `so/ambientes.inc:848` |
| `CODE_ENDED` / `CODE_SPENT` | 9 / 10 | Códigos de terminación forzada | `so/janaxos.asm:4593-4594` |
| `THREAD_PRIORITY_TIME_CRITICAL` / `THREAD_PRIORITY_IDLE` | 15 / −15 | Prioridades del anfitrión usadas | `so/janaxos.asm:520-521` |
| `SAL_TOP` | 10 | Salas informadas por `JANAX_SALAS` | `so/janaxos.asm:429` |

---

## 16. Puntos no verificados

1. Que una variable de entorno definida con valor vacío cuente como ausente (comportamiento de
   `GetEnvironmentVariableA`).
2. El efecto de un `JANAX_ARCHIVOS` o `JANAX_TABLERO` de 259 caracteres o más (la llamada devuelve el tamaño
   requerido y el código lo usa como largo).
3. El modo de redondeo de `cvtsd2si` al calcular `plan_c16` (se asume el del procesador por omisión).
4. La equivalencia exacta, instrucción por instrucción, del motor traducido con los otros dos.
5. El comportamiento de `arrancar.exe` cuando su carpeta contiene espacios (derivado: argumentos partidos).
6. Que los bits de trato 50 y 52-63 no se usen fuera de `so/`.
7. La existencia transitoria de una sombra ([§10.5](#105-sombra)) en ejecución real.
8. Que una entrada rechazada por firma se atienda igual cuando otra entrada de la misma clase del mismo toque fue
   firmada ([§7.2](#72-algoritmo-de-un-toque), despacho por clase): se deduce del código, no se observó en ejecución.
9. El contenido de `env_value` cuando `JANAX_CAMBIO`, `JANAX_REMOS` o `JANAX_MOTOR` tienen 31 caracteres o más: la
   llamada devuelve el tamaño requerido (distinto de 0) sin garantía de haber escrito el búfer; `JANAX_MOTOR` sale
   con 4, las otras dos se analizan sobre el contenido previo del búfer.
