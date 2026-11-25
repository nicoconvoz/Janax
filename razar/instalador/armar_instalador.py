"""armar_instalador.py [<her public house>]: builds the folder a normal user receives, instalador/ at the top of the
project:

    instalador/instalar-luma.exe     double click: asks where, and installs her
    instalador/datos/janaxos.exe     her kernel
    instalador/datos/luma.exe        what wakes her
    instalador/datos/ensamblador.bin, ensamblador.datos, planificador.bin     her assembler's seed (PDP)
    instalador/datos/fuentes.paquete her source and its includes: she is assembled on the user's machine
    instalador/datos/casa.paquete    her knowledge: her public house (armar_luma_publica.py makes and checks it)

The two programs that speak to Windows are built with FASM, as the kernel (FASM=... to say where it is). A packet is,
one after another: a file's name (4 bytes of how long, then it), its size and its packed size (8 bytes each), and it
packed with the host's own compression (cabinet.dll, MSZIP), which is what instalar-luma.exe unpacks it with."""
import ctypes, os, shutil, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
P = os.path.abspath(os.path.join(AQUI, "..", ".."))
CASA = sys.argv[1] if len(sys.argv) > 1 else "E:/tmp/luma_publica/casa"
FASM = os.environ.get("FASM", "E:/DevCache/fasm/FASM.EXE")
SAL = os.path.join(P, "instalador"); DAT = os.path.join(SAL, "datos")
shutil.rmtree(SAL, ignore_errors=True); os.makedirs(DAT)

env = dict(os.environ, INCLUDE=os.environ.get("INCLUDE", os.path.join(os.path.dirname(FASM), "INCLUDE")))
for fuente, salida in (("instalar.asm", os.path.join(SAL, "instalar-luma.exe")), ("luma.asm", os.path.join(DAT, "luma.exe"))):
    r = subprocess.run([FASM, os.path.join(AQUI, fuente), salida], env=env, capture_output=True, text=True)
    assert r.returncode == 0, r.stdout + r.stderr

shutil.copy(os.path.join(P, "so", "build", "janaxos.exe"), DAT)
for n in ("ensamblador.bin", "ensamblador.datos", "planificador.bin"):
    shutil.copy(os.path.join(P, "so", "pdp", "semilla", n), DAT)

cab = ctypes.WinDLL("cabinet.dll")
cab.CreateCompressor.argtypes = [ctypes.c_uint32, ctypes.c_void_p, ctypes.POINTER(ctypes.c_void_p)]
cab.Compress.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_size_t, ctypes.c_char_p, ctypes.c_size_t, ctypes.POINTER(ctypes.c_size_t)]
H = ctypes.c_void_p(); assert cab.CreateCompressor(2, None, ctypes.byref(H))       # COMPRESS_ALGORITHM_MSZIP


def paquete(destino, archivos):
    """archivos: (the name it will have, where it is now)"""
    crudo = pack = 0
    with open(destino, "wb") as g:
        for nombre, donde in archivos:
            d = open(donde, "rb").read(); c = b""
            if d:
                out = ctypes.create_string_buffer(len(d) + len(d) // 8 + 65536); n = ctypes.c_size_t()
                assert cab.Compress(H, d, len(d), out, len(out), ctypes.byref(n)), nombre
                c = out.raw[:n.value]
            nb = nombre.encode("ascii")
            g.write(len(nb).to_bytes(4, "little") + nb + len(d).to_bytes(8, "little") + len(c).to_bytes(8, "little") + c)
            crudo += len(d); pack += len(c)
    return len(archivos), crudo, pack


etiqueta = lambda s: s.encode().hex()
# her source and every include of the project, each at its place under PDP (so/herramientas/armar.sh does the same)
fuentes = []
for raiz in ("escalon0", "so", "razar"):
    for d, sub, fs in os.walk(os.path.join(P, raiz)):
        sub[:] = [s for s in sub if s != "build" and not s.startswith(".")]
        for f in fs:
            if f.endswith(".inc"):
                rel = os.path.relpath(os.path.join(d, f), P).replace("\\", "/")
                fuentes.append((etiqueta("PDP/" + rel), os.path.join(d, f)))
for rel in ("razar/cuerpo/luma.jsm", "razar/lectura/pulso.datos.jsm"):
    fuentes.append((etiqueta("PDP/" + rel), os.path.join(P, rel)))
print("fuentes: %d archivos, %.1f MB -> %.1f MB" % tuple(x / d for x, d in zip(paquete(os.path.join(DAT, "fuentes.paquete"), fuentes), (1, 1e6, 1e6))))

# her knowledge: her public house, as it is; what the installer writes itself, and what she makes at birth, stay out
FUERA = {etiqueta(n) for n in ("luma/lectora.bin", "luma/pensadora.bin", "luma/lectora.molde", "engranajes", "dormir", "pregunta", "respuesta")}
casa = [(x, os.path.join(CASA, x)) for x in sorted(os.listdir(CASA)) if x not in FUERA]
assert any(x == etiqueta("vida-memoria") for x, _ in casa), "that is not a house of hers"
print("casa: %d archivos, %.1f MB -> %.1f MB" % tuple(x / d for x, d in zip(paquete(os.path.join(DAT, "casa.paquete"), casa), (1, 1e6, 1e6))))
for d, _, fs in os.walk(SAL):
    for f in sorted(fs):
        print("%10d  %s" % (os.path.getsize(os.path.join(d, f)), os.path.relpath(os.path.join(d, f), P)))
