; The meaning (Capitan, 2026-11-06: "first separate the skeleton and give it a meaning, and give the core or cores a
; meaning, and then see which structural meaning gives sense to the core meaning"; "artificial reasoning, not
; statistical"). Razar reasons, it does not vote.
;
; A skeleton is the structure between two cores: "A , padre de B", "A de B", "A y B" (one to three pieces in the middle,
; the two ends words, no marks). Its meaning is not counted: it is proved, from the pairs of cores the book says with
; it, and each property holds when two different pairs at least show it (the anecdote rule), with its proof:
;   it chains:        A m B and B m C (padre de padre);
;   it is symmetric:  A m B and B m A said both;
;   it turns:         another skeleton says the same pairs turned (padre de <-> hijo de);
;   it is the same:   another skeleton says the same pairs the same way;
;   it is denied:     the book says it with the switch too (the no of negacion.inc), and said and denied at once is a
;                     contradiction, shown.
; Silhouettes, not data (Capitan: "a human memory would fill up; keep silhouettes and recognize them on the fly"). What
; is kept is the skeletons and what they prove, and between two cores only the last form they were seen in: every fact
; is met with that form as it is read, proves what it proves, and is forgotten. The cores asked are answered in a
; second reading, recognizing the silhouettes as the text goes by: the meaning of a core is the facts it is in, and a
; skeleton that turns gives the turned fact the book does not say, with its why. The tables grow to what they hold.
; The cores asked about are the words of the file "q", one per line. Its counts go into j0.
S_LIBRO = 0
S_P     = 10h
S_Q     = 18h
S_HEAD  = 40h
S_PAIRS = 80h
S_NEGS  = 0C0h
S_PAIRW = 100h
S_CHAIN = 140h
S_SYM   = 180h
S_DENY  = 1C0h
S_TURNS = 200h
S_SAME  = 240h
S_CONTRA = 280h
S_CORE  = 2C0h
S_DED   = 300h
S_BEC   = 340h
S_BTURN = 380h
S_NOBOOK = 400h
S_NOMEM = 440h
S_SKTOP = 480h
S_TURN  = 4C0h                  ; (the pulses write it too)
S_FLIPS = 4C0h
S_MEM   = 500h
S_LIMS  = 540h
S_WAIT  = 580h
S_NOT   = 5C0h
S_TILL  = 600h
S_OPEN  = 640h
S_GOES  = 680h
S_OTHER = 6C0h
S_ASKQ  = 700h                  ; a question: its line, an answer, said by the book, deduced, no relation fits
S_ANS   = 740h
S_ENG   = 780h                  ; "tablero/enganches-"
S_DEDQ  = 7C0h
S_NOFIT = 800h
S_ARROW = 840h                  ; the arrows found
S_SILS  = 8C0h                  ; "siluetas", and what was taken from it
S_SILT  = 900h
S_SILA  = 940h
S_PENS  = 985h                  ; "pensar": the words a thought ran out of facts on
S_COME  = 980h                  ; eating: "come", the library's label of the skeletons, what it says
S_PRQ   = 990h                  ; "tablero/preguntas-"
S_ESQ   = 9C0h
S_ESQD  = 0A00h
S_LIBP  = 0A40h                 ; ", pairs proved in the library"
S_QAN   = 0A80h                 ; the book's questions, and those with a core in the answer next to them
S_QAM   = 0AC0h
S_QAL   = 0AE0h                 ; what they taught
S_GLU   = 8D0h                  ; the glue between constructions
S_GLD   = 8E0h
S_DIA   = 8C9h                  ; "diario": what it thought
S_PNSE  = 9D8h                  ; " (lo pense)": an answer it thought
S_USA   = 20h                   ; " (asi se usa)": how a structure asked about is used
S_FUN   = 110h                  ; "tablero/funciones-": the dictionary of instructions
S_INS   = 128h                  ; "instrucciones:"
S_ORT   = 0A0h                  ; "tablero/ortografia": the spelling the books proved
S_GEN   = 9B8h                  ; "genoma": its own seed
S_THQ   = 9A4h                  ; the question it asks itself
S_LNH   = 214h                  ; the languages' manuals (in the gaps)
S_MKH   = 310h                  ; the marks' work (in the gaps)
S_MCAP  = 34Ch
S_MNL   = 358h
S_MAB   = 368h
S_MCI   = 370h
S_MSE   = 392h
S_MNU   = 39Ah
S_MPG   = 3AAh
S_MPA   = 3CEh
S_LNU   = 258h
S_LNP   = 2A0h
S_LNS   = 2D8h
S_SKH   = 0D0h                  ; the structures with their kin, what they do alike and alone (in the gaps)
S_SKI   = 158h
S_SKJ   = 190h
S_SKK   = 1D0h

NSK   = 1930h                   ; skeletons, pairs, denied pairs
NPR   = 1938h
NNG   = 1940h
WJ    = 1948h                   ; walking: the unit, the middle's length, units left
WM    = 1950h
WL    = 1958h
WA    = 1960h                   ; the fact being built: its ends, its skeleton, denied, the middle's start
WB    = 1968h
WK    = 1970h
WN    = 1978h
WP    = 1980h
FE    = 1988h                   ; a skeleton looked at
TBEST = 19A0h                   ; the best partner of a skeleton: which, how many pairs
TBN   = 19A8h
QSI   = 19B0h                   ; the cores asked: where, the one asked
QCW   = 19B8h
TOPN2 = 19C0h
FI2   = 19C8h                   ; (temporaries)
FI3   = 19D0h
FI4   = 19D8h
KPT   = 19E0h
PMT   = 19E8h
BPT   = 1A10h                   ; best_partner: turned or not
MB1   = 1A18h                   ; two middles, piece by piece (three each), and how many in the second
MB2   = 1A30h
MN2   = 1A48h
TMI   = 1C10h                   ; the tables, each {its place, places minus 1, entries, bytes a place}: the skeletons
TMIM  = 1C18h                   ; {key, pairs, a place it is said, its length, chains, symmetric, denied,
TMIN  = 1C20h                   ; contradictions} (64)
TPM   = 1C30h                   ; the last form of each two cores: {key of the two, skeleton, left core, denied} (32)
TPMM  = 1C38h
TPMN  = 1C40h
TLF   = 1C50h                   ; where each skeleton starts and ends: {key of skeleton, core, side} (8)
TLFM  = 1C58h
TLFN  = 1C60h
TMM   = 1C70h                   ; between skeletons: {key, m, m', turned, pairs} (40)
TMMM  = 1C78h
TMMN  = 1C80h
TSN   = 1C90h                   ; what was said of the core asked: {key} (8), one table each
TSNM  = 1C98h
GMODE = 1CB0h                   ; what a window is for: 1 learn, 2 the meaning of the core asked, 3 its deductions,
                                ; 4 and 5 the same for a core of a question, only what fits it
QQS   = 1A50h                   ; a question: its first unit, past its last, where its core is, how many answers
QQE   = 1A58h
QP    = 1A60h
QNA   = 1A68h
QSIDE = 1A70h                   ; fitting: the core's side in the fact (0 left, 1 right), the other core
QOTH  = 1A78h
QU    = 1A80h                   ; a piece of the question being matched
QCV   = 1A88h                   ; how much of the question a fit explains (its core and the middle's words), the pass
QPASS = 1A90h                   ; (0 finds the most any relation explains, 1 says the ones that explain that much), and
QBEST = 1A98h                   ; the most
ROOMAR = 1AA0h                  ; by word {buildings it is in, the limit most of them close with (voted), how many}
ROOMCN = 1AA8h                  ; by limit: how many buildings close with it; and all the buildings
NBLD  = 1AB0h
AST   = 1AB8h                   ; walking the buildings: where the one walked starts, and the pass (1 vote, 2 count)
AMODE = 1AC0h
QBC   = 1D50h                   ; hooks: the middle's word next to the core, the one next to the other core, a place
QBA   = 1D58h                   ; walked in the question, its neighbour, a word looked for, a side
QPOS  = 1D60h
QNB   = 1D68h
QWL   = 1D70h
QDIR  = 1D78h
QNBD  = 1D80h                   ; q_nb: its side, the place it is at, the word there
QNBP  = 1D88h
QNBW  = 1D90h
SILR  = 1D98h                   ; the library's silhouettes (pistas.inc writes them): the file read, its bytes, the
SILN  = 1DA0h                   ; room's bytes, its handle; by word, 1 arrow, 2 not (0: the piece decides); words taken,
SILC  = 1DA8h                   ; arrows among them; walking; the reading's pass kept
SILH  = 1DB0h
ROOMAX = 1DB8h
SILNW = 1DC0h
SILNA = 1DC8h
SILP  = 1DD0h
SILPS = 1DD8h
EATON = 1DE0h                   ; eating a book (the address in "come"): 1 if so; the address's room and bytes; the print
EATP  = 1DE8h                   ; of its bytes; the file written, its bytes, where it writes; walking; relations kept
EATN  = 1DF0h
EATH  = 1DF8h
EOUT  = 1E00h
EOSZ  = 1E08h
EPOS  = 1E10h
EI    = 1E18h
ECNT  = 1E20h
EHND  = 1E28h
ELAB  = 1E30h
ET1   = 1E38h
ET2   = 1E40h
EBUF  = 1E48h                   ; (three pieces of a middle, then three of the other: 6 qwords)
EN2   = 1E78h                   ; the other middle's pieces; a piece walked
EK    = 1E80h
SXR   = 0B00h                   ; the library's turns: a file read whole (room, bytes, room's bytes, handle); the folder's
SXN   = 0B08h                   ; labels (room, how many, room's bytes); by two skeletons' prints {key, pairs summed, the
SXC   = 0B10h                   ; other's pieces, how many, this one's print} (a growing table); by skeleton's print its
SXH   = 0B18h                   ; best turn {print, pairs, the other's pieces, how many}; walking; a middle's pieces
LSTR  = 0B20h
LSTN  = 0B28h
LSTC  = 0B30h
LREL  = 0B40h
LBEST = 0B60h
LP    = 0B80h
LI    = 0B88h
LT1   = 0B90h
LT2   = 0B98h
LT3   = 0BA0h
LT4   = 0BA8h
LNR   = 0BB0h
LPB   = 0BB8h
LPC   = 0BC0h                   ; (three pieces)
LPP   = 0BD8h                   ; the turn's pairs
SBB   = 0BE0h                   ; the turns in bits: the stream's first byte, the bit it is at, its bytes (reading)
SBP   = 0BE8h
SBL   = 0CA8h
DTAB  = 0BF0h                   ; the pieces' dictionary: by letters {key, its index + 1} (a growing table), each
DLST  = 0C10h                   ; index's piece, how many, the bits of an index; walking; the relations, the room
DNP   = 0C18h                   ; written and its bytes, where it writes, the bit where the relations start; gamma's
DAB   = 0C20h                   ; number and its bits; the book's print unsalted; a relation {turned, pairs, the
DT1   = 0C28h                   ; pieces of each middle}
DT2   = 0C30h
DT3   = 0C38h
DT4   = 0C40h
DNR   = 0C78h
DOUT  = 0C48h
DSZ   = 0C50h
DPOS  = 0CA0h
DSV   = 0C58h
SGV   = 0C60h
SGN   = 0C68h
EATB  = 0C70h
DR0   = 0C80h
DR1   = 0C88h
DR2   = 0C90h
DR3   = 0C98h
QAS   = 0CB0h                   ; the book's questions: the building before (its start, its end, 1 if it asks), the one
QAE   = 0CB8h                   ; walked starts at, how many questions, how many with a core in the answer next to them;
QAQ   = 0CC0h                   ; walking
QAT   = 0CC8h
QAN   = 0CD0h
QAM   = 0CD8h
QAI   = 0CE0h
QAX   = 0CE8h
QLT   = 0D00h                   ; what the book's questions taught: by hook and its side in the question {key, answers
QLC   = 0D20h                   ; with the core before the hook, after it} (a table that grows); learning: the core, its
QLP   = 0D28h                   ; place in the answer and in the question, the window's length, the hook, the core's
QLQ   = 0D30h                   ; side in the answer, the pairs learned, a place kept
QLW   = 0D38h
QLH   = 0D48h
QLS   = 0D50h
QLN   = 0D58h
QLK   = 0D60h
GFL   = 0D68h                   ; the glue between constructions: the facts of proved skeletons in the book's order
GFN   = 0D70h                   ; {start, end, skeleton} and how many; by glue {key, times, where seen, how far} and by
GLT   = 0D80h                   ; construction {key, times} (tables that grow); joinings; walking: a fact, the first,
GKT   = 0DA0h                   ; its end, a half search, how far the other starts, its skeleton, the glue's print
GLN   = 0DC0h
GI    = 0DC8h
GP    = 0DD0h
GLE   = 0DD8h
GT1   = 0DE0h
GT2   = 0DE8h
GJ    = 0DF0h
GK2   = 0DF8h
GT3   = 0E00h
THGO  = 0E08h                   ; 1 if the branch chosen asks what the question asks
THX   = 0E10h                   ; thinking on: the word and the skeleton it goes on from, the words thought on {key} (a
THCH  = 0E18h                   ; (the route so far) table that grows), the best composition's times, its skeleton, the word that answers
TVT   = 0E20h                   ; it, walking, its skeleton's entry, a skeleton looked for, a fact walked, a word
THB   = 0E40h
THC   = 0E48h
THY   = 0E50h
TI    = 0E58h
TJ    = 0E60h
THE   = 0E68h
THF   = 0E70h
THI   = 0E78h
THG   = 0E80h
THWG  = 0E88h                   ; the votes of the branches that ask what the question asks
WNT   = 0EB0h                   ; the words it wants to read again (pensar): by word {key} (a table that grows), their
PNB   = 0ED0h                   ; letters a line each (a room that grows), its bytes, its room's bytes
PNN   = 0ED8h
PNC   = 0EE0h
THR   = 0EE8h                   ; thinking on, once a reading: built; by word its first fact + 1; by fact the next one's;
THH   = 0EF0h                   ; by skeleton the books' times going on with it {key, times} (a table that grows); the
THN   = 0EF8h                   ; row of words to think on, its head, its tail
KCT   = 0F00h
THQ   = 0F20h
THQH  = 0F28h
THQT  = 0F30h
GEN   = 0F38h                   ; its genome, its history, its seed's lottery, the votes of a word's branches, the
HIST  = 0F40h                   ; place chosen among them, the pass (0 votes, 1 chooses), a branch's votes
THRS  = 0F48h
THW   = 0F50h
THP   = 0F58h
THPS  = 0F60h
THV   = 0F68h
DIA   = 0F70h                   ; its diary: by thought's print {key, times} (a table that grows); its print; 1 when it
DIAH  = 0F90h                   ; thought something; the file's bytes and room; this word's thoughts met {key}; a
DIAW  = 0F98h                   ; thought's print; a branch's votes
DIAN  = 0FA0h
DIAB  = 0FA8h
THSN  = 0FB0h
THK2  = 0FD0h
THVV  = 0FD8h
QSW   = 5020h                   ; a question about a structure: its word, its times in the book, at an end; its
QSO   = 5028h                   ; skeleton's key and entry; by fact {key, times} (a table that grows); the most, walking,
QSL   = 5030h                   ; a fact's ends, the most said one's
QSK   = 5038h
QST   = 5040h
QSE   = 5060h
QSB   = 5068h
QSN   = 5070h
QSX   = 5078h
QSY   = 5080h
QSA   = 5088h
QSZ   = 5090h
SILSW = 5130h                   ; a silhouette's switch of the no (1: the books took the word for one)
ORT   = 5300h                   ; the spelling: by pair of letters {key, words} (the library's), this book's; walking:
ORE   = 5320h                   ; letters, how many left, the routine for each pair (0 judge, 1 count), it keeps the rule,
ORP   = 5340h                   ; spelling seen; by word its times; a word, a candidate, its times, the best and its
ORN   = 5348h                   ; times, words fixed, kept
ORF   = 5350h
ORK   = 5358h
ORS   = 5360h
ORC   = 5368h
ORW   = 5370h
ORV   = 5378h
ORVN  = 5380h
ORBEST = 5388h
ORBN  = 5390h
ORFX  = 5398h
ORA   = 53A0h
ORB   = 53A8h
ORL   = 53B0h
QPK   = 5400h                   ; the subject's paragraph: by kind of relation {key, votes} (a table that grows); walking;
QPA   = 5420h                   ; the clauses, the one said; a kind, its votes, the seed's place; the glue, the
QPB   = 5428h                   ; instruction that joins
QPN   = 5430h
QPI   = 5438h
QPE   = 5440h
QPV   = 5448h
QPP   = 5450h
QPG   = 5458h
QPJ   = 5460h
QPRS  = 5468h                   ; a clause's rest: where its fact starts, the place walked, the limit met, a unit, an arrow
QPRP  = 5470h
QPRL  = 5478h
QPRW  = 5480h
QPRA  = 5488h
QPGU  = 5490h                   ; guided: the fact's, the kinds left, walking the middle and the question
QPGF  = 5498h
QPGN  = 54A0h
QPGA  = 54A8h
QPGB  = 54B0h
QPGW  = 54B8h
QPGQ  = 54C0h
QPGX  = 54C8h
CTX   = 5500h                   ; families: contexts seen, by context its instructions' list, shared by two {key, a,
GRP   = 5520h                   ; b, shared}; the lists and their next; by word its kin {word, share} and its family's
PRT   = 5540h                   ; root; walking
LNK   = 5560h
LNKN  = 5568h
NEAR  = 5570h
FAM   = 5578h
FT1   = 5580h
FT2   = 5588h
FT3   = 5590h
FT4   = 5598h
FT5   = 55A0h
FT6   = 55A8h
FT7   = 55B0h
FT8   = 55B8h
FT9   = 55C0h
SKC   = 5600h                   ; equivalent structures: (skeleton, ends) seen, by pair its skeletons' list, by skeleton
SKG   = 5620h                   ; its pairs, by two skeletons the pairs in common {key, a, b, shared}, what was said;
SKN   = 5640h                   ; the lists; walking, the fact, its skeleton, its ends; the lottery (its pairs, the
SKP   = 5660h                   ; shares, the pass, the place); its first word said, where the last ended, the first of
SKD   = 5680h                   ; a span, from where, to where; a walk said or silent
SKL   = 56A0h
SKLN  = 56A8h
SKU   = 56B0h
SKF   = 56B8h
SKS   = 56C0h
SK2   = 56C8h
SK3   = 56D0h
SK4   = 56D8h
SK5   = 56E0h
SK6   = 56E8h
SK7   = 56F0h
SK8   = 56F8h
SK9   = 5700h
SKO   = 5708h
SKNS  = 5710h
SKW   = 5718h
SKM   = 5720h
SKR   = 5728h
SKH   = 5730h
SKE   = 5738h
SKBF  = 5740h
SKFR  = 5748h
SKT   = 5750h
SKQ   = 5758h
SKMP  = 5760h                   ; variants in the library: by number the keys (or what is written), the file's end, a
SKEN  = 5768h                   ; count walked, a piece walked, how many more pairs in common
SKCN  = 5770h
SKLP  = 5778h
SKCC  = 5780h
SKRS  = 5788h                   ; the kin reported: the best share, its key, the last said, its key, how many, the
SKRK  = 5790h                   ; best's entry; a share's entry, each one's pairs; a structure said; the dictionary's
SKRP  = 5798h                   ; version
SKRQ  = 57A0h
SKRN  = 57A8h
SKRE  = 57B0h
SKX0  = 57C8h
SKX1  = 57D0h
SKX2  = 57D8h
SKX3  = 57E0h
SKV   = 57E8h
SKX4  = 57F0h
QPAS  = 5800h                   ; a fact walked against the question: where, its end, a word
QPAE  = 5808h
QPAW  = 5810h
QPTI  = 5818h                   ; the paragraph's level: 0 the proven, 1 what names the subject once, 2 both
INS   = 5200h                   ; the dictionary of instructions: its room (by word, INSQ bytes); walking: a word, a
INSW  = 5208h                   ; word looked at, a unit, a way, an entry
INSW2 = 5210h
INSI  = 5218h
INSK  = 5220h
INSE  = 5228h
LINEO = 50A0h                   ; 1 while a sentence is being woven (its last word the one thought from)
DKIND = 5098h                   ; what the bits hold: 0 the turns, 1 the compositions ({times, pieces} an entry)
TCS   = 5000h                   ; the question's furniture a thought already used {key} (a table that grows)
DRC   = 0FE0h                   ; by thought, the different routes it was reached by {key, routes} (a table that grows)
CKT   = 0E90h                   ; the compositions eaten: by skeleton {key, times} (a table that grows)
FLS   = 1CB8h                   ; learning: the skeleton's place, the pair's, turned
FLP   = 1CC0h
FLT   = 1CC8h
KST   = 1CD0h                   ; a side
MA1   = 1CD8h                   ; mm_add: m, m', turned
MA2   = 1CE0h
MA3   = 1CE8h
WSK   = 1CF0h                   ; the skeleton of the window met
ROOMGN = 1D18h                  ; by word: its gender and the genders seen next to it (see genders)
GNG   = 1D20h                   ; finding them: a gender, the word, the words left
GNW   = 1D28h
GNL   = 1D30h
GST   = 1D38h                   ; a deduction by gender: 0 holds, 1 waits, 2 falls; the core and the piece that decided
GFC   = 1D40h
GFP   = 1D48h
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jcall eat_mode                  ; a book to eat, if "come" names one: read there, and its skeletons kept for every Razar
jldi j0, 0
jcall read_book
jcall ort_load                  ; the spelling the books proved: a word that keeps no rule is read as its well written one
jcall ort_fix
jldi j1, 0                      ; its languages, by context; asked, it is read with the question's own
jld j2, j1, EATON
jjnz j2, ln_eating
jcall ln_scan
jcall ln_ask
ln_eating:
jldi j1, 0                      ; the whole book, none kept apart; the house (which are cores), the switch
jldi j2, 0
jshi j2, 4000h
jshi j2, 0
jshi j2, 0
jshi j2, 0
jst j2, j1, PK
jcall learn_pulses
jcall house_decide
jcall distill_no
jcall limits                    ; where each building ends, found in the book
jcall sil_load                  ; over a piece read again, the library's silhouettes, if they came (the console): read
                                ; with them before a fact is learned
jcall genders                   ; the gender of each word, from its twins

jldi j2, TMI                    ; its tables, empty: they grow to what they hold
jldi j3, 64
jcall pl_new
jldi j2, TPM
jldi j3, 32
jcall pl_new
jldi j2, TLF
jldi j3, 8
jcall pl_new
jldi j2, TMM
jldi j3, 40
jcall pl_new
jldi j1, 0                      ; the book read once: every fact proves what it proves, and is forgotten
jldi j2, 1
jst j2, j1, GMODE
jcall gather
jldi j1, 0                      ; eaten: what it proved between skeletons goes to the library, and nothing is asked
jld j2, j1, EATON
jjz j2, not_eating
jcall arrows_calc               ; and what its own questions taught, and its compositions
jcall qa_scan
jcall glue_scan
jcall eat_write
jcall qa_eat
jcall eng_eat
jcall ins_scan                  ; and how it uses each instruction: the dictionary
jcall fam_scan                  ; with what each one joins: its families
jcall sk_init                   ; and its structures, instructions of several words, with their kin
jcall sk_scan
jcall ins_eat
jcall ort_eat                   ; and its spelling
jjmp finish
not_eating:

jldi j1, S_HEAD
jcall puts
jld j2, j1, NSK
jcall putmix
jldi j1, S_PAIRS
jcall puts
jld j2, j1, NPR
jcall putmix
jldi j1, S_NEGS
jcall puts
jld j2, j1, NNG
jcall putmix
jldi j1, S_MEM                  ; what the silhouettes take, in bytes
jcall puts
jldi j11, 0
jldi j2, TMI
jcall pl_bytes
jldi j2, TPM
jcall pl_bytes
jldi j2, TLF
jcall pl_bytes
jldi j2, TMM
jcall pl_bytes
jadd j2, j11, j1
jcall putnum
jldi j2, 10
jcall putch
jcall flush
jldi j1, S_LIMS                 ; the limits found: the marks that close a building
jcall puts
jldi j9, 1
jld j10, j1, NV
jldi j2, 1
jsub j10, j10, j2
jwhile j10
  jldi j1, 0
  jldi j3, 24
  jmul j3, j9, j3
  jld j4, j1, ROOMCL
  jadd j3, j3, j4
  jld j3, j3, 0
  jjz j3, lm2_next
  jldi j2, 32
  jcall putch
  jadd j2, j9, j1
  jcall putword
lm2_next:
  jldi j1, 0
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jldi j2, 10
jcall putch
jcall flush
jcall arrows                    ; the words that live in a limit most buildings do not close: what a question asks
jcall qa_scan                   ; the book's own questions, and the answers next to them
jcall glue_count                ; how the book joins its constructions
jcall ins_room                  ; (the dictionary of instructions, filled by the library's books)
jcall sk_init                   ; (the equivalent structures, filled by the library's books)
jcall lib_load                  ; the turns every book proved (sentido eating), summed: what a piece cannot prove
jcall qa_write_out              ; (and what the books' questions taught, the library's summed in)
jcall fam_build                 ; its families, from what the books share
jcall ins_report                ; the dictionary of instructions, as the books proved it
jcall sk_kinrep                 ; and its structures with their kin
jcall ln_report                 ; and the manual of each language
jcall mk_report                 ; and what each mark does
jcall sk_report
jcall cores
jjmp finish


; Every window of the book: two words at the ends, one to three pieces between, each window a fact of its skeleton.
; The switch in the middle is taken out and the fact is a denied one. Uses j1-j14.
gather:
  jldi j1, 0
  jst j1, j1, WJ
  jld j2, j1, NTOK
  jst j2, j1, WL
  jwhile j2
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, WM
    ga_len:
      jldi j1, 0
      jld j2, j1, WM
      jldi j3, 4
      jsub j3, j2, j3
      jjz j3, ga_next
      jcall g_window
      jldi j1, 0
      jld j2, j1, WM
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, WM
      jjmp ga_len
  ga_next:
    jldi j1, 0
    jld j2, j1, WJ
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, WJ
    jld j2, j1, WL
    jsub j2, j2, j3
    jst j2, j1, WL
  jwend
  jret

; The window at WJ with WM pieces between: a fact, if its ends are words (not marks, not the switch) and it is all
; pieces. Uses j1-j14.
g_window:
  jldi j1, 0
  jld j9, j1, WJ                ; past the row?
  jld j2, j1, WM
  jadd j9, j9, j2
  jldi j2, 1
  jadd j9, j9, j2
  jld j2, j1, NTOK
  jsub j2, j9, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, gw_none
  jld j2, j1, WJ
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMT
  jadd j10, j2, j3              ; where it starts
  jld j2, j10, 0
  jst j2, j1, WA
  jcall g_core
  jjz j3, gw_none
  jld j2, j1, WM
  jldi j3, 1
  jadd j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jadd j2, j2, j10
  jld j2, j2, 0
  jst j2, j1, WB
  jcall g_core
  jjz j3, gw_none
  jldi j1, 0                    ; the middle: all pieces; the switch out (denied); its key
  jst j1, j1, WN
  jld j2, j1, FNVO
  jst j2, j1, WK
  jld j11, j1, WM
  jldi j12, 8
  jadd j12, j12, j10
  jldi j13, 0                   ; pieces kept
  jwhile j11
    jldi j1, 0
    jld j2, j12, 0
    jjz j2, gw_none
    jst j2, j1, FE              ; a piece that closes a building: the window crosses into another, no fact
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjnz j3, gw_none
    jld j2, j1, FE
    jst j2, j1, FE
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjz j3, gw_keep
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, WN
    jjmp gw_step
  gw_keep:
    jldi j1, 0
    jld j2, j1, WK
    jld j3, j1, FE
    jcall hw
    jst j2, j1, WK
    jldi j2, 1
    jadd j13, j13, j2
  gw_step:
    jldi j2, 8
    jadd j12, j12, j2
    jldi j2, 1
    jsub j11, j11, j2
  jwend
  jjz j13, gw_none              ; nothing but the switch between
  jldi j1, 0
  jld j2, j1, WK
  jadd j3, j13, j1
  jcall hw
  jjnz j2, gw_k
  jldi j2, 1
gw_k:
  jst j2, j1, WK
  jld j2, j1, WJ
  jst j2, j1, WP
  jld j2, j1, GMODE             ; learned, or met by the core asked
  jldi j3, 1
  jsub j3, j2, j3
  jjnz j3, gw_meet
  jjmp f_learn
gw_meet:
  jldi j3, 6                    ; (6: listed, for the glue between constructions)
  jsub j3, j2, j3
  jjz j3, f_glue
  jjmp f_meet
gw_none:
  jret

; j3 = 1 if the piece j2 can be a core: a word, not a mark, not the switch, not a foundation of the house (the
; skeleton separated first: the cores are what the house left as furniture, or did not decide). Uses j1-j5.
g_core:
  jldi j1, 0
  jjz j2, gc_no
  jst j2, j1, PMT
  jcall w_mark
  jjnz j3, gc_no
  jldi j1, 0
  jld j2, j1, PMT
  jcall n_flags
  jldi j4, 1
  jand j3, j3, j4
  jjnz j3, gc_no
  jldi j1, 0
  jld j2, j1, PMT
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMSD
  jadd j3, j3, j4
  jld j3, j3, 0
  jldi j4, 63
  jsar j4, j3, j4
  jjnz j4, gc_yes
  jjnz j3, gc_no
gc_yes:
  jldi j3, 1
  jret
gc_no:
  jldi j3, 0
  jret
; The fact WA WK WB (WN: denied) as it is read. Its skeleton counts it, and it is met with the last form its two cores
; were seen in, the only thing kept of them: the same skeleton the other way is symmetric, the same said and denied a
; contradiction, another skeleton one pair more between the two (turned or not). Said again the same way it is nothing
; new. Then it is kept as their last form, and an affirmed one looks for its chain. Uses j1-j14.
f_learn:
  jldi j1, 0
  jld j5, j1, WK                ; its skeleton
  jldi j2, TMI
  jcall pl_take
  jjz j6, fl_sk
  jld j7, j1, WP
  jst j7, j4, 16
  jld j7, j1, WM
  jst j7, j4, 24
  jld j7, j1, NSK
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j1, NSK
fl_sk:
  jst j4, j1, FLS               ; (its place: no skeleton is put in before it is counted)
  jld j2, j1, WA                ; the two cores, whichever way: their key
  jld j3, j1, WB
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, fl_ord
  jadd j4, j2, j1
  jadd j2, j3, j1
  jadd j3, j4, j1
fl_ord:
  jcall k_pair
  jldi j2, TPM
  jcall pl_take
  jst j4, j1, FLP
  jjnz j6, fl_keep
  jld j7, j4, 8                 ; met with their last form
  jld j8, j1, WK
  jsub j7, j7, j8
  jjnz j7, fl_other
  jld j7, j4, 16
  jld j8, j1, WA
  jsub j7, j7, j8
  jjnz j7, fl_sym
  jld j7, j4, 24                ; the same, the same way: said again, or said and denied
  jld j8, j1, WN
  jsub j7, j7, j8
  jjz j7, fl_done
  jld j3, j1, FLS
  jld j7, j3, 56
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j3, 56
  jjmp fl_keep
fl_sym:
  jld j7, j4, 24                ; the same skeleton the other way, both affirmed
  jld j8, j1, WN
  jor j7, j7, j8
  jjnz j7, fl_keep
  jld j3, j1, FLS
  jld j7, j3, 40
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j3, 40
  jjmp fl_keep
fl_other:
  jld j7, j4, 24                ; another skeleton, both affirmed: one pair more between the two, both ways
  jld j8, j1, WN
  jor j7, j7, j8
  jjnz j7, fl_keep
  jld j7, j4, 16
  jld j8, j1, WA
  jsub j12, j7, j8
  jjz j12, fl_t
  jldi j12, 1
fl_t:
  jst j12, j1, FLT
  jld j11, j1, WK
  jld j10, j4, 8
  jcall mm_add
  jldi j1, 0
  jld j4, j1, FLP
  jld j11, j4, 8
  jld j10, j1, WK
  jld j12, j1, FLT
  jcall mm_add
fl_keep:
  jldi j1, 0                    ; kept as their last form, and counted
  jld j4, j1, FLP
  jld j7, j1, WK
  jst j7, j4, 8
  jld j7, j1, WA
  jst j7, j4, 16
  jld j7, j1, WN
  jst j7, j4, 24
  jld j3, j1, FLS
  jldi j8, 1
  jjnz j7, fl_neg
  jld j7, j3, 8
  jadd j7, j7, j8
  jst j7, j3, 8
  jld j7, j1, NPR
  jadd j7, j7, j8
  jst j7, j1, NPR
  jjmp fl_chain
fl_neg:
  jld j7, j3, 48
  jadd j7, j7, j8
  jst j7, j3, 48
  jld j7, j1, NNG
  jadd j7, j7, j8
  jst j7, j1, NNG
fl_done:
  jret

; It chains: a fact of the same skeleton starts where this one ends, or ends where it starts. Then this one's start
; and end are kept. Uses j1-j14.
fl_chain:
  jld j2, j1, WK
  jld j3, j1, WB
  jldi j4, 1
  jcall k_side
  jldi j2, TLF
  jcall pl_find
  jld j7, j4, 0
  jjz j7, fc_end
  jcall fc_one
fc_end:
  jld j2, j1, WK
  jld j3, j1, WA
  jldi j4, 2
  jcall k_side
  jldi j2, TLF
  jcall pl_find
  jld j7, j4, 0
  jjz j7, fc_keep
  jcall fc_one
fc_keep:
  jld j2, j1, WK
  jld j3, j1, WA
  jldi j4, 1
  jcall k_side
  jldi j2, TLF
  jcall pl_take
  jldi j1, 0
  jld j2, j1, WK
  jld j3, j1, WB
  jldi j4, 2
  jcall k_side
  jldi j2, TLF
  jjmp pl_take

; One chain more for the skeleton learned. Uses j1, j3, j7, j8.
fc_one:
  jldi j1, 0
  jld j3, j1, FLS
  jld j7, j3, 32
  jldi j8, 1
  jadd j7, j7, j8
  jst j7, j3, 32
  jret

; The key of skeleton j2, core j3, side j4 -> j5. Uses j1-j4.
k_side:
  jldi j1, 0
  jst j3, j1, KPT
  jst j4, j1, KST
  jadd j3, j2, j1
  jld j2, j1, FNVO
  jcall hw
  jld j3, j1, KPT
  jcall hw
  jld j3, j1, KST
  jcall hw
  jjnz j2, ks_k
  jldi j2, 1
ks_k:
  jadd j5, j2, j1
  jret

; The key of the pair j2 j3 (in that order) -> j5. Uses j1-j4.
k_pair:
  jldi j1, 0
  jadd j4, j3, j1
  jadd j3, j2, j1
  jld j2, j1, FNVO
  jst j4, j1, KPT
  jcall hw
  jld j3, j1, KPT
  jcall hw
  jjnz j2, kp_k
  jldi j2, 1
kp_k:
  jadd j5, j2, j1
  jret

; The key of the affirmed fact j3 (skeleton key j2) j4 -> j5, as f_add makes it. Uses j1-j4.
f_key:
  jldi j1, 0
  jst j4, j1, FI2
  jcall hw
  jld j3, j1, FI2
  jcall hw
  jldi j3, 0
  jcall hw
  jjnz j2, fk_k
  jldi j2, 1
fk_k:
  jadd j5, j2, j1
  jret

; One pair more between skeletons j11 and j10, turned j12. Uses j1-j14.
mm_add:
  jldi j1, 0
  jst j11, j1, MA1
  jst j10, j1, MA2
  jst j12, j1, MA3
  jld j2, j1, FNVO
  jadd j3, j11, j1
  jcall hw
  jadd j3, j10, j1
  jcall hw
  jadd j3, j12, j1
  jcall hw
  jjnz j2, ma_k
  jldi j2, 1
ma_k:
  jadd j5, j2, j1
  jldi j2, TMM
  jcall pl_take
  jjz j6, ma_old
  jld j7, j1, MA1
  jst j7, j4, 8
  jld j7, j1, MA2
  jst j7, j4, 16
  jld j7, j1, MA3
  jst j7, j4, 24
ma_old:
  jld j6, j4, 32
  jldi j7, 1
  jadd j6, j6, j7
  jst j6, j4, 32
  jret

; The skeletons with the most pairs (two or more), each with what it means: its pairs and every property it proved
; (two cases or more). Uses j1-j14.
sk_report:
  jldi j1, S_SKTOP
  jcall puts
  jldi j2, 30
  jst j2, j1, TOPN2
  jwhile j2
    jldi j1, 0                  ; the most pairs left
    jldi j11, 1
    jldi j12, 0
    jldi j9, 0
    jld j10, j1, TMIM
    jldi j2, 1
    jadd j10, j10, j2
    jwhile j10
      jldi j3, 64
      jmul j3, j9, j3
      jld j2, j1, TMI
      jadd j3, j3, j2
      jld j2, j3, 0
      jjz j2, sr_next
      jld j2, j3, 8
      jsub j4, j11, j2
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, sr_next
      jadd j11, j2, j1
      jadd j12, j3, j1
    sr_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, sr_done
    jst j12, j1, FE
    jcall sk_line
    jldi j1, 0
    jld j12, j1, FE
    jldi j2, 0                  ; written: out of the count (its pairs kept negative)
    jld j3, j12, 8
    jsub j2, j2, j3
    jst j2, j12, 8
    jcall flush
    jldi j1, 0
    jld j2, j1, TOPN2
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, TOPN2
  jwend
sr_done:
  jret

; The line of the skeleton at FE: «its middle» n pairs | and each property proved. Uses j1-j14.
sk_line:
  jldi j2, 32
  jcall putch
  jldi j2, 32
  jcall putch
  jld j12, j1, FE
  jcall put_mid
  jld j12, j1, FE
  jld j2, j12, 8
  jcall putmix
  jldi j1, S_PAIRW
  jcall puts
  jld j12, j1, FE               ; it chains
  jld j2, j12, 32
  jldi j1, S_CHAIN
  jcall put_prop
  jld j12, j1, FE               ; symmetric
  jld j2, j12, 40
  jldi j1, S_SYM
  jcall put_prop
  jld j12, j1, FE               ; denied
  jld j2, j12, 48
  jldi j1, S_DENY
  jcall put_prop
  jld j12, j1, FE               ; said and denied at once
  jld j2, j12, 56
  jldi j1, S_CONTRA
  jcall put_prop
  jldi j12, 1                   ; turned: the skeleton that says its pairs turned
  jcall best_partner
  jld j2, j1, TBEST
  jjz j2, sl_same
  jldi j1, S_TURNS
  jcall puts
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jldi j2, 40
  jcall putch
  jld j2, j1, TBN
  jcall putmix
  jldi j2, 41
  jcall putch
sl_same:
  jldi j12, 0                   ; the same: the skeleton that says its pairs the same way
  jcall best_partner
  jld j2, j1, TBEST
  jjz j2, sl_end
  jldi j1, S_SAME
  jcall puts
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jldi j2, 40
  jcall putch
  jld j2, j1, TBN
  jcall putmix
  jldi j2, 41
  jcall putch
sl_end:
  jldi j2, 10
  jjmp putch

; A property proved (j2 cases, two or more) written with its text j1 and its cases. Uses j1-j4.
put_prop:
  jldi j3, 2
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, pp2_no
  jldi j4, 0
  jst j2, j4, PMT
  jcall puts
  jld j2, j1, PMT
  jcall putmix
  jldi j2, 41
  jjmp putch
pp2_no:
  jldi j1, 0
  jret

; The skeleton that shares the most pairs (two or more) with the skeleton at FE, turned j12 -> TBEST (its key, 0:
; none) and TBN. Uses j1-j14.
best_partner:
  jldi j1, 0
  jst j12, j1, BPT
  jst j1, j1, TBEST
  jldi j2, 1
  jst j2, j1, TBN
  jld j11, j1, FE
  jld j11, j11, 0               ; its key
  jldi j9, 0
  jld j10, j1, TMMM
  jldi j2, 1
  jadd j10, j10, j2
  jwhile j10
    jldi j3, 40
    jmul j3, j9, j3
    jld j2, j1, TMM
    jadd j3, j3, j2
    jld j2, j3, 0
    jjz j2, bp2_next
    jld j2, j3, 8
    jsub j2, j2, j11
    jjnz j2, bp2_next
    jld j2, j3, 24
    jld j4, j1, BPT
    jsub j2, j2, j4
    jjnz j2, bp2_next
    jld j2, j3, 32
    jld j4, j1, TBN
    jsub j4, j4, j2
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, bp2_next
    jst j3, j1, FI3             ; a counterexample (a pair shared the other way) and it is no such partner
    jst j2, j1, FI4
    jld j2, j1, FNVO
    jadd j3, j11, j1
    jcall hw
    jld j3, j1, FI3
    jld j3, j3, 16
    jcall hw
    jldi j3, 1
    jld j4, j1, BPT
    jsub j3, j3, j4
    jcall hw
    jjnz j2, bp2_k
    jldi j2, 1
  bp2_k:
    jadd j5, j2, j1
    jldi j2, TMM
    jcall pl_find
    jld j6, j4, 0
    jld j3, j1, FI3
    jjnz j6, bp2_next
    jld j2, j3, 16              ; a door is the same skeleton with one difference: else no partner
    jcall find_mid
    jcall one_diff
    jldi j1, 0
    jld j3, j1, FI3
    jjz j2, bp2_next
    jld j2, j1, FI4
    jst j2, j1, TBN
    jld j2, j3, 16
    jst j2, j1, TBEST
  bp2_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret


; j2 = 1 if the skeleton at j12 is the one at FE with one difference: as many pieces (the switch out, two or more:
; something the same) and exactly one of them other (the same structure, one piece changed: padre de / hijo de).
; Uses j1-j8, j13.
one_diff:
  jldi j13, MB2
  jcall m_collect
  jldi j1, 0
  jst j2, j1, MN2
  jld j12, j1, FE
  jldi j13, MB1
  jcall m_collect
  jldi j1, 0
  jld j3, j1, MN2
  jsub j3, j2, j3
  jjnz j3, od_no
  jldi j3, 2                    ; and something the same, for the difference to be one: two pieces or more
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, od_no
  jldi j5, 0                    ; how many differ
  jldi j6, 0
  jwhile j2
    jldi j3, 3
    jshl j3, j6, j3
    jld j4, j3, MB1
    jld j3, j3, MB2
    jsub j4, j4, j3
    jjz j4, od_same
    jldi j4, 1
    jadd j5, j5, j4
  od_same:
    jldi j4, 1
    jadd j6, j6, j4
    jsub j2, j2, j4
  jwend
  jldi j4, 1
  jsub j5, j5, j4
  jjnz j5, od_no
  jldi j2, 1
  jret
od_no:
  jldi j2, 0
  jret

; The pieces of the middle of the skeleton at j12 (the switch out) to the buffer j13 -> j2 how many. Uses j1-j8.
m_collect:
  jldi j1, 0
  jld j7, j12, 16
  jld j8, j12, 24
  jldi j6, 0
  jwhile j8
    jldi j1, 0
    jldi j2, 1
    jadd j7, j7, j2
    jldi j2, 3
    jshl j2, j7, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jst j2, j1, PMT
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjnz j3, mc_skip
    jld j2, j1, PMT
    jldi j3, 3
    jshl j3, j6, j3
    jadd j3, j3, j13
    jst j2, j3, 0
    jldi j3, 1
    jadd j6, j6, j3
  mc_skip:
    jldi j2, 1
    jsub j8, j8, j2
  jwend
  jadd j2, j6, j1
  jret

; The skeleton of key j2 -> j12 at its place. Uses j1-j8.
find_mid:
  jadd j5, j2, j1
  jldi j2, TMI
  jcall pl_find
  jadd j12, j4, j1
  jret

; The middle of the skeleton at j12, written between quotes (its pieces where it is said, the switch out). Uses j1-j9.
put_mid:
  jldi j1, 0
  jld j9, j12, 16
  jld j10, j12, 24
  jldi j2, 34
  jcall putch
  jldi j2, 95
  jcall putch
  jldi j1, 0
  jldi j11, 1
  jwhile j10
    jldi j1, 0
    jadd j2, j9, j11
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jst j2, j1, PMT
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjnz j3, pm_skip
    jldi j2, 32
    jcall putch
    jld j2, j1, PMT
    jcall putword
  pm_skip:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 32
  jcall putch
  jldi j2, 95
  jcall putch
  jldi j2, 34
  jcall putch
  jldi j2, 32
  jjmp putch

; The cores asked (the words of "q", one per line): each one's meaning (the skeletons it fills, with two pairs or
; more, and its partner there), and what it deduces from the skeletons that turn or chain. Uses j1-j14.
cores:
  jldi j1, 0
  jldi j2, S_Q
  jst j2, j1, LABEL
  jldi j2, 1
  jst j2, j1, LABLEN
  jldi j2, 2
  jst j2, j1, PASS
  jst j1, j1, QN
  jcall scan
  jldi j1, 0
  jst j1, j1, QSI
  jld j2, j1, QN
  jwhile j2
    jldi j1, 0                  ; a line: to the 0 that ends it
    jld j9, j1, QSI
    jst j9, j1, QQS
  co_end:
    jld j2, j1, QN
    jsub j2, j9, j2
    jjz j2, co_line
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jjz j2, co_line
    jldi j2, 1
    jadd j9, j9, j2
    jjmp co_end
  co_line:
    jst j9, j1, QQE
    jld j2, j1, QQS
    jsub j3, j9, j2
    jjz j3, co_next
    jldi j4, 1                  ; one piece: a core, its meaning; more: a question (Capitan: "the furniture and the
    jsub j3, j3, j4             ; logical relation that fits the question")
    jjnz j3, co_question
    jldi j3, 3
    jshl j2, j2, j3
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1                  ; a word it knows (not a hole, not unknown)
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, co_next
    jst j2, j1, QCW
    jcall core_one
    jcall flush
    jjmp co_next
  co_question:
    jcall question_one
    jcall flush
  co_next:
    jldi j1, 0
    jld j9, j1, QQE
    jldi j2, 1
    jadd j9, j9, j2
    jst j9, j1, QSI
    jld j3, j1, QN
    jsub j2, j3, j9
    jldi j3, 63
    jsar j3, j2, j3
    jjz j3, co_more
    jldi j2, 0
  co_more:
  jwend
  jret
; The core QCW, read again as the text goes by: first its meaning (every affirmed fact it is in, once, written when its
; skeleton has two pairs or more), then what follows from it (the turned fact of a skeleton that turns, when the
; book never said it). What was said is kept only for the core asked. Uses j1-j14.
core_one:
  jldi j1, S_CORE
  jcall puts
  jld j2, j1, QCW
  jcall putword
  jldi j2, 10
  jcall putch
  jldi j2, TSN
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jldi j2, 2
  jst j2, j1, GMODE
  jcall gather
  jldi j1, 0
  jldi j2, 3
  jst j2, j1, GMODE
  jcall gather
  jjmp flush

; The window WA WK WB met by the core asked: its meaning (GMODE 2) or what it deduces (3). Uses j1-j14.
f_meet:
  jldi j1, 0
  jld j6, j1, WN                ; affirmed, and the core asked at one end
  jjnz j6, fm_done
  jld j6, j1, QCW
  jld j7, j1, WA
  jsub j7, j7, j6
  jjz j7, fm_in
  jld j7, j1, WB
  jsub j7, j7, j6
  jjnz j7, fm_done
fm_in:
  jld j5, j1, WK                ; its silhouette
  jldi j2, TMI
  jcall pl_find
  jst j4, j1, WSK
  jld j2, j1, GMODE
  jldi j3, 4
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, q_meet
  jld j2, j1, GMODE
  jldi j3, 2
  jsub j3, j2, j3
  jjnz j3, fm_deduce
  jld j2, j1, WK                ; its meaning: said, once
  jld j3, j1, WA
  jld j4, j1, WB
  jcall f_key
  jldi j2, TSN
  jcall pl_take
  jjz j6, fm_done
  jcall fm_two
  jjz j6, fm_done
  jldi j2, 32
  jcall putch
  jldi j2, 32
  jcall putch
  jld j2, j1, WA
  jadd j12, j2, j1
  jcall mix
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, WSK
  jcall put_mid
  jld j2, j1, WB
  jcall putword
  jldi j2, 10
  jcall putch
  jjmp flush
fm_deduce:
  jcall fm_two
  jjz j6, fm_done
  jld j2, j1, WSK               ; a skeleton that turns
  jst j2, j1, FE
  jldi j12, 1
  jcall best_partner
  jldi j1, 0
  jld j2, j1, TBEST
  jjz j2, fm_done
  jld j3, j1, WB                ; the turned fact: not said in the book, and deduced once
  jld j4, j1, WA
  jcall f_key
  jldi j2, TSN
  jcall pl_take
  jjz j6, fm_done
  jcall fm_gender               ; its two cores where it puts them: of the gender of what is next to them?
  jldi j1, 0
  jld j2, j1, GST
  jldi j1, S_DED
  jjz j2, fm_say
  jldi j3, 1
  jsub j3, j2, j3
  jldi j1, S_WAIT
  jjz j3, fm_say
  jldi j1, S_NOT
fm_say:
  jcall puts
  jld j2, j1, WB
  jcall putword
  jldi j2, 32
  jcall putch
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jld j2, j1, WA
  jcall putword
  jldi j1, S_BEC
  jcall puts
  jld j12, j1, WSK
  jcall put_mid
  jldi j1, S_BTURN
  jcall puts
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_mid
  jldi j2, 41
  jcall putch
  jld j2, j1, GST               ; and what it waits for, or why it fell
  jjz j2, fm_end
  jldi j3, 1
  jsub j3, j2, j3
  jldi j1, S_TILL
  jjz j3, fm_why
  jldi j1, S_OPEN
fm_why:
  jcall puts
  jld j2, j1, GFC
  jcall putword
  jld j2, j1, GST
  jldi j3, 1
  jsub j3, j2, j3
  jldi j1, S_GOES
  jjz j3, fm_piece
  jldi j1, S_OTHER
fm_piece:
  jcall puts
  jld j2, j1, GFP
  jcall putword
  jldi j2, 41
  jcall putch
fm_end:
  jldi j2, 10
  jcall putch
  jjmp flush
fm_done:
  jret

; The turned fact WB «TBEST» WA puts WB before the first piece of TBEST and WA after its last: a piece with a gender
; asks the core next to it to have been seen next to that gender (on that side). GST: 0 it is, 1 not known yet (the
; request waits), 2 seen only with the other; GFC and GFP the core and the piece that decided. Uses j1-j14.
fm_gender:
  jldi j1, 0
  jst j1, j1, GST
  jld j2, j1, TBEST
  jcall find_mid
  jldi j13, MB1
  jcall m_collect
  jldi j1, 0
  jjz j2, fg_done
  jldi j3, 1
  jsub j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jld j2, j2, MB1               ; the last piece, before WA
  jld j3, j1, WA
  jldi j4, 4
  jcall fg_one
  jldi j1, 0
  jld j2, j1, MB1               ; the first, after WB
  jld j3, j1, WB
  jldi j4, 16
  jjmp fg_one
fg_done:
  jret

; The piece j2 next to the core j3 on the side j4 (4 before, 16 after): GST raised if it asks a gender the core was
; not seen with. Uses j1-j8.
fg_one:
  jldi j1, 0
  jldi j5, 3
  jshl j5, j2, j5
  jld j6, j1, ROOMGN
  jadd j5, j5, j6
  jld j5, j5, 0
  jldi j6, 3
  jand j5, j5, j6               ; its gender
  jjz j5, fo_done
  jldi j6, 3
  jshl j6, j3, j6
  jld j7, j1, ROOMGN
  jadd j6, j6, j7
  jld j6, j6, 0                 ; what the core was seen next to
  jmul j7, j5, j4
  jand j7, j6, j7
  jjnz j7, fo_done
  jldi j7, 3
  jsub j7, j7, j5
  jmul j7, j7, j4
  jand j7, j6, j7
  jldi j8, 1                    ; not known: it waits; seen only with the other: it falls
  jjz j7, fo_raise
  jldi j8, 2
fo_raise:
  jld j7, j1, GST
  jsub j7, j7, j8
  jldi j6, 63
  jsar j7, j7, j6
  jjz j7, fo_done
  jst j8, j1, GST
  jst j3, j1, GFC
  jst j2, j1, GFP
fo_done:
  jret

; The gender of every word (the twins' first difference, a/o): a word of two letters or more ending in a or o, whose
; twin with the other ending is in the book, is of that gender (1 a, 2 o); else of none. By word {its gender, and the
; genders seen next to it as a core: 4 before a, 8 before o, 16 after a, 32 after o} (8 bytes). Uses j1-j14.
genders:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMGN
  jldi j2, 2                    ; (a word looked up, never added)
  jst j2, j1, PASS
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j5, j3, 16
    jld j3, j3, 8
    jld j4, j1, ROOMA
    jadd j3, j3, j4
    jst j5, j1, WLEN
    jldi j6, 2                  ; two letters or more: something the same
    jsub j6, j5, j6
    jldi j7, 63
    jsar j6, j6, j7
    jjnz j6, gn_next
    jadd j6, j3, j5
    jldi j7, 1
    jsub j6, j6, j7
    jldb j6, j6, 0
    jldi j7, 97
    jsub j7, j6, j7
    jldi j8, 1
    jjz j7, gn_end
    jldi j7, 111
    jsub j7, j6, j7
    jldi j8, 2
    jjnz j7, gn_next
  gn_end:
    jst j8, j1, GNG
    jst j5, j1, WBN
    jcall wb_need
    jldi j4, 0                  ; its twin: the same, the other ending
    jadd j7, j5, j1
    jwhile j7
      jldb j6, j3, 0
      jld j8, j1, WBP
      jadd j8, j8, j4
      jstb j6, j8, 0
      jldi j6, 1
      jadd j3, j3, j6
      jadd j4, j4, j6
      jsub j7, j7, j6
    jwend
    jldi j6, 1
    jsub j4, j4, j6
    jld j8, j1, WBP
    jadd j8, j8, j4
    jldb j7, j8, 0
    jldi j6, 208
    jsub j6, j6, j7
    jstb j6, j8, 0
    jst j9, j1, GNW
    jst j10, j1, GNL
    jcall word_id
    jldi j1, 0
    jld j9, j1, GNW
    jld j10, j1, GNL
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, gn_next
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ROOMGN
    jadd j3, j3, j4
    jld j4, j1, GNG
    jst j4, j3, 0
  gn_next:
    jldi j1, 0
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

; What the fact WA … WB has next to its cores: the gender of the piece after WA and of the one before WB, marked on
; them. Uses j1-j8.
fl_gender:
  jldi j1, 0
  jld j2, j1, WJ
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j1, WA
  jldi j4, 16
  jcall fg_mark
  jldi j1, 0
  jld j2, j1, WJ
  jld j3, j1, WM
  jadd j2, j2, j3
  jld j3, j1, WB
  jldi j4, 4
  jjmp fg_mark

; The piece at unit j2 next to the core j3 on side j4: its gender, if it has one, marked on the core. Uses j1-j8.
fg_mark:
  jldi j1, 0
  jldi j5, 3
  jshl j5, j2, j5
  jld j6, j1, ROOMT
  jadd j5, j5, j6
  jld j5, j5, 0
  jldi j6, 3
  jshl j5, j5, j6
  jld j6, j1, ROOMGN
  jadd j5, j5, j6
  jld j5, j5, 0
  jldi j6, 3
  jand j5, j5, j6
  jjz j5, fk2_done
  jmul j5, j5, j4
  jldi j6, 3
  jshl j6, j3, j6
  jld j7, j1, ROOMGN
  jadd j6, j6, j7
  jld j7, j6, 0
  jor j7, j7, j5
  jst j7, j6, 0
fk2_done:
  jret

; j6 = 1 if the skeleton at WSK has two pairs or more (a written one keeps them negative). Uses j1, j6, j7.
fm_two:
  jldi j1, 0
  jld j7, j1, WSK
  jld j6, j7, 8
  jldi j7, 63
  jsar j7, j6, j7
  jjz j7, ft_pos
  jldi j7, 0
  jsub j6, j7, j6
ft_pos:
  jldi j7, 2
  jsub j6, j6, j7
  jldi j7, 63
  jsar j6, j6, j7
  jldi j7, 1
  jadd j6, j6, j7
  jret

; j2 written, and into j0. Uses j1-j4, j12-j14.
putmix:
  jldi j1, 0
  jadd j12, j2, j1
  jcall mix
  jjmp putnum

; The arrows (Capitan, 2026-11-07: the logical silhouette "quién" = "=>"; and "let it discover it"). Every word is
; looked at in the buildings it is in (the text between two limits, the limits the book showed): the limit most of its
; buildings close with is voted (Boyer-Moore: one pass), then counted. A word is an arrow of that limit when the limit
; closes most of the word's buildings, two at least (the anecdote rule), and does not close most of the book's: the
; word lives where the book rarely is. No limit and no word is named: the question words come out of the book. Uses
; j1-j14.
arrows:
  jcall arrows_calc
  jjmp ar_write

; The arrows found, nothing written (eating: what the book's questions teach needs them). Uses j1-j14.
arrows_calc:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMAR
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMCN
  jst j1, j1, NBLD
  jldi j2, 1
  jst j2, j1, AMODE
  jcall ar_walk
  jldi j1, 0                    ; the voted limit, now counted
  jld j10, j1, NV
  jld j9, j1, ROOMAR
  jwhile j10
    jst j1, j9, 16
    jldi j2, 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j2, 2
  jst j2, j1, AMODE
  jjmp ar_walk
ar_write:
  jldi j1, S_ARROW              ; written, the most said first
  jcall puts
  jldi j2, 0
  jst j2, j1, FI2
  ar_print:
    jldi j1, 0
    jldi j11, 0                 ; the arrow not written yet that is said the most
    jldi j12, 0
    jldi j9, 1
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jldi j1, 0
      jadd j2, j9, j1
      jst j9, j1, FI3
      jst j10, j1, FI4
      jcall is_arrow
      jldi j1, 0
      jld j9, j1, FI3
      jld j10, j1, FI4
      jjz j2, arp_next
      jldi j3, 24
      jmul j3, j9, j3
      jld j4, j1, ROOMAR
      jadd j3, j3, j4
      jld j4, j3, 16
      jsub j5, j11, j4
      jldi j6, 63
      jsar j5, j5, j6
      jjz j5, arp_next
      jadd j11, j4, j1
      jadd j12, j9, j1
    arp_next:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, arp_done
    jldi j3, 24                 ; written: the word, its limit, how many of its buildings
    jmul j3, j12, j3
    jld j4, j1, ROOMAR
    jadd j3, j3, j4
    jst j3, j1, FI4
    jldi j2, 32
    jcall putch
    jadd j2, j12, j1
    jcall putword
    jldi j2, 40
    jcall putch
    jld j3, j1, FI4
    jld j2, j3, 8
    jcall putword
    jldi j2, 32
    jcall putch
    jld j3, j1, FI4
    jld j2, j3, 16
    jcall putnum
    jldi j2, 47
    jcall putch
    jld j3, j1, FI4
    jld j2, j3, 0
    jcall putnum
    jldi j2, 41
    jcall putch
    jldi j1, 0
    jld j3, j1, FI4             ; (not again: its count goes negative, it is no arrow while it is written)
    jld j2, j3, 16
    jldi j4, 0
    jsub j2, j4, j2
    jst j2, j3, 16
    jld j2, j1, FI2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI2
    jldi j3, 20                 ; (twenty written: criterion, the report's size; the rest stay arrows)
    jsub j2, j2, j3
    jjnz j2, ar_print
arp_done:
  jldi j1, 0                    ; the written ones back to their count
  jld j10, j1, NV
  jld j9, j1, ROOMAR
  jwhile j10
    jld j2, j9, 16
    jldi j3, 63
    jsar j3, j2, j3
    jjz j3, arb_next
    jldi j3, 0
    jsub j2, j3, j2
    jst j2, j9, 16
  arb_next:
    jldi j2, 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jldi j2, 10
  jcall putch
  jjmp flush

; Every building of the book (its units from a limit to the next one; a renglon's end is no limit), each word in it
; with the limit that closes it: voted (AMODE 1, and the buildings and each limit's counted), or counted when it is
; the word's voted limit (2). Uses j1-j14.
ar_walk:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, AST
  jldi j9, 1
  jld j10, j1, NTOK
  jldi j2, 1
  jsub j10, j10, j2
  jldi j3, 63                   ; (fewer units than one: nothing to walk)
  jsar j3, j10, j3
  jldi j4, -1
  jxor j3, j3, j4
  jand j10, j10, j3
  jwhile j10
    jldi j1, 0
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, aw_next
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, aw_next
    jst j9, j1, FI3             ; a limit: the building before it closes with it
    jst j10, j1, FI4
    jst j2, j1, KPT
    jld j5, j1, AST
    jsub j6, j9, j5
    jjz j6, aw_closed
    jld j6, j1, AMODE
    jldi j7, 1
    jsub j6, j6, j7
    jjnz j6, aw_words
    jld j6, j1, NBLD
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j1, NBLD
    jldi j6, 3
    jshl j6, j2, j6
    jld j7, j1, ROOMCN
    jadd j6, j6, j7
    jld j7, j6, 0
    jldi j8, 1
    jadd j7, j7, j8
    jst j7, j6, 0
  aw_words:
    jldi j1, 0
    jld j5, j1, AST
    jld j9, j1, FI3
    jsub j6, j9, j5
    jjz j6, aw_closed
    jldi j2, 3
    jshl j2, j5, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jldi j3, 1
    jadd j5, j5, j3
    jst j5, j1, AST
    jjz j2, aw_words
    jst j2, j1, PMT
    jcall w_mark                ; (a word: the marks are no arrows)
    jjnz j3, aw_words
    jldi j1, 0
    jld j2, j1, PMT
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMAR
    jadd j3, j3, j4
    jld j4, j1, KPT
    jld j5, j1, AMODE
    jldi j6, 1
    jsub j5, j5, j6
    jjnz j5, aw_count
    jld j6, j3, 0               ; voted: one building more, and the vote
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j3, 0
    jld j6, j3, 16
    jjnz j6, aw_vote
    jst j4, j3, 8
    jst j7, j3, 16
    jjmp aw_words
  aw_vote:
    jld j8, j3, 8
    jsub j8, j8, j4
    jjnz j8, aw_against
    jadd j6, j6, j7
    jst j6, j3, 16
    jjmp aw_words
  aw_against:
    jsub j6, j6, j7
    jst j6, j3, 16
    jjmp aw_words
  aw_count:
    jld j6, j3, 8
    jsub j6, j6, j4
    jjnz j6, aw_words
    jld j6, j3, 16
    jldi j7, 1
    jadd j6, j6, j7
    jst j6, j3, 16
    jjmp aw_words
  aw_closed:
    jldi j1, 0
    jld j9, j1, FI3
    jld j10, j1, FI4
    jldi j2, 1
    jadd j2, j9, j2
    jst j2, j1, AST
  aw_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

; The book's own questions (Capitan, 2026-11-07: "study the questions with the structure they were made with in the
; books and infer the answer"): a building is a question when an arrow of it is closed by the arrow's own limit (both
; found in the book, none named); the building right after it is where the book answers. Counted: the questions, and
; those whose answer next to them says a core of the question again (what it can learn from), and what those answers
; teach learned (QLT; not over a piece read again with the library's silhouettes: the library's books teach it).
; Written by qa_write_out. Uses j1-j14.
qa_scan:
  jldi j2, QLT
  jldi j3, 24
  jcall pl_new
  jldi j1, 0
  jst j1, j1, QLN
  jst j1, j1, QAN
  jst j1, j1, QAM
  jst j1, j1, QAQ
  jldi j2, 1
  jst j2, j1, QAT
  jldi j9, 1
  qa_lap:
    jldi j1, 0
    jld j2, j1, NTOK
    jsub j2, j9, j2
    jjz j2, qa_done
    jst j9, j1, QAI
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, qa_next
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, qa_next
    jst j2, j1, QAX             ; a limit: the building QAT to here closes with it
    jld j5, j1, QAT
    jsub j6, j9, j5
    jjz j6, qa_empty
    jld j2, j1, QAQ             ; the one before asked: this one answers it
    jjz j2, qa_ask
    jld j2, j1, QAN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QAN
    jcall qa_shared
    jldi j1, 0
    jjz j2, qa_ask
    jld j2, j1, QAM
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QAM
    jld j2, j1, ROOMAX          ; (a piece read again with the library's silhouettes: too little to learn from, the
    jjnz j2, qa_ask             ; library's books teach it, lib_load)
    jcall qa_learn
  qa_ask:
    jcall qa_asks               ; does this one ask?
    jldi j1, 0
    jst j2, j1, QAQ
    jld j2, j1, QAT
    jst j2, j1, QAS
    jld j2, j1, QAI
    jst j2, j1, QAE
  qa_empty:
    jldi j1, 0
    jld j2, j1, QAI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QAT
  qa_next:
    jldi j1, 0
    jld j9, j1, QAI
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qa_lap
qa_done:
  jldi j1, 0
  jret
qa_write_out:
  jldi j1, S_QAN
  jcall puts
  jld j2, j1, QAN
  jcall putnum
  jldi j1, S_QAM
  jcall puts
  jld j2, j1, QAM
  jcall putnum
  jldi j2, 10
  jcall putch
  jcall flush
  jjmp ql_report

; What the answer QAT to QAI teaches about the question QAS to QAE before it (Capitan: "study how the questions are
; answered in the books", and "plastic structures, not rigid"): each core of the answer the question says too, and each
; fact of the answer it is an end of (a window as gather reads one: another core one to three pieces away): the hook,
; the fact's word next to the core (its marks aside), is looked for in the question. Its side there (before the core or
; after it) and the core's side in the answer are counted together. No order is asked, only before or after: the same
; hook anywhere in the question teaches the same. Uses j1-j14.
qa_learn:
  jldi j1, 0
  jld j2, j1, QAT
  jst j2, j1, QLP
  ql_p:
    jldi j1, 0
    jld j2, j1, QLP
    jld j3, j1, QAI
    jsub j3, j2, j3
    jjz j3, ql_done
    jcall tok_at
    jst j2, j1, QLC
    jcall g_core
    jldi j1, 0
    jjz j3, ql_pnext
    jld j2, j1, QLC             ; said in the question?
    jcall q_in
    jjz j3, ql_pnext
    jst j2, j1, QLQ
    jst j1, j1, QLS             ; the core first in the fact, the hook right after it
    jldi j2, 1
    jst j2, j1, QLW
    ql_r:
      jldi j1, 0
      jld j2, j1, QLW
      jldi j3, 4
      jsub j3, j2, j3
      jjz j3, ql_left
      jld j9, j1, QLP
      jadd j9, j9, j2
      jldi j3, 1
      jadd j9, j9, j3
      jld j3, j1, QAI
      jsub j3, j9, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, ql_left
      jadd j2, j9, j1
      jcall tok_at
      jcall g_core
      jldi j1, 0
      jjz j3, ql_rnext
      jld j9, j1, QLP             ; the hook: the first word after the core
      ql_rh:
        jldi j1, 0
        jldi j2, 1
        jadd j9, j9, j2
        jld j2, j1, QLP
        jld j3, j1, QLW
        jadd j2, j2, j3
        jldi j3, 1
        jadd j2, j2, j3
        jsub j2, j9, j2
        jjz j2, ql_rnext
        jadd j2, j9, j1
        jcall tok_at
        jjz j2, ql_rnext
        jst j2, j1, QLH
        jst j9, j1, QLK
        jcall w_mark
        jldi j1, 0
        jld j9, j1, QLK
        jjnz j3, ql_rh
      jcall ql_note
    ql_rnext:
      jldi j1, 0
      jld j2, j1, QLW
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, QLW
      jjmp ql_r
  ql_left:
    jldi j1, 0
    jldi j2, 1                  ; the core last in the fact, the hook right before it
    jst j2, j1, QLS
    jst j2, j1, QLW
    ql_l:
      jldi j1, 0
      jld j2, j1, QLW
      jldi j3, 4
      jsub j3, j2, j3
      jjz j3, ql_pnext
      jld j9, j1, QLP
      jsub j9, j9, j2
      jldi j3, 1
      jsub j9, j9, j3
      jld j3, j1, QAT
      jsub j3, j9, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, ql_pnext
      jadd j2, j9, j1
      jcall tok_at
      jcall g_core
      jldi j1, 0
      jjz j3, ql_lnext
      jld j9, j1, QLP             ; the hook: the last word before the core
      ql_lh:
        jldi j1, 0
        jldi j2, 1
        jsub j9, j9, j2
        jld j2, j1, QLP
        jld j3, j1, QLW
        jsub j2, j2, j3
        jldi j3, 1
        jsub j2, j2, j3
        jsub j2, j9, j2
        jjz j2, ql_lnext
        jadd j2, j9, j1
        jcall tok_at
        jjz j2, ql_lnext
        jst j2, j1, QLH
        jst j9, j1, QLK
        jcall w_mark
        jldi j1, 0
        jld j9, j1, QLK
        jjnz j3, ql_lh
      jcall ql_note
    ql_lnext:
      jldi j1, 0
      jld j2, j1, QLW
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, QLW
      jjmp ql_l
  ql_pnext:
    jldi j1, 0
    jld j2, j1, QLP
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QLP
    jjmp ql_p
ql_done:
  jldi j1, 0
  jret

; The hook QLH, the core's side in the answer QLS: if the question says the hook, counted by its side there (1 before
; the core QLQ, 0 after). Uses j1-j8.
ql_note:
  jldi j1, 0
  jld j2, j1, QLH
  jcall q_in
  jjz j3, qln_done
  jld j3, j1, QLQ
  jsub j2, j2, j3
  jldi j3, 63
  jshr j2, j2, j3
  jld j5, j1, QLH
  jcall ql_key
  jldi j2, QLT
  jcall pl_take
  jldi j1, 0
  jld j2, j1, QLS
  jldi j3, 3
  jshl j2, j2, j3
  jadd j2, j2, j4
  jld j3, j2, 8
  jldi j5, 1
  jadd j3, j3, j5
  jst j3, j2, 8
  jld j2, j1, QLN
  jadd j2, j2, j5
  jst j2, j1, QLN
qln_done:
  jldi j1, 0
  jret

; j2 = 1 if the fact's side (QSIDE) is the one the books' questions taught for the hook QBC on side QLK of the core in
; the question: most of their answers put the core there, two answers at least (the anecdote rule). Nothing taught, or
; a tie: it does not decide (1). Uses j1-j8.
ql_decide:
  jldi j1, 0
  jld j2, j1, QLT
  jjz j2, qld_yes
  jld j5, j1, QBC
  jld j2, j1, QLK
  jcall ql_key
  jldi j2, QLT
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, qld_yes
  jld j5, j4, 8
  jld j6, j4, 16
  jadd j7, j5, j6
  jldi j8, 2
  jsub j7, j7, j8
  jldi j8, 63
  jsar j7, j7, j8
  jjnz j7, qld_yes
  jsub j7, j6, j5
  jjz j7, qld_yes
  jshr j7, j7, j8               ; 1 if the core went before the hook more (QSIDE 0), 0 if after
  jldi j8, 1
  jxor j7, j7, j8
  jld j2, j1, QSIDE
  jsub j7, j7, j2
  jjnz j7, qld_no
qld_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qld_no:
  jldi j1, 0
  jldi j2, 0
  jret

; The key of hook j5 with its side j2 in the question (1 before the core, 0 after) -> j5, never 0. Uses j1, j5, j6.
ql_key:
  jldi j1, 0
  jldi j6, 1
  jshl j5, j5, j6
  jor j5, j5, j2
  jadd j5, j5, j6
  jret

; The first place of word j2 in the question QAS to QAE -> j2, and j3 = 1 (0: not there). Uses j1-j5.
q_in:
  jldi j1, 0
  jld j4, j1, QAS
  qi_lap:
    jld j3, j1, QAE
    jsub j3, j4, j3
    jjz j3, qi_no
    jldi j3, 3
    jshl j3, j4, j3
    jld j5, j1, ROOMT
    jadd j3, j3, j5
    jld j3, j3, 0
    jsub j3, j3, j2
    jjz j3, qi_yes
    jldi j3, 1
    jadd j4, j4, j3
    jjmp qi_lap
qi_yes:
  jadd j2, j4, j1
  jldi j3, 1
  jret
qi_no:
  jldi j3, 0
  jret

; The unit at place j2 of the book -> j2. Uses j1, j3.
tok_at:
  jldi j1, 0
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMT
  jadd j2, j2, j3
  jld j2, j2, 0
  jret

; What the book's questions taught, written: each hook with two answers or more (the anecdote rule), "<" if it was
; before the core in the question and ">" if after, and how many answers had the core before it / after it. Uses j1-j14.
ql_report:
  jldi j1, S_QAL
  jcall puts
  jld j2, j1, QLN
  jcall putnum
  jldi j1, 0
  jld j9, j1, QLT
  jld j10, j1, QLT + 8
  jldi j2, 1
  jadd j10, j10, j2
  qlr_lap:
    jldi j1, 0
    jjz j10, qlr_done
    jld j2, j9, 0
    jjz j2, qlr_next
    jld j3, j9, 8
    jld j4, j9, 16
    jadd j3, j3, j4
    jldi j4, 2
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qlr_next
    jst j9, j1, QLK
    jst j10, j1, QLW
    jldi j2, 32
    jcall putch
    jld j9, j1, QLK
    jld j2, j9, 0
    jldi j3, 1
    jsub j2, j2, j3
    jshr j2, j2, j3
    jcall putword
    jldi j1, 0
    jld j9, j1, QLK
    jld j2, j9, 0
    jldi j3, 1
    jsub j2, j2, j3
    jand j2, j2, j3
    jldi j3, 60
    jjnz j2, qlr_side
    jldi j3, 62
  qlr_side:
    jadd j2, j3, j1
    jcall putch
    jld j9, j1, QLK
    jld j2, j9, 8
    jcall putnum
    jldi j2, 47
    jcall putch
    jld j9, j1, QLK
    jld j2, j9, 16
    jcall putnum
    jldi j1, 0
    jld j9, j1, QLK
    jld j10, j1, QLW
  qlr_next:
    jld j2, j1, QLT + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp qlr_lap
qlr_done:
  jldi j2, 10
  jcall putch
  jjmp flush

; What this book's questions taught (QLT), into the library: "tablero/preguntas-" and the print of the book's bytes
; (salted 3: written once, as the turns). Qwords {1, how many}, then each {its side in the question (1 before the
; core), answers with the core before the hook, after it, the hook's bytes} and its letters padded. They are counts:
; they add up over every book. Uses j1-j14.
qa_eat:
  jldi j1, 0
  jld j2, j1, EATB
  jjz j2, qe_done               ; (the book could not be read)
  jld j2, j1, QLT
  jjz j2, qe_done
  jldi j2, 16                   ; its bytes
  jst j2, j1, QLW
  jst j1, j1, QLN
  jst j1, j1, QLS
  jcall qe_walk
  jldi j1, 0
  jld j11, j1, QLW
  jcall room
  jldi j1, 0
  jst j13, j1, QLC
  jldi j2, 1
  jst j2, j13, 0
  jld j2, j1, QLN
  jst j2, j13, 8
  jldi j2, 16
  jadd j2, j13, j2
  jst j2, j1, QLP
  jldi j2, 1
  jst j2, j1, QLS
  jcall qe_walk                 ; written
  jldi j1, 0
  jldi j11, 64
  jcall room
  jldi j1, 0
  jst j13, j1, ELAB
  jld j5, j1, EATB
  jldi j3, 3
  jxor j5, j5, j3
  jld j3, j1, FNVP
  jmul j5, j5, j3
  jldi j6, S_PRQ
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jld j2, j1, QLN
  jjz j2, qe_done               ; (nothing taught: no file)
  jldi j10, 4
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, qe_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, QLC
  jld j12, j1, QLW
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
qe_done:
  jldi j1, 0
  jret

; Every lesson of QLT: counted with its bytes (QLS 0: QLN, QLW), or written at QLP (QLS 1). Uses j1-j14.
qe_walk:
  jldi j1, 0
  jld j9, j1, QLT
  jld j10, j1, QLT + 8
  jldi j2, 1
  jadd j10, j10, j2
  qew_lap:
    jldi j1, 0
    jjz j10, qew_done
    jld j2, j9, 0
    jjz j2, qew_next
    jldi j3, 1                  ; the hook's letters
    jsub j2, j2, j3
    jshr j4, j2, j3
    jldi j5, 3
    jshl j4, j4, j5
    jld j5, j1, ROOMI
    jadd j4, j4, j5
    jld j4, j4, 0
    jld j6, j4, 16
    jld j7, j4, 8
    jld j5, j1, ROOMA
    jadd j7, j7, j5
    jldi j5, 7
    jadd j8, j6, j5
    jldi j5, -8
    jand j8, j8, j5
    jldi j5, 32
    jadd j8, j8, j5
    jld j5, j1, QLS
    jjnz j5, qew_write
    jld j5, j1, QLN
    jadd j5, j5, j3
    jst j5, j1, QLN
    jld j5, j1, QLW
    jadd j5, j5, j8
    jst j5, j1, QLW
    jjmp qew_next
  qew_write:
    jld j5, j1, QLP
    jand j2, j2, j3
    jst j2, j5, 0
    jld j2, j9, 8
    jst j2, j5, 8
    jld j2, j9, 16
    jst j2, j5, 16
    jst j6, j5, 24
    jadd j8, j5, j8
    jst j8, j1, QLP
    jldi j2, 32
    jadd j5, j5, j2
    jwhile j6
      jldb j2, j7, 0
      jstb j2, j5, 0
      jadd j7, j7, j3
      jadd j5, j5, j3
      jsub j6, j6, j3
    jwend
  qew_next:
    jldi j1, 0
    jld j2, j1, QLT + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp qew_lap
qew_done:
  jret

; One file of the questions' lessons (SXR, SXN bytes): each hook this reading knows adds its answers to QLT. A lesson
; that does not hold together (past the file, a hook longer than a word can be) ends the file. Uses j1-j14.
pq_file:
  jldi j1, 0
  jld j9, j1, SXR
  jld j2, j9, 0
  jldi j3, 1
  jsub j2, j2, j3
  jjnz j2, pqf_done
  jld j2, j9, 8
  jst j2, j1, QLW
  jld j2, j1, SXN
  jadd j2, j9, j2
  jst j2, j1, QLH               ; (its end)
  jldi j2, 16
  jadd j9, j9, j2
  pqf_lap:
    jldi j1, 0
    jld j2, j1, QLW
    jjz j2, pqf_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, QLW
    jldi j2, 32                 ; inside the file?
    jadd j2, j9, j2
    jld j3, j1, QLH
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, pqf_done
    jld j4, j9, 24
    jldi j3, 63
    jsar j3, j4, j3
    jjnz j3, pqf_done
    jldi j3, 7
    jadd j5, j4, j3
    jldi j3, -8
    jand j5, j5, j3
    jadd j5, j2, j5
    jld j3, j1, QLH
    jsub j3, j3, j5
    jldi j6, 63
    jsar j3, j3, j6
    jjnz j3, pqf_done
    jst j5, j1, QLK             ; (the next lesson)
    jst j9, j1, QLP
    jst j4, j1, WLEN
    jst j4, j1, WBN
    jcall wb_need
    jldi j6, 0
    pqf_letter:
      jsub j3, j6, j4
      jjz j3, pqf_letters
      jadd j3, j2, j6
      jldb j3, j3, 0
      jld j5, j1, WBP
      jadd j5, j5, j6
      jstb j3, j5, 0
      jldi j3, 1
      jadd j6, j6, j3
      jjmp pqf_letter
  pqf_letters:
    jcall word_id
    jldi j1, 0
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, pqf_next           ; (a hook this reading never read)
    jadd j5, j2, j1
    jld j9, j1, QLP
    jld j2, j9, 0
    jldi j3, 1
    jand j2, j2, j3
    jcall ql_key
    jldi j2, QLT
    jcall pl_take
    jldi j1, 0
    jld j9, j1, QLP
    jld j2, j4, 8
    jld j3, j9, 8
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j4, 16
    jld j3, j9, 16
    jadd j2, j2, j3
    jst j2, j4, 16
  pqf_next:
    jldi j1, 0
    jld j9, j1, QLK
    jjmp pqf_lap
pqf_done:
  jldi j1, 0
  jret

; The glue between constructions (Capitan, 2026-11-07: "glue, structure, so it can think ever more complex mechanisms
; recombining"): how the book itself joins its facts. Every fact of a proved skeleton (two pairs or more) is listed in
; the book's order (GMODE 6), then each one is met with every fact that starts where it ends or up to two units after
; it: the units between are the glue ("=": the same core ends one and starts the other; "+": right after it). Counted:
; how often each glue joins two facts, and each construction (skeleton, glue, skeleton) proved twice or more. Nothing
; is named: the glues come out of the book. Uses j1-j14.
glue_count:
  jcall glue_scan
  jjmp glue_report

; The facts listed and their joinings counted (GFL, GLT, GKT), nothing written. Uses j1-j14.
glue_scan:
  jldi j1, 0
  jld j11, j1, NTOK             ; (three windows a unit at most, each fact 24 bytes)
  jldi j2, 72
  jmul j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, GFL
  jst j1, j1, GFN
  jldi j2, 6
  jst j2, j1, GMODE
  jcall gather
  jldi j2, GLT
  jldi j3, 32
  jcall pl_new
  jldi j2, GKT
  jldi j3, 48
  jcall pl_new
  jldi j1, 0
  jst j1, j1, GLN
  jst j1, j1, GI
  gc_fact:
    jldi j1, 0
    jld j2, j1, GI
    jld j3, j1, GFN
    jsub j3, j2, j3
    jjz j3, gc_report
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j3, j3, j4
    jst j3, j1, GP              ; the first fact; the first that starts where it ends or after (halving the list)
    jld j5, j3, 8
    jst j5, j1, GLE
    jst j1, j1, GT1
    jld j2, j1, GFN
    jst j2, j1, GT2
    gc_half:
      jldi j1, 0
      jld j2, j1, GT1
      jld j3, j1, GT2
      jsub j4, j3, j2
      jjz j4, gc_found
      jadd j4, j2, j3
      jldi j5, 1
      jshr j4, j4, j5
      jldi j5, 24
      jmul j5, j4, j5
      jld j6, j1, GFL
      jadd j5, j5, j6
      jld j5, j5, 0
      jld j6, j1, GLE
      jsub j5, j5, j6
      jldi j6, 63
      jsar j5, j5, j6
      jjz j5, gc_lo
      jldi j5, 1
      jadd j4, j4, j5
      jst j4, j1, GT1
      jjmp gc_half
    gc_lo:
      jst j4, j1, GT2
      jjmp gc_half
  gc_found:
    gc_next2:
      jldi j1, 0
      jld j2, j1, GT1
      jld j3, j1, GFN
      jsub j3, j2, j3
      jjz j3, gc_nextf
      jldi j3, 24
      jmul j3, j2, j3
      jld j4, j1, GFL
      jadd j3, j3, j4
      jld j4, j3, 0               ; its start: up to two units past the first's end
      jld j5, j1, GLE
      jsub j4, j4, j5
      jldi j6, 4
      jsub j6, j4, j6
      jldi j7, 63
      jsar j6, j6, j7
      jjz j6, gc_nextf
      jst j4, j1, GJ              ; (how far: 0 the same core, 1 right after, 2 and 3 with glue)
      jld j2, j3, 16
      jst j2, j1, GK2
      jcall gc_pair
      jldi j1, 0
      jld j2, j1, GT1
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, GT1
      jjmp gc_next2
  gc_nextf:
    jldi j1, 0
    jld j2, j1, GI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, GI
    jjmp gc_fact
gc_report:
  jldi j1, 0
  jret

; Two facts met: the first at GP (its end GLE), the other GJ units on, its skeleton GK2. The glue's print (how far, and
; each unit between) counted at GLT {key, times, where it was seen, how far}, and the construction at GKT. Uses j1-j14.
gc_pair:
  jldi j1, 0
  jld j5, j1, FNVO
  jld j6, j1, FNVP
  jld j2, j1, GJ
  jxor j5, j5, j2
  jmul j5, j5, j6
  jld j7, j1, GLE
  jldi j8, 1
  gcp_unit:
    jadd j7, j7, j8
    jld j2, j1, GLE
    jld j3, j1, GJ
    jadd j2, j2, j3
    jsub j2, j7, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, gcp_key
    jadd j2, j7, j1
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jxor j5, j5, j2
    jmul j5, j5, j6
    jjmp gcp_unit
gcp_key:
  jjnz j5, gcp_k
  jldi j5, 1
gcp_k:
  jst j5, j1, GT3
  jldi j2, GLT
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
  jld j2, j1, GLE
  jst j2, j4, 16
  jld j2, j1, GJ
  jst j2, j4, 24
  jld j2, j1, GLN
  jadd j2, j2, j3
  jst j2, j1, GLN
  jld j2, j1, GP                ; the construction: skeleton, glue, skeleton
  jld j5, j2, 16
  jld j6, j1, FNVP
  jmul j5, j5, j6
  jld j2, j1, GT3
  jxor j5, j5, j2
  jmul j5, j5, j6
  jld j2, j1, GK2
  jxor j5, j5, j2
  jmul j5, j5, j6
  jjnz j5, gcp_k2
  jldi j5, 1
gcp_k2:
  jldi j2, GKT                  ; {key, times, the first skeleton, the glue's print, the other skeleton, how far}
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
  jld j2, j1, GP
  jld j2, j2, 16
  jst j2, j4, 16
  jld j2, j1, GT3
  jst j2, j4, 24
  jld j2, j1, GK2
  jst j2, j4, 32
  jld j2, j1, GJ
  jst j2, j4, 40
  jret

; Written: how many joinings, how many glues and constructions proved twice or more, and the glues that join the most
; (the first twenty: criterion, the report's size). Uses j1-j14.
glue_report:
  jldi j1, S_GLU
  jcall puts
  jld j2, j1, GLN
  jcall putnum
  jldi j1, S_GLD
  jcall puts
  jldi j2, GLT
  jcall gl_proved
  jcall putnum
  jldi j2, 47
  jcall putch
  jldi j2, GKT
  jcall gl_proved
  jcall putnum
  jldi j1, 0
  jst j1, j1, GI
  glr_lap:
    jldi j1, 0
    jld j2, j1, GI
    jldi j3, 20
    jsub j3, j2, j3
    jjz j3, glr_done
    jldi j11, 0                 ; the glue not written yet that joins the most
    jldi j12, 0
    jld j9, j1, GLT
    jld j10, j1, GLT + 8
    jldi j2, 1
    jadd j10, j10, j2
    glr_find:
      jjz j10, glr_found
      jld j2, j9, 0
      jjz j2, glr_fnext
      jld j2, j9, 8
      jsub j3, j11, j2
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, glr_fnext
      jadd j11, j2, j1
      jadd j12, j9, j1
    glr_fnext:
      jld j2, j1, GLT + 24
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
      jjmp glr_find
  glr_found:
    jjz j12, glr_done
    jst j12, j1, GP
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j12, j1, GP
    jld j2, j12, 24
    jjnz j2, glr_far
    jldi j2, 61                 ; "=": the same core
    jcall putch
    jjmp glr_count
  glr_far:
    jldi j3, 1
    jsub j2, j2, j3
    jjnz j2, glr_units
    jldi j2, 43                 ; "+": right after
    jcall putch
    jjmp glr_count
  glr_units:
    jld j2, j12, 16
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, GT1
    glr_unit:
      jldi j1, 0
      jld j12, j1, GP
      jld j2, j12, 16
      jld j3, j12, 24
      jadd j2, j2, j3
      jld j3, j1, GT1
      jsub j2, j3, j2
      jjz j2, glr_count
      jadd j2, j3, j1
      jcall tok_at
      jjnz j2, glr_word
      jldi j2, 124                ; ("|": a renglon's end)
      jcall putch
      jjmp glr_put
    glr_word:
      jcall putword
    glr_put:
      jldi j1, 0
      jld j2, j1, GT1
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, GT1
      jld j12, j1, GP
      jld j3, j12, 16
      jld j4, j12, 24
      jadd j3, j3, j4
      jsub j3, j2, j3
      jjz j3, glr_count
      jldi j2, 95                 ; "_" between units
      jcall putch
      jjmp glr_unit
  glr_count:
    jldi j2, 40
    jcall putch
    jldi j1, 0
    jld j12, j1, GP
    jld j2, j12, 8
    jcall putnum
    jldi j2, 41
    jcall putch
    jldi j1, 0
    jld j12, j1, GP             ; (not again: its count goes negative while it is written)
    jld j2, j12, 8
    jldi j3, 0
    jsub j2, j3, j2
    jst j2, j12, 8
    jld j2, j1, GI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, GI
    jjmp glr_lap
glr_done:
  jldi j2, 10
  jcall putch
  jjmp flush

; How many entries of the table at j2 have two or more (the anecdote rule) -> j2. Uses j1-j6.
gl_proved:
  jldi j1, 0
  jld j3, j2, 0
  jld j4, j2, 8
  jld j6, j2, 24
  jldi j5, 1
  jadd j4, j4, j5
  jldi j2, 0
  glp_lap:
    jjz j4, glp_done
    jld j5, j3, 0
    jjz j5, glp_next
    jld j5, j3, 8
    jldi j1, 2
    jsub j5, j5, j1
    jldi j1, 63
    jsar j5, j5, j1
    jldi j1, 0
    jjnz j5, glp_next
    jldi j5, 1
    jadd j2, j2, j5
  glp_next:
    jadd j3, j3, j6
    jldi j5, 1
    jsub j4, j4, j5
    jjmp glp_lap
glp_done:
  jret

; A window of a proved skeleton, affirmed (GMODE 6): listed at GFL {its start, its end, its skeleton}. Uses j1-j8.
f_glue:
  jldi j1, 0
  jld j2, j1, WN
  jjnz j2, fgl_done
  jld j5, j1, WK
  jldi j2, TMI
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, fgl_done
  jld j2, j4, 8
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, fgl_done
  jld j3, j1, GFN
  jldi j4, 24
  jmul j4, j3, j4
  jld j5, j1, GFL
  jadd j4, j4, j5
  jld j2, j1, WJ
  jst j2, j4, 0
  jld j5, j1, WM
  jadd j2, j2, j5
  jldi j5, 1
  jadd j2, j2, j5
  jst j2, j4, 8
  jld j2, j1, WK
  jst j2, j4, 16
  jadd j3, j3, j5
  jst j3, j1, GFN
fgl_done:
  jldi j1, 0
  jret

; Thinking on from an answer (Capitan, 2026-11-07: "the structure is the routine and the furniture its arguments,
; recombined"; "not only answers: the question it asks itself, what it analyses"; "and that is a while"; and "weave
; everything on the way: I want it to learn, I take the risk"). The structure is the instruction, the furniture what
; it is given. From the word the answer ends with (THX), every branch at once: each fact of the reading that starts on
; the word, when its skeleton is one the books went on with from a word another fact ended on ("=", GKT, the
; library's summed in), proved twice at least, whatever came before (plastic), and has a word in its middle (marks
; alone are no instruction). That is a question it asks itself, and the fact its answer; the word the fact ends on
; joins the row, to be thought on in its turn (breadth first). A word already thought on is not asked again, so the
; while ends. A word none of its branches went on from is one it ran out of facts on: wanted (pensar), all of them
; read again together in the talk's next round. Uses j1-j14.
think:
  jldi j1, 0
  jld j2, j1, THR
  jjnz j2, th_ready
  jcall th_build
  jcall th_genome
  jcall dia_load
th_ready:
  jcall th_seed
  jldi j2, TCS                  ; the question is a recipe: what the answer already used of its furniture (its core and
  jldi j3, 8                    ; its middle's) is spent
  jcall pl_new
  jldi j1, 0
  jld j5, j1, QCW
  jldi j2, TCS
  jcall pl_take
  jldi j1, 0
  jld j12, j1, WSK
  jcall th_spend
  jldi j2, TVT
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jld j11, j1, NV               ; the row: a word at most once
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, THQ
  jst j1, j1, THQH
  jst j1, j1, THQT
  jld j2, j1, THX
  jcall th_push
  th_lap:
    jldi j1, 0                  ; the next word of the row
    jld j2, j1, THQH
    jld j3, j1, THQT
    jsub j3, j2, j3
    jjz j3, th_done
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, THQ
    jadd j3, j3, j4
    jld j3, j3, 0
    jst j3, j1, THX
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, THQH
    jst j1, j1, THW             ; its branches weighed: each fact that may go on votes with the times the books went
    jst j1, j1, THWG            ; on with its structure (a pair said n times votes n times); those that ask what the
    jst j1, j1, THPS            ; question asks apart
    jcall th_branches
    jldi j1, 0
    jld j2, j1, THWG            ; no branch of the question's: the question still points there, read it again
    jjnz j2, th_some
    jld j2, j1, THX
    jcall want_word
    jldi j1, 0
  th_some:
    jld j2, j1, THW
    jjz j2, th_lap              ; (none at all: a word it ran out of facts on)
  th_pick:
    jcall th_rand               ; its choice: the seed's lottery over the votes (what it does not choose it does not say)
    jldi j1, 0
    jldi j3, 1
    jshr j2, j2, j3
    jld j3, j1, THWG            ; (the question guides: among its own branches first, if it has some)
    jjnz j3, th_among
    jld j3, j1, THW
  th_among:
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j2, j2, j4
    jst j2, j1, THP
    jldi j2, 1
    jst j2, j1, THPS
    jcall th_branches
    jldi j1, 0
    jjmp th_lap
th_done:
  jldi j1, 0                    ; the sentence it was weaving ends
  jld j2, j1, LINEO
  jjz j2, thd_closed
  jst j1, j1, LINEO
  jldi j2, 10
  jcall putch
  jcall flush
thd_closed:
  jldi j1, 0
  jret

; j2 = 1 if the reading says the fact THX «THC» THY twice at least: two facts of THX's list with that skeleton end on
; that word. Uses j1-j9.
th_twice:
  jldi j1, 0
  jldi j8, 0
  jld j2, j1, THX
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, THH
  jadd j2, j2, j3
  jld j7, j2, 0
  thw_lap:
    jjz j7, thw_no
    jldi j3, 1
    jsub j7, j7, j3
    jldi j3, 24
    jmul j3, j7, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jldi j3, 3
    jshl j3, j7, j3
    jld j4, j1, THN
    jadd j3, j3, j4
    jld j7, j3, 0
    jld j3, j9, 16
    jld j4, j1, THC
    jsub j3, j3, j4
    jjnz j3, thw_lap
    jld j2, j9, 8
    jst j7, j1, THF
    jcall tok_at
    jld j7, j1, THF
    jld j3, j1, THY
    jsub j2, j2, j3
    jjnz j2, thw_lap
    jldi j3, 1
    jadd j8, j8, j3
    jldi j3, 2
    jsub j3, j8, j3
    jjnz j3, thw_lap
    jldi j2, 1
    jret
thw_no:
  jldi j2, 0
  jret

; The branches of the word THX: each fact of its list that starts there and may go on (a word not thought on yet, a
; structure the books went on with twice at least, a word in its middle, the fact said twice at least). THPS 0: their
; votes summed at THW (each the times at KCT). THPS 1: the one whose votes hold the place THP is said, and its word
; joins the row. Uses j1-j14.
th_branches:
  jldi j2, THSN
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jld j2, j1, THX
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, THH
  jadd j2, j2, j3
  jld j2, j2, 0
  jst j2, j1, THI
  thb_lap:
    jldi j1, 0
    jld j2, j1, THI
    jjz j2, thb_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, THG             ; (the fact's number)
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, THN
    jadd j3, j3, j4
    jld j3, j3, 0
    jst j3, j1, THI
    jld j2, j1, THG
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jld j2, j9, 8
    jcall tok_at
    jst j2, j1, THY
    jld j5, j1, THY             ; a word not thought on yet
    jldi j2, TVT
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjnz j2, thb_lap
    jld j2, j1, THG             ; its skeleton: the books went on with it, two times at least
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jld j5, j9, 16
    jst j5, j1, THC
    jldi j2, KCT
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjz j2, thb_lap
    jld j2, j4, 8
    jst j2, j1, THV
    jldi j3, 2
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, thb_lap
    jld j5, j1, THC             ; and a word in its middle
    jldi j2, TMI
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjz j2, thb_lap
    jst j4, j1, THE
    jadd j12, j4, j1
    jcall sk_word
    jjz j2, thb_lap
    jcall th_goal               ; the question guides it? (said once is enough then, as for an answer the book says)
    jldi j1, 0
    jst j2, j1, THGO
    jjnz j2, thb_guided
    jcall th_twice              ; free: the fact itself said twice at least (the anecdote rule)
    jjz j2, thb_lap
  thb_guided:
    jcall th_votes              ; (and what it thought of it before, as one more reading)
    jld j2, j1, THPS
    jjnz j2, thb_choose
    jld j2, j1, THW             ; its votes
    jld j3, j1, THVV
    jadd j2, j2, j3
    jst j2, j1, THW
    jld j2, j1, THGO
    jjz j2, thb_lap
    jld j2, j1, THWG
    jld j3, j1, THVV
    jadd j2, j2, j3
    jst j2, j1, THWG
    jjmp thb_lap
  thb_choose:
    jld j2, j1, THWG            ; (only among the question's own, if it has some)
    jjz j2, thb_any
    jld j2, j1, THGO
    jjz j2, thb_lap
  thb_any:
    jld j2, j1, THP             ; the place falls in its votes?
    jld j3, j1, THVV
    jsub j4, j2, j3
    jst j4, j1, THP
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, thb_lap
    jcall th_note               ; chosen: thought once more (its diary)
    jcall th_line               ; woven into the sentence, or an answer it thought
    jldi j1, 0
    jld j2, j1, THY
    jjmp th_push
thb_done:
  jldi j1, 0
  jret

; The next number of the seed's lottery (splitmix64 over THRS) -> j2. Uses j1-j4.
th_rand:
  jldi j1, 0
  jld j2, j1, THRS
  jldi j3, 0
  jshi j3, 9E37h
  jshi j3, 79B9h
  jshi j3, 7F4Ah
  jshi j3, 7C15h
  jadd j2, j2, j3
  jst j2, j1, THRS
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
  jret

; The print of word j2's letters folded into j5 (FNV-1a). Uses j1, j3-j8.
th_wprint:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j7, j3, 16
  jld j3, j3, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jld j6, j1, FNVP
  jwhile j7
    jldb j8, j3, 0
    jxor j5, j5, j8
    jmul j5, j5, j6
    jldi j8, 1
    jadd j3, j3, j8
    jsub j7, j7, j8
  jwend
  jldi j8, 32
  jxor j5, j5, j8
  jmul j5, j5, j6
  jret

; Its seed for this thought (Capitan, 2026-11-07: "the seed, a mix of its genome with the freedom of its own history"):
; its genome (GEN: born with its first question, kept in its house, "genoma"), its history (HIST: everything its
; library holds, summed by the labels' prints, so their order does not matter), the question and the word it thinks
; from, by their letters -> THRS. The same Razar with the same history and question chooses the same; another genome
; or more books, another choice. Uses j1-j14.
th_seed:
  jldi j1, 0
  jld j5, j1, FNVO              ; the question's words and the word, by letters
  jld j9, j1, QQS
  ths_q:
    jldi j1, 0
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, ths_word
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, ths_qnext
    jcall th_wprint
  ths_qnext:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp ths_q
ths_word:
  jst j5, j1, THRS
  jld j2, j1, THX
  jcall th_wprint
  jld j2, j1, GEN
  jxor j5, j5, j2
  jld j6, j1, FNVP
  jmul j5, j5, j6
  jld j2, j1, HIST
  jxor j5, j5, j2
  jmul j5, j5, j6
  jld j2, j1, DIAH              ; and the routes it thought by before
  jxor j5, j5, j2
  jmul j5, j5, j6
  jst j5, j1, THRS
  jld j5, j1, FNVO              ; the route starts at the word the answer ends with
  jld j2, j1, THX
  jcall th_wprint
  jst j5, j1, THCH
  jret

; Its genome and its history, once a reading. The genome is read from its house ("genoma"); with none, it is born now:
; the print of its first question and its history, written there to stay. The history: the sum of the prints of every
; label of its library (lib_load listed them). Uses j1-j14.
th_genome:
  jldi j1, 0
  jst j1, j1, HIST
  jld j9, j1, LSTR
  jld j10, j1, LSTN
  jjz j9, thg_hdone
  jldi j2, 63
  jsar j2, j10, j2
  jjnz j2, thg_hdone
  thg_h:
    jldi j1, 0
    jjz j10, thg_hdone
    jld j7, j9, 0
    jld j5, j1, FNVO
    jld j6, j1, FNVP
    jldi j3, 8
    jadd j3, j9, j3
    jadd j4, j7, j1
    jwhile j4
      jldb j8, j3, 0
      jxor j5, j5, j8
      jmul j5, j5, j6
      jldi j8, 1
      jadd j3, j3, j8
      jsub j4, j4, j8
    jwend
    jld j2, j1, HIST
    jadd j2, j2, j5
    jst j2, j1, HIST
    jldi j3, 7
    jadd j7, j7, j3
    jldi j3, -8
    jand j7, j7, j3
    jldi j3, 8
    jadd j7, j7, j3
    jadd j9, j9, j7
    jldi j3, 1
    jsub j10, j10, j3
    jjmp thg_h
thg_hdone:
  jldi j11, S_GEN               ; its genome
  jldi j12, 6
  jcall sx_read
  jldi j1, 0
  jld j2, j1, SXN
  jldi j3, 8
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, thg_born
  jld j2, j1, SXR
  jld j2, j2, 0
  jst j2, j1, GEN
  jret
thg_born:
  jld j5, j1, FNVO              ; born with its first question and what it knew then
  jld j9, j1, QQS
  thg_q:
    jldi j1, 0
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, thg_qdone
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, thg_qnext
    jcall th_wprint
  thg_qnext:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp thg_q
thg_qdone:
  jld j2, j1, HIST
  jxor j5, j5, j2
  jld j6, j1, FNVP
  jmul j5, j5, j6
  jst j5, j1, GEN
  jldi j10, 4
  jldi j11, S_GEN
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, thg_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jldi j11, GEN
  jldi j12, 8
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
thg_done:
  jldi j1, 0
  jret

; The print of the thought THX «THE» THY by letters (the word, the structure's middle, the word it answers with), so
; it stays the same in every reading -> j5 (never 0). Uses j1-j11.
th_tkey:
  jldi j1, 0
  jld j5, j1, FNVO
  jld j2, j1, THX
  jcall th_wprint
  jld j12, j1, THE
  jld j9, j12, 16
  jld j10, j12, 24
  jldi j11, 1
  jwhile j10
    jldi j1, 0
    jadd j2, j9, j11
    jst j5, j1, THK2
    jcall tok_at
    jld j5, j1, THK2
    jcall th_wprint
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
  jld j2, j1, THY
  jcall th_wprint
  jjnz j5, thk_k
  jldi j5, 1
thk_k:
  jst j5, j1, THK2
  jret

; A branch's votes (THV the times the books went on with its structure, each fact said voting once): the first time
; this word meets the thought (THSN), each different route it reached that thought by before votes too, as one more
; reading (Capitan: "what makes the difference is the diversity of thought"; one route, one vote: thinking it again by
; the same route adds nothing) -> THVV. Uses j1-j11.
th_votes:
  jldi j1, 0
  jld j2, j1, THV
  jst j2, j1, THVV
  jcall th_tkey
  jldi j2, THSN
  jcall pl_take
  jldi j1, 0
  jjz j6, thv_done
  jld j5, j1, THK2
  jldi j2, DRC
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, thv_done
  jld j2, j4, 8
  jld j3, j1, THV
  jmul j2, j2, j3
  jld j3, j1, THVV
  jadd j2, j2, j3
  jst j2, j1, THVV
thv_done:
  jldi j1, 0
  jret

; The thought just chosen (THK2) written in its diary by its route (the thoughts that led to it, THCH): a new route
; is one more route to that thought (DRC); the same route is only thought once more (its times). The route goes on
; from it. Uses j1-j8.
th_note:
  jldi j1, 0
  jld j6, j1, FNVP
  jld j5, j1, THCH
  jmul j5, j5, j6
  jld j2, j1, THK2
  jxor j5, j5, j2
  jmul j5, j5, j6
  jjnz j5, thn_k
  jldi j5, 1
thn_k:
  jst j5, j1, THCH
  jldi j2, DIA
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
  jst j3, j1, DIAW
  jjz j6, thn_done
  jld j5, j1, THK2              ; a new route to it
  jst j5, j4, 16
  jldi j2, DRC
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
thn_done:
  jldi j1, 0
  jret

; Its diary read from its house ("diario": qwords {2, how many}, each {the route's print, the thought's print,
; times}) into DIA (by route {key, times, thought}) and DRC (by thought, its routes), and its print (DIAH: the sum of
; the routes' prints, so neither the order nor thinking the same again changes it). None: empty ones. Uses j1-j14.
dia_load:
  jldi j2, DIA
  jldi j3, 24
  jcall pl_new
  jldi j2, DRC
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, DIAH
  jst j1, j1, DIAW
  jldi j11, S_DIA
  jldi j12, 6
  jcall sx_read
  jldi j1, 0
  jld j2, j1, SXN
  jldi j3, 16
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, dl_done
  jld j9, j1, SXR
  jld j2, j9, 0
  jldi j3, 2
  jsub j2, j2, j3
  jjnz j2, dl_done
  jld j10, j9, 8
  jld j2, j1, SXN               ; (as many as the file holds)
  jldi j3, 16
  jsub j2, j2, j3
  jldi j3, 24
  jdiv j2, j2, j3
  jsub j3, j2, j10
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, dl_n
  jadd j10, j2, j1
dl_n:
  jldi j2, 16
  jadd j9, j9, j2
  dl_lap:
    jldi j1, 0
    jjz j10, dl_done
    jld j5, j9, 0
    jjz j5, dl_next
    jst j9, j1, TI
    jst j10, j1, TJ
    jldi j2, DIA
    jcall pl_take
    jldi j1, 0
    jld j9, j1, TI
    jld j10, j1, TJ
    jld j2, j9, 16
    jst j2, j4, 8
    jld j2, j9, 8
    jst j2, j4, 16
    jld j2, j9, 0
    jld j3, j1, DIAH
    jadd j2, j2, j3
    jst j2, j1, DIAH
    jjz j6, dl_next
    jld j5, j9, 8
    jldi j2, DRC
    jcall pl_take
    jldi j1, 0
    jld j9, j1, TI
    jld j10, j1, TJ
    jld j2, j4, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j4, 8
  dl_next:
    jldi j2, 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp dl_lap
dl_done:
  jldi j1, 0
  jret

; Its diary, when it thought something, written back to its house. Uses j1-j14.
dia_write:
  jldi j1, 0
  jld j2, j1, DIAW
  jjz j2, dw_done
  jld j2, j1, DIA
  jjz j2, dw_done
  jld j11, j1, DIA + 16         ; {2, how many}, then each {route, thought, times}
  jldi j2, 24
  jmul j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jst j11, j1, DIAN
  jcall room
  jldi j1, 0
  jst j13, j1, DIAB
  jldi j2, 2
  jst j2, j13, 0
  jld j2, j1, DIA + 16
  jst j2, j13, 8
  jldi j2, 16
  jadd j8, j13, j2
  jld j9, j1, DIA
  jld j10, j1, DIA + 8
  jldi j2, 1
  jadd j10, j10, j2
  dw_lap:
    jjz j10, dw_file
    jld j2, j9, 0
    jjz j2, dw_next
    jst j2, j8, 0
    jld j2, j9, 16
    jst j2, j8, 8
    jld j2, j9, 8
    jst j2, j8, 16
    jldi j2, 24
    jadd j8, j8, j2
  dw_next:
    jld j2, j1, DIA + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp dw_lap
dw_file:
  jldi j10, 12
  jldi j11, S_DIA
  jldi j12, 6
  jcall ask
  jldi j10, 4
  jldi j11, S_DIA
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, dw_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, DIAB
  jld j12, j1, DIAN
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
dw_done:
  jldi j1, 0
  jret

; j2 = 1 if the branch (THE, THY) asks what the question asks (Capitan, 2026-11-07: "the guide is the furniture"):
; a word of its structure's middle is furniture of the question (said in it, and no foundation of the house: "de",
; "el" are structure, "hijo", "padre" are what it is about) the thought has not spent yet (TCS: the question is a
; recipe, each piece used once), and the word it answers with is not said there. Uses j1-j11.
th_goal:
  jldi j1, 0
  jld j2, j1, THY
  jcall q_has
  jjnz j2, thgo_no
  jldi j1, 0
  jld j12, j1, THE
  jld j9, j12, 16
  jld j10, j12, 24
  jldi j11, 1
  jwhile j10
    jldi j1, 0
    jadd j2, j9, j11
    jcall tok_at
    jst j2, j1, QWL
    jcall g_core
    jldi j1, 0
    jjz j3, thgo_next
    jld j2, j1, QWL
    jcall q_has
    jjz j2, thgo_next
    jldi j1, 0
    jld j5, j1, QWL             ; (and not spent yet by the thought)
    jldi j2, TCS
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjnz j2, thgo_next
    jldi j2, 1
    jret
  thgo_next:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
thgo_no:
  jldi j1, 0
  jldi j2, 0
  jret

; The furniture of skeleton j12's middle (no mark, no foundation) spent (TCS). Uses j1-j11.
th_spend:
  jldi j1, 0
  jld j9, j12, 16
  jld j10, j12, 24
  jldi j11, 1
  jwhile j10
    jldi j1, 0
    jadd j2, j9, j11
    jcall tok_at
    jst j2, j1, QWL
    jcall g_core
    jldi j1, 0
    jjz j3, ths2_next
    jld j5, j1, QWL
    jldi j2, TCS
    jcall pl_take
  ths2_next:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
  jret

; The branch just said, if it asks what the question asks (THGO): an answer it thought, said as a sentence with its
; mark, and counted as an answer. Uses j1-j11.
th_answer:
  jldi j1, 0
  jld j2, j1, THGO
  jjz j2, tha_done
  jld j2, j1, QNA
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QNA
  jld j12, j1, THE              ; its furniture spent
  jcall th_spend
  jldi j1, S_ANS
  jcall puts
  jld j2, j1, THX
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, THE
  jcall put_plain
  jld j2, j1, THY
  jcall putword
  jldi j1, S_PNSE
  jcall puts
  jldi j2, 10
  jcall putch
  jjmp flush
tha_done:
  jret

; A question about a structure (Capitan, 2026-11-07: "the guide is the furniture, unless the structure is treated as
; furniture: what does 'con' mean?"). Its last word, a foundation of the house (no mark, no arrow), is what it is
; about when it stands where the book almost never puts it: right before a limit, less often than the book closes a
; building anywhere (its buildings by its units: relative to the book, not a number). A structure joins two things,
; so standing at the end it joins nothing: it is mentioned, not used. Its meaning is how it is used: the fact of its
; structure, "_ w _", the reading says the most, said as a sentence with "(asi se usa)". Uses j1-j14.
q_struct:
  jldi j1, 0
  jld j9, j1, QQE               ; the question's last word
  qs_back:
    jldi j1, 0
    jld j2, j1, QQS
    jsub j2, j9, j2
    jjz j2, qs_done
    jldi j2, 1
    jsub j9, j9, j2
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qs_back
    jst j2, j1, QSW
    jcall w_mark
    jldi j1, 0
    jjnz j3, qs_back
  jld j2, j1, QSW               ; a foundation, no arrow
  jcall g_core
  jldi j1, 0
  jjnz j3, qs_done
  jld j2, j1, QSW
  jcall is_arrow
  jjnz j2, qs_done
  jldi j1, 0                    ; how often the book puts it right before a limit, against how often it is anywhere
  jst j1, j1, QSO
  jst j1, j1, QSL
  jldi j9, 1
  qs_count:
    jldi j1, 0
    jld j2, j1, NTOK
    jsub j2, j9, j2
    jjz j2, qs_counted
    jadd j2, j9, j1
    jcall tok_at
    jld j3, j1, QSW
    jsub j2, j2, j3
    jjnz j2, qs_cnext
    jld j2, j1, QSO
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QSO
    jadd j2, j9, j3
    jld j3, j1, NTOK
    jsub j3, j2, j3
    jjz j3, qs_cnext
    jcall tok_at
    jjz j2, qs_cnext
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, qs_cnext
    jld j2, j1, QSL
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QSL
  qs_cnext:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qs_count
qs_counted:
  jld j2, j1, QSL               ; mentioned: at an end less than the book closes a building, end / all < buildings / units
  jld j3, j1, NTOK
  jmul j2, j2, j3
  jld j3, j1, QSO
  jld j4, j1, NBLD
  jmul j3, j3, j4
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, qs_done
  jld j5, j1, FNVO              ; its structure "_ w _", as gather keys it
  jld j3, j1, QSW
  jadd j2, j5, j1
  jcall hw
  jldi j3, 1
  jcall hw
  jjnz j2, qs_k
  jldi j2, 1
qs_k:
  jst j2, j1, QSK
  jadd j5, j2, j1
  jldi j2, TMI
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, qs_done
  jst j4, j1, QSE
  jldi j2, QST                  ; the fact of it the reading says the most
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, QSB
  jst j1, j1, QSN
  qs_fact:
    jldi j1, 0
    jld j2, j1, QSN
    jld j3, j1, GFN
    jsub j3, j2, j3
    jjz j3, qs_said
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jld j2, j9, 16
    jld j3, j1, QSK
    jsub j2, j2, j3
    jjnz j2, qs_fnext
    jld j2, j9, 0
    jcall tok_at
    jst j2, j1, QSX
    jld j2, j9, 8
    jcall tok_at
    jst j2, j1, QSY
    jld j5, j1, QSX
    jld j6, j1, FNVP
    jmul j5, j5, j6
    jxor j5, j5, j2
    jmul j5, j5, j6
    jjnz j5, qs_fk
    jldi j5, 1
  qs_fk:
    jldi j2, QST
    jcall pl_take
    jldi j1, 0
    jld j2, j4, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j3, j1, QSB
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, qs_fnext
    jst j2, j1, QSB
    jld j2, j1, QSX
    jst j2, j1, QSA
    jld j2, j1, QSY
    jst j2, j1, QSZ
  qs_fnext:
    jldi j1, 0
    jld j2, j1, QSN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QSN
    jjmp qs_fact
qs_said:
  jld j2, j1, QSB
  jjz j2, qs_done
  jld j2, j1, QNA
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QNA
  jldi j1, S_ANS
  jcall puts
  jld j2, j1, QSA
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, QSE
  jcall put_plain
  jld j2, j1, QSZ
  jcall putword
  jldi j1, S_USA
  jcall puts
  jldi j2, 10
  jcall putch
  jjmp flush
qs_done:
  jldi j1, 0
  jret

; Nothing fits the question, and it is about no structure: it still asks about its furniture (Capitan: "the guide is
; the furniture"). Of each core of the question (furniture, no arrow), what the book says the most of it: the fact of
; a proved skeleton with a word in its middle that has the core at one end and the reading says the most, said as a
; sentence, and thought on from its other end (woven, as an answer the book says). Uses j1-j14.
q_about:
  jldi j1, 0
  jld j9, j1, QQS
  qa2_core:
    jldi j1, 0
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qa2_done
    jst j9, j1, QP
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qa2_next
    jst j2, j1, QCW
    jcall g_core
    jjz j3, qa2_next
    jldi j1, 0
    jld j2, j1, QCW
    jcall is_arrow
    jjnz j2, qa2_next
    jcall qa2_most
  qa2_next:
    jldi j1, 0
    jld j9, j1, QP
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qa2_core
qa2_done:
  jldi j1, 0
  jret

; The fact of the core QCW the reading says the most (QST by ends {key, times}): said and thought on. Uses j1-j14.
qa2_most:
  jldi j2, QST
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, QSB
  jst j1, j1, QSN
  qa2_fact:
    jldi j1, 0
    jld j2, j1, QSN
    jld j3, j1, GFN
    jsub j3, j2, j3
    jjz j3, qa2_said
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jst j9, j1, QSE
    jld j2, j9, 0
    jcall tok_at
    jst j2, j1, QSX
    jld j9, j1, QSE
    jld j2, j9, 8
    jcall tok_at
    jst j2, j1, QSY
    jld j3, j1, QCW             ; the core at one end
    jld j4, j1, QSX
    jsub j4, j4, j3
    jjz j4, qa2_end
    jld j4, j1, QSY
    jsub j4, j4, j3
    jjnz j4, qa2_fnext
  qa2_end:
    jld j9, j1, QSE             ; a skeleton with a word in its middle
    jld j5, j9, 16
    jst j5, j1, QSK
    jldi j2, TMI
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjz j2, qa2_fnext
    jst j4, j1, QSZ
    jadd j12, j4, j1
    jcall sk_word
    jjz j2, qa2_fnext
    jld j5, j1, QSX             ; its times
    jld j6, j1, FNVP
    jmul j5, j5, j6
    jld j2, j1, QSY
    jxor j5, j5, j2
    jmul j5, j5, j6
    jld j2, j1, QSK
    jxor j5, j5, j2
    jmul j5, j5, j6
    jjnz j5, qa2_fk
    jldi j5, 1
  qa2_fk:
    jldi j2, QST
    jcall pl_take
    jldi j1, 0
    jld j2, j4, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j3, j1, QSB
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, qa2_fnext
    jst j2, j1, QSB
    jld j2, j1, QSX
    jst j2, j1, QSA
    jld j2, j1, QSY
    jst j2, j1, QSO
    jld j2, j1, QSZ
    jst j2, j1, QSL
  qa2_fnext:
    jldi j1, 0
    jld j2, j1, QSN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QSN
    jjmp qa2_fact
qa2_said:
  jld j2, j1, QSB
  jjz j2, qa2_none
  jld j2, j1, QNA
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QNA
  jldi j1, S_ANS
  jcall puts
  jld j2, j1, QSA
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, QSL
  jcall put_plain
  jld j2, j1, QSO
  jcall putword
  jldi j1, 0                    ; thought on from its other end, as an answer the book says
  jld j2, j1, QSL
  jst j2, j1, WSK
  jldi j2, 1
  jst j2, j1, LINEO
  jld j2, j1, QSO
  jld j3, j1, QCW
  jsub j3, j2, j3
  jjnz j3, qa2_from
  jld j2, j1, QSA               ; (the core ends it: from the other, on a new sentence)
  jst j1, j1, LINEO
  jst j2, j1, THX
  jldi j2, 10
  jcall putch
  jcall flush
  jjmp think
qa2_from:
  jst j2, j1, THX
  jcall flush
  jjmp think
qa2_none:
  jldi j1, 0
  jret

; The dictionary of instructions (Capitan, 2026-11-07: "language is instructions and sentences programs"; "we need a
; dictionary of instructions: it must be stored and perfected"; "not only the common one serves: everything proven
; serves"). An instruction is a word the house calls foundation. Each of its appearances works between what stands on
; its left and on its right, each furniture (M), foundation (E) or a limit, a mark or an edge (L): nine ways, and
; whether "_ w _" turns on itself (it joins two that can swap). Every way the book shows twice at least (the anecdote
; rule) is a function of it that is proven; which one it is doing is decided where it stands. They are counts: every
; book adds its own, and the dictionary is perfected with each one. INS: by word {times, nine ways, swaps} (11 qwords).
INSQ  = 96                      ; (the bytes of a word's counts: times, nine ways, swaps, contexts)

; The room of the dictionary, empty. Uses j1-j14.
ins_room:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, INSQ
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, INS
  jld j2, j1, NV
  jldi j3, INSQ
  jmul j2, j2, j3
  jadd j3, j13, j1
  insr_z:
    jjz j2, insr_done
    jst j1, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jsub j2, j2, j4
    jjmp insr_z
insr_done:
  jldi j2, PRT                  ; (and the contexts two instructions share)
  jldi j3, 32
  jcall pl_new
  jldi j1, 0
  jret

; The unit at j2's kind: 0 furniture, 1 foundation, 2 a limit, a mark or an edge. Uses j1-j5.
ins_kind:
  jjz j2, ik_l
  jst j2, j1, INSW2
  jcall w_mark
  jldi j1, 0
  jjnz j3, ik_l
  jld j2, j1, INSW2
  jcall g_core
  jldi j1, 0
  jjz j3, ik_e
  jldi j2, 0
  jret
ik_e:
  jldi j2, 1
  jret
ik_l:
  jldi j1, 0
  jldi j2, 2
  jret

; This book's instructions counted into INS (eating: the whole book). Uses j1-j14.
ins_scan:
  jcall ins_room
  jldi j9, 1
  is_lap:
    jldi j1, 0
    jld j2, j1, NTOK
    jldi j3, 1
    jsub j2, j2, j3
    jsub j2, j9, j2
    jjz j2, is_swaps
    jst j9, j1, INSI
    jadd j2, j9, j1
    jcall tok_at
    jjz j2, is_next
    jst j2, j1, INSW
    jcall w_mark
    jldi j1, 0
    jjnz j3, is_next
    jld j2, j1, INSW
    jcall g_core
    jldi j1, 0
    jjnz j3, is_next            ; (furniture: no instruction)
    jld j2, j1, INSI            ; its way: left kind * 3 + right kind
    jldi j3, 1
    jsub j2, j2, j3
    jcall tok_at
    jcall ins_kind
    jldi j3, 3
    jmul j2, j2, j3
    jst j2, j1, INSK
    jld j2, j1, INSI
    jldi j3, 1
    jadd j2, j2, j3
    jcall tok_at
    jcall ins_kind
    jld j3, j1, INSK
    jadd j2, j2, j3
    jldi j3, 1                  ; its counts: times, and that way
    jadd j2, j2, j3
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, INSW
    jldi j4, INSQ
    jmul j3, j3, j4
    jld j4, j1, INS
    jadd j3, j3, j4
    jld j4, j3, 0
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j3, 0
    jadd j3, j3, j2
    jld j4, j3, 0
    jadd j4, j4, j5
    jst j4, j3, 0
  is_next:
    jldi j1, 0
    jld j9, j1, INSI
    jldi j2, 1
    jadd j9, j9, j2
    jjmp is_lap
is_swaps:
  jldi j9, 1                    ; and the swaps of "_ w _" each one's skeleton proved
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, INSQ
    jmul j3, j9, j3
    jld j4, j1, INS
    jadd j8, j3, j4
    jld j2, j8, 0
    jjz j2, iss_next
    jst j8, j1, INSE
    jst j9, j1, INSI
    jst j10, j1, INSK
    jld j2, j1, FNVO
    jadd j3, j9, j1
    jcall hw
    jldi j3, 1
    jcall hw
    jjnz j2, iss_k
    jldi j2, 1
  iss_k:
    jadd j5, j2, j1
    jldi j2, TMI
    jcall pl_find
    jldi j1, 0
    jld j9, j1, INSI
    jld j10, j1, INSK
    jld j2, j4, 0
    jjz j2, iss_next
    jld j2, j4, 40
    jld j8, j1, INSE
    jst j2, j8, 80
  iss_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j1, 0
  jret

; This book's dictionary into the library: "tablero/funciones-" and the print of its bytes (salted 9: written once).
; Qwords {3, how many}, each {its counts (12 qwords), its bytes} and its letters padded; then the pairs of contexts
; (ie_pairs) and the structures (sk_sect). Uses j1-j14.
ins_eat:
  jldi j1, 0
  jld j2, j1, EATB
  jjz j2, ie_done
  jldi j2, 16
  jst j2, j1, QLW
  jst j1, j1, QLN
  jst j1, j1, QLS
  jcall ie_walk
  jcall ie_pairs
  jcall sk_sect
  jldi j1, 0
  jld j11, j1, QLW
  jcall room
  jldi j1, 0
  jst j13, j1, QLC
  jldi j2, 3
  jst j2, j13, 0
  jld j2, j1, QLN
  jst j2, j13, 8
  jldi j2, 16
  jadd j2, j13, j2
  jst j2, j1, QLP
  jldi j2, 1
  jst j2, j1, QLS
  jcall ie_walk
  jcall ie_pairs
  jcall sk_sect
  jldi j1, 0
  jldi j11, 64
  jcall room
  jldi j1, 0
  jst j13, j1, ELAB
  jld j5, j1, EATB
  jldi j3, 9
  jxor j5, j5, j3
  jld j3, j1, FNVP
  jmul j5, j5, j3
  jldi j6, S_FUN
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jld j2, j1, QLC
  jld j2, j2, 8
  jjz j2, ie_done
  jldi j10, 4
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ie_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, QLC
  jld j12, j1, QLW
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
ie_done:
  jldi j1, 0
  jret

; Every instruction of INS: counted with its bytes (QLS 0: QLN, QLW), or written at QLP (QLS 1). Uses j1-j14.
ie_walk:
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, INSQ
    jmul j3, j9, j3
    jld j4, j1, INS
    jadd j8, j3, j4
    jld j2, j8, 0
    jjz j2, iew_next
    jldi j3, 3                  ; its letters
    jshl j3, j9, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j5, j3, 16
    jld j6, j3, 8
    jld j4, j1, ROOMA
    jadd j6, j6, j4
    jldi j7, 7
    jadd j7, j5, j7
    jldi j4, -8
    jand j7, j7, j4
    jldi j4, 104
    jadd j7, j7, j4
    jld j3, j1, QLN
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, QLN
    jld j3, j1, QLS
    jjnz j3, iew_put
    jld j3, j1, QLW
    jadd j3, j3, j7
    jst j3, j1, QLW
    jjmp iew_next
  iew_put:
    jld j3, j1, QLP
    jadd j4, j3, j7
    jst j4, j1, QLP
    jldi j4, 12
    iew_c:
      jld j2, j8, 0
      jst j2, j3, 0
      jldi j2, 8
      jadd j8, j8, j2
      jadd j3, j3, j2
      jldi j2, 1
      jsub j4, j4, j2
      jjnz j4, iew_c
    jst j5, j3, 0
    jldi j2, 8
    jadd j3, j3, j2
    jldi j2, 1
    jwhile j5
      jldb j4, j6, 0
      jstb j4, j3, 0
      jadd j6, j6, j2
      jadd j3, j3, j2
      jsub j5, j5, j2
    jwend
  iew_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j1, 0
  jret

; The shared contexts, proven (twice at least): counted with their bytes (QLS 0: QLW, after a qword of how many), or
; written at QLP (QLS 1). Each {shared, a's bytes, its letters padded, b's bytes, its letters padded}. Uses j1-j14.
ie_pairs:
  jldi j1, 0
  jst j1, j1, FT1               ; (how many)
  jld j2, j1, QLS
  jjnz j2, iep_head
  jld j2, j1, QLW
  jldi j3, 8
  jadd j2, j2, j3
  jst j2, j1, QLW
  jjmp iep_go
iep_head:
  jld j2, j1, QLP               ; (its place, filled at the end)
  jst j2, j1, FT2
  jldi j3, 8
  jadd j2, j2, j3
  jst j2, j1, QLP
iep_go:
  jld j9, j1, PRT
  jjz j9, iep_done
  jld j10, j1, PRT + 8
  jldi j2, 1
  jadd j10, j10, j2
  iep_lap:
    jldi j1, 0
    jjz j10, iep_done
    jld j2, j9, 0
    jjz j2, iep_next
    jld j2, j9, 24
    jldi j3, 2
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, iep_next
    jst j9, j1, FT3
    jst j10, j1, FT4
    jld j3, j1, FT1
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, FT1
    jld j3, j1, QLS
    jjz j3, iep_size
    jld j3, j1, QLP
    jst j2, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jst j3, j1, QLP
    jjmp iep_words
  iep_size:
    jld j3, j1, QLW
    jldi j4, 8
    jadd j3, j3, j4
    jst j3, j1, QLW
  iep_words:
    jld j9, j1, FT3
    jld j2, j9, 8
    jcall iep_word
    jld j9, j1, FT3
    jld j2, j9, 16
    jcall iep_word
    jldi j1, 0
    jld j9, j1, FT3
    jld j10, j1, FT4
  iep_next:
    jld j2, j1, PRT + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp iep_lap
iep_done:
  jld j2, j1, QLS
  jjz j2, iep_out
  jld j3, j1, FT2
  jld j2, j1, FT1
  jst j2, j3, 0
iep_out:
  jldi j1, 0
  jret

; Word j2 ({its bytes, its letters padded}) counted (QLW) or written at QLP. Uses j1-j8.
iep_word:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j5, j3, 16
  jld j6, j3, 8
  jld j4, j1, ROOMA
  jadd j6, j6, j4
  jldi j7, 7
  jadd j7, j5, j7
  jldi j4, -8
  jand j7, j7, j4
  jldi j4, 8
  jadd j7, j7, j4
  jld j3, j1, QLS
  jjnz j3, iepw_put
  jld j3, j1, QLW
  jadd j3, j3, j7
  jst j3, j1, QLW
  jret
iepw_put:
  jld j3, j1, QLP
  jadd j4, j3, j7
  jst j4, j1, QLP
  jst j5, j3, 0
  jldi j4, 8
  jadd j3, j3, j4
  jldi j4, 1
  jwhile j5
    jldb j8, j6, 0
    jstb j8, j3, 0
    jadd j6, j6, j4
    jadd j3, j3, j4
    jsub j5, j5, j4
  jwend
  jret

; One file of the dictionary (SXR, SXN): each instruction this reading knows adds its counts to INS. Something that
; does not hold together ends the file. Uses j1-j14.
pf_file:
  jldi j1, 0
  jld j2, j1, INS
  jjz j2, pff_done
  jld j9, j1, SXR
  jld j2, j9, 0                 ; (2: no structures yet; 3: with them)
  jst j2, j1, SKV
  jldi j3, 2
  jsub j3, j2, j3
  jjz j3, pff_v
  jldi j3, 3
  jsub j3, j2, j3
  jjnz j3, pff_done
pff_v:
  jld j2, j9, 8
  jst j2, j1, QLW
  jld j2, j1, SXN
  jadd j2, j9, j2
  jst j2, j1, QLH
  jldi j2, 16
  jadd j9, j9, j2
  jst j9, j1, QLK
  pff_lap:
    jldi j1, 0
    jld j2, j1, QLW
    jjz j2, pff_pairs
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, QLW
    jld j9, j1, QLK
    jldi j2, 104
    jadd j2, j9, j2
    jld j3, j1, QLH
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, pff_done
    jld j4, j9, 96
    jldi j3, 63
    jsar j3, j4, j3
    jjnz j3, pff_done
    jldi j3, 7
    jadd j5, j4, j3
    jldi j3, -8
    jand j5, j5, j3
    jadd j5, j2, j5
    jld j3, j1, QLH
    jsub j3, j3, j5
    jldi j6, 63
    jsar j3, j3, j6
    jjnz j3, pff_done
    jst j5, j1, QLK
    jst j9, j1, QLP
    jst j4, j1, WLEN
    jst j4, j1, WBN
    jcall wb_need
    jldi j6, 0
    pff_letter:
      jsub j3, j6, j4
      jjz j3, pff_letters
      jadd j3, j2, j6
      jldb j3, j3, 0
      jld j5, j1, WBP
      jadd j5, j5, j6
      jstb j3, j5, 0
      jldi j3, 1
      jadd j6, j6, j3
      jjmp pff_letter
  pff_letters:
    jcall word_id
    jldi j1, 0
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, pff_lap            ; (an instruction this reading never read)
    jldi j3, INSQ
    jmul j3, j2, j3
    jld j4, j1, INS
    jadd j8, j3, j4
    jld j9, j1, QLP
    jldi j4, 12
    pff_add:
      jld j2, j8, 0
      jld j3, j9, 0
      jadd j2, j2, j3
      jst j2, j8, 0
      jldi j2, 8
      jadd j8, j8, j2
      jadd j9, j9, j2
      jldi j2, 1
      jsub j4, j4, j2
      jjnz j4, pff_add
    jjmp pff_lap
pff_pairs:                      ; then the pairs: {shared, a's bytes, its letters, b's bytes, its letters}
  jldi j1, 0
  jld j9, j1, QLK
  jld j2, j9, 0
  jst j2, j1, QLW
  jldi j2, 8
  jadd j9, j9, j2
  jst j9, j1, QLK
  ppr_lap:
    jldi j1, 0
    jld j2, j1, QLW
    jjz j2, pff_sk
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, QLW
    jld j9, j1, QLK
    jld j2, j9, 0
    jst j2, j1, QLP
    jldi j2, 8
    jadd j9, j9, j2
    jcall ppr_word              ; a
    jjz j2, pff_done
    jst j3, j1, QLC
    jcall ppr_word              ; b
    jjz j2, pff_done
    jst j9, j1, QLK
    jjz j3, ppr_lap             ; (a word this reading never read)
    jld j2, j1, QLC
    jjz j2, ppr_lap
    jld j4, j1, QLP
    jcall fam_addn
    jjmp ppr_lap
pff_sk:                         ; and its structures
  jld j2, j1, SKV
  jldi j3, 3
  jsub j2, j2, j3
  jjnz j2, pff_done
  jld j2, j1, QLK
  jst j2, j1, SKU
  jld j2, j1, QLH
  jst j2, j1, SKEN
  jcall sk_sread
pff_done:
  jldi j1, 0
  jret

; The word at j9 in a pairs file ({its bytes, its letters padded}) -> j3 its number in this reading (0: never read), j9
; past it; j2 = 0 if it does not hold together. Uses j1-j14 (j9 moved).
ppr_word:
  jldi j1, 0
  jld j4, j9, 0
  jldi j3, 63
  jsar j3, j4, j3
  jjnz j3, ppw_bad
  jldi j3, 8
  jadd j2, j9, j3
  jldi j3, 7
  jadd j5, j4, j3
  jldi j3, -8
  jand j5, j5, j3
  jadd j5, j2, j5
  jld j3, j1, QLH
  jsub j3, j3, j5
  jldi j6, 63
  jsar j3, j3, j6
  jjnz j3, ppw_bad
  jst j5, j1, QLS
  jst j4, j1, WLEN
  jst j4, j1, WBN
  jcall wb_need
  jldi j6, 0
  ppw_l:
    jsub j3, j6, j4
    jjz j3, ppw_ld
    jadd j3, j2, j6
    jldb j3, j3, 0
    jld j5, j1, WBP
    jadd j5, j5, j6
    jstb j3, j5, 0
    jldi j3, 1
    jadd j6, j6, j3
    jjmp ppw_l
ppw_ld:
  jcall word_id
  jldi j1, 0
  jadd j3, j2, j1
  jldi j4, 1
  jsub j4, j3, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, ppw_known
  jldi j3, 0
ppw_known:
  jld j9, j1, QLS
  jldi j2, 1
  jret
ppw_bad:
  jldi j1, 0
  jldi j2, 0
  jret

; The dictionary written (the reading's report): its instructions said the most, each with every way it works that
; the books proved twice at least, as left_right (M furniture, E foundation, L a limit or an edge) and its times, and
; "swaps" if "_ w _" turns on itself. Twelve instructions: criterion, the report's size. Uses j1-j14.
ins_report:
  jldi j1, 0
  jld j2, j1, INS
  jjz j2, irp_done
  jldi j1, S_INS
  jcall puts
  jst j1, j1, INSK
  irp_lap:
    jldi j1, 0
    jld j2, j1, INSK
    jldi j3, 12
    jsub j3, j2, j3
    jjz j3, irp_out
    jldi j11, 0
    jldi j12, 0
    jldi j9, 1
    jld j10, j1, NV
    jldi j2, 1
    jsub j10, j10, j2
    jwhile j10
      jldi j3, INSQ
      jmul j3, j9, j3
      jld j4, j1, INS
      jadd j3, j3, j4
      jld j4, j3, 0
      jsub j5, j11, j4
      jldi j6, 63
      jsar j5, j5, j6
      jjz j5, irq_n
      jadd j11, j4, j1
      jadd j12, j9, j1
    irq_n:
      jldi j2, 1
      jadd j9, j9, j2
      jsub j10, j10, j2
    jwend
    jjz j12, irp_out
    jst j12, j1, INSW
    jldi j2, 10
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j2, 32
    jcall putch
    jld j2, j1, INSW
    jcall putword
    jldi j2, 58
    jcall putch
    jst j1, j1, INSI
    irw_lap:
      jldi j1, 0
      jld j2, j1, INSI
      jldi j3, 9
      jsub j3, j2, j3
      jjz j3, irw_swap
      jld j3, j1, INSW
      jldi j4, INSQ
      jmul j3, j3, j4
      jld j4, j1, INS
      jadd j3, j3, j4
      jldi j4, 1
      jadd j4, j2, j4
      jldi j5, 3
      jshl j4, j4, j5
      jadd j3, j3, j4
      jld j4, j3, 0
      jst j4, j1, INSE
      jldi j5, 2
      jsub j5, j4, j5
      jldi j6, 63
      jsar j5, j5, j6
      jjnz j5, irw_next
      jldi j2, 32
      jcall putch
      jld j2, j1, INSI            ; its left kind and right kind
      jldi j3, 3
      jdiv j2, j2, j3
      jcall irp_kind
      jldi j2, 95
      jcall putch
      jld j2, j1, INSI
      jldi j3, 3
      jdiv j4, j2, j3
      jmul j4, j4, j3
      jsub j2, j2, j4
      jcall irp_kind
      jldi j2, 40
      jcall putch
      jld j2, j1, INSE
      jcall putnum
      jldi j2, 41
      jcall putch
    irw_next:
      jldi j1, 0
      jld j2, j1, INSI
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, INSI
      jjmp irw_lap
  irw_swap:
    jld j3, j1, INSW
    jldi j4, INSQ
    jmul j3, j3, j4
    jld j4, j1, INS
    jadd j3, j3, j4
    jld j2, j3, 80
    jldi j5, 2
    jsub j5, j2, j5
    jldi j6, 63
    jsar j5, j5, j6
    jjnz j5, irw_mark
    jldi j2, 32
    jcall putch
    jldi j2, 60
    jcall putch
    jldi j2, 62
    jcall putch
    jldi j1, 0
    jld j3, j1, INSW
    jldi j4, INSQ
    jmul j3, j3, j4
    jld j4, j1, INS
    jadd j3, j3, j4
    jld j2, j3, 80
    jcall putnum
  irw_mark:
    jldi j1, 0                  ; and its kin (the one it shares the most of what it joins with)
    jld j3, j1, NEAR
    jjz j3, irw_nokin
    jld j2, j1, INSW
    jldi j4, 4
    jshl j2, j2, j4
    jadd j3, j3, j2
    jld j2, j3, 0
    jjz j2, irw_nokin
    jst j2, j1, INSE
    jldi j2, 32
    jcall putch
    jldi j2, 126
    jcall putch
    jld j2, j1, INSE
    jcall putword
  irw_nokin:
    jldi j1, 0
    jld j3, j1, INSW            ; (not again: its times go negative while it is written)
    jldi j4, INSQ
    jmul j3, j3, j4
    jld j4, j1, INS
    jadd j3, j3, j4
    jld j2, j3, 0
    jldi j4, 0
    jsub j2, j4, j2
    jst j2, j3, 0
    jld j2, j1, INSK
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, INSK
    jjmp irp_lap
irp_out:
  jldi j9, 1                    ; the written ones back to their times
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, INSQ
    jmul j3, j9, j3
    jld j4, j1, INS
    jadd j3, j3, j4
    jld j2, j3, 0
    jldi j4, 63
    jsar j4, j2, j4
    jjz j4, iro_n
    jldi j4, 0
    jsub j2, j4, j2
    jst j2, j3, 0
  iro_n:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 10
  jcall putch
  jjmp flush
irp_done:
  jret

; The letter of kind j2: M, E or L. Uses j1-j4.
irp_kind:
  jldi j3, 77
  jjz j2, irk_put
  jldi j3, 69
  jldi j4, 1
  jsub j4, j2, j4
  jjz j4, irk_put
  jldi j3, 76
irk_put:
  jadd j2, j3, j1
  jjmp putch

; The spelling of the language (Capitan, 2026-11-07: "an instruction may be badly written: infer it by what it is
; like at its core"; "the ones that do not keep the rule: there is no rule for yyyy, nor for dle ('dl'), nor for porqe
; ('qe')"). The rule is the books': which two letters follow each other inside a word. A pair is proven when two
; different words of a book have it (the anecdote rule); every book adds its own, so the spelling is perfected with
; each one. A word with a pair the books never proved keeps no rule: it is badly written, and it is read as the word
; that keeps every rule and is the same with its repeats squeezed or one letter apart, the one this reading says the
; most (twice at least). "madre" and "padre" both keep every rule: neither is touched. ORT: by pair {key, words}.

; The pairs of letters of word j2, each judged against the rule (ORF 0: ok_pair) or counted for the book (ORF 1:
; oe_pair), j2 the pair's key. Uses j1-j8, keeps j9-j14.
ort_pairs:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j7, j3, 16
  jld j3, j3, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jst j3, j1, ORP
  jst j3, j1, ORL
  jldi j4, 1
  jsub j7, j7, j4
  jst j7, j1, ORN
  op_lap:
    jldi j1, 0
    jld j7, j1, ORN
    jldi j4, 63
    jsar j4, j7, j4
    jjnz j4, op_done
    jjz j7, op_done
    jld j3, j1, ORP
    jldb j2, j3, 0
    jldb j4, j3, 1
    jldi j5, 8
    jshl j2, j2, j5
    jor j2, j2, j4
    jldi j4, 1
    jadd j2, j2, j4
    jadd j3, j3, j4
    jst j3, j1, ORP
    jsub j7, j7, j4
    jst j7, j1, ORN
    jld j4, j1, ORF
    jjz j4, op_judge
    jcall op_seen               ; (counting: a pair once a word)
    jjnz j4, op_lap
    jld j4, j1, ORF
  op_judge:
    jjnz j4, op_eat
    jcall ok_pair
    jjmp op_lap
  op_eat:
    jldi j5, 1
    jsub j4, j4, j5
    jjnz j4, op_own
    jcall oe_pair
    jjmp op_lap
  op_own:
    jcall ot_pair
    jjmp op_lap
op_done:
  jldi j1, 0
  jret

; j4 = 1 if the pair j2 (its key) stands earlier in the word walked (its letters from ORL to ORP - 1). Uses j3-j8.
op_seen:
  jld j3, j1, ORL
  jld j8, j1, ORP
  jldi j4, 1
  jsub j8, j8, j4
  ops_lap:
    jsub j4, j3, j8
    jjz j4, ops_no
    jldb j5, j3, 0
    jldb j6, j3, 1
    jldi j7, 8
    jshl j5, j5, j7
    jor j5, j5, j6
    jldi j7, 1
    jadd j5, j5, j7
    jsub j5, j5, j2
    jjz j5, ops_yes
    jadd j3, j3, j7
    jjmp ops_lap
ops_no:
  jldi j4, 0
  jret
ops_yes:
  jldi j4, 1
  jret

; The library's spelling summed (every "tablero/ortografia" file: qwords {1, how many}, each {pair's key, words}) into
; ORT. None: ORT stays 0. Uses j1-j14.
ort_load:
  jldi j2, ORT
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jst j1, j1, ORS
  jcall pz_listx
  jldi j1, 0
  jld j10, j1, LSTN
  jldi j2, 63
  jsar j2, j10, j2
  jjnz j2, ol_done
  jld j9, j1, LSTR
  ol_lab:
    jldi j1, 0
    jjz j10, ol_done
    jst j9, j1, ORP
    jst j10, j1, ORN
    jld j2, j9, 0
    jldi j3, 34
    jsub j2, j2, j3
    jjnz j2, ol_next
    jldi j3, 8
    jadd j3, j9, j3
    jldi j4, S_ORT
    jldi j5, 18
    ol_cmp:
      jldb j6, j3, 0
      jldb j7, j4, 0
      jsub j6, j6, j7
      jjnz j6, ol_next
      jldi j6, 1
      jadd j3, j3, j6
      jadd j4, j4, j6
      jsub j5, j5, j6
      jjnz j5, ol_cmp
    jldi j11, 8
    jadd j11, j9, j11
    jld j12, j9, 0
    jcall sx_read
    jldi j1, 0
    jld j2, j1, SXN
    jldi j3, 16
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, ol_next
    jld j9, j1, SXR
    jld j2, j9, 0
    jldi j3, 1
    jsub j2, j2, j3
    jjnz j2, ol_next
    jld j10, j9, 8              ; (as many as the file holds)
    jld j2, j1, SXN
    jldi j3, 4
    jshr j2, j2, j3
    jldi j3, 1
    jsub j2, j2, j3
    jsub j3, j2, j10
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, ol_n
    jadd j10, j2, j1
  ol_n:
    jldi j2, 16
    jadd j9, j9, j2
    ol_pair:
      jldi j1, 0
      jjz j10, ol_next
      jld j5, j9, 0
      jjz j5, ol_pnext
      jst j9, j1, ORA
      jst j10, j1, ORB
      jldi j2, ORT
      jcall pl_take
      jldi j1, 0
      jld j9, j1, ORA
      jld j10, j1, ORB
      jld j2, j4, 8
      jld j3, j9, 8
      jadd j2, j2, j3
      jst j2, j4, 8
      jldi j2, 1
      jst j2, j1, ORS
    ol_pnext:
      jldi j2, 16
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
      jjmp ol_pair
  ol_next:
    jldi j1, 0
    jld j9, j1, ORP
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jld j10, j1, ORN
    jldi j2, 1
    jsub j10, j10, j2
    jjmp ol_lab
ol_done:
  jldi j1, 0
  jret

; The library's labels listed into LSTR (LSTN of them), the room doubling while one more could be cut. Uses j1-j14.
pz_listx:
  jldi j1, 0
  jldi j2, 4096
  jst j2, j1, LSTC
  plx_list:
    jld j11, j1, LSTC
    jcall room
    jldi j1, 0
    jst j13, j1, LSTR
    jldi j10, 14
    jadd j11, j13, j1
    jld j12, j1, LSTC
    jcall ask
    jldi j1, 0
    jst j13, j1, LSTN
    jldi j2, 63
    jsar j2, j13, j2
    jjnz j2, plx_done
    jld j9, j1, LSTR
    jadd j10, j13, j1
    jwhile j10
      jld j2, j9, 0
      jldi j3, 7
      jadd j2, j2, j3
      jldi j3, -8
      jand j2, j2, j3
      jldi j3, 8
      jadd j2, j2, j3
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
    jwend
    jld j3, j1, LSTR
    jsub j9, j9, j3
    jld j3, j1, LSTC
    jsub j3, j3, j9
    jldi j4, 4104
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, plx_done
    jld j2, j1, LSTC
    jadd j2, j2, j2
    jst j2, j1, LSTC
    jjmp plx_list
plx_done:
  jldi j1, 0
  jret

; j2 = 1 if word j2 keeps every rule: each of its pairs proven by two words of the library. Uses j1-j8.
ort_keeps:
  jldi j1, 0
  jldi j3, 1
  jst j3, j1, ORK
  jst j1, j1, ORF
  jcall ort_pairs
  jldi j1, 0
  jld j2, j1, ORK
  jret
ok_pair:
  jldi j3, 1                    ; (a pair with a digit is no pair of letters: numbers keep no spelling)
  jsub j7, j2, j3
  jldi j3, 8
  jshr j3, j7, j3
  jcall ok_digit
  jjnz j4, okp_yes
  jldi j3, 255
  jand j3, j7, j3
  jcall ok_digit
  jjnz j4, okp_yes
  jadd j5, j2, j1
  jldi j2, ORT
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, okp_no
  jld j2, j4, 8
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, okp_yes
okp_no:
  jst j1, j1, ORK
okp_yes:
  jret

; j4 = 1 if byte j3 is a digit. Uses j4-j6.
ok_digit:
  jldi j4, 48
  jsub j5, j3, j4
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, okd_no
  jldi j4, 58
  jsub j5, j3, j4
  jsar j5, j5, j6
  jjz j5, okd_no
  jldi j4, 1
  jret
okd_no:
  jldi j4, 0
  jret

; A pair of a word of the reading itself, added to ORT (the book read is evidence of its own spelling too). Uses j1-j8.
ot_pair:
  jadd j5, j2, j1
  jldi j2, ORT
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
  jret

; Every word of the reading that keeps no rule, read as its well written one (ROOMT and the question's units). Uses
; j1-j14.
ort_fix:
  jldi j1, 0
  jld j2, j1, ORS
  jjz j2, of_done               ; (no spelling in the library: nothing is judged)
  jldi j2, 2                    ; the reading's own words add their pairs: what the book read proves is its spelling too
  jst j2, j1, ORF
  jldi j9, 1
  of_own:
    jldi j1, 0
    jld j2, j1, NV
    jsub j2, j9, j2
    jjz j2, of_owned
    jst j9, j1, ORW
    jadd j2, j9, j1
    jcall w_mark
    jldi j1, 0
    jjnz j3, of_onext
    jld j2, j1, ORW
    jcall ort_pairs
  of_onext:
    jldi j1, 0
    jld j9, j1, ORW
    jldi j2, 1
    jadd j9, j9, j2
    jjmp of_own
of_owned:
  jld j11, j1, NV               ; how many times each word is in the reading
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ORC
  jld j2, j1, NV
  jldi j3, 3
  jshl j2, j2, j3
  jadd j3, j13, j1
  of_z:
    jjz j2, of_zd
    jst j1, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jsub j2, j2, j4
    jjmp of_z
of_zd:
  jld j9, j1, ROOMT
  jld j10, j1, NTOK
  jwhile j10
    jld j2, j9, 0
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ORC
    jadd j3, j3, j4
    jld j4, j3, 0
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j3, 0
    jldi j2, 8
    jadd j9, j9, j2
    jsub j10, j10, j5
  jwend
  jst j1, j1, ORFX
  jldi j9, 1
  of_w:
    jldi j1, 0
    jld j2, j1, NV
    jsub j2, j9, j2
    jjz j2, of_done
    jst j9, j1, ORW
    jadd j2, j9, j1
    jcall w_mark
    jldi j1, 0
    jjnz j3, of_wnext
    jld j2, j1, ORW             ; (said twice or more it is meant: a term, not a slip)
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ORC
    jadd j3, j3, j4
    jld j3, j3, 0
    jldi j4, 2
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, of_wnext
    jld j2, j1, ORW
    jcall ort_keeps
    jjnz j2, of_wnext
    jst j1, j1, ORBEST          ; badly written: its well written one, said the most
    jst j1, j1, ORBN
    jldi j10, 1
    of_c:
      jldi j1, 0
      jld j2, j1, NV
      jsub j2, j10, j2
      jjz j2, of_cdone
      jst j10, j1, ORV
      jldi j3, 3
      jshl j3, j10, j3
      jld j4, j1, ORC
      jadd j3, j3, j4
      jld j3, j3, 0
      jst j3, j1, ORVN
      jldi j4, 2
      jsub j4, j3, j4
      jldi j5, 63
      jsar j4, j4, j5
      jjnz j4, of_cnext
      jld j4, j1, ORBN
      jsub j4, j4, j3
      jsar j4, j4, j5
      jjz j4, of_cnext
      jcall ort_near
      jjz j2, of_cnext
      jld j2, j1, ORV
      jcall ort_keeps
      jjz j2, of_cnext
      jld j2, j1, ORV
      jst j2, j1, ORBEST
      jld j2, j1, ORVN
      jst j2, j1, ORBN
    of_cnext:
      jldi j1, 0
      jld j10, j1, ORV
      jldi j2, 1
      jadd j10, j10, j2
      jjmp of_c
  of_cdone:
    jld j2, j1, ORBEST
    jjz j2, of_wnext
    jld j3, j1, ORW             ; read as it, everywhere
    jld j9, j1, ROOMT
    jld j10, j1, NTOK
    jwhile j10
      jld j4, j9, 0
      jsub j4, j4, j3
      jjnz j4, of_t
      jst j2, j9, 0
    of_t:
      jldi j4, 8
      jadd j9, j9, j4
      jldi j4, 1
      jsub j10, j10, j4
    jwend
    jld j9, j1, QBP
    jld j10, j1, QN
    jwhile j10
      jld j4, j9, 0
      jsub j4, j4, j3
      jjnz j4, of_q
      jst j2, j9, 0
    of_q:
      jldi j4, 8
      jadd j9, j9, j4
      jldi j4, 1
      jsub j10, j10, j4
    jwend
    jld j2, j1, ORFX
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ORFX
  of_wnext:
    jldi j1, 0
    jld j9, j1, ORW
    jldi j2, 1
    jadd j9, j9, j2
    jjmp of_w
of_done:
  jldi j1, 0
  jret

; The letters of word j2 -> j3 where, j4 how many. Uses j1, j3, j4.
ort_lt:
  jldi j1, 0
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j4, j3, 16
  jld j3, j3, 8
  jld j1, j1, ROOMA
  jadd j3, j3, j1
  jldi j1, 0
  jret

; j2 = 1 if word ORW is word ORV with repeats squeezed, or one letter apart. Uses j1-j14 (j9, j10 kept).
ort_near:
  jst j9, j1, ORA
  jst j10, j1, ORB
  jld j2, j1, ORW
  jcall ort_lt
  jadd j11, j3, j1
  jadd j12, j4, j1
  jld j2, j1, ORV
  jcall ort_lt
  jadd j13, j3, j1
  jadd j14, j4, j1
  jldi j5, 0
  jldi j6, 0
  orn_sq:
    jsub j2, j5, j12
    jjz j2, orn_sqend
    jadd j2, j11, j5
    jldb j7, j2, 0
    jsub j2, j6, j14
    jjz j2, orn_sqrep
    jadd j2, j13, j6
    jldb j8, j2, 0
    jsub j2, j7, j8
    jjnz j2, orn_sqrep
    jldi j2, 1
    jadd j5, j5, j2
    jadd j6, j6, j2
    jjmp orn_sq
  orn_sqrep:
    jjz j6, orn_edit
    jldi j2, 1
    jsub j2, j6, j2
    jadd j2, j13, j2
    jldb j8, j2, 0
    jsub j2, j7, j8
    jjnz j2, orn_edit
    jldi j2, 1
    jadd j5, j5, j2
    jjmp orn_sq
  orn_sqend:
    jsub j2, j6, j14
    jjnz j2, orn_edit
    jjmp orn_yes
orn_edit:
  jldi j5, 0
  orn_pre:
    jsub j2, j5, j12
    jjz j2, orn_p
    jsub j2, j5, j14
    jjz j2, orn_p
    jadd j2, j11, j5
    jldb j7, j2, 0
    jadd j2, j13, j5
    jldb j8, j2, 0
    jsub j2, j7, j8
    jjnz j2, orn_p
    jldi j2, 1
    jadd j5, j5, j2
    jjmp orn_pre
  orn_p:
  jldi j6, 0
  orn_try:
    jldi j2, 3
    jsub j2, j6, j2
    jjz j2, orn_no
    jadd j7, j5, j1
    jadd j8, j5, j1
    jldi j2, 1
    jjnz j6, orn_t1
    jadd j7, j7, j2
    jadd j8, j8, j2
    jjmp orn_tail
  orn_t1:
    jldi j3, 1
    jsub j3, j6, j3
    jjnz j3, orn_t2
    jadd j7, j7, j2
    jjmp orn_tail
  orn_t2:
    jadd j8, j8, j2
  orn_tail:
    jsub j2, j12, j7
    jsub j3, j14, j8
    jsub j3, j2, j3
    jjnz j3, orn_tnext
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, orn_tnext
    orn_cmp:
      jjz j2, orn_yes
      jadd j3, j11, j7
      jldb j3, j3, 0
      jadd j4, j13, j8
      jldb j4, j4, 0
      jsub j3, j3, j4
      jjnz j3, orn_tnext
      jldi j3, 1
      jadd j7, j7, j3
      jadd j8, j8, j3
      jsub j2, j2, j3
      jjmp orn_cmp
  orn_tnext:
    jldi j2, 1
    jadd j6, j6, j2
    jjmp orn_try
orn_yes:
  jldi j1, 0
  jld j9, j1, ORA
  jld j10, j1, ORB
  jldi j2, 1
  jret
orn_no:
  jldi j1, 0
  jld j9, j1, ORA
  jld j10, j1, ORB
  jldi j2, 0
  jret

; This book's spelling into the library (eating): for each pair, how many different words have it; "tablero/ortografia"
; and the print of its bytes (salted 11). Qwords {1, how many}, each {pair's key, words}. Uses j1-j14.
ort_eat:
  jldi j1, 0
  jld j2, j1, EATB
  jjz j2, oe_done
  jldi j2, ORE
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jldi j3, 1
  jst j3, j1, ORF
  jldi j9, 1
  oe_w:
    jldi j1, 0
    jld j2, j1, NV
    jsub j2, j9, j2
    jjz j2, oe_write
    jst j9, j1, ORW
    jadd j2, j9, j1
    jcall w_mark
    jldi j1, 0
    jjnz j3, oe_wnext
    jld j2, j1, ORW
    jcall ort_pairs
  oe_wnext:
    jldi j1, 0
    jld j9, j1, ORW
    jldi j2, 1
    jadd j9, j9, j2
    jjmp oe_w
oe_write:
  jld j11, j1, ORE + 16         ; {1, how many}, each {key, words}
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jst j11, j1, QLW
  jcall room
  jldi j1, 0
  jst j13, j1, QLC
  jldi j2, 1
  jst j2, j13, 0
  jld j2, j1, ORE + 16
  jst j2, j13, 8
  jldi j2, 16
  jadd j8, j13, j2
  jld j9, j1, ORE
  jld j10, j1, ORE + 8
  jldi j2, 1
  jadd j10, j10, j2
  oe_lap:
    jjz j10, oe_file
    jld j2, j9, 0
    jjz j2, oe_next
    jst j2, j8, 0
    jld j2, j9, 8
    jst j2, j8, 8
    jldi j2, 16
    jadd j8, j8, j2
  oe_next:
    jld j2, j1, ORE + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp oe_lap
oe_file:
  jldi j11, 64
  jcall room
  jldi j1, 0
  jst j13, j1, ELAB
  jld j5, j1, EATB
  jldi j3, 11
  jxor j5, j5, j3
  jld j3, j1, FNVP
  jmul j5, j5, j3
  jldi j6, S_ORT
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j10, 4
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, oe_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, QLC
  jld j12, j1, QLW
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
oe_done:
  jldi j1, 0
  jret
oe_pair:                        ; (a pair of a word: one more word has it)
  jadd j5, j2, j1
  jldi j2, ORE
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j4, 8
  jret

; A question about a subject as a whole (Capitan, 2026-11-07: "the path of jacob's subjects surely knew much more"):
; when its only furniture (no arrow) is one core, it asks for the subject, not one relation of it. The answer is its
; thread: every fact of it the reading proves (said twice at least, a skeleton with a word in its middle, the core at
; one end), said as one paragraph the organism chooses and chains (q_paragraph). Uses j1-j14.
q_subject:
  jldi j1, 0
  jst j1, j1, QSW               ; its one core (0: none or more than one)
  jld j9, j1, QQS
  qsu_lap:
    jldi j1, 0
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qsu_one
    jst j9, j1, QP
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qsu_next
    jst j2, j1, QSX
    jcall g_core
    jjz j3, qsu_next
    jldi j1, 0
    jld j2, j1, QSX
    jcall is_arrow
    jjnz j2, qsu_next
    jld j2, j1, QSW
    jjnz j2, qsu_done           ; (a second core: it asks a relation, not the subject)
    jld j2, j1, QSX
    jst j2, j1, QSW
  qsu_next:
    jldi j1, 0
    jld j9, j1, QP
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qsu_lap
qsu_one:
  jld j2, j1, QSW
  jjz j2, qsu_done
  jst j2, j1, QCW
  jldi j2, QST                  ; its facts: by (one end, skeleton, other end) {key, times, the fact}
  jldi j3, 24
  jcall pl_new
  jldi j1, 0
  jst j1, j1, QSN
  qsu_fact:
    jldi j1, 0
    jld j2, j1, QSN
    jld j3, j1, GFN
    jsub j3, j2, j3
    jjz j3, qsu_said
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jst j9, j1, QSE
    jld j2, j9, 0
    jcall tok_at
    jst j2, j1, QSX
    jld j9, j1, QSE
    jld j2, j9, 8
    jcall tok_at
    jst j2, j1, QSY
    jld j3, j1, QCW
    jld j4, j1, QSX
    jsub j4, j4, j3
    jjz j4, qsu_end
    jld j4, j1, QSY
    jsub j4, j4, j3
    jjnz j4, qsu_fnext
  qsu_end:
    jld j9, j1, QSE
    jld j5, j9, 16
    jst j5, j1, QSK
    jld j6, j1, FNVP
    jld j2, j1, QSX
    jmul j5, j5, j6
    jxor j5, j5, j2
    jmul j5, j5, j6
    jld j2, j1, QSY
    jxor j5, j5, j2
    jmul j5, j5, j6
    jjnz j5, qsu_k
    jldi j5, 1
  qsu_k:
    jldi j2, QST
    jcall pl_take
    jldi j1, 0
    jld j2, j4, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j1, QSE
    jst j2, j4, 16
  qsu_fnext:
    jldi j1, 0
    jld j2, j1, QSN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QSN
    jjmp qsu_fact
qsu_said:                       ; said as one paragraph, chosen and chained
  jjmp q_paragraph
qsu_done:
  jldi j1, 0
  jret

; The subject's paragraph (Capitan, 2026-11-07: "let it choose with its seed, but chain everything with instructions,
; words, into a rich paragraph instead of loose ideas"). Of the subject's proven facts where it comes first, one for
; each kind of relation (its skeleton: diversity), chosen by its seed's lottery among that kind, each fact voting its
; times. The subject is said once, and each relation follows it, joined by the glue the books put between facts the
; most (GLT: one unit between) and, before the last, by the instruction that joins the most (the dictionary: the one
; whose "_ w _" turns on itself the most). The kinds said the most first. Uses j1-j14.
q_paragraph:
  jldi j1, 0
  jld j2, j1, GEN               ; (its genome and seed, if no thought loaded them yet)
  jjnz j2, qp_seeded
  jcall th_genome
  jcall dia_load
qp_seeded:
  jldi j1, 0
  jld j2, j1, QCW
  jst j2, j1, THX
  jcall th_seed
  jldi j2, QPK                  ; by kind (skeleton) {key, votes, guided by the question's instruction}
  jldi j3, 24
  jcall pl_new
  jldi j1, 0
  jst j1, j1, QPTI              ; (first what is proven)
qpk_again:
  jldi j1, 0
  jld j9, j1, QST               ; the kinds of its proven facts where it comes first
  jld j10, j1, QST + 8
  jldi j2, 1
  jadd j10, j10, j2
  qpk_lap:
    jldi j1, 0
    jjz j10, qpk_done
    jst j9, j1, QPA
    jst j10, j1, QPB
    jcall qp_takes
    jjz j2, qpk_next
    jld j9, j1, QPA
    jld j5, j9, 16
    jld j5, j5, 16
    jldi j2, QPK
    jcall pl_take
    jldi j1, 0
    jld j9, j1, QPA
    jld j2, j4, 8
    jld j3, j9, 8
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j1, QPGU
    jst j2, j4, 16
  qpk_next:
    jldi j1, 0
    jld j9, j1, QPA
    jld j10, j1, QPB
    jld j2, j1, QST + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp qpk_lap
qpk_done:                       ; (Capitan: "fill the space with the main subject's things first": when the proven do
  jld j2, j1, QPTI              ; not fill the clauses, what names the subject said once comes in next)
  jjnz j2, qpk_levels
  jld j3, j1, GFN
  jld j4, j1, NBLD
  jjz j4, qpk_levels
  jadd j3, j3, j4
  jldi j5, 1
  jsub j3, j3, j5
  jdiv j3, j3, j4
  jld j2, j1, QPK + 16
  jsub j2, j2, j3
  jldi j5, 63
  jsar j2, j2, j5
  jjz j2, qpk_levels
  jldi j2, 1
  jst j2, j1, QPTI
  jjmp qpk_again
qpk_levels:
  jldi j2, 2                    ; (the facts of a kind chosen: of either level)
  jst j2, j1, QPTI
  jld j2, j1, QPK + 16          ; the clauses: as many facts as the book puts in a building (its facts by its
  jjz j2, qp_none               ; buildings, rounded up), the kinds at most
  jld j3, j1, GFN
  jld j4, j1, NBLD
  jjz j4, qpn_kinds
  jadd j3, j3, j4
  jldi j5, 1
  jsub j3, j3, j5
  jdiv j3, j3, j4
  jsub j4, j3, j2
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, qpn_kinds
  jadd j2, j3, j1
qpn_kinds:
  jst j2, j1, QPN
  jst j1, j1, QPI
  jcall qp_glues
  jcall sk_scan
  qpc_lap:                      ; each clause: a kind not said yet, by the seed's lottery over their votes
    jldi j1, 0
    jld j2, j1, QPI
    jld j3, j1, QPN
    jsub j2, j2, j3
    jjz j2, qp_end
    jst j1, j1, QPGF            ; (a guided kind left? those first)
    jld j9, j1, QPK
    jld j10, j1, QPK + 8
    jldi j2, 1
    jadd j10, j10, j2
    qpc_g:
      jjz j10, qpc_gd
      jld j2, j9, 0
      jjz j2, qpc_gn
      jld j2, j9, 8
      jldi j3, 63
      jsar j3, j2, j3
      jjnz j3, qpc_gn
      jld j2, j9, 16
      jjz j2, qpc_gn
      jldi j2, 1
      jst j2, j1, QPGF
    qpc_gn:
      jld j2, j1, QPK + 24
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
      jjmp qpc_g
  qpc_gd:
    jldi j11, 0                 ; (the votes left)
    jld j9, j1, QPK
    jld j10, j1, QPK + 8
    jldi j2, 1
    jadd j10, j10, j2
    qpc_sum:
      jjz j10, qpc_summed
      jld j2, j9, 0
      jjz j2, qpc_snext
      jld j2, j9, 8
      jldi j3, 63
      jsar j3, j2, j3
      jjnz j3, qpc_snext
      jld j3, j1, QPGF
      jjz j3, qpc_sadd
      jld j3, j9, 16
      jjz j3, qpc_snext
    qpc_sadd:
      jadd j11, j11, j2
    qpc_snext:
      jld j2, j1, QPK + 24
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
      jjmp qpc_sum
  qpc_summed:
    jjz j11, qp_end
    jst j11, j1, QPV
    jcall th_rand
    jldi j1, 0
    jldi j3, 1
    jshr j2, j2, j3
    jld j3, j1, QPV
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j2, j2, j4
    jldi j12, 0
    jld j9, j1, QPK
    jld j10, j1, QPK + 8
    jldi j3, 1
    jadd j10, j10, j3
    qpc_pick:
      jjz j10, qpc_found
      jld j3, j9, 0
      jjz j3, qpc_pnext
      jld j3, j9, 8
      jldi j4, 63
      jsar j4, j3, j4
      jjnz j4, qpc_pnext
      jld j4, j1, QPGF
      jjz j4, qpc_pany
      jld j4, j9, 16
      jjz j4, qpc_pnext
    qpc_pany:
      jsub j2, j2, j3
      jldi j4, 63
      jsar j4, j2, j4
      jjz j4, qpc_pnext
      jadd j12, j9, j1
      jjmp qpc_found
    qpc_pnext:
      jld j3, j1, QPK + 24
      jadd j9, j9, j3
      jldi j3, 1
      jsub j10, j10, j3
      jjmp qpc_pick
  qpc_found:
    jjz j12, qp_end
    jst j12, j1, QPE
    jld j2, j12, 8
    jst j2, j1, QPV
    jldi j3, 0                  ; (taken)
    jsub j2, j3, j2
    jst j2, j12, 8
    jcall th_rand               ; its fact: the seed's place among the kind's votes
    jldi j1, 0
    jldi j3, 1
    jshr j2, j2, j3
    jld j3, j1, QPV
    jdiv j4, j2, j3
    jmul j4, j4, j3
    jsub j2, j2, j4
    jst j2, j1, QPP
    jld j9, j1, QST
    jld j10, j1, QST + 8
    jldi j2, 1
    jadd j10, j10, j2
    qpf_lap:
      jldi j1, 0
      jjz j10, qpc_lap
      jst j9, j1, QPA
      jst j10, j1, QPB
      jcall qp_takes
      jjz j2, qpf_next
      jld j9, j1, QPA
      jld j2, j9, 16
      jld j2, j2, 16
      jld j3, j1, QPE
      jld j3, j3, 0
      jsub j2, j2, j3
      jjnz j2, qpf_next
      jld j2, j1, QPP
      jld j3, j9, 8
      jsub j2, j2, j3
      jst j2, j1, QPP
      jldi j3, 63
      jsar j2, j2, j3
      jjz j2, qpf_next
      jcall qp_clause           ; chosen: said
      jjmp qpc_lap
    qpf_next:
      jldi j1, 0
      jld j9, j1, QPA
      jld j10, j1, QPB
      jld j2, j1, QST + 24
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
      jjmp qpf_lap
qp_end:
  jldi j2, 10
  jcall putch
  jcall flush
qp_none:
  jldi j1, 0
  jret

; j2 = 1 if the entry of QST at QPA may go in the paragraph: a fact of the subject (at either end) with a word in its
; middle, proven (said twice at least), or guided by the question's instruction (QPGU 1: then said once is enough, as
; for an answer the book says). Uses j1-j14.
qp_takes:
  jldi j1, 0
  jld j9, j1, QPA
  jld j2, j9, 0
  jjz j2, qpt_no
  jld j9, j9, 16
  jld j5, j9, 16
  jldi j2, TMI
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, qpt_no
  jst j4, j1, QPRA
  jadd j12, j4, j1
  jcall sk_word
  jjz j2, qpt_no
  jcall qp_adds                 ; (what the question says already is no answer)
  jjz j2, qpt_no
  jld j12, j1, QPRA             ; guided by the question's instruction?
  jcall qp_guided
  jst j2, j1, QPGU
  jjnz j2, qpt_proven
  jld j9, j1, QPA
  jld j2, j9, 8
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, qpt_once
qpt_proven:                     ; (the first level's: not again in the second's pass)
  jld j2, j1, QPTI
  jldi j3, 1
  jsub j2, j2, j3
  jjz j2, qpt_no
  jjmp qpt_yes
qpt_once:                       ; said once, it names the subject: from the second level on
  jld j2, j1, QPTI
  jjz j2, qpt_no
qpt_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qpt_no:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if the fact of QST's entry at QPA says something the question does not (Capitan, 2026-11-07: "nobody answers
; who is pedro with who is pedro: it is the same question, without its marks"): a word of it (marks aside) that is no
; word of the question. Uses j1-j8.
qp_adds:
  jldi j1, 0
  jld j9, j1, QPA
  jld j9, j9, 16
  jld j2, j9, 0
  jst j2, j1, QPAS
  jld j2, j9, 8
  jst j2, j1, QPAE
  qad_lap:
    jldi j1, 0
    jld j2, j1, QPAS
    jld j3, j1, QPAE
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qad_no             ; (past its end: all of it the question's)
    jcall tok_at
    jjz j2, qad_next
    jst j2, j1, QPAW
    jcall w_mark
    jldi j1, 0
    jjnz j3, qad_next
    jld j8, j1, QQS             ; in the question?
    qad_q:
      jld j2, j1, QQE
      jsub j2, j8, j2
      jjz j2, qad_yes           ; (no: it adds)
      jldi j2, 3
      jshl j2, j8, j2
      jld j3, j1, QBP
      jadd j2, j2, j3
      jld j2, j2, 0
      jld j3, j1, QPAW
      jsub j2, j2, j3
      jjz j2, qad_next
      jldi j2, 1
      jadd j8, j8, j2
      jjmp qad_q
  qad_next:
    jldi j1, 0
    jld j2, j1, QPAS
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QPAS
    jjmp qad_lap
qad_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qad_no:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if the middle of skeleton j12 carries the question's instruction: a word of it is a structure word of the
; question (no arrow, no furniture, no mark). (Letters alone are no guide: "es" is inside "estaba"; nor is the
; dictionary's kin yet: the kin of "es" by context is "estaba", and "estar" says no one who someone is.) Uses j1-j14.
qp_guided:
  jldi j1, 0
  jld j9, j12, 16
  jld j10, j12, 24
  jst j10, j1, QPGN
  jldi j11, 1
  qgd_mid:
    jldi j1, 0
    jld j10, j1, QPGN
    jjz j10, qgd_no
    jldi j2, 1
    jsub j10, j10, j2
    jst j10, j1, QPGN
    jadd j2, j9, j11
    jst j9, j1, QPGA
    jst j11, j1, QPGB
    jcall tok_at
    jst j2, j1, QPGW
    jcall w_mark
    jldi j1, 0
    jjnz j3, qgd_mnext
    jld j8, j1, QQS             ; each structure word of the question
    qgd_q:
      jldi j1, 0
      jld j2, j1, QQE
      jsub j2, j8, j2
      jjz j2, qgd_mnext
      jst j8, j1, QPGQ
      jldi j2, 3
      jshl j2, j8, j2
      jst j3, j1, QBT
      jld j3, j1, QBP
      jadd j2, j2, j3
      jld j2, j2, 0
      jld j3, j1, QBT
      jldi j3, 1
      jsub j3, j2, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, qgd_qnext
      jst j2, j1, QPGX
      jcall w_mark
      jjnz j3, qgd_qnext
      jld j2, j1, QPGX
      jcall g_core
      jjnz j3, qgd_qnext
      jld j2, j1, QPGX
      jcall is_arrow
      jjnz j2, qgd_qnext
      jldi j1, 0
      jld j2, j1, QPGX
      jld j3, j1, QPGW
      jsub j4, j2, j3
      jjz j4, qgd_yes
    qgd_qnext:
      jldi j1, 0
      jld j8, j1, QPGQ
      jldi j2, 1
      jadd j8, j8, j2
      jjmp qgd_q
  qgd_mnext:
    jldi j1, 0
    jld j9, j1, QPGA
    jld j11, j1, QPGB
    jldi j2, 1
    jadd j11, j11, j2
    jjmp qgd_mid
qgd_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qgd_no:
  jldi j1, 0
  jldi j2, 0
  jret

; The fact of QST's entry at QPA said as the next clause: the first with its subject, the next ones after the glue,
; the last after the instruction that joins. Uses j1-j14.
qp_clause:
  jldi j1, 0                    ; (what it already said, it does not say again)
  jld j9, j1, QPA
  jld j9, j9, 16
  jld j2, j9, 8
  jcall tok_at
  jadd j5, j2, j1
  jldi j2, TSN
  jcall pl_take
  jldi j1, 0
  jjnz j6, qpcl_fresh
  jret
qpcl_fresh:
  jldi j1, 0                    ; (nor what a span already said)
  jld j9, j1, QPA
  jld j9, j9, 16
  jst j9, j1, SKF
  jld j2, j9, 0
  jcall tok_at
  jst j2, j1, SK3
  jld j9, j1, SKF
  jld j2, j9, 8
  jcall tok_at
  jst j2, j1, SK4
  jld j9, j1, SKF
  jld j2, j9, 16
  jld j3, j1, SK3
  jcall sk_hash
  jadd j2, j5, j1
  jld j3, j1, SK4
  jcall sk_hash
  jldi j2, SKD
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, qpcl_new
  jret
qpcl_new:
  jld j2, j1, QPI
  jjnz j2, qpcl_glue
  jldi j1, S_ANS
  jcall puts
  jldi j1, 0
  jld j9, j1, QPA               ; its first word: the subject, or the one before it when it comes last
  jld j9, j9, 16
  jld j2, j9, 0
  jcall tok_at
  jcall putword
  jldi j1, 0
  jldi j2, 32
  jcall putch
  jjmp qpcl_body
qpcl_glue:
  jld j2, j1, QPI               ; the last one: the joiner that turns the most; the rest: the next one
  jld j3, j1, QPN
  jldi j4, 1
  jsub j3, j3, j4
  jsub j3, j2, j3
  jld j2, j1, QPJ
  jjz j3, qpcl_put
  jld j2, j1, QPG
qpcl_put:
  jjz j2, qpcl_mid
  jst j2, j1, QPB
  jcall w_mark                  ; a mark goes against the word before; a word, after a space
  jldi j1, 0
  jjnz j3, qpcl_mark
  jldi j2, 32
  jcall putch
qpcl_mark:
  jldi j1, 0
  jld j2, j1, QPB
  jcall putword
  jldi j2, 32
  jcall putch
  jjmp qpcl_mid2
qpcl_mid:
  jldi j1, 0
  jldi j2, 32
  jcall putch
qpcl_mid2:
  jldi j1, 0
  jld j9, j1, QPA               ; (a fact the subject ends: its first word first)
  jld j9, j9, 16
  jld j2, j9, 0
  jcall tok_at
  jld j3, j1, QCW
  jsub j3, j2, j3
  jjz j3, qpcl_body
  jcall putword
  jldi j1, 0
  jldi j2, 32
  jcall putch
qpcl_body:
  jldi j1, 0                    ; its fact, the way its seed chooses
  jld j9, j1, QPA
  jld j9, j9, 16
  jst j9, j1, SKF
  jldi j2, 1
  jst j2, j1, SKH
  jcall sk_say
  jcall qp_rest                 ; and what it says there, to the end of its building
  jldi j1, 0
  jld j2, j1, QPI
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QPI
  jld j2, j1, QNA
  jadd j2, j2, j3
  jst j2, j1, QNA
  jjmp flush

; The rest of the clause of QST's fact at QPA (Capitan: "what did he answer? what thing?"): the units after it to the
; end of its building, the limit that closes it; and when that limit is the one an arrow of the building closes with
; ("respondió" with ":", as "qué" with "?"), what the arrow announces: the next building, to its limit. Uses j1-j14.
qp_rest:
  jldi j1, 0
  jld j9, j1, QPA
  jld j9, j9, 16
  jld j2, j9, 0
  jst j2, j1, QPRS              ; (where the fact starts: the arrows of its building are looked for from there)
  jld j2, j9, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QPRP
  jcall qr_span                 ; to its limit, each fact in its building said in Razar's own way
  jldi j1, 0
  jld j2, j1, QPRL
  jjz j2, qr_done
  jcall qr_arrow                ; an arrow's limit: what it announces
  jjz j2, qr_done
  jldi j1, 0
  jld j2, j1, QPRL
  jcall put_glue
  qr_skip:                      ; (the next building that says something: limits in a row are skipped, said)
    jldi j1, 0
    jld j2, j1, QPRP
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QPRP
    jld j3, j1, NTOK
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, qr_done
    jcall tok_at
    jjz j2, qr_skip
    jst j2, j1, QPRW
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, qr_said
    jld j2, j1, QPRW
    jcall put_glue
    jjmp qr_skip
  qr_said:
  jldi j1, 0                    ; (what it announces starts fresh: its first word said)
  jld j2, j1, QPRP
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, SKE
  jcall qr_span
qr_done:
  jldi j1, 0                    ; (the line ends on a word: the next glue brings its own space)
  jld j2, j1, POS
  jjz j2, qr_out
  jldi j3, 1
  jsub j3, j2, j3
  jldb j4, j3, TEXT
  jldi j5, 32
  jsub j4, j4, j5
  jjnz j4, qr_out
  jst j3, j1, POS
qr_out:
  jldi j1, 0
  jret

; From place QPRP to the limit of its building (qr_walk in silence), the facts there said in Razar's own way, from
; where the last one ended (SKE). Uses j1-j14.
qr_span:
  jldi j1, 0
  jld j2, j1, SKE
  jst j2, j1, SKFR
  jldi j2, 1
  jst j2, j1, SKQ
  jcall qr_walk
  jldi j1, 0
  jst j1, j1, SKQ
  jld j2, j1, QPRP
  jst j2, j1, SKT
  jcall sk_span
  jldi j1, 0
  jret

; From place QPRP, every unit said (a mark against the word before) until a limit (SKQ 1: in silence): QPRL that limit (0: the end of
; the reading), QPRP its place. A renglon's end is no limit. Uses j1-j14.
qr_walk:
  jldi j1, 0
  jst j1, j1, QPRL
  qrw_lap:
    jldi j1, 0
    jld j2, j1, QPRP
    jld j3, j1, NTOK
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, qrw_done
    jcall tok_at
    jjz j2, qrw_next
    jst j2, j1, QPRW
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, qrw_say
    jld j2, j1, QPRW
    jst j2, j1, QPRL
    jjmp qrw_done
  qrw_say:
    jld j2, j1, SKQ
    jjnz j2, qrw_next
    jld j2, j1, QPRW
    jcall put_glue
  qrw_next:
    jldi j1, 0
    jld j2, j1, QPRP
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QPRP
    jjmp qrw_lap
qrw_done:
  jldi j1, 0
  jret

; j2 = 1 if an arrow stands from QPRS to the limit at QPRP whose voted limit is that limit (QPRL). Uses j1-j8.
qr_arrow:
  jldi j1, 0
  jld j9, j1, QPRS
  qra_lap:
    jldi j1, 0
    jld j2, j1, QPRP
    jsub j2, j9, j2
    jjz j2, qra_no
    jst j9, j1, QPRW
    jadd j2, j9, j1
    jcall tok_at
    jjz j2, qra_next
    jst j2, j1, QPRA
    jcall is_arrow
    jjz j2, qra_next
    jldi j1, 0
    jld j2, j1, QPRA
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMAR
    jjz j4, qra_next
    jadd j3, j3, j4
    jld j3, j3, 8
    jld j4, j1, QPRL
    jsub j3, j3, j4
    jjnz j3, qra_next
    jldi j2, 1
    jret
  qra_next:
    jldi j1, 0
    jld j9, j1, QPRW
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qra_lap
qra_no:
  jldi j1, 0
  jldi j2, 0
  jret

; Equivalent structures (Capitan, 2026-11-07: "no copy and paste of pieces of sentences: let Razar process the sentence
; and give an equivalent, or tell whether it goes or not, or add or take something; one that it thought; it may even
; vary the way of saying it from the original, and there is the grace"). Two skeletons are kin by the share of the
; pairs of furniture they join in common (shared over what either joins), as the instructions' families are by their
; contexts: "_ le dijo a _" and "_ le respondió a _" join the same people. Counted from the reading's facts (GFL): SKN
; by skeleton {key, its pairs}, SKP by two of them {key, a, b, shared}; a pair once per skeleton (SKC), by pair the
; list of its skeletons (SKG, SKL). Uses j1-j14.
sk_scan:
  jldi j2, SKC
  jldi j3, 8
  jcall pl_new
  jldi j2, SKG
  jldi j3, 16
  jcall pl_new
  jldi j2, SKD
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jld j11, j1, GFN              ; the lists {skeleton, next}, one a fact at most
  jldi j2, 4
  jshl j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, SKL
  jldi j2, 1
  jst j2, j1, SKLN
  jst j1, j1, SKU
  sks_lap:
    jldi j1, 0
    jld j2, j1, SKU
    jld j3, j1, GFN
    jsub j3, j2, j3
    jjz j3, sks_pairs
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jst j9, j1, SKF
    jld j2, j9, 16
    jst j2, j1, SKS
    jld j2, j9, 0
    jcall tok_at
    jst j2, j1, SK3
    jld j9, j1, SKF
    jld j2, j9, 8
    jcall tok_at
    jst j2, j1, SK4
    jld j2, j1, SKS               ; (skeleton, its ends) once
    jld j3, j1, SK3
    jcall sk_hash
    jadd j2, j5, j1
    jld j3, j1, SK4
    jcall sk_hash
    jldi j2, SKC
    jcall pl_take
    jldi j1, 0
    jjz j6, sks_next
    jld j5, j1, SKS               ; its pairs, one more
    jldi j2, SKN
    jcall pl_take
    jldi j1, 0
    jld j2, j4, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j1, SK3               ; and into its pair's list
    jld j3, j1, SK4
    jcall sk_hash
    jldi j2, SKG
    jcall pl_take
    jldi j1, 0
    jld j2, j1, SKLN
    jldi j3, 4
    jshl j3, j2, j3
    jld j5, j1, SKL
    jadd j3, j3, j5
    jld j5, j1, SKS
    jst j5, j3, 0
    jld j5, j4, 8
    jst j5, j3, 8
    jst j2, j4, 8
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SKLN
  sks_next:
    jldi j1, 0
    jld j2, j1, SKU
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SKU
    jjmp sks_lap
sks_pairs:                      ; each pair: every two skeletons of its list share it
  jld j9, j1, SKG
  jld j10, j1, SKG + 8
  jldi j2, 1
  jadd j10, j10, j2
  skp_lap:
    jldi j1, 0
    jjz j10, skp_done
    jld j2, j9, 0
    jjz j2, skp_next
    jst j9, j1, SK5
    jst j10, j1, SK6
    jld j7, j9, 8
    skp_a:
      jldi j1, 0
      jjz j7, skp_back
      jst j7, j1, SK7
      jldi j3, 4
      jshl j3, j7, j3
      jld j4, j1, SKL
      jadd j3, j3, j4
      jld j2, j3, 0
      jst j2, j1, SK2
      jld j8, j3, 8
      skp_b:
        jldi j1, 0
        jjz j8, skp_anext
        jst j8, j1, SK8
        jldi j3, 4
        jshl j3, j8, j3
        jld j4, j1, SKL
        jadd j3, j3, j4
        jld j3, j3, 0
        jld j2, j1, SK2
        jcall sk_share
        jldi j1, 0
        jld j8, j1, SK8
        jldi j3, 4
        jshl j3, j8, j3
        jld j4, j1, SKL
        jadd j3, j3, j4
        jld j8, j3, 8
        jjmp skp_b
    skp_anext:
      jldi j1, 0
      jld j7, j1, SK7
      jldi j3, 4
      jshl j3, j7, j3
      jld j4, j1, SKL
      jadd j3, j3, j4
      jld j7, j3, 8
      jjmp skp_a
  skp_back:
    jldi j1, 0
    jld j9, j1, SK5
    jld j10, j1, SK6
  skp_next:
    jld j2, j1, SKG + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp skp_lap
skp_done:
  jldi j1, 0
  jret

; Skeletons j2 and j3 join one more pair in common (or j4 more: sk_sharen). Uses j1-j8.
sk_share:
  jldi j4, 1
sk_sharen:
  jldi j1, 0
  jst j4, j1, SKCC
  jsub j5, j2, j3               ; (the smaller first)
  jjz j5, skh_done
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, skh_ord
  jadd j5, j2, j1
  jadd j2, j3, j1
  jadd j3, j5, j1
skh_ord:
  jst j2, j1, SK9
  jst j3, j1, SKO
  jcall sk_hash
  jldi j2, SKP
  jcall pl_take
  jldi j1, 0
  jld j2, j1, SK9
  jst j2, j4, 8
  jld j2, j1, SKO
  jst j2, j4, 16
  jld j2, j4, 24
  jld j3, j1, SKCC
  jadd j2, j2, j3
  jst j2, j4, 24
skh_done:
  jldi j1, 0
  jret

; j2 folded with j3 -> j5 (never 0, a key). Uses j1, j5, j6.
sk_hash:
  jldi j1, 0
  jld j6, j1, FNVP
  jmul j5, j2, j6
  jxor j5, j5, j3
  jmul j5, j5, j6
  jjnz j5, skx_done
  jldi j5, 1
skx_done:
  jret

; The way skeleton SKS is said, chosen (-> SKS): itself or one of its kin, by the seed's lottery over their shares
; (itself a whole, 1000; a kin the share of their pairs in common, when they share two at least: the anecdote rule).
; Uses j1-j14.
sk_pick:
  jldi j1, 0
  jld j5, j1, SKS
  jldi j2, SKN
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 8
  jst j2, j1, SKNS
  jldi j2, 1000
  jst j2, j1, SKW
  jst j1, j1, SKM               ; (0: the shares summed; 1: the one chosen)
skk_pass:
  jldi j1, 0
  jld j9, j1, SKP
  jld j10, j1, SKP + 8
  jldi j2, 1
  jadd j10, j10, j2
  skk_lap:
    jldi j1, 0
    jjz j10, skk_end
    jld j2, j9, 0
    jjz j2, skk_next
    jld j2, j9, 24
    jldi j3, 2
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, skk_next
    jld j4, j1, SKS
    jld j3, j9, 8
    jsub j5, j3, j4
    jjz j5, skk_b
    jld j3, j9, 16
    jsub j5, j3, j4
    jjz j5, skk_a
    jjmp skk_next
  skk_b:
    jld j3, j9, 16
    jjmp skk_have
  skk_a:
    jld j3, j9, 8
  skk_have:
    jst j3, j1, SKO
    jst j9, j1, SK5
    jst j10, j1, SK6
    jadd j5, j3, j1
    jldi j2, SKN
    jcall pl_find
    jldi j1, 0
    jld j3, j4, 8
    jld j2, j1, SKNS
    jadd j3, j3, j2
    jld j9, j1, SK5
    jld j10, j1, SK6
    jld j2, j9, 24
    jsub j3, j3, j2
    jjz j3, skk_next
    jldi j4, 1000
    jmul j2, j2, j4
    jdiv j2, j2, j3
    jld j3, j1, SKM
    jjnz j3, skk_take
    jld j3, j1, SKW
    jadd j3, j3, j2
    jst j3, j1, SKW
    jjmp skk_next
  skk_take:
    jld j3, j1, SKR
    jsub j3, j3, j2
    jst j3, j1, SKR
    jldi j4, 63
    jsar j4, j3, j4
    jjz j4, skk_next
    jld j2, j1, SKO
    jst j2, j1, SKS
    jldi j1, 0
    jret
  skk_next:
    jld j2, j1, SKP + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp skk_lap
skk_end:
  jld j2, j1, SKM
  jjnz j2, skk_out
  jcall th_rand
  jldi j1, 0
  jldi j3, 1
  jshr j2, j2, j3
  jld j3, j1, SKW
  jdiv j4, j2, j3
  jmul j4, j4, j3
  jsub j2, j2, j4
  jldi j3, 1000                 ; itself, or the kin its place falls on
  jsub j3, j2, j3
  jldi j4, 63
  jsar j4, j3, j4
  jjnz j4, skk_out
  jst j3, j1, SKR
  jldi j2, 1
  jst j2, j1, SKM
  jjmp skk_pass
skk_out:
  jldi j1, 0
  jret

; The fact at SKF said in Razar's own way (j2 = 1), or not said when it was already (j2 = 0): what it says once it
; does not say twice. Its first word unless it is said already (SKH 1), it is where the last fact ended (they chain)
; or it is the subject again (it goes tacit); a short gap from the last (three units at most) with its own glue, a
; longer one with the joiner; then the way of its skeleton the seed chooses, and its last word. SKE where it ends.
; Uses j1-j14.
sk_say:
  jldi j1, 0
  jld j9, j1, SKF
  jld j2, j9, 0
  jcall tok_at
  jst j2, j1, SK3
  jld j9, j1, SKF
  jld j2, j9, 8
  jcall tok_at
  jst j2, j1, SK4
  jld j9, j1, SKF
  jld j2, j9, 16
  jst j2, j1, SKS
  jld j3, j1, SK3
  jcall sk_hash
  jadd j2, j5, j1
  jld j3, j1, SK4
  jcall sk_hash
  jldi j2, SKD
  jcall pl_take
  jldi j1, 0
  jjnz j6, sky_new
  jldi j2, 0
  jret
sky_new:
  jld j2, j1, SKH
  jjnz j2, sky_mid
  jld j9, j1, SKF
  jld j2, j9, 0
  jld j3, j1, SKE
  jsub j4, j2, j3
  jjz j4, sky_mid               ; chained
  jldi j5, 1
  jsub j4, j4, j5               ; the units between
  jjz j4, sky_word
  jldi j5, 4
  jsub j5, j4, j5
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, sky_join
  jadd j3, j3, j1
  jldi j5, 1
  jadd j3, j3, j5
  jst j3, j1, SKU
  sky_gap:
    jldi j1, 0
    jld j2, j1, SKU
    jld j9, j1, SKF
    jld j3, j9, 0
    jsub j3, j2, j3
    jjz j3, sky_word
    jcall tok_at
    jjz j2, sky_gnext
    jcall put_glue
  sky_gnext:
    jldi j1, 0
    jld j2, j1, SKU
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SKU
    jjmp sky_gap
sky_join:
  jld j2, j1, QPG
  jjz j2, sky_word
  jcall put_glue
sky_word:
  jldi j1, 0
  jld j2, j1, SK3
  jld j3, j1, QCW
  jsub j3, j2, j3
  jjz j3, sky_mid               ; the subject again: tacit
  jcall put_glue
sky_mid:
  jcall sk_pick
  jldi j1, 0
  jld j5, j1, SKS
  jldi j2, TMI
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, sky_lib
  jadd j12, j4, j1
  jcall put_plain
  jjmp sky_end
sky_lib:                        ; (a way the reading never saw: by the letters a book kept)
  jld j5, j1, SKS
  jldi j2, SKN
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 16
  jcall sk_lit
sky_end:
  jldi j1, 0
  jld j2, j1, SK4
  jcall put_glue
  jldi j1, 0
  jld j9, j1, SKF
  jld j2, j9, 8
  jst j2, j1, SKE
  jldi j2, 1
  jret

; Of the facts that start at SKFR or after and end before SKT, in the book's order, each said in Razar's own way
; (sk_say): the first (the shortest of those that start first), and on from where it ended; one it had said already
; is left, and the next is looked for past where it starts. Uses j1-j14.
sk_span:
  jldi j1, 0
  jst j1, j1, SKBF
  jst j1, j1, SKU
  skn_scan:
    jldi j1, 0
    jld j2, j1, SKU
    jld j3, j1, GFN
    jsub j3, j2, j3
    jjz j3, skn_have
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, GFL
    jadd j9, j3, j4
    jld j2, j9, 0
    jld j3, j1, SKT
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, skn_have            ; (in order: the rest start at the limit or after)
    jld j3, j1, SKFR
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, skn_next
    jld j2, j9, 8
    jld j3, j1, SKT
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, skn_next
    jld j8, j1, SKBF
    jjz j8, skn_take
    jld j2, j9, 0
    jld j3, j8, 0
    jsub j4, j2, j3
    jjnz j4, skn_next           ; (a later start: the first is kept)
    jld j2, j9, 8
    jld j3, j8, 8
    jsub j4, j2, j3
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, skn_next
  skn_take:
    jst j9, j1, SKBF
  skn_next:
    jldi j1, 0
    jld j2, j1, SKU
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SKU
    jjmp skn_scan
skn_have:
  jld j2, j1, SKBF
  jjz j2, skn_done
  jst j2, j1, SKF
  jst j1, j1, SKH
  jcall sk_say
  jldi j1, 0
  jjz j2, skn_left
  jld j2, j1, SKE
  jst j2, j1, SKFR
  jjmp sk_span
skn_left:
  jld j9, j1, SKF
  jld j2, j9, 0
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, SKFR
  jjmp sk_span
skn_done:
  jret

; The tables of equivalent structures, empty (before the library fills them): SKN by skeleton {key, its pairs, its
; record in the library (0: the reading's own), needed}, SKP by two {key, a, b, shared}. Uses j1-j14.
sk_init:
  jldi j2, SKN
  jldi j3, 32
  jcall pl_new
  jldi j2, SKP
  jldi j3, 32
  jjmp pl_new

; The structures this book proved, into its dictionary (Capitan, 2026-11-07: "the dictionary grows: each variation is
; an instruction that does the same, with a subtlety: one may be the if and another the improved if"; "words have a
; limit I am willing to take, because each word is a valuable instruction"). A structure ("le respondió a") is an
; instruction of several words: what it does is the pairs of furniture it joins. Each structure of two that share two
; pairs or more (the anecdote rule), by its pieces' letters, with how many pairs it joins; then those two with how many
; they share. What they share is what they do alike; what each joins alone is its subtlety. Counted with their bytes
; (QLS 0: QLW) or written at QLP (QLS 1): {how many structures, how many pairs}, each structure {its pairs, how many
; pieces, each piece {its bytes, its letters padded}}, each pair {shared, the first, the other} by their order. Uses
; j1-j14.
sk_sect:
  jldi j1, 0
  jld j2, j1, QLS
  jjnz j2, sks2_write
  jst j1, j1, SK9
  jld j9, j1, SKP               ; the structures needed: those of a pair kept
  jld j10, j1, SKP + 8
  jldi j2, 1
  jadd j10, j10, j2
  sks2_mark:
    jldi j1, 0
    jjz j10, sks2_marked
    jld j2, j9, 0
    jjz j2, sks2_mnext
    jld j2, j9, 24
    jldi j3, 2
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, sks2_mnext
    jst j9, j1, SK5
    jst j10, j1, SK6
    jld j5, j9, 8
    jldi j2, SKN
    jcall pl_find
    jldi j1, 0
    jldi j2, 1
    jst j2, j4, 24
    jld j9, j1, SK5
    jld j5, j9, 16
    jldi j2, SKN
    jcall pl_find
    jldi j1, 0
    jldi j2, 1
    jst j2, j4, 24
    jld j2, j1, SK9
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SK9
    jld j9, j1, SK5
    jld j10, j1, SK6
  sks2_mnext:
    jld j2, j1, SKP + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp sks2_mark
sks2_marked:
  jst j1, j1, SKW               ; numbered, and their bytes
  jst j1, j1, SKM
  jst j1, j1, SKO
  jcall ske_walk
  jldi j1, 0
  jld j2, j1, SK9
  jldi j3, 24
  jmul j2, j2, j3
  jld j3, j1, SKW
  jadd j2, j2, j3
  jldi j3, 16
  jadd j2, j2, j3
  jld j3, j1, QLW
  jadd j2, j2, j3
  jst j2, j1, QLW
  jret
sks2_write:
  jld j3, j1, QLP
  jld j2, j1, SKO
  jst j2, j3, 0
  jld j2, j1, SK9
  jst j2, j3, 8
  jldi j2, 16
  jadd j2, j3, j2
  jst j2, j1, SKU
  jldi j2, 1
  jst j2, j1, SKM
  jcall ske_walk                ; the structures written
  jldi j1, 0
  jld j9, j1, SKP               ; and the pairs
  jld j10, j1, SKP + 8
  jldi j2, 1
  jadd j10, j10, j2
  sks2_pair:
    jldi j1, 0
    jjz j10, sks2_done
    jld j2, j9, 0
    jjz j2, sks2_pnext
    jld j2, j9, 24
    jldi j3, 2
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, sks2_pnext
    jst j9, j1, SK5
    jst j10, j1, SK6
    jld j3, j1, SKU
    jst j2, j3, 0
    jld j5, j9, 8
    jldi j2, SKN
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 16
    jldi j3, 1
    jsub j2, j2, j3
    jld j3, j1, SKU
    jst j2, j3, 8
    jld j9, j1, SK5
    jld j5, j9, 16
    jldi j2, SKN
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 16
    jldi j3, 1
    jsub j2, j2, j3
    jld j3, j1, SKU
    jst j2, j3, 16
    jldi j2, 24
    jadd j3, j3, j2
    jst j3, j1, SKU
    jld j9, j1, SK5
    jld j10, j1, SK6
  sks2_pnext:
    jld j2, j1, SKP + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp sks2_pair
sks2_done:
  jld j2, j1, SKU
  jst j2, j1, QLP
  jret

; The structures of the dictionary with their kin (the reading's report), the closest first: each two by the share of
; their pairs in common, with what they do alike (the pairs they share) and each one's subtlety (the pairs it joins
; alone: the one that joins more alone is the wider, as an if improved is to an if). Twelve: criterion, the report's
; size, as the instructions'. Uses j1-j14.
sk_kinrep:
  jldi j1, 0
  jld j2, j1, SKP + 16
  jjz j2, skr_done
  jldi j1, S_SKH
  jcall puts
  jldi j1, 0
  jldi j2, 1001
  jst j2, j1, SKRP
  jst j1, j1, SKRQ
  jst j1, j1, SKRN
  skr_round:
    jldi j1, 0
    jld j2, j1, SKRN
    jldi j3, 12
    jsub j3, j2, j3
    jjz j3, skr_out
    jst j1, j1, SKRE
    jldi j2, -1
    jst j2, j1, SKRS
    jld j9, j1, SKP
    jld j10, j1, SKP + 8
    jldi j2, 1
    jadd j10, j10, j2
    skr_lap:
      jldi j1, 0
      jjz j10, skr_have
      jld j2, j9, 0
      jjz j2, skr_next
      jld j2, j9, 24
      jldi j3, 2
      jsub j3, j2, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, skr_next
      jcall skr_share
      jldi j1, 0
      jld j3, j1, SKRP            ; below the last said (by share, then by key)
      jsub j4, j2, j3
      jjz j4, skr_tie
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, skr_next
      jjmp skr_cand
    skr_tie:
      jst j2, j1, SKX4
      jld j2, j9, 0
      jld j3, j1, SKRQ
      jcall sk_lt
      jld j2, j1, SKX4
      jjz j4, skr_next
    skr_cand:
      jld j3, j1, SKRS            ; the most of those
      jsub j4, j2, j3
      jjz j4, skr_ctie
      jldi j5, 63
      jsar j4, j4, j5
      jjnz j4, skr_next
      jjmp skr_best
    skr_ctie:
      jst j2, j1, SKX4
      jld j2, j1, SKRK
      jld j3, j9, 0
      jcall sk_lt
      jld j2, j1, SKX4
      jjz j4, skr_next
    skr_best:
      jst j2, j1, SKRS
      jld j3, j9, 0
      jst j3, j1, SKRK
      jst j9, j1, SKRE
    skr_next:
      jld j2, j1, SKP + 24
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
      jjmp skr_lap
  skr_have:
    jld j9, j1, SKRE
    jjz j9, skr_out
    jld j2, j1, SKRS
    jst j2, j1, SKRP
    jld j2, j1, SKRK
    jst j2, j1, SKRQ
    jcall skr_share
    jldi j2, 10
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j9, j1, SKRE
    jld j5, j9, 8
    jcall sk_put
    jldi j2, 126
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j9, j1, SKRE
    jld j5, j9, 16
    jcall sk_put
    jldi j1, S_SKI
    jcall puts
    jld j9, j1, SKRE
    jld j2, j9, 24
    jcall putnum
    jldi j1, S_SKJ
    jcall puts
    jld j9, j1, SKRE
    jld j2, j1, SKX1
    jld j3, j9, 24
    jsub j2, j2, j3
    jcall putnum
    jldi j1, S_SKK
    jcall puts
    jld j9, j1, SKRE
    jld j2, j1, SKX2
    jld j3, j9, 24
    jsub j2, j2, j3
    jcall putnum
    jldi j2, 41
    jcall putch
    jldi j1, 0
    jld j2, j1, SKRN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SKRN
    jjmp skr_round
skr_out:
  jldi j2, 10
  jcall putch
  jcall flush
skr_done:
  jldi j1, 0
  jret

; j4 = 1 if j2 < j3 as unsigned numbers (keys: the difference of two can pass 64 bits, so by halves). Uses j4-j6.
sk_lt:
  jldi j4, 1
  jshr j5, j2, j4
  jshr j6, j3, j4
  jsub j5, j5, j6
  jjnz j5, sklt_sign
  jand j5, j2, j4
  jand j6, j3, j4
  jsub j5, j5, j6
sklt_sign:
  jldi j6, 63
  jsar j5, j5, j6
  jldi j4, 0
  jsub j4, j4, j5
  jret

; The share of the two structures of SKP's entry j9 -> j2 (1000 a whole), SKX1 and SKX2 the pairs each joins. Uses
; j1-j8 (j9, j10 kept).
skr_share:
  jldi j1, 0
  jst j9, j1, SKX0
  jld j5, j9, 8
  jldi j2, SKN
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 8
  jst j2, j1, SKX1
  jld j9, j1, SKX0
  jld j5, j9, 16
  jldi j2, SKN
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 8
  jst j2, j1, SKX2
  jld j9, j1, SKX0
  jld j3, j1, SKX1
  jld j4, j1, SKX2
  jadd j3, j3, j4
  jld j2, j9, 24
  jsub j3, j3, j2
  jldi j4, 1000
  jmul j2, j2, j4
  jjz j3, skrs_zero
  jdiv j2, j2, j3
  jret
skrs_zero:
  jldi j2, 0
  jret

; Structure j5 said: the reading's own way when it has it, else by the letters a book kept. Uses j1-j14.
sk_put:
  jldi j1, 0
  jst j5, j1, SKX3
  jldi j2, TMI
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, skpt_lib
  jadd j12, j4, j1
  jjmp put_plain
skpt_lib:
  jld j5, j1, SKX3
  jldi j2, SKN
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 16
  jjmp sk_lit

; Every skeleton needed (SKN + 24): numbered (SKO, at + 16 its number plus one) and its bytes counted (SKM 0: SKW), or
; written at SKU (SKM 1). Uses j1-j14.
ske_walk:
  jldi j1, 0
  jld j9, j1, SKN
  jld j10, j1, SKN + 8
  jldi j2, 1
  jadd j10, j10, j2
  skw2_lap:
    jldi j1, 0
    jjz j10, skw2_done
    jld j2, j9, 0
    jjz j2, skw2_next
    jld j2, j9, 24
    jjz j2, skw2_next
    jst j9, j1, SK5
    jst j10, j1, SK6
    jld j2, j9, 0
    jcall find_mid
    jldi j1, 0
    jld j2, j12, 0
    jjz j2, skw2_back
    jldi j13, EBUF
    jcall m_collect
    jldi j1, 0
    jst j2, j1, SK2
    jld j3, j1, SKM
    jjnz j3, skw2_head
    jld j9, j1, SK5             ; numbered
    jld j3, j1, SKO
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, SKO
    jst j3, j9, 16
    jld j3, j1, SKW
    jldi j4, 16
    jadd j3, j3, j4
    jst j3, j1, SKW
    jjmp skw2_pieces
  skw2_head:
    jld j4, j1, SKU             ; {its pairs, its pieces}
    jld j9, j1, SK5
    jld j3, j9, 8
    jst j3, j4, 0
    jst j2, j4, 8
    jldi j3, 16
    jadd j4, j4, j3
    jst j4, j1, SKU
  skw2_pieces:
    jst j1, j1, SK3
    skw2_piece:
      jldi j1, 0
      jld j2, j1, SK3
      jld j3, j1, SK2
      jsub j3, j2, j3
      jjz j3, skw2_back
      jldi j3, 3
      jshl j3, j2, j3
      jld j2, j3, EBUF
      jldi j3, 3
      jshl j3, j2, j3
      jld j4, j1, ROOMI
      jadd j3, j3, j4
      jld j3, j3, 0
      jld j5, j3, 16            ; its bytes, its letters
      jld j6, j3, 8
      jld j4, j1, ROOMA
      jadd j6, j6, j4
      jldi j7, 7
      jadd j8, j5, j7
      jldi j7, -8
      jand j8, j8, j7
      jldi j7, 8
      jadd j8, j8, j7
      jld j3, j1, SKM
      jjnz j3, skw2_put
      jld j3, j1, SKW
      jadd j3, j3, j8
      jst j3, j1, SKW
      jjmp skw2_pnext
    skw2_put:
      jld j4, j1, SKU
      jst j5, j4, 0
      jadd j3, j4, j8
      jst j3, j1, SKU
      jldi j3, 8
      jadd j4, j4, j3
      jldi j3, 1
      jwhile j5
        jldb j7, j6, 0
        jstb j7, j4, 0
        jadd j6, j6, j3
        jadd j4, j4, j3
        jsub j5, j5, j3
      jwend
    skw2_pnext:
      jld j2, j1, SK3
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, SK3
      jjmp skw2_piece
  skw2_back:
    jldi j1, 0
    jld j9, j1, SK5
    jld j10, j1, SK6
  skw2_next:
    jld j2, j1, SKN + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp skw2_lap
skw2_done:
  jldi j1, 0
  jret

; The structures of a dictionary's file (from SKU to SKEN), summed into SKN and SKP: each structure by the key this
; reading gives it when all its pieces are words it read (as gather makes it), or by its letters when not (one the
; reading never saw: then it is said by the letters the book kept, SKN + 16). Something that does not hold together
; (past the file, a piece longer than a word can be, a number past the structures) ends it. Uses j1-j14.
sk_sread:
  jldi j1, 0
  jld j9, j1, SKU
  jldi j2, 16
  jadd j2, j9, j2
  jld j3, j1, SKEN
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, skf_done
  jld j2, j9, 0
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, skf_done
  jst j2, j1, SK2
  jst j2, j1, SK8
  jld j2, j9, 8
  jst j2, j1, SK7
  jld j11, j1, SK2              ; by number: {key}
  jldi j3, 3
  jshl j11, j11, j3
  jldi j3, 8
  jadd j11, j11, j3
  jcall room
  jldi j1, 0
  jst j13, j1, SKMP
  jld j9, j1, SKU
  jldi j2, 16
  jadd j9, j9, j2
  jst j9, j1, SKU
  jst j1, j1, SK3
  skf_sk:
    jldi j1, 0
    jld j2, j1, SK3
    jld j3, j1, SK2
    jsub j3, j2, j3
    jjz j3, skf_pairs
    jld j9, j1, SKU
    jst j9, j1, SKF             ; (its record)
    jldi j2, 16
    jadd j2, j9, j2
    jld j3, j1, SKEN
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, skf_done
    jld j2, j9, 8
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, skf_done
    jst j2, j1, SK4
    jst j2, j1, SKCN
    jldi j2, 16
    jadd j9, j9, j2
    jst j9, j1, SKU
    jld j2, j1, FNVO
    jst j2, j1, SKO             ; (the reading's key, the letters' key, 0 if a piece is a word it never read)
    jldi j3, 13
    jxor j2, j2, j3
    jst j2, j1, SKR
    jldi j2, 1
    jst j2, j1, SKH
    skf_piece:
      jldi j1, 0
      jld j2, j1, SKCN
      jjz j2, skf_key
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, SKCN
      jld j9, j1, SKU
      jldi j2, 8
      jadd j2, j9, j2
      jld j3, j1, SKEN
      jsub j3, j3, j2
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, skf_done
      jld j4, j9, 0
      jldi j3, 63
      jsar j3, j4, j3
      jjnz j3, skf_done
      jldi j3, 7
      jadd j5, j4, j3
      jldi j3, -8
      jand j5, j5, j3
      jadd j5, j2, j5
      jld j3, j1, SKEN
      jsub j3, j3, j5
      jldi j6, 63
      jsar j3, j3, j6
      jjnz j3, skf_done
      jst j5, j1, SKU
      jst j4, j1, WLEN
      jst j4, j1, WBN
      jcall wb_need
      jld j7, j1, SKR             ; its letters, into the word and the letters' key
      jld j8, j1, FNVP
      jxor j7, j7, j4
      jmul j7, j7, j8
      jldi j6, 0
      skf_letter:
        jsub j3, j6, j4
        jjz j3, skf_letters
        jadd j3, j2, j6
        jldb j3, j3, 0
        jld j5, j1, WBP
        jadd j5, j5, j6
        jstb j3, j5, 0
        jxor j7, j7, j3
        jmul j7, j7, j8
        jldi j3, 1
        jadd j6, j6, j3
        jjmp skf_letter
    skf_letters:
      jst j7, j1, SKR
      jcall word_id
      jldi j1, 0
      jldi j3, 1
      jsub j3, j2, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, skf_known
      jst j1, j1, SKH
      jjmp skf_piece
    skf_known:
      jadd j3, j2, j1
      jld j2, j1, SKO
      jcall hw
      jst j2, j1, SKO
      jjmp skf_piece
  skf_key:
    jld j5, j1, SKR
    jld j2, j1, SKH
    jjz j2, skf_k
    jld j2, j1, SKO
    jld j3, j1, SK4
    jcall hw
    jadd j5, j2, j1
  skf_k:
    jjnz j5, skf_k2
    jldi j5, 1
  skf_k2:
    jld j2, j1, SK3
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, SKMP
    jadd j2, j2, j3
    jst j5, j2, 0
    jld j9, j1, SKF             ; its pairs summed, and its record if the reading has no way to say it
    jld j2, j9, 0
    jst j2, j1, SKCN
    jldi j2, SKN
    jcall pl_take
    jldi j1, 0
    jld j2, j4, 8
    jld j3, j1, SKCN
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j4, 16
    jjnz j2, skf_snext
    jld j2, j1, SKF
    jst j2, j4, 16
  skf_snext:
    jld j2, j1, SK3
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, SK3
    jjmp skf_sk
skf_pairs:
  jld j2, j1, SK7
  jjz j2, skf_done
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, SK7
  jld j9, j1, SKU
  jldi j2, 24
  jadd j2, j9, j2
  jld j3, j1, SKEN
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, skf_done
  jst j2, j1, SKU
  jld j2, j9, 0
  jst j2, j1, SKCN
  jld j2, j9, 8                 ; (each a number of a skeleton of the file)
  jcall skf_num
  jjz j3, skf_done
  jst j2, j1, SK9
  jld j9, j1, SKU
  jldi j3, 8
  jsub j9, j9, j3
  jld j2, j9, 0
  jcall skf_num
  jjz j3, skf_done
  jadd j3, j2, j1
  jld j2, j1, SK9
  jld j4, j1, SKCN
  jcall sk_sharen
  jldi j1, 0
  jjmp skf_pairs
skf_done:
  jldi j1, 0
  jret

; The key of the file's skeleton numbered j2 -> j2 (j3 = 0: no such number). Uses j1-j4.
skf_num:
  jldi j1, 0
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, skn2_no
  jld j3, j1, SK8
  jsub j3, j2, j3
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, skn2_no
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, SKMP
  jadd j2, j2, j3
  jld j2, j2, 0
  jldi j3, 1
  jret
skn2_no:
  jldi j3, 0
  jret

; The skeleton of the library's record j2 said by its letters: each piece a word of the reading when it is one (a
; mark against the word before), its letters when not, a space after. Uses j1-j14.
sk_lit:
  jldi j1, 0
  jjz j2, skl_done
  jld j3, j2, 8
  jst j3, j1, SKCN
  jldi j3, 16
  jadd j2, j2, j3
  jst j2, j1, SKLP
  skl_lap:
    jldi j1, 0
    jld j2, j1, SKCN
    jjz j2, skl_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, SKCN
    jld j9, j1, SKLP
    jld j4, j9, 0
    jst j4, j1, WLEN
    jldi j3, 7
    jadd j5, j4, j3
    jldi j3, -8
    jand j5, j5, j3
    jldi j3, 8
    jadd j5, j5, j3
    jadd j5, j9, j5
    jst j5, j1, SKLP
    jst j4, j1, WBN
    jcall wb_need
    jldi j6, 0
    skl_letter:
      jsub j3, j6, j4
      jjz j3, skl_letters
      jadd j3, j9, j6
      jldb j3, j3, 8
      jld j5, j1, WBP
      jadd j5, j5, j6
      jstb j3, j5, 0
      jldi j3, 1
      jadd j6, j6, j3
      jjmp skl_letter
  skl_letters:
    jcall word_id
    jldi j1, 0
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, skl_raw
    jcall put_glue
    jjmp skl_lap
  skl_raw:
    jld j4, j1, WLEN
    jldi j6, 0
    skl_put:
      jsub j3, j6, j4
      jjz j3, skl_sp
      jst j6, j1, SKO
      jld j5, j1, WBP
      jadd j5, j5, j6
      jldb j2, j5, 0
      jcall putch
      jldi j1, 0
      jld j6, j1, SKO
      jld j4, j1, WLEN
      jldi j3, 1
      jadd j6, j6, j3
      jjmp skl_put
  skl_sp:
    jldi j2, 32
    jcall putch
    jjmp skl_lap
skl_done:
  jldi j1, 0
  jret

; What each mark does, as the reader learned it (lectura.inc, mk_learn), said: its times, its work, how it glues.
; Uses j1-j14.
mk_report:
  jldi j1, 0
  jld j2, j1, MKC
  jjz j2, mkr_done
mkr_counted:
  jldi j1, S_MKH
  jcall puts
  jst j1, j1, MK4               ; each mark seen twice or more, in the order first seen
  mkr_say:
    jldi j1, 0
    jld j2, j1, MK4
    jld j3, j1, MKLN
    jsub j3, j2, j3
    jjz j3, mkr_out
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, MKL
    jadd j3, j3, j4
    jld j2, j3, 0
    jst j2, j1, MK3
    jcall mk_say
    jldi j1, 0
    jld j2, j1, MK4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, MK4
    jjmp mkr_say
mkr_out:
  jldi j2, 10
  jcall putch
  jcall flush
mkr_done:
  jldi j1, 0
  jret

; Mark MK3 said, with what it does (twice at least: the anecdote rule). Uses j1-j14.
mk_say:
  jldi j1, 0
  jld j2, j1, MK3
  jcall mk_rec
  jst j3, j1, MK5
  jld j2, j3, 0
  jldi j4, 2
  jsub j4, j2, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, mks_done
  jldi j2, 10
  jcall putch
  jldi j2, 32
  jcall putch
  jldi j2, 32
  jcall putch
  jcall mk_name
  jldi j2, 32
  jcall putch
  jldi j1, 0
  jld j3, j1, MK5
  jld j2, j3, 0
  jcall putnum
  jld j3, j1, MK5               ; between digits, most of its times: it separates inside numbers
  jld j2, j3, 24
  jadd j2, j2, j2
  jld j4, j3, 0
  jsub j2, j4, j2
  jldi j5, 63
  jsar j2, j2, j5
  jjz j2, mks_open
  jldi j1, S_MNU
  jcall puts
  jjmp mks_glue
mks_open:
  jld j3, j1, MK5               ; the next glued to it most times (or the capital): it opens
  jld j2, j1, MK3
  jld j4, j1, NV
  jsub j4, j2, j4
  jjz j4, mks_opens
  jld j2, j3, 16
  jadd j2, j2, j2
  jld j4, j3, 0
  jsub j2, j4, j2
  jldi j5, 63
  jsar j2, j2, j5
  jjz j2, mks_close
mks_opens:
  jldi j1, S_MAB
  jcall puts
  jjmp mks_glue
mks_close:                      ; else it closes (a pair kept, as a stack) or it separates
  jld j2, j1, MK3
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, MKQ
  jadd j3, j3, j4
  jld j3, j3, 0
  jjz j3, mks_sep
  jldi j4, 1
  jsub j3, j3, j4
  jldi j4, 4
  jshl j3, j3, j4
  jld j4, j1, MKPR
  jadd j3, j3, j4
  jld j2, j3, 0
  jst j2, j1, MK3
  jldi j1, S_MCI
  jcall puts
  jcall mk_name
  jjmp mks_glue
mks_sep:
  jldi j1, S_MSE
  jcall puts
mks_glue:
  jldi j1, S_MPG
  jcall puts
  jld j3, j1, MK5
  jld j2, j3, 8
  jcall putnum
  jldi j1, S_MPA
  jcall puts
  jld j3, j1, MK5
  jld j2, j3, 16
  jcall putnum
mks_done:
  jldi j1, 0
  jret

; Mark MK3's name: its word, or the capital, or the line end. Uses j1-j8.
mk_name:
  jldi j1, 0
  jld j2, j1, MK3
  jld j3, j1, NV
  jsub j3, j2, j3
  jjnz j3, mkn_nl
  jldi j1, S_MCAP
  jjmp puts
mkn_nl:
  jldi j4, 1
  jsub j3, j3, j4
  jjnz j3, mkn_word
  jldi j1, S_MNL
  jjmp puts
mkn_word:
  jjmp putword

; The manual of each language of the reading (the report): the languages with the most units first, each called by
; the word it says the most, with its units and words, its marks (its punctuation) and its words said the most. Six
; languages, twelve marks and eight words each: criterion, the report's size. Uses j1-j14.
ln_report:
  jldi j1, 0
  jld j2, j1, LNG
  jjz j2, lnr_done
  jcall ln_units
  jld j11, j1, NV               ; by language: its units (then minus, once said)
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LN6
  jldi j9, 1
  lnr_sum:
    jld j2, j1, NV
    jsub j2, j9, j2
    jjz j2, lnr_summed
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, LNU
    jadd j4, j4, j3
    jld j4, j4, 0
    jld j5, j1, LNG
    jadd j5, j5, j3
    jld j5, j5, 0
    jldi j6, 3
    jshl j5, j5, j6
    jld j6, j1, LN6
    jadd j5, j5, j6
    jld j6, j5, 0
    jadd j6, j6, j4
    jst j6, j5, 0
    jldi j2, 1
    jadd j9, j9, j2
    jjmp lnr_sum
lnr_summed:
  jldi j1, S_LNH
  jcall puts
  jst j1, j1, LN5
  lnr_lang:
    jldi j1, 0
    jld j2, j1, LN5
    jldi j3, 6
    jsub j3, j2, j3
    jjz j3, lnr_out
    jldi j11, 0
    jldi j12, 0
    jldi j9, 1
    lnr_most:
      jld j2, j1, NV
      jsub j2, j9, j2
      jjz j2, lnr_got
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, LN6
      jadd j3, j3, j4
      jld j3, j3, 0
      jsub j4, j11, j3
      jldi j5, 63
      jsar j4, j4, j5
      jjz j4, lnr_mnext
      jadd j11, j3, j1
      jadd j12, j9, j1
    lnr_mnext:
      jldi j2, 1
      jadd j9, j9, j2
      jjmp lnr_most
  lnr_got:
    jjz j12, lnr_out
    jst j12, j1, LN3            ; this language
    jldi j3, 3
    jshl j3, j12, j3
    jld j4, j1, LN6
    jadd j3, j3, j4
    jldi j4, 0
    jsub j4, j4, j11
    jst j4, j3, 0
    jst j11, j1, LN4
    jldi j2, 10
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j2, 1                  ; its name: its word said the most
    jst j2, j1, LN2
    jcall lnr_words
    jldi j2, 58
    jcall putch
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j2, j1, LN4
    jcall putnum
    jldi j1, S_LNU
    jcall puts
    jcall lnr_count
    jcall putnum
    jldi j1, S_LNP
    jcall puts
    jldi j2, 12                 ; its marks
    jst j2, j1, LN2
    jldi j2, 1
    jst j2, j1, LN1
    jcall lnr_words
    jldi j1, S_LNS
    jcall puts
    jldi j2, 8                  ; its words
    jst j2, j1, LN2
    jst j1, j1, LN1
    jcall lnr_words
    jldi j1, 0
    jld j2, j1, LN5
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LN5
    jjmp lnr_lang
lnr_out:
  jldi j2, 10
  jcall putch
  jcall flush
lnr_done:
  jldi j1, 0
  jret

; The words of language LN3 -> j2 how many. Uses j1-j9.
lnr_count:
  jldi j1, 0
  jldi j8, 0
  jldi j9, 1
  lnc_lap:
    jld j2, j1, NV
    jsub j2, j9, j2
    jjz j2, lnc_done
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, LNG
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j4, j1, LN3
    jsub j3, j3, j4
    jjnz j3, lnc_next
    jldi j3, 1
    jadd j8, j8, j3
  lnc_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp lnc_lap
lnc_done:
  jadd j2, j8, j1
  jret

; Of language LN3, its LN2 words said the most (LN1 1: marks; 0: words, no marks; LN2 1 alone: its name, any), each
; after a space. Said ones are not said again (a list of them, at LNT). Uses j1-j14.
lnr_words:
  jldi j1, 0
  jst j1, j1, LNTN
  lnrw_lap:
    jldi j1, 0
    jld j2, j1, LNTN
    jld j3, j1, LN2
    jsub j3, j2, j3
    jjz j3, lnrw_done
    jldi j11, 0
    jldi j12, 0
    jldi j9, 1
    lnrw_w:
      jldi j1, 0
      jld j2, j1, NV
      jsub j2, j9, j2
      jjz j2, lnrw_got
      jldi j3, 3
      jshl j3, j9, j3
      jld j4, j1, LNG
      jadd j4, j4, j3
      jld j4, j4, 0
      jld j5, j1, LN3
      jsub j4, j4, j5
      jjnz j4, lnrw_next
      jld j4, j1, LNU
      jadd j4, j4, j3
      jld j4, j4, 0
      jsub j5, j11, j4
      jldi j6, 63
      jsar j5, j5, j6
      jjz j5, lnrw_next
      jld j2, j1, LN2             ; (its name: any word)
      jldi j5, 1
      jsub j2, j2, j5
      jjz j2, lnrw_said
      jst j4, j1, LNX
      jadd j2, j9, j1
      jcall w_mark
      jldi j1, 0
      jjz j3, lnrw_word
      jldi j3, 1
    lnrw_word:
      jld j2, j1, LN1
      jsub j2, j2, j3
      jld j4, j1, LNX
      jjnz j2, lnrw_next
    lnrw_said:
      jld j5, j1, LNTN            ; (said already?)
      jld j6, j1, LNT
      lnrw_s:
        jjz j5, lnrw_take
        jld j7, j6, 0
        jsub j7, j7, j9
        jjz j7, lnrw_next
        jldi j7, 8
        jadd j6, j6, j7
        jldi j7, 1
        jsub j5, j5, j7
        jjmp lnrw_s
    lnrw_take:
      jadd j11, j4, j1
      jadd j12, j9, j1
    lnrw_next:
      jldi j2, 1
      jadd j9, j9, j2
      jjmp lnrw_w
  lnrw_got:
    jjz j12, lnrw_done
    jld j2, j1, LNTN
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, LNT
    jadd j3, j3, j4
    jst j12, j3, 0
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LNTN
    jld j2, j1, LN2
    jldi j3, 1
    jsub j2, j2, j3
    jjz j2, lnrw_name
    jldi j2, 32
    jcall putch
  lnrw_name:
    jldi j1, 0
    jld j2, j1, LNTN
    jldi j3, 1
    jsub j2, j2, j3
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, LNT
    jadd j2, j2, j3
    jld j2, j2, 0
    jcall putword
    jjmp lnrw_lap
lnrw_done:
  jldi j1, 0
  jret

; The joiners it chains with (what joins is what turns: "pan y vino" is "vino y pan"): of the units whose "_ u _" (one
; piece between) turns on itself twice at least in this reading, the one that turns the most (QPJ, before the last
; clause) and the next (QPG, between the others; the first if there is no second). Uses j1-j14.
qp_glues:
  jldi j1, 0
  jst j1, j1, QPG
  jst j1, j1, QPJ
  jldi j11, 1                   ; (the most, the next)
  jldi j12, 1
  jld j9, j1, TMI
  jld j10, j1, TMI + 8
  jldi j2, 1
  jadd j10, j10, j2
  qpg_lap:
    jldi j1, 0
    jjz j10, qpg_fill
    jld j2, j9, 0
    jjz j2, qpg_next
    jld j2, j9, 24              ; one piece between
    jldi j3, 1
    jsub j2, j2, j3
    jjnz j2, qpg_next
    jld j2, j9, 40
    jsub j3, j12, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, qpg_next
    jst j2, j1, QPB             ; its unit
    jld j3, j9, 16
    jldi j4, 1
    jadd j3, j3, j4
    jst j9, j1, QPA
    jadd j2, j3, j1
    jcall tok_at
    jld j9, j1, QPA
    jld j3, j1, QPB
    jsub j4, j11, j3            ; the most so far moves to next
    jldi j5, 63
    jsar j4, j4, j5
    jjz j4, qpg_second
    jld j4, j1, QPJ
    jst j4, j1, QPG
    jadd j12, j11, j1
    jst j2, j1, QPJ
    jadd j11, j3, j1
    jjmp qpg_next
  qpg_second:
    jst j2, j1, QPG
    jadd j12, j3, j1
  qpg_next:
    jldi j1, 0
    jld j2, j1, TMI + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp qpg_lap
qpg_fill:
  jld j2, j1, QPG
  jjnz j2, qpg_done
  jld j2, j1, QPJ
  jst j2, j1, QPG
qpg_done:
  jldi j1, 0
  jret

; The families of instructions (Capitan, 2026-11-07: "find the instruction's function by context and add the family to
; the dictionary"; "él es -> tú eres: families it deduces"). An instruction's context is what it joins: each furniture
; word right before or right after it. Two instructions are kin by the share of their contexts they hold in common
; (what they share over what either has). Counts that add up: each instruction's contexts (INS + 88), and for each two
; of them, how many they share (PRT {key, a, b, shared}). Every book adds its own, and the dictionary perfects them.

; This book's contexts and shared contexts (eating). Uses j1-j14.
fam_scan:
  jldi j2, CTX                  ; by (instruction, side, partner): seen {key, instruction}
  jldi j3, 16
  jcall pl_new
  jldi j2, GRP                  ; by (side, partner): the head of its instructions' list {key, head}
  jldi j3, 16
  jcall pl_new
  jldi j2, PRT
  jldi j3, 32
  jcall pl_new
  jldi j1, 0
  jld j11, j1, NTOK             ; the lists: {instruction, next} (two contexts a unit at most)
  jldi j2, 5
  jshl j11, j11, j2
  jldi j2, 16
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, LNK
  jldi j2, 1
  jst j2, j1, LNKN
  jldi j9, 1
  fs_lap:
    jldi j1, 0
    jld j2, j1, NTOK
    jldi j3, 1
    jsub j2, j2, j3
    jsub j2, j9, j2
    jjz j2, fs_pairs
    jst j9, j1, FT1
    jadd j2, j9, j1
    jcall tok_at
    jjz j2, fs_next
    jst j2, j1, FT2
    jcall w_mark
    jldi j1, 0
    jjnz j3, fs_next
    jld j2, j1, FT2
    jcall g_core
    jldi j1, 0
    jjnz j3, fs_next            ; (an instruction)
    jldi j2, -1
    jst j2, j1, FT3
    jcall fs_side
    jldi j1, 0
    jldi j2, 1
    jst j2, j1, FT3
    jcall fs_side
  fs_next:
    jldi j1, 0
    jld j9, j1, FT1
    jldi j2, 1
    jadd j9, j9, j2
    jjmp fs_lap
fs_pairs:                       ; each (side, partner): every two instructions of its list share it
  jld j9, j1, GRP
  jld j10, j1, GRP + 8
  jldi j2, 1
  jadd j10, j10, j2
  fsp_lap:
    jldi j1, 0
    jjz j10, fsp_done
    jld j2, j9, 0
    jjz j2, fsp_next
    jst j9, j1, FT4
    jst j10, j1, FT5
    jld j7, j9, 8               ; a
    fsp_a:
      jldi j1, 0
      jjz j7, fsp_back
      jst j7, j1, FT6
      jldi j3, 4
      jshl j3, j7, j3
      jld j4, j1, LNK
      jadd j3, j3, j4
      jld j2, j3, 0
      jst j2, j1, FT2
      jld j8, j3, 8             ; b, after it
      fsp_b:
        jldi j1, 0
        jjz j8, fsp_anext
        jst j8, j1, FT3
        jldi j3, 4
        jshl j3, j8, j3
        jld j4, j1, LNK
        jadd j3, j3, j4
        jld j3, j3, 0
        jld j2, j1, FT2
        jcall fam_add1
        jldi j1, 0
        jld j8, j1, FT3
        jldi j3, 4
        jshl j3, j8, j3
        jld j4, j1, LNK
        jadd j3, j3, j4
        jld j8, j3, 8
        jjmp fsp_b
    fsp_anext:
      jldi j1, 0
      jld j7, j1, FT6
      jldi j3, 4
      jshl j3, j7, j3
      jld j4, j1, LNK
      jadd j3, j3, j4
      jld j7, j3, 8
      jjmp fsp_a
  fsp_back:
    jldi j1, 0
    jld j9, j1, FT4
    jld j10, j1, FT5
  fsp_next:
    jld j2, j1, GRP + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp fsp_lap
fsp_done:
  jldi j1, 0
  jret

; The furniture on side FT3 of the instruction FT2 at FT1: a context, once (its count at INS + 88 and its list).
; Uses j1-j8.
fs_side:
  jldi j1, 0
  jld j2, j1, FT1
  jld j3, j1, FT3
  jadd j2, j2, j3
  jcall tok_at
  jjz j2, fss_no
  jst j2, j1, FT4
  jcall g_core
  jldi j1, 0
  jjz j3, fss_no
  jld j5, j1, FT4               ; (side, partner): its group's key
  jld j6, j1, FNVP
  jmul j5, j5, j6
  jld j2, j1, FT3
  jxor j5, j5, j2
  jmul j5, j5, j6
  jjnz j5, fss_g
  jldi j5, 1
fss_g:
  jst j5, j1, FT5
  jld j2, j1, FT2               ; (instruction, side, partner) seen?
  jxor j5, j5, j2
  jmul j5, j5, j6
  jjnz j5, fss_k
  jldi j5, 1
fss_k:
  jldi j2, CTX
  jcall pl_take
  jldi j1, 0
  jjz j6, fss_no
  jld j2, j1, FT2               ; its contexts, one more
  jldi j3, INSQ
  jmul j2, j2, j3
  jld j3, j1, INS
  jadd j2, j2, j3
  jld j3, j2, 88
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j2, 88
  jld j5, j1, FT5               ; and into its group's list
  jldi j2, GRP
  jcall pl_take
  jldi j1, 0
  jld j2, j1, LNKN
  jldi j3, 4
  jshl j3, j2, j3
  jld j5, j1, LNK
  jadd j3, j3, j5
  jld j5, j1, FT2
  jst j5, j3, 0
  jld j5, j4, 8
  jst j5, j3, 8
  jst j2, j4, 8
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, LNKN
fss_no:
  jldi j1, 0
  jret

; Instructions j2 and j3 share one more context (or j4 more: fam_addn). Uses j1-j8.
fam_add1:
  jldi j4, 1
fam_addn:
  jldi j1, 0
  jst j4, j1, FT7
  jsub j5, j2, j3               ; (the smaller first)
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, fa_ord
  jadd j5, j2, j1
  jadd j2, j3, j1
  jadd j3, j5, j1
fa_ord:
  jjz j2, fa_done
  jsub j5, j2, j3
  jjz j5, fa_done
  jst j2, j1, FT8
  jst j3, j1, FT9
  jld j6, j1, FNVP
  jadd j5, j2, j1
  jmul j5, j5, j6
  jxor j5, j5, j3
  jmul j5, j5, j6
  jjnz j5, fa_k
  jldi j5, 1
fa_k:
  jldi j2, PRT
  jcall pl_take
  jldi j1, 0
  jld j2, j1, FT8
  jst j2, j4, 8
  jld j2, j1, FT9
  jst j2, j4, 16
  jld j2, j4, 24
  jld j3, j1, FT7
  jadd j2, j2, j3
  jst j2, j4, 24
fa_done:
  jldi j1, 0
  jret

; The families, from what the dictionary holds (INS + 88, PRT): each instruction's kin is the one it shares the most of
; its contexts with (shared over what either has: 1000 a whole); each joined to its kin, and a family is what is joined
; (a word and its kin, and theirs: no line drawn anywhere). FAM: by word, its family's root. Uses j1-j14.
fam_build:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 4
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, NEAR             ; by word {its kin, the share}
  jld j2, j1, NV
  jldi j3, 4
  jshl j2, j2, j3
  jadd j3, j13, j1
  fb_z:
    jjz j2, fb_zd
    jst j1, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jsub j2, j2, j4
    jjmp fb_z
fb_zd:
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, FAM
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
  jld j9, j1, PRT
  jjz j9, fb_done
  jld j10, j1, PRT + 8
  jldi j2, 1
  jadd j10, j10, j2
  fb_lap:
    jldi j1, 0
    jjz j10, fb_join
    jld j2, j9, 0
    jjz j2, fb_next
    jld j2, j9, 24              ; twice at least (the anecdote rule)
    jldi j3, 2
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, fb_next
    jld j2, j9, 8
    jld j3, j9, 16
    jcall fb_note
    jldi j1, 0
    jld j2, j9, 16
    jld j3, j9, 8
    jcall fb_note
  fb_next:
    jldi j1, 0
    jld j2, j1, PRT + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp fb_lap
fb_join:                        ; each with its kin
  jldi j9, 1
  jld j10, j1, NV
  jldi j2, 1
  jsub j10, j10, j2
  jwhile j10
    jldi j1, 0
    jldi j3, 4
    jshl j3, j9, j3
    jld j4, j1, NEAR
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, fbj_n
    jadd j2, j9, j1
    jcall fam_root
    jst j2, j1, FT1
    jadd j2, j3, j1
    jcall fam_root
    jld j4, j1, FT1
    jsub j5, j2, j4
    jjz j5, fbj_n
    jldi j5, 3
    jshl j5, j4, j5
    jld j6, j1, FAM
    jadd j5, j5, j6
    jst j2, j5, 0
  fbj_n:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
fb_done:
  jldi j1, 0
  jret

; Instruction j2 met j3 sharing the PRT entry at j9: the share (shared over what either has); its kin if more. Uses
; j1-j8 (j9, j10 kept).
fb_note:
  jldi j1, 0
  jld j4, j1, INS
  jldi j5, INSQ
  jmul j6, j2, j5
  jadd j6, j6, j4
  jld j6, j6, 88
  jmul j7, j3, j5
  jadd j7, j7, j4
  jld j7, j7, 88
  jadd j6, j6, j7
  jld j7, j9, 24
  jsub j6, j6, j7
  jldi j8, 1000
  jmul j7, j7, j8
  jjz j6, fbn_done
  jdiv j7, j7, j6
  jldi j4, 4
  jshl j4, j2, j4
  jld j5, j1, NEAR
  jadd j4, j4, j5
  jld j5, j4, 8
  jsub j5, j5, j7
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, fbn_done
  jst j3, j4, 0
  jst j7, j4, 8
fbn_done:
  jret

; The root of word j2's family -> j2. Uses j1, j2, j4-j6.
fam_root:
  jldi j1, 0
  fr_lap:
    jldi j4, 3
    jshl j4, j2, j4
    jld j5, j1, FAM
    jadd j4, j4, j5
    jld j6, j4, 0
    jsub j5, j6, j2
    jjz j5, fr_done
    jadd j2, j6, j1
    jjmp fr_lap
fr_done:
  jret

; Word j2 into the row, and thought on (TVT). Uses j1-j8.
th_push:
  jldi j1, 0
  jst j2, j1, THF
  jld j3, j1, THQT
  jldi j4, 3
  jshl j4, j3, j4
  jld j5, j1, THQ
  jadd j4, j4, j5
  jst j2, j4, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, THQT
  jld j5, j1, THF
  jldi j2, TVT
  jcall pl_take
  jldi j1, 0
  jret

; The branch chosen said (Capitan: "build me the sentence, not the walk"): it starts on the word the sentence being
; woven ends on (LINEO), so it goes on in it, its middle and the word it answers with, as the books go on from a word
; another fact ended on; with no sentence open, a new one starts on its word. One that asks what the question asks
; is an answer it thought: the sentence closes and it is said on its own line (th_answer). Uses j1-j11.
th_line:
  jldi j1, 0
  jld j2, j1, THGO
  jjz j2, th_say
  jld j2, j1, LINEO
  jjz j2, thl_ans
  jst j1, j1, LINEO
  jldi j2, 10
  jcall putch
thl_ans:
  jjmp th_answer

th_say:
  jldi j1, 0
  jld j2, j1, LINEO
  jjnz j2, ths_on
  jldi j1, S_ANS
  jcall puts
  jld j2, j1, THX
  jcall putword
ths_on:
  jldi j2, 32
  jcall putch
  jld j12, j1, THE
  jcall put_plain
  jld j2, j1, THY
  jcall putword
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, LINEO
  jjmp flush

; Once a reading: the facts by the word they start on (THH: by word, the first fact's number + 1; THN: by fact, the
; next one's, 0 the last), and by skeleton how many times the books went on with it from a word another fact ended on,
; whatever came before (KCT {key, times}, from GKT's "=" compositions, the library's summed in). Uses j1-j14.
th_build:
  jldi j1, 0
  jldi j2, 1
  jst j2, j1, THR
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, THH
  jld j11, j1, GFN
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, THN
  jld j9, j1, GFN               ; each fact, from the last, at the head of its word's list
  thx_lap:
    jldi j1, 0
    jjz j9, thx_done
    jldi j2, 1
    jsub j9, j9, j2
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, GFL
    jadd j3, j3, j4
    jld j2, j3, 0
    jcall tok_at
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, THH
    jadd j2, j2, j3
    jld j4, j2, 0
    jldi j5, 3
    jshl j5, j9, j5
    jld j6, j1, THN
    jadd j5, j5, j6
    jst j4, j5, 0
    jldi j4, 1
    jadd j4, j9, j4
    jst j4, j2, 0
    jjmp thx_lap
thx_done:
  jldi j2, KCT
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jld j9, j1, GKT
  jld j10, j1, GKT + 8
  jldi j2, 1
  jadd j10, j10, j2
  thk_lap:
    jldi j1, 0
    jjz j10, thk_done
    jld j2, j9, 0
    jjz j2, thk_next
    jld j2, j9, 40
    jjnz j2, thk_next
    jst j9, j1, TI
    jst j10, j1, TJ
    jld j5, j9, 32
    jldi j2, KCT
    jcall pl_take
    jldi j1, 0
    jld j9, j1, TI
    jld j10, j1, TJ
    jld j2, j4, 8
    jld j3, j9, 8
    jadd j2, j2, j3
    jst j2, j4, 8
  thk_next:
    jld j2, j1, GKT + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp thk_lap
thk_done:
  jldi j1, 0
  jret

; Word j2 wanted: its letters and a line feed added to PNB, once a word (the room doubles when it would not hold
; them). Uses j1-j14.
want_word:
  jldi j1, 0
  jst j2, j1, THG
  jld j2, j1, WNT
  jjnz j2, ww_ready
  jldi j2, WNT
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jldi j11, 4096
  jst j11, j1, PNC
  jcall room
  jldi j1, 0
  jst j13, j1, PNB
  jst j1, j1, PNN
ww_ready:
  jld j5, j1, THG
  jldi j2, WNT
  jcall pl_take
  jldi j1, 0
  jjz j6, ww_done
  jld j2, j1, THG               ; its letters
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j5, j3, 16
  jld j6, j3, 8
  jld j4, j1, ROOMA
  jadd j6, j6, j4
  jst j5, j1, TI
  jst j6, j1, TJ
  jld j2, j1, PNN               ; room for them and a line feed?
  jadd j2, j2, j5
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j1, PNC
  jsub j3, j3, j2
  jldi j4, 63
  jsar j3, j3, j4
  jjz j3, ww_put
  jld j11, j1, PNC
  jadd j11, j11, j11
  jadd j11, j11, j5
  jst j11, j1, PNC
  jcall room
  jldi j1, 0
  jld j4, j1, PNB
  jadd j5, j13, j1
  jld j6, j1, PNN
  jldi j7, 1
  jwhile j6
    jldb j8, j4, 0
    jstb j8, j5, 0
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jst j13, j1, PNB
ww_put:
  jld j4, j1, PNB
  jld j2, j1, PNN
  jadd j4, j4, j2
  jld j5, j1, TI
  jld j6, j1, TJ
  jldi j7, 1
  jwhile j5
    jldb j8, j6, 0
    jstb j8, j4, 0
    jadd j6, j6, j7
    jadd j4, j4, j7
    jsub j5, j5, j7
  jwend
  jldi j8, 10
  jstb j8, j4, 0
  jadd j4, j4, j7
  jld j2, j1, PNB
  jsub j4, j4, j2
  jst j4, j1, PNN
ww_done:
  jldi j1, 0
  jret

; The words wanted, into "pensar" (none: it goes), for the talk to read their renglones again and think on. Uses
; j1-j14.
want_write:
  jldi j1, 0
  jldi j10, 12
  jldi j11, S_PENS
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jld j2, j1, PNN
  jjz j2, wwr_done
  jldi j10, 4
  jldi j11, S_PENS
  jldi j12, 6
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, wwr_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, PNB
  jld j12, j1, PNN
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
wwr_done:
  jldi j1, 0
  jret

; j2 = 1 if the middle of skeleton j12 has a word (not only marks). Uses j1-j11.
sk_word:
  jldi j1, 0
  jld j9, j12, 16
  jld j10, j12, 24
  jldi j11, 1
  jwhile j10
    jldi j1, 0
    jadd j2, j9, j11
    jcall tok_at
    jcall w_mark
    jldi j1, 0
    jjnz j3, skw_next
    jldi j2, 1
    jret
  skw_next:
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
  jldi j2, 0
  jret

; What this book's compositions teach to think with (think), into the library: "tablero/enganches-" and the print of
; the book's bytes (salted 5: written once, as the turns). How many times the book went on from a word another fact
; ended on ("=") with each skeleton, whatever skeleton came before (plastic, as think asks), its middle by letters (a
; word's number is this reading's only). Qwords {1, how many}, each {times, its pieces} and each piece {its bytes,
; its letters padded}. They are counts: they add up over every book. Uses j1-j14.
eng_eat:
  jldi j1, 0
  jld j2, j1, EATB
  jjz j2, ee2_done
  jld j2, j1, GKT
  jjz j2, ee2_done
  jldi j2, CKT                  ; by skeleton, summed over what came before
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jld j9, j1, GKT
  jld j10, j1, GKT + 8
  jldi j2, 1
  jadd j10, j10, j2
  ee2_sum:
    jldi j1, 0
    jjz j10, ee2_summed
    jld j2, j9, 0
    jjz j2, ee2_snext
    jld j2, j9, 40
    jjnz j2, ee2_snext
    jst j9, j1, TI
    jst j10, j1, TJ
    jld j5, j9, 32
    jldi j2, CKT
    jcall pl_take
    jldi j1, 0
    jld j9, j1, TI
    jld j10, j1, TJ
    jld j2, j4, 8
    jld j3, j9, 8
    jadd j2, j2, j3
    jst j2, j4, 8
  ee2_snext:
    jld j2, j1, GKT + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp ee2_sum
ee2_summed:
  jldi j2, 16                   ; its bytes
  jst j2, j1, QLW
  jst j1, j1, QLN
  jst j1, j1, QLS
  jcall ee2_walk
  jldi j1, 0
  jld j11, j1, QLW
  jcall room
  jldi j1, 0
  jst j13, j1, QLC
  jldi j2, 1
  jst j2, j13, 0
  jld j2, j1, QLN
  jst j2, j13, 8
  jldi j2, 16
  jadd j2, j13, j2
  jst j2, j1, QLP
  jldi j2, 1
  jst j2, j1, QLS
  jcall ee2_walk                ; written
  jldi j1, 0                    ; in bits, as the turns: each piece once, the entries by their indexes
  jld j2, j1, QLC
  jst j2, j1, EOUT
  jld j2, j1, QLW
  jst j2, j1, EOSZ
  jld j2, j1, QLC               ; (how many: its head says it; QLN counted both passes)
  jld j2, j2, 8
  jst j2, j1, ECNT
  jldi j2, 1
  jst j2, j1, DKIND
  jcall eb_encode
  jldi j1, 0
  jld j2, j1, EOUT
  jst j2, j1, QLC
  jld j2, j1, EOSZ
  jst j2, j1, QLW
  jldi j11, 64
  jcall room
  jldi j1, 0
  jst j13, j1, ELAB
  jld j5, j1, EATB
  jldi j3, 5
  jxor j5, j5, j3
  jld j3, j1, FNVP
  jmul j5, j5, j3
  jldi j6, S_ENG
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jld j2, j1, QLN
  jjz j2, ee2_done
  jldi j10, 4
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ee2_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, QLC
  jld j12, j1, QLW
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
ee2_done:
  jldi j1, 0
  jret

; Every skeleton of CKT: counted with its bytes (QLS 0: QLN, QLW), or written at QLP (QLS 1). Uses j1-j14.
ee2_walk:
  jldi j1, 0
  jld j9, j1, CKT
  jld j10, j1, CKT + 8
  jldi j2, 1
  jadd j10, j10, j2
  ee2w_lap:
    jldi j1, 0
    jjz j10, ee2w_done
    jld j2, j9, 0
    jjz j2, ee2w_next
    jst j9, j1, TI
    jst j10, j1, TJ
    jld j2, j9, 0               ; its pieces
    jcall find_mid
    jldi j1, 0
    jld j2, j12, 0
    jjz j2, ee2w_back
    jldi j13, EBUF
    jcall m_collect
    jldi j1, 0
    jst j2, j1, EN2
    jjz j2, ee2w_back
    jld j3, j1, QLS
    jjz j3, ee2w_size
    jld j4, j1, QLP             ; {times, pieces}
    jld j9, j1, TI
    jld j3, j9, 8
    jst j3, j4, 0
    jst j2, j4, 8
    jldi j3, 16
    jadd j4, j4, j3
    jst j4, j1, QLP
    jjmp ee2w_pieces
  ee2w_size:
    jld j3, j1, QLW
    jldi j4, 16
    jadd j3, j3, j4
    jst j3, j1, QLW
  ee2w_pieces:
    jld j2, j1, QLN
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, QLN
    jst j1, j1, EK
    ee2w_piece:
      jldi j1, 0
      jld j2, j1, EK
      jld j3, j1, EN2
      jsub j3, j2, j3
      jjz j3, ee2w_back
      jldi j3, 3
      jshl j3, j2, j3
      jld j2, j3, EBUF
      jldi j3, 3
      jshl j3, j2, j3
      jld j4, j1, ROOMI
      jadd j3, j3, j4
      jld j3, j3, 0
      jld j5, j3, 16            ; its bytes, its letters
      jld j6, j3, 8
      jld j4, j1, ROOMA
      jadd j6, j6, j4
      jldi j7, 7
      jadd j8, j5, j7
      jldi j7, -8
      jand j8, j8, j7
      jldi j7, 8
      jadd j8, j8, j7
      jld j3, j1, QLS
      jjnz j3, ee2w_put
      jld j3, j1, QLW
      jadd j3, j3, j8
      jst j3, j1, QLW
      jjmp ee2w_pnext
    ee2w_put:
      jld j4, j1, QLP
      jst j5, j4, 0
      jadd j3, j4, j8
      jst j3, j1, QLP
      jldi j3, 8
      jadd j4, j4, j3
      jldi j3, 1
      jwhile j5
        jldb j7, j6, 0
        jstb j7, j4, 0
        jadd j6, j6, j3
        jadd j4, j4, j3
        jsub j5, j5, j3
      jwend
    ee2w_pnext:
      jld j2, j1, EK
      jldi j3, 1
      jadd j2, j2, j3
      jst j2, j1, EK
      jjmp ee2w_piece
  ee2w_back:
    jldi j1, 0
    jld j9, j1, TI
    jld j10, j1, TJ
  ee2w_next:
    jld j2, j1, CKT + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp ee2w_lap
ee2w_done:
  jldi j1, 0
  jret

; One file of compositions (SXR, SXN bytes): each skeleton this reading knows (all its pieces are words it read) adds
; its times to GKT as a composition from any skeleton by the same core, as think asks. Something that does not hold
; together (past the file, a piece longer than a word can be) ends the file. Uses j1-j14.
pe_file:
  jldi j1, 0
  jld j9, j1, SXR
  jld j2, j9, 0
  jldi j3, 1
  jsub j2, j2, j3
  jjnz j2, pef_done
  jld j2, j9, 8
  jst j2, j1, QLW
  jld j2, j1, SXN
  jadd j2, j9, j2
  jst j2, j1, QLH               ; (its end)
  jldi j2, 16
  jadd j9, j9, j2
  jst j9, j1, QLK
  pef_lap:
    jldi j1, 0
    jld j2, j1, QLW
    jjz j2, pef_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, QLW
    jld j9, j1, QLK
    jldi j2, 16                 ; {times, pieces} inside?
    jadd j2, j9, j2
    jld j3, j1, QLH
    jsub j3, j3, j2
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, pef_done
    jld j2, j9, 0
    jst j2, j1, QLP
    jld j2, j9, 8
    jst j2, j1, QLC
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, pef_done
    jldi j2, 16
    jadd j9, j9, j2
    jst j9, j1, QLK
    jld j2, j1, FNVO            ; the skeleton's key, as gather makes it
    jst j2, j1, QLQ
    jst j1, j1, QLS             ; (1: a piece this reading never read)
    jld j2, j1, QLC
    jst j2, j1, QLN
    pef_piece:
      jldi j1, 0
      jld j2, j1, QLN
      jjz j2, pef_key
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, QLN
      jld j9, j1, QLK
      jldi j2, 8
      jadd j2, j9, j2
      jld j3, j1, QLH
      jsub j3, j3, j2
      jldi j4, 63
      jsar j3, j3, j4
      jjnz j3, pef_done
      jld j4, j9, 0
      jldi j3, 63
      jsar j3, j4, j3
      jjnz j3, pef_done
      jldi j3, 7
      jadd j5, j4, j3
      jldi j3, -8
      jand j5, j5, j3
      jadd j5, j2, j5
      jld j3, j1, QLH
      jsub j3, j3, j5
      jldi j6, 63
      jsar j3, j3, j6
      jjnz j3, pef_done
      jst j5, j1, QLK
      jst j4, j1, WLEN
      jst j4, j1, WBN
      jcall wb_need
      jldi j6, 0
      pef_letter:
        jsub j3, j6, j4
        jjz j3, pef_letters
        jadd j3, j2, j6
        jldb j3, j3, 0
        jld j5, j1, WBP
        jadd j5, j5, j6
        jstb j3, j5, 0
        jldi j3, 1
        jadd j6, j6, j3
        jjmp pef_letter
    pef_letters:
      jcall word_id
      jldi j1, 0
      jldi j3, 1
      jsub j3, j2, j3
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, pef_known
      jldi j3, 1
      jst j3, j1, QLS
      jjmp pef_piece
    pef_known:
      jadd j3, j2, j1
      jld j2, j1, QLQ
      jcall hw
      jst j2, j1, QLQ
      jjmp pef_piece
  pef_key:
    jld j2, j1, QLS
    jjnz j2, pef_lap
    jld j2, j1, QLQ
    jld j3, j1, QLC
    jcall hw
    jjnz j2, pef_k
    jldi j2, 1
  pef_k:
    jst j2, j1, QLQ
    jld j4, j1, FNVP            ; its composition's key in GKT, the library's own
    jldi j3, 5
    jxor j5, j2, j3
    jmul j5, j5, j4
    jjnz j5, pef_k2
    jldi j5, 1
  pef_k2:
    jldi j2, GKT
    jcall pl_take
    jldi j1, 0
    jld j2, j4, 8
    jld j3, j1, QLP
    jadd j2, j2, j3
    jst j2, j4, 8
    jld j2, j1, QLQ
    jst j2, j4, 32
    jst j1, j4, 16
    jst j1, j4, 40
    jjmp pef_lap
pef_done:
  jldi j1, 0
  jret

; j2 = 1 if the building QAT to QAI, closed by limit QAX, asks: an arrow of it whose voted limit is QAX. Uses j1-j8.
qa_asks:
  jldi j1, 0
  jld j9, j1, QAT
  qas_lap:
    jldi j1, 0
    jld j2, j1, QAI
    jsub j2, j9, j2
    jjz j2, qas_no
    jldi j2, 3
    jshl j2, j9, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jjz j2, qas_next
    jst j2, j1, PMT
    jcall is_arrow
    jldi j1, 0
    jjz j2, qas_next
    jld j2, j1, PMT
    jldi j3, 24
    jmul j3, j2, j3
    jld j4, j1, ROOMAR
    jadd j3, j3, j4
    jld j3, j3, 8
    jld j4, j1, QAX
    jsub j3, j3, j4
    jjnz j3, qas_next
    jldi j2, 1
    jret
  qas_next:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qas_lap
qas_no:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if a core of the building QAT to QAI (furniture) is a core of the question before it (QAS to QAE) too. Uses
; j1-j8, j9 kept.
qa_shared:
  jldi j1, 0
  jld j7, j1, QAT
  qsh_lap:
    jldi j1, 0
    jld j2, j1, QAI
    jsub j2, j7, j2
    jjz j2, qsh_no
    jldi j2, 3
    jshl j2, j7, j2
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jst j2, j1, QWL
    jst j7, j1, QNBP
    jcall g_core
    jldi j1, 0
    jld j7, j1, QNBP
    jjz j3, qsh_next
    jld j8, j1, QAS             ; said in the question too?
    qsh_q:
      jld j2, j1, QAE
      jsub j2, j8, j2
      jjz j2, qsh_next
      jldi j2, 3
      jshl j2, j8, j2
      jld j3, j1, ROOMT
      jadd j2, j2, j3
      jld j2, j2, 0
      jld j3, j1, QWL
      jsub j2, j2, j3
      jjz j2, qsh_yes
      jldi j2, 1
      jadd j8, j8, j2
      jjmp qsh_q
  qsh_next:
    jldi j2, 1
    jadd j7, j7, j2
    jjmp qsh_lap
qsh_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qsh_no:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if word j2 is an arrow: its voted limit closes most of its buildings, two at least, and not most of the book's.
; Uses j1-j6.
is_arrow:
  jldi j1, 0
  jld j3, j1, ROOMAX            ; the library's decision first, when it gave one
  jjz j3, ia_piece
  jldi j4, 3
  jshl j4, j2, j4
  jadd j3, j3, j4
  jld j3, j3, 0
  jjz j3, ia_piece
  jldi j4, 1
  jsub j3, j3, j4
  jjnz j3, ia_no
  jldi j2, 1
  jret
ia_piece:
  jld j3, j1, ROOMAR
  jjz j3, ia_no
  jldi j4, 24
  jmul j4, j2, j4
  jadd j3, j3, j4
  jld j4, j3, 16                ; how many of its buildings close with it
  jldi j5, 2
  jsub j5, j4, j5
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, ia_no
  jadd j5, j4, j4
  jld j6, j3, 0
  jsub j5, j6, j5
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, ia_no
  jld j4, j3, 8                 ; and the limit closes fewer than half the book's buildings
  jldi j5, 3
  jshl j4, j4, j5
  jld j5, j1, ROOMCN
  jadd j4, j4, j5
  jld j4, j4, 0
  jadd j4, j4, j4
  jld j5, j1, NBLD
  jsub j4, j4, j5
  jldi j6, 63
  jsar j4, j4, j6
  jjz j4, ia_no
  jldi j2, 1
  jret
ia_no:
  jldi j2, 0
  jret

; The silhouettes of reading the library left for this piece (Capitan: "the reading rules must not be lost, they must
; be enriched"): a piece read again is too little to learn to read it, so what every book eaten taught decides for the
; words it knows: the house (ROOMSD) and the arrows (ROOMAX). The file "siluetas" {its bytes, its letters padded, the
; house, an arrow} (pistas.inc), if there is one. Uses j1-j14.
sil_load:
  jldi j1, 0
  jst j1, j1, SILNW
  jst j1, j1, SILNA
  jldi j10, 4
  jldi j11, S_SILS
  jldi j12, 8
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, sl_done
  jst j13, j1, SILH
  jst j1, j1, SILN
  jldi j11, 4096
  jst j11, j1, SILC
  jcall room
  jldi j1, 0
  jst j13, j1, SILR
sl_read:
  jld j10, j1, SILH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, SILR
  jld j2, j1, SILN
  jadd j11, j11, j2
  jld j12, j1, SILC
  jsub j12, j12, j2
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, sl_close
  jld j2, j1, SILN
  jadd j2, j2, j13
  jst j2, j1, SILN
  jld j3, j1, SILC
  jsub j3, j3, j2
  jjnz j3, sl_read
  jld j11, j1, SILC             ; full: twice the room, what it holds copied
  jadd j11, j11, j11
  jcall room
  jldi j1, 0
  jld j4, j1, SILR
  jadd j5, j13, j1
  jld j6, j1, SILN
  jwhile j6
    jld j7, j4, 0
    jst j7, j5, 0
    jldi j7, 8
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jst j13, j1, SILR
  jld j2, j1, SILC
  jadd j2, j2, j2
  jst j2, j1, SILC
  jjmp sl_read
sl_close:
  jld j10, j1, SILH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, SILN
  jjnz j2, sl_some
  jldi j10, 12                  ; (nothing there: the empty file opening made goes)
  jldi j11, S_SILS
  jldi j12, 8
  jcall ask
  jjmp sl_done
sl_some:
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ROOMAX
  jld j2, j1, PASS
  jst j2, j1, SILPS
  jldi j2, 2                    ; (a word looked for, never added)
  jst j2, j1, PASS
  jld j2, j1, SILR
  jst j2, j1, SILP
  sl_word:
    jldi j1, 0
    jld j9, j1, SILP
    jld j2, j1, SILR
    jsub j2, j9, j2
    jld j3, j1, SILN
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjz j2, sl_words
    jld j4, j9, 0               ; its letters, as a word being read
    jst j4, j1, WLEN
    jst j4, j1, WBN
    jcall wb_need
    jldi j5, 8
    jadd j5, j9, j5
    jldi j6, 0
    sl_letter:
      jsub j7, j6, j4
      jjz j7, sl_letters
      jadd j7, j5, j6
      jldb j7, j7, 0
      jld j3, j1, WBP
      jadd j3, j3, j6
      jstb j7, j3, 0
      jldi j7, 1
      jadd j6, j6, j7
      jjmp sl_letter
    sl_letters:
    jcall word_id
    jldi j1, 0
    jld j9, j1, SILP
    jld j4, j9, 0
    jldi j5, 7
    jadd j4, j4, j5
    jldi j5, -8
    jand j4, j4, j5
    jldi j5, 8
    jadd j4, j4, j5
    jadd j9, j9, j4             ; its house, its arrow, its switch of the no
    jld j5, j9, 0
    jld j6, j9, 8
    jld j7, j9, 16
    jst j7, j1, SILSW
    jldi j7, 24
    jadd j7, j9, j7
    jst j7, j1, SILP
    jldi j7, 1
    jsub j7, j2, j7
    jldi j8, 63
    jsar j7, j7, j8
    jjnz j7, sl_word            ; (a word this piece never read)
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ROOMSD
    jadd j4, j4, j3
    jst j5, j4, 0
    jld j4, j1, ROOMAX
    jadd j4, j4, j3
    jldi j7, 2
    jjz j6, sl_mark
    jldi j7, 1
    jld j8, j1, SILNA
    jadd j8, j8, j7
    jst j8, j1, SILNA
  sl_mark:
    jst j7, j4, 0
    jld j8, j1, ROOMW           ; the switch of the no, as the books decided it (a piece read again around a word
    jjz j8, sl_count            ; would take that word for one: it is in every renglon)
    jldi j7, 6
    jshl j7, j2, j7
    jadd j8, j8, j7
    jld j7, j8, 56
    jldi j6, -2
    jand j7, j7, j6
    jld j6, j1, SILSW
    jor j7, j7, j6
    jst j7, j8, 56
  sl_count:
    jld j8, j1, SILNW
    jldi j7, 1
    jadd j8, j8, j7
    jst j8, j1, SILNW
    jjmp sl_word
  sl_words:
  jld j2, j1, SILPS
  jst j2, j1, PASS
  jldi j1, S_SILT               ; said: how many it took, how many arrows
  jcall puts
  jld j2, j1, SILNW
  jcall putnum
  jldi j1, S_SILA
  jcall puts
  jld j2, j1, SILNA
  jcall putnum
  jldi j2, 41
  jcall putch
  jldi j2, 10
  jcall putch
  jcall flush
sl_done:
  jldi j1, 0
  jret

; Eating (Capitan, 2026-11-07: the reading rules are logical silhouettes that are enriched, never lost): the file
; "come" holds a book's address on the host. Then the book is read there (37, read only), and what it proved between
; its skeletons is kept in the library for every Razar: eat_write. Without "come" (or an empty one: the open made it,
; and it goes), nothing changes. Uses j1-j14.
eat_mode:
  jldi j1, 0
  jst j1, j1, EATON
  jldi j10, 4
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, em_done
  jst j13, j1, EHND
  jldi j11, 4096                ; (an address of the host: the longest is under that)
  jcall room
  jldi j1, 0
  jst j13, j1, EATP
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, EATP
  jldi j12, 4095
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jsar j2, j13, j2
  jldi j3, -1
  jxor j2, j2, j3
  jand j13, j13, j2
  jst j13, j1, EATN
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j3, j1, EATN              ; (without the line feed, spaces or controls after it)
  em_strip:
    jjz j3, em_stripped
    jld j4, j1, EATP
    jadd j4, j4, j3
    jldi j5, 1
    jsub j4, j4, j5
    jldb j5, j4, 0
    jldi j6, 33
    jsub j5, j5, j6
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, em_stripped
    jldi j4, 1
    jsub j3, j3, j4
    jjmp em_strip
em_stripped:
  jst j3, j1, EATN
  jjnz j3, em_book
  jldi j10, 12
  jldi j11, S_COME
  jldi j12, 4
  jcall ask
  jjmp em_done
em_book:
  jld j2, j1, EATP
  jst j2, j1, LABEL
  jst j3, j1, LABLEN
  jldi j2, 1
  jst j2, j1, HOSTB
  jst j2, j1, EATON
em_done:
  jldi j1, 0
  jret

; What the book proved between its skeletons (TMM: two of them said of the same pairs, turned or not), each with two
; pairs or more (the anecdote rule), into the library: "tablero/esqueletos" + the print of the book's bytes (written
; once, as its pieces: the same book anywhere is one file). Built as qwords {1, how many}, then each {turned, pairs,
; the pieces of one middle, of the other}, then their pieces, each {its bytes, its letters padded}, and written in
; bits (eb_encode); the first format's file of the same book goes. They are counts: they add up over every book.
; Uses j1-j14.
eat_write:
  jldi j1, 0                    ; the print of the book's bytes
  jld j2, j1, FNVO
  jst j2, j1, EATH
  jldi j10, 37
  jld j11, j1, EATP
  jld j12, j1, EATN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ew_done
  jst j13, j1, EHND
  jldi j11, 1
  jshi j11, 0
  jcall room
  jldi j1, 0
  jst j13, j1, ET1
  ew_read:
    jld j10, j1, EHND
    jldi j2, 32
    jshl j10, j10, j2
    jldi j2, 5
    jor j10, j10, j2
    jld j11, j1, ET1
    jldi j12, 1
    jshi j12, 0
    jcall ask
    jldi j1, 0
    jldi j2, 1
    jsub j2, j13, j2
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, ew_read_end
    jld j2, j1, EATH
    jld j3, j1, ET1
    jld j6, j1, FNVP
    jwhile j13
      jldb j4, j3, 0
      jxor j2, j2, j4
      jmul j2, j2, j6
      jldi j4, 1
      jadd j3, j3, j4
      jsub j13, j13, j4
    jwend
    jst j2, j1, EATH
    jjmp ew_read
ew_read_end:
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, 0
  jld j2, j1, EATH              ; (and the format, folded in: 2, in bits)
  jst j2, j1, EATB
  jldi j3, 2
  jxor j2, j2, j3
  jld j3, j1, FNVP
  jmul j2, j2, j3
  jst j2, j1, EATH
  jst j1, j1, ECNT              ; its bytes: every relation proved twice or more, with the letters of both middles
  jldi j2, 16
  jst j2, j1, EOSZ
  jst j1, j1, EOUT
  jcall ew_walk
  jldi j1, 0
  jld j11, j1, EOSZ
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, EOUT
  jldi j2, 1
  jst j2, j13, 0
  jld j2, j1, ECNT
  jst j2, j13, 8
  jldi j2, 16
  jadd j2, j13, j2
  jst j2, j1, EPOS
  jst j1, j1, ECNT
  jcall ew_walk                 ; and written
  jldi j1, 0
  jst j1, j1, DKIND
  jcall eb_encode               ; in bits
  jldi j1, 0
  jldi j11, 64                  ; its label: "tablero/esqueletos" and sixteen hex digits
  jcall room
  jldi j1, 0
  jst j13, j1, ELAB
  jld j5, j1, EATB              ; the first format's file of this book goes: the bits say the same
  jldi j3, 1
  jxor j5, j5, j3
  jld j3, j1, FNVP
  jmul j5, j5, j3
  jldi j6, S_ESQ
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jld j5, j1, EATH
  jldi j6, S_ESQ
  jcall ew_label
  jldi j10, 12
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j10, 4
  jldi j1, 0
  jld j11, j1, ELAB
  jldi j12, 34
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, ew_done
  jst j13, j1, EHND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, EOUT
  jld j12, j1, EOSZ
  jcall ask
  jldi j1, 0
  jld j10, j1, EHND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
  jldi j1, S_ESQD               ; said: how many it kept
  jcall puts
  jld j2, j1, ECNT
  jcall putnum
  jldi j2, 10
  jcall putch
ew_done:
  jldi j1, 0
  jjmp flush

; Every relation between skeletons (TMM) proved by two pairs or more: counted with its bytes (EOUT 0), or written at
; EPOS (EOUT a room). The pieces of both middles go one after the other at EBUF. Uses j1-j14.
ew_walk:
  jldi j1, 0
  jst j1, j1, EI
  ewk_lap:
    jldi j1, 0
    jld j9, j1, EI
    jld j2, j1, TMMM
    jsub j2, j2, j9
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, ewk_done           ; (past its last place)
    jldi j3, 40
    jmul j3, j9, j3
    jld j2, j1, TMM
    jadd j3, j3, j2
    jst j3, j1, ET2
    jld j2, j3, 0
    jjz j2, ewk_next
    jld j2, j3, 32
    jldi j4, 2
    jsub j2, j2, j4
    jldi j4, 63
    jsar j2, j2, j4
    jjnz j2, ewk_next
    jld j2, j3, 8               ; the first middle's pieces
    jcall find_mid
    jldi j13, EBUF
    jcall m_collect
    jldi j1, 0
    jst j2, j1, ET1
    jjz j2, ewk_next
    jld j3, j1, ET2             ; and the other's, right after
    jld j2, j3, 16
    jcall find_mid
    jldi j1, 0
    jld j13, j1, ET1
    jldi j2, 3
    jshl j13, j13, j2
    jldi j2, EBUF
    jadd j13, j13, j2
    jcall m_collect
    jldi j1, 0
    jst j2, j1, EN2
    jjz j2, ewk_next
    jld j4, j1, ECNT
    jldi j5, 1
    jadd j4, j4, j5
    jst j4, j1, ECNT
    jcall ew_entry
  ewk_next:
    jldi j1, 0
    jld j9, j1, EI
    jldi j2, 1
    jadd j9, j9, j2
    jst j9, j1, EI
    jjmp ewk_lap
ewk_done:
  jldi j1, 0
  jret

; One relation (ET2), its pieces at EBUF (ET1 of the first middle, EN2 of the other): its bytes added, or it written.
; Uses j1-j14.
ew_entry:
  jldi j1, 0
  jld j2, j1, EOUT
  jjz j2, ee_count
  jld j4, j1, EPOS              ; written: turned, pairs, how many pieces each
  jld j3, j1, ET2
  jld j2, j3, 24
  jst j2, j4, 0
  jld j2, j3, 32
  jst j2, j4, 8
  jld j2, j1, ET1
  jst j2, j4, 16
  jld j2, j1, EN2
  jst j2, j4, 24
  jldi j2, 32
  jadd j4, j4, j2
  jst j4, j1, EPOS
  jjmp ee_pieces
ee_count:
  jld j3, j1, EOSZ
  jldi j4, 32
  jadd j3, j3, j4
  jst j3, j1, EOSZ
ee_pieces:
  jst j1, j1, EK
  ee_lap:
    jldi j1, 0
    jld j5, j1, EK
    jld j6, j1, ET1
    jld j7, j1, EN2
    jadd j6, j6, j7
    jsub j6, j5, j6
    jjz j6, ee_done
    jldi j6, 3
    jshl j6, j5, j6
    jld j2, j6, EBUF
    jldi j3, 3                  ; its letters
    jshl j3, j2, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j5, j3, 16
    jld j3, j3, 8
    jld j4, j1, ROOMA
    jadd j3, j3, j4
    jld j2, j1, EOUT
    jjz j2, ee_size
    jld j4, j1, EPOS            ; {its bytes, its letters padded}
    jst j5, j4, 0
    jldi j6, 8
    jadd j4, j4, j6
    jadd j6, j5, j1
    jwhile j6
      jldb j7, j3, 0
      jstb j7, j4, 0
      jldi j7, 1
      jadd j3, j3, j7
      jadd j4, j4, j7
      jsub j6, j6, j7
    jwend
  ee_size:
    jldi j6, 7
    jadd j5, j5, j6
    jldi j6, -8
    jand j5, j5, j6
    jldi j6, 8
    jadd j5, j5, j6
    jld j2, j1, EOUT
    jjz j2, ee_add
    jld j4, j1, EPOS
    jadd j4, j4, j5
    jst j4, j1, EPOS
    jjmp ee_next
  ee_add:
    jld j3, j1, EOSZ
    jadd j3, j3, j5
    jst j3, j1, EOSZ
  ee_next:
    jld j5, j1, EK
    jldi j6, 1
    jadd j5, j5, j6
    jst j5, j1, EK
    jjmp ee_lap
ee_done:
  jldi j1, 0
  jret

; The label of print j5 at ELAB: the 18 bytes at j6 ("tablero/esqueletos", "tablero/preguntas-") and sixteen hex
; digits. Uses j1-j8.
ew_label:
  jldi j1, 0
  jst j5, j1, DT4
  jld j2, j1, ELAB
  jadd j3, j6, j1
  jldi j4, 18
  ew_lab:
    jldb j5, j3, 0
    jstb j5, j2, 0
    jldi j5, 1
    jadd j2, j2, j5
    jadd j3, j3, j5
    jsub j4, j4, j5
    jjnz j4, ew_lab
  jld j5, j1, DT4
  jld j3, j1, ELAB
  jldi j4, 33
  jadd j3, j3, j4
  jldi j4, 16
  ew_hex:
    jldi j6, 15
    jand j6, j5, j6
    jldi j7, 10
    jsub j7, j6, j7
    jldi j8, 63
    jsar j7, j7, j8
    jldi j8, 48
    jjnz j7, ew_digit
    jldi j8, 87
  ew_digit:
    jadd j6, j6, j8
    jstb j6, j3, 0
    jldi j6, 4
    jshr j5, j5, j6
    jldi j6, 1
    jsub j3, j3, j6
    jsub j4, j4, j6
    jjnz j4, ew_hex
  jret

; The relations written (EOUT, EOSZ bytes: {1, how many}, then each {turned, pairs, how many pieces each} and its
; pieces {bytes, letters padded}) said again in bits: qwords {2, how many, pieces, the bits of an index}, then each
; different piece once (gamma of its bytes + 1, its letters 8 bits each), then each relation: turned (1 bit), gamma
; of its pairs and of each middle's pieces, and its pieces as indexes. A piece the book says a hundred times is
; written once. EOUT and EOSZ are then the bits. Uses j1-j14.
eb_encode:
  jldi j1, 0
  jldi j2, DTAB
  jldi j3, 16
  jcall pl_new
  jldi j1, 0
  jld j11, j1, EOSZ             ; (a piece takes 16 bytes at least: an index of 8 for each fits)
  jcall room
  jldi j1, 0
  jst j13, j1, DLST
  jst j1, j1, DNP
  jld j9, j1, EOUT              ; each piece, once in the dictionary
  jldi j2, 16
  jadd j9, j9, j2
  jld j2, j1, ECNT
  jst j2, j1, DT2
  ebd_rel:
    jldi j1, 0
    jld j2, j1, DT2
    jjz j2, ebd_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, DT2
    jld j2, j1, DKIND           ; (compositions: {times, pieces})
    jjz j2, ebd_turn
    jld j2, j9, 8
    jst j2, j1, DT3
    jldi j2, 16
    jadd j9, j9, j2
    jjmp ebd_piece
  ebd_turn:
    jld j2, j9, 16
    jld j3, j9, 24
    jadd j2, j2, j3
    jst j2, j1, DT3
    jldi j2, 32
    jadd j9, j9, j2
    ebd_piece:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, ebd_rel
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jcall ed_key
      jldi j2, DTAB
      jcall pl_take
      jldi j1, 0
      jjz j6, ebd_old
      jld j2, j1, DNP
      jldi j3, 1
      jadd j3, j2, j3
      jst j3, j4, 8
      jst j3, j1, DNP
      jldi j3, 3
      jshl j2, j2, j3
      jld j3, j1, DLST
      jadd j2, j2, j3
      jst j9, j2, 0
    ebd_old:
      jcall ed_next
      jjmp ebd_piece
ebd_done:
  jldi j3, 1                    ; the bits of an index: the fewest that count every piece
  jld j4, j1, DNP
  ebd_ab:
    jldi j5, 1
    jshl j5, j5, j3
    jsub j5, j5, j4
    jldi j6, 63
    jsar j5, j5, j6
    jjz j5, ebd_abok
    jldi j5, 1
    jadd j3, j3, j5
    jjmp ebd_ab
ebd_abok:
  jst j3, j1, DAB
  jld j11, j1, EOSZ             ; the bits never take more than the qwords did
  jldi j2, 64
  jadd j11, j11, j2
  jst j11, j1, DSZ
  jcall room
  jldi j1, 0
  jst j13, j1, DOUT
  jld j2, j1, DSZ
  jadd j3, j13, j1
  jwhile j2
    jst j1, j3, 0
    jldi j4, 8
    jadd j3, j3, j4
    jsub j2, j2, j4
  jwend
  jldi j2, 2
  jst j2, j13, 0
  jld j2, j1, ECNT
  jst j2, j13, 8
  jld j2, j1, DNP
  jst j2, j13, 16
  jld j2, j1, DAB
  jst j2, j13, 24
  jldi j2, 32
  jadd j2, j13, j2
  jst j2, j1, SBB
  jst j1, j1, SBP
  jst j1, j1, DT2               ; the dictionary
  ebw_dict:
    jldi j1, 0
    jld j2, j1, DT2
    jld j3, j1, DNP
    jsub j3, j2, j3
    jjz j3, ebw_rels
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, DLST
    jadd j2, j2, j3
    jld j9, j2, 0
    jld j2, j9, 0
    jldi j3, 1
    jadd j2, j2, j3
    jcall sb_gamma
    jld j2, j9, 0
    jst j2, j1, DT3
    jldi j2, 8
    jadd j2, j9, j2
    jst j2, j1, DT1
    ebw_letter:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, ebw_lettered
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jld j4, j1, DT1
      jldb j2, j4, 0
      jadd j4, j4, j3
      jst j4, j1, DT1
      jldi j3, 8
      jcall sb_bits
      jjmp ebw_letter
    ebw_lettered:
    jld j2, j1, DT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, DT2
    jjmp ebw_dict
ebw_rels:
  jld j9, j1, EOUT              ; the relations
  jldi j2, 16
  jadd j9, j9, j2
  jld j2, j1, ECNT
  jst j2, j1, DT2
  ebw_rel:
    jldi j1, 0
    jld j2, j1, DT2
    jjz j2, ebw_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, DT2
    jld j2, j1, DKIND           ; (compositions: gamma of its times and of its pieces)
    jjz j2, ebw_turn
    jld j2, j9, 0
    jcall sb_gamma
    jld j2, j9, 8
    jcall sb_gamma
    jld j2, j9, 8
    jst j2, j1, DT3
    jldi j2, 16
    jadd j9, j9, j2
    jjmp ebw_piece
  ebw_turn:
    jld j2, j9, 0
    jjz j2, ebw_t
    jldi j2, 1
  ebw_t:
    jldi j3, 1
    jcall sb_bits
    jld j2, j9, 8
    jcall sb_gamma
    jld j2, j9, 16
    jcall sb_gamma
    jld j2, j9, 24
    jcall sb_gamma
    jld j2, j9, 16
    jld j3, j9, 24
    jadd j2, j2, j3
    jst j2, j1, DT3
    jldi j2, 32
    jadd j9, j9, j2
    ebw_piece:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, ebw_rel
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jcall ed_key
      jldi j2, DTAB
      jcall pl_find
      jldi j1, 0
      jld j2, j4, 8
      jldi j3, 1
      jsub j2, j2, j3
      jld j3, j1, DAB
      jcall sb_bits
      jcall ed_next
      jjmp ebw_piece
ebw_done:
  jld j2, j1, SBP
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, 3
  jshr j2, j2, j3
  jldi j3, 32
  jadd j2, j2, j3
  jst j2, j1, EOSZ
  jld j2, j1, DOUT
  jst j2, j1, EOUT
  jret

; The key of the piece at j9 ({its bytes, its letters}): the print of its letters and its bytes, never 0 -> j5. Uses
; j1, j3-j8.
ed_key:
  jldi j1, 0
  jld j4, j9, 0
  jld j5, j1, FNVO
  jld j6, j1, FNVP
  jldi j3, 8
  jadd j3, j9, j3
  jadd j7, j4, j1
  jwhile j7
    jldb j8, j3, 0
    jxor j5, j5, j8
    jmul j5, j5, j6
    jldi j8, 1
    jadd j3, j3, j8
    jsub j7, j7, j8
  jwend
  jxor j5, j5, j4
  jmul j5, j5, j6
  jjnz j5, edk_done
  jldi j5, 1
edk_done:
  jret

; j9 past the piece at it ({its bytes, its letters padded}). Uses j2, j3.
ed_next:
  jld j2, j9, 0
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, -8
  jand j2, j2, j3
  jldi j3, 8
  jadd j2, j2, j3
  jadd j9, j9, j2
  jret

; The j3 low bits of j2, the lowest first, onto the stream (SBB, SBP; its bytes start at 0). Uses j1-j8.
sb_bits:
  jldi j1, 0
  sbb_lap:
    jjz j3, sbb_done
    jld j4, j1, SBP
    jldi j5, 3
    jshr j5, j4, j5
    jld j6, j1, SBB
    jadd j5, j5, j6
    jldi j6, 7
    jand j6, j4, j6
    jldi j7, 1
    jand j7, j2, j7
    jshl j7, j7, j6
    jldb j8, j5, 0
    jor j8, j8, j7
    jstb j8, j5, 0
    jldi j7, 1
    jadd j4, j4, j7
    jst j4, j1, SBP
    jshr j2, j2, j7
    jsub j3, j3, j7
    jjmp sbb_lap
sbb_done:
  jret

; j2 (1 or more) in Elias gamma onto the stream: as many 0 as its bits after the first, a 1, those bits. Uses j1-j8.
sb_gamma:
  jldi j1, 0
  jst j2, j1, SGV
  jldi j3, 0
  jldi j4, 1
  sbg_n:
    jadd j5, j3, j4
    jshr j5, j2, j5
    jjz j5, sbg_have
    jadd j3, j3, j4
    jjmp sbg_n
sbg_have:
  jst j3, j1, SGN
  jldi j2, 0
  jcall sb_bits
  jldi j2, 1
  jldi j3, 1
  jcall sb_bits
  jld j2, j1, SGV
  jld j3, j1, SGN
  jjmp sb_bits

; j3 bits of the stream (SBB, SBP; SBL bytes), the lowest first -> j2. Past its end every bit is a 1, so a gamma
; ends there. Uses j1-j8.
sr_bits:
  jldi j1, 0
  jldi j2, 0
  jldi j7, 0
  srb_lap:
    jjz j3, srb_done
    jld j4, j1, SBP
    jldi j5, 3
    jshr j5, j4, j5
    jld j6, j1, SBL
    jsub j6, j5, j6
    jldi j8, 63
    jsar j6, j6, j8
    jldi j8, 1
    jjz j6, srb_bit
    jld j6, j1, SBB
    jadd j5, j5, j6
    jldb j8, j5, 0
    jldi j6, 7
    jand j6, j4, j6
    jshr j8, j8, j6
    jldi j6, 1
    jand j8, j8, j6
  srb_bit:
    jshl j8, j8, j7
    jor j2, j2, j8
    jldi j6, 1
    jadd j7, j7, j6
    jadd j4, j4, j6
    jst j4, j1, SBP
    jsub j3, j3, j6
    jjmp srb_lap
srb_done:
  jret

; An Elias gamma of the stream -> j2. Uses j1-j8.
sr_gamma:
  jldi j1, 0
  jst j1, j1, SGN
  srg_zero:
    jldi j3, 1
    jcall sr_bits
    jjnz j2, srg_one
    jld j3, j1, SGN
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, SGN
    jjmp srg_zero
srg_one:
  jld j3, j1, SGN
  jcall sr_bits
  jld j3, j1, SGN
  jldi j4, 1
  jshl j4, j4, j3
  jor j2, j2, j4
  jret

; j2 = 1 if the stream was read past its end (a file cut or not ours). Uses j1-j3.
edd_past:
  jldi j1, 0
  jld j2, j1, SBL
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, SBP
  jsub j2, j2, j3
  jldi j3, 63
  jshr j2, j2, j3
  jret

; The file read (SXR, SXN) as ll_file reads it: the first format as it is; the bits ({2, ...}, eb_encode) said again
; as qwords in a room of their own, SXR and SXN then that room. j2 = 1, 0 if it is neither or does not hold together
; (an index past the dictionary, a letter past its end). Uses j1-j14.
ed_decode:
  jldi j1, 0
  jld j9, j1, SXR
  jld j2, j9, 0
  jldi j3, 1
  jsub j3, j2, j3
  jjz j3, edd_yes
  jldi j3, 2
  jsub j3, j2, j3
  jjnz j3, edd_bad
  jld j2, j1, SXN
  jldi j3, 32
  jsub j2, j2, j3
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, edd_bad
  jst j2, j1, SBL
  jld j2, j9, 8
  jst j2, j1, DNR
  jld j2, j9, 16
  jst j2, j1, DNP
  jld j2, j9, 24
  jst j2, j1, DAB
  jldi j2, 32
  jadd j2, j9, j2
  jst j2, j1, SBB
  jst j1, j1, SBP
  jld j2, j1, SBL               ; every piece takes a bit at least, an index 63 bits at most
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, DNP
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, edd_bad
  jld j2, j1, DAB
  jldi j3, 64
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, edd_bad
  jld j11, j1, DNP              ; the dictionary: each piece {its bytes, its letters padded}, and where each is
  jldi j2, 4
  jshl j11, j11, j2
  jld j2, j1, SXN
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, DT1
  jld j11, j1, DNP
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, DLST
  jst j1, j1, DT2
  edd_dict:
    jldi j1, 0
    jld j2, j1, DT2
    jld j3, j1, DNP
    jsub j3, j2, j3
    jjz j3, edd_dicted
    jcall sr_gamma
    jldi j3, 1
    jsub j2, j2, j3
    jldi j3, 63
    jsar j3, j2, j3
    jjnz j3, edd_bad
    jld j9, j1, DT1
    jst j2, j9, 0
    jst j2, j1, DT3
    jld j3, j1, DT2
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, DLST
    jadd j3, j3, j4
    jst j9, j3, 0
    jldi j3, 3                  ; its letters, inside the stream
    jshl j3, j2, j3
    jld j4, j1, SBP
    jadd j3, j3, j4
    jld j4, j1, SBL
    jldi j5, 3
    jshl j4, j4, j5
    jsub j3, j4, j3
    jldi j5, 63
    jsar j3, j3, j5
    jjnz j3, edd_bad
    jldi j3, 8
    jadd j3, j9, j3
    jst j3, j1, DT4
    edd_letter:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, edd_lettered
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jldi j3, 8
      jcall sr_bits
      jld j4, j1, DT4
      jstb j2, j4, 0
      jldi j3, 1
      jadd j4, j4, j3
      jst j4, j1, DT4
      jjmp edd_letter
    edd_lettered:
    jld j9, j1, DT1
    jcall ed_next
    jst j9, j1, DT1
    jld j2, j1, DT2
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, DT2
    jjmp edd_dict
edd_dicted:
  jld j2, j1, SBP               ; the relations: walked once for their bytes, then written
  jst j2, j1, DSV
  jldi j2, 16
  jst j2, j1, DSZ
  jst j1, j1, DOUT
  jcall edd_walk
  jjz j2, edd_bad
  jld j11, j1, DSZ
  jcall room
  jldi j1, 0
  jst j13, j1, DOUT
  jldi j2, 1
  jst j2, j13, 0
  jld j2, j1, DNR
  jst j2, j13, 8
  jldi j2, 16
  jadd j2, j13, j2
  jst j2, j1, DPOS
  jcall edd_walk
  jld j2, j1, DOUT
  jst j2, j1, SXR
  jld j2, j1, DSZ
  jst j2, j1, SXN
edd_yes:
  jldi j1, 0
  jldi j2, 1
  jret
edd_bad:
  jldi j1, 0
  jldi j2, 0
  jret

; The relations of the stream (from DSV, DNR of them): their bytes added to DSZ (DOUT 0), or written at DPOS, each
; {turned, pairs, how many pieces each} and its pieces copied from the dictionary. j2 = 1, 0 if one does not hold
; together. Uses j1-j9.
edd_walk:
  jldi j1, 0
  jld j2, j1, DSV
  jst j2, j1, SBP
  jld j2, j1, DNR
  jst j2, j1, DT2
  edw_rel:
    jldi j1, 0
    jld j2, j1, DT2
    jjz j2, edw_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, DT2
    jld j2, j1, DKIND           ; (compositions: {times, pieces})
    jjz j2, edw_turn
    jcall sr_gamma
    jst j2, j1, DR0
    jcall sr_gamma
    jst j2, j1, DR1
    jst j2, j1, DT3
    jcall edd_past
    jjnz j2, edw_bad
    jld j2, j1, DOUT
    jjz j2, edw_count1
    jld j4, j1, DPOS
    jld j2, j1, DR0
    jst j2, j4, 0
    jld j2, j1, DR1
    jst j2, j4, 8
    jldi j2, 16
    jadd j4, j4, j2
    jst j4, j1, DPOS
    jjmp edw_piece
  edw_count1:
    jld j2, j1, DSZ
    jldi j3, 16
    jadd j2, j2, j3
    jst j2, j1, DSZ
    jjmp edw_piece
  edw_turn:
    jldi j3, 1
    jcall sr_bits
    jst j2, j1, DR0
    jcall sr_gamma
    jst j2, j1, DR1
    jcall sr_gamma
    jst j2, j1, DR2
    jcall sr_gamma
    jst j2, j1, DR3
    jcall edd_past
    jjnz j2, edw_bad
    jld j2, j1, DR2
    jld j3, j1, DR3
    jadd j2, j2, j3
    jst j2, j1, DT3
    jld j2, j1, DOUT
    jjz j2, edw_count
    jld j4, j1, DPOS
    jld j2, j1, DR0
    jst j2, j4, 0
    jld j2, j1, DR1
    jst j2, j4, 8
    jld j2, j1, DR2
    jst j2, j4, 16
    jld j2, j1, DR3
    jst j2, j4, 24
    jldi j2, 32
    jadd j4, j4, j2
    jst j4, j1, DPOS
    jjmp edw_piece
  edw_count:
    jld j2, j1, DSZ
    jldi j3, 32
    jadd j2, j2, j3
    jst j2, j1, DSZ
    edw_piece:
      jldi j1, 0
      jld j2, j1, DT3
      jjz j2, edw_rel
      jldi j3, 1
      jsub j2, j2, j3
      jst j2, j1, DT3
      jld j3, j1, DAB
      jcall sr_bits
      jld j4, j1, DNP
      jsub j3, j2, j4
      jldi j4, 63
      jsar j3, j3, j4
      jjz j3, edw_bad
      jldi j3, 3
      jshl j2, j2, j3
      jld j3, j1, DLST
      jadd j2, j2, j3
      jld j9, j2, 0
      jcall edd_past
      jjnz j2, edw_bad
      jld j2, j9, 0
      jldi j3, 7
      jadd j2, j2, j3
      jldi j3, -8
      jand j2, j2, j3
      jldi j3, 8
      jadd j2, j2, j3
      jld j3, j1, DOUT
      jjz j3, edw_add
      jld j4, j1, DPOS
      jwhile j2
        jld j5, j9, 0
        jst j5, j4, 0
        jldi j5, 8
        jadd j9, j9, j5
        jadd j4, j4, j5
        jsub j2, j2, j5
      jwend
      jst j4, j1, DPOS
      jjmp edw_piece
    edw_add:
      jld j3, j1, DSZ
      jadd j3, j3, j2
      jst j3, j1, DSZ
      jjmp edw_piece
edw_done:
  jldi j1, 0
  jldi j2, 1
  jret
edw_bad:
  jldi j1, 0
  jldi j2, 0
  jret
; The library's turn of the fact's skeleton (WSK): deduced as with TBEST, over the pairs every book proved. The core's
; side and the answer as qm_turned finds them; the fit over the turn's pieces (MB1, from lib_turn). Uses j1-j14.
qt_lib:
  jldi j1, 0
  jld j2, j1, WA
  jld j3, j1, QCW
  jsub j2, j2, j3
  jldi j4, 0
  jjnz j2, qtl_side
  jldi j4, 1
qtl_side:
  jst j4, j1, QSIDE
  jld j2, j1, WB
  jjz j4, qtl_oth
  jjmp qtl_oth2
qtl_oth:
  jld j2, j1, WA
qtl_oth2:
  jst j2, j1, QOTH
  jld j2, j1, LPB
  jcall q_fit_mb
  jjz j2, qtl_done
  jcall q_best
  jjz j2, qtl_done
  jcall q_new
  jjz j2, qtl_done
  jld j2, j1, WB                ; the sentence it deduced: the fact turned by the library's turn
  jcall putword
  jldi j2, 32
  jcall putch
  jcall put_lpcp
  jld j2, j1, WA
  jcall putword
  jldi j1, S_DEDQ
  jcall puts
  jldi j2, 10
  jcall putch
  jjmp flush
qtl_done:
  jldi j1, 0
  jret

; The middle of skeleton j12 as words of a sentence, each followed by a space. Uses j1-j11.
put_plain:
  jldi j1, 0
  jld j9, j12, 16
  jld j10, j12, 24
  jldi j11, 1
  jwhile j10
    jldi j1, 0
    jadd j2, j9, j11
    jldi j3, 3
    jshl j2, j2, j3
    jld j3, j1, ROOMT
    jadd j2, j2, j3
    jld j2, j2, 0
    jst j2, j1, PMT
    jcall n_flags
    jldi j4, 1
    jand j3, j3, j4
    jjnz j3, pp_skip
    jld j2, j1, PMT
    jcall put_glue
  pp_skip:
    jldi j1, 0
    jldi j2, 1
    jadd j11, j11, j2
    jsub j10, j10, j2
  jwend
  jret

; Word j2 in a sentence, a space after it; a mark goes against the word before it ("jacob, hijo de"). Uses j1-j8.
put_glue:
  jldi j1, 0
  jst j2, j1, QWL
  jcall w_mark
  jldi j1, 0
  jjz j3, pg_put
  jld j3, j1, POS
  jjz j3, pg_put
  jldi j4, 1
  jsub j3, j3, j4
  jldb j4, j3, TEXT
  jldi j5, 32
  jsub j4, j4, j5
  jjnz j4, pg_put
  jst j3, j1, POS
pg_put:
  jld j2, j1, QWL
  jcall putword
  jldi j2, 32
  jjmp putch

; The turn's pieces (LPC, LPB of them) as words of a sentence, each followed by a space. Uses j1-j9.
put_lpcp:
  jldi j1, 0
  jst j1, j1, LT4
  plp_lap:
    jldi j1, 0
    jld j2, j1, LT4
    jld j3, j1, LPB
    jsub j3, j2, j3
    jjz j3, plp_done
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, LPC
    jcall put_glue
  plp_next:
    jldi j1, 0
    jld j2, j1, LT4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LT4
    jjmp plp_lap
plp_done:
  jret

; j2 = 1 if the library proved a turn of the skeleton WSK: its pieces (as this reading's words) at MB1 and LPC, LPB of
; them, its pairs at LPP. Uses j1-j14.
lib_turn:
  jldi j1, 0
  jld j2, j1, LBEST
  jjz j2, lt_no
  jld j12, j1, WSK              ; the skeleton's print, by its pieces' letters
  jldi j13, LPC
  jcall m_collect
  jldi j1, 0
  jst j2, j1, LT1
  jld j5, j1, FNVO
  jst j5, j1, LT2
  jst j1, j1, LT3
  lt_print:
    jldi j1, 0
    jld j2, j1, LT3
    jld j3, j1, LT1
    jsub j3, j2, j3
    jjz j3, lt_printed
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, LPC
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j4, j3, 16
    jld j3, j3, 8
    jld j6, j1, ROOMA
    jadd j3, j3, j6
    jcall lp_letters
    jldi j1, 0
    jld j2, j1, LT3
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LT3
    jjmp lt_print
lt_printed:
  jld j5, j1, LT2
  jjnz j5, lt_key
  jldi j5, 1
lt_key:
  jldi j2, LBEST
  jcall pl_find
  jldi j1, 0
  jld j2, j4, 0
  jjz j2, lt_no
  jld j2, j4, 8                 ; proved twice at least
  jst j2, j1, LPP
  jldi j3, 2
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, lt_no
  jld j9, j4, 16                ; its pieces: as words of this reading
  jld j2, j4, 24
  jst j2, j1, LPB
  jld j2, j1, PASS
  jst j2, j1, LT4
  jldi j2, 2
  jst j2, j1, PASS
  jst j1, j1, LT3
  lt_piece:
    jldi j1, 0
    jld j2, j1, LT3
    jld j3, j1, LPB
    jsub j3, j2, j3
    jjz j3, lt_pieces
    jst j9, j1, LT1
    jld j4, j9, 0
    jst j4, j1, WLEN
    jst j4, j1, WBN
    jcall wb_need
    jldi j5, 8
    jadd j5, j9, j5
    jldi j6, 0
    lt_letter:
      jsub j7, j6, j4
      jjz j7, lt_letters
      jadd j7, j5, j6
      jldb j7, j7, 0
      jld j3, j1, WBP
      jadd j3, j3, j6
      jstb j7, j3, 0
      jldi j7, 1
      jadd j6, j6, j7
      jjmp lt_letter
    lt_letters:
    jcall word_id
    jldi j1, 0
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, lt_unknown         ; (a word this reading never read: no fit is possible)
    jld j3, j1, LT3
    jldi j4, 3
    jshl j3, j3, j4
    jst j2, j3, LPC
    jst j2, j3, MB1
    jld j9, j1, LT1
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jld j2, j1, LT3
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LT3
    jjmp lt_piece
lt_pieces:
  jld j2, j1, LT4
  jst j2, j1, PASS
  jldi j2, 1
  jret
lt_unknown:
  jld j2, j1, LT4
  jst j2, j1, PASS
lt_no:
  jldi j1, 0
  jldi j2, 0
  jret

; The print LT2 goes on with j4 letters at j3, and a space after them (a middle's pieces, one after the other). Uses
; j1-j7.
lp_letters:
  jldi j1, 0
  jld j2, j1, LT2
  jld j6, j1, FNVP
  jwhile j4
    jldb j5, j3, 0
    jxor j2, j2, j5
    jmul j2, j2, j6
    jldi j5, 1
    jadd j3, j3, j5
    jsub j4, j4, j5
  jwend
  jldi j5, 32
  jxor j2, j2, j5
  jmul j2, j2, j6
  jst j2, j1, LT2
  jret

; The turns every book proved (the files "tablero/esqueletos...", sentido eating), summed by the letters of both
; skeletons, in both directions; then each skeleton's best turn (the most pairs). None: LBEST stays 0. Uses j1-j14.
lib_load:
  jldi j1, 0
  jst j1, j1, LBEST
  jst j1, j1, LNR
  jldi j2, 4096                 ; its folder's labels, all of them (while one more could be cut, twice the room)
  jst j2, j1, LSTC
  ll_list:
    jld j11, j1, LSTC
    jcall room
    jldi j1, 0
    jst j13, j1, LSTR
    jldi j10, 14
    jadd j11, j13, j1
    jld j12, j1, LSTC
    jcall ask
    jldi j1, 0
    jst j13, j1, LSTN
    jldi j2, 63
    jsar j2, j13, j2
    jjnz j2, ll_done
    jld j9, j1, LSTR
    jadd j10, j13, j1
    jwhile j10
      jld j2, j9, 0
      jldi j3, 7
      jadd j2, j2, j3
      jldi j3, -8
      jand j2, j2, j3
      jldi j3, 8
      jadd j2, j2, j3
      jadd j9, j9, j2
      jldi j2, 1
      jsub j10, j10, j2
    jwend
    jld j3, j1, LSTR
    jsub j9, j9, j3
    jld j3, j1, LSTC
    jsub j3, j3, j9
    jldi j4, 4104
    jsub j3, j3, j4
    jldi j4, 63
    jsar j3, j3, j4
    jjz j3, ll_listed
    jld j2, j1, LSTC
    jadd j2, j2, j2
    jst j2, j1, LSTC
    jjmp ll_list
ll_listed:
  jldi j2, LREL
  jldi j3, 40
  jcall pl_new
  jldi j1, 0
  jld j9, j1, LSTR
  jst j9, j1, LP
  jld j2, j1, LSTN
  jst j2, j1, LI
  ll_label:
    jldi j1, 0
    jld j2, j1, LI
    jjz j2, ll_best
    jld j9, j1, LP
    jld j2, j9, 0               ; "tablero/esqueletos" and more?
    jldi j3, 19
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, ll_next
    jldi j3, 8                  ; (or "tablero/preguntas-": what the books' questions taught; "tablero/enganches-":
    jadd j3, j9, j3             ; their compositions) -> QLC 0 turns, 1 questions, 2 compositions
    jldi j4, S_PRQ
    jldi j5, 1
    jst j5, j1, QLC
    jldb j5, j3, 8
    jldi j6, 112
    jsub j5, j5, j6
    jjz j5, ll_kind
    jldi j4, S_ENG
    jldi j5, 2
    jst j5, j1, QLC
    jldb j5, j3, 9
    jldi j6, 110
    jsub j5, j5, j6
    jjz j5, ll_kind
    jldi j4, S_ESQ
    jst j1, j1, QLC
    jldb j5, j3, 8              ; ("tablero/funciones-": the dictionary of instructions, 3)
    jldi j6, 102
    jsub j5, j5, j6
    jjnz j5, ll_kind
    jldi j4, S_FUN
    jldi j5, 3
    jst j5, j1, QLC
  ll_kind:
    jldi j5, 18
    ll_cmp:
      jldb j6, j3, 0
      jldb j7, j4, 0
      jsub j6, j6, j7
      jjnz j6, ll_next
      jldi j6, 1
      jadd j3, j3, j6
      jadd j4, j4, j6
      jsub j5, j5, j6
      jjnz j5, ll_cmp
    jldi j11, 8
    jadd j11, j9, j11
    jld j12, j9, 0
    jcall sx_read
    jldi j1, 0
    jld j2, j1, SXN
    jldi j3, 16
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, ll_next
    jld j2, j1, QLC
    jjz j2, ll_turns
    jldi j3, 3
    jsub j3, j2, j3
    jjnz j3, ll_notfun
    jcall pf_file
    jjmp ll_next
  ll_notfun:
    jldi j3, 1
    jsub j2, j2, j3
    jjnz j2, ll_eng
    jcall pq_file
    jjmp ll_next
  ll_eng:
    jldi j2, 1
    jst j2, j1, DKIND
    jcall ed_decode
    jjz j2, ll_next
    jcall pe_file
    jjmp ll_next
  ll_turns:
    jst j1, j1, DKIND
    jcall ed_decode
    jjz j2, ll_next
    jcall ll_file
  ll_next:
    jldi j1, 0
    jld j9, j1, LP
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jst j9, j1, LP
    jld j2, j1, LI
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, LI
    jjmp ll_label
ll_best:
  jld j2, j1, LNR
  jjz j2, ll_done
  jldi j2, LBEST
  jldi j3, 32
  jcall pl_new
  jldi j1, 0
  jld j9, j1, LREL              ; each relation: the best of its skeleton
  jld j10, j1, LREL + 8
  jldi j2, 1
  jadd j10, j10, j2
  ll_rel:
    jjz j10, ll_done
    jld j2, j9, 0
    jjz j2, ll_rnext
    jst j9, j1, LT1
    jst j10, j1, LT3
    jld j5, j9, 32
    jldi j2, LBEST
    jcall pl_take
    jldi j1, 0
    jld j9, j1, LT1
    jld j10, j1, LT3
    jld j2, j9, 8
    jld j3, j4, 8
    jsub j3, j3, j2
    jldi j5, 63
    jsar j3, j3, j5
    jjz j3, ll_rnext
    jst j2, j4, 8
    jld j2, j9, 16
    jst j2, j4, 16
    jld j2, j9, 24
    jst j2, j4, 24
  ll_rnext:
    jld j2, j1, LREL + 24
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp ll_rel
ll_done:
  jldi j1, 0
  jret

; One file read (SXR, SXN bytes): each turned relation, both ways, added to LREL by the prints of its two skeletons
; (their pieces' letters). The eating's variables are free here: ET1 turned, ET2 pairs, EI and EN2 the pieces of each,
; EOUT and EPOS where they start, EOSZ and ECNT their prints, EK the relation walked. Uses j1-j14.
ll_file:
  jldi j1, 0
  jld j9, j1, SXR
  jld j2, j9, 8
  jst j2, j1, LT4
  jldi j2, 16
  jadd j9, j9, j2
  jst j9, j1, EK
  lf_rel:
    jldi j1, 0
    jld j2, j1, LT4
    jjz j2, lf_done
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, LT4
    jld j9, j1, EK
    jld j2, j9, 0
    jst j2, j1, ET1
    jld j2, j9, 8
    jst j2, j1, ET2
    jld j2, j9, 16
    jst j2, j1, EI
    jld j2, j9, 24
    jst j2, j1, EN2
    jldi j2, 32
    jadd j9, j9, j2
    jst j9, j1, EOUT
    jld j10, j1, EI
    jcall lf_walk
    jldi j1, 0
    jld j2, j1, LT2
    jst j2, j1, EOSZ
    jst j9, j1, EPOS
    jld j10, j1, EN2
    jcall lf_walk
    jldi j1, 0
    jld j2, j1, LT2
    jst j2, j1, ECNT
    jst j9, j1, EK
    jld j2, j1, ET1               ; only a turn
    jjz j2, lf_rel
    jld j2, j1, EOSZ              ; one way: from the first to the other
    jld j3, j1, ECNT
    jld j5, j1, EPOS
    jld j6, j1, EN2
    jcall lf_add
    jldi j1, 0
    jld j2, j1, ECNT              ; and back
    jld j3, j1, EOSZ
    jld j5, j1, EOUT
    jld j6, j1, EI
    jcall lf_add
    jldi j1, 0
    jld j2, j1, LNR
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, LNR
    jjmp lf_rel
lf_done:
  jldi j1, 0
  jret

; The pieces from j9 (j10 of them, each {its bytes, its letters padded}): their print -> LT2, and j9 past them.
; Uses j1-j10.
lf_walk:
  jldi j1, 0
  jld j2, j1, FNVO
  jst j2, j1, LT2
  lfw_lap:
    jjz j10, lfw_done
    jst j9, j1, LT1
    jst j10, j1, LT3
    jld j4, j9, 0
    jldi j3, 8
    jadd j3, j9, j3
    jcall lp_letters
    jldi j1, 0
    jld j9, j1, LT1
    jld j10, j1, LT3
    jld j2, j9, 0
    jldi j3, 7
    jadd j2, j2, j3
    jldi j3, -8
    jand j2, j2, j3
    jldi j3, 8
    jadd j2, j2, j3
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
    jjmp lfw_lap
lfw_done:
  jret

; One way of a turn: from the skeleton of print j2 to the one of print j3, whose pieces are at j5 (j6 of them): its
; pairs (ET2) added. Uses j1-j14.
lf_add:
  jldi j1, 0
  jst j2, j1, LT1
  jst j5, j1, LT3
  jst j6, j1, LPB
  jld j4, j1, FNVP
  jmul j5, j2, j4
  jxor j5, j5, j3
  jmul j5, j5, j4
  jjnz j5, lfa_key
  jldi j5, 1
lfa_key:
  jldi j2, LREL
  jcall pl_take
  jldi j1, 0
  jld j2, j4, 8
  jld j3, j1, ET2
  jadd j2, j2, j3
  jst j2, j4, 8
  jld j2, j1, LT3
  jst j2, j4, 16
  jld j2, j1, LPB
  jst j2, j4, 24
  jld j2, j1, LT1
  jjnz j2, lfa_print
  jldi j2, 1
lfa_print:
  jst j2, j4, 32
  jret

; The file of the label at j11 (j12 bytes), read whole into a room that grows -> SXR, SXN (-1 if it cannot be
; opened). Uses j1-j14.
sx_read:
  jldi j1, 0
  jldi j10, 4
  jcall ask
  jldi j1, 0
  jldi j2, -1
  jst j2, j1, SXN
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, sxr_done
  jst j13, j1, SXH
  jst j1, j1, SXN
  jldi j11, 4096
  jst j11, j1, SXC
  jcall room
  jldi j1, 0
  jst j13, j1, SXR
sxr_read:
  jld j10, j1, SXH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, SXR
  jld j2, j1, SXN
  jadd j11, j11, j2
  jld j12, j1, SXC
  jsub j12, j12, j2
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, sxr_close
  jld j2, j1, SXN
  jadd j2, j2, j13
  jst j2, j1, SXN
  jld j3, j1, SXC
  jsub j3, j3, j2
  jjnz j3, sxr_read
  jld j11, j1, SXC
  jadd j11, j11, j11
  jcall room
  jldi j1, 0
  jld j4, j1, SXR
  jadd j5, j13, j1
  jld j6, j1, SXN
  jwhile j6
    jld j7, j4, 0
    jst j7, j5, 0
    jldi j7, 8
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jst j13, j1, SXR
  jld j2, j1, SXC
  jadd j2, j2, j2
  jst j2, j1, SXC
  jjmp sxr_read
sxr_close:
  jld j10, j1, SXH
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
sxr_done:
  jldi j1, 0
  jret
; A question (QQS to QQE in QBUF): every core in it (a word the house left as furniture, as the cores of the facts)
; asked the facts it is in, and of those only the ones whose relation fits the question: the middle of the fact's
; skeleton is said in the question right next to the core, on the side the fact has it (its marks aside). The answer
; is the fact's other core, if the question does not say it already: said so by the book (4), or deduced from a
; skeleton that turns (5), with its why. Nothing tells it which word asks: the question's own furniture and the
; relations the book proved decide. Uses j1-j14.
question_one:
  jldi j1, S_ASKQ
  jcall puts
  jld j9, j1, QQS
  qo_put:
    jldi j1, 0
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qo_said
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qo_skip
    jst j9, j1, QP
    jcall putword
    jldi j2, 32
    jcall putch
    jldi j1, 0
    jld j9, j1, QP
  qo_skip:
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qo_put
  qo_said:
  jldi j2, 10
  jcall putch
  jldi j1, 0
  jst j1, j1, QNA
  jst j1, j1, QBEST
  jst j1, j1, QPASS
qo_pass:
  jldi j2, TSN                  ; (each answer once)
  jldi j3, 8
  jcall pl_new
  jldi j1, 0
  jld j9, j1, QQS
  qo_core:
    jldi j1, 0
    jst j9, j1, QP
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qo_cores
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jldi j3, 1
    jsub j3, j2, j3
    jldi j4, 63
    jsar j3, j3, j4
    jjnz j3, qo_ncore
    jst j2, j1, QCW
    jcall g_core
    jjz j3, qo_ncore
    jldi j1, 0                  ; an arrow is no furniture: it points at what is asked
    jld j2, j1, QCW
    jcall is_arrow
    jjnz j2, qo_ncore
    jldi j1, 0
    jldi j2, 4
    jst j2, j1, GMODE
    jcall gather
    jldi j1, 0
    jldi j2, 5
    jst j2, j1, GMODE
    jcall gather
  qo_ncore:
    jldi j1, 0
    jld j9, j1, QP
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qo_core
  qo_cores:
  jld j2, j1, QPASS             ; the relation that fits it best is the one that explains the most of it (Capitan:
  jjnz j2, qo_said2             ; "the logical relation that fits the question"): first how much that is, then those
  jldi j2, 1
  jst j2, j1, QPASS
  jjmp qo_pass
qo_said2:
  jcall q_subject               ; a question about one subject: its whole thread
  jldi j1, 0
  jld j2, j1, QNA
  jjnz j2, qo_done
  jcall q_struct                ; nothing fits its furniture: is it asking about a structure?
  jldi j1, 0
  jld j2, j1, QNA
  jjnz j2, qo_done
  jcall q_about                 ; no: what the book says the most of its furniture
  jldi j1, 0
  jld j2, j1, QNA
  jjnz j2, qo_done
  jldi j1, S_NOFIT
  jcall puts
qo_done:
  jcall dia_write
  jjmp want_write

; The window WA WK WB met by a core of a question (GMODE 4: what the book says; 5: what it deduces). Uses j1-j14.
q_meet:
  jcall fm_two
  jldi j1, 0
  jjz j6, qm_done
  jld j2, j1, GMODE
  jldi j3, 4
  jsub j3, j2, j3
  jjnz j3, qm_turned
  jld j12, j1, WSK              ; said: the core at its end of the fact
  jld j2, j1, WB
  jld j3, j1, QCW
  jsub j2, j2, j3
  jldi j4, 0
  jjnz j2, qm_side
  jldi j4, 1
qm_side:
  jst j4, j1, QSIDE
  jld j2, j1, WA
  jjz j4, qm_oth
  jjmp qm_oth2
qm_oth:
  jld j2, j1, WB
qm_oth2:
  jst j2, j1, QOTH
  jcall q_fit
  jjz j2, qm_done
  jcall q_best
  jjz j2, qm_done
  jcall q_new
  jjz j2, qm_done
  jld j2, j1, WA                ; the answer it thought, said as a sentence: the fact
  jcall putword
  jldi j2, 32
  jcall putch
  jld j12, j1, WSK
  jcall put_plain
  jld j2, j1, WB
  jcall putword
  jldi j1, 0                    ; and it thinks on from what it just learned, the answer: its thought goes on in the
  jldi j2, 1                    ; same sentence when the sentence ends on it (LINEO), as the books go on from a word
  jst j2, j1, LINEO             ; a fact ended on; when not, the sentence closes here
  jld j2, j1, QOTH
  jst j2, j1, THX
  jld j3, j1, WB
  jsub j3, j2, j3
  jjz j3, qm_think
  jst j1, j1, LINEO
  jldi j2, 10
  jcall putch
qm_think:
  jcall flush
  jjmp think
qm_turned:
  jcall lib_turn                ; the library's turn first: proved over every book, not over a piece
  jjnz j2, qt_lib
  jldi j1, 0
  jld j2, j1, WSK               ; deduced: the skeleton that turns, its fact turned (WB «TBEST» WA)
  jst j2, j1, FE
  jldi j12, 1
  jcall best_partner
  jldi j1, 0
  jld j2, j1, TBEST
  jjz j2, qm_done
  jcall find_mid
  jldi j1, 0
  jld j2, j1, WA                ; the core's side in the turned fact
  jld j3, j1, QCW
  jsub j2, j2, j3
  jldi j4, 0
  jjnz j2, qt_side
  jldi j4, 1
qt_side:
  jst j4, j1, QSIDE
  jld j2, j1, WB
  jjz j4, qt_oth
  jjmp qt_oth2
qt_oth:
  jld j2, j1, WA
qt_oth2:
  jst j2, j1, QOTH
  jcall q_fit
  jjz j2, qm_done
  jcall q_best
  jjz j2, qm_done
  jcall q_new
  jjz j2, qm_done
  jld j2, j1, WB                ; the sentence it deduced: the fact turned
  jcall putword
  jldi j2, 32
  jcall putch
  jld j2, j1, TBEST
  jcall find_mid
  jcall put_plain
  jld j2, j1, WA
  jcall putword
  jldi j1, S_DEDQ
  jcall puts
  jldi j2, 10
  jcall putch
  jjmp flush
qm_done:
  jret

; j2 = 1 if the fact's relation fits the question as instructions (Capitan, 2026-11-07: "the words are hidden
; instructions: solve the order with logic"). Each word of the middle says what it hooks to, and the order is not
; asked, the hooks are: every word of the middle (its marks aside) is in the question; the one next to the core in the
; fact is next to the core in the question, on either side; and the one next to the other core has, on a side, a free
; place: an arrow, the question's edge, or a piece that is no furniture. A middle with an arrow in it answers nothing:
; it says the question again. QCV: the core and the middle's words. Uses j1-j14.
q_fit:
  jldi j13, MB1
  jcall m_collect
q_fit_mb:                       ; (a middle's pieces already at MB1, j2 of them)
  jldi j1, 0                    ; the middle's words, the marks out (in place)
  jst j2, j1, FI3
  jst j1, j1, FI2
  jst j1, j1, FI4
  qf_words:
    jldi j1, 0
    jld j2, j1, FI4
    jld j3, j1, FI3
    jsub j3, j2, j3
    jjz j3, qf_counted
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, MB1
    jst j2, j1, QWL
    jcall w_mark
    jldi j1, 0
    jjnz j3, qf_wnext
    jld j2, j1, QWL
    jcall is_arrow
    jjnz j2, qf_no
    jld j2, j1, FI2
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, QWL
    jst j4, j3, MB1
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI2
  qf_wnext:
    jld j2, j1, FI4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI4
    jjmp qf_words
qf_counted:
  jld j2, j1, FI2
  jjz j2, qf_no                 ; (marks alone hook nothing)
  jldi j3, 1
  jadd j3, j2, j3
  jst j3, j1, QCV
  jst j1, j1, FI4               ; every word of the middle in the question
  qf_each:
    jldi j1, 0
    jld j2, j1, FI4
    jld j3, j1, FI2
    jsub j3, j2, j3
    jjz j3, qf_hooks
    jldi j3, 3
    jshl j3, j2, j3
    jld j2, j3, MB1
    jcall q_has
    jjz j2, qf_no
    jldi j1, 0
    jld j2, j1, FI4
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, FI4
    jjmp qf_each
qf_hooks:
  jld j2, j1, FI2               ; the words next to each core in the fact: the core's on its side, the other's opposite
  jldi j3, 1
  jsub j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jld j4, j2, MB1               ; (the last)
  jld j5, j1, MB1               ; (the first)
  jld j6, j1, QSIDE
  jjz j6, qf_left
  jst j4, j1, QBC               ; the core on the right: the last word hooks to it, the first to the other
  jst j5, j1, QBA
  jjmp qf_core
qf_left:
  jst j5, j1, QBC
  jst j4, j1, QBA
qf_core:
  jld j2, j1, QP                ; the core's hook: next to it in the question, either side
  jldi j3, -1
  jcall q_nb
  jjz j2, qf_cright
  jldi j1, 0
  jld j3, j1, QBC
  jsub j2, j2, j3
  jldi j3, 1                    ; (before the core)
  jst j3, j1, QLK
  jjz j2, qf_learned
qf_cright:
  jldi j1, 0
  jld j2, j1, QP
  jldi j3, 1
  jcall q_nb
  jjz j2, qf_no
  jldi j1, 0
  jld j3, j1, QBC
  jsub j2, j2, j3
  jjnz j2, qf_no
  jst j1, j1, QLK
qf_learned:
  jcall ql_decide               ; and the side the book's own questions taught for that hook there
  jjz j2, qf_no
qf_other:
  jldi j1, 0                    ; the other's hook: a place of it in the question with a free side
  jld j2, j1, QQS
  jst j2, j1, QPOS
  qf_place:
    jldi j1, 0
    jld j9, j1, QPOS
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qf_no
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jld j3, j1, QBA
    jsub j2, j2, j3
    jjnz j2, qf_pnext
    jld j3, j1, QP
    jsub j3, j9, j3
    jjz j3, qf_pnext
    jldi j2, -1
    jst j2, j1, QDIR
    qf_side:
      jldi j1, 0
      jld j2, j1, QPOS
      jld j3, j1, QDIR
      jcall q_nb
      jldi j1, 0
      jjz j2, qf_yes            ; (the edge: free)
      jst j2, j1, QNB
      jld j3, j1, QP            ; (the core's own place is not free)
      jld j4, j1, QNBP
      jsub j3, j3, j4
      jjz j3, qf_snext
      jld j2, j1, QNB
      jcall is_arrow
      jjnz j2, qf_yes
      jldi j1, 0
      jld j2, j1, QNB
      jcall g_core
      jjz j3, qf_yes            ; (no furniture: free)
    qf_snext:
      jldi j1, 0
      jld j2, j1, QDIR
      jldi j3, 1
      jsub j3, j2, j3
      jjz j3, qf_pnext
      jldi j2, 1
      jst j2, j1, QDIR
      jjmp qf_side
  qf_pnext:
    jldi j1, 0
    jld j9, j1, QPOS
    jldi j2, 1
    jadd j9, j9, j2
    jst j9, j1, QPOS
    jjmp qf_place
qf_yes:
  jldi j1, 0
  jldi j2, 1
  jret
qf_no:
  jldi j1, 0
  jldi j2, 0
  jret

; From the question's place j2, the nearest piece on side j3 (-1 before, 1 after) that is a word (no mark, no hole)
; -> j2 its word (its place at QNBP), 0 at the question's edge. Uses j1-j8.
q_nb:
  jldi j1, 0
  jst j3, j1, QNBD
  qnb_lap:
    jldi j1, 0
    jld j3, j1, QNBD
    jadd j2, j2, j3
    jld j4, j1, QQS
    jsub j4, j2, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, qnb_edge
    jld j4, j1, QQE
    jsub j4, j2, j4
    jjz j4, qnb_edge
    jst j2, j1, QNBP
    jldi j3, 3
    jshl j3, j2, j3
    jst j2, j1, QBT
    jld j2, j1, QBP
    jadd j3, j3, j2
    jld j3, j3, 0
    jld j2, j1, QBT
    jldi j4, 1
    jsub j4, j3, j4
    jldi j5, 63
    jsar j4, j4, j5
    jjnz j4, qnb_skip
    jst j3, j1, QNBW
    jadd j2, j3, j1
    jcall w_mark
    jldi j1, 0
    jjnz j3, qnb_skip2
    jld j2, j1, QNBW
    jret
  qnb_skip2:
    jld j2, j1, QNBP
    jjmp qnb_lap
  qnb_skip:
    jld j2, j1, QNBP
    jjmp qnb_lap
qnb_edge:
  jldi j1, 0
  jldi j2, 0
  jret

; j2 = 1 if the word j2 is said in the question. Uses j1-j5.
q_has:
  jldi j1, 0
  jld j3, j1, QQS
  qh_lap:
    jld j4, j1, QQE
    jsub j4, j3, j4
    jjz j4, qh_no
    jldi j4, 3
    jshl j4, j3, j4
    jst j2, j1, QBT
    jld j2, j1, QBP
    jadd j4, j4, j2
    jld j4, j4, 0
    jld j2, j1, QBT
    jsub j4, j4, j2
    jjz j4, qh_yes
    jldi j4, 1
    jadd j3, j3, j4
    jjmp qh_lap
qh_yes:
  jldi j2, 1
  jret
qh_no:
  jldi j2, 0
  jret

; j2 = 1 if the fit just found (QCV) is to be said: in the first pass it only raises the most (QBEST) and is not said;
; in the second, it is said when it explains that much. Uses j1-j3.
q_best:
  jldi j1, 0                    ; (an answer the question says already is no answer: it cannot be the best either)
  jld j2, j1, QOTH
  jcall q_has
  jldi j1, 0
  jjnz j2, qb_no
  jld j2, j1, QCV
  jld j3, j1, QPASS
  jjnz j3, qb_say
  jld j3, j1, QBEST
  jsub j3, j3, j2
  jldi j1, 63
  jsar j3, j3, j1
  jldi j1, 0
  jjz j3, qb_no
  jst j2, j1, QBEST
qb_no:
  jldi j2, 0
  jret
qb_say:
  jld j3, j1, QBEST
  jsub j2, j2, j3
  jldi j3, 1
  jjz j2, qb_yes
  jldi j3, 0
qb_yes:
  jadd j2, j3, j1
  jret

; j2 = 1 if QOTH is a new answer: not a word of the question, and not given yet (its line begun then). Uses
; j1-j14.
q_new:
  jldi j1, 0
  jld j9, j1, QQS
  qn_lap:
    jld j2, j1, QQE
    jsub j2, j9, j2
    jjz j2, qn_new
    jldi j2, 3
    jshl j2, j9, j2
    jst j3, j1, QBT
    jld j3, j1, QBP
    jadd j2, j2, j3
    jld j2, j2, 0
    jld j3, j1, QBT
    jld j3, j1, QOTH
    jsub j2, j2, j3
    jjz j2, qn_no
    jldi j2, 1
    jadd j9, j9, j2
    jjmp qn_lap
qn_new:
  jld j5, j1, QOTH
  jjz j5, qn_no
  jldi j2, TSN
  jcall pl_take
  jjz j6, qn_no
  jldi j1, 0
  jld j2, j1, QNA
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, QNA
  jldi j1, S_ANS
  jcall puts
  jldi j1, 0
  jldi j2, 1
  jret
qn_no:
  jldi j1, 0
  jldi j2, 0
  jret

include 'crece.inc'
include 'casa.inc'
include 'pulso.inc'
include 'organo.inc'
include 'negacion.inc'
include 'lectura.inc'
include 'idioma.inc'
