# 🔥 Configuração do Firebase - CCB Organiza

Este documento descreve como configurar o Firebase para o sistema CCB Organiza.

## 📋 Pré-requisitos

1. Uma conta no [Firebase Console](https://console.firebase.google.com/)
2. Node.js instalado (v16 ou superior)

## 📦 Arquivos de Configuração

- **firestore.rules** - Regras de segurança do Firestore
- **firestore.indexes.json** - Índices para otimização de queries

## 🚀 Passos para Configuração

### 1. Criar um Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou "Create a project"
3. Digite um nome para o projeto (ex: `ccb-organiza`)
4. Siga as etapas de configuração até concluir

### 2. Ativar o Firestore Database

1. No painel lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de produção ou teste:
   - **Modo teste**: Permite leitura/gravação sem autenticação (útil para desenvolvimento)
   - **Modo produção**: Requer regras de segurança configuradas
4. Escolha a localização mais próxima (ex: `southamerica-east1`)
5. Clique em "Ativar"

### 3. Obter Credenciais do Firebase

1. No Firebase Console, clique no ícone de engrenagem ⚙️ > "Configurações do projeto"
2. Na seção "Seus apps", clique no ícone Web `</>`
3. Digite um apelido para o app (ex: `ccb-organiza-web`)
4. **Não** marque "Configurar o Firebase Hosting"
5. Clique em "Registrar app"
6. Copie o objeto `firebaseConfig` que aparecerá

### 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto `ccb-organiza-main`, crie um arquivo `.env`:

```bash
cd ccb-organiza-main
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 5. Estrutura do Banco de Dados (Coleções)

O sistema utiliza as seguintes coleções no Firestore:

#### 📁 `congregacoes`
```typescript
{
  nome: string;
  endereco: string;
  cidade: string;
  uf: string;
  diasCulto: string[];
  horario: string;
  temEBI: boolean;
  capacidade: number;
  ocupacao: number;
}
```

#### 📁 `eventos`
```typescript
{
  tipo: string;
  data: string;
  local: string;
}
```

#### 📁 `cultos`
```typescript
{
  congregacao: string;
  data: string;
  horario: string;
}
```

#### 📁 `estatisticas`
```typescript
{
  batismosAno: number;
  ministerioAtivo: number;
  criancasEBI: number;
}
```

#### 📁 `ministerio`
```typescript
{
  nome: string;
  ministerio: string;
  congregacao: string;
  telefone: string;
  status: "ativo" | "inativo";
}
```

#### 📁 `eventos-listas`
```typescript
{
  tipo: string;
  data: string;
  local: string;
  participantes: number;
  status: "confirmado" | "pendente" | "realizado";
}
```

#### 📁 `batismos`
```typescript
{
  data: string;
  hora: string;
  localidade: string;
  anciao: string;
}
```

#### 📁 `contatos`
```typescript
{
  nome: string;
  ministerio: string;
  congregacao: string;
  telefone: string;
  email?: string;
}
```

### 6. Inserir Dados Iniciais (Opcional)

Para inserir dados de exemplo no Firestore:

1. Acesse o Firestore Database no Firebase Console
2. Clique em "Iniciar coleção"
3. Digite o nome da coleção (ex: `congregacoes`)
4. Adicione documentos com os campos descritos acima

Ou use o Firebase CLI para importar dados em lote.

### 7. Configurar Regras de Segurança

Para desenvolvimento, você pode usar regras permissivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // APENAS PARA DESENVOLVIMENTO!
    }
  }
}
```

**⚠️ IMPORTANTE**: Em produção, configure regras adequadas de autenticação e autorização.

### 8. Iniciar o Projeto

```bash
npm install
npm run dev
```

O sistema agora está conectado ao Firebase e buscará todos os dados do Firestore em tempo real! 🎉

## 🔧 Solução de Problemas

### Erro: "Firebase not configured"
- Verifique se o arquivo `.env` existe e está na raiz correta
- Confirme que todas as variáveis de ambiente estão preenchidas
- Reinicie o servidor de desenvolvimento

### Erro: "Permission denied"
- Verifique as regras de segurança no Firestore
- Em desenvolvimento, pode usar regras permissivas (ver item 7)

### Dados não aparecem
- Confirme que as coleções foram criadas no Firestore
- Verifique se há documentos nas coleções
- Abra o console do navegador para ver possíveis erros

## � Configurar Regras de Segurança e Índices

### Via Firebase Console (Recomendado)

#### Regras de Segurança:
1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: **directed-optics-460823-q5**
3. Vá em **Firestore Database** → **Regras**
4. Cole o conteúdo do arquivo `firestore.rules`
5. Clique em **Publicar**

#### Índices:
1. Vá em **Firestore Database** → **Índices**
2. Os índices serão criados automaticamente quando necessário
3. Ou use o arquivo `firestore.indexes.json` com Firebase CLI

### Via Firebase CLI

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar (se ainda não fez)
firebase init firestore

# Deploy
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 📊 Coleções Configuradas

- **eventos-listas** - Eventos e listas de atividades
- **avisos** - Avisos e comunicados
- **ebi-atividades** - Atividades da Escola Bíblica Infantil
- **congregacoes** - Dados das congregações
- **ministerio** - Informações do ministério

## 📚 Recursos Úteis

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase React Tutorial](https://firebase.google.com/docs/web/setup)
- [Regras de Segurança](https://firebase.google.com/docs/firestore/security/get-started)

## 🎯 Próximos Passos

- [x] Configurar regras de segurança (arquivo criado)
- [x] Configurar índices (arquivo criado)
- [ ] Aplicar regras no Firebase Console
- [ ] Configurar autenticação de usuários

- [ ] Implementar regras de segurança adequadas
- [ ] Adicionar validação de dados
- [ ] Implementar backup automático
- [ ] Configurar índices compostos conforme necessário
