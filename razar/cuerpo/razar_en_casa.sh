#!/usr/bin/env bash
# razar_en_casa.sh <folder> <book> [janaxos.exe]: Razar lives in Luma's house (<folder>/casa), awake for good. It reads
# the book once, tries the recipes its model has on the board, and rests on its doorbell: asleep it spends nothing.
# Two things wake it: a letter ("carta2": Luma shares a form that won, and Razar tries it first as an organ, with its
# own books) and a new book (any file of the house whose label starts with "libro"). Then it rests again.
# Nothing of the house is erased: only its own files are written ("p", "libro", PDP/razar1/..., and what it keeps:
# nido1, autopsia1, memoria1, organos1, carta1). Its recipes go to the board (JANAX_TABLERO, ~/razar_tablero if none).
# Trials per stretch: 1, the least that lets an organ be tried at all (0 means "no organs"): the letter's organ and one
# of its own each time it wakes.
set -u
carpeta=$1; libro=$2
aqui=$(cd "$(dirname "$0")" && pwd); proyecto=$(cd "$aqui/../.." && pwd)
janaxos=${3:-$proyecto/so/build/janaxos.exe}
lectura="$proyecto/razar/lectura"
casa="$carpeta/casa"; armado="$carpeta/razar.armado"
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
mkdir -p "$casa" "$armado"
tablero=${JANAX_TABLERO:-$(cygpath -m "$HOME/razar_tablero")}
mkdir -p "$(cygpath -u "$tablero")"
# built again only if a source of his changed (he is reborn in Luma's nights: a build writes its sources again, texts
# the vigia would eat every time for nothing)
nuevo=
for f in "$lectura"/*.jsm "$lectura"/*.inc; do
  [ "$f" -nt "$armado/pulso.bin" ] && { nuevo=$f; break; }
done
if [ ! -f "$armado/pulso.bin" ] || [ ! -f "$armado/pulso.datos" ] || [ -n "$nuevo" ]; then
  bash "$proyecto/so/herramientas/armar.sh" "$janaxos" "$armado" "$lectura/pulso.jsm" "$lectura/pulso.datos.jsm" > /dev/null || exit 1
fi
[ -f "$casa/$(etiqueta libro)" ] || cp "$libro" "$casa/$(etiqueta libro)"   # its first book, once: the shelf is the house's
# "p": K 10, one reading, one generation, awake for good (1), one trial, no audit, no landscape
printf '\x0a\x00\x00\x00\x00\x00\x00\x00\x01\x01\x00\x00\x01\x01\x00\x00' > "$casa/$(etiqueta p)"
for f in "$armado/pulso.bin" "$armado/pulso.datos" "$lectura/organo.molde" "$lectura/organo.inc"; do
  cp "$f" "$casa/$(etiqueta "PDP/razar1/lectura/$(basename "$f")")"
done
# He works in the gaps (the Capitan: "en vez de tardar 25 segundos y no hacer nada, construilo mientras hace cosas
# Luma"): the host's lowest priority class (idle), so his exams take processor only when nobody else wants it. Not a
# number of mine: it is what the host calls "only when free". RAZAR_PRIORIDAD=normal runs him as any other program.
export JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$casa")" JANAX_TABLERO="$tablero"
if [ "${RAZAR_PRIORIDAD:-baja}" = normal ]; then
  exec "$janaxos" "$(cygpath -m "$armado/pulso.bin")"
fi
exec powershell -NoProfile -Command "\$p = Start-Process -FilePath '$(cygpath -w "$janaxos")' -ArgumentList '$(cygpath -m "$armado/pulso.bin")' -NoNewWindow -PassThru; \$p.PriorityClass = 'Idle'"   # (and it leaves: nobody waits on him holding memory)
