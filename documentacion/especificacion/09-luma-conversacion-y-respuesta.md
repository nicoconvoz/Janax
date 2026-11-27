# 09. Luma: el protocolo de conversación y la construcción de una respuesta

Este capítulo especifica el camino completo que recorre un turno de diálogo dentro de Luma: desde que el usuario
pulsa Enter en la línea de entrada hasta que la respuesta queda escrita en el archivo `dialogo` y en el archivo
`respuesta`. Cubre el protocolo entre el cuerpo y el proceso pensador, la corrección ortográfica, la decisión de
responder, el motor de selección de líneas (`r_dlg_answer`), el camino de pasos (`wy_go`), el paso `sigue` y su
orden de fuentes, las costumbres y su regla de cobertura (`r_canto`), la regla de los lugares (`r_describe`), las
pistas y la selección de oraciones, el canto y la regla de dos, la imaginación, los mecanismos para no repetir, la
lluvia como dados, las firmas de idioma (`lj_*`) y las estructuras de memoria que todo ello usa. No cubre: el
idioma y su codificación (capítulo 01), el ensamblador y la construcción (capítulo 02), los procesos del núcleo
(capítulo 03), la semántica de cada pedido al núcleo (capítulo 04), la pantalla, el teclado y el vigía (capítulo
05), la lectura de Razar y sus órganos (capítulo 06), el cardumen y el programa de canto `memoria_pares.jsm`
(capítulo 07), el cuerpo de Luma, su casa y el árbol de temas (capítulo 08), el panel, la música y la vida de Luma
(capítulo 10) ni el instalador y la publicación (capítulo 11). Donde este capítulo nombra un pedido al núcleo por
su número, su semántica es la del capítulo 04.

---

## 1. Convenciones

### 1.1 Fuentes y citas

- `gen_leer.py:N` abrevia `razar/cuerpo/gen_leer.py:N`. Toda otra ruta se da completa, relativa a la raíz del
  proyecto.
- `gen_leer.py` es un generador en Python: cada llamada `o("etiqueta:")` emite una etiqueta y cada `J("...")` emite
  instrucciones del idioma Janax. El comportamiento especificado es el del código emitido, no el de los comentarios
  `; ...` que lo acompañan.
- Las constantes con nombre en mayúsculas (`D_OUT`, `PL_T`, `TM_W`, ...) son enteros de Python resueltos en tiempo de
  generación. Los valores numéricos de este capítulo se obtuvieron evaluando la cabecera del generador
  (`gen_leer.py:206-611`) sin ejecutar `make()`.

### 1.2 Registros y accesos

| Elemento | Significado | Fuente |
|---|---|---|
| `j0`..`j15` | Registros generales de 64 bits. `j0` lleva el resultado de las rutinas. `j14` vale 0 siempre: `st("j14", X)` pone `X` a 0 y `jadd rd, rs, j14` copia. | capítulo 01; `gen_leer.py:2576` |
| `ld(r, "NOMBRE")` / `st(r, "NOMBRE")` | Lectura/escritura de una variable global con nombre (por ejemplo `EXR`, `CNB`). Su dirección la asigna el generador (no verificado en este capítulo). | `gen_leer.py:615` |
| `gl(r, OFF)` / `gs(r, OFF)` | Lectura/escritura del qword en `B + OFF`, donde `B = ST["free"]` es el bloque propio (64 KB según el comentario de `gen_leer.py:233`; tamaño no verificado). | `gen_leer.py:616`, `gen_leer.py:621-622` |
| `dl(r, OFF)` / `ds(r, OFF)` / `da(r, OFF)` | Lectura, escritura y dirección de `DLR + OFF` (la sala de la palabra, §2.1). | `gen_leer.py:2004-2070` (uso) |
| `gb(r, OFF)` / `gbs(r, OFF)` | Lectura/escritura de `[D_GBLK] + OFF` (la sala de gustos, §2.2). | `gen_leer.py:3928-3929` |
| `r_tocar(j10=pedido, j11=a, j12=b)` | Un pedido al núcleo; respuesta en `j13`, `b` devuelto en `j12`. | `razar/cuerpo/gen_formas.py:1327-1329` |
| `r_file(j10)` | 5 leer, 6 escribir, 7 cerrar, 38 posicionar, sobre el manejador `FH`. `38` con `j11 = -1` deja en `j13` el tamaño del archivo (posición final). | `razar/cuerpo/gen_vida.py:1898`, capítulo 04 |
| `r_open(j11=etiqueta, j12=bytes)` | Abre por etiqueta (pedido 4); el manejador queda en `FH`, negativo si falla. | `razar/cuerpo/gen_formas.py:1096-1097` |
| `r_alloc(j1=bytes)` | Pide una sala nueva (pedido 2); dirección en `j0`. Una sala se devuelve con el pedido 3. | `razar/cuerpo/gen_comer.py:238` |

### 1.3 Letras, palabras y huellas

**Letra** (`bw_letter`, `gen_leer.py:706-729`). Dado un byte en `[j1]`:

- Si es menor que 128: se fuerza a minúscula (`| 32`) y es letra sólo si queda en `a`..`z`. Dígitos, signos y
  espacios no son letras.
- Si es mayor o igual que 128: es letra un carácter UTF-8 completo cuyo primer byte está en 194..244, con 1, 2 o 3
  bytes de continuación (`10xxxxxx`). El valor devuelto es el punto de código.
- Si no es letra: `j3 = -1` y `j1` no avanza.

**Letra base** (`bw_base`, `gen_leer.py:730-738`): un punto de código de 128 o más se reemplaza por su letra base si
figura en la tabla aprendida `D_BAS` (entradas de 16 bytes: punto de código, base; `D_BASN` entradas). Sólo se
aplica para calcular huellas.

**Palabra** (`bw_word`, `gen_leer.py:739-756`): a partir de `BP` (global `B+0x7F00`) y hasta `BE` (`B+0x7F08`),
salta lo que no es letra hasta una letra o hasta un byte 10 (fin de línea). Devuelve:

- `j0` = cantidad de letras (≥ 1), `j4` = huella, `BWS` (`B+0x1D78`) = dirección donde empezó, `BP` = pasado el
  final;
- o `j0 = 0` al llegar a un byte 10 o a `BE`, con `BP` sobre él.

**Huella de palabra**: FNV-1a de 64 bits sobre los puntos de código base, uno por letra:
`h = 0xCBF29CE484222325; para cada letra c: h = (h XOR c) * 0x100000001B3 mod 2^64`; si `h = 0` se usa 1
(`gen_leer.py:682`, `gen_leer.py:748-753`). Mayúsculas y minúsculas ASCII dan la misma huella.

**Palabra que cuenta**: en casi todo el capítulo sólo cuentan las palabras de 4 letras o más (`j0 ≥ 4`), por ejemplo
`gen_leer.py:2074`, `gen_leer.py:2667`, `gen_leer.py:4650`.

### 1.4 Deseo y azar

- **Deseo** (`dse_wish`, `gen_leer.py:3504-3505`): dados `S` (veces pagado) y `N` (veces intentado),
  `deseo = ((2S + 1) << 19) / (N + 1)`, es decir `(S + 1/2)/(N + 1)` en unidades de 2^-20.
- **Azar** (`r_randmod`, `razar/cuerpo/gen_formas.py:1320-1326`): `j0 = (x >> 1) mod n`, con `x` el siguiente valor
  de un xorshift64 (`x ^= x<<13; x ^= x>>7; x ^= x<<17`, estado en la global `RNG`).
- Una decisión "por deseo contra el azar" toma la rama cuando `r_randmod(2^20) < deseo`
  (por ejemplo `gen_leer.py:3438`).
- **Reservorio**: varias rutinas eligen entre candidatos con pesos `w_i` así: acumulan `W += w_i` y se quedan con el
  candidato `i` si `r_randmod(W) < w_i` (por ejemplo `gen_leer.py:3802-3803`, `gen_leer.py:4734`).

### 1.5 La lista de libros

`ul_list` (`gen_leer.py:7084-7094`) pide la lista de la casa (pedido 14) en una sala que se duplica hasta que la
cuenta se repite. Deja en `ULB` la sala y en `ULN` la cantidad. Cada entrada es: un qword con la longitud `n` de la
etiqueta, la etiqueta, y relleno hasta múltiplo de 8; la siguiente entrada está en `+8 + ((n + 7) & ~7)`
(`gen_leer.py:2926`).

| Clase de etiqueta | Regla | Fuente |
|---|---|---|
| Libro | Empieza por `libro`, o por `elibro` (libro en espera de turno). | `gen_leer.py:2589-2600`, `gen_leer.py:5333-5347` |
| Charla | Exactamente `dialogo` (7 bytes). Cuando se lee, `D_LIVE = 1`. | `gen_leer.py:2592-2595`, `gen_leer.py:5146-5152` |
| El Libro | Exactamente `libro` (5 bytes) o `elibro` (6 bytes). | `gen_leer.py:2631-2637` |
| Libro de disco | Contiene `-disco` en algún punto de la etiqueta: se descarta siempre. | `gen_leer.py:3704-3719` |
| Libros del corazón (`HEART`) | Tupla fija de cuatro etiquetas, comparadas byte a byte y en ese orden: `libro-firma`, `libro-preguntas` y dos etiquetas más de libros del autor (literales en la fuente; su contenido no se especifica). | `gen_leer.py:583` |

La huella de una etiqueta de libro (para gustos y firmas) es `h = 0; h = 31h + byte` sobre la etiqueta sin la `e`
inicial de espera (`gen_leer.py:4575-4585`, `gen_leer.py:4940-4945`).

---

## 2. Estructuras en memoria

### 2.1 La sala de la palabra (`DLR`, 32768 bytes)

`DLR` es una global (`B+0x1D68`) que apunta a una sala de `D_ROOM = 0x8000` bytes, puesta a cero al cargarse
(`gen_leer.py:2011-2015`). Todos los desplazamientos son menores que 32768 porque el inmediato de carga lo exige
(`gen_leer.py:526`, `gen_leer.py:555`). Campos usados en este capítulo:

| Desplazamiento | Nombre | Tamaño | Contenido |
|---|---|---|---|
| 0x0000 | `D_IN` | 1000 | Lo que se tipea; luego, lo leído tras la ortografía. |
| 0x0400 | `D_OUT` | 1000 | Lo que ella dice (respuesta en construcción). |
| 0x0800 | `D_WORDS` | 120 × 8 | Huellas de las palabras dichas a ella (§6.1). |
| 0x0C00 | (`D_WORDS + 1024`) | 120 × 8 | Marca de cada palabra: el `D_ID` de la última línea que la contó. |
| 0x1000 | `D_SCR` | 2048 | Línea en preparación para `dialogo`. |
| 0x1800 | `D_LBL` | 160 | Etiquetas: `dialogo` (+0), `charla` (+16), `letras` (+32), `abecedario` (+48), `rodeos` (+64), `preguntas-mias` (+80), `libro-preguntas` (+96), `preguntas-viejas` (+112), `arbol` (+128), `charla-libros` (+144) (`gen_leer.py:2015-2016`). |
| 0x1900 | `D_INL` | 8 | Bytes de `D_IN`. |
| 0x1908 | `D_OUTL` | 8 | Bytes de `D_OUT`. |
| 0x1910 | `D_AWAIT` | 8 | 0 nada espera; 1 su respuesta espera; 2 habló primero; 3 calló. |
| 0x1918..0x1930 | `D_NC`, `D_SC`, `D_NH`, `D_SH` | 4 × 8 | Contadores del deseo de responder y de hablar primero. |
| 0x1938 | `D_NW` | 8 | Cantidad de palabras en `D_WORDS`. |
| 0x1960 | `D_LC` | 8 | Índice del libro que se lee en la lista. |
| 0x1970 / 0x1978 | `D_FB` / `D_FE` | 8 + 8 | Sala de lectura del libro y su tamaño. |
| 0x1988 | `D_CNT` | 8 | Peso de la línea en curso (§8.4). |
| 0x19A0 | `D_ID` | 8 | Contador de líneas (sólo crece). |
| 0x19A8 | `D_X` | 32 | Rasguños. |
| 0x19C8 | `D_MODE` | 8 | 0 primera manera (buscar la línea A en `D_OUT`); 1 segunda manera (línea B en `D_B`). |
| 0x19D0 | `D_BL2` | 8 | Bytes de `D_B`. |
| 0x1A78 | `D_LS` | 8 | Dirección de inicio de la línea en curso. |
| 0x1AB0..0x1AC8 | `D_MC`, `D_MC_S1`, `D_MC_N2`, `D_MC_S2` | 4 × 8 | Cuentas de citar (1) y decir a su modo (2). |
| 0x1AD0 | `D_LMODE` | 8 | Modo de su última respuesta: 1 cita, 2 propia. |
| 0x1AE8 | `D_SRCL` | 8 | Bytes de `D_SRC`. |
| 0x2000 | `D_B` | 1000 | Su segunda línea. |
| 0x2400 | `D_AM` | 120 × 8 | Marcas paralelas a `D_WORDS` ("lo que la línea A ya dice"); también rasguño de `r_dlg_cover`. |
| 0x2C00 | `D_C` | 1000 | Rasguño de composición. |
| 0x3000 | `D_BEST` | 1000 | Mejor cruce. |
| 0x3400 | `D_SRC` | 60 | Etiqueta del libro de donde viene la línea, después de su primer guion. |
| 0x3480 | `D_THK` | 1000 | Un pensamiento en espera (`D_THKL` bytes, `D_PEND` = 1). |
| 0x4100 / 0x44E8 | `D_AA` / `D_AL` | 1000 + 8 | Su línea A tal como la encontró. |
| 0x44F0 | `D_QL` | 8 | Bytes de su última palabra al hablar primero. |
| 0x44F8 / 0x4500 | `D_RPL` / `D_RPV` | 8 + 8 | Bytes de `D_RP`; marca de que él dio dónde seguir. |
| 0x4508 | `D_LBR` | 8 | Rama de lo último que dijo (4 = responder). |
| 0x4510..0x4538 | `D_BN0..D_BS2` | 6 × 8 | Cuentas de sus tres ramas de hablar primero. |
| 0x4570 | `D_LI` | 8 | Puntero a la entrada actual de la lista de libros. |
| 0x45C8 | `D_LCX` | 8 | Contexto en que dijo lo último. |
| 0x45E0 | `D_ENT` | 8 | 1 si lo que dijo esperaba respuesta y él volvió a escribir. |
| 0x45E8 / 0x45F0 | `D_KACT` / `D_KCLA` | 8 + 8 | Activación y claridad de él (0/1, §4). |
| 0x45F8 | `D_CTX` | 8 | Contexto (32 valores). |
| 0x4608 | `D_AV` | 8 | Ramas disponibles: bit 1 preguntar de nuevo, 2 otra cosa, 4 seguir, 8 responder. |
| 0x4718 | `D_RP` | 1000 | Lo que él dijo (copia de `D_IN`). |
| 0x6000 | `D_PM` | 48 | Sumas y cuentas de activación (+0, +8), claridad (+16, +24) y bolita (+32, +40). |
| 0x6030 | `D_CX` | 2048 | 32 contextos × 4 ramas × (N, S): entrada en `ctx·64 + (rama − 1)·16`, N en +0, S en +8. |
| 0x6830 | `D_CM` | 96 | Pares (N, S): +0 encadenar en 2 líneas, +16 tras 2 sujetos, +32/+48 cruce (mejor / libre), +64/+72 hilo, +80/+88 improvisar. |
| 0x7C18 | `D_HL` | 4 × 24 | Etiquetas de los libros del corazón. |
| 0x7C78..0x7CF0 | `H_K` .. `H_NN` | | Estado de `r_dlg_heart` (§13). |
| 0x7CF8 | `H_NP` | 4 × 8 | Huellas de las palabras de su nombre. |
| 0x7D18 | `TH_P` | 24 × 8 | Huellas del intercambio que terminó (el hilo); `TH_PN` (0x7DD8) cuántas. |
| 0x7DE0 | `TH_N` | 24 × 8 | Huellas del intercambio que empieza; `TH_NN` (0x7EA0) cuántas. |
| 0x7EA8 | `TH_M` | 24 × 8 | Marca (`D_ID`) de cada huella de `TH_P`. |
| 0x7F68..0x7F80 | `TH_W`, `TH_C`, `TH_B`, `TH_L` | 4 × 8 | Deseo vigente del hilo; aporte del hilo al párrafo, al mejor; respondió por el hilo. |
| 0x7F88..0x7FA0 | `IM_K`, `IM_P`, `IM_ON`, `IM_L` | 4 × 8 | Tema: libro del corazón, desplazamiento, tema abierto, improvisó. |
| 0x7FD8 | `D_GBLK` | 8 | Puntero a la sala de gustos (§2.2). |
| 0x7FE0 | `D_LIVE` | 8 | 1 si el libro que se lee es la charla. |

