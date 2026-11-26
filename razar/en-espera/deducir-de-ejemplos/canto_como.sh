#!/usr/bin/env bash
# canto_como.sh <pregunta>: her school's song (memoria_pares.jsm, canta + razona) given the examples of E:/tmp/guardado/pares_como.txt
set -u
proyecto=/e/Janax; aqui=$proyecto/razar/cardumen
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=/e/tmp/canto; rm -rf "$d/casa"; mkdir -p "$d/casa"
[ -f "$d/memoria_pares.bin" ] || bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" "$aqui/memoria_pares.jsm" "$aqui/memoria_pares.datos.jsm" > /dev/null || exit 1
cp /e/tmp/guardado/pares_como.txt "$d/casa/$(etiqueta pares)"
printf '%s\n' "$@" > "$d/casa/$(etiqueta canta)"
printf '1\n' > "$d/casa/$(etiqueta razona)"
JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/memoria_pares.bin")" | tr -d '\r' | grep -E '^canta:'
