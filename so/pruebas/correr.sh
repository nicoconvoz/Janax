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

ok=0; mal=0
# caso <name> <expected exit code> <expected output> <program>...
caso() {
  local nombre=$1 cod=$2 esp=$3; shift 3
  local args=() p
  for p in "$@"; do args+=("$(bin "$p")"); done
  local got c
  got=$("$salida/janaxos.exe" "${args[@]}"); c=$?     # the exit code must be the kernel's, not a pipe's
  got=${got//$'\r'/}
  if [ "$c" = "$cod" ] && [ "$got" = "$esp" ]; then
    ok=$((ok + 1))
  else
    echo "MAL  $nombre: esperaba codigo $cod y"; echo "$esp"; echo "     dio codigo $c y"; echo "$got"
    mal=$((mal + 1))
  fi
}

caso "un proceso" 0 "modo: simbiosis
P0 codigo=0 j0=000000000000002A t=2" 02_ldi

# Least attained service: the long one is first in line, the short ones still finish first.
caso "lo corto primero" 0 "modo: simbiosis
P1 codigo=0 j0=000000000000002A t=6
P2 codigo=0 j0=000000000000002A t=9
P0 codigo=0 j0=000000000007A314 t=3010" largo_1000 02_ldi 04_suma

# A process that breaks only breaks its own cabin.
caso "un pasajero rompe lo suyo" 0 "modo: simbiosis
P0 codigo=1 j0=0000000000000000 t=1
P1 codigo=0 j0=000000000000002A t=3" 19_opcode_invalido 02_ldi

# Same address in two processes that keep switching: each one sees only its own value.
caso "camarotes separados" 0 "modo: simbiosis
P0 codigo=0 j0=0000000000000007 t=33
P1 codigo=0 j0=0000000000000009 t=34" camarote_7 camarote_9

caso "sin programas" 4 "modo: simbiosis"

echo "$ok bien, $mal mal"
[ "$mal" = 0 ]
