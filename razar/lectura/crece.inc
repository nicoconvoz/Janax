; Tables that grow to what they hold (Capitan's rule: what is needed is used, and nothing more), shared by the
; readers. A table is {its place, places minus 1, entries, bytes a place} at the address that names it; a place whose
; first eight bytes are 0 is empty, so keys are never 0. It starts with two places and doubles before it would pass
; half full, so a search always finds an empty place and ends. Its variables live at 1F90h on, free in every program.
PLD   = 1F90h                   ; a growing table: which, a key, its old place, its old places
PLK   = 1F98h
PLO   = 1FA0h
PLN   = 1FA8h
PLS   = 1FB0h                   ; j9-j14 kept while it grows (six words)

; j11 plus the bytes the table at j2 takes. Uses j1-j3.
pl_bytes:
  jldi j1, 0
  jld j3, j2, 8
  jldi j1, 1
  jadd j3, j3, j1
  jld j1, j2, 24
  jmul j3, j3, j1
  jadd j11, j11, j3
  jldi j1, 0
  jret

; A table that grows to what it holds (Capitan's rule: what is needed is used, and nothing more): at j2 {its place,
; places minus 1, entries, bytes a place}. It starts with two places and doubles before it would pass half full, so
; a search always finds an empty place and ends. The table at j2 starts so, j3 bytes a place. Uses j1-j14.
pl_new:
  jldi j1, 0
  jst j3, j2, 24
  jst j1, j2, 16
  jldi j4, 1
  jst j4, j2, 8
  jst j2, j1, PLD
  jadd j11, j3, j3
  jcall room
  jldi j1, 0
  jld j2, j1, PLD
  jst j13, j2, 0
  jret

; The place of key j5 in the table at j2 -> j4 (empty if the key is not there). Uses j1, j3, j4, j6-j8.
pl_find:
  jldi j1, 0
  jldi j6, 32
  jshr j6, j5, j6
  jxor j6, j6, j5
  jld j7, j2, 8
  jand j6, j6, j7
  jldi j8, 1
  jwhile j8
    jld j3, j2, 24
    jmul j4, j6, j3
    jld j3, j2, 0
    jadd j4, j4, j3
    jld j7, j4, 0
    jsub j8, j7, j5
    jjnz j7, plf_full
    jldi j8, 0
  plf_full:
    jldi j7, 1
    jadd j6, j6, j7
    jld j7, j2, 8
    jand j6, j6, j7
  jwend
  jret

; The place of key j5 in the table at j2 -> j4, the key put there if it was not (j6 = 1: new). Uses j1-j8.
pl_take:
  jcall pl_find
  jld j7, j4, 0
  jjz j7, plt_new
  jldi j6, 0
  jret
plt_new:
  jld j7, j2, 16                ; one more would pass half its places: it doubles first
  jldi j8, 1
  jadd j7, j7, j8
  jadd j7, j7, j7
  jld j8, j2, 8
  jsub j7, j8, j7
  jldi j8, 63
  jsar j7, j7, j8
  jjz j7, plt_put
  jst j5, j1, PLK
  jcall pl_grow
  jldi j1, 0
  jld j2, j1, PLD
  jld j5, j1, PLK
  jcall pl_find
plt_put:
  jst j5, j4, 0
  jld j7, j2, 16
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j2, 16
  jldi j6, 1
  jret

; The table at j2 with twice its places: every entry moved to its place in the new one. Uses j1-j8 (j9-j14 kept).
pl_grow:
  jldi j1, 0
  jst j9, j1, PLS
  jst j10, j1, PLS + 8
  jst j11, j1, PLS + 16
  jst j12, j1, PLS + 24
  jst j13, j1, PLS + 32
  jst j14, j1, PLS + 40
  jst j2, j1, PLD
  jld j3, j2, 0
  jst j3, j1, PLO
  jld j3, j2, 8
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, PLN
  jadd j4, j3, j3
  jldi j5, 1
  jsub j5, j4, j5
  jst j5, j2, 8
  jld j5, j2, 24
  jmul j11, j4, j5
  jcall room
  jldi j1, 0
  jld j2, j1, PLD
  jst j13, j2, 0
  jld j9, j1, PLO
  jld j10, j1, PLN
  jwhile j10
    jldi j1, 0
    jld j2, j1, PLD
    jld j5, j9, 0
    jjz j5, plg_next
    jcall pl_find
    jld j3, j2, 24              ; the place copied, eight bytes at a time
    jldi j6, 0
    jwhile j3
      jadd j7, j9, j6
      jld j8, j7, 0
      jadd j7, j4, j6
      jst j8, j7, 0
      jldi j7, 8
      jadd j6, j6, j7
      jsub j3, j3, j7
    jwend
  plg_next:
    jldi j1, 0
    jld j2, j1, PLD
    jld j3, j2, 24
    jadd j9, j9, j3
    jldi j3, 1
    jsub j10, j10, j3
  jwend
  jldi j1, 0
  jld j9, j1, PLS
  jld j10, j1, PLS + 8
  jld j11, j1, PLS + 16
  jld j12, j1, PLS + 24
  jld j13, j1, PLS + 32
  jld j14, j1, PLS + 40
  jret
