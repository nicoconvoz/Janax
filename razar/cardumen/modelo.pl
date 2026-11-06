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
  for my $i (0 .. $p-1) {                      # what each piece says to its neighbors in all, as it was born (conserve)
    my $t = 0; $t += $s->{w}[$i][$_] for grep { $s->neighbor($i, $_) >= 0 } 0 .. 5; $s->{born}[$i] = $t;
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
      for my $d (0..5) { my $q = $s->neighbor($i, $d); next if $q < 0 || $ft[$q] >= 0; if ($s->{brake} && $s->{brake}[$i]) { $in{$q} -= $s->{w}[$i][$d]; next; } $in{$q} += $s->{w}[$i][$d]; $mask{$q} |= 1 << ($d ^ 1); }
    }
    $t++;
    my @next = sort { $a <=> $b } grep { $in{$_} >= $s->{th} && $s->in_harmony($_, $mask{$_}) && $s->in_tune($_, $mask{$_}) } keys %in;
    $ft[$_] = $t for @next;
    @now = @next;
  }
  $s->learn(\@ft) unless $s->{whisper};         # a whisper: the wave runs, the shape does not learn from it
  return \@melody;
}
# The key pressed in time (Capitan: a Morse translator at the least speed Razar reads): $sched->[t] is the pieces held
# down at step t (an empty step: the key is up). They wake whenever they are held, as a key does; every other piece
# still wakes at most once. The wave goes on while someone wakes or the key still has steps to come.
# With $s->{refractory} = R, a piece may wake again once it has rested R steps (a neuron's refractory period): R = 2
# is the least that keeps a wave from bouncing back (rested 1, the neighbor it just woke would wake it again in the
# next step), so each press of the key sends a new front up the cube. Without it, a piece wakes once per signal. A
# loop (the same state again once the key is done: the Capitan's rule) ends the wave.
sub signal_timed {
  my ($s, $sched) = @_;
  my $R = $s->{refractory};
  my @ft = (-1) x $s->{p}; my @lw = (-1) x $s->{p};   # first wake, and last wake
  my @melody; my $t = 0; my %seen; my $prev = '';
  my @now = sort { $a <=> $b } do { my %u = map { $_ => 1 } @{ $sched->[0] // [] }; keys %u };
  $ft[$_] = $lw[$_] = 0 for @now;
  my %before;                                    # who was awake the step before (for the brake that follows acceleration)
  my $D = 3 * ($s->{n} - 1); my @tired = (0) x $s->{p};   # fatigue (Capitan and the other chat, 2026-11-06), see below
  while (@now || $t < $#$sched) {
    push @melody, [@now];
    my $state = join(',', @now) . '/' . $prev; $prev = join ',', @now;
    last if $t >= $#$sched && $seen{$state}++;
    my %in; my %mask; my %awake = map { $_ => 1 } @now;
    for my $i (@now) {
      next if $s->{sinks}{$i};
      my ($num, $den) = $s->speedup($i, \%awake, \%before);
      for my $d (0..5) { my $q = $s->neighbor($i, $d); next if $q < 0;
        next if defined $R ? ($lw[$q] >= 0 && $t + 1 - $lw[$q] <= $R) : $ft[$q] >= 0;
        my $v = int($s->{w}[$i][$d] * $num / $den);
        if ($v <= 0) { $in{$q} += $v; next; } $in{$q} += $v; $mask{$q} |= 1 << ($d ^ 1); }
    }
    %before = %awake;
    $t++;
    # Fatigue (fatigue): each time a piece wakes its threshold rises by one whole threshold, and that wears off in as
    # many steps as a wave takes to cross the cube corner to corner, 3 (n - 1). A piece woken again before a wave could
    # have crossed the cube is not hearing something new, it is bouncing. Depth zero: each piece looks at its own
    # history only; it only grows with use and only falls with rest, so it cannot oscillate (spike-frequency adaptation).
    if ($s->{fatigue}) { $tired[$_] += $D for @now; $_ = $_ > 0 ? $_ - 1 : 0 for @tired; }
    my $th = sub { my $q = $_[0]; $s->{fatigue} ? $s->{th} + int($s->{th} * $tired[$q] / $D) : $s->{th} };
    my %next = map { $_ => 1 } grep { $in{$_} >= $th->($_) && $s->in_harmony($_, $mask{$_}) } keys %in;
    $next{$_} = 1 for @{ $sched->[$t] // [] };
    @now = sort { $a <=> $b } keys %next;
    $ft[$_] = $t for grep { $ft[$_] < 0 } @now;
    $lw[$_] = $t for @now;
  }
  $s->learn(\@ft) unless $s->{whisper};
  return \@melody;
}
# Each pulse of the key is a wave of its own (Capitan: the school does not hold the song; each wave is born and dies
# clean). It is the school's first rule, a piece wakes at most once per signal, read right for a key: every step the
# key is down sends a signal, and inside each wave every piece wakes once at most, so no wave can go round in circles
# and all of it dies after the last pulse. Waves do not add up: a piece wakes for a wave when that wave's neighbors
# that woke in the step before reach its threshold (and with harmony, not more than half of its own). The melody is
# every piece awake at each step, in any wave. Replaces the refractory period, it is not added to it.
sub signal_waves {
  my ($s, $sched) = @_;
  my @ft = (-1) x $s->{p};
  my (@melody, %woke, %now);                     # %now: wave -> pieces of it awake this step
  my $t = 0;
  my $press = sub { my ($t) = @_; my @k = @{ $sched->[$t] // [] }; return unless @k; $now{$t} = { map { $_ => 1 } @k }; $woke{$t}{$_} = 1 for @k; };
  $press->(0);
  my %before;
  while (%now || $t < $#$sched) {
    my %all; $all{$_} = 1 for map { keys %$_ } values %now;
    my @step = sort { $a <=> $b } keys %all;
    push @melody, \@step;
    $ft[$_] = $t for grep { $ft[$_] < 0 } @step;
    my %next;
    if ($s->{cross}) {                           # waves that cross (Capitan: the school must compute, not only carry): the
      my (%in, %mask, %by);                      # pushes of every wave add up, so a piece no single wave can wake wakes
      for my $w (keys %now) {                    # where two meet; it then belongs to every wave that pushed it. Inside
        for my $i (keys %{ $now{$w} }) {         # each wave a piece still wakes once at most: no going round in circles
          next if $s->{sinks}{$i};
          my ($num, $den) = $s->speedup($i, \%all, \%before);   # a braking piece (or one that sees its neighbors catch
          for my $d (0..5) { my $q = $s->neighbor($i, $d); next if $q < 0 || $woke{$w}{$q};   # fire) takes its push
            my $v = int($s->{w}[$i][$d] * $num / $den);                                     # away, and did not wake it
            if ($v <= 0) { $in{$q} += $v; next; }
            $in{$q} += $v; $mask{$q} |= 1 << ($d ^ 1); $by{$q}{$w} = 1; }
        }
      }
      for my $q (grep { $in{$_} >= $s->{th} && $by{$_} && $s->in_harmony($_, $mask{$_}) } keys %in) {
        for my $w (keys %{ $by{$q} }) { $next{$w}{$q} = 1; $woke{$w}{$q} = 1; }
      }
    } else {
      for my $w (keys %now) {
        my %in; my %mask;
        for my $i (keys %{ $now{$w} }) {
          next if $s->{sinks}{$i};
          for my $d (0..5) { my $q = $s->neighbor($i, $d); next if $q < 0 || $woke{$w}{$q}; if ($s->{brake} && $s->{brake}[$i]) { $in{$q} -= $s->{w}[$i][$d]; next; } $in{$q} += $s->{w}[$i][$d]; $mask{$q} |= 1 << ($d ^ 1); }
        }
        my @up = grep { $in{$_} >= $s->{th} && $s->in_harmony($_, $mask{$_}) } keys %in;
        next unless @up;
        $next{$w} = { map { $_ => 1 } @up }; $woke{$w}{$_} = 1 for @up;
      }
    }
    %before = %all;
    $t++;
    %now = %next;
    $press->($t);
  }
  $s->learn(\@ft) unless $s->{whisper};
  return \@melody;
}
# The negative melody (Capitan, 2026-11-06: "a sign bit", one per piece): a piece is born pushing or braking, with
# all its neighbors (Dale's law; in a cortex about 1 in 5 neurons brakes). $percent of the pieces brake, chosen by
# dice of their own (seeded by $seed), so the weights are the same as without it. A braking piece that is awake takes
# its weight away from what its neighbors are told (signal_waves with cross). It learns like the others: braking and
# neighbor awake together, the brake grows (Vogels and others, 2011: it brings pushes and brakes into balance).
sub set_brakes {
  my ($s, $percent, $seed) = @_;
  my $x = $seed * 104729 + 7;
  for my $i (0 .. $s->{p}-1) { $x = ($x * 1103515245 + 12345) % 2147483648; $s->{brake}[$i] = (($x >> 16) % 100) < $percent ? 1 : 0; }
}
# The shape moves by what happened in one signal: $ftr is the step each piece first woke at (-1: not then).
# How an awake piece i pushes its neighbors, as a fraction num/den of its weight. A braking piece (set_brakes) pushes
# -1. With $s->{follow} (Capitan, 2026-11-06: the brake has to follow the acceleration of the convulsion, not a fixed
# share), a piece looks at its own neighbors: if g of its N neighbors woke since the step before, it pushes
# (N - 2g)/N: all of it when nothing grows around it, nothing when half its neighbors caught fire at once, and it
# brakes with all its weight when all of them did. No share is chosen: the brake is the acceleration itself, seen
# from each piece (depth 1).
sub speedup {
  my ($s, $i, $awake, $before) = @_;
  my $sign = ($s->{brake} && $s->{brake}[$i]) ? -1 : 1;
  return ($sign, 1) unless $s->{follow};
  my ($N, $g) = (0, 0);
  for my $d (0 .. 5) { my $q = $s->neighbor($i, $d); next if $q < 0; $N++; $g++ if $awake->{$q} && !$before->{$q}; }
  return ($sign * ($N - 2 * $g), $N);
}
sub learn {
  my ($s, $ftr) = @_; my @ft = @$ftr;
  for my $i (0 .. $s->{p}-1) {                   # the shape moves by what happened
    next if $ft[$i] < 0;
    my $frag = 0;
    for my $d (0..5) {
      my $q = $s->neighbor($i, $d); next if $q < 0;
      if ($ft[$q] >= 0 && abs($ft[$q] - $ft[$i]) <= 1) {   # woke together: this step or the next
        my $v = $s->{w}[$i][$d] + $s->{rate}[$i]; $s->{w}[$i][$d] = $v > 255 ? 255 : $v; }
      elsif ($ft[$q] < 0)          { my $v = $s->{w}[$i][$d] - ($s->{weaken_rate} ? $s->{rate}[$i] : 1);   # weaken_rate:
        $s->{w}[$i][$d] = $v < 0 ? 0 : $v; }    # it weakens as fast as it strengthens (symmetric), not by one
      $frag |= 1 << $d if $ft[$i] > 0 && $ft[$q] == $ft[$i] - 1;
    }
    $s->{frag}[$i] = $frag;
    $s->{rate}[$i]-- if $s->{rate}[$i] > 1;
    $s->conserve_piece($i) if $s->{conserve};
  }
}
# The ceiling that adjusts itself (Capitan, 2026-11-05): with $s->{conserve}, each piece keeps the total it says to
# its neighbors, the one it was born with. After it learns, its weights are scaled back to that total: to say more to
# one it says less to the others, so nothing piles up against a fixed ceiling, and the links that serve take room
# from the ones that do not (competition; Oja's normalization, Turrigiano's synaptic scaling). Integers only: each
# weight is rounded, and what the rounding leaves goes, one by one, to the neighbors in direction order. A weight is
# still one byte (at most 255), as Janax keeps it.
sub conserve_piece {
  my ($s, $i) = @_;
  my @d = grep { $s->neighbor($i, $_) >= 0 } 0 .. 5;
  my $now = 0; $now += $s->{w}[$i][$_] for @d;
  my $born = $s->{born}[$i] //= $now;
  return if $now == 0 || $now == $born;
  my $left = $born;
  for my $d (@d) { my $v = int(($s->{w}[$i][$d] * $born + int($now / 2)) / $now); $v = 255 if $v > 255; $s->{w}[$i][$d] = $v; $left -= $v; }
  for my $d (@d) { last if $left == 0; my $v = $s->{w}[$i][$d] + ($left > 0 ? 1 : -1); next if $v < 0 || $v > 255; $s->{w}[$i][$d] = $v; $left += $left > 0 ? -1 : 1; }
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
# The living melody (Capitan: "the door is the melody itself, sounding and changing"; "a loop is the same task
# repeated identically"). The melody does not end with the signal: a piece can wake again, never two steps in a row
# (the least that gives the wave a direction), and what is sounding is carried to the next signal, which joins it.
# What is sounding is the door: a piece awake now cannot be woken in the next step. The steps of one signal go on
# while someone wakes for the first time since the signal (news); then the will listens, and the melody stays as it
# is. It rests (silence, costing nothing) when nobody wakes (it died) or when a step repeats exactly a state it
# already had since it last rested (a loop, also across signals: the same task repeated identically).
# -> the melody (each step: the sorted pieces awake in it); the shape learns from it, as with signal().
sub signal_viva {
  my ($s, @seeds) = @_;
  my %start = map { $_ => 1 } @{ $s->{sounding} // [] }, @seeds;
  my @now = sort { $a <=> $b } keys %start;
  my (@melody, %first);
  my $seen = $s->{seen} //= {};               # the states it had since it last rested: a loop is a loop across signals too
  $first{$_} = 0 for @now;
  my $t = 0;
  while (1) {
    push @melody, [@now];
    my %in; my %mask; my %awake = map { $_ => 1 } @now;
    for my $i (@now) {
      next if $s->{sinks}{$i};
      for my $d (0..5) { my $q = $s->neighbor($i, $d); next if $q < 0 || $awake{$q}; if ($s->{brake} && $s->{brake}[$i]) { $in{$q} -= $s->{w}[$i][$d]; next; } $in{$q} += $s->{w}[$i][$d]; $mask{$q} |= 1 << ($d ^ 1); }
    }
    $t++;
    my @next = sort { $a <=> $b } grep { $in{$_} >= $s->{th} && $s->in_harmony($_, $mask{$_}) } keys %in;
    my $key = join ',', @next;
    if (!@next || $seen->{$key}) { $s->{sounding} = []; $s->{seen} = {}; last; }   # it died, or it became a loop: it rests
    $seen->{$key} = 1;
    my $news = grep { !exists $first{$_} } @next;
    $first{$_} //= $t for @next;
    @now = @next;
    if (!$news) { $s->{sounding} = [@now]; last; }               # no news: the will listens, the melody stays
  }
  my %times; for my $u (0 .. $#melody) { push @{ $times{$_} }, $u for @{ $melody[$u] }; }
  for my $i (0 .. $s->{p}-1) {                   # the shape moves by what happened (woke together: within a step)
    next unless $times{$i};
    my $frag = 0;
    for my $d (0..5) {
      my $q = $s->neighbor($i, $d); next if $q < 0;
      if ($times{$q} && grep { my $a = $_; grep { abs($a - $_) <= 1 } @{ $times{$q} } } @{ $times{$i} }) {
        my $v = $s->{w}[$i][$d] + $s->{rate}[$i]; $s->{w}[$i][$d] = $v > 255 ? 255 : $v; }
      elsif (!$times{$q}) { $s->{w}[$i][$d]-- if $s->{w}[$i][$d] > 0; }
      $frag |= 1 << $d if $first{$i} > 0 && exists $first{$q} && $first{$q} == $first{$i} - 1;
    }
    $s->{frag}[$i] = $frag;
    $s->{rate}[$i]-- if $s->{rate}[$i] > 1;
  }
  $s->{nsig}++; $s->{rested}++ unless @{ $s->{sounding} };
  return \@melody;
}
sub woke { my ($m) = @_; my $c = 0; $c += @$_ for @$m; return $c; }
sub text { my ($m) = @_; return join ' | ', map { join ',', @$_ } @$m; }
1;
