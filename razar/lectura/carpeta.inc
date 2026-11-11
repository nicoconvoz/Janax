; Its own folder, for the programs that keep things there (comer.jsm, pistas.inc): its labels, all of them, and a
; file read whole. Each grows to what it holds: the folder holds a book's pieces (as many as the book needs) beside
; its other labels.
;
; The program that includes it keeps away from 1918h-1950h and 1A28h.
PZLST = 1918h                   ; the labels of its folder (request 14), how many, and the room's bytes
PZLSTN = 1920h
PZLSC = 1A28h
PZFR  = 1938h                   ; a file read whole: its room, its bytes, the room's bytes, its handle
PZFRN = 1940h
PZFRC = 1948h
PZFH  = 1950h

; Every label of its folder (14) -> PZLST, PZLSTN (-1 if it cannot list). The kernel writes the labels while they fit
; and says nothing of the rest, so while less room is left than one more label could take (its length and NORM_CAP
; bytes, the kernel's largest label) the list may be cut: the room doubles and it lists again. Uses j1-j14.
pz_list:
  jldi j1, 0
  jldi j2, 4096
  jst j2, j1, PZLSC
jwhilez j2
  jld j9, j1, PZLST             ; the bytes it wrote
  jadd j10, j13, j1
  jwhile j10
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jld j3, j1, PZLST
  jsub j9, j9, j3
  jld j3, j1, PZLSC
  jsub j3, j3, j9
  jldi j4, 4104                 ; (8 + NORM_CAP)
  jsub j3, j3, j4
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, pls_done
  jld j11, j1, PZLST            ; maybe cut: twice the room, listed again
  jldi j10, 3
  jcall0 j1, ask
  jld j2, j1, PZLSC
  jadd j2, j2, j2
  jst j2, j1, PZLSC
jwcheck
  jld j11, j1, PZLSC
  jcall0 j1, room
  jst j13, j1, PZLST
  jldi j10, 14
  jadd j11, j13, j1
  jld j12, j1, PZLSC
  jcall0 j1, ask
  jst j13, j1, PZLSTN
  jldi j2, 63
  jsar j2, j13, j2
jwend
pls_done:
  jldi j1, 0
  jret

; The file of the label at j11 (j12 bytes), read whole into a room that grows to hold it -> PZFR, PZFRN (-1 if it
; cannot be opened). Uses j1-j14.
pz_file:
  jldi j1, 0
  jldi j10, 4
  jcall0 j1, ask
  jldi j2, -1
  jst j2, j1, PZFRN
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, pf_done
  jst j13, j1, PZFH
  jst j1, j1, PZFRN
  jldi j11, 4096
  jst j11, j1, PZFRC
  jcall0 j1, room
  jst j13, j1, PZFR
jwhilez j2
  jld j2, j1, PZFRN
  jadd j2, j2, j13
  jst j2, j1, PZFRN
  jld j3, j1, PZFRC
  jsub j3, j3, j2
  jjnz j3, pf_read
  jld j11, j1, PZFRC            ; full: a room twice as big, what it holds copied, the old one given back
  jadd j11, j11, j11
  jcall0 j1, room
  jld j4, j1, PZFR
  jadd j5, j13, j1
  jld j6, j1, PZFRN
  jwhile j6
    jld j7, j4, 0
    jst j7, j5, 0
    jldi j7, 8
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jld j11, j1, PZFR
  jst j13, j1, PZFR
  jld j2, j1, PZFRC
  jadd j2, j2, j2
  jst j2, j1, PZFRC
  jldi j10, 3
  jcall0 j1, ask
jwcheck
pf_read:
  jld j10, j1, PZFH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, PZFR
  jld j2, j1, PZFRN
  jadd j11, j11, j2
  jld j12, j1, PZFRC
  jsub j12, j12, j2
  jcall0 j1, ask
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
jwend
pf_close:
  jld j10, j1, PZFH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
pf_done:
  jldi j1, 0
  jret
