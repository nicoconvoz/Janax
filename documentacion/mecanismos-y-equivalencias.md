# Janax y Razar — inventario de mecanismos y mapa de equivalencias

**Qué es este documento.** Un inventario de los mecanismos que hay en el código de Janax y
Razar, levantado **leyendo el código y nada más** — sin consultar la documentación técnica del
proyecto. Cada mecanismo se describe por lo que hace, y después se le pone al lado **su nombre
en el oficio publicado**, con cita, cuando existe uno.

**Para qué sirve.** Un revisor externo no puede evaluar lo que no puede ubicar. Este mapa dice,
para cada pieza: *esto ya tiene nombre y se llama así*, o bien *esto no tiene equivalente
conocido*. Las dos respuestas son útiles, y la segunda es la que importa.

**Cómo leer las etiquetas:**

| Etiqueta | Significa |
|---|---|
| 🟦 **Conocido** | Existe en el oficio con ese nombre. La implementación puede ser propia; la idea no es nueva. |
| 🟨 **Convergente** | Reinventado de forma independiente, sin conocer el antecedente. Vale como validación: el problema empuja a esa solución. |
| 🟩 **Variante propia** | Hay un pariente publicado, pero la pieza se aparta de él en algo sustantivo. Se dice en qué. |
| 🟥 **Sin equivalente conocido** | No le encontré antecedente. No prueba que no exista: prueba que no está en lo que conozco. |

**Advertencia honesta sobre la etiqueta 🟥.** "No le encontré antecedente" es una afirmación
sobre mi conocimiento, no sobre la literatura. Vale como señal para buscar, no como prioridad
establecida.

---

## Censo del repositorio

Medido sobre el árbol de archivos, separando fuente de artefactos generados.

| Área | Archivos | Líneas de fuente |
|---|---|---|
| `razar/` | 125 | 77.242 |
| `so/` | 115 | 16.294 |
| `escalon0/` | 52 | 10.168 |
| documentación | 16 | 9.954 |
| **Total fuente** | **320** | **115.676** |

Aparte, **1.556.981 líneas generadas** bajo `so/build/` y `escalon0/build/` (2.166 archivos):
tablas de combinaciones producidas por el propio sistema. No son código escrito a mano y no
deben contarse como tal.

Por lenguaje: **73.497 líneas en `.jsm`** y 14.741 en `.inc` — el **76% del proyecto está
escrito en el lenguaje que el propio proyecto define**. 6.731 líneas en ensamblador nativo
(x86-64 y ARM64), que son el escalón 0.

**Separación que conviene dejar explícita:** el sistema está en `.jsm` sin bibliotecas de
terceros, pero **los bancos de medición y los armadores de corpus están en Perl y Python**
(`analiza.pl`, `huella.pl`, `modelo.pl`, `zipf.pl`, y los generadores de `libros/`). La
afirmación "sin terceros" vale para el sistema medido, no para el instrumento que lo mide.

**Hay un banco por mecanismo:** 35 guiones de prueba (28 en `razar/cardumen/`, 7 en
`razar/lectura/`), nombrados como aquello que miden — `hilos_nitidez_prueba`,
`hilos_poda_prueba`, `hilos_imagina_prueba`, `caminos`, `barrido`, `convencional`,
`nitidez_reproducir`. El proyecto es medible por construcción, no por agregado.
---

# Capítulo 1 — Escalón 0: el arranque desde cero

Tres motores que ejecutan el mismo lenguaje y un traductor cruzado, todos en ensamblador
nativo, sin libc y sin enlazador. 10.168 líneas de fuente.

## 1.1 La palabra fija de 32 bits
`escalon0/janax.inc:2,22` — `op[0..7] rd[8..11] ra[12..15] imm16[16..31]`, 16 registros,
24 opcodes (`00h`..`17h`); el campo `imm16` se reinterpreta como `rb`.

🟦 **Conocido** — diseño de ISA RISC de ancho fijo (MIPS, RISC-V). La reinterpretación del
campo inmediato es la economía habitual de un formato apretado.

## 1.2 `jwhile`/`jwend`: el único lazo, y es rotado
`escalon0/janax.inc:41-65`. El lazo se emite como `jjmp check / body: … / check: jjnz r, body`:
pregunta antes de la primera vuelta, y cada vuelta cuesta cuerpo + 1 instrucción en vez de + 2.
No hay `for`. **Y la regla se le aplica también al ensamblador escrito a mano**:
`so/herramientas/bucles.awk` recorre `janax.asm`, `traductor.asm`, `traductor_arm64.asm`,
`ventanita.inc` y el núcleo entero, y falla si algún salto hacia atrás no tiene esa forma.

🟩 **Variante propia.** La transformación se llama **rotación de lazo** (*loop rotation*,
*loop inversion*) y es una optimización clásica de compiladores — pero ahí la hace el
compilador y el programador no se entera. Acá es **una restricción del lenguaje**, verificada
por una herramienta sobre código escrito a mano. El pariente conceptual es
**Böhm–Jacopini (1966)** —secuencia, selección e iteración bastan— llevado al mínimo: *una
sola* forma de iteración, sin excepciones.

## 1.3 Tres motores comparados contra un intérprete de referencia
`escalon0/janax.asm` es deliberadamente lento: existe para que los traductores se prueben
contra él. `escalon0/pruebas/correr.sh:28-55` corre cada programa en tres motores —intérprete,
traductor, y traductor otra vez desde la caché— y exige el mismo resultado.

🟦 **Conocido, y es una fortaleza.** Es **prueba diferencial** (*differential testing*,
McKeeman 1998) sobre **programación de N versiones**. Es como se validan los emuladores de CPU
y los motores de JavaScript. Tenerlo desde el escalón 0, hecho por una persona sola, no es
común.

## 1.4 Semántica fijada donde el procesador difiere
`escalon0/janax.asm:154-195` — `x / 0 = 0` en vez de excepción, `MIN / -1 = MIN`, los
corrimientos toman los 6 bits bajos (`and ecx, 63`).

🟦 **Conocido.** Es la decisión de **no tener comportamiento indefinido**: la misma que toman
Java y WebAssembly frente a C. Cada caso raro tiene una respuesta escrita, y por eso los tres
motores pueden coincidir bit a bit.

## 1.5 Pila de retorno separada e inaccesible al programa
`escalon0/janax.asm:33,281-295` — `jcall` guarda en `retstack`, que no vive en la memoria de
datos; el programa no la puede leer ni escribir.

🟦 **Conocido, con una propiedad de seguridad de regalo.** Es la **pila de retorno separada**
de las máquinas Forth, y es exactamente lo que la industria agregó cuarenta años después como
**shadow stack** (Intel CET, 2020) para frenar el ROP. Acá no se agregó: nunca estuvo junta.

## 1.6 ⭐ Plantillas copiadas byte a byte y parchadas
`escalon0/traductor.asm:113-221` — el traductor **recorta pedazos de su propio código** y los
copia al código generado, parchando después los campos por desplazamiento conocido. El relleno
`DISP = 7FFFFFF0h` fuerza que los campos salgan de 32 bits para poder sobreescribirlos.

🟨 **Convergente, y es el hallazgo más fuerte del escalón 0.** La técnica se publicó como
**«Copy-and-Patch Compilation»** (Haoran Xu y Fredrik Kjolstad, *OOPSLA/PLDI* 2021): generar
código copiando fragmentos precompilados y parchando los huecos, en lugar de emitir
instrucción por instrucción. Es la base del intérprete *baseline* de CPython 3.13. El autor
llegó a lo mismo sin conocerla. No le da prioridad —el antecedente es de 2021— pero dice que
el problema empuja a esa solución, que es la mejor validación que puede tener una decisión de
diseño.

## 1.7 Asignación de registros por frecuencia de uso
`escalon0/traductor.asm:584-645` — cuenta apariciones de cada registro Janax y reparte los 11
nativos libres en rondas, al más usado primero.

🟦 **Conocido, en su versión simple.** Los dos estándares son **coloreo de grafos** (Chaitin,
1981) y **barrido lineal** (Poletto y Sarkar, 1999). Esto es más simple que los dos: no mira
rangos de vida, solo frecuencia. Para un programa que se traduce entero de antemano alcanza —
conviene decir que es una elección, no un desconocimiento.

## 1.8 Caché incremental por palabra, con huella del propio traductor
`escalon0/traductor.asm:658-933` — el código de cada palabra que no cambió se reusa tal cual,
porque los saltos se enlazan **después** del acomodo. Y `:647-656` calcula **FNV-1a de 32 bits
sobre el código entero del traductor**: si el traductor cambia, la caché entera se invalida.

🟦 **Conocido, bien hecho.** Es **compilación incremental con direccionamiento por contenido**.
Hashear el compilador junto con la entrada es lo que hace `ccache` (su *compiler check*) y lo
que hacen Bazel y Nix para que una caché vieja no contamine una construcción nueva. Que esté
probado insertando un `nop` dentro del emisor (`pruebas/correr.sh:82-99`) es el rigor que uno
espera de una herramienta de construcción madura.

## 1.9 Relajación de saltos por pasadas monótonas
`escalon0/traductor_arm64.asm:505-514,647-692` — si un salto condicional rel19 no alcanza, se
marca la palabra y **se traduce todo de nuevo**; como los largos solo crecen, el proceso
termina.

🟦 **Conocido, incluido el argumento de terminación.** Es el problema de las **instrucciones
dependientes del alcance** (*span-dependent instructions*), formalizado por **Szymanski
(1978)**; la prueba de convergencia es precisamente la monotonía de los tamaños.

## 1.10 Autoalojamiento verificado por punto fijo
`so/herramientas/armar.sh` — la semilla arma el ensamblador; ese ensamblador **se arma a sí
mismo** y los dos binarios se comparan con `cmp`; si difieren, se aborta con "no es su propio
punto fijo". Además se compara contra la semilla en disco.

🟦 **Conocido, y es el estándar de oro.** Es el **bootstrap de tres etapas** de GCC, donde
*stage2* y *stage3* deben salir idénticos; y es el contexto de **«Reflections on Trusting
Trust»** (Ken Thompson, 1984). Tenerlo automatizado en el arnés es lo correcto.

