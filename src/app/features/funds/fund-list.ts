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
import { Fund, PaginatedResponse } from '../../models/fund.model';
import { FundService } from '../../services/fund';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from '@ng-bootstrap/ng-bootstrap';
import { FundsStore } from './funds-store';
import { LoggerService } from '../../services/logger';
import { PageHeader } from '../../layout/page-header/page-header';
import { DataGrid } from '../../shared/components/data-grid/data-grid';
import { ColumnDefinition } from '../../shared/components/data-grid/column-definition.model';

@Component({
  selector: 'app-fund-list',
  imports: [RouterLink, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbDropdownItem, PageHeader, DataGrid],
  providers: [FundsStore, DatePipe],
  templateUrl: './fund-list.html',
  styleUrl: './fund-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundList {
  store = inject(FundsStore);
  fundService = inject(FundService);
  destroyRef = inject(DestroyRef);
  logger = inject(LoggerService);
  datePipe = inject(DatePipe);

  fundsResponse = signal<PaginatedResponse<Fund> | null>(null);

  // Column definitions for data grid
  columns: ColumnDefinition<Fund>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      sortKey: 'Code',
      align: 'end',
      cellClass: 'numeric font-monospace fw-bold text-info text-nowrap'
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'Name',
      align: 'start'
    },
    {
      key: 'baseCurrency',
      label: 'Base Currency',
      sortable: true,
      sortKey: 'BaseCurrency',
      align: 'center'
    },
    {
      key: 'inceptionDate',
      label: 'Inception Date',
      sortable: true,
      sortKey: 'InceptionDate',
      align: 'center',
      cellClass: 'font-monospace text-nowrap',
      formatter: (value) => this.datePipe.transform(value as string, 'MM/dd/yyyy') || ''
    },
    {
      key: 'valuationFrequencyDescription',
      label: 'Valuation Frequency',
      sortable: true,
      sortKey: 'ValuationFrequency',
      align: 'center'
    }
  ];

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  constructor() {
    effect(() => {
      this.loadFunds();
    });
  }

  loadFunds(): void {
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
}
