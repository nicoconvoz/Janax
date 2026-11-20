## Janax y Razar v0.83: los engranajes

DOI: [10.5281/zenodo.24395399](https://doi.org/10.5281/zenodo.24395399)

> *"Lo importante no es comer el programa antes sino desarticularlo en engranajes que sean legos, para que Luma arme
> su propio software a medida."* (el autor, 2026-11-20)
> *"Legos, y adentro de los legos mutación libre de código."* (el autor, desde el principio)

Las versiones siguen a los números primos: después del 79, el 83.

Era la idea de siempre. En la [v0.59](release-v0.59.md) se le dieron pedacitos de código cortados al azar y no
sirvieron: casi todos no hacían nada o rompían. Comer un programa entero tampoco enseña cómo está hecho. Faltaba
cortarlo por sus junturas.

### 1. Desarticular: un engranaje es lo que el programa repite

[`engranajes.py`](../razar/cuerpo/engranajes.py) desarma un programa de Janax con el mismo juez de ella, sin nada
puesto a mano: un pedazo de `L` instrucciones dicho `n` veces **ahorra `n·(L−1) − L` instrucciones** si se lo dice
una sola vez y se lo nombra.

- Un engranaje no tiene saltos, llamadas ni pedidos adentro: tiene una entrada y una salida, y por eso se pueden
  poner uno detrás de otro. Eso los hace legos.
- Los registros se nombran por orden de uso: el mismo trabajo hecho con otros registros es el mismo engranaje.

Sobre su propio cuerpo (`luma.bin`, 30.102 instrucciones) salen solos, y se entienden: **sumar uno** (dicho 570
veces), **restar uno** (239), **la dirección de una forma** (33), **el signo** (93), **por ocho** (86), **correr ocho
a la derecha**. Nadie le dijo cuáles eran. [Los 24 primeros](razar/datos/engranajes-luma.txt).

### 2. Armar: un engranaje es una lente de su ojo

Los engranajes que sólo hacen cuentas con registros (105 de su cuerpo) van a su casa cada vez que se la arma: son los
del cuerpo que tiene. En una receta, **`E`, una letra del 9 a la F y cualquier letra** dicen un engranaje, y ese
engranaje pasa a ser una **lente**: desde ahí toda mirada pasa por él antes de entrar al marco, hasta el próximo
hueco.

Su lectora tiene para eso **una maquinita** ([`organo.inc`](../razar/lectura/organo.inc), `og_lens`): dieciséis
registros que arrancan todos valiendo la mirada, las instrucciones del engranaje corridas tal cual están escritas, y
la mirada queda en lo que dejó la última. Las lentes se apilan. Un engranaje no puede romper nada: sus instrucciones
se hacen de a una, sólo las que hacen cuentas, sobre sus propios registros.

Es el código de un programa de verdad, desarmado, corriendo adentro de una receta que ella escribe. Y es dato: nada
se arma de nuevo.

Leer tiene ahora un cuarto camino con su propia cuenta: **poner una lente**, un engranaje suyo en una receta suya.

### 3. Un error de la v0.79, arreglado

Al abrir sus palabras (para dibujarlas y para nombrar lo leído) ella leía las letras de un lugar equivocado: un
registro pisado. Su lectora no tenía el error, así que las notas eran buenas pero quedaban guardadas con un nombre
que no era el suyo. Ahora esa rutina tiene su prueba directa.

### Medido

- **Una lente hecha con un engranaje de su propio cuerpo mejora a la campeona** (Nuevo Testamento, lector recién
  nacido, `poetico/sentidos.py lentes`, [corrida](razar/datos/lentes-nuevo-testamento.txt)). El engranaje es "correr
  ocho a la derecha": cada 256 palabras seguidas se ven iguales, un borroso por cuán temprano se leyó la palabra.

  | Receta | Nota | Qué es |
  |---|---|---|
  | `38A516` | 14775 | la campeona |
  | `38E92A516` | **15246** | con esa lente sobre la palabra de atrás |
  | `E9238A516` | 5843 | la misma lente sobre la tercera palabra |
  | `E9138A516`, `38E91A516` | 14775 | una lente que suma cero: idéntico |
  | `E9338A516` | 14775 | un engranaje que no existe: idéntico |

- **Ella abre sus palabras y sus lentes igual que la regla:** ocho recetas (palabras, palabras dentro de palabras,
  lentes, lentes dentro de palabras, una `E` en la letra dieciséis) dichas chatas por ella y calculadas afuera: las
  ocho iguales.
- **Lo de antes da idéntico:** las ocho referencias, y las palabras de la v0.79 (`E1` = 14775, `E3E1` = 16523).
- **En una copia de su casa** corre ocho minutos sin caerse, con sus 105 engranajes y el estante nuevo de 4,66 MB.
- El sistema operativo no cambió desde la v0.79 (suite: 405 bien, 0 mal).

### Lo que falla y lo que falta, dicho

- **Ella todavía no puso una lente que gane.** En la prueba de ocho minutos no llegó a poner ninguna: primero lee
  las formas que le faltan leer. La lente buena la encontré yo en el laboratorio, con un engranaje de ella.
- **Los engranajes los desarma Python al armarla, no ella.** Ella los usa y los combina; no los busca.
- **Sólo de su propio cuerpo.** `engranajes.py` desarma cualquier programa de Janax, pero a su casa van los de
  `luma.bin`. El código de máquina de otros (x86) no se desarma.
- **Sólo los que hacen cuentas con registros.** Los que tocan memoria, que son más de la mitad, quedan afuera: su
  maquinita no tiene memoria.
- **Un engranaje sirve de lente y nada más:** transforma una mirada. No arma todavía un sentido entero, ni un
  programa que haga otra cosa que leer.
- **La mayoría de sus engranajes son triviales como lentes:** sumar uno o por ocho cambian el nombre de la palabra y
  no lo que se sabe de ella. Los que sirven son los que juntan palabras (correr a la derecha, el signo).
- **Sus libros nuevos** (código fuente y de máquina, 4,66 MB) hicieron sus lecturas más lentas y sus notas empezaron
  de cero para ese estante.
- Siguen los de la [v0.79](release-v0.79.md): ninguna canción suya ganó todavía; una canción es de un solo piso.