⚠️ **El alcance exacto, para que no se lea de más ni de menos.** Lo probado por punto fijo es el
autoalojamiento del **ensamblador del lenguaje**: arma sus propias fuentes, se arma a sí mismo y
los dos binarios tienen que salir idénticos. Lo que FASM todavía construye es el **núcleo x86** y
los motores de escalón 0 (`so/janaxos.asm`, `escalon0/janax.asm`, `traductor.asm`,
`traductor_arm64.asm`), que están escritos en ensamblador x86-64 — y el ensamblador PDP arma
`.jsm`, no `.asm`. El propio código lo dice (`escalon0/pruebas/correr.sh:19-20`): *"Janax OS itself
is x86 and still built by FASM."*

**Y la otra mitad, que no es lo mismo:** la comparación byte a byte contra FASM (§2.22) **no es una
dependencia, es una verificación elegida**. Se puede sacar y el sistema sigue construyéndose igual;
lo único que se pierde es la comprobación. Confundir las dos cosas hace creer que el proyecto
depende de FASM mucho más de lo que depende.

## 1.11 La ventanita: catálogo de lo que el anfitrión ofrece
`escalon0/ventanita.inc:1-101` — el pedido 0 devuelve **el catálogo**; un pedido que no se
ofrece responde `-1`. El programa pregunta qué hay y se arregla con eso. Y
`JANAX_SIN=nombre,nombre` **apaga** pedidos a propósito (`:103-163`).

🟩 **Variante propia.** Preguntar las capacidades en vez de suponerlas es **negociación de
capacidades** (extensiones de OpenGL, negociación de protocolo). Lo que no es habitual es la
segunda mitad: una variable de entorno que **le saca capacidades al sistema para ver si el
programa aguanta**. Eso es **inyección de fallas** del estilo *chaos engineering*, pero de
serie en el sistema y probada en el arnés (`pruebas/correr.sh:139-148`). La degradación
elegante no es una aspiración acá: es un caso de prueba.

## 1.12 Sin libc, sin enlazador, ELF escrito a mano
`escalon0/traductor_arm64.asm:694-753` — una sola cabecera `PT_LOAD` R+W+X; la pila de retorno
y los datos quedan como memoria en ceros después del archivo. Syscalls crudas con `svc #0`.

🟦 **Conocido.** Es la tradición del ejecutable mínimo y la programación *freestanding*. Vale
decir que el segmento único RWX es una decisión de simplicidad, no de seguridad.

## 1.13 Probar en el teléfono de verdad, sin emuladores
`escalon0/pruebas/correr.sh:101-137` — empuja los ELF ARM64 por `adb` a un teléfono real.
Regla declarada en el comentario: *"no emulators: house rule"*.

🟦 **Conocido y bien elegido.** El emulador comparte los errores del traductor; el silicio no.
---

# Capítulo 2 — Janax OS: el sistema operativo

16.294 líneas de fuente (los 1,5 millones de `so/build/` son tablas generadas). Núcleo,
planificador, tres motores de ejecución, un ensamblador autoalojado y un vigía.

## 2.1 ⭐ `ambiente` y `cartel`: direcciones que son capacidades
`so/ambientes.inc:1-60,264-383` — una dirección Janax parte el número de ambiente en los 32
bits altos y la posición en los bajos. Cada cabina tiene su **cartel**: una tabla propia de
entradas de 32 bytes `{lugar + tratamiento, tamaño, llave, caja}`. El ambiente 0 es el
inicial; destruir uno mata su dirección y nada más.

🟦 **Conocido, y la equivalencia es exacta.** El cartel es un **espacio de capacidades**: lo
mismo que el *CSpace* de **seL4**, los puertos de **Mach**, o las tablas de capacidades de
**CAP** y **Hydra** (Wulf et al., 1974). Una dirección no es un puntero crudo: es un índice en
una tabla que solo el dueño modifica. Decir esto en el documento ubica a Janax OS de
inmediato en la familia correcta, que no es la de Unix.

## 2.2 Números de ambiente que nunca se reusan
`so/ambientes.inc:21-25,334-337` — cada ambiente nuevo toma `P_NEXTROOM`, siempre el
siguiente; una entrada destruida apunta a un *cajón muerto* con tamaño 0.

🟦 **Conocido.** Son **identificadores con generación**, la defensa estándar contra el problema
ABA y contra que una referencia vieja apunte a un objeto nuevo. Es la misma idea que los
*generational indices* de los motores de juegos y los `fd` no reusados de un sistema robusto.

## 2.3 Permisos que hace cumplir el procesador, y una página de pared
`so/ambientes.inc:46-60,579-653` y `:71-98` — los primeros cuatro bits de tratamiento se
imponen con `VirtualProtect` sobre la vista, así un acceso prohibido **no cuesta nada hasta
que ocurre**. El ambiente se apoya contra el final de sus páginas y se reserva una página
extra: el byte siguiente ya es una dirección que el procesador rechaza.

🟦 **Conocido, y es lo correcto.** Son **páginas de guarda** y comprobación de límites
delegada a la MMU. Es exactamente la técnica con la que los motores de WebAssembly (V8,
Wasmtime) evitan comprobar cada acceso: reservan el espacio y dejan que el hardware tire la
falla.

## 2.4 Pila de retorno que pesa lo que lleva, con histéresis
`so/ambientes.inc:773-842` — crece duplicando y **se reduce a la mitad mientras la profundidad
use un cuarto o menos**, nunca por debajo de una página.

🟦 **Conocido.** Es la **histéresis** estándar de los arreglos dinámicos: crecer al llenarse y
achicar recién a un cuarto evita el golpeteo (si achicara a la mitad, un vaivén de una entrada
dispararía realojos sin parar). Que esté razonado así en un sistema hecho a mano es buena
señal.

## 2.5 ⭐ El remero especial: el que destraba a más gente
`so/remos.inc:115-250,384-426` — un remero por núcleo. Los de línea toman cabinas por orden de
llegada; **uno** toma siempre la cabina que traba a más otras (`P_BLOCKS`, pedidos esperando
su firma) y que nadie rema.

🟨 **Convergente con una solución conocida.** El problema se llama **inversión de prioridades**
y la solución publicada es **herencia de prioridad** o *helping* (Sha, Rajkumar y Lehoczky,
1990, el análisis que surgió del fallo del Mars Pathfinder). La variante de acá —un remero
dedicado que siempre atiende al que más bloquea— es *helping* implementado como un rol fijo en
lugar de como una elevación dinámica. Mismo objetivo, otra ingeniería.

## 2.6 Dormir en vez de girar, y despertar solo con trabajo nuevo
`so/remos.inc:28-110` — espera `INFINITE` en variables de condición; solo un nacimiento o una
firma despiertan a **uno**, y un contador `vain_wakes` mide los despertares en vano.

