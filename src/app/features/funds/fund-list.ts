import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Fund, PaginatedResponse } from '../../models/fund.model';
import { FundService } from '../../services/fund';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FundsStore } from './funds-store';
import { LoggerService } from '../../services/logger';
import { PageHeader } from '../../layout/page-header/page-header';
import { DataTable } from '../../shared/components/data-table/data-table';
import { TableColumn } from '../../shared/components/data-table/data-table.model';

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
    DataTable
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

  collectionSize = computed(() => this.fundsResponse()?.totalCount ?? 0);
  funds = computed(() => this.fundsResponse()?.items ?? []);

  // Define table columns configuration
  columns: TableColumn<Fund>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      align: 'end',
      accessor: (fund) => fund.code
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      align: 'start',
      accessor: (fund) => fund.name
    },
    {
      key: 'baseCurrency',
      label: 'Base Currency',
      sortable: true,
      align: 'center',
      accessor: (fund) => fund.baseCurrency
    },
    {
      key: 'inceptionDate',
      label: 'Inception Date',
      sortable: true,
      align: 'center',
      accessor: (fund) => fund.inceptionDate,
      formatter: (value: string) => new Date(value).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric' 
      })
    },
    {
      key: 'valuationFrequencyDescription',
      label: 'Valuation Frequency',
      sortable: true,
      align: 'center',
      accessor: (fund) => fund.valuationFrequencyDescription
    }
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

  onDropdownOpenChange(isOpen: boolean, fundId: number): void {
    // Active row is now managed internally by the DataTable component
    // No need to manage it here anymore
  }

  trackByFundId(index: number, fund: Fund): number {
    return fund.id;
  }
}
