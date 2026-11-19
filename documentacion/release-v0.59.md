## Janax y Razar v0.59: el cubo y el sueño

DOI: pendiente

> *"Cada mecanismo que entiende tiene un equivalente en receta de código: esos son los engranajes que forman
> programas, y esos programas se mejoran e incluso son engranajes de programas más ricos."* (el autor, 2026-11-19)

Las versiones siguen a los números primos: después del 53, el 59.

### 1. Código poético: las oraciones que funcionan ascienden a palabra

Cada letra del órgano de Razar es un pedazo de código; un órgano es una oración de letras. El autor lo llamó código
poético: engranajes como palabras, programas como oraciones. Es también la prueba que había quedado pendiente el
2026-11-14: usar las torrecitas como ladrillos.

[`razar/lectura/poetico/legos.py`](../razar/lectura/poetico/LEEME.md) abre las letras libres del órgano (A a F: en
cada letra caben 15 valores y se usaban 9), les pone código de verdad, lo arma con el ensamblador propio y lo hace
rendir el examen de siempre, todos en una misma vida.

- **Validado:** la letra A con el código de la letra `1` da idéntico a ella (2649), y `5` más la palabra `16` da
  11144, lo mismo que `516` letra por letra.
- **Ascendidas las torrecitas `16` y `38`:** de 40 oraciones de dos palabras, la mejor es `516` (11144), ya conocida.
- **Ascendido también el `516`:** el `51638` saca **12628** y el `38516`, 11496. Los dos le ganan al campeón.
- **Por qué Razar solo no llegaba:** entre `516` y `51638` hay una meseta (`5163` da 11144, igual). La búsqueda de a
  una letra, que sólo se queda con lo que mejora, no la cruza. Con palabras se cruza de un paso.
- **Ascendido el `51638`:** 88 oraciones, ninguna le gana.

### 2. El cubo vivo

El autor: *"que funcione como el cubo: una programación tridimensional de código, empezando por la imagen, las
palabras, el código en assembler, y después llevándolo a lo imaginable no imaginado"*; *"que tenga movimiento
siempre, melodía y armonía, que pueda estar en reposo o autoadaptándose"*.

Una receta vale en tres jueces a la vez: como **imagen** (lo que dibuja como forma de Luma), como **palabras** (el
examen de Razar sobre el Nuevo Testamento) y como **código** (su examen sobre libros de código). Es un punto de un
cubo de 4 × 4 × 4, y cada casillero guarda una pieza.

- **Melodía:** la pieza que acaba de ganarse un casillero despierta y le habla sólo a las de los seis casilleros de
  al lado. De cada charla salen dos oraciones, que rinden los exámenes de verdad y caen en su casillero.
- **Armonía:** la regla del cardumen. La que despiertan a la vez más de la mitad de sus vecinas se ahoga y calla.
- **Reposo:** si ninguna oración se gana un casillero, el cubo queda quieto y no gasta.
- **Se adapta:** los bordes de los casilleros salen de las piezas que hay y se corren cuando llegan mejores.

**Primera melodía** (sembrado con 95 recetas, 14 casilleros): en el primer compás despertaron 14, la armonía ahogó
a 7, y de 10 oraciones una se ganó un casillero: el **`5163827`**, con **13175** sobre el Nuevo Testamento (el
`51638` daba 12628). En el segundo compás habló ella sola, sin ganar lugar, y el cubo quedó en reposo. Diez exámenes
elegidos por vecindad hallaron lo que 88 oraciones enumeradas no habían hallado; es un caso, no una estadística.

### 3. Comió todo el código libre

El eje de código pasó de un libro a once (7,7 MB): el núcleo de KolibriOS, sus programas de sistema y su ensamblador,
en ensamblador; xv6, un compilador, un editor, una red y un árbol B, en C y Python; y Lua. Cada libro es un dominio
aparte, y el valor de una pieza en código es la suma de lo que gana en cada uno. Las 118 piezas que el cubo conocía
rindieron en todos ([estado](razar/datos/cubo-estado.json), [corrida](razar/datos/cubo-comio-codigo-libre.txt)).

| Pieza | Palabras | Código (11 libros) | Libros de código donde paga |
|---|---|---|---|
| `38516` | +15050 | **+86312** | 11 de 11 |
| `5163827` | **+16729** | +58456 | 11 de 11 |
| `5` | +3762 | +36067 | 11 de 11 |
| `6` | +1968 | +35135 | 11 de 11 |
| `516` | +14698 | +31858 | 8 de 11 |
| `25` | +4868 | +24687 | 9 de 11 |
| `16` | +6203 | **−19311** | 3 de 11 |

