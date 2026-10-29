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

## Cómo se prueba cada modo (regla de la casa: cero emuladores)

- **Simbiosis**: se prueba ya, en esta PC, como un programa más (igual que los traductores).
- **Modo cero**: necesita **hardware real**, booteando desde un pendrive en una máquina. Sin emuladores, no
  hay otro camino; conviene una máquina o un disco de pruebas, nunca la partición con los datos del
  Capitán.
