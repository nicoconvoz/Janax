; Razar solves a riddle of words having learned something like it before (Capitan, 2026-11-06: "smarter is that it
; can solve a riddle of words having learned something similar before"; his example: "the numbers are uno dos tres
; cuatro cinco seis; uno mas uno es dos, dos mas dos es cuatro; what is dos mas tres?"). Everything in Janax.
;
; The will (this cabin) with the school as its child (cardumen_cubo.jsm), the two talking in words. Words are songs:
; each letter's Morse as greetings (dot, dash, end of letter: three corner keys of the bottom face), one per step, the
; waves crossing; the will learns a word by the notes of the top face at each step. Three stages, each on the one
; before:
;   1. the ear, and its own size (Capitan: "if 7^3 is not enough, let it model its own size"): the school is born with
;      side N0 and the will learns its 9 words (RONDAS passes). While it still mistakes words it was taught in the
;      last pass, the school is born again one piece wider and the will learns again; when a wider one no longer
;      mistakes fewer, it goes back to the best one (born and learned the same way) and stops. TOPE only ends a run,
;      and it is said when reached.
;   2. counting: it hears "uno dos tres cuatro cinco seis" (CUENTAS times) and remembers, by the words it recognized,
;      which word opens the song and which follows which.
;   3. riddles, "a mas b es c" (or menos): the one thing it can do with a song it knows is walk it and count the
;      steps. A rule is two walks of the same length between the riddle's places (the start of the song, a, b, c):
;      every such equality is a candidate, none preferred. Each example shown counts for the candidates it fits; to
;      answer, the candidates that fit the most examples and say where c is vote, and the answer is the word that many
;      steps into the song; a tie between answers is "it cannot know" (?). Addition is written nowhere.
; It is asked the riddles it was never shown. Its parameters are the file "p" (12 qwords): the school's seed, the
; percent of slipping fingers, N0, CRECE (1: it may grow), TOPE, RONDAS, CUENTAS, quiet (the school never learns), the
; kind (0 mas, 1 menos, 2 both), how many examples drawn by dice, a list of examples instead (bit i: the i-th riddle
; of mas, bit 16 + i of menos, in the order a = 1..6, b = 1..6), and REVUELTO (the answers shown drawn at random: the
; control). Its dice: seed2 = seed * 7919 + 1, seed2 = (seed2 * 1103515245 + 12345) mod 2^31, a throw is seed2 >> 16.
; Every word heard goes into j0 (said * 16 + guess + 1), then the size, the counting, the answers and the counts. It
; writes how it went in two lines.
;
; Its initial data (voluntad_acertijos.datos): the texts, its words at 500h + w * 40h, the Morse of a..z at 800h.
S_ACERT = 0
S_DESLIZ = 40h
S_TIPO = 80h
S_SUMA = 0C0h
S_EJEM = 180h
S_REVU = 1C0h
S_QUIETO = 200h
S_CUBO = 240h
S_PROBO = 280h
S_TOPE = 2C0h
S_CLOSE = 300h
S_OIDO = 340h
S_PAL = 380h
S_DE5 = 3C0h
S_DE  = 400h
S_BIEN = 440h
S_SINR = 480h
S_COLON = 4C0h
S_MELO = 740h
S_BASE = 780h
S_FIRST = 7C0h
WTXT  = 500h                    ; word w: its text at WTXT + w*40h (0 uno .. 5 seis, 6 mas, 7 menos, 8 es)
MORSE = 800h                    ; letter l: its Morse at MORSE + l*8
; Room 0 (6000h bytes):
QUEUE = 1000h                   ; its window: one request
PLAB  = 1040h                   ; "p", the parameters file
HIJO  = 1048h                   ; "hijo"
NACE  = 1080h                   ; the parameters (12 qwords)
DESLIZ = 1088h
N0    = 1090h
CRECE = 1098h
TOPE  = 10A0h
RONDAS = 10A8h
CUENTAS = 10B0h
QUIET = 10B8h
TIPO  = 10C0h
EJEM  = 10C8h
LISTA = 10D0h
REVU  = 10D8h
ESCRITA = 10E0h                 ; 1: the counting song written by hand (the control), not learned
MODO  = 10E8h                   ; 1: the riddle heard as one melody (numbers fed first), not searched
M48   = 1100h                   ; 2^48 - 1
SEED2 = 1108h                   ; its dice
CHILD = 1110h                   ; the school's number
THING = 1118h                   ; the word it says
BEST  = 1120h                   ; what it guessed (9: nothing)
BSUM  = 1128h                   ; the best share so far: BSUM / BTOT
BTOT  = 1130h
SLONG = 1138h                   ; how many steps the song lasted
WORD  = 1140h                   ; the word it is saying
MAIL  = 1148h                   ; a letter read from its mailbox: who said it, the word
NN    = 1158h                   ; the school's side
N2    = 1160h                   ; n^2: the top face
PP    = 1168h                   ; n^3
TMAXW = 1170h                   ; the most steps one of its songs can last: its longest word's greetings + n^3
RBASE = 1178h                   ; its room of what it learned (0: none yet)
STEPB = 1180h                   ; where the song heard is, in that room: top piece j at step t at STEPB + t*n^2 + j
MISS  = 1188h                   ; words it still mistook in the last pass
POS   = 1190h                   ; how long the text it writes is so far
TOPPED = 1198h                  ; 1: it reached TOPE
COUNTOK = 11A0h                 ; counting: right
RIGHT = 11A8h                   ; riddles: right, asked, without an answer
ASKED = 11B0h
NONE  = 11B8h
MAXG  = 11C0h                   ; its longest word, in greetings
NCAND = 11E0h                   ; how many candidates
NTRAIN = 11E8h                  ; riddles shown, and asked
NTEST = 11F0h
NTRIED = 11F8h                  ; sizes tried
PREV  = 1208h                   ; counting: the word before (-1: none)
NUMV  = 1210h                   ; how many answers got votes
CURKEY = 1220h                  ; the 3 pieces of the greeting being said (a qword each)
NBL   = 1240h                   ; a piece's neighbors on the bottom face (up to 4, a qword each)
OPC   = 1260h                   ; the operator word of the riddles being drawn
NALL  = 1270h                   ; how many riddles of it there are
GW    = 1280h                   ; the words heard of one riddle (5 qwords)
PC    = 12A8h                   ; the answer of a riddle shown
SCNT  = 12B0h                   ; how many greetings the song being said has
COV   = 12C0h                   ; a candidate being made (4 qwords)
DIG   = 12E0h                   ; digits of a number being written
SENTN = 1350h                   ; a sentence said as one song: how many words (0: the word THING)
SNW   = 1358h                   ; the song being built: its words, the word, where it started
SWI   = 1360h
WSTART = 1368h
NWORDS = 1370h                  ; how many words it learns: 9, or the 6 numbers (MODO)
MAXS  = 1378h                   ; the longest song it can say: all its words together, plus the longest
BASEK = 1380h                   ; the answer shown most often, and how many asked have it (the baseline)
BASEN = 1388h
SENTL = 1390h                   ; the sentence's words (8 qwords)
GA    = 13D0h                   ; how many asked it answered with their first number
BASEC = 1590h                   ; how often each answer (1..6) was shown
KEYP  = 1300h                   ; the keys: key k (0 dot, 1 dash, 2 end of letter), piece j at KEYP + (k*3 + j)*8
WCODE = 1400h                   ; word w's greetings: WCODE + w*32 + k (0 dot, 1 dash, 2 end of letter)
WLEN  = 1540h                   ; how many greetings each word has
HEARD = 1600h                   ; notes heard for each word, in all
FIRST = 1680h                   ; counting: how often each word (or 9, nothing) opened the song
NEXT  = 16D0h                   ; how often word b followed word a: NEXT + (a*10 + b)*8
CAND  = 1A80h                   ; candidate i: its 4 coefficients (start, a, b, c) at CAND + i*32
FIT   = 2300h                   ; operator word o, candidate i: examples it fit at FIT + (o*64 + i)*8
ALLP  = 3700h                   ; the riddles of one operator: a, operator, b, c (32 bytes each)
TRAIN = 3900h                   ; the riddles shown
TEST  = 3D00h                   ; the riddles asked
VOTE  = 4100h                   ; answer, votes (16 bytes each)
SONGM = 5000h                   ; the song being said: the pieces of each greeting (up to 255)
TRIED = 4800h                   ; sizes tried: side, words mistaken (16 bytes each)
TEXT  = 4C00h                   ; the lines it writes
include '../../escalon0/janax.inc'
jfirst j1, 6000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jst j2, j2, RBASE
jst j2, j2, POS
jldi j0, 0                      ; the fingerprint

jldi j1, 0                      ; its parameters: open "p" (request 4) and read up to 112 bytes (request 5)
jldi j2, 70h
jst j2, j1, PLAB
jldi j10, 4
jldi j11, PLAB
jldi j12, 1
jcall ask
jldi j1, 32
jshl j10, j13, j1               ; the handle travels in the high half of the kind
jldi j1, 5
jor j10, j10, j1
jldi j11, NACE
jldi j12, 112
jcall ask

jldi j1, 0                      ; "hijo" = 68 69 6A 6F, launched with every right
jldi j2, 6F6Ah
jshi j2, 6968h
jst j2, j1, HIJO
jldi j10, 15
jldi j3, 32
jshl j10, j10, j3
jldi j3, 16
jor j10, j10, j3
jldi j11, HIJO
jldi j12, 4
jcall ask
jldi j1, 0
jst j13, j1, CHILD

jldi j1, 0                      ; its words as greetings: each letter's Morse, from its text
jst j1, j1, MAXG
jldi j8, 0                      ; word w
jldi j9, 9
jwhile j9
  jldi j1, 6                    ; its text: WTXT + w*40h
  jshl j2, j8, j1
  jldi j1, 5
  jshl j3, j8, j1               ; its greetings: WCODE + w*32
  jldi j4, 0                    ; how many
wc_letter:
  jldb j5, j2, WTXT
  jjz j5, wc_done
  jldi j1, 97
  jsub j5, j5, j1
  jldi j1, 3
  jshl j5, j5, j1
  jld j6, j5, MORSE             ; its marks, then 2, then 3
wc_mark:
  jldi j1, 3
  jand j7, j6, j1
  jsub j1, j7, j1
  jjz j1, wc_next
  jadd j1, j3, j4
  jstb j7, j1, WCODE
  jldi j1, 1
  jadd j4, j4, j1
  jldi j1, 2
  jshr j6, j6, j1
  jjmp wc_mark
wc_next:
  jldi j1, 1
  jadd j2, j2, j1
  jjmp wc_letter
wc_done:
  jldi j1, 3
  jshl j1, j8, j1
  jst j4, j1, WLEN
  jldi j1, 0
  jld j5, j1, MAXG
  jsub j5, j5, j4
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, wc_kept
  jst j4, j1, MAXG
wc_kept:
  jldi j1, 1
  jadd j8, j8, j1
  jsub j9, j9, j1
jwend

jldi j1, 0                      ; no sentence yet; the words it learns; the longest song it can say
jst j1, j1, SENTN
jldi j2, 9
jld j3, j1, MODO
jjz j3, w_nine
jldi j2, 6
w_nine:
jst j2, j1, NWORDS
jld j2, j1, MAXG
jldi j3, 0
jldi j4, 9
jwhile j4
  jld j5, j3, WLEN
  jadd j2, j2, j5
  jldi j5, 8
  jadd j3, j3, j5
  jldi j5, 1
  jsub j4, j4, j5
jwend
jst j2, j1, MAXS

; 1. The ear, and its own size.
jldi j1, 0
jst j1, j1, NTRIED
jst j1, j1, TOPPED
jld j1, j1, N0
jcall born_n
jcall learn_words
jcall tried
z_grow:
  jldi j1, 0
  jld j2, j1, CRECE
  jjz j2, z_done
  jld j2, j1, MISS
  jjz j2, z_done
  jld j2, j1, NN                ; past TOPE: it says so
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j1, TOPE
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, z_wider
  jldi j3, 1
  jst j3, j1, TOPPED
  jjmp z_done
z_wider:
  jld j2, j1, MISS              ; the mistakes at this size, kept a moment
  jst j2, j1, PREV
  jld j1, j1, NN
  jldi j2, 1
  jadd j1, j1, j2
  jcall born_n
  jcall learn_words
  jcall tried
  jldi j1, 0
  jld j2, j1, MISS
  jld j3, j1, PREV
  jsub j2, j2, j3               ; wider and not fewer mistakes: back to the best, learned the same way
  jldi j4, 63
  jsar j2, j2, j4
  jjnz j2, z_grow
  jst j3, j1, MISS
  jld j1, j1, NN
  jldi j2, 1
  jsub j1, j1, j2
  jcall born_n
  jldi j1, 0
  jld j2, j1, MISS
  jst j2, j1, PREV
  jcall learn_words
  jldi j1, 0
  jld j2, j1, PREV
  jst j2, j1, MISS
z_done:
jldi j1, 0
jld j12, j1, NN
jcall mix
jld j12, j1, MISS
jcall mix

; 2. Counting.
jldi j1, 0                      ; heard as a melody (MODO): the numbers fed as one song, the count, CUENTAS times;
jst j1, j1, COUNTOK             ; the school hears their order, the will remembers nothing of it
jld j2, j1, MODO
jjz j2, k_words
jld j15, j1, CUENTAS
jwhile j15
  jldi j2, 0
  jldi j3, 6
  jwhile j3
    jldi j4, 3
    jshl j4, j2, j4
    jst j2, j4, SENTL
    jldi j4, 1
    jadd j2, j2, j4
    jsub j3, j3, j4
  jwend
  jldi j1, 0
  jldi j2, 6
  jst j2, j1, SENTN
  jcall song
  jldi j1, 0
  jst j1, j1, SENTN
  jldi j1, 1
  jsub j15, j15, j1
jwend
jjmp k_skip
k_words:
jldi j1, 0                      ; nothing remembered yet
jldi j2, 110
jwhile j2
  jldi j3, 3
  jshl j3, j1, j3
  jldi j4, 0
  jst j4, j3, FIRST
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend
jldi j1, 0
jld j15, j1, CUENTAS
jwhile j15
  jldi j1, 0
  jldi j2, 1
  jsub j2, j1, j2
  jst j2, j1, PREV
  jst j1, j1, THING
  jldi j9, 6
  jwhile j9
    jcall hear_w
    jldi j1, 0
    jld j2, j1, BEST
    jld j3, j1, PREV
    jldi j4, 63
    jsar j4, j3, j4
    jjz j4, k_after
    jldi j4, 3                  ; the first
    jshl j4, j2, j4
    jld j5, j4, FIRST
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j4, FIRST
    jjmp k_kept
  k_after:
    jldi j4, 10                 ; it followed the one before
    jmul j4, j3, j4
    jadd j4, j4, j2
    jldi j5, 3
    jshl j4, j4, j5
    jld j5, j4, NEXT
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j4, NEXT
  k_kept:
    jst j2, j1, PREV
    jld j2, j1, THING
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, THING
    jsub j9, j9, j3
  jwend
  jldi j1, 1
  jsub j15, j15, j1
jwend
jldi j1, 0                      ; ESCRITA (the control): the counting song written by hand instead of learned
jld j2, j1, ESCRITA
jjz j2, k_learned
jldi j2, 110
jwhile j2
  jldi j3, 3
  jshl j3, j1, j3
  jldi j4, 0
  jst j4, j3, FIRST
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend
jldi j1, 0
jldi j2, 1
jst j2, j1, FIRST               ; uno opens it
jldi j3, 0                      ; and word i + 1 follows word i
jldi j4, 5
jwhile j4
  jldi j5, 11
  jmul j5, j3, j5
  jldi j6, 1
  jadd j5, j5, j6
  jldi j6, 3
  jshl j5, j5, j6
  jst j2, j5, NEXT
  jldi j6, 1
  jadd j3, j3, j6
  jsub j4, j4, j6
jwend
k_learned:
jldi j1, 0                      ; what comes after each of the first five
jst j1, j1, COUNTOK
jldi j9, 0
k_lap:
  jldi j1, 80
  jmul j1, j9, j1
  jldi j2, NEXT
  jadd j1, j1, j2
  jcall most
  jldi j1, 1
  jadd j3, j9, j1
  jsub j3, j2, j3
  jjnz j3, k_wrong
  jldi j3, 0
  jld j4, j3, COUNTOK
  jadd j4, j4, j1
  jst j4, j3, COUNTOK
k_wrong:
  jcall mixsym
  jldi j1, 1
  jadd j9, j9, j1
  jldi j1, 5
  jsub j1, j9, j1
  jjnz j1, k_lap

k_skip:
; 3. Riddles. The candidates: (p, q, r, s) over the places 0 start, 1 a, 2 b, 3 c: the walk p->q as long as r->s,
; as coefficients q - p - s + r; none that says nothing about a, b, c, and none twice (nor its mirror).
jldi j1, 0
jst j1, j1, NCAND
jldi j1, 0                      ; p
c_p:
  jldi j2, 0                    ; q
c_q:
  jsub j5, j1, j2
  jjz j5, c_qnext
  jldi j3, 0                    ; r
c_r:
  jldi j4, 0                    ; s
c_s:
  jsub j5, j3, j4
  jjz j5, c_snext
  jldi j5, 0
  jst j5, j5, COV
  jst j5, j5, COV + 8
  jst j5, j5, COV + 16
  jst j5, j5, COV + 24
  jldi j6, 3
  jshl j7, j2, j6               ; +q
  jld j8, j7, COV
  jldi j9, 1
  jadd j8, j8, j9
  jst j8, j7, COV
  jshl j7, j1, j6               ; -p
  jld j8, j7, COV
  jsub j8, j8, j9
  jst j8, j7, COV
  jshl j7, j4, j6               ; -s
  jld j8, j7, COV
  jsub j8, j8, j9
  jst j8, j7, COV
  jshl j7, j3, j6               ; +r
  jld j8, j7, COV
  jadd j8, j8, j9
  jst j8, j7, COV
  jld j6, j5, COV + 8           ; nothing about a, b, c: says nothing
  jld j7, j5, COV + 16
  jor j6, j6, j7
  jld j7, j5, COV + 24
  jor j6, j6, j7
  jjz j6, c_snext
  jld j10, j5, NCAND            ; seen already, or its mirror?
  jldi j11, CAND
  jwhile j10
    jldi j12, 0                 ; differences to it, and to its mirror
    jldi j13, 0
    jldi j14, 0
  c_cmp:
    jldi j6, 3
    jshl j6, j14, j6
    jld j7, j6, COV
    jadd j8, j11, j6
    jld j8, j8, 0
    jsub j9, j7, j8
    jor j12, j12, j9
    jadd j9, j7, j8
    jor j13, j13, j9
    jldi j6, 1
    jadd j14, j14, j6
    jldi j6, 4
    jsub j6, j14, j6
    jjnz j6, c_cmp
    jjz j12, c_snext
    jjz j13, c_snext
    jldi j6, 32
    jadd j11, j11, j6
    jldi j6, 1
    jsub j10, j10, j6
  jwend
  jld j10, j5, NCAND            ; a new one
  jldi j6, 5
  jshl j11, j10, j6
  jld j6, j5, COV
  jst j6, j11, CAND
  jld j6, j5, COV + 8
  jst j6, j11, CAND + 8
  jld j6, j5, COV + 16
  jst j6, j11, CAND + 16
  jld j6, j5, COV + 24
  jst j6, j11, CAND + 24
  jldi j6, 1
  jadd j10, j10, j6
  jst j10, j5, NCAND
c_snext:
  jldi j5, 1
  jadd j4, j4, j5
  jldi j5, 4
  jsub j5, j4, j5
  jjnz j5, c_s
  jldi j5, 1
  jadd j3, j3, j5
  jldi j5, 4
  jsub j5, j3, j5
  jjnz j5, c_r
c_qnext:
  jldi j5, 1
  jadd j2, j2, j5
  jldi j5, 4
  jsub j5, j2, j5
  jjnz j5, c_q
  jldi j5, 1
  jadd j1, j1, j5
  jldi j5, 4
  jsub j5, j1, j5
  jjnz j5, c_p

jldi j1, 0                      ; no candidate fit anything yet
jldi j2, 640
jwhile j2
  jldi j3, 3
  jshl j3, j1, j3
  jldi j4, 0
  jst j4, j3, FIT
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend

jldi j1, 0                      ; the riddles: of mas (6), menos (7) or both, shown and asked
jst j1, j1, NTRAIN
jst j1, j1, NTEST
jld j2, j1, TIPO
jldi j3, 1
jsub j3, j2, j3
jjz j3, r_menos
jldi j3, 6
jst j3, j1, OPC
jcall riddles_of
jldi j1, 0
jld j2, j1, TIPO
jjz j2, r_drawn
r_menos:
jldi j1, 0
jldi j3, 7
jst j3, j1, OPC
jcall riddles_of
r_drawn:

jldi j1, 0                      ; heard as a melody: another way
jld j2, j1, MODO
jjnz j2, m_train
jldi j1, 0                      ; shown: it hears the five words and counts what fits
jld j15, j1, NTRAIN
jldi j1, TRAIN
jldi j2, 0
jst j1, j2, PREV                ; (PREV: the riddle)
jwhile j15
  jldi j1, 0
  jld j1, j1, PREV
  jld j2, j1, 24                ; c, or drawn at random (the control)
  jldi j3, 0
  jld j3, j3, REVU
  jjz j3, t_true
  jcall rnd2
  jldi j3, 6
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j2, j13, j4
  jldi j3, 1
  jadd j2, j2, j3
t_true:
  jldi j3, 0
  jst j2, j3, PC
  jldi j1, 0
  jld j1, j1, PREV
  jld j2, j1, 0                 ; a
  jldi j3, 1
  jsub j2, j2, j3
  jldi j3, 0
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW
  jld j1, j3, PREV
  jld j2, j1, 8                 ; the operator
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW + 8
  jld j1, j3, PREV
  jld j2, j1, 16                ; b
  jldi j4, 1
  jsub j2, j2, j4
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW + 16
  jldi j2, 8                    ; es
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW + 24
  jld j2, j3, PC                ; c
  jldi j4, 1
  jsub j2, j2, j4
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW + 32
  jld j1, j3, GW                ; the places: walks from the start to a, b, c
  jcall walk_to
  jjz j2, t_next
  jldi j3, 0
  jst j2, j3, GW                ; (GW now: pa)
  jld j1, j3, GW + 16
  jcall walk_to
  jjz j2, t_next
  jldi j3, 0
  jst j2, j3, GW + 16
  jld j1, j3, GW + 32
  jcall walk_to
  jjz j2, t_next
  jldi j3, 0
  jst j2, j3, GW + 32
  jld j9, j3, NCAND             ; each candidate: does it fit?
  jldi j8, 0
  jwhile j9
    jldi j3, 5
    jshl j4, j8, j3
    jldi j3, 0
    jld j5, j4, CAND + 8
    jld j6, j3, GW
    jmul j5, j5, j6
    jld j6, j4, CAND + 16
    jld j7, j3, GW + 16
    jmul j6, j6, j7
    jadd j5, j5, j6
    jld j6, j4, CAND + 24
    jld j7, j3, GW + 32
    jmul j6, j6, j7
    jadd j5, j5, j6
    jjnz j5, t_nofit
    jld j6, j3, GW + 8          ; FIT[operator heard][i] + 1
    jldi j7, 64
    jmul j6, j6, j7
    jadd j6, j6, j8
    jldi j7, 3
    jshl j6, j6, j7
    jld j7, j6, FIT
    jldi j5, 1
    jadd j7, j7, j5
    jst j7, j6, FIT
  t_nofit:
    jldi j3, 1
    jadd j8, j8, j3
    jsub j9, j9, j3
  jwend
t_next:
  jldi j1, 0
  jld j2, j1, PREV
  jldi j3, 32
  jadd j2, j2, j3
  jst j2, j1, PREV
  jldi j3, 1
  jsub j15, j15, j3
jwend

jldi j1, 0                      ; asked: "a op b es ?"
jst j1, j1, RIGHT
jst j1, j1, ASKED
jst j1, j1, NONE
jld j15, j1, NTEST
jldi j1, TEST
jldi j2, 0
jst j1, j2, PREV
jwhile j15
  jldi j3, 0
  jld j1, j3, PREV
  jld j2, j1, 0                 ; a
  jldi j4, 1
  jsub j2, j2, j4
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW
  jld j1, j3, PREV
  jld j2, j1, 8                 ; the operator
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW + 8
  jld j1, j3, PREV
  jld j2, j1, 16                ; b
  jldi j4, 1
  jsub j2, j2, j4
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0
  jld j2, j3, BEST
  jst j2, j3, GW + 16
  jldi j2, 8                    ; es
  jst j2, j3, THING
  jcall hear_w
  jldi j3, 0                    ; no votes yet
  jst j3, j3, NUMV
  jld j1, j3, GW
  jcall walk_to
  jldi j3, 0
  jst j2, j3, GW                ; pa
  jjz j2, q_count
  jld j1, j3, GW + 16
  jcall walk_to
  jldi j3, 0
  jst j2, j3, GW + 16           ; pb
  jjz j2, q_count
  jldi j10, 0                   ; the most examples fit by a candidate that says where c is
  jld j9, j3, NCAND
  jldi j8, 0
  jwhile j9
    jldi j4, 5
    jshl j4, j8, j4
    jld j5, j4, CAND + 24
    jjz j5, q_bnext
    jld j6, j3, GW + 8
    jldi j7, 64
    jmul j6, j6, j7
    jadd j6, j6, j8
    jldi j7, 3
    jshl j6, j6, j7
    jld j6, j6, FIT
    jsub j7, j10, j6
    jldi j5, 63
    jsar j7, j7, j5
    jjz j7, q_bnext
    jadd j10, j6, j3
  q_bnext:
    jldi j4, 1
    jadd j8, j8, j4
    jsub j9, j9, j4
  jwend
  jjz j10, q_count
  jld j9, j3, NCAND             ; they vote: c = -(a*pa + b*pb) / c, when it divides
  jldi j8, 0
  jwhile j9
    jldi j4, 5
    jshl j4, j8, j4
    jld j5, j4, CAND + 24
    jjz j5, q_vnext
    jld j6, j3, GW + 8
    jldi j7, 64
    jmul j6, j6, j7
    jadd j6, j6, j8
    jldi j7, 3
    jshl j6, j6, j7
    jld j6, j6, FIT
    jsub j6, j6, j10
    jjnz j6, q_vnext
    jld j6, j4, CAND + 8
    jld j7, j3, GW
    jmul j6, j6, j7
    jld j7, j4, CAND + 16
    jld j11, j3, GW + 16
    jmul j7, j7, j11
    jadd j6, j6, j7             ; rest
    jdiv j7, j6, j5
    jmul j11, j7, j5
    jsub j11, j11, j6
    jjnz j11, q_vnext           ; it does not divide
    jsub j7, j3, j7             ; the value: -rest / c
    jld j11, j3, NUMV           ; one more vote for it
    jldi j12, VOTE
  q_find:
    jjz j11, q_new
    jld j13, j12, 0
    jsub j13, j13, j7
    jjz j13, q_add
    jldi j13, 16
    jadd j12, j12, j13
    jldi j13, 1
    jsub j11, j11, j13
    jjmp q_find
  q_new:
    jst j7, j12, 0
    jst j3, j12, 8
    jld j11, j3, NUMV
    jldi j13, 1
    jadd j11, j11, j13
    jst j11, j3, NUMV
  q_add:
    jld j13, j12, 8
    jldi j11, 1
    jadd j13, j13, j11
    jst j13, j12, 8
  q_vnext:
    jldi j4, 1
    jadd j8, j8, j4
    jsub j9, j9, j4
  jwend
q_count:
  jldi j3, 0                    ; the answer: the one with most votes, if only one has that many
  jldi j2, 9
  jld j9, j3, NUMV
  jjz j9, q_said
  jldi j10, 0                   ; most votes
  jldi j12, VOTE
  jwhile j9
    jld j13, j12, 8
    jsub j14, j10, j13
    jldi j11, 63
    jsar j14, j14, j11
    jjz j14, q_mnext
    jadd j10, j13, j3
    jld j1, j12, 0              ; its value
  q_mnext:
    jldi j13, 16
    jadd j12, j12, j13
    jldi j13, 1
    jsub j9, j9, j13
  jwend
  jld j9, j3, NUMV              ; how many have that many
  jldi j12, VOTE
  jldi j11, 0
  jwhile j9
    jld j13, j12, 8
    jsub j13, j13, j10
    jjnz j13, q_tnext
    jldi j13, 1
    jadd j11, j11, j13
  q_tnext:
    jldi j13, 16
    jadd j12, j12, j13
    jldi j13, 1
    jsub j9, j9, j13
  jwend
  jldi j13, 1
  jsub j11, j11, j13
  jjnz j11, q_said              ; a tie: it cannot know
  jcall word_at
q_said:
  jldi j3, 0
  jld j4, j3, ASKED
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j3, ASKED
  jld j1, j3, PREV
  jld j4, j1, 24
  jsub j4, j4, j5
  jsub j4, j2, j4
  jjnz j4, q_notright
  jld j4, j3, RIGHT
  jadd j4, j4, j5
  jst j4, j3, RIGHT
q_notright:
  jldi j4, 9
  jsub j4, j2, j4
  jjnz j4, q_answered
  jld j4, j3, NONE
  jadd j4, j4, j5
  jst j4, j3, NONE
q_answered:
  jcall mixsym
  jldi j1, 0
  jld j2, j1, PREV
  jldi j3, 32
  jadd j2, j2, j3
  jst j2, j1, PREV
  jldi j3, 1
  jsub j15, j15, j3
jwend

jjmp r_counts

; The riddle heard as one melody (MODO): "a op b es" is one song, and the ear learns that melody as its answer c
; (learning with the answer, said plainly), as it learned each number by its song. Asked: the same song, and its
; guess is the answer. No chain of numbers, no rule: whatever answers comes out of the melody. The baseline: the
; answer shown most often (the first if tied), always.
m_train:
jldi j1, 0
jldi j2, 7
jwhile j2
  jldi j3, 3
  jshl j3, j1, j3
  jldi j4, 0
  jst j4, j3, BASEC
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend
jldi j1, 0
jld j15, j1, NTRAIN
jldi j2, TRAIN
jst j2, j1, PREV
jwhile j15
  jldi j1, 0
  jld j3, j1, PREV
  jld j2, j3, 24                ; c, or drawn at random (the control)
  jld j4, j1, REVU
  jjz j4, mt_true
  jcall rnd2
  jldi j3, 6
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j2, j13, j4
  jldi j3, 1
  jadd j2, j2, j3
mt_true:
  jldi j1, 0
  jst j2, j1, PC
  jcall m_sing
  jcall guess
  jldi j1, 0
  jld j2, j1, PC
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, THING
  jcall m_mix
  jcall learnw
  jldi j1, 0
  jld j2, j1, PC
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j2, BASEC
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j2, BASEC
  jld j2, j1, PREV
  jldi j3, 32
  jadd j2, j2, j3
  jst j2, j1, PREV
  jldi j3, 1
  jsub j15, j15, j3
jwend
jldi j1, 0                      ; the baseline's answer
jst j1, j1, BASEK
jldi j2, 0
jldi j3, 1
jldi j4, 6
jwhile j4
  jldi j5, 3
  jshl j5, j3, j5
  jld j5, j5, BASEC
  jsub j6, j2, j5
  jldi j7, 63
  jsar j6, j6, j7
  jjz j6, mb_next
  jadd j2, j5, j1
  jst j3, j1, BASEK
mb_next:
  jldi j5, 1
  jadd j3, j3, j5
  jsub j4, j4, j5
jwend
jst j1, j1, RIGHT
jst j1, j1, ASKED
jst j1, j1, NONE
jst j1, j1, BASEN
jst j1, j1, GA
jld j15, j1, NTEST
jldi j2, TEST
jst j2, j1, PREV
jwhile j15
  jldi j1, 0
  jld j3, j1, PREV
  jld j2, j3, 24
  jst j2, j1, PC
  jcall m_sing
  jcall guess
  jldi j1, 0
  jld j2, j1, PC
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, THING
  jcall m_mix
  jldi j1, 0
  jldi j5, 1
  jld j4, j1, ASKED
  jadd j4, j4, j5
  jst j4, j1, ASKED
  jld j2, j1, BEST
  jld j3, j1, THING
  jsub j3, j2, j3
  jjnz j3, mq_wrong
  jld j4, j1, RIGHT
  jadd j4, j4, j5
  jst j4, j1, RIGHT
mq_wrong:
  jldi j3, 9
  jsub j3, j2, j3
  jjnz j3, mq_said
  jld j4, j1, NONE
  jadd j4, j4, j5
  jst j4, j1, NONE
mq_said:
  jld j2, j1, PC
  jld j3, j1, BASEK
  jsub j3, j2, j3
  jjnz j3, mq_base
  jld j4, j1, BASEN
  jadd j4, j4, j5
  jst j4, j1, BASEN
mq_base:
  jld j3, j1, PREV               ; did it answer the first number?
  jld j3, j3, 0
  jsub j3, j3, j5
  jld j2, j1, BEST
  jsub j3, j2, j3
  jjnz j3, mq_first
  jld j4, j1, GA
  jadd j4, j4, j5
  jst j4, j1, GA
mq_first:
  jld j2, j1, PREV
  jldi j3, 32
  jadd j2, j2, j3
  jst j2, j1, PREV
  jldi j3, 1
  jsub j15, j15, j3
jwend
jjmp r_counts

; The riddle at PREV ("a op b es") said as one song. Uses j1-j8, j10-j14.
m_sing:
  jldi j1, 0
  jld j3, j1, PREV
  jld j2, j3, 0
  jldi j4, 1
  jsub j2, j2, j4
  jst j2, j1, SENTL
  jld j2, j3, 8
  jst j2, j1, SENTL + 8
  jld j2, j3, 16
  jsub j2, j2, j4
  jst j2, j1, SENTL + 16
  jldi j2, 8
  jst j2, j1, SENTL + 24
  jldi j2, 4
  jst j2, j1, SENTN
  jcall song
  jldi j1, 0
  jst j1, j1, SENTN
  jret

; Into the fingerprint: answer (THING) * 16 + guess + 1 (0: nothing). Uses j1-j3, j12-j14.
m_mix:
  jldi j1, 0
  jld j12, j1, THING
  jldi j2, 4
  jshl j12, j12, j2
  jld j2, j1, BEST
  jldi j3, 9
  jsub j3, j2, j3
  jjz j3, mm_none
  jldi j3, 1
  jadd j12, j12, j3
  jadd j12, j12, j2
mm_none:
  jcall mix
  jret

r_counts:
jldi j1, 0                      ; the counts
jld j12, j1, COUNTOK
jcall mix
jld j12, j1, RIGHT
jcall mix
jld j12, j1, ASKED
jcall mix

jldi j1, 0                      ; the school ends (order 3: it says its fingerprint, not mixed here)
jldi j2, 3
jst j2, j1, WORD
jcall say
jcall hear

jldi j1, S_ACERT                ; how it went
jcall puts
jld j2, j1, NACE
jcall putnum
jldi j1, S_DESLIZ
jcall puts
jld j2, j1, DESLIZ
jcall putnum
jldi j1, S_TIPO
jcall puts
jldi j1, 0
jld j2, j1, TIPO
jldi j3, 6
jshl j1, j2, j3
jldi j3, S_SUMA
jadd j1, j1, j3
jcall puts
jldi j1, S_EJEM
jcall puts
jld j2, j1, LISTA
jjnz j2, o_list
jld j2, j1, EJEM
jcall putnum
jjmp o_listed
o_list:                         ; the list, in words: uno mas uno,dos menos uno...
jldi j9, 0                      ; written so far
jldi j5, 6                      ; the operator
o_op:
  jldi j8, 0                    ; its riddle i
  jldi j6, 1                    ; a
o_a:
  jldi j7, 1                    ; b
o_b:
  jldi j1, 6
  jsub j1, j5, j1
  jadd j15, j6, j7
  jjz j1, o_c
  jsub j15, j6, j7
o_c:
  jldi j1, 1                    ; 1 <= c <= 6, else not one of them
  jsub j2, j15, j1
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, o_bnext
  jldi j1, 6
  jsub j2, j1, j15
  jsar j2, j2, j3
  jjnz j2, o_bnext
  jldi j1, 6                    ; its bit: i, or 16 + i for menos
  jsub j1, j5, j1
  jldi j2, 4
  jshl j1, j1, j2
  jadd j1, j1, j8
  jldi j2, 0
  jld j2, j2, LISTA
  jshr j2, j2, j1
  jldi j1, 1
  jand j2, j2, j1
  jjz j2, o_inext
  jjz j9, o_nocomma
  jldi j2, 44
  jcall putch
  jldi j2, 32
  jcall putch
o_nocomma:
  jldi j1, 1                    ; in words: "uno mas uno"
  jsub j1, j6, j1
  jldi j2, 6
  jshl j1, j1, j2
  jldi j2, WTXT
  jadd j1, j1, j2
  jcall puts
  jldi j2, 32
  jcall putch
  jldi j2, 6
  jshl j1, j5, j2
  jldi j2, WTXT
  jadd j1, j1, j2
  jcall puts
  jldi j2, 32
  jcall putch
  jldi j1, 1
  jsub j1, j7, j1
  jldi j2, 6
  jshl j1, j1, j2
  jldi j2, WTXT
  jadd j1, j1, j2
  jcall puts
  jldi j1, 1
  jadd j9, j9, j1
o_inext:
  jldi j1, 1
  jadd j8, j8, j1
o_bnext:
  jldi j1, 1
  jadd j7, j7, j1
  jldi j1, 7
  jsub j1, j7, j1
  jjnz j1, o_b
  jldi j1, 1
  jadd j6, j6, j1
  jldi j1, 7
  jsub j1, j6, j1
  jjnz j1, o_a
  jldi j1, 1
  jadd j5, j5, j1
  jldi j1, 8
  jsub j1, j5, j1
  jjnz j1, o_op
o_listed:
jldi j1, 0
jld j2, j1, REVU
jjz j2, o_revu
jldi j1, S_REVU
jcall puts
o_revu:
jldi j1, 0
jld j2, j1, QUIET
jjz j2, o_quiet
jldi j1, S_QUIETO
jcall puts
o_quiet:
jldi j1, 0
jld j2, j1, MODO
jjz j2, o_melo
jldi j1, S_MELO
jcall puts
o_melo:
jldi j1, S_CUBO
jcall puts
jld j2, j1, NN
jcall putnum
jldi j1, S_PROBO
jcall puts
jldi j1, 0
jld j15, j1, NTRIED
jldi j9, 0
jwhile j15
  jjz j9, o_first
  jldi j2, 32
  jcall putch
o_first:
  jld j2, j9, TRIED
  jcall putnum
  jldi j1, S_COLON
  jcall puts
  jld j2, j9, TRIED + 8
  jcall putnum
  jldi j1, 16
  jadd j9, j9, j1
  jldi j1, 1
  jsub j15, j15, j1
jwend
jldi j1, 0
jld j2, j1, TOPPED
jjz j2, o_top
jldi j1, S_TOPE
jcall puts
o_top:
jldi j1, S_CLOSE
jcall puts
jldi j1, S_OIDO
jcall puts
jld j2, j1, MISS
jcall putnum
jldi j1, S_PAL
jcall puts
jld j2, j1, COUNTOK
jcall putnum
jldi j1, S_DE5
jcall puts
jld j2, j1, RIGHT
jcall putnum
jldi j1, S_DE
jcall puts
jld j2, j1, ASKED
jcall putnum
jldi j1, S_BIEN
jcall puts
jld j2, j1, NONE
jcall putnum
jldi j1, S_SINR
jcall puts
jldi j1, 0                      ; heard as a melody: the baseline too
jld j2, j1, MODO
jjz j2, o_base
jldi j1, S_BASE
jcall puts
jld j2, j1, BASEN
jcall putnum
jldi j1, S_DE
jcall puts
jld j2, j1, ASKED
jcall putnum
jldi j1, S_FIRST
jcall puts
jld j2, j1, GA
jcall putnum
jldi j2, 10
jcall putch
o_base:
jldi j10, 1
jldi j11, TEXT
jldi j1, 0
jld j12, j1, POS
jcall ask
jhalt

; The riddles of the operator word OPC (6 mas: c = a + b; 7 menos: c = a - b), every a, b in 1..6 whose c is in
; 1..6, in order; the ones of the list (LISTA), or the first EJEM after shuffling them with its dice, go to the shown
; ones; the rest, in that order, to the asked ones. Uses j1-j14.
riddles_of:
  jldi j13, 0
  jst j13, j13, NALL
  jldi j1, 1                    ; a
ro_a:
  jldi j2, 1                    ; b
ro_b:
  jld j3, j13, OPC
  jldi j4, 6
  jsub j4, j3, j4
  jadd j5, j1, j2
  jjz j4, ro_op
  jsub j5, j1, j2
ro_op:
  jldi j4, 1                    ; 1 <= c <= 6
  jsub j6, j5, j4
  jldi j7, 63
  jsar j6, j6, j7
  jjnz j6, ro_bnext
  jldi j4, 6
  jsub j6, j4, j5
  jsar j6, j6, j7
  jjnz j6, ro_bnext
  jld j6, j13, NALL
  jldi j7, 5
  jshl j7, j6, j7
  jst j1, j7, ALLP
  jst j3, j7, ALLP + 8
  jst j2, j7, ALLP + 16
  jst j5, j7, ALLP + 24
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j13, NALL
ro_bnext:
  jldi j4, 1
  jadd j2, j2, j4
  jldi j4, 7
  jsub j4, j2, j4
  jjnz j4, ro_b
  jldi j4, 1
  jadd j1, j1, j4
  jldi j4, 7
  jsub j4, j1, j4
  jjnz j4, ro_a
  jld j1, j13, LISTA
  jjnz j1, ro_list
  jld j9, j13, NALL             ; shuffled: i from the last down to 1, swapped with a throw mod (i + 1)
  jldi j1, 1
  jsub j9, j9, j1
ro_shuffle:
  jjz j9, ro_take
  jcall rnd2
  jldi j1, 1
  jadd j2, j9, j1
  jdiv j3, j13, j2
  jmul j3, j3, j2
  jsub j3, j13, j3              ; j
  jldi j1, 5
  jshl j4, j9, j1
  jshl j5, j3, j1
  jldi j6, 4
  jwhile j6
    jld j7, j4, ALLP
    jld j8, j5, ALLP
    jst j8, j4, ALLP
    jst j7, j5, ALLP
    jldi j1, 8
    jadd j4, j4, j1
    jadd j5, j5, j1
    jldi j1, 1
    jsub j6, j6, j1
  jwend
  jldi j1, 1
  jsub j9, j9, j1
  jjmp ro_shuffle
ro_take:                        ; the first EJEM are shown (j9 = 0 here: riddle i)
  jldi j13, 0
  jld j10, j13, NALL
  jwhile j10
    jld j1, j13, EJEM
    jsub j1, j9, j1
    jldi j2, 63
    jsar j1, j1, j2             ; -1: shown
    jcall ro_put
    jldi j1, 1
    jadd j9, j9, j1
    jsub j10, j10, j1
  jwend
  jret
ro_list:                        ; the list: bit i (mas) or 16 + i (menos)
  jldi j9, 0
  jld j10, j13, NALL
  jwhile j10
    jld j2, j13, OPC
    jldi j3, 6
    jsub j2, j2, j3
    jldi j3, 4
    jshl j2, j2, j3             ; 0 or 16
    jadd j2, j2, j9
    jld j1, j13, LISTA
    jshr j1, j1, j2
    jldi j2, 1
    jand j1, j1, j2
    jcall ro_put
    jldi j1, 1
    jadd j9, j9, j1
    jsub j10, j10, j1
  jwend
  jret

; Riddle j9 of ALLP to the shown ones if j1 is not 0, else to the asked ones. Uses j1-j8, j13 (keeps j9, j10).
ro_put:
  jldi j13, 0
  jldi j2, NTRAIN
  jldi j3, TRAIN
  jjnz j1, rp_shown
  jldi j2, NTEST
  jldi j3, TEST
rp_shown:
  jld j4, j2, 0
  jldi j5, 5
  jshl j6, j4, j5
  jadd j6, j6, j3               ; where it goes
  jshl j7, j9, j5               ; where it is
  jldi j5, 4
  jwhile j5
    jld j8, j7, ALLP
    jst j8, j6, 0
    jldi j8, 8
    jadd j6, j6, j8
    jadd j7, j7, j8
    jldi j8, 1
    jsub j5, j5, j8
  jwend
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j2, 0
  jret

; A size tried: side NN, mistakes MISS, kept in TRIED. Uses j1-j3.
tried:
  jldi j1, 0
  jld j2, j1, NTRIED
  jldi j3, 4
  jshl j3, j2, j3
  jld j1, j1, NN
  jst j1, j3, TRIED
  jldi j1, 0
  jld j1, j1, MISS
  jst j1, j3, TRIED + 8
  jldi j1, 0
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, NTRIED
  jret

; The school is born again with side j1 (order 5), and the will forgets what it learned: a room of what it learns built
; to the measure of n (the one before destroyed), its keys at the corners of the bottom face, its dice from the start.
; Uses j1-j14.
born_n:
  jldi j13, 0
  jst j1, j13, NN
  jmul j2, j1, j1
  jst j2, j13, N2
  jmul j3, j2, j1
  jst j3, j13, PP
  jld j4, j13, MAXS
  jadd j4, j4, j3
  jst j4, j13, TMAXW
  jld j2, j13, NACE             ; order 5: seed, side, quiet
  jldi j3, 24
  jshl j2, j2, j3
  jldi j3, 16
  jshl j4, j1, j3
  jor j2, j2, j4
  jld j4, j13, QUIET
  jldi j3, 8
  jshl j4, j4, j3
  jor j2, j2, j4
  jldi j3, 5
  jor j2, j2, j3
  jst j2, j13, WORD
  jcall say
  jcall hear                    ; how much room its tables need (0: it has enough). A child's request for memory would
  jldi j1, 0                    ; wait for this cabin's signature, so this cabin builds the room (request 2), moves it
  jld j11, j1, MAIL + 8         ; there (request 23) and says so
  jjz j11, bn_roomed
  jldi j10, 2
  jcall ask
  jldi j11, 0
  jadd j11, j11, j13
  jldi j10, 23
  jldi j1, 0
  jld j12, j1, CHILD
  jcall ask
  jldi j1, 0
  jst j1, j1, WORD
  jcall say
bn_roomed:
  jldi j13, 0                   ; the keys: dot (0,0) (1,0) (0,1); dash (m,0) (m-1,0) (m,1); end (0,m) (1,m) (0,m-1)
  jld j1, j13, NN
  jldi j2, 1
  jsub j3, j1, j2               ; m
  jst j13, j13, KEYP
  jst j2, j13, KEYP + 8
  jst j1, j13, KEYP + 16
  jst j3, j13, KEYP + 24
  jsub j4, j3, j2
  jst j4, j13, KEYP + 32
  jadd j4, j3, j1
  jst j4, j13, KEYP + 40
  jmul j4, j1, j3
  jst j4, j13, KEYP + 48
  jadd j5, j4, j2
  jst j5, j13, KEYP + 56
  jsub j4, j4, j1
  jst j4, j13, KEYP + 64
  jld j11, j13, RBASE           ; the room it had, destroyed (request 3)
  jjz j11, bn_fresh
  jldi j10, 3
  jldi j12, 0
  jcall ask
bn_fresh:
  jldi j13, 0                   ; what it learns: 9 words * TMAXW steps * n^2 pieces, a qword each; then the song heard
  jld j1, j13, TMAXW
  jld j2, j13, N2
  jmul j1, j1, j2
  jldi j2, 9
  jmul j2, j1, j2               ; counts
  jldi j3, 3
  jshl j3, j2, j3
  jadd j11, j3, j1
  jldi j4, 7
  jadd j11, j11, j4
  jldi j4, 0FFF8h
  jand j11, j11, j4
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, RBASE
  jadd j4, j13, j3
  jst j4, j1, STEPB
  jadd j1, j13, j1              ; nothing learned
  jwhile j2
    jldi j4, 0
    jst j4, j1, 0
    jldi j4, 8
    jadd j1, j1, j4
    jldi j4, 1
    jsub j2, j2, j4
  jwend
  jldi j1, 0
  jldi j2, 9
  jwhile j2
    jldi j3, 3
    jshl j3, j1, j3
    jldi j4, 0
    jst j4, j3, HEARD
    jldi j3, 1
    jadd j1, j1, j3
    jsub j2, j2, j3
  jwend
  jldi j1, 0                    ; its dice: seed * 7919 + 1
  jld j2, j1, NACE
  jldi j3, 7919
  jmul j2, j2, j3
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, SEED2
  jret

; It learns its words (the 9, or only the 6 numbers when the riddle is heard as a melody), RONDAS passes, knowing
; which it said: MISS = the ones it mistook in the last pass. Uses j1-j15.
learn_words:
  jldi j1, 0
  jld j15, j1, RONDAS
  jwhile j15
    jldi j1, 0
    jst j1, j1, MISS
    jst j1, j1, THING
    jld j9, j1, NWORDS
    jwhile j9
      jcall song
      jcall guess
      jldi j1, 0
      jld j2, j1, BEST
      jld j3, j1, THING
      jsub j2, j2, j3
      jjz j2, lw_right
      jld j2, j1, MISS
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, MISS
    lw_right:
      jcall learnw
      jldi j1, 0
      jld j2, j1, THING
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, THING
      jsub j9, j9, j3
    jwend
    jldi j1, 1
    jsub j15, j15, j1
  jwend
  jret

; It says THING and guesses what it heard (BEST); into the fingerprint: said * 16 + guess + 1 (0: nothing). Uses
; j1-j8, j10-j14 (keeps j9, j15).
hear_w:
  jcall song
  jcall guess
  jldi j1, 0
  jld j12, j1, THING
  jldi j2, 4
  jshl j12, j12, j2
  jld j2, j1, BEST
  jldi j3, 9
  jsub j3, j2, j3
  jjz j3, hw_none
  jldi j3, 1
  jadd j12, j12, j3
  jadd j12, j12, j2
hw_none:
  jcall mix
  jret

; The symbol in j2 into the fingerprint: 0 for nothing (9), else symbol + 1. Uses j3, j12-j14.
mixsym:
  jldi j12, 0
  jldi j3, 9
  jsub j3, j2, j3
  jjz j3, ms_none
  jldi j3, 1
  jadd j12, j2, j3
ms_none:
  jcall mix
  jret

; The most frequent of the 10 counts at j1 (words 0..8, then 9: nothing), the first if tied; 9 if all are 0 -> j2.
; Uses j1, j3-j6, j11.
most:
  jldi j2, 9
  jldi j3, 0                    ; the best count
  jldi j4, 0                    ; symbol
mo_lap:
  jldi j5, 10
  jsub j5, j4, j5
  jjz j5, mo_done
  jld j6, j1, 0
  jsub j5, j3, j6
  jldi j11, 63
  jsar j5, j5, j11
  jjz j5, mo_next               ; not more than the best
  jldi j3, 0
  jadd j3, j3, j6
  jldi j2, 0
  jadd j2, j2, j4
mo_next:
  jldi j5, 1
  jadd j4, j4, j5
  jldi j5, 8
  jadd j1, j1, j5
  jjmp mo_lap
mo_done:
  jret

; How many steps from the start of the song it knows to word j1 (1: the first) -> j2, 0 if it never gets there.
; Uses j1-j8.
walk_to:
  jadd j7, j1, j0
  jsub j7, j7, j0               ; the word looked for
  jldi j1, FIRST
  jcall most
  jldi j8, 1                    ; k
wt_lap:
  jldi j3, 9
  jsub j3, j2, j3
  jjz j3, wt_never
  jldi j3, 10
  jsub j3, j8, j3
  jjz j3, wt_never              ; k <= 9 words
  jsub j3, j2, j7
  jjz j3, wt_found
  jldi j3, 80
  jmul j1, j2, j3
  jldi j3, NEXT
  jadd j1, j1, j3
  jcall most
  jldi j3, 1
  jadd j8, j8, j3
  jjmp wt_lap
wt_found:
  jadd j2, j8, j0
  jsub j2, j2, j0
  jret
wt_never:
  jldi j2, 0
  jret

; The word j1 steps into the song (9: none) -> j2. Uses j1-j8.
word_at:
  jldi j2, 9
  jldi j3, 1
  jsub j3, j1, j3
  jldi j4, 63
  jsar j4, j3, j4
  jjnz j4, wa_done              ; k < 1
  jadd j8, j3, j0
  jsub j8, j8, j0               ; k - 1 steps more
  jldi j1, FIRST
  jcall most
wa_lap:
  jjz j8, wa_done
  jldi j3, 9
  jsub j3, j2, j3
  jjz j3, wa_done
  jldi j3, 80
  jmul j1, j2, j3
  jldi j3, NEXT
  jadd j1, j1, j3
  jcall most
  jldi j3, 1
  jsub j8, j8, j3
  jjmp wa_lap
wa_done:
  jret

; One song: the word THING as greetings, each with its key's pieces; a finger may slip (a throw mod 100 below DESLIZ:
; one of the 3 pieces, a throw mod 3, lands on one of its neighbors on the bottom face, a throw mod how many). Said as
; order 6; the school's answer (how many steps, then the top face of each as bits) into SLONG and STEPB. Uses j1-j8,
; j10-j14 (keeps j9, j15).
song:
  jldi j1, 0
  jld j2, j1, SENTN             ; a sentence (SENTN words at SENTL) is one song too; 0: the word THING
  jjnz j2, g_sent
  jld j2, j1, THING
  jst j2, j1, SENTL
  jldi j2, 1
