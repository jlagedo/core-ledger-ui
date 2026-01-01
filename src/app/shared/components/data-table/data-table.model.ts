/**
 * Context object passed to custom cell templates
 */
export interface TableCellContext<T> {
  /** The row data item */
  $implicit: T;
  /** The column definition */
  column: TableColumn<T>;
  /** The current value of the cell */
  value: any;
  /** The row index */
  index: number;
}

/**
 * Column configuration for the data table
 */
export interface TableColumn<T> {
  /** Unique key identifying the column (used for sorting) */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Text alignment for the column */
  align?: 'start' | 'center' | 'end';
  /** Optional formatter function to transform the cell value */
  formatter?: (value: any, row: T) => string;
  /** Optional accessor function to get the value from the row */
  accessor?: (row: T) => any;
}

/**
 * Generic store interface for paginated search functionality
 */
export interface PaginatedSearchStore {
  /** Current search term */
  searchTerm: () => string;
  /** Current page number (1-indexed) */
  page: () => number;
  /** Number of items per page */
  pageSize: () => number;
  /** Current sort column key */
  sortColumn: () => string;
  /** Current sort direction */
  sortDirection: () => 'asc' | 'desc';
  /** Set the current page */
  setPage: (page: number) => void;
  /** Set the page size */
  setPageSize: (pageSize: number) => void;
  /** Set the search term */
  setSearchTerm: (term: string) => void;
  /** Set sort column and direction */
  setSort: (column: string, direction: 'asc' | 'desc') => void;
  /** Reset sort to initial values */
  resetSort: () => void;
}
