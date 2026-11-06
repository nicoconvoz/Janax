#!/usr/bin/env bash
# Janax OS tests (symbiosis mode, on this PC).
# Each case runs janaxos.exe with some Janax programs and compares its whole output and exit code.
# JANAX_SOLO=<pattern> runs only the cases whose name matches it (Capitan: while building, only the area being
# touched); the whole suite runs once, before saving.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
raiz=$(dirname "$aqui")
proyecto=$(dirname "$raiz")
fasm=${FASM:-/e/DevCache/fasm/FASM.EXE}            # FASM 1.73.35 (FASM=... to use another place)
export INCLUDE="${INCLUDE:-E:/DevCache/fasm/INCLUDE}"
salida="$raiz/build"
mkdir -p "$salida"

if ! "$fasm" "$raiz/janaxos.asm" "$salida/janaxos.exe" > "$salida/janaxos.log" 2>&1; then
  echo "janaxos.asm no ensambla:"; cat "$salida/janaxos.log"; exit 1
fi
# The Janax programs, built by the PDP assembler on Janax OS (no FASM for Janax): from its seed, to its own
# fixed point, then every test program.
bash "$raiz/herramientas/armar.sh" "$salida/janaxos.exe" "$salida" "$aqui"/*.jsm "$proyecto"/escalon0/pruebas/{02_ldi,04_suma,19_opcode_invalido}.jsm "$proyecto"/razar/cardumen/cardumen.jsm "$proyecto"/razar/cardumen/cardumen_olas.jsm "$proyecto"/razar/cardumen/voluntad.jsm "$proyecto"/razar/cardumen/cardumen_lazo.jsm || exit 1
bin() { cygpath -m "$salida/$1.bin"; }
# One rower: every case below expects the exact order and clock of a single rower. The rowers in parallel
# have their own cases (each cabin's result, whatever the order).
export JANAX_REMOS=1
archivos="$salida/archivos"           # the system's own folder for files, empty at every run
export JANAX_ARCHIVOS="$(cygpath -m "$archivos")"

ok=0; mal=0
# The whole suite runs once per engine: the routines, the reference interpreter and the routines translated
# to native code (the default). The expected outputs are exact, so all of them passing means all give the same
# results, turn cuts included.
for motor in rutinas interprete traductor; do
export JANAX_MOTOR=$motor
rm -rf "$archivos" "$salida"/archivos_* "$salida"/familia_*/
# toca <name>: true when the check of that name runs (JANAX_SOLO matches it, or there is no JANAX_SOLO)
toca() { [ -z "${JANAX_SOLO:-}" ] || [[ "$1" =~ $JANAX_SOLO ]]; }
# caso <name> <switch cost, or "" to let the kernel measure it> <expected exit code> <expected output> <program>...
caso() {
  local nombre=$1 cambio=$2 cod=$3 esp=$4; shift 4
  toca "$nombre" || return 0
  local args=() p
  for p in "$@"; do
    case "$p" in
      *[@!]*) args+=("$(bin "${p%%[@!]*}")${p#"${p%%[@!]*}"}") ;;   # program@permissions!bolita
      *)   args+=("$(bin "$p")") ;;
    esac
  done
  local got c
  if [ -n "$cambio" ]; then
    got=$(JANAX_CAMBIO=$cambio JANAX_ARCHIVOS="${carpeta:-$JANAX_ARCHIVOS}" timeout 30 "$salida/janaxos.exe" "${args[@]}"); c=$?   # the kernel's code, not a pipe's
  else
    got=$(env -u JANAX_CAMBIO timeout 30 "$salida/janaxos.exe" "${args[@]}"); c=$?
  fi
  got=${got//$'\r'/}
  [ "$motor" = traductor ] && got=$(printf '%s\n' "$got" | grep -v '^nativo: ')   # its own count: tried by "nativo"
  if [ "$c" = "$cod" ] && [[ "$got" == $esp ]]; then
    ok=$((ok + 1))
  else
    echo "MAL  [$motor] $nombre: esperaba codigo $cod y"; echo "$esp"; echo "     dio codigo $c y"; echo "$got"
    mal=$((mal + 1))
  fi
}
fijo0="modo: simbiosis
costo de cambio: 0.00 instrucciones (fijado)"
familia() {   # familia <folder> <child program>
  rm -rf "$salida/$1"; mkdir -p "$salida/$1"
  cp "$salida/$2.bin" "$salida/$1/68696a6f"
  carpeta=$(cygpath -m "$salida/$1")
}

caso "un proceso" 0 0 "$fijo0
P0 codigo=0 j0=000000000000002A t=2" 02_ldi

# The translated engine says how many instructions of the programs became native code (nativo.inc): all
# but jhalt, jdiv and the windows, which keep their routine.
if [ "$motor" = traductor ] && toca "nativo"; then
  got=$(JANAX_CAMBIO=0 timeout 30 "$salida/janaxos.exe" "$(bin largo_1000)" "$(bin 02_ldi)" | tr -d '\r' | grep '^nativo: ')
  if [ "$got" = "nativo: 8 de 10 instrucciones" ]; then ok=$((ok + 1)); else echo "MAL  [$motor] nativo: dio '$got'"; mal=$((mal + 1)); fi
  got=$(JANAX_CAMBIO=0 timeout 30 "$salida/janaxos.exe" "$(bin llamadas_hondas)" | tr -d '\r' | grep '^nativo: ')
  if [ "$got" = "nativo: 12 de 13 instrucciones" ]; then ok=$((ok + 1)); else echo "MAL  [$motor] nativo con llamadas: dio '$got'"; mal=$((mal + 1)); fi
