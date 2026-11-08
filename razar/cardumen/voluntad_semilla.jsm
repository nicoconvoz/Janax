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
; its answer. Its parameters are the file "p" (4 qwords): the seed, the side n, the rounds, 1 if the school is quiet
; (it never learns). Its dice: seed2 = seed * 7919 + 1, seed2 = (seed2 * 1103515245 + 12345) mod 2^31, a throw is
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
; Room 0 (4000h bytes):
QUEUE = 1000h                   ; its window: one request
PLAB  = 1040h                   ; "p", the parameters file
HIJO  = 1048h                   ; "hijo"
MLAB  = 1050h                   ; "marcos"
NACE  = 1080h                   ; the parameters (4 qwords)
NN    = 1088h
VUELTAS = 1090h
QUIET = 1098h
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
SONGM = 2000h                   ; the song being said: the pieces of each greeting (5 qwords)
TEXT  = 2100h                   ; the line it writes
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
jldi j12, 32
jcall ask

jcall frames                    ; the frames, read (before the school is born: nothing to say to it yet)

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
jldi j4, 5
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
jldi j1, 0                      ; (request 23) and says so
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
jst j1, j1, HEARD
jst j1, j1, HEARD + 8
jld j2, j1, NACE                ; its dice: seed * 7919 + 1
jldi j3, 7919
jmul j2, j2, j3
jldi j3, 1
jadd j2, j2, j3
jst j2, j1, SEED2

jldi j1, 0                      ; its invented words: 3 distinct pieces of the bottom face each, by dice
jld j11, j1, NTOK
jldi j2, 24
jmul j11, j11, j2
jldi j2, 8
jadd j11, j11, j2
jldi j10, 2
jcall ask
jldi j1, 0
jst j13, j1, SAYB
jldi j9, 0
w_lap:
jldi j1, 0
jld j2, j1, NTOK
jldi j3, 3
jmul j2, j2, j3
jsub j1, j9, j2
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
  jmul j5, j5, j4
w_check:
  jsub j6, j5, j9
  jjz j6, w_take
  jldi j6, 3
  jshl j6, j5, j6
  jld j7, j1, SAYB
  jadd j6, j6, j7
  jld j6, j6, 0
  jsub j6, j6, j3
  jjz j6, w_draw
  jldi j6, 1
  jadd j5, j5, j6
  jjmp w_check
w_take:
  jldi j6, 3
  jshl j6, j9, j6
  jld j7, j1, SAYB
  jadd j6, j6, j7
  jst j3, j6, 0
  jldi j6, 1
  jadd j9, j9, j6
  jjmp w_lap
w_done:

jldi j1, 0                      ; it practices: VUELTAS rounds, a read frame each, half that answer, half not
jst j1, j1, HITS
jst j1, j1, TAILN
jst j1, j1, ROUND
jst j1, j1, ONLY
p_lap:
  jldi j1, 0
  jld j2, j1, ROUND
  jld j3, j1, VUELTAS
  jsub j3, j2, j3
  jjz j3, p_done
  jld j2, j1, POSN
  jjz j2, p_done
  jld j2, j1, NEGN
  jjz j2, p_done
  jcall rnd2                    ; which of the two
  jldi j1, 0
  jldi j2, 1
  jand j2, j13, j2
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
  jcall rnd2
  jldi j1, 0
  jld j6, j1, TA
  jdiv j3, j13, j6
  jmul j3, j3, j6
  jsub j3, j13, j3
  jldi j4, 3
  jshl j3, j3, j4
  jld j5, j1, TE
  jadd j3, j3, j5
  jld j3, j3, 0                 ; the frame's number
  jldi j4, 72
  jmul j3, j3, j4
  jld j4, j1, ITB
  jadd j3, j3, j4
  jst j3, j1, CUR
  jcall sing
  jcall share                   ; -> j2 its "it answers" minus "it does not"
  jldi j1, 0
  jldi j3, 63                   ; guessed: it answers when more than not
  jsar j3, j2, j3
  jldi j4, 1
  jadd j3, j3, j4               ; (1 if j2 >= 0)
  jjnz j2, p_g
  jldi j3, 0                    ; (a tie, or nothing heard: it does not)
p_g:
  jst j3, j1, TB
  jcall learn
  jldi j1, 0
  jld j12, j1, TB
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
  jst j2, j1, TC         ; (-1: not in it)
  jjnz j2, p_judge
  jld j2, j1, TAILN
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, TAILN
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
  jcall rnd2                    ; its new place: not one the word has
  jldi j1, 0
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
  jldi j8, 3
  jshl j8, j5, j8
  jld j9, j1, SAYB
  jadd j8, j8, j9
  jld j8, j8, 0
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
  jld j2, j1, ROUND
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ROUND
  jjmp p_lap
p_done:

jcall asked                     ; the questions it never read

