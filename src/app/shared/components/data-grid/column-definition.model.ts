import { TemplateRef } from '@angular/core';

/**
 * Alignment options for table columns
 */
export type ColumnAlignment = 'start' | 'center' | 'end';

/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc' | '';

/**
 * Formatter function to transform cell values before display
 * @param value - The raw value from the data object
 * @param item - The complete row data object
 * @returns Formatted string for display
 */
export type CellFormatter<T> = (value: unknown, item: T) => string;

/**
 * Column definition for the data grid
 * @template T - The type of data being displayed in the grid
 */
export interface ColumnDefinition<T> {
  /**
   * Property key from the data object (type-safe via keyof T)
   */
  key: keyof T;

  /**
   * Display label for the column header
   */
  label: string;

  /**
   * Whether this column can be sorted
   * @default false
   */
  sortable?: boolean;

  /**
   * Column name to use for sorting (if different from key)
   * Useful when backend sort field differs from model property
   */
  sortKey?: string;

  /**
   * Text alignment for this column
   * @default 'start'
   */
  align?: ColumnAlignment;

  /**
   * Custom template reference for cell rendering
   * When provided, this takes precedence over formatter and default rendering
   */
  template?: TemplateRef<CellTemplateContext<T>>;

  /**
   * Simple formatter function for value transformation
   * Only used if template is not provided
   */
  formatter?: CellFormatter<T>;

  /**
   * CSS class(es) to apply to cells in this column
   */
  cellClass?: string;

  /**
   * CSS class(es) to apply to the header cell
   */
  headerClass?: string;

  /**
   * Whether to hide this column on small screens
   * @default false
   */
  hideOnMobile?: boolean;

  /**
   * Minimum width for this column (CSS value, e.g., '120px')
   */
  minWidth?: string;
}

/**
 * Context object passed to custom cell templates
 */
export interface CellTemplateContext<T> {
  /**
   * The complete row data object
   */
  $implicit: T;

  /**
   * The specific cell value for this column
   */
  value: unknown;

  /**
   * The column definition
   */
  column: ColumnDefinition<T>;

  /**
   * Row index (0-based)
   */
  index: number;
}

/**
 * Selection state for the data grid
 */
export interface SelectionState<T> {
  /**
   * All currently selected items
   */
  selectedItems: T[];

  /**
   * Whether all items on current page are selected
   */
  allSelected: boolean;

  /**
   * Whether some (but not all) items on current page are selected
   */
  indeterminate: boolean;
}
