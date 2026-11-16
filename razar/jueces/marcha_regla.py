"""Marcha 2: Gotching's rule, the skeleton decides which group is heard (pre-registered in
documentacion/razar/datos/marcha-preregistro-2.txt). Reads the .oido files (what the bat heard per limb)
and the .marcha headers (only for the mode the game gave, used to score at the end).
usage: python marcha_regla.py <oido folder> <marcha folder>"""
import math, os, sys
from collections import Counter, defaultdict

JUNTOS, MISMO = 0.15, 0.10

def desfasaje(a, b):
    d = math.fmod(abs(a - b), 2 * math.pi) / (2 * math.pi)
    return 1 - d if d > 0.5 else d

def leer_oido(ruta):
    miembros = []
    for linea in open(ruta, encoding="utf-8"):
        c = linea.split()
        if c and c[0] == "miembro" and "periodo" in c:
            miembros.append({"pata": c[3] == "1", "p": float(c[5]), "amp": float(c[7]), "fase": float(c[9])})
    return miembros

def regla(miembros):
    grupos = {True: [m for m in miembros if m["pata"]], False: [m for m in miembros if not m["pata"]]}
    peso = {k: sum(m["amp"] for m in v) for k, v in grupos.items()}
    if peso[True] == 0 and peso[False] == 0:
        return "-"
    manda = peso[True] > peso[False]
    g = sorted(grupos[manda], key=lambda m: -m["amp"])
    par = None
    for i in range(len(g)):
        for j in range(i + 1, len(g)):
            if abs(g[i]["p"] - g[j]["p"]) / max(g[i]["p"], g[j]["p"]) <= MISMO:
                par = (g[i], g[j]); break
        if par: break
    if par is None:
        return "Reptar"
    d = desfasaje(par[0]["fase"], par[1]["fase"])
    if not manda and d < JUNTOS: return "Volar"
    if manda and d >= JUNTOS: return "Caminar"
    return "Reptar"

def main(oido, marcha):
    n = ok = 0
    modos = Counter(); matriz = defaultdict(Counter)
    for f in sorted(os.listdir(oido)):
        if not f.endswith(".oido"): continue
        base = f[:-5]
        modo = open(os.path.join(marcha, base + ".marcha"), encoding="utf-8").readline().split()[3]
        dice = regla(leer_oido(os.path.join(oido, f)))
        n += 1; modos[modo] += 1; matriz[modo][dice] += 1; ok += dice == modo
    mayor = max(modos.values())
    print(f"MARCHA 2 (regla de Gotching) en {n} grabaciones")
    print(f"B1 acierta {ok} ({100*ok/n:.1f} %)   la mayoritaria {mayor} ({100*mayor/n:.1f} %)")
    print("B2 barajado: la marcha 1 no oyo ningun ritmo barajado (0 de 944): la regla no tiene con que decir -> 0 aciertos")
    print("modo del juego -> lo que dijo la regla")
    for m in sorted(matriz):
        print(f"  {m:8s} n={modos[m]:<4d} " + "  ".join(f"{d} {matriz[m][d]}" for d in ("Caminar", "Volar", "Reptar", "-")))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
