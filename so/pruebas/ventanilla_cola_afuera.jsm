; A queue outside the cabin ends the process with code 5, like any access out of range.
include '../../escalon0/janax.inc'
jldi j3, -8
jsys j6, j3
jhalt
