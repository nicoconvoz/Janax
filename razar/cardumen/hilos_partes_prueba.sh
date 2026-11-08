#!/usr/bin/env bash
# hilos_partes_prueba.sh: the pieces of words, found in the book (Capitan: "take by context what each word, letter,
# ending, beginning does"). Words said twice each: rápido/rápidamente, lento/lentamente, claro/claramente, casa/casas,
# mesa/mesas, hacer/rehacer, leer/releer, and two that share nothing (sol, nube). At their end "o" into "amente" works
# for three roots and nothing into "s" for two; at their beginning nothing into "re" for two. Nothing is given: each
# is found by cutting the words it read.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
mkdir -p "$d/casa"
for i in 1 2; do
  printf '%s\n' 'O: rápido y rápidamente.' 'O: lento y lentamente.' 'O: claro y claramente.' \
    'O: casa y casas.' 'O: mesa y mesas.' 'O: sol y nube.' 'O: hacer y rehacer.' 'O: leer y releer.'
done > "$d/casa/$(etiqueta pares)"
printf 'si' > "$d/casa/$(etiqueta partes)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
piezas="$d/casa/$(etiqueta piezas)"
if grep -Pq '^3\t(amente\to|o\tamente)\t.*\tfin$' "$piezas" && grep -Pq '^2\t(_\ts|s\t_)\t.*\tfin$' "$piezas" &&
   grep -Pq '^2\t(_\tre|re\t_)\t.*\tinicio$' "$piezas" &&
   printf '%s\n' "$salida" | grep -q '^pieza: 3	'; then
  echo "hilos_partes_prueba: bien"
else
  echo "hilos_partes_prueba: MAL"; printf '%s\n' "$salida" | grep -E '^pieza'; echo "== piezas"; cat "$piezas"
  exit 1
fi
