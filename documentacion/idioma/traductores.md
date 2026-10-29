# Escalón 0: intérprete y traductores

**Estado al 2026-10-28.** Todo está escrito en assembler (FASM 1.73.35, `E:/DevCache/fasm/FASM.EXE`) y vive en
`escalon0/`. Es el andamio que después se reemplaza por el traductor escrito en Janax.

| Pieza | Archivo | Corre en | Produce |
|---|---|---|---|
| Intérprete de referencia | `janax.asm` | PC (x86-64, Windows) | ejecuta Janax tal cual la especificación |
| Traductor x86-64 | `traductor.asm` | PC | código nativo en memoria y lo corre |
| Traductor ARM64 (cruzado) | `traductor_arm64.asm` | PC | un ejecutable Linux ARM64 para el teléfono |
| Macros del idioma | `janax.inc` | — | arma las palabras de 32 bits de cada instrucción |
| Pruebas | `pruebas/*.jsm` + `pruebas/correr.sh` | PC + teléfono | — |
| Bancos | `bancos/*.jsm` | — | — |

## Cómo se prueba

```bash
bash escalon0/pruebas/correr.sh
```

Cada prueba `.jsm` declara `; espera: <16 hex>` (el valor de `j0` al `jhalt`) y/o `; codigo: <n>`. El
corredor ensambla los tres programas y corre cada prueba en:

1. el **intérprete**;
2. el **traductor x86-64** dos veces (la segunda desde el caché);
3. el **traductor ARM64**, en el **teléfono real** del Capitán por adb, si está conectado (sin emuladores:
   regla de la casa). Si no hay teléfono, avisa y no cuenta esas pruebas.

Además prueba la traducción incremental (caché vacío, desde caché, una palabra distinta, cambio de largo,
cambio del mapa de registros). Al 2026-10-28: **141/141**.

**El instrumento se verifica**: una prueba trampa con una expectativa falsa tiene que salir MAL en los
cuatro motores (verificado para intérprete, x86-64 y ARM64), y un caché corrupto tiene que descartarse
solo.

## Códigos de salida (los mismos en los tres motores)

| Código | Significado |
|---|---|
| 0 | `jhalt`; se imprime `j0` en 16 dígitos hexadecimales |
| 1 | opcode desconocido |
| 2 | el programa se salió de sus palabras (por caída o por salto) |
| 3 | no se pudo leer el archivo (o reservar memoria) |
| 4 | falta el argumento |
| 5 | acceso a memoria fuera de rango |
| 6 | acceso de 64 bits desalineado |
| 7 | demasiadas llamadas anidadas |
| 8 | `jret` sin `jcall` |
| 9 | error del traductor: una instrucción salió más larga que su límite |
| 10 | (ARM64) un `jjz`/`jjnz` a más de ±1 MiB: todavía no se maneja |

## La idea x/y/a (Capitán)

> Si una instrucción se escribe "x" en un lado y "y" en el otro, se traduce. Si es idéntica en los dos
> ("a"), pasa directa y te ahorrás el trabajo.

Cada instrucción Janax se clasifica, **por procesador**, según si significa lo mismo que la nativa:

| Janax | x86-64 | ARM64 |
|---|---|---|
| `jadd` `jsub` `jmul` `jand` `jor` `jxor` | **a** (si `rd = ra` y está en registro nativo) | **a** |
| `jdiv` | x/y: x86 corta el programa con /0 y con MIN/−1 → envoltorio | **a**: `SDIV` ya da 0 y MIN |
| `jshl` `jshr` `jsar` | x/y: el conteo tiene que estar en `CL` | **a**: `LSLV`/`LSRV`/`ASRV` |
| `jld` `jst` `jldb` `jstb` | x/y: límites y alineación | x/y: límites y alineación |
| `jcall` `jret` | x/y: pila de retorno propia | x/y: pila de retorno propia |

Una "a" se emite como **una sola instrucción nativa**. Una "x/y" carga sus operandos, pasa por una
plantilla con lo que el procesador hace distinto, y guarda el resultado.

## Traductor x86-64 (`traductor.asm`)

### Autoajuste: nada fijo (Capitán: "nada fijo ni a ojo")

- **Largo exacto.** Cada palabra Janax se traduce a exactamente los bytes que necesita, una detrás de la
  otra. Una tabla (`offs`) guarda dónde empieza cada palabra, y al final se **enlazan** los saltos.
  Reemplazó a los bloques fijos de 64 bytes, que obligaban a un salto de relleno por instrucción.
