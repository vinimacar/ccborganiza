# CCB Organiza - Guia de Deploy

Sistema de Gestão Regional da Congregação Cristã no Brasil.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase
- Git instalado

## 🔧 Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative o Firestore Database
4. Copie as credenciais de configuração

### Estrutura do Firestore

O sistema usa as seguintes coleções:

- **congregacoes** - Dados das congregações
- **ministerio** - Membros do ministério
- **eventos** - Eventos gerais
- **batismos** - Registros de batismos
- **reforcos** - Reforços e ensaios
- **contatos** - Lista de contatos
- **listas_eventos** - Eventos para listas mensais
- **avisos** - Avisos das listas
- **atividades_ebi** - Atividades da EBI

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd ccborganiza/ccb-organiza-main
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

4. Execute em modo de desenvolvimento:
```bash
npm run dev
```

## 🚀 Deploy

### Deploy para GitHub Pages

1. Instale o gh-pages:
```bash
npm install -D gh-pages
```

2. Adicione no `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. No `vite.config.ts`, configure o base:
```ts
export default defineConfig({
  base: '/ccborganiza/',
  // ... resto da configuração
})
```

4. Faça o build e deploy:
```bash
npm run deploy
```

5. Ative o GitHub Pages:
   - Acesse Settings → Pages
   - Selecione a branch `gh-pages`
   - Salve

### Deploy para Vercel

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça o deploy:
```bash
vercel
```

3. Configure as variáveis de ambiente no dashboard da Vercel

### Deploy para Netlify

1. Crie arquivo `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Conecte o repositório no Netlify Dashboard
3. Configure as variáveis de ambiente

## 📱 Funcionalidades

### Dashboard
- Visão geral com estatísticas
- Gráficos de congregações e ministério
- Cartões informativos

### Congregações
- Adicionar/Editar/Remover congregações
- Buscar e filtrar
- Integração com Firebase em tempo real

### Ministério
- Gerenciar membros do ministério
- Detalhes completos de cada membro
- Status e badges

### Relatórios
- Gráficos interativos (barras, pizza, linha)
- Exportação para PDF
- Filtros personalizáveis

### EBI (Escola Bíblica Infantil)
- Repositório de atividades
- Filtros por categoria e faixa etária
- Upload de links para materiais

### Listas
- Criar listas de eventos mensais
- Adicionar eventos
- Editar avisos
- Preview e impressão
- Exportar PDF

## 🛠️ Tecnologias Utilizadas

- React 18 + TypeScript
- Vite
- Firebase (Firestore)
- Shadcn/UI
- Recharts
- jsPDF
- Tailwind CSS
- React Router

## 📅 Formatação de Datas

O sistema usa formatação brasileira:
- Formato: dd/mm/aaaa
- Timezone: America/Sao_Paulo
- Locale: pt-BR

## 🔐 Segurança

- Nunca commite o arquivo `.env`
- Use variáveis de ambiente para credenciais
- Configure regras de segurança no Firestore
- Ative autenticação se necessário

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Firebase
2. Confira o arquivo `FIREBASE_SETUP.md`
3. Revise os logs do console

## 📝 Licença

Este projeto é de uso interno da CCB.
