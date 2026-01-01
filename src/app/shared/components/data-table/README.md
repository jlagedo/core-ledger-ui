# Data Table Component Usage Guide

The `DataTable` component is a flexible, reusable table component for displaying paginated, sortable data with custom rendering capabilities.

## Basic Usage

### 1. Define Your Column Configuration

```typescript
import { TableColumn } from '../../shared/components/data-table/data-table.model';

columns: TableColumn<YourType>[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    align: 'end'
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    align: 'start'
  },
  {
    key: 'createdAt',
    label: 'Created At',
    sortable: true,
    align: 'center',
    formatter: (value: string) => new Date(value).toLocaleDateString()
  }
];
```

### 2. Create a Store

The component works with any store that implements the `PaginatedSearchStore` interface:

```typescript
import { createPaginatedSearchStore } from '../../shared/stores/paginated-search-store';

export const YourStore = createPaginatedSearchStore({
  storageKey: 'your-feature-search-state',
  initialSort: {
    column: 'name',
    direction: 'asc',
  },
});
```

### 3. Use the Component in Your Template

```html
<app-data-table
  [columns]="columns"
  [items]="items()"
  [store]="store"
  [collectionSize]="totalCount()"
  [trackBy]="trackById"
  (reload)="loadData()">

  <!-- Optional: Custom cell template -->
  <ng-template #cellTemplate let-item let-column="column" let-value="value">
    @if (column.key === 'status') {
      <span class="badge bg-success">{{ value }}</span>
    } @else {
      {{ value }}
    }
  </ng-template>

  <!-- Optional: Custom actions template -->
  <ng-template #actionsTemplate let-item>
    <button class="btn btn-sm btn-secondary" (click)="edit(item)">
      <i class="bi bi-pencil"></i>
    </button>
  </ng-template>
</app-data-table>
```

## Column Configuration Options

### TableColumn<T> Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | string | Yes | Unique identifier for the column (used for sorting) |
| `label` | string | Yes | Display text for the column header |
| `sortable` | boolean | No | Whether the column can be sorted (default: false) |
| `align` | 'start' \| 'center' \| 'end' | No | Text alignment (default: 'start') |
| `formatter` | (value: any, row: T) => string | No | Function to format the cell value |
| `accessor` | (row: T) => any | No | Custom function to extract value from row |

### Examples

#### Simple Column
```typescript
{ key: 'name', label: 'Name', sortable: true }
```

#### Column with Formatter
```typescript
{
  key: 'price',
  label: 'Price',
  sortable: true,
  align: 'end',
  formatter: (value: number) => `$${value.toFixed(2)}`
}
```

#### Column with Custom Accessor
```typescript
{
  key: 'fullName',
  label: 'Full Name',
  sortable: false,
  accessor: (user) => `${user.firstName} ${user.lastName}`
}
```

## Template Customization

### Cell Template

Use the `#cellTemplate` to customize how cells are rendered:

```html
<ng-template #cellTemplate let-item let-column="column" let-value="value" let-index="index">
  @if (column.key === 'status') {
    @if (value === 'active') {
      <span class="badge bg-success">Active</span>
    } @else {
      <span class="badge bg-secondary">Inactive</span>
    }
  } @else if (column.key === 'code') {
    <strong class="numeric">{{ value }}</strong>
  } @else {
    {{ value }}
  }
</ng-template>
```

**Template Context:**
- `$implicit` (or `let-item`): The row data
- `column`: The column definition
- `value`: The cell value
- `index`: The row index

### Actions Template

Use the `#actionsTemplate` to add custom action buttons:

```html
<ng-template #actionsTemplate let-item let-index="index">
  <div class="btn-group btn-group-sm" role="group">
    <button class="btn btn-secondary" [routerLink]="['/items', item.id, 'edit']">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-danger" (click)="delete(item)">
      <i class="bi bi-trash"></i>
    </button>
  </div>
</ng-template>
```

**Template Context:**
- `$implicit` (or `let-item`): The row data
- `index`: The row index

## Component Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `columns` | TableColumn<T>[] | Yes | Column definitions |
| `items` | T[] | Yes | Data items to display |
| `store` | PaginatedSearchStore | Yes | Store for pagination/sorting state |
| `collectionSize` | number | Yes | Total number of items (for pagination) |
| `trackBy` | (index, item) => any | No | Track by function for ngFor (default: by index) |
| `loading` | boolean | No | Show loading state (default: false) |
| `error` | boolean | No | Show error state (default: false) |
| `errorMessage` | string | No | Error message to display |
| `loadingMessage` | string | No | Loading message to display |

## Component Outputs

| Output | Type | Description |
|--------|------|-------------|
| `reload` | void | Emitted when data needs to be reloaded (after sort/page change) |

## Features

### Automatic Sorting
The component automatically handles column sorting:
- Click column headers to sort
- Clicking cycles through: asc → desc → none
- Calls `store.setSort()` and emits `reload` event

### Active Row Highlighting
The component manages active row state internally:
- Clicking a row highlights it
- Uses `table-primary` Bootstrap class
- Useful for showing selected items

### Pagination
Built-in pagination using ng-bootstrap:
- Page size controls
- Page navigation
- Integrates with store state

### Loading & Error States
Automatic handling of loading and error states:
- Shows spinner during loading
- Shows error message on failure
- Uses `@defer`, `@loading`, and `@error` blocks

## Complete Example

See `src/app/features/funds/fund-list.ts` for a complete working example.

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { DataTable } from '../../shared/components/data-table/data-table';
import { TableColumn } from '../../shared/components/data-table/data-table.model';

@Component({
  selector: 'app-example-list',
  imports: [DataTable],
  template: `
    <app-data-table
      [columns]="columns"
      [items]="items()"
      [store]="store"
      [collectionSize]="totalCount()"
      [trackBy]="trackById"
      (reload)="loadData()">
      
      <ng-template #cellTemplate let-item let-column="column" let-value="value">
        {{ value }}
      </ng-template>
      
      <ng-template #actionsTemplate let-item>
        <button class="btn btn-sm btn-secondary">Edit</button>
      </ng-template>
    </app-data-table>
  `
})
export class ExampleList {
  store = inject(ExampleStore);
  
  items = signal<Item[]>([]);
  totalCount = computed(() => this.items().length);
  
  columns: TableColumn<Item>[] = [
    { key: 'name', label: 'Name', sortable: true }
  ];
  
  loadData(): void {
    // Load data from service
  }
  
  trackById(index: number, item: Item): number {
    return item.id;
  }
}
```

## Best Practices

1. **Use formatters for common patterns**: Date formatting, currency, etc.
2. **Keep cell templates simple**: Complex logic should be in the component
3. **Use trackBy with unique identifiers**: For better performance
4. **Define columns as class properties**: For better type inference
5. **Handle loading/error states**: Set appropriate inputs for user feedback

## Migration Guide

To migrate an existing table to use DataTable:

1. Extract column definitions from your template
2. Replace table HTML with `<app-data-table>`
3. Move cell rendering logic to `#cellTemplate`
4. Move action buttons to `#actionsTemplate`
5. Remove manual sorting/pagination logic (handled by component)
6. Update tests to reflect new structure
