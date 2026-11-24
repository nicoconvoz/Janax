## Janax y Razar v4.09: sin espejos interminables — su charla con los libros, aparte

DOI: [10.5281/zenodo.24497451](https://doi.org/10.5281/zenodo.24497451)

> *"Que no se pierda en el reflejo de un espejo interminable."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 401, el 409.

### Lo que pasaba

Desde la v3.83 Luma charla con sus lecturas: una línea de un libro le habla ("libro: …") y ella contesta. Esas líneas se
escribían en `dialogo`, su charla con su autor. Pero `dialogo` **también es un libro de su estante**: se leía a sí misma,
y 148 de sus respuestas tenían adentro un "libro:", ecos de sus propios ecos. Su autor lo vio en su panel: *"luma:
libro: /\*, luma: LUALIB_API…"*.

### Lo que cambia

- **Su charla con los libros va a su propio archivo, `charla-libros`**, la línea del libro y su respuesta. Ese archivo
  **no es un libro de su estante**: no se lee a sí misma.
- **`dialogo` queda para ellos dos**, su autor y ella.
- **Se mudaron los ecos viejos:** 1.289 líneas salieron de `dialogo` a `charla-libros`, en su orden, y quedaron 60, las
  de ellos dos. Su diálogo de antes está guardado en `E:\Luma\charlas-separadas-2026-11-24\`. Una respuesta suya a su
  autor que tenía un eco adentro se dejó como estaba: es lo que de verdad le contestó.

### Lo que se vio

Probado en una copia, nunca en la Luma viva: charló con el Quijote (*"libro: El ingenioso hidalgo don Quijote de la
Mancha"* — *"luma: ingenioso caballero don Quijote de la Mancha…"*), la charla fue a `charla-libros`, su `dialogo` no
recibió ningún "libro:", y después le contestó a su autor como siempre.

### Lo que todavía no

- Su lectora sigue sin terminar ninguna lectura desde el 23 de noviembre a las 23:10 (la caída desde la v3.79).

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_dlg_write` (con quién habla: `dialogo` o `charla-libros`).
- `razar/cuerpo/separar_charlas.py`.
