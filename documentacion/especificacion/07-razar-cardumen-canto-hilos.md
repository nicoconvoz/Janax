# 07. Razar: cardumen, canto (memoria_pares), hilos y nitidez

**Alcance.** Este capítulo especifica los programas de `razar/cardumen/` que trabajan sobre lo que Razar ya leyó: el
canto de `memoria_pares.jsm` (núcleo de pares pregunta-respuesta, modelo de Markov de contexto variable con la regla de
dos, semilla, dados y archivo `cantado`), el razonador de relaciones `hilos.jsm` (la mitad, las formas como
relaciones, el while de hipótesis, la deducción, lo sabido, lo pendiente, los testigos, la imaginación y la nitidez por
lugares con sus diarios `lugares0`/`lugares1`/`nitidas`), el cubo de piezas (`cardumen*.jsm`) y las voluntades que lo
manejan (`voluntad*.jsm`) con su protocolo madre/hijo por palabras, el encadenador `encadena.jsm` y los jueces externos
de `razar/jueces/`. No cubre: la sintaxis y semántica de las instrucciones Janax ni las macros `jwhile`/`jcall0`
(capítulo 01), el ensamblador PDP, `armar.sh` y la redefinición de constantes (capítulo 02), procesos, salas y remeros
(capítulo 03), el detalle de cada pedido del núcleo (capítulo 04), pantalla y teclado (capítulo 05), el lector de libros
`lectura.inc`, `sentido.jsm` y las tablas crecientes `crece.inc` (capítulo 06), ni cómo Luma lanza estos programas desde
su cuerpo, su casa y su conversación (capítulos 08, 09 y 10). El instalador y la publicación están en el capítulo 11.

Las referencias `ruta:línea` son relativas a la raíz del repositorio. Las afirmaciones salen del código; lo que se tomó
de un comentario sin verificar en las instrucciones se marca "(no verificado)".

---

## 1. Convenciones comunes

### 1.1 Registros y llamadas

| Elemento | Convención | Fuente |
|---|---|---|
| Pedido al núcleo | `ask`: `j10` = clase (con el manejador en los 32 bits altos cuando el pedido lo requiere), `j11` = `a`, `j12` = `b`; respuesta en `j13`. Arma una cola de un pedido en `QUEUE` (qwords: `+0` = 1 pedido, `+8` = clase, `+16` = `a`, `+24` = `b`, `+32` = respuesta) y ejecuta `jsys` con `QUEUE`. | `razar/lectura/lectura.inc:2042-2054`, `razar/cardumen/cardumen_cubo.jsm:1047-1059` |
| Sala nueva | `room`: pedido 2 con `j11` bytes; sin memoria escribe `S_NOMEM` y termina. | `razar/lectura/lectura.inc:1736-1807` |
| Argumentos internos | Cada rutina documenta "Uses jX-jY"; los valores viajan en `j2`..`j14` y en variables fijas de la sala 0. | — |
| Salida de texto | `puts`, `putch`, `putnum`, `flush` de `lectura.inc`; con `SINK` = manejador + 1, `flush` escribe en ese archivo en vez de la consola. | `razar/lectura/lectura.inc:1876-1934`, capítulo 06 |

Los números de pedido usados en este capítulo (semántica completa en el capítulo 04):

| N.º | Uso aquí |
|---|---|
| 1 | Escribir `b` bytes desde `a` en la consola (`flush` sin `SINK`; `voluntad.jsm` escribe así su línea final). `razar/lectura/lectura.inc:1891-1896`, `razar/cardumen/voluntad.jsm:338-342`. |
| 2 | Pedir una sala de `a` bytes; responde su dirección o −1 (`room` termina el programa con `S_NOMEM` ante −1, `lectura.inc:1736-1807`). |
| 3 | Devolver una sala (`pl_grow` devuelve la tabla vieja). |
| 4 | Abrir una etiqueta de la casa. En el anfitrión abre **o crea** (`CreateFileA` con `OPEN_ALWAYS`, `so/janaxos.asm:3042`): consultar un archivo ausente lo deja creado vacío; vacío equivale a ausente en todos estos programas. Responde el manejador, o un valor negativo. |
| 5 / 6 / 7 | Leer / escribir / cerrar (`j10` = manejador << 32 \| clase). |
| 12 | Borrar una etiqueta (se usa antes de reescribir un archivo entero). |
| 13 | Renombrar: etiqueta vieja en `[a, a+b)`, la nueva a continuación, de `alto` bytes (`alto` = los 32 bits altos de `j10`). |
| 16 | Lanzar un hijo: `j10` = (15 << 32) \| 16, es decir clase 16 con derechos 15; `a`/`b` = etiqueta del programa; responde el número de cabina del hijo. |
| 23 / 25 | Mover la sala `a` a la cabina `b` / recibir la sala que otra cabina movió (responde su dirección). |
| 29 | Esperar hasta que llegue una carta; responde −1 si ya no queda nadie que pueda escribir. |
| 30 | Decir la palabra `b` a la cabina `a` (en los hijos, `a` = 0: la madre). Ningún programa de este capítulo mira la respuesta (que sea −1 sin destinatario: no verificado). |
| 31 | Leer una carta del buzón en `a` (`b` = 16 bytes: `+0` remitente, `+8` palabra); responde 1 si había carta. |
| 36 | Rehacerse con otro programa al terminar con código 0. |
| 38 | Ir a una posición del archivo (−1 = el final). |

### 1.2 Palabras, huellas y azar

| Elemento | Definición | Fuente |
|---|---|---|
| Letra de palabra | Un byte es letra si está en `a`..`z` (61h..7Ah) o es ≥ 80h. Las mayúsculas ASCII y los dígitos **no** son letras para estos programas. | `razar/cardumen/memoria_pares.jsm:643-663`, `razar/cardumen/hilos.jsm:10033-10053` |
| Palabra | Racha máxima de letras. | `memoria_pares.jsm:777-825` |
| Huella de una palabra (`mp_print`) | FNV-1a de 64 bits: base `0xCBF29CE484222325`, primo `0x100000001B3`, por byte `h = (h xor b) * primo`; si da 0 se usa 1 (las claves de tabla nunca son 0). | `memoria_pares.jsm:618-641`, `hilos.jsm:10008-10031` |
| `mp_mix` (canto) | `h = (h xor (s + 1)) * 0x100000001B3`, 0 → 1. Encadena un símbolo `s` a una huella. | `memoria_pares.jsm:3761-3774` |
| `hl_mix` (hilos) | `h = h * 1000003 xor v` (1000003 = 0F4243h). Las claves resultantes 0 se reemplazan por 1 en cada uso. | `hilos.jsm:861-867` |
| Azar del canto | splitmix64: `s += 0x9E3779B97F4A7C15; z = s; z ^= z>>30; z *= 0xBF58476D1CE4E5B9; z ^= z>>27; z *= 0x94D049BB133111EB; z ^= z>>31`; devuelve `z >> 1` (no negativo). | `memoria_pares.jsm:1200-1234` |
| Azar del cubo y de las voluntades | Congruencial `s = (s * 1103515245 + 12345) mod 2^31`, tirada = `s >> 16`. `voluntad_juego`, `voluntad_oraciones`, `voluntad_acertijos` y `voluntad_semilla` parten de `s = semilla * 7919 + 1`; `voluntad.jsm` y `voluntad_hilos.jsm` usan la semilla fija 12345; `voluntad_canto.jsm` no sortea. | `cardumen_cubo.jsm:295-327`, `voluntad_semilla.jsm:266-271`, `voluntad_juego.jsm:192-194`, `voluntad_oraciones.jsm:628-629`, `voluntad_acertijos.jsm:4257-4259`, `voluntad.jsm:58-59`, `voluntad_hilos.jsm:95` |
| Huella de un programa | `j0 = (j0 * 31 + v) mod 2^48`. | `cardumen_cubo.jsm:1092-1100` |

### 1.3 Tablas que crecen (`crece.inc`)

Una tabla creciente se describe con 4 qwords en la dirección que la nombra: `{dirección de sus lugares, lugares − 1,
entradas, bytes por lugar}`. Nace con 2 lugares (`pl_new`). Índice inicial `(clave >> 32 xor clave) and (lugares − 1)`,
sondeo lineal; un lugar cuyo primer qword es 0 está vacío. `pl_take` duplica la tabla antes de insertar cuando
`2 · (entradas + 1) > lugares − 1` y devuelve la sala vieja con el pedido 3. `pl_find` devuelve en `j4` el lugar de la
clave o el vacío donde iría; `pl_take` devuelve además `j6` = 1 si la clave es nueva (`razar/lectura/crece.inc:23-158`).
Sus variables viven en 1F90h..1FDFh de la sala 0 (`crece.inc:5-9`).

### 1.4 La casa

Cada etiqueta (nombre de archivo) es texto UTF-8; en el anfitrión el archivo se llama con los bytes de la etiqueta en
hexadecimal (capítulo 04, §10; las pruebas lo calculan con `etiqueta()`, por ejemplo `razar/cardumen/canto_prueba.sh:8`).
Todas las etiquetas de este capítulo son ASCII.

### 1.5 "La mitad"

Las palabras de la mitad son las más dichas que juntas cubren la mitad de lo dicho. Se calcula de dos maneras
equivalentes en intención:

- `memoria_pares` (`mp_head`, `memoria_pares.jsm:4361-4407`): búsqueda binaria del mayor umbral `c` en `[1, F0]` tal que
  `2 · Σ{veces(w) : veces(w) ≥ c} ≥ F0`, con `F0` el total de palabras leídas. `HEADC` = `c`, `HMASS` = esa suma,
  `HEADN` = cuántas palabras la alcanzan.
- `hilos` (`hl_half`, `hilos.jsm:720-845`): histograma de veces; desde la mayor cantidad de veces hacia abajo acumula
  `veces · palabras` hasta que `2 · acumulado ≥ HTOT`; `HHC` = las veces donde se detuvo. Una palabra es de la mitad si
  `veces ≥ HHC`. Con el archivo `toda` ninguna palabra se marca de la mitad (`hilos.jsm:827-829`).

El umbral sale del libro; no hay cantidad fija.

---

## 2. `memoria_pares.jsm`: el núcleo de pares y el canto

### 2.1 Qué es

Un programa de una cabina, sin hijos, que lee el archivo `pares` de la casa y, según los archivos presentes, hace una de
tres cosas: (a) mide cuántas respuestas recupera el núcleo cuando la pregunta llega con piezas que tiemblan (el "oído");
(b) canta una respuesta propia para cada línea de `canta` con un modelo de Markov de contexto variable aprendido de los
pares; (c) con `semilla`, toma las respuestas del propio libro como semillas y elige, para cada pregunta apartada, la
oración que mejor se canta como respuesta. Incluye `lectura.inc` y `crece.inc` (`memoria_pares.jsm:4680-4681`); su sala
0 mide 10000h bytes (`memoria_pares.jsm:262`). Los textos viven en `memoria_pares.datos.jsm` en desplazamientos fijos
`S_*` (`memoria_pares.jsm:22-71`, `memoria_pares.datos.jsm:1-101`).

### 2.2 Archivos de la casa

