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
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ListRange } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, map } from 'rxjs/operators';
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
 * columns: ColumnDefinition<Item>[] = [
 *   { key: 'code', label: 'Code', sortable: true, align: 'end' },
 *   { key: 'name', label: 'Name', sortable: true },
 * ];
 * ```
 *
 * ```html
 * <app-data-grid
 *   [store]="store"
 *   [data]="itemsResponse()"
 *   [columns]="columns"
 *   [searchable]="true"
 *   (refresh)="loadItems()">
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

  // Scroll management for infinite scroll
  /** DestroyRef for cleanup */
  private readonly destroyRef = inject(DestroyRef);

  /** Subject to debounce load more requests */
  private readonly loadMoreSubject = new Subject<void>();

  /** Track if we've set up the renderedRangeStream subscription */
  private renderedRangeSubscribed = false;

  /** Debounce time in milliseconds for load more events */
  private readonly LOAD_MORE_DEBOUNCE_MS = 150;

  /** Active row ID for highlighting */
  private readonly _activeRowId = signal<number | string | null>(null);
  readonly activeRowId = this._activeRowId.asReadonly();

  /** Currently focused row index for keyboard navigation */
  private readonly _focusedRowIndex = signal<number>(-1);
  readonly focusedRowIndex = this._focusedRowIndex.asReadonly();

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

    // Debounced subscription for load more requests
    // Prevents rapid-fire events when scrolling quickly
    this.loadMoreSubject
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(this.LOAD_MORE_DEBOUNCE_MS),
        // Double-check conditions before emitting
        filter(() => !this.loadingMore() && this.hasMoreItems())
      )
      .subscribe(() => {
        this.loadMore.emit();
      });

    // Effect: Reset flags when data is cleared (e.g., on search/refresh)
    effect(() => {
      const items = this.currentPageItems();
      if (items.length === 0 && this._initialDataLoaded()) {
        this._initialDataLoaded.set(false);
        // Reset subscription flag so it re-subscribes on new data
        this.renderedRangeSubscribed = false;
      }
    });

    // Effect: Initialize renderedRangeStream subscription and handle initial preload
    // The effect tracks when data arrives and viewport becomes available
    effect(() => {
      const items = this.currentPageItems();
      const hasMore = this.hasMoreItems();
      const isLoadingMore = this.loadingMore();
      const isVirtualScroll = this.virtualScroll();
      const viewport = this.virtualScrollViewport();

      // Skip if not virtual scroll mode or no viewport yet
      if (!isVirtualScroll || !viewport) {
        return;
      }

      // Set up the renderedRangeStream subscription (idempotent)
      this.subscribeToRenderedRange();

      // Skip preload check if loading or no data or no more items
      if (isLoadingMore || !hasMore || items.length === 0) {
        return;
      }

      // Check if we need to preload on initial data arrival
      const isFirstLoad = !this._initialDataLoaded();

      if (isFirstLoad) {
        afterNextRender(
          () => {
            // Mark as loaded
            if (!this._initialDataLoaded()) {
              this._initialDataLoaded.set(true);
            }

            // Re-check conditions (may have changed)
            if (this.loadingMore() || !this.hasMoreItems()) {
              return;
            }

            // Trigger preload through the debounced subject
            this.loadMoreSubject.next();
          },
          { injector: this.injector }
        );
      }
    });
  }

  /**
   * Subscribe to the viewport's renderedRangeStream for more reliable
   * infinite scroll detection. This is more reliable than scrolledIndexChange
   * because it provides both start and end indices of the rendered range.
   */
  private subscribeToRenderedRange(): void {
    const viewport = this.virtualScrollViewport();
    if (!viewport || this.renderedRangeSubscribed) {
      return;
    }

    this.renderedRangeSubscribed = true;

    // Subscribe to rendered range changes
    viewport.renderedRangeStream
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // Only process when we should potentially load more
        filter(() => this.virtualScroll() && !this.loadingMore() && this.hasMoreItems()),
        // Extract the end index and compare against threshold
        map((range: ListRange) => {
          const items = this.currentPageItems();
          const threshold = this.loadMoreThreshold();
          const endIndex = range.end;
          const totalItems = items.length;

          // Check if rendered range end is within threshold of total loaded items
          return endIndex >= totalItems - threshold;
        }),
        // Only emit when the "should load" state changes to true
        distinctUntilChanged(),
        filter((shouldLoad) => shouldLoad)
      )
      .subscribe(() => {
        this.loadMoreSubject.next();
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
   * Handle virtual scroll index change (fallback for infinite scroll)
   * Primary detection is via renderedRangeStream, this provides additional coverage.
   */
  onScrolledIndexChange(index: number): void {
    if (!this.virtualScroll() || this.loadingMore() || !this.hasMoreItems()) {
      return;
    }

    const viewport = this.virtualScrollViewport();
    if (!viewport) {
      return;
    }

    // Use getRenderedRange for accurate end position
    // This is more accurate than using just the first visible index
    const range = viewport.getRenderedRange();
    const items = this.currentPageItems();
    const threshold = this.loadMoreThreshold();

    // Check if rendered range end is within threshold of total loaded items
    if (range.end >= items.length - threshold) {
      this.loadMoreSubject.next();
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

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================

  /**
   * Handle keyboard navigation within the data grid.
   * Supports arrow keys, Enter, Space, Home, End.
   */
  onGridKeydown(event: KeyboardEvent): void {
    const items = this.currentPageItems();
    if (items.length === 0) return;

    const currentIndex = this._focusedRowIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextRow(items, currentIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousRow(items, currentIndex);
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstRow(items);
        break;

      case 'End':
        event.preventDefault();
        this.focusLastRow(items);
        break;

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < items.length) {
          this.onRowClick(items[currentIndex]);
        }
        break;

      case ' ':
        // Space to toggle selection if selectable
        if (this.selectable() && currentIndex >= 0 && currentIndex < items.length) {
          event.preventDefault();
          this.toggleItemSelection(items[currentIndex]);
        }
        break;

      case 'PageDown':
        event.preventDefault();
        this.focusPageDown(items, currentIndex);
        break;

      case 'PageUp':
        event.preventDefault();
        this.focusPageUp(items, currentIndex);
        break;
    }
  }

  /**
   * Focus the next row
   */
  private focusNextRow(items: T[], currentIndex: number): void {
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    this.focusRow(nextIndex);
  }

  /**
   * Focus the previous row
   */
  private focusPreviousRow(items: T[], currentIndex: number): void {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    this.focusRow(prevIndex);
  }

  /**
   * Focus the first row
   */
  private focusFirstRow(items: T[]): void {
    if (items.length > 0) {
      this.focusRow(0);
    }
  }

  /**
   * Focus the last row
   */
  private focusLastRow(items: T[]): void {
    if (items.length > 0) {
      this.focusRow(items.length - 1);
    }
  }

  /**
   * Focus 10 rows down (page down)
   */
  private focusPageDown(items: T[], currentIndex: number): void {
    const nextIndex = Math.min(currentIndex + 10, items.length - 1);
    this.focusRow(nextIndex);
  }

  /**
   * Focus 10 rows up (page up)
   */
  private focusPageUp(items: T[], currentIndex: number): void {
    const prevIndex = Math.max(currentIndex - 10, 0);
    this.focusRow(prevIndex);
  }

  /**
   * Focus a specific row and update state
   */
  private focusRow(index: number): void {
    this._focusedRowIndex.set(index);
    const items = this.currentPageItems();
    if (index >= 0 && index < items.length) {
      this._activeRowId.set(this.getItemId(items[index]));
    }
  }

  /**
   * Handle row focus event
   */
  onRowFocus(index: number): void {
    this._focusedRowIndex.set(index);
  }
}
