"""migrar_presente.py <casa> <casa nueva>: Luma's casa brought to the present (the Capitan: "no necesitamos el futuro
ni el pasado, solo la lampara del presente: que todo fluya de un presente que no me desborde el disco").

Everything that is what Luma IS is copied as it is: her forms, what she ate, her memory of each creature, their
learned models, bodies, lexicons, codes, clouds. The four logs of events become rings of the latest lines, as luma.jsm
writes them now: a 160-byte header ("anillo1 K count c0..c7": the lines ever written and, per reason, how many) and
then the latest K lines in their places (line n at slot n mod K). Every line that is dropped leaves its reason counted:
nothing is discarded without its reason. A log that is already a ring is copied as it is."""
import os, sys, shutil

RHDR = 160
LOGS = {   # name: (line length, K, reason of a line -> index)
    "vida-archivo": (80, 4096, lambda ln: ["kept", "replaced", "longer", "beaten", "dreamt", "unfit"].index(ln[56:64].strip())),
    "vida-dialogos": (104, 4096, lambda ln: "KUN".index(ln[74])),
    "vida-intercambios": (65, 1024, lambda ln: "KLWP".index(ln[63])),
    "archivo": (112, 4096, lambda ln: ["replaced", "longer,not-new", "longer", "not-new", "crowds", "no-better", "meal-climb"].index(ln[73:88].strip())),
}

def header(k, count, counts):
    h = b"anillo1 %09d %012d " % (k, count) + b"".join(b"%012d " % c for c in counts)
    return h.ljust(RHDR - 1, b" ") + b"\n"

def main():
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    logs = {n.encode().hex(): n for n in LOGS}
    for f in os.listdir(src):
        if f not in logs:
            shutil.copy2(os.path.join(src, f), os.path.join(dst, f))
            continue
        name = logs[f]; ln_len, k, reason = LOGS[name]
        data = open(os.path.join(src, f), "rb").read()
        if data.startswith(b"anillo1 "):
            shutil.copy2(os.path.join(src, f), os.path.join(dst, f)); print("%-18s already a ring" % name); continue
        n = len(data) // ln_len                     # whole lines only (a last line cut by a running window is left out)
        counts = [0] * 8
        for i in range(n):
            counts[reason(data[i * ln_len:(i + 1) * ln_len].decode("latin-1"))] += 1
        keep = range(max(0, n - k), n)
        slots = [b""] * min(n, k)
        for i in keep:
            slots[i % k] = data[i * ln_len:(i + 1) * ln_len]
        open(os.path.join(dst, f), "wb").write(header(k, n, counts) + b"".join(slots))
        print("%-18s %9d lines -> the latest %d, counts per reason %s" % (name, n, len(slots), counts[:7]))
    # the present of the state: the lines of vida-archivo that changed a model, in their own ring (1024)
    fa = os.path.join(src, "vida-archivo".encode().hex())
    if os.path.exists(fa) and not open(fa, "rb").read(8).startswith(b"anillo1 "):
        data = open(fa, "rb").read(); n = len(data) // 80
        names = ["kept", "replaced", "longer", "beaten", "dreamt", "unfit"]
        g = [data[i * 80:(i + 1) * 80] for i in range(n) if data[i * 80 + 56:i * 80 + 64].strip() in (b"kept", b"replaced", b"dreamt")]
        counts = [0] * 8
        for l in g:
            counts[names.index(l[56:64].strip().decode())] += 1
        k = 1024; slots = [b""] * min(len(g), k)
        for i in range(max(0, len(g) - k), len(g)):
            slots[i % k] = g[i]
        open(os.path.join(dst, "vida-guardados".encode().hex()), "wb").write(header(k, len(g), counts) + b"".join(slots))
        print("%-18s %9d lines that changed a model -> the latest %d" % ("vida-guardados", len(g), len(slots)))
    # her heart (razar/corazon/diario.txt: the Capitan's diary, his signature) travels inside her casa
    h = os.path.join(dst, "corazon".encode().hex())
    if not os.path.exists(h):
        shutil.copy2(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "corazon", "diario.txt"), h)
        print("%-18s her heart, %d bytes" % ("corazon", os.path.getsize(h)))
    print("before %.1f MB, after %.1f MB" % (sum(os.path.getsize(os.path.join(src, f)) for f in os.listdir(src)) / 1e6,
                                           sum(os.path.getsize(os.path.join(dst, f)) for f in os.listdir(dst)) / 1e6))

main()
