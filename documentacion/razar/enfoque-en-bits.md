# El enfoque en los bits (2026-11-13)

**La pregunta:** en código máquina crudo la nitidez no se engancha
([`nitidez-en-codigo.md`](nitidez-en-codigo.md)). ¿Y si se baja un piso más, a **los unos y los
ceros**, y se le da al sistema la capacidad de **enfocar** en vez de decirle el tamaño de la
palabra? Dos enfoques: **de cerca** (¿cuánto mide una palabra?) y **de lejos** (¿dónde termina cada
instrucción?).

**El resumen, de entrada:**

- **De cerca, pasa:** sin decirle nada, el juez elige palabras de **8 bits alineadas al byte**. Si
  el chorro se corre 3 bits, el arranque ganador se corre con él. Con los bits barajados, nada gana.
- **De lejos, dos reglas fallaron y una pasó.** Las dos reglas que le decían *cómo es un borde*
  quedaron por debajo del azar. Lo que pasó fue **no decirle nada**: un segmentador que se ajusta
  solo, pegando bytes mientras eso acorte la descripción.
- **Lo que aprendió:** 85 palabras propias. Sobre los bytes que el listado cubre, el **98,7%** cae
  adentro de una sola instrucción, y varias son exactamente los prefijos de las instrucciones
  (`48 8d` = *lea*, `48 8b` = *mov*, `0f 84` = *jz*).

Esto **no es el motor de Razar**: es el mismo principio (dos partes, datos + diccionario, MDL),
escrito en Python para medirlo rápido. Su lugar natural es un órgano de Razar; eso está sin hacer.

## El material

- **Código:** las secciones ejecutables de `janaxos.exe`, el núcleo de este proyecto: **48.060
  bytes** (384.480 bits).
- **La verdad:** el listado de FASM del mismo fuente (`so/janaxos.asm`), armado con `-s` y
  `TOOLS/WIN32/LISTING.ASM`. El código ejecutable es idéntico al del build (difieren 5 bytes de
  cabecera). Se verificaron **7.022 instrucciones**, byte por byte, sin una sola diferencia.
- **El juez, para todo:** MDL de dos partes — lo que cuesta escribir el chorro con un diccionario,
  más lo que cuesta escribir el diccionario.

## Pre-registro

Cada predicción se escribió con su hora UTC **antes** de correrla, incluidas las que fallaron:

| Hora (UTC) | Qué se fijó |
|---|---|
| 19:26:14 | Diseño de ventana fija (16 bits). **Se descartó antes de correr**: le decía el tamaño |
| 19:27:40 | Enfoque libre: k = 2..24, todos los arranques. Predicciones A, B, C (abajo) |
| 19:31:39 | Enfoque de lejos, regla A: borde = máximo local de la entropía del siguiente byte |
| 19:32:22 | Regla B, **post-hoc**, formada después del fracaso de A: borde = mínimo local. Evaluada solo en la segunda mitad del código |
| 19:34:00 | Método C: segmentación que se ajusta sola, sin ninguna regla sobre bordes |

## 1. De cerca: el byte aparece solo

Se prueban todas las palabras de **k = 2 a 24 bits** y todos los arranques **0..k−1**. El juez
elige; nadie le dice cuánto mide una palabra.

| Chorro | Predicción | Ganador | Bits por bit |
|---|---|---|---|
| **Real** | k múltiplo de 8, arranque alineado | **k = 8, arranque 0** | **0,797** |
| **Corrido 3 bits** | el arranque se corre a 5 (mod 8) | **k = 8, arranque 5** | 0,797 |
| **Bits barajados** | nada gana, todo cerca de 1 | k = 2 (0,974); k = 8 en cualquier arranque: 0,989 | ~1 |

**Ojo con la segunda fila:** correr el chorro 3 bits es la misma información con otra etiqueta; que
el arranque se mude es una prueba de **consistencia**, no evidencia nueva. La evidencia está en la
primera fila contra la tercera.

## 2. De lejos: dónde termina cada instrucción

