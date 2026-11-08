#!/usr/bin/env bash
# hilos_prueba.sh: relations found in raw text, joined by reasoning in a while (hilos.jsm). Nobody asks anything: the
# text says "ana, padre de eva", "eva, hijo de ana", ... and "rosa fue padre de sol", "sol, hijo de rosa". Every form
# "_ <one to three words> _" with two words not of the half in its places, said by two, is a relation. A join is a
# hypothesis ("hijo de" is "padre de" the other way round): what the book says as it deduces confirms it, what it says
# the other way contradicts it; two confirmations and no contradiction join them. Turn 1 joins "padre de" and "hijo de"
# (three confirmations); turn 2, "fue padre de", which shares nothing with "padre de" but two pairs with what "hijo de"
# brought; turn 3 joins nothing, and the while ends. "cuida a" says two pairs as "padre de" does and one the other way
# round: refuted, never joined to it. "ve a" says a pair both ways: it does not commit to a side, nothing can refute it, it
# asserts nothing (glue), and it is never joined. "junto a" says two pairs as "padre de" does, none the other way,
# but gives mar a second father (rosa, and luz): once "padre de" shows that each child has one father (two say who
# the father of eva, luz and mar is, and no child has two fathers that two say), refuted. ("cuida a" and "junto a" may
# join each other: neither has a value two say, and what they say does not clash.)
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
printf '%s\n' 'O: ana, padre de eva.' 'O: eva, padre de luz.' 'O: luz, padre de mar.' \
  'O: eva, hijo de ana.' 'O: luz, hijo de eva.' 'O: mar, hijo de luz.' 'O: sol, hijo de rosa.' 'O: cielo, hijo de sol.' \
  'O: rosa fue padre de sol.' 'O: sol fue padre de cielo.' \
  'O: ana cuida a eva.' 'O: eva cuida a luz.' 'O: mar cuida a luz.' \
  'O: eva ve a luz.' 'O: luz ve a eva.' 'O: ana ve a eva.'   'O: ana junto a eva.' 'O: eva junto a luz.' 'O: rosa junto a mar.' \
  "O: $(printf 'y %.0s' $(seq 1 90))y." > "$d/casa/$(etiqueta pares)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^vuelta 1 une: padre de ~ hijo de | al reves | lo confirman 3 | nada lo contradice$' &&
   printf '%s\n' "$salida" | grep -q '^vuelta 2 une: padre de ~ fue padre de | misma | lo confirman 2 | nada lo contradice$' &&
   ! printf '%s\n' "$salida" | grep -Eq 'une: padre de ~ (cuida a|junto a) ' &&
   ! printf '%s\n' "$salida" | grep -Eq 'une: (.* ~ )?ve a ' &&
   printf '%s\n' "$salida" | grep -q '^el while paro en la vuelta 3'; then
  echo "hilos_prueba: bien"
else
  echo "hilos_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'
  exit 1
fi
