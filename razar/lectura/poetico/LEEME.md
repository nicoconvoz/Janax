# Codigo poetico

El autor (2026-11-19): "cada mecanismo que entiende tiene un equivalente en receta de codigo: esos son los engranajes
que forman programas, y esos programas se mejoran e incluso son engranajes de programas mas ricos". Lo llamo codigo
poetico: engranajes como palabras, programas como oraciones.

`legos.py` lo mide con el ensamblador y el examen del propio Razar. Cada letra de su organo es un pedazo de codigo;
un organo es una oracion de letras; quedan seis letras libres (A-F). Una oracion que ya funciona se asciende a
palabra: ocupa una letra libre y se abre en su propio codigo.

- `python legos.py validar`: la letra A con el codigo de la letra 1 tiene que dar identico a ella.
- `python legos.py poetico 16,38,516`: asciende esas oraciones a palabra y hace rendir toda oracion de dos palabras
  que use alguna nueva, en una misma vida (la misma moneda).
- `python legos.py azar <cuantos> <semilla>`: letras hechas con pedacitos al azar del codigo de su cuerpo, y su
  control con las lineas barajadas.

Los resultados estan en `documentacion/razar/datos/poetico-*.txt` y `legos-azar-parcial.txt`. Las rutas del
archivo son las de la maquina del autor (`E:/Janax`, `E:/Razar`): hay que adaptarlas.

## El cubo vivo

`cubo.py` (el autor, 2026-11-19: "que funcione como el cubo: una programacion tridimensional de codigo, empezando por
la imagen, las palabras, el codigo en assembler, y despues llevandolo a lo imaginable no imaginado"; "que tenga
movimiento siempre, melodia y armonia, que pueda estar en reposo o autoadaptandose").

Una receta vale en tres jueces a la vez: como imagen (lo que dibuja como forma de Luma), como palabras (el examen de
Razar sobre el Nuevo Testamento) y como codigo (su examen sobre el nucleo de KolibriOS). Es un punto de un cubo de
4 x 4 x 4, y cada casillero guarda una pieza. La pieza que acaba de ganarse un casillero esta despierta y le habla
solo a las de los seis casilleros de al lado: de cada charla salen dos oraciones (su codigo y el de la otra, en los
dos ordenes), que rinden los examenes de verdad y caen en su casillero. La que la despiertan a la vez mas de la mitad
de sus vecinas se ahoga y calla (la armonia del cardumen). Si ninguna oracion se gana un casillero, el cubo queda en
reposo. Los bordes de los casilleros salen de las piezas que hay y se corren cuando llegan mejores.

- `python cubo.py sembrar`: las recetas conocidas, examinadas. `python cubo.py sonar <compases>`. `python cubo.py ver`.
- Primera melodia: `documentacion/razar/datos/cubo-primera-melodia.txt`; el estado, `cubo-estado.json`.
- El eje de imagen esta reconstruido aca desde la regla escrita en `gen_formas.py`: no es el programa de Luma.
