# 02. El ensamblador PDP, la cadena de construcción y las herramientas

**Alcance.** Este capítulo especifica el ensamblador PDP (un programa Janax que arma fuentes Janax `.jsm` en
binarios de palabras de 32 bits y corre dentro de Janax OS), su tabla de nombres `ensamblador.datos`, la semilla
con la que se arranca, el guion `so/herramientas/armar.sh` que produce cualquier binario Janax, el procedimiento
reproducible para construir el núcleo `janaxos.exe` con FASM, y las herramientas auxiliares de
`so/herramientas/` (reescritura de bucles, modismos, verificadores y generadores de pruebas), además de los bancos
de medida. Se especifica la **codificación** de cada instrucción (los bits que el ensamblador escribe), no su
**semántica** de ejecución: ésta pertenece al capítulo 01. Los pedidos a la ventanilla (`jsys`) que el
ensamblador usa se nombran con su número y sus campos; su contrato completo está en el capítulo 04. El resto de
la especificación sigue en: 01 idioma, 02 PDP y construcción (este), 03 núcleo y procesos, 04 ABI de pedidos,
05 pantalla, teclado y vigía, 06 lectura de Razar, 07 cardumen, 08 cuerpo y casa de Luma, 09 conversación,
10 pantalla y vida de Luma, 11 instalador y publicación.

Todas las rutas son relativas a la raíz del repositorio. Las citas `ruta:línea` señalan el código del que sale
cada afirmación. Lo que no se pudo comprobar en el código está marcado "(no verificado)".

---

## 1. Convenciones y términos

| Término | Definición |
|---|---|
| Palabra | Unidad de instrucción: 32 bits, *little-endian*. |
| Etiqueta (de archivo) | Nombre de un archivo en la carpeta del sistema de Janax OS: una cadena de bytes UTF-8 que puede contener `/` (ej. `PDP/so/pdp/ensamblador/ensamblador.jsm`). No hay directorios reales: la jerarquía es sólo el texto de la etiqueta. |
| Carpeta del sistema | Carpeta del anfitrión indicada por la variable de entorno `JANAX_ARCHIVOS` (`so/janaxos.asm:283`; valor por omisión `janax_archivos`, `so/janaxos.asm:284`). Cada etiqueta se guarda como un archivo cuyo nombre es la forma normal C (NFC) de la etiqueta escrita en hexadecimal en minúsculas, dos dígitos por byte (`so/janaxos.asm:3155-3216`). Excepción: si la variable `JANAX_TABLERO` está definida (`so/janaxos.asm:290`, `:709`), una etiqueta normalizada de 8 bytes o más que empieza con `tablero/` (`so/janaxos.asm:293`) se guarda en esa otra carpeta (`so/janaxos.asm:3180-3193`), y el listado (pedido 14) recorre las dos carpetas, primero la propia (`so/janaxos.asm:3347-3354`). |
| Ambiente | Bloque de memoria de un proceso. El ambiente 0 se crea con la primera orden (`jfirst`). |
| Pedido | Una entrada de la cola de la ventanilla `jsys`: 32 bytes `{tipo, a, b, resultado}` (capítulo 04). |
| Pasada | Un recorrido completo de una fuente por el ensamblador. PDP hace exactamente dos por fuente. |
| Texto anidado | Texto que el ensamblador inserta en la lectura: un archivo incluido, un cuerpo repetido, una macro expandida o las copias de `times`. |
| `j0`…`j15` | Registros de Janax (64 bits). |

Notación: `NNNNh` es hexadecimal; los demás números son decimales. "Error" significa que el ensamblador marca la
variable `V_ERR` (`so/pdp/ensamblador/ensamblador.jsm:41`) y la fuente se cuenta como fallida (§15).

---

## 2. Componentes

| Archivo | Qué es |
|---|---|
| `so/pdp/ensamblador/ensamblador.jsm` | Código del ensamblador PDP, 2643 líneas de Janax. |
| `so/pdp/ensamblador/ensamblador.datos.jsm` | Fuente de la tabla de nombres; se arma en `ensamblador.datos` (§4). |
| `so/pdp/semilla/ensamblador.bin` | Semilla: el ensamblador ya armado por sí mismo (8664 bytes en el estado leído). |
| `so/pdp/semilla/ensamblador.datos` | Semilla de la tabla (960 bytes). |
| `so/pdp/semilla/planificador.bin` | Planificador de fábrica ya armado (740 bytes); el núcleo lo incrusta (§20.2). |
| `so/pdp/semilla/.gitattributes` | `*.bin -delta binary` y `*.datos -delta binary`. |
| `escalon0/janax.inc` | Las mismas instrucciones como macros de FASM (codificación de referencia). PDP no lo lee (§12.3). |
| `so/herramientas/armar.sh` | Guion que arma una lista de fuentes con PDP sobre Janax OS (§19). |
| `so/herramientas/*.py`, `*.awk`, `*.pl` | Herramientas de reescritura, verificación y generación (§21). |
| `escalon0/bancos/*.jsm`, `so/bancos/*.jsm` | Programas de medida (§22). |
| `so/janaxos.asm` | Núcleo (Janax OS), x86-64, se arma con FASM (§20). |

El ensamblador no tiene interfaz de línea de órdenes: es un proceso Janax que, al arrancar, arma **todas** las
fuentes de la carpeta del sistema cuya etiqueta tiene la forma `PDP/…​.jsm` (§15) y termina con `jhalt`.

---

## 3. Codificación de instrucciones

### 3.1 Formato de palabra

| Bits | Campo | Contenido |
|---|---|---|
| 0–7 | `op` | Código de operación. |
| 8–11 | `rd` | Registro destino / condición. |
| 12–15 | `ra` | Primer registro fuente / base. |
| 16–31 | `imm16` | Inmediato o distancia de salto (16 bits); en las de tres registros, `rb` ocupa este campo. |

PDP compone cada palabra con la rutina `emit` (`ensamblador.jsm:1450-1464`):

```
palabra = op | (rd << 8) | (ra << 12) | ((imm AND 0FFFFh) << 16)      ; se escriben los 32 bits bajos
```

`rd` y `ra` **no** se recortan a 4 bits: un valor mayor que 15 se derrama sobre los campos siguientes
(`ensamblador.jsm:1451-1456`). Sólo `imm` se recorta a 16 bits. Esto coincide con la macro `j_word` de
`escalon0/janax.inc:22`, que tampoco recorta `rd` ni `ra`.

### 3.2 Formatos (campo "forma" de la tabla)

Valores de `ensamblador.datos.jsm:7-27`, repetidos en `ensamblador.jsm:94-114`:

| Nombre | Valor | Operandos en la fuente | Palabras emitidas |
|---|---|---|---|
| `F_NONE` | 0 | (ninguno) | `op, 0, 0, 0` |
| `F_RI` | 1 | `rd, imm` | `op, rd, 0, imm` |
| `F_RRR` | 2 | `rd, ra, rb` | `op, rd, ra, rb` (rb en `imm16`) |
| `F_T` | 3 | `destino` | `op, 0, 0, dist(destino)` |
| `F_RT` | 4 | `rd, destino` | `op, rd, 0, dist(destino)` |
| `F_RRI` | 5 | `rd, ra, imm` | `op, rd, ra, imm` |
| `F_RR` | 6 | `rd, ra` | `op, rd, ra, 0` |
| `F_WHILE` | 7 | `r` | `jjmp` de entrada (§10) |
| `F_WEND` | 8 | (ninguno) | salto condicional de vuelta (§10) |
| `F_FIRST` | 9 | `r, tamaño` | 2 o 3 palabras (§11) |
| `F_DD` | 10 | lista de valores | 4 bytes por valor (§9) |
| `F_CONST` | 11 | — | ninguna: es un valor con nombre (registros) |
| `F_INCLUDE` | 12 | `'ruta'` | ninguna: texto anidado (§12.3) |
| `F_MACRO` | 13 | `nombre params { cuerpo }` | ninguna (§12.5) |
| `F_REPEAT` | 14 | `cantidad` … `end repeat` | texto anidado (§12.4) |
| `F_END` | 15 | — | sólo como cierre de `repeat` |
| `F_LOCAL` | 16 | nombres | sólo dentro del cuerpo de una macro |
| `F_DB` | 17 | lista de valores y textos | 1 byte por valor (§9) |
| `F_DQ` | 18 | lista de valores | 8 bytes por valor (§9) |
| `F_TIMES` | 19 | `cantidad sentencia` | texto anidado (§9.3) |
| `F_WCHECK` | 20 | (ninguno) | ninguna: marca la condición (§10) |

Los operandos se separan con una coma obligatoria (`comma`, `ensamblador.jsm:1500-1510`). Cada operando es una
expresión (§7); un registro es simplemente un nombre `F_CONST` cuyo valor es su número.

`dist(destino)` es la distancia en palabras desde la palabra siguiente (`offset`, `ensamblador.jsm:1430-1447`):

```
dist = (destino − PC − 4) / 4          ; "/" = división entera de Janax (jdiv), PC = dirección de esta palabra
```

En la segunda pasada `dist` DEBE estar en [−32768, 32767]; si no, es error (`ensamblador.jsm:1436-1445`). La
macro FASM equivalente (`escalon0/janax.inc:36`) aplica la misma fórmula pero recorta a 16 bits sin avisar.

### 3.3 Tabla de instrucciones

Contenido de `ensamblador.datos.jsm:37-65` (nombre, valor = `op`, forma). La semántica de cada una está en el
capítulo 01.

