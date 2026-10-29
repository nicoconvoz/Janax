#!/usr/bin/env bash
# Runs every Janax test program on the escalon 0 reference interpreter.
# Each .jsm declares "; espera: <16 hex digits>" (value of j0 at jhalt) and/or "; codigo: <exit code>" (default 0).
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
raiz=$(dirname "$aqui")
fasm=/e/DevCache/fasm/FASM.EXE
export INCLUDE="E:/DevCache/fasm/INCLUDE"
salida="$raiz/build"
mkdir -p "$salida"

if ! "$fasm" "$raiz/janax.asm" "$salida/janax.exe" > "$salida/janax.log" 2>&1; then
  echo "El interprete no ensambla:"; cat "$salida/janax.log"; exit 1
fi

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
  got=$("$salida/janax.exe" "$(cygpath -m "$salida/$n.bin")"); c=$?
  got=${got%$'\r'}
  if [ "$c" = "$cod" ] && [ "$got" = "$esp" ]; then
    ok=$((ok + 1))
  else
    echo "MAL  $n: esperaba codigo $cod salida '$esp', dio codigo $c salida '$got'"; mal=$((mal + 1))
  fi
done
echo "$ok bien, $mal mal"
[ "$mal" = 0 ]
