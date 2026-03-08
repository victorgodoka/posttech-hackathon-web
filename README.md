# MindEase

**Acessibilidade cognitiva para organização de tarefas**

MindEase é uma aplicação de gerenciamento de tarefas projetada com foco em **acessibilidade cognitiva**, reduzindo sobrecarga mental e oferecendo controle adaptativo da interface baseado nas necessidades do usuário.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)
- [Princípios de Design](#princípios-de-design)
- [Setup e Instalação](#setup-e-instalação)
- [Decisões Técnicas](#decisões-técnicas)
- [Funcionalidades](#funcionalidades)
- [Acessibilidade](#acessibilidade)

---

## 🎯 Visão Geral

MindEase não é apenas um gerenciador de tarefas — é uma ferramenta de **suporte cognitivo** que adapta sua interface e funcionalidades ao estado mental e preferências do usuário.

### Diferencial

- **Sem gamificação tradicional**: Não usa pontos, XP, streaks ou rankings
- **Controle de complexidade**: Usuário define densidade de informação e layout
- **Offline-first**: Funciona sem conexão, com persistência local
- **Backend-agnostic**: Arquitetura preparada para trocar de backend sem refatoração

---

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture**, garantindo separação de responsabilidades e independência de frameworks.

### Camadas

```
┌─────────────────────────────────────────┐
│          UI Layer (Next.js)             │
│  ┌─────────────────────────────────┐    │
│  │   Components & Pages            │    │
│  │   - Dashboard, Settings         │    │
│  │   - TaskCard, ToastNotification │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
              ↓ depende de
┌─────────────────────────────────────────┐
│      Application Layer (Use Cases)      │
│  ┌─────────────────────────────────┐    │
│  │   AddTask, UpdateTaskState      │    │
│  │   UpdateUserPreferences         │    │
│  │   LoginUser, RegisterUser       │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
              ↓ depende de
┌─────────────────────────────────────────┐
│         Domain Layer (Entities)         │
│  ┌─────────────────────────────────┐    │
│  │   Task, User, UserPreferences   │    │
│  │   Email (Value Object)          │    │
│  │   ITaskRepository (Interface)   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
              ↑ implementado por
┌─────────────────────────────────────────┐
│    Infrastructure Layer (Persistence)   │
│  ┌─────────────────────────────────┐    │
│  │   TaskRepositoryIDB             │    │
│  │   PreferencesRepositoryIDB      │    │
│  │   UserRepositoryIDB             │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Princípios Aplicados

- **Inversão de Dependência**: Domínio define interfaces, infraestrutura implementa
- **Separação de Responsabilidades**: Cada camada tem um propósito claro
- **Independência de Framework**: Domínio não conhece Next.js, React ou IndexedDB

---

## 📁 Estrutura do Projeto

```
app/
├── _domain/                    # Camada de Domínio (regras de negócio)
│   ├── entities/
│   │   ├── Task.ts            # Entidade Task com lógica de timer Pomodoro
│   │   ├── User.ts            # Entidade User
│   │   └── UserPreferences.ts # Preferências cognitivas do usuário
│   ├── value-objects/
│   │   ├── Email.ts           # Value Object para validação de email
│   │   └── Password.ts        # Value Object para hash de senha
│   └── repositories/          # Interfaces de repositórios
│       ├── ITaskRepository.ts
│       ├── IUserRepository.ts
│       └── IPreferencesRepository.ts
│
├── _application/               # Camada de Aplicação (casos de uso)
│   └── use-cases/
│       ├── AddTask.ts
│       ├── UpdateTaskState.ts
│       ├── UpdateUserPreferences.ts
│       ├── LoginUser.ts
│       └── RegisterUser.ts
│
├── _infrastructure/            # Camada de Infraestrutura
│   ├── di/
│   │   └── container.ts       # Dependency Injection Container
│   └── persistence/
│       └── idb/               # Implementação IndexedDB
│           ├── db.ts
│           ├── TaskRepositoryIDB.ts
│           ├── UserRepositoryIDB.ts
│           └── PreferencesRepositoryIDB.ts
│
├── _components/                # Componentes React
│   ├── AuthProvider.tsx       # Context de autenticação
│   ├── CognitiveProvider.tsx  # Context de preferências cognitivas
│   ├── CognitiveStyles.tsx    # Aplicação de estilos adaptativos
│   ├── ToastProvider.tsx      # Sistema de notificações
│   ├── TaskCard.tsx           # Card de tarefa
│   └── hooks/
│       └── useCognitiveLayout.ts  # Hook para layout adaptativo
│
├── dashboard/                  # Página principal (Kanban)
│   └── page.tsx
├── settings/                   # Página de configurações
│   └── page.tsx
└── welcome/                    # Página de boas-vindas
    └── page.tsx
```

---

## 🛠️ Tecnologias

### Core
- **Next.js 16** (App Router) - Framework React
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Estilização

### Persistência
- **IndexedDB** (via `idb`) - Banco de dados local
- Backend-agnostic: pronto para migrar para Firebase, Supabase, etc.

### Funcionalidades
- **@dnd-kit** - Drag and drop acessível
- **bcryptjs** - Hash de senhas

### Qualidade
- **ESLint** - Linting
- **TypeScript strict mode** - Segurança de tipos

---

## 🎨 Princípios de Design

### 1. **Acessibilidade Cognitiva**
- Redução de estímulos visuais
- Controle de densidade informacional
- Navegação simplificada

### 2. **Sem Gamificação Tradicional**
- ❌ Sem pontos, XP ou rankings
- ❌ Sem streaks ou penalidades
- ✅ Micro-jogos opcionais para pausas cognitivas

### 3. **Controle do Usuário**
- **Layout Mode**: Lista, Completo ou Customizado
- **Information Density**: Essencial ou Completo
- **Visual Complexity**: Minimal, Balanced ou Informative
- **Text Size**: Small, Medium ou Large

### 4. **Performance como Acessibilidade**
- Offline-first
- Baixa latência
- Sem layout shifts

---

## 🚀 Setup e Instalação

### Pré-requisitos
- Node.js >= 18.17.0
- npm, yarn, pnpm ou bun

### Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd web

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build para Produção

```bash
npm run build
npm start
```

---

## 🧠 Decisões Técnicas

### 1. **Por que Clean Architecture?**
- Facilita testes unitários (domínio isolado)
- Permite trocar frameworks sem reescrever lógica
- Melhora manutenibilidade a longo prazo

### 2. **Por que IndexedDB?**
- Funciona offline
- Sem necessidade de servidor para MVP
- Fácil migração para backend real (interfaces já definidas)

### 3. **Por que Context API ao invés de Redux?**
- Menor complexidade para estado global simples
- Suficiente para preferências e autenticação
- Menos boilerplate

### 4. **Por que TypeScript strict mode?**
- Previne bugs em tempo de compilação
- Melhora autocomplete e refatoração
- Documentação viva do código

### 5. **Por que Toast Notifications?**
- Feedback visual não invasivo
- Acessível (ARIA live regions)
- Melhor UX do que apenas console.error

---

## ✨ Funcionalidades

### Gestão de Tarefas
- ✅ Kanban simplificado (A fazer → Fazendo → Completo)
- ✅ Drag and drop entre colunas
- ✅ Checklist de passos por tarefa
- ✅ Timer Pomodoro integrado (25min trabalho / 5min pausa)

### Controle Cognitivo
- ✅ **3 modos de layout**:
  - **Lista**: 1 coluna + histórico discreto
  - **Completo**: 3 colunas Kanban
  - **Customizado**: Colunas personalizáveis (em desenvolvimento)
- ✅ **Densidade informacional**: Essencial (só texto) ou Completo (timer + steps)
- ✅ **Complexidade visual**: Controla quantidade de ações e estímulos
- ✅ **Tamanho de fonte**: 3 níveis ajustáveis

### Acessibilidade
- ✅ Suporte a `prefers-reduced-motion`
- ✅ ARIA labels em botões de ícone
- ✅ Navegação por teclado (Enter, Escape, Tab)
- ✅ Notificações toast acessíveis
- ✅ Contraste WCAG AA (em validação)

### Autenticação
- ✅ Login/Registro com email e senha
- ✅ Modo visitante (sem cadastro)
- ✅ Preferências persistidas por usuário

---

## ♿ Acessibilidade

### Implementado
- ✅ Semântica HTML correta
- ✅ ARIA labels e roles
- ✅ Navegação por teclado
- ✅ `prefers-reduced-motion`
- ✅ Feedback visual e sonoro

### Em Validação
- ⚠️ Contraste de cores WCAG AA
- ⚠️ Testes com leitores de tela

---

## 📝 Guia de Codificação

### Regras de TypeScript
- ❌ **Nunca use `any`** - sempre crie interfaces tipadas
- ✅ Use `UserJSON`, `TaskJSON` para dados de persistência
- ✅ Use type assertions apenas quando necessário: `data.state as TaskState`

### Regras de Acessibilidade
- ✅ **Sempre adicione `aria-label`** em botões com apenas ícones
- ✅ **Sempre adicione `onKeyDown`** para navegação por teclado
- ✅ Use `role="alert"` e `aria-live="polite"` em notificações

### Regras de Feedback
- ❌ **Nunca use apenas `console.error`**
- ✅ Use `showSuccess()`, `showError()` do `useToast()`
- ✅ Forneça feedback visual para todas as ações do usuário

### Regras de Domínio
- ❌ Domínio **não pode** importar React, Next.js ou IndexedDB
- ✅ Use interfaces de repositório
- ✅ Mantenha lógica de negócio nas entidades

---

## 🔮 Roadmap

- [ ] Testes unitários (Jest + Testing Library)
- [ ] Modo customizado completo (UI para adicionar colunas)
- [ ] Validação de contraste WCAG AA
- [ ] PWA (Service Worker + Manifest)
- [ ] Sincronização com backend (Firebase/Supabase)
- [ ] Versão mobile (React Native)

---

## 📄 Licença

Este projeto foi desenvolvido para o Hackathon PósTech FIAP.

---

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Siga os princípios de Clean Architecture
2. Mantenha a acessibilidade cognitiva como prioridade
3. Adicione testes para novas funcionalidades
4. Documente decisões técnicas importantes
