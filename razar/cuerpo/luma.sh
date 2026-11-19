#!/usr/bin/env bash
# luma.sh <folder> [janaxos.exe] [clouds folder] [gaits folder]: builds luma.jsm (gen_luma.py writes it) into <folder>
# and runs it: Luma, one program and one window. Her forms grow and mutate; when their novelty runs out she eats the
# next cloud of the pantry; a cloud whose gait was heard is born as a creature in her world.
# SHE AND RAZAR ARE ONE BEING (gen_leer.py): luma.bin holds her body and her reader, and reading is an act of hers.
# For that her house gets, each time she is built: herself as the reader she launches ("luma/lectora.bin") and the
# reader's initial data ("luma/lectora.molde": pulso.datos). And once, if they are not there: "p" (how the reader
# reads: K 10, one reading, awake for good, so it says which shelf it read) and her first book ("libro": LUMA_LIBRO,
# any text; every file of the house whose label starts with "libro" is read).
# Janax cannot list a folder of the host, so this writes two lists into <folder>/casa:
#   "despensa"   every .nube of the clouds folder (default E:/Gotching/Gotching.Godot/nubes), as comer_nubes.sh;
#   "vida-lista" every creature with its cloud and its gait (<gaits folder>/<name>.oido, default E:/tmp/marcha-oido),
#                view "-adelante", as vida.sh.
# A casa made self-contained by migrar_luma.py needs neither folder (luma.sh <folder> [janaxos.exe] is enough).
# Nothing is copied: every file is opened where it lives (request 37, read only). Her forms, what she ate, what she
# read, what the creatures learned and every verdict stay in <folder>/casa, so the next run continues.
set -u
carpeta=$1
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
janaxos=${2:-$proyecto/so/build/janaxos.exe}
nubes=${3:-E:/Gotching/Gotching.Godot/nubes}
oidos=${4:-E:/tmp/marcha-oido}
lectura="$proyecto/razar/lectura"
mkdir -p "$carpeta/bin" "$carpeta/casa"
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
armar() {
  # built again only if a source of hers changed: she is born many times (she sleeps when she feels like it), and a
  # build writes its sources again, texts the vigia would eat every time for nothing
  nuevo=
  for f in "$aqui/luma.jsm" "$lectura/pulso.datos.jsm" "$lectura"/*.inc; do
    [ "$f" -nt "$carpeta/bin/luma.bin" ] && { nuevo=$f; break; }
  done
  if [ ! -f "$carpeta/bin/luma.bin" ] || [ ! -f "$carpeta/bin/pulso.datos" ] || [ -n "$nuevo" ]; then
    bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$carpeta/bin" "$aqui/luma.jsm" "$lectura/pulso.datos.jsm" > /dev/null || exit 1
  fi
  # her reader is herself: the same program, in her house, with the reader's initial data beside it
  cmp -s "$carpeta/bin/luma.bin" "$carpeta/casa/$(etiqueta luma/lectora.bin)" \
    || cp "$carpeta/bin/luma.bin" "$carpeta/casa/$(etiqueta luma/lectora.bin)"
  cmp -s "$carpeta/bin/pulso.datos" "$carpeta/casa/$(etiqueta luma/lectora.molde)" \
    || cp "$carpeta/bin/pulso.datos" "$carpeta/casa/$(etiqueta luma/lectora.molde)"
  [ -f "$carpeta/casa/$(etiqueta p)" ] \
    || printf '\x0a\x00\x00\x00\x00\x00\x00\x00\x01\x01\x00\x00\x01\x01\x00\x00' > "$carpeta/casa/$(etiqueta p)"
  if [ -n "${LUMA_LIBRO:-}" ] && [ ! -f "$carpeta/casa/$(etiqueta libro)" ]; then
    cp "$LUMA_LIBRO" "$carpeta/casa/$(etiqueta libro)"
  fi
}
# a casa made self-contained by migrar_luma.py ("vida-memoria" in it) needs neither folder: no list is written
if [ -f "$carpeta/casa/$(etiqueta vida-memoria)" ]; then
  echo "luma: casa propia, sin nubes ni oidos del anfitrion" >&2
  armar
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
armar
JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" "$janaxos" "$(cygpath -m "$carpeta/bin/luma.bin")"
