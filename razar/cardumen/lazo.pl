#!/usr/bin/perl
# The loop (Capitan): the will and the school start with no shared language and talk until they understand each
# other, or not. Deterministic (a fixed-seed generator), so every run can be repeated. Nothing is tuned here: it
# measures.
#
# The will has K things to say. To say one it wakes 3 pieces of the bottom face of the cube (z = 0). The school
# lets the wave run; its answer is which pieces of the top face (z = N-1) woke. The will reads the answer with
# what it learned (for each thing, the share of times each top piece woke when it said it; it knows what it meant,
# so it learns every round) and guesses. Right: it sounds that melody once more (the school settles it). Wrong: the will, imperfect,
# moves one of the pieces it uses to say that thing.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (w0 => 40, th => 100, rate => 20, k => 4, rounds => 400, @ARGV ? map { split /=/ } @ARGV : ());
my $seed = 12345;
sub rnd { $seed = ($seed * 1103515245 + 12345) % 2147483648; return $seed; }   # the will's dice
my $c = Cardumen->new(n => $o{n} // 4, w0 => $o{w0}, th => $o{th}, rate => $o{rate}, seed => $o{nace} // 0);
my $n = $c->{n};
my @bottom = map { my $i = $_; $c->idx($i % $n, int($i / $n), 0) } 0 .. $n*$n-1;
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
if ($o{puertas}) { $c->{doors} = 1; $c->{sinks} = { %top }; }   # doors: out of tune it ends; the top face answers
if ($o{armonia}) { $c->{harmony} = 1; $c->{sinks} = { %top }; }   # harmony: a note drowned out does not pass
my @say;                                        # how the will says each thing: 3 bottom pieces
for my $m (0 .. $o{k}-1) { my %u; while (keys %u < 3) { $u{$bottom[rnd() % @bottom]} = 1 } $say[$m] = [sort { $a <=> $b } keys %u]; }
my @read = map { {} } 0 .. $o{k}-1;             # what it learned: thing -> top piece -> times heard
my @heard = (0) x $o{k};                        # how many top pieces it heard for each thing, in all
my ($ok, $reached) = (0, 0); my @blocks;
my (@said, @hits, @conf);                        # detalle=1: per thing, over the last quarter of the rounds: how
my $tail = $o{rounds} - int($o{rounds} / 4);     # many times it was said, how many right, and what it was taken for
my $h = 0;                                      # the fingerprint (huella=1): what the Janax loop must give
sub mix { $h = ($h * 31 + $_[0]) % 2 ** 48; }
for my $r (1 .. $o{rounds}) {
  my $m = ($r - 1) % $o{k};                     # what it wants to say, in turn
  my $mel = $c->signal(@{$say[$m]});
  my @answer = grep { $top{$_} } map { @$_ } @$mel;
  $reached++ if @answer;
  my ($best, $bs, $bt) = (-1, 0, 1);            # the thing whose pieces it heard most, as a share of all it heard
  for my $g (0 .. $o{k}-1) {
    next unless $heard[$g];
    my $s = 0; $s += $read[$g]{$_} // 0 for @answer;
    ($best, $bs, $bt) = ($g, $s, $heard[$g]) if $s * $bt > $bs * $heard[$g];
  }
  $best = rnd() % $o{k} if $best < 0;            # nothing learned that helps: a guess
  $read[$m]{$_}++ for @answer;                  # it knows what it meant: it learns what that sounded like
  $heard[$m] += @answer;
  my $hit = ($best == $m && @answer) ? 1 : 0;
  if ($r > $tail) { $said[$m]++; $hits[$m] += $hit; $conf[$m][$best]++; }
  mix($m * 8 + $best * 2 + $hit + 1);          # each round: what it meant, what it guessed, whether it was right
  if ($best == $m && @answer) {
    $ok++;
    $c->confirm($mel) if $o{puertas};           # the will confirmed it: in tune from now on
    $c->signal(@{$say[$m]});                    # sounded once more: the school settles it
  } else {
    my $j = rnd() % 3; my %u = map { $_ => 1 } @{$say[$m]}; delete $u{$say[$m][$j]};
    while (keys %u < 3) { $u{$bottom[rnd() % @bottom]} = 1 }
    $say[$m] = [sort { $a <=> $b } keys %u];
  }
  if ($r % 50 == 0) { push @blocks, sprintf "%3d%%", 100 * $ok / 50; $ok = 0; }
}
if ($o{huella}) {                               # and the school as it ended: its own fingerprint, mixed in
  my $hc = 0; my $mixc = sub { $hc = ($hc * 31 + $_[0]) % 2 ** 48; };
  for my $i (0 .. $c->{p} - 1) {
    $mixc->($c->{w}[$i][$_]) for 0 .. 5;
    $mixc->($c->{rate}[$i]); $mixc->($c->{frag}[$i]);
    my $t = 0; $t += 2 ** $_ for keys %{ $c->{tune}[$i] };
    $mixc->($t % 2 ** 32); $mixc->(int($t / 2 ** 32));
  }
  mix($hc);
  printf "%016X
", $h; exit;
}
if ($o{detalle}) {                              # one line: each thing as right/said, then what each was taken for
  print "detalle: ", join(" ", map { sprintf "%d=%d/%d", $_, $hits[$_] // 0, $said[$_] // 0 } 0 .. $o{k} - 1), " | confusion: ",
    join(" ", map { my $m = $_; "$m>" . join(",", map { $conf[$m][$_] // 0 } 0 .. $o{k} - 1) } 0 .. $o{k} - 1), "
";
}
printf "armonia: %s; puertas: %s; pesos al nacer: %s; th=%d (con pesos fijos harian falta %d vecinas): la ola llego arriba en %d de %d vueltas\n", ($o{armonia} ? "si" : "no"), ($o{puertas} ? "si" : "no"), ($o{nace} ? "repartidos 0..255, semilla $o{nace}" : "todos $o{w0}"), $o{th}, int(($o{th} + $o{w0} - 1) / $o{w0}), $reached, $o{rounds};
print "aciertos cada 50 vueltas (el azar es ", int(100 / $o{k}), "%): @blocks\n";
