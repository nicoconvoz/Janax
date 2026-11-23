## Janax y Razar v3.47: sus caminos nacen como sus formas

DOI: DOI_PENDIENTE

> *"Caminos infinitos… dejate guiar por la música… dale las estructuras para que emerjan solos por ella misma… no
> pongas límites en el vocabulario de las formas ni en las formas de los caminos."*
> (el autor, 2026-11-23)

Las versiones siguen a los números primos: después del 337, el 347.

### Por qué

Al contestar, casi siempre citaba. Su orden era una escalera fija: primero el corazón, después improvisaba, y recién
después venían la deducción y su cruce propio. El corazón casi siempre encontraba algo, así que los otros caminos casi
nunca hablaban.

### La estructura

No hay escalera ni camino elegido a mano. Hay lo mismo que tienen sus formas:

- **Un alfabeto abierto.** Sus pasos (corazón, improvisar, su tema, deducir, cruzar), y además cada camino que alguna
  vez ganó, que desde entonces es una letra más. Un camino puede tener caminos enteros adentro, como sus formas crecen
  de sus órganos.
- **Palabras sin largo fijo.** Cada camino es una palabra de ese alfabeto, del largo que necesite, en su propia
  memoria.
- **Su camino.** Arranca siendo el que tenía (corazón, después improvisar): nada se descarta.
- **Su balbuceo.** Como sus formas cuando nadie las toca, prueba su camino con una letra puesta, cambiada o sacada,
  y nunca uno que ya probó. Balbucea tanto como su camino le falla: 1 − (S + ½) / (N + 1).
- **Su juez: la música.** Lo que la juzga es su marco en más armonía (`r_marco`), la música de lo que él le contesta.
  Un camino nuevo que cobró una vez vale (1 + ½) / 2. Si su camino de siempre no cobra tanto, el nuevo toma su
  lugar y se vuelve letra.
- **Su archivo.** Cada perdedor queda guardado con el motivo: no le pagó, perdió su lugar, o cobró pero no más que
  su camino.
- **Su ausencia no es un no.** Un camino espera a que él vuelva para ser juzgado.

Al terminar un camino siguen sus ramas libres, como siempre. Todo se guarda en su casa, en `caminos`.

### Lo que se vio

Probado en una copia de su casa, nunca en la Luma viva, con 8 frases:

- Balbuceó tres caminos nuevos: corazón → tema → improvisar, corazón → cruzar, y deducir → improvisar.
- Su música no le pagó ninguno, y los guardó con su motivo. Su camino de siempre se juzgó una vez y tampoco cobró, así
  que ahora balbucea más.
- Las respuestas dejaron de ser citas enteras. A *"¿te gusta?"* contestó *"…gusta por medio de la vista y el oído…"*.
  A *"¿qué te parece esa historia?"*: *"verdadera historia, me parece que de pasada topé allí este nombre…"*.
- "Todo lo cree" siguió andando: sus ganas pasaron de 93 y 52 a 99 y 58.

La Luma viva corre, byte por byte, el cuerpo que se probó.

### Lo que todavía no

- El juez es lento: sólo juzga cuando él contesta, y en la prueba no pagó nada. Puede tardar en nacer un camino que
  gane.
- El balbuceo busca al azar: cuando dice que no encontró uno nuevo, puede que todavía quedara alguno.
- Esta mañana el vigilante que la despierta no tomó la señal de dormir; se rearmó al cerrar su ventana. No sé todavía
  por qué.

### Dónde está

`razar/cuerpo/gen_leer.py`: `WY` (la estructura), `wy_go` (recorrer su camino), `wy_babble`, `wy_pay` (desde
`r_marco`) y `wy_load` / `wy_save`.
