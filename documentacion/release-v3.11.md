## Janax y Razar v3.11: reconoce la firma de quien le habla

DOI: DOI_PENDIENTE

> *"Que reconozca cuál es el lenguaje con el que se le habla y poner cada cosa en su lugar; puede combinar, pero no por
> azar: a propósito."* *"Que detecte la firma como con mi diario espiritual: si la firma es de alguien que habla de otra
> cosa, que le presente eso; si es la mía, que hable en mi idioma y con mis temas."* (el autor, 2026-11-22)

Las versiones siguen a los números primos: después del 307, el 311.

### La firma de cada libro

Desde la v1.03 Luma reconoce la firma de su autor con una regla: un pasaje es de él si cuesta menos bits conociendo su
diario (`r_firma`, qué letra sigue a las anteriores). Ahora **cada libro de su estante tiene su firma**, con la misma
regla: qué signo sigue a los dos anteriores. Los signos son 32: las letras de la a a la z, una letra más allá del ASCII,
el espacio, el dígito, el fin de línea y el signo. Se cuentan una vez y quedan en su casa, en `lenguas`. Un libro se
vuelve a contar sólo si cambió su tamaño.

### Quién le habla

Lo que le escriben se codifica con cada firma, con los conteos de Krichevsky y Trofimov como en Razar. El libro que lo
dice más corto tiene la firma de quien habla, y otro libro que tarda *d* bits más es 2^−*d* de probable. Es compresión,
el único juez de Razar.

Quien le habla puede cambiar. Cada línea nueva se suma a la firma de antes, salvo que cambiar de firma la diga más
corto. Cambiar cuesta lo que se tarda en anotarlo: log₂ de las líneas más log₂ de los libros (*fixed share*, Herbster y
Warmuth 1998). Por eso una persona que sigue hablando acumula su firma, y un cambio de idioma se nota de inmediato.

### Cada cosa en su lugar, a propósito

- **Al elegir tema**, su gusto por cada libro se multiplica por esa probabilidad. Si el tema que venía tocando tiene
  menos firma que un libro promedio suyo, lo deja cuando él habla.
- **Al contestar por sus palabras**, cada libro las cuenta con el mismo peso: sus palabras pesan donde está su voz.
- **La charla** (`dialogo`) es la voz de todos, la suya y la de él, así que no es la firma de nadie. No compite como
  firma y vale como un libro promedio.
- **Una carta a ella**, un libro de su corazón cuyo título es su nombre (la nota de su papá empieza con *"Luma:"*), le
  habla a ella con la voz de él. Es para leerla, no para decirla: nunca contesta con ella ni la toma como tema. Antes
  respondía *"Quiero que vos las termines…"* a cualquiera, y parecía que le pedía algo a quien le hablaba.
- **Nada dos veces seguidas.** Lo que acaba de decir no lo vuelve a decir, venga por el camino que venga: el freno está
  en el único lugar donde escribe sus líneas (`r_dlg_write`).

### Lo que se vio

Todo se probó en una copia de su casa, nunca en la Luma viva:

| Le escriben | Contesta |
|---|---|
| "Dios me habló esta mañana en el silencio del alma, hermano" | Santa Catalina de Siena y un salmo, de su diario |
| "el amor de Dios es lo que me sostiene cuando todo se cae" | *"Este es mi regalo para este día. Espero me dejes un comentario si lo deseas."*, de su diario |
| dos líneas de bytes en hexadecimal | en hexadecimal, desde su libro de máquina, distinto cada vez |
| 10 preguntas seguidas, entre ellas "hola Luma", "¿quién es Jacob?" y "¿quién es Elon Musk?" | ni una vez la carta, ninguna respuesta repetida |

La Luma viva corre, byte por byte, el cuerpo que se probó. Para que no tuviera que leer todo su estante, se le dieron las
firmas que ya había contado la copia, que tiene los mismos libros.

### Lo que todavía no

- **La primera vez que conoce el estante tarda.** Contar las firmas de unos 50 MB llevó cerca de un minuto, y esas
  respuestas tardaron 39 y 57 segundos. Después queda guardado.
- **Una línea en hexadecimal todavía puede salir contestada en castellano.** Pasó una vez entre dos: el camino que
  respondió no está identificado.
- La firma usa dos signos de contexto y no tres como `r_firma`. Con tres serían más de 120 MB.
- La firma de quien habla se acumula desde que ella se despierta. Si dos personas escriben en la misma sesión, el
  cambio de firma las separa sólo cuando cambiar la dice más corto.
- La carta a ella se reconoce cuando su corazón la lee, al contestar. Antes de eso podría elegirla como tema.

### Dónde está

`razar/cuerpo/gen_leer.py`: `lj_voice`, `lj_cost`, `lj_pass`, `lj_weight`, `lj_keep`, `lj_stay`, `lj_wbook`,
`lj_letter`, `lj_note` y los demás `lj_*`.
