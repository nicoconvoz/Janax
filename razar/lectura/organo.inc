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
ORGL2 = 37F8h                   ; form and her organ, whole), set by who has them (pulso.jsm: a candidate); 0 = none. And
                                ; the ones of them still to read. Up to sixteen letters nothing changes.
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
  jst j13, j1, ORGL2
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
  jldi j13, 15
  jsub j13, j14, j13
  jjz j13, og_lF
jwcheck
og_lap:
  jldi j1, 0
  jld j13, j1, ORGL
  jjnz j13, og_more
  jld j13, j1, ORGL2            ; the first sixteen are read: the ones beyond, once
  jst j1, j1, ORGL2
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
  jcall og_look
  jcall0 j1, post               ; (a frame is made only of its letters: after a hole, it starts again, and the
  jld j2, j1, FNVO              ; eye is at rest)
  jldi j3, 102h
  jcall hw
  jldi j10, 0
  jjmp og_lap
og_l9:
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
  jldi j1, 0
  jret

; The look of the eye at the word j5 of the window (0 its first; the eye's place, j10 words, added) -> j3: the word
; as it is, or how often it was read where it learns (ROOMC) if the eye is blurred (j11); 0 out of the row. The row
; is the text's (ROOMT, NTOK units) and the window is a place of it (WAT). Uses j1, j6, j7, j9 (j1 = 0 after).
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
  jldi j1, 0
  jret

