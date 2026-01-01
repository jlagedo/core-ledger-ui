import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  output,
  signal,
  TemplateRef,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SortableDirective, SortEvent } from '../../../directives/sortable.directive';
import { TableColumn, TableCellContext } from './table-column.interface';
import { DataTableStore } from './data-table-store.interface';

/**
 * Reusable data table component with sorting, pagination, and custom rendering
 *
 * @example
 * ```html
 * <app-data-table
 *   [columns]="columns"
 *   [data]="items"
 *   [store]="store"
 *   [totalCount]="totalCount"
 *   (reload)="loadData()">
 *   <ng-template #actions let-item>
 *     <button>Edit</button>
 *   </ng-template>
 * </app-data-table>
 * ```
 */
@Component({
  selector: 'app-data-table',
  imports: [NgbPagination, FormsModule, SortableDirective, NgTemplateOutlet],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T extends Record<string, any>> {
  /** Column configurations */
  columns = input.required<TableColumn<T>[]>();

  /** Data items to display */
  data = input<T[]>([]);

  /** Store for pagination and sorting state */
  store = input.required<DataTableStore>();

  /** Total count for pagination */
  totalCount = input<number>(0);

  /** Loading state */
  loading = input<boolean>(false);

  /** Error state */
  error = input<boolean>(false);

  /** Track items by this property (default: 'id') */
  trackBy = input<keyof T>('id' as keyof T);

  /** Emitted when data should be reloaded */
  reload = output<void>();

  /** Custom actions template */
  actionsTemplate = contentChild<TemplateRef<TableCellContext<T>>>('actions');

  /** Active row ID for highlighting */
  activeRowId = signal<any>(null);

  /** Reference to sortable directive instances */
  headers = viewChildren(SortableDirective);

  /** Computed property for collection size */
  collectionSize = computed(() => this.totalCount());

  constructor() {
    // Sync sortable directive states with store
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
    // Clear all other headers
    for (const header of this.headers()) {
      if (header.sortable() !== column) {
        header.direction.set('');
      }
    }

    if (direction === '') {
      this.store().resetSort();
    } else {
      // Column should always be defined when direction is set
      if (!column) {
        console.warn('Sort event triggered without a column name');
        return;
      }
      this.store().setSort(column, direction);
    }

    this.reload.emit();
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(newSize: number): void {
    this.store().setPageSize(newSize);
    this.reload.emit();
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    this.store().setPage(page);
    this.reload.emit();
  }

  /**
   * Set active row for highlighting
   */
  setActiveRow(item: T): void {
    const trackByKey = this.trackBy();
    this.activeRowId.set(item[trackByKey]);
  }

  /**
   * Clear active row
   */
  clearActiveRow(): void {
    this.activeRowId.set(null);
  }

  /**
   * Get cell value using property path or key
   */
  getCellValue(item: T, column: TableColumn<T>): any {
    const path = column.propertyPath || column.key;
    const keys = path.split('.');
    let value: any = item;

    for (const key of keys) {
      // Explicit null/undefined check for safe property access
      if (value === null || value === undefined) return '';
      value = value[key];
    }

    return value;
  }

  /**
   * Format cell value using formatter if provided
   */
  formatCellValue(item: T, column: TableColumn<T>): string {
    const value = this.getCellValue(item, column);

    if (column.formatter) {
      return column.formatter(value, item);
    }

    return value?.toString() ?? '';
  }

  /**
   * Get cell context for template
   */
  getCellContext(item: T, column: TableColumn<T>, index: number): TableCellContext<T> {
    return {
      $implicit: item,
      column: column.key,
      index,
    };
  }

  /**
   * Track items by the specified key
   */
  trackByFn = (index: number, item: T): any => {
    const trackByKey = this.trackBy();
    return item[trackByKey];
  };
}
