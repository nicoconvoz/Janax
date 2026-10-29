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
2026-10-28 — Traducción incremental: caché <programa>.x64 con huella FNV del traductor; solo se retraducen las palabras que
cambiaron (y los saltos si cambia el largo). 100/100 pruebas (incluye caché corrupto → se descarta). MEDIDO: no acelera el
arranque (250k palabras: ~125 ms sin caché, ~125-155 ms con caché; piso del proceso ~80 ms) porque traducir una plantilla
cuesta lo mismo que copiar el bloque guardado. El caché va a pagar cuando la traducción sea cara (Cambiaformas).
2026-10-28 — Idea x/y/a del Capitán: registros Janax en registros nativos (j0-j9 y j15; j10-j14 en memoria) y las "a"
(add/sub/mul/and/or/xor con rd = ra nativo) como UNA instrucción x86; las "x/y" cargan, envuelven y guardan. 106/106
(nuevas: registros en memoria en todos los roles, destino = segundo operando). Banco suma_1000m (3.000 M instrucciones):
traductor anterior ~1.560 ms, nuevo ~980 ms (1,6×). Próximo freno medido a ojo de código, no cronometrado: cada bloque
fijo termina en un salto al siguiente (3 saltos extra por vuelta del bucle) → disposición compacta con mapa de direcciones.
2026-10-28 — Autoajuste (Capitán: "nada fijo ni a ojo"): instrucciones de largo exacto enlazadas con tabla de
direcciones (sin bloques de 64 ni saltos de relleno) y mapa de registros elegido por uso del programa (los 11 más usados a los
11 nativos libres: 16 − rsp − contexto − 3 de trabajo). 107/107 (nueva: cambio de mapa retraduce todo). suma_1000m:
anterior ~960 ms, nuevo ~370 ms (2,6×; ~290 ms sin el piso de proceso = 1 vuelta por ciclo de reloj). Caché 17 MB → 2,3 MB.
Pendiente medir: el uso se cuenta estático (sin pesar bucles).
2026-10-28 — ARM64: traductor cruzado `escalon0/traductor_arm64.asm` (corre en la PC, escribe un ELF estático Linux
ARM64). Los 16 registros Janax en nativos (jK = xK); división y desplazamientos son "a" en ARM (SDIV/LSLV ya dan lo de Janax).
Probado en el teléfono real del Capitán (Moto E7 Plus, Android 10) por adb: 34/34; suite total 141/141 (trampa detectada
también en ARM). suma_1000m en el teléfono: ~1.450 ms, ejecutable de 420 bytes. Pendiente: saltos jjz/jjnz más allá de
±1 MiB (código 10, no implementado).

2026-10-28 — CAMBIO DE RUMBO (Capitán): el MMORPG queda para después. Antes se diseña un sistema operativo.
Todo lo hecho (idioma Janax, intérprete, traductores x86-64 y ARM64, diseño P2P del MMORPG) queda como está.
2026-10-28 — Janax OS S1 (`so/janaxos.asm`): simbiosis sobre Windows (detecta rcx = PEB), un camarote por programa, planificador
LAS sin turno fijo. 5/5 (corredor arreglado: leía el código de `tr`). Medido: dos procesos iguales cuestan el doble por cambiar
cada ~2 instrucciones (~7,5 ns por cambio). Detalle en documentacion/so/janaxos.md.
2026-10-28 — Turno por prioridad real (Capitán): t = ((D+c)+sqrt((D+c)^2+4cs))/2, c medido al arrancar (5,8–9,7 instr).
Dos procesos iguales: 4.570 → ~2.200–2.500 ms (igual que secuencial). 7/7.
2026-10-29 — Ventanilla de Janax OS (Capitán: mínimas pantallas, sintonía cambiante): instrucción jsys (op 16h), cola de
pedidos en el camarote, pantallas por sintonía atendidas en lote (3 escrituras = 1 llamada al anfitrión), resintonización por
ronda sin reloj, camarote que crece y se achica. 14/14 OS + 141/141 escalón 0.
2026-10-29 — Archivos en Janax OS: pedidos abrir/leer/escribir/cerrar por la ventanilla, etiquetas UTF-8 validadas (emojis),
nombres en hexadecimal en una carpeta propia, manijas por proceso. Probado: guardar 🦎 notas.txt y leerlo en otra corrida.
19/19. Pendiente: normalización Unicode.
2026-10-29 — Porteros de Janax OS (Capitán: jerarquía sobre microporteros con ramas anchas): árbol raíz → puerta → micro
por proceso, atenuación, verificar subiendo a la raíz, revocar = una marca con cascada gratis, permisos al lanzar
(programa.bin@pmlg), pedidos ceder/usar/revocar/consultar. 23/23.
2026-10-29 — Archivos: borrar, renombrar, listar y normalización NFC (vía Windows en simbiosis). 26/26. ARM64: forma larga
de saltos condicionales (generada en PC, falta el teléfono).
2026-10-29 — Porteros por etiqueta: prefijo por nodo (al lanzar @..:hex o pedido 15), verificado en toda la subida,
listar filtra. 31/31.