g_sent:
  jst j2, j1, SNW
  jldi j2, 1
  jsub j2, j1, j2
  jst j2, j1, SWI               ; its word -1: none yet
  jst j1, j1, SCNT
  jst j1, j1, WSTART
  jldi j5, 0                    ; greeting k (of the whole song)
g_code:
  jldi j1, 0
  jld j2, j1, SCNT              ; this word done: the next one, or the end of the song
  jld j3, j1, WSTART
  jsub j4, j5, j3
  jsub j2, j4, j2
  jjnz j2, g_greet
  jld j2, j1, SWI
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, SWI
  jld j3, j1, SNW
  jsub j3, j2, j3
  jjz j3, g_coded
  jldi j3, 3
  jshl j3, j2, j3
  jld j2, j3, SENTL             ; the word
  jldi j3, 5
  jshl j8, j2, j3               ; WCODE offset of the word
  jldi j3, 3
  jshl j3, j2, j3
  jld j2, j3, WLEN
  jst j2, j1, SCNT              ; how many greetings
  jst j5, j1, WSTART
  jjmp g_code
g_greet:
  jadd j4, j8, j4
  jldb j6, j4, WCODE            ; its key
  jldi j3, 3
  jmul j4, j6, j3
  jshl j4, j4, j3               ; KEYP offset of the key
  jld j2, j4, KEYP
  jst j2, j1, CURKEY
  jld j2, j4, KEYP + 8
  jst j2, j1, CURKEY + 8
  jld j2, j4, KEYP + 16
  jst j2, j1, CURKEY + 16
  jld j2, j1, DESLIZ
  jjz j2, g_mask
  jcall rnd2                    ; does a finger slip?
  jldi j3, 100
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j4, j13, j4
  jldi j3, 0
  jld j2, j3, DESLIZ
  jsub j4, j4, j2
  jldi j3, 63
  jsar j4, j4, j3
  jjz j4, g_mask
  jcall rnd2                    ; which of the 3 pieces
  jldi j3, 3
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j7, j13, j4
  jshl j7, j7, j3               ; CURKEY offset
  jld j1, j7, CURKEY
  jldi j3, 0
  jld j10, j3, NN
  jdiv j4, j1, j10
  jmul j6, j4, j10
  jsub j6, j1, j6               ; x (j4 = y)
  jldi j2, 0                    ; its neighbors on the bottom face: +x, -x, +y, -y
  jldi j11, 1
  jsub j11, j10, j11            ; n - 1
  jsub j3, j6, j11
  jjz j3, g_nx1
  jldi j3, 1
  jadd j3, j1, j3
  jst j3, j2, NBL
  jldi j3, 8
  jadd j2, j2, j3
