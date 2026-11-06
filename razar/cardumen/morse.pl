#!/usr/bin/perl
# Morse through the school (Capitan, 2026-11-05: "a Morse code translator, machine-code style, that it understands";
# "at the least speed Razar reads, to save needless time"). A second task, apart from the signaling game: the input
# now comes in time. One key (3 fixed bottom pieces) is held down for a dot (1 step) or a dash (raya= steps), with
# hueco= steps up between the marks of a letter. The school hears the letter as it comes (modelo.pl signal_timed); the
# will listens to the melody on the top face and says which of the 26 letters it was. It knows which letter was sent,
# so it learns every round (this is learning with the answer, said plainly). Deterministic: fixed dice.
#
# Options: n (cube side, 4), nace (seed of the school, 7), armonia (1), raya (2), hueco (1), rounds (26 * 40),
# temblor (percent chance that each mark or gap comes one step longer or shorter, never under 1: a hand on the key),
# lee (ritmo: which top pieces and when, the default; piezas: which only; revuelto: the steps shuffled, the control),
# quieto (1: the school never learns), refractario (2: steps a piece rests before it may wake again; no: once per
# letter, as in the signaling game; olas: each pulse of the key is a wave of its own, modelo.pl signal_waves).
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (n => 4, nace => 7, armonia => 1, raya => 2, hueco => 1, refractario => 2, rounds => 26 * 40, temblor => 0, lee => 'ritmo',
         @ARGV ? map { split /=/ } @ARGV : ());
my %morse = (A => '.-', B => '-...', C => '-.-.', D => '-..', E => '.', F => '..-.', G => '--.', H => '....',
  I => '..', J => '.---', K => '-.-', L => '.-..', M => '--', N => '-.', O => '---', P => '.--.', Q => '--.-',
  R => '.-.', S => '...', T => '-', U => '..-', V => '...-', W => '.--', X => '-..-', Y => '-.--', Z => '--..');
my @letters = sort keys %morse;
my $seed = 12345;
sub rnd { $seed = ($seed * 1103515245 + 12345) % 2147483648; return $seed; }              # the key's dice
my $seed2 = $o{nace} * 7919 + 1;
sub rnd2 { $seed2 = ($seed2 * 1103515245 + 12345) % 2147483648; return $seed2 >> 16; }    # the hand's and the shuffle's
my $c = Cardumen->new(n => $o{n}, w0 => 40, th => 100, rate => 20, seed => $o{nace});
my $n = $c->{n};
my @bottom = map { my $i = $_; $c->idx($i % $n, int($i / $n), 0) } 0 .. $n*$n-1;
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
if ($o{armonia}) { $c->{harmony} = 1; }
$c->{sinks} = { %top };                          # the top face answers
$c->{whisper} = 1 if $o{quieto};
$c->{refractory} = $o{refractario} unless $o{refractario} =~ /^(no|olas|cruzan)$/;   # a piece rests R steps, then may wake again
my %u; while (keys %u < 3) { $u{$bottom[rnd() % @bottom]} = 1 } my @key = sort { $a <=> $b } keys %u;
sub shaky { my ($d) = @_; return $d unless $o{temblor} && rnd2() % 100 < $o{temblor};       # one step more or less
  my $e = $d + (rnd2() % 2 ? 1 : -1); return $e < 1 ? 1 : $e; }
sub schedule {                                   # the letter as the key sends it: a list of steps, each the pieces down
  my ($code) = @_; my @s;
  my @marks = split //, $code;
  for my $j (0 .. $#marks) {
    push @s, ([@key]) x shaky($marks[$j] eq '.' ? 1 : $o{raya});
    push @s, ([]) x shaky($o{hueco}) if $j < $#marks;
  }
  return \@s;
}
my (%read, %heard, @blocks, $ok, $steps, %said, %hits);
my $tail = $o{rounds} - int($o{rounds} / 4);
for my $r (1 .. $o{rounds}) {
  my $l = $letters[($r - 1) % @letters];
  my $sch = schedule($morse{$l});
  $steps += @$sch;
  $c->{cross} = 1 if $o{refractario} eq 'cruzan';
  my $mel = $o{refractario} =~ /^(olas|cruzan)$/ ? $c->signal_waves($sch) : $c->signal_timed($sch);
  my @at; for my $t (0 .. $#$mel) { push @at, map { [$_, $t] } grep { $top{$_} } @{ $mel->[$t] }; }
  if ($o{lee} eq 'revuelto') {                   # the control: the same notes and the same steps, shuffled between them
    my @t = map { $_->[1] } @at;
    for (my $i = $#t; $i > 0; $i--) { my $j = rnd2() % ($i + 1); @t[$i, $j] = @t[$j, $i]; }
    $at[$_][1] = $t[$_] for 0 .. $#at;
  }
  my @feat = $o{lee} eq 'piezas' ? do { my %one; grep { !$one{$_}++ } map { $_->[0] } @at } : map { "$_->[0]:$_->[1]" } @at;
  my ($best, $bs, $bt) = ('', 0, 1);             # the letter whose notes it heard most, as a share of all it heard
  for my $g (@letters) {
    next unless $heard{$g};
    my $s = 0; $s += $read{$g}{$_} // 0 for @feat;
    ($best, $bs, $bt) = ($g, $s, $heard{$g}) if $s * $bt > $bs * $heard{$g};
  }
  $best = $letters[rnd() % @letters] if $best eq '';
  $read{$l}{$_}++ for @feat; $heard{$l} += @feat;
  my $hit = ($best eq $l && @feat) ? 1 : 0;
  $ok += $hit;
  if ($r > $tail) { $said{$l}++; $hits{$l} += $hit; }
  if ($r % (26 * 4) == 0) { push @blocks, sprintf "%3d%%", 100 * $ok / (26 * 4); $ok = 0; }
}
my ($sh, $ss) = (0, 0); $sh += $hits{$_} // 0, $ss += $said{$_} // 0 for @letters;
printf "morse: n=%d nace=%d armonia=%d refractario=%s raya=%d hueco=%d temblor=%d%% lee=%s%s: %.1f pasos de tecla por letra\n",
  $o{n}, $o{nace}, $o{armonia}, $o{refractario}, $o{raya}, $o{hueco}, $o{temblor}, $o{lee}, $o{quieto} ? ' quieto' : '', $steps / $o{rounds};
print "aciertos cada 104 letras (el azar es 3%): @blocks\n";
printf "ultimo cuarto: %d%% (%d de %d); letras que no salieron perfectas: %s\n", 100 * $sh / $ss, $sh, $ss,
  join(" ", map { "$_=" . ($hits{$_} // 0) . "/" . $said{$_} } grep { ($hits{$_} // 0) < $said{$_} } @letters) || 'ninguna';
