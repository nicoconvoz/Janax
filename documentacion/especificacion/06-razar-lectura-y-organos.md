# 06. Razar: lectura, órganos, recetas, juez y ortografía

**Alcance.** Este capítulo especifica la parte de Razar que vive en `razar/lectura/`: cómo un lector Razar lee un
libro y lo convierte en una fila de números (tokenización, numeración de palabras, renglones de prueba, estante,
pedazos), cómo cuelga pedidos con hueco sobre ventanas de tres y cuatro palabras y los despierta en pulsos, el juez
que paga cada diferencia en bits, el examen que mide un genoma, el lector de órganos (`organo.inc`) con su alfabeto
completo de quince letras (mezclas, huecos, sentidos, ojo, palabras, células, tejidos y engranajes), el formato
binario y textual de una receta y de una forma, el ciclo que muta, examina y conserva órganos (`pulso.jsm`), los
archivos que todo esto lee y escribe con sus desplazamientos, y la regla de ortografía (`ort_eat`, `ort_load`,
`ort_fix`). Los demás programas del directorio (`lector`, `comer`, `vigia`, `pregunta`, `sentido`, y los módulos
`pistas.inc`, `idioma.inc`, `negacion.inc`) se describen en su interfaz y sus formatos; su algoritmo interno completo
no se especifica aquí (§15). No cubre: la codificación de instrucciones Janax y la semántica de `jwhile`/`jcall0`
(capítulo 01), el ensamblador PDP y la construcción de `.bin`/`.datos` (capítulo 02), procesos, salas y planificador
(capítulo 03), el contrato de cada pedido al núcleo (capítulo 04; aquí sólo se dice cómo se usa), la ventana y el
vigía del anfitrión (capítulo 05), el cardumen (capítulo 07), el cuerpo de Luma que escribe las formas y los
engranajes en los datos del lector (capítulo 08), la conversación (capítulo 09), la pantalla y vida de Luma
(capítulo 10) y el instalador (capítulo 11).

Las referencias `ruta:línea` son relativas a la raíz del repositorio. Las afirmaciones salen del código; lo que no
pudo verificarse en el código se marca "(no verificado)". Los números hexadecimales se escriben como en el código
(`1200h`). "qword" = 8 bytes, little-endian.

---

## 1. Definiciones y notación

| Término | Definición |
|---|---|
| Libro | Secuencia de bytes que el lector recorre. Puede ser el archivo `libro`, la concatenación de un estante, un libro del disco o un libro del anfitrión (§5.1). |
| Unidad | Elemento de la fila: una palabra, una marca o un fin de renglón. |
| Palabra | Secuencia máxima de letras (`a`-`z`, `A`-`Z` pasadas a minúscula, `0`-`9`, y U+00C0..U+00FF codificadas `C3 xx`) (`razar/lectura/lectura.inc:933-1103`). |
| Marca | Unidad de un solo carácter no alfanumérico (ASCII `21h`-`7Fh` que no es letra ni dígito; `7Fh` incluido, consecuencia de `tb_small`) o una secuencia UTF-8 de 2 a 4 bytes que no es `C3 xx` (`razar/lectura/lectura.inc:995-1024,1042-1051,1094-1098`). Recibe número como una palabra. `w_mark` la reconoce porque su primer byte no es `C3h`, `a`-`z` ni `0`-`9` (`razar/lectura/lectura.inc:2068-2102`). |
| Renglón | Fin de línea (`0Ah`) o salto de página (`0Ch`); en la fila es el número 0. Dos renglones seguidos son uno (`razar/lectura/lectura.inc:1267-1294`). |
| Número de palabra | Índice asignado en orden de primera aparición, desde 1; 0 = renglón (`razar/lectura/lectura.inc:1379-1514`). `NV` = siguiente número libre. |
| Fila | `ROOMT`: un qword por unidad; la unidad 0 es un renglón (`razar/lectura/lectura.inc:247-251`). `NTOK` = unidades. |
| Renglón de prueba | Uno de cada `K` renglones, apartado (§5.6). |
| Ventana | Cuatro unidades consecutivas `w0 w1 w2 w3` a partir de la posición `JJ` de la fila (`WAT` = dirección de `w0`) (`razar/lectura/pulso.inc:449-602`). |
| Medio y cola de la ventana | Términos de este capítulo (no del código): el *medio* son `w1` y `w2`, las posiciones que un molde puede sacar; la *cola* es `w3`, presente sólo en los moldes de cuatro palabras. |
| Pedido con hueco | Entrada `{clave, silueta, peso, ocurrencia}` de `ROOMR`: un marco con un hueco y lo que lo llena. |
| Llenado | Valor que ocupa el hueco: una letra (piso 1), un número de palabra o 0 = "dicho vacío" (piso 2), dos palabras empaquetadas (piso 3). |
| Pulso | Encuentro, en la misma clave, de dos llenados distintos (§6.4). |
| Diferencia | Par no ordenado de llenados de un pulso, con su piso y, en el piso 3, si dio vuelta (§6.4). |
| Pieza | Diferencia cuyo juez da bits ahorrados > 0 (§7). |
| Órgano / receta | Cadena de letras de 4 bits (1..15) que el lector de órganos interpreta sobre cada ventana (§10). "Receta" es también el texto que la describe (§11). |
| Forma | Receta de hasta 31 letras guardada como una "palabra" de 16 bytes en `ORGT` (§11.6). |
| Engranaje | Hasta 15 instrucciones Janax aritméticas en un bloque de 128 bytes (§10.7). |
| Genoma | Qword de instintos: byte 0 paciencia, byte 1 firmeza, byte 2 lecturas (§9.3). |
| `j0`..`j14` | Registros Janax. `j1` se usa como base 0 en casi todo acceso a variables. |

Notación de los hashes: `FNVO` = `CBF29CE484222325h`, `FNVP` = `100000001B3h` (`razar/lectura/lectura.inc:144-154`).
`hw(h, x)` = `(h xor x) * FNVP mod 2^64` sobre un qword entero (`razar/lectura/pulso.inc:605-610`). FNV-1a de bytes =
`hw` aplicado byte a byte desde `FNVO`.

---

## 2. Programas y fuentes

| Fuente | Rol | Incluye |
|---|---|---|
| `razar/lectura/lectura.inc` | Lectura del libro, fila, salida de texto, `ask`, `room`, `lg16`, límites de edificio. Compartido por todos los lectores. | — |
| `razar/lectura/crece.inc` | Tablas hash que crecen (`pl_new`, `pl_find`, `pl_take`, `pl_grow`). | — |
| `razar/lectura/pulso.inc` | Pisos, ventanas, pedidos, pulsos, juez, conceptos. Compartido por `pulso` y `pregunta`. | — |
| `razar/lectura/organo.inc` | El lector de órganos (`organ`). | — |
| `razar/lectura/negacion.inc` | Destilado del interruptor sí/no (`distill_no`, `n_flags`). | — |
| `razar/lectura/casa.inc` | Cimiento y muebles (`house_decide`). | — |
| `razar/lectura/idioma.inc`, `pistas.inc`, `carpeta.inc` | Idiomas por contexto; preguntar siguiendo pistas; carpeta propia. | — |
| `razar/lectura/pulso.jsm` | Programa principal de Razar: pulso, evolución de instintos, memoria, ciclo de órganos, sociedad. | `crece.inc`, `casa.inc`, `pulso.inc`, `organo.inc`, `negacion.inc`, `lectura.inc`, en ese orden (`razar/lectura/pulso.jsm:7977-7982`) |
| `razar/lectura/lector.jsm` | Lector de prueba: tapar palabras (eco / izquierda / dos lados). | `crece.inc`, `lectura.inc` (`razar/lectura/lector.jsm:742-743`) |
| `razar/lectura/comer.jsm` | Comer un libro del anfitrión y dejar pistas en la biblioteca. | `crece.inc`, `casa.inc`, `pulso.inc`, `organo.inc`, `negacion.inc`, `lectura.inc`, `carpeta.inc` (`razar/lectura/comer.jsm:2689-2695`) |
| `razar/lectura/sentido.jsm` | Esqueletos, significado, ortografía. | `crece.inc`, `casa.inc`, `pulso.inc`, `organo.inc`, `negacion.inc`, `lectura.inc`, `idioma.inc` (`razar/lectura/sentido.jsm:11804-11810`) |
| `razar/lectura/pregunta.jsm` | Preguntas con huecos. | `crece.inc`, `pulso.inc`, `organo.inc`, `negacion.inc`, `pistas.inc`, `carpeta.inc` (`razar/lectura/pregunta.jsm:375-380`); `lectura.inc`, `idioma.inc` (`razar/lectura/pregunta.jsm:1535-1536`) |
| `razar/lectura/vigia.jsm` | Espera archivos nuevos del anfitrión y lanza `comer`. | ninguno de este directorio (sólo `escalon0/janax.inc`, `razar/lectura/vigia.jsm:43`) |
| `razar/lectura/organo.molde` | Bloques de etiquetas y descripciones de letras que lee `pulso.jsm` (§12.1). | — |
| `X.datos.jsm` | Datos iniciales de cada programa: etiquetas y textos cada `40h` bytes, terminados en 0 (p. ej. `razar/lectura/pulso.datos.jsm:1-3`). | — |

Cada programa empieza con `jfirst j1, 10000h` (sala 0 de `10000h` bytes) salvo `vigia` (`4000h`)
(`razar/lectura/pulso.jsm:318`, `razar/lectura/lector.jsm:81`, `razar/lectura/sentido.jsm:450`,
`razar/lectura/comer.jsm:168`, `razar/lectura/pregunta.jsm:93`, `razar/lectura/vigia.jsm:44`). Las variables se
direccionan como desplazamientos absolutos en la sala 0. Como `organo.inc` y `pulso.inc` están incluidos también en
`comer`, `sentido` y `pregunta`, el lector de órganos corre en esos programas con el `ORGW` de sus propios datos
iniciales (cero: no hace nada, §10.2).

---

## 3. Convenciones comunes

### 3.1 Ventana de pedidos (`ask`)

`ask` (`razar/lectura/lectura.inc:2043-2054`) escribe una cola de un pedido en `QUEUE` = `1000h`:

| Desplazamiento | Contenido |
|---|---|
| `QUEUE+0` | 1 (cantidad de entradas) |
| `QUEUE+8` | tipo (`j10`) |
| `QUEUE+16` | argumento a (`j11`) |
| `QUEUE+24` | argumento b (`j12`) |
| `QUEUE+32` | respuesta (leída a `j13`) |

y ejecuta `jsys j14, j14` con `j14` = `QUEUE`. Para pedidos sobre un manejador abierto, `j10` = `(manejador << 32) | tipo`.
Formato de cola y semántica de cada pedido: capítulo 04.

Pedidos que usa este código (descripción según su uso aquí):