g_nx1:
  jjz j6, g_nx2
  jldi j3, 1
  jsub j3, j1, j3
  jst j3, j2, NBL
  jldi j3, 8
  jadd j2, j2, j3
g_nx2:
  jsub j3, j4, j11
  jjz j3, g_ny1
  jadd j3, j1, j10
  jst j3, j2, NBL
  jldi j3, 8
  jadd j2, j2, j3
g_ny1:
  jjz j4, g_ny2
  jsub j3, j1, j10
  jst j3, j2, NBL
  jldi j3, 8
  jadd j2, j2, j3
g_ny2:
  jldi j3, 3
  jshr j2, j2, j3               ; how many
  jcall rnd2                    ; which neighbor
  jdiv j4, j13, j2
  jmul j4, j4, j2
  jsub j4, j13, j4
  jldi j3, 3
  jshl j4, j4, j3
  jld j1, j4, NBL
  jst j1, j7, CURKEY
g_mask:
  jldi j3, 0                    ; the greeting's pieces in one word: 16 bits each
  jld j6, j3, CURKEY + 16
  jldi j4, 16
  jshl j6, j6, j4
  jld j2, j3, CURKEY + 8
  jor j6, j6, j2
  jshl j6, j6, j4
  jld j2, j3, CURKEY
  jor j6, j6, j2
  jldi j3, 3
  jshl j4, j5, j3
  jst j6, j4, SONGM
  jldi j3, 1
  jadd j5, j5, j3
  jjmp g_code
