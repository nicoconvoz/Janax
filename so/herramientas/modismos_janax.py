# Text tool (it edits sources; Razar never runs it): writes the long idioms of a Janax source with the instructions
# that say them in one step (2026-11-11), in place, only where the result is the same bit for bit.
#   jcall L / jldi r, 0                              -> jcall0 r, L
#   jsub t, a, b / jldi s, 63 / jsar t, t, s / jjz t   -> jsub t, a, b / jjnn t      (jjnz: jjn)
#   jld r, b, K / jldi s, 1 / jadd r, r, s / jst r, b, K -> jldi r, 1 / jldadd r, b, K
#   jldi s, 3 / jshl t, i, s / jld b, z, K / jadd t, t, b / jld x, t, 0 -> jld b, z, K / jldx x, b, i
# The short form leaves some registers as they were before (s, t) where the long one changed them; it is used only
# when those registers are dead: on every path from there they are written before anything reads them. A call, a
# return, an end or anything the tool does not know counts as reading every register, so an unsure case is left as
# it is. Nothing inside a macro is touched, and no idiom with a label inside it (something could jump into it).
# Usage: python -I modismos_janax.py file.jsm...   (prints, per file, how many of each it wrote)
import re
import sys

REG = re.compile(r'^j(1[0-5]|[0-9])$')
ALL = frozenset(range(16))


def bare(s):
    return re.sub(r';.*', '', s.rstrip('\r\n')).strip()


def comment(s):
    m = re.search(r';.*', s.rstrip('\r\n'))
    return m.group(0) if m else ''


def reg(a):
    m = REG.match(a.strip())
    return int(m.group(1)) if m else None


class Ins:
    def __init__(self, op, args):
        self.op, self.args = op, args


def parse(line):
    b = bare(line)
    m = re.match(r'^([a-z][a-z0-9_]*)\b\s*(.*)$', b)
    if not m or b.endswith(':'):
        return None
    return Ins(m.group(1), [a.strip() for a in m.group(2).split(',')] if m.group(2) else [])


RRR = {'jadd', 'jsub', 'jmul', 'jdiv', 'jshl', 'jshr', 'jsar', 'jand', 'jor', 'jxor', 'jldx'}
COND = {'jjz', 'jjnz', 'jjn', 'jjnn'}


def effect(ins):
    """(registers read, registers written, kind) of one instruction; kind: 'go', 'jump', 'cond', 'stop'."""
    op, a = ins.op, ins.args
    r = [reg(x) for x in a]
    if op == 'jldi' and r[0] is not None:
        return set(), {r[0]}, 'go'
    if op == 'jshi' and r[0] is not None:
        return {r[0]}, {r[0]}, 'go'
    if op in RRR and len(r) == 3 and None not in r:
        return {r[1], r[2]}, {r[0]}, 'go'
    if op in ('jld', 'jldb') and r[0] is not None and r[1] is not None:
        return {r[1]}, {r[0]}, 'go'
    if op == 'jldadd' and r[0] is not None and r[1] is not None:
        return {r[0], r[1]}, {r[0]}, 'go'
    if op in ('jst', 'jstb') and r[0] is not None and r[1] is not None:
        return {r[0], r[1]}, set(), 'go'
    if op in COND and r[0] is not None:
        return {r[0]}, set(), 'cond'
    if op == 'jjmp':
        return set(), set(), 'jump'
    if op in ('jwhile', 'jwhilez', 'jwend', 'jwcheck'):
        return set(), set(), op
    return set(ALL), set(), 'stop'