| Nº | Uso en `razar/lectura` |
|---|---|
| 1 | Escribir texto a la consola (`razar/lectura/lectura.inc:1891-1896`). |
| 2 | Pedir una sala de `j11` bytes → dirección; −1 = sin memoria (`razar/lectura/lectura.inc:1737-1743`). |
| 3 | Devolver una sala (`razar/lectura/crece.inc:148-151`). |
| 4 | Abrir (crea si no existe) un archivo por etiqueta → manejador o negativo (`razar/lectura/lectura.inc:156-159`). |
| 5 | Leer del manejador a una dirección → bytes leídos (`razar/lectura/lectura.inc:840-868`). |
| 6 | Escribir al manejador. |
| 7 | Cerrar. |
| 12 | Borrar archivo por etiqueta (`razar/lectura/pulso.jsm:3705`). |
| 14 | Listar etiquetas: `{largo qword, bytes rellenados a 8}` por etiqueta → cantidad que entró (`razar/lectura/lectura.inc:382-403`). |
| 16 | Lanzar un hijo; en `og_trial` `j10` = `(14 << 32) | 16` (`razar/lectura/pulso.jsm:4855-4860`). |
| 17, 18, 19 | Firmar un pedido pendiente; listar pendientes `{número, hijo, tipo}` de 24 bytes; estado de una cabina (`razar/lectura/pulso.jsm:4877-4965`). |
| 20 | Bolita (fracción de turno) de la cabina; `j11` = −1 consulta/restituye (`razar/lectura/organo.inc:453-505,603-616`) (semántica exacta de −1: no verificado aquí). |
| 29 | Timbre: dormir hasta un evento → quién tocó, −1 = nadie queda (`razar/lectura/pulso.jsm:4880-4884`). |
| 30 | Decir una palabra a otra cabina; −1 = el padre (`razar/lectura/pulso.jsm:5085-5096`). |
| 31 | Leer una palabra oída a `{de, palabra}` (16 bytes); respuesta 1 = se leyó una (`razar/lectura/pulso.jsm:4930-4955`). |
| 32 | Pedir que despierte un cambio en los archivos cuya etiqueta empieza con un prefijo: `j11` = largo del prefijo, `j12` = hasta 8 bytes del prefijo (p. ej. `libro`, largo 5) (`razar/lectura/pulso.jsm:2379-2390,6326-6329`) (semántica: capítulo 04). |
| 34 | Jaula: presupuesto de un hijo (`razar/lectura/pulso.jsm:4865-4868`). |
| 35 | Costo gastado hasta ahora (con −1) (`razar/lectura/pulso.jsm:2468-2472`). |
| 36 | Rehacerse: la misma cabina con un programa nuevo (`razar/lectura/pulso.jsm:2596-2600`). |
| 37 | Abrir un archivo del anfitrión, sólo lectura (`razar/lectura/lectura.inc:761,771`). |
| 38 | Posicionar en un manejador (−1: al final, devuelve el tamaño) (`razar/lectura/lectura.inc:797-816`) (semántica de la respuesta: no verificado). |
| 39 | Vigía del anfitrión: esperar archivo nuevo (`razar/lectura/vigia.jsm:69`). |

### 3.2 Salas y tablas que crecen

`room` (`razar/lectura/lectura.inc:1737-1807`) pide una sala; sin memoria escribe `S_NOMEM` y termina (`jhalt`). Si
`RLIST` ≠ 0 anota cada sala en una lista `{capacidad, salas…}` que se duplica al llenarse, para devolverlas todas al
renacer.

Tabla creciente (`razar/lectura/crece.inc:23-158`): descriptor de 4 qwords en la dirección que la nombra:

| Desplazamiento | Campo |
|---|---|
| +0 | dirección de los lugares |
| +8 | lugares − 1 (máscara) |
| +16 | entradas |
| +24 | bytes por lugar |

- `pl_new`: 2 lugares (máscara 1), sala de `2·bytes`.
- Índice inicial de la clave `k`: `((k >> 32) xor k) & máscara`; sondeo lineal `+1 & máscara`. Un lugar está vacío
  cuando su primer qword es 0; por lo tanto **ninguna clave puede ser 0**: todo productor de claves reemplaza 0 por 1.
- `pl_take` inserta; antes de insertar, si `máscara − 2·(entradas+1) < 0` duplica (`pl_grow`: reubica cada entrada,
  devuelve la sala vieja con el pedido 3).
- El contenido de una sala nueva se supone en ceros (no verificado aquí; capítulo 04).

`buf_need` (`razar/lectura/lectura.inc:1109-1185`): búfer `{dirección, capacidad, necesario, guardado, 13 registros}`
que duplica (desde 256) hasta cubrir lo necesario y copia lo que tenía. Lo usan la palabra en lectura (`WBP`), la
pregunta (`QBP`) y los inicios de libro (`BKP`).

### 3.3 Logaritmo y números

`lg16(x)` (`razar/lectura/lectura.inc:1811-1845`): `log2 x` en punto fijo con 16 bits de fracción ("2^-16 de bit"):
parte entera = posición del bit más alto; mantisa normalizada a `[2^31, 2^32)`; 16 bits de fracción por elevar al
cuadrado. Con `x = 0` devuelve 0 (consecuencia del código). `lc_lg` trata 0 como 1 (`razar/lectura/pulso.inc:1253-1256`).

`hmix` (`razar/lectura/pulso.inc:1590-1613`): final de splitmix64 (`x ^= x>>30; x *= BF58476D1CE4E5B9h; x ^= x>>27;
x *= 94D049BB133111EBh; x ^= x>>31`).

`mix` (`razar/lectura/lectura.inc:2057-2064`): huella de corrida `j0 = (j0·31 + j12) mod 2^48`.

### 3.4 Salida de texto

`TEXT` = `2000h`, `TEXTN` = `1000h` bytes, `POS` = bytes escritos. `putch` vacía (`flush`) al llenarse. `flush`
escribe a `SINK` (0 = consola, pedido 1; si no, `SINK` = manejador + 1, pedido 6). Sólo en el camino de consola, si
`AUTH` ≠ 0 (manejador + 1), copia además el mismo texto a la autopsia con el pedido 6; con `SINK` ≠ 0 no hay copia
(`razar/lectura/lectura.inc:1877-1910`). `putnum` decimal sin signo; `putq16` valor `2^-16` con dos decimales y coma
(`razar/lectura/lectura.inc:1848-1874`).

---

## 4. El archivo de parámetros `p`

`read_book` abre `p` (pedido 4) y lee 16 bytes a `QSCR` = `4100h` (`razar/lectura/lectura.inc:156-179`). Si no abre,
`K` = 10. El manejador de `p` no se cierra en ese camino (observado en el código).

| Desplazamiento | Campo | Variable | Uso |
|---|---|---|---|
| 0 (qword) | `K`: uno de cada `K` renglones es de prueba; 0 → 10 (criterio, `razar/lectura/lectura.inc:160`) | `PK` | §5.6 |
| 8, byte 0 | lecturas (pasadas) del aprendizaje; 0 → 1 | `NPAS` | `razar/lectura/pulso.inc:211-218` |
| 8, byte 1 | generaciones de la evolución de instintos (0: ninguna) | | `razar/lectura/pulso.jsm:1998-2008` |
| 8, byte 2 | identidad `QUIEN` (0: solo) | | `razar/lectura/pulso.jsm:5594-5599` |
| 8, byte 3 | ≠ 0 = mudo: no lee cartas (sólo se consulta si `QUIEN` ≠ 0) | | `razar/lectura/pulso.jsm:5655-5663` |
| 8, byte 4 | `VIGIL`: despierto para siempre; además activa la huella del estante | | `razar/lectura/pulso.jsm:328-335,2353-2360` |
| 8, byte 5 | pruebas de órganos `OGN` | | `razar/lectura/pulso.jsm:2419-2428` |
| 8, byte 6 | auditoría: cuántos órganos auditar | | `razar/lectura/pulso.jsm:2410-2418` |
| 8, byte 7 | paisaje: órganos de hasta este número de letras | | `razar/lectura/pulso.jsm:2404-2409` |

Prioridad dentro de `organ_trials`: paisaje (byte 7) > auditoría (byte 6) > pruebas (byte 5)
(`razar/lectura/pulso.jsm:2403-2426`). `ev_set` sobrescribe el byte 0 con las lecturas del genoma
(`razar/lectura/pulso.jsm:6669-6673`).

---

## 5. Lectura de un libro

### 5.1 Fuentes del libro

`read_book` (`razar/lectura/lectura.inc:130-255`):

1. **Libro del anfitrión** (`HOSTB` = 1, puesto por quien incluye): `LABEL`/`LABLEN` es una dirección del anfitrión;
   se abre con el pedido 37; no hay estante. `come_piece` (`razar/lectura/lectura.inc:582-645`) interpreta el contenido
   del archivo `come`: la dirección y, si sigue una línea, `"<desde> <hasta>"` en decimal → `HOSTF`, `HOSTE` (0 y 0 =
   el libro entero). Se registran los inicios de renglón en `ROFF` (`ROFFN` qwords; el renglón k va de `ROFF[k]` a
   `ROFF[k+1]`) (`razar/lectura/lectura.inc:232-245,1298-1319`).
2. **Estante** (`shelf_build`, `razar/lectura/lectura.inc:387-482`): todas las etiquetas listadas (pedido 14) de 5 o más
   bytes cuyos 5 primeros son `libro`, en el orden del listado, copiadas a `SHELF` (`SHN` entradas `{largo, bytes
   rellenados a 8}`). La sala del listado empieza en 4096 bytes y se duplica mientras lo que sobra sea menor que 520
   (8 + 512). El libro es la concatenación de todos; cada archivo termina su renglón.
3. **Libro del disco** (`scan_file`, `razar/lectura/lectura.inc:705-789`): una etiqueta de estante de 12+ bytes que empieza
   por `libro-disco-` contiene `{huella qword, tamaño qword, dirección del anfitrión}`. Se leen hasta 4096 bytes a `BUF`;
   la dirección es lo que sigue a los 16 bytes (debe tener más de 0 bytes) y se abre con el pedido 37. Si no abre, se
   salta y se sigue con el resto del estante. La huella y el tamaño no se comprueban en este código.
4. Si no hay estante, se lee `libro` (`S_LIBRO`). Si no abre: `S_NOBOOK` y fin (`razar/lectura/lectura.inc:787-789`).

**Pedazos** (sólo con estante y sin `HOSTB`; `razar/lectura/lectura.inc:66-69,290-362,791-930`): el archivo `pedazo`
guarda 8 bytes `PZ_P`, el byte del estante concatenado donde empieza el pedazo de esta lectura (ausente: 0). Durante
la lectura:

- un libro que termina antes de `PZ_P` o justo en `PZ_P` (`NBYTES + tamaño ≤ PZ_P`) sólo se cuenta (su tamaño por
  el pedido 38 con −1, sumado a `NBYTES`) y se cierra sin leerse;
- si no, se vuelve a la posición 0 con el pedido 38 (`j11` = 0), se lee entero y `pz_byte` descarta los bytes cuya
  posición absoluta en el estante (`NBYTES − LEFT`) es menor que `PZ_P` (`razar/lectura/lectura.inc:902-930`);
- si `PZ_N` ≠ 0 al abrir un libro, se cierra sin leerlo;
- cuando la posición pasa `PZ_P + 102400` (`1_9000h`, 100 KB), el pedazo termina en el siguiente byte `0Ah`:
  `PZ_N` = posición + 1, y no se lee ningún libro más en esa pasada.

Tras la primera pasada (`scan` de conteo) `pz_save` borra y reescribe `pedazo` con `PZ_N` (0 si el pedazo llegó al fin
del estante: la próxima vez vuelve al principio) (`razar/lectura/lectura.inc:192,325-362`). Cada pasada lee el mismo
pedazo porque `scan` pone `PZ_N` = 0 al empezar (`razar/lectura/lectura.inc:651`).

### 5.2 Dos pasadas

| Pasada | `PASS` | Efecto |
|---|---|---|
| Conteo | 0 | Cuenta `NUNITS` (desde 1) y `NLINES`; no numera (`razar/lectura/lectura.inc:187-191,1253-1257`). |
| Numeración | 1 | `NV` = 1, `NTOK` = 1; cada unidad va a la fila (`razar/lectura/lectura.inc:247-254`). |
| Pregunta | 2 | Usada por quien lee una pregunta: `?` es un hueco (−1) y una palabra desconocida da −2 (`razar/lectura/lectura.inc:1063-1072,1439-1444`). |

Salas creadas entre pasadas (`razar/lectura/lectura.inc:194-230`):

| Sala | Tamaño | Contenido |
|---|---|---|
| `ROOMT` | `NUNITS·8` | la fila |
| `ROOMI` | 128 bytes, `ICAP` = 16, crece ×2 | dirección en `ROOMV` de cada palabra, por número |
| `ROOMCP` | `NUNITS+8` | byte por unidad: 1 si la palabra empezó con mayúscula |
| `ROOMGL` | `NUNITS+8` | byte por unidad: 1 si vino pegada a la anterior (sin espacio ni fin de línea entre ambas) |
| `ROOMA` | 264, `ACAP` = 256, crece ×2 | letras de las palabras, una tras otra |
| `ROOMV` | 64 (2 lugares de 32), crece ×2 | tabla de palabras |
| `VMASK` | — | `pow2(2·NUNITS) − 1` |