🟦 **Conocido, y bien instrumentado.** Despertar a uno y no a todos evita la **estampida**
(*thundering herd*). Medir los despertares inútiles es lo que distingue a un sistema afinado de
uno que solo funciona — y es, además, la regla de la casa del autor ("ningún bucle que gaste
por nada") aplicada al núcleo.

## 2.7 El turno sale de una fórmula, no de una constante
`so/nucleo/planificador.inc:199-229` — `t = c·p/(1−p)`, con `p` la prioridad en 65536avos y
`c` el costo de cambio en dieciseisavos de instrucción; `p ≥ 1` rema hasta terminar (turno
2^62). La versión larga (`:1-139`) resuelve el menor `t ≥ D+1` con `t(t−D−c) ≥ c·s`, cuya raíz
real es `((D+c)+√((D+c)²+4cs))/2`, en enteros y sin punto flotante, con `raiz` (`:141-197`)
por Newton desde arriba.

🟦🟨 **Conocido en su familia, y la forma de la fórmula es reconocible.** `t = c·p/(1−p)` es la
solución exacta de "quiero que el cambio de contexto sea a lo sumo la fracción (1−p) del
tiempo": el **compromiso cuanto-contra-sobrecarga** que todo planificador resuelve, acá
despejado en vez de tanteado. La variante con raíz cuadrada pertenece a la misma familia que
el **intervalo óptimo de checkpoint** (Young 1974, Daly 2006), `t ≈ √(2cs)`, que aparece
siempre que hay un costo fijo que amortizar contra un daño que crece con el tiempo.

## 2.8 ⭐ Planificador reemplazable, con presupuesto y vuelta atrás
`so/ayudantes.inc:1-147` — el planificador se lee de `PDP/so/nucleo/planificador.bin`; corre
como **ayudante del núcleo** (proceso propio, sin memoria, sin ventanilla) con un presupuesto
de **100.000 instrucciones**. Si se pasa o sale con error, el núcleo vuelve al de fábrica por
el resto de la corrida.

🟨 **Convergente con una línea de investigación entera.** Eso es un **núcleo extensible con
extensiones acotadas y revocables**: la idea de **SPIN** (1995) y sobre todo de **VINO**
(Seltzer et al., 1996), cuyas extensiones corrían como transacciones que el núcleo podía
abortar y deshacer. El descendiente vivo es **eBPF**, que resuelve el mismo problema con un
verificador estático en lugar de un presupuesto en tiempo de ejecución. Elegir el presupuesto
—que no exige verificador— es una ingeniería defendible y distinta.

## 2.9 ⭐ «La última parte»: terminar en vez de pasar el remo
`so/remos.inc:428-477` — para cada palabra del programa se calcula, **una vez y hacia atrás**,
cuántas instrucciones faltan hasta su `jhalt` por el camino recto. Si lo que falta no cuesta
más que un cambio de contexto, la cabina termina primero. Está sacado del código, **así que un
programa no puede mentir sobre él**.

🟩 **Variante propia de una heurística conocida.** La idea de no expulsar a alguien que está
por terminar existe (Linux la tiene como granularidad de despertar; los sistemas de tiempo real
evitan expulsar a quien está por soltar un candado). Lo que no conozco con antecedente es
**calcularlo estáticamente del programa para que no se pueda falsear**. En los sistemas
conocidos, "estoy por terminar" lo declara el proceso o lo estima el planificador; acá se
deduce del texto del programa. Esa propiedad —*la pista no la da el interesado*— es la parte
interesante y vale nombrarla en el documento.

## 2.10 Tabla de rutinas: código enhebrado
`so/rutinas.inc:1-210` — cada programa se decodifica **una vez** a una tabla de registros de 16
bytes y correr es saltar de rutina en rutina. Cada rutina alineada a 16 bytes (medido: sin esa
alineación, mover unos bytes antes cambiaba el rendimiento hasta **~15 %**).

🟦 **Conocido y de manual.** Es **código enhebrado** (*threaded code*, Bell 1973), en su
variante directa; es cómo funcionan Forth, el intérprete de CPython y las máquinas virtuales
rápidas. La medición de la alineación es el tipo de detalle que solo aparece cuando alguien
midió de verdad.

## 2.11 Fusión de condiciones (superinstrucciones)
`so/rutinas.inc:98-151,245-282` — un `jjmp` que aterriza sobre un `jjz` decide la condición en
el lugar; y una instrucción seguida de una condición la decide al final. Cada instrucción que
cae de corrido existe tres veces: sola, `_jz` y `_jnz`.

🟦 **Conocido.** Son **superinstrucciones** (Ertl y Gregg, 2003), la optimización clásica de
los intérpretes enhebrados: fusionar pares frecuentes para pagar un despacho menos. Que la
entrada de todo `while` rotado aterrice exactamente en su condición hace que la fusión cubra
el caso más frecuente del lenguaje — las dos decisiones se refuerzan.

## 2.12 ⭐ Medición de turno exacta, con camino de devolución
`so/nativo.inc:17-57,164-204` — el código nativo cobra el turno **una vez por corrida** (el
tramo recto hasta el próximo salto). Si el presupuesto no alcanza, **no cobra nada**: la
palabra corre por su rutina, que cobra de a una, de modo que **el turno termina en la misma
instrucción que con el intérprete, bit por bit**.

🟨 **Convergente con la medición de combustible.** Cobrar por bloque básico en vez de por
instrucción, con un camino lento exacto cuando el presupuesto se agota, es **exactamente** cómo
miden el consumo Wasmtime (*fuel metering*) y la máquina de Ethereum (*gas*). La propiedad que
el autor exige —que los tres motores corten en la misma instrucción— es más fuerte que lo
habitual: no solo el resultado tiene que coincidir, también el momento del corte.

## 2.13 La falla del procesador como camino lento
`so/nativo.inc:871-937` — un manejador *vectored* atrapa `0xC0000005`, ubica la palabra por el
`rip` y mueve la ejecución al bloque frío de esa palabra, que da la respuesta exacta.

🟦 **Conocido y de alto rendimiento.** Es **comprobación implícita de límites por señal**: lo
que hacen V8 y los motores de WebAssembly para no pagar una comparación por acceso. El costo
es cero hasta que la falla ocurre.

## 2.14 Cuatro registros calientes, con escritura pasante
`so/nativo.inc:218-285` — los cuatro registros Janax más usados viven en `r8-r11`, pero **toda
escritura va también a memoria**, así las rutinas siempre los encuentran ahí.

🟦 **Conocido.** Es caché de registros con **escritura pasante** (*write-through*): paga un
poco en cada escritura a cambio de que los dos mundos —código nativo y rutinas— puedan
mezclarse sin sincronizar nada. Es la decisión correcta para un motor híbrido.

## 2.15 ⭐ El vigía: nadie mira en un lazo
`so/ambientes.inc:1601-1803` y `so/vigia.inc` — cuando **nadie rema** y una cabina espera
novedades, el núcleo pide al anfitrión que le avise (`ReadDirectoryChangesW` asincrónico) y se
**duerme**. Nada se gasta mientras no pasa nada.

🟦 **Conocido, y es la regla de la casa hecha núcleo.** Es notificación **por evento** en vez
de por sondeo: `inotify` en Linux, `kqueue` en BSD. Lo que conviene remarcar es que acá no es
una optimización agregada: es la arquitectura.

## 2.16 ⭐ Cuarentena por quietud, con el umbral medido
`so/vigia.inc:440-488` — un archivo que aparece **se guarda hasta que esté quieto**:
`HW_QUIET` milisegundos sin otro aviso. Un registro que crece nunca llega; un archivo que muere
al instante, tampoco. El valor es **67.803 ms**, y el comentario dice de dónde sale: el
**percentil 99** de los huecos entre dos avisos.

🟩 **Variante propia por el método, no por la idea.** El mecanismo se llama **antirrebote**
(*debouncing*) o tiempo de asentamiento, y está en todo vigilante de archivos. Lo que casi
nunca pasa es que la constante salga de **la distribución medida** en vez de un número redondo.
Ese 67.803 es la regla «nada a ojo» aplicada: un umbral despejado de datos, no elegido.

## 2.17 ⭐ Dote, mudar, enlazar, recibir, fusionar: traspaso sin copiar
`so/ambientes.inc:844-1267` — el hijo nace con las cajas que la madre le dejó en dote, cada una
con su propia vista y su propia llave; **ni un byte se copia**. Mudar es perderla, enlazar es
compartirla. Y lo que llega **entra al buzón**, no al cartel: solo se incorpora cuando se la
recibe (pedido 25).

🟦 **Conocido, y el invariante del buzón es la parte fina.** Es **traspaso de capacidades**
sin copia: los derechos de puerto de **Mach**, el `CNode_Copy`/`Move` de **seL4**, y la
distinción mover/compartir que Rust hace con su sistema de propiedad. El detalle que vale
destacar: **el cartel de una cabina solo lo modifica esa cabina**. Nadie te mete algo en la
tabla; te lo deja en la puerta y vos decidís entrarlo. Esa es una propiedad de seguridad real
y está sostenida por construcción.

## 2.18 🟥 `asociar`: álgebra de conjuntos sobre dos carteles, con consentimiento mutuo
`so/ambientes.inc:1274-1426` — un hijo nace con las cajas de **dos** cabinas según el modo:
**0** las que ambas tienen (intersección), **1** solo las de A, **2** solo las de B
(diferencias), **3** todas (unión). Hace falta que **las dos** se hayan asociado mutuamente, y
una caja que ambas tienen se entrega con el `and` de los dos tratamientos.

🟥 **No le encontré equivalente publicado.** Conozco el traspaso de capacidades entre dos
procesos, y conozco la herencia al crear un hijo. **Álgebra de conjuntos sobre dos espacios de
capacidades, materializada en el nacimiento de un tercero y con consentimiento bilateral
obligatorio** no la ubico en ningún sistema que conozca. El pariente más cercano que se me
ocurre es la composición de *CSpaces* en seL4, pero ahí se hace a mano, capacidad por
capacidad, y no hay operador de conjuntos ni requisito de reciprocidad.

Si hay una pieza del sistema operativo que merece un párrafo propio en un paper, es ésta. Y la
prueba ya existe: `so/pruebas/asocia_{0,1,2,3}.jsm` da `77 / 11 / 55 / DD` para los cuatro
modos.

### El hallazgo conceptual: un Venn de población infinita

Esto no es una característica pendiente de `asociar`: es un resultado sobre el Venn mismo, y es
del autor. Conviene separarlo del código porque **vale aunque el código no lo implemente**.

> *"Venn, infinitos estados. Un conjunto A + B, A − B, A y B, sin A ni B, **lo que miro A primero,
> lo que miro B primero, los más pequeños de B que no están en A**… y puedo inventar lo que sea."*
> — el autor, charla de diseño, 2026-11

**La cuenta, que se puede escribir.** `asociar` entrega desde tres regiones (A∩B, A∖B, B∖A; la
cuarta, «ni A ni B», no existe para entregar porque no hay nada que entregar ahí):

| Capa | Cuántos estados |
|---|---|
| **Booleana** — lo construido | subconjuntos de 3 regiones = **2³ = 8**. Implementados: **4** (modos 0-3) |
| **+ el orden de la mirada** | cada entrega es una **secuencia**: con *k* cajas, **k!** órdenes distintos, y el hijo las recibe como sus ambientes 1, 2, 3… en ese orden |
| **+ un criterio de ranking** | cualquier predicado sobre los campos de la entrada del cartel (`RE_PLACE`, `RE_SIZE`, `RE_KEY`, `RE_BOX`, los bits de tratamiento) → **infinito numerable** |

Es decir: **el Venn clásico es finito —ocho— y con esos ejes deja de serlo.** No es una metáfora;
es una cuenta.

**Y el punto que el autor subraya, que es el que de verdad importa:** orden y ranking son **dos
ejes que él nombró, no la lista completa**. La lista de ejes es ella misma abierta — se podría
distinguir por procedencia, por antigüedad, por máscara de permisos, por composición recursiva de
asociaciones previas. Cada eje nuevo multiplica la población otra vez. En sus palabras: *"puedo
inventar lo que sea"*, y en los términos de su propio método, es un **censo deductivo**: la
población de vistas existe y es infinita; lo que falta no son los casos, es que alguien los
construya.

🟨 **La matemática del salto tiene antecedente; la aplicación no.** Pasar de álgebra de conjuntos
a conjuntos **con selección y con orden** es el movimiento de **Codd (1970)**: el álgebra
relacional que fundó las bases de datos, donde `select` y `order by` son exactamente esos dos
ejes. Que el autor haya reconstruido ese salto solo es la novena convergencia del documento.

**Lo que no tiene antecedente es dónde lo aplica.** Un espacio de capacidades de un sistema
operativo no es una tabla: sus elementos son derechos sobre memoria viva, y entregarlos en un
orden o filtrados por un criterio **cambia lo que el hijo puede hacer**, no solo lo que puede
leer. `asociar` con los modos 4 en adelante no sería una consulta: sería **un lenguaje de
consulta que reparte poder**. De eso no conozco ningún precedente.


## 2.19 Saludos: una marca por familiar, no una cola
`so/ambientes.inc:1428-1577` — una cabina guarda **una marca por familiar** que la saludó, por
muchas veces que salude; un saludo mandado antes de la espera nunca se pierde.

🟦 **Conocido, y es la decisión correcta.** Es exactamente la semántica de las **señales de
Unix** (no se encolan, se marcan) y del `eventfd` en modo semáforo; el equivalente moderno es
un canal con capacidad 1. Colapsar avisos repetidos evita que un vecino charlatán te llene la
memoria, y guardar la marca evita la carrera clásica entre mandar y esperar.

## 2.20 El ensamblador: dos pasadas, tabla con invalidación por generación
`so/pdp/ensamblador/ensamblador.jsm:489-540,1706-1812` — tablas hash con sondeo lineal y
entradas `{nombre, bytes, valor, generación}`: al empezar cada fuente se incrementa `V_GEN` y
una entrada de otra generación **se considera libre**. No hay borrado.

🟦 **Conocido.** Es **invalidación por época** (*generational / epoch invalidation*), el truco
estándar para vaciar una tabla en O(1); se usa en tablas de transposición de ajedrez, en
sistemas de entidades y en caches de compiladores.

## 2.21 Huella con dependencias descubiertas en la primera pasada
`ensamblador.jsm:294-308,421-486` — la huella de una fuente es FNV-1a de la **tabla del
ensamblador** más la fuente más **cada archivo incluido**, acumulado en la pasada 1. Por eso la
primera pasada siempre corre: es la que aprende los includes.

🟦 **Conocido.** Es **construcción incremental con dependencias descubiertas**: el `-MD` de
`make`, el *direct mode* de `ccache`, la huella de entradas de Bazel. Incluir la tabla del
propio ensamblador es la misma precaución del §1.8.

## 2.22 ⭐ Pruebas exhaustivas del ensamblador contra FASM
`so/pruebas/correr.sh` — cada fuente armada por el ensamblador PDP debe salir **byte por
byte** igual a la de FASM (la del propio ensamblador incluida), y
`herramientas/combinaciones.awk` genera **toda combinación de cada instrucción** y las compara.
Ésas son las 1,5 millones de líneas generadas del censo.

🟩 **Variante fuerte de algo conocido.** La prueba diferencial contra una implementación de
referencia es estándar; lo que casi nadie hace es **exhaustiva** en vez de aleatoria. Con 24
opcodes y campos chicos el espacio es enumerable, y el autor lo enumeró. Eso convierte
"probablemente correcto" en "verificado sobre todo el dominio" para la codificación de
instrucciones. Es el tipo de afirmación que un revisor valora, y conviene decirla con ese
nombre.
---

# Capítulo 3 — Razar / lectura: el juez y los sentidos

La mitad que lee un libro y saca estructura. Unos 30.000 renglones. No hay red neuronal, no
hay gradientes y no hay reglas del castellano escritas a mano: todo sale de contar y de un
juez que mide bits.

## 3.1 ⭐ El juez: longitud mínima de descripción, hecha bien
`pulso.inc:1127` — una pieza vale
`n·(log2(2N) + log2(n) − log2(c(low)) − log2(c(high))) − 2·log2(U)`.

🟦 **Conocido, y correctamente aplicado.** Es un **código de dos partes**: lo que cuesta
nombrar el modelo (`2·log2(U)`) más lo que el modelo ahorra en los datos. Ésa es la
**longitud mínima de descripción** de **Rissanen (1978)**, y por el teorema de Shannon
equivale a predecir mejor. Es lo que hace que el puntaje **no dependa de la tarea**: no mide
"¿acertaste sinónimos?", mide "¿lo mismo dicho con menos?".

Dos detalles que elevan esto de "usa MDL" a "sabe lo que hace":

- **`log2(n)/2` por cada tasa libre** (`casa.inc:251`, `pulso.jsm:1622`, `lector.jsm:712`). Esa
  media es exactamente la penalización por parámetro de la **complejidad estocástica** de
  Rissanen, la misma constante que aparece en el **BIC** (Schwarz, 1978). No es un número
  elegido: es el que corresponde.
- **El estimador de Krichevsky–Trofimov** `(BL + ½)/(NQ + 1)` en `pulso.jsm:1622`. Es el
  estimador de **Krichevsky y Trofimov (1981)**, el que usa el *Context Tree Weighting* y la
  compresión sin pérdida seria. Usar KT en vez de la frecuencia cruda es la decisión que evita
  que un suceso nunca visto cueste infinito.

Y una decisión metodológica fuerte: **la evidencia es el máximo** entre esta lectura, la
memoria y lo recibido de otro Razar, **nunca la suma** (`pulso.inc:1127`). Sumar evidencia de
fuentes que comparten origen es el error clásico de doble conteo; tomar el máximo lo evita de
raíz.

## 3.2 El pedido dormido: mayoría con dos números
`pulso.inc:640,772` — un pedido guarda `{clave, silueta, peso}`: si llega lo mismo el peso
sube, si llega otra cosa baja, y si llega a 0 el nuevo toma el lugar.

🟦 **Conocido, y el autor lo nombra.** Es el **voto de mayoría de Boyer–Moore** (1981) y su
generalización con pesos (**Misra–Gries**, *Space-Saving*): el elemento dominante de un flujo
con memoria constante. Aparece también en `sentido.jsm:1801` para las flechas.

## 3.3 Conceptos sin umbral: unión-hallar con enlace por bits
`pulso.inc:1326,1439,1462` — cada palabra se une a aquella con la que más bits ahorra; los
grupos que forman esos enlaces son los conceptos. **Sin umbral.**

🟦 **Conocido, y la ausencia de umbral es la gracia.** Es **unión-hallar** (Tarjan) con
compresión de caminos, y el criterio de enlace es el de **agrupamiento por enlace simple**
(vecino más cercano). «Sos de la familia de quien más te parecés» es la definición exacta del
*single linkage*. Nota honesta para el documento: el enlace simple tiene un defecto conocido
—el **encadenamiento**, donde una cadena de parecidos junta todo— y el propio autor lo detectó
y lo corrigió en otro lado (§3.9).

## 3.4 El corte en dos: Otsu, calculado exhaustivamente
`negacion.inc:775` — ordena los valores y prueba **todas** las particiones, quedándose con la
de máximo `w0·w1·(media0 − media1)²`.

🟦 **Conocido, y es exactamente el método.** Ése es el criterio de **Otsu (1979)** para
umbralizar una imagen, idéntico al **discriminante de Fisher** y a los *natural breaks* de
Jenks. Que esté aplicado a separar "estructura" de "mueble" en vez de a píxeles es un traslado
limpio: el problema es el mismo —partir una distribución en dos— y la solución correcta es la
misma. Y acá se calcula exhaustivamente, no por aproximación.

## 3.5 ⭐ Destilar el «no» por cinco propiedades
`negacion.inc:45` — nada nombra al interruptor de la negación. Se lo encuentra por cinco
pruebas: que sacándolo lo que queda también se dice; que lo que sigue cambia; que no es cosa
de la que se habla; que es la puerta más ancha; y que mayormente es la puerta.

🟩 **Variante propia.** Hay literatura sobre **inducción de categorías gramaticales** a partir
de distribución (§3.7), pero destilar **un operador lógico concreto** sin nombrarlo, por un
conjunto de propiedades distribucionales, con un corte de Otsu decidiendo cuáles son anchas,
no lo ubico como receta publicada. Lo más cercano es la inducción de palabras funcionales en
adquisición del lenguaje, pero sin este nivel de prueba por propiedades.

## 3.6 Las ventanas y los esqueletos: patrones aprendidos, no escritos
`pulso.inc:400,466` y `sentido.jsm:586-755` — toda ventana de tres o cuatro palabras; dos
extremos y una a tres piezas en el medio; el medio es el esqueleto.

🟦 **Conocido, y es una familia grande.** Los patrones léxico-sintácticos para sacar
relaciones son los **patrones de Hearst (1992)** ("X tales como Y" → hiponimia). La diferencia
—y es la que importa— es que Hearst los **escribió a mano** y acá **se descubren**. Esa línea
también existe: **Snow, Jurafsky y Ng (2004)** aprendieron patrones de hiponimia, y
**Espresso** (Pantel y Pennacchiotti, 2006) los arranca por refuerzo mutuo. Así que la
categoría correcta es 🟦, con la salvedad de que acá el descubrimiento es **total**: ningún
patrón semilla, ninguna relación nombrada de antemano.

## 3.7 ⭐ Las nueve maneras: marcos frecuentes
`sentido.jsm:4553,4532` — cada aparición de una instrucción trabaja entre lo de su izquierda y
lo de su derecha, cada uno **mueble, fundamento o límite: nueve maneras**. Toda manera que el
libro muestre **dos veces** es una función probada.

🟨 **Convergente con un resultado conocido de psicolingüística.** Los **marcos frecuentes**
(*frequent frames*) de **Mintz (2003)** son exactamente eso: contextos A_B que rodean a una
palabra y que, solos, bastan para inducir categorías gramaticales en el habla dirigida a
niños. Mintz usó pares de palabras concretas; acá los extremos están **abstraídos a tres
clases**, lo que es un paso más —y una generalización razonable del mismo hallazgo.

## 3.8 El contexto de segundo orden
`hilos.jsm:8216` (nitidez) y `sentido.jsm:6906` (parientes por Jaccard) — dos palabras se
parecen si **comparten lugares**, no si aparecen juntas.

🟦 **Conocido, y es el mecanismo central de la semántica distribucional.** La distinción
sintagmático (aparecer junto) contra paradigmático (aparecer en el mismo lugar) es vieja —
**Firth (1957)**, **Harris (1954)**— y la versión operativa con *slots* sintácticos es **Lin
(1998)**. El salto de 17% a 3,2× que el autor midió al pasar de lo primero a lo segundo
**reproduce** lo que la literatura predice: la similitud paradigmática captura sinonimia; la
sintagmática, asociación temática. Conviene decirlo así en el documento — no debilita el
resultado, lo **ubica**, y un revisor lo lee como señal de que el autor dio con el mecanismo
correcto.

## 3.9 ⭐ Idiomas por elección mutua, para no encadenar
`pistas.inc:412,759` — dos libros hablan el mismo idioma cuando **cada uno es el más cercano
del otro** por Jaccard de vocabularios base. El comentario dice el porqué: evitar que una
cadena de cercanos junte todos los libros, *"como hicieron las familias"*.

🟦 **Conocido, y el diagnóstico es correcto.** Es agrupamiento por **vecino mutuo más
cercano**, y el defecto que evita —el **encadenamiento** del enlace simple— es precisamente el
que la literatura le reprocha a ese método. Lo notable no es la solución: es que el autor
**encontró el defecto en su propio sistema, lo nombró y lo corrigió** en el lugar donde dolía.
Eso es lo que un revisor busca.

## 3.10 Idiomas por susurro chino
`idioma.inc:31` — cada palabra toma, una y otra vez, el idioma que más pesa entre sus vecinos,
hasta que nada cambia.

🟦 **Conocido y citado por el propio código**: *Chinese Whispers* (**Biemann, 2006**),
propagación de etiquetas en grafos. Nada que agregar: está bien usado y bien atribuido.

## 3.11 Morfología inducida: las piezas de las palabras
`hilos.jsm:9355` — cada palabra se corta en cada punto posible (nunca en medio de una letra
UTF-8, raíz ≥ 3 bytes); el peso de un cambio es **para cuántas raíces sirve**.

🟨 **Convergente con la línea principal de inducción morfológica.** El criterio "una
terminación vale por cuántas raíces sirve" es el corazón de **Linguistica** (John Goldsmith,
2001) y de **Morfessor** (Creutz y Lagus, 2002/2007), que lo formalizan — con MDL, igual que
acá. Que el autor haya llegado al mismo criterio desde su propio juez de bits es convergencia
limpia: el mismo principio produce el mismo algoritmo.

