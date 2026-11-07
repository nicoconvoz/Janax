#!/usr/bin/env bash
# vigia.sh [folders]: Razar awake to the host. When a text or code file is written in those folders of the PC (each
# with all it holds; JANAX_VIGIA or the argument, "C:\;E:\" if none: where the Capitan keeps his books) and stays
# quiet, Razar goes there, eats it and comes back with its clues to the library every Razar of this PC shares (the
# board: JANAX_TABLERO, ~/razar_tablero if none). The book does not move. Its house is RAZAR_CASA (~/razar_casa).
# Nothing runs while nothing is new: the kernel sleeps on the host's notices. Ctrl+C ends it.
# VIGIA_LOG=<file>: what it says goes there, and only its last 100 lines are kept (Capitan: "no infinite log"); the
# file is trimmed when a line arrives, never by a timer.
set -u
vigia=${1:-${JANAX_VIGIA:-C:\\;E:\\}}
casa=${RAZAR_CASA:-$HOME/razar_casa}
tablero=${JANAX_TABLERO:-$(cygpath -w "$HOME/razar_tablero")}
motor=${JANAX_MOTOR:-traductor}
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
mkdir -p "$casa" "$(cygpath -u "$tablero")"
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/vigia.jsm" "$aqui/vigia.datos.jsm" "$aqui/comer.jsm" "$aqui/comer.datos.jsm" > /dev/null || exit 1
cp "$d/comer.bin" "$casa/$(etiqueta comer)"         # the program it launches for each book
cp "$d/comer.datos" "$casa/$(etiqueta comer.datos)"
registro() {   # each line to VIGIA_LOG, the file cut to its last 100 lines; without it, to the screen
  if [ -z "${VIGIA_LOG:-}" ]; then cat; return; fi
  while IFS= read -r linea; do
    printf '%s\n' "$linea" >> "$VIGIA_LOG"
    tail -n 100 "$VIGIA_LOG" > "$VIGIA_LOG.nuevo" && mv -f "$VIGIA_LOG.nuevo" "$VIGIA_LOG"
  done
}
{
  echo "Razar vigila $vigia (su casa: $casa; la biblioteca: $tablero). Ctrl+C para terminar."
  JANAX_MOTOR=$motor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$casa")" JANAX_TABLERO="$tablero" JANAX_VIGIA="$vigia" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/vigia.bin")" | sed -u 's/\r$//' \
    | grep --line-buffered -Ev '^(modo|costo|remeros|nativo|ventanilla|P[0-9]+ codigo)'
} 2>&1 | registro
