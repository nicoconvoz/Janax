# PDP: el prototipado de programas y el ensamblador propio

> *"La escritura del programa escrito se guarda como un archivo, y si ya se compiló se deja guardado y no se
> carga innecesariamente. La primera carpeta del sistema para el prototipado de programas: PDP, ordenado
> por carpetas, jerarquías y ramas."* — Capitán, 2026-10-29

**PDP** es la primera carpeta del sistema. Sus carpetas son la parte de la etiqueta antes de cada `/`
(`PDP/pruebas/x.jsm`), y los porteros por prefijo ya funcionan como permisos por rama.

## El ensamblador PDP: Janax armado por Janax

Código: `so/pdp/ensamblador/ensamblador.jsm` (Janax) y su tabla `ensamblador.datos.asm`. Corre **dentro de
Janax OS**: recorre la carpeta `PDP` del sistema y arma cada fuente `X.jsm` en `X.bin`.

- **Lo ya armado no se vuelve a armar.** Junto a cada `X.bin` guarda `X.huella`: la huella FNV-1a de la
  fuente y de la tabla del ensamblador. Si la huella es la misma, no arma.
- **Su tabla es un archivo** (`ensamblador.datos`, los datos iniciales del programa): los nombres de las
  instrucciones, los registros y las directivas, con su valor y su forma. Cualquiera puede cambiarla (por
  ejemplo, darle otro nombre a una instrucción) sin tocar el ensamblador, y como la tabla entra en la
  huella, cambiarla rearma todo.
- **Dos pasadas**: la primera aprende dónde está cada etiqueta, la segunda escribe las palabras. Las
  etiquetas viven en una tabla de 65.536 entradas con dispersión FNV y una generación por fuente (no hace
  falta borrarla entre fuentes). `jwhile`/`jwend` usan una pila de whiles abiertos y recuerdan, por orden,
  dónde quedó cada condición.
- **Entiende**: comentarios, etiquetas, `nombre = expresión`, las 23 instrucciones, `jwhile`/`jwhilez`/
  `jwend`, `jfirst`, `dd`, expresiones con números (decimales, hexadecimales con `h`), nombres, `$`,
  `+ - * /` y paréntesis, y **las estructuras**: `include` (de `janax.inc` no lee nada: es el idioma mismo;
  cualquier otro archivo se lee relativo a la carpeta de la fuente, con `..`), `repeat` ... `end repeat`, y
  macros con parámetros, nombres `local` y argumentos agrupados entre `<` y `>`.
- **Las tres estructuras son textos anidados**: un archivo leído, un cuerpo copiado tantas veces como se
  pide, o un cuerpo con sus argumentos en su lugar (cada nombre `local` recibe el número de esa expansión).
  Se leen como parte de la fuente y después la lectura vuelve adonde estaba: una pila de lugares para
  volver. Los nombres `macro`, `repeat`, `end` y `local` también están en la tabla.
- **La huella suma los archivos incluidos**: si cambia `ambientes.inc`, se rearman los 7 programas que lo
  usan y nada más. Para saber qué incluye una fuente hay que leerla, así que la primera pasada corre siempre
  (una corrida sin nada nuevo cuesta la mitad que armar todo).
- Al terminar, `j0` = fuentes armadas + (fuentes con errores << 32).
- Mismas reglas que FASM donde importan para los bytes: el inmediato se recorta a 16 bits, y los saltos
  cuentan palabras desde la siguiente (`(destino - $ - 4) / 4`).

## Cómo se prueba

En `so/pruebas/correr.sh`, con los dos motores: FASM arma el ensamblador y su tabla (la semilla), y en una
carpeta del sistema se ponen las 82 fuentes de Janax (escalón 0, Janax OS, bancos y **el propio
ensamblador**) bajo `PDP/`. Se exige:

1. que arme **las 82**;
2. que las 82 salgan **idénticas byte por byte** a las de FASM;
3. que una segunda corrida **no arme nada** (todo está al día);
4. que, cambiando una fuente, **arme solo esa**, y siga idéntica;
5. que, cambiando un archivo incluido, **arme justo las fuentes que lo incluyen** (7), y sigan idénticas.

