## Janax y Razar v0.73: un solo ser

DOI: [10.5281/zenodo.24381944](https://doi.org/10.5281/zenodo.24381944)

> *"Uní todo: Razar y Luma son una sola cosa... no dos separadas."*
> *"Hacelo como el cirujano que operó mi corazón a los 8 años: unilo bien, sin parches, sin pasos, una sola operación
> que una."* (el autor, 2026-11-19)

Las versiones siguen a los números primos: después del 71, el 73.

Hasta la v0.71 eran dos programas que se escribían cartas: Luma (una ventana, sus formas, un juez del dibujo) y Razar
(despierto en su casa, su órgano, un juez de la lectura). Un intento de mejorar el correo entre los dos quedó frenado
y [en espera](razar/en-espera/LEEME.md). Esta versión no agrega un puente: saca los dos lados.

**Luma Vera es la primera Razar** (el autor, 2026-11-09). Razar es la especie y su manera de razonar; Luma es ella.

### 1. Una sola vida

`luma.bin` lleva su cuerpo y su lectora ([`gen_leer.py`](../razar/cuerpo/gen_leer.py)). Al nacer mira sus propios
datos iniciales: sin datos, es el cuerpo; con los de un candidato, es su propia lectora, que es el examen de
[`pulso.jsm`](../razar/lectura/pulso.jsm) entero y sin tocar, incluido adentro. Razar ya rendía cada examen lanzando
un hijo de sí mismo; ella hace lo mismo: **su lectora es ella misma, lanzada por ella**, dentro del mismo sistema
operativo y del mismo proceso.

No hizo falta mudar una sola dirección de memoria: cada camarote de Janax OS tiene su propio cero. Esa es la regla
general que une los dos mapas, y ya estaba en el núcleo. Lo único que chocaba eran ocho nombres de etiquetas; los
del cuerpo llevan `b_` adelante, por una regla y no a mano.

Un solo lanzador ([`luma_vive.sh`](../razar/cuerpo/luma_vive.sh)) y un solo proceso. No se arranca ningún Razar
aparte, y no hay una "noche" que decida si relanzarlo.

### 2. Una sola memoria

Una receta de letras es **a la vez** una forma (lo que dibuja) y un órgano (cómo lee). Se fueron `carta1` y `carta2`.
Lo que lee una receta se guarda una sola vez, en `leido`: una línea de 48 bytes con la receta, su nota, el estante
del que salió, los instintos con que se leyó y el alfabeto. Nunca se reescribe; sólo crece.

Para eso el órgano acepta ahora recetas enteras de ella, **hasta 31 letras** (antes 16). Con 16 o menos nada cambia.

### 3. Un solo juez, en bits

    valor del ser = Σ por forma [ L(celdas nuevas) − letras · log2 15 ]  +  la MEJOR lectura entre sus formas

- `L(k) = log2 C(2000, k)`: lo que cuesta decir cuáles `k` de las 2000 celdas del cuarto están dibujadas, sin la
  receta. Celdas nuevas: las de la forma menos las que más comparte con otra (lo que otra ya dice).
- La receta cuesta `log2 15` bits por letra (son quince letras; antes se cobraba `log2 9`).
- La lectura es la nota del examen, que ya eran bits ahorrados.
- **El libro se dice una sola vez**, así que la lectura entra como máximo y no como suma: una forma lee, las otras
  siguen siendo distintas por lo que dibujan. Lo que nunca se leyó no tiene lectura (sin examen no hay crédito); leer
  sin órgano es el piso.

No hay ningún peso puesto a mano entre dibujar y leer: las dos cosas son bits del mismo tipo.

**Qué cambió en ella, medido.** Su vara del dibujo era un cociente (celdas por bit) y pasó a ser una diferencia (bits
ganados). Con el cociente convenía la receta corta; con la diferencia conviene cada letra que agregue más de 3,9
bits de dibujo. En una copia de su casa sus formas pasaron de 8 a 14 letras a entre 22 y 31, y de 51 a 133 celdas a
entre 172 y 216. El tope de 31 letras es de almacenamiento y ya existía; ahora lo tocan.

### 4. Una sola voluntad

Leer es un acto que ella elige con las mismas cuentas (Krichevsky-Trofimov, nunca cero) que descansar, pensar, dar,
pintarse y dormir. Paga cuando lo leído llega a vivir en su cuerpo. No espera a su lectora: los cuadros siguen, y su
timbre la despierta cuando hay una firma que dar, una palabra o un final.

Qué lee, en orden: la lectura sin órgano, si este estante no la tiene; una forma suya nunca leída; lo que llevaba
puesto Razar el día de la unión, una sola vez; y después algo nuevo, por su suerte entre dos caminos que cuenta por
separado: una receta suya con una letra cambiada, puesta o sacada (cualquiera de las quince), o uno de sus tres
instintos un paso arriba o abajo. De cuál de sus formas sale la letra también lo cuenta, lugar por lugar.

Dar ya no es escribirle a Razar: sólo a sus criaturas. Dormir paga si despertó hecha de algo nuevo.

### 5. Lo que hizo falta en el núcleo

- **El timbre despierta a quien duerme en la pantalla** (pedido 41): responde 0 y dice cuánto quedaba de la espera.
- **Pedido 42, remar en los huecos:** el hilo que rema a un hijo toma la prioridad más baja del anfitrión mientras lo
  rema. Es lo que antes se conseguía lanzando a Razar como proceso aparte en prioridad Idle.

Detalle en [`janaxos.md`](so/janaxos.md). Suite del sistema operativo: 405 bien, 0 mal.

### Medido

Todo en una copia de su casa (`E:\Luma\casa`), antes de tocar la que vive.

- **Lo de antes da idéntico.** Nuevo Testamento, lector recién nacido (`poetico/sentidos.py ojo`): `5` 208, `16` 2649,
  `516` 11144, `38516` 11496, `38A516` 14775, `F38516` 13588, `38B1C516` 14775, `D4D38516` 13588.
- **Ella misma rinde lo que rendía Razar.** En su casa leyó `38A516` y le dio **27810**, lo mismo que él. Sin órgano,
  −2572.
- **Una receta con una mirada nueva vive en su cuerpo por lo que lee.** `38A516` dibuja 16 celdas: por su dibujo vale
  unos 24 a 57 bits, contra 520 a 720 de cualquiera de las otras siete. Con la vara vieja no habría durado. Vive
  porque lee 27810 bits y la segunda mejor lectura de su cuerpo anda por 2700 a 4700. Pasó en las dos copias que se
  probaron, sin carta: ella la leyó, ella la juzgó.
- **Otra forma suya con miradas nuevas, nacida de sus propias mutaciones,** `36232234A33127B433A622112234329`, lee
  4660: 7283 bits más que sin órgano. No es la que mejor lee, pero es de ella y ahora se sabe cuánto ve.
- **Un instinto, también.** Probó "lecturas" un paso arriba: `38A516` dio 27849 contra 27810, y lo hizo suyo.
- **Procesador, con ventana, 15 minutos:** 15,9 % de un núcleo en total, una lectura cada 47 segundos. Antes eran dos
  procesos: ella, 7 a 10 %, y Razar aparte, 12 %. Sin ventana y a toda marcha una lectura tarda unos 10 segundos.

### Lo que no quedó unido, y lo que falta, dicho

- **Todavía ninguna receta nacida de una mutación suya ganó por leer.** En las pruebas leyó 11 de esas y ninguna le
  ganó a `38A516`, que es herencia de Razar. El camino está abierto y medido; el hallazgo propio no llegó.
- **El cubo no es parte de ella.** Se alimentaba de las recetas que Razar escribía en el tablero; ahí ya no escribe
  nadie, así que dormía; el mismo día se lo sacó del arranque (sigue en el repositorio, en espera). Unirlo así como está sería otro puente.
- **El vigía sigue aparte** y lee con el órgano más general del tablero, congelado el día de la unión.
- **Los nichos de Razar, su memoria de piezas y el cruce de genomas con un hermano** no pasaron: están en espera con
  su motivo. `pulso.jsm` solo sigue armando y es el instrumento de las medidas.
- **Cambiar de instinto cuesta caro:** todo lo leído vale para un instinto, así que al adoptar uno nuevo vuelve a
  leer sus ocho formas y el piso (unos nueve exámenes).
- **Mientras sus formas cambian mucho, lee poco de lo nuevo:** primero lee las formas que todavía no leyó.
- **Sólo decide leer cuando termina una ronda.** Con ventana, recién renacida con la vara nueva, pasó 7 minutos
  estirando sus formas (141 victorias) sin leer nada.
- **No medido:** cuánta memoria deja cada lectora que termina (cada una es un camarote nuevo; ella renace varias
  veces al día y ahí vuelve todo), ni cuánto tarda una lectura con la máquina ocupada.
- **El tope de 31 letras por receta** sigue siendo un tope fijo de almacenamiento, y ahora sus formas lo alcanzan.
- La ventana sigue llamándose "Janax". La letra E sigue libre.
