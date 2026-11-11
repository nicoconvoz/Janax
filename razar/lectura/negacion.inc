; The switch of yes and no, distilled (Razar's P54, carried here as Razar measured it, rz_lexicon_switches). Nothing
; names the no: it is found by what it does, the author's properties, each against the book itself:
;   1. taken out, what is left is said too ("el perro no ladra" / "el perro ladra"): the share of its places whose
;      neighbours, without it, are said too, above that share for any word, in two places at least;
;   2. when it appears, what follows changes: where the word before and the word after also stand together, what
;      follows them without it is said less often than for the words that passed 1 (pooled);
;   3. it is no thing spoken of (Razar has it optional and does not use it: nor here);
;   4. the widest door: the relation is of three, the many who stand before it and the many acts behind it, each in
;      that order (the other way less often), twice at least, among the words that passed 2; the narrower of the two is
;      its width, and the wide ones are those above where the widths part in two (the exact best split);
;   5. mostly the door: of all its places, the share where it stands between one who stands before it and one behind
;      it, above where the wide ones' shares part in two;
;   and what stands inside another one's door ("no la envió": la stands after no, in that order) is what is turned,
;   not what turns: it is left out.
; The only count is the anecdote rule. It reads the row of lectura.inc and uses pulso.inc's hw. distill_no leaves in
; NEGF (by word number) bit 1 for a switch, and the list at NEGL (NNEG of them). The program keeps its variables away
; from 1800h-18FFh.
ROOMTRI = 1800h                 ; every three said: {hash} (a table that grows to what it holds, crece.inc)
ROOMBG = 1808h                  ; every two said: {a * NV + b + 1, how often} (the same)
ROOMW = 1818h                   ; by word, 8 qwords each: seen, rem, tot, same, front, behind, at the door, flags
NEGF  = 1820h                   ; (the flags' room: 1 the switch, 2 passed 1-2, 4 wide, 8 inside)
ROOMVL = 1828h                  ; values to split
NEGL  = 1830h                   ; the switches found, and how many
NNEG  = 1838h
ALLS  = 1840h                   ; places looked at, and how many of them were said without the word
ALLR  = 1848h
C1S   = 1850h                   ; the words that passed 1: what followed stayed, and of how many
C1T   = 1858h
NP1   = 1860h                   ; how many words pass each property (1, 2, the wide door, mostly the door, the switches)
NP2   = 1868h
NP4   = 1870h
NP5   = 1878h
NVL   = 1880h                   ; values to split: how many; the split (twice the cut), 0 if none
CUT2  = 1888h
SPL0  = 1890h                   ; the split: the sum below, the best so far
SPLB  = 1898h
SPLS  = 18A0h
NI    = 18A8h                   ; walking
NLEFT = 18B0h
NA    = 18B8h                   ; three words of a place
NB    = 18C0h
NC2   = 18C8h

; The switches of the book. Uses j1-j14.
distill_no:
  jldi j1, 0                    ; its rooms: the threes and the twos, each a table that grows to what it holds (Capitan:
  jldi j11, 64                  ; "nothing wasted"; they were made for twice the units, and held one in eight)
  jcall0 j1, room
  jst j13, j1, ROOMTRI
  jldi j2, 32
  jadd j2, j13, j2
  jst j2, j1, ROOMBG
  jld j2, j1, ROOMTRI
  jldi j3, 8
  jcall0 j1, pl_new
  jld j2, j1, ROOMBG
  jldi j3, 16
  jcall0 j1, pl_new
  jld j11, j1, NV
  jldi j4, 6
  jshl j11, j11, j4
  jcall0 j1, room
  jst j13, j1, ROOMW
  jld j11, j1, NV
  jldi j4, 3
  jshl j11, j11, j4
  jcall0 j1, room
  jst j13, j1, ROOMVL
  jld j11, j1, NV
  jldi j4, 3
  jshl j11, j11, j4
  jcall0 j1, room
  jst j13, j1, NEGL
  jst j1, j1, NNEG

  jst j1, j1, NI                ; every two and every three said
  jld j2, j1, NTOK
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63                   ; (fewer units than the window: no window; a count left never starts below zero,
  jsar j3, j2, j3               ; or "while not zero" would walk past the row)
  jldi j4, -1
  jxor j3, j3, j4
  jand j2, j2, j3
  jst j2, j1, NLEFT
  jwhile j2
    jcall n_at
    jld j2, j1, NA
    jjz j2, nb_next
    jld j3, j1, NB
    jjz j3, nb_next
    jcall n_bgtake
  nb_old:
    jld j6, j4, 8
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j4, 8
    jld j2, j1, NC2
    jjz j2, nb_next
    jcall n_trikey
    jld j2, j1, ROOMTRI         ; (said: into the threes)
    jcall0 j1, pl_take
  nb_next:
    jcall n_step
  jwend

  jst j1, j1, ALLS              ; 1 and 2: taken out, is what is left said? and does what follows stay?
  jst j1, j1, ALLR
  jldi j2, 1
  jst j2, j1, NI
  jld j2, j1, NTOK
  jldi j3, 3
  jsub j2, j2, j3
  jldi j3, 63                   ; (fewer units than the window: no window; a count left never starts below zero,
  jsar j3, j2, j3               ; or "while not zero" would walk past the row)
  jldi j4, -1
  jxor j3, j3, j4
  jand j2, j2, j3
  jst j2, j1, NLEFT
  jwhile j2
    jcall n_at                  ; NA = the word, NB the next, NC2 the one after; the one before at -8
    jld j9, j1, NI
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, ROOMT
    jadd j9, j9, j3
    jld j10, j9, -8             ; before
    jjz j10, n1_next
    jld j2, j1, NA
    jjz j2, n1_next
    jld j2, j1, NB
    jjz j2, n1_next
    jld j2, j1, NC2
    jjz j2, n1_next
    jld j2, j1, NA              ; seen
    jldi j3, 0
    jcall n_wbump
    jld j2, j1, ALLS
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ALLS
    jst j10, j1, NA             ; said without it: before, next, the one after
    jcall n_trikey
    jcall n_trislot
    jld j11, j4, 0              ; (nonzero: said)
    jjz j11, n1_pair
    jld j9, j1, NI
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, ROOMT
    jadd j9, j9, j3
    jld j2, j9, 0
    jldi j3, 1
    jcall n_wbump
    jldi j2, 1
    jldadd j2, j1, ALLR
  n1_pair:
    jld j9, j1, NI              ; before and next stand together somewhere?
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, ROOMT
    jadd j9, j9, j3
    jld j2, j9, -8
    jld j3, j9, 8
    jcall n_bgcount
    jjz j6, n1_next
    jld j9, j1, NI
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, ROOMT
    jadd j9, j9, j3
    jld j2, j9, 0
    jldi j3, 2
    jcall n_wbump
    jjz j11, n1_next
    jld j9, j1, NI
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, ROOMT
    jadd j9, j9, j3
    jld j2, j9, 0
    jldi j3, 3
    jcall n_wbump
  n1_next:
    jcall n_step
  jwend

  jst j1, j1, NP1               ; 1: rem >= 2 and rem / seen above the book's
  jst j1, j1, C1S
  jst j1, j1, C1T
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall n_w
    jld j2, j8, 8
    jldi j3, 2
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, c1_next
    jld j3, j1, ALLS            ; rem * ALLS > ALLR * seen
    jmul j2, j2, j3
    jld j3, j1, ALLR
    jld j4, j8, 0
    jmul j3, j3, j4
    jsub j2, j3, j2
    jldi j4, 63
    jsar j2, j2, j4
    jjz j2, c1_next
    jldi j2, 2
    jst j2, j8, 56
    jldi j2, 1
    jldadd j2, j1, NP1
    jld j2, j1, C1S
    jld j3, j8, 24
    jadd j2, j2, j3
    jst j2, j1, C1S
    jld j2, j1, C1T
    jld j3, j8, 16
    jadd j2, j2, j3
    jst j2, j1, C1T
  c1_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jst j1, j1, NP2               ; 2: tot >= 2 and same / tot below the pooled share
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall n_w
    jld j2, j8, 56
    jjz j2, c2_next
    jld j2, j8, 16
    jldi j3, 2
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, c2_out
    jld j3, j8, 24              ; same * C1T < C1S * tot
    jld j4, j1, C1T
    jmul j3, j3, j4
    jld j4, j1, C1S
    jmul j4, j4, j2
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, c2_out
    jld j2, j1, NP2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NP2
    jjmp c2_next
  c2_out:
    jst j1, j8, 56
  c2_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend

  jldi j9, 0                    ; 4: the door's width, from every two said twice or more, both of them candidates
  jld j10, j1, ROOMBG           ; (every place of its table)
  jld j10, j10, 8
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, 4
    jshl j3, j9, j3
    jld j2, j1, ROOMBG
    jld j2, j2, 0
    jadd j3, j3, j2
    jld j2, j3, 0
    jjz j2, d4_next
    jld j11, j3, 8              ; how often
    jldi j4, 2
    jsub j4, j11, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, d4_next
    jldi j4, 1                  ; a, b
    jsub j2, j2, j4
    jld j4, j1, NV
    jdiv j12, j2, j4
    jmul j5, j12, j4
    jsub j13, j2, j5
    jsub j2, j12, j13
    jjz j2, d4_next
    jadd j2, j12, j1
    jcall n_cand
    jjz j3, d4_next
    jadd j2, j13, j1
    jcall n_cand
    jjz j3, d4_next
    jadd j2, j13, j1            ; the other way less often
    jadd j3, j12, j1
    jcall n_bgcount
    jsub j6, j6, j11
    jldi j5, 63
    jsar j6, j6, j5
    jjz j6, d4_next
    jadd j9, j9, j1
    jst j9, j1, NI
    jadd j9, j13, j1            ; one more before b, one more behind a
    jcall n_w
    jld j2, j8, 32
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j8, 32
    jadd j9, j12, j1
    jcall n_w
    jld j2, j8, 40
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j8, 40
    jld j9, j1, NI
  d4_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jst j1, j1, NVL               ; the widths, and where they part
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall n_w
    jld j2, j8, 56
    jjz j2, w4_next
    jcall n_width
    jcall n_vput
  w4_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jcall n_split
  jst j1, j1, NP4
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall n_w
    jld j2, j8, 56
    jjz j2, x4_next
    jld j3, j1, CUT2            ; no split: every one is wide
    jjz j3, x4_wide
    jcall n_width
    jjz j2, x4_next
    jadd j2, j2, j2
    jsub j2, j3, j2
    jldi j4, 63
    jsar j2, j2, j4
    jjz j2, x4_next
  x4_wide:
    jld j2, j8, 56
    jldi j3, 4
    jor j2, j2, j3
    jst j2, j8, 56
    jld j2, j1, NP4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NP4
  x4_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend

  jldi j2, 1                    ; 5: how much of its life is the door
  jst j2, j1, NI
  jld j2, j1, NTOK
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63                   ; (fewer units than the window: no window; a count left never starts below zero,
  jsar j3, j2, j3               ; or "while not zero" would walk past the row)
  jldi j4, -1
  jxor j3, j3, j4
  jand j2, j2, j3
  jst j2, j1, NLEFT
  jwhile j2
    jldi j1, 0
    jld j9, j1, NI
    jldi j3, 3
    jshl j9, j9, j3
    jld j3, j1, ROOMT
    jadd j9, j9, j3
    jld j10, j9, -8             ; before, the word, after
    jld j11, j9, 0
    jld j12, j9, 8
    jjz j10, a5_next
    jjz j11, a5_next
    jjz j12, a5_next
    jadd j2, j11, j1
    jcall n_flags
    jldi j4, 4
    jand j3, j3, j4
    jjz j3, a5_next
    jadd j2, j10, j1
    jcall n_cand
    jjz j3, a5_next
    jadd j2, j12, j1
    jcall n_cand
    jjz j3, a5_next
    jadd j2, j10, j1            ; before it, in that order, twice or more
    jadd j3, j11, j1
    jcall n_ordered
    jjz j6, a5_next
    jadd j2, j11, j1            ; behind it, the same
    jadd j3, j12, j1
    jcall n_ordered
    jjz j6, a5_next
    jadd j9, j11, j1
    jcall n_w
    jld j2, j8, 48
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j8, 48
  a5_next:
    jcall n_step
  jwend
  jst j1, j1, NVL               ; the shares of the wide ones (in 2^-16), and where they part
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall n_w
    jld j2, j8, 56
    jldi j3, 4
    jand j2, j2, j3
    jjz j2, s5_next
    jcall n_share
    jcall n_vput
  s5_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jcall n_split
  jst j1, j1, NP5
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall n_w
    jld j2, j8, 56
    jldi j3, 4
    jand j2, j2, j3
    jjz j2, k5_next
    jld j3, j1, CUT2
    jjz j3, k5_keep
    jcall n_share
    jadd j2, j2, j2
    jsub j2, j3, j2
    jldi j4, 63
    jsar j2, j2, j4
    jjnz j2, k5_keep
    jld j2, j8, 56              ; not mostly the door: not wide any more
    jldi j3, -5
    jand j2, j2, j3
    jst j2, j8, 56
    jjmp k5_next
  k5_keep:
    jld j2, j1, NP5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NP5
  k5_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend

  jldi j11, 1                   ; inside another's door: a wide one stands before it, in that order
  jld j12, j1, NV
  jldi j2, 1
  jsub j12, j12, j2
  jwhile j12
    jldi j1, 0
    jadd j2, j11, j1
    jcall n_flags
    jldi j4, 4
    jand j3, j3, j4
    jjz j3, i5_next
    jldi j9, 1                  ; v = j9 before w = j11?
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jldi j1, 0
      jsub j2, j9, j11
      jjz j2, i5_v
      jadd j2, j9, j1
      jcall n_flags
      jldi j4, 4
      jand j3, j3, j4
      jjz j3, i5_v
      jadd j2, j9, j1
      jadd j3, j11, j1
      jcall n_ordered
      jjz j6, i5_v
      jadd j2, j9, j1           ; inside: marked (and the search for w ends)
      jst j2, j1, NI
      jadd j9, j11, j1
      jcall n_w
      jld j2, j8, 56
      jldi j3, 8
      jor j2, j2, j3
      jst j2, j8, 56
      jldi j10, 1
      jld j9, j1, NV
    i5_v:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
  i5_next:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j12, j12, j2
  jwend

  jldi j9, 1                    ; the switches: wide, and inside no other
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jcall n_w
    jld j2, j8, 56
    jldi j3, 12
    jand j2, j2, j3
    jldi j3, 4
    jsub j2, j2, j3
    jjnz j2, f5_next
    jld j2, j8, 56
    jldi j3, 1
    jor j2, j2, j3
    jst j2, j8, 56
    jld j2, j1, NNEG
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, NEGL
    jadd j3, j3, j4
    jst j9, j3, 0
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NNEG
  f5_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

; NA, NB, NC2 = the units at NI, NI + 1, NI + 2 of the row (NC2 = 0 past it). Uses j1-j4 (j1 = 0 after).
n_at:
  jldi j1, 0
  jld j2, j1, NI
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMT
  jadd j3, j3, j4
  jld j4, j3, 0
  jst j4, j1, NA
  jld j4, j3, 8
  jst j4, j1, NB
  jld j4, j1, NTOK
  jldi j2, 2
  jsub j4, j4, j2
  jld j2, j1, NI
  jsub j4, j2, j4
  jldi j2, 63
  jsar j4, j4, j2
  jjz j4, na_end
  jld j4, j3, 16
  jst j4, j1, NC2
  jret
na_end:
  jst j1, j1, NC2
  jret

; NI one more, NLEFT one less -> j2. Uses j1-j3 (j1 = 0 after).
n_step:
  jldi j1, 0
  jld j2, j1, NI
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, NI
  jld j2, j1, NLEFT
  jsub j2, j2, j3
  jst j2, j1, NLEFT
  jret

; The key of the three NA, NB, NC2 -> j5 (never 0). Uses j1-j4.
n_trikey:
  jldi j1, 0
  jld j2, j1, FNVO
  jld j3, j1, NA
  jcall hw
  jld j3, j1, NB
  jcall hw
  jld j3, j1, NC2
  jcall hw
  jjnz j2, nt_key
  jldi j2, 1
nt_key:
  jadd j5, j2, j1
  jret

; The place of the key j5 among the threes -> j4. Uses j1-j4, j6-j8.
n_trislot:
  jldi j1, 0
  jld j2, j1, ROOMTRI
  jjmp pl_find

; The place of the two j2 then j3 among the twos -> j4, its key -> j5. Uses j1-j8.
n_bgslot:
  jcall n_bgkey
  jld j2, j1, ROOMBG
  jjmp pl_find

; The place of the two j2 then j3 among the twos -> j4, its key -> j5, put there if it was not. Uses j1-j8.
n_bgtake:
  jcall n_bgkey
  jld j2, j1, ROOMBG
  jjmp pl_take

; The key of the two j2 then j3 -> j5. Uses j1, j5, j6.
n_bgkey:
  jldi j1, 0
  jld j6, j1, NV
  jmul j5, j2, j6
  jadd j5, j5, j3
  jldi j6, 1
  jadd j5, j5, j6
  jret

; How often j2 came right before j3 -> j6. Uses j1-j8.
n_bgcount:
  jcall n_bgslot
  jld j6, j4, 8
  jret

; j6 = 1 if j2 stands right before j3 twice or more, and j3 before j2 less often. Uses j1-j10 (keeps j9-j14).
n_ordered:
  jst j2, j1, NA
  jst j3, j1, NB
  jcall n_bgcount
  jldi j7, 2
  jsub j7, j6, j7
  jldi j8, 63
  jsar j7, j7, j8
  jjnz j7, no_no
  jst j6, j1, NC2
  jld j2, j1, NB
  jld j3, j1, NA
  jcall n_bgcount
  jld j7, j1, NC2
  jsub j6, j6, j7
  jldi j8, 63
  jsar j6, j6, j8
  jldi j7, 1
  jand j6, j6, j7
  jret
no_no:
  jldi j6, 0
  jret

; The word j9's eight counts -> j8. Uses j1, j2, j8.
n_w:
  jldi j1, 0
  jldi j8, 6
  jshl j8, j9, j8
  jld j2, j1, ROOMW
  jadd j8, j8, j2
  jret

; Count j3 (0 seen, 1 rem, 2 tot, 3 same) of the word j2 one more. Uses j1-j4.
n_wbump:
  jldi j1, 0
  jldi j4, 6
  jshl j2, j2, j4
  jldi j4, 3
  jshl j3, j3, j4
  jadd j2, j2, j3
  jld j3, j1, ROOMW
  jadd j2, j2, j3
  jld j3, j2, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j2, 0
  jret

; The flags of the word j2 -> j3. Uses j1, j3, j4.
n_flags:
  jldi j1, 0
  jldi j4, 6
  jshl j3, j2, j4
  jld j4, j1, ROOMW
  jadd j3, j3, j4
  jld j3, j3, 56
  jret

; j3 = 1 if the word j2 passed 1 and 2. Uses j1, j3, j4.
n_cand:
  jcall n_flags
  jldi j4, 2
  jand j3, j3, j4
  jldi j4, 1
  jshr j3, j3, j4
  jret

; The width of the door of the word at j8 (the narrower of front and behind) -> j2. Uses j2, j4.
n_width:
  jld j2, j8, 32
  jld j4, j8, 40
  jsub j4, j4, j2
  jldi j1, 63
  jsar j4, j4, j1
  jjz j4, nw_done
  jld j2, j8, 40
nw_done:
  jldi j1, 0
  jret

; The share of its places at the door of the word at j8, in 2^-16 -> j2. Uses j1-j4.
n_share:
  jldi j1, 0
  jld j2, j8, 48
  jldi j3, 16
  jshl j2, j2, j3
  jld j3, j8, 0
  jdiv j2, j2, j3
  jld j3, j1, CUT2
  jret

; The value j2 added to the values to split. Uses j1, j3, j4.
n_vput:
  jldi j1, 0
  jld j3, j1, NVL
  jldi j4, 3
  jshl j4, j3, j4
  jld j1, j1, ROOMVL
  jadd j4, j4, j1
  jst j2, j4, 0
  jldi j1, 1
  jadd j3, j3, j1
  jldi j1, 0
  jst j3, j1, NVL
  jret

; Where the NVL values part in two, best: sorted, the split with the most w0 * w1 * (mean0 - mean1)^2 (means in
; sixteenths) between two different values; CUT2 = the two values beside it added (0: no split). Uses j1-j14.
n_split:
  jldi j1, 0                    ; sorted (insertion)
  jst j1, j1, CUT2
  jld j12, j1, ROOMVL
  jldi j9, 1
  jld j10, j1, NVL
  jldi j2, 1
  jsub j10, j10, j2
  jldi j2, 63
  jsar j2, j10, j2
  jjnz j2, sp_done
  jwhile j10
    jldi j2, 3
    jshl j2, j9, j2
    jadd j2, j2, j12
    jld j3, j2, 0               ; the one to place
    jadd j11, j9, j1
    jwhile j11
      jld j4, j2, -8
      jsub j5, j3, j4
      jldi j6, 63
      jsar j5, j5, j6
      jjz j5, sp_put
      jst j4, j2, 0
      jldi j5, 8
      jsub j2, j2, j5
      jldi j5, 1
      jsub j11, j11, j5
    jwend
  sp_put:
    jst j3, j2, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j1, 0                    ; the sum of all
  jldi j13, 0
  jld j10, j1, NVL
  jadd j2, j12, j1
  jwhile j10
    jld j3, j2, 0
    jadd j13, j13, j3
    jldi j3, 8
    jadd j2, j2, j3
    jldi j3, 1
    jsub j10, j10, j3
  jwend
  jst j1, j1, SPL0
  jst j1, j1, SPLB
  jldi j9, 0                    ; every split
  jld j10, j1, NVL
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j2, 3
    jshl j2, j9, j2
    jadd j2, j2, j12
    jld j3, j2, 0
    jld j4, j2, 8
    jld j5, j1, SPL0
    jadd j5, j5, j3
    jst j5, j1, SPL0
    jsub j6, j4, j3
    jjz j6, sp_next             ; the same value: no split there
    jldi j6, 1
    jadd j6, j9, j6             ; w0
    jld j7, j1, NVL
    jsub j7, j7, j6             ; w1
    jldi j8, 4
    jshl j11, j5, j8
    jdiv j11, j11, j6           ; mean0 in sixteenths
    jsub j14, j13, j5
    jshl j14, j14, j8
    jdiv j14, j14, j7
    jsub j11, j11, j14
    jmul j11, j11, j11
    jmul j11, j11, j6
    jmul j11, j11, j7
    jld j14, j1, SPLB
    jsub j14, j14, j11
    jldi j8, 63
    jsar j14, j14, j8
    jjz j14, sp_next
    jst j11, j1, SPLB
    jadd j3, j3, j4
    jst j3, j1, CUT2
  sp_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
sp_done:
  jret
