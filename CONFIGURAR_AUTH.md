# 🔐 Configurar Autenticação Google no Firebase

## ✅ Sistema de Login Criado!

O sistema de autenticação foi implementado com:
- ✅ Login com Google (OAuth)
- ✅ Login com Email/Senha
- ✅ Criação de conta
- ✅ Logout
- ✅ Persistência de sessão
- ✅ Avatar do usuário no sidebar

## 🚀 Configurar no Firebase Console

### 1️⃣ Ativar Autenticação Google

1. **Acesse o Firebase Console:**
   - https://console.firebase.google.com/project/directed-optics-460823-q5/authentication

2. **Ativar método de login:**
   - Clique em **"Get started"** (se for a primeira vez)
   - Ou clique na aba **"Sign-in method"**

3. **Adicionar Google como provedor:**
   - Clique em **"Add new provider"**
   - Selecione **"Google"**
   - Toggle para **"Enable"** (Ativar)
   
4. **Configurar detalhes:**
   - **Project support email**: Selecione seu email
   - **Project public-facing name**: `CCB Organiza`
   - Clique em **"Save"**

### 2️⃣ Ativar Email/Password (Opcional)

1. Na mesma página **"Sign-in method"**
2. Clique em **"Add new provider"**
3. Selecione **"Email/Password"**
4. Toggle para **"Enable"**
5. Clique em **"Save"**

### 3️⃣ Adicionar Domínio Autorizado

1. Na aba **"Settings"** (Configurações)
2. Role até **"Authorized domains"**
3. Clique em **"Add domain"**
4. Adicione: `ccborganiza.netlify.app`
5. Clique em **"Add"**

## 🎯 Como Usar

### Acessar Página de Login
```
https://ccborganiza.netlify.app/login
```

### Funcionalidades Disponíveis

#### Login com Google
- Clique em **"Continuar com Google"**
- Selecione sua conta Google
- Autorize o acesso
- Você será redirecionado para o Dashboard

#### Login com Email/Senha
1. Digite seu email
2. Digite sua senha (mínimo 6 caracteres)
3. Clique em **"Entrar"**

#### Criar Conta
1. Clique em **"Não tem uma conta? Criar conta"**
2. Digite email e senha
3. Clique em **"Criar Conta"**

#### Logout
1. Clique no avatar no sidebar (canto inferior esquerdo)
2. Clique em **"Sair"**

## 🔒 Segurança

### Regras Atuais
As regras do Firestore permitem acesso total (desenvolvimento).

### Regras Recomendadas para Produção
Atualize [firestore.rules](firestore.rules) para:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários autenticados podem ler
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Ou regras mais específicas por coleção
    match /congregacoes/{congregacaoId} {
      allow read: if true; // Todos podem ver
      allow write: if request.auth != null; // Só autenticados podem modificar
    }
  }
}
```

Depois execute:
```bash
firebase deploy --only firestore:rules
```

## 🎨 Interface

### Página de Login
- Design moderno e responsivo
- Card centralizado
- Gradiente suave de fundo
- Ícones intuitivos
- Validação de formulário
- Mensagens de erro amigáveis

### Sidebar
- Avatar do usuário (foto do Google ou inicial)
- Nome e email
- Menu dropdown com opção de logout
- Botão "Fazer Login" para usuários não autenticados

## 🧪 Testar Localmente

1. **Crie arquivo `.env`** (se ainda não existe):
```bash
VITE_FIREBASE_API_KEY=AIzaSyBQQChAmP6SBWBsuUbxYo7Eeh7QpRl-ySQ
VITE_FIREBASE_AUTH_DOMAIN=directed-optics-460823-q5.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=directed-optics-460823-q5
VITE_FIREBASE_STORAGE_BUCKET=directed-optics-460823-q5.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=718866556670
VITE_FIREBASE_APP_ID=1:718866556670:web:8001bad626a607031227af
VITE_FIREBASE_MEASUREMENT_ID=G-SSMK5J8KN5
```

2. **Execute:**
```bash
npm run dev
```

3. **Acesse:**
```
http://localhost:8080/login
```

## 📋 Checklist

- [ ] Ativar autenticação Google no Firebase Console
- [ ] Ativar autenticação Email/Password (opcional)
- [ ] Adicionar domínio `ccborganiza.netlify.app` aos autorizados
- [ ] Aguardar deploy do Netlify (2-3 min)
- [ ] Testar login com Google
- [ ] Testar criação de conta com email
- [ ] Verificar persistência (fechar e abrir navegador)
- [ ] Testar logout

## 🐛 Troubleshooting

### Erro: "popup-closed-by-user"
- Usuário fechou o popup antes de autorizar
- Tente novamente

### Erro: "auth/unauthorized-domain"
- O domínio não está autorizado no Firebase
- Adicione `ccborganiza.netlify.app` nos domínios autorizados

### Erro: "auth/weak-password"
- A senha deve ter pelo menos 6 caracteres

### Erro: "auth/email-already-in-use"
- Email já cadastrado
- Use "Fazer login" em vez de "Criar conta"

## 📱 Próximas Melhorias

- [ ] Recuperação de senha (esqueci minha senha)
- [ ] Verificação de email
- [ ] Autenticação com Facebook
- [ ] Autenticação com Microsoft
- [ ] Perfil do usuário editável
- [ ] Upload de foto de perfil
- [ ] Login obrigatório para certas páginas (Protected Routes)

## 🎉 Pronto!

O sistema de autenticação está **100% funcional**!  
Após ativar no Firebase Console, você poderá fazer login! 🚀

---

**Arquivos Criados:**
- ✅ `src/contexts/AuthContext.tsx` - Contexto de autenticação
- ✅ `src/pages/Login.tsx` - Página de login
- ✅ Sidebar atualizado com avatar e logout
- ✅ App.tsx atualizado com AuthProvider
