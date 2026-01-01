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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Account, PaginatedResponse } from '../../models/account.model';
import { AccountService } from '../../services/account';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { ChartOfAccountsStore } from './chart-of-accounts-store';
import { DeactivateModal } from './deactivate-modal/deactivate-modal';
import { ToastService } from '../../services/toast-service';
import { LoggerService } from '../../services/logger';
import { PageHeader } from '../../layout/page-header/page-header';
import { DataGrid } from '../../shared/components/data-grid/data-grid';
import { ColumnDefinition } from '../../shared/components/data-grid/column-definition.model';

@Component({
  selector: 'app-chart-of-accounts',
  imports: [RouterLink, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbDropdownItem, PageHeader, DataGrid],
  providers: [ChartOfAccountsStore, DatePipe],
  templateUrl: './chart-of-accounts.html',
  styleUrl: './chart-of-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccounts {
  store = inject(ChartOfAccountsStore);
  accountService = inject(AccountService);
  destroyRef = inject(DestroyRef);
  modal = inject(NgbModal);
  toastService = inject(ToastService);
  logger = inject(LoggerService);
  datePipe = inject(DatePipe);

  accountsResponse = signal<PaginatedResponse<Account> | null>(null);

  // Column definitions for data grid
  columns: ColumnDefinition<Account>[] = [
    {
      key: 'code',
      label: '#',
      sortable: true,
      sortKey: 'Code',
      align: 'end',
      cellClass: 'numeric font-monospace'
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'Name',
      align: 'start'
    },
    {
      key: 'typeDescription',
      label: 'Type',
      sortable: true,
      sortKey: 'TypeId',
      align: 'center'
    },
    {
      key: 'statusDescription',
      label: 'Status',
      sortable: true,
      sortKey: 'Status',
      align: 'center'
    },
    {
      key: 'normalBalanceDescription',
      label: 'Normal Balance',
      sortable: true,
      sortKey: 'NormalBalance',
      align: 'center'
    }
  ];

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  constructor() {
    effect(() => {
      this.loadAccounts();
    });
  }

  public loadAccounts(): void {
    const search = this.store.searchTerm();
    const filter = search ? `name=${search}` : undefined;
    const offset = (this.store.page() - 1) * this.store.pageSize();

    this.accountService.getAccounts(
      this.store.pageSize(),
      offset,
      this.store.sortColumn(),
      this.store.sortDirection(),
      filter
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.accountsResponse.set(response),
        error: err => this.logger.logHttpError('load accounts', err, 'Failed to load accounts. Please try again.')
      });
  }

  openDeactivateModal(account: Account): void {
    const modalRef = this.modal.open(DeactivateModal);
    modalRef.componentInstance.account.set(account);

    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.accountService.deactivateAccount(account.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.loadAccounts();
                modalRef.close();
                this.toastService.success(`Account "${account.name}" deactivated successfully`);
              },
              error: err => {
                const errorMessage = err?.error?.message || err?.message || 'Failed to deactivate account. Please try again.';
                this.logger.logHttpError('deactivate account', err, errorMessage, false);
                this.toastService.error(errorMessage);
              }
            });
        }
      },
      () => {
        // Modal dismissed
      }
    );
  }
}
