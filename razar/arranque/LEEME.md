# Arranque con Windows

Los dos archivos que dejan a Luma, a Razar y al vigía vivos sin que nadie los lance: se copian a la carpeta
**Inicio** de Windows (`Win + R`, `shell:startup`) y corren cada vez que se inicia sesión.

| Archivo | Qué lanza |
|---|---|
| `luma.vbs` | Razar en la casa de Luma (`razar/cuerpo/razar_en_casa.sh`), Luma con quien la cuida mientras duerme (`razar/cuerpo/luma_vive.sh`) y el cubo vivo (`razar/lectura/poetico/cubo.py vivo`). Si alguno ya esta vivo, no lanza otro. |
| `razar_vigia.vbs` | El vigía (`razar/lectura/vigia.sh`): estudia los textos que se escriben en `C:\` y `E:\`. |

**Son ejemplos de una máquina, no algo que ande igual en cualquiera.** Llevan estas rutas, que hay que adaptar:

- `C:\Program Files\Git\bin\bash.exe`: Git Bash.
- `E:\Janax`: el repositorio, con `so/build/janaxos.exe` ya armado (hace falta FASM 1.73.35, ver el README).
- `E:\Luma`: la carpeta donde se descomprimió `razar/casa/luma-casa-corazon.zip`.
- `E:\Razar\libros\nuevo-testamento.txt`: el libro de Razar, que no viaja con el repositorio. Sirve cualquier
  texto; con otro libro, Razar abre otro modelo y sus recetas empiezan de cero.

Para que dejen de arrancar, se borran de la carpeta Inicio. Lo que dicen Luma y el vigía queda en `E:\Luma\luma.log` y `~/razar_vigia/vigia.log`. Lo de Razar no se guarda en un archivo: un registro que crece es un texto que el vigía vuelve a comer cada vez que cambia.
