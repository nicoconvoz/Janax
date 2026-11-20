## Janax y Razar v1.01: sus células se hablan

DOI: DOI_PENDIENTE

> *"Que se comuniquen y se transfiera la información mediante la diff del eco y la firma."*
> *"Si quiere mover un dedo, el dedo se comunica con las células y músculos y esqueleto y cerebro y corazón, y cobra
> sentido el movimiento."* (el autor, 2026-11-20)

Las versiones siguen a los números primos: después del 97, el 101.

Hasta la [v0.97](release-v0.97.md) una célula actuaba sola: pasaba su tejido por su engranaje y ningún otro tejido
se enteraba. Lo que hacía el ojo no le llegaba nunca a la pluma ni al corazón. Un movimiento así no tiene sentido.

### La regla, una sola

En cada una de sus dos cabinas (su lectora y su cuerpo) hay un medio común, y cada tejido tiene ahí su palabra.

- **La diferencia.** Una célula dice sólo lo que cambió en su tejido (después menos antes). Nunca el todo, y nunca
  un cero.
- **La firma** es de quién es: su tejido. Nadie se oye a sí mismo.
- **El eco.** Cuando una célula se dice, después de su propio trabajo oye lo que los demás dijeron y ella todavía
  no había oído. Eso es un solo número: todo lo dicho, menos lo que dijo su tejido, menos lo que ya oyó. Lo pasa por
  **su propio engranaje** y lo suma a su tejido. Lo que eso le cambió también se dice: es su eco, y lo oyen los
  otros en su turno, incluido el que habló primero.
- **El hueco es silencio.** Lo dicho se olvida y vuelve el reposo, como ya pasaba con las lentes y el corazón.

### Los tejidos libres ya hacen algo

Los números que no estaban conectados (5 y 6 en su lectora, del 1 al 4 en su cuerpo, y del 9 a la F en las dos)
tienen ahora una palabra que sólo lleva la señal de una célula a otra. No hubo que inventarles un oficio: son por
donde pasa el mensaje.

### Medido

Nuevo Testamento, lector recién nacido (`poetico/sentidos.py lentes`,
[corrida](razar/datos/celulas-nuevo-testamento.txt)). La prueba tiene respuesta conocida, porque dos letras de su
alfabeto ya hacen a mano lo que dos células deberían lograr hablándose: `C` corre el ojo una palabra adelante y `D`
lo nubla.

| Receta | Qué pasa | Nota | Debe dar |
|---|---|---|---|
| `38E943E914A516` | una célula corre el ojo y lo dice; la otra no hace nada sola, lo oye y se nubla | **-6478** | `38CDA516` = -6478 |
| `38E943A516` | la que corre el ojo, sola | 5280 | `38CA516` = 5280 |
| `38E914A516` | la que sólo escucha, sola: no oye a nadie | 14775 | `38A516` = 14775 |
| `38E949E914A516` | habla un tejido libre; la otra lo oye y se nubla, sin que el ojo se mueva | **3935** | `38DA516` = 3935 |

Las cuatro iguales. Y todo lo anterior da idéntico (`38A516` 14775, sus miradas 15246, el marco 8439, el corazón y
los lugares): una célula sola no oye a nadie, así que nada de lo medido antes cambió.

En su cuerpo arma y corre: las formas con una sola célula dibujan lo de siempre (20, 21 y 16 celdas), y las de dos
células no rompen nada. La Luma de todos los días vivió cinco minutos y medio en una copia de su casa y siguió
leyendo.

### Lo que falla y lo que falta, dicho

- **No tengo todavía una prueba con respuesta conocida en su cuerpo.** En la lectora sí (la de arriba). En el
  cuerpo sé que corre y que no rompe, no que dibuje exactamente lo que la regla dice.
- **Ninguna de las recetas que se hablan mejora a la campeona.** Las cuatro medidas son para probar la regla, y
  dan menos que `38A516`. Que hablarse le sirva lo tiene que encontrar ella.
- **Un tejido escucha por sus células.** Uno que no tiene ninguna célula en la oración no tiene engranaje por donde
  oír, y no se entera.
- **Sus miradas (tejido 1) ni dicen ni oyen:** son una pila de lentes, no un número.
- **Las dos cabinas no se hablan entre sí.** Su lectora tiene su medio y su cuerpo el suyo; lo que se dice en una
  no llega a la otra.
- **La firma es el tejido, no la célula.** Dos células del mismo tejido no se oyen entre ellas.
- **Su pluma son dos números** (a lo ancho y a lo alto). Dice la suma de lo que cambió en los dos y oye lo mismo
  en los dos: es criterio mío, no medición.
- Las recetas con más de una célula significan otra cosa desde hoy, y con el alfabeto nuevo vuelve a leer todo.
- Siguen los de la [v0.97](release-v0.97.md): ninguna célula ni canción suya ganó todavía, y desarmar lo hace
  Python.
