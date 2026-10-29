# Janax OS — lo construido

**Estado al 2026-10-28: escalón S1, modo simbiosis sobre Windows x86-64.** Código en `so/janaxos.asm`
(FASM). Las ideas y su porqué están en `ideas.md`.

## Qué hace

```bash
so/build/janaxos.exe programa1.bin programa2.bin ...
```

1. **Arranque que reconoce el modo.** Windows arranca todo programa con `rcx` = su bloque de proceso (PEB),
   el mismo puntero que guarda en `gs:[60h]`; UEFI arranca una imagen con `rcx` = su handle y `rdx` = su
   tabla de sistema. Si coinciden, es **simbiosis**. El modo cero todavía no está construido (se detiene).
2. **Un camarote por programa**: registros propios, 1 MiB de memoria de datos propia y pila de retorno
   propia. Un proceso que falla termina solo él, con su código; los demás siguen.
3. **Planificador del Capitán ("nada de lo corto pendiente, poco de lo largo")**: **menor servicio
   recibido** (LAS). Corre el proceso que menos tiempo recibió hasta ahora, así lo corto termina primero
   sin saber de antemano cuánto dura cada uno. **No hay turno fijo**: el que corre sigue hasta pasar al
   siguiente menos atendido, o hasta el final si está solo. El tiempo se cuenta en instrucciones.

4. **El turno lo da la prioridad real (Capitán: "que la prioridad le dé el % real", nada fijo).** Cambiar
   de proceso cuesta `c` instrucciones. El que corre (servicio `s`) sigue mientras la ventaja del que
   espera (`D` de servicio menos) no pague el cambio: `(t − D)·t ≥ c·(s + t)`, o sea
   **t = ((D + c) + √((D + c)² + 4·c·s)) / 2**, nunca menos que `D + 1`. Un recién llegado con poco
   servicio entra casi enseguida; dos iguales reciben turnos que crecen como `√(c·s)` y el desperdicio cae
   solo. Con `c = 0` es el LAS puro.
5. **El núcleo mide `c` al arrancar** en la máquina donde le toca vivir (idea 2: aprender del entorno):
   corre un bucle de calibración solo y de a dos con `c = 0`, el mínimo de tres corridas cada uno, y
   despeja cuántas instrucciones cuesta un cambio. La variable `JANAX_CAMBIO` lo fija (para pruebas).

6. **La ventanilla (Capitán: "mínimas pantallas posibles, cada una cambia de sintonía; los pedidos se
   sintonizan en una pantalla y con el tiempo pueden cambiar de pantalla y de sintonía").**
   - El programa deja su **cola de pedidos** en su camarote y toca la ventanilla **una sola vez** con la
     instrucción nueva `jsys rd, ra` (op `16h`): `ra` = dirección de la cola, `rd` = pedidos atendidos.
     Cola: cantidad (8 bytes) y una entrada de 32 bytes por pedido: tipo, `a`, `b`, respuesta. Al volver,
     cada entrada tiene su respuesta y la cantidad queda en 0.
   - Tipos: **1 escribir** (`a` = dirección, `b` = bytes; responde `b`), **2 crecer** el camarote (`a` =
     bytes; responde el tamaño nuevo), **3 achicarlo** (`a` = bytes; responde el tamaño nuevo, nunca por
     debajo del fin de la cola, para que las respuestas tengan dónde ir). Otro tipo: responde −1.
   - Una **pantalla** atiende una sola sintonía y la atiende **en lote**: todas las escrituras de la ronda
     salen en **una sola llamada** al anfitrión.
   - **Mínimas pantallas**: un tipo que ya tiene su pantalla la conserva; uno que no tiene toma una
     pantalla que no recibió nada en esta ronda (la **resintoniza**), y solo si no hay ninguna se abre otra.
     Nunca hay más pantallas que tipos distintos al mismo tiempo. Cada ronda es un toque de la ventanilla:
     ningún reloj.
   - Dentro de un tipo se respeta el orden de la cola.
   - Al terminar, si hubo pedidos: `ventanilla: pantallas=N resintonias=R llamadas al anfitrion=L pedidos=P`.

Salida: `modo: simbiosis`, `costo de cambio: <c> instrucciones (medido|fijado)` y una línea por proceso
cuando termina:

```
P<n> codigo=<código> j0=<16 hex> t=<instrucciones ejecutadas por todo el sistema hasta ese momento>
```

Códigos de proceso: los del intérprete (0, 1, 2, 5, 6, 7, 8). El núcleo sale con 0, 3 (no pudo leer un
programa) o 4 (sin programas).

## Cómo se prueba

```bash
bash so/pruebas/correr.sh
```

14/14. Ventanilla: escribir; **tres escrituras en una sola llamada**; **dos sintonías en la misma ronda →
dos pantallas** (y una escritura en el viejo tope prueba que el camarote creció); **la pantalla cambia de
sintonía** entre rondas (1 pantalla, 1 resintonización); tipo desconocido (−1, sin pantalla); cola fuera del
camarote (código 5); achicar no pasa el fin de la cola.

Planificador (con `c` fijado, salvo uno): un proceso; **lo corto primero** (un proceso largo puesto primero en la fila y dos cortos:
terminan los cortos en t=6 y t=9 y el largo en t=3010, exactamente lo que da la regla calculada a mano); un
proceso que rompe solo lo suyo; **camarotes separados** (dos procesos escriben la misma dirección mientras
se alternan y cada uno lee su propio valor); **la prioridad decide el turno** (con `c = 4` la fórmula da
turnos de 4 y 8, calculados a mano); **costo medido** (los resultados no cambian aunque `c` cambie de
máquina en máquina); y sin programas.

⚠️ El corredor tenía un error: leía el código de salida de `tr` y no del núcleo, así que los códigos no se
verificaban. Lo destapó el caso "sin programas"; corregido.

## Mediciones

Programa `suma_100m` (300 millones de instrucciones), intérprete del escalón 0 como referencia:

| Caso | Tiempo |
|---|---|
| Intérprete, dos copias una detrás de la otra | ~2.290 ms |
| Janax OS, un proceso | ~1.430 ms (igual que el intérprete solo) |
| Janax OS, dos procesos iguales, LAS puro (cambio cada ~2 instrucciones) | ~4.570 ms |
| **Janax OS, dos procesos iguales, turno por prioridad real** | **~2.200–2.500 ms** |

Con el turno por prioridad, compartir el procesador cuesta lo mismo que correr uno detrás del otro, y
siguen siendo justos: los dos terminan separados por menos de 40.000 instrucciones sobre 600 millones.
El `c` medido varió entre **5,8 y 9,7 instrucciones** en tres arranques (ruido de Windows): anotado, a
mejorar si hace falta.

## Pendiente

- Medición de `c` más estable (hoy varía entre arranques).
- Los procesos corren en el intérprete: llevarlos al traductor nativo.
- Ventanilla: más tipos de pedido (archivos), y medir cuánto ahorra el lote con programas reales.
- `jsys` existe solo dentro de Janax OS: el intérprete y los traductores del escalón 0 lo toman como opcode
  desconocido.
- La campana (0..1), los porteros y la cubierta.
- Modo cero.
