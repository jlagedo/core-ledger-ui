import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  SortChangedEvent,
  SelectionChangedEvent,
  IDatasource,
  CellClickedEvent,
} from 'ag-grid-community';

import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction';
import { TransactionsStore } from './transactions-store';
import { LoggerService } from '../../services/logger';
import { PageHeader } from '../../layout/page-header/page-header';
import { ThemeService } from '../../services/theme-service';
import { ToastService } from '../../services/toast-service';
import {
  createTransactionsDatasource,
  PaginationStats,
} from './transactions-datasource';
import { agGridDarkTheme, agGridLightTheme } from '../../shared/themes/ag-grid-theme';

@Component({
  selector: 'app-transaction-list',
  imports: [RouterLink, PageHeader, AgGridAngular, FormsModule, DecimalPipe],
  providers: [TransactionsStore, DatePipe, DecimalPipe],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionList {
  private readonly store = inject(TransactionsStore);
  private readonly transactionService = inject(TransactionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly logger = inject(LoggerService);
  private readonly datePipe = inject(DatePipe);
  private readonly decimalPipe = inject(DecimalPipe);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly toastService = inject(ToastService);

  private gridApi: GridApi<Transaction> | null = null;

  // Search term bound to input
  searchTerm = signal('');

  // Selected rows for bulk operations
  readonly selectedRows = signal<Transaction[]>([]);
  readonly hasSelection = computed(() => this.selectedRows().length > 0);
  readonly selectionCount = computed(() => this.selectedRows().length);

  // Pagination statistics for status bar
  readonly paginationStats = signal<PaginationStats>({
    totalCount: 0,
    loadedCount: 0,
    currentRangeStart: 0,
    currentRangeEnd: 0,
    isLoading: false,
  });

  // Computed helpers for template
  readonly totalCount = computed(() => this.paginationStats().totalCount);
  readonly isLoading = computed(() => this.paginationStats().isLoading);

  // AG Grid theme - reactive to app theme changes
  readonly gridTheme = computed(() =>
    this.themeService.isDarkMode() ? agGridDarkTheme : agGridLightTheme
  );

  // Column definitions
  readonly columnDefs: ColDef<Transaction>[] = [
    {
      headerName: '',
      width: 50,
      maxWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      sortable: false,
      filter: false,
      suppressMovable: true,
      lockPosition: 'left',
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      sortable: true,
      type: 'numericColumn',
    },
    {
      field: 'fundCode',
      headerName: 'Fund',
      width: 100,
      sortable: true,
    },
    {
      field: 'securityTicker',
      headerName: 'Security',
      width: 100,
      sortable: true,
    },
    {
      field: 'transactionTypeDescription',
      headerName: 'Type',
      minWidth: 120,
      flex: 1,
      sortable: true,
    },
    {
      field: 'transactionSubTypeDescription',
      headerName: 'Sub Type',
      width: 120,
      sortable: true,
    },
    {
      field: 'tradeDate',
      headerName: 'Trade Date',
      width: 110,
      sortable: true,
      valueFormatter: (params) =>
        this.datePipe.transform(params.value, 'MM/dd/yy') || '',
    },
    {
      field: 'settleDate',
      headerName: 'Settle Date',
      width: 110,
      sortable: true,
      valueFormatter: (params) =>
        this.datePipe.transform(params.value, 'MM/dd/yy') || '',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      sortable: true,
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.decimalPipe.transform(params.value, '1.2-2') || '',
    },
    {
      field: 'statusDescription',
      headerName: 'Status',
      width: 100,
      sortable: true,
      colId: 'statusId',
    },
    {
      headerName: 'Actions',
      colId: 'actions',
      width: 150,
      minWidth: 150,
      sortable: false,
      filter: false,
      suppressMovable: true,
      lockPosition: 'right',
      cellRenderer: (params: { data: Transaction }) => {
        if (!params.data) return '';
        return `
          <div class="row-actions">
            <button class="row-action-btn row-action-btn--edit" data-action="edit" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="row-action-btn row-action-btn--cancel" data-action="cancel" title="Cancel">
              <i class="bi bi-x-circle"></i>
            </button>
            <button class="row-action-btn row-action-btn--export" data-action="export" title="Export">
              <i class="bi bi-download"></i>
            </button>
            <button class="row-action-btn row-action-btn--rollback" data-action="rollback" title="Rollback">
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        `;
      },
    },
  ];

  // Default column definitions
  readonly defaultColDef: ColDef = {
    resizable: true,
    minWidth: 50,
  };

  // Grid ready handler
  onGridReady(params: GridReadyEvent<Transaction>): void {
    this.gridApi = params.api;

    // Apply stored sort state if available
    const sortColumn = this.store.sortColumn();
    const sortDirection = this.store.sortDirection();

    if (sortColumn) {
      params.api.applyColumnState({
        state: [{ colId: sortColumn, sort: sortDirection }],
      });
    }

    // Set the datasource
    params.api.setGridOption('datasource', this.createDatasource());
  }

  // Sort changed handler - sync with store
  onSortChanged(event: SortChangedEvent<Transaction>): void {
    const sortModel = event.api.getColumnState().filter((col) => col.sort);

    if (sortModel.length > 0) {
      const { colId, sort } = sortModel[0];
      if (colId && sort) {
        this.store.setSort(colId, sort as 'asc' | 'desc');
      }
    }
  }

  // Search handler
  onSearch(): void {
    this.store.setSearchTerm(this.searchTerm().trim());

    // Purge cache and reload data with new search term
    if (this.gridApi) {
      this.gridApi.setGridOption('datasource', this.createDatasource());
    }
  }

  // Clear search
  onClearSearch(): void {
    this.searchTerm.set('');
    this.store.setSearchTerm('');

    if (this.gridApi) {
      this.gridApi.setGridOption('datasource', this.createDatasource());
    }
  }

  // Refresh grid data
  onRefresh(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('datasource', this.createDatasource());
    }
  }

  // Selection changed handler
  onSelectionChanged(event: SelectionChangedEvent<Transaction>): void {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes
      .map((node) => node.data)
      .filter((data): data is Transaction => data !== undefined);
    this.selectedRows.set(selectedData);
  }

  // Handle action button clicks in row
  onCellClicked(event: CellClickedEvent<Transaction>): void {
    if (event.column.getColId() !== 'actions') return;

    const target = event.event?.target as HTMLElement;
    const actionBtn = target.closest('[data-action]') as HTMLElement;
    if (!actionBtn || !event.data) return;

    const action = actionBtn.dataset['action'];
    switch (action) {
      case 'edit':
        this.onEditTransaction(event.data);
        break;
      case 'cancel':
        this.onCancelTransaction(event.data);
        break;
      case 'export':
        this.onExportTransaction(event.data);
        break;
      case 'rollback':
        this.onRollbackTransaction(event.data);
        break;
    }
  }

  // Row-level actions
  onEditTransaction(transaction: Transaction): void {
    this.router.navigate(['/transactions/capture', transaction.id, 'edit']);
  }

  onCancelTransaction(transaction: Transaction): void {
    this.toastService.info(`Cancel transaction #${transaction.id}`);
    // TODO: Implement cancel transaction API call
  }

  onExportTransaction(transaction: Transaction): void {
    this.toastService.info(`Export transaction #${transaction.id}`);
    // TODO: Implement single transaction export
  }

  onRollbackTransaction(transaction: Transaction): void {
    this.toastService.info(`Rollback transaction #${transaction.id}`);
    // TODO: Implement rollback transaction API call
  }

  // Bulk actions
  onBulkEdit(): void {
    const ids = this.selectedRows().map((t) => t.id);
    this.toastService.info(`Bulk edit ${ids.length} transactions`);
    // TODO: Implement bulk edit modal/flow
  }

  onBulkCancel(): void {
    const ids = this.selectedRows().map((t) => t.id);
    this.toastService.warning(`Cancel ${ids.length} transactions?`);
    // TODO: Implement bulk cancel with confirmation
  }

  onBulkExport(): void {
    const transactions = this.selectedRows();
    this.toastService.info(`Exporting ${transactions.length} transactions`);
    // TODO: Implement bulk export
  }

  onClearSelection(): void {
    if (this.gridApi) {
      this.gridApi.deselectAll();
    }
    this.selectedRows.set([]);
  }

  // Create datasource for infinite scrolling
  private createDatasource(): IDatasource {
    // Reset pagination stats when creating new datasource
    this.paginationStats.set({
      totalCount: 0,
      loadedCount: 0,
      currentRangeStart: 0,
      currentRangeEnd: 0,
      isLoading: true,
    });

    return createTransactionsDatasource(this.transactionService, this.logger, {
      getSearchTerm: () => this.store.searchTerm(),
      onPaginationUpdate: (stats) => this.paginationStats.set(stats),
    });
  }
}
