# 12. Glosario

Cada término enlaza a la sección que lo define; el orden es alfabético (sin tener en cuenta acentos, mayúsculas, el punto inicial de las extensiones ni los artículos "el" y "la").

## A

**activación y claridad (D_KACT, D_KCLA)** — Señales 0/1 de él: activación por signos, mayúsculas y letras estiradas sobre su media; claridad por proporción de palabras dichas en la mejor línea. [definido en capítulo 09, §4](09-luma-conversacion-y-respuesta.md#4-recepción-del-turno-r_dlg_sent)

**adaptador de cartel** — Conjunto Venn hecho del cartel de salas de una cabina; clave = número de caja, criterios 1 tamaño, 2 caja, 3 trato. [definido en capítulo 05, §11.5](05-nucleo-pantalla-teclado-vigia.md#115-adaptador-de-cartel)

**alfabeto del órgano** — Las quince letras: mezclas 1-4, huecos 5-9, sentidos 10 y 15, ojo 11-13 y `'>'` 14 (palabra o célula). [definido en capítulo 06, §10.3](06-razar-lectura-y-organos.md#103-el-alfabeto)

**ambiente** — Bloque de memoria de un proceso. El ambiente 0 (la sala 0 de la cabina) se crea con la primera orden (jfirst). [definido en capítulo 02, §1](02-ensamblador-pdp-y-construccion.md#1-convenciones-y-términos)

**anillo (anillo1)** — Formato de registro circular: cabecera de 160 bytes con K, el total y 8 contadores por motivo, seguida de K líneas de longitud fija L; la línea i va en 160 + (i mod K)·L. Es el anillo del presente cuando PRESENT está activo. [definido en capítulo 08, §8.2](08-luma-cuerpo-procesos-y-casa.md#82-formato-anillo-anillo1)

**anillo de eventos** — scr_ring: 256 casillas de 32 bytes; fusiona movimientos consecutivos y, lleno, descarta el más antiguo. [definido en capítulo 05, §6.3](05-nucleo-pantalla-teclado-vigia.md#63-anillo)

**armar.sh** — Guion que verifica la semilla y arma una lista de fuentes .jsm con PDP sobre janaxos.exe en una carpeta vacía; deja los binarios en una salida plana. [definido en capítulo 02, §19](02-ensamblador-pdp-y-construccion.md#19-soherramientasarmarsh)

**armar_paginas.py** — Generador de `docs/p/**` y docs/sitemap.xml a partir de los .md de documentacion/, con un lector de Markdown propio y reescritura de enlaces. [definido en capítulo 11, §11.8.4](11-instalador-lanzador-y-publicacion.md#1184-generación-de-páginas-armar_paginaspy)

**asociación (pedido 27)** — Dos cabinas de una familia se nombran mutuamente con una palabra Venn; al nacer el próximo hijo, Venn elige qué cajas de ambos carteles recibe. [definido en capítulo 05, §11.6](05-nucleo-pantalla-teclado-vigia.md#116-protocolo-de-asociación-pedido-27)

**ayudante** — Cabina interna del núcleo (P_HELPER = 1, P_ID = −1) que ejecuta el planificador; no puede usar la ventanilla. [definido en capítulo 03, §5.4](03-nucleo-arranque-memoria-procesos.md#54-ayudante-del-núcleo)

## B

**balbuceo** — Generación de un camino nuevo (semilla de siluetas o mutación al azar) que espera el juicio del marco. [definido en capítulo 09, §9.5](09-luma-conversacion-y-respuesta.md#95-balbuceo-y-juicio-de-caminos)

**bancos de medida** — Programas Janax de escalon0/bancos y so/bancos para medir tiempos, sin verificación de resultado en las baterías. [definido en capítulo 02, §22](02-ensamblador-pdp-y-construccion.md#22-bancos-de-medida)

**batería de conformidad** — escalon0/pruebas/correr.sh con las pruebas .jsm, que declaran espera, código y salida; los tres ejecutores deben dar lo mismo. [definido en capítulo 01, §14](01-idioma-janax.md#14-conformidad)

**.bin** — Programa armado: bytes sin encabezado; la palabra i ocupa los bytes 4i..4i+3. [definido en capítulo 01, §9.1](01-idioma-janax.md#91-bin-programa)

**bloque libre (B = ST["free"])** — Región de 64 KB con el estado de libertad, lectura, conversación y los datos iniciales de la lectora; una parte se guarda en el archivo libre. [definido en capítulo 08, §2.6.1](08-luma-cuerpo-procesos-y-casa.md#261-bloque-libre-b--stfree)

**bolita** — Prioridad de una cabina en 65536avos (P_PRIO): la fracción de su tiempo dedicada a trabajo real. Vale 64881 por omisión y el pedido 20 la recorta a la bolita con que nació. [definido en capítulo 03, §12.1](03-nucleo-arranque-memoria-procesos.md#121-bolita-20)

## C

**cabina** — Un proceso de JanaxOS: su bloque de control de PROC_SIZE = 688 bytes, sus 16 registros, su programa, su pila de retorno y sus salas. [definido en capítulo 03, §1](03-nucleo-arranque-memoria-procesos.md#1-convenciones-y-términos)

**cables vivos** — Traza que se inserta en cada destino de jcall: r_cable marca en una matriz NC×NC los pares rutina anterior → actual y encola los nuevos. [definido en capítulo 08, §2.8](08-luma-cuerpo-procesos-y-casa.md#28-cables-vivos)

**caché .x64** — Archivo `<programa.bin>.x64` con magia JX65, huella del traductor, jmap y el código sin enlazar de cada palabra, para la traducción incremental. [definido en capítulo 01, §11.8](01-idioma-janax.md#118-caché-incremental-programabinx64)

**caja** — Objeto de memoria del anfitrión que respalda una sala: una sección sin archivo (CreateFileMappingA sobre INVALID_HANDLE_VALUE). [definido en capítulo 03, §6.2](03-nucleo-arranque-memoria-procesos.md#62-caja-vista-cajón-y-cartel)

**cajón** — Reserva de direcciones propia de cada vista: las páginas de la sala más una página de pared sin acceso. [definido en capítulo 03, §6.2](03-nucleo-arranque-memoria-procesos.md#62-caja-vista-cajón-y-cartel)

**cajón muerto** — Página reservada sin acceso al arrancar, a la que apunta toda sala destruida o no construida. [definido en capítulo 03, §1](03-nucleo-arranque-memoria-procesos.md#1-convenciones-y-términos)

**camino (wy_go)** — Secuencia de letras: k ≤ 9 es un paso (heart, impro, own, quien, cross, baja, hermano, sube, sigue); k `>` 9 es un camino ganado anidado. [definido en capítulo 09, §9.1](09-luma-conversacion-y-respuesta.md#91-pasos)

**campana** — Un evento del anfitrión (objeto de sincronización de Windows) que el núcleo usa para despertar. [definido en capítulo 05, §1](05-nucleo-pantalla-teclado-vigia.md#1-definiciones-y-notación)

**candidato** — Hijo hijo.bin lanzado con ORGK = 1, que rinde el examen con un órgano a prueba y dice ORGCE, BOOKH y EVS a su padre. [definido en capítulo 06, §12.3](06-razar-lectura-y-organos.md#123-protocolo-del-candidato)

**cantado** — Archivo de salida con el último texto cantado; se borra y se reescribe tras cada línea de canta, y luego se dice la palabra 9 a la cabina 0. [definido en capítulo 07, §2.8](07-razar-cardumen-canto-hilos.md#28-dados-y-cantado-contrato-con-quien-lo-lanza)

**canto (memoria_pares)** — Modelo de Markov de contexto variable aprendido de los pares pregunta-respuesta; compone una respuesta símbolo a símbolo con el contexto más largo que dicen dos pares o más. [definido en capítulo 07, §2.7](07-razar-cardumen-canto-hilos.md#27-el-canto-con-canta)

**canto y regla de dos (Luma)** — Las clases se cantan como letras por luma/canto.bin; una letra cantada se dice sólo si su clase aparece en las respuestas de al menos 2 ejemplos (o es un particular de él). [definido en capítulo 09, §11.6](09-luma-conversacion-y-respuesta.md#116-canto-y-regla-de-dos)

**cardumen** — Familia de programas `razar/cardumen/cardumen*.jsm` que implementan el cubo de piezas (la escuela) y sus variantes de canto, lazo y olas. [definido en capítulo 07, §4](07-razar-cardumen-canto-hilos.md#4-el-cubo-la-escuela)

**carpeta del sistema** — Carpeta del anfitrión con los archivos de Janax (JANAX_ARCHIVOS o, si falta, janax_archivos); las etiquetas tablero/ van al tablero. [definido en capítulo 03, §3.4](03-nucleo-arranque-memoria-procesos.md#34-variables-de-entorno)

**cartel** — Tabla de salas de una cabina (P_ROOMS), con entradas de 32 bytes: lugar y trato, tamaño, clave y número de caja. [definido en capítulo 03, §6.2](03-nucleo-arranque-memoria-procesos.md#62-caja-vista-cajón-y-cartel)

**casa (casa de archivos)** — La carpeta propia y el tablero, donde cada etiqueta vive como un archivo con nombre hexadecimal; en Razar y Luma, "la casa" es el conjunto de sus archivos. [definido en capítulo 04, §10](04-nucleo-abi-de-pedidos.md#10-la-casa-de-archivos)

**casa (ROOMHL)** — Lista de {KW1..KW3, DLO, DHI} de cada pulso asociado, de la que casa.inc saca cimiento y muebles. [definido en capítulo 06, §6.4](06-razar-lectura-y-organos.md#64-pulso-y-diferencia)

**casa propia / casa con anfitrión** — Los dos modos de luma.sh. Con vida-memoria, la casa es propia y se lanza con JANAX_VIGIA; sin ella, se escriben despensa y vida-lista con rutas del anfitrión. [definido en capítulo 08, §3](08-luma-cuerpo-procesos-y-casa.md#3-construcción-y-arranque-lumash)

**catálogo (pedido 0 de jhost)** — Lista de entradas de 16 bytes {nombre, número} con los pedidos que ofrece el anfitrión; el programa busca los pedidos por nombre. [definido en capítulo 01, §7.3](01-idioma-janax.md#73-pedido-0-catálogo)

**celda** — Un elemento de la rejilla de un nivel de nube; equivale a un píxel lógico de la pantalla. [definido en capítulo 05, §1](05-nucleo-pantalla-teclado-vigia.md#1-definiciones-y-notación)

**célula / tejido** — Célula: `'>'` g1 g2 t, un engranaje aplicado a un tejido t (lente, marco, posición del ojo, nitidez, corazón, lugar de memoria, portador). [definido en capítulo 06, §10.6](06-razar-lectura-y-organos.md#106-células-y-tejidos)

**centinela** — La rutina watch_wait: un remero que, cuando nadie rema, duerme sobre las campanas de carpetas y de pantalla; único lugar donde el núcleo espera fuentes externas. [definido en capítulo 05, §10.10](05-nucleo-pantalla-teclado-vigia.md#1010-bucle-del-centinela-watch_wait)

**centro del corazón** — Huellas de las palabras de los libros del corazón (PL_HS); la cercanía de un libro al centro es HWC/TWC. [definido en capítulo 09, §12.2](09-luma-conversacion-y-respuesta.md#122-primera-lectura-lugares-y-centro-del-corazón-cnb--2)

**cerrojo de pantalla** — Sección crítica scr_lock, compartida entre el núcleo y el hilo de la ventana. [definido en capítulo 05, §1](05-nucleo-pantalla-teclado-vigia.md#1-definiciones-y-notación)

**cerrojo del núcleo** — La sección crítica kern_lock, que serializa lo compartido: la ventanilla, la fila y el fin de una cabina. [definido en capítulo 03, §13.2](03-nucleo-arranque-memoria-procesos.md#132-cerrojo-y-variables-de-condición)

**cf** — Tabla de 30 × 31 qwords con las confusiones del cubo que escribe voluntad_oraciones; memoria_pares la usa como temblor. [definido en capítulo 07, §5.6](07-razar-cardumen-canto-hilos.md#56-el-archivo-cf)

**charla-libros (archivo)** — Archivo de la conversación al que va cada enunciado cuando su árbol tiene activa la charla con libros (SF_ON) y no es un saludo; mismo formato de línea que dialogo. [definido en capítulo 08, §8.6.1](08-luma-cuerpo-procesos-y-casa.md#861-dialogo-me-comi-charla-libros)

**clave** — Handle del anfitrión de una caja que tiene una cabina (RE_KEY). [definido en capítulo 03, §1](03-nucleo-arranque-memoria-procesos.md#1-convenciones-y-términos)

**CNB** — Global que fija el modo de búsqueda de r_dlg_answer (0, 2, 3, 5, 6, 14, 30) y, en wy_choose, el candidato elegido; no se reinicia por turno. [definido en capítulo 09, §2.8](09-luma-conversacion-y-respuesta.md#28-valores-de-cnb)

**codificación por clase del hueco (ln_emit)** — Cada palabra se reemplaza por la letra de su clase (misma palabra anterior y misma siguiente, misma clase). Las letras van de a a z y desde 165+m. [definido en capítulo 08, §6.1](08-luma-cuerpo-procesos-y-casa.md#61-archivos)

**códigos de salida 0-9** — Terminación de la máquina: 0 jhalt, 1 op inválido o jsys fuera de JanaxOS, 2 pc fuera, 3 archivo, 4 argumento, 5 fuera de rango, 6 desalineado, 7 pila llena, 8 pila vacía, 9 palabra traducida demasiado larga. [definido en capítulo 01, §3.5](01-idioma-janax.md#35-terminación-y-códigos-de-salida)

**cola de pedidos** — Cabecera con un qword N, seguida de N entradas de 32 bytes {kind, alto, a, b, respuesta}. Al terminar el toque, el núcleo deja N en 0. [definido en capítulo 04, §4](04-nucleo-abi-de-pedidos.md#4-formato-de-la-cola-de-pedidos)

**Comida (carpeta)** — Carpeta `<base>Comida`, hermana de Luma\, que el núcleo vigila a través de JANAX_VIGIA; lo que se pone ahí, Luma se lo come. [definido en capítulo 11, §11.1.3](11-instalador-lanzador-y-publicacion.md#1113-disposición-de-una-instalación)

**comida (fases MEALPH)** — Una nube que llega al plato, se digiere en una receta por escalada, sube, hace su ronda y fluye hacia la forma destino, que toma sus colores. [definido en capítulo 10, §10.10.4](10-luma-pantalla-lluvia-y-organos-vivos.md#10104-fases-mealph)

**concepto** — Clase de palabras unidas por union-find a su mejor socio entre las piezas asociadas (clase 3). [definido en capítulo 06, §7](06-razar-lectura-y-organos.md#7-el-juez-de-armonía)

**conserva** — Indicador del instalador: vale 1 si la casa destino ya tiene etiqueta("vida-memoria") y no se eligió reemplazar; entonces casa.paquete no se desempaca. [definido en capítulo 11, §11.5.4](11-instalador-lanzador-y-publicacion.md#1154-comprobaciones-previas)

**contorno ×2 (Scale2x)** — Escalado r_contour que duplica cada punto en cuatro según la igualdad de los vecinos de arriba, abajo, izquierda y derecha (algoritmo EPX). [definido en capítulo 10, §10.2.5](10-luma-pantalla-lluvia-y-organos-vivos.md#1025-contorno-2-r_contour)

**corazón (HEART)** — Tupla fija de cuatro libros (libro-firma, libro-preguntas y dos personales) que nunca rotan y que r_dlg_heart lee por párrafos. [definido en capítulo 08, §8.8.6](08-luma-cuerpo-procesos-y-casa.md#886-corazón)

**corazón (tejido 7)** — Célula que dice la bolita de la cabina y la cambia con el pedido 20, recortada a la bolita con que se lanzó. [definido en capítulo 06, §10.9](06-razar-lectura-y-organos.md#109-corazón-tejido-7)

**costo de cambio c** — Costo de un cambio de cabina medido en instrucciones (swcost); puede ser fijado, recordado en calibracion o medido. [definido en capítulo 03, §4](03-nucleo-arranque-memoria-procesos.md#4-costo-de-cambio-c-y-calibración)

**costumbres (r_canto)** — Respuesta desde los ejemplos: memoria exacta, regla de cobertura, memoria cercana o canto. [definido en capítulo 09, §11](09-luma-conversacion-y-respuesta.md#11-las-costumbres-r_canto)

**criatura** — Cuerpo de partículas que camina sobre un toro de 320 × 200 con su marcha; aprende piezas por MDL al tocarse y sueña melodías. En Luma no se dibuja: sus registros caen como lluvia. [definido en capítulo 10, §10.12.1](10-luma-pantalla-lluvia-y-organos-vivos.md#10121-qué-simula)

**cubo (la escuela) / ola / armonía** — Cubo de n³ piezas con pesos hacia 6 vecinos. Cada saludo inicia una ola; una pieza despierta con suma ≥ 100 y armonía (2·direcciones que empujaron ≤ vecinos). [definido en capítulo 07, §4.1](07-razar-cardumen-canto-hilos.md#41-modelo-común)

## D

**dados** — Archivo cuya huella FNV-1a se mezcla con xor en la semilla del azar del canto. Luma vuelca en él la rejilla de la lluvia (1976 bytes) cada vez que lo escrito va al pensador; sin él, cada corrida canta lo mismo. [definido en capítulo 10, §10.4.6](10-luma-pantalla-lluvia-y-organos-vivos.md#1046-archivo-dados)

**.datos** — Datos iniciales crudos que el primer jsys copia al principio del ambiente 0; se asocian al programa por su nombre. [definido en capítulo 01, §9.2](01-idioma-janax.md#92-datos-datos-iniciales)

**deducida en espera** — Forma deducida al encadenar una relación consigo misma ((a,b) y (b,c) dan (a,c)). Si nadie la une en la vuelta siguiente pierde sus pares. [definido en capítulo 07, §3.8](07-razar-cardumen-canto-hilos.md#38-el-while)

**dentro de sus salas** — Que un rango [dirección, dirección + n) esté entero dentro de una sola sala en pie que el núcleo pueda tocar, según cabin_at. [definido en capítulo 04, §6.3](04-nucleo-abi-de-pedidos.md#63-validación-de-punteros-cabin_at)

**derechos** — Máscara de permisos de un portero (N_RIGHTS): R_SCREEN = 1 pantalla, R_MEM = 2 memoria, R_READ = 4 leer, R_WRITE = 8 grabar (R_ALL = 15). Un hijo los pide al nacer con el pedido 16 y nunca tiene más que su padre: se recortan con AND. [definido en capítulo 04, §7.1](04-nucleo-abi-de-pedidos.md#71-porteros); uso al lanzar en [capítulo 03, §9.2](03-nucleo-arranque-memoria-procesos.md#92-lanzar-16)

**desempaca** — Rutina del instalador que proyecta un paquete en memoria y escribe cada entrada descomprimida en la carpeta destino, sin validar los límites. [definido en capítulo 11, §11.6.3](11-instalador-lanzador-y-publicacion.md#1163-descompresión-desempaca)

**deseo (dse_wish)** — ((2S+1)`<<19`)/(N+1), es decir (S+1/2)/(N+1) en unidades de 2^-20; una rama se toma si r_randmod(2^20) `<` deseo. [definido en capítulo 09, §1.4](09-luma-conversacion-y-respuesta.md#14-deseo-y-azar)

**despensa** — Etiqueta escrita por luma.sh con la lista de nubes que Luma puede comer: encabezado de 37 bytes y una línea por nube. [definido en capítulo 10, §10.10.1](10-luma-pantalla-lluvia-y-organos-vivos.md#10101-despensa)

**despertando** — Estado del pensador mientras PKID ≠ 0 y PREADY = 0: el título avisa que no le escriban y los caracteres se descartan; la palabra 5 pone PREADY = 1. [definido en capítulo 10, §10.6.4](10-luma-pantalla-lluvia-y-organos-vivos.md#1064-despertar-del-pensador)

**dialogo (archivo)** — Archivo de la conversación, siempre anexado por r_dlg_write: una línea por enunciado con prefijo según quién habla (`vos: `, `luma: `, `luma (une): `, `luma (cita): `, `libro: `). Recibe lo que no va a me-comi ni a charla-libros. [definido en capítulo 08, §8.6.1](08-luma-cuerpo-procesos-y-casa.md#861-dialogo-me-comi-charla-libros)

**diferencia** — Par no ordenado de llenados de un pulso, con su piso y, en el piso 3, si dio vuelta. Tiene clase: gemelos, interruptores, asociados o puertas. [definido en capítulo 06, §6.4](06-razar-lectura-y-organos.md#64-pulso-y-diferencia)

**dirección Janax** — Entero de 64 bits: (número de sala `<<` 32) | posición. [definido en capítulo 04, §6.1](04-nucleo-abi-de-pedidos.md#61-dirección-janax)

**dist(destino)** — Distancia de salto en palabras desde la palabra siguiente: (destino − PC − 4)/4. Fuera de [−32768, 32767] es error en la segunda pasada. [definido en capítulo 02, §3.2](02-ensamblador-pdp-y-construccion.md#32-formatos-campo-forma-de-la-tabla)

**dormir / vigilante** — fr_sleep crea el archivo dormir; el vigilante (luma_vive.sh o el lanzador) lo detecta, cierra la ventana y Luma renace. [definido en capítulo 08, §7.1](08-luma-cuerpo-procesos-y-casa.md#71-dormir)

**dormir y renacer (lanzador)** — Ante la señal, el lanzador envía WM_CLOSE a la ventana del núcleo, espera hasta 40 s, si hace falta usa TerminateProcess y espera 5 s más, y vuelve a nacer en modo fondo. [definido en capítulo 11, §11.3.6](11-instalador-lanzador-y-publicacion.md#1136-dormir-y-renacer)

**dote** — Lista P_DOWRY de cajas que una madre prepara con el pedido 22 y que su próximo hijo recibe al nacer como salas 1, 2, … [definido en capítulo 03, §6.8](03-nucleo-arranque-memoria-procesos.md#68-dote-al-nacer-y-liberación-al-terminar)

## E

**eco** — Párrafo del corazón sin palabras nítidas nuevas en sus líneas que nombran; no responde. [definido en capítulo 09, §13.2](09-luma-conversacion-y-respuesta.md#132-libros-y-párrafos)

**ejemplo (costumbre)** — Par línea parecida + línea siguiente de un libro, recogido en la ranura EXN de EXR (hasta 7). [definido en capítulo 09, §8.7](09-luma-conversacion-y-respuesta.md#87-ejemplos-sigm--1-solo--0-el-libro-no-es-la-charla)

**engranaje** — Hasta 15 instrucciones Janax aritméticas en un bloque de 128 bytes, sin memoria ni saltos. En Luma, secuencias de 2 a 8 instrucciones del lector canonizadas por renombre de registros y elegidas por ahorro (archivo engranajes). [definido en capítulo 06, §10.7](06-razar-lectura-y-organos.md#107-engranajes-formato-de-128-bytes)

**ensamblado en la máquina destino** — El instalador desempaca fuentes.paquete, corre janaxos.exe con ensamblador.bin sobre esa carpeta del sistema y copia luma.bin y pulso.datos; el único criterio de éxito es que esas copias se puedan hacer. [definido en capítulo 11, §11.5.7](11-instalador-lanzador-y-publicacion.md#1157-ensamblado-de-luma-en-la-máquina-destino)

**ensamblador.datos (tabla de nombres)** — Tabla de nombres que PDP conoce: entradas de 16 bytes {nombre de 8 bytes, valor, forma}, terminadas en una entrada nula, con los mnemónicos, directivas y registros. Queda en la dirección 0 del ambiente 0. [definido en capítulo 02, §4.1](02-ensamblador-pdp-y-construccion.md#41-formato-binario)

**escalón 0** — Primer nivel de ejecución de Janax en el anfitrión: el intérprete de referencia y los traductores x86-64 y ARM64, con memoria fija de 1 MiB y sin jsys. [definido en capítulo 01, §1](01-idioma-janax.md#1-piezas-normativas)

**escucha encadenada (wyg_ok)** — Un candidato nuevo se guarda sólo si enlaza con alguno anterior y ninguno ya dice todas sus palabras; si no, se corta el camino. [definido en capítulo 09, §9.4](09-luma-conversacion-y-respuesta.md#94-escucha-encadenada-wyg_ok)

**esencia (huecos sobre sí misma)** — El cuerpo pide el pedido 42 sobre sí mismo con b = 1 cuando nadie usa la ventana y con b = 0 cuando alguien la usa. [definido en capítulo 08, §4.3](08-luma-cuerpo-procesos-y-casa.md#43-bucle-principal)

**espera sin gasto** — Una cabina con P_WAITING `>` 0 queda fuera de la fila y no consume procesador hasta que cada condición se resuelve. [definido en capítulo 03, §13.6](03-nucleo-arranque-memoria-procesos.md#136-espera-sin-gasto)

**estación (de saltos)** — Línea 'frK_nombre: jjmp nombre' que reach inserta para que un salto fuera del rango de ±32767 palabras llegue a su destino en etapas. [definido en capítulo 08, §2.7](08-luma-cuerpo-procesos-y-casa.md#27-inclusión-de-la-lectora-y-alcance-de-saltos)

**estante / en espera** — El estante son todos los archivos cuya etiqueta empieza con libro, concatenados en el orden del listado como un solo libro; con prefijo e (`elibro*`) están en espera. [definido en capítulo 08, §8.8.16](08-luma-cuerpo-procesos-y-casa.md#8816-libro--elibro-)

**etiqueta** — Nombre de archivo Janax: UTF-8 válido no vacío, que puede contener '/' (no hay directorios reales). En el anfitrión se guarda como su forma normal C escrita en hexadecimal minúsculo, dos dígitos por byte. [definido en capítulo 04, §10.2](04-nucleo-abi-de-pedidos.md#102-de-etiqueta-a-nombre-de-archivo)

**examen (ev_exam)** — Aprende de los renglones de aprendizaje y golpea sobre ellos mismos. La nota (EVS), en bits enteros, mide lo ganado contra el ciego menos el costo de las piezas. [definido en capítulo 06, §9.1](06-razar-lectura-y-organos.md#91-ev_exam)

## F

**familia** — De una cabina X: su padre, uno de sus hijos o un hermano (mismo P_PARENT), que no sea X y no haya terminado. [definido en capítulo 04, §1](04-nucleo-abi-de-pedidos.md#1-definiciones-y-notación)

**fantasma** — Forma viva oculta (F_HIDDEN ≠ 0), y también el dibujo atenuado, con color (c + 2·fondo)/3, que queda en el cuadro de un candidato que perdió ante el juez. [definido en capítulo 10, §10.8](10-luma-pantalla-lluvia-y-organos-vivos.md#108-formas-vivas)

**fila (de cabinas)** — Lista doblemente enlazada de cabinas listas, en orden de llegada (FIFO). [definido en capítulo 03, §13.3](03-nucleo-arranque-memoria-procesos.md#133-fila)

**fila (ROOMT)** — Un qword por unidad del libro con su número de palabra. La unidad 0 es un renglón y NTOK es la cantidad de unidades. [definido en capítulo 06, §5.5](06-razar-lectura-y-organos.md#55-la-fila)

**firma (archivo)** — 32 bytes binarios con pasajes apartados del diario, reconocidos, y pasajes apartados de otro libro tomados por suyos; modelo de orden 3 con pasajes de 1000 letras. [definido en capítulo 08, §8.8.8](08-luma-cuerpo-procesos-y-casa.md#888-firma)

**firma de idioma (lj_)** — Modelo de contexto de dos símbolos (32 símbolos, Krichevsky-Trofimov) por libro; el costo del texto de él decide el peso y el idioma de cada libro. [definido en capítulo 09, §19.1](09-luma-conversacion-y-respuesta.md#191-modelo)

**flujo de la mente (D_FLB)** — Memoria de 2048 bytes con entradas de clase (pensamiento, ensayo rechazado, ensayo reemplazado) y su texto, con tope de 16 renglones del panel. [definido en capítulo 10, §10.5.5](10-luma-pantalla-lluvia-y-organos-vivos.md#1055-flujo-de-la-mente-d_flb)

**forma (de hilos)** — Relación entre dos palabras A y B que no son de la mitad, separadas por 1 a 3 palabras intermedias. Su clave mezcla k con las huellas de las intermedias. [definido en capítulo 07, §3.4](07-razar-cardumen-canto-hilos.md#34-formas-y-pares)

**forma (F_) del ensamblador** — Campo de cada entrada de la tabla del ensamblador que dice qué operandos lee el nombre y qué palabras emite, de F_NONE = 0 a F_WCHECK = 20; los formatos de operandos F_NONE..F_RR (0 a 6) arman rd, ra e imm16. [definido en capítulo 02, §3.2](02-ensamblador-pdp-y-construccion.md#32-formatos-campo-forma-de-la-tabla)

**forma (receta guardada)** — Receta de hasta 31 letras guardada como palabra de 16 bytes en ORGT; `'>'` k la despliega. [definido en capítulo 06, §11.6](06-razar-lectura-y-organos.md#116-forma)

**forma viva** — Una de las NF = 8 recetas que crecen como partículas con resortes dentro de su habitación de 40 × 50 celdas, mutan y son juzgadas. [definido en capítulo 10, §10.8.1](10-luma-pantalla-lluvia-y-organos-vivos.md#1081-población-y-registro-de-forma)

## G

**ganchos (COMER, LUMA)** — Espacios de nombres que gen_comer.py y gen_luma.py inyectan en gen_formas.py (layout, more_vars, init, routines) para componer luma.jsm desde un único esqueleto. [definido en capítulo 08, §2.2](08-luma-cuerpo-procesos-y-casa.md#22-orden-de-ejecución-mecanismo-de-ganchos)

**generación (V_GEN)** — Contador que se incrementa al comenzar la primera pasada de cada fuente; libera de un golpe los símbolos y macros de la fuente anterior. [definido en capítulo 02, §8.1](02-ensamblador-pdp-y-construccion.md#81-tabla-de-símbolos-find_entry-ensambladorjsm1854-1913)

**genoma / instintos** — Qword de instintos: byte 0 paciencia (GPAC), byte 1 firmeza (GFIRM), byte 2 lecturas. Evoluciona por examen. [definido en capítulo 06, §9.3](06-razar-lectura-y-organos.md#93-genoma-y-evolución)

**gesto** — Toda tecla o botón de él. Si la exploración estaba quieta, amplía RADIUS y abre un recorrido nuevo con presupuesto WTOTAL. [definido en capítulo 10, §10.8.8](10-luma-pantalla-lluvia-y-organos-vivos.md#1088-gesto)

**gota** — Cabeza blanca de una columna de lluvia (clase 0). Deja detrás RQ = 9 filas brillantes y una estela, y baja invisible hasta la fila 47. [definido en capítulo 10, §10.4.3](10-luma-pantalla-lluvia-y-organos-vivos.md#1043-paso-de-lluvia-r_rain_push)

**gustos (tabla de gustos)** — Tabla de hasta GU_K = 256 entradas de 24 bytes {huella del libro, N, S}; de cada entrada sale el deseo del libro (dse_wish(S, N)). Vive en la sala de gustos y se guarda en el archivo gustos. [definido en capítulo 09, §2.2](09-luma-conversacion-y-respuesta.md#22-la-sala-de-gustos-d_gblk); archivo en [capítulo 08, §8.7.1](08-luma-cuerpo-procesos-y-casa.md#871-gustos-animo-imagina)

## H

**hábitat (estrato)** — Modo de una criatura (camina, vuela o repta) según el grupo que la mueve y la fase de sus miembros más fuertes; cielo, tierra y lo de abajo ocupan una altura proporcional a cuántos viven en cada uno. [definido en capítulo 10, §10.12.7](10-luma-pantalla-lluvia-y-organos-vivos.md#10127-hábitats)

**herencia de firmas (P_SIGNED / P_SIGNNEXT)** — Máscara de clases que una línea firmó al nacer (pedido 45); esas clases no esperan firma, pero siguen sometidas a los porteros. signed_mask hace AND por toda la línea. [definido en capítulo 03, §10.4](03-nucleo-arranque-memoria-procesos.md#104-herencia-de-firmas-45)

**hilo de la ventana** — Hilo del anfitrión (screen_thread) dueño de la ventana y de su bucle de mensajes; lo crea el primer pedido 40 válido si no está JANAX_SIN_VENTANA. [definido en capítulo 05, §1](05-nucleo-pantalla-teclado-vigia.md#1-definiciones-y-notación)

**hilo de profundidad uno (th_)** — Huellas del intercambio que termina (TH_P) y del que empieza (TH_N), hasta 24, usadas para saber si él siguió el tema o trajo algo nuevo. [definido en capítulo 09, §6.2](09-luma-conversacion-y-respuesta.md#62-el-hilo-de-profundidad-uno-th_)

**hilos (hilos.jsm)** — Razonador de una cabina que lee pares, encuentra relaciones (formas), las une en un while de hipótesis, deduce relaciones nuevas y deja en la casa lo que sabe para el libro siguiente. [definido en capítulo 07, §3.1](07-razar-cardumen-canto-hilos.md#31-qué-es)

**hipótesis (en coma, despierta)** — Entrada de HAG: "la segunda relación es la primera". Si es refutada queda en coma en HREF, y despierta cuando una unión toca una palabra de su contexto. [definido en capítulo 07, §3.7](07-razar-cardumen-canto-hilos.md#37-la-hipótesis-y-su-examen)

**huecos (pedido 42)** — Modo en que el remero ejecuta la cabina con prioridad de hilo THREAD_PRIORITY_IDLE. [definido en capítulo 03, §12.4](03-nucleo-arranque-memoria-procesos.md#124-huecos-42)

**.huella** — 8 bytes FNV-1a de 64 bits sobre la tabla de nombres, la fuente y cada archivo incluido. Si coincide con B.huella, la fuente no se vuelve a armar. [definido en capítulo 02, §16](02-ensamblador-pdp-y-construccion.md#16-huella-huella)

**huella de palabra** — FNV-1a de 64 bits sobre los puntos de código base de sus letras; 0 se reemplaza por 1 y mayúsculas y minúsculas ASCII dan la misma huella. [definido en capítulo 09, §1.3](09-luma-conversacion-y-respuesta.md#13-letras-palabras-y-huellas)

**huella del estante (shelf_print)** — FNV-1a de la etiqueta y los bytes de cada libro del estante; separa las recetas de libros distintos. [definido en capítulo 06, §11.5](06-razar-lectura-y-organos.md#115-huella-y-estante)

**huella del panel (D_FLH)** — Mezcla h·1000003 + v de los contadores y extremos de D_OUT, D_IN y D_FLB. El panel se redibuja sólo cuando cambia. [definido en capítulo 10, §10.5.2](10-luma-pantalla-lluvia-y-organos-vivos.md#1052-huella-y-protocolo-de-redibujo-r_panel)

## I

**imaginación (im_imagine)** — Reemplazo de una palabra de la respuesta por otra que comparte rol (mismos vecinos) en la ventana, sólo si la cláusula resultante nunca fue leída. [definido en capítulo 09, §15.2](09-luma-conversacion-y-respuesta.md#152-im_imagine)

**ingesta del disco (r_host_eat)** — Consumo de cada ruta nueva y quieta que entrega el vigía (pedido 39). Si es texto se guarda como `libro-disco-<hex>`, salvo que la prueba de registro la marque como `registro-disco-<hex>.` [definido en capítulo 08, §4.5](08-luma-cuerpo-procesos-y-casa.md#45-ingesta-del-disco-r_host_eat)

**instalador instalar-luma.exe** — Ejecutable PE64 interactivo o silencioso que crea Luma\ y Comida\, desempaca los paquetes, ensambla a Luma con PDP en la máquina destino y crea dos accesos directos. [definido en capítulo 11, §11.5](11-instalador-lanzador-y-publicacion.md#115-instalador-instalar-lumaexe)

**instrucción / imaginado / mecanismo** — Una forma que une palabras con el mismo rol es una instrucción; con ella hilos imagina roles nuevos (archivo imaginado), los examina en libros siguientes y vota por mecanismo. [definido en capítulo 07, §3.15](07-razar-cardumen-canto-hilos.md#315-instrucciones-imaginado-y-mecanismos)

**interruptor** — Diferencia de piso 2 en la que un llenado es 0 (dicho vacío): una palabra que está o no está en el mismo marco. [definido en capítulo 06, §6.4](06-razar-lectura-y-organos.md#64-pulso-y-diferencia)

**invariante de las dos pasadas** — Cada sentencia DEBE ocupar los mismos bytes en ambas pasadas. jfirst, times y repeat con valores definidos más adelante pueden romperla sin error. [definido en capítulo 02, §13.3](02-ensamblador-pdp-y-construccion.md#133-invariante-de-las-dos-pasadas)

## J

**JANAX_SIN** — Variable de entorno de Windows con nombres separados por comas que se quitan del catálogo de jhost. [definido en capítulo 01, §7.7](01-idioma-janax.md#77-reducción-del-catálogo-en-windows-janax_sin)

**jaula (pedido 34)** — Presupuesto de instrucciones que un padre le pone a un hijo: P_LIMIT = P_SERVED + instrucciones (0 = sin límite); al pasarlo, el hijo termina con código 10 al final del turno. [definido en capítulo 04, §9.6](04-nucleo-abi-de-pedidos.md#96-familia)

**jcall0** — Llamada cuya vuelta pone en 0 el registro rd, lo que anula cualquier escritura de la rutina sobre rd. [definido en capítulo 01, §5.7](01-idioma-janax.md#57-llamadas-y-pila-de-retorno)

**jfirst** — Construcción de ensamblado que carga el tamaño y emite jsys r, r para construir el ambiente 0 de un proceso. [definido en capítulo 01, §6.2](01-idioma-janax.md#62-jfirst-r-tamaño)

**jhost (ventana al anfitrión)** — Opcódigo 17h: R[ra] apunta a un bloque de 32 bytes {pedido, a, b, c} y R[rd] recibe la respuesta del anfitrión. En el escalón 0 el catálogo ofrece escribir; en JanaxOS está vacío (el pedido 0 responde 0 y cualquier otro, −1). [definido en capítulo 01, §7](01-idioma-janax.md#7-protocolo-de-la-ventana-al-anfitrión-jhost)

**jldadd / jldx** — jldadd suma rd a la palabra en ra+imm, la guarda y deja la suma en rd; jldx carga la palabra en ra + rb·8. [definido en capítulo 01, §5.1](01-idioma-janax.md#51-tabla-completa)

**jmap** — Mapa de 16 bytes del traductor x86-64: el registro nativo asignado a cada registro Janax, o −1 si vive en el contexto. [definido en capítulo 01, §11.2](01-idioma-janax.md#112-asignación-de-registros)

**jsys** — Opcódigo 16h, la ventanilla de JanaxOS: atiende la cola de pedidos cuya dirección está en ra y deja en rd cuántas entradas tenía; el primer jsys de una cabina es la primera orden. [definido en capítulo 04, §3](04-nucleo-abi-de-pedidos.md#3-convención-de-llamada-de-jsys)

**jueces externos** — Programas Python que Razar nunca lee; miden desde afuera los archivos de la casa contra bancos que Razar no vio. [definido en capítulo 07, §7](07-razar-cardumen-canto-hilos.md#7-jueces-externos-razarjueces)

**juez de armonía** — Asigna a cada diferencia los bits ahorrados en 2^-16 de bit: g·n menos el costo del nombre, lg16(U)·P/2. [definido en capítulo 06, §7](06-razar-lectura-y-organos.md#7-el-juez-de-armonía)

**juez de la marcha (DL)** — Longitud de descripción en bits de un modelo de K motivos sobre L miembros, con códigos gamma y zigzag. [definido en capítulo 10, §10.12.4](10-luma-pantalla-lluvia-y-organos-vivos.md#10124-juez-de-la-marcha)

**juez de las formas** — Valor L(C − M) − n·3907 milésimas de bit por forma. Un candidato gana si el total de la población con él más TIEOK supera el TOTAL vigente; si pierde, queda un motivo (no-better, crowds, not-new, longer). [definido en capítulo 10, §10.8.4](10-luma-pantalla-lluvia-y-organos-vivos.md#1084-juez)

## L

**lanzador luma.exe** — Ejecutable PE64 que deriva sus rutas de su propia ubicación, fija JANAX_ARCHIVOS, JANAX_VIGIA y JANAX_VENTANA_FONDO, arranca el núcleo con luma.bin y lo hace renacer cuando aparece la señal de dormir. [definido en capítulo 11, §11.2](11-instalador-lanzador-y-publicacion.md#112-lanzador-lumaexe-datos-rutas-y-entorno)

**lente** — Tejido 1: un engranaje apilado en ORGP (ocho como máximo) que transforma cada mirada. [definido en capítulo 06, §10.6](06-razar-lectura-y-organos.md#106-células-y-tejidos)

**libertad / actos (r_free)** — Cuando no queda nada que probar, el cuerpo sortea un acto (descanso, pensar, regalar, pintar, dormir, hablar primero, leer) con pesos de Krichevsky–Trofimov (2S+1)·2^20/(N+1). [definido en capítulo 08, §4.4](08-luma-cuerpo-procesos-y-casa.md#44-libertad-elección-de-actos-r_free)

**libro** — Secuencia de bytes que recorre el lector: el archivo libro, la concatenación de un estante, un libro del disco o un libro del anfitrión. [definido en capítulo 06, §1](06-razar-lectura-y-organos.md#1-definiciones-y-notación)

**el Libro** — La etiqueta exacta libro (o elibro en espera): fuente propia de las oraciones sobre la palabra y de la tabla de pares de la ortografía. [definido en capítulo 09, §1.5](09-luma-conversacion-y-respuesta.md#15-la-lista-de-libros)

**libro del disco** — Archivo libro-disco-H (H de 16 dígitos hexadecimales): huella FNV-1a del contenido (8 bytes LE), tamaño (8 bytes LE) y ruta del anfitrión. El texto no se copia. [definido en capítulo 08, §8.8.17](08-luma-cuerpo-procesos-y-casa.md#8817-libro-disco-16-hex-elibro-disco-16-hex)

**línea (de una cabina)** — La cabina y toda su descendencia; cuando la cabina termina, su línea termina con código 9, salvo en los hijos del núcleo. [definido en capítulo 03, §9.5](03-nucleo-arranque-memoria-procesos.md#95-fin-de-una-línea-line_end)

**lista (señal)** — Archivo lista (5 bytes 'lista') que r_lista escribe al recibir la palabra 5; indica que alguna vida llegó a tener la pensadora lista, no que la actual lo esté. [definido en capítulo 08, §5.4](08-luma-cuerpo-procesos-y-casa.md#54-la-señal-lista); formato en [capítulo 08, §8.6.3](08-luma-cuerpo-procesos-y-casa.md#863-pregunta-respuesta-lista)

**lista de listos** — Rutas UTF-8 de archivos maduros que cumplen las reglas del anfitrión; el pedido 39 las entrega de a una, la más antigua primero. [definido en capítulo 05, §10.7](05-nucleo-pantalla-teclado-vigia.md#107-quietud-reglas-y-lista-de-listos)

**llave (de una caja)** — El handle del anfitrión con que una cabina tiene una caja: al destruir la sala vuelve al anfitrión, y la dote (pedido 22) la duplica para el hijo. [definido en capítulo 04, §9.2](04-nucleo-abi-de-pedidos.md#92-memoria-y-cajas); ver también clave.

**llenado** — Valor que ocupa el hueco: una letra, un número de palabra, 0 (dicho vacío) o dos palabras empaquetadas. [definido en capítulo 06, §1](06-razar-lectura-y-organos.md#1-definiciones-y-notación)

**lluvia hexadecimal** — Rejilla de 52 columnas por 38 filas a la derecha de la pantalla, donde caen como dígitos hexadecimales los bytes de los registros de las criaturas, los pensamientos y los ensayos de las formas. Sólo avanza con esos eventos, nunca con un temporizador. [definido en capítulo 10, §10.4](10-luma-pantalla-lluvia-y-organos-vivos.md#104-lluvia-hexadecimal)

**lugar** — Vecino de la palabra preguntada: clave 2·h (la sigue h) o 2·h+1 (h la precede), con sus veces y su texto; hasta 64. [definido en capítulo 09, §12.2](09-luma-conversacion-y-respuesta.md#122-primera-lectura-lugares-y-centro-del-corazón-cnb--2)

## M

**manejador** — Índice en la tabla de archivos de la cabina (P_FILES). La tabla se duplica al llenarse y la usan los pedidos 5, 6, 7 y 38. [definido en capítulo 04, §9.3.1](04-nucleo-abi-de-pedidos.md#931-tabla-de-manejadores)

**marca** — Unidad de un solo carácter no alfanumérico, o una secuencia UTF-8 que no es C3 xx. Recibe número como una palabra. [definido en capítulo 06, §1](06-razar-lectura-y-organos.md#1-definiciones-y-notación)

**marcado** — Paso de la ventanilla que valida cada entrada en orden: clase en rango, portero, espera de los pedidos 29 y 41, y firma. Deja la clase presente o responde −1. [definido en capítulo 04, §5](04-nucleo-abi-de-pedidos.md#5-procesamiento-de-un-toque)

**marcador PENDIENTE + N** — Texto y destino provisorios que ocupan el lugar del DOI de la versión N hasta que Zenodo lo asigna; después se reemplazan en un commit 'docs: DOI de la vX.YY'. [definido en capítulo 11, §11.8.3](11-instalador-lanzador-y-publicacion.md#1183-secuencia)

**marco (r_marco)** — Voto entre tres señales (siguió el tema, trajo algo nuevo, activación) cuyo marco de confianza paga hilo, improvisación, imaginación y caminos. [definido en capítulo 09, §6.3](09-luma-conversacion-y-respuesta.md#63-el-marco-r_marco)

**marcos y notas** — Líneas M: (5 tokens alrededor del primer lugar) y N: (notas numeradas) que memoria_pares escribe para que el cubo aprenda. [definido en capítulo 07, §2.10](07-razar-cardumen-canto-hilos.md#210-marcos-y-notas-marcos-para-el-cubo)

**MAX_PROGRAM, DATA_SIZE, RET_DEPTH, OP_COUNT** — Constantes de la máquina del escalón 0: 1 MiB de programa, 1 MiB de datos, 4096 llamadas anidadas y 29 códigos de operación. [definido en capítulo 01, §3.2](01-idioma-janax.md#32-constantes-de-la-máquina-escalón-0)

**me-comi (archivo)** — Archivo de la conversación al que van los enunciados mientras GREET = 1, entre ellos el aviso `me comí <ruta>` de cada comida nueva. [definido en capítulo 08, §8.6.1](08-luma-cuerpo-procesos-y-casa.md#861-dialogo-me-comi-charla-libros)

**memoria cercana** — Elige el ejemplo no dicho cuya línea tiene menos palabras ausentes de lo que él dijo y devuelve su respuesta tal cual. [definido en capítulo 09, §11.5](09-luma-conversacion-y-respuesta.md#115-memoria-cercana)

**memoria de piezas** — Archivo memoria[N] con las piezas de vidas anteriores. Una pieza no confirmada pierde la mitad de su evidencia por vida. [definido en capítulo 06, §8](06-razar-lectura-y-organos.md#8-memoria-de-piezas)

**memoria de programa / memoria de datos** — Dos espacios separados: el programa, N palabras inaccesibles para las instrucciones de memoria; los datos, DATA_SIZE = 2^20 bytes direccionados por byte y en cero al empezar. [definido en capítulo 01, §3.1](01-idioma-janax.md#31-estado)

**microportero** — Nodo de portero propio de una cabina, uno por puerta, que cuelga del portero del padre con los derechos recortados por AND. [definido en capítulo 03, §8.3](03-nucleo-arranque-memoria-procesos.md#83-microporteros-de-una-cabina)

**mirada / ojo** — Valor de la palabra que el ojo ve en la ventana (j10 posición, j11 nítido o borroso), pasado por las lentes. [definido en capítulo 06, §10.4](06-razar-lectura-y-organos.md#104-la-mirada-og_look)

**la mitad** — Las palabras más dichas que juntas cubren la mitad de lo dicho; el umbral sale del libro, no hay cantidad fija. En Luma, HF_T es el mayor c con 2·masa(c) ≥ masa(1). [definido en capítulo 07, §1.5](07-razar-cardumen-canto-hilos.md#15-la-mitad)

**modo fondo (JANAX_VENTANA_FONDO)** — La ventana nace visible al fondo del orden Z, sin tomar el foco. El lanzador lo activa después del primer nacimiento. [definido en capítulo 05, §5.4](05-nucleo-pantalla-teclado-vigia.md#54-mostrar-y-modo-fondo)

**modo simbiosis** — Modo en que el núcleo corre como janaxos.exe sobre Windows x86-64; se detecta comparando rcx con gs:[60h]. [definido en capítulo 03, §3.2](03-nucleo-arranque-memoria-procesos.md#32-detección-de-modo)

**modo sin ventana** — Con JANAX_SIN_VENTANA la pantalla valida y responde igual pero nunca crea ventana; 41 no duerme, 44 y 47 responden 0. [definido en capítulo 05, §5.10](05-nucleo-pantalla-teclado-vigia.md#510-modo-sin-ventana)

**molde (organo.molde)** — Archivo de bloques @c con las etiquetas de pulso, hijo y organo.inc, y la descripción de cada letra. [definido en capítulo 06, §11.3](06-razar-lectura-y-organos.md#113-el-molde)

**motor de ejecución** — Forma de ejecutar las palabras: 0 intérprete, 1 rutinas (tabla) o 2 traductor (código nativo), elegida con JANAX_MOTOR. [definido en capítulo 03, §5.3](03-nucleo-arranque-memoria-procesos.md#53-motores-de-ejecución)

**motor de selección de líneas (r_dlg_answer)** — Recorre sus libros y elige la línea de mayor D_CNT × peso del libro respecto de D_WORDS. [definido en capítulo 09, §8](09-luma-conversacion-y-respuesta.md#8-el-motor-de-selección-de-líneas-r_dlg_answer)

## N

**nacimiento / renacimiento** — Etiqueta .nacer del lanzador: borra la señal de dormir, trunca luma.log y crea el proceso del núcleo con la salida redirigida al registro; se repite después de cada dormir. [definido en capítulo 11, §11.3.2](11-instalador-lanzador-y-publicacion.md#1132-nacimiento)

**nadie firma** — Cuando nada puede avanzar, todo registro de firma en espera se rechaza y quien espera un saludo se despierta con −1. [definido en capítulo 03, §10.6](03-nucleo-arranque-memoria-procesos.md#106-nadie-firma)

**nicho** — Uno de seis lugares definidos por el primer hueco del órgano. Guarda el campeón con su nota en el archivo organos. [definido en capítulo 06, §12.4](06-razar-lectura-y-organos.md#124-nichos)

**nitidez por lugares** — Lugar = forma más lado. Dos palabras que comparten lugares forman una pareja; el diario nitidas acumula los lugares compartidos por pedazo. [definido en capítulo 07, §3.16](07-razar-cardumen-canto-hilos.md#316-nitidez-por-lugares)

**nombre (archivo)** — Texto de dos líneas que escribe r_nombre_keep: el nombre (letras, dígitos y espacios) y un sello de 16 dígitos hexadecimales en minúsculas. [definido en capítulo 08, §8.5.2](08-luma-cuerpo-procesos-y-casa.md#852-nombre)

**nombres prestados (r_names_out)** — Quita de la respuesta las palabras de su nombre y los nombres propios entre comas. [definido en capítulo 09, §16.3](09-luma-conversacion-y-respuesta.md#163-nombres-prestados-r_names_out)

**nube** — Archivo o bloque de memoria en formato .nube versión 3; el núcleo dibuja sólo su primer nivel. [definido en capítulo 05, §4.1](05-nucleo-pantalla-teclado-vigia.md#41-formato-nube-versión-3-lo-que-lee-el-núcleo)

**numeración de versiones por primos** — Versiones vM.mm con N = 100·M + mm. Desde v0.11 cada versión es el primo siguiente; la regla se aplica a mano y no hay código que la imponga. [definido en capítulo 11, §11.8.1](11-instalador-lanzador-y-publicacion.md#1181-numeración-de-versiones)

**número de orden de while / CHECKS** — Índice de aparición de cada jwhile en la pasada. CHECKS[orden] guarda la dirección de su condición, y así la segunda pasada salta a una condición que todavía no leyó. [definido en capítulo 02, §10.3](02-ensamblador-pdp-y-construccion.md#103-algoritmo)

## O

**oído / temblor** — Medición del núcleo de pares cuando la pregunta llega con piezas que tiemblan con probabilidad PCH, o según la tabla de confusiones cf. [definido en capítulo 07, §2.6](07-razar-cardumen-canto-hilos.md#26-el-oído-y-el-núcleo-modo-sin-canta-ni-semilla)

**oración sobre la palabra** — Oración en la que la palabra preguntada es la primera que cuenta, con al menos 2 rachas de 4+ bytes y menos de 480 bytes. [definido en capítulo 09, §12.3](09-luma-conversacion-y-respuesta.md#123-oración-sobre-la-palabra)

**órgano** — Cadena de letras de 4 bits (1..15) que el lector de órganos (organo.inc) interpreta sobre cada ventana; su texto en el tablero es una receta. [definido en capítulo 06, §10](06-razar-lectura-y-organos.md#10-el-lector-de-órganos-organoinc)

## P

**P_SCRW** — Estado de espera de una cabina sobre la pantalla: 0 no duerme, 1 duerme, 2 despertada. [definido en capítulo 05, §8.2](05-nucleo-pantalla-teclado-vigia.md#82-estados-de-p_scrw)

**paisaje / auditoría** — Paisaje: prueba todos los órganos cortos. Auditoría: examina órganos al azar en orden, en orden inverso con basura y en forma canónica. [definido en capítulo 06, §12.7](06-razar-lectura-y-organos.md#127-paisaje-y-auditoría)

**palabra de instrucción** — Unidad de 32 bits little-endian con campos op (bits 0-7), rd (8-11), ra (12-15) e imm16 (16-31); rb son los 4 bits bajos de imm16. [definido en capítulo 01, §4.1](01-idioma-janax.md#41-palabra-de-instrucción)

**palabra nítida** — Palabra que no es de la mitad: en Luma, la que tiene dh_wl `<` HF_T. [definido en capítulo 09, §20.1](09-luma-conversacion-y-respuesta.md#201-dh_wl-y-dh_half)

**palabra que cuenta** — Palabra de 4 letras o más (j0 ≥ 4); casi toda la conversación considera sólo éstas. [definido en capítulo 09, §1.3](09-luma-conversacion-y-respuesta.md#13-letras-palabras-y-huellas)

**palabra Venn** — Palabra de 64 bits: regiones (bits 0-2), mirada, criterio, descendente, orden entero y cantidad máxima; los bits fuera de VENN_KNOWN deben rechazarse. [definido en capítulo 05, §11.2](05-nucleo-pantalla-teclado-vigia.md#112-palabra-venn)

**palabras de buzón 1-5** — Palabras de 64 bits entre cuerpo y pensadora (pedidos 30/31): 1 pregunta, 2 estudio, 3 hablar primero, 4 hecho, 5 lista. [definido en capítulo 08, §5.1](08-luma-cuerpo-procesos-y-casa.md#51-canales)

**panel** — Franja inferior de 640 × 149 celdas, dibujada en puntos finos en FPL: a la izquierda, la conversación y la línea en escritura; a la derecha, las filas 22–37 de la lluvia. [definido en capítulo 10, §10.5](10-luma-pantalla-lluvia-y-organos-vivos.md#105-panel)

**pantalla de Janax** — La imagen que los programas muestran y la ventana del anfitrión que la presenta (so/pantalla.inc). [definido en capítulo 05, §1](05-nucleo-pantalla-teclado-vigia.md#1-definiciones-y-notación)

**pantalla de la ventanilla** — Servidor interno sintonizado a una clase de pedido (tune, nscreens, retunes), global a todo el sistema. No tiene relación con la imagen. [definido en capítulo 05, §1](05-nucleo-pantalla-teclado-vigia.md#1-definiciones-y-notación)

**papel (cuerpo, lectora, pensadora)** — Un mismo luma.bin cumple varios papeles según el qword 20h de sus datos iniciales: 0 cuerpo, 2 pensadora, otro valor lectora. El canto y el cardumen son binarios aparte. [definido en capítulo 08, §4.1](08-luma-cuerpo-procesos-y-casa.md#41-un-binario-varios-papeles)

**paquete (.paquete)** — Sucesión de entradas sin cabecera: L (u32), nombre ASCII, crudo (u64), pack (u64) y los datos comprimidos con MSZIP de cabinet.dll. [definido en capítulo 11, §11.6.1](11-instalador-lanzador-y-publicacion.md#1161-estructura)

**paquete de fuentes** — fuentes.paquete: todos los .inc de escalon0, so y razar, más luma.jsm, pulso.datos.jsm, memoria_pares.jsm y memoria_pares.datos.jsm, con nombres etiqueta("PDP/..."). [definido en capítulo 11, §11.7.3](11-instalador-lanzador-y-publicacion.md#1173-paquete-de-fuentes)

**paquete de la casa** — casa.paquete: la casa pública de Luma sin el conjunto FUERA (lectora, pensadora, molde, engranajes, dormir, pregunta, respuesta). Exige que esté vida-memoria. [definido en capítulo 11, §11.7.4](11-instalador-lanzador-y-publicacion.md#1174-paquete-de-la-casa)

**par ortográfico probado** — Par de bytes consecutivos que tienen 2 palabras o más, sumando la biblioteca y el libro. Una palabra que cumple la regla no se corrige. [definido en capítulo 06, §14.4](06-razar-lectura-y-organos.md#144-regla)

**partícula** — Una celda marcada (bit a 1) de la rejilla, con un color RGB; el pedido 40 responde cuántas dibujó. [definido en capítulo 05, §1](05-nucleo-pantalla-teclado-vigia.md#1-definiciones-y-notación)

**pasada** — Recorrido completo de una fuente por el ensamblador. PDP hace exactamente dos por fuente y no itera. [definido en capítulo 02, §13](02-ensamblador-pdp-y-construccion.md#13-pasadas-y-resolución-de-saltos)

**paso / paréntesis (encadena)** — Paso: clase de preguntas en la que cambia exactamente un lugar además de la entidad. Paréntesis: cabeza y final que delimitan una pregunta compuesta. [definido en capítulo 07, §6](07-razar-cardumen-canto-hilos.md#6-encadenajsm)

**paso sigue** — Único paso de una conversación: busca lo que sigue en la charla, luego costumbres, el Libro, el corazón y los demás libros; si nada, devuelve la pregunta. [definido en capítulo 09, §10](09-luma-conversacion-y-respuesta.md#10-el-paso-sigue-y-el-orden-de-fuentes)

**PDP (ensamblador PDP)** — Programa Janax que arma fuentes .jsm en binarios de palabras de 32 bits dentro de JanaxOS. No tiene línea de órdenes: arma todas las fuentes PDP/….jsm de la carpeta del sistema y termina con jhalt. [definido en capítulo 02, §2](02-ensamblador-pdp-y-construccion.md#2-componentes)

**pedazo** — Tramo del estante (unos 100 KB, 102400 bytes por omisión en hilos), cortado en fin de línea, que lee cada vida; al terminarlo, hilos escribe sigue y se rehace con el pedido 36. [definido en capítulo 06, §5.1](06-razar-lectura-y-organos.md#51-fuentes-del-libro)

**pedido / clase** — Una entrada de 32 bytes de la cola de jsys; su clase (kind) es el número de pedido, de 1 a KINDS = 47. [definido en capítulo 04, §4.2](04-nucleo-abi-de-pedidos.md#42-entrada-32-bytes)

**pedido con hueco** — Entrada {clave, silueta, peso, ocurrencia} de ROOMR: un marco con un hueco y lo que lo llena. [definido en capítulo 06, §6.2](06-razar-lectura-y-organos.md#62-post)

**pedido importante** — Clase marcada en kind_important: si quien la pide no es hijo del núcleo, requiere la firma del padre, salvo que la haya heredado. [definido en capítulo 04, §7.3](04-nucleo-abi-de-pedidos.md#73-pedidos-importantes-y-firma-del-padre)

**pendiente** — Hipótesis con una sola confirmación leída, guardada para el libro siguiente. Suma a una hipótesis que ya existe, nunca la crea. [definido en capítulo 07, §3.12](07-razar-cardumen-canto-hilos.md#312-pendiente)

**pensadora** — Hija del cuerpo (luma/pensadora.bin con qword 20h = 2) que atiende las tareas 1 (pregunta), 2 (estudio) y 3 (hablar primero): lee pregunta, ejecuta r_dlg_sent y contesta por el archivo respuesta y la palabra 4. [definido en capítulo 08, §5.5](08-luma-cuerpo-procesos-y-casa.md#55-bucle-de-la-pensadora)

**peso de una palabra (r_winfo, dh_wt)** — (2S+1)(WFN+1)·1000/((L+1)(2L+1)); dh_wt = max(r_winfo − 1000, 0). [definido en capítulo 09, §20.2](09-luma-conversacion-y-respuesta.md#202-r_winfo-y-dh_wt)

**peso del libro** — dse_wish(S, N) de los gustos multiplicado por el factor de firma; un libro con peso 0 nunca aporta línea. [definido en capítulo 09, §8.3](09-luma-conversacion-y-respuesta.md#83-peso-del-libro)

**pieza (de Razar)** — Diferencia a la que el juez de armonía da más de 0 bits ahorrados. [definido en capítulo 06, §7](06-razar-lectura-y-organos.md#7-el-juez-de-armonía)

**pieza (del canto)** — Media letra: la letra número L se canta como las piezas L div BASE y L mod BASE (BASE = 7 con Fano, 30 con cf). [definido en capítulo 07, §2.5](07-razar-cardumen-canto-hilos.md#25-el-alfabeto-y-las-piezas)

**pila de retorno** — Pila separada de la memoria de datos e inaccesible al programa, de hasta RET_DEPTH = 4096 entradas, donde jcall y jcall0 guardan la vuelta. En JanaxOS es una reserva fija por cabina, comprometida a demanda (ret_grow) y recortada al final del turno (ret_trim). [definido en capítulo 01, §3.1](01-idioma-janax.md#31-estado)

**piso** — Nivel del pedido con hueco. Piso 1: letras de una palabra (gemelos). Piso 2: una palabra o el vacío en un marco de tres. Piso 3: dos palabras entre extremos (puertas). [definido en capítulo 06, §6.1](06-razar-lectura-y-organos.md#61-pisos-y-moldes)

**pistas** — Palabras de 4+ letras de una oración que son palabras de la regla o vecinas de algún lugar; desempatan la elección de las seis mejores oraciones. [definido en capítulo 09, §12.5](09-luma-conversacion-y-respuesta.md#125-pistas-y-selección-de-oraciones-cnb--30)

**planificador** — Programa Janax del núcleo, ejecutado como ayudante, que calcula el turno de una cabina a partir de su bolita y de c16. [definido en capítulo 03, §12.2](03-nucleo-arranque-memoria-procesos.md#122-programa-planificador)

**portero** — Nodo de 48 bytes del árbol global de permisos {padre, derechos, vivo, puerta, prefijo}; revocar inhabilita toda su rama. [definido en capítulo 03, §8.1](03-nucleo-arranque-memoria-procesos.md#81-nodo)

**prefijo de etiqueta** — Restricción de un portero de archivos: cada nodo con prefijo en el camino a la raíz debe ser prefijo, byte a byte, de la etiqueta normalizada. [definido en capítulo 04, §7.2](04-nucleo-abi-de-pedidos.md#72-prefijo-de-etiqueta)

**pregunta (archivo)** — Bytes crudos de la línea que él escribió (se leen hasta 1000); la pensadora la lee para atender la tarea 1. [definido en capítulo 08, §8.6.3](08-luma-cuerpo-procesos-y-casa.md#863-pregunta-respuesta-lista)

**presupuesto** — Servicio máximo absoluto de un hijo (P_LIMIT, pedido 34); al superarlo, el hijo termina con código 10. [definido en capítulo 03, §11](03-nucleo-arranque-memoria-procesos.md#11-presupuesto-y-servicio)

**primera orden** — Mientras P_ROOM0 = 0, toda jsys construye la sala 0 de tamaño ra (redondeado a 8, como máximo 2^32), copia los .datos y deja j15 = tamaño y rd = 0. [definido en capítulo 04, §3.2](04-nucleo-abi-de-pedidos.md#32-primera-orden-construcción-de-la-sala-0)

**puente de idioma (r_bridge)** — Si la línea vino de un libro de otro idioma, se añade ' (en tu idioma: ...)' con una línea de un libro de su idioma. [definido en capítulo 09, §16.2](09-luma-conversacion-y-respuesta.md#162-puente-de-idioma-r_bridge)

**puerta** — Tipo de recurso que guarda un portero: 1 pantalla, 2 memoria, 3 archivos. [definido en capítulo 03, §1](03-nucleo-arranque-memoria-procesos.md#1-convenciones-y-términos)

**pulso** — Encuentro, en la misma clave, de dos llenados distintos. [definido en capítulo 06, §6.4](06-razar-lectura-y-organos.md#64-pulso-y-diferencia)

**punto fijo (del ensamblador)** — Condición que verifica armar.sh: el ensamblador armado desde la semilla, al armarse a sí mismo, da bytes idénticos y además iguales a la semilla. [definido en capítulo 02, §19.3](02-ensamblador-pdp-y-construccion.md#193-pasos)

## Q

**quietud (HW_QUIET)** — 67803 ms sin otra notificación para que un archivo del anfitrión madure y pase por las reglas a la lista de listos. [definido en capítulo 05, §10.7](05-nucleo-pantalla-teclado-vigia.md#107-quietud-reglas-y-lista-de-listos)

## R

**receta** — Secuencia de hasta 31 letras (1..15) que describe una forma u órgano. En memoria, byte 0 = longitud y luego las letras (32 bytes, 48 en zonas de candidatos); en texto, cada letra v es el carácter 48 + v y los lugares vacíos son '.'. [definido en capítulo 06, §11](06-razar-lectura-y-organos.md#11-recetas-y-formas)

**registro de evento** — Bloque de 32 bytes {kind, x, y, extra} que el pedido 41 escribe y que forma cada casilla del anillo de eventos. [definido en capítulo 05, §6.1](05-nucleo-pantalla-teclado-vigia.md#61-registro-de-evento-32-bytes)

**registro de firma** — Registro de 40 bytes {hija, índice en la cola, clase, firmante, estado} de un pedido importante que espera firma; su índice es el número que usan los pedidos 17 y 18. [definido en capítulo 03, §10.2](03-nucleo-arranque-memoria-procesos.md#102-registro-de-firma)

**registro del disco** — registro-disco-H, con el mismo formato que el libro del disco: un archivo del anfitrión que sólo crece al final, cuyas líneas casi siempre empiezan con dígito o con 'palabra:'; no se come. [definido en capítulo 08, §8.8.18](08-luma-cuerpo-procesos-y-casa.md#8818-registro-disco-16-hex)

**regla de cobertura** — Una palabra de él de 4+ bytes está cubierta si su clase aparece en la línea de algún ejemplo; las no cubiertas se buscan en los libros con CNB = 2. [definido en capítulo 09, §11.4](09-luma-conversacion-y-respuesta.md#114-regla-de-cobertura-de-una-costumbre-por-clase-del-hueco)

**regla de dos** — Un contexto crece y se usa sólo si lo dicen al menos 2 pares. Lo mismo vale para las formas (relación), los valores (confirmado) y las hipótesis (2 confirmaciones). [definido en capítulo 07, §2.7.3](07-razar-cardumen-canto-hilos.md#273-aprendizaje-contextos-con-la-regla-de-dos)

**regla de los lugares (r_describe)** — Enunciado 'X, w1, w2: l1, l2.' con hasta 4 palabras que comparten al menos 2 lugares de la palabra preguntada. [definido en capítulo 09, §12.4](09-luma-conversacion-y-respuesta.md#124-la-regla-de-los-lugares-r_describe)

**regla del hueco (ln_class)** — Dos palabras con la misma huella anterior y siguiente pasan a la misma clase. [definido en capítulo 09, §11.1](09-luma-conversacion-y-respuesta.md#111-preparación)

**rehacerse** — Pedido 36: la cabina deja preparado un programa nuevo y, si termina con código 0, renace con él y conserva su número, padre, porteros y firmas. [definido en capítulo 03, §9.8](03-nucleo-arranque-memoria-procesos.md#98-rehacerse-36)

**relación de relaciones / pegamento** — Clases de formas unidas con union-find. Es pegamento la relación que dice un mismo par en los dos sentidos; no se une. [definido en capítulo 07, §3.5](07-razar-cardumen-canto-hilos.md#35-relaciones-de-relaciones-hgt-hge-hag)

**relajación de saltos (ARM64)** — Cuando un CBZ, CBNZ, TBZ o TBNZ no alcanza su destino, la palabra se marca con la forma larga (prueba contraria más B) y se repite la traducción. [definido en capítulo 01, §12.4](01-idioma-janax.md#124-arreglos-de-saltos-y-relajación)

**reloj** — Instrucciones ejecutadas por todo el sistema (clock); la planificación no usa reloj de tiempo. [definido en capítulo 03, §1](03-nucleo-arranque-memoria-procesos.md#1-convenciones-y-términos)

**remero** — Hilo del anfitrión que ejecuta cabinas; puede ser de fila, especial (atiende a quien sostiene firmas) o de las dos clases. [definido en capítulo 03, §13.1](03-nucleo-arranque-memoria-procesos.md#131-hilos-y-clases-de-remero)

**renacer** — Nuevo nacimiento tras dormir: se recupera libre, se compara STAMP con el sello de construcción y r_un_libro rota el libro del estante. [definido en capítulo 08, §7.3](08-luma-cuerpo-procesos-y-casa.md#73-renacer)

**renglón** — Fin de línea (0Ah) o salto de página (0Ch). En la fila es el número 0, y dos seguidos cuentan como uno. [definido en capítulo 06, §1](06-razar-lectura-y-organos.md#1-definiciones-y-notación)

**renglón de prueba** — Uno de cada K renglones (K sale del archivo p; por omisión, 10), apartado del aprendizaje para golpear. [definido en capítulo 06, §5.6](06-razar-lectura-y-organos.md#56-renglones-de-prueba-y-examen)

**reservorio** — Elección ponderada: se acumula W += w_i y se queda con el candidato i si r_randmod(W) `<` w_i. [definido en capítulo 09, §1.4](09-luma-conversacion-y-respuesta.md#14-deseo-y-azar)

**respuesta (archivo)** — Bytes crudos de la respuesta única que la pensadora deja al contestar (el cuerpo lee hasta 1000). [definido en capítulo 08, §8.6.3](08-luma-cuerpo-procesos-y-casa.md#863-pregunta-respuesta-lista)

**respuesta única** — Concatenación de lo que ella dijo (quien = 1) desde que él habló; es lo que se escribe en respuesta. [definido en capítulo 09, §19.7](09-luma-conversacion-y-respuesta.md#197-respuesta-única-y-flujo)

**retrato de órganos** — Instrumento externo en Python que lee formas y engranajes de una casa y escribe un informe Markdown. [definido en capítulo 10, §10.14](10-luma-pantalla-lluvia-y-organos-vivos.md#1014-retrato-de-órganos-retrato_organospy)

## S

**sabido** — Archivo con una línea por forma unida a otra (claves hex16 y vía). Vale en cualquier libro; se aplica, se duerme o despierta según el libro nuevo. [definido en capítulo 07, §3.11](07-razar-cardumen-canto-hilos.md#311-sabido)

**sala** — Región de memoria de datos de una cabina, direccionada por su número (bits 32-63 de la dirección Janax); la sala 0 es la primera. [definido en capítulo 03, §6.1](03-nucleo-arranque-memoria-procesos.md#61-dirección-janax)

**sala de candidatos (CNR)** — 13 ranuras de 1024 bytes: la 0 guarda D_OUT al entrar y las 1..12 cada respuesta de un paso del camino. [definido en capítulo 09, §2.5](09-luma-conversacion-y-respuesta.md#25-la-sala-de-candidatos-cnr-13--1024-bytes)

**sala de ejemplos (EXR)** — Siete ranuras de 1024 bytes para ejemplos u oraciones, más el estado de ortografía, el área de lugares `PL_*` y la tabla de pares de letras. [definido en capítulo 09, §2.3](09-luma-conversacion-y-respuesta.md#23-la-sala-de-ejemplos-exr)

**sala de gustos ([D_GBLK])** — Sala con el peso del libro en lectura, la tabla de gustos, el marco, la imaginación, las firmas y los caminos. [definido en capítulo 09, §2.2](09-luma-conversacion-y-respuesta.md#22-la-sala-de-gustos-d_gblk)

**sala de la palabra (DLR)** — Sala de 32768 bytes con el estado del diálogo: entrada, salida, palabras dichas, contadores, hilo, tema. [definido en capítulo 09, §2.1](09-luma-conversacion-y-respuesta.md#21-la-sala-de-la-palabra-dlr-32768-bytes)

**sala del canto (LNR)** — Sala de 0xC000 bytes de r_canto: fichas, palabras con clase, letras por clase, líneas, texto de salida y ventana de la charla. [definido en capítulo 09, §2.4](09-luma-conversacion-y-respuesta.md#24-la-sala-del-canto-lnr-0xc000-bytes)

**sello de construcción** — SHA-256 de los generadores y de los archivos READER (CRLF→LF): primeros 8 bytes en little-endian, desplazados 2 bits a la derecha y con el bit 0 en 1. Si difiere del guardado (STAMP), NEWST = 1. [definido en capítulo 08, §2.3](08-luma-cuerpo-procesos-y-casa.md#23-entradas-leídas-al-generar)

**semilla (de PDP)** — so/pdp/semilla/: ensamblador.bin, ensamblador.datos y planificador.bin ya armados, con los que arranca la cadena. armar.sh exige que coincidan con lo que se arma desde la fuente. [definido en capítulo 02, §2](02-ensamblador-pdp-y-construccion.md#2-componentes)

**semilla (modo del canto)** — Modo de memoria_pares que toma como semilla de cada pregunta la oración de su respuesta que más palabras de contenido comparte, y elige la oración que mejor se canta. [definido en capítulo 07, §2.9](07-razar-cardumen-canto-hilos.md#29-la-semilla-con-semilla)

**señal de dormir** — Archivo casa\646f726d6972 (etiqueta("dormir")) que escriben fr_sleep o fr_nomem; el lanzador lo vigila con FindFirstChangeNotificationW, sin temporizador. [definido en capítulo 11, §11.3.5](11-instalador-lanzador-y-publicacion.md#1135-vigilancia-de-la-señal-de-dormir)

**servicio** — Instrucciones ejecutadas por una cabina desde que nació (P_SERVED). [definido en capítulo 03, §11](03-nucleo-arranque-memoria-procesos.md#11-presupuesto-y-servicio)

**silueta** — Llenado mayoritario de un pedido, calculado con la mayoría de Boyer-Moore. La firmeza decide cuánto suma el peso cuando coincide. [definido en capítulo 06, §6.3](06-razar-lectura-y-organos.md#63-silueta-mayoría-de-boyer-moore)

**símbolos del canto (silencio, turno, fin, lugar)** — Alfabeto de un byte: piezas 0..BASE−1, silencio BASE, turno BASE+1, fin BASE+2 y lugar BASE+3+k (la palabra a k palabras del final de la pregunta). [definido en capítulo 07, §2.7.1](07-razar-cardumen-canto-hilos.md#271-símbolos-canciones)

**sombra** — Estado de una cabina terminada que todavía tiene descendientes vivos: decide las firmas de su línea con sus propios porteros. [definido en capítulo 03, §10.5](03-nucleo-arranque-memoria-procesos.md#105-sombra)

**su_ventana** — Rutina que enumera las ventanas de nivel superior y devuelve la primera visible del proceso del núcleo lanzado, sin mirar su clase. [definido en capítulo 11, §11.3.4](11-instalador-lanzador-y-publicacion.md#1134-ventana-del-proceso-su_ventana)

**suspensión y reejecución** — Si un pedido del toque debe esperar (firma, pedido 29 o pedido 41), no se atiende ninguno: el pc vuelve a la jsys y, cuando P_WAITING llega a 0, el toque se repite desde cero. [definido en capítulo 04, §3.4](04-nucleo-abi-de-pedidos.md#34-suspensión-y-reejecución)

## T

**tabla de probados** — Tabla FNV-1a de 2^21 ranuras con las recetas ya juzgadas. A la mitad de llena se detiene la exploración. [definido en capítulo 10, §10.8.6](10-luma-pantalla-lluvia-y-organos-vivos.md#1086-tabla-de-probados)

**tabla G** — Asignación de cada variable global a una dirección de 8 bytes en la sala 0, desde GV = 200h; 171 nombres que deben quedar por debajo de FORMS = 800h. [definido en capítulo 08, §2.5](08-luma-cuerpo-procesos-y-casa.md#25-la-tabla-general-g-y-sus-límites)

**tablero** — Carpeta JANAX_TABLERO compartida por varios Janax del mismo anfitrión; allí van las etiquetas que empiezan con tablero/. [definido en capítulo 04, §10.1](04-nucleo-abi-de-pedidos.md#101-carpetas)

**tanda** — Modo de hilos que, en vez del while, convierte formas en canciones de notas de tres piezas para el cubo. [definido en capítulo 07, §3.18](07-razar-cardumen-canto-hilos.md#318-la-tanda)

**tejido (wy_choose)** — Composición de la salida saltando entre candidatos por palabras compartidas, partiendo del candidato de mayor consenso. [definido en capítulo 09, §14](09-luma-conversacion-y-respuesta.md#14-armonía-entre-candidatos-wy_choose)

**tema e improvisación** — Libro y posición abiertos (IM_K, IM_P) desde los que r_dlg_impro dice el párrafo siguiente. [definido en capítulo 09, §15.4](09-luma-conversacion-y-respuesta.md#154-tema-e-improvisación-pasos-2-y-3)

**testigo** — Línea por cada par que sostuvo una unión. '-' marca un testigo de lo pendiente, cuyo par fue de otro libro. [definido en capítulo 07, §3.13](07-razar-cardumen-canto-hilos.md#313-testigos)

**texto anidado** — Texto que el ensamblador inserta en la lectura: archivo incluido, cuerpo repetido, macro expandida o copias de times. Vive en la zona 440000h-640000h y admite hasta 32 niveles. [definido en capítulo 02, §12.1](02-ensamblador-pdp-y-construccion.md#121-mecanismo-común)

**timbre al padre** — Saludo (clase 28) que una cabina le da a su padre al terminar o al pedirle firma; lo despierta si espera un saludo o un evento. [definido en capítulo 03, §9.9](03-nucleo-arranque-memoria-procesos.md#99-timbre-al-padre)

**toque** — Una ejecución de jsys que llega a la ventanilla con una cola; todos sus pedidos se atienden en el mismo toque o el toque entero se suspende. [definido en capítulo 04, §1](04-nucleo-abi-de-pedidos.md#1-definiciones-y-notación)

**trato-<libro> (archivo)** — Archivo por interlocutor: `trato-` más la etiqueta del libro cuya firma tiene quien habla (hasta 118 bytes); la pensadora le anexa `vos: <pregunta>` y `luma: <respuesta>` en cada pregunta atendida. [definido en capítulo 08, §8.6.2](08-luma-cuerpo-procesos-y-casa.md#862-trato-libro)

**trato y techo** — Trato: permiso de una sala (0 sin acceso, 1 lectura, 3 lectura y escritura; 2 y los mayores que 3 se rechazan). Techo: el trato máximo que esa cabina puede darle a la sala (ROOM_CEIL). [definido en capítulo 04, §6.2](04-nucleo-abi-de-pedidos.md#62-trato-de-una-sala)

**turno (de una cabina)** — Instrucciones que ejecuta una cabina cada vez que un remero la toma (P_QUANTUM), calculado por cuanto: ceil(c·p/(1−p)). [definido en capítulo 03, §12.3](03-nucleo-arranque-memoria-procesos.md#123-turno-por-prioridad-cuanto)

**turno y rotación de libros** — Si existe turno, r_un_libro pasa todos los `libro*` a espera (prefijo e) y devuelve al estante el siguiente en orden de bytes. [definido en capítulo 08, §8.8.7](08-luma-cuerpo-procesos-y-casa.md#887-turno-y-rotación-de-libros)

## U

**última parte** — Por palabra, las instrucciones que faltan hasta un jhalt por camino recto; si cabe en tail_limit, extiende el turno para terminar sin ceder el remo. [definido en capítulo 03, §13.5](03-nucleo-arranque-memoria-procesos.md#135-corte-del-turno-y-última-parte)

**unidad** — Elemento de la fila de Razar: una palabra, una marca o un fin de renglón. [definido en capítulo 06, §1](06-razar-lectura-y-organos.md#1-definiciones-y-notación)

## V

**Venn** — Motor genérico de selección sobre dos conjuntos accesibles por adaptadores, guiado por una palabra Venn; hoy sólo lo usa la asociación del pedido 27. [definido en capítulo 05, §11.1](05-nucleo-pantalla-teclado-vigia.md#111-definición)

**ventana (de Razar)** — Cuatro unidades consecutivas w0..w3 de la fila. Sobre ella se cuelgan los moldes de los pisos 2 y 3 y se lee el órgano. [definido en capítulo 06, §6.1](06-razar-lectura-y-organos.md#61-pisos-y-moldes)

**ventana del logotipo** — Ventana STATIC de 720×720 px, con capas y color clave CLAVE (magenta), que muestra luma-logo.bmp durante al menos VER = 2000 ms en el primer nacimiento. [definido en capítulo 11, §11.4.1](11-instalador-lanzador-y-publicacion.md#1141-ventana-del-logotipo)

**ventanilla** — Rutina del núcleo que atiende jsys: copia la cola a un libro privado, marca, suspende si hace falta, asigna pantallas, sirve y devuelve. [definido en capítulo 04, §5](04-nucleo-abi-de-pedidos.md#5-procesamiento-de-un-toque)

**vigía** — La parte del centinela que observa las carpetas del anfitrión nombradas en JANAX_VIGIA (so/vigia.inc); entrega rutas, no contenido. [definido en capítulo 05, §10](05-nucleo-pantalla-teclado-vigia.md#10-vigía-y-centinela)

**vista** — Proyección de una caja en el espacio de direcciones del núcleo, propia de cada cabina que la tiene. [definido en capítulo 03, §6.2](03-nucleo-arranque-memoria-procesos.md#62-caja-vista-cajón-y-cartel)

**vista de música** — Con Tab se reemplazan las filas 0–199 por el rollo de 25 piezas de MU_STEPS pasos, que suenan como notas MIDI (pedido 44). [definido en capítulo 10, §10.7](10-luma-pantalla-lluvia-y-organos-vivos.md#107-vista-de-música-tab)

**voluntad** — Programa madre que lanza un cubo como hijo y le habla por palabras (pedidos 30/31/29): le canta, adivina y lo hace aprender. [definido en capítulo 07, §5.1](07-razar-cardumen-canto-hilos.md#51-protocolo-común-madrehijo)

## W

**WFT (palabras contadas)** — Tabla de ranuras de 64 bytes por huella con L (líneas que la tienen) y S (líneas cuya siguiente la conservó). [definido en capítulo 09, §2.6](09-luma-conversacion-y-respuesta.md#26-tabla-de-palabras-contadas-wft)

**while de hipótesis** — Bucle de hilos (groups, agree, pinject, props, derive, merge) que se repite mientras haya uniones, deducciones o refutaciones nuevas. [definido en capítulo 07, §3.8](07-razar-cardumen-canto-hilos.md#38-el-while)

**while rotado (jwhile, jwhilez, jwcheck, jwend)** — Única construcción de bucle: jjmp a CHECK, el cuerpo, el código de condición y un salto condicional de vuelta; la condición se evalúa antes de la primera vuelta. [definido en capítulo 01, §6.1](01-idioma-janax.md#61-el-while-jwhile-jwhilez-jwcheck-jwend)
