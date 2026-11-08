#!/usr/bin/env bash
# nunca_vista.sh: does hilos learn a relation it never saw? Each book of libros/nunca_vista.py through hilos.jsm, and
# a line each: the book, and how "vela por" (or "es cuidado por") ended: joined to "cuida a" (and which way), joined to
# something else, or alone. The null books (pairs drawn outside "cuida a") say how often a join is luck.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
python "$aqui/libros/nunca_vista.py" "$d/libros"
for f in "$d"/libros/*.txt; do
  n=$(basename "$f" .txt)
  mkdir -p "$d/c_$n"; cp "$f" "$d/c_$n/$(etiqueta pares)"
  salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/c_$n")" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
  une=$(printf '%s\n' "$salida" | grep -E ' une: ' | grep -E '(vela por|es cuidado por)' | sed 's/^vuelta [0-9]* une: //; s/ | lo confirman.*//' | head -3 | tr '\n' ';')
  if printf '%s' "$une" | grep -Eq '(cuida a ~ (vela por|es cuidado por)|(vela por|es cuidado por) ~ cuida a)'; then r="se une a cuida a: $une"
  elif [ -n "$une" ]; then r="se une a otra: $une"
  else r="sola"; fi
  printf '%s\t%s\n' "$n" "$r"
done
