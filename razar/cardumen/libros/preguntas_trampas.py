# Writes a test book of simple questions whose decoys look like answers (Capitan's other chat, 2026-11-08: the decoys
# of preguntas_simples.py were told apart by their verbs, "mira a", "se parece a", that no answer has). Every question
# is said with other words (only the thing is shared with its answer). The decoys of a thing are answers in shape:
# the thing in another mechanism ("el conejo vive en el campo"), or in the other role of its own ("el zorro come el
# conejo"); they go into the answers of questions about other things, so they never count as right.
#   python preguntas_trampas.py <file> [agrupado]    agrupado: by mechanism, 16 each, in a row
# Text only: Razar measures, in Janax.
import random
import sys

r = random.Random(20261108)
MEC = [
    ('a que clase pertenece {x}?', '{x} es {y}.', [
        ('el gato', 'un animal'), ('la rosa', 'una flor'), ('el roble', 'un arbol'), ('el martillo', 'una herramienta'),
        ('la guitarra', 'un instrumento'), ('el sol', 'una estrella'), ('la tierra', 'un planeta'), ('el oro', 'un metal'),
        ('la manzana', 'una fruta'), ('la zanahoria', 'una verdura'), ('el tiburon', 'un pez'), ('el aguila', 'un ave'),
        ('la mesa', 'un mueble'), ('el auto', 'un vehiculo'), ('el violin', 'un instrumento'), ('el cobre', 'un metal')]),
    ('donde habita {x}?', '{x} vive en {y}.', [
        ('el oso', 'el bosque'), ('el pez', 'el agua'), ('el camello', 'el desierto'), ('el pinguino', 'el hielo'),
        ('el mono', 'la selva'), ('la vaca', 'el campo'), ('el topo', 'la tierra'), ('la abeja', 'la colmena'),
        ('el pajaro', 'el nido'), ('el leon', 'la sabana'), ('la rana', 'la laguna'), ('el murcielago', 'la cueva'),
        ('la ardilla', 'el arbol'), ('el delfin', 'el mar'), ('la hormiga', 'el hormiguero'), ('el caballo', 'el establo')]),
    ('que tono muestra {x}?', '{x} es de color {y}.', [
        ('el limon', 'amarillo'), ('el cielo', 'azul'), ('la hierba', 'verde'), ('la nieve', 'blanca'),
        ('el carbon', 'negro'), ('la frutilla', 'roja'), ('la naranja', 'naranja'), ('la uva', 'violeta'),
        ('el tomate', 'rojo'), ('la leche', 'blanca'), ('el chocolate', 'marron'), ('la banana', 'amarilla'),
        ('el pasto', 'verde'), ('el mar', 'azul'), ('la ceniza', 'gris'), ('la sangre', 'roja')]),
    ('cuantas piernas usa {x}?', '{x} tiene {y} patas.', [
        ('la arana', 'ocho'), ('el perro', 'cuatro'), ('la gallina', 'dos'), ('la hormiga', 'seis'),
        ('el pulpo', 'ocho'), ('el caballo', 'cuatro'), ('el pato', 'dos'), ('la mosca', 'seis'), ('el gato', 'cuatro'),
        ('el canguro', 'dos'), ('la abeja', 'seis'), ('el elefante', 'cuatro'), ('el escorpion', 'ocho'),
        ('la vaca', 'cuatro'), ('el loro', 'dos'), ('el grillo', 'seis')]),
    ('quien fue autor de {x}?', '{y} escribio {x}.', [
        ('el quijote', 'cervantes'), ('hamlet', 'shakespeare'), ('la odisea', 'homero'), ('martin fierro', 'hernandez'),
        ('rayuela', 'cortazar'), ('el aleph', 'borges'), ('la iliada', 'homero'), ('macbeth', 'shakespeare'),
        ('ficciones', 'borges'), ('facundo', 'sarmiento'), ('el principito', 'exupery'), ('frankenstein', 'shelley'),
        ('dracula', 'stoker'), ('la metamorfosis', 'kafka'), ('el proceso', 'kafka'), ('otelo', 'shakespeare')]),
    ('de que se alimenta {x}?', '{x} come {y}.', [
        ('el conejo', 'zanahorias'), ('el leon', 'carne'), ('la vaca', 'pasto'), ('el mono', 'bananas'),
        ('el oso', 'miel'), ('el raton', 'queso'), ('la gallina', 'maiz'), ('el panda', 'bambu'), ('el gato', 'pescado'),
        ('el caballo', 'avena'), ('la ardilla', 'nueces'), ('el koala', 'hojas'), ('el tiburon', 'peces'),
        ('la abeja', 'polen'), ('la jirafa', 'hojas'), ('el perro', 'huesos')]),
    ('a que nacion pertenece {x}?', '{x} esta en {y}.', [
        ('roma', 'italia'), ('paris', 'francia'), ('madrid', 'espana'), ('lima', 'peru'), ('tokio', 'japon'),
        ('berlin', 'alemania'), ('cordoba', 'argentina'), ('lisboa', 'portugal'), ('quito', 'ecuador'),
        ('mendoza', 'argentina'), ('londres', 'inglaterra'), ('atenas', 'grecia'), ('moscu', 'rusia'),
        ('santiago', 'chile'), ('bogota', 'colombia'), ('montevideo', 'uruguay')]),
]
ROLE = {1, 4, 5, 6}  # the mechanisms whose other role (the value's) can take a thing


def say(m, x, y):
    return MEC[m][1].format(x=x, y=y)


Q = []  # (mechanism, thing, its value)
for m, (_, _, pairs) in enumerate(MEC):
    for x, y in pairs:
        Q.append((m, x, y))
truth = {(m, x): y for m, x, y in Q}
things = sorted({x for _, x, _ in Q})


def decoys(m, x):
    """Sentences about x shaped as answers that do not answer (m, x)."""
    out = []
    others = [k for k in range(len(MEC)) if k != m]
    r.shuffle(others)
    for k in others[:2]:                 # x in another mechanism
        ys = [y for kk, _, y in Q if kk == k]
        y = truth.get((k, x)) or r.choice(ys)
        out.append(say(k, x, y) if k != 4 else say(k, x, r.choice(ys)))
    if m in ROLE:                        # x in the other role of its own mechanism
        z = r.choice([t for t in things if t != x])
        out.append(say(m, z, x))
    return out


if 'agrupado' in sys.argv[2:]:
    order = Q
else:
    order = Q[:]
    r.shuffle(order)
FILL = ['eso dicen los libros.', 'es algo que todos saben.', 'lo aprendimos en la escuela.', 'asi es desde siempre.',
        'mucha gente lo sabe.', 'es bueno recordarlo.']
pool = []                                # (thing, decoy) to be placed in another thing's answer
for m, x, y in order:
    pool += [(x, d) for d in decoys(m, x)]
r.shuffle(pool)
bodies = [[say(m, x, y), r.choice(FILL)] for m, x, y in order]
for t, d in pool:                        # each decoy into the answer of a question about another thing
    for _ in range(50):
        i = r.randrange(len(order))
        if order[i][1] != t and t not in d.replace(order[i][1], '') or order[i][1] not in d:
            if order[i][1] not in d:
                bodies[i].append(d)
                break
out = []
for (m, x, y), b in zip(order, bodies):
    out.append('Q: ' + MEC[m][0].format(x=x))
    r.shuffle(b)
    out += ['O: ' + s for s in b]
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(order), 'preguntas,', sum(1 for o in out if o.startswith('O: ')), 'oraciones,', len(pool), 'trampas')
