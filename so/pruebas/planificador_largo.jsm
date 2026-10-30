; A planner of one's own (in PDP/so/nucleo/planificador.bin): every turn is 1 MiB of instructions, whatever
; the gap and the cost. With it, two processes no longer take turns: the first one runs to its end.
include '../../escalon0/janax.inc'
jldi j0, 10h
jshi j0, 0
jhalt
