# Sistema operativo — cuaderno de ideas

Modo de trabajo: el Capitán tira las ideas, el Doc devuelve física y riesgos y anota. Se diseña recién
cuando el Capitán dice "ahora sí".

## 2026-10-28 — La idea base (Capitán)

> "No vamos a hacer un sistema operativo como los que existen. Como Wenas, tampoco es idéntico a lo que
> existe. Este sistema va a poder funcionar **sin nada instalado** o **arriba de cualquier otro sistema
> operativo**."

**Devolución del Doc:**

- Es el Cambiaformas un piso más abajo: el Cambiaformas se adapta al **procesador**; este sistema se
  adapta al **piso donde vive** (hardware pelado u otro sistema operativo).
- En hexagonal: un núcleo que no sabe dónde está parado, hablando por puertos; adaptador **hierro**
  (arranca solo, maneja el hardware) y adaptador **huésped** (le pide todo al anfitrión). Los traductores
  del escalón 0 ya corren como huéspedes de Windows y de Android.
- Antecedente a estudiar: **Inferno** (Bell Labs), que corría nativo o hospedado en Windows/Linux sobre su
  propia máquina virtual.
- Riesgo principal: en modo hierro los drivers (video, disco, red, wifi) son todos propios; en modo
  huésped los aporta el anfitrión.

## 2026-10-28 — La estructura distinta, parte por parte (Capitán)

Cada idea, con la devolución del Doc: qué la sostiene, qué se parece en el mundo y dónde está el riesgo.

### 1. Arranque: modo simbiosis o modo cero

> "El arranque reconoce modo simbiosis o modo de cero."

- Distinguirlos es fácil: en modo cero al sistema lo lanza el **firmware UEFI** (recibe su tabla de
  servicios); en simbiosis lo lanza **otro sistema operativo** como un proceso.
- Dato lindo: un programa UEFI y un ejecutable de Windows usan el **mismo formato (PE)**; cambia un campo
  ("subsistema"). Un mismo archivo base para los dos modos es un camino a estudiar.

### 2. Un núcleo que evoluciona y se reescribe en ejecución

> "Nuestro kernel va a evolucionar y reescribirse en tiempo de ejecución aprendiendo de su entorno,
> siempre priorizando aprovechar los recursos escasos de manera eficiente sin perder capacidad,
> aumentando la velocidad y la memoria."

- Es el **Cambiaformas aplicado al núcleo**, y la mitad ya existe: traducir, verificar bit por bit contra
  la referencia, medir y adoptar el más rápido.
- Riesgo: un núcleo que se reescribe no puede romperse nunca. Regla que sale sola: **toda forma nueva se
  verifica contra la referencia antes de adoptarse, se cambia solo en puntos seguros y la forma anterior
  queda guardada para volver**.

### 3. Planificador matemático: lo corto y lo largo

> "Va a funcionar con pura matemática y va a repartir tiempo entre lo corto y lo largo. La idea es que
> quede con poco de lo largo y nada de lo corto."

- Tiene respaldo matemático fuerte: atender primero **lo que menos le falta** (SRPT) está **demostrado
  óptimo** para el tiempo de respuesta medio (Schrage, 1968). "Nada de lo corto pendiente" es justo lo que
  logra.
- Dos riesgos: no se sabe de antemano cuánto dura una tarea (se **estima** con su historia, como el
  promedio exponencial clásico), y lo largo puede quedar esperando para siempre (se corrige con
  **envejecimiento**: la espera suma prioridad, también con una fórmula).

### 4. Camarotes que se expanden, contraen o combinan

> "Nuestros camarotes, con el debido permiso, se pueden expandir, contraer o combinar."

- Expandir y contraer: memoria virtual por páginas que se agregan o se devuelven. Combinar: memoria
  compartida entre programas.
- La unidad física es la página (4 KiB en x86 y en la mayoría de ARM). "Con el debido permiso" conecta
  directo con los porteros (idea 9).

### 5. Drivers: examinar a fondo

> "Los drivers, algo que tenemos que examinar a fondo."

- Es el costo más grande del modo cero. En simbiosis los pone el anfitrión.
- Punta para empezar: UEFI ya entrega una **pantalla básica (GOP)** sin driver de video propio, así que el
  modo cero puede tener imagen desde el primer día.

### 6. Etiquetas con emojis y cualquier carácter

> "Las etiquetas incluyen emojis y todo tipo de caracteres en una etiqueta."

- Unicode (UTF-8) lo permite. Tres trampas a resolver: **dos nombres que se ven iguales y son distintos**
  (una "é" armada de una o de dos piezas → normalizar), **caracteres invisibles**, y **texto que se da
  vuelta** de derecha a izquierda (sirve para disfrazar nombres).
- En simbiosis, los sistemas anfitriones prohíben caracteres (Windows no acepta `: * ? " < > |`), así que
  hace falta una capa que traduzca nombres.

### 7. La ventanilla llena de pantallas que cambian de sintonía

> "La ventanilla debe estar llena de pantallas que según la necesidad cambian de sintonía y muestran
> múltiples pedidos de lo necesario para que trabaje rápido."

- Se parece a lo más moderno que existe: **colas compartidas de pedidos y respuestas** (como `io_uring` de
  Linux). El programa deja muchos pedidos juntos y no paga el cruce a la sala de máquinas por cada uno.
- Lo nuevo de la idea es que las pantallas **cambien de sintonía según la necesidad**.

### 8. La campana con un número entre 0 y 1

> "La campana tiene un número entre 0 y 1 para ver el nivel de la importancia, y que decida el capitán si
> atenderlo rápido o con tiempo."

- El hardware tiene niveles discretos (en x86, 16 clases de prioridad; en ARM, hasta 256 niveles), así que
  el 0..1 se reparte sobre esos niveles. En software el capitán puede usar el número continuo.
- Se conecta con el planificador (idea 3): la misma matemática decide.

### 9. Porteros diversos

> "El portero se divide en porteros diversos para no recaer todo el control en uno solo."