fi

# The cabins row in the order they arrive, each its own turn (remos.inc). With switch cost 0 every turn is
# 1 instruction (t = c p / (1 - p) rounds to 0, at least 1): a round, so the short ones finish soon.
caso "en ronda por orden de llegada" 0 0 "$fijo0
P1 codigo=0 j0=000000000000002A t=5
P2 codigo=0 j0=000000000000002A t=10
P0 codigo=0 j0=000000000007A314 t=3012" largo_1000 02_ldi 04_suma

# Switch cost 4 and the priority of a cabin that says nothing (0.99): its turn is t = c p / (1 - p) =
# 4 * 64881 / 655 = 396.2, so 397 instructions; the long one rows 397, then the short one ends.
caso "el turno sale de la prioridad y del costo" 4 0 "modo: simbiosis
costo de cambio: 4.00 instrucciones (fijado)
P1 codigo=0 j0=000000000000002A t=399
P0 codigo=0 j0=000000000007A314 t=3008" largo_1000 02_ldi

# The bolita from the command line (program!fraction): with p = 0.5 the turn is c p / (1 - p) = 4. The
# copy with 0.99 rows 397 per lap and ends first: 7 laps of 401, then 4 + 227 more = 3038; the other one
# rows alone what it has left, 3006 - 32, and ends at 6012.
caso "la bolita de la linea de comandos" 4 0 "modo: simbiosis
costo de cambio: 4.00 instrucciones (fijado)
P1 codigo=0 j0=000000000007A314 t=3038
P0 codigo=0 j0=000000000007A314 t=6012" 'largo_1000!0.5' largo_1000

# With bolita 1 the cabin rows to its end: the first one rows its 397, the second one all its 3006.
caso "bolita 1: rema hasta terminar" 4 0 "modo: simbiosis
costo de cambio: 4.00 instrucciones (fijado)
P1 codigo=0 j0=000000000007A314 t=3403
P0 codigo=0 j0=000000000007A314 t=6012" largo_1000 'largo_1000!1'

# Only as many rowers wake up as there is new work: with 4 rowers and 2 cabins nobody is woken for nothing
# (a cabin that comes back is taken again by its own rower; only a birth or a signature wakes one up).
JANAX_REMOS=4 caso "remeros: se despiertan segun el trabajo" 4 0 "modo: simbiosis
costo de cambio: 4.00 instrucciones (fijado)
P? codigo=0 j0=000000000007A314 t=*
P? codigo=0 j0=000000000007A314 t=*
remeros: 4, despertares en vano=0" largo_1000 largo_1000

# Request 20: a cabin asks for a bolita and gets at most the one it was launched with (like permissions).
caso "pedir bolita: nunca mas que la que le dieron" 0 0 "$fijo0
P0 codigo=0 j0=0000000000008000 t=*
ventanilla: *" 'bolita!0.5'

# A bolita that is not a fraction from 0 to 1 (or has something after it) does not start anything.
caso "bolita mal escrita: mas que 1" 0 4 "$fijo0" '02_ldi!1.5'
caso "bolita mal escrita: algo detras" 0 4 "$fijo0" '02_ldi!0.5x'
caso "bolita y permisos, en cualquier orden" 0 0 "$fijo0
P0 codigo=0 j0=000000000000002A t=3
P1 codigo=0 j0=000000000000002A t=4" '02_ldi!0.5@pm' '02_ldi@pm!0.25'

# A process that breaks only breaks its own cabin.
caso "un pasajero rompe lo suyo" 0 0 "$fijo0
P0 codigo=1 j0=0000000000000000 t=1
P1 codigo=0 j0=000000000000002A t=3" 19_opcode_invalido 02_ldi

# Same address in two processes that keep switching: each one sees only its own value.
caso "camarotes separados" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000007 t=41
P1 codigo=0 j0=0000000000000009 t=42" camarote_7 camarote_9

# The while: two copies taking turns of one or two instructions, so a turn ends at every point of the
# loop (also between the entry jump and the condition, which the routine engine runs as one routine).
# Per copy: 3 + entry jump + 10 laps * 3 + last check + jhalt = 36.
caso "while: el turno corta en cualquier punto" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000037 t=71
P1 codigo=0 j0=0000000000000037 t=72" while_suma while_suma

# The scheduler is a Janax program in PDP (PDP/so/nucleo/planificador.bin): anyone can change it. Without it
# the kernel uses the factory one; a broken one sends it back to the factory one.
plan_pdp() {   # plan_pdp <folder> <planner program>
  rm -rf "${salida:?}/${1:?}"; mkdir -p "$salida/$1"
  cp "$salida/$2.bin" "$salida/$1/5044502f736f2f6e75636c656f2f706c616e6966696361646f722e62696e"
  carpeta=$(cygpath -m "$salida/$1")
}
plan_pdp plan_largo planificador_largo
caso "planificador propio: turnos de 1 MiB, ya no se turnan" 0 0 "modo: simbiosis
planificador: el de PDP
costo de cambio: 0.00 instrucciones (fijado)
P0 codigo=0 j0=0000000000000037 t=36
P1 codigo=0 j0=0000000000000037 t=72" while_suma while_suma
plan_pdp plan_roto planificador_roto
caso "planificador propio roto: vuelve el de fabrica" 0 0 "modo: simbiosis
planificador: el de PDP
costo de cambio: 0.00 instrucciones (fijado)
planificador: el de PDP fallo, vuelve el de fabrica
P0 codigo=0 j0=0000000000000037 t=71
P1 codigo=0 j0=0000000000000037 t=72" while_suma while_suma
unset carpeta

