#!/usr/bin/env bash
# hilos_sabido_prueba.sh: what hilos proved in one book goes with it to the next (the house's "sabido"). The first book
# is the family of hilos_prueba.sh: "padre de" and "hijo de" join, the other way round. The second has other people
# and too little to join them on its own (one pair each). Without "sabido" nothing joins; with the first book's, it
# says "sabe: padre de ~ hijo de | al reves" before its first turn, and keeps the line for the book after.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
corre() { JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$1")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r'; }
mkdir -p "$d/uno" "$d/dos" "$d/solo"
printf '%s\n' 'O: ana, padre de eva.' 'O: eva, padre de luz.' 'O: luz, padre de mar.' \
  'O: eva, hijo de ana.' 'O: luz, hijo de eva.' 'O: mar, hijo de luz.' \
  "O: $(printf 'y %.0s' $(seq 1 120))y." > "$d/uno/$(etiqueta pares)"
printf '%s\n' 'O: rio, padre de flor.' 'O: sol, hijo de nube.' 'O: rio, padre de cielo.' 'O: sol, hijo de rosa.' \
  "O: $(printf 'y %.0s' $(seq 1 120))y." > "$d/dos/$(etiqueta pares)"
cp "$d/dos/$(etiqueta pares)" "$d/solo/"
corre "$d/uno" > "$d/uno.out"
cp "$d/uno/$(etiqueta sabido)" "$d/dos/"
corre "$d/dos" > "$d/dos.out"
corre "$d/solo" > "$d/solo.out"
if grep -q 'une: padre de ~ hijo de | al reves' "$d/uno.out" &&
   grep -q '^sabe: padre de ~ hijo de | al reves$' "$d/dos.out" &&
   ! grep -Eq 'une: (padre de|hijo de) ~ (padre de|hijo de)' "$d/solo.out" &&
   ! grep -q '^sabe:' "$d/solo.out" &&
   grep -q '| hijo de ~ padre de$' "$d/dos/$(etiqueta sabido)"; then
  echo "hilos_sabido_prueba: bien"
else
  echo "hilos_sabido_prueba: MAL"
  for f in uno dos solo; do echo "== $f"; grep -Ev '^(modo|costo|remeros|nativo|ventanilla)' "$d/$f.out"; done
  echo "== sabido"; cat "$d/dos/$(etiqueta sabido)"
  exit 1
fi
