import { IDatasource, IGetRowsParams } from 'ag-grid-community';
import { TransactionService } from '../../services/transaction';
import { LoggerService } from '../../services/logger';

export interface PaginationStats {
  totalCount: number;
  loadedCount: number;
  currentRangeStart: number;
  currentRangeEnd: number;
  isLoading: boolean;
}

export interface TransactionsDatasourceConfig {
  getSearchTerm: () => string;
  onPaginationUpdate?: (stats: PaginationStats) => void;
}

/**
 * Creates an AG Grid datasource for infinite scrolling of transactions.
 * Integrates with TransactionService to fetch paginated data.
 */
export function createTransactionsDatasource(
  transactionService: TransactionService,
  logger: LoggerService,
  config: TransactionsDatasourceConfig
): IDatasource {
  let totalLoadedRows = 0;

  return {
    getRows(params: IGetRowsParams): void {
      const { startRow, endRow, sortModel, successCallback, failCallback } = params;

      // Calculate limit and offset for API
      const limit = endRow - startRow;
      const offset = startRow;

      // Extract sort parameters from AG Grid sort model
      let sortBy: string | undefined;
      let sortDirection: 'asc' | 'desc' = 'desc';

      if (sortModel.length > 0) {
        sortBy = sortModel[0].colId;
        sortDirection = sortModel[0].sort as 'asc' | 'desc';
      }

      // Get search term from config
      const filter = config.getSearchTerm() || undefined;

      // Notify loading started
      config.onPaginationUpdate?.({
        totalCount: 0,
        loadedCount: totalLoadedRows,
        currentRangeStart: startRow,
        currentRangeEnd: endRow,
        isLoading: true,
      });

      // Fetch data from API
      transactionService
        .getTransactions(limit, offset, sortBy, sortDirection, filter)
        .subscribe({
          next: (response) => {
            // Calculate lastRow for infinite scroll termination
            // If we've received all items, set lastRow to totalCount
            // Otherwise, set to -1 to indicate more rows may be available
            const lastRow = response.totalCount <= endRow ? response.totalCount : -1;

            // Track total loaded rows
            totalLoadedRows = Math.max(totalLoadedRows, endRow);
            if (lastRow !== -1) {
              totalLoadedRows = response.totalCount;
            }

            // Notify pagination update
            config.onPaginationUpdate?.({
              totalCount: response.totalCount,
              loadedCount: Math.min(totalLoadedRows, response.totalCount),
              currentRangeStart: startRow + 1,
              currentRangeEnd: Math.min(endRow, response.totalCount),
              isLoading: false,
            });

            successCallback(response.items, lastRow);
          },
          error: (err) => {
            logger.logHttpError('load transactions', err, 'Failed to load transactions');
            config.onPaginationUpdate?.({
              totalCount: 0,
              loadedCount: 0,
              currentRangeStart: 0,
              currentRangeEnd: 0,
              isLoading: false,
            });
            failCallback();
          },
        });
    },
  };
}
