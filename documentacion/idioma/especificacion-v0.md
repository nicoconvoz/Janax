# Idioma Janax — especificación v0 (BORRADOR para el Capitán)

Estado: **propuesta**. Cada número dice qué mide y de dónde sale; lo que es criterio está marcado así.

## Escalones del compilador

1. **Intérprete de referencia en Zig.** Ejecuta el idioma tal cual dice esta especificación. Es lento a
   propósito: es la **especificación ejecutable** y la vara de todas las pruebas.
2. **Traductor a x86-64** (PC). Cada programa de prueba da el mismo resultado que el intérprete, bit por bit.
3. **Traductor a ARM64** (celulares). Misma vara.
4. **Extensiones** (AVX2, NEON…), solo donde una medición muestre ganancia.
5. **Familias nuevas** (RISC-V).

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

## Abierto para decidir con el Capitán

- Nombre y forma de escribir las instrucciones (el "texto" del idioma).
- Cómo se llama al sistema (ventana, GPU, red, disco): por un conjunto fijo de llamadas al arranque.
- Si el idioma tiene flotantes para gráficos (donde el determinismo no importa) o solo punto fijo.
