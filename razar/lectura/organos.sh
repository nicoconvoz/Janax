#!/usr/bin/env bash
# organos.sh <folder> <book> <trials> [engine] [vigil] [audit]: Razar grows organs inside Janax OS. The folder gets the book,
# "p" (K 10, one reading, one generation, awake for good if vigil is 1, the trials asked, an audit of that many organs
# instead if audit is more than 0), and Razar built, with its molde, under PDP/: every candidate is that same program
# with its letters in its own initial data (hijo.datos), and an organ that wins stays in pulso.datos. Nothing is built
# in there. Then Razar runs there. Its recipes go to the board (JANAX_TABLERO, ~/razar_tablero if none).
set -u
carpeta=$1; libro=$2; intentos=$3; motor=${4:-traductor}; vigilia=${5:-0}; auditoria=${6:-0}; paisaje=${7:-0}
# [landscape]: every organ of up to that many letters sits the exam instead (the whole landscape, to study it)
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
armado="$carpeta.armado"
rm -rf "$carpeta" "$armado"; mkdir -p "$carpeta" "$armado"
tablero=${JANAX_TABLERO:-$(cygpath -m "$HOME/razar_tablero")}   # its recipes live on the board, never lost with the folder
mkdir -p "$(cygpath -u "$tablero")"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$armado" \
  "$aqui/pulso.jsm" "$aqui/pulso.datos.jsm" || exit 1
cp "$libro" "$carpeta/$(etiqueta libro)"
if [ -n "${LLAVE:-}" ]; then   # its key for the board (16 hex digits, LLAVE=...): Razar has nothing unique of its own
  printf '%s' "$LLAVE" | xxd -r -p > "$carpeta/$(etiqueta llave)"
fi
printf '\x0a\x00\x00\x00\x00\x00\x00\x00\x01\x01\x00\x00'"$(printf '\\x%02x\\x%02x\\x%02x\\x%02x' "$vigilia" "$intentos" "$auditoria" "$paisaje")" \
  > "$carpeta/$(etiqueta p)"
arbol=razar; [ "$vigilia" = 1 ] && arbol=razar1  # awake for good it has a number: its own tree, PDP/razarN
for f in "$armado/pulso.bin" "$armado/pulso.datos" "$aqui/organo.molde" "$aqui/organo.inc"; do
  cp "$f" "$carpeta/$(etiqueta "PDP/$arbol/lectura/$(basename "$f")")"
done
JANAX_MOTOR=$motor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$carpeta")" JANAX_TABLERO="$tablero" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$armado/pulso.bin")" | tr -d '\r'
# and a copy anyone can open from Windows: <board>/Receta de Organos/recetas.txt (recetas1.txt... for each Razar)
b=$(cygpath -u "$tablero"); h=$(etiqueta "tablero/Receta de Organos/recetas")
for f in "$b/$h"*; do
  [ -f "$f" ] || continue
  n=$(basename "$f"); n=${n#$h}; n=$(printf '%s' "$n" | xxd -r -p)
  mkdir -p "$b/Receta de Organos"; cp "$f" "$b/Receta de Organos/recetas$n.txt"
done
