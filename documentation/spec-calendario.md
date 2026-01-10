# Especificação de Feature: Calendário

## Visão Geral

O módulo de Calendário é uma interface de cadastro para gerenciamento de dias úteis e feriados do mercado financeiro brasileiro. Permite criar, visualizar, editar e excluir entradas de calendário com suporte a múltiplas praças (mercados) e tipos de dias.

---

## Estrutura de Navegação

```
/cadastro/calendario           → Lista de calendários (tela principal)
/cadastro/calendario/new       → Formulário de criação
/cadastro/calendario/:id/edit  → Formulário de edição
```

**Breadcrumbs:**
- Início > Cadastro > Calendário (lista)
- Início > Cadastro > Calendário > Novo (criação)
- Início > Cadastro > Calendário > Editar (edição)

---

## Tela Principal: Lista de Calendários

### Layout Geral

A tela é dividida em 5 seções verticais:

```
┌─────────────────────────────────────────────────────────────┐
│  CABEÇALHO DA PÁGINA                                        │
│  [Título] [Botão Atualizar] [Botão Novo]                    │
├─────────────────────────────────────────────────────────────┤
│  BARRA DE PRESETS (Filtros Rápidos)                         │
│  PRESETS: [Preset 1] [Preset 2] [Preset 3] [Preset 4] ...   │
├─────────────────────────────────────────────────────────────┤
│  BARRA DE FILTROS                                           │
│  [Busca] [Praça ▼] [Tipo ▼] [Dia Útil ▼] [Período ▼] [Limpar]│
├─────────────────────────────────────────────────────────────┤
│  FILTROS ATIVOS (Pills)                                     │
│  [Praça: Nacional ×] [Tipo: Feriado ×] [Período: 01/01...×] │
├─────────────────────────────────────────────────────────────┤
│  GRADE DE DADOS (AG Grid)                                   │
│  ┌────────┬────────┬───────────┬─────────┬──────────┬─────┐ │
│  │ Data   │ Praça  │ Tipo Dia  │ Dia Útil│ Descrição│ Ações│ │
│  ├────────┼────────┼───────────┼─────────┼──────────┼─────┤ │
│  │ ...    │ ...    │ ...       │ ...     │ ...      │ ... │ │
│  └────────┴────────┴───────────┴─────────┴──────────┴─────┘ │
├─────────────────────────────────────────────────────────────┤
│  BARRA DE STATUS                                            │
│  ● READY | Total: 365 registros | Carregados: 100 (27%)     │
└─────────────────────────────────────────────────────────────┘
```

---

### 1. Cabeçalho da Página

| Elemento | Descrição |
|----------|-----------|
| Título | "Calendário" - título principal da página |
| Botão Atualizar | Ícone de refresh - recarrega os dados da grade |
| Botão Novo | "Novo" com ícone + - navega para formulário de criação |

---

### 2. Barra de Presets (Filtros Rápidos)

Linha de chips clicáveis para aplicar filtros pré-configurados rapidamente.

**Presets Disponíveis:**

| Preset | Ícone | Filtros Aplicados |
|--------|-------|-------------------|
| Feriados Nacionais | 🇧🇷 | Praça: Nacional, Tipo: Feriado Nacional, Período: Ano atual |
| Feriados EUA | 🇺🇸 | Praça: Exterior EUA, Tipo: Feriado Nacional, Período: Ano atual |
| Feriados Europa | 🇪🇺 | Praça: Exterior EUR, Tipo: Feriado Nacional, Período: Ano atual |
| Feriados Nacionais 30d | 📅 | Praça: Nacional, Tipo: Feriado Nacional, Período: Próximos 30 dias |
| Feriados Bancários 30d | 🏦 | Praça: Nacional, Tipo: Feriado Bancário, Período: Próximos 30 dias |

**Comportamento:**
- Clicar em um preset ativa-o e aplica seus filtros
- Clicar no preset ativo desativa-o e limpa os filtros
- Modificar filtros manualmente desativa o preset ativo
- Preset ativo é destacado visualmente (cor âmbar/dourada)
- Preset ativo persiste entre sessões (salvo no navegador)

