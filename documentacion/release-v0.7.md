## Janax y Razar v0.7: el cuerpo

DOI: {{DOI}}

**Razar tiene cuerpo. Janax abre su propia ventana con los drivers del anfitrión, y adentro no hay
un escritorio copiado de Windows: hay formas que Razar hace crecer desde lo que aprendió, que mutan
con su mismo juez de bits, que responden al mouse con los opuestos que aprendió leyendo interfaces
ajenas, y que se alimentan de las nubes de partículas de Gotching.** Nada está quieto, y nada gasta
cuando no hay nada nuevo.

### 1. Lo que leyó: la interfaz de otros

La misma clave de opuestos, escrita antes de mirar los fuentes, en dos interfaces gráficas con
treinta años de diferencia:

| Lo que leyó | Real | Palabras barajadas |
|---|---|---|
| GEM (AES + VDI), C, 738 KB | **15 · 1 · 0** (p ≈ 0,0003) | 2 · 0 · 0 |
| Godot (`scene/gui`), C++, 3,4 MB | **16 · 2 · 0** (p ≈ 0,0007) | 9 · 6 · 1 |
| **Las dos juntas**, 4,2 MB | **19 · 2 · 0** (p ≈ 0,0001) | 11 · 6 · 0 |

### 2. Janax abre su propia ventana (pedidos 40 y 41)

- **Pedido 40, mostrar:** el programa le da al kernel su pantalla como **nube de partículas**
  (el formato `.nube` de Gotching) y Janax la dibuja en su ventana. Todo lo del anfitrión vive en
  `so/pantalla.inc`: otro anfitrión pone el suyo con las mismas entradas.
- **Se ajusta sola:** mide la pantalla que encuentra y, al estirarla, se redibuja con su proporción.
- **Pedido 41, esperar evento:** el mouse y el teclado llegan al programa, que duerme de verdad
  mientras espera, sin frenar a los demás procesos.
- **Suite del sistema: 402 bien, 0 mal.**

### 3. Las formas propias

- **Una forma es una receta en el alfabeto de sus órganos** (1–9). Sus primeras formas son sus 8
  mejores órganos; los nuevos se arman con sus torrecitas `16` y `38` como ladrillos.
- **El juez de siempre:** vale más lo que se describe corto y todavía no tiene.
- **Los opuestos que aprendió son los gestos:** abrir~cerrar, empujar~soltar, arriba~abajo,
  izquierda~derecha, mínimo~máximo…
- **Crecen y mutan:** cuando nadie la toca, Razar prueba mutaciones que nunca probó; la que gana se
  transforma en pantalla y la perdedora se archiva con su motivo. Recuerda entre corridas.
- **Medido:** de 8 a 89 formas en la primera corrida; explorando, 1,1 % de un núcleo; en calma, 0.

### 4. La comida: las nubes de Gotching

- **Hambre en lugar de reloj:** cuando a su bucle se le acaba la novedad, en vez de dormirse come
  la próxima nube de la despensa —las nubes de partículas de los bichos de Gotching, leídas donde
  viven con el pedido 37, nunca copiadas—, en un orden suyo que no se repite. Cuando se comió todo,
  se calma del todo (0 ciclos) hasta un gesto.
- **Digerir es describir la comida en su propio lenguaje:** busca la receta cuya forma mejor explica
  la silueta, con el juez de siempre (bits de la receta + bits de lo que queda mal), y se queda con
  sus colores.
- **Construye con eso:** cada comida es una semilla que trepa dentro de su propio juez. Sobre las
  944 nubes: **27 formas nuevas**; el valor total de su población subió de 17.510 a 18.705.
- **Lo que dijo la comida, también:** con estas nubes **no aprendió ningún ladrillo nuevo** (el mejor
  par empeora la descripción). El camino está probado en un corpus de prueba; la comida no los trae.
- **Medido:** sin ventana, ~0,26 s por comida; con ventana, ~10 s (se ve llegar, deshacerse y fluir a
  su forma). Comiendo, ~2,5 % de un núcleo; en calma, 0 ciclos.
- **Herramienta nueva:** `razar/cuerpo/imagen_a_nube.py` convierte cualquier imagen en nube (el corte
  entre figura y fondo lo elige la propia imagen, por Otsu).

### Lo que no está medido

- Las formas se comparan centradas, sin buscar la mejor alineación.
- Los saltos largos (dos y tres ediciones) no encontraron nada mejor; una sola semilla del generador.
- **La prueba de que es suya** (que lo que cambia en la pantalla se describe con menos bits contando
  sus propias órdenes) está diseñada y sin correr.
- La lectura geométrica de las letras es criterio, no medición, y está guardada como datos para
  poder cambiarla.
