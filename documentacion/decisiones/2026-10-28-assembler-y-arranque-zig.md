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

## Familia de procesador nueva: traductor de instrucciones (Capitán, 2026-10-28)

En una familia sin assembler propio (p. ej. RISC-V), el arranque traduce nuestro assembler a la familia
nueva:

- **Solo traduce nuestro código.** El assembler del juego se limita a un **subconjunto documentado** de
  instrucciones; el traductor cubre ese subconjunto y nada más. Una instrucción fuera del subconjunto es un
  error de compilación del juego, no un caso del traductor.
- **Traduce una vez, antes de arrancar**, y guarda el resultado en disco (con la huella del original para
  invalidarlo si cambia). Los arranques siguientes usan la traducción guardada.
- **Escrito en Zig**, que compila para la familia nueva.
- **Mismas pruebas bit por bit**: el código traducido da el mismo resultado que el original.
- **Más lento que el nativo**: cuánto, se mide cuando exista; no hay número todavía.
