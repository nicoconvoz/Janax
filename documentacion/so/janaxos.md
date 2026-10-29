# Janax OS — lo construido

**Estado al 2026-10-28: escalón S1, modo simbiosis sobre Windows x86-64.** Código en `so/janaxos.asm`
(FASM). Las ideas y su porqué están en `ideas.md`.

## Qué hace

```bash
so/build/janaxos.exe programa1.bin programa2.bin ...
```

1. **Arranque que reconoce el modo.** Windows arranca todo programa con `rcx` = su bloque de proceso (PEB),
   el mismo puntero que guarda en `gs:[60h]`; UEFI arranca una imagen con `rcx` = su handle y `rdx` = su
   tabla de sistema. Si coinciden, es **simbiosis**. El modo cero todavía no está construido (se detiene).
2. **Un camarote por programa**: registros propios, 1 MiB de memoria de datos propia y pila de retorno
   propia. Un proceso que falla termina solo él, con su código; los demás siguen.
3. **Planificador del Capitán ("nada de lo corto pendiente, poco de lo largo")**: **menor servicio
   recibido** (LAS). Corre el proceso que menos tiempo recibió hasta ahora, así lo corto termina primero
   sin saber de antemano cuánto dura cada uno. **No hay turno fijo**: el que corre sigue hasta pasar al
   siguiente menos atendido, o hasta el final si está solo. El tiempo se cuenta en instrucciones.

4. **El turno lo da la prioridad real (Capitán: "que la prioridad le dé el % real", nada fijo).** Cambiar
   de proceso cuesta `c` instrucciones. El que corre (servicio `s`) sigue mientras la ventaja del que
   espera (`D` de servicio menos) no pague el cambio: `(t − D)·t ≥ c·(s + t)`, o sea
   **t = ((D + c) + √((D + c)² + 4·c·s)) / 2**, nunca menos que `D + 1`. Un recién llegado con poco
   servicio entra casi enseguida; dos iguales reciben turnos que crecen como `√(c·s)` y el desperdicio cae
   solo. Con `c = 0` es el LAS puro.
5. **El núcleo mide `c` en la máquina donde le toca vivir y lo recuerda** (idea 2: aprender del entorno).
   - Medición **A-B-A**: el bucle de calibración solo, de a dos con `c = 0`, y solo otra vez; la base es el
     promedio de las dos corridas "solo", que encierran a la del medio y cancelan la deriva de frecuencia
     del procesador. Nueve pares (criterio: impar, para la mediana), cada uno con su `c`, y se queda la
     **mediana**. Durante la medición el hilo queda fijo en un núcleo y con prioridad máxima, tras una
     corrida de calentamiento.
   - Tarda ~1,3 s, así que se **recuerda**: el archivo `calibracion` de la carpeta del sistema guarda `c` con
     la **huella del código del núcleo** y el **nombre del procesador**; mientras coincidan, el arranque lo
     reusa y dice `(recordado)` (~150 ms). `JANAX_CAMBIO` lo fija (pruebas); `JANAX_CALIBRACION=ver` muestra
     los nueve pares.

