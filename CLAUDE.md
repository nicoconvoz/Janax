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

- **Una sola versión del juego, en el idioma Janax**: un assembler propio, diseñado para traducirse. El
  **arranque** detecta familia y capacidades del procesador (nunca el modelo) y traduce el juego a ese
  procesador una vez, antes de empezar, con caché en disco.
- **Todo en assembler, sin Zig ni otro lenguaje.** Un escalón 0 escrito a mano en x86-64 compila el
  traductor, que está escrito en Janax: Janax se compila a sí mismo.
- **Ensamblador del escalón 0: FASM 1.73.35**, portable en `E:/DevCache/fasm/FASM.EXE` (arma el `.exe` de
  Windows directo, sin linker). Un pedazo caliente puede tener assembler a
  mano para una familia y reemplaza al traducido.
  Detalle: `documentacion/decisiones/2026-10-28-idioma-janax.md`.
- **El Cambiaformas** (idea del Capitán): el arranque elige, para cada mecanismo Janax, la secuencia del
  procesador que da **idéntico al intérprete bit por bit** y corre más rápido; lo que no conoce lo busca y
  verifica en ejecución. Mapa y diseño: `documentacion/idioma/cambiaformas.md`.
- **Gráficos propios**: sin SDL ni motores; solo la API del driver (Vulkan/DirectX/OpenGL) y la ventana
  del sistema, declaradas por nosotros.
- Todas las variantes de una función dan el mismo resultado bit por bit; simulación en punto fijo.
- Lo demás (red física, persistencia) se decide con el Capitán, midiendo, y se anota en
  `documentacion/decisiones/`.

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

## Zonas: el diseño es la base, los cambios viven en los jugadores (Capitán, 2026-10-28)

- **La zona la define el diseño del juego** y viaja con el juego: nadie tiene que guardarla ni servirla.
- **Los cambios son hechos firmados** (un cofre abierto, un jefe caído, una puerta rota) que guardan
  **quienes los causaron y quienes los vieron**.
- **Estado de una zona = diseño + cambios firmados aplicados en orden**, con el motor determinista: dos
  jugadores con los mismos cambios ven exactamente la misma zona.
- **Se replican entre jugadores como los estados y los cofres de Wenas**
  (`social/social_node.dart`): al encontrarse se compara una **huella** y cada uno pasa **solo lo que al otro
  le falta**, una vuelta, a esa persona; quien recibe algo nuevo lo pasa una vez más. Nunca por
  temporizador. Una zona sin nadie no se pierde: sus cambios esperan en los jugadores que estuvieron.

## Traspasos por mutuo acuerdo (Capitán, 2026-10-28)

- **Un traspaso vale solo con las dos firmas**: la de quien da y la de quien recibe, cada una con la hora
  UTC de **su** reloj. Con las dos firmas, el poder pasa al que recibe y quien dio ya no puede traspasarlo.
- **Una segunda firma del dueño anterior no vale por construcción**: firmó algo que ya no era suyo.
  Cuando se unen dos islas, gana el traspaso de mutuo acuerdo más temprano, el otro se anula y el doble
  firmante queda marcado. Todos los pares llegan solos a la misma respuesta.
- **Anclas de la hora**: un reloj puede adelantarse o atrasarse. Una hora futura se recorta a "ahora" (como
  en Wenas). Contra una hora atrasada (quien recibe en connivencia con quien da), el traspaso cita la huella
  del último hecho firmado de la zona que conoce: no puede estar fechado antes de lo que cita.

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
- **Cero emuladores.** ARM64 se prueba en el teléfono real del Capitán por adb (`bash escalon0/pruebas/correr.sh`
  corre intérprete, traductor x86-64 y ARM64 en el teléfono si está conectado).
- El dominio se prueba sin motor, sin red y sin ventana. Si una regla de juego necesita abrir una ventana
  para probarse, está mal ubicada.
- Los bancos de rendimiento son instrumentos: antes de creerles, verificar que miden lo que dicen.
- Las salidas de bancos y logs (`log_*.txt`, etc.) van al `.gitignore`.

## Índice de documentación

- `documentacion/decisiones/` — decisiones de arquitectura y stack, con fecha y porqué.
- `documentacion/estado.md` — en qué está el proyecto hoy.
