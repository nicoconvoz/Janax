#!/usr/bin/env bash
# conserva_prueba.sh: the school keeps each piece's total (cardumen_cubo.jsm born with conserve, as conserve_piece in
# modelo.pl): after practicing, every piece says to its neighbors in all what it said when born, and few weights reach
# the ceiling; without it, many do. voluntad_semilla.jsm asks the school at the end (order 7) and says both.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/cardumen_cubo.jsm" "$aqui/voluntad_semilla.jsm" "$aqui/voluntad_semilla.datos.jsm" > /dev/null || exit 1
corre() {   # corre <conserva>: a small practice (4^3, 300 rounds) on frames of four tokens' worth
  local c="$d/casa$1"; mkdir -p "$c"
  cp "$d/cardumen_cubo.bin" "$c/$(etiqueta hijo)"
  { for q in 0 1 2 3; do for s in 0 1 2 3 4 5; do
      printf 'M: %s %s %s 1 %s %s %s %s %s\n' $q $s $(( s == 0 )) $(( (q + s) % 7 )) $(( s % 3 + 7 )) 2 $(( q % 4 + 3 )) 1
    done; done; printf 'M: 9 0 1 0 2 3 4 5 6\nM: 9 1 0 0 1 1 2 1 1\n'; } > "$c/$(etiqueta marcos)"
  : > "$c/70"
  for v in 1001 4 300 0 0 0 0 "$1"; do h=$(printf '%016x' "$v"); for i in 14 12 10 8 6 4 2 0; do printf "\\x${h:$i:2}" >> "$c/70"; done; done
  JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$c")" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/voluntad_semilla.bin")" | tr -d '\r' | grep '^semilla en el cubo'
}
con=$(corre 1); sin=$(corre 0)
fuera=$(printf '%s' "$con" | sed -n 's/.*piezas fuera de su total: \([0-9]*\).*/\1/p')
p_con=$(printf '%s' "$con" | sed -n 's/.*pesos en el techo: \([0-9]*\)%.*/\1/p')
p_sin=$(printf '%s' "$sin" | sed -n 's/.*pesos en el techo: \([0-9]*\)%.*/\1/p')
if [ "$fuera" = 0 ] && [ -n "$p_con" ] && [ -n "$p_sin" ] && [ "$p_con" -lt "$p_sin" ]; then
  echo "conserva_prueba: bien (en el techo: $p_con% con conserva, $p_sin% sin)"
else
  echo "conserva_prueba: MAL"; echo "con: $con"; echo "sin: $sin"; exit 1
fi
