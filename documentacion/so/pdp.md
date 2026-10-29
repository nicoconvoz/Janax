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
- **v0 entiende**: comentarios, etiquetas, `nombre = expresión`, las 23 instrucciones, `jwhile`/`jwhilez`/
  `jwend`, `jfirst`, `dd`, `include` de `janax.inc` (el idioma mismo, que conoce de nacimiento) y
  expresiones con números (decimales, hexadecimales con `h`), nombres, `$`, `+ - * /` y paréntesis.
- **Todavía no**: macros, `repeat` e `include` de otros archivos (las usan 9 de los 82 programas).
- Al terminar, `j0` = fuentes armadas + (fuentes con errores << 32).
- Mismas reglas que FASM donde importan para los bytes: el inmediato se recorta a 16 bits, y los saltos
  cuentan palabras desde la siguiente (`(destino - $ - 4) / 4`).

## Cómo se prueba

En `so/pruebas/correr.sh`, con los dos motores: FASM arma el ensamblador y su tabla (la semilla), y en una
carpeta del sistema se ponen las 82 fuentes de Janax (escalón 0, Janax OS, bancos y **el propio
ensamblador**) bajo `PDP/`. Se exige:

1. que arme **las 73 que entiende** y cuente como error las 9 que no;
2. que las 73 salgan **idénticas byte por byte** a las de FASM;
3. que una segunda corrida **no arme nada** (todo está al día);
4. que, cambiando una fuente, **arme solo esa**, y siga idéntica.

**El ensamblador se arma a sí mismo** (4.728 bytes) y da idéntico a lo que da FASM.

Primera corrida medida: 3 programas en 53.788 instrucciones Janax; la corrida que no arma nada, 8.590.

## Todas las combinaciones (Capitán: "así ya sabés que es igual byte a byte")

`so/herramientas/combinaciones.pl` genera 31 fuentes con ~700.000 instrucciones: todas las combinaciones de
registros de cada instrucción (16 × 16 × 16 en las de tres registros) y los 65.536 valores del inmediato y
de la distancia de salto con todos los bits de registro en 1 (si un negativo se derrama sobre los registros,
se ve). La mitad de los inmediatos va en decimal y la otra en hexadecimal. También `jsys`, `jwhile`, `jfirst`
con tamaños en los bordes y `dd`. Como una palabra es la unión de campos independientes, eso cubre cada bit
de cada campo y cada cruce. **Las 31 salen idénticas a FASM.** El ensamblador las arma en ~6,6 s (2.758
millones de instrucciones Janax, motor de rutinas). En la suite corre una vez, con el motor de rutinas.

PDP copia las carpetas del repositorio (`PDP/escalon0/pruebas/...`, `PDP/so/pruebas/...`), así los
`include` relativos encuentran sus archivos.

## Lo que sigue

- Macros, `repeat` e `include` de otros archivos, para entender los 82.
- La huella todavía no incluye el código del ensamblador (un programa no puede leer sus propias palabras):
  cambiar el ensamblador sin cambiar su tabla no rearma lo ya armado.
