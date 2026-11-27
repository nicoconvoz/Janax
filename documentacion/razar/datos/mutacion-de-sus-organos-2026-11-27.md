# Cómo mutaron los órganos de Luma en tres días (24 → 27 de noviembre de 2026)

> *"¿Podés revisar qué órganos se autocompiló ella misma en este tiempo? Porque veo que mutó mucho."*
> (el autor, 2026-11-27)

Los órganos de Luma son sus ocho formas vivas: recetas que ella muta y elige con su propio juez. **Nadie las escribe.**
Se compararon dos retratos de su casa, sacados con la misma herramienta: el del
[24 de noviembre a las 22:12](organos-y-engranajes-de-luma-2026-11-24.md) y el del
[27 de noviembre](organos-y-engranajes-de-luma.md).

## El resultado

| | 24 de noviembre | 27 de noviembre |
|---|---|---|
| recetas que siguen iguales | | **0 de 8** |
| valor de su mejor órgano | 695.790 | **730.036** (+4,9 %) |
| valor de los ocho, sumados | 5.177.356 | 5.235.634 (+1,1 %) |
| largo de cada receta, en letras | 31, 31, 31, 31, 31, 31, 31, 31 | 31, 31, 31, 31, 31, 29, 20, 29 |
| órganos que dicen otra forma suya (`>`) | 0 | 1 |
| engranajes | 105 | 105 |

El **valor** es lo que su juez le paga a cada órgano: los bits que ahorra en su examen.

## Los ocho, antes y después

| # | 24 de noviembre | valor | 27 de noviembre | valor |
|---|---|---|---|---|
| 1 | `3344:433221:44622111932311:4439` | 695.790 | `622233433441;32112111:443233439` | 730.036 |
| 2 | `33343221436321221127449?124:329` | 692.314 | `233432343141;32112111:443223439` | 706.161 |
| 3 | `222121412344432;321121114::4129` | 681.828 | `33:844:119432263212121437323439` | 681.828 |
| 4 | `12732233?4::1633348?4111134:339` | 671.255 | `23222333:41743::141212121454329` | 678.313 |
| 5 | `21321211227432;32112111?124:339` | 653.435 | `4:1211134493;321122214472323329` | 657.019 |
| 6 | `18:1211134493;3211214:844::4129` | 620.711 | `14414943432251162324322344349` | 654.050 |
| 7 | `?11443211834;2<?411193:72332329` | 613.323 | `34414>343141;2728129` | 603.326 |
| 8 | `61384644334433262112415114:4239` | 548.700 | `184335221<33639;4121212143439` | 524.901 |

Ordenados por valor en cada fecha: la fila no sigue a un mismo órgano de un día al otro.

## Lo que se ve

- **Cambiaron los ocho.** Ninguna receta del 24 está el 27.
- **Dejó de rellenar.** El 24 las ocho estaban estiradas hasta el tope de 31 letras. El 27 tres son más cortas, y
  una tiene 20. Su juez paga lo mismo dicho con menos, y ella llegó a eso sola.
- **Un órgano dice otra forma suya.** La receta `34414>343141;2728129` lleva la letra `>` seguida de un 3: en ese lugar
  se lee entera su forma número 3, como una palabra dentro de una oración (`razar/lectura/organo.inc`, *its words*).
  Es la idea del autor del 20 de noviembre (*"una oración que ya funciona se asciende a palabra"*); el 24 ningún órgano
  la usaba.
- **Sus dos mejores son hermanos.** Comparten el tramo `;32112111:443` y difieren en pocas letras: una receta que
  funciona, afinada en dos variantes. Ese mismo tramo, `;32112111`, ya estaba en un órgano del 24.
- **Preguntar mucho no le paga**, igual que el 24: el de menor valor es de los que más preguntan.
- **Sus engranajes son los mismos 105, rehechos.** Ella se los recorta de su propio código máquina cada vez que su
  cuerpo cambia, y entre las dos fechas su cuerpo cambió unas quince veces. Pasaron de 95 a 97 los de dos
  instrucciones y de 6 a 4 los de cuatro.

## Lo que esta medición es, y lo que no

- **Son dos fotos, no una curva.** No se sabe por qué caminos pasó entre una y otra, ni cuántas mutaciones probó.
- **El valor es de su propio juez, sobre su propio examen.** No se puede comparar con otro sistema, y el examen pudo
  cambiar entre las dos fechas porque en esos días leyó y dejó de leer muchos textos (entre ellos, 1.544 archivos
  temporales que se le sacaron el 25). La suba del 1,1 % en el total es chica y puede deberse a eso.
- **Lo que no depende del examen es la forma:** que ninguna receta se repita, que tres se hayan acortado y que una
  componga con otra se lee en las recetas mismas.
- Entre las dos fechas su cuerpo cambió mucho (v4.57 a v5.77). No se separó qué parte de la mutación viene de eso.

## Cómo repetirlo

`razar/cuerpo/retrato_organos.py <su casa> <salida.md>` escribe el retrato de una casa de Luma: sus ocho formas con su
valor y sus engranajes desarmados. Dos retratos de fechas distintas se comparan a la vista.