| Etiqueta | Dirección | Contenido | Efecto | Fuente |
|---|---|---|---|---|
| `pares` | entrada | Texto en líneas (§2.3). | Obligatorio: sin bytes, el programa termina sin escribir nada. | `memoria_pares.jsm:264-269` |
| `cf` | entrada | 30 × 31 qwords (7440 bytes) de confusiones del cubo, escritos por `voluntad_oraciones.jsm` (§5.6). | Si se leen exactamente 7440 bytes, las piezas pasan a ser 30 (`BASE` = 30) y cada pieza se oye como la oyó el cubo. Si no, `BASE` = 7 (Fano). | `memoria_pares.jsm:301-381` |
| `canta` | entrada | Líneas; cada una, una pregunta. | Activa el canto (§2.5). | `memoria_pares.jsm:1289-1297` |
| `semilla` | entrada | Cualquier contenido no vacío. | Activa la semilla (§2.6); tiene prioridad sobre `canta`. | `memoria_pares.jsm:1283-1288` |
| `razona` | entrada | Cualquier contenido no vacío. | Activa los lugares de la pregunta (`GON` = cantidad de bytes del archivo, usado como booleano). | `memoria_pares.jsm:1340-1343` |
| `fuera` | entrada | Texto con dos números decimales `k n`. | Si `k ≠ 0`, `n ≠ 0` y `k ≤ n`: aparta los pares `[FK, FE)` con `FK = (k − 1)·PPN div n` y `FE = k·PPN div n` (no se aprenden, sólo se preguntan) y escribe `aparte, sin leer: pares <FK> a <FE>`. En otro caso se ignora. | `memoria_pares.jsm:1304-1338`, `1764-1833` |
| `marcos` | entrada | Cualquier contenido no vacío. | En modo semilla, escribe las líneas `M:` y `N:` (§2.7). | `memoria_pares.jsm:2232-2236` |
| `dados` | entrada | Bytes cualesquiera. | Su huella FNV-1a se mezcla (xor) en la semilla del azar del canto. | `memoria_pares.jsm:3629-3643`, `1383-1390` |
| `cantado` | salida | Bytes del último texto cantado. | Se borra y se reescribe tras cada línea de `canta`; luego se dice la palabra 9 a la cabina 0 (§2.8). | `memoria_pares.jsm:3645-3677` |

Toda lectura usa `mp_read`: abre (pedido 4), lee en una sala de 64 KiB que se duplica mientras el archivo siga
llenándola, y cierra (`memoria_pares.jsm:383-454`). `mp_aside` lee otro archivo sin perder el de `pares`
(`memoria_pares.jsm:1747-1762`).

### 2.3 Formato de `pares`

Cada línea termina en LF (0Ah); el CR (0Dh) que preceda al LF queda dentro del texto de la línea (los ecos a consola
saltan los bytes 0Dh: `memoria_pares.jsm:1453-1456`, `2938-2940`). Se reconocen por su primer byte; se asume un prefijo
de 3 bytes (`"X: "`) sin verificar el segundo ni el tercero, salvo en modo semilla.

**Modo pares (oído y canto)** (`mp_pairs`, `memoria_pares.jsm:456-594`):

| Línea | Regla |
|---|---|
| `C: <contexto>` (43h) | Se guarda como contexto de la próxima `P:`; se descarta tras usarse o si la `P:` no tiene respuesta. |
| `P: <pregunta>` (50h) | La línea siguiente debe empezar con `R` (52h); si no, la pregunta se descarta y esa línea se vuelve a leer como propia. |
| `R: <respuesta>` | La respuesta del par. |
| Cualquier otra | Se ignora. |

Cada par queda en `PPR` (32 bytes: inicio de la pregunta tras el prefijo, bytes, huella FNV-1a de la respuesta,
cantidad de palabras distintas de la pregunta), `PCX` (16 bytes: inicio y bytes del contexto) y `PAN` (16 bytes:
inicio y bytes de la respuesta). Dos respuestas con los mismos bytes tienen la misma huella y cuentan como la misma
respuesta.

**Modo semilla** (`ms_lines`, `memoria_pares.jsm:2244-2354`): una línea de 3 bytes o más cuyo segundo byte es `:` (3Ah)
y cuyo primer byte es `Q` (pregunta) u `O` (oración que no pregunta) es una "construcción" del libro: `SEN` = {inicio
tras el prefijo, bytes, 1 si pregunta} (24 bytes). Las demás líneas se ignoran. Ver el capítulo 06 para quién escribe
estos archivos (`sentido.jsm`).

### 2.4 Flujo principal

```
leer "pares" → leer "cf" → si pares vacío: fin
mp_pairs → mp_alphabet → mp_index
escribir "pares pregunta-respuesta de los libros: <PPN>\n"
mp_dice
mp_sing → si cantó (semilla o canta): fin
si hay "cf": una ronda con temblor 0 (las piezas tiemblan como las oyó el cubo)
si no: rondas con PCH = 0, 20, 40, 90, 200 milésimas
fin
```

(`memoria_pares.jsm:264-299`.)

### 2.5 El alfabeto y las piezas

`mp_alphabet` recorre **todos** los bytes de `pares` (no sólo las preguntas, aunque el comentario diga otra cosa) y
numera cada byte-letra por orden de primera aparición: `ALF[byte]` = número + 1, `ALI[número]` = byte; a lo sumo
`BASE²` letras (49 con Fano, 900 con `cf`); las siguientes no son letras para el canto (`memoria_pares.jsm:665-713`).

Una letra de número `L` se canta como dos piezas: `L div BASE` y `L mod BASE`.

### 2.6 El oído y el núcleo (modo sin `canta` ni `semilla`)

**Índice** (`mp_index`, `memoria_pares.jsm:715-773`): tabla creciente `WIX` (24 bytes por lugar: {huella de palabra,
primer enlace, último par anotado + 1}) y lista de enlaces `LNK` ({par, siguiente}). Cada palabra distinta de la
pregunta, y de su contexto `C:`, se anota una vez por par.

**Ronda** (`mp_round`, `memoria_pares.jsm:896-1026`), parámetro `PCH` en milésimas:

1. El azar se siembra con `0x123456789ABCDEF1` al empezar cada ronda (`memoria_pares.jsm:901-906`).
2. Para cada par: se "oye" su contexto, un espacio, y su pregunta (`mp_hear`, `mp_hspan`, `memoria_pares.jsm:1028-1129`).
   Un byte sin número de letra pasa igual. Una letra se parte en sus dos piezas; cada pieza pasa por `mp_tremble`; si
   alguna se pierde (−1) o el número recompuesto es ≥ `ALN`, el byte oído es un espacio; si no, es la letra recompuesta.
3. `mp_tremble` (`memoria_pares.jsm:1131-1198`):
   - sin `cf`: con probabilidad `PCH`/1000 (sorteo `r mod 1000 < PCH`) la pieza `p` se oye como
     `(p + 1 + (r' mod 6)) mod 7`; si no, igual;
   - con `cf`: se sortea `r mod suma(fila p)` y se recorre la fila `p` de la tabla (31 columnas): la columna 0 da −1
     (nada oído), la columna `g + 1` da la pieza `g`.
4. Cada palabra oída suma 1 a cada par cuya pregunta la tiene (`mp_score`, `memoria_pares.jsm:858-894`). El par de mayor
   puntaje es la respuesta; a igual puntaje gana el de menor número (`mp_best`, `memoria_pares.jsm:1236-1277`).
5. Acierta si la huella de la respuesta del par elegido es la del par preguntado. Se cuenta por largo de la pregunta en
   palabras distintas: 1-5, 6-12, 13 o más (`memoria_pares.jsm:962-984`).
6. Salida: `piezas que tiemblan (milesimas): <PCH> | respuestas bien, por largo: <b1>/<n1> <b2>/<n2> <b3>/<n3> (1-5
   palabras, 6-12, 13 o mas)` (`memoria_pares.jsm:993-1026`). El 2 % (20) y el 20 % (200) son criterio; 40 y 90
   corresponden, según el comentario, a mediciones del cubo de Fano con temblor 10 % y 20 % (no verificado: el número
   está escrito en el código sin la medición).

### 2.7 El canto (con `canta`)

#### 2.7.1 Símbolos ("canciones")

| Símbolo | Valor | Significado |
|---|---|---|
| Pieza | 0 .. `BASE` − 1 | Media letra. |
| Silencio | `BASE` | Una racha de no-letras entre dos letras (sólo si después viene otra letra). |
| Turno | `BASE` + 1 | Fin de la pregunta. |
| Fin | `BASE` + 2 | Fin de la respuesta. |
| Lugar | `BASE` + 3 + k, sólo con `razona` y si cabe en un byte (< 256) | La palabra que está a k palabras del final de la pregunta (k = 0: la última). |

`NSY` = cantidad de símbolos del alfabeto: `BASE + 3`, o uno más que el mayor lugar emitido
(`memoria_pares.jsm:1934-1940`, `3778-3783`). Cada símbolo ocupa un byte.

`mp_span` convierte bytes en símbolos (letra → dos piezas; silencio debido sólo entre letras; no-letras al principio o
al final no emiten nada) (`memoria_pares.jsm:3721-3759`).

#### 2.7.2 La fila de los libros

`mp_syms` (`memoria_pares.jsm:3776-3915`) concatena, para cada par en orden: pregunta (`mp_span`), turno, respuesta
(`mp_ansongs`), fin. `PSY` guarda por par {primer símbolo, primer símbolo tras el turno, uno después del fin} (24
bytes). `MAXA` = el mayor largo de respuesta en símbolos, fin incluido.

Con `razona` (`mp_ansongs`/`mp_encode`, `memoria_pares.jsm:1847-1959`): la respuesta se recorre palabra por palabra;
entre dos palabras se emite un silencio (sea cual fuere la puntuación del texto); una palabra cuya huella coincide con
una palabra de la pregunta del mismo par (buscando desde el final, la más cercana) se emite como lugar `BASE + 3 + k`;
si `BASE + 3 + k ≥ 256`, o si no coincide, se deletrea. En modo semilla (`PLC` = 1) las palabras de la pregunta que son
de la mitad se quitan antes (`mp_qlfilter`, `memoria_pares.jsm:1961-2016`); una palabra que ningún libro tiene se
conserva.

#### 2.7.3 Aprendizaje: contextos con la regla de dos

`mp_learn` (`memoria_pares.jsm:3917-4054`) mantiene dos tablas crecientes:

| Tabla | Lugar | Campos (desplazamiento: contenido) |
|---|---|---|
| `CXT` | 32 bytes | 0: huella del contexto; 8: último par que lo dijo + 1; 16: cuántos pares distintos lo dicen; 24: veces que algo lo siguió |
| `NXT` | 16 bytes | 0: huella (contexto, símbolo siguiente); 8: veces |

La huella del contexto vacío `CS0` es la base FNV `0xCBF29CE484222325`. La huella del contexto de largo k que precede
a la posición p es `mix(...mix(mix(CS0, s[p−1]), s[p−2])..., s[p−k])` (`HPX[p]`). Algoritmo:

```
ORD = 0
repetir:
  ALIVE = 0
  para cada par no apartado, para cada posición p del par con p ≥ inicio + ORD:
    si HPX[p] = 0: seguir                       (esa posición ya no crece)
    si ORD > 0:
      si CXT[HPX[p]].pares < 2: HPX[p] = 0; seguir   (regla de dos)
      HPX[p] = mix(HPX[p], s[p − ORD])
    CXT[HPX[p]]: si el último par no es éste, pares += 1; veces += 1
    NXT[mix(HPX[p], s[p])].veces += 1; ALIVE = 1
  si ALIVE = 0: fin
  ORD += 1
```

Los contextos no cruzan pares: cada par empieza en el contexto vacío. Se aprenden también las posiciones de la
pregunta, no sólo las de la respuesta. No hay largo máximo: crecen hasta donde dos pares repiten lo mismo.

#### 2.7.4 Composición

