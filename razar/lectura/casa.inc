; The house decided: the foundation and the furniture (Capitan, 2026-11-06: "two cores that explain an object or an
; action, and glue, the structure that gives the cores their sense: the foundations and the furniture inside a
; house"), shared by pulso and sentido. By the one rule, from the pulses of the same place with another word that
; learn_pulses (pulso.inc) keeps: what was kept is foundation and what changed is furniture, a change between two that
; were foundation in the round before still the house; each word judged against the book's own share of kept, in
; rounds until no word changes sides. house_decide leaves each word's bits in ROOMGB and its side in ROOMSD (above 0
; foundation, below furniture, 0 neither). The program keeps its variables away from 1AD0h-1B57h and 1C00h.
ROOMGB = 1AD0h                  ; the bits of each word, the book's kept and changed (and log2 of them and of both), how
SFX   = 1AD8h                   ; many of each, the word walked, the words left, its kept and all, log2 of all, the
SVR   = 1AE0h                   ; side listed
LSF   = 1AE8h
LSV   = 1AF0h
LST   = 1AF8h
NFND  = 1B00h
NFUR  = 1B08h
HI    = 1B10h
HL    = 1B18h
HK    = 1B20h
HN    = 1B28h
LHN   = 1B30h
HSIDE = 1B38h
NRND  = 1B40h                   ; its rounds, the words that changed sides in this one
NCHG  = 1B48h
ROOMSD = 1B50h                  ; the side of each word, the house decided
HACC  = 1C00h                   ; a sum of bits

; The house, decided. Uses j1-j14.
house_decide:
  jldi j1, 0
  jld j11, j1, NV               ; its bits by word (above 0 foundation, below furniture), and its side kept
  jldi j2, 4
  jshl j11, j11, j2
  jcall0 j1, room
  jst j13, j1, ROOMGB
  jld j2, j1, NV
  jldi j3, 3
  jshl j2, j2, j3
  jadd j2, j13, j2
  jst j2, j1, ROOMSD
  jst j1, j1, NRND
hr_round:                       ; a round: counted again from the pulses, with the house of the round before
  jcall0 j1, h_recount
  jst j1, j1, NCHG
  jst j1, j1, SFX               ; the book's: all kept, all changed
  jst j1, j1, SVR
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMFX
    jadd j3, j3, j2
    jld j3, j3, 0
    jld j4, j1, SFX
    jadd j4, j4, j3
    jst j4, j1, SFX
    jld j3, j1, ROOMVR
    jadd j3, j3, j2
    jld j3, j3, 0
    jld j4, j1, SVR
    jadd j4, j4, j3
    jst j4, j1, SVR
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jld j2, j1, SFX
  jjz j2, hd_none
  jld j3, j1, SVR
  jjz j3, hd_none
  jcall lg16
  jst j2, j1, LSF
  jld j2, j1, SVR
  jcall lg16
  jst j2, j1, LSV
  jld j2, j1, SFX
  jld j3, j1, SVR
  jadd j2, j2, j3
  jcall lg16
  jst j2, j1, LST
  jldi j1, 0                    ; every word's bits
  jst j1, j1, NFND
  jst j1, j1, NFUR
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jst j9, j1, HI
    jst j10, j1, HL
    jcall0 j1, h_bits
    jld j9, j1, HI
    jld j10, j1, HL
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMGB
    jadd j3, j3, j4
    jld j4, j3, 0               ; did it change sides since the round before?
    jst j2, j3, 0
    jcall h_sign
    jadd j5, j6, j1
    jadd j2, j4, j1
    jcall h_sign
    jsub j5, j5, j6
    jjz j5, hb_same
    jld j5, j1, NCHG
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j1, NCHG
  hb_same:
    jld j2, j3, 0
    jjz j2, hb_next
    jldi j4, 63
    jsar j4, j2, j4
    jjnz j4, hb_fur
    jld j3, j1, NFND
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, NFND
    jjmp hb_next
  hb_fur:
    jld j3, j1, NFUR
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, NFUR
  hb_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 1                    ; until no word changes sides: the floor has stopped moving
  jldadd j2, j1, NRND
  jld j3, j1, NCHG
  jjnz j3, hr_round
  jldi j1, 0                    ; the house decided: each side kept (the lists below take words out of the bits)
  jld j9, j1, ROOMGB
  jld j11, j1, ROOMSD
  jld j10, j1, NV
  jwhile j10
    jld j2, j9, 0
    jst j2, j11, 0
    jldi j2, 8
    jadd j9, j9, j2
    jadd j11, j11, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
hd_none:
  jret

; j6 = the side of j2: 1 above 0, -1 below, 0 neither. Uses j6, j7.
h_sign:
  jldi j7, 63
  jsar j6, j2, j7
  jjnz j6, hs_done
  jjz j2, hs_done
  jldi j6, 1
hs_done:
  jret