# The last part: a turn spent with no more left to its jhalt than a switch costs does not pass the oar
# (without it, P0 would pass the oar with 4 left and end at t = 996).
caso "ultima parte: termina en vez de pasar el remo" 5 0 "modo: simbiosis
costo de cambio: 5.00 instrucciones (fijado)
P0 codigo=0 j0=00000000000001F2 t=500
P1 codigo=0 j0=00000000000001F2 t=1000" final_derecho final_derecho

caso "while: con costo de cambio" 3 0 "modo: simbiosis
costo de cambio: 3.00 instrucciones (fijado)
P0 codigo=0 j0=0000000000000037 t=36
P1 codigo=0 j0=0000000000000037 t=72" while_suma while_suma

# An instruction and the condition after it run as one routine: the turn may end between them, and a
# failure in the first one ends the process before the condition is counted.
caso "pareja fundida: el turno corta en cualquier punto" 0 0 "$fijo0
P2 codigo=5 j0=0000000000000000 t=12
P0 codigo=0 j0=0000000000006625 t=131
P1 codigo=0 j0=0000000000006625 t=132" fusion fusion fusion_falla

caso "pareja fundida: con costo de cambio" 3 0 "modo: simbiosis
costo de cambio: 3.00 instrucciones (fijado)
P0 codigo=0 j0=0000000000006625 t=64
P1 codigo=0 j0=0000000000006625 t=128
P2 codigo=5 j0=0000000000000000 t=132" fusion fusion fusion_falla

# Copies of one program share its words and its table; a program with the same length and one different
# word is another program.
caso "mismo largo, otro programa: no comparte" 0 0 "$fijo0
P1 codigo=0 j0=000000000000002D t=130
P3 codigo=0 j0=000000000000002D t=132
P0 codigo=0 j0=0000000000000037 t=137
P2 codigo=0 j0=0000000000000037 t=138" while_suma while_suma_9 while_suma while_suma_9

# A process is born without memory; its first order builds room 0.
caso "primera orden: construye el ambiente 0" 0 0 "$fijo0
P0 codigo=0 j0=0000000000001005 t=8" primera_orden

caso "sin primera orden no hay memoria" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000007 t=2" sin_primera_orden

caso "primera orden imposible" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000007 t=2" primera_orden_imposible

# The return stack weighs what it holds: it grows with the calls and shrinks between turns. Same limit.
caso "pila de retorno: honda, al limite y uno de mas" 0 0 "$fijo0
P1 codigo=7 j0=0000000000000000 t=36881
P0 codigo=0 j0=0000000000002000 t=94235
P2 codigo=0 j0=0000000000002000 t=94236" llamadas_hondas llamadas_demasiadas llamadas_hondas

caso "pila de retorno: con costo de cambio" 3 0 "modo: simbiosis
costo de cambio: 3.00 instrucciones (fijado)
P1 codigo=7 j0=0000000000000000 t=37028
P0 codigo=0 j0=0000000000002000 t=94091
P2 codigo=0 j0=0000000000002000 t=94236" llamadas_hondas llamadas_demasiadas llamadas_hondas

# Initial data: the file X.datos next to X is at the start of room 0 from the first order.
printf 'ˆwfUD3"' > "$salida/datos_iniciales.datos"
printf '16 bytes de datos' > "$salida/datos_no_entran.datos"
caso "datos iniciales: X.datos en el ambiente 0" 0 0 "$fijo0
P0 codigo=0 j0=1122334455667788 t=4" datos_iniciales

caso "datos iniciales que no entran" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000007 t=3" datos_no_entran

# The window to the host: a Janax OS process gets the smallest one, an empty catalog.
caso "ventanita: el catalogo de un proceso esta vacio" 0 0 "$fijo0
P0 codigo=0 j0=00000000FFFFFFFF t=18" ventanita_vacia

# Measured on this machine: the cost changes from machine to machine, the results must not.
caso "costo medido" "" 0 "modo: simbiosis
costo de cambio: *.* instrucciones (medido)
P* codigo=0 j0=000000000000000[79] t=*
P* codigo=0 j0=000000000000000[79] t=42" camarote_7 camarote_9

# The next boot on the same machine and kernel remembers it instead of measuring again.
caso "costo recordado" "" 0 "modo: simbiosis
costo de cambio: *.* instrucciones (recordado)
P0 codigo=0 j0=000000000000002A t=2" 02_ldi

caso "sin programas" 0 4 "$fijo0"

# --- the window: requests tuned to the fewest screens possible, served in batches ---
caso "ventanilla: escribir" 0 0 "$fijo0
hola
P0 codigo=0 j0=0000000000000005 t=17
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=1 pedidos=1" ventanilla_hola