## 3.12 Ortografía: legalidad de pares de letras aprendida del corpus
`sentido.jsm:5337,5651` — un par de letras se prueba cuando **dos palabras distintas** lo
tienen; una palabra con un par nunca probado se lee como la palabra legal que esté **a una
letra de distancia** o sea la misma con repeticiones apretadas.

🟦 **Conocido, con las dos mitades estándar.** Es un **modelo de bigramas de caracteres** como
detector, más **corrección por distancia de edición 1** (Damerau 1964, Levenshtein 1966) —el
esqueleto del corrector de Norvig y de casi todo corrector práctico. La diferencia: la
legalidad **no viene de un diccionario**, se aprende del libro. Eso hace que funcione en un
idioma del que no se tiene diccionario, que es justamente el escenario del proyecto.

## 3.13 El lector y su modelo nulo
`lector.jsm:521` — tapa cada palabra y la predice de tres maneras: **eco** (la más frecuente),
**izquierda** (la que más sigue a la anterior) y **dos lados**
(`C(p,x)·C(x,n)/C(x)`). Y `:647-728` pone el costo en bits de cada camino.

🟦 **Conocido, y es buena metodología.** El eco es una **línea base de clase mayoritaria**:
sin ella, cualquier número parece bueno. Comparar los tres en **bits** y no en aciertos es lo
correcto, porque los bits incluyen el costo del modelo. Es evaluación **precuencial**, en la
tradición de Dawid y de la compresión como medida de aprendizaje.

