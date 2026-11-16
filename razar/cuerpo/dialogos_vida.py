"""dialogos_vida.py <casa real> <casa control>: the bets of documentacion/razar/datos/vida-dialogos-preregistro.txt,
computed from the "dialogos" and "lexico" files of two runs of vida.jsm (the real build and VIDA_CONTROL=1).
Reads the run folders only; it carries no data."""
import sys, os

def read(casa, name):
    p = os.path.join(casa, name.encode().hex())
    return open(p, "rb").read().decode() if os.path.exists(p) else ""

def dialogs(casa):
    out = []
    for x in read(casa, "dialogos").split("\n"):
        if len(x) < 91:
            continue
        out.append({"v": x[74], "exact": x[76] == "1", "now": int(x[78:84]), "with": int(x[85:91]),
                    "inspired": len(x) > 93 and x[93] == "1"})
    return out

def shared(casa):
    t = read(casa, "lexico").split("\n")
    n = int(t[0].split()[1]) if t and t[0].startswith("lexico1") else 0
    holders = {}
    for ln in t[1:1 + n]:
        w = ln.split()
        key = tuple(int(v) for v in w[1:5])
        holders.setdefault(key, set()).add(w[0])
    tot = len(holders)
    two = sum(1 for h in holders.values() if len(h) >= 2)
    return tot, two

def stats(casa):
    d = dialogs(casa)
    n = len(d)
    kept = [x for x in d if x["v"] == "K"]
    bits = sum(x["now"] - x["with"] for x in kept)
    exact = sum(1 for x in d if x["exact"])
    third = max(1, n // 3)
    first = sum(1 for x in d[:third] if x["v"] == "K") / third
    last = sum(1 for x in d[-third:] if x["v"] == "K") / third
    tot, two = shared(casa)
    insp = [x for x in d if x["inspired"]]
    insp_kept = sum(1 for x in insp if x["v"] == "K")
    return {"n": n, "kept": len(kept), "rate": len(kept) / max(1, n), "bits": bits, "exact": exact,
            "exact_rate": exact / max(1, n), "first": first, "last": last, "assoc": tot, "shared": two,
            "shared_rate": two / max(1, tot), "insp": len(insp), "insp_kept": insp_kept}

r, c = stats(sys.argv[1]), stats(sys.argv[2])
for name, st_ in (("real", r), ("control", c)):
    print("%-8s dialogues naming a dream inspired by a newcomer: %d, kept %d" % (name, st_["insp"], st_["insp_kept"]))
for name, s in (("real", r), ("control", c)):
    print("%-8s dialogues %d, kept %d (%.4f), bits saved %d, exact %d (%.4f), success first third %.4f last third %.4f,"
          " associations %d, held by >= 2 creatures %d (%.4f)" % (name, s["n"], s["kept"], s["rate"], s["bits"], s["exact"],
          s["exact_rate"], s["first"], s["last"], s["assoc"], s["shared"], s["shared_rate"]))
def ratio(a, b):
    return a / b if b else float("inf")
print("C1 effect: real/control kept rate = %.2f (bet >= 1.5): %s" % (ratio(r["rate"], c["rate"]), "WINS" if ratio(r["rate"], c["rate"]) >= 1.5 else "FAILS"))
ok2 = r["exact_rate"] >= 0.05 and ratio(r["exact_rate"], c["exact_rate"]) >= 2
print("C2 rebuilding: real exact %.4f, real/control %.2f (bet >= 5 %% and >= 2): %s" % (r["exact_rate"], ratio(r["exact_rate"], c["exact_rate"]), "WINS" if ok2 else "FAILS"))
print("C3 bits: real/control = %.2f (bet >= 1.5): %s" % (ratio(r["bits"], c["bits"]), "WINS" if ratio(r["bits"], c["bits"]) >= 1.5 else "FAILS"))
ok4 = r["shared_rate"] > 0 and ratio(r["shared_rate"], c["shared_rate"]) >= 2
print("C4 shared vocabulary: real %.4f, control %.4f (bet: real > 0 and >= 2 x control): %s" % (r["shared_rate"], c["shared_rate"], "WINS" if ok4 else "FAILS"))
print("C5 over time (real): last third %.4f vs first third %.4f: %s" % (r["last"], r["first"], "WINS" if r["last"] > r["first"] else "FAILS"))
