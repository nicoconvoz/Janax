# Estado de Janax

2026-10-28 — Proyecto creado. Sin código todavía. Stack sin decidir.

2026-10-28 — Stack: idioma Janax (assembler propio), todo en assembler, escalón 0 a mano en x86-64.
FASM 1.73.35 instalado en E:/DevCache/fasm y probado (PE64 mínimo, código de salida 42). Spec v0 en
documentacion/idioma/especificacion-v0.md, en revisión del Capitán. Sin código del escalón 0 todavía.

2026-10-28 — Escalón 0: intérprete de referencia en assembler x86-64 (`escalon0/janax.asm`, 2,6 KB), 16 instrucciones,
21/21 pruebas (`bash escalon0/pruebas/correr.sh`). Falta: memoria, pila y llamadas; traductor a x86-64.
