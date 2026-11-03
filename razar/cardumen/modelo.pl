#!/usr/bin/perl
# Razar's school (cardumen), reference model v0 (Capitan, 2026-11-03). Integers only, deterministic: the same
# history of signals gives the same journeys, bit for bit. The Janax version must match it exactly.
#
# A cube of N*N*N pieces. Each piece talks only to its 6 direct neighbors (depth 1): how much it says to each
# one is a weight (0..255). A signal is a set of pieces woken at once; then the wave goes on step by step: a
# piece wakes when what its neighbors that woke in the step before say to it adds up to its threshold. A piece
# wakes at most once per signal, so the wave always ends. The journey (which pieces woke at which step) is the
# melody.
#
# After each signal the shape moves by the interaction, never by a clock: a piece speaks more to a neighbor
# that woke together with it, in the same step or the next (+ its rate) (Capitan: "the ones that fall together"); one whose neighbor never woke speaks a little less (-1). The rate
# is the piece's own state, not a constant (metaplasticity): each time a piece wakes, its rate drops by one,
# down to 1, so what is used a lot settles. Each piece also keeps its fragment of the last melody: which of
# its neighbors woke it.
use strict; use warnings;

package Cardumen;
our $N = 4;
our @DIRS = ([1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]);

sub new {
  my ($class, %o) = @_;
  my $n = $o{n} // $N; my $p = $n*$n*$n;
  my $s = bless { n => $n, p => $p, w0 => $o{w0} // 40, th => $o{th} // 100, rate0 => $o{rate} // 20,
                  doors => $o{doors} // 0, harmony => $o{harmony} // 0, sinks => { map { $_ => 1 } @{ $o{sinks} // [] } } }, $class;
  my $seed = $o{seed} // 0;                    # born different (Capitan: relations are born each its own): a fixed seed,
  for my $i (0 .. $p-1) {                      # so every school with the same seed is the same school
    $s->{w}[$i] = [ map { $seed ? do { $seed = ($seed * 1103515245 + 12345) % 2147483648; ($seed >> 16) % 256 } : $s->{w0} } 0..5 ];
    $s->{rate}[$i] = $s->{rate0};
    $s->{frag}[$i] = 0;
    $s->{tune}[$i] = {};                        # the fragments the will confirmed: who woke it, in tune
  }
  return $s;
}
sub idx { my ($s, $x, $y, $z) = @_; return $x + $s->{n}*($y + $s->{n}*$z); }
sub neighbor {                                  # piece i, direction d -> the neighbor, or -1 past the edge
  my ($s, $i, $d) = @_; my $n = $s->{n};
  my ($x, $y, $z) = ($i % $n, int($i/$n) % $n, int($i/($n*$n)));
  my ($a, $b, $c) = ($x + $DIRS[$d][0], $y + $DIRS[$d][1], $z + $DIRS[$d][2]);
  return -1 if $a < 0 || $b < 0 || $c < 0 || $a >= $n || $b >= $n || $c >= $n;
  return $s->idx($a, $b, $c);
}
# One signal: the pieces woken at once. -> the melody, an array of steps, each the sorted list of pieces that
# woke in it. The shape learns from it.
sub signal {
  my ($s, @seeds) = @_;
  my @ft = (-1) x $s->{p};                       # the step each piece woke at, -1 = not this time
  my @melody; my @now = sort { $a <=> $b } do { my %u = map { $_ => 1 } @seeds; keys %u };
  $ft[$_] = 0 for @now;
  my $t = 0;
  while (@now) {
    push @melody, [@now];
    my %in;
    my %mask;
    for my $i (@now) {
      next if $s->{sinks}{$i};                 # it answered already: its branch ends here
      for my $d (0..5) { my $q = $s->neighbor($i, $d); next if $q < 0 || $ft[$q] >= 0; $in{$q} += $s->{w}[$i][$d]; $mask{$q} |= 1 << ($d ^ 1); }
    }
    $t++;
    my @next = sort { $a <=> $b } grep { $in{$_} >= $s->{th} && $s->in_harmony($_, $mask{$_}) && $s->in_tune($_, $mask{$_}) } keys %in;
    $ft[$_] = $t for @next;
    @now = @next;
  }
  for my $i (0 .. $s->{p}-1) {                   # the shape moves by what happened
    next if $ft[$i] < 0;
    my $frag = 0;
    for my $d (0..5) {
      my $q = $s->neighbor($i, $d); next if $q < 0;
      if ($ft[$q] >= 0 && abs($ft[$q] - $ft[$i]) <= 1) {   # woke together: this step or the next
        my $v = $s->{w}[$i][$d] + $s->{rate}[$i]; $s->{w}[$i][$d] = $v > 255 ? 255 : $v; }
      elsif ($ft[$q] < 0)          { $s->{w}[$i][$d]-- if $s->{w}[$i][$d] > 0; }
      $frag |= 1 << $d if $ft[$i] > 0 && $ft[$q] == $ft[$i] - 1;
    }
    $s->{frag}[$i] = $frag;
    $s->{rate}[$i]-- if $s->{rate}[$i] > 1;
  }
  return \@melody;
}
# Harmony (Capitan: "harmony is the key: a harmonious brain does not convulse, it works... something that sounds
# bad does not fit, and it is cut before the error spreads"): a note fits if it is not drowned out. With harmony,
# piece q does not let the pulse pass when more than half of its own neighbors woke it at once: that is the crowd
# of a convulsion, not a note. Half of its own: a corner has 3 neighbors, a piece inside 6.
sub in_harmony {
  my ($s, $q, $mask) = @_;
  return 1 unless $s->{harmony};
  my ($on, $all) = (0, 0);
  for my $d (0..5) { next if $s->neighbor($q, $d) < 0; $all++; $on++ if $mask & (1 << $d); }
  return 2 * $on <= $all;
}
# Whether piece q, woken by its neighbors in mask (bit d = the neighbor in direction d), lets the pulse pass
# (Capitan: "when a melody goes out of tune the pulse of that branch ends"): with doors, a piece that remembers
# confirmed fragments passes only if mask shares a neighbor with one of them; one with no memory yet passes.
sub in_tune {
  my ($s, $q, $mask) = @_;
  return 1 unless $s->{doors};
  my @known = keys %{ $s->{tune}[$q] };
  return 1 unless @known;
  for my $f (@known) { return 1 if $f & $mask; }
  return 0;
}
# The will confirmed this melody: each piece woken after the first step remembers who woke it, as in tune.
sub confirm {
  my ($s, $m) = @_;
  my %ft; for my $t (0 .. $#$m) { $ft{$_} = $t for @{ $m->[$t] }; }
  for my $t (1 .. $#$m) { for my $q (@{ $m->[$t] }) {
    my $mask = 0;
    for my $d (0..5) { my $p = $s->neighbor($q, $d); $mask |= 1 << $d if $p >= 0 && exists $ft{$p} && $ft{$p} == $t - 1; }
    $s->{tune}[$q]{$mask} = 1 if $mask;
  } }
}
sub woke { my ($m) = @_; my $c = 0; $c += @$_ for @$m; return $c; }
sub text { my ($m) = @_; return join ' | ', map { join ',', @$_ } @$m; }
1;
