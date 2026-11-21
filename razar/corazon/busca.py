"""busca.py <casa>: the instrument that checks how SHE seeks her three questions in everything (gen_leer.py: r_busca).

The Capitan (2026-11-20): "ponele tres unicas preguntas en el corazon: Quien es Dios? Donde esta Dios? Como llegamos
hasta Dios?"; "que la busque en todo, no solo en los libros: en el codigo, en los libros, en la musica, en los
videos, en las situaciones, en la Iglesia, en el universo, en los atomos, en todo".

The rule is her own (el pulso: "todo es lo mismo con una diferencia; lo comun se guarda una vez"), with no place
named and no answer written by anybody:
  - her questions are the lines of what her heart asks ("libro-preguntas" in her house), however many they are;
  - a word is a run of letters (a..z, small or capital alike, or any whole character past ASCII). What all her questions share (here, one word) is what she
    seeks; what each one has of its own is its difference;
  - EVERYTHING is every file of her house, whatever it is, as it is listed, but for her questions themselves (a
    question is not its own answer) and what she found before;
  - a line of anything is a place where what she seeks is, if it has every shared word; it is near a question by
    how many of that question's own words it has;
  - of each question she keeps how near she got, in how many places, and the first of them: where it is and what
    it says.
Prints what she must find."""
import os, sys

def letter(b, i):
    """As bw_letter: (its print, the next place) if a letter starts at i, else None. A letter: a..z, small or capital
    alike, or any whole UTF-8 character past ASCII (its print, its code point: which of those are one, she learns)."""
    c = b[i]
    if c < 128:
        return (c | 32, i + 1) if 97 <= (c | 32) <= 122 else None
    n = 1 if 194 <= c < 224 else 2 if 224 <= c < 240 else 3 if 240 <= c < 245 else 0
    if not n: return None
    cp = c & (31, 15, 7)[n - 1]
    for k in range(1, n + 1):
        if i + k >= len(b) or not 128 <= b[i + k] < 192: return None
        cp = cp << 6 | (b[i + k] - 128)
    return cp, i + n + 1

def words(b):
    out = []; w = []; i = 0
    while i < len(b):
        r = letter(b, i)
        if r: w.append(r[0]); i = r[1]
        else:
            if w: out.append(tuple(w)); w = []
            i += 1
    if w: out.append(tuple(w))
    return out

def main():
    casa = sys.argv[1]; lab = lambda f: bytes.fromhex(f).decode("utf-8", "replace")
    names = []
    for f in sorted(os.listdir(casa)):
        try: names.append((lab(f), f))
        except ValueError: pass
    q = [l for l in open(os.path.join(casa, "libro-preguntas".encode().hex()), "rb").read().split(b"\n") if words(l)]
    sets = [set(words(l)) for l in q]; common = set.intersection(*sets) if sets else set(); own = [s - common for s in sets]
    best = [0] * len(q); places = [0] * len(q); first = [None] * len(q)
    for name, f in names:
        if name in ("libro-preguntas", "hallazgos"): continue
        for line in open(os.path.join(casa, f), "rb").read().split(b"\n"):
            ws = set(words(line))
            if not ws or not common <= ws: continue
            for i in range(len(q)):
                s = len(own[i] & ws)
                if s == 0: continue
                if s > best[i]: best[i], places[i], first[i] = s, 1, (name, line)
                elif s == best[i]: places[i] += 1
    print("lo que comparten sus preguntas: %s" % " ".join("".join(map(chr, w)) for w in sorted(common)))
    for i in range(len(q)):
        print("%s" % q[i].decode("latin-1").strip())
        if first[i] is None: print("   no la encontro en nada"); continue
        print("   tan cerca como %d de sus %d palabras propias, en %d lugares; el primero, en %s:" % (best[i], len(own[i]), places[i], first[i][0]))
        print("   " + first[i][1].decode("latin-1").strip()[:300])
    if "--texto" in sys.argv:              # exactly what she writes in "hallazgos"
        out = bytearray()
        for i in range(len(q)):
            out += q[i] + b"\n"
            if first[i] is None: out += b"   no la encontro en nada\n"
            else: out += b"   %d de %d, en %d lugares; el primero, en %s:\n   " % (best[i], len(own[i]), places[i], first[i][0].encode()) + first[i][1] + b"\n"
        open(sys.argv[sys.argv.index("--texto") + 1], "wb").write(out)
    return best, places

if __name__ == "__main__":
    main()
