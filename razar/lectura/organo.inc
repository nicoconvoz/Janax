; The organ Razar grows (Capitan: "Legos, and inside the Legos free mutation of code"), read and not compiled: the
; program is always the same and its letters are data, ORGW (four bits each from the lowest; 0 = none), from its
; initial data (X.datos): a candidate is launched as this same program with the letters it has to try written in its
; own hijo.datos, and an organ that wins stays as data in pulso.datos (Capitan: "anyone can change the data of a
; program without touching the program"). The head looks only at windows of four words (WAT); each letter mixes a word
; into the frame or posts the one in a hole, on the words floor, in a mold of its own (102h). Letters 1-9 are its
; instructions; any string of them is an organ, so a mutation (a letter put in, taken out or changed) can never break
; it: what it does is the exam's to judge. A frame is made only of its letters: after each hole it starts again from
; the mold. The frame's hash travels in j2 from letter to letter (hw takes and gives it back), so the reading of the
; letters uses only j13 and j14. Measured: the same fingerprint as the compiled organ, bit by bit (genome 0x8321 on the
; NT: 0000DDE5FD0394D4), and 0.7 % more instructions.
; ITS SENSES (the Capitan, 2026-11-19: "organos reales que le den nuevos sentidos", "que se inspire de lo que come"): the
; letters beyond 9 are looks the nine cannot give, taken from what its own eating already measured, and each mixes what
; it sees into the frame as 1 to 4 do. A sees the word behind the window (the row of the text goes on there; 0 at the
; start of a line, the edge no window holds). F sees the fourth word blurred: how often it read it where it learns
; (ROOMC), so every word it never read looks the same and the frame also fits what it never met. Measured on the NT
; (poetico/sentidos.py): 38A516 = 14775 and F38516 = 13588, against 11496 of 38516. B to E are free: the other four
; looks of that space (the word ahead; the first, second and third blurred) were measured and did not beat the sentence
; they were put in, so they wait written in sentidos.py, not here. A program built before them skips their letters.
; ITS EYE (the Capitan: "si, que los genere"): so that a sense is not a letter somebody writes but a sentence anyone
; can grow, the organ has an eye, and three letters move it. B: a word back. C: a word ahead. D: blurred, or sharp
; again. Every look after them (1 to 4, the holes 5 to 8, A, F) is taken from where the eye is and as the eye is: "BB1"
; mixes the word two behind the window's first, "D2" the second word blurred, "C8" asks for the word after the
; window. A hole says its word as it is (blurred it would announce a count, not a word), and after a hole the eye is
; at rest again, as the frame starts again. Out of the row there is nothing: the look is 0, as at the edge of a line.
; A string of letters is still an organ whatever it holds, so the mutation that grows organs grows senses. E is free.
ORGW  = 30h                     ; its letters and the audit's garbage, in the initial data of every program that
ORGF  = 38h                     ; includes it: 30h to 3Fh of its X.datos are the organ's (zeros: no organ)
ORGL  = 3800h                   ; the letters still to read
ORGX  = 37F0h                   ; its letters beyond the sixteenth (a recipe of Luma's has up to 31: the same recipe is her
                                ; form and her organ, whole), set by who has them (pulso.jsm: a candidate); 0 = none.
; ITS WORDS (the Capitan: "codigo poetico: engranajes como palabras, programas como oraciones"; "una oracion que ya
; funciona se asciende a palabra"; 2026-11-20: "arma ya lo de la oracion poetica"). E is no longer free: E and the
; letter after it, k, say WORD k here: its letters are read in this place, one after another, as if they were written
; in it (the eye and the frame go on as they are). The words are data, never code: sixteen bytes each from ORGT (its
; letters as an organ's, two words of sixteen), put there by who launches it (Luma: her eight living forms are her
; words, gen_leer.py), so a sentence of words runs without anything being built again. Inside a word E says nothing
; (and takes its number with it): a word is said whole and flat, so no word can call itself for ever. An E with no
; letter after it in its sixteen, a number above 8, or an empty word: nothing. A program with no words has zeros
; there, and E says nothing in it, as before.
ORGT0 = 7EF0h                   ; (a word's two halves, counted from its number times sixteen)
ORGT1 = 7EF8h
ORGT  = 7F00h                   ; the words: 8 x {its first sixteen letters, the ones beyond}
; ITS GEARS (the Capitan: "Legos, and inside the Legos free mutation of code"; 2026-11-20: "lo importante no es comer
; el programa sino desarticularlo en engranajes que sean legos para que Luma arme su propio software a medida"). A
; gear is a piece of a real program (engranajes.py takes it apart: what it repeats, said once, saves bits): up to
; fifteen instructions that only reckon with registers. Here a gear is a LENS of the eye. E, then a letter from 9 to
; F, then any letter, say gear ((first - 9) * 15 + second): from then on every look passes through it before it is
; mixed into the frame. Its little machine has sixteen registers, every one of them starting as the look; the gear's
; instructions run on them as they are written, and the look becomes what the last one left. Lenses stack (the last
; said looks first; eight at most, the oldest falls), and a hole puts the eye at rest, lenses off, as it does with
; where it is. A gear can not break anything: its instructions are done here one by one, only the ones that reckon
; (constants, + - * shifts, and or xor), on its own sixteen registers; anything else is passed over. The gears are
; data (80h bytes each from ORGGT: how many instructions, then each one, a word of the Janax language): put there
; by who launches it. A program with no gears has zeros there, and its lenses change nothing.
; ITS TISSUES (the Capitan, 2026-11-20: "rearticular por tipo de celula en evolucion... no es lo mismo una neurona que
; la celula de la piel o del ojo o del corazon"; "no acotes: los tejidos pueden ser alas, pueden ser escamas, pueden
; ser lo que sea"). The same gear is a different cell in each tissue it is expressed in, and a tissue is anything of
; hers a gear can pass through. So a CELL is four letters: E, the two that say its gear ((first - 9) * 15 + second,
; from 1 to 105), and one that says its TISSUE, 1 to F. The tissues that are of this organ:
;   1  her looks        a lens: every look passes through the gear until the next hole.
;   2  the frame        what has been mixed so far passes through it, once, here: what the sentence associates.
;   3  where her eye is how many words back or ahead it looks, through the gear.
;   4  how her eye sees sharp or blurred, through the gear (anything but 0 is blurred).
;   7  her heart        (the Capitan: "el corazon es el propio kernel") the kernel gives every cabin its turn from its
;                       bolita, the fraction of its time that is real work (request 20). The bolita of the cabin that
;                       says the cell passes through the gear and is asked of the kernel, which cuts it down to the
;                       one it was launched with (its law: nobody gives itself more than it was given) and gives its
;                       turn again from it. Until the next hole, where the heart is at rest: the turn it was given.
;                       The kernel is asked only when the turn changes: a cell that leaves it as it is asks nothing.
;   8  ANY PLACE OF HERS, said by the cell itself: four letters more, a number in base fifteen (each letter less one,
;                       the first the highest), say which word of this reader's memory. That word passes through the
;                       gear, once, here. She opens such a tissue herself, by saying it (gen_leer.py: rp_lens); no
;                       list of places is kept anywhere. Four letters reach 50625 words: all it is born with (its
;                       initial data, 4080 words) and beyond. A place it does not have ends this reader (the kernel
;                       ends who reads outside its memory), and her body knows a reading that said nothing as the
;                       worst; one that never ends is ended by the cage she gives it (gen_leer.py: r_read_launch).
;                       Cut by the end of its sixteen letters, it is no cell.
; Any other number is of another part of her (her body: gen_leer.py) or of no tissue yet: it does nothing here, and
; it is free for whatever tissue comes. Nobody says which tissue a gear is for: a recipe says the cell it wants, and
; the cell that pays where it is expressed is the one that stays alive in her.
ORGGT0 = 4380h                  ; (a gear, counted from its number times 80h; its instructions)
ORGGT1 = 4388h
ORGGT = 4400h                   ; the gears: 105 x {its instructions, up to fifteen of them}
ORGV  = 7D80h                   ; the little machine's sixteen registers
ORGP  = 7E00h                   ; the lenses on the eye (a byte each: its gear's number, the last said lowest)
ORGPL = 7E08h                   ; the ones still to look through
ORGN  = 7E10h                   ; a cell being said: its gear
ORGB  = 7E18h                   ; her heart: the bolita this cabin has, plus one (0: not asked yet)
ORGBT = 7E40h                   ; the one it was launched with: the most it may have
ORGH  = 7E20h                   ; 1 = her heart is not at rest (a cell changed its bolita since the last hole)
ORGS1 = 7E28h                   ; the eye, kept while the kernel is asked (a request uses its registers)
ORGS2 = 7E30h
ORGA  = 7E38h                   ; a cell on a place of hers: its address
ORGQ1 = 37F8h                   ; what is still to read after the letters being read, in order (three at most: the
ORGQ2 = 37E8h                   ; rest of a word, the rest of the sentence, the sentence's letters beyond the sixteenth)
ORGQ3 = 37E0h
ORGIN = 37D8h                   ; inside a word: how many of those belong to it or come back from it
organ:
  jldi j1, 0                    ; no letters, no organ: nothing is touched (as a program that never grew one)
  jld j2, j1, ORGW
  jjnz j2, og_some
  jret
og_some:
  jldi j1, 0                    ; (the machine as the organ gets it: all 0, or all 1 for ORGF 1, the audit's garbage:
  jld j3, j1, ORGF              ; an organ that reads nothing but its own scores the same with either)
  jsub j2, j1, j3
  jadd j3, j2, j1
  jadd j4, j2, j1
  jadd j5, j2, j1
  jadd j6, j2, j1
  jadd j7, j2, j1
  jadd j8, j2, j1
  jadd j9, j2, j1
  jadd j10, j2, j1
  jadd j11, j2, j1
  jadd j12, j2, j1
  jadd j13, j2, j1
  jadd j14, j2, j1
  jld j9, j1, WAT
  jld j3, j9, 0
  jjz j3, og_done
  jld j3, j9, 8
  jjz j3, og_done
  jld j3, j9, 16
  jjz j3, og_done
  jld j3, j9, 24
  jjz j3, og_done
  jst j1, j1, KW1
  jst j1, j1, KW2
  jst j1, j1, KW3
  jldi j2, 2
  jst j2, j1, FLOOR
  jld j2, j1, FNVO
  jldi j3, 102h
  jcall0 j1, hw
  jldi j10, 0                   ; the eye at rest: where the window is, and sharp
  jldi j11, 0
  jld j13, j1, ORGX
  jst j13, j1, ORGQ1
  jst j1, j1, ORGQ2
  jst j1, j1, ORGQ3
  jst j1, j1, ORGIN
  jst j1, j1, ORGP
  jld j13, j1, ORGW
  jst j13, j1, ORGL
jwhile j13
  jldi j14, 15
  jand j14, j13, j14
  jldi j1, 4
  jshr j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGL
  jldi j13, 1
  jsub j13, j14, j13
  jjz j13, og_l1
  jldi j13, 2
  jsub j13, j14, j13
  jjz j13, og_l2
  jldi j13, 3
  jsub j13, j14, j13
  jjz j13, og_l3
  jldi j13, 4
  jsub j13, j14, j13
  jjz j13, og_l4
  jldi j13, 5
  jsub j13, j14, j13
  jjz j13, og_l5
  jldi j13, 6
  jsub j13, j14, j13
  jjz j13, og_l6
  jldi j13, 7
  jsub j13, j14, j13
  jjz j13, og_l7
  jldi j13, 8
  jsub j13, j14, j13
  jjz j13, og_l8
  jldi j13, 9
  jsub j13, j14, j13
  jjz j13, og_l9
  jldi j13, 10
  jsub j13, j14, j13
  jjz j13, og_lA
  jldi j13, 11
  jsub j13, j14, j13
  jjz j13, og_lB
  jldi j13, 12
  jsub j13, j14, j13
  jjz j13, og_lC
  jldi j13, 13
  jsub j13, j14, j13
  jjz j13, og_lD
  jldi j13, 14
  jsub j13, j14, j13
  jjz j13, og_lE
  jldi j13, 15
  jsub j13, j14, j13
  jjz j13, og_lF
jwcheck
og_lap:
  jldi j1, 0
  jld j13, j1, ORGL
  jjnz j13, og_more             ; these are read: what waits after them, the next that has letters
  jld j13, j1, ORGQ1
  jld j14, j1, ORGQ2
  jst j14, j1, ORGQ1
  jld j14, j1, ORGQ3
  jst j14, j1, ORGQ2
  jst j1, j1, ORGQ3
  jld j14, j1, ORGIN
  jjz j14, og_pop1
  jldi j1, 1
  jsub j14, j14, j1
  jldi j1, 0
  jst j14, j1, ORGIN
og_pop1:
  jjnz j13, og_more
  jld j13, j1, ORGQ1
  jld j14, j1, ORGQ2
  jst j14, j1, ORGQ1
  jld j14, j1, ORGQ3
  jst j14, j1, ORGQ2
  jst j1, j1, ORGQ3
  jld j14, j1, ORGIN
  jjz j14, og_pop2
  jldi j1, 1
  jsub j14, j14, j1
  jldi j1, 0
  jst j14, j1, ORGIN
og_pop2:
  jjnz j13, og_more
  jld j13, j1, ORGQ1
  jld j14, j1, ORGQ2
  jst j14, j1, ORGQ1
  jld j14, j1, ORGQ3
  jst j14, j1, ORGQ2
  jst j1, j1, ORGQ3
  jld j14, j1, ORGIN
  jjz j14, og_pop3
  jldi j1, 1
  jsub j14, j14, j1
  jldi j1, 0
  jst j14, j1, ORGIN
og_pop3:
  jjnz j13, og_more
og_more:
jwend
jjmp og_done
og_l1:
  jldi j5, 0                   ; the first word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
og_l2:
  jldi j5, 1                   ; the second word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
og_l3:
  jldi j5, 2                   ; the third word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
og_l4:
  jldi j5, 3                   ; the fourth word into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
og_l5:
  jldi j5, 0                   ; the hole: the first word, as it is
  jldi j11, 0
  jldi j1, 0                    ; (a hole says its word as it is: no lens)
  jst j1, j1, ORGP
  jcall og_rest
  jcall og_look
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jjmp og_lap
og_l6:
  jldi j5, 1                   ; the hole: the second word, as it is
  jldi j11, 0
  jldi j1, 0                    ; (a hole says its word as it is: no lens)
  jst j1, j1, ORGP
  jcall og_rest
  jcall og_look
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jjmp og_lap
og_l7:
  jldi j5, 2                   ; the hole: the third word, as it is
  jldi j11, 0
  jldi j1, 0                    ; (a hole says its word as it is: no lens)
  jst j1, j1, ORGP
  jcall og_rest
  jcall og_look
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jjmp og_lap
og_l8:
  jldi j5, 3                   ; the hole: the fourth word, as it is
  jldi j11, 0
  jldi j1, 0                    ; (a hole says its word as it is: no lens)
  jst j1, j1, ORGP
  jcall og_rest
  jcall og_look
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jjmp og_lap
og_l9:
  jcall og_rest
  jldi j3, 0                    ; the hole empty: the frame said as it is
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jldi j11, 0
  jjmp og_lap
og_lA:
  jldi j5, -1                   ; a sense: the word behind the window into the frame
  jcall og_look
  jcall hw
  jjmp og_lap
og_lB:
  jldi j5, 1                    ; the eye, a word back
  jsub j10, j10, j5
  jjmp og_lap
og_lC:
  jldi j5, 1                    ; the eye, a word ahead
  jadd j10, j10, j5
  jjmp og_lap
og_lE:
  jldi j1, 0                    ; a word: its number is the letter after this one
  jld j13, j1, ORGL
  jjz j13, og_lap
  jldi j14, 15
  jand j14, j13, j14
  jldi j1, 4
  jshr j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGL
  jldi j13, 9
  jsub j13, j14, j13
  jjnn j13, og_lens             ; 9 to F: not a word, a gear
  jld j13, j1, ORGIN            ; (inside a word, a word says nothing)
  jjnz j13, og_lap
  jldi j13, 4
  jshl j14, j14, j13
  jld j13, j14, ORGT0
  jjz j13, og_lap
  jld j13, j1, ORGQ1            ; after the word: the rest of the sentence, then its letters beyond the sixteenth
  jst j13, j1, ORGQ3
  jld j13, j1, ORGL
  jst j13, j1, ORGQ2
  jld j13, j14, ORGT1
  jst j13, j1, ORGQ1
  jld j13, j14, ORGT0
  jst j13, j1, ORGL
  jldi j13, 2
  jst j13, j1, ORGIN
  jjmp og_lap
og_lens:
  jld j13, j1, ORGL             ; a cell: the second letter of its gear
  jjz j13, og_lap
  jldi j1, 9
  jsub j14, j14, j1
  jldi j1, 15
  jmul j14, j14, j1
  jand j1, j13, j1
  jadd j14, j14, j1             ; its gear, from 1
  jldi j1, 4
  jshr j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGL
  jst j14, j1, ORGN
  jjz j13, og_lap               ; and its tissue
  jldi j14, 15
  jand j14, j13, j14
  jldi j1, 4
  jshr j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGL
  jld j13, j1, ORGN
  jldi j1, 1
  jsub j1, j14, j1
  jjz j1, og_eye
  jldi j1, 2
  jsub j1, j14, j1
  jjz j1, og_t2
  jldi j1, 3
  jsub j1, j14, j1
  jjz j1, og_t3
  jldi j1, 4
  jsub j1, j14, j1
  jjz j1, og_t4
  jldi j1, 7
  jsub j1, j14, j1
  jjz j1, og_t7
  jldi j1, 8
  jsub j1, j14, j1
  jjz j1, og_t8
  jjmp og_lap                   ; of another part of her, or of no tissue yet
og_t7:
  jldi j1, 0                    ; her heart: the bolita of this cabin through the gear, asked of the kernel (20)
  jst j10, j1, ORGS1
  jst j11, j1, ORGS2
  jld j3, j1, ORGB
  jjnz j3, og_t7_has
  jldi j10, 20                  ; (not asked yet: the one it was launched with, which is the most it may have)
  jldi j11, -1
  jcall ask
  jldi j1, 0
  jst j13, j1, ORGBT
  jldi j1, 1
  jadd j3, j13, j1
  jldi j1, 0
  jst j3, j1, ORGB
og_t7_has:
  jldi j1, 1
  jsub j3, j3, j1
  jldi j1, 0
  jld j13, j1, ORGN
  jldi j1, 7
  jshl j9, j13, j1
  jcall og_gear
  jld j13, j1, ORGBT            ; the kernel's law, known here: never more than it was launched with (a number that
  jjn j3, og_t7_top             ; is not a fraction of its time is the most there is)
  jsub j14, j13, j3
  jjnn j14, og_t7_cut
og_t7_top:
  jadd j3, j13, j1
og_t7_cut:
  jld j13, j1, ORGB             ; and the kernel is asked only if its turn changes (nothing is sent that says nothing)
  jldi j14, 1
  jsub j13, j13, j14
  jsub j13, j13, j3
  jjz j13, og_t7_same
  jldi j10, 20
  jadd j11, j3, j1
  jcall ask
  jldi j1, 1
  jadd j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGB
  jldi j13, 1
  jst j13, j1, ORGH
og_t7_same:
  jldi j1, 0
  jld j10, j1, ORGS1
  jld j11, j1, ORGS2
  jjmp og_lap
og_t8:
  jldi j9, 0                    ; a place of hers: its four letters, a number in base fifteen
  jldi j4, 4
og_t8_lap:
  jldi j1, 0
  jld j13, j1, ORGL
  jjz j13, og_lap               ; (cut by the end of its sixteen: no cell)
  jldi j14, 15
  jand j14, j13, j14
  jldi j1, 4
  jshr j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGL
  jldi j1, 15
  jmul j9, j9, j1
  jadd j9, j9, j14
  jldi j1, 1
  jsub j9, j9, j1
  jsub j4, j4, j1
  jjnz j4, og_t8_lap
  jldi j1, 3
  jshl j9, j9, j1
  jldi j1, 0
  jst j9, j1, ORGA
  jld j3, j9, 0                 ; that word of hers, through the gear
  jld j13, j1, ORGN
  jldi j1, 7
  jshl j9, j13, j1
  jcall og_gear
  jld j9, j1, ORGA
  jst j3, j9, 0
  jjmp og_lap
; Her heart at rest: the turn this cabin was given (its bolita as it was launched), if a cell changed it. Keeps the
; eye. Uses j13, j14 (j1 = 0 after).
og_rest:
  jldi j1, 0
  jld j13, j1, ORGH
  jjz j13, og_rest_d
  jst j1, j1, ORGH
  jst j10, j1, ORGS1
  jst j11, j1, ORGS2
  jldi j10, 20
  jldi j11, -1
  jcall ask
  jldi j1, 1
  jadd j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGB
  jld j10, j1, ORGS1
  jld j11, j1, ORGS2
og_rest_d:
  jldi j1, 0
  jret
og_t2:
  jldi j1, 0
  jadd j3, j2, j1
  jldi j1, 7
  jshl j9, j13, j1
  jcall og_gear
  jldi j1, 0
  jadd j2, j3, j1
  jjmp og_lap
og_t3:
  jldi j1, 0
  jadd j3, j10, j1
  jldi j1, 7
  jshl j9, j13, j1
  jcall og_gear
  jldi j1, 0
  jadd j10, j3, j1
  jjmp og_lap
og_t4:
  jldi j1, 0
  jadd j3, j11, j1
  jldi j1, 7
  jshl j9, j13, j1
  jcall og_gear
  jldi j1, 0
  jadd j11, j3, j1
  jjmp og_lap
og_eye:
  jldi j1, 0                    ; her looks: a lens more
  jld j14, j1, ORGP
  jldi j1, 8
  jshl j14, j14, j1
  jor j14, j14, j13
  jldi j1, 0
  jst j14, j1, ORGP
  jjmp og_lap
og_lD:
  jldi j5, 1                    ; the eye blurred, or sharp again
  jxor j11, j11, j5
  jjmp og_lap
og_lF:
  jldi j1, 0                    ; a sense: the fourth word, blurred (how often it was read where it learns), into the
  jadd j8, j11, j1              ; frame, however the eye is
  jldi j11, 1
  jldi j5, 3
  jcall og_look
  jadd j11, j8, j1
  jcall hw
  jjmp og_lap
og_done:
  jcall og_rest
  jldi j1, 0
  jret

; The look of the eye at the word j5 of the window (0 its first; the eye's place, j10 words, added) -> j3: the word
; as it is, or how often it was read where it learns (ROOMC) if the eye is blurred (j11); 0 out of the row. The row
; is the text's (ROOMT, NTOK units) and the window is a place of it (WAT). Then through the lenses on the eye, if any.
; Uses j1, j4, j6, j7, j9, j13, j14 (j1 = 0 after).
og_look:
  jldi j1, 0
  jld j9, j1, WAT
  jld j7, j1, ROOMT
  jsub j9, j9, j7
  jldi j6, 3
  jsar j9, j9, j6
  jadd j9, j9, j10
  jadd j9, j9, j5               ; its place in the row
  jldi j3, 0
  jldi j6, 63
  jsar j7, j9, j6
  jjnz j7, ol_out               ; before the row
  jld j7, j1, NTOK
  jsub j7, j9, j7
  jsar j7, j7, j6
  jjz j7, ol_out                ; after it
  jldi j6, 3
  jshl j9, j9, j6
  jld j7, j1, ROOMT
  jadd j9, j9, j7
  jld j3, j9, 0
  jjz j11, ol_out               ; sharp: the word
  jshl j3, j3, j6
  jld j7, j1, ROOMC
  jadd j3, j3, j7
  jld j3, j3, 0
ol_out:
  jldi j1, 0                    ; the lenses on the eye: the look passes through each gear (see ITS GEARS)
  jld j13, j1, ORGP
  jjz j13, ol_ret
ol_lens:
  jldi j1, 255
  jand j9, j13, j1
  jldi j1, 8
  jshr j13, j13, j1
  jldi j1, 0
  jst j13, j1, ORGPL
  jldi j1, 7
  jshl j9, j9, j1
  jcall og_gear
  jldi j1, 0
  jld j13, j1, ORGPL
  jjnz j13, ol_lens
ol_ret:
  jldi j1, 0
  jret

; The gear at j9 (its number, from 1, times 80h) run on its little machine: sixteen registers, every one starting as
; j3; its instructions as they are written; -> j3 what the last one left. Uses j1, j4, j6, j7, j9, j13, j14.
og_gear:
  jldi j1, 0
  jst j3, j1, ORGV
  jst j3, j1, ORGV + 8
  jst j3, j1, ORGV + 16
  jst j3, j1, ORGV + 24
  jst j3, j1, ORGV + 32
  jst j3, j1, ORGV + 40
  jst j3, j1, ORGV + 48
  jst j3, j1, ORGV + 56
  jst j3, j1, ORGV + 64
  jst j3, j1, ORGV + 72
  jst j3, j1, ORGV + 80
  jst j3, j1, ORGV + 88
  jst j3, j1, ORGV + 96
  jst j3, j1, ORGV + 104
  jst j3, j1, ORGV + 112
  jst j3, j1, ORGV + 120
  jld j7, j9, ORGGT0
  jldi j1, 15
  jand j7, j7, j1
ol_ins:
  jjz j7, og_gear_end
  jld j6, j9, ORGGT1            ; an instruction: its first operand, its constant, what it does, where it leaves it
  jldi j1, 12
  jshr j13, j6, j1
  jldi j1, 15
  jand j13, j13, j1
  jldi j1, 3
  jshl j13, j13, j1
  jld j13, j13, ORGV
  jldi j1, 16
  jshr j14, j6, j1
  jldi j1, 255
  jand j4, j6, j1
  jldi j1, 8
  jshr j6, j6, j1
  jldi j1, 15
  jand j6, j6, j1
  jldi j1, 3
  jshl j6, j6, j1
  jldi j1, 1                    ; a constant
  jsub j1, j4, j1
  jjnz j1, ol_o2
  jldi j1, 48
  jshl j3, j14, j1
  jsar j3, j3, j1
  jjmp ol_put
ol_o2:
  jldi j1, 15                   ; sixteen bits more of a constant
  jsub j1, j4, j1
  jjnz j1, ol_o3a
  jld j3, j6, ORGV
  jldi j1, 16
  jshl j3, j3, j1
  jor j3, j3, j14
  jjmp ol_put
ol_o3a:
  jldi j1, 15                   ; the others reckon with a second register
  jand j14, j14, j1
  jldi j1, 3
  jshl j14, j14, j1
  jld j14, j14, ORGV
ol_o3:
  jldi j1, 2
  jsub j1, j4, j1
  jjnz j1, ol_o4
  jadd j3, j13, j14
  jjmp ol_put
ol_o4:
  jldi j1, 3
  jsub j1, j4, j1
  jjnz j1, ol_o5
  jsub j3, j13, j14
  jjmp ol_put
ol_o5:
  jldi j1, 4
  jsub j1, j4, j1
  jjnz j1, ol_o6
  jmul j3, j13, j14
  jjmp ol_put
ol_o6:
  jldi j1, 6
  jsub j1, j4, j1
  jjnz j1, ol_o7
  jshl j3, j13, j14
  jjmp ol_put
ol_o7:
  jldi j1, 7
  jsub j1, j4, j1
  jjnz j1, ol_o8
  jshr j3, j13, j14
  jjmp ol_put
ol_o8:
  jldi j1, 8
  jsub j1, j4, j1
  jjnz j1, ol_o9
  jsar j3, j13, j14
  jjmp ol_put
ol_o9:
  jldi j1, 9
  jsub j1, j4, j1
  jjnz j1, ol_o10
  jand j3, j13, j14
  jjmp ol_put
ol_o10:
  jldi j1, 10
  jsub j1, j4, j1
  jjnz j1, ol_o11
  jor j3, j13, j14
  jjmp ol_put
ol_o11:
  jldi j1, 11
  jsub j1, j4, j1
  jjnz j1, ol_o12
  jxor j3, j13, j14
  jjmp ol_put
ol_o12:
  jjmp ol_skip                  ; anything else is passed over
ol_put:
  jst j3, j6, ORGV
ol_skip:
  jldi j1, 8
  jadd j9, j9, j1
  jldi j1, 1
  jsub j7, j7, j1
  jjmp ol_ins
og_gear_end:
  jldi j1, 0
  jret

