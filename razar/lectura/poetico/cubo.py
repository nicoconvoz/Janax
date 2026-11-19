"""cubo.py: the living cube of code (the Capitan, 2026-11-19: "que funcione como el cubo: una programacion
tridimensional de codigo, empezando por la imagen, las palabras, el codigo en assembler, y despues llevandolo a lo
imaginable no imaginado"; "que tenga movimiento siempre, melodia y armonia, que pueda estar en reposo o
autoadaptandose").

A recipe (a string of the organ's letters) has three values at once, one for each judge the ship already has:
  image   what it draws as a form of Luma: the cells it covers for each bit of its recipe (rebuilt here from the
          rule written in gen_formas.py; it is not her program judging)
  words   Razar's exam over a book of words (the New Testament), minus the exam without organ
  code    Razar's exam over every book of code it was given to eat (CODIGO: KolibriOS's kernel, its system programs
          and its assembler, in assembly; xv6, a compiler, an editor, a network, a B-tree and Lua, in C and Python),
          each minus its exam without organ, added up. Each book is a domain of its own, sat apart: what a piece
          wins in each one is kept (st["nota"]), not only the sum.
So it is a point of a cube, 4 x 4 x 4. On each axis the place 0 is "it does not pay"; 1, 2, 3 are the thirds of the
ones that pay, taken from the pieces the cube holds now: the borders move when better pieces come (it adapts).

A cell keeps one piece: the one of its recipes with the largest sum of its three values, each as a fraction of the
best of its axis (criterion, said here: within a cell they are of the same kind, and the fullest one stays).

MELODY. A piece that just took a cell is awake. An awake piece talks only to the pieces of the six cells beside
it, and each talk makes two sentences: its code then the other's, and the other's then its own (poetic code: a
sentence of two words). Each sentence sits the real exams and falls in its own cell; if it takes it, it is awake for
the next beat. The melody is the list of cells that woke, beat after beat.
HARMONY (the rule of his school of fish): a piece woken at once by more than half of the pieces beside it drowns and
says nothing in that beat.
REST. A beat in which no sentence takes a cell wakes nobody: the cube rests and spends nothing until a new piece
is given to it (dar).

ALIVE (vivo). It sleeps on the host's notice of changes in the board (nothing spent while nothing is written there)
and wakes when a recipe is written: what Razar keeps (an organ that won, or the best of its way of doing; and Luma's
gifts are what moves him) is a new piece for the cube. It sits the three exams, falls in its cell, and if it takes it
the melody plays until it rests. What the cube finds goes back: a piece that takes a cell and pays in words or in
code is left on the board, in the cube's own folder, and Razar's shared shelf makes it sit his exam, with his own
books, the next time he is born.

usage: cubo.py sembrar | sonar <beats at most> | ver | vivo | comer (the books of CODIGO that are new to it: every
piece it knows sits their exam, everything finds its cell again, and the melody plays until it rests)        state: cubo.estado (not a text: the vigia
does not eat it), in the work folder"""
import ctypes, ctypes.wintypes as wt, json, math, os, pickle, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import legos

ESTADO = legos.W + "/cubo.estado"
TABLERO = os.environ.get("CUBO_TABLERO", os.path.expanduser("~/razar_tablero")).replace(chr(92), "/")
RAIZ = "tablero/Receta de Organos/"
KOLIBRI = "E:/Razar/kolibri/kolibri.txt"
CODIGO = "E:/Razar/codigo_libre"               # every book of code it eats; none there: the first one it had
LOTE = 60                                     # recipes in one life of exams (so a life ends in minutes; criterion)


def nombre(libro):
    return os.path.basename(libro).rsplit(".", 1)[0]


def libros():
    """-> [(axis, book)]: the words, and every book of code"""
    cod = sorted(os.path.join(CODIGO, f).replace(chr(92), "/") for f in os.listdir(CODIGO) if f.endswith(".txt")) if os.path.isdir(CODIGO) else []
    return [("palabras", legos.NT)] + [("codigo", b) for b in (cod or [KOLIBRI])]
DIRS = [(1, 0), (0, 1), (-1, 0), (0, -1)]
ARM = 5
MAXLEN = 16                                   # an organ is a qword: sixteen letters (pulso.jsm)


