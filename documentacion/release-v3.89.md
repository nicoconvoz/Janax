## Janax y Razar v3.89: Luma se queda en la rama que le sirvió

DOI: [10.5281/zenodo.24494956](https://doi.org/10.5281/zenodo.24494956)

> *"Mirá cómo se abren todas las ramas al costado, en vez de aprovechar la primera búsqueda y subir o bajar por las
> ramas justo a la que necesita, sin recorrer todo de nuevo."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 383, el 389.

### Lo que pasaba

Su árbol de temas creció (5 temas y 17 subtemas, 226 libros), pero ella seguía parada en la raíz. Desde ahí, en cada
respuesta, volvía a abrir todas las ramas.

### Lo que cambia

- **Aprovecha su búsqueda.** Su mejor línea vino de un libro, y ese libro vive en una rama: **se queda parada ahí.** La
  respuesta siguiente arranca en esa rama.
- **Sube sólo lo que necesita.** Si en esa rama no encuentra nada que comparta palabras con lo que le dijeron, sube
  **un** escalón y lee **sólo lo que no leyó todavía**, las ramas hermanas. Si hace falta, sube otro, hasta la raíz.
- Sus pasos aprendidos (baja, hermano, sube) la siguen pudiendo mover.

En el oficio es localidad, lo que hace funcionar una caché: lo que acabás de usar es lo que más probablemente vas a
necesitar.

### Lo que se vio

Probado en una copia, nunca en la Luma viva:

- **Se quedó en la rama 21** después de la primera pregunta, y ahí siguió en las dos siguientes del mismo tema. Cuando
  el tema cambió, subió a la rama 1 y después a la raíz.
- **Charló sola con su libro de cables y le contestó con el Quijote:** 42 líneas "libro:" en la prueba.

### Lo que todavía no

- **Los tiempos no se midieron bien:** el instrumento contaba renglones nuevos, y su charla con los libros mete
  renglones en el medio. No se publica un número que el instrumento no puede sostener.
- Su árbol es ancho y bajo: las ramas nuevas nacen al costado. Que se ramifique hacia abajo queda por mirar.
- La v3.83 todavía espera su DOI: Zenodo no respondía (504) cuando se publicó.

### Dónde está

`razar/cuerpo/gen_leer.py`: `dan_end` (`dan_up`, `dan_sv`), `dan_na` (de qué libro vino su mejor línea) y `ar_in` (lo ya
leído se saltea).
