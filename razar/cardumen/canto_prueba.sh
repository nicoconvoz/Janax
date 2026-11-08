#!/usr/bin/env bash
# canto_prueba.sh: Razar's own song (memoria_pares.jsm with a "canta" file), on a house of four pairs. "hola primo" is
# no question of the books, but what the books answer after "hola ...o" is said by two of them: the song it composes
# must be "buen dia", sung from the songs, not looked up.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/memoria_pares.jsm" "$aqui/memoria_pares.datos.jsm" > /dev/null || exit 1
printf 'P: hola amigo\nR: buen dia\nP: hola hermano\nR: buen dia\nP: que hora es\nR: las tres\nP: que hora tienes\nR: las tres\n' \
  > "$d/casa/$(etiqueta pares)"
printf 'hola primo\n' > "$d/casa/$(etiqueta canta)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/memoria_pares.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^canta: hola primo -> buen dia$'; then
  echo "canto_prueba: bien"
else
  echo "canto_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'; exit 1
fi
