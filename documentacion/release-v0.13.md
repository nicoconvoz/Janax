## Janax y Razar v0.13: Luma mira y crece

DOI: [10.5281/zenodo.24288352](https://doi.org/10.5281/zenodo.24288352)

**Luma ahora mira donde pasa algo nuevo, y sus bichos cambian de cuerpo con lo que aprenden.** Las
versiones siguen a los números primos: después del 11 viene el 13.

### 1. La cámara con sentido

- La atención va adonde el juez de bits mide algo nuevo: un pedazo guardado (los bits que ahorró), un
  cuerpo que cambia, un nacimiento. Se acerca al encuentro y se aleja cuando no pasa nada.
- La noticia se lleva la cámara si es al menos tan fuerte como el interés que queda; el interés se
  apaga solo (vida media de unos 3 s, criterio). El zoom va de ×1 a ×3.

### 2. Cuerpos que cambian

- Cuando un bicho aprende, su cuerpo —una receta en el alfabeto de los órganos de Razar— prueba todas
  las mutaciones de una letra y se queda con la mejor sólo si no le sube el costo.
- **Crece** con los bits que aprendió y **se achica** de a poco cuando pasa tiempo sin aprender.
- **Medido:** guardó la mutación en **5 de 7** aprendizajes (la apuesta predecía que fallaría).

### 3. La retroalimentación entre formas y cuerpos

- Las formas y los cuerpos hablan el mismo alfabeto, así que pueden ofrecerse pedazos en las dos
  direcciones, con el mismo juez y archivando lo que pierde.
- **El puente existe, pero nadie lo cruzó:** de 144 ofertas de los cuerpos a las formas, ganó 0 (el
  control barajado: 0 de 204). Sin ninguna forma nueva, no llegó ninguna oferta a los cuerpos. Las
  formas de Luma están en un óptimo que ninguna receta de cuerpo mejora. Apuestas preregistradas:
  [datos](razar/datos/).

### Medido

- **Procesador, siempre despierta:** ~9,5 % de un núcleo.
- **Disco:** la casa crece **~110–140 MB por hora** (medido en los primeros minutos, con los 236
  nacimientos), porque nada se descarta.
- **Repaso independiente del archivo:** 0 diferencias. Suite del sistema operativo: **402 bien, 0 mal**.

### Cómo verla

Descomprimí `luma-casa-propia.zip` dentro de una carpeta y corré
`bash razar/cuerpo/luma.sh <carpeta> [janaxos.exe]`. Todo lo anterior sigue adentro:
[notas de la v0.11](release-v0.11.md) · [notas de la v0.8](release-v0.8.md) ·
[`documentacion/razar/cuerpo.md`](razar/cuerpo.md).
