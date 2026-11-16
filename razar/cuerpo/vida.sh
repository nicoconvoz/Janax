#!/usr/bin/env bash
# vida.sh <folder> [janaxos.exe] [clouds folder] [gaits folder]: builds vida.jsm (gen_vida.py writes it) into <folder>
# and runs it: Gotching's creatures living together in Janax's window, until it is closed.
# Janax cannot list a folder of the host, so this writes the list: <folder>/casa/"lista", every creature that has both
# its cloud (<clouds folder>/<name>.nube, default E:/Gotching/Gotching.Godot/nubes) and its gait as the bat heard it
# (<gaits folder>/<name>.oido, default E:/tmp/marcha-oido), one view only ("-adelante"), with the bytes of each file.
# Nothing is copied: Razar opens each file where it lives (request 37, read only). What they learned ("aprendido") and
# every piece they tried ("archivo") stay in <folder>/casa, so the next run continues. It answers the pieces kept.
set -u
carpeta=$1
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
janaxos=${2:-$proyecto/so/build/janaxos.exe}
nubes=${3:-E:/Gotching/Gotching.Godot/nubes}
oidos=${4:-E:/tmp/marcha-oido}
mkdir -p "$carpeta/bin" "$carpeta/casa"
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
lineas=$(mktemp)
nmax=8; omax=8; n=0
for o in "$oidos"/*-adelante.oido; do
  [ -f "$o" ] || continue
  nombre=$(basename "$o" .oido); nu="$nubes/$nombre.nube"
  [ -f "$nu" ] || continue
  bn=$(stat -c %s "$nu"); bo=$(stat -c %s "$o")
  [ "$bn" -gt "$nmax" ] && nmax=$bn; [ "$bo" -gt "$omax" ] && omax=$bo
  printf '%09d %09d %s\t%s\n' "$bn" "$bo" "$(cygpath -m "$nu")" "$(cygpath -m "$o")" >> "$lineas"; n=$((n + 1))
done
texto=$(stat -c %s "$lineas")
{ printf 'lista1 %06d %09d %09d %09d\n' "$n" "$nmax" "$omax" "$texto"; cat "$lineas"; } > "$carpeta/casa/$(etiqueta lista)"
rm -f "$lineas"
echo "vida: $n criaturas" >&2
bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$carpeta/bin" "$aqui/vida.jsm" > /dev/null || exit 1
JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" "$janaxos" "$(cygpath -m "$carpeta/bin/vida.bin")"
