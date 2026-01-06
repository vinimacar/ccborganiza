# 🔍 Diagnóstico de Problemas - CCB Organiza

## ❌ Erro Atual: WebChannelConnection RPC 'Listen' stream errored (400)

Esse erro indica problema de comunicação com o Firestore. Vamos diagnosticar:

## 🔧 Checklist de Diagnóstico

### 1. ✅ Verificar Variáveis de Ambiente no Netlify

Acesse: https://app.netlify.com/sites/ccborganiza/configuration/env

**Deve ter TODAS estas variáveis:**
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_FIREBASE_MEASUREMENT_ID`

**Valores corretos (baseado nas suas credenciais):**
```
VITE_FIREBASE_API_KEY = AIzaSyBQQChAmP6SBWBsuUbxYo7Eeh7QpRl-ySQ
VITE_FIREBASE_AUTH_DOMAIN = directed-optics-460823-q5.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = directed-optics-460823-q5
VITE_FIREBASE_STORAGE_BUCKET = directed-optics-460823-q5.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 718866556670
VITE_FIREBASE_APP_ID = 1:718866556670:web:8001bad626a607031227af
VITE_FIREBASE_MEASUREMENT_ID = G-SSMK5J8KN5
```

### 2. ✅ Verificar Regras do Firestore

Acesse: https://console.firebase.google.com/project/directed-optics-460823-q5/firestore/rules

**Deve estar assim (modo desenvolvimento):**
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. ✅ Verificar se Firestore Database foi Criado

1. Acesse: https://console.firebase.google.com/project/directed-optics-460823-q5/firestore
2. Se aparecer "Criar banco de dados", clique e crie:
   - Modo: **Produção** (vamos usar regras personalizadas)
   - Região: **us-central1** ou mais próxima do Brasil
   - Clique em **Criar**

### 4. ✅ Verificar Console do Navegador

Após o deploy, abra https://ccborganiza.netlify.app/ e:
1. Pressione **F12** (DevTools)
2. Vá na aba **Console**
3. Procure por mensagens de erro ou:
   ```
   🔥 Firebase Config: { projectId: "directed-optics-460823-q5", ... }
   ```

### 5. ✅ Testar Localmente

Para descartar problemas do Netlify, teste local:

1. Crie arquivo `.env` na raiz do projeto:
   ```bash
   VITE_FIREBASE_API_KEY=AIzaSyBQQChAmP6SBWBsuUbxYo7Eeh7QpRl-ySQ
   VITE_FIREBASE_AUTH_DOMAIN=directed-optics-460823-q5.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=directed-optics-460823-q5
   VITE_FIREBASE_STORAGE_BUCKET=directed-optics-460823-q5.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=718866556670
   VITE_FIREBASE_APP_ID=1:718866556670:web:8001bad626a607031227af
   VITE_FIREBASE_MEASUREMENT_ID=G-SSMK5J8KN5
   ```

2. Execute:
   ```bash
   npm run dev
   ```

3. Acesse: http://localhost:8080
4. Veja se funciona localmente

## 🚀 Soluções por Problema

### Problema 1: Variáveis não configuradas
**Solução:**
```bash
netlify env:set VITE_FIREBASE_MEASUREMENT_ID "G-SSMK5J8KN5"
```

Ou via interface: https://app.netlify.com/sites/ccborganiza/configuration/env

### Problema 2: Firestore não criado
**Solução:**
1. Acesse: https://console.firebase.google.com/project/directed-optics-460823-q5/firestore
2. Clique em "Criar banco de dados"
3. Escolha modo **Produção** + região
4. Clique em **Criar**

### Problema 3: Regras bloqueando
**Solução:**
```bash
firebase deploy --only firestore:rules
```

### Problema 4: Cache do navegador
**Solução:**
1. Pressione **Ctrl + Shift + R** (hard refresh)
2. Ou limpe o cache do site

## 📊 Comandos Úteis de Diagnóstico

```bash
# Verificar projeto Firebase atual
firebase projects:list

# Verificar status do Firestore
firebase firestore:databases:list

# Ver variáveis de ambiente no Netlify
netlify env:list

# Ver logs de deploy
netlify open --admin
# Depois vá em: Deploys → Último deploy → Deploy log
```

## 🆘 Se Nada Funcionar

1. **Tire screenshots:**
   - Variáveis de ambiente no Netlify
   - Regras do Firestore no Firebase Console
   - Erros no Console do navegador (F12)

2. **Verifique:**
   - O Firestore Database foi realmente criado?
   - As regras foram publicadas?
   - O último deploy do Netlify foi bem-sucedido?

3. **Tente redeploy total:**
   ```bash
   netlify deploy --prod
   ```

## ✅ Checklist Final

- [ ] Firestore Database criado
- [ ] 7 variáveis de ambiente configuradas no Netlify
- [ ] Regras do Firestore publicadas (allow read, write: if true)
- [ ] Último deploy do Netlify sem erros
- [ ] Console do navegador não mostra erros de API key
- [ ] Hard refresh na página (Ctrl+Shift+R)

---

**Próximo Passo:**  
Aguarde o deploy do Netlify (2-3 min) e teste novamente.  
O código agora mostra logs úteis no console para ajudar no diagnóstico! 🔍
