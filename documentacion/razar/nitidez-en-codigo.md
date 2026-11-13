# La nitidez en código (2026-11-13)

**La pregunta:** la nitidez —dos palabras se parecen tanto como los lugares que comparten— dio
451 contra 117 en castellano. ¿Funciona fuera de un idioma natural? Dos pruebas: **código fuente
en C**, y **código máquina x86-64 crudo**.

**El resumen, de entrada:** en C **pasa** (8 de 8 antónimos pre-registrados, y cae a azar cuando
se barajan las palabras). En código máquina crudo **no se engancha**, ni con 4,2 MB. Los dos son
resultados y van los dos.

## El método, igual para las dos

- **La corrida:** `razar/cardumen/nitidez_reproducir.sh`, el mismo de la v0.3, **sin cambios**.
- **El juez:** `razar/jueces/juez_nitidas.py`. Un par cuenta como *real* cuando sus dos palabras
  comparten más lugares que la primera con la respuesta **de otro par de la misma relación**.
- **La clave, pre-registrada:** escrita en formato MATS, con su hora y su huella, **antes** de
  correr nada.
- **Dos nulos:** el del juez (cada pareja contra la pareja equivocada) y el **mismo corpus con las
  palabras barajadas**, dejando el esqueleto intacto — mismas palabras, mismas frecuencias, mismos
  signos en el mismo lugar, sin orden (`razar/jueces/barajar_palabras.py`, semilla 2026).

## 1. Código fuente en C: pasa

