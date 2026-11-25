## Janax y Razar v5.21: imagina la respuesta, no la información

DOI: [10.5281/zenodo.24542452](https://doi.org/10.5281/zenodo.24542452)

> *"No quiero recitados, quiero originalidad; y eso ya lo hace, sólo quiero que lo aplique."*
> *"No imagina la información, imagina la respuesta... la información es la información; aunque quiero que se
> retroalimente del diálogo."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 509, el 521.

### Lo que cambia

- **Su imaginación, también cuando contesta.** Desde la v1.99 imagina: una palabra le da su lugar a otra que cumple su
  mismo papel (la misma palabra antes y la misma después), y sólo lo dice si esa frase no estaba escrita. Lo hacía
  nada más cuando improvisaba sobre su tema. Ahora lo hace en lo que teje para contestar (`wych_fin`).
- **La información es la información.** Cuando le contesta a alguien, la ventana de su imaginación es sólo la charla de
  ellos: una palabra de su respuesta puede cambiar únicamente si esa charla la dice, y sólo por otra palabra de esa
  charla. Lo que viene de un libro y nunca se dijo entre ellos queda como lo comió. Así se retroalimenta del diálogo:
  cuanto más hablan, más formas tiene.
- **Sin hacerlo esperar.** Contestando no revisa contra todos sus libros que la frase sea nueva: alcanza con que su
  charla no la haya dicho. Estudiando sola imagina por sus ganas y con la revisión completa, como siempre.
- **Lo que no trae palabras nuevas no entra.** Una propuesta que engancha pero cuyas palabras ya dice una que guarda es
  lo mismo dicho otra vez: ahí corta. Había contestado tres veces seguidas el mismo renglón.

### Lo que se midió

En una copia oculta, con sus caminos de verdad, cinco frases: todas contestadas, de 6 a 34 segundos, todas sus partes
con código 0. Con la revisión contra todos sus libros puesta también al contestar, dos o tres de cada cinco frases
quedaban sin respuesta a los 90 segundos.

En una prueba anterior, con una ventana más amplia, a *"hola luma"* contestó *"hola vos!!"* (cambió *Luma* por *vos*).

### Lo que todavía no

- **En la última prueba no imaginó nada en las cinco respuestas a su autor**: su charla de prueba es corta y dos
  palabras rara vez cumplen ahí un mismo papel. Lo que se vio imaginar fue estudiando sola.
- De 6 a 34 segundos es más lento que los 2 a 10 de la v5.03; no se sabe todavía cuánto es de la imaginación y cuánto
  de que su pensadora estaba ocupada estudiando cuando se le habló.
- A *"contame algo"* contestó *"hola luma"*: sigue sin medirse cuántas respuestas tienen sentido.
- Tab sigue pendiente.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `wych_fin` (`wf_d`, `wf_i`), `im_imagine` (`IGF`, `ig_new`), `wyg_ok` (`wk_cut`), `pz_q` (`ANSW`).
