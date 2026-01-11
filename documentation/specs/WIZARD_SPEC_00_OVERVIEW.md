# WIZARD_SPEC_00 - Visão Geral do Wizard de Cadastro de Fundos

## 1. Objetivo

Criar uma interface guiada (wizard) de 10 etapas para cadastro de fundos de investimento, permitindo que usuários registrem todas as informações necessárias de forma progressiva e validada.

---

## 2. Contexto

O sistema Fund Accounting precisa de um cadastro completo de fundos de investimento para possibilitar o cálculo de cotas, gestão de carteira e relatórios regulatórios. O wizard simplifica esse processo complexo dividindo-o em etapas menores e focadas.

---

## 3. Usuários-Alvo

- **Operadores de fundos**: Cadastram fundos no dia-a-dia
- **Gestoras de pequeno/médio porte**: 5-50 fundos sob gestão
- **Back office**: Manutenção de cadastros existentes

**Persona Principal:**
- Experiência média com sistemas financeiros
- Precisa cadastrar fundos rapidamente
- Pode precisar fazer cadastro em múltiplas sessões
- Nem sempre tem todos os dados disponíveis de imediato

---

## 4. Requisitos Funcionais

### RF001 - Wizard de 10 Etapas
O sistema deve apresentar um fluxo guiado de 10 etapas sequenciais para cadastro de fundos.

### RF002 - Navegação Progressiva
O usuário deve poder:
- Avançar para próxima etapa (se atual estiver válida)
- Voltar para etapas anteriores a qualquer momento
- Saltar para etapas já completadas
- Cancelar o cadastro a qualquer momento

### RF003 - Validação por Etapa
Cada etapa deve validar seus campos antes de permitir avanço.

### RF004 - Persistência de Estado
O sistema deve manter em memória todos os dados digitados durante a navegação entre etapas.

### RF005 - Etapas Opcionais
Etapas 7 (Classes) e 9 (Documentos) são opcionais e podem ser puladas.

### RF006 - Salvamento Final
Ao finalizar a Etapa 10, todos os dados devem ser enviados para API em uma única requisição.

### RF007 - Indicador de Progresso
O sistema deve mostrar visualmente:
- Quantas etapas foram completadas
- Qual etapa está ativa
- Percentual de conclusão

### RF008 - Campos Condicionais
Alguns campos só aparecem baseado em valores de outros campos.

### RF009 - Integrações
O wizard deve integrar com:
- Módulo de Indexadores (Etapa 5 - Taxas)
- Módulo de Calendário (Etapa 6 - Prazos)
- API de verificação de CNPJ (Etapa 1)

### RF010 - Feedback ao Usuário
O sistema deve fornecer feedback claro sobre:
- Validações (sucesso/erro)
- Salvamento em progresso
- Sucesso ao finalizar
- Erros de API

---

## 5. Requisitos Não-Funcionais

### RNF001 - Performance
- Navegação entre etapas: instantânea (<100ms)
- Validações síncronas: <100ms
- Validações assíncronas (CNPJ): <2s
- Salvamento final: <5s

### RNF002 - Usabilidade
- Interface intuitiva para usuários não técnicos
- Campos organizados de forma lógica
- Labels claros e descritivos
- Mensagens de erro compreensíveis

### RNF003 - Responsividade
- Funcional em desktop (1920x1080)
- Funcional em tablets (768x1024)
- Utilizável em mobile (375x667) - mínimo

### RNF004 - Acessibilidade
- Navegável por teclado (Tab, Enter, Esc)
- Compatível com screen readers
- Contraste adequado (WCAG 2.1 AA)

### RNF005 - Compatibilidade
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 6. Visão Geral das 10 Etapas

### Etapa 1: Identificação
**Objetivo**: Capturar informações básicas do fundo  
**Campos principais**: CNPJ, Razão Social, Nome Fantasia, Tipo Fundo  
**Obrigatória**: ✅ Sim  
**Validação crítica**: CNPJ único no sistema

### Etapa 2: Classificação
**Objetivo**: Definir classificações regulatórias  
**Campos principais**: CVM, ANBIMA, Público Alvo, Tributação  
**Obrigatória**: ✅ Sim  
**Validação crítica**: Público alvo compatível com tipo fundo

### Etapa 3: Características
**Objetivo**: Configurar características operacionais  
**Campos principais**: Condomínio, Prazo, Alavancagem, Criptoativos  
**Obrigatória**: ✅ Sim  
**Validação crítica**: Se prazo determinado, data encerramento obrigatória

