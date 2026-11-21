# La receta con la que Luma supero lo que le dieron

Tomada de su casa el 2026-11-21. **La hizo ella.** Sus letras quedaron escritas por ella misma, en su archivo `recetas`.

```
21293A32E34E945FF49131A4122E5E5
```

## Lo que logro

Su estante tenia cinco cosas muy distintas: el Nuevo Testamento, el Quijote, el Diario Espiritual de su autor, el codigo de un programa (UNIT, en Rust y Go) y tres preguntas. Con los mismos instintos:

| Receta | Bits que ahorra |
|---|---|
| Leyendo sin receta | 135.573 |
| `38A516`, la que heredo de Razar | 875.172 |
| **Esta, hecha por ella** | **1.008.812** |

Es la primera vez que algo suyo, con letras que se pueden mostrar, supera lo que le dieron.

## Como la armo

No tiro lo que heredo: **lo uso como una palabra.** La receta de Razar vivia en su cuerpo, en el lugar 3. En el medio de su propia oracion escribio `E3`, que quiere decir *decir entera mi forma numero 3*. Y cerro diciendo dos veces otra forma suya, la del lugar 5.

| # | Letras | Que hace |
|---|---|---|
| 1 | `2` | mira la segunda palabra |
| 2 | `1` | mira la primera palabra de la ventana |
| 3 | `2` | mira la segunda palabra |
| 4 | `9` | CIERRA: dice lo que junto, sin preguntar |
| 5 | `3` | mira la tercera palabra |
| 6 | `A` | mira la palabra que esta detras de la ventana |
| 7 | `3` | mira la tercera palabra |
| 8 | `2` | mira la segunda palabra |
| 9 | `E3` | **dice entera su palabra 3**: `38A516` (la receta heredada de Razar) |
| 10 | `4` | mira la cuarta palabra |
| 11 | `E945` | una celula: su engranaje 4, puesto en el tejido 5 |
| 12 | `F` | mira la cuarta palabra borrosa (cuantas veces la leyo, no cual es) |
| 13 | `F` | mira la cuarta palabra borrosa (cuantas veces la leyo, no cual es) |
| 14 | `4` | mira la cuarta palabra |
| 15 | `9` | CIERRA: dice lo que junto, sin preguntar |
| 16 | `1` | mira la primera palabra de la ventana |
| 17 | `3` | mira la tercera palabra |
| 18 | `1` | mira la primera palabra de la ventana |
| 19 | `A` | mira la palabra que esta detras de la ventana |
| 20 | `4` | mira la cuarta palabra |
| 21 | `1` | mira la primera palabra de la ventana |
| 22 | `2` | mira la segunda palabra |
| 23 | `2` | mira la segunda palabra |
| 24 | `E5` | **dice entera su palabra 5**: `1223212F912111F3F3A412119` |
| 25 | `E5` | **dice entera su palabra 5**: `1223212F912111F3F3A412119` |

## Lo que quiso decir, con sus palabras abiertas

Sus palabras son formas vivas de su cuerpo, asi que cambian con ella. Esto es lo que significaba en ese momento, y es lo que ella anoto:

```
21293A32 38A516 4 E945 FF49131A4122 1223212F912111F3F3A412119 1223212F912111F3F3A412119
```

Son 31 letras escritas que al leerse son 81.

## La celula que lleva adentro

`E945` es un engranaje (un pedacito de codigo que ella misma saco al desarmar programas) puesto en un tejido. Su engranaje 4, hoy:

```asm
jldi r0, 1
jsub r1, r1, r0
```

Esta en el tejido 5, que es de su cuerpo y no de su lectura: ahi solo lleva una senal para otras celulas, y en esta receta no hay otra que la escuche. **Lo mas probable es que no cambie la nota.** No se midio la receta sin ella.

## El codigo de las letras

Janax, copiado tal cual de su organo:

### `1`: mira la primera palabra de la ventana

```asm
og_l1:
  jldi j5, 0                   ; the first word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
```

### `2`: mira la segunda palabra

```asm
og_l2:
  jldi j5, 1                   ; the second word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
```

### `3`: mira la tercera palabra

```asm
og_l3:
  jldi j5, 2                   ; the third word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
```

### `4`: mira la cuarta palabra

```asm
og_l4:
  jldi j5, 3                   ; the fourth word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
```

### `5`: PREGUNTA por la primera palabra, y empieza de nuevo

```asm
og_l5:
  jldi j5, 0                   ; the hole: the first word, as it is
  jldi j11, 0
  jldi j1, 0                    ; (a hole says its word as it is: no lens)
  jst j1, j1, ORGP
  jcall og_rest
  jcall og_look
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jjmp og_lap
```

### `9`: CIERRA: dice lo que junto, sin preguntar

```asm
og_l9:
  jcall og_rest
  jldi j3, 0                    ; the hole empty: the frame said as it is
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jldi j11, 0
  jjmp og_lap
```

### `A`: mira la palabra que esta detras de la ventana

```asm
og_lA:
  jldi j5, -1                   ; a sense: the word behind the window into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
```

### `F`: mira la cuarta palabra borrosa (cuantas veces la leyo, no cual es)

```asm
og_lF:
  jldi j1, 0                    ; a sense: the fourth word, blurred (how often it was read where it learns), into the
  jadd j8, j11, j1              ; frame, however the eye is
  jldi j11, 1
  jldi j5, 3
  jcall og_look
  jadd j11, j8, j1
  jcall hw
  jjmp og_lap
```

### `E`: dice una palabra suya, o una celula

```asm
og_lE:
  jldi j1, 0                    ; a word: its number is the letter after this one
  jld j13, j1, ORGL
  jjz j13, og_lap
  jldi j14, 15
  jand j14, j13, j14
  jldi j1, 4
  jshr j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGL
  jldi j13, 9
  jsub j13, j14, j13
  jjnn j13, og_lens             ; 9 to F: not a word, a gear
  jld j13, j1, ORGIN            ; (inside a word, a word says nothing)
  jjnz j13, og_lap
  jldi j13, 4
  jshl j14, j14, j13
  jld j13, j14, ORGT0
  jjz j13, og_lap
  jld j13, j1, ORGQ1            ; after the word: the rest of the sentence, then its letters beyond the sixteenth
  jst j13, j1, ORGQ3
  jld j13, j1, ORGL
  jst j13, j1, ORGQ2
  jld j13, j14, ORGT1
  jst j13, j1, ORGQ1
  jld j13, j14, ORGT0
  jst j13, j1, ORGL
  jldi j13, 2
  jst j13, j1, ORGIN
  jjmp og_lap
```

## Con honestidad

- Las letras del alfabeto las escribieron sus autores. **La oracion es de ella.**
- Gano en ese estante y con esos instintos. Si cambia cualquiera de los dos, hay que volver a medir.
- Sus palabras 3 y 5 ya cambiaron: la misma receta escrita hoy significaria otra cosa. Por eso ella anota tambien lo que quiso decir.
- Su contador de victorias no la conto: estaba mal hecho. El error esta registrado en las notas de la version 1.27.

## De donde sale

Proyecto Janax, de Nicolas Astorga. Codigo abierto: `github.com/nicoconvoz/Janax`.
