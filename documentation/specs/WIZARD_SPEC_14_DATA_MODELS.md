# WIZARD_SPEC_14 - Data Models

## 1. Objetivo

Definir todas as interfaces TypeScript, enums e tipos de dados usados no wizard de cadastro de fundos.

---

## 2. Interface Principal: WizardData

```typescript
interface WizardData {
  step1: Step1IdentificacaoData;
  step2: Step2ClassificacaoData;
  step3: Step3CaracteristicasData;
  step4: Step4ParametrosCotaData;
  step5: Step5TaxasData;
  step6: Step6PrazosData;
  step7: Step7ClassesData;
  step8: Step8VinculosData;
  step9: Step9DocumentosData;
  step10: Step10RevisaoData;
}
```

---

## 3. Interfaces por Etapa

### 3.1 Step 1: Identificação

```typescript
interface Step1IdentificacaoData {
  cnpj: string;              // 14 dígitos, sem formatação
  razaoSocial: string;
  nomeFantasia: string;
  nomeCurto?: string;
  dataConstituicao: Date;
  dataInicioAtividade: Date;
  tipoFundo: TipoFundo;
}
```

### 3.2 Step 2: Classificação

```typescript
interface Step2ClassificacaoData {
  classificacaoCVM: string;
  classificacaoANBIMA?: string;
  codigoANBIMA?: string;
  situacao: SituacaoFundo;
  publicoAlvo: PublicoAlvo;
  regimeTributacao: RegimeTributacao;
}
```

### 3.3 Step 3: Características

```typescript
interface Step3CaracteristicasData {
  tipoCondominio: TipoCondominio;
  exclusivo: boolean;
  reservado: boolean;
  prazo: PrazoFundo;
  dataEncerramento?: Date;          // Obrigatório se prazo = DETERMINADO
  permiteAlavancagem: boolean;
  limiteAlavancagem?: number;       // Obrigatório se permiteAlavancagem = true
  aceitaCriptoativos: boolean;
  percentualExterior?: number;      // 0-100
}
```

### 3.4 Step 4: Parâmetros de Cota

```typescript
interface Step4ParametrosCotaData {
  casasDecimaisQuantidade: number;  // 0-8
  casasDecimaisValor: number;       // 2-8
  horarioCorte: string;             // HH:mm
  cotaInicial: number;              // > 0
  permiteFracionamento: boolean;
}
```

### 3.5 Step 5: Taxas

```typescript
interface Step5TaxasData {
  taxas: TaxaData[];  // Pelo menos uma
}

interface TaxaData {
  tipoTaxa: TipoTaxa;
  percentual: number;               // % a.a.
  percentualMinimo?: number;
  percentualMaximo?: number;
  baseCalculo: BaseCalculo;
  formaCobranca: FormaCobranca;
  dataInicioVigencia: Date;
  dataFimVigencia?: Date;
  ativo: boolean;
  
  // Específico para taxa de performance
  benchmarkId?: number;             // FK Indexador
  percentualBenchmark?: number;     // % do benchmark
  possuiHurdle?: boolean;
  possuiHighWaterMark?: boolean;
  linhaDAguaGlobal?: boolean;
}
```

### 3.6 Step 6: Prazos

```typescript
interface Step6PrazosData {
  prazos: PrazoData[];  // Mínimo 2 (aplicação + resgate)
}

interface PrazoData {
  tipoOperacao: TipoOperacaoPrazo;
  prazoCotizacao: number;           // D+X
  prazoLiquidacao: number;          // D+X, >= prazoCotizacao
  valorMinimoInicial?: number;
  valorMinimoAdicional?: number;
  valorMinimoResgate?: number;
  valorMinimoPermanencia?: number;
  prazoCarenciaDias?: number;
  permiteResgateTotal?: boolean;
  permiteResgateProgramado?: boolean;
  prazoMaximoProgramacao?: number;
  tipoCalendario: TipoCalendario;
}
```

### 3.7 Step 7: Classes (Opcional)

```typescript
interface Step7ClassesData {
  classes: ClasseData[];  // Pode ser vazio
}

interface ClasseData {
  codigoClasse: string;
  nomeClasse: string;
  cnpjClasse?: string;
  nivel: 1 | 2;                     // 1=classe, 2=subclasse
  classePaiId?: string;             // UUID, obrigatório se nivel=2
  publicoAlvo: PublicoAlvo;
  responsabilidadeLimitada: boolean;
  segregacaoPatrimonial: boolean;
  
  // Específico para FIDC
  tipoClasseFIDC?: TipoClasseFIDC;
  ordemSubordinacao?: number;
  rentabilidadeAlvo?: number;
  indiceSubordinacaoMinimo?: number;
  permiteResgateAntecipado?: boolean;
  
  // Taxas específicas da classe
  taxaAdministracao?: number;
  taxaGestao?: number;
  taxaPerformance?: number;
  benchmarkId?: number;
  valorMinimoAplicacao?: number;
  valorMinimoPermanencia?: number;
  
  ativo: boolean;
  dataInicio: Date;
  dataEncerramento?: Date;
}
```