| Nombre | `op` | Forma | Sintaxis |
|---|---|---|---|
| `jhalt` | 00h | `F_NONE` | `jhalt` |
| `jldi` | 01h | `F_RI` | `jldi rd, imm` |
| `jadd` | 02h | `F_RRR` | `jadd rd, ra, rb` |
| `jsub` | 03h | `F_RRR` | `jsub rd, ra, rb` |
| `jmul` | 04h | `F_RRR` | `jmul rd, ra, rb` |
| `jdiv` | 05h | `F_RRR` | `jdiv rd, ra, rb` |
| `jshl` | 06h | `F_RRR` | `jshl rd, ra, rb` |
| `jshr` | 07h | `F_RRR` | `jshr rd, ra, rb` |
| `jsar` | 08h | `F_RRR` | `jsar rd, ra, rb` |
| `jand` | 09h | `F_RRR` | `jand rd, ra, rb` |
| `jor` | 0Ah | `F_RRR` | `jor rd, ra, rb` |
| `jxor` | 0Bh | `F_RRR` | `jxor rd, ra, rb` |
| `jjmp` | 0Ch | `F_T` | `jjmp destino` |
| `jjz` | 0Dh | `F_RT` | `jjz rd, destino` |
| `jjnz` | 0Eh | `F_RT` | `jjnz rd, destino` |
| `jshi` | 0Fh | `F_RI` | `jshi rd, imm` |
| `jld` | 10h | `F_RRI` | `jld rd, ra, imm` |
| `jst` | 11h | `F_RRI` | `jst rd, ra, imm` |
| `jldb` | 12h | `F_RRI` | `jldb rd, ra, imm` |
| `jstb` | 13h | `F_RRI` | `jstb rd, ra, imm` |
| `jcall` | 14h | `F_T` | `jcall destino` |
| `jret` | 15h | `F_NONE` | `jret` |
| `jsys` | 16h | `F_RR` | `jsys rd, ra` |
| `jhost` | 17h | `F_RR` | `jhost rd, ra` |
| `jjn` | 18h | `F_RT` | `jjn rd, destino` |
| `jjnn` | 19h | `F_RT` | `jjnn rd, destino` |
| `jldadd` | 1Ah | `F_RRI` | `jldadd rd, ra, imm` |
| `jldx` | 1Bh | `F_RRR` | `jldx rd, ra, rb` |
| `jcall0` | 1Ch | `F_RT` | `jcall0 rd, destino` |

Seudoinstrucciones y directivas (`ensamblador.datos.jsm:66-79`):

| Nombre | Valor | Forma | Nota |
|---|---|---|---|
| `jwhile` | 0Eh | `F_WHILE` | el valor es el `op` del salto de vuelta (`jjnz`): repite mientras `r ≠ 0` |
| `jwhilez` | 0Dh | `F_WHILE` | `op` de vuelta `jjz`: repite mientras `r = 0` |
| `jwend` | 0 | `F_WEND` | |
| `jwcheck` | 0 | `F_WCHECK` | |
| `jfirst` | 0 | `F_FIRST` | |
| `dd` | 0 | `F_DD` | |
| `include` | 0 | `F_INCLUDE` | |
| `macro` | 0 | `F_MACRO` | |
| `repeat` | 0 | `F_REPEAT` | |
| `end` | 0 | `F_END` | |
| `local` | 0 | `F_LOCAL` | |
| `db` | 0 | `F_DB` | |
| `dq` | 0 | `F_DQ` | |
| `times` | 0 | `F_TIMES` | |
| `j0` … `j15` | 0 … 15 | `F_CONST` | registros (`ensamblador.datos.jsm:80-95`) |

---

## 4. La tabla del ensamblador (`ensamblador.datos`)

### 4.1 Formato binario

Secuencia de entradas de 16 bytes, terminada por una entrada cuyo nombre es cero (`ensamblador.datos.jsm:29-35`,
`:96`; lectura en `ensamblador.jsm:1771-1804`):

| Desplazamiento | Tamaño | Campo |
|---|---|---|
| 0 | 8 | Nombre en bytes, rellenado con ceros (máximo 8 bytes). |
| 8 | 4 | Valor (dword, sin signo al leerse: `ensamblador.jsm:665-669`). |
| 12 | 4 | Forma (dword, §3.2). |

La entrada terminal es `dq 0, 0` (16 bytes en cero). El archivo del estado leído tiene 59 entradas más la
terminal: 960 bytes.

### 4.2 Carga

El núcleo, al lanzar un programa cuya ruta de anfitrión es `X.ext`, busca el archivo `X.datos` (se reemplaza la
última extensión; si el nombre no tiene, se agrega `.datos`) junto al programa (`so/datos.inc:10-42`,
`so/janaxos.asm:1078-1094`), lo lee entero (hasta `MAX_PROGRAM` = 1 MiB, `so/janaxos.asm:35`;
`so/datos.inc:60`) y lo guarda en `P_INIT`/`P_INITLEN` del proceso (`so/janaxos.asm:70-71`, `:1093-1094`). La
primera orden (`rooms_first`, `so/ambientes.inc:710-770`) redondea el tamaño pedido hacia arriba a múltiplo de 8
(`:715-717`), falla si los datos iniciales no caben en ese tamaño (`:721-722`), copia los datos al comienzo del
ambiente 0 (`:751-756`) y deja `j15` = tamaño redondeado, es decir el tope del ambiente (`:758`). Para el
ensamblador, `ensamblador.bin` toma `ensamblador.datos`; la tabla queda en la dirección 0.

### 4.3 Reglas de búsqueda

- Un nombre de la fuente se compara con la tabla sólo si tiene entre 1 y 8 bytes (`ensamblador.jsm:1773-1778`).
- Se compara el nombre como qword rellenado con ceros contra el qword de cada entrada, desde la primera; gana la
  primera coincidencia (`ensamblador.jsm:1779-1802`). La comparación distingue mayúsculas.
- Se recorre hasta la primera entrada cuyo qword de nombre es 0.

### 4.4 Restricciones derivadas del mapa de memoria

La tabla vive en [0, 1000h): la cola de pedidos empieza en `QUEUE` = 1000h (`ensamblador.jsm:37`). Por lo tanto
la tabla, con su terminal, no puede superar 4096 bytes (255 entradas útiles) sin que la cola la pise (derivado del
mapa; el código no lo comprueba).

### 4.5 Efecto en la huella

La huella de cada fuente empieza con los bytes de la tabla, terminal incluida (`table_hash`,
`ensamblador.jsm:336-350`). Cambiar la tabla (por ejemplo, renombrar una instrucción) cambia la huella de todas
las fuentes y provoca que se rearmen todas (§16).

---

## 5. Léxico

Todas las reglas salen de `ensamblador.jsm:1932-2061`.

| Clase | Bytes | Fuente |
|---|---|---|
| Espacio | 20h, 09h | `skip_spaces`, `:1948-1966` |
| Fin de sentencia | 00h, `;` (3Bh), CR (0Dh), LF (0Ah) | `line_end_char`, `:1988-2002` |
| Fin de línea | LF; `end_line` avanza hasta después del siguiente LF o se detiene en 00h | `:1969-1985` |
| Carácter de identificador | `0-9`, `A-Z`, `a-z`, `_`, `.` | `is_ident`, `:2024-2046` |
| Fin de texto | byte 00h | `peek`, `next_source`, `:1392-1412` |

- **Identificador**: secuencia máxima de caracteres de identificador (`read_ident`, `:2005-2021`). Puede empezar
  por dígito o por `.`; no hay restricción de primer carácter. Distingue mayúsculas.
- **Número**: un identificador que empieza con dígito `0-9` (`unary`, `:1632-1638`) (§7.2).
- **Comentario**: desde `;` hasta el fin de línea. Como `;` es fin de sentencia, el resto se salta con `end_line`.
- **Texto**: entre comillas simples `'` (27h). Sólo se reconoce en `db` y en la ruta de `include`. No hay
  secuencias de escape; un LF o un 00h dentro del texto es error (`:997-1014`). Las comillas dobles no se
  reconocen. En la ruta de `include` el texto termina en la comilla de cierre, en LF o en 00h; si no termina en
  comilla es error (`:1117-1135`). Un CR dentro de la ruta no la corta.
- **Fin de línea CRLF**: el CR termina la sentencia y `end_line` consume hasta el LF; un archivo con CR solo (sin
  LF) se leería como una única línea (derivado de `:1969-1985`).
- Un byte 00h dentro de la fuente termina la fuente en ese punto (el texto se lee hasta el primer 0; la fuente
  completa lleva un 0 escrito después de su último byte, `:486-488`).

---

## 6. Sintaxis de las sentencias

### 6.1 Gramática

```
fuente       = { línea } ;
línea        = esp* { rótulo } [ sentencia ] esp* [ ";" comentario ] fin ;
rótulo       = ident esp* ":" esp* ;
sentencia    = asignación | orden | llamada ;
asignación   = ident esp* "=" expr ;
orden        = nombre_de_tabla operandos ;            (nombre_de_tabla: ver §4.3; operandos según la forma, §3.2)
llamada      = nombre_de_macro argumentos ;            (§12.5)
fin          = LF | CR LF | fin de texto ;
```

### 6.2 Algoritmo de una sentencia (`statement`, `ensamblador.jsm:613-696`)

1. Se borra `V_SWITCH`, se saltan espacios. Si el byte es fin de sentencia, se salta la línea y la línea termina.
2. Se lee un identificador; si tiene 0 bytes, es error.
3. Se saltan espacios. Si el siguiente byte es `:` → **rótulo** (§8.2); la función devuelve 1 y la misma línea
   sigue con otra sentencia (`do_line`, `:601-610`). Varios rótulos pueden encadenarse en una línea.
4. Si es `=` → **asignación**: se evalúa la expresión y se define el símbolo (§8.3).
5. Si no, se busca el identificador en la tabla (§4.3). Si está, se leen los operandos según su forma
   (`operands`, `:699-754`). Una forma que no es orden (`F_CONST`, `F_END`, `F_LOCAL`) es error (`:753`).
6. Si no está en la tabla, se busca entre las macros de la fuente (§12.5). Si no hay, es error.
7. **Cierre**: si hubo error o la sentencia desvió la lectura a un texto anidado (`V_SWITCH = 1`), termina. Si
   no, tras saltar espacios el byte DEBE ser fin de sentencia; si no, es error (`:680-689`).

Orden de prioridad que se deduce: rótulo y asignación se deciden por el carácter que sigue al nombre (así un
nombre de la tabla puede usarse como rótulo, `j0:`); para lo demás manda la tabla, después las macros. Una macro
no puede llevar el nombre de una entrada de la tabla.

### 6.3 Construcciones de FASM no aceptadas