g_coded:
  jldi j1, 0                    ; order 6: how many, then each greeting
  jldi j3, 8
  jshl j2, j5, j3
  jldi j3, 6
  jor j2, j2, j3
  jst j2, j1, WORD
  jcall say
  jldi j4, 0
  jwhile j5
    jld j2, j4, SONGM
    jldi j1, 0
    jst j2, j1, WORD
    jcall say
    jldi j1, 8
    jadd j4, j4, j1
    jldi j1, 1
    jsub j5, j5, j1
  jwend
  jcall hear                    ; how many steps it lasted
  jldi j1, 0
  jld j2, j1, MAIL + 8
  jst j2, j1, SLONG
  jld j6, j1, N2                ; then its top faces: SLONG * n^2 bits, 64 per word
  jmul j6, j6, j2
  jld j7, j1, STEPB
  jldi j8, 0                    ; bits left in the word
  jwhile j6
    jjnz j8, s_bit
    jcall hear
    jldi j1, 0
    jld j2, j1, MAIL + 8
    jldi j8, 64
  s_bit:
    jldi j3, 1
    jand j4, j2, j3
    jstb j4, j7, 0
    jshr j2, j2, j3
    jadd j7, j7, j3
    jsub j8, j8, j3
    jsub j6, j6, j3
  jwend
  jret

