#!/usr/bin/env bash
# hilos_despierta_prueba.sh: a refuted hypothesis wakes when something like what refuted it comes back (hilos.jsm).
# "maestro de" and "alumno de" (the other way round) join: teachers with many pupils and pupils with many teachers, so
# no property refutes anything here, only what is explained. "enseña a" says four of their pairs and four more of the
# same people they do not say ("ana enseña a sol", "eva enseña a cielo", ...): refuted, in a coma, with those people as
# its context. Then "guia a" joins them (three said, two not) and brings "ana guia a sol", "eva guia a cielo": the
# people of the coma are touched, "enseña a" wakes ("despierta:"), and judged again with what is known now it explains
# more than it leaves out, and joins.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
printf '%s\n' 'O: ana, maestro de eva.' 'O: ana, maestro de luz.' 'O: eva, maestro de luz.' 'O: eva, maestro de mar.' \
  'O: luz, maestro de mar.' 'O: mar, maestro de sol.' 'O: mar, maestro de cielo.' \
  'O: eva, alumno de ana.' 'O: luz, alumno de ana.' 'O: luz, alumno de eva.' 'O: mar, alumno de eva.' \
  'O: mar, alumno de luz.' 'O: sol, alumno de mar.' 'O: cielo, alumno de mar.' \
  'O: ana enseña a eva.' 'O: eva enseña a mar.' 'O: luz enseña a mar.' 'O: mar enseña a cielo.' \
  'O: ana enseña a sol.' 'O: eva enseña a cielo.' 'O: luz enseña a sol.' 'O: luz enseña a cielo.' \
  'O: eva guia a luz.' 'O: ana guia a luz.' 'O: mar guia a sol.' 'O: ana guia a sol.' 'O: eva guia a cielo.' \
  "O: $(printf 'y %.0s' $(seq 1 120))y." > "$d/casa/$(etiqueta pares)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
guia=$(printf '%s\n' "$salida" | grep -n 'une: maestro de ~ guia a ' | head -1 | cut -d: -f1)
ensena=$(printf '%s\n' "$salida" | grep -n 'une: maestro de ~ enseña a ' | head -1 | cut -d: -f1)
if [ -n "$guia" ] && [ -n "$ensena" ] && [ "$ensena" -gt "$guia" ] &&
   printf '%s\n' "$salida" | grep -q '^despierta: maestro de ~ enseña a$'; then
  echo "hilos_despierta_prueba: bien"
else
  echo "hilos_despierta_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'
  exit 1
fi
