# WIZARD_SPEC_01 - Arquitetura do Wizard

## 1. Objetivo

Definir a estrutura de componentes, serviços e organização de arquivos para implementação do wizard de cadastro de fundos.

---

## 2. Visão Arquitetural

```
┌─────────────────────────────────────────┐
│   WizardNovoFundoComponent (Container)  │
│   - Gerencia navegação                  │
│   - Mantém estado compartilhado         │
│   - Controla barra de progresso         │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼────┐     ┌────▼──────┐
    │ Progress│     │ Navigation│
    │   Bar   │     │  Buttons  │
    └─────────┘     └───────────┘
         │
    ┌────▼────────────────────────┐
    │   Step Components (1-10)    │
    │   - Formulários reativos    │
    │   - Validações locais       │
    │   - Emitem eventos p/ pai   │
    └─────────────────────────────┘
```

---

## 3. Estrutura de Pastas

```
src/app/modules/cadastros/fundos/
│
├── components/
│   └── wizard-novo-fundo/
│       ├── wizard-novo-fundo.component.ts
│       ├── wizard-novo-fundo.component.html
│       ├── wizard-novo-fundo.component.scss
│       │
│       ├── components/
│       │   ├── progress-bar/
│       │   │   ├── progress-bar.component.ts
│       │   │   ├── progress-bar.component.html
│       │   │   └── progress-bar.component.scss
│       │   │
│       │   └── navigation-buttons/
│       │       ├── navigation-buttons.component.ts
│       │       ├── navigation-buttons.component.html
│       │       └── navigation-buttons.component.scss
│       │
│       └── steps/
│           ├── step-01-identificacao/
│           ├── step-02-classificacao/
│           ├── step-03-caracteristicas/
│           ├── step-04-parametros-cota/
│           ├── step-05-taxas/
│           ├── step-06-prazos/
│           ├── step-07-classes/
│           ├── step-08-vinculos/
│           ├── step-09-documentos/
│           └── step-10-revisao/
│
├── services/
│   ├── wizard-state.service.ts      # Gerencia estado compartilhado
│   ├── fundo.service.ts              # Comunicação com API
│   └── fundo-validator.service.ts    # Validações de negócio
│
├── models/
│   ├── wizard-data.model.ts          # Interface do estado completo
│   ├── fundo.model.ts                # Entidade Fundo
│   ├── fundo-dto.model.ts            # DTO para API
│   │
│   └── enums/
│       ├── tipo-fundo.enum.ts
│       ├── situacao-fundo.enum.ts
│       ├── publico-alvo.enum.ts
│       ├── tipo-condominio.enum.ts
│       ├── prazo-fundo.enum.ts
│       ├── regime-tributacao.enum.ts
│       ├── tipo-taxa.enum.ts
│       ├── base-calculo.enum.ts
│       ├── forma-cobranca.enum.ts
│       ├── tipo-operacao-prazo.enum.ts
│       ├── tipo-classe-fidc.enum.ts
│       ├── tipo-vinculo.enum.ts
│       └── tipo-documento.enum.ts
│
├── validators/
│   ├── cnpj.validator.ts
│   ├── date-range.validator.ts
│   └── conditional-required.validator.ts
│
└── guards/
    └── unsaved-changes.guard.ts
```

---

## 4. Componente Container: WizardNovoFundoComponent

### Responsabilidades

1. **Navegação**: Controlar etapa atual e transições
2. **Estado**: Manter dados do wizard via WizardStateService
3. **Validação**: Verificar se etapa está completa antes de avançar
4. **Integração**: Chamar API ao finalizar
5. **Feedback**: Mostrar loading, sucesso, erros

### Propriedades Principais

```typescript
currentStep: number          // Etapa atual (1-10)
totalSteps: number           // Total de etapas (10)
completedSteps: Set<number>  // Etapas completas
isLoading: boolean           // Loading durante salvamento
```

### Métodos Principais

