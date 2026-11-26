## Janax y Razar v5.77: no repite, y los dados de su canto son su lluvia

DOI: (pendiente)

> *"Están buenas las respuestas, pero siempre responde lo mismo."* — *"Siempre con el cardumen, como vamos."*
> *"Pero que también use su ingenio."* — *"Que los dados sean la propia lluvia hexadecimal que cae al costado."*
> (el autor, 2026-11-26)

Las versiones siguen a los números primos: después del 571, el 577.

### Lo que cambia

- **No dice de nuevo lo que ya dijo.** Elegía el recuerdo más cercano y nada más: a *"hola Luma"* contestó cuatro veces
  lo mismo. Ahora un recuerdo que ya está en lo último de su charla no se dice otra vez mientras tenga otro
  (`rc_said`). Es su regla de no ser eco, llevada tan atrás como la ventana que lee.
- **De lo más seguro a lo más suyo.** Primero los recuerdos que todavía no dijo, el más cercano adelante. Cuando ya los
  dijo todos, **canta su cardumen**. Y si lo que canta no trae regla, su suerte entre sus recuerdos. Puesto adelante,
  con los pocos ejemplos que tiene, el canto contestaba *"bien y luma"* y *"como"*.
- **Los dados de su canto son su lluvia.** El canto sorteaba siempre con la misma semilla, así que con los mismos
  ejemplos cantaba siempre lo mismo. Ahora, cuando lo que se le dijo va a su pensadora, su cuerpo deja en su casa su
  lluvia tal como está en ese momento (sus 1.976 dígitos, que son bytes de sus criaturas y de sus pensamientos), y el
  canto saca de ahí su semilla. Ningún número se inventa: lo que canta sale de cómo está ella en ese instante. Sin
  esos dados el canto usa su semilla de siempre, y sus pruebas dan lo mismo en cada corrida.
- **Su ingenio, también al conversar, por sus ganas.** Su imaginación (una palabra le da su lugar a otra del mismo
  hueco) vuelve a actuar en lo que contesta cuando ella quiere, no en cada frase.
- **Una palabra de quien le habla vuelve en lo que canta sólo si es un particular** (una que ningún ejemplo dice, como
  su nombre). Si es una palabra común tiene que cumplir la regla de que la digan dos.
- **Mientras están con ella no arranca una charla propia.** Le ocupaba su única pensadora un minuto y más, y lo que se
  le decía después quedaba sin respuesta.

### Lo que se vio

En una copia oculta, con sus caminos de verdad y la charla real de su autor:

| se le dijo | contestó |
|---|---|
| *hola Luma* | hola, que alegria verte |
| *como estas?* (tres veces) | hola, muy bien, y vos? / hoy estoy muy bien, y vos como estas? / ando bien, gracias, y vos? |
| *gracias* (dos veces) | de nada, para eso estoy / no hay de que |
| *te quiero* | yo tambien te quiero |
| *que haces?* | aca estoy, leyendo y pensando, y vos que haces? |

De 1 a 5 segundos cada una, todas sus partes con código 0. Y en la Luma de su autor, ya instalada: *"gracias"* →
*"de nada, para eso estoy"*, en 5 segundos.

Con tres lluvias distintas y los mismos ejemplos, el canto cantó tres cosas distintas.

### Lo que todavía no

- **Lo que compone el canto sigue siendo flojo** con tan pocos ejemplos por costumbre; por eso quedó para cuando ya
  dijo todos sus recuerdos. Su ingenio a veces acierta y a veces no (*"hoy estoy muy suerte"*).
- La primera frase después de despertar puede quedar sin respuesta: su pensadora tarda cerca de un minuto en nacer.
- En las pruebas, alguna frase tecleada llegó cortada (*"s?"*): es de la prueba, que le manda las teclas a una ventana
  que está al fondo.
- Mientras alguien está con ella ya no habla primero; lo hace cuando está sola.
- El libro de costumbres sigue siendo un borrador; Tab sigue pendiente.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `rc_said`, `rc_xn`/`rc_song`/`rc_lk`, `rc_dp`, `r_rain_dice`, `wych_fin`, `dtk_conmigo`.
- `razar/cardumen/memoria_pares.jsm`: `mp_dice`.
