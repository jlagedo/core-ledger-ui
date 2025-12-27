import { createPaginatedSearchStore } from '../../shared/stores/paginated-search-store';

export const ChartOfAccountsStore = createPaginatedSearchStore({
  storageKey: 'chart-of-accounts-search-state',
  initialSort: {
    column: 'code',
    direction: 'desc',
  },
});
