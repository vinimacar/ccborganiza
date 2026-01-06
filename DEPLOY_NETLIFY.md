# Guia de Deploy no Netlify

## 🚀 Passo a Passo para Deploy

### Opção 1: Deploy via Git (Recomendado)

1. **Fazer push do código para o GitHub**
   ```bash
   git add .
   git commit -m "Configurar para deploy no Netlify"
   git push origin main
   ```

2. **Conectar com Netlify**
   - Acesse [netlify.com](https://www.netlify.com/)
   - Faça login com sua conta GitHub
   - Clique em "Add new site" → "Import an existing project"
   - Selecione "Deploy with GitHub"
   - Escolha o repositório `ccborganiza`

3. **Configurar Build Settings**
   - O Netlify detectará automaticamente as configurações do `netlify.toml`
   - Verifique se está correto:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Branch to deploy**: `main`

4. **Variáveis de Ambiente**
   - No painel do Netlify, vá em "Site settings" → "Environment variables"
   - Adicione as variáveis do Firebase (se necessário):
     ```
     VITE_FIREBASE_API_KEY=sua_chave_aqui
     VITE_FIREBASE_AUTH_DOMAIN=seu_dominio_aqui
     VITE_FIREBASE_PROJECT_ID=seu_projeto_aqui
     VITE_FIREBASE_STORAGE_BUCKET=seu_bucket_aqui
     VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id_aqui
     VITE_FIREBASE_APP_ID=seu_app_id_aqui
     ```

5. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build e deploy automático

### Opção 2: Deploy via Netlify CLI

1. **Instalar Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login no Netlify**
   ```bash
   netlify login
   ```

3. **Inicializar o projeto**
   ```bash
   netlify init
   ```

4. **Build local**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   # Deploy de teste
   netlify deploy

   # Deploy em produção
   netlify deploy --prod
   ```

### Opção 3: Deploy Manual via Drag & Drop

1. **Build local**
   ```bash
   npm run build
   ```

2. **Upload manual**
   - Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
   - Arraste a pasta `dist` para a área de upload

## 📋 Arquivos de Configuração

### netlify.toml
O arquivo `netlify.toml` já está configurado com:
- ✅ Comando de build
- ✅ Diretório de publicação
- ✅ Redirects para SPA
- ✅ Headers de segurança
- ✅ Cache para assets estáticos

### vite.config.ts
Atualizado com `base: '/'` para funcionar corretamente no Netlify.

## 🔧 Configurações Adicionais

### Domínio Personalizado
1. No painel do Netlify, vá em "Domain settings"
2. Clique em "Add custom domain"
3. Siga as instruções para configurar DNS

### HTTPS
- O Netlify fornece HTTPS automático via Let's Encrypt
- Será configurado automaticamente após o primeiro deploy

### Deploy Previews
- Cada Pull Request terá um preview automático
- Configure em "Site settings" → "Build & deploy" → "Deploy contexts"

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:
- ✅ Todas as rotas funcionam (navegação entre páginas)
- ✅ Assets carregam corretamente (imagens, CSS, JS)
- ✅ Firebase está conectado (se aplicável)
- ✅ Formulários funcionam
- ✅ Autenticação funciona (se aplicável)

## 🐛 Troubleshooting

### Erro 404 ao navegar
- Verifique se o arquivo `netlify.toml` tem o redirect configurado
- Verifique se `_redirects` está na pasta `public`

### Build falha
- Verifique os logs de build no Netlify
- Confirme que todas as dependências estão no `package.json`
- Verifique variáveis de ambiente necessárias

### Assets não carregam
- Verifique o `base` no `vite.config.ts` (deve ser `/`)
- Confirme que o `publish` no `netlify.toml` está como `dist`

## 📚 Recursos Úteis

- [Documentação Netlify](https://docs.netlify.com/)
- [Netlify CLI Docs](https://cli.netlify.com/)
- [Netlify Community](https://answers.netlify.com/)

## 🎉 Pronto!

Seu projeto CCB Organiza está configurado e pronto para deploy no Netlify! 🚀