Cualquier palabra al comienzo de una sentencia que no esté en la tabla ni sea una macro definida es error. En
particular no existen `if`/`else`/`end if`, `equ`, `match`, `restore`, `org`, `align`, `rb`, `rw`, `dw`, `du`,
`file`, `virtual`, `struc`, `irp`, `rept` (derivado de `ensamblador.datos.jsm:37-95` y `ensamblador.jsm:674-679`).

---

## 7. Expresiones

### 7.1 Gramática y precedencia (`ensamblador.jsm:1512-1650`)

```
expr   = term { ("+" | "-") term } ;                   asociativa a izquierda
term   = unario { ("*" | "/") unario } ;               asociativa a izquierda
unario = "-" unario | "+" unario | "(" expr ")" | "$" | número | nombre ;
```

Se permiten espacios y tabuladores entre elementos. La expresión termina en el primer carácter que no es
operador esperado; el llamador decide si lo que sigue es válido.

| Operación | Implementación | Semántica |
|---|---|---|
| `+`, `-` binarios | `jadd`, `jsub` | 64 bits, en complemento a dos, con vuelta |
| `*` | `jmul` | 64 bits bajos del producto |
| `/` | `jdiv` | división entera de Janax: trunca hacia cero; divisor 0 da 0; mínimo/−1 da mínimo (`escalon0/janax.asm:96-104`, pruebas `escalon0/pruebas/08_*`, `09_*`, `10_*`) |
| `-` unario | `0 − x` | |
| `(` `)` | | si falta `)` es error (`:1616-1619`) |
| `$` | `V_PC` | desplazamiento en bytes de la palabra actual desde el comienzo de la salida (origen 0) |

No existen `shl`, `shr`, `and`, `or`, `xor`, `not`, `mod` ni comparaciones.

### 7.2 Números (`number`, `:1653-1687`; `digit_value`, `:1690-1727`)

- Se lee el identificador completo. Si su último byte es `h` o `H`, la base es 16 y ese byte se descarta; si no,
  base 10.
- Cada byte debe ser un dígito de la base: `0-9` valen 0–9, `A-F` y `a-f` valen 10–15; cualquier otro (incluidos
  `_` y `.`) vale 99. Un dígito con valor ≥ base es error.
- Acumulación: `valor = valor × base + dígito`, en 64 bits con vuelta (sin detección de desbordamiento).
- No hay prefijos (`0x`, `$`), ni sufijos binario/octal, ni números con signo propio (el signo es el `-` unario).

### 7.3 Nombres (`symbol_value`, `:1730-1768`)

1. Si el nombre está en la tabla: si su forma es `F_CONST`, vale su valor (los registros); si es otra forma, es
   error.
2. Si no, se busca en los símbolos de la fuente (§8.1): si existe, vale su valor actual.
3. Si no existe: en la primera pasada vale 0 sin error; en la segunda es error.

---

## 8. Símbolos y rótulos

### 8.1 Tabla de símbolos (`find_entry`, `ensamblador.jsm:1854-1913`)

| Propiedad | Valor |
|---|---|
| Ubicación | `220000h` (`find_symbol`, `:1834-1841`) |
| Entradas | 65536 de 32 bytes (máscara `0FFFFh`) |
| Entrada | `+0` dirección del nombre, `+8` bytes del nombre, `+16` valor, `+24` generación |
| Dispersión | FNV-1a de 64 bits del nombre (§16.1), `AND` máscara |
| Colisiones | sondeo lineal: siguiente índice `AND` máscara |
| Entrada libre | la que tiene una generación distinta de `V_GEN` |
| Comparación | longitud igual y bytes iguales (`same_bytes`, `:1916-1930`) |

La generación `V_GEN` se incrementa al comenzar la primera pasada de cada fuente (`assemble_first`,
`:549-551`): los símbolos de la fuente anterior quedan libres sin borrarlos. No hay borrado individual ni control
de tabla llena: si las 65536 entradas fueran de la generación actual y el nombre no estuviera, la búsqueda no
terminaría (derivado de `:1869-1904`). El nombre se guarda como puntero al texto donde apareció (fuente o texto
anidado), no como copia.

### 8.2 Rótulos (`ensamblador.jsm:627-644`)

`nombre:` define el símbolo `nombre` con el valor `V_PC`. En la primera pasada, si el símbolo ya existe en la
generación actual (definido por un rótulo **o** por una asignación anterior), es error (`:631-637`). En la segunda
pasada se redefine sin comprobar.

### 8.3 Asignaciones (`ensamblador.jsm:646-659`, `define_symbol` `:1807-1831`)

`nombre = expr` define o reemplaza el valor del símbolo. Puede reasignarse cualquier cantidad de veces, también un
nombre que antes fue rótulo. Un uso de `nombre` vale la última asignación ejecutada antes en la misma pasada; en
la segunda pasada, un uso anterior a toda asignación de esa pasada ve el último valor que dejó la primera pasada
(derivado: la entrada persiste entre pasadas porque la generación no cambia, `:563-570`).

---

## 9. Datos: `db`, `dd`, `dq`, `times`

### 9.1 `db`, `dd`, `dq` (`op_data`, `ensamblador.jsm:970-1049`)

```
db  elemento { "," elemento } ;      elemento = expr | texto
dd  expr { "," expr } ;
dq  expr { "," expr } ;
```

| Directiva | Bytes por valor |
|---|---|
| `db` | 1 |
| `dd` | 4 |
| `dq` | 8 |

- Cada valor se evalúa en 64 bits y se escriben sus N bytes bajos en *little-endian* (`emit_bytes`,
  `:1470-1497`). No hay comprobación de rango: un valor que no entra se trunca.
- Un texto `'…'` sólo se admite en `db`; en `dd` o `dq` es error (`:992-994`). Cada byte del texto se emite tal
  cual.
- Tras cada elemento, si sigue una coma se lee otro; si no, la lista termina.

### 9.2 Encadenamiento con `$`

`$` vale la posición antes de la directiva; cada byte emitido avanza `V_PC`. No hay alineación automática.

### 9.3 `times cantidad sentencia` (`op_times`, `ensamblador.jsm:1052-1106`)

1. Se evalúa `cantidad`. Si es negativa, vale 0.
2. La sentencia es el resto de la línea desde el primer byte que sigue a la expresión y a los espacios que la
   siguen (`expr` los consume al buscar otro operador) hasta antes del LF (si la
   línea no termina en LF, hasta el fin del texto). Si la línea tiene un comentario, la copia lo incluye (el `;`
   termina igual la sentencia).
3. Se construye un texto anidado con `cantidad` copias de la sentencia, cada una seguida de LF, y un 0 final.
4. La lectura continúa en ese texto y vuelve al comienzo de la línea siguiente (§12.1).

Cada copia es una línea propia: `$` dentro de la sentencia vale la posición de esa copia.

---

## 10. Bucles: `jwhile`, `jwhilez`, `jwcheck`, `jwend`

### 10.1 Forma emitida

```
        jwhile r            →   P:      jjmp  C              ; op 0Ch, dist(C)
        <cuerpo>                P+4:    <cuerpo>
       [jwcheck]                C:     [<código de la condición>]   ; sólo si hay jwcheck
        <condición>
        jwend               →           jjnz r, P+4          ; op = valor de la tabla (0Eh jwhile, 0Dh jwhilez)
```

- Sin `jwcheck`, la condición `C` es la palabra del propio salto de vuelta que emite `jwend`.
- Con `jwcheck`, `C` es la posición de `jwcheck`; el código entre `jwcheck` y `jwend` se ejecuta antes de cada
  vuelta, la primera incluida.
- `jwhile r` repite mientras `r ≠ 0`; `jwhilez r` mientras `r = 0` (por el `op` de vuelta, §3.3).

### 10.2 Estado

| Estructura | Dirección | Formato | Límite |
|---|---|---|---|
| Pila de whiles abiertos | `WSTACK` = 2000h | 32 bytes: `+0` dirección del cuerpo (PC del `jjmp` + 4), `+8` registro, `+16` `op` de vuelta, `+24` número de orden (o −1 si `jwcheck` ya puso la condición) | 128 abiertos (`V_WDEPTH`) |
| Condiciones por orden | `CHECKS` = 3000h | 8 bytes por while: dirección de su condición | 2560 por pasada (`V_NWHILE`) |

### 10.3 Algoritmo

- **`jwhile r`** (`op_while`, `:831-875`): si hay 128 abiertos o ya hubo 2560 whiles en la pasada, error. Empuja
  `{PC+4, r, op, orden}`, incrementa profundidad y orden, y emite `jjmp` a `CHECKS[orden]`. En la primera pasada
  `CHECKS[orden]` puede contener un valor ajeno (de otra fuente); la distancia no se comprueba en esa pasada
  (§13.2), y en la segunda vale lo que dejó la primera.
- **`jwcheck`** (`op_wcheck`, `:906-931`): sin while abierto, error; si el while ya tiene su condición (`+24` =
  −1), error. Si no, `CHECKS[orden] = PC` y `+24 = −1`. No emite nada.
- **`jwend`** (`op_wend`, `:876-905`): sin while abierto, error. Desapila; si `+24 ≠ −1`, `CHECKS[orden] = PC`.
  Emite `op, r, 0, dist(cuerpo)`.
- Al final de cada pasada, si queda algún while abierto, error (`run_pass`, `:594-596`).

El número de orden es el índice de aparición del `jwhile` en la pasada; como las dos pasadas recorren los mismos
textos, el orden coincide y la segunda pasada conoce, al emitir el `jjmp` de entrada, la condición que aún no
leyó.

---

## 11. `jfirst r, tamaño`

`op_first`, `ensamblador.jsm:932-969`. Se evalúan `r` y `tamaño` (64 bits, con signo):

| Condición | Palabras emitidas |
|---|---|
| `tamaño < 8000h` (comparación con signo: incluye los negativos) | `jldi r, tamaño` ; `jsys r, r` |
| `tamaño ≥ 8000h` | `jldi r, tamaño >> 16` ; `jshi r, tamaño` ; `jsys r, r` |

