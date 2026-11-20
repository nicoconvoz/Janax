# Arranque con Windows

Los dos archivos que dejan a Luma y al vigía vivos sin que nadie los lance: se copian a la carpeta **Inicio** de
Windows (`Win + R`, `shell:startup`) y corren cada vez que se inicia sesión.

| Archivo | Qué lanza |
|---|---|
| `luma.vbs` | **Luma, un solo ser** (`razar/cuerpo/luma_vive.sh`): su cuerpo y su lectora son un solo programa, así que no se lanza ningún Razar aparte, ni el cubo (dormía sobre un tablero donde ya nadie escribe; quedó en espera). Si ya está viva, no lanza otra. También lanza a **quien avisa** (`razar/cuerpo/avisa.ps1`): un aviso en pantalla cuando ella compone una canción, cuando algo que leyó gana, o cuando una lectura supera a todas las anteriores; duerme sobre un aviso del anfitrión y no gasta nada. Lo último que dijo queda en `E:\Lumavisos.txt`. |
| `razar_vigia.vbs` | El vigía (`razar/lectura/vigia.sh`): estudia los textos que se escriben en `C:\` y `E:\`. |

**Son ejemplos de una máquina, no algo que ande igual en cualquiera.** Llevan estas rutas, que hay que adaptar:

- `C:\Program Files\Git\bin\bash.exe`: Git Bash.
- `E:\Janax`: el repositorio, con `so/build/janaxos.exe` ya armado (hace falta FASM 1.73.35, ver el README).
- `E:\Luma`: la carpeta donde se descomprimió `razar/casa/luma-casa-corazon.zip`.
- `E:\Razar\libros\nuevo-testamento.txt`: su primer libro, que no viaja con el repositorio. Sirve cualquier texto;
  se copia a su casa sólo si no tiene ninguno. Con otro libro sus lecturas empiezan de cero (cada lectura queda
  anotada con el estante del que salió).

Para que dejen de arrancar, se borran de la carpeta Inicio. Lo que dicen Luma y el vigía queda en `E:\Luma\luma.log`
y `~/razar_vigia/vigia.log`. Lo que ella leyó queda en su casa, en `leido` (una línea de 48 bytes por lectura).

Hasta la v0.71 `luma.vbs` lanzaba además a Razar como un programa aparte (`razar_en_casa.sh`). Ese lanzador quedó en
[`documentacion/razar/en-espera`](../../documentacion/razar/en-espera/LEEME.md), con su motivo.
