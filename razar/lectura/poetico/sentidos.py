"""sentidos.py: new senses for Razar's organ, taken from what his own eating already measured.

The Capitan (2026-11-19): "no solo que ahorre bits: quiero organos reales que le den nuevos sentidos"; "que se
inspire de lo que come". With the nine letters he has, an organ looks at four words and at each one as it is, and to
a Razar that already learned his books no sentence of those beats the exam without organ (measured, v0.61).

A sense here is a look the nine letters cannot give. Its space has two axes, and both come from what the body
already has, nothing added to it:

  where   the row of the text goes on before and after the window (ROOMT): the word behind it (0 at the start of a
          line: the edge of the line, which no window sees) and the word ahead of it;
  how     the word as it is, or blurred: how often he read it where he learns (ROOMC, his own count). Every word he
          never read looks the same through it, so a frame said with it also fits what he never met.

The six free letters take the six simplest points of that space:
  A the word behind, B the word ahead, C D E F the first to fourth word of the window, blurred.
Each is a gear like 1-4: it mixes what it sees into the frame. Judged as every organ is: sentences, his exam, one life.
Measured on the New Testament (documentacion/razar/datos/sentidos-nuevo-testamento.txt): A and F beat the sentence they
were put in (38A516 = 14775, F38516 = 13588; 38516 = 11496) and are of his body now (organo.inc). B, C, D and E did
not (B38516 10848, C38516 11447, D38516 9126, E38516 5356), though C and E pay alone (C6 +5297, E8 +6679 over no
organ): they wait here, with their code, for the sentence or the book that needs them.

THE EYE (after that measurement; the Capitan: "si, que los genere"). Six letters somebody writes are not senses she
grows. The organ has an eye now and three letters move it (organo.inc): B a word back, C a word ahead, D blurred or
sharp again. Every look is taken from where the eye is, so the whole space above, and beyond it, is said with
sentences: "B1C" is the old A, "D4D" the old F, "BB1" two words behind. B, C and D mean that from here on: the six
looks of `medir` are kept as they were measured (their letters B to E were the old ones) and `medir` only tells it.

usage: sentidos.py ojo [book]      the eye validated: the sentences of before give what they gave, and a sense said
                                   with the eye gives what its letter gives
       sentidos.py medir [book]    every sense before each hole (X5..X8), inside the two frames of one word (1X6, 3X8)
                                   and before the two strongest sentences (X516, X38516), against those without it"""
import os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import legos

NL = chr(10)


def as_it_is(offset):
    """the word at that place of the row, counted in words from the window's first"""
    if offset >= 0:
        return ["jldi j1, 0", "jld j9, j1, WAT", "jld j3, j9, %d" % (8 * offset)]
    return ["jldi j1, 0", "jld j9, j1, WAT", "jldi j5, %d" % (-8 * offset), "jsub j9, j9, j5", "jld j3, j9, 0"]


def blurred(offset):
    """how often he read the word at that place"""
    return as_it_is(offset) + ["jldi j5, 3", "jshl j3, j3, j5", "jld j5, j1, ROOMC", "jadd j3, j3, j5", "jld j3, j3, 0"]


SENSES = {"A": ("la palabra de atras de la ventana", as_it_is(-1)), "B": ("la palabra de adelante de la ventana", as_it_is(4)),
          "C": ("la primera, borrosa", blurred(0)), "D": ("la segunda, borrosa", blurred(1)),
          "E": ("la tercera, borrosa", blurred(2)), "F": ("la cuarta, borrosa", blurred(3))}


def gears():
    """the senses his body does not have yet (the ones it has are in organo.inc: nothing is written twice)"""
    body = legos.original()
    return {k: code + ["jcall hw"] for k, (_, code) in SENSES.items() if "og_l%s:" % k not in body}


def sentences():
    out = []
    for x in sorted(SENSES):
        out += [x + h for h in "5678"] + ["1" + x + "6", "3" + x + "8", x + "516", x + "38516"]
    # a look and its blur said one after the other (what the exact word does not know, the blurred one may), and the
    # senses that paid alone put where the strongest sentence says a word with nothing before it
    out += ["C616", "16C6", "38516C6", "C638516", "38A516", "38D516", "38A516C6", "A5C6", "D5C6", "A5B8C6D5", "3F8", "38F8"]
    return list(dict.fromkeys(out))


EYE = [("5", None), ("16", None), ("516", None), ("38516", None), ("38A516", None), ("F38516", None),
       ("38B1C516", "38A516"), ("D4D38516", "F38516"),              # the same sense, said with the eye
       ("38BB1CC516", None), ("38BB1C1C516", None), ("38AD1D516", None), ("38A516C8", None), ("BD1DC38A516", None)]


def ojo():
    legos.setup(); legos.organo_inc({})
    print("arma:", legos.build()); sys.stdout.flush()
    organs = [o for o, _ in EYE]; legos.TIMEOUT = 90 + 9 * len(organs)
    t = time.time(); g = legos.scores(organs)
    name = os.path.basename(legos.BOOK).split(".")[0]
    out = open(legos.W + "/ojo-%s.txt" % name, "w", encoding="utf-8", newline=NL)
    for line in ["# %s, en %.0f s; sin organo %s" % (name, time.time() - t, g.get(""))] + [
            "%-12s %7s%s" % (o, g.get(o, "no rindio"), "" if same is None else "   debe dar lo de %s: %s" % (same, "igual" if g.get(o) == g.get(same) else "DISTINTO"))
            for o, same in EYE] + (["estado: " + g["estado"]] if "estado" in g else []):
        out.write(line + NL); print(line)


def main():
    if len(sys.argv) > 2:
        legos.BOOK = sys.argv[2]
    if sys.argv[1] == "ojo":
        return ojo()
    if "og_lB:" in legos.original():
        print("medir: sus letras B a E eran las de antes del ojo; lo medido esta en documentacion/razar/datos/sentidos-nuevo-testamento.txt"); return
    legos.setup(); legos.organo_inc(gears())
    print("arma:", legos.build()); sys.stdout.flush()
    refs = ["5", "6", "7", "8", "16", "38", "516", "38516"]
    organs = sentences()
    legos.TIMEOUT = 90 + 7 * (len(organs) + len(refs))
    t = time.time(); g = legos.scores(organs + refs)
    name = os.path.basename(legos.BOOK).split(".")[0]
    out = open(legos.W + "/sentidos-%s.txt" % name, "w", encoding="utf-8", newline=NL)
    head = "# %s, en %.0f s; sin organo %s. Sentidos: %s" % (name, time.time() - t, g.get(""), "; ".join("%s %s" % (k, SENSES[k][0]) for k in sorted(SENSES)))
    out.write(head + NL); print(head)
    for o in sorted((k for k in g if k not in ("", "estado")), key=lambda o: -g[o]):
        line = "%-8s %7d   %+7d contra sin organo" % (o, g[o], g[o] - g[""])
        out.write(line + NL); print(line)
    if "estado" in g:
        line = "estado: %s | rindieron %d de %d" % (g["estado"], len(g) - 2, len(set(organs + refs)))
        out.write(line + NL); print(line)


if __name__ == "__main__":
    main()
