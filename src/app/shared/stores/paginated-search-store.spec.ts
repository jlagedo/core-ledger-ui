import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';
import {createPaginatedSearchStore, PaginatedSearchState} from './paginated-search-store';
import {LoggerService} from '../../services/logger';

describe('PaginatedSearchStore', () => {
  type StoreInstance = InstanceType<ReturnType<typeof createPaginatedSearchStore>>;
  let store: StoreInstance;
  let sessionStorageSpy: any;
  let loggerService: any;

  beforeEach(() => {
    // Mock sessionStorage
    let storage: { [key: string]: string } = {};
    sessionStorageSpy = vi.spyOn(sessionStorage, 'getItem').mockImplementation((key: string) => storage[key] || null);
    vi.spyOn(sessionStorage, 'setItem').mockImplementation((key: string, value: string) => {
      storage[key] = value;
      return undefined;
    });
    vi.spyOn(sessionStorage, 'clear').mockImplementation(() => {
      storage = {};
      return undefined;
    });

    // Create mock logger
    loggerService = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: LoggerService, useValue: loggerService}
      ]
    });

    const StoreClass = createPaginatedSearchStore({
      storageKey: 'test-store',
      initialSort: {column: 'name', direction: 'asc'},
      defaultPageSize: 20
    });

    store = new StoreClass();
  });

  it('should initialize with default state', () => {
    expect(store.searchTerm()).toBe('');
    expect(store.page()).toBe(1);
    expect(store.pageSize()).toBe(20);
    expect(store.sortColumn()).toBe('name');
    expect(store.sortDirection()).toBe('asc');
  });

  it('should set search term and reset page to 1', () => {
    store.setSearchTerm('test');
    expect(store.searchTerm()).toBe('test');
    expect(store.page()).toBe(1);
  });

  it('should set page', () => {
    store.setPage(3);
    expect(store.page()).toBe(3);
  });

  it('should set page size and reset page to 1', () => {
    store.setPage(5);
    store.setPageSize(50);
    expect(store.pageSize()).toBe(50);
    expect(store.page()).toBe(1);
  });

  it('should set sort and reset page to 1', () => {
    store.setPage(5);
    store.setSort('age', 'desc');
    expect(store.sortColumn()).toBe('age');
    expect(store.sortDirection()).toBe('desc');
    expect(store.page()).toBe(1);
  });

  it('should reset sort to initial values', () => {
    store.setSort('age', 'desc');
    store.setPage(5);

    store.resetSort();

    expect(store.sortColumn()).toBe('name');
    expect(store.sortDirection()).toBe('asc');
    expect(store.page()).toBe(1);
  });

  it('should save state to sessionStorage', () => {
    store.setSearchTerm('test');
    store.setPage(2);
    store.setSort('age', 'desc');

    expect(sessionStorage.setItem).toHaveBeenCalled();

    const calls = (sessionStorage.setItem as any).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toBe('test-store');
    expect(lastCall[1]).toContain('"sortColumn":"age"');
  });

  it('should load state from sessionStorage on init', () => {
    const savedState: PaginatedSearchState = {
      searchTerm: 'saved',
      page: 3,
      pageSize: 30,
      sortColumn: 'date',
      sortDirection: 'desc'
    };

    sessionStorage.setItem('test-store-2', JSON.stringify(savedState));

    const StoreClass = createPaginatedSearchStore({
      storageKey: 'test-store-2',
      initialSort: {column: 'name', direction: 'asc'},
      defaultPageSize: 20
    });

    const newStore = new StoreClass();

    expect(newStore.searchTerm()).toBe('saved');
    expect(newStore.page()).toBe(3);
    expect(newStore.pageSize()).toBe(30);
    expect(newStore.sortColumn()).toBe('date');
    expect(newStore.sortDirection()).toBe('desc');
  });

  it('should use initial state if sessionStorage is empty', () => {
    sessionStorageSpy.mockReturnValue(null);

    const StoreClass = createPaginatedSearchStore({
      storageKey: 'empty-store',
      initialSort: {column: 'id', direction: 'desc'},
      defaultPageSize: 10
    });

    const newStore = new StoreClass();

    expect(newStore.searchTerm()).toBe('');
    expect(newStore.page()).toBe(1);
    expect(newStore.pageSize()).toBe(10);
    expect(newStore.sortColumn()).toBe('id');
    expect(newStore.sortDirection()).toBe('desc');
  });

  it('should handle sessionStorage errors gracefully', () => {
    sessionStorageSpy.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const StoreClass = createPaginatedSearchStore({
      storageKey: 'error-store',
      initialSort: {column: 'name', direction: 'asc'}
    });

    const newStore = new StoreClass();

    // Should still initialize with default values
    expect(newStore.searchTerm()).toBe('');
    expect(newStore.page()).toBe(1);
    expect(newStore.sortColumn()).toBe('name');
  });
});