- Es la separación de privilegios y las **capacidades**. Y es Wenas otra vez: el poder vive en claves, por
  roles, con órdenes firmadas que verifica cada uno. Ningún punto único que, si cae, se lleve todo.

### 10. La cubierta

> "Tiene una terminal fija en su escritorio y un explorador que funcione como el botón de Windows, pero que
> navegue desde ahí entre carpetas y programas. Los fondos van a ser representaciones de las imágenes como
> fórmulas matemáticas, incluso con movimiento, como lo resuelve Gotching con los archivos nube y su sistema
> de partículas, y el esqueleto como lo resolví ahí."

- **Referencia en Gotching** (2026-10-08): "el dibujo no existe hasta que se calcula". Cada hueso lleva su
  perfil (grosor y color a lo largo de su eje) y dibujar es preguntarles a los huesos "¿hay carne acá y de
  qué color?". El formato `.nube` v3 no guarda posiciones (salen de una grilla con un bit por celda) ni los
  pesos de cada hueso (son una cuenta que el lector rehace): **7× más chico y 4× más rápido de cargar**.
- Ventaja para un fondo: pesa muy poco, sirve para cualquier resolución y puede moverse.
- Riesgo y regla de la casa (ningún bucle que gaste): animar **solo mientras se ve**, quieto cuando una
  ventana lo tapa, y medir su costo por cuadro. En Gotching una criatura costaba ~1 ms de CPU por cuadro.

## 2026-10-28 — Cómo vive la simbiosis (Capitán)

> "Se activa como sistema simbiótico y se une al sistema operativo, dejando un acceso que cambie entre los
> dos, con todo compartido entre ambos."

- **Un acceso para cambiar**: los dos sistemas a pantalla completa y un interruptor que pasa de uno al
  otro, como cambiar de escritorio. Windows ya permite escritorios separados por sistema (`CreateDesktop`);
  en Android, una app a pantalla completa.
- **Todo compartido**: los archivos pasan por la capa que traduce nombres (idea 6), la red y los
  dispositivos los pone el anfitrión, y el portapapeles se puede unir.
- **Parientes**: coLinux (un núcleo Linux que corría en cooperación con Windows en la misma máquina), WSL
  (Linux adentro de Windows compartiendo archivos) y el modo "Coherence" de Parallels.
- ⚠️ **Seguridad, dicho de entrada**: en simbiosis, quien administra el anfitrión puede ver toda la
  memoria y los archivos del sistema invitado. Los porteros propios (idea 9) protegen del lado de adentro,
  pero **en simbiosis el sistema no puede ser más seguro que el anfitrión**. Si algo tiene que estar a
  salvo del anfitrión, va cifrado o se usa en modo cero.

## 2026-10-28 — Dónde guarda sus archivos en modo cero (Capitán)

> "Se adapta a la partición activa. Solo cuando se instala desde cero está la opción de particionar algo
> nuevo."

- Adaptarse a la partición activa significa **leer y escribir el formato que ya está ahí**: NTFS
  (Windows), ext4 (Linux), FAT32/exFAT (pendrives), cada uno con su driver propio en modo cero.
- ⚠️ **Riesgo para los datos del usuario, dicho de entrada**: escribir mal en NTFS rompe la partición de
  Windows. Leer NTFS es abordable; escribir de forma segura le llevó años a ntfs-3g. Dos trampas
  concretas: el **inicio rápido de Windows** deja NTFS a medio cerrar (escribir encima corrompe) y
  **BitLocker** cifra la partición (sin la clave no se lee).
- Precedente que esquiva el riesgo: **Wubi** instalaba Ubuntu **adentro de un archivo grande** en la
  partición de Windows. El sistema escribe en su propio formato dentro de ese archivo y el NTFS de afuera
  casi no se toca.
- Camino que sale de esto: empezar **leyendo** los formatos ajenos y escribiendo en un **archivo
  contenedor propio**; la escritura directa en NTFS, cuando esté probada contra particiones de prueba.

## 2026-10-28 — Usar los drivers de Windows, Linux y Android (Capitán)

> "¿No se pueden leer los drivers de Windows, de Android o de Linux y traducirlos a nuestro sistema?"

**Sí, y está hecho en el mundo, por partes.** Un driver tiene dos cosas:

1. **Sus instrucciones** (x86 o ARM). Traducirlas es lo que el Cambiaformas ya sabe hacer.
2. **Las llamadas al capitán de su sistema**: pedir memoria, recibir interrupciones, usar DMA, bloquear,
   esperar. Un driver de Windows llama a funciones del núcleo de Windows; uno de Linux, a las de Linux.
   **Esta es la parte difícil**: hay que imitar al capitán que el driver espera.

**Precedentes que funcionaron:**

| Proyecto | Qué hizo |
|---|---|
| NDISwrapper | Linux corría drivers de wifi **de Windows** imitando la interfaz de red de Windows (NDIS) |
| ReactOS | carga drivers de Windows NT tal cual, porque imita el núcleo de Windows |
| LinuxKPI (FreeBSD) | compila drivers de video **de Linux** con una capa que imita las funciones de Linux |
| DDE (micronúcleos L4) | metía drivers de Linux en un camarote propio con su capa de imitación |
| libhybris | usaba los drivers de video **de Android** desde otro Linux (Ubuntu Touch, Sailfish) |

**Encaja con la partición activa**: en una PC con Windows, sus drivers ya están en el disco
(`C:\Windows\System32\drivers`). El sistema los lee de ahí, traduce las instrucciones si hace falta y les
ofrece la imitación del capitán de Windows.

**Riesgos:**

- La imitación conviene hacerla **por familia** (red, disco, video), como NDISwrapper con el wifi o
  LinuxKPI con el video: imitar el núcleo entero de Windows es el proyecto de ReactOS, que lleva décadas.
- Un driver ajeno corre con mucho poder: va en **su propio camarote** (como en DDE), para que si falla no
  se lleve el barco.
