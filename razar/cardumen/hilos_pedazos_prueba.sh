#!/usr/bin/env bash
# hilos_pedazos_prueba.sh: a book longer than a piece is read by pieces by hilos itself (Capitan: "that it cuts them on
# its own"): it reads one, keeps what it learned (sabido, pendiente, ejemplos), writes in "sigue" where the next one
# starts and remakes itself (36), its memory given back. The house says the piece ("pedazo": 300 bytes here). The
# memory it leaves is the one the same pieces leave read one by one, each with what the one before left.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
corre() { JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$1")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r'; }
relleno="O: $(printf 'y %.0s' $(seq 1 40))y."
{ for i in 1 2; do
    printf '%s\n' 'O: ana, padre de eva.' 'O: eva, padre de luz.' 'O: luz, padre de mar.' "$relleno" \
      'O: eva, hijo de ana.' 'O: luz, hijo de eva.' 'O: mar, hijo de luz.' "$relleno" \
      'O: rio, padre de flor.' 'O: flor, hijo de rio.' 'O: sol, padre de nube.' 'O: nube, hijo de sol.' "$relleno"
  done; } > "$d/libro.txt"
# by itself: the whole book, the piece in the house, the program there to remake itself
mkdir -p "$d/sola"
cp "$d/libro.txt" "$d/sola/$(etiqueta pares)"
printf '300' > "$d/sola/$(etiqueta pedazo)"
cp "$d/hilos.bin" "$d/sola/$(etiqueta hilos)"; cp "$d/hilos.datos" "$d/sola/$(etiqueta hilos.datos)"
corre "$d/sola" > "$d/sola.out"
# by hand: the same cuts (past the first line end 300 bytes after a piece's start), one by one
total=$(wc -c < "$d/libro.txt"); desde=0; n=0; prev=""
while [ "$desde" -lt "$total" ]; do
  hasta=$(( desde + 300 ))
  if [ "$hasta" -lt "$total" ]; then
    hasta=$(( hasta + $(tail -c +$(( hasta + 1 )) "$d/libro.txt" | head -1 | wc -c) ))
  else hasta=$total; fi
  n=$((n + 1)); c="$d/mano$n"; mkdir -p "$c"
  tail -c +$(( desde + 1 )) "$d/libro.txt" | head -c $(( hasta - desde )) > "$c/$(etiqueta pares)"
  [ -n "$prev" ] && for f in sabido pendiente ejemplos; do cp "$prev/$(etiqueta $f)" "$c/" 2>/dev/null; done
  corre "$c" > "$c.out"; prev=$c; desde=$hasta
done
s1="$d/sola/$(etiqueta sabido)"; s2="$prev/$(etiqueta sabido)"
if [ "$n" -gt 2 ] && [ -s "$s1" ] && cmp -s "$s1" "$s2" &&
   cmp -s "$d/sola/$(etiqueta ejemplos)" "$prev/$(etiqueta ejemplos)" &&
   cmp -s "$d/sola/$(etiqueta pendiente)" "$prev/$(etiqueta pendiente)" &&
   [ ! -e "$d/sola/$(etiqueta sigue)" ] && [ "$(grep -c '^palabras:' "$d/sola.out")" = "$n" ]; then
  echo "hilos_pedazos_prueba: bien ($n pedazos)"
else
  echo "hilos_pedazos_prueba: MAL ($n pedazos a mano, $(grep -c '^palabras:' "$d/sola.out") solo)"
  echo "== sola"; cat "$s1" 2>/dev/null; echo "== a mano"; cat "$s2" 2>/dev/null
  exit 1
fi
