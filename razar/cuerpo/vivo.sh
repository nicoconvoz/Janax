#!/usr/bin/env bash
# vivo.sh <folder> [janaxos.exe]: builds vivo.jsm (gen_vivo.py writes it) into <folder> and runs it: Janax's living
# desktop in its own window, until the window is closed. It answers the frames it drew.
set -u
carpeta=$1
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
janaxos=${2:-$proyecto/so/build/janaxos.exe}
mkdir -p "$carpeta/bin" "$carpeta/casa"
bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$carpeta/bin" "$aqui/vivo.jsm" > /dev/null || exit 1
JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" "$janaxos" "$(cygpath -m "$carpeta/bin/vivo.bin")"
