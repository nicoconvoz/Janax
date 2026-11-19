"""legos.py: new words for Razar's organ, built with his own assembler and judged by his own exam.

His organ reads a window of four words. Each letter is a piece of code (a gear): 1-4 mix a word into the frame, 5-8
announce one from it, 9 says the frame as it is. Any string of letters is an organ: a sentence of gears. Six letters
are free (A-F). Two ways of filling them are measured here:

  azar      a fragment of K lines taken from the code of his own body, then "jcall hw": what it left is what it mixes.
            Control: as many lines, drawn one by one.
  poetico   poetic code (the Capitan, 2026-11-19: "cada mecanismo que entiende tiene un equivalente en receta de
            codigo: esos son los engranajes que forman programas, y esos programas son engranajes de programas mas
            ricos"): the sentences his organs repeat (the towers) promoted to a word each; then every sentence of two
            words with a new one in it. A promoted word opens into its own code: nothing is interpreted twice.

Every score is of one life without organ: the organs sit its exam first, as the recipes of its board do (the same
genome, the same coin). usage: legos.py validar | azar <how many> <seed> | poetico <tower,tower,...>"""
import os, random, re, shutil, subprocess, sys, time

J = "E:/Janax"
W = "E:/Razar/legos"
SRC = W + "/proy/razar/lectura"
NT = "E:/Razar/libros/nuevo-testamento.txt"
BOOK = os.environ.get("LIBRO", NT)
BASH = r"C:\Program Files\Git\bin\bash.exe"
BODY = ("pulso.jsm", "crece.inc", "casa.inc", "pulso.inc", "negacion.inc", "lectura.inc")
MODEL = "76951bbb9c47d761"
LETTERS = "123456789ABCDEF"
NL = chr(10)
TIMEOUT = 150
TEMPLATE = None
hexl = lambda s: s.encode().hex()


def setup():
    """a copy of the project of its own (the builder takes every include from the project it lives in), without builds"""
    shutil.rmtree(W + "/proy", ignore_errors=True)
    for d in ("so", "escalon0", "razar/lectura"):
        shutil.copytree(J + "/" + d, W + "/proy/" + d, ignore=shutil.ignore_patterns("build", "*.exe", "*.log"))


def original():
    return open(J + "/razar/lectura/organo.inc", encoding="utf-8").read().replace(chr(13), "")


def pool():
    """every instruction line of his body, as written (comments off), file by file, in order"""
    out = []
    for f in BODY:
        for ln in open(J + "/razar/lectura/" + f, encoding="utf-8", errors="replace"):
            code = ln.split(";")[0].strip()
            if code:
                out.append(code)
    return out


def gear(n):
    """the code of the letter n (1-9) as his organ has it, without the jump back"""
    t = original(); head = "og_l%d:" % n + NL
    a = t.index(head) + len(head); b = t.index("  jjmp og_lap" + NL, a)
    return [ln.split(";")[0].strip() for ln in t[a:b].split(NL) if ln.split(";")[0].strip()]


def sentence(organ, legos):
    """the code of an organ as one piece: its letters' code one after the other"""
    out = []
    for ch in organ:
        out += legos[ch] if ch in legos else gear(int(ch))
    return out


def organo_inc(legos):
    """legos: {letter A-F: lines of code}"""
    s = original()
    a = "  jldi j13, 9" + NL + "  jsub j13, j14, j13" + NL + "  jjz j13, og_l9" + NL
    assert s.count(a) == 1
    disp = "".join("  jldi j13, %d" % (LETTERS.index(k) + 1) + NL + "  jsub j13, j14, j13" + NL + "  jjz j13, og_l%s" % k + NL for k in sorted(legos))
    s = s.replace(a, a + disp)
    b = "og_done:" + NL
    assert s.count(b) == 1
    code = "".join("og_l%s:" % k + NL + "".join("  " + ln + NL for ln in legos[k]) + "  jjmp og_lap" + NL for k in sorted(legos))
    open(SRC + "/organo.inc", "w", encoding="utf-8", newline=NL).write(s.replace(b, code + b))


def sh(cmd, timeout):
    try:
        r = subprocess.run([BASH, "-c", cmd], capture_output=True, timeout=timeout)
        return r.returncode, (r.stdout + r.stderr).decode("latin-1").replace(chr(13), "")
    except subprocess.TimeoutExpired as e:
        subprocess.run(["powershell", "-NoProfile", "-Command",
                        "Get-CimInstance Win32_Process -Filter \"Name='janaxos.exe'\" | Where-Object { $_.CommandLine -match 'Razar/legos' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"],
                       capture_output=True)
        return -9, ((e.stdout or b"") + (e.stderr or b"")).decode("latin-1").replace(chr(13), "")


def build():
    shutil.rmtree(W + "/out", ignore_errors=True)
    c, o = sh("bash /e/Razar/legos/proy/so/herramientas/armar.sh /e/Janax/so/build/janaxos.exe /e/Razar/legos/out "
              "/e/Razar/legos/proy/razar/lectura/pulso.jsm /e/Razar/legos/proy/razar/lectura/pulso.datos.jsm 2>&1", 300)
    return c == 0 and os.path.exists(W + "/out/pulso.bin")


def word(organ):
    return sum((LETTERS.index(ch) + 1) << (4 * i) for i, ch in enumerate(organ))


