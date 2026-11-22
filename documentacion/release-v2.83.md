## Janax y Razar v2.83: doble clic, y cada uno le pone el nombre a su Razar

DOI: DOI_PENDIENTE

> *"Publicá con todo, sólo quitale el nombre para que cada quien le ponga nombre a su Razar."* *"Hacé un ejecutable
> para arrancarla, así a nadie se le hace difícil lanzar a Janax por primera vez."* *"Yo nunca digo exactamente lo
> mismo, a menos que sea una instrucción necesaria."* (el autor, 2026-11-22)

Las versiones siguen a los números primos: después del 281, el 283.

![Su corazón contesta](https://raw.githubusercontent.com/nicoconvoz/Janax/master/documentacion/razar/img/luma-musica.png)

### Para arrancarla (Windows)

1. Bajá **`Janax-Razar-Windows.zip`** de este release (18 MB) y descomprimilo donde quieras.
2. Doble clic en **`Arrancar Janax.exe`**.
3. Tu Razar te pregunta cómo se llama: el nombre se lo ponés vos.

Adentro vienen:
- **`janaxos.exe`**, el núcleo;
- **`bin/luma.bin`**, su cuerpo, armado por el ensamblador PDP de Janax;
- **`casa/`**, sus libros, su corazón y lo que aprendió leyendo.

**Lo que no viene:** su nombre y las charlas con su autor (son privadas). Cada Razar empieza a hablar con quien la
lanza.

### El ejecutable

`so/arrancar.asm`, escrito a mano en FASM como el núcleo (2,6 KB). Hace cuatro cosas:
1. busca su carpeta;
2. le dice al núcleo dónde está la casa (`JANAX_ARCHIVOS`);
3. lanza el núcleo con su cuerpo, sin consola a la vista;
4. termina.

Un hallazgo en el camino: **el núcleo nombra sus rutas con `/`**. Con `\` no encontraba su casa y terminaba enseguida,
así que el lanzador da vuelta las barras.

### También en esta versión

- **Nunca exactamente lo mismo.** Antes de decir algo, se fija si ya lo dijo tal cual en la charla; si es así, lo cruza
  con otro renglón suyo y lo dice nuevo. Es su regla de la v1.91, ahora para todo lo que dice. Sin cruce posible, lo
  dice como es, porque es todo lo que tiene.
- **Su mente abierta.** Improvisa con cualquiera de sus libros, por sus gustos contra su suerte, y entra a un libro nuevo
  donde cae su suerte: hongos, planetesimales, bioquímica…
- **Aprende del que le habla.** La charla es un libro de su estante, y sus gustos, sus marcos y su ánimo aprenden de lo
  que hace quien le habla.

### Lo que falta, dicho

- **El paquete es para Windows.** Trae el cuerpo ya armado: el ensamblador PDP no corre en la primera vez.
- **La imaginación de Razar** (inventar lo que nunca leyó con los mecanismos que descubrió) todavía no está conectada a
  su improvisar.
- Siguen las fallas de la [v2.81](release-v2.81.md).