Los nombres `D_LS`, `D_LI`, `D_BS` y `D_CM` se asignan dos veces en la cabecera; rige la última asignación
(`D_LS`: `gen_leer.py:282` y `gen_leer.py:286`, final 0x1A78; `D_LI`: `gen_leer.py:282` y `gen_leer.py:316`, final
0x4570; `D_BS`: `gen_leer.py:282` y `gen_leer.py:353`, final 0x68D0, dentro de la zona que sigue a `D_CM`; `D_CM`:
`gen_leer.py:301` y `gen_leer.py:346`, final 0x6830). Ver §24.

### 2.2 La sala de gustos (`[D_GBLK]`)

Desplazamientos dentro de la sala apuntada por `D_GBLK` (accedida con `gb`/`gbs`):

| Desplazamiento | Nombre | Contenido |
|---|---|---|
| +0 | | Peso del libro que se lee: deseo × firma (§8.3). |
| +8 | | Mejor puntaje de la búsqueda en curso. |
| +16 | | Huella del libro que se lee. |
| +24 | | Huella del libro de su línea A. |
| +32 | | Huella del libro que espera respuesta de él. |
| +40 | | Cantidad de libros en la tabla de gustos. |
| +48 (`GU_F`) | | Marco: dos de las tres señales (+0 siguió el tema, +8 trajo algo nuevo; la tercera es `D_KACT`), lo que esperaba (+16 hilo, +24 improvisación), +32/+40/+48 desacuerdos de cada marco, +56 marco de confianza, +64 puntero a la sala del ánimo. |
| +120 (`GU_T`) | | Tabla de libros: `GU_K = 256` entradas de 24 bytes (huella, N, S). |
| +6280 (`TM_L`) | | Etiqueta del tema: bytes (qword) y etiqueta (hasta 48). `TM_S` (+6344): 1 si cayó a mitad de línea. |
| +6352 (`IG`) | `IG_W`, `IG_N`, `IG_S`, ..., `IG_L` | Imaginación (§15). `IG_LBL` (+6552): `imaginado` (+0), `imagina` (+16), ` \| ` (+24), ` > ` (+28), salto de línea (+32). |
| +6592 / +6600 | `HF_T` / `HF_N` | La mitad: umbral y líneas contadas al hallarlo (+1). |
| +6608 (`LG`) | `LG_TB` .. `LG_LL` | Firmas (§19). |
| +6856 | `LG_TKB` | Puntero a la línea del flujo de pensamiento en curso (sala de 1008 bytes creada en `lj_load`, `gen_leer.py:5123`; 0 si no existe). |
| +6888..+6912 | `LG_RB`, `LG_RN`, `LG_RC`, `LG_RW` | Su respuesta única: sala, bytes, capacidad, "él habló desde entonces". |
| +6920 | `LG_RPS` | Sala y bytes donde se guardan las palabras de él mientras el hilo ocupa su lugar. |
| +6936 (`LG_FL`) | | Libro de la línea con que responde: bytes de la etiqueta (+0), etiqueta (+8, hasta 64), fin de la línea en el archivo (+72). |
| +7024 (`WY`) | `WY_N` .. `WY_U` | Caminos (§9). |
| +7320 (`WY_CB`) | | Costo de la silueta según cada paso (9 qwords). |
| +7392 (`WY_M`) | | Cuentas de silueta por paso: 9 × 48 bytes. |

### 2.3 La sala de ejemplos (`EXR`)

`EXR` es una global; la sala se crea en `r_exr_new` con
`PL_BASE + PL_SIZE + 8 + 676·16 = 7168 + 213024 + 8 + 10816 = 231016` bytes y el indicador de pares en cero
(`gen_leer.py:3289-3291`). Se crea a demanda y no se devuelve.

**Ranuras de ejemplo.** Siete ranuras de 1024 bytes, la `i` en `EXR + 1024·i` (`i` = 0..6). `EXN` (global) dice
cuántas están ocupadas.

| Desplazamiento en la ranura | Contenido |
|---|---|
| +0 | Bytes de la respuesta (lo que sigue a la línea), o de la oración. Máximo 480. |
| +8 | Bytes de la línea (0 si la ranura es una oración o una regla). Máximo 480. |
| +16 | Texto de la respuesta u oración (hasta 480; la regla de `r_describe` hasta 470). |
| +516 | Texto de la línea (hasta 480). |
| +1000 | Índice del libro (`D_LC & 255`), sólo en modo pistas (CNB = 30). |
| +1008 | Cantidad de pistas, sólo en modo pistas. |

La ortografía (§5) reutiliza `EXR + 0` como salida, `EXR + 1024` como estado `OS_*` y `EXR + 2048 .. +6144` como
trozo de lectura del Libro: se ejecuta antes de que el turno llene ranuras.

**Estado de ortografía `OS_*`** (en `EXR + 1024`, `gen_leer.py:3205`):

| Campo | Desp. | Contenido |
|---|---|---|
| `OS_P` | 0 | Puntero de lectura. |
| `OS_E` | 8 | Fin de lo que se lee. |
| `OS_O` | 16 | Bytes escritos en la salida (`EXR + 0`, máximo 990). |
| `OS_WS` | 24 | Inicio de la palabra. |
| `OS_M` | 32 | Letras de la palabra. |
| `OS_BC` | 40 | Líneas del mejor candidato (o tamaño del Libro en `or_pairs`). |
| `OS_BL` | 48 | Letras del mejor candidato (o posición en el Libro en `or_pairs`). |
| `OS_I` | 56 | Posición de la variante. |
| `OS_C` | 64 | Letra de la variante. |
| `OS_VM` | 72 | Letras del intento. |
| `OS_K` | 80 | Clase de variante: 1 quitar, 2 cambiar, 3 poner. |
| `OS_L` | 128 | Letras de la palabra (32 qwords). |
| `OS_V` | 384 | Letras del intento (34 qwords). |
| `OS_B` | 656 | Letras del mejor. |

**Área de lugares `PL_*`** (en `EXR + PL_BASE`, `PL_BASE = 7168`, `gen_leer.py:2433-2447`):

| Campo | Desp. | Tamaño | Contenido |
|---|---|---|---|
| `PL_NT` | 0 | 8 | Cantidad de lugares (≤ 64). |
| `PL_PVP` | 16 | 8 | Huella de la palabra anterior (0: ninguna). |
| `PL_PVX` | 24 | 8 | 1 si la palabra anterior es una de las que él pregunta. |
| `PL_PVS` | 32 | 8 | Inicio de la palabra anterior. |
| `PL_PVE` | 40 | 8 | Fin de la palabra anterior. |
| `PL_PPS` | 48 | 8 | Inicio de la palabra previa a la anterior. |
| `PL_CUR` | 56 | 8 | Huella de la palabra actual. |
| `PL_XL` | 64 | 8 | Bytes del texto de la palabra preguntada (≤ 24). |
| `PL_XT` | 72 | 24 | Texto de la palabra preguntada, tal como apareció por primera vez. |
| `PL_OL` | 96 | 8 | Bytes del enunciado de la regla (§12.4). |
| `PL_M` | 104 | 4 × 8 | Punteros a las palabras elegidas por la regla. |
| `PL_NM` | 136 | 8 | Cuántas palabras eligió la regla (≤ 4). |
| `PL_PPP` | 144 | 8 | Huella de la palabra previa a la anterior. |
| `PL_T` | 160 | 64 × 56 | Lugares: clave (+0), veces (+8), bytes del texto (+16, ≤ 32), texto (+24). |
| `PL_S` | 3744 | 4096 × 48 | Palabras: huella (+0), mapa de lugares (+8, un bit por lugar), bytes (+16, ≤ 16), texto (+24), mapa guardado (+40). |
| `PL_BK` | 200352 | 256 | Un byte por libro (`D_LC & 255`): 1 si habla de la palabra. |
| `PL_TMP` | 200608 | 128 | Rasguño (ver tabla siguiente). |
| `PL_HS` | 200736 | 1024 × 8 | Huellas de las palabras del centro del corazón. |
| `PL_HWC` | 208928 | 256 × 8 | Por libro: palabras suyas que son del centro. |
| `PL_TWC` | 210976 | 256 × 8 | Por libro: palabras suyas contadas. |
| (fin) | 213024 | | `PL_SIZE`. |

Campos de `PL_TMP` (`gen_leer.py:2626`, `gen_leer.py:2810`, `gen_leer.py:2826-2839`, `gen_leer.py:4197`):
+0 `BP` guardado, +8 `BE`, +16 `BWS`, +24 inicio de oración, +32 fin de oración, +40 pistas, +48 "este libro es del
corazón", +56 peor/mejor ranura, +64 índice de recorrido, +72 libro (`D_LC & 255`), +80 "sólo el Libro".

Clave de un lugar: `2·h` significa "la palabra preguntada va seguida por la palabra de huella `h`"; `2·h + 1`
significa "la palabra de huella `h` precede a la palabra preguntada" (`gen_leer.py:2720`, `gen_leer.py:2761`).
La tabla de palabras se direcciona con `(h >> 12) + h` mod 4096 y prueba lineal de hasta 8 ranuras; si las 8 están
ocupadas por otras huellas, la palabra no se registra (`gen_leer.py:2467-2481`). `PL_HS` igual, mod 1024
(`gen_leer.py:2692-2705`).

**Tabla de pares de letras** (en `EXR + PL_BASE + PL_SIZE`): +0 indicador "ya leída"; para el par `(a, b)` de letras
`a`..`z`, con `k = 26·(a − 'a') + (b − 'a')`, la huella de la primera palabra que lo tuvo en `+16k + 8` y el
indicador "probado" en `+16k + 16` (`gen_leer.py:3246-3275`).

### 2.4 La sala del canto (`LNR`, 0xC000 bytes)

Creada en `r_canto` y no devuelta (`gen_leer.py:6629`). Desplazamientos (`gen_leer.py:6550-6560`):

| Desp. | Nombre | Contenido |
|---|---|---|
| 0x0000 | fichas | Hasta 1000 fichas de 16 bytes: huella (+0; 0 = borde de línea) y palabra (+8; −1 en un borde). `NMP` = cantidad. |
| 0x4000 | `LN_WRD` | Hasta 500 palabras de 32 bytes: huella (+0), clase (+8), dirección del texto (+16), bytes (+24). `NMO` = cantidad. |
| 0x8000 | `LN_LET` | Un byte por clase (indexado por número de palabra): su letra para el canto (0: sin letra aún). Se limpian 512 bytes. |
| 0x8400 | `LN_LIN` | Ficha de inicio de cada línea (qword). `NMS` = cantidad. |
| 0x9000 | `LN_OUT` | Texto en escritura (`CNX` bytes). |
| 0xA000 | | Ventana de la charla para `rc_said` (`TM_W = 4096` bytes; `CNS` = bytes leídos). |
| 0xB000 | `LN_LBL` | Etiquetas: `pares` (+0), `canta` (+16), `razona` (+32), `cantado` (+48), `luma/canto.bin` (+64), `dados` (+80). |

### 2.5 La sala de candidatos (`CNR`, 13 × 1024 bytes)

Creada en `wy_go` (`gen_leer.py:4101`). La ranura 0 guarda lo que había en `D_OUT` al entrar (bytes en +0, texto en
+24). Las ranuras 1..12, en `CNR + 1024·i`, guardan cada respuesta de un paso: bytes (+0), paso `WY_ST` (+8),
cantidad de palabras (+16, la llena `wy_choose`), texto (+24, hasta 1000) (`gen_leer.py:4346-4351`). `CNN` es la
cantidad de candidatos.

### 2.6 Tabla de palabras contadas (`WFT`)

En el bloque propio: `WFT` (`B+0x1EF8`) apunta a la tabla, `WFM` (`B+0x1FE8`) es su cantidad de ranuras menos 1,
`WFN` (`B+0x1FF8`) el total de líneas contadas. Cada ranura ocupa 64 bytes: huella (+0), líneas que la tienen `L`
(+8), líneas cuya línea siguiente la conservó `S` (+16). Índice `(h >> 17) XOR h` y prueba lineal
(`gen_leer.py:3880-3888`, `gen_leer.py:995-1000`). La construcción de la tabla (`bu_wcount`) no se especifica aquí
(no verificado en este capítulo).

### 2.7 Variables globales del turno

| Global | Uso en este capítulo |
|---|---|
| `EXR`, `EXN` | Sala de ejemplos y cantidad de ranuras ocupadas. |
| `CNB` | Modo de búsqueda (§2.8); dentro de `wy_choose`, índice del candidato elegido. |
| `LNR`, `CNR`, `WVW` | Salas del canto, de candidatos y de la ventana de imaginación (`13·1024 + TM_W + 64` bytes, `gen_leer.py:4431`). |
| `CNN`, `CNI`, `CNJ`, `CNT`, `CNX`, `CNS` | Contadores e índices de recorrido (compartidos por varias rutinas). |
| `WVS` | Máscara de pasos del camino que ya hablaron (bit `k` para el paso `k`). |
| `WVJ`, `WVM`, `WVP`, `WVL` | Índices, máscaras, huellas y longitudes de recorrido. |
| `RD1`, `RD2`, `RDC` | Índices; `RD2 = 0x7711` marca "no imaginar sobre esta respuesta". |
| `NMP`, `NMO`, `NMS`, `NME` | Fichas, palabras y líneas del canto; también estado de `r_names_out`. |
| `ANSW` | 1 mientras el pensador responde una pregunta de él (`gen_leer.py:3671`). |
| `PENS` | 1 en el proceso pensador (dato inicial `20h = 2`, `gen_leer.py:7156-7159`). |
| `CONV` | 1 si el turno es una conversación (alguien le habla, `ANSW = 1`). |
| `ASKD` | 1 si en el turno anterior devolvió la pregunta; 2 si eso fue en el turno previo al actual. |
| `SPAS` | Pasada del paso `sigue`: 1 sólo la charla, 2 todos los libros. |
| `SOLO` | 1: `r_dlg_answer` sólo lee la charla. |
| `SIGM` | 1: `r_dlg_answer` sólo acepta líneas que son mayormente lo que él dijo (§8.6). |
| `BRG`, `BFOR` | Modo puente; "la línea viene de otro idioma". |
| `LNW` | Palabras que cuentan en la línea en curso. |
| `IGK`, `IGF` | `IG_N` al empezar la síntesis; "respondiendo a alguien" para la imaginación. |
| `WHOR`, `WHOT` | Etiqueta `trato-<libro>` de quien habla (sala de 128 bytes); copia de trabajo. |
| `PKID`, `PREADY`, `PBUSY`, `PTASK`, `PQBUF`, `PQLEN` | Protocolo con el pensador (§3). |
| `RAINR`, `RAINN` | Lluvia: sala y cantidad de pasos (§18). |

