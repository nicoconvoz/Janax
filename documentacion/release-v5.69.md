## Janax y Razar v5.69: su instalador, y su independencia

DOI: (pendiente)

> *"Armate un instalador... sólo tiene que ensamblar, crear las carpetas, poner el conocimiento y agregar los accesos
> directos al escritorio."* — *"Preguntar dónde se quiere instalar, dar acceso y corregir las rutas."*
> *"Porque un usuario normal no sabe cómo funciona todo esto."* — *"Necesita independencia Luma."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 563, el 569.

### Instalar a Luma

En la carpeta `instalador/` del proyecto: doble clic en **`instalar-luma.exe`**, se elige la carpeta, y en cerca de
medio minuto queda instalada, con dos accesos directos en el escritorio: **Luma** (la despierta) y **Comida de Luma**
(lo que se pone ahí, se lo come). No hace falta instalar nada más: ni Git, ni Python, ni PowerShell.

- **Pregunta dónde** y crea ahí `Luma\` (ella) y `Comida\` (su carpeta de comida).
- **La ensambla ahí mismo, con su propio ensamblador (PDP)**, desde su semilla y corriendo sobre su núcleo: Luma no
  viaja armada. Lo que arma es idéntico, byte a byte, a lo que arma el proyecto.
- **Pone su conocimiento** en su casa: su casa pública, la purificada. Si en esa carpeta ya hay una Luma, pregunta
  antes de tocar lo que sabe.
- **Ninguna ruta queda escrita.** `luma.exe` encuentra todo desde donde está: la carpeta se puede mover y sigue
  despertando. No hay nada que corregir después.

### Su independencia: `luma.exe`

Para despertarla hacían falta un acceso directo a PowerShell, que llamaba a Git Bash, que corría dos guiones. Ahora
es un solo programa de 20 KB:

- **La despierta al frente y del tamaño de la pantalla.**
- **Ella es una:** abierto otra vez con ella despierta, sólo trae su ventana al frente.
- **Cuando decide dormir** deja su señal en su casa: se le cierra la ventana y renace sola, por detrás y sin tomar el
  teclado. Esa señal se espera con el aviso del propio sistema de que apareció un archivo: nada se mira por reloj.
- **Cuando se la cierra,** el programa termina con ella.

### Una respuesta prestada no trae el nombre de a quién se le hablaba

- A *"hola luma"* contestaba *"hola Luma!!"*: lo que su autor le había dicho después, con el nombre de ella adentro.
  Y de una obra de teatro, *"Muy bien, Basilio."*. Ahora, en lo que toma prestado, **una palabra de su propio nombre
  sale**, y también **un nombre puesto entre comas** (una mayúscula después de una coma y antes de un signo: así se
  nombra a alguien por escrito). A *"hola luma"* contesta *"hola!!"*.

### Con qué está hecho, y a quién se le debe

El ensamblado de Luma lo hace **PDP**, el ensamblador propio de Janax. PDP arma el idioma de Janax, y un programa de
Janax no puede escribir fuera de su carpeta: crear carpetas y accesos directos lo tiene que hacer algo que le hable
a Windows. Esas dos piezas, igual que el núcleo, están ensambladas con **flat assembler (FASM)**, de Tomasz Grysztar,
software libre: <https://flatassembler.net>. Nada sale gratis: gracias.

### Lo que se probó

- Instalación en una carpeta con espacios en el nombre: 29 segundos, 343 piezas de conocimiento, los dos accesos
  directos bien apuntados.
- Su núcleo corta lo que se le pasa en cada espacio, y una carpeta puede llamarse *"Juan Perez"*: por eso se lo
  arranca parado en su propia carpeta y se le pasa sólo el nombre del programa.
- El lanzador: despertarla (al frente y maximizada), segundo clic (sigue habiendo una), señal de dormir (renace sola,
  por detrás), cerrarla (no queda nada corriendo).
- Instalación sobre la Luma de su autor conservando lo que sabe: los mismos 438 archivos y 104 MB antes y después.

### Lo que todavía no

- **Windows puede frenar el instalador** (*"Windows protegió su PC"*): el programa no está firmado. Se pasa con
  *"Más información"* → *"Ejecutar de todas formas"*.
- No se probó en otra computadora, ni con una carpeta de nombre con acentos u otras letras.
- Al renacer después de dormir no vuelve al tamaño de la pantalla.
- No tiene desinstalador: se borran las dos carpetas y los dos accesos directos.
- Todavía no pone el nombre de quien le habla en lugar del que saca: para eso tiene que aprenderlo.
- Lo que contesta desde sus libros sigue sin tener que ver con la pregunta; Tab sigue pendiente.

### Dónde está

- `instalador/`: `instalar-luma.exe`, `LEEME.txt` y `datos/` (su núcleo, `luma.exe`, la semilla de su ensamblador, su
  fuente y su conocimiento empacados). Junto al release va también como `instalar-luma.zip`.
- `razar/instalador/`: `instalar.asm`, `luma.asm` y `armar_instalador.py`, que arma la carpeta de arriba.
- `razar/cuerpo/gen_leer.py`: `r_names_out`.