---

### 3. Barra de Filtros

Linha de controles para filtragem manual dos dados.

| Controle | Tipo | Opções | Comportamento |
|----------|------|--------|---------------|
| Busca | Campo de texto | - | Busca por descrição, filtra em tempo real |
| Praça | Dropdown | Nacional, São Paulo, Rio de Janeiro, Exterior EUA, Exterior EUR | Filtro único |
| Tipo de Dia | Dropdown | Útil, Feriado Nacional, Feriado Estadual, Feriado Municipal, Feriado Bancário, Fim de Semana, Ponto Facultativo | Filtro único |
| Dia Útil | Dropdown | Sim, Não | Filtro único |
| Período | Seletor de data | Calendário duplo | Seleciona intervalo de datas |
| Limpar | Botão | - | Remove todos os filtros ativos |

**Seletor de Período:**
- Exibe dois meses lado a lado
- Permite selecionar data inicial e final
- Mostra intervalo selecionado visualmente
- Idioma em português (dias da semana, meses)

---

### 4. Filtros Ativos (Pills)

Exibe os filtros aplicados como tags removíveis.

**Formato:** `[Nome do Filtro: Valor ×]`

**Exemplos:**
- `Praça: Nacional ×`
- `Tipo: Feriado Nacional ×`
- `Dia Útil: Sim ×`
- `Período: 01/01/2025 - 31/12/2025 ×`
- `Busca: "carnaval" ×`

**Comportamento:**
- Clicar no × remove apenas aquele filtro
- Pills aparecem com animação suave
- Seção fica oculta quando não há filtros ativos

---

### 5. Grade de Dados

Tabela interativa com scroll infinito (carrega mais dados ao rolar).

**Colunas:**

| Coluna | Largura | Alinhamento | Formato | Ordenável |
|--------|---------|-------------|---------|-----------|
| Data | 110px | Centro | dd/MM/yyyy | Sim |
| Praça | 130px | Esquerda | Texto | Sim |
| Tipo de Dia | 150px | Esquerda | Texto | Sim |
| Dia Útil | 110px | Centro | Badge (Sim/Não) | Sim |
| Descrição | Flexível | Esquerda | Texto ou "-" se vazio | Sim |
| Ações | 80px | Centro | Botões | Não |

**Coluna Dia Útil - Badges:**
- "Sim" → Badge verde
- "Não" → Badge vermelho

**Coluna Ações:**
- Botão Editar (ícone lápis) → Navega para edição
- Botão Excluir (ícone lixeira) → Abre modal de confirmação

**Comportamento da Grade:**
- Ordenação por coluna clicável (uma coluna por vez)
- Scroll infinito carrega blocos de 50 registros
- Indicador de carregamento durante requisição
- Ordenação padrão: Data (decrescente)

---

### 6. Barra de Status

Exibe informações de paginação e estado do carregamento.

**Formato:** `● STATUS | Total: X registros | Carregados: Y (Z%)`

**Estados:**
- ● READY (verde) - Dados carregados
- ● LOADING (azul, pulsando) - Carregando dados

**Exemplo:** `● READY | Total: 365 registros | Carregados: 100 (27%)`

---

## Tela de Criação: Novo Calendário

### Layout