### 3.8 Step 8: Vínculos

```typescript
interface Step8VinculosData {
  vinculos: VinculoData[];  // Mínimo 3 (admin, gestor, custodiante)
}

interface VinculoData {
  tipoVinculo: TipoVinculo;
  cnpjInstituicao: string;
  nomeInstituicao: string;
  codigoCVM?: string;
  responsavelNome?: string;
  responsavelEmail?: string;
  responsavelTelefone?: string;
  dataInicio: Date;
  dataFim?: Date;
  motivoFim?: string;
  ativo: boolean;
}
```

### 3.9 Step 9: Documentos (Opcional)

```typescript
interface Step9DocumentosData {
  documentos: DocumentoData[];  // Pode ser vazio
}

interface DocumentoData {
  tipoDocumento: TipoDocumento;
  versao: number;
  dataVigencia: Date;
  dataFimVigencia?: Date;
  arquivo: File;                    // Arquivo para upload
  arquivoNome: string;
  arquivoTamanho: number;           // Em bytes
  observacoes?: string;
}
```

### 3.10 Step 10: Revisão

```typescript
interface Step10RevisaoData {
  confirmado: boolean;
  observacoesFinais?: string;
}
```

---

## 4. Enums

### 4.1 Tipo de Fundo

```typescript
enum TipoFundo {
  FI = 'FI',
  FIC = 'FIC',
  FIDC = 'FIDC',
  FIDC_NP = 'FIDC_NP',
  FIP = 'FIP',
  FII = 'FII',
  FIAGRO = 'FIAGRO',
  FI_INFRA = 'FI_INFRA',
  ETF = 'ETF',
  FMP_FGTS = 'FMP_FGTS'
}

const TipoFundoLabels = {
  [TipoFundo.FI]: 'Fundo de Investimento',
  [TipoFundo.FIC]: 'Fundo de Investimento em Cotas',
  [TipoFundo.FIDC]: 'Fundo de Investimento em Direitos Creditórios',
  [TipoFundo.FIDC_NP]: 'FIDC Não Padronizado',
  [TipoFundo.FIP]: 'Fundo de Investimento em Participações',
  [TipoFundo.FII]: 'Fundo de Investimento Imobiliário',
  [TipoFundo.FIAGRO]: 'Fundo nas Cadeias Produtivas Agroindustriais',
  [TipoFundo.FI_INFRA]: 'Fundo de Investimento em Infraestrutura',
  [TipoFundo.ETF]: 'Fundo de Índice',
  [TipoFundo.FMP_FGTS]: 'Fundo Mútuo de Privatização'
};
```

### 4.2 Situação do Fundo

```typescript
enum SituacaoFundo {
  EM_CONSTITUICAO = 'EM_CONSTITUICAO',
  ATIVO = 'ATIVO',
  SUSPENSO = 'SUSPENSO',
  EM_LIQUIDACAO = 'EM_LIQUIDACAO',
  LIQUIDADO = 'LIQUIDADO',
  CANCELADO = 'CANCELADO'
}
```

### 4.3 Público Alvo

```typescript
enum PublicoAlvo {
  GERAL = 'GERAL',
  QUALIFICADO = 'QUALIFICADO',
  PROFISSIONAL = 'PROFISSIONAL'
}
```

### 4.4 Regime de Tributação

```typescript
enum RegimeTributacao {
  CURTO_PRAZO = 'CURTO_PRAZO',
  LONGO_PRAZO = 'LONGO_PRAZO',
  ACOES = 'ACOES',
  FII = 'FII',
  FIP = 'FIP',
  FIDC = 'FIDC'
}
```

### 4.5 Tipo de Condomínio

```typescript
enum TipoCondominio {
  ABERTO = 'ABERTO',
  FECHADO = 'FECHADO'
}
```

### 4.6 Prazo do Fundo

```typescript
enum PrazoFundo {
  DETERMINADO = 'DETERMINADO',
  INDETERMINADO = 'INDETERMINADO'
}
```

### 4.7 Tipo de Taxa

```typescript
enum TipoTaxa {
  ADMINISTRACAO = 'ADMINISTRACAO',
  GESTAO = 'GESTAO',
  CUSTODIA = 'CUSTODIA',
  PERFORMANCE = 'PERFORMANCE',
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
  DISTRIBUICAO = 'DISTRIBUICAO',
  CONSULTORIA = 'CONSULTORIA',
  ESCRITURACAO = 'ESCRITURACAO',
  ESTRUTURACAO = 'ESTRUTURACAO'
}
```