```typescript
nextStep(): void             // Avançar para próxima etapa
previousStep(): void         // Voltar para etapa anterior
goToStep(step: number): void // Navegar para etapa específica
canNavigateToStep(step: number): boolean  // Verificar se pode navegar
isStepComplete(step: number): boolean     // Verificar se etapa está completa
saveAndFinish(): void        // Salvar dados na API
cancel(): void               // Cancelar e voltar
```

### Comportamento

**Ao Carregar:**
- Inicializar WizardStateService
- Definir currentStep = 1
- Carregar dependências (indexadores, calendários)

**Ao Avançar:**
1. Validar etapa atual
2. Se válida: marcar como completa e incrementar currentStep
3. Se inválida: mostrar erros e impedir avanço

**Ao Voltar:**
- Decrementar currentStep (sem validação)

**Ao Finalizar:**
1. Validar todas etapas obrigatórias completas
2. Chamar WizardStateService.buildDTO()
3. Chamar FundoService.create()
4. Se sucesso: redirecionar
5. Se erro: mostrar mensagem

---

## 5. Service: WizardStateService

### Responsabilidades

1. **Armazenar dados**: Manter estado do wizard em memória
2. **Compartilhar estado**: Prover Observable para componentes
3. **Validar completude**: Verificar se etapas estão completas
4. **Construir DTO**: Montar objeto para enviar à API

### Estrutura de Dados

```typescript
interface WizardData {
  step1: Step1Data;   // Identificação
  step2: Step2Data;   // Classificação
  step3: Step3Data;   // Características
  step4: Step4Data;   // Parâmetros Cota
  step5: Step5Data;   // Taxas (array)
  step6: Step6Data;   // Prazos (array)
  step7: Step7Data;   // Classes (array, opcional)
  step8: Step8Data;   // Vínculos (array)
  step9: Step9Data;   // Documentos (array, opcional)
  step10: Step10Data; // Revisão (vazio, apenas confirmação)
}
```

### Métodos

```typescript
// Atualizar dados de uma etapa
updateStepData(step: number, data: any): void

// Obter dados de uma etapa
getStepData(step: number): any

// Obter todos os dados
getAllData(): WizardData

// Verificar se etapa está completa
isStepComplete(step: number): boolean

// Resetar todos os dados
reset(): void

// Construir DTO para API
buildFundoDTO(): FundoDTO

// Observable para componentes
wizardData$: Observable<WizardData>
```

### Implementação

Usar `BehaviorSubject` para manter estado reativo:

```typescript
private wizardDataSubject = new BehaviorSubject<WizardData>(initialData);
public wizardData$ = this.wizardDataSubject.asObservable();
```

---

## 6. Service: FundoService

### Responsabilidades

1. **CRUD**: Criar, ler, atualizar, deletar fundos
2. **Validações**: Verificar CNPJ duplicado
3. **Integrações**: Buscar indexadores, calendários

### Endpoints

```typescript
// Criar fundo (usado ao finalizar wizard)
createFundo(dto: FundoDTO): Observable<Fundo>

// Verificar se CNPJ já existe
checkCnpjExists(cnpj: string): Observable<boolean>

// Buscar indexadores ativos (para step 5)
getIndexadores(): Observable<Indexador[]>

// Upload de documento (para step 9)
uploadDocumento(file: File, metadata: any): Observable<DocumentoResponse>
```

### URLs da API

```
POST   /api/v1/fundos
GET    /api/v1/fundos/check-cnpj/{cnpj}
GET    /api/v1/indexadores?ativo=true
POST   /api/v1/fundos/{fundoId}/documentos
```

---

## 7. Componente: ProgressBarComponent

### Responsabilidades

1. Exibir progresso visual do wizard
2. Mostrar quais etapas estão completas
3. Destacar etapa atual
4. Permitir navegação para etapas completas

### Inputs

```typescript
@Input() currentStep: number;
@Input() totalSteps: number;
@Input() completedSteps: Set<number>;
@Input() stepLabels: string[];  // Labels das etapas
```