### 2.8 Valores de `CNB`

| Valor | Significado | Dónde se fija | Efecto en `r_dlg_answer` |
|---|---|---|---|
| 0 | Búsqueda normal. | `gen_leer.py:4199`, `gen_leer.py:4207`, `gen_leer.py:4243`, `gen_leer.py:4248`, `gen_leer.py:6710` | Libros bajo la rama actual del árbol (`ar_in`); la charla incluida. |
| 1 | En `wy_choose`: número del candidato elegido. En `r_canto`: "ya cantó o no canta más". | `gen_leer.py:4359`, `gen_leer.py:4377`, `gen_leer.py:6686-6688`, `gen_leer.py:6800` | — |
| 2 | Lo que las costumbres no cubren: primera lectura (lugares de la palabra, centro del corazón, oraciones sobre ella, `PL_BK`). El corazón sólo con lo que él dice ahora. | `gen_leer.py:4172`, `gen_leer.py:4202`, `gen_leer.py:6708` | Todos los libros (sin árbol), sin la charla. |
| 3 | `r_canto` sobre las oraciones halladas por las pistas: primero el canto. | `gen_leer.py:4243` | No llama a `r_dlg_answer`. |
| 5 | `r_canto` sobre las oraciones del Libro: nunca canto; memoria cercana, luego azar. | `gen_leer.py:4199` | No llama a `r_dlg_answer`. |
| 6 | Segunda lectura en los libros que hablan de la palabra (`PL_BK = 1`). | `gen_leer.py:4216` | Sólo libros con `PL_BK = 1`. |
| 14 | Segunda lectura en los demás libros (`PL_BK = 0`). | `gen_leer.py:4217` | Sólo libros con `PL_BK = 0`. |
| 30 | Tercera lectura: oraciones sobre la palabra contando pistas; se guardan las seis mejores. | `gen_leer.py:4221` | Sólo libros con `PL_BK = 1`; sin lugares. |

Las pruebas `CNB & 2` (verdaderas para 2, 3, 6, 14 y 30) habilitan el área `PL_*`, saltan la charla y anulan la
restricción del árbol (`gen_leer.py:2607`, `gen_leer.py:2613`, `gen_leer.py:2662`, `gen_leer.py:2676`).

`CNB` no se reinicia al empezar un turno. Las únicas escrituras son las de la tabla (`gen_leer.py:4172-4248`,
`gen_leer.py:4359`, `gen_leer.py:4377`, `gen_leer.py:6686-6710`, `gen_leer.py:6800`); tras `wy_choose` queda con el
índice del candidato elegido (1..12). Ese valor residual es el que ven, en el turno siguiente, la primera búsqueda
`dsy_look` (§4 paso 14), la pasada 1 del paso `sigue` y la llamada a `r_canto` de §10.1 (ver §24).

---

## 3. Protocolo de entrada: de Enter al pensador

### 3.1 Teclado (`r_dlg_key`, `r_char`)

`r_dlg_key` (`gen_leer.py:5908-5939`) recibe la tecla en `j3` cuando no se está pidiendo el nombre:

| Tecla | Acción |
|---|---|
| 8 (borrar) | Quita un carácter UTF-8 entero del final de `D_IN` (retrocede sobre bytes 128..191). |
| 13 (Enter) | Si `D_INL > 0`: `r_pens_ask`. |
| 9 (Tab) | `r_mus_tab` (capítulo 10). |
| 33 / 34 | Retrocede / avanza 4 líneas `D_SCR0` en el panel. |
| 32, 48..57, 65..90, 96..111, 186..226 | Teclas de escritura: su carácter llega por `r_char`. |

`r_char` (`gen_leer.py:5940-5958`): el carácter 3 copia su respuesta única al portapapeles (pedido 47 con
`j11 = lj_rptr`, `j12 = lj_rlen`; nada si la longitud es 0). Si existe pensador (`PKID ≠ 0`) y aún no está listo
(`PREADY = 0`), el carácter se descarta. Caracteres menores que 32 y el 127 se descartan. Si se está pidiendo el
nombre (`NMROOM ≠ 0` y `NMASK ≠ 0`), el carácter va a `NMROOM + 64` con límite 3000 bytes. En otro caso se añade en
UTF-8 a `D_IN` mediante `ch_put`, que sólo escribe si `D_INL + 4 < 1000` (`gen_leer.py:5959-5974`). Tras escribir:
`r_letra_learn` y `CHANGED ← 1`.

### 3.2 Cuerpo → pensador (`r_pens_ask`)

`gen_leer.py:3599-3626`:

1. Si `PKID = 0` o `PREADY = 0`: el cuerpo procesa el turno él mismo (`r_dlg_sent`, §4, con `ANSW = 0`).
2. En otro caso, `D_OUT ← D_IN` (hasta 1000 bytes; lo tipeado se muestra como última palabra) y `LG_RB ← 0`.
3. Si `PBUSY ≠ 0` (el pensador piensa): se añade `D_IN` a la cola `PQBUF` (sala de 1024 bytes creada en
   `gen_leer.py:3583`), con un espacio de separación si ya había algo, hasta que el total llega a 1000 bytes; `PQLEN`
   se actualiza. Si `PQBUF = 0`, lo tipeado se descarta sin encolar.
4. Si no: `pna_send(D_IN, D_INL)`:
   1. pedido 12 sobre la etiqueta `GA["PQ"]` (8 bytes: `pregunta`, `gen_leer.py:7583`), `r_open`, escribir (`r_file` 6),
      cerrar (`r_file` 7); si el archivo no abre, `pna_send` termina sin los dos pasos siguientes;
   2. `r_rain_dice` (§18);
   3. `r_pens_say(1)`.
5. `D_INL ← 0`; `CHANGED ← 1`.

`r_pens_say(t)` (`gen_leer.py:3588-3598`): si `PBUSY ≠ 0` no hace nada. Si no, `PBUSY ← 1`, `PTASK ← t`; pedido 42
al hijo `PKID − 1` con `b = 0` si `t = 1` y `b = 1` en otro caso (semántica de `b` en el capítulo 04); pedido 30 al
hijo `PKID − 1` con la palabra `t`. Tareas: 1 pregunta de él, 2 estudio propio, 3 hablar primero.

### 3.3 Pensador

Al nacer (`pz_go`, `gen_leer.py:3658-3659`) el pensador envía a su madre (pedido 30, `j11 = 0`) la palabra 5.
Luego, bucle `pz_wait` (`gen_leer.py:3660-3703`):

1. Pedido 31 sobre `B + WBUF` (16 bytes). Si devuelve 1 y `WBUF[0] = 0` (palabra de su madre), según `WBUF[8]`:
   1 → `pz_q`; 2 → `r_self_talk`; 3 → `r_dlg_talk`; otro → `pz_done`. Una palabra de otro emisor se ignora.
2. Si no hubo palabra: pedido 29; si devuelve −1, `jhalt` (no queda madre).

`pz_q`: abre `pregunta`, lee hasta 1000 bytes en `D_IN`, `D_INL ←` bytes leídos (si ≤ 0, `pz_done`); `ANSW ← 1`;
`r_dlg_sent`; `ANSW ← 0`. Si `WHOR ≠ 0`, `D_RPL > 0` y la respuesta única no está vacía, añade al final del archivo
`WHOR` el registro: `vos: ` + `D_RP` + `\n` + `luma: ` + respuesta + `\n` (`gen_leer.py:3673-3690`).

`pz_done`: `r_dlg_mind`; pedido 12 sobre `GA["PR1"]`..`GA["PR2"]` (9 bytes: `respuesta`, `gen_leer.py:7583`), lo abre y escribe la
respuesta única (`lj_rptr`, `lj_rlen`); pedido 30 a la madre (`j11 = 0`) con la palabra 4.

### 3.4 Pensador → cuerpo

`r_mus_from` (`gen_leer.py:6289-6290`): una palabra del hijo `PKID − 1` con valor 5 pone `PREADY ← 1`; cualquier
otro valor invoca `r_pens_done`.

`r_pens_done` (`gen_leer.py:3635-3657`): `PBUSY ← 0`; lee hasta 1000 bytes de `respuesta` en `D_C`. Si la tarea era
2 (estudio), el texto va sólo al flujo de pensamientos, salvo que sea igual al anterior (primer qword `PL8` y
longitud `PLL`). Si no, y si difiere de `D_OUT`, `D_OUT ← D_C`, `LG_RB ← 0`, `CHANGED ← 1`. Por último, si
`PQLEN > 0`, `PQLEN ← 0` y `pna_send(PQBUF)`.

---

## 4. Recepción del turno (`r_dlg_sent`)

`gen_leer.py:3350-3520`. Pasos en orden:

1. **Dueño del hilo.** Si `SF_ON` del árbol (un libro le habla en su charla con lecturas) difiere de `LASTSF`,
   `LASTSF ← SF_ON` e `IM_ON ← 0` (`gen_leer.py:3354-3356`).
2. **`th_turn`** (§6.2).
3. **Pensamiento visible.** Si `LG_TKB ≠ 0`: escribe `pienso en: ` + `D_IN` en la línea de pensamiento
   (`lj_think`, `gen_leer.py:3359-3372`).
4. **Copia.** `D_RP ← D_IN` (hasta 1000), `D_RPL` (`gen_leer.py:3375-3379`).
5. **Pagos de lo que esperaba.** `D_ENT ← 0`; `D_ENT ← 1` si `D_AWAIT ∈ {1, 2}`. Si `D_AWAIT ∈ {1, 2}` y
   `D_LBR ≠ 0`: `D_CX[D_LCX·64 + (D_LBR − 1)·16 + 8] += 1` (S de esa rama en ese contexto); si además `D_LBR = 4` y
   `D_LCM ≠ 0`: `D_CM[(D_LCM − 1)·16 + 8] += 1`; ídem para el cruce con `D_LXM` sobre `D_CM + 32`; y en ese mismo
   camino `D_LCM ← 0`, `D_LXM ← 0`. Con `D_AWAIT ∈ {0, 3}` o `D_LBR = 0` se salta todo el paso y `D_LCM`, `D_LXM`
   conservan su valor (`gen_leer.py:3382-3393`).
6. **Activación de él.** Sobre `D_RP`: cuenta `c` = bytes `!`, bytes `A`..`Z`, y bytes ≥ 97 iguales al anterior
   (letra estirada). `act = 1000·c / D_RPL` (0 si vacío). `D_KACT ← 1` si `act ≠ 0` y `act · D_PM[8] ≥ D_PM[0]`
   (no menor que su media previa); luego `D_PM[0] += act`, `D_PM[8] += 1` (`gen_leer.py:3394-3410`).
7. **`r_marco`** (§6.3).
8. **Registro.** `r_dlg_write(quien, D_IN)`, con `quien = 6` (`libro: `) si `SF_ON`, si no 0 (`vos: `). Queda escrito
   lo tipeado, antes de la ortografía (`gen_leer.py:3412-3414`).
9. **Ortografía.** Si `ANSW = 1`: `r_ortografia` (§5).
10. **Palabras dichas.** `r_dlg_words(D_IN)` (§6.1); `D_INL ← 0`.
11. **Cuentas de respuesta** (`gen_leer.py:3420-3432`):
    - `D_AWAIT = 3` (calló y él volvió a escribir): `D_SC += 1`, `D_NC += 1`.
    - `D_AWAIT = 1`: `D_SC += 1`, `D_NC += 1`; además `D_MC_S1 += 1` si `D_LMODE = 1`, `D_MC_S2 += 1` si
      `D_LMODE = 2`.
    - `D_AWAIT = 2`: `D_SH += 1`; si `D_LBR ≠ 0`, `D_RPV ← 1` y `D_BS0[(D_LBR − 1)·8] += 1`.
    - `D_AWAIT ← 0`.
12. **Decisión de responder** (§7).
13. **Hilo abierto** (sólo si `ANSW = 0` e `IM_ON = 1` y `lj_pull = 0`, §19.6): si `lj_asks = 1` y `lj_about = 1`,
    responde con eso; en otro caso intenta `r_dlg_heart_own`; si éste falla, sigue al paso 14
    (`gen_leer.py:3451-3454`). Una respuesta obtenida aquí va a `dse_has` (§16) con `D_KCLA ← 0`, `D_LMODE ← 2`,
    `D_MC_N2 += 1`.
14. **Primera búsqueda** `dsy_look`: `D_RPV ← 1`; `r_dlg_answer` en modo 0 (§8). Claridad
    `cla = 1000·D_BS / D_NW` (0 si `D_NW = 0`); `D_KCLA ← 1` si `cla ≠ 0` y `cla · D_PM[24] ≥ D_PM[16]`; luego
    `D_PM[16] += cla`, `D_PM[24] += 1` (`gen_leer.py:3455-3462`).
15. **Ramas disponibles.** `D_AV ← 10` (otra cosa, responder), o `15` si `D_QL ≠ 0`; si `D_OUTL = 0`,
    `D_AV ← D_AV & 7` (`gen_leer.py:3463-3467`).
16. **`wy_go`** (§9).

---

## 5. Ortografía (`r_ortografia`)

`gen_leer.py:3196-3349`. Se ejecuta sólo con `ANSW = 1` y si existe la tabla `WFT`. Crea `EXR` si no existe.

### 5.1 Tabla de pares del Libro (`or_pairs`, una sola vez)

1. Si el indicador +0 de la tabla de pares es distinto de 0, termina. Si no, lo pone en 1 y limpia las 676 entradas.
2. Abre la etiqueta `libro` (5 bytes) o, si falla, `elibro` (6 bytes). Sin Libro, termina.
3. Lee el Libro en trozos de 4096 bytes en `EXR + 2048`, pidiendo cada trozo por su posición (`r_file` 38 con
   `OS_BL`) mientras `OS_BL < OS_BC`; `OS_BC` es el tamaño medido con `r_file` 38, `j11 = −1`. Esa medición sólo
   ocurre en la rama `elibro` (ver §24, observación 10).
4. Por cada palabra del trozo (hasta 32 letras base guardadas), calcula su huella y recorre sus pares consecutivos
   `(l[i−1], l[i])` con ambas letras en `a`..`z`:
   - si el par está "probado", nada;
   - si no tiene primera palabra, guarda la huella;
   - si la tiene y es otra huella, lo marca "probado" (dos palabras distintas lo tienen).

Una palabra partida por el borde de un trozo se procesa como dos palabras (el código no trata ese caso).

