#!/usr/bin/perl
# A riddle of words, solved by having learned something like it before (Capitan, 2026-11-06: "smarter is that it can
# solve a riddle of words having learned something similar before"; his example: "the numbers are uno dos tres cuatro
# cinco seis; uno mas uno es dos, dos mas dos es cuatro; what is dos mas tres?").
#
# Words are songs, as in oraciones.pl (Morse of greetings, crossing waves, the will's ear by counting notes). Three
# stages, each built on the one before:
#   1. the ear: the will learns its words by their song. Its own size (Capitan: "if 7^3 is not enough, let it model
#      its own size"): it starts at n and, while it still mistakes words it was taught, it is born again one piece
#      wider and learns again; when a wider school no longer mistakes fewer, it keeps the best and stops.
#   2. counting: it hears "uno dos tres cuatro cinco seis" and remembers, by the words it recognized, which word opens
#      the song and which follows which (its own memory of a melody, nothing given).
#   3. riddles: "a mas b es c". It knows one thing it can do with a song it knows: walk it and count the steps. A rule
#      is two walks of the same length, between the riddle's places (the start of the song, a, b, c): every such
#      equality is a candidate, none is preferred. Each example it is shown counts for the candidates it fits; to
#      answer a question, the candidates that fit the most examples and say where c is vote, and the answer is the
#      word that many steps into the song. Addition is not written anywhere: "c is as far from a as b from the start"
#      is one candidate among the others (so is "c is as far from a as a from the start": the double).
# It is tested on the riddles it was never shown. Options: n (3), crece (1), tope (12: the widest it may try, only so
# a run ends; it says so when reached), nace (7), rondas (20), cuentas (3), desliz, quieto, conserva, tipo (suma,
# resta, mezcla), ejemplos (K drawn by dice, or a list like 1+1,2+2), revuelto (the answers of the examples drawn at
# random: the control), huella.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (n => 3, crece => 1, tope => 12, nace => 7, rondas => 20, cuentas => 3, desliz => 0, tipo => 'suma',
         ejemplos => 2, @ARGV ? map { split /=/ } @ARGV : ());
my %morse = (a => '.-', b => '-...', c => '-.-.', d => '-..', e => '.', f => '..-.', g => '--.', h => '....',
  i => '..', j => '.---', k => '-.-', l => '.-..', m => '--', n => '-.', o => '---', p => '.--.', q => '--.-',
  r => '.-.', s => '...', t => '-', u => '..-', v => '...-', w => '.--', x => '-..-', y => '-.--', z => '--..');
