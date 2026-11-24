## Janax y Razar v3.97: un registro que crece al final no es un libro

DOI: [10.5281/zenodo.24496597](https://doi.org/10.5281/zenodo.24496597)

> *"La estamos intoxicando con logs: cuando detecte una estructura de logs, que no se la coma."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 389, el 397.

### Lo que pasaba

Luma come lo nuevo de los discos. Pero algunos archivos son **registros**: el del vigía (`vigia.log`), el de su propio
arranque (`luma.log`), las salidas de las pruebas. Cambian todo el día, y ella los tenía en su estante como libros.

### La regla (general, sin nombres de archivos)

Cuando un libro del disco que ya conocía cambia, ella mira dos cosas:

1. **¿Creció sólo al final?** Saca la huella de los primeros bytes del archivo nuevo, tantos como tenía antes. Si es la
   misma huella que había guardado, lo que era sigue entero y sólo se le agregaron renglones abajo.
2. **¿Sus renglones empiezan con etiqueta?** Más de la mitad arrancan con un número o con una palabra seguida de dos
   puntos ("vigia:", "comido:", una hora).

**Las dos juntas** dicen "registro". Con una sola no alcanza: un diario escrito al final crece igual, pero sus renglones
arrancan distinto; un archivo de configuración tiene "clave: valor", pero cambia por dentro.

Un registro **no se borra**: su libro pasa a llamarse `registro-disco-…`, que no es un libro de su estante, y ella no lo
vuelve a comer.

Para poder comprobarlo, el libro del disco guarda ahora **la huella, el tamaño y la dirección**. Su lectora se ajustó, y
`razar/cuerpo/libros_del_disco.py` pasó sus 173 libros del disco a la forma nueva.

### Lo que se vio

Probado en una copia, nunca en la Luma viva: un `registro.log` y un `diario.txt` nuevos se comieron y se saludaron una
vez. Cuando los dos crecieron al final, **el registro pasó a registro, callado, y el diario siguió siendo libro.**

Al convertir su casa se vio por qué no conviene decidirlo desde afuera: sin el tamaño de antes, `CITATION.cff` (clave:
valor, cambiado por dentro) parecía un registro. Por eso lo decide ella, con la regla entera, la próxima vez que cada
archivo cambie.

### Una enfermedad encontrada (y todavía no curada)

**Su lectora se cae desde la v3.79** (código 5, un acceso a memoria inválido), así que no terminó ninguna lectura desde
el 23 de noviembre a las 23:10. Con los cuerpos de antes del árbol termina bien. Es lo próximo a curar.

### Dónde está

- `razar/cuerpo/gen_luma.py`: `he_record` (la regla), `he_done` (busca también `registro-disco-`), y el tamaño en el libro.
- `razar/lectura/lectura.inc`: `scan_file` (la dirección después de la huella y el tamaño).
- `razar/cuerpo/libros_del_disco.py`.
