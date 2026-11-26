"""nitidez_canto.py <pairs file> <question>...: her school's song (razar/cardumen/memoria_pares.jsm, canta + razona, as it
is: not a line of it changed) heard through three lenses. A lens stands in front of it and says what a "letter" is:

  letra     a letter is a letter (the song as it has always been)
  palabra   each different word is one letter; a word of the song is one word of the text
  oracion   each different sentence is one letter

What it sings is read back through the same lens. The pairs file: "P: question" and "R: answer" lines."""
import os, re, subprocess, sys

P = "E:/Janax"; D = "E:/tmp/canto"
et = lambda s: s.encode().hex()
SIM = [bytes([c]) for c in range(ord("a"), ord("z") + 1)] + [bytes([c]) for c in range(0xC0, 0xC0 + 23)]     # 49 letters


def correr(pares, preguntas):
    casa = D + "/casa"; os.makedirs(casa, exist_ok=True)
    for f in os.listdir(casa): os.remove(os.path.join(casa, f))
    open(casa + "/" + et("pares"), "wb").write(b"".join(b"P: " + p + b"\nR: " + r + b"\n" for p, r in pares))
    open(casa + "/" + et("canta"), "wb").write(b"".join(q + b"\n" for q in preguntas))
    open(casa + "/" + et("razona"), "wb").write(b"1\n")
    env = dict(os.environ, JANAX_MOTOR="traductor", JANAX_CAMBIO="24", JANAX_ARCHIVOS=casa)
    out = subprocess.run([P + "/so/build/janaxos.exe", D + "/memoria_pares.bin"], env=env, capture_output=True).stdout
    return [l.split(b" -> ", 1)[1].strip() if b" -> " in l else b"" for l in out.replace(b"\r", b"").split(b"\n") if l.startswith(b"canta: ")]


palabras = lambda t: re.findall(r"[a-z\u00e0-\u00ff]+", t.lower())


def lente(nivel, pares, preguntas):
    if nivel == "letra":
        r = correr([(p.lower().encode("latin-1", "replace"), a.lower().encode("latin-1", "replace")) for p, a in pares], [q.lower().encode("latin-1", "replace") for q in preguntas])
        return [x.decode("latin-1") for x in r]
    tabla = {}
    def cod(unidades):
        o = []
        for u in unidades:
            if u not in tabla:
                if len(tabla) >= len(SIM): continue          # (more than the song has letters for: it is not heard)
                tabla[u] = SIM[len(tabla)]
            o.append(tabla[u])
        return b" ".join(o)
    if nivel == "palabra":
        pp = [(cod(palabras(p)), cod(palabras(a))) for p, a in pares]; qq = [cod(palabras(q)) for q in preguntas]
        sep = " "
    else:   # oracion: the whole answer is one unit; the question stays in words, so that it can be told from another
        pp = [(cod(palabras(p)), cod([a.strip()])) for p, a in pares]; qq = [cod(palabras(q)) for q in preguntas]
        sep = " / "
    vuelta = {v: k for k, v in tabla.items()}
    r = correr(pp, qq)
    return [sep.join(vuelta.get(bytes([c]), "?") for c in x if c != 32) for x in r], len(tabla)


def nitida(pares, preguntas):
    """The word lens with her own rule of sharpness on the words: what only one example says is a particular (a name);
    what two say is the rule. A word said by one pair alone is heard as "someone" (one same letter for all of them),
    in the examples and in what is asked. What it sings is read back with the question's own particulars in the holes."""
    from collections import Counter
    c = Counter()
    for q, a in pares: c.update(set(palabras(q)) | set(palabras(a)))
    HUECO = "∗"
    borr = lambda ws: [w if c[w] >= 2 else HUECO for w in ws]
    tabla = {}
    def cod(us):
        o = []
        for u in us:
            if u not in tabla:
                if len(tabla) >= len(SIM): continue
                tabla[u] = SIM[len(tabla)]
            o.append(tabla[u])
        return b" ".join(o)
    pp = [(cod(borr(palabras(q))), cod(borr(palabras(a)))) for q, a in pares]
    qq = [cod(borr(palabras(q))) for q in preguntas]
    vuelta = {v: k for k, v in tabla.items()}
    out = []
    for q, x in zip(preguntas, correr(pp, qq)):
        propias = [w for w in palabras(q) if c[w] < 2]
        ws = [vuelta.get(bytes([ch]), "?") for ch in x if ch != 32]
        res = []
        for w in ws:
            if w == HUECO:
                res.append(propias.pop(0) if propias else "___")
            else: res.append(w)
        out.append(" ".join(res))
    return out, len(tabla)