**82 de 82, el ensamblador incluido: se arma a sí mismo** (7.728 bytes) y da idéntico a lo que da FASM. Entre
los 82 están el `repeat` de 30.000 instrucciones (120 KB), las macros con nombres locales y el `include` con
`..`.

Medido (motor de rutinas): armar los 82 desde cero, 147 millones de instrucciones Janax, ~615 ms; una corrida
sin nada nuevo, 74 millones, ~385 ms.

## Todas las combinaciones (Capitán: "así ya sabés que es igual byte a byte")

`so/herramientas/combinaciones.awk` (antes en Perl) genera 31 fuentes con ~700.000 instrucciones: todas las combinaciones de
registros de cada instrucción (16 × 16 × 16 en las de tres registros) y los 65.536 valores del inmediato y
de la distancia de salto con todos los bits de registro en 1 (si un negativo se derrama sobre los registros,
se ve). La mitad de los inmediatos va en decimal y la otra en hexadecimal. También `jsys`, `jwhile`, `jfirst`
con tamaños en los bordes y `dd`. Como una palabra es la unión de campos independientes, eso cubre cada bit
de cada campo y cada cruce. **Las 31 salen idénticas a FASM.** El ensamblador las arma en ~6,6 s (2.758
millones de instrucciones Janax, motor de rutinas). En la suite corre una vez, con el motor de rutinas.

PDP copia las carpetas del repositorio (`PDP/escalon0/pruebas/...`, `PDP/so/pruebas/...`), así los
`include` relativos encuentran sus archivos.

## Lo que sigue

- Guardar en la huella la lista de archivos incluidos, para no correr la primera pasada de lo que está al
  día.
- Un `include` anidado se resuelve relativo a la fuente principal, no al archivo que lo incluye (alcanza para
  los 82; FASM lo resuelve relativo a cada archivo).
- La huella todavía no incluye el código del ensamblador (un programa no puede leer sus propias palabras):
  cambiar el ensamblador sin cambiar su tabla no rearma lo ya armado.

## Sin FASM para Janax (2026-10-29)

> *"Hacé los 4, y donde te trabes preguntame, que yo veo lo que vos no ves."* — Capitán

- **Datos y texto**: `db` (números y texto entre comillas), `dd` y `dq` con listas, y `times cantidad
  sentencia` (otro texto anidado: la sentencia copiada tantas veces). Con eso **la tabla del ensamblador es
  una fuente Janax** (`ensamblador.datos.jsm`) y el ensamblador la arma idéntica a FASM.
- **El nombre de la salida**: `X.jsm` → `X.bin`; `X.ext.jsm` → `X.ext` (por ejemplo `ensamblador.datos`).
- **La semilla** (`so/pdp/semilla/ensamblador.bin` y `.datos`): el ensamblador armado por sí mismo, guardado
  en el repositorio. Nada de FASM para tenerlo: la semilla arma el ensamblador y su tabla desde sus fuentes,
  y ese resultado tiene que armarse a sí mismo idéntico (**su punto fijo**). Si el resultado ya no es la
  semilla (porque cambió el ensamblador), no se arma nada y el mensaje dice qué copiar a `semilla/`.
  Verificado: con un cambio real en el ensamblador avisa (código 3); con un cambio solo en los comentarios,
  no (los bytes son los mismos).
- **`so/herramientas/armar.sh`** arma cualquier lista de fuentes con el ensamblador PDP sobre Janax OS. Las
  dos suites (escalón 0 y Janax OS) lo usan para todos sus programas de prueba. FASM sigue como **testigo**
  en la suite del SO (los 82 programas y las combinaciones se comparan con él) y como ensamblador de lo x86
  (el núcleo y el escalón 0).

## Una etiqueta repetida es un error (2026-11-06)

Una etiqueta definida dos veces (`nombre:` dos veces en una fuente) pasaba en silencio: la segunda pisaba a la
primera y los saltos iban a una de las dos sin que nadie supiera cuál. Pasó dos veces armando los acertijos de Razar.
Ahora, en la primera pasada, una etiqueta que ya existe es un error (FASM también lo marca); `nombre = valor` se puede
seguir cambiando. La semilla se actualizó y llega a su punto fijo. Verificado: un programa con una etiqueta repetida
se rechaza, y los 126 programas del repositorio que tenían binario de referencia salen idénticos byte por byte.
