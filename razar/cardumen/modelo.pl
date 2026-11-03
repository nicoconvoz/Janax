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
  my $s = bless { n => $n, p => $p, w0 => $o{w0} // 40, th => $o{th} // 100, rate0 => $o{rate} // 20 }, $class;
  for my $i (0 .. $p-1) {
    $s->{w}[$i] = [ map { $s->{w0} } 0..5 ];
    $s->{rate}[$i] = $s->{rate0};
    $s->{frag}[$i] = 0;
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
    for my $i (@now) { for my $d (0..5) { my $q = $s->neighbor($i, $d); next if $q < 0 || $ft[$q] >= 0; $in{$q} += $s->{w}[$i][$d]; } }
    $t++;
    my @next = sort { $a <=> $b } grep { $in{$_} >= $s->{th} } keys %in;
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
sub woke { my ($m) = @_; my $c = 0; $c += @$_ for @$m; return $c; }
sub text { my ($m) = @_; return join ' | ', map { join ',', @$_ } @$m; }
1;
