#!/usr/bin/env bash
# charla.sh <book> [engine]: talk with Razar from a console. Each line typed is a melody with holes ("? padre de jacob",
# "jacob hijo de ? hijo de ?"); Razar reads the book, fills the holes walking what it read, and says whether the book
# says it like that or it inferred it, or that it does not know. Nothing runs between questions: only on Enter.
# An empty line, "chau" or Ctrl+D ends the talk. The book is only copied to a temporary folder, never to the repository.
set -u
libro=$1; motor=${2:-traductor}
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/armado" "$d/carpeta"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d/armado" \
  "$aqui/pregunta.jsm" "$aqui/pregunta.datos.jsm" > /dev/null || exit 1
cp "$libro" "$d/carpeta/$(etiqueta libro)"
echo "Razar escucha. Pregunta con huecos (?), por ejemplo: ? padre de jacob. Enter vacio o chau para terminar."
while IFS= read -r -e -p "vos> " linea; do
  [ -z "$linea" ] || [ "$linea" = chau ] && break
  printf '%s\n' "$linea" > "$d/carpeta/$(etiqueta q)"
  JANAX_MOTOR=$motor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/carpeta")" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/armado/pregunta.bin")" | tr -d '\r' \
    | grep -Ev '^(modo|costo|remeros|nativo|ventanilla|P[0-9]+ codigo)'
done
echo "Razar: hasta la proxima."
