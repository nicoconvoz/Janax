# La nitidez: Razar encuentra sinónimos y antónimos por los lugares que las palabras comparten

**v0.3 (2026-11-09), DOI [10.5281/zenodo.24093510](https://doi.org/10.5281/zenodo.24093510).** Razar, sin que nadie le diga qué es un sinónimo, junta palabras que **ocupan los mismos lugares** en lo
que lee. En 20 MB de Wikipedia en castellano, un texto que no escribe sinónimos, sus parejas aciertan el MATS **451 veces
contra 117** del azar: sinónimos exactos 18 contra 1, antónimos 28 contra 1. Corre en 31 minutos con 205 MB de RAM, y todo se
reproduce con un comando.

Idea del Capitán: *"si una persona 'habla' y en otro lugar dice 'dice', ya sabe que hablan las dos: entra en posible persona…
se va reduciendo, volviéndose más nítido, hasta que haya más información"*.

## Camino rápido: reproducirlo

1. Conseguí un corpus (un texto plano, una oración o párrafo por línea) y el MATS en castellano (abajo, las fuentes exactas).
2. Corré, en una carpeta nueva:

   ```bash
   bash razar/cardumen/nitidez_reproducir.sh <corpus> <mats_es> <casa_nueva>
   ```

3. Mirá `<casa_nueva>/juez.txt`: por familia del MATS, cuántas veces el par real comparte más lugares que el par del azar
   (`real`), cuántas al revés (`azar`) y los empates.

El script arma `hilos` desde el código, convierte el corpus como en las corridas publicadas (cada línea no vacía, en minúsculas,
después de `O: `), corre con el filtro de la mitad y `nitidez`, y llama al juez de afuera (`razar/jueces/juez_nitidas.py`).

## Resultados

Un par del MATS cuenta como `real` cuando sus dos palabras comparten más lugares que la palabra con la respuesta de otro par de
la misma relación (el azar); los empates van aparte. Juez: `razar/jueces/juez_nitidas.py`.

| Corpus | Pedazos | Tiempo | Pico | Total real/azar | Semántica | Sinónimos exactos | Antónimos binarios |
|---|---|---|---|---|---|---|---|
| Wikipedia 20 MB | 199 | 1.873 s | 205 MB | **451 / 117** | 140 / 44 | 18 / 1 | 28 / 1 |
| Wikcionario 15 MB | 150 | 194 s | 144 MB | **249 / 41** | 131 / 24 | 18 / 0 | 17 / 1 |
| Wikipedia 2,3 MB (prueba del script) | 23 | 12 s | — | **70 / 10** | 32 / 4 | — | — |

Por familia, en los 20 MB: flexión 195/27, derivación 41/7, enciclopédica 75/39, semántica 140/44. Ejemplos de lo que aparece:
*iglesia~capilla, día~domingo, color~rojo, ferrocarril~metro, deporte~fútbol, madrid~españa, roma~italia, capaz~incapaz,
general~generalmente*.

**El mismo cálculo hecho desde afuera** (`razar/jueces/nitidez_mats.py`, sobre el corpus entero, sin Razar) da lo mismo en dos
corpus: semántica 234/51 (wikcionario) y 164/51 (Wikipedia 20 MB). Razar adentro reproduce lo que el juez de afuera mide.

## Cómo funciona

| Pieza | Qué hace |
|---|---|
| **Lugar** | Una forma leída `_ <una a tres palabras> _` y su lado: cada par que la forma sostiene pone su primera palabra en el lado 0 y la segunda en el lado 1. Su clave es la misma en todo libro (la de la forma y el lado). |
| **Cola** | Una forma hecha solo de palabras de la mitad, y una palabra de la mitad, no cuentan: lo que se dice en todos lados no dice nada de nadie. La mitad es la que Razar ya mide (`HWC`, `HHC`), sin lista. |
| **Nitidez** | Cada dos palabras de un lugar lo comparten. La nitidez de una pareja es cuántos lugares comparte. |
| **Los lugares viajan** | `lugares0`/`lugares1` (cuál, lo dice `lugar`): una línea `{lugar, palabra, su texto}`. Cada pedazo lee de a 32 KB, despierta los lugares de sus propias formas y copia el resto tal cual, sin cargarlo entero. |
| **Se cuenta una vez** | Una pareja suma un lugar cuando la segunda palabra llega a él; dos que ya estaban se contaron entonces. |
| **`nitidas`** | `nitidas0`/`nitidas1`, una línea por pareja `{clave, lugares que comparten, palabra, otra}`; cada pedazo le suma lo suyo. |

Se activa si la casa tiene `nitidez`. Sin el pedido, lo que Razar aprende es idéntico byte a byte (NT y p320 verificados).
Código: `hl_nitidez` y siguientes en `razar/cardumen/hilos.jsm`. Pruebas: `hilos_nitidez_prueba.sh` y `hilos_lugares_prueba.sh`.

## Fuentes de los datos (no van en el repo)

| Dato | Qué es | sha256 |
|---|---|---|
| Wikipedia 20 MB | Los primeros 20.000.000 bytes de un extracto de la Wikipedia en castellano (ya en minúsculas y con `O: `; ver el aviso) | `d17a95594807375681628cf751b1d512af31d45cd59e663a57844c0a82786afc` |
| Wikcionario 15 MB | Las definiciones del Wikcionario en castellano, texto plano | `ed1d8ba08be45cc07b77cb329c92fe82e3347792b45ee22c2663bb1adac96f96` |
| Wikipedia 2,3 MB | Artículos de la Wikipedia en castellano, texto plano | `c2d6481cde4ead7af1661a53e5cec2d3e668ee4b3e6812a8e10d7e411d23ba80` |
| MATS | Banco multilingüe de analogías del ATILF (UMR 7118), <https://github.com/ATILF-UMR7118/MATS>, versión `7684515` (del trabajo de *SEM 2023 *„Mann" is to "Donna" as「国王」is to « Reine »*); se usa la parte en castellano | `b9fadf4fcac25ee5fd49c265a78ecaaf65be2df4715678e8c7856b5f5830709b` (el zip) |

Los textos de Wikipedia y Wikcionario son CC BY-SA; no se redistribuyen acá, solo su huella.

## Lo que no está probado

- **Los empates son muchos:** palabras que no comparten ningún lugar con nadie. Ahí la nitidez no dice nada todavía.
- **El wikcionario escribe "sinónimos: …"**: parte de su resultado puede venir de ahí. La Wikipedia no los escribe y replica.
- **Aviso de la corrida de 20 MB:** ese extracto ya traía `O: ` y la conversión le agregó otro, así que cada línea empieza con
  una "o" de más. "o" es de la mitad y la nitidez la descarta; el script repite el mismo comando para que el número sea idéntico.
- **El 86 % de las parejas comparte un solo lugar** (15,4 millones en 20 MB): son "posibles", y hacen grande a `nitidas`
  (577 MB). Próximo paso: que las parejas duerman en disco como los lugares.
- **Que Razar razone con la nitidez** (use la clase "persona" que encontró para deducir) no está medido todavía. Razar ya
  razona, y eso sí está medido (`cardumen.md`): deduce relaciones que nadie escribió ("abuelo de" como "padre de + padre de",
  confirmada por el libro) y elige reglas en vez de memorizar (100 % de las sumas que nunca vio con 3 ejemplos, 20 de 20
  semillas; control sorteado 6 %).

## Lo que se aprendió en el camino (y sigue en `cardumen.md`)

- **La relación gigante:** sin filtro, el 93 % de las palabras con relación caía en una sola; sus aciertos contra el MATS eran
  en buena parte de estar adentro, no de juntar bien.
- **La imaginación, mecanismo por mecanismo:** todo junto empata con su sin-mecanismo, pero mecanismo por mecanismo los que
  ganan en un validador ganan en otro (26 de 26, 20 de 20; con un tercer libro de otro siglo, 17 de 20 y 43 de 47).
- **Lo que convive no se refuta:** otro valor o decirlo al revés es otro uso u otro evento, no una contradicción.
- **La nitidez predice la verdad de lo imaginado:** lo que comparte 10 lugares o más se confirma 17 %, lo que no comparte
  ninguno 4 %, con mecanismo o sin él.
