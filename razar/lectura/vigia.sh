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
  "$aqui/vigia.jsm" "$aqui/vigia.datos.jsm" "$aqui/comer.jsm" "$aqui/comer.datos.jsm"   "$aqui/sentido.jsm" "$aqui/sentido.datos.jsm" > /dev/null || exit 1
cp "$d/comer.bin" "$casa/$(etiqueta comer)"         # the programs it launches for each book: its clues and silhouettes,
cp "$d/comer.datos" "$casa/$(etiqueta comer.datos)" # and the turns of its skeletons
cp "$d/sentido.bin" "$casa/$(etiqueta sentido)"
cp "$d/sentido.datos" "$casa/$(etiqueta sentido.datos)"
# It reads with the organ Razar found most general (the Capitan: "que no sean un adorno: en Razar todo se usa"): the
# vigia eats texts of every domain, so it wears the organ that has recipes in the most models of the board; between
# equals, the one with fewer letters, then the lower one (the general rules measured were the shortest). Its letters
# go into the organ's place of both programs' initial data (30h, organo.inc). No recipe, or no python: no organ, as
# before. VIGIA_ORGANO=<letters> wears that one; VIGIA_ORGANO=- wears none.
organo=$(python -I - "$(cygpath -m "$(cygpath -u "$tablero")")" "${VIGIA_ORGANO:-}" "$casa/$(etiqueta comer.datos)" "$casa/$(etiqueta sentido.datos)" <<'PYEOF' 2>/dev/null
import os, sys
board, forced, files = sys.argv[1], sys.argv[2], sys.argv[3:]
models = {}
if forced:
    best = "" if forced == "-" else forced
else:
    for f in os.listdir(board):
        try:
            p = bytes.fromhex(f).decode().split("/")
        except ValueError:
            continue
        if len(p) >= 5 and p[0] == "tablero" and p[1] == "Receta de Organos" and p[-1] == "recetas" and p[3].isdigit():
            models.setdefault(p[3], set()).add(p[2])
    best = min(models, key=lambda o: (-len(models[o]), len(o), int(o))) if models else ""
word = sum(int(c) << (4 * i) for i, c in enumerate(best)) if best and len(best) <= 16 else 0
for path in files:
    b = bytearray(open(path, "rb").read())
    if len(b) >= 0x38:
        b[0x30:0x38] = word.to_bytes(8, "little")
        open(path, "wb").write(b)
print((best if word else "-") + (" (%d modelos)" % len(models[best]) if best in models else ""))
PYEOF
)
registro() {   # each line to VIGIA_LOG, the file cut to its last 100 lines; without it, to the screen
  if [ -z "${VIGIA_LOG:-}" ]; then cat; return; fi
  while IFS= read -r linea; do
    printf '%s\n' "$linea" >> "$VIGIA_LOG"
    tail -n 100 "$VIGIA_LOG" > "$VIGIA_LOG.nuevo" && mv -f "$VIGIA_LOG.nuevo" "$VIGIA_LOG"
  done
}
{
  echo "Razar vigila $vigia (su casa: $casa; la biblioteca: $tablero; lee con el organo ${organo:--}). Ctrl+C para terminar."
  JANAX_MOTOR=$motor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$casa")" JANAX_TABLERO="$tablero" JANAX_VIGIA="$vigia" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/vigia.bin")" | sed -u 's/\r$//' \
    | grep --line-buffered -Ev '^(modo|costo|remeros|nativo|ventanilla|P[0-9]+ codigo)'
} 2>&1 | registro
