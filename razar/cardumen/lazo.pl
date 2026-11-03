#!/usr/bin/perl
# The loop (Capitan): the will and the school start with no shared language and talk until they understand each
# other, or not. Deterministic (a fixed-seed generator), so every run can be repeated. Nothing is tuned here: it
# measures.
#
# The will has K things to say. To say one it wakes 3 pieces of the bottom face of the cube (z = 0). The school
# lets the wave run; its answer is which pieces of the top face (z = N-1) woke. The will reads the answer with
# what it learned (for each thing, how often each top piece woke when it said it) and guesses. Right: it sounds
# that melody once more (the school settles it) and notes which pieces meant that. Wrong: the will, imperfect,
# moves one of the pieces it uses to say that thing.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (w0 => 40, th => 100, rate => 20, k => 4, rounds => 400, @ARGV ? map { split /=/ } @ARGV : ());
my $seed = 12345;
sub rnd { $seed = ($seed * 1103515245 + 12345) % 2147483648; return $seed; }   # the will's dice
my $c = Cardumen->new(w0 => $o{w0}, th => $o{th}, rate => $o{rate}, seed => $o{nace} // 0);
my $n = $c->{n};
my @bottom = map { my $i = $_; $c->idx($i % $n, int($i / $n), 0) } 0 .. $n*$n-1;
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
if ($o{puertas}) { $c->{doors} = 1; $c->{sinks} = { %top }; }   # doors: out of tune it ends; the top face answers
my @say;                                        # how the will says each thing: 3 bottom pieces
for my $m (0 .. $o{k}-1) { my %u; while (keys %u < 3) { $u{$bottom[rnd() % @bottom]} = 1 } $say[$m] = [sort { $a <=> $b } keys %u]; }
my @read = map { {} } 0 .. $o{k}-1;             # what it learned: thing -> top piece -> times
my ($ok, $reached) = (0, 0); my @blocks;
for my $r (1 .. $o{rounds}) {
  my $m = ($r - 1) % $o{k};                     # what it wants to say, in turn
  my $mel = $c->signal(@{$say[$m]});
  my @answer = grep { $top{$_} } map { @$_ } @$mel;
  $reached++ if @answer;
  my ($best, $score) = (-1, -1);
  for my $g (0 .. $o{k}-1) { my $s = 0; $s += $read[$g]{$_} // 0 for @answer; ($best, $score) = ($g, $s) if $s > $score; }
  $best = rnd() % $o{k} if $score <= 0;         # nothing learned that helps: a guess
  if ($best == $m && @answer) {
    $ok++;
    $read[$m]{$_}++ for @answer;
    $c->confirm($mel) if $o{puertas};           # the will confirmed it: in tune from now on
    $c->signal(@{$say[$m]});                    # sounded once more: the school settles it
  } else {
    my $j = rnd() % 3; my %u = map { $_ => 1 } @{$say[$m]}; delete $u{$say[$m][$j]};
    while (keys %u < 3) { $u{$bottom[rnd() % @bottom]} = 1 }
    $say[$m] = [sort { $a <=> $b } keys %u];
  }
  if ($r % 50 == 0) { push @blocks, sprintf "%3d%%", 100 * $ok / 50; $ok = 0; }
}
printf "puertas: %s; pesos al nacer: %s; th=%d (con pesos fijos harian falta %d vecinas): la ola llego arriba en %d de %d vueltas\n", ($o{puertas} ? "si" : "no"), ($o{nace} ? "repartidos 0..255, semilla $o{nace}" : "todos $o{w0}"), $o{th}, int(($o{th} + $o{w0} - 1) / $o{w0}), $reached, $o{rounds};
print "aciertos cada 50 vueltas (el azar es ", int(100 / $o{k}), "%): @blocks\n";
