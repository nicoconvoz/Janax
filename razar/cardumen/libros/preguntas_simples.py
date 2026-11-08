# Writes a test book of simple questions (Q:/O: lines, as sentido.jsm writes them) with seven mechanisms, each over
# many things, and decoy sentences that say the same things without answering. Text only: Razar measures, in Janax.
# With 'otras' after the file, every question is said with other words, none of them in its answer but the thing; with
# 'agrupado', the questions go by mechanism, 16 each, in a row.
import random
import sys

r = random.Random(20261108)
M = []
for x, y in [('el gato', 'un animal'), ('la rosa', 'una flor'), ('el roble', 'un arbol'), ('el martillo', 'una herramienta'),
             ('la guitarra', 'un instrumento'), ('el sol', 'una estrella'), ('la tierra', 'un planeta'), ('el oro', 'un metal'),
             ('la manzana', 'una fruta'), ('la zanahoria', 'una verdura'), ('el tiburon', 'un pez'), ('el aguila', 'un ave'),
             ('la mesa', 'un mueble'), ('el auto', 'un vehiculo'), ('el violin', 'un instrumento'), ('el cobre', 'un metal'),
             ('la pera', 'una fruta'), ('el pino', 'un arbol'), ('la vaca', 'un animal'), ('el clavel', 'una flor')]:
    M.append(('que es ' + x + '?', x + ' es ' + y + '.', x))
for x, y in [('el oso', 'el bosque'), ('el pez', 'el agua'), ('el camello', 'el desierto'), ('el pinguino', 'el hielo'),
             ('el mono', 'la selva'), ('la vaca', 'el campo'), ('el topo', 'la tierra'), ('la abeja', 'la colmena'),
             ('el pajaro', 'el nido'), ('el leon', 'la sabana'), ('la rana', 'la laguna'), ('el murcielago', 'la cueva'),
             ('la ardilla', 'el arbol'), ('el delfin', 'el mar'), ('la hormiga', 'el hormiguero'), ('el caballo', 'el establo')]:
    M.append(('donde vive ' + x + '?', x + ' vive en ' + y + '.', x))
for x, y in [('el limon', 'amarillo'), ('el cielo', 'azul'), ('la hierba', 'verde'), ('la nieve', 'blanca'),
             ('el carbon', 'negro'), ('la frutilla', 'roja'), ('la naranja', 'naranja'), ('la uva', 'violeta'),
             ('el tomate', 'rojo'), ('la leche', 'blanca'), ('el chocolate', 'marron'), ('la banana', 'amarilla'),
             ('el pasto', 'verde'), ('el mar', 'azul'), ('la ceniza', 'gris'), ('la sangre', 'roja')]:
    M.append(('de que color es ' + x + '?', x + ' es de color ' + y + '.', x))
for x, y in [('la arana', 'ocho'), ('el perro', 'cuatro'), ('la gallina', 'dos'), ('la hormiga', 'seis'),
             ('el pulpo', 'ocho'), ('el caballo', 'cuatro'), ('el pato', 'dos'), ('la mosca', 'seis'), ('el gato', 'cuatro'),
             ('el canguro', 'dos'), ('la abeja', 'seis'), ('el elefante', 'cuatro'), ('el escorpion', 'ocho'),
             ('la vaca', 'cuatro'), ('el loro', 'dos'), ('el grillo', 'seis')]:
    M.append(('cuantas patas tiene ' + x + '?', x + ' tiene ' + y + ' patas.', x))
for x, y in [('el quijote', 'cervantes'), ('hamlet', 'shakespeare'), ('la odisea', 'homero'), ('martin fierro', 'hernandez'),
             ('rayuela', 'cortazar'), ('el aleph', 'borges'), ('la iliada', 'homero'), ('macbeth', 'shakespeare'),
             ('ficciones', 'borges'), ('facundo', 'sarmiento'), ('el principito', 'exupery'), ('frankenstein', 'shelley'),
             ('dracula', 'stoker'), ('la metamorfosis', 'kafka'), ('el proceso', 'kafka'), ('otelo', 'shakespeare')]:
    M.append(('quien escribio ' + x + '?', y + ' escribio ' + x + '.', x))
for x, y in [('el conejo', 'zanahorias'), ('el leon', 'carne'), ('la vaca', 'pasto'), ('el mono', 'bananas'),
             ('el oso', 'miel'), ('el raton', 'queso'), ('la gallina', 'maiz'), ('el panda', 'bambu'), ('el gato', 'pescado'),
             ('el caballo', 'avena'), ('la ardilla', 'nueces'), ('el koala', 'hojas'), ('el tiburon', 'peces'),
             ('la abeja', 'polen'), ('la jirafa', 'hojas'), ('el perro', 'huesos')]:
    M.append(('que come ' + x + '?', x + ' come ' + y + '.', x))
for x, y in [('roma', 'italia'), ('paris', 'francia'), ('madrid', 'espana'), ('lima', 'peru'), ('tokio', 'japon'),
             ('berlin', 'alemania'), ('cordoba', 'argentina'), ('lisboa', 'portugal'), ('quito', 'ecuador'),
             ('mendoza', 'argentina'), ('londres', 'inglaterra'), ('atenas', 'grecia'), ('moscu', 'rusia'),
             ('santiago', 'chile'), ('bogota', 'colombia'), ('montevideo', 'uruguay')]:
    M.append(('en que pais esta ' + x + '?', x + ' esta en ' + y + '.', x))
if len(sys.argv) > 2 and sys.argv[2] == 'otras':  # the same questions said with other words: only the thing is shared
    ALT = [('que es ', 'a que clase pertenece '), ('donde vive ', 'donde habita '), ('de que color es ', 'que tono muestra '),
           ('cuantas patas tiene ', 'cuantas piernas usa '), ('quien escribio ', 'quien fue autor de '),
           ('que come ', 'de que se alimenta '), ('en que pais esta ', 'a que nacion pertenece ')]
    N = []
    for q, a, x in M:
        for o, n in ALT:
            if q.startswith(o):
                q = n + q[len(o):]
                break
        N.append((q, a, x))
    M = N
if 'agrupado' in sys.argv[2:]:          # by mechanism, 16 each, in a row: a stretch of the seeds is one relation
    G = {}
    for q, a, x in M:
        G.setdefault(q.replace(x, ''), []).append((q, a, x))
    K = []
    for q, a, x in M:
        k = next(k for k in G if (q, a, x) in G[k])
        if k not in K:
            K.append(k)
    M = []
    for k in K:
        M += G[k][:16]
else:
    r.shuffle(M)
things = [m[2] for m in M]
FILL = ['eso dicen los libros.', 'es algo que todos saben.', 'lo aprendimos en la escuela.', 'asi es desde siempre.',
        'mucha gente lo sabe.', 'es bueno recordarlo.']
VERBS = ['y', 'juega con', 'mira a', 'esta cerca de', 'se parece a', 'no conoce a']
out = []
for q, a, x in M:
    out.append('Q: ' + q)
    body = [a, r.choice(FILL)]
    for _ in range(2):                  # decoys: other things, said without answering
        t = r.choice(things)
        u = r.choice(things)
        if t != x and u != x and t != u:
            body.append(t + ' ' + r.choice(VERBS) + ' ' + u + '.')
    r.shuffle(body)
    for b in body:
        out.append('O: ' + b)
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(M), 'preguntas,', sum(1 for o in out if o.startswith('O: ')), 'oraciones')
