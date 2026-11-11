; Steps chained by their brackets (Capitan, 2026-11-08: "we do not need grandfather, only a mechanism: if a is father of
; b and b is father of c, then a is grandfather of c"; and his calculator, profundidad(): every symbol with its depth,
; the deepest solved first). It reads the house's "pares" ("Q:" a question, "O:" the sentences of its answer, "R:" the
; truth of a question no sentence answers, only for the judge) and:
;   - the steps: every read question (one with "O:" lines after it) is a case of its kind, the kind being its words with
;     its entity as a place: the word of it said by the most sentences of its answer (one only; the sentences that do
;     not say it are not the case's). A kind is a step when two cases or
;     more say it (what one says is a memory, what two say is a rule) and, among its answers' words, besides the
;     entity's, exactly one place changes from case to case: that one is where the answer is. The rest of the sentence
;     is the step's frame, and its two places say which way it goes (from the entity to the answer).
;   - the bracket: for every composed question (no "O:" after it) the longest step's head that begins it and the
;     longest end of a step's head that ends it (before its entity); what lies between is a bracket candidate. Of those
;     said by two, the bracket is the one that puts the most composed questions together (the one said most is not:
;     a question of three steps leaves "bracket, step, bracket" between, and when they are more, that would win).
;   - the answer: the composed question put together from the right, the deepest first (its entity; the end of a step;
;     the bracket; ... ; a step's whole head), and its steps run on the book's sentences, each step's answers the next
;     one's entities. No sentence of the book answers a composed question: what it says, it put together.
; It says every step, the bracket, and every composed question with what it said, the truth and 1 if they are the same
; ("-" when it has no truth: not judged, and not counted as right).
S_LIBRO  = 0                    ; (the texts lectura.inc asks for)
S_P      = 10h
S_NOBOOK = 20h
S_NOMEM  = 40h
S_PARES  = 80h
S_PASO   = 0C0h
S_CASOS  = 0E0h
S_ENPAL  = 100h
S_DE     = 140h
S_NOPASO = 160h
S_PAR    = 180h
S_LODIC  = 1A0h
S_COMPS  = 1C0h
S_NOPAR  = 1E0h
S_C      = 220h
S_DICE   = 240h
S_VERDAD = 260h
S_PASOS  = 280h
S_NOARMA = 2A0h
S_COMP   = 2C0h
S_ARMAN  = 2E0h
S_ACIER  = 300h
S_DICEN  = 320h
S_SINOR  = 340h
S_BAR    = 380h
S_ARMA   = 3A0h

PRB   = 1200h                   ; the file: its bytes, how many, the room's size, a handle
PRN   = 1208h
PRC   = 1210h
PRH   = 1218h
ZLN   = 1220h                   ; the lines: by line {kind (1 Q, 2 O, 3 R), its first word, how many, its start}, how many
ZNLN  = 1228h
ZWD   = 1230h                   ; the words: by word {print, start, bytes}, how many
ZNWD  = 1238h
ZTP   = 1240h                   ; the kinds: {key, question's words, entity's place, answer's words, entity's place in
ZNTP  = 1248h                   ; it, answer's place, a sentence of it, cases, bad, places that change, its question,
                                ; a step} 96 bytes each, how many
ZWT   = 1250h                   ; a word's text by print {print, start, bytes} (a growing table, 32 bytes)
ZGAP  = 1270h                   ; the bracket candidates {key, how many say it, a question, its first word, words}
ZEP   = 1290h                   ; (reading: where, the end, the line, a word's bytes)
ZEEND = 1298h
ZELR  = 12A0h
ZEWL  = 12A8h
ZOPR  = 12B0h                   ; the bracket: a question that says it, its first word, its words (-1: none), how many
ZOPS  = 12B8h
ZOPL  = 12C0h
ZOPC  = 12C8h
ZSA   = 12D0h                   ; the prints going through the steps, how many; the next ones, how many
ZSAN  = 12D8h
ZSB   = 12E0h
ZSBN  = 12E8h
ZSTP  = 12F0h                   ; a composed question's steps, the deepest first, how many
ZSTN  = 12F8h
ZLI   = 1300h                   ; (walking)
ZLK   = 1308h
ZQR   = 1310h                   ; the question, its first "O:" line, how many, its entity's place, its entity, its kind,
ZOR0  = 1318h                   ; its key
ZOM   = 1320h
ZSLP  = 1328h
ZENT  = 1330h
ZTPA  = 1338h
ZKEY  = 1340h
ZNCOMP = 1350h                  ; composed questions, put together, right, that said something
ZNARM = 1358h
ZNRT  = 1360h
ZNSD  = 1368h
ZT1   = 1370h                   ; (walking)
ZT2   = 1378h
ZT3   = 1380h
ZT4   = 1388h
ZT5   = 1390h
ZT6   = 1398h
ZTRR  = 13B8h                   ; the truth's line (0: none)
ZOK   = 13C0h
ZSLR  = 13C8h                   ; (saying words: the line, walking, the first, the end, the place said "_")
ZSLI  = 13D0h
ZSLF  = 13D8h
ZSLE  = 13E0h
ZSLS  = 13E8h
ZETI  = 13F0h                   ; (looking for a step: walking, the one found, the other one, a length, where it ends,
ZFT   = 13F8h                   ; the longest head, the longest end and its step)
ZFT2  = 1400h
ZES   = 1408h
ZEPOS = 1410h
ZOUTH = 1418h
ZINS  = 1420h
ZINT  = 1428h
ZGB   = 1430h                   ; (the bracket: the most put together, walking the candidates, the one, the winner;
ZGI   = 1438h                   ; how many one puts together)
ZGP   = 1440h
ZGW   = 1448h
ZGN   = 1450h

include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j11, S_PARES
jldi j12, 5
jcall en_read
jldi j1, 0
jld j2, j1, PRN
jjnz j2, en_go
jldi j1, S_NOBOOK
jcall puts
jjmp finish
en_go:
jcall en_lines
jcall en_learn
jcall en_rooms
jcall en_gaps
jcall en_answer
jjmp finish

; The house's file named by the j12 bytes at j11 -> PRB, PRN (0: none). Uses j1-j14.
en_read:
  jldi j1, 0
  jst j1, j1, PRN
  jldi j10, 4
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, enr_done
  jst j13, j1, PRH
  jldi j11, 1                   ; (64 KB to start)
  jldi j2, 16
  jshl j11, j11, j2
  jst j11, j1, PRC
  jcall room
  jldi j1, 0
  jst j13, j1, PRB
  jwhilez j3
    jld j11, j1, PRC
    jadd j11, j11, j11
    jcall room
    jldi j1, 0
    jld j3, j1, PRB
    jld j4, j1, PRN
    jldi j5, 0
    jwhile j6
      jadd j6, j3, j5
      jldb j6, j6, 0
      jadd j7, j13, j5
      jstb j6, j7, 0
      jldi j6, 1
      jadd j5, j5, j6
    jwcheck
      jsub j6, j5, j4
    jwend
    enr_moved:
    jst j13, j1, PRB
    jld j2, j1, PRC
    jadd j2, j2, j2
    jst j2, j1, PRC
  jwcheck
    jld j10, j1, PRH
    jldi j2, 32
    jshl j10, j10, j2
    jldi j2, 5
    jor j10, j10, j2
    jld j11, j1, PRB
    jld j2, j1, PRN
    jadd j11, j11, j2
    jld j12, j1, PRC
    jsub j12, j12, j2
    jcall ask
    jldi j1, 0
    jldi j2, 63
    jsar j2, j13, j2
    jldi j3, -1
    jxor j2, j2, j3
    jand j13, j13, j2
    jld j2, j1, PRN
    jadd j2, j2, j13
    jst j2, j1, PRN
    jld j3, j1, PRC
    jsub j3, j2, j3
  jwend
enr_close:
  jld j10, j1, PRH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
enr_done:
  jldi j1, 0
  jret

; The book's lines ("Q:", "O:", "R:"; the rest is not read) and their words (ZLN, ZWD), each word's text by its print
; (ZWT). Uses j1-j14.
en_lines:
  jldi j1, 0
  jld j11, j1, PRN
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 5
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZLN
  jld j11, j1, PRN
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZWD
  jldi j2, ZWT
  jldi j3, 24
  jcall pl_new
  jldi j1, 0
  jst j1, j1, ZNLN
  jst j1, j1, ZNWD
  jld j2, j1, PRB
  jst j2, j1, ZEP
  jld j3, j1, PRN
  jadd j3, j2, j3
  jst j3, j1, ZEEND
jwhile j4
  jldi j5, 1
  jadd j5, j2, j5
  jsub j6, j5, j3
  jjz j6, el_skip
  jldb j6, j5, 0
  jldi j7, 58                   ; ":"
  jsub j6, j6, j7
  jjnz j6, el_skip
  jldb j6, j2, 0
  jldi j9, 1
  jldi j7, 81                   ; "Q"
  jsub j7, j6, j7
  jjz j7, el_typed
  jldi j9, 2
  jldi j7, 79                   ; "O"
  jsub j7, j6, j7
  jjz j7, el_typed
  jldi j9, 3
  jldi j7, 82                   ; "R"
  jsub j7, j6, j7
  jjnz j7, el_skip
el_typed:
  jld j3, j1, ZNLN
  jldi j4, 5
  jshl j3, j3, j4
  jld j4, j1, ZLN
  jadd j3, j3, j4
  jst j3, j1, ZELR
  jst j9, j3, 0
  jld j4, j1, ZNWD
  jst j4, j3, 8
  jst j1, j3, 16
  jst j2, j3, 24
  jld j4, j1, ZNLN
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j1, ZNLN
  jldi j5, 2
  jadd j2, j2, j5
  jst j2, j1, ZEP
jwhile j2
  jldb j3, j9, 0
  jldi j2, 10
  jsub j2, j3, j2
  jjz j2, el_nl
  jcall mp_isletter
  jjnz j2, el_w
  jldi j2, 1
  jadd j9, j9, j2
  jldi j1, 0
  jst j9, j1, ZEP
jwcheck
el_word:
  jldi j1, 0
  jld j9, j1, ZEP
  jld j10, j1, ZEEND
  jsub j2, j9, j10
jwend
jjmp el_done
el_w:
  jldi j8, 0
  jwhile j4
    jldb j3, j2, 0
    jcall mp_isletter
    jjz j2, el_wh
    jldi j2, 1
    jadd j8, j8, j2
  jwcheck
    jadd j2, j9, j8
    jsub j4, j2, j10
  jwend
el_wh:
  jldi j1, 0
  jst j8, j1, ZEWL
  jadd j3, j9, j1
  jadd j4, j8, j1
  jcall mp_print
  jldi j1, 0
  jld j2, j1, ZNWD
  jldi j3, 24
  jmul j3, j2, j3
  jld j4, j1, ZWD
  jadd j3, j3, j4
  jst j5, j3, 0
  jld j9, j1, ZEP
  jst j9, j3, 8
  jld j8, j1, ZEWL
  jst j8, j3, 16
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZNWD
  jld j3, j1, ZELR
  jld j4, j3, 16
  jldi j6, 1
  jadd j4, j4, j6
  jst j4, j3, 16
  jldi j2, ZWT
  jcall pl_take
  jldi j1, 0
  jjz j6, el_wnext
  jld j9, j1, ZEP
  jst j9, j4, 8
  jld j8, j1, ZEWL
  jst j8, j4, 16
el_wnext:
  jld j9, j1, ZEP
  jld j8, j1, ZEWL
  jadd j9, j9, j8
  jst j9, j1, ZEP
  jjmp el_word
el_nl:
  jldi j2, 1
  jadd j9, j9, j2
  jldi j1, 0
  jst j9, j1, ZEP
jwcheck
el_line:
  jldi j1, 0
  jld j2, j1, ZEP
  jld j3, j1, ZEEND
  jsub j4, j2, j3
jwend
jjmp el_done
el_skip:
  jldi j1, 0
  jld j9, j1, ZEP
  jld j10, j1, ZEEND
  els_lap:
    jsub j2, j9, j10
    jjz j2, el_done
    jldb j3, j9, 0
    jldi j2, 1
    jadd j9, j9, j2
    jldi j2, 10
    jsub j2, j3, j2
    jjnz j2, els_lap
  jst j9, j1, ZEP
  jjmp el_line
el_done:
  jldi j1, 0
  jret

; Line j2's record -> j3. Uses j3, j4.
en_rec:
  jldi j4, 5
  jshl j3, j2, j4
  jldi j4, 0
  jld j4, j4, ZLN
  jadd j3, j3, j4
  jret

; The print of word j3 of the line whose record is at j2 -> j5. Uses j4, j5.
en_word:
  jld j4, j2, 8
  jadd j4, j4, j3
  jldi j5, 24
  jmul j4, j4, j5
  jldi j5, 0
  jld j5, j5, ZWD
  jadd j4, j4, j5
  jld j5, j4, 0
  jret

; The first place of print j8 in the line at record j2 -> j6 (-1: not there). Uses j3-j6.
en_has:
  jldi j3, 0
  jwhile j6
    jcall en_word
    jsub j5, j5, j8
    jjz j5, eh_yes
    jldi j6, 1
    jadd j3, j3, j6
  jwcheck
    jld j6, j2, 16
    jsub j6, j3, j6
  jwend
  jjmp eh_no
eh_yes:
  jldi j6, 0
  jadd j6, j3, j6
  jret
eh_no:
  jldi j6, -1
  jret

; j6 = 1 if the j11 words of line j2 from word j3 are the j11 of line j9 from word j10. Uses j3-j7, j12-j14 (keeps
; j2, j9-j11).
en_same:
  jldi j12, 0
  jadd j14, j3, j12
  jwhile j6
    jadd j3, j14, j12
    jcall en_word
    jldi j6, 0
    jadd j7, j5, j6
    jadd j13, j2, j6
    jadd j2, j9, j6
    jadd j3, j10, j12
    jcall en_word
    jadd j2, j13, j6
    jsub j5, j5, j7
    jjnz j5, esm_no
    jldi j6, 1
    jadd j12, j12, j6
  jwcheck
    jsub j6, j12, j11
  jwend
esm_yes:
  jldi j6, 1
  jret
esm_no:
  jldi j6, 0
  jret

; j6 = 1 if print j8 is one of the j11 prints at j10. Uses j6, j7, j12.
en_in:
  jldi j12, 0
  jwhile j6
    jldi j6, 3
    jshl j7, j12, j6
    jadd j7, j7, j10
    jld j7, j7, 0
    jsub j7, j7, j8
    jjz j7, ein_yes
    jldi j6, 1
    jadd j12, j12, j6
  jwcheck
    jsub j6, j12, j11
  jwend
  jjmp ein_no
ein_yes:
  jldi j6, 1
  jret
ein_no:
  jldi j6, 0
  jret

; The steps: every read question a case of its kind; a kind said by two cases, its answers alike but in the entity's
; place and one more (where the answer is), is a step. Each kind said. Uses j1-j14.
en_learn:
  jldi j1, 0
  jld j11, j1, ZNLN
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 96
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZTP
  jst j1, j1, ZNTP
  jst j1, j1, ZLI
jwhile j3
  jcall en_rec
  jld j4, j3, 0
  jldi j5, 1
  jsub j4, j4, j5
  jjnz j4, ln_next
  jst j3, j1, ZQR
  jldi j5, 1
  jadd j2, j2, j5
  jst j2, j1, ZOR0
  jst j1, j1, ZOM
  jwhile j5
    jcall en_rec
    jld j4, j3, 0
    jldi j5, 2
    jsub j4, j4, j5
    jjnz j4, ln_omd
    jld j5, j1, ZOM
    jldi j4, 1
    jadd j5, j5, j4
    jst j5, j1, ZOM
  jwcheck
    jldi j1, 0
    jld j2, j1, ZOR0
    jld j5, j1, ZOM
    jadd j2, j2, j5
    jld j5, j1, ZNLN
    jsub j5, j2, j5
  jwend
ln_omd:
  jld j5, j1, ZOM
  jjz j5, ln_next               ; (no answer: a composed question, asked later)
  jst j1, j1, ZT1               ; its entity: the word said by the most sentences of its answer (one only)
  jst j1, j1, ZT2               ; (how many say the best, and if another says as many)
  jst j1, j1, ZT6
  jwhile j4
    jcall en_word
    jldi j1, 0
    jst j5, j1, ZT3
    jst j1, j1, ZT4
    jst j1, j1, ZT5               ; how many say it
    jwhile j4
      jld j4, j1, ZOR0
      jadd j2, j2, j4
      jcall en_rec
      jadd j2, j3, j1
      jld j8, j1, ZT3
      jcall en_has
      jldi j1, 0
      jldi j3, 63
      jsar j6, j6, j3
      jjnz j6, ln_eon
      jld j2, j1, ZT5
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, ZT5
    ln_eon:
      jld j2, j1, ZT4
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, ZT4
    jwcheck
      jldi j1, 0
      jld j2, j1, ZT4
      jld j4, j1, ZOM
      jsub j4, j2, j4
    jwend
    ln_eall:
      jld j2, j1, ZT5
      jjz j2, ln_enext
      jld j3, j1, ZT2
      jsub j3, j2, j3
      jjnz j3, ln_ediff
      jldi j3, 1                  ; as many as the best: two of them
      jst j3, j1, ZT6
      jjmp ln_enext
    ln_ediff:
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, ln_enext           ; fewer
      jst j2, j1, ZT2
      jst j1, j1, ZT6
      jld j2, j1, ZT1
      jst j2, j1, ZSLP
      jld j2, j1, ZT3
      jst j2, j1, ZENT
    ln_enext:
      jldi j1, 0
      jld j2, j1, ZT1
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, ZT1
  jwcheck
    jldi j1, 0
    jld j3, j1, ZT1
    jld j2, j1, ZQR
    jld j4, j2, 16
    jsub j4, j3, j4
  jwend
ln_entd:
  jld j2, j1, ZT2
  jjz j2, ln_next               ; none, or two alike: not a case
  jld j2, j1, ZT6
  jjnz j2, ln_next
  jldi j9, 1                    ; its kind: its words, the entity's place as 1
  jst j1, j1, ZT1
  jwhile j4
    jcall en_word
    jldi j1, 0
    jld j4, j1, ZSLP
    jsub j4, j3, j4
    jjnz j4, ln_kw
    jldi j5, 1
  ln_kw:
    jldi j6, 0Fh
    jshi j6, 4243h
    jmul j9, j9, j6
    jxor j9, j9, j5
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, ZT1
  jwcheck
    jldi j1, 0
    jld j3, j1, ZT1
    jld j2, j1, ZQR
    jld j4, j2, 16
    jsub j4, j3, j4
  jwend
ln_keyd:
  jjnz j9, ln_kok
  jldi j9, 1
ln_kok:
  jst j9, j1, ZKEY
  jst j1, j1, ZT1
  jwhile j3
    jldi j3, 96
    jmul j3, j2, j3
    jld j4, j1, ZTP
    jadd j3, j3, j4
    jld j4, j3, 0
    jld j5, j1, ZKEY
    jsub j4, j4, j5
    jjz j4, ln_have
    jldi j4, 1
    jadd j2, j2, j4
    jst j2, j1, ZT1
  jwcheck
    jldi j1, 0
    jld j2, j1, ZT1
    jld j3, j1, ZNTP
    jsub j3, j2, j3
  jwend
ln_new:
  jldi j3, 96
  jmul j3, j2, j3
  jld j4, j1, ZTP
  jadd j3, j3, j4
  jldi j4, 1
  jadd j2, j2, j4
  jst j2, j1, ZNTP
  jld j4, j1, ZKEY
  jst j4, j3, 0
  jld j2, j1, ZQR
  jld j4, j2, 16
  jst j4, j3, 8
  jld j4, j1, ZSLP
  jst j4, j3, 16
  jst j2, j3, 80
  jst j3, j1, ZTPA
  jld j2, j1, ZOR0
  jwhile j6
    jld j2, j1, ZT4
    jldi j4, 1
    jadd j2, j2, j4
  jwcheck
    jst j2, j1, ZT4
    jcall en_rec
    jldi j1, 0
    jst j3, j1, ZT5
    jadd j2, j3, j1
    jld j8, j1, ZENT
    jcall en_has
    jldi j1, 0
    jld j3, j1, ZT5
    jldi j4, 63
    jsar j6, j6, j4
  jwend
ln_firstd:
  jld j4, j1, ZTPA
  jst j3, j4, 48
  jld j5, j3, 16
  jst j5, j4, 24
  jadd j2, j3, j1
  jld j8, j1, ZENT
  jcall en_has
  jldi j1, 0
  jld j4, j1, ZTPA
  jst j6, j4, 32
  jst j1, j4, 56
  jst j1, j4, 64
  jst j1, j4, 72
  jadd j3, j4, j1
ln_have:
  jst j3, j1, ZTPA
  jst j1, j1, ZT4
  jwhile j4
    jld j4, j1, ZOR0
    jadd j2, j2, j4
    jcall en_rec
    jldi j1, 0
    jst j3, j1, ZT5
    jadd j2, j3, j1
    jld j8, j1, ZENT
    jcall en_has
    jldi j1, 0
    jldi j4, 63
    jsar j4, j6, j4
    jjnz j4, ln_cnext             ; (it does not say the entity: not the case's)
    jld j4, j1, ZTPA
    jld j5, j4, 32
    jsub j5, j6, j5
    jjnz j5, ln_bad
    jld j3, j1, ZT5
    jld j5, j3, 16
    jld j6, j4, 24
    jsub j5, j5, j6
    jjnz j5, ln_bad
    jst j1, j1, ZT6
    jwhile j5
      jld j2, j1, ZT5
      jcall en_word
      jadd j7, j5, j1
      jld j4, j1, ZTPA
      jld j2, j4, 48
      jcall en_word
      jsub j5, j5, j7
      jjz j5, ln_psame
      jld j4, j1, ZTPA
      jldi j5, 1
      jshl j5, j5, j3
      jld j6, j4, 72
      jor j6, j6, j5
      jst j6, j4, 72
    ln_psame:
      jld j3, j1, ZT6
      jldi j4, 1
      jadd j3, j3, j4
      jst j3, j1, ZT6
    jwcheck
      jldi j1, 0
      jld j3, j1, ZT6
      jld j4, j1, ZTPA
      jld j5, j4, 24
      jsub j5, j3, j5
    jwend
    jjmp ln_cnext
  ln_bad:
    jldi j1, 0
    jld j4, j1, ZTPA
    jldi j5, 1
    jst j5, j4, 64
  ln_cnext:
    jldi j1, 0
    jld j2, j1, ZT4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZT4
  jwcheck
    jldi j1, 0
    jld j2, j1, ZT4
    jld j4, j1, ZOM
    jsub j4, j2, j4
  jwend
ln_cnt:
  jld j4, j1, ZTPA
  jld j5, j4, 56
  jldi j6, 1
  jadd j5, j5, j6
  jst j5, j4, 56
ln_next:
  jldi j1, 0
  jld j2, j1, ZLI
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZLI
jwcheck
  jldi j1, 0
  jld j2, j1, ZLI
  jld j3, j1, ZNLN
  jsub j3, j2, j3
jwend
ln_kinds:
  jst j1, j1, ZT1
  jwhile j3
    jldi j3, 96
    jmul j3, j2, j3
    jld j4, j1, ZTP
    jadd j3, j3, j4
    jst j3, j1, ZTPA
    jst j1, j3, 88              ; not a step, until it proves one
    jldi j4, -1
    jst j4, j3, 40
    jld j4, j3, 64
    jjnz j4, lk_say
    jld j4, j3, 56
    jldi j5, 2
    jsub j4, j4, j5
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, lk_say             ; one case: a memory, not a step
    jld j4, j3, 24
    jldi j5, 64
    jsub j4, j4, j5
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, lk_say              ; (64 words or more)
    jld j4, j3, 72
    jld j5, j3, 32
    jldi j6, 1
    jshl j6, j6, j5
    jldi j7, -1
    jxor j6, j6, j7
    jand j4, j4, j6             ; the places that change, the entity's aside
    jjz j4, lk_say
    jldi j6, 1
    jsub j6, j4, j6
    jand j6, j6, j4
    jjnz j6, lk_say             ; more than one: no one place for the answer
    jldi j5, 0
    jwhilez j6
      jldi j6, 1
      jshr j4, j4, j6
      jadd j5, j5, j6
    jwcheck
      jldi j6, 1
      jand j6, j4, j6
    jwend
    lk_bitd:
    jst j5, j3, 40
    jldi j5, 1
    jst j5, j3, 88
  lk_say:
    jcall en_saystep
    jldi j1, 0
    jld j2, j1, ZT1
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZT1
  jwcheck
    jldi j1, 0
    jld j2, j1, ZT1
    jld j3, j1, ZNTP
    jsub j3, j2, j3
  jwend
lk_done:
  jret

; "paso: <its question, the entity as _> | casos n | la respuesta en la palabra a de l" for the kind at ZTPA (or "(no
; es un paso)"). Uses j1-j14.
en_saystep:
  jldi j1, S_PASO
  jcall puts
  jld j3, j1, ZTPA
  jld j2, j3, 80
  jld j4, j3, 8
  jld j5, j3, 16
  jldi j3, 0
  jcall en_saywords
  jldi j1, S_CASOS
  jcall puts
  jld j3, j1, ZTPA
  jld j2, j3, 56
  jcall putnum
  jld j3, j1, ZTPA
  jld j4, j3, 88
  jjz j4, ess_no
  jldi j1, S_ENPAL
  jcall puts
  jld j3, j1, ZTPA
  jld j2, j3, 40
  jldi j4, 1
  jadd j2, j2, j4
  jcall putnum
  jldi j1, S_DE
  jcall puts
  jld j3, j1, ZTPA
  jld j2, j3, 24
  jcall putnum
  jjmp ess_end
ess_no:
  jldi j1, S_NOPASO
  jcall puts
ess_end:
  jldi j2, 10
  jcall putch
  jret

; The words of line j2 from word j3 to word j4 (not included), one space between, word j5 said "_". Uses j1-j14.
en_saywords:
  jldi j1, 0
  jst j2, j1, ZSLR
  jst j3, j1, ZSLI
  jst j3, j1, ZSLF
  jst j4, j1, ZSLE
  jst j5, j1, ZSLS
  jwhile j4
    jld j4, j1, ZSLF
    jsub j4, j3, j4
    jjz j4, esw_ns
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j3, j1, ZSLI
  esw_ns:
    jld j4, j1, ZSLS
    jsub j4, j3, j4
    jjnz j4, esw_w
    jldi j2, 95
    jcall putch
    jjmp esw_next
  esw_w:
    jld j2, j1, ZSLR
    jcall en_word
    jcall en_sayprint
  esw_next:
    jldi j1, 0
    jld j3, j1, ZSLI
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, ZSLI
  jwcheck
    jldi j1, 0
    jld j3, j1, ZSLI
    jld j4, j1, ZSLE
    jsub j4, j3, j4
  jwend
esw_done:
  jret

; The text of the word whose print is j5. Uses j1-j10.
en_sayprint:
  jldi j2, ZWT
  jcall pl_find
  jldi j1, 0
  jld j9, j4, 8
  jld j10, j4, 16
  jwhile j10
    jldb j2, j9, 0
    jcall putch
    jldi j1, 1
    jadd j9, j9, j1
    jsub j10, j10, j1
  jwend
esp_done:
  jldi j1, 0
  jret

; j6 = 1 if the kind at j3 is a step and its entity is its question's last word. Uses j4-j6.
en_last:
  jldi j6, 0
  jld j4, j3, 88
  jjz j4, elt_done
  jld j4, j3, 8
  jld j5, j3, 16
  jldi j6, 1
  jsub j4, j4, j6
  jsub j4, j4, j5
  jldi j6, 0
  jjnz j4, elt_done
  jldi j6, 1
elt_done:
  jret

; Line j2: j6 = 1 if it is a composed question (a "Q:" with no "O:" after it) -> ZQR, and its truth's line ZTRR (0:
; none). Uses j1-j6.
en_iscomp:
  jcall en_rec
  jldi j1, 0
  jldi j6, 0
  jld j4, j3, 0
  jldi j5, 1
  jsub j4, j4, j5
  jjnz j4, eic_done
  jst j3, j1, ZQR
  jst j1, j1, ZTRR
  jldi j5, 1
  jadd j2, j2, j5
  jld j5, j1, ZNLN
  jsub j5, j2, j5
  jjz j5, eic_yes
  jcall en_rec
  jldi j1, 0
  jld j4, j3, 0
  jldi j5, 2
  jsub j5, j4, j5
  jjz j5, eic_done
  jldi j5, 3
  jsub j5, j4, j5
  jjnz j5, eic_yes
  jst j3, j1, ZTRR
eic_yes:
  jldi j6, 1
eic_done:
  jret

; The longest whole head of a step (its entity last) that begins the question ZQR, shorter than it -> ZOUTH (-1: none).
; Uses j1-j14.
en_outer:
  jldi j1, 0
  jldi j2, -1
  jst j2, j1, ZOUTH
  jst j1, j1, ZETI
  jwhile j3
    jldi j3, 96
    jmul j3, j2, j3
    jld j4, j1, ZTP
    jadd j3, j3, j4
    jst j3, j1, ZFT
    jcall en_last
    jjz j6, eo_next
    jldi j1, 0
    jld j3, j1, ZFT
    jld j11, j3, 16
    jld j4, j1, ZOUTH
    jsub j4, j4, j11
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, eo_next
    jld j2, j1, ZQR
    jld j4, j2, 16
    jsub j4, j11, j4
    jsar j4, j4, j5
    jjz j4, eo_next
    jld j9, j3, 80
    jldi j10, 0
    jldi j3, 0
    jcall en_same
    jjz j6, eo_next
    jldi j1, 0
    jld j3, j1, ZFT
    jld j11, j3, 16
    jst j11, j1, ZOUTH
  eo_next:
    jldi j1, 0
    jld j2, j1, ZETI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZETI
  jwcheck
    jldi j1, 0
    jld j2, j1, ZETI
    jld j3, j1, ZNTP
    jsub j3, j2, j3
  jwend
eo_done:
  jret

; The longest end of a step's head (shorter than the head) that ends the question ZQR at word ZEPOS -> ZINS its words
; (0: none), ZINT its step. Uses j1-j14.
en_inner:
  jldi j1, 0
  jst j1, j1, ZINS
  jst j1, j1, ZETI
  jwhile j3
    jldi j3, 96
    jmul j3, j2, j3
    jld j4, j1, ZTP
    jadd j3, j3, j4
    jst j3, j1, ZFT2
    jcall en_last
    jjz j6, ei_next
    jldi j1, 0
    jld j3, j1, ZFT2
    jld j4, j3, 16
    jldi j5, 1
    jsub j4, j4, j5
    jst j4, j1, ZES
    jwhile j11
      jld j5, j1, ZINS
      jsub j5, j5, j11
      jldi j6, 63
      jsar j5, j5, j6
      jjz j5, ei_next
      jld j3, j1, ZEPOS
      jsub j3, j3, j11
      jsar j6, j3, j6
      jjnz j6, ei_sn
      jld j2, j1, ZQR
      jld j4, j1, ZFT2
      jld j9, j4, 80
      jld j10, j4, 16
      jsub j10, j10, j11
      jcall en_same
      jjz j6, ei_sn
      jldi j1, 0
      jld j11, j1, ZES
      jst j11, j1, ZINS
      jld j4, j1, ZFT2
      jst j4, j1, ZINT
      jjmp ei_next
    ei_sn:
      jldi j1, 0
      jld j11, j1, ZES
      jldi j5, 1
      jsub j11, j11, j5
      jst j11, j1, ZES
    jwcheck
      jldi j1, 0
      jld j11, j1, ZES
    jwend
  ei_next:
    jldi j1, 0
    jld j2, j1, ZETI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZETI
  jwcheck
    jldi j1, 0
    jld j2, j1, ZETI
    jld j3, j1, ZNTP
    jsub j3, j2, j3
  jwend
ei_done:
  jret

; A step whose whole head is the question ZQR's first ZEPOS words -> ZFT, j6 = 1 (0: none). Uses j1-j14.
en_full:
  jldi j1, 0
  jst j1, j1, ZETI
  jwhile j3
    jldi j3, 96
    jmul j3, j2, j3
    jld j4, j1, ZTP
    jadd j3, j3, j4
    jst j3, j1, ZFT
    jcall en_last
    jjz j6, ef_next
    jldi j1, 0
    jld j3, j1, ZFT
    jld j11, j3, 16
    jld j5, j1, ZEPOS
    jsub j5, j11, j5
    jjnz j5, ef_next
    jld j9, j3, 80
    jldi j10, 0
    jld j2, j1, ZQR
    jldi j3, 0
    jcall en_same
    jjnz j6, ef_yes
  ef_next:
    jldi j1, 0
    jld j2, j1, ZETI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZETI
  jwcheck
    jldi j1, 0
    jld j2, j1, ZETI
    jld j3, j1, ZNTP
    jsub j3, j2, j3
  jwend
  jjmp ef_no
ef_yes:
  jldi j6, 1
  jret
ef_no:
  jldi j6, 0
  jret

; The bracket: for every composed question, what lies between the longest step's head that begins it and the longest
; end of a step's head that ends it; of those said by two, the one that puts the most composed questions together is
; the bracket (ZOPR, ZOPS, ZOPL, ZOPC; ZGB how many it puts together). Said. Uses j1-j14.
en_gaps:
  jldi j2, ZGAP
  jldi j3, 40
  jcall pl_new
  jldi j1, 0
  jst j1, j1, ZLI
  jwhile j3
    jcall en_iscomp
    jjz j6, eg_next
    jcall en_outer
    jldi j1, 0
    jld j2, j1, ZOUTH
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, eg_next
    jld j2, j1, ZQR
    jld j3, j2, 16
    jldi j4, 1
    jsub j3, j3, j4
    jst j3, j1, ZEPOS
    jcall en_inner
    jldi j1, 0
    jld j2, j1, ZINS
    jjz j2, eg_next
    jld j3, j1, ZEPOS
    jsub j3, j3, j2
    jld j4, j1, ZOUTH
    jsub j5, j3, j4
    jldi j6, 63
    jsar j6, j5, j6
    jjnz j6, eg_next
    jjz j5, eg_next
    jst j4, j1, ZT1
    jst j5, j1, ZT2
    jldi j9, 1
    jst j1, j1, ZT3
    jwhile j5
      jld j4, j1, ZT1
      jadd j3, j3, j4
      jld j2, j1, ZQR
      jcall en_word
      jldi j6, 0Fh
      jshi j6, 4243h
      jmul j9, j9, j6
      jxor j9, j9, j5
      jld j3, j1, ZT3
      jldi j4, 1
      jadd j3, j3, j4
      jst j3, j1, ZT3
    jwcheck
      jldi j1, 0
      jld j3, j1, ZT3
      jld j5, j1, ZT2
      jsub j5, j3, j5
    jwend
  eg_kd:
    jjnz j9, eg_kok
    jldi j9, 1
  eg_kok:
    jadd j5, j9, j1
    jldi j2, ZGAP
    jcall pl_take
    jldi j1, 0
    jld j7, j4, 8
    jldi j8, 1
    jadd j7, j7, j8
    jst j7, j4, 8
    jjz j6, eg_next
    jld j7, j1, ZQR
    jst j7, j4, 16
    jld j7, j1, ZT1
    jst j7, j4, 24
    jld j7, j1, ZT2
    jst j7, j4, 32
  eg_next:
    jldi j1, 0
    jld j2, j1, ZLI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZLI
  jwcheck
    jldi j1, 0
    jld j2, j1, ZLI
    jld j3, j1, ZNLN
    jsub j3, j2, j3
  jwend
eg_pick:
  jst j1, j1, ZOPC
  jst j1, j1, ZGB
  jst j1, j1, ZGI
  jwhile j3
    jld j5, j2, 24
    jmul j5, j4, j5
    jld j6, j2, 0
    jadd j5, j5, j6
    jst j5, j1, ZGP
    jld j6, j5, 0
    jjz j6, eg_pn
    jld j6, j5, 8
    jldi j7, 2
    jsub j6, j6, j7
    jldi j7, 63
    jsar j6, j6, j7
    jjnz j6, eg_pn              ; said by one: a memory, not a bracket
    jld j6, j5, 16
    jst j6, j1, ZOPR
    jld j6, j5, 24
    jst j6, j1, ZOPS
    jld j6, j5, 32
    jst j6, j1, ZOPL
    jcall en_tries
    jldi j1, 0
    jld j3, j1, ZGB
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, eg_pn               ; not more than the best
    jst j2, j1, ZGB
    jld j5, j1, ZGP
    jst j5, j1, ZGW
  eg_pn:
    jldi j1, 0
    jld j4, j1, ZGI
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j1, ZGI
  jwcheck
    jldi j1, 0
    jldi j2, ZGAP
    jld j3, j2, 8
    jldi j4, 1
    jadd j3, j3, j4
    jld j4, j1, ZGI
    jsub j3, j4, j3
  jwend
eg_pd:
  jldi j2, -1
  jst j2, j1, ZOPL
  jld j2, j1, ZGB
  jjnz j2, eg_win
  jldi j1, S_NOPAR
  jcall puts
  jret
eg_win:
  jld j5, j1, ZGW
  jld j6, j5, 16
  jst j6, j1, ZOPR
  jld j6, j5, 24
  jst j6, j1, ZOPS
  jld j6, j5, 32
  jst j6, j1, ZOPL
  jld j6, j5, 8
  jst j6, j1, ZOPC
eg_say:
  jldi j1, S_PAR
  jcall puts
  jld j2, j1, ZOPR
  jld j3, j1, ZOPS
  jld j4, j1, ZOPL
  jadd j4, j3, j4
  jldi j5, -1
  jcall en_saywords
  jldi j1, S_LODIC
  jcall puts
  jld j2, j1, ZOPC
  jcall putnum
  jldi j1, S_ARMA
  jcall puts
  jld j2, j1, ZGB
  jcall putnum
  jldi j1, S_COMPS
  jcall puts
  jret

; Step j2 onto ZSTP. Uses j1, j3-j5.
ep_push:
  jldi j1, 0
  jld j3, j1, ZSTN
  jldi j4, 3
  jshl j4, j3, j4
  jld j5, j1, ZSTP
  jadd j4, j4, j5
  jst j2, j4, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, ZSTN
  jret

; The composed question ZQR put together from the right, the deepest first, as the calculator does: its last word the
; entity; while what is left is not a step's whole head, it must end in the longest end of a step's head and, before
; it, the bracket. Its steps, the deepest first -> ZSTP, ZSTN; ZENT; j6 = 1 if it was put together. Uses j1-j14.
en_parse:
  jldi j1, 0
  jst j1, j1, ZSTN
  jld j2, j1, ZQR
  jld j3, j2, 16
  jjz j3, ep_no
  jldi j4, 1
  jsub j3, j3, j4
  jst j3, j1, ZEPOS
  jcall en_word
  jldi j1, 0
  jst j5, j1, ZENT
  jwhile j2
    jcall en_full
    jjz j6, ep_inner
    jldi j1, 0
    jld j2, j1, ZFT
    jcall ep_push
    jldi j6, 1
    jret
  ep_inner:
    jcall en_inner
    jldi j1, 0
    jld j2, j1, ZINS
    jjz j2, ep_no
    jld j3, j1, ZEPOS
    jsub j3, j3, j2
    jst j3, j1, ZEPOS
    jld j2, j1, ZINT
    jcall ep_push
    jldi j1, 0                  ; the bracket before it
    jld j11, j1, ZOPL
    jldi j3, 63
    jsar j3, j11, j3
    jjnz j3, ep_no
    jld j3, j1, ZEPOS
    jsub j3, j3, j11
    jldi j4, 63
    jsar j4, j3, j4
    jjnz j4, ep_no
    jst j3, j1, ZT1
    jld j2, j1, ZQR
    jld j9, j1, ZOPR
    jld j10, j1, ZOPS
    jcall en_same
    jjz j6, ep_no
    jldi j1, 0
    jld j3, j1, ZT1
    jst j3, j1, ZEPOS
  jwcheck
    jldi j1, 0
    jld j2, j1, ZEPOS
  jwend
ep_no:
  jldi j6, 0
  jret

; One step (the kind at ZTPA) from the prints of ZSA: every "O:" sentence of the book in its frame (its words where
; the step's answers do not change), whose entity's word is one of ZSA, gives the word in its answer's place -> ZSB
; (each once). Uses j1-j14.
en_step:
  jldi j1, 0
  jst j1, j1, ZSBN
  jst j1, j1, ZLK
  jwhile j3
    jcall en_rec
    jldi j1, 0
    jld j4, j3, 0
    jldi j5, 2
    jsub j4, j4, j5
    jjnz j4, es_next
    jld j4, j1, ZTPA
    jld j5, j3, 16
    jld j6, j4, 24
    jsub j5, j5, j6
    jjnz j5, es_next
    jst j3, j1, ZT5
    jst j1, j1, ZT6
    jwhile j5
      jld j5, j4, 32
      jsub j5, j3, j5
      jjz j5, es_pn
      jld j5, j4, 40
      jsub j5, j3, j5
      jjz j5, es_pn
      jld j2, j1, ZT5
      jcall en_word
      jadd j7, j5, j1
      jld j4, j1, ZTPA
      jld j2, j4, 48
      jcall en_word
      jsub j5, j5, j7
      jjnz j5, es_next
    es_pn:
      jld j3, j1, ZT6
      jldi j4, 1
      jadd j3, j3, j4
      jst j3, j1, ZT6
    jwcheck
      jldi j1, 0
      jld j3, j1, ZT6
      jld j4, j1, ZTPA
      jld j5, j4, 24
      jsub j5, j3, j5
    jwend
  es_frame:
    jld j4, j1, ZTPA
    jld j3, j4, 32
    jld j2, j1, ZT5
    jcall en_word
    jadd j8, j5, j1
    jld j10, j1, ZSA
    jld j11, j1, ZSAN
    jcall en_in
    jjz j6, es_next
    jld j4, j1, ZTPA
    jld j3, j4, 40
    jld j2, j1, ZT5
    jcall en_word
    jadd j8, j5, j1
    jld j10, j1, ZSB
    jld j11, j1, ZSBN
    jcall en_in
    jjnz j6, es_next
    jldi j6, 3
    jshl j7, j11, j6
    jadd j7, j7, j10
    jst j8, j7, 0
    jldi j6, 1
    jadd j11, j11, j6
    jst j11, j1, ZSBN
  es_next:
    jldi j1, 0
    jld j2, j1, ZLK
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZLK
  jwcheck
    jldi j1, 0
    jld j2, j1, ZLK
    jld j3, j1, ZNLN
    jsub j3, j2, j3
  jwend
es_done:
  jret

; The steps of ZSTP run from the entity, the deepest first, each one's answers the next one's entities -> ZSA, ZSAN.
; Uses j1-j14.
en_eval:
  jldi j1, 0
  jld j2, j1, ZENT
  jld j3, j1, ZSA
  jst j2, j3, 0
  jldi j2, 1
  jst j2, j1, ZSAN
  jst j1, j1, ZT2
  jwhile j3
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ZSTP
    jadd j3, j3, j4
    jld j3, j3, 0
    jst j3, j1, ZTPA
    jcall en_step
    jldi j1, 0
    jld j2, j1, ZSA
    jld j3, j1, ZSB
    jst j3, j1, ZSA
    jst j2, j1, ZSB
    jld j2, j1, ZSBN
    jst j2, j1, ZSAN
    jld j2, j1, ZT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZT2
  jwcheck
    jldi j1, 0
    jld j2, j1, ZT2
    jld j3, j1, ZSTN
    jsub j3, j2, j3
  jwend
ev_done:
  jret

; j6 = 1 if ZSA is the words of the truth's line ZTRR (none: nothing). Uses j1-j12.
en_judge:
  jldi j1, 0
  jldi j7, 0
  jld j2, j1, ZTRR
  jjz j2, ej_cnt
  jld j7, j2, 16
ej_cnt:
  jld j6, j1, ZSAN
  jsub j6, j6, j7
  jjnz j6, ej_no
  jst j1, j1, ZT6
  jwhile j2
    jld j4, j2, 16
    jsub j4, j3, j4
    jjz j4, ej_yes
    jcall en_word
    jadd j8, j5, j1
    jld j10, j1, ZSA
    jld j11, j1, ZSAN
    jcall en_in
    jjz j6, ej_no
    jld j3, j1, ZT6
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, ZT6
  jwcheck
    jldi j1, 0
    jld j3, j1, ZT6
    jld j2, j1, ZTRR
  jwend
ej_yes:
  jldi j6, 1
  jret
ej_no:
  jldi j6, 0
  jret

; The prints of ZSA said, one space between ("-": none). Uses j1-j14.
en_saysa:
  jldi j1, 0
  jld j2, j1, ZSAN
  jjnz j2, esa_go
  jldi j2, 45
  jcall putch
  jret
esa_go:
  jst j1, j1, ZT6
  jwhile j2
    jjz j3, esa_ns
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j3, j1, ZT6
  esa_ns:
    jldi j2, 3
    jshl j2, j3, j2
    jld j4, j1, ZSA
    jadd j2, j2, j4
    jld j5, j2, 0
    jcall en_sayprint
    jldi j1, 0
    jld j3, j1, ZT6
    jldi j2, 1
    jadd j3, j3, j2
    jst j3, j1, ZT6
  jwcheck
    jldi j1, 0
    jld j3, j1, ZT6
    jld j2, j1, ZSAN
    jsub j2, j3, j2
  jwend
esa_done:
  jret

; Rooms for the prints going through the steps and for a question's steps (a word each at most). Uses j1-j14.
en_rooms:
  jldi j1, 0
  jld j11, j1, ZNWD
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jst j11, j1, ZT1
  jcall room
  jldi j1, 0
  jst j13, j1, ZSA
  jld j11, j1, ZT1
  jcall room
  jldi j1, 0
  jst j13, j1, ZSB
  jld j11, j1, ZT1
  jcall room
  jldi j1, 0
  jst j13, j1, ZSTP
  jret

; How many composed questions the bracket ZOPR, ZOPS, ZOPL puts together -> j2. Uses j1-j14.
en_tries:
  jldi j1, 0
  jst j1, j1, ZGN
  jst j1, j1, ZLI
  jwhile j3
    jcall en_iscomp
    jjz j6, etr_next
    jcall en_parse
    jldi j1, 0
    jld j2, j1, ZGN
    jadd j2, j2, j6
    jst j2, j1, ZGN
  etr_next:
    jldi j1, 0
    jld j2, j1, ZLI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZLI
  jwcheck
    jldi j1, 0
    jld j2, j1, ZLI
    jld j3, j1, ZNLN
    jsub j3, j2, j3
  jwend
etr_done:
  jld j2, j1, ZGN
  jret

; Every composed question: put together, run, said with the truth, and the count of them. Uses j1-j14.
en_answer:
  jldi j1, 0
  jst j1, j1, ZNCOMP
  jst j1, j1, ZNARM
  jst j1, j1, ZNRT
  jst j1, j1, ZNSD
  jst j1, j1, ZLI
  jwhile j3
    jcall en_iscomp
    jjz j6, ea_next
    jldi j1, 0
    jld j2, j1, ZNCOMP
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZNCOMP
    jcall en_parse
    jldi j1, 0
    jst j6, j1, ZOK
    jldi j1, S_C
    jcall puts
    jld j2, j1, ZQR
    jld j4, j2, 16
    jldi j3, 0
    jldi j5, -1
    jcall en_saywords
    jldi j1, 0
    jld j2, j1, ZOK
    jjz j2, ea_noarm
    jld j2, j1, ZNARM
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZNARM
    jcall en_eval
    jldi j1, S_BAR
    jcall puts
    jld j2, j1, ZSTN
    jcall putnum
    jldi j1, S_PASOS
    jcall puts
    jldi j1, S_DICE
    jcall puts
    jcall en_saysa
    jldi j1, 0
    jld j2, j1, ZSAN
    jjz j2, ea_truth
    jld j2, j1, ZNSD
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZNSD
    jjmp ea_truth
  ea_noarm:
    jst j1, j1, ZSAN
    jldi j1, S_NOARMA
    jcall puts
  ea_truth:
    jldi j1, S_VERDAD
    jcall puts
    jld j2, j1, ZTRR
    jjz j2, ea_dash
    jld j4, j2, 16
    jjz j4, ea_dash
    jldi j3, 0
    jldi j5, -1
    jcall en_saywords
    jjmp ea_judge
  ea_dash:
    jldi j2, 45
    jcall putch
  ea_judge:
    jldi j1, 0
    jld j2, j1, ZTRR
    jjnz j2, ea_jtr
    jldi j1, S_BAR                ; no truth: not judged
    jcall puts
    jldi j2, 45
    jcall putch
    jldi j2, 10
    jcall putch
    jjmp ea_next
  ea_jtr:
    jcall en_judge
    jldi j1, 0
    jst j6, j1, ZT3
    jjz j6, ea_say
    jld j2, j1, ZNRT
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZNRT
  ea_say:
    jldi j1, S_BAR
    jcall puts
    jld j2, j1, ZT3
    jcall putnum
    jldi j2, 10
    jcall putch
  ea_next:
    jldi j1, 0
    jld j2, j1, ZLI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZLI
  jwcheck
    jldi j1, 0
    jld j2, j1, ZLI
    jld j3, j1, ZNLN
    jsub j3, j2, j3
  jwend
ea_done:
  jldi j1, S_COMP
  jcall puts
  jld j2, j1, ZNCOMP
  jcall putnum
  jldi j1, S_ARMAN
  jcall puts
  jld j2, j1, ZNARM
  jcall putnum
  jldi j1, S_ACIER
  jcall puts
  jld j2, j1, ZNRT
  jcall putnum
  jldi j1, S_DICEN
  jcall puts
  jld j2, j1, ZNSD
  jcall putnum
  jldi j1, S_SINOR
  jcall puts
  jret

; A word's print: FNV-1a over the j4 bytes at j3 -> j5 (never 0). Uses j3-j7.
mp_print:
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
mpf_done:
  jjnz j5, mpf_out
  jldi j5, 1
mpf_out:
  jret

; j2 = 1 if byte j3 is a letter of a word (a..z, or a byte of an accented letter, 80h and over). Uses j2, j4, j5.
mp_isletter:
  jldi j4, 128
  jsub j4, j3, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, mpi_yes
  jldi j4, 97
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjnz j4, mpi_no
  jldi j4, 123
  jsub j4, j3, j4
  jsar j4, j4, j5
  jjz j4, mpi_no
mpi_yes:
  jldi j2, 1
  jret
mpi_no:
  jldi j2, 0
  jret

include '../lectura/crece.inc'
include '../lectura/lectura.inc'
