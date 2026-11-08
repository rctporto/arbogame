# ArboGame · versões e como voltar

## Versão 2.0 (07/11/2026) — repaginação
- Novo visual seguindo o "Guia de repaginação" (paleta BugLab, Nunito, bordas finas, menu curto e barra inferior no celular).
- Arquivos novos: `src/v2.css` e `src/v2.js` (carregados por último pelo `build.py`). As regras dos jogos, login,
  aprovação de cadastro, perfis, livros, ranking, pontos e medalhas continuam nos arquivos antigos.
- Correção: o Meu Quintal ocupava o id `quintal` e escondia a missão **Caça aos criadouros**. Agora o Meu Quintal é `meuquintal`
  e a missão voltou a abrir normalmente (src/plataforma.js).
- Dados: a 2.0 usa exatamente os mesmos dados da 1.0 — contas e pedidos de acesso (Firebase Auth + Firestore `acessos`),
  ranking online (`ranking`), desenvolvedores (`devs`) e o progresso salvo no aparelho (localStorage `arbogame-v1`,
  `arbogame-perfis`, `arbogame-quintal-*`). Nada foi apagado nem convertido.
- Backup dos dados online: Área do desenvolvedor → **Baixar backup dos dados** (gera um .json com cadastros e ranking).

## Versão 1 (guardada)
- Código-fonte completo: branch **`versao-1`** no GitHub.
- No ar, lado a lado com a nova: **https://arbogame.web.app/v1/** (cópia exata do site publicado antes da repaginação,
  lendo os mesmos dados).

## Voltar o site inteiro para a versão 1
```
git checkout main
git checkout versao-1 -- .   # traz todos os arquivos da versão 1
git commit -m "Volta para a versão 1"
git push                      # o GitHub Actions publica sozinho
```
Ou, no GitHub, abra uma pull request de `versao-1` para `main`.
