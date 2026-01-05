# Como Configurar os Secrets do GitHub

## Passo a Passo

1. **Acesse a página de secrets do seu repositório:**
   https://github.com/vinimacar/ccborganiza/settings/secrets/actions

2. **Adicione cada secret abaixo:**

   Para cada secret, clique em **"New repository secret"** e preencha:

### Secret 1
- **Name:** `VITE_FIREBASE_API_KEY`
- **Secret:** `AIzaSyBQQChAmP6SBWBsuUbxYo7Eeh7QpRl-ySQ`

### Secret 2
- **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Secret:** `directed-optics-460823-q5.firebaseapp.com`

### Secret 3
- **Name:** `VITE_FIREBASE_PROJECT_ID`
- **Secret:** `directed-optics-460823-q5`

### Secret 4
- **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Secret:** `directed-optics-460823-q5.firebasestorage.app`

### Secret 5
- **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Secret:** `718866556670`

### Secret 6
- **Name:** `VITE_FIREBASE_APP_ID`
- **Secret:** `1:718866556670:web:8001bad626a607031227af`

## Verificação

Após adicionar todos os 6 secrets:
1. Os avisos no arquivo `deploy.yml` desaparecerão
2. O workflow do GitHub Actions funcionará corretamente
3. Você pode fazer o deploy normalmente

## Alternativa: Usar GitHub CLI

Se preferir usar linha de comando, instale o GitHub CLI e execute:

```bash
gh secret set VITE_FIREBASE_API_KEY -b "AIzaSyBQQChAmP6SBWBsuUbxYo7Eeh7QpRl-ySQ"
gh secret set VITE_FIREBASE_AUTH_DOMAIN -b "directed-optics-460823-q5.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID -b "directed-optics-460823-q5"
gh secret set VITE_FIREBASE_STORAGE_BUCKET -b "directed-optics-460823-q5.firebasestorage.app"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID -b "718866556670"
gh secret set VITE_FIREBASE_APP_ID -b "1:718866556670:web:8001bad626a607031227af"
```
