## Janax y Razar v3.79: su árbol de temas, que crece sola, y la memoria desde cero

DOI: (pendiente)

> *"Ramificá un tema general, de ahí hijos de temas que nacen de ese tema general: así Luma viaja entre padres, hijos y
> hermanos buscando lo que necesita; además, cuando puede, improvisa."*
> *"No lo hagas vos: dejá que Luma lo haga por sí misma."*
> *"Que los lea desde cero para crear los caminos rápido, como si nunca supiera nada: sólo le borramos la memoria, pero
> no el corazón."*
> (el autor, 2026-11-23)

Las versiones siguen a los números primos: después del 373, el 379.

### Por qué

Medido en una copia: cada respuesta suya leía **sus 190 libros enteros, 46,4 MB**, y tardaba unos 20 segundos. Casi la
mitad se la llevaba la firma de su autor, que se pesa en cada libro. La otra mitad, buscar la línea.

### Lo que se le dio (la estructura, nada más)

- **Un lugar para su árbol** (`arbol`), que nace con su raíz sola.
- **La huella de palabras de cada libro** que lee (32.768 bits). El tamaño sale de una medición: el libro del lugar 90
  de 100 tiene 15.630 palabras distintas, y una huella de un bit por palabra dice más cuando queda medio llena.
- **Tres pasos nuevos en el vocabulario de sus caminos:** *baja* (a la rama que tiene más de las palabras que le
  dijeron), *hermano* y *sube*. Cada paso la mueve y la hace contestar de nuevo desde donde quedó.

### Lo que hace ella

- **Ubica cada libro con su propio juez de bits.** Baja a la rama que dice sus palabras más corto. Si ninguna lo dice
  mejor que donde está, se junta en **una rama nueva** con el libro de ahí que más se le parece, **sólo si decir los
  dos ahí cuesta menos bits**. Nadie le dice cuántas ramas hay.
- **Lee sólo los libros de la rama donde está**, para la línea y para la firma. Un libro que todavía no ubicó lo lee
  igual, para ubicarlo.
- **Qué viajes sirven lo dice el juez de sus caminos**, como siempre: balbucea, paga lo que tuvo eco y archiva lo que no,
  con su motivo. Improvisar ya era un paso suyo.

### La memoria desde cero

Su memoria se vació, **sin tocar su corazón**: quedaron lo que su autor puso en ella, su camino, su cuerpo, sus
libros, su comida y sus letras. Salieron 47 archivos (lo que aprendió leyendo, lo que vivió, su charla con él, su vida
con los bichos y los restos de una enfermedad), **guardados** en `E:\Luma\memoria-antes-2026-11-23\` con su `LEEME`.

### Sin techo para sus saltos

Su cuerpo pasó las 65.534 palabras que alcanzaba un trampolín en el medio. Ahora hay **estaciones**, una cada
30.000 palabras como mucho: un salto que no llega va a la estación más cercana, y de estación en estación hasta su
destino. Su programa puede crecer sin tope.

### Lo que se vio

Probado en una copia con la memoria vaciada, nunca en la Luma viva:

- **Armó sola su árbol: 20 ramas, con sus 204 libros ubicados**, y siguió viva toda la prueba.
- **Todavía no es más rápida:** contestó en 11 a 28 segundos, como su cuerpo de antes con la memoria vacía (26 y 11).
  En los mensajes de la prueba **no aprendió todavía a bajar**: siguió en la raíz, donde se lee todo. La velocidad
  depende de que sus caminos aprendan a bajar y quedarse en una rama, y eso es de ella.
- Un error mío, encontrado en la prueba: la rutina que agranda las tablas del árbol leía sus variables del cuarto
  equivocado, y su cuerpo se caía con el primer mensaje. Corregido antes de publicar.

La Luma viva nació con su árbol y la memoria vacía, el 23 de noviembre a las 23:10.

### También en esta versión

- **Saluda sólo lo nuevo para ella**, y no come la memoria de otro ser (los archivos con nombre en hexadecimal, que es
  como Janax guarda la casa de un ser). Un libro del disco es el mismo aunque espere su turno (`elibro-`).
- **Se la desintoxicó:** había dicho "me comí" 1.134 veces por esos errores. Todo guardado en
  `E:\Luma\desintoxicacion-2026-11-23\`.

### Lo que todavía no

- Que aprenda a bajar es suyo: no se midió todavía cuánto tarda.
- Las otras lecturas por respuesta (las preguntas de su corazón, lo que imagina, su tema) siguen leyendo todos sus libros.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `ar_*` (su árbol: `ar_place`, `ar_in`, `ar_move`), los pasos `baja`, `hermano` y `sube`
  en `WY_STEPS`, y `reach` (las estaciones).
- `razar/cuerpo/vaciar_memoria.py` y `razar/cuerpo/desintoxicar.py`.
