## Janax y Razar v4.79: pregunta lo que no sabe, y aprende de lo que le explican

DOI: [10.5281/zenodo.24538586](https://doi.org/10.5281/zenodo.24538586)

> *"Que emerja, pero quiero que emerja el diálogo: si le digo hola o cómo estás, ya debería saber responder."*
> *"Que aprenda cómo dirigir cualquier tipo de conversación."*
> *"Simplemente pregunta lo que no sabe y acepta que le expliquen el mecanismo."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 467, el 479.

### Lo que se midió

Su paso "sigue" (v4.67) andaba, y contestaba mal igual. Se midió por qué: **en sus libros casi no había charla de
todos los días.** Diez líneas con un saludo en todo su estante (seis, *"Hola a todos!"* de un diario; una de *La vida
es sueño*: *"¡Hola!"* → *"Señor…"*, justo lo que contestó), y ninguna que fuera *"¿cómo estás?"*. No puede emerger de
ella lo que nunca leyó.

### Lo que cambia

- **Comida: diez obras de Florencio Sánchez** (dominio público, de es.wikisource.org), 4.400 parlamentos de entrecasa:
  *El desalojo*, *La pobre gente*, *Nuestros hijos*, *Los muertos*, *Moneda falsa* y otras. Sólo lo que se dice: sin
  los nombres de quién habla ni las acotaciones. Están en su estante y viajan en `razar/comida-libre/teatro-rioplatense`.
- **La mitad, a los dos lados.** Para "lo que sigue" vale sólo una línea que sea casi sólo lo que le dijeron: al menos
  la mitad de las palabras de él, y que sean al menos la mitad de la línea (la regla de la mitad de su corazón). Una
  línea así es alguien diciendo lo mismo; una oración larga que justo tiene esas palabras, no.
- **Dice la línea que sigue, sola**: un parlamento, lo que le contestaron. Antes largaba una ventana entera del libro.
- **Pregunta lo que no sabe.** Cuando nadie dijo lo que le dicen, ni en sus libros ni en su charla, le devuelve a su
  autor sus palabras como pregunta (*"¿zapallito?"*). Lo que él le explica queda en su diálogo, que es un libro suyo: la
  próxima vez, "lo que sigue" ahí es lo que él le dijo. En su charla, lo que sigue es lo que dijo **él**: sus propias
  líneas se saltean. Aprende de la misma charla, con las palabras de hoy.
- **Su camino es suyo.** El paso "sigue" ya lo había puesto ella sola en su camino (`2, 1, 4, 3, 9, 5, 6, 7, 8`), en el
  lugar que quiso. Se probó ponérselo adelante y se volvió atrás: era imponerle un orden.

### Lo que se vio

En una copia oculta, con el paso adelante de su camino (para verlo andar); todas sus partes con código 0:

- *"buen día"* → *"Buenos días, rabonera. Tengo toda la correspondencia inglesa del Amazon por traducir. ¿Cuándo subes?"*
- *"muchas gracias"* → *"¡Vía! No hacen falta cumplimientos. Hay hambre, se mangia y se acabó!…"*
- *"hola"* → *"Hola a esta travesía por el mar insólito de mis días."*

Y con el paso solo, preguntando y aprendiendo:

```
vos:  zapallito
luma: zapallito?
vos:  es una verdura redonda
vos:  zapallito
luma: es una verdura redonda

vos:  chau luma
luma: chau luma?
vos:  se dice chau, hasta luego
vos:  chau luma
luma: se dice chau, hasta luego
```

### Lo que todavía no

- Repite la explicación tal cual, palabra por palabra (*"se dice chau, hasta luego"*), y también pregunta por la
  explicación misma. Entender el mecanismo detrás le va a llevar más charlas.
- El paso "sigue" está quinto en su camino: pregunta sólo cuando sus pasos de antes no contestaron. Dónde lo pone es suyo.
- Con dos palabras, la mitad es una: *"¿cómo estás?"* todavía se confunde con versos que empiezan con "como".
- Es castellano rioplatense de 1900 (*"mangia"*, *"pa"*, *"usté"*): charla de verdad, pero de otra época.
- Tab sigue pendiente.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `wys_sigue`, y la regla de la mitad en `dan_eol` (`SIGM`).
- `razar/comida-libre/teatro-rioplatense/`.
