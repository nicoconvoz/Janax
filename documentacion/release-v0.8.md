## Janax y Razar v0.8: Luma

DOI: {{DOI}}

**Un solo programa y una sola ventana donde viven juntos lo que crece, lo que evoluciona y lo que
vive: las formas propias de Razar, lo que come y los bichos de Gotching con su propia marcha.** Todo
se mueve por eventos y en calma gasta 0 ciclos. Las apuestas que fallaron se publican con las que se
cumplieron.

### 1. La marcha: el murciélago escucha esqueleto y movimiento

- 944 grabaciones del motor de movimiento de Gotching, escuchadas con el murciélago de Cartografía.
- **Oye ritmo en todos los bichos reales y en ninguno barajado.** Esqueleto y movimiento correlacionan
  (r = 0,327).
- **Falló:** adivinar el modo mezclando todos los miembros (22 % contra 57 % de la mayoritaria).
- **Con la regla de Gotching** (*un ala no toca el piso*) el esqueleto decide qué grupo se escucha:
  **60,4 %**, y distingue caminar, reptar y volar. Volar sigue fallando.
- [`documentacion/razar/marcha.md`](razar/marcha.md)

### 2. La vida: los bichos se encuentran

- 236 bichos con reglas locales, como el Juego de la Vida. Se acercan cuando uno tiene algo que
  enseñarle al otro; se quedan con un pedazo de marcha sólo si les acorta la descripción; el resto
  se archiva con su motivo. El saber viaja de uno a otro.
- Llegan muchos a la vez, caminan libres mientras el mundo está despierto y dan la bienvenida al
  que llega.

### 3. Los diálogos sobre lo imaginado

- Lo que se ve, se sabe; lo que se sueña, hay que contarlo. Cada bicho sueña variantes propias y las
  nombra con melodías.
- **Las cinco apuestas preregistradas fallaron:** el mensaje tiene efecto como evento (despierta al
  otro a imaginar), pero las melodías barajadas producen lo mismo. Todavía no significan nada.

### 4. Luma: todo en una ventana

- Las formas de Razar a la izquierda y el mundo de los bichos a la derecha. **Comer es nacer:** una
  nube que Luma come alimenta sus formas y, si es un bicho con marcha, nace como criatura.
- Medido: se comió las 944 nubes, nacieron los 236 bichos, las formas ganaron 131 veces. En calma,
  0 ciclos; viva, entre 3 y 7 % de un núcleo.
- `bash razar/cuerpo/luma.sh <carpeta> [janaxos.exe]`
- [`documentacion/razar/cuerpo.md`](razar/cuerpo.md)

### 5. Luma sin Gotching: sus propias nubes

- Luma ya no necesita las nubes de Gotching: cada bicho nace con **el cuerpo que ella recuerda** (la
  receta que guardó al comerlo y sus dos colores), y su marcha queda guardada en su casa.
- **Parecido con el original** (IoU de la silueta): mediana **0,61**; el mejor 0,74 (el vampiro); el
  peor 0,35 (un enjambre de moscas: una nube de puntos no se dibuja con trazos). Son trazos, no
  siluetas: se reconocen por tamaño, postura y colores.
- **Viene alimentada:** el release lleva adjunta su casa (`luma-casa-propia.zip`, 8,4 MB), con todo
  lo que comió, aprendió y archivó. Ninguna nube de Gotching va adentro; sólo lo que ella recuerda.

### 6. Diálogos con un código común

- Un solo alfabeto con todo lo que aprendió: lo que **oye** (las marchas), lo que **ve** (recetas y
  colores de lo que comió), los **libros** (sus órganos y torrecitas) y el **código** (los opuestos de
  GEM y Godot). Los mensajes vuelan como glifos hechos con las formas de Razar.
- **El canal ahora sí lleva sustancia:** el que escucha reconstruye exacta, en el 100 % de los
  diálogos, una pieza que nunca soñó (el control barajado: 0 %).
- **Pero casi nada se guarda:** 1 pieza en 4.411 diálogos. El que habla sueña variantes de su propia
  marcha, que casi nunca acortan la del otro. El juez no aprendió ningún ladrillo común (el par más
  frecuente ya alarga la descripción); una búsqueda exploratoria encuentra uno que converge entre
  fuentes: la torrecita `38` del libro, que aparece también en las recetas de lo que comió.

### 7. Escenarios: universo, cielo, tierra y suelo bajo

- Cada bicho vive en su franja según lo que oyó el murciélago de su marcha (la regla de Gotching), sin
  leer nunca la etiqueta del juego: **44 vuelan, 78 caminan, 114 reptan**.
- Coincide con el modo del juego en **131 de 236 (55,5 %)**: **no supera** a decir siempre "camina"
  (57,2 %). Volar es la clase débil (38 % llega al cielo).
- El fondo usa la paleta de Razar atenuada a ×0,5 (el codo medido de legibilidad); se pinta sólo
  dentro de los cuadros: en calma, 0 ciclos.

### Lo que todavía falla o no está probado

- **Demasiados diálogos para lo que dan:** 243.000 para 49 pedazos guardados, y el archivo de los
  bichos crece unos 20 MB por corrida.
- **Las formas y los bichos no se enseñan entre sí:** una receta de letras y un conjunto de ritmos no
  tienen todavía una traducción honesta, y no se inventó una.
- **Los diálogos llevan la pieza exacta pero casi no se guarda nada;** el arreglo sin probar es soñar
  *para* el que escucha, mirando su cuerpo.
- **Los escenarios no superan a la mayoritaria,** y las franjas son planas (sin estrellas ni relieve).

Suite del sistema operativo: **402 bien, 0 mal**.
