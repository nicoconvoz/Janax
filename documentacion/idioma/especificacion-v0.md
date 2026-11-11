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
| 17 | `jhost rd, ra` | la ventanita al anfitrión (abajo) |
| 18–19 | `jjn`/`jjnn rd, destino` | salta si `rd` es / no es negativo (el cero no es negativo). *La diferencia es la respuesta* (Capitán): `jsub` + `jjn` compara en dos instrucciones, sin `jldi 63` ni `jsar` |
| 1A | `jldadd rd, ra, imm` | la palabra en `ra + imm` suma `rd`, y `rd` queda con la suma (*el álbum que suma mirando*). Mismas verificaciones que `jld`; la dirección se calcula antes de escribir |
| 1B | `jldx rd, ra, rb` | `rd` = la palabra en `ra + rb·8` (*la cuenta mientras lee*, profundidad 1). Mismas verificaciones que `jld` |
| 1C | `jcall0 rd, destino` | un `jcall` que deja `rd` en cero cuando la rutina vuelve (*el cero nace con la vuelta*). Un `jcall` común adentro no borra nada |

Las cinco de 18 a 1C son del 2026-11-11. Salieron de contar los modismos más escritos en Razar: `jldi r, 0` justo
después de un `jcall` (1.693 veces), `jld`/`jldi 1`/`jadd`/`jst` (407), `jsub`/`jldi 63`/`jsar`/`jjz` (426) y
`jldi 3`/`jshl`/`jld`/`jadd` (366). Ojo: se contó cuántas veces están escritas, no cuántas corren. Pruebas:
`escalon0/pruebas/45` a `50`.

Memoria de datos: 1 MiB que arranca en cero (criterio); `j15` arranca en el tope y se usa como puntero de
pila de datos. La pila de retorno está aparte y el programa no la puede leer ni pisar: así ningún error
de memoria puede desviar una vuelta. Profundidad máxima: 4096 llamadas (criterio). Errores: 5 fuera de
memoria, 6 acceso desalineado, 7 demasiadas llamadas anidadas, 8 `jret` sin `jcall`.

Equivalentes en cada procesador y el mecanismo de adaptación: `cambiaformas.md`.

### El while: el único bucle (marca de Janax, Capitán 2026-10-29)

En Janax **no existe el `for`**: todo bucle es un while. Un bucle con contador es un while sobre su contador.

```
jwhile r      ; repite mientras r no sea cero
  ...
jwend

jwhilez r     ; repite mientras r sea cero
  ...
jwend
```

Se pueden anidar. Son macros sobre las instrucciones de salto, con la forma de un **while rotado**:

```
      jjmp pregunta
cuerpo:
      ...
pregunta:
      jjnz r, cuerpo        ; jjz para jwhilez
```

Pregunta antes de la primera vuelta, como todo while (un while con `r` = 0 da cero vueltas), pero una
vuelta cuesta el cuerpo + 1 instrucción, igual que un bucle que pregunta al final. Escrito con la pregunta
arriba costaría el cuerpo + 2, y eso lo pagarían el intérprete y los dos traductores. Por todo el bucle se
pagan 2 instrucciones más que con un bucle que pregunta al final: el salto de entrada y la última pregunta.

Un bucle que tiene que dar al menos una vuelta (esperar a que algo pase) se escribe poniendo la condición
antes de entrar: `jldi r, 0` / `jwhilez r` / … calcula `r` … / `jwend`.

**La condición escrita a mano: `jwcheck`** (2026-11-11). Cuando la condición no es un registro solo (un Y,
un O, una comparación), se escribe entre `jwcheck` y `jwend`, y deja su resultado en el registro del while:

```
jwhile r
  ...cuerpo...
jwcheck
  jor r, a, b           ; la condición: corre antes de cada vuelta, la primera incluida
jwend
```

`jwcheck` no escribe nada: solo marca dónde está `pregunta:`, y el `jwend` queda como el único salto hacia
atrás. Sigue siendo un while rotado. Sin `jwcheck`, `jwend` es el de siempre. Dos `jwcheck` en el mismo
while, o uno fuera de un while, son un error.

- **O lógico:** `jor` es exacto (`a | b` es cero solo si los dos lo son).
- **Y lógico: `jand` no sirve**, porque es bit a bit: `2 AND 1 = 0` con los dos distintos de cero. Hay
  que pasar cada operando a máscara (todos unos si no es cero), con `jsub m, cero, a` / `jor m, m, a` /
  `jsar m, m, sesenta_y_tres`, y después `jand` entre las máscaras. Otra forma es con saltos hacia adelante:
  `jldi r, 0` / `jjz a, fuera` / `jjz b, fuera` / `jldi r, 1` / `fuera:`.

Prueba: `escalon0/pruebas/44_while_check.jsm` (Y, O, anidado y cero vueltas).

Los saltos `jjz`/`jjnz`/`jjmp` sueltos siguen existiendo para las decisiones ("si pasa esto, saltá"), no
para bucles.

Opcode desconocido y salirse del programa son errores del intérprete (códigos 1 y 2), nunca comportamiento
indefinido.

La notación con prefijo `j` es la del escalón 0 (macros de FASM, para no chocar con x86); el texto propio
del idioma sigue abierto.

## Abierto para decidir con el Capitán

- Nombre y forma de escribir las instrucciones (el "texto" del idioma).
- Cómo se llama al sistema (ventana, GPU, red, disco): por un conjunto fijo de llamadas al arranque.
- Si el idioma tiene flotantes para gráficos (donde el determinismo no importa) o solo punto fijo.

## `jhost`: la ventanita al anfitrión (Capitán, 2026-10-29)

> *"La ventanita expandible o comprimible: el ayudante da la lista de pedidos que puede dar y el capitán
> aprende lo que puede pedir."*

`jhost rd, ra` (op `17h`). `ra` apunta a un bloque de 32 bytes `{pedido, a, b, c}` (8 bytes cada uno, en la
memoria de datos y alineado a 8); la respuesta queda en `rd`.

- **Pedido 0, el catálogo**: `a` = dónde escribirlo (alineado a 8), `b` = lugar en bytes. Escribe una
  entrada de 16 bytes por pedido que el anfitrión ofrece (su nombre en 8 bytes, rellenado con ceros, y su
  número), las que entren, y responde **cuántos ofrece**.
- Un pedido que el anfitrión no ofrece responde **−1**. El programa no supone nada: lee el catálogo, busca
  por nombre y usa lo que hay. Si hay más, aprovecha; si hay menos, lo hace él mismo.
- Fuera de la memoria de datos es el código 5; desalineado, el 6.
- **Pedidos de hoy**: `escribir` (`a` = dirección, `b` = bytes; responde los bytes escritos en la salida).
- **Cada puerto tiene su ayudante**: Windows (intérprete y traductor x86-64, `escalon0/ventanita.inc`),
  Linux en el teléfono (traductor ARM64, con la llamada `write`) y Janax OS, que a sus procesos les da la
  **ventana vacía** (hablan con el sistema por la ventanilla, con sus porteros). En la PC, `JANAX_SIN=nombre,...`
  achica la ventana para probar que el programa se arregla con menos.
