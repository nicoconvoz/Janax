#!/usr/bin/env bash
# The A/B of the will that listens to the melody (rule frozen in c405cb7 before any of these seeds was looked at):
# 20 new seeds (1001..1020), cubes of 4 and 7 a side, 16 things, the will reading lee=piezas (the base), lee=ritmo (the
# melody) and lee=revuelto (as big a will, the steps shuffled: the control). Every run goes on until it learned
# everything (hasta=1) or reaches its ceiling. Runs in parallel, one per core; every output stays in $1.
cd "$(dirname "$0")"
out=${1:-ab_salida}; mkdir -p "$out"
jobs=${JOBS:-4}
for lee in piezas ritmo revuelto; do
  for n in 4 7; do
    tope=$([ $n = 4 ] && echo 20000 || echo 12000)
    for s in $(seq 1001 1020); do echo "$n $lee $s $tope"; done
  done
done | xargs -P "$jobs" -L 1 sh -c 'f="'"$out"'/n$0_$1_s$2.txt"; [ -s "$f" ] || perl lazo.pl n=$0 nace=$2 armonia=1 k=16 rounds=$3 hasta=1 lee=$1 > "$f"'
for n in 4 7; do
  for lee in piezas ritmo revuelto; do
    perl -e 'my ($dir, $n, $lee) = @ARGV; my (@ok, $no, %arr);
      for my $s (1001 .. 1020) { open my $h, "<", "$dir/n${n}_${lee}_s$s.txt" or next; local $/; my $t = <$h>;
        if ($t =~ /^llegada: (\d+)/m) { push @ok, $1; $arr{$s} = $1 } else { $no++ } }
      @ok = sort { $a <=> $b } @ok; my $med = @ok ? $ok[int(@ok / 2)] : "-";
      printf "n=%d %-8s convergieron %2d de 20  mediana %6s\n", $n, $lee, scalar @ok, $med;' "$out" $n $lee
  done
done
