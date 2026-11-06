#!/usr/bin/perl
# A whole word is one song (Capitan, 2026-11-06: "the system is blind: reading one letter at a time it does not see
# far nor understand; a whole word has to be a song, one greeting has to be a word, so what we write are sentences").
# A word's Morse of greetings (dot, dash, end of letter: three keys, as in morse_saludos.pl) goes into ONE signal, one
# greeting per step, with the waves crossing (modelo.pl signal_waves, cross): the letters of a word meet inside the
# cube and the school gives back one melody for the whole word. The will learns words by their song (it knows which
# word was sent: learning with the answer, said plainly) and reads sentences, one song after another.
#
# It learns 30 words (rondas passes), then reads sentences of 3 to 5 of them (drawn by dice), and hears words it never
# heard, to see what it takes them for. Options: n (4), nace (7), rondas (20), oraciones (40), desliz (P: percent
# chance that one piece of a key slips to a neighbor), quieto, conserva, simetrico, asienta.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (n => 4, nace => 7, rondas => 20, oraciones => 40, desliz => 0, @ARGV ? map { split /=/ } @ARGV : ());
my %morse = (a => '.-', b => '-...', c => '-.-.', d => '-..', e => '.', f => '..-.', g => '--.', h => '....',
  i => '..', j => '.---', k => '-.-', l => '.-..', m => '--', n => '-.', o => '---', p => '.--.', q => '--.-',
  r => '.-.', s => '...', t => '-', u => '..-', v => '...-', w => '.--', x => '-..-', y => '-.--', z => '--..');
my $c = Cardumen->new(n => $o{n}, w0 => 40, th => 100, rate => 20, seed => $o{nace});
my $n = $c->{n}; my $m = $n - 1;
my %keys = ('.' => [ map { $c->idx(@$_, 0) } [0, 0], [1, 0], [0, 1] ],
            '-' => [ map { $c->idx(@$_, 0) } [$m, 0], [$m - 1, 0], [$m, 1] ],
            '|' => [ map { $c->idx(@$_, 0) } [0, $m], [1, $m], [0, $m - 1] ]);
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
$c->{harmony} = 1; $c->{sinks} = { %top }; $c->{cross} = 1;
$c->{whisper} = 1 if $o{quieto};
$c->{conserve} = 1 if $o{conserva};
$c->{weaken_rate} = 1 if $o{simetrico};
my @vocab = qw(sol luna mar pez barco cielo agua fuego tierra viento casa perro gato arbol flor rio monte nube
               lluvia piedra camino puerta mesa silla libro mano ojo voz canto risa);
my @nuevas = qw(hermano capitan janax razar melodia cardumen ola faro brujula timon vela ancla isla puerto bote
                estrella noche dia jugo kiwi);
my $seed2 = $o{nace} * 7919 + 1;
sub rnd2 { $seed2 = ($seed2 * 1103515245 + 12345) % 2147483648; return $seed2 >> 16; }
sub schedule {                                   # the word as one song: one greeting per step
  my ($w, $clean) = @_; my @s;
  for my $g (map { (split(//, $morse{$_}), '|') } split //, $w) {
    my @key = @{ $keys{$g} };
    if (!$clean && $o{desliz} && rnd2() % 100 < $o{desliz}) {
      my $j = rnd2() % 3; my @nb = grep { $_ >= 0 } map { $c->neighbor($key[$j], $_) } 0 .. 3; $key[$j] = $nb[rnd2() % @nb];
    }
    push @s, [@key];
  }
  return \@s;
}
sub song { my ($w, $clean) = @_; my $mel = $c->signal_waves(schedule($w, $clean));
  my @f; for my $t (0 .. $#$mel) { push @f, map { "$_:$t" } grep { $top{$_} } @{ $mel->[$t] }; } return \@f; }
my (%read, %heard);
sub guess {
  my ($f) = @_; my ($best, $bs, $bt) = ('?', 0, 1);
  for my $w (@vocab) { next unless $heard{$w}; my $s = 0; $s += $read{$w}{$_} // 0 for @$f;
    ($best, $bs, $bt) = ($w, $s, $heard{$w}) if $s * $bt > $bs * $heard{$w}; }
  return $best;
}
my ($ok, $all) = (0, 0);
for my $r (1 .. $o{rondas}) {
  for my $w (@vocab) {
    my $f = song($w); my $g = guess($f); $all++; $ok++ if $g eq $w;
    $read{$w}{$_}++ for @$f; $heard{$w} += @$f;
    song($w, 1) if $o{asienta} && $g eq $w;     # right: the will sings it once more, clean, and the school settles it
  }
}
my ($sw, $sa, $wok, $wall) = (0, 0, 0, 0);
for my $i (1 .. $o{oraciones}) {
  my @sent = map { $vocab[rnd2() % @vocab] } 1 .. 3 + rnd2() % 3;
  my $right = 1;
  for my $w (@sent) { my $g = guess(song($w)); $wall++; if ($g eq $w) { $wok++ } else { $right = 0 } }
  $sa++; $sw++ if $right;
}
my @taken = map { "$_>" . guess(song($_, 1)) } @nuevas;
printf "oraciones: n=%d nace=%d desliz=%d%%%s%s%s%s; cada palabra es una cancion (una ola)\n", $o{n}, $o{nace}, $o{desliz},
  $o{quieto} ? ' quieto' : '', $o{conserva} ? ' conserva' : '', $o{simetrico} ? ' simetrico' : '', $o{asienta} ? ' asienta' : '';
printf "palabras reconocidas aprendiendo: %d%%; en oraciones: %d%% de las palabras, %d de %d oraciones enteras\n",
  100 * $ok / $all, 100 * $wok / $wall, $sw, $sa;
print "palabras nuevas, tomadas por: @taken\n";
