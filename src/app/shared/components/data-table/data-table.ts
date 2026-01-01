import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  input,
  output,
  signal,
  TemplateRef,
  viewChildren
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { SortableDirective, SortEvent } from '../../../directives/sortable.directive';
import {
  PaginatedSearchStore,
  TableCellContext,
  TableColumn
} from './data-table.model';

/**
 * Reusable data table component with sorting, pagination, and custom templates
 *
 * @example
 * ```html
 * <app-data-table
 *   [columns]="columns"
 *   [items]="items()"
 *   [store]="store"
 *   [collectionSize]="totalCount()"
 *   (reload)="loadData()">
 *
 *   <!-- Custom cell template -->
 *   <ng-template #cellTemplate let-row let-column="column" let-value="value">
 *     @if (column.key === 'status') {
 *       <span class="badge bg-success">{{ value }}</span>
 *     } @else {
 *       {{ value }}
 *     }
 *   </ng-template>
 *
 *   <!-- Custom actions template -->
 *   <ng-template #actionsTemplate let-row>
 *     <button class="btn btn-sm btn-secondary">Edit</button>
 *   </ng-template>
 * </app-data-table>
 * ```
 */
@Component({
  selector: 'app-data-table',
  imports: [NgTemplateOutlet, NgbPagination, SortableDirective],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T> {
  /** Column configurations */
  readonly columns = input.required<TableColumn<T>[]>();

  /** Data items to display */
  readonly items = input.required<T[]>();

  /** Store instance for pagination and sorting */
  readonly store = input.required<PaginatedSearchStore>();

  /** Total number of items (for pagination) */
  readonly collectionSize = input.required<number>();

  /** Track by function for *ngFor */
  readonly trackBy = input<(index: number, item: T) => any>(
    (index: number) => index
  );

  /** Whether to show loading state */
  readonly loading = input<boolean>(false);

  /** Whether to show error state */
  readonly error = input<boolean>(false);

  /** Error message to display */
  readonly errorMessage = input<string>('Failed to load data.');

  /** Loading message to display */
  readonly loadingMessage = input<string>('Loading data…');

  /** Event emitted when data needs to be reloaded */
  readonly reload = output<void>();

  /** Custom cell template (passed via content projection) */
  readonly cellTemplate = contentChild<TemplateRef<TableCellContext<T>>>('cellTemplate');

  /** Custom actions template (passed via content projection) */
  readonly actionsTemplate = contentChild<TemplateRef<{ $implicit: T; index: number }>>('actionsTemplate');

  /** Internal state for active row */
  readonly activeRowId = signal<number | string | null>(null);

  /** View children for sortable headers */
  readonly headers = viewChildren(SortableDirective);

  constructor() {
    // Sync header directions with store sort state
    effect(() => {
      const headers = this.headers();
      const sortColumn = this.store().sortColumn();
      const sortDirection = this.store().sortDirection();

      for (const header of headers) {
        if (header.sortable() === sortColumn) {
          header.direction.set(sortDirection);
        } else {
          header.direction.set('');
        }
      }
    });
  }

  /**
   * Handle sort event from column header
   */
  onSort({ column, direction }: SortEvent): void {
    // Clear direction on all other headers
    for (const header of this.headers()) {
      if (header.sortable() !== column) {
        header.direction.set('');
      }
    }

    if (direction === '') {
      this.store().resetSort();
    } else {
      // Validate column exists before sorting
      if (column) {
        this.store().setSort(column, direction);
      }
    }

    this.reload.emit();
  }

  /**
   * Handle page change event
   */
  onPageChange(page: number): void {
    this.store().setPage(page);
    this.reload.emit();
  }

  /**
   * Set the active row (for highlighting)
   */
  setActiveRow(item: T, index: number): void {
    const trackByFn = this.trackBy();
    const id = trackByFn(index, item);
    this.activeRowId.set(id);
  }

  /**
   * Clear the active row
   */
  clearActiveRow(): void {
    this.activeRowId.set(null);
  }

  /**
   * Check if a row is active
   */
  isRowActive(item: T, index: number): boolean {
    const trackByFn = this.trackBy();
    const id = trackByFn(index, item);
    return this.activeRowId() === id;
  }

  /**
   * Get the value for a cell
   */
  getCellValue(row: T, column: TableColumn<T>): any {
    if (column.accessor) {
      return column.accessor(row);
    }
    return (row as any)[column.key];
  }

  /**
   * Get the formatted value for a cell
   */
  getFormattedValue(row: T, column: TableColumn<T>): string {
    const value = this.getCellValue(row, column);
    if (column.formatter) {
      return column.formatter(value, row);
    }
    return value?.toString() ?? '';
  }

  /**
   * Get the CSS class for column alignment
   */
  getAlignClass(align?: 'start' | 'center' | 'end'): string {
    switch (align) {
      case 'start':
        return 'text-start';
      case 'center':
        return 'text-center';
      case 'end':
        return 'text-end';
      default:
        return 'text-start';
    }
  }

  /**
   * Get the total number of columns (including actions if template is provided)
   */
  getColspan(): number {
    return this.columns().length + (this.actionsTemplate() ? 1 : 0);
  }
}
