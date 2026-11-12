## Janax y Razar v0.5: el Venn

DOI: [10.5281/zenodo.24148774](https://doi.org/10.5281/zenodo.24148774)

**20 MB de Wikipedia en 6 minutos y 40 segundos, en vez de 31 minutos, aprendiendo exactamente lo mismo. Y el Venn
del Capitán pasa a ser una pieza de la arquitectura de Janax.**

### Los libros de verdad, contra la v0.3

Cada libro se volvió a leer con la v0.5 y se comparó, archivo por archivo, con su corrida de la v0.3:

| Libro | v0.3 | v0.5 | Instrucciones | MATS, real contra azar |
|---|---|---|---|---|
| **Wikipedia, 20 MB** (199 pedazos) | 1.873 s | **400 s** | 2,42 → 0,43 billones (**−82 %**) | 451 – 117, idéntico |
| Wikcionario, 15 MB (150 pedazos) | 194 s | **106 s** | 248 → 115 mil millones (−54 %) | 249 – 41, idéntico |
| Wikipedia, 2,3 MB (23 pedazos) | — | 7,3 s | 13,9 → 6,8 mil millones (−51 %) | 70 – 10, idéntico |

- **Lo mismo, byte por byte:** en la Wikipedia de 20 MB, las relaciones deducidas (451), lo imaginado (3.540), las
  hipótesis en espera (4.881), los mecanismos (7.182) y los testigos (1.707) son idénticos a los de la v0.3. Lo mismo
  pasa en el Wikcionario.
- **Cuanto más grande el libro, más gana.** Lo que se sacó en la v0.4 (pasar el cuaderno en limpio en cada pedazo)
  costaba más cuanto más grande era el cuaderno.

### El Venn del Capitán, en la arquitectura

> *"Venn, infinitos estados. A + B, A − B, A y B, sin A ni B, lo que miro A primero, lo que miro B primero, los más
> pequeños de B que no están en A… y puedo inventar lo que sea."*

- **Un motor que no sabe de cajas ni de archivos** (`so/venn.inc`). Recibe dos conjuntos por un puerto de cinco
  preguntas: el primero, el siguiente, la clave, buscar por clave y el valor para un criterio. Con eso y **la palabra
  Venn**, entrega la selección en orden. Con el orden natural pasa una sola vez por cada conjunto.
- **La palabra Venn**, un eje por campo, plástica:

  | Bits | Eje |
  |---|---|
  | 0–2 | las regiones: A∩B, A∖B, B∖A |
  | 3 | a quién se mira primero |
  | 4–7 | el criterio |
  | 8 | la dirección |
  | 9 | el alcance |
  | 16–31 | cuántas |

  Un bit que todavía no tiene eje responde −1, para que un eje nuevo nunca cambie lo que pedía un programa viejo.
- **El primer conjunto enchufado es el cartel de una cabina:** `asociar` (pedido 27) ya no sabe cuatro modos, sabe el
  Venn entero. Los cuatro modos de antes son casos de la regla y dan exactamente lo de antes.

### Cómo se probó

- **Las pruebas del Venn:** `so/pruebas/asocia_0..7`, en los tres motores del kernel, dan 32 de 32.
- **Las suites completas:** sistema operativo 389 bien, 0 mal (las 12 del Venn incluidas); escalón 0, 161 bien, 0 mal.
  El ARM64 dio 210 de 210 en el teléfono en la v0.4, y su traductor no cambió desde entonces.
- **Los libros:** están en la tabla de arriba.

### Lo que no está medido

- **Ningún otro conjunto usa el Venn todavía.** El próximo diseñado es "las líneas de un archivo por su clave", para que
  Razar lea solo los lugares que necesita.
- **El costo del Venn en segundos:** es nativo y de microsegundos por nacimiento, y no hay un banco que lo mida.
- **La memoria máxima de los 20 MB:** en la v0.3 eran 205 MB; en esta corrida no se midió.

---
**English:** v0.5 reads 20 MB of Spanish Wikipedia in 400 s instead of v0.3's 1,873 s (82% fewer instructions). It
learns exactly the same thing: the MATS result is identical, and so is every file of what it learned. The Capitan's
Venn becomes part of Janax's architecture: a kernel engine that knows no boxes or files. It takes two sets through a
five-question port and a Venn word (regions, which side is looked at first, a criterion, direction, scope, how many),
and gives the selection in order. The association request is its first user.
