# ArboGame

Jogo educativo para crianças e adolescentes (6 a 17 anos) aprenderem sobre arboviroses (dengue, zika, chikungunya e Oropouche), o *Aedes aegypti*, os maruins (*Culicoides*) e como eliminar criadouros. Feito para uso em escolas, em ações de ensino e conscientização.

Os guias do jogo são o **Listras** (um *Aedes aegypti*) e o **Pintas** (um maruim).

- **Três faixas de idade:** Mirim (6 a 10), Explorador (11 a 14) e Cientista (15 a 17).
- **Fliperama:** cinco minijogos animados, com som e os personagens: Esvazia Já!, Varre-Varre, Coleta Certa, Espanta-Mosquito e Jogo da Memória.
- **Sete missões:** Quem é quem?, Caça aos criadouros, Ciclo de vida, Detetive da saúde, Mito ou verdade?, Vistoria em casa e Desafio final.
- **Ranking:** placar dos jogadores neste aparelho (geral e por minijogo), bom para disputas em sala.
- **Gamificação:** pontos, 5 níveis e 13 medalhas. O progresso fica salvo no navegador de quem joga (sem login, sem servidor).

O site é estático e fica publicado no **Firebase Hosting** da Nório (site `arbogame`): <https://arbogame.web.app>.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | O site publicado (gerado, não edite à mão) |
| `src/jogo.html` | Código-fonte do jogo (estilos, dados, missões e lógica) |
| `src/art.js` | Desenhos dos objetos (balde, pneu, vaso, garrafa...) e cenários em canvas |
| `src/arcade.js` | Fliperama: os minijogos animados em canvas (Esvazia Já!, Varre-Varre, Coleta Certa, Espanta-Mosquito, Memória) |
| `personagens/` | Poses do Listras e do Pintas (embutidas no `index.html`) |
| `marca/` | Logo da Nório para o rodapé (embutido no `index.html`) |
| `build.py` | Gera o `index.html`: `python3 build.py` |
| `config.js` | Projeto e chave pública do Firebase do ranking online |
| `ranking/` | Regras e índices do Firestore do ranking online |
| `scripts/criar-ranking.sh` | Cria o projeto Firebase do ranking (Cloud Shell, uma vez) |
| `firebase.json` | Publicação no Firebase Hosting da Nório |
| `.github/workflows/deploy.yml` | Publica sozinho a cada push na `main` |
| `scripts/configurar-publicacao.sh` | Configuração única da publicação automática (Cloud Shell) |

## Publicação

1. Rode uma vez `scripts/configurar-publicacao.sh` no [Cloud Shell do projeto norio-pd-os](https://shell.cloud.google.com/?project=norio-pd-os). Ele cria o site `arbogame` no Hosting e libera este repositório para publicar sem chave.
2. Depois disso, cada push na `main` publica o site em <https://arbogame.web.app>.

Para publicar manualmente: `firebase deploy --only hosting --project norio-pd-os`.

## Ranking online (Firestore)

O ranking online fica num **projeto Firebase separado** (`arbogame-ranking`, plano grátis), para não misturar com o banco do Nório R&D OS.

1. No [Cloud Shell](https://shell.cloud.google.com): `git clone https://github.com/rctporto/arbogame && cd arbogame && bash scripts/criar-ranking.sh`. O script cria o projeto, o Firestore em São Paulo, as regras, os índices e o app web, e mostra o `firebaseProjectId` e a `firebaseApiKey`.
2. Cole os dois valores no `config.js` e faça push na `main`.

Enquanto o `config.js` estiver vazio, o jogo mostra só o ranking do aparelho. No ranking online aparecem só apelidos (com filtro de palavrões no site e nas regras), a faixa de idade e o código opcional da turma.

As regras (`ranking/firestore.rules`) só aceitam documentos completos e válidos, com a pontuação dentro do limite, a pontuação que só sobe, um envio a cada 3 segundos por jogador e jogo, e nenhuma exclusão. Qualquer outra coleção fica fechada. Para testar as regras localmente: `cd ranking && firebase emulators:exec --only firestore --project demo-arbogame "..."`.

## Conteúdo

As informações seguem o Ministério da Saúde e a Fiocruz. O jogo sempre orienta procurar uma unidade de saúde em caso de sintomas.

## Área do desenvolvedor

Link "Desenvolvedor" no rodapé (ou `https://arbogame.web.app/#dev`). O login é por link enviado ao e-mail, sem senha. O painel mostra os números do ranking online (jogadores, turmas, faixas, recordes), permite apagar registros (moderação) e ver ou zerar o progresso do aparelho.

Para ligar e autorizar um e-mail, rode uma vez no Cloud Shell:

```
cd ~/arbogame && git pull && bash scripts/ligar-dev.sh seu@email.com
```

Os e-mails autorizados ficam na coleção `devs` do Firestore, que só o script grava. O código está em `src/dev.js` e as permissões em `ranking/firestore.rules`.

## Login, livros, BugKids e Professora Catarina

- **Tela de entrada:** ao abrir o site, cada criança escolhe o seu jogador ou cria um novo (apelido, faixa etária, personagem e código da turma opcional). Vários jogadores ficam salvos no mesmo aparelho, sem senha. O código está em `src/extra.js`.
- **Biblioteca:** os livros "Listras e os BugKids" e "Pintas e os BugKids" ficam em `livros/<livro>/NN.webp` (páginas) e `tNN.webp` (miniaturas). Ler até o fim dá uma medalha e 30 pontos.
- **Professora Catarina** dá dicas na capa de cada minijogo, no início do site e no botão "Pedir dica" das perguntas (risca uma alternativa errada; com dica o acerto vale 5 pontos a partir de 11 anos).
- **BugKids** (Ana, Pedro, Júlia e Guto) aparecem como personagens para escolher, nas janelas do Espanta-Mosquito, no Jogo da Memória e nas comemorações.
- Os retratos foram recortados dos livros e ficam em `personagens/` (`bugkid-*.webp`, `catarina*.webp`, `bugkids-turma.webp`).

## Visual novo (protótipo "ArboGame • BugKids" v1.0)

- `src/tema.css`: tokens e componentes do protótipo (menu lateral, painel, capas dos minijogos, quiz em cartão, fim de missão, pódio do ranking). Celular: menu vira gaveta (botão ☰).
- `src/ui.js`: carregado por último; monta o menu lateral, o novo painel (`homeNovo`), a biblioteca, o fim de missão e o pódio. Reaproveita a lógica existente (jogos, missões, perfis, ranking real); nada de dados demonstrativos.
- Imagens de corpo inteiro: `personagens/corpo-*.webp` e `catarina-busto.webp`.
- Pendente: cenários finais 1600×1000 e objetos 512×512 do guia.
