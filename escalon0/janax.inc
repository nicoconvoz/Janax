; Janax v0 instruction encoding, emitted with FASM macros (escalon 0 notation).
; Word (32 bits, little-endian): op[0..7] rd[8..11] ra[12..15] imm16[16..31]; rb = imm16[16..19].
; Mnemonics carry a "j" prefix so they never clash with x86 mnemonics or FASM operators.

j0 = 0
j1 = 1
j2 = 2
j3 = 3
j4 = 4
j5 = 5
j6 = 6
j7 = 7
j8 = 8
j9 = 9
j10 = 10
j11 = 11
j12 = 12
j13 = 13
j14 = 14
j15 = 15

macro j_word op, rd, ra, imm { dd (op) or ((rd) shl 8) or ((ra) shl 12) or (((imm) and 0FFFFh) shl 16) }

macro jhalt              { j_word 00h, 0, 0, 0 }
macro jldi rd, imm       { j_word 01h, rd, 0, imm }
macro jadd rd, ra, rb    { j_word 02h, rd, ra, rb }
macro jsub rd, ra, rb    { j_word 03h, rd, ra, rb }
macro jmul rd, ra, rb    { j_word 04h, rd, ra, rb }
macro jdiv rd, ra, rb    { j_word 05h, rd, ra, rb }
macro jshl rd, ra, rb    { j_word 06h, rd, ra, rb }
macro jshr rd, ra, rb    { j_word 07h, rd, ra, rb }
macro jsar rd, ra, rb    { j_word 08h, rd, ra, rb }
macro jand rd, ra, rb    { j_word 09h, rd, ra, rb }
macro jor rd, ra, rb     { j_word 0Ah, rd, ra, rb }
macro jxor rd, ra, rb    { j_word 0Bh, rd, ra, rb }
macro jjmp target        { j_word 0Ch, 0, 0, ((target) - $ - 4) / 4 }
macro jjz rd, target     { j_word 0Dh, rd, 0, ((target) - $ - 4) / 4 }
macro jjnz rd, target    { j_word 0Eh, rd, 0, ((target) - $ - 4) / 4 }
macro jshi rd, imm       { j_word 0Fh, rd, 0, imm }

; Memory: 64-bit accesses must be 8-byte aligned; byte accesses zero-extend on load.
macro jld rd, ra, imm    { j_word 10h, rd, ra, imm }
macro jst rd, ra, imm    { j_word 11h, rd, ra, imm }
macro jldb rd, ra, imm   { j_word 12h, rd, ra, imm }
macro jstb rd, ra, imm   { j_word 13h, rd, ra, imm }

; Calls use a separate return stack the program cannot read or overwrite.
macro jcall target       { j_word 14h, 0, 0, ((target) - $ - 4) / 4 }
macro jret               { j_word 15h, 0, 0, 0 }

; Janax OS window: rd = requests attended; ra = address of the request queue in the cabin.
; Queue: count (8 bytes), then count entries of 32 bytes: type, a, b, result. Only inside Janax OS.
macro jsys rd, ra        { j_word 16h, rd, ra, 0 }
