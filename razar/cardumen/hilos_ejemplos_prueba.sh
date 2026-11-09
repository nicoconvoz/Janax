#!/usr/bin/env bash
# hilos_ejemplos_prueba.sh: the pairs each relation holds go with it to the next book, as the joins go in "sabido"
# (Capitan: "do not restart it again"): the house's "ejemplos", a line each pair of a form in a relation of two forms
# or more. The first book is hilos_sabido_prueba.sh's: "padre de" and "hijo de" join, three pairs each, and so do
# "padre" and "hijo" (ana and de, ...): twelve lines. The second, in the same house, says "ana, padre de eva" again,
# four new pairs, and rio and sol with "de": the file then has eighteen, each once.
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
printf '%s\n' 'O: ana, padre de eva.' 'O: eva, padre de luz.' 'O: luz, padre de mar.' \
  'O: eva, hijo de ana.' 'O: luz, hijo de eva.' 'O: mar, hijo de luz.' "$relleno" > "$d/casa/$(etiqueta pares)"
corre "$d/casa" > "$d/uno.out"
ej="$d/casa/$(etiqueta ejemplos)"
cp "$ej" "$d/uno.ej" 2>/dev/null
printf '%s\n' 'O: ana, padre de eva.' 'O: rio, padre de flor.' 'O: sol, hijo de nube.' 'O: rio, padre de cielo.' \
  'O: sol, hijo de rosa.' "$relleno" > "$d/casa/$(etiqueta pares)"
corre "$d/casa" > "$d/dos.out"
par() { grep -Pc "^[0-9a-f]{16}\t[0-9a-f]{16}\t$1\t$2\t$3\$" "$ej"; }
if [ "$(wc -l < "$d/uno.ej")" = 12 ] && [ "$(wc -l < "$ej")" = 18 ] && [ -z "$(cut -f1 "$ej" | sort | uniq -d)" ] &&
   [ "$(par 'padre de' ana eva)" = 1 ] && [ "$(par 'hijo de' mar luz)" = 1 ] &&
   [ "$(par 'padre de' rio cielo)" = 1 ] && [ "$(par 'hijo de' sol rosa)" = 1 ]; then
  echo "hilos_ejemplos_prueba: bien"
else
  echo "hilos_ejemplos_prueba: MAL"
  echo "== uno"; cat "$d/uno.ej"; echo "== dos"; cat "$ej"; echo "lineas $(wc -l < "$d/uno.ej") $(wc -l < "$ej") | $(par "padre de" ana eva) $(par "hijo de" mar luz) $(par "padre de" rio cielo) $(par "hijo de" sol rosa)"
  grep -E '^(sabe|vuelta)' "$d/dos.out"
  exit 1
fi
