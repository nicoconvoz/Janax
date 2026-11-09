#!/usr/bin/env bash
# hilos_lugares_prueba.sh: the places travel from book to book (Capitan: "that they travel"): ana is read in one book,
# eva in the next one, in the same house; the second book wakes the places of its own forms and finds ana there, so
# ana and eva share places though no book says both ("nitidas": "ana eva k"). Rio's book wakes none of theirs. The
# third book says eva's line again: ana and eva were counted already, and are not counted twice.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
corre() { JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$1")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r'; }
mkdir -p "$d/casa"
relleno="O: $(printf 'y %.0s' $(seq 1 120))y."
printf si > "$d/casa/$(etiqueta nitidez)"
libro() { printf '%s\n' "$@" "$relleno" > "$d/casa/$(etiqueta pares)"; corre "$d/casa" > /dev/null; }
libro 'O: vino la ana dijo hola luego.'
libro 'O: una rio paso por aca.'
libro 'O: vino la eva dijo hola luego.'
ni="$d/casa/$(etiqueta nitidas$(cat "$d/casa/$(etiqueta lugar)" 2>/dev/null))"
cp "$ni" "$d/dos.ni" 2>/dev/null
libro 'O: vino la eva dijo hola luego.'
ni="$d/casa/$(etiqueta nitidas$(cat "$d/casa/$(etiqueta lugar)"))"
if grep -Eq '^[0-9a-f]{16} [2-9][0-9]* (ana eva|eva ana)$' "$d/dos.ni" && ! grep -Eq ' rio( |$)' "$ni" &&
   [ "$(grep -Ec ' (ana eva|eva ana)$' "$ni")" = 1 ] && [ "$(grep -E ' (ana eva|eva ana)$' "$ni" | cut -d' ' -f2)" = "$(grep -E ' (ana eva|eva ana)$' "$d/dos.ni" | cut -d' ' -f2)" ] && [ -s "$d/casa/$(etiqueta lugar)" ]; then
  echo "hilos_lugares_prueba: bien"
else
  echo "hilos_lugares_prueba: MAL"; cat "$ni" 2>/dev/null; ls "$d/casa"; exit 1
fi
