# Text tool (it edits sources; Razar never runs it): turns the loops written by hand in a Janax source into rotated
# whiles, in place. The while is Janax's only loop (Capitan).
#   L:                          jwhile r          (jwhilez r when the exit is jjnz)
#     C   (the condition)         B
#     jjz r, OUT          ->    jwcheck
#     B   (the body)            L:                (kept only if something else jumps to it)
#     jjmp L                      C
#   OUT:                        jwend
#                               OUT:              (a jjmp OUT first when OUT is not the next line)
# Every instruction that is not a jump runs in the same order as before, so the result is the same bit for bit; a lap
# costs one jump less (jjnz at the bottom instead of jjz at the top plus jjmp). A loop is left as it is when its
# condition has a label or a jump, its exit is not below the loop, its whiles are not balanced, or it is inside a macro.
# Usage: python -I rotar_janax.py file.jsm...   (prints, per file, how many it turned and how many it left)
import re
import sys

LABEL = re.compile(r'^[ \t]*([A-Za-z_]\w*):')
JUMP = re.compile(r'^[ \t]*(jjmp|jjz|jjnz)[ \t]+(.*)$')


def bare(s):
    return re.sub(r';.*', '', s.rstrip('\r\n'))


def label_of(s):
    m = LABEL.match(bare(s))
    return m.group(1) if m else None


def jump_of(s):
    m = JUMP.match(bare(s))
    if not m:
        return None
    args = [a.strip() for a in m.group(2).split(',')]
    return m.group(1), (args[0] if len(args) == 2 else None), args[-1]


def blank(s):
    return bare(s).strip() == ''


def in_macro(lines):
    inside, depth = [], 0
    for s in lines:
        b = bare(s)
        if re.match(r'^[ \t]*macro\b', b) or depth:
            depth += b.count('{') - b.count('}')
            inside.append(True)
        else:
            inside.append(False)
    return inside


def one(lines):
    """Turns the first loop that can be turned; returns the new lines, or None."""
    where = {}
    for i, s in enumerate(lines):
        n = label_of(s)
        if n:
            where[n] = i
    macro = in_macro(lines)
    for j, s in enumerate(lines):
        jp = jump_of(s)
        if not jp or jp[0] != 'jjmp' or jp[2] not in where or where[jp[2]] >= j:
            continue
        name = jp[2]
        top = where[name]
        if any(macro[top:j + 1]):
            continue
        k = top + 1
        while k < j and not label_of(lines[k]) and not jump_of(lines[k]) and \
                not re.match(r'^[ \t]*(jret|jhalt|jwhilez?|jwend|jwcheck)\b', bare(lines[k])):
            k += 1
        ex = jump_of(lines[k]) if k < j else None
        if not ex or ex[0] == 'jjmp' or label_of(lines[k]):
            continue
        out = ex[2]
        if out not in where or where[out] <= j:
            continue
        depth = 0
        for s2 in lines[k + 1:j]:
            b = bare(s2).strip()
            if re.match(r'jwhilez?\b', b):
                depth += 1
            elif b == 'jwend':
                depth -= 1
                if depth < 0:
                    break
        if depth != 0:
            continue
        nxt = j + 1
        while nxt < len(lines) and blank(lines[nxt]):
            nxt += 1
        ind = re.match(r'^[ \t]*', lines[top]).group(0)
        nl = '\r\n' if lines[top].endswith('\r\n') else '\n'
        word = re.compile(r'(?<![\w.])' + re.escape(name) + r'(?![\w])')
        others = sum(1 for i2, s2 in enumerate(lines) if i2 not in (top, j) and word.search(bare(s2)))
        cond = lines[top + 1:k]
        new = [f'{ind}{"jwhile" if ex[0] == "jjz" else "jwhilez"} {ex[1]}{nl}']
        new += lines[k + 1:j]
        if cond or others:
            new.append(f'{ind}jwcheck{nl}')
            if others:
                new.append(lines[top])
            new += cond
        new.append(f'{ind}jwend{nl}')
        if label_of(lines[nxt]) != out:
            new.append(f'{ind}jjmp {out}{nl}')
        return lines[:top] + new + lines[j + 1:]
    return None


def main():
    for path in sys.argv[1:]:
        with open(path, encoding='utf-8', newline='') as f:
            lines = f.readlines()
        turned = 0
        while True:
            r = one(lines)
            if r is None:
                break
            lines = r
            turned += 1
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.writelines(lines)
        print(f'{turned} {path}')


main()
