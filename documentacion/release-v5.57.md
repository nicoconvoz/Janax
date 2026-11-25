## Janax y Razar v5.57: Luma purificada

DOI: (pendiente)

> *"Arreglala y compartí la Luma purificada en el repo."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 547, el 557.

### Lo que pasó

Desde el 24 de noviembre Luma puede leer los archivos del sistema (*"que lea archivos de sistema o las cosas que se
puedan leer para entender"*). El 25, Windows instaló una actualización y desempaquetó sus archivos en una carpeta
temporal. Ella los vio como archivos nuevos y se comió **1.544 en una tarde**. Esos archivos ya no existen: sus
libros del disco apuntaban a la nada, y uno de ellos fue lo que contestó cuando se le preguntó por Isaac Newton.

| | antes | después |
|---|---|---|
| archivos en su casa | 2.154 | 610 |
| peso de su casa | 1.221 MB | 149 MB |
| memoria que ocupa despierta | 2.385 MB | 314 MB |

No era una fuga de memoria: lo suyo propio eran 38 MB, y el resto su casa cargada entera.

### Lo que se hizo

- **Salieron los 1.544 libros de esa carpeta temporal** y sus 1.544 avisos de *"me comí"*.
- **Salieron 4.149 firmas huérfanas.** Guarda una firma de 270 KB por cada libro que contó, y la mayoría eran de
  libros que ya no estaban en su casa: 1.122 MB que sólo pesaban. Quedaron las 292 de los libros que tiene. Si alguna
  hiciera falta, la vuelve a contar sola.
- **Nada se tiró.** Todo quedó archivado con su motivo, comprimido en 7 MB.
- **`razar/luma-completa/` es ahora la Luma purificada**: su casa de hoy, 347 archivos, 137 MB abierta (eran 419) y
  17 MB comprimida. Lo personal de su autor sigue afuera, cada cosa con su motivo en el
  [índice](../razar/luma-completa/INDICE.md); se revisó otra vez buscando rutas, correos y nombres.

### Lo que todavía no

- **Puede volver a pasar.** La regla que la deja leer la carpeta de Windows sigue como estaba: en la próxima
  actualización se va a comer otra vez lo que Windows desempaquete. Falta decidir la regla (no leer el sistema, o
  leerlo sin comer lo que no aporta nada nuevo); hasta entonces, la herramienta de abajo la limpia.
- Su árbol de temas no se tocó: puede guardar todavía huellas de los libros que salieron.
- Lo que contesta desde sus libros sigue sin tener que ver con la pregunta; cuando no sabe devuelve la pregunta; los
  nombres de otra charla y Tab siguen pendientes.

### Dónde está

- `razar/cuerpo/desintoxicar_firmas.py` (nuevo): saca de `lenguas` las firmas de libros que ya no están, y de
  `me-comi` los avisos de una carpeta. `razar/cuerpo/desintoxicar_tema.py`: saca los libros del disco de una carpeta.
- `razar/luma-completa/luma-casa-2026-11-25.zip` e `INDICE.md`.