`>>` es desplazamiento lógico (`jshr`, `:955-956`); en ambas palabras el inmediato se recorta a 16 bits. Es la
misma regla que la macro `jfirst` de `escalon0/janax.inc:108-116`. El tamaño de la instrucción (2 o 3 palabras)
depende del valor: ver §13.3.

---

## 12. Textos anidados: `include`, `repeat`, macros

### 12.1 Mecanismo común

| Elemento | Valor | Fuente |
|---|---|---|
| Zona de textos | `440000h` a `640000h` (2 MiB) | `ensamblador.jsm:36`, `text_room` `:1350-1356`, `copy_text` `:2479-2496` |
| Puntero al próximo texto | `V_TEXT`, se reinicia a 440000h en cada pasada | `run_pass` `:582-584` |
| Pila de retorno | `FRAMES` = 1500h, 8 bytes por nivel, 32 niveles | `enter_text` `:1360-1389` |

Protocolo:

1. La construcción deja en `V_BACK` el lugar donde sigue la lectura después de ella (normalmente el comienzo de la
   línea siguiente).
2. Escribe su texto a partir de `V_TEXT` y un 0 final.
3. `enter_text`: si ya hay 32 niveles, error. Apila `V_BACK`, pone la lectura (`V_POS`) al comienzo del texto,
   marca `V_SWITCH = 1` y avanza `V_TEXT` más allá del 0, alineado a 8.
4. Cada vez que la lectura encuentra un 0 y hay niveles apilados, desapila y sigue en el lugar guardado
   (`next_source`, `:1392-1412`).

Los textos de una pasada no se liberan hasta que termina. Para las copias de `times`, `repeat` y las
expansiones de macro, no caber en la zona es error (`copy_text` `:2479-2496`, `text_room_at` `:2499-2509`). Para
un archivo incluido no hay error: se lee con el pedido 5 con lugar = `text_room` (`:1180-1184`), que es lo que
queda hasta 640000h menos 8, y un archivo más grande queda **truncado sin aviso** (el pedido 5 lee a lo sumo ese
lugar, `so/janaxos.asm:3477-3520`).

### 12.2 Formato de la ruta de `include`

```
include 'ruta'
```

`op_include`, `ensamblador.jsm:1107-1167`. La ruta va entre comillas simples; si falta la de apertura o la de
cierre (antes de LF o del fin de texto), es error.

### 12.3 Resolución de `include`

1. **El idioma mismo**: si la ruta tiene 9 bytes o más y sus últimos 9 bytes son `janax.inc`, la sentencia no lee
   nada (`:1141-1159`). Cualquier ruta que termine así se trata igual (por ejemplo `x/otrojanax.inc`).
2. **Otro archivo** (`include_file`, `:1171-1205`; `join_path`, `:1209-1332`):
   - La carpeta base es la etiqueta de la **fuente principal** hasta su última `/` inclusive (no la del archivo
     que contiene el `include`).
   - La ruta se recorre por partes separadas por `/`: `..` quita la última carpeta; `.` no hace nada; cualquier
     otra parte se agrega, seguida de `/` si quedan partes.
   - Si `..` intenta subir por encima del comienzo de la etiqueta, o si la etiqueta resultante tiene 400 bytes o
     más, es error. El búfer `INCLBL` (1800h) tiene 512 bytes.
   - El resto de la línea DEBE estar vacío o ser comentario (`rest_of_line`, `:1336-1347`).
   - Se lee el archivo de esa etiqueta en la zona de textos (pedidos 4, 5, 7; §15.4); si el pedido 4 o el 5
     responden negativo, error. El pedido 4 abre con `OPEN_ALWAYS` (`so/janaxos.asm:3042`): un archivo que **no
     existe no es error**, se crea vacío en la carpeta del sistema y el `include` aporta un texto vacío. El
     pedido 4 sólo falla si la etiqueta no es UTF-8 válido, no cabe en la ruta del anfitrión, no está permitida
     al proceso o no hay manija libre (`so/janaxos.asm:3034-3055`).
   - En la primera pasada, sus bytes se agregan a la huella (§16).
   - La lectura entra en el texto (§12.1). Un archivo incluido puede incluir otros; todas las rutas se resuelven
     contra la carpeta de la fuente principal.

### 12.4 `repeat cantidad` … `end repeat` (`op_repeat`, `ensamblador.jsm:2538-2627`)

1. Se evalúa `cantidad`; el resto de la línea DEBE estar vacío o ser comentario.
2. El cuerpo empieza en la línea siguiente. Se recorren líneas: si la primera palabra de la línea (tras espacios)
   es una entrada de forma `F_REPEAT`, se incrementa un anidamiento; si es `F_END` seguida de una palabra de forma
   `F_REPEAT`, y el anidamiento es 0, ese es el cierre; si no, se decrementa. Si el texto termina antes, error.
3. El cuerpo es desde el comienzo de la línea siguiente al `repeat` hasta el comienzo de la línea del cierre.
4. `cantidad` negativa vale 0. Se escriben `cantidad` copias del cuerpo, una tras otra, y un 0.
5. La lectura entra en el texto y vuelve a la línea siguiente al `end repeat`. Los `repeat` interiores se
   expanden recién cuando se lee su copia.

No existe contador de vuelta (`%` de FASM): `%` no es carácter del idioma y sería error.

### 12.5 Macros

**Definición** (`op_macro`, `ensamblador.jsm:2067-2089`):

```
macro nombre p1, p2, … { cuerpo }
```

- Se lee el nombre y se registra en la tabla de macros (4096 entradas de 32 bytes en `420000h`, máscara `0FFFh`,
  misma organización que los símbolos: `+0` dirección del nombre, `+8` bytes, `+16` dirección donde empiezan los
  parámetros, `+24` generación; `find_macro`, `:1844-1850`). Una definición con un nombre existente reemplaza la
  anterior.
- La lectura salta hasta el primer `{` y luego hasta el primer `}`; si el texto termina antes, error. El cuerpo no
  se analiza al definir. No hay llaves anidadas: el primer `}` cierra (también uno dentro de un comentario o de un
  texto).
- Tras `}` sólo puede haber espacios y fin de sentencia.
- Una macro DEBE definirse antes de su primer uso en el texto: en la primera pasada un uso anterior no la
  encuentra y es error.

**Expansión** (`expand`, `ensamblador.jsm:2113-2390`), en cuatro pasos:

1. **Argumentos** (hasta 16; el decimoséptimo es error), separados por comas, hasta el fin de sentencia:
   - `<…>`: todo lo que hay entre `<` y el siguiente `>`, sin recorte, comas incluidas (puede cruzar líneas,
     porque la búsqueda de `>` sólo se detiene en el fin de texto).
   - Simple: desde el primer byte no espacio hasta la siguiente coma o fin de sentencia, sin espacios ni
     tabuladores finales. Puede ser vacío. Una coma o un `;` dentro de un texto entre comillas corta el argumento.
   - El resto de la línea DEBE ser fin de sentencia.
2. **Parámetros**: desde la posición guardada hasta `{`, identificadores separados por comas opcionales; hasta
   16. Un byte que no es identificador, coma, espacio ni `{` es error.
3. **Nombres locales**: cada línea del cuerpo cuya primera palabra es de forma `F_LOCAL` aporta nombres separados
   por comas; hasta 16 (los excedentes se ignoran sin error). La "primera línea" del cuerpo es lo que sigue al `{`.
4. **Texto expandido**, copiando el cuerpo byte a byte:
   - Una línea `local …` se reemplaza por un LF solo.
   - Cada identificador (§5) que coincide con un parámetro se reemplaza por el texto del argumento de igual
     índice. Si coincide con un nombre local, se escribe seguido de `.` y el número de expansión de la pasada en 16
     dígitos hexadecimales en mayúsculas (`write_hex`, `:2512-2535`); por ejemplo `start.000000000000002A`. Un
     parámetro tiene prioridad sobre un local del mismo nombre.
   - El reemplazo se hace también dentro de textos entre comillas y de comentarios (no se rastrean comillas).
   - Todo otro byte se copia.
   - Se agrega un 0, se incrementa el número de expansión (`V_EXPAND`, que vuelve a 0 en cada pasada), y la
     lectura entra en el texto y vuelve a la línea siguiente a la llamada.

Si hay menos argumentos que parámetros, un parámetro sin argumento toma el argumento del mismo índice que dejó la
última expansión que lo tuvo (o vacío si nunca hubo, suponiendo la memoria inicial en cero: no verificado): el índice no se compara con la cantidad de argumentos
(`:2325-2337`). Los argumentos sobrantes se ignoran.

---

## 13. Pasadas y resolución de saltos

### 13.1 Inicio de cada pasada (`run_pass`, `ensamblador.jsm:573-598`)

`V_POS` = comienzo de la fuente; `V_PC`, `V_NWHILE`, `V_WDEPTH`, `V_ERR`, `V_FDEPTH`, `V_EXPAND` = 0;
`V_TEXT` = 440000h. Se procesan líneas hasta el fin de la fuente o hasta el primer error.

### 13.2 Diferencias entre pasadas

| Aspecto | Primera (`V_PASS` = 1) | Segunda (`V_PASS` = 2) |
|---|---|---|
| Generación | se incrementa (`:549-551`) | la misma |
| Nombre desconocido en expresión | vale 0 | error |
| Rótulo repetido | error | se redefine |
| Bytes de salida | sólo se cuenta `V_PC` | se escriben en 120000h + `V_PC` |
| Distancia de salto fuera de 16 bits | sin control | error |
| `include` | suma el archivo a la huella | no suma |
| `CHECKS[orden]` en `jwhile` | puede ser ajeno | el de la primera pasada |

### 13.3 Invariante de las dos pasadas

El ensamblador no itera: los valores de los rótulos que la segunda pasada usa hacia adelante son los de la
primera. Por lo tanto DEBE cumplirse que cada sentencia ocupe los mismos bytes en ambas pasadas. Las únicas
construcciones cuyo tamaño depende de un valor son `jfirst` (2 o 3 palabras), `times` y `repeat` (cantidad de
copias). Si el valor que determina el tamaño usa un nombre definido más adelante, en la primera pasada vale 0 y
el resultado puede quedar con saltos equivocados **sin error** (derivado de §7.3 y §11; el código no compara las
dos pasadas).

