"""armar_paginas.py: turns the project's documentation into pages of its site, and writes the site's map.

GitHub Pages serves only docs/, so a search engine sees a single page and none of the notes. This writes every
Markdown document of documentacion/ (except archivo/, which is kept, not shown), plus the author's letter and the
README, as an HTML page under docs/p/, an index of them (docs/p/index.html), the map (docs/sitemap.xml). A robots.txt
would be read only at the root of the host, so none is written: the map is given to Google in Search Console. Run it after any change to the documentation; it rewrites everything it writes, nothing else.

The Markdown reader is small on purpose (no third-party code): headings, paragraphs, lists, quotes, code blocks,
tables, emphasis, inline code, links and images. A link to another document becomes a link to its page; any other
relative link points to the file in the repository on GitHub.
"""
import html, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITIO = "https://nicoconvoz.github.io/Janax/"
REPO = "https://github.com/nicoconvoz/Janax/blob/master/"
CRUDO = "https://raw.githubusercontent.com/nicoconvoz/Janax/master/"
SALIDA = os.path.join(RAIZ, "docs", "p")


def documentos():
    out = ["CARTA-DEL-AUTOR.md", "README.md"]
    base = os.path.join(RAIZ, "documentacion")
    for d, sub, fs in os.walk(base):
        sub[:] = sorted(s for s in sub if s != "archivo")
        for f in sorted(fs):
            if f.endswith(".md"):
                out.append(os.path.relpath(os.path.join(d, f), RAIZ).replace("\\", "/"))
    return out


def pagina_de(rel):   # documentacion/razar/cuerpo.md -> razar/cuerpo.html (under docs/p/)
    rel = rel[len("documentacion/"):] if rel.startswith("documentacion/") else rel
    return rel[:-3] + ".html"


def enlace(url, desde, todos):
    if re.match(r"^[a-z]+:|^#|^//", url):
        return url
    frag = ""
    if "#" in url:
        url, frag = url.split("#", 1); frag = "#" + frag
    destino = os.path.normpath(os.path.join(os.path.dirname(desde), url)).replace("\\", "/")
    if destino in todos:
        a = pagina_de(destino); b = os.path.dirname(pagina_de(desde))
        return os.path.relpath(a, b or ".").replace("\\", "/") + frag
    if re.search(r"\.(png|jpe?g|gif|svg|webp)$", destino, re.I):
        return CRUDO + destino
    return REPO + destino + frag


def en_linea(t, desde, todos):
    partes = re.split(r"(`[^`]+`)", t)
    out = []
    for p in partes:
        if p.startswith("`") and p.endswith("`") and len(p) > 1:
            out.append("<code>" + html.escape(p[1:-1]) + "</code>"); continue
        p = html.escape(p, quote=False)
        p = re.sub(r"!\[([^\]]*)\]\(([^)\s]+)\)", lambda m: '<img alt="%s" src="%s">' % (m.group(1), html.escape(enlace(m.group(2), desde, todos))), p)
        p = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", lambda m: '<a href="%s">%s</a>' % (html.escape(enlace(m.group(2), desde, todos)), m.group(1)), p)
        p = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", p)
        p = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", p)
        out.append(p)
    return "".join(out)


