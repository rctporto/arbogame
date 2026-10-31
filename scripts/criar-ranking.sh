#!/usr/bin/env bash
# Cria o banco do ranking online do ArboGame num projeto Firebase SEPARADO (plano grátis),
# para que o ranking das crianças não fique no banco do Nório R&D OS.
#
# Rode uma vez no Cloud Shell, dentro da pasta do repositório:
#   https://shell.cloud.google.com
#   git clone https://github.com/rctporto/arbogame && cd arbogame && bash scripts/criar-ranking.sh
#
# Se o nome do projeto já estiver em uso no Google, rode com outro: PROJETO=arbogame-ranking-2 bash scripts/criar-ranking.sh
set -euo pipefail

PROJETO="${PROJETO:-arbogame-ranking}"
REGIAO="southamerica-east1"   # São Paulo
FB="npx --yes firebase-tools@13.29.1"

echo "1/5 Criando o projeto $PROJETO (se ainda não existir)..."
gcloud projects describe "$PROJETO" >/dev/null 2>&1 || gcloud projects create "$PROJETO" --name="ArboGame Ranking"
gcloud config set project "$PROJETO" >/dev/null

echo "2/5 Ligando o Firebase no projeto..."
$FB projects:addfirebase "$PROJETO" >/dev/null 2>&1 || echo "   (o Firebase já estava ligado)"
gcloud services enable firestore.googleapis.com firebaserules.googleapis.com --project "$PROJETO"

echo "3/5 Criando o banco Firestore em São Paulo..."
gcloud firestore databases describe --database='(default)' --project "$PROJETO" >/dev/null 2>&1 || \
  gcloud firestore databases create --location="$REGIAO" --project "$PROJETO"

echo "4/5 Aplicando as regras de segurança e os índices..."
( cd ranking && $FB deploy --only firestore --project "$PROJETO" --non-interactive )

echo "5/5 Criando o app web e pegando a chave pública..."
APP_ID=$($FB apps:list WEB --project "$PROJETO" --json 2>/dev/null | python3 -c 'import sys,json; a=json.load(sys.stdin).get("result",[]); print(a[0]["appId"] if a else "")')
if [ -z "$APP_ID" ]; then
  $FB apps:create WEB "ArboGame" --project "$PROJETO" >/dev/null
  APP_ID=$($FB apps:list WEB --project "$PROJETO" --json | python3 -c 'import sys,json; print(json.load(sys.stdin)["result"][0]["appId"])')
fi
CHAVE=$($FB apps:sdkconfig WEB "$APP_ID" --project "$PROJETO" --json | python3 -c 'import sys,json; print(json.load(sys.stdin)["result"]["sdkConfig"]["apiKey"])')

echo
echo "Pronto! Mande estes dois valores para o Claude (ou cole no config.js):"
echo "  firebaseProjectId: \"$PROJETO\""
echo "  firebaseApiKey:    \"$CHAVE\""
