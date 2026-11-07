; Asking by following the clues (Capitan, 2026-11-07: "keep the clue of where it read it and look for it to answer
; me, more like our mind"). The books live anywhere on the host; Razar's folder holds only its nests "pistas..."
; (comer.jsm) and, while it thinks, its walk. Thinking is walking, and walking is looking for: each round reads again
; only the renglones where the words it walks are, answers what it can, and the words it reached are what it looks for
; in the next round. When a round reaches nothing new, that round's answer is said; before that a round says nothing.
;
; Each round is a life of its own (36, rehacerse: the cabin starts again with its own program, every room given back):
; "camino" holds the words walked so far, one a line, and "libro" what it reads again in this round (written here,
; read by read_book as any book). The first round, with no walk yet, reads only the question: what it reaches is the
; question's own words. Without nests nothing changes: it reads its "libro" as always.
;
; The program that includes it calls clue_round before read_book, clue_gather after each answer and clue_end before
; finish, names the labels S_CAMINO ("camino", 6 bytes) and S_SELF (its own program, S_SELFN bytes), and keeps away
; from 1900h-19FFh.
PZON  = 1900h                   ; 1: there are nests (it asks by the clues)
PZCAM = 1908h                   ; the walk so far: its letters, a word a line, and its bytes
PZCAMN = 1910h
PZLST = 1918h                   ; the labels of its folder (request 14), and how many
PZLSTN = 1920h
PZLP  = 1928h                   ; walking them: where, how many left
PZLI  = 1930h
PZFR  = 1938h                   ; a file read whole: its room, its bytes, the room's bytes, its handle
PZFRN = 1940h
PZFRC = 1948h
PZFH  = 1950h
PZOUT = 1958h                   ; the handle of "libro", written
PZMAP = 1960h                   ; by renglon of the nest: 1 if it is read again
PZMK  = 1968h                   ; the nest: its marks, how many, the bytes of a clue, its subjects, the one walked, left
PZNR  = 1970h
PZCW  = 1978h
PZNK  = 1980h
PZW   = 1988h
PZWI  = 1990h
PZTOT = 1998h                   ; the bytes read again, their room, how far it is filled, the book's handle
PZBUF = 19A0h
PZOFF = 19A8h
PZBH  = 19B0h
PZK   = 19B8h                   ; the renglon walked, the first of a run
PZA   = 19C0h
PZNEW = 19C8h                   ; the words reached that are not in the walk: their letters, their bytes, the room's
PZNEWN = 19D0h
PZNEWC = 19D8h
PZHP  = 19E0h                   ; a word looked for: its letters, its bytes; and the text it is looked for in, its bytes
PZHN  = 19E8h
PZTB  = 19F0h
PZTN  = 19F8h

; The file of the label at j11 (j12 bytes), read whole into a room that grows to hold it -> PZFR, PZFRN (-1 if it
; cannot be opened). Uses j1-j14.
pz_file:
  jldi j1, 0
  jldi j10, 4
  jcall ask
  jldi j1, 0
  jldi j2, -1
  jst j2, j1, PZFRN
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, pf_done
  jst j13, j1, PZFH
  jst j1, j1, PZFRN
  jldi j11, 4096
  jst j11, j1, PZFRC
  jcall room
  jldi j1, 0
  jst j13, j1, PZFR
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
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, pf_close             ; (nothing more, or a failed read: the end)
  jld j2, j1, PZFRN
  jadd j2, j2, j13
  jst j2, j1, PZFRN
  jld j3, j1, PZFRC
  jsub j3, j3, j2
  jjnz j3, pf_read
  jld j11, j1, PZFRC            ; full: a room twice as big, what it holds copied, the old one given back
  jadd j11, j11, j11
  jcall room
  jldi j1, 0
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
  jcall ask
  jldi j1, 0
  jjmp pf_read
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

; j2 = 1 if the word at PZHP (PZHN bytes) is a line of the text at PZTB (PZTN bytes). Uses j1-j8.
pz_has:
  jldi j1, 0
  jld j3, j1, PZTB
  jld j4, j1, PZTN
  jadd j4, j3, j4               ; the text's end
ph_line:
  jsub j5, j4, j3
  jjz j5, ph_no
  jadd j5, j3, j1               ; the line: to its line feed
ph_end:
  jldb j6, j5, 0
  jldi j7, 10
  jsub j6, j6, j7
  jjz j6, ph_cmp
  jldi j6, 1
  jadd j5, j5, j6
  jjmp ph_end
ph_cmp:
  jsub j6, j5, j3
  jld j7, j1, PZHN
  jsub j6, j6, j7
  jjnz j6, ph_next
  jld j6, j1, PZHP
  jadd j7, j3, j1
ph_byte:
  jsub j8, j5, j7
  jjz j8, ph_yes
  jldb j8, j7, 0
  jldb j2, j6, 0
  jsub j8, j8, j2
  jjnz j8, ph_next
  jldi j8, 1
  jadd j6, j6, j8
  jadd j7, j7, j8
  jjmp ph_byte
ph_next:
  jldi j6, 1
  jadd j3, j5, j6
  jjmp ph_line
ph_yes:
  jldi j2, 1
  jret
ph_no:
  jldi j2, 0
  jret

; j2 bytes from j3 written to "libro". Uses j1, j10-j14.
pz_out:
  jldi j1, 0
  jld j10, j1, PZOUT
  jldi j11, 32
  jshl j10, j10, j11
  jldi j11, 6
  jor j10, j10, j11
  jadd j11, j3, j1
  jadd j12, j2, j1
  jcall ask
  jldi j1, 0
  jret

; A round begins: if there are nests, its "libro" is written (the question, the first round; then the renglones of
; the words walked, from every nest). Uses j1-j14.
clue_round:
  jldi j1, 0
  jst j1, j1, PZON
  jst j1, j1, PZNEWN
  jldi j11, 4096                ; its folder's labels: is there a nest?
  jcall room
  jldi j1, 0
  jst j13, j1, PZLST
  jldi j10, 14
  jadd j11, j13, j1
  jldi j12, 4096
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jsar j2, j13, j2
  jjnz j2, cr_none
  jst j13, j1, PZLSTN
  jld j9, j1, PZLST
  jadd j10, j13, j1
  jwhile j10
    jldi j1, 0
    jcall pz_nest
    jjz j2, cr_skip
    jldi j2, 1
    jst j2, j1, PZON
  cr_skip:
    jldi j1, 0
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
  jld j2, j1, PZON
  jjz j2, cr_none
  jldi j11, S_CAMINO            ; the walk so far
  jldi j12, 6
  jcall pz_file
  jldi j1, 0
  jld j2, j1, PZFR
  jst j2, j1, PZCAM
  jld j2, j1, PZFRN
  jldi j3, 63
  jsar j3, j2, j3
  jldi j4, -1
  jxor j3, j3, j4
  jand j2, j2, j3
  jst j2, j1, PZCAMN
  jldi j10, 12                  ; its "libro" for this round, new
  jldi j11, S_LIBRO
  jldi j12, 5
  jcall ask
  jldi j10, 4
  jldi j11, S_LIBRO
  jldi j12, 5
  jcall ask
  jldi j1, 0
  jst j13, j1, PZOUT
  jld j2, j1, PZCAMN
  jjnz j2, cr_walk
  jldi j11, S_Q                 ; the first round: the question
  jldi j12, 1
  jcall pz_file
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, cr_close
  jld j3, j1, PZFR
  jcall pz_out
  jjmp cr_close
cr_walk:
  jld j9, j1, PZLST             ; every nest: the renglones of the words walked
  jld j10, j1, PZLSTN
  jst j9, j1, PZLP
  jst j10, j1, PZLI
  jwhile j10
    jldi j1, 0
    jld j9, j1, PZLP
    jcall pz_nest
    jjz j2, cw_skip
    jld j11, j1, PZLP
    jldi j2, 8
    jadd j11, j11, j2
    jld j12, j9, 0
    jcall pz_file
    jcall pz_read
  cw_skip:
    jldi j1, 0
    jld j9, j1, PZLP
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jst j9, j1, PZLP
    jld j10, j1, PZLI
    jldi j2, 1
    jsub j10, j10, j2
    jst j10, j1, PZLI
  jwend
cr_close:
  jldi j1, 0
  jld j10, j1, PZOUT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
cr_none:
  jldi j1, 0
  jret

; j2 = 1 if the label listed at j9 ({its bytes, its bytes padded}) is a nest: "pistas" and more. Uses j1-j5.
pz_nest:
  jldi j1, 0
  jld j2, j9, 0
  jldi j3, 7
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, pn_no
  jld j3, j9, 8
  jldi j4, 16
  jshl j3, j3, j4
  jshr j3, j3, j4
  jldi j4, 0
  jshi j4, 7361h
  jshi j4, 7473h
  jshi j4, 6970h
  jsub j3, j3, j4
  jjnz j3, pn_no
  jldi j2, 1
  jret
pn_no:
  jldi j2, 0
  jret

; The nest just read (PZFR): the renglones where a word of the walk is, read again from its book (38: there, and only
; those bytes) into "libro", each run of them ended by a line feed. Uses j1-j14.
pz_read:
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 56
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, prd_done              ; (no nest there)
  jld j9, j1, PZFR
  jld j2, j9, 16
  jst j2, j1, PZNR
  jld j2, j9, 24
  jst j2, j1, PZNK
  jld j2, j9, 48
  jst j2, j1, PZCW
  jld j2, j9, 40
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, -8
  jand j2, j2, j3
  jldi j3, 56
  jadd j2, j2, j3
  jadd j2, j9, j2
  jst j2, j1, PZMK
  jld j11, j1, PZNR             ; by renglon, 1 if it is read again
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PZMAP
  jld j2, j1, PZNR
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, PZMK
  jadd j2, j2, j3
  jst j2, j1, PZW
  jld j2, j1, PZNK
  jst j2, j1, PZWI
  jld j2, j1, PZCAM
  jst j2, j1, PZTB
  jld j2, j1, PZCAMN
  jst j2, j1, PZTN
  jld j2, j1, PZWI
  jwhile j2                     ; every subject: walked? its renglones, marked
    jldi j1, 0
    jld j9, j1, PZW
    jld j2, j9, 0
    jst j2, j1, PZHN
    jldi j3, 8
    jadd j3, j9, j3
    jst j3, j1, PZHP
    jcall pz_has
    jldi j1, 0
    jld j9, j1, PZW
    jld j3, j9, 0
    jldi j4, 7
    jadd j3, j3, j4
    jldi j4, -8
    jand j3, j3, j4
    jldi j4, 8
    jadd j9, j9, j4
    jadd j9, j9, j3
    jld j5, j9, 0               ; how many renglones
    jldi j4, 8
    jadd j9, j9, j4
    jld j6, j1, PZCW
    jmul j7, j5, j6
    jldi j4, 7
    jadd j7, j7, j4
    jldi j4, -8
    jand j7, j7, j4
    jadd j4, j9, j7
    jst j4, j1, PZW             ; (the next subject)
    jjz j2, pr_word
    jwhile j5
      jldi j7, 0                ; a renglon: its bytes, little end first
      jadd j8, j6, j1
      jadd j3, j9, j6
      pr_byte:
        jldi j4, 1
        jsub j3, j3, j4
        jldb j4, j3, 0
        jldi j2, 8
        jshl j7, j7, j2
        jor j7, j7, j4
        jldi j4, 1
        jsub j8, j8, j4
        jjnz j8, pr_byte
      jld j4, j1, PZMAP
      jadd j4, j4, j7
      jldi j2, 1
      jstb j2, j4, 0
      jadd j9, j9, j6
      jldi j4, 1
      jsub j5, j5, j4
    jwend
  pr_word:
    jldi j1, 0
    jld j2, j1, PZWI
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, PZWI
  jwend
  jldi j1, 0                    ; the bytes to read again (and a line feed a renglon, at most)
  jst j1, j1, PZTOT
  jld j9, j1, PZMAP
  jld j10, j1, PZNR
  jldi j2, 1
  jsub j10, j10, j2
  jld j8, j1, PZMK
  jwhile j10
    jldb j2, j9, 0
    jjz j2, pt_next
    jld j3, j8, 8
    jld j4, j8, 0
    jsub j3, j3, j4
    jldi j4, 1
    jadd j3, j3, j4
    jld j4, j1, PZTOT
    jadd j4, j4, j3
    jst j4, j1, PZTOT
  pt_next:
    jldi j2, 1
    jadd j9, j9, j2
    jldi j2, 8
    jadd j8, j8, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jld j11, j1, PZTOT
  jjz j11, prd_done
  jcall room
  jldi j1, 0
  jst j13, j1, PZBUF
  jst j1, j1, PZOFF
  jldi j10, 37                  ; its book, where it is
  jld j11, j1, PZFR
  jldi j2, 56
  jadd j11, j11, j2
  jld j12, j1, PZFR
  jld j12, j12, 40
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, prd_done              ; (the book is not there any more: what was read there is lost, as in us)
  jst j13, j1, PZBH
  jst j1, j1, PZK
  pr_run:
    jldi j1, 0
    jld j2, j1, PZK
    jld j3, j1, PZNR
    jldi j4, 1
    jsub j3, j3, j4
    jsub j3, j3, j2
    jjz j3, pr_ran
    jld j3, j1, PZMAP
    jadd j3, j3, j2
    jldb j3, j3, 0
    jjnz j3, pr_start
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PZK
    jjmp pr_run
  pr_start:
    jst j2, j1, PZA
    pr_more:
      jldi j3, 1
      jadd j2, j2, j3
      jld j3, j1, PZNR
      jldi j4, 1
      jsub j3, j3, j4
      jsub j3, j3, j2
      jjz j3, pr_cut
      jld j3, j1, PZMAP
      jadd j3, j3, j2
      jldb j3, j3, 0
      jjnz j3, pr_more
    pr_cut:
    jst j2, j1, PZK
    jld j10, j1, PZBH           ; there (38), and the run read
    jldi j3, 32
    jshl j10, j10, j3
    jldi j3, 38
    jor j10, j10, j3
    jld j3, j1, PZA
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, PZMK
    jadd j3, j3, j4
    jld j11, j3, 0
    jldi j12, 0
    jcall ask
    jldi j1, 0
    jld j3, j1, PZA
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, PZMK
    jadd j3, j3, j4
    jld j5, j3, 0
    jld j2, j1, PZK
    jldi j4, 3
    jshl j2, j2, j4
    jld j4, j1, PZMK
    jadd j2, j2, j4
    jld j12, j2, 0
    jsub j12, j12, j5
    jld j10, j1, PZBH
    jldi j3, 32
    jshl j10, j10, j3
    jldi j3, 5
    jor j10, j10, j3
    jld j11, j1, PZBUF
    jld j3, j1, PZOFF
    jadd j11, j11, j3
    jcall ask
    jldi j1, 0
    jldi j2, 63
    jsar j2, j13, j2
    jldi j3, -1
    jxor j2, j2, j3
    jand j13, j13, j2
    jld j3, j1, PZOFF
    jadd j3, j3, j13
    jld j4, j1, PZBUF
    jadd j4, j4, j3
    jldi j2, 10
    jstb j2, j4, 0
    jldi j2, 1
    jadd j3, j3, j2
    jst j3, j1, PZOFF
    jjmp pr_run
  pr_ran:
  jld j10, j1, PZBH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, PZOFF
  jld j3, j1, PZBUF
  jcall pz_out
prd_done:
  jldi j1, 0
  jret

; After an answer: the words of the question and every word its holes reached, the ones not walked yet, kept to be
; walked in the next round. Uses j1-j14.
clue_gather:
  jldi j1, 0
  jld j2, j1, PZON
  jjz j2, cg_done
  jld j9, j1, QS
  cg_q:
    jldi j1, 0
    jld j2, j1, QE
    jsub j2, j9, j2
    jjz j2, cg_holes
    jldi j2, 3
    jshl j2, j9, j2
    jld j2, j2, QBUF
    jst j9, j1, PZK
    jcall pz_add
    jldi j1, 0
    jld j9, j1, PZK
    jldi j2, 1
    jadd j9, j9, j2
    jjmp cg_q
  cg_holes:
  jst j1, j1, PZA               ; every hole, every answer it has
  cg_hole:
    jldi j1, 0
    jld j2, j1, PZA
    jld j3, j1, NH
    jsub j3, j2, j3
    jjz j3, cg_done
    jldi j3, 3
    jshl j3, j2, j3
    jld j10, j3, HCNT
    jld j4, j1, NV
    jmul j9, j2, j4
    jldi j4, 40
    jmul j9, j9, j4
    jld j4, j1, ROOMK
    jadd j9, j9, j4
    jwhile j10
      jldi j1, 0
      jst j9, j1, PZK
      jst j10, j1, PZTOT
      jld j2, j9, 0
      jcall pz_add
      jldi j1, 0
      jld j9, j1, PZK
      jldi j2, 40
      jadd j9, j9, j2
      jld j10, j1, PZTOT
      jldi j2, 1
      jsub j10, j10, j2
    jwend
    jld j2, j1, PZA
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PZA
    jjmp cg_hole
cg_done:
  jldi j1, 0
  jret

; The word number j2 (if it is one) to what it walks next, if it is not walked yet. Uses j1-j14.
pz_add:
  jldi j1, 0
  jldi j3, 1
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, pa_done              ; (a hole, an unknown word, the renglon)
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j5, j3, 16
  jst j5, j1, PZHN
  jld j3, j3, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jst j3, j1, PZHP
  jld j2, j1, PZCAM
  jst j2, j1, PZTB
  jld j2, j1, PZCAMN
  jst j2, j1, PZTN
  jcall pz_has
  jjnz j2, pa_done
  jld j2, j1, PZNEW
  jst j2, j1, PZTB
  jld j2, j1, PZNEWN
  jst j2, j1, PZTN
  jcall pz_has
  jjnz j2, pa_done
  jld j2, j1, PZNEWN            ; new: its letters and a line feed (the room grows to hold them)
  jld j3, j1, PZHN
  jadd j2, j2, j3
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j1, PZNEWC
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, pa_put
  jld j11, j1, PZNEWC
  jadd j11, j11, j11
  jldi j3, 4096
  jadd j11, j11, j3
  jst j11, j1, PZNEWC
  jcall room
  jldi j1, 0
  jld j4, j1, PZNEW
  jadd j5, j13, j1
  jld j6, j1, PZNEWN
  jwhile j6
    jldb j7, j4, 0
    jstb j7, j5, 0
    jldi j7, 1
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jst j13, j1, PZNEW
pa_put:
  jld j4, j1, PZNEW
  jld j5, j1, PZNEWN
  jadd j4, j4, j5
  jld j3, j1, PZHP
  jld j6, j1, PZHN
  jwhile j6
    jldb j7, j3, 0
    jstb j7, j4, 0
    jldi j7, 1
    jadd j3, j3, j7
    jadd j4, j4, j7
    jsub j6, j6, j7
  jwend
  jldi j7, 10
  jstb j7, j4, 0
  jld j5, j1, PZNEWN
  jld j6, j1, PZHN
  jadd j5, j5, j6
  jldi j6, 1
  jadd j5, j5, j6
  jst j5, j1, PZNEWN
pa_done:
  jldi j1, 0
  jret

; The round ends: something new to walk, written to "camino", and the round starts again saying nothing (36); nothing
; new, its answer is said, and "libro" and "camino" go. Uses j1-j14.
clue_end:
  jldi j1, 0
  jld j2, j1, PZON
  jjz j2, ce_done
  jld j2, j1, PZNEWN
  jjnz j2, ce_again
  jldi j10, 12
  jldi j11, S_LIBRO
  jldi j12, 5
  jcall ask
  jldi j10, 12
  jldi j11, S_CAMINO
  jldi j12, 6
  jcall ask
  jjmp ce_done
ce_again:
  jldi j10, 4                   ; the walk, longer
  jldi j11, S_CAMINO
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jst j13, j1, PZOUT
  jld j10, j1, PZOUT            ; (at its end: what it walked stays, the new after it)
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 38
  jor j10, j10, j2
  jld j11, j1, PZCAMN
  jldi j12, 0
  jcall ask
  jldi j1, 0
  jld j2, j1, PZNEWN
  jld j3, j1, PZNEW
  jcall pz_out
  jld j10, j1, PZOUT
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j10, 36                  ; again, as itself, saying nothing of this round
  jldi j11, S_SELF
  jldi j12, S_SELFN
  jcall ask
  jldi j1, 0
  jst j1, j1, POS
ce_done:
  jldi j1, 0
  jret
