#!/usr/bin/env bash
# Razar against a conventional network on the same game (Lewis signaling game: one says a thing, the other guesses it,
# both learn from whether they understood each other). The conventional one is EGG (Facebook Research,
# egg.zoo.channel: two recurrent networks trained by reward, REINFORCE), installed in $EGG_PY's environment
# (documentacion/razar/cardumen.md). The same 5 new seeds, 4, 8 and 16 things, things equally likely.
#
# The budget is counted in games: a Razar round is one game; an EGG batch is 32. The goal is the same: the first time
# every thing is understood (Razar: the start of its run of 4*k hits in a row, lazo.pl hasta=1; EGG: the first epoch
# whose test, without dice, gets every thing right). EGG gets the generous side: messages of up to 3 symbols out of 16
# (over 4,000 messages; Razar's will has 560 phrases of 3 bottom pieces in a 4x4x4 cube), networks of 64, and up to
# 320,000 games. Everything else is EGG's own default. Its online logger (wandb) is off: nothing leaves the machine.
# Outputs go to $1; each line of the summary: system, things, cube, games to arrival per seed, how many arrived.
cd "$(dirname "$0")"
out=${1:-convencional_salida}; mkdir -p "$out"
EGG_PY=${EGG_PY:-E:/DevCache/egg-venv/Scripts/python.exe}
export WANDB_MODE=disabled OMP_NUM_THREADS=1 MKL_NUM_THREADS=1
SEEDS="1001 1002 1003 1004 1005"
{
  for s in $SEEDS; do
    echo "razar 4 4 20000 $s"; echo "razar 8 4 20000 $s"; echo "razar 8 7 12000 $s"; echo "razar 16 7 12000 $s"
    for k in 4 8 16; do echo "egg $k - - $s"; done
  done
} | xargs -P "${JOBS:-4}" -L 1 sh -c '
  f="'"$out"'/$0_k$1_n$2_s$4.txt"; [ -s "$f" ] && exit 0
  t0=$(date +%s%N)
  if [ $0 = razar ]; then
    perl lazo.pl n=$2 k=$1 nace=$4 armonia=1 lee=ritmo rounds=$3 hasta=1 > "$f.tmp"
  else
    "'"$EGG_PY"'" -m egg.zoo.channel.train --n_features $1 --vocab_size 16 --max_len 3 --sender_hidden 64 \
      --receiver_hidden 64 --sender_embedding 64 --receiver_embedding 64 --n_epochs 200 --batches_per_epoch 50 \
      --batch_size 32 --probs uniform --random_seed $4 > "$f.tmp" 2>&1
  fi
  echo "ms: $(( ($(date +%s%N) - t0) / 1000000 ))" >> "$f.tmp"; mv "$f.tmp" "$f"'
for spec in "razar 4 4" "razar 8 4" "razar 8 7" "razar 16 7" "egg 4 -" "egg 8 -" "egg 16 -"; do
  set -- $spec
  perl -e 'my ($dir, $sys, $k, $n, @seeds) = @ARGV; my (@g, $ok, $ms);
    for my $s (@seeds) { open my $h, "<", "$dir/${sys}_k${k}_n${n}_s$s.txt" or do { push @g, "?"; next }; local $/; my $t = <$h>;
      $ms += $1 if $t =~ /^ms: (\d+)/m; my $a;
      if ($sys eq "razar") { $a = $1 if $t =~ /^llegada: (\d+)/m; }
      else { while ($t =~ /\{[^\n]*"acc": ([0-9.]+)[^\n]*"mode": "test", "epoch": (\d+)\}/g) { if ($1 >= 1) { $a = $2 * 50 * 32; last } } }
      push @g, defined $a ? $a : "no"; $ok++ if defined $a; }
    printf "%-5s %2d cosas %-3s juegos hasta aprender todo: %-40s llegaron %d de %d; %.1f s por corrida\n",
      $sys, $k, $n eq "-" ? "" : "${n}^3", join(" ", @g), $ok // 0, scalar @seeds, $ms / 1000 / @seeds;' "$out" "$@" $SEEDS
done
