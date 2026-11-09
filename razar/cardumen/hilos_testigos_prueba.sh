#!/usr/bin/env bash
# hilos_testigos_prueba.sh: each join keeps its witnesses, the pairs that confirmed it (Capitan: "a truth has its
# place"): the house's "testigos", a line {the first relation, the second, 1 same way 2 the other, the pair's two
# words} for each pair the book said as the join deduces. Each join said ("une: A ~ B | ... | lo confirman N") has N
# lines. The first book is hilos_ejemplos_prueba.sh's: "padre de ~ hijo de" by ana-eva, eva-luz and luz-mar, the
# other way round. The second, in the same house, keeps the first book's lines and adds its own.
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
te="$d/casa/$(etiqueta testigos)"
cp "$te" "$d/uno.te" 2>/dev/null || : > "$d/uno.te"
printf '%s\n' 'O: rio, padre de flor.' 'O: sol, padre de nube.' 'O: flor, hijo de rio.' 'O: nube, hijo de sol.' \
  'O: rio, madre de flor.' 'O: sol, madre de nube.' "$relleno" > "$d/casa/$(etiqueta pares)"
corre "$d/casa" > "$d/dos.out"
# every join said has as many witnesses as confirmed it
cuadra() {
  grep -E '^vuelta [0-9]+ une: ' "$1" | sed -E 's/^vuelta [0-9]+ une: (.*) ~ (.*) \| (misma|al reves) \| lo confirman ([0-9]+) .*/\1\t\2\t\4/' |
  while IFS=$'\t' read -r a b n; do
    [ "$(grep -c -P "^\Q$a\E\t\Q$b\E\t[12]\t" "$2")" = "$n" ] || { echo "no: $a ~ $b ($n)"; }
  done
}
par() { grep -Pc "^padre de\thijo de\t2\t($1\t$2|$2\t$1)\tpadre de\thijo de\$" "$d/uno.te"; }
f1=$(cuadra "$d/uno.out" "$d/uno.te"); f2=$(cuadra "$d/dos.out" "$te")
n1=$(grep -c -E '^vuelta [0-9]+ une: ' "$d/uno.out"); n2=$(grep -c -E '^vuelta [0-9]+ une: ' "$d/dos.out")
if [ "$n1" -gt 0 ] && [ "$n2" -gt 0 ] && [ -z "$f1" ] && [ -z "$f2" ] &&
   [ "$(par ana eva)" = 1 ] && [ "$(par eva luz)" = 1 ] && [ "$(par luz mar)" = 1 ] &&
   [ "$(head -c "$(wc -c < "$d/uno.te")" "$te" | cmp -s - "$d/uno.te" && echo si)" = si ] &&
   [ "$(wc -l < "$te")" -gt "$(wc -l < "$d/uno.te")" ]; then
  echo "hilos_testigos_prueba: bien ($n1 y $n2 uniones)"
else
  echo "hilos_testigos_prueba: MAL"; echo "$f1"; echo "$f2"
  echo "== uno"; grep -E '^vuelta [0-9]+ une: ' "$d/uno.out"; cat "$d/uno.te"
  echo "== dos"; grep -E '^vuelta [0-9]+ une: ' "$d/dos.out"; cat "$te"
  exit 1
fi
