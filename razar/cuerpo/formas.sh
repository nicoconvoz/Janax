#!/usr/bin/env bash
# formas.sh <folder> [janaxos.exe]: builds formas.jsm (gen_formas.py writes it) into <folder> and runs it: Razar's own
# forms in Janax's window, until the window is closed. Its population and its archive live in <folder>/casa ("formas",
# "archivo"), so the next run in the same folder starts where this one left. It answers the forms it created.
set -u
carpeta=$1
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
janaxos=${2:-$proyecto/so/build/janaxos.exe}
mkdir -p "$carpeta/bin" "$carpeta/casa"
bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$carpeta/bin" "$aqui/formas.jsm" > /dev/null || exit 1
JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" "$janaxos" "$(cygpath -m "$carpeta/bin/formas.bin")"
