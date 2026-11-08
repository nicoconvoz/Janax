; The kernel's memory of the books' question-answer pairs, heard through the cardumen's pieces (Capitan, 2026-11-07:
; "translate the sentence into the construction of the songs it already knows, with recombinations; the memory is not
; needed in the cube: the kernel carries it, the memory is on the kernel's side"; "the longer, the harder to reach
; 20%"). An instrument, in two halves:
;   - the ear: each question is sung with the seven pieces of Fano's alphabet (palabras.pl, alfabeto=fano), a letter
;     two pieces (7 x 7 = 49 letters, the alphabet the pairs themselves use: no list), and the pieces tremble: each one,
;     with the chance given, is heard as another of the seven. The chances are the cube's measured ones (Fano: about
;     4% of the pieces lost with a 10% temblor, about 9% with 20%; cardumen.md), not the cube running: the cube
;     carries, it does not compute (measured, 2026-11-05).
;   - the kernel: every question of the books kept by its words (their prints), and the answer of the one that shares
;     the most words with what was heard is the answer said back.
; It reads the house's "pares" ("P:" and "R:" lines, sentido.jsm writes them) and says, for each chance, how many
; answers came back right, by the question's length in words.
S_LIBRO = 0                     ; (the texts lectura.inc asks for)
S_P     = 10h
S_NOBOOK = 20h
S_NOMEM = 40h
S_PARES = 80h
S_HEAD  = 0C0h
S_PROB  = 100h
S_OK    = 140h
S_LEN   = 180h

PRB   = 1200h                   ; the file: its bytes, how many, the room's size, a handle
PRN   = 1208h
PRC   = 1210h
PRH   = 1218h
PPR   = 1220h                   ; the pairs: by pair {question's start, its bytes, answer's print, its words}, how many
PPN   = 1228h
ALF   = 1230h                   ; by byte: its letter's number plus one (0: no letter); by number its byte; how many
ALI   = 1238h
ALN   = 1240h
WIX   = 1248h                   ; the kernel's memory: by a word's print {key, the first of its pairs' list, the last pair}
LNK   = 1268h                   ; the lists {pair, next}, how many
LNKN  = 1270h
SCO   = 1278h                   ; by pair, its score for the question heard; the pairs touched, how many
TOU   = 1280h
TOUN  = 1288h
NBF   = 1290h                   ; the question heard (its bytes), how long
NBN   = 1298h
RNG   = 12A0h                   ; the lottery's state (splitmix64)
PCH   = 12A8h                   ; the chance a piece trembles (in 1000ths)
TT1   = 12B0h                   ; walking
TT2   = 12B8h
TT3   = 12C0h
TT4   = 12C8h
TT5   = 12D0h
TT6   = 12D8h
TT7   = 12E0h
BKT   = 12E8h                   ; by length (1-5, 6-12, 13 words or more): asked, right (6 qwords)
CFT   = 1320h                   ; the cube's own confusions, if the house has them ("cf", voluntad_oraciones.jsm): by
CFS   = 1328h                   ; song sung its row (heard: 0 nothing, g + 1 song g), each row's sum; 1 when there;
CFON  = 1330h                   ; the pieces' base (7 Fano's, or the 30 songs); a label
BASE  = 1338h
CFL   = 1340h
PCX   = 1348h                   ; by pair its context (the building before the question, "C:"): {start, bytes}; the
CXS   = 1350h                   ; last "C:" line's start and bytes; 1 when the pairs have contexts
CXL   = 1358h
CTX   = 1360h