### 5.3 Tokenización

`tok_byte` (`razar/lectura/lectura.inc:933-1103`) procesa un byte `b` con el estado `{WLEN, LEAD, MLEFT, WCAP, WSP}`.
`w_put` agrega `b` a la palabra en curso; `w_end` cierra la palabra en curso si `WLEN` > 0 (`razar/lectura/lectura.inc:1226-1264`).

| Estado / byte | Acción |
|---|---|
| `MLEFT` > 0 y `b & C0h = 80h` | `w_put(b)`; `MLEFT−1`; si llega a 0: `w_end` (la marca multibyte es una unidad) |
| `MLEFT` > 0 y `b` no es continuación | `MLEFT` = 0; `w_end`; `b` se reprocesa desde "`LEAD` = 0" |
| `LEAD` = 1, `80h ≤ b < C0h` | letra U+00C0..U+00FF: si `b < 9Fh` es mayúscula (`WCAP` = 1 si `WLEN` = 0) y se le suma `20h`; `w_put(C3h)`, `w_put(b')` |
| `LEAD` = 1, otro `b` | `w_end`; `b` se procesa como byte plano; el `C3h` previo se pierde |
| `b = C3h` | `LEAD` = 1, sin salida |
| `80h ≤ b < C0h` (continuación suelta) | `w_end`; `b` se descarta |
| `b ≥ C0h`, `b ≠ C3h` | `w_end`; `w_put(b)`; `MLEFT` = 1 si `b < E0h`, 2 si `b < F0h`, si no 3 |
| `A`-`Z` | `+20h`; `WCAP` = 1 si `WLEN` = 0; `w_put` |
| `a`-`z`, `0`-`9` | `w_put` |
| `PASS` = 2 y `b = '?'` | `w_end`; unidad −1 (hueco) |
| `0Ch` | `w_end`; `bk_mark` (nuevo libro en `BKP`); renglón |
| `0Ah` | `w_end`; `WSP` = 1; renglón |
| `b < 21h` (espacio, tabulador, `0Dh`, controles) | `w_end`; `WSP` = 1 |
| otro ASCII | `w_end`; `w_put(b)`; `w_end` (marca de un carácter) |

Consecuencias normativas: `"ya, no"` produce tres unidades (`ya`, `,`, `no`); la conversión a minúscula de
U+00C0..U+00DE suma `20h` al segundo byte también para U+00D7 (`×` → `÷`) (consecuencia del código); un `C3h` no seguido
de continuación válida se descarta.

Al terminar cada archivo: `w_end` y renglón (`razar/lectura/lectura.inc:890-891`).

### 5.4 Numeración de palabras

`word_id` (`razar/lectura/lectura.inc:1379-1514`): `h` = FNV-1a de los bytes de la palabra; lugar inicial
`((h >> 32) xor h) & WMASK`; sondeo lineal en `ROOMV`, lugar de 32 bytes:

| Desplazamiento | Campo |
|---|---|
| +0 | `h` |
| +8 | desplazamiento de sus letras en `ROOMA` |
| +16 | largo (0 = lugar vacío) |
| +24 | número |

Coincide si `h`, largo y bytes son iguales. Nueva: en `PASS` 2 devuelve −2; si no, antes de insertar duplica la tabla
si `WMASK − 2·(VCNT+1) < 0` (`wv_grow`) y crece `ROOMI`/`ROOMA` si hace falta; recibe `NV` y `NV` += 1. Las letras de
una palabra nunca se mueven de desplazamiento (`razar/lectura/lectura.inc:1604-1606`).

### 5.5 La fila

`t_put` (`razar/lectura/lectura.inc:1323-1376`): en `PASS` 1 escribe el número en `ROOMT[NTOK]`, `ROOMCP[NTOK]` =
`WCAP`, `ROOMGL[NTOK]` = `WSP xor 1`, luego `WSP` = 0, `NTOK` += 1. En `PASS` 2 agrega a la pregunta `QBP` (`QN`
unidades). `l_unit` agrega 0 salvo que la última unidad ya fuera renglón (`LASTL`).

`BKP` (`razar/lectura/lectura.inc:79-81,1198-1223`): lista creciente de la posición en la fila donde empieza cada libro
tras un `0Ch`; `BKN` entradas.

### 5.6 Renglones de prueba y examen

`LINE` = índice de renglón (se incrementa al cruzar un 0 que no sea la unidad 0). `is_train`
(`razar/lectura/lectura.inc:1714-1734`), con `t = (LINE mod K) + 1 − K` (0 ⇔ renglón de prueba):

| `EXAMM` | Devuelve ≠ 0 cuando | Significado |
|---|---|---|
| 0 (sin examen) o 1 (aprendiendo para examen) | `t ≠ 0` | aprende de todos los renglones menos los de prueba |
| 2 (golpeando en examen) | `t = 0` | — |

Combinado con `TESTING` en `windows` (`razar/lectura/pulso.inc:478-486`): con `TESTING` = 0 se cuelga en los renglones
donde `is_train` ≠ 0; con `TESTING` = 1 se golpea donde `is_train` = 0. Resultado:

| Situación | Cuelga / golpea en |
|---|---|
| Lectura normal (`EXAMM` 0), aprendiendo | renglones que no son de prueba |
| Lectura normal, golpeando (`TESTING` 1) | renglones de prueba |
| Examen (`EXAMM` 1), aprendiendo | renglones que no son de prueba |
| Examen (`EXAMM` 2, `TESTING` 1), golpeando | **los mismos** renglones de los que aprendió (segunda lectura); los de prueba no se tocan |

El piso 1 (§6.1) no usa `is_train`: aprendiendo cuelga las palabras con `ROOMC` ≠ 0 y golpeando las de `ROOMC` = 0
(`razar/lectura/pulso.inc:352-383`). En el examen (`EXAMM` 2) el piso 1 golpea, por lo tanto, sólo con las palabras que
aparecen únicamente en renglones de prueba, mientras los pisos 2 y 3 golpean en los renglones de aprendizaje
(consecuencia del código).

`sentido` pone `PK` = `4000_0000_0000_0000h` después de `read_book`, antes de `learn_pulses`: aprende de todo el libro
(`razar/lectura/sentido.jsm:461-469`).

### 5.7 Límites de edificio y marcas

`limits` (`razar/lectura/lectura.inc:2108-2185`): primero llama a `mk_learn`; luego, para cada marca en la posición i
(1..`NTOK`−2) busca la primera
palabra no marca que la sigue dentro del renglón; cuenta "seguida de palabra" (`+16`) y "seguida de mayúscula" (`+8`)
en `ROOMCL` (24 bytes por palabra). La marca cierra edificio (`ROOMCL+0` = 1) si `2·mayúscula > seguida`. Luego
`mk_limits`: el cierre de un abridor se propaga a su cerrador. `mk_learn` (`razar/lectura/lectura.inc:2187` en
adelante) aprende abridores, cerradores y separadores por mayoría y una pila de pares; su detalle no se especifica
aquí (no verificado línea por línea).

---

## 6. El pulso: pedidos con hueco

### 6.1 Pisos y moldes

`all_floors` (`razar/lectura/pulso.inc:352-385`) recorre primero las palabras (piso 1) y luego `windows` (pisos 2 y 3
y el órgano).

**Piso 1, gemelos** (`letters`, `razar/lectura/pulso.inc:388-445`): para cada palabra `WID` en 1..`NV`−1 tal que
(aprendiendo) `ROOMC[WID]` ≠ 0, o (golpeando) `ROOMC[WID]` = 0; para cada posición i de sus `L` letras:
clave = `hw(…hw(hw(hw(FNVO,1), L), b0'), …, b(L-1)')` con `bi'` = 0 en la posición del hueco; llenado = `bi`.
`OCCUR` = `((PASN+1) << 40 | WID) + 1`.

**Pisos 2 y 3, ventana** (`windows`, `razar/lectura/pulso.inc:449-602`): `JJ` recorre 0..`NTOK`−4 (`NTOK`−3 ventanas; si
`NTOK` ≤ 3, ninguna: el contador se fuerza a 0 cuando `NTOK`−3 < 0). Se saltan las ventanas cuyo `w0` es renglón. `OCCUR` = `((PASN+1) << 40 | JJ) + 1`.

| Orden | Requiere | Piso | Marco guardado `KW1..KW3` | Clave | Llenado |
|---|---|---|---|---|---|
| 1 | `w1`, `w2` ≠ 0 | 2 | `w0 w1 w2` | `hw(hw(hw(hw(FNVO,2),w0),w1),w2)` | 0 (dicho vacío) |
| 2 | además `w3` ≠ 0 | 2 | `w0 w2 w3` | `hw(…(FNVO,2),w0,w2,w3)` | `w1` (sale el primero del medio) |
| 3 | idem | 2 | `w0 w1 w3` | `hw(…(FNVO,2),w0,w1,w3)` | `w2` (sale el segundo del medio) |
| 4 | idem | — | — | órgano (§10) | — |
| 5 | idem, `w0 ≠ w3` | 3 | — | `hw(hw(hw(FNVO,3),lo),hi)`, `lo = min(w0,w3)`, `hi = max` | `w1 | w2 << 24 | s << 48`, `s` = 1 si `w0 < w3` |

El molde 1 y los moldes 2/3 comparten espacio de claves: `a b c` consecutivos (vacío) y `a x b c` con `x` fuera dan la
misma clave, y el pulso entre ambos es un interruptor. El empaquetado del piso 3 supone números de palabra < `2^24`
(`putpair` enmascara 24 bits, `razar/lectura/pulso.inc:1554-1571`); no hay comprobación (límite derivado del código).

### 6.2 `post`

`post(clave, llenado)` (`razar/lectura/pulso.inc:618-735`):

1. Clave 0 → 1.
2. Si `OCCUR` ≠ 0 y el pedido existe en `ROOMR` y su ocurrencia (+24) = `OCCUR`: no hace nada (un lugar, un
   testimonio). Si existe y difiere, guarda `OCCUR`.
3. Golpeando (`TESTING` = 1): si el pedido no existe, nada; si existe, `po_meet` sin modificarlo.
4. Despierto, con `FORMS` = 1, `PASN` = 0, `FLOOR` = 2 y llenado 0 o una palabra con `n_flags & 1` (interruptor
   destilado): registra la forma en `ROOMS` (§6.6).
5. Despierto: pedido nuevo → `{clave, silueta = código(llenado), peso 1, OCCUR}`, `NREQ` += 1. Pedido viejo →
   `po_meet` y luego actualización de la silueta.

`código(0)` = `1 << 62`; `código(x)` = x (`razar/lectura/pulso.inc:739-747`).

### 6.3 Silueta (mayoría de Boyer-Moore)

Actualización tras `po_meet` (`razar/lectura/pulso.inc:702-728`): si el movimiento es igual a la silueta, peso +=
`GFIRM` (0 → 1); si es otro y peso > 0, peso −= 1; si peso = 0, la silueta pasa a ser el movimiento con peso 1.

`po_meet` (`razar/lectura/pulso.inc:753-773`), con `s` = silueta y `p` = llenado:

| `s` | `p` | Resultado |
|---|---|---|
| vacío | 0 | nada |
| vacío | `p` | `pulse(0, p)` |
| `s` | 0 | `pulse(0, s)` |
| `s` | `p = s` | nada |
| `s` | `p ≠ s` | `pulse(s, p)` |

### 6.4 Pulso y diferencia

`d_make` (`razar/lectura/pulso.inc:995-1039`): en piso 3, `dio vuelta = ((a >> 48) xor (b >> 48)) & 1` y ambos llenados
se enmascaran a 48 bits. Luego `DLO` = menor, `DHI` = mayor (con signo), `DKT` = `piso | vuelta << 8`; clave =
`hw(hw(hw(FNVO, DKT), DLO), DHI)` (0 → 1).

