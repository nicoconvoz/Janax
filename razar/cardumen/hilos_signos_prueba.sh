#!/usr/bin/env bash
# hilos_signos_prueba.sh: what a sign does, found by its context (Capitan: "the punctuation"; "the law of the
# parentheses and brackets of my calculator: there none escapes"). The lines are read letter by letter; every letter
# that is not a..z is a candidate (signs, and the accented ones: it does not know which is which). In the three lines
# with parentheses "(" comes first and ")" last, and by the calculator's law ")" closes every "(" it meets, none is
# closed with nothing open and none is left open; and they choose each other. The accented letters ("ó", "é") come in
# either order and are not taken for one. Nothing is given.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
mkdir -p "$d/casa"
for i in 1 2; do
  printf '%s\n' 'O: ana (la de luz) vino.' 'O: eva (la de mar) habló.' 'O: luz (su hija) llegó.' \
    'O: mar habló de él.' 'O: él habló.' 'O: después llegó.' 'O: qué dijo él.'
done > "$d/casa/$(etiqueta pares)"
printf 'si' > "$d/casa/$(etiqueta partes)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^signo: ( abre, ) cierra | en orden 6 de 6 renglones | cierra 6, sin abrir 0, abiertos 0$' &&
   [ "$(printf '%s\n' "$salida" | grep -c '^signo:')" = 1 ]; then
  echo "hilos_signos_prueba: bien"
else
  echo "hilos_signos_prueba: MAL"; printf '%s\n' "$salida" | grep -E '^signo'
  exit 1
fi
