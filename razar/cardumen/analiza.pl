#!/usr/bin/perl
# Reads the sweep's per-run outputs (barrido.sh) and gives, per cube size and task, the honest numbers: the share
# of seeds that learned EVERY thing (the curve with a knee), how many things each run learned, and the mean hit
# rate as a second column. A thing counts as learned if it was right every time it was said in the last quarter
# of the rounds (a strict criterion, not a measurement).
use strict; use warnings;
my $dir = shift // 'barrido_salida';
my %runs;
for my $f (sort glob("$dir/n*_k*_s*.txt")) {
  my ($n, $k, $s) = $f =~ /n(\d+)_k(\d+)_s(\d+)\.txt$/ or next;
  open my $h, '<', $f or next; my @l = <$h>; close $h;
  my ($det) = grep { /^detalle:/ } @l or next;
  my ($blocks) = grep { /aciertos cada/ } @l;
  my @things = $det =~ /(\d+)=(\d+)\/(\d+)/g;
  my ($learned, $total) = (0, 0);
  while (my ($m, $hit, $said) = splice @things, 0, 3) { $total++; $learned++ if $said > 0 && $hit == $said; }
  my @b = $blocks =~ /(\d+)%/g; shift @b; my $q = int(@b / 4) || 1; my @t = @b[-$q .. -1];
  my $mean = 0; $mean += $_ for @t; $mean /= @t;
  push @{ $runs{$n}{$k} }, { s => $s, learned => $learned, total => $total, mean => $mean };
}
printf "%-4s %-4s %-28s %-22s %s\n", "cubo", "k", "semillas que aprenden todo", "cosas aprendidas", "media (x azar)";
for my $k (sort { $a <=> $b } keys %{ { map { map { $_ => 1 } keys %{ $runs{$_} } } keys %runs } }) {
  for my $n (sort { $a <=> $b } keys %runs) {
    my $r = $runs{$n}{$k} or next;
    my $all = grep { $_->{learned} == $_->{total} } @$r;
    my $mean = 0; $mean += $_->{mean} for @$r; $mean /= @$r;
    printf "%d^3  %-4d %2d de %-23d %-22s %5.1f%% (%.1f)\n", $n, $k, $all, scalar @$r,
      join(" ", map { $_->{learned} } sort { $a->{s} <=> $b->{s} } @$r), $mean, $mean / (100 / $k);
  }
}
