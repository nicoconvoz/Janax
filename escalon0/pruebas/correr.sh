#!/usr/bin/env bash
# Runs every Janax test program on the escalon 0 reference interpreter and on the x86-64 translator.
# Each .jsm declares "; espera: <16 hex digits>" (value of j0 at jhalt) and/or "; codigo: <exit code>" (default 0).
# Both executables must give exactly that result.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
raiz=$(dirname "$aqui")
fasm=/e/DevCache/fasm/FASM.EXE
export INCLUDE="E:/DevCache/fasm/INCLUDE"
salida="$raiz/build"
mkdir -p "$salida"

for fuente in janax traductor; do
  if ! "$fasm" "$raiz/$fuente.asm" "$salida/$fuente.exe" > "$salida/$fuente.log" 2>&1; then
    echo "$fuente.asm no ensambla:"; cat "$salida/$fuente.log"; exit 1
  fi
done

ok=0; mal=0
for p in "$aqui"/*.jsm; do
  n=$(basename "$p" .jsm)
  esp=''; cod=0
  while IFS= read -r linea; do
    linea=${linea%$'\r'}
    case "$linea" in
      '; espera: '*) esp=${linea#'; espera: '} ;;
      '; codigo: '*) cod=${linea#'; codigo: '} ;;
    esac
  done < "$p"
  if ! "$fasm" "$p" "$salida/$n.bin" > /dev/null 2>&1; then
    echo "MAL  $n (no ensambla)"; mal=$((mal + 1)); continue
  fi
  for motor in janax traductor; do
    got=$("$salida/$motor.exe" "$(cygpath -m "$salida/$n.bin")"); c=$?
    got=${got%$'\r'}
    if [ "$c" = "$cod" ] && [ "$got" = "$esp" ]; then
      ok=$((ok + 1))
    else
      echo "MAL  $n [$motor]: esperaba codigo $cod salida '$esp', dio codigo $c salida '$got'"; mal=$((mal + 1))
    fi
  done
done
echo "$ok bien, $mal mal"
[ "$mal" = 0 ]
