"""Gera o index.html a partir de src/jogo.html, embutindo as imagens de personagens/.
Uso: python3 build.py"""
import base64, glob, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, "src", "jogo.html"), encoding="utf-8").read()
imgs = {os.path.basename(f)[:-5]: "data:image/webp;base64," + base64.b64encode(open(f, "rb").read()).decode()
        for f in sorted(glob.glob(os.path.join(HERE, "personagens", "*.webp")))}
for cor in ("marinho", "creme"):
    logo = "data:image/png;base64," + base64.b64encode(open(os.path.join(HERE, "marca", f"norio-{cor}.png"), "rb").read()).decode()
    src = src.replace(f"%%NORIO_{cor.upper()}%%", logo)
src = src.replace("/*ARCADE*/", open(os.path.join(HERE, "src", "art.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "arcade.js"), encoding="utf-8").read(), 1)
src = src.replace("/*SPRITES*/", "const IMG = " + json.dumps(imgs) + ";", 1)
favicon = ("data:image/svg+xml," + "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 34'%3E%3Cpath d='M15 2C15 2 3 15 3 22a12 12 0 0 0 24 0C27 15 15 2 15 2z' fill='%232F6FB5'/%3E%3Cpath d='M6 30L25 9' stroke='%23D9482B' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E")
head = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Jogo educativo sobre dengue, zika, chikungunya, Oropouche, Aedes aegypti e maruins para escolas.">
<link rel="icon" href="{favicon}">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
</head>
<body>
"""
open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(head + src + "\n</body>\n</html>\n")
import sys
if len(sys.argv) > 1:  # versão para prévia como Artifact (sem o esqueleto do documento)
    open(sys.argv[1], "w", encoding="utf-8").write(src)
print("index.html gerado com", len(imgs), "imagens")
