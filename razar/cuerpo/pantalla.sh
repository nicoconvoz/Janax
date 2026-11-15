#!/usr/bin/env bash
# pantalla.sh <folder>: Janax draws its screen (pantalla.jsm) into <folder> as pantalla.nube, and ver_pantalla.py
# turns it into <folder>/pantalla.png. The first slice of Razar's body: a screen it can write and read back.
set -u
carpeta=$1
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
mkdir -p "$carpeta/bin" "$carpeta/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$carpeta/bin" "$aqui/pantalla.jsm" > /dev/null || exit 1
JANAX_ARCHIVOS="$(cygpath -m "$carpeta/casa")" "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$carpeta/bin/pantalla.bin")" > /dev/null
python -I "$aqui/ver_pantalla.py" "$carpeta/casa/$(printf '%s' pantalla.nube | od -An -tx1 | tr -d ' \n')" "$carpeta/pantalla.png" 5