Clase (`d_cat_of`, `razar/lectura/pulso.inc:1471-1489`):

| Piso | `DLO` | Clase `CAT` |
|---|---|---|
| 1 | — | 1 gemelos |
| 3 | — | 4 puertas |
| 2 | 0 | 2 interruptores |
| 2 | ≠ 0 | 3 asociados |

`pulse(a, b)` despierto (`razar/lectura/pulso.inc:779-991`):

1. Testimonio: clave `hw(hmix(hw(hmix(KEY), clave_dif)), PASN)` en `TPT`; si ya estaba, fin.
2. `TRD` (por diferencia): `+8` = lecturas en que apareció `k`, `+16` = última (PASN+1), `+32` = lectura de
   nacimiento. Peso del pulso `PW` = `65536 / k`. Si `k` = 1, `+24` += `PW`.
3. `ROOMD`: si es nueva guarda `{clave, DLO, DHI, DKT}` y `NDIFC[CAT]` += 1; `+32` pares += 1; `+40` += `PW`;
   `NPULC[CAT]` += 1.
4. Si `CAT` = 3: agrega `{KW1, KW2, KW3, DLO, DHI}` (40 bytes) a `ROOMHL` (la casa).
5. `f_bump(DLO)`, `f_bump(DHI)`: llenado en `ROOMF` (pulsos; si era 0, `UFL[piso]` += 1), `TFW` += `PW`, `TRC`
   por lectura. `NFL[piso]` += 1, `NFLW[piso]` += `PW`, `TRC[hw(hw(FNVO, piso | 1<<32), PASN+1)]` += 1.

Golpeando: `TPULC[RC]` += 1; si la diferencia está en `ROOMD` con bits > 0, `TPCEC[RC]` += 1; si `RC` = 3 y `DLO`,
`DHI` están en un mismo concepto, `TCOC` += 1. **Ciego**: con `x` = `PREVX[piso]` (llenado que llegó antes en ese
piso), `PREVX[piso]` = `PB`; si `x` ≠ 0, `TBLN[RC]` += 1, `d_make(PA, x)`; si `RC` = 3 y comparten concepto, `TCOB`
+= 1; si esa diferencia es pieza, `TBLC[RC]` += 1 (`razar/lectura/pulso.inc:852-914`).

### 6.5 Aprendizaje

`learn_pulses` (`razar/lectura/pulso.inc:91-231`): crea o vacía las tablas; cuenta `ROOMC[w]` (veces que la palabra `w`
aparece en renglones de aprendizaje); corre `all_floors` tantas veces como lecturas (`NPAS & 255`, 0 → 1), con `PASN`
= 0, 1, …; luego `judge` y `concepts`.

### 6.6 Tablas del pulso

Direcciones de variables en `razar/lectura/pulso.inc:5-88`.

| Tabla | Lugar | Campos (desplazamiento) |
|---|---|---|
| `ROOMR` pedidos | 32 B | +0 clave, +8 silueta, +16 peso, +24 última ocurrencia |
| `ROOMF` llenados | 16 B | +0 clave `hw(hw(FNVO,piso),llenado)`, +8 pulsos |
| `ROOMD` diferencias | 48 B | +0 clave, +8 `DLO`, +16 `DHI`, +24 `DKT`, +32 pares, +40 pares ponderados → bits ahorrados (2^-16) tras el juez |
| `TRD` | 56 B | +0 clave, +8 `k`, +16 última lectura, +24 `n1` (2^-16), +32 lectura de nacimiento, +40 evidencia juzgada, +48 bits por par (2^-16) |
| `TRC` | 16 B | +0 clave (llenado o piso, y lectura), +8 pulsos |
| `TFW` | 16 B | +0 clave, +8 pulsos ponderados |
| `TPT` | 8 B | +0 clave del testimonio |
| `ROOMS` formas vistas | 56 B | +0 `hw(clave,llenado)`, +8 clave, +16 llenado, +24 veces, +32 primer lugar `JJ`, +40 piso, +48 bits de su pregunta |
| `ROOMHL` casa | 40 B (lista) | +0 `KW1`, +8 `KW2`, +16 `KW3`, +24 `DLO`, +32 `DHI` |
| `TMEM` memoria | 48 B | +0 clave, +8 evidencia, +16 bits por par, +24 `DLO`, +32 `DHI`, +40 piso (`DKT`) |

Por clase (8 bytes por índice, índice 0..4): `NPULC`, `NDIFC`, `TPULC`, `TPCEC`, `NADC`, `TBLN`, `TBLC`, `SAVC`. Por
piso (0..3): `NFL`, `UFL`, `NFLW`, `PREVX`.

---

## 7. El juez de armonía

`judge` (`razar/lectura/pulso.inc:1085-1234`) asigna a cada diferencia de `ROOMD`, en 2^-16 de bit:

```
r     = lectura de nacimiento (TRD+32)
n     = max( floor(TRD.n1 / 2^16), TMEM.evidencia, TFORP.evidencia )      (las dos últimas si existen)
N     = TRC[ hw(hw(FNVO, piso | 1<<32), r) ]                              pulsos del piso en la lectura r
c(x)  = TRC[ hw(clave_llenado(x), r) ]                                    pulsos del llenado x en la lectura r
g     = lg(2N) + lg(n) − lg(c(DLO)) − lg(c(DHI))                           bits por par   (lg = lc_lg: 0 → 1)
bits  = g · n  −  ( lg16(U_piso) · P ) sar 1                               U_piso = UFL[piso], P = GPAC (0 → 4)
```

El costo del nombre usa `lg16` directo (`lg16(0)` = 0), no `lc_lg` (`razar/lectura/pulso.inc:1199-1212`). El recorrido
es por lugar de la tabla `ROOMD` (máscara + 1 lugares, se saltan los vacíos), no por orden de inserción.

Se guardan `TRD+48` = `g`, `TRD+40` = `n`, `ROOMD+40` = `bits`. Si `bits` > 0 la diferencia es **pieza**:
`NADC[CAT]` += 1, `SAVC[CAT]` += `bits`. Con `P` = 4 el nombre cuesta `2·log2 U` (código de dos partes). Las
evidencias de la memoria y de otro Razar se combinan por máximo, nunca sumadas (`razar/lectura/pulso.inc:1122-1153`).

**Conceptos** (`concepts`, `razar/lectura/pulso.inc:1282-1371`): por palabra `{raíz, mejores bits, mejor socio}` (24 B,
`ROOMUF`). Cada pieza de clase 3 propone a cada una de sus dos palabras al otro como socio si sus bits superan el
mejor actual (estricto). Luego cada palabra se une a su mejor socio (union-find, raíz = la menor; `uf_find` con
compresión a medias). `CONOK` = 1. `cp_same` es verdadero si `DLO ≠ DHI`, ambos ≠ 0 y misma raíz.

---

## 8. Memoria de piezas

Archivo `memoria` (o `memoriaN`, N = `'0'+QUIEN`) (`razar/lectura/pulso.jsm:5100-5463`):

| Desplazamiento | Contenido |
|---|---|
| 0 | cantidad `m` (qword) |
| 8 + 48·i | entrada i: +0 clave, +8 evidencia, +16 bits por par (2^-16), +24 `DLO`, +32 `DHI`, +40 `DKT` |

`mem_load` lo lee en `TMEM`. `mem_save` lo reescribe entero (borrar + abrir + escribir): (a) cada pieza actual
(bits > 0) con su `TRD+40`, `TRD+48`; (b) cada entrada de `TMEM` que esta lectura no encontró en `ROOMD`, con evidencia
`e/2` (criterio), sólo si `e/2 · g − lg(UFL[piso])·P/2 > 0`. Una entrada que esta lectura encontró y no pagó se
descarta. Escribe `memoria <m> <de vidas anteriores> <ayudadas>` y exporta siluetas (`sil_export`; formato no
especificado aquí, no verificado).

---

## 9. El examen y los instintos

### 9.1 `ev_exam`

`ev_exam` (`razar/lectura/pulso.jsm:6676-6752`):

1. `EVCH` = `EVC`; `ev_set`: `GPAC` = byte 0, `GFIRM` = byte 1, lecturas = byte 2 (en `NPAS` byte 0).
2. `EXAMM` = 1; `learn_pulses`.
3. `EXAMM` = 2, `TESTING` = 1; `all_floors`; `TESTING` = 0.
4. Nota, en **bits enteros**:

```
gain(H, B) = floor( H · (lg16(2H+1) − lg16(2B+1)) / 2^16 )        (sar 16)
EVS = gain(TCOC, TCOB) + Σ_{k=1..4} gain(TPCEC[k], TBLC[k])
      − Σ_{k=1..4} floor( 2·lg16(UFL[f(k)]) · NADC[k] / 2^16 )      f(1)=1, f(2)=f(3)=2, f(4)=3
```

El costo de las piezas usa siempre `2·log2 U`, no la paciencia (`razar/lectura/pulso.jsm:6710-6711`).

5. Suerte: `RNG` = `hw(RNG, EVS)` (0 → 1).

`og_base` (`razar/lectura/pulso.jsm:3012-3022`) corre el mismo examen con `TMEM` = 0 (sin memoria).

### 9.2 Suerte

`ev_rand` (`razar/lectura/pulso.jsm:6638-6653`): xorshift64 `x ^= x<<13; x ^= x>>7; x ^= x<<17` sobre `RNG`; devuelve
`x >> 1` (no negativo). Semilla de `evolve`: `9E3779B97F4A7C15h`, luego `hw(RNG, QUIEN)` (0 → 1)
(`razar/lectura/pulso.jsm:2011-2024`).

### 9.3 Genoma y evolución

Genoma (`razar/lectura/pulso.jsm:2025-2039,6588-6674`):

| Byte | Instinto | Rango de mutación | Valor de partida |
|---|---|---|---|
| 0 | paciencia `GPAC` | 1..8 | 4 |
| 1 | firmeza `GFIRM` | 1..4 | 1 |
| 2 | lecturas | 1..3 | `NPAS & 255` (0 → 1) |

`ev_mutate`: instinto = `rand mod 3`; dirección = bit 8 de `rand` (`+1`/`−1`); se recorta a `[1, tope]`.

`evolve` (`razar/lectura/pulso.jsm:1998-2350`), si el byte 1 de `NPAS` > 0: campeón `EVC` y segundo `EVR` con sus notas
`EVCS`, `EVRS`; por generación, hijo = cada instinto tomado de campeón o segundo según `rand & 1`, más una mutación;
`ev_exam`; si supera al campeón (estricto) pasa a campeón, el campeón a segundo, se escribe la línea y se llama a
`mem_save` (la memoria se reescribe con las piezas de ese examen); si sólo supera al segundo, pasa a segundo
(`razar/lectura/pulso.jsm:2174-2220`). Al final: `nest_save`, `letter_write`, `organ_trials`. Formato de línea: `ev_line`
(`razar/lectura/pulso.jsm:6782-6851`): `instinto <gen>: <pac> <firm> <lect> = <nota con signo>[ *]`.

---

## 10. El lector de órganos (`organo.inc`)

### 10.1 Datos del órgano en los datos iniciales

El órgano no se compila: sus letras y tablas son datos de la sala 0, cargados desde `X.datos`
(`razar/lectura/organo.inc:1-11,27-43,100-126`; `razar/lectura/pulso.jsm:169-171`).

| Desplazamiento | Nombre | Tamaño | Contenido |
|---|---|---|---|
| `18h` | `ORGD` | 8 | letras del candidato más allá de la 16.ª (0: ninguna); `candidate` lo copia a `ORGX` |
| `20h` | `ORGK` | 8 | ≠ 0: este programa es un candidato |
| `28h` | `ORGG` | 8 | genoma cuyo examen rinde el candidato |
| `30h` | `ORGW` | 8 | letras del órgano (16 × 4 bits, la primera en los bits 0-3; 0 = sin órgano) |
| `38h` | `ORGF` | 8 | basura de la auditoría: 0 o 1 |
| `4380h + 80h·g` | `ORGGT0`/`ORGGT1` | 128 | engranaje `g` (1..105); `ORGGT` = `4400h` es el engranaje 1 |
| `7EF0h + 10h·k` | `ORGT0`/`ORGT1` | 16 | palabra (forma) `k` (1..8); `ORGT` = `7F00h` es la 1 |

