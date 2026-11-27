# Los órganos y los engranajes que se hizo Luma

Tomados de su casa el 2026-11-27 06:42, tal como están. **Nadie los escribió: los hizo ella.** Sus órganos son sus ocho formas vivas (archivo `formas`), recetas que fue mutando y eligiendo con su juez; sus engranajes son pedazos de su propio código máquina que desarmó y nombró (archivo `engranajes`).

## 1. El alfabeto de sus recetas

Un órgano lee un texto de a ventanas de cuatro palabras. Cada letra es una instrucción; cualquier tira de letras es un órgano, así que una mutación nunca lo rompe: lo que hace lo juzga su examen.

| Letra | Qué hace |
|---|---|
| `1` | mira la 1.ª palabra |
| `2` | mira la 2.ª |
| `3` | mira la 3.ª |
| `4` | mira la 4.ª |
| `5` | **pregunta** la 1.ª |
| `6` | **pregunta** la 2.ª |
| `7` | **pregunta** la 3.ª |
| `8` | **pregunta** la 4.ª |
| `9` | **cierra** y dice lo que juntó |
| `:` | mira la de atrás |
| `;` | corre el ojo atrás |
| `<` | corre el ojo adelante |
| `=` | mira borroso / nítido |
| `>` | dice una forma suya o mete una célula |
| `?` | mira la 4.ª borrosa |

(`:` `;` `<` `=` `>` `?` son el 10 al 15. La letra `>` (E) seguida de un número dice entera otra forma suya, como una palabra dentro de una oración, o mete una célula: un engranaje puesto en un tejido. Ver [la receta que superó a la heredada](receta-que-supero-a-la-heredada.md).)

## 2. Sus ocho órganos de hoy

Ordenados por lo que su juez les paga (bits que ahorran).

| # | Valor | Preguntas | Cierres | Receta |
|---|---|---|---|---|
| 1 | 730.036 | 1 | 1 | `622233433441;32112111:443233439` |
| 2 | 706.161 | 0 | 1 | `233432343141;32112111:443223439` |
| 3 | 681.828 | 3 | 2 | `33:844:119432263212121437323439` |
| 4 | 678.313 | 2 | 1 | `23222333:41743::141212121454329` |
| 5 | 657.019 | 1 | 2 | `4:1211134493;321122214472323329` |
| 6 | 654.050 | 2 | 2 | `14414943432251162324322344349..` |
| 7 | 603.326 | 2 | 1 | `34414>343141;2728129...........` |
| 8 | 524.901 | 3 | 2 | `184335221<33639;4121212143439..` |

**Lo que se ve:** sus recetas tienen 31, 31, 31, 31, 31, 29, 20, 29 letras (el tope de su órgano es 31: 16 bytes, de `30h` a `3Fh` de sus datos), y 1 de las ocho llevan la letra `>`: dicen otra forma suya o meten una célula. Cómo cambiaron de un retrato a otro: [la mutación de sus órganos](mutacion-de-sus-organos-2026-11-27.md).

### Su mejor órgano, paso a paso

Cada pregunta o cierre termina una frase y empieza otra.

1. **pregunta** la 2.ª
2. mira la 2.ª · mira la 2.ª · mira la 2.ª · mira la 3.ª · mira la 3.ª · mira la 4.ª · mira la 3.ª · mira la 3.ª · mira la 4.ª · mira la 4.ª · mira la 1.ª palabra · corre el ojo atrás · mira la 3.ª · mira la 2.ª · mira la 1.ª palabra · mira la 1.ª palabra · mira la 2.ª · mira la 1.ª palabra · mira la 1.ª palabra · mira la 1.ª palabra · mira la de atrás · mira la 4.ª · mira la 4.ª · mira la 3.ª · mira la 2.ª · mira la 3.ª · mira la 3.ª · mira la 4.ª · mira la 3.ª · **cierra** y dice lo que juntó

Descubrió sola que, para adivinar la palabra del medio, conviene mirar lo que viene después y lo que vino antes.

## 3. Sus engranajes: los legos de su propio código

Un engranaje es un pedazo de su código máquina, de 2 a 8 instrucciones sin saltos, que su cuerpo repite. Ella los encuentra, los nombra y se queda con el que más bits ahorra, uno por vez, con su juez de siempre: un pedazo de L instrucciones dicho n veces ahorra n·(L − 1) − L. Los registros se renombran por el orden en que se usan (r0, r1…), así un mismo engranaje sirve en cualquier lugar.