---

## 14. Errores

El ensamblador no emite mensajes: sólo cuenta fuentes con error (§15.3). La primera condición de error de una
pasada la detiene al terminar su línea (`do_line`, `run_pass`). Lista completa de condiciones:

| Condición | Fuente (`ensamblador.jsm`) |
|---|---|
| Sentencia que no empieza con identificador | `:623-624` |
| Rótulo ya definido (primera pasada) | `:631-637` |
| Nombre que no está en la tabla ni es macro | `:674-678` |
| Forma de tabla que no es sentencia (`F_CONST`, `F_END`, `F_LOCAL`) | `:753` |
| Basura después de la sentencia | `:685-688` |
| Falta una coma entre operandos | `:1500-1507` |
| Factor inválido en expresión | `:1647-1649` |
| Falta `)` | `:1616-1619` |
| Dígito inválido para la base | `:1675-1680` |
| Nombre de instrucción/directiva usado como valor | `:1744`, `:1760-1761` |
| Nombre desconocido (segunda pasada) | `:1755-1762` |
| Distancia de salto fuera de [−32768, 32767] (segunda pasada) | `:1436-1445` |
| Salida mayor que 1 MiB (100000h bytes) | `:1489-1495` |
| `jwhile` con 128 abiertos | `:834-839` |
| Más de 2560 `jwhile` en la pasada | `:841-846` |
| `jwend` sin while | `:877-880` |
| `jwcheck` sin while, o segundo `jwcheck` | `:907-921` |
| While sin cerrar al final de la pasada | `:594-596` |
| Texto en `dd`/`dq`; texto con LF o fin de texto | `:992-994`, `:1002-1013` |
| `include` sin comillas o sin cierre | `:1110-1112`, `:1132-1135` |
| Ruta que sube fuera del comienzo o ≥ 400 bytes | `:1268`, `:1316-1324` |
| Archivo incluido cuyo pedido 4 o 5 falla (no la inexistencia: §12.3) | `:1185-1187` |
| Algo después de `include`/`repeat`/llamada de macro | `rest_of_line`, `:1336-1342` |
| Más de 32 textos anidados a la vez | `:1361-1366` |
| Sin lugar en la zona de textos | `:2479-2493`, `:2499-2508` |
| `repeat` sin `end repeat` | `:2587-2589` |
| `macro` sin nombre, sin `{` o sin `}` | `:2069-2070`, `:2092-2109` |
| Más de 16 argumentos o 16 parámetros; parámetro inválido | `:2178-2184`, `:2218-2223` |
| `>` de argumento agrupado sin cerrar | `:2135-2136` (vía `skip_to`) |

Una fuente con error (en cualquiera de las dos pasadas) no modifica el contenido de su `.bin` ni de su `.huella` anteriores
(no hay borrado ni escritura en el camino de error, `:513-517`). Efecto lateral: como la comparación de huella
(§15.4, paso 8) abre `B.huella` con el pedido 4, que crea el archivo si falta, una fuente que llega a ese paso
deja un `B.huella` vacío aunque luego falle.

---

## 15. Protocolo de una corrida del ensamblador

### 15.1 Mapa del ambiente 0

Primera orden: `jfirst j1, 640000h` (`ensamblador.jsm:117`), es decir 6.553.600 bytes.

| Dirección | Tamaño | Contenido |
|---|---|---|
| 0 | hasta 1000h | tabla `ensamblador.datos` |
| 1000h | 40h | cola de pedidos (`QUEUE`) |
| 1040h | — | variables `V_*` (`:38-81`) |
| 1200h | 256 | etiqueta de salida (`OUTLBL`) |
| 1300h | 256 | etiqueta de la huella (`HLBL`) |
| 1400h | 8 | huella leída/escrita (`FPBUF`) |
| 1500h | 32 × 8 | pila de retorno de textos (`FRAMES`) |
| 1800h | 512 | etiqueta de archivo incluido (`INCLBL`) |
| 1A00h, 1B00h, 1C00h | 16 × 16 cada una | argumentos, parámetros, locales (dirección, bytes) |
| 2000h | 128 × 32 | whiles abiertos (`WSTACK`) |
| 3000h | 2560 × 8 | condiciones por orden (`CHECKS`) |
| 10000h | 64 KiB | listado de la carpeta |
| 120000h | 1 MiB | salida |
| 220000h | 2 MiB | símbolos |
| 420000h | 128 KiB | macros |
| 440000h | 2 MiB | textos anidados |
| (otro ambiente) | bytes de la fuente + 8 | la fuente y un 0 (`V_SRC`, `V_SRCLEN`) |

Convención interna de registros (`ensamblador.jsm:118-120`): `j12 = 8`, `j13 = 1`, `j14 = 0` (base de las
variables globales), `j15` = pila de datos, que crece hacia abajo de a 8 bytes (`jsub j15, j15, j12` antes de
cada `jst`, p. ej. `:183-186`). El ensamblador no inicializa `j15`: la primera orden la deja en el tope del
ambiente 0, 640000h (`so/ambientes.inc:758`). Las rutinas reciben argumentos en `j1`-`j3` y responden en `j0`;
las que usan `j8`-`j11` los guardan en la pila y los restauran.

### 15.2 Pedidos usados

Todos con una cola de una entrada en 1000h: `+0` cantidad (1), `+8` tipo, `+16` a, `+24` b, `+32` resultado
(`sys1`, `ensamblador.jsm:171-179`). Para los pedidos sobre un archivo abierto el tipo es
`(manija << 32) | número`. Números según `so/janaxos.asm:210-216` (índice = número − 1, `:2424`):

| Nº | Servidor del núcleo | a | b | Resultado | Uso en PDP |
|---|---|---|---|---|---|
| 2 | `serve_grow` | tamaño | 0 | dirección del ambiente nuevo (negativo: fallo) | ambiente de la fuente (`:470-477`) |
| 3 | `serve_destroy` | dirección | 0 | — | devolver ese ambiente (`:538-543`) |
| 4 | `serve_open` | etiqueta | bytes | manija (negativo: fallo) | abrir; con `OPEN_ALWAYS` crea el archivo vacío si no existe y no trunca uno existente (`so/janaxos.asm:3042`) |
| 5 | `serve_fread` | destino | lugar | bytes leídos (una sola lectura del anfitrión de a lo sumo `lugar` bytes desde la posición del archivo; −1: fallo) | leer |
| 6 | `serve_fwrite` | origen | bytes | bytes escritos (−1: fallo; PDP no lo mira) | escribir |
| 7 | `serve_close` | — | — | — | cerrar |
| 12 | `serve_delete` | etiqueta | bytes | — | borrar antes de escribir |
| 14 | `serve_list` | destino | lugar | cantidad de entradas (negativo: fallo) | listar la carpeta |
| 38 | `serve_seek` | −1 (= al final) | 0 | posición | medir el tamaño (`:198-204`; `so/janaxos.asm:2641-2670`) |

Formato del listado (`so/janaxos.asm:3394-3407`): por cada archivo visible, un qword con la cantidad de bytes de
la etiqueta, los bytes de la etiqueta y relleno hasta múltiplo de 8 (el relleno no se escribe). Si el lugar no
alcanza, el listado se corta en silencio y la cantidad refleja lo que entró (`:3397-3400`). El orden es el que
entrega el anfitrión (`FindFirstFileA`/`FindNextFileA`, `:3374`, `:3409`).

### 15.3 Secuencia principal (`ensamblador.jsm:116-168`)

1. Primera orden; registros fijos; `V_TABHASH` = huella de la tabla (§16).
2. Pedido 14 con destino 10000h y lugar 10000h (64 KiB). Si el resultado es negativo, se procesan 0 entradas.
3. Por cada entrada: si la etiqueta tiene 8 bytes o más, empieza con `PDP/` y termina en `.jsm` (`want`,
   `:353-390`), se procesa la fuente (§15.4).
4. Termina con `jhalt` y `j0 = V_COUNT | (V_ERRS << 32)`: fuentes armadas en los 32 bits bajos, fuentes con error
   en los 32 altos.

### 15.4 Una fuente (`do_file`, `ensamblador.jsm:404-545`)

Sea la etiqueta `B.jsm` (`B` = la base, etiqueta sin los 4 bytes finales).

1. **Etiqueta de salida**: si `B` contiene un `.` después de su última `/`, la salida es `B`; si no, `B.bin`.
   Ejemplos: `PDP/a/x.jsm` → `PDP/a/x.bin`; `PDP/a/x.datos.jsm` → `PDP/a/x.datos`.
2. **Etiqueta de huella**: `B.huella` (siempre; `PDP/a/x.datos.huella` en el segundo ejemplo).
3. **Tamaño**: abrir (4), ir al final (38), cerrar (7). Si no se puede abrir, la fuente se omite **sin contarla**.
4. **Ambiente**: pedido 2 con tamaño + 8. Si falla, se cuenta como error.
5. **Lectura**: abrir, leer (5) con lugar = tamaño, cerrar. Si el resultado es negativo (no se pudo abrir o
   leer), se omite sin contar (el ambiente se devuelve igual, paso 11). Se escribe un 0 después del último byte
   leído (`:486-488`).
6. **Huella** = FNV-1a continuada desde `V_TABHASH` sobre los bytes de la fuente.
7. **Primera pasada** (suma a la huella los archivos incluidos). Si hay error, se cuenta como error.
8. **Comparación**: se pone `FPBUF` en 0 y se lee `B.huella` (8 bytes). Si se leyeron exactamente 8 bytes y son
   iguales a la huella, la fuente se omite (está al día) **sin contarla**.
9. **Segunda pasada**. Si hay error, se cuenta como error.
10. **Escritura** de la salida: borrar (12), abrir (4, crea), escribir (6) `V_PC` bytes desde 120000h, cerrar (7).
    El borrado previo es necesario porque el pedido 4 no trunca: sin él quedarían bytes viejos al final.
    Después, lo mismo con `B.huella` y sus 8 bytes. Se incrementa `V_COUNT`. Si abrir falla, no se escribe nada y
    no se informa (`write_file`, `:264-310`).
