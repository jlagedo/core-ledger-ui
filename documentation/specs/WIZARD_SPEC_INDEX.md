# Especificação do Wizard de Cadastro de Fundos - Índice Geral

## Visão Geral

Este índice organiza a especificação funcional do Wizard de Cadastro de Fundos em documentos modulares para implementação progressiva.

**Sistema:** Fund Accounting - Mercado Brasileiro  
**Módulo:** Cadastro de Fundos  
**Componente:** Wizard de Criação (10 Etapas)  
**Tecnologias:** Angular 21, Bootstrap 5, AG Grid  

---

## Estrutura de Documentos

### 📋 Documentos Base (Implemente Primeiro)

1. **[WIZARD_SPEC_00_OVERVIEW.md](WIZARD_SPEC_00_OVERVIEW.md)**
   - Visão geral do wizard
   - Objetivos e requisitos
   - Fluxo completo das 10 etapas
   - Dependências e pré-requisitos

2. **[WIZARD_SPEC_01_ARCHITECTURE.md](WIZARD_SPEC_01_ARCHITECTURE.md)**
   - Arquitetura de componentes
   - Estrutura de arquivos e pastas
   - Serviços e gerenciamento de estado
   - Roteamento e navegação

3. **[WIZARD_SPEC_02_PROGRESS_BAR.md](WIZARD_SPEC_02_PROGRESS_BAR.md)**
   - Barra de progresso visual
   - Indicadores de etapas (completas, atual, pendentes)
   - Navegação entre etapas
   - Comportamento responsivo

---

### 🎯 Etapas do Wizard (Implemente em Sequência)

4. **[WIZARD_SPEC_03_STEP_01_IDENTIFICACAO.md](WIZARD_SPEC_03_STEP_01_IDENTIFICACAO.md)**
   - Campos: CNPJ, Razão Social, Nome Fantasia, Tipo Fundo
   - Validação de CNPJ (formato e duplicidade)
   - Máscaras de entrada
   - Campos obrigatórios e opcionais

5. **[WIZARD_SPEC_04_STEP_02_CLASSIFICACAO.md](WIZARD_SPEC_04_STEP_02_CLASSIFICACAO.md)**
   - Classificações CVM e ANBIMA
   - Situação do fundo
   - Público alvo (Geral, Qualificado, Profissional)
   - Regime de tributação

6. **[WIZARD_SPEC_05_STEP_03_CARACTERISTICAS.md](WIZARD_SPEC_05_STEP_03_CARACTERISTICAS.md)**
   - Tipo de condomínio (Aberto/Fechado)
   - Prazo (Determinado/Indeterminado)
   - Flags: Exclusivo, Reservado, Alavancagem, Criptoativos
   - Campos condicionais

7. **[WIZARD_SPEC_06_STEP_04_PARAMETROS_COTA.md](WIZARD_SPEC_06_STEP_04_PARAMETROS_COTA.md)**
   - Casas decimais (quantidade e valor)
   - Horário de corte
   - Cota inicial
   - Fracionamento

8. **[WIZARD_SPEC_07_STEP_05_TAXAS.md](WIZARD_SPEC_07_STEP_05_TAXAS.md)**
   - Lista dinâmica de taxas
   - Tipos: Administração, Gestão, Performance
   - Taxa de performance com benchmark (integração com Indexadores)
   - Vigência e base de cálculo

9. **[WIZARD_SPEC_08_STEP_06_PRAZOS.md](WIZARD_SPEC_08_STEP_06_PRAZOS.md)**
   - Prazos de aplicação
   - Prazos de resgate
   - Cotização e liquidação (D+X)
   - Integração com Calendário
   - Valores mínimos

10. **[WIZARD_SPEC_09_STEP_07_CLASSES.md](WIZARD_SPEC_09_STEP_07_CLASSES.md)**
    - Estrutura hierárquica CVM 175
    - Classes e subclasses (até 2 níveis)
    - Campos específicos para FIDCs
    - Taxas específicas por classe
    - **Etapa OPCIONAL**

11. **[WIZARD_SPEC_10_STEP_08_VINCULOS.md](WIZARD_SPEC_10_STEP_08_VINCULOS.md)**
    - Lista de vínculos institucionais
    - Tipos: Administrador, Gestor, Custodiante (obrigatórios)
    - Dados da instituição e responsável
    - Validação de vínculos mínimos

