#!/usr/bin/env bash
# hilos_prueba.sh: relations found in raw text, joined by a while (hilos.jsm). Nobody asks anything: the text says
# "ana, padre de eva", "eva, hijo de ana", ... and "rosa fue padre de sol", "sol, hijo de rosa". Every form "_ <one to
# three words> _" with two words not of the half in its places, said by two, is a relation; two that share their
# pairs (the same way or the other way round) more than their null (each one's pairs crossed) relate. Each turn of
# the while, a relation joins the one it relates to most, if that one chooses it too: turn 1 joins "padre de" and
# "hijo de" (three pairs the other way round); turn 2, "fue padre de", which shares nothing with "padre de" but two
# pairs with what "hijo de" brought; turn 3 joins nothing, and the while ends.
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
  "O: $(printf 'y %.0s' $(seq 1 60))y." > "$d/casa/$(etiqueta pares)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^vuelta 1 une: padre de ~ hijo de | al reves | lo dicen 3 | nulo 0$' &&
   printf '%s\n' "$salida" | grep -q '^vuelta 2 une: padre de ~ fue padre de | misma | lo dicen 2 | nulo 0$' &&
   printf '%s\n' "$salida" | grep -q '^el while paro en la vuelta 3'; then
  echo "hilos_prueba: bien"
else
  echo "hilos_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'
  exit 1
fi
