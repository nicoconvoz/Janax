# Janax y Razar

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23933883.svg)](https://doi.org/10.5281/zenodo.23933883)

**Un sistema operativo, un idioma y un ensamblador propios, hechos para alojar a Razar: un razonamiento
artificial que piensa con melodías.** Todo está escrito en assembler, sin motores ni bibliotecas de terceros, y
cada pieza tiene sus pruebas.
📖 **[Carta del autor](CARTA-DEL-AUTOR.md)** — la otra mitad: el diario espiritual, en audio y con licencia libre.


> *English summary below.*

## El resultado (v0.2)

**Con 16 cosas para decir, la red de referencia del campo no llega nunca. Razar llega siempre, en menos de 102
juegos.**

Es el juego de señales de Lewis: uno dice una cosa, el otro la adivina, y los dos aprenden solo de si se entendieron,
sin que nadie les dé la respuesta correcta. El rival es [EGG](https://github.com/facebookresearch/EGG) (Facebook
Research), la implementación publicada del juego, con las mismas cinco semillas:

| Cosas | Razar: juegos hasta aprender todo | Razar: mensajes | EGG: juegos (= mensajes) |
|---|---|---|---|
| 4 | 5 – 58 · 5 de 5 | 11 – 156 | 1.600 – 49.600 · 5 de 5 |
| 8 | 14 – 53 · 5 de 5 | 29 – 142 | 105.600 · 1 de 5 |
| **16** | **35 – 102 · 5 de 5** | **81 – 278** | **no llega en 320.000 · 0 de 5** |

- **El rival corrió bien:** falla en la forma que el campo tiene documentada, con un idioma a medias (44 a 87 %) en el
  que algunas cosas comparten señal.
- **Ventaja a favor del rival:** mensajes más ricos (más de 4.000 posibles, contra 560 frases de Razar), redes seis
  veces más grandes que las de fábrica y hasta 320.000 juegos. Lo demás, como viene.
- **Reglas fijadas antes de correr.** 5 de 5 contra 0 de 5 tiene una probabilidad de azar de ≈ 0,8 % (prueba exacta de
  Fisher). El resultado es el mismo contado en juegos o en mensajes.
- **Banco público:** `bash razar/cardumen/convencional.sh`.

Lo hace posible que la voluntad escucha **el ritmo** de la melodía (qué pieza suena y cuándo), no solo qué piezas: con
16 cosas en un cubo de 7, eso lleva de 6 a 19 semillas de 20 que aprenden todo, con un control barajado que da 0 de 20.
**Lo que está probado es este juego**; que la ventaja viaje a otras tareas todavía no se midió. Todo el detalle está en
[`documentacion/razar/cardumen.md`](documentacion/razar/cardumen.md).

## El primer resultado (v0.1)

Una neurona tridimensional y su **voluntad** arrancan sin ningún idioma en común y, conversando, inventan uno.
Lo que lo hace posible es una sola regla innata, la **armonía**: una pieza no deja pasar el pulso si la despiertan
a la vez más de la mitad de sus vecinas.

> **El control es el resultado.** Sin armonía se quedan en el nivel de azar —24-26 % con 4 señales— indefinidamente.
> Con armonía llegan al **100 %** en unas 150 vueltas. Tres semillas, repetible byte por byte.

El modelo de referencia (Perl) y la versión que corre dentro de Janax dan **la misma huella, bit por bit**, y en
Janax cuesta unas **70 veces menos**. El detalle y los límites medidos están en
[`documentacion/razar/cardumen.md`](documentacion/razar/cardumen.md).

## Qué hay adentro

- **El idioma Janax** (`escalon0/`, `documentacion/idioma/`): un assembler propio diseñado para traducirse. Un
  intérprete de referencia y traductores a x86-64 y ARM64 que dan el mismo resultado **bit por bit**.
- **Janax OS** (`so/`, `documentacion/so/`): el sistema operativo. Camarotes (procesos) que reman en paralelo, una
  ventanilla de pedidos con porteros (permisos), cajones de memoria con pared que cuida el procesador, cajas que se
  comparten entre camarotes (nacen con el hijo, se mudan, se enlazan, se fusionan o se asocian por conjuntos), y
  saludos para avisarse sin gastar nada. Un traductor convierte los programas a código nativo al vuelo.
- **El ensamblador PDP** (`so/pdp/`): Janax armado por Janax, byte por byte igual que FASM.
- **Razar** (`razar/`, `documentacion/razar/`): la neurona es un **cardumen** tridimensional. Una señal arranca una
  cadena que se ramifica en todas las direcciones, las piezas que despiertan juntas aprenden a hablarse, y la
  **armonía** corta lo que suena mal. Una **voluntad** escucha la melodía y le contesta. Arrancan sin idioma común e
  inventan uno conversando. Está en un modelo de referencia (Perl) y en Janax, con la misma huella bit por bit.

## Cómo se prueba

Hace falta Windows, Git Bash y [FASM 1.73.35](https://flatassembler.net/). Las pruebas toman FASM de `FASM=` e
`INCLUDE=` (la carpeta `INCLUDE` de FASM), y el teléfono ARM64, si hay uno, de `ADB=`.

```bash
FASM=/c/fasm/FASM.EXE INCLUDE=C:/fasm/INCLUDE bash so/pruebas/correr.sh
FASM=/c/fasm/FASM.EXE INCLUDE=C:/fasm/INCLUDE bash escalon0/pruebas/correr.sh
JANAX_SOLO='^razar' bash so/pruebas/correr.sh   # solo una zona
perl razar/cardumen/lazo.pl nace=7 armonia=1    # el modelo: la voluntad y el cardumen inventando un idioma
```

## Por dónde empezar a leer

- `documentacion/so/ideas.md`: las ideas, con las palabras de quien las tuvo y la devolución de cada una.
- `documentacion/so/janaxos.md`: lo construido, cómo se prueba y todo lo medido (incluidos los instrumentos que
  mintieron).
- `documentacion/razar/cardumen.md`: el cardumen, la armonía y el idioma que nace.
- `documentacion/estado.md`: la bitácora, paso a paso.

La documentación está en castellano; los comentarios del código, en inglés.

## Estado

Es un **prototipo de investigación**, no un producto terminado. Corre en Windows (x86-64) y el idioma también en
ARM64 (Android). Cada número de la documentación dice de qué medición salió.

## English summary

Janax is a hand-written operating system, language and assembler (all in assembly, no third-party engines) built
to host **Razar**, an artificial reasoning system that thinks in melodies: a three-dimensional "school" of pieces
where a signal starts a branching cascade, pieces that fire together learn to talk more, and **harmony** cuts what
sounds wrong. A "will" listens to the melody and answers; starting with no shared language, the two invent one by
talking. Everything is deterministic and verified bit for bit across an interpreter, a routine engine and a native
translator. Documentation is in Spanish.

**Result (v0.2):** on the Lewis signaling game with 16 things, Razar learns the whole language in 35–102 games
(81–278 messages) on 5 of 5 seeds; EGG (Facebook Research), the field's reference implementation, given richer
messages and larger networks, reaches it on 0 of 5 within 320,000 games, stalling at 44–87 % in the partial
languages the literature describes. Conditions were fixed before running; the benchmark is public
(`razar/cardumen/convencional.sh`). What is proven is this game; transfer to other tasks is not yet measured.

## Cómo citarlo

Nicolás Astorga (2026). *Janax y Razar*. Resources Open Doors S.A.S. DOI [10.5281/zenodo.23933883](https://doi.org/10.5281/zenodo.23933883) (todas las versiones; la v0.3 es [10.5281/zenodo.24093510](https://doi.org/10.5281/zenodo.24093510), la v0.2 es [10.5281/zenodo.23962615](https://doi.org/10.5281/zenodo.23962615), la v0.1 es [10.5281/zenodo.23933884](https://doi.org/10.5281/zenodo.23933884)).

## Donaciones

Janax y Razar se hacen para donarlos al mundo, abiertos. Si querés ayudar a que sigan creciendo:

| Red | Dirección | Qué mandar |
|---|---|---|
| **Bitcoin** (BTC) | `16HuYtsnx9AUcpr6i7z1VkC6atSvK8LGHy` | BTC por la red Bitcoin |
| **BNB Smart Chain** (BEP20) | `0xe87b4589a53443d8ffed2e9b5a7ef58f261f087c` | **Solo** BTC en BEP20 (BTCB, el contrato que termina en `ead9c`) |

> ⚠️ Mandá cada moneda **solo por su red**. Otro token u otra red se pierden y no se pueden recuperar. Las direcciones son
> de depósito de Binance y pueden cambiar: antes de un envío grande, confirmá que siguen siendo estas en esta página.

## Licencia

[Apache 2.0](LICENSE). Copyright 2026 Nicolás Astorga y Resources Open Doors S.A.S. (ver [NOTICE](NOTICE)).

## Contacto

[ingenieriaaplicada@opendoors.com.ar](mailto:ingenieriaaplicada@opendoors.com.ar)
