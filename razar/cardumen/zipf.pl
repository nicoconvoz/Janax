#!/usr/bin/perl
# Signals that shorten themselves (Capitan, 2026-11-06: "the greeting is now a whole word"; "that is what I want you
# to do"). Words are said in Morse of greetings (morse_saludos.pl: dot, dash and end of letter are three kinds of
# greeting), and some words are said far more than others (Zipf: the word of rank r comes with weight 1/r; which word
# has which rank is drawn by dice, not by its length). Seven free keys (the 7 bottom pieces the Morse corners leave,
# as the lines of the Fano plane) can each be the short name of a whole word: one greeting instead of many.
#
# Nobody tells the will which words are frequent. Every greeting costs, and the rule only looks at what it does:
# when it says a word in full, it gives the word a free key; if none is free, it takes the key of the word that has
# saved least so far (uses times greetings saved), when the word it is saying has saved more. If the ear then takes
# the short name for something else, the word goes back to being said in full. The question: do the words said most
# end up the shortest (the law of abbreviation, Zipf 1935)? Control (azar=1): keys go to words at random, without
# looking at what each saves.
#
# Options: n (4), nace (7), vueltas (3000 words said), azar (0), desliz (0), raras (K: the K rarest words are said
# first: if the short names still end with the frequent words, frequency decides and not who came first).
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %o = (n => 4, nace => 7, vueltas => 3000, azar => 0, desliz => 0, @ARGV ? map { split /=/ } @ARGV : ());
my %morse = (a => '.-', b => '-...', c => '-.-.', d => '-..', e => '.', f => '..-.', g => '--.', h => '....',
  i => '..', j => '.---', k => '-.-', l => '.-..', m => '--', n => '-.', o => '---', p => '.--.', q => '--.-',
  r => '.-.', s => '...', t => '-', u => '..-', v => '...-', w => '.--', x => '-..-', y => '-.--', z => '--..');
my $c = Cardumen->new(n => $o{n}, w0 => 40, th => 100, rate => 20, seed => $o{nace});
my $n = $c->{n}; my $m = $n - 1;
my %keys = ('.' => [ map { $c->idx(@$_, 0) } [0, 0], [1, 0], [0, 1] ],
            '-' => [ map { $c->idx(@$_, 0) } [$m, 0], [$m - 1, 0], [$m, 1] ],
            '|' => [ map { $c->idx(@$_, 0) } [0, $m], [1, $m], [0, $m - 1] ]);
my %used; $used{$_} = 1 for map { @$_ } values %keys;
my @spots = grep { !$used{$_} } map { $c->idx($_ % $n, int($_ / $n), 0) } 0 .. $n*$n-1;
die "the free keys need 7 places, there are " . @spots . "\n" unless @spots >= 7;
for my $k (0 .. 6) { $keys{"A$k"} = [ map { $spots[($_ + $k) % 7] } 1, 2, 4 ]; }
my @kinds = ('.', '-', '|', map { "A$_" } 0 .. 6);
my %top = map { my $i = $_; ($c->idx($i % $n, int($i / $n), $n-1) => 1) } 0 .. $n*$n-1;
$c->{harmony} = 1; $c->{sinks} = { %top };
my @words = qw(sol luna mar pez barco cielo agua fuego tierra viento casa perro gato arbol flor rio monte nube
               lluvia piedra camino puerta mesa silla libro mano ojo voz canto risa);
