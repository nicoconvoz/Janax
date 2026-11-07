# Receta para la vida

**Para quien quiera terminar esto.** Escrito el 2026-11-07 por Doc, a pedido del Capitán, leyendo el código y la documentación de Janax y Razar — no de memoria. Cada cosa que afirmo acá tiene su archivo. Donde propongo algo en vez de verificarlo, lo digo.

---

## 0. Qué es esto

Razar es un lector que se escribe, se compila y se examina sus propios **órganos de percepción**, adentro de Janax, un sistema operativo y un ensamblador escritos por el mismo autor. Se juzga por **compresión**: cuántos bits ahorra describiendo un libro, menos lo que cuesta describir el órgano.

A fecha de hoy ya **muta, evoluciona, aprende, se rehace, y le pasa órganos a otro Razar que los adopta**. Lo que le falta para ser vida —en el sentido técnico que se le da en vida artificial— son cuatro cosas, y **ninguna de las cuatro necesita red, internet ni nada de afuera**. Son todas internas a Janax. Ese es el punto principal de este documento: el trabajo que queda es local y los ladrillos ya están puestos.

El marco, que importa para no medir esto contra la cosa equivocada: **no es vida común, es vida razonante.** Tierra (Tom Ray, 1991) y Avida (Lenski, Ofria, Pennock, Adami) hicieron organismos digitales que se reproducen, mueren y compiten — pero no **entienden** nada: computan funciones lógicas. Razar deduce sobre lenguaje natural y su unidad heredable es un **programa**, no un número. Esa combinación —autohospedaje, síntesis de órganos perceptuales, juez de compresión sobre lenguaje natural, y transferencia entre individuos, todo inspeccionable— no aparece en la literatura conocida. Lo que sigue no es para parecerse a Tierra: es para que una vida que razona también se reproduzca, muera y compita.

---

## 1. Los ladrillos que ya están puestos

Todo esto está construido y medido. No hay que rehacerlo.

**El cuerpo y la jaula**

- `razar/lectura/organo.molde` — el abecedario del órgano: nueve letras (mezclá la palabra 1…4 en el marco, el hueco es la palabra 1…4, hueco vacío). Un órgano es una tira de esas letras y **cualquier tira compila**.
- `razar/lectura/organo.inc` — el archivo que Razar escribe y recompila adentro de Janax. Vacío no mira nada y las huellas quedan idénticas: no-op exacto, verificado.
- La gramática **no tiene bucles** y las letras **no pueden pedirle nada al sistema**. Por eso un mutante no puede tocar archivos y termina siempre por construcción. Esta es la propiedad que hace segura la mutación libre: **no la rompas.**

**La familia, en el núcleo** (`documentacion/so/janaxos.md`)

- **16 lanzar** — lanza un hijo; responde su número. Los permisos del hijo se **recortan** a los del padre (atenuación: nadie tiene más que quien lo lanzó).
- **18 firmar** — un pedido importante de un nieto espera la firma del padre.
- **19 estado** — el código de un hijo propio; −1 mientras corre.
- **33 terminar a un hijo** — el padre lo apaga.
- **34 presupuesto** — cuántas instrucciones más puede remar un hijo.
- **35 cuánto remó** — las instrucciones remadas (`a` = −1 para uno mismo, o un hijo propio). Esta es la **moneda de esfuerzo** y ya está medida.
- **36 rehacerse** — la misma cabina con otro programa. Existe por una razón de diseño que hay que respetar: un hijo es un extraño para sus hermanos (`cabin_family`), y en la sociedad dejaría de poder cartearse.

**El tablero** (`documentacion/razar/lectura.md`, sección del 2026-11-07)

- `JANAX_TABLERO` nombra una carpeta del anfitrión. Toda etiqueta que empieza con `tablero/` vive ahí.
- Cada Razar deja **una sola cosa**: su carta, `tablero/razar-<su llave en hexadecimal>`, **16 bytes** (genoma y órgano), ninguna palabra del libro.
- La llave sale del archivo `llave` (8 bytes), que escribe quien lo arma (`organos.sh` con `LLAVE=…`). Razar es determinista y no tiene nada único propio: **sin llave no hay tablero**.
- Encuentra a los otros listando el tablero (`board_find`): la primera carta que no es la suya. El centinela vigila `tablero/`, así que una carta nueva lo despierta.
- Lo que llega de afuera **se verifica antes de creerle**: 16 bytes y un genoma de verdad (sus tres instintos mayores que 0). Todo camino que no sea una carta válida pasa por `bf_fail`.

