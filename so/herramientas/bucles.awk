#!/usr/bin/env -S awk -f
# Lists every loop of a FASM source: a jump to a label defined above it is a loop.
# Only jumps that stay in their routine count (a local label, an anonymous one, or the routine's own name).
# A loop is a rotated while when it is entered by a jmp to its check, the backward jump is
# conditional, and nothing between the body label and that jump jumps back to the body label.
# Prints one line per loop: <line> <shape> <target> ; exits 1 if a loop is not a rotated while.
# Usage: awk -f bucles.awk file.asm (awk instead of Perl: Capitan, 2026-11-06, "no Perl, it burns the PC").
function bare(s) { sub(/\r$/, "", s); sub(/;.*/, "", s); return s }
{ raw[NR - 1] = $0; sub(/\r$/, "", raw[NR - 1]) }
END {
  nl = NR; nanon = 0; global = ""
  for (i = 0; i < nl; i++) {
    l = bare(raw[i])
    if (match(l, /^([A-Za-z_][A-Za-z0-9_]*):/, m)) { global = m[1]; where[m[1]] = i }
    else if (match(l, /^[ \t]*(\.[A-Za-z0-9_]+):/, m)) { where[global m[1]] = i }
    if (l ~ /^[ \t]*@@:/) anon[++nanon] = i
  }
  bad = 0; count = 0; global = ""
  for (i = 0; i < nl; i++) {
    l = bare(raw[i])
    if (match(l, /^([A-Za-z_][A-Za-z0-9_]*):/, m)) global = m[1]
    if (!match(l, /^[ \t]*([A-Za-z0-9_.@]+:[ \t]*)?(j[a-z]+|loop[a-z]*)[ \t]+(short[ \t]+|near[ \t]+)?([A-Za-z0-9_.@]+)[ \t]*$/, m)) continue
    op = m[2]; t = m[4]; name = ""
    if (t == "@b" || t == "@r") {                    # the last anonymous label at or above this line
      p = -1; for (k = 1; k <= nanon; k++) if (anon[k] <= i) p = anon[k]
      if (p >= 0) { name = "@@" p; where[name] = p }
    } else if (substr(t, 1, 1) == ".") name = global t
    else name = t
    if (name == "" || !(name in where) || where[name] >= i) continue   # backward only
    # a loop stays inside its routine: a backward jump to another routine (an interpreter handler going
    # back to its dispatcher, an error exit) is a step between routines, not a loop
    if (t !~ /^[.@]/ && name != global) continue
    count++
    top = where[name]
    # rotated: the line before the body label is "jmp <check>" with <check> between top and here
    prev = top - 1; while (prev >= 0 && raw[prev] ~ /^[ \t]*(;.*)?$/) prev--
    entry = ""
    if (prev >= 0 && match(bare(raw[prev]), /^[ \t]*jmp[ \t]+([A-Za-z0-9_.@]+)[ \t]*$/, m)) entry = m[1]
    rotated = 0
    if (entry != "") {                               # an unconditional jump back here is a while (true)
      en = substr(entry, 1, 1) == "." ? global entry : entry
      rotated = (en in where) && where[en] > top && where[en] <= i
    }
    shape = rotated ? "while" : (op == "jmp" ? "arriba" : "abajo")
    if (!rotated) bad++
    printf "%5d %-6s %s %s\n", i + 1, shape, op, t
  }
  printf "%d bucles, %d sin forma de while rotado\n", count, bad
  exit(bad ? 1 : 0)
}