### 5.2 Palabra por palabra

Recorre `D_IN`; lo que no es letra se copia tal cual a la salida. Por cada palabra (`gen_leer.py:3297-3343`):

1. Guarda sus letras base en `OS_L` (hasta 32; `OS_M` cuenta todas).
2. Si `OS_M < 4` o `OS_M ≥ 33`: se copia tal como se escribió.
3. Si `dh_wl(huella) ≠ 0` (la palabra aparece en alguna línea de sus libros, §20.1): tal cual.
4. Si no: `OS_BC ← 1`, `OS_BL ← 0`. Intentos, cada uno evaluado por `or_try`
   (`c = dh_wl(huella(intento))`; es el mejor si `c > OS_BC`, de modo que hacen falta al menos 2 líneas; en empate
   gana el primero):
   1. La palabra con las letras repetidas consecutivas aplastadas en una, si difiere de la original.
   2. Sólo si `or_bad` (la palabra contiene un par `a`..`z` no probado por el Libro): todas las variantes a distancia
      uno, en este orden: quitar la letra `I` para `I = 0..M−1`; cambiar la letra `I` por `C` para `I = 0..M−1`,
      `C = 'a'..'z'`; poner `C` antes de la posición `I` para `I = 0..M`, `C = 'a'..'z'`.
5. Si hubo mejor (`OS_BL ≠ 0`), se escriben sus letras (un byte si < 128; dos bytes UTF-8 si no); si no, la palabra
   original. Las letras corregidas salen en minúscula base.

### 5.3 Resultado

La salida (`EXR + 0`, a lo sumo 990 bytes) reemplaza a `D_IN` y a `D_RP`; `D_INL = D_RPL = OS_O`
(`gen_leer.py:3344-3347`). El archivo `dialogo` conserva lo tipeado (paso 8 de §4).

---

## 6. Palabras dichas, hilo y marco

### 6.1 `r_dlg_words`

`gen_leer.py:2071-2082`. Sobre un texto, llena `D_WORDS` con las huellas distintas de sus palabras de 4 letras o más,
en orden de aparición, hasta 120; `D_NW` = cantidad. Como `bw_word` se detiene en un byte 10, sólo se lee hasta el
primer fin de línea del texto. Se vuelve a llamar sobre `D_RP` cada vez que otra rutina usó
`D_WORDS` para otro texto (por ejemplo `gen_leer.py:4249`, `gen_leer.py:4341`, `gen_leer.py:4381`).

### 6.2 El hilo de profundidad uno (`th_*`)

`th_turn` (`gen_leer.py:3914-3927`), al empezar cada turno:

1. `GU_F+0 ← th_follows` y `GU_F+8 ← th_new`; `GU_F+16 ← TH_L`; `GU_F+24 ← IM_L`; `TH_L ← 0`; `IM_L ← 0`.
2. `IG_W ← IG_L`; `IG_L ← 0`.
3. `lj_hist` (§19.2); `LG_RW ← 1`.
4. `TH_P ← TH_N` (`TH_PN ← TH_NN`); `TH_NN ← 0`.
5. `an_add(D_IN)` (palabras al ánimo actual) y `th_add(D_IN)`.

| Rutina | Entrada | Salida |
|---|---|---|
| `th_follows` (`gen_leer.py:4657-4666`) | `D_IN` | 1 si una palabra suya de 4+ letras está en `TH_N`, no es de su nombre y `dh_wt > 0`. |
| `th_new` (`gen_leer.py:4646-4656`) | `D_IN` | 1 si una palabra suya de 4+ letras, que no es de su nombre, no está en `TH_N`. |
| `th_add` (`gen_leer.py:4667-4676`) | texto | Añade sus huellas de 4+ letras a `TH_N`, una vez cada una, hasta `TH_K = 24`. |

`th_follows` y `th_new` se evalúan antes de copiar `TH_N` a `TH_P`: comparan lo que él dice con el intercambio que
termina (su línea anterior y lo que ella contestó, añadido en §16 paso 5).

### 6.3 El marco (`r_marco`)

`gen_leer.py:4618-4645`. Si nada esperaba (`GU_F+16`, `GU_F+24`, `+32`, `IG_W` y `WY_L` en 0), termina. Si no:

1. Señales: `s0 = GU_F+0`, `s1 = GU_F+8`, `s2 = D_KACT`. Mayoría `m = 1` si `s0 + s1 + s2 ≥ 2`.
2. Para cada `k` con `s_k ≠ m`: `GU_F + 32 + 8k += 1` (desacuerdo).
3. Marco de confianza `GU_F+56`: se reemplaza por el `k` de menor desacuerdo, sólo si es estrictamente menor que el
   del vigente.
4. `j0 = s_{confianza}`; `gu_pay` (libro que esperaba: `S += 1` si `j0`); `wy_pay` (§9.5).
5. Si `j0 = 1`: `D_CM+72 += 1` si el hilo esperaba; `D_CM+88 += 1` si la improvisación esperaba; `IG_S += 1` si la
   imaginación esperaba.
6. Limpia `GU_F+16`, `GU_F+24`, `IG_W`.

---

## 7. Decisión de responder

`gen_leer.py:3433-3439`:

1. `deseo = dse_wish(D_SC, D_NC)`.
2. Si `r_randmod(2^20) < deseo`: responde (§4 paso 13 en adelante).
3. Si no: `D_AWAIT ← 3`, `D_OUTL ← 0`, `r_dlg_write(2)` (escribe `luma: (eligio no contestar)`), `r_dlg_save`,
   `CHANGED ← 1`, fin del turno.

`D_NC` y `D_SC` sólo se incrementan juntos (§4 paso 11, `gen_leer.py:3420`, `gen_leer.py:3422`; no hay otro
incremento de `D_NC` en el archivo). Si los valores cargados de `charla` (`gen_leer.py:2018`) son iguales, el deseo es
`(S + 1/2)/(S + 1)` y no decrece.

Banderas de construcción de prueba: `LUMA_RESPONDE` responde siempre; `LUMA_CALLA` omite la decisión por azar
(`gen_leer.py:3435-3438`).

Si ninguna fuente produce respuesta (`dse_none`, `gen_leer.py:3506-3507`): `r_dlg_write(3)`
(`luma: (no encontro con que contestar)`), `r_dlg_save`; no cuenta como respuesta.

---

## 8. El motor de selección de líneas (`r_dlg_answer`)

`gen_leer.py:2574-2942`. Devuelve en `D_OUT`/`D_OUTL` (modo 0) o `D_B`/`D_BL2` (modo 1) la línea de mayor puntaje de
todos sus libros respecto de `D_WORDS`.

### 8.1 Preparación

1. `D_BS ← 0`, `D_BL2 ← 0`, mejor puntaje `[D_GBLK]+8 ← 0`. En modo 0: `D_OUTL ← 0`, `BFOR ← 0`.
2. Sólo en modo 0: limpia las marcas `D_WORDS + 1024` de las `D_NW` palabras (en modo 1 no se limpian; como `D_ID`
   sólo crece, una marca vieja nunca coincide). Si `D_NW = 0`, termina.
3. `ar_load`; `AR_SKIP ← −1`; `AR_BK ← 0`.
4. `lj_pass` (§19.3): se recalcula la firma de él contra cada libro en cada llamada.
5. `ul_list`; `D_LI ← ULB`; `D_LC ← 0`.

### 8.2 Filtro de libros

Para cada entrada de la lista (`gen_leer.py:2587-2660`), en este orden:

1. `dialogo` → `D_LIVE ← 1`; un libro (`libro…`/`elibro…`) → `D_LIVE ← 0`; otra etiqueta → se salta.
2. `SOLO = 1` y no es la charla → se salta.
3. `CNB & 2` y es la charla → se salta.
4. `BRG = 1` y (es la charla o `lj_his = 0`) → se salta.
5. Si `CNB & 2`: `PL_TMP+48 ← 1` si la etiqueta es de `HEART`, si no 0. Si `PL_TMP+80 = 1`, sólo se acepta el Libro.
   Con `CNB = 14` se salta si `PL_BK[D_LC & 255] = 1`; con `CNB ∈ {6, 30}` se salta si es 0.
6. Si `CNB & 2 = 0`: se salta si `ar_in = 0` (no está bajo la rama actual del árbol ni sin ubicar).
7. Escribe `leo ` + etiqueta en la línea de pensamiento (`lj_think`).
8. Se salta si es libro de disco o si no abre.
9. `gu_book`: `[D_GBLK]+16 ←` huella, `[D_GBLK]+0 ← dse_wish(S, N)` de su entrada de gustos (0, 0 si no la tiene).
10. `lj_wbook`: `[D_GBLK]+0 ← lj_weight(libro, [D_GBLK]+0)` (§19.4).
11. Lee el archivo entero en la sala única de lectura (`r_bookroom`, reutilizada; se reemplaza sólo si hace falta más;
    sus últimos 64 bytes en cero, `gen_leer.py:3720-3733`). `BP`, `BE` lo delimitan. `ar_begin`.

### 8.3 Peso del libro

`peso = dse_wish(S, N) × factor_firma`, en unidades de 2^-20 (§1.4, §19.4). Un libro con peso 0 (por ejemplo una
carta a ella) nunca aporta línea, porque el puntaje debe ser estrictamente positivo.

### 8.4 Recorrido de una línea

Por cada línea (`dan_line`, `gen_leer.py:2661-2847`):

1. Si `CNB & 2`: limpia `PL_PVP`, `PL_PVX`, `PL_PVS`, `PL_PVE`, `PL_PPS`, `PL_PPP`.
2. `D_LS ← BP`, `D_CNT ← 0`, `D_ID += 1`, `LNW ← 0`.
3. Por cada palabra de 4+ letras:
   1. Lugares y centro (§12.2), si `CNB & 2` y `CNB ≠ 30`.
   2. `LNW += 1`. Si el árbol está registrando (`AR_ON`), pone el bit `huella mod 32768` de la huella de palabras del
      libro.
   3. Si la palabra está en `D_WORDS` (índice `i`):
      - Si `CNB & 2` y existe `EXR`: `PL_PVX ← 1`. Con `CNB = 2`, además lo de §12.2 paso 5 y la oración de §12.3
        mientras `EXN < 6`; con `CNB = 30`, la oración de §12.3 y §12.5; con `CNB ∈ {3, 6, 14}`, nada más
        (`gen_leer.py:2752-2766`).
      - Peso `w = 1`; en modo 1, `w = 2` si `D_AM[i] = 0` (la línea A no la dice).
      - Si la marca `D_WORDS[1024 + 8i] ≠ D_ID`, se marca y `D_CNT += w` (cada palabra cuenta una vez por línea).
4. Al fin de línea: filtros de §8.6 y ejemplos de §8.7, luego §8.5.

### 8.5 Elección de la mejor línea

1. `puntaje = D_CNT × peso`. Debe ser estrictamente mayor que `[D_GBLK]+8`.
2. Se descarta si contiene lo último que ella dijo (`lj_said`, §17).
3. En modo 1 se descarta si es exactamente su línea A (`D_AA`, `D_AL`).
4. Nueva mejor: `D_BS ← D_CNT`, `[D_GBLK]+8 ← puntaje`, `AR_BK ← AR_K`; en modo 0, `[D_GBLK]+24 ← [D_GBLK]+16`.
5. Se copia la línea, hasta 1000 bytes, a `D_OUT` (modo 0) o `D_B` (modo 1). Si es de la charla, se quita el
   hablante: el prefijo hasta el primer `:` dentro de los primeros 24 bytes, más 2 bytes. Cada byte 13 se copia como espacio.
6. En modo 0, además: `lj_mark` (etiqueta y fin de línea en `LG_FL`, si la etiqueta tiene menos de 64 bytes);
   `BFOR ← 1 − lj_his(libro)`; `D_SRC ←` etiqueta a partir de su primer guion, hasta 60 bytes.

### 8.6 Filtro "mayormente lo que él dijo" (`SIGM = 1`)

`gen_leer.py:2849-2852`: la línea sólo sigue si `2·D_CNT ≥ LNW` y `2·D_CNT ≥ D_NW` (la línea dice al menos la mitad
de sus palabras y sus palabras son al menos la mitad de las de la línea). Si no, se pasa a la siguiente sin
puntuarla.

### 8.7 Ejemplos (`SIGM = 1`, `SOLO = 0`, el libro no es la charla)

`gen_leer.py:2853-2872`. Si `EXN < 7`: crea `EXR` si hace falta; si al fin de la línea viene `\r` opcional y `\n`, la
línea siguiente (hasta el primer 0, 10 o 13, máximo 480 bytes) es la respuesta. Si está vacía, no hay ejemplo. Si
no, en la ranura `EXN`: respuesta en +0/+16, línea (desde `D_LS`, máximo 480) en +8/+516; `EXN += 1`.

### 8.8 Fin de la búsqueda y árbol

`gen_leer.py:2927-2940`:

- Si hubo línea (`D_BS ≠ 0`) y su libro está ubicado en una rama distinta de `AR_CUR`, `AR_CUR ←` esa rama.
- Si no hubo y `AR_CUR ≠ 0`: `AR_SKIP ← AR_CUR`, `AR_CUR ←` su padre (si existe) y se recorre de nuevo la lista
  completa; `ar_in` deja fuera la rama ya leída. Se repite hasta la raíz.
- `ar_save`; se devuelve la sala de la lista.

---

## 9. El camino (`wy_go`)

### 9.1 Pasos

`WY_STEPS` (`gen_leer.py:508`), `P = len(WY_STEPS) = 9` (`gen_leer.py:3932`): una letra `k ≤ 9` es un paso; una
letra `k > 9` es el camino ganado número `k − 10` de `WY_VB` (`gen_leer.py:4128`). Un camino es una sala con su
largo `L` en +0 y `L` letras de un qword cada una a partir de +8 (`wy_new`, `gen_leer.py:3942-3943`).

| k | Paso | Rutina | Produce candidato |
|---|---|---|---|
| 1 | `heart` | `r_dlg_heart` (§13) | sí |
| 2 | `impro` | `r_dlg_impro` (§15.4) | sí |
| 3 | `own` | `r_dlg_heart_own` (§15.4) | sí |
| 4 | `quien` | `r_dlg_quien` + `gu_said` (§9.6) | sí |
| 5 | `cross` | Sólo si `CNN = 0` y `D_OUTL ≠ 0`: `WY_XC ← 1` y salta a `dsy_cx` (cruce, fuera de este capítulo) | no (sale del camino) |
| 6 | `baja` | `ar_move(1)` y, si se movió, `r_dlg_answer` | no |
| 7 | `hermano` | `ar_move(2)` y, si se movió, `r_dlg_answer` | no |
| 8 | `sube` | `ar_move(3)` y, si se movió, `r_dlg_answer` | no |
| 9 | `sigue` | §10 | sí |

Los pasos 6..8 no añaden candidato: mueven `AR_CUR` y dejan su línea en `D_OUT`, lo que influye en los pasos
siguientes que miran `D_OUT` (`gen_leer.py:4152-4155`).

### 9.2 Entrada

`gen_leer.py:4098-4121`:

