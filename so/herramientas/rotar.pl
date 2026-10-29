#!/usr/bin/env perl
# Rotates every top-tested loop of a FASM source into a rotated while, in place:
#   .L:  [loads] cmp/test ... / jcc .exit / body / jmp .L        (the body stays in its routine)
# becomes
#   jmp .L / .L_lap: body / .L: cmp/test ... / j!cc .L_lap / [jmp .exit]
# The check keeps the old label, so every other jump to .L still lands on the check.
# Only that exact shape is touched; it repeats until nothing changes (inner loops first).
use strict; use warnings;
my $file = shift or die "usage: rotar.pl file.asm\n";
local $/; open my $fh, '<', $file or die; my $s = <$fh>; close $fh;
my %inv = (ja=>'jbe', jbe=>'ja', jae=>'jb', jb=>'jae', je=>'jne', jne=>'je', jz=>'jnz', jnz=>'jz',
           jg=>'jle', jle=>'jg', jge=>'jl', jl=>'jge', js=>'jns', jns=>'js', jc=>'jnc', jnc=>'jc');
my $total = 0;
while (1) {
  my $n = $s =~ s{
      ^(\.(\w+)):([^\n]*)\n                                   # .L:  (maybe a comment)
      ((?:[ \t]+(?!j)[a-z]\w*\s[^\n]*\n)*?[ \t]+(?:cmp|test)\s[^\n]*\n)   # the check: no jumps, ends in cmp/test
      \s+(j[a-z]+)\s+(\.\w+)[ \t]*(?:;[^\n]*)?\n              # jcc .exit
      ((?:(?![A-Za-z_]\w*:)(?!\s+jmp\s+\.\2\s*(?:;[^\n]*)?\n)[^\n]*\n)*?)   # body: same routine, no jmp .L
      \s+jmp\s+\.\2[ \t]*(?:;[^\n]*)?\n                       # jmp .L
      (\.\w+:)?
  }{
      my ($lab, $name, $cmt, $chk, $jcc, $exit, $body, $next) = ($1, $2, $3, $4, $5, $6, $7, $8 // '');
      exists $inv{$jcc} or die "no inverse for $jcc at $lab\n";
      my $after = ($next eq "$exit:") ? '' : "        jmp     $exit\n";
      "        jmp     $lab\n${lab}_lap:\n$body$lab:$cmt\n$chk        " . sprintf('%-8s', $inv{$jcc}) . "${lab}_lap\n$after$next"
  }mgxe;
  last unless $n; $total += $n;
}
open $fh, '>', $file or die; print $fh $s; close $fh;
print "$total bucles rotados\n";