def a_html(texto, desde, todos):
    ls = texto.replace("\r\n", "\n").split("\n")
    out, i, titulo = [], 0, None
    while i < len(ls):
        l = ls[i]
        if l.startswith("```"):
            j = i + 1
            while j < len(ls) and not ls[j].startswith("```"):
                j += 1
            out.append("<pre><code>" + html.escape("\n".join(ls[i + 1:j])) + "</code></pre>"); i = j + 1; continue
        m = re.match(r"^(#{1,6})\s+(.*)$", l)
        if m:
            n = len(m.group(1)); titulo = titulo or re.sub(r"[*`]", "", m.group(2))
            out.append("<h%d>%s</h%d>" % (n, en_linea(m.group(2), desde, todos), n)); i += 1; continue
        if l.startswith("|") and i + 1 < len(ls) and re.match(r"^\|[\s:|-]+\|?\s*$", ls[i + 1]):
            fila = lambda s: [c.strip() for c in s.strip().strip("|").split("|")]
            t = ["<table><tr>" + "".join("<th>%s</th>" % en_linea(c, desde, todos) for c in fila(l)) + "</tr>"]
            i += 2
            while i < len(ls) and ls[i].startswith("|"):
                t.append("<tr>" + "".join("<td>%s</td>" % en_linea(c, desde, todos) for c in fila(ls[i])) + "</tr>"); i += 1
            out.append("".join(t) + "</table>"); continue
        if l.startswith(">"):
            b = []
            while i < len(ls) and ls[i].startswith(">"):
                b.append(ls[i].lstrip(">").strip()); i += 1
            out.append("<blockquote><p>" + en_linea(" ".join(b), desde, todos) + "</p></blockquote>"); continue
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", l)
        if m:
            tipo = "ol" if m.group(2)[0].isdigit() else "ul"; items = []
            while i < len(ls):
                m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", ls[i])
                if m:
                    items.append(m.group(3)); i += 1
                elif ls[i].startswith("  ") and ls[i].strip() and items:
                    items[-1] += " " + ls[i].strip(); i += 1
                else:
                    break
            out.append("<%s>%s</%s>" % (tipo, "".join("<li>%s</li>" % en_linea(x, desde, todos) for x in items), tipo)); continue
        if not l.strip() or re.match(r"^\s*(-{3,}|\*{3,})\s*$", l):
            if l.strip():
                out.append("<hr>")
            i += 1; continue
        p = []
        while i < len(ls) and ls[i].strip() and not re.match(r"^(#{1,6}\s|```|>|\||\s*([-*]|\d+\.)\s)", ls[i]):
            p.append(ls[i].strip()); i += 1
        out.append("<p>" + en_linea(" ".join(p), desde, todos) + "</p>")
    return titulo, "\n".join(out)


ESTILO = """body{font-family:Georgia,serif;max-width:780px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#1d1d1f;background:#fbfaf7}
a{color:#7a3e9d}pre{background:#f1efe9;padding:.8rem;overflow:auto}code{background:#f1efe9;padding:0 .2rem}
table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .5rem}blockquote{border-left:3px solid #c9b8d6;margin-left:0;padding-left:1rem;color:#555}
img{max-width:100%}nav{font-size:.9rem;margin-bottom:1.5rem}"""


def envolver(titulo, cuerpo, raiz_rel, fuente):
    nav = '<nav><a href="%s">Janax y Razar</a> · <a href="%sp/index.html">Documentación</a>%s</nav>' % (
        raiz_rel, raiz_rel, (' · <a href="%s">Ver en GitHub</a>' % (REPO + fuente)) if fuente else "")
    return ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>%s · Janax y Razar</title>\n<style>%s</style>\n</head>\n<body>\n%s\n%s\n</body>\n</html>\n') % (html.escape(titulo), ESTILO, nav, cuerpo)


def escribir(ruta, texto):
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    open(ruta, "w", encoding="utf-8", newline="\n").write(texto)


def main():
    todos = documentos(); conjunto = set(todos); hechas = []
    for rel in todos:
        titulo, cuerpo = a_html(open(os.path.join(RAIZ, rel), encoding="utf-8").read(), rel, conjunto)
        destino = pagina_de(rel); profundidad = destino.count("/") + 1
        escribir(os.path.join(SALIDA, destino), envolver(titulo or rel, cuerpo, "../" * profundidad, rel))
        hechas.append((destino, titulo or rel, rel))
    notas = sorted((h for h in hechas if re.match(r"release-v[\d.]+\.html$", h[0])),
                   key=lambda h: [int(x) for x in re.findall(r"\d+", h[0])], reverse=True)
    resto = [h for h in hechas if h not in notas]
    lista = lambda hs: "<ul>" + "".join('<li><a href="%s">%s</a></li>' % (d, html.escape(t)) for d, t, _ in hs) + "</ul>"
    indice = "<h1>Documentación de Janax y Razar</h1>\n<h2>Documentos</h2>\n%s\n<h2>Notas de cada versión</h2>\n%s" % (lista(resto), lista(notas))
    escribir(os.path.join(SALIDA, "index.html"), envolver("Documentación", indice, "../", None))
    urls = [SITIO, SITIO + "p/index.html"] + [SITIO + "p/" + d for d, _, _ in hechas]
    escribir(os.path.join(RAIZ, "docs", "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
             + "".join("  <url><loc>%s</loc></url>\n" % html.escape(u) for u in urls) + "</urlset>\n")
    print("%d páginas, %d direcciones en el mapa" % (len(hechas) + 1, len(urls)))


if __name__ == "__main__":
    sys.exit(main())
