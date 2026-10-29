; Its data file is 16 bytes and the room asked for only 8: the first order cannot be served, code 5.
include '../../escalon0/janax.inc'
jldi j0, 7
jfirst j1, 8
jhalt