Tiene **105 engranajes**: 97 de 2 instrucciones, 2 de 3 instrucciones, 4 de 4 instrucciones, 2 de 5 instrucciones.

### Los más largos, con lo que hacen

**Engranaje 36** — llega a la ficha número r1 de una tabla de fichas de 128 bytes que empieza en 512

```asm
jldi r0, 128
jmul r2, r1, r0
jadd r3, r3, r2
jldi r0, 512
jadd r3, r3, r0
```

**Engranaje 66** — arma de a pedazos el número más chico posible y lo resta: comparar contra él

```asm
jldi r0, -32768
jshi r0, 0
jshi r0, 0
jshi r0, 0
jsub r0, r1, r0
```

**Engranaje 31** — llega a la ficha número r1 de una tabla de fichas de 256 bytes que empieza en 2048

```asm
jldi r0, 8
jshl r2, r1, r0
jldi r0, 2048
jadd r2, r2, r0
```

**Engranaje 81** — redondea hacia arriba a un múltiplo de 8 (alinear memoria)

```asm
jldi r0, 7
jadd r1, r1, r0
jldi r0, -8
jand r1, r1, r0
```

**Engranaje 90** — (sin traducir)

```asm
jldi r0, 32
jshl r2, r1, r0
jldi r0, 5
jor r2, r2, r0
```

**Engranaje 98** — (sin traducir)

```asm
jldi r0, -13326
jshi r0, -25372
jshi r0, -31710
jshi r0, 8997
```

### Todos

