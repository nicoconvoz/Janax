# Janax — MMORPG P2P con motor propio

Reglas que no cambian. El estado del proyecto (decisiones con fecha, mediciones, tablas) va a
`documentacion/`, no acá. Este archivo se carga en cada turno: tiene que seguir siendo chico.

Las reglas de trabajo con el Capitán (tono, git, avisar antes, nada a ojo, reglas generales, ningún
bucle que gaste) viven en el `CLAUDE.md` global y valen acá completas. Esta página solo agrega lo
propio de Janax.

## Qué es

Un MMORPG **sin servidores** y con **motor propio**: no Unity, no Unreal, no Godot. El motor es parte del producto, así que
se diseña y se prueba con el mismo cuidado que el juego.

## Stack

**Sin decidir todavía.** Lenguaje, render, red y persistencia se eligen con el Capitán, midiendo, y la
decisión se anota en `documentacion/decisiones/` con el porqué. No asumir ninguno hasta entonces.

## Arquitectura

- **Hexagonal / Clean.** El dominio del juego (reglas, combate, inventario, mundo) no conoce render,
  red, disco ni reloj. Todo eso entra por puertos.
- **Screaming architecture:** las carpetas dicen qué hace el juego (`combate/`, `mundo/`, `inventario/`),
  no qué tecnología usan.
- **Motor y juego separados.** El motor no sabe que existe Janax; Janax usa el motor por su interfaz.
- **Simulación determinista**: mismo estado + mismas entradas = mismo resultado. Sin servidor, es lo que
  permite que cualquier par **verifique** lo que otro dice que pasó, en lugar de creerle.

## Sin servidores (heredado de Wenas / IceBreak)

Janax es un MMORPG **P2P puro**: los equipos de los jugadores son toda la red. Cero componentes centrales:
ni servidor de juego, ni bootstrap, ni señalización, ni STUN/TURN, ni registro. El mundo existe mientras
haya gente jugándolo. Referencia probada: `E:/IceBreak-codigo` (`CLAUDE.md`, `prototype/p2p/core.js`,
`app/packages/icebreak_core`).

Lo que se toma de Wenas, como principio:

- **Identidad = clave firmada** (Ed25519). Nunca datos del equipo. Todo lo que importa viaja firmado.
- **Entrada por cadena de invitación**: un jugador firma el certificado del nuevo, encadenado hasta un
  fundador; se verifica sin conexión. Sin cadena válida, no se enlaza.
- **Lista de miembros descentralizada** por gossip (ola al entrar + anti-entropía por huella), **acotada a
  la zona** propia y las vecinas, nunca el mundo entero.
- **Replicación por cercanía**: el origen empuja a pocos, cada uno reparte a pocos dentro de su radio,
  hasta cubrir a quienes están cerca del hecho. En Janax la cercanía es **dentro del mundo del juego**.
- **Señalización por vecinos comunes, relés que son pares**, pares públicos como reflectores.
- **Órdenes de control firmadas** (versionadas, con ventana de validez) que verifica cada par; el poder
  de administración vive en claves, no en un servidor.
- **Economía en libro firmado**, reconstruido y verificado al arrancar.
- **Liviano primero**: todo lo que pueda viajar como texto plano, viaja así; codificación compacta después.
- **El núcleo del protocolo es independiente del transporte y determinista**, con sus pruebas como
  especificación.

## Nada duplicado, todo original: firmas en lugar de autoridad

La regla general de Wenas: **lo que vale no se guarda, se prueba.** Cada cosa lleva su historia firmada y
cualquier par la verifica sola; una copia perfecta no sirve porque la historia ya dice dónde terminó.

- **Objetos únicos** (`economy/prize.dart`): id único dentro de la firma de quien lo crea; cada traspaso lo
  firma el dueño anterior con el hash del paso previo; poseerlo se demuestra respondiendo un desafío
  nuevo que vale una vez y vence. Estado terminal = terminal aunque exista una copia idéntica. Si alguien
  firma dos traspasos del mismo paso, gana el primero visto y **el doble firmante queda marcado**.
- **Monedero** (`economy/coin.dart`): cada operación `IC1` firmada, con contador consecutivo por clave; una
  repetida o salteada se rechaza. El saldo de quien paga lo prueba su propio historial firmado.
- **Recompensas** (`claim` en `coin.dart`): cada premio tiene una **clave de unicidad** (una bienvenida por
  clave, un regalo por día, un giro por compra) y una prueba firmada de que se ganó.
- **Combate** (`games/match.dart`): semilla compartida + motor determinista en todos los pares; solo viajan
  las jugadas, numeradas y en orden. La información oculta se compromete con su huella al empezar y se
  revela al final para que el otro verifique cada respuesta.

En Janax esto se aplica a ítems, oro, botín, combate y progreso, con el mismo código como referencia.

**Abierto todavía:** dónde vive el estado de una zona cuando no queda nadie en ella, y qué pasa cuando
dos islas separadas ven "primero" traspasos distintos del mismo objeto (se detecta al unirse; falta definir
la resolución).

## Red y recursos (la regla de la casa aplicada a un MMO)

- Nada se envía por temporizador "por las dudas". Se manda **lo que cambió**, a **quien le importa**
  (interés por zona/visibilidad), comparando huella y pasando solo la diferencia. Lección de Wenas: un
  libro reenviado entero cada 20 s costaba ~1 GB por hora por teléfono.
- Si hay un tick de simulación, un tick sin cambios tiene que costar casi cero en bytes y procesador, y
  eso se **mide** antes de darlo por bueno.
- Tick rate, ancho de banda por jugador, jugadores por zona: **cada número sale de una medición**, con la
  medición anotada en `documentacion/`.

## Pruebas

- **TDD estricto:** primero la prueba que falla, después el código.
- El dominio se prueba sin motor, sin red y sin ventana. Si una regla de juego necesita abrir una ventana
  para probarse, está mal ubicada.
- Los bancos de rendimiento son instrumentos: antes de creerles, verificar que miden lo que dicen.
- Las salidas de bancos y logs (`log_*.txt`, etc.) van al `.gitignore`.

## Índice de documentación

- `documentacion/decisiones/` — decisiones de arquitectura y stack, con fecha y porqué.
- `documentacion/estado.md` — en qué está el proyecto hoy.
