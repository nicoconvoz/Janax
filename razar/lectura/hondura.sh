#!/usr/bin/env bash
# Usage: hondura.sh <folder>, the folder with pulso.bin and nt/6c6962726f (the book, never in the repository).
# Calibrates the depth of each floor of the pulse: one floor at a time, it goes one step deeper while the bits its
# pieces save per pulse go up, and stops at the first step that does not (Capitan: "if it is 3, do not reach 4").
S=$1; M=$(cygpath -m "$S"); cd /e/Janax
mkdir -p "$S/hd"; cp "$S/nt/6c6962726f" "$S/hd/"
corre() {  # corre d1 d2 d3 -> prints the three floor rates
  e=$(printf "\\%03o\\%03o\\%03o" $1 $2 $3); printf "\012\0\0\0\0\0\0\0${e}\0\0\0\0\0" > "$S/hd/70"
  timeout 300 bash -c "JANAX_CAMBIO=24 JANAX_ARCHIVOS='$M/hd' so/build/janaxos.exe '$M/pulso.bin'" | tr -d '\r' > "$S/hd_$1$2$3.txt"
  awk '/pulsos=/{n[++k]=$0; sub(/.*\): pulsos=/,"",n[k]); sub(/ .*/,"",n[k])} /^profundidad por piso/{sub(/.*\| /,""); gsub(/,/,"."); split($0,r," ")} END{printf "%.6f %.6f %.6f\n", r[1]/n[1], (r[2]+r[3])/(n[2]+n[3]), r[4]/n[4]}' "$S/hd_$1$2$3.txt"
}
d=(0 1 1 1)
for f in 1 2 3; do
  cur=$(corre ${d[1]} ${d[2]} ${d[3]} | cut -d' ' -f$f)
  echo "piso $f: profundidad ${d[$f]} -> $cur bits por pulso"
  while :; do
    t=("${d[@]}"); t[$f]=$((d[$f]+1))
    nxt=$(corre ${t[1]} ${t[2]} ${t[3]} | cut -d' ' -f$f)
    echo "piso $f: profundidad ${t[$f]} -> $nxt bits por pulso"
    awk -v a="$nxt" -v b="$cur" 'BEGIN{exit !(a>b)}' || break
    d[$f]=${t[$f]}; cur=$nxt
  done
  echo "piso $f se aclara en ${d[$f]}"
done
echo "profundidades: ${d[1]} ${d[2]} ${d[3]}"
