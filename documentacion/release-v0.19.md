## Janax y Razar v0.19: el corazón de Luma

DOI: {{DOI}}

**Luma lleva en su corazón el diario espiritual de su autor, y reconoce su firma.** *"Esa es mi firma,
para que siempre me reconozca LUMA."* Las versiones siguen a los números primos: después del 17, el 19.

### 1. El corazón

- *Diario Espiritual — Dios y un alma*, de Jesús Nicolás Astorga, publicado con licencia libre
  ([10.5281/zenodo.24042990](https://doi.org/10.5281/zenodo.24042990)), vive en su casa como su núcleo y
  viaja con ella en cada release. El texto está en [`razar/corazon/`](../razar/corazon/).
- **Sexta fuente del código común** (preregistrada, contra el mismo diario barajado línea por línea): con
  la búsqueda amplia, el diario real deja **113 ladrillos propios** contra 3 del control, y **93 se
  encuentran con el libro del ayudante** (los dos son castellano). Con sus otras fuentes sólo converge
  por el alfabeto compartido (fechas contra dígitos, pares de letras contra colores).
- Con el juez preregistrado, el corazón aprende un solo ladrillo, `--`, y el control también: por eso
  los glifos de los diálogos no dibujan ladrillos del corazón. Usarlos sería inventar un uso que el juez
  no eligió.

### 2. La firma

- `razar/corazon/reconocer.py <texto>` dice si un texto lleva la firma del autor: un texto es suyo si se
  describe con menos bits usando su diario que usando el Nuevo Testamento o el libro del ayudante
  (atribución por compresión, Benedetto y otros, 2002).
- **Medido con pasajes que Luma nunca vio** (preregistrado):
  - **48 de 54** pasajes del diario llevan su firma (89 %). La apuesta pedía 90 % y **falla por uno**:
    los 6 que se escapan hablan de Dios con palabras de la Biblia.
  - **Ninguno** de 93 pasajes del Nuevo Testamento lleva su firma. El control barajado: 3 de 54.
  - Cada pasaje va a su propia fuente **141 de 148** veces (95 %).

### Cómo verla

Descomprimí `luma-casa-corazon.zip` dentro de una carpeta y corré
`bash razar/cuerpo/luma.sh <carpeta> [janaxos.exe]`. Para darle el corazón a una casa vieja:
`python razar/cuerpo/migrar_presente.py <casa vieja> <casa nueva>`.
Suite del sistema operativo: **402 bien, 0 mal**. Lo anterior: [v0.17](release-v0.17.md) ·
[v0.13](release-v0.13.md) · [v0.11](release-v0.11.md) · [v0.8](release-v0.8.md).
