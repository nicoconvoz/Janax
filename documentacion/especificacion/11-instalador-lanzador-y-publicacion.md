# 11. Instalador, lanzador y publicación

Este capítulo especifica las piezas que ponen el sistema en la máquina de un usuario y lo publican: el lanzador
`luma.exe` (exclusión mutua, rutas derivadas de su propia ubicación, variables de entorno, línea de comando del núcleo,
registro, logotipo en ventana con forma, espera de la ventana, señal de dormir y renacimiento), el instalador
`instalar-luma.exe` (elección de carpeta, carpetas creadas, formato de paquete y descompresión, ensamblado de Luma con
PDP en la máquina destino, accesos directos, conservación de una instalación previa), los guiones que arman el
instalador y sus recursos gráficos, y la cadena de publicación (páginas generadas desde `documentacion/`, numeración
de versiones, metadatos de cita y archivo en Zenodo). No cubre: el idioma Janax ([cap. 01](01-idioma-janax.md#01-el-idioma-janax-máquina-virtual-codificación-e-instrucciones)), el ensamblador PDP y la
construcción por punto fijo ([cap. 02](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas)), el arranque del núcleo, su memoria y sus procesos ([cap. 03](03-nucleo-arranque-memoria-procesos.md#03-núcleo-janaxos-arranque-memoria-procesos-firmas-y-planificación)), la semántica de
cada pedido al núcleo y la nomenclatura de archivos del sistema ([cap. 04](04-nucleo-abi-de-pedidos.md#04-núcleo-janaxos-abi-de-pedidos-llamadas-al-sistema)), la ventana `JanaxPantalla`, el teclado y el
[vigía del anfitrión](05-nucleo-pantalla-teclado-vigia.md#10-vigía-y-centinela) ([cap. 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn)), la lectura de Razar ([cap. 06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)), el cardumen y su [canto](07-razar-cardumen-canto-hilos.md#27-el-canto-con-canta) ([cap. 07](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez)), el cuerpo de Luma y su
[casa](08-luma-cuerpo-procesos-y-casa.md#8-formato-de-la-casa) ([cap. 08](08-luma-cuerpo-procesos-y-casa.md#08-luma-cuerpo-generadores-procesos-y-formato-de-su-casa)), la conversación ([cap. 09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta)) ni la pantalla y la vida de Luma ([cap. 10](10-luma-pantalla-lluvia-y-organos-vivos.md#10-luma-pantalla-lluvia-hexadecimal-panel-criaturas-y-órganos-vivos)). Cuando una pieza de este capítulo
depende de un comportamiento descrito en otro, se nombra el capítulo y la fuente.

## 11.1 Convenciones y fuentes

### 11.1.1 Fuentes

| Pieza | Fuente | Herramienta de construcción |
|---|---|---|
| Lanzador `luma.exe` | `razar/instalador/luma.asm` | FASM, `format PE64 GUI 5.0` (`razar/instalador/luma.asm:16`) |
| Instalador `instalar-luma.exe` | `razar/instalador/instalar.asm` | FASM, `format PE64 GUI 5.0` (`razar/instalador/instalar.asm:25`) |
| Armado de la carpeta `instalador/` | `razar/instalador/armar_instalador.py` | Python 3 con `ctypes` (usa `cabinet.dll` del anfitrión) |
| Íconos y mapa de bits del logotipo | `razar/logo/armar_icono.py` | Python 3 con PIL |
| Logotipo fuente `logo.png` | `razar/logo/armar_logo.py` | Python 3 con PIL |
| Instrucciones para el usuario | `instalador/LEEME.txt` | texto escrito a mano; `armar_instalador.py` no lo toca (`razar/instalador/armar_instalador.py:21`) |
| Páginas del sitio | `documentacion/armar_paginas.py` | Python 3, sólo biblioteca estándar |
| Metadatos de cita | `CITATION.cff`, `.zenodo.json` | editados a mano |

Ambos ejecutables incluyen `win64w.inc` de FASM (variante Unicode: las llamadas `invoke` a funciones `...W` reciben
cadenas UTF-16) (`razar/instalador/luma.asm:19`, `razar/instalador/instalar.asm:28`).

### 11.1.2 Convenciones de este capítulo

- Las rutas del anfitrión se escriben con `\`. `<dir>` es la carpeta que contiene `luma.exe`, terminada en `\`;
  `<padre>` es la carpeta que contiene a `<dir>`, terminada en `\`; `<base>` es la carpeta elegida al instalar,
  terminada en `\`.
- `etiqueta(s)` es el nombre con que Janax guarda en su carpeta del sistema el archivo de nombre lógico `s`: los bytes
  UTF-8 de `s` escritos en hexadecimal en minúsculas, dos dígitos por byte
  (`razar/instalador/armar_instalador.py:54`; la misma regla en `so/herramientas/armar.sh:15`). La nomenclatura
  completa está en el [capítulo 04](04-nucleo-abi-de-pedidos.md#102-de-etiqueta-a-nombre-de-archivo). Ejemplo verificable en el código: `etiqueta("dormir") = 646f726d6972`
  (`razar/instalador/luma.asm:38`).
- Las constantes numéricas de Windows se dan con su nombre simbólico y el valor literal que figura en el código.

### 11.1.3 Disposición de una instalación

Resultado de una instalación completa en `<base>` (derivado de `razar/instalador/instalar.asm:208-216, 237-353`):

```
<base>
├── Luma\
│   ├── luma.exe                         lanzador
│   ├── luma.log                         salida del núcleo (la crea luma.exe en cada nacimiento)
│   ├── bin\
│   │   ├── janaxos.exe                  núcleo
│   │   ├── luma.bin                     Luma, ensamblada en la máquina destino
│   │   ├── pulso.datos                  datos ensamblados de pulso.datos.jsm
│   │   ├── armado.log                   salida del ensamblado
│   │   └── pdp\
│   │       ├── ensamblador.bin          semilla del ensamblador PDP
│   │       ├── ensamblador.datos        su tabla
│   │       ├── planificador.bin         planificador de fábrica
│   │       └── fuentes\                 carpeta del sistema usada para ensamblar (archivos con nombre etiqueta)
│   └── casa\                            carpeta del sistema de Luma (archivos con nombre etiqueta)
└── Comida\                              carpeta vigilada por el núcleo (JANAX_VIGIA)
```

Escritorio del usuario (`CSIDL_DESKTOPDIRECTORY`): `Luma.lnk` y `Comida de Luma.lnk` ([§11.5.9](#1159-accesos-directos)).

Ninguna ruta absoluta se escribe en archivo alguno de la instalación, salvo dentro de los dos accesos directos `.lnk`,
que guardan su destino absoluto (`razar/instalador/instalar.asm:339-353`). `luma.exe` deriva todas sus rutas de su
propia ubicación ([§11.2.3](#1123-derivación-de-rutas)); mover `Luma\` y `Comida\` juntas conserva el funcionamiento del lanzador, no el de los
accesos directos (inferido de lo anterior; no verificado en ejecución).

## 11.2 Lanzador `luma.exe`: datos, rutas y entorno

### 11.2.1 Constantes

| Nombre | Valor | Significado | Fuente |
|---|---|---|---|
| `MAXP` | 700 | Capacidad, en unidades UTF-16, de cada búfer de ruta. | `razar/instalador/luma.asm:21` |
| `LADO` | 720 | Lado en píxeles de la ventana del logotipo; debe coincidir con el `LADO` de `armar_icono.py` (`razar/logo/armar_icono.py:9`). En `armar_icono.py` está declarado como criterio, no medición. | `razar/instalador/luma.asm:22` |
| `CLAVE` | `0FF00FFh` | Color clave en formato `COLORREF` (`0x00bbggrr`): rojo 255, verde 0, azul 255. Debe coincidir con `CLAVE = (255, 0, 255)` de `razar/logo/armar_icono.py:18`. | `razar/instalador/luma.asm:23` |
| `VER` | 2000 | Milisegundos mínimos que el logotipo permanece visible desde que se mostró. Declarado como criterio, no medición. | `razar/instalador/luma.asm:25` |

### 11.2.2 Cadenas y búferes

| Etiqueta | Contenido (UTF-16, terminado en 0) | Uso | Fuente |
|---|---|---|---|
| `s_mutex` | `LumaVera.una` | Nombre del mutex de instancia única. | `razar/instalador/luma.asm:30` |
| `s_class` | [`JanaxPantalla`](05-nucleo-pantalla-teclado-vigia.md#52-clase-de-ventana) | Clase de la ventana del núcleo (`so/pantalla.inc:19`). | `razar/instalador/luma.asm:31` |
| `s_casa` | `casa` | Subcarpeta de la casa. | `:32` |
| `s_comida` | `Comida` | Carpeta de comida, hermana de `<dir>`. | `:33` |
| `s_kernel` | `bin\janaxos.exe` | Núcleo, relativo a `<dir>`. | `:34` |
| `s_qluma` | `" luma.bin` | Cierre de comillas y argumento del núcleo. | `:35` |
| `s_bin` | `bin\` | Carpeta de trabajo del núcleo. | `:36` |
| `s_log` | `luma.log` | Registro. | `:37` |
| `s_senal` | `casa\646f726d6972` | Archivo señal `etiqueta("dormir")`. | `:38` |
| `s_e_arch` | `JANAX_ARCHIVOS` | Variable de entorno. | `:39` |
| `s_e_vig` | `JANAX_VIGIA` | Variable de entorno. | `:40` |
| `s_e_fondo` | `JANAX_VENTANA_FONDO` | Variable de entorno. | `:41` |
| `s_uno` | `1` | Valor de `JANAX_VENTANA_FONDO`. | `:42` |
| `s_q` | `"` | Comilla inicial de la línea de comando. | `:43` |
| `s_tit` | `Luma` | Título del cuadro de error. | `:44` |
| `s_falta` | `No pude despertar a Luma: falta bin\janaxos.exe o bin\luma.bin al lado de este programa.` | Texto del cuadro de error. | `:45` |
| `s_static` | `STATIC` | Clase de la ventana del logotipo. | `:69` |

Búferes UTF-16 de `MAXP` unidades: `dir`, `padre`, `casad`, `bind`, `arch`, `ruta`, `senal`, `logp`; `cmd` tiene
`3 * MAXP` = 2100 unidades (`razar/instalador/luma.asm:47-55`). Ninguna concatenación (`lstrcatW`) comprueba
capacidad.

Estado: `sa` es un `SECURITY_ATTRIBUTES` de 24 bytes con `bInheritHandle = 1` (`razar/instalador/luma.asm:57-59`);
`sinf` (`STARTUPINFO`), `pinf` (`PROCESS_INFORMATION`), `hmutex`, `hlog`, `hcambio`, `vez` (0 hasta el primer
nacimiento, 1 después), `hventana`, `pidv`, `manijas` (dos manijas para la espera múltiple), `hlogo`, `hbmp`, `t0`
(instante en que se mostró el logotipo, `GetTickCount64`) y `msg` (`razar/instalador/luma.asm:60-73`).

### 11.2.3 Derivación de rutas

Algoritmo (`razar/instalador/luma.asm:116-153`):

1. `GetModuleFileNameW(NULL, dir, MAXP - 40)` (capacidad 660 unidades).
2. Se recorre `dir` y se recuerda la posición del último `\`. Si no hay ninguno, el programa termina
   (`ExitProcess(0)`) sin hacer nada. Si lo hay, se escribe un 0 inmediatamente después: `dir = <dir>`.
3. `padre = arriba(copia de dir)`. La rutina `arriba` (`razar/instalador/luma.asm:89-104`) busca el último `\` que
   no es el final de la cadena y corta después de él. Si `dir` contiene un solo `\` (por ejemplo `C:\`), `padre`
   queda igual a `dir`.
4. Se construyen:

| Búfer | Valor | Destino |
|---|---|---|
| `casad` | `<dir>casa` (sin `\` final) | Carpeta observada por el aviso de cambios ([§11.3.5](#1135-vigilancia-de-la-señal-de-dormir)). |
| `arch` | `casad` con cada `\` sustituido por `/` (rutina `barras`, `razar/instalador/luma.asm:78-86`) | Valor de `JANAX_ARCHIVOS`. |
| `ruta` | `<padre>Comida` | Valor de `JANAX_VIGIA` (conserva `\`). |
| `senal` | `<dir>casa\646f726d6972` | Archivo señal de dormir. |
| `logp` | `<dir>luma.log` | Registro. |
| `cmd` | `"<dir>bin\janaxos.exe" luma.bin` | Línea de comando del núcleo. |
| `bind` | `<dir>bin\` | Carpeta de trabajo del núcleo. |

### 11.2.4 Variables de entorno que fija

Se fijan con `SetEnvironmentVariableW` en el bloque de entorno del propio lanzador; el núcleo las hereda porque
`CreateProcessW` recibe `lpEnvironment = NULL` (`razar/instalador/luma.asm:169`).

| Variable | Valor | Momento | Efecto en el núcleo | Fuente |
|---|---|---|---|---|
| `JANAX_ARCHIVOS` | `<dir>casa` con `/` | Antes del primer nacimiento | [Carpeta del sistema](04-nucleo-abi-de-pedidos.md#101-carpetas). El núcleo la lee con `GetEnvironmentVariableA` en un búfer de `HOST_PATH - 1` = 259 bytes (terminador incluido: el valor cabe entero si mide 258 bytes o menos); si falta, usa `janax_archivos` (relativa a la carpeta de trabajo); la crea con `CreateDirectoryA` si no existe. | `razar/instalador/luma.asm:138`; `so/janaxos.asm:283-285, 697-708, 716` |
| `JANAX_VIGIA` | `<padre>Comida` | Antes del primer nacimiento | Carpetas del anfitrión vigiladas, separadas por `;`, leídas con `GetEnvironmentVariableW` en un búfer de `HW_RAW - 1` = 32767 unidades UTF-16; si el valor mide 32767 unidades o más, no se vigila ninguna carpeta ([cap. 05](05-nucleo-pantalla-teclado-vigia.md#102-configuración)). | `razar/instalador/luma.asm:141`; `so/janaxos.asm:307-310`; `so/vigia.inc:18-20` |
| `JANAX_VENTANA_FONDO` | `1` | Después del primer nacimiento ([§11.3.3](#1133-primer-nacimiento-espera-de-la-ventana-y-paso-al-frente)) | Cualquier valor no vacío: la ventana nace con `SetWindowPos(h, 1 /* HWND_BOTTOM */, 0, 0, 0, 0, 53h)` (`53h` = `SWP_NOSIZE` 1 + `SWP_NOMOVE` 2 + `SWP_NOACTIVATE` 10h + `SWP_SHOWWINDOW` 40h) en lugar de `ShowWindow(h, SW_SHOW)`. | `razar/instalador/luma.asm:208`; `so/pantalla.inc:18, 212-215, 374-379` |

El lanzador no fija ni borra ninguna otra variable: las demás que lee el núcleo (`JANAX_TABLERO`, `JANAX_CAMBIO`,
`JANAX_MOTOR`, `JANAX_REMOS`, `JANAX_SALAS`, `JANAX_SIN_VENTANA`; `so/janaxos.asm:290, 425-426, 469, 567`;
`so/pantalla.inc:17`) llegan al núcleo con el valor que tengan en el entorno del proceso que inició `luma.exe`, porque
el bloque de entorno se hereda completo (inferido de `lpEnvironment = NULL`; no verificado en ejecución).

Consecuencias del código del núcleo sobre estas rutas:

- `JANAX_ARCHIVOS` se lee en la página de códigos ANSI del anfitrión y está limitada a 258 bytes más el terminador
  (`so/janaxos.asm:285, 697`). Una carpeta de instalación con caracteres no representables en esa página de códigos,
  o más larga, no produce una carpeta del sistema correcta (inferido; no verificado en ejecución).
- `JANAX_VIGIA` se lee en UTF-16 y no tiene esa limitación de página de códigos; su límite es de 32766 unidades
  (`so/vigia.inc:18-20`).

### 11.2.5 Línea de comando del núcleo y carpeta de trabajo

El núcleo toma su [línea de comando](03-nucleo-arranque-memoria-procesos.md#35-línea-de-comandos) con `GetCommandLineA`, salta el nombre del programa (entre comillas si empieza con
`"`) y parte el resto en cada espacio, sin interpretar comillas: cada fragmento no vacío es la ruta de un programa
(`so/janaxos.asm:858-930`). Por eso el lanzador:

- pone entre comillas sólo la ruta del ejecutable del núcleo, que puede contener espacios;
- pasa el programa como nombre relativo sin espacios, `luma.bin`;
- inicia el proceso con `lpCurrentDirectory = <dir>bin\`, de modo que `luma.bin` se resuelva en `<dir>bin\luma.bin`
  (`razar/instalador/luma.asm:146-153, 169`).

El núcleo busca los [datos iniciales](04-nucleo-abi-de-pedidos.md#104-datos-iniciales-datos) de un programa en el archivo hermano con la extensión sustituida por `.datos`
(`so/datos.inc:10-42`); para `luma.bin` ese archivo es `luma.datos`, que la instalación no crea.

## 11.3 Lanzador `luma.exe`: comportamiento

### 11.3.1 Instancia única

1. `CreateMutexW(NULL, FALSE, "LumaVera.una")`; la manija se guarda en `hmutex` y no se cierra explícitamente: se
   libera al terminar el proceso (`razar/instalador/luma.asm:108-109`).
2. Si `GetLastError()` = 183 (`ERROR_ALREADY_EXISTS`), se ejecuta `al_frente` y el programa termina con código 0
   (`razar/instalador/luma.asm:110-114`).
3. `al_frente` (`razar/instalador/luma.asm:332-343`): `FindWindowW("JanaxPantalla", NULL)`; si hay ventana,
   `ShowWindow(h, 3)` (`SW_MAXIMIZE`) y `SetForegroundWindow(h)`.

Propiedades que se siguen del código:

- El nombre no lleva prefijo `Global\`: la exclusión vale dentro de la sesión del usuario.
- El mutex existe mientras vive el lanzador que lo creó, no mientras vive el núcleo. Si el lanzador termina por otra
  causa y el núcleo sigue vivo, una nueva ejecución arranca otro núcleo (inferido; no verificado en ejecución).
- `al_frente` busca por clase: elige la primera ventana `JanaxPantalla` de la sesión, sea o no de Luma. La búsqueda por
  proceso ([§11.3.4](#1134-ventana-del-proceso-su_ventana)) sólo se usa dentro del lanzador que creó el núcleo.

### 11.3.2 Nacimiento

Etiqueta `.nacer` (`razar/instalador/luma.asm:156-176`), ejecutada en el primer arranque y en cada renacimiento:

1. `DeleteFileW(senal)`: se borra una señal de dormir anterior.
2. `CreateFileW(logp, GENERIC_WRITE, 3, &sa, CREATE_ALWAYS, 0, NULL)`: el registro se trunca en cada nacimiento; se
   comparte para lectura y escritura (`3` = `FILE_SHARE_READ | FILE_SHARE_WRITE`) y la manija es heredable. El
   resultado no se comprueba.
3. `STARTUPINFO` en cero; `cb = sizeof(STARTUPINFO)`; `dwFlags = 100h` (`STARTF_USESTDHANDLES`);
   `hStdOutput = hStdError = hlog`; `hStdInput = NULL`.
4. `CreateProcessW(NULL, cmd, NULL, NULL, TRUE, 08000000h, NULL, bind, &sinf, &pinf)`. `08000000h` es
   `CREATE_NO_WINDOW`: el núcleo es un programa de consola y no se le crea consola; su salida estándar va al registro.
5. `CloseHandle(hlog)` en el lanzador (el núcleo conserva su copia heredada).
6. Si `CreateProcessW` falló: se cierra el logotipo, se muestra `MessageBoxW(NULL, s_falta, "Luma", 10h)`
   (`MB_ICONERROR`) y el programa termina con código 0.

El contenido de `luma.log` es la salida estándar y de error del núcleo ([cap. 03](03-nucleo-arranque-memoria-procesos.md#37-salida-estándar-del-núcleo-y-códigos-de-salida)); el lanzador no lo lee.

### 11.3.3 Primer nacimiento: espera de la ventana y paso al frente

Sólo cuando `vez = 0`; se pone `vez = 1` (`razar/instalador/luma.asm:177-208`).

1. Contador `ebx = 240`. En cada vuelta: [`bombea`](#1141-ventana-del-logotipo); [`su_ventana`](#1134-ventana-del-proceso-su_ventana); si devolvió una ventana, ir al paso 2; si no,
   `WaitForSingleObject(hProcess, 250)`: si devuelve 0 (`WAIT_OBJECT_0`, el núcleo terminó) ir a `.termino`;
   decrementar; si llega a 0, ir al paso 4. Cota de la espera: 240 × 250 ms = 60 s más el tiempo de las
   enumeraciones.
2. Mientras `GetTickCount64() - t0 < VER` y `hlogo ≠ 0`: `bombea`; `WaitForSingleObject(hProcess, 100)`; si el
   núcleo terminó, `.termino`.
3. [`logo_cerrar`](#1141-ventana-del-logotipo); `ShowWindow(hventana, 3)` (`SW_MAXIMIZE`); `SetForegroundWindow(hventana)`.
4. `.fondo`: `logo_cerrar` (idempotente); `SetEnvironmentVariableW("JANAX_VENTANA_FONDO", "1")`. A partir de aquí todo
   renacimiento hereda la variable y su ventana nace detrás de las demás sin tomar el teclado.

Si la espera del paso 1 se agota, la ventana no se maximiza ni se trae al frente.

### 11.3.4 Ventana del proceso: `su_ventana`

`su_ventana` (`razar/instalador/luma.asm:250-274`) pone `hventana = 0`, llama a `EnumWindows(una_ventana, 0)` y
devuelve `hventana`. `una_ventana` obtiene el identificador de proceso de cada ventana de nivel superior con
`GetWindowThreadProcessId`; si es igual a `pinf.dwProcessId` y `IsWindowVisible` es distinto de cero, guarda la
ventana y devuelve 0 para cortar la enumeración; en otro caso devuelve 1. Resultado: la primera ventana visible de
nivel superior del proceso del núcleo lanzado, sin mirar su clase.

### 11.3.5 Vigilancia de la señal de dormir

Etiquetas `.cuidar` y `.mira` (`razar/instalador/luma.asm:209-224`):

1. `hcambio = FindFirstChangeNotificationW(casad, FALSE, 1)`: carpeta `<dir>casa`, sin subárbol, filtro
   `FILE_NOTIFY_CHANGE_FILE_NAME` (creación, borrado o renombre de archivos). El resultado no se comprueba.
2. Bucle:
   1. Si `GetFileAttributesW(senal) ≠ -1` (el archivo existe), ir a `.dormir`.
   2. `WaitForMultipleObjects(2, {hProcess, hcambio}, FALSE, INFINITE)`.
   3. Si devuelve 0 (terminó el núcleo), ir a `.termino`.
   4. En otro caso `FindNextChangeNotification(hcambio)` y volver a 2.1.

La comprobación precede a la espera, de modo que una señal creada antes de armar el aviso se detecta. No hay
temporizador: el lanzador sólo despierta por la terminación del núcleo o por un cambio de nombres en la casa.

Caso de fallo no tratado: si `FindFirstChangeNotificationW` devuelve `INVALID_HANDLE_VALUE` (por ejemplo, porque
`<dir>casa` no existe), `WaitForMultipleObjects` devuelve `WAIT_FAILED` (`0FFFFFFFFh`), que no es 0, y el bucle
repite `FindNextChangeNotification` y la espera sin bloquearse: espera activa hasta que aparezca la señal o termine el
núcleo (inferido del código y del contrato del anfitrión; no verificado en ejecución). En la instalación normal la
carpeta existe, porque la crea el instalador ([§11.5.5](#1155-carpetas)) y el núcleo (`so/janaxos.asm:716`).

Quién crea la señal: el programa [`luma.jsm`](08-luma-cuerpo-procesos-y-casa.md#2-generación-de-lumajsm) escribe el archivo de nombre lógico [`dormir`](08-luma-cuerpo-procesos-y-casa.md#71-dormir) (6 bytes, armado en un
registro como `72696D726F64h`) en su carpeta del sistema en dos rutinas:

- [`fr_sleep`](08-luma-cuerpo-procesos-y-casa.md#71-dormir) (`razar/cuerpo/luma.jsm:63995-64032`), cuando decide dormir: primero guarda su estado
  (`jcall r_free_save`, `:64012`), después escribe la señal y sigue ejecutando (`jjmp fr_rest`, `:64032`).
- [`fr_nomem`](08-luma-cuerpo-procesos-y-casa.md#72-falta-de-memoria) (`razar/cuerpo/luma.jsm:64033-64059`), cuando un pedido de memoria no puede atenderse: escribe la señal
  sin guardar estado y se detiene con `j0 = 0BADh` y `jhalt` (`:64058-64059`).

El detalle del guardado pertenece al [capítulo 08](08-luma-cuerpo-procesos-y-casa.md#71-dormir).

### 11.3.6 Dormir y renacer

Etiquetas `.dormir`, `.espera`, `.cerrada` (`razar/instalador/luma.asm:225-240`):

1. `su_ventana`; si hay ventana, `PostMessageW(h, 10h, 0, 0)` (`WM_CLOSE`). El procedimiento de ventana del núcleo
   no trata `WM_CLOSE` y lo pasa a `DefWindowProcW`, que destruye la ventana; ante `WM_DESTROY` anota el evento para
   los programas y llama a `PostQuitMessage(0)`, lo que termina el bucle de mensajes de la ventana
   (`so/pantalla.inc:386-392, 400-446, 549-550`; [cap. 05](05-nucleo-pantalla-teclado-vigia.md#58-cierre-y-fin-del-sistema)).
2. `WaitForSingleObject(hProcess, 40000)`. Si el núcleo termina dentro de 40 s, ir al paso 4.
3. Si no: `TerminateProcess(hProcess, 1)` y `WaitForSingleObject(hProcess, 5000)`. El código no justifica los valores
   40000 y 5000 ms con una medición (criterio sin medición declarada).
4. `FindCloseChangeNotification(hcambio)`; `CloseHandle` de la manija del proceso y del hilo; volver a `.nacer`
   ([§11.3.2](#1132-nacimiento)). Como `vez = 1`, el nuevo nacimiento va directo a [§11.3.5](#1135-vigilancia-de-la-señal-de-dormir), sin logotipo, sin espera de ventana y con
   `JANAX_VENTANA_FONDO=1` heredado.

Invariante: en ningún momento el lanzador tiene dos núcleos vivos; el renacimiento sólo se inicia tras la terminación
(o terminación forzada y espera) del anterior. Si tras los 5000 ms el proceso forzado aún no terminó, el código no lo
comprueba y lanza el nuevo igualmente.

### 11.3.7 Fin

`.termino` (`razar/instalador/luma.asm:241-244`): `logo_cerrar`, cierre de las manijas del proceso y del hilo, y
`ExitProcess(0)` (`:245-246`). Se llega aquí cuando el núcleo termina por sí mismo (por ejemplo, porque el usuario
cerró la ventana), tanto en la espera de la ventana como en la vigilancia. El lanzador termina siempre con código 0.

### 11.3.8 Máquina de estados

| Estado | Entrada | Evento | Acción | Siguiente |
|---|---|---|---|---|
| `INICIO` | arranque | mutex ya existe | `al_frente` | `FIN` |
| `INICIO` | arranque | mutex nuevo; sin `\` en la ruta propia | — | `FIN` |
| `INICIO` | arranque | mutex nuevo | rutas, entorno, `logo_mostrar` | `NACER` |
| `NACER` | — | `CreateProcessW` falla | `logo_cerrar`, cuadro de error | `FIN` |
| `NACER` | — | `CreateProcessW` correcto, `vez = 0` | `vez = 1` | `ESPERA_VENTANA` |
| `NACER` | — | `CreateProcessW` correcto, `vez = 1` | — | `VIGILA` |
| `ESPERA_VENTANA` | 240 vueltas de hasta 250 ms | ventana visible del proceso | — | `MUESTRA_LOGO` |
| `ESPERA_VENTANA` | | núcleo terminó | — | `TERMINO` |
| `ESPERA_VENTANA` | | 240 vueltas agotadas | `logo_cerrar`, `JANAX_VENTANA_FONDO=1` | `VIGILA` |
| `MUESTRA_LOGO` | vueltas de hasta 100 ms | `t ≥ VER` o sin logotipo | `logo_cerrar`, maximizar, al frente, `JANAX_VENTANA_FONDO=1` | `VIGILA` |
| `MUESTRA_LOGO` | | núcleo terminó | — | `TERMINO` |
| `VIGILA` | aviso de cambios armado | existe la señal | — | `DORMIR` |
| `VIGILA` | | núcleo terminó | — | `TERMINO` |
| `VIGILA` | | cambio de nombres en la casa | `FindNextChangeNotification` | `VIGILA` |
| `DORMIR` | `WM_CLOSE` a su ventana | núcleo termina en ≤ 40 s | cierre de manijas | `NACER` |
| `DORMIR` | | 40 s sin terminar | `TerminateProcess(1)`, espera ≤ 5 s, cierre de manijas | `NACER` |
| `TERMINO` | — | — | `logo_cerrar`, cierre de manijas | `FIN` |
| `FIN` | — | — | `ExitProcess(0)` | — |

## 11.4 Lanzador `luma.exe`: logotipo y recursos

### 11.4.1 Ventana del logotipo

`logo_mostrar` (`razar/instalador/luma.asm:279-308`), llamada una sola vez antes del primer nacimiento:

1. `t0 = GetTickCount64()`.
2. `LoadImageW(GetModuleHandleW(NULL), MAKEINTRESOURCE(30), 0, 0, 0, 0)`: tipo `IMAGE_BITMAP` (0), tamaño natural,
   sin banderas. Si falla, la rutina vuelve sin ventana (`hlogo = 0`).
3. Posición: `x = (GetSystemMetrics(0) - 720) >> 1`, `y = (GetSystemMetrics(1) - 720) >> 1` (desplazamiento
   aritmético; `SM_CXSCREEN`, `SM_CYSCREEN`). En una pantalla menor que 720 píxeles la coordenada es negativa.
4. `CreateWindowExW(80088h, "STATIC", NULL, 9000000Eh, x, y, 720, 720, NULL, NULL, NULL, NULL)`:

| Campo | Valor | Descomposición |
|---|---|---|
| Estilo extendido | `80088h` | `WS_EX_LAYERED` (80000h) + `WS_EX_TOOLWINDOW` (80h, no aparece en la barra de tareas) + `WS_EX_TOPMOST` (8h) |
| Estilo | `9000000Eh` | `WS_POPUP` (80000000h, sin marco) + `WS_VISIBLE` (10000000h) + `SS_BITMAP` (0Eh) |

5. `SetLayeredWindowAttributes(hlogo, 0FF00FFh, 0, 1)`: `LWA_COLORKEY`; los píxeles de color `CLAVE` no se dibujan, de
   modo que la ventana toma la silueta del dibujo.
6. `SendMessageW(hlogo, 172h, 0, hbmp)`: `STM_SETIMAGE` con `IMAGE_BITMAP`.
7. `UpdateWindow(hlogo)`.

`bombea` (`razar/instalador/luma.asm:321-329`) vacía la cola de mensajes del hilo con
`PeekMessageW(&msg, NULL, 0, 0, PM_REMOVE)` y `DispatchMessageW`, sin `TranslateMessage`; sólo se llama dentro de las
esperas de [§11.3.3](#1133-primer-nacimiento-espera-de-la-ventana-y-paso-al-frente), que es cuando la ventana del logotipo existe.

`logo_cerrar` (`razar/instalador/luma.asm:309-320`): si `hlogo ≠ 0`, `DestroyWindow` y `hlogo = 0`; si `hbmp ≠ 0`,
`DeleteObject` y `hbmp = 0`. Es idempotente.

El logotipo desaparece por la primera de dos condiciones: que la ventana del núcleo exista y hayan pasado `VER` ms
desde `t0`, o que se agote la espera de ventana ([§11.3.3](#1133-primer-nacimiento-espera-de-la-ventana-y-paso-al-frente)). No desaparece por tiempo solo.

### 11.4.2 Recursos del ejecutable

Sección `.rsrc` (`razar/instalador/luma.asm:391-400`), todos con `LANG_NEUTRAL`:

| Tipo | Identificador | Archivo fuente | Formato del archivo (medido sobre los archivos del repositorio) |
|---|---|---|---|
| `RT_ICON` | 1 | `luma-16.ico` | ICO de una imagen, 16×16, 32 bits por píxel, DIB |
| `RT_ICON` | 2 | `luma-32.ico` | ICO de una imagen, 32×32, 32 bpp, DIB |
| `RT_ICON` | 3 | `luma-48.ico` | ICO de una imagen, 48×48, 32 bpp, DIB |
| `RT_ICON` | 4 | `luma-256.ico` | ICO de una imagen, 256×256 (ancho/alto 0 en el directorio), 32 bpp, DIB |
| `RT_GROUP_ICON` | 17 | grupo de los cuatro anteriores | macro `icon` de FASM |
| `RT_BITMAP` | 30 | `luma-logo.bmp` | BMP `BITMAPINFOHEADER` de 40 bytes, 720×720, altura positiva (filas de abajo hacia arriba), 24 bpp, `BI_RGB`, 1 555 254 bytes |

Los archivos se resuelven relativos a la carpeta de trabajo de FASM, que [`armar_instalador.py`](#117-armado-del-instalador-armar_instaladorpy) fija en
`razar/instalador/` (`razar/instalador/armar_instalador.py:25`). El mapa de bits viaja dentro del ejecutable; el
tamaño de `luma.exe` en `instalador/datos/` es 1 854 464 bytes.

### 11.4.3 Importaciones

| Biblioteca | Funciones | Fuente |
|---|---|---|
| `KERNEL32.DLL` | `CreateMutexW`, `GetLastError`, `GetModuleFileNameW`, `lstrcpyW`, `lstrcatW`, `SetEnvironmentVariableW`, `DeleteFileW`, `CreateFileW`, `CreateProcessW`, `CloseHandle`, `WaitForSingleObject`, `WaitForMultipleObjects`, `FindFirstChangeNotificationW`, `FindNextChangeNotification`, `FindCloseChangeNotification`, `GetFileAttributesW`, `TerminateProcess`, `GetTickCount64`, `GetModuleHandleW`, `ExitProcess` | `razar/instalador/luma.asm:352-372` |
| `USER32.DLL` | `FindWindowW`, `EnumWindows`, `GetWindowThreadProcessId`, `IsWindowVisible`, `ShowWindow`, `SetForegroundWindow`, `PostMessageW`, `MessageBoxW`, `LoadImageW`, `GetSystemMetrics`, `CreateWindowExW`, `SetLayeredWindowAttributes`, `SendMessageW`, `UpdateWindow`, `DestroyWindow`, `PeekMessageW`, `DispatchMessageW` | `:374-388` |
| `GDI32.DLL` | `DeleteObject` | `:349-350` |

`GetTickCount64` exige Windows Vista o posterior; la cabecera PE declara subsistema 5.0 (`format PE64 GUI 5.0`).

### 11.4.4 Generación de íconos y mapa de bits: `armar_icono.py`

Entrada: `razar/logo/logo.png` (RGBA). Salidas en `razar/instalador/` y `razar/logo/`
(`razar/logo/armar_icono.py:7-26`):

1. Para `n` en (16, 32, 48, 256): la imagen reducida a `n×n` con `LANCZOS` se guarda como `luma-<n>.ico` con un solo
   tamaño y `bitmap_format="bmp"` (`:12-13`).
2. `g` = la imagen reducida a 720×720 (`LADO`) con `LANCZOS` (`:19`).
3. `papel` = `g` compuesta por alfa sobre blanco opaco (255, 255, 255) (`:20`).
4. `fondo` = imagen RGB 720×720 llena de `CLAVE` = (255, 0, 255); se pega `papel` (convertida a RGB) con máscara
   binaria: alfa de `g` ≥ 128 → opaco, en otro caso transparente (`:21-22`). Un píxel pertenece al dibujo si su alfa
   es al menos la mitad; su color es el compuesto sobre blanco, para que ningún borde tome el color clave.
5. Aserción: `CLAVE` no aparece entre los colores de `papel`; si aparece, la generación falla (`:23`).
6. `fondo` se guarda como `luma-logo.bmp` (`:24`).
7. `logo.png` se guarda además como `razar/logo/logo.ico` con los tamaños 16, 24, 32, 48, 64, 128 y 256 (`:25`).

`logo.png` lo produce `razar/logo/armar_logo.py` (1024×1024 a partir de un lienzo de 2048, esquinas redondeadas con
radio `0.2·N`; `razar/logo/armar_logo.py:10, 69-75`). Su contenido gráfico no afecta a ningún protocolo.

## 11.5 Instalador `instalar-luma.exe`

### 11.5.1 Modos de invocación

| Invocación | Modo | Diálogos | Fuente |
|---|---|---|---|
| `instalar-luma.exe` | Interactivo (`callado = 0`) | Selector de carpeta, pregunta de conservación, errores, mensaje final | `razar/instalador/instalar.asm:201-207` |
| `instalar-luma.exe <carpeta>` | Silencioso (`callado = 1`) | Ninguno | `razar/instalador/instalar.asm:193-200` |

El modo se decide con `CommandLineToArgvW(GetCommandLineW(), &argc)`: si `argc ≥ 2`, `base = argv[1]` (copiado con
`lstrcpyW` sin comprobar longitud a un búfer de 700 unidades) y los demás argumentos se ignoran. El arreglo de
`CommandLineToArgvW` no se libera.

Códigos de salida: 0 en éxito o si el usuario cancela el selector; 1 en cualquier error de [§11.5.11](#11511-errores)
(`razar/instalador/instalar.asm:361-369`).

### 11.5.2 Constantes, cadenas y estructuras

`MAXP = 700` (`razar/instalador/instalar.asm:30`). Búferes UTF-16 de `MAXP` unidades: `aqui`, `datos`, `base`,
`lumad`, `comidad`, `bind`, `casad`, `pdpd`, `fuend`, `nombre`; `r1` y `r2` de `2 * MAXP` = 1400; `cmd` de
`4 * MAXP` = 2800 (`razar/instalador/instalar.asm:99-111`). La macro `une d, a, b` es `lstrcpyW(d, a)` seguido de
`lstrcatW(d, b)` (`:143-145`).

Nombres de archivo del paquete y de la instalación (`razar/instalador/instalar.asm:49-68`):

| Etiqueta | Valor | Etiqueta | Valor |
|---|---|---|---|
| `s_datos` | `datos\` | `s_kernel` | [`janaxos.exe`](02-ensamblador-pdp-y-construccion.md#202-núcleo-janaxosexe) |
| `s_luma` | `Luma\` | `s_lanza` | `luma.exe` |
| `s_comida` | `Comida` | `s_ens` | `ensamblador.bin` |
| `s_bin` | `bin\` | `s_ensd` | [`ensamblador.datos`](01-idioma-janax.md#89-tabla-de-nombres-ensambladordatos) |
| `s_casa` | `casa\` | `s_plan` | `planificador.bin` |
| `s_pdp` | `pdp\` | `s_pfuen` | `fuentes.paquete` |
| `s_fuen` | `fuentes\` | `s_pcasa` | `casa.paquete` |
| `s_q` | `"` | `s_lumab` | `luma.bin` |
| `s_qens` | `" ensamblador.bin` | `s_pulso` | `pulso.datos` |
| `s_bs` | `\` (no usada) | `s_log` | `armado.log` |

Nombres etiqueta usados (`razar/instalador/instalar.asm:70-80`; cada valor es `etiqueta(nombre lógico)`):

| Etiqueta | Nombre lógico | Uso |
|---|---|---|
| `s_h_luma` | `PDP/razar/cuerpo/luma.bin` | Resultado del ensamblado de `luma.jsm`. |
| `s_h_pulso` | `PDP/razar/lectura/pulso.datos` | Resultado del ensamblado de `pulso.datos.jsm`. |
| `s_h_mpb` | `PDP/razar/cardumen/memoria_pares.bin` | Resultado del ensamblado de `memoria_pares.jsm`. |
| `s_h_mpd` | `PDP/razar/cardumen/memoria_pares.datos` | Resultado del ensamblado de `memoria_pares.datos.jsm`. |
| `s_h_lect` | `luma/lectora.bin` | Copia de `luma.bin` en la casa. |
| `s_h_pens` | `luma/pensadora.bin` | Copia de `luma.bin` en la casa. |
| `s_h_molde` | `luma/lectora.molde` | Copia de `pulso.datos` en la casa. |
| `s_h_cab` | `luma/canto.bin` | Copia de `memoria_pares.bin` en la casa. |
| `s_h_cad` | `luma/canto.datos` | Copia de `memoria_pares.datos` en la casa. |
| `s_h_vida` | [`vida-memoria`](08-luma-cuerpo-procesos-y-casa.md#891-vida-lista-vida-memoria) | Marca de que en la casa vive una Luma. |

Textos para el usuario (`razar/instalador/instalar.asm:34-47, 86-87`):

| Etiqueta | Uso | Texto |
|---|---|---|
| `s_tit` | Título de todos los cuadros | `Instalar a Luma` |
| `s_donde` | Título del selector de carpeta | `Elegi la carpeta donde instalar a Luma. Ahi se crean dos carpetas: "Luma" (ella) y "Comida" (lo que pongas ahi, se lo come).` |
| `s_ya` | Pregunta de conservación (tres líneas de texto y una en blanco) | `En esa carpeta ya hay una Luma, con lo que aprendio.` / `SI: conservo lo que sabe y solo actualizo el programa.` / `NO: reemplazo su conocimiento por el que trae este instalador.` |
| `s_listo` | Mensaje final (cinco líneas de texto y dos en blanco) | `Luma quedo instalada.` / `En el escritorio tenes dos accesos directos:` / `  Luma: la despierta.` / `  Comida de Luma: lo que pongas en esa carpeta, se lo come.` / `Queres despertarla ahora?` |
| `s_e_datos` | Error | `No encuentro la carpeta "datos" al lado de este instalador. Tiene que estar junto a el, como vino.` |
| `s_e_copia` | Error | `No pude copiar los archivos a esa carpeta. Fijate que se pueda escribir ahi.` |
| `s_e_paq` | Error | `No pude desempacar uno de los paquetes del instalador.` |
| `s_e_arma` | Error | `Su ensamblador no pudo armar a Luma. No se instalo.` |
| `s_d1` | Descripción de `Luma.lnk` | `Despierta a Luma` |
| `s_d2` | Descripción de `Comida de Luma.lnk` | `Lo que se pone aca, Luma se lo come. Nada mas del disco.` |

Las líneas se separan con CR LF (13, 10); los textos no llevan tildes.

`binfo` es un `BROWSEINFOW` de 64 bytes (`razar/instalador/instalar.asm:113-118`):

| Desplazamiento | Tamaño | Campo | Valor |
|---|---|---|---|
| 0 | 8 | `hwndOwner` | 0 |
| 8 | 8 | `pidlRoot` | 0 (raíz del espacio de nombres) |
| 16 | 8 | `pszDisplayName` | `nombre` |
| 24 | 8 | `lpszTitle` | `s_donde` |
| 32 | 4 | `ulFlags` | `41h` = `BIF_RETURNONLYFSDIRS` (1) + `BIF_NEWDIALOGSTYLE` (40h) |
| 36 | 4 | relleno | 0 |
| 40 | 8 | `lpfn` | 0 |
| 48 | 8 | `lParam` | 0 |
| 56 | 4 | `iImage` | 0 |
| 60 | 4 | relleno | 0 |

`sa` es el mismo `SECURITY_ATTRIBUTES` heredable que en el lanzador (`:119-121`). GUID de COM
(`:89-97`): `CLSID_ShellLink` = {00021401-0000-0000-C000-000000000046}, `IID_IShellLinkW` =
{000214F9-0000-0000-C000-000000000046}, `IID_IPersistFile` = {0000010B-0000-0000-C000-000000000046}.

### 11.5.3 Ubicación propia y carpeta de destino

1. `CoInitialize(NULL)` (`razar/instalador/instalar.asm:175`).
2. `GetModuleFileNameW(NULL, aqui, MAXP - 60)` (640 unidades); corte después del último `\`; si no hay `\`, fin con
   código 0 (`:177-190`). `datos = <aqui>datos\` (`:191`).
3. Carpeta de destino: modo silencioso, `argv[1]`; modo interactivo, `SHBrowseForFolderW(&binfo)`: si devuelve
   `NULL` (cancelado), fin con código 0; `SHGetPathFromIDListW(pidl, base)`: si falla, fin con código 0
   (`:201-207`). El PIDL no se libera.
4. `con_barra(base)` (`:159-171`): si la cadena está vacía o no termina en `\`, se le agrega `\`.
5. Rutas derivadas (`:211-216`):

| Búfer | Valor |
|---|---|
| `lumad` | `<base>Luma\` |
| `comidad` | `<base>Comida` |
| `bind` | `<base>Luma\bin\` |
| `casad` | `<base>Luma\casa\` |
| `pdpd` | `<base>Luma\bin\pdp\` |
| `fuend` | `<base>Luma\bin\pdp\fuentes\` |

### 11.5.4 Comprobaciones previas

1. Paquete presente: si `GetFileAttributesW(<datos>janaxos.exe) = -1`, error `s_e_datos` (`:218-223`). Es la única
   comprobación de que la carpeta `datos\` existe; los demás archivos se comprueban al copiarlos.
2. Luma existente (`:226-236`): si existe `<casad>` + `etiqueta("vida-memoria")`, `conserva = 1`. En modo interactivo
   se pregunta `MessageBoxW(NULL, s_ya, s_tit, 24h)` (`MB_YESNO | MB_ICONQUESTION`); si la respuesta no es 6
   (`IDYES`), `conserva = 0`. En modo silencioso se conserva siempre.

### 11.5.5 Carpetas

`CreateDirectoryW(p, NULL)` en este orden: `base`, `lumad`, `comidad`, `bind`, `casad`, `pdpd`, `fuend`
(`razar/instalador/instalar.asm:238-244`). Los resultados se ignoran (una carpeta ya existente no es error). No se
crean carpetas intermedias de `base`: si su padre no existe, los pasos siguientes fallan en la copia.

### 11.5.6 Copia de los ejecutables y la semilla

Rutina `copia` (`razar/instalador/instalar.asm:372-380`): `CopyFileW(r1, r2, FALSE)` (sobrescribe); si falla, error
`s_e_copia`. Copias (`:246-260`):

| Origen | Destino |
|---|---|
| `<datos>janaxos.exe` | `<bind>janaxos.exe` |
| `<datos>luma.exe` | `<lumad>luma.exe` |
| `<datos>ensamblador.bin` | `<pdpd>ensamblador.bin` |
| `<datos>ensamblador.datos` | `<pdpd>ensamblador.datos` |
| `<datos>planificador.bin` | `<pdpd>planificador.bin` |

El instalador no detiene una Luma en ejecución. `CopyFileW` sobre un ejecutable en uso falla, lo que produce
`s_e_copia` (comportamiento del anfitrión; no verificado en ejecución).

`ensamblador.datos` queda junto a `ensamblador.bin` porque el núcleo carga como [datos iniciales](04-nucleo-abi-de-pedidos.md#104-datos-iniciales-datos) el archivo hermano de
extensión `.datos` (`so/datos.inc:10-42`). El núcleo no lee `pdp\planificador.bin` por esa ruta: usa el planificador
de etiqueta `PDP/so/nucleo/planificador.bin` de la carpeta del sistema o, si falta, el de fábrica incrustado en el
propio núcleo (`so/ayudantes.inc:5-8`; `so/janaxos.asm:444-446`). El consumidor de `<pdpd>planificador.bin` no se
identificó en el código (sólo lo copian `razar/instalador/instalar.asm:258-260` y `razar/instalador/armar_instalador.py:29`).

### 11.5.7 Ensamblado de Luma en la máquina destino

Protocolo (`razar/instalador/instalar.asm:262-313`):

1. `CreateDecompressor(2, NULL, &hdec)`: `COMPRESS_ALGORITHM_MSZIP`. El resultado no se comprueba.
2. `desempaca(<datos>fuentes.paquete, fuend)` ([§11.6.3](#1163-descompresión-desempaca)).
3. `JANAX_ARCHIVOS` = `fuend` con `/` y sin la barra final (`:267-272`); `JANAX_CAMBIO` = `0` (`:273`).
   `JANAX_CAMBIO` fija el costo de cambio de contexto en lugar de medirlo al arrancar (`so/janaxos.asm:796-812`;
   [cap. 03](03-nucleo-arranque-memoria-procesos.md#41-origen-de-c)). El límite de 258 bytes ANSI de [§11.2.4](#1124-variables-de-entorno-que-fija) se aplica aquí a `<base>Luma/bin/pdp/fuentes`, que es la ruta más
   larga que recibe el núcleo: con `<base>` de `B` bytes, mide `B + 20` (`razar/instalador/instalar.asm:211-216, 267-272`).
4. `cmd = "<bind>janaxos.exe" ensamblador.bin` (`:274-277`): mismo motivo que en [§11.2.5](#1125-línea-de-comando-del-núcleo-y-carpeta-de-trabajo).
5. Registro `<bind>armado.log`, abierto con `CREATE_ALWAYS`, compartido (3) y heredable (`:279-281`).
6. `STARTUPINFO` como en [§11.3.2](#1132-nacimiento); `CreateProcessW(NULL, cmd, NULL, NULL, TRUE, CREATE_NO_WINDOW, NULL, pdpd, ...)`:
   carpeta de trabajo `<pdpd>`, donde `ensamblador.bin` se resuelve (`:282-291`). Si falla, error `s_e_arma`.
7. `WaitForSingleObject(hProcess, INFINITE)`; cierre de manijas (`:296-298`).
8. Se borran del entorno `JANAX_ARCHIVOS` y `JANAX_CAMBIO` (`SetEnvironmentVariableW(nombre, NULL)`) (`:299-300`).
9. `CopyFileW(<fuend>etiqueta("PDP/razar/cuerpo/luma.bin"), <bind>luma.bin, FALSE)` y
   `CopyFileW(<fuend>etiqueta("PDP/razar/lectura/pulso.datos"), <bind>pulso.datos, FALSE)`; si alguna falla, error
   `s_e_arma` (`:301-313`).

Qué ensambla el ensamblador: todo programa fuente `.jsm` presente en la carpeta del sistema, con salida de nombre
`X.bin` para `X.jsm` y `X.ext` para `X.ext.jsm`; el registro `j0` al terminar es la cantidad de fuentes armadas sin
error (`so/herramientas/armar.sh:58-64`; [cap. 02](02-ensamblador-pdp-y-construccion.md#15-protocolo-de-una-corrida-del-ensamblador)). Con el paquete de fuentes de [§11.7.3](#1173-paquete-de-fuentes) se producen
`luma.bin`, `pulso.datos`, `memoria_pares.bin` y `memoria_pares.datos`.

Criterio de éxito implementado: sólo la existencia (copia posible) de `luma.bin` y `pulso.datos`. El instalador no
lee el código de salida del núcleo, no lee `armado.log` y no comprueba `j0`; un ensamblado parcial que produzca esos
dos archivos se acepta. Si faltan `memoria_pares.bin` o `memoria_pares.datos`, el fallo aparece después como
`s_e_copia` ([§11.5.8](#1158-conocimiento-y-archivos-de-la-casa)).

### 11.5.8 Conocimiento y archivos de la casa

1. Si `conserva = 0`: `desempaca(<datos>casa.paquete, casad)` (`:316-321`).
2. Siempre, mediante `copia` (`:324-338`):

| Origen | Destino |
|---|---|
| `<bind>luma.bin` | `<casad>etiqueta("luma/lectora.bin")` |
| `<bind>luma.bin` | `<casad>etiqueta("luma/pensadora.bin")` |
| `<bind>pulso.datos` | `<casad>etiqueta("luma/lectora.molde")` |
| `<fuend>etiqueta("PDP/razar/cardumen/memoria_pares.bin")` | `<casad>etiqueta("luma/canto.bin")` |
| `<fuend>etiqueta("PDP/razar/cardumen/memoria_pares.datos")` | `<casad>etiqueta("luma/canto.datos")` |

Qué se conserva cuando ya hay una Luma:

| Conjunto | `conserva = 1` | `conserva = 0` |
|---|---|---|
| Ejecutables y semilla ([§11.5.6](#1156-copia-de-los-ejecutables-y-la-semilla)) | sobrescritos | sobrescritos |
| `bin\luma.bin`, `bin\pulso.datos`, `fuentes\` | sobrescritos | sobrescritos |
| Los cinco archivos de la tabla anterior en `casa\` | sobrescritos | sobrescritos |
| Archivos de `casa\` incluidos en `casa.paquete` | intactos | sobrescritos con los del paquete |
| Archivos de `casa\` no incluidos en `casa.paquete` | intactos | intactos (no se borran) |

El modo "reemplazo" es por lo tanto una superposición: el instalador nunca borra archivos de la casa ni de
`fuentes\` (`razar/instalador/instalar.asm:383-457` sólo crea o trunca). Tampoco borra `luma.log`.

### 11.5.9 Accesos directos

1. `SHGetFolderPathW(NULL, 10h, NULL, 0, nombre)`: `CSIDL_DESKTOPDIRECTORY`, `SHGFP_TYPE_CURRENT`; escritorio del
   usuario actual (`:340`). El resultado no se comprueba.
2. Rutina `acceso` (`razar/instalador/instalar.asm:460-499`), con `rsi` = destino, `rdi` = archivo `.lnk`,
   `r12` = carpeta de trabajo, `r13` = descripción:

| Paso | Llamada | Índice en la vtabla |
|---|---|---|
| 1 | `CoCreateInstance(CLSID_ShellLink, NULL, 1, IID_IShellLinkW, &psl)` (`CLSCTX_INPROC_SERVER`) | — |
| 2 | `IShellLinkW::SetPath(rsi)` | 20 |
| 3 | `IShellLinkW::SetWorkingDirectory(r12)` | 9 |
| 4 | `IShellLinkW::SetDescription(r13)` | 7 |
| 5 | `IShellLinkW::QueryInterface(IID_IPersistFile, &ppf)` | 0 |
| 6 | `IPersistFile::Save(rdi, TRUE)` | 6 |
| 7 | `IPersistFile::Release()` | 2 |
| 8 | `IShellLinkW::Release()` | 2 |

   Cualquier fallo de COM se ignora en silencio (no hay error para el usuario). No se fija ícono: el acceso usa el del
   destino (para `luma.exe`, el grupo 17 de [§11.4.2](#1142-recursos-del-ejecutable)).

3. Los dos accesos (`:341-353`):

| Archivo | Destino | Carpeta de trabajo | Descripción |
|---|---|---|---|
| `<escritorio>\Luma.lnk` | `<lumad>luma.exe` | `<lumad>` | `s_d1` |
| `<escritorio>\Comida de Luma.lnk` | `<comidad>` (carpeta) | `<comidad>` | `s_d2` |

### 11.5.10 Cierre

Modo silencioso: `ExitProcess(0)`. Modo interactivo: `MessageBoxW(NULL, s_listo, s_tit, 44h)`
(`MB_YESNO | MB_ICONINFORMATION`); si la respuesta es 6 (`IDYES`),
`ShellExecuteW(NULL, NULL, <lumad>luma.exe, NULL, <lumad>, 1)` (`SW_SHOWNORMAL`); después `ExitProcess(0)`
(`razar/instalador/instalar.asm:354-362`).

### 11.5.11 Errores

Rutina `error` (`razar/instalador/instalar.asm:365-369`): en modo interactivo muestra `MessageBoxW(NULL, rdx, s_tit,
10h)` (`MB_ICONERROR`); en ambos modos termina con `ExitProcess(1)`. No hay limpieza ni vuelta atrás: lo copiado o
desempacado hasta el fallo queda en disco.

| Texto | Condición | Fuente |
|---|---|---|
| `s_e_datos` | Falta `<datos>janaxos.exe`. | `:218-223` |
| `s_e_copia` | Falla cualquier `CopyFileW` hecho por `copia`. | `:372-380` |
| `s_e_paq` | Falla abrir, proyectar, reservar memoria, descomprimir, crear o escribir durante `desempaca`. | `:456-457` |
| `s_e_arma` | Falla `CreateProcessW` del ensamblado o la copia de `luma.bin` o `pulso.datos`. | `:291-295, 301-313` |

Los fallos de `CoInitialize`, `CommandLineToArgvW`, `CreateDirectoryW`, `CreateDecompressor`, `CreateFileW` de
`armado.log`, `GetFileSizeEx`, `SHGetFolderPathW` y de las llamadas COM no producen error. El código de salida del
proceso de ensamblado no se consulta.

### 11.5.12 Importaciones

| Biblioteca | Funciones | Fuente |
|---|---|---|
| `KERNEL32.DLL` | `GetModuleFileNameW`, `GetCommandLineW`, `lstrcpyW`, `lstrcatW`, `lstrlenW`, `GetFileAttributesW`, `CreateDirectoryW`, `CopyFileW`, `SetEnvironmentVariableW`, `CreateFileW`, `GetFileSizeEx`, `CreateFileMappingW`, `MapViewOfFile`, `UnmapViewOfFile`, `VirtualAlloc`, `VirtualFree`, `WriteFile`, `CreateProcessW`, `WaitForSingleObject`, `CloseHandle`, `ExitProcess` | `razar/instalador/instalar.asm:505-526` |
| `USER32.DLL` | `MessageBoxW` | `:528-529` |
| `SHELL32.DLL` | `CommandLineToArgvW`, `SHBrowseForFolderW`, `SHGetPathFromIDListW`, `SHGetFolderPathW`, `ShellExecuteW` | `:531-536` |
| `OLE32.DLL` | `CoInitialize`, `CoCreateInstance` | `:538-540` |
| `CABINET.DLL` | `CreateDecompressor`, `Decompress` | `:542-544` |

`CreateDecompressor` y `Decompress` (API de compresión de Windows) existen desde Windows 8; en sistemas anteriores la
carga del ejecutable falla por importación no resuelta (comportamiento del anfitrión; no verificado en ejecución). El
instalador no necesita en la máquina destino ningún intérprete ni intérprete de órdenes.

## 11.6 Formato de paquete

### 11.6.1 Estructura

Un paquete es una sucesión de entradas sin cabecera, sin contador y sin suma de verificación; termina donde termina
el archivo (`razar/instalador/armar_instalador.py:38-51`; lectura en `razar/instalador/instalar.asm:402-449`).
Entrada, con desplazamientos relativos a su inicio y enteros en little-endian:

| Desplazamiento | Tamaño | Campo | Descripción |
|---|---|---|---|
| 0 | 4 | `L` | Longitud del nombre en bytes (entero sin signo de 32 bits). |
| 4 | `L` | `nombre` | Nombre del archivo en ASCII, sin terminador. En los paquetes generados es siempre una etiqueta (dígitos hexadecimales en minúsculas). |
| 4 + `L` | 8 | `crudo` | Tamaño del archivo descomprimido (entero sin signo de 64 bits). |
| 12 + `L` | 8 | `pack` | Tamaño de los datos comprimidos (entero sin signo de 64 bits). |
| 20 + `L` | `pack` | datos | El archivo comprimido ([§11.6.2](#1162-compresión)). Si `crudo = 0`, `pack = 0` y no hay datos. |

La entrada siguiente empieza en `20 + L + pack`.

### 11.6.2 Compresión

- Algoritmo: API de compresión de Windows (`cabinet.dll`), `COMPRESS_ALGORITHM_MSZIP` = 2, sin la bandera
  `COMPRESS_RAW`, tanto al comprimir (`razar/instalador/armar_instalador.py:32-35, 45-47`) como al descomprimir
  (`razar/instalador/instalar.asm:262, 430`). En ese modo el bloque comprimido lleva una cabecera propia de la API; los
  cuatro primeros bytes del primer bloque de ambos paquetes publicados son `0A 51 E5 C0` (medido sobre
  `instalador/datos/`). La estructura interna de esa cabecera no está especificada en el código del proyecto
  (no verificado).
- Cada archivo se comprime como un único bloque con `Compress(H, d, len(d), out, len(out), &n)`; el búfer de salida
  mide `len(d) + len(d) // 8 + 65536` bytes (criterio sin medición declarada). Un fallo de `Compress` aborta el armado
  con el nombre del archivo.
- Un archivo vacío no se comprime: `crudo = pack = 0`.

### 11.6.3 Descompresión: `desempaca`

Entrada: `rsi` = ruta del paquete, `rdi` = carpeta destino terminada en `\` (`razar/instalador/instalar.asm:383-457`).

1. `CreateFileW(rsi, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL)`; `GetFileSizeEx`;
   `CreateFileMappingW(..., PAGE_READONLY (2), 0, 0, NULL)`; `MapViewOfFile(..., FILE_MAP_READ (4), 0, 0, 0)`.
   `GetFileSizeEx` no se comprueba. Un paquete de 0 bytes hace fallar `CreateFileMappingW` (comportamiento del
   anfitrión; no verificado en ejecución) y produce `s_e_paq`.
2. Mientras el cursor sea menor que el fin de la vista:
   1. `r2 = rdi` + nombre, convirtiendo cada byte del nombre a una unidad UTF-16 por extensión con ceros.
   2. Leer `crudo` y `pack`; los datos empiezan en el cursor + 4 + `L` + 16.
   3. Si `crudo ≠ 0`: `VirtualAlloc(NULL, crudo, 3000h, 4)` (`MEM_COMMIT | MEM_RESERVE`, `PAGE_READWRITE`);
      `Decompress(hdec, datos, pack, buf, crudo, &escrito)`; si falla, `s_e_paq`.
   4. `CreateFileW(r2, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, 0, NULL)`; si `crudo ≠ 0`,
      `WriteFile(h, buf, (DWORD) crudo, &escrito, NULL)`; `CloseHandle`; `VirtualFree(buf, 0, 8000h)` (`MEM_RELEASE`).
   5. Cursor += `pack`.
3. `UnmapViewOfFile`, `CloseHandle` de la proyección y del archivo.

Límites e invariantes que se siguen del código:

- No se valida que los campos de una entrada estén dentro de la vista: un paquete truncado o corrupto puede provocar
  lecturas fuera de ella.
- No se compara `escrito` con `crudo` tras la descompresión.
- `WriteFile` recibe el tamaño truncado a 32 bits: un archivo de 4 GiB o más se escribe incompleto.
- El nombre no puede contener separadores que creen subcarpetas: no se crean carpetas intermedias. Los paquetes
  generados usan nombres etiqueta planos.
- La longitud de `r2` (carpeta destino + nombre) no se comprueba contra sus 1400 unidades.

### 11.6.4 Contenido de los paquetes publicados (medido)

Medición sobre `instalador/datos/` del repositorio, analizando el formato de [§11.6.1](#1161-estructura):

| Paquete | Bytes | Entradas | Suma de `crudo` | Suma de `pack` | Entradas vacías | Mayor `crudo` |
|---|---|---|---|---|---|---|
| `fuentes.paquete` | 408 870 | 28 | 2 123 557 | 406 904 | 0 | 1 494 457 (`luma.jsm`) |
| `casa.paquete` | 19 035 281 | 351 | 97 495 375 | 19 011 861 | 2 | 32 444 160 |

Las entradas de `fuentes.paquete`, en el orden del archivo: `PDP/escalon0/janax.inc`, `PDP/escalon0/ventanita.inc`,
`PDP/escalon0/ventanita_datos.inc`, `PDP/so/ambientes.inc`, `PDP/so/anfitrion.inc`, `PDP/so/ayudantes.inc`,
`PDP/so/datos.inc`, `PDP/so/nativo.inc`, `PDP/so/pantalla.inc`, `PDP/so/remos.inc`, `PDP/so/rutinas.inc`,
`PDP/so/venn.inc`, `PDP/so/vigia.inc`, `PDP/so/nucleo/planificador.inc`, `PDP/so/pruebas/ambientes.inc`,
`PDP/razar/lectura/carpeta.inc`, `PDP/razar/lectura/casa.inc`, `PDP/razar/lectura/crece.inc`,
`PDP/razar/lectura/idioma.inc`, `PDP/razar/lectura/lectura.inc`, `PDP/razar/lectura/negacion.inc`,
`PDP/razar/lectura/organo.inc`, `PDP/razar/lectura/pistas.inc`, `PDP/razar/lectura/pulso.inc`,
`PDP/razar/cuerpo/luma.jsm`, `PDP/razar/lectura/pulso.datos.jsm`, `PDP/razar/cardumen/memoria_pares.jsm`,
`PDP/razar/cardumen/memoria_pares.datos.jsm` (nombres lógicos; en el paquete figuran como etiquetas). El contenido de
`casa.paquete` es la casa pública de Luma ([cap. 08](08-luma-cuerpo-procesos-y-casa.md#8-formato-de-la-casa)); aquí sólo interesa su formato.

## 11.7 Armado del instalador: `armar_instalador.py`

### 11.7.1 Invocación y parámetros

`python razar/instalador/armar_instalador.py [<casa pública>]` (`razar/instalador/armar_instalador.py:1-20`).

| Parámetro | Origen | Valor por defecto |
|---|---|---|
| `CASA` | `argv[1]` | Una ruta fija del entorno de desarrollo (`:18`). |
| `FASM` | variable de entorno `FASM` | Una ruta fija del entorno de desarrollo (`:19`). |
| `INCLUDE` | variable de entorno `INCLUDE` | `<carpeta de FASM>/INCLUDE` (`:23`). |
| `P` | — | Raíz del proyecto: dos niveles arriba del guion (`:17`). |

Precondiciones: `so/build/janaxos.exe` construido (`:28`); semilla de PDP en `so/pdp/semilla/` (`:29-30`; su vigencia
la garantiza la construcción del [cap. 02](02-ensamblador-pdp-y-construccion.md#20-construcción-reproducible)); `CASA` es una casa de Luma (aserción de [§11.7.4](#1174-paquete-de-la-casa)); Python en Windows con
`cabinet.dll` (`:32`).

### 11.7.2 Pasos

1. `SAL = <P>/instalador`, `DAT = <P>/instalador/datos`. `DAT` se borra entero y se recrea; lo demás de `SAL`
   (`LEEME.txt`, `.gitattributes`) no se toca (`:20-21`).
2. FASM ensambla `instalar.asm` → `instalador/instalar-luma.exe` y `luma.asm` → `instalador/datos/luma.exe`, con
   carpeta de trabajo `razar/instalador/` (donde están los íconos y el mapa de bits) y el entorno con `INCLUDE`; un
   código de salida distinto de 0 aborta mostrando la salida de FASM (`:24-26`).
3. Copia `so/build/janaxos.exe` y `so/pdp/semilla/{ensamblador.bin, ensamblador.datos, planificador.bin}` a `DAT`
   (`:28-30`).
4. Crea el compresor MSZIP (`:32-35`).
5. Arma `fuentes.paquete` ([§11.7.3](#1173-paquete-de-fuentes)) y `casa.paquete` ([§11.7.4](#1174-paquete-de-la-casa)).
6. Imprime, para cada paquete, la cantidad de archivos y los megabytes (10^6 bytes) sin comprimir y comprimidos, y
   luego el tamaño de cada archivo de `instalador/` (`:66, 72-75`).

`armar_icono.py` no se ejecuta desde aquí: los íconos y `luma-logo.bmp` deben existir ya en `razar/instalador/`.

### 11.7.3 Paquete de fuentes

(`razar/instalador/armar_instalador.py:55-66`)

1. Para cada raíz `escalon0`, `so`, `razar`, recorrido con `os.walk`, descartando subcarpetas llamadas `build` o cuyo
   nombre empieza con `.`: todo archivo `*.inc`, con nombre `etiqueta("PDP/" + ruta relativa a P con '/')`.
2. A continuación, en este orden: `razar/cuerpo/luma.jsm`, `razar/lectura/pulso.datos.jsm`,
   `razar/cardumen/memoria_pares.jsm`, `razar/cardumen/memoria_pares.datos.jsm`, con la misma regla de nombre.

El orden de los `.inc` es el del sistema de archivos (no se ordena). La regla equivale a la de
`so/herramientas/armar.sh:50-57`, salvo que `fd` en ese guion omite además los archivos ignorados por git y los
ocultos.

### 11.7.4 Paquete de la casa

(`razar/instalador/armar_instalador.py:68-72`)

1. Lista `sorted(os.listdir(CASA))` (orden lexicográfico de los nombres etiqueta).
2. Excluye el conjunto `FUERA` = etiquetas de `luma/lectora.bin`, `luma/pensadora.bin`, `luma/lectora.molde`
   (los escribe el instalador, [§11.5.8](#1158-conocimiento-y-archivos-de-la-casa)), `engranajes`, `dormir`, `pregunta` y `respuesta` (estado que Luma produce en
   ejecución; [cap. 08](08-luma-cuerpo-procesos-y-casa.md#8-formato-de-la-casa) y 10).
3. Aserción: alguna entrada es `etiqueta("vida-memoria")`; si no, el armado falla.
4. Empaqueta cada archivo con su nombre tal cual (ya es etiqueta).

`CASA` debe ser una carpeta plana: una subcarpeta haría fallar la lectura. La casa pública la produce
`razar/cuerpo/armar_luma_publica.py` ([cap. 08](08-luma-cuerpo-procesos-y-casa.md#9-herramientas-de-mantenimiento-de-la-casa)).

### 11.7.5 Contenido de `instalador/` (medido)

| Archivo | Bytes |
|---|---|
| `instalador/instalar-luma.exe` | 36 864 |
| `instalador/datos/janaxos.exe` | 328 704 |
| `instalador/datos/luma.exe` | 1 854 464 |
| `instalador/datos/ensamblador.bin` | 8 664 |
| `instalador/datos/ensamblador.datos` | 960 |
| `instalador/datos/planificador.bin` | 740 |
| `instalador/datos/fuentes.paquete` | 408 870 |
| `instalador/datos/casa.paquete` | 19 035 281 |
| `instalador/LEEME.txt` | escrito a mano |
| `instalador/.gitattributes` | `*.exe`, `*.paquete`, `*.bin`, `*.datos` con `-delta binary` |

`instalador/LEEME.txt` describe para el usuario los mismos pasos, el modo silencioso, la desinstalación (borrar las
dos carpetas y los dos accesos directos) y el aviso de SmartScreen por no estar firmado el ejecutable. El "medio
minuto" de duración que menciona no está medido en el código (no verificado).

## 11.8 Publicación

### 11.8.1 Numeración de versiones

- Formato `vM.mm` (o `v0.n`). El número de versión `N` es la concatenación de los dígitos: `N = 100·M + mm` para
  `M ≥ 1` (por ejemplo `v6.17` → 617, `v1.01` → 101) y `N = n` para `v0.n` (por ejemplo `v0.11` → 11).
- Regla observada en el repositorio: a partir de `v0.11`, cada versión es primo y las versiones son los primos
  consecutivos. Verificación: las 115 versiones distintas que aparecen como `documentacion/release-v*.md` o en los
  títulos `## Novedad (fecha, vX.YY)` de `README.md` son 0.3, 0.4, 0.5, 0.6, 0.7, 0.8 y los 109 primos de 11 a 617
  sin huecos (medido el 2026-11-27). Las versiones 0.4, 0.6 y 0.8 no son primos.
- Ningún programa del repositorio calcula ni valida la versión: la regla se aplica a mano (no hay código que la
  imponga).

### 11.8.2 Artefactos de una versión

Archivos que cambia una publicación (observado en el historial de git, commits `41268c9` y `aa97cad`):

| Archivo | Cambio | Cómo |
|---|---|---|
| `documentacion/release-vX.md` | Notas de la versión, con línea `DOI: [...]`. | A mano. |
| `documentacion/estado.md` | Línea de la versión. | A mano. |
| `README.md` | Línea 5: DOI de concepto y DOI de la versión actual; nueva sección `## Novedad (AAAA-MM-DD, vX.YY): título` con su DOI y enlace a las notas. | A mano. |
| `CITATION.cff` | Campo `version`. | A mano. |
| `.zenodo.json` | Campos `version` y `description`. | A mano. |
| `docs/index.html` | Página de entrada del sitio: versión y DOI de cada novedad. | A mano (no lo genera `armar_paginas.py`). |
| `docs/p/**`, `docs/sitemap.xml` | Páginas y mapa. | `documentacion/armar_paginas.py` ([§11.8.4](#1184-generación-de-páginas-armar_paginaspy)). |
| `instalador/**` | Instalador rearmado. | `razar/instalador/armar_instalador.py` ([§11.7](#117-armado-del-instalador-armar_instaladorpy)). |

### 11.8.3 Secuencia

Secuencia observada (los pasos 4 y 5 ocurren fuera del repositorio):

1. Commit de la versión con los artefactos de [§11.8.2](#1182-artefactos-de-una-versión); donde aún no se conoce el DOI de la versión se escribe el
   marcador `PENDIENTE<N>` (por ejemplo `PENDIENTE617`) como texto y como destino `https://doi.org/PENDIENTE<N>`
   (commit `41268c9`, `README.md`).
2. Generación de páginas con `armar_paginas.py`.
3. `git push` a la rama `master` del repositorio de GitHub.
4. Creación de un release de GitHub con etiqueta `vX.YY` (no verificado: no hay guion en el repositorio; la herramienta
   no figura en el código). En el clon local hay 66 etiquetas, de `v0.1` a `v2.93`; las posteriores no están
   presentes localmente.
5. Zenodo archiva el release mediante su integración con GitHub y asigna un DOI de versión bajo el DOI de concepto
   `10.5281/zenodo.23933883`, tomando los metadatos de `.zenodo.json` (no verificado: es comportamiento del servicio
   externo, sin código en el repositorio).
6. Commit `docs: DOI de la vX.YY` que sustituye los marcadores por el DOI asignado en `README.md`, `docs/index.html`,
   `documentacion/estado.md`, `documentacion/release-vX.md` y sus páginas generadas (commit `aa97cad`, siete archivos,
   once líneas).

### 11.8.4 Generación de páginas: `armar_paginas.py`

Constantes (`documentacion/armar_paginas.py:14-18`):

| Nombre | Valor |
|---|---|
| `RAIZ` | Raíz del proyecto (carpeta padre de `documentacion/`). |
| `SITIO` | `https://<cuenta>.github.io/Janax/` (GitHub Pages del repositorio). |
| `REPO` | `https://github.com/<cuenta>/Janax/blob/master/` |
| `CRUDO` | `https://raw.githubusercontent.com/<cuenta>/Janax/master/` |
| `SALIDA` | `<RAIZ>/docs/p` |

`<cuenta>` es la cuenta de GitHub que figura literalmente en el código.

Conjunto de documentos (`documentos`, `:21-29`): `CARTA-DEL-AUTOR.md`, `README.md` y, recorriendo `documentacion/`
con subcarpetas ordenadas y excluyendo en todo nivel las llamadas `archivo`, cada `*.md` en orden alfabético por
carpeta. Este capítulo y los demás de `documentacion/especificacion/` forman parte del conjunto.

Nombre de página (`pagina_de`, `:32-34`): se quita el prefijo `documentacion/` y `.md` pasa a `.html`; la página se
escribe en `docs/p/<nombre>`. `README.md` → `docs/p/README.html`.

Reescritura de enlaces (`enlace`, `:37-49`), en orden:

| Condición sobre el destino | Resultado |
|---|---|
| Empieza con esquema (`[a-z]+:`), `#` o `//` | Sin cambios. |
| Ruta relativa que, normalizada respecto de la carpeta del documento, es otro documento del conjunto | Ruta relativa a su página, conservando el fragmento `#...`. |
| Termina en `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg` o `.webp` (sin distinguir mayúsculas) | `CRUDO` + ruta (sin fragmento). |
| Cualquier otra | `REPO` + ruta + fragmento. |

Lector de Markdown (`a_html`, `:67-113`), por bloques, en este orden de prueba para cada línea:

| Bloque | Reconocimiento | Salida |
|---|---|---|
| Código | Línea que empieza con tres acentos graves; termina en la siguiente que empiece igual o al fin del texto. El lenguaje se ignora. | `<pre><code>` con escape HTML. |
| Título | `^(#{1,6})\s+(.*)$` | `<hN>`; el primero, sin `*` ni acentos graves, es el título de la página. |
| Tabla | Línea que empieza con barra vertical, seguida de una línea formada sólo por barras verticales, guiones, dos puntos y espacios (expresión de `armar_paginas.py:81`); continúa mientras las líneas empiecen con barra vertical. Las alineaciones se ignoran. | `<table>` con `<th>` en la primera fila. |
| Cita | Líneas consecutivas que empiezan con `>` | Un solo `<blockquote><p>` con las líneas unidas por espacio. |
| Lista | sangría opcional, luego `-`, `*` o dígitos seguidos de punto, luego espacio (expresión de `armar_paginas.py:93`); el tipo lo decide el primer elemento; una línea que empieza con dos espacios continúa el elemento anterior. Las listas anidadas se aplanan. | `<ul>` u `<ol>`. |
| Línea vacía o regla | Vacía, o formada por tres o más `-` o tres o más `*` (expresión de `armar_paginas.py:105`) | Nada, o `<hr>`. |
| Párrafo | Líneas no vacías hasta un inicio de otro bloque | `<p>` con las líneas unidas por espacio. |

Dentro de una línea (`en_linea`, `:52-64`): se separan los fragmentos de código en línea (no se procesan); el resto se
escapa (sin escapar comillas) y se aplican, en orden, imágenes `![alt](url)`, enlaces `[texto](url)` (la URL sin
espacios), `**negrita**` y `*cursiva*` (no adyacente a letras ni asteriscos).

Plantilla (`envolver`, `:122-126`): HTML5 con `lang="es"`, `charset="utf-8"`, `viewport`, título `<título> · Janax y
Razar`, hoja de estilo incrustada `ESTILO` (`:116-119`) y barra de navegación con enlaces a la raíz del sitio, al
índice de documentación y, si hay fuente, a `REPO + fuente`. Rutas relativas calculadas con `"../" × profundidad`.

Índice y mapa (`main`, `:134-150`):

1. Escribe una página por documento.
2. `docs/p/index.html`: sección "Documentos" con las páginas que no son notas de versión, en el orden del conjunto, y
   sección "Notas de cada versión" con las páginas `release-v[\d.]+.html` ordenadas por la tupla de sus números en
   orden descendente.
3. `docs/sitemap.xml` (esquema `http://www.sitemaps.org/schemas/sitemap/0.9`): `SITIO`, `SITIO + "p/index.html"` y una
   URL por página.
4. Escribe en UTF-8 con fin de línea LF (`:129-131`); sobrescribe lo que genera y no borra páginas de documentos que
   ya no existan.
5. No escribe `robots.txt` (`:5-6`).

Estado medido de `docs/`: `docs/index.html` (entrada escrita a mano, 1857 líneas), `docs/p/` con 144 páginas HTML
(143 documentos más el índice) en las subcarpetas `decisiones/`, `idioma/`, `razar/` (con `datos/` y `en-espera/`) y
`so/`, `docs/sitemap.xml` con 145 URL, y archivos estáticos (un audio `.mp3` y un texto) enlazados desde la entrada.

### 11.8.5 Metadatos de cita: `CITATION.cff`

Formato Citation File Format 1.2.0 (`CITATION.cff:1`). Campos presentes:

| Campo | Contenido | Fuente |
|---|---|---|
| `cff-version` | `1.2.0` | `CITATION.cff:1` |
| `message` | Pedido de cita, bilingüe. | `:2` |
| `title` | `Janax y Razar` | `:3` |
| `abstract` | Resumen de una oración. | `:4` |
| `type` | `software` | `:5` |
| `authors` | Una persona con `family-names` y `given-names`. | `:6-8` |
| `contact` | Una entidad con `name` y `email`. | `:9-11` |
| `license` | `Apache-2.0` | `:12` |
| `version` | Versión actual sin `v` (`"6.17"`). Se actualiza en cada publicación. | `:13` |
| `date-released` | Fecha ISO. En el historial observado no se actualiza en cada publicación (vale `2026-11-24` con `version` 6.17). | `:14` |
| `doi` | DOI de concepto `10.5281/zenodo.23933883` (todas las versiones). | `:15` |
| `repository-code` | URL del repositorio de GitHub. | `:16` |
| `keywords` | Siete términos. | `:17-24` |

### 11.8.6 Metadatos de Zenodo: `.zenodo.json`

Objeto JSON (`.zenodo.json:1-39`):

| Clave | Tipo | Contenido |
|---|---|---|
| `title` | cadena | Título largo del trabajo. |
| `description` | cadena HTML | Dos párrafos `<p>`: descripción en inglés con la novedad de la versión, y resumen en castellano. El primero se reescribe en cada publicación; el segundo no se actualiza (en la versión 6.17 todavía nombra la v5.57). |
| `upload_type` | cadena | `software` |
| `version` | cadena | Versión actual sin `v`, igual a la de `CITATION.cff`. |
| `creators` | arreglo | Un objeto con `name` en la forma `Apellido, Nombre`. |
| `license` | cadena | `Apache-2.0` |
| `keywords` | arreglo de cadenas | 23 términos. |
| `language` | cadena | `spa` |
| `notes` | cadena | Texto de contacto. |

El archivo no contiene identificadores de DOI: el DOI de versión lo asigna Zenodo ([§11.8.3](#1183-secuencia), paso 5).

### 11.8.7 Atributos de git para binarios

`.gitattributes` de la raíz marca `*.zip`, `*.mp3`, `*.mp4`, `*.ico` con `-delta binary`; `instalador/.gitattributes`
marca `*.exe`, `*.paquete`, `*.bin`, `*.datos` igual. Con `-delta`, git no busca diferencias entre versiones de esos
archivos al empaquetar. `.gitignore` excluye, entre otros, `log_*.txt`, `*.log` (incluidos `luma.log` y `armado.log`
si se generan dentro del repositorio), `escalon0/build/`, `so/build/`, `janax_archivos/` (la carpeta del sistema por
omisión del núcleo, [§11.2.4](#1124-variables-de-entorno-que-fija)) y `razar/**/*.bin` (los programas armados no se versionan, salvo los de `instalador/datos/` y
`so/pdp/semilla/`, que no coinciden con esos patrones).

## 11.9 Límites y propiedades resumidas

| Límite o propiedad | Valor | Fuente |
|---|---|---|
| Ruta propia del lanzador | ≤ 659 unidades UTF-16 | `razar/instalador/luma.asm:116` |
| Ruta propia del instalador | ≤ 639 unidades UTF-16 | `razar/instalador/instalar.asm:177` |
| Carpeta de destino por argumento | sin comprobación; búfer de 700 unidades | `razar/instalador/instalar.asm:198` |
| `JANAX_ARCHIVOS` en el núcleo | ≤ 258 bytes ANSI (búfer de 259 con terminador) | `so/janaxos.asm:285, 697` |
| `JANAX_VIGIA` en el núcleo | ≤ 32 766 unidades UTF-16 (búfer de 32 767 con terminador); si no cabe, no se vigila nada | `so/janaxos.asm:310`; `so/vigia.inc:18-20` |
| Espera de la ventana en el primer nacimiento | 240 × 250 ms | `razar/instalador/luma.asm:181-191` |
| Permanencia mínima del logotipo | 2000 ms (criterio) | `razar/instalador/luma.asm:25` |
| Espera tras `WM_CLOSE` | 40 000 ms; luego `TerminateProcess` y 5000 ms | `razar/instalador/luma.asm:231-235` |
| Tamaño máximo por archivo empaquetado | < 4 GiB (escritura de 32 bits) | `razar/instalador/instalar.asm:440` |
| Código de salida del lanzador | siempre 0 | `razar/instalador/luma.asm:245-246` |
| Código de salida del instalador | 0 éxito o cancelación; 1 error | `razar/instalador/instalar.asm:361-369` |
| Temporizadores periódicos | ninguno en el lanzador; sólo esperas por objeto con plazo durante el primer nacimiento y el dormir | `razar/instalador/luma.asm:177-240` |

Existe además en `so/arrancar.asm` un [lanzador anterior](03-nucleo-arranque-memoria-procesos.md#31-lanzador-arrancarexe) (fija sólo `JANAX_ARCHIVOS` y arranca `janaxos.exe` con
`bin/luma.bin`, con `CREATE_NEW_CONSOLE` (10h) y la consola oculta por `STARTF_USESHOWWINDOW` con `SW_HIDE`); no
forma parte del instalador ni lo usa ninguna pieza de este capítulo (`so/arrancar.asm:1-75`, en particular `:46-48`).
