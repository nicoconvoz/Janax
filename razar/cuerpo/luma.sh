#!/usr/bin/env bash
# luma.sh <folder> [janaxos.exe] [clouds folder] [gaits folder]: builds luma.jsm (gen_luma.py writes it) into <folder>
# and runs it: Luma's true interface, one program and one window. Her forms grow and mutate; when their novelty runs
# out she eats the next cloud of the pantry; a cloud whose gait was heard is born as a creature in her world.
# Janax cannot list a folder of the host, so this writes two lists into <folder>/casa:
#   "despensa"   every .nube of the clouds folder (default E:/Gotching/Gotching.Godot/nubes), as comer_nubes.sh;
#   "vida-lista" every creature with its cloud and its gait (<gaits folder>/<name>.oido, default E:/tmp/marcha-oido),
#                view "-adelante", as vida.sh.
# A casa made self-contained by migrar_luma.py needs neither folder (luma.sh <folder> [janaxos.exe] is enough).
# Nothing is copied: every file is opened where it lives (request 37, read only). Her forms, what she ate, what the
# creatures learned and every verdict stay in <folder>/casa, so the next run continues.
set -u
carpeta=$1
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
janaxos=${2:-$proyecto/so/build/janaxos.exe}
nubes=${3:-E:/Gotching/Gotching.Godot/nubes}
oidos=${4:-E:/tmp/marcha-oido}
mkdir -p "$carpeta/bin" "$carpeta/casa"
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
# a casa made self-contained by migrar_luma.py ("vida-memoria" in it) needs neither folder: no list is written
if [ -f "$carpeta/casa/$(etiqueta vida-memoria)" ]; then
  echo "luma: casa propia, sin nubes ni oidos del anfitrion" >&2
  bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$carpeta/bin" "$aqui/luma.jsm" > /dev/null || exit 1
  JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" exec "$janaxos" "$(cygpath -m "$carpeta/bin/luma.bin")"
fi
# the pantry
lineas=$(mktemp); max=8; n=0
for f in "$nubes"/*.nube; do
  [ -f "$f" ] || continue
  b=$(stat -c %s "$f"); [ "$b" -gt "$max" ] && max=$b
  printf '%09d %s\n' "$b" "$(cygpath -m "$f")" >> "$lineas"; n=$((n + 1))
done
texto=$(stat -c %s "$lineas")
{ printf 'despensa1 %06d %09d %09d\n' "$n" "$max" "$texto"; cat "$lineas"; } > "$carpeta/casa/$(etiqueta despensa)"
rm -f "$lineas"
# the creatures
lineas=$(mktemp); nmax=8; omax=8; c=0
for o in "$oidos"/*-adelante.oido; do
  [ -f "$o" ] || continue
  nombre=$(basename "$o" .oido); nu="$nubes/$nombre.nube"
  [ -f "$nu" ] || continue
  bn=$(stat -c %s "$nu"); bo=$(stat -c %s "$o")
  [ "$bn" -gt "$nmax" ] && nmax=$bn; [ "$bo" -gt "$omax" ] && omax=$bo
  printf '%09d %09d %s\t%s\n' "$bn" "$bo" "$(cygpath -m "$nu")" "$(cygpath -m "$o")" >> "$lineas"; c=$((c + 1))
done
texto=$(stat -c %s "$lineas")
{ printf 'lista1 %06d %09d %09d %09d\n' "$c" "$nmax" "$omax" "$texto"; cat "$lineas"; } > "$carpeta/casa/$(etiqueta vida-lista)"
rm -f "$lineas"
echo "luma: $n nubes en la despensa, $c criaturas con su marcha" >&2
bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$carpeta/bin" "$aqui/luma.jsm" > /dev/null || exit 1
JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" "$janaxos" "$(cygpath -m "$carpeta/bin/luma.bin")"
