"""descifrar_viva2.py <pid> <segundos> <carpeta>: watches a running Luma's rain and reads her text back, across each step
(lluvia_texto.py). Nothing is sent to her. Saves every picture in which a step of text is seen, and prints the text."""
import os, sys, time
import numpy as np
from PIL import Image
import captura, lluvia_ocr as L, lluvia_texto as X

PID, SEG, OUT = int(sys.argv[1]), float(sys.argv[2]), sys.argv[3]
os.makedirs(OUT, exist_ok=True)
h = captura.ventana(PID); P = None; n = 0; vistos = set()
T = time.time()
while time.time() - T < SEG:
    img = captura.foto(h)
    if img is None or img.max() == 0: continue
    if P is None: P = L.ajustar(img)[1]; print("ajuste", P); sys.stdout.flush()
    d, c = L.leer(img, P); n += 1
    st = X.pasos(d, c); tx = [s for s in st if X.es_texto(s[1])]
    if tx:
        clave = tuple(tuple(f) for _, f in tx)
        if clave in vistos: continue
        vistos.add(clave)
        Image.fromarray(img).save(OUT + "/texto_%04d.png" % n)
        np.save(OUT + "/texto_%04d.npy" % n, np.array([[ord(ch) for ch in fila] for fila in d]))
        print("%6.1f s  cuadro %d: %d pasos de texto -> %s" % (time.time() - T, n, len(tx), X.armar(tx))); sys.stdout.flush()
print("%d cuadros leidos, %d con texto" % (n, len(vistos)))