- **Registros por uso.** Se cuenta cuántas veces el programa usa cada registro Janax (`usage_masks` dice
  qué campos usa cada instrucción) y los **11 más usados** van a los 11 registros nativos libres (`rbx`,
  `rsi`, `rdi`, `r8`–`r15`). El 11 lo da el procesador: 16 registros, menos `rsp`, el contexto (`rbp`) y
  tres de trabajo (`rax`, `rcx`, `rdx`). El resto vive en el contexto, en `[rbp + j*8]`.
- **Límite por instrucción**: 255 bytes, porque el caché guarda cada largo en un byte. Pasarse es el
  código 9.

### Emisor

El traductor arma las instrucciones x86 byte por byte (REX + opcode + ModRM): `emit_rr` (registro con
registro), `emit_rm` (registro con `[rbp + disp32]`) y `emit_rop` (elige según dónde viva el registro
Janax). Las "x/y" usan plantillas ensambladas por FASM (`t_div`, `t_ld`, `t_call`…), que se copian y
parchean.

### Ejecución

`rbp` = contexto (registros en memoria, base de la memoria de datos, pila de retorno); `rax`, `rcx`, `rdx` =
trabajo. Un **stub de entrada** carga los registros nativos desde el contexto, llama a la primera palabra
y al volver los guarda; el código generado nunca toca `rsp` y termina con `ret` y el código de salida en
`eax`.

### Traducción incremental (Capitán: "solo las partes del diff")

- Caché en `<programa>.bin.x64`, formato `JX65`: encabezado de 32 bytes (magia, huella, cantidad de
  palabras, mapa de registros), las palabras, el largo de cada una, dónde está su campo de salto, y el
  código **sin enlazar**.
- **Huella del traductor**: FNV-1a sobre sus plantillas, su emisor y sus tablas. Si cambia el traductor,
  el caché viejo se descarta solo.
- Una palabra igual a la guardada copia sus bytes; una distinta se traduce. Los saltos se reenlazan en
  cada arranque, así que cambiar el largo del programa no obliga a retraducirlos. Si cambia el **mapa de
  registros**, se retraduce todo.
- `stderr` informa `traducidas N de M`.
- **Medido**: no acelera el arranque hoy, porque traducir con plantillas cuesta lo mismo que copiar. Va a
  pagar cuando la traducción sea cara (verificación y búsqueda del Cambiaformas).

## Traductor ARM64 (`traductor_arm64.asm`)

- **Cruzado**: corre en la PC y escribe un ejecutable **Linux ARM64 estático** (`ELF64`, `ET_EXEC`, base
  `0x400000`, un único segmento lectura-escritura-ejecución). La pila de retorno y la memoria de datos
  van como memoria en cero después del archivo.
- **Registros**: ARM64 tiene 31, así que **los 16 de Janax entran todos**: `jK = xK`. Trabajo: `x16`,
  `x17`. Fijos: `x19` memoria de datos, `x20`/`x21` pila de retorno y profundidad, `x22`/`x23` límites de
  memoria (8 y 1 byte).
- **Saltos**: `B` (±128 MiB) y `CBZ`/`CBNZ` (±1 MiB), enlazados al final con una lista de arreglos.
- Al `jhalt` una rutina fija escribe `j0` en hexadecimal con la llamada `write` y sale con `exit`.
- **En el teléfono**: Moto E7 Plus, Android 10, aarch64; se corre desde `/data/local/tmp` sin root. adb
  en `C:/Users/Nico/AppData/Local/Android/Sdk/platform-tools/adb.exe` (con `MSYS_NO_PATHCONV=1` desde Git
  Bash).

## Mediciones

Banco `suma_1000m` (j0 = 1 + … + 1.000.000.000; 3.000 millones de instrucciones Janax; resultado
`06F05B59F17F6500` en todos). Tres corridas cada uno; incluyen ~80 ms de arranque de proceso en la PC.

| Motor | Tiempo |
|---|---|
| Intérprete (PC) | ~14 s (extrapolado de `suma_100m`: ~1.420 ms) |
| Traductor x86-64, bloques fijos | ~1.560 ms |
| + registros nativos y "a" directas | ~960–980 ms |
| + autoajuste (largo exacto, registros por uso) | **~370 ms** (≈ 1 vuelta del bucle por ciclo de reloj) |
| ARM64 en el Moto E7 Plus | **~1.450 ms** (ejecutable de 420 bytes) |

PC y teléfono son procesadores distintos: comparar entre ellos no mide al traductor.

## Pendiente

- ARM64: saltos condicionales a más de ±1 MiB (hoy código 10).
- x86-64: el uso de registros se cuenta en el texto del programa, sin pesar los bucles.
- Caché por procesador y elección de candidatos verificados (el Cambiaformas de `cambiaformas.md`).
- Traductor y arranque escritos en Janax (escalón 1).