def build(lines):
    macro, depth = [], 0
    for s in lines:
        b = bare(s)
        if re.match(r'^macro\b', b) or depth:
            depth += b.count('{') - b.count('}')
            macro.append(True)
        else:
            macro.append(False)
    ins, labels = {}, {}
    pending = []
    order = []
    for i, s in enumerate(lines):
        if macro[i]:
            continue
        m = re.match(r'^[ \t]*([A-Za-z_]\w*):', s)
        if m:
            pending.append(m.group(1))
            rest = bare(s)[len(m.group(1)) + 1:].strip()
            if not rest:
                continue
        p = parse(s)
        if p is None:
            continue
        ins[i] = p
        order.append(i)
        for n in pending:
            labels[n] = i
        pending = []
    nxt = {order[k]: order[k + 1] for k in range(len(order) - 1)}
    # whiles: jwhile -> its check (jwcheck or jwend); jwend -> the first instruction of the body
    stack, wto, wback = [], {}, {}
    for i in order:
        op = ins[i].op
        if op in ('jwhile', 'jwhilez'):
            stack.append([i, None])
        elif op == 'jwcheck' and stack:
            stack[-1][1] = i
        elif op == 'jwend' and stack:
            w, c = stack.pop()
            wto[w] = c if c is not None else i
            wback[i] = (nxt.get(w), w)
    return macro, ins, labels, nxt, wto, wback


def live(reg_, start, ins, labels, nxt, wto, wback, limit=4000):
    """True when some path from instruction index start may read reg_ before writing it."""
    seen, todo, steps = set(), [start], 0
    while todo:
        i = todo.pop()
        if i is None:
            return True
        if i in seen:
            continue
        seen.add(i)
        steps += 1
        if steps > limit:
            return True
        rd, wr, kind = effect(ins[i])
        if kind == 'jwend':
            w = wback.get(i)
            if w is None:
                return True
            r = reg(ins[w[1]].args[0]) if ins[w[1]].args else None
            if r is None or r == reg_:
                return True
            todo += [w[0], nxt.get(i)]
            continue
        if reg_ in rd:
            return True
        if reg_ in wr:
            continue
        if kind == 'stop':
            return True
        if kind in ('jwhile', 'jwhilez'):
            todo.append(wto.get(i))
            continue
        if kind == 'jwcheck':
            todo.append(nxt.get(i))
            continue
        if kind in ('jump', 'cond'):
            t = ins[i].args[-1]
            if t not in labels:
                return True
            todo.append(labels[t])
            if kind == 'cond':
                todo.append(nxt.get(i))
            continue
        todo.append(nxt.get(i))
    return False


