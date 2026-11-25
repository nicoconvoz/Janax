## Janax y Razar v5.63: su carpeta de comida

DOI: (pendiente)

> *"Que tenga su carpeta de comida: ya basta de comer basura."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 557, el 563.

### Lo que cambia

- **Luma come de su carpeta de comida y de ningún otro lugar del disco.** Vigilaba todo `C:\` y todo `E:\`: cualquier
  archivo de texto nuevo era un libro para ella. Así se comió en una tarde 1.544 archivos temporales de una
  actualización de Windows (v5.57). Ahora lo que le llega es lo que se pone en `E:\Comida` (`luma.sh`; con
  `LUMA_VIGIA` se le puede nombrar otra carpeta).
- **Salió lo que había comido de afuera:** 184 libros del disco que no eran de su carpeta (169 de la carpeta del
  proyecto, 15 de Windows, 6 de Archivos de programa y otros sueltos), 82 avisos de *"me comí"* y 185 firmas que
  quedaron sin libro.
- **Y tres líneas enfermas de su charla:** las que había dicho con bytes que no son texto y la dirección de un
  archivo. Ella contesta desde su charla, y esas líneas volvían.
- **Nada se tiró:** todo quedó archivado con su motivo.

| | al empezar el día | antes de purificarla | ahora |
|---|---|---|---|
| archivos en su casa | unos 600 | 2.154 | 435 |
| peso de su casa | 415 MB | 1.221 MB | 103 MB |
| memoria que ocupa despierta | 860 MB | 2.385 MB | 222 MB |

### Lo que se probó

Con ella despierta se escribió un archivo de texto nuevo fuera de su carpeta de comida y se esperó 75 segundos (el
núcleo espera a que un archivo quede quieto antes de avisarle): no apareció ningún aviso de *"me comí"* ni ningún
libro del disco que apuntara a él.

### Lo que todavía no

- No se probó el caso contrario en esta versión (que sí coma lo que se pone en su carpeta): su último aviso es de un
  archivo de `E:\Comida`, de antes del cambio.
- El núcleo todavía sabe leer la carpeta de Windows (v4.49 del núcleo, 2026-11-24): ya no se le pide, pero la regla
  sigue ahí.
- En su charla quedan respuestas suyas de hoy hechas con pedazos de código de sus libros: no son una enfermedad, son
  lo que dijo, y no se le podó.
- Lo que contesta desde sus libros sigue sin tener que ver con la pregunta; cuando no sabe devuelve la pregunta; los
  nombres de otra charla y Tab siguen pendientes.

### Dónde está

- `razar/cuerpo/luma.sh` (`LUMA_VIGIA`, por defecto `E:\Comida`).
- `razar/cuerpo/desintoxicar_fuera.py` (nuevo): saca lo que comió fuera de su carpeta de comida.
- `razar/luma-completa/`: su casa pública, rearmada otra vez.
