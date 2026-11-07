; Languages by context (Capitan, 2026-11-07: "the language is found by context: so you know how to separate them and
; no instruction escapes"; "a dictionary manual for each language, its punctuation included"). A word is what it
; lives next to: every two units side by side in a renglon join their words (marks too: each language has its own),
; and each word takes, again and again, the language that weighs the most among its neighbours, until no word
; changes (Chinese Whispers, Biemann 2006). No language has a name given: a language is the words that keep each
; other, and it is called by the word it says the most. The program that includes it keeps away from 3500h-35FFh.
LNG   = 3500h                   ; by word its language (the number of a word of it)
LNA   = 3508h                   ; by word where its neighbours start (NV + 1 of them), and the neighbours {word, weight}
LNB   = 3510h
LNW   = 3518h                   ; by language, a weight (scratch, kept at 0); the languages touched, how many
LNT   = 3520h
LNTN  = 3528h
LNCH  = 3530h                   ; words that changed in a pass, passes
LNPS  = 3538h
LN1   = 3540h                   ; walking
LN2   = 3548h
LN3   = 3550h
LN4   = 3558h
LN5   = 3560h
LN6   = 3568h
LNQ   = 3570h                   ; the question's language (0: none)
LNU   = 3578h                   ; by word its units in the reading
EDG   = 3580h                   ; the pairs side by side {key, a, b, times} (a table that grows)
LNX   = 35A0h                   ; (a count kept)
LNL   = 35A8h                   ; the library's rules in the question's language (pistas.inc): a limit kept, the
LTN   = 35B0h                   ; buildings its words have, a print kept; by print its language {key, language}; by
LNY   = 35B8h                   ; limit the buildings it closes {key, buildings}
PLB   = 35C0h
LTB   = 35E0h

; Each word of the reading its language (LNG). Uses j1-j14.
ln_scan:
  jldi j2, EDG
  jldi j3, 32
  jcall pl_new
  jldi j1, 0
  jldi j9, 1
  lne_lap:
    jldi j1, 0
    jld j2, j1, NTOK
    jsub j2, j9, j2
    jjz j2, lne_done
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMT
    jadd j3, j3, j4
    jld j6, j3, 0               ; b, and a before it
    jldi j5, 8
    jsub j5, j3, j5
    jld j5, j5, 0
    jjz j5, lne_next
    jjz j6, lne_next
    jsub j7, j5, j6
    jjz j7, lne_next
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, lne_ord
    jadd j7, j5, j1
    jadd j5, j6, j1
    jadd j6, j7, j1
  lne_ord:
    jst j5, j1, LN1
    jst j6, j1, LN2
    jld j7, j1, FNVP
    jmul j5, j5, j7
    jxor j5, j5, j6
    jmul j5, j5, j7
    jjnz j5, lne_key
    jldi j5, 1
  lne_key:
    jldi j2, EDG
    jcall pl_take
    jldi j1, 0
    jld j2, j1, LN1
    jst j2, j4, 8
    jld j2, j1, LN2
    jst j2, j4, 16
    jld j2, j4, 24
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j4, 24
  lne_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp lne_lap
lne_done:
  jld j11, j1, NV               ; by word: its neighbours' count, then where they start
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNA
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNW
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNT
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNG
  jldi j9, 0
  jld j10, j1, NV
  jwhile j10
    jldi j3, 3
    jshl j3, j9, j3
    jadd j3, j3, j13
    jst j9, j3, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 0                    ; (the count of each one's neighbours)
  jcall ln_edges
  jldi j1, 0                    ; (where they start: the counts summed)
  jldi j9, 0
  jldi j11, 0
  jld j10, j1, NV
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, LNA
    jadd j3, j3, j4
    jld j5, j3, 0
    jst j11, j3, 0
    jadd j11, j11, j5
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j9, 0                    ; (and a cursor for each, at its start)
  jld j10, j1, NV
  jwhile j10
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, LNA
    jadd j4, j4, j3
    jld j4, j4, 0
    jld j5, j1, LNW
    jadd j5, j5, j3
    jst j4, j5, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNB
  jldi j2, 1                    ; (the neighbours)
  jcall ln_edges
  jldi j1, 0                    ; (the cursors back to 0: LNW is the weights' now)
  jld j10, j1, NV
  jld j9, j1, LNW
  jwhile j10
    jst j1, j9, 0
    jldi j2, 8
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jst j1, j1, LNPS
  lnp_pass:
    jldi j1, 0
    jst j1, j1, LNCH
    jldi j9, 1
    lnp_word:
      jldi j1, 0
      jld j2, j1, NV
      jsub j2, j9, j2
      jjz j2, lnp_passed
      jst j9, j1, LN1
      jcall ln_word
      jldi j1, 0
      jld j9, j1, LN1
      jldi j2, 1
      jadd j9, j9, j2
      jjmp lnp_word
  lnp_passed:
    jld j2, j1, LNPS
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LNPS
    jld j3, j1, LNCH
    jjz j3, lns_done
    jld j3, j1, NV              ; (a pass more while some word changes; never more passes than words)
    jsub j3, j2, j3
    jjnz j3, lnp_pass
lns_done:
  jldi j1, 0
  jret

; Every pair of EDG: j2 = 0, each word's neighbours counted (LNA); 1, written at LNB by the cursors (LNW). Uses j1-j14.
ln_edges:
  jldi j1, 0
  jst j2, j1, LN3
  jld j9, j1, EDG
  jld j10, j1, EDG + 8
  jldi j2, 1
  jadd j10, j10, j2
  lnx_lap:
    jldi j1, 0
    jjz j10, lnx_done
    jld j2, j9, 0
    jjz j2, lnx_next
    jld j2, j9, 8
    jld j3, j9, 16
    jld j4, j9, 24
    jcall ln_side
    jld j2, j9, 16
    jld j3, j9, 8
    jld j4, j9, 24
    jcall ln_side
  lnx_next:
    jldi j1, 0
    jld j2, j1, EDG + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp lnx_lap
lnx_done:
  jret

; Word j2 has neighbour j3, j4 times: counted (LN3 0) or written (LN3 1). Uses j1, j5-j8.
ln_side:
  jldi j1, 0
  jldi j5, 3
  jshl j5, j2, j5
  jld j6, j1, LN3
  jjnz j6, lns_write
  jld j6, j1, LNA
  jadd j5, j5, j6
  jld j6, j5, 0
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j5, 0
  jret
lns_write:
  jld j6, j1, LNW
  jadd j5, j5, j6
  jld j6, j5, 0
  jldi j7, 1
  jadd j7, j6, j7
  jst j7, j5, 0
  jldi j7, 4
  jshl j6, j6, j7
  jld j7, j1, LNB
  jadd j6, j6, j7
  jst j3, j6, 0
  jst j4, j6, 8
  jret

; Word LN1 takes the language that weighs the most among its neighbours (the smaller, of equals). Uses j1-j10.
ln_word:
  jldi j1, 0
  jld j9, j1, LN1
  jldi j2, 3
  jshl j2, j9, j2
  jld j3, j1, LNA
  jadd j2, j2, j3
  jld j5, j2, 0                 ; its neighbours, from j5 to j6
  jld j6, j2, 8
  jsub j7, j6, j5
  jjz j7, lnw_done
  jst j1, j1, LNTN
  lnw_n:
    jsub j7, j6, j5
    jjz j7, lnw_best
    jldi j7, 4
    jshl j7, j5, j7
    jld j8, j1, LNB
    jadd j7, j7, j8
    jld j8, j7, 0
    jld j10, j7, 8
    jldi j7, 3
    jshl j7, j8, j7
    jld j8, j1, LNG
    jadd j7, j7, j8
    jld j8, j7, 0               ; its language
    jldi j7, 3
    jshl j7, j8, j7
    jld j2, j1, LNW
    jadd j7, j7, j2
    jld j2, j7, 0
    jjnz j2, lnw_add
    jld j3, j1, LNTN
    jldi j4, 3
    jshl j4, j3, j4
    jld j2, j1, LNT
    jadd j4, j4, j2
    jst j8, j4, 0
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, LNTN
    jldi j2, 0
  lnw_add:
    jadd j2, j2, j10
    jst j2, j7, 0
    jldi j7, 1
    jadd j5, j5, j7
    jjmp lnw_n
lnw_best:
  jldi j5, 0                    ; (the most; its language)
  jldi j6, 0
  jld j3, j1, LNTN
  jld j4, j1, LNT
  lnw_b:
    jjz j3, lnw_have
    jld j8, j4, 0
    jldi j7, 3
    jshl j7, j8, j7
    jld j2, j1, LNW
    jadd j7, j7, j2
    jld j2, j7, 0
    jst j1, j7, 0               ; (back to 0)
    jsub j7, j2, j5
    jjz j7, lnw_tie
    jldi j10, 63
    jsar j7, j7, j10
    jjnz j7, lnw_bnext
    jadd j5, j2, j1
    jadd j6, j8, j1
    jjmp lnw_bnext
  lnw_tie:
    jsub j7, j8, j6
    jldi j10, 63
    jsar j7, j7, j10
    jjz j7, lnw_bnext
    jadd j6, j8, j1
  lnw_bnext:
    jldi j7, 8
    jadd j4, j4, j7
    jldi j7, 1
    jsub j3, j3, j7
    jjmp lnw_b
lnw_have:
  jldi j2, 3
  jshl j2, j9, j2
  jld j3, j1, LNG
  jadd j2, j2, j3
  jld j3, j2, 0
  jsub j3, j3, j6
  jjz j3, lnw_done
  jst j6, j2, 0
  jld j2, j1, LNCH
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, LNCH
lnw_done:
  jldi j1, 0
  jret

; By word its units in the reading (LNU). Uses j1-j6.
ln_units:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNU
  jld j9, j1, ROOMT
  jld j10, j1, NTOK
  jwhile j10
    jld j2, j9, 0
    jldi j3, 3
    jshl j2, j2, j3
    jadd j2, j2, j13
    jld j3, j2, 0
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j2, 0
    jldi j2, 8
    jadd j9, j9, j2
    jsub j10, j10, j4
  jwend
  jldi j1, 0
  jret

; The question's language (Capitan, 2026-11-07: "a dictionary manual for each language, its punctuation included"):
; its words read here already (as cores reads them), each one's language counted; the most is its language (LNQ).
; The renglones of another language are left out of the reading: it is read with its own language's manual. A renglon
; is of the language most of its units are. Uses j1-j14.
ln_ask:
  jldi j1, 0
  jst j1, j1, LNQ
  jld j2, j1, PASS
  jst j2, j1, LN4
  jld j2, j1, LABEL
  jst j2, j1, LN5
  jld j2, j1, LABLEN
  jst j2, j1, LN6
  jldi j2, S_Q
  jst j2, j1, LABEL
  jldi j2, 1
  jst j2, j1, LABLEN
  jldi j2, 2
  jst j2, j1, PASS
  jst j1, j1, QN
  jcall scan
  jldi j1, 0
  jst j1, j1, LNTN
  jldi j9, 0
  lna_unit:
    jldi j1, 0
    jld j2, j1, QN
    jsub j2, j9, j2
    jjz j2, lna_counted
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, lna_next           ; (a hole, a word the reading never had)
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, LNG
    jadd j3, j3, j4
    jld j8, j3, 0
    jldi j3, 3
    jshl j3, j8, j3
    jld j4, j1, LNW
    jadd j3, j3, j4
    jld j2, j3, 0
    jjnz j2, lna_add
    jld j5, j1, LNTN
    jldi j6, 3
    jshl j6, j5, j6
    jld j7, j1, LNT
    jadd j6, j6, j7
    jst j8, j6, 0
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j1, LNTN
  lna_add:
    jldi j4, 1
    jadd j2, j2, j4
    jst j2, j3, 0
  lna_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp lna_unit
lna_counted:
  jldi j5, 0                    ; the most (the smaller of equals)
  jldi j6, 0
  jld j3, j1, LNTN
  jld j4, j1, LNT
  lna_b:
    jjz j3, lna_have
    jld j8, j4, 0
    jldi j7, 3
    jshl j7, j8, j7
    jld j2, j1, LNW
    jadd j7, j7, j2
    jld j2, j7, 0
    jst j1, j7, 0
    jsub j7, j2, j5
    jjz j7, lna_tie
    jldi j10, 63
    jsar j7, j7, j10
    jjnz j7, lna_bnext
    jadd j5, j2, j1
    jadd j6, j8, j1
    jjmp lna_bnext
  lna_tie:
    jsub j7, j8, j6
    jldi j10, 63
    jsar j7, j7, j10
    jjz j7, lna_bnext
    jadd j6, j8, j1
  lna_bnext:
    jldi j7, 8
    jadd j4, j4, j7
    jldi j7, 1
    jsub j3, j3, j7
    jjmp lna_b
lna_have:
  jst j6, j1, LNQ
  jld j2, j1, LN4               ; (the reading as it was)
  jst j2, j1, PASS
  jld j2, j1, LN5
  jst j2, j1, LABEL
  jld j2, j1, LN6
  jst j2, j1, LABLEN
  jst j1, j1, QN
  jjz j6, lna_done
  jldi j9, 1                    ; each renglon: of its language, or out
  lnk_ren:
    jldi j1, 0
    jld j2, j1, NTOK
    jsub j2, j9, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, lna_done
    jst j9, j1, LN1
    jldi j10, 0                 ; (its units, and those of the question's language)
    jldi j11, 0
    lnk_unit:
      jld j2, j1, NTOK
      jsub j2, j9, j2
      jldi j3, 63
      jsar j2, j2, j3
      jjz j2, lnk_end
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, ROOMT
      jadd j3, j3, j4
      jld j2, j3, 0
      jjz j2, lnk_end
      jldi j3, 1
      jadd j10, j10, j3
      jldi j3, 3
      jshl j3, j2, j3
      jld j4, j1, LNG
      jadd j3, j3, j4
      jld j3, j3, 0
      jld j4, j1, LNQ
      jsub j3, j3, j4
      jjnz j3, lnk_other
      jldi j3, 1
      jadd j11, j11, j3
    lnk_other:
      jldi j3, 1
      jadd j9, j9, j3
      jjmp lnk_unit
  lnk_end:
    jjz j10, lnk_next
    jadd j3, j11, j11           ; most of it its language: kept
    jsub j3, j10, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, lnk_next
    jld j5, j1, LN1             ; else out
    lnk_out:
      jsub j3, j5, j9
      jjz j3, lnk_next
      jldi j3, 3
      jshl j3, j5, j3
      jld j4, j1, ROOMT
      jadd j3, j3, j4
      jst j1, j3, 0
      jldi j3, 1
      jadd j5, j5, j3
      jjmp lnk_out
  lnk_next:
    jldi j3, 1
    jadd j9, j9, j3
    jjmp lnk_ren
lna_done:
  jldi j1, 0
  jret

