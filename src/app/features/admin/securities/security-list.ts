import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  TemplateRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PaginatedResponse, Security } from '../../../models/security.model';
import { SecurityService } from '../../../services/security';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { SecuritiesStore } from './securities-store';
import { DeactivateModal } from './deactivate-modal/deactivate-modal';
import { ImportB3Modal } from './import-b3-modal/import-b3-modal';
import { ToastService } from '../../../services/toast-service';
import { LoggerService } from '../../../services/logger';
import { PageHeader } from '../../../layout/page-header/page-header';
import { DataGrid } from '../../../shared/components/data-grid/data-grid';
import { ColumnDefinition } from '../../../shared/components/data-grid/column-definition.model';

@Component({
  selector: 'app-security-list',
  imports: [RouterLink, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbDropdownItem, PageHeader, DataGrid],
  providers: [SecuritiesStore, DatePipe],
  templateUrl: './security-list.html',
  styleUrl: './security-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityList {
  store = inject(SecuritiesStore);
  securityService = inject(SecurityService);
  destroyRef = inject(DestroyRef);
  modal = inject(NgbModal);
  toastService = inject(ToastService);
  logger = inject(LoggerService);
  datePipe = inject(DatePipe);

  securitiesResponse = signal<PaginatedResponse<Security> | null>(null);

  // Column definitions for data grid
  columns: ColumnDefinition<Security>[] = [
    {
      key: 'ticker',
      label: 'Ticker',
      sortable: true,
      sortKey: 'Ticker',
      align: 'start',
      cellClass: 'fw-bold'
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'Name',
      align: 'start'
    },
    {
      key: 'isin',
      label: 'ISIN',
      sortable: false,
      align: 'center',
      formatter: (value) => ((value as string | null) || 'N/A')
    },
    {
      key: 'typeDescription',
      label: 'Type',
      sortable: true,
      sortKey: 'Type',
      align: 'center'
    },
    {
      key: 'currency',
      label: 'Currency',
      sortable: true,
      sortKey: 'Currency',
      align: 'center'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortKey: 'Status',
      align: 'center',
      cellClass: 'text-center'
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      sortKey: 'CreatedAt',
      align: 'center',
      formatter: (value) => this.datePipe.transform(value as string, 'shortDate') || ''
    }
  ];

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: false }) statusTemplate!: TemplateRef<any>;

  constructor() {
    effect(() => {
      this.loadSecurities();
    });
  }

  ngAfterViewInit(): void {
    // Update status column template after view initialization
    if (this.statusTemplate) {
      const statusColumn = this.columns.find(col => col.key === 'status');
      if (statusColumn) {
        statusColumn.template = this.statusTemplate;
      }
    }
  }

  public loadSecurities(): void {
    const search = this.store.searchTerm();
    const filter = search ? `name=${search}` : undefined;
    const offset = (this.store.page() - 1) * this.store.pageSize();

    this.securityService.getSecurities(
      this.store.pageSize(),
      offset,
      this.store.sortColumn(),
      this.store.sortDirection(),
      filter
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.securitiesResponse.set(response),
        error: err => this.logger.logHttpError('load securities', err, 'Failed to load securities. Please try again.')
      });
  }

  openDeactivateModal(security: Security): void {
    const modalRef = this.modal.open(DeactivateModal);
    modalRef.componentInstance.security.set(security);

    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.securityService.deactivateSecurity(security.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.loadSecurities();
                modalRef.close();
                this.toastService.success(`Security "${security.name}" deactivated successfully`);
              },
              error: err => {
                const errorMessage = err?.error?.message || err?.message || 'Failed to deactivate security. Please try again.';
                this.logger.logHttpError('deactivate security', err, errorMessage, false);
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

  openImportB3Modal(): void {
    const modalRef = this.modal.open(ImportB3Modal);

    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.securityService.importB3InstructionFile()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (response) => {
                modalRef.close();
                this.toastService.success(
                  `B3 import job created successfully (Job ID: ${response.coreJobId}, Reference: ${response.referenceId})`
                );
              },
              error: err => {
                const errorMessage = err?.error?.message || err?.message || 'Failed to import B3 instruction file. Please try again.';
                this.logger.logHttpError('import B3 instruction file', err, errorMessage, false);
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
