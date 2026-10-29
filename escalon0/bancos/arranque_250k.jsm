; Startup benchmark: 250,000 instructions, run once.
include '../janax.inc'
jldi j0, 0
jldi j2, 1
repeat 250000
  jadd j0, j0, j2
end repeat
jhalt
