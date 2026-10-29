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