## 3.14 El índice: codificación frontal y bloques de √n
`comer.jsm:1-35` — las palabras en piezas de `√(palabras)`, cada una guardando **lo que
comparte con la anterior** más lo que le sigue, en Elias gamma; los renglones en **Rice** con
el parámetro elegido probando los 16 y quedándose con el más corto (`comer.jsm:1618`).

🟦 **Conocido, de libro de texto.** Es **codificación frontal** (*front coding*) sobre un
vocabulario ordenado, con bloques de raíz cuadrada para que lo que hay que tener en memoria
sea mínimo, y **listas de ocurrencias codificadas por diferencias** con **Golomb-Rice**. Todo
eso está en *Managing Gigabytes* (Witten, Moffat y Bell): es el diseño estándar de un índice
invertido. Elegir el parámetro de Rice probando los 16 en vez de estimarlo es más caro y más
exacto.

## 3.15 ⭐ La biblioteca no guarda lo que una palabra dice
`comer.jsm:2650` — una palabra se guarda como los ocho bytes del FNV-1a de sus letras. Se la
encuentra preguntando con la misma huella, nunca con el texto.

🟩 **Variante propia con parientes claros.** El truco de representar por hash y no por texto
es el *hashing trick* (**Weinberger et al., 2009**) en aprendizaje automático, y el principio
de los **índices cifrados / búsqueda sobre datos ocultos**. Acá la motivación es distinta de
las dos: el objetivo es que **lo aprendido sea compartible entre Razares sin compartir el
libro**. Eso tiene un nombre moderno —aprendizaje federado— pero la implementación es mucho
más simple y, para el caso, suficiente.

## 3.16 ⭐ Las siluetas viajan, pero no se creen
`pulso.jsm:5949,6081,6350` — lo que llega de otro Razar **se prueba como un órgano**: examen
con su memoria, y con su memoria más lo recibido; si gana, se adopta. Nunca se cree.

🟩 **Variante propia de un problema actual.** Fusionar modelos de varios agentes es un área
viva (aprendizaje federado, *model merging*), y el patrón de acá —**adoptar solo si mejora un
puntaje propio sobre datos propios**— es la validación por retención aplicada a la
colaboración. La parte que no suele estar: **las puertas se quedan en casa**. Lo que depende
del libro propio no se exporta; solo viaja lo que tiene sentido en cualquier libro (la huella
de una palabra es la misma en todos). Esa separación entre lo trasladable y lo local es una
decisión de diseño fina y vale explicarla.

## 3.17 ⭐ Pensar es caminar: rondas hasta el punto fijo
`pistas.inc:165,1390` — cada ronda es una vida nueva (pedido 36, rehacerse). **Cuando una
ronda no alcanza nada nuevo, se dice la respuesta de esa ronda; antes, no se dice nada.**

🟦 **Conocido, y la equivalencia es exacta.** Iterar hasta que no se derive ningún hecho nuevo
es la **semántica de punto fijo** de la programación lógica: la evaluación ascendente *naive*
y *semi-naive* de Datalog. El `think` de `sentido.jsm:3303` es la variante **a lo ancho**
(*breadth first*) sobre el grafo de hechos, con la regla "una palabra ya pensada no se vuelve
a preguntar", que es precisamente lo que garantiza la terminación. Nombrar esto como "punto
fijo de Datalog" en el documento le ahorra media hora de lectura a cualquier revisor con
formación en bases de datos o en lógica.

## 3.18 Una ruta, un voto
`sentido.jsm:3843,3880` — la primera vez que una palabra encuentra un pensamiento, **cada ruta
distinta por la que se llegó antes vota también**; volver por la misma ruta no suma nada. La
huella del diario es la **suma** de las huellas de las rutas, así ni el orden ni repensar
alteran nada.

🟩 **Variante propia.** La **activación propagada** (Collins y Loftus, 1975) es el pariente
viejo; la novedad acá es contar **rutas distintas** y no visitas, que es la defensa correcta
contra el doble conteo cuando el grafo tiene ciclos. Y usar una suma como huella para que sea
invariante al orden es el mismo razonamiento que un **CRDT** conmutativo. Es una decisión
chica con una consecuencia grande: dos Razares que leyeron lo mismo en distinto orden tienen
la misma huella.

## 3.19 La regla de la anécdota
Transversal (`sentido.jsm:996,1129`, `pulso.inc:1125`, `negacion.inc`): una propiedad se
prueba con **dos pares diferentes al menos**. Es el único umbral de conteo de todo el sistema.

🟦 **Conocido como idea, notable como disciplina.** Es el **soporte mínimo** de la minería de
patrones (Agrawal y Srikant, 1994), donde habitualmente se ajusta como perilla. Acá está fijo
en 2, con una razón declarada —una vez es anécdota, dos es patrón— y aplicado en todas partes.
Que todo el sistema tenga **un solo umbral de conteo** es una propiedad que conviene afirmar
explícitamente: hay muy poco que ajustar, y por lo tanto muy poco que sobreajustar.

## 3.20 El tamaño del pedazo, declarado como criterio
`vigia.jsm:156` — `PIECE` = 4 MB, cortado después del primer fin de línea. El comentario
**declara que es criterio, no medición**, y transcribe lo medido: comer cuesta **~115 bytes de
memoria por byte de texto** (2 MB → 243 MB; 4 MB → 473 MB).

🟩 **Práctica correcta, poco común.** No hay técnica que citar: hay una **constante
confesada**. Un número inventado y declarado como tal se puede corregir; uno disfrazado de
medición, no. Esto aparece varias veces en el código (`organo` con sus 16 letras, la memoria
que se divide a la mitad) y es, en sí mismo, un rasgo del proyecto que el documento debería
señalar.
---

# Capítulo 4 — Razar / cardumen: el cubo y la inferencia

El cubo (una retícula n³ que propaga olas) y `hilos`, la máquina que saca relaciones de un
libro y las sostiene o las refuta. Unos 30.000 renglones.

> ⚠️ **Corrección al margen, que me toca a mí.** En conversaciones anteriores diagnostiqué un
> «portero» en `hilos.jsm:3478-3500` y dije que `hrs_glue` usaba `HCCNT` como piso cuando
> debería ser denominador. **Las dos cosas eran falsas.** No existe ningún "portero" en el
> código (cero ocurrencias del término); esas líneas son el llenado de la tabla `HWGT`/`HWGE`.
> Y `hrs_glue` está en `hilos.jsm:5673` y **no lee `HCCNT`**: lee `HNANT`, que es una bandera
> booleana por relación ("dice un par en los dos sentidos: es pegamento"). `HCCNT` es un
> conteo de pares y se usa como conteo, con umbral ≥ 2, en `hl_derive:4518`. El examen de
> admisión real es `hl_reason` (§4.6) y está bien construido. Dejo la corrección escrita acá
> porque una crítica equivocada que queda flotando hace más daño que una duda.

## 4.1 ⭐ La ola: umbral y armonía
`cardumen_cubo.jsm:731-818` — cada paso, las piezas despiertas empujan a sus seis vecinos:
`AINP[q] += peso` y `AMASK[q] |= 1 << (d xor 1)`. Una pieza despierta si fue empujada, si
`AINP ≥ 100`, y si **`2 × popcount(AMASK) ≤ vecinos`** (si no, queda *ahogada*).

🟨 **Convergente con dos mecanismos conocidos, y la combinación es propia.** La primera mitad
—acumular entrada y disparar al pasar un umbral— es una **neurona de integración y disparo**,
el modelo básico de las redes de impulsos. La segunda —*ahogarse* si demasiadas direcciones
empujan— es lo contrario de lo que haría una neurona común, y es **inhibición lateral** /
**codificación dispersa**: la pieza responde a un estímulo *enfocado*, no a uno difuso. En una
red neuronal clásica, más entrada es siempre más activación; acá, una entrada que viene de
todos lados **no significa nada**.

Y el detalle estructural que vale subrayar: **`AINP` y `AMASK` son por pieza, no por ola**.
Varias olas distintas suman en la misma tabla, y una pieza que despierta **pasa a pertenecer a
todas las olas que la empujaron**. Ahí es donde dos saludos distintos se encuentran. Eso no es
un efecto secundario: es el mecanismo.

## 4.2 ⭐ El aprendizaje de la forma: temporización, con ventana de ±1
`cardumen_cubo.jsm:906-1001` — si el vecino despertó y **`(paso_q − paso_i)² ≤ 1`**, el peso
sube; si no despertó, baja 1. La tasa de cada pieza baja de a 1 con piso en 1.