caso "ventanilla: tres escrituras, una llamada" 0 0 "$fijo0
a
b
c
P0 codigo=0 j0=0000000000000003 t=27
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=1 pedidos=3" ventanilla_lote

caso "ventanilla: dos sintonias, dos pantallas" 0 0 "$fijo0
x
P0 codigo=0 j0=0000000100000000 t=21
ventanilla: pantallas=2 resintonias=0 llamadas al anfitrion=1 pedidos=2" ventanilla_dos_tipos

caso "ventanilla: la pantalla cambia de sintonia" 0 0 "$fijo0
y
P0 codigo=0 j0=0000000100000000 t=22
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=1 pedidos=2" ventanilla_resintonia

caso "ventanilla: tipo desconocido" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=10
ventanilla: pantallas=0 resintonias=0 llamadas al anfitrion=0 pedidos=1" ventanilla_tipo_desconocido

caso "ventanilla: cola fuera del camarote" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000000 t=4" ventanilla_cola_afuera

caso "ambientes: construir en el lugar, destruir solo uno" 0 0 "$fijo0
P0 codigo=0 j0=0000000300000075 t=53
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=0 pedidos=5" ambientes

caso "ambientes: un ambiente destruido es un hueco" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000000 t=27
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=0 pedidos=3" ambiente_hueco

caso "ambientes: la ventanilla no lee de un hueco" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=34
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=0 pedidos=4" ambiente_hueco_ventanilla

caso "ambientes: sin ninguno, la cuenta vuelve a empezar" 0 0 "$fijo0
P0 codigo=0 j0=0000000100000000 t=30
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=0 pedidos=3" ambiente_reconstruir

caso "ambientes: un numero nunca se reusa mientras quede otro" 0 0 "$fijo0
P0 codigo=0 j0=0000000300000077 t=37
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=0 pedidos=4" ambiente_sin_reusar

caso "ambientes: la direccion muere con su ambiente" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000000 t=33
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=0 pedidos=4" ambiente_muerto

caso "ambientes: destruir el del medio une los extremos" 0 0 "$fijo0
P0 codigo=0 j0=0000000400000066 t=56
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=0 pedidos=5" ambientes_unir

caso "ambientes: el byte siguiente al ambiente ya es afuera" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000077 t=17
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=1" ambiente_borde

caso "ambientes: el byte siguiente al ambiente 0 ya es afuera" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000055 t=9" ambiente_cero_borde

caso "ambientes: muy lejos del final tambien es afuera" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000077 t=19
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=1" ambiente_lejos

caso "ambientes: plasticos, 33.000 a la vez" 0 0 "$fijo0
P0 codigo=0 j0=00000000000080E8 t=429010
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=33000" muchos_cajones

caso "ambientes: una caja de solo lectura se lee y no se escribe" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000077 t=25
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=0 pedidos=2" ambiente_trato

caso "ambientes: el trato vuelve, y lo que no se construyo se rechaza" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000052 t=66
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=0 pedidos=6" ambiente_trato_vuelve

caso "ambientes: el ambiente 0 de solo lectura" 0 0 "$fijo0
P0 codigo=5 j0=00000000000000CC t=32
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=0 pedidos=2" ambiente_cero_trato

# Boxes between cabins (Capitan): the child is born with its mother's box, the same memory, each one with its
# own view and its own treatment.
familia familia_nace nace_hijo
caso "cajas: el hijo nace con la caja de su madre" 0 0 "$fijo0
P1 codigo=0 j0=0000000000000077 t=63
P0 codigo=0 j0=0000000000000088 t=77
ventanilla: pantallas=1 resintonias=3 llamadas al anfitrion=4 pedidos=4" nace

caso "cajas: el hijo nace con la caja solo para leer" 0 0 "$fijo0
P1 codigo=5 j0=0000000000000077 t=61
P0 codigo=0 j0=0000000000000000 t=76
ventanilla: pantallas=1 resintonias=3 llamadas al anfitrion=4 pedidos=4" nace_leer
carpeta=

caso "cajas: el hijo nunca recibe mas que su madre" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=40
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=0 pedidos=4" nace_mas

familia familia_recibe hijo_recibe
caso "cajas: la caja se muda y la madre la pierde" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000000 t=66
P1 codigo=0 j0=0000000000000077 t=73
ventanilla: pantallas=1 resintonias=3 llamadas al anfitrion=4 pedidos=4" muda

caso "cajas: dos camarotes enlazados comparten la caja" 0 0 "$fijo0
P1 codigo=0 j0=0000000000000077 t=103
P0 codigo=0 j0=0000000000000088 t=119
ventanilla: pantallas=1 resintonias=5 llamadas al anfitrion=4 pedidos=7" enlaza
carpeta=

caso "cajas: lo que no se puede" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFC t=62
ventanilla: pantallas=1 resintonias=5 llamadas al anfitrion=0 pedidos=6" cajas_no

caso "cajas: dos cajas se vuelven una" 0 0 "$fijo0
P0 codigo=5 j0=0000000300000065 t=49
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=0 pedidos=4" fusiona

