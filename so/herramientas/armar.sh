#!/usr/bin/env bash
# Builds Janax sources with the PDP assembler, on Janax OS: no FASM for Janax.
#   armar.sh <janaxos.exe> <out folder> <source.jsm>...
# Each source becomes <out folder>/<its name>.bin (X.ext.jsm -> X.ext). The repository's *.inc files go with
# them, each at its place, so includes find them.
# The assembler comes from its seed (so/pdp/semilla): the seed builds the assembler and its table from their
# sources, and that build must build itself again identically (its fixed point). The kernel's factory
# planner (so/nucleo/planificador) is built the same way and its seed must be up to date too. If the build is not the
# seed any more, the seed must be refreshed (the message says how) and nothing is built.
set -u
janaxos=$1; salida=$2; shift 2
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
semilla="$proyecto/so/pdp/semilla"
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
mkdir -p "$salida/pdp"

# corrida <assembler folder> <system folder> -> j0 of the run
corrida() {
  JANAX_ARCHIVOS="$(cygpath -m "$2")" JANAX_CAMBIO=0 timeout 300 "$janaxos" "$(cygpath -m "$1/ensamblador.bin")" \
    | tr -d '\r' | grep -o 'j0=[0-9A-F]*'
}
# propio <assembler folder> <system folder>: the assembler and its table from their sources
propio() {
  local fuente
  rm -rf "${2:?}"; mkdir -p "$2"
  for fuente in so/pdp/ensamblador/ensamblador so/pdp/ensamblador/ensamblador.datos so/nucleo/planificador; do
    cp "$proyecto/$fuente.jsm" "$2/$(etiqueta "PDP/$fuente.jsm")"
  done
  cp "$proyecto/so/nucleo/planificador.inc" "$2/$(etiqueta "PDP/so/nucleo/planificador.inc")"
  [ "$(corrida "$1" "$2")" = "j0=0000000000000003" ] || { echo "armar: el ensamblador no se pudo armar"; exit 1; }
}
propio "$semilla" "$salida/pdp/de_semilla"
cp "$salida/pdp/de_semilla/$(etiqueta "PDP/so/pdp/ensamblador/ensamblador.bin")" "$salida/pdp/ensamblador.bin"
cp "$salida/pdp/de_semilla/$(etiqueta "PDP/so/pdp/ensamblador/ensamblador.datos")" "$salida/pdp/ensamblador.datos"
cp "$salida/pdp/de_semilla/$(etiqueta "PDP/so/nucleo/planificador.bin")" "$salida/pdp/planificador.bin"
propio "$salida/pdp" "$salida/pdp/de_si_mismo"
for f in ensamblador.bin ensamblador.datos planificador.bin; do
  case "$f" in planificador.bin) n=$(etiqueta "PDP/so/nucleo/planificador.bin") ;;
    *) n="$(etiqueta "PDP/so/pdp/ensamblador/${f%.bin}")$([ "$f" = ensamblador.bin ] && etiqueta ".bin")" ;; esac
  cmp -s "$salida/pdp/de_semilla/$n" "$salida/pdp/de_si_mismo/$n" \
    || { echo "armar: $f no es su propio punto fijo"; exit 1; }
  cmp -s "$salida/pdp/$f" "$semilla/$f" \
    || { echo "armar: la semilla no esta al dia: cp $salida/pdp/$f $semilla/"; exit 3; }
done

# the sources, at their place under PDP
[ $# -gt 0 ] || exit 0
sistema="$salida/pdp/fuentes"; rm -rf "${sistema:?}"; mkdir -p "$sistema"
fd -e inc --exclude build . "$proyecto/escalon0" "$proyecto/so" | while IFS= read -r i; do
  i=$(cd "$(dirname "$i")" && pwd)/$(basename "$i")
  cp "$i" "$sistema/$(etiqueta "PDP/${i#$proyecto/}")"
done
for f in "$@"; do
  r=${f#$proyecto/}
  cp "$f" "$sistema/$(etiqueta "PDP/$r")"
done
got=$(corrida "$salida/pdp" "$sistema")
[ "$got" = "$(printf 'j0=%016X' $#)" ] || { echo "armar: esperaba $# armados sin errores, dio $got"; exit 1; }
for f in "$@"; do
  r=${f#$proyecto/}; r=${r%.jsm}; n=$(basename "$r")
  case "$n" in *.*) ;; *) r="$r.bin"; n="$n.bin" ;; esac
  cp "$sistema/$(etiqueta "PDP/$r")" "$salida/$n"
done
