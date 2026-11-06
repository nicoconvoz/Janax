#!/usr/bin/perl
# Morse made of greetings (Capitan, 2026-11-06: "instead of times, greetings: Morse code of greetings, with no times to
# bother"). The real Morse table, but a dot and a dash are two kinds of greeting (two keys), not two lengths, and since
# there is no silence to end a letter, a third kind says "end of letter". Each greeting is one key (3 bottom pieces)
# pressed once, in a wave of its own (modelo.pl signal_waves): nothing depends on how long anything lasts. The will
# hears one greeting at a time, says which of the three it was, and reads letters with the Morse table and words from
# the letters. It knows what was sent, so it learns (said plainly).
#
# The three keys are three corners of the bottom face, as far apart as the face allows (a criterion, not a
# measurement). The noise that means something here is a slipping finger (desliz=P: percent chance that one of the 3
# pieces of a key lands on a neighbor). Options: n (4), nace (7), rondas (20), desliz (0), quieto.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (n => 4, nace => 7, rondas => 20, desliz => 0, @ARGV ? map { split /=/ } @ARGV : ());
my %morse = (a => '.-', b => '-...', c => '-.-.', d => '-..', e => '.', f => '..-.', g => '--.', h => '....',
  i => '..', j => '.---', k => '-.-', l => '.-..', m => '--', n => '-.', o => '---', p => '.--.', q => '--.-',
  r => '.-.', s => '...', t => '-', u => '..-', v => '...-', w => '.--', x => '-..-', y => '-.--', z => '--..');
my %letter_of = reverse %morse;
my $c = Cardumen->new(n => $o{n}, w0 => 40, th => 100, rate => 20, seed => $o{nace});
my $n = $c->{n}; my $m = $n - 1;
my %keys = ('.' => [ map { $c->idx(@$_, 0) } [0, 0], [1, 0], [0, 1] ],          # dot: one corner
            '-' => [ map { $c->idx(@$_, 0) } [$m, 0], [$m - 1, 0], [$m, 1] ],   # dash: the next corner
            '|' => [ map { $c->idx(@$_, 0) } [0, $m], [1, $m], [0, $m - 1] ]);  # end of letter: the third
my @kinds = ('.', '-', '|');
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
$c->{harmony} = 1; $c->{sinks} = { %top };
$c->{whisper} = 1 if $o{quieto};
my @aprende = qw(sol luna mar pez barco cielo agua fuego tierra viento casa perro gato arbol flor rio monte nube
                 lluvia piedra camino puerta mesa silla libro mano ojo voz canto risa);
my @nuevas  = qw(hermano capitan janax razar melodia cardumen ola faro brujula timon vela ancla isla puerto bote
                 estrella noche dia jugo kiwi);
my $seed2 = $o{nace} * 7919 + 1;
sub rnd2 { $seed2 = ($seed2 * 1103515245 + 12345) % 2147483648; return $seed2 >> 16; }   # the finger's dice
sub greet {                                      # one greeting through the school -> the notes it left on the top face
  my ($k) = @_; my @key = @{ $keys{$k} };
  if ($o{desliz} && rnd2() % 100 < $o{desliz}) {
    my $j = rnd2() % 3; my @nb = grep { $_ >= 0 } map { $c->neighbor($key[$j], $_) } 0 .. 3; $key[$j] = $nb[rnd2() % @nb];
  }
  my $mel = $c->signal_waves([ [@key] ]);
  my @f; for my $t (0 .. $#$mel) { push @f, map { "$_:$t" } grep { $top{$_} } @{ $mel->[$t] }; }
  return \@f;
}
my (%read, %heard);
sub guess {
  my ($f) = @_; my ($best, $bs, $bt) = ('', 0, 1);
  for my $k (@kinds) { next unless $heard{$k}; my $s = 0; $s += $read{$k}{$_} // 0 for @$f;
    ($best, $bs, $bt) = ($k, $s, $heard{$k}) if $s * $bt > $bs * $heard{$k}; }
  return $best eq '' ? '.' : $best;
}
sub hear_word {                                  # the word as greetings: each letter's dots and dashes, then an end
  my ($w, $learn, $tally) = @_;
  my @sent = map { (split(//, $morse{$_}), '|') } split //, $w;
  my $got = '';
  for my $k (@sent) {
    my $f = greet($k); my $g = guess($f); $got .= $g;
    $tally->[0]++; $tally->[1]++ if $g eq $k;
    if ($learn) { $read{$k}{$_}++ for @$f; $heard{$k} += @$f; }
  }
  return join '', map { $letter_of{$_} // '?' } grep { length } split /\|/, $got;
}
my @t_learn = (0, 0);
for my $r (1 .. $o{rondas}) { hear_word($_, 1, \@t_learn) for @aprende; }
my @t_seen = (0, 0); my @t_new = (0, 0);
my ($ok_seen, $ok_new, @wrong) = (0, 0);
for my $w (@aprende) { $ok_seen++ if hear_word($w, 0, \@t_seen) eq $w; }
for my $w (@nuevas)  { my $got = hear_word($w, 0, \@t_new); if ($got eq $w) { $ok_new++ } else { push @wrong, "$w>$got" } }
printf "morse de saludos: n=%d nace=%d desliz=%d%%%s; 3 tipos de saludo (punto, raya, fin de letra)\n", $o{n},
  $o{nace}, $o{desliz}, $o{quieto} ? ' quieto' : '';
printf "saludos reconocidos: aprendiendo %d%%; despues, en palabras oidas %d%%, en palabras nuevas %d%%\n",
  100 * $t_learn[1] / $t_learn[0], 100 * $t_seen[1] / $t_seen[0], 100 * $t_new[1] / $t_new[0];
printf "palabras oidas leidas enteras: %d de %d; palabras nuevas: %d de %d%s\n", $ok_seen, scalar @aprende, $ok_new,
  scalar @nuevas, @wrong ? " (fallaron: @wrong)" : '';
