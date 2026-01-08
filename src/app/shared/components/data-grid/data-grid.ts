import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  viewChildren,
  viewChild,
  TemplateRef,
  TrackByFunction,
  afterNextRender,
  Injector,
  inject,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { SortableDirective, SortEvent } from '../../../directives/sortable.directive';
import { ColumnDefinition, CellTemplateContext, SelectionState } from './column-definition.model';
import { createPaginatedSearchStore } from '../../stores/paginated-search-store';

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
}

/**
 * Reusable data grid component with pagination, sorting, search, and row selection
 *
 * @template T - The type of data being displayed in the grid
 *
 * @example
 * ```typescript
 * columns: ColumnDefinition<Fund>[] = [
 *   { key: 'code', label: 'Code', sortable: true, align: 'end' },
 *   { key: 'name', label: 'Name', sortable: true },
 * ];
 * ```
 *
 * ```html
 * <app-data-grid
 *   [store]="store"
 *   [data]="fundsResponse()"
 *   [columns]="columns"
 *   [searchable]="true"
 *   (refresh)="loadFunds()">
 * </app-data-grid>
 * ```
 */
@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ScrollingModule, NgbPagination, SortableDirective],
})
export class DataGrid<T> {
  private readonly injector = inject(Injector);

  // Required inputs
  /** Store instance from createPaginatedSearchStore */
  store = input.required<InstanceType<ReturnType<typeof createPaginatedSearchStore>>>();

  /** Paginated data response */
  data = input.required<PaginatedResponse<T> | null>();

  /** Column definitions for the grid */
  columns = input.required<ColumnDefinition<T>[]>();

  // Optional inputs with defaults
  /** Whether data is currently loading */
  loading = input<boolean>(false);

  /** Whether to show search input */
  searchable = input<boolean>(true);

  /** Whether to show row selection checkboxes */
  selectable = input<boolean>(false);

  /** Placeholder text for search input */
  searchPlaceholder = input<string>('Search...');

  /** Message to display when no data available */
  emptyMessage = input<string>('No data available');

  /** Error message to display (if any) */
  errorMessage = input<string | null>(null);

  /** Template for row actions column */
  rowActionsTemplate = input<TemplateRef<{ $implicit: T }> | null>(null);

  /** Available page size options */
  pageSizeOptions = input<number[]>([15, 50, 100]);

  /** Enable virtual scrolling for large datasets */
  virtualScroll = input<boolean>(false);

  /** Row height in pixels for virtual scroll (required when virtualScroll is true) */
  rowHeight = input<number>(48);

  /** Height of the virtual scroll viewport (CSS value) */
  viewportHeight = input<string>('400px');

  /** Number of items before end to trigger load more (default: 10) */
  loadMoreThreshold = input<number>(10);

  /** Whether currently loading more items */
  loadingMore = input<boolean>(false);

  // Outputs
  /** Emitted when data should be refreshed */
  refresh = output<void>();

  /** Emitted when a row is clicked */
  rowClick = output<T>();

  /** Emitted when selection changes */
  selectionChange = output<T[]>();

  /** Emitted when more data should be loaded (infinite scroll) */
  loadMore = output<void>();

  // ViewChild for virtual scroll viewport
  readonly virtualScrollViewport = viewChild<CdkVirtualScrollViewport>('virtualScrollViewport');

  // Internal signals for state management
  /** Tracks if initial data has been loaded - used for aggressive preloading */
  private readonly _initialDataLoaded = signal<boolean>(false);

  /** Active row ID for highlighting */
  private readonly _activeRowId = signal<number | string | null>(null);
  readonly activeRowId = this._activeRowId.asReadonly();

  /** Selected items set */
  private readonly _selectedItems = signal<Set<T>>(new Set());

  /** Selected items as array */
  readonly selectedItemsArray = computed(() => Array.from(this._selectedItems()));

  /** Selection state computed from selected items */
  readonly selectionState = computed<SelectionState<T>>(() => {
    const currentPageItems = this.data()?.items || [];
    const selected = this._selectedItems();
    const selectedCount = currentPageItems.filter((item) => selected.has(item)).length;

    return {
      selectedItems: Array.from(selected),
      allSelected: selectedCount > 0 && selectedCount === currentPageItems.length,
      indeterminate: selectedCount > 0 && selectedCount < currentPageItems.length,
    };
  });

  /** Total count from paginated response */
  readonly collectionSize = computed(() => this.data()?.totalCount ?? 0);

  /** Current page items */
  readonly currentPageItems = computed(() => this.data()?.items ?? []);

  /** Whether there are more items to load */
  readonly hasMoreItems = computed(() => {
    const items = this.currentPageItems();
    const total = this.collectionSize();
    return items.length < total;
  });

  /** Sortable header directives */
  headers = viewChildren(SortableDirective);

