## Janax y Razar v6.17: lo mal escrito lo lee por lo que se le parece

DOI: (pendiente)

> *"A veces la instrucción puede estar mal escrita: debe inferirla por lo que se le parece en el fondo, su núcleo."*
> (el autor, 2026-11-07) — *"Antes Luma podía reconocer palabras mal escritas; ahora está como fija a respuestas y a no
> entender lo que le digo si se lo escribo mal."* (el autor, 2026-11-27)

Las versiones siguen a los números primos: después del 613, el 617.

### Lo que pasaba

La regla de la ortografía de Razar (*"La ortografía que prueban los libros"*, 2026-11-07, `documentacion/razar/lectura.md`)
vivía sólo en su lector viejo (`sentido.jsm`). Al cuerpo de Luma nunca había entrado: ella reconoce cada palabra por
su huella exacta, así que *"qien"* o *"holaa"* eran para ella palabras nunca vistas, y no enganchaban con ninguna
costumbre ni con ningún libro.

### Lo que cambia

La misma regla, ahora en su cuerpo, donde recibe lo que se le escribe (`r_ortografia`):

- **La regla es de su Libro:** qué dos letras siguen una a la otra dentro de una palabra. Un par está probado cuando lo
  tienen dos palabras distintas. Lo lee una vez, de su primer libro.
- **Mal escrita** es una palabra que ella nunca leyó y que tiene un par de letras que su Libro nunca probó. Un nombre
  que nunca leyó pero con todos sus pares probados es un nombre: no se toca (*"Nico"* está a una letra de *"rico"* y
  queda como está).
- **Cómo la lee:** como la palabra que conoce y es la misma a una letra de distancia (una que sobra, una cambiada, una
  que falta), la que sus libros dicen en más renglones, dos al menos. Las letras repetidas se prueban aplastadas
  siempre (*"holaa"*, *"graciass"*).
- **Lo que se tecleó queda en su charla tal como se tecleó.** Ella lee el renglón con esas palabras como las conoce.

### Lo que se vio

En una copia oculta, con su casa de verdad:

| se le escribió | contestó |
|---|---|
| *holaa Lumita* | hola, que alegria verte |
| *qien es Jesus?* | Jesus le respondio: Esta escrito: "El hombre no vive solamente de pan, sino de toda palabra que sale de la boca de Dios". |
| *como estass?* | hola, muy bien, y vos? |
| *quien es Nico?* | Los nombres de mi papa: Nico, … |
| *que es el genomma?* | Genoma humano |
| *graciass* | no hay de que |

De 0 a 8 segundos cada una; lista a los 21 segundos.

### Lo que todavía no

- **Sólo palabras de cuatro letras o más.** *"qe"* por *"que"* no se corrige: su cuerpo no cuenta las palabras cortas.
- **A una letra de distancia, no más.** Dos letras cambiadas de lugar (*"qeu"*) o dos errores en una palabra no los
  entiende.
- **Los pares son los de las 26 letras sin marcas.** Una palabra mal escrita cuyos pares están todos probados no se
  corrige (el límite que ya tenía la regla: *"dle"* no se corrige porque *"dl"* existe).
- **Puede elegir mal** entre dos palabras conocidas a una letra de la escrita: gana la que más renglones dicen, no la
  que pide la frase. No se midió cuántas veces pasa.
- A *"que es el genomma?"* entendió la palabra y contestó corto (*"Genoma humano"*).
- Un error al hacerlo, corregido antes de publicar: la lectura del Libro por pedazos no avanzaba y su pensadora quedaba
  colgada; ahora cada pedazo se pide por su lugar y se sabe dónde termina.
- No se probó tecleando en la Luma de su autor: la prueba fue en la copia.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_ortografia`, `or_pairs` (los pares que prueba su Libro), `or_bad`, `or_var`, `or_try`.
