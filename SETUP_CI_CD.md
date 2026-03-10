# 🚀 Setup CI/CD - MindEase

## 📋 Pré-requisitos

1. Repositório no GitHub
2. Conta no Vercel (para deploy)
3. Conta no Codecov (opcional, para cobertura)

## 🔧 Configuração Passo a Passo

### 1. Instalar Dependências de Teste

```bash
pnpm install fake-indexeddb --save-dev
```

### 2. Configurar Secrets no GitHub

Vá em: **Settings → Secrets and variables → Actions → New repository secret**

#### Secrets Obrigatórios:

**Vercel:**
```
VERCEL_TOKEN=seu_token_vercel
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id
```

**Firebase (Produção):**
```
NEXT_PUBLIC_USE_FIREBASE=true
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 3. Obter Token do Vercel

1. Acesse: https://vercel.com/account/tokens
2. Crie um novo token
3. Copie e adicione como `VERCEL_TOKEN`

### 4. Obter IDs do Vercel

#### Via CLI:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link do projeto
vercel link

# Ver configurações
cat .vercel/project.json
```

Você verá:
```json
{
  "orgId": "team_xxxxx",
  "projectId": "prj_xxxxx"
}
```

### 5. Configurar Codecov (Opcional)

1. Acesse: https://codecov.io/
2. Conecte seu repositório GitHub
3. Copie o token
4. Adicione como secret: `CODECOV_TOKEN`

### 6. Testar Pipeline Localmente

```bash
# Rodar todos os checks
pnpm ci

# Verificar se passa
echo $?  # Deve retornar 0
```

## 🔄 Fluxo de Trabalho

### Branch `develop` ou Pull Request:
1. Push → GitHub Actions inicia
2. Roda testes em Node 18.x e 20.x
3. Type check + Lint
4. Testes com cobertura
5. Build da aplicação
6. Deploy preview no Vercel
7. Comentário no PR com URL do preview

### Branch `main`:
1. Push → GitHub Actions inicia
2. Mesmos checks acima
3. Deploy para produção no Vercel
4. URL de produção atualizada

## 📊 Badges para README

Adicione ao seu `README.md`:

```markdown
![CI/CD](https://github.com/seu-usuario/seu-repo/workflows/CI/CD%20Pipeline/badge.svg)
![Coverage](https://codecov.io/gh/seu-usuario/seu-repo/branch/main/graph/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.17.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
```

## 🐛 Troubleshooting

### Pipeline falha no type-check
```bash
# Rodar localmente
pnpm type-check

# Corrigir erros de tipo
```

### Pipeline falha nos testes
```bash
# Rodar testes localmente
pnpm test

# Ver detalhes
pnpm test -- --verbose
```

### Deploy falha no Vercel
1. Verificar se secrets estão corretos
2. Verificar se build passa localmente: `pnpm build`
3. Verificar logs no Vercel dashboard

### Cobertura não aparece no Codecov
1. Verificar se token está correto
2. Verificar se arquivo `coverage/coverage-final.json` existe
3. Verificar logs do GitHub Actions

## 🔒 Segurança

### ⚠️ NUNCA commitar:
- `.env.local`
- Tokens ou API keys
- Credenciais do Firebase
- Secrets do Vercel

### ✅ Sempre usar:
- GitHub Secrets para variáveis sensíveis
- `.gitignore` atualizado
- Environment variables no Vercel

## 📝 Checklist de Setup

- [ ] Repositório no GitHub criado
- [ ] Secrets configurados no GitHub
- [ ] Token do Vercel obtido
- [ ] IDs do Vercel configurados
- [ ] Pipeline testado localmente (`pnpm ci`)
- [ ] Push para GitHub
- [ ] Verificar Actions rodando
- [ ] Verificar deploy no Vercel
- [ ] Badges adicionados ao README
- [ ] Documentação atualizada

## 🎯 Próximos Passos

1. **Aumentar cobertura de testes** para 80%+
2. **Adicionar testes E2E** com Playwright
3. **Configurar Lighthouse CI** para performance
4. **Adicionar análise de bundle size**
5. **Configurar dependabot** para atualizações

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Codecov Docs](https://docs.codecov.com/)
- [Jest CI/CD](https://jestjs.io/docs/continuous-integration)

---

**Última atualização**: Março 2026
**Mantido por**: Equipe MindEase
