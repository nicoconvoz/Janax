"""cubo.py: the living cube of code (the Capitan, 2026-11-19: "que funcione como el cubo: una programacion
tridimensional de codigo, empezando por la imagen, las palabras, el codigo en assembler, y despues llevandolo a lo
imaginable no imaginado"; "que tenga movimiento siempre, melodia y armonia, que pueda estar en reposo o
autoadaptandose").

A recipe (a string of the organ's letters) has three values at once, one for each judge the ship already has:
  image   what it draws as a form of Luma: the cells it covers for each bit of its recipe (rebuilt here from the
          rule written in gen_formas.py; it is not her program judging)
  words   Razar's exam over a book of words (the New Testament), minus the exam without organ
  code    Razar's exam over a book of code (KolibriOS's kernel, assembly), minus the exam without organ
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

usage: cubo.py sembrar | sonar <beats at most> | ver        state: cubo.json, next to this file"""
import json, math, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import legos

ESTADO = AQUI + "/cubo.json"
KOLIBRI = "E:/Razar/kolibri/kolibri.txt"
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
    """the three values of each recipe not measured yet -> st['valor']"""
    nuevas = [r for r in recetas if r not in st["valor"]]
    if not nuevas:
        return
    out = {}
    for eje, libro in (("palabras", legos.NT), ("codigo", KOLIBRI)):
        legos.BOOK = libro; legos.TIMEOUT = 90 + 7 * len(nuevas)
        g = legos.scores(nuevas)
        for r in nuevas:
            if r in g:
                out.setdefault(r, {})[eje] = g[r] - g[""]
    for r in nuevas:
        if r in out and len(out[r]) == 2:
            st["valor"][r] = [imagen(r), out[r]["palabras"], out[r]["codigo"]]
        else:
            st["perdidas"].append(r)            # it did not get to sit both exams: kept with its reason


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
    for n, m in enumerate(st["melodia"]):
        print("compas %d: despiertas %s | ahogadas %s | oraciones %d | tomaron %s" % (n + 1, m["despiertas"], m["ahogadas"], m["oraciones"], m["tomaron"]))
    print("estado:", "despierto, piezas %s" % st["despiertas"] if st["despiertas"] else "en reposo")


def main():
    st = json.load(open(ESTADO)) if os.path.exists(ESTADO) else {"valor": {}, "celdas": {}, "despiertas": [], "melodia": [], "perdidas": []}
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
            compas(st); json.dump(st, open(ESTADO, "w"))
    json.dump(st, open(ESTADO, "w"))
    ver(st)


if __name__ == "__main__":
    main()
