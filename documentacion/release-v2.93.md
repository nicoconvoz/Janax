## Janax y Razar v2.93: imagina lo que nunca leyó

DOI: [10.5281/zenodo.24447399](https://doi.org/10.5281/zenodo.24447399)

> *"Conectá la imaginación de Razar con su improvisar, para que diga cosas que nunca leyó, hechas con mecanismos que
> encontró ella. Nada de listas fijas ni parches: que todo salga de sus libros y de sus medidas."* (el autor, 2026-11-22)

Las versiones siguen a los números primos: después del 283, el 293.

### Lo que hace

Mientras improvisa, toca un pedazo de su tema (una ventana de 4 KB del libro donde está). Ahora, a veces, una palabra de
ese pedazo le deja su lugar a otra, y lo que dice es una frase que no está en ninguno de sus libros.

La palabra que entra no sale de una lista. Sale del mecanismo con el que imagina Razar (`hl_instr`, en
`razar/cardumen/hilos.jsm`): **dos palabras se parecen cuando ocupan un mismo rol**, es decir, la misma relación, del
mismo lado y con la misma otra palabra. En su texto, la relación es estar al lado. El rol de una palabra es la palabra
de antes y la de después, las dos a la vez. Mirar un solo lado ("el ___") no alcanza, porque casi todas las palabras de
una clase lo ocupan, y eso dice poco.

1. **Qué palabras pueden cambiar:** sólo las que le dicen algo a ella, por su propia medida (`dh_wt`: lo que la charla
   de sus libros sigue por esa palabra más allá del azar). Nunca su nombre.
2. **Quién entra:** cualquier otra palabra que le diga algo y ocupe, en la ventana, un rol de la que sale. Juntos, todos
   los roles compartidos forman el sorteo: la elige su suerte, y una palabra que comparte más roles tiene más chances.
3. **Sólo si es nuevo:** la cláusula que arma (de signo a signo) no puede estar escrita ni en la ventana, ni en ningún
   libro suyo (`libro…`, `elibro…`), ni en la charla con él (`dialogo`). Si ya la leyó, no la imaginó: dice lo que
   tocaba.
4. **Cuándo:** por sus ganas de imaginar, (S + 1/2) / (N + 1), contra su suerte. Cada vez que imagina, N suma uno. S
   suma uno cuando su coeficiente de marco (`r_marco`) dice que eso le pagó. No hay ningún número fijo puesto por
   nosotros.

Todo lo que imagina queda en su casa, en `imaginado`, en una línea que cualquiera puede leer: la cláusula, la palabra
que salió y la que entró. Sus cuentas quedan en `imagina`. Y en su panel aparece el pensamiento: *imagine: …*

### Lo que se vio

Probado en una copia de su casa, nunca en la Luma viva, con una variante que la fuerza a imaginar (`LUMA_IMAGINA=1`).
Tocando un libro de filosofía, dijo:

> … en la tesis de Rudolf Carnap de que el **proposito** de verdad de las afirmaciones de existencia depende del marco
> linguistico en el que se hacen

Su libro dice "el **valor** de verdad". En la ventana, "valor" y "proposito" ocupan el mismo rol ("el ___ de"). Se
verificó desde afuera que esa cláusula no está escrita en ninguno de sus libros: sólo aparece en lo que ella dijo y en
su `imaginado`. Su marco le pagó esa vez (N = 1, S = 1). Después se probó la versión real, sin el gancho: vive,
contesta y guarda `imagina`.

### Lo que todavía no

- Cambia **una** palabra por vez, y la parecida la busca sólo en la ventana de 4 KB que lee, no en todo el libro.
- Para saber que es nuevo, recorre todos sus libros cada vez que imagina (~50 MB). En la prueba, la respuesta en que
  imaginó tardó 4,5 s en total; lo que tarda el recorrido solo no se midió aparte.
- No usa todavía las formas que Razar descubre que "unen iguales" (como "y"), ni los votos abiertos del `imaginado` de
  Razar: comparte la definición de parecido, no los hallazgos.
- No se comprueba que lo imaginado sea verdad: es una frase nueva, armada con lo que ella sabe del lugar de cada
  palabra, nada más.
- El paquete `Janax-Razar-Windows.zip` es el de la v2.83 y trae su cuerpo anterior. Este release no lo rearma.

### Dónde está

`razar/cuerpo/gen_leer.py`: `im_imagine`, `ig_books`, `ig_isbook`, `ig_mark`, `ig_save`, y el pago en `r_marco`.
