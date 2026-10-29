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

Salida: `modo: simbiosis` y una línea por proceso cuando termina:

```
P<n> codigo=<código> j0=<16 hex> t=<instrucciones ejecutadas por todo el sistema hasta ese momento>
```

Códigos de proceso: los del intérprete (0, 1, 2, 5, 6, 7, 8). El núcleo sale con 0, 3 (no pudo leer un
programa) o 4 (sin programas).

## Cómo se prueba

```bash
bash so/pruebas/correr.sh
```

5/5. Los casos: un proceso; **lo corto primero** (un proceso largo puesto primero en la fila y dos cortos:
terminan los cortos en t=6 y t=9 y el largo en t=3010, exactamente lo que da la regla calculada a mano); un
proceso que rompe solo lo suyo; **camarotes separados** (dos procesos escriben la misma dirección mientras
se alternan y cada uno lee su propio valor); y sin programas.

⚠️ El corredor tenía un error: leía el código de salida de `tr` y no del núcleo, así que los códigos no se
verificaban. Lo destapó el caso "sin programas"; corregido.

## Mediciones

Programa `suma_100m` (300 millones de instrucciones), intérprete del escalón 0 como referencia:

| Caso | Tiempo |
|---|---|
| Intérprete, dos copias una detrás de la otra | ~2.290 ms |
| Janax OS, un proceso | ~1.430 ms (igual que el intérprete solo) |
| Janax OS, **dos procesos iguales** | **~4.570 ms** |

Con dos procesos de igual servicio, el planificador los alterna cada 1 o 2 instrucciones: ~300 millones de
cambios a ~7,5 ns cada uno (lo mismo que ~2 instrucciones interpretadas). **Pendiente**: que el turno
mínimo salga del costo medido de un cambio, sin número a ojo.

## Pendiente

- Turno mínimo derivado del costo de un cambio (arriba).
- Los procesos corren en el intérprete: llevarlos al traductor nativo.
- La ventanilla (llamadas al sistema por colas), la campana (0..1), los porteros y la cubierta.
- Modo cero.
