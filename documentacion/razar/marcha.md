# La marcha: el murciélago escucha el esqueleto y el movimiento

Razar escucha cómo se mueven los bichos de Gotching sin que se lo digan. El instrumento es el
murciélago (`cielo.EcoDelMurcielago`, de Cartografía), el mismo que Gotching ya usaba para encontrar
los miembros en el contorno de la silueta. Acá escucha las dos cosas fusionadas: el **esqueleto** (las
jorobas del contorno) y el **movimiento** (el ritmo y la fase del hueso raíz de cada miembro).

Las apuestas se escribieron y se publicaron antes de correr: [datos/marcha-preregistro.txt](datos/marcha-preregistro.txt)
(sha256 `5bce485a…`, commit `3661684`). El resultado completo está en
[datos/marcha-resultado.txt](datos/marcha-resultado.txt).

## Cómo se midió

- **Grabación:** el motor de movimiento de Gotching corre sin ventana y anota el ángulo de cada hueso
  durante 12 s de reloj, en el modo que el juego le da a cada bicho al moverse (Caminar, Volar o
  Reptar). Son 944 grabaciones: 236 criaturas en 4 vistas.
- **Escucha:** el murciélago oye cada miembro. Dos miembros con el mismo período forman un par, y su
  desfasaje se lee como JUNTOS (menos de 0,15 vuelta), EN CONTRA (más de 0,35) o ESCALONADO.
- **Control:** las mismas series, con los cuadros barajados.

## El resultado

| Apuesta | Real | Barajado | Veredicto |
|---|---|---|---|
| A1. Oye al menos un ritmo | **944 de 944 (100 %)** | 0 (0 %) | ✅ cumplida |
| A2. Adivina el modo sin que se lo digan | 211 (22,4 %) | 0 (0 %) | ❌ **falló**: la clase mayoritaria acierta 57,2 % |
| A3. Esqueleto y movimiento van juntos | r = **0,327** (n = 944) | — | ✅ cumplida |

En A3 las cuatro vistas de una criatura no son independientes. Contando sólo 236 criaturas, el mismo
r sigue estando muy lejos del azar (t ≈ 5,3).

Modo del juego contra lo que leyó la fusión:

| Modo | n | Caminar | Volar | Reptar | sin decir |
|---|---|---|---|---|---|
| Caminar | 540 | 61 | 67 | **379** | 33 |
| Reptar | 128 | 2 | 0 | **124** | 2 |
| Volar | 276 | 5 | 26 | **231** | 14 |

## Por qué falló A2 (análisis posterior, no estaba en las apuestas)

La fusión lee casi todo como ESCALONADO. Los 124 aciertos en Reptar no son mérito: dice "escalonado" a
casi todos. Mirando un bicho que camina (el ángel, de frente) aparecen dos causas:

1. **Las patas no van exactamente en contra.** Van a 0,325 de vuelta, no a 0,5: es el látigo del motor
   de Gotching, donde cada escalón hereda la fase de su madre con un retardo. El murciélago lo oyó bien;
   el que se equivocó fue el umbral de 0,35, que se fijó sin conocer ese retardo.
2. **El meneo de fondo tapa a las patas.** Diez miembros que se mueven entre 10 y 50 veces menos que
   las patas comparten el mismo período, y la fusión cuenta todos los pares igual. El murmullo vota
   más que las patas.

Las dos correcciones (pesar cada par por su amplitud y aprender los umbrales en vez de fijarlos) son
una apuesta nueva. Para valer, tienen que escribirse antes y medirse sobre datos que no se usaron
para elegirlas.

## Lo que esto no prueba

El movimiento lo diseñó el motor de Gotching. Acertar sería leer ese motor mirándolo, no inventar uno:
es aprender por observación.

El error que se le declara al murciélago es una regla tomada de Gotching (un cuarto del desvío medio
de la serie), no una medición. Con un error fijo de 1 radián, en la primera prueba no oyó nada, ni
siquiera en los datos reales. Ese fue un instrumento mal usado, y se corrigió antes de la corrida
completa.
