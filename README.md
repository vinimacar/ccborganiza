# CCB Organiza - Sistema de Gestão Regional

Sistema completo para gerenciamento de congregações, ministério, eventos e atividades da Congregação Cristã no Brasil.

## 🚀 Funcionalidades

- **Dashboard**: Visão geral com estatísticas e métricas
- **Congregações**: Gerenciamento completo de congregações (CRUD)
- **Ministério**: Cadastro e controle de membros do ministério
- **Agenda**: Calendário de eventos e cultos
- **Reforços**: Gestão de reforços musicais
- **Listas**: Criação de listas de eventos com avisos e exportação em PDF
- **Relatórios**: Geração de relatórios com filtros, gráficos e exportação PDF
- **EBI**: Repositório de atividades para Escola Bíblica Infantil
- **Contatos**: Gerenciamento de contatos importantes

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Firebase** - Banco de dados e autenticação
- **shadcn/ui** - Componentes de interface
- **Tailwind CSS** - Estilização
- **jsPDF** - Geração de PDFs
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no Firebase

## 🔧 Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre na pasta do projeto
cd ccb-organiza-main

# Instale as dependências
npm install

# Configure o Firebase
# 1. Copie o arquivo de exemplo
cp .env.example .env

# 2. Edite o arquivo .env e adicione suas credenciais do Firebase
# VITE_FIREBASE_API_KEY=sua_api_key
# VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
# ... (veja .env.example para todos os campos)

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🔥 Configuração do Firebase

Consulte o arquivo [FIREBASE_SETUP.md](FIREBASE_SETUP.md) para instruções detalhadas sobre como:
- Criar um projeto Firebase
- Configurar Firestore
- Obter as credenciais
- Criar as coleções necessárias

## 🌐 Deploy

### GitHub Pages

```bash
# Build do projeto
npm run build

# Deploy para GitHub Pages
# Configure o GitHub Pages para usar a branch gh-pages
```

### Netlify/Vercel

Conecte seu repositório GitHub diretamente na plataforma e configure:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**: Adicione todas as variáveis do Firebase

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   ├── layout/    # Layout principal e sidebar
│   └── ui/        # Componentes shadcn/ui
├── hooks/         # Custom hooks (useFirestore)
├── lib/           # Utilitários (Firebase, datas)
├── pages/         # Páginas da aplicação
└── App.tsx        # Configuração de rotas
```

## 🎨 Padrão de Data

O sistema utiliza o padrão brasileiro:
- Formato: dd/mm/aaaa
- Timezone: America/Sao_Paulo (Horário de Brasília)
- Funções em `src/lib/dateUtils.ts`

## 📱 Coleções Firebase

- `congregacoes` - Congregações cadastradas
- `ministerio` - Membros do ministério
- `eventos` - Eventos gerais
- `cultos` - Cultos programados
- `estatisticas` - Dados estatísticos
- `eventos-listas` - Eventos para listas
- `avisos` - Avisos e comunicados
- `batismos` - Registros de batismos
- `contatos` - Contatos importantes
- `ebi-atividades` - Atividades da EBI

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso interno da CCB.

## 📞 Suporte

Para dúvidas e suporte, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
