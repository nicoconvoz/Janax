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
; With a "canta" file in the house (lines, each a question) it does not answer: it sings (Capitan, 2026-11-07: "I want
; it to build its own song, like the language, not only to hit the answer"; "from the songs themselves"). Every pair
; is a row of songs (a letter its two pieces, a silence between words, a turn after the question, an end after the
; answer); what follows each context is counted, the context one song longer only where the shorter one is said by two
; pairs or more (what one sentence says is a memory, what two say is a rule: the contexts grow as far as the books
; repeat themselves, no length given). After each question it composes, song by song, from the longest context two
; pairs say, and says what it sang; and over every pair of the books, how many of the words it sang are words of the
; books, how many of its own answer's, and how much of its answer it copied (the longest stretch in common).
S_LIBRO = 0                     ; (the texts lectura.inc asks for)
S_P     = 10h
S_NOBOOK = 20h
S_NOMEM = 40h
S_PARES = 80h
S_HEAD  = 0C0h
S_PROB  = 100h
S_OK    = 140h
S_LEN   = 180h
S_CANTA = 1C0h
S_CANL  = 1D0h
S_ARROW = 1E0h
S_CH1   = 200h
S_CH2   = 240h
S_CH3   = 260h
S_CH4   = 280h
S_CH5   = 2A0h
S_CH6   = 2C0h
S_CH7   = 2E0h
S_FUERA = 300h
S_CH8   = 310h
S_CH9   = 380h
S_CH10  = 3A0h
S_CH11  = 3E0h
S_CH12  = 3F0h
S_CH13  = 410h
S_CH14  = 430h
S_CH15  = 440h
S_RAZONA = 450h
S_RZ1   = 460h
S_RZ2   = 4B0h
S_RZ3   = 4D0h
S_SEMILLA = 4F0h
S_SD1   = 500h
S_SD2   = 540h
S_SD3   = 580h
S_SD4   = 5C0h
S_SD5   = 600h
S_SD6   = 640h
S_SD7   = 680h
S_SD8   = 6C0h
S_SD9   = 700h
S_SD10  = 710h
S_SD11  = 720h
S_MARCOS = 730h
S_MK    = 740h

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
SYM   = 1400h                   ; the song: every pair's songs in a row, how many; by pair {its first, its answer's
SYN   = 1408h                   ; first (after the turn), one past its end}
PSY   = 1410h
HPX   = 1418h                   ; by place, the print of its context so far (0: grows no more)
CXT   = 1420h                   ; the contexts: by print {key, its last pair plus one, how many pairs say it, times}
NXT   = 1440h                   ; what follows: by the print of a context and a song {key, times}
VOC   = 1460h                   ; the books' words, by print; each answer's words, by print and pair
OWN   = 1480h
PAN   = 14A0h                   ; by pair its answer: {start, bytes}
CS0   = 14A8h                   ; the empty context's print; the contexts' length now; 1 when one more was counted
ORD   = 14B0h
ALIVE = 14B8h
MAXA  = 14C0h                   ; the longest answer of the books, in songs (its end included)
CQ    = 14C8h                   ; the song being sung: its room, how many, where its answer starts, its room's size
CQN   = 14D0h
CQ0   = 14D8h
CQC   = 14E0h
CBEST = 14E8h                   ; composing: the context it follows, the times after it, the draw
CTOT  = 14F0h
CDRAW = 14F8h
CT    = 1500h                   ; what it sang, as text: its room, bytes; a row for the longest stretch in common
CTN   = 1508h
CROW  = 1510h
WMODE = 1518h                   ; the words walked: what for, which pair, a print kept
WPR   = 1520h
WPRT  = 1528h
CSW   = 1530h                   ; over the books: words sung, of the books, of its own answer, copied (1000ths
CSR   = 1538h                   ; summed), pairs
CSO   = 1540h
CCP   = 1548h
CSN   = 1550h
SPB   = 1558h                   ; the pairs' file kept aside while "canta" is read; "canta", its bytes
SPN   = 1560h
CNB   = 1568h
CNN   = 1570h
UNK   = 1580h                   ; the words sung that no book read has, by print (each said once)
F0    = 15A0h                   ; the times of all the words read; the half (mp_head): the fewest times, their times,
HEADC = 15A8h                   ; how many words; by pair its answer's words' times {all, not of the half}
HMASS = 15B0h
HEADN = 15B8h
PNUL  = 15C0h
CSWC  = 15C8h                   ; sung, not of the half, of its answer; the nulls (1000ths of a word, summed)
CSOC  = 15D0h
N0    = 15D8h
N0C   = 15E0h
CSWP  = 15E8h                   ; (before this pair)
CSWCP = 15F0h
CRMAX = 15F8h                   ; recited: the longest stretch as it is in the books read, this song's, a step's;
CRC   = 1600h                   ; summed (1000ths)
CRS   = 1608h
FK    = 1610h                   ; the pairs left out ("fuera"): from, to; the pairs asked: from, to
FE    = 1618h
EVS   = 1620h
EVE   = 1628h
NUM1  = 1630h                   ; (two numbers read)
NUM2  = 1638h
WLEN  = 1640h                   ; the word walked: its bytes, its times, 1 if not of the half
WTIM  = 1648h
WCON  = 1650h
HLO   = 1658h                   ; (halving)
HHI   = 1660h
HMID  = 1668h
NSY   = 1670h                   ; the songs a row may hold: the pieces, silence, turn, end, and the places it repeats
GON   = 1678h                   ; 1: it reasons ("razona": an answer's word that is a word of its question is sung as
QLB   = 1680h                   ; that place, BASE + 3 + k, k words from the question's end); the question's words
QLN   = 1688h                   ; {print, where, bytes}, how many, room for how many bytes; the answer's, room
QLC   = 1690h
ALB   = 1698h
SYA   = 16A0h                   ; (walking the answer's words: which, how many)
SYAN  = 16A8h
RG1   = 16B0h                   ; (kept while walking)
RG2   = 16B8h
RG3   = 16C0h
CTC   = 16C8h                   ; CT's room, bytes; the question's longest word
QMW   = 16D0h
CEC   = 16E0h                   ; places of the question sung, and how many of them said a word (over the pairs asked)
CEW   = 16E8h
SEN   = 1700h                   ; the seed (mp_seed): the book's sentences, and the rest of its walking
SENN  = 1708h
SDQ   = 1710h
QCS   = 1718h
QCN   = 1720h
QHB   = 1728h
SWB   = 1730h
MAXS  = 1738h
QI    = 1740h
QJ    = 1748h
QK    = 1750h
SA    = 1758h
SB    = 1760h
SBV   = 1768h
SBB   = 1770h
NQS   = 1778h
SBEST = 1780h
SBS   = 1788h
OBEST = 1790h
OBS   = 1798h
SCC   = 17A0h
SCN   = 17A8h
HSG   = 17B0h
HOV   = 17B8h
HRN   = 17C0h
NEV   = 17C8h
NCAND = 17D0h
SL0   = 17D8h
SSC   = 17E0h
SPOS  = 17E8h
SCTX  = 17F0h
SLGT  = 17F8h
CHN   = 1800h
SEV   = 1808h
SJJ   = 1810h
SK    = 1818h
QP    = 1820h
PLC   = 1850h                   ; 1: a place only for what the question is about (the seed); walking QLB
QFI   = 1858h
QFO   = 1860h
QFP   = 1868h
TOK   = 1870h                   ; the frames (ms_frames): the song's tokens by key {key, number}, how many; walking
TOKN  = 1890h
FSE   = 1898h
FSJ   = 18A0h
FWN   = 18A8h
FFP   = 18B0h
FFI   = 18B8h
FLAB  = 18C0h
FTR   = 18C8h
SQL   = 1840h                   ; (the question's places kept; a plain cost)
SPL   = 1848h
QPN   = 1828h
RG4   = 16D8h                   ; (a list's entry, while its print is made)

include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j11, S_PARES
jldi j12, 5
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
jcall mp_sing                   ; (with "canta": it sings instead)
jjnz j2, finish
jldi j1, 0
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

; The house's file labeled by the j12 bytes at j11, whole, into a room that doubles while the file has more (PRB,
; PRN: 0 when it is not there). Uses j1-j14.
mp_read:
  jldi j1, 0
  jst j1, j1, PRN
  jldi j10, 4
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
  jld j11, j1, PRN              ; (and their answers' places)
  jldi j2, 1
  jshl j11, j11, j2
  jldi j2, 32
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PAN
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
    jjnz j3, mpp_noans
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
    jldi j3, 4                  ; and where its answer is
    jshl j3, j2, j3
    jld j4, j1, PAN
    jadd j3, j3, j4
    jldi j4, 3
    jadd j4, j9, j4
    jst j4, j3, 0
    jld j5, j1, TT4
    jsub j5, j5, j4
    jst j5, j3, 8
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
  mpp_noans:                    ; a question with no answer line: the line looked at is read again as its own (it may
    jldi j1, 0                  ; be the next question, or its context), and this question's context goes
    jst j9, j1, TT1
    jst j1, j1, CXL
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

; Its own song, when the house has "canta": the pairs as songs, what follows each context learned, a song composed
; after each of its questions, and over the pairs of the books what it sang said. With "fuera" ("k n": the k-th of n
; stretches of the pairs, in their order) that stretch is not read: it is only asked. j2 = 1 if it sang (0: no
; "canta"). Uses j1-j14.
mp_sing:
  jldi j11, S_SEMILLA           ; (with "semilla": the book's own answers as the seed)
  jldi j12, 7
  jcall mp_aside
  jjz j3, msg_nosd
  jjmp mp_seed
msg_nosd:
  jldi j11, S_CANTA
  jldi j12, 5
  jcall mp_aside
  jldi j1, 0
  jst j2, j1, CNB
  jst j3, j1, CNN
  jjnz j3, msg_on
  jldi j2, 0
  jret
msg_on:
  jst j1, j1, FK
  jst j1, j1, FE
  jst j1, j1, EVS
  jld j2, j1, PPN
  jst j2, j1, EVE
  jldi j11, S_FUERA
  jldi j12, 5
  jcall mp_aside
  jldi j1, 0
  jadd j9, j2, j1
  jadd j10, j3, j1
  jcall mp_nums
  jldi j1, 0
  jld j2, j1, NUM1              ; the k-th of n: from (k - 1) PPN / n to k PPN / n
  jld j3, j1, NUM2
  jjz j3, msg_read
  jjz j2, msg_read
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, msg_read
  jld j4, j1, PPN
  jmul j5, j2, j4
  jdiv j5, j5, j3
  jst j5, j1, FE
  jst j5, j1, EVE
  jldi j5, 1
  jsub j2, j2, j5
  jmul j5, j2, j4
  jdiv j5, j5, j3
  jst j5, j1, FK
  jst j5, j1, EVS
  jldi j1, S_CH13
  jcall puts
  jld j2, j1, FK
  jcall putnum
  jldi j1, S_CH14
  jcall puts
  jld j2, j1, FE
  jcall putnum
  jldi j2, 10
  jcall putch
msg_read:
  jldi j11, S_RAZONA
  jldi j12, 6
  jcall mp_aside
  jldi j1, 0
  jst j3, j1, GON
  jst j1, j1, QLN
  jst j1, j1, QMW
  jcall mp_syms
  jcall mp_learn
  jcall mp_vocab
  jldi j1, 0
  jld j11, j1, MAXA
  jldi j2, 8
  jadd j11, j11, j2
  jst j11, j1, CTC
  jcall room
  jldi j1, 0
  jst j13, j1, CT
  jst j1, j1, CQC
  jldi j9, 0                    ; the row for the longest stretch: as long as the longest answer
  jldi j12, 0
  msg_mx:
    jld j2, j1, PPN
    jsub j2, j9, j2
    jjz j2, msg_mxd
    jldi j3, 4
    jshl j3, j9, j3
    jld j4, j1, PAN
    jadd j3, j3, j4
    jld j3, j3, 8
    jsub j4, j12, j3
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, msg_mxn
    jadd j12, j3, j1
  msg_mxn:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp msg_mx
msg_mxd:
  jldi j2, 2
  jadd j11, j12, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, CROW
  jldi j2, 0                    ; (the same lottery every time: seeded the same)
  jshi j2, 1234h
  jshi j2, 5678h
  jshi j2, 9ABCh
  jshi j2, 0DEF1h
  jst j2, j1, RNG
  jst j1, j1, TT1
  msg_line:                     ; each question of "canta"
    jldi j1, 0
    jld j9, j1, TT1
    jld j2, j1, CNN
    jsub j2, j9, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, msg_all
    jadd j10, j9, j1
    msg_le:
      jld j2, j1, CNN
      jsub j2, j10, j2
      jldi j3, 63
      jsar j2, j2, j3
      jjz j2, msg_led
      jld j2, j1, CNB
      jadd j2, j2, j10
      jldb j2, j2, 0
      jldi j3, 10
      jsub j2, j2, j3
      jjz j2, msg_led
      jldi j2, 1
      jadd j10, j10, j2
      jjmp msg_le
  msg_led:
    jst j10, j1, TT2
    jsub j2, j10, j9
    jjz j2, msg_lnext
    jadd j11, j2, j2
    jld j3, j1, MAXA
    jadd j11, j11, j3
    jldi j3, 8
    jadd j11, j11, j3
    jcall mp_cqneed
    jldi j1, 0
    jld j9, j1, TT1
    jld j10, j1, TT2
    jsub j10, j10, j9
    jld j2, j1, CNB
    jadd j9, j9, j2
    jld j11, j1, CQ
    jcall mp_span
    jldi j1, 0
    jld j2, j1, BASE            ; its turn
    jldi j3, 1
    jadd j2, j2, j3
    jstb j2, j11, 0
    jadd j11, j11, j3
    jld j2, j1, CQ
    jsub j2, j11, j2
    jst j2, j1, CQN
    jld j2, j1, GON             ; (its words, for the places it repeats)
    jjz j2, msg_lq
    jld j9, j1, TT1
    jld j10, j1, TT2
    jsub j10, j10, j9
    jld j2, j1, CNB
    jadd j9, j9, j2
    jcall mp_qwords
  msg_lq:
    jcall mp_compose
    jcall mp_ctneed
    jcall mp_text
    jldi j1, S_CANL
    jcall puts
    jld j9, j1, TT1
    msg_q:
      jld j2, j1, TT2
      jsub j2, j9, j2
      jjz j2, msg_qd
      jld j2, j1, CNB
      jadd j2, j2, j9
      jldb j2, j2, 0
      jldi j3, 13
      jsub j3, j2, j3
      jjz j3, msg_qn
      jcall putch
    msg_qn:
      jldi j2, 1
      jadd j9, j9, j2
      jjmp msg_q
  msg_qd:
    jldi j1, S_ARROW
    jcall puts
    jcall mp_puttext
    jldi j2, 10
    jcall putch
  msg_lnext:
    jldi j1, 0
    jld j2, j1, TT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT1
    jjmp msg_line
msg_all:                        ; over the pairs asked (all, or those left out)
  jldi j1, 0
  jst j1, j1, CSW
  jst j1, j1, CSR
  jst j1, j1, CSO
  jst j1, j1, CCP
  jst j1, j1, CSN
  jst j1, j1, CSWC
  jst j1, j1, CSOC
  jst j1, j1, N0
  jst j1, j1, N0C
  jst j1, j1, CRS
  jst j1, j1, CEC
  jst j1, j1, CEW
  jld j2, j1, EVS
  jst j2, j1, TT5
  jldi j1, S_CH15
  jcall puts
  msg_p:
    jldi j1, 0
    jld j2, j1, TT5
    jld j3, j1, EVE
    jsub j3, j2, j3
    jjz j3, msg_say
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, PSY
    jadd j8, j3, j4
    jld j9, j8, 0
    jld j10, j8, 8
    jsub j10, j10, j9           ; its question and its turn
    jst j9, j1, TT6
    jst j10, j1, TT7
    jld j11, j1, MAXA
    jadd j11, j11, j10
    jldi j2, 8
    jadd j11, j11, j2
    jcall mp_cqneed
    jldi j1, 0
    jld j9, j1, TT6
    jld j10, j1, TT7
    jld j2, j1, SYM
    jadd j9, j9, j2
    jld j11, j1, CQ
    jst j10, j1, CQN
    msg_cp:
      jjz j10, msg_cpd
      jldb j3, j9, 0
      jstb j3, j11, 0
      jldi j3, 1
      jadd j9, j9, j3
      jadd j11, j11, j3
      jsub j10, j10, j3
      jjmp msg_cp
  msg_cpd:
    jldi j1, 0
    jld j2, j1, GON             ; (its question's words, for the places it repeats)
    jjz j2, msg_pq
    jld j2, j1, TT5
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jcall mp_qwords
  msg_pq:
    jcall mp_compose
    jcall mp_ctneed
    jcall mp_text
    jldi j1, 0
    jld j2, j1, CQN             ; recited: its longest stretch as it is in the books read, of what it sang
    jld j3, j1, CQ0
    jsub j3, j2, j3
    jjz j3, msg_rd
    jld j2, j1, CRMAX
    jldi j4, 1000
    jmul j2, j2, j4
    jdiv j2, j2, j3
    jld j3, j1, CRS
    jadd j3, j3, j2
    jst j3, j1, CRS
  msg_rd:
    jld j2, j1, CSW
    jst j2, j1, CSWP
    jld j2, j1, CSWC
    jst j2, j1, CSWCP
    jldi j2, 2
    jst j2, j1, WMODE
    jld j2, j1, TT5
    jst j2, j1, WPR
    jld j9, j1, CT
    jld j10, j1, CTN
    jcall mp_wwalk
    jldi j1, 0                  ; the null: as many words drawn by their times, with no context
    jld j2, j1, TT5
    jldi j3, 4
    jshl j2, j2, j3
    jld j3, j1, PNUL
    jadd j8, j2, j3
    jld j2, j1, CSW
    jld j3, j1, CSWP
    jsub j2, j2, j3
    jld j3, j8, 0
    jmul j2, j2, j3
    jldi j3, 1000
    jmul j2, j2, j3
    jld j3, j1, F0
    jjz j3, msg_n1
    jdiv j2, j2, j3
    jld j3, j1, N0
    jadd j3, j3, j2
    jst j3, j1, N0
  msg_n1:
    jld j2, j1, CSWC
    jld j3, j1, CSWCP
    jsub j2, j2, j3
    jld j3, j8, 8
    jmul j2, j2, j3
    jldi j3, 1000
    jmul j2, j2, j3
    jld j3, j1, F0
    jld j4, j1, HMASS
    jsub j3, j3, j4
    jjz j3, msg_n2
    jdiv j2, j2, j3
    jld j3, j1, N0C
    jadd j3, j3, j2
    jst j3, j1, N0C
  msg_n2:
    jld j2, j1, CTN
    jjz j2, msg_pn
    jld j2, j1, TT5
    jldi j3, 4
    jshl j3, j2, j3
    jld j4, j1, PAN
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jcall mp_copy
    jldi j1, 0
    jldi j3, 1000
    jmul j2, j2, j3
    jld j3, j1, CTN
    jdiv j2, j2, j3
    jld j3, j1, CCP
    jadd j3, j3, j2
    jst j3, j1, CCP
  msg_pn:
    jld j2, j1, CSN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, CSN
    jld j2, j1, TT5
    jadd j2, j2, j3
    jst j2, j1, TT5
    jjmp msg_p
msg_say:
  jldi j2, 10
  jcall putch
  jld j2, j1, GON
  jjz j2, msg_s1
  jldi j1, S_RZ1
  jcall puts
  jld j2, j1, NSY
  jld j3, j1, BASE
  jsub j2, j2, j3
  jldi j3, 3
  jsub j2, j2, j3
  jcall putnum
  jldi j1, S_RZ2
  jcall puts
  jld j2, j1, CEC
  jcall putnum
  jldi j1, S_RZ3
  jcall puts
  jld j2, j1, CEW
  jcall putnum
  jldi j2, 10
  jcall putch
msg_s1:
  jldi j1, S_CH1
  jcall puts
  jld j2, j1, ORD               ; (the last pass counted nothing: the one before it grew from the longest rule)
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63
  jsar j3, j2, j3
  jjz j3, msg_o
  jldi j2, 0
msg_o:
  jcall putnum
  jldi j1, S_CH2
  jcall puts
  jld j2, j1, CSN
  jcall putnum
  jldi j1, S_CH3
  jcall puts
  jld j2, j1, CSW
  jcall putnum
  jldi j1, S_CH4
  jcall puts
  jld j2, j1, CSR
  jld j3, j1, CSW
  jcall mp_pct
  jcall putnum
  jldi j1, S_CH5
  jcall puts
  jld j2, j1, CSO
  jld j3, j1, CSW
  jcall mp_pct
  jcall putnum
  jldi j1, S_CH6
  jcall puts
  jld j2, j1, CCP
  jldi j3, 10
  jdiv j2, j2, j3
  jld j3, j1, CSN
  jldi j4, 100
  jmul j3, j3, j4
  jcall mp_pct
  jcall putnum
  jldi j1, S_CH7
  jcall puts
  jldi j1, S_CH8
  jcall puts
  jld j2, j1, N0
  jld j3, j1, CSW
  jldi j4, 1000
  jmul j3, j3, j4
  jcall mp_pct10
  jldi j1, S_CH9
  jcall puts
  jld j2, j1, HEADN
  jcall putnum
  jldi j1, S_CH10
  jcall puts
  jld j2, j1, CSOC
  jld j3, j1, CSWC
  jcall mp_pct10
  jldi j1, S_CH11
  jcall puts
  jld j2, j1, N0C
  jld j3, j1, CSWC
  jldi j4, 1000
  jmul j3, j3, j4
  jcall mp_pct10
  jldi j1, S_CH12
  jcall puts
  jld j2, j1, CRS
  jldi j3, 10
  jdiv j2, j2, j3
  jld j3, j1, CSN
  jldi j4, 100
  jmul j3, j3, j4
  jcall mp_pct
  jcall putnum
  jldi j1, S_CH7
  jcall puts
  jcall flush
  jldi j2, 1
  jret

; The house's file labeled by the j12 bytes at j11 -> j2 where its bytes are, j3 how many (0: not there); the pairs'
; file stays as it was. Uses j1-j14.
mp_aside:
  jldi j1, 0
  jld j2, j1, PRB
  jst j2, j1, SPB
  jld j2, j1, PRN
  jst j2, j1, SPN
  jcall mp_read
  jldi j1, 0
  jld j2, j1, PRB
  jld j3, j1, PRN
  jld j4, j1, SPB
  jst j4, j1, PRB
  jld j4, j1, SPN
  jst j4, j1, PRN
  jret

; The first two numbers of the j10 bytes at j9 -> NUM1, NUM2 (0 when not there). Uses j1-j8.
mp_nums:
  jldi j1, 0
  jst j1, j1, NUM1
  jst j1, j1, NUM2
  jldi j5, 0                    ; numbers found, the one being read, 1 while in it
  jldi j6, 0
  jldi j7, 0
  mnu_lap:
    jjz j10, mnu_end
    jldb j2, j9, 0
    jldi j3, 48
    jsub j2, j2, j3
    jldi j4, 63
    jsar j3, j2, j4
    jjnz j3, mnu_not
    jldi j3, 10
    jsub j3, j2, j3
    jsar j3, j3, j4
    jjz j3, mnu_not
    jldi j3, 10
    jmul j6, j6, j3
    jadd j6, j6, j2
    jldi j7, 1
    jjmp mnu_next
  mnu_not:
    jjz j7, mnu_next
    jcall mnu_keep
  mnu_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
    jjmp mnu_lap
mnu_end:
  jjz j7, mnu_done
  jcall mnu_keep
mnu_done:
  jret
mnu_keep:
  jldi j2, 3
  jshl j2, j5, j2
  jldi j3, 16
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, mnk_full
  jst j6, j2, NUM1
mnk_full:
  jldi j2, 1
  jadd j5, j5, j2
  jldi j6, 0
  jldi j7, 0
  jret

; j2 = 1 if pair j2 is left out (from FK to FE). Uses j1-j4.
mp_out:
  jldi j1, 0
  jld j3, j1, FK
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, mpo_no
  jld j3, j1, FE
  jsub j3, j2, j3
  jsar j3, j3, j4
  jjz j3, mpo_no
  jldi j2, 1
  jret
mpo_no:
  jldi j2, 0
  jret

; j2 * 100 / j3 -> j2 (0 when j3 is 0). Uses j1-j4.
mp_pct:
  jldi j1, 0
  jjz j3, mpp0
  jldi j4, 100
  jmul j2, j2, j4
  jdiv j2, j2, j3
  jret
mpp0:
  jldi j2, 0
  jret

; An answer's songs, from j11 (moved past them): the j10 bytes at j9 sung (mp_span); when it reasons (GON), word by
; word, and a word that is also a word of its question (pair TT5's) is sung as its place: BASE + 3 + k, k words from
; the question's end (the nearest one), so what the song learns is where the answer repeats the question, not the
; word. (A place past 255 is sung as the word: the row holds a byte a song.) Uses j1-j14.
mp_ansongs:
  jldi j1, 0
  jld j2, j1, GON
  jjnz j2, mas_on
  jjmp mp_span
mas_on:
  jst j9, j1, RG1
  jst j10, j1, RG2
  jst j11, j1, RG3
  jld j2, j1, TT5
  jldi j3, 5
  jshl j3, j2, j3
  jld j4, j1, PPR
  jadd j3, j3, j4
  jld j9, j3, 0
  jld j10, j3, 8
  jld j4, j1, PRB
  jadd j9, j9, j4
  jld j11, j1, QLB
  jcall mp_wlist
  jldi j1, 0
  jst j12, j1, QLN
  jcall mp_qlfilter
  jldi j1, 0
  jld j9, j1, RG1
  jld j10, j1, RG2
  jld j11, j1, RG3
; The same, against the question's words already in QLB (QLN): the j10 bytes at j9 from j11 on (moved past them).
mp_encode:
  jldi j1, 0
  jst j9, j1, RG1
  jst j10, j1, RG2
  jst j11, j1, RG3
  jld j11, j1, ALB
  jcall mp_wlist
  jldi j1, 0
  jst j12, j1, SYAN
  jst j1, j1, SYA
  mas_lap:
    jldi j1, 0
    jld j2, j1, SYA
    jld j3, j1, SYAN
    jsub j3, j2, j3
    jjz j3, mas_done
    jjz j2, mas_nosil
    jld j11, j1, RG3            ; a silence between two words
    jld j3, j1, BASE
    jstb j3, j11, 0
    jldi j3, 1
    jadd j11, j11, j3
    jst j11, j1, RG3
  mas_nosil:
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ALB
    jadd j8, j3, j4
    jld j5, j8, 0
    jld j6, j1, QLN
    jldi j7, 0
    mas_q:
      jsub j2, j7, j6
      jjz j2, mas_songs
      jsub j2, j6, j7
      jldi j3, 1
      jsub j2, j2, j3
      jldi j3, 24
      jmul j2, j2, j3
      jld j3, j1, QLB
      jadd j2, j2, j3
      jld j2, j2, 0
      jsub j2, j2, j5
      jjz j2, mas_echo
      jldi j3, 1
      jadd j7, j7, j3
      jjmp mas_q
  mas_echo:
    jld j2, j1, BASE
    jldi j3, 3
    jadd j2, j2, j3
    jadd j2, j2, j7
    jldi j3, 256
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, mas_songs
    jld j11, j1, RG3
    jstb j2, j11, 0
    jldi j3, 1
    jadd j11, j11, j3
    jst j11, j1, RG3
    jadd j2, j2, j3
    jld j3, j1, NSY
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, mas_next
    jst j2, j1, NSY
    jjmp mas_next
  mas_songs:
    jld j9, j8, 8
    jld j10, j8, 16
    jld j11, j1, RG3
    jcall mp_span
    jldi j1, 0
    jst j11, j1, RG3
  mas_next:
    jld j2, j1, SYA
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SYA
    jjmp mas_lap
mas_done:
  jld j11, j1, RG3
  jret

; With PLC (the seed), the question's words in QLB that are of the half go: a place is only what the question is
; about, the rest is the song's grammar. Uses j1-j14.
mp_qlfilter:
  jldi j1, 0
  jld j2, j1, PLC
  jjz j2, mqf_done
  jst j1, j1, QFI
  jst j1, j1, QFO
  mqf_lap:
    jldi j1, 0
    jld j2, j1, QFI
    jld j3, j1, QLN
    jsub j3, j2, j3
    jjz j3, mqf_end
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, QLB
    jadd j8, j3, j4
    jst j8, j1, QFP
    jld j5, j8, 0
    jldi j2, VOC
    jcall pl_find
    jldi j1, 0
    jld j3, j4, 8
    jld j2, j4, 0
    jjz j2, mqf_keep            ; (a word no book has: what it is about)
    jld j2, j1, HEADC
    jsub j3, j3, j2
    jldi j2, 63
    jsar j3, j3, j2
    jjz j3, mqf_next
  mqf_keep:
    jld j8, j1, QFP
    jld j2, j1, QFO
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, QLB
    jadd j3, j3, j4
    jld j5, j8, 0
    jst j5, j3, 0
    jld j5, j8, 8
    jst j5, j3, 8
    jld j5, j8, 16
    jst j5, j3, 16
    jldi j5, 1
    jadd j2, j2, j5
    jst j2, j1, QFO
  mqf_next:
    jld j2, j1, QFI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QFI
    jjmp mqf_lap
mqf_end:
  jld j2, j1, QFO
  jst j2, j1, QLN
mqf_done:
  jldi j1, 0
  jret

; The words of the j10 bytes at j9 into the list at j11 ({print, where, bytes} each) -> j12 how many. Uses j1-j12.
mp_wlist:
  jldi j12, 0
  mwl_lap:
    jldi j1, 0
    jjz j10, mwl_done
    jldb j3, j9, 0
    jcall mp_isletter
    jjnz j2, mwl_word
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
    jjmp mwl_lap
  mwl_word:
    jldi j8, 0
    mwl_end:
      jsub j2, j8, j10
      jjz j2, mwl_have
      jadd j2, j9, j8
      jldb j3, j2, 0
      jcall mp_isletter
      jjz j2, mwl_have
      jldi j2, 1
      jadd j8, j8, j2
      jjmp mwl_end
  mwl_have:
    jldi j2, 24
    jmul j2, j12, j2
    jadd j2, j2, j11
    jst j9, j2, 8
    jst j8, j2, 16
    jst j2, j1, RG4
    jadd j3, j9, j1
    jadd j4, j8, j1
    jcall mp_print
    jld j2, j1, RG4
    jst j5, j2, 0
    jadd j9, j9, j8
    jsub j10, j10, j8
    jldi j2, 1
    jadd j12, j12, j2
    jjmp mwl_lap
mwl_done:
  jret

; The words of the question being sung (the j10 bytes at j9) into QLB (QLN), and its longest word (QMW). Uses j1-j14.
mp_qwords:
  jldi j1, 0
  jst j9, j1, RG2
  jst j10, j1, RG3
  jldi j2, 2
  jadd j11, j10, j2
  jld j2, j1, QLC               ; (its room grows to it)
  jsub j2, j2, j11
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, mqw_room
  jst j11, j1, QLC
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, QLB
mqw_room:
  jld j9, j1, RG2
  jld j10, j1, RG3
  jld j11, j1, QLB
  jcall mp_wlist
  jldi j1, 0
  jst j12, j1, QLN
  jcall mp_qlfilter
  jldi j1, 0
  jld j12, j1, QLN
  jst j1, j1, QMW
  jldi j9, 0
  mqw_lap:
    jsub j2, j9, j12
    jjz j2, mqw_done
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, QLB
    jadd j3, j3, j4
    jld j3, j3, 16
    jld j4, j1, QMW
    jsub j4, j4, j3
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, mqw_n
    jst j3, j1, QMW
  mqw_n:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp mqw_lap
mqw_done:
  jret

; Room at CT for the text of what it sang: a byte a song, or a word of the question a place (it grows to it).
; Uses j1-j14.
mp_ctneed:
  jldi j1, 0
  jld j11, j1, CQN
  jld j2, j1, CQ0
  jsub j11, j11, j2
  jldi j2, 1
  jadd j11, j11, j2
  jld j2, j1, QMW
  jldi j3, 1
  jadd j2, j2, j3
  jmul j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jld j2, j1, CTC
  jsub j2, j2, j11
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, mct_done
  jst j11, j1, CTC
  jcall room
  jldi j1, 0
  jst j13, j1, CT
mct_done:
  jldi j1, 0
  jret

; The book's own answers as the seed (Capitan, 2026-11-08: "a real example of the book, its mechanism taken apart and
; given as a song, and then deduce a question or an answer that is missing"; "every sentence of the answer counts";
; "throw nothing away: everything works"). With "semilla" in the house, "pares" holds every building of the book in its
; order (sentido.jsm: "Q:" if it asks, "O:" if not). A question's answer is the sentences after it, up to the next
; question; its seed, the one of them that says the most words of the question not of the half (none: no seed). The
; seeds are the pairs: each answer sung with the places of its question (razona), and the song learns them. With
; "fuera" a stretch of the seeds is not read and each of its questions is asked: of every sentence of the book that says
; a word of it not of the half, the one the song expects the most (the least -lg a song) is its answer, right when it is
; one of the sentences of its answer. The ruler, from the same pass: one drawn at random (the part of those sentences
; that are of its answer), and the one that says the most of its words. j2 = 1. Uses j1-j14.
mp_seed:
  jcall ms_lines
  jcall ms_vocab
  jcall ms_seeds
  jldi j1, S_SD1
  jcall puts
  jld j2, j1, NQS
  jcall putnum
  jldi j1, S_SD2
  jcall puts
  jld j2, j1, PPN
  jcall putnum
  jldi j1, S_SD3
  jcall puts
  jld j2, j1, SENN
  jcall putnum
  jldi j2, 10
  jcall putch
  jldi j1, 0
  jst j1, j1, FK
  jst j1, j1, FE
  jst j1, j1, EVS
  jld j2, j1, PPN
  jst j2, j1, EVE
  jldi j11, S_FUERA
  jldi j12, 5
  jcall mp_aside
  jldi j1, 0
  jadd j9, j2, j1
  jadd j10, j3, j1
  jcall mp_nums
  jldi j1, 0
  jld j2, j1, NUM1              ; the k-th of n: from (k - 1) PPN / n to k PPN / n
  jld j3, j1, NUM2
  jjz j3, msd_read
  jjz j2, msd_read
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, msd_read
  jld j4, j1, PPN
  jmul j5, j2, j4
  jdiv j5, j5, j3
  jst j5, j1, FE
  jst j5, j1, EVE
  jldi j5, 1
  jsub j2, j2, j5
  jmul j5, j2, j4
  jdiv j5, j5, j3
  jst j5, j1, FK
  jst j5, j1, EVS
  jldi j1, S_CH13
  jcall puts
  jld j2, j1, FK
  jcall putnum
  jldi j1, S_CH14
  jcall puts
  jld j2, j1, FE
  jcall putnum
  jldi j2, 10
  jcall putch
msd_read:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, GON
  jst j2, j1, PLC
  jst j1, j1, QLN
  jst j1, j1, QMW
  jcall mp_syms
  jcall mp_learn
  jldi j1, 0                    ; rooms: the words of any sentence, the contexts of a song
  jld j11, j1, MAXS
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ALB
  jld j11, j1, ORD
  jldi j2, 3
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, CHN
  jst j1, j1, CQC
  jldi j11, S_MARCOS            ; (with "marcos": the frames, for the cube)
  jldi j12, 6
  jcall mp_aside
  jjz j3, msd_eval
  jcall ms_frames
msd_eval:
  jcall ms_eval
  jcall ms_say
  jcall flush
  jldi j2, 1
  jret

; The book's buildings, the "Q:" and "O:" lines of "pares" -> SEN {start, bytes, 1 if it asks}, SENN; MAXS the
; longest; rooms for a sentence's words (SWB), a question's words (QCS) and which were said (QHB). Uses j1-j14.
ms_lines:
  jldi j1, 0
  jld j11, j1, PRN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 32
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, SEN
  jst j1, j1, SENN
  jst j1, j1, MAXS
  jst j1, j1, TT1
  msl_lap:
    jldi j1, 0
    jld j9, j1, TT1
    jld j2, j1, PRN
    jsub j2, j9, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, msl_done
    jcall mp_lineat
    jldi j1, 0
    jst j10, j1, TT2
    jsub j2, j10, j9
    jldi j3, 3
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, msl_next
    jld j2, j1, PRB
    jadd j2, j2, j9
    jldb j3, j2, 1
    jldi j4, 58
    jsub j3, j3, j4
    jjnz j3, msl_next
    jldb j3, j2, 0
    jldi j5, 0
    jldi j4, 81
    jsub j4, j3, j4
    jjz j4, msl_q
    jldi j4, 79
    jsub j4, j3, j4
    jjnz j4, msl_next
    jjmp msl_keep
  msl_q:
    jldi j5, 1
  msl_keep:
    jld j2, j1, SENN
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, SEN
    jadd j3, j3, j4
    jldi j4, 3
    jadd j4, j9, j4
    jst j4, j3, 0
    jsub j6, j10, j4
    jst j6, j3, 8
    jst j5, j3, 16
    jld j7, j1, MAXS
    jsub j7, j7, j6
    jldi j8, 63
    jsar j7, j7, j8
    jjz j7, msl_cnt
    jst j6, j1, MAXS
  msl_cnt:
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SENN
  msl_next:
    jldi j1, 0
    jld j2, j1, TT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT1
    jjmp msl_lap
msl_done:
  jld j11, j1, MAXS
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, SWB
  jld j11, j1, MAXS
  jldi j2, 2
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, QCS
  jld j11, j1, MAXS
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, QHB
  jld j11, j1, SENN
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 5
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, SDQ
  jret

; The book's words, every sentence's (VOC, F0), and the half (mp_head). Uses j1-j14.
ms_vocab:
  jldi j2, VOC
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, F0
  jst j1, j1, WMODE
  jst j1, j1, TT5
  msv_lap:
    jldi j1, 0
    jld j2, j1, TT5
    jld j3, j1, SENN
    jsub j3, j2, j3
    jjz j3, msv_done
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, SEN
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jcall mp_wwalk
    jldi j1, 0
    jld j2, j1, TT5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT5
    jjmp msv_lap
msv_done:
  jjmp mp_head

; The words of the j10 bytes at j9 not of the half, each once -> QCS (prints), QCN. Uses j1-j14.
ms_qset:
  jldi j1, 0
  jld j11, j1, SWB
  jcall mp_wlist
  jldi j1, 0
  jst j12, j1, QJ
  jst j1, j1, QCN
  jst j1, j1, QI
  mqs_lap:
    jldi j1, 0
    jld j2, j1, QI
    jld j3, j1, QJ
    jsub j3, j2, j3
    jjz j3, mqs_done
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, SWB
    jadd j3, j3, j4
    jld j5, j3, 0
    jst j5, j1, QK
    jldi j2, VOC
    jcall pl_find
    jldi j1, 0
    jld j3, j4, 8
    jld j2, j1, HEADC
    jsub j3, j3, j2
    jldi j2, 63
    jsar j3, j3, j2
    jjz j3, mqs_next
    jld j5, j1, QK
    jld j6, j1, QCN
    jld j7, j1, QCS
    mqs_d:
      jjz j6, mqs_add
      jld j8, j7, 0
      jsub j8, j8, j5
      jjz j8, mqs_next
      jldi j8, 8
      jadd j7, j7, j8
      jldi j8, 1
      jsub j6, j6, j8
      jjmp mqs_d
  mqs_add:
    jst j5, j7, 0
    jld j6, j1, QCN
    jldi j8, 1
    jadd j6, j6, j8
    jst j6, j1, QCN
  mqs_next:
    jld j2, j1, QI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QI
    jjmp mqs_lap
mqs_done:
  jret

; How many of the question's words (QCS) the j10 bytes at j9 say, each once -> j2. Uses j1-j12.
ms_overlap:
  jldi j1, 0
  jld j11, j1, SWB
  jcall mp_wlist
  jldi j1, 0
  jld j2, j1, QCN
  jld j3, j1, QHB
  mov_z:
    jjz j2, mov_zd
    jstb j1, j3, 0
    jldi j4, 1
    jadd j3, j3, j4
    jsub j2, j2, j4
    jjmp mov_z
mov_zd:
  jldi j9, 0
  jldi j8, 0
  mov_lap:
    jsub j2, j9, j12
    jjz j2, mov_done
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, SWB
    jadd j3, j3, j4
    jld j5, j3, 0
    jld j6, j1, QCN
    jld j7, j1, QCS
    jldi j10, 0
    mov_f:
      jsub j2, j10, j6
      jjz j2, mov_next
      jld j2, j7, 0
      jsub j2, j2, j5
      jjz j2, mov_hit
      jldi j2, 8
      jadd j7, j7, j2
      jldi j2, 1
      jadd j10, j10, j2
      jjmp mov_f
    mov_hit:
      jld j2, j1, QHB
      jadd j2, j2, j10
      jldb j3, j2, 0
      jjnz j3, mov_next
      jldi j3, 1
      jstb j3, j2, 0
      jadd j8, j8, j3
    mov_next:
      jldi j2, 1
      jadd j9, j9, j2
      jjmp mov_lap
mov_done:
  jadd j2, j8, j1
  jret

; The seeds: each question of the book, its answer (the sentences up to the next question) and of them the one that
; says the most of its words (the first of equals) -> the pairs (PPR its question, PAN that sentence; PPN), and by
; seed SDQ {the question, its answer's first sentence, one past its last, the seed}. Uses j1-j14.
ms_seeds:
  jldi j1, 0
  jst j1, j1, PPN
  jst j1, j1, NQS
  jst j1, j1, SA
  mse_lap:
    jldi j1, 0
    jld j2, j1, SA
    jld j3, j1, SENN
    jsub j3, j2, j3
    jjz j3, mse_done
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, SEN
    jadd j8, j3, j4
    jld j3, j8, 16
    jjz j3, mse_next
    jld j3, j1, NQS
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, NQS
    jld j9, j8, 0
    jld j10, j8, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jcall ms_qset
    jldi j1, 0
    jld j2, j1, SA
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SB
    jst j1, j1, SBV
    jldi j2, -1
    jst j2, j1, SBB
    mse_r:
      jldi j1, 0
      jld j2, j1, SB
      jld j3, j1, SENN
      jsub j3, j2, j3
      jjz j3, mse_rd
      jldi j3, 24
      jmul j3, j2, j3
      jld j4, j1, SEN
      jadd j8, j3, j4
      jld j3, j8, 16
      jjnz j3, mse_rd
      jld j9, j8, 0
      jld j10, j8, 8
      jld j4, j1, PRB
      jadd j9, j9, j4
      jcall ms_overlap
      jldi j1, 0
      jld j3, j1, SBV
      jsub j3, j3, j2
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, mse_rn
      jst j2, j1, SBV
      jld j2, j1, SB
      jst j2, j1, SBB
    mse_rn:
      jld j2, j1, SB
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, SB
      jjmp mse_r
  mse_rd:
    jld j2, j1, SBB
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, mse_next           ; (none of its answer says a word of it: no seed)
    jld j2, j1, PPN
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j3, j3, j4
    jld j5, j1, SA
    jldi j6, 24
    jmul j5, j5, j6
    jld j6, j1, SEN
    jadd j5, j5, j6
    jld j6, j5, 0
    jst j6, j3, 0
    jld j6, j5, 8
    jst j6, j3, 8
    jldi j3, 4
    jshl j3, j2, j3
    jld j4, j1, PAN
    jadd j3, j3, j4
    jld j5, j1, SBB
    jldi j6, 24
    jmul j5, j5, j6
    jld j6, j1, SEN
    jadd j5, j5, j6
    jld j6, j5, 0
    jst j6, j3, 0
    jld j6, j5, 8
    jst j6, j3, 8
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, SDQ
    jadd j3, j3, j4
    jld j5, j1, SA
    jst j5, j3, 0
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j3, 8
    jld j5, j1, SB
    jst j5, j3, 16
    jld j5, j1, SBB
    jst j5, j3, 24
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, PPN
  mse_next:
    jldi j1, 0
    jld j2, j1, SA
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SA
    jjmp mse_lap
mse_done:
  jldi j1, 0
  jret

; j2 = 1 if sentence j2 is of the answer of seed SEV (0 for -1). Uses j1-j5.
ms_isreg:
  jldi j1, 0
  jld j3, j1, SEV
  jldi j4, 5
  jshl j3, j3, j4
  jld j4, j1, SDQ
  jadd j3, j3, j4
  jld j4, j3, 8
  jsub j4, j2, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, msr_no
  jld j4, j3, 16
  jsub j4, j2, j4
  jsar j4, j4, j5
  jjz j4, msr_no
  jldi j2, 1
  jret
msr_no:
  jldi j2, 0
  jret

; Each seed asked (all, or those left out): its answer looked for among every sentence of the book that says a word
; of it; judged by the song and by the ruler. Uses j1-j14.
ms_eval:
  jldi j1, 0
  jst j1, j1, HSG
  jst j1, j1, HOV
  jst j1, j1, HRN
  jst j1, j1, NEV
  jst j1, j1, NCAND
  jld j2, j1, EVS
  jst j2, j1, SEV
  mev_lap:
    jldi j1, 0
    jld j2, j1, SEV
    jld j3, j1, EVE
    jsub j3, j2, j3
    jjz j3, mev_done
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jst j9, j1, QP
    jst j10, j1, QPN
    jcall ms_qset
    jldi j1, 0
    jld j9, j1, QP
    jld j10, j1, QPN
    jcall mp_qwords
    jldi j1, 0                  ; the question sung, and its turn
    jld j2, j1, SEV
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, PSY
    jadd j8, j3, j4
    jld j9, j8, 0
    jld j10, j8, 8
    jsub j10, j10, j9
    jst j9, j1, SA
    jst j10, j1, SL0
    jld j11, j1, MAXS
    jldi j2, 3
    jmul j11, j11, j2
    jadd j11, j11, j10
    jldi j2, 16
    jadd j11, j11, j2
    jcall mp_cqneed
    jldi j1, 0
    jld j9, j1, SA
    jld j2, j1, SYM
    jadd j9, j9, j2
    jld j10, j1, SL0
    jld j11, j1, CQ
    mev_cp:
      jjz j10, mev_cpd
      jldb j3, j9, 0
      jstb j3, j11, 0
      jldi j3, 1
      jadd j9, j9, j3
      jadd j11, j11, j3
      jsub j10, j10, j3
      jjmp mev_cp
  mev_cpd:
    jldi j2, -1
    jst j2, j1, SBEST
    jst j2, j1, OBEST
    jldi j2, 1
    jldi j3, 60
    jshl j2, j2, j3
    jst j2, j1, SBS
    jst j1, j1, OBS
    jst j1, j1, SCC
    jst j1, j1, SCN
    jst j1, j1, SJJ
    mev_c:
      jldi j1, 0
      jld j2, j1, SJJ
      jld j3, j1, SENN
      jsub j3, j2, j3
      jjz j3, mev_judge
      jldi j3, 24
      jmul j3, j2, j3
      jld j4, j1, SEN
      jadd j8, j3, j4
      jld j3, j8, 16
      jjnz j3, mev_cn             ; (a question answers nothing)
      jld j9, j8, 0
      jld j10, j8, 8
      jld j4, j1, PRB
      jadd j9, j9, j4
      jst j9, j1, SK
      jst j10, j1, SB
      jcall ms_overlap
      jldi j1, 0
      jjz j2, mev_cn
      jst j2, j1, SBV
      jld j3, j1, SCN
      jldi j4, 1
      jadd j3, j3, j4
      jst j3, j1, SCN
      jld j2, j1, SJJ
      jcall ms_isreg
      jldi j1, 0
      jld j3, j1, SCC
      jadd j3, j3, j2
      jst j3, j1, SCC
      jld j2, j1, SBV
      jld j3, j1, OBS
      jsub j3, j3, j2
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, mev_song
      jst j2, j1, OBS
      jld j2, j1, SJJ
      jst j2, j1, OBEST
    mev_song:                   ; what the question gives it: its cost sung as plain words, less sung with the places
      jld j2, j1, QLN           ; of the question (a sentence read as it is costs little both ways: it gains nothing)
      jst j2, j1, SQL
      jst j1, j1, QLN
      jcall ms_cost
      jldi j1, 0
      jst j2, j1, SPL
      jld j2, j1, SQL
      jst j2, j1, QLN
      jcall ms_cost
      jldi j1, 0
      jld j3, j1, SPL
      jsub j2, j2, j3           ; (less is better: the places' cost minus the plain one)
      jld j3, j1, SBS
      jsub j3, j2, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, mev_cn
      jst j2, j1, SBS
      jld j2, j1, SJJ
      jst j2, j1, SBEST
    mev_cn:
      jldi j1, 0
      jld j2, j1, SJJ
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, SJJ
      jjmp mev_c
  mev_judge:
    jld j2, j1, NEV
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, NEV
    jld j2, j1, NCAND
    jld j3, j1, SCN
    jadd j2, j2, j3
    jst j2, j1, NCAND
    jjz j3, mev_say
    jld j2, j1, SCC
    jldi j4, 1000
    jmul j2, j2, j4
    jdiv j2, j2, j3
    jld j3, j1, HRN
    jadd j3, j3, j2
    jst j3, j1, HRN
    jld j2, j1, SBEST
    jcall ms_isreg
    jldi j1, 0
    jld j3, j1, HSG
    jadd j3, j3, j2
    jst j3, j1, HSG
    jld j2, j1, OBEST
    jcall ms_isreg
    jldi j1, 0
    jld j3, j1, HOV
    jadd j3, j3, j2
    jst j3, j1, HOV
  mev_say:
    jldi j1, S_SD9
    jcall puts
    jld j9, j1, QP
    jld j10, j1, QPN
    jcall ms_putspan
    jldi j1, S_SD10
    jcall puts
    jld j2, j1, SBEST
    jcall ms_putsen
    jldi j1, S_SD11
    jcall puts
    jld j2, j1, OBEST
    jcall ms_putsen
    jldi j2, 10
    jcall putch
    jldi j1, 0
    jld j2, j1, SEV
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SEV
    jjmp mev_lap
mev_done:
  jldi j1, 0
  jret

; What the seeds found, said. Uses j1-j14.
ms_say:
  jldi j1, S_SD4
  jcall puts
  jld j2, j1, NEV
  jcall putnum
  jldi j1, S_SD5
  jcall puts
  jld j2, j1, NCAND
  jld j3, j1, NEV
  jjz j3, mss0
  jdiv j2, j2, j3
mss0:
  jcall putnum
  jldi j1, S_SD6
  jcall puts
  jld j2, j1, HSG
  jld j3, j1, NEV
  jcall mp_pct10
  jldi j1, S_SD7
  jcall puts
  jld j2, j1, HOV
  jld j3, j1, NEV
  jcall mp_pct10
  jldi j1, S_SD8
  jcall puts
  jld j2, j1, HRN
  jld j3, j1, NEV
  jldi j4, 1000
  jmul j3, j3, j4
  jcall mp_pct10
  jldi j1, S_CH7
  jcall puts
  jret

; Sentence j2 said (-1: "-"). Uses j1-j14.
ms_putsen:
  jldi j1, 0
  jldi j3, 63
  jsar j3, j2, j3
  jjz j3, mps_s
  jldi j2, 45
  jjmp putch
mps_s:
  jldi j3, 24
  jmul j3, j2, j3
  jld j4, j1, SEN
  jadd j3, j3, j4
  jld j9, j3, 0
  jld j10, j3, 8
  jld j4, j1, PRB
  jadd j9, j9, j4
; The j10 bytes at j9 said (no line ends). Uses j1-j3, j9, j10.
ms_putspan:
  mpsp_lap:
    jjz j10, mpsp_done
    jldb j2, j9, 0
    jldi j3, 13
    jsub j3, j2, j3
    jjz j3, mpsp_n
    jcall putch
  mpsp_n:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
    jjmp mpsp_lap
mpsp_done:
  jldi j1, 0
  jret

; The frames, when the house has "marcos" (for voluntad_semilla.jsm, the cube's practice): for every seed and every
; sentence that says a word of its question, a line "M: seed sentence answers read t1 t2 t3 t4 t5" (answers: 1 if
; the sentence is of its answer; read: 1 if the seed is read, 0 if left out): the five words around the first place of
; what the question is about in it, as the song's tokens. 0 is past the sentence, 1 a word the question is not about
; and not of the half; the rest numbered by first sight: a place k words from the question's end, or a word of the
; half itself. Uses j1-j14.
ms_frames:
  jldi j2, TOK
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jldi j2, 2
  jst j2, j1, TOKN
  jst j1, j1, FSE
  mfr_lap:
    jldi j1, 0
    jld j2, j1, FSE
    jld j3, j1, PPN
    jsub j3, j2, j3
    jjz j3, mfr_done
    jcall mp_out
    jldi j1, 0
    jldi j3, 1
    jsub j2, j3, j2
    jst j2, j1, FTR
    jld j2, j1, FSE
    jst j2, j1, SEV
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jst j9, j1, QP
    jst j10, j1, QPN
    jcall ms_qset
    jldi j1, 0
    jld j9, j1, QP
    jld j10, j1, QPN
    jcall mp_qwords
    jldi j1, 0
    jst j1, j1, FSJ
    mfr_s:
      jldi j1, 0
      jld j2, j1, FSJ
      jld j3, j1, SENN
      jsub j3, j2, j3
      jjz j3, mfr_next
      jldi j3, 24
      jmul j3, j2, j3
      jld j4, j1, SEN
      jadd j8, j3, j4
      jld j3, j8, 16
      jjnz j3, mfr_sn
      jld j9, j8, 0
      jld j10, j8, 8
      jld j4, j1, PRB
      jadd j9, j9, j4
      jst j9, j1, SK
      jst j10, j1, SB
      jcall ms_overlap
      jldi j1, 0
      jjz j2, mfr_sn
      jld j2, j1, FSJ
      jcall ms_isreg
      jldi j1, 0
      jst j2, j1, FLAB
      jld j9, j1, SK              ; its words again (SWB), and its first place
      jld j10, j1, SB
      jld j11, j1, SWB
      jcall mp_wlist
      jldi j1, 0
      jst j12, j1, FWN
      jldi j2, -1
      jst j2, j1, FFP
      jst j1, j1, FFI
      mfr_f:
        jldi j1, 0
        jld j2, j1, FFI
        jld j3, j1, FWN
        jsub j3, j2, j3
        jjz j3, mfr_fd
        jcall mf_place
        jldi j1, 0
        jjnz j3, mfr_fhit
        jld j2, j1, FFI
        jldi j3, 1
        jadd j2, j2, j3
        jst j2, j1, FFI
        jjmp mfr_f
      mfr_fhit:
        jld j2, j1, FFI
        jst j2, j1, FFP
    mfr_fd:
      jld j2, j1, FFP
      jldi j3, 63
      jsar j3, j2, j3
      jjnz j3, mfr_sn             ; (no place in it: no frame)
      jldi j1, S_MK
      jcall puts
      jld j2, j1, FSE
      jcall putnum
      jldi j2, 32
      jcall putch
      jldi j1, 0
      jld j2, j1, FSJ
      jcall putnum
      jldi j2, 32
      jcall putch
      jldi j1, 0
      jld j2, j1, FLAB
      jcall putnum
      jldi j2, 32
      jcall putch
      jldi j1, 0
      jld j2, j1, FTR
      jcall putnum
      jldi j1, 0
      jld j2, j1, FFP
      jldi j3, 2
      jsub j2, j2, j3
      jst j2, j1, FFI
      mfr_t:
        jldi j2, 32
        jcall putch
        jldi j1, 0
        jld j2, j1, FFI
        jcall mf_token
        jcall putnum
        jldi j1, 0
        jld j2, j1, FFI
        jldi j3, 1
        jadd j2, j2, j3
        jst j2, j1, FFI
        jld j3, j1, FFP
        jldi j4, 3
        jadd j3, j3, j4
        jsub j3, j2, j3
        jjnz j3, mfr_t
      jldi j2, 10
      jcall putch
    mfr_sn:
      jldi j1, 0
      jld j2, j1, FSJ
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, FSJ
      jjmp mfr_s
  mfr_next:
    jldi j1, 0
    jld j2, j1, FSE
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FSE
    jjmp mfr_lap
mfr_done:
  jcall flush
  jldi j1, 0
  jret

; Word j2 of the sentence in SWB a place of the question (QLB)? -> j3 = 1 and j4 = its k (words from the question's
; end), else j3 = 0; j5 its print. Uses j1-j8.
mf_place:
  jldi j1, 0
  jldi j3, 24
  jmul j3, j2, j3
  jld j4, j1, SWB
  jadd j3, j3, j4
  jld j5, j3, 0
  jld j6, j1, QLN
  jldi j7, 0
  mfp_lap:
    jsub j3, j7, j6
    jjz j3, mfp_no
    jsub j3, j6, j7
    jldi j4, 1
    jsub j3, j3, j4
    jldi j4, 24
    jmul j3, j3, j4
    jld j4, j1, QLB
    jadd j3, j3, j4
    jld j3, j3, 0
    jsub j3, j3, j5
    jjz j3, mfp_yes
    jldi j3, 1
    jadd j7, j7, j3
    jjmp mfp_lap
mfp_yes:
  jldi j3, 1
  jadd j4, j7, j1
  jret
mfp_no:
  jldi j3, 0
  jret

; The token of word j2 of the sentence in SWB (FWN words) -> j2: 0 past it, 1 a word the question is not about and not
; of the half, else a place's or a word of the half's number (TOK, by first sight). Uses j1-j8.
mf_token:
  jldi j1, 0
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, mft0
  jld j3, j1, FWN
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, mft0
  jcall mf_place
  jldi j1, 0
  jjz j3, mft_word
  jldi j5, 3                    ; a place: its key 3 + k
  jadd j5, j5, j4
  jjmp mft_key
mft_word:
  jst j5, j1, FTR + 8           ; (its print kept)
  jldi j2, VOC
  jcall pl_find
  jldi j1, 0
  jld j3, j4, 8
  jld j2, j1, HEADC
  jsub j3, j3, j2
  jldi j2, 63
  jsar j3, j3, j2
  jjnz j3, mft1                 ; not of the half: a word the question is not about
  jld j5, j1, FTR + 8
mft_key:
  jldi j2, TOK
  jcall pl_take
  jldi j1, 0
  jjz j6, mft_old
  jld j2, j1, TOKN
  jst j2, j4, 8
  jldi j3, 1
  jadd j3, j2, j3
  jst j3, j1, TOKN
  jret
mft_old:
  jld j2, j4, 8
  jret
mft0:
  jldi j2, 0
  jret
mft1:
  jldi j2, 1
  jret

; Candidate sentence SK, SB bytes, sung after the question (CQ to SL0) against QLB -> j2 its cost (ms_fit).
; Uses j1-j14.
ms_cost:
  jldi j1, 0
  jld j9, j1, SK
  jld j10, j1, SB
  jld j11, j1, CQ
  jld j2, j1, SL0
  jadd j11, j11, j2
  jcall mp_encode
  jldi j1, 0
  jld j2, j1, CQ
  jsub j2, j11, j2
  jst j2, j1, CQN
  jjmp ms_fit

; How well what follows SL0 in CQ fits the song: each song by the longest context said by two pairs or more that saw
; it after (or a shorter one; none: by one more than the empty context saw in all), its cost lg(all) - lg(times), in
; 1/256ths; the average -> j2. Uses j1-j14.
ms_fit:
  jldi j1, 0
  jst j1, j1, SSC
  jld j2, j1, SL0
  jst j2, j1, SPOS
  mft_lap:
    jldi j1, 0
    jld j9, j1, SPOS
    jld j2, j1, CQN
    jsub j2, j9, j2
    jjz j2, mft_done
    jld j5, j1, CS0
    jld j12, j1, CHN
    jst j5, j12, 0
    jldi j10, 1
    mft_c:
      jldi j1, 0
      jsub j3, j9, j10
      jldi j4, 63
      jsar j4, j3, j4
      jjnz j4, mft_have
      jld j4, j1, CQ
      jadd j3, j3, j4
      jldb j7, j3, 0
      jcall mp_mix
      jldi j2, CXT
      jcall pl_find
      jld j2, j4, 16
      jldi j3, 2
      jsub j2, j2, j3
      jldi j3, 63
      jsar j2, j2, j3
      jjnz j2, mft_have
      jldi j3, 3
      jshl j3, j10, j3
      jadd j3, j3, j12
      jst j5, j3, 0
      jldi j2, 1
      jadd j10, j10, j2
      jjmp mft_c
  mft_have:
    jldi j1, 0
    jld j2, j1, CQ
    jadd j2, j2, j9
    jldb j11, j2, 0
    jldi j2, 1
    jsub j10, j10, j2
    mft_b:
      jldi j1, 0
      jldi j3, 3
      jshl j3, j10, j3
      jadd j3, j3, j12
      jld j5, j3, 0
      jst j5, j1, SCTX
      jadd j7, j11, j1
      jcall mp_mix
      jldi j2, NXT
      jcall pl_find
      jldi j1, 0
      jld j13, j4, 8
      jjnz j13, mft_cost
      jjz j10, mft_none
      jldi j2, 1
      jsub j10, j10, j2
      jjmp mft_b
  mft_none:
    jld j5, j1, CS0
    jldi j2, CXT
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 24
    jldi j3, 1
    jadd j2, j2, j3
    jcall mp_lg
    jjmp mft_add
  mft_cost:
    jld j5, j1, SCTX
    jldi j2, CXT
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 24
    jcall mp_lg
    jst j2, j1, SLGT
    jadd j2, j13, j1
    jcall mp_lg
    jld j3, j1, SLGT
    jsub j2, j3, j2
  mft_add:
    jld j3, j1, SSC
    jadd j3, j3, j2
    jst j3, j1, SSC
    jld j2, j1, SPOS
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SPOS
    jjmp mft_lap
mft_done:
  jld j2, j1, SSC
  jld j3, j1, CQN
  jld j4, j1, SL0
  jsub j3, j3, j4
  jjz j3, mft_z
  jdiv j2, j2, j3
  jret
mft_z:
  jldi j2, 0
  jret

; lg2 of j2 (1 or more), in 1/256ths: the place of its top bit, and a straight line to the next power of two. Uses
; j2-j5.
mp_lg:
  jldi j3, 0
  jadd j4, j2, j3
  mlg_l:
    jldi j5, 1
    jshr j4, j4, j5
    jjz j4, mlg_d
    jadd j3, j3, j5
    jjmp mlg_l
mlg_d:
  jldi j4, 8
  jshl j2, j2, j4
  jshr j2, j2, j3
  jldi j4, 256
  jsub j2, j2, j4
  jldi j4, 8
  jshl j3, j3, j4
  jadd j2, j2, j3
  jret

; j2 * 100 / j3 with one decimal, out (0 when j3 is 0). Uses j1-j4.
mp_pct10:
  jldi j1, 0
  jjz j3, mpt10_0
  jldi j4, 1000
  jmul j2, j2, j4
  jdiv j2, j2, j3
  jjmp mpt10_out
mpt10_0:
  jldi j2, 0
mpt10_out:
  jldi j3, 10
  jdiv j4, j2, j3
  jmul j3, j4, j3
  jsub j3, j2, j3
  jst j3, j1, WTIM
  jadd j2, j4, j1
  jcall putnum
  jldi j2, 46
  jcall putch
  jldi j1, 0
  jld j2, j1, WTIM
  jjmp putnum

; What it sang (CT, CTN), out. Uses j1-j3, j9.
mp_puttext:
  jldi j9, 0
  mpu_lap:
    jldi j1, 0
    jld j2, j1, CTN
    jsub j2, j9, j2
    jjz j2, mpu_done
    jld j2, j1, CT
    jadd j2, j2, j9
    jldb j2, j2, 0
    jcall putch
    jldi j2, 1
    jadd j9, j9, j2
    jjmp mpu_lap
mpu_done:
  jldi j1, 0
  jret

; Room at CQ for j11 songs (it doubles to hold them; what it held is not kept). Uses j1-j14.
mp_cqneed:
  jldi j1, 0
  jld j2, j1, CQC
  jsub j2, j2, j11
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, mcq_done
  jld j2, j1, CQC
  jadd j2, j2, j2
  jsub j3, j2, j11
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, mcq_dbl
  jadd j2, j11, j1
mcq_dbl:
  jst j2, j1, CQC
  jadd j11, j2, j1
  jcall room
  jldi j1, 0
  jst j13, j1, CQ
mcq_done:
  jldi j1, 0
  jret

; The j10 bytes at j9 as songs, from j11 on (j11 moved past them): a letter its two pieces (its number in the base), a
; run of no letters between two letters one silence (BASE). Uses j1-j13.
mp_span:
  jldi j1, 0
  jldi j12, 0                   ; a letter sung already
  jldi j13, 0                   ; a silence owed
  msp_lap:
    jjz j10, msp_done
    jldb j3, j9, 0
    jldi j4, 3
    jshl j4, j3, j4
    jld j5, j1, ALF
    jadd j4, j4, j5
    jld j4, j4, 0
    jjnz j4, msp_letter
    jadd j13, j12, j1           ; (owed only after a letter)
    jjmp msp_next
  msp_letter:
    jjz j13, msp_songs
    jld j5, j1, BASE
    jstb j5, j11, 0
    jldi j5, 1
    jadd j11, j11, j5
    jldi j13, 0
  msp_songs:
    jldi j5, 1
    jsub j4, j4, j5
    jld j5, j1, BASE
    jdiv j6, j4, j5
    jmul j7, j6, j5
    jsub j7, j4, j7
    jstb j6, j11, 0
    jstb j7, j11, 1
    jldi j5, 2
    jadd j11, j11, j5
    jldi j12, 1
  msp_next:
    jldi j5, 1
    jadd j9, j9, j5
    jsub j10, j10, j5
    jjmp msp_lap
msp_done:
  jret

; Song j7 after the print j5 -> j5 (FNV-1a's step; never 0). Uses j5-j7.
mp_mix:
  jldi j6, 1
  jadd j7, j7, j6
  jxor j5, j5, j7
  jldi j6, 0
  jshi j6, 100h
  jshi j6, 0
  jshi j6, 1B3h
  jmul j5, j5, j6
  jjnz j5, mpm_out
  jldi j5, 1
mpm_out:
  jret

; Every pair as songs, one after another (SYM, SYN; by pair PSY): its question, a turn (BASE + 1), its answer, an end
; (BASE + 2); and the longest answer (MAXA). Uses j1-j14.
mp_syms:
  jldi j1, 0
  jld j2, j1, BASE
  jldi j3, 3
  jadd j2, j2, j3
  jst j2, j1, NSY
  jldi j9, 0                    ; the lists of a question's and an answer's words: as long as the longest
  jldi j12, 0
  msy_mx:
    jld j2, j1, PPN
    jsub j2, j9, j2
    jjz j2, msy_mxd
    jldi j3, 5
    jshl j3, j9, j3
    jld j4, j1, PPR
    jadd j3, j3, j4
    jld j3, j3, 8
    jsub j4, j12, j3
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, msy_a
    jadd j12, j3, j1
  msy_a:
    jldi j3, 4
    jshl j3, j9, j3
    jld j4, j1, PAN
    jadd j3, j3, j4
    jld j3, j3, 8
    jsub j4, j12, j3
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, msy_n
    jadd j12, j3, j1
  msy_n:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp msy_mx
msy_mxd:
  jldi j2, 2
  jadd j11, j12, j2
  jst j11, j1, QLC
  jldi j2, 24
  jmul j11, j11, j2
  jst j11, j1, RG1
  jcall room
  jldi j1, 0
  jst j13, j1, QLB
  jld j11, j1, RG1
  jcall room
  jldi j1, 0
  jst j13, j1, ALB
  jld j11, j1, PRN
  jadd j11, j11, j11
  jld j2, j1, PPN
  jldi j3, 2
  jshl j2, j2, j3
  jadd j11, j11, j2
  jldi j2, 64
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, SYM
  jst j1, j1, SYN
  jld j11, j1, PPN
  jldi j2, 24
  jmul j11, j11, j2
  jldi j2, 24
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PSY
  jst j1, j1, MAXA
  jst j1, j1, TT5
  mss_lap:
    jldi j1, 0
    jld j2, j1, TT5
    jld j3, j1, PPN
    jsub j3, j2, j3
    jjz j3, mss_done
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, PSY
    jadd j8, j3, j4
    jld j5, j1, SYN
    jst j5, j8, 0
    jst j8, j1, TT6
    jldi j3, 5                  ; its question
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jld j11, j1, SYM
    jld j4, j1, SYN
    jadd j11, j11, j4
    jcall mp_span
    jldi j1, 0
    jld j4, j1, BASE            ; its turn
    jldi j5, 1
    jadd j4, j4, j5
    jstb j4, j11, 0
    jadd j11, j11, j5
    jld j2, j1, SYM
    jsub j3, j11, j2
    jst j3, j1, SYN
    jld j8, j1, TT6
    jst j3, j8, 8
    jld j2, j1, TT5             ; its answer
    jldi j3, 4
    jshl j3, j2, j3
    jld j4, j1, PAN
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jcall mp_ansongs
    jldi j1, 0
    jld j4, j1, BASE            ; its end
    jldi j5, 2
    jadd j4, j4, j5
    jstb j4, j11, 0
    jldi j5, 1
    jadd j11, j11, j5
    jld j2, j1, SYM
    jsub j3, j11, j2
    jst j3, j1, SYN
    jld j8, j1, TT6
    jst j3, j8, 16
    jld j4, j8, 8
    jsub j4, j3, j4
    jld j5, j1, MAXA
    jsub j5, j5, j4
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, mss_next
    jst j4, j1, MAXA
  mss_next:
    jld j2, j1, TT5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT5
    jjmp mss_lap
mss_done:
  jldi j1, 0
  jret

; What follows each context, counted (CXT, NXT): first the empty one, then each one a song longer, but only where the
; shorter one is said by two pairs or more; until no longer one is counted. Uses j1-j14.
mp_learn:
  jldi j1, 0
  jldi j5, 0
  jshi j5, 0CBF2h
  jshi j5, 9CE4h
  jshi j5, 8422h
  jshi j5, 2325h
  jst j5, j1, CS0
  jld j11, j1, SYN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HPX
  jld j2, j1, SYN               ; every place starts at the empty context
  jld j3, j1, CS0
  mle_f:
    jjz j2, mle_fd
    jldi j4, 1
    jsub j2, j2, j4
    jldi j4, 3
    jshl j4, j2, j4
    jadd j4, j4, j13
    jst j3, j4, 0
    jjmp mle_f
mle_fd:
  jldi j2, CXT
  jldi j3, 32
  jcall pl_new
  jldi j2, NXT
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, ORD
  mle_pass:
    jldi j1, 0
    jst j1, j1, ALIVE
    jldi j9, 0
    mle_pair:
      jldi j1, 0
      jld j2, j1, PPN
      jsub j2, j9, j2
      jjz j2, mle_pdone
      jadd j2, j9, j1           ; (the pairs left out are not read)
      jcall mp_out
      jjnz j2, mle_pnext
      jldi j1, 0
      jldi j3, 24
      jmul j3, j9, j3
      jld j4, j1, PSY
      jadd j3, j3, j4
      jld j10, j3, 0
      jld j11, j3, 16
      jld j2, j1, ORD
      jadd j10, j10, j2         ; (the first place with a context this long)
      mle_at:
        jldi j1, 0
        jsub j2, j10, j11
        jldi j3, 63
        jsar j2, j2, j3
        jjz j2, mle_pnext
        jldi j3, 3
        jshl j3, j10, j3
        jld j4, j1, HPX
        jadd j12, j3, j4
        jld j5, j12, 0
        jjz j5, mle_next
        jld j2, j1, ORD
        jjz j2, mle_count
        jldi j2, CXT            ; one longer only where the shorter is said by two pairs or more
        jcall pl_find
        jld j2, j4, 16
        jldi j3, 2
        jsub j2, j2, j3
        jldi j3, 63
        jsar j2, j2, j3
        jjz j2, mle_grow
        jldi j1, 0
        jst j1, j12, 0
        jjmp mle_next
      mle_grow:
        jldi j1, 0
        jld j5, j12, 0
        jld j2, j1, ORD
        jsub j2, j10, j2
        jld j3, j1, SYM
        jadd j2, j2, j3
        jldb j7, j2, 0
        jcall mp_mix
        jst j5, j12, 0
      mle_count:
        jldi j1, 0
        jld j5, j12, 0
        jldi j2, CXT
        jcall pl_take
        jldi j1, 0
        jldi j2, 1
        jadd j2, j9, j2
        jld j3, j4, 8
        jsub j3, j3, j2
        jjz j3, mle_same
        jst j2, j4, 8
        jld j3, j4, 16
        jldi j2, 1
        jadd j3, j3, j2
        jst j3, j4, 16
      mle_same:
        jld j3, j4, 24          ; (all the times after it)
        jldi j2, 1
        jadd j3, j3, j2
        jst j3, j4, 24
        jld j5, j12, 0
        jld j2, j1, SYM
        jadd j2, j2, j10
        jldb j7, j2, 0
        jcall mp_mix
        jldi j2, NXT
        jcall pl_take
        jldi j1, 0
        jld j3, j4, 8
        jldi j2, 1
        jadd j3, j3, j2
        jst j3, j4, 8
        jst j2, j1, ALIVE
      mle_next:
        jldi j2, 1
        jadd j10, j10, j2
        jjmp mle_at
    mle_pnext:
      jldi j2, 1
      jadd j9, j9, j2
      jjmp mle_pair
  mle_pdone:
    jld j2, j1, ALIVE
    jjz j2, mle_done
    jld j2, j1, ORD
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ORD
    jjmp mle_pass
mle_done:
  jldi j1, 0
  jret

; Its own song after the CQN songs at CQ (a question and its turn): song by song, from the longest context that two
; pairs or more say (what one sentence says is not a rule), drawn by the times each song came after it; until it ends,
; or it is as long as the longest answer of the books. Uses j1-j14.
mp_compose:
  jldi j1, 0
  jld j2, j1, CQN
  jst j2, j1, CQ0
  jst j1, j1, CRMAX
  mco_step:
    jldi j1, 0
    jld j2, j1, CQN
    jld j3, j1, CQ0
    jsub j2, j2, j3
    jld j3, j1, MAXA
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, mco_done
    jld j5, j1, CS0
    jst j5, j1, CBEST
    jldi j9, 1
    mco_ctx:
      jldi j1, 0
      jld j2, j1, CQN
      jsub j3, j2, j9
      jldi j4, 63
      jsar j4, j3, j4
      jjnz j4, mco_have
      jld j4, j1, CQ
      jadd j3, j3, j4
      jldb j7, j3, 0
      jcall mp_mix
      jldi j2, CXT
      jcall pl_find
      jld j2, j4, 16
      jldi j3, 2
      jsub j2, j2, j3
      jldi j3, 63
      jsar j2, j2, j3
      jjnz j2, mco_have
      jldi j1, 0
      jst j5, j1, CBEST
      jldi j2, 1
      jadd j9, j9, j2
      jjmp mco_ctx
  mco_have:
    jldi j1, 0                  ; (a context of k songs and a song after it: k + 1 songs as they are in the books read,
    jld j2, j1, CQN             ; but no more than it sang)
    jld j3, j1, CQ0
    jsub j2, j2, j3
    jldi j3, 1
    jadd j2, j2, j3
    jsub j3, j9, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, mco_crc
    jadd j2, j9, j1
  mco_crc:
    jst j2, j1, CRC
    jst j1, j1, CTOT
    jldi j9, 0
    mco_sum:
      jldi j1, 0
      jld j2, j1, NSY
      jsub j2, j9, j2
      jjz j2, mco_draw
      jld j5, j1, CBEST
      jadd j7, j9, j1
      jcall mp_mix
      jldi j2, NXT
      jcall pl_find
      jldi j1, 0
      jld j2, j4, 8
      jld j3, j1, CTOT
      jadd j3, j3, j2
      jst j3, j1, CTOT
      jldi j2, 1
      jadd j9, j9, j2
      jjmp mco_sum
  mco_draw:
    jld j2, j1, CTOT
    jjz j2, mco_done
    jcall mp_rand
    jldi j1, 0
    jld j3, j1, CTOT
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j2, j2, j4
    jst j2, j1, CDRAW
    jldi j9, 0
    mco_pick:
      jldi j1, 0
      jld j5, j1, CBEST
      jadd j7, j9, j1
      jcall mp_mix
      jldi j2, NXT
      jcall pl_find
      jldi j1, 0
      jld j2, j4, 8
      jld j3, j1, CDRAW
      jsub j3, j3, j2
      jst j3, j1, CDRAW
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, mco_got
      jldi j2, 1
      jadd j9, j9, j2
      jjmp mco_pick
  mco_got:
    jld j2, j1, BASE            ; a turn or an end: the song is over
    jldi j3, 1
    jadd j2, j2, j3
    jsub j2, j9, j2
    jjz j2, mco_done
    jldi j3, 1
    jsub j2, j2, j3
    jjz j2, mco_done
    jld j2, j1, CQ
    jld j3, j1, CQN
    jadd j2, j2, j3
    jstb j9, j2, 0
    jldi j2, 1
    jadd j3, j3, j2
    jst j3, j1, CQN
    jld j2, j1, CRC
    jld j3, j1, CRMAX
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, mco_step
    jst j2, j1, CRMAX
    jjmp mco_step
mco_done:
  jldi j1, 0
  jret

; What it sang (CQ from CQ0 to CQN) as text, into CT (CTN bytes): two pieces a letter (a number no book's letter has
; says nothing), a silence a space (a lone piece before it says nothing), a place of the question its word (QLB; one
; the question does not have says nothing). Uses j1-j11.
mp_text:
  jldi j1, 0
  jld j9, j1, CQ0
  jld j10, j1, CT
  jldi j11, -1
  mtx_lap:
    jld j2, j1, CQN
    jsub j2, j9, j2
    jjz j2, mtx_done
    jld j2, j1, CQ
    jadd j2, j2, j9
    jldb j3, j2, 0
    jld j4, j1, BASE
    jldi j5, 3
    jadd j4, j4, j5
    jsub j4, j3, j4
    jldi j5, 63
    jsar j5, j4, j5
    jjnz j5, mtx_plain
    jldi j11, -1
    jld j5, j1, CEC
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j1, CEC
    jld j5, j1, QLN
    jsub j6, j4, j5
    jldi j7, 63
    jsar j6, j6, j7
    jjz j6, mtx_next
    jsub j5, j5, j4
    jldi j6, 1
    jsub j5, j5, j6
    jldi j6, 24
    jmul j5, j5, j6
    jld j6, j1, QLB
    jadd j5, j5, j6
    jld j6, j1, CEW
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j1, CEW
    jld j6, j5, 8
    jld j7, j5, 16
    mtx_cp:
      jjz j7, mtx_next
      jldb j8, j6, 0
      jstb j8, j10, 0
      jldi j8, 1
      jadd j6, j6, j8
      jadd j10, j10, j8
      jsub j7, j7, j8
      jjmp mtx_cp
  mtx_plain:
    jld j4, j1, BASE
    jsub j4, j3, j4
    jjnz j4, mtx_song
    jldi j11, -1
    jldi j3, 32
    jstb j3, j10, 0
    jldi j3, 1
    jadd j10, j10, j3
    jjmp mtx_next
  mtx_song:
    jldi j4, 63
    jsar j4, j11, j4
    jjz j4, mtx_pair
    jadd j11, j3, j1
    jjmp mtx_next
  mtx_pair:
    jld j4, j1, BASE
    jmul j4, j11, j4
    jadd j4, j4, j3
    jldi j11, -1
    jld j5, j1, ALN
    jsub j5, j4, j5
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, mtx_next
    jldi j5, 3
    jshl j5, j4, j5
    jld j6, j1, ALI
    jadd j5, j5, j6
    jld j3, j5, 0
    jstb j3, j10, 0
    jldi j3, 1
    jadd j10, j10, j3
  mtx_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp mtx_lap
mtx_done:
  jld j2, j1, CT
  jsub j2, j10, j2
  jst j2, j1, CTN
  jret

; The books' words (VOC, {print, times}: of the pairs read, not of those left out; F0 all their times), each answer's
; (OWN, {print and pair, 1 when weighed}), the words said most that together make half of what the books say (mp_head),
; and by pair the times of its answer's words, each once (PNUL: all of them, and those not of the half): what a song of
; words drawn by their times, with no context, would get of its answer. Uses j1-j14.
mp_vocab:
  jldi j2, VOC
  jldi j3, 16
  jcall pl_new
  jldi j2, OWN
  jldi j3, 16
  jcall pl_new
  jldi j2, UNK
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jst j1, j1, F0
  jld j11, j1, PPN
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, PNUL
  jst j1, j1, TT5
  mvo_lap:
    jldi j1, 0
    jld j2, j1, TT5
    jld j3, j1, PPN
    jsub j3, j2, j3
    jjz j3, mvo_head
    jst j2, j1, WPR
    jldi j2, 1
    jst j2, j1, WMODE
    jcall mp_ansat
    jcall mp_wwalk
    jldi j1, 0
    jld j2, j1, WPR
    jcall mp_out
    jjnz j2, mvo_next
    jldi j1, 0
    jst j1, j1, WMODE
    jld j2, j1, WPR
    jldi j3, 5
    jshl j3, j2, j3
    jld j4, j1, PPR
    jadd j3, j3, j4
    jld j9, j3, 0
    jld j10, j3, 8
    jld j4, j1, PRB
    jadd j9, j9, j4
    jcall mp_wwalk
    jcall mp_ansat
    jcall mp_wwalk
  mvo_next:
    jldi j1, 0
    jld j2, j1, TT5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT5
    jjmp mvo_lap
mvo_head:
  jcall mp_head
  jldi j1, 0
  jst j1, j1, TT5
  mvo_n:
    jldi j1, 0
    jld j2, j1, TT5
    jld j3, j1, PPN
    jsub j3, j2, j3
    jjz j3, mvo_done
    jst j2, j1, WPR
    jldi j2, 3
    jst j2, j1, WMODE
    jcall mp_ansat
    jcall mp_wwalk
    jldi j1, 0
    jld j2, j1, TT5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, TT5
    jjmp mvo_n
mvo_done:
  jldi j1, 0
  jret

; The words said most that together make half of what the books say: HEADC the fewest times one of them has (found
; halving: the most times c with the words of c times or more saying half of F0), HMASS their times, HEADN how many.
; The cut comes from the books' own words, no count given. Uses j1-j14.
mp_head:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, HLO
  jld j2, j1, F0
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, HHI
  mhd_lap:
    jldi j1, 0
    jld j2, j1, HHI
    jld j3, j1, HLO
    jsub j4, j2, j3
    jldi j5, 2
    jsub j4, j4, j5
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, mhd_done
    jadd j11, j2, j3
    jldi j4, 1
    jshr j11, j11, j4
    jst j11, j1, HMID
    jcall mp_mass
    jldi j1, 0
    jadd j12, j12, j12
    jld j2, j1, F0
    jsub j12, j12, j2
    jldi j3, 63
    jsar j12, j12, j3
    jld j2, j1, HMID
    jjnz j12, mhd_hi
    jst j2, j1, HLO
    jjmp mhd_lap
  mhd_hi:
    jst j2, j1, HHI
    jjmp mhd_lap
mhd_done:
  jld j11, j1, HLO
  jst j11, j1, HEADC
  jcall mp_mass
  jldi j1, 0
  jst j12, j1, HMASS
  jst j13, j1, HEADN
  jret

; Of the books' words, those of j11 times or more: j12 their times, j13 how many. Uses j1-j13.
mp_mass:
  jldi j1, 0
  jldi j12, 0
  jldi j13, 0
  jld j9, j1, VOC
  jld j10, j1, VOC + 8
  jldi j2, 1
  jadd j10, j10, j2
  mms_lap:
    jjz j10, mms_done
    jld j2, j9, 0
    jjz j2, mms_next
    jld j3, j9, 8
    jsub j4, j3, j11
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, mms_next
    jadd j12, j12, j3
    jldi j4, 1
    jadd j13, j13, j4
  mms_next:
    jldi j2, 16
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp mms_lap
mms_done:
  jret

; Pair WPR's answer -> j9 where it is, j10 its bytes. Uses j1-j4.
mp_ansat:
  jldi j1, 0
  jld j2, j1, WPR
  jldi j3, 4
  jshl j3, j2, j3
  jld j4, j1, PAN
  jadd j3, j3, j4
  jld j9, j3, 0
  jld j10, j3, 8
  jld j4, j1, PRB
  jadd j9, j9, j4
  jret

; The words of the j10 bytes at j9, each by its print, to what WMODE says: 0 a word of the books read, once more
; (VOC, F0); 1 of pair WPR's answer (OWN); 2 sung for pair WPR: how many, of the books, of its own answer, and of those
; not of the half (CSW, CSR, CSO, CSWC, CSOC; one no book has is said once, after "inventadas:"); 3 of pair WPR's
; answer, each once, its times into PNUL. Uses j1-j14.
mp_wwalk:
  mww_lap:
    jldi j1, 0
    jjz j10, mww_done
    jldb j3, j9, 0
    jcall mp_isletter
    jjnz j2, mww_word
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
    jjmp mww_lap
  mww_word:
    jldi j8, 0
    mww_end:
      jsub j2, j8, j10
      jjz j2, mww_have
      jadd j2, j9, j8
      jldb j3, j2, 0
      jcall mp_isletter
      jjz j2, mww_have
      jldi j2, 1
      jadd j8, j8, j2
      jjmp mww_end
  mww_have:
    jadd j3, j9, j1
    jadd j4, j8, j1
    jadd j9, j9, j8
    jsub j10, j10, j8
    jst j8, j1, WLEN
    jcall mp_print
    jst j5, j1, WPRT
    jld j2, j1, WMODE
    jjnz j2, mww_m1
    jldi j2, VOC
    jcall pl_take
    jldi j1, 0
    jld j2, j4, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j1, F0
    jadd j2, j2, j3
    jst j2, j1, F0
    jjmp mww_lap
  mww_m1:
    jldi j3, 1
    jsub j3, j2, j3
    jjnz j3, mww_m2
    jld j7, j1, WPR
    jcall mp_mix
    jldi j2, OWN
    jcall pl_take
    jjmp mww_lap
  mww_m2:
    jldi j3, 2
    jsub j3, j2, j3
    jjnz j3, mww_m3
    jld j2, j1, CSW
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, CSW
    jldi j2, VOC
    jcall pl_find
    jldi j1, 0
    jld j3, j4, 8
    jld j2, j4, 0
    jjnz j2, mww_known
    jst j1, j1, WTIM            ; no book read has it: invented, said once
    jld j5, j1, WPRT
    jldi j2, UNK
    jcall pl_take
    jldi j1, 0
    jjz j6, mww_cont
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j3, j1, WLEN
    jsub j11, j9, j3
    mww_pw:
      jsub j2, j11, j9
      jjz j2, mww_cont
      jldb j2, j11, 0
      jcall putch
      jldi j2, 1
      jadd j11, j11, j2
      jjmp mww_pw
  mww_known:
    jst j3, j1, WTIM
    jld j2, j1, CSR
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, CSR
  mww_cont:
    jldi j1, 0
    jst j1, j1, WCON
    jld j2, j1, WTIM
    jld j3, j1, HEADC
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, mww_own
    jldi j2, 1
    jst j2, j1, WCON
    jld j2, j1, CSWC
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, CSWC
  mww_own:
    jld j5, j1, WPRT
    jld j7, j1, WPR
    jcall mp_mix
    jldi j2, OWN
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjz j2, mww_lap
    jld j2, j1, CSO
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, CSO
    jld j2, j1, WCON
    jjz j2, mww_lap
    jld j2, j1, CSOC
    jadd j2, j2, j3
    jst j2, j1, CSOC
    jjmp mww_lap
  mww_m3:
    jld j7, j1, WPR
    jcall mp_mix
    jldi j2, OWN
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 8
    jjnz j2, mww_lap
    jldi j2, 1
    jst j2, j4, 8
    jld j5, j1, WPRT
    jldi j2, VOC
    jcall pl_find
    jldi j1, 0
    jld j3, j4, 8
    jld j2, j4, 0
    jjnz j2, mww_m3k
    jldi j3, 0
  mww_m3k:
    jld j2, j1, WPR
    jldi j4, 4
    jshl j2, j2, j4
    jld j4, j1, PNUL
    jadd j2, j2, j4
    jld j4, j2, 0
    jadd j4, j4, j3
    jst j4, j2, 0
    jld j4, j1, HEADC
    jsub j4, j3, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, mww_lap
    jld j4, j2, 8
    jadd j4, j4, j3
    jst j4, j2, 8
    jjmp mww_lap
mww_done:
  jldi j1, 0
  jret

; The longest stretch in common between what it sang (CT, CTN) and the j10 bytes at j9 -> j2 its bytes. Uses j1-j14.
mp_copy:
  jldi j1, 0
  jld j11, j1, CROW
  jldi j2, 0
  mcp_z:
    jsub j3, j10, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, mcp_zd
    jldi j3, 3
    jshl j3, j2, j3
    jadd j3, j3, j11
    jst j1, j3, 0
    jldi j3, 1
    jadd j2, j2, j3
    jjmp mcp_z
mcp_zd:
  jldi j12, 0
  jldi j13, 0
  mcp_i:
    jld j2, j1, CTN
    jsub j2, j13, j2
    jjz j2, mcp_done
    jld j2, j1, CT
    jadd j2, j2, j13
    jldb j8, j2, 0
    jadd j14, j10, j1
    mcp_j:
      jjz j14, mcp_inext
      jldi j3, 1
      jsub j2, j14, j3
      jadd j2, j2, j9
      jldb j3, j2, 0
      jldi j4, 3
      jshl j4, j14, j4
      jadd j4, j4, j11
      jsub j5, j3, j8
      jjnz j5, mcp_zero
      jldi j5, 8
      jsub j5, j4, j5
      jld j6, j5, 0
      jldi j5, 1
      jadd j6, j6, j5
      jst j6, j4, 0
      jsub j5, j12, j6
      jldi j7, 63
      jsar j5, j5, j7
      jjz j5, mcp_jnext
      jadd j12, j6, j1
      jjmp mcp_jnext
    mcp_zero:
      jst j1, j4, 0
    mcp_jnext:
      jldi j2, 1
      jsub j14, j14, j2
      jjmp mcp_j
  mcp_inext:
    jldi j2, 1
    jadd j13, j13, j2
    jjmp mcp_i
mcp_done:
  jadd j2, j12, j1
  jret

include '../lectura/crece.inc'
include '../lectura/lectura.inc'
