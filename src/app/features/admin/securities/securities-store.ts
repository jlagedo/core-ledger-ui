import {createPaginatedSearchStore} from '../../../shared/stores/paginated-search-store';

export const SecuritiesStore = createPaginatedSearchStore({
  storageKey: 'securities-search-state',
  initialSort: {
    column: 'ticker',
    direction: 'asc',
  },
});
