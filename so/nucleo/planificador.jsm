; The scheduler of Janax OS, as the program the kernel runs when a cabin is born: j1 = its priority (in
; 65536ths), j3 = c in sixteenths of an instruction -> j0 = its turn, then jhalt (cuanto, in
; planificador.inc). The cabins row in the order they arrive, each its own turn. The kernel takes it from the system's folder,
; PDP/so/nucleo/planificador.bin, so anyone can change how their Janax shares the processor; without that
; file it uses the factory one (this same program, built into the kernel). A planner that fails sends the kernel back
; to the factory one.
include '../../escalon0/janax.inc'
jcall cuanto
jhalt
include 'planificador.inc'