# Association (Capitan): the child is born with the shared boxes, the mother's only, the partner's only, or all.
familia familia_asocia hijo_cuenta
cp "$salida/socio.bin" "$salida/familia_asocia/736f63696f"
caso "cajas: por asociacion, las que comparten" 0 0 "$fijo0
P2 codigo=0 j0=0000000100000077 t=906
P0 codigo=0 j0=0000000000000000 t=929
P1 codigo=0 j0=0000000000000000 t=932
ventanilla: pantallas=1 resintonias=39 llamadas al anfitrion=8 pedidos=42" asocia_0

caso "cajas: por asociacion, solo las de la madre" 0 0 "$fijo0
P2 codigo=0 j0=0000000200000011 t=910
P0 codigo=0 j0=0000000000000000 t=933
P1 codigo=0 j0=0000000000000000 t=935
ventanilla: pantallas=1 resintonias=39 llamadas al anfitrion=8 pedidos=42" asocia_1

caso "cajas: por asociacion, solo las del socio" 0 0 "$fijo0
P2 codigo=0 j0=0000000200000055 t=910
P0 codigo=0 j0=0000000000000000 t=933
P1 codigo=0 j0=0000000000000000 t=935
ventanilla: pantallas=1 resintonias=39 llamadas al anfitrion=8 pedidos=42" asocia_2

caso "cajas: por asociacion, todas" 0 0 "$fijo0
P2 codigo=0 j0=00000005000000DD t=922
P0 codigo=0 j0=0000000000000000 t=945
P1 codigo=0 j0=0000000000000000 t=948
ventanilla: pantallas=1 resintonias=39 llamadas al anfitrion=8 pedidos=42" asocia_3

carpeta=

# Greetings (Capitan): one mark per family member that greets, kept until taken; -1 when nobody is left.
familia familia_saludo saludo_hijo
caso "saludo: la madre recibe a quien la saluda, en orden" 0 0 "$fijo0
P1 codigo=0 j0=0000000000000000 t=45
P2 codigo=0 j0=0000000000000000 t=73
P0 codigo=0 j0=0000000000000011 t=98
ventanilla: pantallas=1 resintonias=4 llamadas al anfitrion=8 pedidos=7" saludo
carpeta=

caso "saludo: solo en familia, y nadie despierto da -1" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFE t=21
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=0 pedidos=2" saludo_no

# A greeting that carries a word (Capitan, 2026-11-06): the bit is still the doorbell, and the word waits in the
# mailbox, in order, with who said it (requests 30 say, 31 read).
familia familia_palabra palabra_hijo
caso "palabra: la madre lee las palabras de su hijo, en orden" 0 0 "$fijo0
P1 codigo=0 j0=0000000000000000 t=*
P0 codigo=0 j0=006C6F73616C6F6A t=*
ventanilla: *" palabra
carpeta=

# Razar's school (razar/cardumen, Capitan): the Janax program leaves the fingerprint of the reference model, bit for
# bit; the expected one comes from the model itself, so a change in the model has to be followed here.
huella=$(perl "$proyecto/razar/cardumen/huella.pl")
caso "razar: el cardumen deja la huella del modelo" 0 0 "$fijo0
P0 codigo=0 j0=$huella t=*" cardumen

# Waves that cross (Capitan, 2026-11-06: everything moves to Janax, Perl stays as the measuring stick): words go in as
# songs, one greeting per step, each pulse a wave of its own, their pushes adding up; the same fingerprint as the model.
huella_olas=$(perl "$proyecto/razar/cardumen/huella_olas.pl")
caso "razar: las olas que se cruzan dejan la huella del modelo" 0 0 "$fijo0
P0 codigo=0 j0=$huella_olas t=*" cardumen_olas

# The loop a lo Janax: the will and the school are two cabins that take turns with greetings over the box the
# will gave as dowry; 200 rounds give the fingerprint of the model's loop, bit for bit. The will listens to the melody:
# which top pieces woke and at which step (lee=ritmo, the reading that won the A/B of 2026-11-04). No doors
# (Capitan, 2026-11-04: they bought nothing measured, and with them the rhythm got stuck).
huella_lazo=$(perl "$proyecto/razar/cardumen/lazo.pl" nace=7 armonia=1 rounds=200 huella=1 lee=ritmo)
# and the will says how it went, the same line as the model: its hits every 50 rounds
aciertos_lazo=$(perl "$proyecto/razar/cardumen/lazo.pl" nace=7 armonia=1 rounds=200 lee=ritmo | tail -1 | tr -d '\r')
familia familia_lazo cardumen_lazo
caso "razar: la voluntad y el cardumen conversan como en el modelo" 0 0 "$fijo0
$aciertos_lazo
P1 codigo=0 j0=* t=*
P0 codigo=0 j0=$huella_lazo t=*
ventanilla: *" voluntad
carpeta=

# --- files: labels with any character, kept in the system's own folder ---
caso "archivo: guardar" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000004 t=58
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=3 pedidos=3" archivo_guardar

# On the host the label is stored in hexadecimal: valid on any file system, never two labels in one name.
nombre="$archivos/f09fa68e206e6f7461732e747874"
if ! toca "archivo: en el anfitrion"; then :
elif [ -f "$nombre" ] && [ "$(cat "$nombre")" = "hola" ]; then
  ok=$((ok + 1))
else
  echo "MAL  archivo en el anfitrion: no esta $nombre con 'hola'"; ls -la "$archivos" 2>&1; mal=$((mal + 1))
