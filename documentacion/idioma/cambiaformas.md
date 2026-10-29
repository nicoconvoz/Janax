# El Cambiaformas

**Fecha:** 2026-10-28 · **Idea y nombre:** Capitán

El arranque de Janax se convierte en el procesador donde le toca vivir: conoce el mecanismo de cada
instrucción Janax en cada familia, asocia las instrucciones nuevas del procesador con las que cumplen el
mismo rol, y cuando no conoce un camino, lo busca, lo verifica y lo adopta en tiempo de ejecución.

## 1. Mapa de equivalencias (v0)

Mecanismo de cada instrucción Janax y su equivalente base en cada familia. **Dif.** marca dónde el
procesador NO hace lo mismo que Janax y el traductor tiene que corregirlo.

| Janax | x86-64 | ARM64 | RISC-V (RV64IM) | Dif. |
|---|---|---|---|---|
| `jadd`/`jsub` | `ADD`/`SUB` | `ADD`/`SUB` | `ADD`/`SUB` | — |
| `jmul` | `IMUL r64, r/m64` | `MUL` | `MUL` | — (64 bits bajos en las tres) |
| `jdiv` | `IDIV` | `SDIV` | `DIV` | **x86** interrumpe con /0 y con MIN/−1 → verificar ambos antes. **RISC-V** da −1 con /0 → forzar 0. ARM64 ya da 0 y MIN. |
| `jshl`/`jshr`/`jsar` | `SHL`/`SHR`/`SAR` con `CL` | `LSLV`/`LSRV`/`ASRV` | `SLL`/`SRL`/`SRA` | — (las tres usan los 6 bits bajos); x86 obliga a usar `CL` |
| `jand`/`jor`/`jxor` | `AND`/`OR`/`XOR` | `AND`/`ORR`/`EOR` | `AND`/`OR`/`XOR` | — |
| `jldi` | `MOV r64, imm32` | `MOVZ`/`MOVN` | `ADDI` (12 bits) o `LUI`+`ADDI` | RISC-V no carga 16 bits en una instrucción |
| `jshi` | `SHL 16` + `OR` | `LSL 16` + `ORR` | `SLLI 16` + `ORI`/`OR` | — |
| `jjmp` | `JMP` | `B` | `JAL x0` | — |
| `jjz`/`jjnz` | `TEST` + `JZ`/`JNZ` | `CBZ`/`CBNZ` | `BEQ`/`BNE` contra `x0` | — |
| `jld`/`jst` | `MOV` | `LDR`/`STR` | `LD`/`SD` | Janax exige alineación a 8: RISC-V puede atrapar o emular accesos desalineados |
| `jldb`/`jstb` | `MOVZX`/`MOV r8` | `LDRB`/`STRB` | `LBU`/`SB` | — |
| `jcall`/`jret` | `CALL`/`RET` | `BL`/`RET` | `JAL ra`/`JALR` | **Janax tiene pila de retorno separada**: x86 guarda la vuelta en la pila de datos → el traductor mantiene su propia pila de retorno (como la *shadow stack* de Intel CET) |
| (todas) | — | — | — | Janax revisa límites de memoria y profundidad de llamadas; ningún procesador lo hace solo |

## 2. Mecanismos por patrón: instrucciones que cumplen el rol de varias

El Cambiaformas no traduce solo instrucción por instrucción: reconoce **patrones** de Janax y los asocia
con una instrucción del procesador que hace el mismo trabajo junto.

| Patrón Janax | Rol | x86-64 | ARM64 | RISC-V |
|---|---|---|---|---|
| `jldi` + 3 × `jshi` | constante de 64 bits | `MOV r64, imm64` (una) | `MOVZ` + 3 × `MOVK` | `LUI`/`ADDI`/`SLLI` en cadena |
| `jmul` + `jadd` | multiplicar y sumar | `IMUL` + `ADD` | `MADD` (una) | `MUL` + `ADD` |
| `jshl` (1–3) + `jadd` | índice escalado | `LEA` (una) | `ADD` con `LSL` (una) | `SH1ADD`/`SH2ADD`/`SH3ADD` con extensión Zba |
| `jxor` −1 + `jand` | y-no | `ANDN` con extensión BMI1 | `BIC` (una) | `ANDN` con extensión Zbb |
| `jshl` por registro | desplazar sin tocar banderas | `SHLX` con extensión BMI2 (cualquier registro, no solo `CL`) | `LSLV` | `SLL` |

## 3. Cómo se adapta en cada arranque

1. **Catálogo de candidatos.** Cada mecanismo (instrucción o patrón) tiene una lista de secuencias
   candidatas por familia, cada una con la **capacidad** que necesita (bit de CPUID, HWCAP de ARM,
   extensiones de RISC-V). El catálogo es **datos**, no código.
2. **Filtrar por capacidad.** Quedan solo los candidatos que el procesador declara soportar. Nunca por
   modelo.
3. **Verificar contra el intérprete.** Cada candidato corre una batería de vectores (las pruebas de
   `escalon0/pruebas` más valores de borde: 0, −1, MIN, MAX, desplazamientos 0/63/64/65) y su resultado se
   compara **bit por bit** con el intérprete de referencia. El que difiere en un solo bit queda afuera.
4. **Medir.** Entre los verificados, se cronometra cada uno y gana el más rápido **en esta máquina**.
5. **Guardar.** La elección y la traducción quedan en disco con la huella del juego y del procesador; el
   próximo arranque no repite nada mientras las huellas no cambien.

## 4. Cuando no conoce el camino: lo rediseña en ejecución

Una sola verdad técnica: el procesador dice **qué** instrucciones tiene, nunca **qué hacen**. Por eso lo
nuevo no se adivina; se descubre probando:

- **Búsqueda de caminos (superoptimización).** Para un mecanismo, el Cambiaformas arma combinaciones cortas
  de las instrucciones que el procesador tiene, las verifica contra el intérprete y adopta la que da
  idéntico y corre más rápido. Es la técnica de Massalin (1987) y de STOKE (Stanford): encuentra caminos
  que nadie escribió a mano.
- **Instrucción nueva con rol conocido.** Cuando una extensión nueva entra al catálogo con el rol que
  cumple (por ejemplo "multiplicar y sumar"), el Cambiaformas la prueba sola contra el intérprete en cada
  máquina que la tenga y la adopta si gana.
- **Lo aprendido se guarda** en el caché con la huella del procesador: la búsqueda se paga una vez por
  máquina, no en cada arranque.

## Abierto

- La verificación por vectores muestra que un candidato coincide en esos casos, **no lo demuestra para
  todos**. Para mecanismos chicos (una o dos instrucciones) se puede probar exhaustivamente o con un
  verificador formal; se decide cuando exista el traductor.
- Tiempo máximo de búsqueda en el primer arranque: se mide cuando exista, no se fija a ojo.