6. **La ventanilla (Capitán: "mínimas pantallas posibles, cada una cambia de sintonía; los pedidos se
   sintonizan en una pantalla y con el tiempo pueden cambiar de pantalla y de sintonía").**
   - El programa deja su **cola de pedidos** en su camarote y toca la ventanilla **una sola vez** con la
     instrucción nueva `jsys rd, ra` (op `16h`): `ra` = dirección de la cola, `rd` = pedidos atendidos.
     Cola: cantidad (8 bytes) y una entrada de 32 bytes por pedido: tipo, `a`, `b`, respuesta. Al volver,
     cada entrada tiene su respuesta y la cantidad queda en 0.
   - Tipos: **1 escribir** (`a` = dirección, `b` = bytes; responde `b`), **2 crecer** el camarote (`a` =
     bytes; responde el tamaño nuevo), **3 achicarlo** (`a` = bytes; responde el tamaño nuevo, nunca por
     debajo del fin de la cola, para que las respuestas tengan dónde ir). Otro tipo: responde −1.
   - Una **pantalla** atiende una sola sintonía y la atiende **en lote**: todas las escrituras de la ronda
     salen en **una sola llamada** al anfitrión.
   - **Mínimas pantallas**: un tipo que ya tiene su pantalla la conserva; uno que no tiene toma una
     pantalla que no recibió nada en esta ronda (la **resintoniza**), y solo si no hay ninguna se abre otra.
     Nunca hay más pantallas que tipos distintos al mismo tiempo. Cada ronda es un toque de la ventanilla:
     ningún reloj.
   - Dentro de un tipo se respeta el orden de la cola.
   - Al terminar, si hubo pedidos: `ventanilla: pantallas=N resintonias=R llamadas al anfitrion=L pedidos=P`.

7. **Archivos con etiquetas de cualquier carácter (idea 6).**
   - Pedidos nuevos en la ventanilla: **4 abrir** (`a` = etiqueta, `b` = bytes; responde la manija),
     **5 leer** y **6 escribir en el archivo** (`a` = dirección, `b` = bytes; responde los bytes movidos),
     **7 cerrar**. La **manija viaja en la mitad alta del tipo** (`tipo = clase | manija << 32`), así la
     entrada de la cola sigue midiendo 32 bytes. Cada archivo lleva su propia posición.
   - **Etiqueta = cualquier UTF-8 válido**, emojis incluidos, verificado con la regla del estándar (sin
     formas largas de más, sin sustitutos, nada por encima de U+10FFFF). Si no es UTF-8: −1.
   - **En el anfitrión**: todo vive en una carpeta propia (`janax_archivos`, o la que diga
     `JANAX_ARCHIVOS`), y cada etiqueta se guarda con **sus bytes en hexadecimal**: `🦎 notas.txt` →
     `f09fa68e206e6f7461732e747874`. Es la regla que nunca falla: Windows prohíbe caracteres y no distingue
     mayúsculas, así que "Hola" y "hola" chocarían con el nombre tal cual. La contra: desde Windows no se
     lee. Largo máximo: la ruta entera tiene que entrar en los 260 caracteres de Windows.
   - **Manijas por proceso**: cada proceso tiene su propia tabla, que se duplica cuando se llena. Una manija
     de otro proceso o no abierta responde −1. Lo que un proceso deja abierto se cierra cuando termina.
   - **12 borrar** (`a` = etiqueta, `b` = bytes), **13 renombrar** (`a`/`b` = etiqueta vieja; la nueva va
     pegada detrás y su largo viaja en la mitad alta del tipo; falla si la nueva ya existe), **14 listar**
     (`a` = destino, `b` = espacio: cada etiqueta como un qword con su largo y sus bytes rellenados a 8,
     mientras entren; responde cuántas). Los nombres de la carpeta que no son el hexadecimal de un UTF-8
     válido no son del sistema y no se listan.
   - **Normalización (forma C de Unicode)**: dos etiquetas que se ven iguales (`é` en una pieza y `e` +
     acento) son **el mismo archivo**. En simbiosis la normalización la hace el anfitrión (`NormalizeString`
     de Windows); en modo cero harán falta las tablas de Unicode propias.

8. **Porteros en árbol de ramas anchas (ideas 9 y su jerarquía).**
   - **Árbol**: raíz → un portero por puerta (1 pantalla, 2 memoria, 3 archivos) → microporteros, con
     **cualquier cantidad de hijos por rama** (Capitán: "para que bajar no sea tan costoso"). Cada proceso
     cuelga un microportero de cada puerta: los porteros de puerta tienen tantos hijos como procesos.
   - **Atenuación**: un hijo nunca tiene más permisos que su padre (se recortan al crearlo).
   - **Verificar = subir del microportero a la raíz**: si en el camino hay un portero revocado o sin el
     permiso, se niega. **Revocar = una marca**, y toda la rama de abajo queda sin efecto sola. El costo
     de verificar es la altura del árbol, que las ramas anchas mantienen chica.
   - **Permisos al lanzar**: `programa.bin@pmlg` (p pantalla, m memoria, l leer archivos, g grabar
     archivos). Sin `@`, todos.
   - **Pedidos de porteros** (sin llamadas al anfitrión): **8 ceder** (`a` = padre propio, `b` = permisos →
     un hijo nuevo), **9 usar** (`a` = un portero propio → el proceso pasa a trabajar con él: así baja sus
     propios privilegios), **10 revocar** (`a` = un portero que cuelga del propio, nunca el propio),
     **11 consultar** (`a` = puerta → mi portero). Un portero es "propio" si subiendo desde él se llega,
     sin nada revocado en el camino, al portero del proceso para esa puerta.
   - **Permisos por etiqueta**: un portero puede llevar un **prefijo de etiqueta** (normalizado). Un pedido
     de archivos (abrir, borrar, renombrar las dos etiquetas, listar) solo pasa si la etiqueta empieza con
     el prefijo de **cada** portero en la subida; listar oculta lo que no se puede ver. Al lanzar:
     `programa.bin@lg:f09fa68e` (prefijo en hexadecimal: la línea de comandos de Windows no lleva emojis).
     Pedido **15 ceder con etiqueta** (`a` = padre propio, `b` = bloque {permisos, largo, bytes}). Un hijo
     nunca sale del prefijo de su padre: su prefijo tiene que ser una etiqueta que el padre permita, y eso
     se verifica con la misma rutina.
   - Un pedido negado responde −1. Si hubo negados: `porteros: nodos=N negados=M`.

9. **La familia de procesos y la multifirma (Capitán: "kernel madre, padre, hijos hermanos, nieto,
   bisnieto"; "la jerarquía manda: el micro le pide al macro"; firma solo el padre).**
   - **16 lanzar**: `a`/`b` = etiqueta del archivo con el programa; los permisos del hijo viajan en la
     mitad alta del tipo y se recortan a los del padre. Responde el número del hijo. Los programas son
     archivos del sistema; lanzar necesita permiso de leer archivos y que la etiqueta pase los prefijos.
   - **El árbol de porteros copia a la familia**: los microporteros del hijo cuelgan de los del padre (los
     de los hijos del kernel, de los porteros de puerta). Nadie tiene más que quien lo lanzó.
   - **Importante = todo lo que altera un proceso, un archivo o el sistema**: escribir en pantalla, crecer,
     achicar, abrir, grabar, borrar, renombrar, ceder, usar, revocar, ceder con etiqueta y lanzar. Un
     pedido importante de un hijo de un proceso **espera la firma de su padre**: el toque entero de la
     ventanilla queda en espera, el hijo duerme y su `jsys` se repite cuando todo está firmado o
     rechazado. Lo rechazado responde −1 y cuenta como negado. Los hijos del kernel no esperan: el kernel
     firma a través de los porteros.
   - **17 firmar** (`a` = número del pedido, `b` = 1 firma / 0 rechaza), **18 pendientes** (lo que espera
     mi firma, como {número, hijo, tipo}), **19 estado** (`a` = un hijo mío → su código, −1 mientras corre,
     −2 si no es mío).
   - **La sombra del padre (Capitán)**: cuando un proceso termina con descendientes vivos queda su
     **sombra**, que decide por esa línea **con los permisos del padre**: firma lo que sus porteros
     permiten y rechaza el resto, en el acto. Nadie más decide por esa línea (ni el abuelo ni el kernel) y
     nadie es adoptado. La sombra se disuelve, y sus porteros con ella, cuando no queda ningún proceso
     debajo. Así la ausencia del padre nunca le pasa la decisión a alguien con otro criterio.
   - Además (verificado en el código): los porteros se revisan **antes** de pedir una firma y **otra vez**
     cuando el pedido se ejecuta, así que ninguna firma, ni del padre ni de su sombra, da permisos.
   - Si todos los que quedan esperan una firma que nadie puede dar, se rechaza: nadie espera para siempre.
   - **El planificador decide de nuevo por evento**: cuando nace o despierta un proceso, el turno actual se
     corta ahí (contando solo lo que de verdad corrió).

Salida: `modo: simbiosis`, `costo de cambio: <c> instrucciones (medido|fijado)` y una línea por proceso
cuando termina:

```
P<n> codigo=<código> j0=<16 hex> t=<instrucciones ejecutadas por todo el sistema hasta ese momento>
```

Códigos de proceso: los del intérprete (0, 1, 2, 5, 6, 7, 8). El núcleo sale con 0, 3 (no pudo leer un
programa) o 4 (sin programas).

## Motor de rutinas (Capitán: "pasa el original a nativo sin compilar")

Código en `so/rutinas.inc`. La primera vez que un proceso corre, su programa se decodifica a una tabla
de registros de 16 bytes, uno por palabra más uno final:

| Bytes | Contenido |
|---|---|
| 0–7 | dirección de la rutina nativa de esa instrucción (compilada dentro del núcleo) |
| 8, 9, 10 | rd·8, ra·8, rb·8 (desplazamientos listos dentro de los registros del proceso) |
| 12–15 | inmediato ya extendido (sin signo para `jshi`), o destino de salto/`jcall` como desplazamiento en la tabla |

- Correr = cada rutina termina descontando una instrucción del turno y saltando a la rutina del registro
  siguiente. Nada se decodifica de nuevo; no se genera código de máquina.
- Un destino fuera del programa apunta al registro final, que termina con código 2 igual que el chequeo
  del intérprete (y devuelve esa instrucción, porque el intérprete falla antes de contarla). Un opcode
  desconocido tiene la rutina que termina con código 1.
- El tiempo se sigue contando en instrucciones Janax, así que el planificador ve exactamente lo mismo.
- **Un salto que cae sobre un salto condicional se resuelve en el lugar**: al decodificar, un `jjmp` cuyo
  destino es un `jjz`/`jjnz` recibe una rutina que hace las dos cosas (y cuenta las dos instrucciones;
  si el turno se termina entre ellas, el proceso queda parado en la condición, como en el intérprete). El
  salto de entrada de cada while cae sobre su condición, así que entrar a un bucle cuesta una rutina menos.
- `JANAX_MOTOR=interprete` corre el intérprete de siempre. El costo de cambio `c` está en instrucciones
  y cada motor las corre a su ritmo, por eso el motor entra en la huella de la calibración.

## Todo bucle del núcleo es un while rotado (Capitán: "todo en while")

Los bucles del núcleo x86 tienen la misma forma única que los de Janax:

```
        jmp     .pregunta
.pregunta_lap:
        ...cuerpo...
.pregunta:                    ; while <condición>
        cmp/test ...
        jcc     .pregunta_lap
```

- La pregunta conserva el nombre de la etiqueta vieja, así que todo "seguí con la próxima vuelta" de
  adentro del cuerpo es ahora un salto hacia adelante a la pregunta.
- Un bucle de "hacé y después preguntá" es un while cuya pregunta incluye el trabajo (como
  `while (*d++ = *s++);` en C): su cuerpo queda vacío y el salto de entrada cae en la instrucción
  siguiente. Cuesta un salto al entrar y nada por vuelta.
- El modo cero (sin construir) es un `while (true)`: su regreso es incondicional.
- **Se verifica, no se promete**: `so/herramientas/bucles.pl` lista cada bucle (un salto hacia atrás que
  se queda en su rutina; uno que va a otra rutina, como el regreso de una rutina del intérprete a su
  despachador, no es un bucle) y falla si alguno no tiene la forma. La suite lo corre sobre `janaxos.asm`
  y `rutinas.inc`: 61 + 2 bucles, todos while rotado.
- `so/herramientas/rotar.pl` es la regla mecánica que convirtió 28 de esos bucles (los que preguntaban
  arriba con una sola comparación); los otros 35 se reescribieron a mano.
- Verificado además: el núcleo da **exactamente la misma salida** que antes del cambio en seis
  escenarios de planificación; nombre del programa entre comillas (carpeta con un espacio); calibración
  visible con `JANAX_CALIBRACION`.
- Costo: ninguno medible. Bancos de la ventanilla, núcleo viejo contra nuevo: lote ~82 contra ~80 ms,
  uno por uno ~185 contra ~194 ms, dentro del ruido. ⚠️ Una primera medición daba el nuevo 15–40 ms
  más lento: corría siempre primero el viejo. Con el orden alternado, la diferencia desapareció.

## Cómo se prueba

```bash
bash so/pruebas/correr.sh
```

82/82 (80 casos + el chequeo de bucles de los dos archivos): **la suite entera corre dos veces, una con el motor de rutinas y otra con el intérprete**, cada una
con su carpeta limpia. Las salidas esperadas son exactas, así que pasar las dos es dar lo mismo,
instrucción por instrucción (cada corrida con su límite de tiempo: un cuelgue es un MAL, no un silencio). Familia: **el padre
lanza y espera** al hijo; **el hijo pide, el padre firma** (sale "hola"); **el padre rechaza** (no sale nada,
−1, un negado); **la sombra del padre firma por su línea** (el padre termina sin firmar y el "hola" sale
igual); **la sombra decide, no el abuelo** (tres generaciones: el abuelo firma solo 1 pedido, el suyo);
**el hijo no tiene más que su padre** (un padre sin memoria lanza un hijo pidiendo todo, y el hijo igual no
puede tocar memoria).

Porteros por etiqueta: prefijo `🦎` permite guardar `🦎 notas.txt`; prefijo `a` lo niega; listar con
prefijo `c` ve 1 y con `d` ve 0; un hijo con prefijo `x` no puede ceder uno con `y`, y desde `x` no se abre
`🦎 notas.txt`.

Archivos (2): **listar, borrar y renombrar** en una carpeta limpia (2 etiquetas, borrar "a", "b" →
"c", queda 1: "c"); **etiquetas que se ven iguales son el mismo archivo** (guardado por `é` de una pieza,
leído por `e` + acento, y en Windows hay un solo archivo: `c3a9`).

Porteros: **sin pantalla** (la escritura se niega y no sale nada); **sin archivos** (abrir y grabar
se niegan); **rama revocada y privilegios bajados** (revocar A deja inservible a su nieto B; el proceso se
baja a un portero sin permisos y su escritura se niega); **ramas anchas** (tres procesos cuelgan de los
mismos porteros de puerta: 13 nodos, no una cadena más larga). Verificado también al revés: con `@p` la
misma escritura sale.

Archivos: **guardar** `🦎 notas.txt`; el archivo está en el anfitrión con su nombre en hexadecimal y
el contenido justo; **otra corrida del sistema lo lee**; etiqueta que no es UTF-8 (−1, sin tocar el
anfitrión); manija nunca abierta (−1).

Ventanilla: escribir; **tres escrituras en una sola llamada**; **dos sintonías en la misma ronda →
dos pantallas** (y una escritura en el viejo tope prueba que el camarote creció); **la pantalla cambia de
sintonía** entre rondas (1 pantalla, 1 resintonización); tipo desconocido (−1, sin pantalla); cola fuera del
camarote (código 5); achicar no pasa el fin de la cola.

Planificador (con `c` fijado, salvo uno): un proceso; **lo corto primero** (un proceso largo puesto primero en la fila y dos cortos:
terminan los cortos en t=6 y t=9 y el largo en t=3012, exactamente lo que da la regla calculada a mano); un
proceso que rompe solo lo suyo; **camarotes separados** (dos procesos escriben la misma dirección mientras
se alternan y cada uno lee su propio valor); **la prioridad decide el turno** (con `c = 4` la fórmula da
turnos de 4 y 8, calculados a mano); **costo medido** (los resultados no cambian aunque `c` cambie de
máquina en máquina); **costo recordado** (el arranque siguiente no vuelve a medir); y sin programas.

⚠️ El corredor tenía un error: leía el código de salida de `tr` y no del núcleo, así que los códigos no se
verificaban. Lo destapó el caso "sin programas"; corregido.

## Mediciones

Programa `suma_100m` (300 millones de instrucciones), intérprete del escalón 0 como referencia:

| Caso | Tiempo |
|---|---|
| Intérprete, dos copias una detrás de la otra | ~2.290 ms |
| Janax OS, un proceso | ~1.430 ms (igual que el intérprete solo) |
| Janax OS, dos procesos iguales, LAS puro (cambio cada ~2 instrucciones) | ~4.570 ms |
| **Janax OS, dos procesos iguales, turno por prioridad real** | **~2.200–2.500 ms** |

Con el turno por prioridad, compartir el procesador cuesta lo mismo que correr uno detrás del otro, y
siguen siendo justos: los dos terminan separados por menos de 40.000 instrucciones sobre 600 millones.
**El instrumento de `c` mentía** y se arregló midiendo: con el mínimo de tres corridas de ~2 ms dio entre
**0,00 y 9,7** según el arranque, y dentro de un mismo arranque los pares iban de 0,05 a 6. Con A-B-A,
corridas 8 veces más largas, hilo fijo y mediana de nueve pares: mediana entre **1,17 y 1,64** en cinco
arranques seguidos. Entre arranques sigue variando un poco (una corrida dentro de la suite de pruebas dio
3,14): por eso se mide una vez y se recuerda.

### Motor de rutinas contra intérprete

Banco `so/bancos/calculo.jsm`: 67 millones de vueltas de 10 instrucciones (llamada, memoria, suma,
desplazamiento, xor, retorno, bucle) = 671.088.646 instrucciones sin tocar la ventanilla. `c` fijado en 0,
tres corridas cada uno, 2026-10-29.

| Motor | Arranque solo (`02_ldi`) | Banco | Banco − arranque | Instrucciones/s |
|---|---|---|---|---|
| Intérprete | ~92 ms | ~2.915–3.126 ms | ~2,85 s | ~235 M |
| **Rutinas** | ~76–126 ms | **~1.504–1.538 ms** | **~1,41 s** | **~475 M** |

**El doble de rápido**, con el mismo `j0` y el mismo `t`. ⚠️ Una primera medición con un banco 16 veces
más corto daba "1,6×": el arranque tapaba la diferencia. El banco largo es el que vale.

Más tarde el mismo día, con el banco escrito en while (mismas instrucciones por vuelta, 2 más en total) y
los dos motores **intercalados**: rutinas ~1,51–1,67 s, intérprete ~3,69–4,34 s (≈2,5×). ⚠️ Que el
intérprete haya pasado de ~2,9 s a ~4 s **no es el while**: el núcleo viejo con el banco viejo, medido
intercalado en ese momento, también daba ~3,8–4,2 s. La máquina estaba más lenta y el intérprete lo
sufre más que las rutinas. Por eso los motores se comparan siempre intercalados, en el mismo momento.

### Cuánto ahorra el lote de la ventanilla

Bancos `so/bancos/lote_10000.jsm` y `uno_por_uno_10000.jsm`: las mismas 10.000 líneas, salida a un archivo
(para medir el núcleo y no la consola), `c` fijado, tres corridas cada uno.

| Programa | Tiempo total | Llamadas al anfitrión |
|---|---|---|
| Piso: arrancar el núcleo con un programa de 1 instrucción | ~150–180 ms | — |
| **10.000 pedidos en un solo toque** (una pantalla en lote) | **~150–165 ms** | **1** |
| 10.000 toques de un pedido cada uno (como una llamada al sistema clásica) | ~280–310 ms | 10.000 |

En lote, escribir 10.000 líneas cuesta lo mismo que no escribir nada (queda dentro del ruido del
arranque). Uno por uno suma ~130 ms: ~13 µs por llamada al anfitrión.

## Pendiente

- Motor de rutinas: la tabla es por proceso; compartirla entre procesos del mismo programa (hoy cada
  lanzamiento lee el archivo de nuevo). Medir qué rutinas pesan más y fundir las parejas frecuentes
  (por ejemplo `jsub` + `jjnz`, el final de casi todo while) en una sola rutina.
- El escalón 0 todavía tiene 27 bucles fuera de la forma del while rotado (intérprete 4, traductor
  x86-64 15, traductor ARM64 8, contados con `bucles.pl`).
- Archivos: tablas de normalización propias para el modo cero; nombres legibles desde Windows si el
  Capitán lo quiere.
- `jsys` existe solo dentro de Janax OS: el intérprete y los traductores del escalón 0 lo toman como opcode
  desconocido.
- Familia: las firmas hoy son decisiones dentro del núcleo; firmarlas con claves (como las órdenes de
  Wenas) cuando los procesos puedan vivir en máquinas distintas.
- La campana (0..1) y la cubierta.
- Modo cero.
