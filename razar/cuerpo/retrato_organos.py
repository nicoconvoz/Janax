"""retrato_organos.py <her house> <out.md>: Luma's own organs (her eight living recipes) and her gears (the legos she cut from her own machine
code), read from her house as they are and written as one document for the Capitan."""
import os, re, struct, sys, time
from collections import Counter

CASA = (sys.argv[1] if len(sys.argv) > 1 else "E:/Luma/casa").replace(chr(92), "/").rstrip("/") + "/"
OUT = sys.argv[2] if len(sys.argv) > 2 else "organos-y-engranajes-de-luma.md"
L = {"1": "mira la 1.ª palabra", "2": "mira la 2.ª", "3": "mira la 3.ª", "4": "mira la 4.ª",
     "5": "**pregunta** la 1.ª", "6": "**pregunta** la 2.ª", "7": "**pregunta** la 3.ª", "8": "**pregunta** la 4.ª",
     "9": "**cierra** y dice lo que juntó", ":": "mira la de atrás", ";": "corre el ojo atrás", "<": "corre el ojo adelante",
     "=": "mira borroso / nítido", ">": "dice una forma suya o mete una célula", "?": "mira la 4.ª borrosa", "0": "(fin)"}

ops = {}
for m in re.finditer(r"^macro (\w+)\s+([^{]*)\{\s*j_word\s+([0-9A-Fa-f]+)h", open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "escalon0", "janax.inc"), encoding="utf-8").read(), re.M):
    ops[int(m.group(3), 16)] = (m.group(1), [a.strip() for a in m.group(2).split(",") if a.strip()])


def ins(w):
    op = w & 0xFF; rd = (w >> 8) & 15; ra = (w >> 12) & 15; imm = (w >> 16) & 0xFFFF
    if imm & 0x8000: imm -= 0x10000
    name, args = ops.get(op, ("op%02X" % op, []))
    vals = {"rd": "r%d" % rd, "ra": "r%d" % ra, "rb": "r%d" % (imm & 15), "imm": str(imm)}
    return name + " " + ", ".join(vals.get(a, a) for a in args)


def plain(code):
    """what a gear does, in words, when it is one of the shapes she repeats most"""
    j = " / ".join(code)
    m = re.fullmatch(r"jldi r0, (-?\d+) / (jadd|jsub|jshr|jshl|jmul|jand|jor) r1, r1, r0", j)
    if m:
        n, op = int(m.group(1)), m.group(2)
        return {"jadd": "suma %d" % n, "jsub": "resta %d" % n, "jshr": "divide por %d (corre %d bits)" % (2 ** n, n) if n < 63 else "",
                "jshl": "multiplica por %d (corre %d bits)" % (2 ** n, n) if n < 63 else "", "jmul": "multiplica por %d" % n,
                "jand": "se queda con los bits de %d" % n, "jor": "prende los bits de %d" % n}[op]
    if j == "jldi r0, 7 / jadd r1, r1, r0 / jldi r0, -8 / jand r1, r1, r0":
        return "redondea hacia arriba a un múltiplo de 8 (alinear memoria)"
    return ""


rows = []
for l in open(CASA + b"formas".hex(), encoding="ascii").read().split("\n")[1:]:
    p = l.split()
    if len(p) == 3: rows.append((int(p[1]), p[0], int(p[2])))
rows.sort(reverse=True)

