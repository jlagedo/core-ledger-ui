# WIZARD_SPEC_02 - Barra de Progresso

## 1. Objetivo

Criar um componente visual que mostre o progresso do usuário através das 10 etapas do wizard, permitindo navegação e fornecendo feedback claro sobre o status de cada etapa.

---

## 2. Requisitos Funcionais

### RF001 - Indicador Visual de Progresso
A barra deve mostrar visualmente quantas etapas foram completadas.

### RF002 - Percentual de Conclusão
A barra deve exibir percentual numérico de conclusão (0-100%).

### RF003 - Status de Cada Etapa
Cada etapa deve ter indicador visual de seu status:
- **Completa**: Ícone de check, cor de sucesso
- **Atual**: Ícone de seta, cor destacada
- **Pendente**: Ícone vazio, cor neutra

### RF004 - Labels das Etapas
Cada etapa deve mostrar seu nome abreviado.

### RF005 - Navegação por Clique
Usuário pode clicar em etapas completas para navegar diretamente.

### RF006 - Etapas Não Clicáveis
Etapas pendentes e futura não devem ser clicáveis.

### RF007 - Responsividade
Em telas pequenas, mostrar versão compacta.

---

## 3. Estados Visuais

### Etapa Completa ✅
- **Ícone**: Check (✓)
- **Cor**: Verde (success)
- **Comportamento**: Clicável
- **Tooltip**: "Concluída - clique para editar"

### Etapa Atual ➡️
- **Ícone**: Seta (→)
- **Cor**: Azul (primary)
- **Comportamento**: Não clicável (já está nela)
- **Tooltip**: "Etapa atual"
- **Destaque**: Negrito, maior

### Etapa Pendente ⭕
- **Ícone**: Círculo vazio (○)
- **Cor**: Cinza (secondary)
- **Comportamento**: Não clicável
- **Tooltip**: "Pendente"

---

## 4. Estrutura Visual

### Desktop (>992px)

```
[====================================--------] 78%

 ✓           ✓           ✓           ✓           ✓        
Ident.   Classif.    Caract.     Cota       Taxas    

 ✓          →           ○           ○           ○        
Prazos   Classes    Vínculos    Docs      Revisão
```

### Tablet (768-992px)

```
[====================================--------] 78%

 ✓      ✓      ✓      ✓      ✓      ✓      →      ○      ○      ○
  1      2      3      4      5      6      7      8      9     10
```

### Mobile (<768px)

```
[==================--------] 78%

Etapa 7 de 10: Classes
```

---

## 5. Cálculo do Progresso

### Percentual

```
Percentual = (Etapas Completas / Total de Etapas) * 100
```

**Exemplo:**
- Total: 10 etapas
- Completas: 6 etapas
- Percentual: 60%

### Etapas Opcionais

Etapas 7 (Classes) e 9 (Documentos) são opcionais mas contam no percentual.

Se usuário pular:
- Marcar como "pulada" (visualmente similar a completa)
- Contar no percentual

---

## 6. Interações

### Hover sobre Etapa Completa
- Cursor muda para pointer
- Etapa se destaca (subtle highlight)
- Tooltip aparece

### Clique em Etapa Completa
1. Emitir evento `stepClicked` com número da etapa
2. Componente pai navega para etapa clicada
3. Barra atualiza estado visual

### Hover sobre Etapa Pendente
- Cursor permanece default
- Tooltip aparece explicando que não pode acessar

### Clique em Etapa Atual
- Nenhuma ação (já está nesta etapa)

---

## 7. Dados Necessários

### Inputs do Componente

```typescript
@Input() currentStep: number;           // 1-10
@Input() totalSteps: number = 10;       // Sempre 10
@Input() completedSteps: Set<number>;   // {1, 2, 3, 4}
@Input() skippedSteps: Set<number>;     // {7, 9}
```

### Outputs do Componente