11. Se devuelve el ambiente de la fuente (3).

La primera pasada corre siempre, también para las fuentes al día, porque para saber qué archivos incluye hay que
leerla.

---

## 16. Huella (`.huella`)

### 16.1 FNV-1a de 64 bits (`fnv_basis`, `fnv`, `ensamblador.jsm:313-333`)

| Constante | Valor |
|---|---|
| Base | `CBF29CE484222325h` |
| Primo | `100000001B3h` |

```
h = h XOR byte ;  h = h × primo   (por cada byte, 64 bits con vuelta)
```

### 16.2 Contenido

Un solo flujo FNV-1a, empezando en la base, sobre, en este orden:

1. los bytes de la tabla en [0, fin], donde fin incluye la entrada terminal de 16 bytes (`:336-350`);
2. los bytes de la fuente;
3. los bytes de cada archivo incluido, en el orden en que la primera pasada los lee (cada aparición cuenta;
   `janax.inc` no se lee y no cuenta).

El archivo `.huella` contiene los 8 bytes de `h` en *little-endian*.

### 16.3 Lo que la huella no cubre

El código del ensamblador no entra en la huella: cambiar `ensamblador.bin` sin cambiar su tabla no rearma lo ya
armado (derivado de `table_hash`, que sólo recorre la tabla). La forma de evitarlo en la cadena de construcción es
que `armar.sh` arma siempre en una carpeta vacía (§19.3).

---

## 17. Límites

| Límite | Valor | Fuente (`ensamblador.jsm` salvo indicación) |
|---|---|---|
| Ambiente 0 | 640000h bytes | `:117` |
| Salida por fuente | 100000h bytes (1 MiB) | `:1489-1495` |
| Programa que el núcleo carga | 1 MiB | `so/janaxos.asm:35`, `:1058` |
| Símbolos por fuente | 65536 (sin control de llenado) | `:1834-1841` |
| Macros por fuente | 4096 (sin control de llenado) | `:1844-1850` |
| Whiles abiertos | 128 | `:834-839` |
| Whiles por pasada | 2560 | `:841-846` |
| Textos anidados simultáneos | 32 | `:1361-1366` |
| Zona de textos por pasada | 2 MiB menos 8 bytes | `:1350-1356`, `:2479-2496` |
| Argumentos / parámetros / locales | 16 / 16 / 16 | `:2178-2184`, `:2220-2223`, `:2271-2274` |
| Nombre en la tabla | 8 bytes | `:1773-1778` |
| Etiqueta de archivo incluido | < 400 bytes | `:1316-1320` |
| Listado de la carpeta | 64 KiB | `:122-127` |
| Etiqueta de archivo en el anfitrión | carpeta + `\` + 2 × bytes + 0 ≤ 260 | `so/janaxos.asm:285`, `:3172-3176` |
| Inmediato | 16 bits (recortado sin error) | `:1457-1459` |
| Distancia de salto | [−32768, 32767] palabras (error) | `:1440-1445` |

---

## 18. Relación con FASM y `escalon0/janax.inc`

`escalon0/janax.inc` define las mismas instrucciones como macros de FASM; ambos caminos DEBEN producir los mismos
bytes para toda fuente que PDP acepta. La batería del sistema lo exige: arma con FASM cada fuente de
`escalon0/pruebas`, `so/pruebas`, `so/bancos` y el propio `ensamblador.jsm`, la arma con PDP y compara byte a byte
(`so/pruebas/correr.sh:884-931`); y arma con ambos las fuentes de `combinaciones.awk` (§21.6) y las compara
(`:933-950`).

Diferencias de comportamiento verificables en el código:

| Aspecto | PDP | `janax.inc` sobre FASM |
|---|---|---|
| Salto fuera de alcance | error (`:1440-1445`) | se recorta a 16 bits (`janax.inc:22`, `:36`) |
| `include '…janax.inc'` | no se lee | se lee y define las macros |
| Rutas de `include` | relativas a la fuente principal | relativas a cada archivo (no verificado) |
| Pasadas | exactamente dos (§13.3) | múltiples (no verificado) |
| Operadores | `+ - * / ( ) $` | incluye `shl`, `shr`, `and`, `or` (`janax.inc:22`, `:112-113`) |
| Comparación en `jfirst` | `tamaño − 8000h` con signo | `if (size) < 8000h` (`janax.inc:109`) |

---

## 19. `so/herramientas/armar.sh`

### 19.1 Interfaz

```
bash so/herramientas/armar.sh <janaxos.exe> <carpeta de salida> [<fuente.jsm> ...]
```

| Argumento | Significado |
|---|---|
| `janaxos.exe` | Núcleo a usar (ruta de anfitrión o POSIX). |
| `carpeta de salida` | Donde quedan los binarios y la carpeta de trabajo `pdp/`. |
| `fuente.jsm` | Fuentes a armar. Cada ruta DEBE estar bajo la raíz del proyecto, escrita con el mismo prefijo que da `pwd` en el intérprete de órdenes (o relativa a la raíz con el directorio actual en la raíz): la etiqueta se forma quitando ese prefijo (`armar.sh:55`). |

Entorno de ejecución requerido: `bash` con `cygpath` (Git Bash / MSYS2), `od`, `tr`, `grep`, `cp`, `cmp`,
`timeout`, y `fd` (`armar.sh:50`). El guion usa `set -u` (`armar.sh:10`).

Códigos de salida:

| Código | Mensaje | Causa |
|---|---|---|
| 0 | — | todo armado (o sin fuentes, tras verificar la semilla) |
| 1 | `armar: el ensamblador no se pudo armar` | la corrida de autoarmado no dio `j0=0000000000000003` |
| 1 | `armar: <f> no es su propio punto fijo` | el ensamblador armado por la semilla no se arma a sí mismo idéntico |
| 3 | `armar: la semilla no esta al dia: cp <salida>/pdp/<f> <semilla>/` | el resultado no es igual a la semilla |
| 1 | `armar: esperaba N armados sin errores, dio j0=…` | alguna fuente no se armó |

### 19.2 Funciones auxiliares

- `etiqueta s` (`armar.sh:15`): los bytes de `s` en hexadecimal en minúsculas, sin separadores (`od -An -tx1`).
  Coincide con el nombre que el núcleo usa en el anfitrión (§1) cuando la etiqueta ya está en NFC (siempre, para
  ASCII).
- `corrida <carpeta del ensamblador> <carpeta del sistema>` (`armar.sh:19-22`): ejecuta
  `JANAX_ARCHIVOS=<sistema> JANAX_CAMBIO=0 timeout 300 janaxos.exe <carpeta>/ensamblador.bin` (rutas pasadas por
  `cygpath -m`), quita los CR y devuelve **todas** las coincidencias de `j0=[0-9A-F]*` en la salida, una por
  línea (`grep -o`). La línea que la produce es la `P0 codigo=… j0=… t=…` del núcleo (formato en
  `so/pruebas/correr.sh:76`); como los llamadores comparan el resultado con una sola cadena, una salida con dos
  o más `j0=` cuenta como fallo. El núcleo carga `ensamblador.datos` de la misma carpeta (§4.2).
- `propio <carpeta del ensamblador> <carpeta del sistema>` (`armar.sh:24-32`): vacía la carpeta del sistema,
  copia como `PDP/so/pdp/ensamblador/ensamblador.jsm`, `PDP/so/pdp/ensamblador/ensamblador.datos.jsm`,
  `PDP/so/nucleo/planificador.jsm` y `PDP/so/nucleo/planificador.inc` las fuentes del repositorio, corre, y exige
  `j0=0000000000000003` (tres armadas, cero errores).

### 19.3 Pasos

1. `mkdir -p <salida>/pdp`.
2. **Desde la semilla**: `propio so/pdp/semilla <salida>/pdp/de_semilla`.
3. Copia los tres productos a `<salida>/pdp/ensamblador.bin`, `<salida>/pdp/ensamblador.datos` y
   `<salida>/pdp/planificador.bin` (`armar.sh:34-36`).
4. **Desde sí mismo**: `propio <salida>/pdp <salida>/pdp/de_si_mismo`.
5. Para cada uno de los tres (`armar.sh:38-45`): `de_semilla` y `de_si_mismo` DEBEN ser idénticos (punto fijo;
   si no, código 1) y `<salida>/pdp/<f>` DEBE ser idéntico a `so/pdp/semilla/<f>` (si no, código 3).
6. Si no hay fuentes, termina con 0.
7. **Carpeta de fuentes** `<salida>/pdp/fuentes`, vaciada: se copia cada `*.inc` de `escalon0/`, `so/` y
   `razar/` (excluidas las carpetas `build`; `fd` además omite lo que ignora git y lo oculto) como
   `PDP/<ruta relativa>`, y cada fuente como `PDP/<ruta relativa>` (`armar.sh:49-57`).
8. **Corrida** con el ensamblador de `<salida>/pdp`; DEBE dar `j0` = cantidad de fuentes en 16 dígitos
   hexadecimales (todas armadas, cero errores) (`armar.sh:58-59`).
9. **Copia de resultados** (`armar.sh:60-64`): para la fuente `R.jsm`, se toma `PDP/R` si el nombre de archivo de
   `R` contiene un `.`, o `PDP/R.bin` si no, y se copia a `<salida>/<nombre de archivo>` (la salida es plana: dos
   fuentes con el mismo nombre en carpetas distintas se pisan).

### 19.4 Archivos intermedios

| Ruta | Contenido |
|---|---|
| `<salida>/pdp/de_semilla/` | carpeta del sistema del armado desde la semilla (nombres en hexadecimal) |
| `<salida>/pdp/de_si_mismo/` | la del armado desde el resultado anterior |
| `<salida>/pdp/ensamblador.bin`, `ensamblador.datos`, `planificador.bin` | ensamblador y planificador vigentes |
| `<salida>/pdp/fuentes/` | carpeta del sistema con todos los `.inc`, las fuentes, sus salidas y sus `.huella` |
| `<salida>/<nombre>.bin` o `<salida>/<nombre>.<ext>` | binarios finales |

Como la carpeta de fuentes se vacía en cada ejecución, cada ejecución arma todas las fuentes pedidas desde cero;
la omisión por huella (§15.4) no actúa a través de `armar.sh` (derivado de `armar.sh:49`).

---

## 20. Construcción reproducible

### 20.1 Requisitos

| Requisito | Detalle |
|---|---|
| FASM | `flat assembler version 1.73.35` según el registro `so/build/janaxos.log:1`. Los guiones lo buscan en `$FASM`; si no está definida usan una ruta absoluta fija de la máquina de desarrollo (`so/pruebas/correr.sh:10`), por lo que en otra máquina hay que definir `FASM`. |
| `INCLUDE` | Variable de entorno con la carpeta `INCLUDE` de FASM (con valor por omisión igualmente fijo, `so/pruebas/correr.sh:11`): `janaxos.asm` hace `include 'win64a.inc'` (`so/janaxos.asm:33`). |
| Anfitrión | Windows x86-64: `janaxos.asm` es `format PE64 console` (`so/janaxos.asm:30`). |
| Intérprete de órdenes | Git Bash o MSYS2 con las órdenes de §19.1. |

### 20.2 Núcleo `janaxos.exe`

```
export INCLUDE=<carpeta INCLUDE de FASM>
"$FASM" so/janaxos.asm so/build/janaxos.exe > so/build/janaxos.log 2>&1
```

Un código de salida distinto de 0 de FASM es fallo; los guiones muestran entonces el registro y terminan con 1
(`so/pruebas/correr.sh:15-17`).

(`so/pruebas/correr.sh:15`, `escalon0/pruebas/correr.sh:21`). Dependencias de la fuente:

- archivos incluidos de `so/`: `pantalla.inc` (`so/janaxos.asm:572`, `:2019`), `datos.inc`, `anfitrion.inc`,
  `ayudantes.inc`, `remos.inc`, `venn.inc`, `ambientes.inc`, `vigia.inc` (`:2011-2017`), `rutinas.inc`,
  `nativo.inc` (`:5292-5293`);
- el planificador de fábrica, incrustado con `file 'pdp/semilla/planificador.bin'` (`so/janaxos.asm:444`): el
  núcleo depende de la semilla, y la semilla del planificador DEBE estar al día (`armar.sh` lo verifica, §19.3).

El registro del estado leído dice `4 passes, 0.2 seconds, 326144 bytes.` (`so/build/janaxos.log:2`); es un dato de
una construcción concreta, no una constante.

### 20.3 Otros ejecutables x86 del repositorio

| Fuente | Orden | Fuente de la orden |
|---|---|---|
| `escalon0/janax.asm` | `"$FASM" escalon0/janax.asm escalon0/build/janax.exe` | `escalon0/pruebas/correr.sh:13-17` |
| `escalon0/traductor.asm` | ídem, `traductor.exe` | ídem |
| `escalon0/traductor_arm64.asm` | ídem, `traductor_arm64.exe` | `escalon0/pruebas/correr.sh:103` |
| `so/arrancar.asm` | `format PE64 GUI 5.0` (`so/arrancar.asm:5`); su orden de armado está en la cadena del instalador (capítulo 11) | (no verificado en este capítulo) |

### 20.4 Cualquier programa Janax

```
bash so/herramientas/armar.sh so/build/janaxos.exe <carpeta de salida> /ruta/absoluta/bajo/la/raiz/X.jsm ...
```

Ejemplos del repositorio: `so/pruebas/correr.sh:20`, `escalon0/pruebas/correr.sh:24-25`,
`razar/cuerpo/luma.sh:36` (arma `luma.jsm` y `pulso.datos.jsm`), `razar/cuerpo/vida.sh:31`. Un archivo de datos
iniciales se escribe como `X.datos.jsm` y se pasa como una fuente más: sale `X.datos`.

### 20.5 Procedimiento completo desde un repositorio limpio

1. Definir `FASM` e `INCLUDE` (§20.1).
2. Armar el núcleo (§20.2). Requiere `so/pdp/semilla/planificador.bin`.
3. Ejecutar `armar.sh` con ese núcleo: verifica la semilla del ensamblador y del planificador (§19.3).
   - Código 3: la fuente del ensamblador, de su tabla o del planificador cambió. Copiar los archivos que indica el
     mensaje a `so/pdp/semilla/`, volver al paso 2 (el núcleo incrusta el planificador) y repetir hasta que
     `armar.sh` termine con 0.
4. Armar las fuentes deseadas con `armar.sh`.
5. Verificación opcional: `bash so/pruebas/correr.sh` (incluye la comparación byte a byte con FASM, §18) y
   `bash escalon0/pruebas/correr.sh`.

Arranque sin semilla: `ensamblador.jsm` se arma con FASM en la batería (`so/pruebas/correr.sh:895-903`), por lo
que FASM con `escalon0/janax.inc` produce un `ensamblador.bin` equivalente. Que FASM arme también
`ensamblador.datos.jsm` y `planificador.jsm` sin cambios es (no verificado).

### 20.6 Lo que contiene `so/build` tras las baterías (sólo listado)

| Elemento | Productor |
|---|---|
| `janaxos.exe`, `janaxos.log` | FASM (`so/pruebas/correr.sh:15`) |
| `janaxos.<sufijo>.exe` (`anterior-*`, `antes-*`, `viejo-*`) | copias de núcleos anteriores; ningún guion revisado las produce (no verificado) |
| `*.bin` (106 en el estado leído) | `armar.sh` sobre las pruebas (`so/pruebas/correr.sh:20`) |
| `*.datos` | `printf` de la batería (`so/pruebas/correr.sh:230-231`) |
| `pdp/` (`de_semilla/`, `de_si_mismo/`, `fuentes/`, ensamblador y planificador) | `armar.sh` (§19.4) |
| `pdp_rutinas/`, `pdp_interprete/`, `pdp_traductor/`, `pdp_fasm/` | prueba PDP contra FASM por motor (`so/pruebas/correr.sh:887-931`) |
| `combinaciones/`, `pdp_comb/` | `combinaciones.awk` y su comparación (`:936-949`) |
| `archivos/`, `archivos_lista/`, `archivos_nfc/`, `familia_*/`, `plan_largo/`, `plan_roto/` | carpetas del sistema de casos de prueba (`:27`, `:69-73`, `:159`, `:165`, `:652-656`) |
| `libro_anfitrion.txt` | `:579` |

---

## 21. Herramientas de `so/herramientas/`

Todas operan sobre texto; ninguna se ejecuta dentro de Janax.

### 21.1 `rotar_janax.py` — bucles escritos a mano a `jwhile`

Uso: `python -I so/herramientas/rotar_janax.py archivo.jsm ...`. Reescribe cada archivo en su lugar (UTF-8,
conservando los finales de línea) e imprime `<cantidad> <ruta>` (`rotar_janax.py:113-126`).

Definiciones (`:17-51`): un rótulo es `^[ \t]*([A-Za-z_]\w*):`; un salto es `jjmp`, `jjz` o `jjnz` con sus
argumentos; los comentarios se quitan antes de analizar; una línea está "dentro de una macro" desde una línea que
empieza con `macro` hasta que se equilibran `{` y `}`.

Patrón reconocido (`one`, `:54-110`):

```
L:                     ; rótulo, línea top
  C                    ; condición: líneas sin rótulo, sin salto, sin jret/jhalt/jwhile/jwhilez/jwend/jwcheck
  jjz r, OUT           ; o jjnz r, OUT  (línea k)
  B                    ; cuerpo
  jjmp L               ; línea j
