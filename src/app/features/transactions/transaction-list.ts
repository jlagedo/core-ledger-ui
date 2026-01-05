import {
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
export class TransactionList {
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
      cellClass: 'numeric font-monospace'
    },
    {
      key: 'fundCode',
      label: 'Fund',
      sortable: true,
      sortKey: 'fundCode',
      align: 'start',
      cellClass: 'fw-semibold'
    },
    {
      key: 'securityTicker',
      label: 'Security',
      sortable: true,
      sortKey: 'securityTicker',
      align: 'start'
    },
    {
      key: 'transactionSubTypeDescription',
      label: 'Type',
      sortable: true,
      sortKey: 'transactionSubTypeDescription',
      align: 'start'
    },
    {
      key: 'tradeDate',
      label: 'Trade Date',
      sortable: true,
      sortKey: 'tradeDate',
      align: 'center',
      cellClass: 'text-muted',
      formatter: (value) => this.datePipe.transform(value as string, 'shortDate') || ''
    },
    {
      key: 'settleDate',
      label: 'Settle Date',
      sortable: true,
      sortKey: 'settleDate',
      align: 'center',
      cellClass: 'text-muted',
      formatter: (value) => this.datePipe.transform(value as string, 'shortDate') || ''
    },
    {
      key: 'quantity',
      label: 'Qty',
      sortable: true,
      sortKey: 'quantity',
      align: 'end',
      cellClass: 'numeric font-monospace',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.0-4') || ''
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      sortKey: 'price',
      align: 'end',
      cellClass: 'numeric font-monospace',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.2-4') || ''
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      sortKey: 'amount',
      align: 'end',
      cellClass: 'numeric font-monospace fw-bold',
      formatter: (value) => this.decimalPipe.transform(value as number, '1.2-2') || ''
    },
    {
      key: 'currency',
      label: 'CCY',
      sortable: true,
      sortKey: 'currency',
      align: 'center'
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

  constructor() {
    effect(() => {
      this.loadTransactions();
    });
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
