#!/usr/bin/perl
# Words from a few units (Capitan, 2026-11-05: "reduce the vocabulary to the ones it tells apart and recombine them to
# give the rest", "we have to give it a word, not a letter", "recombine and build the language"). The base units are
# what the school tells apart for sure: every key pattern of 7 steps with the first step down and 3 more of the other
# 6 (20 units). All have the same number of pulses, so none lies inside another (Sperner): verified in the frozen cube,
# 4x4x4 and 7x7x7, no unit equal to or inside another. A letter is two units; a word is its letters. Each unit is a
# wave of its own (modelo.pl signal_waves); the will hears one unit at a time, says which it was, and puts units into
# letters and letters into words with the code table (the composition is by design, said plainly).
#
# It learns the units from a set of words (it knows which word was sent), then hears words it never heard. Options:
# n (4), nace (7), rondas (passes over the words it learns from, 20), temblor (percent chance that a pulse comes one
# step early or late: a hand on the key), quieto (1: the school never learns).
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (n => 4, nace => 7, rondas => 20, temblor => 0, @ARGV ? map { split /=/ } @ARGV : ());
my @units;                                       # alfabeto=sperner (default): the 20 units above
if (($o{alfabeto} // 'sperner') eq 'fano') {     # alfabeto=fano: the block {1, 2, 4} mod 7 (doubling, the Capitan's rule:
  for my $k (0 .. 6) {                           # 1, 2, 4, 8 = 1) and its 7 shifts; every two share one pulse (the
    my %b = map { (($_ + $k) % 7) => 1 } 1, 2, 4;   # Fano plane), so any two are 4 steps apart
    push @units, [map { $b{$_} ? 1 : 0 } 0 .. 6];
  }
} else {
  for my $b (0 .. 63) { my @p = map { ($b >> $_) & 1 } 0 .. 5; next unless 3 == grep { $_ } @p; push @units, [1, @p]; }
  if ($o{sorteo}) {                              # sorteo=K (the control for Fano): 7 of the 20, drawn by dice K, so the
    my $s = $o{sorteo};                          # only difference with Fano is the geometry (same 7 choices per slot,
    for (my $i = $#units; $i > 0; $i--) {        # every unit heard while learning)
      $s = ($s * 1103515245 + 12345) % 2147483648; my $j = ($s >> 16) % ($i + 1); @units[$i, $j] = @units[$j, $i];
    }
    @units = @units[0 .. 6];
  }
}
my $U = @units;
my $first_fixed = ($o{alfabeto} // 'sperner') ne 'fano';   # sperner units keep their first pulse: it marks the start
my @abc = ('a' .. 'z');
my %code = map { $abc[$_] => ($U == 20 ? [$_ % 20, int($_ / 20) + ($_ % 20 < 6 ? 2 : 0)] : [$_ % $U, int($_ / $U)]) }
  0 .. 25;                                       # each letter, two units
{ my %seen; for my $l (@abc) { my $k = "@{ $code{$l} }"; die "two letters share $k\n" if $seen{$k}++; } }
my @aprende = qw(sol luna mar pez barco cielo agua fuego tierra viento casa perro gato arbol flor rio monte nube
                 lluvia piedra camino puerta mesa silla libro mano ojo voz canto risa);
my @nuevas  = qw(hermano capitan janax razar melodia cardumen ola faro brujula timon vela ancla isla puerto bote
                 estrella noche dia jugo kiwi);
my %letters_learned; $letters_learned{$_}++ for map { split // } @aprende;
my $seed2 = $o{nace} * 7919 + 1;
sub rnd2 { $seed2 = ($seed2 * 1103515245 + 12345) % 2147483648; return $seed2 >> 16; }   # the hand's dice
my $c = Cardumen->new(n => $o{n}, w0 => 40, th => 100, rate => 20, seed => $o{nace});
my $n = $c->{n};
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
$c->{harmony} = 1; $c->{sinks} = { %top };
$c->{whisper} = 1 if $o{quieto};
my @key = ($c->idx(0, 0, 0), $c->idx(1, 0, 0), $c->idx(0, 1, 0));
sub send_unit {                                  # one unit through the school -> the notes it left on the top face
  my ($u) = @_; my @down = @{ $units[$u] };
  if ($o{temblor}) {                             # a pulse after the first may come a step early or late, into a free step
    my $from = $first_fixed ? 1 : 0;
    for my $i ($from .. $#down) { next unless $down[$i] && rnd2() % 100 < $o{temblor};
      my $j = $i + (rnd2() % 2 ? 1 : -1); next if $j < $from || $j > $#down || $down[$j]; @down[$i, $j] = (0, 1); }
  }
  my $mel = $c->signal_waves([ map { $_ ? [@key] : [] } @down ]);
  my @f; for my $t (0 .. $#$mel) { push @f, map { "$_:$t" } grep { $top{$_} } @{ $mel->[$t] }; }
  return \@f;
}
my (%read, %heard);
sub guess {                                      # the unit whose notes it heard most, as a share of all it heard for it
  my ($f) = @_; my ($best, $bs, $bt) = (-1, 0, 1);
  for my $u (0 .. $#units) { next unless $heard{$u}; my $s = 0; $s += $read{$u}{$_} // 0 for @$f;
    ($best, $bs, $bt) = ($u, $s, $heard{$u}) if $s * $bt > $bs * $heard{$u}; }
  return $best;
}
sub hear_word {                                  # -> the word it read; and it learns the units if asked
  my ($w, $learn, $tally) = @_; my $out = '';
  for my $l (split //, $w) {
    my @got;
    for my $u (@{ $code{$l} }) {
      my $f = send_unit($u); my $g = guess($f); push @got, $g;
      $tally->[0]++; $tally->[1]++ if $g == $u;
      if ($learn) { $read{$u}{$_}++ for @$f; $heard{$u} += @$f; }
    }
    my ($back) = grep { "@{ $code{$_} }" eq "@got" } @abc; $out .= $back // '?';
  }
  return $out;
}
my @t_learn = (0, 0);
for my $r (1 .. $o{rondas}) { hear_word($_, 1, \@t_learn) for @aprende; }
my (@t_seen, @t_new) = ((0, 0), ());
@t_new = (0, 0);
my ($ok_seen, $ok_new, @wrong) = (0, 0);
for my $w (@aprende) { $ok_seen++ if hear_word($w, 0, \@t_seen) eq $w; }
for my $w (@nuevas)  { my $got = hear_word($w, 0, \@t_new); if ($got eq $w) { $ok_new++ } else { push @wrong, "$w>$got" } }
my @never = grep { !$letters_learned{$_} } map { split // } @nuevas; my %nv; @never = grep { !$nv{$_}++ } @never;
printf "palabras: n=%d nace=%d temblor=%d%%%s; %d unidades (%s) de 7 pasos, 2 por letra\n", $o{n}, $o{nace},
  $o{temblor}, $o{quieto} ? ' quieto' : '', $U, ($o{alfabeto} // 'sperner') . ($o{sorteo} ? " sorteo $o{sorteo}" : '');
printf "unidades reconocidas: aprendiendo %d%%; despues, en palabras oidas %d%%, en palabras nuevas %d%%\n",
  100 * $t_learn[1] / $t_learn[0], 100 * $t_seen[1] / $t_seen[0], 100 * $t_new[1] / $t_new[0];
printf "palabras oidas leidas enteras: %d de %d; palabras nuevas: %d de %d%s\n", $ok_seen, scalar @aprende, $ok_new,
  scalar @nuevas, @wrong ? " (fallaron: @wrong)" : '';
printf "letras de las palabras nuevas que nunca aparecieron al aprender: %s\n", @never ? "@never" : 'ninguna';
