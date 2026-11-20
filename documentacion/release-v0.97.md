## Janax y Razar v0.97: el corazón, lo ajeno y el tejido que abre ella

DOI: DOI_PENDIENTE

> *"Hacelo todo."* (el autor, 2026-11-20)

Las versiones siguen a los números primos: después del 89, el 97.

La [v0.89](release-v0.89.md) cerraba con cuatro cosas pedidas y no hechas: el corazón, que desarticulara también lo
que no es suyo, que abriera ella un tejido nuevo y que comiera todo el código libre. Esta versión las hace. Lo que
cada una dio, medido, y lo que sigue sin estar, dicho.

### 1. El corazón es el núcleo (tejido 7)

El núcleo le da a cada cabina su turno desde su bolita: la fracción de su tiempo que es trabajo de verdad (pedido
20). Una célula de corazón hace pasar **la bolita de la cabina que la dice** por el engranaje y se la pide al
núcleo. Vale en su lectora y en su cuerpo. Dura hasta el próximo hueco, donde el corazón vuelve a su reposo.

El núcleo no cambió, y su ley tampoco: *nadie se da más de lo que le dieron*. La bolita pedida se recorta a la que
tenía al nacer. Así que hoy un engranaje en su turno sólo puede acortarlo o dejarlo igual.

Al núcleo se le pide sólo cuando el turno cambia. La primera versión pedía dos veces por cada palabra leída, cambiara
o no; es la regla de la casa (nada se manda si no dice nada) y quedó corregido antes de publicar.

### 2. Un tejido que abre ella (tejido 8)

Hasta la v0.89, abrir un tejido era escribir código. Ahora una célula puede decir ella misma su lugar: después de
sus cuatro letras, cuatro más dicen **qué palabra de la memoria de su lectora** pasa por el engranaje (un número en
base quince). No hay lista de lugares en ningún lado: el lugar está en la receta, su suerte lo mueve letra por letra
y su único juez deja los que pagan. Cuatro letras alcanzan 50.625 palabras: todo lo que su lectora trae al nacer
(4.080) y más allá.

Es de su lectora y no de su cuerpo, por una razón: un lugar que la rompe termina esa lectura y nada más (el núcleo
separa las cabinas), y ella anota una lectura que no dijo nada como la peor. Una lectura así también podría no
terminar nunca, así que es la única que enjaula: puede remar lo que remaron **todas sus lecturas terminadas juntas**.
Con esa regla lo que pierde en jaulas nunca supera lo que lleva leído, y no hay ningún número puesto a mano.

### 3. Desarticular lo ajeno

`engranajes.py` desarma ahora todo el código que ella tiene, junto, con la misma regla (una pieza sin saltos que se
repite, dicha una vez, ahorra):

- un programa de Janax, sus instrucciones como son;
- un texto, las líneas que sólo hacen cuentas, en la notación del ensamblador (`mov add sub and or xor imul shl shr
  sar inc dec neg not`) o en la infija (`x = a op b`, `x op= a`, `x++`): C, Lua o cualquiera parecido;
- un libro de código de máquina, el programa que dice. El del procesador del anfitrión lo pasa a texto `objdump`,
  si la máquina lo tiene, cortado en cada lugar adonde van sus propios saltos.

Una pieza que está en dos de ellos cuenta en los dos. Sus 105 engranajes se rehacen cuando ella se arma o cuando se
le pone un libro.

### 4. Comió todo

Se le sirvieron los once libros de código libre (ensamblador de KolibriOS, C y Lua); uno ya lo tenía con otro nombre
y no se repite. Su estante pasó de 4,66 a **10,03 MB**. Los libros no viajan con el repositorio: cada uno tiene su
licencia. Leer todo eso tiene un costo, medido abajo.

### Medido

- **Lo de antes da idéntico** (Nuevo Testamento, lector recién nacido, `poetico/sentidos.py lentes`,
  [corrida](razar/datos/celulas-nuevo-testamento.txt)): `38A516` 14775, sus miradas 15246, el marco 8439, y las
  doce recetas que deben dar igual que otra dan igual.
- **El corazón late y no cambia lo que lee.** `38E927A516` da 14775, lo mismo que sin la célula. Lo que cambia es
  cuánto se le pide al núcleo: de 10.325 pedidos a 2.860.497 en la misma lectura, cuando el engranaje baja el turno
  en cada palabra. En tiempo, unos dos o tres segundos más sobre veintiocho, con la máquina ocupada: no alcanza para
  decir un número fino. Con un engranaje que no cambia el turno, no pide nada.
