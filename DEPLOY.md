# Guia de Deploy - CCB Organiza

## 🚀 Deploy no GitHub

### Passo 1: Preparar o Repositório

```bash
# Entre na pasta do projeto
cd ccb-organiza-main

# Inicialize o Git (se ainda não estiver)
git init

# Adicione todos os arquivos
git add .

# Faça o commit inicial
git commit -m "Initial commit: CCB Organiza completo com Firebase"
```

### Passo 2: Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em **New Repository**
3. Nome: `ccb-organiza`
4. Descrição: "Sistema de Gestão Regional CCB"
5. **Não** inicialize com README (já temos um)
6. Clique em **Create repository**

### Passo 3: Conectar ao GitHub

```bash
# Adicione o remote (substitua SEU_USUARIO pelo seu usuário GitHub)
git remote add origin https://github.com/SEU_USUARIO/ccb-organiza.git

# Renomeie a branch para main
git branch -M main

# Envie para o GitHub
git push -u origin main
```

## 🌐 Deploy no GitHub Pages

### Opção 1: Usando GitHub Actions (Recomendado)

1. Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. Configure os Secrets no GitHub:
   - Vá em **Settings** → **Secrets and variables** → **Actions**
   - Adicione cada variável do Firebase como Secret:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

3. Ative o GitHub Pages:
   - Vá em **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **(root)**
   - Clique em **Save**

4. Faça push para disparar o deploy:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deploy workflow"
git push
```

### Opção 2: Deploy Manual

```bash
# Build do projeto
npm run build

# Instale gh-pages
npm install -D gh-pages

# Adicione ao package.json (scripts):
# "deploy": "gh-pages -d dist"

# Execute o deploy
npm run deploy
```

## 🔥 Deploy no Netlify

1. Acesse [Netlify](https://netlify.com)
2. Clique em **Add new site** → **Import an existing project**
3. Conecte com GitHub e selecione o repositório
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Em **Environment variables**, adicione todas as variáveis do Firebase
6. Clique em **Deploy site**

## ⚡ Deploy no Vercel

1. Acesse [Vercel](https://vercel.com)
2. Clique em **New Project**
3. Importe o repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Em **Environment Variables**, adicione todas as variáveis do Firebase
6. Clique em **Deploy**

## 🔒 Segurança do Firebase

### Configurar Regras de Firestore

No console do Firebase, vá em **Firestore Database** → **Rules** e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura para usuários autenticados
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Configurar Domínios Autorizados

No console do Firebase:
1. Vá em **Authentication** → **Settings** → **Authorized domains**
2. Adicione seu domínio (ex: `ccb-organiza.netlify.app`)

## 📊 Monitoramento

### GitHub Actions

- Veja os deploys em **Actions** no seu repositório
- Cada push na branch `main` dispara um novo deploy

### Analytics (Opcional)

Para adicionar Google Analytics ao projeto:

```bash
# Instale o pacote
npm install firebase/analytics

# Configure em src/lib/firebase.ts
import { getAnalytics } from "firebase/analytics";
export const analytics = getAnalytics(app);
```

## 🔄 Atualizações

Para fazer atualizações no sistema:

```bash
# Faça suas alterações no código

# Commit e push
git add .
git commit -m "Descrição das alterações"
git push

# O deploy será feito automaticamente (se configurou GitHub Actions)
```

## 🆘 Troubleshooting

### Erro de Variáveis de Ambiente

- Verifique se todas as variáveis estão configuradas nos Secrets
- Variáveis devem começar com `VITE_`

### Erro 404 nas Rotas

- Configure redirecionamento para SPA
- No Netlify: crie `public/_redirects`:
  ```
  /* /index.html 200
  ```
- No Vercel: crie `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### Build Falha

- Verifique logs de build
- Certifique-se de que `npm install` funciona localmente
- Verifique se todas as dependências estão no `package.json`

## 📞 Suporte

Para problemas de deploy, consulte a documentação:
- [GitHub Pages](https://docs.github.com/pages)
- [Netlify](https://docs.netlify.com)
- [Vercel](https://vercel.com/docs)
