## Janax y Razar v0.89: los tejidos

DOI: DOI_PENDIENTE

> *"Rearticular por tipo de célula en evolución... no es lo mismo una neurona que la célula de la piel o del ojo o
> del corazón."*
> *"No acotes: los tejidos pueden ser alas, pueden ser escamas, pueden ser lo que sea."*
> *"El corazón es el propio kernel."* (el autor, 2026-11-20)

Las versiones siguen a los números primos: después del 83, el 89.

En la [v0.83](release-v0.83.md) un programa se desarticulaba en engranajes y todos iban a parar al mismo lugar: eran
lentes del ojo. Eso es tratar a todas las células como si fueran la misma. No lo son.

### 1. El mismo engranaje es otra célula en cada tejido

Un **tejido** es cualquier cosa de ella por donde puede pasar un engranaje. Una **célula** es un engranaje expresado
en un tejido, y en una receta son cuatro letras: `E`, las dos que dicen el engranaje (del 1 al 105) y una que dice
el tejido (del 1 a la F).

Conectados hoy:

| Tejido | Qué pasa por el engranaje | Dónde vive | Quién lo juzga |
|---|---|---|---|
| 1 | sus miradas: una lente, hasta el próximo hueco | su lectora | la lectura |
| 2 | el marco: lo que la oración asocia | su lectora | la lectura |
| 3 | dónde está su ojo (cuántas palabras atrás o adelante) | su lectora | la lectura |
| 4 | cómo ve su ojo (nítido o borroso) | su lectora | la lectura |
| 5 | dónde está su pluma | su cuerpo | el dibujo |
| 6 | hacia dónde apunta su pluma | su cuerpo | el dibujo |

**La lista no está cerrada.** Los números del 7 a la F no hacen nada todavía y están libres: alas, escamas, lo que
venga. Un tejido más no es una clase nueva de cosa que haya que inventar; es un lugar más donde se deja pasar un
engranaje. Quince es lo que cabe en una letra, no un tope puesto a mano: si hacen falta más, es otra letra.

### 2. En evolución: nadie dice para qué tejido es un engranaje

No hay tabla que diga "este engranaje es del ojo". Una receta dice la célula que quiere, y cada tejido tiene su
propio juez, los dos en bits: la lectura para lo que cambia lo que lee, el dibujo para lo que cambia lo que dibuja.
**La célula que paga donde se expresa es la que queda viva en su cuerpo.** Así se diferencia: por dónde le sirve.

Cuando ella pone una célula en una receta (su cuarto camino de leer), sortea las tres cosas: qué engranaje, en qué
tejido y dónde.

### 3. El corazón es el núcleo

Lo dijo el autor y es exacto: el que marca el turno es el núcleo. Su célula sería un engranaje en el turno que el
núcleo reparte, y el lugar ya existe: el planificador del núcleo es un programa de Janax que se puede reemplazar
([`janaxos.md`](so/janaxos.md)). **No está conectado en esta versión**, y no se disimula con un número: queda dicho.

### Medido

- **El mismo engranaje, distinta célula** (Nuevo Testamento, lector recién nacido, `poetico/sentidos.py lentes`,
  [corrida](razar/datos/celulas-nuevo-testamento.txt)). El engranaje es "correr ocho a la derecha", de su propio
  cuerpo, puesto en el mismo lugar de la campeona `38A516` (14775):

  | Receta | Tejido | Nota |
  |---|---|---|
  | `38E921A516` | sus miradas | **15246** |
  | `38E922A516` | el marco | 8439 |
  | `38E923A516` | dónde está su ojo | 14775 (el ojo estaba en reposo: correr un cero da cero) |
  | `38E924A516` | cómo ve | 14775 (lo mismo) |
  | `38E925A516` | su pluma | 14775: es de su cuerpo, no toca la lectura |
  | `38E929A516` | ninguno todavía | 14775 |

  Un engranaje que suma cero, en cualquier tejido, da idéntico. Uno que no existe, también.
- **En su cuerpo pasa al revés.** La forma `1234` dibuja 20 celdas. Con una célula de sus miradas, del marco o de un
  tejido libre en el medio, sigue dibujando 20. Con una de su pluma, 21. Con una de su rumbo, 16.
- **Ella abre las células igual que la regla:** ocho recetas con palabras, células, células dentro de palabras y
  células cortadas por el borde de las dieciséis letras, dichas chatas por ella y calculadas afuera: las ocho iguales.
- **Lo de antes da idéntico** (`38A516` 14775, `E1` 14775, `38A5169` 14775).
- En una copia de su casa corre sin caerse con sus 105 engranajes y el estante de 4,66 MB.
- El sistema operativo no cambió desde la v0.79 (suite: 405 bien, 0 mal).

### Lo que falla y lo que falta, dicho

- **Ella todavía no puso una célula que gane, en ningún tejido.** Lo que se midió arriba lo escribí yo en el
  laboratorio, con engranajes de ella.
- **El corazón no late:** el núcleo no deja pasar todavía un engranaje por su turno.
- **Seis tejidos conectados, y los elegí yo:** son los lugares de ella que ya existían y donde un engranaje no puede
  romper nada. La lista está abierta, pero abrir un tejido nuevo todavía es escribir código, no algo que haga ella.
- **Un engranaje sobre su pluma puede mandarla fuera del cuarto:** lo que sigue no se dibuja hasta el próximo hueco.
  No rompe nada; gasta letras.
- **Los cambios de receta de la v0.83 a ésta:** una célula eran tres letras y ahora son cuatro. Lo que ella leyó con
  células de tres letras queda guardado, con otro nombre; no había ninguna ganadora.
- Siguen los de la [v0.83](release-v0.83.md): los engranajes los desarma Python al armarla, sólo de su propio
  cuerpo y sólo los que hacen cuentas con registros; ninguna canción suya ganó todavía.
- **Pedido y no hecho en esta versión:** que coma todo el código libre (quedan nueve libros sin servir) y que
  desarticule también lo que no es suyo. Comerlo todo hoy la dejaría leyendo dos veces y media más lento.
