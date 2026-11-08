#!/usr/bin/env bash
# hilos_prueba.sh: relations found in raw text, and how they relate (hilos.jsm). Nobody asks anything: the text says
# "ana, padre de eva", "eva, padre de luz", "luz, hijo de eva", "eva, hijo de ana". Every form "_ <one to three words> _"
# with two words not of the half in its places, said by two, is a relation; two relations that share their pairs, the
# same way or the other way round, are related. "padre de" and "hijo de" share two pairs the other way round; with each
# one's pairs crossed among themselves (the null) they share none.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
printf '%s\n' 'O: ana, padre de eva.' 'O: eva, padre de luz.' 'O: luz, hijo de eva.' 'O: eva, hijo de ana.' \
  'O: rosa mira a sol.' 'O: sol mira a mar.' \
  'O: y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y y.' > "$d/casa/$(etiqueta pares)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^relacion: padre de ~ hijo de | al reves | lo dicen 2 | nulo 0$'; then
  echo "hilos_prueba: bien"
else
  echo "hilos_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'
  exit 1
fi