def imagen(rec):
    cells = set(); x = y = 0
    for ch in rec:
        k = int(ch)
        if k <= 4:
            dx, dy = DIRS[k - 1]
            for _ in range(ARM):
                x += dx; y += dy; cells.add((x, y))
        elif k <= 8:
            dx, dy = DIRS[k - 5]; x, y = ARM * dx, ARM * dy
        else:
            cells |= {(-a, b) for a, b in cells}
    cells = {(a, b) for a, b in cells if -20 <= a < 20 and -25 <= b < 25}
    return len(cells) / (len(rec) * math.log2(9))


def examinar(recetas, st):
    """the exams each recipe has not sat yet, book by book -> st['nota'][book][recipe]; and its three values"""
    nota = st.setdefault("nota", {})
    if not nota and st["valor"]:                 # what it knew before it had more than one book of code
        nota[nombre(legos.NT)] = {r: v[1] for r, v in st["valor"].items()}
        nota["kolibri-nucleo-0" if os.path.isdir(CODIGO) else nombre(KOLIBRI)] = {r: v[2] for r, v in st["valor"].items()}
    todos = libros()
    for eje, libro in todos:
        de = nota.setdefault(nombre(libro), {})
        falta = [r for r in recetas if r not in de and r not in st["perdidas"]]
        for i in range(0, len(falta), LOTE):
            lote = falta[i:i + LOTE]
            legos.BOOK = libro; legos.TIMEOUT = 90 + 7 * len(lote)
            g = legos.scores(lote)
            for r in lote:
                if r in g and "" in g:
                    de[r] = g[r] - g[""]
            guardar(st)
    for r in recetas:
        if r in st["perdidas"]:
            continue
        if all(r in nota[nombre(l)] for _, l in todos):
            st["valor"][r] = [imagen(r), nota[nombre(legos.NT)][r], sum(nota[nombre(l)][r] for e, l in todos if e == "codigo")]
        else:
            st["perdidas"].append(r); st["valor"].pop(r, None)     # it did not get to sit every exam: kept apart, with its reason


