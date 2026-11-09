#!/usr/bin/env bash
# hilos_nitidez_prueba.sh: two words are alike as much as the places they share (Capitan: "if one 'speaks' and another
# 'says', it already knows both speak: a possible person… it becomes sharper until more information confirms it").
# A place: a form "_ <one to three words> _" and its side; one made only of words of the half (what is said everywhere)
# says nothing of anyone and does not count. With "nitidez" in the house, hilos writes "nitidas": a line {a word,
# another, how many places they share} for each two sharing two or more. Ana and eva both "dijo hola" after "la": they
# share places ("_ dijo _", "_ dijo hola _", "la _"...); rio, said once elsewhere, shares none with them. The
# file is "nitidas0" or "nitidas1", as "lugar" says: a line {the pair's key, places shared, a word, the other}.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
corre() { JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$1")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r'; }
mkdir -p "$d/casa" "$d/sin"
relleno="O: $(printf 'y %.0s' $(seq 1 120))y."
printf '%s\n' 'O: vino la ana dijo hola luego.' 'O: vino la eva dijo hola luego.' 'O: una rio paso por aca.' \
  "$relleno" > "$d/casa/$(etiqueta pares)"
cp "$d/casa/$(etiqueta pares)" "$d/sin/"
printf si > "$d/casa/$(etiqueta nitidez)"
corre "$d/casa" > "$d/casa.out"; corre "$d/sin" > "$d/sin.out"
ni="$d/casa/$(etiqueta nitidas$(cat "$d/casa/$(etiqueta lugar)" 2>/dev/null))"
if grep -Eq '^[0-9a-f]{16} [2-9][0-9]* (ana eva|eva ana)$' "$ni" 2>/dev/null && ! grep -Eq ' rio( |$)' "$ni" &&
   [ ! -e "$d/sin/$(etiqueta lugar)" ] && { cmp -s "$d/casa/$(etiqueta sabido)" "$d/sin/$(etiqueta sabido)" || [ ! -e "$d/sin/$(etiqueta sabido)" ]; }; then
  echo "hilos_nitidez_prueba: bien ($(wc -l < "$ni") parejas)"
else
  echo "hilos_nitidez_prueba: MAL"; cat "$ni" 2>/dev/null; exit 1
fi
