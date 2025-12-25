import {ChangeDetectionStrategy, Component, computed, inject, QueryList, signal, ViewChildren} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Account, PaginatedResponse} from '../../models/account.model';
import {AccountService} from '../../services/account';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SortableDirective, SortEvent} from '../../directives/sortable.directive';

@Component({
  selector: 'app-chart-of-accounts',
  imports: [RouterLink, NgbPagination, FormsModule, SortableDirective],
  templateUrl: './chart-of-accounts.html',
  styleUrl: './chart-of-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccounts {
  accountService = inject(AccountService);

  searchTerm = signal('');
  accountsResponse = signal<PaginatedResponse<Account> | null>(null);
  sortColumn = signal('code');
  sortDirection = signal<'asc' | 'desc'>('desc');

  collectionSize = computed( () => this.accountsResponse()?.totalCount ?? 0);
  page = signal(1);
  pageSize = signal(15);

  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;

  constructor() {
    this.loadAccounts();
  }

  onSearch(value: string): void {
    this.searchTerm.set(value.trim());
    this.page.set(1);
    this.loadAccounts();
  }

  onSort({ column, direction }: SortEvent): void {
    // Reset other headers
    for (const header of this.headers) {
      if (header.sortable !== column) {
        header.direction = '';
      }
    }

    // If direction is empty, reset to default sorting
    if (direction === '') {
      this.sortColumn.set('code');
      this.sortDirection.set('desc');
    } else {
      this.sortColumn.set(column || 'code');
      this.sortDirection.set(direction);
    }
    
    this.page.set(1);
    this.loadAccounts();
  }

  public  loadAccounts(): void {
    const search = this.searchTerm();
    const filter = search ? `name=${search}` : undefined;
    const offset = (this.page() - 1) * this.pageSize();

    this.accountService.getAccounts(
      this.pageSize(),
      offset,
      this.sortColumn(),
      this.sortDirection(),
      filter
    ).subscribe(response => {
      this.accountsResponse.set(response);
    });
  }

  onPageSizeChange(): void {
    this.page.set(1);
    this.loadAccounts();
  }

}
