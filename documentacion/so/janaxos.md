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
   - Tipos: **1 escribir** (`a` = dirección, `b` = bytes; responde `b`), **2 agrandar**: construye un ambiente de
     `a` bytes y responde su dirección; **3 destruir** el ambiente que empieza en `a` (responde 0, o −1 si ahí
     no empieza un ambiente o es el de la cola). Ver "Ambientes". Otro tipo: responde −1.
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
   - **33 terminar a un hijo** (`a` = un hijo mío): ver "El padre termina a un hijo colgado".
   - **34 presupuesto** (`a` = un hijo mío, `b` = instrucciones más que puede remar): ver "El presupuesto".
   - **20 bolita** (`a` = la bolita que quiere, en 65.536avos; 10000h = 1): la recorta a la que le dieron al
     lanzarlo (nadie se da más de lo que le dieron, igual que los permisos), recalcula su turno una vez y
     contesta la que quedó. Ver "La bolita de cada camarote".
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
- **Una instrucción seguida de una condición se funde con ella** (2026-10-29): al decodificar, toda
  instrucción que termina siguiendo de largo (`jldi`, la aritmética, los desplazamientos, `jshi`, la
  memoria) y tiene un `jjz`/`jjnz` justo después recibe una rutina que hace las dos cosas. La condición
  conserva su registro, así que los saltos que caen sobre ella la siguen encontrando. Se cuentan las dos
  instrucciones: si el turno se termina entre ellas, el proceso queda en la condición, y si la primera
  falla (memoria fuera de rango), la condición ni se cuenta. **La regla salió de contar**: un contador de
  parejas ejecutadas (scratchpad, `parejas.pl`) mostró que ninguna pareja concreta domina (en `calculo`,
  las diez parejas del bucle pesan 10 % cada una), pero toda vuelta de todo while termina en "algo →
  condición". Por eso no se funde `jsub`+`jjnz`: se funde cualquier instrucción con la condición que la
  sigue, y vale también para los `if`.
- **Cada programa ocupa lo que pesa** (2026-10-29): todo programa se lee primero en un único búfer de
  carga (`MAX_PROGRAM`, reservado una sola vez) y, si no es copia de otro, se guarda en un bloque de su
  tamaño exacto (Windows lo redondea a páginas de 4 KB). Antes cada lanzamiento reservaba 1 MiB fijo.
- **Copias del mismo programa comparten palabras y tabla** (2026-10-29): al nacer, cada proceso busca uno
  anterior con exactamente las mismas palabras (mismo largo y comparación palabra por palabra, nunca solo
  una huella). Si lo encuentra, libera su copia recién leída y usa el programa y la tabla de ese proceso.
  La tabla no cambia mientras se corre (el estado de cada proceso vive en su estructura), así que
  compartirla es seguro. Con el motor de rutinas la tabla se arma al nacer, no en el primer turno. Vale para
  los programas de la línea de comandos y para los que lanza un proceso. ⚠️ Hoy ningún programa ni tabla se
  libera cuando termina un proceso; si algún día se liberan, una tabla compartida va a necesitar contar
  cuántos la usan.
- `JANAX_MOTOR=interprete` corre el intérprete de siempre. El costo de cambio `c` está en instrucciones
  y cada motor las corre a su ritmo, por eso el motor entra en la huella de la calibración.

## Ambientes: el camarote crece y se achica sin mudarse (Capitán, 2026-10-29)

> *"Cada camarote tiene su ambiente; cuando se da la orden de agrandar se agrega un ambiente y se construye
> en el mismo camarote; cuando ya no queremos el ambiente se destruye solo el ambiente."* — *"Si quedan
> huecos entre un ambiente y otro por quitar el del medio, unir los extremos y liberar si queda libre
> página."* — *"Armá un paquete fijo para esa parte que traduzca el paquete entero."*

Código: `so/ambientes.inc`. Pruebas: `ambientes`, `ambiente_hueco`, `ambiente_hueco_ventanilla`,
`ambiente_reconstruir`, `ambientes_unir`.