Variables de trabajo del lector de órganos (en la misma sala):

| Dirección | Nombre | Contenido |
|---|---|---|
| `3800h` | `ORGL` | letras que quedan por leer |
| `37F0h` | `ORGX` | letras más allá de la 16.ª |
| `37F8h`, `37E8h`, `37E0h` | `ORGQ1`, `ORGQ2`, `ORGQ3` | cola de lo que se lee después (máximo tres) |
| `37D8h` | `ORGIN` | dentro de una palabra: cuántas entradas de la cola pertenecen a ella |
| `7D80h` | `ORGV` | 16 registros de la máquina chica |
| `7E00h` | `ORGP` | lentes del ojo (un byte por lente, la última dicha en el byte bajo) |
| `7E08h` | `ORGPL` | lentes que faltan mirar |
| `7E10h` | `ORGN` | engranaje de la célula en curso |
| `7E18h` | `ORGB` | bolita actual + 1 (0: no consultada) |
| `7E20h` | `ORGH` | 1 = el corazón no está en reposo |
| `7E28h`, `7E30h` | `ORGS1`, `ORGS2` | ojo guardado durante un pedido |
| `7E38h` | `ORGA` | dirección de una célula de lugar |
| `7E40h` | `ORGBT` | bolita con que se lanzó (máximo) |
| `7900h` | `ORGCA` | suma de lo dicho desde el último hueco |
| `7908h` | `ORGCT` | 16 qwords: lo dicho por cada tejido |
| `7988h` | `ORGCH` | 16 qwords: lo ya oído por cada tejido |
| `7A08h` | `ORGCS` | 16 qwords: palabra portadora de cada tejido |
| `7A88h` | `ORGCD` | 1 = algo se dijo |
| `7A90h`, `7A98h`, `7AA0h` | `ORGCO`, `ORGCN`, `ORGCI` | tejido antes, después, número de tejido × 8 |
| `7AA8h` | `ORGCE` | veces que una célula oyó a otra en toda la lectura (no se olvida) |

### 10.2 Máquina de estado

`organ` se llama una vez por ventana, después del molde 3 (`razar/lectura/pulso.inc:558`) y sólo si `w0..w3` ≠ 0
(`razar/lectura/organo.inc:148-156`). Estado:

| Registro | Significado | Inicial |
|---|---|---|
| `j2` | hash del marco | `hw(FNVO, 102h)` |
| `j10` | posición del ojo (palabras respecto de la ventana) | 0 |
| `j11` | ojo borroso (≠ 0) o nítido (0) | 0 |
| `j3..j14` (resto) | basura | todos 0, o todos −1 si `ORGF` = 1 |
| `KW1..KW3` | marco guardado | 0 |
| `FLOOR` | piso | 2 |

Arranque: `ORGW` = 0 → retorna sin tocar nada. Si no: `ORGQ1` = `ORGX`, `ORGQ2` = `ORGQ3` = `ORGIN` = `ORGP` = 0, `ORGL`
= `ORGW`. Bucle: mientras `ORGL` ≠ 0, tomar `letra = ORGL & 15`, `ORGL >>= 4`, ejecutar la letra, y en `og_lap`: si
`ORGL` = 0, desapilar hasta tres veces (`ORGL` ← `ORGQ1` ← `ORGQ2` ← `ORGQ3` ← 0; cada desapilado decrementa `ORGIN`
si > 0) hasta encontrar letras. Fin: `og_rest` (`razar/lectura/organo.inc:173-276,660-663`).

### 10.3 El alfabeto

Una letra es un nibble 1..15. En los textos (nombres de carpeta, líneas `organo`, líneas `letra`) la letra `n` se
escribe como el byte `30h + n` (`razar/lectura/pulso.jsm:3489-3503,3350-3353,5037-5055`).

| Nibble | Texto | Nombre en código | Semántica exacta |
|---|---|---|---|
| 1 | `1` | `og_l1` | `j3` = mirada de la palabra 0; `j2` = `hw(j2, j3)` |
| 2 | `2` | `og_l2` | ídem palabra 1 |
| 3 | `3` | `og_l3` | ídem palabra 2 |
| 4 | `4` | `og_l4` | ídem palabra 3 |
| 5 | `5` | `og_l5` | hueco = palabra 0: `j11` = 0, `ORGP` = 0, `og_rest`, `j3` = mirada (posición del ojo conservada), `post(j2, j3)`, `j2` = `hw(FNVO,102h)`, `j10` = 0 |
| 6 | `6` | `og_l6` | ídem palabra 1 |
| 7 | `7` | `og_l7` | ídem palabra 2 |
| 8 | `8` | `og_l8` | ídem palabra 3 |
| 9 | `9` | `og_l9` | hueco vacío: `og_rest`, `post(j2, 0)`, `j2` = `hw(FNVO,102h)`, `j10` = 0, `j11` = 0. **No** limpia `ORGP` |
| 10 | `:` | `og_lA` | sentido: mirada de la palabra −1 (la anterior a la ventana); `hw` |
| 11 | `;` | `og_lB` | ojo una palabra atrás: `j10` −= 1 |
| 12 | `<` | `og_lC` | ojo una palabra adelante: `j10` += 1 |
| 13 | `=` | `og_lD` | `j11` ^= 1 (borroso ↔ nítido) |
| 14 | `>` | `og_lE` | palabra o célula (§10.5, §10.6) |
| 15 | `?` | `og_lF` | sentido: mirada **borrosa** de la palabra 3 con el ojo donde esté; `j11` se restituye; `hw` |

Referencias: `razar/lectura/organo.inc:277-401,638-659`. Cualquier cadena de letras es un órgano válido: ninguna letra
puede fallar. Un nibble 0 interior (no lo produce `og_mutate`) no coincide con ninguna comparación del despacho y cae
en `og_lap` como cualquier letra ya ejecutada: es una letra nula que se consume sin efecto
(`razar/lectura/organo.inc:182-228`, según el flujo de control). Ninguna de las letras 10 a 15 llama a `post`: 10 y 15
mezclan en el marco, 11 a 13 sólo mueven o cambian el ojo y 14 abre una palabra o una célula.

**Invariante de tramo.** `>` y sus argumentos (la `k` de una palabra; `g2`, `t` y, en el tejido 8, `d1..d4` de una
célula) se toman sólo de `ORGL`, el tramo de 16 nibbles que se está leyendo. Si `ORGL` queda en 0 antes de completar
la construcción, ésta se descarta y no se toman nibbles de `ORGQ1`..`ORGQ3` (`razar/lectura/organo.inc:374-375,403-404,
416,512-513`). Una construcción no puede cruzar el límite entre la letra 16.ª y la 17.ª.

### 10.4 La mirada (`og_look`)

`og_look(j5)` (`razar/lectura/organo.inc:665-715`): índice `i = (WAT − ROOMT)/8 + j10 + j5`.

- Si `i < 0` o `i ≥ NTOK`: `j3` = 0.
- Si no: `j3` = `ROOMT[i]`; si `j11` ≠ 0, `j3` = `ROOMC[j3]` (veces leída donde aprende).
- Luego, para cada lente de `ORGP` desde el byte bajo (la última dicha primero) hasta que no quedan bytes ≠ 0:
  `j3` = `engranaje(byte, j3)`. Las lentes se aplican también a una mirada 0.

### 10.5 Palabras: `>` `k` = forma `k`

`og_lE` (`razar/lectura/organo.inc:372-401`): si no quedan letras, nada. Si no, consume la letra siguiente `k`.

- `k ≥ 9`: es una célula (§10.6).
- `k ≤ 8` y `ORGIN` ≠ 0 (dentro de una palabra): nada; `k` queda consumida (una palabra no puede llamarse a sí misma).
- `k ≤ 8` y `ORGT0[k]` = 0 (palabra vacía): nada.
- Si no: `ORGQ3` ← `ORGQ1` (letras de la oración más allá de la 16.ª), `ORGQ2` ← `ORGL` (resto de la oración),
  `ORGQ1` ← `ORGT1[k]` (resto de la palabra), `ORGL` ← `ORGT0[k]`, `ORGIN` = 2. Las letras de la palabra se leen
  como si estuvieran escritas en ese lugar; ojo y marco siguen como están.

`k` = 0 lee `ORGT0` en `7EF0h` (fuera de las ocho palabras); su contenido no está definido por este código (no
verificado).

Dentro de una palabra (`ORGIN` ≠ 0) las células (`k ≥ 9`) sí se ejecutan: sólo la expansión de otra palabra está
prohibida. Al expandir, el valor previo de `ORGQ2` y `ORGQ3` se sobrescribe; en el nivel de oración son 0, y como
`ORGIN` vuelve a 0 sólo tras desapilar el resto de la palabra y el resto de la oración, una segunda palabra en la misma
oración se expande igual que la primera.

### 10.6 Células y tejidos

Una célula son cuatro letras: `>` `g1` `g2` `t` con `g1` ∈ 9..15 (`razar/lectura/organo.inc:402-451`):

- `g1` consumido por `og_lE`; si no quedan letras, nada.
- `g2` = letra siguiente (cualquier nibble); engranaje `G = (g1 − 9)·15 + g2` (rango 0..105; 1..105 apuntan a
  `ORGGT`; 0 lee `4380h`, contenido no definido aquí, no verificado). `ORGN` = `G`.
- Si no quedan letras, no hay célula. Si no, `t` = letra siguiente; `ORGCI` = `8t`.

| `t` | Tejido | Acción |
|---|---|---|
| 1 | miradas (lente) | `ORGP = (ORGP << 8) | G` (ocho lentes como máximo; la más vieja sale por arriba). No dice ni oye |
| 2 | marco | `j2` = `og_cell(j2)` |
| 3 | posición del ojo | `j10` = `og_cell(j10)` |
| 4 | nitidez del ojo | `j11` = `og_cell(j11)` (≠ 0 = borroso) |
| 7 | corazón | §10.9 |
| 8 | un lugar de la memoria | cuatro letras más `d1..d4`: `a = ((((d1−1)·15 + d2−1)·15 + d3−1)·15 + d4−1)`; si se cortan, no hay célula; `ORGA` = `8a`; `mem[8a]` = `og_cell(mem[8a])`. Alcanza 50625 palabras; un lugar fuera de la memoria termina al lector (el núcleo corta) |
| 0, 5, 6, 9..15 | portador | `ORGCS[t]` = `og_cell(ORGCS[t])` |

### 10.7 Engranajes: formato de 128 bytes

Bloque del engranaje `g` en `4380h + 80h·g` (`razar/lectura/organo.inc:717-848`; productor:
`razar/cuerpo/engranajes.py:279-287`):

| Desplazamiento | Contenido |
|---|---|
| +0 | cantidad de instrucciones (se usa `& 15`) |
| +8 + 8i | instrucción i (i < 15), una palabra del idioma Janax |

Decodificación de la instrucción `w` (`razar/lectura/organo.inc:742-759`):

| Bits | Campo |
|---|---|
| 0-7 | `op` |
| 8-11 | `rd` |
| 12-15 | `ra` |
| 16-63 | `imm` (`rb` = `imm & 15`) |

`og_gear(G, x)`: `V[0..15]` = `x`; para cada instrucción:

| `op` | Efecto |
|---|---|
| 1 | `V[rd]` = `imm` como entero de 16 bits con signo (bits 16-31 extendidos) |
| 15 (`0Fh`) | `V[rd]` = `(V[rd] << 16) | imm` |
| 2 / 3 / 4 | `V[rd]` = `V[ra]` + / − / × `V[rb]` |
| 6 / 7 / 8 | `V[rd]` = `V[ra]` shl / shr / sar `V[rb]` |
| 9 / 10 / 11 | `V[rd]` = `V[ra]` and / or / xor `V[rb]` |
| otro (incl. 5, memoria) | se salta |

