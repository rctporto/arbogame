#!/usr/bin/env bash
# Liga a Área do desenvolvedor do ArboGame (arbogame.web.app/#dev) e autoriza um e-mail.
# O login é por link enviado ao e-mail (sem senha). Só e-mails autorizados aqui veem o painel.
#
# Rode no Cloud Shell, dentro da pasta do repositório:
#   cd ~/arbogame && git pull && bash scripts/ligar-dev.sh voce@empresa.com.br
# Pode rodar de novo para autorizar outro e-mail.
set -euo pipefail

EMAIL="$(echo "${1:-}" | tr '[:upper:]' '[:lower:]')"
[ -n "$EMAIL" ] || { echo "Uso: bash scripts/ligar-dev.sh seu@email.com"; exit 1; }
PROJETO="${PROJETO:-arbogame-ranking}"
SITE="${SITE:-https://arbogame.web.app}"
FB="npx --yes firebase-tools@13.29.1"
TOKEN="$(gcloud auth print-access-token)"
H=(-H "Authorization: Bearer $TOKEN" -H "x-goog-user-project: $PROJETO" -H "Content-Type: application/json")
ADM="https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJETO/config"

echo "1/4 Conferindo o login do Firebase..."
gcloud services enable identitytoolkit.googleapis.com --project "$PROJETO"
CFG="$(curl -s "${H[@]}" "$ADM")"
if echo "$CFG" | grep -q '"error"'; then
  echo
  echo "O login (Authentication) ainda não foi iniciado neste projeto. Faça só isto, uma vez:"
  echo "  1. Abra https://console.firebase.google.com/project/$PROJETO/authentication"
  echo "  2. Clique em \"Vamos começar\" (Get started)."
  echo "  3. Rode este script de novo."
  exit 1
fi

echo "2/4 Ligando o login por link no e-mail e liberando $SITE..."
DOM="${SITE#https://}"
BODY="$(CFG="$CFG" DOM="$DOM" SITE="$SITE" python3 -c '
import json, os
c = json.loads(os.environ["CFG"])
doms = c.get("authorizedDomains", [])
if os.environ["DOM"] not in doms: doms.append(os.environ["DOM"])
print(json.dumps({"signIn": {"email": {"enabled": True, "passwordRequired": False}},
                  "authorizedDomains": doms,
                  "notification": {"sendEmail": {"callbackUri": os.environ["SITE"] + "/"}}}))')"
RESP="$(curl -s -w '\n%{http_code}' -X PATCH "${H[@]}" -d "$BODY" \
  "$ADM?updateMask=signIn.email.enabled,signIn.email.passwordRequired,authorizedDomains,notification.sendEmail.callbackUri")"
if [ "$(echo "$RESP" | tail -1)" != "200" ]; then
  # tenta de novo sem o endereço de retorno do e-mail (alguns projetos não aceitam esse campo)
  BODY2="$(echo "$BODY" | python3 -c 'import json,sys; d=json.load(sys.stdin); d.pop("notification",None); print(json.dumps(d))')"
  RESP="$(curl -s -w '\n%{http_code}' -X PATCH "${H[@]}" -d "$BODY2" \
    "$ADM?updateMask=signIn.email.enabled,signIn.email.passwordRequired,authorizedDomains")"
fi
if [ "$(echo "$RESP" | tail -1)" != "200" ]; then
  echo; echo "Não deu para ligar o login por e-mail. Resposta do Google:"; echo "$RESP" | sed '$d'
  echo; echo "Alternativa manual: em https://console.firebase.google.com/project/$PROJETO/authentication/providers"
  echo "ative \"E-mail/senha\" e a opção \"Link do e-mail (login sem senha)\"; em Configurações > Domínios autorizados, adicione $DOM."
  echo "Depois rode este script de novo."
  exit 1
fi

echo "3/4 Autorizando $EMAIL como desenvolvedor..."
RESP="$(curl -s -w '\n%{http_code}' -X PATCH "${H[@]}" -d "{\"fields\":{\"desde\":{\"timestampValue\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}}}" \
  "https://firestore.googleapis.com/v1/projects/$PROJETO/databases/(default)/documents/devs/$EMAIL")"
if [ "$(echo "$RESP" | tail -1)" != "200" ]; then echo; echo "Não deu para autorizar o e-mail. Resposta do Google:"; echo "$RESP" | sed '$d'; exit 1; fi

echo "4/4 Aplicando as regras novas do banco..."
( cd "$(dirname "$0")/../ranking" && $FB deploy --only firestore:rules --project "$PROJETO" --non-interactive )

echo
echo "Pronto! Abra $SITE/#dev (ou o link \"Desenvolvedor\" no rodapé), digite $EMAIL e toque no link que chegar no e-mail."