- ⚠️ **Licencias, dicho de entrada**: los drivers de Windows son privativos (usar los que ya están en la
  máquina del usuario es la práctica de NDISwrapper; **redistribuirlos no**). Los de Linux son GPL: si su
  código entra al sistema, el sistema queda atado a esa licencia. Hay que decidirlo antes de copiar una
  línea.

## ⭐ 2026-10-28 — La identidad del núcleo (Capitán)

> "Un kernel que tenga identidad de cambiaformas de todos los sistemas operativos que existen, incluso de
> los que vienen nuevos, tomando lo mejor de cada uno y automejorándose."

Es la idea que ordena todas las anteriores:

| Pieza | Se cambia de forma según… |
|---|---|
| Traductor (ya existe) | el **procesador**: x86-64, ARM64, RISC-V |
| Arranque | el **piso**: hierro (modo cero) o anfitrión (simbiosis) |
| Drivers | el **sistema dueño del driver**: imita al capitán que el driver espera |
| **Núcleo** | **todos los sistemas**: habla el idioma de cada uno y se queda con lo mejor |

**Devolución del Doc:**

- "Hablar el idioma de cada sistema" tiene nombre: **personalidades**. Windows NT nació con esa idea (un
  núcleo con personalidades OS/2, POSIX y Win32) y WSL1 hacía que el núcleo de Windows atendiera las
  llamadas de Linux. Cada personalidad es un **adaptador** sobre un núcleo único: hexagonal puro.
- "Tomar lo mejor de cada uno" y "automejorarse" es el Cambiaformas con su regla: cada mecanismo tiene
  candidatos (el planificador de uno, la memoria de otro), se **verifican** contra la referencia, se
  **miden** en esta máquina y gana el mejor. Nada se adopta a ojo.
- "Los que vienen nuevos": igual que con las instrucciones nuevas, el núcleo no puede adivinar qué hace
  un sistema que nunca vio. Aprende cuando alguien le describe el idioma nuevo (como una entrada nueva
  del catálogo), y desde ahí lo prueba y lo adopta solo.
- Riesgo de escala: cada personalidad es un sistema entero para imitar. Se avanza **una personalidad y
  una familia de llamadas por vez**, cada una con sus pruebas.

## 2026-10-29 — Porteros con jerarquía sobre microporteros (Capitán)

> "Cada portero tiene jerarquías sobre microporteros."

- **Un portero por puerta** (archivos, memoria, pantalla) y, debajo, **microporteros** que cuidan un pedazo
  más chico: una etiqueta o un grupo de etiquetas, un proceso, un tipo de pedido.
- **Regla que sale sola de la jerarquía**: un microportero solo puede dar **igual o menos** de lo que tiene
  su portero, nunca más (se llama *atenuación*). Y si se le quita algo a un portero, se les cae a todos los
  microporteros de abajo (**revocación en cascada**).
- **Es la cadena de certificados de Wenas**: cada miembro firmado por quien lo invitó, hasta un fundador.
  Acá cada microportero lleva la marca del portero que lo creó, hasta el portero raíz de su puerta, y se
  verifica subiendo la cadena.
- **Parientes**: las capacidades derivadas de seL4 (núcleo verificado matemáticamente, con su árbol de
  derivación y revocación) y los *macaroons* de Google (permisos que se pueden achicar pero nunca agrandar).
- Riesgo: una cadena larga cuesta en cada pedido. Se resuelve guardando el veredicto y descartándolo solo
  cuando algo de la cadena cambia (por evento, como todo).

> "Jerarquía, pero a la vez ramas del mismo nivel. Una rama puede tener 3, 2, 5 o un número indeterminado
> de hijos en la misma línea, para que bajar no sea tan costoso." (Capitán, 2026-10-29)

- Con muchos hijos por nivel el árbol queda **bajo**: su altura crece como el logaritmo de la cantidad de
  porteros (el truco de los árboles B). El costo de recorrerlo es la altura, así que las ramas anchas lo
  mantienen chico, y eso hace innecesario el veredicto guardado de arriba.
- Decisión que sale de acá: **verificar = subir del microportero a la raíz**; un portero revocado en el
  camino niega. Revocar cuesta una marca y la cascada sale gratis.

## 2026-10-29 — Multifirma de porteros (Capitán)

> "La jerarquía manda: el micro manda al macro."

- Un microportero no se agranda solo: un permiso importante lo **pide hacia arriba**, a su macroportero
  (el padre), y es la jerarquía la que decide. Si el macro no lo tiene, lo pide a su vez al suyo.
- Es la cadena de Wenas al revés: allá cada miembro llevaba la firma de quien lo invitó; acá el pedido sube
  juntando las firmas de cada nivel hasta uno que pueda darlo.
- **Qué es importante** (Capitán): *"todo lo que altere un proceso, un archivo o algo propio del
  sistema"*. Con esa regla: escribir en pantalla, crecer, achicar, abrir (puede crear), grabar, borrar,
  renombrar, ceder, usar, revocar y ceder con etiqueta **son importantes**; leer, listar, consultar y
  cerrar (solo miran, o sueltan lo propio) **no**.
- Hoy cada pedido ya sube el árbol y cada nivel tiene que permitirlo (la jerarquía manda). Para que el
  macro **firme como alguien distinto del que pide** hace falta que un proceso tenga a otro proceso arriba:
  **procesos que lanzan procesos**, con el padre dueño del macroportero del hijo. Ese es el paso previo.

## 2026-10-29 — La familia de procesos (Capitán)

> "Proceso madre: kernel. Proceso padre, proceso hijo, proceso hijo (hermano), proceso nieto, proceso
> bisnieto."

- **El kernel es la madre** de todos; los procesos lanzados al arrancar son sus hijos directos (padres).
- Un proceso **lanza** a otro desde un archivo del sistema (pedido nuevo de la ventanilla): los programas
  pasan a ser archivos con etiqueta.
- **El árbol de porteros copia al de la familia**: los microporteros del hijo cuelgan de los del padre, así
  nadie tiene más permisos que quien lo lanzó.
