# Writes a micro test book of kinship (Capitan, 2026-11-08: "a handful, and every case of it"): one family of eleven in
# four generations, and every relation of it asked about every one who has it. The questions are said by composing
# two acts, "engendro" and "nacio del mismo" ("who begot the one who begot luis?" is the grandfather), and share with
# their answer only the person; the answers say the relation by its name. Every fact is said twice, once from each side
# ("pedro es el padre de luis", "luis es el hijo de pedro"), each the answer of another question: the other sentences
# about a person are the decoys, in their own shape and with the roles swapped.
#   python relaciones_micro.py <file> [nulo]    nulo: each answer says a relation drawn at random (the null: the
#                                               question no longer says which name its answer has)
# Text only: Razar measures, in Janax.
import random
import sys

r = random.Random(20261108)
PADRE = {'pedro': 'juan', 'carlos': 'juan', 'luis': 'pedro', 'diego': 'pedro', 'tomas': 'carlos', 'mateo': 'carlos',
         'bruno': 'luis', 'simon': 'luis', 'felipe': 'tomas'}
GENTE = ['juan'] + list(PADRE)


def hijos(x):
    return [h for h, p in PADRE.items() if p == x]


def padre(x):
    return [PADRE[x]] if x in PADRE else []


def abuelo(x):
    return [a for p in padre(x) for a in padre(p)]


def nietos(x):
    return [n for h in hijos(x) for n in hijos(h)]


def hermanos(x):
    return [h for p in padre(x) for h in hijos(p) if h != x]


def tios(x):
    return [t for p in padre(x) for t in hermanos(p)]


def sobrinos(x):
    return [s for h in hermanos(x) for s in hijos(h)]


def primos(x):
    return [c for t in tios(x) for c in hijos(t)]


REL = [  # (the question, composed from the two acts; the answer's name; who answers)
    ('quien engendro a {x}?', 'padre', padre),
    ('a quien engendro {x}?', 'hijo', hijos),
    ('quien engendro al que engendro a {x}?', 'abuelo', abuelo),
    ('a quien engendro el que engendro {x}?', 'nieto', nietos),
    ('quien nacio del mismo que {x}?', 'hermano', hermanos),
    ('quien nacio del mismo que engendro a {x}?', 'tio', tios),
    ('a quien engendro el que nacio del mismo que {x}?', 'sobrino', sobrinos),
    ('a quien engendro el que nacio del mismo que engendro a {x}?', 'primo', primos),
]
FILL = ['eso dicen en la familia.', 'todos en el pueblo lo saben.', 'asi lo cuentan los viejos.',
        'es algo conocido.', 'nadie lo discute.', 'asi fue siempre.']
Q = [(q, name, x, f(x)) for q, name, f in REL for x in GENTE if f(x)]
r.shuffle(Q)
out = []
for q, name, x, ys in Q:
    out.append('Q: ' + q.format(x=x))
    said = (lambda: r.choice(REL)[1]) if 'nulo' in sys.argv[2:] else (lambda: name)
    body = ['%s es el %s de %s.' % (y, said(), x) for y in ys] + [r.choice(FILL)]
    r.shuffle(body)
    out += ['O: ' + b for b in body]
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(Q), 'preguntas,', sum(1 for o in out if o.startswith('O: ')), 'oraciones;',
      ', '.join('%s %d' % (name, sum(1 for _, n, _, _ in Q if n == name)) for _, name, _ in REL))
