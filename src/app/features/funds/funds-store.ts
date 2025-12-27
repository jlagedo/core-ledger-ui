import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';

type FundSearchState = {
    searchTerm: string;
    page: number;
    pageSize: number;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}

const STORAGE_KEY = 'funds-search-state';

const initialState: FundSearchState = {
    searchTerm: '',
    page: 1,
    pageSize: 15,
    sortColumn: 'name',
    sortDirection: 'asc'
}

function loadStateFromSession(): FundSearchState {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            const loadedState = { ...initialState, ...JSON.parse(stored) };
            console.log('[FundsStore] Loaded state from sessionStorage:', loadedState);
            return loadedState;
        }
    } catch (error) {
        console.error('Failed to load funds state from sessionStorage:', error);
    }
    console.log('[FundsStore] Using initial state (no stored state found)');
    return initialState;
}

function saveStateToSession(state: FundSearchState): void {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        console.log('[FundsStore] Saved state to sessionStorage:', state);
    } catch (error) {
        console.error('Failed to save funds state to sessionStorage:', error);
    }
}

export const FundsStore = signalStore(
    withState(initialState),
    withMethods((store) => {
        const saveCurrentState = () => {
            const state: FundSearchState = {
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
                patchState(store, { sortColumn: 'name', sortDirection: 'asc', page: 1 });
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
