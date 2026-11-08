#!/usr/bin/env bash
# encadena_prueba.sh: steps chained by their brackets (encadena.jsm). The book answers "quien engendro a X?" twice
# with "P es el padre de X", and "a quien engendro P?" twice; no sentence says a grandfather. Asked "quien engendro a
# aquel que engendro a ana?", it must find the bracket ("aquel que", said by two composed questions) and answer by
# chaining the two steps, the deepest first: "rosa". With the link broken (nobody begets the one who begot) it must
# say nothing. A question of three steps, asked three times, leaves "bracket, step, bracket" between more often than
# the bracket alone: the bracket is the one that puts the most questions together, not the one said most. A sentence of an answer that does not say its entity ("eso dicen") is not the case's.
set -u
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
mkdir -p "$d/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/encadena.jsm" "$aqui/encadena.datos.jsm" > /dev/null || exit 1
correr() {
  JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$d/casa")" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/encadena.bin")" | tr -d '\r'
}
printf '%s\n' 'Q: quien engendro a ana?' 'O: eva es el padre de ana.' 'O: eso dicen.' 'Q: quien engendro a eva?' 'O: rosa es el padre de eva.' \
  'Q: a quien engendro eva?' 'O: eva es el padre de ana.' 'Q: a quien engendro rosa?' 'O: rosa es el padre de eva.' \
  'Q: quien engendro a luz?' 'O: ana es el padre de luz.' 'Q: a quien engendro ana?' 'O: ana es el padre de luz.' \
  'Q: quien engendro a aquel que engendro a ana?' 'R: rosa' 'Q: a quien engendro aquel que engendro rosa?' 'R: ana' \
  'Q: quien engendro a aquel que engendro a aquel que engendro a luz?' 'R: rosa' \
  'Q: quien engendro a aquel que engendro a aquel que engendro a luz?' 'R: rosa' \
  'Q: quien engendro a aquel que engendro a aquel que engendro a luz?' 'R: rosa' \
  > "$d/casa/$(etiqueta pares)"
salida=$(correr)
printf '%s\n' 'Q: quien engendro a ana?' 'O: eva es el padre de ana.' 'Q: quien engendro a luz?' 'O: rosa es el padre de luz.' \
  'Q: a quien engendro eva?' 'O: eva es el padre de ana.' 'Q: a quien engendro rosa?' 'O: rosa es el padre de luz.' \
  'Q: quien engendro a aquel que engendro a ana?' 'R:' 'Q: a quien engendro aquel que engendro rosa?' 'R:' \
  > "$d/casa/$(etiqueta pares)"
nulo=$(correr)
if printf '%s\n' "$salida" | grep -q '^parentesis: aquel que | ' &&
   printf '%s\n' "$salida" | grep -q '^C: quien engendro a aquel que engendro a aquel que engendro a luz | 3 pasos | dice: rosa | verdad: rosa | 1$' &&
   printf '%s\n' "$salida" | grep -q '^C: quien engendro a aquel que engendro a ana | 2 pasos | dice: rosa | verdad: rosa | 1$' &&
   printf '%s\n' "$salida" | grep -q '^C: a quien engendro aquel que engendro rosa | 2 pasos | dice: ana | verdad: ana | 1$' &&
   printf '%s\n' "$nulo" | grep -q '^C: quien engendro a aquel que engendro a ana | 2 pasos | dice: - | verdad: - | 1$'; then
  echo "encadena_prueba: bien"
else
  echo "encadena_prueba: MAL"; printf '%s\n--- nulo\n%s\n' "$salida" "$nulo" | grep -Ev '^(modo|costo|remeros|nativo|ventanilla)'
  exit 1
fi
