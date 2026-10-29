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

rm -f "$salida"/*.x64             # first translator run of each test starts without cache

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
  # translator twice: the second run comes from the cache and must give the same
  for motor in janax traductor traductor; do
    got=$("$salida/$motor.exe" "$(cygpath -m "$salida/$n.bin")" 2> /dev/null); c=$?
    got=${got%$'\r'}
    if [ "$c" = "$cod" ] && [ "$got" = "$esp" ]; then
      ok=$((ok + 1))
    else
      echo "MAL  $n [$motor]: esperaba codigo $cod salida '$esp', dio codigo $c salida '$got'"; mal=$((mal + 1))
    fi
  done
done
# --- incremental translation: only the words that changed are translated again ---
# check <name> <expected stdout> <expected stderr>: runs the translator on diff.bin
check() {
  local out err
  err=$("$salida/traductor.exe" "$(cygpath -m "$salida/diff.bin")" 2>&1 > "$salida/diff.out")
  out=$(< "$salida/diff.out"); out=${out%$'\r'}; err=${err%$'\r'}
  if [ "$out" = "$2" ] && [ "$err" = "$3" ]; then
    ok=$((ok + 1))
  else
    echo "MAL  diff $1: esperaba '$2' / '$3', dio '$out' / '$err'"; mal=$((mal + 1))
  fi
}
programa() {   # programa <count>  [extra line]: j0 = 1 + ... + count
  printf "include '%s/janax.inc'\njldi j0, 0\njldi j1, %s\njldi j2, 1\nvuelta:\njadd j0, j0, j1\njsub j1, j1, j2\njjnz j1, vuelta\n%s\njhalt\n" \
    "$(cygpath -m "$raiz")" "$1" "${2:-}" > "$salida/diff.jsm"
  "$fasm" "$salida/diff.jsm" "$salida/diff.bin" > /dev/null
}
rm -f "$salida/diff.bin.x64"
programa 10;            check "sin cache"      0000000000000037 "traducidas 7 de 7"
                        check "desde cache"    0000000000000037 "traducidas 0 de 7"
programa 20;            check "una palabra"    00000000000000D2 "traducidas 1 de 7"
programa 20 "jldi j3, 9"; check "cambia el largo" 00000000000000D2 "traducidas 2 de 8"   # jumps are relinked, not retranslated
# j12 becomes the most used register: the register map changes and every word is translated again
programa 20 "$(printf 'jadd j12, j12, j12\n%.0s' 1 2 3 4)"
                        check "cambia el mapa" 00000000000000D2 "traducidas 11 de 11"

echo "$ok bien, $mal mal"
[ "$mal" = 0 ]