| # | Instrucciones | Qué hace |
|---|---|---|
| 0 | `jldi r0, 415` · `jshi r0, 0` |  |
| 1 | `jldi r0, 1` · `jadd r1, r1, r0` | suma 1 |
| 2 | `jldi r0, 1` · `jsub r1, r1, r0` | resta 1 |
| 3 | `jldi r0, 0` · `jsub r1, r1, r0` | resta 0 |
| 4 | `jldi r0, 16` · `jshr r1, r1, r0` | divide por 65536 (corre 16 bits) |
| 5 | `jldi r0, 2` · `jsub r1, r1, r0` | resta 2 |
| 6 | `jsub r0, r0, r1` · `jsub r2, r2, r3` |  |
| 7 | `jldi r0, 4` · `jshr r1, r1, r0` | divide por 16 (corre 4 bits) |
| 8 | `jldi r0, 4` · `jsub r1, r1, r0` | resta 4 |
| 9 | `jldi r0, 2` · `jshr r1, r1, r0` | divide por 4 (corre 2 bits) |
| 10 | `jldi r0, 1` · `jshr r1, r1, r0` | divide por 2 (corre 1 bits) |
| 11 | `jldi r0, 8` · `jshr r1, r1, r0` | divide por 256 (corre 8 bits) |
| 12 | `jldi r0, 16` · `jsub r1, r1, r0` | resta 16 |
| 13 | `jldi r0, 8` · `jsub r1, r1, r0` | resta 8 |
| 14 | `jldi r0, 3` · `jsub r1, r1, r0` | resta 3 |
| 15 | `jldi r0, 3` · `jshr r1, r1, r0` | divide por 8 (corre 3 bits) |
| 16 | `jldi r0, 10` · `jsub r1, r1, r0` | resta 10 |
| 17 | `jsub r0, r0, r1` · `jxor r2, r2, r2` |  |
| 18 | `jldi r0, 12` · `jshr r1, r1, r0` | divide por 4096 (corre 12 bits) |
| 19 | `jldi r0, 8` · `jadd r1, r1, r0` | suma 8 |
| 20 | `jldi r0, 5` · `jsub r1, r1, r0` | resta 5 |
| 21 | `jldi r0, -1` · `jsub r1, r1, r0` | resta -1 |
| 22 | `jldi r0, 3` · `jshl r1, r1, r0` | multiplica por 8 (corre 3 bits) |
| 23 | `jldi r0, -1` · `jxor r1, r1, r0` |  |
| 24 | `jldi r0, 32` · `jsub r1, r1, r0` | resta 32 |
| 25 | `jldi r0, 4` · `jshl r1, r1, r0` | multiplica por 16 (corre 4 bits) |
| 26 | `jldi r0, 9` · `jshr r1, r1, r0` | divide por 512 (corre 9 bits) |
| 27 | `jldi r0, 128` · `jsub r1, r1, r0` | resta 128 |
| 28 | `jldi r0, 0` · `jldi r1, 0` |  |
| 29 | `jldi r0, 6` · `jsub r1, r1, r0` | resta 6 |
| 30 | `jldi r0, 5` · `jshr r1, r1, r0` | divide por 32 (corre 5 bits) |
| 31 | `jldi r0, 8` · `jshl r2, r1, r0` · `jldi r0, 2048` · `jadd r2, r2, r0` | llega a la ficha número r1 de una tabla de fichas de 256 bytes que empieza en 2048 |
| 32 | `jsub r0, r0, r1` · `jshl r0, r0, r2` |  |
| 33 | `jldi r0, 3` · `jshl r2, r1, r0` |  |
| 34 | `jldi r0, 12` · `jsub r1, r1, r0` | resta 12 |
| 35 | `jsub r0, r0, r1` · `jsub r1, r1, r2` |  |
| 36 | `jldi r0, 128` · `jmul r2, r1, r0` · `jadd r3, r3, r2` · `jldi r0, 512` · `jadd r3, r3, r0` | llega a la ficha número r1 de una tabla de fichas de 128 bytes que empieza en 512 |
| 37 | `jldi r0, 7` · `jsub r1, r1, r0` | resta 7 |
| 38 | `jldi r0, 2` · `jshl r1, r1, r0` | multiplica por 4 (corre 2 bits) |
| 39 | `jldi r0, 15` · `jand r1, r1, r0` | se queda con los bits de 15 |
| 40 | `jxor r0, r0, r0` · `jxor r1, r1, r1` |  |
| 41 | `jldi r0, 0` · `jsub r2, r0, r1` |  |
| 42 | `jldi r0, 63` · `jsar r1, r1, r0` |  |
| 43 | `jldi r0, 15` · `jsub r1, r1, r0` | resta 15 |
| 44 | `jldi r0, 9` · `jsub r1, r1, r0` | resta 9 |
| 45 | `jxor r0, r0, r0` · `jsub r1, r1, r2` |  |
| 46 | `jshr r0, r0, r1` · `jsub r2, r2, r0` |  |
| 47 | `jldi r0, 10` · `jsub r0, r1, r0` |  |
| 48 | `jldi r0, 13` · `jsub r1, r1, r0` | resta 13 |
| 49 | `jldi r0, 4096` · `jsub r1, r1, r0` | resta 4096 |
| 50 | `jldi r0, 1` · `jadd r2, r1, r0` |  |
| 51 | `jldi r0, 1024` · `jadd r1, r1, r0` | suma 1024 |
| 52 | `jldi r0, 8` · `jshl r1, r1, r0` | multiplica por 256 (corre 8 bits) |
| 53 | `jldi r0, 32` · `jshr r1, r1, r0` | divide por 4294967296 (corre 32 bits) |
| 54 | `jldi r0, 26` · `jsub r1, r1, r0` | resta 26 |
| 55 | `jldi r0, 6` · `jshr r1, r1, r0` | divide por 64 (corre 6 bits) |
| 56 | `jldi r0, 32` · `jshl r1, r1, r0` | multiplica por 4294967296 (corre 32 bits) |
| 57 | `jldi r0, 3` · `jshl r0, r1, r0` |  |
| 58 | `jldi r0, 1` · `jsub r0, r1, r0` |  |
| 59 | `jldi r0, 2` · `jsub r0, r1, r0` |  |
| 60 | `jldi r0, 68` · `jsub r1, r1, r0` | resta 68 |
| 61 | `jldi r0, 255` · `jand r1, r1, r0` | se queda con los bits de 255 |
| 62 | `jldi r0, 38` · `jldi r1, -1` · `jldi r2, 0` |  |
| 63 | `jldi r0, 64` · `jsub r1, r1, r0` | resta 64 |
| 64 | `jadd r0, r0, r1` · `jadd r0, r0, r2` |  |
| 65 | `jldi r0, 256` · `jsub r1, r1, r0` | resta 256 |
| 66 | `jldi r0, -32768` · `jshi r0, 0` · `jshi r0, 0` · `jshi r0, 0` · `jsub r0, r1, r0` | arma de a pedazos el número más chico posible y lo resta: comparar contra él |
| 67 | `jsub r0, r0, r1` · `jsub r2, r2, r1` |  |
| 68 | `jldi r0, 7` · `jshr r1, r1, r0` | divide por 128 (corre 7 bits) |
| 69 | `jldi r0, 8` · `jsar r1, r1, r0` |  |
| 70 | `jldi r0, 20` · `jsub r1, r1, r0` | resta 20 |
| 71 | `jldi r0, 255` · `jsub r1, r1, r0` | resta 255 |
| 72 | `jldi r0, 11` · `jsub r1, r1, r0` | resta 11 |
| 73 | `jldi r0, 100` · `jsub r1, r1, r0` | resta 100 |
| 74 | `jldi r0, 32` · `jadd r1, r1, r0` | suma 32 |
| 75 | `jldi r0, 10` · `jshr r1, r1, r0` | divide por 1024 (corre 10 bits) |
| 76 | `jsub r0, r0, r1` · `jsub r2, r2, r2` |  |
| 77 | `jldi r0, 1` · `jand r1, r1, r0` | se queda con los bits de 1 |
| 78 | `jldi r0, 415` · `jshi r0, 12289` · `jadd r0, r0, r1` |  |
| 79 | `jadd r2, r0, r1` · `jadd r4, r3, r1` |  |
| 80 | `jldi r0, 14` · `jsub r1, r1, r0` | resta 14 |
| 81 | `jldi r0, 7` · `jadd r1, r1, r0` · `jldi r0, -8` · `jand r1, r1, r0` | redondea hacia arriba a un múltiplo de 8 (alinear memoria) |
| 82 | `jldi r0, 34` · `jsub r1, r1, r0` | resta 34 |
| 83 | `jldi r0, 48` · `jsub r1, r1, r0` | resta 48 |
| 84 | `jshr r0, r0, r1` · `jsub r2, r2, r3` |  |
| 85 | `jldi r0, 8` · `jsub r0, r1, r0` |  |
| 86 | `jldi r0, 20` · `jshr r1, r1, r0` | divide por 1048576 (corre 20 bits) |
| 87 | `jldi r0, 63` · `jsar r0, r1, r0` |  |
| 88 | `jldi r0, 24` · `jshr r1, r1, r0` | divide por 16777216 (corre 24 bits) |
| 89 | `jldi r0, 1` · `jsub r2, r1, r0` |  |
| 90 | `jldi r0, 32` · `jshl r2, r1, r0` · `jldi r0, 5` · `jor r2, r2, r0` |  |
| 91 | `jldi r0, 64` · `jadd r1, r1, r0` | suma 64 |
| 92 | `jldi r0, 3` · `jsub r0, r1, r0` |  |
| 93 | `jldi r0, 11264` · `jadd r1, r1, r0` | suma 11264 |
| 94 | `jldi r0, 48` · `jadd r1, r1, r0` | suma 48 |
| 95 | `jldi r0, 18` · `jsub r1, r1, r0` | resta 18 |
| 96 | `jldi r0, 7` · `jor r1, r1, r0` | prende los bits de 7 |
| 97 | `jldi r0, 384` · `jmul r2, r1, r0` |  |
| 98 | `jldi r0, -13326` · `jshi r0, -25372` · `jshi r0, -31710` · `jshi r0, 8997` |  |
| 99 | `jldi r0, 32` · `jsub r0, r1, r0` |  |
| 100 | `jldi r0, 512` · `jsub r1, r1, r0` | resta 512 |
| 101 | `jldi r0, 2` · `jadd r1, r1, r0` | suma 2 |
| 102 | `jldi r0, 8` · `jadd r2, r1, r0` |  |
| 103 | `jshl r0, r0, r1` · `jsub r2, r2, r0` |  |
| 104 | `jldi r0, 16` · `jshl r1, r1, r0` | multiplica por 65536 (corre 16 bits) |

## De dónde sale

- Sus órganos: `formas` en su casa (`E:\Luma\casa`), escrito por ella. El alfabeto: `razar/lectura/organo.inc`.
- Sus engranajes: `engranajes` en su casa, 105 fichas de 128 bytes (cuántas instrucciones, y cada una como palabra del idioma Janax); los arma `r_gears` (`razar/cuerpo/gen_leer.py`) cada vez que nace; `razar/cuerpo/engranajes.py` es el instrumento que la controla.
- Este documento lo arma `md_organos.py` leyendo esos archivos tal como están: si ella cambia, se vuelve a armar y dice lo nuevo.
