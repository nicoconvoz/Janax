; Benchmark: j0 = 1 + 2 + ... + 1,000,000,000 (3,000 million Janax instructions in the loop).
include '../janax.inc'
jldi j0, 0
jldi j1, 3B9Ah
jshi j1, 0CA00h
jldi j2, 1
vuelta:
jadd j0, j0, j1
jsub j1, j1, j2
jjnz j1, vuelta
jhalt
