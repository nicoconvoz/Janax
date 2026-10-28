# Janax — MMORPG con motor propio

Reglas que no cambian. El estado del proyecto (decisiones con fecha, mediciones, tablas) va a
`documentacion/`, no acá. Este archivo se carga en cada turno: tiene que seguir siendo chico.

Las reglas de trabajo con el Capitán (tono, git, avisar antes, nada a ojo, reglas generales, ningún
bucle que gaste) viven en el `CLAUDE.md` global y valen acá completas. Esta página solo agrega lo
propio de Janax.

## Qué es

Un MMORPG con **motor propio**: no Unity, no Unreal, no Godot. El motor es parte del producto, así que
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
- **Servidor autoritativo.** El cliente pide, el servidor decide. Nada que importe (daño, botín, posición
  válida, economía) se confía al cliente.
- **Simulación determinista** donde se pueda: mismo estado + mismas entradas = mismo resultado. Es lo que
  hace posible probar, repetir partidas y reconciliar cliente con servidor.

## Red y recursos (la regla de la casa aplicada a un MMO)

- Nada se envía por temporizador "por las dudas". Se manda **lo que cambió**, a **quien le importa**
  (interés por zona/visibilidad), comparando huella y pasando solo la diferencia.
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