### 4.8 Base de Cálculo

```typescript
enum BaseCalculo {
  PL_MEDIO = 'PL_MEDIO',
  PL_FINAL = 'PL_FINAL',
  RENDIMENTO = 'RENDIMENTO',
  RENDIMENTO_ACIMA_BENCHMARK = 'RENDIMENTO_ACIMA_BENCHMARK'
}
```

### 4.9 Forma de Cobrança

```typescript
enum FormaCobranca {
  DIARIA = 'DIARIA',
  MENSAL = 'MENSAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
  EVENTO = 'EVENTO'
}
```

### 4.10 Tipo de Operação (Prazo)

```typescript
enum TipoOperacaoPrazo {
  APLICACAO = 'APLICACAO',
  RESGATE = 'RESGATE',
  RESGATE_CRISE = 'RESGATE_CRISE'
}
```

### 4.11 Tipo de Calendário

```typescript
enum TipoCalendario {
  BRASIL = 'BRASIL',
  ANBIMA = 'ANBIMA',
  BOVESPA = 'BOVESPA'
}
```

### 4.12 Tipo de Classe FIDC

```typescript
enum TipoClasseFIDC {
  SENIOR = 'SENIOR',
  MEZANINO = 'MEZANINO',
  SUBORDINADA = 'SUBORDINADA',
  SUBORDINADA_JUNIOR = 'SUBORDINADA_JUNIOR',
  UNICA = 'UNICA'
}
```

### 4.13 Tipo de Vínculo

```typescript
enum TipoVinculo {
  ADMINISTRADOR = 'ADMINISTRADOR',
  GESTOR = 'GESTOR',
  CUSTODIANTE = 'CUSTODIANTE',
  DISTRIBUIDOR = 'DISTRIBUIDOR',
  AUDITOR = 'AUDITOR',
  ESCRITURADOR = 'ESCRITURADOR',
  CONTROLADOR = 'CONTROLADOR',
  CONSULTORIA_CREDITO = 'CONSULTORIA_CREDITO',
  AGENTE_COBRANCA = 'AGENTE_COBRANCA',
  CEDENTE = 'CEDENTE',
  FORMADOR_MERCADO = 'FORMADOR_MERCADO'
}
```

### 4.14 Tipo de Documento

```typescript
enum TipoDocumento {
  REGULAMENTO = 'REGULAMENTO',
  LAMINA = 'LAMINA',
  FIC = 'FIC',
  PROSPECTO = 'PROSPECTO',
  TERMO_ADESAO = 'TERMO_ADESAO',
  POLITICA_INVESTIMENTO = 'POLITICA_INVESTIMENTO',
  MANUAL_COMPLIANCE = 'MANUAL_COMPLIANCE',
  CONTRATO_CUSTODIA = 'CONTRATO_CUSTODIA',
  CONTRATO_GESTAO = 'CONTRATO_GESTAO',
  ATA_ASSEMBLEIA = 'ATA_ASSEMBLEIA',
  PARECER_AUDITOR = 'PARECER_AUDITOR'
}
```

---

## 5. DTO para API

### 5.1 FundoDTO (Envio para Backend)

```typescript
interface FundoDTO {
  // Step 1
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  nomeCurto?: string;
  dataConstituicao: string;         // ISO 8601
  dataInicioAtividade: string;
  tipoFundo: string;
  
  // Step 2
  classificacaoCVM: string;
  classificacaoANBIMA?: string;
  codigoANBIMA?: string;
  situacao: string;
  publicoAlvo: string;
  regimeTributacao: string;
  
  // Step 3
  tipoCondominio: string;
  exclusivo: boolean;
  reservado: boolean;
  prazo: string;
  dataEncerramento?: string;
  permiteAlavancagem: boolean;
  limiteAlavancagem?: number;
  aceitaCriptoativos: boolean;
  percentualExterior?: number;
  
  // Step 4
  parametrosCota: {
    casasDecimaisQuantidade: number;
    casasDecimaisValor: number;
    horarioCorte: string;
    cotaInicial: number;
    permiteFracionamento: boolean;
  };
  
  // Step 5
  taxas: TaxaDTO[];
  
  // Step 6
  prazos: PrazoDTO[];
  
  // Step 7 (opcional)
  classes?: ClasseDTO[];
  
  // Step 8
  vinculos: VinculoDTO[];
  
  // Step 9 (opcional)
  documentos?: DocumentoDTO[];
}
```

### 5.2 Outros DTOs

