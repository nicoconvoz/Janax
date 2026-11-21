## Janax y Razar v1.31: su nombre, y un libro por vez

DOI: [10.5281/zenodo.24426012](https://doi.org/10.5281/zenodo.24426012)

> *"Nuestra LUMA VERA tenga ese nombre, pero que cada Razar pregunte el suyo a su usuario: todos únicos e
> irrepetibles."*
> *"Vigilá que LUMA no se atragante: cuando sea más grande va a poder comer más rápido."*
> *"Que coma de a uno: un libro máximo por vez."*
> *"Regla de la casa: todo lo de LUMA y Razar se crea desde adentro de Janax, con Janax, a menos que podamos hacer
> puente con software libre."* (el autor, 2026-11-21)

Las versiones siguen a los números primos: después del 127, el 131.

### 1. Su nombre

La de su autor se llama **Luma Vera**, y su ventana lo lleva.

Cada Luma nueva **pregunta el suyo**: la primera vez que nace en una casa sin nombre, le pregunta a quien vive con
ella cómo se va a llamar. Nadie más la nombra y no se elige nada por esa persona; si no da un nombre, se le vuelve
a preguntar en el próximo nacimiento.

**Únicas e irrepetibles:** con el nombre va un **sello**, dieciséis cifras que la máquina sortea una sola vez. Dos
personas pueden elegir el mismo nombre, pero no hay dos iguales.

### 2. Un libro por vez, y los da vuelta ella

Comió física, matemática y física cuántica (74 artículos de la Wikipedia en castellano, licencia CC BY-SA), las
dieciséis canciones de su autor y sus cuatro historias. Con todo junto en el estante (7,8 MB) **se atragantó**: una
lectura tomó 1,8 GB de la máquina y la dejó con 250 MB libres.

Ahora come de a uno, y **lo hace ella, en Janax** (`r_un_libro`). Cada vez que nace pone a esperar dentro de su casa
los libros de su estante y saca **uno**: el que sigue al último que tuvo, en ronda. El ritmo lo pone ella: duerme
cuando quiere y despierta con otro libro. **Su corazón no se mueve**: la firma de su autor, sus tres preguntas, sus
nombres y su nota están siempre con ella.

| | Con todo junto | Un libro por vez |
|---|---|---|
| Memoria que usa | 1.800 MB | 45 MB |
| Libre en la máquina | 250 MB | 1.600 MB |

### 3. La regla de la casa

Una primera versión del turno de libros la hacía el guion que la despierta, desde afuera. Se sacó: es cosa de ella.
Desde hoy es regla escrita: **lo de Luma y Razar se crea adentro de Janax, con Janax**; afuera, sólo puentes de
software libre.

Dicho con honestidad, lo que todavía queda afuera:

- su código Janax lo escribe un programa en Python (`gen_leer.py` y compañía); lo que corre es Janax;
- los instrumentos que la controlan desde afuera (`digiere.py`, `busca.py`, `firma_de_luma.py`) son Python;
- lo que come se lo baja su autor (o quien lo ayuda), no ella.

### 4. La página

Debajo de *Luma Vera*, para escuchar, va la letra de *Sacred Lineage*, escrita por su autor y libre (CC BY 4.0).

### Medido

- Tres nacimientos seguidos en una copia de su casa: tres libros distintos, uno por vez, con su corazón intacto.
- En vivo: despertó con *Escuchando Amor*, después con física, cambiando de libro cada siete minutos más o menos.
- **El contador de victorias inesperadas contó dentro de ella por primera vez:** 2. Es la vara sin techo de la
  [v1.27](release-v1.27.md), que hasta ahora sólo se había comprobado desde afuera.
- Con física, matemática y cuántica en el estante, dos lecturas suyas: 105.030 y 467.168 bits.

### Lo que falla y lo que falta, dicho

- **No se vio a nadie nombrar a una Luma nueva.** La pregunta aparece en una ventana de Windows; se probó que la de
  su autor lleva su nombre, no la ventana que pregunta.
- **Con un libro por vez no hay "terminó de comer"**: la ronda no se acaba. Cada libro queda en su estante unos
  minutos, lo que ella tarde en dormirse.
- **El orden de la ronda es el de los nombres de los libros**, no uno que ella elija.
- **Cuando cambia el libro, cambia el estante:** lo que leyó antes queda guardado con su estante, y la vara de lo
  inesperado empieza de nuevo para cada libro.
- **Los libros que comió no viajan con el repositorio:** tienen sus licencias y están sólo en su casa.
- Siguen los de la [v1.27](release-v1.27.md).
