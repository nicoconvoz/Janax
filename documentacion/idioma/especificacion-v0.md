# Idioma Janax — especificación v0 (BORRADOR para el Capitán)

Estado: **propuesta**. Cada número dice qué mide y de dónde sale; lo que es criterio está marcado así.

## Escalones del compilador

**Todo en assembler, sin Zig ni ningún otro lenguaje** (Capitán, 2026-10-28).

0. **Escalón 0, escrito a mano en assembler x86-64** (Windows, la PC del Capitán): un intérprete de
   referencia (la **especificación ejecutable**, lento a propósito, vara de todas las pruebas) y un
   traductor mínimo de Janax a x86-64.
1. **El traductor de verdad se escribe en Janax** y lo compila el escalón 0. Desde ahí Janax se compila a
   sí mismo: una sola versión también para el traductor y el arranque.
2. **Traductor a ARM64** (celulares), escrito en Janax. Cada programa de prueba da el mismo resultado que
   el intérprete, bit por bit.
3. **Extensiones** (AVX2, NEON…), solo donde una medición muestre ganancia.
4. **Familias nuevas** (RISC-V): se agrega un destino al traductor, escrito en Janax.

## Máquina

| Elemento | Valor v0 | Fundamento |
|---|---|---|
| Registros generales | **16**, de 64 bits | x86-64 tiene 16 registros generales y ARM64 tiene 31: con 16, cada registro Janax cabe en uno real en las dos familias, sin pasar por memoria. |
| Ancho de instrucción | **32 bits fijos** | Se decodifica sin buscar dónde termina cada instrucción (el problema de x86). Igual que ARM64 y RISC-V. |
| Orden de bytes | **little-endian** | x86-64 y ARM64 (en Android, Windows, Mac y Linux) son little-endian: cero conversiones. |
| Vectores | **128 bits** | Es el ancho que todo x86-64 (SSE2) y todo ARM64 (NEON) tienen garantizado. Más ancho (AVX2, SVE) lo agrega el traductor como extensión. |
| Números | **enteros**; decimales en **punto fijo** | Los flotantes pueden dar resultados distintos entre procesadores; el punto fijo es entero por dentro y da lo mismo en todos. |

## Comportamientos que el idioma define (y los procesadores no hacen igual)

Si el idioma no los fija, cada procesador hace lo suyo y dos pares calculan distinto:

| Caso | x86-64 | ARM64 | Janax v0 |
|---|---|---|---|
| División por cero | interrumpe el programa | devuelve 0 | **devuelve 0** (el traductor x86 agrega la verificación) |
| Desplazamiento mayor que 63 | usa solo los 6 bits bajos | usa solo los 6 bits bajos | **usa los 6 bits bajos**, definido explícitamente |
| Desborde de suma/multiplicación | da la vuelta | da la vuelta | **da la vuelta** (complemento a dos) |
| Orden de memoria entre hilos | estricto (TSO) | relajado | **relajado + barreras explícitas** en el idioma |

## Codificación v0 (implementada en `escalon0/`)

Palabra de 32 bits, little-endian: `op[0..7] rd[8..11] ra[12..15] imm16[16..31]`; `rb` = los 4 bits bajos de
`imm16`. Los saltos son relativos a la instrucción siguiente, en palabras, con signo. La distribución de
campos es **criterio**, no medición: se revisa cuando el traductor muestre qué conviene.

| op | Instrucción | Efecto |
|---|---|---|
| 00 | `jhalt` | termina; el resultado es `j0` |
| 01 | `jldi rd, imm` | `rd = imm` con signo (−32768…32767) |
| 02–04 | `jadd`/`jsub`/`jmul rd, ra, rb` | da la vuelta en 64 bits |
| 05 | `jdiv rd, ra, rb` | con signo, trunca a cero; `/0 = 0`; `MIN / −1 = MIN` |
| 06–08 | `jshl`/`jshr`/`jsar rd, ra, rb` | usa los 6 bits bajos de `rb` |
| 09–0B | `jand`/`jor`/`jxor rd, ra, rb` | bit a bit |
| 0C | `jjmp destino` | salto |
| 0D–0E | `jjz`/`jjnz rd, destino` | salta si `rd` es / no es cero |
| 0F | `jshi rd, imm` | `rd = (rd << 16) | imm`: arma constantes de 64 bits |
| 10–11 | `jld`/`jst rd, ra, imm` | carga / guarda 64 bits en `ra + imm`; alineado a 8 |
| 12–13 | `jldb`/`jstb rd, ra, imm` | carga (sin signo) / guarda un byte |
| 14 | `jcall destino` | guarda la vuelta en la **pila de retorno separada** y salta |
| 15 | `jret` | vuelve a la última llamada |
| 16 | `jsys rd, ra` | **solo dentro de Janax OS**: toca la ventanilla con la cola de pedidos en `ra`; `rd` = atendidos (ver `documentacion/so/janaxos.md`) |

Memoria de datos: 1 MiB que arranca en cero (criterio); `j15` arranca en el tope y se usa como puntero de
pila de datos. La pila de retorno está aparte y el programa no la puede leer ni pisar: así ningún error
de memoria puede desviar una vuelta. Profundidad máxima: 4096 llamadas (criterio). Errores: 5 fuera de
memoria, 6 acceso desalineado, 7 demasiadas llamadas anidadas, 8 `jret` sin `jcall`.

Equivalentes en cada procesador y el mecanismo de adaptación: `cambiaformas.md`.

Opcode desconocido y salirse del programa son errores del intérprete (códigos 1 y 2), nunca comportamiento
indefinido.

La notación con prefijo `j` es la del escalón 0 (macros de FASM, para no chocar con x86); el texto propio
del idioma sigue abierto.

## Abierto para decidir con el Capitán

- Nombre y forma de escribir las instrucciones (el "texto" del idioma).
- Cómo se llama al sistema (ventana, GPU, red, disco): por un conjunto fijo de llamadas al arranque.
- Si el idioma tiene flotantes para gráficos (donde el determinismo no importa) o solo punto fijo.