- **El proceso nace sin memoria; su primera orden construye el ambiente 0** (Capitán: *"que sea la primer
  orden del proceso"*). Como todavía no hay dónde poner una cola, la primera orden es un `jsys` con el
  tamaño directo en el registro (macro `jfirst r, tamaño` en `escalon0/janax.inc`): `r` queda en 0 (la
  dirección del ambiente) y `j15` en su tope. Tocar memoria antes es código 5; pedir 0 bytes también.
  ⚠️ La primera orden no pasa por los porteros: es parte de nacer. Un proceso sin permiso de memoria
  igual tiene su ambiente 0, pero no puede agrandar (prueba "familia: el hijo no tiene más que su padre").
- **El casco se reserva una vez y nunca se muda** (`HULL_SIZE` = 4 GiB de direcciones, que no ocupan
  memoria). ⚠️ Ese número es criterio, no medición: es el techo de un camarote.
- **Una dirección Janax dice qué ambiente y dónde**: el número de ambiente en los 32 bits altos y la
  posición en los 32 bajos. El ambiente 0 empieza en la dirección 0, así que un programa que nunca
  agranda ve las mismas direcciones que antes.
- **Agrandar** construye un ambiente del tamaño pedido (redondeado a 8 bytes, el acceso más ancho de
  Janax, para que cada ambiente empiece alineado) al final del casco, sin copiar nada, y responde su
  dirección. Se le piden a Windows justo las páginas que hacen falta para que entren todos los ambientes:
  la página es ajustable, solo que se entrega de a partes fijas (el tamaño lo dice `GetSystemInfo`).
- **Destruir** recibe la dirección de un ambiente y destruye solo ese. **Los que vienen después se corren
  hacia atrás** sobre su lugar: el camarote nunca tiene huecos. Las páginas que sobran al final vuelven a
  Windows, y los bytes sobrantes de la última página se ponen en cero, así que un ambiente nuevo siempre
  arranca en ceros. Su número se reusa para el próximo ambiente (nunca el 0). El ambiente que tiene la
  cola que se está atendiendo no se puede destruir.
- **El núcleo traduce**, por eso mover ambientes es invisible: el acceso al ambiente 0 hace una
  comparación (el ambiente 0 siempre está al principio). Cualquier otro corre **un paquete fijo** de
  traducción, de una sola vez y sin llamadas, que sigue siendo esa misma instrucción Janax. Cada rutina de
  memoria tiene el suyo, pero FASM lo arma **al final del código** (`postpone`): la rutina conserva solo el
  salto hacia él y queda chica. Por eso la sección de código es la última del ejecutable y `code_end` (la
  huella del núcleo) va después de los paquetes. La
  ventanilla y los pedidos de archivos, listas y firmas traducen cada dirección con `cabin_at` en el
  momento de usarla.
- Tocar un ambiente destruido, o pasarse de su tamaño, es código 5, al byte, igual con cualquier tamaño de
  página.

- **La pila de retorno también pesa lo que ocupa**: se reserva para `RET_DEPTH` llamadas (el límite, igual
  que el intérprete: la llamada 4097 sigue siendo código 7) y se le dan páginas a medida que las llamadas
  la necesitan, duplicando desde una página. Al terminar cada turno se achica a la mitad mientras la
  profundidad use un cuarto o menos (la regla que mantiene constante el costo por llamada, sin ir y venir),
  nunca por debajo de una página; un proceso que terminó la devuelve entera. El camino que agranda está
  fuera de la rutina de llamada (`postpone`). Pruebas: `llamadas_hondas`, `llamadas_demasiadas`.

## La ventanita al anfitrión: vacía para los procesos (2026-10-29)

`jhost` (`so/anfitrion.inc`) es la ventanita de un programa a su anfitrión. Un proceso de Janax OS ya habla con
el sistema por la ventanilla, bajo sus porteros, así que el anfitrión no le ofrece nada: **su catálogo está
vacío** (la ventana más chica), el catálogo responde 0 y cualquier pedido responde −1. Los chequeos (bloque
adentro de un ambiente, alineado) son los de todos los puertos. Prueba: `ventanita_vacia`.

## Los remeros: camarotes en paralelo (Capitán, 2026-10-31)

> *"Fabricá el otro remo… que no se los tenga que decir sino que ellos se den cuenta, y el capitán piense en
> cosas más importantes."* — *"Vamos a paralelizar los camarotes, y ocupar la mínima porción de cada núcleo
> del procesador para ir más rápido."*

Código: `so/remos.inc`. **Un remero por núcleo** (`dwNumberOfProcessors`; `JANAX_REMOS` fija cuántos). Cada
remero toma el camarote menos servido que **nadie esté remando** (empates: el de número menor), le da su turno
(el planificador en Janax) y lo corre **solo, sin candado**. Solo lo compartido pasa por **el candado del
capitán**: elegir camarote y turno, la ventanilla (pantallas, archivos, ambientes, firmas) y lo que pasa
cuando un camarote termina. **Un remero sin trabajo duerme** (variable de condición) hasta que algo cambia: un
camarote vuelve, nace o se despierta. No gasta procesador, y su pila es chica (64 KB reservados).

- Lo que era global y se tocaba mientras corre un camarote pasó al camarote: el presupuesto del turno, el
  registro de respuesta de `jsys` y la pila guardada de la pila de retorno.
- **Cada camarote da el mismo resultado de siempre**: no comparten nada. Lo que depende del ritmo de los
  remeros es **el orden entre camarotes y el reloj**. Con un remero (`JANAX_REMOS=1`) todo pasa exactamente como
  antes: la suite corre así sus casos de orden exacto, y tiene casos propios en paralelo (8 camarotes con 2, 4
  y 8 remeros, y una familia que pide y firma con 4) que verifican el resultado de cada uno.
- **`D` nunca es menor que 0**: con remeros en paralelo, el que sigue en la fila puede estar siendo remado por
  otro y haber servido menos que el elegido. `D` daba negativo y el turno salía sin sentido (con un remero no
  pasaba nunca). Si el que sigue ya está atrás, no hay que adelantarle nada: `D = 0`.
- **La hoja de turnos, medida y guardada aparte** (rama `hoja-de-turnos`): el planificador escribía 16 turnos
  de una vez (quién rema y cuánto) y el núcleo los seguía mientras el mundo fuera el imaginado. Las decisiones
  dieron **idénticas** (los relojes coinciden al dígito), pero el costo empeoró: ~3 % mejor con procesos largos
  y `c = 8`, **~25 % peor** con cambios seguidos (`c = 1`) y **2,7 veces peor** con `c = 0`. La causa: elegir quién
  rema pasaba del recorrido nativo del núcleo a Janax, una vez por renglón (escribir una hoja de 16 turnos
  cuesta ~3.600 instrucciones). No entró en `master`.
- **Estrés**: 300 corridas con 8 remeros (los dos motores, camarotes mezclados y la familia): 0 fallas.
- **Medido** (4 copias de `calculo`, Pentium Gold G5420: 2 núcleos con 2 hilos cada uno): 1 remero ~6,7 s;
  **2 remeros ~3,6 s (1,85×)**; 4 remeros ~2,7–3,0 s (~2,3×: los hilos gemelos de un mismo núcleo agregan ~25 %).

## La fila por orden de llegada y la bolita (Capitán, 2026-10-31)

> *"El remo disponible es el que se usa, y queda en una pila de usos o de libres: los libres se usan, los que se
> usan se liberan, y así por orden de llegada sin consumos extras."* — *"El largo del turno se da por
> prioridad: si es algo importante, entre el 0 y el 1; si tiende a 1 se trabaja más, si tiende a 0 se trabaja
> menos."*

Reemplaza a la regla anterior (el menos servido primero, con el turno calculado en cada cambio).

- **La fila** (`so/remos.inc`): los camarotes esperan en una sola fila por orden de llegada. Un remo libre toma
  el primero, rema su turno y lo pone al final; un camarote que nace o se despierta también entra al final.
  **Cada cambio es sacar uno de adelante y poner uno atrás**: no se mira a nadie ni se calcula nada.
- **El turno sale de la bolita** `p` (de 0 a 1, en 65.536avos): la fracción del tiempo que el camarote trabaja
  de verdad es `t / (t + c)`, y haciéndola igual a `p` sale `t = c·p / (1 − p)`, redondeado hacia arriba,
  mínimo 1; con `p = 1` rema hasta terminar. Lo calcula **el planificador en Janax** (rutina `cuanto`, desde
  PDP o el de fábrica) **una sola vez**, cuando nace el camarote. Probado contra la matemática exacta:
  `so/herramientas/cuantos.pl` → `escalon0/pruebas/43_cuantos.jsm` (75 casos, en los tres motores).
- **Bolita de un camarote que no dice nada: 0,99** (64.881). Es criterio, no medición: pierde el 1 % de su
  tiempo en cambiar. Cada camarote puede elegir la suya: ver más abajo.
- **El costo de un cambio bajó a ~24 instrucciones** (rutinas; ~8–11 con el intérprete): antes, con el
  planificador decidiendo en cada cambio, eran ~190–300. ⚠️ La primera medición dio 0: con `c = 0` el turno es de
  1 instrucción y la corrida de un proceso **solo** también cambiaba en cada instrucción (se pasaba el remo a sí
  mismo), así que la resta de la calibración no medía nada. Ahora la corrida sola rema sin cortes.
- **Medido**: dos `calculo` tardan lo mismo que antes (~2,7–3,2 s) y terminan separados por **482 instrucciones**
  sobre 1.342 millones (antes ~313.000): turnos cortos y parejos. Estrés en paralelo: 300 corridas, 0 fallas.
- Las pruebas cuyo orden cambió se verificaron con un script: cada camarote da su mismo código y su mismo `j0`,
  las demás líneas son idénticas, y los dos motores coinciden; solo se mueven el orden y el reloj.

## El motor traducido: el SO corre código nativo (2026-10-31)

El Capitán preguntó si Janax gana en un programa largo contra el nativo; medido, el SO con rutinas iba ~10 veces el
nativo, y el traductor del escalón 0 (que el SO no usaba) ~2 veces. Respuesta: *"Sí, conectalo"*.

- **Tercer motor, el de fábrica** (`so/nativo.inc`, `JANAX_MOTOR=traductor`; `rutinas` e `interprete` siguen). Un
  `JANAX_MOTOR` desconocido ya no cae callado en las rutinas: no arranca (código 4).
- **Cómo**: la tabla de rutinas de cada programa, con código nativo escrito para cada instrucción; el renglón apunta a
  ese código en vez de a la rutina. Lo simple va en nativo con los registros y operandos adentro (`jldi`, la
  aritmética menos `jdiv`, los desplazamientos, `jshi`, los saltos, y la memoria del ambiente 0); lo demás (`jhalt`,
  `jdiv`, `jcall`, `jret`, las ventanas, un acceso que necesita el paquete de ambientes o está desalineado) salta a
  su rutina de siempre, que sigue por la tabla y vuelve al nativo. Como comparten exactamente los mismos registros,
  el motor corre dentro de `run_routines` sin tocarlo.
- **Cada instrucción cobra su turno** antes de correr, como las rutinas: los cortes caen en la misma instrucción,
  bit por bit. Se traduce una vez por programa, al nacer, y las copias comparten el código (como la tabla).
- **Memoria ejecutable**: se escribe con permiso de escritura y después se cierra a **solo ejecutar**
  (`VirtualProtect`): nunca hay memoria que se pueda escribir y ejecutar a la vez.
- **Instrumento**: `nativo: N de M instrucciones` al final (cuántas instrucciones de los programas quedaron en
  nativo). La suite corre entera con los tres motores: 247/247; estrés en paralelo traducido, 300/0.

**Medido** (`calculo`, 671 millones de instrucciones, el mismo `j0` en todos):

| | uno solo | dos a la par (remeros de fábrica) |
|---|---|---|
| x86-64 escrito a mano | ~0,2 s | — |
| traductor del escalón 0 (sin SO) | ~0,37 s | — |
| SO, rutinas | ~2,2 s | ~1,75 s |
| **SO, traducido** | **~1,0 s** | **~0,7 s** |

**`jcall` y `jret` en nativo** (mismo día): `calculo` pasa de ~1,0 s a **~0,58 s** (eran 2 de cada 10 instrucciones).
La pila de retornos sigue siendo la de Janax (guarda renglones de la tabla): `jret` salta al renglón que vuelve,
y lo que necesita más pila o un `jret` sin `jcall` sigue en su rutina.

**Registros en el procesador** (mismo día): los 4 registros Janax que más usan los bloques nativos de cada programa
viven también en `r8`–`r11`; cada escritura va a los dos lados (registro y memoria), así las rutinas siempre los
encuentran en memoria, y lo que vuelve de una rutina o de la tabla entra por un recargue `R(i)`. Comparado A-B
(seis rondas alternadas): **~19 % más rápido** que sin ellos.

⚠️ **Cobrar el turno por tramo, medido y descartado**: cobrar de una vez cada tramo derecho (y devolver lo cobrado si
el turno no alcanza) dio idéntico pero **no ganó nada** (~0,6 s antes y después), ni con el cobro pegado al comienzo
del tramo. La resta y el salto por instrucción el procesador los hace casi gratis; el freno eran los registros en
memoria. Si complica y no gana, no entra: se volvió a la versión simple.

Lo que falta para acercarse al escalón 0: los registros Janax viven en memoria y no en registros del procesador, y cada instrucción cobra su
turno con dos instrucciones más. El costo de un cambio medido sube a ~46–52 instrucciones: cada instrucción es más
barata, así que el mismo cambio equivale a más de ellas.

## Remeros según el trabajo y el remero especial (Capitán, 2026-10-31)

> *"Según la cantidad del trabajo son los remeros que se despiertan: si es menos, menos; si es más, más. Y
> vamos a dividir el trabajo de los remeros en dos: 1 a 3 remeros con el mismo modo actual y 1 remero especial
> que solo trabaje con los procesos que traban otros procesos, desde el que tiene más trabas hasta el que traba
> menos."*

- **Se despierta un remero por trabajo nuevo** (`so/remos.inc`): un camarote que nace o al que le llega su
  firma despierta a **un** remero de fila, no a todos. Un camarote que vuelve de su turno lo toma otra vez su
  propio remero, sin despertar a nadie. Antes cada vuelta despertaba a todos los dormidos, que se peleaban por
  el candado para no encontrar nada.
- **La fila tiene solo a los que nadie está remando**: quien toma un camarote lo saca de la fila (enlace doble,
  `P_PREV`, para sacarlo del medio sin recorrerla) y al volver va al final. ⚠️ La primera versión lo dejaba en
  la fila mientras lo remaba el especial: el padre remaba dos turnos seguidos y el hijo terminaba 397
  instrucciones **más tarde**.
- **Trabas**: hoy la única traba es un pedido de un hijo que espera la firma del padre. Cada camarote cuenta las
  suyas (`P_BLOCKS`): sube al anotarse el pedido y baja al firmarse, al rechazarse o al decidir la sombra; y
  `held` es el total, así nadie mira la tabla si nadie traba a nadie.
- **El remero especial** toma al camarote que más traba, que nadie esté remando y que pueda remar; en empate, el
  primero. **Si nadie traba, rema la fila como cualquiera** (Capitán: *"el especial solo se ocupa
  de los casos especiales cuando los hay; si no, queda desocupado para el trabajo normal"*). El núcleo lleva la
  cuenta de quién duerme: un trabajo nuevo de la fila despierta a un remero de fila dormido, y si no hay ninguno,
  al especial; una traba nueva despierta al especial solo si está dormido. Con varios
  remeros, uno es el especial y el resto rema la fila; con uno solo, ese hace las dos cosas, un turno cada una.
- **Instrumento**: con más de un remero el núcleo imprime `remeros: N, despertares en vano=V`, los que se
  despertaron y no encontraron nada.

**Medido** (dos `calculo`, costo medido por el núcleo, 3 corridas por fila; antes = con la fila sola):

| remeros | fila sola | especial que duerme | especial libre |
|---|---|---|---|
| 1 | ~3,3 s | ~3,2 s | ~3,3 s |
| 2 | ~1,8–2,0 s | ~2,8 s | **~1,7 s** |
| 3 | ~2,35 s | ~1,9 s | ~1,8 s |
| 4 (los de fábrica en esta máquina) | ~3,0 s | ~1,7–2,0 s | **~1,7–1,8 s** |

(Última tanda, alternando las tres versiones; la máquina estaba más cargada que en la primera, por eso 1
remero da ~3,3 s y no ~2,8.)

- Con 4 remeros, cero despertares en vano. En 300 corridas de estrés (2, 3 y 4 remeros, un padre con tres hijos
  y dos largos), 0 fallas y 48 despertares en vano contra 1.800 despertares pedidos.
- **Un padre que traba a tres hijos** entre tres `largo_1000`, costo 4, un remero: los hijos terminan en t=4528,
  5325 y 5328 (con la fila sola, 6066, 7285 y 8504); los largos terminan en el mismo reloj, sin trabajo perdido.
  Con un solo hijo el resultado es idéntico al de antes: el padre ya quedaba justo detrás del hijo en la fila.
- Con el especial que dormía, 2 remeros iban más lentos que con la fila sola (~2,8 contra ~1,8 s): quedaba un solo
  remero de fila. Con el especial libre ese costo desapareció. Estrés: 300 corridas, 0 fallas, 101 despertares en
  vano contra 1.800 pedidos (el especial ahora también se despierta por trabajo de la fila).
- ⚠️ **Dos instrumentos mintieron**: `build/calculo.bin` era del 29 de octubre (de antes de la primera orden) y se
  rompía a las 9 instrucciones, así que los tiempos medían solo la calibración; se rearma con el ensamblador PDP.
  Y la primera versión pasaba el tipo de remero en `r8` a `CreateThread`, cuyo parámetro va en `r9`: todos los
  remeros eran de los dos tipos, y la tabla daba números que no correspondían al diseño.

## La bolita de cada camarote (2026-10-31)

- **Al lanzar**: `programa.bin!0.5` (también `programa.bin@pm!0.5` o `programa.bin!0.5@pm`). Una fracción de 0
  a 1 con hasta 9 decimales, redondeada al 65.536avo más cercano. Si es más que 1, o le sigue algo que no son
  los permisos, no arranca nada (código 4). Sin `!` queda 0,99.
- **Los hijos nacen con la bolita del padre**, y esa es su techo.
- **En marcha**: el pedido **20 bolita** de la ventanilla. La recorta al techo (la bolita con la que lo
  lanzaron, `P_PRIO_TOP`) y recalcula el turno **una sola vez**, en ese momento: los cambios de remo siguen
  sin calcular nada. Rige desde su próximo turno.
- **Probado** (`so/pruebas/correr.sh`, en los dos motores): con costo 4, una copia de `largo_1000` con 0,5
  (turno 4) contra otra con 0,99 (turno 397): la de 0,99 termina en t=3038, la otra en 6012, la cuenta hecha a
  mano. Con bolita 1, rema entera de una vez (t=3403). Un camarote lanzado con 0,5 que pide 1 recibe 0,5
  (`8000h`), y un hijo de un padre con 0,5 también.

## La última parte: terminar en vez de pasar el remo (Capitán, 2026-10-31)

> *"Si al terminar le falta lo mismo o menos que lo que el remo tarda en cambiar, entonces termina de remar
> antes de pasar el remo."* — *"El programa no guarda el tamaño final sino la combinación de instrucciones que
> marcan la última parte: cuando aparezcan, ya sabe que termina."*

Código: `end_table` en `so/remos.inc`. El núcleo encuentra la última parte **en el código mismo** (un programa no
puede mentir sobre ella): para cada palabra, cuántas instrucciones faltan hasta su `jhalt` por **camino derecho**
(instrucciones que solo siguen de largo, y después el `jhalt`); 0 si no está en un camino así. Se calcula una vez
cuando nace el programa y lo comparten sus copias. **Cuando a un camarote se le acaba el turno** y lo que le falta
de su última parte cuesta lo mismo o menos que un cambio (`c` redondeado hacia arriba), sigue hasta terminar. Un
turno cortado por un evento (alguien nació, se despertó o se durmió) no se estira. No cuesta nada mientras rema: es
una consulta a la tabla, solo al final del turno. Prueba: `final_derecho` (dos copias de un programa todo derecho,
`c = 5`): P0 recibe un turno de 13 y le quedarían 4, así que termina en `t = 32`; antes pasaba el remo y terminaba
en `t = 44`.

## El núcleo en Janax: el planificador (2026-10-29)

Primera pieza del núcleo escrita en Janax: `so/nucleo/planificador.inc`, rutina `turno` (j1 = D, j2 = s, j3 = c en
dieciseisavos de instrucción → j0 = t). La regla del Capitán (sigue mientras `(t − D)·t < c·(s + t)`) da el
menor `t ≥ D + 1` con `t·(t − D − c) ≥ c·s`: la raíz de esa ecuación es la fórmula de siempre, redondeada hacia
arriba. **En enteros y exacta** (la versión x86 usa punto flotante): una raíz cuadrada entera (Newton, desde una
potencia de 2 que se halla en 5 pasos) deja `t` al lado de la raíz, y la regla misma, comparando con una
división en lugar de multiplicar, lo lleva al turno exacto en uno o dos pasos. Cuando el cuadrado no entra en
64 bits (D mayor a ~1,3·10⁸, o `16·c·s` mayor a 2⁵⁶) lo busca por duplicación y por mitades. Nada se desborda
mientras `16·c·s < 2⁶³` (con un cambio de 8 instrucciones, hasta ~7·10¹⁶ instrucciones servidas a un proceso).

- **Probado contra la matemática exacta**: `so/herramientas/turnos.pl` calcula el turno esperado con enteros
  grandes y genera `escalon0/pruebas/41_turnos.jsm` (226 casos: bordes, los bordes de la estimación y aleatorios). Da idéntico en el
  intérprete, en x86-64 y en ARM64 en el teléfono. ⚠️ La primera corrida dio 1 distinto: el que mentía era la
  referencia (aceptaba t = 0). Arreglada la referencia, todos iguales.
- **Costo medido** (instrucciones Janax por turno, incluido el llamado): con la búsqueda sola eran 28 con
  `s = 0`, ~300 con `s = 1.000`, ~690 con `s = 10⁹` y ~890 con `s = 10¹²`. Con la raíz entera (Capitán:
  "abaratar primero"): **~150 en todos** (153, 162, 164; 28 con `s = 0`). Sigue siendo más que un cambio de
  proceso (~8): conectado, el costo de cambio medido lo incluiría y los turnos se alargarían como `√(c·s)`.
- **Conectado y personalizable desde PDP** (Capitán: *"de PDP, personalizable"*): `so/nucleo/planificador.jsm` es
  el programa (D, s y c en registros → turno, `jhalt`). El núcleo lo busca al arrancar en
  `PDP/so/nucleo/planificador.bin` de la carpeta del sistema; si no está, usa **el de fábrica**, que va adentro
  del ejecutable (`so/pdp/semilla/planificador.bin`, armado por el ensamblador PDP y controlado por `armar.sh`
  como la semilla del ensamblador). Lo corre en cada decisión con su propio motor, como un **ayudante**
  (`so/ayudantes.inc`): un procesito sin memoria ni ventanilla que conserva su pila entre corridas. Uno
  personalizado que falla o no termina en 100.000 instrucciones hace volver al de fábrica, con aviso. El
  núcleo nunca da un turno menor a `D + 1`. **El punto flotante del turno desapareció del núcleo.** El costo
  recordado también depende del planificador (entra en la huella de la calibración).
- **El costo real de un cambio**: la calibración corre el planificador completo en cada decisión (con c = 1
  instrucción, descartando el resultado), porque decidir el turno es parte de cambiar. Medido: **~300
  instrucciones con rutinas** (295, 310, 343) y **~170 con el intérprete** (antes ~8 y ~2). Los turnos se
  alargan como `√c`: dos `calculo` terminan separados por ~310.000 instrucciones (antes ~46.000), y **compartir
  sigue costando lo mismo que correr seguidos** (~2,9 s contra 2 × ~1,5 s).
- **La calibración apunta a una duración**: corría un largo fijo, y con un cambio 30 veces más caro tardaba
  20 s (rutinas) y 50 s (intérprete). Ahora un sondeo corto del par decide sus vueltas para que dure como 10
  corridas solas: el largo que daba medianas estables cuando un cambio costaba ~8. El error de `c` es el ruido
  sobre esa duración, cueste lo que cueste un cambio. Vuelve a tardar ~1–2,6 s.

## Datos iniciales: `X.datos` al lado de `X` (Capitán, 2026-10-29)

> *"Cualquiera quiero que lo pueda mejorar y personalizar su Janax sin partir de cero."*

Código: `so/datos.inc`. En Janax el programa y los datos viven separados (un programa no puede leer sus
propias palabras), así que los datos que un programa necesita ya cargados viajan en **un archivo al lado
del programa**: el mismo nombre con la extensión `.datos` (se reemplaza la última extensión, o se agrega si
no tiene): `X.bin` → `X.datos`, `hijo` → `hijo.datos`. El núcleo lo lee al lanzar (desde la línea de
comandos, o desde la carpeta del sistema y con los mismos porteros cuando lo lanza un proceso) y **la
primera orden lo copia al principio del ambiente 0**. Si no entra en el ambiente pedido, es código 5. Sin
ese archivo, el ambiente 0 arranca en ceros como siempre. Cualquiera puede cambiar los datos de un
programa (por ejemplo, la tabla de un ensamblador) sin tocar el programa. Pruebas: `datos_iniciales`,
`datos_no_entran`, "datos iniciales de un hijo".

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
- **Se verifica, no se promete**: `so/herramientas/bucles.awk` (antes en Perl) lista cada bucle (un salto hacia atrás que
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

131/131 (las 127 pruebas, el ensamblador PDP y los chequeos de bucles): **la suite entera corre dos veces, una con el motor de rutinas y otra con el intérprete**, cada una
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

### Fundir la condición con la instrucción anterior

Núcleo anterior (4501856) contra el nuevo, **intercalados** con el orden alternado, seis rondas, `c` = 0,
2026-10-29. Mismos `j0` y `t` en las 24 corridas.

| Banco | Rutinas por vuelta | Sin fundir | Fundido | Ganancia |
|---|---|---|---|---|
| `suma_1000m` (3.000 M instrucciones; bucle `jadd`, `jsub`, `jjnz`) | 3 → 2 | ~4.547–5.512 ms | **~3.558–3.943 ms** | **~21 %** |
| `calculo` (671 M; bucle de 10) | 10 → 9 | ~1.438–1.567 ms | **~1.318–1.549 ms** | ~8 % |

La ganancia sigue a las rutinas que se ahorran: un tercio menos de despachos da ~21 %, un décimo da ~8 %.
Lo que queda es el trabajo de cada instrucción (los registros Janax viven en memoria). ⚠️ Una primera
medición con `suma_100m` (0,4 s) daba entre 7 y 40 %: el arranque y el ruido la tapaban.

### Ambientes

Contra cc5b297, intercalados, `c` = 0, 2026-10-29. Mismos resultados.

| Caso | Antes | Ahora |
|---|---|---|
| Un ambiente de 64 MB construido y destruido: memoria privada del proceso | — | 66,6 MB → **2,4 MB** |
| `calculo` (memoria en el ambiente 0), mediana de 8 | ~1.486 ms | **~1.453 ms** |
| `calculo_ambiente` (la misma memoria en un ambiente construido), mediana de 8 | — | ~1.764 ms (~+20 %) |

**La primera versión hacía al ambiente 0 ~5 % más lento, y no era por lo que el paquete hace.** Variantes
medidas intercaladas (medianas): con la comparación de antes ~+3 %; con el casco chico de antes, igual que
la versión lenta (el casco no era); **sin el paquete dentro de las rutinas, empatado**. El culpable era el
**lugar**: metido en cada rutina de memoria, la engordaba aunque casi nunca se ejecutara. Un paquete único
compartido afuera arreglaba el ambiente 0, pero hacía al acceso traducido ~20 % más lento (su salto de
vuelta va a destinos distintos y se adivina peor: 2.212 contra 1.830 ms). Un paquete por rutina armado al
final del código da las dos cosas: ambiente 0 igual que antes de los ambientes y traducido en ~1.764 ms.

**Primera orden** (contra 9e065c6): 64 procesos (`calculo` + 63 copias de `02_ldi`), memoria privada
máxima **69 MB → 4 MB**. Lo que queda por proceso es casi todo su pila de retorno (32 KB fijos).

**Pila de retorno** (contra bc60a58): 64 procesos, memoria privada máxima **4 MB → 2 MB**; `calculo` (una
llamada por vuelta) ~1.416 contra ~1.461 ms, dentro del ruido de esta máquina.

**Toda rutina alineada a 16 bytes.** Midiendo la pila apareció `calculo` 18 % más lento, y variantes que
cambiaban de a una cosa daban resultados sin lógica: sacar una sola instrucción de otra rutina lo
acercaba al anterior. La causa era el lugar: el motor salta a cada rutina por una tabla, y cualquier byte
agregado antes corre a todas las que siguen; según cómo caigan respecto de los bloques de 16 bytes que el
procesador trae para decodificar, la velocidad se movía hasta ~15 %. Regla general: **cada rutina a la que
salta la tabla empieza alineada a 16 bytes** (en los dos motores). Medido: núcleo anterior ~1.402 →
~1.358 ms alineado; con la pila nueva ~1.598 → ~1.398 ms. Las que se alcanzan cayendo desde la anterior
(`t_store`, `t_ended`) no se alinean: el relleno quedaría en el camino.

### Compartir el programa entre copias

Núcleo anterior (1080ef3) contra el nuevo, 2026-10-29.

| Caso | Sin compartir | Compartido |
|---|---|---|
| 64 procesos (`calculo` + 63 copias de `02_ldi`): memoria privada máxima, 2 corridas | 131 MB | **69 MB** |
| 1.000 copias de `02_ldi`: tiempo total, 3 corridas intercaladas | ~418–462 ms | **~293–352 ms** |

Los 62 MB que se ahorran son 62 copias del búfer de programa (1 MiB cada una, `MAX_PROGRAM`). Lo que queda
por proceso es casi todo su camarote (1 MiB de datos). Las salidas de las 1.000 copias son idénticas
byte por byte. ⚠️ Cada lanzamiento todavía abre y lee el archivo: se comparte después de leerlo.

38 programas distintos (`calculo` + las 37 pruebas del escalón 0), memoria privada máxima, contra e1c9ebe:
**77,5 MB → 41,7 MB**, con salidas idénticas. Lo que queda por proceso es su camarote (1 MiB de datos).

### Compartir el procesador con el motor de rutinas

Banco `calculo` (671 M instrucciones por copia), los dos motores **intercalados**, tres rondas, 2026-10-29.
`c` medido por el núcleo y recordado: **7,96** instrucciones con rutinas, **2,32** con el intérprete.

| Motor | Una copia | Dos copias, turno por prioridad | Dos copias, LAS puro (`c` = 0) |
|---|---|---|---|
| **Rutinas** | ~1.469–1.520 ms | **~2.875–2.937 ms** | ~14.392–14.792 ms |
| Intérprete | ~2.972–3.207 ms | ~6.664–6.759 ms | ~15.752–18.204 ms |

- **Rutinas: compartir cuesta lo mismo que correr uno detrás del otro.** Dos copias tardan apenas menos
  que el doble de una (el arranque se paga una sola vez). Siguen siendo justos: terminan separados por
  ~46.000 instrucciones sobre 1.342 millones.
- **Sin el turno por prioridad, el motor rápido lo pierde todo**: con LAS puro (cambio cada ~2
  instrucciones) las rutinas tardan 5 veces más que con el turno, y casi lo mismo que el intérprete. Cuanto
  más barata es cada instrucción, más pesa el cambio y más importa el turno. El turno no se toca: se
  ajustó solo con el `c` que midió.
- ⚠️ El intérprete compartiendo paga ~8–10 % más que dos copias seguidas (~6,7 s contra ~6,2 s). Su `c`
  medido (2,32) podría estar corto. No se investigó: el motor por defecto son las rutinas.

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

- Archivos: tablas de normalización propias para el modo cero; nombres legibles desde Windows si el
  Capitán lo quiere.
- `jsys` existe solo dentro de Janax OS: el intérprete y los traductores del escalón 0 lo toman como opcode
  desconocido.
- Familia: las firmas hoy son decisiones dentro del núcleo; firmarlas con claves (como las órdenes de
  Wenas) cuando los procesos puedan vivir en máquinas distintas.
- La campana (0..1) y la cubierta.
- Modo cero.

## Contra Windows, en la misma máquina (2026-10-31)

Bancos escritos en FASM, sin nada externo, todos corridos en la misma tanda:

| | Windows | Janax OS | |
|---|---|---|---|
| Cambiar de tarea | ~2 µs (dos hilos que se pasan el turno con eventos, un núcleo: 400.000 cambios en ~790 ms) | **~37 ns** (dos camarotes con turnos de una instrucción: 6 millones de cambios suman ~225 ms) | ~50 veces menos |
| Crear y terminar una tarea | ~8 ms (`CreateProcess` del programa más chico, 100 veces: ~800 ms) | **~0,1–0,3 ms** (101 camarotes contra 1; incluye leer el programa del disco y escribir su línea) | ~25–80 veces menos |
| Una tarea en memoria | (no medido) | 472 bytes de camarote, más la memoria que pida | |

No es la misma cosa: un proceso de Windows tiene su propio espacio de memoria protegido por el procesador, y lo
cambia el reloj del hardware; un camarote vive dentro del proceso de Janax OS, protegido por los límites que revisa
cada acceso, y cambia en la instrucción exacta. Lo que se mide es lo que cuesta *a Janax* cambiar y crear tareas,
contra lo que le cuesta a Windows con las suyas. ⚠️ El primer banco de cambios mintió: el programa no se había
armado (el ensamblador PDP no toma rutas absolutas en `include`) y el SO corría sin nada.

## Los números de cofre no se reusan (Capitán, 2026-10-31)

> *"Si tenemos cofre 1, 2 y 3 y se destruye el 1, el contador cuenta desde el mínimo, en este caso el 2, y si se
> agrega un cofre nuevo se agrega a la fila como cofre 4: los huecos son una cuenta de los cofres que estuvieron y
> que ya no existen, y no se pueden reemplazar para confundir, solo agregar nuevos. Y si se destruyen todos los
> cofres de ese marinero, se reinicia el contador a 0."* — *"Si se destruye el cofre, se destruye la dirección."*

- **El agujero que tapa**: antes, un ambiente nuevo tomaba el número libre más bajo, así que la dirección guardada
  de un ambiente destruido **abría el ambiente nuevo** sin ningún error (la prueba nueva lo mostró en vivo: leyó el
  cofre 1 nuevo con código 0).
- **Ahora** (`so/ambientes.inc`): cada ambiente nuevo toma el número siguiente (`P_NEXTROOM`); la tabla abarca del
  ambiente vivo más bajo al más alto (`P_ROOMBASE`: el renglón k es el ambiente base + k), así no crece con los
  destruidos de las puntas; una dirección de un ambiente destruido falla con código 5. Cuando no queda ninguno
  (salvo el 0), la cuenta vuelve a empezar en 1.
- ⚠️ El SO hace fallar la dirección muerta, pero no puede borrar las copias de ese número que el programa se haya
  guardado: después de vaciar todo, las direcciones de antes no valen, y usarlas es error del programa.
- Costo: el ambiente 0 no cambia (una comparación); los demás, una resta más en el paquete de traducción.
- Probado en los tres motores: `ambiente_sin_reusar` (1 y 2, se destruye el 1, el nuevo es el 3 y el 2 sigue
  andando) y `ambiente_muerto` (la dirección del 1 falla con código 5). 254/254.

## Qué cuesta el cálculo, medido pieza por pieza (2026-10-31)

El Capitán pidió reducir el cálculo con cinco reglas (contar solo lo importante, memorizar sin anotar, cofres de
colores, bolsillos autoajustables, volver sin preguntar). Antes de construirlas se midió cuánto vale cada una:
versiones de laboratorio que sacan un costo de golpe (dan resultados incorrectos, solo sirven para el tiempo).
`calculo` con el costo fijado, 7 rondas alternadas, medianas:

| | tiempo |
|---|---|
| traducido (lo guardado) | ~470 ms |
| sin contar los pasos (la piedrita) | ~404 ms: **contar cuesta ~14 %** |
| sin medir el cofre 0 (la regla) | ~442 ms: **medir cuesta ~6 %** |
| nativo | ~192 ms |

Construidas de verdad y medidas A-B, **sin ganancia** (dentro del ruido o apenas peor), y por eso no entraron:
- `jret` directo al código nativo, sin recargar los registros.
- Anotar los registros en memoria solo al salir del código nativo (antes de una rutina o al terminar el turno), y
  hasta 6 registros en el procesador (sumando `r12` y `r13`), elegidos por programa.

Por qué: el freno de `calculo` es una cadena que nadie puede adelantar (cargar el cofre, sumar, desplazar,
mezclar, guardar el cofre, y la vuelta siguiente carga ese mismo cofre); el nativo también la tiene. Lo que nos
separa es cuántas instrucciones de máquina rodean cada paso, y anotar en memoria no pesa porque el procesador
escribe sin esperar. Lo que sí vale: contar solo lo importante (hasta ~14 %, hecho sin saltos a la zona fría: la
primera versión por tramo los tenía y por eso no ganó) y los cofres de colores (hasta ~6 %).

**Contar solo lo importante, bien hecho** (mismo día): el turno se cobra una vez por tramo derecho y el cobro va
**pegado al comienzo del tramo**, por donde pasan todas las entradas (un salto, caer desde la instrucción anterior,
un `jret` que vuelve directo al código nativo); solo un salto al medio de un tramo (la entrada de un while, una vez
por bucle) pasa por la zona fría. Si el saldo no alcanza, se devuelve y se recorre de a una instrucción con las
rutinas: frena en la misma instrucción que los otros motores. `calculo`: **~494 → ~370 ms (−25 %)**, A-B, siete
rondas. La primera versión por tramo no ganaba porque cada `jret` volvía por la tabla y la zona fría en cada vuelta.

**Cofres de colores, medido y descartado por ahora** (mismo día): juntar las dos preguntas de un acceso de 8 bytes
(¿dentro del cofre 0?, ¿alineado?) en una sola comparación girando la dirección 3 bits dio **~420 contra ~372 ms**:
más lento, porque el giro es un paso más que hay que esperar antes de comparar. Tener el límite en un registro en
vez de en memoria, con las dos preguntas: ~400 contra ~382, sin ganancia (traer el límite es casi gratis). El ~6 %
que cuestan las dos preguntas solo se recupera si las contesta el procesador mismo (páginas protegidas), y eso
choca con lo exacto: un cofre mide en bytes y una página en miles, así que habría que acomodar cada cofre contra el
final de su página; queda anotado como camino, no construido.

## El cartel de los cofres: cada uno en su cajón, con pared (Capitán, 2026-11-01)

Diseño en `ideas.md` (2026-11-01). Lo construido:

- **Cada ambiente en su propio cajón** (`ambientes.inc`, `room_drawer`): se reservan las direcciones del ambiente
  más grande (`ROOM_MAX`, 4 GiB) más una página, y se piden solo las páginas que lo contienen. El ambiente se
  apoya contra el **final** de sus páginas: el byte siguiente ya es una dirección que el procesador rechaza.
  Destruir no mueve a nadie: el cajón vuelve al anfitrión y su renglón apunta al **cajón muerto** (reservado una
  vez, nunca entregado). Ya no hay casco.
- **El renglón del cartel** son 16 bytes: los 8 del cartel (lugar en los 48 bits bajos, cómo tratar la caja en
  los 16 altos, con las constantes `ROOM_*` del diseño) y el tamaño.
- **El traducido no pregunta por el borde** (`nativo.inc`): el ambiente 0 va directo por `r15`; otro ambiente
  sale del cartel en `O(i)`, en la zona fría. Si el procesador rechaza el acceso, `native_fault` (un manejador
  vectorizado) busca la palabra por su dirección de código y la manda por su `T(i)`: la rutina da el código 5 en
  la misma instrucción que el intérprete. Las rutinas y el intérprete siguen preguntando: son la referencia.
- **Pedido 21, el trato de la caja**: bit 0 leer, bit 1 escribir. Las páginas se protegen igual, así el
  procesador lo cumple gratis. Se rechaza (−1): escribir sin leer (el procesador no lo puede cuidar), quitarle la
  escritura al ambiente donde está la cola, y todo trato no construido todavía (ejecutar, solo agregar, avisar,
  firmada, compartida, se hereda, pieza, prioridad, familia). **Regla nueva: el núcleo solo toca una caja que su
  dueño puede leer y escribir.**

**Medido** contra 61020de, `JANAX_CAMBIO=24`, un remero, 15 rondas intercaladas en los dos órdenes, medianas:

| | antes | ahora |
|---|---|---|
| `calculo` (ambiente 0) | ~456–459 ms | **~448–460 ms** (empate) |
| `calculo_ambiente` (ambiente 1) | ~1.036–1.045 ms | **~661–671 ms** (~−37 %) |

Lo que enseñó la medición:
- ⚠️ **El instrumento**: el mismo núcleo contra sí mismo dio 451 contra 425 ms con 7 rondas. Por eso 15 rondas
  y los dos órdenes; una diferencia menor a ~5 % no se cree.
- **El orden de las instrucciones pesa más que cuántas son.** Separar el ambiente (`mov rdx, rax / shr rdx, 32
  / jnz O`) *antes* de la alineación y del valor a guardar dejó al ambiente 0 empatado; después, ~7 % más lento.
  Ni la alineación del ambiente, ni el manejador, ni la comparación con el límite lo explicaban (laboratorios
  medidos uno por uno).
- **La otra versión** (alineación antes, zona fría de 272 bytes) llevaba al ambiente 1 a **~575 ms** (~−45 %) pero
  le costaba ~7 % al ambiente 0. Se eligió no castigar al ambiente 0, que usan casi todos los programas.
- La zona fría pasó de 256 a 288 bytes por palabra (`O(i)` ocupa hasta 71).

Pendiente: los tratos no construidos; liberar los cajones de un proceso que terminó (como el casco de antes,
quedan reservados); el tope de ~32.000 ambientes vivos entre todos los camarotes.

## Cajas entre camarotes: nace, se muda, se enlaza, se fusiona, se asocia (Capitán, 2026-11-03)

> *"Tiene tres formas distintas: el hijo nace, el hijo se muda, o el hijo se enlaza y se comparte."* — *"Y agregá
> el fusionar."* — *"Por asociación pueden mantener lo que comparten entre los dos y crear uno con los cajones
> compartidos, con los que le sobran a A o con los que le sobran a B."* — *"Armalo completo con la vista incluida."*

**Los cimientos: cada caja es una sección del anfitrión, y cada dueño la mira por su propia vista.**
- `box_new` hace la sección; `box_view` reserva un cajón (`VirtualAlloc2`, como lugar reservado), mapea la vista al
  principio (`MapViewOfFile3`) con la caja apoyada contra el final de sus páginas, y la deja a leer y escribir
  para después achicarla a su trato. La pared del byte siguiente sigue igual.
- **Cada dueño tiene su llave** (un *handle*, `DuplicateHandle`) y su vista, con **su propio trato**: el mismo cajón
  puede ser de lectura y escritura para la madre y de solo lectura para el hijo, y el procesador cuida los dos.
  La caja vive mientras alguien tenga una llave o una vista; **el anfitrión la libera solo** cuando se va el último.
- **El renglón del cartel pasa a 32 bytes**: lugar y trato, tamaño, la llave de este camarote y el número de la caja
  (el mismo en todos los que la tienen; arriba del bit 48, hasta dónde puede tratarla este dueño).
- **El cartel ya no se mueve**: se reservan sus direcciones una vez (`CARTEL_MAX`, criterio) y se comprometen
  páginas a medida. Así una caja puede llegar a un camarote **mientras rema**: se escribe el renglón y recién
  después se cuenta.
- El ambiente 0 también es una caja; el primer pedido se reconoce por `P_ROOM0`, no por la falta de cartel.

**Las cinco formas** (puerta de memoria, `R_MEM`; las que cambian algo son importantes y un hijo necesita la firma
de su padre):

| Pedido | Forma | Qué hace |
|---|---|---|
| 22 dote | 🍼 nace | La caja `a` va al próximo hijo, con trato `b`; nace con su dote como ambientes 1, 2… (antes de entrar a la fila) |
| 23 mudar | 🚚 se muda | La caja `a` pasa al camarote `b`; acá su dirección muere; allá puede tratarla hasta donde podía este |
| 24 enlazar | 🔗 se enlaza | La caja `a` también la tiene `b`, con el trato de la mitad alta del tipo |
| 25 recibir | 📬 | La próxima caja que llegó por 23 o 24, o −1 |
| 26 fusionar | 🔀 | Las cajas `a` y `b` se vuelven una nueva, con lo de `a` y después lo de `b` (**se copia**); las dos direcciones mueren acá |
| 27 asociar | 🧩 | El próximo hijo nace con parte de mis cajas y las de `b`: 0 las que comparten, 1 solo mías, 2 solo suyas, 3 todas; vale solo si `b` también me nombró |

Reglas generales, sin casos especiales:
- **Quien recibe nunca tiene más trato que quien da**; en la asociación, una caja de los dos va con el trato que
  ambos permiten.
- Mudar, enlazar y asociar, **solo en familia**: padre, hijo o hermano, y que siga navegando.
- La cola no se muda ni se fusiona (sus respuestas necesitan dónde ir).

Probado en los tres motores (`nace`, `nace_leer`, `nace_mas`, `muda`, `enlaza`, `cajas_no`, `fusiona`, `asocia_0..3`):
el hijo lee lo que escribió la madre y ella ve lo que escribe él; el de solo lectura termina con código 5 al escribir;
la madre que mudó su caja termina con código 5 al leerla; cada zona del Venn llega entera.

Lo que todavía falta: avisar al cambiar (la campanita), que el núcleo toque cajas de solo lectura en los pedidos
que solo leen, y liberar las cajas de un camarote que terminó.

**Medido** contra 7a89201 (15 rondas, los dos órdenes, medianas): las secciones no cuestan nada en el acceso.
`calculo` ~434–458 → ~436–448 ms; `calculo_ambiente` ~641–651 → ~635–636 ms. SO 302/302, escalón 0 182/182
(con el teléfono).

**La suite, más rápida** (Capitán): `JANAX_SOLO=<patrón>` corre solo las pruebas de la zona tocada (cajas: 41 en
37 s); la completa, una vez antes de guardar.

## El saludo: un bit por familiar, plástico (Capitán, 2026-11-03)

> *"Con un solo bit mamá o el hijo envían un saludo… si es entre padre e hijo un solo bit; si se requiere más para
> comunicación con otra parte de la familia se usa más, pero todo bien plástico: se usa lo que se necesita."*

Reemplaza a la campanita sobre la memoria (que quedó en diseño): no toca páginas ni el procesador, es un pedido y un
despertar.

- **28 saludar** (`a` = un camarote de la familia): le deja una marca con quien saludó y, si esperaba un saludo, lo
  despierta. Una marca por familiar, aunque salude varias veces; tantas marcas como familiares saluden (la lista
  crece a medida, sin tope fijo). Fuera de la familia, −1.
- **29 esperar un saludo**: el número del que saludó primero, y su marca se baja. Si nadie saludó, el camarote
  **duerme sin gastar nada** (el mismo mecanismo que la espera de una firma). Si espera y ya no queda nadie
  despierto que pueda saludarlo, el núcleo lo despierta con −1.
- **El saludo no se pierde**: la marca queda hasta que se la toma, así que un saludo que llegó antes de la espera la
  encuentra lista.

Probado en los tres motores (`saludo`, `saludo_hijo`, `saludo_no`) y con 4 remeros en paralelo 30 veces sin un
despertar perdido.

## Lo nuevo, medido: cajas y saludos (2026-11-03)

7 rondas, medianas, un remero, `JANAX_CAMBIO=24` (bancos en el scratchpad, no en el repo).

| Caso | Resultado |
|---|---|
| Enlazar 1.000 veces una caja de 1 MB | ~0,29 ms cada enlace |
| Enlazar 1.000 veces una caja de 64 MB | ~0,33 ms cada enlace: **no depende del tamaño, no copia** |
| Copiar 64 MB con un bucle Janax | ~120 ms (enlazar es ~360 veces más barato) |
| Saludo ida y vuelta (200.000 pasadas), antes | ~24 µs por pasada |
| **El mismo, con el cuaderno propio de la ventanilla** | **~7,4 µs** por pasada (mismas instrucciones, t idéntico) |
| Windows, dos hilos con eventos (400.000 pasadas) | ~2 µs por pasada |

**El cuaderno de la ventanilla** (Capitán: *"no necesitamos que salga hacia fuera a Windows, lo podemos hacer todo
internamente de Janax"*): cada pedido copiaba su cola en memoria pedida a Windows (`VirtualAlloc`) y la devolvía al
salir (`VirtualFree`), dos llamadas al anfitrión por pedido. Ahora la ventanilla tiene un cuaderno propio
(`window_book`) que reusa y que crece, duplicando, solo cuando llega una cola más grande que todas las anteriores.
El saludo pasó a ser 3 veces más rápido. Todavía estamos ~3,7 veces detrás de los eventos de Windows: queda otro
costo por pedido sin encontrar.

**El costo que faltaba, encontrado con un cronómetro** (mismo día): una versión de laboratorio con `rdtsc` en cada
tramo del remero mostró que el 97 % del ping-pong de saludos estaba **dentro de la ventanilla**, ~27.000 ciclos por
saludo contra ~440 de un pedido común (200.000 pedidos de un camarote solo: ~70 ns cada uno). El culpable: la lista
de saludos queda vacía cada vez que se toma uno, y `list_slot` trataba "vacía" como "no existe": pedía memoria
nueva a Windows y devolvía la vieja en cada saludo. Regla general: una lista vacía que ya tiene cuaderno, lo reusa.

| | por pasada de saludo |
|---|---|
| Al principio | ~24 µs |
| Con el cuaderno de la ventanilla | ~7,4 µs |
| **Con la lista que reusa su cuaderno** | **~0,64 µs** |
| Windows, dos hilos con eventos | ~2,05 µs |

El saludo de Janax queda **~3,2 veces más rápido que los eventos de Windows**, con las mismas instrucciones (t
idéntico) y revisando la familia en cada uno.

## Plástico: cada cajón usa solo lo que necesita, y todo vuelve (Capitán, 2026-11-03)

> *"Lo quiero plástico, que mute, que cambie… que trabaje como la mente humana. No quiero nada rígido, ni
> siquiera los 4 GB ni los 32.000: solo lo necesario, sin usar de menos ni de más."* — *"No te pido que mida más:
> si ese es el techo, es el techo. Te pido que pueda medir menos."*

- **El cajón reserva sus páginas y una de pared**, no 4 GB. Los 4 GB siguen siendo el techo de un cajón, porque la
  posición tiene 32 bits en el formato de la dirección, pero ya no se reservan. El cajón muerto es una página.
- **Vuelve la comparación de tamaño**: el cofre 0 contra su límite y los otros contra el tamaño del renglón (un
  acceso alineado que empieza adentro termina adentro, porque los tamaños son múltiplos de 8). Lo que la pared ya
  no cubre lo cubre la comparación (`ambiente_lejos`: 1 MiB más allá del final da código 5). El trato de la caja
  (solo lectura) lo sigue cuidando el procesador.
- **El cartel crece y se muda** cuando hace falta: solo lo cambia su propio camarote, porque una caja que se muda o
  se enlaza **espera en el buzón** de quien la recibe y entra a su cartel recién con el pedido 25.
- **El registro de programas crece a medida**, y el cazador lo lee sin candado: lee primero la cuenta y la lista
  nueva se publica antes de que la cuenta crezca. Una lista vieja nunca se devuelve.
- **Al terminar un camarote, todo vuelve** (`cabin_free`): las vistas y llaves de sus cajones (un cajón que tiene
  otro sigue vivo, porque tiene su llave), su cartel, la dote y el buzón sin recibir, y sus saludos.

Medido:

| | antes | ahora |
|---|---|---|
| 33.000 cajones de 8 bytes a la vez (`muchos_cajones`) | no termina (cortado a los 120 s) | **649 ms** |
| 500 hijos en fila, cada uno con un cajón de 16 MB y un byte escrito: memoria comprometida de más en todo el sistema, en el pico (sin devolver → devolviendo) | **7.717 MB** | **26 MB** |

⚠️ El instrumento: la primera medición usó la memoria privada del proceso (`PrivateMemorySize`), que **no cuenta
las secciones**, y daba 4 MB aunque no se devolviera nada. La medición válida es la memoria comprometida de todo
el sistema (`Memory / Committed Bytes`), comparando el mismo núcleo con y sin `cabin_free`. Los 33.000 cajones solo
se crean (miden que entren); los 500 hijos escriben un byte cada uno.

Acceso, A/B contra ee5b067 (15 rondas, los dos órdenes): `calculo` ~431–446 contra ~432–433 ms, empate;
`calculo_ambiente` ~680–682 contra ~642–672 ms, entre 1 % y 6 % más lento, en el borde del ruido: es la
comparación de tamaño que volvió en `O(i)`. SO 314/314, escalón 0 182/182.

## El saludo que lleva una palabra (Capitán, 2026-11-06)

> *"Que el saludo no sea un pulso sino una palabra escrita, para la oración, como cuando decíamos hola porque algo se
> encendió o algo se apagó; pero literal: antes era un bit, ahora son bits de palabras."* — *"Ahora sí aplica la regla de
> lo asincrónico-sincrónico."*

- **Pedido 30, decir una palabra:** a = un camarote de la familia, b = la palabra (hasta 8 letras, en un qword). La carta
  queda en el buzón del otro (`P_SAID`: {quién la dijo, la palabra}, 16 bytes cada una, en orden de llegada, que crece a
  la medida con `list_slot`) y suena el timbre: el saludo de un bit de siempre (pedido 28), así quien espera se despierta.
- **Pedido 31, leer una palabra:** a = dónde escribir 16 bytes {quién, palabra}, la más vieja primero. Contesta 1, o 0 si
  el buzón está vacío, o −1 si a no son 16 bytes de sus camarotes.
- **El bit sigue siendo el timbre** y conserva su virtud: dos saludos antes de mirar quedan en una sola marca. Las
  palabras, en cambio, no se funden: van a una cola, en orden, y no se pierde ninguna.
- **La regla del buzón asincrónico-sincrónico, aplicada** (`documentacion/so/ideas.md`): decir no bloquea (nadie espera
  la respuesta, se espera que llegue la carta); la respuesta del pedido 30 solo confirma que la carta llegó (0) o que no
  hay a quién dejársela (−1); el otro lee cuando su timbre lo despierta. Nadie queda colgado del otro, así que no hay
  abrazo mortal. Acordar retardos queda para cuando las cartas viajen por la red, entre Razares.
- Al terminar un camarote, las palabras que nadie leyó vuelven (`cabin_free`).
- Prueba: `palabra: la madre lee las palabras de su hijo, en orden`: el hijo dice "hola" y "sol"; la madre espera el
  timbre, lee las dos en orden con quién las dijo, la tercera lectura da 0, y decirle una palabra a un camarote de afuera
  da −1. En los tres motores.

## El centinela: pedido 32, "avisame cuando haya novedad" (Capitán, 2026-11-06)

> *"Dejar a Razar dormido y un programa que revise archivos o procesos que, cuando haya alguna novedad, lo despierte."*

- **Pedido 32, avisame:** `a` = cuántos bytes del prefijo (0: deja de avisar, hasta 8), `b` = el prefijo en un qword.
  Responde 0, o −1. Necesita permiso de leer archivos; no es importante (no cambia nada).
- **El centinela es el núcleo**, sin bucles: cuando nadie rema y alguien que pidió aviso espera un saludo, en lugar de
  despertarlo con −1 ("nadie te puede saludar") el núcleo deja su candado y duerme en la carpeta del sistema
  (`ReadDirectoryChangesW`, archivos que aparecen, se borran o se escriben). Cuando Windows avisa, compara cada nombre
  (la etiqueta en hexadecimal) con el prefijo de cada uno que espera, y despierta a los suyos con un saludo de sí mismos.
  Si el cambio no es de nadie, vuelve a dormir en la carpeta.
- **Archivos compartidos:** el pedido 4 ahora abre compartiendo lectura **y escritura**, así dos procesos pueden tener
  abierto el mismo archivo (antes el segundo no podía abrir el libro que el primero estaba leyendo).
- Medido con dos Razares: dormidos, 0 ms de procesador en 5 s; un archivo nuevo de su prefijo los despierta a los dos.
- Pendiente: un cambio mientras alguien rema no despierta a nadie (la carpeta se mira solo cuando todos duermen), y un
  archivo nuevo llega como dos avisos (creado y escrito).

## El padre termina a un hijo colgado: pedido 33 (Capitán, 2026-11-06)

El Capitán quiere que Razar se mejore compilando órganos nuevos, con *"legos, pero dentro de los legos mutación libre
de código"*. Un mutante puede quedar en un bucle sin fin, y hasta hoy nadie podía pararlo: revocarle los archivos lo
dejaba remando igual, y eso choca con la regla de ningún bucle que gaste por nada. Este pedido es la jaula, el primer
paso de esa idea.

- **33 terminar** (`a` = el número de un hijo propio). El hijo termina ya, con **código 9** ("lo terminó su padre"),
  por el mismo camino que cuando termina solo: cierra lo que dejó abierto, devuelve sus salas y sale su línea `P<n>`.
  Lo que él esperaba firmar se rechaza.
  - **Termina la línea entera.** También termina todo lo que el hijo lanzó, porque si no un nieto colgado sería un
    agujero en la jaula. Esto es distinto de cuando un padre se va solo: ahí su línea sigue con la sombra.
  - **Respuestas:**

    | responde | cuándo |
    |---|---|
    | 9 | lo terminó ahora |
    | el código con que había terminado | si ya había terminado |
    | −1 | si en ese momento lo está remando otro remero: termina cuando termina su turno |
    | −2 | si no es hijo propio |

  - Es **importante**: si lo pide el hijo de un proceso, espera la firma de su padre, como lanzar.
- **La prueba** (`familia_termina`, con el hijo `eterno`): el padre lanza un hijo que no termina nunca y lo termina.
  Pide otra vez sobre el mismo hijo, mira su estado (19) y pide sobre un número que no es hijo suyo. Da `09 09 09 FE`
  en los tres motores. Antes del pedido, el núcleo moría por tiempo con el hijo remando para siempre.
- **Lo que la prueba no cubre todavía:** que termine la línea entera (un nieto), y el caso −1, con varios remeros y el
  hijo remando justo en ese momento. Ese camino existe en el remero (`P_KILL`), pero ninguna prueba lo ejercita.
- **De paso:** el chequeo de la casa ("todo bucle del núcleo es un while rotado") marcaba tres bucles del centinela
  (`watch_wait`, `watch_name`). Se me pasaron en su commit porque no corrimos la suite, y ahora quedaron en esa forma.

## El presupuesto: pedido 34, un hijo que se pasa termina solo (2026-11-06)

El pedido 33 necesita un padre despierto, y el padre que espera la nota del candidato duerme en su timbre (29). Si el
candidato se cuelga, nunca dice su palabra y el padre duerme para siempre. Por eso la jaula necesita un límite que no
dependa de nadie despierto.

- **34 presupuesto** (`a` = un hijo propio, `b` = cuántas instrucciones más puede remar; 0 = sin límite). Cuando las
  pasa, termina con **código 10** ("gastó su presupuesto"), con su línea entera, al terminar el turno en que las pasó.
  - Responde 0; el código con que había terminado, si ya había terminado; −2 si no es hijo propio.
  - Es importante, como lanzar y terminar.
- **No es un reloj.** No mide segundos ni corre "por las dudas": mide el trabajo del propio hijo, que el núcleo ya
  cuenta (`P_SERVED`). Quien lo fija decide el número relativo a algo medido. Para Razar será el costo del examen de su
  campeón.
- **El padre se entera sin dar vueltas.** Si el hijo termina y no queda nadie que pueda saludar al padre, el núcleo lo
  despierta con −1, como siempre, y el estado (19) dice 10.
- **La prueba** (`familia_presupuesto`, con el hijo `eterno`): el padre le da 10.000 instrucciones y se duerme en su
  timbre. El hijo las gasta y termina; el padre despierta con −1 y lee el código 10. Pide además sobre un número que no
  es hijo suyo (−2). Da `FF 0A FE` en los tres motores.
