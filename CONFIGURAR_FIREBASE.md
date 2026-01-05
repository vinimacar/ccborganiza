# Como Configurar o Firebase para Deploy

## ⚠️ IMPORTANTE: Configure os Secrets do GitHub

O deploy está falhando porque as credenciais do Firebase não estão configuradas. Siga os passos abaixo:

### Passo 1: Obter Credenciais do Firebase

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto (ou crie um novo)
3. Clique no ícone de engrenagem ⚙️ e vá em **Configurações do projeto**
4. Role até **Seus aplicativos** 
5. Se ainda não tiver um app web, clique em **Adicionar app** e selecione **Web (</> )**
6. Copie o objeto `firebaseConfig` que aparecerá

### Passo 2: Configurar Secrets no GitHub

1. Acesse: https://github.com/vinimacar/ccborganiza/settings/secrets/actions

2. Clique em **New repository secret** e adicione cada uma dessas variáveis:

   | Nome do Secret | Valor do Firebase Config |
   |----------------|-------------------------|
   | `VITE_FIREBASE_API_KEY` | apiKey |
   | `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
   | `VITE_FIREBASE_PROJECT_ID` | projectId |
   | `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
   | `VITE_FIREBASE_APP_ID` | appId |

### Passo 3: Configurar Firestore (Banco de Dados)

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha o modo de produção
4. Selecione uma localização (ex: `southamerica-east1` para São Paulo)
5. Vá em **Regras** e configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Passo 4: Testar Localmente (Opcional)

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione suas credenciais:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

3. Execute: `npm run dev`

### Passo 5: Fazer Deploy

Após configurar todos os secrets, faça um novo commit ou force um re-run do workflow:

1. Acesse: https://github.com/vinimacar/ccborganiza/actions
2. Clique no último workflow que falhou
3. Clique em **Re-run all jobs**

---

## 📝 Verificar se os Secrets estão configurados

Você pode verificar se os secrets existem (sem ver os valores) em:
https://github.com/vinimacar/ccborganiza/settings/secrets/actions

Deve haver 6 secrets configurados.
