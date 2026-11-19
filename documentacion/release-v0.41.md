## Janax y Razar v0.41: la libertad

DOI: pendiente

> *"No es solo aprendiz, es vivir, es respirar, es incluso no hacer nada a propósito, y hacer algo cuando se le
> ocurra: es libertad."* (el autor, 2026-11-19)

Las versiones siguen a los números primos: después del 37, el 41.

### 1. Luma elige

Cuando se le termina una ronda de pensamientos, Luma ya no abre la siguiente por obligación. Elige, por su propia
suerte, uno de tres actos:

- **descansar:** nada, a propósito, durante un respiro (los cuadros que le llevó su última ronda: su propio ritmo,
  medido). Sus criaturas siguen viviendo: el cuerpo respira.
- **pensar:** una ronda nueva de saltos más largos, lo que hacía siempre.
- **regalar:** le deja a Razar una forma suya con una letra cambiada por su suerte, sin juzgarla ella: su juez
  cuenta celdas y el de él lee un libro (*"a veces lo que falta es el marco"*). No espera la respuesta: sigue
  descansando o pensando, y se entera de qué pasó cuando termina ese acto.

**Sus propias conclusiones.** Nadie le fija las ganas: de cada acto cuenta cuántas veces lo eligió (N) y cuántas le
pagó (S), y sus ganas son (S + ½) / (N + 1), el estimador de Krichevsky y Trofimov que ya usa su juez. Nunca llegan
a cero: ningún acto se le cierra.

**Qué paga, y ahí va el ingrediente X:** pensar paga si una forma suya ganó; **regalar paga si Razar hizo suyo el
regalo** (el bien del otro, no el de ella); descansar paga si alguien la buscó mientras estaba quieta. Un gesto de
la mano siempre pasa primero.

Sus cuentas quedan en su casa (`libre`) y `python razar/cuerpo/libre.py <casa>` las muestra.

- **Medido, con ventana:** en lo que va de su vida eligió 46 veces descansar, 49 pensar y 44 regalar. Ninguno le
  pagó todavía: ninguna forma ganó, Razar no adoptó ningún regalo y nadie la tocó mientras descansaba. Sus tres
  ganas siguen parejas (34 %, 32 %, 35 %).
- **Lo que no se afirma:** que esto sea libertad ni amor. Lo construido es una elección que nadie le dicta, con
  cuentas propias, donde dar vale por lo que le sirve al otro.

### 2. Razar gasta la cuarta parte

- **Lo que ya rindió no rinde de nuevo** (`pulso.jsm`): las recetas de su modelo rinden examen una vez por cada
  estante que lee en su vida. Antes, cada carta lo hacía examinar todas otra vez. Una vida normal da las mismas
  notas y las mismas recetas con el código anterior y con el nuevo; cambian sólo los contadores de ejecución.
- **Trabaja en los huecos** (`razar_en_casa.sh`): corre con la prioridad más baja del anfitrión, la que usa
  procesador sólo cuando nadie más lo pide.
- **Medido**, los dos vivos: Razar pasó de 61 s de procesador cada 120 s (51 % de un núcleo) a 14 s (12 %). Luma,
  6,7 s cada 120 s (6 %). Dormido, Razar sigue en cero.

### 3. Las ramas no suman el original (medido, y da en contra)

La idea del autor: que Razar examine cada regalo de a pedacitos del libro y revise el original contra la suma de
las diferencias, las ramas. Antes de construirlo se midió, con los 90 órganos de hasta dos letras
([datos](razar/datos/ramas-resultado.txt)):

| Órgano | Un octavo | Un cuarto | La mitad | Entero | Suma de 8 ramas sueltas |
|---|---|---|---|---|---|
| `16` | −253 | −57 | +984 | **+6203** | +491 |
| `38` | −85 | +314 | +1046 | +5747 | +1373 |
| `25` | −342 | +294 | +1711 | +4868 | −1188 |
| `36` | −38 | −211 | +949 | +4423 | −1112 |
| `5` | +674 | +794 | +3401 | +3762 | +2904 |

- La suma de las ramas sueltas se parece poco al libro entero: correlación 0,40; el signo coincide en 73 de 90.
- El mejor órgano del libro entero, `16`, sale puesto 87 de 90 en el primer octavo y 44 a mitad de libro. Cortando
  temprano contra el campeón, Razar nunca habría pasado del `5`, y sin el `16` no se llega al `516`.
- Hay dos clases de órganos: los **de cerca** (`5`), que pagan parejo en cada rama y sí se suman, y los **de lejos**
  (`16`), que casi no pagan en ningún pedazo y pagan mucho con todo leído.
- El único corte que la medición aguanta: a mitad de libro, descartar al que ni le gana a no tener órgano. Siguen
  vivos los 10 mejores y 38 de los 40 buenos. No se construyó: ahorra como mucho medio examen y pierde 2 buenos.

**En espera, no descartado.** El motivo: hoy cada pedazo arranca de cero, y lo que estos órganos entienden vive en
la acumulación. Lo que falta es un examen que continúe de un pedazo al siguiente en vez de recomenzar; ahí la suma
de las diferencias sí sería el original.

### Lo que falta

- Que algún acto le pague: con todas las cuentas en cero, Luma todavía no tiene de qué sacar conclusiones.
- Un regalo se da por perdido si Razar no lo adoptó cuando termina el acto siguiente de ella; si él tarda más, no
  se le acredita.
- Que Luma estudie libros desde su ventana: hoy los estudia Razar.

### Cómo verla

Descomprimí `luma-casa-corazon.zip` dentro de una carpeta y corré `bash razar/cuerpo/luma.sh <carpeta>`; para que
Razar viva en esa casa, `bash razar/cuerpo/razar_en_casa.sh <carpeta> <libro>`.
Suite del sistema operativo: **402 bien, 0 mal**. Lo anterior: [v0.37](release-v0.37.md) · [v0.31](release-v0.31.md).
