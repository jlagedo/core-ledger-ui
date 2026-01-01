import { PaginatedSearchState } from '../../stores/paginated-search-store';

/**
 * Generic store interface that data-table component can work with
 */
export interface DataTableStore extends PaginatedSearchState {
  setSort(column: string, direction: 'asc' | 'desc'): void;
  resetSort(): void;
  setPage(page: number): void;
  setPageSize(pageSize: number): void;
  setSearchTerm(searchTerm: string): void;
}
