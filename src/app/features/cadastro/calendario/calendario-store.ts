import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { LoggerService } from '../../../services/logger';
import { SessionStorageService } from '../../../shared/storage/session-storage.service';
import { StorageService } from '../../../shared/storage/storage.interface';
import { TipoDia, Praca } from '../../../models/calendario.model';

/**
 * Filter model for calendario quick filters
 */
export interface CalendarioFilters {
  praca: Praca | null;
  tipoDia: TipoDia | null;
  diaUtil: boolean | null;
  dataInicio: string | null; // ISO date string
  dataFim: string | null; // ISO date string
}

export interface CalendarioSearchState {
  searchTerm: string;
  filters: CalendarioFilters;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

const STORAGE_KEY = 'calendario-search-state';

const initialFilters: CalendarioFilters = {
  praca: null,
  tipoDia: null,
  diaUtil: null,
  dataInicio: null,
  dataFim: null,
};

const initialState: CalendarioSearchState = {
  searchTerm: '',
  filters: initialFilters,
  sortColumn: 'data',
  sortDirection: 'desc',
};

function loadStateFromSession(
  logger: LoggerService,
  storage: StorageService
): CalendarioSearchState {
  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const loadedState = {
        ...initialState,
        ...parsed,
        filters: { ...initialFilters, ...parsed.filters },
      };
      logger.debug('Loaded calendario state from sessionStorage', loadedState, STORAGE_KEY);
      return loadedState;
    }
  } catch (error) {
    logger.warn('Failed to load calendario state from sessionStorage', error, STORAGE_KEY);
  }
  return initialState;
}

function saveStateToSession(
  state: CalendarioSearchState,
  logger: LoggerService,
  storage: StorageService
): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    logger.debug('Saved calendario state to sessionStorage', state, STORAGE_KEY);
  } catch (error) {
    logger.warn('Failed to save calendario state to sessionStorage', error, STORAGE_KEY);
  }
}

export const CalendarioStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    /**
     * Check if any filter is active
     */
    hasActiveFilters: computed(() => {
      const f = store.filters();
      return (
        f.praca !== null ||
        f.tipoDia !== null ||
        f.diaUtil !== null ||
        f.dataInicio !== null ||
        f.dataFim !== null ||
        store.searchTerm().trim() !== ''
      );
    }),

    /**
     * Count of active filters (excluding search term)
     */
    activeFilterCount: computed(() => {
      const f = store.filters();
      let count = 0;
      if (f.praca !== null) count++;
      if (f.tipoDia !== null) count++;
      if (f.diaUtil !== null) count++;
      if (f.dataInicio !== null || f.dataFim !== null) count++;
      return count;
    }),

    /**
     * Build filter params for API call
     */
    filterParams: computed(() => {
      const params: Record<string, string> = {};
      const f = store.filters();
      const search = store.searchTerm().trim();

      if (search) {
        params['search'] = search;
      }
      if (f.praca !== null) {
        params['praca'] = f.praca.toString();
      }
      if (f.tipoDia !== null) {
        params['tipoDia'] = f.tipoDia.toString();
      }
      if (f.diaUtil !== null) {
        params['diaUtil'] = f.diaUtil.toString();
      }
      if (f.dataInicio) {
        params['dataInicio'] = f.dataInicio;
      }
      if (f.dataFim) {
        params['dataFim'] = f.dataFim;
      }

      return params;
    }),
  })),
  withMethods((store) => {
    const logger = inject(LoggerService);
    const storage = inject(SessionStorageService);

    const saveCurrentState = () => {
      const state: CalendarioSearchState = {
        searchTerm: store.searchTerm(),
        filters: store.filters(),
        sortColumn: store.sortColumn(),
        sortDirection: store.sortDirection(),
      };
      saveStateToSession(state, logger, storage);
    };

    return {
      setSearchTerm(searchTerm: string) {
        patchState(store, { searchTerm });
        saveCurrentState();
      },

      setSort(sortColumn: string, sortDirection: 'asc' | 'desc') {
        patchState(store, { sortColumn, sortDirection });
        saveCurrentState();
      },

      setFilter<K extends keyof CalendarioFilters>(key: K, value: CalendarioFilters[K]) {
        patchState(store, {
          filters: { ...store.filters(), [key]: value },
        });
        saveCurrentState();
      },

      setFilters(filters: Partial<CalendarioFilters>) {
        patchState(store, {
          filters: { ...store.filters(), ...filters },
        });
        saveCurrentState();
      },

      clearFilter<K extends keyof CalendarioFilters>(key: K) {
        patchState(store, {
          filters: { ...store.filters(), [key]: null },
        });
        saveCurrentState();
      },

      clearAllFilters() {
        patchState(store, {
          searchTerm: '',
          filters: initialFilters,
        });
        saveCurrentState();
      },

      resetSort() {
        patchState(store, {
          sortColumn: 'data',
          sortDirection: 'desc',
        });
        saveCurrentState();
      },
    };
  }),
  withHooks({
    onInit(store) {
      const logger = inject(LoggerService);
      const storage = inject(SessionStorageService);
      const savedState = loadStateFromSession(logger, storage);
      patchState(store, savedState);
    },
  })
);
