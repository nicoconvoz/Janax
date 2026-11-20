"""engranajes.py <program or book>... [how many] [--puros]: takes code apart into its gears (the Capitan, 2026-11-20:
"lo importante no es comer el programa antes sino desarticularlo en engranajes que sean legos para que Luma arme su
propio software a medida"; "que coma y desarticule todo y vuelva a articular a nivel celular").

A program eaten whole teaches little, and pieces cut blindly do nothing (measured in v0.59: legos.py azar). A gear is
a piece the code itself repeats: said once and named, it saves bits. That is her own judge (MDL), with nothing set
by hand:

    a piece of L instructions said n times saves   n * (L - 1) - L   instructions
    (each time it is said costs one name instead of L; saying what it is costs L, once)

How a piece is recognised as the same one:
  - only instructions that follow one another: a jump, a call, a return, a request, a halt or a place one can jump
    to ends the piece (a gear has one way in and one way out, so gears can be put one after another: that is what
    makes them legos);
  - the registers are named by the order in which the piece uses them (r0, r1, ...): the same work done with other
    registers, or with other variables, is the same gear; constants and offsets are part of it.
Pieces of 2 to 8 instructions (criterion: longer ones were not seen repeated enough to pay, and the search is
quadratic in it). The gears are taken greedily, the one that saves most first; an instruction belongs to one gear.

ANY CODE, ONE RULE. Whatever is given is taken apart together, as one body of code, and a piece said in two of them
counts in both. What each one is, is told by what it holds, not by its name:
  - a Janax program (bytes): its instructions as they are;
  - a text: every line that only reckons is an instruction, in whichever of the two notations it is written:
        the assembler's      mov add sub and or xor imul shl shr sar inc dec neg not, on registers and constants
        the infix one        x = a, x = a op b, x op= a, x++, x--  (op: + - * << >> & | ^)  (C, Lua, any like them)
    and is said in the Janax language (a constant takes one instruction more to be loaded; the registers of a
    processor are its 64-bit ones: the same work in its 32-bit half is the same gear). Empty lines and comments
    are passed over; any other line ends the piece (a label, a brace, a call, memory: what is not known to only
    reckon is not a gear);
  - a book of machine code (a text of bytes in hexadecimal: comer_codigo.py --maquina): the program it says. A
    Janax program as above; a program of the host's processor is first said in the assembler's notation by objdump,
    if this machine has one (it is not ours: without it that book is passed over, and said so), cut at every
    place its own jumps go to.
A source whose bytes were already given is passed over (the same program said twice is one program).

--puros: only gears that touch no memory (registers and constants): the ones a small machine can run anywhere without
being able to break anything (and no division: there is nothing to divide by when a register is 0). A text gives
only such.
--tabla <file>: also writes those gears as her reader takes them (organo.inc: ORGGT): 80h bytes each, how many
instructions and then each one as a word of the Janax language with its registers named 0, 1, 2... A gear with more
than sixteen registers is left out (her little machine has sixteen). Prints each gear with what it saves, how many
times it is said (and in which of the sources), and its code."""
import bisect, collections, os, re, shutil, struct, subprocess, sys, tempfile

NAMES = {0x01: "jldi", 0x02: "jadd", 0x03: "jsub", 0x04: "jmul", 0x05: "jdiv", 0x06: "jshl", 0x07: "jshr", 0x08: "jsar",
         0x09: "jand", 0x0A: "jor", 0x0B: "jxor", 0x0F: "jshi", 0x10: "jld", 0x11: "jst", 0x12: "jldb", 0x13: "jstb",
         0x1A: "jldadd", 0x1B: "jldx"}
THREE = {0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x1B}      # rd, ra, rb
MEMORY = {0x10, 0x11, 0x12, 0x13, 0x1A, 0x1B}
LMIN, LMAX = 2, 8

# ---- a Janax program: its instructions as they are -> runs of (op, rd, ra, rb or constant)
def fields(w):
    op, rd, ra, imm = w & 255, w >> 8 & 15, w >> 12 & 15, w >> 16
    if op in (0x01, 0x0F):
        return (op, rd, imm - 0x10000 if imm >= 0x8000 and op == 0x01 else imm)
    if op in THREE:
        return (op, rd, ra, imm & 15)
    return (op, rd, ra, imm - 0x10000 if imm >= 0x8000 else imm)

