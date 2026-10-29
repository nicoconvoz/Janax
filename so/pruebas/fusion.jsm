; Every instruction that can be followed by a condition, followed by one: jjz/jjnz, taken and not taken.
; Each block shifts j0 left and adds 1 when the condition is not taken, so j0 records every decision.
include '../../escalon0/janax.inc'
jfirst j1, 1000h               ; first order: room 0 (it uses addresses below 1000h)
jldi j0, 0
jldi j1, 5
jldi j2, 3
jldi j8, 64             ; a data address
jldi j9, 1
jldi j10, 0

macro block op_line, cond, reg {
  local skip
  jadd j0, j0, j0
  op_line
  cond reg, skip
  jadd j0, j0, j9
skip:
}
block <jldi j3, 0>,          jjz,  j3   ; taken
block <jadd j3, j1, j2>,     jjz,  j3   ; 8: not taken
block <jsub j3, j1, j1>,     jjnz, j3   ; 0: not taken
block <jmul j3, j1, j2>,     jjnz, j3   ; 15: taken
block <jdiv j3, j1, j10>,    jjz,  j3   ; 5 / 0 = 0: taken
block <jand j3, j1, j2>,     jjz,  j3   ; 1: not taken
block <jor j3, j10, j10>,    jjnz, j3   ; 0: not taken
block <jxor j3, j1, j1>,     jjz,  j3   ; 0: taken
block <jshl j3, j1, j2>,     jjnz, j3   ; 40: taken
block <jshr j3, j2, j2>,     jjz,  j3   ; 0: taken
block <jsar j3, j1, j9>,     jjz,  j3   ; 2: not taken
block <jshi j3, 0>,          jjnz, j3   ; 2 << 16: taken
block <jst j1, j8, 0>,       jjnz, j1   ; stores 5: taken
block <jld j3, j8, 0>,       jjz,  j3   ; 5: not taken
block <jstb j10, j8, 1>,     jjz,  j10  ; stores 0: taken
block <jldb j3, j8, 1>,      jjnz, j3   ; 0: not taken
jhalt