OUT:                   ; DEBE estar definida después de j
```

Condiciones para transformar: `L` definido antes de `j`; ninguna línea de `top..j` dentro de macro; la línea `k`
no tiene rótulo y es `jjz`/`jjnz`; `OUT` se define después de `j`; los `jwhile`/`jwhilez`/`jwend` del cuerpo
están equilibrados y nunca bajan de 0.

Resultado:

```
jwhile r              ; si la salida era jjz  (jwhilez r si era jjnz)
  B
jwcheck               ; sólo si C no está vacío o L se usa en otra línea
L:                    ; sólo si L se usa en otra línea (otro salto puede llegar a la condición)
  C
jwend
jjmp OUT              ; sólo si la primera línea no vacía después de j no es el rótulo OUT
```

Equivalencia (derivada): la secuencia de instrucciones que no son saltos es la misma (`C`, prueba, `B`, `C`,
prueba, …); los saltos a `L` desde otras líneas siguen cayendo en `C`. La sangría es la de la línea del rótulo.
Se aplica repetidamente hasta que no queda patrón (bucles interiores primero, por orden de aparición del `jjmp`).

### 21.2 `modismos_janax.py` — secuencias largas a instrucciones de un paso

Uso: `python -I so/herramientas/modismos_janax.py archivo.jsm ...`. Reescribe en su lugar e imprime
`jcall0=N jjn=N jldadd=N jldx=N <ruta>` (`:263-270`).

| Nº | Secuencia original (consecutiva) | Reemplazo | Condiciones (`:199-259`) |
|---|---|---|---|
| 1 | `jcall L` / `jldi r, 0` | `jcall0 r, L` | `r` registro; el inmediato es el texto literal `0` |
| 2 | `jsub t, a, b` / `jldi s, 63` / `jsar t, t, s` / `jjz t, X` | `jsub t, a, b` / `jjnn t, X` (`jjn` si era `jjnz`) | `s ≠ t`; `s` no es `a` ni `b`; `t` y `s` muertos en ambos sucesores (la siguiente y `X`) |
| 3 | `jld r, b, K` / `jldi s, 1` / `jadd r, r, s` (o `r, s, r`) / `jst r, b, K` | `jldi r, 1` / `jldadd r, b, K` | `r ≠ b`; `s` no es `r` ni `b`; argumentos de `jst` textualmente iguales a los de `jld`; `s` muerto después |
| 4 | `jldi s, 3` / `jshl t, i, s` / `jld b, z, K` / `jadd t, t, b` (o `t, b, t`) / `jld x, t, 0` | `jld b, z, K` / `jldx x, b, i` | `s ≠ i`; `b ≠ i`; `b` y `z` no son `t` ni `s`; desplazamiento final literal `0`; `s` y `t` (salvo el que sea `x`) muertos después |

"Consecutiva" (`seq`, `:175-185`): instrucciones sucesivas en el orden de ejecución lineal, ninguna salvo la
primera con rótulo, sin líneas de rótulo intercaladas y sin haber sido reemplazadas. Nada dentro de macros se
toca (`build`, `:75-89`).

Análisis de vida (`live`, `:120-164`): recorrido en profundidad desde el sucesor; un registro está vivo si algún
camino lo lee antes de escribirlo. Efectos (`effect`, `:50-72`):

| Instrucción | Lee | Escribe | Control |
|---|---|---|---|
| `jldi rd` | — | rd | sigue |
| `jshi rd` | rd | rd | sigue |
| tres registros (`jadd`…`jxor`, `jldx`) | ra, rb | rd | sigue |
| `jld`, `jldb` | ra | rd | sigue |
| `jldadd` | rd, ra | rd | sigue |
| `jst`, `jstb` | rd, ra | — | sigue |
| `jjz`, `jjnz`, `jjn`, `jjnn` | rd | — | destino y siguiente |
| `jjmp` | — | — | destino |
| `jwhile`, `jwhilez` | — | — | a su condición (`jwcheck` o `jwend`) |
| `jwcheck` | — | — | siguiente |
| `jwend` | registro del while | — | primera del cuerpo y siguiente |
| cualquier otra (`jcall`, `jret`, `jhalt`, `jsys`, macros, operandos no registro) | todos | — | se considera vivo |

También se considera vivo: llegar al final del archivo, un destino de salto sin rótulo conocido, o más de 4000
pasos. Los comentarios de las líneas reemplazadas se unen con un espacio y se agregan a la primera línea nueva:
si esa línea (sangría incluida) tiene menos de 31 caracteres se rellena con espacios hasta 31 y sigue un espacio,
de modo que el `;` queda en la posición 33 contando desde 1; si no, se agrega tras un espacio (`put`,
`:187-197`).

### 21.3 `bucles_janax.awk` — inventario de bucles a mano en Janax

Uso: `awk -f so/herramientas/bucles_janax.awk archivo.jsm`. Requiere GNU awk (usa `match` con tres
argumentos). Imprime `%5d %-4s %s` (línea, `jjmp`/`jjz`/`jjnz`, destino) por cada salto a un rótulo ya definido
más arriba, y al final `N bucles hechos a mano`; código de salida 1 si N > 0 (`bucles_janax.awk:8-20`).

### 21.4 `bucles.awk` — verificador de bucles en fuentes FASM

Uso: `awk -f so/herramientas/bucles.awk archivo.asm` (GNU awk). Considera bucle todo salto (`j…` o `loop…`) a un
rótulo definido antes, dentro de la misma rutina: rótulo local `.x` de la rutina actual, `@b`/`@r`, o el nombre
de la rutina (`bucles.awk:19-32`). Clasifica (`:34-46`):

| Forma | Condición |
|---|---|
| `while` | la línea no vacía anterior al rótulo de cuerpo es `jmp C`, con `C` definido entre el rótulo y el salto |
| `arriba` | no rotado, salto incondicional |
| `abajo` | no rotado, salto condicional |

Imprime una línea por bucle y `N bucles, M sin forma de while rotado`; código de salida 1 si M > 0. Se aplica en
las baterías a `escalon0/janax.asm`, `traductor.asm`, `traductor_arm64.asm`, `ventanita.inc`
(`escalon0/pruebas/correr.sh:151-157`) y a `janaxos.asm` y sus `.inc` principales (`so/pruebas/correr.sh:984-990`).

### 21.5 `rotar.pl` — rotación de bucles en fuentes FASM

Uso: `perl so/herramientas/rotar.pl archivo.asm`. Reemplazo por expresión regular, repetido hasta que no cambia
(`rotar.pl:14-29`):

```
.L:            ; carga y cmp/test, sin saltos         jmp .L
  <chequeo>                                           .L_lap:
  jcc .exit                                  →          <cuerpo>
  <cuerpo>     ; sin rótulos globales ni jmp .L       .L:
  jmp .L                                                <chequeo>
                                                        j!cc .L_lap
                                                        jmp .exit      ; si .exit no es el rótulo siguiente