Resultado: el valor que dejó la última instrucción ejecutada, o `x` si no se ejecutó ninguna. No hay memoria, saltos
ni efectos fuera de `ORGV`; un engranaje no puede romper nada. `engranajes.py` produce piezas de 2 a 8 instrucciones
(`LMIN`, `LMAX`, `razar/cuerpo/engranajes.py:51`) y, al escribir la tabla, deja fuera las que usan más de 16 registros
(`razar/cuerpo/engranajes.py:255-256`). Codificación que escribe (`razar/cuerpo/engranajes.py:284`): op 1 y `0Fh`:
`w = op | rd << 8 | (imm & FFFFh) << 16`; el resto: `w = op | rd << 8 | ra << 12 | rb << 16`. Para op `0Fh` el lector
hace `or` con `w >> 16` completo (48 bits), que con este productor son 16.

### 10.8 Comunicación entre células

`og_cell(v)` (`razar/lectura/organo.inc:536-585`), tejido `t`, engranaje `G`:

1. `ORGCO` = `v`; `ORGCN` = `G(v)`.
2. `h` = `ORGCA − ORGCT[t] − ORGCH[t]` (lo dicho por otros y no oído). Si `h ≠ 0`: `ORGCH[t]` += `h`, `ORGCE` += 1,
   `ORGCN` += `G(h)` (eco).
3. `d` = `ORGCN − ORGCO`. Si `d ≠ 0`: `ORGCT[t]` += `d`, `ORGCA` += `d`, `ORGCD` = 1.
4. Devuelve `ORGCN`.

`og_rest` (`razar/lectura/organo.inc:586-619`), en cada hueco y al final: si `ORGCD`, pone en 0 los 49 qwords desde
`ORGCA` (`ORGCA`, `ORGCT`, `ORGCH`, `ORGCS`) y `ORGCD` = 0; si `ORGH`, `ORGH` = 0 y pide 20 con −1 (`ORGB` = respuesta
+ 1). Conserva el ojo. Invariante: una célula sola no oye a nadie, y un 0 nunca se dice.

### 10.9 Corazón (tejido 7)

`og_t7` (`razar/lectura/organo.inc:452-506`): guarda el ojo; si `ORGB` = 0 pide 20 con −1 → `ORGBT` = respuesta,
`ORGB` = respuesta + 1. `v` = `og_cell(ORGB − 1)`; si `v < 0` o `v > ORGBT`, `v` = `ORGBT`; si el recorte cambió el
valor dicho, corrige `ORGCT[7]` y `ORGCA` por `v − ORGCN`. Si `v ≠ ORGB − 1`: pide 20 con `v` → `ORGB` = respuesta + 1,
`ORGH` = 1. Restituye el ojo.

### 10.10 Invariantes y observaciones

- El hash del marco se reinicia en cada hueco: un marco está hecho sólo de sus letras.
- Los pedidos del órgano usan la misma `OCCUR` de la ventana y el piso 2; su prefijo `102h` los separa de los moldes
  fijos (salvo colisión de hash). Si producen asociados, la casa los guarda con `KW1..KW3` = 0.
- Discrepancia comentario/código: el comentario (`razar/lectura/organo.inc:50-52`) dice que un hueco apaga las lentes;
  el código sólo pone `ORGP` = 0 en los huecos 5-8, no en el 9 (`razar/lectura/organo.inc:300-301,349-358`). Rige el
  código.

---

## 11. Recetas y formas

### 11.1 Representación binaria

Un órgano es un qword: letra j en los bits `4j..4j+3`, j = 0 la primera. El lector deja de leer cuando el resto es 0;
`og_mutate` cuenta como largo la cantidad de nibbles hasta el más alto no nulo (`razar/lectura/pulso.jsm:4529-4538`).
Máximo 16 letras por qword. Una receta de hasta 31 letras usa dos qwords: las 16 primeras en `ORGW` y el resto en
`ORGX`/`ORGD` (`razar/lectura/organo.inc:30-31`). El tope de 31 es del productor (`razar/cuerpo/gen_leer.py`,
capítulo 08); el lector admite hasta 32 nibbles (16 + 16).

### 11.2 Archivo de recetas

Ruta (`og_type_label`, `razar/lectura/pulso.jsm:3543-3569`):

```
tablero/Receta de Organos/<hex16 huella del estante>/<letras>/<hex16 genoma>/recetas
```

`<letras>`: cada letra como byte `30h + n`, la primera primero. `hex16`: 16 dígitos hexadecimales en minúscula, el
más significativo primero (`razar/lectura/pulso.jsm:4204-4230`). Largo máximo: 26 + 16 + 1 + 16 + 1 + 16 + 8 = 84 bytes
(cálculo a partir de las piezas; el búfer en `OGPEND+4512` tiene 96).

Contenido: hasta 10 recetas ordenadas por nota descendente (`og_rec_write`, `razar/lectura/pulso.jsm:3876-3989`). Cada
una (`og_rec_text`, `og_rec_head`, `razar/lectura/pulso.jsm:3300-3415`):

```
receta <hex16 código> alfabeto <hex16 huella del alfabeto> nota <decimal con signo> genoma <hex16 EVC>\n
  mejora: <nota vencida> -> <nota> (+<diferencia>), antes: <letras del vencido>\n
  letra <c>: <descripción del bloque @c del molde>\n
<líneas de código de og_l<c> de organo.inc>
  … (una por letra, en orden de ejecución)
\n
```

Posiciones fijas de la cabeza (las usa `og_hdr`, `razar/lectura/pulso.jsm:3753-3835`):

| Bytes | Campo |
|---|---|
| 0-6 | `receta ` |
| 7-22 | código (hex16; la primera letra es el **último** dígito) |
| 23-32 | ` alfabeto ` |
| 33-48 | huella del alfabeto |
| 49-54 | ` nota ` |
| 55… | nota: `-` opcional y dígitos |
| luego | ` genoma ` + hex16 |

Una línea es cabeza si desde su inicio quedan al menos 56 bytes hasta el fin del archivo leído y sus 7 primeros bytes
son `receta ` (`razar/lectura/pulso.jsm:3755-3785`); `og_hdr` lee código, alfabeto y nota (la nota termina en el
primer byte que no es dígito); el genoma de la cabeza no se lee. Una receta es su cabeza y todo lo que sigue hasta la
próxima cabeza. Inserción (`razar/lectura/pulso.jsm:3879-3989`): la nueva va antes de la primera cuya nota es
estrictamente menor; si antes de ese punto hay una con el mismo alfabeto y la misma nota (cualquier código), no se
escribe. Se copian a lo sumo 10 en total, contando la nueva; el archivo se reescribe entero (`og_wopen`).

Huella del alfabeto `OGALF` = FNV-1a de los bytes de `organo.inc` omitiendo `0Dh` (`razar/lectura/pulso.jsm:3239-3298`).
Código de cada letra (`og_rec_block`, `razar/lectura/pulso.jsm:4117-4201`): las líneas que siguen a la que empieza con
`og_l` + `(30h+n)` + `:` y empiezan con espacio, sin `0Dh`. Para las letras 10..15 la etiqueta buscada (`og_l:`…`og_l?`)
no existe en `organo.inc` (las etiquetas son `og_lA`..`og_lF`): no se copia código; el molde tampoco tiene esos bloques.

### 11.3 El molde

`organo.molde` (`razar/lectura/organo.molde:1-35`; lector `og_block`, `razar/lectura/pulso.jsm:4624-4705`): bloques que
empiezan en una línea cuyo primer byte es `@`; el nombre del bloque es el único byte que sigue a `@` (el resto de esa
línea se ignora). El contenido va desde la línea siguiente hasta antes de `\n@` o del final, sin el último `\n` ni un
`\r` final. Un nombre inexistente da largo 0.

| Bloque | Contenido |
|---|---|
| `p` | `PDP/razar/lectura/pulso.bin` |
| `d` | `PDP/razar/lectura/pulso.datos` |
| `k` | `PDP/razar/lectura/hijo.bin` |
| `e` | `PDP/razar/lectura/hijo.datos` |
| `o` | `PDP/razar/lectura/organo.inc` |
| `r` | `tablero/Receta de Organos/` |
| `1`..`9` | descripción de cada letra |

`og_label` inserta el dígito `'0'+QUIEN` después de los 9 bytes `PDP/razar` si `QUIEN` ≠ 0 (`razar/lectura/pulso.jsm:2605-2637`).
Sin molde: escribe `sin molde` y no prueba órganos (`razar/lectura/pulso.jsm:2430-2440`).

### 11.4 Forma canónica

`og_canon` (`razar/lectura/pulso.jsm:3024-3119`), usada sólo por la auditoría: marco = máscara de mezclas (letras 1-4 →
bits 0-3) cerrada por un hueco (letra ≥ 5); se conservan los marcos distintos en orden de aparición (máximo 16), se
descartan las mezclas tras el último hueco, y cada marco se reescribe como sus mezclas en orden 1..4 y su hueco.
Nota: este procedimiento trata cualquier letra ≥ 5 (incluidas 10..15) como hueco.

### 11.5 Huella y estante

`OGBK` = `shelf_print` (huella del estante: nombres y bytes; algoritmo en `razar/lectura/pulso.jsm:6928` en adelante, no
especificado aquí, no verificado). Separa las recetas de libros distintos.

### 11.6 Forma

Una forma es una receta guardada como palabra del lector: entrada `k` de `ORGT` (`7EF0h + 16k`), 16 bytes:

| Desplazamiento | Contenido |
|---|---|
| +0 | primeras 16 letras (como `ORGW`) |
| +8 | letras más allá de la 16.ª (como `ORGX`) |

Las ocho formas vivas de Luma son las palabras 1..8; quien lanza el lector las escribe en sus datos iniciales
(`razar/cuerpo/gen_leer.py:194-200,251`; capítulo 08). Dentro del lector, `>` `k` despliega la forma `k`.

---

## 12. Ciclo de órganos

### 12.1 Preparación (`og_init`)

`og_init` (`razar/lectura/pulso.jsm:3121-3237`): sala `OGPEND` de 4608 bytes con esta disposición:

| Desplazamiento | Contenido |
|---|---|
| 0-4095 | pendientes de firma `{número, hijo, tipo}` (24 B) |
| 4096-4111 | palabra oída `{de, palabra}` |
| 4112 | etiqueta del molde `PDP/razar/lectura/organo.molde` (30 B; 31 con número) |
| 4160 | etiqueta de un bloque del molde |
| 4224 | marcos de `og_canon` (16 × 8) |
| 4352 | archivo de nichos (152 B) |
| 4512 | etiqueta en construcción |

Lee el molde (hasta 64 KB, criterio), copia `pulso.bin` → `hijo.bin` (una vez por llamada a `og_init`, es decir, por
`organ_trials`), calcula `OGALF`, prepara las salas de recetas (4096, crecen), `OGQN` = `OGQI` = 0 y `OGBK` =
`shelf_print` (`razar/lectura/pulso.jsm:3178-3237`).

### 12.2 El hijo sin recompilar

`og_copy(origen, destino)` (`razar/lectura/pulso.jsm:4752-4842`): abre el origen (pedido 4; negativo → devuelve 0), borra
el destino (12) y lo abre (4), y copia en trozos de 4096 bytes por `OGBUF`; con `OGPAT` = 1 escribe en el primer trozo
`ORGK` = `OGP0`, `ORGG` = `OGP1`, `ORGW` = `OGP2`, `ORGF` = `OGP3` (desplazamientos `20h`, `28h`, `30h`, `38h` del
archivo). Devuelve 1 si todas las escrituras devolvieron la cantidad pedida y ninguna lectura falló. Los argumentos
son nombres de bloque del molde: `p` = 112, `d` = 100, `k` = 107, `e` = 101.

| Uso | Archivo | `ORGK` | `ORGG` | `ORGW` | `ORGF` |
|---|---|---|---|---|---|
| `og_kid` candidato | `pulso.datos` → `hijo.datos` | 1 | `EVC` | `OGTRY` | `OGFILL` |
| `og_self` propio | `pulso.datos` → `hijo.datos` → `pulso.datos` | 0 | 0 | `OGCODE` | 0 |