def hueco(pares, preguntas):
    """The word lens with her own rule of the hole (the Capitan: "por el hueco topologico y la encadenacion de sucesos
    similares para el mismo objeto o ser lo catalogaba como persona, perro, auto o lo que sea"). Two words that stand in
    one same hole (the same word before and the same word after; a line's start and its end are words too) are of one
    kind: they are heard as one same letter. Nobody says which kind. What it sings is read back saying, of each kind,
    the word the question itself has of it."""
    INI, FIN = "<", ">"
    lineas = [palabras(x) for q, a in pares for x in (q, a)] + [palabras(q) for q in preguntas]
    lugar = {}
    for ws in lineas:
        t = [INI] + ws + [FIN]
        for i in range(1, len(t) - 1): lugar.setdefault((t[i - 1], t[i + 1]), set()).add(t[i])
    clase = {}
    def raiz(w):
        while clase.get(w, w) != w: w = clase[w]
        return w
    for ws in lugar.values():
        ws = sorted(ws)
        for w in ws[1:]: clase[raiz(w)] = raiz(ws[0])
    miembros = {}
    for ws in lineas:
        for w in ws: miembros.setdefault(raiz(w), [])
        for w in ws:
            if w not in miembros[raiz(w)]: miembros[raiz(w)].append(w)
    tabla = {}
    def cod(ws):
        o = []
        for w in ws:
            u = raiz(w)
            if u not in tabla:
                if len(tabla) >= len(SIM): continue
                tabla[u] = SIM[len(tabla)]
            o.append(tabla[u])
        return b" ".join(o)
    pp = [(cod(palabras(q)), cod(palabras(a))) for q, a in pares]
    qq = [cod(palabras(q)) for q in preguntas]
    vuelta = {v: k for k, v in tabla.items()}
    out = []
    for q, x in zip(preguntas, correr(pp, qq)):
        suyas = {}
        for w in palabras(q): suyas.setdefault(raiz(w), []).append(w)
        res = []
        for ch in x:
            if ch == 32: continue
            u = vuelta.get(bytes([ch]))
            if u is None: res.append("?"); continue
            if len(miembros[u]) == 1: res.append(miembros[u][0])
            elif suyas.get(u): res.append(suyas[u][0])
            else: res.append("{" + "/".join(miembros[u][:4]) + "}")
        out.append(" ".join(res))
    clases = ["/".join(m[:5]) for m in miembros.values() if len(m) > 1]
    return out, len(tabla), clases


pares = []; p = None
for l in open(sys.argv[1], encoding="utf-8").read().split("\n"):
    if l.startswith("P: "): p = l[3:]
    elif l.startswith("R: ") and p is not None: pares.append((p, l[3:])); p = None
preguntas = sys.argv[2:]
for nivel in ("palabra por su hueco", "palabra nitida", "palabra"):
    r = hueco(pares, preguntas) if nivel == "palabra por su hueco" else nitida(pares, preguntas) if nivel == "palabra nitida" else lente(nivel, pares, preguntas)
    n = ""
    if isinstance(r, tuple) and len(r) == 3: r, k, cl = r; n = " (%d unidades; clases que encontro sola: %s)" % (k, "; ".join(cl) or "ninguna")
    elif isinstance(r, tuple): r, k = r; n = " (%d unidades distintas)" % k
    print("lente %s%s:" % (nivel, n))
    for q, x in zip(preguntas, r): print("    %-28s -> %s" % (q, x))
