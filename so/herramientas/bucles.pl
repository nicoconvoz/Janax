#!/usr/bin/env perl
# Lists every loop of a FASM source: a jump to a label defined above it is a loop.
# Only jumps that stay in their routine count (a local label, an anonymous one, or the routine's own name).
# A loop is a rotated while when it is entered by a jmp to its check, the backward jump is
# conditional, and nothing between the body label and that jump jumps back to the body label.
# Prints one line per loop: <line> <shape> <target> ; exits 1 if a loop is not a rotated while.
use strict; use warnings;
my $file = shift or die "usage: bucles.pl file.asm\n";
open my $fh, '<', $file or die "$file: $!\n";
my @lines = map { s/\r?\n$//r } <$fh>;
my (%where, $global, @anon);
my @label_at;        # label name (scoped) defined at each line
for my $i (0 .. $#lines) {
  my $l = $lines[$i] =~ s/;.*//r;
  if ($l =~ /^([A-Za-z_][\w]*):/)      { $global = $1; $where{$1} = $i; $label_at[$i] = $1 }
  elsif ($l =~ /^\s*(\.[\w]+):/)       { my $n = ($global // '') . $1; $where{$n} = $i; $label_at[$i] = $n }
  if ($l =~ /^\s*@@:/)                 { push @anon, $i; $label_at[$i] = "\@\@$i" }
}
my ($bad, $count) = (0, 0);
$global = undef;
for my $i (0 .. $#lines) {
  my $l = $lines[$i] =~ s/;.*//r;
  $global = $1 if $l =~ /^([A-Za-z_][\w]*):/;
  next unless $l =~ /^\s*(?:[\w.@]+:\s*)?(j[a-z]+|loop[a-z]*)\s+(?:short\s+|near\s+)?([\w.@]+)\s*$/;
  my ($op, $t) = ($1, $2);
  my $name;
  if ($t eq '@b' || $t eq '@r') { ($name) = map { "\@\@$_" } grep { $_ <= $i } @anon[-@anon .. -1];
                                  my @p = grep { $_ <= $i } @anon; $name = @p ? "\@\@$p[-1]" : undef;
                                  $where{$name} = $p[-1] if $name }
  elsif ($t =~ /^\./) { $name = ($global // '') . $t }
  else { $name = $t }
  next unless defined $name && exists $where{$name} && $where{$name} < $i;   # backward
  # a loop stays inside its routine: a backward jump to another routine (an interpreter handler going
  # back to its dispatcher, an error exit) is a step between routines, not a loop
  next if $t !~ /^[.@]/ && $name ne ($global // '');
  $count++;
  my $top = $where{$name};
  # rotated: the line before the body label is "jmp <check>" with <check> between top and here
  my $prev = $top - 1; $prev-- while $prev >= 0 && $lines[$prev] =~ /^\s*(;.*)?$/;
  my $entry = $prev >= 0 && ($lines[$prev] =~ s/;.*//r) =~ /^\s*jmp\s+([\w.@]+)\s*$/ ? $1 : undef;
  my $rotated = 0;
  if ($entry && $op ne 'jmp') {
    my $en = $entry =~ /^\./ ? ($global // '') . $entry : $entry;
    $rotated = exists $where{$en} && $where{$en} > $top && $where{$en} <= $i;
  }
  my $shape = $rotated ? 'while' : ($op eq 'jmp' ? 'arriba' : 'abajo');
  $bad++ unless $rotated;
  printf "%5d %-6s %s %s\n", $i + 1, $shape, $op, $t;
}
printf "%d bucles, %d sin forma de while rotado\n", $count, $bad;
exit($bad ? 1 : 0);
