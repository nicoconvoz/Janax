#!/usr/bin/env bash
# hilos_nitidez_prueba.sh: two words are alike as much as the places they share (Capitan: "if one 'speaks' and another
# 'says', it already knows both speak: a possible person… it becomes sharper until more information confirms it").
# A place: a form "_ <one to three words> _" and its side; one made only of words of the half (what is said everywhere)
# says nothing of anyone and does not count. With "nitidez" in the house, hilos writes "nitidas": a line {a word,
# another, how many places they share} for each two sharing two or more. Ana and eva both "dijo hola" after "la": they
# share places ("_ dijo _", "_ dijo hola _", "la _"...); rio, said once elsewhere, shares none with them. The
# file is "nitidas", a diary: each piece adds a line {the pair's key, places it shared there, a word, the other}, and a
# pair is the sum of its lines. A house of before (its "nitidas0" with what it knew) keeps it: it becomes "nitidas" and
# grows from there.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
corre() { JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$1")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r'; }
mkdir -p "$d/casa" "$d/sin" "$d/vieja"
relleno="O: $(printf 'y %.0s' $(seq 1 120))y."
printf '%s\n' 'O: vino la ana dijo hola luego.' 'O: vino la eva dijo hola luego.' 'O: una rio paso por aca.' \
  "$relleno" > "$d/casa/$(etiqueta pares)"
cp "$d/casa/$(etiqueta pares)" "$d/sin/"
cp "$d/casa/$(etiqueta pares)" "$d/vieja/"
printf si > "$d/casa/$(etiqueta nitidez)"
printf si > "$d/vieja/$(etiqueta nitidez)"
printf '0123456789abcdef 5 luz vera\n' > "$d/vieja/$(etiqueta nitidas0)"
corre "$d/casa" > "$d/casa.out"; corre "$d/sin" > "$d/sin.out"; corre "$d/vieja" > "$d/vieja.out"
ni="$d/casa/$(etiqueta nitidas)"
vi="$d/vieja/$(etiqueta nitidas)"
if grep -Eq '^[0-9a-f]{16} [2-9][0-9]* (ana eva|eva ana)$' "$ni" 2>/dev/null && ! grep -Eq ' rio( |$)' "$ni" &&
   [ ! -e "$d/sin/$(etiqueta nitidas)" ] && [ ! -e "$d/sin/$(etiqueta lugares0)" ] &&
   { cmp -s "$d/casa/$(etiqueta sabido)" "$d/sin/$(etiqueta sabido)" || [ ! -e "$d/sin/$(etiqueta sabido)" ]; } &&
   [ "$(head -1 "$vi")" = '0123456789abcdef 5 luz vera' ] && grep -Eq ' (ana eva|eva ana)$' "$vi" &&
   [ ! -e "$d/vieja/$(etiqueta nitidas0)" ]; then
  echo "hilos_nitidez_prueba: bien ($(wc -l < "$ni") parejas)"
else
  echo "hilos_nitidez_prueba: MAL"; cat "$ni" 2>/dev/null; exit 1
fi