**Corpus:** los fuentes del driver de [openrazer](https://github.com/openrazer/openrazer)
(`driver/*.h` y `driver/*.c`): 22.688 líneas, 970 KB. Es **GPL-2.0**, por eso no está en este
repositorio; se reconstruye con `cat driver/*.h driver/*.c`.

**Clave pre-registrada** (2026-11-13T18:49:22Z, sha256 del archivo `8146b519f548dc80…`): 16
antónimos de programación **que no se habían visto en la salida** — enable/disable, on/off,
true/false, min/max, start/stop, open/close, up/down, high/low, begin/end, in/out, first/last,
input/output, lock/unlock, alloc/free, src/dst, rx/tx. Los que sí se habían visto (set/get,
read/write, left/right, wired/wireless, mouse/keyboard, breathing/starlight, static/reactive,
backlight/logo) van **aparte** y no cuentan como prueba, porque se eligieron mirando.

| | Antónimos pre-registrados | Los ya vistos |
|---|---|---|
| **Código real** | **8 real · 0 azar · 0 empate** | 8 · 0 · 0 |
| **Mismo código, palabras barajadas** | **3 real · 2 azar · 1 empate** | 2 · 6 · 0 |

Los ocho que aparecen en el corpus —on/off, true/false, start/stop, up/down, in/out, first/last,
input/output, lock/unlock— ganan los ocho. Bajo un nulo de mitad y mitad, ocho de ocho es
**p ≈ 1/256 ≈ 0,004** (prueba del signo, una cola). Y al barajar, cae a azar.

**Lo que armó solo**, sin saber C ni qué es un periférico (lectura cualitativa, no medida):

| Clase | Con quién comparte lugar |
|---|---|
| Efectos de luz | *breathing* ~ starlight, static, reactive, spectrum, custom, none |
| Dispositivos | *mouse* ~ keyboard, kraken · *razermouse* ~ *razerkbd* |
| Zonas de LED | backlight, logo, scroll, left, right |
| Tipos de C | unsigned, void, struct |

**Límites:** la muestra es chica — 8 de los 16 antónimos no aparecen en el driver y el juez los
saltea. Hay pegamento gramatical, igual que en castellano: *struct ~ not*, *for ~ not*. Y el
barajado tiene el triple de parejas nítidas (120.318 contra 41.900): **la cantidad de parejas no
es señal**, lo que cuenta es que las correctas ganen.

## 2. Código máquina x86-64 crudo: no se engancha

**Corpus:** las secciones ejecutables, en hexadecimal, 16 bytes por renglón, **sin desensamblar**
y sin marcar dónde empieza cada instrucción (`razar/jueces/extraer_codigo.py`):

- `janaxos.exe`, el núcleo de este proyecto: **48.060 bytes**.
- Cinco DLL de Windows 10 (ntdll, kernelbase, kernel32, user32, gdi32full): **4.191.171 bytes**.
  Se leen en la máquina; sus bytes no se publican.

**Clave pre-registrada desde el manual de Intel, no desde la salida** (2026-11-13T18:53:57Z,
sha256 `def66ab5224d7592…`). En x86 hay bytes que son antónimos de verdad:

- saltos cortos negados: `74`/`75` (si igual / si distinto), `72`/`73`, `76`/`77`, `7c`/`7d`,
  `7e`/`7f`, `78`/`79`;
- saltos largos negados (después de `0f`): `84`/`85`, `82`/`83`, `86`/`87`, `8c`/`8d`, `8e`/`8f`;
- *push* y *pop* del mismo registro: `50`/`58`, `51`/`59`, `52`/`5a`, `53`/`5b`, `55`/`5d`,
  `56`/`5e`, `57`/`5f`;
- el bit de dirección (la misma operación en sentido inverso): `01`/`03`, `09`/`0b`, `21`/`23`,
  `29`/`2b`, `31`/`33`, `39`/`3b`, `89`/`8b`, `88`/`8a`.

| Código máquina | Parejas nítidas (real / barajado) | Pares de la clave juzgados |
|---|---|---|
| `janaxos.exe`, 48 KB | 770 / 702 | **0** |
| 5 DLL, 4,2 MB | 820 / 741 | **0** |

**Ningún par de la clave llegó a juzgarse**: en todos, la pareja verdadera y la equivocada
comparten cero lugares.

**Lo que se descartó, con su medición:** la primera hipótesis fue *falta de muestra*. Se le dio
87 veces más código y las parejas pasaron de 770 a 820. **No es potencia.** Y el filtro de la
mitad (los 14 bytes que cubren la mitad del texto: `00 ff 48 83 49 89 8b 90 0f c7 01 41 05 c1`)
solo excluye 4 de los 52 bytes de la clave.

**Las causas probables, no demostradas:** los bytes cambian de significado según dónde caen
(`84` es *test* o *salta si igual*, `89` es *mov* o un salto largo); no hay límites de instrucción
a la vista; y lo que rodea a cada opcode son direcciones y desplazamientos casi al azar. La
nitidez necesita palabras con identidad estable en contextos que se repiten, y el byte crudo no
se los da.

**Lo siguiente, sin hacer todavía:** el mismo código **desensamblado** (*mov*, *je*, *jne*,
*push*, *pop*), donde cada palabra tiene identidad y límite. Predicción, para que se pueda
tumbar: ahí *je ~ jne* y *push ~ pop* tienen que ganar.

## Lo que enseñó el instrumento

**El primer nulo estaba roto.** Se barajó por espacios, pero en C los nombres vienen pegados con
guiones bajos: `razer_attr_write_right_led` es **una ficha** para ese barajado y **cinco palabras**
para Razar. Se barajaron las cajas sin abrirlas, y daba casi igual que el real. El nulo tiene que
romper la estructura **al nivel en que el sistema la lee**. Se cazó antes de reportar nada, y el
nulo correcto es el de la tabla.

## Cómo reproducirlo

```bash
# C
cat openrazer/driver/*.h openrazer/driver/*.c > driver.txt
python -I razar/jueces/barajar_palabras.py driver.txt real.txt igual
python -I razar/jueces/barajar_palabras.py driver.txt barajado.txt barajar
bash razar/cardumen/nitidez_reproducir.sh real.txt <mats_es> casa_real
bash razar/cardumen/nitidez_reproducir.sh barajado.txt <mats_es> casa_barajada
python -I razar/jueces/juez_nitidas.py casa_real/casa/6e697469646173 <clave>

# código máquina
python -I razar/jueces/extraer_codigo.py <archivo.exe o .dll> maquina.txt
```

(`6e697469646173` es el nombre en hexadecimal del archivo `nitidas` dentro de la casa.)
