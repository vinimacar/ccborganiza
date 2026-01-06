# 🔒 Configurar Regras de Segurança do Firestore

## ⚠️ Problema Atual
Erro: `Missing or insufficient permissions` - O Firestore está bloqueando o acesso aos dados porque as regras de segurança não estão configuradas.

## 🚀 Solução Rápida (Desenvolvimento)

### Opção 1: Via Console do Firebase (Mais Rápido)

1. **Acesse o Firebase Console**
   - Vá em: https://console.firebase.google.com/
   - Selecione seu projeto: **directed-optics-460823-q5**

2. **Navegue até Firestore Database**
   - No menu lateral, clique em **Firestore Database**
   - Clique na aba **Regras** (Rules)

3. **Cole as Regras de Desenvolvimento**
   ```javascript
   rules_version = '2';
   
   service cloud.firestore {
     match /databases/{database}/documents {
       // Regra temporária para desenvolvimento - PERMITE TUDO
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

4. **Publique as Regras**
   - Clique em **Publicar** (Publish)
   - Aguarde a confirmação

5. **Teste Imediatamente**
   - Acesse: https://ccborganiza.netlify.app/
   - O erro deve ter sumido! ✨

### Opção 2: Via Firebase CLI

1. **Instalar Firebase Tools**
   ```bash
   npm install -g firebase-tools
   ```

2. **Fazer Login**
   ```bash
   firebase login
   ```

3. **Inicializar o Projeto**
   ```bash
   firebase init firestore
   ```
   - Selecione seu projeto: **directed-optics-460823-q5**
   - Use o arquivo `firestore.rules` existente
   - Use o arquivo `firestore.indexes.json` existente

4. **Deploy das Regras**
   ```bash
   firebase deploy --only firestore:rules
   ```

## 🔐 Regras para Produção (Quando Estiver Pronto)

### ⚠️ IMPORTANTE
As regras acima permitem **ACESSO TOTAL** ao banco de dados. Use apenas para desenvolvimento/teste!

### Regras Recomendadas para Produção

Quando seu app estiver pronto, atualize para regras mais seguras. O arquivo [firestore.rules](firestore.rules) já contém exemplos comentados.

**Exemplo de Regras Seguras:**
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Congregações - Leitura pública, escrita apenas autenticados
    match /congregacoes/{congregacaoId} {
      allow read: if true;
      allow write: if isSignedIn();
    }
    
    // Ministério - Leitura pública, escrita apenas autenticados
    match /ministerio/{ministerioId} {
      allow read: if true;
      allow write: if isSignedIn();
    }
    
    // Adicione mais regras conforme necessário...
  }
}
```

## 📋 Tipos de Regras

### 1. **Acesso Público Total** (Desenvolvimento)
```javascript
match /{document=**} {
  allow read, write: if true;
}
```
✅ Usar para: Desenvolvimento e testes  
❌ Não usar em: Produção

### 2. **Leitura Pública, Escrita Autenticada**
```javascript
match /congregacoes/{congregacaoId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```
✅ Usar para: Dados que todos podem ver, mas só usuários autenticados podem modificar

### 3. **Apenas Usuários Autenticados**
```javascript
match /relatorios/{relatorioId} {
  allow read, write: if request.auth != null;
}
```
✅ Usar para: Dados sensíveis ou privados

### 4. **Apenas o Dono do Documento**
```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```
✅ Usar para: Perfis de usuário

## 🔍 Testar Regras

No Firebase Console:
1. Vá em **Firestore Database** → **Regras**
2. Clique em **Rules Playground**
3. Teste suas regras antes de publicar

## 🚨 Checklist de Segurança

Antes de ir para produção:

- [ ] Remover regra `allow read, write: if true;`
- [ ] Implementar autenticação de usuários
- [ ] Definir regras específicas por coleção
- [ ] Testar todas as regras no Rules Playground
- [ ] Validar que usuários não autenticados não podem escrever
- [ ] Validar que dados sensíveis estão protegidos
- [ ] Adicionar regras de validação de dados

## 📚 Recursos Úteis

- [Documentação de Regras do Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Guia de Segurança](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Exemplos de Regras](https://firebase.google.com/docs/firestore/security/rules-conditions)

## 🎯 Próximos Passos

1. **Agora:** Configure as regras de desenvolvimento (Opção 1)
2. **Mais tarde:** Implemente autenticação de usuários
3. **Antes de lançar:** Atualize para regras de produção seguras

---

**Arquivos Criados:**
- ✅ `firestore.rules` - Regras de segurança
- ✅ `firebase.json` - Configuração do Firebase
- ✅ `firestore.indexes.json` - Já existia (índices)

**Status:** Pronto para deploy das regras! 🚀
