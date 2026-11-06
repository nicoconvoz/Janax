#!/usr/bin/perl
# The fingerprint the Janax will and school must give talking in word songs (voluntad_canto.jsm and
# cardumen_canto.jsm), bit for bit. The history of oraciones.pl while it learns, with nothing random: the school born
# from seed 7, harmony, the top face answering, waves that cross; the will says the 30 words in turn, 3 passes; each
# word is a song (its Morse of greetings, one per step, with the three corner keys); the will hears the top face with
# its rhythm (piece and step), guesses the word whose notes it heard most as a share of all it heard for it, and,
# knowing what it said, learns. Each song goes into the fingerprint as said * 1024 + (guess + 1) * 2 + right; then
# the school's own fingerprint (every weight and rate, as it says it at the end) as one value. h = (h * 31 + v) mod 2^48. Perl is the measuring stick only (Capitan,
# 2026-11-06).
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %morse = (a => '.-', b => '-...', c => '-.-.', d => '-..', e => '.', f => '..-.', g => '--.', h => '....',
  i => '..', j => '.---', k => '-.-', l => '.-..', m => '--', n => '-.', o => '---', p => '.--.', q => '--.-',
  r => '.-.', s => '...', t => '-', u => '..-', v => '...-', w => '.--', x => '-..-', y => '-.--', z => '--..');
my %keys = ('.' => [0, 1, 4], '-' => [3, 2, 7], '|' => [12, 13, 8]);
my @vocab = qw(sol luna mar pez barco cielo agua fuego tierra viento casa perro gato arbol flor rio monte nube
               lluvia piedra camino puerta mesa silla libro mano ojo voz canto risa);
my $c = Cardumen->new(seed => 7, harmony => 1);
$c->{sinks} = { map { $_ => 1 } 48 .. 63 }; $c->{cross} = 1;
my $h = 0; my $M = 2 ** 48;
sub mix { $h = ($h * 31 + $_[0]) % $M; }
my (@read, @heard); my ($ok, $all) = (0, 0);
for my $pass (1 .. 3) {
  for my $w (0 .. $#vocab) {
    my @sched = map { $keys{$_} } map { (split(//, $morse{$_}), '|') } split //, $vocab[$w];
    my $mel = $c->signal_waves(\@sched);
    my @f; for my $t (0 .. $#$mel) { push @f, map { "$_:$t" } grep { $_ >= 48 } @{ $mel->[$t] }; }
    my ($best, $bs, $bt) = (-1, 0, 1);
    for my $g (0 .. $#vocab) { next unless $heard[$g]; my $s = 0; $s += $read[$g]{$_} // 0 for @f;
      ($best, $bs, $bt) = ($g, $s, $heard[$g]) if $s * $bt > $bs * $heard[$g]; }
    $read[$w]{$_}++ for @f; $heard[$w] += @f;
    my $hit = $best == $w ? 1 : 0; $ok += $hit if $pass == 3; $all++ if $pass == 3;
    mix($w * 1024 + ($best + 1) * 2 + $hit);
  }
}
my $hc = 0;                                     # the school's own fingerprint (what it says at the end), mixed in
for my $i (0 .. 63) { $hc = ($hc * 31 + $c->{w}[$i][$_]) % $M for 0 .. 5; $hc = ($hc * 31 + $c->{rate}[$i]) % $M; }
mix($hc);
if (($ARGV[0] // '') eq 'detalle') { printf "tercera pasada: %d de %d palabras reconocidas\n", $ok, $all; }
printf "%016X\n", $h;
