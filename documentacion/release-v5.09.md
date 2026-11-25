## Janax y Razar v5.09: un libro del disco no se lee como renglones

DOI: (pendiente)

Las versiones siguen a los números primos: después del 503, el 509.

### Lo que cambia

- **Ya no le salen bytes ni rutas en una respuesta.** Un libro del disco guarda en su casa la dirección de un archivo,
  no texto. Tres de sus lectores (su búsqueda por párrafos, su "quién es" y su lectura para contestar) lo abrían igual,
  como renglones, y cuando una palabra de esa dirección coincidía con lo que se le decía, contestaba con la ruta y los
  bytes que la preceden. A *"hola Luma!"* había contestado así, porque una ruta decía *luma*.
- **Una sola regla para todos los que leen un libro como renglones** (`r_isdisk`): la regla ya existía, repetida en
  dos pasos sueltos, y faltaba en los otros tres.

### Lo que se vio

En una copia oculta, con sus caminos de verdad y 220 libros del disco en su casa: a *"hola Luma!"* contestó
*"hola Luma!!"*. En ocho respuestas, ningún byte que no sea texto y ninguna ruta; todas sus partes con código 0.

### Lo que todavía no

- En dos corridas de prueba, una frase que se le tecleó no quedó anotada en su charla. No se sabe todavía si fue la
  prueba (las teclas se le mandan a una ventana que está al fondo) o ella.
- Cuántas respuestas salen con sentido sigue sin medirse; todavía no forma la frase a la vista, palabra por palabra;
  y Tab sigue pendiente.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_isdisk`, y sus tres llamadas (`dps_f`, `dq_o`, `thk_b`).