```typescript
@Output() stepClicked = new EventEmitter<number>();
```

### Labels das Etapas

```typescript
const stepLabels = [
  { step: 1, short: 'Ident.', full: 'Identificação' },
  { step: 2, short: 'Classif.', full: 'Classificação' },
  { step: 3, short: 'Caract.', full: 'Características' },
  { step: 4, short: 'Cota', full: 'Parâmetros de Cota' },
  { step: 5, short: 'Taxas', full: 'Taxas' },
  { step: 6, short: 'Prazos', full: 'Prazos' },
  { step: 7, short: 'Classes', full: 'Classes e Subclasses' },
  { step: 8, short: 'Vínculos', full: 'Vínculos Institucionais' },
  { step: 9, short: 'Docs', full: 'Documentos' },
  { step: 10, short: 'Revisão', full: 'Revisão' }
];
```

---

## 8. Comportamento Responsivo

### Desktop (>992px)
- Mostrar todas etapas em linha única
- Labels abreviados
- Ícones grandes
- Barra de progresso Bootstrap padrão

### Tablet (768-992px)
- Mostrar todas etapas em linha única
- Apenas números (sem labels)
- Ícones médios
- Pode quebrar em 2 linhas se necessário

### Mobile (<768px)
- Mostrar apenas:
  - Barra de progresso
  - Percentual
  - Texto: "Etapa X de 10: [Nome]"
- Não mostrar todos os ícones (economizar espaço)

---

## 9. Acessibilidade

### Navegação por Teclado
- Etapas completas devem ser focáveis (tabindex=0)
- Enter/Space para navegar
- Setas esquerda/direita para navegar entre etapas

### ARIA Labels

```html
<div role="progressbar" 
     aria-valuenow="7" 
     aria-valuemin="1" 
     aria-valuemax="10"
     aria-label="Progresso do cadastro: etapa 7 de 10">
```

### Screen Readers
- Anunciar quando etapa muda
- Anunciar status de cada etapa ao focar

---

## 10. Mensagens de Tooltip

### Etapa Completa
```
"Etapa 1: Identificação - Concluída
Clique para editar"
```

### Etapa Atual
```
"Etapa 7: Classes - Etapa atual"
```

### Etapa Pendente
```
"Etapa 9: Documentos - Pendente
Complete as etapas anteriores primeiro"
```

### Etapa Pulada (Opcional)
```
"Etapa 7: Classes - Pulada
Esta etapa é opcional"
```

---

## 11. Animações

### Ao Completar Etapa
- Ícone muda de pendente para check
- Breve animação de "pop" ou "slide"
- Transição suave de cor

### Ao Navegar
- Barra de progresso anima suavemente
- Percentual conta progressivamente

### Performance
- Usar CSS transitions (não JavaScript)
- Duração: 300ms
- Easing: ease-in-out

---

## 12. Temas e Cores

### Cores Principais

| Estado | Bootstrap Class | Hex |
|--------|----------------|-----|
| Completa | `.text-success` | #198754 |
| Atual | `.text-primary` | #0d6efd |
| Pendente | `.text-secondary` | #6c757d |
| Pulada | `.text-info` | #0dcaf0 |

### Barra de Progresso

| Elemento | Bootstrap Class |
|----------|----------------|
| Container | `.progress` |
| Barra | `.progress-bar .bg-primary` |

---

## 13. Exemplo de Uso

### No Template do Wizard Container

```html
<app-progress-bar
  [currentStep]="currentStep"
  [totalSteps]="10"
  [completedSteps]="completedSteps"
  [skippedSteps]="skippedSteps"
  (stepClicked)="goToStep($event)">
</app-progress-bar>
```

### No Component do Wizard Container

