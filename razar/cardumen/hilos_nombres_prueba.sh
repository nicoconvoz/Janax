#!/usr/bin/env bash
# hilos_nombres_prueba.sh: two names for one place (hilos.jsm). The same family told twice: "beto, hijo de ana", "caro,
# hijo de beto", "dani, hijo de caro", ... and "ana fue padre de beto", "beto fue padre de karo", "karo fue padre de
# dani", ...: one says "caro", the other "karo", each twice and the same (a name, not a slip). Joining "fue padre de"
# with "hijo de" the other way round, "beto fue padre de karo" and "karo fue padre de dani" are not said by "hijo de"
# (which knows karo by another pair): left unexplained, the hypothesis would fall. But karo and caro have the same
# father (beto) and the same son (dani), one in each telling: the same place, two names. Then both are explained, the
# two relations join, and it says "mismo lugar: karo = caro".
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
printf '%s\n' 'O: beto, hijo de ana.' 'O: caro, hijo de beto.' 'O: dani, hijo de caro.' 'O: emi, hijo de dani.' \
  'O: karo, hijo de luz.' 'O: zoe, hijo de karo.' \
  'O: ana fue padre de beto.' 'O: beto fue padre de karo.' 'O: karo fue padre de dani.' 'O: dani fue padre de emi.' \
  "O: $(printf 'y %.0s' $(seq 1 60))y." > "$d/casa/$(etiqueta pares)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -Eq 'une: hijo de ~ fue padre de \| al reves ' &&
   printf '%s\n' "$salida" | grep -q '^mismo lugar: karo = caro$'; then
  echo "hilos_nombres_prueba: bien"
else
  echo "hilos_nombres_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'
  exit 1
fi
