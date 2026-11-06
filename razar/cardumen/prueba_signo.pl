#!/usr/bin/perl
# Checks for the negative melody (modelo.pl: brake, set_brakes): small cases built by hand, where the answer is exact.
# A 3x3x3 cube with every weight 0 but two: the center q is told 150 by its -x neighbor e and 100 by its +x neighbor b;
# the threshold is 100. If b pushes, q wakes; if b brakes, q is told 50 and does not. Every way the school spreads a
# wave has to agree. Prints "bien" or "MAL" per check and ends with the count.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my ($ok, $bad) = (0, 0);
sub check { my ($name, $cond) = @_; if ($cond) { $ok++; print "bien  $name\n" } else { $bad++; print "MAL   $name\n" } }
sub cube {
  my (%o) = @_;
  my $c = Cardumen->new(n => 3, w0 => 0, th => 100, rate => 20, seed => 0);
  $c->{w}[12][0] = 150;                          # e (0,1,1) -> q (1,1,1): direction +x
  $c->{w}[14][1] = 100;                          # b (2,1,1) -> q: direction -x
  $c->{brake}[$_] = 0 for 0 .. $c->{p} - 1;
  $c->{brake}[14] = 1 if $o{brake};
  $c->{harmony} = 1 if $o{harmony};
  $c->{whisper} = 1 unless $o{learn};
  return $c;
}
sub woke_q { my ($mel) = @_; return scalar grep { $_ == 13 } map { @$_ } @$mel[1 .. $#$mel]; }
my %ways = (
  'signal'                  => sub { $_[0]->signal(12, 14) },
  'signal_timed sin reposo' => sub { $_[0]->signal_timed([[12, 14]]) },
  'signal_timed reposo 2'   => sub { $_[0]{refractory} = 2; $_[0]->signal_timed([[12, 14]]) },
  'signal_waves separadas'  => sub { $_[0]->signal_waves([[12, 14]]) },
  'signal_waves cruzan'     => sub { $_[0]{cross} = 1; $_[0]->signal_waves([[12, 14]]) },
  'signal_viva'             => sub { $_[0]->signal_viva(12, 14) },
);
for my $way (sort keys %ways) {
  check("$way: con b que empuja, q despierta", woke_q($ways{$way}->(cube())));
  check("$way: con b que frena, q no despierta", !woke_q($ways{$way}->(cube(brake => 1))));
}
{ # a braking piece is woken like any other: q wakes it (q -> b, +x) when q is awake and pushes enough
  my $c = cube(brake => 1); $c->{w}[13][0] = 120;
  my $mel = $c->signal(13);
  check("una pieza que frena despierta como cualquiera", scalar grep { $_ == 14 } map { @$_ } @$mel);
}
{ # harmony counts only the neighbors that pushed. A corner (0,0,0) has 3 neighbors: two of them waking it is more than
  # half, and harmony cuts it. Neighbor 1 pushes 255 and neighbor 3 brakes 50 (told 205): only one woke it, it passes.
  my $c = Cardumen->new(n => 3, w0 => 0, th => 100, rate => 20, seed => 0); $c->{harmony} = 1; $c->{whisper} = 1;
  $c->{brake}[$_] = 0 for 0 .. 26; $c->{w}[1][1] = 255; $c->{w}[3][3] = 50; $c->{brake}[3] = 1;
  my $mel = $c->signal(1, 3);
  check("la armonia no cuenta al que frena", scalar grep { $_ == 0 } map { @$_ } @$mel[1 .. $#$mel]);
}
{ # learning: b brakes and q wakes with it (pushed by e alone, 250 - 100 = 150): the brake b -> q grows, as a push would
  my $c = cube(brake => 1, learn => 1); $c->{w}[12][0] = 250;
  my $before = $c->{w}[14][1]; my $mel = $c->signal(12, 14);
  check("el freno que cae junto con su vecina crece", woke_q($mel) && $c->{w}[14][1] > $before);
}
{ # conserve: with brakes, each piece still keeps its total, as it was born
  my $c = Cardumen->new(n => 4, seed => 7, harmony => 1); $c->{sinks} = { map { $_ => 1 } 48 .. 63 };
  $c->set_brakes(20, 1001); $c->{conserve} = 1; $c->{cross} = 1;
  my $born = 0; $born += $_ for @{ $c->{born} };
  $c->signal_waves([[0, 1, 4], [], [0, 1, 4]]) for 1 .. 100;
  my $now = 0; for my $i (0 .. 63) { $now += $c->{w}[$i][$_] for grep { $c->neighbor($i, $_) >= 0 } 0 .. 5; }
  check("con frenos cada pieza conserva su total ($born)", $now == $born);
}
{ # set_brakes: the same seed gives the same pieces, and the share is near what was asked
  my $c = Cardumen->new(n => 7, seed => 7); $c->set_brakes(20, 1001); my @a = @{ $c->{brake} };
  $c->set_brakes(20, 1001); my $same = !grep { $a[$_] != $c->{brake}[$_] } 0 .. $#a;
  my $n = grep { $_ } @a;
  check("los frenos salen iguales con la misma semilla", $same);
  check("con 20 % piden frenar $n de 343 (entre 15 y 25 %)", $n >= 51 && $n <= 86);
}
print "$ok bien, $bad mal\n";
exit($bad ? 1 : 0);