; What it guesses: the word whose notes it heard most, as a share of all it heard for it (BEST, 9 if none). Uses
; j1-j8, j10-j14 (keeps j9, j15).
guess:
  jldi j1, 0
  jldi j2, 9
  jst j2, j1, BEST
  jst j1, j1, BSUM
  jldi j2, 1
  jst j2, j1, BTOT
  jldi j8, 0                    ; word g
gw_lap:
  jldi j1, 9
  jsub j1, j8, j1
  jjz j1, gw_done
  jldi j1, 3
  jshl j1, j8, j1
  jld j10, j1, HEARD            ; what it heard for g
  jjz j10, gw_next
  jldi j11, 0                   ; s
  jldi j1, 0
  jld j4, j1, TMAXW
  jld j5, j1, N2
  jmul j4, j4, j5
  jmul j4, j4, j8
  jldi j5, 3
  jshl j4, j4, j5
  jld j5, j1, RBASE
  jadd j4, j4, j5               ; what it learned of g
  jld j5, j1, STEPB
  jld j6, j1, SLONG
  jld j7, j1, N2
  jmul j6, j6, j7
  jwhile j6
    jldb j1, j5, 0
    jjz j1, gs_next
    jld j1, j4, 0
    jadd j11, j11, j1
  gs_next:
    jldi j1, 1
    jadd j5, j5, j1
    jsub j6, j6, j1
    jldi j1, 8
    jadd j4, j4, j1
  jwend
  jldi j1, 0                    ; better if s * BTOT > BSUM * heard
  jld j3, j1, BTOT
  jmul j3, j11, j3
  jld j2, j1, BSUM
  jmul j2, j2, j10
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, gw_next
  jst j8, j1, BEST
  jst j11, j1, BSUM
  jst j10, j1, BTOT
