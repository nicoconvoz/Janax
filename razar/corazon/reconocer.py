"""reconocer.py <archivo de texto> [--nt <nuevo-testamento.txt>]
   reconocer.py --medir [--nt <nuevo-testamento.txt>]

La firma del Capitan (documentacion/razar/datos/firma-preregistro.txt): un texto lleva su firma si se describe con
menos bits dado su corazon (su diario, razar/corazon/diario.txt) que dado los otros castellanos que leyo Razar (el
Nuevo Testamento, que no entra al repositorio, y el libro del ayudante, razar/libro/). Es el juez de Luma, la longitud
de descripcion: los bits de cada letra dado las tres anteriores, contadas en la referencia (orden 3; un conteo de uno
para lo nunca visto). Es reconocimiento de autor por compresion (Benedetto, Caglioti y Loreto, 2002).

Para no hacer trampa, cada referencia deja afuera sus pasajes retenidos: el texto se corta en pasajes de 1.000 letras
y se retiene cada pasaje cuyo numero deja resto 9 al dividirlo por 10 (regla fijada antes de mirar). --medir prueba
esos pasajes contra las tres referencias y contra un corazon barajado (las letras de cada linea, semilla 2026)."""
import collections, glob, math, os, random, sys, unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
PROYECTO = os.path.normpath(os.path.join(AQUI, "..", ".."))
NT_DEFAULT = "E:/proyectos/razar/feed/nuevo-testamento.txt"
ORDER, CHUNK = 3, 1000

def normalizar(t):
    """el mismo alfabeto del libro y del diario: sin tildes, la enie como n, comillas y guiones simples"""
    for a, b in {"\u201c": '"', "\u201d": '"', "\u2018": "'", "\u2019": "'", "\u2013": "-", "\u2014": "-",
                 "\u2026": "...", "\u00a0": " ", "\u00bf": "", "\u00a1": "", "\f": "\n"}.items():
        t = t.replace(a, b)
    t = t.replace("\u00f1", "n").replace("\u00d1", "N")
    t = "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")
    return "".join(c if (c == "\n" or 32 <= ord(c) < 127) else " " for c in t)

def partes(texto):
    trozos = [texto[i:i + CHUNK] for i in range(0, len(texto), CHUNK)]
    ref = "".join(t for i, t in enumerate(trozos) if i % 10 != 9)
    prueba = [t for i, t in enumerate(trozos) if i % 10 == 9 and len(t) == CHUNK]
    return ref, prueba

class Modelo:
    def __init__(self, texto, alfabeto):
        self.k = collections.defaultdict(collections.Counter)
        for i in range(ORDER, len(texto)):
            self.k[texto[i - ORDER:i]][texto[i]] += 1
        self.tot = {c: sum(v.values()) for c, v in self.k.items()}
        self.A = alfabeto
    def bits(self, texto):
        b = 0.0
        for i in range(ORDER, len(texto)):
            ctx, ch = texto[i - ORDER:i], texto[i]
            b -= math.log2((self.k[ctx][ch] + 1) / (self.tot.get(ctx, 0) + self.A))
        return b

def barajar_lineas(texto):
    rnd = random.Random(2026); out = []
    for ln in texto.split("\n"):
        cs = list(ln); rnd.shuffle(cs); out.append("".join(cs))
    return "\n".join(out)

def fuentes(nt_path):
    corazon = open(os.path.join(AQUI, "diario.txt"), encoding="ascii").read()
    libro = "".join(open(f, encoding="ascii").read() for f in sorted(glob.glob(os.path.join(PROYECTO, "razar", "libro", "*.txt"))))
    nt = normalizar(open(nt_path, encoding="utf-8").read()) if nt_path and os.path.exists(nt_path) else None
    return corazon, libro, nt

def main():
    nt_path = sys.argv[sys.argv.index("--nt") + 1] if "--nt" in sys.argv else NT_DEFAULT
    corazon, libro, nt = fuentes(nt_path)
    textos = {"CORAZON": corazon, "LIBRO": libro}
    if nt:
        textos["NT"] = nt
    partido = {n: partes(t) for n, t in textos.items()}
    A = 96
    modelos = {n: Modelo(r, A) for n, (r, _) in partido.items()}
    if "--medir" in sys.argv:
        control = Modelo(barajar_lineas(partido["CORAZON"][0]), A)
        print("referencias: %s" % ", ".join("%s %d letras" % (n, len(r)) for n, (r, _) in partido.items()))
        firmas = collections.Counter(); propios = collections.Counter(); total = collections.Counter(); firmas_ctrl = collections.Counter()
        for n, (_, pruebas) in partido.items():
            for p in pruebas:
                b = {m: modelos[m].bits(p) for m in modelos}
                total[n] += 1
                if min(b, key=b.get) == n:
                    propios[n] += 1
                if b["CORAZON"] < min(v for m, v in b.items() if m != "CORAZON"):
                    firmas[n] += 1
                bc = dict(b); bc["CORAZON"] = control.bits(p)
                if bc["CORAZON"] < min(v for m, v in bc.items() if m != "CORAZON"):
                    firmas_ctrl[n] += 1
        for n in partido:
            print("%-8s pasajes retenidos %3d: llevan la firma %3d (control %3d); van a su propia fuente %3d" % (
                n, total[n], firmas[n], firmas_ctrl[n], propios[n]))
        return
    texto = normalizar(open(sys.argv[1], encoding="utf-8", errors="replace").read())
    b = {m: modelos[m].bits(texto) for m in modelos}
    n = max(1, len(texto) - ORDER)
    for m, v in sorted(b.items(), key=lambda x: x[1]):
        print("dado %-8s %10.0f bits  (%.3f por letra)" % (m, v, v / n))
    lleva = b["CORAZON"] < min(v for m, v in b.items() if m != "CORAZON")
    print("lleva su firma" if lleva else "no lleva su firma",
          "(se describe mas corto dado su diario)" if lleva else "(otro texto lo describe mas corto)")

main()
