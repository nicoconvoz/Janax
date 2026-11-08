#!/usr/bin/env bash
# hilos_poda_prueba.sh: what hilos knows sleeps when a book says the other thing, and wakes when one confirms it again
# (Capitan: "pruning is sleeping for a while, not removing: nothing is thrown away"). Book 1: the family, "padre de"
# and "hijo de" join, the other way round. Book 2 says each pair both as "padre de" and as "hijo de" the same way: the
# line is against it (two, none for it), so it sleeps ("duerme:") and is kept marked " dormida". Book 3 says nothing
# of them: the sleeping line is kept as it is. (Book 2 also joins them its own way, the same way round: that one is
# known awake, the old one asleep.) Book 4, another family said well (two pairs, none against): the old one wakes
# ("despierta lo sabido:") and book 2's sleeps, for book 4 is against it. Two beliefs, none thrown away: each book
# keeps awake the one it holds.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
y="O: $(printf 'y %.0s' $(seq 1 120))y."
sab=$(etiqueta sabido)
libro() {   # libro <n> <lines...>: book n read with the sabido the one before left
  n=$1; shift; mkdir -p "$d/$n"
  printf '%s\n' "$@" "$y" > "$d/$n/$(etiqueta pares)"
  [ "$n" -gt 1 ] && cp "$d/$((n - 1))/$sab" "$d/$n/"
  JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/$n")" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r' > "$d/$n.out"
}
libro 1 'O: ana, padre de eva.' 'O: eva, padre de luz.' 'O: luz, padre de mar.' \
  'O: eva, hijo de ana.' 'O: luz, hijo de eva.' 'O: mar, hijo de luz.'
libro 2 'O: rio, padre de flor.' 'O: rio, hijo de flor.' 'O: sol, padre de nube.' 'O: sol, hijo de nube.'
libro 3 'O: rio ve a flor.' 'O: sol ve a nube.'
libro 4 'O: rio, padre de flor.' 'O: flor, hijo de rio.' 'O: sol, padre de nube.' 'O: nube, hijo de sol.'
if grep -q '^duerme: hijo de ~ padre de | en contra 2, a favor 0$' "$d/2.out" &&
   ! grep -q '^sabe: padre de ~ hijo de' "$d/2.out" &&
   grep -q ' dormida | hijo de ~ padre de$' "$d/2/$sab" &&
   grep -q ' dormida | hijo de ~ padre de$' "$d/3/$sab" &&
   grep -q '^despierta lo sabido: sabe: padre de ~ hijo de | al reves$' "$d/4.out" &&
   grep -Eq '^[0-9a-f]{16} [0-9a-f]{16} 2 \| hijo de ~ padre de$' "$d/4/$sab" &&
   grep -Eq '^[0-9a-f]{16} [0-9a-f]{16} 1 dormida \| hijo de ~ padre de$' "$d/4/$sab"; then
  echo "hilos_poda_prueba: bien"
else
  echo "hilos_poda_prueba: MAL"
  for n in 1 2 3 4; do echo "== $n"; grep -E '^(sabe|duerme|despierta|sabido)|une:' "$d/$n.out"; echo "-- sabido"; cat "$d/$n/$sab"; done
  exit 1
fi
