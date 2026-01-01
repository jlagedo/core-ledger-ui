import { AccountsByTypeReportDto } from '../../models/account.model';

/**
 * Mock accounts by type report data for local development and testing.
 * Used for dashboard chart displaying account counts by type.
 * @internal
 */
export const MOCK_ACCOUNTS_BY_TYPE_REPORT: AccountsByTypeReportDto[] = [
    {
        typeId: 1,
        typeDescription: 'Asset',
        activeAccountCount: 3,
    },
    {
        typeId: 2,
        typeDescription: 'Liability',
        activeAccountCount: 2,
    },
    {
        typeId: 3,
        typeDescription: 'Equity',
        activeAccountCount: 2,
    },
    {
        typeId: 4,
        typeDescription: 'Revenue',
        activeAccountCount: 2,
    },
    {
        typeId: 5,
        typeDescription: 'Expense',
        activeAccountCount: 2,
    },
];
