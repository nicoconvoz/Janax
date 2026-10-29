; Benchmark: j0 = 1 + 2 + ... + 100,000,000 (300 million Janax instructions in the loop).
include '../janax.inc'
jldi j0, 0
jldi j1, 05F5h
jshi j1, 0E100h
jldi j2, 1
jwhile j1
  jadd j0, j0, j1
  jsub j1, j1, j2
jwend
jhalt
