#!/usr/bin/env bash
# hilos_imagina_prueba.sh: Razar finds what a word of grammar does in what it proved, imagines with it what it never
# read, and a later book confirms it (Capitan: "'y' joins two things that are alike: that is the instruction; joined to
# other gears they make a mechanism"; "an open vote to test it when it repeats"). Book 1: the family ("padre de" with
# "hijo de", proved), and "y" between eva and luz (both children of ana), mar and sol (both of eva), and mar and nube
# (nothing is known of nube). "y" joins alike things (two of two, its pairs crossed fewer): an instruction found, not
# given. With it, mar and nube alike: nube is imagined a child of eva ("eva padre de nube"), an open vote in
# "imaginado". Book 2 says "eva, padre de nube": "confirma:".
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
y="O: $(printf 'y %.0s' $(seq 1 120))y."
corre() { JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$1")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r'; }
mkdir -p "$d/uno" "$d/dos"
printf '%s\n' 'O: ana, padre de eva.' 'O: ana, padre de luz.' 'O: eva, padre de mar.' 'O: eva, padre de sol.' \
  'O: eva, hijo de ana.' 'O: luz, hijo de ana.' 'O: mar, hijo de eva.' 'O: sol, hijo de eva.' \
  'O: eva y luz.' 'O: mar y sol.' 'O: mar y nube.' "$y" > "$d/uno/$(etiqueta pares)"
printf '%s\n' 'O: eva, padre de nube.' 'O: rio, padre de flor.' 'O: nube, hijo de eva.' 'O: flor, hijo de rio.' \
  "$y" > "$d/dos/$(etiqueta pares)"
corre "$d/uno" > "$d/uno.out"
cp "$d/uno/$(etiqueta imaginado)" "$d/uno/$(etiqueta sabido)" "$d/dos/" 2>/dev/null
corre "$d/dos" > "$d/dos.out"
if grep -Eq '^instruccion: y \| une iguales 2 de 2 \(mezcladas [01] de [0-9]+\)$' "$d/uno.out" &&
   grep -q ' i | eva padre de nube$' "$d/uno/$(etiqueta imaginado)" &&
   grep -q '^confirma: eva padre de nube$' "$d/dos.out"; then
  echo "hilos_imagina_prueba: bien"
else
  echo "hilos_imagina_prueba: MAL"
  for f in uno dos; do echo "== $f"; grep -E '^(instruc|imagin|confirma)|une:' "$d/$f.out"; done
  echo "== imaginado"; cat "$d/uno/$(etiqueta imaginado)" 2>/dev/null
  exit 1
fi
