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
; 6 bytes) and S_SELF (its own program, S_SELFN bytes), includes carpeta.inc, and keeps away from 1900h-1ACFh and 3100h-31DFh.
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
PZLBR = 1A30h                   ; a room for a piece's label
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
PZEV  = 3100h                   ; the silhouettes of the word just read: its house verdict, its buildings, its limits
PZEB  = 3108h
PZEK  = 3110h
LGR   = 3420h                   ; languages: the books' records, how many, the language chosen, by language its words;
LGN   = 3428h                   ; walking
LGQ   = 3430h
LGS   = 3438h
LGT1  = 3440h
LGT2  = 3448h
LGT3  = 3450h
LGT4  = 3458h
LGT5  = 3460h
LGT6  = 3468h
LGT7  = 3470h
LGT8  = 3478h
LGM   = 3480h                   ; every two books' share; by language a weight; changed in a pass; passes
LGW   = 3488h
LGC   = 3490h
LGP   = 3498h
PZRD  = 3400h                   ; the books this round read again (by their bytes' print {key}): their rules read it
PZWL  = 3120h                   ; the silhouettes summed over the library: by word and limit how many of its buildings
PZLG  = 3140h                   ; that limit closes {key, count}; by limit {its print, the buildings it closes, -}; all
PZNBL = 3160h                   ; the buildings; this book's limits by number (their prints), how many; a word's limits
PZBLM = 3168h                   ; just read {number, count} and how many; temporaries
PZBLN = 3170h
PZEL  = 3178h
PZELN = 3180h
PZT1  = 3188h
PZT2  = 3190h
PZT3  = 3198h
PZT4  = 31A0h
PZT5  = 31A8h
PZT6  = 31B0h
PZHB  = 31B8h                   ; a word looked for as the library keeps it (pz_hide): 8 bytes; the words walked so,
PZHT  = 31C0h                   ; by the print of those bytes {key} (a table that grows)

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
  jcall lg_scan                 ; (the languages first: the walk reads only the books of its own)
  jldi j2, PZRD
  jldi j3, 8
  jcall pl_new
  jldi j2, PZOCC                ; (the counts of every word, from the nests: {print, times, the house's verdict weighed,
  jldi j3, 40                   ; buildings, times the book took it for its switch of the no})
  jcall pl_new
  jldi j2, PZWL                 ; ({key, buildings, the word's print, the limit's})
  jldi j3, 32
  jcall pl_new
  jldi j2, PZLG
  jldi j3, 24
  jcall pl_new
  jldi j1, 0
  jst j1, j1, PZNBL
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
    jcall lg_ok
    jjz j2, cw_skip
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

; The library's rules counted in the question's language (Capitan: "a dictionary manual for each language, its
; punctuation included"): of the words of that language (LNG, by their prints: PLB), the buildings each limit closes
; (LTB) and all their buildings (LTN). Weighed by words (a building counts once for each word of it the reading has),
; not by buildings as the library's own count: the library keeps no language of its buildings. Uses j1-j14.
lg_tot:
  jldi j1, 0
  jst j1, j1, LTN
  jld j2, j1, LNQ
  jjz j2, lgt_done
  jld j2, j1, PZWL              ; (no walk: no silhouettes of the library)
  jjz j2, lgt_done
  jldi j2, LTB
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jld j9, j1, PZWL
  jld j10, j1, PZWL + 8
  jldi j2, 1
  jadd j10, j10, j2
  lgt_lap:
    jldi j1, 0
    jjz j10, lgt_done
    jld j2, j9, 0
    jjz j2, lgt_next
    jst j9, j1, LN1
    jst j10, j1, LN2
    jld j5, j9, 16              ; its word's language
    jldi j2, PLB
    jcall pl_find
    jldi j1, 0
    jld j9, j1, LN1
    jld j10, j1, LN2
    jld j2, j4, 0
    jjz j2, lgt_next
    jld j2, j4, 8
    jld j3, j1, LNQ
    jsub j2, j2, j3
    jjnz j2, lgt_next
    jld j2, j9, 8
    jld j3, j1, LTN
    jadd j3, j3, j2
    jst j3, j1, LTN
    jld j5, j9, 24
    jldi j2, LTB
    jcall pl_take
    jldi j1, 0
    jld j9, j1, LN1
    jld j10, j1, LN2
    jld j2, j4, 8
    jld j3, j9, 8
    jadd j2, j2, j3
    jst j2, j4, 8
  lgt_next:
    jld j2, j1, PZWL + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp lgt_lap
lgt_done:
  jldi j1, 0
  jret

; The buildings limit entry j9 of PZLG closes -> j2: in the question's language when it has one (LTB), else over the
; library. Uses j1-j8 (j9, j10 kept).
lg_closes:
  jldi j1, 0
  jld j2, j1, LTN
  jjz j2, lgc_lib
  jld j5, j9, 0
  jldi j2, LTB
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, lgc_none
  jld j2, j4, 8
  jret
lgc_none:
  jldi j2, 0
  jret
lgc_lib:
  jld j2, j9, 8
  jret

; The word of print j5 (number PZK) noted with its language (PLB), when the question has one. Uses j1-j8 (j5 kept).
lg_print:
  jldi j1, 0
  jld j2, j1, LNQ
  jjz j2, lgp_done
  jst j5, j1, LNY
  jld j2, j1, PLB
  jjnz j2, lgp_have
  jldi j2, PLB
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jld j5, j1, LNY
lgp_have:
  jldi j2, PLB
  jcall pl_take
  jldi j1, 0
  jld j2, j1, PZK
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, LNG
  jadd j2, j2, j3
  jld j2, j2, 0
  jst j2, j4, 8
  jld j5, j1, LNY
lgp_done:
  jldi j1, 0
  jret

; The languages of the library (Capitan, 2026-11-07: "the Steam one speaks English: other rules; rules by
; language"). Each book's base vocabulary comes in its index (comer.jsm, vc_base). Two books speak the same language
; when each is the other's closest by the share of their base vocabularies in common (both choose each other: a chain
; of near ones would join every book, as the families did); a language is what is joined so. The walk's words choose
; the language of this reading: the one whose books' vocabularies hold the most of them. Records at LGR, LGN of them,
; each {its book's print, its vocabulary, how many, its root, its closest, the share} (48 bytes); LGQ the language
; chosen (its root; -1 none). Uses j1-j14.
lg_scan:
  jldi j1, 0
  jldi j2, -1
  jst j2, j1, LGQ
  jst j1, j1, LGN
  jld j11, j1, PZLSTN
  jldi j2, 48
  jmul j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LGR
  jld j9, j1, PZLST
  jld j10, j1, PZLSTN
  jst j9, j1, LGT1
  jst j10, j1, LGT2
  lgs_nest:
    jldi j1, 0
    jld j10, j1, LGT2
    jjz j10, lgs_near
    jld j9, j1, LGT1
    jcall pz_nest
    jjz j2, lgs_next
    jld j9, j1, LGT1
    jldi j11, 8
    jadd j11, j9, j11
    jld j12, j9, 0
    jcall pz_file
    jcall lg_vocab
  lgs_next:
    jldi j1, 0
    jld j9, j1, LGT1
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jst j9, j1, LGT1
    jld j10, j1, LGT2
    jldi j2, 1
    jsub j10, j10, j2
    jst j10, j1, LGT2
    jjmp lgs_nest
lgs_near:                       ; every two books' share, once (LGM, by two of them)
  jld j11, j1, LGN
  jmul j11, j11, j11
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LGM
  jld j11, j1, LGN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LGW
  jst j1, j1, LGT3
  lgn_i:
    jldi j1, 0
    jld j2, j1, LGT3
    jld j3, j1, LGN
    jsub j3, j2, j3
    jjz j3, lgs_cw
    jst j1, j1, LGT4
    lgn_j:
      jldi j1, 0
      jld j2, j1, LGT4
      jld j3, j1, LGN
      jsub j3, j2, j3
      jjz j3, lgn_inext
      jld j3, j1, LGT3
      jsub j3, j2, j3
      jjz j3, lgn_jnext
      jcall lg_share
      jldi j1, 0
      jld j3, j1, LGT3
      jld j4, j1, LGN
      jmul j3, j3, j4
      jld j4, j1, LGT4
      jadd j3, j3, j4
      jldi j4, 3
      jshl j3, j3, j4
      jld j4, j1, LGM
      jadd j3, j3, j4
      jst j2, j3, 0
    lgn_jnext:
      jldi j1, 0
      jld j2, j1, LGT4
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, LGT4
      jjmp lgn_j
  lgn_inext:
    jld j2, j1, LGT3
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LGT3
    jjmp lgn_i
lgs_cw:                         ; each book takes the language that weighs the most among the books it shares with
  jst j1, j1, LGP               ; (Chinese Whispers over books: a book speaks one language), until none changes
  lgc_pass:
    jldi j1, 0
    jst j1, j1, LGC
    jst j1, j1, LGT3
    lgc_i:
      jldi j1, 0
      jld j2, j1, LGT3
      jld j3, j1, LGN
      jsub j3, j2, j3
      jjz j3, lgc_passed
      jldi j9, 0                ; (its neighbours' weights by language, at LGW)
      lgc_j:
        jld j3, j1, LGN
        jsub j3, j9, j3
        jjz j3, lgc_best
        jld j2, j1, LGT3
        jld j4, j1, LGN
        jmul j2, j2, j4
        jadd j2, j2, j9
        jldi j4, 3
        jshl j2, j2, j4
        jld j4, j1, LGM
        jadd j2, j2, j4
        jld j5, j2, 0
        jjz j5, lgc_jnext
        jldi j4, 48
        jmul j4, j9, j4
        jld j6, j1, LGR
        jadd j4, j4, j6
        jld j4, j4, 24
        jldi j6, 3
        jshl j4, j4, j6
        jld j6, j1, LGW
        jadd j4, j4, j6
        jld j6, j4, 0
        jadd j6, j6, j5
        jst j6, j4, 0
      lgc_jnext:
        jldi j2, 1
        jadd j9, j9, j2
        jjmp lgc_j
    lgc_best:
      jldi j9, 0                ; (the most, the smaller of equals; LGW back to 0)
      jldi j11, 0
      jldi j12, -1
      lgc_b:
        jld j3, j1, LGN
        jsub j3, j9, j3
        jjz j3, lgc_have
        jldi j3, 3
        jshl j3, j9, j3
        jld j4, j1, LGW
        jadd j3, j3, j4
        jld j4, j3, 0
        jst j1, j3, 0
        jsub j5, j11, j4
        jldi j6, 63
        jsar j5, j5, j6
        jjz j5, lgc_bnext
        jadd j11, j4, j1
        jadd j12, j9, j1
      lgc_bnext:
        jldi j2, 1
        jadd j9, j9, j2
        jjmp lgc_b
    lgc_have:
      jldi j3, 63
      jsar j3, j12, j3
      jjnz j3, lgc_inext        ; (it shares with none: its own)
      jld j2, j1, LGT3
      jldi j3, 48
      jmul j3, j2, j3
      jld j4, j1, LGR
      jadd j3, j3, j4
      jld j4, j3, 24
      jsub j4, j4, j12
      jjz j4, lgc_inext
      jst j12, j3, 24
      jld j2, j1, LGC
      jldi j4, 1
      jadd j2, j2, j4
      jst j2, j1, LGC
    lgc_inext:
      jldi j1, 0
      jld j2, j1, LGT3
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, LGT3
      jjmp lgc_i
  lgc_passed:
    jld j2, j1, LGP
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LGP
    jld j3, j1, LGC
    jjz j3, lgs_ask
    jld j3, j1, LGN             ; (never more passes than books)
    jsub j3, j2, j3
    jjnz j3, lgc_pass
lgs_ask:                        ; the walk's words: each language, how many of them its books' vocabularies hold
  jld j11, j1, LGN
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LGS              ; by root {how many words, the last word counted}
  jld j2, j1, PZCAM
  jst j2, j1, LGT1
  jst j2, j1, LGT6              ; (where the word walked starts)
  jld j2, j1, PZCAMN
  jst j2, j1, LGT2
  jst j1, j1, LGT7              ; (its number)
  lga_byte:
    jldi j1, 0
    jld j2, j1, LGT2
    jjz j2, lga_pick
    jld j9, j1, LGT1
    jldb j3, j9, 0
    jldi j4, 1
    jadd j9, j9, j4
    jst j9, j1, LGT1
    jsub j2, j2, j4
    jst j2, j1, LGT2
    jldi j4, 10
    jsub j3, j3, j4
    jjnz j3, lga_byte
    jld j3, j1, LGT6            ; a word: its print
    jsub j4, j9, j3
    jldi j5, 1
    jsub j4, j4, j5
    jst j9, j1, LGT6
    jjz j4, lga_byte
    jcall pz_printraw
    jldi j1, 0
    jst j5, j1, LGT8
    jld j2, j1, LGT7
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LGT7
    jcall lg_word
    jjmp lga_byte
lga_pick:
  jldi j2, -1
  jst j2, j1, LGQ
  jldi j11, 0
  jldi j9, 0
  jld j10, j1, LGN
  lgp_lap:
    jjz j10, lgs_done
    jldi j3, 4
    jshl j3, j9, j3
    jld j4, j1, LGS
    jadd j3, j3, j4
    jld j3, j3, 0
    jsub j4, j11, j3
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, lgp_next
    jadd j11, j3, j1
    jst j9, j1, LGQ
  lgp_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
    jjmp lgp_lap
lgs_done:
  jldi j1, 0
  jret

; The word of print LGT8 (number LGT7) counted once for each language whose books' vocabularies hold it. Uses j1-j14.
lg_word:
  jldi j1, 0
  jldi j9, 0
  lgw_lap:
    jldi j1, 0
    jld j2, j1, LGN
    jsub j2, j9, j2
    jjz j2, lgw_done
    jldi j3, 48
    jmul j3, j9, j3
    jld j4, j1, LGR
    jadd j3, j3, j4
    jld j5, j3, 8
    jld j6, j3, 16
    jld j7, j1, LGT8
    lgw_v:
      jjz j6, lgw_next
      jld j8, j5, 0
      jsub j8, j8, j7
      jjz j8, lgw_has
      jldi j8, 8
      jadd j5, j5, j8
      jldi j8, 1
      jsub j6, j6, j8
      jjmp lgw_v
  lgw_has:
    jadd j2, j9, j1
    jcall lg_root
    jldi j3, 4
    jshl j3, j2, j3
    jld j4, j1, LGS
    jadd j3, j3, j4
    jld j4, j3, 8
    jld j5, j1, LGT7
    jsub j4, j4, j5
    jjz j4, lgw_next
    jst j5, j3, 8
    jld j4, j3, 0
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j3, 0
  lgw_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp lgw_lap
lgw_done:
  jldi j1, 0
  jret

; The language of record j2 -> j2. Uses j1-j4.
lg_root:
  jldi j1, 0
  jldi j3, 48
  jmul j3, j2, j3
  jld j4, j1, LGR
  jadd j3, j3, j4
  jld j2, j3, 24
  jret

; The share of the vocabularies of records LGT3 and LGT4 -> j2 (1000 a whole; 0 if either has none). Uses j1-j10.
lg_share:
  jldi j1, 0
  jld j2, j1, LGT3
  jldi j3, 48
  jmul j2, j2, j3
  jld j4, j1, LGR
  jadd j2, j2, j4
  jld j5, j1, LGT4
  jmul j5, j5, j3
  jadd j5, j5, j4
  jld j6, j2, 8                 ; this one's prints, how many; the other's
  jld j7, j2, 16
  jld j8, j5, 8
  jld j9, j5, 16
  jjz j7, lgsh_zero
  jjz j9, lgsh_zero
  jldi j10, 0                   ; (in common)
  jst j7, j1, LGT5
  lgsh_a:
    jjz j7, lgsh_count
    jld j2, j6, 0
    jadd j3, j8, j1
    jadd j4, j9, j1
    lgsh_b:
      jjz j4, lgsh_anext
      jld j5, j3, 0
      jsub j5, j5, j2
      jjz j5, lgsh_hit
      jldi j5, 8
      jadd j3, j3, j5
      jldi j5, 1
      jsub j4, j4, j5
      jjmp lgsh_b
    lgsh_hit:
      jldi j5, 1
      jadd j10, j10, j5
  lgsh_anext:
    jldi j5, 8
    jadd j6, j6, j5
    jldi j5, 1
    jsub j7, j7, j5
    jjmp lgsh_a
lgsh_count:
  jjz j10, lgsh_zero
  jld j2, j1, LGT5
  jadd j2, j2, j9
  jsub j2, j2, j10
  jldi j3, 1000
  jmul j10, j10, j3
  jdiv j2, j10, j2
  jret
lgsh_zero:
  jldi j2, 0
  jret

; The index just read (PZFR, PZFRN) as a record: its book's print and its base vocabulary (copied: the file's room is
; the next file's), when it has one (its end: the prints, how many, its mark). Uses j1-j14.
lg_vocab:
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 176
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, lgv_done
  jld j9, j1, PZFR
  jld j2, j9, 0
  jldi j3, 7
  jsub j2, j2, j3
  jjnz j2, lgv_done
  jld j2, j1, LGN               ; its record
  jldi j3, 48
  jmul j2, j2, j3
  jld j3, j1, LGR
  jadd j12, j2, j3
  jld j2, j9, 152
  jst j2, j12, 0
  jst j1, j12, 8
  jst j1, j12, 16
  jld j2, j1, LGN
  jst j2, j12, 24
  jst j1, j12, 32
  jst j1, j12, 40
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, LGN
  jld j2, j1, PZFRN
  jadd j9, j9, j2
  jldi j2, 8
  jsub j9, j9, j2
  jld j2, j9, 0
  jldi j3, 0
  jshi j3, 7663h
  jshi j3, 6162h
  jshi j3, 756Ch
  jshi j3, 6176h
  jsub j2, j2, j3
  jjnz j2, lgv_done
  jldi j2, 8
  jsub j9, j9, j2
  jld j10, j9, 0                ; how many, inside the file
  jldi j3, 63
  jsar j3, j10, j3
  jjnz j3, lgv_done
  jldi j3, 3
  jshl j11, j10, j3
  jld j3, j1, PZFRN
  jldi j4, 176
  jsub j3, j3, j4
  jsub j3, j3, j11
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, lgv_done
  jsub j9, j9, j11
  jst j9, j1, LGT5
  jst j10, j1, LGT6
  jst j12, j1, LGT7
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jld j12, j1, LGT7
  jst j13, j12, 8
  jld j10, j1, LGT6
  jst j10, j12, 16
  jld j9, j1, LGT5
  lgv_copy:
    jjz j10, lgv_done
    jld j2, j9, 0
    jst j2, j13, 0
    jldi j2, 8
    jadd j9, j9, j2
    jadd j13, j13, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp lgv_copy
lgv_done:
  jldi j1, 0
  jret

; j2 = 1 if the index just read (PZFR) may be read again in this reading: no language chosen, a book of no known
; vocabulary (an index of before), or a book of the language chosen. Uses j1-j8.
lg_ok:
  jldi j1, 0
  jld j2, j1, LGQ
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, lgo_yes
  jld j9, j1, PZFR
  jld j5, j9, 152
  jldi j6, 0
  lgo_find:
    jld j2, j1, LGN
    jsub j2, j6, j2
    jjz j2, lgo_yes
    jldi j3, 48
    jmul j3, j6, j3
    jld j4, j1, LGR
    jadd j3, j3, j4
    jld j4, j3, 0
    jsub j4, j4, j5
    jjz j4, lgo_have
    jldi j2, 1
    jadd j6, j6, j2
    jjmp lgo_find
lgo_have:
  jld j4, j3, 16
  jjz j4, lgo_yes
  jadd j2, j6, j1
  jcall lg_root
  jld j3, j1, LGQ
  jsub j2, j2, j3
  jjnz j2, lgo_no
lgo_yes:
  jldi j1, 0
  jldi j2, 1
  jret
lgo_no:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if the index just read (PZIX) is of a book this round reads again (PZRD), or if the round reads none by the
; clues (the first, the question only: then every book counts). Uses j1-j8.
pz_read_it:
  jldi j1, 0
  jld j2, j1, PZRD
  jjz j2, pri_yes
  jld j9, j1, PZIX
  jld j5, j9, 152
  jjnz j5, pri_key
  jldi j5, 1
pri_key:
  jldi j2, PZRD
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, pri_no
pri_yes:
  jldi j2, 1
  jret
pri_no:
  jldi j2, 0
  jret

; j2 = 1 if the label listed at j9 ({its bytes, its bytes padded}) is an index of the library: "tablero/pistas" and
; more. Uses j1-j5.
pz_nest:
  jldi j1, 0
  jld j2, j9, 0
  jldi j3, 15
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, pn_no
  jld j3, j9, 8                 ; "tablero/"
  jldi j4, 2F6Fh
  jshi j4, 7265h
  jshi j4, 6C62h
  jshi j4, 6174h
  jsub j3, j3, j4
  jjnz j3, pn_no
  jld j3, j9, 16                ; "pistas"
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
  jldi j2, PZHT
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jld j2, j1, PZCAM             ; each word walked: the piece where it is, and its hidden bytes known
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
  jldi j3, PZHB
  jldi j4, 8
  jcall pz_printat
  jldi j2, PZHT
  jcall pl_take
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
  jldi j2, 1                    ; (and a page break when the book ends)
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PZBUF
  jst j1, j1, PZOFF
  jldi j10, 37                  ; its book, where it is
  jld j11, j1, PZIX
  jldi j2, 160
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
  jldi j1, 0                    ; the book ends: a page break, so the reading knows where each book starts (each one a
  jld j2, j1, PZOFF             ; world of its own: Capitan, "it choked on the project's data")
  jld j3, j1, PZBUF
  jadd j3, j3, j2
  jldi j4, 12
  jstb j4, j3, 0
  jldi j4, 1
  jadd j2, j2, j4
  jst j2, j1, PZOFF
  jld j3, j1, PZBUF
  jcall pz_out
  jldi j1, 0                    ; (a book this round reads: its silhouettes are this reading's rules)
  jld j9, j1, PZIX
  jld j5, j9, 152
  jjnz j5, prd_key
  jldi j5, 1
prd_key:
  jldi j2, PZRD
  jcall pl_take
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
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
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
; new, its answer is said and "camino" goes. "libro" stays: what it read again is what a reasoning over it reads next
; (the meaning, sentido.jsm, in the console), and a new question starts from nothing (the console clears both).
; Uses j1-j14.
clue_end:
  jldi j1, 0
  jld j2, j1, PZON
  jjz j2, ce_done
  jld j2, j1, PZNEWN
  jjnz j2, ce_again
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
  jld j3, j1, PZHP
  jld j4, j1, PZHN
; The print of the j4 bytes at j3 -> j5. Uses j1, j3-j7.
pz_printat:
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

; The word at PZHP (PZHN bytes) as the library keeps it (comer.jsm, hide_words): the eight bytes of the print of its
; letters, the lowest first, at PZHB. The library holds no letters of a word: it is found by this. Uses j1-j7.
pz_hide:
  jldi j1, 0
  jld j3, j1, PZHP
  jld j4, j1, PZHN
  jcall pz_printraw
  jldi j3, PZHB
  jldi j4, 8
  jwhile j4
    jstb j5, j3, 0
    jldi j7, 8
    jshr j5, j5, j7
    jldi j7, 1
    jadd j3, j3, j7
    jsub j4, j4, j7
  jwend
  jret

; The key of the word at PZHP (PZHN bytes) among the library's words: the print of its hidden bytes, as pz_print of a
; word read in a piece. Uses j1-j7.
pz_hprint:
  jcall pz_hide
  jldi j3, PZHB
  jldi j4, 8
  jjmp pz_printat

; FNV-1a of the j4 bytes at j3, as it is (it may be 0) -> j5. Uses j1, j3-j7.
pz_printraw:
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
  jwhile j4
    jldb j7, j3, 0
    jxor j5, j5, j7
    jmul j5, j5, j6
    jldi j7, 1
    jadd j3, j3, j7
    jsub j4, j4, j7
  jwend
  jret

; The word at PZHP (PZHN bytes), just read in a piece, adds its times (PZEO). Uses j1-j8.
pz_count:
  jcall pz_print
  jldi j1, 0
  jst j5, j1, PZT1
  jldi j2, PZOCC
  jcall pl_take
  jldi j1, 0
  jld j3, j1, PZEO
  jld j2, j4, 8
  jadd j2, j2, j3
  jst j2, j4, 8
  jld j5, j1, PZEV              ; its silhouettes: the verdict weighed by its times (-1 furniture, 0, 1 foundation; 3 a
  jldi j6, 3                    ; foundation the book took for its switch: its times as switch too)
  jsub j6, j5, j6
  jjnz j6, pzk_noswitch
  jld j6, j4, 32
  jadd j6, j6, j3
  jst j6, j4, 32
  jldi j5, 2
pzk_noswitch:
  jldi j6, 1
  jsub j5, j5, j6
  jmul j5, j5, j3
  jld j2, j4, 16
  jadd j2, j2, j5
  jst j2, j4, 16
  jld j2, j4, 24                ; its buildings
  jld j3, j1, PZEB
  jadd j2, j2, j3
  jst j2, j4, 24
  jst j1, j1, PZT2              ; and each limit's
  pzk_lim:
    jldi j1, 0
    jld j2, j1, PZT2
    jld j3, j1, PZELN
    jsub j3, j2, j3
    jjz j3, pzk_done
    jldi j3, 4
    jshl j3, j2, j3
    jld j4, j1, PZEL
    jadd j3, j3, j4
    jld j4, j3, 0
    jld j6, j3, 8
    jst j6, j1, PZT3
    jldi j3, 3
    jshl j4, j4, j3
    jld j3, j1, PZBLM
    jadd j4, j4, j3
    jld j3, j4, 0
    jst j3, j1, LNL
    jld j2, j1, PZT1
    jcall pz_wlkey
    jldi j2, PZWL
    jcall pl_take
    jldi j1, 0
    jld j2, j1, PZT1
    jst j2, j4, 16
    jld j2, j1, LNL
    jst j2, j4, 24
    jld j2, j4, 8
    jld j3, j1, PZT3
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j1, PZT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PZT2
    jjmp pzk_lim
pzk_done:
  jldi j1, 0
  jret

; The key of word print j2 and limit print j3 (never 0) -> j5. Uses j1, j4, j5.
pz_wlkey:
  jldi j1, 0
  jld j4, j1, FNVP
  jmul j5, j2, j4
  jxor j5, j5, j3
  jmul j5, j5, j4
  jjnz j5, pzw_done
  jldi j5, 1
pzw_done:
  jret

; The index at PZIX: its limits' prints by number (PZBLM, PZBLN of them) and room for a word's limits (PZEL). Uses
; j1-j14.
pz_blims:
  jldi j1, 0
  jld j9, j1, PZIX
  jld j2, j9, 144
  jadd j9, j9, j2
  jld j2, j9, 0
  jst j2, j1, PZBLN
  jldi j3, 4
  jshl j11, j2, j3
  jldi j3, 16
  jadd j11, j11, j3
  jcall room
  jldi j1, 0
  jst j13, j1, PZEL
  jld j11, j1, PZBLN
  jldi j3, 3
  jshl j11, j11, j3
  jldi j3, 8
  jadd j11, j11, j3
  jcall room
  jldi j1, 0
  jst j13, j1, PZBLM
  jld j9, j1, PZIX
  jld j2, j9, 144
  jadd j9, j9, j2
  jldi j2, 16
  jadd j9, j9, j2
  jst j1, j1, PZT4
  pzb_lim:
    jldi j1, 0
    jld j2, j1, PZT4
    jld j3, j1, PZBLN
    jsub j3, j2, j3
    jjz j3, pzb_lims
    jst j9, j1, PZT5
    jld j2, j9, 8
    jst j2, j1, PZHN
    jldi j3, 16
    jadd j3, j9, j3
    jst j3, j1, PZHP
    jcall pz_print
    jldi j1, 0
    jld j2, j1, PZT4
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, PZBLM
    jadd j3, j3, j4
    jst j5, j3, 0
    jld j9, j1, PZT5
    jld j2, j9, 8
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 16
    jadd j2, j2, j3
    jadd j9, j9, j2
    jld j2, j1, PZT4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PZT4
    jjmp pzb_lim
pzb_lims:
  jldi j1, 0
  jret

; The index at PZIX adds its limits to the library's: each one's buildings (by its print), and all of them. Uses j1-j14.
pz_lsum:
  jldi j1, 0
  jld j9, j1, PZIX
  jld j2, j9, 144
  jadd j9, j9, j2
  jld j2, j9, 8
  jld j3, j1, PZNBL
  jadd j3, j3, j2
  jst j3, j1, PZNBL
  jldi j2, 16
  jadd j9, j9, j2
  jst j1, j1, PZT4
  pzl_lim:
    jldi j1, 0
    jld j2, j1, PZT4
    jld j3, j1, PZBLN
    jsub j3, j2, j3
    jjz j3, pzl_done
    jst j9, j1, PZT5
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, PZBLM
    jadd j3, j3, j4
    jld j5, j3, 0
    jldi j2, PZLG
    jcall pl_take
    jldi j1, 0
    jld j9, j1, PZT5
    jld j2, j4, 8
    jld j3, j9, 0
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j9, 8
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 16
    jadd j2, j2, j3
    jadd j9, j9, j2
    jld j2, j1, PZT4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PZT4
    jjmp pzl_lim
pzl_done:
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
    jcall pz_read_it              ; (only the books it reads again: each reading with its own books' rules)
    jjz j2, cct_skip
    jcall pz_lsum
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
    jcall pz_hprint
    jcall lg_print              ; (its language, by its print)
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
  jcall lg_tot                  ; (the rules counted in the question's language)
  jcall pz_silwrite             ; and the reading's silhouettes, decided over the library, for the meaning
cc_done:
  jldi j1, 0
  jret

; The index just read (PZFR, PZFRN): if it is one (version 6), PZIX, a pointer to each piece in its list (PZPP) and
; a byte by piece, 0, for the pieces it needs (PZNEED) -> j2 = 1; j2 = 0 if it is not. Uses j1-j14.
pz_index:
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 160
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, pzi_no
  jld j9, j1, PZFR
  jld j2, j9, 0
  jldi j3, 7
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
  jcall pz_blims
  jldi j2, 1
  jret
pzi_no:
  jldi j1, 0
  jldi j2, 0
  jret

; The piece where the word at PZHP (PZHN bytes) is, if it is in the book: the last whose first word is not after it
; (halving the list) -> j2, and marked needed. Uses j1-j8.
pz_find:
  jcall pz_hide
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

; j2 = 1 if the word at PZHP (PZHN bytes), hidden (PZHB), goes before the j6 bytes at j5 (byte by byte; a word before what it starts).
; Uses j1-j8.
pz_less:
  jldi j1, 0
  jldi j3, PZHB
  jldi j4, 8
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

; The label of piece j2 of the index at PZIX: "tablero/pieza", the print of its book's bytes in hex, "-" and j2 in
; decimal, at PZLBR (64 bytes: 13 + 16 + 1 and the twenty digits of the largest number) -> j2 its bytes. Uses j1-j14.
pz_label:
  jldi j1, 0
  jst j2, j1, PZV
  jld j3, j1, PZLBR
  jjnz j3, pzb_room
  jldi j11, 64
  jcall room
  jldi j1, 0
  jst j13, j1, PZLBR
pzb_room:
  jld j3, j1, PZLBR
  jldi j4, 2F6Fh                ; "tablero/"
  jshi j4, 7265h
  jshi j4, 6C62h
  jshi j4, 6174h
  jst j4, j3, 0
  jldi j4, 112
  jstb j4, j3, 8
  jldi j4, 105
  jstb j4, j3, 9
  jldi j4, 101
  jstb j4, j3, 10
  jldi j4, 122
  jstb j4, j3, 11
  jldi j4, 97
  jstb j4, j3, 12
  jld j5, j1, PZIX
  jld j5, j5, 152
  jldi j4, 28
  jadd j3, j3, j4
  jldi j4, 16
  jwhile j4
    jldi j6, 15
    jand j6, j5, j6
    jldi j7, 10
    jsub j7, j6, j7
    jldi j8, 63
    jsar j7, j7, j8
    jldi j8, 48                 ; a digit, or a letter past nine
    jjnz j7, pzb_hex
    jldi j8, 87
  pzb_hex:
    jadd j6, j6, j8
    jstb j6, j3, 0
    jldi j6, 4
    jshr j5, j5, j6
    jldi j6, 1
    jsub j3, j3, j6
    jsub j4, j4, j6
  jwend
  jld j3, j1, PZLBR
  jldi j4, 45
  jstb j4, j3, 29
  jld j2, j1, PZV
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
  jldi j3, 30
  jadd j7, j5, j3
  jld j3, j1, PZLBR
  jldi j4, 30
  jadd j3, j3, j4
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
  jldi j1, 0
  jadd j12, j2, j1
  jld j11, j1, PZLBR
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
  jcall pz_print                ; (a word of the piece is its hidden bytes: walked if a word walked hides so)
  jldi j2, PZHT
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, pzv_walked
  jldi j2, 1
pzv_walked:
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
  jldi j3, 2                    ; its silhouettes (comer.jsm): the house's verdict, its buildings, and each limit that
  jcall zr_get                  ; closes some of them with how many (each passed by here)
  jldi j1, 0
  jst j2, j1, PZEV
  jcall zr_gamma
  jldi j1, 0
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZEB
  jcall zr_gamma
  jldi j1, 0
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, PZEK
  jst j1, j1, PZELN
  pze_lims:
    jldi j1, 0
    jld j2, j1, PZEK
    jjz j2, pze_limd
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, PZEK
    jcall zr_gamma
    jldi j1, 0
    jldi j3, 1
    jsub j2, j2, j3
    jld j3, j1, PZELN
    jldi j4, 4
    jshl j3, j3, j4
    jld j4, j1, PZEL
    jadd j3, j3, j4
    jst j2, j3, 0
    jcall zr_gamma
    jldi j1, 0
    jld j3, j1, PZELN
    jldi j4, 4
    jshl j3, j3, j4
    jld j4, j1, PZEL
    jadd j3, j3, j4
    jst j2, j3, 8
    jld j3, j1, PZELN
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, PZELN
    jjmp pze_lims
  pze_limd:
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

; The silhouettes of every word read, summed over the library, decided as the meaning (sentido.jsm) decides them, into
; the file "siluetas" (S_SIL) for it: each {its bytes, its letters padded, the house (1 foundation, -1 furniture, 0 not
; decided: the sign of its verdicts weighed by its times), 1 if it is an arrow (the limit that closes the most of its
; buildings closes most of them, two at least, and not most of the library's), 1 if it is the switch of the no (most
; of its times the books took it for one)}. Uses j1-j14.
pz_silwrite:
  jldi j1, 0
  jldi j2, 0
  jst j2, j1, PZT6              ; its bytes, then each word written
  jldi j2, 1
  jst j2, j1, PZT4
  psw_size:
    jldi j1, 0
    jld j2, j1, PZT4
    jld j3, j1, NV
    jsub j3, j2, j3
    jjz j3, psw_sized
    jcall pz_wfound
    jjz j2, psw_snext
    jld j2, j1, PZHN
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 32
    jadd j2, j2, j3
    jld j3, j1, PZT6
    jadd j3, j3, j2
    jst j3, j1, PZT6
  psw_snext:
    jld j2, j1, PZT4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PZT4
    jjmp psw_size
psw_sized:
  jld j11, j1, PZT6
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PZT5
  jst j13, j1, PZT3
  jldi j2, 1
  jst j2, j1, PZT4
  psw_word:
    jldi j1, 0
    jld j2, j1, PZT4
    jld j3, j1, NV
    jsub j3, j2, j3
    jjz j3, psw_file
    jcall pz_wfound
    jjz j2, psw_wnext
    jld j9, j1, PZT3
    jld j2, j1, PZHN
    jst j2, j9, 0
    jldi j3, 8
    jadd j9, j9, j3
    jld j3, j1, PZHP
    jld j4, j1, PZHN
    jwhile j4
      jldb j5, j3, 0
      jstb j5, j9, 0
      jldi j5, 1
      jadd j3, j3, j5
      jadd j9, j9, j5
      jsub j4, j4, j5
    jwend
    jld j9, j1, PZT3
    jld j2, j1, PZHN
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j9, j9, j2
    jadd j9, j9, j3
    jst j9, j1, PZT3
    jld j4, j1, PZT2              ; the house: the sign of the verdicts weighed
    jld j2, j4, 16
    jldi j3, 0
    jjz j2, psw_house
    jldi j3, 1
    jldi j5, 63
    jsar j5, j2, j5
    jjz j5, psw_house
    jldi j3, -1
  psw_house:
    jst j3, j9, 0
    jcall pz_warrow
    jldi j1, 0
    jld j9, j1, PZT3
    jst j2, j9, 8
    jld j4, j1, PZT2              ; its switch of the no: most of its times, the books took it for one
    jld j2, j4, 32
    jadd j2, j2, j2
    jld j3, j4, 8
    jsub j2, j3, j2
    jldi j3, 63
    jshr j2, j2, j3
    jst j2, j9, 16
    jldi j3, 24
    jadd j9, j9, j3
    jst j9, j1, PZT3
  psw_wnext:
    jldi j1, 0
    jld j2, j1, PZT4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PZT4
    jjmp psw_word
psw_file:
  jldi j10, 12
  jldi j11, S_SIL
  jldi j12, 8
  jcall ask
  jldi j10, 4
  jldi j11, S_SIL
  jldi j12, 8
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, psw_done
  jst j13, j1, PZT4
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, PZT5
  jld j12, j1, PZT6
  jcall ask
  jldi j1, 0
  jld j10, j1, PZT4
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
psw_done:
  jldi j1, 0
  jret

; Word PZT4 of the reading: its letters (PZHP, PZHN), and j2 = 1 with its place among the counts (PZT2) if the library
; has it. Uses j1-j8.
pz_wfound:
  jldi j1, 0
  jld j2, j1, PZT4
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
  jcall pz_hprint
  jldi j1, 0
  jst j5, j1, PZT1
  jldi j2, PZOCC
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, pwf_no
  jst j4, j1, PZT2
  jldi j2, 1
  jret
pwf_no:
  jldi j2, 0
  jret

; j2 = 1 if the word of print PZT1 (its counts at PZT2) is an arrow over the library: of every limit, the one that
; closes the most of its buildings closes most of them, two at least, and does not close most of the library's
; buildings. Uses j1-j14.
pz_warrow:
  jldi j1, 0
  jst j1, j1, PZT6 + 8          ; the most, and the buildings its limit closes
  jst j1, j1, PZT6 + 16
  jld j9, j1, PZLG              ; every limit of the library (its table's places)
  jld j10, j1, PZLG + 8
  jldi j2, 1
  jadd j10, j10, j2
  pwa_lim:
    jjz j10, pwa_decide
    jld j3, j9, 0
    jjz j3, pwa_next
    jst j9, j1, PZT6 + 24
    jst j10, j1, PZT6 + 32
    jld j2, j1, PZT1
    jcall pz_wlkey
    jldi j2, PZWL
    jcall pl_find
    jldi j1, 0
    jld j9, j1, PZT6 + 24
    jld j10, j1, PZT6 + 32
    jld j2, j4, 0
    jjz j2, pwa_next
    jld j2, j4, 8
    jld j3, j1, PZT6 + 8
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, pwa_next
    jst j2, j1, PZT6 + 8
    jcall lg_closes
    jst j2, j1, PZT6 + 16
  pwa_next:
    jld j2, j1, PZLG + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp pwa_lim
pwa_decide:
  jld j2, j1, PZT6 + 8          ; two at least
  jldi j3, 2
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, pwa_no
  jadd j2, j2, j2               ; most of its buildings
  jld j4, j1, PZT2
  jld j4, j4, 24
  jsub j3, j4, j2
  jldi j5, 63
  jsar j3, j3, j5
  jjz j3, pwa_no
  jld j2, j1, PZT6 + 16         ; and not most of the library's (of its language's, when asked in one)
  jadd j2, j2, j2
  jld j3, j1, LTN
  jjnz j3, pwa_lang
  jld j3, j1, PZNBL
pwa_lang:
  jsub j2, j2, j3
  jldi j4, 63
  jsar j2, j2, j4
  jjz j2, pwa_no
  jldi j2, 1
  jret
pwa_no:
  jldi j2, 0
  jret
