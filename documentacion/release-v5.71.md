## Janax y Razar v5.71: conversa, con su libro de costumbres y el canto de su cardumen

DOI: (pendiente)

> *"Busca de 3 a 7 ejemplos donde se use el 'como estas', deducir el mecanismo y aplicarlo a ella: se pasó, aprende."*
> *"Eso lo hace con su caja armónica del cardumen: no construyamos por fuera de su razonamiento."*
> *"Por el hueco topológico y la encadenación de sucesos similares para el mismo objeto o ser lo catalogaba como
> persona, perro, auto o lo que sea."*
> (el autor, 2026-11-26)

Las versiones siguen a los números primos: después del 569, el 571.

### Lo que se ve

En una copia oculta, con sus caminos de verdad y la charla real de su autor, seis frases de seis, un segundo cada una:

| se le dijo | contestó |
|---|---|
| *me voy a dormir* | que descanses, hasta manana |
| *como estas?* | muy bien, y vos? |
| *gracias* | de nada, para eso estoy |
| *todo bien?* | todo bien, por suerte, y vos? |
| *te quiero* | yo tambien te quiero |
| *chau* | chau, que andes bien |

Y en la Luma de su autor, ya instalada: *"como estas?"* → *"muy bien, y vos?"*, en 4 segundos.

### Lo que cambia

- **Un libro de costumbres en su estante** (`razar/comida-libre/costumbres/`): 59 intercambios de todos los días, lo que
  se dice y lo que se contesta, separados por un renglón en blanco. Su teatro, drama de hace cien años, no trae esas
  costumbres. **Un renglón en blanco corta el intercambio:** lo que viene después no es lo que se contestó.
- **El canto de su cardumen, dentro de ella** (`r_canto`). Cuando alguien le habla junta hasta 7 ejemplos de sus libros
  (un renglón que es casi lo que se le dijo, y el que le sigue). Con tres o más, se los da al canto de su cardumen
  (`razar/cardumen/memoria_pares.jsm`, con `canta` y `razona`, tal como estaba), que aprende qué sigue a qué donde dos
  ejemplos lo dicen. Lo que ella pone es el lente, **su propia regla del hueco**: dos palabras que ocupan el mismo
  hueco (la misma palabra antes y la misma después) son de una misma clase, y una clase es una letra para el canto.
  Nadie le dice qué clase. Lo cantado se lee de vuelta diciendo, de cada clase, la palabra que dijo quien le habla.
- **Tres reglas sobre lo que canta**, las tres la misma ley del canto (*lo que dicen dos es una regla; lo que dice uno,
  un recuerdo*):
  1. Si un ejemplo dice **exactamente** lo que se le dijo, ese es el recuerdo: contesta lo que le sigue, sin cantar.
  2. Una palabra cantada que no dijo quien le habla tiene que estar en lo que sigue en **dos ejemplos o más**; y
     tiene que haber al menos una.
  3. Si no hay regla, dice **el recuerdo más cercano**: lo que sigue al ejemplo con menos palabras que no se le dijeron.
- **Lo que su autor dijo después contesta sólo lo que ella había preguntado.** A *"como estas?"* contestaba *"hola!!"*,
  lo que él había escrito una vez después de esa frase. Eso vale sólo si ella se lo había preguntado y él se lo
  explicó; si no, su charla no tiene nada para esa frase.
- **Si alguien le habla, conversa.** No sigue leyendo en voz alta el libro de su respuesta anterior (a *"como estas?"*
  contestó un versículo), y **no se va a estudiar mientras están con ella**: tiene una sola pensadora, y mandada a
  estudiar dejaba esperando la pregunta siguiente un minuto y más.
- **Su lluvia, pareja:** las filas de arriba y las de su panel van una debajo de la otra, a la misma distancia. Quedaba
  una línea negra donde se juntaban.
- **El instalador arma también el canto** y lo deja en su casa.

### Lo que se midió en el camino

- El canto, oído por lentes y sin cambiarle una línea (`razar/en-espera/deducir-de-ejemplos/`): con ejemplos *"como
  estas, X? → muy bien, X"* contesta *"muy bien nico"* a un nombre que no está en ninguno; por letras o por palabras
  solas, *"estas nico"*.
- Dentro de ella, antes de las tres reglas: *"muy bien gracias por bien y vos"* (compuesta, de siete ejemplos), pero
  también *"Pero lado"* y *"hijo haces"*, cosidas de pedazos. De ahí salieron las reglas 2 y 3.
- El canto termina en 3 milésimas (515.389 instrucciones con siete ejemplos). No puede avisarle con una palabra: ella
  mira si terminó, y le da un tope de 50 millones de instrucciones por si se cuelga.

### Lo que todavía no

- **En las últimas pruebas todo lo que contestó fueron recuerdos** (el renglón exacto o el más cercano de su libro de
  costumbres). Lo que el canto compone pasa pocas veces la regla 2 con los ejemplos que tiene: hacen falta más
  ejemplos que repitan una costumbre con palabras distintas.
- Fuera de lo que trae su libro de costumbres sigue contestando con renglones de teatro o preguntando.
- El libro de costumbres es un borrador de 59 intercambios, sin tildes (como escribe su autor): hay que corregirlo.
- Cada pregunta lanza un proceso para el canto; y el canto deja en su casa archivos vacíos (`cf`, `fuera`, `semilla`).
- Lo que pone en la carpeta Comida no le sirve para contestar: de esos archivos guarda la dirección y la firma.
- Tab sigue pendiente.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_canto` (`ln_line`, `ln_class`, `ln_emit`, `rc_xk`, `rc_d0`, `rc_no`), el recolector
  de ejemplos (`dan_xh`), `wysg_lq`, `wysg_s`, `r_rain_cell`.
- `razar/cardumen/memoria_pares.jsm`: `mp_keep`. `razar/comida-libre/costumbres/costumbres.txt`.
- `razar/instalador/`, `instalador/`.