fi

# Another run of the system finds what the first one saved.
caso "archivo: leer en otra corrida" 0 0 "$fijo0
P0 codigo=0 j0=00000000616C6F68 t=43
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=2 pedidos=2" archivo_leer

caso "archivo: etiqueta que no es UTF-8" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=20
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=1" archivo_etiqueta_invalida

caso "archivo: manija que no se abrio" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=21
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=1" archivo_manija_mala

# --- porters: a tree with wide branches; a process gets only the permissions it was launched with ---
# (p screen, m memory, l read files, g write files; no @ = all). Nodes: root + 3 door porters + 3 per process.
caso "porteros: sin pantalla" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=17
ventanilla: pantallas=0 resintonias=0 llamadas al anfitrion=0 pedidos=1
porteros: nodos=7 negados=1" ventanilla_hola@m

caso "porteros: sin archivos" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=58
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=3
porteros: nodos=7 negados=2" archivo_guardar@p

caso "porteros: rama revocada y privilegios bajados" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFE t=*
ventanilla: pantallas=1 resintonias=5 llamadas al anfitrion=0 pedidos=8
porteros: nodos=10 negados=2" porteros_cascada

# Three processes hang from the same door porters: a wide branch, not a longer chain.
caso "porteros: ramas anchas" 0 0 "$fijo0
P* codigo=0 j0=FFFFFFFFFFFFFFFF t=*
P* codigo=0 j0=FFFFFFFFFFFFFFFF t=*
P* codigo=0 j0=FFFFFFFFFFFFFFFF t=*
ventanilla: pantallas=0 resintonias=0 llamadas al anfitrion=0 pedidos=3
porteros: nodos=13 negados=3" ventanilla_hola@m ventanilla_hola@m ventanilla_hola@m

# --- files: delete, rename, list; labels normalized so two look-alike labels are one file ---
carpeta=$(cygpath -m "$salida/archivos_lista"); rm -rf "$salida/archivos_lista"
caso "archivo: listar, borrar, renombrar" 0 0 "$fijo0
P0 codigo=0 j0=0000000000020163 t=*
ventanilla: *" archivo_lista
carpeta=$(cygpath -m "$salida/archivos_nfc"); rm -rf "$salida/archivos_nfc"
caso "archivo: etiquetas que se ven iguales son el mismo archivo" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000031 t=*
ventanilla: *" archivo_normalizacion
unset carpeta
nfc=$(ls "$salida/archivos_nfc" 2>&1 | tr '\n' ' ')
if ! toca "archivo: normalizado"; then :
elif [ "$nfc" = "c3a9 " ]; then        # one file, named after the one-piece form (NFC)
  ok=$((ok + 1))
else
  echo "MAL  archivo normalizado en el anfitrion: esperaba 'c3a9', hay '$nfc'"; mal=$((mal + 1))
fi

# --- porters by label: a prefix (hexadecimal at launch) limits which labels a process can touch ---
caso "porteros: prefijo que permite" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000004 t=58
ventanilla: *" archivo_guardar@lg:f09fa68e

caso "porteros: prefijo que no permite" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=58
ventanilla: *
porteros: nodos=7 negados=1" archivo_guardar@lg:61

carpeta=$(cygpath -m "$salida/archivos_lista")    # holds one label: "c"
caso "porteros: listar ve lo permitido" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000001 t=14
ventanilla: *" archivo_listar@l:63
caso "porteros: listar oculta lo demas" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000000 t=14
ventanilla: *" archivo_listar@l:64
unset carpeta

caso "porteros: un hijo no sale del prefijo del padre" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFE t=*
ventanilla: *
porteros: nodos=8 negados=2" porteros_etiqueta

# --- the family: the kernel is the mother; a process launches children from a file labelled "hijo"
# (68696a6f on the host). An important request of a child waits for its parent's signature only. ---
# A child launched from the label "hijo" gets the file "hijo.datos" of the same folder.
familia familia_datos datos_iniciales
cp "$salida/datos_iniciales.datos" "$salida/familia_datos/68696a6f2e6461746f73"
caso "datos iniciales de un hijo" 0 0 "$fijo0
P1 codigo=0 j0=1122334455667788 t=*
P0 codigo=0 j0=0000000000000000 t=*
ventanilla: *" familia_espera

familia familia_espera 02_ldi
caso "familia: el padre lanza y espera" 0 0 "$fijo0
P1 codigo=0 j0=000000000000002A t=*
P0 codigo=0 j0=0000000000000000 t=*
ventanilla: *" familia_espera

# A child is born with its parent's bolita, and can not ask for more.
familia familia_bolita bolita
caso "familia: el hijo nace con la bolita del padre" 0 0 "$fijo0
P1 codigo=0 j0=0000000000008000 t=*
P0 codigo=0 j0=0000000000000000 t=*
ventanilla: *" 'familia_espera!0.5'

familia familia_firma ventanilla_hola
caso "familia: el hijo pide, el padre firma" 0 0 "$fijo0
hola
P1 codigo=0 j0=0000000000000005 t=*
P0 codigo=0 j0=0000000000000000 t=*
ventanilla: *" familia_firma