my @num = qw(uno dos tres cuatro cinco seis);
my @vocab = (@num, qw(mas menos es));
my %ix = map { $vocab[$_] => $_ } 0 .. $#vocab;
my ($c, %keys, %top, %read, %heard, $seed2);
sub rnd2 { $seed2 = ($seed2 * 1103515245 + 12345) % 2147483648; return $seed2 >> 16; }
my $hf = 0; sub hmix { $hf = ($hf * 31 + $_[0]) % 2 ** 48; }
sub born {
  my ($n) = @_; my $m = $n - 1;
  $c = Cardumen->new(n => $n, w0 => 40, th => 100, rate => 20, seed => $o{nace});
  %keys = ('.' => [ map { $c->idx(@$_, 0) } [0, 0], [1, 0], [0, 1] ],
           '-' => [ map { $c->idx(@$_, 0) } [$m, 0], [$m - 1, 0], [$m, 1] ],
           '|' => [ map { $c->idx(@$_, 0) } [0, $m], [1, $m], [0, $m - 1] ]);
  %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
  $c->{harmony} = 1; $c->{sinks} = { %top }; $c->{cross} = 1;
  $c->{whisper} = 1 if $o{quieto};
  $c->{conserve} = 1 if $o{conserva};
  %read = (); %heard = (); $seed2 = $o{nace} * 7919 + 1;
}
sub schedule {
  my ($w) = @_; my @s;
  for my $g (map { (split(//, $morse{$_}), '|') } split //, $w) {
    my @key = @{ $keys{$g} };
    if ($o{desliz} && rnd2() % 100 < $o{desliz}) {
      my $j = rnd2() % 3; my @nb = grep { $_ >= 0 } map { $c->neighbor($key[$j], $_) } 0 .. 3; $key[$j] = $nb[rnd2() % @nb];
    }
    push @s, [@key];
  }
  return \@s;
}
sub song { my ($w) = @_; my $mel = $c->signal_waves(schedule($w));
  my @f; for my $t (0 .. $#$mel) { push @f, map { "$_:$t" } grep { $top{$_} } @{ $mel->[$t] }; } return \@f; }
sub guess {
  my ($f) = @_; my ($best, $bs, $bt) = ('?', 0, 1);
  for my $w (@vocab) { next unless $heard{$w}; my $s = 0; $s += $read{$w}{$_} // 0 for @$f;
    ($best, $bs, $bt) = ($w, $s, $heard{$w}) if $s * $bt > $bs * $heard{$w}; }
  return $best;
}
sub hear { my ($w) = @_; my $g = guess(song($w)); hmix($ix{$w} * 16 + ($g eq '?' ? 0 : $ix{$g} + 1)); return $g; }
# 1. the ear, and its own size
sub learn_words {
  my $miss = 0;
  for my $r (1 .. $o{rondas}) { $miss = 0;
    for my $w (@vocab) { my $f = song($w); $miss++ if guess($f) ne $w; $read{$w}{$_}++ for @$f; $heard{$w} += @$f; } }
  return $miss;                                  # words it still mistook in the last pass
}
my $n = $o{n}; born($n); my $miss = learn_words(); my @tried = ("$n:$miss"); my $topped = 0;
while ($o{crece} && $miss > 0) {
  if ($n + 1 > $o{tope}) { $topped = 1; last; }
  born($n + 1); my $m2 = learn_words(); push @tried, ($n + 1) . ":$m2";
  if ($m2 >= $miss) { born($n); learn_words(); last; }   # wider did not help: back to the best, learned the same way
  ($n, $miss) = ($n + 1, $m2);
}
hmix($n); hmix($miss);
# 2. counting
my (%first, %next);
for my $k (1 .. $o{cuentas}) {
  my $prev;
  for my $w (@num) { my $g = hear($w); if (defined $prev) { $next{$prev}{$g}++ } else { $first{$g}++ } $prev = $g; }
}
sub most { my ($h) = @_; my ($b, $bn) = ('?', 0); for my $w (@vocab, '?') { my $v = $h->{$w} // 0; ($b, $bn) = ($w, $v) if $v > $bn; } return $b; }
my $count_ok = 0;
for my $i (0 .. $#num - 1) { my $g = most($next{$num[$i]} // {}); $count_ok++ if $g eq $num[$i + 1]; hmix($g eq '?' ? 0 : $ix{$g} + 1); }
sub walk_to {                                    # how many steps from the start of the song to word w (1: the first)
  my ($w) = @_; my $x = most(\%first); my $k = 1;
  while ($x ne '?' && $k <= @vocab) { return $k if $x eq $w; $x = most($next{$x} // {}); $k++; }
  return undef;
}
sub word_at {                                    # the word k steps into the song
  my ($k) = @_; return '?' if $k < 1; my $x = most(\%first);
  for (2 .. $k) { last if $x eq '?'; $x = most($next{$x} // {}); }
  return $x;
}
# 3. riddles. Places: 0 the start of the song, 1 a, 2 b, 3 c. A candidate (p,q,r,s): the walk p->q is as long as r->s.
my @cand; my %seen;
for my $p (0 .. 3) { for my $q (0 .. 3) { next if $p == $q; for my $r (0 .. 3) { for my $s (0 .. 3) { next if $r == $s;
  my @co = (0) x 4; $co[$q]++; $co[$p]--; $co[$s]--; $co[$r]++;
  next unless grep { $_ } @co[1 .. 3];           # the same walk on both sides (or its mirror): says nothing
  my $neg = join ',', map { -$_ } @co; my $key = join ',', @co;
  next if $seen{$key} || $seen{$neg}; $seen{$key} = 1; push @cand, \@co; } } } }
my %fit;                                         # operator word -> candidate -> examples it fits
sub places { my ($pa, $pb, $pc) = map { walk_to($_) } @_; return (defined $pa && defined $pb && defined $pc) ? (0, $pa, $pb, $pc) : (); }
my %ops = (suma => ['mas'], resta => ['menos'], mezcla => ['mas', 'menos']);
my (@train, @test);
for my $op (@{ $ops{$o{tipo}} }) {
  my @all; for my $x (1 .. 6) { for my $y (1 .. 6) {
    my $cc = $op eq "mas" ? $x + $y : $x - $y; push @all, [$x, $op, $y, $cc] if $cc >= 1 && $cc <= 6; } }
  my @tr;
  if ($o{ejemplos} =~ /[+-]/) { my %want = map { $_ => 1 } split /,/, $o{ejemplos};
    @tr = grep { $want{"$_->[0]" . ($op eq 'mas' ? '+' : '-') . "$_->[2]"} } @all; }
  else { for my $i (reverse 1 .. $#all) { my $j = rnd2() % ($i + 1); @all[$i, $j] = @all[$j, $i]; } @tr = @all[0 .. $o{ejemplos} - 1]; }
  my %in = map { join(',', @$_) => 1 } @tr;
  push @train, @tr; push @test, grep { !$in{join ',', @$_} } @all;
}
for my $e (@train) {                             # shown: the will hears the five words, and counts what fits
  my ($x, $op, $y, $cc) = @$e; $cc = 1 + rnd2() % 6 if $o{revuelto};
  my @g = map { hear($_) } $num[$x - 1], $op, $num[$y - 1], 'es', $num[$cc - 1];
  my @pl = places(@g[0, 2, 4]); next unless @pl;
  for my $i (0 .. $#cand) { my $v = 0; $v += $cand[$i][$_] * $pl[$_] for 0 .. 3; $fit{$g[1]}[$i]++ if $v == 0; }
}
my ($right, $asked, $none) = (0, 0, 0); my @shown;
for my $e (@test) {                              # asked: "a op b es ?"
  my ($x, $op, $y, $cc) = @$e;
  my @g = map { hear($_) } $num[$x - 1], $op, $num[$y - 1], 'es';
  my ($pa, $pb) = (walk_to($g[0]), walk_to($g[2])); my %vote; my $best = 0;
  if (defined $pa && defined $pb) {
    for my $i (0 .. $#cand) { my $f = $fit{$g[1]}[$i] // 0; next unless $f && $cand[$i][3]; $best = $f if $f > $best; }
    for my $i (0 .. $#cand) { next unless ($fit{$g[1]}[$i] // 0) == $best && $best && $cand[$i][3];
      my $rest = $cand[$i][1] * $pa + $cand[$i][2] * $pb; next if $rest % $cand[$i][3];
      $vote{-$rest / $cand[$i][3]}++; }
  }
  my ($k, $kv) = (0, 0); for my $v (sort { $a <=> $b } keys %vote) { ($k, $kv) = ($v, $vote{$v}) if $vote{$v} > $kv; }
  $kv = 0 if grep { $_ != $k && $vote{$_} == $kv } keys %vote;   # a tie between answers: the examples cannot tell, it says so
  my $ans = $kv ? word_at($k) : '?';
  $asked++; $right++ if $ans eq $num[$cc - 1]; $none++ if $ans eq '?';
  hmix($ans eq '?' ? 0 : $ix{$ans} + 1);
  push @shown, "$num[$x - 1] $op $num[$y - 1] = $ans";
}
hmix($_) for $count_ok, $right, $asked;
if ($o{huella}) { printf "%016X\n", $hf; exit; }
printf "acertijos: nace=%d desliz=%d%% tipo=%s ejemplos=%s%s%s; cubo %d^3 (probo %s%s)\n", $o{nace}, $o{desliz}, $o{tipo},
  $o{ejemplos}, $o{revuelto} ? ' revuelto' : '', $o{quieto} ? ' quieto' : '', $n, join(' ', @tried), $topped ? ', llego al tope' : '';
printf "oido: %d palabras confundidas al final; contar: %d de 5; acertijos nunca vistos: %d de %d bien (%d sin respuesta)\n",
  $miss, $count_ok, $right, $asked, $none;
print "  $_\n" for $o{todo} ? @shown : @shown[0 .. ($#shown < 4 ? $#shown : 4)];
