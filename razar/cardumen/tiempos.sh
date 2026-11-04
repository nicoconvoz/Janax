#!/usr/bin/env bash
# How long each cube takes to learn everything (Capitan: "the long run shows what it learns"): every run goes on
# until it learned all k things (lazo.pl hasta=1) or reaches TOPE rounds, and the round it arrived at is noted.
# One line per (n, k): every seed's arrival (or "no" if it did not converge), the median of the ones that did,
# and how many did not. NS, KS, SEEDS, TOPE choose the grid; every run's whole output stays in $1.
cd "$(dirname "$0")"
out=${1:-tiempos_salida}; mkdir -p "$out"; tope=${TOPE:-50000}
for k in ${KS:-16}; do
  for n in ${NS:-4 7}; do
    arr=()
    for s in ${SEEDS:-7 99 2024 31 123}; do
      f="$out/n${n}_k${k}_s${s}.txt"
      perl lazo.pl n=$n nace=$s armonia=1 k=$k rounds=$tope hasta=1 detalle=1 > "$f"
      a=$(perl -ne 'print $1 if /^llegada: (\d+)/; print "no" if /^llegada: no/' "$f"); arr+=("$a")
    done
    printf '%s\n' "${arr[@]}" | perl -e 'my ($n, $k, $t) = @ARGV; my @a = <STDIN>; chomp @a; my @ok = sort { $a <=> $b } grep { /^\d+$/ } @a; my $no = @a - @ok;
      my $med = @ok ? $ok[int(@ok / 2)] : "-"; printf "n=%d k=%2d  llegadas: %-40s mediana %6s  no convergieron: %d de %d (tope %d)\n", $n, $k, join(" ", @a), $med, $no, scalar @a, $t;' $n $k $tope
  done
done