Para cada línea de `canta` (`memoria_pares.jsm:1392-1484`): la línea se convierte en símbolos, se agrega el turno; con
`razona`, sus palabras se cargan en `QLB` (`mp_qwords`, `memoria_pares.jsm:2065-2111`). Luego `mp_compose`
(`memoria_pares.jsm:4056-4188`):

```
CQ0 = CQN (largo de pregunta + turno); CRMAX = 0
mientras (CQN − CQ0) < MAXA:
  ctx = CS0; j = 1
  mientras CQN − j ≥ 0:
    c = mix(ctx_tentativo, CQ[CQN − j])
    si CXT[c].pares < 2: cortar
    ctx = c; j += 1
  CRC = min(j, (CQN − CQ0) + 1)
  T = Σ_s NXT[mix(ctx, s)].veces, s = 0 .. NSY − 1
  si T = 0: fin
  r = azar mod T; elegir el primer s cuya suma acumulada supera r
  si s = turno o s = fin: fin
  CQ[CQN] = s; CQN += 1; CRMAX = max(CRMAX, CRC)
```

El contexto usado es siempre el más largo que dicen dos pares o más. El azar se siembra con `0x123456789ABCDEF1 xor
DICE` una vez antes de la primera línea de `canta` (`memoria_pares.jsm:1383-1390`); sin `dados`, `DICE` = 0 y cada
corrida canta lo mismo.

#### 2.7.5 Del canto al texto

`mp_text` (`memoria_pares.jsm:4190-4282`) recorre `CQ[CQ0..CQN)`:

| Símbolo | Texto |
|---|---|
| Lugar `BASE + 3 + k` | Si k < `QLN`, la palabra `QLB[QLN − 1 − k]` (sin espacios añadidos; cuenta en `CEW`); si no, nada. Siempre cuenta en `CEC`. Anula una pieza pendiente. |
| Silencio | Un espacio; anula una pieza pendiente. |
| Pieza | Si no hay pendiente, queda pendiente; si la hay, letra = pendiente · `BASE` + pieza; si < `ALN`, se escribe `ALI[letra]`. |

La línea de consola es `canta: <línea sin CR> -> <texto>` (`memoria_pares.jsm:1446-1470`). Ejemplo verificado por
prueba: con cuatro pares que responden "buen dia" a "hola amigo"/"hola hermano", `canta: hola primo -> buen dia`
(`razar/cardumen/canto_prueba.sh:15-19`); con `razona`, `canta: tu eres felipe? -> si yo soy felipe`
(`razar/cardumen/razona_prueba.sh:15-21`).

#### 2.7.6 Medición sobre los pares (después de las líneas de `canta`)

Para cada par preguntado (todos, o el tramo de `fuera`) se compone la respuesta a partir de su pregunta y su turno y se
mide (`memoria_pares.jsm:1485-1745`):

| Medida | Definición |
|---|---|
| `CSW` | Palabras cantadas. |
| `CSR` | De ellas, las que algún par leído tiene (`VOC`). |
| `CSO` | Las que son palabras de la respuesta propia del par (`OWN`, clave `mix(huella, par)`). |
| `CSWC`, `CSOC` | Lo mismo, sólo palabras que no son de la mitad. |
| Inventadas | Palabras cantadas que ningún libro leído tiene; cada una se escribe una vez tras `inventadas:`. |
| Copia (`CCP`) | Subcadena común más larga (en bytes) entre el texto cantado y la respuesta propia, en milésimas del largo cantado, sumada (`mp_copy`, programación dinámica con una fila, `memoria_pares.jsm:4616-4678`). |
| Recitado (`CRS`) | `CRMAX · 1000 / símbolos cantados`, sumado. |
| Nulo de orden cero (`N0`, `N0C`) | Por par: palabras cantadas × (Σ veces de las palabras distintas de su respuesta) / `F0`; en milésimas. Para contenido, con `F0 − HMASS` como total. |

Salida (`memoria_pares.datos.jsm:26-56`): una línea con las inventadas; con `razona`, `razona: lugares de la pregunta que
repiten las respuestas, aprendidos: <NSY − BASE − 3> | lugares cantados: <CEC>, con su palabra: <CEW>`; luego `canto
propio: contexto mas largo que dicen dos pares o mas: <ORD − 2, o 0> piezas | pares <CSN> | palabras cantadas <CSW>: de
los libros <%>, de su respuesta <%> | copia de su respuesta <%>%` y `nulo de orden cero (...): de su respuesta <x.y>% |
de contenido (sin las <HEADN> palabras que hacen la mitad de lo dicho): cantado <x.y>%, nulo <x.y>% | recitado de lo
leido <%>%`. Los porcentajes enteros truncan (`mp_pct`); los de un decimal usan `mp_pct10`
(`memoria_pares.jsm:1835-1845`, `3597-3618`).

### 2.8 Dados y `cantado`: contrato con quien lo lanza

| Paso | Quién | Acción | Fuente |
|---|---|---|---|
| 1 | Lanzador | Escribe en la casa `pares`, `canta` y, opcionalmente, `razona` y `dados`. | `razar/cuerpo/gen_leer.py:6551` (no verificado: la generación del cuerpo es capítulo 08) |
| 2 | `memoria_pares` | Lee `dados` y fija `DICE` = FNV-1a de todos sus bytes (0 si vacío). | `memoria_pares.jsm:3629-3643` |
| 3 | `memoria_pares` | Por cada línea no vacía de `canta`: canta, escribe la línea a consola, borra `cantado` (12), lo abre (4), escribe `CT` con `CTN` bytes (6), cierra (7) y dice la palabra 9 (pedido 30, `a` = 0: la cabina número 0 de la familia). Si la apertura responde negativo, no escribe ni dice la palabra 9. | `memoria_pares.jsm:1409-1412`, `3645-3677` |
| 4 | Lanzador | Al recibir la palabra 9, lee `cantado`: contiene el texto de la **última** línea cantada, sin LF final. | — |

`mp_keep` no mira la respuesta del pedido 30: en una corrida sola (sin cabina 0 que escuche) el programa sigue igual
(la respuesta concreta del núcleo en ese caso: no verificado).

### 2.9 La semilla (con `semilla`)

`mp_seed` (`memoria_pares.jsm:2140-2242`):

1. `ms_lines` y `ms_vocab`: las construcciones y el vocabulario de **todas** las oraciones; la mitad (§1.5).
2. `ms_seeds` (`memoria_pares.jsm:2496-2614`): para cada pregunta `Q` en la posición `SA`, su respuesta son las
   oraciones `O` desde `SA + 1` hasta la próxima `Q`. Su semilla es la oración de su respuesta que dice más palabras
   distintas de la pregunta que no son de la mitad (`ms_qset`/`ms_overlap`); se exige al menos una; a igualdad gana la
   primera. Las semillas son los pares: `PPR` = la pregunta, `PAN` = la semilla; `SDQ` (32 bytes) = {pregunta, primera
   oración de su respuesta, una después de la última, la semilla}.
3. Escribe `semilla: preguntas del libro <NQS>, con su respuesta en el libro: <PPN>, oraciones: <SENN>`.
4. `fuera` se interpreta sobre las semillas (tramo k de n, §2.2).
5. Se activan `razona` y `PLC` (los lugares son sólo lo que la pregunta trata, sin las palabras de la mitad) y se
   aprende la fila de las semillas no apartadas (§2.7.2-2.7.3).
6. Con `marcos`: §2.10.
7. `ms_eval` (`memoria_pares.jsm:2639-2875`): para cada semilla preguntada, sus candidatas son todas las oraciones `O`
   del libro que dicen al menos una palabra (no de la mitad) de la pregunta. Para cada candidata:
   - costo con lugares menos costo sin lugares (`ms_cost` → `ms_fit`); gana el menor (`SBEST`);
   - regla de palabras: la que comparte más palabras de contenido (`OBEST`);
   - regla de todas las palabras: la que comparte más palabras contando también las de la mitad (`OBEA`);
   - azar: la fracción esperada de candidatas que son de su respuesta (`HRN`, en milésimas).
   Una elección acierta si la oración elegida está en `[primera, última]` de la respuesta de esa pregunta (`ms_isreg`).
8. `ms_fit` (`memoria_pares.jsm:3468-3573`): para cada símbolo de la candidata cantada tras la pregunta, se busca el
   contexto más largo con `pares ≥ 2`; se retrocede de largo hasta encontrar uno que haya visto ese símbolo; costo =
   `lg(CXT.veces) − lg(NXT.veces)`; si ni el vacío lo vio, `lg(CXT[CS0].veces + 1)`. El resultado es el promedio en
   1/256 de bit. `mp_lg` = posición del bit más alto · 256 + interpolación lineal hasta la potencia siguiente
   (`memoria_pares.jsm:3575-3595`).

Salida por pregunta: `P: <pregunta> | canto: <1 si acierta, 0 si no> <oración elegida> | palabras: <oración de la
regla>` (`-` si no hay) (`memoria_pares.jsm:2842-2864`). Resumen: `preguntadas sin leer su semilla: <NEV> | candidatas
por pregunta: <NCAND div NEV> | aciertan (una oracion de su respuesta): el canto <x.y>%, la que mas palabras comparte
<x.y>%, al azar <x.y>%, la que mas palabras comparte contandolas todas <x.y>%` (`memoria_pares.jsm:2877-2915`). Prueba:
`razar/cardumen/semilla_prueba.sh:13-21`.

### 2.10 Marcos y notas (`marcos`, para el cubo)

Para cada semilla (`FSE`) y cada oración `O` (`FSJ`) que dice alguna palabra de su pregunta y contiene un lugar de lo
que la pregunta trata, `ms_frames` escribe (`memoria_pares.jsm:2951-3105`):

```
M: <semilla> <oración> <1 si es de su respuesta> <1 si la semilla se leyó, 0 si apartada> t1 t2 t3 t4 t5
N: <semilla> <oración> <ídem> <ídem> <cantidad de notas> nota1 nota2 ...
```

`t1..t5` son los tokens de las palabras en las posiciones `f − 2 .. f + 2`, con `f` el primer lugar de la oración
(`mf_token`, `memoria_pares.jsm:3323-3379`):

| Token | Significado |
|---|---|
| 0 | Fuera de la oración. |
| 1 | Una palabra que no es lugar, no es de la mitad y no la dicen dos respuestas leídas. |
| ≥ 2 | Número por orden de primera aparición (`TOK`, desde 2) de: un lugar (clave 3 + k) o la palabra misma (clave su huella), si es de la mitad o la dicen dos semillas leídas (`SDW`, `ms_seedwords`, `memoria_pares.jsm:3381-3451`). |

Las notas (`ms_notes`, `memoria_pares.jsm:3107-3250`) se numeran por primera aparición (`NTK`, desde 0); cada una se
escribe una vez por línea. Claves:

| Nota | Clave |
|---|---|
| Alrededor de cada lugar, desplazamiento d ∈ {−2..2} | `(d + 3) << 32 \| (token + 1)` |
| Palabra de la pregunta que no es lugar | `mix(huella, 10)` |
| Cuántas palabras de la pregunta dice | `8 << 32 \| (FOV + 1)` |
| Cuántas no dice | `9 << 32 \| (QCN − FOV + 1)` |

Prueba: `razar/cardumen/notas_prueba.sh:13-30`.

### 2.11 Variables de la sala 0

Las variables viven en 1200h..1990h (`memoria_pares.jsm:73-259`); cada una está comentada en el código. Las tablas
crecientes ocupan 4 qwords (`WIX` 1248h, `CXT` 1420h, `NXT` 1440h, `VOC` 1460h, `OWN` 1480h, `UNK` 1580h, `TOK` 1870h,
`NTK` 18D8h, `SDW` 1960h). Los textos `S_*` ocupan 0..7BFh (`memoria_pares.jsm:22-71`).