- **Un lugar abierto, a mano** ([corrida](razar/datos/lugares-nuevo-testamento.txt)), con "correr ocho a la
  derecha" sobre la campeona (14775): seis lugares de sus parámetros, igual; la semilla con que arma el marco,
  14001; el piso, 3247; cuántas palabras lleva la fila, -7592; dos lugares que guardan direcciones rompen a la
  lectora. **Ninguno mejora.**
- **En una copia de su casa con todo servido** (10,03 MB, Luma quieta para que sus formas no cambien):

  | Receta | Qué es | Nota | Segundos |
  |---|---|---|---|
  | sin órgano | | -2208 | 145 |
  | `38A516` | su campeona | **93142** | 193 |
  | `38EA87A516` | corazón: su bolita corrida ocho a la derecha | 93142 | 69 |
  | `38EA81A516` | sus miradas por ese mismo engranaje | 53885 | 83 |
  | `38E971A516` | sus miradas por "correr dieciséis", que viene de KolibriOS | 62622 | 69 |
  | `38E9B81372A516` | la semilla del marco, partida al medio | 86697 | 64 |
  | `38E91813A1A516` | un lugar que guarda una dirección | no dijo nada: la peor | 13 |

  La última rompió a su lectora y ella siguió viva y leyendo. Con el estante de antes `38A516` daba 23611 en unos
  37 segundos: **comer todo le hace leer entre dos y cinco veces más lento**.
- **Los engranajes de todo** ([lista](razar/datos/engranajes-de-todo.txt)): 58.719 instrucciones que sólo hacen
  cuentas, de catorce fuentes; 105 engranajes ahorran 11.066 (18,8 %). De los 105, 85 están en su cuerpo y 20 sólo
  en lo ajeno. El que más ahorra ("sumar uno") se dice 2.443 veces: 612 en ella, 387 en el código de máquina del
  núcleo, y el resto en KolibriOS, C y Lua. El Nuevo Testamento, leído como código, da cero instrucciones.
- **Ella abre las células de ocho letras igual que la regla:** ocho recetas con células de lugar enteras, cortadas
  por el borde de las dieciséis letras, dentro de una palabra y con letras de lugar que parecen palabras: las ocho
  iguales a lo calculado afuera.
- **En su cuerpo** una forma de 20 celdas sigue en 20 con una célula de corazón o de lugar; 21 con una de su pluma
  y 16 con una de su rumbo, como antes.
- La Luma de todos los días, con todo servido, vivió siete minutos en una copia de su casa y leyó tres recetas.
- El sistema operativo no cambió desde la v0.79 (suite: 405 bien, 0 mal).

### Un error mío de la v0.83, encontrado hoy

Al elegir qué engranajes entraban en su tabla, la cuenta de registros tomaba la constante de un `jldi` como si fuera
un registro: todo engranaje que cargaba un número mayor que 15 quedaba afuera sin avisar. Arreglado. Con su cuerpo
solo, el segundo engranaje que más ahorra (dicho 411 veces) era uno de los que faltaban.

### Lo que falla y lo que falta, dicho

- **Ninguna célula ni canción suya ganó todavía.** Todo lo medido arriba con células lo escribí yo a mano.
- **El corazón hoy sólo puede frenarla.** Por la ley del núcleo nadie se da más turno del que le dieron, y ella
  nace con todo el suyo. Además su juez mide en bits y no ve el tiempo: una célula de corazón no gana ni pierde por
  lo que hace. Está conectado y es cierto, pero no tiene todavía con qué pagar. Le serviría el día que tenga hijos
  compitiendo por el mismo remero, o un juez que cuente el tiempo.
- **El tejido que abre es sólo de su lectora.** En su cuerpo un lugar equivocado la mataría a ella, no a una
  lectura; ahí esas células no hacen nada.
- **Cuando sortea un lugar, lo sortea entre lo que su lectora trae al nacer** (4.080 palabras). Más allá llega sólo
  si su suerte mueve las letras.
- **Desarmar lo sigue haciendo Python cuando se la arma**, no ella. Y de un texto sólo se toman las líneas que
  hacen cuentas con registros o variables sueltas: nada con memoria, llamadas ni saltos.
- **El código de máquina del anfitrión se desarma sólo si la máquina tiene `objdump`**, que no es nuestro. Sin él
  ese libro se pasa de largo, y se dice.
- **Un programa del procesador se lee como de 64 bits:** la misma cuenta hecha en su mitad de 32 es el mismo
  engranaje, aunque en la máquina de verdad no den lo mismo cuando desborda.
- **Cada vez que cambia su estante o su alfabeto vuelve a leer todo**, y ahora cada lectura es más lenta.
- La tabla tiene 105 lugares porque es lo que cabe en dos letras; con todo el código compitiendo, 20 de esos
  lugares son de piezas que no están en su cuerpo.