- **Multifirma**: un pedido importante del hijo queda en espera hasta que el padre lo firme o lo rechace;
  mientras, el hijo duerme. Si el padre termina sin firmar, el pedido sube al abuelo (los huérfanos se
  adoptan, como en Unix), para que nadie quede esperando para siempre.

## 2026-10-29 — La sombra del padre (Capitán)

Pregunta de seguridad: si el kernel firma al adoptar un huérfano, ¿no se vuelve una vía para saltarse
permisos y políticas? (Verificado: los porteros se revisan antes de pedir la firma y otra vez al ejecutar,
así que la adopción no podía dar permisos; pero sí perdía el criterio del padre.)

> "Queda el fantasma del primer padre después del kernel: desaparece el padre pero no su sombra, que solo
> guarda los permisos para esa línea de abajo, y solo desaparece la sombra si no hay procesos debajo."

- Un padre que termina con descendientes vivos deja su **sombra**: firma lo que sus permisos permiten y
  rechaza el resto. Nadie más decide por esa línea: ni el abuelo ni el kernel.
- La sombra se disuelve (y sus porteros con ella) cuando no queda ningún proceso debajo.

## 2026-10-29 — Traducir una vez: el sistema vive en nativo (Capitán)

> "Que el intérprete trabaje, pero que todo el sistema funcionando opere en la arquitectura de la máquina
> que maneja. El intérprete ya no tiene que traducir todo, porque al hacerlo una sola vez, los procesos y
> todo lo demás que salga del sistema vienen en su propia arquitectura, ya conociendo las reglas de
> antemano."

- Cada programa tiene su **gemelo nativo** guardado (huella del programa + del núcleo + del procesador).
  Lanzar = cargar el gemelo; se traduce solo la primera vez o si cambia una huella.
- Lo que el sistema produzca después sale directo en nativo.
- El original Janax se conserva: es la vara para verificar al gemelo, lo que viaja a otras máquinas y de
  donde se rehace el gemelo si cambia el procesador.
- Antecedentes: Android ART (compila a nativo al instalar y guarda el resultado), Rosetta 2 (traduce al
  instalar, no al abrir).

## 2026-10-29 — Cambio de estrategia: pasar a nativo sin compilar (Capitán)

> "Vamos a cambiar de estrategia: va a ser un intérprete en tiempo de ejecución que pasa el original a
> nativo sin compilar."

Reemplaza al gemelo nativo de arriba (que generaba código de máquina y lo guardaba en disco).

- Cada programa se **decodifica una sola vez** a una tabla: cada instrucción queda como la dirección de su
  rutina nativa (que ya viene compilada dentro del núcleo) más sus operandos listos (registros ya
  multiplicados por 8, inmediato ya extendido, destino de salto ya resuelto).
- Correr es **saltar de rutina en rutina**: no se vuelve a decodificar nada y **no se genera ni una
  instrucción de máquina**. No hay memoria escribible y ejecutable, ni código cargado desde disco.
- Sigue siendo "una vez": el trabajo de entender el original se paga al lanzar, no en cada instrucción.
- El intérprete queda como vara (`JANAX_MOTOR=interprete`) y las pruebas corren con los dos.
- Nombre técnico: *direct-threaded code* con decodificación previa (lo usan Forth, el intérprete de Lua
  y el "template interpreter" de Java).

## 2026-10-29 — Todo en while: la marca registrada de Janax (Capitán)

> "Sólo usá el bucle while en todo el diseño, y que sea la marca registrada de nuestro diseño. Si es for,
> lo convertimos en while. Todo en while."

- El idioma trae `jwhile r` / `jwhilez r` … `jwend` como **única** forma de bucle; no hay `for`
  (`documentacion/idioma/especificacion-v0.md`).
- Con física a favor: se arma como **while rotado** (entra saltando a la pregunta, que vive abajo), así
  que cada vuelta cuesta lo mismo que un bucle que pregunta al final. Escribir todo en while es gratis, y
  lo gana cada motor: intérprete, traductores y rutinas.