### Etapa 4: Parâmetros de Cota
**Objetivo**: Definir regras de cálculo da cota  
**Campos principais**: Casas decimais, Horário corte, Cota inicial  
**Obrigatória**: ✅ Sim  
**Validação crítica**: Casas decimais entre limites válidos

### Etapa 5: Taxas
**Objetivo**: Cadastrar taxas do fundo  
**Campos principais**: Lista de taxas (Administração, Gestão, Performance)  
**Obrigatória**: ✅ Sim (pelo menos uma taxa)  
**Validação crítica**: Taxa de performance requer benchmark  
**Integração**: Módulo de Indexadores

### Etapa 6: Prazos
**Objetivo**: Definir prazos de aplicação e resgate  
**Campos principais**: Cotização, Liquidação, Valores mínimos  
**Obrigatória**: ✅ Sim  
**Validação crítica**: Liquidação >= Cotização  
**Integração**: Módulo de Calendário

### Etapa 7: Classes e Subclasses
**Objetivo**: Estrutura multiclasse CVM 175  
**Campos principais**: Hierarquia de classes (até 2 níveis)  
**Obrigatória**: ❌ Não (opcional)  
**Validação crítica**: Subclasse não pode ter subclasse  
**Especificidade**: Importante para FIDCs

### Etapa 8: Vínculos Institucionais
**Objetivo**: Registrar prestadores de serviço  
**Campos principais**: Administrador, Gestor, Custodiante  
**Obrigatória**: ✅ Sim (mínimo 3 vínculos)  
**Validação crítica**: Deve ter Administrador, Gestor e Custodiante

### Etapa 9: Documentos
**Objetivo**: Upload de documentos regulatórios  
**Campos principais**: Regulamento, Lâmina, etc.  
**Obrigatória**: ❌ Não (opcional)  
**Validação crítica**: Arquivo PDF, máximo 10MB

### Etapa 10: Revisão
**Objetivo**: Revisar todos os dados antes de salvar  
**Campos principais**: Resumo consolidado, editar etapas  
**Obrigatória**: ✅ Sim (finalização)  
**Validação crítica**: Todas etapas obrigatórias completas

---

## 7. Fluxo de Navegação

```
[Início] → [Etapa 1] → [Etapa 2] → [Etapa 3] → [Etapa 4] → [Etapa 5] 
           ↓           ↓           ↓           ↓           ↓
        [Voltar]    [Voltar]    [Voltar]    [Voltar]    [Voltar]
           ↓           ↓           ↓           ↓           ↓
        [Cancelar]  [Cancelar]  [Cancelar]  [Cancelar]  [Cancelar]

→ [Etapa 6] → [Etapa 7*] → [Etapa 8] → [Etapa 9*] → [Etapa 10] → [Fim]
     ↓           ↓            ↓           ↓            ↓
  [Voltar]    [Pular]      [Voltar]    [Pular]     [Finalizar]
     ↓           ↓            ↓           ↓            ↓
  [Cancelar]  [Cancelar]   [Cancelar]  [Cancelar]  [Sucesso!]

* Etapas opcionais
```

---

## 8. Regras de Negócio Globais

### RN001 - Unicidade de CNPJ
Não pode haver dois fundos com mesmo CNPJ no sistema.

### RN002 - Etapas Obrigatórias
Etapas 1, 2, 3, 4, 5, 6, 8, 10 são obrigatórias.

### RN003 - Ordem de Preenchimento
Usuário pode voltar mas não pular etapas incompletas.

### RN004 - Validação Progressiva
Cada etapa valida apenas seus próprios campos.

### RN005 - Salvamento Atômico
Dados só são persistidos ao finalizar Etapa 10 (tudo ou nada).

### RN006 - Dados em Memória
Durante navegação, dados ficam apenas em memória (não no backend).

### RN007 - Confirmação de Cancelamento
Ao cancelar, sistema deve confirmar se usuário quer descartar dados.

### RN008 - Campos Condicionais
Campos que dependem de outros só validam se estiverem visíveis.

### RN009 - Listas Dinâmicas
Etapas 5 (Taxas), 7 (Classes), 8 (Vínculos), 9 (Documentos) permitem adicionar/remover itens.

### RN010 - Integração com Indexadores
Lista de benchmarks vem do módulo de Indexadores (apenas ativos).

---

## 9. Comportamentos Esperados

