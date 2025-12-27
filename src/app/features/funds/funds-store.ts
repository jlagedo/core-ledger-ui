import { createPaginatedSearchStore } from '../../shared/stores/paginated-search-store';

export const FundsStore = createPaginatedSearchStore({
  storageKey: 'funds-search-state',
  initialSort: {
    column: 'Name',
    direction: 'asc',
  },
});
