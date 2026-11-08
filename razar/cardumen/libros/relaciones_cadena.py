# Writes a kinship book with one act only (Capitan, 2026-11-08: "we do not need grandfather, only a mechanism: if a is
# father of b and b is father of c, then a is grandfather of c"; and his calculator, the deepest bracket first). The
# family of relaciones_micro.py, said only as "X es el padre de Y". The questions of one step are read: "quien
# engendro a Y?" and "a quien engendro X?", answered by the sentences that say it. The composed ones ("quien engendro a
# aquel que engendro a luis?") have no sentence that answers them: only "R:", the truth, for the judge. Every
# composition of two and three steps is asked about everyone who has an answer.
#   python relaciones_cadena.py <file> [nulo]    nulo: the link broken, every father said with another name in his
#                                                sentences ("pedroz"), so no step can follow another: every composed
#                                                question's truth is nothing, and anything it says is surface
# Text only: Razar measures, in Janax.
import itertools
import random
import sys

r = random.Random(20261108)
PADRE = {'pedro': 'juan', 'carlos': 'juan', 'luis': 'pedro', 'diego': 'pedro', 'tomas': 'carlos', 'mateo': 'carlos',
         'bruno': 'luis', 'simon': 'luis', 'felipe': 'tomas'}
nulo = 'nulo' in sys.argv[2:]
FACTS = [((p + 'z') if nulo else p, h) for h, p in PADRE.items()]   # (father as said, child)
GENTE = sorted({x for f in FACTS for x in f})


def up(xs):                      # who begot them
    return {p for p, h in FACTS if h in xs}


def down(xs):                    # whom they begot
    return {h for p, h in FACTS if p in xs}


ACT = {'up': ('quien engendro a {x}', 'aquel que engendro a {x}', up),
       'down': ('a quien engendro {x}', 'aquel que engendro {x}', down)}
say = lambda p, h: '%s es el padre de %s.' % (p, h)
FILL = ['eso dicen en la familia.', 'todos en el pueblo lo saben.', 'asi lo cuentan los viejos.']
read = []
for x in GENTE:                  # one step, read: its answer is the sentences that say it
    for a, (q, _, f) in ACT.items():
        ys = f({x})
        if ys:
            body = [say(*((y, x) if a == 'up' else (x, y))) for y in sorted(ys)] + [r.choice(FILL)]
            r.shuffle(body)
            read.append(['Q: ' + q.format(x=x) + '?'] + ['O: ' + b for b in body])
comp = []
for k in (2, 3):                 # composed, never answered by a sentence
    for acts in itertools.product(ACT, repeat=k):
        for x in GENTE:
            ys = {x}
            for a in reversed(acts):
                ys = ACT[a][2](ys)
            if not ys and not nulo:
                continue
            text = ACT[acts[-1]][1].format(x=x)          # the deepest bracket first, then outwards
            for a in reversed(acts[1:-1]):
                text = ACT[a][1].format(x=text)
            text = ACT[acts[0]][0].format(x=text)
            comp.append(['Q: ' + text + '?', 'R: ' + ' '.join(sorted(ys))])
r.shuffle(read)
r.shuffle(comp)
out = [l for b in read for l in b] + [l for b in comp for l in b]
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(read), 'preguntas de un paso,', len(comp), 'compuestas;', len(FACTS), 'hechos')