---

## 3. `hilos.jsm`: relaciones del texto crudo

### 3.1 Qué es

Un programa de una cabina que lee `pares` (las construcciones del libro) y, sin preguntas, encuentra relaciones
("formas"), las une por razonamiento en un while de hipótesis, deduce relaciones nuevas, y deja en la casa lo que sabe
para el libro siguiente. Sala 0 de 10000h bytes (`hilos.jsm:482`); textos en `hilos.datos.jsm`; incluye `lectura.inc`
y `crece.inc` (`hilos.jsm:10055-10056`).

### 3.2 Archivos de la casa

| Etiqueta | Dir. | Formato | Fuente |
|---|---|---|---|
| `pares` | E | Líneas `Q:`, `O:`, `R:` (§3.3). Obligatorio: sin él escribe `hilos: no hay libro`. | `hilos.jsm:541-548` |
| `cruce` | E | Primer número decimal: cuántos pares atrás se cruza cada par (sólo en la tanda; 1 si falta o es 0). | `hilos.jsm:484-495` |
| `suspende` | E | Primer número: la regla a suspender (§3.10). | `hilos.jsm:496-515` |
| `tanda` | E | Dos números: formas a elegir y lado del cubo (§3.18). | `hilos.jsm:516-524`, `3029-3070` |
| `signos` | E | No vacío: cada byte no-letra que no sea espacio ni CR es una palabra de un byte. | `hilos.jsm:526-530`, `9830-9840` |
| `toda` | E | No vacío: ninguna palabra es de la mitad. | `hilos.jsm:531-535` |
| `nitidez` | E | No vacío: activa la nitidez (§3.16). | `hilos.jsm:536-540` |
| `partes` | E | No vacío: sólo busca las piezas de palabras (§3.17) y termina. | `hilos.jsm:8686-8699` |
| `vuelca` | E | No vacío: escribe `relaciones` (§3.14). | `hilos.jsm:9584-9589` |
| `pedazo` | E | Primer número: bytes por pedazo (por defecto 102400 = 1 << 16 \| 9000h; criterio declarado en el comentario). | `hilos.jsm:598-666` |
| `sigue` | E/S | Primer número: desplazamiento donde empieza el pedazo actual. | `hilos.jsm:623-633`, `668-718` |
| `hilos` | E | Etiqueta del programa que el pedido 36 vuelve a cargar para seguir por pedazos (cómo se deja el binario en la casa: no verificado). | `hilos.jsm:703-706` |
| `sabido` | E/S | §3.11. | `hilos.jsm:5616-6161` |
| `pendiente` | E/S | §3.12. | `hilos.jsm:6218-6696` |
| `testigos` | E/S | §3.13. | `hilos.jsm:9466-9573` |
| `ejemplos` | E/S | §3.14. | `hilos.jsm:9297-9464` |
| `imaginado` | E/S | §3.15. | `hilos.jsm:7276-7576`, `8579-8684` |
| `mecanismos` | E/S | §3.15. | `hilos.jsm:7669-7793` |
| `relaciones` | S | §3.14. | `hilos.jsm:9581-9682` |
| `piezas` | S | §3.17. | `hilos.jsm:9103-9161` |
| `lugar`, `lugares0`, `lugares1`, `nitidas`, `nitidas0`, `nitidas1` | E/S | §3.16. | `hilos.jsm:7795-8577` |

Los archivos que se reescriben enteros siguen el patrón borrar (12) → abrir (4) → escribir lo viejo que se conserva →
escribir lo nuevo → cerrar (7). Los que sólo crecen (`lugares*`, `nitidas`) se abren y se posicionan al final con el
pedido 38 (`a` = −1) (`hilos.jsm:8225-8243`, `8484-8497`).

### 3.3 Lectura

`en_lines` (`hilos.jsm:9756-9933`): una línea cuyo segundo byte es `:` y cuyo primero es `Q` (clase 1), `O` (2) o `R`
(3) se lee desde el byte 2; las demás se saltan. Registro de línea `ZLN` (32 bytes): {clase, primera palabra, cantidad,
inicio}. Registro de palabra `ZWD` (24 bytes): {huella, inicio, bytes}. `ZWT` (tabla creciente de 24 bytes) da el texto
de cada huella. Todas las líneas leídas, sean de la clase que sean, participan en las formas.

**Pedazos** (`hl_piece`, `hilos.jsm:598-666`; `hl_next`, `hilos.jsm:668-718`): `HPFR` = inicio del pedazo (número
de `sigue`, 0 si falta) y `HPTO` = bytes por pedazo (número de `pedazo`, o 102400). Si `HPFR + HPTO ≥` largo del
libro, el pedazo llega hasta el final; si no, termina justo después del primer LF que esté en la posición
`HPFR + HPTO` o más adelante (o en el final del libro). Desde ahí `HPTO` guarda el fin absoluto del pedazo y
`PRB`/`PRN` pasan a describir sólo el pedazo. Al terminar un pedazo que no es el último: borra y reescribe `sigue` con
el fin del pedazo en decimal (sin LF), pide 36 con la etiqueta `hilos` y termina; el núcleo lo rehace desde su primera
orden con lo que la casa guarda. Si `sigue` no se pudo abrir, no pide 36. Tras el último pedazo de un libro leído por pedazos, borra
`sigue`. Prueba: `razar/cardumen/hilos_pedazos_prueba.sh`.

### 3.4 Formas y pares

`hl_facts` (`hilos.jsm:869-1054`): en cada línea, para cada palabra A en la posición i que no es de la mitad, y cada
k ∈ {1, 2, 3}, si la palabra B en i + k + 1 existe en la línea, no es de la mitad y su huella difiere de la de A:

- clave de forma = `k` mezclado con las huellas de las k palabras intermedias (`hl_mix` en orden); las intermedias
  pueden ser de la mitad;
- clave del par = `mix(mix(clave de forma, A), B)`; un par se guarda una vez por forma (`HFT`).

| Tabla | Tamaño | Campos |
|---|---|---|
| `HMID` | creciente, 16 B | {clave de forma, número} |
| `HMA` | 48 B por forma, sala de `3·ZNWD + 2` | 0 clave; 8 registro de su primera línea; 16 índice en la línea de la primera palabra intermedia; 24 cuántas intermedias (negativo: forma deducida, §3.9); 32 cuántos pares; 40 último par (lista enlazada, −1 = ninguno) |
| `HFL` | 32 B por par | 0 forma; 8 huella A; 16 huella B; 24 par anterior de la misma forma |

Sólo las formas con `HMA+32 ≥ 2` (dos pares o más) participan en el razonamiento (`hilos.jsm:1164-1169`); una forma
con un solo par se conserva pero no se usa.

### 3.5 Relaciones de relaciones (`HGT`, `HGE`, `HAG`)

Cada forma empieza siendo su propia relación (`HCLS[f] = f`, `HSIZE[f] = 1`, `hilos.jsm:4731-4749`). `hl_find`
recorre `HCLS` hasta la raíz y acumula con xor los bits `HPAR` ("invertida contra la raíz") (`hilos.jsm:4789-4812`).

`hl_groups` (`hilos.jsm:1141-1264`): para cada par de una forma con ≥ 2 pares, la relación de su forma (girando A y B
si está invertida) y la clave del par sin orden: `mix(mix(min, max), 7)` con `min`/`max` en orden por `(v >> 1)` y luego
por el bit 0 (`hl_pkey`, `hilos.jsm:1062-1095`). En dos pasadas: cuenta por clave en `HGT` y luego coloca en `HGE` (32
bytes: {relación, `HDIR` = 1 si A era el menor, cruzado, forma}). Sólo con la tanda se agregan pares cruzados: la
segunda palabra del par `HCRS` posiciones atrás en la lista de la misma forma (`hilos.jsm:1187-1223`). En el while no
hay cruce.

`hl_agree` (`hilos.jsm:1266-1422`): para cada clave de `HGT` con ≥ 2 entradas, para cada dos entradas x, y:

- misma relación, ninguna cruzada y distinta dirección: la relación dice un par en los dos sentidos → `HNANT[rel] = 1`
  ("pegamento");
- relaciones distintas: entrada de `HAG` (64 bytes) con clave `mix(mix(rmin, rmax), via)`, `via` = 1 si igual
  dirección, 2 si opuesta: 8 `rmin`; 16 `rmax`; 24 vía; 32 + 8·c = cuenta con c ∈ {0 ambas leídas, 1 una cruzada,
  2 ambas cruzadas}; 56 marca "se unió en esta vuelta".

Puntaje (`hl_score`, `hilos.jsm:4814-4832`): `2·leídas − una_cruzada` si `leídas ≥ 2` y el resultado es > 0; si no, 0.

### 3.6 Propiedades y contradicciones

`hl_props` (`hilos.jsm:3072-3383`), en cada vuelta:

1. Para cada par de una forma con ≥ 2 pares, girado hacia su relación R: `HFV[mix(mix(mix(R, 0), A), B)]` += 1 y
   `HFV[mix(mix(mix(R, 1), B), A)]` += 1 (48 bytes: {clave, R, lado, palabra, valor, veces}) (`hp_val`,
   `hilos.jsm:4207-4238`). `HCCNT[R]` cuenta los pares.
2. `HFT2` (64 bytes, clave `mix(mix(R, lado), palabra)`): {R, lado, palabra, valor confirmado, cuántos confirmados,
   cuántos valores, un valor}. Un valor está confirmado si lo dicen 2 pares o más.
3. Por relación y lado (`2R + lado`): `HSUPP` = palabras con exactamente un valor confirmado; `HBROK` = 1 si alguna
   tiene dos o más.
4. `hp_is(R, lado)` = 1 si `HBROK` = 0 y `HSUPP` ≥ 2, salvo que sea la regla suspendida (`hilos.jsm:4171-4205`). Lado
   0 = "un B por cada A"; lado 1 = "un A por cada B".
5. `hp_index` arma, por relación, las palabras con un valor confirmado en un lado donde la relación "es así".

`hp_contra(R1, R2, via)` (`hilos.jsm:3664-3755`): cada una defiende por turno; para cada palabra con valor confirmado
del defensor, si la otra dice de esa palabra (en el mismo lado si `via` = 1, en el opuesto si 2) más de un valor, o un
valor distinto → contradicción.

`hp_place` (`hilos.jsm:3757-3832`): los pares de cada relación, girados hacia ella, contiguos en `HCTRI` ({A, B}) desde
`HCOFF[R]`.

### 3.7 La hipótesis y su examen

Una entrada de `HAG` es la hipótesis "la segunda relación es la primera" (misma vía o al revés). `hl_reason`
(`hilos.jsm:5044-5118`) devuelve sus confirmaciones (`HAG+32`) o 0 si no se sostiene:

| Condición | Resultado |
|---|---|
| Está en `HREF` (refutada) y no despierta (§3.8) | 0 (en coma) |
| `leídas` < 2 | 0 |
| Alguna de las dos relaciones es pegamento | 0 |
| Existe la entrada de la vía opuesta con `leídas` > 0 | 0 (el libro lo dice al revés) |
| `hp_contra` | 0 |
| En otro caso | `leídas` |

`hl_explains` (`hilos.jsm:3834-3859`) exige `hex_dir` en los dos sentidos. `hex_dir(R, S, via)`
(`hilos.jsm:3861-3977`): para cada par (A, B) de S (girado si `via` = 2) tal que R conoce A en su lado 0 y B en su lado
1 (`HFT2`): si R dice (A, B) (`HFV`), o `hx_rescue` lo explica, cuenta como explicado (`HEX`); si no, como no explicado
(`HEU`) y sus dos palabras van al contexto (`hx_ctx`). Resultado 1 sólo si `HEX > HEU` (con ambos en 0 el resultado es
0).

