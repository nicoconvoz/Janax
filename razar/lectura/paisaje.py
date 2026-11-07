import re, sys
from collections import deque

# "organo <letters> = <score> (sin <base>)": the letters as written (the first one first); "-" is no organ
lines = open(sys.argv[1], encoding='utf-8', errors='replace').read().splitlines()
score, base = {}, None
for l in lines:
    m = re.match(r'organo (\S+) = (-?\d+) \(sin (-?\d+)\)', l)
    if m:
        score[m.group(1)] = int(m.group(2))
        base = int(m.group(3))
score[''] = base
L = max(len(k) for k in score)

def neighbours(s):
    out = set()
    for i in range(len(s) + 1):             # a letter put in
        for c in '123456789':
            out.add(s[:i] + c + s[i:])
    for i in range(len(s)):                 # taken out, or changed
        out.add(s[:i] + s[i + 1:])
        for c in '123456789':
            out.add(s[:i] + c + s[i + 1:])
    return {n for n in out if n != s and n in score}

best = max(score, key=score.get)
print(f"organos medidos: {len(score) - 1} (de 1 a {L} letras), sin organo: {base}")
for n in range(1, L + 1):
    k = max((s for s in score if len(s) == n), key=score.get)
    print(f"  mejor de {n} letra(s): {k} = {score[k]}")
print(f"el mejor de todos: {best} = {score[best]}")

# what the trials can reach: from no organ, steps of one letter that always improve
seen, q = {''}, deque([''])
while q:
    s = q.popleft()
    for n in neighbours(s):
        if score[n] > score[s] and n not in seen:
            seen.add(n); q.append(n)
print(f"alcanzables subiendo siempre: {len(seen) - 1} organos")
print(f"el mejor de todos, alcanzable? {'SI' if best in seen else 'NO: hay un valle en el camino'}")
peaks = [s for s in score if s and all(score[n] <= score[s] for n in neighbours(s))]
peaks.sort(key=score.get, reverse=True)
print(f"cimas (ningun vecino de una letra las mejora): {len(peaks)}")
for s in peaks[:8]:
    print(f"  {s} = {score[s]}  {'(alcanzable)' if s in seen else '(NO alcanzable)'}")