gw_next:
  jldi j1, 1
  jadd j8, j8, j1
  jjmp gw_lap
gw_done:
  jret

; It knows what it said (THING): it learns what that sounded like. Uses j1-j8, j10.
learnw:
  jldi j1, 0
  jld j8, j1, THING
  jld j4, j1, TMAXW
  jld j5, j1, N2
  jmul j4, j4, j5
  jmul j4, j4, j8
  jldi j5, 3
  jshl j4, j4, j5
  jld j5, j1, RBASE
  jadd j4, j4, j5
  jld j5, j1, STEPB
  jld j6, j1, SLONG
  jld j7, j1, N2
  jmul j6, j6, j7
  jldi j10, 0                   ; how many notes
  jwhile j6
    jldb j1, j5, 0
    jjz j1, gl_next
    jld j1, j4, 0
    jldi j2, 1
    jadd j1, j1, j2
    jst j1, j4, 0
    jadd j10, j10, j2
  gl_next:
    jldi j1, 1
    jadd j5, j5, j1
    jsub j6, j6, j1
    jldi j1, 8
    jadd j4, j4, j1
  jwend
  jldi j1, 3
  jshl j1, j8, j1
  jld j2, j1, HEARD
  jadd j2, j2, j10
  jst j2, j1, HEARD
  jret

