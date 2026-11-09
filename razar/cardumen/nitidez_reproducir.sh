#!/usr/bin/env bash
# nitidez_reproducir.sh <corpus> <mats_es> <casa>: the v0.3 result, again. Builds hilos, turns the corpus into the
# book Razar reads (each non-empty line, lowercased, after "O: ", exactly as the published runs), runs hilos with the
# filter of the half and "nitidez" (the places travel from piece to piece by themselves), and judges Razar's sharpness
# against MATS with the outside judge (Python; Razar never reads it). <casa> must be a new, empty folder.
#   Published: the first 20,000,000 bytes of a Spanish Wikipedia extract (sha256 d17a9559…786afc): 199 pieces, 1,873 s,
#   205 MB at most, 451 against 117; the Spanish Wiktionary (sha256 ed1d8ba0…a96f96): 150 pieces, 194 s, 249 against 41.
set -u
[ $# -eq 3 ] || { echo "uso: nitidez_reproducir.sh <corpus> <mats_es> <casa nueva>"; exit 2; }
corpus=$1; mats=$2; casa=$3
aqui=$(cd "$(dirname "$0")" && pwd)
proyecto=$(cd "$aqui/../.." && pwd)
etiqueta() { printf '%s' "$1" | od -An -tx1 | tr -d ' \n'; }
[ -e "$casa" ] && [ -n "$(ls -A "$casa" 2>/dev/null)" ] && { echo "la casa tiene que estar vacia: $casa"; exit 2; }
mkdir -p "$casa/bin" "$casa/casa"
bash "$proyecto/so/herramientas/armar.sh" "$proyecto/so/build/janaxos.exe" "$casa/bin" \
  "$aqui/hilos.jsm" "$aqui/hilos.datos.jsm" > /dev/null || exit 1
sha256sum "$corpus" | cut -c1-64 > "$casa/corpus.sha256"
awk 'NF{print "O: " tolower($0)}' "$corpus" > "$casa/casa/$(etiqueta pares)"
printf si > "$casa/casa/$(etiqueta nitidez)"
cp "$casa/bin/hilos.bin" "$casa/casa/$(etiqueta hilos)"; cp "$casa/bin/hilos.datos" "$casa/casa/$(etiqueta hilos.datos)"
t0=$(date +%s)
JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS="$(cygpath -m "$casa/casa")" "$proyecto/so/build/janaxos.exe" \
  "$(cygpath -m "$casa/bin/hilos.bin")" | tr -d '\r' > "$casa/salida.txt"
echo "corpus $(cat "$casa/corpus.sha256") | $(grep -c '^palabras' "$casa/salida.txt") pedazos en $(( $(date +%s) - t0 )) s"
c=$(cat "$casa/casa/$(etiqueta lugar)")
python -I "$proyecto/razar/jueces/juez_nitidas.py" "$casa/casa/$(etiqueta nitidas$c)" "$mats" | tee "$casa/juez.txt"
