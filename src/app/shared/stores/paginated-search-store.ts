import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';
import { LoggerService } from '../../services/logger';

export type PaginatedSearchState = {
  searchTerm: string;
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
};

export interface PaginatedSearchStoreConfig {
  storageKey: string;
  initialSort: {
    column: string;
    direction: 'asc' | 'desc';
  };
  defaultPageSize?: number;
}

/**
 * Creates a paginated search store with session storage persistence
 */
export function createPaginatedSearchStore(config: PaginatedSearchStoreConfig) {
  const { storageKey, initialSort, defaultPageSize = 15 } = config;

  const initialState: PaginatedSearchState = {
    searchTerm: '',
    page: 1,
    pageSize: defaultPageSize,
    sortColumn: initialSort.column,
    sortDirection: initialSort.direction,
  };

  function loadStateFromSession(logger: LoggerService): PaginatedSearchState {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const loadedState = { ...initialState, ...JSON.parse(stored) };
        logger.debug('Loaded state from sessionStorage', loadedState, storageKey);
        return loadedState;
      }
    } catch (error) {
      logger.warn('Failed to load state from sessionStorage', error, storageKey);
    }
    logger.debug('Using initial state (no stored state found)', undefined, storageKey);
    return initialState;
  }

  function saveStateToSession(state: PaginatedSearchState, logger: LoggerService): void {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
      logger.debug('Saved state to sessionStorage', state, storageKey);
    } catch (error) {
      logger.warn('Failed to save state to sessionStorage', error, storageKey);
    }
  }

  return signalStore(
    withState(initialState),
    withMethods((store) => {
      const logger = inject(LoggerService);

      const saveCurrentState = () => {
        const state: PaginatedSearchState = {
          searchTerm: store.searchTerm(),
          page: store.page(),
          pageSize: store.pageSize(),
          sortColumn: store.sortColumn(),
          sortDirection: store.sortDirection(),
        };
        saveStateToSession(state, logger);
      };

      return {
        setSearchTerm(searchTerm: string) {
          patchState(store, { searchTerm, page: 1 });
          saveCurrentState();
        },
        setPage(page: number) {
          patchState(store, { page });
          saveCurrentState();
        },
        setPageSize(pageSize: number) {
          patchState(store, { pageSize, page: 1 });
          saveCurrentState();
        },
        setSort(sortColumn: string, sortDirection: 'asc' | 'desc') {
          patchState(store, { sortColumn, sortDirection, page: 1 });
          saveCurrentState();
        },
        resetSort() {
          patchState(store, {
            sortColumn: initialSort.column,
            sortDirection: initialSort.direction,
            page: 1,
          });
          saveCurrentState();
        },
      };
    }),
    withHooks({
      onInit(store) {
        const logger = inject(LoggerService);
        const savedState = loadStateFromSession(logger);
        patchState(store, savedState);
      },
    })
  );
}
