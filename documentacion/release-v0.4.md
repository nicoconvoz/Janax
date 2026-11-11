## Janax y Razar v0.4: la caja de cambios

**Razar hace el mismo trabajo con la mitad de las instrucciones, y aprende exactamente lo mismo.**

Primero se midió dónde se le iba el tiempo: un kernel de medición (`FASM -d PERFIL=1`) contó cuántas veces corre cada
palabra del programa. La sorpresa: más del 80 % no era pensar, era **escribir y leer su propio cuaderno**, letra por
letra, y pasarlo en limpio entero en cada pedazo del libro. Dos ideas del Capitán lo arreglaron: **escribir de un tirón**
(una letra, una palabra o una línea, del tamaño que haga falta) y **escribir solo la diferencia** (un diario).

| Paso (Wikipedia de 2,3 MB) | Instrucciones | Cuánto bajó | Segundos leyendo |
|---|---|---|---|
| v0.3 | 13.939.913.762 | — | — |
| Bucles hechos a mano → while rotado (`jwcheck`) | 13.140.899.149 | −5,7 % | — |
| Cinco instrucciones nuevas | 13.055.693.102 | −0,65 % | 12,5 s |
| **Escribir de un tirón** (`put_span`) | 9.953.261.322 | −23,8 % | 10,8 s |
| **Escribir solo la diferencia** (el diario) | **6.767.642.469** | −32 % | **7,8 s** |
| **Total** | **la mitad** | **−51,5 %** | **−38 %** |

- **Lo mismo, bit por bit:** en cada paso el juez contra el MATS da idéntico; con el diario, los lugares tienen las mismas
  líneas (en otro orden) y las 293.292 parejas, los mismos totales.
- **Cómo se midió:** las instrucciones las cuenta el kernel (exactas, sin ruido); los segundos, con milisegundos y tres
  corridas de cada versión.

### Lo que trae

- **El idioma:** `jwcheck` (la condición del while escrita a mano), y cinco instrucciones nuevas, ideas del Capitán:
  - `jjn`/`jjnn`: la diferencia es la respuesta.
  - `jldadd`: el álbum que suma mirando.
  - `jldx`: la cuenta mientras lee.
  - `jcall0`: el cero nace con la vuelta.

  Están en los cinco motores (intérprete y traductores x86 y ARM64; intérprete, rutinas y nativo del kernel), en el
  ensamblador PDP y en FASM.
- **El kernel:**
  - el kernel de medición;
  - el pedido 38 acepta `a = −1` ("andá al final"), para escribir un diario sin leerlo.
- **Razar:**
  - 681 bucles hechos a mano pasan a while rotado;
  - `put_span` escribe de un tirón;
  - `lugares` solo crece;
  - `nitidas` es un diario: una pareja es la suma de sus líneas.

  Una casa de la v0.3 no pierde nada: su `nitidas0`/`nitidas1` se convierte en el diario la primera vez.
- **Herramientas:**
  - `bucles_janax.awk`: lista los bucles que no son while;
  - `rotar_janax.py`: los convierte;
  - `modismos_janax.py`: usa las instrucciones nuevas donde el resultado es idéntico.

### Cómo se probó

- **Suite del sistema operativo:** 377 bien, 0 mal.
- **Escalón 0:** 210 bien, 0 mal, con el intérprete, el traductor x86 y **ARM64 en un teléfono real** (Moto E7 Plus).
- **Pruebas propias de Razar:** 22 de 22.

### Lo que no está medido

Los 31 minutos de los 20 MB son de la v0.3: con la v0.4 no se volvieron a correr. Leer `lugares` entero en cada pedazo,
con sus claves en hexadecimal, sigue siendo el costo más grande.

---
**English:** v0.4 makes Razar do the same work with half the instructions, and it learns exactly the same thing. A
measuring kernel showed that over 80 % of the run was writing and reading its own notebook one character at a time,
rewriting it whole on every piece. Writing in spans and writing only the difference (an append-only diary) took the
2.3 MB Wikipedia run from 13.94 to 6.77 billion instructions. Its reading time went from 12.5 s to 7.8 s. At every step,
the MATS judge gives identical results. The release also brings `jwcheck` and five new instructions in all five engines,
tested on x86 and on a real ARM64 phone.