1. `WY_SN ← 0`, `WY_XC ← 0`. Crea `CNR` si no existe. `WVS ← 0`, `CNN ← 0`. Ranura 0 de `CNR ← D_OUT`.
2. **Conversación.** `CONV ← 0`. Si `ANSW = 1`: `CONV ← 1`; `ASKD ← 2` si valía 1, si no `ASKD ← 0`; salta
   directamente al paso `sigue` (§10). En conversación no se empuja ningún camino, de modo que al terminar `sigue`
   (por `wyg_l` con pila vacía) se pasa a `wy_choose`.
3. **Normal.** Si `WY_L = 2` (un camino balbuceado espera juicio): se camina `WY_C`. Si no:
   `d = dse_wish(WY_S, WY_N)`; si `r_randmod(2^20) < d` se camina `WY_W` (`WY_L ← 1`); si no, `wy_babble` y, si
   produjo uno, se camina `WY_C` (`WY_L ← 2`); si no produjo, `WY_W`.

### 9.3 Recorrido

`wyg_l` (`gen_leer.py:4122-4135`), repetido:

1. Si `WVS = 1022` (bits 1..9) o la pila `WY_SB` está vacía: `wy_choose` (§14).
2. Toma el marco superior (palabra, posición). Si la posición llegó al largo, lo desapila.
3. Siguiente letra `k`. Si `k > 9`, apila el camino `WY_VB[k − 10]`.
4. Si `k ≤ 9`: si el bit `k` de `WVS` ya está, sigue (cada paso habla una sola vez por respuesta); si no, lo pone
   y ejecuta el paso. Un paso que devuelve 0 vuelve a `wyg_l`; uno que devuelve 1 va a `wyg_ok`.

Las pilas, el alfabeto y los caminos archivados crecen al doble cuando se llenan (`wy_room`, `gen_leer.py:3933-3941`).

### 9.4 Escucha encadenada (`wyg_ok`)

`gen_leer.py:4325-4345`:

1. `wy_cand`: si `CNN < 12`, `CNN += 1` y guarda `D_OUT` y `WY_ST` en la ranura `CNN`. Restaura `D_OUT` desde la
   ranura 0.
2. Si `CNN < 2`: sigue el camino.
3. `D_WORDS ←` palabras del candidato nuevo (`WVJ` = su cantidad). Para cada candidato anterior `i`,
   `c_i = r_dlg_cover(i)` (cuántas de esas palabras dice). `CNT = Σ c_i`, `WVL = max c_i`. Se restauran las palabras
   de `D_RP`.
4. Si `CNT = 0` (no enlaza con ninguno) o `WVL ≥ WVJ` (algún anterior ya dice todas sus palabras): se descarta el
   nuevo (`CNN −= 1`) y se corta: `wy_choose`. Si no, sigue el camino.

### 9.5 Balbuceo y juicio de caminos

`wy_babble` (`gen_leer.py:3967-3999`):

1. Intenta primero `wy_seed` (`gen_leer.py:4034-4082`): dos líneas consecutivas de un libro elegido al azar, la
   silueta de la segunda contra la primera (cada palabra tomada o traída, `wy_sil`), contada en los pasos por
   costo; los 9 pasos ordenados de menor a mayor costo forman la semilla. Se descarta si ya es conocida
   (`wy_known`).
2. Si no hay semilla: hasta `(L + 1)·A + L·A + L` intentos (`L` largo del camino, `A = 9 + WY_VN` el alfabeto):
   elige al azar la operación (poner, cambiar, quitar; con `L = 0` sólo poner), la posición y la letra
   (1..A); el resultado se acepta si no es su camino ni uno archivado.

`wy_pay(j0)` (`gen_leer.py:4461-4471`), llamada desde `r_marco`:

- `WY_L = 1` (caminó su camino): `WY_N += 1`; si `j0`, `WY_S += 1`.
- `WY_L = 2` y `j0 = 0`: `WY_C` se archiva con motivo 1 (no pagado).
- `WY_L = 2` y `j0 = 1`: si `dse_wish(WY_S, WY_N) < dse_wish(1, 1)` (3/4), `WY_C` reemplaza a `WY_W`, el viejo se
  archiva con motivo 2, `WY_C` pasa a ser letra del alfabeto (`wy_vadd`) y `WY_N = WY_S = 1`; si no, `WY_C` se
  archiva con motivo 3.
- `WY_L ← 0`.

`wy_learn` (`gen_leer.py:4024-4028`): si `WY_ST ≠ 0`, el paso `WY_ST` aprende la silueta de `D_OUT` contra `D_RP`.

### 9.6 Paso `quien`

`r_dlg_quien` (`gen_leer.py:2083-2147`): el sujeto es la palabra de `D_RP` de mayor `r_winfo` entre las que aparecen
en 2 líneas o más; se recogen las palabras que lo siguen en sus libros (`dq_scan`, sala plástica de 32 entradas de
160 bytes que se duplica) y se arma: el sujeto como él lo escribió, hasta cuatro cláusulas separadas por `, `, la
primera la de la palabra que él mismo dijo, sin cláusulas cuyas palabras él ya dijo, hasta 900 bytes, y `.`;
opcionalmente encadenado (`dq_chain`, por deseo). El detalle de `dq_scan` y `dq_chain` queda fuera de este capítulo.

---

## 10. El paso `sigue` y el orden de fuentes

`gen_leer.py:4156-4324`. Es el único paso que se ejecuta en una conversación (`CONV = 1`). Marca `WY_ST ← 9`,
`SPAS ← 1`.

### 10.1 Algoritmo

```
pasada(SPAS):
  SOLO <- (SPAS == 1)
  EXN <- 0; SIGM <- 1; D_MODE <- 0
  r_dlg_answer                       # §8 con el filtro §8.6; en SPAS 2 recoge ejemplos §8.7
  SIGM <- 0; SOLO <- 0; BFOR <- 0
  si PENS == 0 o ANSW == 0: ir a LO_QUE_SIGUE
  si EXN > 0:
      si r_canto == 1: r_names_out; LG_FL <- 0; RESPONDIDO   # CNB no se fija antes: vale lo que dejó el turno previo (§2.8)
      ir a LIBROS                      # r_canto pudo dejar CNB = 2 y D_WORDS reducido
  si SPAS == 2: CNB <- 2; ir a LIBROS
  ir a LO_QUE_SIGUE

LIBROS (si CNB != 2: ir a REPONER):
  1. El Libro                          # §12.1
  2. El corazón                        # §13 con CNB = 2
  3. Todos los libros                  # §12.2-12.6
REPONER:
  CNB <- 0; D_WORDS <- palabras(D_RP); D_OUTL <- 0
LO_QUE_SIGUE:                          # §10.2
  si se obtuvo línea: r_names_out; RESPONDIDO
FALLA:
  si SPAS == 1: SPAS <- 2; repetir pasada
  PREGUNTAR                            # §10.3
```

Orden efectivo de fuentes cuando él pregunta (`PENS = 1`, `ANSW = 1`):

| Orden | Fuente | Condición de uso |
|---|---|---|
| 1 | La charla (`dialogo`): lo que sigue a la línea más parecida. | Pasada 1. |
| 2 | Las costumbres: ejemplos de todos los libros (línea parecida + línea siguiente) pasados por `r_canto`. | Pasada 2 con `EXN > 0`. |
| 3 | El Libro (etiqueta `libro`/`elibro`): sus oraciones sobre la palabra, tal como están. | `CNB = 2`. |
| 4 | El corazón (`HEART`). | `CNB = 2` y el Libro no respondió. |
| 5 | Los demás libros: lugares, regla, pistas y oraciones, ordenadas por cercanía al centro del corazón. | `CNB = 2` y el corazón no respondió. |
| 6 | Devolver la pregunta. | Ninguna respondió. |
| 7 | El camino completo (sin `sigue`). | Ya devolvió la pregunta en el turno anterior (`ASKD = 2`). |

Sin `ANSW` (el cuerpo sin pensador, o el estudio propio), sólo se usan "lo que sigue" en la charla y luego en los
libros, y después la pregunta.

### 10.2 Lo que sigue (`wysg_one`)

`gen_leer.py:4250-4311`. Requiere `D_OUTL ≠ 0` y `LG_FL ≠ 0`; la etiqueta no puede contener `-disco`. Abre el libro
`LG_FL`, se posiciona en el fin de la línea elegida (`LG_FL + 72`) y lee hasta 1000 bytes en `D_C`.

- **Charla** (`WVP ← 1`): línea por línea:
  - empieza con `vos: ` → su texto (tras 5 bytes) hasta el fin de línea es el candidato;
  - empieza con `luma: ` seguido exactamente de `D_RP` y luego `\n`, `\r` o `?` → era ella preguntando lo mismo:
    se pasa a la línea siguiente;
  - empieza con `luma: ` y otra cosa → falla;
  - otra línea → se pasa a la siguiente.
- **Libro**: desde el fin de la línea, se saltan bytes ≤ 32; si aparece `\n` seguido de `\n` o `\r` (línea vacía)
  falla; si no, los bytes hasta `\n`/`\r` son el candidato.
- Si el candidato es idéntico a `D_RP`: en la charla se lee la línea siguiente; en un libro falla.
- Si no: `D_OUT` ← candidato; `r_names_out` (§16.3); `LG_FL ← 0`; `wyg_ok`.

### 10.3 Devolver la pregunta (`wysg_ask`)

`gen_leer.py:4312-4324`:

- Si `CONV = 1` y `ASKD = 2`: `ASKD ← 0`, `CONV ← 0`, `WVS ← 1 << 9` (el paso `sigue` ya habló) y se camina el camino
  normal (§9.2 paso 3).
- Si `CONV = 1` y `ASKD ≠ 2`: `ASKD ← 1`.
- Si `D_RPL = 0`, no hay candidato y se vuelve a `wyg_l`. Si no, `D_OUT ← D_RP` (hasta 998 bytes); si su último byte
  no es `?`, se añade `?`. `LG_FL ← 0`; `wyg_ok`.

---

## 11. Las costumbres (`r_canto`)

`gen_leer.py:6628-6806`. Entrada: `EXN` ejemplos en `EXR`, `D_RP`, `CNB`. Salida: `j0 = 1` con la respuesta en
`D_OUT`, o 0.

### 11.1 Preparación

1. Crea `LNR` (0xC000) si no existe; escribe las etiquetas de `LN_LBL`; limpia `LN_LET`; `NMP = NMO = NMS = 0`.
2. **Ventana de la charla**: lee los últimos `TM_W = 4096` bytes de `dialogo` en `LNR + 0xA000`; `CNS` = bytes.
3. **Fichas**: por cada ejemplo `i`, `ln_line(línea_i)` y `ln_line(respuesta_i)` (líneas `2i` y `2i+1`); luego
   `ln_line(D_RP)` (línea `2·EXN`); `LN_LIN[NMS] ← NMP` (centinela).
   - `ln_line` emite una ficha de borde (huella 0, palabra −1), una ficha por palabra (cualquier largo) y otra de
     borde. Una palabra nueva recibe como clase su propio número. Máximos: 1000 fichas, 500 palabras.
4. **Regla del hueco** (`ln_class`, `gen_leer.py:6579-6597`): para cada par de fichas de palabra `i < j` (sin
   incluir la primera ni la última ficha global) con la misma huella anterior y la misma huella siguiente (los bordes
   valen 0, de modo que el inicio y el fin de línea también son vecinos), si sus clases difieren, toda palabra de la
   clase de `j` pasa a la clase de `i`. Es una sola pasada en orden.

### 11.2 Memoria exacta

`gen_leer.py:6658-6669`: si la secuencia de huellas de la línea de algún ejemplo es idéntica a la de `D_RP` (mismo
largo, mismas huellas, bordes incluidos), y su respuesta no fue dicha (`rc_said = 0`), esa respuesta, tal cual, es el
resultado (`j0 = 1`).

### 11.3 Bifurcación por `CNB`

| `CNB` al entrar | Siguiente |
|---|---|
| 5 (el Libro) | `CNB ← 1`; memoria cercana (§11.5). |
| 3 (oraciones por pistas) | `CNB ← 1`; canto (§11.6). |
| otro | Regla de cobertura (§11.4). |

### 11.4 Regla de cobertura de una costumbre por clase del hueco

`gen_leer.py:6690-6710`. Para cada ficha de `D_RP` cuya palabra tenga 4 bytes de texto o más (`LN_WRD+24 ≥ 4`), con
clase `κ`: está **cubierta** si en la **línea** (no en la respuesta) de algún ejemplo hay una ficha de clase `κ`.
Las no cubiertas se juntan en `D_WORDS` (en orden, con repetición posible).

- Si hay al menos una no cubierta: `D_NW ←` su cantidad, `CNB ← 2`, `j0 = 0`. El llamador busca esas palabras en los
  libros (§12).
- Si todas están cubiertas: `CNB ← 0` y memoria cercana (§11.5).

### 11.5 Memoria cercana

`gen_leer.py:6779-6806`. Entre los ejemplos cuya respuesta no fue dicha (`rc_said = 0`), elige el de menor cantidad
de fichas de palabra de su línea que no aparecen (por huella) en `D_RP`; en empate, el primero. Su respuesta, tal
cual, es el resultado.

Si todas fueron dichas: si `CNB = 0`, `CNB ← 1` y canto (§11.6); si `CNB ≠ 0`, uno al azar entre los `EXN`
(`r_randmod(EXN)`), aunque ya haya sido dicho.

### 11.6 Canto y regla de dos

`gen_leer.py:6711-6778`:

1. **Letras** (`ln_emit`): cada clase recibe una letra la primera vez que aparece, `WVM` = 1..26 → `a`..`z`;
   27..49 → bytes 192..214; desde la 50ª, la palabra no se emite. Cada letra va seguida de un espacio.
2. **Archivos**: `pares` con, por ejemplo, `P: ` + letras de la línea + `\n` + `R: ` + letras de la respuesta + `\n`;
   `canta` con las letras de `D_RP` y `\n`; `razona` con `1\n`; `cantado` vacío. Cada archivo se borra (pedido 12) y
   se crea al abrirlo.
3. **Lanzamiento**: pedido 45 con `(1 << 48) − 2` (firmas heredadas); pedido 16 con el valor 14 en los bits 32..63 y
   la etiqueta `luma/canto.bin`; si falla, memoria cercana. Pedido 34 con 50.000.000 instrucciones como límite;
   pedido 42 con `b = 0`. Luego repite el pedido 19 sobre el hijo mientras devuelva −1 (sin otra espera entre
   consultas).
4. **Lectura**: hasta 1000 bytes de `cantado` en `D_C`. Por cada byte ≥ 33 (letra cantada), se busca la clase `κ`
   cuya letra es ese byte (si no hay, se ignora):
   - Si en `D_RP` hay una ficha de clase `κ` y esa clase no aparece en ninguna ficha de los ejemplos (líneas y
     respuestas): se emite **esa palabra de él** (un particular, por ejemplo un nombre).
   - Si no, **regla de dos**: se cuentan los ejemplos cuya **respuesta** contiene una ficha de clase `κ`. Si son
     menos de 2, el canto se descarta y se va a memoria cercana (§11.5). Si son 2 o más, se emite la primera palabra
     de esa clase (la palabra número `κ`) y `WVM += 1`.
   - Cada palabra se escribe con su texto original y un espacio, en `LN_OUT`, hasta 990 bytes.
5. Si `WVM = 0` (sólo se emitieron palabras de él) o no se emitió nada: memoria cercana. Si no, `D_OUT ←` lo
   emitido sin el espacio final; `j0 = 1`.