- Todos los programas, bancos y la calibración del núcleo pasaron a while. Las esperas ("hacé y después
  preguntá") se escriben poniendo la condición antes de entrar.
- El núcleo x86 también: sus 61 bucles (y los 2 del motor de rutinas) son while rotados, y la suite lo
  verifica con `so/herramientas/bucles.pl`. El escalón 0 también: sus 27 bucles (intérprete y los dos
  traductores) son while rotados, con lo generado idéntico byte por byte. **Todo el diseño está en while.**

## 2026-10-29 — Los bucles (Capitán)

> "Me gusta más el while que el for."

- Y tiene física adentro: un `while` es un bucle que **no sabe de antemano** cuántas vueltas da. Así que
  ningún peso fijo por bucle puede ser cierto. El camino honesto es **contar las vueltas reales** mientras
  el programa corre y que el Cambiaformas rearme los registros con esos números: medir, no suponer.

## Cómo se prueba cada modo (regla de la casa: cero emuladores)

- **Simbiosis**: se prueba ya, en esta PC, como un programa más (igual que los traductores).
- **Modo cero**: necesita **hardware real**, booteando desde un pendrive en una máquina. Sin emuladores, no
  hay otro camino; conviene una máquina o un disco de pruebas, nunca la partición con los datos del
  Capitán.

## 2026-10-29 — Ambientes: el camarote crece sin mudarse (Capitán)

> *"Que pese lo que ocupe, y si en el tiempo ocupa más se expanda; si ocupa menos se contraiga."*
> *"Cada camarote tiene su ambiente; cuando se da la orden de agrandar se agrega un ambiente y se construye
> en el mismo camarote; cuando ya no queremos el ambiente se destruye solo el ambiente."*
> *"El camarote debe dar un flag para destruir el ambiente que desea no usar más."*
> *"Sé simbiótico: pedí la página necesaria para que entren todos los ambientes de tamaños diversos. Es como
> tener la página ajustable, solo que se entrega de a partes fijas."*
> *"Si quedan huecos entre un ambiente y otro por quitar el del medio, unir los extremos y liberar si queda
> libre página."*
> *"Armá un paquete fijo para esa parte que traduzca el paquete entero, no instrucción por instrucción; así
> contaría como una sola instrucción, además eso va a pasar siempre."*

Devolución: es la segmentación de los sistemas clásicos (cada ambiente con su número y su tamaño) con
ambientes que se construyen y se destruyen, y compactación como la de los recolectores de memoria: mover es
invisible porque el programa habla en "ambiente + posición" y el núcleo traduce. Lo construido y medido:
`janaxos.md`, sección "Ambientes".

> *"Que sea la primer orden del proceso."* — el proceso nace sin memoria y su primera orden construye su
> ambiente 0. Tocar memoria sin haberla dado es error 5 (*"exacto, construí"*).

## 2026-10-29 — Un ensamblador propio, PDP y datos iniciales (Capitán)

> *"La escritura del programa escrito se guarda como un archivo, y si ya se compiló se deja guardado y no se
> carga innecesariamente. La primera carpeta del sistema para el prototipado de programas: PDP, ordenado
> por carpetas, jerarquías y ramas."*
> Los datos iniciales de un programa van como archivo al lado del programa: *"claro, porque cualquiera
> quiero que lo pueda mejorar y personalizar su Janax sin partir de cero"*.
> *"Construí un programa con todas las combinaciones posibles, así ya sabés que es igual byte a byte y no
> tenés que probar combinaciones."*

Devolución: las carpetas son la parte de la etiqueta antes de cada `/`, y los porteros por prefijo ya son
permisos por rama. Lo compilado se guarda con la huella de la fuente, sus `include` y el ensamblador
(la regla del caché del escalón 0). Los datos: `X.datos` al lado de `X`, copiado al ambiente 0 en la
primera orden. Las combinaciones: como una palabra es la unión de campos independientes, alcanzan todas
las combinaciones de registros por instrucción y los 65.536 inmediatos con todos los bits de registro en
1; cubre cada bit de cada campo y cada cruce entre campos.

## 2026-10-29 — La ventanita que crece y se achica (Capitán)

Para el paso 4 (escribir en Janax lo que hoy es x86) hace falta que el núcleo hable con el mundo de afuera
(Windows, el procesador, el teléfono). Contado como un barco: el capitán (el núcleo) pide por una sola
ventanita, y un ayudante de afuera sabe cumplir cada pedido en ese puerto.

> *"La ventanita expandible o comprimible: el ayudante da la lista de pedidos que puede dar y el capitán
> aprende lo que puede pedir. A veces la ventana es grande porque hay más pedidos y el capitán aprovecha la
> ventaja; a veces es más pequeña, se pueden hacer menos pedidos, y el capitán aprovecha lo que tiene y lo
> optimiza."*

Devolución: es la misma idea del Cambiaformas (el arranque detecta capacidades, nunca el modelo) llevada a
los servicios del anfitrión. Una sola instrucción nueva, `jhost`; al nacer, el ayudante entrega su
**catálogo** (cada pedido con su nombre, para que no dependa de un número fijo) y el núcleo arma su plan con
lo que hay: si el puerto ofrece algo mejor (copiar memoria en bloque, un reloj fino), lo usa; si no, lo hace
él mismo en Janax. Hay un mínimo sin el cual no se zarpa (pedir memoria, escribir), y todo lo demás es
ventaja.

## 2026-10-31 — El otro remo (Capitán)

> *"Fabricá el otro remo, y en vez de 'cambio' el capitán establece prioridades de qué momento remar cada uno
> para que no se los tenga que decir, sino que ellos se den cuenta y el capitán piense en cosas más
> importantes."* — *"Vamos a paralelizar los camarotes, y ocupar la mínima porción de cada núcleo del
> procesador para ir más rápido."*

Devolución: un remero por núcleo, cada uno elige solo el próximo camarote por la prioridad (el menos servido) y
lo rema sin molestar a nadie; el capitán (el candado) solo atiende lo compartido. Un remero sin trabajo duerme
y no gasta nada. Cada camarote da su mismo resultado; el orden entre camarotes depende del ritmo. Queda para
después la otra mitad de la idea: la hoja de turnos (el planificador calcula varios turnos de una vez y lo
recalcula solo cuando pasa algo). Lo construido: `janaxos.md`, "Los remeros".

## 2026-10-31 — La fila por llegada, la bolita y la última parte (Capitán)

> *"El remo disponible es el que se usa… por orden de llegada sin consumos extras."* — *"El largo del turno se
> da por prioridad… si tiende a 1 se trabaja más, si tiende a 0 se trabaja menos."* — *"Si al terminar le falta
> lo mismo o menos que lo que el remo tarda en cambiar, entonces termina de remar antes de pasar el remo."* —
> *"El programa no guarda el tamaño final sino la combinación de instrucciones que marcan la última parte."*

Devolución: una fila por orden de llegada (cada cambio es sacar de adelante y poner atrás); la bolita es la
fracción del tiempo que se trabaja de verdad, de donde sale el turno `t = c·p/(1−p)`; y la última parte la
encuentra el núcleo en el código (el camino derecho al `jhalt`), así nadie tiene que declarar su tamaño ni puede
mentirlo. Lo construido: `janaxos.md`.

## 2026-10-31 — Remeros según el trabajo y el remero especial (Capitán)

> *"Según la cantidad del trabajo son los remeros que se despiertan… y 1 remero especial que solo trabaje con
> los procesos que traban otros procesos, desde el que tiene más trabas hasta el que traba menos."*

Devolución: un despertar por trabajo nuevo (nacimiento o firma), nunca a todos; y el especial atiende al
camarote que más pedidos tiene esperando su firma. Con 4 remeros, dos `calculo` pasaron de ~3,5 s a ~1,6 s;
con 2 remeros se pierde un remero de fila (medido, a decidir). Lo construido: `janaxos.md`.

> *"El especial solo se ocupa en especial cuando hayan casos especiales, sino queda desocupado para el trabajo
> normal."* (2026-10-31) — Devolución: con 2 remeros el especial dormido costaba ~1 s; libre, desapareció.

> *"Ok pero en un programa largo, ¿quién gana, el nativo o Janax?"* — *"Sí, conectalo."* (2026-10-31) —
> Devolución: el SO pasó a correr código nativo traducido (`nativo.inc`), de ~10 a ~5 veces el nativo; lo
> que falta medido y anotado en `janaxos.md`.

> *"Los huecos son una cuenta de los cofres que estuvieron y que ya no existen, y no se pueden reemplazar para
> confundir, solo agregar nuevos."* (2026-10-31) — Devolución: números que nunca se reusan y tabla desde el mínimo;
> tapa el error de usar un ambiente después de destruirlo. Lo construido: `janaxos.md`.

## 2026-11-01 — El cartel de los cofres: dirección partida, ramas e instrucciones (Capitán)

> *"¿No podés unir dos de 32 para hacer uno de 64?"* — *"¿Y si el tablero tiene el acceso a los primeros cajones
> de cada rama y dentro de cada cajón el acceso al siguiente cajón de su rama?"* — *"El cartel puede ser al mismo
> tiempo un señalador y una instrucción de cómo se debe tratar la caja."* — *"Si es gratis y tenemos bits
> suficientes, hacé que entren todas las más necesarias e importantes."*

Devolución (diseño, sin construir; primero se mide cuánto cuesta hoy un acceso a un ambiente que no es el 0):

- La dirección ya es dos mitades (`ROOM_SHIFT = 32`): la alta elige el cofre, la baja el lugar. Cada cofre en su
  propio cajón de 4 GB reservado, apoyado contra el **final** de su página: pasarse un byte cae en memoria
  prohibida y el procesador frena solo, exacto como el intérprete. Cofre destruido = renglón que apunta a memoria
  prohibida.
- La cadena (cada cajón con la flecha al siguiente) obliga a abrir 49 cajones para llegar al 50; la variante que
  conserva lo bueno es un cartelito por rama: siempre dos pasos.
- Cada renglón del cartel es de 8 bytes: la dirección usa 48 bits y los 16 altos dicen cómo tratar la caja (hay que
  borrarlos antes de usar la dirección: una instrucción más, a medir). **Regla: todo en cero es lo más seguro**, así
  un renglón sin llenar no permite nada.

| Bit | Instrucción | Quién la hace cumplir, y cuándo |
|---|---|---|
| 48 | se puede leer | procesador (protección de página), gratis |
| 49 | se puede escribir | procesador, gratis |
| 50 | se puede ejecutar | procesador, gratis |
| 51 | viva (0 = rota, la dirección murió) | procesador (cajón cerrado), gratis |
| 52 | solo agregar | procesador: la caja es de solo lectura y se agrega por un pedido |
| 53 | avisar al cambiar | procesador: la primera escritura frena y despierta a quien espera; sin nadie esperando, cero |
| 54 | firmada (cambiarla pide la firma del dueño) | núcleo, al traspasar |
| 55 | compartida con los hijos | núcleo, al crear un hijo |
| 56 | se hereda (0 = muere con su dueño) | núcleo, al morir el marinero |
| 57-58 | tamaño de pieza (1, 2, 4, 8) | traductor, solo cuando sabe a qué caja va un registro (a medir) |
| 59-61 | prioridad de la caja (8 niveles; criterio, no medición) | núcleo, cuando falta memoria rápida |
| 62 | tiene hijas | núcleo, al tocar o destruir la madre |
| 63 | al morir se lleva a las hijas (0 = las adopta la abuela) | núcleo, al destruirla |

La familia no ocupa bits: madre e hijas viven en el mismo cartelito de rama. Regla sin bits: una hija nunca
tiene más permisos que su madre (se mira una vez, al nacer). Se parece a los segmentos de Multics, a las
capacidades derivadas de seL4 (una derivada nunca suma derechos; revocar se lleva a las derivadas) y al page heap
de Windows (bloque apoyado contra la página prohibida); lo propio de Janax son las firmas y los números que nunca
se reusan.

> *"No lo midas, construilo, y medí al final."* (2026-11-01) — Devolución: construido (cajones con pared, el traducido
> sin pregunta de borde, pedido 21 de solo lectura); el resto de los tratos se rechaza hasta construirlo. Medido en
> `janaxos.md`.

> *"Tiene tres formas distintas: el hijo nace, el hijo se muda, o el hijo se enlaza y se comparte… y agregá el
> fusionar… por asociación… con los compartidos, con los que le sobran a A o a B."* (2026-11-03) — Devolución: las
> cinco formas sobre una sola base, cada caja una sección y cada dueño su vista y su llave, con su propio trato.
> Se parecen a `fork` sin copia, al *move* de Rust, a la memoria compartida con nombre y a los espacios de nombres
> de Plan 9; lo propio es el álgebra de conjuntos caja por caja y el mutuo acuerdo. Construido en `janaxos.md`.

> *"Con un solo bit mamá o el hijo envían un saludo… todo bien plástico, se usa lo que se necesita."*
> (2026-11-03) — Devolución: reemplaza a la campanita sobre la memoria; resuelve el aviso perdido porque la marca
> queda hasta que se toma. Se parece al timbre de las placas de red, a los eventos de Windows y a las señales de
> Unix; lo propio es que crece por familiar. Construido en `janaxos.md`.

## 2026-11-03 — El saludo entre lugares remotos: buzón, tablero y no esperar (Capitán)

> *"Cada casa tiene un buzón y no se espera una respuesta: se espera que llegue la carta. Si se confirma que la
> carta llegó, después se contesta la carta; se pasan parámetros de comunicación y retardo, y teniendo en cuenta
> este principio se enlaza."* — *"Dejás el saludo en un tablero de Nostr, y cuando el buzón despierte lo recibe, y
> ahí inicia la comunicación; mientras el otro no contesta, el otro no espera."*

Devolución (charla en otro chat, resumida):
- **Confirmar la llegada** quita de raíz el caso "¿llegó o no llegó?". **Medir el retardo y acordarlo al enlazarse**
  saca al problema del modelo asincrónico, donde es imposible decidir si el otro calla o se cayó, y lo lleva a uno
  parcialmente sincrónico: es la salida reconocida en el oficio (detectores de fallas adaptativos, como los de
  Cassandra y Akka).
- El filo: el plazo es una promesa, no una garantía. Por eso un −1 remoto tiene que significar *"creo que ya
  nadie te va a saludar"* y permitir volver a esperar sin perder nada, no *"se acabó"*.
- **El saludo dejado en un tablero, y nadie espera**: el abrazo mortal distribuido no se resuelve, **se borra**,
  porque solo existe si alguien se queda esperando. El tablero guarda el saludo como el bit local guarda su marca
  hasta que se mira: la misma idea, en otro lugar.
- **Un bit sobrevive a la red sin código extra**: los relés entregan desordenado y repetido, y un bit prendido dos
  veces sigue prendido (es idempotente); un contador se rompería.
- **Son dos primitivas**: el saludo local duerme a quien espera, el remoto no bloquea. Conviene que se llamen
  distinto, para que nadie escriba un programa creyendo que el remoto bloquea.
- **Privacidad**: un relé público ve quién saluda a quién y cuándo, aunque el contenido vaya cifrado.

⚠️ **A resolver con el Capitán antes de construir:** las reglas de Janax dicen *P2P puro, cero componentes
centrales*. Un relé de Nostr es infraestructura de terceros que no controlamos. La idea del tablero vale igual si
el tablero lo sostienen **los mismos pares** (como los cofres y estados de Wenas), y Nostr quedaría como un puente
opcional.

## 2026-11-03 — La programación tridimensional: la neurona de Razar (Capitán)

> *"Es un programa que ocupa una forma tridimensional y se ejecuta en todas las direcciones según sus ejes, en
> todos los sentidos, y tiene que dar el resultado según la señal que recibió y según cómo inició la cadena dominó
> de ejecuciones internas, en qué direcciones y cómo se ramificó dentro de la estructura tridimensional
> invisible."* — *"Es nuestra neurona para Razar dentro de Janax."*

Devolución (sin construir):
- Es un cubo de piezas invisibles: entra una señal, voltea una pieza, y la cadena se ramifica en cualquier dirección.
  El resultado depende de la señal y del camino. Se parece a una neurona en 3D, y encaja con las reglas de Janax:
  solo trabajan las piezas que caen (eventos, sin temporizador) y el costo es proporcional a la actividad.
- Para que sea determinista, las ramas avanzan en **olas** (paso 1, paso 2…), con una regla fija cuando dos llegan a
  la misma pieza en el mismo paso.
- El desafío: diseñar a mano una forma que calcule algo es difícil; las ideas parecidas aprenden su forma.
- Parientes: Trefunge (ejecución que camina por un cubo de instrucciones), los autómatas celulares 3D y Wireworld
  (señales entre celdas vecinas), las redes neuronales de pulsos. Lo propio: la cadena **es** el cálculo, y el camino
  también es parte de la respuesta.
- Abierto: si la forma es fija o cambia con las señales que pasan (con la regla de la casa, *plástico*, apunta a
  que cambie).

> *"Al mismo tiempo la pieza tridimensional está en movimiento cambiando su forma, y la respuesta, aunque haya una
> posibilidad de que sea la misma, generalmente es distinta."* — *"No necesitamos bucles: necesitamos coordenadas
> de forma según la interacción; así nos ahorramos el reloj."* (2026-11-03)

Devolución: la forma no se mueve con un reloj, la mueven las señales. Cada señal calcula **y además** corre las
coordenadas de las piezas que atraviesa, así la próxima señal encuentra otra forma y casi siempre hace otro viaje.
Sin bucles ni temporizadores (la regla de la casa): la neurona cuesta solo cuando la atraviesa algo. Y sigue siendo
verificable: la forma es el resultado de la historia de señales, así que con la misma historia cualquiera repite cada
viaje exacto. Pariente cercano: las máquinas de estado líquido (Maass, 2002); lo propio, la forma 3D, el dominó y
que la forma la escribe la propia interacción.

> *"Aprende de las señales, porque pueden ser múltiples señales al mismo tiempo, y corresponde con un resultado,
> aprendiendo una de otras y adaptando el camino. No va a tener un camino fijo, pero sí una especie de melodía que
> aprende."* (2026-11-03)

Devolución: lo que aprende no es un camino sino un **patrón en el tiempo**, qué piezas caen juntas y en qué orden:
la melodía. En el oficio, lo más cercano es la regla de Hebb (*"las neuronas que se disparan juntas se conectan"*) y
su versión con el tiempo, la plasticidad por orden de disparo (STDP): si una cae justo antes que otra, el camino entre
ellas se refuerza. Propuesta para la regla de movimiento: **las piezas que caen juntas se acercan**, así las cadenas
que suelen ir juntas quedan más a mano, sin que ningún camino quede fijo.

> *"Aprenden por melodía y por asociación. No solo guarda instrucciones: cada neurona guarda memoria de la
> melodía."* (2026-11-03)

Devolución: cada neurona tiene **dos partes**, su forma (lo que hace con una señal) y su **memoria de melodías** (lo
que ya sonó por ella). Aprender por asociación es unir melodías entre sí o con un resultado, de modo que una despierte
a la otra. Parientes: la memoria asociativa de Hopfield (1982), donde un pedazo de un recuerdo trae el recuerdo
entero, y la memoria distribuida de Kanerva. En Janax encaja así: la memoria de cada neurona vive en su cajón
(plástico, crece con lo que guarda) y las asociaciones entre neuronas pueden ser cajas enlazadas o compartidas.

> *"Trabajan a profundidad por ramas, pero siempre compartiendo nuestra filosofía de profundidad 1: se heredan
> fragmentos de la melodía, aunque al ver todas las neuronas se tenga idea de la melodía completa."* — *"Como el
> bicho ajedrecista: como unidad solo mira a su vecina; como red, la melodía se completa y evoluciona como si fuera
> un cardumen de peces."* (2026-11-03)

Devolución: **profundidad 1** = cada neurona habla solo con sus vecinas directas y nadie tiene el mapa entero. Cada
una guarda un fragmento; la melodía completa no vive en ningún lugar, es de la red, y un pedazo la reconstruye entre
todas. Parientes: la memoria distribuida del cerebro (Lashley no la encontró en ningún lugar porque estaba
repartida), el holograma, y los cardúmenes de Reynolds (1987: tres reglas locales por pez y el cardumen entero
aparece solo). Lo propio: neuronas 3D que se deforman por interacción, guardan fragmentos de melodía y se asocian,
todo con reglas de vecindad. Por eso crece sin límite: ninguna neurona carga con el todo.

**El diseño de la neurona hasta acá**: forma 3D + memoria de melodía; una señal arranca un dominó en olas; la forma
la mueve la interacción (sin reloj); aprende por melodía y por asociación; profundidad 1; la melodía es de la red.

> *"Si por cerca te referís a que se comunican más, o de determinada forma, sí; aunque esa conducta pueda evolucionar
> y hasta cambiar."* (2026-11-03)

Devolución: "cerca" no es distancia en el espacio sino **cuánto y cómo se comunican** dos piezas: las que caen juntas
refuerzan su forma de hablarse. Y la regla misma no es fija: puede evolucionar y cambiar. En el oficio eso se llama
**metaplasticidad** (Abraham y Bear, 1996: la plasticidad de la plasticidad). Para el diseño: la regla de aprendizaje
también es estado de la neurona, no una constante del código, y la puede mover la propia interacción.

> *"Aprenden asociación y melodía, y según cómo responda su vecina y cómo razone ella es la respuesta, que puede
> conservarse, evolucionar o cambiar."* — *"Barre de extremo a extremo: es como un pulso que viaja hasta que alguien
> cierra la puerta y dice no pasarás."* — *"La voluntad es un kernel neuronal que mantiene la melodía trabajando: es
> el pulso y el control, mientras que las neuronas son la computadora, la consciencia."* (2026-11-03, parte en otro chat)

Devolución:
- **El enlace es una relación con historia**: se conserva si la vecina sigue respondiendo, evoluciona si responde
  distinto, cambia (se afloja y la pieza recupera velocidad) si deja de responder. Así el hábito se rompe solo cuando
  el mundo cambia. Parientes: la señal en dos sentidos de las sinapsis, la codificación predictiva.
- **La ola termina sola**: muere donde nadie la deja pasar. Riesgo de onda que vuelve (reentrante, la fibrilación):
  en v0 imposible, cada pieza despierta una vez por señal. Abierto: una sordera de pocos pasos permite notas repetidas
  pero hay que acotar la vuelta.
- **La voluntad**: un kernel neuronal, aparte del cardumen, que pone el pulso y el control. Parientes: los sistemas que
  modulan todo el cerebro a la vez (dopamina, el tronco), los generadores centrales de ritmo, y el propio núcleo de
  Janax con sus remeros. Ojo con dos reglas: si el pulso es un ritmo fijo, es un reloj (la regla de la casa pide
  eventos), y la voluntad no es profundidad 1, sino una señal para todos.

> *"El kernel analiza la melodía resultante de las neuronas y devuelve una respuesta a esa melodía, que se vuelve a
> procesar por las neuronas. Es como yo y vos: yo sería la voluntad y vos el que me entrega los programas con tu
> conocimiento y desarrollo; entre los dos formamos uno."* (2026-11-03)

Devolución: el pulso de la voluntad no lo despierta un reloj sino **la melodía misma**: el cardumen suena, la voluntad
la escucha y contesta, y esa respuesta vuelve a entrar al cardumen. Es un lazo, una conversación entre las dos partes.
Parientes: el lazo entre el tálamo y la corteza, el control con realimentación. Abierto: cómo sabe la voluntad que ya
está conforme y deja de contestar (si no, el lazo no termina nunca).

> *"El kernel es imperfecto, por eso siempre se perfecciona, y además encuentra cosas en el camino en qué pensar:
> situaciones, experiencias, entorno. Y siempre tiene que responder a la melodía, y la melodía evoluciona las
> neuronas con cada paso."* (2026-11-03)

Devolución: el lazo no termina, **vive**: la voluntad también aprende (se perfecciona) y el entorno trae cosas nuevas.
Para que eso no choque con la regla de la casa (ningún bucle que gaste por nada), el lazo se mueve por **diferencias**,
como los estados de Wenas: si la melodía de ahora tiene la misma huella que la anterior, la respuesta ya se conoce y no
se recalcula; el lazo descansa (como dormir) y se despierta con lo primero nuevo, de adentro o de afuera. Siempre
responde, pero solo trabaja cuando algo cambió.

> *"Imaginate que yo quiero armar a Janax y te pregunto por ideas de estructura de sistema operativo; además te pido
> un acertijo para niños. Vos me devolvés en lenguaje que yo pueda entender, y respondo de manera que me entiendas,
> para diseñar esa estructura. Vos evolucionás y yo evoluciono: las neuronas aprenden y el kernel evoluciona."*
> (2026-11-03)

Devolución: la voluntad no "lee" la melodía con una regla fija: **conversa**. Pregunta en su idioma, el cardumen
contesta en uno que ella entiende (como los acertijos), ella contesta de modo que el cardumen la entienda, y en cada
vuelta **los dos ajustan el idioma**. El idioma entre las dos partes no se diseña: se aprende entre ellas. Parientes:
los juegos de señales de Lewis (1969) y la comunicación que inventan agentes que aprenden juntos. La prueba de que
funciona está en esta misma bitácora: los acertijos fueron el idioma que el Capitán y Doc armaron para diseñar Janax.
