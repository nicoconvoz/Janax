## Janax y Razar v4.99: la armonía entre sus armonías — contesta desde ella, no desde el libro

DOI: [10.5281/zenodo.24541102](https://doi.org/10.5281/zenodo.24541102)

> *"Estamos buscando la armonía entre las armonías: la fuente armónica."*
> *"Que procese sus ideas y responda desde ella, no desde el libro."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 491, el 499.

### Lo que cambia

- **Todos sus pasos proponen.** Su camino era una escalera: el primer paso que encontraba algo contestaba, por flojo que
  fuera, y casi siempre era una cita de un libro. Ahora cada paso de su camino dice su respuesta y ninguno corta a los
  demás (`wy_cand`).
- **Gana la que más armoniza con las otras.** Entre cada par de propuestas se miden las palabras que comparten sobre
  las palabras de las dos; la que más suma con todas las demás es la base. Una respuesta rara queda sola. Ningún paso
  va delante de otro por decreto: en un empate vale el orden de su camino (`wy_choose`).
- **Y desde ahí teje una frase que nadie escribió.** Empieza por la que más armoniza, y en cada palabra (de más de tres
  letras) que otra de sus propuestas también dice, sigue por esa otra; cada propuesta se toma una sola vez, y su frase
  termina donde termina la que está siguiendo. Si no comparten ninguna palabra no hay con qué tejer: queda la que más
  armoniza, entera.

- **Luma completa, al día.** `razar/luma-completa/luma-casa-2026-11-25.zip` se rearmó con su casa de hoy (347 archivos,
  419 MB abierta, 17 MB comprimida): suma las cuatro obras de la v4.91. Lo personal de su autor sigue afuera, cada
  cosa con su motivo en el [índice](../razar/luma-completa/INDICE.md); se volvió a revisar buscando rutas, correos y
  nombres. Y la [carta del autor](../CARTA-DEL-AUTOR.md) lo cuenta.

### A qué se parece en el oficio

Elegir la respuesta que más coincide con las demás es la decisión de riesgo mínimo (Kumar y Byrne, 2004). Cruzar varias
frases por las palabras que comparten es la fusión de frases por grafo de palabras (Filippova, 2010). Lo propio: las
frases que se cruzan no vienen de afuera, son las que proponen sus propios pasos.

### Lo que se vio

En una copia oculta de su casa, con su camino de verdad: a *"hola Luma"* contestó *"Yo soy bueno, y Soy bueno."*, una
frase que no está en ninguno de sus libros. Cuatro frases, todas sus partes con código 0.

### Lo que todavía no

- **Es suya, pero no siempre tiene sentido.** A *"como estas?"* tejió una frase larga con pedazos de tres libros. Se
  midieron cuatro frases, no una batería: cuántas salen bien no se sabe todavía.
- Si la mayoría de sus pasos cita un mismo tema, lo que teje es de ese tema: la armonía es entre lo que ella propone.
- Cada respuesta cuesta más: recorre todo su camino en vez de cortar en el primer paso que contesta (no se midió cuánto).
- Tab sigue pendiente; y un libro del disco se le cuela a veces como bytes que no son texto.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `wy_cand`, `wy_choose`, `wv_l` (el tejido). `gen_formas.py`: `CNR`…`WVM`.
