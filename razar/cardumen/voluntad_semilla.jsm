; The cube practices the seed (Capitan, 2026-11-08: "put the cube to practice the seed, with rounds and size that
; grow"; "remember when we reached 100%: it got better with the runs, and there it did depend on the cube's size").
; The will (this cabin) with the school as its child (cardumen_cubo.jsm), the two talking in words, as in
; voluntad_juego.jsm:
;   - the frames (the house's "marcos", memoria_pares.jsm with "semilla"): by question of the book and sentence that
;     says a word of it, the five words around the first place of what the question is about in it, as tokens, and
;     whether the sentence is of its answer, and whether its question is read;
;   - each token is said by pressing 3 pieces of the bottom face, chosen by its own dice at first: its invented word;
;     a frame is a song of five greetings, and the school sings it with its waves crossing;
;   - the will reads in the melody whether it answers (for each of the two, the share of times each top piece woke at
;     each step when that was so: it knows it, so it learns every round), drawn half of each so that "no", nineteen
;     times more common, is not all it learns;
;   - right: it sings that frame once more (the school settles it). Wrong: one piece of one of its five words moves.
; Then each question it never read is asked, without anyone learning (the song only heard): of its sentences, the one
; whose melody says "it answers" the most (its share minus that of "it does not") is its answer, right when it is of
; its answer. Its parameters are the file "p" (8 qwords): the seed, the side n, the rounds, 1 if the school is quiet
; (it never learns), 1 if a round is a pass (Capitan, 2026-11-08: "every round already has the examples of
; everything": each frame that answers once, in order, each followed by one that does not, drawn), 1 if the
; kernel remembers (memorize, recall), how many times it hears every read frame, learning, before it remembers, 1 if the school keeps each
; piece's total (cardumen_cubo.jsm, bit 9). Its dice: seed2 = seed * 7919 + 1, seed2 = (seed2 * 1103515245 + 12345) mod 2^31, a throw is
; seed2 >> 16. It writes how it went.
;
; Its initial data (voluntad_semilla.datos): the texts, one every 40h bytes.
S_SEM  = 0
S_N    = 40h
S_VUEL = 80h
S_QUIETO = 0C0h
S_PRACT = 100h
S_PCT  = 140h
S_SINL = 180h
S_DE   = 1C0h
S_AZAR = 200h
S_MARC = 240h
S_MEMO = 280h
S_CONS = 2C0h
S_REPS = 300h
S_FUERA = 340h
S_TECHO = 380h
S_UNA1 = 3C0h
S_UNA2 = 400h
S_UNA3 = 440h
S_UNA4 = 480h
S_UNA5 = 4C0h
S_CURVA = 500h
S_CORTE = 540h
S_CONT = 580h
S_MAL  = 5C0h
S_NOSE = 600h
S_NOSER = 640h
; Room 0 (4000h bytes):
QUEUE = 1000h                   ; its window: one request
PLAB  = 1040h                   ; "p", the parameters file
HIJO  = 1048h                   ; "hijo"
MLAB  = 1050h                   ; "marcos"
NACE  = 1080h                   ; the parameters (4 qwords)
NN    = 1088h
VUELTAS = 1090h
QUIET = 1098h
PASADA = 10A0h                  ; 1: a round is a pass over every read frame that answers, each one followed by one that
VEFF  = 10E0h                   ; does not (drawn): the rounds that makes
MEMO  = 10A8h                   ; 1: the kernel's memory (memorize, recall): the school only hears
REPS  = 10B0h                   ; before remembering, the school hears every read frame this many times, learning
CONSV = 10B8h                   ; 1: the school keeps each piece's total (born with bit 9)
UNA   = 10C0h                   ; a question plus one: only that one is asked, and what it chose is said
VER   = 10C8h                   ; 1: every question asked says how alike its winner was to what it remembers
PRECIO = 10D0h                  ; the price plus one: how many questions it read and answers right it accepts to stop
                                ; answering, so that it can say "I do not know" (0: it always answers)
HOWA  = 10E8h                   ; what the school said of itself (order 7): off their total; at the ceiling, all
HOWB  = 10F0h
M48   = 1100h                   ; 2^48 - 1
SEED2 = 1108h                   ; its dice
CHILD = 1110h                   ; the school's number
SLONG = 1130h                   ; how many steps the song lasted
WORD  = 1138h                   ; the word it is saying
MAIL  = 1140h                   ; a letter read from its mailbox: who said it, the word
N2    = 1150h                   ; n^2: a face
PP    = 1158h                   ; n^3
TMAXW = 1160h                   ; the most steps a song of 5 greetings can last: 5 + n^3
RBASE = 1168h                   ; its room of what it learned
STEPB = 1170h                   ; the song heard, in that room: top piece j at step t at STEPB + t*n^2 + j
POS   = 1178h                   ; how long the text it writes is so far
LABEL = 1180h                   ; the frame being sung: 1 if it answers
HITS  = 1188h                   ; right in the last quarter of the rounds, and rounds in it
TAILN = 1190h
CUR   = 1198h                   ; the frame being sung (its address)
ROUND = 11A0h                   ; the round
DIG   = 11A8h                   ; digits of a number being written (24 bytes)
FB    = 11C8h                   ; the file of frames: its bytes, how many, its room, a handle
FN    = 11D0h
FC    = 11D8h
FH    = 11E0h
ITB   = 11E8h                   ; the frames: {seed, sentence, answers, read, t1..t5} (72 bytes), how many
ITN   = 11F0h
NTOK  = 11F8h                   ; tokens: how many; their words at SAYB (token t, piece j at SAYB + (t*3 + j)*8)
SAYB  = 1200h
POSL  = 1208h                   ; the read frames that answer, and those that do not (their numbers), how many
POSN  = 1210h
NEGL  = 1218h
NEGN  = 1220h
ONLY  = 1228h                   ; 1: the song only heard (asked: nobody learns)
GQ    = 1230h                   ; asking: the question, its best share, its best's answer, frames, right ones
GBS   = 1238h
GBL   = 1240h
GFN   = 1248h
GFP   = 1250h
QASK  = 1258h                   ; questions asked, right, chance (1000ths summed)
QRIGHT = 1260h
QCH   = 1268h
SC1   = 1270h                   ; (a share)
TA    = 1278h                   ; (walking)
TB    = 1280h
TC    = 1288h
TD    = 1290h
TE    = 1298h
HEARD = 1300h                   ; notes heard for each answer, in all (2 qwords)
NTB   = 1310h                   ; the kernel's memory: the notes, how many, room for how many; by frame {its first
NTN   = 1318h                   ; note, how many, whether it answers}, how many; by note where its frames start
NTC   = 1320h                   ; (PCNT) and the frames (PST); note places; by frame a counter, the ones touched
FRB   = 1328h
FRN   = 1330h
PCNT  = 1338h
PST   = 1340h
NID   = 1348h
CNT   = 1350h
TCH   = 1358h
TCN   = 1360h
BPOS  = 1368h                   ; recalling: the most alike that answered, that did not; the song's notes
BNEG  = 1370h
QNC   = 1378h
FNB   = 1380h                   ; the whole sentence's notes ("N:" lines): all of them, how many; by frame {its
FNBN  = 1388h                   ; first, how many} (ITX); the biggest note
ITX   = 1390h
FNMAX = 1398h
SGN   = 13A0h                   ; the song being said: how many greetings
GBI   = 13A8h                   ; asking: the sentence of its best frame, how alike it was to the most alike that answered
GBP   = 13B0h
SELF  = 13B8h                   ; 1: it asks itself what it read, each question with its own frames left out
LOOB  = 13C0h                   ; what it asked itself: by question {how alike its winner, right}, how many
LOON  = 13C8h
THR   = 13D0h                   ; the cut: below it, "I do not know" (0: none)
QABS  = 13D8h                   ; asked: it said it does not know, of them right had it answered; answered wrong
QABSR = 13E0h
QWRONG = 13E8h
SONGM = 2000h                   ; the song being said: the pieces of each greeting (a qword each, 255 at most)
TEXT  = 3000h                   ; the line it writes
include '../../escalon0/janax.inc'
jfirst j1, 4000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jst j2, j2, POS
jldi j0, 0                      ; the fingerprint

jldi j1, 0                      ; its parameters: open "p" (request 4) and read 32 bytes (request 5)
jldi j2, 70h
jst j2, j1, PLAB
jldi j10, 4
jldi j11, PLAB
jldi j12, 1
jcall ask
jldi j1, 32
jshl j10, j13, j1
jldi j1, 5
jor j10, j10, j1
jldi j11, NACE
jldi j12, 88
jcall ask

jcall0 j1, frames               ; the frames, read (before the school is born: nothing to say to it yet) ; "hijo" = 68 69 6A 6F, launched with every right

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
jcall0 j1, ask
jst j13, j1, CHILD

jldi j13, 0                     ; the school is born (order 5: seed, side, quiet) and asks for the room its tables need
jld j1, j13, NN
jmul j2, j1, j1
jst j2, j13, N2
jmul j3, j2, j1
jst j3, j13, PP
jldi j4, 5                      ; (5 greetings; with MEMO 4 up to 255, the most a song may last: 256 + n^3)
jld j5, j13, MEMO
jldi j6, 4
jsub j5, j5, j6
jjnz j5, b_tmax
jldi j4, 256
b_tmax:
jadd j4, j4, j3
jst j4, j13, TMAXW
jld j2, j13, NACE
jldi j3, 24
jshl j2, j2, j3
jldi j3, 16
jshl j4, j1, j3
jor j2, j2, j4
jld j4, j13, QUIET
jldi j3, 8
jshl j4, j4, j3
jor j2, j2, j4
jld j4, j13, CONSV
jldi j3, 9
jshl j4, j4, j3
jor j2, j2, j4
jldi j3, 5
jor j2, j2, j3
jst j2, j13, WORD
jcall say
jcall0 j1, hear                 ; how much room its tables need: this cabin builds it (request 2), moves it there ; (request 23) and says so
jld j11, j1, MAIL + 8
jjz j11, b_roomed
jldi j10, 2
jcall0 j11, ask
jadd j11, j11, j13
jldi j10, 23
jldi j1, 0
jld j12, j1, CHILD
jcall0 j1, ask
jst j1, j1, WORD
jcall say
b_roomed:

jldi j13, 0                     ; what it learns: 2 answers * TMAXW steps * n^2 pieces, a qword each; then the song heard
jld j1, j13, TMAXW
jld j2, j13, N2
jmul j1, j1, j2
jldi j2, 2
jmul j2, j1, j2
jldi j3, 3
jshl j3, j2, j3
jadd j11, j3, j1
jldi j4, 7
jadd j11, j11, j4
jldi j4, 0FFF8h
jand j11, j11, j4
jldi j10, 2
jcall0 j1, ask
jst j13, j1, RBASE
jadd j4, j13, j3
jst j4, j1, STEPB
jadd j1, j13, j1                ; nothing learned
jwhile j2
  jldi j4, 0
  jst j4, j1, 0
  jldi j4, 8
  jadd j1, j1, j4
  jldi j4, 1
  jsub j2, j2, j4
jwend
jldi j1, 0
jst j1, j1, HEARD
jst j1, j1, HEARD + 8
jld j2, j1, NACE                ; its dice: seed * 7919 + 1
jldi j3, 7919
jmul j2, j2, j3
jldi j3, 1
jadd j2, j2, j3
jst j2, j1, SEED2

jldi j1, 0                      ; (with MEMO 4 every note of the sentences is a word: as many as the biggest note needs)
jld j2, j1, MEMO
jldi j3, 4
jsub j2, j2, j3
jjnz j2, w_ntok
jld j2, j1, FNMAX
jldi j3, 1
jadd j2, j2, j3
jld j3, j1, NTOK
jsub j3, j3, j2
jldi j4, 63
jsar j3, j3, j4
jjz j3, w_ntok
jst j2, j1, NTOK
w_ntok:
jldi j1, 0                      ; its invented words: 3 distinct pieces of the bottom face each, by dice
jld j11, j1, NTOK
jldi j2, 24
jmul j11, j11, j2
jldi j2, 8
jadd j11, j11, j2
jldi j10, 2
jcall0 j1, ask
jst j13, j1, SAYB
jldi j9, 0
jwhile j1
w_draw:
  jcall0 j1, rnd2
  jld j2, j1, N2
  jdiv j3, j13, j2
  jmul j3, j3, j2
  jsub j3, j13, j3              ; a piece
  jldi j4, 3                    ; not one this word has already
  jdiv j5, j9, j4
  jmul j5, j5, j4
jwhile j6
  jld j7, j1, SAYB
  jldx j6, j7, j5
  jsub j6, j6, j3
  jjz j6, w_draw
  jldi j6, 1
  jadd j5, j5, j6
jwcheck
  jsub j6, j5, j9
jwend
w_take:
  jldi j6, 3
  jshl j6, j9, j6
  jld j7, j1, SAYB
  jadd j6, j6, j7
  jst j3, j6, 0
  jldi j6, 1
  jadd j9, j9, j6
jwcheck
jldi j1, 0
jld j2, j1, NTOK
jldi j3, 3
jmul j2, j2, j3
jsub j1, j9, j2
jwend
w_done:

jldi j1, 0                      ; it practices: VUELTAS rounds, a read frame each, half that answer, half not
jst j1, j1, HITS
jst j1, j1, TAILN
jst j1, j1, ROUND
jst j1, j1, ONLY
jld j2, j1, VUELTAS             ; (passes: each two frames per one that answers)
jld j3, j1, PASADA
jjz j3, p_eff
jld j3, j1, POSN
jadd j3, j3, j3
jmul j2, j2, j3
p_eff:
jst j2, j1, VEFF
jwhile j3
  jld j2, j1, POSN
  jjz j2, p_done
  jld j2, j1, NEGN
  jjz j2, p_done
  jld j2, j1, PASADA
  jjz j2, p_draw
  jld j2, j1, ROUND             ; a pass: even rounds the next one that answers, in order; odd ones, one that does not
  jldi j3, 1
  jand j3, j2, j3
  jjnz j3, p_odd
  jshr j2, j2, j3
  jldi j3, 1
  jshr j2, j2, j3
  jld j4, j1, POSN
  jdiv j5, j2, j4
  jmul j5, j5, j4
  jsub j3, j2, j5
  jld j5, j1, POSL
  jldx j3, j5, j3
  jjmp p_frame
p_odd:
  jldi j2, 0
  jjmp p_side
p_draw:
  jcall0 j1, rnd2               ; which of the two
  jldi j2, 1
  jand j2, j13, j2
p_side:
  jldi j3, POSL
  jldi j4, POSN
  jjnz j2, p_list
  jldi j3, NEGL
  jldi j4, NEGN
p_list:
  jld j5, j3, 0
  jld j6, j4, 0
  jst j5, j1, TE
  jst j6, j1, TA
  jcall0 j1, rnd2
  jld j6, j1, TA
  jdiv j3, j13, j6
  jmul j3, j3, j6
  jsub j3, j13, j3
  jld j5, j1, TE                ; the frame's number
  jldx j3, j5, j3
p_frame:
  jldi j1, 0
  jldi j4, 72
  jmul j3, j3, j4
  jld j4, j1, ITB
  jadd j3, j3, j4
  jst j3, j1, CUR
  jcall sing
  jcall0 j1, share              ; -> j2 its "it answers" minus "it does not"
  jldi j3, 63                   ; guessed: it answers when more than not
  jsar j3, j2, j3
  jldi j4, 1
  jadd j3, j3, j4               ; (1 if j2 >= 0)
  jjnz j2, p_g
  jldi j3, 0                    ; (a tie, or nothing heard: it does not)
p_g:
  jst j3, j1, TB
  jcall0 j1, learn
  jld j12, j1, TB
  jcall0 j1, mix                ; the last quarter: rounds * 4 >= VUELTAS * 3
  jld j2, j1, ROUND
  jldi j3, 4
  jmul j2, j2, j3
  jld j3, j1, VEFF
  jldi j4, 3
  jmul j3, j3, j4
  jsub j2, j2, j3
  jldi j4, 63
  jsar j2, j2, j4
  jst j2, j1, TC         ; (-1: not in it)
  jjnz j2, p_judge
  jldi j2, 1
  jldadd j2, j1, TAILN
p_judge:
  jld j2, j1, TB
  jld j3, j1, LABEL
  jsub j2, j2, j3
  jjnz j2, p_wrong
  jld j2, j1, TC
  jjnz j2, p_again
  jld j2, j1, HITS
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, HITS
p_again:
  jcall sing                    ; right: sung once more, the school settles it
  jjmp p_next
p_wrong:                        ; wrong: one piece of one of its five words moves
  jcall rnd2
  jldi j3, 5
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j4, j13, j4              ; which of the five
  jldi j1, 0
  jld j5, j1, CUR
  jldi j3, 3
  jshl j6, j4, j3
  jadd j6, j6, j5
  jld j7, j6, 32                ; its token
  jldi j3, 3
  jmul j7, j7, j3               ; its first slot
  jst j7, j1, WORD
  jcall rnd2                    ; which of its 3 pieces
  jldi j3, 3
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j4, j13, j4
  jldi j1, 0
  jld j7, j1, WORD
  jadd j7, j7, j4
  jst j7, j1, WORD
p_place:
  jcall0 j1, rnd2               ; its new place: not one the word has
  jld j2, j1, N2
  jdiv j3, j13, j2
  jmul j3, j3, j2
  jsub j3, j13, j3
  jld j7, j1, WORD
  jldi j4, 3
  jdiv j5, j7, j4
  jmul j5, j5, j4
  jldi j6, 3
p_check:
  jld j9, j1, SAYB
  jldx j8, j9, j5
  jsub j8, j8, j3
  jjz j8, p_place
  jldi j8, 1
  jadd j5, j5, j8
  jsub j6, j6, j8
  jjnz j6, p_check
  jldi j8, 3
  jshl j8, j7, j8
  jld j9, j1, SAYB
  jadd j8, j8, j9
  jst j3, j8, 0
p_next:
  jldi j1, 0
  jldi j2, 1
  jldadd j2, j1, ROUND
jwcheck
  jldi j1, 0
  jld j2, j1, ROUND
  jld j3, j1, VEFF
  jsub j3, j2, j3
jwend
p_done:

jldi j1, 0
jld j2, j1, MEMO
jjz j2, p_nomemo
jcall memorize
p_nomemo:
jldi j1, 0
jst j1, j1, THR
jst j1, j1, QABS
jst j1, j1, QABSR
jst j1, j1, QWRONG
jld j2, j1, PRECIO
jjz j2, p_noself
jcall selftest
p_noself:
jcall0 j1, asked                ; the questions it never read

jld j12, j1, HITS
jcall mix
jld j12, j1, QRIGHT
jcall0 j1, mix                  ; how the school is (order 7): pieces off their total, weights at the ceiling
jldi j2, 7
jst j2, j1, WORD
jcall say
jcall0 j1, hear
jld j2, j1, MAIL + 8
jst j2, j1, HOWA
jcall0 j1, hear
jld j2, j1, MAIL + 8
jst j2, j1, HOWB
jldi j1, 0                      ; the school ends (order 3: it says its fingerprint, not mixed here)
jldi j2, 3
jst j2, j1, WORD
jcall say
jcall hear

jldi j1, S_SEM                  ; how it went
jcall puts
jld j2, j1, NACE
jcall putnum
jldi j1, S_N
jcall puts
jld j2, j1, NN
jcall putnum
jldi j1, S_VUEL
jcall puts
jld j2, j1, VUELTAS
jcall putnum
jld j2, j1, QUIET
jjz j2, o_quiet
jldi j1, S_QUIETO
jcall puts
o_quiet:
jldi j1, 0
jld j2, j1, MEMO
jjz j2, o_memo
jldi j1, S_MEMO
jcall puts
o_memo:
jldi j1, 0
jld j2, j1, CONSV
jjz j2, o_cons
jldi j1, S_CONS
jcall puts
o_cons:
jldi j1, 0
jld j2, j1, REPS
jjz j2, o_reps
jldi j1, S_REPS
jcall puts
jld j2, j1, REPS
jcall putnum
o_reps:
jldi j1, S_FUERA
jcall puts
jld j2, j1, HOWA
jcall putnum
jldi j1, S_TECHO
jcall puts
jld j2, j1, HOWB                ; at the ceiling, in percent of all
jldi j3, 32
jshr j2, j2, j3
jldi j3, 100
jmul j2, j2, j3
jld j3, j1, HOWB                ; (all: its low 32 bits)
jldi j4, 32
jshl j3, j3, j4
jshr j3, j3, j4
jjz j3, o_t0
jdiv j2, j2, j3
o_t0:
jcall putnum
jldi j2, 37
jldi j1, 0
jld j4, j1, POS
jstb j2, j4, TEXT
jldi j3, 1
jadd j4, j4, j3
jst j4, j1, POS
jldi j1, S_MARC
jcall puts
jld j2, j1, ITN
jcall putnum
jldi j1, S_PRACT
jcall0 j1, puts
jld j2, j1, HITS
jldi j3, 100
jmul j2, j2, j3
jld j3, j1, TAILN
jjz j3, o_nop
jdiv j2, j2, j3
o_nop:
jcall putnum
jldi j1, S_PCT
jcall puts
jld j2, j1, QRIGHT
jcall putnum
jldi j1, S_DE
jcall puts
jld j2, j1, QASK
jcall putnum
jld j2, j1, PRECIO
jjz j2, o_noprecio
jldi j1, S_CORTE
jcall puts
jld j2, j1, THR
jcall putnum
jldi j1, S_CONT
jcall puts
jld j2, j1, QASK
jcall putnum
jldi j1, S_MAL
jcall puts
jld j2, j1, QWRONG
jcall putnum
jldi j1, S_NOSE
jcall puts
jld j2, j1, QABS
jcall putnum
jldi j1, S_NOSER
jcall puts
jld j2, j1, QABSR
jcall putnum
o_noprecio:
jldi j1, S_AZAR
jcall puts
jld j2, j1, QCH                 ; chance: the part of a question's frames that answer, summed, in 1000ths
jldi j3, 10
jdiv j2, j2, j3
jld j3, j1, QASK
jjz j3, o_noch
jdiv j2, j2, j3
o_noch:
jcall0 j1, putnum
jld j4, j1, POS
jldi j2, 37
jstb j2, j4, TEXT
jldi j2, 41
jstb j2, j4, TEXT + 1
jldi j2, 10
jstb j2, j4, TEXT + 2
jldi j2, 3
jadd j4, j4, j2
jst j4, j1, POS
jldi j10, 1
jldi j11, TEXT
jldi j1, 0
jld j12, j1, POS
jcall ask
jhalt

; The frames: the house's "marcos" read whole (a room that doubles while it has more), then each "M:" line's nine
; numbers into ITB (ITN), the tokens counted (NTOK), and the read ones by what they say (POSL, NEGL). Uses j1-j14.
frames:
  jldi j1, 0
  jldi j2, 736Fh                ; "marcos" = 6D 61 72 63 6F 73
  jshi j2, 6372h
  jshi j2, 616Dh
  jst j2, j1, MLAB
  jldi j10, 4
  jldi j11, MLAB
  jldi j12, 6
  jcall0 j1, ask
  jst j13, j1, FH
  jst j1, j1, FN
  jldi j11, 1
  jldi j2, 16
  jshl j11, j11, j2
  jst j11, j1, FC
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, FB
  jwhilez j3
    jld j11, j1, FC
    jadd j11, j11, j11
    jldi j10, 2
    jcall0 j1, ask
    jld j3, j1, FB
    jld j4, j1, FN
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
    fr_moved:
    jst j13, j1, FB
    jld j2, j1, FC
    jadd j2, j2, j2
    jst j2, j1, FC
  jwcheck
    jldi j1, 0
    jld j10, j1, FH
    jldi j2, 32
    jshl j10, j10, j2
    jldi j2, 5
    jor j10, j10, j2
    jld j11, j1, FB
    jld j2, j1, FN
    jadd j11, j11, j2
    jld j12, j1, FC
    jsub j12, j12, j2
    jcall0 j1, ask
    jldi j2, 63
    jsar j2, j13, j2
    jldi j3, -1
    jxor j2, j2, j3
    jand j13, j13, j2
    jld j2, j1, FN
    jadd j2, j2, j13
    jst j2, j1, FN
    jld j3, j1, FC
    jsub j3, j2, j3
  jwend
fr_close:
  jld j10, j1, FH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall0 j1, ask                ; the frames' rooms: a frame takes ten bytes of the file at least
  jld j11, j1, FN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 80
  jadd j11, j11, j2
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, ITB
  jld j11, j1, FN               ; (the notes: two bytes of the file each at least; by frame 16 bytes)
  jldi j2, 2
  jshl j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, FNB
  jld j11, j1, FN
  jldi j2, 32
  jadd j11, j11, j2
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, ITX
  jst j1, j1, FNBN
  jst j1, j1, FNMAX
  jst j1, j1, ITN
  jst j1, j1, NTOK
  jld j9, j1, FB                ; walking the file: j9 where, j10 bytes left
  jld j10, j1, FN
  jwhile j10
    jldb j2, j9, 0
    jldi j3, 78
    jsub j3, j2, j3
    jjz j3, fr_nline
    jldi j3, 77
    jsub j3, j2, j3
    jjnz j3, fr_skip
    jldb j2, j9, 1
    jldi j3, 58
    jsub j3, j2, j3
    jjnz j3, fr_skip
    jldi j1, 0                  ; an "M:" line: its nine numbers
    jld j2, j1, ITN
    jldi j3, 72
    jmul j2, j2, j3
    jld j3, j1, ITB
    jadd j11, j2, j3            ; j11 where its numbers go
    jldi j12, 0                 ; numbers read
    jldi j2, 2
    jadd j9, j9, j2
    jsub j10, j10, j2
    jwhile j2
      jwhile j10
        jldb j2, j9, 0
        jldi j3, 48
        jsub j3, j2, j3
        jldi j4, 63
        jsar j4, j3, j4
        jjnz j4, fr_spn
        jldi j4, 10
        jsub j4, j3, j4
        jldi j5, 63
        jsar j4, j4, j5
        jjnz j4, fr_dig
      fr_spn:
        jldi j2, 1
        jadd j9, j9, j2
        jsub j10, j10, j2
      jwend
      jjmp fr_parsed
    fr_dig:
      jldi j6, 0
      jwhile j10
        jldb j2, j9, 0
        jldi j3, 48
        jsub j3, j2, j3
        jldi j4, 63
        jsar j4, j3, j4
        jjnz j4, fr_dd
        jldi j4, 10
        jsub j4, j3, j4
        jldi j5, 63
        jsar j4, j4, j5
        jjz j4, fr_dd
        jldi j4, 10
        jmul j6, j6, j4
        jadd j6, j6, j3
        jldi j2, 1
        jadd j9, j9, j2
        jsub j10, j10, j2
      jwend
    fr_dd:
      jldi j3, 3
      jshl j3, j12, j3
      jadd j3, j3, j11
      jst j6, j3, 0
      jldi j3, 4                ; a token: one more than the biggest seen
      jsub j3, j12, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, fr_nn
      jldi j1, 0
      jld j3, j1, NTOK
      jldi j4, 1
      jadd j4, j6, j4
      jsub j3, j3, j4
      jldi j5, 63
      jsar j3, j3, j5
      jjz j3, fr_nn
      jst j4, j1, NTOK
    fr_nn:
      jldi j2, 1
      jadd j12, j12, j2
    jwcheck
      jldi j2, 9
      jsub j2, j12, j2
    jwend
  fr_got:
    jldi j1, 0
    jldi j2, 1
    jldadd j2, j1, ITN
  fr_nline:                     ; an "N:" line: the notes of the last "M:" frame (its four numbers again, how many, them)
    jldb j2, j9, 1
    jldi j3, 58
    jsub j3, j2, j3
    jjnz j3, fr_skip
    jldi j2, 2
    jadd j9, j9, j2
    jsub j10, j10, j2
    jldi j12, 0
    fr_nh:
      jcall fr_getnum
      jjz j2, fr_skip
      jldi j3, 1
      jadd j12, j12, j3
      jldi j3, 5
      jsub j3, j12, j3
      jjnz j3, fr_nh
    jldi j1, 0                  ; j6: how many
    jld j2, j1, ITN
    jjz j2, fr_skip
    jldi j3, 1
    jsub j2, j2, j3
    jldi j3, 4
    jshl j2, j2, j3
    jld j3, j1, ITX
    jadd j11, j2, j3
    jld j2, j1, FNBN
    jst j2, j11, 0
    jst j1, j11, 8
    jadd j12, j6, j1
    jwhile j12
      jcall fr_getnum
      jjz j2, fr_skip
      jldi j1, 0
      jld j2, j1, FNBN
      jldi j3, 3
      jshl j3, j2, j3
      jld j4, j1, FNB
      jadd j3, j3, j4
      jst j6, j3, 0
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, FNBN
      jld j2, j11, 8
      jadd j2, j2, j3
      jst j2, j11, 8
      jld j2, j1, FNMAX
      jsub j2, j2, j6
      jldi j3, 63
      jsar j2, j2, j3
      jjz j2, fr_nm
      jst j6, j1, FNMAX
    fr_nm:
      jldi j2, 1
      jsub j12, j12, j2
    jwend
  fr_skip:                      ; to the next line
    jjz j10, fr_parsed
    jldb j2, j9, 0
    jldi j3, 1
    jadd j9, j9, j3
    jsub j10, j10, j3
    jldi j3, 10
    jsub j2, j2, j3
    jjnz j2, fr_skip
  jwend
fr_parsed:
  jldi j1, 0                    ; the read ones, by what they say
  jld j11, j1, ITN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jst j11, j1, TE
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, POSL
  jld j11, j1, TE
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, NEGL
  jst j1, j1, POSN
  jst j1, j1, NEGN
  jldi j9, 0
  jwhile j2
    jldi j3, 72
    jmul j3, j9, j3
    jld j4, j1, ITB
    jadd j3, j3, j4
    jld j4, j3, 24
    jjz j4, fr_sn               ; (its question left out)
    jld j4, j3, 16
    jldi j5, POSL
    jldi j6, POSN
    jjnz j4, fr_put
    jldi j5, NEGL
    jldi j6, NEGN
  fr_put:
    jld j7, j6, 0
    jldi j8, 3
    jshl j8, j7, j8
    jld j4, j5, 0
    jadd j8, j8, j4
    jst j9, j8, 0
    jldi j8, 1
    jadd j7, j7, j8
    jst j7, j6, 0
  fr_sn:
    jldi j2, 1
    jadd j9, j9, j2
  jwcheck
    jld j2, j1, ITN
    jsub j2, j9, j2
  jwend
fr_done:
  jret

; The next number on this line (j9, j10 bytes left) -> j6, j2 = 1 (0: the line ended; j9 at its line feed). Uses
; j2-j6.
fr_getnum:
  jwhile j10
    jldb j2, j9, 0
    jldi j3, 10
    jsub j3, j2, j3
    jjz j3, fgn_none
    jldi j3, 48
    jsub j3, j2, j3
    jldi j4, 63
    jsar j4, j3, j4
    jjnz j4, fgn_n
    jldi j4, 10
    jsub j4, j3, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, fgn_dig
  fgn_n:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jjmp fgn_none
fgn_dig:
  jldi j6, 0
  jwhile j10
    jldb j2, j9, 0
    jldi j3, 48
    jsub j3, j2, j3
    jldi j4, 63
    jsar j4, j3, j4
    jjnz j4, fgn_got
    jldi j4, 10
    jsub j4, j3, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, fgn_got
    jldi j4, 10
    jmul j6, j6, j4
    jadd j6, j6, j3
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
fgn_got:
  jldi j2, 1
  jret
fgn_none:
  jldi j2, 0
  jret

; Each question left out asked, its frames in a row (the file keeps them together): the song only heard, the one with
; the most "it answers" is its answer. Uses j1-j14.
asked:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, ONLY
  jst j1, j1, QASK
  jst j1, j1, QRIGHT
  jst j1, j1, QCH
  jldi j2, -1
  jst j2, j1, GQ
  jldi j9, 0
  jwhile j2
    jldi j3, 72
    jmul j3, j9, j3
    jld j4, j1, ITB
    jadd j3, j3, j4
    jld j4, j3, 24              ; (read: not asked; asking itself, only the read ones)
    jld j5, j1, SELF
    jsub j4, j4, j5
    jjnz j4, ak_next
    jld j4, j1, UNA             ; (only one, if asked so)
    jjz j4, ak_any
    jldi j5, 1
    jsub j4, j4, j5
    jld j5, j3, 0
    jsub j4, j4, j5
    jjnz j4, ak_next
  ak_any:
    jst j3, j1, CUR
    jld j4, j3, 0
    jld j5, j1, GQ
    jsub j5, j4, j5
    jjz j5, ak_same
    jst j9, j1, TD       ; a new question: the one before judged
    jcall0 j1, ak_judge
    jld j9, j1, TD
    jld j3, j1, CUR
    jld j4, j3, 0
    jst j4, j1, GQ
    jldi j2, 1
    jldi j5, 62
    jshl j2, j2, j5
    jldi j5, 0
    jsub j2, j5, j2
    jst j2, j1, GBS
    jst j1, j1, GBL
    jst j1, j1, GFN
    jst j1, j1, GFP
  ak_same:
    jst j9, j1, TD
    jcall sing
    jcall0 j1, judge
    jld j9, j1, TD
    jldi j3, 1
    jldadd j3, j1, GFN
    jld j3, j1, GFP
    jld j4, j1, LABEL
    jadd j3, j3, j4
    jst j3, j1, GFP
    jld j3, j1, GBS
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, ak_next             ; (the first of equals stays)
    jst j2, j1, GBS
    jld j2, j1, LABEL
    jst j2, j1, GBL
    jld j2, j1, CUR
    jld j2, j2, 8
    jst j2, j1, GBI
    jld j2, j1, BPOS
    jst j2, j1, GBP
  ak_next:
    jldi j2, 1
    jadd j9, j9, j2
  jwcheck
    jldi j1, 0
    jld j2, j1, ITN
    jsub j2, j9, j2
  jwend
ak_end:
  jjmp ak_judge

; The price (Capitan's other chat, 2026-11-08: "leaving each one out gives the distribution, not the cut; the cut comes
; out when you say what you will pay"): it asks itself every question it read, its own frames left out, and keeps how
; alike each winner was and whether it was right; the curve, for each cut, how many it would stop answering that it
; answered right and how many wrong ones it would not say; and the cut that loses PRECIO - 1 of the right ones: the
; how-alike of the PRECIO-th least alike right one. Uses j1-j14.
selftest:
  jldi j1, 0
  jld j11, j1, ITN
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, LOOB
  jst j1, j1, LOON
  jldi j2, 1
  jst j2, j1, SELF
  jld j2, j1, VER
  jst j2, j1, TE
  jst j1, j1, VER
  jcall0 j1, asked
  jst j1, j1, SELF
  jld j2, j1, TE
  jst j2, j1, VER
  jld j9, j1, LOON              ; sorted by how alike, least first (a few hundred at most: one by one)
  jldi j10, 1
  jwhile j2
    jldi j11, 4
    jshl j11, j10, j11
    jld j3, j1, LOOB
    jadd j11, j11, j3
    jld j5, j11, 0
    jld j6, j11, 8
    jwhile j3
      jldi j3, 16
      jsub j12, j11, j3
      jld j7, j12, 0
      jsub j8, j5, j7
      jldi j3, 63
      jsar j8, j8, j3
      jjz j8, st_put
      jst j7, j11, 0
      jld j7, j12, 8
      jst j7, j11, 8
      jadd j11, j12, j1
    jwcheck
      jld j3, j1, LOOB
      jsub j3, j11, j3
    jwend
    st_put:
      jst j5, j11, 0
      jst j6, j11, 8
      jldi j3, 1
      jadd j10, j10, j3
  jwcheck
    jsub j2, j10, j9
    jldi j3, 63
    jsar j2, j2, j3
  jwend
st_sorted:
  jldi j1, S_CURVA              ; the curve: at each right one's how-alike, the right ones below it and the wrong ones
  jcall0 j9, puts               ; (the right ones seen so far, the wrong ones)
  jldi j10, 0
  jldi j11, 0
  jldi j12, 0                   ; the cut, once the price is reached
  jwhile j2
    jldi j3, 4
    jshl j3, j11, j3
    jld j4, j1, LOOB
    jadd j3, j3, j4
    jld j5, j3, 8
    jjz j5, st_wrong
    jld j6, j1, PRECIO          ; the PRECIO-th right one: its how-alike is the cut
    jldi j7, 1
    jadd j7, j9, j7
    jsub j6, j6, j7
    jjnz j6, st_say
    jld j12, j3, 0
  st_say:
    jldi j6, 20                 ; (the first twenty points of the curve said)
    jsub j6, j9, j6
    jldi j7, 63
    jsar j6, j6, j7
    jjz j6, st_r
    jst j3, j1, TA
    jst j9, j1, TB
    jst j10, j1, TC
    jst j11, j1, TD
    jst j12, j1, TE
    jldi j2, 32
    jcall putc1
    jld j3, j1, TA
    jld j2, j3, 0
    jcall putnum
    jldi j2, 58
    jcall putc1
    jld j2, j1, TB
    jcall putnum
    jldi j2, 47
    jcall putc1
    jld j2, j1, TC
    jcall0 j1, putnum
    jld j9, j1, TB
    jld j10, j1, TC
    jld j11, j1, TD
    jld j12, j1, TE
  st_r:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp st_cn
  st_wrong:
    jldi j2, 1
    jadd j10, j10, j2
  st_cn:
    jldi j2, 1
    jadd j11, j11, j2
  jwcheck
    jldi j1, 0
    jld j2, j1, LOON
    jsub j2, j11, j2
  jwend
st_cd:
  jldi j1, 0
  jst j12, j1, THR
  jldi j2, 10
  jcall putc1
  jret

; The question GQ judged: right if its best frame answers; chance, the part of its frames that answer. Uses j1-j4.
ak_judge:
  jldi j1, 0
  jld j2, j1, GQ
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, akj_done
  jld j2, j1, SELF              ; asking itself: kept for the curve
  jjz j2, akj_cut
  jld j2, j1, LOON
  jldi j3, 4
  jshl j3, j2, j3
  jld j4, j1, LOOB
  jadd j3, j3, j4
  jld j4, j1, GBP
  jst j4, j3, 0
  jld j4, j1, GBL
  jst j4, j3, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, LOON
  jjmp akj_done
akj_cut:
  jld j2, j1, THR               ; below the cut: "I do not know"
  jjz j2, akj_ans
  jld j3, j1, GBP
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, akj_ans
  jldi j2, 1
  jldadd j2, j1, QABS
  jld j2, j1, QABSR
  jld j3, j1, GBL
  jadd j2, j2, j3
  jst j2, j1, QABSR
  jjmp akj_done
akj_ans:
  jld j2, j1, GBL
  jjnz j2, akj_ok
  jldi j2, 1
  jldadd j2, j1, QWRONG
akj_ok:
  jldi j2, 1
  jldadd j2, j1, QASK
  jld j2, j1, QRIGHT
  jld j3, j1, GBL
  jadd j2, j2, j3
  jst j2, j1, QRIGHT
  jld j2, j1, GFP
  jldi j3, 1000
  jmul j2, j2, j3
  jld j3, j1, GFN
  jjz j3, akj_done
  jdiv j2, j2, j3
  jld j3, j1, QCH
  jadd j2, j3, j2
  jst j2, j1, QCH
  jld j12, j1, GBL
  jcall0 j1, mix                ; (each one: right, its winner's share, how alike to the most alike that answered)
  jld j2, j1, VER
  jjz j2, akj_una
  jldi j2, 90                   ; "Z: question right share alike" (a share less than 0 said as 0)
  jcall putc1
  jldi j2, 58
  jcall putc1
  jldi j2, 32
  jcall putc1
  jld j2, j1, GQ
  jcall putnum
  jldi j2, 32
  jcall putc1
  jld j2, j1, GBL
  jcall putnum
  jldi j2, 32
  jcall putc1
  jld j2, j1, GBS
  jldi j3, 63
  jsar j3, j2, j3
  jjz j3, akj_pos
  jldi j2, 0
akj_pos:
  jcall putnum
  jldi j2, 32
  jcall putc1
  jld j2, j1, GBP
  jcall putnum
  jldi j2, 10
  jcall putc1
akj_una:
  jldi j1, 0                    ; (only one: what it chose, said)
  jld j2, j1, UNA
  jjz j2, akj_done
  jldi j1, S_UNA1
  jcall puts
  jld j2, j1, GQ
  jcall putnum
  jldi j1, S_UNA2
  jcall puts
  jld j2, j1, GBI
  jcall0 j1, putnum
  jld j2, j1, GBL
  jldi j1, S_UNA3
  jjnz j2, akj_si
  jldi j1, S_UNA4
akj_si:
  jcall puts
  jld j2, j1, GFP
  jcall putnum
  jldi j1, S_DE
  jcall puts
  jld j2, j1, GFN
  jcall putnum
  jldi j1, S_UNA5
  jcall puts
akj_done:
  jldi j1, 0
  jret

; The frame at CUR sung: five greetings, the pieces of its five tokens (order 6; only heard if ONLY); whether it
; answers into LABEL; the school's answer (how many steps, then the top face of each as bits) into SLONG and STEPB.
; Uses j1-j8, j10-j14 (keeps j9, j15).
sing:
  jldi j1, 0
  jld j2, j1, CUR
  jld j3, j2, 16
  jst j3, j1, LABEL
  jldi j3, 5
  jst j3, j1, SGN
  jld j3, j1, MEMO
  jldi j4, 4
  jsub j3, j3, j4
  jjz j3, s_notes
  jldi j5, 0
jwhile j3
  jldi j1, 0
  jld j2, j1, CUR
  jldi j3, 3
  jshl j3, j5, j3
  jadd j3, j3, j2
  jld j7, j3, 32                ; its token
  jldi j3, 24
  jmul j7, j7, j3
  jld j3, j1, SAYB
  jadd j7, j7, j3
  jld j6, j7, 16
  jldi j4, 16
  jshl j6, j6, j4
  jld j2, j7, 8
  jor j6, j6, j2
  jshl j6, j6, j4
  jld j2, j7, 0
  jor j6, j6, j2
  jldi j3, 3
  jshl j4, j5, j3
  jst j6, j4, SONGM
  jldi j3, 1
  jadd j5, j5, j3
jwcheck
  jldi j3, 5
  jsub j3, j5, j3
jwend
s_said:
  jldi j1, 0                    ; order 6: how many (SGN), only heard if asked, then each greeting
  jld j2, j1, SGN
  jldi j3, 8
  jshl j2, j2, j3
  jldi j3, 6
  jor j2, j2, j3
  jld j3, j1, ONLY
  jldi j4, 16
  jshl j3, j3, j4
  jor j2, j2, j3
  jst j2, j1, WORD
  jcall0 j4, say
  jld j5, j1, SGN
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
  jcall0 j1, hear               ; how many steps it lasted
  jld j2, j1, MAIL + 8
  jst j2, j1, SLONG
  jld j6, j1, N2                ; then its top faces: SLONG * n^2 bits, 64 per word
  jmul j6, j6, j2
  jld j7, j1, STEPB
  jldi j8, 0
  jwhile j6
    jjnz j8, s_bit
    jcall0 j1, hear
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

; What it says of the song just heard: the kernel's memory if it has one, else the two drawers. Uses j1-j14.
judge:
  jldi j1, 0
  jld j2, j1, MEMO
  jjz j2, share
  jjmp recall

; The kernel's memory (Capitan, 2026-11-08: "use the kernel's memory, it is what is left"; "that was it: we were breaking
; it"): the school only hears. Every read frame is sung once, only heard, and its melody (the top pieces awake at each
; step: piece and step, its notes) is kept with whether it answers: one memory a frame, as each of the 16 things had
; its own, not two drawers where thousands mix. By note, the frames it sounded in (PCNT, PST). Uses j1-j14.
memorize:
  jldi j1, 0                    ; (Capitan, 2026-11-08: "more repetition of melodies, the triple": the school hears
  jst j1, j1, ONLY              ; every read frame REPS times, learning, and settles; then, quiet, it is remembered)
  jld j2, j1, REPS
  jst j2, j1, TB
  jwhile j2
    jldi j9, 0
    jwhile j2
      jldi j3, 72
      jmul j3, j9, j3
      jld j4, j1, ITB
      jadd j3, j3, j4
      jld j4, j3, 24
      jjz j4, mz_rn
      jst j3, j1, CUR
      jcall sing
    mz_rn:
      jldi j2, 1
      jadd j9, j9, j2
    jwcheck
      jldi j1, 0
      jld j2, j1, ITN
      jsub j2, j9, j2
    jwend
  mz_rd:
    jldi j1, 0
    jld j2, j1, TB
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, TB
  jwcheck
    jldi j1, 0
    jld j2, j1, TB
  jwend
mz_rec:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, ONLY
  jst j1, j1, NTN
  jst j1, j1, NTC
  jst j1, j1, FRN
  jld j11, j1, ITN
  jldi j2, 32
  jmul j11, j11, j2
  jldi j2, 32
  jadd j11, j11, j2
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, FRB
  jldi j9, 0
  jwhile j2
    jldi j3, 72
    jmul j3, j9, j3
    jld j4, j1, ITB
    jadd j3, j3, j4
    jld j4, j3, 24
    jjz j4, mz_next             ; (left out: not remembered)
    jst j3, j1, CUR
    jcall0 j1, sing
    jld j2, j1, NTN
    jst j2, j1, TA
    jcall0 j1, notes_of
    jld j2, j1, FRN
    jldi j3, 32
    jmul j3, j2, j3
    jld j4, j1, FRB
    jadd j3, j3, j4
    jld j4, j1, TA
    jst j4, j3, 0
    jld j5, j1, NTN
    jsub j5, j5, j4
    jst j5, j3, 8
    jld j4, j1, LABEL
    jst j4, j3, 16
    jld j4, j1, CUR             ; (and its question)
    jld j4, j4, 0
    jst j4, j3, 24
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FRN
  mz_next:
    jldi j2, 1
    jadd j9, j9, j2
  jwcheck
    jldi j1, 0
    jld j2, j1, ITN
    jsub j2, j9, j2
  jwend
mz_index:                       ; by note, the frames it sounded in: counted at PCNT[id + 2], summed, and filled walking
                                ; PCNT[id + 1]: then note id's frames are PCNT[id] to PCNT[id + 1]
  jldi j1, 0
  jld j2, j1, TMAXW
  jld j3, j1, N2
  jmul j2, j2, j3
  jld j3, j1, FNMAX             ; (or the biggest note of the sentences, and one)
  jldi j4, 1
  jadd j3, j3, j4
  jsub j4, j2, j3
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, mzi_nid
  jadd j2, j3, j1
mzi_nid:
  jst j2, j1, NID
  jldi j3, 2
  jadd j11, j2, j3
  jldi j3, 3
  jshl j11, j11, j3
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, PCNT
  jld j2, j1, NID
  jldi j3, 2
  jadd j2, j2, j3
  jadd j3, j13, j1
  jwhile j2
    jst j1, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jldi j4, 1
    jsub j2, j2, j4
  jwend
mzi_zd:
  jld j2, j1, NTN               ; each note counted (at its id + 2)
  jld j3, j1, NTB
  jwhile j2
    jld j4, j3, 0
    jldi j5, 2
    jadd j4, j4, j5
    jldi j5, 3
    jshl j4, j4, j5
    jld j5, j1, PCNT
    jadd j4, j4, j5
    jld j5, j4, 0
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j4, 0
    jldi j4, 8
    jadd j3, j3, j4
    jldi j4, 1
    jsub j2, j2, j4
  jwend
mzi_cd:
  jld j2, j1, NID               ; summed: PCNT[id + 1] is where note id's frames start
  jldi j3, 2
  jadd j2, j2, j3
  jld j3, j1, PCNT
  jldi j4, 0
  jwhile j2
    jld j5, j3, 0
    jadd j4, j4, j5
    jst j4, j3, 0
    jldi j5, 8
    jadd j3, j3, j5
    jldi j5, 1
    jsub j2, j2, j5
  jwend
mzi_sd:
  jld j11, j1, NTN
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, PST
  jldi j9, 0                    ; each frame into the lists of its notes (PCNT[id + 1] walks as it fills)
  jwhile j2
    jldi j3, 32
    jmul j3, j9, j3
    jld j4, j1, FRB
    jadd j3, j3, j4
    jld j5, j3, 0
    jld j6, j3, 8
    jldi j7, 3
    jshl j5, j5, j7
    jld j7, j1, NTB
    jadd j5, j5, j7
    jwhile j6
      jld j7, j5, 0
      jldi j8, 1
      jadd j7, j7, j8
      jldi j8, 3
      jshl j7, j7, j8
      jld j8, j1, PCNT
      jadd j7, j7, j8
      jld j8, j7, 0
      jldi j10, 3
      jshl j10, j8, j10
      jld j11, j1, PST
      jadd j10, j10, j11
      jst j9, j10, 0
      jldi j10, 1
      jadd j8, j8, j10
      jst j8, j7, 0
      jldi j8, 8
      jadd j5, j5, j8
      jldi j8, 1
      jsub j6, j6, j8
    jwend
  mzi_nd:
    jldi j2, 1
    jadd j9, j9, j2
  jwcheck
    jldi j1, 0
    jld j2, j1, FRN
    jsub j2, j9, j2
  jwend
mzi_fd:
  jld j11, j1, FRN              ; the counters by frame, and the ones touched
  jldi j2, 1
  jadd j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jst j11, j1, TA
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, CNT
  jld j2, j1, FRN
  jadd j3, j13, j1
  jwhile j2
    jst j1, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jldi j4, 1
    jsub j2, j2, j4
  jwend
mzi_kd:
  jld j11, j1, TA
  jldi j10, 2
  jcall0 j1, ask
  jst j13, j1, TCH
  jret

; The notes of the song just heard (STEPB: the byte of step t, piece j at t*n^2 + j) appended to NTB as their places
; (the room doubles to hold them). With MEMO 2 (the ruler, as the counting written by hand was for the riddles), the
; frame's own tokens instead, with no school: token k of the five is note k * NTOK + token; with MEMO 3, the whole
; sentence's notes ("N:"), with no school. Uses j1-j8, j10-j14 (keeps j9).
notes_of:
  jldi j1, 0
  jld j2, j1, MEMO
  jldi j3, 3
  jsub j2, j2, j3
  jjnz j2, no_m2
  jld j2, j1, CUR               ; (MEMO 3: its own notes, the whole sentence's: room as for a song that long)
  jld j3, j1, ITB
  jsub j2, j2, j3
  jldi j3, 72
  jdiv j2, j2, j3
  jldi j3, 4
  jshl j2, j2, j3
  jld j3, j1, ITX
  jadd j2, j2, j3
  jst j2, j1, TD + 8
  jld j2, j2, 8
  jst j2, j1, SLONG
  jjmp no_go
no_m2:
  jld j2, j1, MEMO
  jldi j3, 2
  jsub j2, j2, j3
  jjnz j2, no_song
  jldi j2, 5                    ; (five notes: room as for a song of one step of five pieces)
  jst j2, j1, SLONG + 0
  jjmp no_go
no_song:
  jldi j1, 0
no_go:
  jld j2, j1, SLONG
  jld j3, j1, N2
  jmul j2, j2, j3
  jld j3, j1, NTN
  jadd j2, j2, j3
  jld j4, j1, NTC
  jsub j4, j4, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, no_room
  jld j11, j1, NTC              ; it doubles (or takes what it needs)
  jadd j11, j11, j11
  jsub j4, j11, j2
  jsar j4, j4, j5
  jjz j4, no_dbl
  jadd j11, j2, j1
no_dbl:
  jst j11, j1, TB
  jldi j4, 3
  jshl j11, j11, j4
  jldi j10, 2
  jcall0 j1, ask
  jld j3, j1, NTB
  jld j4, j1, NTN
  jwhile j4
    jld j5, j3, 0
    jst j5, j13, 0
    jldi j5, 8
    jadd j3, j3, j5
    jadd j13, j13, j5
    jldi j5, 1
    jsub j4, j4, j5
  jwend
no_mvd:
  jld j3, j1, NTN
  jldi j4, 3
  jshl j3, j3, j4
  jsub j13, j13, j3
  jst j13, j1, NTB
  jld j2, j1, TB
  jst j2, j1, NTC
no_room:
  jld j2, j1, MEMO
  jldi j3, 3
  jsub j2, j2, j3
  jjnz j2, no_r2
  jld j6, j1, NTN               ; its notes
  jldi j7, 3
  jshl j7, j6, j7
  jld j8, j1, NTB
  jadd j7, j7, j8
  jld j5, j1, TD + 8
  jld j4, j5, 8
  jld j5, j5, 0
  jldi j3, 3
  jshl j5, j5, j3
  jld j3, j1, FNB
  jadd j5, j5, j3
  jwhile j4
    jld j3, j5, 0
    jst j3, j7, 0
    jldi j3, 8
    jadd j5, j5, j3
    jadd j7, j7, j3
    jldi j3, 1
    jadd j6, j6, j3
    jsub j4, j4, j3
  jwend
  jjmp no_done
no_r2:
  jld j2, j1, MEMO
  jldi j3, 2
  jsub j2, j2, j3
  jjnz j2, no_melody
  jld j6, j1, NTN               ; the five tokens
  jldi j7, 3
  jshl j7, j6, j7
  jld j8, j1, NTB
  jadd j7, j7, j8
  jld j5, j1, CUR
  jldi j8, 0
  jwhile j3
    jldi j3, 3
    jshl j3, j8, j3
    jadd j3, j3, j5
    jld j3, j3, 32
    jld j4, j1, NTOK
    jmul j4, j4, j8
    jadd j3, j3, j4
    jst j3, j7, 0
    jldi j3, 8
    jadd j7, j7, j3
    jldi j3, 1
    jadd j6, j6, j3
    jadd j8, j8, j3
  jwcheck
    jldi j3, 5
    jsub j3, j8, j3
  jwend
  jjmp no_done
no_melody:
  jld j2, j1, SLONG
  jld j3, j1, N2
  jmul j2, j2, j3
  jld j5, j1, STEPB
  jld j6, j1, NTN
  jldi j7, 3
  jshl j7, j6, j7
  jld j8, j1, NTB
  jadd j7, j7, j8
  jldi j8, 0                    ; the note's place
  jwhile j3
    jldb j3, j5, 0
    jjz j3, no_next
    jst j8, j7, 0
    jldi j3, 8
    jadd j7, j7, j3
    jldi j3, 1
    jadd j6, j6, j3
  no_next:
    jldi j3, 1
    jadd j5, j5, j3
    jadd j8, j8, j3
  jwcheck
    jsub j3, j8, j2
  jwend
no_done:
  jst j6, j1, NTN
  jret

; What the kernel remembers of the song just heard: of the frames it remembers, the most like it that answered and the
; most like it that did not (alike: the notes they share over the notes of the two, in millionths); the first less
; the second -> j2. Uses j1-j8, j10-j14 (keeps j9).
recall:
  jldi j1, 0
  jld j2, j1, NTN
  jst j2, j1, TC                ; (its notes, for now, past the remembered ones)
  jcall0 j1, notes_of
  jld j2, j1, NTN
  jld j3, j1, TC
  jsub j2, j2, j3
  jst j2, j1, QNC
  jst j1, j1, TCN
  jst j1, j1, BPOS
  jst j1, j1, BNEG
  jld j10, j1, TC
  jldi j2, 3
  jshl j10, j10, j2
  jld j2, j1, NTB
  jadd j10, j10, j2             ; j10 its notes
  jld j11, j1, QNC
  jwhile j11
    jld j2, j10, 0
    jld j3, j1, NID
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, rc_nn               ; (a note no remembered melody can have)
    jldi j3, 3                  ; its frames: from PCNT[id] to PCNT[id + 1] (the lists, once filled)
    jshl j2, j2, j3
    jld j3, j1, PCNT
    jadd j2, j2, j3
    jld j4, j2, 0
    jld j5, j2, 8
  rc_have:
    jwhile j6
      jld j7, j1, PST           ; a frame that has this note
      jldx j6, j7, j4
      jld j7, j1, SELF          ; (asking itself: not one of its own question)
      jjz j7, rc_mine
      jldi j7, 5
      jshl j7, j6, j7
      jld j8, j1, FRB
      jadd j7, j7, j8
      jld j7, j7, 24
      jld j8, j1, GQ
      jsub j7, j7, j8
      jjnz j7, rc_mine
      jldi j3, 1
      jadd j4, j4, j3
    jwcheck
    rc_p:
      jsub j6, j4, j5
    jwend
    jjmp rc_nn
    rc_mine:
      jldi j7, 3
      jshl j7, j6, j7
      jld j8, j1, CNT
      jadd j7, j7, j8
      jld j8, j7, 0
      jjnz j8, rc_inc
      jld j3, j1, TCN
      jldi j12, 3
      jshl j12, j3, j12
      jld j13, j1, TCH
      jadd j12, j12, j13
      jst j6, j12, 0
      jldi j12, 1
      jadd j3, j3, j12
      jst j3, j1, TCN
    rc_inc:
      jldi j3, 1
      jadd j8, j8, j3
      jst j8, j7, 0
      jadd j4, j4, j3
      jjmp rc_p
  rc_nn:
    jldi j2, 8
    jadd j10, j10, j2
    jldi j2, 1
    jsub j11, j11, j2
  jwend
rc_judge:
  jld j11, j1, TCN
  jld j10, j1, TCH
  jwhile j11
    jld j6, j10, 0
    jldi j7, 3
    jshl j7, j6, j7
    jld j8, j1, CNT
    jadd j7, j7, j8
    jld j2, j7, 0               ; shared notes
    jst j1, j7, 0
    jldi j3, 32
    jmul j3, j6, j3
    jld j4, j1, FRB
    jadd j3, j3, j4
    jld j4, j3, 8
    jld j5, j1, QNC
    jadd j4, j4, j5
    jsub j4, j4, j2             ; notes of the two
    jldi j5, 0
    jshi j5, 0Fh
    jshi j5, 4240h
    jmul j2, j2, j5
    jdiv j2, j2, j4
    jld j4, j3, 16
    jldi j5, BNEG
    jjz j4, rc_side
    jldi j5, BPOS
  rc_side:
    jld j6, j5, 0
    jsub j6, j6, j2
    jldi j7, 63
    jsar j6, j6, j7
    jjz j6, rc_tn
    jst j2, j5, 0
  rc_tn:
    jldi j2, 8
    jadd j10, j10, j2
    jldi j2, 1
    jsub j11, j11, j2
  jwend
rc_done:
  jld j2, j1, TC                ; its notes go: only the remembered ones stay
  jst j2, j1, NTN
  jld j2, j1, BPOS
  jld j3, j1, BNEG
  jsub j2, j2, j3
  jret

; MEMO 4: the frame's sentence sung, its notes ("N:") one greeting each, in their order (the cube takes 255 at most:
; past them a sentence is heard by its first 255 notes). Then said as any song. Uses j1-j8, j10-j14 (keeps j9, j15).
s_notes:
  jld j2, j1, CUR
  jld j3, j1, ITB
  jsub j2, j2, j3
  jldi j3, 72
  jdiv j2, j2, j3
  jldi j3, 4
  jshl j2, j2, j3
  jld j3, j1, ITX
  jadd j2, j2, j3
  jld j6, j2, 8
  jld j7, j2, 0
  jldi j3, 255
  jsub j3, j6, j3
  jjn j3, sn_few
  jldi j6, 255
sn_few:
  jst j6, j1, SGN
  jldi j3, 3
  jshl j7, j7, j3
  jld j3, j1, FNB
  jadd j7, j7, j3               ; its notes
  jldi j8, 0                    ; SONGM offset
  sn_lap:
    jjz j6, s_said
    jld j2, j7, 0
    jldi j3, 24
    jmul j2, j2, j3
    jld j3, j1, SAYB
    jadd j2, j2, j3
    jld j5, j2, 16
    jldi j4, 16
    jshl j5, j5, j4
    jld j3, j2, 8
    jor j5, j5, j3
    jshl j5, j5, j4
    jld j3, j2, 0
    jor j5, j5, j3
    jst j5, j8, SONGM
    jldi j3, 8
    jadd j7, j7, j3
    jadd j8, j8, j3
    jldi j3, 1
    jsub j6, j6, j3
    jjmp sn_lap

; What the melody heard says: its notes as heard for "it answers" over all heard for it, less the same for "it does
; not" (in millionths) -> j2. Uses j1-j8, j10-j14 (keeps j9, j15).
share:
  jldi j8, 1
  jcall0 j1, sh_one
  jst j2, j1, SC1
  jldi j8, 0
  jcall0 j1, sh_one
  jld j3, j1, SC1
  jsub j2, j3, j2
  jret
sh_one:                         ; answer j8's share -> j2 (0 if never heard)
  jldi j1, 3
  jshl j1, j8, j1
  jld j10, j1, HEARD
  jldi j2, 0
  jjz j10, sho_done
  jldi j11, 0
  jldi j1, 0
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
  jwhile j6
    jldb j1, j5, 0
    jjz j1, sh_next
    jld j1, j4, 0
    jadd j11, j11, j1
  sh_next:
    jldi j1, 1
    jadd j5, j5, j1
    jsub j6, j6, j1
    jldi j1, 8
    jadd j4, j4, j1
  jwend
  jldi j2, 0
  jshi j2, 0Fh
  jshi j2, 4240h                ; 1000000
  jmul j2, j11, j2
  jdiv j2, j2, j10
sho_done:
  jret

; It knows whether it answers (LABEL): it learns what the song sounded like for it. Uses j1-j8, j10.
learn:
  jldi j1, 0
  jld j8, j1, LABEL
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
  jldi j10, 0
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

; The character j2 at TEXT + POS. Uses j1, j3, j4 (j1 = 0 after).
putc1:
  jldi j1, 0
  jld j4, j1, POS
  jstb j2, j4, TEXT
  jldi j3, 1
  jadd j4, j4, j3
  jst j4, j1, POS
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
jwhile j3
  jstb j3, j2, TEXT
  jldi j3, 1
  jadd j1, j1, j3
  jadd j2, j2, j3
jwcheck
  jldb j3, j1, 0
jwend
pu_done:
  jldi j1, 0
  jst j2, j1, POS
  jret

; j2 (0 or more) in decimal at TEXT + POS. Uses j1-j4 (j1 = 0 after).
putnum:
  jldi j3, 0
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
  jldi j2, 0
  jadd j2, j2, j4
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
jwhile j1
  jldi j10, 29
  jcall ask
  jldi j1, 1                    ; nobody is left who could greet it (-1): waiting again would spin for nothing
  jadd j1, j13, j1
  jjz j1, h_alone
jwcheck
hear:
  jldi j10, 31
  jldi j11, MAIL
  jldi j12, 16
  jcall ask
  jldi j1, 1
  jsub j1, j13, j1
jwend
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
