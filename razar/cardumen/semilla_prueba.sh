#!/usr/bin/env bash
# semilla_prueba.sh: the book's own answers as the seed (memoria_pares.jsm with "semilla"). The book answers "que es X?"
# with "X es un ..." twice; the third question is left out, and of the two sentences that say "marte", the one that
# sings like those answers is its answer: the song must find it, and not an answer it read.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/memoria_pares.jsm" "$aqui/memoria_pares.datos.jsm" > /dev/null || exit 1
printf '%s\n' 'Q: que es el sol?' 'O: el sol es una estrella grande.' 'O: marte tiene dos lunas chicas.' \
  'O: es que el una es que el una es que el una es que el una es que el una es que el una es que el una de la y.' \
  'Q: que es la luna?' 'O: la luna es una piedra fria.' 'O: es que el una es que el una es que el una es que el una es que el una es que el una es que el una de la y.' \
  'Q: que es marte?' 'O: marte es una roca roja.' > "$d/casa/$(etiqueta pares)"
printf '1\n' > "$d/casa/$(etiqueta semilla)"
printf '3 3\n' > "$d/casa/$(etiqueta fuera)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/memoria_pares.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^P: que es marte? | canto: marte es una roca roja\. | '; then
  echo "semilla_prueba: bien"
else
  echo "semilla_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'; exit 1
fi