jldi j1, 0
jld j12, j1, HITS
jcall mix
jld j12, j1, QRIGHT
jcall mix
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
jldi j1, S_MARC
jcall puts
jld j2, j1, ITN
jcall putnum
jldi j1, S_PRACT
jcall puts
jldi j1, 0
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
jldi j1, S_AZAR
jcall puts
jld j2, j1, QCH                 ; chance: the part of a question's frames that answer, summed, in 1000ths
jldi j3, 10
jdiv j2, j2, j3
jld j3, j1, QASK
jjz j3, o_noch
jdiv j2, j2, j3
o_noch:
jcall putnum
jldi j1, 0
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
  jcall ask
  jldi j1, 0
  jst j13, j1, FH
  jst j1, j1, FN
  jldi j11, 1
  jldi j2, 16
  jshl j11, j11, j2
  jst j11, j1, FC
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, FB
  fr_read:
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
    jcall ask
    jldi j1, 0
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
    jjnz j3, fr_close
    jld j11, j1, FC
    jadd j11, j11, j11
    jldi j10, 2
    jcall ask
    jldi j1, 0
    jld j3, j1, FB
    jld j4, j1, FN
    jldi j5, 0
    fr_mv:
      jsub j6, j5, j4
      jjz j6, fr_moved
      jadd j6, j3, j5
      jldb j6, j6, 0
      jadd j7, j13, j5
      jstb j6, j7, 0
      jldi j6, 1
      jadd j5, j5, j6
      jjmp fr_mv
    fr_moved:
    jst j13, j1, FB
    jld j2, j1, FC
    jadd j2, j2, j2
    jst j2, j1, FC
    jjmp fr_read
fr_close:
  jld j10, j1, FH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0                    ; the frames' rooms: a frame takes ten bytes of the file at least
  jld j11, j1, FN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 80
  jadd j11, j11, j2
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, ITB
  jst j1, j1, ITN
  jst j1, j1, NTOK
  jld j9, j1, FB                ; walking the file: j9 where, j10 bytes left
  jld j10, j1, FN
  fr_line:
    jjz j10, fr_parsed
    jldb j2, j9, 0
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
    fr_num:
      jldi j2, 9
      jsub j2, j12, j2
      jjz j2, fr_got
      fr_sp:                    ; to the next digit
        jjz j10, fr_parsed
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
        jjmp fr_sp
    fr_dig:
      jldi j6, 0
      fr_dl:
        jjz j10, fr_dd
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
        jjmp fr_dl
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
      jjmp fr_num
  fr_got:
    jldi j1, 0
    jld j2, j1, ITN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ITN
  fr_skip:                      ; to the next line
    jjz j10, fr_parsed
    jldb j2, j9, 0
    jldi j3, 1
    jadd j9, j9, j3
    jsub j10, j10, j3
    jldi j3, 10
    jsub j2, j2, j3
    jjnz j2, fr_skip
    jjmp fr_line
fr_parsed:
  jldi j1, 0                    ; the read ones, by what they say
  jld j11, j1, ITN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jst j11, j1, TE
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, POSL
  jld j11, j1, TE
  jldi j10, 2
  jcall ask
  jldi j1, 0
  jst j13, j1, NEGL
  jst j1, j1, POSN
  jst j1, j1, NEGN
  jldi j9, 0
  fr_split:
    jld j2, j1, ITN
    jsub j2, j9, j2
    jjz j2, fr_done
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
    jjmp fr_split
fr_done:
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
  ak_lap:
    jldi j1, 0
    jld j2, j1, ITN
    jsub j2, j9, j2
    jjz j2, ak_end
    jldi j3, 72
    jmul j3, j9, j3
    jld j4, j1, ITB
    jadd j3, j3, j4
    jld j4, j3, 24
    jjnz j4, ak_next            ; (read: not asked)
    jst j3, j1, CUR
    jld j4, j3, 0
    jld j5, j1, GQ
    jsub j5, j4, j5
    jjz j5, ak_same
    jst j9, j1, TD       ; a new question: the one before judged
    jcall ak_judge
    jldi j1, 0
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
    jcall share
    jldi j1, 0
    jld j9, j1, TD
    jld j3, j1, GFN
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, GFN
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
  ak_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp ak_lap
ak_end:
  jjmp ak_judge

; The question GQ judged: right if its best frame answers; chance, the part of its frames that answer. Uses j1-j4.
ak_judge:
  jldi j1, 0
  jld j2, j1, GQ
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, akj_done
  jld j2, j1, QASK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QASK
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
  jcall mix
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
  jldi j5, 0
s_greet:
  jldi j3, 5
  jsub j3, j5, j3
  jjz j3, s_said
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
  jjmp s_greet
s_said:
  jldi j1, 0                    ; order 6: how many (5), only heard if asked, then each greeting
  jldi j2, 506h
  jld j3, j1, ONLY
  jldi j4, 16
  jshl j3, j3, j4
  jor j2, j2, j3
  jst j2, j1, WORD
  jcall say
  jldi j4, 0
  jldi j5, 5
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

; What the melody heard says: its notes as heard for "it answers" over all heard for it, less the same for "it does
; not" (in millionths) -> j2. Uses j1-j8, j10-j14 (keeps j9, j15).
share:
  jldi j8, 1
  jcall sh_one
  jldi j1, 0
  jst j2, j1, SC1
  jldi j8, 0
  jcall sh_one
  jldi j1, 0
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