def bordes(st):
    """for each axis: the two cuts between the thirds of the values that pay, among the pieces the cube holds"""
    piezas = [st["valor"][r] for r in st["celdas"].values()] or list(st["valor"].values())
    cortes = []
    for i in range(3):
        v = sorted(p[i] for p in piezas if p[i] > 0)
        cortes.append([v[len(v) // 3], v[2 * len(v) // 3]] if len(v) >= 3 else [0, 0])
    return cortes


def celda(v, cortes):
    return tuple(0 if v[i] <= 0 else 1 + (v[i] > cortes[i][0]) + (v[i] > cortes[i][1]) for i in range(3))


def lleno(v, tops):
    return sum(v[i] / tops[i] for i in range(3) if tops[i] > 0)


def asentar(st, recetas):
    """every measured recipe of the list falls in its cell; -> the cells taken"""
    cortes = bordes(st)
    tops = [max([st["valor"][r][i] for r in st["valor"]] + [0]) for i in range(3)]
    viejas = dict(st["celdas"]); todas = list(viejas.values()) + [r for r in recetas if r in st["valor"]]
    st["celdas"] = {}
    for r in todas:                              # the borders moved: every piece finds its cell again
        c = ",".join(map(str, celda(st["valor"][r], cortes)))
        o = st["celdas"].get(c)
        if o is None or lleno(st["valor"][r], tops) > lleno(st["valor"][o], tops):
            st["celdas"][c] = r
    return [c for c, r in st["celdas"].items() if viejas.get(c) != r and r in recetas]


def vecinas(c):
    a = list(map(int, c.split(",")))
    for i in range(3):
        for d in (-1, 1):
            b = list(a); b[i] += d
            if 0 <= b[i] <= 3:
                yield ",".join(map(str, b))


def compas(st):
    """one beat: the awake pieces talk to the ones beside them; -> the cells that woke"""
    despiertas = [c for c in st["despiertas"] if c in st["celdas"]]
    llamadas = {}
    for c in despiertas:
        for v in vecinas(c):
            if v in st["celdas"]:
                llamadas.setdefault(v, []).append(c)
    oraciones = []; ahogadas = []
    for v, quien in llamadas.items():
        ocupadas = [x for x in vecinas(v) if x in st["celdas"]]
        if len(quien) * 2 > len(ocupadas) and len(quien) > 1:
            ahogadas.append(v); continue          # harmony: woken by more than half of the ones beside it
        for c in quien:
            a, b = st["celdas"][c], st["celdas"][v]
            for s in (a + b, b + a):
                if len(s) <= MAXLEN and s not in st["valor"] and s not in st["perdidas"] and s not in oraciones:
                    oraciones.append(s)
    examinar(oraciones, st)
    tomadas = asentar(st, oraciones)
    st["melodia"].append({"despiertas": despiertas, "ahogadas": ahogadas, "oraciones": len(oraciones),
                          "tomaron": {c: st["celdas"][c] for c in tomadas}})
    st["despiertas"] = tomadas
    return tomadas


def ver(st):
    tops = [max([st["valor"][r][i] for r in st["valor"]] + [0]) for i in range(3)]
    print("cubo: %d piezas en %d casilleros de 64; recetas examinadas: %d" % (len(st["celdas"]), len(st["celdas"]), len(st["valor"])))
    print("bordes (imagen, palabras, codigo):", [[round(x, 2) for x in c] for c in bordes(st)])
    print("%-9s %-18s %7s %9s %9s" % ("casillero", "pieza", "imagen", "palabras", "codigo"))
    for c in sorted(st["celdas"], key=lambda c: -lleno(st["valor"][st["celdas"][c]], tops)):
        r = st["celdas"][c]; v = st["valor"][r]
        print("%-9s %-18s %7.2f %+9d %+9d" % (c, r, v[0], v[1], v[2]))
    print("mejor en palabras:", max(st["valor"], key=lambda r: st["valor"][r][1]), "| mejor en codigo:", max(st["valor"], key=lambda r: st["valor"][r][2]))
    nota = st.get("nota", {})
    if len(nota) > 2:
        print("por libro de codigo, la mejor pieza y cuantas pagan:")
        for lb in sorted(nota):
            if lb != nombre(legos.NT) and nota[lb]:
                m = max(nota[lb], key=lambda r: nota[lb][r])
                print("   %-20s %-12s %+7d | pagan %d de %d" % (lb, m, nota[lb][m], sum(v > 0 for v in nota[lb].values()), len(nota[lb])))
    for n, m in enumerate(st["melodia"]):
        if "llegaron" in m:
            print("compas %d: llegaron %s | tomaron %s" % (n + 1, m["llegaron"], m["tomaron"]))
        else:
            print("compas %d: despiertas %s | ahogadas %s | oraciones %d | tomaron %s" % (n + 1, m["despiertas"], m["ahogadas"], m["oraciones"], m["tomaron"]))
    print("estado:", "despierto, piezas %s" % st["despiertas"] if st["despiertas"] else "en reposo")


def guardar(st):
    pickle.dump(st, open(ESTADO + ".tmp", "wb")); os.replace(ESTADO + ".tmp", ESTADO)


def pieza_de(nombre):
    """the organ a file of the board is the recipe of (its letters, 1-9, sixteen at most), or None"""
    try:
        p = bytes.fromhex(nombre).decode().split("/")
    except ValueError:
        return None
    if len(p) >= 5 and "/".join(p[:2]) + "/" == RAIZ and p[-1] == "recetas" and p[2] != "cubo" and re.fullmatch("[1-9]{1,16}", p[3]):
        return p[3]
    return None


def dar_a_razar(st, recetas):
    """what the cube found goes back to the board: Razar's shared shelf will make it sit his exam. The pieces are
    followed by their recipe, not by their cell: the borders move with every arrival, and a piece changes cell."""
    modelo = None
    for f in os.listdir(TABLERO):
        if pieza_de(f) == "6":
            modelo = open(TABLERO + "/" + f, "rb").read().decode("latin-1"); break
    if modelo is None:
        return
    for r in recetas:
        v = st["valor"][r]
        if r in st["celdas"].values() and (v[1] > 0 or v[2] > 0):
            t = re.sub(r"receta [0-9A-Fa-f]{16}", "receta %016x" % legos.word(r), modelo.split(chr(10) + chr(10))[0], count=1)
            open(TABLERO + "/" + legos.hexl(RAIZ + "cubo/%s/recetas" % r), "wb").write(t.encode("latin-1"))


def llegan(st, piezas):
    """new pieces: examined, settled, and the melody until it rests"""
    piezas = [r for r in dict.fromkeys(piezas) if r not in st["valor"] and r not in st["perdidas"]]
    if not piezas:
        return
    if not os.path.exists(legos.W + "/out/pulso.bin"):
        legos.setup(); assert legos.build()
        import shutil; shutil.rmtree(legos.W + "/proy", ignore_errors=True)     # built: the copy is not kept
    examinar(piezas, st); tomadas = asentar(st, piezas)
    nuevas = [st["celdas"][c] for c in tomadas]
    st["melodia"].append({"despiertas": [], "ahogadas": [], "oraciones": len(piezas), "tomaron": {c: st["celdas"][c] for c in tomadas}, "llegaron": piezas})
    st["despiertas"] = tomadas; guardar(st)
    while st["despiertas"]:
        nuevas += [st["celdas"][c] for c in compas(st)]; guardar(st)
    dar_a_razar(st, list(dict.fromkeys(nuevas)))


def vivo(st):
    """asleep on the board's changes; awake only when a recipe is written"""
    k32 = ctypes.WinDLL("kernel32", use_last_error=True)
    k32.SetPriorityClass(wt.HANDLE(k32.GetCurrentProcess()), 0x40)        # it works in the gaps, as Razar does
    k32.CreateFileW.restype = wt.HANDLE
    k32.CreateFileW.argtypes = [wt.LPCWSTR, wt.DWORD, wt.DWORD, ctypes.c_void_p, wt.DWORD, wt.DWORD, wt.HANDLE]
    k32.ReadDirectoryChangesW.argtypes = [wt.HANDLE, ctypes.c_void_p, wt.DWORD, wt.BOOL, wt.DWORD, ctypes.POINTER(wt.DWORD), ctypes.c_void_p, ctypes.c_void_p]
    h = k32.CreateFileW(TABLERO, 1, 7, None, 3, 0x02000000, None)
    assert h not in (None, wt.HANDLE(-1).value), "no puedo escuchar el tablero"
    llegan(st, [r for r in map(pieza_de, os.listdir(TABLERO)) if r])      # what was kept while it was not listening
    buf = ctypes.create_string_buffer(1 << 16); n = wt.DWORD()
    while k32.ReadDirectoryChangesW(h, buf, len(buf), False, 0x11, ctypes.byref(n), None, None):
        nuevas = []; at = 0
        if n.value == 0:                                                   # more changes than fit: look at all of it
            nuevas = [r for r in map(pieza_de, os.listdir(TABLERO)) if r]
        while n.value and True:
            sig, _, largo = (int.from_bytes(buf.raw[at + 4 * i:at + 4 * i + 4], "little") for i in range(3))
            r = pieza_de(buf.raw[at + 12:at + 12 + largo].decode("utf-16-le"))
            if r:
                nuevas.append(r)
            if not sig:
                break
            at += sig
        llegan(st, nuevas)


def main():
    if os.path.exists(ESTADO):
        st = pickle.load(open(ESTADO, "rb"))
    elif os.path.exists(legos.W + "/cubo.json"):
        st = json.load(open(legos.W + "/cubo.json"))
    else:
        st = {"valor": {}, "celdas": {}, "despiertas": [], "melodia": [], "perdidas": []}
    if sys.argv[1] == "sembrar":
        legos.setup(); assert legos.build()
        semillas = [a for a in "123456789"] + [a + b for a in "123456789" for b in "123456789"] + ["516", "716", "738", "51638", "38516"]
        examinar(semillas, st); st["despiertas"] = asentar(st, semillas)
    elif sys.argv[1] == "sonar":
        if not os.path.exists(legos.W + "/out/pulso.bin"):
            legos.setup(); assert legos.build()
        for _ in range(int(sys.argv[2])):
            if not st["despiertas"]:
                break
            compas(st); guardar(st)
    elif sys.argv[1] == "comer":
        if not os.path.exists(legos.W + "/out/pulso.bin"):
            legos.setup(); assert legos.build()
            import shutil; shutil.rmtree(legos.W + "/proy", ignore_errors=True)
        conocidas = list(st["valor"])
        examinar(conocidas, st)
        antes = dict(st["celdas"])
        st["celdas"] = {}                            # with more to judge by, every piece finds its cell again
        asentar(st, [r for r in conocidas if r in st["valor"]])
        cambiaron = [c for c, r in st["celdas"].items() if antes.get(c) != r]
        nuevas = [st["celdas"][c] for c in cambiaron]
        st["melodia"].append({"despiertas": [], "ahogadas": [], "oraciones": len(conocidas), "tomaron": {c: st["celdas"][c] for c in cambiaron},
                              "llegaron": ["(comio %d libros de codigo)" % (len(libros()) - 1)]})
        st["despiertas"] = cambiaron; guardar(st)
        while st["despiertas"]:
            nuevas += [st["celdas"][c] for c in compas(st)]; guardar(st)
        dar_a_razar(st, list(dict.fromkeys(nuevas)))
    elif sys.argv[1] == "vivo":
        guardar(st); vivo(st); return
    guardar(st)
    ver(st)


if __name__ == "__main__":
    main()
