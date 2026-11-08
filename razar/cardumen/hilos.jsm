; Relations found in raw text, and how they relate (Capitan, 2026-11-08: "we do not have to chew its food so it eats:
; it has to learn to eat by itself and distill its own mechanisms, that reasoning emerges; we will not always be there
; to tell it how to learn"). Nobody asks it anything and nobody cuts its text: it reads the house's "pares" (the book's
; buildings, as sentido.jsm writes them) and
;   - the half: the words said most that together make half of what the book says (as in memoria_pares); the rest are
;     the words a relation can hold.
;   - the relations: every form "_ <one to three words> _" whose two places hold words not of the half (and not the
;     same word) is said by the pair it holds. A form said by two pairs is a relation (what one says is a memory, what
;     two say is a rule).
;   - how relations relate: two relations that hold the same pair, the same way ("abraham fue padre de isaac", "isaac,
;     padre de jacob") or the other way round ("jacob, hijo de isaac"), share it. Against the null: each relation's
;     pairs crossed among themselves (every pair's second word given to the pair before it), so what the two hold
;     alike is only what words they use, not which goes with which. Two relations relate when two pairs say it and it
;     shares more than its null.
;   - the while (Capitan, 2026-11-08: "a chained while: my idea, everything in while, applied as a mechanism"): each
;     turn, a relation joins the one it relates to most (twice what they share read, minus what they share crossed),
;     if that one chooses it too, and the joined ones are one relation from then on (their pairs together, turned
;     when they relate the other way round). Then everything is measured again with what was joined. While a turn joins
;     something, there is another; when nothing new beats its null, the while ends by itself: no number of turns is
;     given. (One join a turn for each, the strongest chosen by both: what a turn joins is never carried by what it
;     joined in the same turn, so weak links do not chain everything into one.)
;   - the tanda, when the house has "tanda" (k forms, the cube's side n): instead of the while, the k forms of the
;     strongest relations of relations, each said with the three bottom pieces of the cube its pairs fall on most (and
;     with its pairs crossed, the null), for voluntad_hilos.jsm to play with.
S_LIBRO  = 0                    ; (the texts lectura.inc asks for)
S_P      = 10h
S_NOBOOK = 20h
S_NOMEM  = 40h
S_PARES  = 80h
S_PAL    = 0C0h
S_MITAD  = 0E0h
S_VECES  = 100h
S_DE     = 140h
S_REL    = 160h
S_TIL    = 180h
S_MISMA  = 1A0h
S_REVES  = 1C0h
S_LODIC  = 1E0h
S_NULO   = 200h
S_MEDIO  = 220h
S_CUANT  = 240h
S_VUELTA = 280h
S_UNE    = 2A0h
S_PARO   = 2C0h
S_PAROB  = 2E0h
S_CLASES = 340h
S_GRANDE = 380h
S_FORMAS = 3C0h
S_GANAN  = 3E0h
S_SEUNEN = 420h
S_TANDA  = 440h
S_TT     = 460h
S_NT     = 470h
S_RT     = 480h
S_BARR   = 490h
S_PT     = 4A0h
S_QT     = 4B0h
S_UT     = 4C0h
S_VT     = 4D0h
S_WT     = 4E0h
S_GT     = 4F0h
S_AT     = 500h
S_HT     = 510h
S_BT     = 520h

PRB   = 1200h                   ; the file: its bytes, how many, the room's size, a handle
PRN   = 1208h
PRC   = 1210h
PRH   = 1218h
ZLN   = 1220h                   ; the lines: by line {kind, its first word, how many, its start}, how many
ZNLN  = 1228h
ZWD   = 1230h                   ; the words: by word {print, start, bytes}, how many
ZNWD  = 1238h
ZWT   = 1250h                   ; a word's text by print {print, start, bytes} (a growing table, 32 bytes)
ZEP   = 1290h                   ; (reading: where, the end, the line, a word's bytes)
ZEEND = 1298h
ZELR  = 12A0h
ZEWL  = 12A8h
ZSLR  = 13C8h                   ; (saying words: the line, walking, the first, the end, the place said "_")
ZSLI  = 13D0h
ZSLF  = 13D8h
ZSLE  = 13E0h
ZSLS  = 13E8h
HWC   = 1500h                   ; each word's times {print, times} (a growing table)
HTOT  = 1520h                   ; the words read; the half: the fewest times one of its words has; the most times;
HHC   = 1528h                   ; how many words by their times (a room); by word, 1 if of the half (a room)
HMAX  = 1530h
HHIS  = 1538h
HHF   = 1580h
HMID  = 1540h                   ; the forms by key {key, number} (a growing table); by number {key, a line it is in,
HMA   = 1560h                   ; where its words start, how many, its pairs, its last pair} (48 bytes, a room); how
HNM   = 1568h                   ; many
HFT   = 1588h                   ; the pairs, each once by form (a growing table, its key only); the pairs {form, first,
HFL   = 15A8h                   ; second, the form's pair before} (32 bytes, a room), how many
HNF   = 15B0h
HGT   = 15B8h                   ; the pairs by their two words {key, how many, where they start, how many put}; what
HGE   = 15D8h                   ; holds them {form, which way, 1 if crossed} (24 bytes, a room), how many
HNGE  = 15E0h
HAG   = 15E8h                   ; two forms that hold a pair alike {key, form, form, 1 same way 2 the other, how many,
HTOP  = 1608h                   ; how many crossed}; the ones said (a room), how many; the forms said by two
HNTOP = 1610h
HKEPT = 1618h
HI    = 1620h                   ; (walking)
HJ    = 1628h
HK    = 1630h
HL    = 1638h
HA    = 1640h
HB    = 1648h
HM    = 1650h
HTG   = 1658h
HPASS = 1660h
HT1   = 1668h
HT2   = 1670h
HT3   = 1678h
HT4   = 1680h
HT5   = 1688h
HKEY  = 1690h
HDIR  = 1698h
HCLS  = 1700h                   ; by form: the one it joined (itself while it is a relation of its own), 1 if turned
HPAR  = 1708h                   ; against it, how many forms its relation holds; the strongest score by relation and
HSIZE = 1710h                   ; its relation of relations (rooms)
HBST  = 1718h
HBSE  = 1720h
HTURN = 1728h                   ; the turn; joins in it; relations of relations that beat their null in it
HNMRG = 1730h
HNACC = 1738h
HTANDA = 1740h                  ; the tanda (house "tanda": how many forms, the cube's side): 1 if asked, its two
HTK   = 1748h                   ; numbers; the chosen forms (a room), how many; the relations of relations taken (a
HTN   = 1750h                   ; room), how many; hits by piece (a room); the strongest, its relation of relations;
HCH   = 1758h                   ; a form's three pieces; walking
HNCH  = 1760h
HUS   = 1768h
HNUS  = 1770h
HCNT  = 1778h
HTBEST = 1780h
HTE   = 1788h
HP1   = 1790h
HP2   = 1798h
HP3   = 17A0h
HTI   = 17A8h
HTJ   = 17B0h
HTSAY = 17B8h                   ; (the number said for a form; how many new ones; the texts of a song, read and
HNNEW = 17C0h                   ; crossed)
HSR   = 17C8h
HSC   = 17D0h
HWX   = 17D8h                   ; the words a form's pairs say, by print {print, how many} (a growing table); the
HSCUT = 17F8h                   ; fewest times a surname's word has; how many words it has
HSWN  = 1800h
HSX   = 1808h                   ; (the text a cap or a surname is said with)

include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j11, S_TANDA               ; a tanda for the cube, if the house asks for one
jldi j12, 5
jcall en_read
jldi j1, 0
jst j1, j1, HTANDA
jld j2, j1, PRN
jjz j2, hl_book
jcall hl_tread
jldi j1, 0
jldi j2, 1
jst j2, j1, HTANDA
hl_book:
jldi j11, S_PARES
jldi j12, 5
jcall en_read
jldi j1, 0
jld j2, j1, PRN
jjnz j2, hl_go
jldi j1, S_NOBOOK
jcall puts
jjmp finish
hl_go:
jcall en_lines
jcall hl_half
jcall hl_facts
jcall hl_rooms
jcall hl_say0
jldi j1, 0
jld j2, j1, HTANDA
jjz j2, hl_while
jcall hl_groups
jcall hl_agree
jcall hl_tanda
jjmp finish
hl_while:
jldi j1, 0
jldi j2, 1
jst j2, j1, HTURN
jwhile j2                      ; while a turn joins something
  jcall hl_groups
  jcall hl_agree
  jcall hl_merge
  jldi j1, 0
  jld j2, j1, HTURN
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, HTURN
  jld j2, j1, HNMRG
jwend
jcall hl_end
jjmp finish

; Each word's times, the half (the words said most that make half of what the book says: HHC the fewest times one
; of them has, as mp_head does) and, by word, if it is of the half (HHF). Uses j1-j14.
hl_half:
  jldi j2, HWC
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, HMAX
  jst j1, j1, HI
  hh_lap:
    jldi j1, 0
    jld j2, j1, HI
    jld j3, j1, ZNWD
    jsub j3, j2, j3
    jjz j3, hh_his
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ZWD
    jadd j3, j3, j4
    jld j5, j3, 0
    jldi j2, HWC
    jcall pl_take
    jldi j1, 0
    jld j7, j4, 8
    jldi j8, 1
    jadd j7, j7, j8
    jst j7, j4, 8
    jld j8, j1, HMAX
    jsub j8, j8, j7
    jldi j6, 63
    jsar j8, j8, j6
    jjz j8, hh_n
    jst j7, j1, HMAX
  hh_n:
    jld j2, j1, HI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HI
    jjmp hh_lap
hh_his:
  jld j2, j1, ZNWD
  jst j2, j1, HTOT
  jld j11, j1, HMAX
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HHIS
  jldi j2, HWC                  ; how many words are said each number of times
  jld j3, j2, 8
  jldi j4, 1
  jadd j3, j3, j4
  jld j4, j2, 0
  jld j5, j2, 24
  hh_w:
    jjz j3, hh_wd
    jld j6, j4, 0
    jjz j6, hh_wn
    jld j6, j4, 8
    jldi j7, 3
    jshl j6, j6, j7
    jld j7, j1, HHIS
    jadd j6, j6, j7
    jld j7, j6, 0
    jldi j8, 1
    jadd j7, j7, j8
    jst j7, j6, 0
  hh_wn:
    jadd j4, j4, j5
    jldi j6, 1
    jsub j3, j3, j6
    jjmp hh_w
hh_wd:
  jld j2, j1, HMAX              ; from the most times down, until half of what is said
  jldi j3, 0
  jst j2, j1, HHC
  hh_c:
    jjz j2, hh_cd
    jldi j4, 3
    jshl j4, j2, j4
    jld j5, j1, HHIS
    jadd j4, j4, j5
    jld j4, j4, 0
    jmul j4, j4, j2
    jadd j3, j3, j4
    jst j2, j1, HHC
    jadd j4, j3, j3
    jld j5, j1, HTOT
    jsub j4, j4, j5
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, hh_cd
    jldi j4, 1
    jsub j2, j2, j4
    jjmp hh_c
hh_cd:
  jld j11, j1, ZNWD
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HHF
  jst j1, j1, HI
  hh_f:
    jldi j1, 0
    jld j2, j1, HI
    jld j3, j1, ZNWD
    jsub j3, j2, j3
    jjz j3, hh_fd
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ZWD
    jadd j3, j3, j4
    jld j5, j3, 0
    jldi j2, HWC
    jcall pl_find
    jldi j1, 0
    jld j5, j4, 8
    jld j6, j1, HHC
    jsub j5, j5, j6
    jldi j6, 63
    jsar j5, j5, j6
    jldi j6, 1
    jadd j5, j5, j6               ; 1 if its times reach the half's (0 if fewer)
    jld j2, j1, HI
    jld j3, j1, HHF
    jadd j3, j3, j2
    jstb j5, j3, 0
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HI
    jjmp hh_f
hh_fd:
  jret

; j2 = the print of word j2 (of all the book's), j3 = 1 if it is of the half. Uses j2-j4.
hl_wd:
  jldi j3, 0
  jld j3, j3, HHF
  jadd j3, j3, j2
  jldb j3, j3, 0
  jldi j4, 24
  jmul j4, j2, j4
  jldi j2, 0
  jld j2, j2, ZWD
  jadd j4, j4, j2
  jld j2, j4, 0
  jret

; j5 = j5 * 1000003 xor j6. Uses j5, j7.
hl_mix:
  jldi j7, 0Fh
  jshi j7, 4243h
  jmul j5, j5, j7
  jxor j5, j5, j6
  jret

; The pairs: every form "_ <one to three words> _" in a line, its places holding two words not of the half and not the
; same: the form by its words (HMID, HMA), the pair once by form (HFT, HFL). Uses j1-j14.
hl_facts:
  jldi j1, 0
  jld j11, j1, ZNWD
  jldi j2, 3
  jmul j11, j11, j2
  jldi j2, 2
  jadd j11, j11, j2
  jst j11, j1, HT1
  jldi j2, 48
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HMA
  jld j11, j1, HT1
  jldi j2, 32
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HFL
  jldi j2, HMID
  jldi j3, 16
  jcall pl_new
  jldi j2, HFT
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jst j1, j1, HNM
  jst j1, j1, HNF
  jst j1, j1, HL
  hf_line:
    jldi j1, 0
    jld j2, j1, HL
    jld j3, j1, ZNLN
    jsub j3, j2, j3
    jjz j3, hf_done
    jcall en_rec
    jldi j1, 0
    jst j3, j1, HT2               ; the line's record
    jst j1, j1, HI
    hf_i:
      jldi j1, 0
      jld j2, j1, HI
      jld j3, j1, HT2
      jld j4, j3, 16
      jsub j4, j2, j4
      jjz j4, hf_lnext
      jld j4, j3, 8
      jadd j2, j2, j4
      jst j2, j1, HT3             ; the word's place in the book
      jcall hl_wd
      jjnz j3, hf_inext           ; of the half: no place
      jldi j1, 0
      jst j2, j1, HA
      jldi j2, 1
      jst j2, j1, HK
      hf_k:
        jldi j1, 0
        jld j2, j1, HK
        jldi j3, 4
        jsub j3, j2, j3
        jjz j3, hf_inext          ; (three words at most between)
        jld j3, j1, HI
        jadd j3, j3, j2
        jldi j4, 1
        jadd j3, j3, j4           ; the second place, in the line
        jld j4, j1, HT2
        jld j4, j4, 16
        jsub j4, j3, j4
        jldi j5, 63
        jsar j4, j4, j5
        jjz j4, hf_inext          ; past the line
        jld j2, j1, HT3
        jld j4, j1, HK
        jadd j2, j2, j4
        jldi j4, 1
        jadd j2, j2, j4
        jcall hl_wd
        jjnz j3, hf_knext
        jldi j1, 0
        jld j3, j1, HA
        jsub j3, j3, j2
        jjz j3, hf_knext          ; the same word
        jst j2, j1, HB
        jld j5, j1, HK            ; the form's key: how many words, and them
        jst j1, j1, HJ
        hf_m:
          jldi j1, 0
          jld j2, j1, HJ
          jld j3, j1, HK
          jsub j3, j2, j3
          jjz j3, hf_md
          jld j3, j1, HT3
          jadd j2, j2, j3
          jldi j3, 1
          jadd j2, j2, j3
          jst j5, j1, HKEY
          jcall hl_wd
          jldi j1, 0
          jld j5, j1, HKEY
          jadd j6, j2, j1
          jcall hl_mix
          jld j2, j1, HJ
          jldi j3, 1
          jadd j2, j2, j3
          jst j2, j1, HJ
          jjmp hf_m
      hf_md:
        jjnz j5, hf_mk
        jldi j5, 1
      hf_mk:
        jst j5, j1, HKEY
        jldi j2, HMID
        jcall pl_take
        jldi j1, 0
        jjz j6, hf_old
        jld j6, j1, HNM           ; a new form: its number, where it is
        jst j6, j4, 8
        jldi j7, 48
        jmul j7, j6, j7
        jld j8, j1, HMA
        jadd j7, j7, j8
        jld j8, j1, HKEY
        jst j8, j7, 0
        jld j8, j1, HT2
        jst j8, j7, 8
        jld j8, j1, HI
        jldi j9, 1
        jadd j8, j8, j9
        jst j8, j7, 16
        jld j8, j1, HK
        jst j8, j7, 24
        jst j1, j7, 32
        jldi j8, -1
        jst j8, j7, 40
        jldi j8, 1
        jadd j6, j6, j8
        jst j6, j1, HNM
      hf_old:
        jld j6, j4, 8
        jst j6, j1, HM
        jld j5, j1, HKEY          ; the pair's key: the form's, its two words
        jld j6, j1, HA
        jcall hl_mix
        jld j6, j1, HB
        jcall hl_mix
        jjnz j5, hf_fk
        jldi j5, 1
      hf_fk:
        jldi j2, HFT
        jcall pl_take
        jldi j1, 0
        jjz j6, hf_knext          ; (said already by this form)
        jld j6, j1, HNF
        jldi j7, 5
        jshl j7, j6, j7
        jld j8, j1, HFL
        jadd j7, j7, j8
        jld j8, j1, HM
        jst j8, j7, 0
        jld j9, j1, HA
        jst j9, j7, 8
        jld j9, j1, HB
        jst j9, j7, 16
        jldi j9, 48
        jmul j9, j8, j9
        jld j10, j1, HMA
        jadd j9, j9, j10
        jld j10, j9, 40
        jst j10, j7, 24
        jst j6, j9, 40
        jld j10, j9, 32
        jldi j11, 1
        jadd j10, j10, j11
        jst j10, j9, 32
        jadd j6, j6, j11
        jst j6, j1, HNF
      hf_knext:
        jldi j1, 0
        jld j2, j1, HK
        jldi j3, 1
        jadd j2, j2, j3
        jst j2, j1, HK
        jjmp hf_k
    hf_inext:
      jldi j1, 0
      jld j2, j1, HI
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, HI
      jjmp hf_i
  hf_lnext:
    jldi j1, 0
    jld j2, j1, HL
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HL
    jjmp hf_line
hf_done:
  jret

; The pair HA, HB of form HM (HTG 1 if crossed) by its two words, either way (HKEY; HDIR 1 if HA is the first). Pass
; HPASS 1: counted (HGT); 2: put where its words' pairs go (HGE). Uses j1-j14.
hl_entry:
  jldi j1, 0
  jld j2, j1, HA
  jld j3, j1, HB
  jldi j4, 1
  jshr j5, j2, j4
  jshr j6, j3, j4
  jsub j5, j5, j6
  jjnz j5, he_cmp
  jand j5, j2, j4
  jand j6, j3, j4
  jsub j5, j5, j6
he_cmp:
  jldi j6, 63
  jsar j5, j5, j6               ; -1 if HA comes first
  jldi j6, 1
  jand j5, j5, j6
  jst j5, j1, HDIR
  jjnz j5, he_ab
  jadd j4, j3, j1               ; (the first, the second)
  jadd j3, j2, j1
  jadd j2, j4, j1
he_ab:
  jadd j5, j2, j1
  jadd j6, j3, j1
  jcall hl_mix
  jldi j6, 7
  jcall hl_mix
  jjnz j5, he_k
  jldi j5, 1
he_k:
  jst j5, j1, HKEY
  jld j2, j1, HPASS
  jldi j3, 1
  jsub j2, j2, j3
  jjnz j2, he_put
  jldi j2, HGT
  jcall pl_take
  jldi j1, 0
  jld j7, j4, 8
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j4, 8
  jret
he_put:
  jldi j2, HGT
  jcall pl_find
  jldi j1, 0
  jld j7, j4, 16
  jld j8, j4, 24
  jadd j7, j7, j8
  jldi j9, 1
  jadd j8, j8, j9
  jst j8, j4, 24
  jldi j8, 24
  jmul j7, j7, j8
  jld j8, j1, HGE
  jadd j7, j7, j8
  jld j8, j1, HM
  jst j8, j7, 0
  jld j8, j1, HDIR
  jst j8, j7, 8
  jld j8, j1, HTG
  jst j8, j7, 16
  jret

; Every pair of a form said by two, and its crossed one (the second word of the form's pair before it, the last for
; the first one), by its two words: counted, given their places, put (HGT, HGE). Uses j1-j14.
hl_groups:
  jldi j2, HGT
  jcall hl_clear
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, HPASS
  hg_pass:
    jldi j1, 0
    jst j1, j1, HI
    hg_lap:
      jldi j1, 0
      jld j2, j1, HI
      jld j3, j1, HNF
      jsub j3, j2, j3
      jjz j3, hg_pend
      jldi j3, 5
      jshl j3, j2, j3
      jld j4, j1, HFL
      jadd j3, j3, j4
      jst j3, j1, HT4             ; the pair
      jld j5, j3, 0
      jst j5, j1, HM
      jldi j6, 48
      jmul j6, j5, j6
      jld j7, j1, HMA
      jadd j6, j6, j7
      jst j6, j1, HT5             ; its form
      jld j7, j6, 32
      jldi j8, 2
      jsub j7, j7, j8
      jldi j8, 63
      jsar j7, j7, j8
      jjnz j7, hg_next            ; said by one: a memory
      jld j2, j1, HM              ; its relation, and if it is turned against it
      jcall hl_find
      jldi j1, 0
      jst j2, j1, HM
      jst j3, j1, HT1
      jld j3, j1, HT4
      jld j7, j3, 8
      jld j8, j3, 16
      jld j9, j1, HT1
      jjz j9, hg_or
      jadd j9, j7, j1
      jadd j7, j8, j1
      jadd j8, j9, j1
  hg_or:
      jst j7, j1, HA
      jst j8, j1, HB
      jst j1, j1, HTG
      jcall hl_entry
      jldi j1, 0                  ; crossed: the second word of the pair before it
      jld j3, j1, HT4
      jld j7, j3, 24
      jldi j8, 63
      jsar j8, j7, j8
      jjz j8, hg_prev
      jld j6, j1, HT5
      jld j7, j6, 40
  hg_prev:
      jldi j8, 5
      jshl j7, j7, j8
      jld j8, j1, HFL
      jadd j7, j7, j8
      jld j7, j7, 16              ; the crossed second word
      jld j8, j3, 8               ; its first
      jsub j9, j8, j7
      jjz j9, hg_next
      jld j9, j1, HT1
      jjz j9, hg_cor
      jadd j9, j7, j1
      jadd j7, j8, j1
      jadd j8, j9, j1
  hg_cor:
      jst j8, j1, HA
      jst j7, j1, HB
      jldi j7, 1
      jst j7, j1, HTG
      jcall hl_entry
    hg_next:
      jldi j1, 0
      jld j2, j1, HI
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, HI
      jjmp hg_lap
  hg_pend:
    jld j2, j1, HPASS
    jldi j3, 2
    jsub j3, j2, j3
    jjz j3, hg_done
    jldi j2, HGT                  ; each pair of words its place: where the ones before end
    jld j3, j2, 8
    jldi j4, 1
    jadd j3, j3, j4
    jld j4, j2, 0
    jld j5, j2, 24
    jldi j6, 0
    hg_s:
      jjz j3, hg_sd
      jld j7, j4, 0
      jjz j7, hg_sn
      jst j6, j4, 16
      jst j1, j4, 24
      jld j7, j4, 8
      jadd j6, j6, j7
    hg_sn:
      jadd j4, j4, j5
      jldi j7, 1
      jsub j3, j3, j7
      jjmp hg_s
  hg_sd:
    jst j6, j1, HNGE
    jldi j2, 2
    jst j2, j1, HPASS
    jjmp hg_pass
hg_done:
  jret

; Two forms that hold the same pair of words: the same way (1) or the other way round (2), as read or crossed (HAG:
; how many read alike, how many with one of them crossed). Uses j1-j14.
hl_agree:
  jldi j2, HAG
  jcall hl_clear
  jldi j1, 0
  jldi j2, HGT
  jld j3, j2, 8
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, HT1               ; places left
  jld j4, j2, 0
  jst j4, j1, HT2               ; the place
  ha_g:
    jldi j1, 0
    jld j3, j1, HT1
    jjz j3, ha_done
    jld j4, j1, HT2
    jld j5, j4, 0
    jjz j5, ha_gn
    jld j5, j4, 8
    jldi j6, 2
    jsub j6, j5, j6
    jldi j7, 63
    jsar j6, j6, j7
    jjnz j6, ha_gn
    jst j1, j1, HI
    ha_x:
      jldi j1, 0
      jld j4, j1, HT2
      jld j2, j1, HI
      jld j3, j4, 8
      jsub j3, j2, j3
      jjz j3, ha_gn
      jldi j3, 1
      jadd j3, j2, j3
      jst j3, j1, HJ
      ha_y:
        jldi j1, 0
        jld j4, j1, HT2
        jld j3, j1, HJ
        jld j5, j4, 8
        jsub j5, j3, j5
        jjz j5, ha_xn
        jld j5, j4, 16
        jld j6, j1, HI
        jadd j6, j6, j5
        jldi j7, 24
        jmul j6, j6, j7
        jld j8, j1, HGE
        jadd j6, j6, j8           ; x
        jadd j9, j3, j5
        jmul j9, j9, j7
        jadd j9, j9, j8           ; y
        jld j10, j6, 0
        jld j11, j9, 0
        jsub j12, j10, j11
        jjz j12, ha_yn            ; one relation with itself
        jld j12, j6, 16
        jld j13, j9, 16
        jand j14, j12, j13
        jjnz j14, ha_yn           ; both crossed
        jor j14, j12, j13
        jst j14, j1, HTG          ; 1 if one is crossed
        jld j12, j6, 8
        jld j13, j9, 8
        jsub j12, j12, j13
        jldi j13, 1
        jjz j12, ha_same
        jldi j13, 2
      ha_same:
        jst j13, j1, HDIR
        jsub j12, j10, j11        ; the first form, the second
        jldi j14, 63
        jsar j12, j12, j14
        jjnz j12, ha_ord
        jadd j12, j10, j1
        jadd j10, j11, j1
        jadd j11, j12, j1
      ha_ord:
        jst j10, j1, HA
        jst j11, j1, HB
        jadd j5, j10, j1
        jadd j6, j11, j1
        jcall hl_mix
        jld j6, j1, HDIR
        jcall hl_mix
        jjnz j5, ha_k
        jldi j5, 1
      ha_k:
        jldi j2, HAG
        jcall pl_take
        jldi j1, 0
        jjz j6, ha_old
        jld j7, j1, HA
        jst j7, j4, 8
        jld j7, j1, HB
        jst j7, j4, 16
        jld j7, j1, HDIR
        jst j7, j4, 24
      ha_old:
        jld j7, j1, HTG
        jldi j8, 3
        jshl j7, j7, j8
        jadd j7, j7, j4
        jld j8, j7, 32
        jldi j9, 1
        jadd j8, j8, j9
        jst j8, j7, 32
      ha_yn:
        jldi j1, 0
        jld j3, j1, HJ
        jldi j4, 1
        jadd j3, j3, j4
        jst j3, j1, HJ
        jjmp ha_y
    ha_xn:
      jldi j1, 0
      jld j2, j1, HI
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, HI
      jjmp ha_x
  ha_gn:
    jldi j1, 0
    jld j4, j1, HT2
    jldi j5, HGT
    jld j5, j5, 24
    jadd j4, j4, j5
    jst j4, j1, HT2
    jld j3, j1, HT1
    jldi j4, 1
    jsub j3, j3, j4
    jst j3, j1, HT1
    jjmp ha_g
ha_done:
  jret

; The words of form j2 (by its number). Uses j1-j14.
hl_sayform:
  jldi j3, 48
  jmul j3, j2, j3
  jldi j1, 0
  jld j4, j1, HMA
  jadd j3, j3, j4
  jld j2, j3, 8
  jld j4, j3, 24
  jld j3, j3, 16
  jadd j4, j3, j4
  jldi j5, -1
  jjmp en_saywords

; The tanda (Capitan, 2026-11-08: "that the 7^3 cube learns 16 relations at a time"): the forms of the strongest
; relations of relations (each brings its two), until HTK of them. For each, the three bottom pieces (of HTN^2) its
; pairs fall on most, a pair by its two words either way (A xor B), as the cube's "cosa"; a form with fewer pieces than
; three is filled with pieces of its own key (nothing it holds, but not another's); and the same for its pairs crossed
; (the null). Said "T: i p p p | words", "N: i p p p", and the relations of relations among them, "R: i j way pairs".
; And each form whole, as a song (Capitan, 2026-11-08: "that it hears it"): each of its pairs a note of three pieces
; (from its two words either way), "P: i p p p" a note, "Q: i p p p" a note of its pairs crossed. Only relations whose
; forms fit in a song are taken: 255 notes at most, what a melody holds (measured: a melody joins up to 255 greetings).
; Then the new ones, for the cube to hear without learning them: forms not chosen that relate to a chosen one (the
; strongest first, as many as the chosen at most), "U: j r way pairs | words" (r the chosen one it relates to), and
; their songs, "V: j p p p" ("W:" crossed). And each one's cap and surname (Capitan, 2026-11-08: "we look at the
; surname: two distinctions, the cap's color and the surname, and we can tell even brothers apart"): its cap, a note a
; word of the form itself ("G: i p p p"; "H:" for the new ones), what only it has; its surname, a note a word its
; pairs say, the words said by two of its pairs or more (the most said, if they do not fit in a song with its cap)
; ("A: i p p p"; "B:" for the new ones), what its relatives share: "hijo de" and "padre de" share three pairs, but
; the names of the same family. Uses j1-j14.
hl_tanda:
  jldi j1, 0
  jld j11, j1, HTK
  jadd j11, j11, j11
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jst j11, j1, HT1
  jcall room
  jldi j1, 0
  jst j13, j1, HCH
  jld j11, j1, HT1
  jcall room
  jldi j1, 0
  jst j13, j1, HUS
  jld j11, j1, HTN
  jmul j11, j11, j11
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HCNT
  jst j1, j1, HNCH
  jst j1, j1, HNUS
  ht_pick:                      ; the strongest relation of relations not taken yet
    jldi j1, 0
    jld j2, j1, HNCH
    jld j3, j1, HTK
    jsub j3, j2, j3
    jjz j3, ht_picked
    jst j1, j1, HTBEST
    jst j1, j1, HTE
    jldi j2, HAG
    jld j3, j2, 8
    jldi j5, 1
    jadd j3, j3, j5
    jst j3, j1, HTI
    jld j4, j2, 0
    jst j4, j1, HTJ
    ht_s:
      jldi j1, 0
      jld j3, j1, HTI
      jjz j3, ht_sd
      jld j4, j1, HTJ
      jld j5, j4, 0
      jjz j5, ht_sn
      jcall hl_score
      jldi j1, 0
      jjz j6, ht_sn
      jld j7, j4, 8               ; (both forms fit in a song)
      jcall ht_fits
      jjz j7, ht_sn
      jld j7, j4, 16
      jcall ht_fits
      jjz j7, ht_sn
      jld j7, j1, HTBEST
      jsub j7, j7, j6
      jldi j8, 63
      jsar j7, j7, j8
      jjz j7, ht_sn
      jld j7, j1, HNUS            ; (not taken)
      jld j8, j1, HUS
      ht_u:
        jjz j7, ht_new
        jld j9, j8, 0
        jsub j9, j9, j4
        jjz j9, ht_sn
        jldi j9, 8
        jadd j8, j8, j9
        jldi j9, 1
        jsub j7, j7, j9
        jjmp ht_u
    ht_new:
      jst j6, j1, HTBEST
      jst j4, j1, HTE
    ht_sn:
      jldi j1, 0
      jld j4, j1, HTJ
      jldi j5, HAG
      jld j5, j5, 24
      jadd j4, j4, j5
      jst j4, j1, HTJ
      jld j3, j1, HTI
      jldi j5, 1
      jsub j3, j3, j5
      jst j3, j1, HTI
      jjmp ht_s
  ht_sd:
    jld j4, j1, HTE
    jjz j4, ht_picked             ; none left
    jld j5, j1, HNUS
    jldi j6, 3
    jshl j6, j5, j6
    jld j7, j1, HUS
    jadd j6, j6, j7
    jst j4, j6, 0
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j1, HNUS
    jldi j9, 8
    ht_side:                      ; its two forms, if not chosen yet
      jldi j1, 0
      jld j2, j1, HNCH
      jld j3, j1, HTK
      jsub j3, j2, j3
      jjz j3, ht_pick
      jld j4, j1, HTE
      jadd j4, j4, j9
      jld j4, j4, 0
      jldi j5, 3
      jshl j5, j4, j5
      jld j6, j1, HBST
      jadd j5, j5, j6
      jld j6, j5, 0
      jjnz j6, ht_sidn
      jldi j6, 1
      jst j6, j5, 0
      jldi j5, 3
      jshl j5, j2, j5
      jld j6, j1, HCH
      jadd j5, j5, j6
      jst j4, j5, 0
      jldi j5, 1
      jadd j2, j2, j5
      jst j2, j1, HNCH
    ht_sidn:
      jldi j5, 16
      jsub j5, j9, j5
      jjz j5, ht_pick
      jldi j9, 16
      jjmp ht_side
ht_picked:
  jldi j2, HAG                  ; the relations of relations among them
  jld j3, j2, 8
  jldi j5, 1
  jadd j3, j3, j5
  jst j3, j1, HTI
  jld j4, j2, 0
  jst j4, j1, HTJ
  ht_r:
    jldi j1, 0
    jld j3, j1, HTI
    jjz j3, ht_rd
    jld j4, j1, HTJ
    jld j5, j4, 0
    jjz j5, ht_rn
    jcall hl_score
    jldi j1, 0
    jjz j6, ht_rn
    jld j2, j4, 8
    jcall ht_index
    jldi j7, 63
    jsar j7, j6, j7
    jjnz j7, ht_rn
    jst j6, j1, HP1
    jld j4, j1, HTJ
    jld j2, j4, 16
    jcall ht_index
    jldi j7, 63
    jsar j7, j6, j7
    jjnz j7, ht_rn
    jst j6, j1, HP2
    jldi j1, S_RT
    jcall puts
    jld j2, j1, HP1
    jcall putnum
    jldi j2, 32
    jcall putch
    jld j2, j1, HP2
    jcall putnum
    jldi j2, 32
    jcall putch
    jld j4, j1, HTJ
    jld j2, j4, 24
    jcall putnum
    jldi j2, 32
    jcall putch
    jld j4, j1, HTJ
    jld j2, j4, 32
    jcall putnum
    jldi j2, 10
    jcall putch
  ht_rn:
    jldi j1, 0
    jld j4, j1, HTJ
    jldi j5, HAG
    jld j5, j5, 24
    jadd j4, j4, j5
    jst j4, j1, HTJ
    jld j3, j1, HTI
    jldi j5, 1
    jsub j3, j3, j5
    jst j3, j1, HTI
    jjmp ht_r
ht_rd:
  jldi j2, S_PT
  jst j2, j1, HSR
  jldi j2, S_QT
  jst j2, j1, HSC
  jst j1, j1, HTI
  ht_c:                         ; each form's pieces, read and crossed
    jldi j1, 0
    jld j2, j1, HTI
    jld j3, j1, HNCH
    jsub j3, j2, j3
    jjz j3, ht_done
    jst j2, j1, HTSAY
    jst j1, j1, HTG
    jcall ht_code
    jldi j1, S_TT
    jcall ht_say
    jld j2, j1, HTI
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, HCH
    jadd j3, j3, j4
    jld j2, j3, 0
    jcall hl_sayform
    jldi j2, 10
    jcall putch
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, HTG
    jcall ht_code
    jldi j1, S_NT
    jcall ht_say
    jldi j2, 10
    jcall putch
    jldi j1, 0
    jst j1, j1, HTG
    jcall ht_song
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, HTG
    jcall ht_song
    jldi j1, S_GT
    jcall ht_cap
    jldi j1, S_AT
    jcall ht_surname
    jldi j1, 0
    jld j2, j1, HTI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HTI
    jjmp ht_c
ht_done:
  jcall ht_news
  jret

; The new ones: forms not chosen that relate to a chosen one (the strongest first, as many as the chosen at most),
; each said "U: j r way pairs | words" and sung ("V:", "W:" crossed). Uses j1-j14.
ht_news:
  jldi j1, 0
  jst j1, j1, HNNEW
  jldi j2, S_VT
  jst j2, j1, HSR
  jldi j2, S_WT
  jst j2, j1, HSC
  hn_pick:
    jldi j1, 0
    jld j2, j1, HNNEW
    jld j3, j1, HNCH
    jsub j3, j2, j3
    jjz j3, hn_done
    jst j1, j1, HTBEST
    jst j1, j1, HTE
    jldi j2, HAG
    jld j3, j2, 8
    jldi j5, 1
    jadd j3, j3, j5
    jst j3, j1, HTI
    jld j4, j2, 0
    jst j4, j1, HTJ
    hn_s:
      jldi j1, 0
      jld j3, j1, HTI
      jjz j3, hn_sd
      jld j4, j1, HTJ
      jld j5, j4, 0
      jjz j5, hn_sn
      jcall hl_score
      jldi j1, 0
      jjz j6, hn_sn
      jld j7, j1, HTBEST
      jsub j7, j7, j6
      jldi j8, 63
      jsar j7, j7, j8
      jjz j7, hn_sn
      jld j7, j4, 8               ; one chosen, the other neither chosen nor new, and fitting in a song
      jcall hn_flag
      jadd j9, j7, j1
      jld j7, j4, 16
      jcall hn_flag
      jadd j10, j7, j1
      jadd j11, j9, j10
      jldi j12, 1
      jsub j11, j11, j12
      jjnz j11, hn_sn
      jjz j9, hn_c2
      jld j7, j4, 16
      jjmp hn_cf
    hn_c2:
      jld j7, j4, 8
    hn_cf:
      jcall ht_fits
      jjz j7, hn_sn
      jst j6, j1, HTBEST
      jst j4, j1, HTE
    hn_sn:
      jldi j1, 0
      jld j4, j1, HTJ
      jldi j5, HAG
      jld j5, j5, 24
      jadd j4, j4, j5
      jst j4, j1, HTJ
      jld j3, j1, HTI
      jldi j5, 1
      jsub j3, j3, j5
      jst j3, j1, HTI
      jjmp hn_s
  hn_sd:
    jld j4, j1, HTE
    jjz j4, hn_done
    jld j7, j4, 8                 ; which is the new one, which the chosen
    jcall hn_flag
    jjz j7, hn_first
    jld j2, j4, 16
    jld j3, j4, 8
    jjmp hn_put
  hn_first:
    jld j2, j4, 8
    jld j3, j4, 16
  hn_put:
    jldi j5, 3
    jshl j5, j2, j5
    jld j6, j1, HBST
    jadd j5, j5, j6
    jldi j6, 2
    jst j6, j5, 0                 ; (new now)
    jld j5, j1, HNCH
    jld j6, j1, HNNEW
    jadd j5, j5, j6
    jst j5, j1, HTI
    jldi j6, 3
    jshl j6, j5, j6
    jld j7, j1, HCH
    jadd j6, j6, j7
    jst j2, j6, 0
    jadd j2, j3, j1
    jcall ht_index
    jldi j1, 0
    jst j6, j1, HP1
    jldi j1, S_UT
    jcall puts
    jld j2, j1, HNNEW
    jcall putnum
    jldi j2, 32
    jcall putch
    jld j2, j1, HP1
    jcall putnum
    jldi j2, 32
    jcall putch
    jld j4, j1, HTE
    jld j2, j4, 24
    jcall putnum
    jldi j2, 32
    jcall putch
    jld j4, j1, HTE
    jld j2, j4, 32
    jcall putnum
    jldi j1, S_BARR
    jcall puts
    jld j2, j1, HTI
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, HCH
    jadd j3, j3, j4
    jld j2, j3, 0
    jcall hl_sayform
    jldi j2, 10
    jcall putch
    jldi j1, 0
    jld j2, j1, HNNEW
    jst j2, j1, HTSAY
    jst j1, j1, HTG
    jcall ht_song
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, HTG
    jcall ht_song
    jldi j1, S_HT
    jcall ht_cap
    jldi j1, S_BT
    jcall ht_surname
    jldi j1, 0
    jld j2, j1, HNNEW
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HNNEW
    jjmp hn_pick
hn_done:
  jret

; The three pieces of a note from value j7 (a print, or the two words of a pair): all different, of HTN^2 -> HP1-HP3.
; Uses j1, j7-j13.
ht_pieces:
  jldi j1, 0
  jldi j8, 4
  jshr j7, j7, j8
  jld j8, j1, HTN
  jmul j8, j8, j8
  jdiv j9, j7, j8
  jmul j10, j9, j8
  jsub j10, j7, j10
  jst j10, j1, HP1
  jdiv j7, j9, j8
  jmul j11, j7, j8
  jsub j11, j9, j11
  jsub j12, j11, j10
  jjnz j12, hpc_2
  jldi j12, 1
  jadd j11, j11, j12
  jsub j12, j11, j8
  jjnz j12, hpc_2
  jldi j11, 0
hpc_2:
  jst j11, j1, HP2
  jdiv j9, j7, j8
  jmul j12, j9, j8
  jsub j12, j7, j12
  hpc_3:
    jsub j13, j12, j10
    jjz j13, hpc_3n
    jsub j13, j12, j11
    jjnz j13, hpc_3d
  hpc_3n:
    jldi j13, 1
    jadd j12, j12, j13
    jsub j13, j12, j8
    jjnz j13, hpc_3
    jldi j12, 0
    jjmp hpc_3
hpc_3d:
  jst j12, j1, HP3
  jret

; The cap of form HTI (of HCH), said with the text at j1: a note a word of the form. Uses j1-j14.
ht_cap:
  jldi j2, 0
  jst j1, j2, HSX
  jldi j1, 0
  jld j2, j1, HTI
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, HCH
  jadd j3, j3, j4
  jld j2, j3, 0
  jldi j3, 48
  jmul j3, j2, j3
  jld j4, j1, HMA
  jadd j3, j3, j4
  jst j3, j1, HT3
  jst j1, j1, HTJ
  hcp_lap:
    jldi j1, 0
    jld j3, j1, HT3
    jld j4, j3, 24
    jld j5, j1, HTJ
    jsub j4, j5, j4
    jjz j4, hcp_done
    jld j2, j3, 8
    jld j4, j3, 16
    jadd j3, j4, j5
    jcall en_word
    jadd j7, j5, j1
    jcall ht_pieces
    jld j1, j1, HSX
    jcall ht_say
    jldi j2, 10
    jcall putch
    jldi j1, 0
    jld j2, j1, HTJ
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HTJ
    jjmp hcp_lap
hcp_done:
  jret

; The surname of form HTI, said with the text at j1: a note a word its pairs say, the words said by two of its pairs or
; more; if they do not fit in a song with its cap (255 notes), the most said (the fewest times raised until they fit).
; Uses j1-j14.
ht_surname:
  jldi j2, 0
  jst j1, j2, HSX
  jldi j2, HWX
  jld j3, j2, 0
  jjnz j3, hsn_have
  jldi j3, 16
  jcall pl_new
  jjmp hsn_count
hsn_have:
  jcall hl_clear
hsn_count:
  jldi j1, 0
  jld j2, j1, HTI
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, HCH
  jadd j3, j3, j4
  jld j2, j3, 0
  jldi j3, 48
  jmul j3, j2, j3
  jld j4, j1, HMA
  jadd j3, j3, j4
  jst j3, j1, HT3
  jld j2, j3, 40
  hsn_p:                        ; each word of its pairs, counted
    jldi j1, 0
    jst j2, j1, HTJ
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, hsn_pd
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, HFL
    jadd j3, j3, j4
    jld j5, j3, 8
    jcall hsn_one
    jldi j1, 0
    jld j2, j1, HTJ
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, HFL
    jadd j3, j3, j4
    jld j5, j3, 16
    jcall hsn_one
    jldi j1, 0
    jld j2, j1, HTJ
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, HFL
    jadd j3, j3, j4
    jld j2, j3, 24
    jjmp hsn_p
hsn_pd:
  jldi j2, 2                    ; the fewest times: two, raised until they fit with its cap
  jst j2, j1, HSCUT
  hsn_c:
    jldi j1, 0
    jst j1, j1, HSWN
    jldi j2, HWX
    jld j3, j2, 8
    jldi j4, 1
    jadd j3, j3, j4
    jld j4, j2, 0
    jld j5, j2, 24
    jld j6, j1, HSCUT
    hsn_w:
      jjz j3, hsn_wd
      jld j7, j4, 0
      jjz j7, hsn_wn
      jld j7, j4, 8
      jsub j7, j7, j6
      jldi j8, 63
      jsar j7, j7, j8
      jjnz j7, hsn_wn
      jld j7, j1, HSWN
      jldi j8, 1
      jadd j7, j7, j8
      jst j7, j1, HSWN
    hsn_wn:
      jadd j4, j4, j5
      jldi j7, 1
      jsub j3, j3, j7
      jjmp hsn_w
  hsn_wd:
    jld j3, j1, HT3
    jld j3, j3, 24
    jld j2, j1, HSWN
    jadd j2, j2, j3
    jldi j3, 256
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, hsn_say
    jld j2, j1, HSCUT
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HSCUT
    jjmp hsn_c
hsn_say:
  jldi j2, HWX
  jld j3, j2, 8
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, HT4
  jld j4, j2, 0
  jst j4, j1, HT5
  hsn_s:
    jldi j1, 0
    jld j3, j1, HT4
    jjz j3, hsn_done
    jld j4, j1, HT5
    jld j7, j4, 0
    jjz j7, hsn_sn
    jld j8, j4, 8
    jld j9, j1, HSCUT
    jsub j8, j8, j9
    jldi j9, 63
    jsar j8, j8, j9
    jjnz j8, hsn_sn
    jcall ht_pieces
    jld j1, j1, HSX
    jcall ht_say
    jldi j2, 10
    jcall putch
  hsn_sn:
    jldi j1, 0
    jld j4, j1, HT5
    jldi j5, HWX
    jld j5, j5, 24
    jadd j4, j4, j5
    jst j4, j1, HT5
    jld j3, j1, HT4
    jldi j5, 1
    jsub j3, j3, j5
    jst j3, j1, HT4
    jjmp hsn_s
hsn_done:
  jret

; Word j5 of a pair counted in HWX. Uses j1-j8.
hsn_one:
  jldi j2, HWX
  jcall pl_take
  jldi j1, 0
  jld j7, j4, 8
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j4, 8
  jret

; j7 = the flag of form j7 (0 nothing, 1 chosen, 2 new). Uses j7, j8.
hn_flag:
  jldi j8, 3
  jshl j7, j7, j8
  jldi j8, 0
  jld j8, j8, HBST
  jadd j7, j7, j8
  jld j7, j7, 0
  jret

; j7 = 1 if form j7 fits in a song (255 pairs at most). Uses j7, j8.
ht_fits:
  jldi j8, 48
  jmul j7, j7, j8
  jldi j8, 0
  jld j8, j8, HMA
  jadd j7, j7, j8
  jld j7, j7, 32
  jldi j8, 256
  jsub j7, j7, j8
  jldi j8, 63
  jsar j7, j7, j8
  jldi j8, 1
  jand j7, j7, j8
  jret

; The chosen form HTI as a song, a note a pair (HTG 1: its pairs crossed): "P: i p p p" ("Q:" crossed), the three
; pieces of a pair from its two words either way (A xor B), all different. Uses j1-j14.
ht_song:
  jldi j1, 0
  jld j2, j1, HTN
  jmul j2, j2, j2
  jst j2, j1, HT2
  jld j2, j1, HTI
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, HCH
  jadd j3, j3, j4
  jld j2, j3, 0
  jldi j3, 48
  jmul j3, j2, j3
  jld j4, j1, HMA
  jadd j3, j3, j4
  jst j3, j1, HT3
  jld j2, j3, 40
  hsg_lap:
    jldi j1, 0
    jst j2, j1, HTJ
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, hsg_done
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, HFL
    jadd j3, j3, j4
    jld j5, j3, 8
    jld j6, j3, 16
    jld j7, j1, HTG
    jjz j7, hsg_k
    jld j7, j3, 24
    jldi j8, 63
    jsar j8, j7, j8
    jjz j8, hsg_pv
    jld j8, j1, HT3
    jld j7, j8, 40
  hsg_pv:
    jldi j8, 5
    jshl j7, j7, j8
    jadd j7, j7, j4
    jld j6, j7, 16
  hsg_k:
    jsub j7, j5, j6
    jjz j7, hsg_next
    jxor j7, j5, j6
    jldi j8, 4
    jshr j7, j7, j8
    jld j8, j1, HT2
    jdiv j9, j7, j8             ; the first piece
    jmul j10, j9, j8
    jsub j10, j7, j10
    jst j10, j1, HP1
    jdiv j7, j9, j8             ; the second, not the first
    jmul j11, j7, j8
    jsub j11, j9, j11
    jsub j12, j11, j10
    jjnz j12, hsg_2
    jldi j12, 1
    jadd j11, j11, j12
    jsub j12, j11, j8
    jjnz j12, hsg_2
    jldi j11, 0
  hsg_2:
    jst j11, j1, HP2
    jdiv j9, j7, j8             ; the third, not the others
    jmul j12, j9, j8
    jsub j12, j7, j12
    hsg_3:
      jsub j13, j12, j10
      jjz j13, hsg_3n
      jsub j13, j12, j11
      jjnz j13, hsg_3d
    hsg_3n:
      jldi j13, 1
      jadd j12, j12, j13
      jsub j13, j12, j8
      jjnz j13, hsg_3
      jldi j12, 0
      jjmp hsg_3
  hsg_3d:
    jst j12, j1, HP3
    jld j2, j1, HTG
    jld j3, j1, HSR
    jjz j2, hsg_say
    jld j3, j1, HSC
  hsg_say:
    jadd j1, j3, j1
    jcall ht_say
    jldi j2, 10
    jcall putch
  hsg_next:
    jldi j1, 0
    jld j2, j1, HTJ
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, HFL
    jadd j3, j3, j4
    jld j2, j3, 24
    jjmp hsg_lap
hsg_done:
  jret

; The place of form j2 among the chosen -> j6 (-1: not chosen). Uses j6-j8.
ht_index:
  jldi j6, 0
  hti_lap:
    jldi j7, 0
    jld j7, j7, HNCH
    jsub j7, j6, j7
    jjz j7, hti_no
    jldi j7, 3
    jshl j7, j6, j7
    jldi j8, 0
    jld j8, j8, HCH
    jadd j7, j7, j8
    jld j7, j7, 0
    jsub j7, j7, j2
    jjz j7, hti_yes
    jldi j7, 1
    jadd j6, j6, j7
    jjmp hti_lap
hti_yes:
  jret
hti_no:
  jldi j6, -1
  jret

; The text at j1, then "i p p p" (HTI, HP1-HP3), then " | ". Uses j1-j14.
ht_say:
  jcall puts
  jld j2, j1, HTSAY
  jcall putnum
  jldi j2, 32
  jcall putch
  jld j2, j1, HP1
  jcall putnum
  jldi j2, 32
  jcall putch
  jld j2, j1, HP2
  jcall putnum
  jldi j2, 32
  jcall putch
  jld j2, j1, HP3
  jcall putnum
  jldi j1, S_BARR
  jcall puts
  jret

; The three pieces of the chosen form HTI, by its pairs (HTG 1: crossed) -> HP1, HP2, HP3. Uses j1-j14.
ht_code:
  jldi j1, 0
  jld j2, j1, HTN
  jmul j2, j2, j2
  jst j2, j1, HT2               ; n^2
  jld j3, j1, HCNT
  jadd j4, j2, j1
  htz:
    jjz j4, htz_d
    jst j1, j3, 0
    jldi j5, 8
    jadd j3, j3, j5
    jldi j5, 1
    jsub j4, j4, j5
    jjmp htz
htz_d:
  jld j2, j1, HTI
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, HCH
  jadd j3, j3, j4
  jld j2, j3, 0
  jldi j3, 48
  jmul j3, j2, j3
  jld j4, j1, HMA
  jadd j3, j3, j4
  jst j3, j1, HT3               ; its form
  jld j2, j3, 40                ; its last pair
  htp:
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, htp_d
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, HFL
    jadd j3, j3, j4
    jld j5, j3, 8               ; A
    jld j6, j3, 16              ; B
    jld j7, j1, HTG
    jjz j7, htp_k
    jld j7, j3, 24              ; crossed: the B of the pair before (the last's, for the first)
    jldi j8, 63
    jsar j8, j7, j8
    jjz j8, htp_pv
    jld j8, j1, HT3
    jld j7, j8, 40
  htp_pv:
    jldi j8, 5
    jshl j7, j7, j8
    jadd j7, j7, j4
    jld j6, j7, 16
  htp_k:
    jsub j7, j5, j6
    jjz j7, htp_n
    jxor j7, j5, j6
    jldi j8, 20
    jshr j7, j7, j8
    jld j8, j1, HT2
    jdiv j9, j7, j8
    jmul j9, j9, j8
    jsub j7, j7, j9
    jldi j8, 3
    jshl j7, j7, j8
    jld j8, j1, HCNT
    jadd j7, j7, j8
    jld j8, j7, 0
    jldi j9, 1
    jadd j8, j8, j9
    jst j8, j7, 0
  htp_n:
    jld j2, j3, 24
    jjmp htp
htp_d:
  jldi j2, -1
  jst j2, j1, HP1
  jst j2, j1, HP2
  jst j2, j1, HP3
  jldi j10, HP1
  jldi j11, 3
  htt:                          ; three times: the most hit not taken (none: one of its own key)
    jjz j11, htt_d
    jldi j12, -1
    jldi j13, 0
    jldi j14, 0
    htx:
      jld j2, j1, HT2
      jsub j2, j14, j2
      jjz j2, htx_d
      jadd j2, j14, j1
      jcall ht_taken
      jjnz j6, htx_n
      jldi j2, 3
      jshl j2, j14, j2
      jld j3, j1, HCNT
      jadd j2, j2, j3
      jld j2, j2, 0
      jsub j3, j13, j2
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, htx_n
      jadd j12, j14, j1
      jadd j13, j2, j1
    htx_n:
      jldi j2, 1
      jadd j14, j14, j2
      jjmp htx
  htx_d:
    jldi j2, 63
    jsar j2, j12, j2
    jjz j2, htt_put
    jld j3, j1, HT3             ; of its own key
    jld j2, j3, 0
    jldi j4, 1
    jshr j2, j2, j4
    htk:
      jld j4, j1, HT2
      jdiv j5, j2, j4
      jmul j5, j5, j4
      jsub j12, j2, j5
      jadd j2, j12, j1
      jcall ht_taken
      jjz j6, htt_put
      jldi j4, 7
      jadd j2, j12, j4
      jjmp htk
  htt_put:
    jst j12, j10, 0
    jldi j2, 8
    jadd j10, j10, j2
    jldi j2, 1
    jsub j11, j11, j2
    jjmp htt
htt_d:
  jret

; j6 = 1 if piece j2 is one of HP1-HP3. Uses j6, j7.
ht_taken:
  jldi j6, 0
  jld j7, j6, HP1
  jsub j7, j7, j2
  jjz j7, htk_y
  jld j7, j6, HP2
  jsub j7, j7, j2
  jjz j7, htk_y
  jld j7, j6, HP3
  jsub j7, j7, j2
  jjz j7, htk_y
  jret
htk_y:
  jldi j6, 1
  jret

; The two numbers of the house's "tanda" (how many forms, the cube's side) in PRB, PRN -> HTK, HTN. Uses j1-j6.
hl_tread:
  jldi j1, 0
  jst j1, j1, HTK
  jst j1, j1, HTN
  jld j2, j1, PRB
  jld j3, j1, PRN
  jldi j4, HTK
  jldi j5, 0                    ; in a number
  htr_lap:
    jjz j3, htr_done
    jldb j6, j2, 0
    jldi j7, 48
    jsub j7, j6, j7
    jldi j8, 63
    jsar j8, j7, j8
    jjnz j8, htr_gap
    jldi j8, 10
    jsub j8, j7, j8
    jldi j9, 63
    jsar j8, j8, j9
    jjz j8, htr_gap
    jld j8, j4, 0
    jldi j9, 10
    jmul j8, j8, j9
    jadd j8, j8, j7
    jst j8, j4, 0
    jldi j5, 1
    jjmp htr_next
  htr_gap:
    jjz j5, htr_next
    jldi j5, 0
    jldi j8, HTN
    jsub j8, j4, j8
    jjz j8, htr_done
    jldi j4, HTN
  htr_next:
    jldi j6, 1
    jadd j2, j2, j6
    jsub j3, j3, j6
    jjmp htr_lap
htr_done:
  jret

; What it read: the words, the half, the forms said by two. Uses j1-j14.
hl_say0:
  jldi j1, 0
  jst j1, j1, HT1
  jst j1, j1, HI
  hs_m:
    jldi j1, 0
    jld j2, j1, HI
    jld j3, j1, HNM
    jsub j3, j2, j3
    jjz j3, hs_md
    jldi j3, 48
    jmul j3, j2, j3
    jld j4, j1, HMA
    jadd j3, j3, j4
    jld j3, j3, 32
    jldi j4, 2
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, hs_mn
    jld j3, j1, HT1
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, HT1
  hs_mn:
    jld j2, j1, HI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HI
    jjmp hs_m
hs_md:
  jldi j1, S_PAL
  jcall puts
  jld j2, j1, HTOT
  jcall putnum
  jldi j1, S_MITAD
  jcall puts
  jld j2, j1, HHC
  jcall putnum
  jldi j1, S_VECES
  jcall puts
  jld j2, j1, HT1
  jcall putnum
  jldi j1, S_DE
  jcall puts
  jld j2, j1, HNM
  jcall putnum
  jldi j2, 10
  jcall putch
  jret

; The rooms the while uses: by form the one it joined, if turned, how many forms; the strongest by relation; where the
; pairs go by their words (each pair and its crossed one, at most); the tables. Uses j1-j14.
hl_rooms:
  jldi j1, 0
  jld j11, j1, HNM
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jst j11, j1, HT1
  jcall room
  jldi j1, 0
  jst j13, j1, HCLS
  jld j11, j1, HT1
  jcall room
  jldi j1, 0
  jst j13, j1, HPAR
  jld j11, j1, HT1
  jcall room
  jldi j1, 0
  jst j13, j1, HSIZE
  jld j11, j1, HT1
  jcall room
  jldi j1, 0
  jst j13, j1, HBST
  jld j11, j1, HT1
  jcall room
  jldi j1, 0
  jst j13, j1, HBSE
  jld j11, j1, HNF
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 48
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HGE
  jldi j2, HGT
  jldi j3, 32
  jcall pl_new
  jldi j2, HAG
  jldi j3, 48
  jcall pl_new
  jldi j1, 0
  jst j1, j1, HI
  hro_lap:                      ; every form its own relation, of one form
    jldi j1, 0
    jld j2, j1, HI
    jld j3, j1, HNM
    jsub j3, j2, j3
    jjz j3, hro_done
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, HCLS
    jadd j4, j4, j3
    jst j2, j4, 0
    jld j4, j1, HSIZE
    jadd j4, j4, j3
    jldi j5, 1
    jst j5, j4, 0
    jadd j2, j2, j5
    jst j2, j1, HI
    jjmp hro_lap
hro_done:
  jret

; The growing table at j2 emptied, in the places it has. Uses j3-j6.
hl_clear:
  jld j3, j2, 8
  jldi j4, 1
  jadd j3, j3, j4
  jld j4, j2, 24
  jmul j3, j3, j4
  jldi j4, 3
  jshr j3, j3, j4
  jld j4, j2, 0
  jldi j5, 0
  jst j5, j2, 16
  hcl_lap:
    jjz j3, hcl_done
    jst j5, j4, 0
    jldi j6, 8
    jadd j4, j4, j6
    jldi j6, 1
    jsub j3, j3, j6
    jjmp hcl_lap
hcl_done:
  jret

; The relation of form j2 -> j2, and j3 = 1 if the form is turned against it. Uses j2-j5.
hl_find:
  jldi j3, 0
  hfd_lap:
    jldi j4, 3
    jshl j4, j2, j4
    jldi j5, 0
    jld j5, j5, HCLS
    jadd j5, j5, j4
    jld j5, j5, 0
    jsub j5, j5, j2
    jjz j5, hfd_done
    jldi j5, 0
    jld j5, j5, HPAR
    jadd j5, j5, j4
    jld j5, j5, 0
    jxor j3, j3, j5
    jldi j5, 0
    jld j5, j5, HCLS
    jadd j5, j5, j4
    jld j2, j5, 0
    jjmp hfd_lap
hfd_done:
  jret

; j6 = the score of the relation of relations at j4 (twice read alike, minus crossed), 0 if it does not beat its null
; or two pairs do not say it. Uses j6-j8.
hl_score:
  jld j6, j4, 32
  jldi j7, 2
  jsub j7, j6, j7
  jldi j8, 63
  jsar j7, j7, j8
  jjnz j7, hsc_no
  jadd j6, j6, j6
  jld j7, j4, 40
  jsub j6, j6, j7
  jsar j7, j6, j8
  jjnz j7, hsc_no
  jjz j6, hsc_no
  jret
hsc_no:
  jldi j6, 0
  jret

; One turn's joins: of the relations of relations that beat their null, each relation's strongest; two relations whose
; strongest is each other join (the second into the first, turned if they relate the other way round). Each join said.
; -> HNMRG how many, HNACC how many beat their null. Uses j1-j14.
hl_merge:
  jldi j1, 0
  jst j1, j1, HNMRG
  jst j1, j1, HNACC
  jst j1, j1, HI
  hm_z:                         ; no strongest yet
    jldi j1, 0
    jld j2, j1, HI
    jld j3, j1, HNM
    jsub j3, j2, j3
    jjz j3, hm_zd
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, HBST
    jadd j4, j4, j3
    jst j1, j4, 0
    jld j4, j1, HBSE
    jadd j4, j4, j3
    jst j1, j4, 0
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HI
    jjmp hm_z
hm_zd:
  jldi j2, HAG
  jld j3, j2, 8
  jldi j5, 1
  jadd j3, j3, j5
  jst j3, j1, HT1
  jld j4, j2, 0
  jst j4, j1, HT2
  hm_a:                         ; each relation's strongest
    jldi j1, 0
    jld j3, j1, HT1
    jjz j3, hm_ad
    jld j4, j1, HT2
    jld j5, j4, 0
    jjz j5, hm_an
    jcall hl_score
    jldi j1, 0
    jjz j6, hm_an
    jld j5, j1, HNACC
    jldi j7, 1
    jadd j5, j5, j7
    jst j5, j1, HNACC
    jldi j9, 8
    hm_side:                    ; (its first relation, then its second)
      jadd j10, j4, j9
      jld j10, j10, 0
      jldi j7, 3
      jshl j10, j10, j7
      jld j7, j1, HBST
      jadd j7, j7, j10
      jld j8, j7, 0
      jsub j8, j8, j6
      jldi j11, 63
      jsar j8, j8, j11
      jjz j8, hm_sn
      jst j6, j7, 0
      jld j7, j1, HBSE
      jadd j7, j7, j10
      jst j4, j7, 0
    hm_sn:
      jldi j7, 16
      jsub j7, j9, j7
      jjz j7, hm_an
      jldi j9, 16
      jjmp hm_side
  hm_an:
    jldi j1, 0
    jld j4, j1, HT2
    jldi j5, HAG
    jld j5, j5, 24
    jadd j4, j4, j5
    jst j4, j1, HT2
    jld j3, j1, HT1
    jldi j5, 1
    jsub j3, j3, j5
    jst j3, j1, HT1
    jjmp hm_a
hm_ad:
  jldi j2, HAG                  ; the ones both chose
  jld j3, j2, 8
  jldi j5, 1
  jadd j3, j3, j5
  jst j3, j1, HT1
  jld j4, j2, 0
  jst j4, j1, HT2
  hm_b:
    jldi j1, 0
    jld j3, j1, HT1
    jjz j3, hm_bd
    jld j4, j1, HT2
    jld j5, j4, 0
    jjz j5, hm_bn
    jld j5, j4, 8
    jldi j7, 3
    jshl j5, j5, j7
    jld j7, j1, HBSE
    jadd j7, j7, j5
    jld j7, j7, 0
    jsub j7, j7, j4
    jjnz j7, hm_bn
    jld j5, j4, 16
    jldi j7, 3
    jshl j5, j5, j7
    jld j7, j1, HBSE
    jadd j7, j7, j5
    jld j7, j7, 0
    jsub j7, j7, j4
    jjnz j7, hm_bn
    jld j5, j4, 8               ; the second into the first
    jld j6, j4, 16
    jldi j7, 3
    jshl j8, j6, j7
    jld j9, j1, HCLS
    jadd j9, j9, j8
    jst j5, j9, 0
    jld j9, j4, 24
    jldi j10, 1
    jsub j9, j9, j10
    jld j10, j1, HPAR
    jadd j10, j10, j8
    jst j9, j10, 0
    jld j10, j1, HSIZE
    jadd j10, j10, j8
    jld j11, j10, 0
    jshl j12, j5, j7
    jld j13, j1, HSIZE
    jadd j13, j13, j12
    jld j14, j13, 0
    jadd j14, j14, j11
    jst j14, j13, 0
    jld j5, j1, HNMRG
    jldi j7, 1
    jadd j5, j5, j7
    jst j5, j1, HNMRG
    jcall hl_sayjoin
  hm_bn:
    jldi j1, 0
    jld j4, j1, HT2
    jldi j5, HAG
    jld j5, j5, 24
    jadd j4, j4, j5
    jst j4, j1, HT2
    jld j3, j1, HT1
    jldi j5, 1
    jsub j3, j3, j5
    jst j3, j1, HT1
    jjmp hm_b
hm_bd:
  jldi j1, S_VUELTA
  jcall puts
  jld j2, j1, HTURN
  jcall putnum
  jldi j1, S_GANAN
  jcall puts
  jld j2, j1, HNACC
  jcall putnum
  jldi j1, S_SEUNEN
  jcall puts
  jld j2, j1, HNMRG
  jcall putnum
  jldi j2, 10
  jcall putch
  jret

; "vuelta t une: <first> ~ <second> | misma | lo dicen n | nulo x" for the relation of relations at HT2. Uses j1-j14.
hl_sayjoin:
  jldi j1, S_VUELTA
  jcall puts
  jld j2, j1, HTURN
  jcall putnum
  jldi j1, S_UNE
  jcall puts
  jld j4, j1, HT2
  jld j2, j4, 8
  jcall hl_sayform
  jldi j1, S_TIL
  jcall puts
  jld j4, j1, HT2
  jld j2, j4, 16
  jcall hl_sayform
  jldi j1, 0
  jld j4, j1, HT2
  jld j2, j4, 24
  jldi j3, 1
  jsub j2, j2, j3
  jldi j1, S_MISMA
  jjz j2, hsj_way
  jldi j1, S_REVES
hsj_way:
  jcall puts
  jldi j1, S_LODIC
  jcall puts
  jld j4, j1, HT2
  jld j2, j4, 32
  jcall putnum
  jldi j1, S_NULO
  jcall puts
  jld j4, j1, HT2
  jld j2, j4, 40
  jldi j3, 1
  jshr j2, j2, j3
  jcall putnum
  jld j4, j1, HT2
  jld j2, j4, 40
  jldi j3, 1
  jand j2, j2, j3
  jjz j2, hsj_nl
  jldi j1, S_MEDIO
  jcall puts
hsj_nl:
  jldi j2, 10
  jcall putch
  jret

; The while's end: the turn it stopped in, how many relations hold two forms or more, and the largest. Uses j1-j14.
hl_end:
  jldi j1, S_PARO
  jcall puts
  jld j2, j1, HTURN
  jldi j3, 1
  jsub j2, j2, j3
  jcall putnum
  jldi j1, S_PAROB
  jcall puts
  jst j1, j1, HT1               ; how many
  jst j1, j1, HT3               ; the largest's forms
  jst j1, j1, HT4               ; the largest
  jst j1, j1, HI
  he_lap:
    jldi j1, 0
    jld j2, j1, HI
    jld j3, j1, HNM
    jsub j3, j2, j3
    jjz j3, he_done
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, HCLS
    jadd j4, j4, j3
    jld j4, j4, 0
    jsub j4, j4, j2
    jjnz j4, he_next
    jld j4, j1, HSIZE
    jadd j4, j4, j3
    jld j4, j4, 0
    jldi j5, 2
    jsub j5, j4, j5
    jldi j6, 63
    jsar j5, j5, j6
    jjnz j5, he_next
    jld j5, j1, HT1
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j1, HT1
    jld j5, j1, HT3
    jsub j5, j5, j4
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, he_next
    jst j4, j1, HT3
    jst j2, j1, HT4
  he_next:
    jld j2, j1, HI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HI
    jjmp he_lap
he_done:
  jldi j1, S_CLASES
  jcall puts
  jld j2, j1, HT1
  jcall putnum
  jld j2, j1, HT1
  jjz j2, he_nl
  jldi j1, S_GRANDE
  jcall puts
  jld j2, j1, HT3
  jcall putnum
  jldi j1, S_FORMAS
  jcall puts
  jld j2, j1, HT4
  jcall hl_sayform
he_nl:
  jldi j2, 10
  jcall putch
  jret

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
  enr_lap:
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
    jjnz j3, enr_close
    jld j11, j1, PRC
    jadd j11, j11, j11
    jcall room
    jldi j1, 0
    jld j3, j1, PRB
    jld j4, j1, PRN
    jldi j5, 0
    enr_mv:
      jsub j6, j5, j4
      jjz j6, enr_moved
      jadd j6, j3, j5
      jldb j6, j6, 0
      jadd j7, j13, j5
      jstb j6, j7, 0
      jldi j6, 1
      jadd j5, j5, j6
      jjmp enr_mv
    enr_moved:
    jst j13, j1, PRB
    jld j2, j1, PRC
    jadd j2, j2, j2
    jst j2, j1, PRC
    jjmp enr_lap
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
el_line:
  jldi j1, 0
  jld j2, j1, ZEP
  jld j3, j1, ZEEND
  jsub j4, j2, j3
  jjz j4, el_done
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
el_word:
  jldi j1, 0
  jld j9, j1, ZEP
  jld j10, j1, ZEEND
  jsub j2, j9, j10
  jjz j2, el_done
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
  jjmp el_word
el_w:
  jldi j8, 0
  el_wl:
    jadd j2, j9, j8
    jsub j4, j2, j10
    jjz j4, el_wh
    jldb j3, j2, 0
    jcall mp_isletter
    jjz j2, el_wh
    jldi j2, 1
    jadd j8, j8, j2
    jjmp el_wl
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
  jjmp el_line
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

; The words of line j2 from word j3 to word j4 (not included), one space between, word j5 said "_". Uses j1-j14.
en_saywords:
  jldi j1, 0
  jst j2, j1, ZSLR
  jst j3, j1, ZSLI
  jst j3, j1, ZSLF
  jst j4, j1, ZSLE
  jst j5, j1, ZSLS
  esw_lap:
    jldi j1, 0
    jld j3, j1, ZSLI
    jld j4, j1, ZSLE
    jsub j4, j3, j4
    jjz j4, esw_done
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
    jjmp esw_lap
esw_done:
  jret

; The text of the word whose print is j5. Uses j1-j10.
en_sayprint:
  jldi j2, ZWT
  jcall pl_find
  jldi j1, 0
  jld j9, j4, 8
  jld j10, j4, 16
  esp_lap:
    jjz j10, esp_done
    jldb j2, j9, 0
    jcall putch
    jldi j1, 1
    jadd j9, j9, j1
    jsub j10, j10, j1
    jjmp esp_lap
esp_done:
  jldi j1, 0
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
  mpf_lap:
    jjz j4, mpf_done
    jldb j7, j3, 0
    jxor j5, j5, j7
    jmul j5, j5, j6
    jldi j7, 1
    jadd j3, j3, j7
    jsub j4, j4, j7
    jjmp mpf_lap
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