```

Inversos de condición: `ja/jbe`, `jae/jb`, `je/jne`, `jz/jnz`, `jg/jle`, `jge/jl`, `js/jns`, `jc/jnc`
(`:11-12`); una condición sin inverso aborta. Imprime `N bucles rotados`.

### 21.6 `combinaciones.awk` — generador de la prueba exhaustiva de codificación

Uso: `awk -f so/herramientas/combinaciones.awk -v dir=<carpeta> -v inc=<ruta de janax.inc>`. Genera 40 fuentes
`.jsm`, cada una con `include '<inc>'` (`combinaciones.awk:12-84`):

| Fuentes | Contenido |
|---|---|
| `alu_<op>` × 11 (`jadd jsub jmul jdiv jshl jshr jsar jand jor jxor jldx`) | 16 × 16 × 16 combinaciones de registros |
| `inm_<op>_a`, `_b` × 2 (`jldi jshi`) | `_a`: los 16 registros con 0, e inmediatos −32768…−1 en decimal con `j15`; `_b`: 0…32767 en hexadecimal `0XXXXh` |
| `mem_<op>_a`, `_b` × 5 (`jld jst jldb jstb jldadd`) | `_a`: 16 × 16 pares con 0 y −32768…−1; `_b`: 0…32767 en hexadecimal |
| `salto_<op>_a`, `_b` × 2 (`jjmp jcall`) | distancias −32768…−1 y 0…32767, escritas como `$ ± (4d + 4)` |
| `salto_<op>_a`, `_b` × 5 (`jjz jjnz jjn jjnn jcall0`) | ídem con `j15`; `_a` además los 16 registros con destino `$` |
| `otras` | `jsys` y `jhost` 16 × 16; `jhalt`; `jret`; por registro: `jwhile`/`jwend`, `jwhilez`/`jwend`, `jwhile`/`jwcheck`/`jwend`; `jfirst` con 12 tamaños (`0 1 8 32767 32768 32769 65535 65536 1193046 2147483647 -1 -32768`) por registro; `dd` con 8 valores (`0 1 -1 2147483647 -2147483648 2147483648 4294967295 305419896`) |

Cada fuente se arma con FASM y con PDP y se compara byte a byte (`so/pruebas/correr.sh:933-950`).

### 21.7 `cuantos.pl` y `turnos.pl` — generadores de pruebas del planificador

Escriben por la salida estándar una fuente de prueba que compara las rutinas de `so/nucleo/planificador.inc`
contra matemática exacta con enteros grandes (`Math::BigInt`). Cada caso carga los operandos con
`jldi r, 0` + 4 × `jshi r, 0XXXXh`, llama a la rutina y suma 1 a `j10` si el resultado difiere; termina con
`j0 = j10` y la línea `; espera: 0000000000000000`.

| Guion | Salida | Rutina | Valor esperado | Casos |
|---|---|---|---|---|
| `cuantos.pl` | `escalon0/pruebas/43_cuantos.jsm` | `cuanto` (j1 = p en 65536avos, j3 = c en dieciseisavos) | `2^62` si `p ≥ 65536`; si no, `max(1, ⌈c·p / ((65536 − p)·16)⌉)` (`cuantos.pl:7-13`) | 13 fijos + 60 aleatorios, semilla 43 |
| `turnos.pl` | `escalon0/pruebas/41_turnos.jsm` | `turno` (j1 = D, j2 = s, j3 = c en dieciseisavos) | el menor entero `t ≥ D + 1` con `t·(16t − 16D − c) ≥ c·s`; `D + 1` si `c = 0` (`turnos.pl:8-18`) | 26 fijos + 200 aleatorios, semilla 29 |

---

## 22. Bancos de medida

Programas Janax sin verificación de resultado en las baterías; los de `so/bancos` sí se arman en la prueba PDP
contra FASM (`so/pruebas/correr.sh:895`). Cómo se ejecutan los de `escalon0/bancos` (no verificado: ningún guion
del repositorio los nombra).

| Programa | Qué ejecuta (derivado del código) |
|---|---|
| `escalon0/bancos/arranque_250k.jsm` | `repeat 250000` de `jadd`: 250.003 instrucciones en línea recta. |
| `escalon0/bancos/suma_100m.jsm` | `j1 = 05F5E100h` (100.000.000); `jwhile` de 2 instrucciones + salto: 3 por vuelta. |
| `escalon0/bancos/suma_1000m.jsm` | ídem con `j1 = 3B9ACA00h` (1.000.000.000). |
| `so/bancos/calculo.jsm` | `jfirst j1, 8`; `j1 = 4000000h` (67.108.864) vueltas de `jcall paso` (6 instrucciones + `jret`) + `jsub` + salto: 10 por vuelta. |
| `so/bancos/calculo_ambiente.jsm` | lo mismo con la memoria en un ambiente pedido con el pedido 2 (macro `pedido` de `so/pruebas/ambientes.inc`). |
| `so/bancos/lote_10000.jsm` | 10.000 pedidos de tipo 1 (escribir `x\n`) en una sola cola y un solo `jsys`. |
| `so/bancos/uno_por_uno_10000.jsm` | los mismos 10.000 pedidos, un `jsys` por pedido. |

---

## 23. Puntos no verificados

- Comportamiento de FASM en: resolución de `include` relativa a cada archivo, cantidad de pasadas (§18).
- Que FASM arme `ensamblador.datos.jsm` y `planificador.jsm` sin cambios, para arrancar sin semilla (§20.5).
- Orden de armado de `so/arrancar.asm` (capítulo 11) (§20.3).
- Origen de las copias `janaxos.<sufijo>.exe` en `so/build` (§20.6).
- Forma de ejecutar los bancos de `escalon0/bancos` (§22).
- Contenido inicial de la memoria del ambiente 0 fuera de la tabla (se supone en cero para los argumentos de
  macro nunca escritos, §12.5); depende de cómo el núcleo reserva la memoria (capítulo 03).
