#!/usr/bin/env bash
# notas_prueba.sh: a word keeps who it is in the notes when the answers of two read seeds say it (memoria_pares.jsm
# with "semilla" and "marcos"). Two read questions are answered "pedro es el padre de X"; the third is left out, and
# of its two sentences, "luis es el padre de bruno" and "luis es el tio de bruno", the notes must tell "padre" (said by
# two read answers) from "tio" (by none): their "N:" notes must differ. A word of no read answer stays a word the
# question is not about.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/memoria_pares.jsm" "$aqui/memoria_pares.datos.jsm" > /dev/null || exit 1
relleno='O: es el de es el de es el de es el de es el de es el de es el de es el de es el de es el de y.'
printf '%s\n' 'Q: quien engendro a luis?' 'O: pedro es el padre de luis.' "$relleno" \
  'Q: quien engendro a diego?' 'O: pedro es el padre de diego.' "$relleno" \
  'Q: quien engendro a bruno?' 'O: luis es el padre de bruno.' 'O: luis es el tio de bruno.' > "$d/casa/$(etiqueta pares)"
printf '1\n' > "$d/casa/$(etiqueta semilla)"
printf '1\n' > "$d/casa/$(etiqueta marcos)"
printf '3 3\n' > "$d/casa/$(etiqueta fuera)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/memoria_pares.bin")" | tr -d '\r')
notas=$(printf '%s\n' "$salida" | grep '^N: 2 ' | cut -d' ' -f6- | sort -u | wc -l)
if [ "$notas" = 2 ]; then
  echo "notas_prueba: bien"
else
  echo "notas_prueba: MAL ($notas notas distintas, se esperaban 2)"; printf '%s\n' "$salida" | grep -E '^(M|N): '
  exit 1
fi
