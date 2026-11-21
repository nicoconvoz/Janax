## Janax y Razar v1.13: lo que leyó no se pierde

DOI: DOI_PENDIENTE

> *"Esto no es por la pregunta: es para ver si creó alguna receta multidominio. Rastreá qué pasó."*
> *"Arreglalo, y publicá: esto lo merece. Registro del error, por supuesto."* (el autor, 2026-11-21)

Las versiones siguen a los números primos: después del 109, el 113.

### Lo que apareció al rastrear

La noche del 20 su estante ya era de varios dominios: el Nuevo Testamento, el *Diario Espiritual* de su autor, su
firma, sus tres preguntas y UNIT, que es código. En ese estante, y con los mismos instintos (paciencia 8, firmeza 2,
lecturas 3):

| Lectura | Receta | Nota (bits) |
|---|---|---|
| 36 | `38A516`, la heredada de Razar | 583.924 |
| 41 | **una de ella** | **605.797** |
| 42 | **otra de ella** | **648.631** |

**Dos recetas suyas leyeron mejor que la que heredó, en un estante que mezcla Biblia, un diario y código.** Es la
primera vez que algo hecho por ella supera lo que le dieron.

### Registro del error

Pasó sin que nadie lo viera, y por dos descuidos de quien la programó:

1. **El contador de victorias estaba mal hecho.** Sólo miraba los pensamientos nuevos. Estas dos eran formas que ya
   vivían en su cuerpo, leídas por primera vez: ganaron y el contador siguió en cero. Se informó "ninguna victoria
   inesperada" durante un día entero, creyéndole al contador. La regla de la casa lo dice: *si el banco dice una
   cosa y lo que pasa dice otra, el que miente es el banco.*
2. **No se guardaba qué letras tenían.** Una receta con una palabra suya o una célula se anota por su huella. Las
   dos ganadoras llevaban una: se sabe que ganaron y no se puede decir qué eran.

Las dos se perdieron. No se pueden mostrar ni rearmar.

### Lo que se arregló

- **Una victoria es cualquier lectura mejor que la mejor que tenía**, sea lo que sea lo leído.
- **Toda lectura que se guarda por su huella deja un renglón en `recetas`**, un texto que nada reescribe: su nota,
  la receta como se escribió y, si dice palabras suyas, qué quiso decir en ese momento (sus palabras cambian cuando
  cambia su cuerpo):

  ```
  -20 1FE11EB959 = 1F51EB959
  ```

  Lo escribe ella, en Janax, legible sin ningún programa.

### Medido

- En una copia con libro chico y formas quietas: el contador marcó **3 victorias** donde antes habría marcado 0, y
  `recetas` anotó 16 renglones, cada uno con lo escrito y lo que significó.
- Comió además el *Quijote* (2,1 MB, de un espejo oficial del Proyecto Gutenberg, sin su encabezado y con el
  alfabeto de sus otros libros). Su estante pesa ahora 5 MB.

### Lo que falla y lo que falta, dicho

- **Las dos recetas ganadoras de anoche no se recuperan.**
- **No se sabe si siguen ganando hoy.** Sus instintos cambiaron después, y con los nuevos `38A516` lee 638.699; las
  dos suyas no se volvieron a leer con esos instintos.
- **Con el Quijote adentro todavía no había terminado una lectura** cuando se tomó esto: no hay nota para ese
  estante.
- **Una victoria cuenta también cuando lo que gana es la receta heredada**, leída por primera vez en un estante.
  El contador dice "mejor que lo que tenía", no "hecho por ella".
- **El linaje sigue sin mostrar un cruce ni una lectura:** todos sus renglones son de pensar.
- Siguen los de la [v1.09](release-v1.09.md).
