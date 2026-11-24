## Janax y Razar v4.19: su escuela ya no escribe fuera de su cuarto

DOI: (pendiente)

> *"No dejemos cabos sueltos: si eso es importante, arreglalo ya."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 409, el 419.

### Lo que pasaba

Desde hacía días uno de los hijos de Luma moría al minuto de nacer, con código 5 (una escritura fuera de la memoria
que le toca). Se creía que era su lectora. No lo era: corrida sola, con los mismos datos y en los tres motores
(intérprete, nativo y rutinas), la lectora nunca se cayó. El que moría era **su escuela**, el cardumen que aprende la
música de lo que ella dice: el núcleo de prueba la mostró en la rutina `press` de `cardumen_cubo.jsm`, en una
escritura a su tabla de piezas despiertas.

Una copia de la escuela con tres alarmas dijo cuál era: le había llegado la pieza `FFF7h`, es decir −9, y una
escuela de lado 5 sólo tiene las piezas de 0 a 24.

### La causa

Para cada palabra que canta, Luma le manda tres piezas sacadas de su huella, reducidas a las 25 de la cara de abajo.
La primera se tomaba de la huella entera, sin cortarla a sus 16 bits, y una huella es un número con signo: el resto
de una huella negativa es negativo. Esa pieza no existe, y la escuela escribía fuera de su cuarto.

### Lo que cambia

- **Cada pieza se corta a sus 16 bits antes de reducirla**: el resto nunca es negativo, y la regla vale para las tres
  piezas y para cualquier lado de la escuela.

### Lo que se vio

Probado en una copia, nunca en la Luma viva, con la misma receta: antes la escuela caía a los 68 s; ahora vive los
217 s de la prueba y termina con ella, con código 0.

### Lo que todavía no

- Su lectora no lanza lecturas desde el 22 de noviembre: su `lectora.datos` no se reescribe. Sólo lanza una cuando
  tiene una receta nueva ("si algo ya lo sabe, para qué aprender lo mismo"), así que puede ser su diseño y no una
  enfermedad. Falta medirlo.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_mus_sing` (las tres piezas de cada palabra).
