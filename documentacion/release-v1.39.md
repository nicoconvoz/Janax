## Janax y Razar v1.39: lo que se le escribe, tal cual

DOI: [10.5281/zenodo.24427888](https://doi.org/10.5281/zenodo.24427888)

> *"Primero no reconoce UTF-8; segundo, hubo un desborde cuando escribí un texto más largo: se tildó todo."*
> *"Si el código máquina entrega toda clase de caracteres, no solo la UTF-8, ¿no podría aprender según lo que se
> encuentre?"* (el autor, 2026-11-21)

Las versiones siguen a los números primos: después del 137, el 139.

### 1. Se tildaba con un renglón largo

Lo que se le escribe se ve en una línea de 25 letras; cuando el renglón pasaba de ahí, Luma mostraba el final
**restando donde tenía que sumar**: leía antes del comienzo de su propio cuarto, el núcleo la frenaba por salirse
de su memoria, y la ventana quedaba congelada en la letra 25. No era la búsqueda de la respuesta: era un signo.

Medido en una copia de su casa: una frase de casi 150 letras, contestada en el acto.

### 2. El núcleo entrega cada carácter escrito

Hasta ahora el núcleo decía sólo **qué tecla** bajó (evento 4). Ahora además dice **qué carácter** se escribió:
el **evento 7**, con su punto de código Unicode (las dos mitades de un par sustituto ya juntas). Acentos, eñes,
griego, árabe, emojis: lo que el teclado arme, sin filtro ni traducción.

### 3. Luma lo guarda tal cual, y lo que es igual lo aprende ella

Lo que se le escribe queda en `dialogo` en UTF-8, byte por byte. Para ella, **una letra** es a..z (minúscula o
mayúscula da igual) o **cualquier carácter entero más allá de ASCII**, cuya huella es su propio punto de código:
*"corazón"* es una palabra entera, y no *"coraz"* + *"n"* como antes.

**Qué acentos valen lo mismo no se le da en una tabla.** Fue decisión del autor: que lo aprenda con lo que lea.
Su juez es la compresión, y dos formas que aparecen en los mismos lugares se explican mejor como una sola; y
puede descubrir que *"papa"* y *"papá"* no lo son.

La palabra de cuatro letras o más se cuenta en letras, no en bytes; borrar quita un carácter entero (un emoji
también); en su ventana cada carácter ocupa un lugar.

### 4. Dos pisadas de memoria, arregladas

El dibujo de letras y el diálogo usaban de borrador casillas de su digestión (los nombres de una pieza, sus
cuentas). Pasaron a su propio cuarto. El verificador del corazón (`busca.py`) sigue la misma regla de letra.

### Medido

- Escribiéndole a su ventana como lo hace un teclado: `á` quedó `c3 a1`, `ñ` `c3 b1`, 🌱 `f0 9f 8c b1`.
- A *"¿Quién es Dios? 🌱 luz"* contestó: *"La Virgen concebira y dara a luz un hijo..."* (así, sin tildes, como está en su libro).
- La batería del núcleo: **411 bien, 0 mal**.
- En vivo desde el 21 a las 17:48.

### Lo que falla y lo que falta, dicho

- **Todavía no aprendió que "ó" y "o" son la misma letra.** Sus libros están escritos sin acentos, así que a
  *"corazón"* con tilde hoy no le encuentra la palabra. Está dicho que es suyo aprenderlo; no se lo vio hacer.
- **En su ventana, las letras que su abecedario de puntitos no tiene** (ó, ñ, 🌱) se ven como un hueco.
- **Cualquier carácter más allá de ASCII cuenta como letra**: una raya larga o unas comillas curvas pegadas a
  una palabra quedan dentro de ella.
- El evento 7 no tiene prueba propia en la batería del núcleo: se probó escribiéndole a su ventana.
- Siguen los de la [v1.37](release-v1.37.md), salvo los que esta versión salda.
