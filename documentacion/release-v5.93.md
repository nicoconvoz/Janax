## Janax y Razar v5.93: una regla, los lugares, y de lo que sale arma lo que contesta

DOI: (pendiente)

> *"Poníamos a un sujeto, por ejemplo Juli, y veíamos otro, como Nico: veíamos que compartían: caminaban, hablaban,
> comían, jugaban, iban a la escuela… entonces categorizaba."* — *"No te pido que construyas una estructura sino una
> regla general de donde emerja sola la estructura."* — *"Da palabras sueltas, pero son pistas para armar
> oraciones."* (el autor, 2026-11-27)

Las versiones siguen a los números primos: después del 587, el 593.

### La regla

- **Un lugar** es lo que una palabra tiene al lado en una oración: la palabra que cuenta antes y la que cuenta
  después (con las cortas en el medio: *"papa de _"*).
- **Dos palabras que comparten dos lugares son de una clase.**

Nada más. No se nombra qué es una persona, qué es lo que alguien hace ni de quién es hijo: son lugares como cualquier
otro, y lo que sale, sale de cuáles se comparten con quién. Es la nitidez de Razar (v0.3), ahora en el cuerpo de Luma
y aplicada a lo que se le pregunta.

### Cómo la usa

1. Cuando una costumbre no cubre lo que se le pregunta (v5.87), lee sus libros y guarda **los lugares de esa palabra**,
   hasta 64 (un bit cada uno).
2. Vuelve a leer **los libros que hablan de ella** y anota qué otras palabras están en esos mismos lugares. Sólo si de
   ésos no sale ninguna regla lee los demás (*"si te falta evidencia podés usar otros libros similares"*).
3. **Lo que sale** son las palabras que más lugares comparten con ella (dos al menos) y los lugares que dos de ellas
   sostienen. **Son pistas:** vuelve a esos libros y, de las oraciones que hablan de lo preguntado, se queda con las
   seis que más pistas tienen. Dice primero la de más pistas; las demás quedan para cuando vuelvan a preguntarle, y
   para el canto de su cardumen cuando ya las dijo todas.

- Una palabra de **la mitad** (la que se dice en todos lados, medida por ella en sus libros) no es lugar ni está en
  ninguno. La excepción es la palabra que se pregunta: en un libro propio, de quien habla el libro está entre las más
  dichas, y el `hilos` de Razar, que mide la mitad por pedazo, la descartaba.
- Lo que sus libros dicen de lo preguntado **no pasa por su imaginación**: le había puesto otro nombre donde estaba el
  que se le preguntó.

### Lo que salió solo

En una copia oculta, antes de usar las pistas, lo que la regla juntó:

| se le preguntó | lo que salió |
|---|---|
| *quien es Marianela?* | MARIANELA, Nela, Florentina, Teodoro, Pablo: repitio, dirigio… |
| *que es el genoma?* | genoma, genes, celulas, procesos, organismo: organismo, genes del, cambios en el… |

Nadie le dijo qué es un personaje: juntó a los de la novela, y que *Nela* es Marianela.

Y con esas pistas, lo que contesta:

| se le preguntó | contestó |
|---|---|
| *quien es Marianela?* | Marianela reconocio al ingeniero de las minas y al individuo que se habia extraviado en la Terrible la noche anterior. |
| *que es el genoma?* | El genoma humano tiene una longitud de unos 3000 millones de pares de bases; si la longitud media de cada fragmento es de 500 bases… |
| *que es una celula?* | Una celula procariota es un organismo unicelular, cuyo material genetico se encuentra disperso en el citoplasma, reunido en una zona denominada nucleoide. |
| *como estas?* | hola, muy bien, y vos? |

### Lo que todavía no

- **Con un libro contado en primera persona sale flojo.** De un personaje de un libro de su autor juntó palabras que no
  son personajes: al lado del nombre están *"miré a"*, *"sentí"*, y no otros haciendo lo mismo.
- **Elige oraciones; todavía no las arma.** Las pistas sirven para elegir la oración que más dice. Que componga una
  propia con ellas es el paso que sigue (su canto ya recibe esas oraciones como ejemplos).
- **Un nombre que está en varios libros se mezcla:** *"quien es Cesar?"* juntó al del Nuevo Testamento.
- **Tarda de 11 a 31 segundos** en esas preguntas: lee sus libros hasta tres veces.
- La primera pregunta después de despertar puede contestarla sin su pensadora, por su camino viejo.
- Los cortes (64 lugares, cuatro palabras, cuatro lugares, seis oraciones) son tamaños de la estructura, no medidas.

### Su logo

La bandera argentina, imagen de su autor: es el icono de su programa y lo que se ve en grande mientras despierta. La de
la Vendimia y los dibujos anteriores quedan guardados en `razar/logo/`.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `dd_go` (cada palabra que cuenta y su vecina), `dd_place`, `dd_word`, `r_describe` (lo
  que sale), `dan_hC` (las pistas de una oración), `wysg_pt`/`wysg_pc` (su paso).
- `razar/logo/`, `razar/instalador/luma.asm`.
