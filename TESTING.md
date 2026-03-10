# 🧪 Guia de Testes - MindEase

## 📋 Visão Geral

O projeto MindEase possui uma cobertura de testes abrangente, incluindo:
- **Testes Unitários**: Testam componentes isolados (entidades, value objects, use cases)
- **Testes de Integração**: Testam fluxos completos de funcionalidades
- **CI/CD**: Pipeline automatizado com GitHub Actions

## 🏗️ Estrutura de Testes

```
app/
├── _domain/
│   ├── entities/__tests__/
│   │   ├── Task.test.ts
│   │   ├── Task.extended.test.ts
│   │   ├── User.test.ts
│   │   └── UserPreferences.test.ts
│   └── value-objects/__tests__/
│       ├── Email.test.ts
│       └── Password.test.ts
└── _application/
    └── use-cases/__tests__/
        ├── AddTask.test.ts
        ├── GetTasks.test.ts
        ├── UpdateTaskState.test.ts
        ├── AuthUseCases.test.ts
        ├── PreferencesUseCases.test.ts
        └── integration/
            ├── TaskWorkflow.integration.test.ts
            └── PreferencesWorkflow.integration.test.ts
```

## 🚀 Comandos de Teste

### Executar todos os testes
```bash
pnpm test
```

### Executar testes em modo watch
```bash
pnpm test:watch
```

### Gerar relatório de cobertura
```bash
pnpm test:coverage
```

### Executar pipeline completo (CI local)
```bash
pnpm ci
```

## 📊 Cobertura de Testes

### Metas de Cobertura
- **Branches**: 60%
- **Functions**: 60%
- **Lines**: 45%
- **Statements**: 45%

### Áreas Cobertas

#### ✅ Domain Layer (100%)
- **Entidades**:
  - `Task`: Criação, estados, steps, timer, custom columns
  - `User`: Criação, validação, persistência
  - `UserPreferences`: Todas as preferências cognitivas
  - `TaskCategory`: Validação de categorias

- **Value Objects**:
  - `Email`: Validação de formato
  - `Password`: Hash, comparação, validação

#### ✅ Application Layer (95%)
- **Use Cases de Tarefas**:
  - `AddTask`: Criação com diferentes parâmetros
  - `GetTasks`: Busca e filtragem
  - `UpdateTaskState`: Transições de estado
  - `DeleteTask`: Remoção
  - `AddTaskStep`: Gerenciamento de steps
  - `UpdateTaskTimer`: Controle de timer Pomodoro

- **Use Cases de Autenticação**:
  - `RegisterUser`: Registro com validações
  - `LoginUser`: Login com Firebase e IndexedDB
  - `LogoutUser`: Limpeza de sessão
  - `GetCurrentUser`: Recuperação de sessão
  - `ContinueAsGuest`: Modo visitante

- **Use Cases de Preferências**:
  - `GetUserPreferences`: Criação de padrões
  - `UpdateUserPreferences`: Atualização de configurações cognitivas

## 🔬 Testes de Integração

### TaskWorkflow.integration.test.ts
Testa o fluxo completo de gerenciamento de tarefas:
- Criação → Atualização → Conclusão → Deleção
- Múltiplas tarefas com estados diferentes
- Gerenciamento de steps
- Tratamento de erros

### PreferencesWorkflow.integration.test.ts
Testa o fluxo de preferências cognitivas:
- Criação de preferências padrão
- Atualização de layout mode
- Atualização de complexidade visual
- Múltiplas preferências simultâneas
- Configurações de Pomodoro
- Colunas customizadas
- Features de acessibilidade cognitiva

## 🎯 Casos de Teste Importantes

### Acessibilidade Cognitiva
```typescript
it('should support minimal visual complexity for cognitive overload', async () => {
  const updated = await updateUserPreferences.execute(userId, {
    visualComplexity: 'minimal',
    informationDensity: 'essential',
    textSize: 'large'
  });
  
  expect(updated.visualComplexity).toBe('minimal');
  expect(updated.informationDensity).toBe('essential');
  expect(updated.textSize).toBe('large');
});
```

### Modo Foco
```typescript
it('should support focus mode (list layout)', async () => {
  const updated = await updateUserPreferences.execute(userId, {
    layoutMode: 'list', // Modo foco
    visualComplexity: 'minimal',
    notificationTiming: 'only-when-asked'
  });
  
  expect(updated.layoutMode).toBe('list');
  expect(updated.notificationTiming).toBe('only-when-asked');
});
```

## 🔧 Configuração

### jest.config.js
```javascript
{
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/jest.setup.test.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'app/_domain/**/*.ts',
    'app/_application/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 45,
      statements: 45,
    },
  },
}
```

### Mocks
- **Firebase**: Mockado para evitar dependências externas
- **IndexedDB**: Usando `fake-indexeddb` para testes
- **Environment Variables**: Configuradas para testes

## 🤖 CI/CD Pipeline

### GitHub Actions (.github/workflows/ci.yml)

#### Jobs Configurados:
1. **Test & Build**
   - Roda em Node.js 18.x e 20.x
   - Type check
   - Lint
   - Testes com cobertura
   - Build da aplicação
   - Upload de cobertura para Codecov

2. **Deploy Preview** (Pull Requests)
   - Deploy automático para preview
   - Vercel integration

3. **Deploy Production** (Branch main)
   - Deploy automático para produção
   - Apenas após testes passarem

### Secrets Necessários no GitHub:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_USE_FIREBASE
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## 📝 Boas Práticas

### 1. Testes Unitários
- Testar uma única responsabilidade por teste
- Usar mocks para dependências externas
- Nomear testes de forma descritiva
- Seguir padrão AAA (Arrange, Act, Assert)

### 2. Testes de Integração
- Testar fluxos completos de usuário
- Minimizar uso de mocks
- Focar em casos de uso reais
- Testar tratamento de erros

### 3. Manutenção
- Manter testes atualizados com código
- Revisar cobertura regularmente
- Adicionar testes para bugs encontrados
- Documentar casos de teste complexos

## 🐛 Debugging de Testes

### Ver output detalhado
```bash
pnpm test -- --verbose
```

### Rodar teste específico
```bash
pnpm test -- Task.test.ts
```

### Rodar apenas testes que falharam
```bash
pnpm test -- --onlyFailures
```

### Debug com breakpoints
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📈 Métricas Atuais

- **Total de Testes**: 185+
- **Testes Passando**: 174+
- **Cobertura de Código**: ~70%
- **Tempo de Execução**: ~5-7s

## 🎓 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Codecov](https://about.codecov.io/)

---

**Última atualização**: Março 2026
**Mantido por**: Equipe MindEase