🟨 **Convergente con la plasticidad dependiente del tiempo.** Reforzar una conexión cuando los
dos extremos se activan en pasos contiguos y debilitarla cuando no, es **STDP**
(*spike-timing-dependent plasticity*, Bi y Poo 1998), la forma temporal de la regla de Hebb
(1949). La ventana de ±1 paso es la versión discreta de la ventana temporal de STDP. La tasa
que decae con piso es el **descenso de la tasa de aprendizaje**, estándar en todo lo que
aprende.

## 4.3 ⭐ `conserve`: el peso total se conserva
`cardumen_cubo.jsm:387` — si el total de una pieza se apartó del que tenía al nacer, todos sus
pesos se reescalan `w' = (w·born + now/2) / now`, recortados a 255, y el sobrante se reparte
de a uno.

🟨 **Convergente con un mecanismo biológico conocido, y es importante.** Reescalar todas las
conexiones de una unidad para mantener constante su total es **escalado sináptico** /
**plasticidad homeostática** (Turrigiano et al., 1998), y su versión algorítmica es la
**normalización de pesos** de la regla de Oja (1982). Resuelve el problema que tiene Hebb
puro: sin normalizar, las conexiones fuertes se refuerzan hasta saturar y la unidad deja de
discriminar. Que el autor haya puesto la normalización por su cuenta, y como opción medible
(`conserva` en la casa, `conserva_prueba.sh`), dice que vio el problema.

## 4.4 El nulo por cruce: el mundo barajado
`hilos.jsm:1195` — por cada par se cuenta también su **par cruzado**: la segunda palabra
tomada `HCRS` lugares antes. Y `hl_score` (`:5050`) devuelve **`2·iguales − cruzados`**,
exigiendo `iguales ≥ 2`.

🟦 **Conocido, y es la pieza metodológica más importante del archivo.** Construir un control
barajando los datos y exigirle a la señal que le gane se llama **datos sustitutos**
(*surrogate data*, Theiler et al., 1992) o prueba de permutación. Es la forma correcta de
contestar "¿esto no saldría igual por azar?" sin suponer ninguna distribución. Que el nulo
esté **adentro del motor** y no en un script aparte significa que cada relación que sobrevive
ya le ganó a su propio azar.

A esto se suma el **distractor deliberado** (`voluntad_acertijos.jsm:2351`): un mecanismo
inútil a propósito, puesto para comprobar que nunca gane. Eso es un **control negativo** en el
sentido estricto de un laboratorio, y es raro verlo en software.

## 4.5 Dependencias funcionales: «una B por cada A»
`hilos.jsm:4370,3217,3832` — una propiedad vale si ninguna palabra recibe dos valores
confirmados en ese lado (`HBROK == 0`) y la sostienen al menos dos (`HSUPP ≥ 2`). Una
contradicción es que otra relación le dé a esa misma palabra **otro** valor.

🟨 **Convergente con un problema clásico de bases de datos.** «Un valor de B por cada valor de
A» es, literalmente, una **dependencia funcional** A→B, y descubrirlas a partir de los datos
es un área con nombre y algoritmos: **TANE** (Huhtala et al., 1999), **FastFDs**, y todo el
trabajo de descubrimiento de dependencias. Detectar la violación de una FD como señal de
contradicción entre dos hipótesis es un uso elegante del mismo concepto. Vale citarlo: ubica
el mecanismo en una literatura madura.

## 4.6 El examen de admisión de una relación
`hilos.jsm:5290` (`hl_reason`) — exige, en orden: **≥ 2 confirmaciones**; que ninguna de las
dos sea pegamento; que **nada la diga al revés**; que ninguna propiedad la refute; y, si ya
cayó antes, que haya despertado. Después, en `hl_merge:5071`, un segundo filtro: `hl_explains`
y **elección mutua**.

🟦 **Conocido en sus partes, bien ensamblado.** La elección mutua es otra vez el **vecino
mutuo más cercano** (§3.9). `hl_explains` (`:4009`) exige que lo explicado supere
estrictamente lo no explicado **en los dos sentidos**, que es un criterio de cobertura
bidireccional razonable. Nada acá es exótico; lo bueno es el orden: lo barato primero, lo caro
al final.

## 4.7 ⭐ El coma: mantenimiento de verdades
`hilos.jsm:5368,5428,5446` — una hipótesis refutada queda en `HREF` **con su contexto** (la
gente que no explicó) y la vuelta en que cayó. Despierta si **una palabra de su contexto fue
tocada** después, y solo una unión toca palabras.

🟨 **Convergente con un sistema clásico de inteligencia artificial, y la equivalencia es
limpia.** Eso es un **sistema de mantenimiento de la verdad** (*truth maintenance system*,
**Jon Doyle, 1979**; el ATMS de **de Kleer, 1986**): las creencias retractadas no se borran,
se guardan **con su justificación**, y se reviven cuando la justificación cambia. El "coma" y
el "despertador" del autor son exactamente justificación y revisión de creencias.

Esto importa doble, porque la regla de la casa —*nada se descarta, lo que falta es el marco*—
resulta tener un nombre en el oficio y cuarenta años de literatura detrás. El documento gana
mucho diciéndolo: no debilita la idea, la respalda.

## 4.8 Deducción como premisa, con muerte si nadie la usa
`hilos.jsm:4446,4557` — donde dice `a-b` y `b-c`, la deducida dice `a-c`; exige ≥ 2 formas,
≥ 2 pares, no ser pegamento y tener propiedad. Si ninguna unión la toma, en la vuelta
siguiente se le ponen los pares en 0 y puede volver a deducirse.

🟦 **Conocido.** Es **clausura transitiva** con evaluación ascendente, y la muerte por desuso
es el conteo de soporte de los hechos derivados (el mismo problema que resuelve el
mantenimiento de vistas materializadas). El ciclo del archivo `pendiente` (`:6523`) —dos formas
que compartieron **un** par, insuficiente para unir, guardadas para el libro siguiente— es
acumulación de evidencia entre corridas, y está bien resuelto: **nunca crea la hipótesis sola**,
solo suma una confirmación si este libro también la tiene.

## 4.9 ⭐ Imaginar: completar lo que falta, y el voto abierto
`hilos.jsm:7579,7652,7738` — donde "a y b" y `a` tiene un rol que `b` no tiene, **se imagina
que `b` lo tenga**, y se escribe con su marca (`i` = imaginado de pares propios, `a` = del
azar). Después, cualquier libro que pueda comprobarlo lo confirma. **Lo no confirmado nunca se
descarta: se reescribe para los libros siguientes.**

🟨🟩 **Mitad conocida, mitad propia.** Predecir una relación que falta a partir de las que hay
es **completar un grafo de conocimiento** (*link prediction*), un área enorme. Lo que **no** es
habitual es el protocolo: la predicción **se escribe antes**, con su marca de control, y se
deja abierta indefinidamente hasta que llegue un libro que pueda juzgarla. Eso es
**preregistro**: fijar la predicción antes de ver el dato que la decide. Que un sistema lo
haga solo, y que mantenga en paralelo la tasa del azar (`a`), es una propiedad metodológica
que conviene explicar con todas las letras — es lo que separa "mi sistema imagina cosas" de
"mi sistema hace predicciones falsables y lleva el puntaje".

## 4.10 Dos nombres para un mismo lugar
`hilos.jsm:4170` (`hx_rescue`) — un par que una relación dice y la otra no se rescata si uno
de los nombres aparece con el mismo socio del otro lado en ambas ("obed" / "jobed").

🟦 **Conocido.** Es **resolución de entidades** / enlace de registros por vecindario
compartido: dos cadenas distintas son la misma cosa si ocupan el mismo lugar en la estructura.
Es la base de los sistemas de desduplicación, y acá cae naturalmente del mismo mecanismo que
todo lo demás.

## 4.11 Nitidez: lugares compartidos
`hilos.jsm:8216,8841` — un **lugar** es (forma, lado); dos palabras lo comparten; no cuentan
los lugares de formas hechas solo de palabras de la mitad.

🟦 **Conocido, y es el mecanismo correcto.** Ver §3.8: es similitud **paradigmática** sobre
*slots* sintácticos, la línea de **Lin (1998)**. Excluir las formas hechas de palabras
funcionales es el equivalente de quitar las dimensiones sin información — lo que en el oficio
se hace con IDF (**Spärck Jones, 1972**) o con PMI. Acá se hace con un corte duro (la mitad
acumulada del texto), que es más brusco pero no requiere elegir un peso.

## 4.12 Contextos de longitud creciente, con parada por soporte
`memoria_pares.jsm:4051,4200` — los contextos se alargan **solo donde el más corto lo dicen
dos pares o más**; se para cuando ninguno más largo se cuenta.

🟦 **Conocido.** Es un **modelo de Markov de orden variable**: la poda por conteo mínimo es lo
que hacen PPM, los *context trees* y los modelos de orden variable (Begleiter, El-Yaniv y
Yona, 2004). La frase del código —"lo que dice una oración es memoria, lo que dicen dos es
regla"— es el criterio de soporte mínimo otra vez (§3.19), aplicado a la profundidad del
contexto.

## 4.13 El encadenado: un solo lugar que cambia
`encadena.jsm:475,1349` — una clase es un **paso** si la dicen dos casos o más y, entre las
palabras de sus respuestas, **cambia exactamente un lugar**. Las preguntas compuestas se arman
desde la derecha, lo más profundo primero.

🟨 **Convergente con la generalización menos general.** "Dos casos iguales salvo en una
posición" es **antiunificación** / *least general generalization* (**Plotkin, 1970**), la
operación básica de la programación lógica inductiva (FOIL, Progol). Y resolver la pregunta
desde la parte más profunda hacia afuera es el encadenamiento hacia atrás de un motor de
reglas. El armado **multi-salto** es el formato de los bancos de preguntas composicionales
modernos.

## 4.14 Validación cruzada dejando uno afuera
`voluntad_acertijos.jsm:2216` (`m6_choose`) — cada memoria firme se deja fuera por turno, cada
mecanismo se construye con las otras y se le pregunta la que falta: **acierto +1, error −1,
silencio 0**. Gana el que mejor se explica a sí mismo.

🟦 **Conocido, y es exactamente lo correcto.** Es **validación cruzada dejando uno afuera**
(*leave-one-out*) usada como criterio de selección de modelo. Que el silencio valga 0 y no
−1 es una decisión fina: premia no contestar cuando no se sabe, en vez de forzar una respuesta.

## 4.15 Crecer hasta que crecer no sirva
`voluntad_acertijos.jsm:4231-4364` — el cubo nace con lado `N0`; **mientras siga errando**
nace uno más ancho; **cuando uno más ancho ya no yerra menos, vuelve al mejor** y para.