### Ao Abrir o Wizard
1. Exibir Etapa 1 (Identificação)
2. Barra de progresso mostra 0% completo
3. Botão "Voltar" desabilitado
4. Botão "Próximo" habilitado

### Durante Navegação
1. Ao clicar "Próximo": validar etapa atual
2. Se válida: avançar e marcar etapa como completa
3. Se inválida: mostrar erros e impedir avanço
4. Ao clicar "Voltar": retornar sem validar
5. Ao clicar etapa completa na barra: navegar direto

### Ao Cancelar
1. Confirmar se usuário quer descartar dados
2. Se sim: limpar dados e voltar para lista de fundos
3. Se não: permanecer no wizard

### Ao Finalizar
1. Validar que etapas obrigatórias estão completas
2. Mostrar loading durante salvamento
3. Se sucesso: redirecionar para detalhes do fundo
4. Se erro: mostrar mensagem e permitir retry

---

## 10. Dependências

### Módulos do Sistema
- ✅ **Indexadores**: Já implementado (lista de benchmarks)
- ✅ **Calendário**: Já implementado (cálculo D+X)

### APIs Externas
- Validação de CNPJ (verificar duplicidade)
- Autocomplete de instituições (opcional)

### Bibliotecas
- Angular 21 (framework)
- Bootstrap 5 (UI)
- ng-bootstrap (componentes)
- ngx-mask (máscaras CNPJ, etc)
- ngx-currency (campos monetários)
- date-fns (manipulação datas)

---

## 11. Mensagens ao Usuário

### Sucesso
- "Cadastro concluído com sucesso!"
- "Fundo [Nome] foi criado"

### Erros
- "CNPJ já cadastrado no sistema"
- "Preencha todos os campos obrigatórios"
- "Erro ao salvar. Tente novamente"
- "Data de encerramento deve ser maior que data de constituição"

### Avisos
- "Esta etapa é opcional. Você pode pular"
- "Algumas informações ainda não foram preenchidas"
- "Deseja realmente cancelar o cadastro?"

### Informações
- "Preencha os dados de identificação do fundo"
- "Você pode voltar e editar etapas anteriores"
- "Revise todos os dados antes de finalizar"

---

## 12. Critérios de Aceitação

### CA001 - Navegação
- [ ] Usuário consegue avançar entre etapas
- [ ] Usuário consegue voltar para etapas anteriores
- [ ] Usuário consegue clicar em etapas completas
- [ ] Botão "Próximo" desabilitado se etapa inválida

### CA002 - Validação
- [ ] Campos obrigatórios marcados com asterisco
- [ ] Mensagens de erro aparecem ao lado do campo
- [ ] Validações acontecem em tempo real
- [ ] CNPJ duplicado impede avanço

### CA003 - Persistência
- [ ] Dados digitados persistem ao navegar entre etapas
- [ ] Dados não são perdidos ao voltar
- [ ] Dados são limpos ao cancelar

### CA004 - Visual
- [ ] Barra de progresso atualiza corretamente
- [ ] Etapas completas mostram ícone de check
- [ ] Etapa atual destacada visualmente
- [ ] Percentual de conclusão correto

### CA005 - Salvamento
- [ ] Ao finalizar, todos dados são enviados para API
- [ ] Loading aparece durante salvamento
- [ ] Sucesso redireciona para detalhes
- [ ] Erro mostra mensagem clara

---

## 13. Fora do Escopo

❌ Edição de fundos existentes (será outra feature)  
❌ Exclusão de fundos (será outra feature)  
❌ Duplicação de fundos (será outra feature)  
❌ Importação em lote (será outra feature)  
❌ Salvamento parcial (rascunho)  
❌ Histórico de alterações  
❌ Aprovação de cadastro (workflow)  
❌ Notificações por email  

---

## 14. Próximos Passos

Após ler este documento, proceda para:

1. **[WIZARD_SPEC_01_ARCHITECTURE.md]** - Entender estrutura de componentes
2. **[WIZARD_SPEC_02_PROGRESS_BAR.md]** - Implementar barra de progresso
3. **[WIZARD_SPEC_03_STEP_01_IDENTIFICACAO.md]** - Primeira etapa

---

## 15. Referências

- Especificação completa original: `/mnt/project/Especificacao_Modulo_Cadastro_Fundos.md`
- Resolução CVM 175/2022 (multiclasse)
- Instrução CVM 577/2016 (plano contábil)

---

**Status**: 📋 Especificação Funcional  
**Versão**: 1.0  
**Implementação**: Aguardando início