; Its dice: seed2 = (seed2 * 1103515245 + 12345) mod 2^31 -> j13 = seed2 >> 16. Uses j14.
rnd2:
  jldi j13, 0
  jld j14, j13, SEED2
  jldi j13, 41C6h
  jshi j13, 4E6Dh
  jmul j14, j14, j13
  jldi j13, 3039h
  jadd j14, j14, j13
  jldi j13, 7FFFh
  jshi j13, 0FFFFh
  jand j14, j14, j13
  jldi j13, 0
  jst j14, j13, SEED2
  jldi j13, 16
  jshr j13, j14, j13
  jret

; The text at j1 (ended by a 0) at TEXT + POS. Uses j1-j3 (j1 = 0 after).
puts:
  jldi j3, 0
  jld j2, j3, POS
pu_lap:
  jldb j3, j1, 0
  jjz j3, pu_done
  jstb j3, j2, TEXT
  jldi j3, 1
  jadd j1, j1, j3
  jadd j2, j2, j3
  jjmp pu_lap
pu_done:
  jldi j1, 0
  jst j2, j1, POS
  jret

; The character j2 at TEXT + POS. Uses j1, j3.
putch:
  jldi j1, 0
  jld j3, j1, POS
  jstb j2, j3, TEXT
  jldi j1, 1
  jadd j3, j3, j1
  jldi j1, 0
  jst j3, j1, POS
  jret