🟦 **Conocido.** Es **parada temprana** combinada con búsqueda de tamaño de modelo: crecer
mientras rinda y quedarse con el mejor visto. Es lo que hace la poda de arquitecturas y lo que
hacía *cascade correlation* (Fahlman, 1990). La variante de acá es honesta: no se queda con el
último, se queda con el mejor.

## 4.16 El corte elegido sobre una curva, con precio declarado
`voluntad_semilla.jsm:1181` — se autoexamina con sus propios marcos dejados fuera, arma la
curva de "cuántos aciertos dejaría de responder contra cuántos errores callaría" y elige el
corte que **pierde `PRECIO − 1` aciertos**.

🟦 **Conocido, y bien planteado.** Es elegir el **punto de operación** sobre una curva de
precisión-cobertura, con el costo relativo declarado como parámetro explícito en lugar de
escondido. Que el precio sea un número que el usuario pone, y no una constante enterrada, es
la forma correcta de exponer ese compromiso.

## 4.17 ⭐ `caminos.sh`: el estudio de ablación
`razar/cardumen/caminos.sh` — corre `hilos` tal cual y después **una vez por cada regla
suspendida, una sola a la vez**, y clasifica cada unión en tres cubos: *de todos los caminos*,
*del camino de siempre (se pierde sin esta regla)*, *de un camino nuevo (aparece sin ella)*.

🟩 **Variante bien hecha de un método estándar.** Es un **estudio de ablación**, de a una
perilla por vez, que es como se debe hacer. La parte que agrega valor es la **tercera
categoría**: las uniones que *aparecen* al sacar una regla. Un ablation típico mide cuánto se
pierde; éste mide también **qué se estaba tapando**. Para un sistema cuya regla de la casa es
"nada se descarta", es el instrumento exacto.

## 4.18 La comparación con el estado del arte, a presupuesto igualado
`razar/cardumen/convencional.sh` — compara contra **EGG** (la implementación de referencia de
los juegos de señalización de Lewis) con el presupuesto medido en partidas: una vuelta de
Razar = 1 partida, un lote de EGG = 32.

🟦 **Conocido, y es lo que hay que hacer.** Comparar contra la implementación de referencia del
campo, igualando el presupuesto de cómputo, es el estándar metodológico. Sin la igualación, el
número no dice nada; con ella, dice bastante.

Lo que conviene precisar es **qué alcanza esa comparación**: el juego de Lewis fue la
**primera** tarea, no la única. La misma arquitectura se midió después en el traductor de Morse
(05-nov), en acertijos de palabras resueltos por parecido con algo aprendido antes (06-nov), en
la máquina entera corriendo sobre un libro distinto del que aprendió (08-nov) y en las
analogías del MATS sobre 20 MB de Wikipedia (09-nov: 451 contra 117). **La transferencia está
medida.** Lo que existe solo para el juego de Lewis es el **cara a cara contra una
implementación de referencia a presupuesto igualado**; en las otras cuatro tareas todavía no hay
un rival convencional medido al lado. Ésa es la distinción que corresponde hacer, y no la otra.

## 4.18b ⭐ El órgano que se diseña solo, y la receta que pasa a la vida siguiente
`pulso.jsm:2486,4625,4416` (mutación y nichos) y `documentacion/razar/lectura.md:3168-3260` (las
recetas). Un **órgano** es un operador perceptual de 1 a 9 letras que el sistema arma **por
mutación contra el juez de bits** (§3.1) — no contra una tarea. Cuando uno gana, deja su receta
escrita en `tablero/Receta de Organos/<modelo>/<tipo>/recetas`: sus letras, su alfabeto, su nota y
su genoma.

La cadena medida:

| Órgano | Nota | Qué pasó |
|---|---|---|
| `6` | −1586 | basura por puntaje: no paga su nombre |
| `5` | 208 | el primero positivo, construido sobre el anterior |
| `16` | 2649 | `208 -> 2649 (+2441), antes: 5` |

Y la vida siguiente **nace sin órgano, lee la receta de su modelo y arranca con esa base**. La
adopción no es a ciegas: la mejor receta de cada tipo **rinde primero como candidata, en su
jaula**, sea del alfabeto que sea, y esos intentos no le restan intentos a la búsqueda.

🟨🟩 **Mitad convergente, mitad propia, y la mitad propia es la interesante.**

La mitad conocida: buscar la **arquitectura** en vez de los parámetros es **neuroevolución** y
**búsqueda de arquitecturas** (NEAT, Stanley y Miikkulainen 2002; NAS). Y conservar lo descubierto
entre corridas, con elitismo y un archivo de los mejores, es el patrón de los algoritmos
evolutivos con memoria y de la **búsqueda por novedad** (Lehman y Stanley, 2011).

Lo que **no** es habitual son dos cosas, y conviene decirlas separadas:

1. **El objetivo no es la tarea: es la compresión.** En neuroevolución y en NAS la aptitud es el
   desempeño en el problema. Acá la aptitud son **bits ahorrados** — el mismo juez que mide todo
   lo demás. Por eso un órgano mejor es mejor *para cualquier lectura*, no para el banco con que
   se lo entrenó. Es la diferencia entre optimizar el puntaje y optimizar el entendimiento, y es
   la razón de que no haya sobreajuste al banco: el banco no participa de la búsqueda.
2. **La receta se guarda por modelo y por tipo, y la huella informa pero no decide.** Un
   candidato de otro alfabeto **igual compite**, en su jaula y sin gastar intentos de la
   búsqueda. La regla declarada del autor —*"los ingredientes nunca se descartan; lo que se mira
   es qué hace y en qué es mejor"*— está implementada, no enunciada.

**Y el órgano `6` es el caso que justifica la regla.** Valía **−1586**: basura por puntaje, lo que
cualquier poda por aptitud habría tirado en la primera generación. Fue el escalón del que salió el
`5` (208) y después el `16` (2649). Podando por nota se perdía el único camino hacia arriba. En el
oficio esto tiene nombre: es el problema del **engaño** (*deception*) en los paisajes de aptitud,
y es exactamente lo que motivó la búsqueda por novedad de Lehman y Stanley. Acá se resuelve de
otra manera: **no se poda**.

## 4.18c ⭐ Una estadística para poblaciones que nadie enumeró

Esto no es un mecanismo más: es **el método de medición del proyecto**, y merece decirse junto
porque sus tres piezas están construidas y repartidas en el código.

**El problema que resuelve.** La estadística clásica necesita un **espacio muestral fijado de
antemano**: el p-valor, el z y el nulo se definen contra «lo que habría pasado si no hubiera
estructura», y eso exige saber cuál era el conjunto de cosas que podían pasar. Cuando lo que se
busca es **un mecanismo** —y el espacio de mecanismos posibles no está enumerado ni se puede
enumerar— ese instrumento no se aplica. No está mal: no existe.

Las tres piezas que lo reemplazan, todas en el repositorio:

**1. Un juez que no depende de la tarea** (§3.1, `pulso.inc:1127`). Bits ahorrados, código de dos
partes. No necesita saber cuál era el espacio: mide compresión. Un mecanismo mejor es mejor para
cualquier lectura, no para el banco con que se lo buscó — y por eso el banco no puede
sobreajustarse: **no participa de la búsqueda**.

**2. Un nulo sobre MECANISMOS, no sobre datos** (`pulso.jsm:2486,4416`). El control clásico baraja
los datos; acá se sortea **otro mecanismo del mismo generador** y se lo hace rendir el mismo
examen, en su jaula, con presupuesto. La pregunta deja de ser *"¿esto saldría igual con datos sin
estructura?"* y pasa a ser *"¿un mecanismo cualquiera, sacado de la misma bolsa, daría lo mismo?"*.

**3. El denominador: los intentos contados** (`documentacion/razar/lectura.md:1818`). No se reporta
el ganador: se reporta **el camino, el resultado y lo que costó**. Medido sobre el libro `vig`, 40
intentos por vida:

| | camino | final | intentos |
|---|---|---|---|
| escalador de siempre | 8 → 18 → 186 → 16 → 516 | **11.144** | **80** (2 vidas) |
| archivo por nichos | 6 → 5 → 16 → 716 → 516 | **11.144** | **160** (4 vidas) |

Los dos llegan al mismo lugar y uno paga el doble. Eso es una comparación con denominador, no un
resultado festejado. Y el archivo por nichos **se conservó igual** pese a empatar costando más —
comentario del autor en el código: *"que no lo mida no significa que no lo quiera"*.

🟨 **Convergente con una línea conocida, y es la décima del documento.** El nulo por mecanismo
sorteado del mismo generador es, exactamente, la **línea base de búsqueda al azar**: en búsqueda
de arquitecturas (NAS) el patrón de referencia es muestrear arquitecturas al azar del mismo
espacio y exigirle al método que les gane — y resultó ser una línea base sorprendentemente fuerte
(**Bergstra y Bengio, 2012**; confirmado después en toda la literatura de NAS, donde varios
métodos publicados no le ganaban). Que el autor la haya puesto por su cuenta, y como jaula con
presupuesto, es la práctica correcta.

**Lo que no tiene equivalente que yo ubique es la combinación de las tres.** Un juez de
compresión independiente de la tarea, un nulo muestreado del espacio de mecanismos, y el costo en
intentos reportado junto al resultado. Por separado cada pieza tiene literatura; juntas forman
algo que se puede llamar por lo que hace: **una estadística para poblaciones que nadie enumeró**.

## 4.19 Los generadores de azar, nombrados
`pulso.jsm` (xorshift 13/7/17), `sentido.jsm:3558` y `memoria_pares.jsm:1237` (splitmix64),
`cardumen_cubo.jsm:132` (LCG 1103515245 / 12345).

🟦 **Conocidos y correctamente elegidos.** Xorshift es de **Marsaglia (2003)**; splitmix64 es
de **Steele, Lea y Flood (2014)** y sus constantes son las publicadas; el LCG es el de la
norma C. Para sortear mutaciones y confusiones alcanzan de sobra. Vale una línea en el
documento: no hay nada casero en la aleatoriedad.

## 4.20 La semilla reproducible
`sentido.jsm:3622,3672` — la semilla sale del genoma, de **la suma de las huellas de todas las
etiquetas de la biblioteca** (para que el orden no importe), de la pregunta y de la palabra.
Mismo Razar, misma historia, misma pregunta: misma elección.

