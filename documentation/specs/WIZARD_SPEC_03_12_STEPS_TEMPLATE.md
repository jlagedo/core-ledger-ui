# WIZARD_SPEC_03 até WIZARD_SPEC_12 - Etapas do Wizard

## Nota de Implementação

Os documentos **WIZARD_SPEC_03** até **WIZARD_SPEC_12** seguem um padrão consistente de especificação funcional para cada etapa do wizard.

Cada documento contém:

1. **Objetivo** - O que a etapa deve coletar
2. **Campos** - Lista completa de campos e seus requisitos
3. **Validações** - Regras de validação específicas
4. **Comportamento Condicional** - Campos que aparecem baseados em outros
5. **Integrações** - APIs ou serviços necessários
6. **Layout Sugerido** - Organização visual dos campos
7. **Mensagens** - Erros, avisos e informações
8. **Critérios de Aceitação** - Como validar que está completo

---

## Lista de Documentos de Etapas

### WIZARD_SPEC_03 - Step 1: Identificação
**Arquivo**: `WIZARD_SPEC_03_STEP_01_IDENTIFICACAO.md`  
**Campos principais**: CNPJ, Razão Social, Nome Fantasia, Tipo Fundo, Datas  
**Validação crítica**: CNPJ único no sistema  
**Integração**: API de verificação de CNPJ

### WIZARD_SPEC_04 - Step 2: Classificação
**Arquivo**: `WIZARD_SPEC_04_STEP_02_CLASSIFICACAO.md`  
**Campos principais**: Classificações CVM/ANBIMA, Situação, Público Alvo, Tributação  
**Validação crítica**: Público alvo compatível com tipo fundo  
**Integração**: Nenhuma

### WIZARD_SPEC_05 - Step 3: Características
**Arquivo**: `WIZARD_SPEC_05_STEP_03_CARACTERISTICAS.md`  
**Campos principais**: Condomínio, Prazo, Flags (Exclusivo, Alavancagem, Cripto)  
**Validação crítica**: Data encerramento obrigatória se prazo determinado  
**Integração**: Nenhuma

### WIZARD_SPEC_06 - Step 4: Parâmetros de Cota
**Arquivo**: `WIZARD_SPEC_06_STEP_04_PARAMETROS_COTA.md`  
**Campos principais**: Casas decimais, Horário corte, Cota inicial  
**Validação crítica**: Limites de casas decimais  
**Integração**: Nenhuma

### WIZARD_SPEC_07 - Step 5: Taxas
**Arquivo**: `WIZARD_SPEC_07_STEP_05_TAXAS.md`  
**Campos principais**: Lista de taxas (Administração, Gestão, Performance)  
**Validação crítica**: Taxa performance requer benchmark  
**Integração**: Módulo de Indexadores (lista de benchmarks)

### WIZARD_SPEC_08 - Step 6: Prazos
**Arquivo**: `WIZARD_SPEC_08_STEP_06_PRAZOS.md`  
**Campos principais**: Aplicação e Resgate (cotização, liquidação, valores mínimos)  
**Validação crítica**: Liquidação >= Cotização  
**Integração**: Módulo de Calendário (cálculo D+X)

### WIZARD_SPEC_09 - Step 7: Classes (Opcional)
**Arquivo**: `WIZARD_SPEC_09_STEP_07_CLASSES.md`  
**Campos principais**: Hierarquia de classes CVM 175 (até 2 níveis)  
**Validação crítica**: Subclasse não pode ter subclasse  
**Integração**: Nenhuma  
**Especial**: Etapa OPCIONAL

### WIZARD_SPEC_10 - Step 8: Vínculos
**Arquivo**: `WIZARD_SPEC_10_STEP_08_VINCULOS.md`  
**Campos principais**: Lista de vínculos (Administrador, Gestor, Custodiante)  
**Validação crítica**: Mínimo 3 vínculos obrigatórios  
**Integração**: Opcional - autocomplete de instituições

### WIZARD_SPEC_11 - Step 9: Documentos (Opcional)
**Arquivo**: `WIZARD_SPEC_11_STEP_09_DOCUMENTOS.md`  
**Campos principais**: Upload de documentos (Regulamento, Lâmina, etc)  
**Validação crítica**: PDF, máximo 10MB  
**Integração**: API de upload  
**Especial**: Etapa OPCIONAL

### WIZARD_SPEC_12 - Step 10: Revisão
**Arquivo**: `WIZARD_SPEC_12_STEP_10_REVISAO.md`  
**Campos principais**: Resumo consolidado de todas etapas  
**Validação crítica**: Todas etapas obrigatórias completas  
**Integração**: API de salvamento final

---

## Template de Especificação de Etapa

Cada documento de etapa segue esta estrutura:

