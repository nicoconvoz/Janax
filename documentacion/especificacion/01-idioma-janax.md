# 01. El idioma Janax: máquina virtual, codificación e instrucciones

**Alcance.** Este capítulo especifica el idioma Janax en su versión v0 tal como lo implementa el escalón 0:
el modelo de máquina (registros, memoria de programa, memoria de datos, pila de retorno), la codificación
binaria de cada instrucción, la semántica exacta de las 29 instrucciones definidas y de las construcciones
de ensamblado (`jwhile`, `jwhilez`, `jwcheck`, `jwend`, `jfirst`), el protocolo de la ventana al anfitrión
(`jhost`), la sintaxis del fuente `.jsm`, el formato de los archivos resultantes (`.bin`, `.datos`,
`.huella`) y el esquema con que los traductores convierten Janax a código nativo x86-64 y ARM64. No cubre:
el funcionamiento interno del ensamblador PDP ni la cadena de construcción ([capítulo 02](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas)), los procesos,
ambientes y motores de ejecución de Janax OS ([capítulo 03](03-nucleo-arranque-memoria-procesos.md#03-núcleo-janaxos-arranque-memoria-procesos-firmas-y-planificación)), los pedidos de la instrucción `jsys` ([capítulo 04](04-nucleo-abi-de-pedidos.md#04-núcleo-janaxos-abi-de-pedidos-llamadas-al-sistema)),
pantalla, teclado y vigía ([capítulo 05](05-nucleo-pantalla-teclado-vigia.md#05-núcleo-janaxos-pantalla-teclado-ventana-vigía-y-venn)), la lectura de Razar ([06](06-razar-lectura-y-organos.md#06-razar-lectura-órganos-recetas-juez-y-ortografía)), el cardumen ([07](07-razar-cardumen-canto-hilos.md#07-razar-cardumen-canto-memoria_pares-hilos-y-nitidez)), el cuerpo y la casa de
Luma ([08](08-luma-cuerpo-procesos-y-casa.md#08-luma-cuerpo-generadores-procesos-y-formato-de-su-casa)), la conversación ([09](09-luma-conversacion-y-respuesta.md#09-luma-el-protocolo-de-conversación-y-la-construcción-de-una-respuesta)), la pantalla y vida de Luma ([10](10-luma-pantalla-lluvia-y-organos-vivos.md#10-luma-pantalla-lluvia-hexadecimal-panel-criaturas-y-órganos-vivos)) ni el instalador y la publicación ([11](11-instalador-lanzador-y-publicacion.md#11-instalador-lanzador-y-publicación)).

Todas las rutas son relativas a la raíz del repositorio. Las citas `ruta:línea` señalan el código del que sale
cada afirmación.

---

## 1. Piezas normativas

| Pieza | Archivo | Rol |
|---|---|---|
| Notación del idioma (macros FASM) | `escalon0/janax.inc` | Define nombres de registros, la palabra de instrucción y una macro por instrucción (`escalon0/janax.inc:5-116`). |
| Intérprete de referencia | `escalon0/janax.asm` | Ejecuta un `.bin` palabra por palabra en Windows x86-64. Es la referencia contra la que se comparan los traductores (`escalon0/janax.asm:1-6`, `escalon0/pruebas/correr.sh:46`). |
| [Ventana al anfitrión](#7-protocolo-de-la-ventana-al-anfitrión-jhost) (Windows) | `escalon0/ventanita.inc`, `escalon0/ventanita_datos.inc` | Servicio de `jhost` compartido por intérprete y traductor x86-64. |
| Traductor x86-64 | `escalon0/traductor.asm` | Traduce el `.bin` completo a código x86-64 en memoria, lo ejecuta y guarda un caché incremental. |
| Traductor ARM64 cruzado | `escalon0/traductor_arm64.asm` | Corre en Windows x86-64 y escribe un ejecutable ELF64 estático para Linux ARM64. |
| [Ensamblador PDP](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas) | `so/pdp/ensamblador/ensamblador.jsm` + tabla `so/pdp/ensamblador/ensamblador.datos.jsm` | Convierte `.jsm` en `.bin`/`.datos`. Es el ensamblador que usa la batería de pruebas (`escalon0/pruebas/correr.sh:21-25`). Su sintaxis aceptada es la que se especifica en [la sección 8](#8-fuente-jsm). |
| Batería de conformidad | `escalon0/pruebas/*.jsm`, `escalon0/pruebas/correr.sh` | [Sección 14](#14-conformidad). |

Los tres ejecutores del escalón 0 (intérprete, traductor x86-64, ejecutable ARM64) DEBEN producir la misma
salida estándar y el mismo código de salida para cada programa de la batería (`escalon0/pruebas/correr.sh:46-57`,
`escalon0/pruebas/correr.sh:101-137`).

---

## 2. Notación

- `R[k]`: valor de 64 bits del registro `jk`, con `k` en 0..15.
- `M64[a]`: los 8 bytes de la memoria de datos en la dirección `a`, leídos o escritos en little-endian.
- `M8[a]`: el byte en la dirección `a`.
- `sext16(x)`: extensión con signo de 16 a 64 bits. `zext16(x)`, `zext8(x)`: extensión con ceros de 16 u
  8 bits a 64 bits.
- Toda la aritmética es módulo 2^64 (complemento a dos) salvo que se indique lo contrario.
- `>u`: comparación sin signo.
- Números con sufijo `h` son hexadecimales (convención del código fuente).
- `pc`: índice, en palabras, de la instrucción **siguiente** a la que se está ejecutando (el intérprete
  incrementa `pc` antes de ejecutar, `escalon0/janax.asm:112-113`).

---

## 3. Modelo de máquina

### 3.1 Estado

| Elemento | Definición | Fuente |
|---|---|---|
| Registros | 16 registros generales `j0`..`j15`, 64 bits cada uno. No hay registro de banderas, ni registro cero por hardware, ni registro `pc` visible. | `escalon0/janax.asm:20`, `escalon0/janax.inc:5-20` |
| Memoria de programa | Secuencia de `N` palabras de 32 bits, direccionada por índice de palabra desde 0. No es accesible por las instrucciones de memoria: no existe instrucción que lea o escriba palabras del programa. | `escalon0/janax.asm:84-94`, `escalon0/janax.asm:110-112` |
| Memoria de datos | `DATA_SIZE` = 2^20 = 1.048.576 bytes, direccionada por byte desde 0, inicializada en cero. Separada de la memoria de programa. | `escalon0/janax.asm:14`, `escalon0/janax.asm:96-100` |
| Pila de retorno | Pila de hasta `RET_DEPTH` = 4096 entradas, separada de la memoria de datos e inaccesible para el programa. | `escalon0/janax.asm:15`, `escalon0/janax.asm:34`, `escalon0/janax.inc:91` |

### 3.2 Constantes de la máquina (escalón 0)

| Constante | Valor | Qué mide | Fundamento según el código |
|---|---|---|---|
| `MAX_PROGRAM` | 1.048.576 bytes (2^20) | Bytes máximos que se leen del `.bin` | "criterion, not a measurement" (`escalon0/janax.asm:13`) |
| `DATA_SIZE` | 1.048.576 bytes (2^20) | Tamaño de la memoria de datos | "criterion, not a measurement" (`escalon0/janax.asm:14`); los traductores DEBEN usar el mismo valor (`escalon0/traductor.asm:30`, `escalon0/traductor_arm64.asm:24`) |
| `RET_DEPTH` | 4096 | Llamadas anidadas máximas | "criterion, not a measurement" (`escalon0/janax.asm:15`); igual en los traductores (`escalon0/traductor.asm:31`, `escalon0/traductor_arm64.asm:25`) |
| `OP_COUNT` | 1Dh = 29 | Cantidad de códigos de operación definidos (00h..1Ch) | `escalon0/janax.asm:16` |

Janax OS ejecuta el mismo idioma con otro modelo de memoria (ambientes creados a pedido) y con pila de retorno
que crece; esos detalles pertenecen al [capítulo 03](03-nucleo-arranque-memoria-procesos.md#6-modelo-de-memoria-de-un-proceso) ([sección 13](#13-otros-ejecutores-janax-os) de este capítulo).

### 3.3 Estado inicial (escalón 0)

- Todos los registros valen 0, excepto `j15 = DATA_SIZE` = 100000h (`escalon0/janax.asm:20`, `escalon0/janax.asm:101`;
  `escalon0/traductor.asm:1003`; `escalon0/traductor_arm64.asm:658-667`). Prueba: `escalon0/pruebas/28_pila_arranca_arriba.jsm`.
- Toda la memoria de datos vale 0 (`escalon0/janax.asm:96`; en ARM64 es memoria sin respaldo en el archivo,
  `escalon0/traductor_arm64.asm:793-795`). Prueba: `escalon0/pruebas/23_memoria_empieza_en_cero.jsm`.
- Pila de retorno vacía (profundidad 0) (`escalon0/janax.asm:104`).
- `pc` = 0: la ejecución empieza en la palabra 0 (`escalon0/janax.asm:105`).

### 3.4 Ciclo de ejecución

Cada paso (`escalon0/janax.asm:109-127`):

1. Si `pc >=u N`, termina con código 2. Como `pc` es un entero de 64 bits y la comparación es sin signo, un
   `pc` negativo también termina con código 2.
2. Lee la palabra `w = programa[pc]` y hace `pc = pc + 1`.
3. Decodifica `op = w[0..7]`; si `op >= 1Dh`, termina con código 1.
4. Ejecuta la instrucción.

La caída al final del programa (ejecutar la última palabra sin saltar ni terminar) produce código 2 en el
paso 1 siguiente. Prueba: `escalon0/pruebas/20_sin_halt.jsm`.

### 3.5 Terminación y códigos de salida

| Código | Condición | Producido por |
|---|---|---|
| 0 | `jhalt`. Se imprime `j0` en hexadecimal ([sección 10.3](#103-salida-de-jhalt)). | los tres ejecutores |
| 1 | Código de operación no definido (`op >= 1Dh`), o `16h` ([`jsys`](04-nucleo-abi-de-pedidos.md#3-convención-de-llamada-de-jsys)) fuera de Janax OS | `escalon0/janax.asm:31`, `escalon0/janax.asm:125-126`, `escalon0/janax.asm:392-393`; `escalon0/traductor.asm:227-230`; `escalon0/traductor_arm64.asm:410-412` |
| 2 | `pc` fuera de `[0, N)` al buscar la instrucción | `escalon0/janax.asm:110-111`; `escalon0/traductor.asm:232-235`; `escalon0/traductor_arm64.asm:609-610` |
| 3 | No se pudo abrir o leer el archivo, o reservar memoria (también al escribir el `.arm64`) | `escalon0/janax.asm:396-397`; `escalon0/traductor.asm:1087-1088`; `escalon0/traductor_arm64.asm:817-818` |
| 4 | Falta el argumento; en los traductores, también una ruta de más de 1024 bytes | `escalon0/janax.asm:398-399`; `escalon0/traductor.asm:596-598`; `escalon0/traductor_arm64.asm:499-501` |
| 5 | Acceso a memoria de datos fuera de rango (también en `jhost`) | `escalon0/janax.asm:400-401`; `escalon0/ventanita.inc:79-81` |
| 6 | Acceso de 64 bits desalineado (también en `jhost`) | `escalon0/janax.asm:402-403`; `escalon0/ventanita.inc:82-84` |
| 7 | `jcall`/`jcall0` con la pila de retorno llena | `escalon0/janax.asm:404-405` |
| 8 | `jret` con la pila de retorno vacía | `escalon0/janax.asm:406-407` |
| 9 | Sólo traductores: una palabra se tradujo a más bytes que su límite (x86-64: 255 bytes; ARM64: 11 instrucciones o prólogo de tamaño distinto de 26 instrucciones) | `escalon0/traductor.asm:859-862`, `escalon0/traductor.asm:1091-1092`; `escalon0/traductor_arm64.asm:594-597`, `escalon0/traductor_arm64.asm:693-696`, `escalon0/traductor_arm64.asm:821-822` |

En los códigos 1 a 9 no se imprime nada por la salida estándar desde la máquina (salvo lo que el programa
haya escrito con `jhost` antes del error).

### 3.6 Convenciones de software sobre registros (no impuestas por la máquina)

La máquina no da a ningún registro un uso especial, salvo el valor inicial de `j15` ([3.3](#33-estado-inicial-escalón-0)). Los programas del
repositorio aplican estas convenciones, que DEBEN tratarse como convenciones de cada programa y no como
parte del idioma:

| Registro | Convención | Dónde se declara |
|---|---|---|
| `j15` | Puntero de pila de datos; arranca en el tope de la memoria y crece hacia abajo. Apilar: `jsub j15, j15, j12` / `jst rX, j15, 0`. Desapilar: `jld rX, j15, 0` / `jadd j15, j15, j12`. | `so/pdp/ensamblador/ensamblador.jsm:16`, `so/pdp/ensamblador/ensamblador.jsm:183-186`, `so/pdp/ensamblador/ensamblador.jsm:213-216` |
| `j14` | Vale 0 durante todo el programa. Sirve de base para direcciones absolutas `jld rX, j14, A` con `A` en 0..7FFFh (el inmediato se extiende con signo, por eso las variables globales viven debajo de 8000h), y de operando neutro: `jadd rd, rs, j14` copia `rs` en `rd`; `jsub rd, j14, rs` niega. | `so/pdp/ensamblador/ensamblador.jsm:16`, `so/pdp/ensamblador/ensamblador.jsm:120`, `razar/cuerpo/luma.jsm:43` |
| `j12`, `j13` | En el [ensamblador PDP](02-ensamblador-pdp-y-construccion.md#02-el-ensamblador-pdp-la-cadena-de-construcción-y-las-herramientas): constantes 8 y 1. | `so/pdp/ensamblador/ensamblador.jsm:16`, `so/pdp/ensamblador/ensamblador.jsm:118-119` |
| `j0`..`j7`, `j8`..`j11` | En el ensamblador PDP: las rutinas reciben argumentos en `j1`..`j3`, devuelven en `j0`, pueden alterar `j0`..`j7` y preservan `j8`..`j11` guardándolos en la pila de datos. | `so/pdp/ensamblador/ensamblador.jsm:17` |
| `j0` | Resultado del programa: lo imprime `jhalt` en el escalón 0. | `escalon0/janax.asm:372-390` |

El idioma no tiene instrucción de copia de registro ni de negación; las convenciones anteriores las suplen.

---

## 4. Codificación de instrucciones

### 4.1 Palabra de instrucción

Cada instrucción ocupa exactamente una palabra de 32 bits almacenada en little-endian
(`escalon0/janax.inc:2`, `escalon0/janax.inc:22`):

| Bits | Campo | Ancho | Interpretación |
|---|---|---|---|
| 0..7 | `op` | 8 | Código de operación |
| 8..11 | `rd` | 4 | Registro destino (o registro probado en saltos condicionales) |
| 12..15 | `ra` | 4 | Primer registro fuente o registro base |
| 16..31 | `imm16` | 16 | Inmediato, desplazamiento de salto o, en las instrucciones de tres registros, `rb` |
| 16..19 | `rb` | 4 | Segundo registro fuente: los 4 bits bajos de `imm16` |

Expresión de armado (macro `j_word`, `escalon0/janax.inc:22`; [ensamblador PDP](02-ensamblador-pdp-y-construccion.md#31-formato-de-palabra), `so/pdp/ensamblador/ensamblador.jsm:1450-1464`):

```
w = op | (rd << 8) | (ra << 12) | ((imm & 0FFFFh) << 16)
```

Decodificación (`escalon0/janax.asm:114-124`):

```
op  = w & 0FFh
rd  = (w >> 8)  & 0Fh
ra  = (w >> 12) & 0Fh
imm = w >> 16                 ; 16 bits
rb  = imm & 0Fh
```

Los ejecutores no validan los campos que una instrucción no usa: por ejemplo, una palabra con `op = 00h`
es `jhalt` sean cuales sean sus otros bits, y en las instrucciones de tres registros los bits 20..31 se
ignoran (`escalon0/janax.asm:114-127`).

### 4.2 Formatos

Los formatos tienen el número que usa [la tabla del ensamblador](02-ensamblador-pdp-y-construccion.md#4-la-tabla-del-ensamblador-ensambladordatos) (`so/pdp/ensamblador/ensamblador.datos.jsm:7-27`).

| Formato | Nº | Sintaxis | `rd` | `ra` | `imm16` |
|---|---|---|---|---|---|
| `F_NONE` | 0 | `mnem` | 0 | 0 | 0 |
| `F_RI` | 1 | `mnem rd, imm` | rd | 0 | imm |
| `F_RRR` | 2 | `mnem rd, ra, rb` | rd | ra | rb |
| `F_T` | 3 | `mnem destino` | 0 | 0 | desplazamiento |
| `F_RT` | 4 | `mnem rd, destino` | rd | 0 | desplazamiento |
| `F_RRI` | 5 | `mnem rd, ra, imm` | rd | ra | imm |
| `F_RR` | 6 | `mnem rd, ra` | rd | ra | 0 |

Valores de `rd`/`ra`/`imm` que emite el ensamblador por formato: `so/pdp/ensamblador/ensamblador.jsm:755-830`.

### 4.3 Desplazamiento de salto

Los saltos son relativos a la instrucción siguiente y se miden en palabras con signo
(`escalon0/janax.inc:36-38`, `escalon0/janax.asm:113`):

```
imm16 = ((destino_en_bytes - dirección_de_esta_instrucción_en_bytes) - 4) / 4
nuevo_pc = pc + sext16(imm16)          ; pc = índice de la palabra siguiente
```

Alcance: −32768..+32767 palabras desde la palabra siguiente. El ensamblador PDP rechaza en la [segunda pasada](02-ensamblador-pdp-y-construccion.md#13-pasadas-y-resolución-de-saltos)
un desplazamiento que no entra en 16 bits con signo (`so/pdp/ensamblador/ensamblador.jsm:1430-1447`). La
macro FASM no lo verifica: el valor se trunca a 16 bits (`escalon0/janax.inc:22`, `escalon0/janax.inc:36`).

---

## 5. Instrucciones

### 5.1 Tabla completa

Semántica tal como la ejecuta el intérprete de referencia. `a` es la dirección efectiva.

| Op | Mnemónico | Formato | Semántica | Errores | Fuente |
|---|---|---|---|---|---|
| 00h | `jhalt` | `F_NONE` | Termina; resultado `R[0]`. | — | `escalon0/janax.asm:129-130` |
| 01h | `jldi rd, imm` | `F_RI` | `R[rd] = sext16(imm)` | — | `escalon0/janax.asm:132-135` |
| 02h | `jadd rd, ra, rb` | `F_RRR` | `R[rd] = R[ra] + R[rb]` | — | `escalon0/janax.asm:137-141` |
| 03h | `jsub rd, ra, rb` | `F_RRR` | `R[rd] = R[ra] - R[rb]` | — | `escalon0/janax.asm:143-147` |
| 04h | `jmul rd, ra, rb` | `F_RRR` | `R[rd] = 64 bits bajos de R[ra] × R[rb]` | — | `escalon0/janax.asm:149-153` |
| 05h | `jdiv rd, ra, rb` | `F_RRR` | Cociente con signo truncado hacia cero; si `R[rb] = 0`, `R[rd] = 0`; si `R[rb] = −1`, `R[rd] = −R[ra]` (por lo tanto `MIN / −1 = MIN`). | — | `escalon0/janax.asm:155-172` |
| 06h | `jshl rd, ra, rb` | `F_RRR` | `R[rd] = R[ra] << (R[rb] & 63)` | — | `escalon0/janax.asm:174-180` |
| 07h | `jshr rd, ra, rb` | `F_RRR` | Desplazamiento lógico a la derecha por `R[rb] & 63` | — | `escalon0/janax.asm:182-188` |
| 08h | `jsar rd, ra, rb` | `F_RRR` | Desplazamiento aritmético a la derecha por `R[rb] & 63` | — | `escalon0/janax.asm:190-196` |
| 09h | `jand rd, ra, rb` | `F_RRR` | `R[rd] = R[ra] AND R[rb]` (bit a bit) | — | `escalon0/janax.asm:198-202` |
| 0Ah | `jor rd, ra, rb` | `F_RRR` | `R[rd] = R[ra] OR R[rb]` | — | `escalon0/janax.asm:204-208` |
| 0Bh | `jxor rd, ra, rb` | `F_RRR` | `R[rd] = R[ra] XOR R[rb]` | — | `escalon0/janax.asm:210-214` |
| 0Ch | `jjmp destino` | `F_T` | `pc = pc + sext16(imm)` | 2 al buscar si queda fuera | `escalon0/janax.asm:216-219` |
| 0Dh | `jjz rd, destino` | `F_RT` | Si `R[rd] = 0`: `pc = pc + sext16(imm)` | ídem | `escalon0/janax.asm:221-226` |
| 0Eh | `jjnz rd, destino` | `F_RT` | Si `R[rd] ≠ 0`: salta | ídem | `escalon0/janax.asm:228-233` |
| 0Fh | `jshi rd, imm` | `F_RI` | `R[rd] = (R[rd] << 16) OR zext16(imm)` | — | `escalon0/janax.asm:235-240` |
| 10h | `jld rd, ra, imm` | `F_RRI` | `a = R[ra] + sext16(imm)`; `R[rd] = M64[a]` | 5 si `a >u DATA_SIZE − 8`; si no, 6 si `a mod 8 ≠ 0` | `escalon0/janax.asm:242-251` |
| 11h | `jst rd, ra, imm` | `F_RRI` | `a = R[ra] + sext16(imm)`; `M64[a] = R[rd]` | ídem `jld` | `escalon0/janax.asm:253-262` |
| 12h | `jldb rd, ra, imm` | `F_RRI` | `a = R[ra] + sext16(imm)`; `R[rd] = zext8(M8[a])` | 5 si `a >u DATA_SIZE − 1` | `escalon0/janax.asm:264-271` |
| 13h | `jstb rd, ra, imm` | `F_RRI` | `a = R[ra] + sext16(imm)`; `M8[a] = R[rd] & 0FFh` | ídem `jldb` | `escalon0/janax.asm:273-280` |
| 14h | `jcall destino` | `F_T` | Apila la vuelta `pc`; `pc = pc + sext16(imm)` | 7 si profundidad `>= RET_DEPTH` | `escalon0/janax.asm:282-289` |
| 15h | `jret` | `F_NONE` | Desapila la vuelta y continúa en ella; si la vuelta viene de un `jcall0`, pone en 0 el registro que ese `jcall0` indicó ([5.7](#57-llamadas-y-pila-de-retorno)). | 8 si la pila está vacía | `escalon0/janax.asm:291-305` |
| 16h | `jsys rd, ra` | `F_RR` | Sólo en Janax OS ([5.8](#58-jsys-janax-os)). En el escalón 0 es código inválido. | 1 en el escalón 0 | `escalon0/janax.asm:31`, `escalon0/janax.inc:97-99` |
| 17h | `jhost rd, ra` | `F_RR` | `R[rd] = respuesta del anfitrión al bloque en R[ra]` ([sección 7](#7-protocolo-de-la-ventana-al-anfitrión-jhost)) | 5, 6 | `escalon0/janax.asm:359-368` |
| 18h | `jjn rd, destino` | `F_RT` | Si `R[rd] < 0` (con signo): salta | 2 al buscar | `escalon0/janax.asm:320-325` |
| 19h | `jjnn rd, destino` | `F_RT` | Si `R[rd] >= 0` (con signo; el cero no es negativo): salta | ídem | `escalon0/janax.asm:327-332` |
| 1Ah | `jldadd rd, ra, imm` | `F_RRI` | `a = R[ra] + sext16(imm)`; `t = M64[a] + R[rd]`; `M64[a] = t`; `R[rd] = t` | ídem `jld` | `escalon0/janax.asm:334-345` |
| 1Bh | `jldx rd, ra, rb` | `F_RRR` | `a = R[ra] + (R[rb] << 3)`; `R[rd] = M64[a]` | ídem `jld` | `escalon0/janax.asm:347-357` |
| 1Ch | `jcall0 rd, destino` | `F_RT` | Igual que `jcall`, pero el `jret` que vuelve de esta llamada pone `R[rd] = 0` | 7 | `escalon0/janax.asm:307-318` |
| 1Dh..FFh | — | — | No definidos | 1 | `escalon0/janax.asm:125-126` |

Mnemónicos y formatos: `escalon0/janax.inc:24-104`, `so/pdp/ensamblador/ensamblador.datos.jsm:37-65`.

### 5.2 Orden de lectura y escritura de operandos

- Todas las instrucciones leen sus operandos antes de escribir el destino. Si `rd` coincide con `ra` o con
  `rb`, el resultado es el de leer primero (`escalon0/janax.asm:143-147`). Prueba:
  `escalon0/pruebas/34_destino_es_segundo_operando.jsm`.
- `jldadd` con `rd = ra`: la dirección se calcula con el valor previo de `ra` (`escalon0/janax.asm:335-344`).
  Prueba: `escalon0/pruebas/46_jldadd.jsm`.
- `jldx` con `rd = rb`: el índice se lee antes de escribir (`escalon0/janax.asm:348-356`). Prueba:
  `escalon0/pruebas/47_jldx.jsm`.

### 5.3 Aritmética y lógica

- Desbordes de `jadd`, `jsub` y `jmul` dan la vuelta en 64 bits (`escalon0/janax.asm:151`). Prueba:
  `escalon0/pruebas/07_mul_da_la_vuelta.jsm`.
- `jdiv` no atrapa nunca. No existe instrucción de resto. Pruebas: `escalon0/pruebas/08_div_trunca_a_cero.jsm`,
  `09_div_por_cero.jsm`, `10_div_minimo_por_menos_uno.jsm`.
- Los desplazamientos usan los 6 bits bajos del conteo (`escalon0/janax.asm:177`). Prueba:
  `escalon0/pruebas/11_shl_usa_seis_bits.jsm`.
- `jand`/`jor`/`jxor` son bit a bit. Para un Y lógico entre valores no binarios hace falta normalizar a
  máscara; idiomas usados en el repositorio: `jsub m, cero, a` / `jor m, m, a` / `jsar m, m, sesenta_y_tres`
  (máscara de todos unos si `a ≠ 0`) (`escalon0/pruebas/44_while_check.jsm`).
- La comparación de dos valores se hace por diferencia: `jsub t, a, b` seguido de `jjn`/`jjnn`/`jjz`/`jjnz`.

### 5.4 Constantes

`jldi` carga 16 bits con signo (−32768..32767). Una constante de 64 bits se arma con `jldi` y hasta tres
`jshi` (cada `jshi` desplaza 16 bits y agrega 16 bits sin signo) (`escalon0/janax.asm:235-240`). Prueba:
`escalon0/pruebas/15_shi_arma_constantes.jsm`. Ejemplo: la cadena `"escribir"` como palabra little-endian se
arma con `jldi r, 7269h` / `jshi r, 6269h` / `jshi r, 7263h` / `jshi r, 7365h`
(`escalon0/pruebas/37_ventanita.jsm`).

### 5.5 Memoria de datos

- Dirección efectiva: suma de 64 bits que da la vuelta; luego la comparación sin signo contra el límite
  (`escalon0/janax.asm:243-246`). Una dirección negativa es, por lo tanto, siempre fuera de rango (código 5).
  Prueba: `escalon0/pruebas/26_fuera_de_memoria.jsm`.
- El control de rango precede al de alineación: un acceso de 8 bytes fuera de rango y desalineado da 5, no 6
  (`escalon0/janax.asm:245-248`). Los dos traductores conservan este orden (`escalon0/traductor.asm:156-160`,
  `escalon0/traductor_arm64.asm:323-333`).
- Accesos de 64 bits (`jld`, `jst`, `jldadd`, `jldx`): alineados a 8 (`escalon0/janax.inc:77`). Pruebas:
  `27_desalineado.jsm`, `49_jldadd_desalineado.jsm`.
- Accesos de byte (`jldb`, `jstb`): sin requisito de alineación; la carga extiende con ceros
  (`escalon0/janax.asm:269`). Pruebas: `24_byte_little_endian.jsm`, `25_byte_sin_signo.jsm`.
- Orden de bytes: little-endian. El byte guardado en `base + 3` aparece en los bits 24..31 de la palabra leída
  en `base` (`escalon0/pruebas/24_byte_little_endian.jsm`).
- La memoria de datos no tiene orden entre hilos ni barreras en v0: el escalón 0 ejecuta un único flujo.

### 5.6 Control

- El destino de un salto no se valida al saltar: se valida al buscar la siguiente instrucción ([3.4](#34-ciclo-de-ejecución)). Un
  destino igual a `N` o mayor, o negativo, termina con código 2 (`escalon0/pruebas/21_salto_afuera.jsm`).
- Los saltos condicionales prueban sólo `R[rd]`; no hay banderas.

### 5.7 Llamadas y pila de retorno

- `jcall` guarda `pc` (índice de la palabra siguiente) en la pila de retorno y salta
  (`escalon0/janax.asm:282-289`).
- `jret` desapila y continúa en la vuelta (`escalon0/janax.asm:291-299`).
- `jcall0 rd, destino` guarda una vuelta marcada. Formato interno de la entrada en el intérprete
  (`escalon0/janax.asm:300-318`):

  | Bits | Contenido |
  |---|---|
  | 0..31 | `pc` de vuelta |
  | 32..35 | `rd` |
  | 63 | 1 = vuelta de `jcall0` |

  Al desapilar una entrada con el bit 63 en 1, `jret` toma `pc` de los bits 0..31 y pone `R[rd] = 0`. El cero
  se aplica al volver, de modo que cualquier escritura de la rutina sobre `rd` queda anulada. Un `jcall`
  común anidado dentro no borra nada (`escalon0/pruebas/48_jcall0.jsm`).
- El formato interno de la entrada no es observable por el programa. Los traductores guardan direcciones
  nativas en lugar de índices (secciones [11.6](#116-llamadas) y [12.3](#123-esquema-de-traducción)).
- Pruebas: `29_llamada_y_vuelta.jsm`, `30_factorial_recursivo.jsm`, `31_vuelta_sin_llamada.jsm` (código 8),
  `32_recursion_infinita.jsm` (código 7), `48_jcall0.jsm`.

### 5.8 `jsys` (Janax OS)

`jsys rd, ra` (16h) es la ventanilla del sistema Janax OS: `ra` contiene la dirección de una [cola de pedidos](04-nucleo-abi-de-pedidos.md#4-formato-de-la-cola-de-pedidos)
(un contador de 8 bytes seguido de entradas de 32 bytes `{tipo, a, b, resultado}`) y `rd` recibe la cantidad
de pedidos atendidos (`escalon0/janax.inc:97-99`, `so/janaxos.asm:2175-2188`). Si el proceso todavía no tiene
[ambiente 0](04-nucleo-abi-de-pedidos.md#32-primera-orden-construcción-de-la-sala-0), el primer `jsys` lo construye con el tamaño contenido en `R[ra]` (redondeado hacia arriba a
múltiplo de 8), copia al principio el archivo [`.datos`](#92-datos-datos-iniciales) del programa si existe, deja `j15` en el tamaño y
responde 0 en `rd`; un tamaño inválido o unos datos que no entran terminan con código 5
(`so/janaxos.asm:2228-2233`, `so/ambientes.inc:710-762`, `so/janaxos.asm:2198-2200`). Los tipos de pedido se
especifican en [el capítulo 04](04-nucleo-abi-de-pedidos.md#9-especificación-de-cada-pedido). En el escalón 0, 16h es inválido (código 1).

---

## 6. Construcciones de ensamblado

Son nombres del ensamblador que se expanden a instrucciones de [la sección 5](#5-instrucciones). No tienen código de operación
propio.

### 6.1 El while: `jwhile`, `jwhilez`, `jwcheck`, `jwend`

El idioma no tiene otra construcción de bucle. Forma (while rotado) emitida por el [ensamblador PDP](02-ensamblador-pdp-y-construccion.md#10-bucles-jwhile-jwhilez-jwcheck-jwend)
(`so/pdp/ensamblador/ensamblador.jsm:831-931`) y por las macros FASM (`escalon0/janax.inc:49-75`):

```
jwhile r            ->      jjmp  CHECK          ; 0Ch
                    BODY:
  ...cuerpo...               ...cuerpo...
[jwcheck]           CHECK:   (si hay jwcheck, CHECK queda aquí)
  ...condición...            ...condición...      (código que deja la condición en r)
jwend               ->      [CHECK: si no hubo jwcheck]
                             jjnz r, BODY         ; 0Eh  (jjz, 0Dh, para jwhilez)
```

Semántica:

- `jwhile r`: repite mientras `R[r] ≠ 0`. `jwhilez r`: repite mientras `R[r] = 0`. El valor de la tabla para
  cada uno es el código de operación del salto final: 0Eh y 0Dh (`so/pdp/ensamblador/ensamblador.datos.jsm:66-67`).
- La condición se evalúa antes de la primera vuelta: con la condición falsa al entrar, el cuerpo corre cero
  veces.
- Costo por vuelta: el cuerpo, el código de condición (si hay `jwcheck`) y una instrucción de salto.
- `jwcheck` no emite nada: marca dónde empieza el código de condición, que se ejecuta antes de cada vuelta,
  la primera incluida. Sin `jwcheck`, `CHECK` coincide con el salto final.
- Anidamiento: se permiten whiles dentro de whiles.

Errores del ensamblador PDP:

| Condición | Fuente |
|---|---|
| Más de 128 whiles abiertos a la vez | `so/pdp/ensamblador/ensamblador.jsm:834-839` |
| Más de 2560 whiles en un fuente | `so/pdp/ensamblador/ensamblador.jsm:841-846` |
| `jwend` sin while abierto | `so/pdp/ensamblador/ensamblador.jsm:877-880` |
| `jwcheck` fuera de un while | `so/pdp/ensamblador/ensamblador.jsm:907-910` |
| Segundo `jwcheck` en el mismo while | `so/pdp/ensamblador/ensamblador.jsm:917-921` |
| `jwhile` sin `jwend` al terminar el fuente | `so/pdp/ensamblador/ensamblador.jsm:594-596` |

Mecanismo en el PDP: cada while recibe un número de orden; la posición de su `CHECK` se registra en una
tabla indexada por orden durante la primera pasada y se lee en la segunda para resolver el `jjmp` de entrada
(`so/pdp/ensamblador/ensamblador.jsm:865-870`, `so/pdp/ensamblador/ensamblador.jsm:891-896`,
`so/pdp/ensamblador/ensamblador.jsm:923-930`). Pruebas: `escalon0/pruebas/36_while.jsm`,
`escalon0/pruebas/44_while_check.jsm`.

### 6.2 `jfirst r, tamaño`

Construye el [ambiente 0](03-nucleo-arranque-memoria-procesos.md#63-primera-orden-la-sala-0) de un proceso de Janax OS (`escalon0/janax.inc:105-116`,
`so/pdp/ensamblador/ensamblador.jsm:932-969`):

```
si tamaño < 8000h:   jldi r, tamaño
si no:               jldi r, (tamaño >> 16)      ; truncado a 16 bits
                     jshi r, tamaño & 0FFFFh
luego:               jsys r, r
```

La comparación `tamaño < 8000h` es con signo. Para tamaños de 2^31 o más la carga de `jldi` se extiende con
signo y el valor resultante no coincide con `tamaño` (consecuencia directa de [5.4](#54-constantes)). En el escalón 0 el
`jsys` emitido termina con código 1.

---

## 7. Protocolo de la ventana al anfitrión (`jhost`)

### 7.1 Bloque de pedido

`jhost rd, ra`: `R[ra]` es la dirección, en la memoria de datos, de un bloque de 32 bytes
(`escalon0/janax.inc:100-104`, `escalon0/ventanita.inc:4-10`):

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | `pedido`: número de pedido (0 = catálogo) |
| 8 | 8 | `a` |
| 16 | 8 | `b` |
| 24 | 8 | `c` (ningún pedido actual lo usa) |

La respuesta queda en `R[rd]`.

### 7.2 Validación del bloque

1. Si `R[ra] >u DATA_SIZE − 32`: código 5 (`escalon0/ventanita.inc:22-23`).
2. Si `R[ra] mod 8 ≠ 0`: código 6 (`escalon0/ventanita.inc:24-25`).

Prueba: `escalon0/pruebas/40_ventanita_afuera.jsm`.

### 7.3 Pedido 0: catálogo

Entrada: `a` = dirección donde escribir (alineada a 8), `b` = lugar disponible en bytes
(`escalon0/ventanita.inc:46-72`).

1. Si `a mod 8 ≠ 0`: código 6 (antes de escribir nada).
2. Para cada pedido ofrecido, en el orden de la tabla del puerto: se cuenta; si `b >=u 16` (comparación sin
   signo: un `b` negativo se trata como lugar muy grande, `escalon0/ventanita.inc:58-59`), se verifica
   `a <=u DATA_SIZE − 16` (si no, código 5), se escribe una entrada de 16 bytes y se avanza `a += 16`,
   `b −= 16`. Si no hay lugar, se cuenta pero no se escribe.
3. Respuesta: la cantidad de pedidos ofrecidos (todos, hayan entrado o no).

Entrada del catálogo:

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | Nombre del pedido en ASCII, rellenado con ceros a 8 bytes (little-endian como palabra) |
| 8 | 8 | Número del pedido |

### 7.4 Pedido 1: `escribir`

Entrada: `a` = dirección, `b` = cantidad de bytes (`escalon0/ventanita.inc:86-101`).

1. Si `a >u DATA_SIZE`: código 5.
2. Si `b >u DATA_SIZE − a`: código 5.
3. Escribe `M8[a .. a+b−1]` en la salida estándar. Respuesta: bytes escritos según el sistema anfitrión.

Prueba: `escalon0/pruebas/38_ventanita_escribe.jsm`.

### 7.5 Pedido no ofrecido

Cualquier otro número, o un pedido quitado del catálogo, responde −1 (todos los bits en 1) sin error
(`escalon0/ventanita.inc:43-45`). Prueba: `escalon0/pruebas/39_ventanita_pedido_ausente.jsm`.

### 7.6 Catálogo por puerto

| Puerto | Catálogo | Fuente |
|---|---|---|
| Windows (intérprete y traductor x86-64) | `escribir` = 1 | `escalon0/ventanita_datos.inc:3-6` |
| Linux ARM64 (ejecutable traducido) | `escribir` = 1, implementado con la llamada al sistema `write` (64) | `escalon0/traductor_arm64.asm:105-163` |
| [Proceso de Janax OS](04-nucleo-abi-de-pedidos.md#11-la-ventana-al-anfitrión-jhost) | Vacío: el catálogo responde 0 (con la verificación de alineación de `a`), todo otro pedido responde −1 | `so/anfitrion.inc:1-30` |

El programa DEBE consultar el catálogo y buscar los pedidos por nombre; no puede suponer números.

### 7.7 Reducción del catálogo en Windows: `JANAX_SIN`

En la primera ejecución de `jhost`, el servicio de Windows lee la variable de entorno `JANAX_SIN`
(`escalon0/ventanita.inc:103-163`, `escalon0/ventanita_datos.inc:12-14`):

- Lectura en un búfer de 256 bytes con capacidad declarada 255; si la variable no existe, está vacía o mide
  255 bytes o más, no se quita nada.
- Lista de nombres separados por comas. Cada nombre de hasta 8 bytes se empaqueta como palabra little-endian
  rellenada con ceros y se compara con los nombres del catálogo; los que coinciden quedan deshabilitados.
  Un nombre de más de 8 bytes no quita nada.
- Un pedido deshabilitado no aparece en el catálogo y responde −1.

El ARM64 no implementa `JANAX_SIN` (`escalon0/pruebas/correr.sh:139-149`).

---

## 8. Fuente `.jsm`

Esta sección especifica la sintaxis que acepta el [ensamblador PDP](02-ensamblador-pdp-y-construccion.md#6-sintaxis-de-las-sentencias) (`so/pdp/ensamblador/ensamblador.jsm:7-15`).
La notación FASM de `escalon0/janax.inc` comparte los mnemónicos y la codificación; sus diferencias se
listan en [8.10](#810-notación-fasm-escalon0janaxinc).

### 8.1 Léxico

| Elemento | Definición | Fuente |
|---|---|---|
| Codificación | Bytes; el byte 0 termina el texto. | `so/pdp/ensamblador/ensamblador.jsm:486-488`, `so/pdp/ensamblador/ensamblador.jsm:1934-1938` |
| Fin de línea | LF (0Ah). CR (0Dh) termina la sentencia; el resto hasta LF se descarta. | `so/pdp/ensamblador/ensamblador.jsm:1969-2002` |
| Espacio | Espacio (20h) y tabulador (09h). | `so/pdp/ensamblador/ensamblador.jsm:1948-1966` |
| Comentario | `;` hasta el fin de línea, donde se espera el fin de una sentencia. | `so/pdp/ensamblador/ensamblador.jsm:1988-2002` |
| Caracteres de nombre | `0-9`, `A-Z`, `a-z`, `_`, `.` | `so/pdp/ensamblador/ensamblador.jsm:2024-2046` |
| Nombre | Secuencia de caracteres de nombre que no empieza con dígito. Sensible a mayúsculas (comparación byte a byte). | `so/pdp/ensamblador/ensamblador.jsm:1589-1646`, `so/pdp/ensamblador/ensamblador.jsm:1916-1930` |
| Número | Secuencia de caracteres de nombre que empieza con dígito. Si termina en `h` o `H`, hexadecimal (los dígitos son los anteriores al sufijo; se admiten `A-F` y `a-f`); si no, decimal. Cualquier carácter que no sea dígito de su base es error. Se acumula en 64 bits sin detección de desborde. | `so/pdp/ensamblador/ensamblador.jsm:1653-1727` |
| Texto | Entre comillas simples `'...'`, sólo en [`db`](02-ensamblador-pdp-y-construccion.md#9-datos-db-dd-dq-times) y en [`include`](02-ensamblador-pdp-y-construccion.md#12-textos-anidados-include-repeat-macros). Sin secuencias de escape; un LF o el fin del texto antes de la comilla de cierre es error. | `so/pdp/ensamblador/ensamblador.jsm:985-1019` |

Consecuencia: `.` es carácter de nombre, de modo que `a.b` y `.x` son nombres simples (no hay etiquetas
locales al estilo FASM).

### 8.2 Sentencias

Gramática (EBNF; `nl` = fin de línea o comentario):

```
fuente      = { línea } ;
línea       = { etiqueta } [ sentencia ] nl ;
etiqueta    = nombre ":" ;
sentencia   = nombre "=" expr
            | instrucción
            | directiva
            | invocación_de_macro ;
```

- Puede haber varias etiquetas en una línea antes de la sentencia (`so/pdp/ensamblador/ensamblador.jsm:601-644`).
- Después de una sentencia sólo puede venir espacio y fin de línea o comentario; otra cosa es error
  (`so/pdp/ensamblador/ensamblador.jsm:680-689`).
- Una palabra que está en la tabla de nombres ([8.9](#89-tabla-de-nombres-ensambladordatos)) es instrucción o directiva. Si no está, se busca como
  macro del fuente; si tampoco, es error (`so/pdp/ensamblador/ensamblador.jsm:660-679`).
- Un nombre de la tabla con formato `F_CONST` (registro), `F_END` o `F_LOCAL` usado como sentencia es error
  (`so/pdp/ensamblador/ensamblador.jsm:753`).

### 8.3 Símbolos

| Regla | Fuente |
|---|---|
| Una etiqueta vale la posición actual de salida en **bytes** (`$`). | `so/pdp/ensamblador/ensamblador.jsm:638-643` |
| `nombre = expr` define el símbolo o cambia su valor; puede redefinirse. | `so/pdp/ensamblador/ensamblador.jsm:646-659`, `so/pdp/ensamblador/ensamblador.jsm:1807-1831` |
| En la primera pasada, definir una etiqueta cuyo nombre ya existe como símbolo (etiqueta o constante) es error. | `so/pdp/ensamblador/ensamblador.jsm:631-637` |
| Un nombre se resuelve primero en la tabla de nombres (sólo los `F_CONST`, es decir `j0`..`j15`, valen como número; una instrucción usada como valor es error) y después en los símbolos del fuente. | `so/pdp/ensamblador/ensamblador.jsm:1730-1768` |
| En la primera pasada un símbolo desconocido vale 0; en la segunda es error. | `so/pdp/ensamblador/ensamblador.jsm:1755-1762` |
| Los símbolos y macros de un fuente no son visibles desde otro (cada fuente abre una generación nueva). | `so/pdp/ensamblador/ensamblador.jsm:549-551`, `so/pdp/ensamblador/ensamblador.jsm:1875-1878` |

### 8.4 Expresiones

```
expr   = term { ("+" | "-") term } ;
term   = unario { ("*" | "/") unario } ;
unario = "-" unario | "+" unario | "(" expr ")" | "$" | número | nombre ;
```

- Aritmética de 64 bits que da la vuelta; `/` es la división de Janax ([`jdiv`](#51-tabla-completa)): trunca hacia cero, `x/0 = 0`
  (`so/pdp/ensamblador/ensamblador.jsm:1513-1650`).
- `$` es la posición actual de salida en bytes al evaluar (`so/pdp/ensamblador/ensamblador.jsm:1625-1631`).
- No hay operadores de desplazamiento, lógicos ni de comparación.
- Los registros son números: `j5` vale 5, y cualquier expresión vale como operando de registro.

### 8.5 Operandos de instrucciones

Los operandos se separan con comas; cada uno es una expresión (`so/pdp/ensamblador/ensamblador.jsm:762-830`).
Al armar la palabra (`so/pdp/ensamblador/ensamblador.jsm:1450-1464`):

- `imm` se trunca a sus 16 bits bajos sin error (un `jldi r, 40000` se arma con `40000 & 0FFFFh`).
- `rd` y `ra` no se enmascaran: un valor mayor que 15 invade los campos siguientes de la palabra. El
  ensamblador no lo diagnostica.
- En `F_RRR`, `rb` ocupa el campo `imm16` truncado a 16 bits; los ejecutores sólo leen sus 4 bits bajos.
- Destinos de salto (`F_T`, `F_RT`): expresión en bytes; se convierte con [4.3](#43-desplazamiento-de-salto) y se verifica el alcance en la
  segunda pasada.

### 8.6 Directivas

| Directiva | Sintaxis | Efecto | Fuente |
|---|---|---|---|
| [`db`](02-ensamblador-pdp-y-construccion.md#9-datos-db-dd-dq-times) | `db v, v, ...` | Cada valor emite su byte bajo; un texto `'...'` emite sus bytes. | `so/pdp/ensamblador/ensamblador.jsm:973-1049` |
| [`dd`](02-ensamblador-pdp-y-construccion.md#9-datos-db-dd-dq-times) | `dd v, ...` | Cada valor emite sus 4 bytes bajos, little-endian. Textos: error. | `so/pdp/ensamblador/ensamblador.jsm:970-972` |
| [`dq`](02-ensamblador-pdp-y-construccion.md#9-datos-db-dd-dq-times) | `dq v, ...` | Cada valor emite sus 8 bytes, little-endian. Textos: error. | `so/pdp/ensamblador/ensamblador.jsm:976-978` |
| [`times`](02-ensamblador-pdp-y-construccion.md#9-datos-db-dd-dq-times) | `times n sentencia` | El resto de la línea se repite `n` veces, cada copia como una línea. `n` negativo equivale a 0. | `so/pdp/ensamblador/ensamblador.jsm:1051-1106` |
| [`repeat`](02-ensamblador-pdp-y-construccion.md#12-textos-anidados-include-repeat-macros) / `end repeat` | `repeat n` en una línea, cuerpo, `end repeat` en una línea | El cuerpo se repite `n` veces (negativo = 0). Los `repeat` internos se anidan: se buscan líneas cuya primera palabra es `repeat` o `end` seguido de `repeat`. Sin cierre: error. | `so/pdp/ensamblador/ensamblador.jsm:2537-2627` |
| `macro` | `macro nombre p1, p2, ... { cuerpo }` | Define una macro; el cuerpo puede ocupar varias líneas y termina en la primera `}`. Redefinir reemplaza. Debe definirse antes de su primer uso. | `so/pdp/ensamblador/ensamblador.jsm:2065-2109` |
| `local` | `local n1, n2, ...` (línea dentro del cuerpo de una macro) | Declara nombres locales de la expansión. | `so/pdp/ensamblador/ensamblador.jsm:2259-2299` |
| [`include`](02-ensamblador-pdp-y-construccion.md#12-textos-anidados-include-repeat-macros) | `include 'ruta'` | Inserta el texto del archivo. Una ruta cuyos últimos 9 bytes son `janax.inc` se ignora (el idioma ya está incorporado). | `so/pdp/ensamblador/ensamblador.jsm:1107-1167` |
| `jfirst` | `jfirst r, tamaño` | [6.2](#62-jfirst-r-tamaño) | `so/pdp/ensamblador/ensamblador.jsm:932-969` |
| `jwhile`, `jwhilez`, `jwcheck`, `jwend` | [6.1](#61-el-while-jwhile-jwhilez-jwcheck-jwend) | 6.1 | `so/pdp/ensamblador/ensamblador.jsm:831-931` |

[Expansión de macros](02-ensamblador-pdp-y-construccion.md#125-macros) (`so/pdp/ensamblador/ensamblador.jsm:2111-2390`):

1. Argumentos: desde el nombre hasta el fin de línea, separados por comas. Un argumento entre `<` y `>` se
   toma literal (puede contener comas); uno común termina en coma o fin de línea, sin espacios ni tabuladores
   finales. Máximo 16 argumentos; un argumento 17.º es error (`so/pdp/ensamblador/ensamblador.jsm:2178-2183`).
2. Parámetros: nombres separados por comas entre el nombre de la macro y `{`. Máximo 16; un parámetro 17.º es
   error (`so/pdp/ensamblador/ensamblador.jsm:2220-2223`, `so/pdp/ensamblador/ensamblador.jsm:2245-2247`).
3. En el cuerpo, cada nombre que coincide con un parámetro se reemplaza por el texto de su argumento; cada
   nombre declarado `local` se reemplaza por `nombre.` seguido de 16 dígitos hexadecimales en mayúsculas del
   número de expansión de la pasada (que empieza en 0 en cada pasada,
   `so/pdp/ensamblador/ensamblador.jsm:581`); los demás se copian. Las líneas `local` se reemplazan por una
   línea vacía. Máximo 16 locales; los que exceden se ignoran sin error.
4. La tabla de argumentos no se limpia entre expansiones: un parámetro sin argumento correspondiente toma
   el contenido residual de la tabla (comportamiento no definido; derivado de
   `so/pdp/ensamblador/ensamblador.jsm:2123-2193` y `so/pdp/ensamblador/ensamblador.jsm:2329-2336`).

[`include`](02-ensamblador-pdp-y-construccion.md#123-resolución-de-include) (`so/pdp/ensamblador/ensamblador.jsm:1169-1332`):

- La ruta es relativa a la carpeta del fuente principal (no a la del archivo que contiene el `include`;
  `so/pdp/ensamblador/ensamblador.jsm:1218-1236` y `so/pdp/ensamblador/ensamblador.jsm:405-406`); `..` sube una carpeta, `.` se ignora, `/` separa.
- Subir por encima de la raíz del [sistema de archivos de Janax OS](04-nucleo-abi-de-pedidos.md#10-la-casa-de-archivos), o una ruta resultante de 400 bytes o más,
  es error.
- Después de la comilla de cierre sólo puede venir fin de línea o comentario.
- En la primera pasada los bytes del archivo incluido se agregan a la huella del fuente ([9.3](#93-huella-huella-del-armado)).

Textos anidados (archivos incluidos, cuerpos de `repeat`/`times`, expansiones de macro): hasta 32 niveles,
en una región de 2 MiB por pasada (`so/pdp/ensamblador/ensamblador.jsm:1349-1389`,
`so/pdp/ensamblador/ensamblador.jsm:2479-2509`).

### 8.7 Pasadas

1. Primera pasada: define etiquetas, registra posiciones de condición de los whiles, agrega los archivos
   incluidos a la [huella](#93-huella-huella-del-armado). No escribe salida (`so/pdp/ensamblador/ensamblador.jsm:547-560`,
   `so/pdp/ensamblador/ensamblador.jsm:1470-1478`).
2. Segunda pasada: reevalúa todo con los símbolos conocidos, verifica alcances de salto y escribe los bytes
   (`so/pdp/ensamblador/ensamblador.jsm:562-570`).

Cualquier error marca el fuente como fallido: no se escribe su salida. El ensamblador no emite mensajes; su
resultado es `j0 = fuentes armados + (fuentes con error << 32)` (`so/pdp/ensamblador/ensamblador.jsm:163-168`).

### 8.8 Límites del ensamblador PDP

| Límite | Valor | Fuente |
|---|---|---|
| Salida por fuente | 1 MiB (100000h bytes) | `so/pdp/ensamblador/ensamblador.jsm:1489-1495` |
| Símbolos | 65536 entradas de 32 bytes (dispersión FNV-1a, sondeo lineal) | `so/pdp/ensamblador/ensamblador.jsm:34`, `so/pdp/ensamblador/ensamblador.jsm:1834-1913` |
| Macros | 4096 entradas | `so/pdp/ensamblador/ensamblador.jsm:35`, `so/pdp/ensamblador/ensamblador.jsm:1844-1850` |
| Whiles abiertos / por fuente | 128 / 2560 | [6.1](#61-el-while-jwhile-jwhilez-jwcheck-jwend) |
| Anidamiento de textos | 32 | `so/pdp/ensamblador/ensamblador.jsm:1361-1366` |
| Región de textos anidados | 2 MiB (440000h..63FFFFh) | `so/pdp/ensamblador/ensamblador.jsm:36`, `so/pdp/ensamblador/ensamblador.jsm:1350-1356` |
| Argumentos, parámetros, locales por macro | 16 cada uno | `so/pdp/ensamblador/ensamblador.jsm:2178-2183`, `so/pdp/ensamblador/ensamblador.jsm:2220-2223`, `so/pdp/ensamblador/ensamblador.jsm:2271-2274` |
| Nombres de la tabla | 1..8 bytes | `so/pdp/ensamblador/ensamblador.jsm:1771-1778` |

### 8.9 Tabla de nombres (`ensamblador.datos`)

Los nombres que el ensamblador reconoce no están en su código: vienen de un archivo de datos que se carga al
principio de su [ambiente 0](02-ensamblador-pdp-y-construccion.md#151-mapa-del-ambiente-0) (`so/pdp/ensamblador/ensamblador.datos.jsm:1-5`, `so/datos.inc:1-6`). Formato:

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | Nombre ASCII rellenado con ceros (1 a 8 bytes) |
| 8 | 4 | Valor (código de operación, registro, o 0) |
| 12 | 4 | Formato ([4.2](#42-formatos) y tabla siguiente) |

Una entrada cuyo primer campo de 8 bytes vale 0 termina la tabla (`so/pdp/ensamblador/ensamblador.datos.jsm:96`,
`so/pdp/ensamblador/ensamblador.jsm:1789-1802`). Cambiar la tabla cambia los nombres del idioma sin tocar el
ensamblador.

Formatos de directiva (además de los de 4.2): `F_WHILE` 7, `F_WEND` 8, `F_FIRST` 9, `F_DD` 10, `F_CONST` 11,
`F_INCLUDE` 12, `F_MACRO` 13, `F_REPEAT` 14, `F_END` 15, `F_LOCAL` 16, `F_DB` 17, `F_DQ` 18, `F_TIMES` 19,
`F_WCHECK` 20 (`so/pdp/ensamblador/ensamblador.datos.jsm:14-27`).

Contenido de la tabla del repositorio (`so/pdp/ensamblador/ensamblador.datos.jsm:37-95`):

| Nombre | Valor | Formato |
|---|---|---|
| `jhalt` .. `jcall0` | 00h..1Ch ([5.1](#51-tabla-completa)) | según 5.1 |
| `jwhile` | 0Eh | `F_WHILE` |
| `jwhilez` | 0Dh | `F_WHILE` |
| `jwend`, `jwcheck`, `jfirst` | 0 | `F_WEND`, `F_WCHECK`, `F_FIRST` |
| `dd`, `include`, `macro`, `repeat`, `end`, `local`, `db`, `dq`, `times` | 0 | su formato |
| `j0` .. `j15` | 0..15 | `F_CONST` |

### 8.10 Notación FASM (`escalon0/janax.inc`)

`janax.inc` define los mismos mnemónicos como macros de FASM, con la misma codificación. Diferencias con el
PDP observables en el código:

- FASM no verifica el alcance de los saltos ([4.3](#43-desplazamiento-de-salto)).
- FASM tiene etiquetas locales que empiezan con `.` y operadores propios de expresión (`shl`, `and`, etc.,
  usados dentro de `janax.inc`); el PDP no.
- En FASM, `jwhile`/`jwend` usan constantes simbólicas apiladas (`equ`/`restore`)
  (`escalon0/janax.inc:49-75`). Un segundo `jwcheck` en el mismo while ejecuta la directiva `err` de FASM y
  el armado falla, como en el PDP (`escalon0/janax.inc:61-62`). El comportamiento de FASM ante un `jwend` o un
  `jwcheck` sin while abierto: (no verificado).
- En FASM, `jfirst` decide la forma corta con `if (size) < 8000h` (`escalon0/janax.inc:109`); el PDP hace la
  misma comparación con signo (`so/pdp/ensamblador/ensamblador.jsm:938-943`).

Que todos los fuentes actuales del repositorio se armen igual con FASM que con el PDP: (no verificado).

---

## 9. Archivos resultantes

### 9.1 `.bin`: programa

- Contenido: la secuencia de bytes emitida por las sentencias, sin encabezado. Las instrucciones son palabras
  de 32 bits little-endian; `db`/`dd`/`dq` emiten sus bytes en el mismo flujo
  (`so/pdp/ensamblador/ensamblador.jsm:1466-1497`, `so/pdp/ensamblador/ensamblador.jsm:518-524`).
- Carga: la palabra `i` ocupa los bytes `4i..4i+3`. `N = ⌊tamaño / 4⌋`; los bytes sobrantes se ignoran. Se
  leen como máximo `MAX_PROGRAM` bytes (`escalon0/janax.asm:88-94`).
- Los bytes emitidos con `db`/`dd`/`dq` en un `.bin` son palabras de programa, no datos: la máquina no puede
  leerlos con las instrucciones de memoria ([3.1](#31-estado)). Se usan, por ejemplo, para fabricar una palabra inválida
  (`escalon0/pruebas/19_opcode_invalido.jsm`). Los datos iniciales van en `.datos` ([9.2](#92-datos-datos-iniciales)).

### 9.2 `.datos`: datos iniciales

- Producido por un fuente `X.datos.jsm` (la extensión `.jsm` se quita y la anterior se conserva,
  [9.4](#94-nombres-de-salida)). Formato: bytes crudos sin encabezado.
- Asociación: [el núcleo de Janax OS](04-nucleo-abi-de-pedidos.md#104-datos-iniciales-datos) busca, junto al programa, el archivo con el mismo nombre y la última
  extensión reemplazada por `.datos` (o agregada si no tiene); un punto antes de un separador de carpeta no
  cuenta como extensión (`so/datos.inc:8-42`). Ejemplos del código: `X.bin` → `X.datos`; `hijo` → `hijo.datos`.
- Uso: el primer `jsys` ([6.2](#62-jfirst-r-tamaño)) copia el archivo completo al principio del [ambiente 0](04-nucleo-abi-de-pedidos.md#32-primera-orden-construcción-de-la-sala-0); si no entra en el tamaño
  pedido, el proceso termina con código 5 (`so/ambientes.inc:721-722`, `so/ambientes.inc:752-755`). Sin
  archivo, el ambiente 0 empieza en ceros.
- El escalón 0 no carga `.datos`.

### 9.3 `.huella`: huella del armado

8 bytes: [FNV-1a de 64 bits](02-ensamblador-pdp-y-construccion.md#161-fnv-1a-de-64-bits-fnv_basis-fnv-ensambladorjsm313-333) (base CBF29CE484222325h, primo 100000001B3h) sobre, en este orden: la tabla de
nombres completa incluida su entrada final vacía, los bytes del fuente, y los bytes de cada archivo incluido
en el orden en que se leen en la primera pasada (`so/pdp/ensamblador/ensamblador.jsm:312-350`,
`so/pdp/ensamblador/ensamblador.jsm:489-494`, `so/pdp/ensamblador/ensamblador.jsm:1191-1197`). Si `X.huella`
existe y coincide, el fuente no se vuelve a armar (`so/pdp/ensamblador/ensamblador.jsm:496-509`). Tras un
armado exitoso se escribe la huella nueva (`so/pdp/ensamblador/ensamblador.jsm:525-533`).

### 9.4 Nombres de salida

Para un fuente `PDP/…/X.jsm` (`so/pdp/ensamblador/ensamblador.jsm:404-462`):

- Si el nombre sin `.jsm` contiene un punto después de su última `/`: la salida es ese nombre
  (`X.datos.jsm` → `X.datos`).
- Si no: se agrega `.bin` (`X.jsm` → `X.bin`).
- La huella es siempre `X.huella` (nombre sin `.jsm` más `.huella`).

Sólo se arman los archivos cuyo nombre empieza con `PDP/` y termina en `.jsm`
(`so/pdp/ensamblador/ensamblador.jsm:352-390`).

---

## 10. Intérprete de referencia (`escalon0/janax.asm`)

### 10.1 Invocación

`janax <programa.bin>`. El argumento es el resto de la línea de comandos después del nombre del ejecutable
(entre comillas o no) y de los espacios que lo siguen; si queda vacío, código 4
(`escalon0/janax.asm:42-77`). El argumento no se desentrecomilla: una ruta entre comillas se pasa con sus
comillas a `CreateFileA` (efecto: código 3) (no verificado en ejecución).

### 10.2 Representación interna

- Registros Janax en un arreglo de 16 qwords; `r14` apunta al arreglo, `r15` a la memoria de datos, `r12` es
  `pc`, `r13` la base del programa, `rbx` la profundidad de la pila de retorno (`escalon0/janax.asm:100-107`).
- Despacho por tabla `optable` de 29 entradas indexada por `op` (`escalon0/janax.asm:29-32`).

### 10.3 Salida de `jhalt`

Escribe en la salida estándar 18 bytes: `R[0]` como 16 dígitos hexadecimales en mayúsculas (el más
significativo primero), CR, LF; termina con código 0 (`escalon0/janax.asm:26-27`, `escalon0/janax.asm:372-390`).

### 10.4 `jhost`

Llama a [`host_service`](05-nucleo-pantalla-teclado-vigia.md#123-escalón-0-host_service) con `rax = R[ra]` y `rdx` = base de la memoria; si devuelve `edx ≠ 0`, termina con ese
código; si no, `R[rd] = rax` (`escalon0/janax.asm:359-368`, `escalon0/ventanita.inc:4-6`).

---

## 11. Traductor x86-64 (`escalon0/traductor.asm`)

### 11.1 Invocación

`janaxt <programa.bin>` (nombre de uso tomado de la cabecera, `escalon0/traductor.asm:2`; el código no fija el
nombre del ejecutable y la batería lo arma como `build/traductor.exe`, `escalon0/pruebas/correr.sh:13-14`). El
argumento se toma de la línea de comandos igual que en el intérprete ([10.1](#101-invocación)) y la ruta del caché es la ruta del
programa seguida de `.x64` (`escalon0/traductor.asm:557-606`). Traduce todas las palabras, enlaza, guarda el caché `<programa.bin>.x64`, informa por
la salida de error estándar y ejecuta el código nativo. Salida y códigos de salida idénticos al intérprete
(`escalon0/traductor.asm:1-4`, `escalon0/traductor.asm:998-1028`).

### 11.2 Asignación de registros

1. Para cada palabra con `op < 1Dh` se cuenta el uso de los campos indicados por `usage_masks[op]`
   (bit 0 = `rd`, bit 1 = `ra`, bit 2 = `rb`) (`escalon0/traductor.asm:101-102`, `escalon0/traductor.asm:630-663`):

   | Máscara | Códigos de operación |
   |---|---|
   | 0 (ninguno) | 00h, 0Ch, 14h, 15h, 16h |
   | 1 (`rd`) | 01h, 0Dh, 0Eh, 0Fh, 18h, 19h, 1Ch |
   | 3 (`rd`, `ra`) | 10h, 11h, 12h, 13h, 17h, 1Ah |
   | 7 (`rd`, `ra`, `rb`) | 02h..0Bh, 1Bh |

2. Se asignan 11 registros nativos, en este orden: `rbx`, `rsi`, `rdi`, `r8`, `r9`, `r10`, `r11`, `r12`, `r13`,
   `r14`, `r15` (`escalon0/traductor.asm:98-99`). En cada ronda, el registro Janax aún sin asignar con mayor
   cuenta recibe el siguiente nativo; los empates favorecen el índice menor (`escalon0/traductor.asm:664-691`).
   La mejor cuenta de cada ronda arranca en −1 y la comparación es con signo, de modo que los 11 nativos se
   asignan siempre, también a registros con cuenta 0; por eso el stub de entrada ([11.7](#117-entrada-y-salida-del-código-generado)) mide siempre 160 bytes.
3. Los 5 registros Janax restantes viven en el contexto.
4. Registros reservados: `rax`, `rcx`, `rdx` (trabajo), `rbp` (contexto), `rsp` (pila nativa)
   (`escalon0/traductor.asm:20-22`, `escalon0/traductor.asm:97`).

El mapa resultante `jmap` es un arreglo de 16 bytes con signo: número de registro nativo x86 o −1
(`escalon0/traductor.asm:75`).

### 11.3 Contexto en tiempo de ejecución

Apuntado por `rbp` (`escalon0/traductor.asm:42-54`):

| Desplazamiento | Tamaño | Contenido |
|---|---|---|
| 0 | 128 | `R[0..15]` (los registros que viven en el contexto; los nativos se cargan y guardan aquí en la entrada y salida) |
| 128 (`C_MEM`) | 8 | Base de la memoria de datos |
| 136 (`C_DEPTH`) | 8 | Profundidad de la pila de retorno |
| 144 (`C_RET`) | 32768 | Pila de retorno: 4096 direcciones nativas |
| 32912 (`C_HOST`) | 8 | Dirección de `host_service` |

### 11.4 Esquema de traducción

Notación: `loc(j)` = el registro nativo de `j`, o `[rbp + 8j]` con desplazamiento de 32 bits. Las
instrucciones idénticas en x86-64 ("a") se emiten como una sola instrucción nativa; las demás cargan en
`rax`/`rcx`, copian una plantilla y guardan `rax` (`escalon0/traductor.asm:11-13`, `escalon0/traductor.asm:116-235`,
`escalon0/traductor.asm:323-550`).

| Janax | Código emitido |
|---|---|
| `jhalt` | `xor eax, eax` / `ret` |
| `jldi` | nativo: `REX.W(+B) C7 /0 imm32` (`mov r64, simm32`); en contexto: `48 C7 85 disp32 imm32` |
| `jadd`, `jsub`, `jmul`, `jand`, `jor`, `jxor` | si `rd = ra` y `rd` es nativo: `op loc(rd), loc(rb)` (una instrucción). Si no: `mov rax, loc(ra)` / `op rax, loc(rb)` / `mov loc(rd), rax`. Códigos: `03` add, `2B` sub, `0F AF` imul, `23` and, `0B` or, `33` xor (forma `op r64, r/m64`). |
| `jdiv` | `mov rax, loc(ra)` / `mov rcx, loc(rb)` / plantilla: `test rcx,rcx; jz cero; cmp rcx,−1; je menos_uno; cqo; idiv rcx; jmp fin; cero: xor eax,eax; jmp fin; menos_uno: neg rax; fin:` / `mov loc(rd), rax` |
| `jshl`, `jshr`, `jsar` | `mov rax, loc(ra)` / `mov rcx, loc(rb)` / `48 D3 E0` (shl), `48 D3 E8` (shr), `48 D3 F8` (sar) / `mov loc(rd), rax` |
| `jjmp` | `E9 rel32` |
| `jjz`, `jjnz`, `jjn`, `jjnn` | nativo: `test r, r`; en contexto: `48 83 BD disp32 00` (`cmp qword [rbp+disp32], 0`); luego `0F 84` (jz), `0F 85` (jnz), `0F 88` (js), `0F 89` (jns) con `rel32` |
| `jshi` | `mov rax, loc(rd)` / `48 C1 E0 10` (`shl rax, 16`) / `48 0D imm32` (`or rax, zext16(imm)`) / `mov loc(rd), rax` |
| `jld`, `jldb` | `mov rax, loc(ra)` / plantilla (abajo) / `mov loc(rd), rax` |
| `jst`, `jstb` | `mov rax, loc(ra)` / `mov rcx, loc(rd)` / plantilla |
| `jldadd` | `mov rax, loc(ra)` / `mov rcx, loc(rd)` / plantilla con cuerpo `add rcx,[rdx+rax]; mov [rdx+rax],rcx; mov rax,rcx` / `mov loc(rd), rax` |
| `jldx` | `mov rax, loc(ra)` / `mov rcx, loc(rb)` / plantilla con dirección `lea rax,[rax+rcx*8]` / `mov loc(rd), rax` |
| `jcall` | plantilla `t_call` ([11.6](#116-llamadas)) |
| `jcall0` | `t_call` / `31 C0` (`xor eax, eax`) / `mov loc(rd), rax` |
| `jret` | plantilla `t_ret` (11.6) |
| `jhost` | `mov rax, loc(ra)` / `mov rdx,[rbp+C_MEM]; call [rbp+C_HOST]; test edx,edx; jz ok; mov eax,edx; ret; ok:` / `mov loc(rd), rax` |
| `16h` y `op >= 1Dh` | `mov eax, 1` / `ret` |

Plantilla de memoria (`escalon0/traductor.asm:147-185`): `add rax, simm32` (el desplazamiento se parchea en el
campo de 32 bits) o `lea rax,[rax+rcx*8]`; `cmp rax, DATA_SIZE − tamaño`; `ja fuera`; (sólo 64 bits)
`test al, 7; jnz desalineado`; `mov rdx, [rbp + C_MEM]`; acceso; `jmp fin`; `fuera: mov eax, 5; ret`;
`desalineado: mov eax, 6; ret`; `fin:`. Accesos: `mov rax,[rdx+rax]`, `mov [rdx+rax],rcx`,
`movzx eax, byte [rdx+rax]`, `mov [rdx+rax],cl`.

Codificación de las cargas y guardados de operandos (`escalon0/traductor.asm:250-307`):

- registro–registro: `REX` (`48`, `+4` si el registro del campo `reg` es `r8`..`r15`, `+1` si el de `rm` lo es),
  código, `ModRM = C0h | (reg & 7) << 3 | (rm & 7)`;
- registro–contexto: `REX` (`48`, `+4` según `reg`), código, `ModRM = 85h | (reg & 7) << 3`, `disp32 = 8j`.
- `mov rax/rcx, loc(j)` usa el código `8B`; `mov loc(j), rax` usa `89`.

### 11.5 Disposición y enlace

1. Cada palabra se traduce a exactamente los bytes que necesita, una tras otra; `offs[i]` registra el inicio
   del código de la palabra `i`, `lens[i]` su largo (máximo 255; si no, código 9) y `joffs[i]` el
   desplazamiento de su campo `rel32` de salto dentro de su código, o FFh si no tiene
   (`escalon0/traductor.asm:802-871`).
2. Tras la última palabra se coloca la salida "fuera del programa" (`mov eax, 2; ret`), en `offs[N]`
   (`escalon0/traductor.asm:872-881`).
3. Enlace: para cada palabra con campo de salto, el destino es `i + 1 + sext16(imm)`; si es negativo o
   mayor que `N`, se usa `N`. El campo recibe `offs[destino] − (posición_del_campo + 4)`
   (`escalon0/traductor.asm:901-942`).
4. El código enlazado se copia a memoria ejecutable de exactamente el tamaño total
   (`escalon0/traductor.asm:902-909`).

### 11.6 Llamadas

`t_call` (`escalon0/traductor.asm:187-202`): `rdx = [rbp+C_DEPTH]`; si `rdx >= 4096`, `mov eax, 7; ret`; si no,
`rax` = dirección nativa inmediatamente posterior a la plantilla; `[rbp + C_RET + 8·rdx] = rax`;
`[rbp+C_DEPTH] = rdx + 1`; `jmp rel32` al destino. En `jcall0` la dirección de vuelta apunta a la secuencia
`xor eax, eax` / `mov loc(rd), rax` emitida a continuación, que pone `rd` en cero al volver
(`escalon0/traductor.asm:503-508`).

`t_ret` (`escalon0/traductor.asm:204-215`): si la profundidad es 0, `mov eax, 8; ret`; si no, decrementa,
carga la dirección y `jmp rax`.

### 11.7 Entrada y salida del código generado

Stub de entrada (`escalon0/traductor.asm:885-899`, `escalon0/traductor.asm:1030-1045`): `mov nativo, [rbp+8j]`
para cada registro Janax con nativo (en orden de `j`), `call` a la palabra 0, `mov [rbp+8j], nativo` para
cada uno, `ret`. Tamaño reservado: `STUB_BYTES = 11·7·2 + 5 + 1 = 160` (`escalon0/traductor.asm:109`).

El código generado no modifica `rsp` salvo por la `call` de `jhost`; toda salida (halt o error) es un `ret`
con `eax` = código de salida, que vuelve al stub cualquiera sea la profundidad Janax. El traductor prepara
`C_HOST`, `C_MEM` y `j15 = DATA_SIZE`, llama al stub, y si `eax ≠ 0` termina con ese código; si no, imprime
`R[0]` como el intérprete (`escalon0/traductor.asm:998-1028`).

### 11.8 Caché incremental `<programa.bin>.x64`

Formato (`escalon0/traductor.asm:35-38`, `escalon0/traductor.asm:89-93`, `escalon0/traductor.asm:952-979`):

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 4 | Magia: bytes `4A 58 36 35` (`'JX65'`) |
| 4 | 4 | Huella del traductor (FNV-1a de 32 bits) |
| 8 | 8 | `n`: cantidad de palabras |
| 16 | 16 | `jmap` ([11.2](#112-asignación-de-registros)) |
| 32 | 4n | Las palabras del programa |
| 32 + 4n | n | `lens` |
| 32 + 5n | n | `joffs` (FFh = sin campo de salto) |
| 32 + 6n | Σ lens | Código de cada palabra, sin enlazar (campos de salto en cero) |

Validación al cargar (`escalon0/traductor.asm:704-778`); el caché se descarta si: el archivo mide menos de 32
bytes; la magia o la huella difieren; el `jmap` difiere del calculado para el programa actual; `n > 262144`
(`MAX_PROGRAM/4`); `32 + 6n` excede el tamaño leído; o el tamaño no es exactamente `32 + 6n + Σ lens`.

Reutilización (`escalon0/traductor.asm:813-832`): la palabra `i` reutiliza su código del caché si el caché es
válido, `i < n` y la palabra es idéntica a la guardada; en otro caso se traduce. Los saltos se enlazan
siempre de nuevo.

Huella del traductor (`escalon0/traductor.asm:693-702`, `escalon0/traductor.asm:1047-1058`): FNV-1a de 32 bits
(base 811C9DC5h, primo 01000193h) sobre todo el código del traductor (`code_begin`..`code_end`) y luego sobre
sus tablas (`hashed_start`..`hashed_end`: registros nativos, máscaras de uso, tabla de emisores).

Guardado (`escalon0/traductor.asm:944-979`): se reescribe salvo que el caché fuera válido, no se haya traducido
ninguna palabra y `n = N`. Un fallo al escribir no es error.

Informe en la salida de error estándar: `traducidas T de N` seguido de CR LF, donde `T` es la cantidad de
palabras traducidas (no reutilizadas) (`escalon0/traductor.asm:981-996`). Casos de prueba:
`escalon0/pruebas/correr.sh:56-99`.

---

## 12. Traductor ARM64 (`escalon0/traductor_arm64.asm`)

### 12.1 Invocación

`janax_arm64 <programa.bin>` (nombre de uso de la cabecera, `escalon0/traductor_arm64.asm:3`; la batería lo arma
como `build/traductor_arm64.exe`, `escalon0/pruebas/correr.sh:103`) escribe `<programa.bin>.arm64`, un ejecutable ELF64 estático para Linux AArch64,
y termina con código 0; no ejecuta el programa (`escalon0/traductor_arm64.asm:1-4`,
`escalon0/traductor_arm64.asm:496-510`, `escalon0/traductor_arm64.asm:808-815`).

### 12.2 Registros

| Registro ARM64 | Uso | Fuente |
|---|---|---|
| `x0`..`x15` | `j0`..`j15` (todos los registros Janax en registros nativos) | `escalon0/traductor_arm64.asm:6-12` |
| `x16`, `x17` | Trabajo | ídem |
| `x19` | Base de la memoria de datos | ídem |
| `x20` | Base de la pila de retorno | ídem |
| `x21` | Profundidad de la pila de retorno | ídem |
| `x22` | `DATA_SIZE − 8` | ídem |
| `x23` | `DATA_SIZE − 1` | ídem |
| `x24`..`x29` | Trabajo de la rutina de `jhost` | `escalon0/traductor_arm64.asm:105-108` |
| `x30` | Enlace de `bl` a la rutina de `jhost` | `escalon0/traductor_arm64.asm:395-408` |

### 12.3 Esquema de traducción

Instrucciones nativas emitidas por palabra (`escalon0/traductor_arm64.asm:171-453`). `D`, `A`, `B` = `rd`, `ra`,
`rb`.

| Janax | Secuencia ARM64 (codificación base) | Instr. |
|---|---|---|
| `jhalt` | `B finish` (14000000h) | 1 |
| `jldi` | `imm >= 0`: `MOVZ xD, imm` (D2800000h); `imm < 0`: `MOVN xD, ~imm & FFFFh` (92800000h) | 1 |
| `jadd` | `ADD xD, xA, xB` (8B000000h) | 1 |
| `jsub` | `SUB` (CB000000h) | 1 |
| `jmul` | `MADD xD, xA, xB, xzr` (9B007C00h) | 1 |
| `jdiv` | `SDIV` (9AC00C00h): ya da 0 con divisor 0 y `MIN` con `MIN/−1` | 1 |
| `jshl`, `jshr`, `jsar` | `LSLV` (9AC02000h), `LSRV` (9AC02400h), `ASRV` (9AC02800h): usan 6 bits | 1 |
| `jand`, `jor`, `jxor` | `AND` (8A000000h), `ORR` (AA000000h), `EOR` (CA000000h) | 1 |
| `jjmp` | `B destino` | 1 |
| `jjz`, `jjnz` | `CBZ xD` (B4000000h), `CBNZ xD` (B5000000h) | 1 o 2 |
| `jjn`, `jjnn` | `TBNZ xD, #63` (B7F80000h), `TBZ xD, #63` (B6F80000h) | 1 o 2 |
| `jshi` | `LSL xD, xD, #16` (D370BC00h) / `MOVK xD, #imm` (F2800000h) | 2 |
| `jld`, `jst` | `mov x17, simm` / `ADD x16, xA, x17` (8B110010h) / `CMP x16, x22` (EB16021Fh) / `B.LS +8` (54000049h) / `B exit5` / `TST x16, #7` (F2400A1Fh) / `B.EQ +8` (54000040h) / `B exit6` / `LDR xD, [x19, x16]` (F8706A60h) o `STR` (F8306A60h) | 9 |
| `jldb`, `jstb` | igual sin alineación, con `CMP x16, x23` (EB17021Fh); `LDRB wD` (38706A60h), `STRB wD` (38306A60h) | 6 |
| `jldadd` | dirección y verificaciones de `jld` / `LDR x17, [x19, x16]` (F8706A71h) / `ADD xD, xD, x17` (8B110000h) / `STR xD, [x19, x16]` | 11 |
| `jldx` | `ADD x16, xA, xB, LSL #3` (8B000C10h) / `CMP x16, x22` / `B.LS +8` / `B exit5` / `TST` / `B.EQ +8` / `B exit6` / `LDR` | 8 |
| `jcall` | `CMP x21, #4096` (F14006BFh) / `B.LO +8` (54000043h) / `B exit7` / `ADR x16, +16` (10000090h) / `STR x16, [x20, x21, LSL #3]` (F8357A90h) / `ADD x21, x21, #1` (910006B5h) / `B destino` | 7 |
| `jcall0` | `jcall` / `MOVZ xD, #0` (la vuelta cae aquí) | 8 |
| `jret` | `CBNZ x21, +8` (B5000055h) / `B exit8` / `SUB x21, x21, #1` (D10006B5h) / `LDR x16, [x20, x21, LSL #3]` (F8757A90h) / `BR x16` (D61F0200h) | 5 |
| `jhost` | `MOV x16, xA` (AA0003F0h) / `BL host` (94000000h) / `MOV xD, x17` (AA1103E0h) | 3 |
| `16h`, `op >= 1Dh` | `B exit1` | 1 |

Campos: `rd` en bits 0..4, `rn` (`ra`) en 5..9, `rm` (`rb`) en 16..20 (`escalon0/traductor_arm64.asm:231-241`).
Límite por palabra: 11 instrucciones (44 bytes); excederlo es código 9 (`escalon0/traductor_arm64.asm:27`,
`escalon0/traductor_arm64.asm:594-597`).

La pila de retorno guarda direcciones nativas absolutas. Los destinos fuera de `[0, N]` se redirigen a la
salida "fuera del programa" (`escalon0/traductor_arm64.asm:187-195`).

### 12.4 Arreglos de saltos y relajación

Cada salto registra un arreglo de 32 bytes `{posición, tipo, destino, palabra}` (`escalon0/traductor_arm64.asm:36-41`,
`escalon0/traductor_arm64.asm:176-184`):

| Tipo | Valor | Campo | Alcance |
|---|---|---|---|
| `K_B_WORD` | 0 | `imm26` a una palabra | ±128 MiB (no se verifica) |
| `K_CB_WORD` | 1 | `imm19` a una palabra | −2^18..2^18−1 instrucciones |
| `K_B_STUB` | 2 | `imm26` a una rutina fija | no se verifica |
| `K_TB_WORD` | 3 | `imm14` a una palabra | −2^13..2^13−1 instrucciones |

Procedimiento (`escalon0/traductor_arm64.asm:556-753`): se traduce el programa entero; se enlazan los arreglos;
si un `CBZ`/`CBNZ`/`TBZ`/`TBNZ` no alcanza, se marca su palabra con la forma larga y se repite la traducción
completa. Forma larga: la prueba contraria (bit 24 invertido) con desplazamiento +8 bytes, seguida de un `B`
al destino (`escalon0/traductor_arm64.asm:277-281`). Como las marcas sólo se agregan, el proceso termina.
Prueba: `escalon0/pruebas/35_salto_lejano.jsm`.

### 12.5 Rutinas fijas

Identificadores en `stub_off` (`escalon0/traductor_arm64.asm:42-45`, `escalon0/traductor_arm64.asm:602-645`):

| Id | Rutina |
|---|---|
| 0 (`S_FINISH`) | `finish`: escribe `x0` como 16 dígitos hexadecimales en mayúsculas más LF (17 bytes) con `write(1, línea, 17)` (llamada 64) y sale con `exit(0)` (llamada 93) (`escalon0/traductor_arm64.asm:82-103`) |
| 1, 2, 5, 6, 7, 8 | Salida con ese código: `MOVZ x0, #código` / `B exit` (`escalon0/traductor_arm64.asm:443-453`). La de código 2 está en `offs[N]` (destino "fuera del programa"). |
| 3 (`S_EXIT`) | `exit`: `MOVZ x8, #93` / `SVC #0` (`escalon0/traductor_arm64.asm:100-102`) |
| 9 (`S_HOST`) | Rutina de `jhost` ([7.6](#76-catálogo-por-puerto)); sus ramas a las salidas 5 y 6 se parchean al colocarla (`escalon0/traductor_arm64.asm:105-167`, `escalon0/traductor_arm64.asm:623-645`) |

Diferencia observable con Windows: la línea final termina en LF, no en CR LF.

### 12.6 Prólogo

26 instrucciones (`escalon0/traductor_arm64.asm:34`, `escalon0/traductor_arm64.asm:647-696`): `MOVZ xK, #0` para
K = 0..14; `MOVZ x15, #10h, LSL #16` (`j15 = 100000h`); `x19` = `BASE + bss_off + 32768` (memoria de datos);
`x20` = `BASE + bss_off` (pila de retorno); `MOVZ x21, #0`; `x22 = FFFF8h`; `x23 = FFFFFh` (cada uno de 32 bits
con `MOVZ`+`MOVK`); `B` a la palabra 0.

### 12.7 Formato del ejecutable

Un único segmento cargable de lectura, escritura y ejecución en `BASE` = 400000h
(`escalon0/traductor_arm64.asm:30-33`, `escalon0/traductor_arm64.asm:756-806`):

| Desplazamiento | Tamaño | Contenido |
|---|---|---|
| 0 | 64 | Encabezado ELF: `7F 45 4C 46`, clase 2 (64 bits), datos 1 (LE), versión 1, OSABI 0; `e_type` = 2 (`ET_EXEC`), `e_machine` = B7h (AArch64), `e_version` = 1, `e_entry` = `BASE + prologue_off`, `e_phoff` = 64, `e_shoff` = 0, `e_flags` = 0, `e_ehsize` = 64, `e_phentsize` = 56, `e_phnum` = 1, `e_shentsize` = `e_shnum` = `e_shstrndx` = 0 |
| 64 | 56 | Encabezado de programa: `p_type` = 1 (`PT_LOAD`), `p_flags` = 7 (R+W+X), `p_offset` = 0, `p_vaddr` = `p_paddr` = `BASE`, `p_filesz` = tamaño del archivo, `p_memsz` = `bss_off + 32768 + 1048576`, `p_align` = 1000h |
| 120 | 16 | `0123456789ABCDEF` |
| 136 | 17 | Línea de salida: 16 × `'0'` y LF |
| 160 | — | Código: palabras traducidas, salida "fuera", salidas 1, 5, 6, 7, 8, `finish`, rutina de `jhost`, prólogo |
| `bss_off` | 32768 | Pila de retorno (fuera del archivo, en cero) |
| `bss_off + 32768` | 1048576 | Memoria de datos (fuera del archivo, en cero) |

`bss_off` = tamaño del archivo redondeado hacia arriba a múltiplo de 16.

---

## 13. Otros ejecutores: Janax OS

Janax OS ejecuta el mismo idioma con [tres motores](03-nucleo-arranque-memoria-procesos.md#53-motores-de-ejecución) seleccionables por la variable [`JANAX_MOTOR`](03-nucleo-arranque-memoria-procesos.md#34-variables-de-entorno): `interprete`,
`rutinas` y `traductor` (por omisión) (`so/janaxos.asm:755`, `so/rutinas.inc:1-12`, `so/nativo.inc:1-5`). Su
intérprete aplica la misma semántica aritmética, de saltos y de llamadas que el escalón 0
(`so/janaxos.asm:1909-2163`), con estas diferencias, que especifica [el capítulo 03](03-nucleo-arranque-memoria-procesos.md#03-núcleo-janaxos-arranque-memoria-procesos-firmas-y-planificación):

- La memoria de datos son [ambientes](03-nucleo-arranque-memoria-procesos.md#6-modelo-de-memoria-de-un-proceso); el ambiente 0 no existe hasta el primer `jsys` ([5.8](#58-jsys-janax-os)) y los límites de
  acceso son los del proceso (`so/janaxos.asm:2021-2052`).
- [La pila de retorno](03-nucleo-arranque-memoria-procesos.md#67-pila-de-retorno) crece a pedido; el código 7 aparece cuando no puede crecer (`so/janaxos.asm:2101-2118`).
- `jsys` está definido; `jhost` ofrece un catálogo vacío ([7.6](#76-catálogo-por-puerto)).
- La ejecución se reparte en [turnos](03-nucleo-arranque-memoria-procesos.md#123-turno-por-prioridad-cuanto).

Valores iniciales de los registros de un proceso antes de su primer `jsys`: todos en 0 (el bloque del proceso se reserva con `VirtualAlloc`, que lo entrega en cero, `so/janaxos.asm:1277`; al rehacerse se vuelven a poner en cero, `so/janaxos.asm:4858-4860`).

---

## 14. Conformidad

`escalon0/pruebas/correr.sh` es el procedimiento de conformidad del escalón 0:

1. Arma el intérprete, el traductor x86-64 y Janax OS con FASM, y las pruebas con el [ensamblador PDP](02-ensamblador-pdp-y-construccion.md#15-protocolo-de-una-corrida-del-ensamblador) sobre
   Janax OS (`escalon0/pruebas/correr.sh:13-25`). El traductor ARM64 también se arma con FASM, antes del paso 5
   (`escalon0/pruebas/correr.sh:103-105`).
2. Cada prueba declara `; espera: <16 hex>` (valor de `j0`), `; codigo: <n>` (por omisión 0) y opcionalmente
   `; salida: <texto>` (lo escrito antes de `j0`) (`escalon0/pruebas/correr.sh:3`, `escalon0/pruebas/correr.sh:33-40`).
3. Corre cada prueba en el intérprete y dos veces en el traductor x86-64 (la segunda desde el caché)
   (`escalon0/pruebas/correr.sh:46-57`).
4. Prueba la traducción incremental y la invalidación por huella del traductor
   (`escalon0/pruebas/correr.sh:56-99`).
5. Traduce a ARM64 y corre en un dispositivo real por adb, si hay uno conectado
   (`escalon0/pruebas/correr.sh:101-137`).
6. Prueba `JANAX_SIN=escribir` en Windows (`escalon0/pruebas/correr.sh:139-149`).
7. Verifica que todo bucle del código del escalón 0 tenga forma de [while rotado](#61-el-while-jwhile-jwhilez-jwcheck-jwend)
   (`escalon0/pruebas/correr.sh:150-157`).

Resultados esperados (`escalon0/pruebas/*.jsm`, encabezados):

| Prueba | Propiedad | Esperado |
|---|---|---|
| 01 | `jhalt` con registros iniciales | `j0` = 0 |
| 02, 03 | `jldi`, extensión de signo | 2Ah; FFFFFFFFFFFFFFFFh |
| 04, 05, 06 | suma, resta negativa, producto | 2Ah; FFFFFFFFFFFFFFFDh; 2Ah |
| 07 | producto que da la vuelta | 0 |
| 08, 09, 10 | división: trunca a cero, por cero, `MIN/−1` | FFFFFFFFFFFFFFFDh; 0; 8000000000000000h |
| 11, 12, 13 | desplazamientos: 6 bits, lógico, aritmético | 2; 0Fh; FFFFFFFFFFFFFFFCh |
| 14 | and/or/xor | 96h |
| 15 | `jshi` | 12345678h |
| 16, 17, 18 | bucle, `jjz`, `jjmp` hacia adelante | 37h; 7; 5 |
| 19 | código de operación inválido | código 1 |
| 20, 21 | caída al final, salto fuera | código 2 |
| 22, 23 | guardar/cargar, memoria inicial en cero | 2Ah; 0 |
| 24, 25 | byte little-endian, byte sin signo | 34000000h; 0FFh |
| 26, 27 | fuera de rango, desalineado | código 5; código 6 |
| 28 | `j15` inicial | 100000h |
| 29, 30 | llamada y vuelta, recursión | 2Ah; 78h |
| 31, 32 | `jret` sin `jcall`, recursión infinita | código 8; código 7 |
| 33 | registros que viven en el contexto del traductor x86-64 | FFFFFFFFFFFFFFEBh |
| 34 | destino igual al segundo operando | 3 |
| 35 | salto condicional fuera del alcance de `CBZ` | 7 |
| 36, 44 | while, while con `jwcheck` | 3Dh; 631h |
| 37 | catálogo de `jhost` | 100000001h (con `JANAX_SIN=escribir`: 0) |
| 38 | `escribir` | salida `hola`, `j0` = 5 (con `JANAX_SIN=escribir`: 0) |
| 39, 40 | pedido no ofrecido, bloque fuera de memoria | FFFFFFFFFFFFFFFFh; código 5 |
| 41, 43 | programas generados por [`so/herramientas/turnos.pl`](02-ensamblador-pdp-y-construccion.md#217-cuantospl-y-turnospl--generadores-de-pruebas-del-planificador) (226 casos) y `so/herramientas/cuantos.pl` (73 casos) que comparan el cálculo de turnos del planificador contra valores exactos; `j0` = casos discrepantes | 0 |
| 45 | `jjn`/`jjnn` | 13Fh |
| 46, 47, 48 | `jldadd`, `jldx`, `jcall0` | 15E5h; 0FAh; 5Bh |
| 49, 50 | `jldadd` desalineado, `jldx` fuera de rango | código 6; código 5 |

No existe prueba número 42.

---

## 15. Puntos no verificados y comportamientos no definidos

Marcados como "(no verificado)" en este capítulo:

1. Que los fuentes actuales del repositorio se armen igual con FASM y `janax.inc` que con el ensamblador PDP
   ([8.10](#810-notación-fasm-escalon0janaxinc)).
2. El efecto de pasar al intérprete una ruta entre comillas ([10.1](#101-invocación)): del código sólo se deduce que las
   comillas no se quitan.
3. Los valores iniciales de los registros de un proceso de Janax OS antes de su primer `jsys` ([13](#13-otros-ejecutores-janax-os)): verificado, todos en 0 (`so/janaxos.asm:1277`).
4. El comportamiento de las macros FASM ante `jwend` o `jwcheck` sin while abierto (8.10).

Comportamientos que el código deja sin definir o sin diagnosticar (derivados del código, sin prueba que los
fije):

- Ensamblador PDP: `rd`/`ra` mayores que 15 invaden otros campos de la palabra sin error ([8.5](#85-operandos-de-instrucciones)); un parámetro
  de macro sin argumento toma el contenido residual de la tabla de argumentos ([8.6](#86-directivas)); un cuerpo de macro no
  puede contener `}`; locales por encima de 16 se ignoran; las tablas de símbolos y de macros no verifican
  estar llenas: con todas las entradas ocupadas por la generación actual, el sondeo lineal de un nombre
  ausente no termina (`so/pdp/ensamblador/ensamblador.jsm:1869-1904`).
- `jfirst` con tamaños de 2^31 o más no carga el tamaño pedido ([6.2](#62-jfirst-r-tamaño)).
- La respuesta de `escribir` cuando la escritura falla: en Windows es la cantidad informada por `WriteFile`
  en `host_written` (inicializada en 0, `escalon0/ventanita.inc:98-100`); en ARM64 es el valor que devuelve
  la llamada `write` en `x0` (`escalon0/traductor_arm64.asm:137-138`), que en Linux puede ser negativo.
- El traductor ARM64 no verifica el alcance de `B`/`BL` (`imm26`, ±128 MiB); con `MAX_PROGRAM` = 1 MiB y 11
  instrucciones por palabra el código no supera 44 MiB más las rutinas fijas.
