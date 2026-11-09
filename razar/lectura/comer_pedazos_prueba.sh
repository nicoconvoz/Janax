#!/usr/bin/env bash
# comer_pedazos_prueba.sh: a book eaten by pieces (Capitan: "by pieces"), each one as a book, gives what the whole book
# gives. Six renglones: eaten whole, 6 renglones and 12 clues; eaten as its first three ("come" with "0 72") and its
# last three ("72 0"), 3 and 3 renglones, 6 and 6 clues, and a question follows the clues of either piece to its
# renglon in the file (its places count from the file's start): rio, ana and mar.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/comer.jsm" "$aqui/comer.datos.jsm" "$aqui/pregunta.jsm" "$aqui/pregunta.datos.jsm" > /dev/null || exit 1
printf '%s\n' 'O: ana es madre de eva.' 'O: eva es madre de luz.' 'O: luz es madre de mar.' \
  'O: rio es padre de flor.' 'O: sol es padre de nube.' 'O: mar es padre de cielo.' > "$d/libro.txt"
libro=$(cygpath -w "$d/libro.txt")
razar() { JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  JANAX_TABLERO="$(cygpath -w "$d/tablero")" "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/$1.bin")" | tr -d '\r'; }
casa() { rm -rf "$d/casa" "$d/tablero"; mkdir -p "$d/casa" "$d/tablero"
  cp "$d/pregunta.bin" "$d/casa/$(etiqueta pregunta)"; cp "$d/pregunta.datos" "$d/casa/$(etiqueta pregunta.datos)"; }
come() { { printf '%s' "$libro"; [ -n "$1" ] && printf '\n%s' "$1"; } > "$d/casa/$(etiqueta come)"; razar comer; }
pregunta() { printf '%s\n' "$1" > "$d/casa/$(etiqueta q)"; rm -f "$d/casa/$(etiqueta camino)" "$d/casa/$(etiqueta libro)"
  razar pregunta | grep -- '->'; }
casa; entero=$(come "" | grep '^comido')
casa; uno=$(come "0 72" | grep '^comido'); dos=$(come "72 0" | grep '^comido')
rm -f "$d/casa/$(etiqueta come)"
r1=$(pregunta '? es padre de flor'); r2=$(pregunta '? es madre de eva'); r3=$(pregunta '? es padre de cielo')
if [[ "$entero" == *'renglones=6 '*'pistas=12 '* ]] && [[ "$uno" == *'renglones=3 '*'pistas=6 '* ]] &&
   [[ "$dos" == *'renglones=3 '*'pistas=6 '* ]] && [[ "$r1" == *'rio es padre de flor'* ]] &&
   [[ "$r2" == *'ana es madre de eva'* ]] && [[ "$r3" == *'mar es padre de cielo'* ]]; then
  echo "comer_pedazos_prueba: bien"
else
  echo "comer_pedazos_prueba: MAL"; printf '%s\n' "$entero" "$uno" "$dos" "$r1" "$r2" "$r3"
  exit 1
fi
