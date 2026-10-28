# Una sola versión: el idioma Janax

**Fecha:** 2026-10-28 · **Decide:** Capitán · **Reemplaza a:** `2026-10-28-assembler-y-arranque-zig.md`
(assembler escrito a mano por familia).

## Decisión

- El juego y el motor se escriben **una sola vez**, en el **idioma Janax**: un assembler propio, diseñado
  por nosotros para ser fácil de traducir.
- El **módulo de arranque en Zig**:
  1. Detecta la familia (x86-64, ARM64, RISC-V…) y las **extensiones** del procesador (SSE/AVX2/AVX-512,
     NEON/SVE…). Se elige por capacidad, nunca por modelo.
  2. **Traduce el juego** a ese procesador, aprovechando las extensiones que tenga.
  3. Guarda la traducción en disco con la huella del original y del procesador; los arranques siguientes la
     reutilizan, y se rehace si cualquiera de las dos huellas cambia.
  4. Arranca el juego.
- **Ninguna plataforma queda en desventaja**: PC y celular se traducen igual.
- **Assembler a mano solo donde una medición lo pida**: un pedazo caliente puede tener una versión escrita
  a mano para una familia, que reemplaza a la traducida.

## Por qué no traducir desde x86-64

x86 tiene instrucciones de largo variable, banderas implícitas y un orden de memoria más estricto que
ARM: traducirlo es mucho más difícil, los celulares correrían siempre traducidos, y el código original no
menciona extensiones que el procesador destino podría aprovechar.

## Lo que implica

Estamos creando **un lenguaje y su compilador** (como WebAssembly o LLVM por dentro). El diseño del idioma
Janax es el primer trabajo del proyecto.

## Reglas

- **Resultado idéntico bit por bit** en todas las familias y en las versiones a mano: si dos pares calculan
  distinto un combate, se rompe el acuerdo entre pares. Cada traducción se prueba con los mismos casos.
- La simulación usa **punto fijo**, no flotantes.
- El idioma Janax define su **orden de memoria** explícitamente, para no heredar el de ningún procesador.
- Las firmas Ed25519 comparten vectores de prueba con Wenas (`icebreak_core/test/vectors.json`).
- Rendimiento del código traducido: se mide cuando exista; no hay número todavía.
