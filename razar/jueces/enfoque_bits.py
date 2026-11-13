"""Free focus over a bit stream: MDL picks word size k (2..24) and offset, nobody tells it.

Usage: python -I enfoque_bits.py <file.exe> real|corrido3|barajado
Reads the executable sections of a PE file, turns them into bits, and ranks every (k, offset)
by two-part MDL (data + dictionary), in bits per covered bit. Shuffle seed 2026.
"""
def codigo(path):
    b = open(path, 'rb').read(); pe = struct.unpack_from('<I', b, 0x3C)[0]
    n = struct.unpack_from('<H', b, pe + 6)[0]; t = pe + 24 + struct.unpack_from('<H', b, pe + 20)[0]; c = bytearray()
    for i in range(n):
        o = t + 40 * i; vs, va, rs, rp = struct.unpack_from('<IIII', b, o + 8)
        if struct.unpack_from('<I', b, o + 36)[0] & 0x20000000: c += b[rp:rp + min(rs, vs or rs)]
    return ''.join(format(x, '08b') for x in c)
def mdl(s, k, o):
    toks = [s[i:i + k] for i in range(o, len(s) - k + 1, k)]
    N = len(toks); C = collections.Counter(toks); V = len(C)
    datos = -sum(n * math.log2(n / N) for n in C.values())
    modelo = V * k + V * math.log2(N)          # el diccionario: cada palabra y su cuenta
    return (datos + modelo) / (N * k)          # bits por bit cubierto
s0 = codigo(sys.argv[1]); modo = sys.argv[2]
s = s0[3:] if modo == 'corrido3' else s0
if modo == 'barajado':
    l = list(s0); random.Random(2026).shuffle(l); s = ''.join(l)
res = sorted(((mdl(s, k, o), k, o) for k in range(2, 25) for o in range(k)))
print('== %s: %d bits ==' % (modo, len(s)))
print('los 6 mejores (bits por bit, tamano, arranque):')
for c, k, o in res[:6]: print('   %.4f   k=%2d   arranque=%2d   (arranque mod 8 = %d)' % (c, k, o, o % 8))
print('  k=8 por arranque: ' + '  '.join('o%d=%.3f' % (o, mdl(s, 8, o)) for o in range(8)))
