import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {DatePipe, DecimalPipe} from '@angular/common';
import {PaginatedResponse} from '../../models/fund.model';
import {Transaction} from '../../models/transaction.model';
import {TransactionService} from '../../services/transaction';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from '@ng-bootstrap/ng-bootstrap';
import {TransactionsStore} from './transactions-store';
import {LoggerService} from '../../services/logger';
import {PageHeader} from '../../layout/page-header/page-header';
import {DataGrid} from '../../shared/components/data-grid/data-grid';
import {ColumnDefinition} from '../../shared/components/data-grid/column-definition.model';

@Component({
  selector: 'app-transaction-list',
  imports: [RouterLink, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbDropdownItem, PageHeader, DataGrid],
  providers: [TransactionsStore, DatePipe, DecimalPipe],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionList implements AfterViewInit {
  store = inject(TransactionsStore);
  transactionService = inject(TransactionService);
  destroyRef = inject(DestroyRef);
  logger = inject(LoggerService);
  datePipe = inject(DatePipe);
  decimalPipe = inject(DecimalPipe);

  transactionsResponse = signal<PaginatedResponse<Transaction> | null>(null);

  // Column definitions for data grid
  columns: ColumnDefinition<Transaction>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      sortKey: 'id',
      align: 'end',
      cellClass: 'numeric font-monospace text-nowrap'
    },
    {
      key: 'fundCode',
      label: 'Fund',
      sortable: true,
      sortKey: 'fundCode',
      align: 'start',
      cellClass: 'fw-semibold font-monospace text-info text-nowrap'
    },
    {
      key: 'securityTicker',
      label: 'Sec',
      sortable: true,
      sortKey: 'securityTicker',
      align: 'start',
      cellClass: 'font-monospace text-info text-nowrap'
    },
    {
      key: 'transactionTypeDescription',
      label: 'Class',
      sortable: true,
      sortKey: 'transactionTypeDescription',
      align: 'center',
    },
    {
      key: 'transactionSubTypeDescription',
      label: 'Sub',
      sortable: true,
      sortKey: 'transactionSubTypeDescription',
      align: 'start',
    },
    {
      key: 'tradeDate',
      label: 'T-Date',
      sortable: true,
      sortKey: 'tradeDate',
      align: 'center',
      cellClass: 'font-monospace text-nowrap',
      formatter: (value) => this.datePipe.transform(value as string, 'MM/dd/yyyy') || ''
    },
    {
      key: 'settleDate',
      label: 'S-Date',
      sortable: true,
      sortKey: 'settleDate',
      align: 'center',
      cellClass: 'font-monospace text-nowrap',
      formatter: (value) => this.datePipe.transform(value as string, 'MM/dd/yyyy') || ''
    },
    {
      key: 'quantity',
      label: 'Qty',
      sortable: true,
      sortKey: 'quantity',
      align: 'end',
      cellClass: 'numeric font-monospace text-nowrap',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.0-4') || ''
    },
    {
      key: 'price',
      label: 'Px',
      sortable: true,
      sortKey: 'price',
      align: 'end',
      cellClass: 'numeric font-monospace text-nowrap',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.2-4') || ''
    },
    {
      key: 'amount',
      label: 'Amt',
      sortable: true,
      sortKey: 'amount',
      align: 'end',
      cellClass: 'numeric font-monospace fw-bold text-nowrap',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.2-2') || ''
    },
    {
      key: 'currency',
      label: 'CCY',
      sortable: true,
      sortKey: 'currency',
      align: 'center',
      cellClass: 'font-monospace text-info text-nowrap'
    },
    {
      key: 'statusDescription',
      label: 'Status',
      sortable: true,
      sortKey: 'statusId',
      align: 'start'
    }
  ];

  @ViewChild('actionsTemplate', {static: true}) actionsTemplate!: TemplateRef<any>;
  @ViewChild('classTemplate', {static: true}) classTemplate!: TemplateRef<any>;

  // Instrument type to CSS class mapping (values match database)
  readonly instrumentTypeStyles: Record<string, string> = {
    'EQUITY': 'badge rounded-pill instrument-badge instrument-equity',
    'ETF': 'badge rounded-pill instrument-badge instrument-etf',
    'FIXED_INCOME': 'badge rounded-pill instrument-badge instrument-fixed-income',
    'DERIVATIVE_FUTURE': 'badge rounded-pill instrument-badge instrument-derivative-future',
    'DERIVATIVE_OPTION': 'badge rounded-pill instrument-badge instrument-derivative-option',
    'DERIVATIVE_SWAP': 'badge rounded-pill instrument-badge instrument-derivative-swap',
    'FX': 'badge rounded-pill instrument-badge instrument-fx',
    'MONEY_MARKET': 'badge rounded-pill instrument-badge instrument-money-market',
  };

  getInstrumentBadgeClass(type: string): string {
    return this.instrumentTypeStyles[type] ?? 'badge rounded-pill instrument-badge instrument-default';
  }

  constructor() {
    effect(() => {
      this.loadTransactions();
    });
  }

  ngAfterViewInit(): void {
    // Assign template to Class column
    const classColumn = this.columns.find(col => col.key === 'transactionTypeDescription');
    if (classColumn) {
      classColumn.template = this.classTemplate;
    }
  }

  loadTransactions(): void {
    const search = this.store.searchTerm();
    const filter = search || undefined;
    const offset = (this.store.page() - 1) * this.store.pageSize();

    this.transactionService.getTransactions(
      this.store.pageSize(),
      offset,
      this.store.sortColumn(),
      this.store.sortDirection(),
      filter
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.transactionsResponse.set(response),
        error: err => this.logger.logHttpError('load transactions', err, 'Failed to load transactions. Please try again.')
      });
  }
}
