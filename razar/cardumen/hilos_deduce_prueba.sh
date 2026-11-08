#!/usr/bin/env bash
# hilos_deduce_prueba.sh: what is proved becomes a premise (hilos.jsm). The family "ana, padre de eva", "eva, padre de
# luz", "luz, padre de mar", "rosa, padre de sol", "sol, padre de cielo" and its "hijo de" the other way round join;
# that relation asserts something (each child one father), so Razar chains it with itself: "padre de + padre de", a
# relation nobody wrote, deduced. The book says "ana, abuelo de luz", "eva, abuelo de mar", "rosa, abuelo de cielo":
# the deduced one is confirmed by them, explains them, and joins "abuelo de". Deduced relations nobody uses die.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
printf '%s\n' 'O: ana, padre de eva.' 'O: eva, padre de luz.' 'O: luz, padre de mar.' 'O: rosa, padre de sol.' \
  'O: sol, padre de cielo.' 'O: eva, hijo de ana.' 'O: luz, hijo de eva.' 'O: mar, hijo de luz.' 'O: sol, hijo de rosa.' \
  'O: cielo, hijo de sol.' 'O: ana, abuelo de luz.' 'O: eva, abuelo de mar.' 'O: rosa, abuelo de cielo.' \
  "O: $(printf 'y %.0s' $(seq 1 80))y." > "$d/casa/$(etiqueta pares)"
salida=$(JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
  "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/hilos.bin")" | tr -d '\r')
if printf '%s\n' "$salida" | grep -q '^deduce: padre de + padre de | ' &&
   printf '%s\n' "$salida" | grep -Eq 'une: (abuelo de ~ padre de \+ padre de|padre de \+ padre de ~ abuelo de) \| misma '; then
  echo "hilos_deduce_prueba: bien"
else
  echo "hilos_deduce_prueba: MAL"; printf '%s\n' "$salida" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'
  exit 1
fi
