; A planner of its own (in PDP/so/nucleo/planificador.bin): its sheet always says that the first cabin nobody
; rows gets a turn of 1 MiB of instructions. With it, two processes no longer take turns: the first one
; runs to its end. The room is the one of hoja (so/nucleo/planificador.inc).
include '../../escalon0/janax.inc'
jld j8, j14, 0                  ; how many cabins
jldi j4, 4
jshl j9, j8, j4
jldi j4, 32
jadd j9, j9, j4                 ; where the sheet goes
jldi j1, 32
jldi j13, 1
jldi j0, 0
jwhile j8
  jld j2, j1, 8
  jldi j4, 63
  jshr j3, j2, j4
  jjnz j3, sigue                ; a rower has it
  jst j2, j9, 0
  jldi j3, 10h
  jshi j3, 0
  jst j3, j9, 8
  jldi j0, 1
  jldi j8, 1                    ; the last lap
sigue:
  jldi j4, 16
  jadd j1, j1, j4
  jsub j8, j8, j13
jwend
jhalt
