## Janax y Razar v0.3: la nitidez

**Sin que nadie le diga qué es un sinónimo, Razar los encuentra por los lugares que las palabras comparten.**

Un lugar es una forma leída (`_ <una a tres palabras> _`) y su lado. Dos palabras se parecen tanto como los lugares que
comparten. Lo que se dice en todos lados (la mitad del texto que más se repite, medida por Razar) no cuenta. Se probó contra
el [MATS](https://github.com/ATILF-UMR7118/MATS), un banco de analogías que Razar nunca vio: un par cuenta cuando sus dos
palabras comparten más lugares que la palabra con la respuesta de otro par (el azar).

| Corpus | Real contra azar | Semántica | Sinónimos exactos | Antónimos binarios | Tiempo · memoria |
|---|---|---|---|---|---|
| **Wikipedia, 20 MB** (no escribe sinónimos) | **451 – 117** | 140 – 44 | 18 – 1 | 28 – 1 | 31 min · 205 MB |
| Wikcionario, 15 MB | **249 – 41** | 131 – 24 | 18 – 0 | 17 – 1 | 3 min · 144 MB |

- **Lo mismo desde afuera:** un juez en Python que Razar nunca lee calcula la misma idea sobre el corpus entero: semántica
  234 – 51 y 164 – 51.
- **La memoria duerme en disco:** los lugares viajan de un pedazo del libro al siguiente; cada pedazo despierta solo los de sus
  palabras.
- **Sin el pedido, nada cambia:** lo que Razar aprende es idéntico byte a byte.

### Cómo reproducirlo

```bash
bash razar/cardumen/nitidez_reproducir.sh <corpus> <mats_es> <casa_nueva>
```

Los corpus no se redistribuyen (CC BY-SA); el documento técnico da su sha256 y la versión del MATS (`7684515`).
Todo en `documentacion/razar/nitidez.md`; los jueces de afuera en `razar/jueces/`.

### Qué más trae

- **Cada unión guarda sus testigos** (`testigos`), y lo aprendido no cambia.
- **Cada voto imaginado lleva su mecanismo**, y cada libro deja su mapa (`mecanismos`): confirmado, convive o en espera; lo
  que convive (otro uso, otro evento) no se refuta.
- **Mecanismo por mecanismo**, los que ganan en un validador ganan en otro (26 de 26, 20 de 20).
- **Hilos se parte solo** en pedazos de 100 KB y se rehace con la memoria devuelta.

### Lo que no está probado

Muchas palabras todavía no comparten ningún lugar con nadie (empates); el 86 % de las parejas comparte uno solo. Razar ya
razona (deduce relaciones que nadie escribió y elige reglas que nunca vio, medido en `cardumen.md`); lo que falta medir es que
razone **con la nitidez**, usando las clases que encontró para deducir. El resultado de la v0.2 (el juego de Lewis contra EGG) sigue
en pie.

---
**English:** with no one telling it what a synonym is, Razar groups words by the places they share. On 20 MB of Spanish
Wikipedia, a text that does not write synonyms, its pairs beat chance on MATS 451 to 117 (exact synonyms 18 to 1, binary
antonyms 28 to 1), in 31 minutes and 205 MB. Reproducible with one command; corpora identified by sha256.
