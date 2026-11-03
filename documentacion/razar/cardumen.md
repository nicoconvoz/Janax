# El cardumen: la neurona de Razar (modelo de referencia v0, 2026-11-03)

Diseño del Capitán en `documentacion/so/ideas.md` (2026-11-03). Modelo en `razar/cardumen/modelo.pl`, medición en
`razar/cardumen/experimento.pl` (`perl razar/cardumen/experimento.pl`). La versión en Janax tiene que dar lo mismo,
bit por bit.

**v0**: cubo de 4×4×4 piezas; cada una habla solo con sus 6 vecinas (profundidad 1), con un peso de 0 a 255 por
vecina. Una señal despierta varias piezas a la vez; la ola sigue paso a paso, y una pieza despierta si lo que le dicen
las que despertaron en el paso anterior suma su umbral (100; los pesos arrancan en 40, así que hacen falta 3 vecinas).
Cada pieza despierta como mucho una vez por señal, así la ola termina. El viaje es la melodía. Después de cada señal
la forma se mueve por la interacción, nunca por un reloj: una pieza le habla más (+ su velocidad) a la vecina que
despertó junto con ella (el mismo paso o el siguiente) y un poco menos (−1) a la que no despertó. La velocidad es
estado de cada pieza (metaplasticidad): baja uno cada vez que despierta, hasta 1. Cada pieza guarda su fragmento de
la última melodía: qué vecinas la despertaron. Valores iniciales (40, 100, 20): criterio, no medición.

**Medido**:

| | resultado |
|---|---|
| Repite: dos cardúmenes con el mismo historial | mismos viajes, bit por bit |
| Recuerda: un pedazo (3 piezas) de una melodía de 6, antes y después de aprenderla 10 veces | despierta 3 → **6** |
| Asocia y cambia por interacción: el pedazo de A, antes y después de que suene B (comparten piezas) | `0,1,4 → 5,16,17` → sigue de largo hacia la melodía de B |
| Alternar pedazos de A y de B 12 veces | **2 viajes distintos**: se asienta |

**Lo que enseñó**: la primera regla premiaba solo a la pieza que despertaba *después* de otra, y nunca aprendía, porque
las piezas de una señal despiertan juntas; con *"las que caen juntas"* (frase del Capitán) aprende. Con v0 el cardumen
**se asienta como un hábito**, porque los pesos llegan a 255 y la velocidad solo baja. Si tiene que seguir cambiando,
como pide el diseño, la regla tiene que poder también aflojar: decisión del Capitán, sin tocar perillas a ojo.
