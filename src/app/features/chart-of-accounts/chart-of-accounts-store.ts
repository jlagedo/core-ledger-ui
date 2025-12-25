import {signalStore, withState, withMethods, patchState, withHooks} from '@ngrx/signals';

type AccountSearchState = {
  searchTerm: string;
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

const STORAGE_KEY = 'chart-of-accounts-search-state';

const initialState: AccountSearchState = {
  searchTerm: '',
  page: 1,
  pageSize: 15,
  sortColumn: 'code',
  sortDirection: 'desc'
}

function loadStateFromSession(): AccountSearchState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const loadedState = { ...initialState, ...JSON.parse(stored) };
      console.log('[ChartOfAccountsStore] Loaded state from sessionStorage:', loadedState);
      return loadedState;
    }
  } catch (error) {
    console.error('Failed to load chart of accounts state from sessionStorage:', error);
  }
  console.log('[ChartOfAccountsStore] Using initial state (no stored state found)');
  return initialState;
}

function saveStateToSession(state: AccountSearchState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('[ChartOfAccountsStore] Saved state to sessionStorage:', state);
  } catch (error) {
    console.error('Failed to save chart of accounts state to sessionStorage:', error);
  }
}

export const ChartOfAccountsStore = signalStore(
  withState(initialState),
  withMethods((store) => {
    const saveCurrentState = () => {
      const state: AccountSearchState = {
        searchTerm: store.searchTerm(),
        page: store.page(),
        pageSize: store.pageSize(),
        sortColumn: store.sortColumn(),
        sortDirection: store.sortDirection()
      };
      saveStateToSession(state);
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
        patchState(store, { sortColumn: 'code', sortDirection: 'desc', page: 1 });
        saveCurrentState();
      }
    };
  }),
  withHooks({
    onInit(store) {
      const savedState = loadStateFromSession();
      patchState(store, savedState);
    }
  })
);
