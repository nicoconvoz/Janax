"""comer_codigo.py <casa> [fuente...] [--maquina programa...]: feeds Luma code, both ways (the Capitan, 2026-11-20:
"dale de comer el codigo de maquina del codigo libre y tambien el codigo fuente... las dos cosas").

Every file of her house whose label starts with "libro" is a book her reader reads (lectura.inc: shelf_build); her
reader is launched anew for each reading, so a book put there is read from her next reading on, with nothing
restarted. What she read before was of another shelf: "leido" keeps it, and she reads again for this one.

  source        a text, as it is: its label is "libro-fuente-<name>".
  machine code  a program's bytes said as text, so that she can read them: every byte a word of two hexadecimal
                digits, sixteen to a line (a line is what her reader keeps apart, one in K, to sit its exam).
                Label "libro-maquina-<name>". Nothing is interpreted: which bytes go together is hers to find.

A book already there with the same bytes is left alone, under whatever name. Prints what the shelf holds afterwards.
The books do not travel with the repository: each has its own licence (the Janax kernel and Luma are Apache 2.0;
KolibriOS is GPL-2.0; Lua is MIT)."""
import os, sys

def label(s): return s.encode().hex()

def put(casa, name, data):
    p = os.path.join(casa, label(name))
    if os.path.exists(p) and open(p, "rb").read() == data:
        return "ya estaba"
    for f in os.listdir(casa):          # the same bytes under another name: the same book, said once
        try:
            n = bytes.fromhex(f).decode()
        except ValueError:
            continue
        q = os.path.join(casa, f)
        if n.startswith("libro") and n != name and os.path.getsize(q) == len(data) and open(q, "rb").read() == data:
            return "ya estaba, como " + n
    open(p, "wb").write(data); return "nuevo"

def main():
    casa = sys.argv[1]; args = sys.argv[2:]
    cut = args.index("--maquina") if "--maquina" in args else len(args)
    for f in args[:cut]:
        n = "libro-fuente-" + os.path.splitext(os.path.basename(f))[0]
        print("%-34s %s" % (n, put(casa, n, open(f, "rb").read())))
    for f in args[cut + 1:]:
        b = open(f, "rb").read()
        text = "\n".join(" ".join("%02x" % c for c in b[i:i + 16]) for i in range(0, len(b), 16)) + "\n"
        n = "libro-maquina-" + os.path.splitext(os.path.basename(f))[0]
        print("%-34s %s (%d bytes de programa)" % (n, put(casa, n, text.encode()), len(b)))
    total = 0
    for f in sorted(os.listdir(casa)):
        try:
            n = bytes.fromhex(f).decode()
        except ValueError:
            continue
        if n.startswith("libro"):
            s = os.path.getsize(os.path.join(casa, f)); total += s
            print("  %-32s %9d bytes" % (n, s))
    print("su estante: %.2f MB" % (total / 1e6))

if __name__ == "__main__":
    main()