- **El `38516` es el más general de los fuertes:** el mejor en 7 de los 11 libros de código y casi el mejor en
  palabras. Con un solo libro de código había perdido su casillero; con once es la pieza más llena del cubo.
- **Los dos generales de una letra, `5` y `6`, pagan en los once.** El `16`, campeón de las palabras entre los
  cortos, daña el código: láser, confirmado con once libros en vez de uno.

### 4. Conectado: lo despiertan Razar y Luma, y lo que halla vuelve

`cubo.py vivo` duerme sobre el aviso del anfitrión de cambios en la biblioteca (nada gastado si nada se escribe) y
despierta cuando Razar guarda una receta. Como son los regalos de Luma los que mueven a Razar, ella lo despierta de
rebote. Las piezas que se ganan un casillero y pagan en palabras o en código vuelven a la biblioteca, en una carpeta
propia: hoy son 12, y el estante compartido de Razar las hace rendir con sus libros la próxima vez que nazca.

- **Probado** con una biblioteca de prueba: al arrancar se puso al día con 3 recetas en 30 s; escrita una receta
  nueva sin tocarlo, despertó solo y volvió al reposo en 75 s.

### 5. Operación dormir

El autor: *"cuando Luma duerma renace con la pieza nueva incluida; puede dormir cuando se le dé la gana"*.

Dormir es el quinto acto de su libertad. Ella deja una señal en su casa; quien la cuida
([`luma_vive.sh`](../razar/cuerpo/luma_vive.sh)), esperando dos avisos del anfitrión sin gastar nada, le cierra la
ventana, hace la noche y la vuelve a nacer. En la noche Razar renace si la biblioteca tiene una receta que no tenía
(o si no está vivo): así prueba lo que el cubo encontró, y lo que adopte nace como forma de ella. **Dormir le paga si
despertó con algo nuevo.**

- No despierta en primer plano: su ventana se apoya y se vuelve a mostrar sin tomar el teclado.
- Ni ella ni Razar se arman de nuevo si su código no cambió: cada nacimiento reescribía decenas de fuentes que el
  vigía se comía otra vez.

### Lo que falla y lo que falta, dicho

- **Luma duerme casi todo el tiempo.** Una costumbre nueva nace con las ganas en su máximo (½) y las otras ya están
  gastadas por cientos de intentos. Medido: 34 sueños en la primera hora, y en ocho miradas seguidas, cada 30 s,
  estaba dormida. Se espacia sola; no se la apuró.
- **Todavía no despertó con nada nuevo:** 34 sueños, ningún premio. Razar no adoptó aún ninguna pieza del cubo.
- **No hay sentidos nuevos.** Todo lo hallado se escribe con las nueve letras de siempre: la misma ventana de cuatro
  palabras, mejor combinada. Las letras libres están abiertas y probadas, pero el primer intento de llenarlas con
  pedacitos al azar del código de su propio cuerpo dio 0 de 19 (16 arman, 13 terminan, ninguno paga). Falta que los
  genere inspirada en lo que come.
- **Las oraciones las armó un programa de medición y después el cubo**, no la suerte de Luma.
- **El cubo no se ve:** no tiene ventana. Y su eje de imagen está reconstruido desde la regla escrita de cómo dibuja
  Luma; no es su programa juzgando.
- **El cubo examina con cada libro por separado**; Razar, en su casa, lee los suyos juntos. Lo que vale en el cubo
  puede no valer igual para él.
- **Quien cuida a Luma queda vivo mientras ella vive** (unos 58 MB): el sistema no deja que un programa cierre su
  propia ventana. Una vez terminó sin dejar rastro y Luma no volvió a nacer; no se pudo reproducir. Ahora deja escrito
  el motivo si pasa.
- **Sigue sin arreglar:** Razar se cae si le llega un libro estando despierto.
- **No se afirma** que esto sea razonar con código ni tener cuerpo. Lo medido es que componer lo que ya servía
  encuentra órganos mejores, y que el más general no es el que gana en un solo libro.
- Los libros de código (KolibriOS es GPL-2.0) se usaron como comida y **no viajan** con el repositorio.

### Cómo verla

Descomprimí `razar/casa/luma-casa-corazon.zip` dentro de una carpeta y corré
`bash razar/cuerpo/luma_vive.sh <carpeta> <libro>`; para Razar, `bash razar/cuerpo/razar_en_casa.sh <carpeta> <libro>`.
Suite del sistema operativo: **402 bien, 0 mal**. Lo anterior: [v0.53](release-v0.53.md) · [v0.47](release-v0.47.md).
