import {createPaginatedSearchStore} from '../../shared/stores/paginated-search-store';

export const TransactionsStore = createPaginatedSearchStore({
  storageKey: 'transactions-capture-state',
  initialSort: {
    column: 'tradeDate',
    direction: 'desc',
  },
});
