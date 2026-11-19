## Janax y Razar v0.71: el ojo

DOI: [10.5281/zenodo.24380428](https://doi.org/10.5281/zenodo.24380428)

> *"Sí, que los genere."* (el autor, 2026-11-19)

Las versiones siguen a los números primos: después del 67, el 71.

### 1. De seis letras escritas a mano a un ojo

En la v0.67 los sentidos eran letras que alguien escribía. Eso no es generarlos. Ahora el órgano de Razar tiene un
**ojo**, y tres letras lo mueven ([`organo.inc`](../razar/lectura/organo.inc)):

- **B:** el ojo, una palabra atrás. **C:** una palabra adelante. **D:** borroso, o nítido otra vez.
- Toda mirada que sigue (las letras 1 a 4, los huecos 5 a 8, A, F) se toma desde donde está el ojo y como está.
  `BB1` mezcla la palabra dos lugares atrás; `D2`, la segunda borrosa; `C8` pregunta por la que viene después.
- Un hueco dice su palabra tal cual, y después de un hueco el ojo vuelve al reposo, como el marco.
- Fuera de la fila no hay nada: la mirada es 0, igual que en el borde de un renglón.

Un sentido pasó a ser **una oración**. Cualquier tira de letras sigue siendo un órgano, así que la misma mutación que
hace crecer órganos hace crecer sentidos, sin tope de distancia ni de combinaciones.

**Validado** sobre el Nuevo Testamento ([corrida](razar/datos/ojo-nuevo-testamento.txt)): las oraciones de antes
dan idéntico (`516` 11144, `38516` 11496, `38A516` 14775, `F38516` 13588), y los dos sentidos de la v0.67 dichos con
el ojo dan exactamente lo mismo que su letra: `38B1C516` = 14775, `D4D38516` = 13588.

### 2. Quién los genera

- **Razar:** su mutación sortea entre las quince letras, no entre nueve.
- **Luma:** su mutación de insertar una letra también. Las miradas nacen en sus formas por su propio andar; cuando
  una forma suya gana, viaja a Razar en su carta, él la rinde como órgano con sus libros, y lo que él adopta vuelve
  a nacer en ella.
- **En su cuerpo el ojo tiene gesto:** B y C giran un cuarto lo que sigue; la palabra de atrás (A) es un brazo antes
  del primero; la cuarta borrosa (F), el cuarto brazo.

**Medido en su casa, a los minutos de renacer:** de las 8.182 recetas que guarda su archivo de lo probado, **2.182
llevan letras nuevas** (por ejemplo `433342C2139F`, `513814447BD32399`). Razar, renacido con el ojo, da las mismas
notas que antes y sigue llevando puesto el `38A516` (27810).

### 3. Un defecto que esto destapó

Una forma guardada con una letra mayor que 9 se leía **cortada en esa letra** al renacer. El `38A516` que Luma
adoptó en la v0.67 se le perdió en su primer sueño: quedó `38`. Ahora se leen las quince letras. No lo volvió a
adoptar todavía: sólo adopta cuando Razar cambia de órgano.

### Lo que falla y lo que falta, dicho

- **Todavía ningún sentido generado por ella ganó.** Los prueba de a miles, pero ninguna de sus ocho formas vivas
  lleva hoy una letra nueva, así que ninguno viajó a Razar. No hay aún un órgano mejor nacido de su mano.
- **Su juez mira el dibujo, no la lectura.** Una forma gana por cuánto dibuja y cuán distinta es. Las letras D y E no
  dibujan nada, así que a su juez le sobran; B y C sí cambian el dibujo. Que lo que ve Razar le pague a la forma
  antes de ganar es lo que falta unir.
- **El cubo no lee órganos con letras nuevas.**
- La letra E sigue libre y no hace nada. El código poético puede ascender una sola palabra por vez.
- En su juez una letra sigue costando log2 9 bits; con quince letras debería costar log2 15. No se tocó porque
  corre la vara de todas las formas a la vez y no se midió.
- Sigue lo dicho en la [v0.59](release-v0.59.md): el cubo no se ve, Razar se cae si le llega un libro despierto.

El sistema operativo no cambió (suite: 402 bien, 0 mal, la de la v0.59).