def janax_runs(data, pure):
    words = struct.unpack("<%dI" % (len(data) // 4), data[:len(data) // 4 * 4])
    ok = lambda w: (w & 255) in NAMES and not (pure and ((w & 255) in MEMORY or (w & 255) == 0x05))
    runs = []; run = []
    for w in words:
        if ok(w): run.append(fields(w))
        else:
            if run: runs.append(run)
            run = []
    if run: runs.append(run)
    return runs, len(words)

# ---- a text: the lines that only reckon, in the assembler's notation or the infix one
R64 = "rax rbx rcx rdx rsi rdi rbp rsp r8 r9 r10 r11 r12 r13 r14 r15".split()
R32 = "eax ebx ecx edx esi edi ebp esp r8d r9d r10d r11d r12d r13d r14d r15d".split()
REG = {n: i for i, n in enumerate(R64)}; REG.update({n: i for i, n in enumerate(R32)})
ASM = re.compile(r"^\s*(?:[0-9a-f]+:\s+)?(mov|add|sub|and|or|xor|imul|shl|sal|shr|sar|inc|dec|neg|not)\s+(\w+)(?:\s*,\s*([\w-]+))?\s*(?:[;#].*)?$", re.I)
ASM_OP = {"add": 0x02, "sub": 0x03, "imul": 0x04, "shl": 0x06, "sal": 0x06, "shr": 0x07, "sar": 0x08, "and": 0x09, "or": 0x0A, "xor": 0x0B}
ID = r"[A-Za-z_]\w*"; NUM = r"-?(?:0[xX][0-9A-Fa-f]+|\d+)"; OPD = r"(?:%s|%s)" % (ID, NUM)
INFIX = re.compile(r"^\s*(?:%s\s+)*?(%s)\s*(=|\+=|-=|\*=|<<=|>>=|&=|\|=|\^=)\s*(%s)(?:\s*(\+|-|\*|<<|>>|&|\||\^)\s*(%s))?\s*;?\s*$" % (ID, ID, OPD, OPD))
STEP = re.compile(r"^\s*(%s)\s*(\+\+|--)\s*;\s*$" % ID)
INF_OP = {"+": 0x02, "-": 0x03, "*": 0x04, "<<": 0x06, ">>": 0x07, "&": 0x09, "|": 0x0A, "^": 0x0B}
KEYWORDS = {"return", "if", "else", "while", "for", "do", "then", "end", "goto", "case", "break", "elseif", "until", "repeat", "function", "and", "or", "not"}

def number(s):
    s = s.strip().lower()
    try:
        if s.endswith("h") and re.fullmatch(r"-?[0-9][0-9a-f]*h", s): v = int(s[:-1], 16)
        else: v = int(s, 0)
    except ValueError:
        return None
    return v if -0x8000 <= v < 0x8000 else None       # what one jldi says; a larger one is not said here

def line_code(line, n):
    """a line -> the Janax instructions it is (registers by name), [] if it says nothing, None if it is not known to
    only reckon"""
    m = STEP.match(line)
    if m:
        x = m.group(1); t = ("t", n, 0)
        return None if x in KEYWORDS else [(0x01, t, 1), (0x02 if m.group(2) == "++" else 0x03, x, x, t)]
    s = re.sub(r"/\*.*?\*/", "", line)
    if not s.strip() or re.match(r"^\s*(;|//|--|#!)", s): return []
    m = ASM.match(s)
    if m and m.group(2).lower() in REG:
        op, d, src = m.group(1).lower(), ("x86", REG[m.group(2).lower()]), m.group(3); t = ("t", n, 0)
        if op in ("inc", "dec", "neg", "not"):
            if src is not None: return None
            if op == "neg": return [(0x01, t, 0), (0x03, d, t, d)]
            if op == "not": return [(0x01, t, -1), (0x0B, d, d, t)]
            return [(0x01, t, 1), (0x02 if op == "inc" else 0x03, d, d, t)]
        if src is None: return None
        if src.lower() in REG:
            a = ("x86", REG[src.lower()])
            return [(0x0A, d, a, a)] if op == "mov" else [(ASM_OP[op], d, d, a)]
        v = number(src)
        if v is None: return None
        return [(0x01, d, v)] if op == "mov" else [(0x01, t, v), (ASM_OP[op], d, d, t)]
    s = re.sub(r"\s*(//|--).*$", "", s)
    m = INFIX.match(s)
    if m:
        x, eq, a, op, b = m.groups()
        if x in KEYWORDS or a in KEYWORDS or (b and b in KEYWORDS): return None
        out = []
        def operand(o, k):
            if re.fullmatch(ID, o): return o
            v = number(o)
            if v is None: return None
            t = ("t", n, k); out.append((0x01, t, v)); return t
        if eq != "=":
            if op: return None
            ra = operand(a, 0)
            return None if ra is None else out + [(INF_OP[eq[:-1]], x, x, ra)]
        if not op:
            if not re.fullmatch(ID, a):
                v = number(a)
                return None if v is None else [(0x01, x, v)]
            return [(0x0A, x, a, a)]
        ra = operand(a, 0); rb = operand(b, 1)
        return None if ra is None or rb is None else out + [(INF_OP[op], x, ra, rb)]
    return None

def text_runs(text):
    runs = []; run = []; n = 0
    for i, line in enumerate(text.split("\n")):
        c = line_code(line.rstrip("\r"), i)
        if c is None:
            if run: runs.append(run)
            run = []
        else:
            run.extend(c); n += len(c)
    if run: runs.append(run)
    return runs, n

# ---- a book of machine code: the program it says
HEXBOOK = re.compile(rb"^(?:[0-9a-f]{2}(?: [0-9a-f]{2})*\r?\n)+$")

def objdump():
    for p in (shutil.which("objdump"), "C:/msys64/ucrt64/bin/objdump.exe", "C:/msys64/mingw64/bin/objdump.exe"):
        if p and os.path.exists(p): return p
    return None

def host_text(data):
    """a program of the host's processor -> its instructions in the assembler's notation, cut at every place its own
    jumps and calls go to (a line that is not an instruction ends a piece); None with no objdump"""
    tool = objdump()
    if tool is None: return None
    f = tempfile.NamedTemporaryFile(suffix=".exe", delete=False)
    try:
        f.write(data); f.close()
        out = subprocess.run([tool, "-d", "-M", "intel", "--no-show-raw-insn", f.name], capture_output=True).stdout.decode("latin-1")
    finally:
        os.unlink(f.name)
    lines = [l for l in out.split("\n") if re.match(r"^\s*[0-9a-f]+:\t", l)]
    targets = set()
    for l in lines:
        m = re.match(r"^\s*[0-9a-f]+:\t(?:j\w+|call|loop\w*)\s+(?:0x)?([0-9a-f]+)\b", l)
        if m: targets.add(int(m.group(1), 16))
    res = []
    for l in lines:
        a, _, ins = l.partition(":\t")
        if int(a, 16) in targets: res.append("@")
        res.append(ins.strip())
    return "\n".join(res)

def source(path, pure):
    """-> (what it is, its runs, how many instructions it has), or (why not, None, 0)"""
    data = open(path, "rb").read()
    if HEXBOOK.match(data):
        data = bytes.fromhex(data.decode().replace("\n", " ").replace("\r", " "))
        if data[:2] == b"MZ":
            t = host_text(data)
            if t is None: return "codigo de maquina del anfitrion: sin objdump en esta maquina, no se desarma", None, 0, data
            r, n = text_runs(t); return "codigo de maquina del anfitrion (dicho por objdump)", r, n, data
        r, n = janax_runs(data, pure); return "codigo de maquina de Janax (un libro)", r, n, data
    if b"\0" in data[:4096]:
        r, n = janax_runs(data, pure); return "programa de Janax", r, n, data
    r, n = text_runs(data.decode("latin-1")); return "texto", r, n, data

def canon(piece):
    """the piece with its registers named by order of use -> (a key, its text)"""
    names = {}; key = []; text = []
    def r(x):
        if x not in names: names[x] = len(names)
        return names[x]
    for x in piece:
        op = x[0]
        if op in (0x01, 0x0F):
            k = (op, r(x[1]), x[2]); t = "%s r%d, %d" % (NAMES[op], k[1], x[2])
        elif op in THREE:
            a, b = r(x[2]), r(x[3]); k = (op, r(x[1]), a, b); t = "%s r%d, r%d, r%d" % (NAMES[op], k[1], a, b)
        else:
            a = r(x[2]); k = (op, r(x[1]), a, x[3]); t = "%s r%d, r%d, %d" % (NAMES[op], k[1], a, x[3])
        key.append(k); text.append(t)
    return tuple(key), text

def main():
    argv = list(sys.argv[1:]); table = None
    if "--tabla" in argv:
        i = argv.index("--tabla"); table = argv[i + 1]; del argv[i:i + 2]
    args = [a for a in argv if not a.startswith("--")]; pure = "--puros" in argv or table is not None
    top = 12
    if len(args) > 1 and args[-1].isdigit(): top = int(args.pop())
    flat = []; starts = []; srcs = []; seen = set(); notes = []; total_ins = 0
    for path in args:
        what, runs, n, data = source(path, pure)
        name = path.replace("\\", "/").split("/")[-1]
        if len(name) % 2 == 0 and re.fullmatch(r"[0-9a-f]+", name):
            try: name = bytes.fromhex(name).decode()
            except ValueError: pass
        if data in seen:
            notes.append("# %s: ya dicho (los mismos bytes), se pasa de largo" % name); continue
        seen.add(data)
        if runs is None:
            notes.append("# %s: %s" % (name, what)); continue
        srcs.append((len(flat), name)); total_ins += n
        notes.append("# %s: %s, %d instrucciones, %d en tramos que solo hacen cuentas%s" % (name, what, n, sum(map(len, runs)), "" if pure else " o memoria"))
        for run in runs:
            if len(run) >= LMIN: starts.append((len(flat), len(flat) + len(run)))
            flat.extend(run); flat.append(None)
    where = collections.defaultdict(list); text = {}
    for a, b in starts:
        for i in range(a, b):
            for L in range(LMIN, min(LMAX, b - i) + 1):
                k, t = canon(flat[i:i + L]); where[k].append(i)
                if k not in text: text[k] = t
    used = bytearray(len(flat)); gears = []; total = 0
    def count(k, mark=False):
        n = 0; last = -1; L = len(k); at = []
        for i in where[k]:
            if i > last and not any(used[i:i + L]):
                n += 1; last = i + L - 1; at.append(i)
                if mark: used[i:i + L] = b"\x01" * L
        return (n, at) if mark else n
    regs = lambda k: 1 + max(max(x[1:2]) if x[0] in (0x01, 0x0F) else max(x[1:4]) if x[0] in THREE else max(x[1:3]) for x in k)
    cand = {k: len(v) for k, v in where.items() if len(v) >= 2 and not (table and regs(k) > 16)}
    while len(gears) < top and cand:
        best = None
        for k in sorted(cand, key=lambda k: -(cand[k] * (len(k) - 1) - len(k)))[:400]:    # (counts only fall: the true best is among the highest)
            n = count(k); cand[k] = n; s = n * (len(k) - 1) - len(k)
            if n < 2 or s <= 0: del cand[k]; continue
            if best is None or s > best[0]: best = (s, n, k)
        if best is None: break
        s, n, k = best; n, at = count(k, mark=True); del cand[k]; gears.append((s, n, k, at)); total += s
    if table: sys.stdout = open(os.devnull, "w") if "--callado" in argv else sys.stdout
    for l in notes: print(l)
    print("# %d engranajes ahorran %d instrucciones (%.1f %% de las %d)" % (len(gears), total, 100.0 * total / max(total_ins, 1), total_ins))
    first = [s for s, _ in srcs]; per = collections.Counter()
    for i, (s, n, k, at) in enumerate(gears):
        by = collections.Counter(srcs[bisect.bisect_right(first, p) - 1][1] for p in at)
        for name in by: per[name] += 1
        said = "" if len(srcs) < 2 else " (" + ", ".join("%d en %s" % (c, name) for name, c in by.most_common()) + ")"
        print("engranaje %d: ahorra %d, dicho %d veces%s, %d instrucciones" % (i + 1, s, n, said, len(k)))
        for t in text[k]: print("    " + t)
    if len(srcs) > 1:
        print("# en cuantos engranajes esta cada uno: " + ", ".join("%s %d" % (name, per[name]) for _, name in srcs))

    if table:
        out = bytearray()
        for s_, n, k, at in gears:
            g = bytearray(128); struct.pack_into("<Q", g, 0, len(k))
            for i, x in enumerate(k):
                op = x[0]
                w = op | x[1] << 8 | ((x[2] & 0xFFFF) << 16 if op in (0x01, 0x0F) else x[2] << 12 | x[3] << 16)
                struct.pack_into("<Q", g, 8 + 8 * i, w)
            out += g
        open(table, "wb").write(out)

if __name__ == "__main__":
    main()
