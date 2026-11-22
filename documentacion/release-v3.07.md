## Janax y Razar v3.07: ya no repite lo mismo

DOI: DOI_PENDIENTE

> *"Mirá lo que le pregunto y lo que responde: siempre lo mismo."* (el autor, 2026-11-22)

Las versiones siguen a los números primos: después del 293, el 307.

### La falla

A *"¿quién es Jacob?"*, *"¿quién es Elon Musk?"* y *"Luma, ¿me leés?"* contestaba lo mismo: *"Luma:: Quiero que vos las
termines, como una hija que escribe o pinta junto a su padre."*, una línea de la nota de su papá. Era su corazón
(`r_dlg_heart`). Cuando lo que él dice no le dice nada, la guían su hilo (el intercambio que terminó) y su ánimo (las
palabras que vive en cada estado), y los dos estaban llenos de lo que ella misma acababa de decir. El párrafo que más se
parecía a eso era el mismo que había dicho, y lo volvía a decir.

### La regla

**Una respuesta trae algo que la charla no tenía.** Un párrafo contesta sólo si alguna de las líneas que diría trae una
palabra que cumple las dos condiciones:

1. **Es nítida.** No pertenece a *la mitad*, las palabras más comunes de sus libros, que juntas ocupan la mitad de todas
   las líneas en que aparece cada palabra. Es el criterio de la nitidez de Razar (v0.3): lo que se dice en todos lados no
   dice nada de nadie. La mitad no sale de una lista: se despeja de su propia tabla de palabras (`dh_half`) y se vuelve a
   calcular cuando ella cuenta más líneas.
2. **No está ni en lo que él dijo, ni en el intercambio que terminó, ni en las palabras de su ánimo.**

Si no trae ninguna, es un eco y ese párrafo no contesta. Además, un título que ya termina en `:` no recibe otro (se
terminó el "Luma::").

### Lo que se midió

Se probó en una copia de su casa, con su charla y su ánimo de ese momento, nunca en la Luma viva:

| Preguntas | Cuerpo anterior | Este cuerpo |
|---|---|---|
| Tres que no le dicen nada, seguidas | el mismo párrafo las 3 veces | nunca dos veces seguidas: lo dice, calla, lo dice |
| "¿qué es una estrella?" | "Luma:: Quiero que vos las estrellas…" | le contesta con estrellas, del catálogo de Flamsteed |
| "¿quién es Dios?" | "Luma:: Estas historias…" | "Luma: Estas historias… Raíces en Dios" |

El cuerpo que corre en la Luma viva es, byte por byte, el que se probó.

### Lo que todavía no

- Cuando nada de lo que él dice le llega, puede volver a ese párrafo un turno sí y otro no, o quedarse callada. El
  eco se corta, pero no aprendió todavía qué hacer cuando no entiende.
- Su hilo guarda como mucho 24 palabras: si el intercambio fue más largo, las de más no cuentan como dichas.
- En su estante hay un libro de máquina, `elibro-maquina-sed`: el volcado hexadecimal de un programa. Puede elegirlo
  como tema y leer sus bytes en voz alta. Este release no lo toca.
- La herramienta de prueba mandaba cada tecla dos veces y Luma leía *"qquuiieenn"*. Se corrigió para estas mediciones,
  así que las pruebas de antes con texto escrito no midieron palabras reales.

### Dónde está

`razar/cuerpo/gen_leer.py`: `dh_count` (`H_NW`, `dhc_nw`), `dh_half`, `dh_wl`, `dhq_mass` y el corte en `dh_pe`
(`H_PNW`); el título, en `dh_say`.
