# ✅ Checklist de Deploy - CCB Organiza

Use este checklist para garantir que todos os passos foram completados antes do deploy.

## 📋 Pré-Deploy

### Configuração Local
- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Projeto rodando localmente (`npm run dev`)
- [ ] Todas as páginas funcionando corretamente

### Firebase
- [ ] Projeto Firebase criado
- [ ] Firestore Database habilitado
- [ ] Authentication configurado (se necessário)
- [ ] Credenciais copiadas
- [ ] Arquivo `.env` criado e preenchido
- [ ] Teste de conexão com Firebase funcionando
- [ ] Regras de segurança configuradas

### Git
- [ ] Git instalado
- [ ] Repositório inicializado (`git init`)
- [ ] Arquivo `.gitignore` configurado (não commitar `.env`)
- [ ] Primeiro commit feito

## 🚀 Deploy no GitHub

### Criar Repositório
- [ ] Conta GitHub criada/logada
- [ ] Novo repositório criado no GitHub
- [ ] Remote adicionado (`git remote add origin ...`)
- [ ] Código enviado para GitHub (`git push -u origin main`)

### GitHub Pages (Opção 1)
- [ ] Arquivo `.github/workflows/deploy.yml` criado
- [ ] Secrets do Firebase configurados:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
- [ ] GitHub Pages ativado (Settings → Pages)
- [ ] Source configurado para `gh-pages` branch
- [ ] Workflow executado com sucesso
- [ ] Site acessível

## 🌐 Deploy Alternativo

### Netlify (Opção 2)
- [ ] Conta Netlify criada
- [ ] Repositório conectado
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site acessível

### Vercel (Opção 3)
- [ ] Conta Vercel criada
- [ ] Repositório importado
- [ ] Framework Preset: Vite
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site acessível

## 🔒 Segurança

### Firebase Security
- [ ] Regras de Firestore configuradas
- [ ] Domínio adicionado aos Authorized domains
- [ ] Authentication configurado (se usar)
- [ ] Storage rules configuradas (se usar)

### Variáveis de Ambiente
- [ ] `.env` no `.gitignore`
- [ ] `.env.example` commitado
- [ ] Secrets configurados na plataforma de deploy
- [ ] Build test executado com sucesso

## 🧪 Testes Pós-Deploy

### Funcionalidades
- [ ] Dashboard carregando dados do Firebase
- [ ] Congregações (CRUD funcionando)
- [ ] Ministério (CRUD funcionando)
- [ ] Agenda carregando eventos
- [ ] Reforços carregando dados
- [ ] Listas gerando PDFs
- [ ] Relatórios gerando PDFs
- [ ] EBI (CRUD funcionando)
- [ ] Contatos carregando dados

### Performance
- [ ] Site carregando rápido (< 3s)
- [ ] Sem erros no console
- [ ] Firebase conectando corretamente
- [ ] Navegação entre páginas funcionando
- [ ] Responsivo em mobile

### SEO e Acessibilidade
- [ ] Título correto na aba do navegador
- [ ] Favicon configurado
- [ ] Meta tags configuradas
- [ ] Links funcionando corretamente

## 📱 Configurações Finais

### Domínio Personalizado (Opcional)
- [ ] Domínio registrado
- [ ] DNS configurado
- [ ] HTTPS habilitado
- [ ] Domínio testado

### Analytics (Opcional)
- [ ] Google Analytics configurado
- [ ] Firebase Analytics habilitado
- [ ] Tracking funcionando

### Backup
- [ ] Código no GitHub (backup automático)
- [ ] Exportação de dados do Firestore
- [ ] Documentação atualizada

## 📞 Contatos e Documentação

### Documentação Atualizada
- [ ] README.md atualizado
- [ ] FIREBASE_SETUP.md revisado
- [ ] DEPLOY.md criado
- [ ] Comentários no código

### Equipe
- [ ] Equipe informada sobre deploy
- [ ] Credenciais compartilhadas (de forma segura)
- [ ] Treinamento sobre atualização

## 🎉 Deploy Completo!

Após completar todos os itens:
1. Teste todas as funcionalidades
2. Compartilhe o link com a equipe
3. Configure monitoramento
4. Mantenha o Firebase e código atualizados

---

**Data do Deploy**: ___/___/______

**URL do Site**: ________________________________

**Responsável**: ________________________________

**Notas Adicionais**:
_________________________________________________
_________________________________________________
_________________________________________________