El programa de canto guarda en `DICE` la huella de los bytes de `dados` si el archivo existe
(`razar/cardumen/memoria_pares.jsm:3629-3643`, `mp_dice`) y siembra su generador con
`0x123456789ABCDEF1 XOR DICE` (`razar/cardumen/memoria_pares.jsm:1383-1390`); el resto de su algoritmo pertenece al
capítulo 07.

---

## 12. El Libro y los demás libros: lugares, regla, pistas y oraciones

Se entra con `CNB = 2` y `D_WORDS` = las palabras que él pregunta (todas, o las no cubiertas de §11.4).

### 12.1 El Libro (`wysg_pa`)

`gen_leer.py:4183-4200`:

1. Crea `EXR` si hace falta; limpia el área `PL_*` (`PL_SIZE` bytes); `PL_TMP+80 ← 1`.
2. `EXN ← 0`; `r_dlg_answer` con `CNB = 2`, que sólo lee el Libro y recoge sus oraciones sobre la palabra (§12.3).
3. Si `EXN > 0`: `CNB ← 5`; `r_canto` (§11.3: memoria cercana sin canto). Si responde: `CNB ← 0`,
   `RD2 ← 0x7711`, `WY_ST ← 9`, `LG_FL ← 0`, `wyg_ok`.
4. Si no, `CNB ← 2` y se pasa al corazón (§13). Si el corazón responde: igual que en el paso 3.

### 12.2 Primera lectura: lugares y centro del corazón (`CNB = 2`)

Tras limpiar de nuevo el área `PL_*`, `EXN ← 0`, `r_dlg_answer` sobre todos los libros salvo la charla
(`gen_leer.py:4210-4214`). En cada palabra que cuenta (`dd_go`, `gen_leer.py:2674-2733`):

1. **Nitidez**: si `dh_wl(h) ≥ HF_T` (la palabra es de la mitad, §20.1) y no está en `D_WORDS`, no participa en
   lugares ni en el centro y es transparente: no pasa a ser la "palabra anterior". Como las palabras de menos de 4
   letras tampoco llegan aquí, los vecinos de una palabra son la palabra de 4+ letras no de la mitad que la precede y
   la que la sigue.
2. **Centro**: si el libro es del corazón (`PL_TMP+48 = 1`), su huella se inserta en `PL_HS`.
3. **Fin de oración**: si entre el fin de la palabra anterior y el inicio de la actual hay `.`, `?` o `!`, se olvida
   la palabra anterior.
4. **Lugar "después"**: si la palabra anterior es una de las preguntadas (`PL_PVX = 1`), se registra el lugar de
   clave `2·h_actual` con el texto de la palabra actual (`dd_place`: si existe, `veces += 1`; si no y hay menos de 64,
   se crea con hasta 32 bytes de texto).
5. Al encontrar una palabra preguntada (`dan_hit`, `gen_leer.py:2752-2763`): `PL_PVX ← 1` para la palabra siguiente;
   `PL_BK[D_LC & 255] ← 1`; si `PL_XL = 0`, guarda su texto (hasta 24 bytes) en `PL_XT`; **lugar "antes"**: si hay
   palabra previa, clave `2·h_previa + 1` con el texto desde el inicio de la previa hasta un byte antes de la actual
   (incluye las palabras cortas intermedias).
6. Oraciones sobre la palabra (§12.3), con `EXN < 6`.

### 12.3 Oración sobre la palabra

`gen_leer.py:2764-2802`. Una aparición de una palabra preguntada abre una oración si:

1. Retrocediendo desde la palabra hasta `.`, `?`, `!` o el inicio de línea, no hay una racha de 4 o más bytes que
   sean letra o dígito (ASCII `0-9A-Za-z` o byte ≥ 128): la palabra es la primera que cuenta.
2. El inicio se adelanta sobre espacios y guiones.
3. Avanzando desde el inicio de la palabra preguntada (incluida; no desde el inicio de la oración), se cuentan las
   rachas que llegan a 4 bytes ≥ 65 (una por racha); un byte 10 o 13 antes de `.`, `?`, `!` invalida (no es
   oración), igual que llegar a `BE`; el primer `.`, `?`, `!` la termina (incluido). El texto guardado va del inicio
   de la oración (paso 2) hasta ese signo.
4. Requiere al menos 2 rachas de 4+ bytes y largo menor que 480 bytes.

Con `CNB = 2` se guarda en la ranura `EXN` (bytes en +0, línea en +8 = 0, texto en +16) y `EXN += 1`, mientras
`EXN < 6`. Con `CNB = 30` se procesa como en §12.5.

### 12.4 La regla de los lugares (`r_describe`)

Si `PL_NT = 0` se salta a §12.6. Si no (`gen_leer.py:4215-4217`):

1. `CNB ← 6`; `r_dlg_answer` sobre los libros que hablan de la palabra. Segunda lectura (`dd_B`,
   `gen_leer.py:2721-2730`): para cada palabra actual `c` con palabra previa `p` dentro de la oración:
   - si `p` no es preguntada y existe el lugar `2·c` ("lo preguntado va seguido de `c`"), `p` ocupa ese lugar
     (`dd_word`: bit del lugar en su mapa; texto hasta 16 bytes);
   - si existe el lugar `2·p + 1` ("`p` precede a lo preguntado"), `c` ocupa ese lugar.
   Además, en cada libro, `PL_TWC[libro] += 1` por palabra contada y `PL_HWC[libro] += 1` si está en `PL_HS`.
2. `r_describe` (`gen_leer.py:2507-2573`):
   1. Restituye los mapas guardados (+40) de todas las palabras.
   2. Elige hasta 4 palabras: cada vez, la de más lugares (estrictamente más que 1, es decir al menos 2), que no sea
      una palabra que él dijo; guarda su mapa y lo pone a cero para la elección siguiente.
   3. Sin palabras: `j0 = 0`.
   4. Desplaza los ejemplos una ranura hacia abajo y `EXN += 1`; `PL_OL ← 0`.
   5. Escribe en la ranura 0 (hasta 470 bytes): `PL_XT`, luego `, ` + texto de cada palabra elegida, luego `:` y hasta
      4 lugares; cada lugar es el que más palabras elegidas ocupan (al menos 2), y se marca usado (`veces ← 0`); se
      escribe ` ` + texto del lugar, separados por `,`. Termina con `.`. Forma:
      `X, w1, w2: l1, l2.`
   6. Sin lugar compartido por 2: deshace el desplazamiento y `j0 = 0`.
3. Si no hubo regla: `CNB ← 14`, `r_dlg_answer` sobre los demás libros y `r_describe` otra vez. Si tampoco, §12.6
   con los ejemplos que haya.

### 12.5 Pistas y selección de oraciones (`CNB = 30`)

Si hubo regla (`gen_leer.py:4218-4241`):

1. `EXN ← 1` (la ranura 0 conserva la regla); `CNB ← 30`; `r_dlg_answer` sobre los libros que hablan de la palabra.
2. Para cada oración sobre la palabra (§12.3), **pistas** = cantidad de palabras de 4+ letras de la oración cuya
   huella es una palabra elegida por la regla o la huella vecina de algún lugar (`clave >> 1`), con repetición.
3. Conservación de las seis mejores (`dan_hC`, `gen_leer.py:2803-2841`): ranuras 1..6. Si `EXN < 7`, la oración va a
   la ranura `EXN` y `EXN += 1`. Si no, se busca la peor de las ranuras 1..6 y la nueva la reemplaza si es mejor.
   Cada ranura guarda el libro (+1000) y las pistas (+1008).
4. **Comparación `nr_gt`** (`gen_leer.py:2482-2497`): la oración `a` es mejor que `b` si su libro está más cerca del
   centro, `HWC_a / TWC_a > HWC_b / TWC_b` (comparado por productos cruzados; `TWC = 0` vale 1); en empate, si tiene
   más pistas.
5. Si `EXN ≥ 2`: la mejor de las ranuras 1..`EXN−1` se copia a la ranura 0 (reemplaza a la regla), la última pasa a
   ocupar el lugar de la mejor y `EXN −= 1`. Si `EXN < 2`, queda sólo la regla.

### 12.6 Respuesta desde las oraciones (`wysg_pd`)

`gen_leer.py:4242-4246`: si `EXN > 0`, `CNB ← 3` y `r_canto` (§11.3: canto primero; si no hay regla de dos,
memoria cercana, que con líneas vacías elige la primera no dicha, es decir la ranura 0; luego azar). Si responde:
`CNB ← 0`, `RD2 ← 0x7711`, `WY_ST ← 9`, `LG_FL ← 0`, `wyg_ok`. Si no, §10 `REPONER`.

---

## 13. El corazón responde (`r_dlg_heart`)

`gen_leer.py:3741-3830`. Salida: `j0 = 1` con la respuesta en `D_OUT`.

### 13.1 Preparación

1. Escribe las etiquetas de `HEART` en `D_HL` (24 bytes cada una). `BFOR ← 0`; `H_BEST = H_OL = H_K = H_TOT = 0`.
   Si `D_NW = 0`, `j0 = 0`.
2. Nombre: las huellas de las palabras de su nombre (`NMROOM + 64`, `NMLEN` bytes), hasta 4, en `H_NP`.
3. `H_TOT = Σ dh_wt(p)` sobre las palabras de 4+ letras de `D_RP` que no son de su nombre (§20.2).
4. `TH_PW ← dse_wish(D_CM+72, D_CM+64)`; `TH_W = TH_B = H_PS = H_CW = 0`.
5. Si `CNB ≠ 2` y `r_randmod(2^20) < TH_PW`: `H_PS ← 1`, `TH_W ← TH_PW` (el hilo desde el principio).

### 13.2 Libros y párrafos

Para cada libro de `HEART` que abre y no está vacío:

1. Lo lee entero. Título = primera línea (`H_TE`).
2. Si `lj_letter` (todas las palabras del título son de su nombre): es una carta a ella; se salta (y su huella queda en
   `LG_LT`).
3. Párrafo = líneas hasta una línea vacía. Por párrafo: `H_CNT = TH_C = H_PNW = 0`, `D_ID += 1`. Por línea,
   `dh_count` (`gen_leer.py:3848-3879`):
   - Una línea cuyo último carácter no espacio es `?` no cuenta.
   - Por cada palabra (cualquier largo) que no es de su nombre:
     - si está en `D_WORDS`: la línea "nombra" (`H_FL ← 1`); una vez por párrafo, `H_CNT += dh_wt`;
     - si no, y está en `TH_P` (el hilo): sólo la primera vez en el párrafo (marca `TH_M = D_ID`) la línea nombra y
       `H_CNT += dh_wt·TH_W >> 20`, `TH_C` igual; las repeticiones no hacen nada;
     - si no, y está entre las palabras del ánimo actual (`an_row`): con cuenta ≠ 0, igual que el hilo (marca en +16
       de la entrada del ánimo); con cuenta 0, nada;
     - si no, y es nítida (`dh_wl < HF_T`): `H_NW += 1` (palabra nueva).
   - Si la línea nombra: `H_PNW += H_NW`.
4. Al cerrar el párrafo (`gen_leer.py:3796-3803`) se descarta si `H_PNW = 0` (eco), si `H_CNT = 0`, o si `H_TOT ≠ 0`
   y `H_CNT = TH_C` (todo el peso viene del hilo o del ánimo). Si `2·H_CNT ≥ H_TOT`, entra al reservorio con peso
   `H_CNT`; si gana, `H_BEST ← H_CNT`, `TH_B ← TH_C`, se guarda libro y posición y se compone (`dh_say`).

### 13.3 Composición (`dh_say`)

`gen_leer.py:5356-5396`: en `D_C`, el título con `tu`/`tus`/`Tu`/`Tus` (como palabra entera) cambiados por
`mi`/`mis`/`Mi`/`Mis` (`dh_mine`), luego `: ` (o un espacio si el título ya termina en `:`), luego las líneas del
párrafo que nombran, unidas por `, ` (cada una pasada por `dh_mine`), mientras el largo sea menor que 900, y `.`.

### 13.4 Resultado y reintentos

- Si `H_BEST ≠ 0`, `2·H_BEST ≥ H_TOT` y `H_OL ≠ 0`: `D_OUT ← D_C`; `IM_K`, `IM_P`, `IM_ON ← 1` (tema abierto en ese
  libro, `tm_heart`); `TH_L ← 1` y `D_CM+64 += 1` si el hilo aportó (`TH_B ≠ 0`); `j0 = 1`.
- Si no y `CNB = 2`: `j0 = 0`.
- Si `H_PS = 0`: segunda pasada con el hilo (`H_PS ← 1`, `TH_W ← TH_PW`).
- Si `H_PS = 1`: si `D_KACT` y `D_KCLA` valen ambos 1, `j0 = 0`; si no, con `r_randmod(2^20) < TH_PW`, tercera pasada
  con `H_PS ← 2`, `TH_W ← TH_PW` y `H_TOT ← 0` (el hilo y el ánimo guían); si no, `j0 = 0`.
- Si `H_PS = 2`: `j0 = 0`.

---

## 14. Armonía entre candidatos (`wy_choose`)

`gen_leer.py:4352-4418`.

1. Si `CNN = 0`: ramas libres (`dsy_br2`, `gen_leer.py:3471-3477`): `dch_choose` elige una rama `b` (1..4) entre
   las habilitadas en `D_AV` (bit `b − 1`) por ruleta: pesos `w_b = dse_wish(D_CX[ctx·64 + 16(b−1) + 8],
   D_CX[ctx·64 + 16(b−1)])`, `r = r_randmod(Σ w_b)`, y gana la primera rama cuya suma acumulada supera `r`; con
   `Σ w_b = 0` devuelve 0 (`gen_leer.py:5594-5614`); 0 → `dse_none`; 1..3 →
   `r_dlg_talk`; 4 → `r_dlg_quien` y, si éste no produce nada, el cruce o la cita sobre `D_OUT` (`dsy_cx`) cuando
   `D_OUTL ≠ 0`, o `dse_none` si no.
2. `CNB ← 1`. Si `CNN = 1`: se toma ese candidato entero (`wych_take`).
3. Para cada candidato `i`: `n_i` = sus palabras de 4+ letras (en la ranura +16).
4. Consenso: `A_i = Σ_{j≠i} ⌊1024·s_ij / (n_i + n_j − s_ij)⌋`, con `s_ij` = palabras de `i` que `j` dice
   (`r_dlg_cover`), omitiendo los términos con denominador ≤ 0. `CNB ←` el de mayor `A_i`; en empate, el de menor
   índice.
5. **Tejido** (`gen_leer.py:4387-4416`): se parte del candidato `CNB`, posición 0; `CNX` = bytes de salida en
   `D_OUT`; `WVM` = candidatos usados; `WVJ` = saltos. Mientras `CNX < 1000`:
   - lee la palabra siguiente del candidato actual; si no hay, copia el resto y termina;
   - si entre la posición actual y la palabra hay `.`, `?` o `!` y `CNX > 0`, copia hasta el signo incluido y termina;
   - copia hasta el fin de la palabra;
   - si la palabra tiene 4+ letras, busca en orden un candidato no usado que la contenga y no termine en ella; si lo
     hay, continúa en ese candidato después de esa palabra (`WVJ += 1`).
6. Si `WVJ = 0`, se toma el candidato `CNB` entero. En ambos casos `WY_ST ←` el paso del candidato `CNB`.

---

