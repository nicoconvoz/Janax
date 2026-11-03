#!/usr/bin/perl
# The fingerprint the Janax school must give, bit for bit (cardumen.jsm). A fixed history: the school born from seed
# 7, with harmony, the top face answering; 40 signals, in turn the 4 things the will says (3 bottom pieces each).
# Every journey goes into the fingerprint (each piece as step * 64 + piece + 1, in order; 4096 between signals),
# then every final weight and rate. h = (h * 31 + v) mod 2^48: exact in Perl and in Janax.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my $c = Cardumen->new(seed => 7, harmony => 1);
$c->{sinks} = { map { $_ => 1 } 48 .. 63 };
my @say = ([0,1,4], [2,3,7], [8,12,13], [10,11,15]);
my $h = 0; my $M = 2 ** 48;
sub mix { $h = ($h * 31 + $_[0]) % $M; }
for my $r (0 .. 39) {
  my $m = $c->signal(@{ $say[$r % 4] });
  for my $t (0 .. $#$m) { mix($t * 64 + $_ + 1) for @{ $m->[$t] }; }
  mix(4096);
}
for my $i (0 .. 63) { mix($c->{w}[$i][$_]) for 0 .. 5; mix($c->{rate}[$i]); }
printf "%016X\n", $h;
