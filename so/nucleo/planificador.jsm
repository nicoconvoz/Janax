; The scheduler of Janax OS, as the program the kernel runs at every decision: j1 = D, j2 = s, j3 = c in
; sixteenths of an instruction -> j0 = the turn, then jhalt. The kernel takes it from the system's folder,
; PDP/so/nucleo/planificador.bin, so anyone can change how their Janax shares the processor; without that
; file it uses the factory one (this same program, built into the kernel). Whatever it answers, the kernel
; never gives a turn shorter than D + 1, and a planner that fails sends it back to the factory one.
include '../../escalon0/janax.inc'
jcall turno
jhalt
include 'planificador.inc'