```markdown
# WIZARD_SPEC_XX - Step Y: [Nome da Etapa]

## 1. Objetivo
[Descrição do que esta etapa deve coletar]

## 2. Campos

### 2.1 Campos Obrigatórios
[Tabela com campos obrigatórios]

### 2.2 Campos Opcionais
[Tabela com campos opcionais]

### 2.3 Campos Condicionais
[Campos que aparecem baseados em outros]

## 3. Enums e Opções
[Valores possíveis para selects e radios]

## 4. Validações

### 4.1 Validações de Formato
[Máscaras, regex, etc]

### 4.2 Validações de Negócio
[Regras específicas do domínio]

### 4.3 Validações Assíncronas
[Chamadas à API para validar]

## 5. Comportamento Condicional
[Lógica de campos que aparecem/desaparecem]

## 6. Integrações
[APIs ou serviços necessários]

## 7. Layout Sugerido
[Organização dos campos em linhas/colunas]

## 8. Mensagens

### 8.1 Mensagens de Erro
[Textos de erro de validação]

### 8.2 Mensagens de Ajuda
[Tooltips e hints]

### 8.3 Mensagens de Sucesso
[Feedback positivo]

## 9. Acessibilidade
[Considerações específicas]

## 10. Critérios de Aceitação
[Checklist de funcionalidades]

## 11. Próximos Passos
[Link para próximo documento]
```

---

## Padrão de Campos

Cada campo é especificado com:

| Propriedade | Descrição | Exemplo |
|------------|-----------|---------|
| Nome | Nome do campo | CNPJ |
| Tipo | Tipo de input | text, select, date, number |
| Máscara | Formato de entrada | 99.999.999/9999-99 |
| Obrigatório | Sim/Não/Condicional | Sim |
| Validação | Regras de validação | CNPJ válido, único |
| Default | Valor padrão | null, vazio, true |
| Placeholder | Texto de exemplo | "Digite o CNPJ" |
| Tooltip | Ajuda contextual | "CNPJ deve ter 14 dígitos" |
| Depende de | Campo que controla visibilidade | tipo_fundo = FIDC |

---

## Padrão de Validação

Cada validação é especificada com:

| Código | Regra | Tipo | Mensagem |
|--------|-------|------|----------|
| STEP1-001 | CNPJ obrigatório | Obrigatório | "CNPJ é obrigatório" |
| STEP1-002 | CNPJ formato válido | Formato | "CNPJ inválido" |
| STEP1-003 | CNPJ único | Assíncrona | "CNPJ já cadastrado" |

---

## Ordem de Implementação

1. **STEP 1-4**: Etapas básicas (campos simples)
2. **STEP 5-6**: Etapas com integrações
3. **STEP 7**: Etapa opcional complexa (classes)
4. **STEP 8**: Etapa com lista dinâmica (vínculos)
5. **STEP 9**: Etapa opcional com upload
6. **STEP 10**: Etapa de revisão e finalização

---

## Dependências Entre Etapas

### STEP 1 → Todas
Tipo de fundo (Step 1) influencia campos em outras etapas:
- FIDC: campos específicos em Step 7 (Classes)

### STEP 3 → STEP 7
Prazo do fundo (Step 3) influencia:
- Obrigatoriedade de data encerramento

### STEP 5 → Integração
Taxas (Step 5) requer:
- Lista de indexadores (módulo externo)

### STEP 6 → Integração
Prazos (Step 6) requer:
- Calendário (módulo externo)

---

## Implementação Progressiva

### Fase 1: Estrutura Base
- Criar componentes de cada step
- Criar formulários reativos
- Integrar com WizardStateService

### Fase 2: Validações
- Implementar validações síncronas
- Implementar validações assíncronas
- Mostrar mensagens de erro

### Fase 3: Comportamento
- Implementar campos condicionais
- Implementar listas dinâmicas
- Implementar integrações

### Fase 4: Refinamento
- Melhorar UX
- Adicionar tooltips
- Testar responsividade

---

## Status de Implementação

Use esta checklist:

- [ ] STEP 1 - Identificação
- [ ] STEP 2 - Classificação
- [ ] STEP 3 - Características
- [ ] STEP 4 - Parâmetros Cota
- [ ] STEP 5 - Taxas
- [ ] STEP 6 - Prazos
- [ ] STEP 7 - Classes (opcional)
- [ ] STEP 8 - Vínculos
- [ ] STEP 9 - Documentos (opcional)
- [ ] STEP 10 - Revisão

---

## Referências

Para implementar cada etapa, consulte:
- Especificação original: `/mnt/project/Especificacao_Modulo_Cadastro_Fundos.md`
- Data models: `WIZARD_SPEC_14_DATA_MODELS.md`
- Validações: `WIZARD_SPEC_13_VALIDATION.md`
- UX guidelines: `WIZARD_SPEC_16_USER_EXPERIENCE.md`

---

**Nota**: Os documentos individuais de cada etapa (03-12) devem ser criados conforme necessário durante a implementação, seguindo o template acima.

---

**Status**: 📋 Template de Especificação  
**Versão**: 1.0
