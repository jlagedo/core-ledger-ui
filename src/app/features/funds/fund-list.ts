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
import {DatePipe} from '@angular/common';
import {Fund, PaginatedResponse} from '../../models/fund.model';
import {FundService} from '../../services/fund';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbPagination
} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SortableDirective, SortEvent} from '../../directives/sortable.directive';
import {FundsStore} from './funds-store';
import {ToastService} from '../../services/toast-service';
import {LoggerService} from '../../services/logger';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-fund-list',
  imports: [RouterLink, NgbPagination, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, FormsModule, SortableDirective, NgbDropdownItem, DatePipe, PageHeader],
  providers: [FundsStore],
  templateUrl: './fund-list.html',
  styleUrl: './fund-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundList {
  store = inject(FundsStore);
  fundService = inject(FundService);
  destroyRef = inject(DestroyRef);
  toastService = inject(ToastService);
  logger = inject(LoggerService);

  fundsResponse = signal<PaginatedResponse<Fund> | null>(null);

  collectionSize = computed(() => this.fundsResponse()?.totalCount ?? 0);

  headers = viewChildren(SortableDirective);

  constructor() {
    effect(() => {
      this.loadFunds();
    });

    effect(() => {
      const headers = this.headers();
      const sortColumn = this.store.sortColumn();
      const sortDirection = this.store.sortDirection();

      for (const header of headers) {
        if (header.sortable() === sortColumn) {
          header.direction.set(sortDirection);
        } else {
          header.direction.set('');
        }
      }
    });
  }

  onSearch(value: string): void {
    this.store.setSearchTerm(value.trim());
    this.loadFunds();
  }

  onSort({column, direction}: SortEvent): void {
    for (const header of this.headers()) {
      if (header.sortable() !== column) {
        header.direction.set('');
      }
    }

    if (direction === '') {
      this.store.resetSort();
    } else {
      this.store.setSort(column || 'Name', direction);
    }

    this.loadFunds();
  }

  public loadFunds(): void {
    const search = this.store.searchTerm();
    const filter = search ? `name=${search}` : undefined;
    const offset = (this.store.page() - 1) * this.store.pageSize();

    this.fundService.getFunds(
      this.store.pageSize(),
      offset,
      this.store.sortColumn(),
      this.store.sortDirection(),
      filter
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.fundsResponse.set(response),
        error: err => this.logger.logHttpError('load funds', err, 'Failed to load funds. Please try again.')
      });
  }

  onPageSizeChange(newSize: number): void {
    this.store.setPageSize(newSize);
    this.loadFunds();
  }
}
