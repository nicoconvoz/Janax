; A program that is all straight way to its jhalt (its last part is all of it): 500 instructions. With a switch
; cost of 5 and priority 0.99 a turn is 496 (5 * 64881 / 655 = 495.3, rounded up): after it 4 are left, no more
; than a switch costs, so the cabin finishes first instead of passing the oar.
include '../../escalon0/janax.inc'
jldi j1, 1
repeat 498
  jadd j0, j0, j1
end repeat
jhalt
