; espera: 0000000000000096
; ((0xF0 and 0x3C) or 0x03) xor 0xA5 = 0x96
include '../janax.inc'
jldi j1, 0F0h
jldi j2, 3Ch
jand j3, j1, j2
jldi j2, 3
jor j3, j3, j2
jldi j2, 0A5h
jxor j0, j3, j2
jhalt