def run(lines):
    macro, ins, labels, nxt, wto, wback = build(lines)
    order = sorted(ins)
    labelled = {v for v in labels.values()}
    count = {'jcall0': 0, 'jjn': 0, 'jldadd': 0, 'jldx': 0}
    out = list(lines)
    done = set()

    def seq(k, n):
        """n consecutive instructions from order[k], with no label on any but the first."""
        if k + n > len(order):
            return None
        idx = order[k:k + n]
        for a, b in zip(idx, idx[1:]):
            if nxt.get(a) != b or b in labelled or any(x in done for x in idx):
                return None
            if any(re.match(r'^[ \t]*[A-Za-z_]\w*:', lines[x]) for x in range(a + 1, b + 1)):
                return None
        return idx

    def put(idx, new):
        ind = re.match(r'^[ \t]*', lines[idx[0]]).group(0)
        nl = '\r\n' if lines[idx[0]].endswith('\r\n') else '\n'
        notes = ' '.join(c for c in (comment(lines[x]) for x in idx) if c)
        for x in idx:
            out[x] = None
            done.add(x)
        text = [f'{ind}{t}' for t in new]
        if notes:
            text[0] = f'{text[0]:<31} {notes}' if len(text[0]) < 31 else f'{text[0]} {notes}'
        out[idx[0]] = nl.join(text) + nl

    for k, i in enumerate(order):
        if i in done:
            continue
        a = ins[i]
        # jcall L / jldi r, 0
        idx = seq(k, 2)
        if idx and a.op == 'jcall' and len(a.args) == 1:
            b = ins[idx[1]]
            if b.op == 'jldi' and reg(b.args[0]) is not None and b.args[1] == '0':
                put(idx, [f'jcall0 {b.args[0]}, {a.args[0]}'])
                count['jcall0'] += 1
                continue
        # jsub t, a, b / jldi s, 63 / jsar t, t, s / jjz|jjnz t, X
        idx = seq(k, 4)
        if idx and a.op == 'jsub':
            b, c, d = (ins[x] for x in idx[1:])
            t, s = reg(a.args[0]), reg(b.args[0]) if b.args else None
            if b.op == 'jldi' and b.args[1:] == ['63'] and s is not None and s != t and \
                    c.op == 'jsar' and [reg(x) for x in c.args] == [t, t, s] and \
                    d.op in ('jjz', 'jjnz') and reg(d.args[0]) == t and \
                    s not in (reg(a.args[1]), reg(a.args[2])):
                after = [nxt.get(idx[3]), labels.get(d.args[1])]
                if all(x is not None for x in after) and \
                        not any(live(r, x, ins, labels, nxt, wto, wback) for r in (t, s) for x in after):
                    put(idx, [f'jsub {a.args[0]}, {a.args[1]}, {a.args[2]}',
                              f'{"jjnn" if d.op == "jjz" else "jjn"} {a.args[0]}, {d.args[1]}'])
                    count['jjn'] += 1
                    continue
        # jld r, b, K / jldi s, 1 / jadd r, r, s (or r, s, r) / jst r, b, K
        if idx and a.op == 'jld':
            b, c, d = (ins[x] for x in idx[1:])
            r, base, s = reg(a.args[0]), reg(a.args[1]), reg(b.args[0]) if b.args else None
            if None not in (r, base, s) and r != base and s not in (r, base) and \
                    b.op == 'jldi' and b.args[1:] == ['1'] and \
                    c.op == 'jadd' and reg(c.args[0]) == r and sorted([reg(c.args[1]), reg(c.args[2])]) == sorted([r, s]) and \
                    d.op == 'jst' and d.args == a.args:
                after = nxt.get(idx[3])
                if after is not None and not live(s, after, ins, labels, nxt, wto, wback):
                    put(idx, [f'jldi {a.args[0]}, 1', f'jldadd {a.args[0]}, {a.args[1]}, {a.args[2]}'])
                    count['jldadd'] += 1
                    continue
        # jldi s, 3 / jshl t, i, s / jld b, z, K / jadd t, t, b (or t, b, t) / jld x, t, 0
        idx = seq(k, 5)
        if idx and a.op == 'jldi' and a.args[1:] == ['3']:
            b, c, d, e = (ins[x] for x in idx[1:])
            s = reg(a.args[0])
            if b.op == 'jshl' and len(b.args) == 3 and c.op == 'jld' and d.op == 'jadd' and e.op == 'jld':
                t, i_, s2 = (reg(x) for x in b.args)
                base, z = reg(c.args[0]), reg(c.args[1])
                x = reg(e.args[0])
                if None not in (s, t, i_, base, z, x) and s2 == s and s != i_ and base != i_ and \
                        base not in (t, s) and z not in (t, s) and \
                        reg(d.args[0]) == t and sorted([reg(d.args[1]), reg(d.args[2])]) == sorted([t, base]) and \
                        reg(e.args[1]) == t and e.args[2] == '0':
                    after = nxt.get(idx[4])
                    dead = [r for r in (s, t) if r != x]
                    if after is not None and not any(live(r, after, ins, labels, nxt, wto, wback) for r in dead):
                        put(idx, [f'jld {c.args[0]}, {c.args[1]}, {c.args[2]}',
                                  f'jldx {e.args[0]}, {c.args[0]}, {b.args[1]}'])
                        count['jldx'] += 1
                        continue
    return [s for s in out if s is not None], count


def main():
    for path in sys.argv[1:]:
        with open(path, encoding='utf-8', newline='') as f:
            lines = f.readlines()
        new, count = run(lines)
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.writelines(new)
        print(' '.join(f'{k}={v}' for k, v in count.items()), path)


main()
