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

# The test programs are built by the PDP assembler on Janax OS (no FASM for Janax): Janax OS itself is x86
# and still built by FASM.
if ! "$fasm" "$raiz/../so/janaxos.asm" "$salida/janaxos.exe" > "$salida/janaxos.log" 2>&1; then
  echo "janaxos.asm no ensambla:"; cat "$salida/janaxos.log"; exit 1
fi
armar() { bash "$raiz/../so/herramientas/armar.sh" "$salida/janaxos.exe" "$salida" "$@"; }
armar "$aqui"/*.jsm || exit 1

rm -f "$salida"/*.x64             # first translator run of each test starts without cache

ok=0; mal=0
for p in "$aqui"/*.jsm; do
  n=$(basename "$p" .jsm)
  esp=''; cod=0; sal=''
  while IFS= read -r linea; do
    linea=${linea%$'\r'}
    case "$linea" in
      '; espera: '*) esp=${linea#'; espera: '} ;;
      '; codigo: '*) cod=${linea#'; codigo: '} ;;
      '; salida: '*) sal=${linea#'; salida: '} ;;   # what the program writes before j0
    esac
  done < "$p"
  [ -n "$sal" ] && esp="$sal"$'\n'"$esp"
  if [ ! -f "$salida/$n.bin" ]; then
    echo "MAL  $n (no se armo)"; mal=$((mal + 1)); continue
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
  armar "$salida/diff.jsm" > /dev/null || echo "MAL  diff: no se armo"
}
rm -f "$salida/diff.bin.x64"
programa 10;            check "sin cache"      0000000000000037 "traducidas 7 de 7"
                        check "desde cache"    0000000000000037 "traducidas 0 de 7"
programa 20;            check "una palabra"    00000000000000D2 "traducidas 1 de 7"
programa 20 "jldi j3, 9"; check "cambia el largo" 00000000000000D2 "traducidas 2 de 8"   # jumps are relinked, not retranslated
# j12 becomes the most used register: the register map changes and every word is translated again
programa 20 "$(printf 'jadd j12, j12, j12\n%.0s' 1 2 3 4)"
                        check "cambia el mapa" 00000000000000D2 "traducidas 11 de 11"

# A translator whose code changed never reuses an old cache, even if it generates the same bytes: a copy
# with one nop inside the emitter (the word-by-word loop) must translate every word again.
perl -pe 's/^(\.word_lap:)\r?$/$1\n        nop/' "$raiz/traductor.asm" > "$salida/traductor_otro.asm"
if [ "$(grep -c '^        nop$' "$salida/traductor_otro.asm")" != 1 ] \
   || ! INCLUDE="$INCLUDE;$(cygpath -m "$raiz")" "$fasm" "$salida/traductor_otro.asm" "$salida/traductor_otro.exe" > /dev/null 2>&1; then   # its includes are next to the original
  echo "MAL  diff otro traductor: no se pudo armar la copia con el emisor cambiado"; mal=$((mal + 1))
else
  programa 10; rm -f "$salida/diff.bin.x64"
  "$salida/traductor.exe" "$(cygpath -m "$salida/diff.bin")" > /dev/null 2>&1   # leaves a cache
  err=$("$salida/traductor_otro.exe" "$(cygpath -m "$salida/diff.bin")" 2>&1 > "$salida/diff.out")
  out=$(< "$salida/diff.out"); out=${out%$'\r'}; err=${err%$'\r'}
  if [ "$out" = 0000000000000037 ] && [ "$err" = "traducidas 7 de 7" ]; then
    ok=$((ok + 1))
  else
    echo "MAL  diff otro traductor: esperaba '0000000000000037' / 'traducidas 7 de 7', dio '$out' / '$err'"
    mal=$((mal + 1))
  fi
fi

# --- ARM64 on a real phone through adb (no emulators: house rule) ---
adb=/c/Users/Nico/AppData/Local/Android/Sdk/platform-tools/adb.exe
if ! "$fasm" "$raiz/traductor_arm64.asm" "$salida/traductor_arm64.exe" > "$salida/traductor_arm64.log" 2>&1; then
  echo "traductor_arm64.asm no ensambla:"; cat "$salida/traductor_arm64.log"; exit 1
fi
if [ -x "$adb" ] && "$adb" get-state > /dev/null 2>&1; then
  rm -rf "$salida/arm64"; mkdir -p "$salida/arm64"
  for p in "$aqui"/*.jsm; do
    n=$(basename "$p" .jsm)
    "$salida/traductor_arm64.exe" "$(cygpath -m "$salida/$n.bin")" && mv "$salida/$n.bin.arm64" "$salida/arm64/$n"
  done
  MSYS_NO_PATHCONV=1 "$adb" shell 'rm -rf /data/local/tmp/janax' > /dev/null
  MSYS_NO_PATHCONV=1 "$adb" push "$(cygpath -m "$salida/arm64")" /data/local/tmp/janax > /dev/null
  resultados=$(MSYS_NO_PATHCONV=1 "$adb" shell 'cd /data/local/tmp/janax && for f in *; do chmod 755 $f; o=$(./$f); c=$?; echo "$f|$(echo "$o" | tr "\n" "~")|$c"; done')
  for p in "$aqui"/*.jsm; do
    n=$(basename "$p" .jsm)
    esp=''; cod=0; sal=''
    while IFS= read -r linea; do
      linea=${linea%$'\r'}
      case "$linea" in
        '; espera: '*) esp=${linea#'; espera: '} ;;
        '; codigo: '*) cod=${linea#'; codigo: '} ;;
        '; salida: '*) sal=${linea#'; salida: '} ;;   # what the program writes before j0
      esac
    done < "$p"
    [ -n "$sal" ] && esp="$sal"$'\n'"$esp"
    fila=$(printf '%s\n' "$resultados" | tr -d '\r' | while IFS= read -r l; do case "$l" in "$n|"*) echo "$l";; esac; done)
    got=$(echo "$fila" | cut -d'|' -f2 | tr '~' '\n'); c=$(echo "$fila" | cut -d'|' -f3)
    if [ "$c" = "$cod" ] && [ "$got" = "$esp" ]; then
      ok=$((ok + 1))
    else
      echo "MAL  $n [arm64 en el telefono]: esperaba codigo $cod salida '$esp', dio codigo $c salida '$got'"; mal=$((mal + 1))
    fi
  done
else
  echo "AVISO: no hay telefono conectado por adb; las pruebas ARM64 no corrieron"
fi

# A smaller window: with JANAX_SIN the host takes "escribir" out of its catalog, and the program makes the
# best of what it has (it writes nothing). Only on the PC: the phone's helper has no such setting.
for motor in janax traductor; do
  for caso in "37_ventanita|0000000000000000" "38_ventanita_escribe|0000000000000000"; do
    n=${caso%|*}; esp=${caso#*|}
    got=$(JANAX_SIN=escribir "$salida/$motor.exe" "$(cygpath -m "$salida/$n.bin")" 2> /dev/null); c=$?
    got=${got%$'\r'}
    if [ "$c" = 0 ] && [ "$got" = "$esp" ]; then ok=$((ok + 1)); else echo "MAL  $n [$motor, ventana chica]: dio codigo $c salida '$got'"; mal=$((mal + 1)); fi
  done
done

# The while is Janax's only loop, also in the escalon 0: every loop must be a rotated while.
for f in janax.asm traductor.asm traductor_arm64.asm ventanita.inc; do
  if r=$(perl "$raiz/../so/herramientas/bucles.pl" "$raiz/$f"); then
    ok=$((ok + 1))
  else
    echo "MAL  $f tiene bucles que no son while rotado:"; echo "$r" | grep -v ' while '; mal=$((mal + 1))
  fi
done

echo "$ok bien, $mal mal"
[ "$mal" = 0 ]
