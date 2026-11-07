#!/usr/bin/env bash
# charla.sh [house]: talk with Razar from a console, with no book given. Razar lives in its house (a folder of its
# own; RAZAR_CASA or the argument, ~/razar_casa if none). Its clues live in the library every Razar of this PC shares
# (the board: JANAX_TABLERO, ~/razar_tablero if none): a book eaten by one is known by all, kept once. The books stay
# wherever they are on the PC.
#   come <address>   (or "comé"): Razar eats the book at that address, anywhere on the PC (read only)
#   anything else    a melody with holes ("? padre de jacob"): Razar follows its clues, reads again only those
#                    renglones, and answers saying whether the book says it like that, it inferred it, or it does not
#                    know.
# Nothing runs between lines: only on Enter. An empty line, "chau" or Ctrl+D ends the talk.
set -u
casa=${1:-${RAZAR_CASA:-$HOME/razar_casa}}
tablero=${JANAX_TABLERO:-$(cygpath -w "$HOME/razar_tablero")}
motor=${JANAX_MOTOR:-traductor}
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
mkdir -p "$casa" "$(cygpath -u "$tablero")"
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$d" \
  "$aqui/pregunta.jsm" "$aqui/pregunta.datos.jsm" "$aqui/comer.jsm" "$aqui/comer.datos.jsm" > /dev/null || exit 1
cp "$d/pregunta.bin" "$casa/$(etiqueta pregunta)"        # its own program: each round of a walk starts it again
cp "$d/pregunta.datos" "$casa/$(etiqueta pregunta.datos)"
razar() {   # razar <program>: one run in its house, its words only
  JANAX_MOTOR=$motor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$casa")" JANAX_TABLERO="$tablero" \
    "$proyecto/so/build/janaxos.exe" "$(cygpath -m "$d/$1.bin")" | tr -d '\r' \
    | grep -Ev '^(modo|costo|remeros|nativo|ventanilla|P[0-9]+ codigo)'
}
echo "Razar escucha (su casa: $casa; la biblioteca: $tablero)."
echo "  come <direccion>  le das un libro de cualquier lugar de la PC"
echo "  ? padre de jacob  le preguntas con huecos"
echo "Enter vacio o chau para terminar."
while IFS= read -r -e -p "vos> " linea; do
  [ -z "$linea" ] || [ "$linea" = chau ] && break
  case "$linea" in
    "come "*|"comé "*)
      ruta=${linea#* }; ruta=${ruta%\"}; ruta=${ruta#\"}
      [ -f "$ruta" ] || { echo "  no encuentro ese libro: $ruta"; continue; }
      printf '%s\n' "$(cygpath -w "$ruta")" > "$casa/$(etiqueta come)"
      razar comer
      rm -f "$casa/$(etiqueta come)" ;;
    *)
      rm -f "$casa/$(etiqueta camino)" "$casa/$(etiqueta libro)"   # a new question walks from nothing: a round
      printf '%s\n' "$linea" > "$casa/$(etiqueta q)"                  # that fell must not leave it its walk
      razar pregunta ;;
  esac
done
echo "Razar: hasta la proxima."