```typescript
completedSteps = new Set<number>();
skippedSteps = new Set<number>();
currentStep = 1;

goToStep(step: number): void {
  if (this.completedSteps.has(step)) {
    this.currentStep = step;
  }
}

markStepComplete(): void {
  this.completedSteps.add(this.currentStep);
}

skipOptionalStep(): void {
  this.skippedSteps.add(this.currentStep);
  this.completedSteps.add(this.currentStep);
  this.nextStep();
}
```

---

## 14. Casos Especiais

### Etapas Opcionais Puladas

Se usuário pular etapas 7 ou 9:
- Marcar visualmente como "pulada" (ícone diferente)
- Contar como completa no percentual
- Permitir voltar para preencher depois

### Regressão de Etapa

Se usuário voltar e alterar campo crítico:
- Não desmarcar etapas subsequentes como incompletas
- Apenas re-validar a etapa alterada

### Erro em Etapa

Se etapa tem erro de validação:
- Não impedir visualização na barra
- Adicionar indicador visual de erro (ex: exclamation)

---

## 15. Critérios de Aceitação

### Visual
- [ ] Barra de progresso Bootstrap renderiza corretamente
- [ ] Percentual exibido está correto
- [ ] Ícones de estado corretos (check, seta, círculo)
- [ ] Labels visíveis em desktop
- [ ] Cores corretas para cada estado

### Interação
- [ ] Clicar em etapa completa navega para ela
- [ ] Clicar em etapa pendente não faz nada
- [ ] Hover mostra cursor pointer apenas em etapas clicáveis
- [ ] Tooltips aparecem ao hover

### Responsividade
- [ ] Layout adapta em tablet (apenas números)
- [ ] Layout adapta em mobile (texto + barra)
- [ ] Não quebra em telas pequenas

### Acessibilidade
- [ ] Navegável por teclado
- [ ] ARIA labels presentes
- [ ] Screen reader anuncia mudanças

### Funcional
- [ ] Percentual calcula corretamente
- [ ] Etapas completadas persistem ao navegar
- [ ] Evento stepClicked emite corretamente

---

## 16. Exemplo de Estados

### Início (Etapa 1)

```
[----------] 0%
→ Ident.  ○ Classif.  ○ Caract.  ○ Cota  ○ Taxas
○ Prazos  ○ Classes   ○ Vínculos ○ Docs  ○ Revisão
```

### Meio (Etapa 6)

```
[===========================] 50%
✓ Ident.  ✓ Classif.  ✓ Caract.  ✓ Cota  ✓ Taxas
→ Prazos  ○ Classes   ○ Vínculos ○ Docs  ○ Revisão
```

### Pulou Etapa 7 (Etapa 8)

```
[====================================] 70%
✓ Ident.  ✓ Classif.  ✓ Caract.  ✓ Cota  ✓ Taxas
✓ Prazos  ~ Classes   → Vínculos ○ Docs  ○ Revisão

Legenda: ~ = Pulada (opcional)
```

### Final (Etapa 10)

```
[========================================] 100%
✓ Ident.  ✓ Classif.  ✓ Caract.  ✓ Cota  ✓ Taxas
✓ Prazos  ✓ Classes   ✓ Vínculos ✓ Docs  → Revisão
```

---

## 17. Notas de Implementação

### Estado do Componente

O componente é **stateless** - recebe tudo via @Input.

### Comunicação

Apenas emite evento quando etapa é clicada. O componente pai decide o que fazer.

### Performance

- Usar `OnPush` change detection
- Evitar cálculos pesados no template
- Memorizar percentual calculado

### Testabilidade

- Fácil de testar isoladamente
- Mock dos inputs
- Verificar emissão de eventos

---

## 18. Próximos Passos

Após implementar a barra de progresso, proceda para:

1. **[WIZARD_SPEC_14_DATA_MODELS.md]** - Definir interfaces
2. **[WIZARD_SPEC_03_STEP_01_IDENTIFICACAO.md]** - Primeira etapa

---

**Status**: 📋 Especificação Funcional  
**Versão**: 1.0