  constructor() {
    // Effect: Sync sort state from store to header directives
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

    // Effect: Emit selection changes
    effect(() => {
      const selected = this.selectedItemsArray();
      this.selectionChange.emit(selected);
    });

    // Effect: Reset initial data flag when data is cleared (e.g., on search/refresh)
    effect(() => {
      const items = this.currentPageItems();
      if (items.length === 0 && this._initialDataLoaded()) {
        this._initialDataLoaded.set(false);
      }
    });

    // Effect: Preload next batch after initial data loads
    // Fixes race condition where scrolledIndexChange fires before data arrives
    // Uses a flag to prevent queuing multiple afterNextRender callbacks
    let pendingPreloadCheck = false;
    effect(() => {
      const items = this.currentPageItems();
      const hasMore = this.hasMoreItems();
      const isLoadingMore = this.loadingMore();
      const isVirtualScroll = this.virtualScroll();
      const initialDataLoaded = this._initialDataLoaded();

      // Only trigger for virtual scroll mode when we have data and more items available
      if (!isVirtualScroll || isLoadingMore || !hasMore || items.length === 0) {
        return;
      }

      // Prevent queuing multiple callbacks
      if (pendingPreloadCheck) {
        return;
      }
      pendingPreloadCheck = true;

      // Capture whether this is the first data load
      const isFirstLoad = !initialDataLoaded;

      // Schedule check after next render to ensure viewport exists
      afterNextRender(
        () => {
          pendingPreloadCheck = false;

          // Re-read values to avoid stale closure data
          const viewport = this.virtualScrollViewport();
          const currentItems = this.currentPageItems();
          const stillHasMore = this.hasMoreItems();
          const stillLoadingMore = this.loadingMore();

          if (!viewport || !stillHasMore || stillLoadingMore || currentItems.length === 0) {
            return;
          }

          // Mark initial data as loaded
          if (!this._initialDataLoaded()) {
            this._initialDataLoaded.set(true);
          }

          const threshold = this.loadMoreThreshold();
          const scrollOffset = viewport.measureScrollOffset('top');
          const itemSize = this.rowHeight();
          const currentIndex = Math.floor(scrollOffset / itemSize);

          // On initial data load, always preload if there's more data
          // This ensures the next batch is ready before user starts scrolling
          const shouldPreload =
            isFirstLoad || currentIndex >= currentItems.length - threshold;

          if (shouldPreload) {
            this.loadMore.emit();
          }
        },
        { injector: this.injector }
      );
    });
  }

  /**
   * Handle search input
   */
  onSearch(value: string): void {
    this.store().setSearchTerm(value.trim());
    this.refresh.emit();
  }

  /**
   * Handle column sort
   */
  onSort({ column, direction }: SortEvent): void {
    // Reset other headers
    for (const header of this.headers()) {
      if (header.sortable() !== column) {
        header.direction.set('');
      }
    }

    // Update store
    if (direction === '') {
      this.store().resetSort();
    } else {
      this.store().setSort(column, direction);
    }

    this.refresh.emit();
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    this.store().setPage(page);
    this.refresh.emit();
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(newSize: number): void {
    this.store().setPageSize(newSize);
    this.refresh.emit();
  }

  /**
   * Handle virtual scroll index change (infinite scroll)
   */
  onScrolledIndexChange(index: number): void {
    if (!this.virtualScroll() || this.loadingMore() || !this.hasMoreItems()) {
      return;
    }

    const items = this.currentPageItems();
    const threshold = this.loadMoreThreshold();

    // Check if we're near the end of the list
    if (index >= items.length - threshold) {
      this.loadMore.emit();
    }
  }

  /**
   * Handle row click
   */
  onRowClick(item: T): void {
    const itemId = this.getItemId(item);
    this._activeRowId.set(itemId);
    this.rowClick.emit(item);
  }

  /**
   * Toggle select all items on current page
   */
  toggleSelectAll(): void {
    const state = this.selectionState();
    const currentItems = this.currentPageItems();
    const updated = new Set(this._selectedItems());

    if (state.allSelected) {
      // Deselect all items on current page
      currentItems.forEach((item) => updated.delete(item));
    } else {
      // Select all items on current page
      currentItems.forEach((item) => updated.add(item));
    }

    this._selectedItems.set(updated);
  }

  /**
   * Toggle selection of individual item
   */
  toggleItemSelection(item: T): void {
    const updated = new Set(this._selectedItems());

    if (updated.has(item)) {
      updated.delete(item);
    } else {
      updated.add(item);
    }

    this._selectedItems.set(updated);
  }

  /**
   * Check if item is selected
   */
  isItemSelected(item: T): boolean {
    return this._selectedItems().has(item);
  }

  /**
   * Clear all selections
   */
  clearSelection(): void {
    this._selectedItems.set(new Set());
  }

  /**
   * Get cell value for a column
   */
  getCellValue(item: T, column: ColumnDefinition<T>): unknown {
    return item[column.key];
  }

  /**
   * Get formatted cell value (using formatter if available)
   */
  getFormattedValue(item: T, column: ColumnDefinition<T>): string {
    const value = this.getCellValue(item, column);

    if (column.formatter) {
      return column.formatter(value, item);
    }

    return value != null ? String(value) : '';
  }

  /**
   * Get sort key for column (uses sortKey if defined, otherwise key)
   */
  getSortKey(column: ColumnDefinition<T>): string {
    return column.sortKey ?? String(column.key);
  }

  /**
   * Get template context for cell
   */
  getCellContext(item: T, column: ColumnDefinition<T>, index: number): CellTemplateContext<T> {
    return {
      $implicit: item,
      value: this.getCellValue(item, column),
      column,
      index,
    };
  }

  /**
   * Get unique ID for item (attempts to use id property, falls back to JSON stringify)
   */
  getItemId(item: T): number | string {
    const itemWithId = item as unknown as { id?: number | string };
    return itemWithId.id ?? JSON.stringify(item);
  }

  /**
   * TrackBy function for virtual scroll
   */
  trackByFn: TrackByFunction<T> = (index: number, item: T): number | string => {
    return this.getItemId(item);
  };
}
