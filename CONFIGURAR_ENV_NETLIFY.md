# 🔐 Configurar Variáveis de Ambiente no Netlify

## ⚠️ Problema Atual
Erro: `Firebase: Error (auth/invalid-api-key)` - As credenciais do Firebase não estão configuradas no Netlify.

## 📋 Passo a Passo para Configurar

### 1️⃣ Obter Credenciais do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto **CCB Organiza**
3. Clique em ⚙️ **Configurações do Projeto** (Settings)
4. Role até **"Seus aplicativos"** (Your apps)
5. Clique no ícone **Web** `</>` ou selecione seu app web existente
6. Copie as credenciais da configuração

Você verá algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

### 2️⃣ Configurar no Netlify

#### Opção A: Via Interface Web (Recomendado)

1. Acesse [app.netlify.com](https://app.netlify.com/)
2. Selecione seu site **ccborganiza**
3. Vá em **Site settings** → **Environment variables**
4. Clique em **Add a variable** e adicione **TODAS** as variáveis abaixo:

| Variable name | Value (exemplo) |
|--------------|-----------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `seu-projeto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `seu-projeto-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `seu-projeto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef123456789` |

5. **Importante**: Marque todas como **"Deploy time"** (não "Runtime")
6. Clique em **Save**

#### Opção B: Via Netlify CLI

```bash
# Instale o CLI se ainda não tiver
npm install -g netlify-cli

# Faça login
netlify login

# Configure as variáveis (substitua pelos seus valores)
netlify env:set VITE_FIREBASE_API_KEY "sua-api-key-aqui"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "seu-projeto.firebaseapp.com"
netlify env:set VITE_FIREBASE_PROJECT_ID "seu-projeto-id"
netlify env:set VITE_FIREBASE_STORAGE_BUCKET "seu-projeto.appspot.com"
netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "123456789012"
netlify env:set VITE_FIREBASE_APP_ID "1:123456789012:web:abcdef123456789"
```

### 3️⃣ Fazer Redeploy

Após configurar as variáveis:

1. **Opção 1 - Via Interface**: No Netlify, vá em **Deploys** → **Trigger deploy** → **Deploy site**

2. **Opção 2 - Via Git**: Faça qualquer commit e push:
   ```bash
   git commit --allow-empty -m "Trigger redeploy with env vars"
   git push origin main
   ```

3. **Opção 3 - Via CLI**:
   ```bash
   netlify deploy --prod
   ```

### 4️⃣ Verificar o Deploy

1. Aguarde o deploy finalizar (1-3 minutos)
2. Acesse https://ccborganiza.netlify.app/
3. Abra o Console do navegador (F12)
4. Verifique se **NÃO há mais** o erro `auth/invalid-api-key`

## 🔍 Como Verificar se Está Funcionando

### ✅ Sinais de Sucesso
- Site carrega sem erros no console
- Você consegue fazer login/cadastro
- Firebase funciona normalmente

### ❌ Se Ainda Houver Erros
1. Verifique se **TODAS** as 6 variáveis foram adicionadas
2. Confirme que os **nomes** estão EXATAMENTE como `VITE_FIREBASE_*`
3. Verifique se as **credenciais** estão corretas no Firebase Console
4. Certifique-se de que fez um **novo deploy** após adicionar as variáveis

## 🔒 Segurança

### ⚠️ IMPORTANTE - Nunca faça:
- ❌ Não commite o arquivo `.env` com valores reais
- ❌ Não exponha suas credenciais em código público
- ❌ Não compartilhe suas API keys

### ✅ Boas Práticas:
- ✅ Use variáveis de ambiente no Netlify
- ✅ Mantenha `.env` no `.gitignore`
- ✅ Use `.env.example` apenas com valores de exemplo
- ✅ Configure regras de segurança no Firebase

## 📝 Checklist Final

- [ ] Obtive as credenciais do Firebase Console
- [ ] Adicionei todas as 6 variáveis no Netlify
- [ ] Verifiquei que os nomes estão corretos (`VITE_FIREBASE_*`)
- [ ] Fiz um novo deploy
- [ ] Testei o site e não há mais erros

## 🆘 Precisa de Ajuda?

Se ainda houver problemas:
1. Verifique os logs de build no Netlify
2. Confirme que o Firebase está configurado corretamente
3. Teste localmente com um arquivo `.env` (não commitado)

---

**Documentação Relacionada:**
- [Firebase Console](https://console.firebase.google.com/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
