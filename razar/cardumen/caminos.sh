#!/usr/bin/env bash
# caminos.sh <house> [parallel]: the paths of hilos over one book (Capitan: "a path that does not repeat is not an
# invalid path, only a new or different one"). hilos runs once as it is, and once with each rule that keeps
# relations apart suspended (the house file "suspende"). Nothing is thrown away: every join is said with its name,
#   de todos los caminos                      it is there whatever rule is suspended (what the book holds),
#   del camino de siempre, se pierde sin: ... the usual path has it, and suspending those rules loses it,
#   de un camino nuevo, aparece sin: ...      the usual path does not, and suspending those rules finds it.
# Only one rule at a time is suspended: the paths of two together are not walked. The house is never changed.
set -u
casa=$1; remos=${2:-4}
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
corre() {   # corre <name> [rule]: hilos over a copy of the house -> $d/<name>.out
  mkdir -p "$d/c_$1"; cp -r "$casa"/. "$d/c_$1"/
  rm -f "$d/c_$1/$(etiqueta suspende)"
  [ -n "${2:-}" ] && printf '%s' "$2" > "$d/c_$1/$(etiqueta suspende)"
  JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/c_$1")" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r' > "$d/$1.out"
  rm -rf "$d/c_$1"
}
uniones() { grep -E ' une: ' "$1" | sed 's/^vuelta [0-9]* une: //; s/ | lo confirman.*//' | sort -u; }
corre base
grep -E '^regla ' "$d/base.out" | sed 's/^regla \([0-9]*\):.*/\1/' > "$d/reglas"
export -f corre etiqueta; export d casa proyecto
xargs -P "$remos" -I{} bash -c 'corre s_{} {}' < "$d/reglas"
uniones "$d/base.out" > "$d/base.u"
: > "$d/todas.u"
while read -r r; do
  uniones "$d/s_$r.out" > "$d/s_$r.u"
  comm -23 "$d/base.u" "$d/s_$r.u" | sed "s/\$/\t-$r/" >> "$d/todas.u"   # lost without it
  comm -13 "$d/base.u" "$d/s_$r.u" | sed "s/\$/\t+$r/" >> "$d/todas.u"   # found without it
done < "$d/reglas"
forma() { grep -E "^regla $1: " "$d/base.out" | sed 's/^regla [0-9]*: //; s/ | frena.*//'; }
echo "caminos: el de siempre y $(wc -l < "$d/reglas") con una regla suspendida"
while read -r u; do
  sin=$(awk -F'\t' -v u="$u" '$1 == u && $2 ~ /^-/ { print substr($2, 2) }' "$d/todas.u")
  if [ -z "$sin" ]; then echo "de todos los caminos: $u"
  else echo "del camino de siempre, se pierde sin: $(for r in $sin; do printf '[%s] ' "$(forma "$r")"; done)| $u"; fi
done < "$d/base.u"
cut -f1 "$d/todas.u" | sort -u | comm -23 - "$d/base.u" | while read -r u; do
  con=$(awk -F'\t' -v u="$u" '$1 == u && $2 ~ /^[+]/ { print substr($2, 2) }' "$d/todas.u")
  echo "de un camino nuevo, aparece sin: $(for r in $con; do printf '[%s] ' "$(forma "$r")"; done)| $u"
done
