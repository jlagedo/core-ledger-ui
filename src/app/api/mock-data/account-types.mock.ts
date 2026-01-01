import { AccountType } from '../../models/account-type.model';

/**
 * Mock account type data for local development and testing.
 * @internal
 */
export const MOCK_ACCOUNT_TYPES: AccountType[] = [
    {
        id: '1',
        description: 'Asset',
    },
    {
        id: '2',
        description: 'Liability',
    },
    {
        id: '3',
        description: 'Equity',
    },
    {
        id: '4',
        description: 'Revenue',
    },
    {
        id: '5',
        description: 'Expense',
    },
];