```
┌─────────────────────────────────────────┐
│  CABEÇALHO: Novo Calendário             │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │  FORMULÁRIO                         ││
│  │                                     ││
│  │  Data*         [Seletor de Data]    ││
│  │  Praça*        [Dropdown ▼]         ││
│  │  Tipo de Dia*  [Dropdown ▼]         ││
│  │  Descrição     [Campo de Texto]     ││
│  │                                     ││
│  │  [Cancelar]  [Salvar]               ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Campos do Formulário

| Campo | Tipo | Obrigatório | Validação | Observações |
|-------|------|-------------|-----------|-------------|
| Data | Seletor de data | Sim | Data válida | Calendário visual |
| Praça | Dropdown | Sim | Seleção obrigatória | Nacional, SP, RJ, EUA, EUR |
| Tipo de Dia | Dropdown | Sim | Seleção obrigatória | 7 opções disponíveis |
| Descrição | Texto | Não | Máximo 100 caracteres | Campo livre |

### Opções de Praça

| Valor | Descrição |
|-------|-----------|
| Nacional | Mercado nacional brasileiro |
| São Paulo | Praça de São Paulo |
| Rio de Janeiro | Praça do Rio de Janeiro |
| Exterior EUA | Mercado americano |
| Exterior EUR | Mercado europeu |

### Opções de Tipo de Dia

| Valor | Descrição | É Dia Útil? |
|-------|-----------|-------------|
| Útil | Dia útil normal | Sim |
| Feriado Nacional | Feriado nacional | Não |
| Feriado Estadual | Feriado estadual | Não |
| Feriado Municipal | Feriado municipal | Não |
| Feriado Bancário | Feriado bancário (ANBIMA) | Não |
| Fim de Semana | Sábado ou domingo | Não |
| Ponto Facultativo | Ponto facultativo | Sim |

### Ações

| Botão | Comportamento |
|-------|---------------|
| Cancelar | Retorna à lista sem salvar |
| Salvar | Valida e cria o registro, exibe notificação de sucesso, retorna à lista |

### Mensagens

- **Sucesso:** "Calendário criado com sucesso!"
- **Erro de validação:** Mensagens inline nos campos
- **Erro de servidor:** "Erro ao criar calendário. Tente novamente."

---

## Tela de Edição: Editar Calendário

### Layout

Idêntico à tela de criação, com diferenças nos campos.

### Campos do Formulário

| Campo | Tipo | Obrigatório | Editável | Observações |
|-------|------|-------------|----------|-------------|
| Data | Seletor de data | Sim | **Não** | Exibido desabilitado |
| Praça | Dropdown | Sim | **Não** | Exibido desabilitado |
| Tipo de Dia | Dropdown | Sim | **Sim** | Pode ser alterado |
| Descrição | Texto | Não | **Sim** | Pode ser alterado |

**Nota:** Data e Praça são campos-chave e não podem ser editados. Para alterar esses valores, é necessário excluir o registro e criar um novo.

### Ações

| Botão | Comportamento |
|-------|---------------|
| Cancelar | Retorna à lista sem salvar |
| Salvar | Valida e atualiza o registro, exibe notificação de sucesso, retorna à lista |

### Mensagens

- **Sucesso:** "Calendário atualizado com sucesso!"
- **Erro:** "Erro ao atualizar calendário. Tente novamente."

---

## Modal de Exclusão

### Layout

```
┌─────────────────────────────────────────┐
│  ⚠️ Confirmar Exclusão                  │
├─────────────────────────────────────────┤
│                                         │
│  Deseja realmente excluir este          │
│  calendário?                            │
│                                         │
│  Data: 25/12/2025                       │
│  Praça: Nacional                        │
│  Tipo: Feriado Nacional                 │
│  Descrição: Natal                       │
│                                         │
│  ⚠️ Esta ação não pode ser desfeita.    │
│                                         │
│  [Cancelar]  [Excluir]                  │
└─────────────────────────────────────────┘
```

### Comportamento

- Exibe os detalhes do registro a ser excluído
- Requer confirmação explícita
- Botão Excluir em vermelho (destaque de perigo)
- Tecla ESC fecha o modal sem excluir
- Após exclusão, atualiza a grade automaticamente

### Mensagens

- **Sucesso:** "Calendário excluído com sucesso!"
- **Erro:** "Erro ao excluir calendário. Tente novamente."

---

## Persistência de Estado

### Entre Navegações (Sessão)

Os seguintes estados são preservados quando o usuário navega para criar/editar e volta:
- Termo de busca
- Filtros selecionados
- Coluna e direção de ordenação

### Entre Sessões (Permanente)

Os seguintes estados são preservados mesmo após fechar o navegador:
- Preset ativo selecionado

---

## Notificações (Toasts)

Todas as operações exibem notificações temporárias no canto inferior direito.

| Tipo | Cor | Duração | Exemplo |
|------|-----|---------|---------|
| Sucesso | Verde | 5 segundos | "Calendário criado com sucesso!" |
| Erro | Vermelho | 8 segundos | "Erro ao criar calendário. Tente novamente." |
| Aviso | Amarelo | 6 segundos | "Filtros aplicados" |

---

## Estilo Visual

### Tema Geral

- Suporte a modo claro e escuro
- Estilo inspirado em terminal Bloomberg
- Cores de destaque: Âmbar (#FFA028 escuro / #B45309 claro)

### Cards

- Fundo semi-transparente
- Bordas arredondadas (rounded-4)
- Sombra suave (shadow-sm)

### Grade

- Cabeçalhos em maiúsculas
- Fonte monoespaçada para números
- Hover com transição suave
- Scroll estilizado

### Presets

- Chips com ícones de bandeira/emoji
- Estado ativo com destaque colorido
- Hover com elevação

---

## Fluxos de Usuário

### Fluxo: Visualizar Feriados Nacionais

1. Usuário acessa a tela de lista
2. Clica no preset "Feriados Nacionais"
3. Grade é filtrada automaticamente
4. Barra de status mostra total de registros

### Fluxo: Buscar Feriado Específico

1. Usuário digita "carnaval" no campo de busca
2. Grade filtra em tempo real
3. Pill de filtro "Busca: carnaval" aparece
4. Usuário pode remover clicando no ×

### Fluxo: Criar Novo Feriado

1. Usuário clica em "Novo"
2. Preenche data, praça, tipo e descrição
3. Clica em "Salvar"
4. Sistema valida os campos
5. Se válido, cria registro e retorna à lista
6. Toast de sucesso é exibido

### Fluxo: Editar Feriado

1. Usuário clica no ícone de edição na grade
2. Formulário abre com campos preenchidos
3. Data e Praça aparecem desabilitados
4. Usuário modifica Tipo e/ou Descrição
5. Clica em "Salvar"
6. Sistema atualiza e retorna à lista

### Fluxo: Excluir Feriado

1. Usuário clica no ícone de lixeira na grade
2. Modal de confirmação abre
3. Exibe detalhes do registro
4. Usuário clica em "Excluir"
5. Sistema remove o registro
6. Grade é atualizada automaticamente
7. Toast de sucesso é exibido

---

## Resumo de Componentes

| Componente | Função |
|------------|--------|
| Lista | Tela principal com grade e filtros |
| Barra de Presets | Filtros rápidos pré-configurados |
| Barra de Filtros | Controles de filtro manual |
| Pills de Filtro | Exibição/remoção de filtros ativos |
| Grade de Dados | Tabela com scroll infinito |
| Barra de Status | Informações de paginação |
| Formulário | Criação e edição de registros |
| Modal de Exclusão | Confirmação de exclusão |

---

## Dados de Referência

### Endpoints da API

| Operação | Método | Endpoint |
|----------|--------|----------|
| Listar | GET | /api/v1/calendario |
| Buscar por ID | GET | /api/v1/calendario/{id} |
| Criar | POST | /api/v1/calendario |
| Atualizar | PUT | /api/v1/calendario/{id} |
| Excluir | DELETE | /api/v1/calendario/{id} |

### Parâmetros de Listagem

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| limit | number | Registros por página (padrão: 50) |
| offset | number | Posição inicial |
| sortBy | string | Coluna de ordenação |
| sortDirection | string | asc ou desc |
| search | string | Termo de busca |
| praca | number | ID da praça |
| tipoDia | number | ID do tipo de dia |
| diaUtil | boolean | Filtro de dia útil |
| dataInicio | string | Data inicial (yyyy-MM-dd) |
| dataFim | string | Data final (yyyy-MM-dd) |
