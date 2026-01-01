import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Fund, PaginatedResponse } from '../../models/fund.model';
import { FundService } from '../../services/fund';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FundsStore } from './funds-store';
import { LoggerService } from '../../services/logger';
import { PageHeader } from '../../layout/page-header/page-header';
import { DataTable, TableColumn } from '../../shared/components/data-table';

@Component({
  selector: 'app-fund-list',
  imports: [
    RouterLink,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    FormsModule,
    NgbDropdownItem,
    PageHeader,
    DataTable,
  ],
  providers: [FundsStore],
  templateUrl: './fund-list.html',
  styleUrl: './fund-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundList {
  store = inject(FundsStore);
  fundService = inject(FundService);
  destroyRef = inject(DestroyRef);
  logger = inject(LoggerService);

  fundsResponse = signal<PaginatedResponse<Fund> | null>(null);

  funds = computed(() => this.fundsResponse()?.items ?? []);
  collectionSize = computed(() => this.fundsResponse()?.totalCount ?? 0);

  columns: TableColumn<Fund>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      headerClass: 'text-end fw-bold',
      cellClass: 'text-end',
      formatter: (value) => value,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      headerClass: 'text-start fw-bold',
      cellClass: 'text-start',
    },
    {
      key: 'baseCurrency',
      label: 'Base Currency',
      sortable: true,
      headerClass: 'text-center fw-bold',
      cellClass: 'text-center',
    },
    {
      key: 'inceptionDate',
      label: 'Inception Date',
      sortable: true,
      headerClass: 'text-center fw-bold',
      cellClass: 'text-center text-muted',
      formatter: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
      },
    },
    {
      key: 'valuationFrequencyDescription',
      label: 'Valuation Frequency',
      sortable: false,
      headerClass: 'text-center fw-bold',
      cellClass: 'text-center',
    },
  ];

  constructor() {
    effect(() => {
      this.loadFunds();
    });
  }

  onSearch(value: string): void {
    this.store.setSearchTerm(value.trim());
    this.loadFunds();
  }

  public loadFunds(): void {
    const search = this.store.searchTerm();
    const filter = search ? `name=${search}` : undefined;
    const offset = (this.store.page() - 1) * this.store.pageSize();

    this.fundService
      .getFunds(
        this.store.pageSize(),
        offset,
        this.store.sortColumn(),
        this.store.sortDirection(),
        filter
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.fundsResponse.set(response),
        error: (err) =>
          this.logger.logHttpError('load funds', err, 'Failed to load funds. Please try again.'),
      });
  }

  onPageSizeChange(newSize: number): void {
    this.store.setPageSize(newSize);
    this.loadFunds();
  }
}
