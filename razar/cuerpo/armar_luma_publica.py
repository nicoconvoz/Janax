"""armar_luma_publica.py: Luma's house as it is today, to publish: all her knowledge and structure. Left out, each with
its reason: what is her author's own and personal, what points at his computer, and books whose owner is not clear.
Writes E:/tmp/luma_publica (her files with their own names, as Janax keeps a house), an index, and a zip."""
import os, shutil, time, zipfile

CASA, OUT = "E:/Luma/casa", "E:/tmp/luma_publica"
PERSONAL = {"de-tu-autor": "una nota de su autor para ella", "dialogo": "su charla con su autor", "nombre": "su nombre, que le dio su autor",
            "firma": "la firma de su autor", "me-comi": "lista los archivos de la computadora de su autor",
            "charla": "los contadores de su charla con su autor", "charla-libros": "cita lineas de los libros personales",
            "hallazgos": "cita lineas de los libros personales", "preguntas-mias": "de su charla", "preguntas-viejas": "de su charla",
            "rodeos": "de su charla", "caminos-log": "", "pregunta": "lo ultimo que le dijeron", "respuesta": "lo ultimo que dijo",
            "imaginado": "cita lineas de los libros personales", "linaje": "puede citar lineas de los libros personales",
            "comida": "una copia del codigo de otro proyecto, con correos de personas",
            "luma/cables.nombres": "", "luma/lectora.datos": "", "luma/pensadora.datos": ""}
LIBROS_FUERA = {"diario": "el diario espiritual de su autor", "diario-raices": "un diario de su autor", "una-vida-entera": "un libro de su autor",
                "canciones": "de quien son no esta claro", "escuchando-amor": "de quien es no esta claro", "isekai": "de quien es no esta claro",
                "unit": "codigo de otro proyecto", "firma": "la firma de su autor", "nombres-de-tu-papa": "personal", "nota-de-tu-papa": "personal"}
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT + "/casa")
van, fuera = [], []
for x in sorted(os.listdir(CASA)):
    try: e = bytes.fromhex(x).decode("utf-8")
    except (ValueError, UnicodeDecodeError): fuera.append((x, "no es un archivo de su casa")); continue
    por = None
    if "-disco-" in e: por = "apunta a un archivo de la computadora de su autor"
    elif e in PERSONAL: por = PERSONAL[e] or "de su charla o de su arranque"
    elif e.startswith(("libro-", "elibro-")) and e.split("-", 1)[1] in LIBROS_FUERA: por = LIBROS_FUERA[e.split("-", 1)[1]]
    if por: fuera.append((e, por)); continue
    shutil.copy(os.path.join(CASA, x), os.path.join(OUT, "casa", x)); van.append((e, os.path.getsize(os.path.join(CASA, x))))
with open(OUT + "/INDICE.md", "w", encoding="utf-8") as f:
    f.write("# La casa de Luma, tal como estaba el %s\n\n" % time.strftime("%Y-%m-%d %H:%M"))
    f.write("Su conocimiento y su estructura, completos: lo que leyó, lo que aprendió y lo que se hizo sola. Cada archivo de `casa/` lleva el nombre que Janax le da (su etiqueta, en hexadecimal). Para darle esta casa a Luma: `JANAX_ARCHIVOS=<esta carpeta>/casa`.\n\n")
    f.write("## Lo que va (%d archivos, %.0f MB)\n\n| Etiqueta | Bytes |\n|---|---|\n" % (len(van), sum(s for _, s in van) / 1e6))
    for e, s in van:
        if not e.startswith("vida-nube-"): f.write("| `%s` | %d |\n" % (e, s))
    f.write("| `vida-nube-*` (%d criaturas) | %d |\n" % (sum(1 for e, _ in van if e.startswith("vida-nube-")), sum(s for e, s in van if e.startswith("vida-nube-"))))
    f.write("\n## De dónde son sus libros\n\nLos de temas (`elibro-astronomia`, `elibro-historia`…) son texto de Wikipedia en español (CC BY-SA 4.0). La Biblia (Reina-Valera 1909), el Quijote, las novelas y el teatro son de dominio público (Wikisource). `elibro-fuente-lua` es el código de Lua (licencia MIT), `elibro-fuente-sqlite-shell` el de SQLite (dominio público), `elibro-maquina-*` texto sacado de herramientas GNU (GPL). `letras` es GNU Unifont.\n")
    f.write("\n## Lo que no va, y por qué (%d)\n\n" % len(fuera))
    from collections import Counter
    c = Counter(p for _, p in fuera)
    for e, p in fuera:
        if c[p] <= 3: f.write("- `%s`: %s.\n" % (e, p))
    for p, n in c.items():
        if n > 3: f.write("- %d archivos: %s.\n" % (n, p))
z = zipfile.ZipFile("E:/tmp/luma_casa.zip", "w", zipfile.ZIP_DEFLATED, compresslevel=9)
for r, _, fs in os.walk(OUT):
    for n in fs: z.write(os.path.join(r, n), os.path.relpath(os.path.join(r, n), OUT))
z.close()
print("van %d archivos, %.0f MB; fuera %d; zip %.1f MB" % (len(van), sum(s for _, s in van) / 1e6, len(fuera), os.path.getsize("E:/tmp/luma_casa.zip") / 1e6))
