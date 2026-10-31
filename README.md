# ArboGame

Jogo educativo para crianças e adolescentes (6 a 17 anos) aprenderem sobre arboviroses (dengue, zika, chikungunya e Oropouche), o *Aedes aegypti*, os maruins (*Culicoides*) e como eliminar criadouros. Feito para uso em escolas, em ações de ensino e conscientização.

Os guias do jogo são o **Listras** (um *Aedes aegypti*) e o **Pintas** (um maruim).

- **Três faixas de idade:** Mirim (6 a 10), Explorador (11 a 14) e Cientista (15 a 17).
- **Sete missões:** Quem é quem?, Caça aos criadouros, Ciclo de vida, Detetive da saúde, Mito ou verdade?, Vistoria em casa e Desafio final.
- **Gamificação:** pontos, 5 níveis e 8 medalhas. O progresso fica salvo no navegador de quem joga (sem login, sem servidor).

O site é estático e fica publicado no **Firebase Hosting** da Nório (site `arbogame`): <https://arbogame.web.app>.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | O site publicado (gerado, não edite à mão) |
| `src/jogo.html` | Código-fonte do jogo (estilos, dados e lógica) |
| `personagens/` | Poses do Listras e do Pintas (embutidas no `index.html`) |
| `build.py` | Gera o `index.html`: `python3 build.py` |
| `firebase.json` | Publicação no Firebase Hosting da Nório |
| `.github/workflows/deploy.yml` | Publica sozinho a cada push na `main` |
| `scripts/configurar-publicacao.sh` | Configuração única da publicação automática (Cloud Shell) |

## Publicação

1. Rode uma vez `scripts/configurar-publicacao.sh` no [Cloud Shell do projeto norio-pd-os](https://shell.cloud.google.com/?project=norio-pd-os). Ele cria o site `arbogame` no Hosting e libera este repositório para publicar sem chave.
2. Depois disso, cada push na `main` publica o site em <https://arbogame.web.app>.

Para publicar manualmente: `firebase deploy --only hosting --project norio-pd-os`.

## Conteúdo

As informações seguem o Ministério da Saúde e a Fiocruz. O jogo sempre orienta procurar uma unidade de saúde em caso de sintomas.