include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jcall mp_read
jcall mp_cube                   ; (the cube's own confusions, when they are there: the 30 songs it knows are the pieces)
jldi j1, 0
jld j2, j1, PRN
jjz j2, finish
jcall mp_pairs
jcall mp_alphabet
jcall mp_index
jldi j1, S_HEAD
jcall puts
jldi j1, 0
jld j2, j1, PPN
jcall putnum
jldi j2, 10
jcall putch
jld j2, j1, CFON                ; with the cube's table: one round, heard as the cube hears
jjz j2, mp_fano
jldi j2, 0
jcall mp_round
jjmp finish
mp_fano:
jldi j2, 0                      ; the chances: 0, 2%, 4% (temblor 10%), 9% (temblor 20%), 20%
jcall mp_round
jldi j2, 20
jcall mp_round
jldi j2, 40
jcall mp_round
jldi j2, 90
jcall mp_round
jldi j2, 200
jcall mp_round
jjmp finish

; The cube's own confusions, from the house's "cf" (30 songs x 31 qwords, voluntad_oraciones.jsm): when it is there,
; the pieces are the 30 songs (BASE 30) and each is heard as the cube heard it; else Fano's 7 (BASE 7). Uses j1-j14.
mp_cube:
  jldi j1, 0
  jst j1, j1, CFON
  jldi j2, 7
  jst j2, j1, BASE
  jldi j2, 6663h                ; "cf"
  jst j2, j1, CFL
  jldi j11, 7448
  jcall room
  jldi j1, 0
  jst j13, j1, CFT
  jldi j10, 4
  jldi j11, CFL
  jldi j12, 2
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, mpc_done
  jst j13, j1, TT1
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, CFT
  jldi j12, 7440
  jcall ask
  jldi j1, 0
  jst j13, j1, TT2
  jld j10, j1, TT1
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, TT2
  jldi j3, 7440
  jsub j2, j2, j3
  jjnz j2, mpc_done
  jldi j11, 248                 ; each row's sum
  jcall room
  jldi j1, 0
  jst j13, j1, CFS
  jldi j9, 0
  mpc_w:
    jldi j2, 30
    jsub j2, j9, j2
    jjz j2, mpc_on
    jldi j10, 0
    jldi j11, 0
    mpc_g:
      jldi j2, 31
      jsub j2, j11, j2
      jjz j2, mpc_sum
      jldi j2, 31
      jmul j2, j9, j2
      jadd j2, j2, j11
      jldi j3, 3
      jshl j2, j2, j3
      jld j3, j1, CFT
      jadd j2, j2, j3
      jld j2, j2, 0
      jadd j10, j10, j2
      jldi j2, 1
      jadd j11, j11, j2
      jjmp mpc_g
    mpc_sum:
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, CFS
      jadd j3, j3, j4
      jst j10, j3, 0
      jldi j2, 1
      jadd j9, j9, j2
      jjmp mpc_w
mpc_on:
  jldi j2, 1
  jst j2, j1, CFON
  jldi j2, 30
  jst j2, j1, BASE
mpc_done:
  jldi j1, 0
  jret

; The house's "pares", whole, into a room that doubles while the file has more (PRB, PRN). Uses j1-j14.
mp_read:
  jldi j1, 0
  jst j1, j1, PRN
  jldi j10, 4
  jldi j11, S_PARES
  jldi j12, 5
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, mpr_done
  jst j13, j1, PRH
  jldi j11, 1                   ; (64 KB to start)
  jldi j2, 16
  jshl j11, j11, j2
  jst j11, j1, PRC
  jcall room
  jldi j1, 0
  jst j13, j1, PRB
  mpr_lap:
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
    jjnz j3, mpr_close
    jld j11, j1, PRC
    jadd j11, j11, j11
    jcall room
    jldi j1, 0
    jld j3, j1, PRB
    jld j4, j1, PRN
    jldi j5, 0
    mpr_mv:
      jsub j6, j5, j4
      jjz j6, mpr_moved
      jadd j6, j3, j5
      jldb j6, j6, 0
      jadd j7, j13, j5
      jstb j6, j7, 0
      jldi j6, 1
      jadd j5, j5, j6
      jjmp mpr_mv
    mpr_moved:
    jst j13, j1, PRB
    jld j2, j1, PRC
    jadd j2, j2, j2
    jst j2, j1, PRC
    jjmp mpr_lap
mpr_close:
  jld j10, j1, PRH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
mpr_done:
  jldi j1, 0
  jret

; The pairs: each "P: " line and the "R: " line after it (PPR, PPN): the question where it is, and the answer by its
; print (two answers alike are the same answer). Uses j1-j14.
mp_pairs:
  jldi j1, 0
  jld j11, j1, PRN              ; (a pair a line at most)
  jldi j2, 2
  jshl j11, j11, j2
  jldi j2, 32
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PPR
  jld j11, j1, PRN              ; (and their contexts)
  jldi j2, 1
  jshl j11, j11, j2
  jldi j2, 32
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PCX
  jst j1, j1, CXL
  jst j1, j1, PPN
  jst j1, j1, TT1               ; the place walked
  mpp_line:
    jldi j1, 0
    jld j9, j1, TT1
    jld j2, j1, PRN
    jsub j2, j9, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, mpp_done
    jcall mp_lineat             ; this line: j9 its start, j10 its end (the line feed's place)
    jldi j1, 0
    jld j2, j1, PRB
    jadd j2, j2, j9
    jldb j3, j2, 0
    jldi j4, 67                 ; (a context: the next question's)
    jsub j4, j3, j4
    jjnz j4, mpp_notc
    jldi j2, 3
    jadd j2, j9, j2
    jst j2, j1, CXS
    jsub j2, j10, j2
    jldi j4, 63
    jsar j4, j2, j4
    jjnz j4, mpp_next
    jst j2, j1, CXL
    jldi j2, 1
    jst j2, j1, CTX
    jjmp mpp_next
  mpp_notc:
    jldi j4, 80
    jsub j3, j3, j4
    jjnz j3, mpp_next
    jst j9, j1, TT2             ; a question: its answer is the next line
    jst j10, j1, TT3
    jldi j2, 1
    jadd j9, j10, j2
    jld j2, j1, PRN
    jsub j2, j9, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, mpp_done
    jcall mp_lineat
    jldi j1, 0
    jld j2, j1, PRB
    jadd j2, j2, j9
    jldb j3, j2, 0
    jldi j4, 82
    jsub j3, j3, j4
    jjnz j3, mpp_next
    jst j10, j1, TT4
    jld j2, j1, PPN             ; kept: {its question's start, bytes, its answer's print}
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j8, j3, j4
    jld j3, j1, TT2
    jldi j4, 3
    jadd j3, j3, j4
    jst j3, j8, 0
    jld j4, j1, TT3
    jsub j4, j4, j3
    jst j4, j8, 8
    jldi j3, 3
    jadd j3, j9, j3
    jld j4, j1, TT4
    jsub j4, j4, j3
    jld j5, j1, PRB
    jadd j3, j3, j5
    jcall mp_print
    jldi j1, 0
    jld j2, j1, PPN
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j8, j3, j4
    jst j5, j8, 16
    jldi j3, 4                  ; its context, if a "C:" line came before it
    jshl j3, j2, j3
    jld j4, j1, PCX
    jadd j3, j3, j4
    jld j4, j1, CXS
    jst j4, j3, 0
    jld j4, j1, CXL
    jst j4, j3, 8
    jst j1, j1, CXL
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PPN
    jld j10, j1, TT4
  mpp_next:
    jldi j1, 0
    jldi j2, 1
    jadd j2, j10, j2
    jst j2, j1, TT1
    jjmp mpp_line
mpp_done:
  jldi j1, 0
  jret

; The line from j9 -> j10 the place of its line feed (or the file's end). Uses j1-j4.
mp_lineat:
  jldi j1, 0
  jadd j10, j9, j1
  mpl_lap:
    jld j2, j1, PRN
    jsub j2, j10, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, mpl_done
    jld j2, j1, PRB
    jadd j2, j2, j10
    jldb j2, j2, 0
    jldi j3, 10
    jsub j2, j2, j3
    jjz j2, mpl_done
    jldi j2, 1
    jadd j10, j10, j2
    jjmp mpl_lap
mpl_done:
  jret

; FNV-1a of the j4 bytes at j3 -> j5 (never 0). Uses j3-j7.
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

; The alphabet: every letter byte of the questions, by first sight, its number (at most 49: Fano's 7 x 7; the rest is
; no letter). Uses j1-j14.
mp_alphabet:
  jldi j1, 0
  jldi j11, 2048
  jcall room
  jldi j1, 0
  jst j13, j1, ALF
  jldi j11, 512
  jcall room
  jldi j1, 0
  jst j13, j1, ALI
  jst j1, j1, ALN
  jldi j9, 0
  mpa_lap:
    jldi j1, 0
    jld j2, j1, PRN
    jsub j2, j9, j2
    jjz j2, mpa_done
    jld j2, j1, PRB
    jadd j2, j2, j9
    jldb j3, j2, 0
    jcall mp_isletter
    jjz j2, mpa_next
    jldi j4, 3
    jshl j4, j3, j4
    jld j5, j1, ALF
    jadd j4, j4, j5
    jld j5, j4, 0
    jjnz j5, mpa_next
    jld j6, j1, ALN               ; (at most the base's two pieces: 49, or 900)
    jld j7, j1, BASE
    jmul j7, j7, j7
    jsub j7, j6, j7
    jjz j7, mpa_next
    jldi j7, 1
    jadd j7, j6, j7
    jst j7, j4, 0
    jldi j8, 3
    jshl j8, j6, j8
    jld j5, j1, ALI
    jadd j8, j8, j5
    jst j3, j8, 0
    jst j7, j1, ALN
  mpa_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp mpa_lap
mpa_done:
  jldi j1, 0
  jret

; The kernel's memory: each pair's question by its words (each word once a pair). Uses j1-j14.
mp_index:
  jldi j2, WIX
  jldi j3, 24
  jcall pl_new
  jldi j1, 0
  jld j11, j1, PRN
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 32
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNK
  jldi j2, 1
  jst j2, j1, LNKN
  jst j1, j1, TT5
  mpx_pair:
    jldi j1, 0
    jld j2, j1, TT5
    jld j3, j1, PPN
    jsub j3, j2, j3
    jjz j3, mpx_done
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j8, j3, j4
    jld j9, j8, 0               ; its question's bytes, from the file
    jld j10, j8, 8
    jld j2, j1, PRB
    jadd j9, j9, j2
    jst j1, j1, TT6             ; (its words, counted)
    jldi j2, 0
    jcall mp_words
    jldi j1, 0
    jld j2, j1, TT5
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j8, j3, j4
    jld j2, j1, TT6
    jst j2, j8, 24
    jld j2, j1, TT5             ; and its context's words, the same pair's (its length is the question's)
    jldi j3, 4
    jshl j3, j2, j3
    jld j4, j1, PCX
    jadd j3, j3, j4
    jld j10, j3, 8
    jjz j10, mpx_nocx
    jld j9, j3, 0
    jld j2, j1, PRB
    jadd j9, j9, j2
    jldi j2, 0
    jcall mp_words
  mpx_nocx:
    jldi j1, 0
    jld j2, j1, TT5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT5
    jjmp mpx_pair
mpx_done:
  jldi j1, 0
  jret

; Every word of the j10 bytes at j9: j2 = 0, noted for pair TT5 in the memory (TT6 counts them); 1, its pairs scored
; (SCO, TOU). Uses j1-j14.
mp_words:
  jldi j1, 0
  jst j2, j1, TT7
  mpw_lap:
    jldi j1, 0
    jjz j10, mpw_done
    jldb j3, j9, 0
    jcall mp_isletter
    jjnz j2, mpw_word
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
    jjmp mpw_lap
  mpw_word:
    jldi j8, 0                  ; its letters, to the first no letter
    mpw_end:
      jsub j2, j8, j10
      jjz j2, mpw_have
      jadd j2, j9, j8
      jldb j3, j2, 0
      jcall mp_isletter
      jjz j2, mpw_have
      jldi j2, 1
      jadd j8, j8, j2
      jjmp mpw_end
  mpw_have:
    jadd j3, j9, j1
    jadd j4, j8, j1
    jadd j9, j9, j8
    jsub j10, j10, j8
    jst j9, j1, TT1
    jst j10, j1, TT2
    jcall mp_print
    jldi j1, 0
    jld j2, j1, TT7
    jjnz j2, mpw_score
    jcall mp_note
    jjmp mpw_back
  mpw_score:
    jcall mp_score
  mpw_back:
    jldi j1, 0
    jld j9, j1, TT1
    jld j10, j1, TT2
    jjmp mpw_lap
mpw_done:
  jldi j1, 0
  jret

; Word j5 is in pair TT5's question (once). Uses j1-j8.
mp_note:
  jldi j2, WIX
  jcall pl_take
  jldi j1, 0
  jld j2, j1, TT5
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j4, 16
  jsub j3, j3, j2
  jjz j3, mpn_done
  jst j2, j4, 16
  jld j3, j1, LNKN
  jldi j5, 4
  jshl j5, j3, j5
  jld j6, j1, LNK
  jadd j5, j5, j6
  jld j6, j1, TT5
  jst j6, j5, 0
  jld j6, j4, 8
  jst j6, j5, 8
  jst j3, j4, 8
  jldi j5, 1
  jadd j3, j3, j5
  jst j3, j1, LNKN
  jld j2, j1, TT6
  jadd j2, j2, j5
  jst j2, j1, TT6
mpn_done:
  jldi j1, 0
  jret

; Word j5 heard: each pair whose question has it, one more. Uses j1-j8.
mp_score:
  jldi j2, WIX
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, mps_done
  jld j6, j4, 8
  mps_lap:
    jjz j6, mps_done
    jldi j3, 4
    jshl j3, j6, j3
    jld j4, j1, LNK
    jadd j3, j3, j4
    jld j7, j3, 0               ; the pair
    jld j6, j3, 8
    jldi j3, 3
    jshl j3, j7, j3
    jld j4, j1, SCO
    jadd j3, j3, j4
    jld j4, j3, 0
    jjnz j4, mps_add
    jld j5, j1, TOUN
    jldi j8, 3
    jshl j8, j5, j8
    jld j2, j1, TOU
    jadd j8, j8, j2
    jst j7, j8, 0
    jldi j8, 1
    jadd j5, j5, j8
    jst j5, j1, TOUN
  mps_add:
    jldi j8, 1
    jadd j4, j4, j8
    jst j4, j3, 0
    jjmp mps_lap
mps_done:
  jldi j1, 0
  jret

; One round: every question heard with pieces that tremble with chance j2 (1000ths), its answer looked for in the
; memory; the right ones said, by the question's length. Uses j1-j14.
mp_round:
  jldi j1, 0
  jst j2, j1, PCH
  jldi j2, 0                    ; (the same lottery each round: seeded the same)
  jshi j2, 1234h
  jshi j2, 5678h
  jshi j2, 9ABCh
  jshi j2, 0DEF1h
  jst j2, j1, RNG
  jld j11, j1, PPN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, SCO
  jld j11, j1, PPN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, TOU
  jld j11, j1, PRN
  jcall room
  jldi j1, 0
  jst j13, j1, NBF
  jldi j9, 0
  jldi j10, 6
  mpr0:
    jjz j10, mpr0d
    jldi j3, 3
    jshl j3, j9, j3
    jst j1, j3, BKT
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
    jjmp mpr0
mpr0d:
  jst j1, j1, TT5
  mpq_lap:
    jldi j1, 0
    jld j2, j1, TT5
    jld j3, j1, PPN
    jsub j3, j2, j3
    jjz j3, mpq_said
    jcall mp_hear               ; heard (NBF, NBN)
    jldi j1, 0
    jst j1, j1, TOUN
    jld j9, j1, NBF
    jld j10, j1, NBN
    jldi j2, 1
    jcall mp_words              ; its pairs scored
    jcall mp_best               ; -> j2 the best pair (scores back to 0)
    jldi j1, 0
    jld j3, j1, TT5             ; right if its answer is this question's answer
    jldi j4, 5
    jshl j4, j3, j4
    jld j5, j1, PPR
    jadd j4, j4, j5
    jld j6, j4, 16
    jld j7, j4, 24
    jldi j8, 0
    jjz j2, mpq_judge
    jldi j3, 1
    jsub j2, j2, j3
    jldi j3, 5
    jshl j2, j2, j3
    jadd j2, j2, j5
    jld j2, j2, 16
    jsub j2, j2, j6
    jjnz j2, mpq_judge
    jldi j8, 1
  mpq_judge:
    jldi j3, 0                  ; its length: 1-5 words, 6-12, 13 or more
    jldi j4, 6
    jsub j4, j7, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, mpq_b
    jldi j3, 1
    jldi j4, 13
    jsub j4, j7, j4
    jsar j4, j4, j5
    jjnz j4, mpq_b
    jldi j3, 2
  mpq_b:
    jldi j4, 4
    jshl j3, j3, j4
    jld j4, j3, BKT
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j3, BKT
    jld j4, j3, BKT + 8
    jadd j4, j4, j8
    jst j4, j3, BKT + 8
    jld j2, j1, TT5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT5
    jjmp mpq_lap
mpq_said:
  jldi j1, S_PROB
  jcall puts
  jld j2, j1, PCH
  jcall putnum
  jldi j1, S_OK
  jcall puts
  jldi j9, 0
  mpq_s:
    jldi j1, 0
    jldi j2, 3
    jsub j2, j9, j2
    jjz j2, mpq_end
    jldi j3, 4
    jshl j3, j9, j3
    jld j2, j3, BKT + 8
    jst j3, j1, TT6
    jcall putnum
    jldi j2, 47
    jcall putch
    jldi j1, 0
    jld j3, j1, TT6
    jld j2, j3, BKT
    jcall putnum
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jjmp mpq_s
mpq_end:
  jldi j1, S_LEN
  jcall puts
  jldi j2, 10
  jcall putch
  jcall flush
  jldi j1, 0
  jret

; Pair TT5's question as heard: each letter two pieces of Fano's seven, each piece with chance PCH heard as another;
; the two pieces heard give the letter back (one past the alphabet: no letter, a space). Into NBF, NBN. Uses j1-j14.
mp_hear:
  jldi j1, 0
  jld j11, j1, NBF
  jld j2, j1, TT5               ; its context first, if it has one (what came before it in the book)
  jldi j3, 4
  jshl j3, j2, j3
  jld j4, j1, PCX
  jadd j8, j3, j4
  jld j10, j8, 8
  jjz j10, mph_q
  jld j9, j8, 0
  jld j2, j1, PRB
  jadd j9, j9, j2
  jcall mp_hspan
  jldi j3, 32
  jstb j3, j11, 0
  jldi j3, 1
  jadd j11, j11, j3
mph_q:
  jld j2, j1, TT5
  jldi j3, 5
  jshl j3, j2, j3
  jld j4, j1, PPR
  jadd j8, j3, j4
  jld j9, j8, 0
  jld j10, j8, 8
  jld j2, j1, PRB
  jadd j9, j9, j2
  jcall mp_hspan
  jld j2, j1, NBF
  jsub j2, j11, j2
  jst j2, j1, NBN
  jret

; The j10 bytes at j9 heard into j11 (moved past them). Uses j1-j14.
mp_hspan:
  mph_lap:
    jldi j1, 0
    jjz j10, mph_done
    jldb j3, j9, 0
    jldi j4, 3
    jshl j4, j3, j4
    jld j5, j1, ALF
    jadd j4, j4, j5
    jld j4, j4, 0
    jjz j4, mph_put             ; (no letter: as it is)
    jldi j5, 1
    jsub j4, j4, j5
    jld j5, j1, BASE
    jdiv j6, j4, j5             ; its pieces
    jmul j7, j6, j5
    jsub j7, j4, j7
    jst j9, j1, TT1
    jst j10, j1, TT2
    jst j11, j1, TT3
    jst j7, j1, TT4
    jadd j2, j6, j1
    jcall mp_tremble
    jst j2, j1, TT6
    jld j2, j1, TT4
    jcall mp_tremble
    jld j6, j1, TT6
    jldi j5, 63                 ; (a piece not heard: no letter)
    jsar j5, j6, j5
    jjnz j5, mph_nol
    jldi j5, 63
    jsar j5, j2, j5
    jjnz j5, mph_nol
    jld j5, j1, BASE
    jmul j6, j6, j5
    jadd j6, j6, j2
    jld j9, j1, TT1
    jld j10, j1, TT2
    jld j11, j1, TT3
    jld j5, j1, ALN
    jsub j5, j6, j5
    jldi j7, 63
    jsar j5, j5, j7
    jldi j3, 32
    jjz j5, mph_put
    jjmp mph_letter
  mph_nol:
    jld j9, j1, TT1
    jld j10, j1, TT2
    jld j11, j1, TT3
    jldi j3, 32
    jjmp mph_put
  mph_letter:
    jldi j5, 3
    jshl j5, j6, j5
    jld j7, j1, ALI
    jadd j5, j5, j7
    jld j3, j5, 0
  mph_put:
    jstb j3, j11, 0
    jldi j2, 1
    jadd j9, j9, j2
    jadd j11, j11, j2
    jsub j10, j10, j2
    jjmp mph_lap
mph_done:
  jldi j1, 0
  jret

; Piece j2 heard -> j2 (-1: nothing heard): with the cube's table, drawn from its row (what the cube heard when it was
; sung); else with chance PCH, one of the other six. Uses j1-j6.
mp_tremble:
  jldi j1, 0
  jst j2, j1, TT7
  jld j3, j1, CFON
  jjz j3, mpt_fano
  jcall mp_rand
  jldi j1, 0
  jld j3, j1, TT7
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, CFS
  jadd j3, j3, j4
  jld j3, j3, 0
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4               ; (its place in the row)
  jld j3, j1, TT7
  jldi j4, 31
  jmul j3, j3, j4
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, CFT
  jadd j3, j3, j4
  jldi j5, 0
  mpt_row:
    jld j4, j3, 0
    jsub j2, j2, j4
    jldi j6, 63
    jsar j6, j2, j6
    jjnz j6, mpt_got
    jldi j4, 8
    jadd j3, j3, j4
    jldi j4, 1
    jadd j5, j5, j4
    jjmp mpt_row
mpt_got:
  jldi j4, 1
  jsub j2, j5, j4
  jret
mpt_fano:
  jcall mp_rand
  jldi j3, 1000
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4
  jld j3, j1, PCH
  jsub j2, j2, j3
  jldi j4, 63
  jsar j2, j2, j4
  jjz j2, mpt_same
  jcall mp_rand
  jldi j3, 6
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j1, TT7
  jadd j2, j2, j3
  jldi j3, 7
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4
  jret
mpt_same:
  jld j2, j1, TT7
  jret

; The lottery's next number (splitmix64), not negative -> j2. Uses j1-j4.
mp_rand:
  jldi j1, 0
  jld j2, j1, RNG
  jldi j3, 0
  jshi j3, 9E37h
  jshi j3, 79B9h
  jshi j3, 7F4Ah
  jshi j3, 7C15h
  jadd j2, j2, j3
  jst j2, j1, RNG
  jldi j3, 30
  jshr j4, j2, j3
  jxor j2, j2, j4
  jldi j3, 0
  jshi j3, 0BF58h
  jshi j3, 476Dh
  jshi j3, 1CE4h
  jshi j3, 0E5B9h
  jmul j2, j2, j3
  jldi j3, 27
  jshr j4, j2, j3
  jxor j2, j2, j4
  jldi j3, 0
  jshi j3, 94D0h
  jshi j3, 49BBh
  jshi j3, 1331h
  jshi j3, 11EBh
  jmul j2, j2, j3
  jldi j3, 31
  jshr j4, j2, j3
  jxor j2, j2, j4
  jldi j3, 1
  jshr j2, j2, j3
  jret

; Of the pairs touched, the one with the most words in common with what was heard (the first of equals) -> j2 its
; number plus one (0: none); their scores back to 0. Uses j1-j14.
mp_best:
  jldi j1, 0
  jldi j11, 0
  jldi j12, 0
  jld j9, j1, TOUN
  jld j10, j1, TOU
  mpb_lap:
    jjz j9, mpb_done
    jld j2, j10, 0
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, SCO
    jadd j3, j3, j4
    jld j4, j3, 0
    jst j1, j3, 0
    jsub j5, j11, j4
    jjz j5, mpb_tie
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, mpb_next
    jadd j11, j4, j1
    jldi j6, 1
    jadd j12, j2, j6
    jjmp mpb_next
  mpb_tie:
    jldi j6, 1
    jadd j6, j2, j6
    jsub j5, j6, j12
    jldi j7, 63
    jsar j5, j5, j7
    jjz j5, mpb_next
    jadd j12, j6, j1
  mpb_next:
    jldi j2, 8
    jadd j10, j10, j2
    jldi j2, 1
    jsub j9, j9, j2
    jjmp mpb_lap
mpb_done:
  jadd j2, j12, j1
  jret

include '../lectura/crece.inc'
include '../lectura/lectura.inc'
