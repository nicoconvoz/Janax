# Razar lee un libro

Pedido del Capitán (2026-11-06): *"veamos qué tanto puede aprender si le pasamos un libro"*. El libro es su Nuevo
Testamento (`E:/proyectos/razar/feed/nuevo-testamento.txt`, 973 KB). **El texto no entra al repositorio**: parece El
Libro del Pueblo de Dios, que tiene derechos de autor; Razar ya lo deja fuera de git y acá se hace lo mismo. Janax lo
lee de su carpeta de archivos con la etiqueta `libro`.

Programa: `razar/lectura/lector.jsm` (+ `lector.datos.jsm`). Todo en Janax.

## Qué hace

- **Dos lecturas.** La primera solo cuenta, así cada tabla nace a la medida del libro (la menor potencia de dos con el
  doble de lugares de los que podría necesitar). La segunda le da un número a cada palabra, por orden de aparición, y
  el libro queda como una fila de números. El renglón (la línea del archivo) es la palabra 0.
- **Palabra** = letras seguidas: a–z, A–Z en minúscula y las letras de U+00C0–U+00FF (tildes, eñe, diéresis; las
  mayúsculas, en minúscula). Cualquier otra cosa corta la palabra; el salto de línea también corta el renglón.
- **Uno de cada K renglones queda aparte para la prueba** (K = 10: criterio, no medición). Aprende solo del resto:
  cuántas veces leyó cada palabra y cuántas veces cada palabra vino justo después de cada otra (sus pares).
- **La prueba:** en cada renglón que nunca leyó se tapa cada palabra por turno y tiene que decirla, viendo el resto
  del renglón. Tres maneras, sobre las mismas palabras tapadas:
  - **eco**: siempre la palabra que más leyó (el modelo nulo: lo que dice sin mirar el lugar).
  - **izquierda**: la palabra que más veces vino después de la anterior.
  - **dos lados**: entre las que vinieron después de la anterior, la que mejor explica los dos lados:
    C(p,x) · C(x,n) / C(x).
  - Los empates van a la palabra vista primero. Si el lugar no le da nada, calla. Una palabra que nunca leyó cuenta
    como preguntada y errada en las tres.

## Medición (2026-11-06)

```
lector: palabras=167963 distintas=11771 renglones=7976 prueba=1/10
tapadas=17018 nunca vistas=604
eco 825 (4,8%) | izquierda 2589 (15,2%) calla 590 | dos lados 4834 (28,4%) calla 2273
```

- Idéntico en los tres motores (intérprete, rutinas, traductor): huella `0000306E9BCC1AA6`.
- **0,9 s el libro entero** en el traductor (`JANAX_CAMBIO=24`).
- El azar puro sería 1 en 11.771 (0,008 %). Decir siempre la palabra más común da 4,8 %. Mirar la palabra anterior
  lo triplica (15,2 %); mirar los dos lados casi lo sextuplica (28,4 %), aunque calla en el 13 %.
- El 3,5 % de las palabras tapadas nunca las leyó: ese es el techo de lo que se puede adivinar copiando.

## Lo que esto es y lo que no

Es un modelo de pares (bigramas) con prueba de completar el hueco: la vara clásica de "cuánto aprende de un texto".
Su mérito es la medición honesta (renglones nunca vistos, modelo nulo al lado), no la inteligencia: no generaliza
más allá de los pares que vio. **No usa todavía el cubo ni los mecanismos de Razar** (P36, gemelos, puertas): es la
línea de base contra la que se van a medir.