### Outputs

```typescript
@Output() stepClicked = new EventEmitter<number>();
```

### Comportamento

- Calcular percentual: `(completedSteps.size / totalSteps) * 100`
- Permitir clicar apenas em etapas completas
- Destacar etapa atual com cor diferente
- Mostrar ícone de check para etapas completas

**Ver detalhes em**: [WIZARD_SPEC_02_PROGRESS_BAR.md]

---

## 8. Componentes de Etapas (Steps)

### Estrutura Padrão

Cada componente de etapa segue este padrão:

```typescript
export class StepXComponent implements OnInit {
  @Input() data: StepXData;  // Dados iniciais (do state)
  @Output() dataChanged = new EventEmitter<StepXData>();
  @Output() valid = new EventEmitter<boolean>();
  
  form: FormGroup;
  
  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
    this.subscribeToChanges();
  }
  
  private initForm(): void {
    // Criar FormGroup com validações
  }
  
  private subscribeToChanges(): void {
    // Emitir mudanças para componente pai
    this.form.valueChanges.subscribe(data => {
      this.dataChanged.emit(data);
      this.valid.emit(this.form.valid);
    });
  }
}
```

### Responsabilidades de Cada Step

1. **Renderizar formulário** da etapa
2. **Validar campos** localmente
3. **Emitir dados** para componente pai ao mudar
4. **Emitir validade** do formulário
5. **Carregar dados iniciais** do state
6. **Aplicar máscaras** nos campos
7. **Mostrar erros** de validação

### Comunicação com Pai

```
Step Component ─(dataChanged)→ Wizard Container ─→ WizardStateService
               ─(valid)→
```

---

## 9. Validators Customizados

### CNPJValidator

**Responsabilidade**: Validar formato e dígitos verificadores do CNPJ

```typescript
export class CNPJValidator {
  static validate(control: AbstractControl): ValidationErrors | null {
    // Implementar validação de CNPJ
    // Retornar { cnpjInvalid: true } se inválido
    // Retornar null se válido
  }
}
```

### DateRangeValidator

**Responsabilidade**: Validar que data final >= data inicial

```typescript
export class DateRangeValidator {
  static validate(startField: string, endField: string) {
    return (group: FormGroup): ValidationErrors | null {
      // Comparar datas
      // Retornar { dateRangeInvalid: true } se inválido
    }
  }
}
```

### ConditionalRequiredValidator

**Responsabilidade**: Tornar campo obrigatório baseado em outro campo

```typescript
export class ConditionalRequiredValidator {
  static validate(dependsOn: string, expectedValue: any) {
    return (control: AbstractControl): ValidationErrors | null {
      // Se campo dependente tem valor esperado
      // Então este campo é obrigatório
    }
  }
}
```

**Ver detalhes em**: [WIZARD_SPEC_13_VALIDATION.md]

---

## 10. Guard: UnsavedChangesGuard

### Responsabilidade

Prevenir que usuário saia do wizard sem confirmar, se houver dados não salvos.

### Implementação

```typescript
export class UnsavedChangesGuard implements CanDeactivate<WizardNovoFundoComponent> {
  canDeactivate(component: WizardNovoFundoComponent): boolean | Observable<boolean> {
    if (component.hasUnsavedChanges()) {
      return confirm('Você tem dados não salvos. Deseja realmente sair?');
    }
    return true;
  }
}
```

### Uso no Roteamento

```typescript
{
  path: 'novo',
  component: WizardNovoFundoComponent,
  canDeactivate: [UnsavedChangesGuard]
}
```

---

## 11. Fluxo de Dados

### Durante Preenchimento

```
1. Usuário digita em campo
   ↓
2. FormControl detecta mudança
   ↓
3. Step Component emite dataChanged
   ↓
4. Wizard Container recebe evento
   ↓
5. Wizard Container chama WizardStateService.updateStepData()
   ↓
6. WizardStateService atualiza BehaviorSubject
```

### Durante Navegação

