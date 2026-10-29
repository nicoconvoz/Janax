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

Salida: `modo: simbiosis`, `costo de cambio: <c> instrucciones (medido|fijado)` y una línea por proceso
cuando termina:

```
P<n> codigo=<código> j0=<16 hex> t=<instrucciones ejecutadas por todo el sistema hasta ese momento>
```

Códigos de proceso: los del intérprete (0, 1, 2, 5, 6, 7, 8). El núcleo sale con 0, 3 (no pudo leer un
programa) o 4 (sin programas).

## Cómo se prueba

```bash
bash so/pruebas/correr.sh
```

31/31. Porteros por etiqueta: prefijo `🦎` permite guardar `🦎 notas.txt`; prefijo `a` lo niega; listar con
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
terminan los cortos en t=6 y t=9 y el largo en t=3010, exactamente lo que da la regla calculada a mano); un
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

## Pendiente

- Los procesos corren en el intérprete: llevarlos al traductor nativo.
- Ventanilla: medir cuánto ahorra el lote con programas reales.
- Archivos: tablas de normalización propias para el modo cero; nombres legibles desde Windows si el
  Capitán lo quiere.
- `jsys` existe solo dentro de Janax OS: el intérprete y los traductores del escalón 0 lo toman como opcode
  desconocido.
- Porteros: que dar un permiso importante pida la firma de más de un portero, como las órdenes firmadas
  de Wenas (falta decidir quién firma).
- La campana (0..1) y la cubierta.
- Modo cero.
