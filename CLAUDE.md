# Janax — sistema operativo y motor propios, la casa de Razar

Reglas que no cambian. El estado del proyecto (decisiones con fecha, mediciones, tablas) va a
`documentacion/`, no acá. Este archivo se carga en cada turno: tiene que seguir siendo chico.

Las reglas de trabajo con el Capitán (tono, git, avisar antes, nada a ojo, reglas generales, ningún
bucle que gaste) viven en el `CLAUDE.md` global y valen acá completas. Esta página solo agrega lo
propio de Janax.

## Qué es

Un sistema operativo, un idioma (Janax) y un motor **propios**, hechos para contener a **Razar**
(Razonamiento Artificial, `E:/proyectos/Razar`), que trabaja con código. El Capitán lo va a donar al mundo,
abierto. Ya no es un MMORPG (Capitán, 2026-11-03): lo que era del juego está en `documentacion/archivo/mmorpg.md`.

## Stack

- **Una sola versión de cada programa, en el idioma Janax**: un assembler propio, diseñado para traducirse. El
  **arranque** detecta familia y capacidades del procesador (nunca el modelo) y traduce el programa a ese
  procesador una vez, antes de empezar, con caché en disco.
- **Todo en assembler, sin Zig ni otro lenguaje.** Un escalón 0 escrito a mano en x86-64 compila el
  traductor, que está escrito en Janax: Janax se compila a sí mismo.
- **Ensamblador del escalón 0: FASM 1.73.35**, portable en `E:/DevCache/fasm/FASM.EXE` (arma el `.exe` de
  Windows directo, sin linker). **Los programas Janax los arma el ensamblador PDP** (escrito en Janax, desde
  su semilla `so/pdp/semilla`, con `so/herramientas/armar.sh`): FASM solo arma lo que es x86. Un pedazo caliente puede tener assembler a
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

- **Hexagonal / Clean.** El dominio (Razar) no conoce disco, red, ventana ni reloj: todo eso entra por puertos
  (la ventanilla del SO).
- **Screaming architecture:** las carpetas dicen qué hacen, no qué tecnología usan.
- **El SO no sabe que existe Razar**; Razar usa el SO por su interfaz.
- **Determinista**: mismo estado + mismas entradas = mismo resultado, en los tres motores, bit por bit. Es lo que
  permite verificar un resultado en lugar de creerle.
- **Razar crea sus propias reglas; nosotros no le ponemos reglas** (regla de la casa, Capitán 2026-11-07). Nada de
  "un hecho termina en X" ni "en castellano la pregunta se invierte": se construye el mecanismo que mide, y la regla
  sale de lo que Razar descubre en los libros (como las flechas: por mayoría, no por lista).

## Pruebas

- **TDD estricto:** primero la prueba que falla, después el código.
- **Cero emuladores.** ARM64 se prueba en el teléfono real del Capitán por adb (`bash escalon0/pruebas/correr.sh`
  corre intérprete, traductor x86-64 y ARM64 en el teléfono si está conectado).
- El dominio se prueba sin red y sin ventana. Si una regla necesita abrir una ventana para probarse, está mal
  ubicada.
- La suite NO se corre por rutina (Capitán, 2026-11-06: "solo la pasamos si nos encontramos con un problema"): tarda
  ~15 minutos. Se verifica corriendo el programa tocado a mano; la suite, solo ante un problema.
- Los bancos de rendimiento son instrumentos: antes de creerles, verificar que miden lo que dicen.
- Las salidas de bancos y logs (`log_*.txt`, etc.) van al `.gitignore`.

## Índice de documentación

- `documentacion/decisiones/` — decisiones de arquitectura y stack, con fecha y porqué.
- `documentacion/estado.md` — bitácora: en qué está el proyecto y qué se midió en cada paso.
- `documentacion/idioma/especificacion-v0.md` — el idioma Janax: instrucciones, codificación, reglas.
- `documentacion/idioma/traductores.md` — lo construido: intérprete, traductores x86-64 y ARM64, cómo se
  prueba, formatos y mediciones.
- `documentacion/idioma/cambiaformas.md` — diseño del Cambiaformas, incluido lo que falta.
- `documentacion/so/ideas.md` — sistema operativo: las ideas del Capitán y su devolución.
- `documentacion/so/janaxos.md` — sistema operativo: lo construido, cómo se prueba, mediciones.
- `documentacion/so/pdp.md` — PDP y el ensamblador propio (Janax armado por Janax).
- `documentacion/archivo/mmorpg.md` — lo que era del MMORPG (sin servidores, firmas, zonas, traspasos, red), mudado
  entero el 2026-11-03.
- **Cada paso se documenta en el mismo commit que el código** (regla del Capitán: "nunca te olvides de
  documentar").