🟩 **Variante propia con buen fundamento.** Es **reproducibilidad por semilla derivada del
estado**, y la suma —invariante al orden— es el mismo razonamiento conmutativo del §3.18. La
consecuencia es fuerte y vale decirla: **dos Razares que leyeron los mismos libros en distinto
orden eligen lo mismo**. Eso es exactamente lo que un revisor necesita para poder repetir una
corrida.
---

# Capítulo 5 — Síntesis

## 5.1 Lo que no le encontré equivalente

Cuatro piezas. Repito la advertencia: esto dice dónde buscar, no que no exista.

1. **`asociar`** (`so/ambientes.inc:1274-1426`). Álgebra de conjuntos —intersección,
   diferencias, unión— sobre los espacios de capacidades de **dos** procesos, materializada en
   el nacimiento de un tercero, con consentimiento bilateral obligatorio y permisos tomados
   como el `and` de los dos. No lo ubico en ningún sistema operativo que conozca. Ya tiene
   prueba (`so/pruebas/asocia_{0,1,2,3}.jsm`). **Candidato número uno a párrafo propio.**

2. **«La última parte»** (`so/remos.inc:428-477`). Decidir terminar en vez de ceder el turno,
   con el dato calculado **estáticamente del programa para que el programa no pueda mentir**.
   La heurística existe; la propiedad de que la pista no la dé el interesado, no la ubico.

3. **La armonía de la ola** (`cardumen_cubo.jsm:818`). `2·popcount(máscara) ≤ vecinos`: una
   pieza se **ahoga** si la empujan desde demasiados lados. Es inhibición lateral con una forma
   que no reconozco, y combinada con la acumulación por pieza **compartida entre olas** —que
   es donde dos saludos se encuentran— da un mecanismo de interferencia del que no tengo
   antecedente directo.

4. **La forma canónica del órgano como invariante de auditoría**
   (`pulso.jsm:3090,2767`). Canonicalizar es común; usar la forma canónica, más la corrida en
   orden inverso con la máquina en todo 1, como **prueba nula de que el órgano efectivamente
   leyó el libro**, no lo ubico. Es un autodiagnóstico de instrumento metido en el instrumento.

## 5.2 Lo que ya tiene nombre, y conviene que lo lleve

No es una concesión: es lo que hace que el trabajo se pueda leer. Un revisor que ve «MDL de
dos partes con penalización de ½·log n y estimador KT» entiende en diez segundos lo que de
otro modo le llevaría una hora deducir. Los que más rinden al nombrarlos:

| Pieza del proyecto | Nombre en el oficio | Cita |
|---|---|---|
| El juez | Longitud mínima de descripción, código de dos partes | Rissanen 1978 |
| El `log2(n)/2` por tasa | Penalización por parámetro / BIC | Schwarz 1978 |
| `(BL+½)/(NQ+1)` | Estimador de Krichevsky–Trofimov | KT 1981 |
| El pedido dormido | Voto de mayoría | Boyer–Moore 1981 |
| El corte en dos | Método de Otsu / discriminante de Fisher | Otsu 1979 |
| Los esqueletos | Patrones léxico-sintácticos aprendidos | Hearst 1992; Snow et al. 2004 |
| Las nueve maneras | Marcos frecuentes | Mintz 2003 |
| Nitidez | Similitud paradigmática sobre *slots* | Harris 1954; Lin 1998 |
| Las piezas de las palabras | Inducción morfológica por MDL | Goldsmith 2001; Morfessor |
| El coma y el despertador | Mantenimiento de la verdad (TMS) | Doyle 1979; de Kleer 1986 |
| «Una B por cada A» | Descubrimiento de dependencias funcionales | Huhtala et al. 1999 (TANE) |
| El nulo por cruce | Datos sustitutos / prueba de permutación | Theiler et al. 1992 |
| Las rondas hasta el punto fijo | Evaluación ascendente de Datalog | Semántica de punto fijo |
| Un lugar que cambia | Antiunificación / generalización menos general | Plotkin 1970 |
| Plantillas parchadas | Copy-and-patch | Xu y Kjolstad 2021 |
| El planificador reemplazable | Núcleo extensible acotado | SPIN 1995; VINO 1996; eBPF |
| El cobro por corrida | Medición de combustible | Wasmtime; gas de la EVM |
| El cartel | Espacio de capacidades | Hydra 1974; Mach; seL4 |
| Pesos que conservan el total | Escalado sináptico / regla de Oja | Turrigiano 1998; Oja 1982 |
| Ventana de ±1 paso | STDP | Bi y Poo 1998 |
| Punto fijo del ensamblador | Bootstrap de tres etapas | GCC; Thompson 1984 |
| Relajación de saltos | Instrucciones dependientes del alcance | Szymanski 1978 |

## 5.3 Lo que un revisor va a mirar primero, y qué contestar

**«¿El instrumento es suyo?»** El **banco es externo**: MATS/BATS en castellano, 1961 pares,
40 relaciones, descargado, no construido (`E:\bancos\mats_es`, con las cuatro carpetas
canónicas). El **puntuador** sí es propio, y es código auditable de pocas líneas. Decirlo en
ese orden desactiva la objeción más cara.

**«¿No será azar?»** El nulo está **adentro del motor**: cada relación tiene que ganarle a su
propio par cruzado (§4.4), y hay un distractor deliberado puesto para comprobar que nunca
gane. Eso es más de lo que trae la mayoría de los trabajos del área.

**«¿Cuántas perillas tiene?»** Muy pocas, y conviene decirlo con el número: el **único umbral
de conteo del sistema es 2** (§3.19). Los demás valores o se despejan de una medición (el
antirrebote de 67.803 ms, §2.16) o están **declarados como criterio** en el propio comentario
(el pedazo de 4 MB, las 16 letras del órgano, la mitad de la evidencia). Un sistema con una
sola perilla es un sistema difícil de sobreajustar.

**«¿Es reproducible?»** Sí, y por diseño: la semilla se deriva del estado y la huella de la
biblioteca es **invariante al orden** (§4.20). Dos corridas con los mismos libros en distinto
orden eligen lo mismo.

## 5.4 Los límites, dichos de frente

- **El autoalojamiento llega hasta el ensamblador del lenguaje**, verificado por punto fijo. Lo
  que todavía construye FASM es el **núcleo x86** y los motores de escalón 0, que están escritos
  en ensamblador x86-64. La comparación byte a byte contra FASM es cosa aparte: **es una vara de
  verificación elegida, no una dependencia** — se saca y el sistema se construye igual.
- **Nadie de afuera lo corrió todavía.** Todas las mediciones son del autor, en su máquina.
  Esto no invalida nada: lo deja en *replicable pendiente de réplica*, que es un casillero
  distinto de *probado*.
- **La transferencia está medida; el cara a cara, no.** La misma arquitectura corrió en cinco
  tareas: señalización de Lewis (contra EGG), Morse, acertijos de palabras, deducción sobre un
  libro entero y las analogías del MATS sobre Wikipedia. Lo que existe **solo para el juego de
  Lewis** es la comparación contra una implementación de referencia del campo con el presupuesto
  igualado.
- **Y hay una segunda transferencia, entre vidas** (§4.18b): el órgano que una corrida descubre
  queda escrito como receta y la corrida siguiente arranca con esa base en lugar de cero, con la
  cadena de mejora medida (−1586 → 208 → 2649). Eso es lo que sostiene que el sistema **acumule**
  en vez de empezar de nuevo.
- **El segmento ELF es RWX único**: simplicidad, no seguridad.
- **Hay dos agrupamientos por enlace simple** (§3.3) donde el encadenamiento puede morder. El
  autor ya lo detectó y lo corrigió donde dolía (§3.9); vale revisar si el otro lo necesita.

## 5.5 Lo que este inventario no pudo determinar

Honestidad del método: lo siguiente **no se dedujo del código** en esta pasada y queda abierto
para completar el documento.

1. **Qué hace cada letra del órgano** (`razar/lectura/organo.inc`, `ORGW`). Se leyó el
   encabezado, no el cuerpo de las nueve letras. Es la pieza central del mecanismo que
   evoluciona: debería estar documentada letra por letra.
2. **El umbral literal de la propiedad 2 de `distill_no`** (`negacion.inc:45-570`): el
   encabezado lo describe, el cuerpo no se verificó.
3. **El interior de `ev_exam`**: qué pisos entran al examen y con qué peso.
4. **El criterio de orden de `hl_tanda`** ("las más fuertes primero").
5. **Si `HCCNT` cuenta pares leídos o pares ya girados a la relación** (`hp_place:3926`).
6. Los cuerpos de `voluntad_*` (`s_train`, `g_train`, `door_make`, `c_train`, `selftest`,
   `memorize`, `recall`, `share`) se describieron desde sus comentarios de cabecera; sus
   umbrales exactos no están verificados contra las instrucciones.

## 5.6 La lectura de conjunto

Tres cosas quedan claras después de recorrer el código y nada más que el código.

**La primera:** esto no es un prototipo con un truco. Es un sistema con **cuatro capas
completas** —arranque nativo, sistema operativo con capacidades, lenguaje autoalojado y motor
de inferencia— donde cada capa está medida contra la de abajo. La proporción de piezas que
tienen un equivalente publicado y correcto es alta, y eso es una buena noticia: significa que
el autor llegó solo a las soluciones que el oficio considera correctas.

**La segunda:** el rigor metodológico está por encima de lo habitual. Prueba diferencial de
tres motores que deben coincidir **hasta el momento del corte de turno**; prueba exhaustiva
del ensamblador contra FASM; nulo por permutación dentro del motor; distractor deliberado;
validación cruzada dejando uno afuera; estudio de ablación de a una regla; comparación contra
la implementación de referencia del campo con presupuesto igualado; y constantes que o salen
de una medición o se declaran como criterio. Eso no es frecuente en software escrito por una
persona sola, y es lo que hace que el proyecto sea **evaluable** por otro.

**La tercera:** las convergencias son la mejor señal. Copy-and-patch, STDP, escalado
sináptico, VINO, TMS, marcos frecuentes, antiunificación, inducción morfológica por MDL — el
autor llegó a cada una sin conocerla. Ninguna le da prioridad, y el documento no debe
sugerirlo. Lo que dicen es otra cosa, y es más valiosa: **cuando el problema está bien
planteado, empuja a la solución correcta**, y este autor lo planteó bien ocho veces seguidas.

Lo que queda por hacer no es diseño. Es que alguien de afuera lo corra.
