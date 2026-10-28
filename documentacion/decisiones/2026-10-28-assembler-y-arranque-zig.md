# Núcleo en assembler, arranque en Zig

**Fecha:** 2026-10-28 · **Decide:** Capitán

## Decisión

- El juego y el motor se escriben en **assembler**, una versión por familia de procesador: **x86-64**
  (PC) y **ARM64** (celulares, Mac).
- Un **módulo de arranque en Zig** corre antes que todo y:
  1. Identifica la familia y las **extensiones** del procesador (CPUID en x86, registros de
     identificación / auxv en ARM).
  2. Para cada función del juego elige la implementación más rápida que ese procesador soporta.
  3. Recién entonces arranca el juego, ya adaptado.
- **Se elige por capacidad, nunca por modelo.** Un procesador desconocido de una familia conocida declara
  sus extensiones (SSE/AVX2/AVX-512, NEON/SVE…) y recibe las funciones que corresponden, sin lista de
  modelos.
- La elección se hace una sola vez al arrancar: cada llamada posterior va directo a la función elegida.

## Por qué

Rendimiento máximo en cada máquina sin cargar código que no se usa, y un juego que se adapta solo a
procesadores que todavía no existen.

## Reglas que se desprenden

- **Todas las variantes de una función dan el mismo resultado, bit por bit.** Sin eso, dos pares con
  procesadores distintos calculan distinto un combate y se rompe el acuerdo entre pares. Cada variante se
  prueba contra las demás con los mismos casos.
- Matemática de la simulación en **punto fijo**, no flotantes.
- Las firmas Ed25519 tienen vectores de prueba compartidos con Wenas (`icebreak_core/test/vectors.json`).

## Abierto

- **Familia de procesador nueva** (p. ej. RISC-V): ningún assembler x86/ARM corre ahí. Falta decidir qué
  hace el juego en ese caso.