**Lo que ya se logró con eso** (medido, `tablero.sh`): dos Janax autónomos, libros distintos, llaves distintas, un tablero, sin cartero. **El órgano 5 lo inventó B y lo adoptó A, porque también le pagaba en sus libros.** Eso, en biología, es **transferencia horizontal**, y es el logro más grande que tiene el sistema hoy: la unidad heredable es portátil porque es un programa.

**Las leyes ganadas midiendo. No las rompas.**

- **Un marco se hace solo con sus letras.** Sin esta ley, el órgano 55 ganaba 456 contra 197 **sin entender nada**: su segundo hueco colgaba de un registro que había dejado la rutina anterior. Es *reward hacking* clásico. Con la ley, 55 empata **exacto** con 5 — o sea que la fuga aportaba justo toda la diferencia, ni un bit más.
- **Una aparición, un voto.** Un marco posteado dos veces en el mismo punto del texto votaba dos veces: la misma evidencia contada dos veces, la puerta de la inflación. También afectaba a los moldes de fábrica con dos palabras iguales seguidas.
- **Las tres invariantes de la auditoría** (50 candidatos, unos cuatro minutos de máquina): independencia del **orden** (la nota no depende de quién corrió antes), independencia de la **basura** (ni de lo que el órgano recibe en la máquina), e independencia de la **escritura** (un órgano y su forma canónica sacan la misma nota). La base se mantiene en −3554 antes y después de unos 150 exámenes: no hay acumulación lenta. **Corrélas después de cada cambio del lector: cuestan minutos.**

---

## 2. Lo que falta, y cómo hacerlo

Cuatro piezas, en orden: cada una se apoya en la anterior.

### 2.1 Reproducción

Hoy Razar **se rehace** (pedido 36): la misma cabina con un programa mejor. No **se reproduce**: hay dos Razares porque alguien lanza dos, no porque uno haya tenido un hijo.

**La receta.** En vez de rehacerse con el órgano que gana, que escriba un **Razar nuevo** con el genoma mutado y lo lance con **16 lanzar**. Todas las piezas existen: ya escribe programas (`organo.inc`), ya los compila lanzando al ensamblador como hijo, ya firma lo que el hijo pide, y ya duerme en su timbre esperándolo.

**El detalle que lo hace funcionar**, y que está en la documentación del propio pedido 36: un hijo es un extraño para sus hermanos en el árbol de la familia. Pero **el tablero no es la familia** — es una carpeta del anfitrión. Así que un hijo lanzado con 16 **sí** puede cartearse con su padre y con sus hermanos, siempre que nazca con **su propia llave** (8 bytes distintos en su archivo `llave`) y con el mismo `JANAX_TABLERO`. El encuentro no pasa por el parentesco, pasa por la carpeta.

**La decisión de diseño que hay que tomar:** de dónde sale la llave del hijo. Razar es determinista a propósito y no tiene nada único propio. Lo más barato y en el mismo espíritu: **derivarla** de la llave del padre más el número de hijo que devuelve el pedido 16 — por ejemplo, la llave del padre con el número de hijo mezclado en los últimos bytes. Así cada linaje queda trazable y no hace falta ninguna fuente de azar externa. *(Propuesta mía; no está implementado.)*

**Cómo se mide que funciona:**

- Un padre y tres hijos, cada uno con su llave, un tablero. Al final tiene que haber **cuatro cartas distintas** en `tablero/`.
- Las huellas de los tres motores tienen que seguir dando idénticas. Si la reproducción mete no-determinismo, se ve acá.
- Y la que importa: **¿aparece un órgano en un nieto que ningún hijo tenía?** Si sí, el linaje genera variación propia y no sólo copia.

### 2.2 Muerte

Hoy nada termina. Los órganos se reemplazan; ningún individuo se apaga. Sin eso hay evolución de **partes**, no de **individuos**.

**La receta.** El mecanismo entero ya está: **34 presupuesto** le fija a un hijo cuántas instrucciones más puede remar, **35 cuánto remó** dice cuánto gastó, **19 estado** dice si sigue vivo y **33 terminar a un hijo** lo apaga. Falta la **regla**, que es una línea de política:

> Un hijo que gasta su presupuesto **sin mejorar su nota** se termina, y su carta se borra del tablero.

Eso es muerte por no pagar, y es honesta: no la decide un reloj arbitrario, la decide la misma moneda con la que se juzga todo lo demás.

