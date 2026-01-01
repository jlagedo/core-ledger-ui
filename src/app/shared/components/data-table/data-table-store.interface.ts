import { Signal } from '@angular/core';

/**
 * Generic store interface that data-table component can work with
 */
export interface DataTableStore {
  searchTerm: Signal<string>;
  page: Signal<number>;
  pageSize: Signal<number>;
  sortColumn: Signal<string>;
  sortDirection: Signal<'asc' | 'desc'>;
  setSort(column: string, direction: 'asc' | 'desc'): void;
  resetSort(): void;
  setPage(page: number): void;
  setPageSize(pageSize: number): void;
  setSearchTerm(searchTerm: string): void;
}
