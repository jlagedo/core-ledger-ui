import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  viewChildren
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {Account, PaginatedResponse} from '../../models/account.model';
import {AccountService} from '../../services/account';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbPagination
} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SortableDirective, SortEvent} from '../../directives/sortable.directive';
import {ChartOfAccountsStore} from './chart-of-accounts-store';
import {DeactivateModal} from './deactivate-modal/deactivate-modal';

@Component({
  selector: 'app-chart-of-accounts',
  imports: [RouterLink, NgbPagination, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, FormsModule, SortableDirective, NgbDropdownItem],
  providers: [ChartOfAccountsStore],
  templateUrl: './chart-of-accounts.html',
  styleUrl: './chart-of-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccounts {
  store = inject(ChartOfAccountsStore);
  accountService = inject(AccountService);
  destroyRef = inject(DestroyRef);
  modal = inject(NgbModal);

  accountsResponse = signal<PaginatedResponse<Account> | null>(null);

  collectionSize = computed(() => this.accountsResponse()?.totalCount ?? 0);

  headers = viewChildren(SortableDirective);

  constructor() {
    effect(() => {
      this.loadAccounts();
    });

    effect(() => {
      const headers = this.headers();
      const sortColumn = this.store.sortColumn();
      const sortDirection = this.store.sortDirection();

      for (const header of headers) {
        if (header.sortable === sortColumn) {
          header.direction = sortDirection;
        } else {
          header.direction = '';
        }
      }
    });
  }

  onSearch(value: string): void {
    this.store.setSearchTerm(value.trim());
    this.loadAccounts();
  }

  onSort({column, direction}: SortEvent): void {
    // Reset other headers
    for (const header of this.headers()) {
      if (header.sortable !== column) {
        header.direction = '';
      }
    }

    // If direction is empty, reset to default sorting
    if (direction === '') {
      this.store.resetSort();
    } else {
      this.store.setSort(column || 'code', direction);
    }

    this.loadAccounts();
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
        error: err => console.error('Failed to load accounts:', err)
      });
  }

  onPageSizeChange(newSize: number): void {
    this.store.setPageSize(newSize);
    this.loadAccounts();
  }

  openDeactivateModal(account: Account): void {
    const modalRef = this.modal.open(DeactivateModal);
    modalRef.componentInstance.account.set(account);

    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          // Call your deactivation API here
          this.accountService.deactivateAccount(account.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.loadAccounts();
                modalRef.close();
              },
              error: err => console.error('Failed to deactivate account:', err)
            });
          console.log('Deactivating account:', account.id);
        }
      },
      () => {
        // Modal dismissed
      }
    );
  }

}