`hx_rescue` (`hilos.jsm:3979-4106`): "dos nombres para un mismo lugar": si R dice A con b' donde S dice A con B, y b' y B
tienen el mismo compañero del otro lado, uno en cada relación (o lo mismo con la primera palabra), se escribe `mismo
lugar: <nombre de S> = <nombre de R>` y cuenta como explicado (detalle de los casos no verificado línea por línea).

### 3.8 El while

```
HTURN = 1
repetir:
  hl_groups; hl_agree; hl_pinject; hl_props; hl_derive; hl_merge; hl_wkeep
  HTURN += 1
mientras HNMRG + HNDER + HNREF ≠ 0
hl_end; hl_icheck; hl_inventa; hl_ksave; hl_psave; hl_esave; hl_tsave; hl_vuelca; hl_next
```

(`hilos.jsm:567-596`.) Antes de la primera vuelta corren `hl_known` (lo sabido) y `hl_pending` (lo pendiente).

**Unión** (`hl_merge`, `hilos.jsm:4834-5042`):

1. Para cada hipótesis que `hl_reason` sostiene (`HNACC` += 1), cada una de sus dos relaciones guarda la de mayor
   confirmación (`HBST`, `HBSE`); a igualdad queda la primera vista.
2. Para cada hipótesis elegida por **las dos** relaciones (`HBSE[rmin]` = `HBSE[rmax]` = esa entrada), con
   `R1` = `rmin` (el menor número de relación, comparación con signo) y `R2` = `rmax`:
   - si `hl_explains` = 0: entra en `HREF` (56 bytes: {clave, vuelta en que cayó (−1 = despierta), inicio del
     contexto, cantidad, R1, R2, vía}); `HNREF` cuenta las refutadas por primera vez; `hm_absurd` cuenta huecos;
   - si no: marca `HAG+56`, toca las palabras de los pares de R2 (`HWT[palabra]` = vuelta), `HCLS[R2] = R1`,
     `HPAR[R2] = via − 1`, `HSIZE[R1] += HSIZE[R2]`, `HNMRG` += 1, y escribe
     `vuelta <T> une: <R1> ~ <R2> | misma|al reves | lo confirman <n> | nada lo contradice` (`hilos.jsm:5425-5460`).
3. Escribe `vuelta <T> | relaciones que comparten dos pares y mas que su nulo: <HNACC> | se unen <HNMRG>`.

**Despertar** (`hrs_wakes`, `hilos.jsm:5120-5176`): una refutada despierta si alguna palabra de su contexto fue tocada
en una vuelta posterior a la que cayó; entonces su vuelta pasa a −1 y se escribe `despierta: <R1> ~ <R2>`. Sólo una
unión toca palabras (`hm_touch`, `hilos.jsm:5198-5204`).

**Deducción** (`hl_derive`, `hilos.jsm:4240-4354`): una relación raíz con ≥ 2 formas, no pegamento, con ≥ 2 pares, que
"es así" en algún lado y cambió de tamaño desde la última vez, se encadena consigo misma (`hd_chain`): donde dice
(a, b) y (b, c), la forma deducida dice (a, c). La forma deducida tiene `HMA+24` negativo y `HMA+16` = la relación que
encadena; necesita 2 pares para existir. Se escribe `deduce: <R> + <R> | pares <n>` (`hilos.jsm:4448-4463`). Una
deducida que nadie unió en la vuelta siguiente pierde sus pares (`HNESP` += 1). Capacidad para formas y pares:
`min(2·HNM, 3·ZNWD)` y `min(2·HNF, 3·ZNWD)` (`hilos.jsm:4568-4591`).

**Fin** (`hl_end`, `hilos.jsm:5462-5546`): `el while paro en la vuelta <T − 1>: nada nuevo se deduce sin contradiccion |
relaciones de dos formas o mas: <n> | la mas grande: <k> formas, la primera: <forma> | hipotesis en coma: <HREF
entradas> | deducidas en espera (sin testigo): <HNESP> | huecos de las refutadas: <HHOL>, que explicaria una dormida:
<HABS>`.

### 3.9 Formato de las formas en texto

`hl_sayform` (`hilos.jsm:1742-1780`): una forma leída se escribe como sus palabras intermedias separadas por un espacio
(sin los lugares); una deducida como `<raíz> + <raíz>`.

### 3.10 Reglas y suspensión

`hl_rules` (`hilos.jsm:5548-5614`), después del while: para cada número de regla `N = 2·forma + lado` con `HPBP[N]` > 0,
`regla <N>: <forma> | un B por cada A|un A por cada B | frena <HPBP> uniones (<HPBW> palabras)`. Con `suspende` = N en la
casa, `HSUSF = N + 1`; en cada vuelta se toma la relación actual de la forma `N >> 1` y el lado `(N and 1) xor
invertida`, y `hp_is` responde 0 para ella (`hilos.jsm:3107-3119`, `4173-4182`).

### 3.11 `sabido`

Una línea por forma unida a otra (`hl_ksave`, `hilos.jsm:6004-6161`):

| Bytes | Contenido |
|---|---|
| 0-15 | Clave de la forma, 16 dígitos hexadecimales en minúscula. |
| 16 | Espacio. |
| 17-32 | Clave de la forma a la que se unió (`HCLS[f]`, su padre inmediato). |
| 33 | Espacio. |
| 34 | `1` misma vía, `2` al revés (`'1' + HPAR[f]`). |
| 35.. | Opcional `" dormida"`; luego `" | <palabras de f> ~ <palabras del padre>"` y LF. |

No se escriben formas deducidas. Después de las líneas nuevas se copian las líneas viejas no usadas y, al final, las que
este libro durmió (35 bytes, `" dormida"`, el resto de la línea).

Lectura (`hl_known`, `hilos.jsm:5616-5828`): se ignoran las líneas de menos de 36 bytes con su LF. Si las dos formas
existen en este libro, `hk_judge` (`hilos.jsm:5830-5885`) cuenta, por cada par de la primera girado según la vía, si la
segunda lo dice así (a favor) o sólo al revés (en contra):

| Estado de la línea | Condición | Acción |
|---|---|---|
| Despierta | `en contra > a favor` | Se duerme: `duerme: <f> ~ <g> | en contra <x>, a favor <y>`; se reescribe con `dormida`. |
| Despierta | si no | Se aplica (`hk_join`): `sabe: <R1> ~ <R2> | misma|al reves`. |
| Dormida | `en contra = 0` y `a favor ≥ 2` | Se despierta (`despierta lo sabido: `) y se aplica. |
| Dormida | si no | Se conserva igual. |
| Formas ausentes | — | Se conserva igual. |

Resumen: `sabido: <aplicadas> aplicadas | <sin usar> sin usar (sus formas no estan en este libro)` y `sabido: <n>
dormida | ... se duermen, <m> despiertan`. Las claves de forma dependen sólo de las huellas de sus palabras, por eso
valen en cualquier libro. Prueba: `razar/cardumen/hilos_sabido_prueba.sh:26-30`.

### 3.12 `pendiente`

Mismo formato de línea que `sabido` (claves en 0-15 y 17-32, vía en el byte 34) (`hilos.jsm:6218-6344`). Una línea cuyas
dos formas existen en el libro queda en `HQA` (24 bytes: {forma, forma, vía 0/1}); en cada vuelta `hl_pinject`
(`hilos.jsm:6346-6420`) suma 1 a `leídas` de la entrada de `HAG` entre sus relaciones actuales, **sólo si esa entrada
ya existe** (lo pendiente suma a una hipótesis, no la crea), y registra un testigo sin palabras.

Al guardar (`hl_psave`, `hilos.jsm:6472-6696`): se escriben las líneas viejas (una vez por par de formas, en cualquier
orden), salvo las que en este libro quedaron unidas (`verifica: <f> ~ <g>`); luego las entradas de `HAG` de la última
vuelta con `leídas` = 1 y `una_cruzada` = 0, de formas no deducidas cuyas relaciones aún no son una:
`<clave> <clave> <vía> | <f> ~ <g>`. Resumen: `pendientes: <v> verificadas | <s> siguen | <n> nuevos`.

### 3.13 `testigos`

Tras las líneas viejas, una línea por testigo de cada unión de cada vuelta (`HTES`, 64 bytes: {clave, R1, R2, vía, A, B,
forma1, forma2}), campos separados por tabulador (`hl_tsave`, `hilos.jsm:9466-9573`):

```
<R1>\t<R2>\t<1|2>\t<A o ->\t<B o ->\t<forma1>\t<forma2>\n
```

`R1`, `R2`, `forma1` y `forma2` se escriben como texto de forma (`hl_sayform`, §3.9); `A` y `B` como el texto de la
palabra; la vía como el dígito `'0' + vía`. `-` marca un testigo de lo pendiente (el par fue de otro libro). El
archivo se borra y se reescribe: primero el contenido viejo, byte a byte, y luego las líneas nuevas. Prueba: `razar/cardumen/hilos_testigos_prueba.sh:28-35`.

### 3.14 `ejemplos` y `relaciones`

`ejemplos` (`hl_esave`, `hilos.jsm:9297-9464`): conserva el archivo viejo y agrega, para cada par de cada forma leída
cuya relación tiene ≥ 2 formas, si su clave no estaba:

```
<clave del par hex16>\t<clave de la forma hex16>\t<palabras de la forma>\t<A>\t<B>\n
```

La clave del par es la de `HFT` (§3.4). Al leer, toma los primeros 16 dígitos de cada línea mientras queden ≥ 34 bytes.

`relaciones` (sólo con `vuelca`, `hl_vuelca`, `hilos.jsm:9581-9682`): borrado y reescrito; para cada relación raíz no
deducida con ≥ 2 pares, una línea por par: `<HSIZE>\t<forma raíz>\t<A>\t<B>`.

### 3.15 Instrucciones, `imaginado` y `mecanismos`

**Instrucción** (`hl_instr`, `hilos.jsm:6711-6990`): cada palabra de una relación probada (≥ 2 formas) tiene el rol
{relación, lado, la otra palabra}. Para cada forma leída con ≥ 2 pares, sus pares (A, B) y los cruzados (A con la B del
par siguiente): `HIJ` = pares cuyas dos palabras tienen roles, `HIS` = de ellos, los que comparten un rol; `HIJ0`, `HIS0`
igual para los cruzados. Es una instrucción si `HIS ≥ 2`, `2·HIS > HIJ` y `HIS0 < HIS` (`hilos.jsm:6891-6906`):
`instruccion: <forma> | une iguales <HIS> de <HIJ> (mezcladas <HIS0> de <HIJ0>)`. Con ella imagina: para cada par (a, b)
y en los dos órdenes, cada rol de a que b no tiene, b lo tendría (`i`); y lo mismo con los cruzados (`a`, el azar).

**Línea de `imaginado`** (`hin_iwrite`, `hilos.jsm:7276-7348`):

| Bytes | Contenido |
|---|---|
| 0-15 | Clave de la forma raíz de la relación. |
| 17 | Lado (`0`/`1`). |
| 19-34 | Huella de z (la palabra que da el rol). |
| 36-51 | Huella de b. |
| 53 | `i` (imaginado) o `a` (azar). |
| 54.. | `" | "` (bytes 54-56), el texto "z relación b" (o "b relación z" con lado 1), `" # "`, clave de la forma de la instrucción (hex16), espacio, el texto de esa forma, LF. Los bytes 16, 18, 35 y 52 son espacios. |

