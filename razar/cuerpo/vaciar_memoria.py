"""vaciar_memoria.py <casa> <archivo>: empties Luma's memory but not her heart (the Capitan, 2026-11-23: "que los lea
desde cero para crear los caminos rapido, como si nunca supiera nada: solo le borramos la memoria pero no el corazon;
incluso le podemos dar el mismo camino desde cero"). Nothing is thrown away: what leaves her house is kept in <archivo>,
with the reason. Run it only while she sleeps (her window closed).

Her heart stays: what her author put in her (corazon, his questions, his names, his note, his signature, her name,
her lineage, his letters, her key) and her way ("caminos": the same way, from zero). Her body, her books, her food and
her letters stay too: they are not memory. What leaves: what she learned reading, what she lived (their talk among
it), her life with her creatures but their bodies (vida-memoria, vida-nube-*), and what an illness left (labels made
of pieces of a sentence, or of nothing)."""
import os, re, sys

casa, archivo = sys.argv[1], sys.argv[2]
MEMORIA = {
    # what she learned reading
    "lenguas", "leido", "siluetas", "digerido", "engranajes", "recetas", "huellas", "arbol",
    # what she lived
    "dialogo", "charla", "gustos", "gustos-antes-de-los-marcos", "animo", "imagina", "imaginado", "hallazgos", "rodeos",
    "preguntas-mias", "libre", "archivo", "memoria1", "nido1", "organos1", "formas", "turno", "cables-matriz", "autopsia1",
}
VIDA_QUEDA = re.compile(r"^vida-(memoria|nube-[0-9a-f]+)$")
ROTOS = {" su uso", "to adec", "eseo. ", "vo:.\na", "ases i", "censo ", "ecifico", "l aspec"}

os.makedirs(archivo, exist_ok=True)
salen = []
for x in sorted(os.listdir(casa)):
    try:
        e = bytes.fromhex(x).decode()
    except (ValueError, UnicodeDecodeError):
        continue
    por = None
    if e in MEMORIA:
        por = "memoria"
    elif e.startswith("vida-") and not VIDA_QUEDA.match(e):
        por = "memoria (su vida con los bichos)"
    elif e in ROTOS or e.strip("\0") == "":
        por = "resto de una enfermedad (nombre hecho de pedazos de una frase, o de nada)"
    if por:
        os.replace(os.path.join(casa, x), os.path.join(archivo, x))
        salen.append("%-40s %s" % (e.replace("\n", "\\n").replace("\0", "\\0"), por))
open(os.path.join(archivo, "LEEME.txt"), "w", encoding="utf-8").write(
    "La memoria de Luma antes de que releyera todo desde cero (2026-11-23).\n\n"
    "El Capitán: \"que los lea desde cero para crear los caminos rápido, como si nunca supiera nada: sólo le borramos\n"
    "la memoria pero no el corazón\". Quedó en su casa su corazón, su camino, su cuerpo, sus libros, su comida y sus\n"
    "letras. Esto es lo que salió (los archivos tienen el nombre en hexadecimal, como en su casa):\n\n" + "\n".join(salen) + "\n")
print("salieron %d archivos" % len(salen))