```typescript
interface TaxaDTO {
  tipoTaxa: string;
  percentual: number;
  percentualMinimo?: number;
  percentualMaximo?: number;
  baseCalculo: string;
  formaCobranca: string;
  dataInicioVigencia: string;
  dataFimVigencia?: string;
  ativo: boolean;
  benchmarkId?: number;
  percentualBenchmark?: number;
  possuiHurdle?: boolean;
  possuiHighWaterMark?: boolean;
  linhaDAguaGlobal?: boolean;
}

interface PrazoDTO {
  tipoOperacao: string;
  prazoCotizacao: number;
  prazoLiquidacao: number;
  valorMinimoInicial?: number;
  valorMinimoAdicional?: number;
  valorMinimoResgate?: number;
  valorMinimoPermanencia?: number;
  prazoCarenciaDias?: number;
  permiteResgateTotal?: boolean;
  permiteResgateProgramado?: boolean;
  prazoMaximoProgramacao?: number;
  tipoCalendario: string;
}

interface ClasseDTO {
  codigoClasse: string;
  nomeClasse: string;
  cnpjClasse?: string;
  nivel: number;
  classePaiId?: string;
  publicoAlvo: string;
  responsabilidadeLimitada: boolean;
  segregacaoPatrimonial: boolean;
  tipoClasseFIDC?: string;
  ordemSubordinacao?: number;
  rentabilidadeAlvo?: number;
  indiceSubordinacaoMinimo?: number;
  permiteResgateAntecipado?: boolean;
  taxaAdministracao?: number;
  taxaGestao?: number;
  taxaPerformance?: number;
  benchmarkId?: number;
  valorMinimoAplicacao?: number;
  valorMinimoPermanencia?: number;
  ativo: boolean;
  dataInicio: string;
  dataEncerramento?: string;
}

interface VinculoDTO {
  tipoVinculo: string;
  cnpjInstituicao: string;
  nomeInstituicao: string;
  codigoCVM?: string;
  responsavelNome?: string;
  responsavelEmail?: string;
  responsavelTelefone?: string;
  dataInicio: string;
  dataFim?: string;
  motivoFim?: string;
  ativo: boolean;
}

interface DocumentoDTO {
  tipoDocumento: string;
  versao: number;
  dataVigencia: string;
  dataFimVigencia?: string;
  arquivoNome: string;
  arquivoTamanho: number;
  observacoes?: string;
  // Arquivo enviado separadamente via multipart
}
```

---

## 6. Types Utilitários

```typescript
type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type OptionalStep = 7 | 9;

type RequiredStep = Exclude<StepNumber, OptionalStep>;

interface StepInfo {
  number: StepNumber;
  name: string;
  shortName: string;
  required: boolean;
}
```

---

## 7. Constantes

```typescript
const TOTAL_STEPS = 10;

const OPTIONAL_STEPS: Set<OptionalStep> = new Set([7, 9]);

const REQUIRED_STEPS: Set<RequiredStep> = new Set([1, 2, 3, 4, 5, 6, 8, 10]);

const STEP_INFOS: StepInfo[] = [
  { number: 1, name: 'Identificação', shortName: 'Ident.', required: true },
  { number: 2, name: 'Classificação', shortName: 'Classif.', required: true },
  { number: 3, name: 'Características', shortName: 'Caract.', required: true },
  { number: 4, name: 'Parâmetros de Cota', shortName: 'Cota', required: true },
  { number: 5, name: 'Taxas', shortName: 'Taxas', required: true },
  { number: 6, name: 'Prazos', shortName: 'Prazos', required: true },
  { number: 7, name: 'Classes e Subclasses', shortName: 'Classes', required: false },
  { number: 8, name: 'Vínculos Institucionais', shortName: 'Vínculos', required: true },
  { number: 9, name: 'Documentos', shortName: 'Docs', required: false },
  { number: 10, name: 'Revisão', shortName: 'Revisão', required: true }
];
```

---

## 8. Helpers

```typescript
// Converter WizardData para FundoDTO
function buildFundoDTO(wizardData: WizardData): FundoDTO {
  // Implementar conversão
}

// Verificar se etapa é opcional
function isOptionalStep(step: StepNumber): boolean {
  return OPTIONAL_STEPS.has(step as OptionalStep);
}

// Obter info da etapa
function getStepInfo(step: StepNumber): StepInfo {
  return STEP_INFOS[step - 1];
}
```

---

## 9. Critérios de Aceitação

- [ ] Todas interfaces definidas
- [ ] Todos enums definidos com labels
- [ ] DTO para API estruturado
- [ ] Types utilitários criados
- [ ] Constantes definidas
- [ ] Helpers implementados
- [ ] Documentação completa

---

## 10. Próximos Passos

Após definir os data models:

1. **[WIZARD_SPEC_13_VALIDATION.md]** - Implementar validações
2. **[WIZARD_SPEC_03_STEP_01_IDENTIFICACAO.md]** - Começar implementação das etapas

---

**Status**: 📋 Especificação Funcional  
**Versão**: 1.0
