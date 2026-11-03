#!/usr/bin/perl
# Measures what the school does (no knob is tuned here): it repeats, it changes, it remembers from a piece.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my $c = Cardumen->new;
my @F = map { $c->idx(@$_) } ([0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1]);   # the whole melody: a corner
my @C = @F[0..2];                                                                   # a piece of it
# 1. repeats: two schools, the same history, the same journeys
my ($a, $b) = (Cardumen->new, Cardumen->new);
my $same = 1;
for (1..10) { $same &&= Cardumen::text($a->signal(@F)) eq Cardumen::text($b->signal(@F)); }
print "repite (mismo historial, mismos viajes): ", ($same ? "si" : "NO"), "\n";
# 2. changes: the same signal, journey after journey
my $d = Cardumen->new; my %seen; my @len;
for my $k (1..10) { my $m = $d->signal(@F); $seen{Cardumen::text($m)}++; push @len, Cardumen::woke($m); }
printf "cambia: 10 veces la misma senal, %d viajes distintos; piezas despiertas: %s\n", scalar keys %seen, join ' ', @len;
# 3. remembers from a piece: what the piece wakes before and after learning the whole melody
my $e = Cardumen->new;
my $before = Cardumen::woke((bless { %$e, w => [map { [@$_] } @{$e->{w}}], rate => [@{$e->{rate}}], frag => [@{$e->{frag}}] }, 'Cardumen')->signal(@C));
$e->signal(@F) for 1..10;
my $m = $e->signal(@C);
my %inF = map { $_ => 1 } @F; my $recalled = 0; for my $st (@$m) { $recalled += grep { $inF{$_} } @$st; }
printf "recuerda: el pedazo (%d piezas) despierta %d antes de aprender y %d despues (%d de la melodia aprendida)\n",
  scalar @C, $before, Cardumen::woke($m), $recalled;
print "  viaje del pedazo despues: ", Cardumen::text($m), "\n";
# 4. changes by interaction: two melodies that cross; the same signal, before and after the other one sounded
my $g = Cardumen->new;
my @A = @F;
my @B = map { $g->idx(@$_) } ([1,1,0],[2,1,0],[1,2,0],[2,2,0],[1,1,1],[2,1,1]);   # shares two pieces with A
my @cueA = @A[0..2];
$g->signal(@A) for 1..10;
my $m1 = $g->signal(@cueA);
$g->signal(@B) for 1..10;
my $m2 = $g->signal(@cueA);
print "cambia por interaccion: el pedazo de A, antes de que suene B: ", Cardumen::text($m1), "\n";
print "                        el pedazo de A, despues de B:         ", Cardumen::text($m2), "\n";
my %v; for my $k (1..12) { $v{Cardumen::text($g->signal($k % 2 ? @cueA : @B[0..2]))}++; }
printf "  alternando pedazos de A y de B 12 veces: %d viajes distintos\n", scalar keys %v;
