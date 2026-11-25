"""paso_adelante.py <casa> <archivo> <letra>: puts a step of hers at the front of her way ("caminos"), once, if it does
not begin with it already. It is given, not imposed: her way is still hers, and her judge keeps the step or takes it
out as her author answers. Her ways as they were are kept in <archivo>. Run it only while she sleeps."""
import os, struct, sys

casa, archivo, letra = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(archivo, exist_ok=True)
p = os.path.join(casa, "caminos".encode().hex())
b = open(p, "rb").read()
q = list(struct.unpack("<%dq" % (len(b) // 8), b))
i = 4
for _ in range(q[3]):
    i += 1 + q[i]
n = q[i]; w = q[i + 1:i + 1 + n]
if w[:1] == [letra]:
    print("su camino ya empieza con ese paso:", w)
else:
    open(os.path.join(archivo, "caminos-antes-del-paso-adelante"), "wb").write(b)
    q[i:i + 1 + n] = [n + 1, letra] + w
    open(p, "wb").write(struct.pack("<%dq" % len(q), *q))
    print("su camino era", w, "y ahora es", [letra] + w)
