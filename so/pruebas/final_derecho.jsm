; A program that is all straight way to its jhalt (its last part is all of it). With a switch cost of 5,
; a turn spent with 5 or fewer instructions left does not pass the oar: the cabin finishes first.
include '../../escalon0/janax.inc'
jldi j1, 1
repeat 20
  jadd j0, j0, j1
end repeat
jhalt
