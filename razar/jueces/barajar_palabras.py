"""barajar_palabras.py <in> <out> <igual|barajar>: the null for the nitidez outside Spanish. Splits each line the way
Razar does (a word is a run of a-z, 0-9 and U+00C0..U+00FF; every other character is a piece of its own), keeps that
skeleton in place and, with "barajar", shuffles only the words across the whole corpus (seed 2026). With "igual" it
writes the same tokens unshuffled, so the real run and its null go through the very same path."""
import random, re, sys
PAL = r'[a-z0-9À-ÿ]+'
TOK = re.compile(PAL + r'|[^\sa-z0-9À-ÿ]')
src, dst, modo = sys.argv[1], sys.argv[2], sys.argv[3]
lineas = [TOK.findall(l.lower()) for l in open(src, encoding='utf-8', errors='replace')]
es_pal = re.compile('^' + PAL + '$')
palabras = [t for l in lineas for t in l if es_pal.match(t)]
if modo == 'barajar':
    random.Random(2026).shuffle(palabras)
it = iter(palabras)
with open(dst, 'w', encoding='utf-8') as f:
    for l in lineas:
        f.write(' '.join(next(it) if es_pal.match(t) else t for t in l) + '\n')
print('%s: %d words, %d lines, skeleton kept' % (modo, len(palabras), len(lineas)))
