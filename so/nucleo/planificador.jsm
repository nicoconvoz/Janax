; The scheduler of Janax OS, as the program the kernel runs when it needs turns: it writes the sheet of the
; next turns in its room (see hoja in planificador.inc for the room) and halts with j0 = how many. The kernel takes it from the system's folder,
; PDP/so/nucleo/planificador.bin, so anyone can change how their Janax shares the processor; without that
; file it uses the factory one (this same program, built into the kernel). Whatever it answers, the kernel
; follows the sheet while the world is the one it imagined, and a planner that fails sends it back to the
; factory one.
include '../../escalon0/janax.inc'
jcall hoja
jhalt
include 'planificador.inc'