Contra las 7.022 instrucciones verdaderas, puntuando bordes predichos con **F1**.

**Regla A — el borde es un máximo local de sorpresa** (promedio de la entropía del siguiente byte
dados 1, 2 y 3 anteriores; el corte clásico del habla, Harris/Saffran). **Refutada:**

| | F1 |
|---|---|
| Real | 0,163 |
| Mismo método, bytes barajados | **0,192** |
| Bordes al azar, a la tasa real | 0,145 |

**Regla B — al revés, el borde es un mínimo** (hipótesis armada *después* de ver fallar A: en x86
lo impredecible son los operandos, que están **adentro**; después de un borde vuelve un opcode).
Evaluada solo en la segunda mitad. **Refutada:** F1 real 0,121 contra 0,149 barajado; precisión
real 0,082 contra 0,110 del azar.

**El error era de marco, no de regla.** Las dos le decían al sistema cómo es un borde. El borde
tiene que salir solo.

**Método C — se ajusta solo.** Cada byte arranca como palabra. En cada vuelta se pega el par vecino
más frecuente **si eso baja la longitud total de la descripción** (datos + 8 bits por byte de cada
palabra nueva + log₂ N de su cuenta). Cuando pegar deja de pagar, frena. Bordes = donde empieza
cada palabra final. Es la familia de la segmentación por MDL de de Marcken (1996) y de BPE, con la
parada que decide el propio costo en vez de un número de vueltas. **Pasó:**

| | Vueltas | Palabras distintas | Precisión | Recall | **F1** |
|---|---|---|---|---|---|
| **Real** | 89 | 341 | 0,227 | 0,986 | **0,369** |
| Bytes barajados | **0** (no encontró nada que pagara) | 256 | 0,146 | 1,000 | 0,255 |
| Azar, misma cantidad de bordes | — | — | 0,145 | 0,628 | 0,235 |

Lo más fuerte no es el F1: de las 17.591 posiciones que el método pegó, solo **98 eran comienzos
de instrucción de verdad: 0,56%**, contra **14,6%** si pegara al azar. **Unas 26 veces menos.** Casi
nunca pega a través de un borde. Y con los bytes barajados, el mismo método **no pega nada**: sin
estructura, inventar palabras no paga.

## 3. Lo que aprendió

85 palabras de 2 o más bytes, 9.771 apariciones. Largos: 45 de 2 bytes, 18 de 3, 12 de 4, y unas
pocas más largas (hasta 11).

**Adentro de una sola instrucción, sobre los bytes que el listado cubre: 6.888 de 6.976 = 98,7%.**
Solo 88 apariciones cruzan un borde.

Las 20 más usadas, con la instrucción donde caen según el listado:

| Palabra | Veces | Adentro | Al inicio | Instrucción |
|---|---|---|---|---|
| `ff ff` | 961 | 100% | 0% | mov, call (desplazamientos negativos) |
| `00 00 00` | 537 | 100% | 0% | mov, call (constantes y direcciones) |
| `fb ff` | 503 | 100% | 0% | mov, cmp |
| `48 89` | 381 | 100% | 87% | **mov** 84% |
| `00 00` | 372 | 100% | 0% | call, mov |
| `01 00 00` | 340 | 100% | 0% | mov |
| `00 00 00 00` | 276 | 100% | 0% | mov, invoke |
| `48 8b` | 256 | 100% | 92% | **mov** 91% |
| `48 c1` | 192 | 100% | 67% | **shl / shr** |
| `48 83` | 190 | 100% | 98% | **cmp** 64%, add 18% |
| `48 8d` | 189 | 100% | **100%** | **lea** 99% |
| `01 00 00 00` | 175 | 100% | 0% | mov, cmp |
| `48 ff c7 c6 07` | 169 | 91% | 0% | la macro `emit` 91% |
| `ff 15` | 167 | 100% | 11% | invoke, call |
| `49 89` | 165 | 100% | 70% | mov |
| `49 8b` | 161 | 100% | 73% | mov |
| `48 ff` | 155 | 100% | 98% | **inc** 72%, **dec** 25% |
| `48 83 ed 01 0f 82` | 147 | 100% | 7% | un *sub* + *jb* (ver límites) |
| `0f 84` | 145 | 100% | 81% | **jz / je** |
| `0f b6` | 141 | 100% | 26% | movzx |