## 15. Síntesis final e imaginación

### 15.1 `wych_fin`

`gen_leer.py:4419-4460`:

1. Si `RD2 = 0x7711`: `RD2 ← 0` y no se imagina (respuesta de lo que sus libros dicen de lo preguntado: el Libro, el
   corazón con `CNB = 2` o las oraciones por pistas).
2. Si `CNN = 0`: no se imagina.
3. Ventana: crea `WVW` si no existe. Con `ANSW = 1` usa el archivo `WHOR` (`trato-…`) y, si su tamaño es 0, la
   charla `dialogo`; sin `ANSW`, `dialogo`. Si el archivo no abre, la ventana queda vacía. Lee sus últimos 4096 bytes
   en `WVW`.
4. Reemplaza temporalmente `H_BUF`/`H_SZ` por esa ventana; `IGK ← IG_N`; `IGF ← ANSW`.
5. Llama a `im_imagine` `CNN` veces sobre `D_OUT`.
6. Restituye `H_BUF`/`H_SZ`; `IGF ← 0`; si `IG_N > IGK`, `IG_N ← IGK + 1` (una imaginación por respuesta, aunque
   cambie varias palabras).
7. Si `CONV = 0`: `wy_learn`.
8. `D_LMODE ← 2`; `D_MC_N2 += 1`; `dse_has` (§16).

### 15.2 `im_imagine`

`gen_leer.py:4794-4889`. Entrada: `D_OUT` y la ventana `H_BUF`/`H_SZ`.

1. **Deseo**: `d = dse_wish(IG_S, IG_N)`; si `r_randmod(2^20) ≥ d`, termina (salvo con la bandera de prueba
   `LUMA_IMAGINA`).
2. **Fichas de la ventana**: sala `IG_T` de `(H_SZ + 4)·32` bytes; cada ficha: huella (+0), inicio (+8), fin (+16),
   "lleva algo" (+24 = 1 si `dh_wt > 0` y no es de su nombre). Cada fin de línea es una ficha de huella 0 (dos
   seguidas se funden en una); hay una al principio y otra al final.
3. **Roles compartidos**: para cada palabra `u` de `D_OUT` con `dh_wt > 0` que no es de su nombre, para cada ficha
   `i` (1..`IG_TN−2`) de la ventana con huella `u`, sean `a` y `b` las huellas anterior y siguiente; para cada ficha
   `j` con "lleva algo", huella distinta de `u`, anterior `a` y siguiente `b`: es un candidato. `IG_C += 1` y, si
   `r_randmod(IG_C) = 0`, se queda con él (posición de `u` en `D_OUT` y ficha `j`): cada par (aparición, palabra)
   tiene la misma probabilidad.
4. Sin candidatos: termina. Si el texto nuevo (`D_OUT` con `u` reemplazada por el texto de `j`) llega a 1000 bytes,
   termina.
5. **Cláusula**: desde el signo anterior a la palabra nueva hasta el signo siguiente, sin espacios en los bordes; un
   signo es un byte < 128 que no es letra ASCII, dígito ni espacio (`ig_mark`).
6. **Nunca leído**: si la cláusula está en la ventana, termina. Si `IGF = 0`, también termina si está en algún libro o
   en la charla (`ig_books`: lee cada uno en trozos de 65536 bytes más el largo de la cláusula).
7. **Imaginado**: añade a `imaginado` la línea `cláusula | palabra_vieja > palabra_nueva\n`; pensamiento
   `imagine: ` + cláusula (hasta 600); `D_OUT` ← texto nuevo; `IG_L ← 1`; `IG_N += 1`.

### 15.3 Cuándo se apaga

| Condición | Fuente |
|---|---|
| `RD2 = 0x7711` (respuesta desde el Libro, el corazón con `CNB = 2` o las oraciones). | `gen_leer.py:4429` |
| `CNN = 0`. | `gen_leer.py:4431` |
| Azar mayor o igual que el deseo `(IG_S + 1/2)/(IG_N + 1)`. | `gen_leer.py:4797` |
| Ningún rol compartido en la ventana. | `gen_leer.py:4839` |
| Texto resultante de 1000 bytes o más. | `gen_leer.py:4842` |
| La cláusula ya está escrita (ventana; y, sin `IGF`, libros y charla). | `gen_leer.py:4861-4863` |

La imaginación se paga en `r_marco` (§6.3, `IG_S += 1`) si el marco de confianza da 1 en el turno siguiente.

### 15.4 Tema e improvisación (pasos 2 y 3)

- `r_dlg_impro` (`gen_leer.py:4746-4787`): si `IM_ON = 0`, `j0 = 0`. Si no son a la vez `D_KACT = D_KCLA = 1`, decide
  por `dse_wish(D_CM+88, D_CM+80)`. `lj_stay` (§19.5). Abre el tema (`TM_L`), lee hasta 4096 bytes desde `IM_P` y, si
  cayó a mitad de línea, empieza en la siguiente; salta líneas vacías; junta las líneas del párrafo siguiente con
  `, ` (con `dh_mine`) hasta 800 bytes, y `.`. `D_OUT ←` eso; `IM_P` avanza; `IM_L ← 1`; `D_CM+80 += 1`;
  `im_imagine` (con `IGF = 0`). Al fin del libro, `IM_ON ← 0`.
- `r_dlg_heart_own` (`gen_leer.py:4686-4705`): hasta 2 intentos (`H_CW ← 2`): si hay tema y `LG_NEW = 1`,
  `LG_NEW ← 0`, `lj_pass`, y el tema se cierra si `lj_keep = 0`; si no hay tema, `tm_pick` elige, entre las entradas
  de la lista que son `libro…`, `elibro…` o `dialogo` (no de disco), una por reservorio con peso
  `lj_weight(libro, dse_wish(S, N))` (etiqueta de menos de 48 bytes) y una posición al azar en `[0, tamaño)`
  (`IM_P`, `IM_ON ← 1`, `TM_S ← 1`); luego `r_dlg_impro_go`.

---

## 16. Salida (`dse_has`)

`gen_leer.py:3508-3520`:

1. `r_dlg_vary` (§17).
2. `r_bridge` (§16.2).
3. `r_mus_sing` (capítulo 10).
4. `lj_last`: `LG_LA ← D_OUT` (hasta 1000), `LG_LL`.
5. `th_add(D_OUT)` (al intercambio que empieza); `an_add(D_OUT)`.
6. `D_LBR ← 4`; `dcx_said`: `D_CX[ctx·64 + 48] += 1` (N de responder en el contexto actual), `D_LCX ← ctx`.
7. `quien ← 5` (`luma (cita): `) si `D_LMODE = 1`, si no 1 (`luma: `); `r_dlg_write(quien, D_OUT)`.
8. `D_AWAIT ← 1`; `r_dlg_save`; `CHANGED ← 1`.

### 16.1 `r_dlg_write`

`gen_leer.py:2034-2070`. Prefijos: 0 `vos: `, 1 `luma: `, 2 `luma: (eligio no contestar)`,
3 `luma: (no encontro con que contestar)`, 4 `luma (une): `, 5 `luma (cita): `, 6 `libro: `. Con 2 y 3 no se escribe
texto. Orden: `D_SCR0 ← 0`, `r_letra_text`, `lj_flowback`, `lj_answer` (§19.7), `lj_note`. Destino: `dialogo`; si
`GREET`, la etiqueta `GA["MCL"]` (7 bytes: `me-comi`, `gen_leer.py:7587`); si `SF_ON`, `charla-libros`. Se posiciona
al final (`r_file` 38 con `j11 = −1`) y escribe: prefijo, texto y `\n`. `r_dlg_write` no consulta el valor que
devuelve `lj_note`.

`r_dlg_save` (`gen_leer.py:2004-2010`) llama antes a `r_cable_flush` y `r_gustos_save` (fuera de este capítulo);
luego borra (pedido 12) y reescribe `charla` con: `D_NC..D_SH` (32 bytes), `D_MC..D_MC_S2` (32),
`D_BN0..D_BS2` (48), `D_PM`, `D_CX` y `D_CM` (48 + 2048 + 96).

### 16.2 Puente de idioma (`r_bridge`)

`gen_leer.py:3521-3564`. Sólo si `BFOR = 1` (la última línea elegida en modo 0 vino de un libro cuya firma de él es
menos probable que en un libro promedio) y no habla un libro (`SF_ON = 0`):

1. `D_AA ← D_OUT`; `D_WORDS ←` palabras de `D_OUT`; `BRG ← 1`; `r_dlg_answer` en modo 0 (sólo libros de su idioma,
   §8.2 paso 4); `BRG ← 0`; `D_WORDS ←` palabras de `D_RP`.
2. Si no hay línea, o una contiene a la otra: `D_OUT ← D_AA`.
3. Si no: `D_OUT ←` `D_AA` (hasta 600 bytes) + ` (en tu idioma: ` + línea hallada (hasta 990 en total) + `)`.

### 16.3 Nombres prestados (`r_names_out`)

`gen_leer.py:6807-6845`. Se aplica a lo que sigue a una línea (§10.2) y a la respuesta de una costumbre (§10.1). En
`D_OUT` se quita:

- toda palabra de su nombre (`dh_isname`, con las huellas de `H_NP` de la última llamada a `r_dlg_heart`);
- todo nombre entre comas: palabra precedida por `, `, que empieza con mayúscula ASCII y va seguida por `.`, `,`,
  `!`, `?`, `;` o por el final.

Junto con la palabra se quitan los espacios y la coma anteriores; si era lo primero, los espacios y comas
siguientes. Si no queda nada, `D_OUT` se deja como estaba.

---

## 17. No repetir

| Mecanismo | Qué compara | Efecto | Fuente |
|---|---|---|---|
| `lj_said` | La línea en lectura contiene `LG_LA` (lo último que dijo). | Esa línea no puede ser la mejor. | `gen_leer.py:5161-5164`, `gen_leer.py:2876` |
| `rc_said` | Una respuesta de ejemplo está dentro de los últimos 4096 bytes de `dialogo` (`CNS > 0`). | Memoria exacta y memoria cercana la saltan; el azar final no la mira. | `gen_leer.py:6621-6627`, `gen_leer.py:6666`, `gen_leer.py:6784` |
| `r_dlg_vary` | `D_OUT` aparece literal en todo `dialogo`. | Se cruza con otra línea (`r_dlg_cross`); si hay cruce, se dice el cruce. | `gen_leer.py:5442-5463` |
| Eco en el corazón | Párrafo sin palabras nítidas nuevas en sus líneas que nombran. | El párrafo no responde. | `gen_leer.py:3799` |
| Escucha encadenada | Un candidato cuyas palabras ya dice otro. | Se descarta y se corta el camino. | `gen_leer.py:4342-4345` |
| `wy_known` | Un camino balbuceado igual a su camino o a uno archivado. | No se vuelve a probar. | `gen_leer.py:3952-3957` |

`din_in` (`gen_leer.py:5470-5481`) es la búsqueda literal por bytes usada por todas ellas.

---

## 18. La lluvia como dados

`r_rain_dice` (`gen_leer.py:6896-6909`) se llama sólo en `pna_send` (§3.2), es decir cuando la pregunta va al
pensador. Si `RAINR ≠ 0`: borra (pedido 12) y crea `dados` y escribe en él `RNLN × RLW` bytes de `RAINR`, la grilla de
dígitos hexadecimales de la lluvia tal como está (espacio donde no cayó nada).

Estructura de `RAINR` (`gen_leer.py:6846-6851`, `gen_leer.py:6916-6943`): `RNLN × RLW` bytes de dígitos (fila por
fila, iniciados en 32), luego `RLW` bytes con la fila de la gota de cada columna (255: sin gota). `RLW = 52`;
`RNLN = PY // 9 + PNR`, con `PY` y `PNR` del panel (capítulo 10; valores numéricos no verificados aquí);
`RQ = RNLN // 4`.

`r_rain_push(j2, j3)`: cada 26 bytes de entrada es un paso (`RAINN += 1`). En cada paso, para cada columna `x`
(0..51), con `n = min(26, bytes restantes)` y el byte `v = src[((x >> 1) + RAINN) mod n]`:

- sin gota: empieza una (fila 0) si `(v + RAINN + x) & 7 = 0` (`RSTART = 8`, valor de criterio sin medición en el
  código);
- con gota: baja una fila; pasadas `RNLN + RQ + 1` filas, la columna queda sin gota;
- si la fila de la gota es menor que `RNLN`, en ella se escribe el nibble alto de `v` (columna par) o el bajo
  (columna impar) como dígito hexadecimal.

La lluvia sólo avanza cuando entran bytes (pensamientos, registros de criaturas), no por reloj. El programa de canto
usa la huella de `dados` en su semilla (§11.6), de modo que sus decisiones al azar dependen del estado de la lluvia en
el momento de la pregunta.

---

## 19. Firmas de idioma (`lj_*`)

### 19.1 Modelo

- Símbolo (`lj_sym`, `gen_leer.py:4928-4939`): 0..25 letra `a`..`z` (cualquier caja), 26 espacio o tabulador, 27 byte
  ≥ 128, 28 dígito, 29 byte 10 o 13, 30 cualquier otro.
- Contexto: los dos símbolos anteriores, `w = ((w << 5) | s) & 1023`; inicial 957 (`29·32 + 29`, dos fines de línea).
- Firma de un libro: `C[w][s]` (32·32·32 qwords, `VC = 262144` bytes) y `T[w]` (32·32 qwords, desde `VC`; total
  `VB = 270336` bytes), contados sobre todo el libro leído en trozos de 65536 bytes (`lj_voice`, `gen_leer.py:4983-5010`).
- Costo de un símbolo en 1/64 de bit (`lj_cost`, `gen_leer.py:5011-5022`):
  `log2(2·T[w] + 32) − log2(2·C[w][s] + 1)`, es decir `−log2((C + 1/2)/(T + 16))` (Krichevsky-Trofimov sobre 32
  símbolos). `rwi_log` da `log2` en 1/64 de bit: `(bits − 1)·64` + los 6 bits siguientes al más alto
  (`gen_leer.py:1007-1019`).
- Tabla de libros `LG_TB`: entradas de 64 bytes: huella (+0), tamaño (+8), costo acumulado del texto de él (+16,
  inicial `2^50`), puntero a la firma (+24). Persiste en `lenguas`: por libro 32 bytes de cabecera y `VB` bytes
  (`gen_leer.py:5120-5145`).

### 19.2 Texto de él (`lj_hist`)

`gen_leer.py:4965-4982`: cada turno añade `D_IN` y `\n` a `LG_TX` (sala que crece al doble más 256), `LG_TXN` bytes;
`LG_NEW ← 1`.

### 19.3 Pasada (`lj_pass`)

`gen_leer.py:5023-5081`:

1. `LG_ON ← 0` si `LG_TXN = 0` (no escribió nada todavía); si no, 1.
2. Costo de un cambio de hablante `W = log2(LG_T + 1) + log2(max(LG_N, 1))` (1/64 de bit); `LG_AM ←` el mínimo
   anterior.
3. Para cada libro de la lista (libro o charla según `ig_isbook`, bajo la rama actual, que no sea la charla): obtiene
   su firma. Llama a `lj_voice` si el libro no tiene entrada o firma, o si su índice en la lista es `LG_VR`;
   `lj_voice` la cuenta de nuevo sólo si no tenía firma o si el tamaño del archivo cambió (`gen_leer.py:4988`). Si hay texto nuevo desde
   `LG_DN`: `total ← min(total, LG_AM + W) + costo(texto nuevo)` (reparto fijo de Herbster y Warmuth). Lleva el mínimo
   `LG_MIN` y el libro `LG_BI`.
