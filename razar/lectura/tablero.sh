#!/usr/bin/env bash
# tablero.sh <folder> <book A> <book B> [trials]: two Razares of the same host, each one autonomous (its own Janax,
# its own folder, its own books, its own key), awake for good, growing organs, and one board they share
# (JANAX_TABLERO: <folder>/tablero). Nobody carries their letters: each one leaves its own on the board and finds the
# other's there; the sentinel wakes it when the other's changes. When both rest with nothing new they are stopped.
# Their screens: <folder>/A.txt, B.txt; the board: <folder>/tablero.
set -u
carpeta=$1; libroa=$2; librob=$3; intentos=${4:-1}
aqui=$(cd "$(dirname "$0")" && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
rm -rf "$carpeta"; mkdir -p "$carpeta/tablero"
export JANAX_TABLERO="$(cygpath -m "$carpeta/tablero")"
autopsia=$(etiqueta autopsia1)
descansa() { [ -f "$1/$autopsia" ] && tail -c 200 "$1/$autopsia" | tr -d '\r' | tail -1 | grep -q descansa; }
LLAVE=a1a1a1a1a1a1a1a1 bash "$aqui/organos.sh" "$carpeta/A" "$libroa" "$intentos" traductor 1 > "$carpeta/A.txt" 2>&1 &
LLAVE=b2b2b2b2b2b2b2b2 bash "$aqui/organos.sh" "$carpeta/B" "$librob" "$intentos" traductor 1 > "$carpeta/B.txt" 2>&1 &
sleep 30
quietos=0                       # both resting, and still resting a while later: nothing new between them
until [ "$quietos" -ge 3 ]; do
  if descansa "$carpeta/A" && descansa "$carpeta/B"; then quietos=$((quietos + 1)); else quietos=0; fi
  sleep 10
done
echo "los dos descansan sin nada nuevo"
powershell -NoProfile -Command "Stop-Process -Name janaxos -Force -ErrorAction SilentlyContinue"
wait
echo "== el tablero"; ls "$carpeta/tablero"
