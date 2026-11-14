# Las torrecitas: Razar aprende de sus propios órganos (2026-11-14)

**La pregunta:** Razar diseña sus órganos mutando **una letra al azar** por vez, a ciegas. ¿Hay
algo que se repita en los órganos que funcionan, y que pueda aprender para usarlo como ladrillo?

**La imagen del Capitán:** un nene con 9 ladrillitos de colores arma castillos poniendo uno por vez
con los ojos cerrados. Un día mira los castillos que le salieron lindos y descubre que siempre
aparecen juntos los mismos colores. Los pega y los llama *la torrecita*. Ya no arma a ciegas: arma
con su propio estilo. Y las torrecitas se pegan con torrecitas: con 9 colores, la gama no tiene techo.

**El resumen, de entrada:** las tres predicciones pre-registradas **pasaron**. Razar aprendió dos
torrecitas, `16` y `38`, y con las mismas notas sorteadas entre los órganos no aprende ninguna.
**Falta la segunda mitad:** ver si esas torrecitas, dadas como ladrillos a la mutación, encuentran
mejores órganos. Eso está sin hacer.

## Qué es un órgano

Una tira de letras del 1 al 9 sobre una ventana de cuatro palabras (`razar/lectura/organo.molde`):

- **1 a 4:** mezcla en el marco la palabra 1 a 4.
- **5 a 8:** la palabra 1 a 4 queda como **hueco** (lo que el marco anuncia).
- **9:** un hueco vacío.

## El material

El **modo paisaje** de Razar (`organos.sh … 0 0 3`, el octavo byte de `p`) le toma el examen a
**todos** los órganos de hasta 3 letras: 9 + 81 + 729 = **819 órganos**, sobre el Nuevo Testamento
(972.802 bytes), el mismo libro de lo ya medido. El juez es el de siempre: bits ahorrados.

**El instrumento, verificado antes de usarlo:** reproduce exacto lo documentado — sin órgano
−3554, `5` = 208, `6` = −1586, `8` = −3358, `16` = 2649, `516` = 11.144. Tardó 27 minutos.

La lista completa: [`datos/paisaje-3-letras-nt.txt`](datos/paisaje-3-letras-nt.txt).

## El método, fijado antes de ver el paisaje

- **El corpus:** cada órgano que le gana a la base, repetido en proporción a lo que gana
  (una vez cada 100 bits). Los que funcionan mejor, pesan más.
- **El segmentador:** el mismo de [`enfoque-en-bits.md`](enfoque-en-bits.md), sin cambios de idea.
  Pega el par vecino más frecuente mientras baje la longitud total de la descripción (datos +
  diccionario; cada letra cuesta log₂ 9 bits). Frena solo. Nunca pega a través de dos órganos.
- **El nulo:** las mismas 819 notas, sorteadas entre los mismos órganos (semilla 2026). Mismas
  letras, mismas notas, sin la relación entre ellas.

## Pre-registro

Escrito a las **2026-11-14T18:43:24Z**, con el paisaje todavía corriendo. Huella sha256 de sus diez
primeros renglones: `ce265193c9ce8647`. El archivo, con el resultado agregado abajo:
[`datos/torrecitas-preregistro.txt`](datos/torrecitas-preregistro.txt).

1. Aprende al menos una torrecita (un pedazo de 2 o más letras que paga su nombre).
2. Con las notas sorteadas: menos torrecitas, o ninguna.
3. La torrecita que más pesa contiene `16` o `61`. **Dato ya conocido** (`16` es el mejor de dos
   letras): se anotó aparte y no cuenta como evidencia.

## El resultado

| | Órganos que le ganan a la base | Torrecitas | Bits del corpus |
|---|---|---|---|
| **Real** | 428 | **2: `16` (usada 837 veces) y `38` (814)** | 118.812 → 117.989 |
| **Nulo** | — | **0** | 121.628 → 121.628 |

Las tres predicciones **pasan**. Con las notas sorteadas, inventar una torrecita no paga su nombre.

## Lo que se vio después (post-hoc: no es prueba todavía)

**Las dos torrecitas son la misma forma corrida dos palabras.** `16` mezcla la palabra 1 y deja de
hueco la 2; `38` mezcla la 3 y deja de hueco la 4. La forma es una sola: *mezclá una palabra y dejá
de hueco la que sigue*. Razar no aprendió dos ladrillos sueltos: aprendió un **molde**.

**Y los mejores órganos del paisaje son una familia de esa forma:**

| Puesto en el paisaje | Órgano | Nota | La forma |
|---|---|---|---|
| 1 | `516` | 11.144 | hueco en 1, mezcla 1, hueco en 2 |
| 2 | `738` | 8.638 | hueco en 3, mezcla 3, hueco en 4 |
| 7 | `627` | 3.400 | hueco en 2, mezcla 2, hueco en 3 |

**La excepción, para que no se infle:** la torrecita con la palabra del medio, `27`, sola da
**−1407**. La forma no gana en cualquier lugar de la ventana.

Esto se vio **mirando el resultado**. Para que cuente, la predicción tiene que escribirse antes y
probarse en otro lado: otro libro, u órganos de 4 letras.

## Límites

- **Un solo libro** (el Nuevo Testamento) y órganos de **hasta 3 letras**. Los de 4 son 7.380
  exámenes (unas 4 horas).
- **Aprender no es servir.** Que las torrecitas existan no prueba que ayuden a buscar. Esa es la
  prueba que falta.
- **El segmentador corre en Python**, sobre la lista que escribe Razar. Razar todavía no lo hace
  solo.

## Lo siguiente

**La prueba de verdad:** darle a `og_mutate` (`razar/lectura/pulso.jsm`) las torrecitas como
ladrillos —a veces mete una letra suelta, a veces una torrecita entera— y medir, **con el mismo
presupuesto y varias semillas**, si encuentra mejores órganos o los encuentra antes que mutando de
a una letra. El alfabeto no crece: cada torrecita se despliega en las mismas 9 letras, así que la
protección de `receta-para-la-vida.md` queda intacta.

**A qué se parece:** es la idea de **DreamCoder** (Ellis y otros, 2021) —aprender abstracciones
comprimiendo las propias soluciones, y usarlas como biblioteca para buscar mejor—. Lo propio: el
compresor es el **mismo juez** que lee idiomas y bytes, y las soluciones son órganos que el sistema
se inventó.

## Cómo reproducirlo

```bash
JANAX_TABLERO=<tablero aparte> bash razar/lectura/organos.sh <carpeta> nuevo-testamento.txt 0 traductor 0 0 3 > paisaje.txt
python -I razar/jueces/torrecitas.py paisaje.txt
```
