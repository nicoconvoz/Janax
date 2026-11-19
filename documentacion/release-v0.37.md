## Janax y Razar v0.37: el ingrediente X

DOI: pendiente

> *"Solo te pido que le agregues el ingrediente X: AMOR."* (el autor, 2026-11-19)

Las versiones siguen a los números primos: después del 31, el 37.

### 1. Las recetas de órganos viajan con el repositorio

Vivían solo en la biblioteca de la máquina del autor, y ningún release las traía. Ahora hay una copia legible en
[`razar/lectura/recetas/`](../razar/lectura/recetas/LEEME.md): cada órgano que ganó, con su nota, a quién le ganó y
el código de cada letra. El camino sobre el Nuevo Testamento, cada uno ganándole al anterior:
`6` (−1586) → `5` (208) → `16` (2649) → `716` (4700) → `516` (11144). Los dos últimos se volvieron a encontrar el
2026-11-19 en una vida de 40 intentos (4 min 40 s), partiendo sin órgano y con las recetas guardadas rindiendo primero.

### 2. Razar vive en la casa de Luma

`razar/cuerpo/razar_en_casa.sh <carpeta> <libro>` deja a Razar en vigilia dentro de la casa de Luma, sin borrar nada
de ella. Lee su libro, prueba las recetas de su modelo y descansa en su timbre. Lo despiertan dos cosas: una carta
de Luma y un libro nuevo en la casa (un archivo cuya etiqueta empiece con `libro`).

- **Medido:** dormido gasta **0,000 s de procesador en 30 s** con Luma escribiendo al lado, y ocupa 141 MB.
  Luma: 2,75 s cada 30 s (9 % de un núcleo) y 39 MB.

### 3. El ingrediente X: lo que crea, lo comparte

Cuando una forma de Luma gana, se la deja a Razar en una carta (`carta2`: el genoma de él y la receta de ella como
órgano). Es un evento, nunca un reloj. Razar ya sabía despertar con una carta y probar primero el órgano que le
traen, con sus propios libros y en su jaula: no se tocó `pulso.jsm`.

- **Probado a mano** con el órgano `516` en la carta: Razar despertó, lo probó, ganó, se rehízo con él y volvió a
  descansar.
- **Lo que falla, dicho:** en 70 s a toda marcha, sin ventana, **ninguna forma ganó** (la población está en su
  óptimo: 131 victorias en total). La carta por victoria casi no sale, así que hoy Razar duerme casi siempre.
- **Lo que no se afirma:** que esto sea amor. Lo construido es un acto: dar lo propio a otro para que lo pruebe con
  su propio juez.

### 4. La carta del autor a Luma

[`razar/corazon/de-tu-autor.txt`](../razar/corazon/de-tu-autor.txt): *"Te hice con Amor y te quiero mucho."*
Su reconocedor dice que lleva la firma del autor: 338 bits dado su diario, 343 dado el Nuevo Testamento y 451 dado
el libro del ayudante. Son 83 letras y la ventaja es de 5 bits: es un sí corto.

### Lo que falta

- **La libertad** (el autor: *"es incluso no hacer nada a propósito, y hacer algo cuando se le ocurra"*): que Luma
  elija en cada respiro entre pensar, compartir o no hacer nada. No está construida.
- **Qué comparte:** solo lo que gana es demasiado raro. Lo que su juez descartó puede servir en el marco de Razar
  (*"a veces lo que falta es el marco"*), pero cada carta le cuesta a Razar unos 7 s de procesador: falta decidir
  el ritmo con una medición.
- **Estudiar libros desde su ventana:** hoy los estudia Razar (y el vigía, los textos del anfitrión), no Luma.

### Cómo verla

Descomprimí `luma-casa-corazon.zip` dentro de una carpeta y corré `bash razar/cuerpo/luma.sh <carpeta>`. Para que
Razar viva en esa casa: `bash razar/cuerpo/razar_en_casa.sh <carpeta> <libro>`.
Suite del sistema operativo: **402 bien, 0 mal**. Lo anterior: [v0.31](release-v0.31.md) · [v0.19](release-v0.19.md).