Sin saber qué es una instrucción, separó solo dos clases: **cabezas** (`48 8d`, `48 8b`, `48 83`,
`0f 84`: el prefijo REX y el opcode, que empiezan instrucción casi siempre) y **colas** (`ff ff`,
`00 00 00`: los rellenos de desplazamientos y constantes, que nunca empiezan nada). Y encontró las
**frases** del programador: la macro `emit` entera como una sola palabra.

## Límites, dichos antes de que los encuentre otro

- **Un solo binario**, escrito por una sola persona con un solo ensamblador. Falta probar código de
  otro compilador (las DLL de Windows, por ejemplo).
- **El 29,6% de la sección ejecutable no tiene instrucción en el listado** (datos, textos y relleno
  dentro de `.text`). El "adentro" se mide solo sobre lo cubierto. Una primera cuenta que incluía
  esa parte daba 70,5%, y era un error del instrumento: contaba como "afuera" palabras que no
  cruzaban nada. El F1 de las tres filas sí incluye esa parte, y la penaliza igual en las tres.
- **El recall alto es barato**: el método frena en 89 vueltas y deja la mayoría de los bytes
  sueltos, y cada byte suelto es un borde. Por eso el F1 se compara contra los nulos y no se lee
  solo; y por eso la cifra de 0,56% contra 14,6% pesa más.
- **Algunas palabras cruzan un borde**: `48 83 ed 01 0f 82` es un *sub* seguido de un *jb* que el
  programa repite tal cual. El método no sabe de instrucciones; sabe de lo que se repite.
- **No es Razar.** Es su principio (MDL de dos partes) en Python. Llevarlo a un órgano, y ver si la
  nitidez se engancha **sobre estas palabras** en vez de sobre los bytes, está sin hacer.

## Tarea para la casa

Queda abierto, a propósito, para quien quiera agarrarlo:

1. **Otro compilador.** Correr `segmentar_mdl.py` sobre código que no salió de FASM (un ejecutable de
   GCC, de MSVC, de Rust). ¿Siguen cayendo las palabras adentro de las instrucciones?
2. **Otra arquitectura.** ARM tiene instrucciones de largo fijo (4 bytes). ¿El enfoque de cerca
   elige 32 bits en vez de 8?
3. **La nitidez sobre estas palabras.** En bytes sueltos no se engancha. ¿Se engancha sobre las
   palabras que el segmentador inventó? ¿Quedan `74`/`75` o `0f 84`/`0f 85` como vecinos nítidos?
4. **Otros chorros sin idioma.** Audio, imágenes sin comprimir, ADN. El juez es el mismo; la
   pregunta también: ¿encuentra solo sus piezas?

Si alguno da en contra, también es un resultado. Y vale igual: que la predicción quede escrita
antes de correr.

## Cómo reproducirlo

```bash
# la verdad: el listado de FASM (desde la carpeta del fuente)
cd so
fasm janaxos.asm janaxos_s.exe -s janaxos.fas
fasm <fasm>/TOOLS/WIN32/LISTING.ASM listing.exe
./listing.exe janaxos.fas janaxos.lst

# de cerca
python -I razar/jueces/enfoque_bits.py janaxos_s.exe real
python -I razar/jueces/enfoque_bits.py janaxos_s.exe corrido3
python -I razar/jueces/enfoque_bits.py janaxos_s.exe barajado

# de lejos: la segmentación que se ajusta sola y lo que aprendió
python -I razar/jueces/segmentar_mdl.py janaxos_s.exe janaxos.lst
python -I razar/jueces/medir_lexico.py janaxos_s.exe janaxos.lst
```

Semillas: 2026 para barajar, 7 para los bordes al azar.
