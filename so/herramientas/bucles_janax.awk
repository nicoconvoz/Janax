#!/usr/bin/env -S awk -f
# Lists every loop written by hand in a Janax source (.jsm, .inc): a jjmp, jjz or jjnz to a label defined above it.
# The while is Janax's only loop (Capitan) and jwhile/jwend leave no label in the source, so any jump back to a
# label is a loop that is not a while.
# Prints one line per loop: <line> <op> <target> ; exits 1 if there is any.
# Usage: awk -f bucles_janax.awk file.jsm
function bare(s) { sub(/\r$/, "", s); sub(/;.*/, "", s); return s }
{
  l = bare($0)
  if (match(l, /^[ \t]*([A-Za-z_][A-Za-z0-9_]*):/, m)) where[m[1]] = NR
  if (!match(l, /^[ \t]*(jjmp|jjz|jjnz)[ \t]+([^ \t].*)$/, m)) next
  op = m[1]; t = m[2]; sub(/.*,[ \t]*/, "", t); gsub(/[ \t]/, "", t)
  if (!(t in where)) next
  n++
  printf "%5d %-4s %s\n", NR, op, t
}
END {
  printf "%d bucles hechos a mano\n", n
  exit(n ? 1 : 0)
}
