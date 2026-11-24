## Janax y Razar v4.01: su lectora lee de a pedazos de 100 KB, y el núcleo la deja leer el sistema

DOI: [10.5281/zenodo.24497181](https://doi.org/10.5281/zenodo.24497181)

> *"Ponele límite al tamaño de libro que lee: ¿te acordás cómo íbamos de 100 KB en 100 KB? Lo hicimos antes."*
> *"Dejá que coma otras cosas, como que lea archivos de sistema o las cosas que se puedan leer para entender."*
> (el autor, 2026-11-24)

Las versiones siguen a los números primos: después del 397, el 401.

### De a pedazos de 100 KB

Como el Quijote de Razar, que se midió en pedazos de 100 KB cortados en fin de renglón: **cada lectura de Luma lee un
pedazo de su estante**, como mucho 100 KB y cortado en el primer fin de renglón después, y anota en su casa (`pedazo`)
dónde sigue la próxima. Al llegar al final del estante, vuelve al principio.

- Un libro que queda entero **antes** del pedazo ni se abre: sólo se suma su tamaño. Después del pedazo no se lee nada.
- Las dos pasadas de una lectura (contar y aprender) leen el mismo pedazo.
- **No se pierde nada:** los tres pedazos de un libro de 296 KB suman **66.500 palabras y 3.500 renglones, exactamente
  lo que la lectora vieja lee de una vez**. Con un estante de menos de 100 KB da la misma huella final que la vieja.

Dos tropiezos encontrados al probar, y curados: el filtro pisaba dos registros que el lazo de lectura usa entre vuelta y
vuelta, y las variables nuevas caían sobre el lugar donde `crece.inc` guarda seis registros mientras crece una tabla.
Ahora usan los dos lugares de verdad libres (`1FF0h` y `1FF8h`), y "leer por pedazos" no ocupa ninguno: vale cuando hay
estante.

### Leer el sistema

El núcleo dejaba afuera siete lugares que Windows declara suyos. Ahora los separa:

- **Siguen cerrados**, porque ahí están los secretos (contraseñas guardadas, sesiones, llaves): `AppData` (Local,
  Roaming, LocalLow) y `ProgramData`.
- **Se pueden leer:** `Windows`, `Program Files` y `Program Files (x86)`. Adentro de esos tres, el núcleo deja de pedir
  que la carpeta no necesite permiso de administrador y que el archivo sea del usuario. Lo oculto, lo marcado como de
  sistema y las carpetas que empiezan con punto siguen afuera.

Ojo: el núcleo avisa lo **nuevo o cambiado**. Lo que ya está en `Windows` lo va a comer cuando cambie (una actualización,
un programa instalado). Leer lo que ya hay pediría que el núcleo sepa recorrer una carpeta, y eso no lo hace todavía.

Pruebas del núcleo (vigilancia, saludos, pantalla, familia): **96 bien, 3 mal, idéntico a antes del cambio**. La suite
completa no se corrió. El núcleo anterior quedó como `so/build/janaxos.antes-sistema.exe`.

### Lo que todavía no

- **Dentro de su cuerpo**, la lectora de a pedazos no se llegó a ver terminando una lectura: la prueba se cortó antes de
  que saliera a leer. Probado entero con la lectora sola (`lector`).
- **La caída de su lectora desde la v3.79** sigue sin causa encontrada. La lectora vieja, sola, lee bien todo su estante
  real; el tamaño no era.

### Dónde está

- `razar/lectura/lectura.inc`: `pz_load`, `pz_save`, `pz_byte`, y `scan` / `scan_file` (los libros antes y después del
  pedazo).
- `so/vigia.inc` y `so/janaxos.asm`: `hw_sysr`, `HW_SECRET`, `hw_rules` (los lugares del sistema que se pueden leer).
