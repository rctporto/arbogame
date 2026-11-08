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
src = src.replace("/*ARCADE*/", open(os.path.join(HERE, "src", "art.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "arcade.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "dev.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "extra.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "ui.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "estudio.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "perguntas.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "plataforma.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "acesso.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "v2.js"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "v3.js"), encoding="utf-8").read(), 1)
src = src.replace("/*TEMA*/", open(os.path.join(HERE, "src", "tema.css"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "v2.css"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "src", "v3.css"), encoding="utf-8").read(), 1)
src = src.replace("/*SPRITES*/", "const IMG = " + json.dumps(imgs) + ";", 1)
favicon = "data:image/png;base64," + base64.b64encode(open(os.path.join(HERE, "marca", "arbogame-icone-64.png"), "rb").read()).decode()
head = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Jogo educativo sobre dengue, zika, chikungunya, Oropouche, Aedes aegypti e maruins para escolas.">
<link rel="icon" href="{favicon}">
<link rel="apple-touch-icon" href="arte/icone-512.png">
<meta name="theme-color" content="#0B4A32">
<script src="config.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
</head>
<body>
"""
open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(head + src + "\n</body>\n</html>\n")
import sys
if len(sys.argv) > 1:  # versão para prévia como Artifact (sem o esqueleto do documento)
    open(sys.argv[1], "w", encoding="utf-8").write(src)
print("index.html gerado com", len(imgs), "imagens")
