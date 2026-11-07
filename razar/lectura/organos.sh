#!/usr/bin/env bash
# organos.sh <folder> <book> <trials> [engine] [vigil] [audit]: Razar grows organs inside Janax OS. The folder gets the book,
# "p" (K 10, one reading, one generation, awake for good if vigil is 1, the trials asked, an audit of that many organs instead if audit is more than 0), the PDP assembler and
# Razar's own sources under PDP/, so it can write organo.inc, build itself and launch the candidates as its children. Then Razar runs there.
set -u
carpeta=$1; libro=$2; intentos=$3; motor=${4:-traductor}; vigilia=${5:-0}; auditoria=${6:-0}; paisaje=${7:-0}
# [landscape]: every organ of up to that many letters sits the exam instead (the whole landscape, to study it)
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
armado="$carpeta.armado"
rm -rf "$carpeta" "$armado"; mkdir -p "$carpeta" "$armado"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$armado" \
  "$aqui/pulso.jsm" "$aqui/pulso.datos.jsm" || exit 1
cp "$libro" "$carpeta/$(etiqueta libro)"
if [ -n "${LLAVE:-}" ]; then   # its key for the board (16 hex digits, LLAVE=...): Razar has nothing unique of its own
  printf '%s' "$LLAVE" | xxd -r -p > "$carpeta/$(etiqueta llave)"
fi
printf '\x0a\x00\x00\x00\x00\x00\x00\x00\x01\x01\x00\x00'"$(printf '\\x%02x\\x%02x\\x%02x\\x%02x' "$vigilia" "$intentos" "$auditoria" "$paisaje")" \
  > "$carpeta/$(etiqueta p)"
cp "$armado/pdp/ensamblador.bin" "$carpeta/$(etiqueta ensamblador.bin)"
cp "$armado/pdp/ensamblador.datos" "$carpeta/$(etiqueta ensamblador.datos)"
arbol=razar; [ "$vigilia" = 1 ] && arbol=razar1  # awake for good it has a number: its own tree, PDP/razarN
for f in "$aqui"/*.inc "$aqui/pulso.jsm" "$aqui/pulso.datos.jsm" "$aqui/organo.molde"; do
  cp "$f" "$carpeta/$(etiqueta "PDP/$arbol/lectura/$(basename "$f")")"
done
JANAX_MOTOR=$motor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$carpeta")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$armado/pulso.bin")" | tr -d '\r'
