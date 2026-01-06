import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
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

  // Virtual scroll page size
  private readonly pageSize = 50;

  // Accumulated items for virtual scroll
  private readonly accumulatedItems = signal<Transaction[]>([]);
  private readonly totalCount = signal<number>(0);
  private readonly currentOffset = signal<number>(0);

  // Loading state for infinite scroll
  readonly loadingMore = signal<boolean>(false);

  // Computed response that combines accumulated items with total count
  readonly transactionsResponse = computed<PaginatedResponse<Transaction> | null>(() => {
    const items = this.accumulatedItems();
    const total = this.totalCount();
    if (items.length === 0 && total === 0) {
      return null;
    }
    return {
      items,
      totalCount: total,
      limit: this.pageSize,
      offset: this.currentOffset()
    };
  });

  // Column definitions for data grid
  columns: ColumnDefinition<Transaction>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      sortKey: 'id',
      align: 'end',
      minWidth: '50px',
      cellClass: 'numeric font-monospace'
    },
    {
      key: 'fundCode',
      label: 'Fund',
      sortable: true,
      sortKey: 'fundCode',
      align: 'start',
      minWidth: '70px',
      cellClass: 'fw-semibold font-monospace text-info'
    },
    {
      key: 'securityTicker',
      label: 'Sec',
      sortable: true,
      sortKey: 'securityTicker',
      align: 'start',
      minWidth: '55px',
      cellClass: 'font-monospace text-info'
    },
    {
      key: 'transactionTypeDescription',
      label: 'Class',
      sortable: true,
      sortKey: 'transactionTypeDescription',
      align: 'center',
      minWidth: '130px',
    },
    {
      key: 'transactionSubTypeDescription',
      label: 'Sub',
      sortable: true,
      sortKey: 'transactionSubTypeDescription',
      align: 'start',
      minWidth: '75px',
    },
    {
      key: 'tradeDate',
      label: 'T-Date',
      sortable: true,
      sortKey: 'tradeDate',
      align: 'center',
      minWidth: '90px',
      cellClass: 'font-monospace',
      formatter: (value) => this.datePipe.transform(value as string, 'MM/dd/yyyy') || ''
    },
    {
      key: 'settleDate',
      label: 'S-Date',
      sortable: true,
      sortKey: 'settleDate',
      align: 'center',
      minWidth: '90px',
      cellClass: 'font-monospace',
      formatter: (value) => this.datePipe.transform(value as string, 'MM/dd/yyyy') || ''
    },
    {
      key: 'quantity',
      label: 'Qty',
      sortable: true,
      sortKey: 'quantity',
      align: 'end',
      minWidth: '60px',
      cellClass: 'numeric font-monospace',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.0-4') || ''
    },
    {
      key: 'price',
      label: 'Px',
      sortable: true,
      sortKey: 'price',
      align: 'end',
      minWidth: '75px',
      cellClass: 'numeric font-monospace',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.2-4') || ''
    },
    {
      key: 'amount',
      label: 'Amt',
      sortable: true,
      sortKey: 'amount',
      align: 'end',
      minWidth: '85px',
      cellClass: 'numeric font-monospace fw-bold',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.2-2') || ''
    },
    {
      key: 'currency',
      label: 'CCY',
      sortable: true,
      sortKey: 'currency',
      align: 'center',
      minWidth: '45px',
      cellClass: 'font-monospace text-info'
    },
    {
      key: 'statusDescription',
      label: 'Status',
      sortable: true,
      sortKey: 'statusId',
      align: 'start',
      minWidth: '70px',
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
    // Reset and load initial page
    this.accumulatedItems.set([]);
    this.currentOffset.set(0);
    this.fetchTransactions(0, false);
  }

  loadMoreTransactions(): void {
    const items = this.accumulatedItems();
    const total = this.totalCount();

    // Don't load more if already loading or no more items
    if (this.loadingMore() || items.length >= total) {
      return;
    }

    const nextOffset = items.length;
    this.fetchTransactions(nextOffset, true);
  }

  private fetchTransactions(offset: number, isLoadMore: boolean): void {
    const search = this.store.searchTerm();
    const filter = search || undefined;

    if (isLoadMore) {
      this.loadingMore.set(true);
    }

    this.transactionService.getTransactions(
      this.pageSize,
      offset,
      this.store.sortColumn(),
      this.store.sortDirection(),
      filter
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          if (isLoadMore) {
            // Append to existing items
            this.accumulatedItems.update(items => [...items, ...response.items]);
          } else {
            // Replace items (initial load or refresh)
            this.accumulatedItems.set(response.items);
          }
          this.totalCount.set(response.totalCount);
          this.currentOffset.set(offset);
          this.loadingMore.set(false);
        },
        error: err => {
          this.loadingMore.set(false);
          this.logger.logHttpError('load transactions', err, 'Failed to load transactions. Please try again.');
        }
      });
  }
}
