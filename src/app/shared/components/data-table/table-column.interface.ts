import { TemplateRef } from '@angular/core';

/**
 * Context passed to custom cell templates
 */
export interface TableCellContext<T> {
  /** The data item for the current row */
  $implicit: T;
  /** The column key */
  column: string;
  /** The row index */
  index: number;
}

/**
 * Formatter function for common value transformations
 */
export type CellFormatter<T> = (value: any, item: T) => string;

/**
 * Column configuration for the data table
 */
export interface TableColumn<T> {
  /** Column key/identifier (used for sorting and data access) */
  key: string;
  /** Display label for column header */
  label: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** CSS classes for header cell */
  headerClass?: string;
  /** CSS classes for data cells */
  cellClass?: string;
  /** Custom template for rendering cells in this column */
  cellTemplate?: TemplateRef<TableCellContext<T>>;
  /** Optional formatter function for simple transformations */
  formatter?: CellFormatter<T>;
  /** Property path for accessing nested values (e.g., 'user.name') */
  propertyPath?: string;
}
