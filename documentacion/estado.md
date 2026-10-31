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
2026-10-29 — Medición de c: el instrumento mentía (0 a 9,7). A-B-A + corridas largas + hilo fijo + mediana de 9: 1,17–1,64.
Se recuerda por huella del núcleo + procesador (arranque ~1,35 s → ~150 ms). 32/32.
2026-10-29 — Lote medido: 10.000 escrituras en un toque ≈ piso del arranque (1 llamada); uno por uno +130 ms (10.000
llamadas, ~13 µs cada una).
2026-10-29 — Teléfono conectado: escalón 0 145/145 en el Moto (salto lejano ARM64 verificado). Decisión de multifirma
anotada (el micro pide al macro); pesar bucles = contar vueltas reales.
2026-10-29 — Familia de procesos: lanzar desde archivos, porteros que copian a la familia, pedidos importantes esperan la
firma del padre (17 firmar, 18 pendientes, 19 estado), huérfanos adoptados, planificador que decide de nuevo por evento.
37/37; corredor con límite de tiempo por corrida.
2026-10-29 — Sombra del padre (Capitán): un padre que termina con descendientes vivos deja su sombra, que decide por su línea
con los permisos del padre; se disuelve sin nadie debajo. 38/38.
2026-10-29 — Cambio de estrategia (Capitán): en vez de generar código nativo, motor de rutinas: cada programa se
decodifica una vez a una tabla de rutinas nativas ya compiladas en el núcleo. 671 M instrucciones: 1,41 s contra 2,85 s
del intérprete (2×), mismos resultados. La suite corre con los dos motores: 76/76.
2026-10-29 — Todo en while (Capitán): `jwhile`/`jwhilez`/`jwend`, único bucle del idioma, armado como while rotado
(cada vuelta cuesta lo mismo; +2 instrucciones por bucle). Programas, bancos y calibración convertidos; el motor de
rutinas resuelve en el lugar el salto que cae sobre una condición. Escalón 0 113/113 (PC), Janax OS 80/80.
2026-10-29 — El núcleo x86 en while: 61 bucles + 2 del motor, todos while rotado; `bucles.pl` lo verifica en la suite
(82/82). Misma salida que antes en seis escenarios; sin costo medible (una medición que decía lo contrario dependía del
orden de las corridas). Falta el escalón 0: 27 bucles.
2026-10-29 — Escalón 0 en while: 27 bucles (intérprete, traductores x86-64 y ARM64). Sin teléfono, verificado con una foto
de lo que generan los traductores para las 36 pruebas: 216 archivos idénticos byte por byte. 116/116. Todo el diseño en
while. Encontrado de paso: la huella del caché x86-64 no cubre el código del emisor.
2026-10-29 — Huella del caché x86-64 arreglada: cubre todo el código del traductor (`code_begin..code_end`). Prueba nueva
que fallaba antes: una copia con un `nop` en el emisor reusaba el caché ("0 de 7"); ahora traduce todo ("7 de 7"). 117/117.
2026-10-29 — Reparto con el motor de rutinas (calculo, intercalado): una copia ~1,5 s, dos copias ~2,9 s (igual que
seguidas, justos a 46.000 instrucciones), c medido 7,96. Con LAS puro tardan ~14,6 s: sin el turno por prioridad el motor
rápido pierde todo. El intérprete compartiendo paga ~8–10 % (su c de 2,32 podría estar corto, sin investigar).
2026-10-29 — Fusión de parejas: toda instrucción que sigue de largo se funde con el jjz/jjnz que la sigue (regla
sacada de contar parejas ejecutadas: ninguna domina, pero toda vuelta de while termina en "algo → condición"). suma_1000m
~4,7 → ~3,7 s (21 %), calculo ~8 %, mismos resultados. 86/86.
2026-10-29 — Copias del mismo programa comparten palabras y tabla (comparación palabra por palabra, al nacer).
64 procesos: 131 → 69 MB; 1.000 copias: ~440 → ~320 ms; mismas salidas. 88/88.
2026-10-29 — Cada programa ocupa lo que pesa: un búfer de carga único y una copia a medida. 38 programas distintos:
77,5 → 41,7 MB, mismas salidas. 88/88.
2026-10-29 — Ambientes (Capitán): direcciones "ambiente + posición", agrandar construye en el lugar, destruir corre
los de atrás sobre el hueco y devuelve las páginas (64 MB: 66,6 → 2,4 MB); paquete fijo de traducción. Ambiente 0 ~+5 %
(sin explicar), ambiente construido ~+25 %. 96/96.
2026-10-29 — Ambientes: el ~5 % del ambiente 0 era el lugar del paquete (engordaba las rutinas), no lo que hace.
Paquete por rutina armado al final del código (postpone): ambiente 0 ~1.453 ms contra ~1.486 de antes; traducido ~1.764 ms. 96/96.
2026-10-29 — Primera orden (Capitán): el proceso nace sin memoria; su primer jsys (tamaño en el registro, macro
jfirst) construye el ambiente 0. Todos los programas que usan memoria la llevan. 64 procesos: 69 → 4 MB. 102/102.
2026-10-29 — Pila de retorno a medida (crece al llamar, se achica al fin del turno; mismo límite): 64 procesos 4 → 2 MB.
Destapó que el motor es sensible al lugar de cada rutina (±15 %): toda rutina de la tabla alineada a 16 bytes. 106/106.
2026-10-29 — Datos iniciales (Capitán): X.datos al lado de X, copiado al ambiente 0 en la primera orden; vale para los
programas que lanza un proceso. Base del ensamblador propio (PDP, caché por huella y prueba de todas las combinaciones,
anotados en ideas.md). 112/112.
2026-10-29 — Ensamblador PDP v0 (Capitán): Janax armado por Janax dentro de Janax OS; recorre PDP, rearma solo lo que
cambió (huella), tabla en ensamblador.datos. Arma 73 de 82 programas idénticos a FASM byte por byte, incluido él mismo.
Faltan macros, repeat e include de otros archivos. 124/124.
2026-10-29 — Prueba de todas las combinaciones (Capitán): 31 fuentes generadas (~700.000 instrucciones: todas las combinaciones
de registros y los 65.536 inmediatos y distancias de salto), idénticas a FASM byte por byte. PDP copia las carpetas del repo. 125/125.
2026-10-29 — Ensamblador PDP: include, repeat y macros como textos anidados (pila de lugares para volver); la huella suma
los incluidos. 82 de 82 idénticos a FASM, él mismo incluido (7.728 bytes). 82 desde cero: ~615 ms. 129/129.
2026-10-29 — Sin FASM para Janax: db/dq/dd en lista/times, la tabla como fuente Janax, semilla propia con punto fijo
(so/pdp/semilla) y armar.sh; las dos suites arman sus programas con el ensamblador PDP. Escalón 0 153/153 (con el teléfono),
Janax OS 129/129. FASM queda para lo x86 y como testigo.
2026-10-29 — jhost, la ventanita al anfitrión (Capitán): catálogo por nombre, "escribir"; intérprete, traductor x86-64,
ARM64 en el teléfono (rutina del ayudante codificada a mano, anduvo al primer intento) y Janax OS (ventana vacía para los
procesos). JANAX_SIN achica la ventana. Escalón 0 174/174 con el teléfono, Janax OS 131/131.
2026-10-29 — Primera pieza del núcleo en Janax: el planificador (so/nucleo/planificador.inc), turno exacto en enteros;
216 casos idénticos a la matemática exacta en intérprete, x86 y el teléfono. Cuesta ~300-890 instrucciones por turno;
falta decidir cómo conectarlo. Escalón 0 178/178.
2026-10-29 — Turno más barato: raíz entera + corrección exacta, ~150 instrucciones (antes 300-890); 226 casos idénticos
en intérprete, x86 y el teléfono. Suites 178/178 y 131/131.
2026-10-29 — Planificador en Janax conectado (Capitán: de PDP, personalizable): PDP/so/nucleo/planificador.bin o el de
fábrica dentro del núcleo; uno roto vuelve al de fábrica. Sin punto flotante en el turno. Un cambio cuesta ahora ~300
instrucciones (rutinas); compartir sigue igual que seguidos. Calibración por duración (~1-2,6 s). SO 137/137, escalón 0 178/178.
2026-10-31 — Los remeros (Capitán): camarotes en paralelo, un remero por núcleo, candado solo para lo compartido,
remeros que duermen sin trabajo. 4 calculo: 1 remero 6,7 s, 2 remeros 3,6 s (1,85×), 4 remeros ~2,8 s (2 núcleos con
hiperhilación). 300 corridas de estrés sin fallas. SO 145/145, escalón 0 178/178 con el teléfono.
2026-10-31 — Hoja de turnos (Capitán) medida: decisiones idénticas pero más cara en cambios seguidos (2,7× con c=0), porque
elegir quién rema pasa de x86 nativo a Janax; guardada en la rama hoja-de-turnos, no entra. Arreglado en master: D nunca
menor que 0 con remeros en paralelo. SO 145/145, escalón 0 178/178.
2026-10-31 — La última parte (Capitán): el núcleo halla en el código el camino derecho a jhalt y, si al acabarse el turno
falta lo mismo o menos que un cambio, el camarote termina en vez de pasar el remo. SO 148/148, escalón 0 178/178.
