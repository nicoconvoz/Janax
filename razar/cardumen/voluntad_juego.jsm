; Razar invents its own words for numbers and learns to add by trial and error, with no rule given (Capitan,
; 2026-11-06: "forget the rules, I do not want patches nor to tell it how to do it: I want it to discover it, as it did
; when it worked in the language it invented"). The loop of lazo.pl, the one that beat EGG, with riddles:
;   - each word (uno..seis, mas, menos) is said by pressing 3 pieces of the bottom face, chosen by its own dice at
;     first: its invented word;
;   - a riddle "a op b" is a song of three greetings, one per step (the pieces of a, of op, of b), and the school
;     (cardumen_cubo.jsm, its child) sings it with its waves crossing;
;   - the will reads the answer in the melody (for each answer, the share of times each top piece woke at each step
;     when that was the answer: it knows the answer, so it learns every round) and guesses;
;   - right: it sings that riddle once more (the school settles it). Wrong: the will, imperfect, moves one of the 3
;     pieces of one of the three words it used (a throw picks the word, the piece and its new place).
; Nothing says what adding is. It practices EJEMPLOS riddles drawn by dice (VUELTAS rounds, one riddle each, drawn by
; dice), then it is asked the riddles it never practiced, without learning: if adding was discovered, it shows there.
; Its parameters are the file "p" (6 qwords): the seed, the side n, the rounds, how many riddles it practices, the kind
; (0 mas, 1 mas and menos), 1 if the school is quiet (it never learns). Its dice: seed2 = seed * 7919 + 1, seed2 =
; (seed2 * 1103515245 + 12345) mod 2^31, a throw is seed2 >> 16. Every guess goes into j0; it writes how it went.
;
; Its initial data (voluntad_juego.datos): the texts, one every 40h bytes.
S_JUEGO = 0
S_N   = 40h
S_VUEL = 80h
S_EJEM = 0C0h
S_QUIETO = 100h
S_MEZCLA = 140h
S_PRACT = 180h
S_PCT = 1C0h
S_DE  = 200h
S_NUNCA = 240h
S_AZAR = 280h
; Room 0 (3000h bytes):
QUEUE = 1000h                   ; its window: one request
PLAB  = 1040h                   ; "p", the parameters file
HIJO  = 1048h                   ; "hijo"
NACE  = 1080h                   ; the parameters (6 qwords)
NN    = 1088h
VUELTAS = 1090h
EJEM  = 1098h
TIPO  = 10A0h
QUIET = 10A8h
M48   = 1100h                   ; 2^48 - 1
SEED2 = 1108h                   ; its dice
CHILD = 1110h                   ; the school's number
BEST  = 1118h                   ; what it guessed (6: nothing)
BSUM  = 1120h                   ; the best share so far: BSUM / BTOT
BTOT  = 1128h
SLONG = 1130h                   ; how many steps the song lasted
WORD  = 1138h                   ; the word it is saying
MAIL  = 1140h                   ; a letter read from its mailbox: who said it, the word
N2    = 1150h                   ; n^2: a face
PP    = 1158h                   ; n^3
TMAXW = 1160h                   ; the most steps a song of 3 greetings can last: 3 + n^3
RBASE = 1168h                   ; its room of what it learned
STEPB = 1170h                   ; the song heard, in that room: top piece j at step t at STEPB + t*n^2 + j
POS   = 1178h                   ; how long the text it writes is so far
LABEL = 1180h                   ; the answer of the riddle being sung (0..5: uno..seis)
NALL  = 1188h                   ; riddles of one operator
NTRAIN = 1190h                  ; riddles practiced, and asked
NTEST = 1198h
HITS  = 11A0h                   ; right in the last quarter of the rounds, and rounds in it
TAILN = 11A8h
RIGHT = 11B0h                   ; asked: right, and asked
ASKED = 11B8h
MRIGHT = 11C0h                  ; the practiced ones, asked again: right, and asked
MASKED = 11C8h
CUR   = 11D0h                   ; the riddle being sung (its address)
ROUND = 11D8h                   ; the round
OPC   = 11E0h                   ; the operator whose riddles are being drawn (6 mas, 7 menos)
DIG   = 11E8h                   ; digits of a number being written (24 bytes)
SAY   = 1200h                   ; word w (0..7) is said with pieces SAY + (w*3 + j)*8
HEARD = 1300h                   ; notes heard for each answer, in all (6 qwords)
ALLP  = 1400h                   ; the riddles of one operator: a, operator, b, c (32 bytes each)
TRAIN = 1800h                   ; the riddles practiced
TEST  = 1C00h                   ; the riddles asked
SONGM = 2000h                   ; the song being said: the pieces of each greeting (3 qwords)
TEXT  = 2100h                   ; the line it writes
include '../../escalon0/janax.inc'
jfirst j1, 3000h               ; first order: room 0

jldi j1, 1                      ; 2^48 - 1
jldi j2, 48
jshl j1, j1, j2
jldi j2, 1
jsub j1, j1, j2
jldi j2, 0
jst j1, j2, M48
jst j2, j2, POS
jldi j0, 0                      ; the fingerprint

jldi j1, 0                      ; its parameters: open "p" (request 4) and read 48 bytes (request 5)
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
jldi j12, 48
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

jldi j13, 0                     ; the school is born (order 5: seed, side, quiet) and asks for the room its tables need
jld j1, j13, NN
jmul j2, j1, j1
jst j2, j13, N2
jmul j3, j2, j1
jst j3, j13, PP
jldi j4, 3
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
jldi j3, 5
jor j2, j2, j3
jst j2, j13, WORD
jcall say
jcall hear                      ; how much room its tables need: this cabin builds it (request 2), moves it there
jldi j1, 0                      ; (request 23) and says so (a child's request for memory would wait for a signature)
jld j11, j1, MAIL + 8
jjz j11, b_roomed
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
b_roomed:

jldi j13, 0                     ; what it learns: 6 answers * TMAXW steps * n^2 pieces, a qword each; then the song heard
jld j1, j13, TMAXW
jld j2, j13, N2
jmul j1, j1, j2
jldi j2, 6
jmul j2, j1, j2
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
jldi j2, 6
jwhile j2
  jldi j3, 3
  jshl j3, j1, j3
  jldi j4, 0
  jst j4, j3, HEARD
  jldi j3, 1
  jadd j1, j1, j3
  jsub j2, j2, j3
jwend
jldi j1, 0                      ; its dice: seed * 7919 + 1
jld j2, j1, NACE
jldi j3, 7919
jmul j2, j2, j3
jldi j3, 1
jadd j2, j2, j3
jst j2, j1, SEED2

jldi j9, 0                      ; its invented words: 3 distinct pieces of the bottom face each, by dice
w_lap:
jldi j1, 24
jsub j1, j9, j1
jjz j1, w_done
w_draw:
  jcall rnd2
  jldi j1, 0
  jld j2, j1, N2
  jdiv j3, j13, j2
  jmul j3, j3, j2
  jsub j3, j13, j3              ; a piece
  jldi j4, 3                    ; not one this word has already
  jdiv j5, j9, j4
  jmul j5, j5, j4               ; the word's first slot
w_check:
  jsub j6, j5, j9
  jjz j6, w_take
  jldi j6, 3
  jshl j6, j5, j6
  jld j6, j6, SAY
  jsub j6, j6, j3
  jjz j6, w_draw
  jldi j6, 1
  jadd j5, j5, j6
  jjmp w_check
w_take:
  jldi j6, 3
  jshl j6, j9, j6
  jst j3, j6, SAY
  jldi j6, 1
  jadd j9, j9, j6
  jjmp w_lap
w_done:

jldi j1, 0                      ; the riddles: of mas (6), and of menos (7) if TIPO; shuffled; the first EJEM practiced
jst j1, j1, NTRAIN
jst j1, j1, NTEST
jldi j2, 6
jst j2, j1, OPC
jcall riddles_of
jldi j1, 0
jld j2, j1, TIPO
jjz j2, r_drawn
jldi j2, 7
jst j2, j1, OPC
jcall riddles_of
r_drawn:

jldi j1, 0                      ; it practices: VUELTAS rounds, a riddle drawn by dice each
jst j1, j1, HITS
jst j1, j1, TAILN
jst j1, j1, ROUND
p_lap:
  jldi j1, 0
  jld j2, j1, ROUND
  jld j3, j1, VUELTAS
  jsub j3, j2, j3
  jjz j3, p_done
  jld j2, j1, NTRAIN
  jjz j2, p_done
  jcall rnd2                    ; the riddle
  jldi j1, 0
  jld j2, j1, NTRAIN
  jdiv j3, j13, j2
  jmul j3, j3, j2
  jsub j3, j13, j3
  jldi j4, 5
  jshl j3, j3, j4
  jldi j4, TRAIN
  jadd j3, j3, j4
  jst j3, j1, CUR
  jcall sing
  jcall guess
  jcall learn
  jldi j1, 0
  jld j12, j1, LABEL
  jldi j2, 4
  jshl j12, j12, j2
  jld j2, j1, BEST
  jadd j12, j12, j2
  jcall mix
  jldi j1, 0                    ; the last quarter: rounds * 4 >= VUELTAS * 3
  jld j2, j1, ROUND
  jldi j3, 4
  jmul j2, j2, j3
  jld j3, j1, VUELTAS
  jldi j4, 3
  jmul j3, j3, j4
  jsub j2, j2, j3
  jldi j4, 63
  jsar j2, j2, j4
  jjnz j2, p_judge
  jld j2, j1, TAILN
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, TAILN
p_judge:
  jld j2, j1, BEST
  jld j3, j1, LABEL
  jsub j2, j2, j3
  jjnz j2, p_wrong
  jld j2, j1, ROUND             ; right: counted (in the last quarter), and sung once more: the school settles it
  jldi j3, 4
  jmul j2, j2, j3
  jld j3, j1, VUELTAS
  jldi j4, 3
  jmul j3, j3, j4
  jsub j2, j2, j3
  jldi j4, 63
  jsar j2, j2, j4
  jjnz j2, p_again
  jld j2, j1, HITS
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, HITS
p_again:
  jcall sing
  jjmp p_next
p_wrong:                        ; wrong: one piece of one of its three words moves
  jcall rnd2
  jldi j3, 3
  jdiv j4, j13, j3
  jmul j4, j4, j3
  jsub j4, j13, j4              ; which word of the riddle: 0 a, 1 op, 2 b
  jldi j1, 0
  jld j5, j1, CUR
  jldi j3, 3
  jshl j6, j4, j3
  jadd j6, j6, j5
  jld j7, j6, 0                 ; a, op or b
  jldi j3, 1
  jsub j3, j4, j3
  jjz j3, p_isword              ; op is a word already (6, 7)
  jldi j3, 1
  jsub j7, j7, j3               ; a number n is word n - 1
p_isword:
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
  jst j7, j1, WORD              ; (WORD: the slot that moves)
p_place:
  jcall rnd2                    ; its new place: not one the word has
  jldi j1, 0
  jld j2, j1, N2
  jdiv j3, j13, j2
  jmul j3, j3, j2
  jsub j3, j13, j3
  jld j7, j1, WORD
  jldi j4, 3
  jdiv j5, j7, j4
  jmul j5, j5, j4               ; the word's first slot
  jldi j6, 3
p_check:
  jldi j8, 3
  jshl j8, j5, j8
  jld j8, j8, SAY
  jsub j8, j8, j3
  jjz j8, p_place
  jldi j8, 1
  jadd j5, j5, j8
  jsub j6, j6, j8
  jjnz j6, p_check
  jldi j8, 3
  jshl j8, j7, j8
  jst j3, j8, SAY
p_next:
  jldi j1, 0
  jld j2, j1, ROUND
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ROUND
  jjmp p_lap
p_done:

jldi j1, 0                      ; asked, without learning: the practiced ones, then the ones it never practiced
jst j1, j1, MRIGHT
jst j1, j1, MASKED
jst j1, j1, RIGHT
jst j1, j1, ASKED
jld j15, j1, NTRAIN
jldi j2, TRAIN
jst j2, j1, CUR
jwhile j15
  jcall sing
  jcall guess
  jldi j1, 0
  jld j2, j1, MASKED
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, MASKED
  jld j2, j1, BEST
  jld j4, j1, LABEL
  jsub j2, j2, j4
  jjnz j2, a_mnot
  jld j2, j1, MRIGHT
  jadd j2, j2, j3
  jst j2, j1, MRIGHT
a_mnot:
  jld j2, j1, CUR
  jldi j4, 32
  jadd j2, j2, j4
  jst j2, j1, CUR
  jsub j15, j15, j3
jwend
jld j15, j1, NTEST
jldi j2, TEST
jst j2, j1, CUR
jwhile j15
  jcall sing
  jcall guess
  jldi j1, 0
  jld j12, j1, BEST
  jcall mix
  jldi j1, 0
  jld j2, j1, ASKED
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ASKED
  jld j2, j1, BEST
  jld j4, j1, LABEL
  jsub j2, j2, j4
  jjnz j2, a_tnot
  jld j2, j1, RIGHT
  jadd j2, j2, j3
  jst j2, j1, RIGHT
a_tnot:
  jld j2, j1, CUR
  jldi j4, 32
  jadd j2, j2, j4
  jst j2, j1, CUR
  jsub j15, j15, j3
jwend
jldi j1, 0
jld j12, j1, HITS
jcall mix
jld j12, j1, MRIGHT
jcall mix
jld j12, j1, RIGHT
jcall mix

jldi j1, 0                      ; the school ends (order 3: it says its fingerprint, not mixed here)
jldi j2, 3
jst j2, j1, WORD
jcall say
jcall hear

jldi j1, S_JUEGO                ; how it went
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
jldi j1, S_EJEM
jcall puts
jld j2, j1, EJEM
jcall putnum
jld j2, j1, TIPO
jjz j2, o_tipo
jldi j1, S_MEZCLA
jcall puts
o_tipo:
jldi j1, 0
jld j2, j1, QUIET
jjz j2, o_quiet
jldi j1, S_QUIETO
jcall puts
o_quiet:
jldi j1, S_PRACT
jcall puts
jldi j1, 0                      ; the share of the last quarter, in percent
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
jld j2, j1, MRIGHT
jcall putnum
jldi j1, S_DE
jcall puts
jld j2, j1, MASKED
jcall putnum
jldi j1, S_NUNCA
jcall puts
jld j2, j1, RIGHT
jcall putnum
jldi j1, S_DE
jcall puts
jld j2, j1, ASKED
jcall putnum
jldi j1, S_AZAR
jcall puts
jldi j10, 1
jldi j11, TEXT
jldi j1, 0
jld j12, j1, POS
jcall ask
jhalt

; The riddles of OPC (6 mas: c = a + b; 7 menos: c = a - b), a and b in 1..6 and c in 1..6, in order; shuffled with
; its dice (i from the last down to 1, swapped with a throw mod (i + 1)); the first EJEM practiced, the rest asked.
; Uses j1-j14.
riddles_of:
  jldi j13, 0
  jst j13, j13, NALL
  jldi j1, 1
ro_a:
  jldi j2, 1
ro_b:
  jld j3, j13, OPC
  jldi j4, 6
  jsub j4, j3, j4
  jadd j5, j1, j2
  jjz j4, ro_op
  jsub j5, j1, j2
ro_op:
  jldi j4, 1
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
  jld j9, j13, NALL
  jldi j1, 1
  jsub j9, j9, j1
ro_shuffle:
  jjz j9, ro_take
  jcall rnd2
  jldi j1, 1
  jadd j2, j9, j1
  jdiv j3, j13, j2
  jmul j3, j3, j2
  jsub j3, j13, j3
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
ro_take:
  jldi j13, 0
  jld j10, j13, NALL
  jwhile j10
    jld j1, j13, EJEM           ; the first EJEM of this operator: practiced
    jldi j2, 0
    jadd j2, j2, j9
    jsub j1, j2, j1
    jldi j2, 63
    jsar j1, j1, j2
    jldi j2, NTRAIN
    jldi j3, TRAIN
    jjnz j1, rt_put
    jldi j2, NTEST
    jldi j3, TEST
  rt_put:
    jld j4, j2, 0
    jldi j5, 5
    jshl j6, j4, j5
    jadd j6, j6, j3
    jshl j7, j9, j5
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
    jldi j1, 1
    jadd j9, j9, j1
    jsub j10, j10, j1
  jwend
  jret

; The riddle at CUR sung: three greetings, the pieces of a, of op, of b (order 6); its answer c - 1 into LABEL; the
; school's answer (how many steps, then the top face of each as bits) into SLONG and STEPB. Uses j1-j8, j10-j14
; (keeps j9, j15).
sing:
  jldi j1, 0
  jld j2, j1, CUR
  jld j3, j2, 24
  jldi j4, 1
  jsub j3, j3, j4
  jst j3, j1, LABEL
  jldi j5, 0                    ; greeting k: a, op, b
s_greet:
  jldi j3, 3
  jsub j3, j5, j3
  jjz j3, s_said
  jldi j1, 0
  jld j2, j1, CUR
  jldi j3, 3
  jshl j3, j5, j3
  jadd j3, j3, j2
  jld j7, j3, 0
  jldi j3, 1
  jsub j3, j5, j3
  jjz j3, s_word
  jldi j3, 1
  jsub j7, j7, j3
s_word:
  jldi j3, 24                   ; SAY offset of the word: w * 3 * 8
  jmul j7, j7, j3
  jld j6, j7, SAY + 16
  jldi j4, 16
  jshl j6, j6, j4
  jld j2, j7, SAY + 8
  jor j6, j6, j2
  jshl j6, j6, j4
  jld j2, j7, SAY
  jor j6, j6, j2
  jldi j3, 3
  jshl j4, j5, j3
  jst j6, j4, SONGM
  jldi j3, 1
  jadd j5, j5, j3
  jjmp s_greet
s_said:
  jldi j1, 0                    ; order 6: how many, then each greeting
  jldi j2, 306h
  jst j2, j1, WORD
  jcall say
  jldi j4, 0
  jldi j5, 3
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
  jldi j8, 0
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

; What it guesses: the answer whose notes it heard most, as a share of all it heard for it (BEST, 6 if none). Uses
; j1-j8, j10-j14 (keeps j9, j15).
guess:
  jldi j1, 0
  jldi j2, 6
  jst j2, j1, BEST
  jst j1, j1, BSUM
  jldi j2, 1
  jst j2, j1, BTOT
  jldi j8, 0
gw_lap:
  jldi j1, 6
  jsub j1, j8, j1
  jjz j1, gw_done
  jldi j1, 3
  jshl j1, j8, j1
  jld j10, j1, HEARD
  jjz j10, gw_next
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
  jldi j1, 0
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

; It knows the answer (LABEL): it learns what the song sounded like for it. Uses j1-j8, j10.
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
