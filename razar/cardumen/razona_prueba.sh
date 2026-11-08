#!/usr/bin/env bash
# razona_prueba.sh: Razar answers with an answer it never saw (memoria_pares.jsm with "canta" and "razona"). The
# books say "tu eres X? -> si, yo soy X" for three names; "felipe" is in no book: the song must still say it, because
# what it learned is where the answer repeats the question, not the answers themselves.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/memoria_pares.jsm" "$aqui/memoria_pares.datos.jsm" > /dev/null || exit 1
printf 'P: tu eres pedro?\nR: si, yo soy pedro\nP: tu eres juan?\nR: si, yo soy juan\nP: tu eres andres?\nR: si, yo soy andres\nP: tu eres tomas?\nR: si, yo soy tomas\nP: que hora es?\nR: las tres\n' \
  > "$d/casa/$(etiqueta pares)"
printf 'tu eres felipe?\n' > "$d/casa/$(etiqueta canta)"
printf '1\n' > "$d/casa/$(etiqueta razona)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/memoria_pares.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^canta: tu eres felipe? -> si yo soy felipe$'; then
  echo "razona_prueba: bien"
else
  echo "razona_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'; exit 1
fi
