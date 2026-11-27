# 04. Núcleo JanaxOS: ABI de pedidos (llamadas al sistema)

**Alcance.** Este capítulo especifica la interfaz binaria por la que un programa Janax que corre como proceso de
JanaxOS pide servicios al núcleo: la instrucción [`jsys`](01-idioma-janax.md#58-jsys-janax-os) y su convención de registros, el formato de la cola de
pedidos, el algoritmo con que el núcleo atiende una cola (la ["ventanilla"](#5-procesamiento-de-un-toque)), el modelo de permisos que decide si un
pedido se atiende ([porteros](#71-porteros), prefijos de etiqueta, firmas del padre), la tabla completa de los 47 pedidos numerados
con sus argumentos, respuestas y efectos, la ["casa de archivos"](#10-la-casa-de-archivos) (cómo una etiqueta se convierte en un nombre de
archivo del anfitrión) y la instrucción [`jhost`](#11-la-ventana-al-anfitrión-jhost). No cubre: la codificación general de instrucciones ni la semántica
de las demás operaciones del idioma ([capítulo 01](01-idioma-janax.md#01-el-idioma-janax-máquina-virtual-codificación-e-instrucciones)), el ensamblador PDP y la construcción del núcleo ([capítulo 02](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas)), la
creación de procesos desde la línea de comandos, el planificador, los remeros, las salas y el motor de ejecución
([capítulo 03](03-nucleo-arranque-memoria-procesos.md#03-núcleo-janaxos-arranque-memoria-procesos-firmas-y-planificación)), el detalle interno de la ventana, el teclado, el ratón, el sonido y el vigía del anfitrión ([capítulo
05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn)), ni nada de Razar o Luma ([capítulos 06 a 10](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)) o del instalador ([capítulo 11](11-instalador-lanzador-y-publicacion.md#11-instalador-lanzador-y-publicación)). Donde un pedido depende de esos
mecanismos se da aquí su contrato observable y se remite al capítulo correspondiente.

Las referencias `ruta:línea` son relativas a la raíz del repositorio. Las afirmaciones salen del código; lo que no
pudo verificarse en el código se marca "(no verificado)".

---

## 1. Definiciones y notación

| Término | Definición |
|---|---|
| Cabina | Un proceso de JanaxOS: [su bloque de control](03-nucleo-arranque-memoria-procesos.md#52-bloque-de-proceso) de `PROC_SIZE` = 688 bytes (`so/janaxos.asm:44-115`), sus 16 registros, su programa, su pila de retorno y sus salas. |
| Número de proceso | `P_ID`: el índice de la cabina en la tabla global `procs` (`so/janaxos.asm:1339-1343`). Los hijos del núcleo reciben 0, 1, 2… en el orden de la línea de comandos; los nacidos por el [pedido 16](#96-familia) reciben el siguiente índice libre. Los números no se reutilizan (la tabla sólo crece). |
| Padre | `P_PARENT`: puntero a la cabina que lo lanzó; 0 = el núcleo (`so/janaxos.asm:60`). |
| Familia de X | Para los pedidos que nombran "una cabina de la familia": su padre, uno de sus hijos o un hermano (mismo `P_PARENT`), que no sea X y no haya terminado (`so/ambientes.inc:1033-1059`). Todos los hijos del núcleo son hermanos entre sí (comparten `P_PARENT` = 0). |
| Sala | Región de memoria de datos de una cabina. Ver [§6](#6-direcciones-salas-y-validación-de-punteros). |
| Dirección Janax | Entero de 64 bits: número de sala en los 32 bits altos, posición dentro de la sala en los 32 bajos (`so/ambientes.inc:38`). |
| Etiqueta | Nombre de archivo de un programa: cualquier secuencia UTF-8 válida no vacía. Ver [§10](#10-la-casa-de-archivos). |
| Toque | Una ejecución de `jsys` que llega a la [ventanilla](#5-procesamiento-de-un-toque) con una cola. Es la unidad de atención: todos los pedidos de la cola se atienden en el mismo toque o el toque entero se suspende. |
| Pedido / clase | Una entrada de la cola; su "clase" (`kind`) es el número de pedido, 1..47 (`KINDS` = 47, `so/janaxos.asm:161`). |
| Portero | Nodo del árbol de permisos ([§7.1](#71-porteros)). |
| Pedido importante | Clase marcada en `kind_important` (`so/janaxos.asm:231-240`): requiere la firma del padre si quien pide no es hijo del núcleo ([§7.3](#73-pedidos-importantes-y-firma-del-padre)). |
| Bolita | Prioridad de una cabina en 1/65536 (`P_PRIO`, `so/janaxos.asm:81`). |
| "Dentro de sus salas" | Que un rango `[dirección, dirección + n)` esté entero dentro de una sola sala en pie que el núcleo pueda tocar, según `cabin_at` ([§6.3](#63-validación-de-punteros-cabin_at)). |

Valores numéricos: los negativos se escriben en decimal con signo (`-1` = `0xFFFFFFFFFFFFFFFF`). "qword" = 8
bytes little-endian; "dword" = 4 bytes.

---

## 2. Puertas de entrada al núcleo

Un programa sólo tiene dos instrucciones que salen de su propio cómputo:

| Opcódigo | Mnemónico | Formato | Función |
|---|---|---|---|
| `16h` (22) | `jsys rd, ra` | rd en bits 8-11, ra en bits 12-15, bits 16-31 sin uso | Ventanilla de JanaxOS: atiende la cola de pedidos cuya dirección está en `ra`; deja en `rd` cuántos pedidos tenía la cola. |
| `17h` (23) | `jhost rd, ra` | ídem | Ventana al anfitrión: bloque de 32 bytes en `ra`; respuesta en `rd` ([§11](#11-la-ventana-al-anfitrión-jhost)). |

Fuentes: tabla de despacho `optable` (`so/janaxos.asm:523-526`, posiciones 22 y 23), decodificación del intérprete
(`so/janaxos.asm:1841-1854`: opcódigo = byte bajo, rd = bits 8-11, ra = bits 12-15), [macros de notación](01-idioma-janax.md#810-notación-fasm-escalon0janaxinc)
`jsys`/`jhost` (`escalon0/janax.inc:99`, `escalon0/janax.inc:104`).

[Los tres motores](03-nucleo-arranque-memoria-procesos.md#53-motores-de-ejecución) (intérprete, rutinas, traductor) implementan `jsys` con la misma secuencia: `op_sys`
(`so/janaxos.asm:2175-2207`) y `t_sys` (`so/rutinas.inc:612-644`). El traductor no genera código nativo para los
opcódigos 16h y 17h (`native_kind` = 0 en esas posiciones, `so/nativo.inc:554-558`): ejecuta la rutina `t_sys` /
`t_jhost` de la tabla.

---

## 3. Convención de llamada de `jsys`

### 3.1 Registros

| Registro | Entrada | Salida |
|---|---|---|
| `ra` | Dirección Janax de la cola ([§4](#4-formato-de-la-cola-de-pedidos)). En la primera orden ([§3.2](#32-primera-orden-construcción-de-la-sala-0)): tamaño en bytes de la sala 0. | Sin cambios (salvo que `ra` = `rd`). |
| `rd` | Ignorado. | Número de entradas que tenía la cola (no el número de pedidos exitosos): `so/janaxos.asm:2187-2188`, `so/janaxos.asm:2442`. En la primera orden: 0. |
| `j15` | — | Sólo en la primera orden: tamaño de la sala 0 (redondeado a 8). En las demás, sin cambios. |
| Resto | — | Preservados. El núcleo no escribe ningún otro registro Janax. |

No existe una convención de "número de pedido en un registro": el número de pedido viaja en cada entrada de la cola,
y una sola instrucción `jsys` puede llevar pedidos de varias clases. La elección de `rd` y `ra` es libre (cualquiera
de j0..j15). Si `rd` = `j15` en la primera orden, `j15` termina en 0, porque `rd` se escribe después que `j15`
(`so/ambientes.inc:758`, luego `so/janaxos.asm:2188`).

Las respuestas individuales de cada pedido se escriben en la propia cola (campo `+24` de cada entrada, [§4.2](#42-entrada-32-bytes)).

### 3.2 Primera orden: construcción de la sala 0

Una cabina nace sin memoria de datos (`P_DATA` apunta al ["cajón muerto"](03-nucleo-arranque-memoria-procesos.md#62-caja-vista-cajón-y-cartel), `so/janaxos.asm:1284-1285`). Mientras
`P_ROOM0` = 0, cualquier `jsys` se interpreta como primera orden (`so/janaxos.asm:2228-2233`, `rooms_first` en
`so/ambientes.inc:710-771`):

1. El valor de `ra` es el tamaño pedido `s`. Debe ser `s` > 0; se redondea hacia arriba a múltiplo de 8; debe ser
   `s` ≤ `ROOM_MAX` = 2^32 (`so/janaxos.asm:40`).
2. Si el programa tiene datos iniciales (archivo `.datos`, [§10.4](#104-datos-iniciales-datos)) de longitud `P_INITLEN`, debe ser `P_INITLEN` ≤ `s`.
3. Se crea una caja de `s` bytes en ceros, vista para lectura y escritura, como entrada 0 del cartel; se copian los
   datos iniciales al comienzo; `P_LIM1` = `s`, `P_LIM8` = `s` − 7; `j15` = `s`.
4. Respuesta: `rd` = 0 (la dirección de la sala 0).

Si cualquiera de las condiciones falla, `rooms_first` devuelve −1 y el proceso termina con código 5
(`so/janaxos.asm:2183-2184`, `so/janaxos.asm:2198-2200`). Antes de la primera orden todo acceso a memoria termina el
proceso con código 5 (no hay sala que lo contenga; `room_package`, `so/ambientes.inc:76-77`).

La primera orden no pasa por porteros ni firmas. Una cabina rehecha ([pedido 36](#96-familia)) vuelve a `P_ROOM0` = 0
(`so/janaxos.asm:4868`) y debe emitir de nuevo su primera orden.

### 3.3 Toque normal y fallos fatales

Con `P_ROOM0` = 1, `jsys` llama a `ventanilla` con la dirección de la cola bajo el [candado global del núcleo](03-nucleo-arranque-memoria-procesos.md#132-cerrojo-y-variables-de-condición)
(`kern_enter`, `so/remos.inc:28-37`). Hay tres resultados:

| Resultado de `ventanilla` | Efecto en la cabina |
|---|---|
| `n` ≥ 0 | `rd` = `n`; la ejecución sigue en la instrucción siguiente. |
| −1 | La cola es inválida ([§4.4](#44-validación-de-la-cola-fallo--código-5)) o la cabina es un ayudante interno del núcleo: el proceso termina con código 5 (`so/janaxos.asm:2198-2200`; `so/rutinas.inc:636-638`). |
| −2 | El toque se suspende ([§3.4](#34-suspensión-y-reejecución)). |

Un pedido individual inválido **no** es fatal: se responde −1 (u otro código) en su entrada y el toque continúa.

### 3.4 Suspensión y reejecución

Si durante el marcado ([§5](#5-procesamiento-de-un-toque), paso 2) algún pedido debe esperar (firma del padre, saludo del [pedido 29](#97-comunicación-entre-cabinas) o evento de
pantalla del [pedido 41](#98-pantalla-sonido-y-portapapeles)), **ningún pedido del toque se atiende**: el núcleo guarda en `P_WAITING` cuántas esperas
quedaron abiertas, descuenta los pedidos del contador global y devuelve −2 (`so/janaxos.asm:2347-2355`). Entonces:

- El contador de programa retrocede a la propia `jsys` (`dec r12`, `so/janaxos.asm:2202`; `sub r12, R_SIZE`,
  `so/rutinas.inc:640`) y el turno termina.
- `rd` no se escribe y la cola no se modifica (las respuestas −1 provisionales del marcado quedan en la copia
  privada del núcleo y se descartan).
- La cabina sale de la [fila de ejecución](03-nucleo-arranque-memoria-procesos.md#133-fila) mientras `P_WAITING` ≠ 0 (`so/remos.inc:211-212`, `so/remos.inc:257-258`).
  Cada evento que resuelve una espera decrementa `P_WAITING`; al llegar a 0, `q_wake` la devuelve a la fila
  (`so/remos.inc:406-418`).
- Al volver a correr, ejecuta la misma `jsys` con los mismos registros y la misma memoria, y el toque se procesa
  desde cero.
- Cada intento consume una instrucción del presupuesto (la instrucción se cuenta al leerla; no se reintegra).

Consecuencia: un pedido que espera bloquea a todos los pedidos de su toque. Los pedidos 29 y 41 deberían ir en un
toque propio si el programa no quiere que bloqueen a otros (recomendación derivada del algoritmo; el código no lo
exige).

El marcado tiene efectos aunque el toque se suspenda: crea registros de firma y toca el timbre del padre ([§5](#5-procesamiento-de-un-toque),
paso 2.5), fija `P_GWAIT` = 1 (29) o `P_SCRW` = 1 y el plazo (41), y suma `denied`. En particular, una decisión de
firma (estado 1 ó 2) encontrada durante el marcado pasa a estado 3 (usado) en ese mismo momento
(`so/janaxos.asm:4042`); si otra entrada del mismo toque obliga a suspenderlo, esa decisión queda consumida y en la
reejecución se crea un registro nuevo que vuelve a pedir la firma (derivado del código; no verificado en ejecución).

### 3.5 Efecto en el turno

Si en el toque nació un proceso ([pedido 16](#96-familia)) o se resolvió una firma ([pedido 17](#96-familia)), el núcleo marca `sched_dirty` y
corta el turno de quien pidió al terminar el toque, contando sólo lo realmente ejecutado
(`so/janaxos.asm:2189-2194`, `so/janaxos.asm:4487`, `so/janaxos.asm:4518`).

---

## 4. Formato de la cola de pedidos

### 4.1 Cabecera

| Desplazamiento | Tamaño | Campo | Descripción |
|---|---|---|---|
| +0 | 8 | `N` | Número de entradas. Al terminar un toque con `N` > 0, el núcleo lo deja en 0 (`so/janaxos.asm:2436`). Con `N` = 0 el toque responde 0 y no escribe nada (`so/janaxos.asm:2254-2255`, `so/janaxos.asm:2444-2446`). |
| +8 | 32·`N` | Entradas | `N` entradas consecutivas ([§4.2](#42-entrada-32-bytes)). |

### 4.2 Entrada (32 bytes)

| Desplazamiento | Tamaño | Campo | Descripción |
|---|---|---|---|
| +0 | 4 | `kind` | Número de pedido, 1..47. Se lee como dword sin signo (`so/janaxos.asm:2287`). |
| +4 | 4 | `alto` | Argumento auxiliar ("mitad alta del tipo"); su uso depende de la clase ([§4.3](#43-uso-del-campo-alto)). |
| +8 | 8 | `a` | Primer argumento. |
| +16 | 8 | `b` | Segundo argumento. El pedido 41 lo reescribe ([§9.8](#98-pantalla-sonido-y-portapapeles)). |
| +24 | 8 | `respuesta` | Escrito por el núcleo. El valor de entrada se ignora. |

La ventanilla copia las entradas a un libro privado al empezar y las vuelve a copiar enteras sobre la cola al final
(`so/janaxos.asm:2263-2272`, `so/janaxos.asm:2432-2441`). Por eso un pedido que escriba datos sobre la zona de la
propia cola (por ejemplo, una lectura de archivo con destino solapado) queda sobrescrito por esa copia final.

### 4.3 Uso del campo `alto`

| Clase | Significado de `alto` | Fuente |
|---|---|---|
| 5, 6, 7, 38 | Número de manejador de archivo (índice en la tabla de la cabina). | `file_handle`, `so/janaxos.asm:3557-3566` |
| 13 | Longitud en bytes de la etiqueta nueva. | `so/janaxos.asm:3286` |
| 16 | Derechos del hijo (bits `R_*`, [§7.1](#71-porteros)). | `so/janaxos.asm:4471-4472` |
| 24 | Trato con que la cabina destino verá la sala (0, 1 ó 3). | `so/janaxos.asm:4357` |
| Demás | Ignorado. | — |

### 4.4 Validación de la cola (fallo = código 5)

En este orden (`so/janaxos.asm:2234-2266`):

1. La dirección de la cola es múltiplo de 8.
2. Los 8 bytes de `N` están dentro de sus salas.
3. `N` ≤ `ROOM_MAX`/32 = 134 217 728.
4. Los `8 + 32·N` bytes de la cola entera están dentro de una sola sala.
5. El núcleo obtiene memoria para su libro privado (`window_book`, `so/ambientes.inc:2015-2043`).

Si alguno falla, el proceso termina con código 5.

---

## 5. Procesamiento de un toque

Algoritmo de `ventanilla` (`so/janaxos.asm:2224-2451`), ejecutado con el candado global tomado:

1. **Copia.** Las `N` entradas se copian al libro privado.
2. **Marcado**, entrada por entrada en orden de cola, con `k` = `kind`:
   1. Si `k` ∉ [1, 47]: respuesta −1 y siguiente (`so/janaxos.asm:2288-2290`).
   2. Si `kind_door[k]` ≠ 0: el portero de la cabina para esa puerta debe permitir algún derecho de
      `kind_right[k]` (`gate_allows`, [§7.1](#71-porteros)). Si no: contador `denied` +1, respuesta −1.
   3. Si `k` = 29 y nadie la saludó todavía (`greet_must_wait`, `so/ambientes.inc:1529-1538`): espera.
   4. Si `k` = 41 y debe dormir sobre la pantalla ([`event_must_wait`](05-nucleo-pantalla-teclado-vigia.md#83-marcación-del-toque-event_must_wait), `so/janaxos.asm:2878-2923`): espera.
   5. Si `kind_important[k]` = 1, la cabina no es hija del núcleo y su línea no le heredó la firma de `k`
      (`born_signed`, [§7.4](#74-firmas-heredadas)): se consulta la firma (`signature`, [§7.5](#75-registro-de-pedidos-en-espera)). Firmada: sigue. Rechazada: `denied` +1,
      respuesta −1. Pendiente: se toca el timbre del padre (un saludo de la cabina al padre, [pedido 28](#97-comunicación-entre-cabinas)) y espera.
   6. Si pasó todo: la clase queda "presente" en este toque.
3. **Suspensión.** Si hubo alguna espera: se devuelve −2 ([§3.4](#34-suspensión-y-reejecución)).
4. **Asignación de pantallas.** Una "pantalla" es un servidor interno sintonizado a una clase. Primero cada clase
   presente que ya tiene pantalla sintonizada la conserva; luego cada clase presente sin pantalla toma una pantalla
   que no recibió nada en este toque (cambiándole la sintonía, contador `retunes`) o, si no hay, se abre una nueva
   (`so/janaxos.asm:2358-2415`). El estado de las pantallas (`tune`, `nscreens`) es global a todo el sistema.
5. **Servicio.** Se recorren las pantallas por índice creciente; cada pantalla ocupada llama a su servidor
   (`serve_table[k−1]`, `so/janaxos.asm:210-216`), que recorre todas las entradas de su clase en orden de cola
   (`so/janaxos.asm:2417-2429`).
6. **Devolución.** El libro se copia sobre la cola, `N` queda en 0 y la respuesta del toque es `N`.

**Orden garantizado.** Dentro de una misma clase, los pedidos se atienden en el orden de la cola. Entre clases
distintas, el orden es el de los índices de pantalla, que depende de la historia de sintonías de todo el sistema;
el código no da otra garantía. Un pedido que dependa del resultado de otro (leer con el manejador que devuelve una
apertura, usar la dirección que devuelve un crecimiento) debe ir en un toque posterior.

**Validación de argumentos.** El marcado sólo valida clase, portero y firma. Los argumentos (`a`, `b`, `alto`) se
validan al servir, con el estado que dejaron los pedidos servidos antes en el mismo toque.

**Servidores en lote.** El pedido 1 junta todas las escrituras válidas del toque en una sola llamada al anfitrión
([§9.1](#91-consola)). Los demás servidores atienden sus entradas una por una.

---

## 6. Direcciones, salas y validación de punteros

El modelo completo de salas es materia del [capítulo 03](03-nucleo-arranque-memoria-procesos.md#6-modelo-de-memoria-de-un-proceso). Para la ABI importan las reglas siguientes.

### 6.1 Dirección Janax

`dirección = (número_de_sala << 32) | posición` (`ROOM_SHIFT` = 32, `so/ambientes.inc:38`). La sala 0 es la de la
primera orden. Las salas nuevas ([pedidos 2, 25, 26](#92-memoria-y-cajas), dote, asociación) reciben números crecientes a partir de
`P_NEXTROOM` (inicialmente 1); un número no se reutiliza hasta que la cabina se queda sólo con la sala 0, momento en
que la cuenta vuelve a 1 (`so/ambientes.inc:334-337`, `so/ambientes.inc:518-522`). El tamaño de toda sala es múltiplo
de 8.

### 6.2 Trato de una sala

Bits 48-63 de la entrada del [cartel](03-nucleo-arranque-memoria-procesos.md#62-caja-vista-cajón-y-cartel) (`so/ambientes.inc:48-60`). La ABI usa sólo los dos primeros como "trato":

| Valor de trato (en argumentos) | Bits | Significado |
|---|---|---|
| 0 | — | Sin acceso. |
| 1 | `ROOM_READ` (bit 48) | Sólo lectura. |
| 3 | `ROOM_READ` + `ROOM_WRITE` (bits 48-49) | Lectura y escritura. |
| 2 | — | Rechazado en todo pedido (escritura sin lectura). |
| > 3 | — | Rechazado. |

Cada sala tiene además un "techo" (bits 48-49 de `RE_BOX`, `ROOM_CEIL` = 48, `so/ambientes.inc:440-441`): el trato
máximo que esta cabina puede darle. Un trato pedido debe estar contenido en el techo o en el trato actual, según el
pedido.

### 6.3 Validación de punteros (`cabin_at`)

Todo argumento que el núcleo lee o escribe en memoria de la cabina pasa por `room_at`/`cabin_at`
(`so/ambientes.inc:657-704`). Un rango `[d, d + n)` es válido si y sólo si:

- `posición + n` no desborda 64 bits;
- sala 0: `posición + n` ≤ `P_LIM1` (tamaño de la sala 0 si su trato es 3; 0 si no, `so/ambientes.inc:637-644`);
- sala k ≥ 1: la sala está en el cartel, en pie (tamaño ≠ 0), `posición + n` ≤ tamaño, y su trato tiene **lectura y
  escritura** (`so/ambientes.inc:680-683`).

Consecuencia: el núcleo nunca lee ni escribe en una sala que el propio programa no podría leer y escribir, incluso
para pedidos que sólo leen el argumento. Un rango no puede cruzar de una sala a otra.

---

## 7. Modelo de permisos

### 7.1 Porteros

Un árbol global de nodos de `NODE_SIZE` = 48 bytes (`so/janaxos.asm:124-130`):

| Desplazamiento | Campo | Descripción |
|---|---|---|
| +0 | `N_PARENT` | Índice del nodo padre; −1 para la raíz. |
| +8 | `N_RIGHTS` | Derechos (bits `R_*`). |
| +16 | `N_ALIVE` | 1 vivo, 0 revocado. |
| +24 | `N_DOOR` | Puerta: 1 pantalla, 2 memoria, 3 archivos (0 la raíz). |
| +32 | `N_PREFIX` | Desplazamiento del prefijo de etiqueta en el depósito de prefijos. |
| +40 | `N_PLEN` | Longitud del prefijo; 0 = cualquier etiqueta. |

Derechos (`so/janaxos.asm:118-122`): `R_SCREEN` = 1, `R_MEM` = 2, `R_READ` = 4, `R_WRITE` = 8, `R_ALL` = 15.

Nodos fijos creados al arrancar (`so/janaxos.asm:841-856`): 0 raíz (`R_ALL`), 1 pantalla (`R_SCREEN`), 2 memoria
(`R_MEM`), 3 archivos (`R_READ` + `R_WRITE`).

Cada cabina tiene un portero por puerta (`P_GATES`, 3 qwords, `so/janaxos.asm:58`). Al nacer, el portero de la
puerta `p` es un nodo nuevo hijo del portero `p` de su padre (o del nodo `p` si el padre es el núcleo), con
derechos = derechos de ese nodo ∧ derechos pedidos ([`make_process`](03-nucleo-arranque-memoria-procesos.md#51-creación-make_process), `so/janaxos.asm:1291-1315`). El portero de
archivos lleva el prefijo de lanzamiento, si lo hay.

**Comprobación** (`gate_allows`, `so/janaxos.asm:3808-3828`): desde el nodo hasta la raíz, cada nodo debe estar vivo
y tener **al menos uno** de los derechos pedidos. Revocar un nodo inhabilita toda su rama.

**Pertenencia** (`mine`, `so/janaxos.asm:3832-3858`): un nodo es "de" la cabina si subiendo desde él, todos vivos, se
llega al portero propio de la cabina para la puerta del nodo (el propio portero cuenta).

### 7.2 Prefijo de etiqueta

`prefix_allows` (`so/janaxos.asm:3105-3132`): subiendo desde el portero de archivos hasta la raíz, cada nodo con
prefijo (`N_PLEN` > 0) debe ser prefijo, byte a byte, de la etiqueta normalizada ([§10.2](#102-de-etiqueta-a-nombre-de-archivo)). No comprueba si el nodo
está vivo. Una etiqueta vacía (longitud 0) es rechazada por cualquier nodo con prefijo; los pedidos 37 y 39 usan esa
propiedad para exigir "ningún prefijo en el camino" (`so/janaxos.asm:2587-2591`, `so/vigia.inc:659-663`).

### 7.3 Pedidos importantes y firma del padre

Una clase importante ([§8](#8-tabla-resumen-de-pedidos), columna "Imp.") pedida por una cabina cuyo padre no es el núcleo requiere la firma del
padre, salvo herencia ([§7.4](#74-firmas-heredadas)). Los hijos del núcleo nunca esperan firma: el núcleo firma "a través de los porteros"
(`so/janaxos.asm:2316-2317`). Puerta y firma son independientes: un pedido firmado igual debe pasar su portero.

### 7.4 Firmas heredadas

Cada cabina tiene `P_SIGNED` (máscara de clases firmadas de nacimiento, bit k = clase k) y `P_SIGNNEXT` (la máscara
que recibirá su próximo hijo) (`so/janaxos.asm:113-114`).

`signed_mask(X)` (`so/janaxos.asm:4308-4318`): parte de `KINDS_ALL` = 2^48 − 2 (bits 1..47,
`so/janaxos.asm:170`) y, subiendo desde X mientras la cabina actual tenga padre distinto del núcleo, hace AND con su
`P_SIGNED`. Un hijo del núcleo tiene `signed_mask` = `KINDS_ALL`. Un pedido importante de clase k no espera firma si
el bit k de `signed_mask(X)` está en 1 (`born_signed`, `so/janaxos.asm:4298-4303`). Quitar un bit en cualquier
ancestro lo quita para toda la línea de abajo en el acto.

### 7.5 Registro de pedidos en espera

Tabla global `recs` de entradas de `REC_SIZE` = 40 bytes (`so/janaxos.asm:242-248`); el número de un registro es su
índice:

| Desplazamiento | Campo | Descripción |
|---|---|---|
| +0 | `R_CHILD` | Cabina que pidió. |
| +8 | `R_INDEX` | Índice de la entrada dentro de su cola (0-based). |
| +16 | `R_KIND` | Clase. |
| +24 | `R_SIGNER` | Cabina que debe firmar (el padre al crearse). |
| +32 | `R_STATE` | 0 en espera, 1 firmado, 2 rechazado, 3 usado. |

Ciclo de vida (`signature`, `so/janaxos.asm:4018-4055`; `new_record`, `so/janaxos.asm:4059-4104`):

1. En el marcado, el núcleo busca un registro con el mismo (`R_CHILD`, `R_INDEX`, `R_KIND`) y estado ≠ 3. Si su
   estado es 1 ó 2, lo pasa a 3 (usado) y aplica la decisión. Si es 0, sigue esperando. Si no existe, crea uno en
   estado 0, suma 1 a `P_BLOCKS` del firmante y despierta al [remero especial](03-nucleo-arranque-memoria-procesos.md#131-hilos-y-clases-de-remero).
2. La identidad de un pedido es su posición en la cola y su clase: la decisión se aplica a la entrada que ocupe esa
   posición con esa clase cuando la `jsys` se reejecute. La decisión se consume en el primer marcado que la
   encuentra, aunque ese toque termine suspendido por otra entrada ([§3.4](#34-suspensión-y-reejecución)).
3. Resoluciones posibles: el padre firma o rechaza ([pedido 17](#96-familia)); el padre termina ([§7.6](#76-cuando-el-firmante-termina)); quien pide termina
   (`end_records`, rechazados, `so/janaxos.asm:5173-5195`); nadie que pueda firmar sigue corriendo
   (`nobody_signs`, rechazados, `so/janaxos.asm:4228-4253`, llamado desde `so/remos.inc:204`).

### 7.6 Cuando el firmante termina

- Padre que no es hijo del núcleo: su línea entera termina con él (código 9 para los hijos, `line_end`,
  `so/janaxos.asm:5142-5165`); los pedidos que esos hijos tenían en espera se rechazan al terminar ellos.
- Padre hijo del núcleo: sus hijos vivos pasan a ser hijos del núcleo (`P_PARENT` = 0) y lo que esperaba su firma
  se decide en el acto con los permisos del padre que termina (`shadow_decides`: firmado si su portero permite la
  puerta y el derecho de la clase, o si la clase no tiene puerta; rechazado si no) (`so/janaxos.asm:5097-5141`,
  `so/janaxos.asm:4211-4225`).
- El mecanismo de ["sombra"](03-nucleo-arranque-memoria-procesos.md#105-sombra) (`orphans`, `P_SHADOW`) sigue en el código (`so/janaxos.asm:4115-4175`) pero, con las dos
  reglas anteriores, no queda descendencia viva debajo de un padre que termina; sólo se activa si esa condición
  cambia.

### 7.7 Derechos de los hijos del núcleo

Los procesos de la [línea de comandos](03-nucleo-arranque-memoria-procesos.md#35-línea-de-comandos) (`so/janaxos.asm:949-1048`) reciben:

| Sintaxis del argumento | Efecto |
|---|---|
| `prog` | Derechos `R_ALL`, sin prefijo, bolita `PRIO_DEFAULT` = 64881 (criterio documentado como 0,99; `so/janaxos.asm:464`). |
| `prog@letras` | Derechos = unión de las letras: `p` pantalla, `m` memoria, `l` leer archivos, `g` escribir archivos. Otras letras se ignoran. |
| `prog!f` o `prog@…!f` | Bolita = fracción `f` ∈ [0, 1] con hasta 9 decimales, en 1/65536 redondeado (`read_bolita`, `so/janaxos.asm:1193-1238`). |
| `prog@…:hex` | Prefijo de etiqueta en hexadecimal (mayúsculas o minúsculas, `hex_digit`, `so/janaxos.asm:1241-1256`), normalizado NFC; debe ser no vacío, de menos de `HOST_PATH` = 260 bytes antes de normalizar (`so/janaxos.asm:1024-1026`), UTF-8 válido y lo último del argumento (todo lo que sigue a `:` se lee como pares hexadecimales). |
| `prog!f…` | Tras `!f` (fuera de la lista de permisos) sólo puede venir el fin del argumento o `@`; otra cosa es argumento mal formado (`so/janaxos.asm:965-968`). La parte entera de `f` es un solo dígito 0 ó 1, o se omite empezando por `.`. |

Un argumento mal formado termina el núcleo con código 4 (`fail_args`, `so/janaxos.asm:5287-5288`).

---

## 8. Tabla resumen de pedidos

Columnas: **Puerta/derecho** = `kind_door`/`kind_right` (`so/janaxos.asm:219-229`; 0 = sin portero, rigen sólo las
reglas propias del pedido); **Imp.** = `kind_important` (`so/janaxos.asm:231-240`); **Servidor** = entrada de
`serve_table` (`so/janaxos.asm:210-216`). "fam" = número de una cabina de la familia o −1 para el padre. "hijo" =
número de un hijo directo (`P_PARENT` = quien pide).

| N.º | Servidor | Puerta / derecho | Imp. | `alto` | `a` | `b` | Respuesta |
|---|---|---|---|---|---|---|---|
| 1 | `serve_write` | 1 / `R_SCREEN` | 1 | — | dirección del texto | bytes | `b`, o −1 |
| 2 | `serve_grow` | 2 / `R_MEM` | 1 | — | bytes | — | dirección de la sala nueva, o −1 |
| 3 | `serve_destroy` | 2 / `R_MEM` | 1 | — | dirección de inicio de sala | — | 0, o −1 |
| 4 | `serve_open` | 3 / `R_READ` o `R_WRITE` | 1 | — | etiqueta | bytes | manejador, o −1 |
| 5 | `serve_fread` | 3 / `R_READ` | 0 | manejador | destino | bytes | bytes leídos, o −1 |
| 6 | `serve_fwrite` | 3 / `R_WRITE` | 1 | manejador | origen | bytes | bytes escritos, o −1 |
| 7 | `serve_close` | 0 | 0 | manejador | — | — | 0, o −1 |
| 8 | `serve_cede` | 0 | 1 | — | nodo propio | derechos | nodo nuevo, o −1 |
| 9 | `serve_use` | 0 | 1 | — | nodo propio | — | 0, o −1 |
| 10 | `serve_revoke` | 0 | 1 | — | nodo propio | — | 0, o −1 |
| 11 | `serve_consult` | 0 | 0 | — | puerta 1..3 | — | nodo, o −1 |
| 12 | `serve_delete` | 3 / `R_WRITE` | 1 | — | etiqueta | bytes | 0, o −1 |
| 13 | `serve_rename` | 3 / `R_WRITE` | 1 | bytes de la nueva | etiqueta vieja | bytes de la vieja | 0, o −1 |
| 14 | `serve_list` | 3 / `R_READ` | 0 | — | destino | capacidad | cantidad, o −1 |
| 15 | `serve_cede_label` | 0 | 1 | — | nodo propio | dirección de bloque | nodo nuevo, o −1 |
| 16 | `serve_launch` | 3 / `R_READ` | 1 | derechos del hijo | etiqueta | bytes | número del hijo, o −1 |
| 17 | `serve_sign` | 0 | 0 | — | n.º de registro | 1 firma / 0 rechaza | 0, o −1 |
| 18 | `serve_pending` | 0 | 0 | — | destino | capacidad | cantidad, o −1 |
| 19 | `serve_state` | 0 | 0 | — | hijo | — | código, −1 corriendo, −2 |
| 20 | `serve_bolita` | 0 | 0 | — | bolita deseada | — | bolita obtenida |
| 21 | `serve_treat` | 2 / `R_MEM` | 1 | — | inicio de sala | trato | 0, o −1 |
| 22 | `serve_dowry` | 2 / `R_MEM` | 1 | — | inicio de sala | trato | 0, o −1 |
| 23 | `serve_move` | 2 / `R_MEM` | 1 | — | inicio de sala | fam | 0, o −1 |
| 24 | `serve_link` | 2 / `R_MEM` | 1 | trato | inicio de sala | fam | 0, o −1 |
| 25 | `serve_receive` | 2 / `R_MEM` | 0 | — | — | — | dirección de sala, o −1 |
| 26 | `serve_fuse` | 2 / `R_MEM` | 1 | — | inicio de sala | inicio de sala | dirección nueva, o −1 |
| 27 | `serve_assoc` | 2 / `R_MEM` | 1 | — | fam | palabra Venn | 0, o −1 |
| 28 | `serve_greet` | 0 | 0 | — | fam | — | 0, o −1 |
| 29 | `serve_greeting` | 0 | 0 | — | — | — | n.º de quien saludó, o −1 (puede dormir) |
| 30 | `serve_say` | 0 | 0 | — | fam | palabra (qword) | 0, o −1 |
| 31 | `serve_hear` | 0 | 0 | — | destino de 16 bytes | — | 1, 0, o −1 |
| 32 | `serve_watch` | 3 / `R_READ` | 0 | — | bytes del prefijo 0..8 | prefijo (qword) | 0, o −1 |
| 33 | `serve_end` | 0 | 1 | — | hijo | — | 9, código previo, −1, −2 |
| 34 | `serve_budget` | 0 | 1 | — | hijo | instrucciones (0 = sin límite) | 0, código previo, −2 |
| 35 | `serve_rowed` | 0 | 0 | — | hijo, o −1 (sí mismo) | — | instrucciones, o −2 |
| 36 | `serve_remake` | 3 / `R_READ` | 1 | — | etiqueta | bytes | 0, o −1 |
| 37 | `serve_host_open` | 3 / `R_READ` | 0 | — | ruta del anfitrión (UTF-8) | bytes | manejador, o −1 |
| 38 | `serve_seek` | 3 / `R_READ` | 0 | manejador | posición, o −1 (final) | — | posición, o −1 |
| 39 | `serve_hostnew` | 3 / `R_READ` | 0 | — | destino | capacidad | bytes, 0, o −1 |
| 40 | `serve_show` | 1 / `R_SCREEN` | 0 | — | nube `.nube` v3 | bytes | partículas, o −1 |
| 41 | [`serve_wait_event`](05-nucleo-pantalla-teclado-vigia.md#85-servicio-serve_wait_event) | 1 / `R_SCREEN` | 0 | — | registro de 32 bytes | espera en ms | 1, 0, o −1 (puede dormir) |
| 42 | `serve_gaps` | 0 | 1 | — | hijo o sí mismo | 1 / 0 | 0, o −2 |
| 43 | `serve_title` | 1 / `R_SCREEN` | 0 | — | texto | bytes | letras, o −1 |
| 44 | `serve_note` | 1 / `R_SCREEN` | 0 | — | mensaje MIDI (24 bits bajos) | — | 1, 0, o −1 |
| 45 | `serve_inherit` | 0 | 1 | — | 0 (próximo hijo) o hijo | máscara de clases | máscara resultante, o −2 |
| 46 | `serve_name` | 0 | 1 | — | n.º de un descendiente | — | 0, o −2 |
| 47 | `serve_copy` | 1 / `R_SCREEN` | 1 | — | texto UTF-8 | bytes | letras, 0, o −1 |

Observaciones transversales:

- No existe un pedido separado para "crear" archivo: el pedido 4 abre con `OPEN_ALWAYS`, que crea el archivo si no
  existe ([§9.3](#93-archivos-del-sistema)).
- La respuesta −2 sólo la usan pedidos de familia para "no es mi hijo/descendiente" (19, 33, 34, 35, 42, 45, 46).
- Un pedido rechazado por portero o por firma responde −1 aunque su clase use −2 para otros errores
  (`so/janaxos.asm:2299-2300`, `so/janaxos.asm:2326-2327`, `so/janaxos.asm:2341`).

---

## 9. Especificación de cada pedido

Notación: `E` = la entrada; `E.a`, `E.b`, `E.alto`, `E.r` (respuesta). "Inválido" = `E.r` = −1. Todas las
validaciones de punteros usan [§6.3](#63-validación-de-punteros-cabin_at).

### 9.1 Consola

**1 — escribir** (`serve_write`, `so/janaxos.asm:2455-2523`)

1. Para cada entrada de clase 1, en orden: si `[E.a, E.a + E.b)` está dentro de sus salas, `E.r` = `E.b` y se suma
   `E.b` al total; si no, inválido.
2. Si el total > 0: se concatenan los bytes de las entradas válidas en orden de cola en un búfer nuevo y se emite
   **una** llamada `WriteFile` a la salida estándar del núcleo.
3. `E.r` se fija antes de escribir: vale `E.b` aunque la reserva del búfer o `WriteFile` fallen.

Es importante: un hijo de un proceso necesita [firma](#73-pedidos-importantes-y-firma-del-padre) (o [herencia](#74-firmas-heredadas)) para escribir en la consola.

### 9.2 Memoria y cajas

**2 — crecer** (`rooms_grow`, `so/ambientes.inc:387-431`)

- `E.a` = bytes. Inválido si 0, si el redondeo a 8 desborda o si supera 2^32.
- Crea una caja nueva en ceros con trato 3 y techo 3, y la añade como sala de número `P_NEXTROOM`.
- `E.r` = número << 32 (la dirección del primer byte de la sala).

**3 — destruir** (`rooms_destroy`, `so/ambientes.inc:552-569`)

- `E.a` debe ser exactamente el inicio de una sala en pie (posición 0). Inválido si la sala es la que contiene la
  cola de este toque (se comparan los números de sala de `E.a` y de la cola).
- La sala deja la cabina: su vista y su llave vuelven al anfitrión; la caja sigue viva si otra cabina la tiene. Su
  número no se reutiliza ([§6.1](#61-dirección-janax)). La sala 0 puede destruirse si la cola no está en ella; desde entonces el núcleo no
  puede tocar la sala 0 (`so/ambientes.inc:489-494`).
- `E.r` = 0.

**21 — tratar** (`rooms_treat`, `so/ambientes.inc:579-653`)

- `E.a` = inicio de sala; `E.b` = trato 0, 1 ó 3.
- Inválido si `E.b` = 2 o > 3; si `E.b` ≠ 3 y la sala contiene la cola; si `E.b` no está contenido en el techo de la
  sala; si `VirtualProtect` falla.
- Ajusta la protección de las páginas de la vista y la entrada del cartel (conserva `ROOM_SHARED`). Para la sala 0,
  `P_LIM1`/`P_LIM8` = tamaño/tamaño − 7 si el trato es 3, y 0 si no.
- Un acceso posterior no permitido por el trato termina el proceso con código 5.
- `E.r` = 0.

**22 — dote** (`rooms_dowry`, `so/ambientes.inc:906-954`)

- `E.a` = inicio de sala; `E.b` = trato 0, 1 ó 3, contenido en el trato **actual** de la sala.
- Duplica la llave de la caja y agrega al final de la lista `P_DOWRY` una ranura de `DOWRY_SIZE` = 32 bytes
  {llave +0, tamaño +8, trato +16, número de caja +24} (`so/ambientes.inc:848`). Marca la sala propia como compartida.
- El próximo hijo que lance esta cabina ([pedido 16](#96-familia)) nace con las cajas de la dote como sus salas 1, 2, … en el orden
  dado, con trato y techo = el trato de la ranura; luego la dote se vacía (`rooms_born`, `so/ambientes.inc:1004-1029`).
  Una dote no usada vuelve al anfitrión cuando la cabina termina.
- `E.r` = 0.

**23 — mover** y **24 — enlazar** (`rooms_pass`, `so/ambientes.inc:1066-1162`)

- `E.a` = inicio de sala; `E.b` = cabina destino de la familia (−1 = el padre).
- 23: trato en destino = trato actual de la sala; inválido si la sala contiene la cola. La sala deja la cabina de
  origen (su dirección muere). Techo en destino = techo de origen ∪ trato.
- 24: trato en destino = `E.alto` (0, 1 ó 3), contenido en el trato actual. La sala queda en ambas; se marca
  compartida. Techo en destino = el trato dado.
- La caja se deposita en el buzón de llegadas del destino (`P_ARRIVED`), en ranuras de 32 bytes con el bit
  `DOWRY_MOVED` = 4 en el trato si fue movida. El destino la incorpora con el pedido 25: el cartel de una cabina sólo
  lo modifica ella misma.
- `E.r` = 0.

**25 — recibir** (`rooms_receive`, `so/ambientes.inc:1167-1187`)

- Sin argumentos. Saca la caja más antigua del buzón y la incorpora como la próxima sala.
- `E.r` = dirección de la sala nueva; −1 si el buzón está vacío o la incorporación falla (en este último caso la caja
  ya salió del buzón y su llave se cierra: se pierde).

**26 — fundir** (`rooms_fuse`, `so/ambientes.inc:1193-1267`)

- `E.a`, `E.b` = inicios de dos salas distintas, ambas en pie y legibles, ninguna en la sala de la cola, con suma de
  tamaños ≤ 2^32.
- Crea una sala nueva (trato 3) con el contenido de la primera seguido del de la segunda; ambas originales dejan la
  cabina.
- `E.r` = dirección de la sala nueva.

**27 — asociar** (`rooms_associate`, `so/ambientes.inc:1276-1300`)

- `E.a` = cabina B de la familia (−1 = el padre); `E.b` = [palabra Venn](05-nucleo-pantalla-teclado-vigia.md#112-palabra-venn).
- Inválido si `E.b` tiene bits fuera de `VENN_KNOWN` = `0FFFF03FFh` (`so/venn.inc:29`), si el criterio (bits 4-7) no
  está en `CARTEL_CRITS` = `0Fh` (criterios 0..3, `so/ambientes.inc:1398`) o si B no es de la familia.
- Guarda B y la palabra en `P_PARTNER`/`P_ASSOC`. Al lanzar el próximo hijo, si B también nombró a esta cabina como
  socia y sigue corriendo, el hijo recibe la selección de cajas de A (este cartel) y B que la palabra indique,
  después de la dote (`rooms_assoc`, `so/ambientes.inc:1356-1380`). La asociación se consume en ese lanzamiento.
- Campos de la palabra Venn (`so/venn.inc:9-29`): bits 0-2 regiones (1 comunes, 2 sólo de A, 4 sólo de B); bit 3
  mirar B primero; bits 4-7 criterio (0 orden del cartel, 1 tamaño, 2 número de caja, 3 trato; `cartel_crit`,
  `so/ambientes.inc:1431-1445`); bit 8 descendente; bit 9 criterio sobre toda la selección; bits 16-31 cuántas (0 =
  todas). [El algoritmo de selección](05-nucleo-pantalla-teclado-vigia.md#114-algoritmo-venn_run-sovenninc61-124) está en `so/venn.inc` y no se re-especifica aquí (semántica de orden tomada de la
  cabecera de `so/venn.inc`, no verificado línea a línea).
- Una caja que ambas tienen se entrega con el trato que ambas permiten (AND) (`assoc_give`, `so/ambientes.inc:1384-1394`).
- `E.r` = 0.

### 9.3 Archivos del sistema

Todas las clases de esta sección que reciben una etiqueta la convierten con `label_path` ([§10.2](#102-de-etiqueta-a-nombre-de-archivo)) y exigen que el
portero de archivos permita la etiqueta normalizada (`files_prefix_ok`, `so/janaxos.asm:3136-3145`; un rechazo suma
`denied`). El manejador es un índice en la tabla de archivos de la cabina ([§9.3.1](#931-tabla-de-manejadores)).

**4 — abrir** (`serve_open`, `so/janaxos.asm:3023-3066`)

- `E.a`, `E.b` = etiqueta.
- `CreateFileA(ruta, GENERIC_READ|GENERIC_WRITE, FILE_SHARE_READ|FILE_SHARE_WRITE, OPEN_ALWAYS)`: abre o crea.
- `E.r` = manejador; −1 si la etiqueta es inválida, el prefijo la rechaza, el anfitrión falla o no hay memoria para
  la tabla.

**5 — leer** y **6 — escribir en archivo** (macro `serve_io`, `so/janaxos.asm:3477-3521`)

- `E.alto` = manejador; `[E.a, E.a + E.b)` dentro de sus salas.
- `ReadFile`/`WriteFile` desde la posición actual del archivo, que avanza. `E.r` = bytes transferidos (0 = fin de
  archivo en lectura); −1 si el manejador no está abierto, el rango es inválido o el anfitrión falla.
- `E.b` se pasa al anfitrión en un parámetro de 32 bits; con `E.b` = 2^32 exactos se transfieren 0 bytes
  (consecuencia del ABI del anfitrión; no verificado en ejecución).

**7 — cerrar** (`serve_close`, `so/janaxos.asm:3524-3554`)

- `E.alto` = manejador. `CloseHandle`, la ranura vuelve a 0. `E.r` = 0; −1 si no estaba abierto. No pasa por
  portero.

**12 — borrar** (`serve_delete`, `so/janaxos.asm:3225-3260`): `DeleteFileA`. `E.r` = 0 / −1.

**13 — renombrar** (`serve_rename`, `so/janaxos.asm:3264-3310`)

- Etiqueta vieja en `[E.a, E.a + E.b)`; la nueva empieza en `E.a + E.b` y mide `E.alto` bytes. Ambas pasan por
  `label_path` y por el prefijo.
- `MoveFileA` sin opciones: falla si la nueva ya existe. `E.r` = 0 / −1.

**14 — listar** (`list_one`, `so/janaxos.asm:3337-3363`; `list_folder`, `so/janaxos.asm:3367-3419`)

- `[E.a, E.a + E.b)` dentro de sus salas: zona de destino.
- Recorre la carpeta propia y después, si existe, la del tablero (`FindFirstFileA`/`FindNextFileA`). Omite
  directorios y nombres que no decodifican ([§10.3](#103-del-nombre-de-archivo-a-la-etiqueta-listado)). Sólo incluye etiquetas que el prefijo permite.
- Formato de cada etiqueta escrita: qword con la longitud `L`, seguida de los `L` bytes; el registro ocupa
  `8 + redondeo_a_8(L)` bytes (`so/janaxos.asm:3395-3396`). Los bytes de relleno no se escriben.
- Cuando un registro no cabe, se deja de listar esa carpeta y se pasa a la siguiente (la del tablero puede aportar
  registros más cortos que sí quepan).
- `E.r` = cantidad de etiquetas escritas; −1 si la zona es inválida. El orden es el que entregue el anfitrión
  (`so/janaxos.asm:3374-3413`).

**38 — ir a** (`serve_seek`, `so/janaxos.asm:2641-2681`)

- `E.alto` = manejador; `E.a` = posición absoluta ≥ 0, o −1 para el final.
- `SetFilePointerEx` desde el inicio (o `FILE_END` con desplazamiento 0). `E.r` = la posición nueva; −1 si el
  manejador no está abierto, `E.a` < −1 o el anfitrión falla.
- Sirve también para manejadores del [pedido 37](#94-salidas-al-anfitrión).

#### 9.3.1 Tabla de manejadores

`P_FILES`/`P_NFILES` (`so/janaxos.asm:56-57`). Un manejador es el índice de la primera ranura libre (valor 0); el
primer manejador es 0. Si no hay ranura libre la tabla se duplica (1, 2, 4, …) (`file_slot`,
`so/janaxos.asm:3569-3611`). Una ranura ≥ `P_NFILES` o con valor 0 es "no abierto". Al terminar la cabina, o al
rehacerse, se cierran todos sus archivos (`close_files`, `so/janaxos.asm:3614-3635`; `so/remos.inc:274`;
`so/janaxos.asm:4846`). Las clases 5, 6, 7 y 38 aceptan cualquier manejador abierto, venga de 4 o de 37.

### 9.4 Salidas al anfitrión

**37 — abrir en el anfitrión** (`serve_host_open`, `so/janaxos.asm:2577-2636`)

- Requiere `R_READ` y que **ningún** portero en el camino del portero de archivos tenga prefijo ([§7.2](#72-prefijo-de-etiqueta)); si no, `denied`
  +1 y −1.
- `E.a`, `E.b` = ruta del anfitrión en UTF-8; 1 ≤ `E.b` ≤ 1023 (`WIDE_CAP` − 1, `so/janaxos.asm:373`); UTF-8 válido
  ([§10.2 paso 3](#102-de-etiqueta-a-nombre-de-archivo)). No se normaliza.
- `CreateFileW(ruta, GENERIC_READ, FILE_SHARE_READ|FILE_SHARE_WRITE, OPEN_EXISTING)`. Una ruta relativa se resuelve
  contra el directorio actual del núcleo. El núcleo no impone lista de carpetas prohibidas para este pedido: el
  límite es lo que el usuario del anfitrión pueda abrir para lectura.
- `E.r` = manejador (sólo lectura: un [pedido 6](#93-archivos-del-sistema) sobre él falla en el anfitrión y responde −1).

**39 — lo nuevo del anfitrión** (`gate_hostnew`, `so/vigia.inc:657-701`)

- Requiere `R_READ`, ningún prefijo en el camino y al menos una carpeta en `JANAX_VIGIA` (`hw_n` > 0); si no, −1.
- Marca la cabina como interesada (`P_HOSTW` = 1): desde entonces, mientras espere un saludo (29) o duerma sobre la
  pantalla (41), un archivo nuevo del anfitrión la despierta ([§9.7](#97-comunicación-entre-cabinas), pedido 32).
- Si la fila de novedades está vacía: `E.r` = 0. Si no, toma la más antigua `{qword longitud, ruta UTF-8 rellenada a
  8}`: si su longitud > `E.b` o `[E.a, E.a + longitud)` es inválido, −1 y la novedad queda en la fila; si no, copia
  la ruta (sin terminador), la saca de la fila y `E.r` = su longitud.
- Qué archivos llegan a la fila (carpetas de `JANAX_VIGIA` con subcarpetas, quietud `HW_QUIET` = 67803 ms,
  atributos, dueño, exclusión de la carpeta propia, el tablero y las carpetas conocidas de datos de programas) se
  especifica en el [capítulo 05](05-nucleo-pantalla-teclado-vigia.md#10-vigía-y-centinela) (`so/vigia.inc:1-12`, `so/vigia.inc:515-601`, `so/janaxos.asm:308-358`).

### 9.5 Porteros

**8 — ceder** (`gate_cede`, `so/janaxos.asm:3890-3903`): `E.a` = nodo de la cabina ([§7.1](#71-porteros), `mine`); `E.b` = derechos.
Crea un nodo hijo de `E.a`, de la misma puerta, con derechos `E.b` ∧ derechos de `E.a`. `E.r` = número del nodo.

**9 — usar** (`gate_use`, `so/janaxos.asm:3906-3917`): `E.a` = nodo de la cabina. Pasa a ser su portero para la
puerta de ese nodo. Como el nodo debe estar por debajo del portero actual, sólo se puede descender. `E.r` = 0.

**10 — revocar** (`gate_revoke`, `so/janaxos.asm:3920-3933`): `E.a` = nodo de la cabina distinto de su portero actual
para esa puerta. `N_ALIVE` = 0: el nodo y su rama dejan de permitir. `E.r` = 0.

**11 — consultar** (`gate_consult`, `so/janaxos.asm:3936-3946`): `E.a` = puerta 1..3. `E.r` = número del portero
actual de la cabina para esa puerta; −1 si la puerta no existe.

**15 — ceder con etiqueta** (`gate_cede_label`, `so/janaxos.asm:3953-4005`)

- `E.a` = nodo de la cabina; `E.b` = dirección de un bloque {qword derechos, qword longitud `L`, `L` bytes de
  prefijo}, entero (16 + `L` bytes) dentro de sus salas, con `L` > 0.
- El prefijo se normaliza (NFC, con el límite `L` ≤ `WIDE_CAP` = 1024 de `normalize_bytes`) y debe estar permitido
  por la cadena de prefijos que sube desde `E.a`: un hijo nunca escapa del prefijo de su padre.
- Crea un nodo hijo de `E.a` con derechos ∧ y ese prefijo. `E.r` = número del nodo.
- Errores: bloque fuera de sus salas, `L` = 0, `L` + 16 desborda, o prefijo no UTF-8 / demasiado largo: −1 sin sumar
  `denied`. Prefijo no permitido por la cadena: −1 y `denied` +1 (`gate_refused`, `so/janaxos.asm:3984-3989`).

En 8, 9, 10 y 15, un nodo que no es de la cabina responde −1 y suma `denied` (`gate_refused`,
`so/janaxos.asm:5209-5212`). Los nodos se numeran globalmente en orden de creación; la tabla se duplica al llenarse
(`new_node`, `so/janaxos.asm:3718-3804`).

### 9.6 Familia

**16 — lanzar** (`family_launch`, `so/janaxos.asm:4442-4495`)

1. `E.a`, `E.b` = etiqueta del programa; pasa por `label_path` y el prefijo.
2. Se lee el archivo (`OPEN_EXISTING`, sólo lectura) hasta `MAX_PROGRAM` = 2^20 bytes; palabras = bytes / 4 (los
   bytes sobrantes se ignoran).
3. Se crea la cabina hija (`make_process`): padre = quien pide; derechos pedidos = `E.alto` (recortados por puerta,
   [§7.1](#71-porteros)); sin prefijo propio (hereda los de su padre por el árbol); bolita y techo de bolita = `P_PRIO` actual del
   padre; nace con la dote y la asociación del padre; `P_SIGNED` = `P_SIGNNEXT` del padre, que vuelve a 0.
4. Datos iniciales: el archivo de la etiqueta con extensión `.datos` ([§10.4](#104-datos-iniciales-datos)), si el prefijo lo permite.
5. `E.r` = número del hijo; −1 si la etiqueta o el prefijo fallan, si `CreateFileA` no abre el archivo o si no hay
   memoria para el búfer de carga (`program_buffer`). El resultado de `ReadFile` no se comprueba
   (`so/janaxos.asm:4463-4469`): un error de lectura produce un hijo con las palabras leídas hasta ese momento
   (posiblemente 0), no −1.

Un programa con las mismas palabras que otro ya cargado comparte su texto y su tabla decodificada
(`share_program`, `so/janaxos.asm:1371-1432`).

**17 — firmar** (`family_sign`, `so/janaxos.asm:4498-4523`)

- `E.a` = número de registro ([§7.5](#75-registro-de-pedidos-en-espera)); debe ser < `nrecs`, tener `R_SIGNER` = quien pide y estado 0.
- `E.b` ≠ 0 firma (estado 1); `E.b` = 0 rechaza (estado 2). Decrementa `P_BLOCKS` del firmante y `P_WAITING` del
  hijo; si este llega a 0, el hijo vuelve a la fila.
- `E.r` = 0; −1 si el registro no es válido para quien pide.

**18 — pendientes** (`family_pending`, `so/janaxos.asm:4527-4565`)

- `[E.a, E.a + E.b)` dentro de sus salas. Escribe, por cada registro con `R_SIGNER` = quien pide y estado 0, tres
  qwords {número de registro, número del hijo, clase}, mientras queden ≥ 24 bytes.
- `E.r` = cantidad escrita (si la zona se llena, la cantidad hasta ahí, no −1); −1 si la zona es inválida.

**19 — estado** (`family_state`, `so/janaxos.asm:4569-4585`): `E.a` = hijo. `E.r` = su código de salida si terminó;
−1 si sigue; −2 si no es hijo de quien pide.

**20 — bolita** (`family_bolita`, `so/janaxos.asm:5199-5207`)

- `E.a` = bolita deseada en 1/65536 (comparación sin signo). Se recorta a `P_PRIO_TOP` (la bolita con que nació).
- `P_PRIO` = ese valor y se [recalcula el turno](03-nucleo-arranque-memoria-procesos.md#123-turno-por-prioridad-cuanto) (`plan_quantum`, `so/ayudantes.inc:96-125`).
- `E.r` = la bolita fijada.

**33 — terminar hijo** (`family_end`, `so/janaxos.asm:4593-4625`)

- `E.a` = hijo. Si ya terminó: `E.r` = su código. Si otro remero lo está ejecutando: se marca `P_KILL` y termina al
  acabar ese turno con código 9; `E.r` = −1. Si no: termina ya, con toda su línea, código `CODE_ENDED` = 9; se
  rechazan sus pedidos en espera, se toca el timbre del padre, se cierran sus archivos y se liberan sus salas
  (`cabin_end`, `so/janaxos.asm:5069-5090`); `E.r` = 9.
- −2 si no es hijo.

**34 — presupuesto** (`family_budget`, `so/janaxos.asm:4719-4742`)

- `E.a` = hijo; `E.b` = instrucciones adicionales (0 = sin límite). `P_LIMIT` = `P_SERVED` + `E.b` (o 0).
- Al final de cada turno, si `P_SERVED` ≥ `P_LIMIT` ≠ 0, el hijo termina con su línea y código `CODE_SPENT` = 10
  (`so/remos.inc:243-253`). El límite se controla por turno: puede excederse hasta en un turno.
- `E.r` = 0; el código si ya terminó; −2 si no es hijo.

**35 — remado** (`family_rowed`, `so/janaxos.asm:4747-4764`): `E.a` = −1 (sí mismo) o hijo. `E.r` = `P_SERVED`
(instrucciones ejecutadas; la propia cuenta hasta el turno anterior). −2 si no es ninguno.

**36 — rehacer** (`family_remake`, `so/janaxos.asm:4772-4837`; `cabin_remake`, `so/janaxos.asm:4841-4879`)

- `E.a`, `E.b` = etiqueta del programa, como en 16. Se lee y se guarda una copia; un segundo pedido reemplaza al
  primero. Los datos iniciales pasan a ser los `.datos` de la nueva etiqueta (o ninguno).
- No tiene efecto inmediato. Cuando la cabina termina por sí misma con código 0 (`jhalt`), en lugar de terminar se
  rehace (`so/remos.inc:266-271`): se cierran sus archivos y se liberan sus salas, listas y buzones; se instala el
  programa nuevo; registros, pc, profundidad, salas, esperas y vigilancias vuelven a cero. Conserva número, padre,
  hijos, porteros, bolita, presupuesto, `P_SERVED` y firmas. Debe emitir de nuevo la [primera orden](#32-primera-orden-construcción-de-la-sala-0).
- Una terminación con código ≠ 0 termina normalmente.
- `E.r` = 0; −1 si la etiqueta o el prefijo fallan, si el archivo no se abre o si falta memoria (búfer de carga o
  copia propia). Como en 16, el resultado de `ReadFile` no se comprueba. La copia de un pedido 36 anterior se libera
  antes de reservar la nueva (`so/janaxos.asm:4797-4811`): si esa reserva falla, el pedido responde −1 y la cabina
  queda sin rehacer pendiente.

**42 — remar en los huecos** (`family_gaps`, `so/janaxos.asm:4694-4713`)

- `E.a` = hijo o la propia cabina; `E.b` ≠ 0 activa, 0 desactiva (`P_GAPS`).
- Mientras un remero ejecuta esa cabina, su hilo usa `THREAD_PRIORITY_IDLE` (−15) del anfitrión; el cambio se pide al
  anfitrión sólo cuando difiere de la cabina anterior (`so/remos.inc:222-227`, `gaps_set`, `so/remos.inc:114-130`).
- `E.r` = 0; −2 si no es hijo ni ella misma.

**45 — heredar firmas** (`family_inherit`, `so/janaxos.asm:4273-4294`)

- `m` = `signed_mask(quien pide)` ∧ `E.b`.
- `E.a` = 0: `P_SIGNNEXT` = `m` (lo toma el próximo pedido 16). `E.a` = hijo: `P_SIGNED` del hijo = `m` de inmediato
  (también sirve para retirar firmas).
- `E.r` = `m`; −2 si `E.a` no es 0 ni un hijo.

**46 — nombrar** (`family_name`, `so/janaxos.asm:4634-4686`)

- `E.a` = número de una cabina viva X cuyo padre P no es el núcleo ni quien pide, y tal que quien pide es el padre
  de P o un ancestro más alto.
- `P_PARENT(X)` = padre de P (X pasa a ser hermano de P y sobrevive a P). Los registros de X en espera de la firma de
  P pasan al nuevo padre. Los porteros de X no cambian.
- `E.r` = 0; −2 en cualquier otro caso.

### 9.7 Comunicación entre cabinas

**28 — saludar** (`greet`, `so/ambientes.inc:1455-1499`)

- `E.a` = cabina destino de la familia (−1 = el padre).
- Agrega una marca con quien saluda a la lista `P_GREET` del destino, salvo que ya tenga una de él (una marca por
  saludador, sin acumular). Si el destino espera un saludo (`P_GWAIT` = 1) se despierta; si duerme sobre la pantalla
  (41) también se despierta (`event_wake`), y su pedido 41 responde 0 salvo que al atenderse ya haya un evento
  guardado (entonces 1).
- `E.r` = 0; −1 si no es familia, terminó o falta memoria.
- El núcleo también saluda: al padre cuando un hijo termina (`ring_parent`, `so/janaxos.asm:4884-4898`) o pide una
  firma ([§5 paso 2.5](#5-procesamiento-de-un-toque)).

**29 — esperar un saludo** (`greeting`, `so/ambientes.inc:1504-1525`)

- Si no hay marcas y todavía alguien podría saludar, el toque entero duerme ([§3.4](#34-suspensión-y-reejecución)) hasta que llegue un saludo.
- Al atender: `E.r` = número de la cabina del saludo más antiguo, y esa marca se quita. −1 si nadie queda que pueda
  saludar (`P_GWAIT` = 2, fijado por `greet_nobody` cuando ningún remero tiene trabajo, `so/ambientes.inc:1604-1623`).
- Un despertar por vigilancia (32) o por novedad del anfitrión (39) es un saludo de la cabina a sí misma
  (`watch_wake`, `so/ambientes.inc:1981-2009`): `E.r` = su propio número.

**30 — decir una palabra** (`say_word`, `so/ambientes.inc:1543-1569`)

- `E.a` = cabina de la familia (−1 = el padre); `E.b` = la palabra (8 bytes).
- Agrega {número de quien dice, palabra} (16 bytes) al final del buzón `P_SAID` del destino y lo saluda (28). Nadie
  espera respuesta.
- `E.r` = 0; −1 si no es familia o terminó.

**31 — leer una palabra** (`hear_word`, `so/ambientes.inc:1573-1601`)

- `[E.a, E.a + 16)` dentro de sus salas. Copia la carta más antigua {qword número de quien dijo, qword palabra} y la
  quita del buzón.
- `E.r` = 1; 0 si el buzón está vacío; −1 si la zona es inválida.

**32 — vigilar** (`gate_watch`, `so/ambientes.inc:1635-1674`; `watch_wait`, `so/ambientes.inc:1680-1820`)

- `E.a` = bytes del prefijo, 0..8 (> 8: −1); `E.b` = qword cuyos primeros `E.a` bytes (little-endian) son el
  prefijo. `E.a` = 0 borra todas las vigilancias de la cabina. Un par (`E.a`, `E.b`) idéntico (qword entero) a uno ya
  registrado no se duplica.
- El prefijo no se normaliza ni se contrasta con los prefijos de los porteros.
- Efecto: cuando ningún remero tiene trabajo y la cabina espera un saludo (29), el núcleo duerme sobre
  `ReadDirectoryChangesW` de la carpeta propia y la del tablero (no recursivo, filtro `11h` = cambio de nombre de
  archivo + última escritura, `so/ambientes.inc:1848`). Un cambio en un archivo cuyo nombre en hexadecimal empieza
  por la codificación hexadecimal del prefijo (comparación insensible a mayúsculas, `so/ambientes.inc:1917-1978`)
  despierta a la cabina con un saludo de sí misma. Si el anfitrión informa desborde (0 bytes), despiertan todas las
  que vigilan.
- `E.r` = 0; −1 si `E.a` > 8 o falta memoria.

### 9.8 Pantalla, sonido y portapapeles

Contratos observables; la ventana, su hilo y el formato de nube se especifican en el [capítulo 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn). Los valores de
respuesta de 40, 43, 44 y 47 provienen de las cabeceras de `so/pantalla.inc` y de los servidores; el detalle interno
no se verifica en este capítulo.

**40 — mostrar** (`serve_show`, `so/janaxos.asm:2685-2714`): `[E.a, E.a + E.b)` = [nube `.nube` versión 3](05-nucleo-pantalla-teclado-vigia.md#41-formato-nube-versión-3-lo-que-lee-el-núcleo). Dibuja su
primer nivel. `E.r` = partículas dibujadas; −1 si el rango es inválido o la nube está mal formada. Según la cabecera
de `screen_show` (`so/pantalla.inc:138-140`), mal formada es: firma o versión incorrectas, ningún nivel, un tamaño
que excede los bytes, o un lado 0 o mayor que `SCR_SIDE` = 4096 (`so/pantalla.inc:14`) (la lista proviene de la
cabecera; el formato se especifica en el [capítulo 05 §4.1](05-nucleo-pantalla-teclado-vigia.md#41-formato-nube-versión-3-lo-que-lee-el-núcleo)).

**41 — esperar un evento** (`serve_wait_event`, `so/janaxos.asm:2812-2873`; `event_must_wait`,
`so/janaxos.asm:2878-2923`)

- `E.a` = registro de 32 bytes {kind, x, y, extra} (cuatro qwords, copiados por `screen_take`,
  `so/pantalla.inc:991-1025`); `E.b` = espera máxima en ms: 0 sin espera; ≥ `0FFFFFFFFh` para siempre.
- Duerme (el toque entero) si el registro es válido, `E.b` ≠ 0, la ventana vive y no tiene eventos ni texto pegado
  pendiente (`screen_waitable`, `so/pantalla.inc:976-987`). La cuenta del plazo empieza en el marcado.
- La despiertan: un evento, el cierre de la ventana, el vencimiento del plazo, un saludo (28/30, timbre) o, si la
  cabina pidió alguna vez el 39, una novedad del anfitrión (`hw_wake`, `so/vigia.inc:135-166`).
- `E.r` = 1 con el evento más antiguo escrito; 0 sin evento (plazo vencido, despertada por timbre, o sin ventana);
  −1 si el registro es inválido.
- `E.b` de vuelta: si durmió con plazo finito, los ms que quedaban (≥ 0); si no durmió y no hubo evento, 0; si no
  durmió y hubo evento, o la espera era para siempre, sin cambios.
- Tipos de evento (cabecera, `so/pantalla.inc:496-505`): 1 movimiento, 2 botón abajo, 3 botón arriba, 4 tecla, 5
  ventana cerrada, 6 nuevo tamaño, 7 carácter, 8 foco; detalle en el [capítulo 05](05-nucleo-pantalla-teclado-vigia.md#62-tipos-de-evento).

**43 — título** (`serve_title`, `so/janaxos.asm:2719-2747`; `screen_title`, `so/pantalla.inc:109-136`):
`[E.a, E.a + E.b)` = texto. `E.r` = min(`E.b`, `SCR_TITLE_MAX` = 512, `so/pantalla.inc:22`); −1 si el rango es
inválido. Cada byte se convierte en una unidad UTF-16 de igual valor (no se decodifica UTF-8: un texto no ASCII se
ve como Latin-1). No requiere ventana viva: sin ventana el título se guarda para cuando la ventana nazca y la
respuesta es la misma.

**44 — nota** (`serve_note`, `so/janaxos.asm:2785-2805`): `E.a` = mensaje MIDI de tres bytes en sus 24 bits bajos.
`E.r` = 1 sonó; 0 sin ventana; −1 el anfitrión no tiene sintetizador.

**47 — copiar** (`serve_copy`, `so/janaxos.asm:2753-2781`): `[E.a, E.a + E.b)` = texto UTF-8; va al portapapeles del
anfitrión. `E.r` = número de unidades UTF-16 resultantes (`MultiByteToWideChar` con `MB_ERR_INVALID_CHARS`,
`so/pantalla.inc:858-919`); 0 sin ventana (se comprueba antes que el texto); −1 rango inválido, no UTF-8, `E.b` = 0
con ventana viva, o falta de memoria. Pegar no es un pedido: Ctrl+V llega como
caracteres tecleados ([capítulo 05](05-nucleo-pantalla-teclado-vigia.md#73-pegado-ctrlv)). Es importante: un hijo necesita firma.

---

## 10. La casa de archivos

### 10.1 Carpetas

| Carpeta | Origen | Fuente |
|---|---|---|
| Propia | Variable `JANAX_ARCHIVOS`; si no está, `janax_archivos` (relativa al directorio actual del núcleo). Se crea al arrancar con `CreateDirectoryA` (un solo nivel; si ya existe, se usa). | `so/janaxos.asm:283-287`, `so/janaxos.asm:697-716` |
| Tablero | Variable `JANAX_TABLERO`, opcional. Carpeta compartida por varios núcleos. No se crea. | `so/janaxos.asm:290-293`, `so/janaxos.asm:709-710` |

Ambas variables se leen con `GetEnvironmentVariableA` y un búfer de `HOST_PATH` − 1 = 259 caracteres ANSI; el valor
devuelto por la función se guarda sin comprobar como `dir_len` / `board_len` (`so/janaxos.asm:697-710`). Para un valor
que no cabe, la función del anfitrión devuelve el tamaño requerido sin escribir el búfer; con ese `dir_len` ≥ 259 la
comprobación de longitud de [§10.2 paso 6](#102-de-etiqueta-a-nombre-de-archivo) rechaza toda etiqueta (deducido del contrato documentado de la función del
anfitrión; no verificado en ejecución).

### 10.2 De etiqueta a nombre de archivo

`label_path` (`so/janaxos.asm:3155-3222`) con `normalize_bytes` (`so/janaxos.asm:3074-3101`):

1. La etiqueta `[a, a + b)` debe estar dentro de sus salas y `b` ≥ 1.
2. `b` ≤ `WIDE_CAP` = 1024 bytes.
3. UTF-8 estricto (`utf8_ok`, `so/janaxos.asm:3639-3708`): secuencias de 1 a 4 bytes; primer byte `00-7F`, `C2-DF`,
   `E0-EF` o `F0-F4`; sin formas sobrelargas (tras `E0` el segundo byte ≥ `A0`; tras `F0` ≥ `90`), sin sustitutos
   (tras `ED` el segundo ≤ `9F`), nada por encima de U+10FFFF (tras `F4` el segundo ≤ `8F`); bytes de continuación
   `80-BF`; sin secuencias truncadas.
4. Conversión a UTF-16 (`MultiByteToWideChar`, hasta 1024 unidades), normalización Unicode NFC
   (`NormalizeString(NormalizationC)`) y vuelta a UTF-8 (hasta `NORM_CAP` = 4096 bytes). Resultado: `n` bytes
   normalizados. Dos etiquetas canónicamente equivalentes son el mismo archivo.
5. Carpeta: la del tablero si `JANAX_TABLERO` está definido, `n` ≥ 8 y los primeros 8 bytes normalizados son
   `tablero/`; en otro caso, la propia. La etiqueta completa (incluido `tablero/`) se codifica.
6. Ruta = carpeta + `\` + cada byte normalizado como dos dígitos hexadecimales en **minúscula** (nibble alto primero)
   + NUL. Debe cumplirse `longitud_carpeta_propia + 2n + 2` ≤ 260 (`HOST_PATH`) para toda etiqueta; para una
   etiqueta del tablero se exige además `longitud_tablero + 2n + 2` ≤ 260 (`so/janaxos.asm:3172-3176`,
   `so/janaxos.asm:3189-3193`).
7. Cualquier fallo: la etiqueta es inválida.

Ejemplos: la etiqueta `a/b` (bytes `61 2F 62`) es el archivo `612f62`; `ñ` escrita como `n` + U+0303 (`6E CC 83`) se
normaliza a U+00F1 (`C3 B1`) y es el archivo `c3b1`.

Propiedades que resultan del algoritmo:

- Ninguna etiqueta produce separadores, `..` ni rutas absolutas: un programa no puede salir de la carpeta propia o
  del tablero por etiquetas, ni crear subcarpetas.
- Los nombres son siempre válidos en el anfitrión e insensibles al problema de mayúsculas/minúsculas.
- Los archivos internos del núcleo en la carpeta propia que no son hexadecimal en minúscula (por ejemplo
  `calibracion`, `so/janaxos.asm:482`, `so/janaxos.asm:1641-1649`) no son alcanzables por etiqueta ni aparecen en el
  listado.
- La etiqueta máxima depende de la carpeta: `n` ≤ ⌊(258 − longitud_carpeta_propia) / 2⌋ bytes normalizados; para
  una etiqueta del tablero, `n` ≤ ⌊(258 − max(longitud_carpeta_propia, longitud_tablero)) / 2⌋.

### 10.3 Del nombre de archivo a la etiqueta (listado)

`list_decode` (`so/janaxos.asm:3423-3473`): el nombre ANSI devuelto por el anfitrión (`cFileName` en el desplazamiento
`FIND_NAME` = 44 de `WIN32_FIND_DATAA`, `so/janaxos.asm:382`) debe ser una secuencia no vacía de pares de dígitos
`0-9a-f` en minúscula, de hasta 4095 bytes decodificados (al llegar a `NORM_CAP` = 4096 se rechaza,
`so/janaxos.asm:3439-3441`), cuyo resultado sea UTF-8 válido. En otro caso se omite. El resultado no se vuelve a
normalizar.

### 10.4 Datos iniciales (`.datos`)

`data_name` (`so/datos.inc:10-42`): se reemplaza la última extensión de la etiqueta (el último `.` que no esté antes
de un `/` o `\`) por `.datos`, o se agrega si no hay extensión. Para un proceso lanzado por pedido (16, 36) ese nombre
es otra etiqueta y pasa por [§10.2](#102-de-etiqueta-a-nombre-de-archivo) y el prefijo del lanzador (`family_data`, `so/datos.inc:90-118`); para la línea de
comandos es una ruta del anfitrión junto al programa. El contenido (hasta `MAX_PROGRAM` = 2^20 bytes) se copia al
inicio de la sala 0 en la [primera orden](#32-primera-orden-construcción-de-la-sala-0); si no cabe, la primera orden termina el proceso con código 5.

Detalles de `family_data` y `read_data` (`so/datos.inc:47-118`):

- `data_name` opera sobre los bytes de la etiqueta tal como están en la cola (antes de normalizar), en un búfer de
  `DATA_LABEL` = 512 bytes (`so/janaxos.asm:371`): si `longitud + 7` > 512 (etiqueta de más de 505 bytes), el hijo
  nace sin datos iniciales. El nombre resultante pasa luego por `label_path_ptr` (normalización y carpeta, §10.2).
- Archivo inexistente, vacío, no permitido por el prefijo (suma `denied`) o falta de memoria: sin datos iniciales,
  sin error para el pedido. El resultado de `ReadFile` no se comprueba.

### 10.5 Qué puede tocar un programa en el anfitrión

| Medio | Alcance | Condiciones |
|---|---|---|
| Etiquetas (4, 5, 6, 12, 13, 14, 16, 36, `.datos`) | Sólo archivos directamente dentro de la carpeta propia o del tablero, con nombre hexadecimal. Lectura y escritura. | Derechos de la puerta 3 y prefijo del portero. |
| Pedido 37 | Cualquier archivo existente que el usuario del anfitrión pueda abrir, sólo lectura. | `R_READ`, ningún prefijo en el camino. Sin lista de exclusión en el núcleo. |
| Pedido 39 | Sólo rutas (no contenido) de archivos nuevos y quietos bajo las carpetas de `JANAX_VIGIA` que pasan las [reglas del vigía](05-nucleo-pantalla-teclado-vigia.md#107-quietud-reglas-y-lista-de-listos); excluye carpeta propia, tablero, ocultos, de sistema, nombres con `.` inicial, y los datos de programas (`LocalAppData`, `RoamingAppData`, `LocalAppDataLow`, `ProgramData`); `Windows` y `Program Files` sólo se aceptan como lectura de sistema. | `R_READ`, ningún prefijo; detalle en capítulo 05 (`so/vigia.inc:515-601`, `so/janaxos.asm:332-358`). |
| Pedido 1 | Salida estándar del núcleo. | `R_SCREEN`. |
| Pedidos 40, 41, 43, 44, 47 | Ventana propia, sintetizador MIDI, portapapeles. | `R_SCREEN`. |
| `jhost` | Nada (catálogo vacío, [§11](#11-la-ventana-al-anfitrión-jhost)). | — |

Un programa no puede borrar, renombrar ni escribir fuera de la carpeta propia y del tablero, ni abrir nada del
anfitrión para escritura.

---

## 11. La ventana al anfitrión: `jhost`

[`host_window`](05-nucleo-pantalla-teclado-vigia.md#124-janaxos-host_window) (`so/anfitrion.inc:6-30`), llamada por `op_jhost` (`so/janaxos.asm:2166-2172`) y `t_jhost`
(`so/rutinas.inc:601-609`):

| Desplazamiento del bloque | Campo |
|---|---|
| +0 | pedido |
| +8 | a |
| +16 | b |
| +24 | c |

1. Los 32 bytes del bloque deben estar dentro de sus salas; si no, el proceso termina con código 5.
2. La dirección del bloque debe ser múltiplo de 8; si no, código 6.
3. Pedido 0 (catálogo): `a` debe ser múltiplo de 8 (si no, código 6). Respuesta 0: el catálogo de JanaxOS está vacío
   y no se escribe nada.
4. Cualquier otro pedido: respuesta −1.

`rd` recibe la respuesta; los demás registros se preservan. `jhost` no toma el candado, no pasa por porteros ni
firmas.

---

## 12. Códigos de terminación relacionados con la ABI

| Código | Causa | Fuente |
|---|---|---|
| 0 | `jhalt` | `so/janaxos.asm:1883-1885` |
| 1 | Opcódigo inválido | `so/janaxos.asm:1886-1888` |
| 2 | Fuera del programa | `so/janaxos.asm:1889-1891` |
| 5 | Memoria fuera de sus salas; cola inválida; primera orden imposible; `jhost` con bloque fuera | `so/janaxos.asm:1892-1894`, `so/janaxos.asm:2198-2200`, `so/anfitrion.inc:25-27` |
| 6 | Acceso desalineado; `jhost` desalineado | `so/janaxos.asm:1895-1897`, `so/anfitrion.inc:28-30` |
| 7 | Demasiadas llamadas anidadas | `so/janaxos.asm:1898-1900` |
| 8 | `jret` sin `jcall` | `so/janaxos.asm:1901-1902` |
| 9 | Terminado por el padre (33) o por fin de línea | `so/janaxos.asm:4593`, `so/janaxos.asm:5077` |
| 10 | Presupuesto agotado (34) | `so/janaxos.asm:4594`, `so/remos.inc:248` |

El núcleo mismo sale con 0, con 3 (un programa no puede leerse, o falta memoria) o con 4 (sin programas o argumento
mal formado) (`so/janaxos.asm:5286-5290`).

La salida con 3 por falta de memoria también puede provocarla un pedido: `new_node` (pedidos 8, 15 y el nacimiento
por 16), `new_record` (un pedido importante que crea su registro de firma), `make_process` y `share_program` (16, 36)
saltan a `fail_file` si `VirtualAlloc` falla (`so/janaxos.asm:3735`, `so/janaxos.asm:3765`, `so/janaxos.asm:4073`,
`so/janaxos.asm:1279`, `so/janaxos.asm:1408`), lo que termina el núcleo entero, no sólo la cabina.

---

## 13. Contadores observables

Al terminar, el núcleo informa por la salida estándar (`so/janaxos.asm:1141-1180`):

- Si hubo pedidos: `ventanilla: pantallas=<nscreens> resintonias=<retunes> llamadas al anfitrion=<hostcalls> pedidos=<requests>`.
- Si hubo rechazos: `porteros: nodos=<nnodes> negados=<denied>`.

`requests` suma `N` de cada toque atendido (los suspendidos se descuentan y se cuentan al atenderse). `denied` cuenta:
rechazos por portero en el marcado; firmas rechazadas; prefijos de archivos rechazados por `files_prefix_ok` (pedidos
4, 12, 13, 16, 36 y la etiqueta `.datos` de 16/36); `gate_refused` en 8, 9, 10 y 15 (nodo ajeno, intento de revocar el
propio portero en 10, prefijo no permitido en 15); y el rechazo por prefijo de 37. No cuentan: el rechazo por prefijo
de 39 (`so/vigia.inc:659-663`), las etiquetas omitidas en el listado 14, ni los bloques inválidos de 15.

---

## 14. Invariantes

1. El núcleo escribe en la memoria de una cabina sólo: la cola del toque (respuestas, `b` del 41 y `N` = 0), las zonas
   de destino de 5, 14, 18, 31, 39 y 41, la sala 0 en la primera orden y el contenido inicial de las salas que crea
   (ceros en 2; la concatenación en 26).
2. Una cabina nunca obtiene más derechos que su padre: todo nodo nuevo es AND con su padre ([§7.1](#71-porteros), [§9.5](#95-porteros)); todo trato
   dado está contenido en el del dador ([§9.2](#92-memoria-y-cajas)); la bolita no supera la de nacimiento; las firmas heredadas son AND por
   toda la línea.
3. Un pedido que el portero o la firma rechazan nunca se ejecuta parcialmente.
4. Mientras un toque está suspendido, la cabina no ejecuta instrucciones y su cola no cambia.
5. La sala que contiene la cola no puede destruirse, moverse, fundirse ni perder el permiso de escritura en el mismo
   toque (§9.2).
6. El cartel de una cabina sólo cambia por pedidos de la propia cabina, salvo durante su nacimiento (dote y
   asociación) y cuando termina o se rehace (`cabin_free`, `so/ambientes.inc:2049-2108`), incluida la terminación
   por su padre (33) o por fin de línea.
7. El estado de pantallas y sintonías es global y está protegido por el candado del núcleo; los toques de cabinas
   distintas se serializan.

---

## 15. Elementos no verificados

- Comportamiento con `JANAX_ARCHIVOS` o `JANAX_TABLERO` de 259 caracteres o más: deducido del contrato de
  `GetEnvironmentVariableA`, no ejecutado ([§10.1](#101-carpetas)).
- Pérdida de una decisión de firma consumida en un toque que luego se suspende: deducida del código, no ejecutada
  ([§3.4](#34-suspensión-y-reejecución)).
- Orden de las entradas del listado (14): el que entregue `FindFirstFileA`/`FindNextFileA` ([§9.3](#93-archivos-del-sistema)).
- Transferencia de 0 bytes en 5/6 con `b` = 2^32 por truncamiento a 32 bits del parámetro del anfitrión (§9.3).
- Semántica detallada de la selección Venn del pedido 27 (tomada de la cabecera de `so/venn.inc`) ([§9.2](#92-memoria-y-cajas)).
- Detalle interno de los pedidos 40, 41, 43, 44 y 47 (formato `.nube`, tipos de evento, sintetizador, portapapeles):
  contrato tomado de las cabeceras de `so/pantalla.inc`; especificado en el [capítulo 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn) ([§9.8](#98-pantalla-sonido-y-portapapeles)).