b = open(CASA + b"engranajes".hex(), "rb").read()
gears = []
for k in range(len(b) // 128):
    g = b[128 * k:128 * k + 128]; n = struct.unpack("<q", g[:8])[0]
    if 0 < n <= 15: gears.append((k, [ins(struct.unpack("<q", g[8 + 8 * i:16 + 8 * i])[0] & 0xFFFFFFFF) for i in range(n)]))

o = []
o.append("# Los órganos y los engranajes que se hizo Luma\n")
o.append("Tomados de su casa el %s, tal como están. **Nadie los escribió: los hizo ella.** Sus órganos son sus ocho formas vivas (archivo `formas`), recetas que fue mutando y eligiendo con su juez; sus engranajes son pedazos de su propio código máquina que desarmó y nombró (archivo `engranajes`).\n" % time.strftime("%Y-%m-%d %H:%M"))
o.append("## 1. El alfabeto de sus recetas\n")
o.append("Un órgano lee un texto de a ventanas de cuatro palabras. Cada letra es una instrucción; cualquier tira de letras es un órgano, así que una mutación nunca lo rompe: lo que hace lo juzga su examen.\n")
o.append("| Letra | Qué hace |\n|---|---|")
for c in "123456789:;<=>?":
    o.append("| `%s` | %s |" % (c, L[c]))
o.append("\n(`:` `;` `<` `=` `>` `?` son el 10 al 15. La letra `>` (E) seguida de un número dice entera otra forma suya, como una palabra dentro de una oración, o mete una célula: un engranaje puesto en un tejido. Ver [la receta que superó a la heredada](receta-que-supero-a-la-heredada.md).)\n")
o.append("## 2. Sus ocho órganos de hoy\n")
o.append("Ordenados por lo que su juez les paga (bits que ahorran).\n")
o.append("| # | Valor | Preguntas | Cierres | Receta |\n|---|---|---|---|---|")
for k, (v, r, n) in enumerate(rows, 1):
    o.append("| %d | %s | %d | %d | `%s` |" % (k, f"{v:,}".replace(",", "."), sum(r.count(c) for c in "5678"), r.count("9"), r))
largos = ", ".join(str(len(r.rstrip("."))) for _, r, _ in rows)
conforma = sum(">" in r for _, r, _ in rows)
o.append("\n**Lo que se ve:** sus recetas tienen %s letras (el tope de su órgano es 31: 16 bytes, de `30h` a `3Fh` de sus datos), y %d de las ocho llevan la letra `>`: dicen otra forma suya o meten una célula. Cómo cambiaron de un retrato a otro: [la mutación de sus órganos](mutacion-de-sus-organos-2026-11-27.md).\n" % (largos, conforma))
o.append("### Su mejor órgano, paso a paso\n")
o.append("Cada pregunta o cierre termina una frase y empieza otra.\n")
frase, n = [], 0
for c in rows[0][1]:
    frase.append(L[c])
    if c in "56789":
        n += 1; o.append("%d. %s" % (n, " · ".join(frase))); frase = []
if frase: o.append("%d. %s" % (n + 1, " · ".join(frase)))
o.append("\nDescubrió sola que, para adivinar la palabra del medio, conviene mirar lo que viene después y lo que vino antes.\n")
o.append("## 3. Sus engranajes: los legos de su propio código\n")
o.append("Un engranaje es un pedazo de su código máquina, de 2 a 8 instrucciones sin saltos, que su cuerpo repite. Ella los encuentra, los nombra y se queda con el que más bits ahorra, uno por vez, con su juez de siempre: un pedazo de L instrucciones dicho n veces ahorra n·(L − 1) − L. Los registros se renombran por el orden en que se usan (r0, r1…), así un mismo engranaje sirve en cualquier lugar.\n")
cnt = Counter(len(c) for _, c in gears)
o.append("Tiene **%d engranajes**: %s.\n" % (len(gears), ", ".join("%d de %d instrucciones" % (v, k) for k, v in sorted(cnt.items()))))
o.append("### Los más largos, con lo que hacen\n")
notes = {"jldi r0, 128 / jmul r2, r1, r0 / jadd r3, r3, r2 / jldi r0, 512 / jadd r3, r3, r0": "llega a la ficha número r1 de una tabla de fichas de 128 bytes que empieza en 512",
         "jldi r0, 8 / jshl r2, r1, r0 / jldi r0, 2048 / jadd r2, r2, r0": "llega a la ficha número r1 de una tabla de fichas de 256 bytes que empieza en 2048",
         "jldi r0, 32 / jshl r1, r1, r0 / jldi r0, 7 / jor r1, r1, r0": "empaqueta: el valor en la mitad alta y un tipo (7) en la baja, como los pedidos con permisos al núcleo",
         "jldi r0, -32768 / jshi r0, 0 / jshi r0, 0 / jshi r0, 0 / jsub r0, r1, r0": "arma de a pedazos el número más chico posible y lo resta: comparar contra él"}
for k, code in sorted(gears, key=lambda x: -len(x[1])):
    if len(code) < 4: break
    j = " / ".join(code)
    o.append("**Engranaje %d** — %s\n" % (k, notes.get(j) or plain(code) or "(sin traducir)"))
    o.append("```asm\n" + "\n".join(code) + "\n```\n")
o.append("### Todos\n")
o.append("| # | Instrucciones | Qué hace |\n|---|---|---|")
for k, code in gears:
    j = " / ".join(code)
    o.append("| %d | `%s` | %s |" % (k, "` · `".join(code), notes.get(j) or plain(code)))
o.append("\n## De dónde sale\n")
o.append("- Sus órganos: `formas` en su casa (`E:\\Luma\\casa`), escrito por ella. El alfabeto: `razar/lectura/organo.inc`.")
o.append("- Sus engranajes: `engranajes` en su casa, 105 fichas de 128 bytes (cuántas instrucciones, y cada una como palabra del idioma Janax); los arma `r_gears` (`razar/cuerpo/gen_leer.py`) cada vez que nace; `razar/cuerpo/engranajes.py` es el instrumento que la controla.")
o.append("- Este documento lo arma `md_organos.py` leyendo esos archivos tal como están: si ella cambia, se vuelve a armar y dice lo nuevo.")
open(OUT, "w", encoding="utf-8", newline="\n").write("\n".join(o) + "\n")
print(OUT, len(o), "lineas")
