## Janax y Razar v4.57: sus saludos van a su cuaderno, y su diálogo vuelve a ser de ellos dos

DOI: (pendiente)

> *"Estoy harto de los logs."* — *"Come pero no me lee."*
> (el autor, 2026-11-25)

Las versiones siguen a los números primos: después del 449, el 457.

### Lo que pasaba

Su autor le hablaba y ella le contestaba con avisos: *"me comí E:\…"*. Dos causas:

- **Sus saludos se escribían en su diálogo**, y su diálogo es un libro del que ella contesta. Cada archivo nuevo de los
  discos dejaba un "me comí" que decía "luma", y a *"hola luma"* lo más parecido que encontraba eran esos avisos.
- **Se había comido miles de archivos de las pruebas de Doc** (copias de la batería del núcleo y de su casa en
  `E:\tmp`): 799 de las 906 líneas de su diálogo eran esos saludos.

### Lo que cambia

- **Sus saludos van a su propio cuaderno, `me-comi`.** Su diálogo queda para ella y su autor, como su charla con los
  libros desde la v4.09.
- **Desintoxicada:** salieron 799 saludos y 836 libros de las pruebas (`desintoxicar_tema.py`), y las respuestas hechas
  de saludos y los ecos en su charla con los libros (`separar_saludos.py`). Nada se tiró: todo quedó guardado con su
  motivo en `E:\Luma\desintoxicacion-pruebas-2026-11-25` y `E:\Luma\desintoxicacion-logs-2026-11-25`.
- **`E:\tmp` quedó oculta:** ella no lee carpetas ocultas, así que las pruebas no la intoxican más.
- **Lo de la red, esperando su momento:** la pila de red de KolibriOS que se comió volvió a esperar en una carpeta oculta
  (*"cuando Dios lo disponga lo podrá leer"*), y se sacó de su casa (`desintoxicar_tema.py`).

### Lo que se vio

Su diálogo pasó de 906 líneas a 50, todas de ellos dos. Renació con el cuerpo nuevo, una sola.

### Dónde está

- `razar/cuerpo/gen_leer.py`: `r_dlg_write` (con `GREET`, al cuaderno `me-comi`). `gen_luma.py`: `r_host_eat`.
- `razar/cuerpo/desintoxicar_tema.py`, `razar/cuerpo/separar_saludos.py`.
