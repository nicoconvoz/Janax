; Razar eats a book that lives anywhere on the host (Capitan, 2026-11-07: "I do not want it to remember; I want it to
; keep the clue of where it read it and look for it to answer me, more like our mind").
;
; The file "come" holds the book's address on the host. Razar reads the book there (request 37, read only) and keeps
; nothing of what it says: only its clues, in bits, in the library every Razar of the host shares (the board: labels
; "tablero/...", Capitan 2026-11-07: "the library of clues for every Razar, so they do not keep it twice"). Its index
; "tablero/pistas" + the print of the address (FNV-1a, sixteen hex digits: the same book eaten again falls in the same
; index) and its pieces "tablero/pieza" + the print of the book's bytes + "-" + its number. A piece is named by what it
; holds, so it is written once (Capitan: "do not rewrite"): eating reads each piece's name, looks at what the library
; has there, and writes only what is new (Capitan: "it reads the name, checks the clues on that base and adds only what
; brings something new"). Another Razar that already ate it, the same book somewhere else, an eating cut halfway: each
; writes only what is missing. The index is written last: once it is there the book is eaten. A book that changed
; writes new pieces; the old ones are given back only when no index of the library names those bytes.
;
; Every word of the book (subjects, the foundation and the marks), hidden as the eight bytes of the print of its
; letters (hide_words: the library keeps no letters), in the order of those bytes byte by byte, goes in
; pieces of sqrt(words) words: what is held at once to answer, the index and one piece, is then the least. A piece is
; bits, the lowest first: each word as {what it shares with the word before in the piece + 1, in Elias gamma; how many
; letters it has past that + 1, gamma; those letters, each its number among the letters the book uses, in the bits
; that name them; how many times it is in the book + 1, gamma; in how many renglones + 1, gamma; and if any, the Rice
; parameter in four bits and each renglon as its step from the one before (less one), in Rice}. The Rice parameter is
; the one that says that run in the fewest bits, every one from 0 to 15 tried. Only the subjects keep renglones
; (Capitan: "the system deduces the subjects and keeps the subjects", not by capital letters): the foundation ("de",
; "que", the commas) comes back when the renglon is read again. The counts are no facts: they let the judge weigh a
; word by the whole book while it reads again only a part.
;
; The index is qwords {5, the book's bytes, renglones, words, subjects, clues, the address's bytes, the book's units,
; how many letters it uses, the bits that name one, pieces, words a piece, marks a mark page, mark pages, and where
; the letters, the pieces' list, the mark pages' list and the mark pages start, its bytes, the print of the book's
; bytes}, the address (padded to
; 8), the letters it uses (padded to 8), each piece {its number, the bytes of its first word, those letters padded to
; 8}, each mark page {where its bits start (from the first), its first mark}, and the mark pages: where each renglon
; starts in the book (renglon k from mark k to mark k + 1, the last mark the end), in pages of sqrt(marks) marks, each
; its Rice parameter in four bits and each mark's step from the one before in Rice. Asking follows the clues: it goes
; to those bytes (38) and reads only them again.
S_LIBRO = 0
S_P     = 10h
S_COME  = 18h
S_NOBOOK = 40h
S_NOMEM = 80h
S_ATE   = 0C0h
S_REN   = 100h
S_WORDS = 140h
S_CLUES = 180h
S_BYTES = 1C0h
S_NOCOME = 200h
S_OF    = 240h
S_TURN  = 280h                  ; (texts of pulso.inc's reports, never written here)
S_FLIPS = 2C0h
S_TAB   = 300h                  ; "tablero/pistas", "tablero/pieza"
S_TABP  = 310h
S_NEW   = 340h
S_SAME  = 380h
S_DESQ  = 3C0h                  ; what sentido leaves for a book's bytes: "tablero/esqueletos", "tablero/preguntas-",
S_DPRQ  = 3E0h                  ; "tablero/enganches-"
S_DENG  = 400h
S_DORT  = 440h                  ; "tablero/ortografia": the spelling
S_DFUN  = 420h                  ; "tablero/funciones-": the dictionary of instructions

PLEN  = 1600h                   ; the address's bytes, at PATHB
HND    = 1608h                   ; a handle
CNTW  = 1610h                   ; by number of word: in how many renglones it is (then where its next clue goes), and
LASTW = 1618h                   ; the last renglon it was seen in (plus one)
OUTR  = 1620h                   ; the index being written (not 0 while renglones are written), its bytes, how many clues, the renglon walked + 1
OSZ   = 1628h
NPOST = 1630h
RK    = 1638h
PHASH = 1640h                   ; the print of the address
CW    = 1648h                   ; the bytes of a renglon written (a qword)
KEEP  = 1650h                   ; by number of word: 1 if it is a subject (its clues are kept), and how many are
NK    = 1658h
OCC   = 1660h                   ; by number of word: how many times it is in the book
ZCL   = 1668h                   ; every word's renglones, a qword each; where each word's start (by number)
ZCST  = 1670h
ZNW   = 1678h                   ; how many words; the words in the order of their letters, and a room to sort them
ZORD  = 1680h
ZTMP  = 1688h
ZWID  = 1690h                   ; sorting: the runs' width, where a pair starts, its two sides walked, written, ends
ZLO   = 1698h
ZA    = 16A0h
ZB    = 16A8h
ZO    = 16B0h
ZMID  = 16B8h
ZHI   = 16C0h
ZNA   = 16C8h                   ; the letters the book uses, and the bits that name one
ZAB   = 16D0h
ZPW   = 16D8h                   ; words a piece, pieces, marks a mark page, mark pages, and where each starts in the bits
ZNP   = 16E0h
ZPM   = 16E8h
ZNMP  = 16F0h
ZPST  = 16F8h
ZMST  = 1700h
ZBC   = 1708h                   ; the bits: the room's bytes, the room, the bits written
ZBB   = 1710h
ZBP   = 1718h
ZP    = 1720h                   ; the piece written, the word in order, the bytes and letters of the word before, how
ZI    = 1728h                   ; many words left in the piece, the word, its bytes and letters, what it shares
ZPL   = 1730h
ZPA   = 1738h
ZCNT  = 1740h
ZID   = 1748h
ZLL   = 1750h
ZLA   = 1758h
ZS    = 1760h
ZRP   = 1768h                   ; a run: its qwords, how many, the one before the first, and what each step has less
ZRN   = 1770h
ZRV   = 1778h
ZRD   = 1780h
ZOLD  = 1790h                   ; the index it had (0 if none)
ZOA   = 1798h                   ; where in the index the letters, the pieces, the mark pages' list and pages start; its
ZOP   = 17A0h                   ; bytes
ZOM   = 17A8h
ZOK   = 17B0h
ZTOT  = 17B8h
ZW1   = 17C0h                   ; kept across a request
ZW2   = 17C8h
ZLABN = 17D0h                   ; the bytes of the label at ZLAB
CHASH = 17D8h                   ; the print of the book's bytes, and of the bytes of the index it had
OHASH = 17E0h
ZNEW  = 17E8h                   ; pieces written, and pieces already there
ZSAME = 17F0h
ZLAB  = 6600h                   ; a piece's label: "tablero/pieza", the print of the book's bytes, "-", its number
ZDIG  = 6680h                   ; its digits, the last first
ZLIX  = 6740h                   ; the silhouettes: by word, its limit's number + 1 (0: no limit); the limits, by number;
ZNLIM = 6748h                   ; how many; by word, the buildings it is in, and by word and limit how many of them that
ZLW   = 6750h                   ; limit closes; by limit, the buildings it closes, and every building
ZAN   = 6758h
ZACN  = 6760h
ZLC   = 6768h
ZNBD  = 6770h
ZAST  = 6778h                   ; walking the buildings: where the one walked starts, its limit
ZALI  = 6780h
ZOQ   = 6788h                   ; where the limits start in the index, and their bytes
ZQL   = 6790h
ZKL   = 6798h                   ; a word's limits written: how many, the one walked
ZLI   = 67A0h
HDA   = 67A8h                   ; the words hidden: their prints' bytes, each word's entry, the entries
HDI   = 67B0h
HDE   = 67B8h
ZBT   = 6700h                   ; writing bits: the bit, the value and its bits left, unary, gamma, the Rice parameter
ZV    = 6708h                   ; and the fewest bits found
ZW    = 6710h
ZQ    = 6718h
ZG    = 6720h
ZGN   = 6728h
ZK    = 6730h
ZKT   = 6738h
ZCODE = 6800h                   ; by byte: 1 if a word uses it, then its number among the letters (256 qwords)
DERT  = 7100h                   ; sweeping: the names the indexes give {key} (a table that grows); a label walked,
SWI   = 7120h                   ; how many left, a book's print unsalted
SWN   = 7128h
SWK   = 7130h
ZALPH = 7000h                   ; the letters, by number (256 bytes)
PATHB = 6000h                   ; the address (511 bytes at most)
PLAB  = 6400h                   ; the index's label: "tablero/pistas" and sixteen hex digits
PLABN = 30
include '../../escalon0/janax.inc'
jfirst j1, 10000h              ; first order: room 0

jldi j1, 0                      ; what to eat: the address in "come"
jldi j10, 4
jldi j11, S_COME
jldi j12, 4
jcall ask
jldi j1, 0
jldi j2, 63
jshr j2, j13, j2
jjnz j2, no_come
jst j13, j1, HND
jldi j2, 32
jshl j10, j13, j2
jldi j2, 5
jor j10, j10, j2
jldi j11, PATHB
jldi j12, 511
jcall ask
jldi j1, 0                      ; (a failed read is nothing)
jldi j2, 63
jsar j2, j13, j2
jldi j3, -1
jxor j2, j2, j3
jand j13, j13, j2
jst j13, j1, PLEN
jld j10, j1, HND
jldi j2, 32
jshl j10, j10, j2
jldi j2, 7
jor j10, j10, j2
jcall ask
jldi j1, 0                      ; (without the line feed, spaces or controls after it)
jld j3, j1, PLEN
cm_strip:
  jjz j3, cm_stripped
  jldi j4, PATHB - 1
  jadd j4, j4, j3
  jldb j5, j4, 0
  jldi j6, 33
  jsub j5, j5, j6
  jldi j6, 63
  jsar j5, j5, j6
  jjz j5, cm_stripped
  jldi j4, 1
  jsub j3, j3, j4
  jjmp cm_strip
cm_stripped:
jst j3, j1, PLEN
jjz j3, no_come

jldi j2, PATHB                  ; the book, there: read as always, keeping where each renglon starts
jst j2, j1, LABEL
jst j3, j1, LABLEN
jldi j2, 1
jst j2, j1, HOSTB
jcall read_book
jldi j1, 0                      ; the whole book, none kept apart: its pulses, and the house
jldi j2, 0
jshi j2, 4000h
jshi j2, 0
jshi j2, 0
jshi j2, 0
jst j2, j1, PK
jcall learn_pulses
jcall house_decide
jcall distill_no                ; its switch of yes and no, found in the whole book (a reading rule: it travels)
jcall limits                    ; the limits of its buildings, found in the book
jcall zs_buildings              ; and the buildings each word is in, with the limit that closes each
jldi j1, 0                      ; the subjects: no foundation, no mark
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, KEEP
jst j1, j1, NK
jld j10, j1, NV
jldi j9, 1
jsub j10, j10, j9
jwhile j10
  jldi j1, 0
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMSD
  jadd j4, j4, j3
  jld j4, j4, 0
  jsub j4, j1, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, ks_no
  jadd j2, j9, j1
  jcall w_mark
  jjnz j3, ks_no
  jldi j1, 0
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, KEEP
  jadd j4, j4, j3
  jldi j2, 1
  jst j2, j4, 0
  jld j2, j1, NK
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, NK
ks_no:
  jldi j1, 0
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend

jldi j1, 0                      ; the print of its address, and the nest's label
jld j2, j1, FNVO
jld j3, j1, PLEN
jldi j4, 0
jwhile j3
  jldi j5, PATHB
  jadd j5, j5, j4
  jldb j5, j5, 0
  jxor j2, j2, j5
  jld j6, j1, FNVP
  jmul j2, j2, j6
  jldi j5, 1
  jadd j4, j4, j5
  jsub j3, j3, j5
jwend
jst j2, j1, PHASH
jldi j2, PLAB
jldi j3, S_TAB
jldi j4, 14
jcall zs_copy
jldi j1, 0
jld j5, j1, PHASH
jldi j3, PLAB + PLABN - 1
jcall zw_hex

jldi j1, 0                      ; the print of the book's bytes: its pieces' name (the same book anywhere, one copy)
jld j2, j1, FNVO
jst j2, j1, CHASH
jldi j10, 37
jldi j11, PATHB
jld j12, j1, PLEN
jcall ask
jldi j1, 0
jldi j2, 63
jshr j2, j13, j2
jjnz j2, no_come
jst j13, j1, HND
jldi j11, 1
jshi j11, 0
jcall room
jldi j1, 0
jst j13, j1, ZW1
ch_read:
  jld j10, j1, HND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 5
  jor j10, j10, j2
  jld j11, j1, ZW1
  jldi j12, 1
  jshi j12, 0
  jcall ask
  jldi j1, 0
  jldi j2, 1
  jsub j2, j13, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, ch_read_end
  jld j2, j1, CHASH
  jld j3, j1, ZW1
  jld j6, j1, FNVP
  jwhile j13
    jldb j4, j3, 0
    jxor j2, j2, j4
    jmul j2, j2, j6
    jldi j4, 1
    jadd j3, j3, j4
    jsub j13, j13, j4
  jwend
  jst j2, j1, CHASH
  jjmp ch_read
ch_read_end:
jld j10, j1, HND
jldi j2, 32
jshl j10, j10, j2
jldi j2, 7
jor j10, j10, j2
jcall ask
jldi j1, 0
jld j11, j1, ZW1
jldi j10, 3
jcall ask
jldi j1, 0                      ; (and the format, folded into the print: pieces of another format never share a name)
jld j2, j1, CHASH
jldi j3, 7
jxor j2, j2, j3
jld j3, j1, FNVP
jmul j2, j2, j3
jst j2, j1, CHASH

jldi j1, 0                      ; in how many renglones each word is
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, CNTW
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, LASTW
jst j1, j1, NPOST
jcall clue_walk
jldi j1, 0                      ; how many times each word is in the book (the judge weighs by the whole book)
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, OCC
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

jldi j1, 0                      ; each word's renglones, a qword each, one word after another (CST: where its own start)
jld j11, j1, NPOST
jldi j2, 3
jshl j11, j11, j2
jldi j2, 8
jadd j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ZCL
jld j11, j1, NV
jldi j2, 3
jshl j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ZCST
jld j5, j1, ZCL
jld j10, j1, NV
jldi j9, 0
jwhile j10
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, CNTW
  jadd j4, j4, j3
  jld j6, j4, 0
  jst j5, j4, 0
  jld j7, j1, ZCST
  jadd j7, j7, j3
  jst j5, j7, 0
  jldi j7, 3
  jshl j6, j6, j7
  jadd j5, j5, j6
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jld j10, j1, NV                 ; the walk again, writing them
jld j9, j1, LASTW
jwhile j10
  jst j1, j9, 0
  jldi j2, 8
  jadd j9, j9, j2
  jldi j2, 1
  jsub j10, j10, j2
jwend
jldi j2, 8
jst j2, j1, CW
jldi j2, 1
jst j2, j1, OUTR
jcall clue_walk

jcall hide_words                ; every word as its print, never its letters
jldi j1, 0                      ; every word, in the order of its letters (merge sort, from runs of one)
jld j2, j1, NV
jldi j3, 1
jsub j2, j2, j3
jst j2, j1, ZNW
jldi j3, 3
jshl j11, j2, j3
jldi j3, 8
jadd j11, j11, j3
jcall room
jldi j1, 0
jst j13, j1, ZORD
jld j11, j1, ZNW
jldi j3, 3
jshl j11, j11, j3
jldi j3, 8
jadd j11, j11, j3
jcall room
jldi j1, 0
jst j13, j1, ZTMP
jld j10, j1, ZNW
jld j3, j1, ZORD
jldi j2, 1
jwhile j10
  jst j2, j3, 0
  jldi j4, 8
  jadd j3, j3, j4
  jldi j4, 1
  jadd j2, j2, j4
  jsub j10, j10, j4
jwend
jldi j2, 1
jst j2, j1, ZWID
ms_pass:
  jldi j1, 0
  jld j2, j1, ZWID
  jld j3, j1, ZNW
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, ms_done
  jst j1, j1, ZLO
ms_run:
  jldi j1, 0
  jld j2, j1, ZLO
  jld j3, j1, ZNW
  jsub j4, j2, j3
  jldi j5, 63
  jsar j4, j4, j5
  jjz j4, ms_swap
  jst j2, j1, ZA
  jst j2, j1, ZO
  jld j4, j1, ZWID
  jadd j2, j2, j4
  jcall zs_min
  jst j2, j1, ZMID
  jst j2, j1, ZB
  jld j4, j1, ZWID
  jadd j2, j2, j4
  jcall zs_min
  jst j2, j1, ZHI
ms_take:
  jldi j1, 0
  jld j2, j1, ZO
  jld j3, j1, ZHI
  jsub j2, j2, j3
  jjz j2, ms_next
  jld j2, j1, ZA
  jld j3, j1, ZMID
  jsub j2, j2, j3
  jjz j2, ms_b
  jld j2, j1, ZB
  jld j3, j1, ZHI
  jsub j2, j2, j3
  jjz j2, ms_a
  jld j2, j1, ZB                ; the right one first only if it is less (the same order otherwise)
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZORD
  jadd j2, j2, j3
  jld j2, j2, 0
  jld j3, j1, ZA
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, ZORD
  jadd j3, j3, j4
  jld j3, j3, 0
  jcall zs_less
  jjnz j2, ms_b
ms_a:
  jldi j1, 0
  jld j2, j1, ZA
  jldi j3, 1
  jadd j3, j2, j3
  jst j3, j1, ZA
  jjmp ms_put
ms_b:
  jldi j1, 0
  jld j2, j1, ZB
  jldi j3, 1
  jadd j3, j2, j3
  jst j3, j1, ZB
ms_put:
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZORD
  jadd j2, j2, j3
  jld j2, j2, 0
  jld j3, j1, ZO
  jldi j4, 3
  jshl j4, j3, j4
  jld j5, j1, ZTMP
  jadd j4, j4, j5
  jst j2, j4, 0
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, ZO
  jjmp ms_take
ms_next:
  jld j2, j1, ZLO
  jld j3, j1, ZWID
  jadd j2, j2, j3
  jadd j2, j2, j3
  jst j2, j1, ZLO
  jjmp ms_run
ms_swap:
  jld j2, j1, ZORD
  jld j3, j1, ZTMP
  jst j3, j1, ZORD
  jst j2, j1, ZTMP
  jld j2, j1, ZWID
  jadd j2, j2, j2
  jst j2, j1, ZWID
  jjmp ms_pass
ms_done:

jldi j1, 0                      ; the letters it uses: each byte its number among them, in the bits that name them
jld j10, j1, NV
jldi j9, 1
jsub j10, j10, j9
jwhile j10
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j5, j3, 16
  jld j4, j3, 8
  jld j6, j1, ROOMA
  jadd j4, j4, j6
  jwhile j5
    jldb j6, j4, 0
    jldi j7, 3
    jshl j6, j6, j7
    jldi j7, 1
    jst j7, j6, ZCODE
    jadd j4, j4, j7
    jsub j5, j5, j7
  jwend
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jst j1, j1, ZNA
jldi j9, 0
jldi j10, 256
jwhile j10
  jldi j3, 3
  jshl j3, j9, j3
  jld j4, j3, ZCODE
  jjz j4, al_next
  jld j4, j1, ZNA
  jst j4, j3, ZCODE
  jstb j9, j4, ZALPH
  jldi j5, 1
  jadd j4, j4, j5
  jst j4, j1, ZNA
al_next:
  jldi j2, 1
  jadd j9, j9, j2
  jsub j10, j10, j2
jwend
jld j2, j1, ZNA
jldi j3, 1
jsub j2, j2, j3
jldi j4, 0
jwhile j2
  jadd j4, j4, j3
  jshr j2, j2, j3
jwend
jjnz j4, al_bits
jldi j4, 1
al_bits:
jst j4, j1, ZAB

jldi j1, 0                      ; pieces of sqrt(words) words, mark pages of sqrt(marks) marks: what is held at once,
jld j2, j1, ZNW                 ; the index and one of them, is then the least
jcall zq_sqrt
jst j2, j1, ZPW
jld j3, j1, ZNW
jadd j3, j3, j2
jldi j4, 1
jsub j3, j3, j4
jdiv j3, j3, j2
jst j3, j1, ZNP
jld j2, j1, ROFFN
jcall zq_sqrt
jst j2, j1, ZPM
jld j3, j1, ROFFN
jadd j3, j3, j2
jldi j4, 1
jsub j3, j3, j4
jdiv j3, j3, j2
jst j3, j1, ZNMP
jld j11, j1, ZNP                ; where each starts (one more: the end)
jldi j2, 3
jshl j11, j11, j2
jldi j2, 8
jadd j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ZPST
jld j11, j1, ZNMP
jldi j2, 3
jshl j11, j11, j2
jldi j2, 8
jadd j11, j11, j2
jcall room
jldi j1, 0
jst j13, j1, ZMST
jldi j11, 4096                  ; the bits (a room that grows)
jst j11, j1, ZBC
jcall room
jldi j1, 0
jst j13, j1, ZBB
jst j1, j1, ZBP

jst j1, j1, ZP                  ; each piece: its words, each after the one before (what they share said once)
jst j1, j1, ZI
pw_piece:
  jldi j1, 0
  jld j2, j1, ZP
  jld j3, j1, ZNP
  jsub j2, j2, j3
  jjz j2, pw_done
  jld j2, j1, ZBP
  jldi j3, 3
  jshr j2, j2, j3
  jld j3, j1, ZP
  jldi j4, 3
  jshl j3, j3, j4
  jld j4, j1, ZPST
  jadd j3, j3, j4
  jst j2, j3, 0
  jst j1, j1, ZPL
  jld j2, j1, ZNW
  jld j3, j1, ZI
  jsub j2, j2, j3
  jld j3, j1, ZPW
  jsub j4, j2, j3
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, pw_count
  jadd j2, j3, j1
pw_count:
  jst j2, j1, ZCNT
pw_word:
  jldi j1, 0
  jld j2, j1, ZCNT
  jjz j2, pw_end
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, ZCNT
  jld j2, j1, ZI
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZORD
  jadd j2, j2, j3
  jld j2, j2, 0
  jst j2, j1, ZID
  jldi j3, 3
  jshl j3, j2, j3
  jld j4, j1, ROOMI
  jadd j3, j3, j4
  jld j3, j3, 0
  jld j5, j3, 16
  jst j5, j1, ZLL
  jld j4, j3, 8
  jld j6, j1, ROOMA
  jadd j4, j4, j6
  jst j4, j1, ZLA
  jldi j2, 0                    ; what it shares with the one before
  jld j6, j1, ZPA
  jld j7, j1, ZPL
pw_share:
  jsub j8, j2, j5
  jjz j8, pw_shared
  jsub j8, j2, j7
  jjz j8, pw_shared
  jadd j8, j4, j2
  jldb j8, j8, 0
  jadd j3, j6, j2
  jldb j3, j3, 0
  jsub j8, j8, j3
  jjnz j8, pw_shared
  jldi j8, 1
  jadd j2, j2, j8
  jjmp pw_share
pw_shared:
  jst j2, j1, ZS
  jldi j3, 1
  jadd j2, j2, j3
  jcall zb_gamma
  jldi j1, 0
  jld j2, j1, ZLL
  jld j3, j1, ZS
  jsub j2, j2, j3
  jldi j3, 1
  jadd j2, j2, j3
  jcall zb_gamma
  pw_letter:                    ; the rest of its letters
    jldi j1, 0
    jld j2, j1, ZS
    jld j3, j1, ZLL
    jsub j3, j2, j3
    jjz j3, pw_said
    jldi j3, 1
    jadd j3, j2, j3
    jst j3, j1, ZS
    jld j3, j1, ZLA
    jadd j3, j3, j2
    jldb j2, j3, 0
    jldi j3, 3
    jshl j2, j2, j3
    jld j2, j2, ZCODE
    jld j3, j1, ZAB
    jcall zb_put
    jjmp pw_letter
  pw_said:
  jld j2, j1, ZID               ; how many times it is in the book, in how many renglones
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, OCC
  jadd j3, j3, j2
  jld j2, j3, 0
  jldi j3, 1
  jadd j2, j2, j3
  jcall zb_gamma
  jcall zs_entry_sil
  jldi j1, 0
  jld j2, j1, ZID
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZCST
  jadd j3, j3, j2
  jld j3, j3, 0
  jst j3, j1, ZRP
  jld j4, j1, CNTW
  jadd j4, j4, j2
  jld j4, j4, 0
  jsub j4, j4, j3
  jldi j5, 3
  jshr j4, j4, j5
  jst j4, j1, ZRN
  jldi j2, 1
  jadd j2, j4, j2
  jcall zb_gamma
  jldi j1, 0
  jld j2, j1, ZRN
  jjz j2, pw_next
  jldi j2, -1                   ; its renglones: each the step from the one before
  jst j2, j1, ZRV
  jldi j2, 1
  jst j2, j1, ZRD
  jcall zk_best
  jcall zk_write
pw_next:
  jldi j1, 0
  jld j2, j1, ZLA
  jst j2, j1, ZPA
  jld j2, j1, ZLL
  jst j2, j1, ZPL
  jld j2, j1, ZI
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZI
  jjmp pw_word
pw_end:
  jcall zb_align
  jld j2, j1, ZP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZP
  jjmp pw_piece
pw_done:
jld j2, j1, ZBP
jldi j3, 3
jshr j2, j2, j3
jld j3, j1, ZNP
jldi j4, 3
jshl j3, j3, j4
jld j4, j1, ZPST
jadd j3, j3, j4
jst j2, j3, 0

jst j1, j1, ZP                  ; each mark page: how long each renglon is, from its first mark
mk_page:
  jldi j1, 0
  jld j2, j1, ZP
  jld j3, j1, ZNMP
  jsub j3, j2, j3
  jjz j3, mk_done
  jld j3, j1, ZBP
  jldi j4, 3
  jshr j3, j3, j4
  jldi j4, 3
  jshl j4, j2, j4
  jld j5, j1, ZMST
  jadd j4, j4, j5
  jst j3, j4, 0
  jld j3, j1, ZPM
  jmul j2, j2, j3
  jld j4, j1, ROFFN
  jsub j4, j4, j2
  jsub j5, j4, j3
  jldi j6, 63
  jsar j5, j5, j6
  jjnz j5, mk_count
  jadd j4, j3, j1
mk_count:
  jldi j5, 1
  jsub j4, j4, j5
  jst j4, j1, ZRN
  jldi j5, 3
  jshl j2, j2, j5
  jld j5, j1, ROFF
  jadd j2, j2, j5
  jld j3, j2, 0
  jst j3, j1, ZRV
  jldi j3, 8
  jadd j2, j2, j3
  jst j2, j1, ZRP
  jst j1, j1, ZRD
  jcall zk_best
  jcall zk_write
  jcall zb_align
  jld j2, j1, ZP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZP
  jjmp mk_page
mk_done:
jld j2, j1, ZBP
jldi j3, 3
jshr j2, j2, j3
jld j3, j1, ZNMP
jldi j4, 3
jshl j3, j3, j4
jld j4, j1, ZMST
jadd j3, j3, j4
jst j2, j3, 0

jldi j11, PLAB                  ; the index it had, if this book was eaten before
jldi j12, PLABN
jcall pz_file
jldi j1, 0
jst j1, j1, ZOLD
jld j2, j1, PZFRN
jldi j3, 160
jsub j2, j2, j3
jldi j3, 63
jsar j2, j2, j3
jjnz j2, old_none
jld j2, j1, PZFR
jld j3, j2, 0
jldi j4, 5
jsub j3, j3, j4
jldi j4, 63
jsar j3, j3, j4
jjnz j3, old_none
jst j2, j1, ZOLD
old_none:

jldi j1, 0                      ; the index's size: its head, the address, the letters, each piece's number and first
jld j2, j1, PLEN                ; word, each mark page's start, the mark pages
jcall zs_pad
jldi j3, 160
jadd j2, j2, j3
jst j2, j1, ZOA
jadd j11, j2, j1
jld j2, j1, ZNA
jcall zs_pad
jadd j11, j11, j2
jst j11, j1, ZOP
jst j1, j1, ZP
ix_size:
  jldi j1, 0
  jld j2, j1, ZP
  jld j3, j1, ZNP
  jsub j3, j2, j3
  jjz j3, ix_sized
  jcall zs_first
  jld j2, j1, ZLL
  jcall zs_pad
  jldi j3, 16
  jadd j2, j2, j3
  jld j3, j1, ZOP
  jadd j3, j3, j2
  jst j3, j1, ZOP
  jld j2, j1, ZP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZP
  jjmp ix_size
ix_sized:
jld j3, j1, ZOP                 ; (ZOP held the end: the list starts after the letters)
jst j3, j1, ZOM
jld j2, j1, ZNA
jcall zs_pad
jld j3, j1, ZOA
jadd j2, j2, j3
jst j2, j1, ZOP
jld j2, j1, ZNMP
jldi j3, 4
jshl j2, j2, j3
jld j3, j1, ZOM
jadd j2, j2, j3
jst j2, j1, ZOK
jld j3, j1, ZNMP
jldi j4, 3
jshl j3, j3, j4
jld j4, j1, ZMST
jadd j3, j3, j4
jld j3, j3, 0
jld j4, j1, ZMST
jld j4, j4, 0
jsub j3, j3, j4
jadd j2, j2, j3
jcall zs_pad                    ; (then the book's limits, from a qword on: where they start, and the index's bytes)
jadd j11, j2, j1
jst j11, j1, ZOQ
jcall zs_limsize
jldi j1, 0
jld j11, j1, ZOQ
jld j2, j1, ZQL
jadd j11, j11, j2
jst j11, j1, ZTOT
jcall room
jldi j1, 0
jst j13, j1, OUTR

jldi j2, 7                      ; its head
jst j2, j13, 0
jld j2, j1, NBYTES
jst j2, j13, 8
jld j2, j1, ROFFN
jldi j3, 1
jsub j2, j2, j3
jst j2, j13, 16
jld j2, j1, ZNW
jst j2, j13, 24
jld j2, j1, NK
jst j2, j13, 32
jld j2, j1, NPOST
jst j2, j13, 40
jld j2, j1, PLEN
jst j2, j13, 48
jld j2, j1, NTOK
jst j2, j13, 56
jld j2, j1, ZNA
jst j2, j13, 64
jld j2, j1, ZAB
jst j2, j13, 72
jld j2, j1, ZNP
jst j2, j13, 80
jld j2, j1, ZPW
jst j2, j13, 88
jld j2, j1, ZPM
jst j2, j13, 96
jld j2, j1, ZNMP
jst j2, j13, 104
jld j2, j1, ZOA
jst j2, j13, 112
jld j2, j1, ZOP
jst j2, j13, 120
jld j2, j1, ZOM
jst j2, j13, 128
jld j2, j1, ZOK
jst j2, j13, 136
jld j2, j1, ZOQ
jst j2, j13, 144
jld j2, j1, CHASH
jst j2, j13, 152
jldi j2, 160                    ; the address
jadd j2, j13, j2
jldi j3, PATHB
jld j4, j1, PLEN
jcall zs_copy
jldi j1, 0
jld j2, j1, OUTR                ; the letters
jld j3, j1, ZOA
jadd j2, j2, j3
jldi j3, ZALPH
jld j4, j1, ZNA
jcall zs_copy
jldi j1, 0
jst j1, j1, ZP                  ; each piece: its number and its first word
jld j2, j1, OUTR
jld j3, j1, ZOP
jadd j2, j2, j3
jst j2, j1, ZW1
ix_piece:
  jldi j1, 0
  jld j2, j1, ZP
  jld j3, j1, ZNP
  jsub j3, j2, j3
  jjz j3, ix_marks
  jcall zs_first
  jld j9, j1, ZW1
  jld j2, j1, ZP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j9, 0
  jld j4, j1, ZLL
  jst j4, j9, 8
  jldi j2, 16
  jadd j2, j9, j2
  jld j3, j1, ZLA
  jcall zs_copy
  jldi j1, 0
  jld j2, j1, ZLL
  jcall zs_pad
  jldi j3, 16
  jadd j2, j2, j3
  jld j3, j1, ZW1
  jadd j2, j2, j3
  jst j2, j1, ZW1
  jld j2, j1, ZP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZP
  jjmp ix_piece
ix_marks:
jld j9, j1, OUTR                ; each mark page: where its bits start (from the first page), its first mark
jld j2, j1, ZOM
jadd j9, j9, j2
jld j10, j1, ZNMP
jld j5, j1, ZMST
jld j6, j5, 0
jldi j7, 0
jwhile j10
  jld j2, j5, 0
  jsub j2, j2, j6
  jst j2, j9, 0
  jld j2, j1, ZPM
  jmul j2, j2, j7
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROFF
  jadd j2, j2, j3
  jld j2, j2, 0
  jst j2, j9, 8
  jldi j2, 16
  jadd j9, j9, j2
  jldi j2, 8
  jadd j5, j5, j2
  jldi j2, 1
  jadd j7, j7, j2
  jsub j10, j10, j2
jwend
jld j2, j1, OUTR                ; and the mark pages
jld j3, j1, ZOK
jadd j2, j2, j3
jld j3, j1, ZMST
jld j3, j3, 0
jld j4, j1, ZBB
jadd j3, j3, j4
jld j4, j1, ZOQ
jld j5, j1, ZOK
jsub j4, j4, j5
jcall zs_copy
jcall zs_limwrite               ; and the book's limits

jldi j1, 0                      ; the pieces: one already there with the same bytes is left; only what is new is
jst j1, j1, ZP                  ; written
jst j1, j1, ZNEW
jst j1, j1, ZSAME
wp_piece:
  jldi j1, 0
  jld j2, j1, ZP
  jld j3, j1, ZNP
  jsub j3, j2, j3
  jjz j3, wp_done
  jldi j3, 1
  jadd j2, j2, j3
  jld j3, j1, CHASH
  jcall zw_label
  jldi j11, ZLAB
  jldi j1, 0
  jld j12, j1, ZLABN
  jcall pz_file
  jldi j1, 0
  jld j2, j1, ZP
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZPST
  jadd j2, j2, j3
  jld j4, j2, 0
  jld j3, j2, 8
  jsub j3, j3, j4
  jld j2, j1, ZBB
  jadd j2, j2, j4
  jst j2, j1, ZW1
  jst j3, j1, ZW2
  jld j5, j1, PZFRN             ; the one there: the same bytes?
  jsub j5, j5, j3
  jjnz j5, wp_new
  jld j5, j1, PZFR
  wp_cmp:
    jjz j3, wp_same
    jldb j6, j2, 0
    jldb j7, j5, 0
    jsub j6, j6, j7
    jjnz j6, wp_new
    jldi j6, 1
    jadd j2, j2, j6
    jadd j5, j5, j6
    jsub j3, j3, j6
    jjmp wp_cmp
wp_same:
  jld j2, j1, ZSAME
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZSAME
  jjmp wp_give
wp_new:
  jld j2, j1, ZW1
  jld j3, j1, ZW2
  jcall zw_write
  jld j2, j1, ZNEW
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZNEW
wp_give:
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, wp_next
  jld j11, j1, PZFR
  jldi j10, 3
  jcall ask
wp_next:
  jldi j1, 0
  jld j2, j1, ZP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZP
  jjmp wp_piece
wp_done:
jldi j2, ZLAB                   ; then the index: once it is there the book is eaten
jldi j3, PLAB
jldi j4, PLABN
jcall zs_copy
jldi j1, 0
jldi j2, PLABN
jst j2, j1, ZLABN
jld j2, j1, OUTR
jld j3, j1, ZTOT
jcall zw_write
jld j9, j1, ZOLD                ; the pieces of the index it had: given back if the book changed and no other index
jjz j9, old_gone                ; of the library names those bytes (the same book may live somewhere else too)
jld j2, j9, 152
jst j2, j1, OHASH
jld j3, j1, CHASH
jsub j2, j2, j3
jjz j2, old_gone
jcall pz_list
jldi j1, 0
jld j10, j1, PZLSTN
jldi j2, 63
jsar j2, j10, j2
jjnz j2, old_gone
jld j9, j1, PZLST
og_label:
  jjz j10, og_free
  jst j9, j1, ZW1
  jst j10, j1, ZW2
  jcall zw_index
  jjz j2, og_next
  jldi j11, 8                   ; (an index: does it name those bytes?)
  jadd j11, j9, j11
  jld j12, j9, 0
  jcall pz_file
  jldi j1, 0
  jld j2, j1, PZFRN
  jldi j3, 160
  jsub j2, j2, j3
  jldi j3, 63
  jsar j2, j2, j3
  jjnz j2, og_next
  jld j2, j1, PZFR
  jld j3, j2, 0
  jldi j4, 5
  jsub j3, j3, j4
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, og_next
  jld j3, j2, 152
  jld j4, j1, OHASH
  jsub j3, j3, j4
  jjz j3, old_gone
og_next:
  jldi j1, 0
  jld j9, j1, ZW1
  jld j2, j9, 0
  jcall zs_pad
  jldi j3, 8
  jadd j9, j9, j2
  jadd j9, j9, j3
  jld j10, j1, ZW2
  jldi j2, 1
  jsub j10, j10, j2
  jjmp og_label
og_free:
jld j9, j1, ZOLD
jld j10, j9, 80
jldi j2, 1
jst j2, j1, ZP
jwhile j10
  jst j10, j1, ZW2
  jld j2, j1, ZP
  jld j3, j1, OHASH
  jcall zw_label
  jldi j10, 12
  jldi j11, ZLAB
  jld j12, j1, ZLABN
  jcall ask
  jldi j1, 0
  jld j2, j1, ZP
  jldi j3, 1
  jadd j2, j2, j3
  jst j2, j1, ZP
  jld j10, j1, ZW2
  jsub j10, j10, j3
jwend
old_gone:
jcall lib_sweep                 ; what sentido left for bytes no index names any more, given back
jldi j1, 0
jldi j10, 12                    ; (a nest of before in its own folder goes: the library is where they live now)
jldi j11, PLAB + 8
jldi j12, PLABN - 8
jcall ask
jldi j1, 0
jld j2, j1, ZTOT                ; (its bytes: the index and its pieces)
jld j3, j1, ZNP
jldi j4, 3
jshl j3, j3, j4
jld j4, j1, ZPST
jadd j3, j3, j4
jld j3, j3, 0
jadd j2, j2, j3
jst j2, j1, OSZ
cm_said:
jldi j1, S_ATE                  ; said: what it ate, how many renglones and words, how many clues, how many bytes
jcall puts
jld j6, j1, PLEN
jldi j4, PATHB
jwhile j6
  jldb j2, j4, 0
  jcall putch
  jldi j5, 1
  jadd j4, j4, j5
  jsub j6, j6, j5
jwend
jldi j1, 0
jldi j1, S_REN
jcall puts
jld j2, j1, ROFFN
jldi j3, 1
jsub j2, j2, j3
jcall putnum
jldi j1, S_WORDS
jcall puts
jld j2, j1, NK
jcall putnum
jldi j1, S_OF
jcall puts
jld j2, j1, NV
jldi j3, 1
jsub j2, j2, j3
jcall putnum
jldi j1, S_CLUES
jcall puts
jld j2, j1, NPOST
jcall putnum
jldi j1, S_BYTES
jcall puts
jld j2, j1, OSZ
jcall putnum
jldi j1, S_NEW
jcall puts
jld j2, j1, ZNEW
jcall putnum
jldi j1, S_SAME
jcall puts
jld j2, j1, ZSAME
jcall putnum
jldi j2, 10
jcall putch
jjmp finish
no_come:
jldi j1, S_NOCOME
jcall puts
jjmp finish

; The row walked: each word the first time in each renglon is one clue. Before the nest is written it counts them
; (CNTW, NPOST); after, CNTW holds where each word's next clue goes and it writes the renglon there. Uses j1-j10.
clue_walk:
  jldi j1, 0
  jst j1, j1, RK
  jld j9, j1, ROOMT
  jld j10, j1, NTOK
  jwhile j10
    jld j2, j9, 0
    jjnz j2, cw_word
    jld j3, j1, RK
    jldi j4, 1
    jadd j3, j3, j4
    jst j3, j1, RK
    jjmp cw_next
  cw_word:
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, KEEP            ; (a subject: the foundation keeps no clue)
    jadd j4, j4, j3
    jld j4, j4, 0
    jjz j4, cw_next
    jld j4, j1, LASTW
    jadd j4, j4, j3
    jld j5, j4, 0
    jld j6, j1, RK
    jsub j5, j5, j6
    jjz j5, cw_next
    jst j6, j4, 0
    jld j4, j1, CNTW
    jadd j4, j4, j3
    jld j5, j4, 0
    jld j7, j1, OUTR
    jjz j7, cw_count
    jldi j7, 1                  ; writing: the renglon (counted from 0) where the clue goes, in its bytes
    jsub j6, j6, j7
    jld j7, j1, CW
    cw_byte:
      jstb j6, j5, 0
      jldi j8, 8
      jshr j6, j6, j8
      jldi j8, 1
      jadd j5, j5, j8
      jsub j7, j7, j8
      jjnz j7, cw_byte
    jst j5, j4, 0
    jjmp cw_next
  cw_count:
    jldi j7, 1
    jadd j5, j5, j7
    jst j5, j4, 0
    jld j5, j1, NPOST
    jadd j5, j5, j7
    jst j5, j1, NPOST
  cw_next:
    jldi j2, 8
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jret

; The bits, written the lowest first into a room that grows (ZBB, ZBC bytes; ZBP bits written so far).
; One bit, j2 (0 or 1). Uses j1-j8, j10-j14 (when it grows).
zb_bit:
  jldi j1, 0
  jst j2, j1, ZBT
  jld j3, j1, ZBP
  jldi j4, 3
  jshr j3, j3, j4
  jld j4, j1, ZBC
  jldi j5, 8
  jsub j4, j4, j5
  jsub j4, j3, j4
  jldi j5, 63
  jsar j4, j4, j5
  jjnz j4, zbb_put
  jld j11, j1, ZBC              ; full: twice the room, what it holds copied, the old one given back
  jadd j11, j11, j11
  jcall room
  jldi j1, 0
  jld j4, j1, ZBB
  jadd j5, j13, j1
  jld j6, j1, ZBC
  jwhile j6
    jld j7, j4, 0
    jst j7, j5, 0
    jldi j7, 8
    jadd j4, j4, j7
    jadd j5, j5, j7
    jsub j6, j6, j7
  jwend
  jld j11, j1, ZBB
  jst j13, j1, ZBB
  jld j2, j1, ZBC
  jadd j2, j2, j2
  jst j2, j1, ZBC
  jldi j10, 3
  jcall ask
  jldi j1, 0
zbb_put:
  jld j2, j1, ZBT
  jjz j2, zbb_next
  jld j3, j1, ZBP
  jldi j4, 3
  jshr j5, j3, j4
  jldi j4, 7
  jand j6, j3, j4
  jldi j4, 1
  jshl j4, j4, j6
  jld j7, j1, ZBB
  jadd j5, j5, j7
  jldb j6, j5, 0
  jor j6, j6, j4
  jstb j6, j5, 0
zbb_next:
  jld j3, j1, ZBP
  jldi j4, 1
  jadd j3, j3, j4
  jst j3, j1, ZBP
  jret

; The low j3 bits of j2, the lowest first. Uses j1-j8, j10-j14.
zb_put:
  jldi j1, 0
  jst j2, j1, ZV
  jst j3, j1, ZW
zbp_lap:
  jldi j1, 0
  jld j3, j1, ZW
  jjz j3, zbp_done
  jldi j4, 1
  jsub j3, j3, j4
  jst j3, j1, ZW
  jld j2, j1, ZV
  jshr j5, j2, j4
  jst j5, j1, ZV
  jand j2, j2, j4
  jcall zb_bit
  jjmp zbp_lap
zbp_done:
  jret

; j2 in unary: that many ones and a zero. Uses j1-j8, j10-j14.
zb_unary:
  jldi j1, 0
  jst j2, j1, ZQ
zbu_lap:
  jldi j1, 0
  jld j2, j1, ZQ
  jjz j2, zbu_end
  jldi j3, 1
  jsub j2, j2, j3
  jst j2, j1, ZQ
  jldi j2, 1
  jcall zb_bit
  jjmp zbu_lap
zbu_end:
  jldi j2, 0
  jjmp zb_bit

; j2 (1 or more) in Elias gamma: N = its highest bit in unary, then its N bits below it. Uses j1-j8, j10-j14.
zb_gamma:
  jldi j1, 0
  jst j2, j1, ZG
  jldi j3, 0
  jldi j4, 1
  jshr j5, j2, j4
  jwhile j5
    jadd j3, j3, j4
    jshr j5, j5, j4
  jwend
  jst j3, j1, ZGN
  jadd j2, j3, j1
  jcall zb_unary
  jldi j1, 0
  jld j2, j1, ZG
  jld j3, j1, ZGN
  jjmp zb_put

; j2 (0 or more) in Rice of ZK: j2 >> ZK in unary, then its ZK bits below. Uses j1-j8, j10-j14.
zb_rice:
  jldi j1, 0
  jst j2, j1, ZG
  jld j3, j1, ZK
  jshr j2, j2, j3
  jcall zb_unary
  jldi j1, 0
  jld j2, j1, ZG
  jld j3, j1, ZK
  jjmp zb_put

; The bits to the next byte (what comes after starts on a byte of its own). Uses j1-j3.
zb_align:
  jldi j1, 0
  jld j2, j1, ZBP
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, -8
  jand j2, j2, j3
  jst j2, j1, ZBP
  jret

; A run: ZRN qwords at ZRP, each said as its step from the one before (ZRV before the first) less ZRD. The Rice
; parameter that says it in the fewest bits, every one tried (0 to 15, the least on a tie) -> ZK. Uses j1-j9.
zk_best:
  jldi j1, 0
  jst j1, j1, ZK
  jldi j2, -1
  jldi j3, 1
  jshr j2, j2, j3
  jst j2, j1, ZKT
  jld j9, j1, ZRD
  jldi j8, 0
zkb_k:
  jldi j7, 0
  jld j3, j1, ZRP
  jld j4, j1, ZRN
  jld j5, j1, ZRV
  jwhile j4
    jld j6, j3, 0
    jsub j2, j6, j5
    jsub j2, j2, j9
    jshr j2, j2, j8
    jadd j7, j7, j2
    jldi j2, 1
    jadd j7, j7, j2
    jadd j7, j7, j8
    jadd j5, j6, j1
    jldi j2, 8
    jadd j3, j3, j2
    jldi j2, 1
    jsub j4, j4, j2
  jwend
  jld j2, j1, ZKT
  jsub j2, j7, j2
  jldi j3, 63
  jsar j2, j2, j3
  jjz j2, zkb_next
  jst j7, j1, ZKT
  jst j8, j1, ZK
zkb_next:
  jldi j2, 1
  jadd j8, j8, j2
  jldi j2, 16
  jsub j2, j8, j2
  jjnz j2, zkb_k
  jret

; The run (as zk_best says it): ZK in four bits, then each step in Rice of ZK. Uses j1-j8, j10-j14.
zk_write:
  jldi j1, 0
  jld j2, j1, ZK
  jldi j3, 4
  jcall zb_put
zkw_lap:
  jldi j1, 0
  jld j4, j1, ZRN
  jjz j4, zkw_done
  jldi j2, 1
  jsub j4, j4, j2
  jst j4, j1, ZRN
  jld j3, j1, ZRP
  jld j6, j3, 0
  jldi j2, 8
  jadd j3, j3, j2
  jst j3, j1, ZRP
  jld j5, j1, ZRV
  jst j6, j1, ZRV
  jsub j2, j6, j5
  jld j3, j1, ZRD
  jsub j2, j2, j3
  jcall zb_rice
  jjmp zkw_lap
zkw_done:
  jret

; j2 = the least k with k * k >= j2 (0 or more). Uses j1, j3, j4.
zq_sqrt:
  jldi j1, 0
  jldi j3, 0
zq_lap:
  jmul j4, j3, j3
  jsub j4, j4, j2
  jldi j1, 63
  jsar j4, j4, j1
  jjz j4, zq_done
  jldi j1, 1
  jadd j3, j3, j1
  jjmp zq_lap
zq_done:
  jldi j1, 0
  jadd j2, j3, j1
  jret

; j2 = 1 if the letters of word j2 go before those of word j3 (byte by byte; a word before what it starts). Uses
; j1-j8.
zs_less:
  jldi j1, 0
  jldi j8, 3
  jshl j2, j2, j8
  jld j4, j1, ROOMI
  jadd j2, j2, j4
  jld j2, j2, 0
  jld j5, j2, 16
  jld j4, j2, 8
  jld j8, j1, ROOMA
  jadd j4, j4, j8
  jldi j8, 3
  jshl j3, j3, j8
  jld j6, j1, ROOMI
  jadd j3, j3, j6
  jld j3, j3, 0
  jld j7, j3, 16
  jld j6, j3, 8
  jld j8, j1, ROOMA
  jadd j6, j6, j8
zsl_lap:
  jjz j7, zsl_no
  jjz j5, zsl_yes
  jldb j2, j4, 0
  jldb j3, j6, 0
  jsub j8, j2, j3
  jjnz j8, zsl_diff
  jldi j8, 1
  jadd j4, j4, j8
  jadd j6, j6, j8
  jsub j5, j5, j8
  jsub j7, j7, j8
  jjmp zsl_lap
zsl_diff:
  jldi j2, 63
  jsar j8, j8, j2
  jjz j8, zsl_no
zsl_yes:
  jldi j2, 1
  jret
zsl_no:
  jldi j2, 0
  jret

; j2 = j2, or the words' count if it is past it. Uses j1, j3, j4.
zs_min:
  jldi j1, 0
  jld j3, j1, ZNW
  jsub j4, j2, j3
  jldi j1, 63
  jsar j4, j4, j1
  jldi j1, 0
  jjnz j4, zsm_done
  jadd j2, j3, j1
zsm_done:
  jret

; j2 up to a multiple of 8. Uses j3.
zs_pad:
  jldi j3, 7
  jadd j2, j2, j3
  jldi j3, -8
  jand j2, j2, j3
  jret

; j4 bytes from j3 to j2. Uses j1-j5 (j1 = 0 after).
zs_copy:
  jwhile j4
    jldb j5, j3, 0
    jstb j5, j2, 0
    jldi j1, 1
    jadd j2, j2, j1
    jadd j3, j3, j1
    jsub j4, j4, j1
  jwend
  jldi j1, 0
  jret

; The first word of piece ZP: its letters ZLA, its bytes ZLL. Uses j1-j4.
zs_first:
  jldi j1, 0
  jld j2, j1, ZP
  jld j3, j1, ZPW
  jmul j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZORD
  jadd j2, j2, j3
  jld j2, j2, 0
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMI
  jadd j2, j2, j3
  jld j2, j2, 0
  jld j3, j2, 16
  jst j3, j1, ZLL
  jld j3, j2, 8
  jld j4, j1, ROOMA
  jadd j3, j3, j4
  jst j3, j1, ZLA
  jret

; What sentido leaves in the library for a book's bytes ("tablero/esqueletos", "tablero/preguntas-",
; "tablero/enganches-" and sixteen hex digits) is given back when no index names those bytes any more, as the pieces
; are (one general rule: an old version of a book, a book gone, the same). From every index, the names its book's
; bytes give: the print unsalted (as that index salts it: 7, or 6 before its version 7) by the inverse of FNV's prime
; (odd, so it has one: 0xCE965057AFF6957B), salted as sentido salts each (the turns 2 and 1, the lessons 3, the
; compositions 5, the dictionary of instructions 9, the spelling 11). Every such file whose name is none of them goes. Uses j1-j14.
lib_sweep:
  jldi j2, DERT
  jldi j3, 8
  jcall pl_new
  jcall pz_list
  jldi j1, 0
  jld j2, j1, PZLSTN
  jldi j3, 63
  jsar j3, j2, j3
  jjnz j3, swp_done
  jst j2, j1, SWN               ; the names every index gives
  jld j2, j1, PZLST
  jst j2, j1, SWI
  swp_ix:
    jldi j1, 0
    jld j2, j1, SWN
    jjz j2, swp_named
    jld j9, j1, SWI
    jcall zw_index
    jjz j2, swp_ixnext
    jldi j1, 0
    jld j9, j1, SWI
    jldi j11, 8
    jadd j11, j9, j11
    jld j12, j9, 0
    jcall pz_file
    jldi j1, 0
    jld j2, j1, PZFRN
    jldi j3, 160
    jsub j2, j2, j3
    jldi j3, 63
    jsar j2, j2, j3
    jjnz j2, swp_ixnext
    jld j9, j1, PZFR
    jld j3, j9, 0
    jldi j4, 7
    jsub j4, j3, j4
    jldi j3, 7
    jjz j4, swp_salt
    jldi j3, 6
  swp_salt:
    jld j2, j9, 152
    jldi j4, 0
    jshi j4, 0CE96h
    jshi j4, 5057h
    jshi j4, 0AFF6h
    jshi j4, 957Bh
    jmul j2, j2, j4
    jxor j2, j2, j3
    jst j2, j1, SWK
    jldi j2, 2
    jcall swp_name
    jldi j2, 1
    jcall swp_name
    jldi j2, 3
    jcall swp_name
    jldi j2, 5
    jcall swp_name
    jldi j2, 9
    jcall swp_name
    jldi j2, 11
    jcall swp_name
  swp_ixnext:
    jldi j1, 0
    jld j9, j1, SWI
    jld j2, j9, 0
    jcall zs_pad
    jldi j3, 8
    jadd j9, j9, j2
    jadd j9, j9, j3
    jst j9, j1, SWI
    jld j2, j1, SWN
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, SWN
    jjmp swp_ix
swp_named:
  jld j2, j1, PZLSTN            ; every file of those kinds, against them
  jst j2, j1, SWN
  jld j2, j1, PZLST
  jst j2, j1, SWI
  swp_f:
    jldi j1, 0
    jld j2, j1, SWN
    jjz j2, swp_done
    jld j9, j1, SWI
    jld j2, j9, 0
    jldi j3, 34
    jsub j2, j2, j3
    jjnz j2, swp_fnext
    jldi j4, S_DESQ
    jcall swp_is
    jjnz j2, swp_kind
    jldi j4, S_DPRQ
    jcall swp_is
    jjnz j2, swp_kind
    jldi j4, S_DENG
    jcall swp_is
    jjnz j2, swp_kind
    jldi j4, S_DFUN
    jcall swp_is
    jjnz j2, swp_kind
    jldi j4, S_DORT
    jcall swp_is
    jjz j2, swp_fnext
  swp_kind:
    jld j9, j1, SWI             ; its sixteen hex digits
    jldi j3, 26
    jadd j3, j9, j3
    jldi j5, 0
    jldi j6, 16
    swp_hex:
      jldb j2, j3, 0
      jldi j4, 97
      jsub j7, j2, j4
      jldi j8, 63
      jsar j7, j7, j8
      jldi j4, 87
      jjz j7, swp_dig
      jldi j4, 48
    swp_dig:
      jsub j2, j2, j4
      jldi j4, 4
      jshl j5, j5, j4
      jor j5, j5, j2
      jldi j4, 1
      jadd j3, j3, j4
      jsub j6, j6, j4
      jjnz j6, swp_hex
    jldi j2, DERT
    jcall pl_find
    jldi j1, 0
    jld j2, j4, 0
    jjnz j2, swp_fnext
    jld j9, j1, SWI             ; named by no index: it goes
    jldi j10, 12
    jldi j11, 8
    jadd j11, j9, j11
    jldi j12, 34
    jcall ask
  swp_fnext:
    jldi j1, 0
    jld j9, j1, SWI
    jld j2, j9, 0
    jcall zs_pad
    jldi j3, 8
    jadd j9, j9, j2
    jadd j9, j9, j3
    jst j9, j1, SWI
    jld j2, j1, SWN
    jldi j3, 1
    jsub j2, j2, j3
    jst j2, j1, SWN
    jjmp swp_f
swp_done:
  jldi j1, 0
  jret

; The name of the bytes SWK salted j2, (SWK ^ j2) * FNV's prime, noted as one an index gives (DERT). Uses j1-j8.
swp_name:
  jldi j1, 0
  jld j5, j1, SWK
  jxor j5, j5, j2
  jld j3, j1, FNVP
  jmul j5, j5, j3
  jjnz j5, swpn_k
  jldi j5, 1
swpn_k:
  jldi j2, DERT
  jcall pl_take
  jldi j1, 0
  jret

; j2 = 1 if the label listed at SWI starts with the 18 bytes at j4. Uses j1-j7.
swp_is:
  jldi j1, 0
  jld j3, j1, SWI
  jldi j5, 18
  swi_lap:
    jldb j6, j3, 8
    jldb j7, j4, 0
    jsub j6, j6, j7
    jjnz j6, swi_no
    jldi j6, 1
    jadd j3, j3, j6
    jadd j4, j4, j6
    jsub j5, j5, j6
    jjnz j5, swi_lap
  jldi j2, 1
  jret
swi_no:
  jldi j2, 0
  jret

; The sixteen hex digits of j5, the last at j3 and the first fifteen before it. Uses j3-j8.
zw_hex:
  jldi j4, 16
  jwhile j4
    jldi j6, 15
    jand j6, j5, j6
    jldi j7, 10
    jsub j7, j6, j7
    jldi j8, 63
    jsar j7, j7, j8
    jldi j8, 48                 ; a digit, or a letter past nine
    jjnz j7, zh_digit
    jldi j8, 87
  zh_digit:
    jadd j6, j6, j8
    jstb j6, j3, 0
    jldi j6, 4
    jshr j5, j5, j6
    jldi j6, 1
    jsub j3, j3, j6
    jsub j4, j4, j6
  jwend
  jret

; j2 = 1 if the label listed at j9 ({its bytes, its bytes padded}) is an index of the library: "tablero/pistas" and
; more. Uses j1-j7.
zw_index:
  jldi j1, 0
  jldi j2, 0
  jld j3, j9, 0
  jldi j4, 15
  jsub j3, j3, j4
  jldi j4, 63
  jsar j3, j3, j4
  jjnz j3, zwi_done
  jadd j3, j9, j1
  jldi j4, S_TAB
  jldi j5, 14
zwi_byte:
  jldb j6, j3, 8
  jldb j7, j4, 0
  jsub j6, j6, j7
  jjnz j6, zwi_done
  jldi j6, 1
  jadd j3, j3, j6
  jadd j4, j4, j6
  jsub j5, j5, j6
  jjnz j5, zwi_byte
  jldi j2, 1
zwi_done:
  jret

; The label of piece j2 of the bytes whose print is j3: "tablero/pieza", the print in hex, "-" and j2 in decimal ->
; ZLAB, ZLABN. Uses j1-j8.
zw_label:
  jldi j1, 0
  jst j2, j1, ZV
  jst j3, j1, ZW
  jldi j2, ZLAB
  jldi j3, S_TABP
  jldi j4, 13
  jcall zs_copy
  jld j5, j1, ZW
  jldi j3, ZLAB + 28
  jcall zw_hex
  jldi j1, 0
  jldi j3, ZLAB + 29
  jldi j4, 45
  jstb j4, j3, 0
  jld j2, j1, ZV
  jldi j5, 0                    ; its digits, the last first
zwl_digit:
  jldi j3, 10
  jdiv j4, j2, j3
  jmul j6, j4, j3
  jsub j6, j2, j6
  jldi j3, 48
  jadd j6, j6, j3
  jstb j6, j5, ZDIG
  jldi j3, 1
  jadd j5, j5, j3
  jadd j2, j4, j1
  jjnz j2, zwl_digit
  jldi j3, 30
  jadd j4, j5, j3
  jst j4, j1, ZLABN
  jldi j3, ZLAB + 30
zwl_put:
  jldi j4, 1
  jsub j5, j5, j4
  jldb j6, j5, ZDIG
  jstb j6, j3, 0
  jadd j3, j3, j4
  jjnz j5, zwl_put
  jret

; j3 bytes from j2 written as the file of the label ZLAB (ZLABN bytes), new. Uses j1-j14.
zw_write:
  jldi j1, 0
  jst j2, j1, ZW1
  jst j3, j1, ZW2
  jldi j10, 12
  jldi j11, ZLAB
  jld j12, j1, ZLABN
  jcall ask
  jldi j10, 4
  jldi j11, ZLAB
  jldi j1, 0
  jld j12, j1, ZLABN
  jcall ask
  jldi j1, 0
  jldi j2, 63
  jshr j2, j13, j2
  jjnz j2, zww_done
  jst j13, j1, HND
  jldi j2, 32
  jshl j10, j13, j2
  jldi j2, 6
  jor j10, j10, j2
  jld j11, j1, ZW1
  jld j12, j1, ZW2
  jcall ask
  jldi j1, 0
  jld j10, j1, HND
  jldi j2, 32
  jshl j10, j10, j2
  jldi j2, 7
  jor j10, j10, j2
  jcall ask
zww_done:
  jldi j1, 0
  jret

; The silhouettes of reading (Capitan, 2026-11-07: "the reading rules must not be lost, they must be enriched: they are
; logical silhouettes"): what the whole book teaches about reading it, kept as counts that add up over every book eaten.
; Each word's house verdict (its pieces), and the buildings it is in with the limit that closes each (the arrows,
; sentido.jsm); each limit, the buildings it closes. Buildings are counted as sentido counts them: the units between two
; limits, a renglon's end no limit, each word once per time it is said. Uses j1-j14.
zs_buildings:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZLIX
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZLW
  jst j1, j1, ZNLIM
  jld j10, j1, NV                 ; the limits, numbered in the order of their word
  jldi j9, 1
  jsub j10, j10, j9
  jwhile j10
    jldi j3, 24
    jmul j3, j9, j3
    jld j4, j1, ROOMCL
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, zbl_next
    jld j2, j1, ZNLIM
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ZLW
    jadd j3, j3, j4
    jst j9, j3, 0
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZNLIM
    jldi j3, 3
    jshl j3, j9, j3
    jld j4, j1, ZLIX
    jadd j3, j3, j4
    jst j2, j3, 0
  zbl_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jld j11, j1, NV                 ; the counts
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZAN
  jld j11, j1, NV
  jld j2, j1, ZNLIM
  jmul j11, j11, j2
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZACN
  jld j11, j1, ZNLIM
  jldi j2, 3
  jshl j11, j11, j2
  jldi j2, 8
  jadd j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, ZLC
  jst j1, j1, ZNBD
  jldi j2, 1
  jst j2, j1, ZAST
  jldi j9, 1
  jld j10, j1, NTOK
  jldi j2, 1
  jsub j10, j10, j2
  jldi j3, 63                     ; (fewer units than one: nothing to walk)
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
    jjz j2, zbw_next
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ZLIX
    jadd j3, j3, j4
    jld j3, j3, 0
    jjz j3, zbw_next
    jldi j4, 1                    ; a limit: the building before it closes with it
    jsub j3, j3, j4
    jst j3, j1, ZALI
    jld j5, j1, ZAST
    jsub j6, j9, j5
    jjz j6, zbw_closed
    jld j6, j1, ZNBD
    jadd j6, j6, j4
    jst j6, j1, ZNBD
    jldi j6, 3
    jshl j6, j3, j6
    jld j7, j1, ZLC
    jadd j6, j6, j7
    jld j7, j6, 0
    jadd j7, j7, j4
    jst j7, j6, 0
    jst j9, j1, ZW1
    jst j10, j1, ZW2
    zbw_word:
      jldi j1, 0
      jld j5, j1, ZAST
      jld j9, j1, ZW1
      jsub j6, j9, j5
      jjz j6, zbw_done
      jldi j2, 3
      jshl j2, j5, j2
      jld j3, j1, ROOMT
      jadd j2, j2, j3
      jld j2, j2, 0
      jldi j3, 1
      jadd j5, j5, j3
      jst j5, j1, ZAST
      jjz j2, zbw_word
      jst j2, j1, ZKL
      jcall w_mark
      jjnz j3, zbw_word
      jldi j1, 0
      jld j2, j1, ZKL
      jldi j3, 3
      jshl j3, j2, j3
      jld j4, j1, ZAN
      jadd j4, j4, j3
      jld j5, j4, 0
      jldi j6, 1
      jadd j5, j5, j6
      jst j5, j4, 0
      jld j4, j1, ZNLIM
      jmul j4, j2, j4
      jld j5, j1, ZALI
      jadd j4, j4, j5
      jldi j5, 3
      jshl j4, j4, j5
      jld j5, j1, ZACN
      jadd j4, j4, j5
      jld j5, j4, 0
      jadd j5, j5, j6
      jst j5, j4, 0
      jjmp zbw_word
    zbw_done:
    jld j10, j1, ZW2
  zbw_closed:
    jldi j1, 0
    jldi j2, 1
    jadd j2, j9, j2
    jst j2, j1, ZAST
  zbw_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jret

; The silhouettes of word ZID, in its piece's bits: the house's verdict in two bits (0 furniture, 1 not decided, 2
; foundation); the buildings it is in + 1, in gamma; how many limits close some of them + 1; and each such limit, its
; number + 1 and how many it closes, in gamma. Uses j1-j14.
zs_entry_sil:
  jldi j1, 0
  jld j2, j1, ZID
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ROOMSD
  jadd j3, j3, j2
  jld j3, j3, 0
  jldi j2, 1
  jjz j3, zse_v
  jldi j2, 0
  jldi j4, 63
  jsar j4, j3, j4
  jjnz j4, zse_v
  jldi j2, 2
  jld j2, j1, ZID               ; a foundation that is the book's switch of the no: 3 (the reading rule travels)
  jcall n_flags
  jldi j4, 1
  jand j3, j3, j4
  jldi j2, 2
  jadd j2, j2, j3
zse_v:
  jldi j3, 2
  jcall zb_put
  jldi j1, 0
  jld j2, j1, ZID
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZAN
  jadd j3, j3, j2
  jld j2, j3, 0
  jldi j3, 1
  jadd j2, j2, j3
  jcall zb_gamma
  jldi j1, 0                      ; how many limits close some of its buildings
  jst j1, j1, ZKL
  jst j1, j1, ZLI
  zse_count:
    jldi j1, 0
    jld j2, j1, ZLI
    jld j3, j1, ZNLIM
    jsub j3, j2, j3
    jjz j3, zse_counted
    jcall zs_cell
    jjz j2, zse_cnext
    jld j2, j1, ZKL
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZKL
  zse_cnext:
    jld j2, j1, ZLI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZLI
    jjmp zse_count
zse_counted:
  jld j2, j1, ZKL
  jldi j3, 1
  jadd j2, j2, j3
  jcall zb_gamma
  jldi j1, 0
  jst j1, j1, ZLI
  zse_each:
    jldi j1, 0
    jld j2, j1, ZLI
    jld j3, j1, ZNLIM
    jsub j3, j2, j3
    jjz j3, zse_done
    jcall zs_cell
    jjz j2, zse_enext
    jst j2, j1, ZKL
    jld j2, j1, ZLI
    jldi j3, 1
    jadd j2, j2, j3
    jcall zb_gamma
    jldi j1, 0
    jld j2, j1, ZKL
    jcall zb_gamma
  zse_enext:
    jldi j1, 0
    jld j2, j1, ZLI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZLI
    jjmp zse_each
zse_done:
  jldi j1, 0
  jret

; j2 = how many of word ZID's buildings limit ZLI closes. Uses j1-j4.
zs_cell:
  jldi j1, 0
  jld j2, j1, ZID
  jld j3, j1, ZNLIM
  jmul j2, j2, j3
  jld j3, j1, ZLI
  jadd j2, j2, j3
  jldi j3, 3
  jshl j2, j2, j3
  jld j3, j1, ZACN
  jadd j2, j2, j3
  jld j2, j2, 0
  jret

; Every word as the library keeps it (Capitan, 2026-11-07: "Razar studies silhouettes, it keeps no exact structure of
; anything; we only want its structure, not its content"): the eight bytes of the print of its letters (FNV-1a, the
; lowest first) in place of its letters, ROOMI and ROOMA then those. Asking finds a word by the print of the letters
; asked (pistas.inc, pz_hide), and the library never holds what a word says. Uses j1-j14.
hide_words:
  jldi j1, 0
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HDA
  jld j11, j1, NV
  jldi j2, 3
  jshl j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HDI
  jld j11, j1, NV
  jldi j2, 24
  jmul j11, j11, j2
  jcall room
  jldi j1, 0
  jst j13, j1, HDE
  jldi j9, 0
  jld j10, j1, NV
  jwhile j10
    jldi j3, 24                 ; its entry: {-, its place among the prints, 8 bytes}
    jmul j3, j9, j3
    jld j4, j1, HDE
    jadd j3, j3, j4
    jldi j4, 3
    jshl j4, j9, j4
    jst j4, j3, 8
    jldi j5, 8
    jst j5, j3, 16
    jld j5, j1, HDI
    jadd j5, j5, j4
    jst j3, j5, 0
    jjz j9, hd_next             ; (word 0 is none)
    jld j3, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j5, j3, 16
    jld j3, j3, 8
    jld j6, j1, ROOMA
    jadd j3, j3, j6
    jld j7, j1, FNVO
    jld j8, j1, FNVP
    jwhile j5
      jldb j6, j3, 0
      jxor j7, j7, j6
      jmul j7, j7, j8
      jldi j6, 1
      jadd j3, j3, j6
      jsub j5, j5, j6
    jwend
    jld j3, j1, HDA
    jadd j3, j3, j4
    jldi j5, 8
    jwhile j5
      jstb j7, j3, 0
      jldi j6, 8
      jshr j7, j7, j6
      jldi j6, 1
      jadd j3, j3, j6
      jsub j5, j5, j6
    jwend
  hd_next:
    jldi j2, 1
    jadd j9, j9, j2
    jsub j10, j10, j2
  jwend
  jld j2, j1, HDA
  jst j2, j1, ROOMA
  jld j2, j1, HDI
  jst j2, j1, ROOMI
  jret

; The bytes of the book's limits in the index -> ZQL: {how many, all the buildings}, then each {the buildings it closes,
; its bytes, its letters padded}. Uses j1-j14.
zs_limsize:
  jldi j1, 0
  jldi j2, 16
  jst j2, j1, ZQL
  jld j10, j1, ZNLIM
  jld j9, j1, ZLW
  jwhile j10
    jld j3, j9, 0
    jldi j4, 3
    jshl j3, j3, j4
    jld j4, j1, ROOMI
    jadd j3, j3, j4
    jld j3, j3, 0
    jld j2, j3, 16
    jcall zs_pad
    jldi j3, 16
    jadd j2, j2, j3
    jld j3, j1, ZQL
    jadd j3, j3, j2
    jst j3, j1, ZQL
    jldi j2, 8
    jadd j9, j9, j2
    jldi j2, 1
    jsub j10, j10, j2
  jwend
  jret

; The book's limits, at OUTR + ZOQ. Uses j1-j14.
zs_limwrite:
  jldi j1, 0
  jld j9, j1, OUTR
  jld j2, j1, ZOQ
  jadd j9, j9, j2
  jld j2, j1, ZNLIM
  jst j2, j9, 0
  jld j2, j1, ZNBD
  jst j2, j9, 8
  jldi j2, 16
  jadd j9, j9, j2
  jst j1, j1, ZLI
  zlw_lap:
    jldi j1, 0
    jld j2, j1, ZLI
    jld j3, j1, ZNLIM
    jsub j3, j2, j3
    jjz j3, zlw_done
    jldi j3, 3
    jshl j3, j2, j3
    jld j4, j1, ZLC
    jadd j4, j4, j3
    jld j4, j4, 0
    jst j4, j9, 0
    jld j4, j1, ZLW
    jadd j4, j4, j3
    jld j4, j4, 0
    jldi j5, 3
    jshl j4, j4, j5
    jld j5, j1, ROOMI
    jadd j4, j4, j5
    jld j4, j4, 0
    jld j5, j4, 16
    jst j5, j9, 8
    jld j3, j4, 8
    jld j6, j1, ROOMA
    jadd j3, j3, j6
    jst j9, j1, ZW1
    jldi j2, 16
    jadd j2, j9, j2
    jadd j4, j5, j1
    jcall zs_copy
    jldi j1, 0
    jld j9, j1, ZW1
    jld j2, j9, 8
    jcall zs_pad
    jldi j3, 16
    jadd j9, j9, j2
    jadd j9, j9, j3
    jld j2, j1, ZLI
    jldi j3, 1
    jadd j2, j2, j3
    jst j2, j1, ZLI
    jjmp zlw_lap
zlw_done:
  jret

include 'crece.inc'
include 'casa.inc'
include 'pulso.inc'
include 'organo.inc'
include 'negacion.inc'
include 'lectura.inc'
include 'carpeta.inc'