# The cabins that hold others go first (remos.inc): a parent holding its three children gets every other
# turn while they wait, so it signs one per turn instead of one per round of the line. With the line alone
# the children ended at t=6066, 7285 and 8504; the long ones end at the same clock (no work is lost).
familia familia_tres ventanilla_hola
caso "el que traba a otros va primero" 4 0 "modo: simbiosis
costo de cambio: 4.00 instrucciones (fijado)
hola
P4 codigo=0 j0=0000000000000005 t=4528
hola
P5 codigo=0 j0=0000000000000005 t=5325
hola
P6 codigo=0 j0=0000000000000005 t=5328
P3 codigo=0 j0=0000000000000000 t=5333
P0 codigo=0 j0=000000000007A314 t=8736
P1 codigo=0 j0=000000000007A314 t=8963
P2 codigo=0 j0=000000000007A314 t=9190
ventanilla: pantallas=1 resintonias=7 llamadas al anfitrion=15 pedidos=12" largo_1000 largo_1000 largo_1000 padre_tres

familia familia_rechazo ventanilla_hola
caso "familia: el padre rechaza" 0 0 "$fijo0
P1 codigo=0 j0=FFFFFFFFFFFFFFFF t=*
P0 codigo=0 j0=0000000000000000 t=*
ventanilla: *
porteros: nodos=* negados=1" familia_rechazo

familia familia_huerfano ventanilla_hola
caso "familia: la sombra del padre firma por su linea" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000007 t=*
hola
P1 codigo=0 j0=0000000000000005 t=*
ventanilla: *" familia_huerfano

familia familia_permisos ventanilla_agrandar
caso "familia: el hijo no tiene mas que su padre" 0 0 "$fijo0
P1 codigo=0 j0=FFFFFFFFFFFFFFFF t=*
P0 codigo=0 j0=0000000000000000 t=*
ventanilla: *
porteros: nodos=10 negados=1" familia_espera@pl

