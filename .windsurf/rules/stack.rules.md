---
trigger: always_on
---
# MindEase — Stack Tecnológica e Arquitetura
Activation: Always On

<stack_guidelines>
- Este projeto utiliza Next.js (App Router) com TypeScript.
- O projeto segue princípios de Clean Architecture.
- A camada de domínio deve ser independente de frameworks, UI ou Next.js.
- Casos de uso não devem acessar componentes de UI diretamente.
- A UI consome estado e decisões vindas do domínio.
</stack_guidelines>

<state_management>
- Existe um estado cognitivo global que controla:
  - modo foco
  - nível de complexidade da interface
  - densidade de informação
  - animações e estímulos visuais
- Mudanças nesse estado afetam layout, navegação e componentes visuais.
</state_management>

<performance_accessibility>
- Performance é considerada parte da acessibilidade cognitiva.
- Evitar layout shifts, reflows excessivos e mudanças visuais inesperadas.
- Priorizar previsibilidade e consistência visual.
</performance_accessibility>

<mobile_consistency>
- Versões Web e Mobile devem manter coerência cognitiva.
- Conceitos de domínio e estado cognitivo devem ser reaproveitáveis.
</mobile_consistency>
