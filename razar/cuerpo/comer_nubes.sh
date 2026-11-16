#!/usr/bin/env bash
# comer_nubes.sh <folder> [janaxos.exe] [clouds folder]: builds comer_nubes.jsm (gen_comer.py writes it) into
# <folder> and runs it: Razar's own forms, fed on Gotching's particle clouds, in Janax's window until it is closed.
# Janax cannot list a folder of the host, so this writes the pantry: <folder>/casa/"despensa", the path of every .nube
# of the clouds folder (default E:/Gotching/Gotching.Godot/nubes) with its bytes. The clouds are never copied: Razar
# opens each one where it lives (request 37, read only). What it ate, its bricks, its forms and its archive stay in
# <folder>/casa, so the next run continues with the uneaten ones. It answers the forms it created.
set -u
carpeta=$1
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
janaxos=${2:-$proyecto/so/build/janaxos.exe}
nubes=${3:-E:/Gotching/Gotching.Godot/nubes}
mkdir -p "$carpeta/bin" "$carpeta/casa"
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
lineas=$(mktemp)
max=8; n=0
for f in "$nubes"/*.nube; do
  [ -f "$f" ] || continue
  b=$(stat -c %s "$f"); [ "$b" -gt "$max" ] && max=$b
  printf '%09d %s\n' "$b" "$(cygpath -m "$f")" >> "$lineas"; n=$((n + 1))
done
texto=$(stat -c %s "$lineas")
{ printf 'despensa1 %06d %09d %09d\n' "$n" "$max" "$texto"; cat "$lineas"; } > "$carpeta/casa/$(etiqueta despensa)"
rm -f "$lineas"
bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$carpeta/bin" "$aqui/comer_nubes.jsm" > /dev/null || exit 1
JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" "$janaxos" "$(cygpath -m "$carpeta/bin/comer_nubes.bin")"