`ORGD` no se modifica en la copia.

### 12.3 Protocolo del candidato

| Paso | Quién | Acción |
|---|---|---|
| 1 | Razar | `og_kid` escribe `hijo.datos`. |
| 2 | Razar | Pedido 16 con la etiqueta del bloque `k` (`hijo.bin`), `j10` = `(14<<32)|16` → `OGKID`. Falla: nota = `−2^63`. |
| 3 | Razar | Pedido 34 (`OGKID`, `OGBUD`): jaula. |
| 4 | Candidato | Arranca (`renace`), lee el libro (`read_book`; si el byte 4 de `p` ≠ 0 calcula `BOOKH` = `shelf_print`, si no `BOOKH` queda como en sus datos); `ORGK` ≠ 0 → `candidate` (`razar/lectura/pulso.jsm:324-339,5076-5097`): `ORGX` = `ORGD`; `distill_no`; `FORMS` = 1; `EVC` = `ORGG`; `ev_exam` (sin memoria: no llama `mem_load`). |
| 5 | Candidato | Pedido 30 a −1 tres veces, en este orden: `ORGCE`, `BOOKH`, `EVS`; `jhalt`. Quien escucha toma la última. |
| 6 | Razar | `og_serve` (`razar/lectura/pulso.jsm:4877-4971`), bucle: (a) pedido 29; respuesta −1 → fin. (b) Si quien tocó no es `OGKID` y `OGWAKE` = 0, pide 19 sobre esa cabina; si responde −2, `OGWAKE` = cabina + 1 (el timbre se conserva para después). (c) Pedido 18 a `OGPEND` (4096 bytes) → cantidad de pendientes (negativa = ninguno); firma cada uno con el pedido 17 (`j11` = número, `j12` = 1). (d) Pedido 31 repetido mientras responda 1; cada palabra cuyo campo `de` es `OGKID` reemplaza `OGSC`. (e) Pedido 19 sobre `OGKID`: −1 (sigue corriendo) → vuelve a (a); cualquier otra respuesta → fin. |

Presupuesto `OGBUD` = 2 × respuesta del pedido 35 con −1 (el 2 es criterio) (`razar/lectura/pulso.jsm:2468-2472`).

### 12.4 Nichos

Nicho de un órgano (`og_niche`, `razar/lectura/pulso.jsm:4298-4325`): recorriendo desde la primera letra, la primera
letra en 5..9 da el nicho `letra − 4` (1..5); 1-4 y 10-15 se saltan; sin hueco: 0. Seis nichos (criterio). El
recorrido es nibble a nibble y no distingue argumentos: un nibble 5..9 que es la `k`, `g2`, `t` o `d` de un `>`
también cuenta como hueco (consecuencia del código).

Archivo `organos` (`organosN` con número) (`razar/lectura/pulso.jsm:4416-4520`), 152 bytes:

| Desplazamiento | Contenido |
|---|---|
| 0 | sello de llamada (se incrementa en cada carga) |
| 8 + 24n | nicho n (0..5): +0 órgano, +8 nota, +16 sello (0 = vacío) |

`og_niche_meet` (`razar/lectura/pulso.jsm:4347-4414`): si el campeón del nicho tiene otro sello, rinde de nuevo
(`oa_exam`) y se actualiza; el hijo toma el nicho si está vacío o si su nota es estrictamente mayor (`OGNT` = 1,
`OGNA`/`OGNB` = órgano y nota desplazados).

### 12.5 Mutación (`og_mutate`)

`og_mutate` (`razar/lectura/pulso.jsm:4522-4620`), entrada `OGCODE` con `n` letras, salida `OGTRY`:

1. `op` = `rand mod 3` (0 meter, 1 sacar, 2 cambiar). Si `n` = 0 → meter; si `n` = 16 y `op` = meter → sacar.
2. Lugar `p` = `rand mod (n+1)` para meter; `rand mod n` para sacar o cambiar.
3. Letra `L` = `1 + rand mod 15` (se sortea siempre, aunque se saque).
4. Bajo `p` se conserva; meter: `(resto << 4 | L)` en `p`; sacar: `resto >> 4`; cambiar: `L` reemplaza la letra `p`.
5. Si `OGTRY` = `OGCODE`, se repite todo.

`og_next` (`razar/lectura/pulso.jsm:4247-4275`) elige el órgano a probar: primero la cola de clases del modelo
(`OGQ`), luego el órgano de la carta del otro (`PORG`, si difiere), luego `og_child`: nicho `rand mod 6`; si tiene
campeón, se muta ese; si no, el propio (`razar/lectura/pulso.jsm:4277-4296`).

### 12.6 Pruebas (`organ_trials`)

`organ_trials` (`razar/lectura/pulso.jsm:2395-2603`):

1. Cola de clases (`og_rec_queue`, `razar/lectura/pulso.jsm:3991-4115`): de cada archivo `…/recetas` bajo
   `tablero/Receta de Organos/` (cualquier modelo y genoma), el órgano de la primera cabeza si ≠ 0 y ≠ `ORGW`, sin
   repetir. Una vez por estante en esta vida (`OGQD` = `BOOKH`+1).
2. `OGCODE` = `ORGW`; `OGBASE` = examen sin memoria del propio; jaula; carga nichos; nicho propio = `{OGCODE, OGBASE,
   sello}`.
3. Repetir `OGN` veces (los de la cola no descuentan): `og_next`, `og_kid` (si falla, se salta el resto de la
   vuelta), `og_trial`, `og_line`, `og_niche_meet`.
   - Si tomó nicho y no supera al campeón (`OGSC ≤ OGBASE`): si supera al examen sin órgano `OGZ` (calculado una vez
     por estante), escribe su receta con lo que desplazó del nicho.
   - Si `OGSC > OGBASE`: `OGB0` = `OGBASE`, `OGBA` = `OGCODE`, `OGBASE` = `OGSC`, `OGCODE` = `OGTRY`; escribe receta.
4. Guarda nichos. Si `OGCODE` ≠ `ORGW`: `og_self`; si funcionó, escribe `se rehace` y pide 36 con el bloque `p`;
   `jhalt` (`razar/lectura/pulso.jsm:2586-2600`).

Línea de cada prueba (`og_line`, `razar/lectura/pulso.jsm:4973-5009`):
`organo <letras|-> = <nota> (sin <OGBASE>)[ *]`.

### 12.7 Paisaje y auditoría

- **Paisaje** (`organ_enum`, `razar/lectura/pulso.jsm:2639-2730`): todos los órganos de 1..N letras con letras 1..9
  (9 + 81 + 729 = 819 para N = 3), cada uno rinde como candidato y se escribe con `og_line` contra el examen sin órgano.
- **Auditoría** (`organ_audit`, `razar/lectura/pulso.jsm:2732-2983`): `AUDN` órganos de 1..4 letras 1..9 al azar,
  examinados en orden con `ORGF` = 0, en orden inverso con `ORGF` = 1, y en forma canónica si difiere; examen sin
  órgano antes y después. Salida: `fuga <letras>: <orden> <inverso> <canónico>` por cada órgano cuyas notas difieren y
  `auditoria <n>: orden y basura <iguales>, escritura <iguales> (<canónicos probados>), base <antes> <después>`.

---

## 13. Archivos leídos y escritos por `pulso`

| Archivo | Formato | Fuente |
|---|---|---|
| `p` | §4 | `razar/lectura/lectura.inc:156-179` |
| `libro`, `libro*`, `libro-disco-*` | §5.1 | `razar/lectura/lectura.inc:387-789` |
| `pedazo` | 8 bytes: `PZ_P` | `razar/lectura/lectura.inc:290-380` |
| `memoria[N]` | §8 | `razar/lectura/pulso.jsm:5100-5463` |
| `nido[N]` | 56 bytes: +0 marca `RAZARNID` (`4449_4E52_415A_4152h`), +8 campeón, +16 segundo, +24 nota campeón, +32 nota segundo, +40 suerte, +48 generaciones vividas | `razar/lectura/pulso.jsm:5465-5565,6579-6586` |
| `cartaN` (N = `QUIEN`) y la del otro `carta(3−N)` | 16 bytes: +0 genoma, +8 órgano `ORGW` | `razar/lectura/pulso.jsm:5612-5626,6540-6576` |
| `autopsia[N]` | texto: copia de la consola | `razar/lectura/pulso.jsm:5567-5585`, `razar/lectura/lectura.inc:1896-1907` |
| `organos[N]` | §12.4 | `razar/lectura/pulso.jsm:4416-4520` |
| `…/recetas` | §11.2 | `razar/lectura/pulso.jsm:3876-3989` |
| `PDP/razar[N]/lectura/hijo.bin`, `hijo.datos`, `pulso.datos` | §12.2 | `razar/lectura/pulso.jsm:4707-4842` |
| `PDP/razar/lectura/organo.molde`, `organo.inc` | §11.2-11.3 | `razar/lectura/pulso.jsm:3121-3298` |
| tablero `tablero/razar-<llave>` y siluetas | no especificado aquí (no verificado) | `razar/lectura/pulso.jsm:233-236,6239-6493` |

---

## 14. Ortografía

Fuente: `razar/lectura/sentido.jsm:5110-5826`; variables `razar/lectura/sentido.jsm:313-325`; etiqueta `S_ORT` =
`tablero/ortografia` (`razar/lectura/sentido.jsm:76`, `razar/lectura/sentido.datos.jsm:15`).

### 14.1 Pares

Para una palabra de bytes `b0..b(L−1)` (sus letras guardadas, ya en minúscula; los bytes UTF-8 cuentan por separado),
el par i tiene clave `((bi << 8) | b(i+1)) + 1`, i = 0..L−2 (`ort_pairs`, `razar/lectura/sentido.jsm:5118-5174`). Al
contar (`ORF` ≠ 0) un par se cuenta una sola vez por palabra (`op_seen`); al juzgar (`ORF` = 0) se juzgan todos.

| `ORF` | Rutina por par | Tabla |
|---|---|---|
| 0 | `ok_pair` (juzga) | `ORT` |
| 1 | `oe_pair` (+1 palabra) | `ORE` |
| 2 | `ot_pair` (+1 palabra) | `ORT` |

Tablas `ORT`, `ORE`: tablas crecientes de 16 B `{clave, palabras}`.

### 14.2 `ort_eat` (al comer)

Si `EATB` ≠ 0 (`EATB` = FNV-1a de los bytes del libro o pedazo comido, `razar/lectura/sentido.jsm:9711-9719`): cuenta
en `ORE` los pares distintos de cada palabra 1..`NV`−1 que no sea marca (`w_mark`). Escribe (borrar 12, abrir 4,
escribir 6, cerrar 7) el archivo:

```
etiqueta = "tablero/ortografia" + hex16( (EATB xor 11) · FNVP mod 2^64 )        (34 bytes)
contenido = qword 1, qword n, n × { qword clave, qword palabras }
```

`hex16` en `ew_label` escribe minúsculas, el dígito más significativo primero (`razar/lectura/sentido.jsm:9942-9975`); la
etiqueta ocupa los 64 bytes de la sala `ELAB` pero se usan 34. La sal 11 está en `razar/lectura/sentido.jsm:5783-5787`.
Las entradas se escriben en el orden de los lugares de la tabla `ORE` (orden de hash, no de aparición). `EATB` lo deja
`eat_write` antes de `ort_eat` (`razar/lectura/sentido.jsm:9709-9719`, `razar/lectura/sentido.jsm:490-504`); si
`host_print` no pudo abrir el libro, `EATB` = 0 y no se escribe nada.

### 14.3 `ort_load`

Lista las etiquetas (pedido 14, sala que se duplica desde 4096 mientras lo libre sea < 4104,
`razar/lectura/sentido.jsm:5310-5356`); para cada una de exactamente 34 bytes cuyos 18 primeros son
`tablero/ortografia`: la lee; exige ≥ 16 bytes y qword 0 = 1; `n` = `min(qword 1, bytes/16 − 1)`; suma `palabras` por
clave en `ORT` (claves 0 se saltan); `ORS` = 1 si sumó algo (`razar/lectura/sentido.jsm:5203-5308`). Sin archivos,
`ORS` = 0.

