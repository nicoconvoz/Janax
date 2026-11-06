#!/usr/bin/env bash
# Two Razares taking turns (each wakes, reads the other's letter, remakes itself, leaves its letter), against the same
# two that read no letters. sociedad.sh <folder> <rounds> <generations per turn>; the folder holds pulso.bin and
# nt/6c6962726f (the book, never in the repository). Each run's output is left beside it, soc_<cond>_<round>_<who>.txt.
S=$1; R=$2; G=$3; M=$(cygpath -m "$S"); cd /e/Janax
for cond in cartas solos; do
  rm -rf "$S/soc_$cond"; mkdir -p "$S/soc_$cond"; cp "$S/nt/6c6962726f" "$S/soc_$cond/"
  mute=0; [ $cond = solos ] && mute=1
  for r in $(seq 1 $R); do for q in 1 2; do
    printf "\012\0\0\0\0\0\0\0\001$(printf '\%03o\%03o\%03o' $G $q $mute)\0\0\0\0\0" > "$S/soc_$cond/70"
    timeout 600 bash -c "JANAX_CAMBIO=24 JANAX_ARCHIVOS='$M/soc_$cond' so/build/janaxos.exe '$M/pulso.bin'" | tr -d '\r' > "$S/soc_${cond}_${r}_$q.txt"
    echo "$cond ronda $r razar $q: $(rg '^carta|\*$' "$S/soc_${cond}_${r}_$q.txt" | tr '\n' ' ' | cut -c1-200)"
  done; done
done
