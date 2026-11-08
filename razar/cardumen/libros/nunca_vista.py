"""The books of nunca_vista.sh: a relation hilos never saw, said a few times, and whether it learns it is one it knows.

Ten people. "cuida a" says twelve pairs (each carer cares for two or three, so no "one value" rule binds it); two
more relations of the same people, "habla con" and "ve a", say eight pairs each, drawn by luck (noise). The new one,
"vela por", says k of the pairs "cuida a" says, the same way, or the other way round as "es cuidado por" (the pairs
turned), and with extra 1 one pair more that nobody said. The null: k pairs drawn among the same people that "cuida a"
does not say either way. A line of 121 "y" makes "y" the most said word (as in hilos_prueba.sh).

nunca_vista.py <folder>: one book a condition, <folder>/<name>.txt.
"""
import os
import random
import sys

GENTE = ['ana', 'eva', 'luz', 'mar', 'sol', 'rosa', 'nube', 'cielo', 'rio', 'flor']
CUIDA = [('ana', 'eva'), ('ana', 'luz'), ('eva', 'mar'), ('eva', 'sol'), ('luz', 'rosa'), ('luz', 'nube'),
         ('mar', 'cielo'), ('mar', 'rio'), ('sol', 'flor'), ('rosa', 'ana'), ('nube', 'eva'), ('cielo', 'luz')]


def ruido(seed):
    r = random.Random(seed)
    todos = [(a, b) for a in GENTE for b in GENTE if a != b]
    return r.sample(todos, 8), r.sample(todos, 8)


def libro(nueva, seed):
    habla, ve = ruido(seed)
    lineas = ['O: %s cuida a %s.' % p for p in CUIDA]
    lineas += ['O: %s habla con %s.' % p for p in habla]
    lineas += ['O: %s ve a %s.' % p for p in ve]
    lineas += nueva
    lineas.append('O: ' + 'y ' * 120 + 'y.')
    return '\n'.join(lineas) + '\n'


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    fuera = [(a, b) for a in GENTE for b in GENTE
             if a != b and (a, b) not in CUIDA and (b, a) not in CUIDA]
    for k in (2, 3, 4, 6):
        for extra in (0, 1):
            pares = CUIDA[:k]
            sobra = [('rio', 'flor')] if extra else []
            misma = ['O: %s vela por %s.' % p for p in pares + sobra]
            reves = ['O: %s es cuidado por %s.' % (b, a) for a, b in pares + sobra]
            for nombre, nueva in (('misma', misma), ('reves', reves)):
                with open(os.path.join(out, 'k%d_%s_extra%d.txt' % (k, nombre, extra)), 'w', encoding='utf-8') as f:
                    f.write(libro(nueva, 1))
        for seed in range(1, 11):
            r = random.Random(1000 + seed)
            nueva = ['O: %s vela por %s.' % p for p in r.sample(fuera, k)]
            with open(os.path.join(out, 'k%d_nulo_%02d.txt' % (k, seed)), 'w', encoding='utf-8') as f:
                f.write(libro(nueva, seed))


main()