**Examen de lo imaginado** (`hl_icheck`, `hilos.jsm:7350-7576`): para cada línea de ≥ 55 bytes cuya relación existe en
este libro, recorre sus pares: si dice (z, b) → confirmada (`confirma: <texto>`, y la línea **no** se conserva); si
dice z con otro valor o b con otro z → "convive" (otro uso, no refutación); si no habla de z → en espera. Toda línea no
confirmada se conserva. Resumen: `imaginado: <confirmadas> confirmadas de <comprobables> comprobables | azar: <c0> de
<t0>`. Luego `hl_inventa` reescribe `imaginado`: lo viejo conservado + lo nuevo (`hilos.jsm:8642-8684`).

**`mecanismos`** (`hl_msave`, `hilos.jsm:7669-7793`): tras las líneas viejas, una por mecanismo (instrucción) votado en
este pedazo:

```
<HPFR> <clave hex16> <i_conf> <i_refut> <i_convive> <i_espera> <a_conf> <a_refut> <a_convive> <a_espera> | <instrucción>
```

`refutada` nunca se incrementa: queda en 0 por diseño (`hvm_tally`, `hilos.jsm:7630-7667`).

### 3.16 Nitidez por lugares

Se activa con `nitidez` (`hl_nitidez`, `hilos.jsm:7795-7856`) y corre antes de `hl_rooms`.

| Concepto | Definición | Fuente |
|---|---|---|
| Lugar | `mix(clave de forma, lado)`, lado 0 para A y 1 para B de cada par leído. No cuentan las formas cuyas palabras intermedias son todas de la mitad, ni las palabras de la mitad (con `HHC`, aun con `toda`). | `hilos.jsm:7860-7933`, `8301-8353` |
| Miembro | `HPLW[mix(lugar, palabra)]` = {clave, 1 nuevo aquí / 2 de antes, lugar, palabra}. | `hilos.jsm:7898-7911` |
| Lugar contado | `HPLC[lugar]` = {lugar, palabras, inicio, puestas}. | `hilos.jsm:7907-7911` |
| Pareja | `HPAR[mix(mix(min, max), 77h)]` = {clave, palabra, otra, lugares compartidos}; `min`/`max` por comparación con signo de las huellas. Se cuenta cada dos miembros de un lugar salvo si ambos son de antes. | `hilos.jsm:8355-8459` |

**`lugar`, `lugares0`, `lugares1`** (`hnz_wake`, `hilos.jsm:7946-8094`): el primer byte de `lugar` menos `'0'` elige el
archivo actual (`HLGC`, 0 si no hay `lugar`). Línea: `<lugar hex16> <palabra hex16> <texto>\n` (texto desde el byte 34).
Se lee en tramos de hasta 32300 bytes (criterio, sin medición) dentro de una sala de 64 KiB; una línea cortada se
traslada al principio. Un miembro cuyo lugar está en `HPLC` (lugares de este pedazo) despierta: si no estaba en
`HPLW` se agrega y su lugar suma una palabra en `HPLC`; esté o no, queda marcado 2 ("de antes"), aunque el pedazo
también lo haya traído. Su texto se copia a `ZWT` si el libro no lo tiene. Los demás no se tocan. `hnz_keep` (`hilos.jsm:8223-8299`) agrega al
final sólo los miembros nuevos (marca 1).

**`nitidas`** (`hnz_save`, `hilos.jsm:8461-8558`): primero intenta renombrar `nitidas<HLGC>` a `nitidas` (pedido 13; si
no existe o `nitidas` ya existe, falla sin efecto); luego abre `nitidas`, va al final y agrega una línea por pareja con
lugares > 0 en este pedazo:

```
<clave hex16> <lugares compartidos en este pedazo> <palabra> <otra>\n
```

Es un diario: nunca se relee; una pareja es la suma de sus líneas. Pruebas: `razar/cardumen/hilos_nitidez_prueba.sh`,
`razar/cardumen/hilos_lugares_prueba.sh`. Reproducción completa: `razar/cardumen/nitidez_reproducir.sh`.

### 3.17 Piezas de palabras (`partes`)

`hl_partes` (`hilos.jsm:8701-9213`): para cada palabra dicha dos veces o más, todos sus cortes que no parten una letra
UTF-8 (`pc_len`), con raíz de 3 bytes o más: final (raíz|final), inicio (inicio|resto) y una letra en cualquier lugar
(antes y después como raíz). Dos terminaciones distintas de una misma raíz forman un cambio; un cambio cuenta las
raíces en que funciona. `piezas` (borrado y reescrito) recibe los cambios de ≥ 2 raíces:

```
<raíces>\t<pieza1 o _>\t<pieza2 o _>\t<una raíz>\t<fin|inicio|letra>\n
```

La consola recibe los 20 de más raíces con `pieza: ` (`hilos.jsm:9162-9259`). El detalle de las claves internas de
`HPB`/`HPS` no se verificó línea por línea.

### 3.18 La tanda

Con `tanda` (`k n`), en vez del while: `hl_groups`, `hl_agree`, `hl_tanda` (`hilos.jsm:560-566`). Las tres piezas de
una nota salen de un valor v (una huella, o A xor B de un par): `v' = v >> 4`, `M = n²`, `p1 = v' mod M`,
`p2 = (v' div M) mod M` corrido +1 (módulo M) si coincide con p1, `p3 = (v' div M²) mod M` corrido +1 hasta diferir de
p1 y p2 (`ht_pieces`, `hilos.jsm:2409-2450`). Las líneas `T:`, `N:`, `R:`, `P:`, `Q:`, `U:`, `V:`, `W:`, `G:`, `H:`,
`A:`, `B:`, `F:` y su contenido están descriptos en la cabecera de `hl_tanda` (`hilos.jsm:1782-1801`) (no verificado
línea por línea). Una canción admite 255 notas como máximo (`ht_fits`, `hilos.jsm:2719-2733`).

### 3.19 Constantes asignadas dos veces

El ensamblador PDP toma, en cada uso, la última asignación anterior en la misma pasada (capítulo 02, §8.3). Como todas
las asignaciones están en la cabecera, cada uso ve la segunda:

| Constante | Primera | Segunda (efectiva) | Consecuencia |
|---|---|---|---|
| `HWX` | 13B0h (`hilos.jsm:195`) | 17D8h (`hilos.jsm:288`) | Una sola variable. |
| `HPAR` | 1440h, tabla de parejas de la nitidez (`hilos.jsm:200`) | 1708h, sala "invertida" del while (`hilos.jsm:262`) | La tabla de la nitidez ocupa 1708h..1727h, encima de `HPAR`, `HSIZE`, `HBST`, `HBSE`; funciona porque `hl_nitidez` termina antes de que `hl_rooms` los inicialice (`hilos.jsm:556-557`). |
| `HPI` | 1468h (`hilos.jsm:202`) | 1B98h (`hilos.jsm:362`) | Una sola variable de recorrido. |
| `HFT` | 1588h, tabla de pares por forma (`hilos.jsm:235`) | 1830h (`hilos.jsm:474`) | Una sola tabla en 1830h. |
| `HEX` | 1998h (`hilos.jsm:317`) | 1F78h (`hilos.jsm:464`) | `hex_dir` y `hl_esave` comparten la variable; no se usan a la vez. |

---

## 4. El cubo (la escuela)

### 4.1 Modelo común

Un cubo de lado n tiene n³ piezas; la pieza `i = x + n·y + n²·z`. Cada pieza tiene a lo sumo 6 vecinos en las
direcciones `d` = 0..5: +x, −x, +y, −y, +z, −z (`d xor 1` es la opuesta); fuera del borde no hay vecino. La cara de
abajo (z = 0, piezas 0..n²−1) recibe las señales; la de arriba (z = n−1, piezas `n³ − n²` .. `n³ − 1`) responde.
Cada pieza tiene un peso de un byte hacia cada vecino y una tasa de un byte (`cardumen_cubo.jsm:241-327`).

| Regla | `cardumen_cubo.jsm` | Fuente |
|---|---|---|
| Nacer | Pesos = `(s >> 16) and FFh` con el congruencial (partiendo de `s` = semilla), 6 por pieza en orden de dirección; cada pieza ocupa 8 bytes en `AW` (los bytes 6 y 7 no se usan y no avanzan el azar); tasa = 20. Vecinos en `ANB`: un qword por dirección, −1 (FFFFh cargado como inmediato) fuera del borde. | `cardumen_cubo.jsm:241-327`, `532-545` |
| Ola | Cada saludo t de la canción inicia la ola t con sus 3 piezas despiertas. | `cardumen_cubo.jsm:568-605` |
| Empuje | Cada pieza despierta de cada ola, que no sea de la cara de arriba, suma su peso a cada vecino que todavía no despertó en esa ola; se marca qué dirección empujó. | `cardumen_cubo.jsm:714-800` |
| Despertar | Una pieza empujada despierta si la suma de todas las olas es ≥ 100 y `2 · direcciones que empujaron ≤ vecinos` (armonía); si no, queda ahogada. Despierta en cada ola que la empujó. | `cardumen_cubo.jsm:802-878` |
| Fin de la canción | Cuando nadie está despierto en ninguna ola y ya no quedan saludos (`t ≥ SLEN − 1`). | `cardumen_cubo.jsm:656-665` |
| Respuesta | Por paso, qué piezas de arriba están despiertas. | `cardumen_cubo.jsm:666-682` |
| Aprender | Para cada pieza i que despertó en el paso `ft[i]`: hacia un vecino q que no despertó, peso −1 (mínimo 0); hacia uno con `(ft[q] − ft[i])² ≤ 1`, peso + tasa (máximo 255); los demás, sin cambio. Luego tasa −1 (mínimo 1). No aprende si nació quieto o si la canción es sólo oída. | `cardumen_cubo.jsm:886-982` |
| Conservar (bit 9 al nacer) | Si lo que la pieza dice en total difiere de lo que decía al nacer, cada peso pasa a `round(w · nacido / ahora)` (máx. 255) y la diferencia se reparte de a uno, en orden, entre los pesos que pueden tomarla. | `cardumen_cubo.jsm:378-463` |
| Huella | Todos los pesos y tasas en orden con `mix` (§1.2). | `cardumen_cubo.jsm:1021-1045` |

Una canción dura como mucho `TMAX = 256 + n³` pasos (`cardumen_cubo.jsm:152-154`), según el comentario porque la última
ola empieza a lo sumo en el paso 254 y cada ola despierta cada pieza una vez (no verificado como cota demostrada).

### 4.2 `cardumen_cubo.jsm`: protocolo

Hijo de `voluntad_juego.jsm`, `voluntad_acertijos.jsm` y `voluntad_semilla.jsm`. Sala 0 de 1000h bytes
(`cardumen_cubo.jsm:59`). Escucha con `hear` (31 con `MAIL`, 16 bytes; si responde distinto de 1, duerme con 29 y
vuelve a leer; si 29 responde −1, termina con `jhalt`) y habla con `say` (30 a la cabina 0)
(`cardumen_cubo.jsm:1061-1090`). El byte bajo de cada palabra es la orden (`cardumen_cubo.jsm:71-124`):

| Orden | Palabra de la madre | Datos que siguen | Respuesta del hijo |
|---|---|---|---|
| 5 nacer | bit 8 quieto; bit 9 conservar; bits 16-23 lado n; bits 24.. semilla | — | Una palabra: bytes que necesitan sus tablas, o 0 si la sala que ya tiene alcanza. Si no es 0, espera una palabra de la madre y recibe la sala (25). |
| 6 canción | bits 8-15 = S saludos (≤ 255); bit 16 = sólo oída | S palabras: piezas en bits 0-15, 16-31, 32-47 | Una palabra con los pasos T; luego ⌈T·n²/64⌉ palabras: el bit `t·n² + j` es la pieza de arriba j en el paso t. |
| 7 cómo está | — | — | Dos palabras: piezas fuera de su total; `(pesos en 255) << 32 \| pesos con vecino`. |
| otra (3) | — | — | Su huella como una palabra; termina. |

