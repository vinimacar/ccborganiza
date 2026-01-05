# 🔐 Configuração de Secrets do GitHub

## ⚠️ Importante

Os avisos no arquivo `.github/workflows/deploy.yml` sobre "Context access might be invalid" são **NORMAIS**.  
Eles apenas indicam que os secrets precisam ser configurados no GitHub **ANTES** do primeiro deploy.

## 📝 Como Configurar os Secrets

### Passo 1: Acessar Configurações do Repositório

1. Vá para seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral esquerdo, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**

### Passo 2: Adicionar Cada Secret

Adicione os seguintes secrets **UM POR VEZ**:

#### Secret 1: VITE_FIREBASE_API_KEY
- **Name**: `VITE_FIREBASE_API_KEY`
- **Secret**: Cole sua API Key do Firebase
- Clique em **Add secret**

#### Secret 2: VITE_FIREBASE_AUTH_DOMAIN
- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Secret**: Cole seu Auth Domain (ex: `seu-projeto.firebaseapp.com`)
- Clique em **Add secret**

#### Secret 3: VITE_FIREBASE_PROJECT_ID
- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Secret**: Cole seu Project ID
- Clique em **Add secret**

#### Secret 4: VITE_FIREBASE_STORAGE_BUCKET
- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Secret**: Cole seu Storage Bucket (ex: `seu-projeto.appspot.com`)
- Clique em **Add secret**

#### Secret 5: VITE_FIREBASE_MESSAGING_SENDER_ID
- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Secret**: Cole seu Messaging Sender ID
- Clique em **Add secret**

#### Secret 6: VITE_FIREBASE_APP_ID
- **Name**: `VITE_FIREBASE_APP_ID`
- **Secret**: Cole seu App ID
- Clique em **Add secret**

### Passo 3: Verificar

Após adicionar todos os secrets, você deve ver **6 secrets** listados:

```
✅ VITE_FIREBASE_API_KEY
✅ VITE_FIREBASE_AUTH_DOMAIN
✅ VITE_FIREBASE_PROJECT_ID
✅ VITE_FIREBASE_STORAGE_BUCKET
✅ VITE_FIREBASE_MESSAGING_SENDER_ID
✅ VITE_FIREBASE_APP_ID
```

## 🔍 Onde Encontrar as Credenciais do Firebase

### Opção 1: Console do Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Selecione seu projeto
3. Clique no ícone de **Configurações** (⚙️) → **Configurações do projeto**
4. Role para baixo até a seção **Seus apps**
5. Selecione o app web (ícone `</>`)
6. Copie as credenciais do objeto `firebaseConfig`

Exemplo:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← VITE_FIREBASE_API_KEY
  authDomain: "projeto.firebaseapp.com", // ← VITE_FIREBASE_AUTH_DOMAIN
  projectId: "seu-projeto",       // ← VITE_FIREBASE_PROJECT_ID
  storageBucket: "projeto.appspot.com", // ← VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",    // ← VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"          // ← VITE_FIREBASE_APP_ID
};
```

### Opção 2: Arquivo .env Local

Se você já configurou o `.env` localmente, copie os valores de lá:

```env
VITE_FIREBASE_API_KEY=seu_valor_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_valor_aqui
VITE_FIREBASE_PROJECT_ID=seu_valor_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_valor_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_valor_aqui
VITE_FIREBASE_APP_ID=seu_valor_aqui
```

## 🚨 Segurança

### ✅ FAZER:
- Copiar valores **EXATAMENTE** como aparecem
- Manter os secrets privados
- Não commitar o arquivo `.env` no Git
- Usar secrets do GitHub para CI/CD

### ❌ NÃO FAZER:
- Compartilhar secrets publicamente
- Commitar credenciais no código
- Usar credenciais de produção em desenvolvimento
- Deixar secrets hardcoded em arquivos

## ✅ Testando o Deploy

Após configurar todos os secrets:

1. Faça qualquer alteração no código
2. Commit e push:
   ```bash
   git add .
   git commit -m "Test deploy"
   git push
   ```
3. Vá para a aba **Actions** no GitHub
4. Veja o workflow "Deploy to GitHub Pages" executando
5. Se tudo estiver correto:
   - ✅ Build será concluído com sucesso
   - ✅ Deploy será feito automaticamente
   - ✅ Site estará disponível em alguns minutos

## 🔧 Troubleshooting

### Erro: "Context access might be invalid"
- **Causa**: Secrets ainda não configurados
- **Solução**: Configure todos os 6 secrets conforme instruções acima

### Erro: "Invalid credentials"
- **Causa**: Credenciais incorretas ou incompletas
- **Solução**: Verifique se copiou os valores corretos do Firebase

### Erro: "Permission denied"
- **Causa**: GitHub Pages não habilitado
- **Solução**: 
  1. Settings → Pages
  2. Source: Deploy from a branch
  3. Branch: gh-pages

### Build falha
- Verifique os logs em Actions
- Confirme que todos os 6 secrets estão configurados
- Teste localmente: `npm run build`

## 📞 Recursos Adicionais

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Console](https://console.firebase.google.com)
- [GitHub Pages Docs](https://docs.github.com/pages)

---

**Dica**: Salve este guia para referência futura quando configurar novos ambientes ou repositórios!
