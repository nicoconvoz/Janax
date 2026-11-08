#!/usr/bin/env bash
# voluntad_hilos_prueba.sh: the will playing with things said by the pieces given (voluntad_hilos.jsm). Without
# "cosas" it is the will of always: 7^3 with 16 things and seed 7, the fingerprint of voluntad.jsm. With "cosas", where
# things 0 and 1 are said with the same three pieces and the rest each with its own, the cube cannot tell them apart:
# for 1 it keeps guessing 0 (more than half the last quarter); a thing with pieces of its own is guessed right more
# than half of it. With "cantos", each thing a song of five notes, songs 0 and 1 the same and the rest each its own:
# the same, for songs sung whole (which of 0 and 1 it keeps is the cube's). And a new song, never learned, made of three
# of the five notes of song 5: heard once at the end, it is taken for 5.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/voluntad_hilos.jsm" "$aqui/voluntad.jsm" "$aqui/cardumen_lazo.jsm" > /dev/null || exit 1
cp "$d/cardumen_lazo.bin" "$d/casa/$(etiqueta hijo)"
: > "$d/casa/$(etiqueta p)"
for v in 7 16 4000 7; do
  h=$(printf '%016x' "$v")
  for i in 14 12 10 8 6 4 2 0; do printf "\\x${h:$i:2}" >> "$d/casa/$(etiqueta p)"; done
done
correr() {
  JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/$1.bin")" | tr -d '\r'
}
huella() { printf '%s\n' "$1" | grep '^P0 ' | sed 's/.*j0=\([0-9A-F]*\).*/\1/'; }
madre=$(correr voluntad)
sola=$(correr voluntad_hilos)
: > "$d/casa/$(etiqueta cosas)"
for t in $(seq 0 15); do                     # thing t: pieces 3t, 3t+1, 3t+2 (of 49); thing 1 as thing 0
  b=$((t == 1 ? 0 : 3 * t))
  printf "$(printf '\\x%02x\\x%02x\\x%02x\\x00' $b $((b + 1)) $((b + 2)))" >> "$d/casa/$(etiqueta cosas)"
done
dadas=$(correr voluntad_hilos)
set -- $(printf '%s\n' "$dadas" | grep '^C: 1 '); todas1=$4; otro1=$5; veces1=$6
set -- $(printf '%s\n' "$dadas" | grep '^C: 5 '); bien5=$3; todas5=$4
rm "$d/casa/$(etiqueta cosas)"
python -I -c "
import sys
out = bytearray()
for t in range(16):                          # song t: five notes, pieces from 3 * (5t + i); song 1 as song 0
    b = 0 if t == 1 else t
    out += bytes([5, 0])
    for i in range(5):
        x = (3 * (5 * b + i)) % 47
        out += bytes([x, x + 1, x + 2])
out += bytes([3, 0])                         # the new one: notes 0, 2, 4 of song 5
for i in (0, 2, 4):
    x = (3 * (5 * 5 + i)) % 47
    out += bytes([x, x + 1, x + 2])
open(sys.argv[1], 'wb').write(out)" "$(cygpath -m "$d/casa/$(etiqueta cantos)")"
cantadas=$(correr voluntad_hilos)
set -- $(printf '%s\n' "$cantadas" | grep '^C: 1 '); ctodas1=$4; cotro1=$5; cveces1=$6
if [ "$cveces1" = 0 ]; then                  # (which of 0 and 1 it keeps is the cube's: 0 taken for 1 counts too)
  set -- $(printf '%s\n' "$cantadas" | grep '^C: 0 '); ctodas1=$4; cotro1=$(( $5 == 1 ? 0 : $5 + 1 )); cveces1=$6
fi
set -- $(printf '%s\n' "$cantadas" | grep '^C: 5 '); cbien5=$3; ctodas5=$4
set -- $(printf '%s\n' "$cantadas" | grep '^U: 0 '); nueva=${3:-}
if [ "$(huella "$sola")" = "$(huella "$madre")" ] && [ "$otro1" = 0 ] && [ $((veces1 * 2)) -gt "$todas1" ] &&
   [ $((bien5 * 2)) -gt "$todas5" ] && [ "$cotro1" = 0 ] && [ $((cveces1 * 2)) -gt "$ctodas1" ] &&
   [ $((cbien5 * 2)) -gt "$ctodas5" ] && [ "$nueva" = 5 ]; then
  echo "voluntad_hilos_prueba: bien"
else
  echo "voluntad_hilos_prueba: MAL (huella $(huella "$sola") contra $(huella "$madre"); 1 confundida con $otro1" \
    "$veces1 de $todas1; 5 bien $bien5 de $todas5; cantadas: 1 con $cotro1 $cveces1 de $ctodas1, 5 bien $cbien5 de $ctodas5; la nueva: $nueva)"
  printf '%s\n' "$dadas" "$cantadas" | grep -E '^(C:|U:|aciertos)'
  exit 1
fi
