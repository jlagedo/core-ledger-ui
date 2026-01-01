---
applyTo: "**/*-store.ts,src/app/shared/stores/**/*.ts"
---

# State Management & Store Instructions

## Store Types

### Feature Stores
Feature stores are simple and use the reusable `createPaginatedSearchStore` factory:

```typescript
import { createPaginatedSearchStore } from '../../shared/stores/paginated-search-store';

export const FundsStore = createPaginatedSearchStore({
  storageKey: 'funds-search-state',
  initialSort: {
    column: 'Name',
    direction: 'asc',
  },
});
```

### Service-Level Stores
Service stores use signals directly:

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Private writable signal
  private readonly _currentTheme = signal<'light' | 'dark'>('dark');
  
  // Public read-only signal
  readonly currentTheme = this._currentTheme.asReadonly();
  
  // Computed signal for derived state
  readonly isDarkMode = computed(() => this._currentTheme() === 'dark');
  
  // Methods to update state
  setTheme(theme: 'light' | 'dark'): void {
    this._currentTheme.set(theme);
  }
}
```

## Signal Best Practices

### DO
- ✅ Use `signal()` for writable state
- ✅ Use `computed()` for derived state
- ✅ Use `toSignal()` to convert observables to signals
- ✅ Expose read-only signals via `.asReadonly()`
- ✅ Use `update()` or `set()` to modify signal values
- ✅ Keep state transformations pure and predictable

### DON'T
- ❌ Use `mutate()` on signals (deprecated pattern)
- ❌ Expose writable signals directly from services
- ❌ Mix signals and BehaviorSubject in the same feature
- ❌ Use signals for async operations (use observables + toSignal)

## Paginated Search Store Pattern

The `createPaginatedSearchStore` factory provides:
- Search term management
- Pagination state (page, pageSize)
- Sorting state (column, direction)
- Session storage persistence
- Type-safe configuration

### Usage Example

```typescript
// 1. Create store
export const FundsStore = createPaginatedSearchStore({
  storageKey: 'funds-search-state',
  initialSort: { column: 'Name', direction: 'asc' },
});

// 2. Use in component
export class FundList {
  private readonly store = inject(FundsStore);
  
  // Access state
  searchTerm = this.store.searchTerm;
  currentPage = this.store.currentPage;
  sortColumn = this.store.sortColumn;
  sortDirection = this.store.sortDirection;
  
  // Update state
  onSearch(term: string) {
    this.store.setSearchTerm(term);
  }
  
  onPageChange(page: number) {
    this.store.setPage(page);
  }
  
  onSort(column: string, direction: 'asc' | 'desc') {
    this.store.setSort(column, direction);
  }
}
```

## State Management Patterns

### Local Component State
Use signals directly in components:
```typescript
export class MyComponent {
  readonly count = signal(0);
  readonly doubleCount = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(n => n + 1);
  }
}
```

### Service State
Use private writable signals with public read-only access:
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly _items = signal<Item[]>([]);
  readonly items = this._items.asReadonly();
  
  addItem(item: Item) {
    this._items.update(items => [...items, item]);
  }
}
```

### Observable to Signal
Use `toSignal()` for converting observables:
```typescript
export class MyService {
  private readonly http = inject(HttpClient);
  
  readonly user = toSignal(
    this.http.get<User>('/api/user'),
    { initialValue: null }
  );
}
```

## Storage Integration

Feature stores automatically persist to session storage:
- State saved on each update
- State restored on page reload
- Uses `SessionStorageService` abstraction
- Storage key defined in environment config

## Testing Stores

Use `InMemoryStorageService` for testing:
```typescript
it('should persist search state', () => {
  const storage = new InMemoryStorageService();
  const store = createPaginatedSearchStore({
    storageKey: 'test-state',
    storage,
  });
  
  store.setSearchTerm('test');
  expect(storage.getItem('test-state')).toContain('test');
});
```

## @ngrx/signals Best Practices

- Use `signalStore()` for complex state management
- Use `withState()` for initial state
- Use `withComputed()` for derived state
- Use `withMethods()` for state updates
- Keep stores focused and single-purpose
- Avoid side effects in computed signals
