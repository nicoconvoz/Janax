#!/usr/bin/env bash
# hilos_pendiente_prueba.sh: what a book left to solve is checked in the next (Capitan: "it leaves something on its
# mind to solve, and when it finds where to check it, it checks it"). Book 1: "padre de" and "hijo de" say two pairs
# each (a relation is said by two) and share one, turned: one confirmation, not enough to join, so it is left pending
# (once, though the two forms meet both ways). Book 2, other people, the same again: alone it joins nothing; with book
# 1's "pendiente" it is two, from two books, and it checks it ("verifica:") and knows it.
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
mkdir -p "$d/uno" "$d/dos" "$d/solo"
printf '%s\n' 'O: rio, padre de flor.' 'O: ana, padre de eva.' 'O: flor, hijo de rio.' 'O: mar, hijo de luz.' "$y" \
  > "$d/uno/$(etiqueta pares)"
printf '%s\n' 'O: sol, padre de nube.' 'O: cielo, padre de mar.' 'O: nube, hijo de sol.' 'O: flor, hijo de rosa.' "$y" \
  > "$d/dos/$(etiqueta pares)"
cp "$d/dos/$(etiqueta pares)" "$d/solo/"
corre "$d/uno" > "$d/uno.out"
cp "$d/uno/$(etiqueta pendiente)" "$d/dos/"
corre "$d/dos" > "$d/dos.out"
corre "$d/solo" > "$d/solo.out"
pend="$d/uno/$(etiqueta pendiente)"
if [ "$(grep -cE '\| (padre de ~ hijo de|hijo de ~ padre de)$' "$pend")" = 1 ] &&
   ! grep -Eq 'une: (padre de|hijo de) ~ ' "$d/uno.out" &&
   grep -Eq '^verifica: sabe: (padre de ~ hijo de|hijo de ~ padre de) \| al reves$' "$d/dos.out" &&
   ! grep -q '^verifica:' "$d/solo.out" && ! grep -Eq 'une: (padre de|hijo de) ~ ' "$d/solo.out" &&
   grep -Eq '\| (padre de ~ hijo de|hijo de ~ padre de)$' "$d/dos/$(etiqueta sabido)"; then
  echo "hilos_pendiente_prueba: bien"
else
  echo "hilos_pendiente_prueba: MAL"
  for f in uno dos solo; do echo "== $f"; grep -E '^(sabe|verifica|pendientes|sabido)|une:' "$d/$f.out"; done
  echo "== pendiente de uno"; cat "$pend"; echo "== sabido de dos"; cat "$d/dos/$(etiqueta sabido)" 2>/dev/null
  exit 1
fi