my $seed2 = $o{nace} * 7919 + 1;
sub rnd2 { $seed2 = ($seed2 * 1103515245 + 12345) % 2147483648; return $seed2 >> 16; }
my @rank = @words;                               # the ranks, by dice: rank 1 is said most
for (my $i = $#rank; $i > 0; $i--) { my $j = rnd2() % ($i + 1); @rank[$i, $j] = @rank[$j, $i]; }
my %rank_of = map { $rank[$_] => $_ + 1 } 0 .. $#rank;
my @cum; my $tot = 0; for my $r (1 .. @rank) { $tot += 1_000_000 / $r; push @cum, $tot; }
sub pick { my $x = (rnd2() * 65536 + rnd2()) % int($tot); for my $i (0 .. $#cum) { return $rank[$i] if $x < $cum[$i]; } return $rank[-1]; }
sub full { my ($w) = @_; return map { (split(//, $morse{$_}), '|') } split //, $w; }
my %name;                                        # word -> its short key
my %owner;                                       # key -> word
my %uses; my %saved; my %tries;
sub greet {
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
  return $best;
}
my ($sent_greetings, $wrong_words) = (0, 0);
for my $v (1 .. $o{vueltas}) {
  my $w = ($o{raras} && $v <= $o{raras}) ? $rank[-$v] : pick(); $uses{$w}++;   # raras=K (the inversion): the K rarest
                                                 # words are said first, so they take the free keys before any other
  my @say = $name{$w} ? ($name{$w}) : full($w);
  my $miss = 0;
  for my $k (@say) { my $f = greet($k); $miss++ if guess($f) ne $k; $read{$k}{$_}++ for @$f; $heard{$k} += @$f; }
  $sent_greetings += @say; $wrong_words++ if $miss;
  if ($name{$w}) {                               # the first time a short name is used the ear has never heard it, so a miss
    $tries{$w}++;                                # then says nothing; a miss once it has heard it means the name does not
    if ($miss && $tries{$w} > 1) { delete $owner{ $name{$w} }; delete $name{$w}; delete $tries{$w}; }   # serve: back
    else { $saved{$w} += scalar(full($w)) - 1; }                                                          # to full
    next;
  }
  my @free = grep { !$owner{$_} } map { "A$_" } 0 .. 6;
  my $k;
  if (@free) { $k = $free[0]; }
  elsif ($o{azar}) { $k = "A" . (rnd2() % 7); }  # the control: any key, without looking at what it saves
  else {                                         # the key of the word that has saved least, if this one would save more
    my ($low) = sort { ($saved{$owner{$a}} // 0) <=> ($saved{$owner{$b}} // 0) || $a cmp $b } map { "A$_" } 0 .. 6;
    $k = $low if (($saved{$owner{$low}} // 0) < $uses{$w} * (scalar(full($w)) - 1));
  }
  next unless $k;
  if (my $old = $owner{$k}) { delete $name{$old}; delete $tries{$old}; }
  $owner{$k} = $w; $name{$w} = $k;
}
my @named = sort { $rank_of{$a} <=> $rank_of{$b} } keys %name;
my @len = map { [$rank_of{$_}, $name{$_} ? 1 : scalar(full($_))] } @words;
sub spearman {                                   # rank correlation between word rank (1 = said most) and its length
  my @p = @_; my $nn = @p;
  my @rx = ranks(map { $_->[0] } @p); my @ry = ranks(map { $_->[1] } @p);
  my ($mx, $my) = (0, 0); $mx += $_ / $nn for @rx; $my += $_ / $nn for @ry;
  my ($sxy, $sxx, $syy) = (0, 0, 0);
  for my $i (0 .. $nn - 1) { my ($a, $b) = ($rx[$i] - $mx, $ry[$i] - $my); $sxy += $a * $b; $sxx += $a * $a; $syy += $b * $b; }
  return $sxx && $syy ? $sxy / sqrt($sxx * $syy) : 0;
}
sub ranks { my @v = @_; my @i = sort { $v[$a] <=> $v[$b] } 0 .. $#v; my @r;
  for (my $j = 0; $j < @i;) { my $k = $j; $k++ while $k + 1 < @i && $v[$i[$k + 1]] == $v[$i[$j]];
    my $avg = ($j + $k) / 2 + 1; $r[$i[$_]] = $avg for $j .. $k; $j = $k + 1; } return @r; }
my $full_avg = 0; $full_avg += scalar(full($_)) / @words for @words;
printf "zipf: nace=%d vueltas=%d%s desliz=%d%%: %.1f saludos por palabra dicha (todo en Morse seria %.1f); palabras mal oidas %d%%\n",
  $o{nace}, $o{vueltas}, $o{azar} ? ' azar' : '', $o{desliz}, $sent_greetings / $o{vueltas},
  do { my $e = 0; $e += (1 / $rank_of{$_}) * scalar(full($_)) for @words; my $z = 0; $z += 1 / $_ for 1 .. @words; $e / $z },
  100 * $wrong_words / $o{vueltas};
printf "con nombre corto (rango de frecuencia): %s\n", join(" ", map { "$_($rank_of{$_})" } @named) || 'ninguna';
printf "correlacion entre el rango (1 = la mas dicha) y el largo, Spearman: %.2f (positiva: las mas dichas son las mas cortas)\n",
  spearman(@len);
