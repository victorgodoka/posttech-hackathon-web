---
trigger: always_on
---
# MindEase — Persistência Backend-Agnóstica
Activation: Always On

<core_principle>
- Este projeto é backend-agnóstico.
- O domínio NÃO deve conhecer detalhes de persistência ou backend.
- IndexedDB (idb) é usado apenas como implementação atual, nunca como dependência do domínio.
</core_principle>

<domain_rules>
- A camada de domínio define apenas interfaces de repositório.
- Entidades, Value Objects e Use Cases não podem importar:
  - idb
  - Firebase
  - APIs HTTP
  - SDKs de banco de dados
- Casos de uso dependem apenas de abstrações.
</domain_rules>

<persistence_rules>
- Toda persistência deve ser acessada via repositórios.
- Repositórios são definidos no domínio e implementados na camada de infra.
- IndexedDB é tratado como detalhe de infraestrutura.
</persistence_rules>

<infra_rules>
- A camada de infra pode conter:
  - idb
  - Firebase
  - REST / GraphQL
- Cada backend deve ter sua própria implementação de repositório.
- Trocar o backend não deve exigir mudanças no domínio ou casos de uso.
</infra_rules>

<ui_rules>
- A UI não acessa persistência diretamente.
- A UI interage apenas com casos de uso.
- Nenhuma chamada direta a idb ou backend na camada de UI.
</ui_rules>

<offline_first>
- A persistência local é priorizada para suportar uso offline.
- Baixa latência é considerada parte da acessibilidade cognitiva.
</offline_first>

<migration_principle>
- Implementações de backend devem ser intercambiáveis.
- O projeto deve poder migrar de IndexedDB para qualquer backend sem refatoração estrutural.
</migration_principle>