12. **[WIZARD_SPEC_11_STEP_09_DOCUMENTOS.md](WIZARD_SPEC_11_STEP_09_DOCUMENTOS.md)**
    - Upload de documentos
    - Tipos: Regulamento, Lâmina, FIC, etc.
    - Metadados (versão, vigência)
    - **Etapa OPCIONAL**

13. **[WIZARD_SPEC_12_STEP_10_REVISAO.md](WIZARD_SPEC_12_STEP_10_REVISAO.md)**
    - Resumo consolidado de todas etapas
    - Navegação para edição
    - Alertas de campos opcionais não preenchidos
    - Finalização e salvamento

---

### 🔧 Documentos de Suporte (Implemente Conforme Necessário)

14. **[WIZARD_SPEC_13_VALIDATION.md](WIZARD_SPEC_13_VALIDATION.md)**
    - Validações customizadas (CNPJ, datas, etc.)
    - Validações de negócio
    - Mensagens de erro
    - Validações assíncronas

15. **[WIZARD_SPEC_14_DATA_MODELS.md](WIZARD_SPEC_14_DATA_MODELS.md)**
    - Interfaces TypeScript
    - Enums e constantes
    - DTOs para API
    - Estrutura de dados compartilhados

16. **[WIZARD_SPEC_15_API_INTEGRATION.md](WIZARD_SPEC_15_API_INTEGRATION.md)**
    - Endpoints REST
    - Serviço de fundo
    - Verificação de CNPJ
    - Upload de documentos
    - Salvamento final

17. **[WIZARD_SPEC_16_USER_EXPERIENCE.md](WIZARD_SPEC_16_USER_EXPERIENCE.md)**
    - Navegação e fluxo
    - Feedback visual
    - Loading states
    - Mensagens de sucesso/erro
    - Confirmações e alertas

18. **[WIZARD_SPEC_17_RESPONSIVE_DESIGN.md](WIZARD_SPEC_17_RESPONSIVE_DESIGN.md)**
    - Breakpoints e layout
    - Mobile-first considerations
    - Touch interactions
    - Adaptações de formulário

19. **[WIZARD_SPEC_18_ACCESSIBILITY.md](WIZARD_SPEC_18_ACCESSIBILITY.md)**
    - Navegação por teclado
    - Screen readers
    - ARIA labels
    - Contraste e legibilidade

20. **[WIZARD_SPEC_19_TESTING.md](WIZARD_SPEC_19_TESTING.md)**
    - Casos de teste por etapa
    - Testes de integração
    - Testes E2E
    - Validações críticas

---

## Ordem de Implementação Recomendada

### Fase 1: Fundação (Docs 1-3)
1. Ler OVERVIEW para entender contexto geral
2. Implementar ARCHITECTURE (estrutura base)
3. Implementar PROGRESS_BAR (navegação)

### Fase 2: Etapas Básicas (Docs 4-7)
4. Step 1 - Identificação (campos simples)
5. Step 2 - Classificação (selects e radios)
6. Step 3 - Características (toggles e condicionais)
7. Step 4 - Parâmetros de Cota (números e time)

### Fase 3: Etapas com Integrações (Docs 8-9)
8. Step 5 - Taxas (lista dinâmica + integração Indexadores)
9. Step 6 - Prazos (integração Calendário)

### Fase 4: Etapas Complexas (Docs 10-12)
10. Step 7 - Classes (hierarquia, opcional)
11. Step 8 - Vínculos (lista com validações)
12. Step 9 - Documentos (upload, opcional)
13. Step 10 - Revisão (consolidação)

### Fase 5: Refinamento (Docs 13-20)
14. Validações customizadas
15. Integração completa com API
16. UX e feedback
17. Responsividade
18. Acessibilidade
19. Testes

---

## Convenções e Padrões

### Nomenclatura de Arquivos
- Documentos numerados para ordem de implementação
- Prefixo `WIZARD_SPEC_` para fácil identificação
- Sufixo descritivo em UPPER_SNAKE_CASE

### Estrutura de Cada Documento
Cada especificação de etapa segue este padrão:

