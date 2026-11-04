#!/usr/bin/env bash
# The ceiling of the language the will and the school invent, by cube size (n^3) and by how many things the will
# has to say (k). Ceiling = mean hit rate over the last quarter of the rounds; 100 rounds per thing; 5 seeds.
# KS, NS and SEEDS choose other tasks, sizes and seeds (Capitan: primes break any hidden periodicity).
# Every run keeps its whole output (with the per-thing detail and confusion) in $1 (default: barrido_salida/),
# and one line per (n, k) is printed: chance, ceiling (mean, min, max) and how many times chance.
cd "$(dirname "$0")"
out=${1:-barrido_salida}; mkdir -p "$out"
for k in ${KS:-8 16 32}; do
  for n in ${NS:-4 5 6 7}; do
    vals=()
    for s in ${SEEDS:-7 99 2024 31 123}; do
      f="$out/n${n}_k${k}_s${s}.txt"
      perl lazo.pl n=$n nace=$s armonia=1 k=$k rounds=$((100 * k)) detalle=1 > "$f"
      vals+=("$(tail -1 "$f" | perl -ne 'my @b = /(\d+)%/g; shift @b; my $q = int(@b / 4) || 1; my @t = @b[-$q..-1]; my $s = 0; $s += $_ for @t; printf "%.1f", $s / @t;')")
    done
    printf '%s\n' "${vals[@]}" | perl -e 'my ($n, $k) = @ARGV; my @v = <STDIN>; chomp @v; my $s = 0; $s += $_ for @v; my $m = $s / @v; my @o = sort { $a <=> $b } @v; my $c = 100 / $k;
      printf "n=%d k=%2d azar=%4.1f%%  techo media %5.1f%% (min %5.1f, max %5.1f) = %4.1f veces el azar  [%s]\n", $n, $k, $c, $m, $o[0], $o[-1], $m / $c, join(" ", @v);' $n $k
  done
done
