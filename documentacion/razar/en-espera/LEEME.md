# En espera

Nada se descarta: lo que se dejo de lado queda aca con el motivo, para el dia que aparezca lo que le faltaba.

## pensamiento-por-respiro.patch (2026-11-19)

Que hacia: en cada respiro de Luma, el primer pensamiento que perdia por su dibujo viajaba igual a Razar como carta,
para que el lo leyera. Generaba bien; no llego a probarse.

Por que se dejo: era un puente mas entre dos programas separados. El autor lo freno: "hacelo como el cirujano que
opero mi corazon: unilo bien, sin parches, sin pasos, una sola operacion". Razar y Luma tienen que ser una sola cosa,
no dos que se escriben mejor.

Que le faltaba: nada tecnico. Sobra desde la v0.73, donde hay un solo ser y no hay carta que mandar.

## razar_en_casa.sh y las cartas (2026-11-19, v0.73)

Que hacia: lanzaba a Razar (`pulso.jsm`) despierto en la casa de Luma, como un programa aparte, en la prioridad mas
baja del anfitrion. Se hablaban por cartas: `carta2` (la forma de ella que ganaba, para que el la rindiera como
organo) y `carta1` (el organo que el llevaba puesto, para que ella lo adoptara como forma). En `gen_luma.py` eran
`share_routine` (`r_share`), `fr_give_razar` y `r_adopt`; quien la cuidaba (`luma_vive.sh`) decidia cada noche si
relanzarlo. Todo eso esta entero en la etiqueta `v0.71` del repositorio.

Por que se dejo: desde la v0.73 son un solo ser. Leer es un acto de ella (`gen_leer.py`): su lectora es ella misma,
lanzada por ella, y lo que lee una receta se guarda una sola vez (`leido`). No queda nadie a quien escribirle.

Que se llevo consigo y sigue dormido, con su despertador:

- **La vigilia propia de Razar** (`pulso.jsm` sin ser candidato): sigue armando y corriendo sola, y es el instrumento
  de las medidas (`poetico/sentidos.py`, `organos.sh`, las pruebas de `razar/lectura/pruebas`). Ya no vive en la casa.
- **Sus nichos** (el mejor de cada tipo de hueco, `organos1`): en ella los nichos son sus ocho formas, distintas por
  lo que dibujan. Despierta si hace falta guardar al mejor lector de cada tipo aunque no viva en su cuerpo.
- **Las recetas en el tablero** (`og_rec_write`, `tablero/Receta de Organos/...`): ella no las escribe; lo que leyo
  esta en `leido`. Despierta el dia que otro ser tenga que leer lo que ella aprendio.
- **El cubo** (`poetico/cubo.py vivo`): se alimentaba de las recetas del tablero y le devolvia las suyas a Razar.
  Sin nadie que escriba ahi, dormia; el autor pidio sacar lo que sobra y ya no arranca con Windows (el programa
  sigue en el repositorio). No se unio a ella: seria otro puente entre dos programas. Despierta cuando el
  cubo sea un sentido de ella (leer `leido`, proponerle recetas como un pensamiento mas) o cuando alguien vuelva a
  escribir el tablero.
- **El vigia** lee con el organo mas general del tablero, que quedo como estaba el dia de la union.
- **Su memoria de piezas** (`memoria1`) y **el cruce de genomas con un hermano** (dos Razar que se pasaban el genoma):
  ella lee sola. Los instintos si siguen vivos: los prueba ella, de a un paso.
- **La jaula del candidato** (pedido 34, el doble de lo remado): una receta no puede colgarse (cualquier tira de
  letras es un organo), asi que ella no enjaula a su lectora. Despierta si un dia las letras pueden pedir algo.