Tablas en su propia sala, en este orden (P = n³, Q = 8P, B = P redondeado a 8): `AW` (Q), `ARATE` (B), `AFT` (Q), `ANB`
(6Q), `AINP` (Q), `AMASK` (B), `ANCNT` (B), `AORP` (B), `AUNI` (B), `ANOW` (256B), `AWOKE` (256B), `APUSH` (256B),
`ATOP` (`TMAX·n²` redondeado a 8), `ABORN` (Q). `NEED` = la suma (`cardumen_cubo.jsm:158-205`). Al nacer otra vez el hijo
no devuelve la sala anterior (no hay pedido 3 en `born`).

**Entrega de memoria.** El hijo no pide su sala con el pedido 2: según el comentario, ese pedido en un hijo requiere
la autorización de la madre (no verificado en este capítulo; ver capítulo 04). El procedimiento es:

| Paso | Madre | Hijo |
|---|---|---|
| 1 | Dice la orden 5. | — |
| 2 | — | Dice `NEED` (o 0). |
| 3 | Si no es 0: pide una sala de `NEED` bytes (2), la mueve al hijo (23, `a` = sala, `b` = número del hijo) y dice 0. | — |
| 4 | — | Oye esa palabra, recibe la sala (25) y la usa. |

(`voluntad_semilla.jsm:189-234`, `cardumen_cubo.jsm:205-226`.)

### 4.3 `cardumen_canto.jsm`

Cubo fijo de 4×4×4, nacido de la semilla 7 al arrancar (`cardumen_canto.jsm:109-110`); las tres teclas son conjuntos de
piezas de abajo en una máscara de 64 bits: punto {0, 1, 4} = 13h, raya {2, 3, 7} = 8Ch, fin de letra {8, 12, 13} = 3100h
(`cardumen_canto.jsm:49-54`). Órdenes (`cardumen_canto.jsm:112-197`):

| Orden | Palabra | Respuesta |
|---|---|---|
| 4 canción | Desde el bit 8, saludos de 2 bits (0 punto, 1 raya, 2 fin de letra) hasta un 3. | Pasos T; luego ⌈T/4⌉ palabras de 4 pasos × 16 bits (bit j = pieza 48 + j). |
| 5 nacer | bit 8 quieto; semilla desde el bit 16. | Ninguna. |
| 6 canción exacta | bits 8-15 = S; luego S palabras, cada una la máscara de piezas de un saludo. | Igual que la 4. |
| otra (3) | — | Huella; termina. |

Es hijo de `voluntad_canto.jsm` y de `voluntad_oraciones.jsm`.

### 4.4 `cardumen_lazo.jsm`

Cubo de lado ≤ 7 en la sala 0 de 8000h bytes (las tablas deben quedar bajo 7FFFh, alcance del desplazamiento de una
carga) (`cardumen_lazo.jsm:12-35`). Órdenes (`cardumen_lazo.jsm:45-87`):

| Orden | Palabra | Respuesta |
|---|---|---|
| 2 nacer | bits 8-15 lado n; semilla desde el bit 16. | Ninguna. |
| 1 señal | Bytes 1, 2, 3 = las 3 piezas de abajo que despiertan. | Una palabra: bit j = pieza de arriba j despertó; luego ⌈n²/8⌉ palabras con el paso de cada pieza de arriba, un byte cada una (FFh = no despertó). |
| otra (3) | — | Huella (pesos, tasas y fragmentos); termina. |

Hijo de `voluntad.jsm` y `voluntad_hilos.jsm`. El detalle de la ola de una señal (sin cruce de olas) no se verificó
línea por línea.

### 4.5 `cardumen.jsm` y `cardumen_olas.jsm`

Programas autónomos de 4×4×4 nacidos de la semilla 7 que corren una historia fija (40 señales, o 40 palabras en Morse
con olas que se cruzan) y dejan la huella en `j0` para compararla bit a bit con los modelos Perl `huella.pl` y
`huella_olas.pl` (`cardumen.jsm:1-13`, `cardumen_olas.jsm:1-18`) (no verificado más allá de la cabecera).

---

## 5. La voluntad

### 5.1 Protocolo común madre/hijo

| Paso | Acción | Fuente |
|---|---|---|
| 1 | La voluntad abre `p` (etiqueta de 1 byte `p` = 70h) y lee sus parámetros como qwords little-endian. | `voluntad.jsm:62-74` |
| 2 | Lanza `hijo` (etiqueta `68 69 6A 6F`) con derechos 15 (pedido 16); guarda el número del hijo. | `voluntad.jsm:91-103` |
| 3 | Habla con `say` (30 al número del hijo) y oye con `hear` (31; vacío → 29; −1 → `jhalt`). | `voluntad_semilla.jsm:2225-2254` |
| 4 | Termina diciendo una orden de fin; el hijo responde su huella. | `voluntad.jsm:372-378` |

El binario del hijo debe estar en la casa como `hijo` (por ejemplo `razar/cardumen/conserva_prueba.sh:16`).

### 5.2 Tabla de programas

| Programa | Hijo | `p` (qwords leídos) | Otras entradas | Fuente |
|---|---|---|---|---|
| `voluntad.jsm` | `cardumen_lazo` | 4: lado n, cosas k, vueltas, semilla de la escuela | — | `voluntad.jsm:16-74` |
| `voluntad_hilos.jsm` | `cardumen_lazo` | 4 (como `voluntad.jsm`) | `cosas` (k × 4 bytes: 3 piezas y uno sin uso); `cantos` (por cosa: 2 bytes cantidad, luego 3 bytes por nota; después, canciones nuevas) | `voluntad_hilos.jsm:1-40`, `174-212`, `662`; `voluntad_hilos_prueba.sh:34-55` |
| `voluntad_canto.jsm` | `cardumen_canto` | ninguno | 30 palabras fijas, 3 pasadas | `voluntad_canto.jsm:1-12` |
| `voluntad_oraciones.jsm` | `cardumen_canto` | 4: semilla, % de dedos que resbalan, quieto, `CONFN` | — ; escribe `cf` | `voluntad_oraciones.jsm:14-21`, `589-600` |
| `voluntad_juego.jsm` | `cardumen_cubo` | 6: semilla, lado, vueltas, acertijos practicados, tipo (0 mas, 1 mas y menos), quieto | — | `voluntad_juego.jsm:1-20`, `90-101` |
| `voluntad_acertijos.jsm` | `cardumen_cubo` | 18: semilla, `DESLIZ`, `N0`, `CRECE`, `TOPE`, `RONDAS`, `CUENTAS`, quieto, `TIPO`, `EJEM`, `LISTA`, `REVU`, `ESCRITA`, `MODO`, `ENSENA`, `PREGUNTA`, `REPS`, `CIEGOS` | — | `voluntad_acertijos.jsm:77-97`, `232-243` |
| `voluntad_semilla.jsm` | `cardumen_cubo` | 11: semilla, lado, vueltas, quieto, `PASADA`, `MEMO`, `REPS`, `CONSV`, `UNA`, `VER`, `PRECIO` | `marcos` (líneas `M:`/`N:` de §2.10) | `voluntad_semilla.jsm:50-67`, `159-172` |

La cabecera de `voluntad_acertijos.jsm` habla de 12 qwords y la de `voluntad_semilla.jsm` de 8; el código lee 144 y 88
bytes respectivamente.

### 5.3 `voluntad.jsm` (con `cardumen_lazo`)

Por vuelta r: cosa `m = r mod k`; orden 1 con sus 3 piezas; respuesta (máscara y pasos). Lo aprendido `L[g][j][t]` =
veces que la pieza de arriba j despertó en el paso t cuando dijo g. Adivina la cosa g que maximiza
`Σ_{j despierto} L[g][j][paso_j] / oídas(g)` (comparación por producto cruzado); si nadie ayuda, tira el dado mod k.
Aprende siempre lo que dijo. Si acertó (y algo respondió), suena otra vez la misma señal; si no, mueve una de las 3
piezas de esa cosa (la quita, corre las siguientes y sortea una nueva al final). Huella:
`cosa·8 + adivinada·2 + acierto + 1` por vuelta, mezclada con `j0 = (j0·31 + v) mod 2^48` (`voluntad.jsm:137-315`).
Cada 50 vueltas agrega a una línea los aciertos del bloque; la línea se escribe una vez al final con el pedido 1
(`voluntad.jsm:325-342`). Sala 0 de 2000h bytes; lo aprendido vive en una sala de `k · n² · n³ · 8` bytes pedida con el
pedido 2 (`voluntad.jsm:49`, `75-89`).

### 5.4 `voluntad_hilos.jsm`

Como `voluntad.jsm`; con `cosas`, cada cosa se dice con las piezas dadas y nunca se mueven; en el último cuarto de las
vueltas cuenta lo adivinado y escribe `C: <cosa> <bien> <todas> <otra más adivinada> <veces>`. Con `cantos`, cada cosa
es una canción y se adivina por forma (coseno, según la cabecera); las canciones después de las k se oyen una vez al
final y se escribe `U: <canción> <cosa o ->` (`voluntad_hilos.jsm:1-29`; criterios de la prueba en
`voluntad_hilos_prueba.sh:56-70`; el cálculo del coseno no verificado línea por línea).

### 5.5 `voluntad_canto.jsm` y `voluntad_oraciones.jsm`

`voluntad_canto.jsm` dice sus 30 palabras como canciones (orden 4) en 3 pasadas y adivina por ritmo; huella
`dicha·1024 + (adivinada + 1)·2 + acierto` (`voluntad_canto.jsm:1-12`). `voluntad_oraciones.jsm` aprende 30 palabras en
20 pasadas con la orden 6 y dedos que resbalan, lee 40 oraciones de 3 a 5 palabras y oye 20 palabras nuevas
(`voluntad_oraciones.jsm:1-12`, no verificado en detalle).

### 5.6 El archivo `cf`

Con `CONFN` > 0, `voluntad_oraciones.jsm` canta cada una de las 30 palabras `CONFN` veces y cuenta `CONF[w][g]`:
columna 0 = nada adivinado, columna g + 1 = adivinó g. Borra `cf`, lo abre y escribe los 30 × 31 qwords (7440 bytes,
fila w = palabra cantada) (`voluntad_oraciones.jsm:767-836`). `memoria_pares.jsm` lo lee como tabla de temblor (§2.6).

### 5.7 `voluntad_juego.jsm` y `voluntad_acertijos.jsm`

`voluntad_juego.jsm`: cada palabra (uno..seis, mas, menos) es un conjunto de 3 piezas sorteado; un acertijo "a op b" es
una canción de 3 saludos (orden 6); adivina la respuesta por la melodía; acierto → se canta otra vez; error → se mueve
una pieza de una de las tres palabras. Practica acertijos sorteados y luego se le preguntan los no practicados sin
aprender (`voluntad_juego.jsm:1-20`). `voluntad_acertijos.jsm`: tres etapas (oído con crecimiento del lado, conteo,
acertijos por igualdad de caminos) descriptas en su cabecera (`voluntad_acertijos.jsm:1-29`) (no verificado en
detalle).

### 5.8 `voluntad_semilla.jsm`

