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
2026-10-31 — La fila por orden de llegada (Capitán): remos libres y usados, sin pensar en cada cambio; turno = c·p/(1−p)
por la bolita (0,99 por defecto), calculado una vez por el planificador en Janax. Un cambio cuesta ~24 instrucciones
(antes ~190-300); dos calculo igual de rápido y parejos (482 instr de diferencia). SO 148/148, escalón 0 182/182.
2026-10-31 — La bolita de cada camarote: programa.bin!0.5 al lanzar, los hijos heredan la del padre como techo,
y el pedido 20 la cambia en marcha (recortada al techo, turno recalculado una vez). SO 162/162.
2026-10-31 — Remeros según el trabajo (Capitán): un despertar por trabajo nuevo y un remero especial para el que
más traba. 4 remeros: dos calculo de ~3,5 s a ~1,6 s; 2 remeros: de ~1,7 a ~2,7 s (el especial duerme). Un padre
con tres hijos: hijos 37 % antes. SO 166/166, estrés 300/0.
2026-10-31 — El especial rema la fila cuando nadie traba (Capitán): 2 remeros vuelven a ~1,7 s (con el especial
dormido eran ~2,8 s); 4 remeros ~1,7–1,8 s. SO 166/166, estrés 300/0.
2026-10-31 — El SO corre código nativo: motor traducido (nativo.inc) de fábrica. calculo ~2,2 s → ~1,0 s; dos a la
par ~1,75 → ~0,7 s. 247/247 con los tres motores, estrés traducido 300/0.
2026-10-31 — Traductor: jcall/jret nativos (calculo ~1,0 → ~0,58 s) y 4 registros Janax en r8–r11 (~19 % más). Cobrar
por tramo: medido sin ganancia, descartado. 248/248, estrés 300/0, escalón 0 182/182.
2026-10-31 — Los números de ambiente no se reusan (Capitán): la dirección de un ambiente destruido falla; tabla desde
el mínimo; con todos destruidos la cuenta vuelve a 1. 254/254, escalón 0 182/182.
2026-11-01 — El cartel de los cofres (Capitán): cada ambiente en su cajón contra una pared que el procesador cuida;
el traducido ya no pregunta por el borde y un acceso rechazado vuelve por su rutina (código 5 exacto). Pedido 21:
solo lectura. calculo empata, calculo_ambiente ~1.040 → ~665 ms. SO 269/269, escalón 0 182/182 (con el teléfono).
2026-11-03 — Cajas entre camarotes (Capitán): cada caja una sección con vista y llave por dueño (trato propio, el
anfitrión la libera con el último); nace (22), se muda (23), se enlaza (24), recibir (25), fusionar (26) y asociación
por mutuo acuerdo con las cuatro zonas del Venn (27). Acceso empatado. SO 302/302, escalón 0 182/182.
2026-11-03 — El saludo (Capitán): pedido 28 saludar a un familiar y 29 esperar un saludo (quién saludó, o −1 si no
queda nadie); una marca por familiar, plástica, que no se pierde. Regla de la casa nueva: plástico. SO 308/308, escalón 0 182/182.
2026-11-03 — La ventanilla con cuaderno propio (Capitán: "todo internamente de Janax"): sin VirtualAlloc/VirtualFree por
pedido; saludo ~24 → ~7,4 µs por pasada (Windows ~2). Enlazar una caja ~0,3 ms sin importar su tamaño. SO 308/308,
escalón 0 182/182.
2026-11-03 — El costo escondido del saludo (cronómetro rdtsc): la lista vacía pedía memoria a Windows en cada saludo;
ahora reusa su cuaderno. Saludo ~0,64 µs por pasada, ~3,2 veces más rápido que los eventos de Windows (~2,05 µs).
SO 308/308, escalón 0 182/182.
2026-11-03 — Plástico (Capitán): cajón con sus páginas y una pared, cartel y registro que crecen, buzón para las cajas que
llegan, y al terminar un camarote todo vuelve (500 hijos de 16 MB: 7.717 → 26 MB comprometidos). SO 314/314, escalón 0 182/182.
2026-11-03 — Razar en Janax (Capitán, "tu regalo de cumple"): el cardumen y su voluntad, dos camarotes que conversan
con saludos sobre una caja de dote, dan la huella del modelo bit por bit en los tres motores y con 1, 2 y 4 remeros.
La armonía hace que inventen un idioma (4 cosas: 100 %; 8: 50–76 %).
2026-11-04 — La voluntad que escucha la melodía (A/B, regla congelada, 20 semillas nuevas, 16 cosas): leyendo pieza y
paso, 7³ converge 19 de 20 con mediana 62 vueltas (leyendo solo piezas: 6 de 20, mediana 5.752); el control revuelto
da 0 de 20. Código temporal, no de frecuencia. En 4³ apenas 2 de 20: ahí el límite es del cubo.
2026-11-04 — La voluntad de Janax escucha la melodía: el cardumen le pasa el paso de cada pieza de arriba y ella
lee pieza y paso; los dos camarotes dan la huella de lazo.pl lee=ritmo bit por bit en los tres motores. SO 320/320.
2026-11-04 — Después del A/B: el 7³ da el doble de ritmo que el 4³; una convergencia de 7³ tarda 3–4 s en Perl;
y el A/B fue sin puertas: con puertas, 2 de 3 semillas de 7³ se traban leyendo el ritmo. Falta el A/B con puertas.
2026-11-04 — Sin puertas (Capitán): no compraban nada medido y trababan el ritmo. El lazo de Janax da la huella de
lazo.pl sin puertas bit por bit (pruebas de razar 14/14). Idea nueva: la puerta es la melodía viva.
2026-11-04 — La melodía viva (Capitán), primera versión en el modelo: vive (casi nunca descansa), pero la
voluntad escucha el fondo junto con su señal y los aciertos caen al azar. Falta separar la señal del fondo.
2026-11-04 — El diálogo (Capitán): con melodía viva el cardumen contesta distinto a cada cosa (27 de 31 respuestas
son de una sola), pero la voluntad, que cuenta notas sueltas, no lo oye: aciertos en azar. Falta un oído de melodías.
2026-11-04 — Oídos de melodía entera (relativo, intervalos): con melodía viva siguen en azar. Con frases fijas, ritmo
llega a 34–48 %. El fondo común tapa la parte que dijo la señal.
2026-11-04 — La canción la sostiene la voluntad (Capitán): con el cardumen callado entre olas el idioma vuelve
(100 % con 4 cosas); el diálogo, tal como está, resta un poco (8 cosas: 50–88 % contra 86–100 %).
2026-11-04 — El diálogo no resta por leer la última vuelta (la primera adivina igual); resta porque cada eco es una
ola más que entrena al cardumen. Bucle de la charla corregido. La tabla de la voluntad en 7³ pide crecer a la medida (L2).
2026-11-04 — El susurro (el cardumen no aprende del eco) no salva al diálogo: 8 cosas, 26–64 % contra 86–100 %
sin diálogo. El diálogo se archiva, como la melodía viva.
2026-11-04 — La placa de video (Capitán): con el cardumen quieto la voluntad sola aprende 4 cosas al 100 %, pero
en 7³ con 16 cosas llegan 2 de 5 contra 5 de 5 si el cardumen aprende.
2026-11-04 — Decisión (Capitán): la memoria vive en la voluntad, el cardumen sigue aprendiendo su circuito.
2026-11-04 — La voluntad de Janax escribe sus aciertos cada 50 vueltas, igual letra por letra que el modelo.
2026-11-04 — La red convencional de referencia (EGG, Facebook Research) arranca en la máquina del Capitán, con tres
arreglos de entorno anotados. La comparación de verdad todavía no se hizo.
2026-11-04 — Razar contra EGG (la red de referencia del juego de señales): 16 cosas, Razar 5 de 5 en 35–102 juegos;
EGG 0 de 5 en 320.000 juegos (44–87 %). Con 4 cosas, Razar en decenas de juegos y EGG en miles.
2026-11-04 — Contado en mensajes: con 16 cosas Razar llega en 81–278 mensajes; EGG no llega en 320.000 (Fisher ≈ 0,8 %).
2026-11-04 — Publicado: Pages con el resultado contra EGG, release v0.2, DOI de la versión 10.5281/zenodo.23962615.
2026-11-05 — Morse (Capitán): con período refractario de 2 pasos llega a 34–65 % (azar 3 %; sin refractario, 3 %). La
velocidad mínima rinde igual que las lentas. Diagnóstico: después de una raya la ola gira en redondo (convulsión) y hay gemelas.
2026-11-05 — Morse con cada pulso en su ola: 26 de 26 letras distintas, cero giro en redondo; pero el cubo queda como un
caño (olas que no se tocan) y el oído no distingue melodías anidadas (19 % igual en todo). Abierto.
2026-11-05 — Palabras (Capitán): 20 unidades sin confusión (Sperner, ventana de 7); con pulso firme 30 de 30 palabras
oídas y 17 de 20 nuevas. Con temblor se rompen las palabras. El cardumen quieto da igual: hoy el cubo es un caño.
2026-11-05 — Alfabeto de Fano (bloque {1,2,4} mod 7, la órbita de duplicar): 20 de 20 palabras nuevas con pulso firme y
más resistente al temblor que Sperner (10 %: unidades 94–98 % contra 88–90 %), aunque en el papel un pulso corrido empata.
2026-11-05 — Control 7 contra 7: Fano le gana a 5 sorteos de 7 unidades de Sperner (temblor 10 %: mediana 15 de 20 contra
4–10). Ganó la construcción, no tener menos opciones.
2026-11-05 — Olas que se cruzan: el cubo deja de ser un caño (cada semilla da distinto), pero aprender no le gana al
cardumen quieto (4 mejor, 2 peor, 1 igual). Falta el paso de asentar lo que sirvió.
2026-11-06 — Techo que se autoajusta: cada pieza conserva su total (4 % en 255 contra 60 %). El híbrido (simétrico +
conserva + asienta) le gana al cardumen quieto en palabras nuevas en 5 semillas de 7, sin perder ninguna: primera señal, no prueba.
2026-11-06 — La melodía negativa (Capitán): bit de signo por pieza, en las cinco formas de propagar; prueba_signo.pl
18 de 18, y con el freno desconectado caen 7 (las pruebas saben fallar).
2026-11-06 — Frenos aprendiendo: con 20–30 % que frenan, los frenos crecen hasta apagar el cubo (0 %). Saturación del
lado del freno.
2026-11-06 — Morse de saludos (Capitán): punto, raya y fin de letra como tres tipos de saludo, sin tiempos. 20 de 20
palabras nuevas en las 7 semillas; con 20 % de resbalones, 96–100 % de saludos. El quieto da parecido.
2026-11-06 — Fano en el espacio empata con teclas al azar: la ventaja era del tiempo. Señales que se acortan solas: las 7
teclas libres van a las palabras más dichas y el costo baja de 18 a ~7 saludos; el control al azar también correlaciona algo.
2026-11-06 — Inversión de Zipf: manda la frecuencia, con algo de "el primero se sirve" (0 a 3 raras conservan tecla). El
paper de antieficiencia de EGG existe, pero con costo de largo EGG también cumple la ley: no es una ventaja de Razar.
2026-11-06 — Palabra = canción (Capitán): con ruido, el cardumen que aprende le gana al quieto en oraciones enteras
(11 de 14 casos, p ≈ 0,06). Las palabras nuevas se confunden con las que empiezan igual (40 % contra 5 % de azar).
2026-11-06 — Freno que sigue la aceleración: no apaga la convulsión (170 pasos contra 127), porque una oscilación sostenida
no acelera. Haría falta un freno según cuánta actividad hay y cuánto dura.
2026-11-06 — 20 semillas: con la palabra como canción y ruido, el cardumen que aprende le gana al quieto en 18 de 20
(Wilcoxon z = 3,42, p ≈ 0,0006). Frenos al 30 % bajan el sesgo al comienzo de 40 % a 24–29 %.
2026-11-06 — Fatiga por pieza: apaga la convulsión sin matar la señal (5–18 pasos, 15–30 notas arriba). No salva al Morse
por tiempos: cansa la entrada y se pierden las últimas marcas (20 de 26 letras distintas).
2026-11-06 — El saludo que lleva una palabra (Capitán): pedidos 30 (decir) y 31 (leer); el bit sigue de timbre y las
palabras van al buzón en orden, con la regla del buzón asincrónico-sincrónico.
2026-11-06 — Razar en Janax se habla con palabras (sin caja ni dote): misma huella bit por bit en tres motores y 1, 2 y
4 remeros; ~40 % más caro que la caja compartida.
2026-11-06 — Todo a Janax, Perl de vara (Capitán). Pieza 1: olas que se cruzan en Janax (un qword por ola), misma huella
que el modelo en los tres motores; traductor 153 ms contra Perl 752 ms.
2026-11-06 — Piezas 2 y 3 en Janax: la palabra como canción y el oído de palabras enteras, dos camarotes con palabras;
misma huella que el modelo en los tres motores, 30 de 30 palabras en la tercera pasada, ~9 veces más rápido que Perl.
2026-11-06 — Pieza 5 en Janax: las oraciones con ruido, con parámetros desde un archivo; bit por bit con el modelo y la
misma línea letra por letra; ~44 veces más rápido que Perl.
2026-11-06 — Pieza 4 en Janax: el cubo de tamaño libre (hasta 7); el resultado contra EGG (7³, 16 cosas) corre en Janax
bit por bit, 243 ms contra ~4,7 s de Perl. Las cinco piezas del traslado están en Janax.
2026-11-06 — Acertijos (Capitán): Razar aprende a contar y resuelve sumas que nunca vio comparando recorridos de la
canción de contar; con 3 ejemplos, 100 % en 20 semillas (control con respuestas al azar: 6 %). Con "uno más uno" y "dos más dos" dice "no
sé". El cardumen elige su tamaño solo (3³ a 5³), aunque crecer no mejoró los acertijos. Todo en Janax, idéntico a Perl.
2026-11-06 — La prueba de la cadena escrita a mano (propuesta del otro chat): idéntico en 99 de 100 corridas. En los
acertijos el cardumen casi no trabaja; el mérito es de la búsqueda (27 candidatas, plantilla de Doc). No es todavía un
resultado de Razar; el de la noche sigue siendo el 18 de 20 de las palabras-canción.
2026-11-06 — El acertijo como una sola melodía (Capitán: "dale de comer los números primero"): 0 de 140; contesta
siempre el primer número del acertijo (el oído lee desde el comienzo). Sin los números, 13 % (azar 17 %).
2026-11-06 — Sin Perl (Capitán: "no uses más Perl, que se me va a quemar la PC; sólo Janax"): las suites ya no lo llaman.
Las huellas de los modelos quedan fijas (las mismas que dan los programas Janax, que la suite ya había verificado contra
Perl); los archivos de parámetros, con printf; `bucles` y `combinaciones`, en awk (las 31 combinaciones, idénticas byte
por byte a las de Perl). Los modelos `.pl` de Razar quedan en el repositorio como referencia, sin correrse.
2026-11-06 — Palabras y estructura (Capitán): el núcleo por lo que es; enseñado en un orden y preguntado en otro, 100 % en los cuatro órdenes (20 semillas, suma y resta mezcladas). El orden libre está construido; lo aprendido es qué palabra es el núcleo.
2026-11-06 — Sumar sin reglas, como en el lazo: no aprende ni las sumas que practica (~25 %, azar 17 %); cada número está en muchas sumas y moverlo para arreglar una rompe otras.
2026-11-06 — Gemelos (AMMC P44 llevado a oraciones): sin reglas de sumar, con 10 sumas memorizadas acierta el 98 % de las que nunca vio (0 % mal); con 6, 29 % y dice "no sé" el resto. Control al azar: 2 %.
2026-11-06 — El ensamblador PDP ya rechaza las etiquetas repetidas (semilla nueva, 126 programas idénticos). Gemelos al azar (el portero del P36): 16–22 % bien y 25–35 % mal, contra 84–98 % bien y 0 % mal con gemelos de verdad.
2026-11-06 — Acertijo lógico (quién es mayor, seis hermanos): los gemelos fallan, 0 % bien y 29 % mal en pares nunca vistos; una comparación no es un cambio parejo. El 0 % de error de las sumas no es general.
2026-11-06 — La puerta y su interruptor (la negación de Razar llevada a la lógica): con 2 pares de "menor" descubre que es el interruptor de "mayor" y acierta el 98 % de los pares nunca vistos, 0 % mal. El criterio del interruptor todavía no se compara contra el azar.
2026-11-06 — Interruptor endurecido (portero del P36, ocho emparejamientos ciegos): con respuestas al azar ya no aparece (0 de 20, antes 20); con datos coherentes sigue en 98 % bien, 0 % mal.
2026-11-06 — Las puertas también contra el azar: con respuestas al azar calla siempre (0 % mal, antes 17 %); con datos coherentes 95–97 % bien y 0 % mal.
2026-11-06 — Los dos mecanismos en la misma corrida y el P36 elige por armonía (D39, dejando uno afuera): gemelos en sumas (58 de 60), puerta en comparaciones (20 de 20), 98 % bien y 0 % mal en las dos. Condición: en comparaciones, algún par no vecino en la memoria.
2026-11-06 — Revisión de la elección: es MDL con validación dejando uno afuera; con el criterio original las elecciones son idénticas; el distractor (eco) nunca gana con datos reales, pero con datos al azar gana a veces y el error del control sube a 29 %: falta el modelo nulo de MDL.
2026-11-06 — Modelo nulo de MDL (el eco como vara, agregado después de ver el agujero): con datos al azar vuelve a callar (0 % mal); con datos reales las elecciones no cambian.
2026-11-06 — Memoria en el cubo (MODO 7, recordar por familiaridad): no funciona; el cubo responde igual nota por nota antes y después de practicar. Su aprendizaje completa caminos con ruido, no deja huella audible en una canción limpia.
2026-11-06 — Razar lee el Nuevo Testamento (Capitán: "veamos qué tanto puede aprender con un libro"): tapando cada palabra de los renglones que nunca leyó, acierta 28,4 % mirando los dos lados (15,2 % solo la anterior; 4,8 % diciendo siempre la más común). 0,9 s el libro entero; idéntico en los tres motores. Es la línea de base: todavía sin el cubo ni el P36. El texto queda fuera del repositorio.
2026-11-06 — El pulso (regla única del Capitán: todo es lo mismo con una diferencia; pedidos dormidos que despiertan cuando el texto trae algo que se asocia): en 1,2 s sobre el Nuevo Testamento nacen solos a/o (género), "no" como interruptor (tercero, detrás de "y" y "que"), la/su y dijo/respondió como asociados, y "hijo de / padre de (dado vuelta)" como puerta, empatada con ruido. Falta la línea de base y el juez de la armonía.
2026-11-06 — El juez de la armonía en bits (pieza = ahorra más de lo que cuesta nombrarla) y la línea de base ciega: el ruido se va (de 48 mil diferencias de puertas quedan 21 piezas, ninguna basura), "no" sube al segundo interruptor, y las piezas explican lo no leído más que las ciegas en los cuatro pisos (gemelos 86,6 % contra 22,0 %). padre/hijo dado vuelta no paga con 3 pares: falta libro con genealogías.
2026-11-06 — Preguntarle con una melodía (Capitán): "? padre de ? padre de judá" -> isaac, que el libro nunca dice así; también el bisabuelo de Salmón y el bisnieto de Roboam, encadenando lo dicho (P47). Junta a los dos Jacob del libro (identidad por nombre) y calla cuando un paso no se dijo en la forma preguntada. 0,5 s, idéntico en los tres motores.
2026-11-06 — El camino usa las piezas que pagaron (interruptores y puertas, aprendidos del libro entero): "pedro le respondió ?" contesta también por "le dijo" y lo dice. Las genealogías no cambian: ni "fue" ni padre/hijo pagan en el Nuevo Testamento. "no" paga como interruptor y el camino aún no lo distingue de "fue" (falta la propiedad 2 del "no").
