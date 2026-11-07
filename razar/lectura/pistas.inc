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
; finish, and clue_counts once it knows how often each word is in what it read, names the labels S_CAMINO ("camino",
; 6 bytes) and S_SELF (its own program, S_SELFN bytes), includes carpeta.inc, and keeps away from 1900h-1ACFh.
;
; The judge weighs a filling against the book ("what the filling says here beyond what it says anywhere"): reading
; again only a part, a word of those renglones would look common there and be rare in the book. So the counts come from
; the nests (how many times each word is in its book, the book's units), summed over every book, and not from what it
; read again. What was said and what was asked are whole as they are: every renglon of a word walked is read again.
PZON  = 1900h                   ; 1: there are nests (it asks by the clues)
PZCAM = 1908h                   ; the walk so far: its letters, a word a line, and its bytes
PZCAMN = 1910h
PZLP  = 1928h                   ; walking its folder's labels: where, how many left
PZLI  = 1930h
PZOUT = 1958h                   ; the handle of "libro", written
PZMAP = 1960h                   ; by renglon of the nest: 1 if it is read again
PZIX  = 1968h                   ; the book's index; its marks; a pointer to each piece in its list; by piece, 1 if needed;
PZNR  = 1970h                   ; the piece walked, and how many of its words are left
PZPP  = 1978h
PZNEED = 1980h
PZPI  = 1988h
PZPE  = 1990h
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
PZOCC = 1A00h                   ; how many times each word is in the books: a table that grows {print of its letters,
PZNTOK = 1A20h                  ; times} (four qwords); and the books' units
PZLB  = 1A30h                   ; a piece's label: "pieza" and its number (32 bytes)
PZRB  = 1A50h                   ; the bits read: where, the bit it is at
PZRP  = 1A58h
PZWB  = 1A60h                   ; the word just read: its letters (a room that grows), the room's bytes, its bytes, its
PZWC  = 1A68h                   ; times, in how many renglones; the Rice parameter of a run
PZWN  = 1A70h
PZEO  = 1A78h
PZEN  = 1A80h
PZRK  = 1A88h
PZMCP = 1A90h                   ; the mark page held, and its marks
PZMC  = 1A98h
PZMODE = 1AA0h                  ; 1: the renglones of the words walked are marked; 2: the words read add their times
PZV   = 1AA8h                   ; kept across a call
PZV2  = 1AB0h
PZLO  = 1AB8h
PZHI2 = 1AC0h
PZX   = 1AC8h

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
  jcall pz_list                 ; its folder's labels: is there a nest?
  jldi j1, 0
  jld j13, j1, PZLSTN
  jldi j2, 63
  jsar j2, j13, j2
  jjnz j2, cr_none
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
  jldi j2, PZOCC                ; (the counts of every word, from the nests)
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, PZNTOK
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

; The index just read (PZFR): the renglones where a word of the walk is (from only the pieces that hold them), read
; again from its book (38: there, and only those bytes) into "libro", each run of them ended by a line feed. Uses
; j1-j14.
pz_read:
  jcall pz_index
  jjz j2, prd_done              ; (no index there, or one of another form)
  jldi j1, 0
  jld j9, j1, PZIX
  jld j2, j9, 56
  jld j3, j1, PZNTOK
  jadd j3, j3, j2
  jst j3, j1, PZNTOK
  jld j2, j9, 80
  jjz j2, prd_done              ; (a book of no words)
  jld j2, j9, 16
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, PZNR
  jldi j3, 8
  jadd j11, j2, j3
  jcall room                    ; by renglon, 1 if it is read again
  jldi j1, 0
  jst j13, j1, PZMAP
  jld j9, j1, PZIX              ; the marks of one page at a time
  jld j11, j9, 96
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PZMC
  jldi j2, -1
  jst j2, j1, PZMCP
  jld j2, j1, PZCAM             ; each word walked: the piece where it is
  jst j2, j1, PZK
prd_word:
  jldi j1, 0
  jld j3, j1, PZK
  jld j4, j1, PZCAM
  jld j5, j1, PZCAMN
  jadd j4, j4, j5
  jsub j4, j4, j3
  jjz j4, prd_found
  jst j3, j1, PZHP
  jadd j5, j3, j1
prd_end:
  jldb j6, j5, 0
  jldi j7, 10
  jsub j6, j6, j7
  jjz j6, prd_line
  jldi j6, 1
  jadd j5, j5, j6
  jjmp prd_end
prd_line:
  jsub j6, j5, j3
  jst j6, j1, PZHN
  jldi j6, 1
  jadd j5, j5, j6
  jst j5, j1, PZK
  jcall pz_find
  jjmp prd_word
prd_found:
  jldi j2, 1                    ; those pieces: the renglones of the words walked
  jst j2, j1, PZMODE
  jcall pz_visit
  jldi j1, 0                    ; the bytes to read again (and a line feed a renglon, at most)
  jst j1, j1, PZTOT
  jst j1, j1, PZK
pt_lap:
  jldi j1, 0
  jld j2, j1, PZK
  jld j3, j1, PZNR
  jldi j4, 1
  jsub j3, j3, j4
  jsub j3, j3, j2
  jjz j3, pt_done
  jld j3, j1, PZMAP
  jadd j3, j3, j2
  jldb j3, j3, 0
  jjz j3, pt_next
  jldi j3, 1
  jadd j2, j2, j3
  jcall zm_mark
  jldi j1, 0
  jst j2, j1, PZA
  jld j2, j1, PZK
  jcall zm_mark
  jldi j1, 0
  jld j3, j1, PZA
  jsub j3, j3, j2
  jldi j4, 1
  jadd j3, j3, j4
  jld j4, j1, PZTOT
  jadd j4, j4, j3
  jst j4, j1, PZTOT
pt_next:
  jld j2, j1, PZK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, PZK
  jjmp pt_lap
pt_done:
  jld j11, j1, PZTOT
  jjz j11, prd_done
  jcall room
  jldi j1, 0
  jst j13, j1, PZBUF
  jst j1, j1, PZOFF
  jldi j10, 37                  ; its book, where it is
  jld j11, j1, PZIX
  jldi j2, 152
  jadd j11, j11, j2
  jld j12, j1, PZIX
  jld j12, j12, 48
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
    jld j2, j1, PZA             ; the run: from its first mark to the mark after it
    jcall zm_mark
    jldi j1, 0
    jst j2, j1, PZTN
    jld j2, j1, PZK
    jcall zm_mark
    jldi j1, 0
    jld j3, j1, PZTN
    jsub j2, j2, j3
    jst j2, j1, PZTB
    jld j10, j1, PZBH           ; there (38), and the run read
    jldi j3, 32
    jshl j10, j10, j3
    jldi j3, 38
    jor j10, j10, j3
    jld j11, j1, PZTN
    jldi j12, 0
    jcall ask
    jldi j1, 0
    jld j10, j1, PZBH
    jldi j3, 32
    jshl j10, j10, j3
    jldi j3, 5
    jor j10, j10, j3
    jld j11, j1, PZBUF
    jld j3, j1, PZOFF
    jadd j11, j11, j3
    jld j12, j1, PZTB
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

; The print of the letters at PZHP (PZHN bytes): FNV-1a, never 0 (a key of a table that grows) -> j5. Uses j1-j7.
pz_print:
  jldi j1, 0
  jldi j5, 0
  jshi j5, 0CBF2h
  jshi j5, 9CE4h
  jshi j5, 8422h
  jshi j5, 2325h
  jldi j6, 0
  jshi j6, 100h
  jshi j6, 0
  jshi j6, 1B3h
  jld j3, j1, PZHP
  jld j4, j1, PZHN
  jwhile j4
    jldb j7, j3, 0
    jxor j5, j5, j7
    jmul j5, j5, j6
    jldi j7, 1
    jadd j3, j3, j7
    jsub j4, j4, j7
  jwend
  jjnz j5, pp_done
  jldi j5, 1
pp_done:
  jret

; The word at PZHP (PZHN bytes), just read in a piece, adds its times (PZEO). Uses j1-j8.
pz_count:
  jcall pz_print
  jldi j2, PZOCC
  jcall pl_take
  jldi j1, 0
  jld j3, j1, PZEO
  jld j2, j4, 8
  jadd j2, j2, j3
  jst j2, j4, 8
  jldi j1, 0
  jret

; The judge's counts from the books, not from what it read again: each word's times (ROOMF2) and the books' units
; (LGT). Uses j1-j14.
clue_counts:
  jldi j1, 0
  jld j2, j1, PZON
  jjz j2, cc_done
  jld j2, j1, PZNTOK
  jjz j2, cc_done
  jld j9, j1, PZLST             ; every index: the times of each word read, from the pieces where those words are
  jld j10, j1, PZLSTN
  jst j9, j1, PZLP
  jst j10, j1, PZLI
  jwhile j10
    jldi j1, 0
    jld j9, j1, PZLP
    jcall pz_nest
    jjz j2, cct_skip
    jld j11, j1, PZLP
    jldi j2, 8
    jadd j11, j11, j2
    jld j12, j9, 0
    jcall pz_file
    jcall pz_index
    jjz j2, cct_skip
    jldi j1, 0
    jld j2, j1, PZIX
    jld j2, j2, 80
    jjz j2, cct_skip
    jld j10, j1, NV
    jldi j9, 1
    jsub j10, j10, j9
    jwhile j10
      jldi j1, 0
      jst j9, j1, PZK
      jst j10, j1, PZA
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, ROOMI
      jadd j3, j3, j4
      jld j3, j3, 0
      jld j5, j3, 16
      jst j5, j1, PZHN
      jld j3, j3, 8
      jld j4, j1, ROOMA
      jadd j3, j3, j4
      jst j3, j1, PZHP
      jcall pz_find
      jldi j1, 0
      jld j9, j1, PZK
      jld j10, j1, PZA
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jldi j2, 2
    jst j2, j1, PZMODE
    jcall pz_visit
  cct_skip:
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
  jld j10, j1, NV
  jldi j9, 1
  jsub j10, j10, j9
  jwhile j10
    jldi j1, 0
    jst j9, j1, PZK
    jst j10, j1, PZA
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j5, j3, 16
    jst j5, j1, PZHN
    jld j3, j3, 8
    jld j4, j1, ROOMA
    jadd j3, j3, j4
    jst j3, j1, PZHP
    jcall pz_print
    jldi j2, PZOCC
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjz j2, cc_next             ; (a word of no book: what it read is all it has)
    jld j2, j4, 8
    jld j9, j1, PZK
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMF2
    jadd j3, j3, j4
    jst j2, j3, 0
  cc_next:
    jldi j1, 0
    jld j9, j1, PZK
    jld j10, j1, PZA
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jld j2, j1, PZNTOK
  jcall lg16
  jldi j1, 0
  jst j2, j1, LGT
cc_done:
  jldi j1, 0
  jret

; The index just read (PZFR, PZFRN): if it is one (version 4), PZIX, a pointer to each piece in its list (PZPP) and
; a byte by piece, 0, for the pieces it needs (PZNEED) -> j2 = 1; j2 = 0 if it is not. Uses j1-j14.
pz_index:
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 152
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, pzi_no
  jld j9, j1, PZFR
  jld j2, j9, 0
  jldi j3, 4
  jsub j2, j2, j3
  jjnz j2, pzi_no
  jst j9, j1, PZIX
  jld j11, j9, 80
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PZPP
  jld j9, j1, PZIX
  jld j10, j9, 80
  jld j2, j9, 120
  jadd j2, j9, j2
  jadd j3, j13, j1
  jwhile j10
    jst j2, j3, 0
    jld j4, j2, 8
    jldi j5, 7
    jadd j4, j4, j5
    jldi j5, -8
    jand j4, j4, j5
    jldi j5, 16
    jadd j4, j4, j5
    jadd j2, j2, j4
    jldi j4, 8
    jadd j3, j3, j4
    jldi j4, 1
    jsub j10, j10, j4
  jwend
  jld j11, j9, 80
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PZNEED
  jldi j2, 1
  jret
pzi_no:
  jldi j1, 0
  jldi j2, 0
  jret

; The piece where the word at PZHP (PZHN bytes) is, if it is in the book: the last whose first word is not after it
; (halving the list) -> j2, and marked needed. Uses j1-j8.
pz_find:
  jldi j1, 0
  jst j1, j1, PZLO
  jld j2, j1, PZIX
  jld j2, j2, 80
  jst j2, j1, PZHI2
pzf_lap:
  jldi j1, 0
  jld j2, j1, PZLO
  jld j3, j1, PZHI2
  jsub j4, j3, j2
  jldi j5, 1
  jsub j4, j4, j5
  jjz j4, pzf_done
  jadd j4, j2, j3
  jshr j4, j4, j5
  jst j4, j1, PZX
  jldi j5, 3
  jshl j5, j4, j5
  jld j6, j1, PZPP
  jadd j5, j5, j6
  jld j5, j5, 0
  jld j6, j5, 8
  jldi j7, 16
  jadd j5, j5, j7
  jcall pz_less
  jldi j1, 0
  jld j3, j1, PZX
  jjnz j2, pzf_hi
  jst j3, j1, PZLO
  jjmp pzf_lap
pzf_hi:
  jst j3, j1, PZHI2
  jjmp pzf_lap
pzf_done:
  jld j2, j1, PZLO
  jld j3, j1, PZNEED
  jadd j3, j3, j2
  jldi j4, 1
  jstb j4, j3, 0
  jret

; j2 = 1 if the word at PZHP (PZHN bytes) goes before the j6 bytes at j5 (byte by byte; a word before what it starts).
; Uses j1-j8.
pz_less:
  jldi j1, 0
  jld j3, j1, PZHP
  jld j4, j1, PZHN
pzl_lap:
  jjz j6, pzl_no
  jjz j4, pzl_yes
  jldb j7, j3, 0
  jldb j8, j5, 0
  jsub j7, j7, j8
  jjnz j7, pzl_diff
  jldi j7, 1
  jadd j3, j3, j7
  jadd j5, j5, j7
  jsub j4, j4, j7
  jsub j6, j6, j7
  jjmp pzl_lap
pzl_diff:
  jldi j8, 63
  jsar j7, j7, j8
  jjz j7, pzl_no
pzl_yes:
  jldi j2, 1
  jret
pzl_no:
  jldi j2, 0
  jret

; The label of piece j2: "pieza" and j2 in decimal at PZLB -> j2 its bytes. Uses j1-j7.
pz_label:
  jldi j1, 0
  jldi j3, PZLB
  jldi j4, 112
  jstb j4, j3, 0
  jldi j4, 105
  jstb j4, j3, 1
  jldi j4, 101
  jstb j4, j3, 2
  jldi j4, 122
  jstb j4, j3, 3
  jldi j4, 97
  jstb j4, j3, 4
  jldi j5, 0                    ; its digits, the last first
pzb_digit:
  jldi j3, 10
  jdiv j4, j2, j3
  jmul j6, j4, j3
  jsub j6, j2, j6
  jldi j3, 48
  jadd j6, j6, j3
  jstb j6, j5, DIG
  jldi j3, 1
  jadd j5, j5, j3
  jadd j2, j4, j1
  jjnz j2, pzb_digit
  jldi j3, 5
  jadd j7, j5, j3
  jldi j3, PZLB + 5
pzb_put:
  jldi j4, 1
  jsub j5, j5, j4
  jldb j6, j5, DIG
  jstb j6, j3, 0
  jadd j3, j3, j4
  jjnz j5, pzb_put
  jadd j2, j7, j1
  jret

; Every piece the index at PZIX needs (PZNEED), read and walked, one at a time (each given back when walked): in mode
; 1 (PZMODE) the renglones of each word walked are marked (PZMAP); in mode 2 each word adds its times (PZOCC). Uses
; j1-j14.
pz_visit:
  jldi j1, 0
  jst j1, j1, PZPI
pzv_piece:
  jldi j1, 0
  jld j2, j1, PZPI
  jld j9, j1, PZIX
  jld j3, j9, 80
  jsub j3, j2, j3
  jjz j3, pzv_done
  jld j3, j1, PZNEED
  jadd j3, j3, j2
  jldb j3, j3, 0
  jjz j3, pzv_next
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, PZPP
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j2, j3, 0
  jcall pz_label
  jadd j12, j2, j1
  jldi j11, PZLB
  jcall pz_file
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, pzv_next             ; (a piece not there: what it held is not known)
  jld j2, j1, PZFR
  jst j2, j1, PZRB
  jst j1, j1, PZRP
  jld j9, j1, PZIX              ; its words: a piece's, the last one what is left
  jld j3, j9, 88
  jld j2, j1, PZPI
  jmul j2, j2, j3
  jld j4, j9, 24
  jsub j4, j4, j2
  jsub j5, j4, j3
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, pzv_count
  jadd j4, j3, j1
pzv_count:
  jst j4, j1, PZPE
pzv_entry:
  jldi j1, 0
  jld j2, j1, PZPE
  jjz j2, pzv_give
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZPE
  jcall pz_entry
  jldi j1, 0
  jld j2, j1, PZWB
  jst j2, j1, PZHP
  jld j2, j1, PZWN
  jst j2, j1, PZHN
  jld j2, j1, PZMODE
  jldi j3, 1
  jsub j2, j2, j3
  jjnz j2, pzv_times
  jld j2, j1, PZCAM
  jst j2, j1, PZTB
  jld j2, j1, PZCAMN
  jst j2, j1, PZTN
  jcall pz_has
  jcall pz_clues
  jjmp pzv_entry
pzv_times:
  jcall pz_count
  jldi j2, 0
  jcall pz_clues
  jjmp pzv_entry
pzv_give:
  jld j11, j1, PZFR
  jldi j10, 3
  jcall ask
pzv_next:
  jldi j1, 0
  jld j2, j1, PZPI
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, PZPI
  jjmp pzv_piece
pzv_done:
  jldi j1, 0
  jret

; The next word of the piece being read: its letters at PZWB (PZWN bytes; the room grows to hold them), its times
; PZEO, in how many renglones PZEN (those renglones are next: pz_clues). Uses j1-j14.
pz_entry:
  jcall zr_gamma
  jldi j1, 0
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZX               ; (what it shares with the word before)
  jcall zr_gamma
  jldi j1, 0
  jldi j3, 1
  jsub j2, j2, j3
  jld j3, j1, PZX
  jadd j2, j2, j3
  jst j2, j1, PZWN
  jld j3, j1, PZWC
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, pze_room
  jadd j11, j2, j2              ; a room twice the word's, what it shares copied
  jldi j3, 4096
  jadd j11, j11, j3
  jst j11, j1, PZWC
  jcall room
  jldi j1, 0
  jld j4, j1, PZWB
  jadd j5, j13, j1
  jld j6, j1, PZX
  jwhile j6
    jldb j7, j4, 0
    jstb j7, j5, 0
    jldi j7, 1
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jst j13, j1, PZWB
pze_room:
  jldi j1, 0
  jld j2, j1, PZX
  jld j3, j1, PZWN
  jsub j3, j2, j3
  jjz j3, pze_said
  jld j9, j1, PZIX
  jld j3, j9, 72
  jcall zr_get
  jldi j1, 0
  jld j9, j1, PZIX
  jld j3, j9, 112
  jadd j3, j3, j9
  jadd j3, j3, j2
  jldb j3, j3, 0
  jld j4, j1, PZWB
  jld j2, j1, PZX
  jadd j4, j4, j2
  jstb j3, j4, 0
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, PZX
  jjmp pze_room
pze_said:
  jcall zr_gamma
  jldi j1, 0
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZEO
  jcall zr_gamma
  jldi j1, 0
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZEN
  jret

; The renglones of the word just read: marked in PZMAP if j2 is 1, passed by if not. Uses j1-j8.
pz_clues:
  jldi j1, 0
  jst j2, j1, PZV
  jld j2, j1, PZEN
  jjz j2, pzc_done
  jldi j3, 4
  jcall zr_get
  jldi j1, 0
  jst j2, j1, PZRK
  jldi j2, -1
  jst j2, j1, PZX
pzc_lap:
  jldi j1, 0
  jld j2, j1, PZEN
  jjz j2, pzc_done
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZEN
  jcall zr_rice
  jldi j1, 0
  jld j3, j1, PZX
  jadd j3, j3, j2
  jldi j2, 1
  jadd j3, j3, j2
  jst j3, j1, PZX
  jld j2, j1, PZV
  jjz j2, pzc_lap
  jld j4, j1, PZMAP
  jadd j4, j4, j3
  jldi j2, 1
  jstb j2, j4, 0
  jjmp pzc_lap
pzc_done:
  jldi j1, 0
  jret

; Mark j2 of the book whose index is at PZIX (where renglon j2 starts; the last, its end) -> j2. Its page is read
; once into PZMC while it asks for marks of the same page (PZMCP: the page held). Uses j1-j9.
zm_mark:
  jldi j1, 0
  jst j2, j1, PZHI2
  jld j9, j1, PZIX
  jld j3, j9, 96
  jdiv j4, j2, j3
  jld j5, j1, PZMCP
  jsub j5, j5, j4
  jjz j5, zmm_have
  jst j4, j1, PZMCP
  jld j5, j9, 128               ; the page: where its bits start, its first mark
  jadd j5, j5, j9
  jldi j6, 4
  jshl j6, j4, j6
  jadd j5, j5, j6
  jld j6, j5, 0
  jld j7, j5, 8
  jld j8, j9, 136
  jadd j8, j8, j9
  jadd j8, j8, j6
  jst j8, j1, PZRB
  jst j1, j1, PZRP
  jst j7, j1, PZEO
  jld j8, j1, PZMC
  jst j7, j8, 0
  jst j8, j1, PZLO
  jmul j5, j4, j3               ; how many marks it holds past the first
  jld j6, j9, 16
  jldi j7, 1
  jadd j6, j6, j7
  jsub j6, j6, j5
  jsub j7, j6, j3
  jldi j8, 63
  jsar j7, j7, j8
  jjnz j7, zmm_count
  jadd j6, j3, j1
zmm_count:
  jldi j7, 1
  jsub j6, j6, j7
  jst j6, j1, PZPE
  jldi j3, 4
  jcall zr_get
  jldi j1, 0
  jst j2, j1, PZRK
zmm_lap:
  jldi j1, 0
  jld j2, j1, PZPE
  jjz j2, zmm_have
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZPE
  jcall zr_rice
  jldi j1, 0
  jld j3, j1, PZEO
  jadd j3, j3, j2
  jst j3, j1, PZEO
  jld j4, j1, PZLO
  jldi j5, 8
  jadd j4, j4, j5
  jst j4, j1, PZLO
  jst j3, j4, 0
  jjmp zmm_lap
zmm_have:
  jldi j1, 0
  jld j9, j1, PZIX
  jld j3, j9, 96
  jld j2, j1, PZHI2
  jld j4, j1, PZMCP
  jmul j4, j4, j3
  jsub j2, j2, j4
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, PZMC
  jadd j2, j2, j3
  jld j2, j2, 0
  jret

; The bits being read (PZRB, from bit PZRP), the lowest first. One -> j2. Uses j1-j4.
zr_bit:
  jldi j1, 0
  jld j3, j1, PZRP
  jldi j4, 3
  jshr j2, j3, j4
  jld j4, j1, PZRB
  jadd j2, j2, j4
  jldb j2, j2, 0
  jldi j4, 7
  jand j4, j3, j4
  jshr j2, j2, j4
  jldi j4, 1
  jand j2, j2, j4
  jadd j3, j3, j4
  jst j3, j1, PZRP
  jret

; j3 bits -> j2, the lowest first. Uses j1-j7.
zr_get:
  jldi j1, 0
  jldi j5, 0
  jldi j6, 0
  jadd j7, j3, j1
  jwhile j7
    jcall zr_bit
    jshl j2, j2, j6
    jor j5, j5, j2
    jldi j2, 1
    jadd j6, j6, j2
    jsub j7, j7, j2
  jwend
  jadd j2, j5, j1
  jret

; A number in unary (ones to a zero) -> j2. Uses j1-j5.
zr_unary:
  jldi j5, 0
zru_lap:
  jcall zr_bit
  jjz j2, zru_done
  jldi j2, 1
  jadd j5, j5, j2
  jjmp zru_lap
zru_done:
  jadd j2, j5, j1
  jret

; A number in Elias gamma -> j2. Uses j1-j7.
zr_gamma:
  jcall zr_unary
  jldi j1, 0
  jst j2, j1, PZV2
  jadd j3, j2, j1
  jcall zr_get
  jldi j1, 0
  jld j3, j1, PZV2
  jldi j4, 1
  jshl j4, j4, j3
  jor j2, j2, j4
  jret

; A number in Rice of PZRK -> j2. Uses j1-j7.
zr_rice:
  jcall zr_unary
  jldi j1, 0
  jst j2, j1, PZV2
  jld j3, j1, PZRK
  jcall zr_get
  jldi j1, 0
  jld j3, j1, PZV2
  jld j4, j1, PZRK
  jshl j3, j3, j4
  jor j2, j2, j3
  jret