Lee `marcos` (cada línea `M:` = 9 números: semilla, oración, contesta, leída, t1..t5; registros de 72 bytes `ITB`) y,
con `MEMO` = 3 o 4, las notas `N:` (`voluntad_semilla.jsm:672-981`). Cada token se dice con 3 piezas distintas de abajo
sorteadas; un marco es una canción de 5 saludos (orden 6). Aprende de dos cajones ("contesta" / "no contesta") y sortea
mitad de cada uno; acierto → se canta otra vez; error → se mueve una pieza de una de sus 5 palabras. Después pregunta
cada pregunta apartada con las canciones sólo oídas (bit 16): de sus oraciones, la de mayor `parte(contesta) −
parte(no contesta)` es su respuesta. Con `MEMO` el núcleo recuerda cada marco por sus notas (`memorize`, `recall`); con
`PRECIO` puede decir "no sé" (`voluntad_semilla.jsm:1120-1124`, `1465-1468`, `1867-1870`). Al final pide la orden 7 y
escribe `semilla en el cubo: nace=... | piezas fuera de su total: <x> ... pesos en el techo: <y>%`
(`voluntad_semilla.datos.jsm:3-31`; prueba `razar/cardumen/conserva_prueba.sh:17-31`).

---

## 6. `encadena.jsm`

Lee `pares` con `Q:` (pregunta), `O:` (oraciones de su respuesta) y `R:` (verdad de una pregunta compuesta, sólo para
el juez) (`encadena.jsm:1-25`, no verificado línea por línea):

- **Paso**: las preguntas leídas (con `O:` después) se agrupan por su "clase" (sus palabras con la entidad como lugar;
  entidad = la palabra suya que más oraciones de su respuesta dicen). Una clase dicha por dos casos o más, en la que
  entre las palabras de sus respuestas cambia exactamente un lugar además de la entidad, es un paso.
- **Paréntesis**: entre la cabeza del paso más largo que empieza una pregunta compuesta y el final de cabeza más largo
  que la termina; de los dichos por dos, el que arma más preguntas compuestas.
- **Respuesta**: la compuesta se arma desde la derecha y se corren sus pasos sobre las oraciones del libro.

Salida (`encadena.datos.jsm:12-52`): `paso: ...`, `parentesis: <texto> | lo dicen <n> compuestas`, y por compuesta
`C: <pregunta> | <k> pasos | dice: <respuesta o -> | verdad: <R: o -> | <1 si iguales>`. La prueba exige, por ejemplo,
`C: quien engendro a aquel que engendro a ana | 2 pasos | dice: rosa | verdad: rosa | 1`; con el eslabón roto,
`dice: - | verdad: - | 1` (`razar/cardumen/encadena_prueba.sh:30-37`).

---

## 7. Jueces externos (`razar/jueces/`)

Programas Python que Razar nunca lee: miden desde afuera los archivos de la casa contra bancos que Razar no vio. Se
corren con `python -I` (`razar/jueces/LEEME.md:1-23`).

### 7.1 Nitidez

**`juez_nitidas.py <nitidas> <mats_es>`** (`razar/jueces/juez_nitidas.py:1-27`):

| Paso | Regla |
|---|---|
| Entrada | Líneas de 3 campos `a b k` (formato viejo) o 4 campos `clave k a b` (diario); suma `k` por pareja sin orden. |
| MATS | Para cada familia y relación del directorio, líneas `palabra\trespuesta[/otra]` en minúsculas. |
| Real / azar | `kt` = máximo de nitidez con sus respuestas; `kc` = máximo con las respuestas del par siguiente de la misma relación (circular). Si ambos son 0 se omite. |
| Cuenta | `real` si `kt > kc`, `azar` si `kt < kc`, `empate` si iguales; por familia (primer carácter) y por relación (3 primeros caracteres). |
| Salida | `parejas nitidas <n>`; luego `<clave>\treal a\tazar b\tempate c\t<ejemplos>` (familias siempre; relaciones con `a + b ≥ 3`; hasta 14 ejemplos por familia). |

**`nitidez_mats.py <corpus> <mats_es>`** (`razar/jueces/nitidez_mats.py:1-44`): la misma comparación sin Razar; los
"moldes" de una palabra son las secuencias de 1 a 3 palabras a su derecha (`A`) o izquierda (`B`), salvo las hechas
sólo de las 200 palabras más dichas (criterio declarado). Tokens: `[^\W\d_]+`.

**`nitidez.py <imaginado> <fuente> <validador>...`** (`razar/jueces/nitidez.py:1-57`): toma el 20 % de las líneas de
`imaginado` (semilla 3), su texto "z relación b" (3 a 5 palabras) y su tipo (`i`/`a`); para cada voto que la fuente no
dice, su nitidez k = máximo de moldes compartidos entre b y las palabras que la fuente da a "z relación" (tope 10);
confirmado si algún validador dice "z relación b"; convive si dice otra cosa. Salida por k: confirmados/decididos con
y sin mecanismo.

**`puntaje_mec.py <imaginado> <fuente> <validador>...`** (`razar/jueces/puntaje_mec.py:1-67`): por mecanismo, en tres
niveles (átomo = instrucción, molécula = instrucción sobre su relación, planeta = todo): confirmados / dichos de otra
manera / en espera, con y sin mecanismo. Puntaje = `100·c/(c + o)`; sólo filas con ≥ 20 decididos; prueba de dos
proporciones con |z| > 3.

**`replica.py <imaginado> <fuente> <v1> <v2>`** (`razar/jueces/replica.py:1-50`): z de cada átomo contra sus votos `a`
en cada validador (≥ 20 decididos en ambos); cuántos con z > 3 en el primero repiten en el segundo y la correlación de
z entre los dos.

**`barajar_palabras.py <in> <out> igual|barajar`** (`razar/jueces/barajar_palabras.py:1-18`): parte cada línea en
palabras `[a-z0-9À-ÿ]+` y signos de un carácter, conserva el esqueleto y, con `barajar`, baraja sólo las palabras de
todo el corpus (semilla 2026).

**`moldes.py <texto_original> <bytes> [n_cola]`** (`razar/jueces/moldes.py:1-59`): nombres = palabras con mayúscula
inicial ≥ 3 veces y ≥ 9 veces más que en minúscula, de más de 2 letras; partes de 100000 bytes; 20000 muestras (semilla
5) de nombre con nombre de otra parte contra nombre con palabra de igual frecuencia; moldes de 1 a 3 palabras sin las
`n_cola` más dichas (0 si falta). Defecto: la condición "no después de un fin de oración" busca siempre en la cadena
vacía (`if False else ''`, `moldes.py:15`), por lo que cuenta toda palabra que no sea la primera de su línea.

### 7.2 Código máquina

| Juez | Entrada | Mide | Fuente |
|---|---|---|---|
| `extraer_codigo.py <exe> <out>` | PE | Las secciones con `IMAGE_SCN_MEM_EXECUTE` (20000000h) en hexadecimal, 16 bytes por línea, sin desensamblar. | `razar/jueces/extraer_codigo.py:1-20` |
| `enfoque_bits.py <exe> real\|corrido3\|barajado` | PE | Para k = 2..24 y cada arranque, MDL de dos partes `(datos + V·k + V·lg N)/(N·k)` en bits por bit; los 6 mejores. El archivo no importa `struct`, `collections`, `math`, `random` ni `sys`: tal como está, falla con `NameError` (verificado por lectura, no ejecutado). | `razar/jueces/enfoque_bits.py:1-28` |
| `segmentar_mdl.py <exe> <lst>` | PE y listado FASM | Une el par adyacente más frecuente mientras baje el costo `datos + Σ(8·len + lg N)` de las palabras inventadas; precisión, recuerdo y F1 de los bordes contra los inicios de instrucción; nulos barajado (semilla 2026) y bordes al azar (semilla 7). | `razar/jueces/segmentar_mdl.py:1-56` |
| `medir_lexico.py <exe> <lst>` | ídem | Ejecuta la parte de `segmentar_mdl.py` anterior a `def f1` y mide cuántas palabras inventadas caen dentro de una sola instrucción. | `razar/jueces/medir_lexico.py:1-39` |
| `torrecitas.py <paisaje>` | Líneas `organo X = s (sin b)` | Repite cada órgano que supera la base `round((s − b)/100)` veces y aplica la misma unión MDL (letras a `lg 9` bits); nulo con puntajes barajados (semilla 2026). | `razar/jueces/torrecitas.py:1-45` |

`marcha_regla.py` no pertenece a Razar: evalúa una regla de marchas sobre archivos `.oido`/`.marcha`
(`razar/jueces/marcha_regla.py:1-60`) y no figura en `LEEME.md`.

---

## 8. Invariantes y límites

| Invariante o límite | Valor | Fuente |
|---|---|---|
| Regla de dos | Un contexto crece y se usa sólo si lo dicen ≥ 2 pares; una forma es relación con ≥ 2 pares; un valor está confirmado con ≥ 2; una hipótesis necesita ≥ 2 confirmaciones. | `memoria_pares.jsm:3978-3988`, `hilos.jsm:1164-1169`, `3226-3237`, `5069-5074` |
| Símbolo del canto | 1 byte; lugares sólo si `BASE + 3 + k < 256`. | `memoria_pares.jsm:1920-1928` |
| Letras del canto | ≤ `BASE²` (49 ó 900). | `memoria_pares.jsm:689-693` |
| Largo del canto | ≤ `MAXA` símbolos. | `memoria_pares.jsm:4176-4185` |
| Palabras intermedias de una forma | 1 a 3. | `hilos.jsm:1026-1031` |
| Saludos por canción del cubo | ≤ 255 (8 bits). | `cardumen_cubo.jsm:92-97` |
| Pasos por canción del cubo | ≤ 256 + n³. | `cardumen_cubo.jsm:152-154` |
| Lado de `cardumen_lazo` | ≤ 7. | `cardumen_lazo.jsm:12-14` |
| Lado de `cardumen_canto` | 4 (fijo). | `cardumen_canto.jsm:56-107` |
| Tramo de lectura de `lugares` | ≤ 32300 bytes por pedido. | `hilos.jsm:7988-7990` |
| Pedazo por defecto de `hilos` | 102400 bytes. | `hilos.jsm:611-613` |

---

## 9. Lo que quedó sin verificar

- La correspondencia de los temblores 40 y 90 milésimas con mediciones del cubo (§2.6).
- Cómo el cuerpo de Luma escribe `pares`/`canta`/`dados` y lee `cantado` (`gen_leer.py`, §2.8; capítulo 08).
- Los casos completos de `hx_rescue` (§3.7).
- Las claves internas de `hl_partes` (§3.17).
- Las líneas de la tanda (`T:` .. `F:`) y su orden (§3.18).
- La cota de pasos del cubo como demostración (§4.1).
- La ola de una señal en `cardumen_lazo.jsm` (§4.4).
- `cardumen.jsm` y `cardumen_olas.jsm` más allá de su cabecera (§4.5).
- El coseno de `voluntad_hilos.jsm` con `cantos` (§5.4).
- El detalle interno de `voluntad_oraciones.jsm`, `voluntad_juego.jsm` y `voluntad_acertijos.jsm` (§5.5, §5.7).
- El algoritmo de `encadena.jsm` línea por línea (§6).
- Que `enfoque_bits.py` falle al ejecutarse (deducido de la lectura; no se ejecutó).
- La respuesta del pedido 30 cuando no existe la cabina destino (§1.1, §2.8).
- Por qué un hijo no puede usar el pedido 2 por su cuenta (§4.2; capítulo 04).
- Cómo queda en la casa el binario que `hilos` recarga con el pedido 36 (§3.2).
