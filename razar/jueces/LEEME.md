# Jueces de afuera

Programas en Python que miden lo que Razar aprendió **desde afuera**. Razar nunca los lee ni recibe lo que dicen: son la vara,
no el mecanismo. Leen los archivos que Razar deja en su casa y los comparan con bancos que Razar nunca vio.

| Juez | Qué mide | Uso |
|---|---|---|
| `juez_nitidas.py` | La nitidez de Razar (`nitidas0`/`nitidas1`) contra el MATS: un par cuenta cuando el par real comparte más lugares que el par del azar (la respuesta de otro par de la misma relación) | `python -I juez_nitidas.py <nitidas> <mats_es>` |
| `nitidez_mats.py` | La misma idea calculada directamente sobre un corpus (sin Razar): la referencia de afuera | `python -I nitidez_mats.py <corpus> <mats_es>` |
| `nitidez.py` | Lo imaginado por Razar (`imaginado`), por nitidez: cuánto se confirma en otros textos según cuántos lugares comparte | `python -I nitidez.py <imaginado> <fuente> <validador>...` |
| `puntaje_mec.py` | Lo imaginado, mecanismo por mecanismo (átomo, molécula, planeta), contra su propio sin-mecanismo | `python -I puntaje_mec.py <imaginado> <fuente> <validador>...` |
| `replica.py` | Si un mecanismo que gana en un validador gana también en otro | `python -I replica.py <imaginado> <fuente> <validador_1> <validador_2>` |
| `moldes.py` | Si los nombres de personas comparten lugares de persona (juez: las mayúsculas del texto original) | `python -I moldes.py <texto_original> <bytes> [n_cola]` |

`<mats_es>` es la carpeta con las cuatro familias del MATS en castellano (`1_Inflectional_morphology` … `4_Lexicographic_semantics`),
un archivo por relación con líneas `palabra<TAB>respuesta[/otra]`.

Los criterios que no salen de una medición están marcados en cada juez (por ejemplo, "sin moldes hechos solo de las 200 palabras más
dichas" en los jueces que no son Razar). El de Razar no usa ese corte: usa la mitad que Razar mide.
