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
;     alike is only what words they use, not which goes with which. A relation of relations is said when two pairs say
;     it and it shares more than its null; the strongest first.
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

include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

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
jcall hl_groups
jcall hl_agree
jcall hl_report
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
  jldi j3, 32
  jcall pl_new
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
      jld j7, j3, 8
      jst j7, j1, HA
      jld j7, j3, 16
      jst j7, j1, HB
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
      jld j7, j7, 16
      jst j7, j1, HB
      jld j8, j1, HA
      jsub j8, j8, j7
      jjz j8, hg_next
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
    jldi j2, 24
    jmul j11, j6, j2
    jldi j2, 24
    jadd j11, j11, j2
    jcall room
    jldi j1, 0
    jst j13, j1, HGE
    jldi j2, 2
    jst j2, j1, HPASS
    jjmp hg_pass
hg_done:
  jret

; Two forms that hold the same pair of words: the same way (1) or the other way round (2), as read or crossed (HAG:
; how many read alike, how many with one of them crossed). Uses j1-j14.
hl_agree:
  jldi j2, HAG
  jldi j3, 48
  jcall pl_new
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
        jjz j12, ha_yn            ; one form with itself
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

; What it found: the words, the half, the forms said by two; and the relations of relations said by two pairs and more
; than their null (read alike, against half of the crossed: each pair crossed once on each side), the strongest first
; (twice read minus crossed). Uses j1-j14.
hl_report:
  jldi j1, 0
  jst j1, j1, HKEPT
  jst j1, j1, HI
  hr_m:
    jldi j1, 0
    jld j2, j1, HI
    jld j3, j1, HNM
    jsub j3, j2, j3
    jjz j3, hr_md
    jldi j3, 48
    jmul j3, j2, j3
    jld j4, j1, HMA
    jadd j3, j3, j4
    jld j3, j3, 32
    jldi j4, 2
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, hr_mn
    jld j3, j1, HKEPT
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, HKEPT
  hr_mn:
    jld j2, j1, HI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, HI
    jjmp hr_m
hr_md:
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
  jld j2, j1, HKEPT
  jcall putnum
  jldi j1, S_DE
  jcall puts
  jld j2, j1, HNM
  jcall putnum
  jldi j2, 10
  jcall putch
  jldi j1, 0                    ; the ones said: a room for them
  jldi j2, HAG
  jld j11, j2, 16
  jldi j3, 1
  jadd j11, j11, j3
  jldi j3, 3
  jshl j11, j11, j3
  jcall room
  jldi j1, 0
  jst j13, j1, HTOP
  jst j1, j1, HNTOP
  jldi j2, HAG
  jld j3, j2, 8
  jldi j4, 1
  jadd j3, j3, j4
  jld j4, j2, 0
  jld j5, j2, 24
  hr_a:
    jjz j3, hr_ad
    jld j6, j4, 0
    jjz j6, hr_an
    jld j6, j4, 32
    jldi j7, 2
    jsub j7, j6, j7
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, hr_an              ; said by one pair
    jadd j6, j6, j6
    jld j7, j4, 40
    jsub j6, j6, j7
    jldi j7, 1
    jsub j6, j6, j7
    jsar j6, j6, j8
    jjnz j6, hr_an              ; not more than its null
    jld j6, j1, HNTOP
    jldi j7, 3
    jshl j7, j6, j7
    jld j8, j1, HTOP
    jadd j7, j7, j8
    jst j4, j7, 0
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j1, HNTOP
  hr_an:
    jadd j4, j4, j5
    jldi j6, 1
    jsub j3, j3, j6
    jjmp hr_a
hr_ad:
  jldi j1, S_CUANT
  jcall puts
  jld j2, j1, HNTOP
  jcall putnum
  jldi j2, 10
  jcall putch
  jld j2, j1, HNTOP             ; (all of them, the strongest first)
  jst j2, j1, HT3
  hr_pick:
    jldi j1, 0
    jld j2, j1, HT3
    jjz j2, hr_done
    jldi j2, -1                   ; the strongest left
    jst j2, j1, HT4
    jst j1, j1, HT5
    jst j1, j1, HI
    hr_s:
      jldi j1, 0
      jld j2, j1, HI
      jld j3, j1, HNTOP
      jsub j3, j2, j3
      jjz j3, hr_sd
      jldi j3, 3
      jshl j3, j2, j3
      jld j4, j1, HTOP
      jadd j3, j3, j4
      jld j4, j3, 0
      jjz j4, hr_sn
      jld j5, j4, 32
      jadd j5, j5, j5
      jld j6, j4, 40
      jsub j5, j5, j6
      jld j6, j1, HT5
      jsub j6, j6, j5
      jldi j7, 63
      jsar j6, j6, j7
      jjz j6, hr_sn
      jst j5, j1, HT5
      jst j3, j1, HT4
    hr_sn:
      jld j2, j1, HI
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, HI
      jjmp hr_s
  hr_sd:
    jld j3, j1, HT4
    jldi j4, 63
    jsar j4, j3, j4
    jjnz j4, hr_done
    jld j4, j3, 0
    jst j4, j1, HT1
    jst j1, j3, 0
    jldi j1, S_REL
    jcall puts
    jld j4, j1, HT1
    jld j2, j4, 8
    jcall hl_sayform
    jldi j1, S_TIL
    jcall puts
    jld j4, j1, HT1
    jld j2, j4, 16
    jcall hl_sayform
    jldi j1, 0
    jld j4, j1, HT1
    jld j2, j4, 24
    jldi j3, 1
    jsub j2, j2, j3
    jldi j1, S_MISMA
    jjz j2, hr_way
    jldi j1, S_REVES
  hr_way:
    jcall puts
    jldi j1, S_LODIC
    jcall puts
    jld j4, j1, HT1
    jld j2, j4, 32
    jcall putnum
    jldi j1, S_NULO
    jcall puts
    jld j4, j1, HT1
    jld j2, j4, 40
    jldi j3, 1
    jshr j2, j2, j3
    jcall putnum
    jld j4, j1, HT1
    jld j2, j4, 40
    jldi j3, 1
    jand j2, j2, j3
    jjz j2, hr_nl
    jldi j1, S_MEDIO
    jcall puts
  hr_nl:
    jldi j2, 10
    jcall putch
    jldi j1, 0
    jld j2, j1, HT3
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, HT3
    jjmp hr_pick
hr_done:
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