```
1. Usuário clica "Próximo"
   ↓
2. Wizard Container valida etapa atual
   ↓
3. Se válida: marca como completa e incrementa currentStep
   ↓
4. Angular renderiza próximo Step Component
   ↓
5. Step Component carrega dados do WizardStateService
```

### Ao Finalizar

```
1. Usuário clica "Finalizar" na Etapa 10
   ↓
2. Wizard Container valida todas etapas obrigatórias completas
   ↓
3. WizardStateService.buildFundoDTO() constrói payload
   ↓
4. FundoService.createFundo() envia POST para API
   ↓
5. Se sucesso: redireciona para detalhes
6. Se erro: mostra mensagem e permite retry
```

---

## 12. Gestão de Estado

### Estado Local vs Global

**Estado Local (dentro do componente):**
- Estado visual (loading, erros)
- Formulário da etapa atual

**Estado Compartilhado (WizardStateService):**
- Dados de todas as etapas
- Etapas completas
- Dependências carregadas (indexadores, etc)

### Princípios

1. **Single Source of Truth**: WizardStateService é a fonte única
2. **Unidirectional Data Flow**: Dados fluem do service para componentes
3. **Imutabilidade**: Nunca mutar objetos, sempre criar novos
4. **Reactive**: Usar Observables para propagação de mudanças

---

## 13. Tratamento de Erros

### Erros de Validação

**Onde tratar**: Componente da etapa  
**Como exibir**: Mensagens inline abaixo do campo  
**Quando mostrar**: Após campo ser tocado (`touched`)

### Erros de API

**Onde tratar**: Wizard Container  
**Como exibir**: Modal ou toast notification  
**Quando mostrar**: Após resposta da API

### Erros de Rede

**Onde tratar**: FundoService + Interceptor  
**Como exibir**: Toast com opção de retry  
**Quando mostrar**: Timeout ou sem conexão

---

## 14. Performance

### Lazy Loading

Considerar lazy loading dos componentes de etapas se bundle ficar grande.

### Change Detection

Usar `OnPush` nos componentes de etapa para otimizar:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Debounce

Aplicar debounce em validações assíncronas (ex: verificar CNPJ):

```typescript
this.cnpjControl.valueChanges
  .pipe(debounceTime(500))
  .subscribe(value => this.checkCnpj(value));
```

---

## 15. Testes

### Testes Unitários

**Testar:**
- WizardStateService (lógica de estado)
- Validators customizados
- Métodos de navegação do Wizard Container

### Testes de Componente

**Testar:**
- Renderização de cada step
- Emissão de eventos
- Validações do formulário

### Testes de Integração

**Testar:**
- Fluxo completo do wizard
- Navegação entre etapas
- Salvamento na API

**Ver detalhes em**: [WIZARD_SPEC_19_TESTING.md]

---

## 16. Critérios de Aceitação

### Estrutura

- [ ] Pastas criadas conforme especificado
- [ ] Componentes criados conforme hierarquia
- [ ] Services criados e injetáveis
- [ ] Models e enums definidos

### Navegação

- [ ] Container controla navegação entre etapas
- [ ] Botões Próximo/Voltar funcionam
- [ ] Guard previne saída sem confirmar

### Estado

- [ ] WizardStateService mantém dados
- [ ] Dados persistem entre navegação
- [ ] Dados são resetados ao cancelar

### Integração

- [ ] FundoService comunica com API
- [ ] Verificação de CNPJ funciona
- [ ] Salvamento final funciona

---

## 17. Próximos Passos

Após implementar a arquitetura base, proceda para:

1. **[WIZARD_SPEC_02_PROGRESS_BAR.md]** - Implementar barra de progresso
2. **[WIZARD_SPEC_14_DATA_MODELS.md]** - Definir interfaces e enums
3. **[WIZARD_SPEC_03_STEP_01_IDENTIFICACAO.md]** - Primeira etapa

---

**Status**: 📋 Especificação Funcional  
**Versão**: 1.0
