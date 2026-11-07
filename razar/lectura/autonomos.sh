#!/usr/bin/env bash
# autonomos.sh <folder> <book A> <book B> [trials]: two Razares, each one autonomous (its own Janax, its own folder, its
# own books), awake for good, growing organs. When both rest, the letters cross (A's into B's folder as the other's,
# and B's into A's): the stand-in of the network, a postman. Each one must wake with the other's letter and try its
# organ first, with its own books. Then both rest again and they are stopped. Their screens: <folder>/A.txt, B.txt.
set -u
carpeta=$1; libroa=$2; librob=$3; intentos=${4:-1}
aqui=$(cd "$(dirname "$0")" && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
mkdir -p "$carpeta"
autopsia=$(etiqueta autopsia1)
descansa() { [ -f "$1/$autopsia" ] && tail -c 200 "$1/$autopsia" | tr -d '\r' | tail -1 | grep -q descansa; }
bash "$aqui/organos.sh" "$carpeta/A" "$libroa" "$intentos" traductor 1 > "$carpeta/A.txt" 2>&1 &
bash "$aqui/organos.sh" "$carpeta/B" "$librob" "$intentos" traductor 1 > "$carpeta/B.txt" 2>&1 &
sleep 30
until descansa "$carpeta/A" && descansa "$carpeta/B"; do sleep 5; done
echo "los dos descansan: el cartero cruza las cartas"
mia=$(etiqueta carta1); otra=$(etiqueta carta2)
cp "$carpeta/A/$mia" "$carpeta/B/$otra.tmp" && mv "$carpeta/B/$otra.tmp" "$carpeta/B/$otra"
cp "$carpeta/B/$mia" "$carpeta/A/$otra.tmp" && mv "$carpeta/A/$otra.tmp" "$carpeta/A/$otra"
sleep 20
until descansa "$carpeta/A" && descansa "$carpeta/B"; do sleep 5; done
sleep 10
echo "los dos descansan otra vez"
powershell -NoProfile -Command "Stop-Process -Name janaxos -Force -ErrorAction SilentlyContinue"
wait
