#!/usr/bin/env bash
# Janax OS tests (symbiosis mode, on this PC).
# Each case runs janaxos.exe with some Janax programs and compares its whole output and exit code.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
raiz=$(dirname "$aqui")
proyecto=$(dirname "$raiz")
fasm=/e/DevCache/fasm/FASM.EXE
export INCLUDE="E:/DevCache/fasm/INCLUDE"
salida="$raiz/build"
mkdir -p "$salida"

if ! "$fasm" "$raiz/janaxos.asm" "$salida/janaxos.exe" > "$salida/janaxos.log" 2>&1; then
  echo "janaxos.asm no ensambla:"; cat "$salida/janaxos.log"; exit 1
fi
for p in "$aqui"/*.jsm "$proyecto"/escalon0/pruebas/{02_ldi,04_suma,19_opcode_invalido}.jsm; do
  "$fasm" "$p" "$salida/$(basename "$p" .jsm).bin" > /dev/null || { echo "no ensambla: $p"; exit 1; }
done
bin() { cygpath -m "$salida/$1.bin"; }
archivos="$salida/archivos"           # the system's own folder for files, empty at every run
rm -rf "$archivos"
export JANAX_ARCHIVOS="$(cygpath -m "$archivos")"

ok=0; mal=0
# caso <name> <switch cost, or "" to let the kernel measure it> <expected exit code> <expected output> <program>...
caso() {
  local nombre=$1 cambio=$2 cod=$3 esp=$4; shift 4
  local args=() p
  for p in "$@"; do
    case "$p" in
      *@*) args+=("$(bin "${p%@*}")@${p#*@}") ;;   # program@permissions
      *)   args+=("$(bin "$p")") ;;
    esac
  done
  local got c
  if [ -n "$cambio" ]; then
    got=$(JANAX_CAMBIO=$cambio JANAX_ARCHIVOS="${carpeta:-$JANAX_ARCHIVOS}" "$salida/janaxos.exe" "${args[@]}"); c=$?   # the kernel's code, not a pipe's
  else
    got=$(env -u JANAX_CAMBIO "$salida/janaxos.exe" "${args[@]}"); c=$?
  fi
  got=${got//$'\r'/}
  if [ "$c" = "$cod" ] && [[ "$got" == $esp ]]; then
    ok=$((ok + 1))
  else
    echo "MAL  $nombre: esperaba codigo $cod y"; echo "$esp"; echo "     dio codigo $c y"; echo "$got"
    mal=$((mal + 1))
  fi
}
fijo0="modo: simbiosis
costo de cambio: 0.00 instrucciones (fijado)"

caso "un proceso" 0 0 "$fijo0
P0 codigo=0 j0=000000000000002A t=2" 02_ldi

# With switch cost 0 the scheduler is pure least attained service: the long one is first in line,
# the short ones still finish first.
caso "lo corto primero" 0 0 "$fijo0
P1 codigo=0 j0=000000000000002A t=6
P2 codigo=0 j0=000000000000002A t=9
P0 codigo=0 j0=000000000007A314 t=3010" largo_1000 02_ldi 04_suma

# Switch cost 4: the first turn is t = ((D + c) + sqrt((D + c)^2 + 4 c s)) / 2 = 4 for the long one
# (D = 0, s = 0); then the short one (D = 4) gets 8 and ends after its 2 instructions.
caso "la prioridad decide el turno" 4 0 "modo: simbiosis
costo de cambio: 4.00 instrucciones (fijado)
P1 codigo=0 j0=000000000000002A t=6
P0 codigo=0 j0=000000000007A314 t=3006" largo_1000 02_ldi

# A process that breaks only breaks its own cabin.
caso "un pasajero rompe lo suyo" 0 0 "$fijo0
P0 codigo=1 j0=0000000000000000 t=1
P1 codigo=0 j0=000000000000002A t=3" 19_opcode_invalido 02_ldi

# Same address in two processes that keep switching: each one sees only its own value.
caso "camarotes separados" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000007 t=33
P1 codigo=0 j0=0000000000000009 t=34" camarote_7 camarote_9

# Measured on this machine: the cost changes from machine to machine, the results must not.
caso "costo medido" "" 0 "modo: simbiosis
costo de cambio: *.* instrucciones (medido)
P* codigo=0 j0=000000000000000[79] t=*
P* codigo=0 j0=000000000000000[79] t=34" camarote_7 camarote_9

# The next boot on the same machine and kernel remembers it instead of measuring again.
caso "costo recordado" "" 0 "modo: simbiosis
costo de cambio: *.* instrucciones (recordado)
P0 codigo=0 j0=000000000000002A t=2" 02_ldi

caso "sin programas" 0 4 "$fijo0"

# --- the window: requests tuned to the fewest screens possible, served in batches ---
caso "ventanilla: escribir" 0 0 "$fijo0
hola
P0 codigo=0 j0=0000000000000005 t=15
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=1 pedidos=1" ventanilla_hola

caso "ventanilla: tres escrituras, una llamada" 0 0 "$fijo0
a
b
c
P0 codigo=0 j0=0000000000000003 t=25
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=1 pedidos=3" ventanilla_lote

caso "ventanilla: dos sintonias, dos pantallas" 0 0 "$fijo0
x
P0 codigo=0 j0=0000000000101000 t=21
ventanilla: pantallas=2 resintonias=0 llamadas al anfitrion=1 pedidos=2" ventanilla_dos_tipos

caso "ventanilla: la pantalla cambia de sintonia" 0 0 "$fijo0
y
P0 codigo=0 j0=0000000000100008 t=20
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=1 pedidos=2" ventanilla_resintonia

caso "ventanilla: tipo desconocido" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=8
ventanilla: pantallas=0 resintonias=0 llamadas al anfitrion=0 pedidos=1" ventanilla_tipo_desconocido

caso "ventanilla: cola fuera del camarote" 0 0 "$fijo0
P0 codigo=5 j0=0000000000000000 t=2" ventanilla_cola_afuera

caso "ventanilla: achicar no pasa el fin de la cola" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000128 t=11
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=1" ventanilla_achicar

# --- files: labels with any character, kept in the system's own folder ---
caso "archivo: guardar" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000004 t=56
ventanilla: pantallas=1 resintonias=2 llamadas al anfitrion=3 pedidos=3" archivo_guardar

# On the host the label is stored in hexadecimal: valid on any file system, never two labels in one name.
nombre="$archivos/f09fa68e206e6f7461732e747874"
if [ -f "$nombre" ] && [ "$(cat "$nombre")" = "hola" ]; then
  ok=$((ok + 1))
else
  echo "MAL  archivo en el anfitrion: no esta $nombre con 'hola'"; ls -la "$archivos" 2>&1; mal=$((mal + 1))
fi

# Another run of the system finds what the first one saved.
caso "archivo: leer en otra corrida" 0 0 "$fijo0
P0 codigo=0 j0=00000000616C6F68 t=41
ventanilla: pantallas=1 resintonias=1 llamadas al anfitrion=2 pedidos=2" archivo_leer

caso "archivo: etiqueta que no es UTF-8" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=18
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=1" archivo_etiqueta_invalida

caso "archivo: manija que no se abrio" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=19
ventanilla: pantallas=1 resintonias=0 llamadas al anfitrion=0 pedidos=1" archivo_manija_mala

# --- porters: a tree with wide branches; a process gets only the permissions it was launched with ---
# (p screen, m memory, l read files, g write files; no @ = all). Nodes: root + 3 door porters + 3 per process.
caso "porteros: sin pantalla" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=15
ventanilla: pantallas=0 resintonias=0 llamadas al anfitrion=0 pedidos=1
porteros: nodos=7 negados=1" ventanilla_hola@m

caso "porteros: sin archivos" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=56
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
if [ "$nfc" = "c3a9 " ]; then        # one file, named after the one-piece form (NFC)
  ok=$((ok + 1))
else
  echo "MAL  archivo normalizado en el anfitrion: esperaba 'c3a9', hay '$nfc'"; mal=$((mal + 1))
fi

# --- porters by label: a prefix (hexadecimal at launch) limits which labels a process can touch ---
caso "porteros: prefijo que permite" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000004 t=56
ventanilla: *" archivo_guardar@lg:f09fa68e

caso "porteros: prefijo que no permite" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFF t=56
ventanilla: *
porteros: nodos=7 negados=1" archivo_guardar@lg:61

carpeta=$(cygpath -m "$salida/archivos_lista")    # holds one label: "c"
caso "porteros: listar ve lo permitido" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000001 t=12
ventanilla: *" archivo_listar@l:63
caso "porteros: listar oculta lo demas" 0 0 "$fijo0
P0 codigo=0 j0=0000000000000000 t=12
ventanilla: *" archivo_listar@l:64
unset carpeta

caso "porteros: un hijo no sale del prefijo del padre" 0 0 "$fijo0
P0 codigo=0 j0=FFFFFFFFFFFFFFFE t=*
ventanilla: *
porteros: nodos=8 negados=2" porteros_etiqueta

echo "$ok bien, $mal mal"
[ "$mal" = 0 ]
