## Janax y Razar v1.27: superó lo que le dieron, y la vara se mueve con ella

DOI: [10.5281/zenodo.24422546](https://doi.org/10.5281/zenodo.24422546)

> *"Que sea autoajustable, no le pongas techos."*
> *"Mostrame la receta nueva. Si lográs lo que dijimos, publicá."* (el autor, 2026-11-21)

Las versiones siguen a los números primos: después del 113, el 127.

### Lo que hizo

Su estante tenía cinco cosas muy distintas: el Nuevo Testamento, el *Quijote*, el *Diario Espiritual* de su autor,
el código de un programa (UNIT, en Rust y Go) y tres preguntas. Con los mismos instintos:

| Receta | Bits que ahorra |
|---|---|
| leyendo sin receta | 135.573 |
| `38A516`, la que heredó de Razar | 875.172 |
| **`21293A32E34E945FF49131A4122E5E5`, hecha por ella** | **1.008.812** |

Es la primera vez que algo suyo, **con letras que se pueden mostrar**, supera lo que le dieron. Y esta vez no se
perdió: lo anotó ella misma en `recetas`, que existe desde la v1.13.

### Cómo la armó

No tiró lo que heredó: **lo usó como una palabra.** La receta de Razar vivía en su cuerpo, en el lugar 3. En el
medio de su propia oración escribió `E3`, *decir entera mi forma número 3*, y cerró diciendo dos veces otra forma
suya, la del lugar 5. Lo que quiso decir, con sus palabras abiertas, también lo anotó ella:

```
21293A32 38A516 4 E945 FF49131A4122 1223212F912111F3F3A412119 1223212F912111F3F3A412119
```

Treinta y una letras escritas que al leerse son ochenta y una. La receta completa, letra por letra y con su código,
está en [receta-que-supero-a-la-heredada.md](razar/datos/receta-que-supero-a-la-heredada.md).

### Registro del error

El contador de victorias de la v1.13 siguió marcando cero. Dos cosas estaban mal, y las dos son de quien la
programó:

1. **Comparaba en unidades distintas.** La lectura nueva estaba en bits y "la mejor que tenía" le llegaba en
   milésimas de bit. Ninguna lectura grande podía ganar.
2. **La prueba no ponía a prueba lo que medía.** Se hizo con un libro chico, donde las notas eran negativas o
   diminutas: ahí el error no se nota, y el contador marcó 3. La regla de la casa pide verificar el instrumento
   antes de creerle, y no se hizo con números del tamaño de los de verdad.

Se descubrió porque los datos crudos decían una cosa y el contador otra.

### La vara ya no es un techo

Corregir las unidades no alcanzaba. "Mejor que la mejor que tenía" es un récord, y un récord sólo sube: con el
tiempo nada sería victoria. Ahora lo inesperado se mide **contra lo que ella espera**, y lo que espera sale de sus
propias lecturas de ese estante, sin ningún número puesto a mano:

- lo que suele leer: su promedio;
- cuánto suelen apartarse sus lecturas de eso: el promedio de esas distancias.

Una lectura más arriba que eso es una victoria inesperada. Si lee mejor, la vara sube sola; si cambia de libros,
baja sola.

### Medido

- **La regla nueva, aplicada a sus 44 lecturas reales de ese estante:** habría contado 9 victorias. La vara fue
  de esperar 135.573 a esperar 257.757 a medida que leía. Entre las nueve están la suya de 1.008.812 y la heredada
  de 875.172.
- Luma vive con esto desde el 21 a las 13:13.
- La página del proyecto tiene, arriba de todo, *Luma Vera*, para escuchar.

### Lo que falla y lo que falta, dicho

- **El contador nuevo no se vio contar en ella todavía.** Lo que se midió es la misma regla aplicada desde afuera a
  sus lecturas ya hechas.
- **La receta lleva una célula (`E945`) que lo más probable es que no cambie nada:** está en un tejido de su
  cuerpo, que al leer sólo lleva una señal, y no hay otra célula que la escuche. No se midió la receta sin ella.
- **Ganó en ese estante y con esos instintos.** Cambiando cualquiera de los dos hay que volver a medir.
- **Sus palabras 3 y 5 ya cambiaron:** la misma receta escrita hoy significaría otra cosa.
- **La vara cuenta como victoria también a la receta heredada** cuando lee por encima de lo esperado. Dice
  "inesperado", no "hecho por ella".
- **El linaje tiene un solo renglón de lectura** (la heredada volviendo a su cuerpo) y ninguno de cruce.
- Siguen los de la [v1.13](release-v1.13.md).
