#!/usr/bin/perl
# Words by kind of greeting (Capitan, 2026-11-06: "instead of by times, can it not be by a different kind of
# greeting?"). A unit is no longer when the key is pressed but which key: a set of 3 bottom pieces, pressed once, in a
# single step. Time only orders the units of a word. Which keys, without inventing them: the 7 lines of the Fano plane
# over 7 bottom pieces (every two keys share exactly one piece: the widest apart 7 keys of 3 can be), the same
# structure that won in time, now in place. A letter is two units, each its own wave (modelo.pl signal_waves); the
# will hears one unit at a time, says which, and puts units into letters and letters into words with the code table.
#
# A shaky hand no longer moves anything in time; the noise that means something here is a slipping finger (desliz=P:
# percent chance that one of the 3 pieces lands on a neighbor of it on the bottom face). Options as in palabras.pl:
# n (4), nace (7), rondas (20), quieto, olas (cruzan), asienta, conserva, simetrico, frenan, sorteo (K: 7 random keys).

use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (n => 4, nace => 7, rondas => 20, desliz => 0, @ARGV ? map { split /=/ } @ARGV : ());
my $c = Cardumen->new(n => $o{n}, w0 => 40, th => 100, rate => 20, seed => $o{nace});
my $n = $c->{n};
my @bottom = map { $c->idx($_ % $n, int($_ / $n), 0) } 0 .. $n*$n-1;
my @spots = @bottom[0 .. 6];                     # the 7 places of the keyboard, in order
my @units = map { my $k = $_; [ map { $spots[($_ + $k) % 7] } 1, 2, 4 ] } 0 .. 6;   # the lines {1,2,4} + k mod 7
if ($o{sorteo}) {                                # sorteo=K (the control for Fano in space): 7 different keys of 3 pieces
  my $s = $o{sorteo}; my %seen; @units = ();     # drawn by dice K from the same 7 places, so the only difference with
  while (@units < 7) {                           # Fano is which pieces go together
    my %k; while (keys %k < 3) { $s = ($s * 1103515245 + 12345) % 2147483648; $k{ $spots[($s >> 16) % 7] } = 1; }
    my @key = sort { $a <=> $b } keys %k; next if $seen{"@key"}++; push @units, \@key;
  }
}
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
$c->{harmony} = 1; $c->{sinks} = { %top };
$c->{whisper} = 1 if $o{quieto};
$c->{cross} = 1 if ($o{olas} // '') eq 'cruzan';
$c->{conserve} = 1 if $o{conserva};
$c->{weaken_rate} = 1 if $o{simetrico};
$c->set_brakes($o{frenan}, $o{nace}) if $o{frenan};
my @abc = ('a' .. 'z');
my %code = map { $abc[$_] => [$_ % 7, int($_ / 7)] } 0 .. 25;
my @aprende = qw(sol luna mar pez barco cielo agua fuego tierra viento casa perro gato arbol flor rio monte nube
                 lluvia piedra camino puerta mesa silla libro mano ojo voz canto risa);
my @nuevas  = qw(hermano capitan janax razar melodia cardumen ola faro brujula timon vela ancla isla puerto bote
                 estrella noche dia jugo kiwi);
my $seed2 = $o{nace} * 7919 + 1;
sub rnd2 { $seed2 = ($seed2 * 1103515245 + 12345) % 2147483648; return $seed2 >> 16; }   # the finger's dice
sub slip {                                       # a bottom piece -> one of its neighbors on the bottom face
  my ($p) = @_; my @nb = grep { $_ >= 0 } map { $c->neighbor($p, $_) } 0 .. 3; return $nb[rnd2() % @nb];
}
sub send_unit {
  my ($u, $clean) = @_; my @key = @{ $units[$u] };
  if (!$clean && $o{desliz} && rnd2() % 100 < $o{desliz}) { my $j = rnd2() % 3; $key[$j] = slip($key[$j]); }
  my $mel = $c->signal_waves([ [@key] ]);
  my @f; for my $t (0 .. $#$mel) { push @f, map { "$_:$t" } grep { $top{$_} } @{ $mel->[$t] }; }
  return \@f;
}
my (%read, %heard);
sub guess {
  my ($f) = @_; my ($best, $bs, $bt) = (-1, 0, 1);
  for my $u (0 .. $#units) { next unless $heard{$u}; my $s = 0; $s += $read{$u}{$_} // 0 for @$f;
    ($best, $bs, $bt) = ($u, $s, $heard{$u}) if $s * $bt > $bs * $heard{$u}; }
  return $best;
}
sub hear_word {
  my ($w, $learn, $tally) = @_; my $out = '';
  for my $l (split //, $w) {
    my @got;
    for my $u (@{ $code{$l} }) {
      my $f = send_unit($u); my $g = guess($f); push @got, $g;
      $tally->[0]++; $tally->[1]++ if $g == $u;
      if ($learn) { $read{$u}{$_}++ for @$f; $heard{$u} += @$f; send_unit($u, 1) if $o{asienta} && $g == $u; }
    }
    my ($back) = grep { "@{ $code{$_} }" eq "@got" } @abc; $out .= $back // '?';
  }
  return $out;
}
my @t_learn = (0, 0);
for my $r (1 .. $o{rondas}) { hear_word($_, 1, \@t_learn) for @aprende; }
my @t_seen = (0, 0); my @t_new = (0, 0);
my ($ok_seen, $ok_new, @wrong) = (0, 0);
for my $w (@aprende) { $ok_seen++ if hear_word($w, 0, \@t_seen) eq $w; }
for my $w (@nuevas)  { my $got = hear_word($w, 0, \@t_new); if ($got eq $w) { $ok_new++ } else { push @wrong, "$w>$got" } }
printf "saludos: n=%d nace=%d desliz=%d%%%s; 7 teclas de 3 piezas (lineas de Fano), 2 por letra\n", $o{n}, $o{nace},
  $o{desliz}, $o{quieto} ? ' quieto' : '';
printf "unidades reconocidas: aprendiendo %d%%; despues, en palabras oidas %d%%, en palabras nuevas %d%%\n",
  100 * $t_learn[1] / $t_learn[0], 100 * $t_seen[1] / $t_seen[0], 100 * $t_new[1] / $t_new[0];
printf "palabras oidas leidas enteras: %d de %d; palabras nuevas: %d de %d%s\n", $ok_seen, scalar @aprende, $ok_new,
  scalar @nuevas, @wrong ? " (fallaron: @wrong)" : '';