### 14.4 Regla

`ort_keeps(w)` (`razar/lectura/sentido.jsm:5358-5409`): verdadero si cada par de `w` contiene un byte `0`..`9` o tiene
`ORT.palabras ≥ 2`. Un par está **probado** cuando la suma, sobre la biblioteca y el libro leído, de palabras que lo
tienen es ≥ 2.

### 14.5 `ort_fix`

`ort_fix` (`razar/lectura/sentido.jsm:5422-5581`), llamado tras `read_book` y `ort_load`
(`razar/lectura/sentido.jsm:453-455`):

1. Si `ORS` = 0: nada.
2. `ORF` = 2: los pares distintos de cada palabra no marca de esta lectura se suman a `ORT`.
3. `ORC[w]` = apariciones de `w` en `ROOMT[0..NTOK)`.
4. Para cada palabra no marca `w` (1..`NV`−1) con `ORC[w] < 2` y `¬ort_keeps(w)`: buscar `v` en 1..`NV`−1 con
   `ORC[v] ≥ 2`, `ORC[v]` estrictamente mayor que el mejor hasta ahora (empate: el número menor), `ort_near(w, v)` y
   `ort_keeps(v)`.
5. Si hay `v`: reemplazar cada `w` por `v` en `ROOMT` y en la pregunta (`QBP`, `QN` unidades); `ORFX` += 1.

`ort_near(w, v)` (`razar/lectura/sentido.jsm:5595-5715`), con `w` de largo `Lw` y `v` de largo `Lv`:

- **Aplastado**: recorrer ambos; si `w[i] = v[j]` avanzar ambos; si no y `j > 0` y `w[i] = v[j−1]`, avanzar sólo `i`
  (letra repetida); verdadero si ambos se consumen exactamente.
- **Una letra**: `p` = prefijo común; probar (a) sustitución `(p+1, p+1)`, (b) letra de más en `w` `(p+1, p)`, (c) letra
  de menos en `w` `(p, p+1)`; verdadero si las colas restantes tienen igual largo ≥ 0 y son iguales byte a byte.

Ejemplos de la regla (consecuencias del algoritmo): `yyyy` (dicha una vez, con el par `yy` no probado) → `y` por
aplastado si `y` aparece ≥ 2 veces y cumple la regla; `madre` y `padre` no se tocan si ambas cumplen la regla.

Observaciones de orden (`razar/lectura/sentido.jsm:5449-5578`): `ORC` se cuenta una sola vez, antes de las
sustituciones, y no se actualiza tras reemplazar; el candidato `v` no se filtra con `w_mark`; los reemplazos se hacen
durante el recorrido de `w`, así que una palabra posterior ve la fila ya corregida.

---

## 15. Otros programas del directorio

Esta sección da la interfaz. El algoritmo interno completo de estos programas no se especifica en este capítulo; lo
que se describe sin cita a código es del comentario de cabecera y se marca.

### 15.1 `lector`

`razar/lectura/lector.jsm:1-22,80-148,498-740`. Lee con `lectura.inc`; en renglones de aprendizaje cuenta `ROOMC` y los
pares consecutivos en `ROOMB` (tabla creciente de 16 B, clave `p·NV + x + 1`). En cada renglón de prueba tapa cada
palabra y la adivina de tres maneras: **eco** (la más leída; empate: la de menor número, `razar/lectura/lector.jsm:150-170`), **izquierda** (la que más
siguió a la anterior; empate: menor número), **dos lados** (maximiza `C(p,x)·C(x,n)/C(x)` por comparación cruzada de
fracciones; empate: menor número) (`razar/lectura/lector.jsm:498-582`). Juez: costo sin modelo `log2((leídas +
conocidas)/(C(x)+1))` por palabra tapada; cada manera paga sus resultados `k·log2(n/k)` más `log2(n)/2` por tasa
(`razar/lectura/lector.jsm:617-740`).

### 15.2 `comer`

`razar/lectura/comer.jsm:1-35`. Lee el libro del anfitrión cuya dirección está en `come` (pedido 37) y escribe en la
biblioteca un índice `tablero/pistas<hex16>` y piezas `tablero/pieza<hex16>-<decimal>`. Codificación de bits
(verificada, `razar/lectura/comer.jsm:1410-1634`): bits del menos significativo al más; unario = `k` unos y un cero;
gamma(v ≥ 1) = `N` = posición del bit alto en unario y luego los `N` bits bajos de `v`; Rice(k) = `v >> k` en unario y
luego los `k` bits bajos; una corrida = `k` en 4 bits (el de menos bits entre 0..15, empate: el menor) y cada paso en
Rice; `zb_align` redondea a byte. El orden de los campos de cada palabra de una pieza y del índice está en el
comentario de cabecera (`razar/lectura/comer.jsm:15-35`) (no verificado campo por campo). Sales de nombres de la
biblioteca según el comentario de `lib_sweep` (`razar/lectura/comer.jsm:1737-1742`): vueltas 2 y 1, lecciones 3,
composiciones 5, índice 7 (6 antes de la versión 7), diccionario de instrucciones 9, ortografía 11. Sólo las sales 2
(esqueletos) y 11 (ortografía) se verificaron en el código (`razar/lectura/sentido.jsm:9719-9721,5783-5787`); las
demás, no verificado.

### 15.3 `vigia`

`razar/lectura/vigia.jsm:1-7,46-110`. Pide salas (ruta del anfitrión de `1_8000h` = 98304 bytes, búfer de 65536);
pide 39 con `j11` = ruta y `j12` = 98304 → largo de la ruta de un archivo nuevo, −1 = ninguno (escribe `S_NOVIG` y
termina); sin novedad duerme en 29. Comprueba que sea texto (`is_text`; detalle no verificado), y por pedazos
(`vg_cut`) reescribe `come` (borrar 12, abrir 4) con la dirección y el tramo, y lanza `comer` firmando sus pedidos
(detalle del lanzamiento no verificado). Pedazo `PIECE` = `40h` × 64 KB = 4 MB, cortado en fin de renglón; el valor es
criterio (`razar/lectura/vigia.jsm:38-40`).

### 15.4 `pregunta`

`razar/lectura/pregunta.jsm:1-15` (cabecera; algoritmo no verificado): cuelga pedidos "dos palabras con una a tres
entre ellas" y responde preguntas del archivo `q`, una por línea, con `?` como hueco (en `PASS` 2, §5.2).

### 15.5 `sentido`

`razar/lectura/sentido.jsm:1-20` (cabecera) y flujo principal `razar/lectura/sentido.jsm:450-505`: `eat_mode`,
`read_book`, `ort_load`, `ort_fix`, idiomas (`ln_scan`), y con el libro entero `learn_pulses`, `house_decide`,
`distill_no`, `limits`, `sil_load`, `genders`, `gather`. Comiendo escribe en la biblioteca esqueletos, preguntas,
enganches, diccionario de instrucciones, estructuras y ortografía. Sólo la ortografía (§14) se especifica aquí; el
resto, no verificado en este capítulo.

### 15.6 Módulos

- `negacion.inc` (`razar/lectura/negacion.inc:1-17`): `distill_no` deja en `n_flags(w) & 1` el interruptor, calculado
  por cinco propiedades contra el libro (cabecera; no verificado línea por línea). `n_flags` lee el qword `+56` de la
  entrada de 64 bytes de la palabra en `ROOMW` (`razar/lectura/negacion.inc:704-712`).
- `idioma.inc` (`razar/lectura/idioma.inc:1-6`): idiomas por contexto con Chinese Whispers (cabecera; no verificado).
- `casa.inc` (`razar/lectura/casa.inc:1-7`): cimiento y muebles desde `ROOMHL`; deja `ROOMGB`, `ROOMSD` (cabecera; no
  verificado).
- `pistas.inc` (`razar/lectura/pistas.inc:1-19`): rondas de pregunta siguiendo pistas; cada ronda es una vida (36);
  archivos `camino` y `libro` (cabecera; no verificado).

---

## 16. Constantes y límites

| Constante | Valor | Naturaleza | Fuente |
|---|---|---|---|
| `K` por omisión | 10 | criterio | `razar/lectura/lectura.inc:160` |
| Tamaño de pedazo | 102400 bytes + hasta fin de línea | criterio (sin medición en el código) | `razar/lectura/lectura.inc:916-925` |
| Ventana | 3 y 4 palabras | criterio | `razar/lectura/pulso.inc:447-449` |
| Prefijo del molde del órgano | `102h` | identificador | `razar/lectura/organo.inc:163` |
| Letras por qword | 16; forma: 31 | estructura | `razar/lectura/organo.inc:30` |
| Engranajes | 105 × 128 B, 15 instrucciones | estructura | `razar/lectura/organo.inc:100-102` |
| Lentes | 8 | estructura (bytes de un qword) | `razar/lectura/organo.inc:638-646` |
| Lugar de célula 8 | 4 letras base 15: 50625 | estructura | `razar/lectura/organo.inc:71-77` |
| Nichos | 6 | criterio | `razar/lectura/pulso.jsm:4299-4300` |
| Presupuesto del candidato | 2 × costo de la vida | criterio | `razar/lectura/pulso.jsm:2468-2469` |
| Recetas por archivo | 10 | criterio | `razar/lectura/pulso.jsm:3876-3878` |
| Molde y alfabeto máximos | 64 KB cada uno | criterio | `razar/lectura/pulso.jsm:3178-3182,3243` |
| Evidencia de memoria sin confirmar | `/2` por vida | criterio | `razar/lectura/pulso.jsm:5189` |
| Paciencia por omisión | 4 (nombre `2·log2 U`) | código de dos partes | `razar/lectura/pulso.inc:1204-1210` |
| Par ortográfico probado | ≥ 2 palabras | regla (umbral fijo) | `razar/lectura/sentido.jsm:5383-5388` |
| Listado de la biblioteca | sala desde 4096, se duplica mientras queden < 4104 libres | criterio | `razar/lectura/sentido.jsm:5311-5353` |
| Archivo `organos` | 152 bytes = 19 qwords | estructura | `razar/lectura/pulso.jsm:4423,4447` |
| Sala `OGPEND` | 4608 bytes | estructura | `razar/lectura/pulso.jsm:3126-3130` |
| Palabra "dicha una vez" | `ORC < 2` | regla | `razar/lectura/sentido.jsm:5488-5495` |
| Números de palabra en una puerta | < `2^24` | límite derivado | `razar/lectura/pulso.inc:582-590,1554-1571` |

---

## 17. Puntos no verificados

1. Semántica exacta de los pedidos 16 (bits altos `14`), 19, 20 con −1, 34, 35 y 38 con −1: se describen por su uso;
   el contrato está en el capítulo 04.
2. Que las salas nuevas lleguen en ceros (supuesto de `pl_new` y de la fila).
3. Contenido de `ORGT0[0]` (`7EF0h`) y del engranaje 0 (`4380h`).
4. `shelf_print`, `sil_export`/`sil_import`, el tablero y las cartas en el tablero.
5. Algoritmo de `mk_learn`/`mk_stack`.
6. Orden de campos de las piezas y del índice de `comer` (sólo la codificación de bits está verificada).
7. Algoritmos internos de `pregunta`, `sentido` (salvo ortografía), `negacion.inc`, `idioma.inc`, `casa.inc`,
   `pistas.inc`.
8. Significado de la respuesta −2 del pedido 19 (usada en `og_serve` para conservar un timbre ajeno).
9. Si el candidato comparte el espacio de archivos de su padre. `read_book` llama a `pz_save` en todo programa con
   estante y sin `HOSTB`, también en el candidato (`razar/lectura/lectura.inc:185,192`); si el archivo `pedazo` es el
   mismo, cada candidato avanzaría el pedazo que leerá el siguiente. No verificado (capítulos 03 y 04).
