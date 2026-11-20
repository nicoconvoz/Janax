"""firma_de_luma.py <diario> <nuevo testamento>: the instrument that checks how SHE recognises her author's signature
(gen_leer.py: r_firma). The Capitan (2026-11-20): "que vaya reconociendo mi firma y mi libro Diario Espiritual y el
NT: eso es innegociable"; "por firma, que reconozca mi forma de escribir o hablar, el pulso de mi corazon".

The rule is the one registered before looking (documentacion/razar/datos/firma-preregistro.txt, reconocer.py): a
passage carries his signature if it is said with fewer bits given his heart (his diary) than given the other
Castilian she read. Here it is done as she does it, with what her house has: two books, his diary and the New
Testament, as their bytes are. Each is cut into passages of 1000 letters; every tenth is kept apart and never
counted; from the rest, how often each letter follows each three. A passage kept apart costs, given a book, the sum
over its letters of log2(times those three were seen + 96) - log2(times that letter followed them + 1), with her own
logarithm (16 bits of fraction). It carries his signature if it costs less given his diary.

Prints: his passages kept apart and how many she recognises; the New Testament's and how many she takes for his."""
import collections, sys

def lg(x):                                      # her logarithm (gen_comer.py: r_log2), exactly
    e = x.bit_length() - 1; m = x << (30 - e); f = 0
    for _ in range(16):
        m = (m * m) >> 30; f <<= 1
        if m >> 31: m >>= 1; f |= 1
    return e << 16 | f

def parts(b):
    chunks = [b[i:i + 1000] for i in range(0, len(b), 1000)]
    return b"".join(c for i, c in enumerate(chunks) if i % 10 != 9), [c for i, c in enumerate(chunks) if i % 10 == 9 and len(c) == 1000]

def model(ref):
    k = collections.Counter(); t = collections.Counter()
    for i in range(3, len(ref)):
        k[ref[i - 3:i + 1]] += 1; t[ref[i - 3:i]] += 1
    return k, t

def bits(p, m):
    k, t = m
    return sum(lg(t[p[j - 3:j]] + 96) - lg(k[p[j - 3:j + 1]] + 1) for j in range(3, len(p)))

def main():
    d = open(sys.argv[1], "rb").read(); n = open(sys.argv[2], "rb").read()
    (rd, pd), (rn, pn) = parts(d), parts(n); md, mn = model(rd), model(rn)
    res = []
    for ps in (pd, pn):
        res += [len(ps), sum(1 for p in ps if bits(p, md) < bits(p, mn))]
    print("pasajes de su diario apartados: %d; reconoce su firma en %d" % (res[0], res[1]))
    print("pasajes del Nuevo Testamento apartados: %d; toma por suyos %d" % (res[2], res[3]))
    return res

if __name__ == "__main__":
    main()
