# Estado de Janax

2026-10-28 — Proyecto creado. Sin código todavía. Stack sin decidir.

2026-10-28 — Stack: idioma Janax (assembler propio), todo en assembler, escalón 0 a mano en x86-64.
FASM 1.73.35 instalado en E:/DevCache/fasm y probado (PE64 mínimo, código de salida 42). Spec v0 en
documentacion/idioma/especificacion-v0.md, en revisión del Capitán. Sin código del escalón 0 todavía.

2026-10-28 — Escalón 0: intérprete de referencia en assembler x86-64 (`escalon0/janax.asm`, 2,6 KB), 16 instrucciones,
21/21 pruebas (`bash escalon0/pruebas/correr.sh`). Falta: memoria, pila y llamadas; traductor a x86-64.
2026-10-28 — Intérprete con memoria (1 MiB), pila de datos en j15, llamadas con pila de retorno separada: 22 instrucciones,
32/32 pruebas. Mapa de equivalencias x86-64/ARM64/RISC-V y diseño del Cambiaformas en documentacion/idioma/cambiaformas.md.
Siguiente: traductor de Janax a x86-64 (primer cambio de forma real).
2026-10-28 — Traductor Janax → x86-64 (`escalon0/traductor.asm`): traduce todo antes de correr, bloques fijos de 64 bytes con
plantillas parcheadas. 32 pruebas × 2 motores = 64/64 idénticos. Banco `escalon0/bancos/suma_100m.jsm` (300 M instrucciones,
mismo resultado): intérprete ~1.420 ms, traductor ~230 ms (6×, 3 corridas; con relleno NOP era ~810 ms). Los registros Janax
viven en memoria: llevarlos a registros nativos es la próxima ganancia, a medir.