4. `WHOR ←` `trato-` + etiqueta de `LG_BI` (hasta 118 bytes).
5. `LG_VR ← (LG_VR + 1) mod ULN`. Si hubo texto nuevo: `LG_DN ← LG_TXN`, `LG_T += 1`.
6. Segunda vuelta: `LG_NB` = libros con entrada; `LG_S = Σ 2^(20 − d)` con `d = (total − LG_MIN) >> 6` bits enteros,
   para `d ≤ 20`.

### 19.4 Uso de la firma

| Rutina | Resultado | Fuente |
|---|---|---|
| `lj_weight(libro, p)` | Carta a ella: 0. `LG_ON = 0`: `p`. Charla o libro sin firma: `p · LG_S / (LG_NB · 2^20)`. Si no: `p >> d` (0 si `d ≥ 40`). | `gen_leer.py:5085-5098` |
| `lj_his(libro)` | 1 si es carta, sin firma, `LG_ON = 0`, `total < LG_MIN`, o `2^(20−d) · LG_NB ≥ LG_S`; si no 0. | `gen_leer.py:5110-5119` |
| `lj_keep` | Lo mismo para el tema; una carta nunca es tema (0). | `gen_leer.py:5099-5109` |

### 19.5 Tema y firma

`lj_stay` (`gen_leer.py:5206-5210`): si `LG_NEW = 1`, lo pone a 0, ejecuta `lj_pass` y, si `lj_keep = 0`, cierra el
tema (`IM_ON ← 0`).

### 19.6 Hilo abierto

| Rutina | Regla | Fuente |
|---|---|---|
| `lj_pull` | 1 si no hay respuesta única, o si `D_RP` tiene una palabra que no está en su nombre, es nítida (`dh_wl < HF_T`) y no está en su respuesta única. | `gen_leer.py:5283-5299` |
| `lj_asks` | 1 si el último carácter no espacio de `D_RP` es `?`. | `gen_leer.py:5300-5309` |
| `lj_about` | Pone su respuesta única (hasta 1000) en lugar de `D_RP`, ejecuta `r_dlg_quien` y restituye `D_RP`. | `gen_leer.py:5310-5332` |
| `lj_follow` | El tema pasa a ser el libro de `LG_FL`, desde el fin de esa línea. | `gen_leer.py:5275-5282` |

### 19.7 Respuesta única y flujo

`lj_answer` (`gen_leer.py:5245-5266`): cada línea con `quien = 1` se añade, separada por un espacio, a la respuesta
única `LG_RB`/`LG_RN`; si `LG_RW = 1` (él habló), primero se vacía. Es lo que `lj_rlen`/`lj_rptr` entregan a
`respuesta`. `lj_think` escribe un paso en el flujo de pensamiento guardando antes el flujo; `lj_flowback` lo
restituye al hablar ella (`gen_leer.py:5211-5236`).

---

## 20. La mitad y el peso de una palabra

### 20.1 `dh_wl` y `dh_half`

- `dh_wl(h)` (`gen_leer.py:3880-3888`): líneas de sus libros que tienen la palabra (`L` de `WFT`), 0 si nunca se vio.
- `dh_half` (`gen_leer.py:3889-3911`): sólo si `WFN + 1 ≠ HF_N`. `HF_T ← 2^62` (ninguna es de la mitad) y, si hay
  tabla, `HF_T` = el mayor `c` tal que `2 · masa(c) ≥ masa(1)`, donde `masa(c) = Σ L` de las palabras con `L ≥ c`;
  búsqueda binaria en `[1, WFN + 1]`. Una palabra es **de la mitad** si `dh_wl ≥ HF_T`; **nítida** si no.

### 20.2 `r_winfo` y `dh_wt`

- `r_winfo(h)` (`gen_leer.py:990-1006`): `(2S + 1)·(WFN + 1)·1000 / ((L + 1)·(2L + 1))`, al menos 1; 1000 si `L = 0`;
  sin tabla, devuelve las letras.
- `dh_wt` (`gen_leer.py:4677-4681`): `max(r_winfo − 1000, 0)`.

---

## 21. Archivos de la casa que toca este capítulo

| Etiqueta | Acceso | Formato |
|---|---|---|
| `pregunta` | Cuerpo escribe, pensador lee. | Texto de él, hasta 1000 bytes. |
| `respuesta` | Pensador escribe, cuerpo lee. | Respuesta única. |
| `dialogo` | Añadir; leer como libro. | Líneas `prefijo + texto + \n` (§16.1). |
| `charla-libros` | Añadir. | Igual, cuando un libro le habla. |
| `trato-<libro>` | Añadir; ventana de imaginación. | `vos: …\nluma: …\n` por turno. |
| `charla` | Reescribir. | Cuentas (§16.1). |
| `imaginado` | Añadir. | `cláusula \| vieja > nueva\n`. |
| `imagina` | Reescribir. | `IG_N`, `IG_S` (16 bytes) (`gen_leer.py:4788-4793`). |
| `pares`, `canta`, `razona`, `cantado` | Reescribir / leer. | §11.6. |
| `dados` | Reescribir. | Grilla de la lluvia (§18). |
| `lenguas` | Leer / reescribir si cambió. | §19.1. |
| `caminos`, `siluetas` | Leer / reescribir. | Caminos y siluetas (`gen_leer.py:4474-4518`, `gen_leer.py:4083-4097`). |
| `libro`, `elibro`, `libro…`, `elibro…` | Leer. | Texto en líneas. |

---

## 22. Límites y constantes

| Constante | Valor | Dónde | Observación |
|---|---|---|---|
| Entrada tipeada | 1000 bytes (escribe si `largo + 4 < 1000`) | `gen_leer.py:5954`, `gen_leer.py:5960` | Sin derivación en el código. |
| Palabras dichas `D_WORDS` | 120 | `gen_leer.py:2075` | Idem. |
| Palabra que cuenta | ≥ 4 letras | `gen_leer.py:2074` | Idem. |
| Ortografía: largo de palabra | 4..32 letras | `gen_leer.py:3305` | Idem. |
| Ortografía: mínimo de líneas | 2 | `gen_leer.py:3309` | Idem. |
| Ortografía: trozo del Libro | 4096 bytes | `gen_leer.py:3259` | Idem. |
| Ejemplos (costumbres) | 7 | `gen_leer.py:2856` | Idem. |
| Oraciones con `CNB = 2` | 6 | `gen_leer.py:2764` | Idem. |
| Oraciones por pistas | 6 (+ la ranura 0) | `gen_leer.py:2827` | Idem. |
| Largo de ejemplo / oración | 480 bytes | `gen_leer.py:2798`, `gen_leer.py:2864`, `gen_leer.py:2866` | Idem. |
| Enunciado de la regla | 470 bytes | `gen_leer.py:2499` | Idem. |
| Lugares | 64 (uno por bit de qword) | `gen_leer.py:2459` | Impuesto por el mapa de 64 bits. |
| Texto de lugar / palabra / preguntada | 32 / 16 / 24 bytes | `gen_leer.py:2460`, `gen_leer.py:2473`, `gen_leer.py:2755` | Sin derivación. |
| Tabla de palabras de lugares | 4096 ranuras, 8 pruebas | `gen_leer.py:2439`, `gen_leer.py:2468` | Idem. |
| Centro del corazón | 1024 ranuras, 8 pruebas | `gen_leer.py:2442`, `gen_leer.py:2692` | Idem. |
| Libros indexados por `PL_BK`, `PL_HWC`, `PL_TWC` | 256 (`D_LC & 255`) | `gen_leer.py:2639`, `gen_leer.py:2700` | Libros con índice ≥ 256 comparten entrada. |
| Palabras / lugares de la regla | 4 / 4 | `gen_leer.py:2516`, `gen_leer.py:2552` | Sin derivación. |
| Fichas / palabras del canto | 1000 / 500 | `gen_leer.py:6560`, `gen_leer.py:6573` | Idem. |
| Clases con letra | 49 | `gen_leer.py:6604` | 26 ASCII + 23 bytes 192..214. |
| Regla de dos | 2 respuestas | `gen_leer.py:6773` | |
| Límite del canto | 50.000.000 instrucciones | `gen_leer.py:6733` | |
| Candidatos | 12 | `gen_leer.py:4348` | Sin derivación. |
| Salida | 1000 bytes (tejido, copias) | `gen_leer.py:4389` | Idem. |
| Hilo | `TH_K = 24` huellas | `gen_leer.py:389` | Idem. |
| Ánimo | 64 palabras × 24 bytes por ánimo, 8 ánimos | `gen_leer.py:426-428` | Idem. |
| Ventana de tema / charla | `TM_W = 4096` bytes | `gen_leer.py:445` | Idem. |
| Trozo de búsqueda en libros | `IG_CH = 65536` bytes | `gen_leer.py:529` | Memoria, no medición. |
| Composición del corazón | < 900 bytes | `gen_leer.py:5370` | Sin derivación. |
| Improvisación | 800 bytes | `gen_leer.py:4771` | Idem. |
| Gustos | 256 libros | `gen_leer.py:412` | Idem. |
| Escala del deseo | 2^20 | `gen_leer.py:3505` | |
| Lluvia | `RLW = 52`, `RSTART = 8` | `gen_leer.py:6434`, `gen_leer.py:6531` | `RSTART` es criterio. |

---

## 23. Banderas de construcción de prueba

| Variable | Efecto | Fuente |
|---|---|---|
| `LUMA_RESPONDE` | Responde siempre. | `gen_leer.py:3435` |
| `LUMA_CALLA` | No decide por azar; siempre calla. | `gen_leer.py:3437` |
| `LUMA_IMAGINA` | Toca el tema enseguida; imagina sin consultar el deseo. | `gen_leer.py:3468`, `gen_leer.py:4795` |
| `LUMA_CONTESTA` | La rama "responder" siempre que esté disponible. | `gen_leer.py:5602` |
| `LUMA_SEGUIR` | La rama "seguir" siempre que esté disponible. | `gen_leer.py:5605` |
| `LUMA_CADENA` | Encadena siempre en `r_dlg_quien` (`D_CMODE ← 1`). | `gen_leer.py:2159` |
| `LUMA_LIBRE` | El cruce toma siempre el modo libre (`D_XMODE ← 1`). | `gen_leer.py:5495` |

---

## 24. Observaciones de verificación

Hechos del código que un mantenedor debe conocer:

1. **`D_CM` reasignado.** `D_CM` vale 0x2800 en `gen_leer.py:301` y 0x6830 en `gen_leer.py:346`; rige el segundo.
   `r_dlg_seam` llama a `r_dlg_cover` con `j9 = D_CM` como sala de marcas (`gen_leer.py:5428`), lo que escribe
   `D_NW` qwords (hasta 120) a partir de `D_CM`, encima de las cuentas de encadenar, cruzar, hilo e improvisar
   (`D_CM+0..+95`) y de lo que sigue (`D_BASN`, `D_REFS`, ...).
2. **Espera activa del canto.** El bucle `rc_w` repite el pedido 19 sin pausa mientras el hijo corre
   (`gen_leer.py:6735-6736`).
3. **`lj_note` sin efecto en `r_dlg_write`.** Su resultado `j0` no se consulta (`gen_leer.py:2039-2041`).
4. **Nombres en `r_names_out`.** Usa `H_NP`/`H_NN` de la última ejecución de `r_dlg_heart`; en una conversación que
   no pasó por el corazón usa los de un turno anterior, o ninguno si nunca se ejecutó desde la carga.
5. **`D_LC & 255`.** Con más de 256 libros, las tablas por libro de §2.3 se comparten entre libros cuyo índice difiere
   en múltiplos de 256.
6. **Tabla de lugares llena.** Una palabra que no encuentra ranura en 8 pruebas se pierde sin aviso
   (`gen_leer.py:2471`).
7. **Bytes, no caracteres, en §12.3.** Las rachas de 4 que deciden si una oración es "sobre la palabra" cuentan
   bytes ≥ 65; una letra UTF-8 de dos bytes cuenta dos.
8. **`CNB` residual.** `CNB` no se reinicia al empezar el turno (§2.8). Si `wy_choose` eligió en el turno anterior
   el candidato 2, 3, 6, 7, 10 u 11, `CNB & 2` es verdadero en la siguiente `dsy_look` y en la pasada 1 de `sigue`:
   `r_dlg_answer` salta la charla y el árbol y, si existe `EXR`, escribe en el área `PL_*`; con `SOLO = 1` (pasada 1)
   no queda ningún libro que leer. En §10.1, un residuo de 3 o de 5 desvía `r_canto` al canto o a la memoria cercana
   en lugar de la regla de cobertura (`gen_leer.py:6686-6688`). En una conversación de un solo candidato `CNB = 1`
   y no hay efecto.
9. **Copias sin límite en `dh_mine`.** `dh_mine` (`gen_leer.py:5377-5396`) no acota lo que escribe. El título de
   §13.3 se copia entero a `D_C`, y en §15.4 la condición de 800 bytes se mira antes de añadir cada línea, que luego
   se copia entera (hasta `TM_W` bytes). Una línea que no cabe en los 1000 bytes de `D_C` (0x2C00) escribe sobre
   `D_BEST` (0x3000) y lo que sigue; las copias finales a `D_OUT` (`gen_leer.py:3813-3815`, `gen_leer.py:4775-4777`)
   tampoco se acotan a 1000.
10. **`or_pairs` con la etiqueta `libro`.** Si abre `libro`, el código salta directamente a la lectura
    (`gen_leer.py:3253`, `jjnn j9, opb_rd`) sin medir el Libro ni poner `OS_BC`/`OS_BL`: los trozos se piden con los
    valores que haya en `EXR + 1064` y `EXR + 1072` (zona de la ranura de ejemplo 1). Sólo la rama `elibro` mide el
    tamaño (`gen_leer.py:3256`). Como el indicador de "ya leída" queda en 1, la tabla no se vuelve a construir
    (efecto concreto según el contenido previo de esa zona: no verificado).
11. **Palabras no cubiertas sin tope.** §11.4 escribe en `D_WORDS` una entrada por cada ficha no cubierta de `D_RP`
    sin comparar con 120 (`gen_leer.py:6705-6708`); más de 128 entradas alcanzarían las marcas de `D_WORDS + 1024`.

---

## 25. Puntos no verificados

- Direcciones concretas de las variables globales con nombre (`EXR`, `CNB`, `LNR`, ...), asignadas por el generador.
- Construcción de la tabla `WFT` (`bu_wcount`) y significado exacto de `S` fuera de la fórmula de `r_winfo`.
- Valores numéricos de `PY`, `PNR` y por lo tanto `RNLN` de la lluvia.
- Algoritmo interno de `luma/canto.bin` (`memoria_pares.jsm`) más allá de la mezcla de `dados` en su semilla.
- Si la charla `dialogo` está ubicada en el árbol de temas, lo que decide si `ar_in` la excluye en la búsqueda normal.
- Detalle de `dq_scan`, `dq_chain`, `r_dlg_cross`, `r_dlg_own`, `r_dlg_cite`, `r_dlg_talk` y `r_mus_sing`.
