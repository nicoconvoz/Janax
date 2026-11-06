#!/usr/bin/perl
# The fingerprint the Janax school must give with waves that cross (cardumen_olas.jsm), bit for bit. A fixed history:
# the school born from seed 7, with harmony, the top face answering; 40 words in turn (sol, luna, mar, casa), each one
# a song: its Morse of greetings (dot, dash, end of letter: three corner keys of the bottom face) going in one greeting
# per step, each pulse a wave of its own, the pushes of all waves adding up (modelo.pl signal_waves with cross).
# Every journey goes into the fingerprint (each piece as step * 64 + piece + 1, in order; 4096 between songs), then
# every final weight and rate. h = (h * 31 + v) mod 2^48: exact in Perl and in Janax.
#
# Perl is the measuring stick only (Capitan, 2026-11-06: "we use it as the measure; trying everything first in Perl is
# very slow, Janax flies"): this history is frozen, and the work goes on in Janax.
use strict; use warnings; use FindBin; require "$FindBin::Bin/modelo.pl";
my %morse = (s => '...', o => '---', l => '.-..', u => '..-', n => '-.', a => '.-', m => '--', r => '.-.', c => '-.-.');
my %keys = ('.' => [0, 1, 4], '-' => [3, 2, 7], '|' => [12, 13, 8]);
my $c = Cardumen->new(seed => 7, harmony => 1);
$c->{sinks} = { map { $_ => 1 } 48 .. 63 }; $c->{cross} = 1;
my @words = qw(sol luna mar casa);
my $h = 0; my $M = 2 ** 48;
sub mix { $h = ($h * 31 + $_[0]) % $M; }
for my $r (0 .. 39) {
  my @sched = map { $keys{$_} } map { (split(//, $morse{$_}), '|') } split //, $words[$r % 4];
  my $m = $c->signal_waves(\@sched);
  for my $t (0 .. $#$m) { mix($t * 64 + $_ + 1) for @{ $m->[$t] }; }
  mix(4096);
}
for my $i (0 .. 63) { mix($c->{w}[$i][$_]) for 0 .. 5; mix($c->{rate}[$i]); }
printf "%016X\n", $h;