# Three generations: "padre" launches "hijo" and ends; the grandchild's request is signed by the
# parent's shadow with the parent's permissions, never by the grandparent (which signs only 1 request).
familia familia_sombra ventanilla_hola
cp "$salida/familia_padre_se_va.bin" "$salida/familia_sombra/7061647265"
caso "familia: la sombra decide por su linea, no el abuelo" 0 0 "$fijo0
P1 codigo=0 j0=0000000000000003 t=*
hola
P2 codigo=0 j0=0000000000000005 t=*
P0 codigo=0 j0=0000000000000001 t=*
ventanilla: *" familia_abuelo
if [ -z "${JANAX_SOLO:-}" ]; then   # (the assembler and the combinations: only in the whole suite)
# --- the PDP assembler: Janax assembled by Janax. Every source must come out byte for byte as FASM builds
# it, the assembler's own source included. A source that uses what the assembler does not have yet is
# counted as an error and left unbuilt (none left: 82 of 82 is the goal).
pdp="$salida/pdp_$motor"; rm -rf "$pdp" "$salida/pdp_fasm"; mkdir -p "$pdp" "$salida/pdp_fasm"
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
entiende=(); no_entiende=0
# PDP mirrors the repository, folders and all, so relative includes find their files.
fd -e inc --exclude build . "$proyecto/escalon0" "$proyecto/so" | while IFS= read -r f; do
  f=$(cd "$(dirname "$f")" && pwd)/$(basename "$f")
  cp "$f" "$pdp/$(etiqueta "PDP/${f#$proyecto/}")"
done
for f in "$proyecto"/escalon0/pruebas/*.jsm "$aqui"/*.jsm "$raiz"/bancos/*.jsm "$raiz"/pdp/ensamblador/ensamblador.jsm; do
  n=${f#$proyecto/}; n=${n%.jsm}
  cp "$f" "$pdp/$(etiqueta "PDP/$n.jsm")"
  if [ -n "${PDP_NO_ENTIENDE:-}" ] && grep -qE "$PDP_NO_ENTIENDE" "$f"; then
    no_entiende=$((no_entiende + 1))
  else
    mkdir -p "$salida/pdp_fasm/$(dirname "$n")"
    "$fasm" "$f" "$salida/pdp_fasm/$n.bin" > /dev/null || { echo "no ensambla con FASM: $f"; exit 1; }
    entiende+=("$n")
  fi
done
pdp_corrida() {   # pdp_corrida <name> <expected built> : runs the assembler on the folder and checks j0
  local esp got
  esp=$(printf 'j0=%08X%08X' "$no_entiende" "$2")
  got=$(JANAX_ARCHIVOS="$(cygpath -m "$pdp")" JANAX_CAMBIO=0 timeout 120 "$salida/janaxos.exe" "$(cygpath -m "$salida/pdp/ensamblador.bin")" | tr -d '\r' | grep -o 'j0=[0-9A-F]*')
  if [ "$got" = "$esp" ]; then ok=$((ok + 1)); else echo "MAL  [$motor] pdp $1: esperaba $esp, dio $got"; mal=$((mal + 1)); fi
}
pdp_iguales() {   # every source it understands, byte for byte as FASM
  local n distintos=0
  for n in "${entiende[@]}"; do
    cmp -s "$salida/pdp_fasm/$n.bin" "$pdp/$(etiqueta "PDP/$n.bin")" || { echo "MAL  [$motor] pdp $1: $n.bin no es igual al de FASM"; distintos=$((distintos + 1)); }
  done
  if [ "$distintos" = 0 ]; then ok=$((ok + 1)); else mal=$((mal + 1)); fi
}
pdp_corrida "arma todo lo que entiende" "${#entiende[@]}"
pdp_iguales "byte por byte"
pdp_corrida "lo ya armado no se vuelve a armar" 0
printf '\n; one more line\n' >> "$pdp/$(etiqueta "PDP/escalon0/pruebas/02_ldi.jsm")"
pdp_corrida "solo lo que cambio" 1
pdp_iguales "byte por byte despues del cambio"
# an included file changed: every source that includes it is built again, and only those
usan=$(grep -l "include .*ambientes.inc" "$proyecto"/escalon0/pruebas/*.jsm "$aqui"/*.jsm "$raiz"/bancos/*.jsm | wc -l)
printf '
; one more line
' >> "$pdp/$(etiqueta "PDP/so/pruebas/ambientes.inc")"
pdp_corrida "un include cambiado rearma a quienes lo usan" "$usan"
pdp_iguales "byte por byte despues del include"

# Every combination of every instruction (so/herramientas/combinaciones.pl), byte for byte as FASM. Once,
# with the routines: the assembler itself is already tried with both engines above.
if [ "$motor" = rutinas ]; then
  comb="$salida/combinaciones"; rm -rf "$comb" "$salida/pdp_comb"; mkdir -p "$salida/pdp_comb"
  perl "$raiz/herramientas/combinaciones.pl" "$comb" "$(cygpath -m "$proyecto/escalon0/janax.inc")"
  distintos=0; total=0
  for f in "$comb"/*.jsm; do
    n=$(basename "$f" .jsm); total=$((total + 1))
    "$fasm" "$f" "$comb/$n.bin" > /dev/null || { echo "combinacion $n no ensambla con FASM"; exit 1; }
    cp "$f" "$salida/pdp_comb/$(etiqueta "PDP/combinaciones/$n.jsm")"
  done
  got=$(JANAX_ARCHIVOS="$(cygpath -m "$salida/pdp_comb")" JANAX_CAMBIO=0 timeout 300 "$salida/janaxos.exe" "$(cygpath -m "$salida/pdp/ensamblador.bin")" | tr -d '\r' | grep -o 'j0=[0-9A-F]*')
  for f in "$comb"/*.jsm; do
    n=$(basename "$f" .jsm)
    cmp -s "$comb/$n.bin" "$salida/pdp_comb/$(etiqueta "PDP/combinaciones/$n.bin")" || { echo "MAL  pdp combinaciones: $n"; distintos=$((distintos + 1)); }
  done
  if [ "$got" = "$(printf 'j0=%016X' "$total")" ] && [ "$distintos" = 0 ]; then ok=$((ok + 1)); else echo "MAL  pdp combinaciones: $got, $distintos distintas de $total"; mal=$((mal + 1)); fi
fi

fi

# The rowers in parallel (one per core and more): each cabin gives its result, whatever the order.
paralelo() {   # paralelo <name> <rowers> <expected lines, sorted> <program>...
  local nombre=$1 remos=$2 esp=$3 got; shift 3
  toca "remeros: $nombre" || return 0
  local args=() p
  for p in "$@"; do args+=("$(bin "$p")"); done
  got=$(JANAX_REMOS=$remos JANAX_CAMBIO=0 JANAX_ARCHIVOS="${carpeta:-$JANAX_ARCHIVOS}" timeout 60 "$salida/janaxos.exe" "${args[@]}" \
    | tr -d '\r' | grep -o 'P[0-9]* codigo=[0-9]* j0=[0-9A-F]*\|^hola$' | sort)
  if [ "$got" = "$esp" ]; then ok=$((ok + 1)); else echo "MAL  [$motor] remeros: $nombre: dio"; echo "$got"; mal=$((mal + 1)); fi
}
ocho="P0 codigo=0 j0=0000000000000037
P1 codigo=0 j0=0000000000000037
P2 codigo=0 j0=0000000000000037
P3 codigo=0 j0=0000000000000037
P4 codigo=0 j0=0000000000000007
P5 codigo=0 j0=0000000000000009
P6 codigo=0 j0=000000000007A314
P7 codigo=0 j0=0000000000006625"
for remos in 2 4 8; do
  paralelo "ocho camarotes con $remos remeros" $remos "$ocho" while_suma while_suma while_suma while_suma camarote_7 camarote_9 largo_1000 fusion
done
familia familia_firma_par ventanilla_hola
paralelo "el hijo pide y el padre firma, con 4 remeros" 4 "P0 codigo=0 j0=0000000000000000
P1 codigo=0 j0=0000000000000005
hola" familia_firma
unset carpeta

unset carpeta
done

# The while is Janax's only loop, also inside the kernel: every loop must be a rotated while.
for f in janaxos.asm rutinas.inc ambientes.inc datos.inc anfitrion.inc ayudantes.inc remos.inc nativo.inc; do
  if r=$(perl "$raiz/herramientas/bucles.pl" "$raiz/$f"); then
    ok=$((ok + 1))
  else
    echo "MAL  $f tiene bucles que no son while rotado:"; echo "$r" | grep -v ' while '; mal=$((mal + 1))
  fi
done

echo "$ok bien, $mal mal"
[ "$mal" = 0 ]