```markdown
# [Nome da Etapa]

## Objetivo
[O que esta etapa deve coletar]

## Campos
[Lista de campos e seus requisitos]

## Validações
[Regras de validação específicas]

## Comportamento
[Interações e lógica condicional]

## Integração
[APIs ou serviços necessários]

## Critérios de Aceitação
[Como validar que está completo]
```

### Princípios de Design
- **Mobile-first**: Pensar primeiro em telas pequenas
- **Progressive enhancement**: Funcionalidade básica primeiro
- **Feedback imediato**: Validações em tempo real
- **Clareza visual**: Estados claros (loading, sucesso, erro)
- **Acessibilidade**: Usável por teclado e screen readers

---

## Glossário

| Termo | Significado |
|-------|-------------|
| Wizard | Fluxo guiado de múltiplas etapas |
| Etapa | Uma tela do wizard (1 de 10) |
| Step | Sinônimo de etapa |
| Validação | Verificação de dados do usuário |
| Condicional | Campo que aparece baseado em outro |
| Obrigatório | Campo que deve ser preenchido |
| Opcional | Campo que pode ser deixado vazio |
| CVM 175 | Resolução regulatória sobre fundos |
| FIDC | Fundo de Investimento em Direitos Creditórios |
| Benchmark | Índice de referência para performance |
| D+X | Dias úteis após a operação |

---

## Dependências Externas

### Módulos Prontos (Já Implementados)
- ✅ Módulo de Indexadores (para Step 5)
- ✅ Módulo de Calendário (para Step 6)

### Bibliotecas Necessárias
- Angular 21
- Bootstrap 5
- ng-bootstrap
- AG Grid
- ngx-mask
- ngx-currency
- date-fns
- Bootstrap Icons

---

## Notas Importantes

1. **Não pule etapas**: Implemente na ordem para evitar dependências quebradas
2. **Use placeholders**: Se uma integração não está pronta, use mock data
3. **Teste isoladamente**: Cada etapa deve funcionar independentemente
4. **Valide progressivamente**: Não espere o final para testar
5. **Consulte os enums**: Use os valores definidos em DATA_MODELS
6. **Respeite as validações**: Implementadas em VALIDATION
7. **Siga o UX**: Padrões definidos em USER_EXPERIENCE

---

## Suporte e Dúvidas

Para implementação, consulte:
- **Dúvidas técnicas**: Ver ARCHITECTURE
- **Dúvidas de validação**: Ver VALIDATION
- **Dúvidas de UX**: Ver USER_EXPERIENCE
- **Dúvidas de API**: Ver API_INTEGRATION
- **Especificação original**: `/mnt/project/Especificacao_Modulo_Cadastro_Fundos.md`

---

## Status de Implementação

Use esta tabela para rastrear progresso:

| Doc | Especificação | Status | Data |
|-----|---------------|--------|------|
| 00 | Overview | ⏳ Pendente | - |
| 01 | Architecture | ⏳ Pendente | - |
| 02 | Progress Bar | ⏳ Pendente | - |
| 03 | Step 1 - Identificação | ⏳ Pendente | - |
| 04 | Step 2 - Classificação | ⏳ Pendente | - |
| 05 | Step 3 - Características | ⏳ Pendente | - |
| 06 | Step 4 - Parâmetros Cota | ⏳ Pendente | - |
| 07 | Step 5 - Taxas | ⏳ Pendente | - |
| 08 | Step 6 - Prazos | ⏳ Pendente | - |
| 09 | Step 7 - Classes | ⏳ Pendente | - |
| 10 | Step 8 - Vínculos | ⏳ Pendente | - |
| 11 | Step 9 - Documentos | ⏳ Pendente | - |
| 12 | Step 10 - Revisão | ⏳ Pendente | - |
| 13 | Validation | ⏳ Pendente | - |
| 14 | Data Models | ⏳ Pendente | - |
| 15 | API Integration | ⏳ Pendente | - |
| 16 | User Experience | ⏳ Pendente | - |
| 17 | Responsive Design | ⏳ Pendente | - |
| 18 | Accessibility | ⏳ Pendente | - |
| 19 | Testing | ⏳ Pendente | - |

**Legenda:**
- ⏳ Pendente
- 🚧 Em andamento
- ✅ Concluído
- ⚠️ Bloqueado

---

**Versão:** 1.0  
**Última Atualização:** Janeiro/2026  
**Autor:** Especificação Funcional - Fund Accounting