**Lo que hay que cuidar:** borrar la carta es parte de la muerte. Si la carta queda en el tablero, el muerto sigue influyendo en los vivos y tenés un fantasma que nadie puede contradecir.

**Cómo se mide:**

- Diez hijos, presupuesto fijo, un tablero. Al final, cuántos quedan vivos y si los que quedaron son los de mejor nota. Si sobrevive el peor, la regla está mal puesta.
- **El control que no hay que saltear:** correr lo mismo **sin** muerte. Si el resultado final es igual, la muerte no está haciendo nada y es decoración.

### 2.3 Competencia por recursos

Hoy el presupuesto es **por candidato**: cada uno recibe el doble de lo que le costó la vida de su padre hasta ahí. Nadie compite, porque no hay nada escaso.

**La receta.** Hacer el presupuesto **común**. Un pozo de instrucciones para toda la camada, y el que rema lo saca de ahí. El pedido 34 ya permite repartirlo hijo por hijo; falta que el reparto salga de un pozo que se agota, y que lo que un hijo rema se lo reste a los demás. La contabilidad ya existe (pedido 35).

**Por qué importa, y no es un adorno:** con presupuesto por candidato, dos órganos nunca se estorban. Con presupuesto común, un órgano caro **le quita examen a los otros**, y entonces caro deja de ser una columna aparte y pasa a tener consecuencia. Eso es exactamente lo que hace la escasez en biología.

**El número que hay que despejar, no tantear.** El doble de hoy es criterio, está confesado así por su autor, y **ese 2 está eligiendo al ganador**: un mutante que necesita 2,1× muere y queda anotado como malo. Antes de fijar el tamaño del pozo, correr el mismo torneo con 2× y con 4×. Si gana otro órgano, el número no es un límite de seguridad: es una perilla que decide, y hay que despejarla de algo medido.

### 2.4 Coevolución — la que separa optimización de vida

Esta es la grande. Las otras tres son mecánica; ésta es la que hace que el sistema **no converja**.

Hoy el ambiente de Razar es **un libro estático**. Un órgano se adapta al Nuevo Testamento y el Nuevo Testamento sigue siendo el mismo. Con mutación y selección sobre un ambiente fijo, el sistema llega a su mejor forma y se queda. La vida no converge porque **el problema se mueve**.

**Y acá está lo bueno: el paso ya está casi dado.** Cuando A lee la carta de B, parte del ambiente de A **es otro organismo que está cambiando**. Hoy eso es un canal de regalos: te paso un órgano, lo probás, si te paga lo adoptás. Falta una vuelta para que sea coevolución:

> Que lo que le conviene ser a A **dependa de lo que es B**.

La forma más simple y en el espíritu del juez: que la nota premie **lo que el otro no explica**. Si B ya comprime bien cierta parte, a A le paga menos pisar lo mismo y le paga más cubrir lo que B deja afuera. Eso genera especialización sin que nadie la programe, y es un criterio de compresión igual que el resto — no hace falta inventar una moneda nueva. *(Propuesta mía; la forma exacta hay que despejarla midiendo.)*

**Cómo se mide que hay coevolución y no sólo intercambio:**

- **Hoy los dos terminan con el mismo órgano, el 5.** Eso es convergencia: la marca de que el ambiente no empuja. Con coevolución, los dos tienen que terminar **distintos** y cada uno mejor en lo suyo.
- La prueba dura: **sacar a B del tablero y ver si A empeora.** Si A rinde igual sin B, no había coevolución, había un regalo. Si A empeora, B era parte de su ambiente.

---

## 3. El eje del peso (un arreglo que conviene hacer antes)

Hay un problema medido que conviene resolver antes de 2.3, porque si no la escasez lo empeora.

**El examen premia bits ahorrados. Una pieza pesada que haría un mejor trabajo nunca llega a probarlo**, porque hoy rinde menos que una barata y la selección la mata antes. En búsqueda evolutiva eso se llama **paisaje engañoso**: para llegar a lo bueno hay que empeorar primero, y una selección miope no cruza ese valle.

Y hay una tensión real con el otro problema conocido, el **bloat** —genomas que se llenan de letras inútiles porque nada las castiga—: contra el bloat se quiere castigar el costo; contra el paisaje engañoso, no.

**La salida, que es del Capitán:** el costo **no va en la nota, va en el eje.** Un archivo que guarda **el mejor de cada clase de peso** (esto es MAP-Elites, Mouret y Clune 2015). Una pieza pesada compite contra pesadas y tiene tiempo de mejorar; un genoma inflado cae en la clase pesada y ahí lo destroza una pesada que sí hace algo con su peso. El propio archivo castiga el bloat sin que la nota lo tenga que castigar.