def scores(organs):
    """-> {organ: score}, '' the score without organ; 'estado' says if the life did not get to all of them"""
    global TEMPLATE
    if TEMPLATE is None:
        b = os.path.expanduser("~/razar_tablero")
        TEMPLATE = open(b + "/" + hexl("tablero/Receta de Organos/%s/6/recetas" % MODEL), "rb").read().decode("latin-1")
    casa = W + "/casa"
    shutil.rmtree(casa, ignore_errors=True); shutil.rmtree(W + "/tablero", ignore_errors=True)
    os.makedirs(casa); os.makedirs(W + "/tablero")
    for n, organ in enumerate(organs):
        t = re.sub(r"receta [0-9A-Fa-f]{16}", "receta %016x" % word(organ), TEMPLATE, count=1)
        open(W + "/tablero/" + hexl("tablero/Receta de Organos/%s/t%d/recetas" % (MODEL, n)), "wb").write(t.encode("latin-1"))
    d = bytearray(open(W + "/out/pulso.datos", "rb").read()); d[0x30:0x38] = bytes(8)
    open(W + "/out/pulso.datos", "wb").write(d)
    shutil.copyfile(BOOK, casa + "/" + hexl("libro"))
    open(casa + "/" + hexl("p"), "wb").write(bytes([10, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0]))
    for src, name in ((W + "/out/pulso.bin", "pulso.bin"), (W + "/out/pulso.datos", "pulso.datos"),
                      (SRC + "/organo.molde", "organo.molde"), (SRC + "/organo.inc", "organo.inc")):
        shutil.copyfile(src, casa + "/" + hexl("PDP/razar/lectura/" + name))
    c, o = sh("JANAX_MOTOR=traductor JANAX_CAMBIO=24 JANAX_ARCHIVOS=E:/Razar/legos/casa JANAX_TABLERO=E:/Razar/legos/tablero "
              "/e/Janax/so/build/janaxos.exe E:/Razar/legos/out/pulso.bin 2>&1", TIMEOUT)
    got = {}
    for m in re.finditer(r"organo (\S+) = (-?\d+) \(sin (-?\d+)\)", o):
        name = "".join(LETTERS[ord(ch) - 49] if "1" <= ch <= "?" else ch for ch in m.group(1))
        if "" not in got:
            got[""] = int(m.group(3))
        if name in organs and name not in got:
            got[name] = int(m.group(2))
    if len(got) < len(set(organs)) + 1:
        got["estado"] = "cuelga" if c == -9 else "rompe"
    return got


def main():
    global TIMEOUT
    if sys.argv[1] == "validar":
        setup(); t = time.time(); organo_inc({"A": gear(1)}); ok = build()
        print("arma:", ok, "en %.0f s" % (time.time() - t))
        t = time.time(); g = scores(["6", "5", "16", "A6", "A"])
        print("en %.0f s:" % (time.time() - t), g, "| esperado: '' -3554, 6 -1586, 5 208, 16 2649, A6 2649, A -3554")
        return
    if sys.argv[1] == "poetico":
        towers = sys.argv[2].split(",")
        legos = {}
        for k, t in zip("ABCDEF", towers):
            legos[k] = sentence(t, legos)
        setup(); organo_inc(legos)
        print("palabras nuevas:", {k: t for k, t in zip("ABCDEF", towers)}, "| arma:", build()); sys.stdout.flush()
        new = sorted(legos); old = "123456789"
        organs = [a + b for a in new for b in old] + [b + a for a in new for b in old] + [a + b for a in new for b in new]
        refs = [r for r in towers + ["516", "716", "738"] if r not in organs]
        TIMEOUT = 90 + 7 * (len(organs) + len(refs))
        g = scores(organs + refs)
        opened = lambda o: "".join(towers["ABCDEF".index(ch)] if ch in new else ch for ch in o)
        out = open(W + "/poetico-%s-%s.txt" % ("-".join(towers), os.path.basename(BOOK).split(".")[0]), "w", encoding="utf-8")
        for o in sorted((k for k in g if k != "estado"), key=lambda o: -g[o]):
            line = "%-6s = %7d   abierto: %s" % (o or "sin", g[o], opened(o) if o else "(sin organo)")
            out.write(line + NL); print(line)
        if "estado" in g:
            print("estado:", g["estado"], "| rindieron", len(g) - 2, "de", len(set(organs + refs)))
        return
    n, seed = int(sys.argv[2]), int(sys.argv[3])
    rnd = random.Random(seed); lines = pool(); setup()
    out = open(W + "/resultados.txt", "a", encoding="utf-8")
    out.write("# semilla %d, %d lineas de codigo de su cuerpo; referencias: sin organo -3554, 6 -1586, 5 208" % (seed, len(lines)) + NL); out.flush()
    for i in range(n):
        for kind in ("fragmento", "barajado"):
            k = rnd.randint(1, 6)
            if kind == "fragmento":
                at = rnd.randrange(len(lines) - k); body = lines[at:at + k]
            else:
                body = [lines[rnd.randrange(len(lines))] for _ in range(k)]
            organo_inc({"A": body + ["jcall hw"]})
            if not build():
                res = "no arma"
            else:
                g = scores(["6", "5", "A", "A6", "A5"])
                res = " ".join("%s=%s" % (k or "sin", g[k]) for k in ("", "6", "5", "A", "A6", "A5", "estado") if k in g)
            out.write("%s %d | %s | %s" % (kind, i, res, " ; ".join(body)) + NL); out.flush()
            print(kind, i, res); sys.stdout.flush()


main()
