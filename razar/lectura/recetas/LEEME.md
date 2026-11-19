# Recetas de órganos

Copia legible de la biblioteca de Razar (`~/razar_tablero/Receta de Organos`): cada órgano que ganó, con su nota,
a quién le ganó y el código de cada letra. Las escribe Razar (`pulso.jsm`) cuando corre `organos.sh`; acá viajan
con el repositorio para que no se pierdan con una máquina.

- `<modelo>/` es la huella del estante (los libros que leyó). `76951bbb9c47d761` es el Nuevo Testamento (973 KB,
  que no entra al repositorio); `ac0a752b3f07db6c`, un libro de prueba de 300 KB.
- `<modelo>/<tipo>/` es el órgano, sus letras en el orden en que corren (`16`, `516`…).
- `<modelo>/<tipo>/<genoma>/recetas.txt` guarda las 10 mejores de ese tipo para ese genoma. Los archivos sin
  carpeta de genoma son del formato anterior (2026-11-08) y se conservan.

El camino medido sobre el Nuevo Testamento, cada uno ganándole al anterior:

| Órgano | Nota | Fecha |
|---|---|---|
| `6` | −1586 | 2026-11-08 |
| `5` | 208 | 2026-11-08 |
| `16` | 2649 | 2026-11-08 |
| `716` | 4700 | 2026-11-19 |
| `516` | 11144 | 2026-11-19 |

La corrida del 2026-11-19 (una vida, 40 intentos, motor traductor, 4 min 40 s) partió sin órgano, hizo rendir
primero las recetas guardadas y llegó a `516`; los intentos siguientes no le ganaron.