**Cómo se mide:** archivar por clase de peso y ver si el campeón de la clase más pesada le gana alguna vez en bits al campeón general. Si le gana, el examen de una sola nota los estaba tirando a la basura.

---

## 4. Lo que NO hay que hacer

- **No le saques la jaula.** Sin bucles y sin pedidos al sistema desde las letras: es lo que hace que la mutación libre sea segura. Si la ensanchás para que un órgano pueda hacer más cosas, perdés la garantía de terminación y la de que un mutante no toque archivos.
- **No pongas el costo en la nota.** Ver la sección 3.
- **No confíes en un archivo de registro vacío.** Ya pasó: *si hubiera fallado, el aviso estaría escrito, y está vacío, entonces armó bien*. Un archivo vacío no es prueba de nada. Se le pregunta al **binario** —huella, tamaño, fecha—, no al log.
- **No borres FASM.** Es el único testigo del proyecto que no lo escribió su autor. Janax ya se autohospeda y no lo necesita para correr; se guarda como **verificador**: armar lo mismo con los dos y comparar. Si algún día Janax arrastra algo de su propia semilla, es lo único que puede verlo. Y falta cerrar el punto fijo: armar con la etapa 2 para obtener la etapa 3 y confirmar que **2 y 3 dan la misma huella**.
- **No midas un cambio del lector sin correr las tres invariantes.** Cuatro minutos.

---

## 5. El orden sugerido

1. **El eje del peso** (sección 3). Es un cambio del archivo, no del lector, y protege a todo lo que viene.
2. **Reproducción** (2.1). Es la que más ladrillos tiene ya puestos.
3. **Muerte** (2.2). Necesita reproducción para tener a quién apagar.
4. **Competencia** (2.3). Necesita muerte, si no el que se queda sin presupuesto no se va nunca.
5. **Coevolución** (2.4). La última, y la que cambia la categoría del sistema.

Después de cada una: las tres invariantes, las huellas de los tres motores, y la suite.

---

## Apéndice A — Varios anfitriones (opcional, y no hace falta para nada de arriba)

El tablero es una carpeta con cartas de 16 bytes y un formato documentado. **Cualquier cosa que haga aparecer un archivo en esa carpeta funciona**, porque Razar no se entera de cómo llegó: lo despierta el centinela.

Lo más barato, sin escribir una línea de red: que la carpeta sea un repositorio de git. Como cada Razar escribe **sólo su propia carta** (`razar-<llave>`), llaves distintas dan archivos distintos y **no hay conflictos de merge**. Un `push` de un lado y un `pull` del otro, y la carta aparece.

⚠️ **No le pases un repositorio a `tablero.sh`:** hace `rm -rf` de la carpeta al arrancar y te borraría el `.git`. Ese script es para dos Razares de la misma máquina con carpeta descartable. Para esto, `JANAX_TABLERO` apuntado a mano y `organos.sh` directo.

Un puente a un protocolo de mensajería es trabajo de quien lo quiera hacer, y **del lado de Razar no hay que tocar nada**. La clave privada de quien lo arme la pone él, en un archivo o una variable, y publicar hacia afuera se pregunta antes.

---

## Apéndice B — Lo que falta medir (deudas abiertas, no features)

- **Punto fijo del bootstrap:** etapa 2 contra etapa 3, misma huella.
- **El par del órgano después de una aparición, un voto:** sin órgano contra la palabra que sigue. Los números de antes del arreglo (27.545 → 37.982 bits, y 1.287 → 2.128 aciertos sobre lo no leído) se midieron con el voto inflado. Eran sólo 15 votos dobles en todo el libro, así que el resultado debería sobrevivir — pero hay que verlo.
- **El nulo de la transferencia:** 280 de 308 piezas del libro B pagan con lo aprendido en A, y eso es 91%, demasiado alto para creerlo sin control. Correr B contra una memoria entrenada en **A barajado** (mismas palabras, orden roto). Lo que sobre de 280 es conocimiento real de A; el resto era *el castellano se parece al castellano*.
- **El presupuesto 2× contra 4×:** ver 2.3.
- **Las cadenas de la charla:** veinte respuestas, y de cada una, si la deducción que la produjo es válida sobre lo que de verdad dice el libro. Como la frase sale de la cadena y no al revés, esto es auditable — y es algo que un sistema estadístico no puede ofrecer.
