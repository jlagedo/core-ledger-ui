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
import {PaginatedResponse, Security} from '../../../models/security.model';
import {SecurityService} from '../../../services/security';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbPagination
} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SortableDirective, SortEvent} from '../../../directives/sortable.directive';
import {SecuritiesStore} from './securities-store';
import {DeactivateModal} from './deactivate-modal/deactivate-modal';
import {ImportB3Modal} from './import-b3-modal/import-b3-modal';
import {ToastService} from '../../../services/toast-service';
import {LoggerService} from '../../../services/logger';
import {PageHeader} from '../../../layout/page-header/page-header';

@Component({
  selector: 'app-security-list',
  imports: [RouterLink, NgbPagination, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, FormsModule, SortableDirective, NgbDropdownItem, DatePipe, PageHeader],
  providers: [SecuritiesStore],
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

  securitiesResponse = signal<PaginatedResponse<Security> | null>(null);

  collectionSize = computed(() => this.securitiesResponse()?.totalCount ?? 0);

  headers = viewChildren(SortableDirective);

  // Expose Math to template
  Math = Math;

  constructor() {
    effect(() => {
      this.loadSecurities();
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
    this.loadSecurities();
  }

  onSort({column, direction}: SortEvent): void {
    // Reset other headers
    for (const header of this.headers()) {
      if (header.sortable() !== column) {
        header.direction.set('');
      }
    }

    // If direction is empty, reset to default sorting
    if (direction === '') {
      this.store.resetSort();
    } else {
      this.store.setSort(column || 'ticker', direction);
    }

    this.loadSecurities();
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

  onPageSizeChange(newSize: number): void {
    this.store.setPageSize(newSize);
    this.loadSecurities();
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
