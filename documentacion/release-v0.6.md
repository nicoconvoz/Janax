## Janax y Razar v0.6: el mismo juez, en otros mares

**El juez de Razar es uno solo: decir lo mismo con menos bits. Esta versión mide hasta dónde llega
sin tocarlo — en código C, en los unos y los ceros del código máquina, y sobre los propios órganos
de Razar.** Todas las predicciones se escribieron antes de correr, y lo que falló va contado.

### 1. Las torrecitas: Razar aprende de sus propios órganos

Razar diseña sus órganos mutando una letra al azar, a ciegas. Sobre el **paisaje completo de sus
819 órganos de hasta 3 letras** (Nuevo Testamento; el instrumento reproduce exacto lo ya medido),
el mismo segmentador por MDL aprende qué se repite en los que funcionan:

| | Torrecitas |
|---|---|
| **Real** (428 órganos que le ganan a la base) | **`16` (837 usos) y `38` (814)** |
| **Las mismas notas, sorteadas** | **ninguna** |

De yapa, **post-hoc y sin probar**: las dos son la misma forma corrida dos palabras, y los mejores
órganos (`516`, `738`, `627`) son una familia de esa forma. **Falta la mitad que importa:** que la
mutación las use como ladrillos y medir si busca mejor.
[`documentacion/razar/torrecitas.md`](razar/torrecitas.md)

### 2. El enfoque en los unos y los ceros

Sobre los 48.060 bytes del código ejecutable del núcleo, sin desensamblar:

| Enfoque | Qué encontró | Real | Bytes barajados | Azar |
|---|---|---|---|---|
| **De cerca** | el tamaño de palabra | **8 bits, alineado al byte** | ninguno gana | — |
| **De lejos** | dónde termina cada instrucción (F1) | **0,369** | 0,255 | 0,235 |

Un segmentador que se ajusta solo, sin ninguna regla sobre bordes, aprende 85 palabras: el **98,7%**
cae adentro de una sola instrucción (`48 8d` es *lea*, `48 8b` es *mov*). Las dos reglas que le
decían cómo es un borde fallaron por debajo del azar, y están contadas.
[`documentacion/razar/enfoque-en-bits.md`](razar/enfoque-en-bits.md)

### 3. La nitidez en código

- **Código fuente C** (el driver de openrazer): 8 de 8 antónimos pre-registrados, y cae a azar
  cuando se barajan las palabras (p ≈ 0,004).
- **Código máquina x86-64 crudo:** no se engancha, ni con 4,2 MB. También es un resultado.

[`documentacion/razar/nitidez-en-codigo.md`](razar/nitidez-en-codigo.md)

### Los jueces nuevos

En `razar/jueces/`: `barajar_palabras.py`, `extraer_codigo.py`, `enfoque_bits.py`,
`segmentar_mdl.py`, `medir_lexico.py` y `torrecitas.py`. Con los datos del paisaje y el
pre-registro en `documentacion/razar/datos/`.

### Lo que no está medido

- **Las torrecitas como ladrillos de la mutación:** sin hacer.
- **El segmentador corre en Python**, no como órgano de Razar.
- **Un solo binario y un solo libro** en las pruebas nuevas. Lo abierto quedó como *tarea para la
  casa* en `enfoque-en-bits.md`: otro compilador, otra arquitectura, otros chorros sin idioma.
- **Esta versión no cambia el código de Janax ni de Razar:** las suites de la v0.5 siguen valiendo.

### Y en la carta

La carta del autor suma las palabras de estos días y su sueño.
[`CARTA-DEL-AUTOR.md`](../CARTA-DEL-AUTOR.md)