; j2 (0 or more) in decimal at TEXT + POS. Uses j1-j4 (j1 = 0 after).
putnum:
  jldi j3, 0                    ; its digits, last first
pn_digit:
  jldi j1, 10
  jdiv j4, j2, j1
  jmul j1, j4, j1
  jsub j1, j2, j1
  jldi j2, 30h
  jadd j1, j1, j2
  jstb j1, j3, DIG
  jldi j1, 1
  jadd j3, j3, j1
  jadd j2, j4, j0
  jsub j2, j2, j0
  jjnz j2, pn_digit
  jldi j1, 0
  jld j4, j1, POS
pn_put:
  jldi j1, 1
  jsub j3, j3, j1
  jldb j2, j3, DIG
  jstb j2, j4, TEXT
  jadd j4, j4, j1
  jjnz j3, pn_put
  jldi j1, 0
  jst j4, j1, POS
  jret

; One request through the window: kind j10, a = j11, b = j12 -> j13 = its answer. Uses j14.
ask:
  jldi j14, 1
  jldi j13, 0
  jst j14, j13, QUEUE
  jst j10, j13, QUEUE + 8
  jst j11, j13, QUEUE + 16
  jst j12, j13, QUEUE + 24
  jldi j14, QUEUE
  jsys j14, j14
  jldi j13, 0
  jld j13, j13, QUEUE + 32
  jret

; The next letter from its mailbox (request 31) into MAIL; while it is empty it sleeps until the doorbell (29), and
; looks again. If nobody is left who could greet it, it ends. Uses j1, j10-j14.
hear:
  jldi j10, 31
  jldi j11, MAIL
  jldi j12, 16
  jcall ask
  jldi j1, 1
  jsub j1, j13, j1
  jjz j1, h_got
  jldi j10, 29
  jcall ask
  jldi j1, 1                    ; nobody is left who could greet it (-1): waiting again would spin for nothing
  jadd j1, j13, j1
  jjz j1, h_alone
  jjmp hear
h_got:
  jret
h_alone:
  jhalt

; Says WORD to the school (request 30). Uses j10-j14.
say:
  jldi j13, 0
  jld j12, j13, WORD
  jldi j10, 30
  jld j11, j13, CHILD
  jcall ask
  jret

; j0 = (j0 * 31 + j12) mod 2^48. Uses j13, j14.
mix:
  jldi j13, 31
  jmul j0, j0, j13
  jadd j0, j0, j12
  jldi j13, 0
  jld j14, j13, M48
  jand j0, j0, j14
  jret
