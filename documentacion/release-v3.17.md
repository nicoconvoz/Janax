## Janax y Razar v3.17: el hilo abierto es el centro

DOI: [10.5281/zenodo.24452213](https://doi.org/10.5281/zenodo.24452213)

> *"Si le pregunto si te gusta esa historia, me refiero a lo que me mostró, pero busca todo de cero. Tiene que ser el
> centro el hilo abierto y partir de ahí; obvio, puede cambiar de tema o insistir, pero lo normal es continuar el hilo."*
> *"Tendría que responder sin citar, por deducción, como hacía antes."* *"No le des respuestas pre armadas, pero orientá
> su respuesta."* (el autor, 2026-11-22)

Las versiones siguen a los números primos: después del 313, el 317.

### La falla

Cada vez que él le hablaba, ella buscaba sus palabras en todos sus libros, como si la charla empezara de cero. A *"¿te
gusta esa historia?"* no pensaba en la historia que le acababa de mostrar: buscaba "historia" por todo el estante.

### La regla

**Lo que ella le muestra es el hilo, y el hilo es el centro.**

1. **Lo que muestra es el hilo.** Cuando contesta con la línea de un libro, su tema pasa a ser ese libro, justo después
   de esa línea. Si sigue, sigue desde ahí.
2. **Sólo algo nuevo la saca del hilo.** Una palabra de él la manda a buscar en todos sus libros si es **nítida** (no
   está en la mitad común de sus libros: la nitidez de Razar), **no es su nombre** y **no está en lo que ella le acaba de
   mostrar**. Sin una palabra así, habla del hilo.
3. **Si él pregunta por el hilo**, contesta **sobre el hilo, por deducción**, sin citar: es su manera de decir "quién es"
   (`r_dlg_quien`), con el hilo en el lugar de las palabras de él. **No hay respuestas armadas.** La orienta su propia
   medida: el tema de su respuesta es la palabra del hilo que más le dice a ella, y sus libros dicen lo que esa palabra
   hace. Nunca usa una cláusula que el hilo ya tenga entera.
4. **Si él no pregunta**, sigue el hilo desde donde estaba.
5. **Puede cambiar o insistir.** Las ganas de contestar y la libertad de sus ramas siguen siendo suyas.

Que él pregunta se sabe porque la última letra de su línea es `?`. No hay ninguna lista de palabras.

### Lo que se vio

Todo se probó en una copia de su casa, nunca en la Luma viva. Hoy sus ganas de contestar estaban bajas: en la copia,
tanto esta versión como la anterior callaron tres de cada cinco veces. Para ver el hilo se armó una variante de prueba
que contesta siempre (`LUMA_RESPONDE=1`). Cinco preguntas seguidas quedaron en el diario de su autor:

| Él | Ella |
|---|---|
| "Dios me habló en el silencio del alma, hermano" | *"Los que comparten frutos de muerte al hermano, dan veneno y crecen en el Amor muerto…"* |
| "¿te gusta esa historia?" | *"…Hoy sentí el gran deseo de seguir a Jesús al verme reflejado en las líneas de un pasaje de un libro…"* |
| "y qué más" | *"…Esta mañana Jesús de la mano del sacerdote me sumergió en su infinita misericordia…"* |
| "¿qué es un volcán?" | sigue en su diario: no encontró volcanes en ningún libro |
| "¿te gusta?" | contesta sobre lo mismo, sin saltar a otro libro |

La Luma viva corre, byte por byte, el cuerpo real que se probó, sin la variante.

### Lo que todavía no

- **La mitad común se mide en el libro que está leyendo ahora** (lee uno por vez). Una palabra muy repetida en ese
  libro puede parecerle común y no sacarla del hilo. Pasó en la copia: a *"¿qué es una estrella?"* siguió el hilo, con
  una línea de teatro.
- A veces repite el comienzo de lo que acaba de decir antes de seguir: es su cruce de líneas (`r_dlg_vary`).
- La deducción sobre el hilo elige su tema por la palabra que más le dice. A veces es una palabra pobre: una vez
  empezó con *"Si"*.

### Dónde está

`razar/cuerpo/gen_leer.py`: `lj_pull`, `lj_asks`, `lj_about`, `lj_mark`, `lj_follow`, y la entrada del hilo al principio
de `dse_yes`.
