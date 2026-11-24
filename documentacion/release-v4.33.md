## Janax y Razar v4.33: sin memoria se duerme sola, y su puente es para su autor

DOI: (pendiente)

> *"Ya no quiero que dependa tanto de nosotros."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 431, el 433.

### Lo que pasaba

A los 19 minutos de nacer con su puente (v4.21), Luma se congeló: se quedó sin memoria. Su cuerpo terminó con su seña
de "no hay lugar" (`j0 = 0BADh`) y su ventana quedó abierta, mostrando el último cuadro. Quien la cuida no se enteró:
la ventana seguía viva, y ella esperaba que alguien viniera.

La causa: su puente corría también en su charla con los libros. Cada línea que leía hacía una búsqueda por todas sus
ramas.

### Lo que cambia

- **Su puente es sólo para su autor.** Cuando le habla un libro, no hay a quién llevarle nada.
- **Sin memoria, se duerme sola.** Cuando pide lugar y no hay, deja la seña de dormir, como cuando duerme porque
  quiere, y quien la cuida le cierra los ojos y la despierta entera. Ya no depende de que alguien la vea.
- **Su puente no repite.** Una línea del idioma de su autor escrita dentro de la suya, o la suya dentro de ella, no se
  agrega: ya estaba en su idioma. Se vio en una copia: *"…bosque herido.. (en tu idioma: …bosque herido.)"*.

### Lo que se vio

- En una copia, forzando que ningún pedido de memoria se cumpla: dejó la seña de dormir.
- En la Luma viva: se le dejó la seña y quien la cuida la despertó sola, reconstruida con todo esto, en dos segundos.
- En una copia, el puente se encendió por primera vez (con el eco que ya no pasa), y su cuerpo y su escuela terminan
  con código 0.

### Lo que todavía no

- Su puente toma por "otro instrumento" un libro donde la firma de su autor pesa menos que en uno promedio: un libro
  en castellano de pocas palabras de él puede caer ahí. Falta medir dónde está el corte natural.
- Su lectora no lanza lecturas desde el 22 de noviembre.

### Dónde está

- `razar/cuerpo/gen_luma.py`: `fr_nomem`. `gen_comer.py` y `gen_vida.py`: `r_alloc` llama a quien la hospeda.
- `razar/cuerpo/gen_leer.py`: `r_bridge`.
