#!/usr/bin/env bash
# Configura a publicação automática do ArboGame pelo GitHub, SEM chave
# de conta de serviço (a organização da Nório bloqueia chaves). O GitHub Actions prova
# quem é com um token próprio (Workload Identity Federation), e só a branch main do
# repositório rctporto/arbogame pode publicar.
#
# Rode uma vez no Cloud Shell: https://shell.cloud.google.com/?project=norio-pd-os
set -euo pipefail

PROJECT_ID=norio-pd-os
REPO=rctporto/arbogame
SITE=arbogame
SA_NAME=github-deploy-arbogame
SA="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
POOL=github
PROVIDER=github-arbogame

gcloud config set project "$PROJECT_ID" >/dev/null
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

echo "Ativando APIs..."
gcloud services enable iamcredentials.googleapis.com sts.googleapis.com firebasehosting.googleapis.com

echo "Criando o site $SITE no Firebase Hosting (se ainda não existir)..."
npx --yes firebase-tools@13.29.1 hosting:sites:create "$SITE" --project "$PROJECT_ID" || \
  echo "Aviso: não criei o site (talvez já exista). Confira em Hosting no console do Firebase."

echo "Criando a conta de publicação (sem chave)..."
gcloud iam service-accounts describe "$SA" >/dev/null 2>&1 || \
  { gcloud iam service-accounts create "$SA_NAME" --display-name="Publicação do ArboGame pelo GitHub"; sleep 20; }

# Só o necessário para publicar sites do Hosting; não lê o banco da Nório.
for ROLE in roles/firebasehosting.admin roles/firebase.viewer roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA" --role="$ROLE" --condition=None -q >/dev/null
done

echo "Ligando o repositório ao projeto..."
gcloud iam workload-identity-pools describe "$POOL" --location=global >/dev/null 2>&1 || \
  gcloud iam workload-identity-pools create "$POOL" --location=global --display-name="GitHub"
gcloud iam workload-identity-pools providers describe "$PROVIDER" --location=global --workload-identity-pool="$POOL" >/dev/null 2>&1 || \
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" \
    --location=global --workload-identity-pool="$POOL" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository=='$REPO' && assertion.ref=='refs/heads/main'"
gcloud iam service-accounts add-iam-policy-binding "$SA" -q >/dev/null \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/attribute.repository/$REPO"

echo
echo "Pronto. Número do projeto: $PROJECT_NUMBER"
echo "Se for diferente de 958314130866, ajuste .github/workflows/deploy.yml."