; The house counted again from the pulses of the same place with another word: the frame kept is foundation; the two
; fillings that changed are furniture, unless both were foundation in the round before (the structure varying within
; itself is still structure: a door changed for another door is no furniture). Uses j1-j10.
h_recount:
  jldi j1, 0
  jld j9, j1, ROOMFX            ; both tables empty
  jld j10, j1, NV
  jadd j10, j10, j10
  jwhile j10
    jst j1, j9, 0
    jldi j2, 8
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jld j9, j1, ROOMHL
  jld j10, j1, NHL
  jwhile j10
    jldi j1, 0
    jld j2, j9, 0
    jld j3, j1, ROOMFX
    jcall h_bump
    jld j2, j9, 8
    jld j3, j1, ROOMFX
    jcall h_bump
    jld j2, j9, 16
    jld j3, j1, ROOMFX
    jcall h_bump
    jld j3, j1, ROOMVR            ; the fillings: furniture, or both foundation
    jld j2, j9, 24
    jcall h_found
    jjz j4, hc_fur
    jld j2, j9, 32
    jcall h_found
    jjz j4, hc_fur
    jld j3, j1, ROOMFX
  hc_fur:
    jld j2, j9, 24
    jst j3, j1, HL
    jcall h_bump
    jld j3, j1, HL
    jld j2, j9, 32
    jcall h_bump
    jldi j2, 40
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jret

; j4 = 1 if the word j2 was foundation in the round before. Uses j1, j4, j5 (keeps j3).
h_found:
  jldi j1, 0
  jld j5, j1, ROOMGB
  jldx j4, j5, j2
  jldi j5, 63
  jsar j5, j4, j5
  jjnz j5, hf_no
  jjz j4, hf_no
  jldi j4, 1
  jret
hf_no:
  jldi j4, 0
  jret

; The word j2 once more in the table at j3. Uses j1, j2, j4 (keeps j3).
h_bump:
  jldi j1, 0
  jldi j4, 3
  jshl j2, j2, j4
  jadd j2, j2, j3
  jldi j4, 1
  jldadd j4, j2, 0
  jldi j1, 0
  jret

; The bits of the word HI: k kept of n (kept and changed), against the book's share kept. -> j2 (signed: above 0 a
; foundation, below furniture, 0 neither). Uses j1-j8.
h_bits:
  jldi j1, 0
  jld j9, j1, HI
  jldi j3, 3
  jshl j7, j9, j3
  jld j3, j1, ROOMFX
  jadd j3, j3, j7
  jld j4, j3, 0
  jld j3, j1, ROOMVR
  jadd j3, j3, j7
  jld j5, j3, 0
  jadd j5, j5, j4
  jjz j5, hb_zero
  jst j4, j1, HK
  jst j5, j1, HN
  jld j2, j1, HN
  jcall lg16
  jst j2, j1, LHN
  jst j1, j1, HACC
  jld j2, j1, HK                ; k * (log2 k - log2 n - log2 SFX + log2 ST)
  jjz j2, hb_rest
  jcall lg16
  jld j3, j1, LHN
  jsub j2, j2, j3
  jld j3, j1, LSF
  jsub j2, j2, j3
  jld j3, j1, LST
  jadd j2, j2, j3
  jld j3, j1, HK
  jmul j2, j2, j3
  jst j2, j1, HACC
hb_rest:
  jld j2, j1, HN                ; (n - k) * (log2(n - k) - log2 n - log2 SVR + log2 ST)
  jld j3, j1, HK
  jsub j2, j2, j3
  jjz j2, hb_cost
  jcall lg16
  jld j3, j1, LHN
  jsub j2, j2, j3
  jld j3, j1, LSV
  jsub j2, j2, j3
  jld j3, j1, LST
  jadd j2, j2, j3
  jld j3, j1, HN
  jld j4, j1, HK
  jsub j3, j3, j4
  jmul j2, j2, j3
  jld j3, j1, HACC
  jadd j2, j2, j3
  jst j2, j1, HACC
hb_cost:
  jld j2, j1, HACC              ; its share pays log2(n) / 2; what is left, with the side
  jld j3, j1, LHN
  jldi j4, 1
  jsar j3, j3, j4
  jsub j2, j2, j3
  jldi j4, 63
  jsar j4, j2, j4
  jjnz j4, hb_zero
  jjz j2, hb_zero
  jld j3, j1, HK                ; its side: k * SVR against (n - k) * SFX
  jld j4, j1, SVR
  jmul j3, j3, j4
  jld j4, j1, HN
  jld j5, j1, HK
  jsub j4, j4, j5
  jld j5, j1, SFX
  jmul j4, j4, j5
  jsub j3, j3, j4
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, hb_done
  jldi j3, 0
  jsub j2, j3, j2
hb_done:
  jret
hb_zero:
  jldi j2, 0
  jret

