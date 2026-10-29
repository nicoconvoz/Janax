; Writes 9 to address 100h, wastes time so the scheduler switches, then reads it back.
; If two processes shared memory, the other one's value would show up.
include '../../escalon0/janax.inc'
jldi j1, 100h
jldi j2, 9
jst j2, j1, 0
jldi j3, 5
jldi j4, 1
espera:
jsub j3, j3, j4
jjnz j3, espera
jld j0, j1, 0
jhalt
