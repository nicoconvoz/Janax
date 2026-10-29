; Its data file (datos_iniciales.datos, written by the test) is at the start of room 0 from the first order:
; j0 = the first qword of it.
include '../../escalon0/janax.inc'
jfirst j1, 1000h
jld j0, j4, 0
jhalt
